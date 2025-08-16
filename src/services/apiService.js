export class ApiService {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  async processSpeech(text, language) {
    try {
      const response = await fetch(`${this.baseUrl}/api/process-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          language: language
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to process speech. Please try again.');
    }
  }
}
