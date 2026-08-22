import React, { useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/Hooks/useTheme';

const ThemeToggle = ({ className = '', showLabel = false }) => {
  const { isDark, toggleTheme, theme } = useTheme();

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  }, [toggleTheme]);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      className={`relative p-2.5 rounded-lg flex items-center gap-2 transition-colors duration-300 ${
        isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      type="button"
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div key="moon" initial={{ rotate: -180, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 180, opacity: 0 }}>
            <Moon className="w-5 h-5 text-indigo-400" strokeWidth={2.5} />
          </motion.div>
        ) : (
          <motion.div key="sun" initial={{ rotate: -180, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 180, opacity: 0 }}>
            <Sun className="w-5 h-5 text-yellow-500" strokeWidth={2.5} />
          </motion.div>
        )}
      </AnimatePresence>

      {showLabel && (
        <span className="text-xs font-semibold uppercase tracking-wider">{theme}</span>
      )}
    </motion.button>
  );
};

export default ThemeToggle;