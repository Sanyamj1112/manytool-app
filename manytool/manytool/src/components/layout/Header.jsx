import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen, Menu } from 'lucide-react';

// Inline SVG logo — hexagon + gear + wrench, cyan-to-purple gradient
const ManyToolLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="36" height="36">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
      <filter id="logoGlow">
        <feGaussianBlur stdDeviation="2.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Hexagon */}
    <polygon points="50,4 93,27 93,73 50,96 7,73 7,27" fill="#0a0f1e" stroke="url(#logoGrad)" strokeWidth="3" filter="url(#logoGlow)" />
    {/* Gear ring */}
    <circle cx="50" cy="53" r="21" fill="none" stroke="url(#logoGrad)" strokeWidth="3" strokeDasharray="5.5 2.5" />
    {/* Gear center */}
    <circle cx="50" cy="53" r="7.5" fill="#0a0f1e" stroke="url(#logoGrad)" strokeWidth="2.2" />
    {/* Wrench */}
    <path d="M39,29 C36,22 43,15 49,18 L46,24 L49,27 L57,35 L59,33 L62,30 C67,35 65,43 60,45 L44,61 C42,68 33,69 29,64 C25,59 27,50 34,50 L50,34 Z" fill="none" stroke="url(#logoGrad)" strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round" filter="url(#logoGlow)" />
    {/* Center dot */}
    <circle cx="50" cy="53" r="3.5" fill="url(#logoGrad)" />
  </svg>
);

const Header = ({ onMenuToggle, isSidebarOpen = true }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 bg-[#070913]/95 backdrop-blur-md border-b border-white/10 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">

        {/* Left: Sidebar toggle + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-white/10 transition-all cursor-pointer shadow-sm hidden md:flex items-center justify-center"
            title={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            type="button"
          >
            {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.9, ease: 'easeInOut' }}>
              <ManyToolLogo />
            </motion.div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                ManyTool
              </h1>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] leading-tight">
                Utility Suite
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Mobile menu */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Mobile menu toggle */}
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg bg-slate-900 text-gray-300 border border-white/10 transition-colors cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Gradient border bottom line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6 }}
        className="h-[1.5px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
      />
    </motion.header>
  );
};

export default Header;