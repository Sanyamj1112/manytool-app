/**
 * UnitConverter.jsx
 * ─────────────────────────────────────────────────────────────
 * Real-time unit conversion tool with multiple measurement systems
 * 
 * Features:
 * - Length, weight, temperature, volume conversions
 * - Real-time conversion
 * - Multiple unit categories
 * - Bidirectional conversion
 * - Copy results to clipboard
 * - Responsive design
 * 
 * @version 1.0.0
 * @requires react@^18.2.0
 * @requires framer-motion@^10.16.16
 * @requires react-helmet-async@^2.0.4
 * @requires lucide-react@^0.308.0
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

/**
 * UnitConverter Component
 * ─────────────────────────────────────────────────────────────
 * Convert between different units of measurement
 * 
 * @component
 * @returns {React.ReactElement} Unit converter tool
 * 
 * @example
 * <UnitConverter />
 */
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

    // Special handling for temperature
    if (cat === 'temperature') {
      if (from === 'c' && to === 'f') return ((num * 9) / 5 + 32).toFixed(6);
      if (from === 'c' && to === 'k') return (num + 273.15).toFixed(6);
      if (from === 'f' && to === 'c') return (((num - 32) * 5) / 9).toFixed(6);
      if (from === 'f' && to === 'k') return (((num - 32) * 5) / 9 + 273.15).toFixed(6);
      if (from === 'k' && to === 'c') return (num - 273.15).toFixed(6);
      if (from === 'k' && to === 'f') return (((num - 273.15) * 9) / 5 + 32).toFixed(6);
      if (from === to) return num.toFixed(6);
    }

    // Standard conversion
    const baseValue = num * units[from].toBase;
    const result = baseValue / units[to].toBase;
    return result.toFixed(6);
  }, []);

  // Calculate result
  const result = useMemo(
    () => convert(inputValue, fromUnit, toUnit, category),
    [inputValue, fromUnit, toUnit, category, convert]
  );

  // Swap units
  const swapUnits = useCallback(() => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }, [fromUnit, toUnit]);

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const currentUnits = conversionData[category].units;

  return (
    <>
      <Helmet>
        <title>Unit Converter - ManyTool | Convert Measurements</title>
        <meta
          name="description"
          content="Convert between different units of length, weight, temperature, and volume. Real-time conversion with instant results."
        />
        <meta
          name="keywords"
          content="unit converter, length converter, weight converter, temperature converter, volume converter"
        />
        <meta name="author" content="ManyTool" />
      </Helmet>

      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-teal-500 to-green-600 rounded-lg">
              <Gauge className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Unit Converter
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Convert between different units instantly.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
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
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  category === key
                    ? 'bg-teal-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                type="button"
              >
                {data.label}
              </motion.button>
              </Tooltip>
            ))}
          </div>
        </motion.div>

        {/* Converter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* From Unit */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
              From
            </label>

            <Tooltip text="Enter value to convert">
            <InputField
              name="from-value"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              className="mb-4"
            />
            </Tooltip>

            <label htmlFor="from-unit" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
              Unit
            </label>
            <select
              id="from-unit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
            >
              {Object.entries(currentUnits).map(([key, unit]) => (
                <option key={key} value={key}>
                  {unit.label}
                </option>
              ))}
            </select>
          </motion.div>

          {/* To Unit */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">
              To
            </label>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4 min-h-12 flex items-center">
              <p className="text-gray-900 dark:text-white font-mono text-lg break-all">
                {result || '0'}
              </p>
            </div>

            <label htmlFor="to-unit" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
              Unit
            </label>
            <select
              id="to-unit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
            >
              {Object.entries(currentUnits).map(([key, unit]) => (
                <option key={key} value={key}>
                  {unit.label}
                </option>
              ))}
            </select>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 mb-8"
        >
          <Tooltip text="Swap from and to units">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={swapUnits}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            type="button"
          >
            <ArrowRightLeft className="w-5 h-5" />
            Swap
          </motion.button>
          </Tooltip>

          {result && (
            <Tooltip text="Copy conversion result">
            <CopyButton
              text={`${inputValue} ${currentUnits[fromUnit].label} = ${result} ${currentUnits[toUnit].label}`}
              onCopy={() => showToast('Conversion copied!', 'success', 2000)}
              variant="outline"
              className="flex-1"
              label="Copy conversion"
            />
            </Tooltip>
          )}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg"
        >
          <p className="text-sm text-teal-900 dark:text-teal-200">
            <span className="font-semibold">💡 Tip:</span> Select a measurement type above, enter your value, choose
            your units, and get instant conversion results. Use the swap button to reverse the conversion.
          </p>
        </motion.div>
      </motion.div>

      {/* Toast Notification */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default UnitConverter;