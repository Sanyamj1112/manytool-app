/**
 * textUtils.js
 * Advanced text processing utility functions
 * @version 1.0.0
 */

// Calculate reading time (225 words per minute)
export const calculateReadingTime = (text) => {
  const words = text.trim().split(/\s+/).length;
  const readingSpeed = 225;
  const minutes = Math.max(1, Math.ceil(words / readingSpeed));
  return minutes;
};

// Count detailed text metrics
export const countTextMetrics = (text) => {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length;
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim()).length;
  const readingTime = calculateReadingTime(text);

  return { characters, charactersNoSpaces, words, sentences, paragraphs, readingTime };
};

// Convert text to different cases
export const convertCase = (text, caseType) => {
  switch (caseType) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    case 'sentence':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case 'alternating':
      return text.split('').map((char, idx) => (idx % 2 === 0 ? char.toUpperCase() : char.toLowerCase())).join('');
    case 'camel':
      return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');
    default:
      return text;
  }
};

// Generate URL-friendly slug
export const generateSlug = (text) => {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
};

// Lorem Ipsum word bank
const loremWords = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'];

// Generate Lorem Ipsum text
export const generateLoremIpsum = (paragraphCount = 1) => {
  const paragraphs = [];
  for (let i = 0; i < paragraphCount; i++) {
    const sentences = Math.floor(Math.random() * 4) + 3;
    const sentenceArray = [];
    for (let j = 0; j < sentences; j++) {
      const words = Math.floor(Math.random() * 8) + 5;
      const sentence = [];
      for (let k = 0; k < words; k++) {
        sentence.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
      }
      const capitalizedSentence = sentence.join(' ').charAt(0).toUpperCase() + sentence.join(' ').slice(1);
      sentenceArray.push(capitalizedSentence);
    }
    paragraphs.push(sentenceArray.join('. ') + '.');
  }
  return paragraphs.join('\n\n');
};

// Advanced text analysis
export const analyzeText = (text) => {
  const metrics = countTextMetrics(text);
  const density = {};
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  words.forEach((word) => {
    density[word] = (density[word] || 0) + 1;
  });
  const topWords = Object.entries(density).sort(([, a], [, b]) => b - a).slice(0, 10).map(([word, count]) => ({ word, count }));
  return { ...metrics, density, topWords, averageWordLength: (text.replace(/\s/g, '').length / metrics.words).toFixed(2) };
};

// Validate text input
export const validateText = (text, options = {}) => {
  const { minLength = 0, maxLength = Infinity, allowNumbers = true, allowSpecialChars = true } = options;
  const errors = [];
  if (text.length < minLength) errors.push(`Minimum length is ${minLength} characters`);
  if (text.length > maxLength) errors.push(`Maximum length is ${maxLength} characters`);
  if (!allowNumbers && /\d/.test(text)) errors.push('Numbers are not allowed');
  if (!allowSpecialChars && /[^a-zA-Z0-9\s]/.test(text)) errors.push('Special characters are not allowed');
  return { valid: errors.length === 0, errors };
};