# Language Learning Assistant with MongoDB Integration

A full-stack AI-powered language learning web app with user authentication, database storage, and progress tracking. Built with Node.js, Express, MongoDB, and vanilla JavaScript.

## 🚀 Features

### Core Language Learning
- **Speech Recognition**: Real-time speech-to-text using Web Speech API
- **AI-Powered Feedback**: Grammar corrections and fluency scoring via Gemini API
- **Multi-Language Support**: 10 languages (French, Spanish, German, Italian, Portuguese, Japanese, Korean, Chinese, Hindi, English)
- **Audio Output**: Text-to-speech for AI responses
- **Vocabulary Learning**: AI-suggested vocabulary with difficulty levels and examples

### User Management & Database
- **User Authentication**: JWT-based login/registration system
- **Progress Tracking**: Session history and fluency score analytics
- **Vocabulary Management**: Personal vocabulary lists with review tracking
- **Learning Statistics**: Comprehensive user progress dashboard
- **Data Persistence**: MongoDB database for all user data

## 🏗️ Project Structure

```
Language Assistant/
├── backend/
│   ├── server.js              # Main server with MongoDB integration
│   ├── package.json           # Backend dependencies
│   └── env.example           # Environment variables template
├── frontend/
│   ├── public/
│   │   ├── index.html        # Main HTML file
│   │   ├── css/
│   │   │   └── styles.css    # Application styles
│   │   └── js/
│   │       └── app.js        # Main application entry point
│   └── src/
│       ├── components/
│       │   ├── AuthComponent.js    # Authentication UI
│       │   └── ResultDisplay.js    # Results display
│       ├── services/
│       │   └── apiService.js       # API communication
│       ├── config/
│       │   └── languages.js        # Language configurations
│       └── utils/
│           └── fluencyHelper.js    # Fluency utilities
└── README.md
```

## 📋 Prerequisites

- **Node.js** (version 14 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Gemini API Key** from Google AI Studio
- **Modern Browser** with speech recognition support (Chrome, Edge, Safari)

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (if any)
cd ../frontend
npm install  # (if you add a package.json later)
```

### 2. MongoDB Setup

#### Option A: Local MongoDB
1. **Install MongoDB** on your system
2. **Start MongoDB service**:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string

### 3. Environment Configuration

```bash
# Copy environment template
cp backend/env.example backend/.env

# Edit .env file with your settings
```

**Required Environment Variables:**
```env
# API Keys
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/language-learning-app

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here

# Optional: MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/language-learning-app
```

### 4. Start the Application

```bash
# Start backend server
cd backend
npm start

# Or for development with auto-restart
npm run dev
```

### 5. Access the Application

Open your browser and go to: `http://localhost:3000`

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  nativeLanguage: String,
  learningLanguages: [{
    language: String,
    proficiency: String (beginner/intermediate/advanced),
    totalSessions: Number,
    averageFluencyScore: Number
  }],
  createdAt: Date
}
```

### Session Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  language: String,
  originalText: String,
  correctedText: String,
  mistakes: String,
  fluencyScore: Number (0-100),
  aiResponse: String,
  vocabularyWords: [{
    word: String,
    translation: String,
    difficulty: String,
    usageExample: String
  }],
  createdAt: Date
}
```

### Vocabulary Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  language: String,
  word: String,
  translation: String,
  difficulty: String (beginner/intermediate/advanced),
  usageExample: String,
  reviewCount: Number,
  lastReviewed: Date,
  mastered: Boolean
}
```

## 🔐 Authentication System

### Registration
- **Endpoint**: `POST /api/auth/register`
- **Body**: `{ username, email, password, nativeLanguage }`
- **Response**: JWT token and user data

### Login
- **Endpoint**: `POST /api/auth/login`
- **Body**: `{ email, password }`
- **Response**: JWT token and user data

### Protected Routes
All learning-related endpoints require authentication via JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/stats` - Get user statistics

### Learning
- `POST /api/process-speech` - Process speech and get AI feedback
- `GET /api/user/sessions` - Get learning session history
- `GET /api/user/vocabulary` - Get user vocabulary
- `PUT /api/user/vocabulary/:wordId` - Update vocabulary review status

## 🎯 Usage Flow

1. **Registration/Login**: Create account or sign in
2. **Dashboard**: View learning statistics and progress
3. **Start Learning**: Begin speech practice session
4. **Speech Input**: Speak in selected language
5. **AI Feedback**: Receive corrections, fluency score, and vocabulary
6. **Progress Tracking**: View session history and vocabulary mastery
7. **Review**: Revisit vocabulary words and track improvement

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Auto-restart on file changes
```

### Frontend Development
The frontend uses vanilla JavaScript with ES6 modules. No build process required.

### Database Management
```bash
# Connect to MongoDB shell
mongosh

# Switch to database
use language-learning-app

# View collections
show collections

# Query data
db.users.find()
db.sessions.find()
db.vocabulary.find()
```

## 🚨 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB service is running
- Check connection string in `.env` file
- Verify network access for Atlas connections

### Authentication Issues
- Check JWT_SECRET in environment variables
- Ensure proper token format in Authorization header
- Verify user exists in database

### Speech Recognition Issues
- Use supported browser (Chrome, Edge, Safari)
- Grant microphone permissions
- Check HTTPS requirement for production

### API Errors
- Verify Gemini API key is valid
- Check API quota limits
- Ensure all required fields are provided

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Stateless token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing
- **Environment Variables**: Secure configuration management

## 📈 Performance Optimization

- **Database Indexing**: Automatic indexing on frequently queried fields
- **Connection Pooling**: MongoDB connection optimization
- **Caching**: JWT token caching for authentication
- **Error Handling**: Comprehensive error handling and logging

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or cloud MongoDB instance
2. Configure environment variables
3. Deploy to Heroku, Vercel, or similar platform
4. Update frontend API base URL

### Frontend Deployment
1. Update API base URL to production backend
2. Deploy static files to Netlify, Vercel, or similar
3. Configure CORS settings on backend

## 📝 License

MIT License - feel free to use and modify as needed.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

For issues and questions:
1. Check troubleshooting section
2. Review MongoDB logs
3. Check browser console for errors
4. Verify environment configuration
