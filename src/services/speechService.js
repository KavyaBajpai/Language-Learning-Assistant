import { getLanguageCode } from '../config/languages.js';

export class SpeechService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isRecording = false;
    this.onResultCallback = null;
    this.onErrorCallback = null;
    this.onStatusCallback = null;
    
    this.initializeSpeechRecognition();
  }

  initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'fr-FR'; // Default language
      
      this.recognition.onstart = () => {
        this.isRecording = true;
        if (this.onStatusCallback) this.onStatusCallback('Recording...');
      };
      
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (this.onResultCallback) this.onResultCallback(transcript);
      };
      
      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (this.onErrorCallback) this.onErrorCallback(event.error);
        this.stopRecording();
      };
      
      this.recognition.onend = () => {
        this.stopRecording();
      };
    } else {
      if (this.onErrorCallback) this.onErrorCallback('Speech recognition not supported');
    }
  }

  setLanguage(language) {
    if (this.recognition) {
      this.recognition.lang = getLanguageCode(language);
    }
  }

  startRecording() {
    if (this.recognition) {
      this.recognition.start();
    }
  }

  stopRecording() {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
    }
    this.isRecording = false;
  }

  speak(text, language) {
    if (this.synthesis) {
      // Cancel any ongoing speech
      this.synthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(language);
      utterance.rate = 0.8; // Slightly slower for better comprehension
      utterance.pitch = 1;
      
      this.synthesis.speak(utterance);
    }
  }

  // Event handlers
  onResult(callback) {
    this.onResultCallback = callback;
  }

  onError(callback) {
    this.onErrorCallback = callback;
  }

  onStatus(callback) {
    this.onStatusCallback = callback;
  }

  isSupported() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }
}
