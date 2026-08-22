import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link2, Sparkles, FolderTree } from 'lucide-react'; // FolderTree icon add kiya
import { generateSlug } from '@/utils/textUtils';
import CopyButton from '@/components/common/CopyButton';
import InputField from '@/components/common/InputField';
import { useToast } from '@/Hooks/useToast';
import Toast from '@/components/common/Toast';
import { fetchGroqAI } from '@/services/aiService';

const SlugGenerator = () => {
  const [text, setText] = useState('');
  const [separator, setSeparator] = useState('-');
  const [loading, setLoading] = useState(false);
  const [loadingHierarchy, setLoadingHierarchy] = useState(false); // Hierarchy loading state
  const { toasts, showToast, removeToast } = useToast();

  const handleAIOptimize = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const result = await fetchGroqAI(text, 'seoSlug');
      setText(result);
      showToast('Slug optimized by AI!', 'success', 2000);
    } catch (err) {
      showToast('AI Optimization Failed', 'error', 2000);
    } finally {
      setLoading(false);
    }
  };

  // Hierarchy Logic
  const handleGenerateHierarchy = async () => {
    if (!text) return;
    setLoadingHierarchy(true);
    try {
      const result = await fetchGroqAI(text, 'hierarchySlug');
      setText(result);
      showToast('Hierarchy structure generated!', 'success', 2000);
    } catch (err) {
      showToast('Failed to generate hierarchy', 'error', 2000);
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

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center gap-3">
          <div className="p-3 bg-green-500 rounded-xl text-white"><Link2 size={24} /></div>
          <div>
            <h1 className="text-3xl font-bold">Slug Generator</h1>
            <p className="text-gray-500">SEO-friendly URLs in seconds.</p>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
            <InputField label="Enter text" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g., Hello World" />
            
            {/* Buttons Container */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleAIOptimize} 
                disabled={loading || !text}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-all disabled:bg-gray-400"
              >
                <Sparkles size={16} /> {loading ? 'Optimizing...' : 'AI Optimize Slug'}
              </button>

              <button 
                onClick={handleGenerateHierarchy} 
                disabled={loadingHierarchy || !text}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold transition-all disabled:bg-gray-400"
              >
                <FolderTree size={16} /> {loadingHierarchy ? 'Planning...' : 'Plan Hierarchy'}
              </button>
            </div>
            
            <div>
              <label className="text-sm font-semibold mb-3 block">Separator</label>
              <div className="flex gap-2">
                {['-', '_', '.'].map((s) => (
                  <button key={s} onClick={() => setSeparator(s)} className={`px-4 py-2 rounded-lg font-bold transition-all ${separator === s ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl flex flex-col justify-center border border-gray-100 dark:border-gray-700">
            <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">Result</h3>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl font-mono text-lg break-all border border-gray-200 dark:border-gray-700 mb-4 min-h-[60px] flex items-center">
              {slug || <span className="text-gray-400 italic text-sm">Your slug...</span>}
            </div>
            {slug && <CopyButton text={slug} onCopy={() => showToast('Copied!', 'success')} className="w-full" />}
          </div>
        </div>

        <Toast toasts={toasts} onRemove={removeToast} />
      </motion.div>
    </>
  );
};

export default SlugGenerator;