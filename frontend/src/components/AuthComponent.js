// Authentication Component
import { apiService } from '../services/apiService.js';

export class AuthComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentUser = null;
    this.init();
  }

  init() {
    // Check if user is already authenticated
    if (apiService.isAuthenticated()) {
      this.loadUserProfile();
    } else {
      this.showAuthForm();
    }
  }

  async loadUserProfile() {
    try {
      const user = await apiService.getUserProfile();
      this.currentUser = user;
      this.showUserDashboard();
    } catch (error) {
      console.error('Failed to load user profile:', error);
      apiService.logout();
      this.showAuthForm();
    }
  }

  showAuthForm() {
    this.container.innerHTML = `
      <div class="auth-container">
        <div class="auth-tabs">
          <button class="auth-tab active" data-tab="login">Login</button>
          <button class="auth-tab" data-tab="register">Register</button>
        </div>
        
        <div class="auth-content">
          <!-- Login Form -->
          <form id="loginForm" class="auth-form">
            <h3>Login to Your Account</h3>
            <div class="form-group">
              <label for="loginEmail">Email:</label>
              <input type="email" id="loginEmail" required>
            </div>
            <div class="form-group">
              <label for="loginPassword">Password:</label>
              <input type="password" id="loginPassword" required>
            </div>
            <button type="submit" class="auth-btn">Login</button>
            <div id="loginError" class="auth-error"></div>
          </form>

          <!-- Register Form -->
          <form id="registerForm" class="auth-form" style="display: none;">
            <h3>Create New Account</h3>
            <div class="form-group">
              <label for="registerUsername">Username:</label>
              <input type="text" id="registerUsername" required minlength="3">
            </div>
            <div class="form-group">
              <label for="registerEmail">Email:</label>
              <input type="email" id="registerEmail" required>
            </div>
            <div class="form-group">
              <label for="registerPassword">Password:</label>
              <input type="password" id="registerPassword" required minlength="6">
            </div>
            <div class="form-group">
              <label for="nativeLanguage">Native Language:</label>
              <select id="nativeLanguage">
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Italian">Italian</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
                <option value="Chinese">Chinese</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
            <button type="submit" class="auth-btn">Register</button>
            <div id="registerError" class="auth-error"></div>
          </form>
        </div>
      </div>
    `;

    this.setupAuthEventListeners();
  }

  setupAuthEventListeners() {
    // Tab switching
    const tabs = this.container.querySelectorAll('.auth-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const formType = tab.dataset.tab;
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (formType === 'login') {
          loginForm.style.display = 'block';
          registerForm.style.display = 'none';
        } else {
          loginForm.style.display = 'none';
          registerForm.style.display = 'block';
        }
      });
    });

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleLogin();
    });

    // Register form submission
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleRegister();
    });
  }

  async handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    try {
      const result = await apiService.login({ email, password });
      this.currentUser = result.user;
      this.showUserDashboard();
    } catch (error) {
      errorDiv.textContent = error.message;
    }
  }

  async handleRegister() {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const nativeLanguage = document.getElementById('nativeLanguage').value;
    const errorDiv = document.getElementById('registerError');

    try {
      const result = await apiService.register({
        username,
        email,
        password,
        nativeLanguage
      });
      this.currentUser = result.user;
      this.showUserDashboard();
    } catch (error) {
      errorDiv.textContent = error.message;
    }
  }

  showUserDashboard() {
    this.container.innerHTML = `
      <div class="user-dashboard">
        <div class="user-header">
          <h3>Welcome, ${this.currentUser.username}!</h3>
          <button id="logoutBtn" class="logout-btn">Logout</button>
        </div>
        
        <div class="user-stats">
          <h4>Your Learning Progress</h4>
          <div id="userStats" class="stats-container">
            <div class="loading">Loading your statistics...</div>
          </div>
        </div>

        <div class="user-actions">
          <button id="startLearningBtn" class="primary-btn">Start Learning</button>
          <button id="viewVocabularyBtn" class="secondary-btn">View Vocabulary</button>
          <button id="viewHistoryBtn" class="secondary-btn">View History</button>
        </div>
      </div>
    `;

    this.setupDashboardEventListeners();
    this.loadUserStats();
  }

  setupDashboardEventListeners() {
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
      apiService.logout();
      this.currentUser = null;
      this.showAuthForm();
    });

    const startLearningBtn = document.getElementById('startLearningBtn');
    startLearningBtn.addEventListener('click', () => {
      this.hide();
      // Trigger the main app to show
      document.dispatchEvent(new CustomEvent('showMainApp'));
    });

    const viewVocabularyBtn = document.getElementById('viewVocabularyBtn');
    viewVocabularyBtn.addEventListener('click', () => {
      this.showVocabulary();
    });

    const viewHistoryBtn = document.getElementById('viewHistoryBtn');
    viewHistoryBtn.addEventListener('click', () => {
      this.showHistory();
    });
  }

  async loadUserStats() {
    try {
      const stats = await apiService.getUserStats();
      const statsContainer = document.getElementById('userStats');
      
      statsContainer.innerHTML = `
        <div class="stat-card">
          <div class="stat-number">${stats.totalSessions}</div>
          <div class="stat-label">Total Sessions</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${stats.totalVocabularyWords}</div>
          <div class="stat-label">Vocabulary Words</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${Math.round(stats.averageFluencyScore)}</div>
          <div class="stat-label">Avg Fluency Score</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${stats.masteredWords}</div>
          <div class="stat-label">Mastered Words</div>
        </div>
      `;
    } catch (error) {
      console.error('Failed to load stats:', error);
      document.getElementById('userStats').innerHTML = 
        '<div class="error">Failed to load statistics</div>';
    }
  }

  async showVocabulary() {
    try {
      const vocabulary = await apiService.getUserVocabulary();
      const modal = this.createModal('Your Vocabulary', this.renderVocabularyList(vocabulary));
      document.body.appendChild(modal);
    } catch (error) {
      console.error('Failed to load vocabulary:', error);
    }
  }

  async showHistory() {
    try {
      const sessions = await apiService.getUserSessions();
      const modal = this.createModal('Learning History', this.renderSessionHistory(sessions));
      document.body.appendChild(modal);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }

  renderVocabularyList(vocabulary) {
    if (vocabulary.length === 0) {
      return '<p>No vocabulary words yet. Start learning to build your vocabulary!</p>';
    }

    return `
      <div class="vocabulary-list">
        ${vocabulary.map(word => `
          <div class="vocab-item ${word.mastered ? 'mastered' : ''}">
            <div class="vocab-word">
              <strong>${word.word}</strong>
              <span class="difficulty-badge difficulty-${word.difficulty}">${word.difficulty}</span>
            </div>
            <div class="vocab-translation">${word.translation}</div>
            <div class="vocab-example">${word.usageExample}</div>
            <div class="vocab-stats">
              Reviewed: ${word.reviewCount} times
              ${word.mastered ? ' | ✅ Mastered' : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderSessionHistory(sessions) {
    if (sessions.length === 0) {
      return '<p>No learning sessions yet. Start practicing to see your history!</p>';
    }

    return `
      <div class="session-history">
        ${sessions.map(session => `
          <div class="session-item">
            <div class="session-header">
              <span class="session-language">${session.language}</span>
              <span class="session-date">${new Date(session.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="session-content">
              <div class="session-text">
                <strong>You said:</strong> "${session.originalText}"
              </div>
              <div class="session-correction">
                <strong>Corrected:</strong> "${session.correctedText}"
              </div>
              <div class="session-score">
                <strong>Fluency Score:</strong> ${session.fluencyScore}/100
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-content">
          ${content}
        </div>
      </div>
    `;

    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.remove();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    return modal;
  }

  hide() {
    this.container.style.display = 'none';
  }

  show() {
    this.container.style.display = 'block';
  }
}
