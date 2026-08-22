/**
 * useTheme.js
 * ─────────────────────────────────────────────────────────────
 * Advanced custom hook for accessing theme context with validation
 * * Features:
 * - Context validation with error handling
 * - TypeScript-ready JSDoc
 * - Performance optimized
 * - Development warnings
 * - Fallback theme support
 * * @version 1.0.0
 * @requires react@^18.2.0
 */

import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

/**
 * useTheme Hook
 * ─────────────────────────────────────────────────────────────
 * Custom hook to access theme context with validation
 * * @hook
 * @returns {Object} Theme context object
 * @returns {boolean} theme.isDark - Current theme is dark
 * @returns {Function} theme.toggleTheme - Toggle theme function
 * @returns {Function} theme.setTheme - Set specific theme
 * @returns {string} theme.theme - Current theme name ('light' | 'dark')
 * @returns {boolean} theme.isInitialized - Theme initialization status
 * * @throws {Error} When used outside ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error(
      '❌ useTheme() must be used within a <ThemeProvider>. ' +
      'Make sure your component is wrapped with ThemeProvider in the component tree.'
    );
  }

  if (process.env.NODE_ENV === 'development' && !context.isInitialized) {
    console.warn(
      '⚠️ Theme context is initializing. Some components may not reflect theme changes immediately.'
    );
  }

  return context;
};

/**
 * Alternative: useThemeOrDefault Hook
 * ─────────────────────────────────────────────────────────────
 * Same as useTheme but with default fallback (doesn't throw)
 */
export const useThemeOrDefault = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    return {
      isDark: false,
      theme: 'light',
      toggleTheme: () => {},
      setTheme: () => {},
      isInitialized: false,
    };
  }

  return context;
};