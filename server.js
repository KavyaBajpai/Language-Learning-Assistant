const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

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

app.post('/api/process-speech', async (req, res) => {
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
    if (jsonMatch) {
      const parsedResponse = JSON.parse(jsonMatch[0]);
      res.json(parsedResponse);
    } else {
      // Fallback if JSON parsing fails
      res.json({
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
      });
    }
    
  } catch (error) {
    console.error('Error processing speech:', error);
    res.status(500).json({ error: 'Failed to process speech' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
