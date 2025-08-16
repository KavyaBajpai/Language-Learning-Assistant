// Language Learning App - Full Implementation
class LanguageLearningApp {
  constructor() {
    this.isRecording = false;
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
    this.initializeEventListeners();
    this.populateLanguageDropdown();
  }

  initializeSpeechRecognition() {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.updateStatus('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US'; // Will be updated based on selection

    this.recognition.onstart = () => {
      this.isRecording = true;
      this.updateMicButton();
      this.updateStatus('Listening... Speak now!');
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      this.updateStatus(`You said: "${transcript}"`);
      this.processSpeech(transcript);
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.updateStatus(`Error: ${event.error}`);
      this.stopRecording();
    };

    this.recognition.onend = () => {
      this.stopRecording();
    };
  }

  initializeEventListeners() {
    const micBtn = document.getElementById('micBtn');
    if (micBtn) {
      micBtn.addEventListener('click', () => this.toggleRecording());
    }

    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
      languageSelect.addEventListener('change', (e) => {
        this.updateRecognitionLanguage(e.target.value);
      });
    }
  }

  populateLanguageDropdown() {
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
      const languages = [
        { value: 'french', name: 'French', code: 'fr-FR' },
        { value: 'spanish', name: 'Spanish', code: 'es-ES' },
        { value: 'german', name: 'German', code: 'de-DE' },
        { value: 'italian', name: 'Italian', code: 'it-IT' },
        { value: 'portuguese', name: 'Portuguese', code: 'pt-PT' },
        { value: 'japanese', name: 'Japanese', code: 'ja-JP' },
        { value: 'korean', name: 'Korean', code: 'ko-KR' },
        { value: 'chinese', name: 'Chinese', code: 'zh-CN' },
        { value: 'hindi', name: 'Hindi', code: 'hi-IN' },
        { value: 'english', name: 'English', code: 'en-US' }
      ];
      
      languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.value;
        option.textContent = lang.name;
        languageSelect.appendChild(option);
      });
      
      // Set default language
      this.updateRecognitionLanguage('french');
      console.log('Language dropdown populated successfully');
    }
  }

  updateRecognitionLanguage(language) {
    if (this.recognition) {
      const languageCodes = {
        'french': 'fr-FR',
        'spanish': 'es-ES',
        'german': 'de-DE',
        'italian': 'it-IT',
        'portuguese': 'pt-PT',
        'japanese': 'ja-JP',
        'korean': 'ko-KR',
        'chinese': 'zh-CN',
        'hindi': 'hi-IN',
        'english': 'en-US'
      };
      
      this.recognition.lang = languageCodes[language] || 'en-US';
      console.log(`Speech recognition language set to: ${this.recognition.lang}`);
    }
  }

  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  startRecording() {
    if (!this.recognition) {
      this.updateStatus('Speech recognition not available');
      return;
    }

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      this.updateStatus('Error starting speech recognition');
    }
  }

  stopRecording() {
    this.isRecording = false;
    this.updateMicButton();
    this.updateStatus('Select a language and click the microphone to start speaking');
    
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  }

  updateMicButton() {
    const micBtn = document.getElementById('micBtn');
    if (micBtn) {
      if (this.isRecording) {
        micBtn.classList.add('recording');
        micBtn.textContent = '⏹️';
      } else {
        micBtn.classList.remove('recording');
        micBtn.textContent = '🎤';
      }
    }
  }

  async processSpeech(transcript) {
    const languageSelect = document.getElementById('languageSelect');
    const selectedLanguage = languageSelect ? languageSelect.value : 'french';
    
    this.showLoading();
    
    try {
      const response = await fetch('/api/process-speech-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: transcript,
          language: selectedLanguage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.displayResults(data, selectedLanguage);
      this.speakResponse(data.response, selectedLanguage);
      
    } catch (error) {
      console.error('Error processing speech:', error);
      this.showError('Failed to process speech. Please try again.');
    }
  }

  showLoading() {
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
      resultsDiv.innerHTML = `
        <div class="loading">
          <div class="spinner"></div>
          <p>Processing your speech...</p>
        </div>
      `;
    }
  }

  displayResults(data, selectedLanguage) {
    const resultsDiv = document.getElementById('results');
    if (!resultsDiv) return;

    const fluencyScore = data.fluency_score || 0;
    const vocabularyWords = data.vocabulary_words || [];
    
    resultsDiv.innerHTML = `
      ${this.createSpeechSection(data)}
      ${this.createFluencySection(fluencyScore)}
      ${this.createResponseSection(data, selectedLanguage)}
      ${this.createVocabularySection(vocabularyWords)}
    `;
  }

  createSpeechSection(data) {
    return `
      <div class="result-card">
        <h3>Your Speech</h3>
        <p><strong>Original:</strong> ${data.original}</p>
        <p><strong>Corrected:</strong> ${data.corrected}</p>
        <p class="mistakes"><strong>Mistakes:</strong> ${data.mistakes}</p>
        <p class="translation"><strong>English:</strong> ${data.translation_user}</p>
      </div>
    `;
  }

  createFluencySection(score) {
    const feedback = this.getFluencyFeedback(score);
    return `
      <div class="fluency-score">
        <h3>Fluency Score: ${score}/100</h3>
        <p>${feedback}</p>
      </div>
    `;
  }

  createResponseSection(data, selectedLanguage) {
    const languageNames = {
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
    
    return `
      <div class="result-card">
        <h3>AI Response</h3>
        <p><strong>${languageNames[selectedLanguage]}:</strong> ${data.response}</p>
        <p class="translation"><strong>English:</strong> ${data.translation_response}</p>
      </div>
    `;
  }

  createVocabularySection(vocabularyWords) {
    if (vocabularyWords.length === 0) return '';

    const vocabCards = vocabularyWords.map(word => `
      <div class="vocab-word">
        <div class="word-header">
          <strong>${word.word}</strong>
          <span class="difficulty-badge difficulty-${word.difficulty}">${word.difficulty}</span>
        </div>
        <p><em>Translation:</em> ${word.translation}</p>
        <p><em>Example:</em> ${word.usage_example}</p>
      </div>
    `).join('');

    return `
      <div class="vocabulary-section">
        <h3>📚 Vocabulary Words to Review</h3>
        ${vocabCards}
      </div>
    `;
  }

  getFluencyFeedback(score) {
    if (score >= 90) return "Excellent! Your pronunciation and grammar are very natural.";
    if (score >= 80) return "Very good! You're making great progress with your language skills.";
    if (score >= 70) return "Good effort! Keep practicing to improve your fluency.";
    if (score >= 60) return "Fair attempt. Focus on grammar and pronunciation.";
    return "Keep practicing! Don't be afraid to make mistakes.";
  }

  speakResponse(text, language) {
    if (this.synthesis && text) {
      // Cancel any ongoing speech
      this.synthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.getLanguageCode(language);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      this.synthesis.speak(utterance);
    }
  }

  getLanguageCode(language) {
    const languageCodes = {
      'french': 'fr-FR',
      'spanish': 'es-ES',
      'german': 'de-DE',
      'italian': 'it-IT',
      'portuguese': 'pt-PT',
      'japanese': 'ja-JP',
      'korean': 'ko-KR',
      'chinese': 'zh-CN',
      'hindi': 'hi-IN',
      'english': 'en-US'
    };
    return languageCodes[language] || 'en-US';
  }

  showError(message) {
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
      resultsDiv.innerHTML = `
        <div class="error">
          <p class="error-title">Error:</p>
          <p>${message}</p>
        </div>
      `;
    }
  }

  updateStatus(message) {
    const statusElement = document.getElementById('status');
    if (statusElement) {
      statusElement.textContent = message;
    }
  }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing Language Learning App...');
  new LanguageLearningApp();
});
