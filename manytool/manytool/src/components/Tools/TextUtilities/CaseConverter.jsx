import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Type, Sparkles, Terminal } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  const handleAIAction = async (task) => {
    if (!text) return;
    setLoading(true);
    try {
      const result = await fetchGroqAI(text, task);
      setText(result);
      showToast('AI Processed successfully!', 'success');
    } catch (err) {
      showToast('AI Error: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const convertedCases = useMemo(() => 
    CASE_OPTIONS.reduce((acc, opt) => ({ ...acc, [opt.id]: text ? convertCase(text, opt.id) : '' }), {}),
  [text]);

  return (
    <>
      <Helmet><title>Case Converter | ManyTool</title></Helmet>
      
      {/* Light mode mein bg-gray-50 aur dark mein deep navy */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto space-y-8">
        
        <header className="flex items-center justify-between p-8 bg-white dark:bg-[#0f172a] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl text-white shadow-lg"><Type size={28} /></div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">Case Converter</h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Transform text styles instantly.</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button onClick={() => handleAIAction('grammar')} disabled={loading} className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all">
              <Sparkles size={18} /> {loading ? '...' : 'Fix Grammar'}
            </button>
            <button onClick={() => handleAIAction('summarize')} disabled={loading} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all">
              <Sparkles size={18} /> Summarize
            </button>
            <button onClick={() => handleAIAction('promptPro')} disabled={loading} className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all">
              <Terminal size={18} /> Prompt Pro
            </button>
          </div>
        </header>

        <textarea
          value={text} onChange={(e) => setText(e.target.value)}
          className="w-full h-48 p-8 rounded-3xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-[#080d1a] text-gray-900 dark:text-gray-100 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all shadow-inner"
          placeholder="Paste your text here to transform..."
        />

        <div className="grid md:grid-cols-2 gap-6">
          {CASE_OPTIONS.map((opt) => (
            <motion.div 
              key={opt.id} 
              whileHover={{ y: -4 }}
              className="p-8 bg-white dark:bg-[#0f172a] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{opt.label}</h3>
                {text && <CopyButton text={convertedCases[opt.id]} onCopy={() => showToast('Copied!', 'success')} size="sm" />}
              </div>
              <p className="text-gray-800 dark:text-gray-200 font-mono text-lg break-words min-h-[60px]">
                {convertedCases[opt.id] || <span className="italic opacity-30">Waiting for input...</span>}
              </p>
            </motion.div>
          ))}
        </div>
        <Toast toasts={toasts} onRemove={removeToast} />
      </motion.div>
    </>
  );
};

export default CaseConverter;