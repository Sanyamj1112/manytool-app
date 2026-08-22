/**
 * Footer.jsx
 * ─────────────────────────────────────────────────────────────
 * Footer with navigation links and social connections
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import added

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, label: 'GitHub', href: 'https://github.com/Sanyamj1112', color: 'hover:text-gray-900 dark:hover:text-white' },
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com', color: 'hover:text-blue-500' },
    { icon: Mail, label: 'Email', href: 'mailto:contact@manytool.com', color: 'hover:text-red-500' },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        <div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-4">ManyTool</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            A high-performance utility suite built for developers and creators. Clean, fast, and accessible.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors">Home</Link></li>
            <li><Link to="/tools/word-counter" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors">Tools</Link></li>
            <li><Link to="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors">About</Link></li>
            <li><Link to="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 transition-colors">Privacy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Connect</h4>
          <div className="flex gap-4">
            {socialLinks.map((s, i) => (
              <motion.a key={i} whileHover={{ y: -3 }} href={s.href} target="_blank" rel="noreferrer" className={`p-2 rounded-lg bg-gray-200 dark:bg-gray-800 transition-colors ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
        <p>© {currentYear} ManyTool. All rights reserved.</p>
        <p className="flex items-center gap-1">Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by TBM EARTH</p>
      </div>
    </footer>
  );
};

export default Footer;