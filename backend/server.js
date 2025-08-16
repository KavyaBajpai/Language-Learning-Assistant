const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend/public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/language-learning-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// MongoDB Schemas and Models
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  nativeLanguage: {
    type: String,
    default: 'English'
  },
  learningLanguages: [{
    language: String,
    proficiency: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    totalSessions: {
      type: Number,
      default: 0
    },
    averageFluencyScore: {
      type: Number,
      default: 0
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  language: {
    type: String,
    required: true
  },
  originalText: {
    type: String,
    required: true
  },
  correctedText: {
    type: String,
    required: true
  },
  mistakes: String,
  fluencyScore: {
    type: Number,
    min: 0,
    max: 100
  },
  aiResponse: String,
  vocabularyWords: [{
    word: String,
    translation: String,
    difficulty: String,
    usageExample: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const vocabularySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  language: {
    type: String,
    required: true
  },
  word: {
    type: String,
    required: true
  },
  translation: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  usageExample: String,
  reviewCount: {
    type: Number,
    default: 0
  },
  lastReviewed: {
    type: Date,
    default: Date.now
  },
  mastered: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model('User', userSchema);
const Session = mongoose.model('Session', sessionSchema);
const Vocabulary = mongoose.model('Vocabulary', vocabularySchema);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Language mapping for better prompts
const languageMap = {
  'french': 'French',
  'spanish': 'Spanish', 
  'german': 'German',
  'italian': 'Italian',
  'portuguese': 'Portuguese',
  'japanese': 'Japanese',
  'korean': 'Korean',
  'chinese': 'Chinese',
  'hindi': 'Hindi',
  'english': 'English'
};

// Authentication Middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, nativeLanguage } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this email or username already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      nativeLanguage: nativeLanguage || 'English'
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        nativeLanguage: user.nativeLanguage
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        nativeLanguage: user.nativeLanguage,
        learningLanguages: user.learningLanguages
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get User Profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update User Profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { nativeLanguage, learningLanguages } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { nativeLanguage, learningLanguages },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get User Statistics
app.get('/api/user/stats', authenticateToken, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user._id });
    const vocabulary = await Vocabulary.find({ userId: req.user._id });

    const stats = {
      totalSessions: sessions.length,
      totalVocabularyWords: vocabulary.length,
      masteredWords: vocabulary.filter(v => v.mastered).length,
      averageFluencyScore: sessions.length > 0 
        ? sessions.reduce((sum, session) => sum + (session.fluencyScore || 0), 0) / sessions.length 
        : 0,
      languagesPracticed: [...new Set(sessions.map(s => s.language))],
      recentSessions: sessions.slice(-5).reverse()
    };

    res.json(stats);
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get User Vocabulary
app.get('/api/user/vocabulary', authenticateToken, async (req, res) => {
  try {
    const { language } = req.query;
    const filter = { userId: req.user._id };
    
    if (language) {
      filter.language = language;
    }

    const vocabulary = await Vocabulary.find(filter).sort({ lastReviewed: -1 });
    res.json(vocabulary);
  } catch (error) {
    console.error('Vocabulary fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch vocabulary' });
  }
});

// Update Vocabulary Review
app.put('/api/user/vocabulary/:wordId', authenticateToken, async (req, res) => {
  try {
    const { reviewCount, mastered } = req.body;
    
    const vocabulary = await Vocabulary.findOneAndUpdate(
      { _id: req.params.wordId, userId: req.user._id },
      { 
        reviewCount: reviewCount || 0,
        mastered: mastered || false,
        lastReviewed: new Date()
      },
      { new: true }
    );

    if (!vocabulary) {
      return res.status(404).json({ error: 'Vocabulary word not found' });
    }

    res.json(vocabulary);
  } catch (error) {
    console.error('Vocabulary update error:', error);
    res.status(500).json({ error: 'Failed to update vocabulary' });
  }
});

// Process Speech with Database Integration (Authenticated)
app.post('/api/process-speech', authenticateToken, async (req, res) => {
  try {
    const { text, language } = req.body;
    
    if (!text || !language) {
      return res.status(400).json({ error: 'Text and language are required' });
    }

    const targetLanguage = languageMap[language.toLowerCase()] || language;
    
    // Create prompt for Gemini
    const prompt = `You are a helpful language tutor. The user said: "${text}" in ${targetLanguage}.

Please provide a JSON response with the following structure:
{
  "original": "user's original text",
  "corrected": "grammatically correct version",
  "mistakes": "brief description of mistakes (e.g., 'voules → voudrais')",
  "response": "natural conversational response in ${targetLanguage}",
  "translation_user": "English translation of user's text",
  "translation_response": "English translation of your response",
  "fluency_score": 85,
  "vocabulary_words": [
    {
      "word": "example_word",
      "translation": "English translation",
      "difficulty": "beginner/intermediate/advanced",
      "usage_example": "Example sentence in ${targetLanguage}"
    }
  ]
}

Focus on:
1. Correcting grammar and vocabulary mistakes
2. Providing a natural, helpful response
3. Accurate translations
4. Highlighting specific mistakes clearly
5. Giving a fluency score (0-100) based on grammar, pronunciation accuracy, and naturalness
6. Suggesting 3-5 relevant vocabulary words from the user's speech or related to the topic, including difficulty level and usage examples`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();
    
    // Extract JSON from the response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    let parsedResponse;
    
    if (jsonMatch) {
      parsedResponse = JSON.parse(jsonMatch[0]);
    } else {
      // Fallback if JSON parsing fails
      parsedResponse = {
        original: text,
        corrected: text,
        mistakes: "No corrections needed",
        response: "Thank you for practicing!",
        translation_user: text,
        translation_response: "Thank you for practicing!",
        fluency_score: 90,
        vocabulary_words: [
          {
            word: "practice",
            translation: "practice",
            difficulty: "beginner",
            usage_example: "Let's practice together."
          }
        ]
      };
    }

    // Save session to database
    const session = new Session({
      userId: req.user._id,
      language: language.toLowerCase(),
      originalText: parsedResponse.original,
      correctedText: parsedResponse.corrected,
      mistakes: parsedResponse.mistakes,
      fluencyScore: parsedResponse.fluency_score,
      aiResponse: parsedResponse.response,
      vocabularyWords: parsedResponse.vocabulary_words
    });

    await session.save();

    // Save vocabulary words to database
    if (parsedResponse.vocabulary_words && parsedResponse.vocabulary_words.length > 0) {
      for (const vocabWord of parsedResponse.vocabulary_words) {
        // Check if word already exists for this user and language
        const existingWord = await Vocabulary.findOne({
          userId: req.user._id,
          language: language.toLowerCase(),
          word: vocabWord.word
        });

        if (!existingWord) {
          const vocabulary = new Vocabulary({
            userId: req.user._id,
            language: language.toLowerCase(),
            word: vocabWord.word,
            translation: vocabWord.translation,
            difficulty: vocabWord.difficulty,
            usageExample: vocabWord.usage_example
          });
          await vocabulary.save();
        }
      }
    }

    // Update user's learning language statistics
    const userLearningLang = req.user.learningLanguages.find(
      lang => lang.language === language.toLowerCase()
    );

    if (userLearningLang) {
      userLearningLang.totalSessions += 1;
      userLearningLang.averageFluencyScore = 
        (userLearningLang.averageFluencyScore * (userLearningLang.totalSessions - 1) + parsedResponse.fluency_score) / 
        userLearningLang.totalSessions;
    } else {
      req.user.learningLanguages.push({
        language: language.toLowerCase(),
        totalSessions: 1,
        averageFluencyScore: parsedResponse.fluency_score
      });
    }

    await req.user.save();

    res.json(parsedResponse);
    
  } catch (error) {
    console.error('Error processing speech:', error);
    res.status(500).json({ error: 'Failed to process speech' });
  }
});

// Process Speech without Authentication (for testing)
app.post('/api/process-speech-test', async (req, res) => {
  try {
    const { text, language } = req.body;
    
    if (!text || !language) {
      return res.status(400).json({ error: 'Text and language are required' });
    }

    const targetLanguage = languageMap[language.toLowerCase()] || language;
    
    // Create prompt for Gemini
    const prompt = `You are a helpful language tutor. The user said: "${text}" in ${targetLanguage}.

Please provide a JSON response with the following structure:
{
  "original": "user's original text",
  "corrected": "grammatically correct version",
  "mistakes": "brief description of mistakes (e.g., 'voules → voudrais')",
  "response": "natural conversational response in ${targetLanguage}",
  "translation_user": "English translation of user's text",
  "translation_response": "English translation of your response",
  "fluency_score": 85,
  "vocabulary_words": [
    {
      "word": "example_word",
      "translation": "English translation",
      "difficulty": "beginner/intermediate/advanced",
      "usage_example": "Example sentence in ${targetLanguage}"
    }
  ]
}

Focus on:
1. Correcting grammar and vocabulary mistakes
2. Providing a natural, helpful response
3. Accurate translations
4. Highlighting specific mistakes clearly
5. Giving a fluency score (0-100) based on grammar, pronunciation accuracy, and naturalness
6. Suggesting 3-5 relevant vocabulary words from the user's speech or related to the topic, including difficulty level and usage examples`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();
    
    // Extract JSON from the response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    let parsedResponse;
    
    if (jsonMatch) {
      parsedResponse = JSON.parse(jsonMatch[0]);
    } else {
      // Fallback if JSON parsing fails
      parsedResponse = {
        original: text,
        corrected: text,
        mistakes: "No corrections needed",
        response: "Thank you for practicing!",
        translation_user: text,
        translation_response: "Thank you for practicing!",
        fluency_score: 90,
        vocabulary_words: [
          {
            word: "practice",
            translation: "practice",
            difficulty: "beginner",
            usage_example: "Let's practice together."
          }
        ]
      };
    }

    res.json(parsedResponse);
    
  } catch (error) {
    console.error('Error processing speech:', error);
    res.status(500).json({ error: 'Failed to process speech' });
  }
});

// Get User Sessions
app.get('/api/user/sessions', authenticateToken, async (req, res) => {
  try {
    const { language, limit = 20 } = req.query;
    const filter = { userId: req.user._id };
    
    if (language) {
      filter.language = language.toLowerCase();
    }

    const sessions = await Session.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(sessions);
  } catch (error) {
    console.error('Sessions fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('MongoDB integration active');
});
