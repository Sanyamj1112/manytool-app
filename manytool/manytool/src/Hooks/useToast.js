/**
 * useToast.js
 * ─────────────────────────────────────────────────────────────
 * Advanced custom hook for toast notifications management
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { TOAST_TYPES } from '@/utils/constants';

const DEFAULT_DURATION = 3000;
const MAX_TOASTS = 5;
let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const timeoutRefs = useRef({});

  const showToast = useCallback((message, type = TOAST_TYPES.INFO, duration = DEFAULT_DURATION) => {
    if (!message || typeof message !== 'string') {
      console.error('❌ Toast message must be a non-empty string');
      return null;
    }

    if (!Object.values(TOAST_TYPES).includes(type)) {
      console.warn(`⚠️ Invalid toast type: ${type}. Using 'info' instead.`);
      type = TOAST_TYPES.INFO;
    }

    const id = ++toastId;
    const newToast = { id, message, type, createdAt: Date.now() };

    setToasts(prev => [...prev, newToast].slice(-MAX_TOASTS));

    if (timeoutRefs.current[id]) clearTimeout(timeoutRefs.current[id]);

    if (duration > 0) {
      timeoutRefs.current[id] = setTimeout(() => removeToast(id), duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
      delete timeoutRefs.current[id];
    }
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
    Object.values(timeoutRefs.current).forEach(clearTimeout);
    timeoutRefs.current = {};
  }, []);

  useEffect(() => {
    return () => Object.values(timeoutRefs.current).forEach(clearTimeout);
  }, []);

  return { toasts, showToast, removeToast, clearAll };
};