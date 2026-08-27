import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FileText, Copy, RotateCcw, Zap, LayoutTemplate, Languages, Sparkles } from 'lucide-react';
import { generateLoremIpsum } from '@/utils/textUtils';
import CopyButton from '@/components/common/CopyButton';
import { useToast } from '@/Hooks/useToast';
import Toast from '@/components/common/Toast';
import { fetchGroqAI } from '@/services/aiService';

const LoremIpsum = () => {
  const [paragraphCount, setParagraphCount] = useState(3);
  const [loremText, setLoremText] = useState(generateLoremIpsum(3));
  const [loading, setLoading] = useState(false);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const { toasts, showToast, removeToast } = useToast();

  // Unique Cursor Tracker for Lorem Ipsum (Amber / Orange / Red theme)
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

  const handleGenerate = useCallback(() => {
    const count = Math.max(1, Math.min(50, parseInt(paragraphCount) || 1));
    setParagraphCount(count);
    setLoremText(generateLoremIpsum(count));
    showToast(`Generated ${count} paragraph(s)!`, 'success', 2000);
  }, [paragraphCount, showToast]);

  const handleGenerateLayout = async () => {
    setLoading(true);
    try {
      const result = await fetchGroqAI('', 'layout');
      setLoremText(result);
      showToast('Design layout ready!', 'success', 2000);
    } catch (err) {
      showToast('Failed to generate layout', 'error', 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleMultiLang = async () => {
    setLoading(true);
    try {
      const result = await fetchGroqAI('', 'multiLang');
      setLoremText(result);
      showToast('Multi-language mockups created!', 'success', 2000);
    } catch (err) {
      showToast('Failed to generate multi-lang content', 'error', 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = useCallback(() => {
    setLoremText('');
    showToast('Text cleared!', 'info', 2000);
  }, [showToast]);

  const handleCountChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setParagraphCount(value ? parseInt(value) : '');
  };

  return (
    <>
      <Helmet>
        <title>Lorem Ipsum Generator - ManyTool | Placeholder Text</title>
      </Helmet>

      {/* Unique Cinematic Amber / Orange / Red Background Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full bg-orange-600/25 blur-[130px]"
          animate={{ x: mousePosition.x * 0.07, y: mousePosition.y * 0.07 }}
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
          style={{ top: '10%', left: '15%' }}
        />
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full bg-red-600/20 blur-[130px]"
          animate={{ x: -mousePosition.x * 0.06, y: -mousePosition.y * 0.06 }}
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
          style={{ bottom: '10%', right: '10%' }}
        />
        <motion.div 
          className="fixed w-[380px] h-[380px] rounded-full bg-amber-400/25 blur-[100px]"
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
        
        {/* Header Section matching other tools exactly */}
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-semibold tracking-wider uppercase shadow-lg shadow-orange-500/10">
                Text Utilities
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              Lorem Ipsum Generator
            </h1>
          </div>
          <p className="text-gray-400 text-sm max-w-md">
            Generate clean placeholder text, layouts, and multi-language mockups for your prototypes.
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Controls Panel (Span 4) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="p-6 rounded-[24px] bg-slate-950/85 backdrop-blur-2xl border border-white/15 shadow-2xl space-y-6 relative overflow-hidden">
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Number of Paragraphs (1-50)
                </label>
                <input
                  type="number"
                  min="1" 
                  max="50"
                  value={paragraphCount}
                  onChange={handleCountChange}
                  placeholder="Enter number"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white font-bold outline-none focus:ring-2 focus:ring-orange-400 transition-all shadow-inner text-sm"
                />
              </div>

              <div className="space-y-3">
                
                {/* Generate Button with Tooltip */}
                <div className="relative group/tip">
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} 
                    onClick={handleGenerate} 
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/20 transition-all text-sm"
                  >
                    <Zap size={16} /> Generate Paragraphs
                  </motion.button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:flex px-3 py-1 bg-slate-900 text-gray-200 text-xs rounded-md shadow-xl border border-white/10 whitespace-nowrap z-50 pointer-events-none">
                    Generate standard placeholder paragraphs
                  </div>
                </div>

                {/* Layout Structure Button with Tooltip */}
                <div className="relative group/tip">
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} 
                    onClick={handleGenerateLayout} 
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all text-sm disabled:opacity-40"
                  >
                    <LayoutTemplate size={16} /> {loading ? 'Generating...' : 'Layout Structure'}
                  </motion.button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:flex px-3 py-1 bg-slate-900 text-gray-200 text-xs rounded-md shadow-xl border border-white/10 whitespace-nowrap z-50 pointer-events-none">
                    Generate structured design wireframe text
                  </div>
                </div>

                {/* Multi-Language Button with Tooltip */}
                <div className="relative group/tip">
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} 
                    onClick={handleMultiLang} 
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-teal-500/20 transition-all text-sm disabled:opacity-40"
                  >
                    <Languages size={16} /> {loading ? 'Generating...' : 'Multi-Language'}
                  </motion.button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:flex px-3 py-1 bg-slate-900 text-gray-200 text-xs rounded-md shadow-xl border border-white/10 whitespace-nowrap z-50 pointer-events-none">
                    Generate mockups in multiple languages
                  </div>
                </div>

                {/* Clear Button with Tooltip */}
                <div className="relative group/tip">
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} 
                    onClick={handleClear} 
                    disabled={!loremText} 
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-xl font-medium transition-all text-sm disabled:opacity-30 shadow-md"
                  >
                    <RotateCcw size={15} /> Clear Text
                  </motion.button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:flex px-3 py-1 bg-slate-900 text-gray-200 text-xs rounded-md shadow-xl border border-white/10 whitespace-nowrap z-50 pointer-events-none">
                    Clear generated text area
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Right Output Panel (Span 8) */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="rounded-[24px] bg-slate-950/90 backdrop-blur-2xl border border-white/15 shadow-2xl overflow-hidden flex flex-col h-full relative">
              
              <div className="bg-gradient-to-r from-orange-600/40 via-red-600/40 to-purple-600/40 px-6 py-4 flex items-center justify-between border-b border-white/10">
                <span className="text-white font-bold text-sm flex items-center gap-2">
                  <FileText size={16} className="text-orange-400" /> Generated Placeholder Text
                </span>
                {loremText && (
                  <CopyButton text={loremText} onCopy={() => showToast('Copied to clipboard!', 'success', 2000)} size="sm" />
                )}
              </div>

              <div className="p-6 flex-1 overflow-y-auto max-h-[420px] leading-relaxed">
                <p className="text-gray-200 text-sm whitespace-pre-wrap font-mono">
                  {loremText || 'Your generated text will appear here...'}
                </p>
              </div>

            </div>
          </div>

        </div>

        <Toast toasts={toasts} onRemove={removeToast} />
      </motion.div>
    </>
  );
};

export default LoremIpsum;