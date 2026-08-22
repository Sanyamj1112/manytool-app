/**
 * InputField.jsx
 * ─────────────────────────────────────────────────────────────
 * Advanced reusable input component with validation and states
 * 
 * Features:
 * - Text, number, email, password input types
 * - Real-time validation with error messages
 * - Character count display
 * - Icon support (prefix/suffix)
 * - Loading state
 * - Disabled state
 * - Accessibility optimized (labels, ARIA)
 * - Dark mode support
 * 
 * @version 1.0.0
 * @requires react@^18.2.0
 * @requires framer-motion@^10.16.16
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * InputField Component
 * ─────────────────────────────────────────────────────────────
 * Flexible input component with validation and visual states
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.name - Input name attribute
 * @param {string} props.label - Display label
 * @param {string} props.type - Input type (text|email|password|number|url)
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Current value
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onBlur - Blur handler
 * @param {Function} props.onFocus - Focus handler
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Is required field
 * @param {number} props.maxLength - Maximum characters
 * @param {number} props.minLength - Minimum characters
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {React.ReactNode} props.prefixIcon - Icon before input
 * @param {React.ReactNode} props.suffixIcon - Icon after input
 * @param {Function} props.validator - Custom validation function
 * @param {string} props.hint - Helper text below input
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Input field component
 * 
 * @example
 * const [email, setEmail] = useState('');
 * const [error, setError] = useState('');
 * 
 * const validateEmail = (value) => {
 *   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
 * };
 * 
 * return (
 *   <InputField
 *     label="Email"
 *     type="email"
 *     value={email}
 *     onChange={(e) => setEmail(e.target.value)}
 *     validator={validateEmail}
 *     error={error}
 *     placeholder="Enter your email"
 *     required
 *   />
 * );
 */
const InputField = ({
  name,
  label,
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  onBlur,
  onFocus,
  error = '',
  required = false,
  maxLength,
  minLength,
  disabled = false,
  loading = false,
  prefixIcon = null,
  suffixIcon = null,
  validator,
  hint = '',
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [validationError, setValidationError] = useState(error);
  const inputRef = useRef(null);

  // Update validation error when error prop changes
  useEffect(() => {
    setValidationError(error);
  }, [error]);

  // Handle input change with validation
  const handleChange = useCallback(
    (e) => {
      const newValue = e.target.value;

      // Call parent onChange
      onChange?.(e);

      // Run custom validator if provided
      if (validator) {
        const isValid = validator(newValue);
        setValidationError(isValid ? '' : `Invalid ${label || 'input'}`);
      }
    },
    [onChange, validator, label]
  );

  // Handle blur event
  const handleBlur = useCallback(
    (e) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur]
  );

  // Handle focus event
  const handleFocus = useCallback(
    (e) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus]
  );

  // Calculate remaining characters
  const remainingChars = maxLength ? maxLength - (value?.length || 0) : null;
  const isNearLimit = remainingChars !== null && remainingChars <= 10;

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <motion.label
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
          htmlFor={name}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}

      {/* Input Wrapper */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`relative flex items-center border-2 rounded-lg transition-all duration-200 ${
          isFocused
            ? 'border-indigo-500 shadow-lg shadow-indigo-500/20'
            : validationError
            ? 'border-red-500 shadow-lg shadow-red-500/10'
            : 'border-gray-300 dark:border-gray-600'
        } bg-white dark:bg-gray-800 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {/* Prefix Icon */}
        {prefixIcon && (
          <div className="absolute left-3 text-gray-500 dark:text-gray-400 flex-shrink-0">
            {prefixIcon}
          </div>
        )}

        {/* Input Element */}
        <input
          ref={inputRef}
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          maxLength={maxLength}
          minLength={minLength}
          required={required}
          disabled={disabled || loading}
          className={`w-full py-3 px-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none ${
            prefixIcon ? 'pl-10' : ''
          } ${suffixIcon ? 'pr-10' : ''} disabled:cursor-not-allowed`}
          aria-label={label}
          aria-invalid={!!validationError}
          aria-describedby={validationError ? `${name}-error` : hint ? `${name}-hint` : undefined}
        />

        {/* Suffix Icon / Loading State */}
        {(suffixIcon || loading) && (
          <div className="absolute right-3 text-gray-500 dark:text-gray-400 flex-shrink-0">
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full"
              />
            ) : (
              suffixIcon
            )}
          </div>
        )}
      </motion.div>

      {/* Character Count */}
      {maxLength && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-xs mt-2 ${
            isNearLimit ? 'text-red-500 font-semibold' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {value?.length || 0} / {maxLength}
        </motion.div>
      )}

      {/* Error Message */}
      {validationError && (
        <motion.div
          id={`${name}-error`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500 mt-2 font-medium"
          role="alert"
        >
          ❌ {validationError}
        </motion.div>
      )}

      {/* Hint Text */}
      {hint && !validationError && (
        <motion.div
          id={`${name}-hint`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-gray-500 dark:text-gray-400 mt-2"
        >
          {hint}
        </motion.div>
      )}
    </div>
  );
};

export default InputField;

/**
 * Component prop types
 * @typedef {Object} InputFieldProps
 * @property {string} name - Input name
 * @property {string} label - Display label
 * @property {string} type - Input type
 * @property {string} placeholder - Placeholder text
 * @property {string} value - Current value
 * @property {Function} onChange - Change handler
 * @property {Function} onBlur - Blur handler
 * @property {Function} onFocus - Focus handler
 * @property {string} error - Error message
 * @property {boolean} required - Required flag
 * @property {number} maxLength - Max characters
 * @property {number} minLength - Min characters
 * @property {boolean} disabled - Disabled flag
 * @property {boolean} loading - Loading flag
 * @property {React.ReactNode} prefixIcon - Prefix icon
 * @property {React.ReactNode} suffixIcon - Suffix icon
 * @property {Function} validator - Validator function
 * @property {string} hint - Helper text
 * @property {string} className - Additional classes
 */