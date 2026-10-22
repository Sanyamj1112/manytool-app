/**
 * EMICalculator.jsx
 * Home / Car / Personal Loan EMI Calculator
 * Monthly breakdown table included
 */

import React, { useState, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ChevronDown, Info } from 'lucide-react';
import ToolFAQ from '@/components/common/ToolFAQ';

// FAQ in Pure English
const faqs = [
  {
    q: 'What is an EMI?',
    a: 'EMI stands for Equated Monthly Installment. It is a fixed payment amount made by a borrower to a lender each calendar month, composed of both principal and interest.',
  },
  {
    q: 'What formula is used to calculate loan EMI?',
    a: 'EMI is computed using the standard banking formula: EMI = [P × r × (1+r)ⁿ] / [(1+r)ⁿ - 1], where P is Principal, r is Monthly Interest Rate, and n is Tenure in Months.',
  },
  {
    q: 'How does loan prepayment affect my EMI?',
    a: 'Making prepayments reduces the outstanding principal balance. This allows you to either decrease your subsequent monthly installments or reduce the total repayment tenure.',
  },
  {
    q: 'Should I choose a longer or shorter loan tenure?',
    a: 'A longer tenure yields smaller, manageable monthly installments but results in higher cumulative interest. A shorter tenure minimizes total interest cost with higher monthly payments.',
  },
];

const LOAN_TYPES = [
  { label: 'Home Loan', color: 'from-blue-500 to-cyan-500', rate: 8.5 },
  { label: 'Car Loan', color: 'from-emerald-500 to-teal-500', rate: 9.0 },
  { label: 'Personal Loan', color: 'from-rose-500 to-pink-500', rate: 12.0 },
  { label: 'Custom', color: 'from-purple-500 to-violet-500', rate: 10.0 },
];

