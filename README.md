# Language Learning Assistant

A modern AI-powered language learning web app that helps users practice speaking in foreign languages, get feedback, and continue conversations using the Gemini API. Built with a modular architecture and clean CSS styling.

## Features

- **Language Selection**: Choose from 10 different languages (French, Spanish, German, Italian, Portuguese, Japanese, Korean, Chinese, Hindi, English)
- **Speech Input**: Use your microphone to speak in the selected language
- **AI Feedback**: Get corrections for grammar and vocabulary mistakes
- **Fluency Scoring**: Receive a score (0-100) based on grammar, pronunciation, and naturalness
- **Vocabulary Learning**: Get suggested vocabulary words with translations, difficulty levels, and usage examples
- **Conversation**: Receive natural responses in the target language
- **Translations**: See English translations of both your input and AI responses
- **Audio Output**: Listen to AI responses spoken aloud in the target language
- **Clean UI**: Modern, responsive design with traditional CSS

## Project Structure

```
Language Assistant/
├── src/
│   ├── app.js                 # Main application orchestrator
│   ├── components/
│   │   └── ResultDisplay.js   # Results display component
│   ├── config/
│   │   └── languages.js       # Language configurations
│   ├── services/
│   │   ├── apiService.js      # API communication service
│   │   └── speechService.js   # Speech recognition/synthesis service
│   └── utils/
│       └── fluencyHelper.js   # Fluency scoring utilities
├── public/
│   ├── index.html            # Main HTML file
│   ├── js/
│   │   └── app.js            # Entry point JavaScript
│   └── css/
│       └── styles.css        # Traditional CSS styles
├── server.js                 # Express backend server
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## Prerequisites

- Node.js (version 14 or higher)
- A Gemini API key from Google AI Studio
- A modern browser with speech recognition support (Chrome, Edge, Safari)

## Setup

1. **Clone or download this project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your API key**
   - Copy `env.example` to `.env`
   - Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add your API key to the `.env` file:
     ```
     GEMINI_API_KEY=your_actual_api_key_here
     ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open your browser**
   - Go to `http://localhost:3000`
   - Allow microphone access when prompted

## Development

### Development Mode
```bash
npm run dev
```

## Usage

1. **Select a language** from the dropdown menu
2. **Click the microphone button** to start recording
3. **Speak in the selected language**
4. **Click the stop button** (or wait for auto-stop) to end recording
5. **View the results**:
   - Your original speech
   - Corrected version
   - Mistakes highlighted
   - Fluency score with feedback
   - AI's response in the target language
   - English translations
   - Vocabulary words to review
6. **Listen to the AI response** (automatically played)

## Example Flow

**User selects French and speaks:** "Bonjour je voules du pain."

**App returns:**
- **Original:** "Bonjour je voules du pain"
- **Corrected:** "Bonjour je voudrais du pain"
- **Mistakes:** "voules → voudrais"
- **Fluency Score:** 75/100 - "Good effort! Keep practicing to improve your fluency."
- **AI Response:** "Très bien ! Je vais vous apporter du pain."
- **Translation (User):** "Hello, I want bread"
- **Translation (AI):** "Great! I will bring you bread."
- **Vocabulary Words:**
  - **vouloir** (beginner) - "to want" - "Je veux du pain"
  - **apporter** (intermediate) - "to bring" - "Je vais apporter le livre"
  - **boulangerie** (intermediate) - "bakery" - "La boulangerie est ouverte"

## Supported Languages

- French (fr-FR)
- Spanish (es-ES)
- German (de-DE)
- Italian (it-IT)
- Portuguese (pt-PT)
- Japanese (ja-JP)
- Korean (ko-KR)
- Chinese (zh-CN)
- Hindi (hi-IN)
- English (en-US)

## Technical Details

- **Backend**: Node.js + Express
- **Frontend**: Vanilla JavaScript (ES6 modules)
- **Styling**: Traditional CSS with responsive design
- **AI**: Google Gemini API
- **Speech Recognition**: Web Speech API
- **Speech Synthesis**: Web Speech API
- **Architecture**: Modular service-based architecture

## Architecture Overview

The application follows a modular architecture with clear separation of concerns:

- **Services**: Handle external APIs and browser APIs
- **Components**: Manage UI rendering and user interactions
- **Utils**: Provide helper functions and utilities
- **Config**: Centralize configuration data
- **Main App**: Orchestrates all components and services

## Troubleshooting

### Speech Recognition Issues
- Ensure you're using a supported browser (Chrome, Edge, Safari)
- Check that microphone permissions are granted
- Try refreshing the page if speech recognition fails

### API Errors
- Verify your Gemini API key is correct
- Check that you have sufficient API quota
- Ensure the `.env` file is in the project root

### Audio Issues
- Check your system's audio settings
- Ensure the browser has permission to play audio
- Try refreshing the page if speech synthesis doesn't work

## License

MIT License - feel free to use and modify as needed.
