/**
 * ThemeContext.jsx
 * ─────────────────────────────────────────────────────────────
 * Advanced theme management context with persistence and SSR support
 */

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';

export const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  // Hamesha true rakha hai taaki default hamesha dark rahe
  const [isDark, setIsDark] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Light mode option ko bypass karke hamesha dark set kar rahe hain
    const htmlElement = document.documentElement;
    htmlElement.classList.add('dark');
    localStorage.setItem('manytool-theme', 'dark');
    
    setIsDark(true);
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const htmlElement = document.documentElement;
    // Chahe kuch bhi ho, class hamesha 'dark' hi rahegi
    htmlElement.classList.add('dark');
    localStorage.setItem('manytool-theme', 'dark');
  }, [isInitialized]);

  // Toggle ya set theme ab hamesha dark ko hi force karega
  const toggleTheme = useCallback(() => {
    setIsDark(true);
  }, []);

  const setTheme = useCallback((theme) => {
    setIsDark(true);
  }, []);

  const value = useMemo(
    () => ({
      isDark: true,
      toggleTheme,
      setTheme,
      theme: 'dark',
      isInitialized,
    }),
    [toggleTheme, setTheme, isInitialized]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};