function calcEMI(principal, annualRate, months) {
  if (!principal || !annualRate || !months) return 0;
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function getSchedule(principal, annualRate, months) {
  const r = annualRate / 12 / 100;
  const emi = calcEMI(principal, annualRate, months);
  let balance = principal;
  const rows = [];
  for (let i = 1; i <= months; i++) {
    const interest = balance * r;
    const principalPaid = emi - interest;
    balance = Math.max(0, balance - principalPaid);
    rows.push({ month: i, emi, interest, principalPaid, balance });
  }
  return rows;
}

function fmt(n) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

export default function EMICalculator() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const getInitialLoanType = () => {
    if (location.pathname.includes('home-loan') || searchParams.get('type') === 'home') return 0;
    if (location.pathname.includes('car-loan') || searchParams.get('type') === 'car') return 1;
    if (location.pathname.includes('personal-loan') || searchParams.get('type') === 'personal') return 2;
    return 0;
  };

  const [loanType, setLoanType] = useState(getInitialLoanType);
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(LOAN_TYPES[getInitialLoanType()].rate);
  const [tenureYears, setTenureYears] = useState(20);
  const [showSchedule, setShowSchedule] = useState(false);

  const months = tenureYears * 12;
  const emi = useMemo(() => calcEMI(principal, rate, months), [principal, rate, months]);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;
  const interestPercent = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  const schedule = useMemo(() => {
    if (!showSchedule) return [];
    return getSchedule(principal, rate, months);
  }, [showSchedule, principal, rate, months]);

  const handleLoanTypeChange = (i) => {
    setLoanType(i);
    if (i < 3) setRate(LOAN_TYPES[i].rate);
  };

  const pageMeta = loanType === 0 ? {
    title: 'Home Loan EMI Calculator with Repayment Schedule | ManyTool',
    desc: 'Calculate monthly home loan EMI, interest payout, and loan amortization schedule accurately with ManyTool free home loan calculator.',
  } : loanType === 1 ? {
    title: 'Car Loan EMI Calculator — Monthly Auto Loan Payment | ManyTool',
    desc: 'Calculate monthly car loan installments and interest breakdown before purchasing your vehicle with ManyTool.',
  } : loanType === 2 ? {
    title: 'Personal Loan EMI Calculator — Instant Interest Calculation | ManyTool',
    desc: 'Calculate personal loan EMI and total payable interest instantly online with ManyTool.',
  } : {
    title: 'Free EMI Calculator — Home, Car & Personal Loan | ManyTool',
    desc: 'Calculate your home loan, car loan, or personal loan EMI instantly. Get monthly breakdown, total interest, and repayment schedule at ManyTool.',
  };

  return (
    <div className="min-h-screen text-gray-100 relative pb-16">
      <Helmet>
        <title>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.desc} />
      </Helmet>

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-[8%] left-[8%] w-[600px] h-[600px] rounded-full bg-emerald-500/[0.06] blur-[180px] animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute bottom-[8%] right-[8%] w-[550px] h-[550px] rounded-full bg-teal-500/[0.05] blur-[170px] animate-pulse" style={{ animationDuration: '11s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,9,19,0.5)_70%)]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
              <Calculator size={24} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">EMI Calculator</h1>
              <p className="text-sm text-gray-400">Calculate monthly loan installments, interest breakdown & amortization schedule</p>
            </div>
          </div>
        </motion.div>

        {/* Loan Type Selector */}
        <div className="flex flex-wrap gap-2">
          {LOAN_TYPES.map((lt, i) => (
            <button
              key={i}
              onClick={() => handleLoanTypeChange(i)}
              className={`px-5 py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer
                ${loanType === i
                  ? `bg-gradient-to-br ${lt.color} text-white border-transparent shadow-lg`
                  : 'bg-slate-900/60 border-white/10 text-gray-400 hover:text-white hover:border-white/20'}`}
            >
              {lt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/70 to-slate-950/80 border border-white/[0.06] space-y-6">

            {/* Principal */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Loan Amount</label>
                <span className="text-emerald-400 font-mono font-bold text-sm">{fmt(principal)}</span>
              </div>
              <input
                type="range" min={100000} max={10000000} step={50000} value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-slate-700 accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                <span>₹1L</span><span>₹1Cr</span>
              </div>
              <input
                type="number" value={principal} min={10000}
                onChange={(e) => setPrincipal(Math.max(10000, Number(e.target.value)))}
                className="mt-2 w-full bg-slate-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-emerald-500/50"
                placeholder="Amount in ₹"
              />
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Annual Interest Rate</label>
                <span className="text-emerald-400 font-mono font-bold text-sm">{rate}%</span>
              </div>
              <input
                type="range" min={5} max={24} step={0.1} value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-slate-700 accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                <span>5%</span><span>24%</span>
              </div>
              <input
                type="number" value={rate} step={0.1} min={1} max={30}
                onChange={(e) => setRate(Math.max(1, Math.min(30, Number(e.target.value))))}
                className="mt-2 w-full bg-slate-800/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-emerald-500/50"
                placeholder="Rate %"
              />
            </div>

            {/* Tenure */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Loan Tenure</label>
                <span className="text-emerald-400 font-mono font-bold text-sm">{tenureYears} Years</span>
              </div>
              <input
                type="range" min={1} max={30} step={1} value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-slate-700 accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                <span>1 Year</span><span>30 Years</span>
              </div>
            </div>
          </motion.div>

          {/* Result Panel */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/70 to-slate-950/80 border border-white/[0.06] space-y-5 flex flex-col justify-between">

            {/* Monthly EMI */}
            <div className="text-center py-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Monthly EMI</p>
              <motion.p key={emi.toFixed(0)} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                {fmt(emi)}
              </motion.p>
              <p className="text-xs text-gray-500 mt-2">per month for {tenureYears} years</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Principal', value: fmt(principal), color: 'text-blue-400' },
                { label: 'Total Interest', value: fmt(totalInterest), color: 'text-rose-400' },
                { label: 'Total Payment', value: fmt(totalPayment), color: 'text-emerald-400' },
                { label: 'Interest %', value: interestPercent.toFixed(1) + '%', color: 'text-amber-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="p-3 rounded-xl bg-slate-900/60 border border-white/8">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
                  <p className={`text-sm font-bold mt-1 ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Visual bar */}
            <div>
              <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
                <span>Principal</span><span>Interest</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden flex bg-slate-800">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${100 - interestPercent}%` }}
                />
                <div
                  className="bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${interestPercent}%` }}
                />
              </div>
            </div>

            {/* Schedule Toggle */}
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-sm transition-all cursor-pointer"
            >
              <ChevronDown size={16} className={`transition-transform ${showSchedule ? 'rotate-180' : ''}`} />
              {showSchedule ? 'Hide Amortization Schedule' : 'View Monthly Schedule'}
            </button>
          </motion.div>
        </div>

        {/* Amortization Schedule */}
        <AnimatePresence>
          {showSchedule && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="rounded-2xl border border-white/8 bg-slate-900/40 overflow-hidden">
              <div className="p-4 border-b border-white/8">
                <h3 className="text-sm font-bold text-white">Monthly Repayment Schedule</h3>
              </div>
              <div className="overflow-x-auto max-h-72 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-slate-900">
                    <tr className="text-gray-500 uppercase tracking-wider">
                      <th className="px-4 py-2 text-left">Month</th>
                      <th className="px-4 py-2 text-right">EMI</th>
                      <th className="px-4 py-2 text-right">Principal</th>
                      <th className="px-4 py-2 text-right">Interest</th>
                      <th className="px-4 py-2 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((row) => (
                      <tr key={row.month} className="border-t border-white/4 hover:bg-white/[0.02]">
                        <td className="px-4 py-2 text-gray-400">{row.month}</td>
                        <td className="px-4 py-2 text-right text-gray-300 font-mono">{fmt(row.emi)}</td>
                        <td className="px-4 py-2 text-right text-blue-400 font-mono">{fmt(row.principalPaid)}</td>
                        <td className="px-4 py-2 text-right text-rose-400 font-mono">{fmt(row.interest)}</td>
                        <td className="px-4 py-2 text-right text-gray-400 font-mono">{fmt(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/8 border border-blue-500/20 text-sm text-gray-400">
          <Info size={16} className="text-blue-400 mt-0.5 shrink-0" />
          <p>This calculator provides an estimate of your EMI. Actual installments may vary based on bank-specific processing fees and rounding.</p>
        </div>

        {/* Sleek Compact FAQ */}
        <ToolFAQ faqs={faqs} title="EMI Calculator FAQs" />
      </div>
    </div>
  );
}
