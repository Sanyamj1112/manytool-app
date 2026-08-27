import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link2, Sparkles, FolderTree, RotateCcw } from 'lucide-react';
import { generateSlug } from '@/utils/textUtils';
import CopyButton from '@/components/common/CopyButton';
import { useToast } from '@/Hooks/useToast';
import Toast from '@/components/common/Toast';
import { fetchGroqAI } from '@/services/aiService';

const SlugGenerator = () => {
  const [text, setText] = useState('');
  const [separator, setSeparator] = useState('-');
  const [loading, setLoading] = useState(false);
  const [loadingHierarchy, setLoadingHierarchy] = useState(false);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const { toasts, showToast, removeToast } = useToast();

  // Unique Cursor Tracker for Slug Generator (Cyan / Blue / Indigo theme)
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

  const handleAIOptimize = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const result = await fetchGroqAI(text, 'seoSlug');
      setText(result);
      showToast('Slug optimized successfully!', 'success');
    } catch (err) {
      showToast('Optimization Failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateHierarchy = async () => {
    if (!text) return;
    setLoadingHierarchy(true);
    try {
      const result = await fetchGroqAI(text, 'hierarchySlug');
      setText(result);
      showToast('Hierarchy structure generated!', 'success');
    } catch (err) {
      showToast('Failed to generate hierarchy', 'error');
    } finally {
      setLoadingHierarchy(false);
    }
  };

  const slug = useMemo(() => {
    if (!text) return '';
    return generateSlug(text).replace(/-/g, separator);
  }, [text, separator]);

  return (
    <>
      <Helmet>
        <title>Slug Generator | ManyTool</title>
      </Helmet>

      {/* Unique Cinematic Cyan / Blue / Indigo Background Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full bg-cyan-600/25 blur-[130px]"
          animate={{ x: mousePosition.x * 0.07, y: mousePosition.y * 0.07 }}
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
          style={{ top: '10%', left: '15%' }}
        />
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[130px]"
          animate={{ x: -mousePosition.x * 0.06, y: -mousePosition.y * 0.06 }}
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
          style={{ bottom: '10%', right: '10%' }}
        />
        <motion.div 
          className="fixed w-[380px] h-[380px] rounded-full bg-blue-400/25 blur-[100px]"
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
        
        {/* Header Section matching exact site typography & layout */}
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wider uppercase shadow-lg shadow-cyan-500/10">
                Text Utilities
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              Slug Generator
            </h1>
          </div>
          <p className="text-gray-400 text-sm max-w-md">
            Generate clean, SEO-friendly URL slugs and hierarchy structures in seconds.
          </p>
        </header>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Input & Action Panel */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 rounded-[24px] bg-slate-950/85 backdrop-blur-2xl border border-white/15 shadow-2xl space-y-6 relative overflow-hidden">
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Enter Text / Title
                </label>
                <input 
                  type="text"
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                  placeholder="e.g., Hello World - Ultimate Guide 2026" 
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white font-medium outline-none focus:ring-2 focus:ring-cyan-400 transition-all shadow-inner text-sm"
                />
              </div>
              
              {/* Action Buttons with Tooltips */}
              <div className="space-y-3">
                
                <div className="relative group/tip">
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                    onClick={handleAIOptimize} 
                    disabled={loading || !text}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all text-sm disabled:opacity-40"
                  >
                    <Sparkles size={16} /> {loading ? 'Optimizing...' : 'Optimize Slug'}
                  </motion.button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:flex px-3 py-1 bg-slate-900 text-gray-200 text-xs rounded-md shadow-xl border border-white/10 whitespace-nowrap z-50 pointer-events-none">
                    Smart optimize slug for SEO performance
                  </div>
                </div>

                <div className="relative group/tip">
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                    onClick={handleGenerateHierarchy} 
                    disabled={loadingHierarchy || !text}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-teal-500/20 transition-all text-sm disabled:opacity-40"
                  >
                    <FolderTree size={16} /> {loadingHierarchy ? 'Planning...' : 'Plan Hierarchy'}
                  </motion.button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:flex px-3 py-1 bg-slate-900 text-gray-200 text-xs rounded-md shadow-xl border border-white/10 whitespace-nowrap z-50 pointer-events-none">
                    Generate structured parent-child URL hierarchy
                  </div>
                </div>

                <div className="relative group/tip">
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                    onClick={handleClear}
                    disabled={!text}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-xl font-medium transition-all text-sm disabled:opacity-30 shadow-md"
                  >
                    <RotateCcw size={15} /> Clear Input
                  </motion.button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:flex px-3 py-1 bg-slate-900 text-gray-200 text-xs rounded-md shadow-xl border border-white/10 whitespace-nowrap z-50 pointer-events-none">
                    Clear text input
                  </div>
                </div>

              </div>

              {/* Separator Options */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block">Separator Character</label>
                <div className="flex gap-3">
                  {['-', '_', '.'].map((s) => (
                    <button 
                      key={s} 
                      onClick={() => setSeparator(s)} 
                      className={`flex-1 py-2.5 rounded-xl font-bold transition-all border shadow-md text-sm ${separator === s ? 'bg-cyan-500 text-white border-cyan-400 shadow-cyan-500/30' : 'bg-slate-900 text-gray-300 border-white/10 hover:bg-slate-800'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right Result Panel */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="p-8 rounded-[24px] bg-slate-950/90 backdrop-blur-2xl border border-white/15 shadow-2xl flex flex-col justify-between h-full relative overflow-hidden space-y-6">
              
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                  <Link2 size={15} /> Generated Result Slug
                </h3>
                
                <div className="bg-slate-900/90 p-5 rounded-2xl font-mono text-base text-gray-100 break-all border border-white/10 min-h-[90px] flex items-center shadow-inner">
                  {slug || <span className="text-gray-500 italic text-sm">Your formatted URL slug will appear here...</span>}
                </div>
              </div>

              {slug && (
                <div className="pt-2">
                  <CopyButton text={slug} onCopy={() => showToast('Slug copied to clipboard!', 'success')} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2" />
                </div>
              )}

            </div>
          </div>

        </div>

        <Toast toasts={toasts} onRemove={removeToast} />
      </motion.div>
    </>
  );
};

export default SlugGenerator;