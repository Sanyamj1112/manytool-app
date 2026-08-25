import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { RotateCcw, BarChart3, Zap, Clock, Sparkles, MessageSquare, Target, Languages } from 'lucide-react';
import { countTextMetrics } from '@/utils/textUtils';
import { useToast } from '@/Hooks/useToast';
import Toast from '@/components/common/Toast';
import { fetchGroqAI } from '@/services/aiService';

const WordCounter = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(null); 
  const [analysis, setAnalysis] = useState(null);
  const [targetWords, setTargetWords] = useState(500);
  const [metrics, setMetrics] = useState({
    characters: 0, charactersNoSpaces: 0, words: 0, sentences: 0, paragraphs: 0, readingTime: 1
  });

  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => { setMetrics(countTextMetrics(text)); }, [text]);

  const handleClear = () => { setText(''); setAnalysis(null); showToast('Text cleared!', 'info'); };

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
          title: 'Readability Analysis',
          score: scorePart.replace('Score: ', '').trim(),
          reason: reasonPart.replace('Reason: ', '').trim()
        });
      } else if (task === 'tone') {
        setAnalysis({ title: 'Tone Analysis', score: null, reason: result });
      } else if (task === 'suggestion') {
        setAnalysis({ title: 'Improvement Suggestions', score: null, reason: result });
      } else if (task === 'hinglish') {
        setAnalysis({ title: 'Hinglish Translation', score: null, reason: result });
      }
    } catch (err) {
      showToast('AI Analysis Failed!', 'error');
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Helmet><title>Word Counter | ManyTool</title></Helmet>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="border-b border-cyan-500/20 pb-4">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent mb-2">
            Word Counter & AI Studio
          </h1>
          <p className="text-gray-400 text-sm">Lightning-fast, private, and real-time interactive text insights.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Textarea & Actions Area */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <textarea
                value={text} 
                onChange={(e) => setText(e.target.value)}
                className="relative w-full h-80 p-6 rounded-2xl bg-[#0b1329]/90 backdrop-blur-xl border border-cyan-500/30 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none transition-all shadow-inner text-base resize-none"
                placeholder="Type or paste your text here to start exploring..."
              />
            </div>
            
            {/* Interactive Buttons Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <motion.button 
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={handleClear} 
                className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-medium transition-all shadow-lg"
              >
                <RotateCcw size={16} /> Clear
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => handleAIAction('complexity')} 
                disabled={!!loading || !text} 
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-xl font-medium transition-all shadow-lg disabled:opacity-50"
              >
                <Sparkles size={16} /> {loading === 'complexity' ? 'Analyzing...' : 'Complexity'}
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => handleAIAction('tone')} 
                disabled={!!loading || !text} 
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl font-medium transition-all shadow-lg disabled:opacity-50"
              >
                <MessageSquare size={16} /> {loading === 'tone' ? 'Analyzing...' : 'Tone'}
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => handleAIAction('hinglish')} 
                disabled={!!loading || !text} 
                className="flex items-center gap-2 px-4 py-2.5 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/40 rounded-xl font-medium transition-all shadow-lg disabled:opacity-50"
              >
                <Languages size={16} /> {loading === 'hinglish' ? 'Converting...' : 'Hinglish'}
              </motion.button>

              {/* Target Suggestion Box */}
              <div className="flex items-center gap-2 bg-[#0b1329]/90 p-1.5 rounded-xl border border-cyan-500/30 backdrop-blur-md ml-auto">
                <input 
                  type="number" 
                  value={targetWords} 
                  onChange={(e) => setTargetWords(e.target.value)}
                  className="w-14 bg-transparent px-2 outline-none text-sm font-bold text-cyan-300 text-center"
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => handleAIAction('suggestion')} 
                  disabled={!!loading || !text} 
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg text-xs font-bold shadow-md transition-all disabled:opacity-50"
                >
                  <Target size={14} /> {loading === 'suggestion' ? '...' : 'Suggest'}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Right Metrics Cards Area with Glassmorphism */}
          <div className="grid grid-cols-1 gap-4 h-fit">
            {[
              { label: 'Words', val: metrics.words, icon: Zap, glow: 'from-indigo-500/20 to-purple-500/20 border-purple-500/30 text-purple-400' },
              { label: 'Chars', val: metrics.characters, icon: BarChart3, glow: 'from-blue-500/20 to-cyan-500/20 border-cyan-500/30 text-cyan-400' },
              { label: 'Read Time', val: `${metrics.readingTime}m`, icon: Clock, glow: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400' }
            ].map((m, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -4, scale: 1.02 }} 
                className={`p-5 rounded-2xl bg-gradient-to-br ${m.glow} backdrop-blur-xl border shadow-2xl relative overflow-hidden group transition-all`}
              >
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <m.icon size={80} />
                </div>
                <m.icon className="mb-2 opacity-80" size={22} />
                <p className="text-3xl font-black text-white tracking-tight">{m.val}</p>
                <p className="text-xs uppercase tracking-widest font-semibold opacity-70 mt-1">{m.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Analysis Result Section */}
        <AnimatePresence>
          {analysis && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.98 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: -20 }}
              className="p-8 rounded-3xl bg-[#0b1329]/95 backdrop-blur-2xl text-gray-200 border border-purple-500/40 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <h3 className="text-purple-400 font-bold text-lg mb-2 flex items-center gap-2">
                <Sparkles size={18} /> {analysis.title}
              </h3>
              {analysis.score && (
                <div className="text-5xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {analysis.score}/10
                </div>
              )}
              <p className="text-gray-300 leading-relaxed italic whitespace-pre-wrap">"{analysis.reason}"</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Toast toasts={toasts} onRemove={removeToast} />
      </motion.div>
    </>
  );
};

export default WordCounter;