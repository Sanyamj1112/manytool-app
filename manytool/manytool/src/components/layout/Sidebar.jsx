/**
 * Sidebar.jsx
 * ─────────────────────────────────────────────────────────────
 * Sidebar with tool categories and history management
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Type, Zap, History, X, PanelLeftClose } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useHistory } from '@/context/HistoryContext';

const Sidebar = ({ isOpen = false, onClose }) => {
  const [expandedCategories, setExpandedCategories] = useState({ text: true, productivity: true, history: true });
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const { history, deleteHistoryItem, clearHistory } = useHistory();

  const toolsData = {
    text: {
      label: 'Text Utilities', icon: Type, color: 'from-blue-500 to-cyan-500',
      items: [
        { label: 'Word Counter', path: '/tools/word-counter' },
        { label: 'Case Converter', path: '/tools/case-converter' },
        { label: 'Lorem Ipsum', path: '/tools/lorem-ipsum' },
        { label: 'Slug Generator', path: '/tools/slug-generator' },
      ],
    },
    productivity: {
      label: 'Productivity', icon: Zap, color: 'from-purple-500 to-pink-500',
      items: [
        { label: 'Age Calculator', path: '/tools/age-calculator' },
        { label: 'Password Gen', path: '/tools/password-generator' },
        { label: 'Unit Converter', path: '/tools/unit-converter' },
      ],
    },
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const deleteSelected = () => {
    selectedIds.forEach(id => deleteHistoryItem(id));
    setSelectedIds([]);
    setIsSelectionMode(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed md:sticky top-20 z-50
        h-[calc(100vh-80px)] w-64 
        bg-[#0f172a] border-r border-cyan-500/20 
        overflow-y-auto transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 space-y-4">
          
          {/* Sidebar Top Header with Gemini-style Internal Collapse Toggle Button */}
          <div className="flex items-center justify-between px-2 pb-2 border-b border-cyan-900/30">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest font-mono">
              Workspace
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-400 border border-cyan-500/30 transition-all cursor-pointer shadow-sm"
              title="Close sidebar"
              type="button"
            >
              <PanelLeftClose size={16} />
            </button>
          </div>

          {/* Render Tools */}
          {Object.entries(toolsData).map(([id, cat]) => (
            <div key={id}>
              <button onClick={() => setExpandedCategories(p => ({ ...p, [id]: !p[id] }))} className="flex items-center justify-between w-full px-3 py-2 text-xs font-bold text-cyan-400 uppercase tracking-widest hover:bg-cyan-900/20 rounded-lg cursor-pointer">
                <span className="flex items-center gap-2"><div className={`p-1.5 rounded-md bg-gradient-to-br ${cat.color}`}><cat.icon className="w-3 h-3 text-white" /></div>{cat.label}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${expandedCategories[id] ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {expandedCategories[id] && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="pl-9 space-y-1 mt-1 overflow-hidden">
                    {cat.items.map(tool => (
                      <NavLink 
                        key={tool.path} 
                        to={tool.path} 
                        onClick={() => { if (onClose) onClose(); }}
                        className={({ isActive }) => `block px-3 py-2 text-sm font-medium rounded-lg ${isActive ? 'bg-cyan-900/30 text-cyan-400' : 'text-gray-400 hover:text-cyan-200'}`}
                      >
                        {tool.label}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* History Section */}
          <div className="border-t border-cyan-900/30 pt-4">
            <div className="flex items-center justify-between px-3 py-2">
              <button onClick={() => setExpandedCategories(p => ({ ...p, history: !p.history }))} className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase cursor-pointer">
                <History className="w-3 h-3" /> History ({history.length})
              </button>
              <div className="flex gap-2">
                {isSelectionMode ? (
                  <>
                    <button onClick={deleteSelected} className="text-[10px] text-red-400 font-bold cursor-pointer">Delete({selectedIds.length})</button>
                    <button onClick={() => setIsSelectionMode(false)} className="text-[10px] text-gray-400 cursor-pointer">Cancel</button>
                  </>
                ) : (
                  history.length > 0 && (
                    <>
                      <button onClick={() => setIsSelectionMode(true)} className="text-[10px] text-cyan-500 font-bold cursor-pointer">Select</button>
                      <button onClick={clearHistory} className="text-[10px] text-red-500 font-bold cursor-pointer">Clear All</button>
                    </>
                  )
                )}
              </div>
            </div>
            
            <div className="pl-2 space-y-1 mt-1">
              {history.map(item => (
                <div key={item.id} className="flex items-center justify-between px-3 py-2 text-xs text-gray-300 hover:bg-cyan-900/20 rounded-lg transition group">
                  <div className="flex items-center truncate w-[80%]">
                    {isSelectionMode && (
                      <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)} className="mr-2 accent-cyan-500 cursor-pointer" />
                    )}
                    <div className="truncate">
                      <p className="font-semibold text-[10px] text-cyan-500">{item.tool}</p>
                      <p className="text-[10px]">{item.result.substring(0, 15)}...</p>
                    </div>
                  </div>
                  {!isSelectionMode && (
                    <button onClick={() => deleteHistoryItem(item.id)} className="text-red-400 hover:text-red-600 p-1 bg-red-900/20 rounded cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;