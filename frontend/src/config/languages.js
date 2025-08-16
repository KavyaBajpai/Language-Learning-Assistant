// Language configuration for the application
export const languageMap = {
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

export const languageCodes = {
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

export const languageNames = {
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

export const getLanguageCode = (language) => {
  return languageCodes[language] || 'en-US';
};

export const getLanguageName = (languageCode) => {
  return languageNames[languageCode] || languageCode;
};
