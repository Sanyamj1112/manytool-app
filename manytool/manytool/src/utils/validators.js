/**
 * validators.js
 * ─────────────────────────────────────────────────────────────
 * Advanced validation utility functions
 * 
 * Features:
 * - Email validation
 * - URL validation
 * - Phone validation
 * - Password strength validation
 * - Credit card validation
 * - Custom validators
 * 
 * @version 1.0.0
 */

/**
 * Validate email address
 * 
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 * 
 * @example
 * validateEmail("user@example.com"); // Returns true
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL
 * 
 * @param {string} url - URL to validate
 * @returns {boolean} Is valid URL
 * 
 * @example
 * validateUrl("https://example.com"); // Returns true
 */
export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validate phone number
 * 
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone
 * 
 * @example
 * validatePhone("+1-555-123-4567"); // Returns true
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate password strength
 * 
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 * 
 * @example
 * validatePassword("MyPass123!");
 * // Returns { valid: true, strength: "Strong", score: 85 }
 */
export const validatePassword = (password) => {
  const errors = [];
  let score = 0;

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    score += 20;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letters');
  } else {
    score += 15;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letters');
  } else {
    score += 15;
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain numbers');
  } else {
    score += 15;
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push('Password must contain special characters');
  } else {
    score += 15;
  }

  // No repeating characters
  if (!/(.)\1{2,}/.test(password)) {
    score += 5;
  }

  let strength = 'Weak';
  if (score >= 80) strength = 'Strong';
  else if (score >= 60) strength = 'Good';
  else if (score >= 30) strength = 'Fair';

  return {
    valid: errors.length === 0,
    errors,
    strength,
    score,
  };
};

/**
 * Validate credit card number (Luhn algorithm)
 * 
 * @param {string} cardNumber - Card number to validate
 * @returns {boolean} Is valid card
 * 
 * @example
 * validateCreditCard("4532015112830366"); // Returns true/false
 */
export const validateCreditCard = (cardNumber) => {
  const sanitized = cardNumber.replace(/\D/g, '');

  if (sanitized.length < 13 || sanitized.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Validate IP address (IPv4)
 * 
 * @param {string} ip - IP address to validate
 * @returns {boolean} Is valid IPv4
 * 
 * @example
 * validateIPv4("192.168.1.1"); // Returns true
 */
export const validateIPv4 = (ip) => {
  const ipv4Regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
  return ipv4Regex.test(ip);
};

/**
 * Validate IPv6 address
 * 
 * @param {string} ip - IP address to validate
 * @returns {boolean} Is valid IPv6
 */
export const validateIPv6 = (ip) => {
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  return ipv6Regex.test(ip);
};

/**
 * Validate hex color code
 * 
 * @param {string} color - Color code to validate
 * @returns {boolean} Is valid hex color
 * 
 * @example
 * validateHexColor("#FF5733"); // Returns true
 */
export const validateHexColor = (color) => {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(color);
};

/**
 * Validate username
 * 
 * @param {string} username - Username to validate
 * @returns {Object} Validation result
 */
export const validateUsername = (username) => {
  const errors = [];

  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (username.length > 20) {
    errors.push('Username must not exceed 20 characters');
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, underscores, and hyphens');
  }

  if (/^[0-9]/.test(username)) {
    errors.push('Username cannot start with a number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate date format (YYYY-MM-DD)
 * 
 * @param {string} dateString - Date to validate
 * @returns {boolean} Is valid date
 * 
 * @example
 * validateDateFormat("2024-01-15"); // Returns true
 */
export const validateDateFormat = (dateString) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Validate JSON string
 * 
 * @param {string} jsonString - JSON to validate
 * @returns {Object} Validation result
 * 
 * @example
 * validateJSON('{"name":"John"}'); 
 * // Returns { valid: true, data: {...} }
 */
export const validateJSON = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    return {
      valid: true,
      data: parsed,
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
    };
  }
};

/**
 * Generic validator
 * 
 * @param {string} value - Value to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation result
 */
export const validate = (value, rules = {}) => {
  const errors = [];

  if (rules.required && (!value || value.trim() === '')) {
    errors.push('This field is required');
  }

  if (rules.minLength && value.length < rules.minLength) {
    errors.push(`Minimum length is ${rules.minLength}`);
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    errors.push(`Maximum length is ${rules.maxLength}`);
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    errors.push(rules.patternMessage || 'Invalid format');
  }

  if (rules.custom && !rules.custom(value)) {
    errors.push(rules.customMessage || 'Validation failed');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};