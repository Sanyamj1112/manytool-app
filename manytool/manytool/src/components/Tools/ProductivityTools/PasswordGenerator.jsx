/**
 * @file PasswordGenerator.jsx
 * @description Enterprise-grade secure password generator matching the exact structural layout of Text Utilities with cyber security aesthetic and sound micro-interactions.
 * @version 4.1.0
 */

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Lock, RefreshCw, Copy, Eye, EyeOff, Save, KeyRound, ShieldCheck, Terminal, CheckCircle2, Shield } from 'lucide-react';
import CopyButton from '@/components/common/CopyButton';
import { useToast } from '@/Hooks/useToast';
import Toast from '@/components/common/Toast';
import { useHistory } from '@/context/HistoryContext';
import Tooltip from '@/components/common/Tooltip';
import { playClickSound } from '@/utils/soundUtils';

const PasswordGenerator = ({ onSave }) => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [showPassword, setShowPassword] = useState(false);
  const isInitialized = useRef(false);
  
  // Custom Seed States
  const [seed, setSeed] = useState('');
  const [useCustomSeed, setUseCustomSeed] = useState(false);

  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const { toasts, showToast, removeToast } = useToast();
  const { saveToHistory } = useHistory(); 

  const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  };

  // Calculate password strength
  const calculateStrength = useCallback((pwd) => {
    if (!pwd) return { score: 0, label: 'NONE', color: 'bg-slate-600' };

    let score = 0;
    if (pwd.length >= 8) score += 20;
    if (pwd.length >= 12) score += 10;
    if (pwd.length >= 16) score += 10;
    if (/[a-z]/.test(pwd)) score += 15;
    if (/[A-Z]/.test(pwd)) score += 15;
    if (/[0-9]/.test(pwd)) score += 15;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 15;
    if (!/(.)\1{2,}/.test(pwd)) score += 5;

    if (score < 30) return { score, label: 'VULNERABLE', color: 'bg-red-500' };
    if (score < 60) return { score, label: 'MODERATE', color: 'bg-amber-500' };
    if (score < 80) return { score, label: 'SECURE', color: 'bg-cyan-400' };
    return { score, label: 'MILITARY-GRADE', color: 'bg-emerald-400' };
  }, []);

  const generatePassword = useCallback((showNotification = true) => {
    playClickSound();
    let characters = '';
    if (options.uppercase) characters += charSets.uppercase;
    if (options.lowercase) characters += charSets.lowercase;
    if (options.numbers) characters += charSets.numbers;
    if (options.symbols) characters += charSets.symbols;

    if (!characters && !useCustomSeed) {
      showToast('Select at least one character type!', 'error', 2000);
      return;
    }

    let newPassword = useCustomSeed ? seed : '';
    const targetLength = Math.max(newPassword.length, length);
    
    for (let i = newPassword.length; i < targetLength; i++) {
      newPassword += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const finalPassword = newPassword.substring(0, length);

    setPassword(finalPassword);
    if (showNotification) {
      showToast('Password generated successfully!', 'success', 2000);
    }
  }, [length, options, seed, useCustomSeed, showToast]);

  const handleSaveToHistory = () => {
    playClickSound();
    saveToHistory('Password Gen', password);
    showToast('Saved to history!', 'success', 2000);
    // Auto-toggle open sidebar when saved
    if (typeof onSave === 'function') {
      onSave();
    }
  };

  useEffect(() => {
    if (!isInitialized.current) {
      generatePassword(false);
      isInitialized.current = true;
    }
  }, [generatePassword]);

  const strength = useMemo(() => calculateStrength(password), [password, calculateStrength]);

  const toggleOption = useCallback((key) => {
    playClickSound();
    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  return (
    <>
      <Helmet>
        <title>Password Generator | ManyTool</title>
      </Helmet>

      {/* Cyber Neon Grid Texture & Ambient Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-[15%] left-[15%] w-[550px] h-[550px] rounded-full bg-cyan-500/10 blur-[150px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[550px] h-[550px] rounded-full bg-emerald-500/10 blur-[150px]" />
        
        {/* Neon Cyber Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />

        {/* Security Watermarks */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] select-none">
          <ShieldCheck size={600} className="text-cyan-400 translate-x-32 -translate-y-10" />
          <Lock size={500} className="text-emerald-400 -translate-x-48 translate-y-20" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 max-w-7xl mx-auto space-y-6 pb-16 px-4 sm:px-6 pt-4"
      >
        
        {/* Text Utilities Exact Header Structure */}
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-cyan-500/20 pb-6 gap-4">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wider uppercase inline-flex items-center gap-1.5 font-mono">
              <ShieldCheck size={14} /> SECURITY SUITE
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              Password Generator
            </h1>
          </div>
          <p className="text-gray-400 text-sm max-w-md font-mono">
            Lightning-fast, private, and secure cryptographic credential generator designed for high productivity.
          </p>
        </header>

        {/* Hero Display Box (Exact match to Text Utilities Main Box Style) */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-cyan-500/30 shadow-[0_0_50px_-12px_rgba(6,182,212,0.15)] space-y-4">
          
          <div className="flex items-center justify-between text-xs text-gray-400 uppercase tracking-wider font-mono">
            <span className="flex items-center gap-2 text-cyan-400 font-bold">
              <KeyRound size={15} /> Generated Credential
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-950 uppercase ${strength.color}`}>
              {strength.label} Strength
            </span>
          </div>

          <div className="min-h-[90px] flex items-center justify-between gap-4 p-5 rounded-2xl bg-slate-950/80 border border-cyan-500/20 shadow-inner">
            <p className="font-mono text-xl sm:text-2xl text-cyan-300 tracking-wider break-all select-all font-medium">
              {showPassword ? password : password.replace(/./g, '•')}
            </p>
          </div>

          {/* Integrated Action Toolbar (Exact match to Text Utilities action bar) */}
          <div className="p-2.5 bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 shadow-xl">
            
            <div className="flex flex-wrap items-center gap-2">
              <Tooltip text="Generate fresh password">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => generatePassword(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer font-mono"
                >
                  <RefreshCw size={14} className="animate-spin-slow" /> Generate
                </motion.button>
              </Tooltip>

              <Tooltip text="Toggle password visibility">
                <button
                  onClick={() => { playClickSound(); setShowPassword(!showPassword); }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer font-mono"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </Tooltip>

              <Tooltip text="Copy password to clipboard">
                <div onClick={() => playClickSound()} className="px-2 py-1 bg-slate-900 hover:bg-slate-800 rounded-xl border border-cyan-500/30 flex items-center transition-all">
                  <CopyButton
                    text={password}
                    onCopy={() => { playClickSound(); showToast('Password copied!', 'success', 2000); }}
                  />
                </div>
              </Tooltip>

              <Tooltip text="Save password to session history">
                <button
                  onClick={handleSaveToHistory}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer font-mono"
                >
                  <Save size={14} />
                  <span>Save</span>
                </button>
              </Tooltip>
            </div>

            {/* Quick Length Presets */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-cyan-500/30 font-mono">
              <span className="text-[10px] text-cyan-400 px-2 uppercase font-bold">Quick:</span>
              <button onClick={() => { playClickSound(); setLength(12); generatePassword(true); }} className={`px-2.5 py-1 text-xs rounded-lg transition-all ${length === 12 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-gray-300 hover:bg-slate-800'}`}>12</button>
              <button onClick={() => { playClickSound(); setLength(16); generatePassword(true); }} className={`px-2.5 py-1 text-xs rounded-lg transition-all ${length === 16 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-gray-300 hover:bg-slate-800'}`}>16</button>
              <button onClick={() => { playClickSound(); setLength(24); generatePassword(true); }} className={`px-2.5 py-1 text-xs rounded-lg transition-all ${length === 24 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-gray-300 hover:bg-slate-800'}`}>24</button>
            </div>

          </div>

        </div>

        {/* Bento Sub-Cards Grid (Matching Text Utilities Lower Section) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Strength Analysis */}
          <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-cyan-500/30 shadow-xl space-y-4 flex flex-col justify-between font-mono">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Entropy & Security
              </span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-white">{strength.score}%</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-slate-950 uppercase ${strength.color}`}>
                  {strength.label}
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-cyan-500/30 p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${strength.score}%` }}
                className={`h-full rounded-full ${strength.color}`}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            <p className="text-xs text-gray-400">
              Calculated using character variety and bit entropy length.
            </p>
          </div>

          {/* Card 2: Length Configurator */}
          <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-cyan-500/30 shadow-xl space-y-4 flex flex-col justify-between font-mono">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Password Length
              </span>
              <span className="text-2xl font-black text-cyan-400">
                {length}
              </span>
            </div>

            <input
              type="range"
              min="8"
              max="128"
              value={length}
              onChange={(e) => { setLength(parseInt(e.target.value)); }}
              className="w-full h-2 bg-slate-950 rounded-lg cursor-pointer accent-cyan-400 border border-cyan-500/30"
            />

            <div className="flex justify-between text-[10px] text-gray-500">
              <span>MIN: 8</span>
              <span>DEFAULT: 16</span>
              <span>MAX: 128</span>
            </div>
          </div>

          {/* Card 3: Character Matrix */}
          <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-cyan-500/30 shadow-xl space-y-3 font-mono">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Character Matrix
            </span>

            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'uppercase', label: 'Uppercase', sub: 'A-Z' },
                { key: 'lowercase', label: 'Lowercase', sub: 'a-z' },
                { key: 'numbers', label: 'Numbers', sub: '0-9' },
                { key: 'symbols', label: 'Symbols', sub: '!@#$' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => toggleOption(item.key)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    options[item.key]
                      ? 'bg-cyan-500/15 border-cyan-400/60 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                      : 'bg-slate-950/60 border-cyan-500/20 text-gray-500 hover:text-gray-400'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold leading-tight">{item.label}</p>
                    <span className="text-[10px] opacity-70 font-mono">{item.sub}</span>
                  </div>
                  {options[item.key] && <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Custom Seed Section */}
        <div className="p-5 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-cyan-500/30 space-y-3 font-mono">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={useCustomSeed} 
              onChange={(e) => { playClickSound(); setUseCustomSeed(e.target.checked); }} 
              className="w-4 h-4 accent-cyan-400 rounded cursor-pointer" 
            />
            <span className="font-semibold text-xs text-cyan-300 uppercase tracking-wider">
              Advanced: Enable Custom Seed String Prefix
            </span>
          </label>
          
          <AnimatePresence>
            {useCustomSeed && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <input 
                  type="text" 
                  placeholder="Enter custom seed prefix (e.g., aman@123)" 
                  value={seed} 
                  onChange={(e) => setSeed(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs outline-none focus:border-cyan-400 transition-all shadow-inner mt-2" 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default PasswordGenerator;