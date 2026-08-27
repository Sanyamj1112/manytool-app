import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { RotateCcw, Copy, Check, Type, Sparkles, Wand2, Terminal } from 'lucide-react';
import { convertCase } from '@/utils/textUtils';
import CopyButton from '@/components/common/CopyButton';
import { useToast } from '@/Hooks/useToast';
import Toast from '@/components/common/Toast';
import { fetchGroqAI } from '@/services/aiService';

const CASE_OPTIONS = [
  { id: 'upper', label: 'UPPERCASE' },
  { id: 'lower', label: 'lowercase' },
  { id: 'title', label: 'Title Case' },
  { id: 'sentence', label: 'Sentence case' },
  { id: 'alternating', label: 'aLtErNaTiNg' },
];

const CaseConverter = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef(null);
  const { toasts, showToast, removeToast } = useToast();

  // Unique Cursor Tracker for Case Converter (Emerald / Teal / Amber theme)
  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) setMousePosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleClear = () => {
    setText('');
    showToast('Text cleared!', 'info');
  };

  const handleAIAction = async (task) => {
    if (!text) return;
    setLoading(task);
    try {
      const result = await fetchGroqAI(text, task);
      setText(result);
      
      if (task === 'grammar') {
        showToast('Grammar fixed successfully!', 'success');
      } else if (task === 'summarize') {
        showToast('Text summary generated!', 'success');
      } else if (task === 'promptPro') {
        showToast('Prompt Pro transformation ready!', 'success');
      } else {
        showToast('Text processed successfully!', 'success');
      }
    } catch (err) {
      showToast('Processing Error: ' + err.message, 'error');
    } finally {
      setLoading(null);
    }
  };

  const convertedCases = useMemo(() => 
    CASE_OPTIONS.reduce((acc, opt) => ({ ...acc, [opt.id]: text ? convertCase(text, opt.id) : '' }), {}),
  [text]);

  return (
    <>
      <Helmet><title>Case Converter | ManyTool</title></Helmet>

      {/* Unique Cinematic Emerald / Teal / Amber Background Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full bg-emerald-600/25 blur-[130px]"
          animate={{ x: mousePosition.x * 0.07, y: mousePosition.y * 0.07 }}
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
          style={{ top: '10%', left: '15%' }}
        />
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full bg-amber-600/20 blur-[130px]"
          animate={{ x: -mousePosition.x * 0.06, y: -mousePosition.y * 0.06 }}
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
          style={{ bottom: '10%', right: '10%' }}
        />
        <motion.div 
          className="fixed w-[380px] h-[380px] rounded-full bg-teal-400/25 blur-[100px]"
          animate={{ x: mousePosition.x - 190, y: mousePosition.y - 190 }}
          transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
        />
      </div>

      <motion.div 
        ref={containerRef} 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 max-w-7xl mx-auto space-y-8 pb-16 px-2 sm:px-6"
      >
        
        {/* Header Section matching Word Counter's exact layout & typography */}
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wider uppercase shadow-lg shadow-emerald-500/10">
                Text Utilities
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              Case Converter
            </h1>
          </div>
          <p className="text-gray-400 text-sm max-w-md">
            Transform text styles instantly with advanced case formatting and tools.
          </p>
        </header>

        {/* Textarea Input Section */}
        <div className="space-y-5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/40 via-teal-500/40 to-amber-500/40 rounded-[28px] blur-xl opacity-75 group-hover:opacity-100 transition duration-700"></div>
            
            <textarea
              value={text} 
              onChange={(e) => setText(e.target.value)}
              className="relative w-full h-[260px] p-6 rounded-[24px] bg-slate-950/85 backdrop-blur-2xl border border-white/15 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition-all shadow-2xl text-base resize-none leading-relaxed"
              placeholder="Paste your text here to transform..."
            />
          </div>
          
          {/* Glowing Action Bar with Hover Tooltips */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-900/90 backdrop-blur-2xl p-4 rounded-2xl border border-white/15 shadow-2xl">
            
            {/* Clear Button with Tooltip */}
            <div className="relative group/tip">
              <motion.button 
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                onClick={handleClear} 
                className="flex items-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-xl font-semibold text-sm transition-all shadow-lg"
              >
                <RotateCcw size={16} /> Clear
              </motion.button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:flex px-3 py-1 bg-slate-900 text-gray-200 text-xs rounded-md shadow-xl border border-white/10 whitespace-nowrap z-50 pointer-events-none">
                Clear input text
              </div>
            </div>
            
            <div className="h-6 w-[1px] bg-white/15 mx-1 hidden sm:block" />

            {/* Fix Grammar Button with Tooltip */}
            <div className="relative group/tip">
              <motion.button 
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                onClick={() => handleAIAction('grammar')} 
                disabled={loading} 
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/40 hover:to-teal-600/40 text-emerald-200 border border-emerald-500/50 rounded-xl font-semibold text-sm transition-all shadow-lg disabled:opacity-40"
              >
                <Sparkles size={16} className="text-emerald-400" /> {loading === 'grammar' ? 'Fixing...' : 'Fix Grammar'}
              </motion.button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:flex px-3 py-1 bg-slate-900 text-gray-200 text-xs rounded-md shadow-xl border border-white/10 whitespace-nowrap z-50 pointer-events-none">
                Correct grammar and sentence structure
              </div>
            </div>

            {/* Summarize Button with Tooltip */}
            <div className="relative group/tip">
              <motion.button 
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                onClick={() => handleAIAction('summarize')} 
                disabled={loading} 
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600/30 to-cyan-600/30 hover:from-teal-600/40 hover:to-cyan-600/40 text-teal-200 border border-teal-500/50 rounded-xl font-semibold text-sm transition-all shadow-lg disabled:opacity-40"
              >
                <Wand2 size={16} className="text-teal-400" /> {loading === 'summarize' ? 'Summarizing...' : 'Summarize'}
              </motion.button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:flex px-3 py-1 bg-slate-900 text-gray-200 text-xs rounded-md shadow-xl border border-white/10 whitespace-nowrap z-50 pointer-events-none">
                Generate concise text summary
              </div>
            </div>

            {/* Prompt Pro Button with Tooltip */}
            <div className="relative group/tip">
              <motion.button 
                whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                onClick={() => handleAIAction('promptPro')} 
                disabled={loading} 
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/40 hover:to-blue-600/40 text-cyan-200 border border-cyan-500/50 rounded-xl font-semibold text-sm transition-all shadow-lg disabled:opacity-40"
              >
                <Terminal size={16} className="text-cyan-400" /> {loading === 'promptPro' ? 'Processing...' : 'Prompt Pro'}
              </motion.button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:flex px-3 py-1 bg-slate-900 text-gray-200 text-xs rounded-md shadow-xl border border-white/10 whitespace-nowrap z-50 pointer-events-none">
                Enhance prompt formatting & precision
              </div>
            </div>

          </div>
        </div>

        {/* Output Cases Grid Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {CASE_OPTIONS.map((opt) => (
            <motion.div 
              key={opt.id} 
              whileHover={{ y: -4, scale: 1.01 }}
              className="p-6 rounded-[24px] bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-xl flex flex-col justify-between gap-4 relative overflow-hidden group"
            >
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-all">
                <Type size={80} />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-xs uppercase tracking-[0.2em] text-emerald-400">{opt.label}</h3>
                  {text && <CopyButton text={convertedCases[opt.id]} onCopy={() => showToast('Copied!', 'success')} size="sm" />}
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/5 min-h-[60px] max-h-[120px] overflow-y-auto">
                  <p className="text-gray-200 font-mono text-base break-words">
                    {convertedCases[opt.id] || <span className="italic opacity-30">Waiting for input...</span>}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Toast toasts={toasts} onRemove={removeToast} />
      </motion.div>
    </>
  );
};

export default CaseConverter;