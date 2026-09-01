/**
 * @file CommandPalette.jsx
 * @description Quick Command Palette modal triggered via Ctrl+K / Cmd+K for lightning-fast tool navigation.
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Type, AlignLeft, Link2, Timer, ShieldCheck, Gauge, X, ArrowRight } from 'lucide-react';

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const tools = [
    { name: 'Word Counter', path: '/tools/word-counter', icon: FileText, category: 'Text Utilities' },
    { name: 'Case Converter', path: '/tools/case-converter', icon: Type, category: 'Text Utilities' },
    { name: 'Lorem Ipsum', path: '/tools/lorem-ipsum', icon: AlignLeft, category: 'Text Utilities' },
    { name: 'Slug Generator', path: '/tools/slug-generator', icon: Link2, category: 'Text Utilities' },
    { name: 'Age Calculator', path: '/tools/age-calculator', icon: Timer, category: 'Productivity' },
    { name: 'Password Generator', path: '/tools/password-generator', icon: ShieldCheck, category: 'Productivity' },
    { name: 'Unit Converter', path: '/tools/unit-converter', icon: Gauge, category: 'Productivity' },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredTools = tools.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="w-full max-w-xl bg-slate-950 border border-cyan-500/40 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden font-mono"
      >
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search size={18} className="text-cyan-400" />
          <input
            type="text"
            autoFocus
            placeholder="Type a tool name (e.g., Password, Word)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder:text-gray-500 outline-none text-sm font-mono"
          />
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg bg-slate-900 text-gray-400 hover:text-white cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {filteredTools.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-xs">No tools found matching "{query}"</div>
          ) : (
            filteredTools.map((tool) => {
              const IconComp = tool.icon;
              return (
                <button
                  key={tool.path}
                  onClick={() => {
                    navigate(tool.path);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-cyan-500/10 text-left transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-cyan-400 group-hover:scale-110 transition-transform">
                      <IconComp size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{tool.name}</p>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest">{tool.category}</span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2.5 bg-slate-900/50 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500">
          <span>Press <strong className="text-cyan-400">ESC</strong> to close</span>
          <span>Navigation Command Palette</span>
        </div>
      </motion.div>
    </div>
  );
};

export default CommandPalette;