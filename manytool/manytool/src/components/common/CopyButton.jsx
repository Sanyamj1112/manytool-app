import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, AlertCircle } from 'lucide-react';

const CopyButton = ({
  text,
  onCopy,
  onError,
  className = '',
  label = 'Copy to clipboard',
  title = 'Click to copy',
  variant = 'default',
  size = 'md',
}) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      const textToCopy = Array.isArray(text) ? text.join('\n') : text;
      if (!textToCopy) throw new Error('Invalid text');

      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError(true);
      onError?.(err);
      setTimeout(() => setError(false), 2000);
    }
  }, [text, onCopy, onError]);

  const sizeClasses = { sm: 'p-1.5 w-7 h-7', md: 'p-2 w-9 h-9', lg: 'p-3 w-11 h-11' };
  const iconSizes = { sm: 14, md: 18, lg: 22 };
  
  const variantClasses = {
    default: `bg-indigo-600 hover:bg-indigo-700 text-white ${copied ? 'bg-green-500' : ''} ${error ? 'bg-red-500' : ''}`,
    outline: `border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 ${copied ? 'border-green-500 text-green-500' : ''}`,
    ghost: `text-gray-600 hover:bg-gray-100 ${copied ? 'text-green-600' : ''}`
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
      onClick={handleCopy}
      className={`rounded-lg transition-all flex items-center justify-center ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      aria-label={label} title={title}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Check size={iconSizes[size]} />
          </motion.div>
        ) : error ? (
          <motion.div key="error" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <AlertCircle size={iconSizes[size]} />
          </motion.div>
        ) : (
          <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Copy size={iconSizes[size]} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default CopyButton;