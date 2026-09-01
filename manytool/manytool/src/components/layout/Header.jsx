import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Menu, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const Header = ({ onMenuToggle, isSidebarOpen = true }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 bg-[#090d16]/95 backdrop-blur-md border-b border-gray-800 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Logo & Sidebar Desktop Toggle Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-white/10 transition-all cursor-pointer shadow-sm hidden md:flex items-center justify-center"
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            type="button"
          >
            {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>

          {/* Clickable Logo/Branding leading directly to Home Page */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.8 }} className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg">
              <Zap className="w-6 h-6 text-white" strokeWidth={3} />
            </motion.div>
            
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                ManyTool
              </h1>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Utility Suite
              </span>
            </div>
          </Link>
        </div>

        {/* Mobile Menu Toggle Control */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg bg-gray-800 text-gray-200 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} 
        className="h-[2px] bg-gradient-to-r from-cyan-500 to-purple-600" 
      />
    </motion.header>
  );
};

export default Header;