import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FileText, Copy, RotateCcw, Zap, LayoutTemplate, Languages } from 'lucide-react'; // Languages add kiya
import { generateLoremIpsum } from '@/utils/textUtils';
import CopyButton from '@/components/common/CopyButton';
import InputField from '@/components/common/InputField';
import { useToast } from '@/Hooks/useToast';
import Toast from '@/components/common/Toast';
import { fetchGroqAI } from '@/services/aiService';

const LoremIpsum = () => {
  const [paragraphCount, setParagraphCount] = useState(3);
  const [loremText, setLoremText] = useState(generateLoremIpsum(3));
  const [loading, setLoading] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

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
      showToast('Design layout generated!', 'success', 2000);
    } catch (err) {
      showToast('Failed to generate layout', 'error', 2000);
    } finally {
      setLoading(false);
    }
  };

  // Naya Multi-Language Logic
  const handleMultiLang = async () => {
    setLoading(true);
    try {
      const result = await fetchGroqAI('', 'multiLang');
      setLoremText(result);
      showToast('Multi-language content ready!', 'success', 2000);
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

  const handleCountChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, '');
    setParagraphCount(value ? parseInt(value) : '');
  }, []);

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Helmet>
        <title>Lorem Ipsum Generator - ManyTool | Placeholder Text</title>
      </Helmet>

      <motion.div variants={containerVariants} initial="initial" animate="animate" className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Lorem Ipsum Generator</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Generate placeholder text for your designs and prototypes.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 space-y-6">
              <InputField
                name="paragraph-count"
                label="Number of Paragraphs"
                type="number"
                min="1" max="50"
                value={paragraphCount}
                onChange={handleCountChange}
                placeholder="Enter number (1-50)"
                maxLength={2}
              />

              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleGenerate} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold shadow-lg transition-all">
                <Zap className="w-5 h-5" /> Generate
              </motion.button>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleGenerateLayout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-lg transition-all">
                <LayoutTemplate className="w-5 h-5" /> {loading ? 'Generating...' : 'Layout Structure'}
              </motion.button>

              {/* Multi-Lang Button Added */}
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleMultiLang} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow-lg transition-all">
                <Languages className="w-5 h-5" /> {loading ? 'Generating...' : 'Multi-Language'}
              </motion.button>

              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleClear} disabled={!loremText} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors">
                <RotateCcw className="w-4 h-4" /> Clear
              </motion.button>
            </div>
          </motion.div>

          <motion.div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 flex items-center justify-between">
                <h3 className="text-white font-semibold">Generated Text</h3>
                {loremText && (
                  <CopyButton text={loremText} onCopy={() => showToast('Copied!', 'success', 2000)} size="sm" />
                )}
              </div>
              <div className="p-6 flex-1 overflow-y-auto max-h-96">
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{loremText || 'Your text will appear here...'}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default LoremIpsum;