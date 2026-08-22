/**
 * useLocalStorage.js
 * ─────────────────────────────────────────────────────────────
 * Advanced custom hook for localStorage with validation and sync
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export const useLocalStorage = (key, initialValue, options = {}) => {
  const isSSR = typeof window === 'undefined';
  const { serialize = JSON.stringify, deserialize = JSON.parse } = options;

  const [state, setState] = useState(() => {
    try {
      if (isSSR) return typeof initialValue === 'function' ? initialValue() : initialValue;
      const item = localStorage.getItem(key);
      return item !== null ? deserialize(item) : (typeof initialValue === 'function' ? initialValue() : initialValue);
    } catch (error) {
      console.error(`❌ Error reading from localStorage (key: ${key}):`, error);
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }
  });

  const prevKeyRef = useRef(key);

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value;
      setState(valueToStore);
      if (!isSSR) localStorage.setItem(key, serialize(valueToStore));
    } catch (error) {
      console.error(`❌ Error writing to localStorage (key: ${key}):`, error);
    }
  }, [key, state, serialize, isSSR]);

  const removeValue = useCallback(() => {
    try {
      setState(undefined);
      if (!isSSR) localStorage.removeItem(key);
    } catch (error) {
      console.error(`❌ Error removing from localStorage (key: ${key}):`, error);
    }
  }, [key, isSSR]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try { setState(deserialize(e.newValue)); }
        catch (error) { console.error(`❌ Error syncing localStorage:`, error); }
      }
    };
    if (!isSSR) {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [key, deserialize, isSSR]);

  return [state, setValue, removeValue];
};

export const useLocalStorageObject = (key, initialValue = {}) => {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue);
  const updateValue = useCallback((updates) => setValue(prev => ({ ...prev, ...updates })), [setValue]);
  return [value, updateValue, removeValue];
};

export const useLocalStorageArray = (key, initialValue = []) => {
  const [value, setValue] = useLocalStorage(key, initialValue);
  const arrayMethods = useCallback({
    push: (item) => setValue(prev => [...prev, item]),
    pop: () => setValue(prev => prev.slice(0, -1)),
    remove: (index) => setValue(prev => prev.filter((_, i) => i !== index)),
    clear: () => setValue([]),
  }, [setValue]);
  return [value || [], arrayMethods];
};