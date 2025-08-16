export class FluencyHelper {
  static getFluencyFeedback(score) {
    if (score >= 90) {
      return "Excellent! Your pronunciation and grammar are very natural.";
    } else if (score >= 80) {
      return "Great job! You're speaking very well with minor improvements needed.";
    } else if (score >= 70) {
      return "Good effort! Keep practicing to improve your fluency.";
    } else if (score >= 60) {
      return "Not bad! Focus on the corrections to improve your speaking.";
    } else {
      return "Keep practicing! Review the corrections and try again.";
    }
  }

  static getScoreColor(score) {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  }
}
