import { SpeechService } from './services/speechService.js';
import { ApiService } from './services/apiService.js';
import { ResultDisplay } from './components/ResultDisplay.js';
import { languageMap } from './config/languages.js';

export class LanguageLearningApp {
  constructor() {
    this.speechService = new SpeechService();
    this.apiService = new ApiService();
    this.resultDisplay = new ResultDisplay('results');
    this.selectedLanguage = 'french';
    
    this.initializeApp();
  }

  initializeApp() {
    this.setupEventListeners();
    this.setupSpeechService();
    this.populateLanguageOptions();
  }

  setupEventListeners() {
    const micBtn = document.getElementById('micBtn');
    const languageSelect = document.getElementById('languageSelect');
    
    micBtn.addEventListener('click', () => {
      if (this.speechService.isRecording) {
        this.speechService.stopRecording();
        this.updateMicButton(false);
      } else {
        this.speechService.startRecording();
        this.updateMicButton(true);
      }
    });
    
    languageSelect.addEventListener('change', (e) => {
      this.selectedLanguage = e.target.value;
      this.speechService.setLanguage(this.selectedLanguage);
    });
  }

  setupSpeechService() {
    this.speechService.onResult((transcript) => {
      this.processSpeech(transcript);
    });

    this.speechService.onError((error) => {
      this.updateStatus(`Error: ${error}`);
      this.updateMicButton(false);
    });

    this.speechService.onStatus((status) => {
      this.updateStatus(status);
    });
  }

  populateLanguageOptions() {
    const languageSelect = document.getElementById('languageSelect');
    languageSelect.innerHTML = '';
    
    Object.entries(languageMap).forEach(([key, value]) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = value;
      languageSelect.appendChild(option);
    });
  }

  updateMicButton(isRecording) {
    const micBtn = document.getElementById('micBtn');
    if (isRecording) {
      micBtn.classList.add('recording');
      micBtn.textContent = '⏹️';
    } else {
      micBtn.classList.remove('recording');
      micBtn.textContent = '🎤';
    }
  }

  updateStatus(message) {
    const statusElement = document.getElementById('status');
    if (statusElement) {
      statusElement.textContent = message;
    }
  }

  async processSpeech(transcript) {
    this.updateStatus('Processing your speech...');
    this.resultDisplay.showLoading();
    
    try {
      const data = await this.apiService.processSpeech(transcript, this.selectedLanguage);
      this.resultDisplay.displayResults(data, this.selectedLanguage);
      this.speechService.speak(data.response, this.selectedLanguage);
      this.updateStatus('Ready for next speech input');
    } catch (error) {
      console.error('Error processing speech:', error);
      this.resultDisplay.showError(error.message);
      this.updateStatus('Error processing speech. Please try again.');
    }
  }
}
