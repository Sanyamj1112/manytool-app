/**
 * AdminDashboard.jsx
 * Full analytics dashboard — dark space theme, session-based tracking,
 * IP address, city, country, device breakdown, top tools.
 * 
 * IMPORTANT: Change the admin passcode via VITE_ADMIN_PASS env var in Vercel dashboard.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabaseClient';
import {
  Activity, Globe, Monitor, Smartphone, Tablet, RefreshCw,
  TrendingUp, Users, MapPin, Clock, Shield, Eye, EyeOff, ChevronDown, ChevronUp
} from 'lucide-react';

const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || 'manytool@admin2026';

// ─── Stat Card Component ───
const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
  <motion.div
    whileHover={{ y: -3, scale: 1.02 }}
    className={`p-5 rounded-2xl bg-slate-900/80 border backdrop-blur-xl shadow-xl ${color}`}
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</span>
      <div className="p-2 rounded-xl bg-white/5 border border-white/10">
        <Icon size={16} className="text-gray-300" />
      </div>
    </div>
    <p className="text-3xl font-black text-white mb-1">{value}</p>
    {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
  </motion.div>
);

// ─── Tool Usage Bar ───
const ToolBar = ({ tool, count, total, color }) => {
  const pct = Math.round((count / total) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-gray-300">{tool}</span>
        <span className="font-mono text-gray-400">{count} visits ({pct}%)</span>
      </div>
      <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
};

// ─── Country Flag Emoji ───
const getFlagEmoji = (countryCode) => {
  if (!countryCode || countryCode === '--') return '🌐';
  return countryCode.toUpperCase().replace(/./g, (char) =>
    String.fromCodePoint(127397 + char.charCodeAt(0))
  );
};

// ─── Main Component ───
export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [tableExpanded, setTableExpanded] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === ADMIN_PASS) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert('❌ Wrong passcode!');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('analytics_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);
      if (error) throw error;
      setLogs(data || []);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Analytics fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Derived Stats ───
  const stats = useMemo(() => {
    if (!logs.length) return null;

    const totalVisits = logs.length;
    const uniqueSessions = new Set(logs.map(l => l.session_id).filter(Boolean)).size;
    const uniqueIPs = new Set(logs.map(l => l.ip_address).filter(Boolean)).size;

    // Tool frequency
    const toolCounts = {};
    logs.forEach(l => { toolCounts[l.tool_name] = (toolCounts[l.tool_name] || 0) + 1; });
    const topTools = Object.entries(toolCounts).sort(([, a], [, b]) => b - a);

    // Device breakdown
    const deviceCounts = {};
    logs.forEach(l => { deviceCounts[l.device_type] = (deviceCounts[l.device_type] || 0) + 1; });

    // Country breakdown
    const countryCounts = {};
    logs.forEach(l => {
      const key = `${l.country_code || '--'}|||${l.country || 'Unknown'}`;
      countryCounts[key] = (countryCounts[key] || 0) + 1;
    });
    const topCountries = Object.entries(countryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([key, count]) => {
        const [code, name] = key.split('|||');
        return { code, name, count };
      });

    // Browser breakdown
    const browserCounts = {};
    logs.forEach(l => { browserCounts[l.browser] = (browserCounts[l.browser] || 0) + 1; });

    return { totalVisits, uniqueSessions, uniqueIPs, topTools, deviceCounts, topCountries, browserCounts };
  }, [logs]);

  const toolColors = [
    'bg-cyan-400', 'bg-purple-400', 'bg-emerald-400', 'bg-amber-400',
    'bg-pink-400', 'bg-blue-400', 'bg-teal-400', 'bg-rose-400',
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="p-8 rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Admin Portal</h2>
                <p className="text-xs text-gray-400">ManyTool Analytics</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter admin passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-3 pr-10 bg-slate-950/80 border border-white/15 rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                Access Dashboard
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              ● Live
            </span>
          </div>
          <h1 className="text-3xl font-black text-white">Analytics Dashboard</h1>
          {lastRefresh && (
            <p className="text-xs text-gray-500 mt-1">
              Last refreshed: {lastRefresh.toLocaleTimeString()}
            </p>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </motion.button>
      </div>

      {/* Top Summary Cards */}
      {stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Activity} label="Total Visits" value={stats.totalVisits} color="border-cyan-500/25" subtext="All page views" />
            <StatCard icon={Users} label="Unique Sessions" value={stats.uniqueSessions} color="border-purple-500/25" subtext="Browser sessions" />
            <StatCard icon={Globe} label="Unique IPs" value={stats.uniqueIPs} color="border-emerald-500/25" subtext="Distinct users" />
            <StatCard
              icon={TrendingUp}
              label="Top Tool"
              value={stats.topTools[0]?.[0]?.split(' ').slice(0, 2).join(' ') || '—'}
              color="border-amber-500/25"
              subtext={`${stats.topTools[0]?.[1] || 0} visits`}
            />
          </div>

          {/* Tool Usage + Countries Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Tools */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
              <h3 className="font-black text-white flex items-center gap-2 text-sm uppercase tracking-widest">
                <TrendingUp size={16} className="text-cyan-400" /> Tool Usage
              </h3>
              <div className="space-y-3">
                {stats.topTools.map(([tool, count], i) => (
                  <ToolBar key={tool} tool={tool} count={count} total={stats.totalVisits} color={toolColors[i % toolColors.length]} />
                ))}
              </div>
            </div>

            {/* Countries */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
              <h3 className="font-black text-white flex items-center gap-2 text-sm uppercase tracking-widest">
                <MapPin size={16} className="text-purple-400" /> Top Countries
              </h3>
              <div className="space-y-2">
                {stats.topCountries.map(({ code, name, count }) => (
                  <div key={code} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getFlagEmoji(code)}</span>
                      <span className="text-sm text-gray-300 font-medium">{name}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-white/10">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Device & Browser Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-3">
              <h3 className="font-black text-white flex items-center gap-2 text-sm uppercase tracking-widest">
                <Monitor size={16} className="text-emerald-400" /> Devices
              </h3>
              {Object.entries(stats.deviceCounts).map(([device, count]) => (
                <div key={device} className="flex items-center gap-3">
                  {device === 'Mobile' ? <Smartphone size={14} className="text-cyan-400" /> : device === 'Tablet' ? <Tablet size={14} className="text-purple-400" /> : <Monitor size={14} className="text-emerald-400" />}
                  <span className="text-sm text-gray-300 flex-1">{device}</span>
                  <span className="text-xs font-mono text-gray-400">{count} ({Math.round((count / stats.totalVisits) * 100)}%)</span>
                </div>
              ))}
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl space-y-3">
              <h3 className="font-black text-white flex items-center gap-2 text-sm uppercase tracking-widest">
                <Globe size={16} className="text-amber-400" /> Browsers
              </h3>
              {Object.entries(stats.browserCounts).sort(([, a], [, b]) => b - a).map(([browser, count]) => (
                <div key={browser} className="flex items-center gap-3">
                  <span className="text-sm text-gray-300 flex-1">{browser}</span>
                  <span className="text-xs font-mono text-gray-400">{count} ({Math.round((count / stats.totalVisits) * 100)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Raw Logs Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl overflow-hidden">
        <button
          onClick={() => setTableExpanded(!tableExpanded)}
          className="w-full flex items-center justify-between px-6 py-4 border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
        >
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Clock size={16} className="text-gray-400" /> Raw Visitor Logs ({logs.length})
          </h3>
          {tableExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>

        <AnimatePresence>
          {tableExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-x-auto"
            >
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950/60 text-gray-400 uppercase tracking-widest">
                    {['Tool', 'IP', 'City', 'Country', 'Device', 'OS', 'Browser', 'Session', 'Time'].map(h => (
                      <th key={h} className="px-4 py-3 font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {logs.slice(0, 200).map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-2.5 font-semibold text-cyan-400 whitespace-nowrap">{log.tool_name}</td>
                      <td className="px-4 py-2.5 font-mono text-gray-400">{log.ip_address || '—'}</td>
                      <td className="px-4 py-2.5 text-gray-300">{log.city || '—'}</td>
                      <td className="px-4 py-2.5 text-gray-300">
                        {getFlagEmoji(log.country_code)} {log.country || '—'}
                      </td>
                      <td className="px-4 py-2.5 text-gray-400">{log.device_type}</td>
                      <td className="px-4 py-2.5 text-gray-400">{log.os_name}</td>
                      <td className="px-4 py-2.5 text-gray-400">{log.browser}</td>
                      <td className="px-4 py-2.5 font-mono text-gray-500 text-[10px]">{log.session_id?.slice(5, 14) || '—'}</td>
                      <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}