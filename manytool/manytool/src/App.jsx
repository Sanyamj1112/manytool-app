import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

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

// Route Tracker Component - Admin path par tracking skip karega
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Security Layer: Block Right-Click and DevTools shortcuts (F12, Ctrl+Shift+I, Ctrl+U)
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

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
    { path: '/tools/password-generator', component: PasswordGenerator },
    { path: '/tools/unit-converter', component: UnitConverter },
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
            {/* Permanent Dark Mode Background Locked */}
            <div className="min-h-screen bg-[#090d16] text-gray-100 transition-colors duration-300">
              <Header
                onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                isMobileMenuOpen={isMobileMenuOpen}
              />
              <div className="flex">
                <Sidebar 
                  isOpen={isMobileMenuOpen} 
                  onClose={() => setIsMobileMenuOpen(false)} 
                />
                <main className="flex-1 min-h-[calc(100vh-80px)]">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AnimatePresence mode="wait">
                      <Routes>
                        {toolRoutes.map((route) => {
                          const Component = route.component;
                          return (
                            <Route
                              key={route.path}
                              path={route.path}
                              element={
                                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                                  <Component />
                                </motion.div>
                              }
                            />
                          );
                        })}
                        <Route path="/about" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><AboutPage /></motion.div>} />
                        <Route path="/privacy" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><PrivacyPage /></motion.div>} />
                        
                        {/* Admin Dashboard Route */}
                        <Route path="/admin-dashboard" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><AdminDashboard /></motion.div>} />

                        <Route path="/" element={
                          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="text-center py-20">
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">Welcome to ManyTool</h1>
                            <p className="text-gray-400 text-lg mb-8">Select a tool from the sidebar to get started</p>
                            <Link to="/tools/word-counter" className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300">Get Started</Link>
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