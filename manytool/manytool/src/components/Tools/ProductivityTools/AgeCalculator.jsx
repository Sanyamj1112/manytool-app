import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Cake, Calendar, Info } from 'lucide-react';
import { useToast } from '@/Hooks/useToast';
import Toast from '@/components/common/Toast';
import CopyButton from '@/components/common/CopyButton';
import Tooltip from '@/components/common/Tooltip';

const ZODIAC = [
  { name: 'Capricorn', symbol: '♑', range: [12, 22, 1, 19] },
  { name: 'Aquarius', symbol: '♒', range: [1, 20, 2, 18] },
  { name: 'Pisces', symbol: '♓', range: [2, 19, 3, 20] },
  { name: 'Aries', symbol: '♈', range: [3, 21, 4, 19] },
  { name: 'Taurus', symbol: '♉', range: [4, 20, 5, 20] },
  { name: 'Gemini', symbol: '♊', range: [5, 21, 6, 20] },
  { name: 'Cancer', symbol: '♋', range: [6, 21, 7, 22] },
  { name: 'Leo', symbol: '♌', range: [7, 23, 8, 22] },
  { name: 'Virgo', symbol: '♍', range: [8, 23, 9, 22] },
  { name: 'Libra', symbol: '♎', range: [9, 23, 10, 22] },
  { name: 'Scorpio', symbol: '♏', range: [10, 23, 11, 21] },
  { name: 'Sagittarius', symbol: '♐', range: [11, 22, 12, 21] },
];

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState('');
  const { toasts, showToast, removeToast } = useToast();

  const details = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const now = new Date();
    if (birth > now) return { error: 'Date in future!' };

    let y = now.getFullYear() - birth.getFullYear();
    let m = now.getMonth() - birth.getMonth();
    let d = now.getDate() - birth.getDate();
    if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }

    const zodiac = ZODIAC.find(z => {
      const [sm, sd, em, ed] = z.range;
      return (birth.getMonth()+1 === sm && birth.getDate() >= sd) || (birth.getMonth()+1 === em && birth.getDate() <= ed);
    }) || ZODIAC[0];

    const totalDays = Math.floor((now - birth) / 864e5);
    const totalMinutes = totalDays * 24 * 60;
    const stats = {
      seconds: (totalMinutes * 60).toLocaleString(),
      minutes: totalMinutes.toLocaleString(),
      heartbeats: (totalMinutes * 70).toLocaleString(),
      breaths: (totalMinutes * 16).toLocaleString()
    };

    return { y, m, d, totalDays, zodiac, stats };
  }, [birthDate]);

  return (
    <>
      <Helmet><title>Age Calculator | ManyTool</title></Helmet>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center gap-4">
          <div className="p-4 bg-pink-500 rounded-2xl text-white"><Cake size={28} /></div>
          <div><h1 className="text-3xl font-bold">Age Calculator</h1><p className="text-gray-500">Precision age metrics.</p></div>
        </header>

        <Tooltip text="Select your date of birth to calculate metrics">
          <div className="relative group bg-gray-900/40 p-6 rounded-2xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:border-cyan-500/50 transition-all duration-300 w-full">
            <label className="block text-sm font-bold mb-3 text-cyan-400">Select Birth Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500" size={20} />
              <input 
                type="date" 
                onChange={(e) => setBirthDate(e.target.value)} 
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-950/50 border border-cyan-500/20 text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner" 
              />
            </div>
          </div>
        </Tooltip>

        {details && !details.error && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[ { l: 'Years', v: details.y, t: 'Your total age in years' }, { l: 'Months', v: details.m, t: 'Additional months' }, { l: 'Days', v: details.d, t: 'Additional days' }, { l: 'Sign', v: `${details.zodiac.symbol} ${details.zodiac.name}`, t: 'Your Zodiac Sign' } ].map((item, i) => (
                <div key={i} className="w-full">
                  <Tooltip text={item.t}>
                    <div className="w-full p-6 bg-gray-900/40 rounded-2xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all text-center cursor-help">
                      <p className="text-xs uppercase font-bold text-cyan-400 mb-2">{item.l}</p>
                      <p className="text-2xl font-black text-white">{item.v}</p>
                    </div>
                  </Tooltip>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[ 
                { l: 'Total Seconds', v: details.stats.seconds, t: 'Your life in seconds' }, 
                { l: 'Total Minutes', v: details.stats.minutes, t: 'Your life in minutes' }, 
                { l: 'Heartbeats', v: details.stats.heartbeats, t: 'Estimated heartbeats' }, 
                { l: 'Breaths Taken', v: details.stats.breaths, t: 'Estimated breaths' } 
              ].map((stat, i) => (
                <div key={i} className="w-full">
                  <Tooltip text={stat.t}>
                    <div className="w-full p-4 bg-gray-900/40 rounded-xl border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all text-center cursor-help">
                      <p className="text-[10px] text-cyan-400 uppercase tracking-wider mb-1">{stat.l}</p>
                      <p className="text-white font-bold text-sm">{stat.v}</p>
                    </div>
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>
        )}
        <Toast toasts={toasts} onRemove={removeToast} />
      </motion.div>
    </>
  );
};

export default AgeCalculator;