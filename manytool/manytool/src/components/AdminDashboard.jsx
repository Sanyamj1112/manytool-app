import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simple Passcode Guard (Change 'danish123' to whatever secret password you want)
  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === 'danish123') {
      setIsAuthenticated(true);
      fetchAnalyticsData();
    } else {
      alert('Galat Passcode hai bhai!');
    }
  };

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('analytics_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center py-20">
        <form onSubmit={handleLogin} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">Admin Portal Login</h2>
          <input
            type="password"
            placeholder="Enter Admin Passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all"
          >
            Login to Dashboard
          </button>
        </form>
      </div>
    );
  }

  // Calculations for Metrics
  const totalVisits = logs.length;
  const uniqueDevices = [...new Set(logs.map(log => log.device_type))].length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Analytics Dashboard</h1>
        <button
          onClick={fetchAnalyticsData}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-all"
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Page / Tool Visits</p>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{totalVisits}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Device Types</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">{uniqueDevices}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
          <p className="text-xl font-semibold text-green-600 dark:text-green-400 mt-3">● Live Tracking Active</p>
        </div>
      </div>

      {/* Detailed Logs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Real-time Visitor Logs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm">
                <th className="p-4">Tool / Page</th>
                <th className="p-4">Device</th>
                <th className="p-4">OS</th>
                <th className="p-4">Browser</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm text-gray-700 dark:text-gray-300">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="p-4 font-medium text-indigo-600 dark:text-indigo-400">{log.tool_name}</td>
                    <td className="p-4">{log.device_type}</td>
                    <td className="p-4">{log.os_name}</td>
                    <td className="p-4">{log.browser}</td>
                    <td className="p-4">{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">No logs found yet. Try visiting some tools!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}