import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Cake, Calendar, Clock, Activity, Heart, Wind, Sparkles, Timer, Flame, PartyPopper } from 'lucide-react';
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
  const [now, setNow] = useState(new Date());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Cursor Fire Trail Particles State
  const [fireTrails, setFireTrails] = useState([]);

  // Interactive Cake & Celebration States
  const [candleLit, setCandleLit] = useState(true);
  const [celebrating, setCelebrating] = useState(false);

  const containerRef = useRef(null);

  // Live second-by-second ticker
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Cyber-Dark Mouse Tracker & Glowing Fire Trail Generator
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const newParticle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      
      setFireTrails((prev) => [...prev.slice(-10), newParticle]);
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        setMousePosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleBlowCandle = () => {
    setCandleLit(false);
    setCelebrating(true);
    setTimeout(() => {
      setCelebrating(false);
    }, 4500);
  };

  const details = React.useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    if (birth > now) return { error: 'Date in future!' };

    let y = now.getFullYear() - birth.getFullYear();
    let m = now.getMonth() - birth.getMonth();
    let d = now.getDate() - birth.getDate();
    
    if (d < 0) { 
      m--; 
      d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); 
    }
    if (m < 0) { 
      y--; 
      m += 12; 
    }

    const zodiac = ZODIAC.find(z => {
      const [sm, sd, em, ed] = z.range;
      return (birth.getMonth()+1 === sm && birth.getDate() >= sd) || (birth.getMonth()+1 === em && birth.getDate() <= ed);
    }) || ZODIAC[0];

    const diffMs = now - birth;
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);

    const stats = {
      seconds: totalSeconds.toLocaleString(),
      minutes: totalMinutes.toLocaleString(),
      heartbeats: Math.floor(totalMinutes * 70).toLocaleString(),
      breaths: Math.floor(totalMinutes * 16).toLocaleString()
    };

    return { y, m, d, zodiac, stats };
  }, [birthDate, now]);

  return (
    <>
      <Helmet><title>Age Calculator | ManyTool</title></Helmet>

      {/* Cinematic Cyber-Dark Background Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full bg-amber-600/20 blur-[130px]"
          animate={{ x: mousePosition.x * 0.07, y: mousePosition.y * 0.07 }}
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
          style={{ top: '10%', left: '15%' }}
        />
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[130px]"
          animate={{ x: -mousePosition.x * 0.06, y: -mousePosition.y * 0.06 }}
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
          style={{ bottom: '10%', right: '10%' }}
        />
      </div>

      {/* Lightweight Glowing Fire & Sparkle Cursor Trail Effect */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {fireTrails.map((trail, index) => (
          <motion.div
            key={trail.id}
            initial={{ opacity: 0.9, scale: 1.2, y: 0 }}
            animate={{ opacity: 0, scale: 0.3, y: -30 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute text-2xl drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] filter brightness-125"
            style={{ left: trail.x - 12, top: trail.y - 12 }}
          >
            {index % 2 === 0 ? '🔥' : '✨'}
          </motion.div>
        ))}
      </div>

      {/* Scoped Celebration Overlay */}
      <AnimatePresence>
        {celebrating && (
          <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
            
            {/* Balloons floating upward */}
            {[...Array(18)].map((_, i) => (
              <motion.div
                key={`balloon-${i}`}
                initial={{ opacity: 0, y: 50, x: `${(i + 1) * 5}%` }}
                animate={{ opacity: [0, 1, 1, 0], y: [0, -350], scale: [0.8, 1.3] }}
                transition={{ duration: 3.5, ease: "easeOut", delay: i * 0.06 }}
                className="absolute top-24 text-3xl sm:text-4xl"
              >
                {['🎈', '🎊', '✨', '🎈', '⭐', '🎁'][i % 6]}
              </motion.div>
            ))}

            {/* Top-Left Corner Blast */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`tl-${i}`}
                initial={{ opacity: 1, x: 20, y: 20, scale: 0.5 }}
                animate={{ opacity: 0, x: 120 + i * 30, y: 100 + i * 20, scale: 1.5, rotate: 360 }}
                transition={{ duration: 2.2, ease: "easeOut" }}
                className="absolute top-4 left-4 text-2xl"
              >
                {['🎉', '✨', '🚀', '⭐'][i % 4]}
              </motion.div>
            ))}

            {/* Top-Right Corner Blast */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`tr-${i}`}
                initial={{ opacity: 1, x: '95%', y: 20, scale: 0.5 }}
                animate={{ opacity: 0, x: '70%', y: 100 + i * 20, scale: 1.5, rotate: -360 }}
                transition={{ duration: 2.2, ease: "easeOut" }}
                className="absolute top-4 right-4 text-2xl"
              >
                {['🎉', '⭐', '🎊', '🥳'][i % 4]}
              </motion.div>
            ))}

            {/* Bottom-Left Corner Blast */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`bl-${i}`}
                initial={{ opacity: 1, x: 20, y: '85%', scale: 0.5 }}
                animate={{ opacity: 0, x: 120 + i * 30, y: '70%', scale: 1.5, rotate: 360 }}
                transition={{ duration: 2.2, ease: "easeOut" }}
                className="absolute bottom-4 left-4 text-2xl"
              >
                {['🎈', '✨', '🥳', '🍰'][i % 4]}
              </motion.div>
            ))}

            {/* Bottom-Right Corner Blast */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`br-${i}`}
                initial={{ opacity: 1, x: '95%', y: '85%', scale: 0.5 }}
                animate={{ opacity: 0, x: '70%', y: '70%', scale: 1.5, rotate: -360 }}
                transition={{ duration: 2.2, ease: "easeOut" }}
                className="absolute bottom-4 right-4 text-2xl"
              >
                {['🎉', '🍰', '🎈', '💖'][i % 4]}
              </motion.div>
            ))}

          </div>
        )}
      </AnimatePresence>

      <motion.div 
        ref={containerRef}
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 max-w-7xl mx-auto space-y-8 pb-16 px-2 sm:px-6 pt-4"
      >
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-dashed border-white/15 pb-6 gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/15 border-2 border-dashed border-amber-400 text-amber-300 text-xs font-semibold tracking-wider uppercase shadow-lg shadow-amber-500/10">
                Chronological Metrics
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Timer className="text-amber-400 shrink-0" size={32} /> Age Calculator
            </h1>
          </div>
          <p className="text-gray-400 text-sm max-w-md italic font-mono">
            ~ calculate precise chronological age and live biological metrics ~
          </p>
        </header>

        {/* Layout Row: Date Card on Left, Fully Clickable Celebration Zone on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-6">
          
          {/* Date Input Card */}
          <div className="lg:col-span-7 p-8 rounded-[28px] bg-slate-950/85 backdrop-blur-2xl border-4 border-dashed border-amber-500/40 shadow-2xl relative space-y-4">
            <div className="absolute -top-4 -right-4 bg-amber-500 text-slate-950 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase rotate-6 shadow-xl border border-amber-300 z-20">
              SELECT DATE 📌
            </div>

            <label className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2 font-mono">
              <Calendar size={16} className="text-amber-400" /> Select Birth Date
            </label>
            <div className="relative">
              <input 
                type="date" 
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)} 
                className="w-full px-5 py-4 rounded-2xl bg-slate-900 border-2 border-amber-400/50 text-white font-mono font-bold outline-none focus:ring-4 focus:ring-amber-400/20 transition-all shadow-inner text-base" 
              />
            </div>
          </div>

          {/* Interactive Celebration Zone Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBlowCandle}
            className="lg:col-span-5 p-6 rounded-[28px] bg-slate-950/85 backdrop-blur-2xl border-4 border-dashed border-amber-500/40 shadow-2xl flex items-center justify-between relative group cursor-pointer"
          >
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                {candleLit ? '🎂 CLICK TO BLOW CANDLE' : '✨ WISH GRANTED'}
              </span>
              <h3 className="text-white font-bold text-base">Celebration Zone</h3>
              <p className="text-xs text-gray-400 font-mono">
                {candleLit ? 'Click here to trigger corner blasts!' : 'Balloons & party poppers active!'}
              </p>
            </div>

            <div className="relative p-4 bg-amber-500/15 rounded-2xl border-2 border-amber-400/50 flex items-center justify-center shadow-lg">
              <Cake size={40} className="text-amber-400" />
              {candleLit && (
                <motion.div 
                  animate={{ y: [0, -6, 0], scale: [1, 1.1, 1] }} 
                  transition={{ repeat: Infinity, duration: 0.7 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 text-orange-400"
                >
                  <Flame size={22} />
                </motion.div>
              )}
            </div>
          </motion.div>

        </div>

        {/* Celebration Banner when candle is blown */}
        <AnimatePresence>
          {celebrating && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="p-6 rounded-[24px] bg-gradient-to-r from-amber-500/20 via-pink-500/25 to-purple-500/20 border-2 border-amber-400 text-center relative overflow-hidden shadow-2xl backdrop-blur-2xl"
            >
              <h3 className="text-xl font-black text-amber-300 flex items-center justify-center gap-2 mb-1">
                <PartyPopper size={22} /> Wish Granted & Candle Blown Out! 🎊
              </h3>
              <p className="text-sm text-gray-200 font-mono">
                May your live seconds count towards epic adventures and legendary achievements! ✨
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated Cards Container */}
        <AnimatePresence mode="wait">
          {details && !details.error && (
            <motion.div 
              key={birthDate}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 pt-2"
            >
              
              {/* Primary Cards flying in */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[ 
                  { l: 'Years Lived', v: details.y, t: 'Total completed solar years', color: 'border-pink-500/50 text-pink-300 bg-pink-950/20', initialX: -120, initialY: -60 }, 
                  { l: 'Months', v: details.m, t: 'Additional months', color: 'border-purple-500/50 text-purple-300 bg-purple-950/20', initialX: 120, initialY: -60 }, 
                  { l: 'Days', v: details.d, t: 'Additional days', color: 'border-cyan-500/50 text-cyan-300 bg-cyan-950/20', initialX: -120, initialY: 60 }, 
                  { l: 'Zodiac Sign', v: `${details.zodiac.symbol} ${details.zodiac.name}`, t: 'Astrological sign', color: 'border-amber-500/50 text-amber-300 bg-amber-950/20', initialX: 120, initialY: 60 } 
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: item.initialX, y: item.initialY, scale: 0.7 }}
                    animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 120, damping: 14, delay: i * 0.1 }}
                    className="w-full"
                  >
                    <Tooltip text={item.t}>
                      <motion.div 
                        whileHover={{ rotate: i % 2 === 0 ? 1 : -1, scale: 1.02 }}
                        className={`p-7 rounded-[28px] border-4 border-dashed ${item.color} backdrop-blur-xl shadow-xl flex flex-col justify-between h-full cursor-pointer relative overflow-hidden`}
                      >
                        <p className="text-xs uppercase font-extrabold tracking-widest mb-3 opacity-90 font-mono">{item.l}</p>
                        <p className="text-4xl font-black text-white tracking-tight">{item.v}</p>
                      </motion.div>
                    </Tooltip>
                  </motion.div>
                ))}
              </div>

              {/* Upgraded Live Biological Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[ 
                  { l: 'Live Seconds', v: details.stats.seconds, t: 'Exact seconds ticking live', icon: Clock, color: 'border-emerald-500/50 text-emerald-300 bg-emerald-950/20' }, 
                  { l: 'Live Minutes', v: details.stats.minutes, t: 'Exact minutes ticking live', icon: Activity, color: 'border-teal-500/50 text-teal-300 bg-teal-950/20' }, 
                  { l: 'Heartbeats', v: details.stats.heartbeats, t: 'Estimated cumulative heartbeats', icon: Heart, color: 'border-rose-500/50 text-rose-300 bg-rose-950/20' }, 
                  { l: 'Breaths Taken', v: details.stats.breaths, t: 'Estimated cumulative respirations', icon: Wind, color: 'border-sky-500/50 text-sky-300 bg-sky-950/20' } 
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 100, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 130, damping: 12, delay: 0.45 + (i * 0.08) }}
                    className="w-full"
                  >
                    <Tooltip text={stat.t}>
                      <motion.div 
                        whileHover={{ scale: 1.02, y: -2 }}
                        className={`p-5 rounded-[22px] border-2 border-dashed ${stat.color} backdrop-blur-xl shadow-lg relative overflow-hidden flex flex-col justify-between`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] uppercase tracking-wider font-bold font-mono opacity-90">{stat.l}</span>
                          <stat.icon size={16} className="opacity-80" />
                        </div>
                        <p className="text-white font-mono font-black text-lg tracking-tight">{stat.v}</p>
                      </motion.div>
                    </Tooltip>
                  </motion.div>
                ))}
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default AgeCalculator;