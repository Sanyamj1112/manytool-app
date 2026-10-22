import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { RotateCcw, BarChart3, Zap, Clock, Sparkles, MessageSquare, Target } from 'lucide-react';
import { countTextMetrics } from '@/utils/textUtils';
import { useToast } from '@/Hooks/useToast';
import Toast from '@/components/common/Toast';
import { fetchGroqAI } from '@/services/aiService';
import ExportSuite from '@/components/common/ExportSuite';
import ToolFAQ from '@/components/common/ToolFAQ';

const wordCounterFaqs = [
  {
    q: 'How does the Word Counter calculate text metrics in real time?',
    a: 'As you type or paste text, ManyTool instantly processes characters, words, sentences, paragraphs, and reading time client-side in real time.',
  },
  {
    q: 'Is my text private and secure?',
    a: 'Yes, completely. All text processing and counting happens locally inside your browser. No text data is stored on or sent to any remote server.',
  },
  {
    q: 'How is reading time estimated?',
    a: 'Reading time is computed based on the standard average adult reading speed of 200 words per minute (WPM).',
  },
  {
    q: 'Does Word Counter support mobile and tablet browsers?',
    a: 'Yes, ManyTool is fully responsive and optimized for seamless operation across smartphones, tablets, and desktop workstations.',
  },
];

