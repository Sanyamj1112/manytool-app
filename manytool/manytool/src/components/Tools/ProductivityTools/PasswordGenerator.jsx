/**
 * PasswordGenerator.jsx
 * ─────────────────────────────────────────────────────────────
 * Advanced password generator with strength indicator
 * Features:
 * - Customizable password length
 * - Character set options (uppercase, lowercase, numbers, symbols)
 * - Real-time strength calculation
 * - Password history (local storage)
 * - Copy to clipboard
 * - Generate multiple passwords
 * - Entropy calculation
 * @version 1.0.0
 * @requires react@^18.2.0
 * @requires framer-motion@^10.16.16
 * @requires react-helmet-async@^2.0.4
 * @requires lucide-react@^0.308.0
 */

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Lock, RefreshCw, Copy, Zap, Eye, EyeOff, Save } from 'lucide-react';
import CopyButton from '@/components/common/CopyButton';
import { useToast } from '@/Hooks/useToast';
import Toast from '@/components/common/Toast';
import { useHistory } from '@/context/HistoryContext';
import Tooltip from '@/components/common/Tooltip';

/**
 * PasswordGenerator Component
 */
const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [showPassword, setShowPassword] = useState(false);
  const isInitialized = useRef(false); // Double generation fix
  
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

  // Character sets
  const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  };

  // Calculate password strength
  const calculateStrength = useCallback((pwd) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-gray-600' };

    let score = 0;
    if (pwd.length >= 8) score += 20;
    if (pwd.length >= 12) score += 10;
    if (pwd.length >= 16) score += 10;
    if (/[a-z]/.test(pwd)) score += 15;
    if (/[A-Z]/.test(pwd)) score += 15;
    if (/[0-9]/.test(pwd)) score += 15;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 15;
    if (!/(.)\1{2,}/.test(pwd)) score += 5;

    if (score < 30) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score < 60) return { score, label: 'Fair', color: 'bg-yellow-500' };
    if (score < 80) return { score, label: 'Good', color: 'bg-blue-500' };
    return { score, label: 'Strong', color: 'bg-cyan-400' };
  }, []);

  // Generate password
  const generatePassword = useCallback((showNotification = true) => {
    let characters = '';
    if (options.uppercase) characters += charSets.uppercase;
    if (options.lowercase) characters += charSets.lowercase;
    if (options.numbers) characters += charSets.numbers;
    if (options.symbols) characters += charSets.symbols;

    if (!characters && !useCustomSeed) {
      showToast('Select at least one character type!', 'error', 2000);
      return;
    }

    // Logic with Custom Seed integration
    let newPassword = useCustomSeed ? seed : '';
    const targetLength = Math.max(newPassword.length, length);
    
    for (let i = newPassword.length; i < targetLength; i++) {
      newPassword += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const finalPassword = newPassword.substring(0, length);

    setPassword(finalPassword);
    if (showNotification) {
        showToast('Password generated!', 'success', 2000);
    }
  }, [length, options, seed, useCustomSeed, showToast]);

  // Handle Save
  const handleSaveToHistory = () => {
    saveToHistory('Password Gen', password);
    showToast('Saved to history!', 'success', 2000);
  };

  useEffect(() => {
    if (!isInitialized.current) {
        generatePassword(false); // Mount par bina notification ke generate karega
        isInitialized.current = true;
    }
  }, [generatePassword]);

  const strength = useMemo(() => calculateStrength(password), [password, calculateStrength]);

  const toggleOption = useCallback((key) => {
    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Helmet>
        <title>Password Generator - ManyTool | Secure Password Creation</title>
      </Helmet>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="max-w-4xl mx-auto"
      >
        {/* Custom Seed UI Section */}
        <div className="bg-[#1e293b] rounded-xl shadow-lg p-6 mb-6 border border-cyan-500/30">
           <label className="flex items-center gap-3 mb-4 cursor-pointer">
              <input type="checkbox" checked={useCustomSeed} onChange={(e) => setUseCustomSeed(e.target.checked)} className="w-4 h-4 accent-cyan-500" />
              <span className="font-semibold text-gray-300">Enable Custom Seed (Advanced Security)</span>
           </label>
           {useCustomSeed && (
             <input type="text" placeholder="Enter your seed (e.g., aman@123)" value={seed} onChange={(e) => setSeed(e.target.value)} className="w-full p-3 rounded-lg bg-[#0f172a] border border-cyan-500/30 text-white" />
           )}
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-cyan-500 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Password Generator
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Create strong, secure passwords with customizable options.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Password Box */}
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-6 border border-cyan-500/30">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Generated Password
              </label>

              <div className="flex gap-2">
                <div className="relative flex-1 bg-[#0f172a] rounded-lg p-4 border border-gray-600">
                  <p className="font-mono text-lg text-white break-all">
                    {showPassword
                      ? password
                      : password.replace(/./g, '*')}
                  </p>
                </div>

                <Tooltip text="Toggle password visibility">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-4 rounded-lg bg-cyan-900/30 text-cyan-400 hover:bg-cyan-900/50"
                  type="button"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
                </Tooltip>

                <Tooltip text="Copy password">
                <CopyButton
                  text={password}
                  onCopy={() => showToast('Password copied!', 'success', 2000)}
                />
                </Tooltip>
              </div>
            </div>

            {/* Strength Indicator */}
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-6 border border-cyan-500/30">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-300">
                  Password Strength
                </label>
                <span className={`text-sm font-bold px-3 py-1 rounded-full text-white ${strength.color}`}>
                  {strength.label}
                </span>
              </div>

              <div className="w-full bg-gray-900 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${strength.score}%` }}
                  className={`h-full ${strength.color}`}
                />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-400">
                <p>Length: <span className="font-semibold text-white">{password.length}</span></p>
                <p>Entropy: <span className="font-semibold text-white">{strength.score}%</span></p>
              </div>
            </div>

            {/* Length Slider */}
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-6 border border-cyan-500/30">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold text-gray-300">
                  Password Length
                </label>
                <span className="text-2xl font-bold text-cyan-400">
                  {length}
                </span>
              </div>

              <input
                type="range"
                min="8"
                max="128"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-900 rounded-lg cursor-pointer accent-cyan-500"
              />
            </div>
          </motion.div>

          {/* Options & Generate */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Character Types */}
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-6 border border-cyan-500/30 space-y-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Character Types
              </h3>

              {[
                { key: 'uppercase', label: 'Uppercase (A-Z)' },
                { key: 'lowercase', label: 'Lowercase (a-z)' },
                { key: 'numbers', label: 'Numbers (0-9)' },
                { key: 'symbols', label: 'Symbols (!@#$%)' },
              ].map((option) => (
                <label
                  key={option.key}
                  className="flex items-center gap-3 cursor-pointer text-sm text-gray-300"
                >
                  <input
                    type="checkbox"
                    checked={options[option.key]}
                    onChange={() => toggleOption(option.key)}
                    className="accent-cyan-500"
                  />
                  {option.label}
                </label>
              ))}
            </div>

            {/* Generate Button */}
            <Tooltip text="Generate a new secure password">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => generatePassword(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <RefreshCw className="w-5 h-5" />
              Generate
            </motion.button>
            </Tooltip>
            
            {/* Save Button */}
            <Tooltip text="Save current password to history">
            <button onClick={handleSaveToHistory} className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold flex items-center justify-center gap-2 border border-cyan-500">
               <Save className="w-5 h-5" /> Save to History
            </button>
            </Tooltip>

            {/* Quick Actions */}
            <div className="bg-[#1e293b] rounded-xl shadow-lg p-6 border border-cyan-500/30">
              <p className="text-xs font-semibold text-gray-400 mb-3">
                Quick Actions
              </p>
              <div className="space-y-2">
                <button onClick={() => {setLength(12); generatePassword(true);}} className="w-full py-2 bg-[#0f172a] border border-cyan-500/30 rounded text-xs text-cyan-300">12 chars (weak)</button>
                <button onClick={() => {setLength(16); generatePassword(true);}} className="w-full py-2 bg-[#0f172a] border border-cyan-500/30 rounded text-xs text-cyan-300">16 chars (good)</button>
                <button onClick={() => {setLength(24); generatePassword(true);}} className="w-full py-2 bg-[#0f172a] border border-cyan-500/30 rounded text-xs text-cyan-300">24 chars (strong)</button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default PasswordGenerator;