# Quick Setup Guide

## 🚀 Get the App Running in 5 Minutes

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set up Environment Variables
```bash
# Copy the environment template
cp env.example .env

# Edit .env file and add your Gemini API key
# GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Start the Server
```bash
npm start
```

### 4. Access the Application
Open your browser and go to: `http://localhost:3000`

## 🔧 What's Working Now

✅ **Basic Language Learning**: Speech recognition and AI feedback  
✅ **10 Languages**: French, Spanish, German, Italian, Portuguese, Japanese, Korean, Chinese, Hindi, English  
✅ **Fluency Scoring**: AI-powered fluency assessment  
✅ **Vocabulary Learning**: AI-suggested vocabulary words  
✅ **Audio Output**: Text-to-speech responses  

## 🗄️ MongoDB Setup (Optional)

The app works without MongoDB for basic functionality. To enable user accounts and progress tracking:

1. **Install MongoDB** locally or use MongoDB Atlas
2. **Update .env file** with your MongoDB URI:
   ```
   MONGODB_URI=mongodb://localhost:27017/language-learning-app
   ```
3. **Restart the server**

## 🎯 How to Use

1. **Select a language** from the dropdown
2. **Click the microphone button** 🎤
3. **Speak in the selected language**
4. **View AI feedback** with corrections and fluency score
5. **Listen to AI response** (automatically played)

## 🚨 Troubleshooting

### 404 Error
- Make sure you're accessing `http://localhost:3000` (not 8080)
- Ensure the backend server is running

### Speech Recognition Issues
- Use Chrome, Edge, or Safari
- Grant microphone permissions
- Check browser console for errors

### API Errors
- Verify your Gemini API key is correct
- Check the .env file configuration

## 📝 Next Steps

Once the basic app is working, you can:
- Set up MongoDB for user accounts
- Enable authentication features
- Add more advanced learning features

## 🆘 Need Help?

1. Check the browser console (F12) for errors
2. Verify all environment variables are set
3. Ensure MongoDB is running (if using database features)
