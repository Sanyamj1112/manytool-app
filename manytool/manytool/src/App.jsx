import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, NavLink } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Type, AlignLeft, Link2, Timer,
  ShieldCheck, Gauge, ArrowRight, Sparkles,
  Star, Zap, Globe, ImageDown, QrCode, Calculator, Languages
} from 'lucide-react';

// Layout Components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Common Components
import CommandPalette from './components/common/CommandPalette';

// Tool Components
import WordCounter from './components/Tools/TextUtilities/WordCounter';
import CaseConverter from './components/Tools/TextUtilities/CaseConverter';
import LoremIpsum from './components/Tools/TextUtilities/LoremIpsum';
import SlugGenerator from './components/Tools/TextUtilities/SlugGenerator';
import AgeCalculator from './components/Tools/ProductivityTools/AgeCalculator';
import PasswordGenerator from './components/Tools/ProductivityTools/PasswordGenerator';
import UnitConverter from './components/Tools/ProductivityTools/UnitConverter';
import EMICalculator from './components/Tools/ProductivityTools/EMICalculator';
import ImageCompressor from './components/Tools/MediaTools/ImageCompressor';
import QRCodeGenerator from './components/Tools/MediaTools/QRCodeGenerator';
import AboutPage from './components/AboutPage';
import PrivacyPage from './components/PrivacyPage';
import NotFound from './components/NotFound';

// Analytics & Admin
import { logAnalytics } from './services/supabaseClient';
import AdminDashboard from './components/AdminDashboard';

import { ThemeProvider } from './context/ThemeContext';
import { HistoryProvider } from './context/HistoryContext';

// ─── Route Tracker ───
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('admin-dashboard')) return;
    const routeMap = {
      'fix-grammar': 'Grammar Fixer',
      'prompt-enhancer': 'Prompt Enhancer',
      'text-summarizer': 'Text Summarizer',
      'upi-qr-code': 'UPI QR Code Generator',
      'wifi-qr-code': 'WiFi QR Code Generator',
      'whatsapp-qr-code': 'WhatsApp QR Code Generator',
      'home-loan-emi-calculator': 'Home Loan EMI Calculator',
      'car-loan-emi-calculator': 'Car Loan EMI Calculator',
      'personal-loan-emi-calculator': 'Personal Loan EMI Calculator',
      'compress-image-50kb': 'Compress Image 50KB',
      'compress-image-100kb': 'Compress Image 100KB',
      'zodiac-sign-calculator': 'Zodiac Calculator',
      'strong-password-generator': 'Strong Password Generator',
      'word-counter': 'Word Counter',
      'case-converter': 'Case Converter',
      'lorem-ipsum': 'Lorem Ipsum',
      'slug-generator': 'Slug Generator',
      'age-calculator': 'Age Calculator',
      'password-generator': 'Password Generator',
      'unit-converter': 'Unit Converter',
      'image-compressor': 'Image Compressor',
      'qr-code': 'QR Code Generator',
      'emi-calculator': 'EMI Calculator',
      'about': 'About Page',
      'privacy': 'Privacy Policy',
    };
    const matched = Object.entries(routeMap).find(([key]) => location.pathname.includes(key));
    logAnalytics(matched ? matched[1] : 'Home Page');
  }, [location]);

  return null;
}

