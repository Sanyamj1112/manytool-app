import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Type, AlignLeft, Link2, Timer, ShieldCheck, Gauge, ArrowRight } from 'lucide-react';

// Layout Components
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

// Tool Components
import WordCounter from './components/Tools/TextUtilities/WordCounter';
import CaseConverter from './components/Tools/TextUtilities/CaseConverter';
import LoremIpsum from './components/Tools/TextUtilities/LoremIpsum';
import SlugGenerator from './components/Tools/TextUtilities/SlugGenerator';
import AgeCalculator from './components/Tools/ProductivityTools/AgeCalculator';
import PasswordGenerator from './components/Tools/ProductivityTools/PasswordGenerator';
import UnitConverter from './components/Tools/ProductivityTools/UnitConverter';
import AboutPage from './components/AboutPage';
import PrivacyPage from './components/PrivacyPage';
import NotFound from './components/NotFound';

// Analytics & Admin
import { logAnalytics } from './services/supabaseClient';
import AdminDashboard from './components/AdminDashboard';

import { ThemeProvider } from './context/ThemeContext';
import { HistoryProvider } from './context/HistoryContext';

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('admin-dashboard')) return;

    let toolName = 'Home Page';
    if (location.pathname.includes('word-counter')) toolName = 'Word Counter';
    else if (location.pathname.includes('case-converter')) toolName = 'Case Converter';
    else if (location.pathname.includes('lorem-ipsum')) toolName = 'Lorem Ipsum';
    else if (location.pathname.includes('slug-generator')) toolName = 'Slug Generator';
    else if (location.pathname.includes('age-calculator')) toolName = 'Age Calculator';
    else if (location.pathname.includes('password-generator')) toolName = 'Password Generator';
    else if (location.pathname.includes('unit-converter')) toolName = 'Unit Converter';
    else if (location.pathname.includes('about')) toolName = 'About Page';
    else if (location.pathname.includes('privacy')) toolName = 'Privacy Policy';

    logAnalytics(toolName);
  }, [location]);

  return null;
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Security Layer: Block Right-Click and DevTools shortcuts
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toolRoutes = [
    { path: '/tools/word-counter', component: WordCounter },
    { path: '/tools/case-converter', component: CaseConverter },
    { path: '/tools/lorem-ipsum', component: LoremIpsum },
    { path: '/tools/slug-generator', component: SlugGenerator },
    { path: '/tools/age-calculator', component: AgeCalculator },
    // PasswordGenerator receives a callback to open sidebar on save
    { path: '/tools/password-generator', component: (props) => <PasswordGenerator {...props} onSave={() => setIsSidebarOpen(true)} /> },
    { path: '/tools/unit-converter', component: UnitConverter },
  ];

  const dashboardTools = [
    { title: 'Word Counter', desc: 'Real-time text evaluation and metrics.', path: '/tools/word-counter', icon: FileText, color: 'text-cyan-400' },
    { title: 'Case Converter', desc: 'Transform text styles instantly.', path: '/tools/case-converter', icon: Type, color: 'text-purple-400' },
    { title: 'Lorem Ipsum', desc: 'Generate placeholder text.', path: '/tools/lorem-ipsum', icon: AlignLeft, color: 'text-amber-400' },
    { title: 'Slug Generator', desc: 'Create URL-friendly slugs.', path: '/tools/slug-generator', icon: Link2, color: 'text-emerald-400' },
    { title: 'Age Calculator', desc: 'Precise chronological age.', path: '/tools/age-calculator', icon: Timer, color: 'text-pink-400' },
    { title: 'Password Gen', desc: 'Secure key vault generator.', path: '/tools/password-generator', icon: ShieldCheck, color: 'text-blue-400' },
    { title: 'Unit Converter', desc: 'Instant measurement conversion.', path: '/tools/unit-converter', icon: Gauge, color: 'text-teal-400' },
  ];

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <HelmetProvider>
      <ThemeProvider>
        <HistoryProvider>
          <Router>
            <RouteTracker />
            <div className="min-h-screen text-gray-100 transition-colors duration-300 relative overflow-hidden bg-[#070913]">
              
              {/* Rich Organic Ambient Lighting Background */}
              <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
                <div className="absolute top-[10%] left-[10%] w-[750px] h-[750px] rounded-full bg-cyan-600/15 blur-[170px]" />
                <div className="absolute top-[40%] right-[10%] w-[750px] h-[750px] rounded-full bg-purple-600/15 blur-[170px]" />
                <div className="absolute bottom-[5%] left-[30%] w-[650px] h-[650px] rounded-full bg-pink-600/15 blur-[160px]" />
              </div>

              <Header
                onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
              />
              
              <div className="flex relative z-10">
                {/* Smooth Collapsible Sidebar */}
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: '256px', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden shrink-0 sticky top-20 h-[calc(100vh-80px)] z-30"
                    >
                      <Sidebar 
                        isOpen={true} 
                        onClose={() => setIsSidebarOpen(false)} 
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <main className="flex-1 min-h-[calc(100vh-80px)] transition-all duration-300">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AnimatePresence mode="wait">
                      <Routes>
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

                        <Route path="/" element={
                          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-14 py-8">
                            
                            <div className="text-center space-y-4 max-w-3xl mx-auto">
                              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white">
                                Welcome to <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">ManyTool</span>
                              </h1>
                              <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto font-mono">
                                High-performance utilities built for modern workflows. Select a tool below to begin.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {dashboardTools.map((tool, index) => {
                                const IconComponent = tool.icon;
                                return (
                                  <Link key={index} to={tool.path}>
                                    <motion.div
                                      whileHover={{ scale: 1.02, y: -4 }}
                                      whileTap={{ scale: 0.98 }}
                                      className="p-7 rounded-3xl bg-slate-950/60 backdrop-blur-2xl border border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.25)] h-full group relative overflow-hidden transition-all duration-300 flex flex-col justify-between"
                                    >
                                      <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <IconComponent size={26} className={tool.color} />
                                          </div>
                                          <div className="w-8 h-8 rounded-full bg-slate-900/60 border border-white/5 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-300">
                                            <ArrowRight size={16} className="text-gray-400 group-hover:text-slate-950" />
                                          </div>
                                        </div>
                                        <div>
                                          <h3 className="text-xl font-bold text-white tracking-tight mb-1">{tool.title}</h3>
                                          <p className="text-sm text-gray-400 leading-relaxed font-normal">{tool.desc}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="pt-6 flex items-center text-xs font-mono font-bold text-gray-500 group-hover:text-cyan-400 transition-colors">
                                        LAUNCH UTILITY &rarr;
                                      </div>
                                    </motion.div>
                                  </Link>
                                );
                              })}
                            </div>

                          </motion.div>
                        } />
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