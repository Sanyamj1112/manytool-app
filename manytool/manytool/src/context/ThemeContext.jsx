/**
 * ThemeContext.jsx
 * ─────────────────────────────────────────────────────────────
 * Advanced theme management context with persistence and SSR support
 */

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';

export const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('manytool-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = storedTheme ? storedTheme === 'dark' : prefersDark;
    setIsDark(initialTheme);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.add('dark');
      localStorage.setItem('manytool-theme', 'dark');
    } else {
      htmlElement.classList.remove('dark');
      localStorage.setItem('manytool-theme', 'light');
    }
  }, [isDark, isInitialized]);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  const setTheme = useCallback((theme) => {
    setIsDark(theme === 'dark' || theme === true);
  }, []);

  const value = useMemo(
    () => ({
      isDark,
      toggleTheme,
      setTheme,
      theme: isDark ? 'dark' : 'light',
      isInitialized,
    }),
    [isDark, toggleTheme, setTheme, isInitialized]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};