// ─── Home Page ───
const tools = [
  { title: 'Word Counter', desc: 'Count words, characters, sentences, and reading time in real-time.', path: '/tools/word-counter', icon: FileText, color: 'text-cyan-400', glow: 'shadow-cyan-500/20', badge: 'Text Tool', badgeColor: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400' },
  { title: 'Case Converter', desc: 'Transform text to uppercase, lowercase, title case and more.', path: '/tools/case-converter', icon: Type, color: 'text-purple-400', glow: 'shadow-purple-500/20', badge: 'Text Tool', badgeColor: 'bg-purple-500/15 border-purple-500/30 text-purple-400' },
  { title: 'Lorem Ipsum', desc: 'Generate professional placeholder text for design layouts.', path: '/tools/lorem-ipsum', icon: AlignLeft, color: 'text-amber-400', glow: 'shadow-amber-500/20', badge: 'Generator', badgeColor: 'bg-amber-500/15 border-amber-500/30 text-amber-400' },
  { title: 'Slug Generator', desc: 'Create clean, SEO-friendly URL slugs with instant custom separators.', path: '/tools/slug-generator', icon: Link2, color: 'text-emerald-400', glow: 'shadow-emerald-500/20', badge: 'SEO Tool', badgeColor: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' },
  { title: 'Age Calculator', desc: 'Calculate exact age in years, months, days and more.', path: '/tools/age-calculator', icon: Timer, color: 'text-pink-400', glow: 'shadow-pink-500/20', badge: 'Productivity', badgeColor: 'bg-pink-500/15 border-pink-500/30 text-pink-400' },
  { title: 'Password Generator', desc: 'Generate military-grade secure passwords instantly.', path: '/tools/password-generator', icon: ShieldCheck, color: 'text-blue-400', glow: 'shadow-blue-500/20', badge: 'Security', badgeColor: 'bg-blue-500/15 border-blue-500/30 text-blue-400' },
  { title: 'Unit Converter', desc: 'Convert length, weight, temperature, data and more.', path: '/tools/unit-converter', icon: Gauge, color: 'text-teal-400', glow: 'shadow-teal-500/20', badge: 'Converter', badgeColor: 'bg-teal-500/15 border-teal-500/30 text-teal-400' },
  { title: 'Image Compressor', desc: 'Compress JPG, PNG, WebP images. Under 50KB, 100KB, custom — 100% private.', path: '/tools/image-compressor', icon: ImageDown, color: 'text-rose-400', glow: 'shadow-rose-500/20', badge: 'Media Tool', badgeColor: 'bg-rose-500/15 border-rose-500/30 text-rose-400' },
  { title: 'QR Code Generator', desc: 'Generate QR for URL, UPI payment, WiFi, WhatsApp and more.', path: '/tools/qr-code', icon: QrCode, color: 'text-violet-400', glow: 'shadow-violet-500/20', badge: 'Generator', badgeColor: 'bg-violet-500/15 border-violet-500/30 text-violet-400' },
  { title: 'EMI Calculator', desc: 'Calculate home, car, personal loan EMI with full repayment schedule.', path: '/tools/emi-calculator', icon: Calculator, color: 'text-green-400', glow: 'shadow-green-500/20', badge: 'Finance', badgeColor: 'bg-green-500/15 border-green-500/30 text-green-400' },
];

// ─── Simple CSS Starfield ───
const Starfield = () => (
  <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
    {/* Ambient orbs */}
    <div className="absolute top-[5%] left-[8%] w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[160px]" />
    <div className="absolute top-[45%] right-[5%] w-[700px] h-[700px] rounded-full bg-purple-600/10 blur-[180px]" />
    <div className="absolute bottom-[10%] left-[30%] w-[500px] h-[500px] rounded-full bg-pink-600/8 blur-[150px]" />
    {/* Static star dots */}
    {[...Array(40)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white"
        style={{
          width: Math.random() * 2 + 1 + 'px',
          height: Math.random() * 2 + 1 + 'px',
          top: Math.random() * 100 + '%',
          left: Math.random() * 100 + '%',
          opacity: Math.random() * 0.5 + 0.1,
          animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
          animationDelay: Math.random() * 3 + 's',
        }}
      />
    ))}
  </div>
);

function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="space-y-12 py-6"
    >
      <Helmet>
        <title>ManyTool — Free Online Utility Suite | Word Counter, Password Generator & More</title>
        <meta name="description" content="Free online tools: word counter, case converter, password generator, age calculator, unit converter, lorem ipsum, slug generator — 100% private and instant." />
      </Helmet>

      {/* Hero */}
      <div className="text-center space-y-5 max-w-3xl mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold uppercase tracking-widest mb-2"
        >
          <Sparkles size={12} /> Free · Fast · No Login
        </motion.div>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          All Your Tools,{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            One Place
          </span>
        </h1>

        <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          High-performance utility suite for developers, writers, and creators.
          <span className="hidden md:inline">{' '}Press <kbd className="px-2 py-0.5 rounded-md bg-slate-900 border border-white/15 text-xs font-mono text-gray-300">Ctrl+K</kbd> to search tools.</span>
          <span className="inline md:hidden">{' '}Tap any tool below to get started.</span>
        </p>

        {/* Stats bar */}
        <div className="flex items-center justify-center gap-6 pt-2 text-xs text-gray-500">
          {[
            { icon: Zap, text: '10+ Free Tools' },
            { icon: Globe, text: 'Used Worldwide' },
            { icon: Star, text: 'No Signup' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5">
              <Icon size={12} className="text-gray-600" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map((tool, index) => {
          const IconComponent = tool.icon;
          return (
            <Link key={index} to={tool.path}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950/90 backdrop-blur-xl border border-white/[0.06] hover:border-white/20 hover:shadow-2xl ${tool.glow} h-full group relative overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer`}
              >
                {/* Top gradient accent on hover */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <IconComponent size={22} className={tool.color} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{tool.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{tool.desc}</p>
                  </div>
                </div>

                <div className="pt-5 flex items-center justify-between text-xs font-mono font-bold text-gray-600 group-hover:text-cyan-400 transition-colors">
                  <span>Launch Tool</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Main App ───
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isMobile = window.innerWidth < 1024;
    const isHome = window.location.pathname === '/' || window.location.pathname === '';
    return !isMobile && !isHome;
  });

  const pageVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
  };

  const toolRoutes = [
    { path: '/tools/word-counter', component: WordCounter },
    { path: '/tools/case-converter', component: CaseConverter },
    { path: '/tools/fix-grammar', component: CaseConverter },
    { path: '/tools/prompt-enhancer', component: CaseConverter },
    { path: '/tools/text-summarizer', component: CaseConverter },
    { path: '/tools/lorem-ipsum', component: LoremIpsum },
    { path: '/tools/slug-generator', component: SlugGenerator },
    { path: '/tools/age-calculator', component: AgeCalculator },
    { path: '/tools/zodiac-sign-calculator', component: AgeCalculator },
    { path: '/tools/password-generator', component: (props) => <PasswordGenerator {...props} onSave={() => setIsSidebarOpen(true)} /> },
    { path: '/tools/strong-password-generator', component: (props) => <PasswordGenerator {...props} onSave={() => setIsSidebarOpen(true)} /> },
    { path: '/tools/unit-converter', component: UnitConverter },
    { path: '/tools/image-compressor', component: ImageCompressor },
    { path: '/tools/compress-image-50kb', component: ImageCompressor },
    { path: '/tools/compress-image-100kb', component: ImageCompressor },
    { path: '/tools/qr-code', component: QRCodeGenerator },
    { path: '/tools/upi-qr-code', component: QRCodeGenerator },
    { path: '/tools/wifi-qr-code', component: QRCodeGenerator },
    { path: '/tools/whatsapp-qr-code', component: QRCodeGenerator },
    { path: '/tools/emi-calculator', component: EMICalculator },
    { path: '/tools/home-loan-emi-calculator', component: EMICalculator },
    { path: '/tools/car-loan-emi-calculator', component: EMICalculator },
    { path: '/tools/personal-loan-emi-calculator', component: EMICalculator },
  ];

  return (
    <HelmetProvider>
      <ThemeProvider>
        <HistoryProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <RouteTracker />
            <CommandPalette />
            <div className="min-h-screen text-gray-100 relative bg-[#070913]">
              <Starfield />
              <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />

              <div className="flex relative z-10">
                {/* Sidebar */}
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: '256px', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                      className="overflow-hidden shrink-0 sticky top-[57px] h-[calc(100vh-57px)] z-30"
                    >
                      <Sidebar isOpen={true} onClose={() => setIsSidebarOpen(false)} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <main className="flex-1 min-h-[calc(100vh-57px)]">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AnimatePresence mode="wait">
                      <Routes>
                        <Route path="/" element={<HomePage />} />

                        {toolRoutes.map((route, idx) => {
                          const Component = route.component;
                          return (
                            <Route
                              key={idx}
                              path={route.path}
                              element={
                                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                                  {typeof Component === 'function' ? <Component /> : Component}
                                </motion.div>
                              }
                            />
                          );
                        })}

                        <Route path="/about" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><AboutPage /></motion.div>} />
                        <Route path="/privacy" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><PrivacyPage /></motion.div>} />
                        <Route path="/admin-dashboard" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><AdminDashboard /></motion.div>} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </AnimatePresence>
                  </div>
                </main>
              </div>

              <Footer />
            </div>
          </Router>
        </HistoryProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;