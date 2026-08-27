import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { TOAST_TYPES } from '@/utils/constants';

const Toast = ({ toasts = [], onRemove, position = 'top-right' }) => {
  const iconMap = useMemo(() => ({
    [TOAST_TYPES.SUCCESS]: { icon: Check, color: 'text-emerald-400', bg: 'from-emerald-950/90 to-slate-950/95', border: 'border-emerald-500/40' },
    [TOAST_TYPES.ERROR]: { icon: AlertCircle, color: 'text-red-400', bg: 'from-red-950/90 to-slate-950/95', border: 'border-red-500/40' },
    [TOAST_TYPES.INFO]: { icon: Info, color: 'text-cyan-400', bg: 'from-blue-950/90 to-slate-950/95', border: 'border-cyan-500/40' },
    [TOAST_TYPES.WARNING]: { icon: AlertTriangle, color: 'text-amber-400', bg: 'from-amber-950/90 to-slate-950/95', border: 'border-amber-500/40' },
  }), []);

  const positionClasses = {
    'top-right': 'top-16 right-6', // Thoda aur upar kar diya hai taaki text hide na ho
    'top-left': 'top-16 left-6',
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  return (
    <div className={`fixed ${positionClasses[position] || positionClasses['top-right']} z-50 pointer-events-none flex flex-col gap-3`}>
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => {
          const config = iconMap[toast.type] || iconMap[TOAST_TYPES.INFO];
          const Icon = config.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`relative overflow-hidden bg-gradient-to-r ${config.bg} text-gray-100 px-5 py-3.5 rounded-2xl shadow-2xl border ${config.border} backdrop-blur-2xl min-w-[300px] flex items-center gap-3 pointer-events-auto`}
            >
              <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${config.color}`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
              </div>
              
              <p className="flex-1 font-medium text-sm leading-snug break-words text-gray-200">{toast.message}</p>
              
              <button 
                onClick={() => onRemove(toast.id)} 
                className="p-1.5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Progress bar timer */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 3, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 origin-left w-full"
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Toast;