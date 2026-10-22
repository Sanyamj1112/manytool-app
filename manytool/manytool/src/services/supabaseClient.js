import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://szbqxdqvwyqolplljatj.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6YnF4ZHF2d3lxb2xwbGxqYXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0ODU5ODQsImV4cCI6MjEwMzA2MTk4NH0.THPtcRINH2pYTcA5N_PCgP-5ETXYvjrNpECo3da_8hI';

export const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Session ID (one per browser session, groups multiple tool visits together) ───
const getSessionId = () => {
  let sid = sessionStorage.getItem('mt_session_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now();
    sessionStorage.setItem('mt_session_id', sid);
  }
  return sid;
};

// ─── User-Agent Parsing ───
const parseUserAgent = () => {
  const ua = navigator.userAgent;

  let deviceType = 'Desktop';
  if (/mobile/i.test(ua)) deviceType = 'Mobile';
  else if (/tablet|ipad/i.test(ua)) deviceType = 'Tablet';

  let osName = 'Unknown';
  if (/windows/i.test(ua)) osName = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) osName = 'MacOS';
  else if (/android/i.test(ua)) osName = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) osName = 'iOS';
  else if (/linux/i.test(ua)) osName = 'Linux';

  let browser = 'Unknown';
  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/opr|opera/i.test(ua)) browser = 'Opera';
  else if (/chrome/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/firefox/i.test(ua)) browser = 'Firefox';

  return { deviceType, osName, browser };
};

// ─── IP & Location Fetch (cached per session) ───
let cachedGeoData = null;

const fetchGeoData = async () => {
  if (cachedGeoData) return cachedGeoData;
  try {
    // Single fast call: ipwho.is gives IP, City, Country, Country Code, and Flag
    const res = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(3500) });
    const data = await res.json();

    if (data && data.success !== false && data.ip) {
      cachedGeoData = {
        ip_address: data.ip,
        city: data.city || 'Unknown',
        country: data.country || 'Unknown',
        country_code: data.country_code || '--',
      };
      return cachedGeoData;
    }
  } catch (e) {
    // Fallback if ipwho.is is blocked
  }

  try {
    const ipRes = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) });
    const { ip } = await ipRes.json();
    cachedGeoData = {
      ip_address: ip,
      city: 'Unknown',
      country: 'Unknown',
      country_code: '--',
    };
    return cachedGeoData;
  } catch {
    return { ip_address: 'unknown', city: 'Unknown', country: 'Unknown', country_code: '--' };
  }
};

// ─── Main Analytics Logger ───
export const logAnalytics = async (toolName = 'Home Page') => {
  try {
    const sessionId = getSessionId();
    const { deviceType, osName, browser } = parseUserAgent();
    const geo = await fetchGeoData();

    await supabase.from('analytics_logs').insert([{
      session_id: sessionId,
      tool_name: toolName,
      device_type: deviceType,
      os_name: osName,
      browser,
      ip_address: geo.ip_address,
      city: geo.city,
      country: geo.country,
      country_code: geo.country_code,
      referrer: document.referrer || 'direct',
      screen_width: window.screen.width,
    }]);
  } catch (error) {
    // Silently fail — analytics should never break the app
    console.warn('Analytics log failed:', error.message);
  }
};