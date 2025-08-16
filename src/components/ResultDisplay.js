import { getLanguageName } from '../config/languages.js';
import { FluencyHelper } from '../utils/fluencyHelper.js';

export class ResultDisplay {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  showLoading() {
    this.container.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <p>Processing your speech...</p>
      </div>
    `;
  }

  displayResults(data, selectedLanguage) {
    const fluencyScore = data.fluency_score || 0;
    const vocabularyWords = data.vocabulary_words || [];
    
    this.container.innerHTML = `
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
    return `
      <div class="fluency-score">
        <h3>Fluency Score: ${score}/100</h3>
        <p>${FluencyHelper.getFluencyFeedback(score)}</p>
      </div>
    `;
  }

  createResponseSection(data, selectedLanguage) {
    return `
      <div class="result-card">
        <h3>AI Response</h3>
        <p><strong>${getLanguageName(selectedLanguage)}:</strong> ${data.response}</p>
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

  showError(message) {
    this.container.innerHTML = `
      <div class="error">
        <p class="error-title">Error:</p>
        <p>${message}</p>
      </div>
    `;
  }
}
