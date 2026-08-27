/**
 * @file UnitConverter.jsx
 * @description Unit Converter with conflict-free Tailwind shadows and ambient neon glowing bento layout.
 * @version 2.4.1
 */

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowRightLeft, Gauge } from 'lucide-react';
import CopyButton from '@/components/common/CopyButton';
import InputField from '@/components/common/InputField';
import { useToast } from '@/Hooks/useToast';
import Toast from '@/components/common/Toast';
import Tooltip from '@/components/common/Tooltip';

const UnitConverter = () => {
  const [category, setCategory] = useState('length');
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const { toasts, showToast, removeToast } = useToast();

  // Conversion data
  const conversionData = {
    length: {
      label: 'Length',
      units: {
        mm: { label: 'Millimeter (mm)', toBase: 0.001 },
        cm: { label: 'Centimeter (cm)', toBase: 0.01 },
        m: { label: 'Meter (m)', toBase: 1 },
        km: { label: 'Kilometer (km)', toBase: 1000 },
        in: { label: 'Inch (in)', toBase: 0.0254 },
        ft: { label: 'Foot (ft)', toBase: 0.3048 },
        yd: { label: 'Yard (yd)', toBase: 0.9144 },
        mi: { label: 'Mile (mi)', toBase: 1609.34 },
      },
    },
    weight: {
      label: 'Weight',
      units: {
        mg: { label: 'Milligram (mg)', toBase: 0.001 },
        g: { label: 'Gram (g)', toBase: 1 },
        kg: { label: 'Kilogram (kg)', toBase: 1000 },
        oz: { label: 'Ounce (oz)', toBase: 28.3495 },
        lb: { label: 'Pound (lb)', toBase: 453.592 },
      },
    },
    temperature: {
      label: 'Temperature',
      units: {
        c: { label: 'Celsius (°C)', toBase: null },
        f: { label: 'Fahrenheit (°F)', toBase: null },
        k: { label: 'Kelvin (K)', toBase: null },
      },
    },
    volume: {
      label: 'Volume',
      units: {
        ml: { label: 'Milliliter (ml)', toBase: 1 },
        l: { label: 'Liter (l)', toBase: 1000 },
        gal_us: { label: 'US Gallon (gal)', toBase: 3785.41 },
        gal_uk: { label: 'UK Gallon (gal)', toBase: 4546.09 },
        fl_oz: { label: 'Fluid Ounce (fl oz)', toBase: 29.5735 },
      },
    },
  };

  // Convert function
  const convert = useCallback((value, from, to, cat) => {
    if (!value || value === '' || isNaN(value)) return '';

    const num = parseFloat(value);
    const units = conversionData[cat].units;

    if (cat === 'temperature') {
      if (from === 'c' && to === 'f') return ((num * 9) / 5 + 32).toFixed(6);
      if (from === 'c' && to === 'k') return (num + 273.15).toFixed(6);
      if (from === 'f' && to === 'c') return (((num - 32) * 5) / 9).toFixed(6);
      if (from === 'f' && to === 'k') return (((num - 32) * 5) / 9 + 273.15).toFixed(6);
      if (from === 'k' && to === 'c') return (num - 273.15).toFixed(6);
      if (from === 'k' && to === 'f') return (((num - 273.15) * 9) / 5 + 32).toFixed(6);
      if (from === to) return num.toFixed(6);
    }

    const baseValue = num * units[from].toBase;
    const result = baseValue / units[to].toBase;
    return result.toFixed(6);
  }, []);

  const result = useMemo(
    () => convert(inputValue, fromUnit, toUnit, category),
    [inputValue, fromUnit, toUnit, category, convert]
  );

  const swapUnits = useCallback(() => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }, [fromUnit, toUnit]);

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const currentUnits = conversionData[category].units;

  return (
    <>
      <Helmet>
        <title>Unit Converter - ManyTool | Convert Measurements</title>
      </Helmet>

      {/* Word Counter Style Rich Ambient Lighting & Neon Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-[10%] left-[5%] w-[650px] h-[650px] rounded-full bg-teal-500/15 blur-[160px]" />
        <div className="absolute top-[40%] right-[5%] w-[650px] h-[650px] rounded-full bg-indigo-600/15 blur-[160px]" />
        <div className="absolute bottom-[5%] left-[30%] w-[550px] h-[550px] rounded-full bg-emerald-500/15 blur-[150px]" />
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#14b8a6_1px,transparent_1px),linear-gradient(to_bottom,#14b8a6_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-16 space-y-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-gradient-to-br from-teal-400 to-emerald-600 rounded-xl shadow-lg shadow-teal-500/30">
              <Gauge className="w-6 h-6 text-slate-950" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Unit Converter
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Convert between different units instantly.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-5 border border-teal-500/30 shadow-[0_0_50px_-12px_rgba(20,184,166,0.15)]"
        >
          <label className="block text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider font-mono">
            Measurement Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(conversionData).map(([key, data]) => (
              <Tooltip key={key} text={`Select ${data.label} converter`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCategory(key);
                    const units = Object.keys(data.units);
                    setFromUnit(units[0]);
                    setToUnit(units[1]);
                  }}
                  className={`w-full px-4 py-3 rounded-2xl font-medium transition-all cursor-pointer ${
                    category === key
                      ? 'bg-teal-400 text-slate-950 font-bold shadow-lg shadow-teal-400/30'
                      : 'bg-slate-950/80 border border-white/5 text-gray-300 hover:bg-slate-800'
                  }`}
                  type="button"
                >
                  {data.label}
                </motion.button>
              </Tooltip>
            ))}
          </div>
        </motion.div>

        {/* Converter Section with Conflict-Free Bento Glows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* From Unit Box */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-teal-500/40 shadow-[0_0_50px_-12px_rgba(20,184,166,0.2)] space-y-4"
          >
            <label className="text-xs font-semibold text-gray-300 block uppercase tracking-wider font-mono">
              From Measurement
            </label>

            <Tooltip text="Enter value to convert">
              <InputField
                name="from-value"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
                className="w-full bg-slate-950/90 border border-teal-500/30 rounded-2xl p-4 text-white font-mono text-lg shadow-inner focus:border-teal-400"
              />
            </Tooltip>

            <div className="space-y-2 pt-2">
              <label htmlFor="from-unit" className="text-xs font-semibold text-gray-300 block uppercase tracking-wider font-mono">
                Source Unit
              </label>
              <select
                id="from-unit"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-4 py-3 border border-teal-500/30 rounded-2xl bg-slate-950/90 text-white font-mono text-sm outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer shadow-inner"
              >
                {Object.entries(currentUnits).map(([key, unit]) => (
                  <option key={key} value={key} className="bg-slate-900 text-white">
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* To Unit Box */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-teal-500/40 shadow-[0_0_50px_-12px_rgba(20,184,166,0.2)] space-y-4"
          >
            <label className="text-xs font-semibold text-gray-300 block uppercase tracking-wider font-mono">
              Converted Result
            </label>

            <div className="bg-slate-950/90 rounded-2xl p-4 min-h-[60px] flex items-center border border-teal-500/30 shadow-inner">
              <p className="text-teal-300 font-mono text-xl sm:text-2xl font-bold break-all select-all">
                {result || '0'}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <label htmlFor="to-unit" className="text-xs font-semibold text-gray-300 block uppercase tracking-wider font-mono">
                Target Unit
              </label>
              <select
                id="to-unit"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-4 py-3 border border-teal-500/30 rounded-2xl bg-slate-950/90 text-white font-mono text-sm outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer shadow-inner"
              >
                {Object.entries(currentUnits).map(([key, unit]) => (
                  <option key={key} value={key} className="bg-slate-900 text-white">
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

        </div>

        {/* Action Buttons Toolbar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-3 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-teal-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl"
        >
          <Tooltip text="Swap from and to units">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={swapUnits}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-teal-400/25 transition-all duration-300 cursor-pointer font-mono text-xs"
              type="button"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Swap Units
            </motion.button>
          </Tooltip>

          {result && (
            <Tooltip text="Copy conversion result">
              <CopyButton
                text={`${inputValue} ${currentUnits[fromUnit]?.label || fromUnit} = ${result} ${currentUnits[toUnit]?.label || toUnit}`}
                onCopy={() => showToast('Conversion copied to clipboard!', 'success', 2000)}
                variant="outline"
                className="px-6 py-3 bg-slate-950 hover:bg-slate-800 text-teal-300 border border-teal-500/40 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer shadow-md"
                label="Copy Conversion"
              />
            </Tooltip>
          )}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-teal-950/40 border border-teal-500/30 rounded-2xl backdrop-blur-xl shadow-xl"
        >
          <p className="text-xs text-teal-200 font-mono">
            <span className="font-bold">💡 PRO TIP:</span> Select a measurement type above, enter your value, choose your units, and get instant conversion results. Use the swap button to reverse the conversion.
          </p>
        </motion.div>
      </motion.div>

      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default UnitConverter;