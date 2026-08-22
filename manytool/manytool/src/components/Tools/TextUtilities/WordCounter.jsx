import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

      {/* Main container bg transparent rakha hai taaki App.jsx ka bg control kare */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-extrabold text-gray-100 mb-2">Word Counter</h1>
          <p className="text-gray-400">Fast, private, and real-time text analysis.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <textarea
              value={text} onChange={(e) => setText(e.target.value)}
              className="w-full h-80 p-6 rounded-2xl border border-gray-700 bg-[#0f172a] text-gray-200 focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
              placeholder="Paste your text here..."
            />
            
            {/* Buttons wahi purane */}
            <div className="flex flex-wrap gap-3">
              <button onClick={handleClear} className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all">
                <RotateCcw size={16} /> Clear
              </button>
              
              <button onClick={() => handleAIAction('complexity')} disabled={!!loading || !text} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all">
                <Sparkles size={16} /> {loading === 'complexity' ? 'Analyzing...' : 'Complexity'}
              </button>

              <button onClick={() => handleAIAction('tone')} disabled={!!loading || !text} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all">
                <MessageSquare size={16} /> {loading === 'tone' ? 'Analyzing...' : 'Tone'}
              </button>

              <button onClick={() => handleAIAction('hinglish')} disabled={!!loading || !text} className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition-all">
                <Languages size={16} /> {loading === 'hinglish' ? 'Converting...' : 'Hinglish'}
              </button>

              <div className="flex items-center gap-2 bg-[#0f172a] p-1.5 rounded-xl border border-gray-700">
                <input 
                  type="number" value={targetWords} onChange={(e) => setTargetWords(e.target.value)}
                  className="w-16 bg-transparent px-2 outline-none text-sm font-bold text-white"
                />
                <button onClick={() => handleAIAction('suggestion')} disabled={!!loading || !text} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold">
                  <Target size={14} /> {loading === 'suggestion' ? '...' : 'Suggest'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 h-fit">
            {[
              { label: 'Words', val: metrics.words, icon: Zap, color: 'from-indigo-500 to-purple-600' },
              { label: 'Chars', val: metrics.characters, icon: BarChart3, color: 'from-blue-500 to-cyan-600' },
              { label: 'Read Time', val: `${metrics.readingTime}m`, icon: Clock, color: 'from-green-500 to-emerald-600' }
            ].map((m, i) => (
              <motion.div key={i} whileHover={{ y: -4 }} className={`p-6 rounded-2xl bg-gradient-to-br ${m.color} text-white shadow-xl`}>
                <m.icon className="mb-3 opacity-80" />
                <p className="text-4xl font-bold">{m.val}</p>
                <p className="text-sm opacity-80 uppercase tracking-wider">{m.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {analysis && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-2xl bg-[#0f172a] text-gray-200 border border-purple-500/30">
            <h3 className="text-purple-400 font-bold text-lg mb-2">{analysis.title}</h3>
            {analysis.score && <div className="text-5xl font-black mb-4 text-purple-200">{analysis.score}/10</div>}
            <p className="italic">"{analysis.reason}"</p>
          </motion.div>
        )}
        
        <Toast toasts={toasts} onRemove={removeToast} />
      </motion.div>
    </>
  );
};

export default WordCounter;