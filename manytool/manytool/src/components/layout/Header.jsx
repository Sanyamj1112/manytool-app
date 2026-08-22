import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/layout/ThemeToggle';

const Header = ({ onMenuToggle, isMobileMenuOpen = false }) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Logo & Branding */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.8 }} className="p-2 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
            <Zap className="w-6 h-6 text-white" strokeWidth={3} />
          </motion.div>
          
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ManyTool
            </h1>
            <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Utility Suite
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} 
        className="h-[2px] bg-gradient-to-r from-indigo-600 to-purple-600" 
      />
    </motion.header>
  );
};

export default Header;