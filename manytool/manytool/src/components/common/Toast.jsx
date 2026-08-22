/**
 * Toast.jsx
 * ─────────────────────────────────────────────────────────────
 * Advanced toast notification component with animations
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { TOAST_TYPES } from '@/utils/constants';

const Toast = ({ toasts = [], onRemove, position = 'top-right' }) => {
  const iconMap = useMemo(() => ({
    [TOAST_TYPES.SUCCESS]: { icon: Check, bgColor: 'bg-green-500', borderColor: 'border-green-600' },
    [TOAST_TYPES.ERROR]: { icon: AlertCircle, bgColor: 'bg-red-500', borderColor: 'border-red-600' },
    [TOAST_TYPES.INFO]: { icon: Info, bgColor: 'bg-blue-500', borderColor: 'border-blue-600' },
    [TOAST_TYPES.WARNING]: { icon: AlertTriangle, bgColor: 'bg-yellow-500', borderColor: 'border-yellow-600' },
  }), []);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 pointer-events-none flex flex-col gap-3`}>
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => {
          const config = iconMap[toast.type] || iconMap[TOAST_TYPES.INFO];
          const Icon = config.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={`${config.bgColor} text-white px-6 py-4 rounded-lg shadow-xl border-l-4 ${config.borderColor} backdrop-blur-md bg-opacity-95 min-w-[300px] flex items-start gap-3 pointer-events-auto`}
            >
              <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="flex-1 font-medium text-sm leading-tight break-words">{toast.message}</p>
              <button onClick={() => onRemove(toast.id)} className="p-1 hover:bg-white/20 rounded-md">
                <X className="w-4 h-4" />
              </button>
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 3, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-1 bg-white/50 origin-left w-full"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Toast;