const WordCounter = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(null); 
  const [analysis, setAnalysis] = useState(null);
  const [targetWords, setTargetWords] = useState(500);
  const [metrics, setMetrics] = useState({
    characters: 0, charactersNoSpaces: 0, words: 0, sentences: 0, paragraphs: 0, readingTime: 1
  });

  const containerRef = useRef(null);
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => { setMetrics(countTextMetrics(text)); }, [text]);

  const handleClear = () => { 
    setText(''); 
    setAnalysis(null); 
    showToast('Text cleared!', 'info'); 
  };

  const handleAIAction = async (task) => {
    if (!text) return;
    setLoading(task);
    try {
      const promptData = task === 'suggestion' 
        ? `I have a goal of ${targetWords} words, but current is ${metrics.words} words. Suggest 3 key points I should add to reach the target.`
        : text;

      const result = await fetchGroqAI(promptData, task);
      
      if (task === 'complexity') {
        const [scorePart, reasonPart] = result.split('|');
        setAnalysis({ 
          title: 'Readability Evaluation',
          score: scorePart.replace('Score: ', '').trim(),
          reason: reasonPart.replace('Reason: ', '').trim()
        });
        showToast('Readability evaluation generated!', 'success');
      } else if (task === 'tone') {
        setAnalysis({ title: 'Tone Evaluation', score: null, reason: result });
        showToast('Tone evaluation completed!', 'success');
      } else if (task === 'suggestion') {
        setAnalysis({ title: 'Improvement Suggestions', score: null, reason: result });
        showToast('Improvement suggestions generated!', 'success');
      }
    } catch (err) {
      showToast('Processing Failed!', 'error');
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Free Online Word Counter & Character Count Tool | ManyTool</title>
        <meta name="description" content="Count words, characters, sentences, paragraphs, and reading time in real-time. Free online word counter with instant analysis, export options, and writing tools at ManyTool." />
      </Helmet>



      <motion.div 
        ref={containerRef} 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 max-w-7xl mx-auto space-y-8 pb-16 px-2 sm:px-6"
      >
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wider uppercase shadow-lg shadow-cyan-500/10">
                Text Utilities
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              Word Counter
            </h1>
          </div>
          <p className="text-gray-400 text-sm max-w-md">
            Lightning-fast, private, and real-time interactive text evaluation designed for high productivity.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Textarea & Actions Area */}
          <div className="lg:col-span-8 space-y-5">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-blue-500/40 rounded-[28px] blur-xl opacity-75 group-hover:opacity-100 transition duration-700"></div>
              
              <textarea
                value={text} 
                onChange={(e) => setText(e.target.value)}
                className="relative w-full h-[380px] p-6 rounded-[24px] bg-slate-950/85 backdrop-blur-2xl border border-white/15 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all shadow-2xl text-base resize-none leading-relaxed"
                placeholder="Type or paste your content here to begin evaluation..."
              />
            </div>
            
            {/* Ultra-Attractive Glowing Action Bar with Hover Tooltips & Export Suite */}
            <div className="flex flex-wrap items-center gap-3 bg-slate-900/90 backdrop-blur-2xl p-4 rounded-2xl border border-white/15 shadow-2xl">
              
              {/* Clear Button with Tooltip */}
              <div className="relative group/tip">
                <motion.button 
                  whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                  onClick={handleClear} 
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-red-500/10 cursor-pointer"
                >
                  <RotateCcw size={16} className="text-red-400 animate-spin-slow" /> Clear
                </motion.button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:flex px-3 py-1 bg-slate-900 text-gray-200 text-xs rounded-md shadow-xl border border-white/10 whitespace-nowrap z-50 pointer-events-none">
                  Clear input text
                </div>
              </div>
              
              <div className="h-6 w-[1px] bg-white/15 mx-1 hidden sm:block" />

              {/* Complexity Button with Tooltip */}
              <div className="relative group/tip">
                <motion.button 
                  whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                  onClick={() => handleAIAction('complexity')} 
                  disabled={!!loading || !text} 
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/40 hover:to-indigo-600/40 text-purple-200 border border-purple-500/50 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-purple-500/20 disabled:opacity-40 cursor-pointer"
                >
                  <Sparkles size={16} className="text-purple-400" /> {loading === 'complexity' ? 'Evaluating...' : 'Complexity'}
                </motion.button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:flex px-3 py-1 bg-slate-900 text-gray-200 text-xs rounded-md shadow-xl border border-white/10 whitespace-nowrap z-50 pointer-events-none">
                  Evaluate text readability score
                </div>
              </div>

              {/* Tone Button with Tooltip */}
              <div className="relative group/tip">
                <motion.button 
                  whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }}
                  onClick={() => handleAIAction('tone')} 
                  disabled={!!loading || !text} 
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/40 hover:to-teal-600/40 text-emerald-200 border border-emerald-500/50 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-40 cursor-pointer"
                >
                  <MessageSquare size={16} className="text-emerald-400" /> {loading === 'tone' ? 'Evaluating...' : 'Tone'}
                </motion.button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tip:flex px-3 py-1 bg-slate-900 text-gray-200 text-xs rounded-md shadow-xl border border-white/10 whitespace-nowrap z-50 pointer-events-none">
                  Detect writing tone & mood
                </div>
              </div>


              {/* One-Click Export Suite Integration */}
              <ExportSuite data={text || "No text provided"} filename="word-counter-export" />

              {/* Target Suggestion Box with Tooltip */}
              <div className="flex items-center gap-1.5 bg-slate-950/90 p-1.5 rounded-xl border border-cyan-500/40 ml-auto shadow-lg shadow-cyan-500/10 relative group/tip">
                <input 
                  type="number" 
                  value={targetWords} 
                  onChange={(e) => setTargetWords(e.target.value)}
                  className="w-14 bg-transparent px-2 outline-none text-sm font-bold text-cyan-300 text-center"
                />
                <motion.button 
                  whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                  onClick={() => handleAIAction('suggestion')} 
                  disabled={!!loading || !text} 
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg text-xs font-bold shadow-md shadow-cyan-500/30 transition-all disabled:opacity-40 cursor-pointer"
                >
                  <Target size={14} className="text-cyan-200" /> {loading === 'suggestion' ? '...' : 'Suggest'}
                </motion.button>
                <div className="absolute bottom-full right-0 mb-2 hidden group-hover/tip:flex px-3 py-1 bg-slate-900 text-gray-200 text-xs rounded-md shadow-xl border border-white/10 whitespace-nowrap z-50 pointer-events-none">
                  Get content suggestions for target word count
                </div>
              </div>

            </div>
          </div>

          {/* Right Metrics Bento Cards */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {[
              { label: 'Words Count', val: metrics.words, icon: Zap, gradient: 'from-purple-950/70 via-slate-950/90 to-indigo-950/70', border: 'border-purple-500/35', textCol: 'text-purple-300' },
              { label: 'Characters', val: metrics.characters, icon: BarChart3, gradient: 'from-blue-950/70 via-slate-950/90 to-cyan-950/70', border: 'border-cyan-500/35', textCol: 'text-cyan-300' },
              { label: 'Reading Time', val: `${metrics.readingTime}m`, icon: Clock, gradient: 'from-emerald-950/70 via-slate-950/90 to-teal-950/70', border: 'border-emerald-500/35', textCol: 'text-emerald-300' }
            ].map((m, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -4, scale: 1.01 }} 
                className={`p-6 rounded-[24px] bg-gradient-to-br ${m.gradient} border ${m.border} backdrop-blur-2xl shadow-2xl relative overflow-hidden group transition-all`}
              >
                <div className="absolute -right-4 -bottom-4 opacity-15 group-hover:opacity-30 transition-all duration-500 transform group-hover:scale-110">
                  <m.icon size={80} />
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl bg-white/10 border border-white/15 ${m.textCol}`}>
                    <m.icon size={20} />
                  </div>
                </div>
                <p className="text-4xl font-black tracking-tight text-white mb-1">{m.val}</p>
                <p className="text-xs uppercase tracking-widest font-semibold text-gray-300">{m.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Evaluation Result Section */}
        <AnimatePresence>
          {analysis && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.98 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: -20 }}
              className="p-8 rounded-[28px] bg-slate-950/90 text-gray-200 border border-purple-500/40 shadow-2xl relative overflow-hidden backdrop-blur-3xl"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>
              <h3 className="text-purple-300 font-bold text-lg mb-3 flex items-center gap-2">
                <Sparkles size={18} /> {analysis.title}
              </h3>
              {analysis.score && (
                <div className="text-5xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent">
                  {analysis.score}/10
                </div>
              )}
              <p className="text-gray-200 leading-relaxed italic text-base">"{analysis.reason}"</p>
            </motion.div>
          )}
        </AnimatePresence>

        <ToolFAQ faqs={wordCounterFaqs} title="Word Counter FAQs" />
        
        <Toast toasts={toasts} onRemove={removeToast} />
      </motion.div>
    </>
  );
};

export default WordCounter;