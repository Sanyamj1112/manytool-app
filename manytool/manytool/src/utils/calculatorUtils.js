/**
 * calculatorUtils.js
 * ─────────────────────────────────────────────────────────────
 * Advanced calculator and calculation utility functions
 * 
 * Features:
 * - Age calculations
 * - Date calculations
 * - Mathematical operations
 * - Percentage calculations
 * - Statistical functions
 * 
 * @version 1.0.0
 */

/**
 * Calculate exact age from birth date
 * 
 * @param {Date|string} birthDate - Birth date
 * @returns {Object} Age breakdown (years, months, days)
 * 
 * @example
 * calculateAge("1990-05-15");
 * // Returns { years: 33, months: 8, days: 16, totalDays: 12345 }
 */
export const calculateAge = (birthDate) => {
  try {
    const birth = new Date(birthDate);
    const today = new Date();

    

    // Validation
    if (birth > today) {
      throw new Error('Birth date cannot be in the future');
    }

    if (birth.getFullYear() < 1900) {
      throw new Error('Invalid birth date');
    }

    // Calculate years, months, days
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    // Adjust for negative days
    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }

    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate total days
    const totalDays = Math.floor((today - birth) / (1000 * 60 * 60 * 24));

    // Calculate next birthday
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    const daysUntilBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

    return {
      years,
      months,
      days,
      totalDays,
      totalHours: totalDays * 24,
      totalMinutes: totalDays * 24 * 60,
      daysUntilBirthday,
      nextBirthdayDate: nextBirthday,
    };
  } catch (error) {
    return { error: error.message };
  }
};

/**
 * Get zodiac sign from birth date
 * 
 * @param {number} month - Month (1-12)
 * @param {number} day - Day (1-31)
 * @returns {Object} Zodiac sign object
 * 
 * @example
 * getZodiacSign(3, 21); // Returns { name: "Aries", symbol: "♈" }
 */
export const getZodiacSign = (month, day) => {
  const zodiacSigns = [
    { name: 'Capricorn', symbol: '♑', start: [12, 22], end: [1, 19] },
    { name: 'Aquarius', symbol: '♒', start: [1, 20], end: [2, 18] },
    { name: 'Pisces', symbol: '♓', start: [2, 19], end: [3, 20] },
    { name: 'Aries', symbol: '♈', start: [3, 21], end: [4, 19] },
    { name: 'Taurus', symbol: '♉', start: [4, 20], end: [5, 20] },
    { name: 'Gemini', symbol: '♊', start: [5, 21], end: [6, 20] },
    { name: 'Cancer', symbol: '♋', start: [6, 21], end: [7, 22] },
    { name: 'Leo', symbol: '♌', start: [7, 23], end: [8, 22] },
    { name: 'Virgo', symbol: '♍', start: [8, 23], end: [9, 22] },
    { name: 'Libra', symbol: '♎', start: [9, 23], end: [10, 22] },
    { name: 'Scorpio', symbol: '♏', start: [10, 23], end: [11, 21] },
    { name: 'Sagittarius', symbol: '♐', start: [11, 22], end: [12, 21] },
  ];

  for (let zodiac of zodiacSigns) {
    const [startMonth, startDay] = zodiac.start;
    const [endMonth, endDay] = zodiac.end;

    if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
      return zodiac;
    }
  }

  return zodiacSigns[0];
};

/**
 * Calculate percentage
 * 
 * @param {number} value - Value
 * @param {number} total - Total
 * @returns {number} Percentage
 * 
 * @example
 * calculatePercentage(25, 100); // Returns 25
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

/**
 * Calculate percentage increase/decrease
 * 
 * @param {number} initial - Initial value
 * @param {number} final - Final value
 * @returns {number} Percentage change
 * 
 * @example
 * calculatePercentageChange(100, 150); // Returns 50
 */
export const calculatePercentageChange = (initial, final) => {
  if (initial === 0) return 0;
  return ((final - initial) / initial) * 100;
};

/**
 * Convert temperature between scales
 * 
 * @param {number} value - Temperature value
 * @param {string} from - From scale (c|f|k)
 * @param {string} to - To scale (c|f|k)
 * @returns {number} Converted temperature
 * 
 * @example
 * convertTemperature(0, 'c', 'f'); // Returns 32
 */
export const convertTemperature = (value, from, to) => {
  let celsius;

  // Convert to Celsius first
  if (from === 'c') celsius = value;
  else if (from === 'f') celsius = ((value - 32) * 5) / 9;
  else if (from === 'k') celsius = value - 273.15;
  else throw new Error('Invalid temperature scale');

  // Convert from Celsius to target
  if (to === 'c') return celsius;
  else if (to === 'f') return (celsius * 9) / 5 + 32;
  else if (to === 'k') return celsius + 273.15;
  else throw new Error('Invalid temperature scale');
};

/**
 * Calculate GCD (Greatest Common Divisor)
 * 
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} GCD
 * 
 * @example
 * calculateGCD(48, 18); // Returns 6
 */
export const calculateGCD = (a, b) => {
  return b === 0 ? a : calculateGCD(b, a % b);
};

/**
 * Calculate LCM (Least Common Multiple)
 * 
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} LCM
 * 
 * @example
 * calculateLCM(12, 18); // Returns 36
 */
export const calculateLCM = (a, b) => {
  return (a * b) / calculateGCD(a, b);
};

/**
 * Calculate average
 * 
 * @param {Array<number>} numbers - Array of numbers
 * @returns {number} Average
 * 
 * @example
 * calculateAverage([10, 20, 30]); // Returns 20
 */
export const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
};

/**
 * Calculate median
 * 
 * @param {Array<number>} numbers - Array of numbers
 * @returns {number} Median
 * 
 * @example
 * calculateMedian([10, 20, 30]); // Returns 20
 */
export const calculateMedian = (numbers) => {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 !== 0) {
    return sorted[mid];
  }

  return (sorted[mid - 1] + sorted[mid]) / 2;
};

/**
 * Calculate standard deviation
 * 
 * @param {Array<number>} numbers - Array of numbers
 * @returns {number} Standard deviation
 */
export const calculateStandardDeviation = (numbers) => {
  const mean = calculateAverage(numbers);
  const squareDiffs = numbers.map((num) => Math.pow(num - mean, 2));
  const avgSquareDiff = calculateAverage(squareDiffs);
  return Math.sqrt(avgSquareDiff);
};

/**
 * Calculate factorial
 * 
 * @param {number} n - Number
 * @returns {number} Factorial
 * 
 * @example
 * calculateFactorial(5); // Returns 120
 */
export const calculateFactorial = (n) => {
  if (n < 0) throw new Error('Factorial not defined for negative numbers');
  if (n === 0 || n === 1) return 1;
  return n * calculateFactorial(n - 1);
};

/**
 * Check if number is prime
 * 
 * @param {number} num - Number to check
 * @returns {boolean} Is prime
 * 
 * @example
 * isPrime(17); // Returns true
 */
export const isPrime = (num) => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;

  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }

  return true;
};