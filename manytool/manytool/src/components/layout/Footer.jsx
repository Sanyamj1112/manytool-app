import React from 'react';
import { motion } from 'framer-motion';
import { Github, Mail, Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const toolsCol1 = [
    { label: 'Word Counter', path: '/tools/word-counter' },
    { label: 'Case Converter', path: '/tools/case-converter' },
    { label: 'Lorem Ipsum', path: '/tools/lorem-ipsum' },
    { label: 'Slug Generator', path: '/tools/slug-generator' },
    { label: 'Image Compressor', path: '/tools/image-compressor' },
  ];

  const toolsCol2 = [
    { label: 'Age Calculator', path: '/tools/age-calculator' },
    { label: 'Password Gen', path: '/tools/password-generator' },
    { label: 'Unit Converter', path: '/tools/unit-converter' },
    { label: 'EMI Calculator', path: '/tools/emi-calculator' },
    { label: 'QR Code Generator', path: '/tools/qr-code' },
  ];

  return (
    <footer className="bg-[#060a12] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">

        {/* Brand (4 cols) */}
        <div className="md:col-span-4 space-y-3">
          <h3 className="text-lg font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            ManyTool
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
            Free, fast, and secure utility suite for developers, writers, and creators. No login required.
          </p>
          <div className="flex gap-3 pt-2">
            <motion.a
              whileHover={{ y: -2 }}
              href="https://github.com/Sanyamj1112"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <Github className="w-4 h-4" />
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              href="mailto:manytool211@gmail.com"
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-gray-400 hover:text-red-400 transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4" />
            </motion.a>
          </div>
        </div>

        {/* Tools (Compact 2-Column Split: 5 cols) */}
        <div className="md:col-span-5">
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Tools</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <ul className="space-y-2">
              {toolsCol1.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-xs sm:text-sm text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-700 group-hover:bg-cyan-400 transition-colors shrink-0" />
                    <span className="truncate">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-2">
              {toolsCol2.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-xs sm:text-sm text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-700 group-hover:bg-cyan-400 transition-colors shrink-0" />
                    <span className="truncate">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Company (3 cols) */}
        <div className="md:col-span-3">
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Company</h4>
          <ul className="space-y-2">
            {[
              { label: 'Home', path: '/' },
              { label: 'About Us', path: '/about' },
              { label: 'Privacy Policy', path: '/privacy' },
            ].map(({ label, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  className="text-xs sm:text-sm text-gray-500 hover:text-purple-400 transition-colors flex items-center gap-1.5 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-700 group-hover:bg-purple-400 transition-colors shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://manytool.in/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="text-xs sm:text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1.5"
              >
                Sitemap <ExternalLink size={11} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-5 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-600">
        <p>© {currentYear} ManyTool. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in India
        </p>
      </div>
    </footer>
  );
};

export default Footer;