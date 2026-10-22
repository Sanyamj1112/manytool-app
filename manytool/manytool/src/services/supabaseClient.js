import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://szbqxdqvwyqolplljatj.supabase.co';
const DEFAULT_KEY = 'sb_publishable_XeZCZrPGIRlKAjUEBgkQNQ_QPxj3NHb';

/**
 * Validates and sanitizes a URL string.
 * Returns null if the URL is missing, invalid, or does not start with http/https.
 */
const sanitizeUrl = (raw) => {
  if (!raw || typeof raw !== 'string') return null;
  let trimmed = raw.trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null' || trimmed.length < 8) return null;
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    trimmed = 'https://' + trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    return null;
  }
  return null;
};

const sanitizeKey = (raw) => {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null' || trimmed.length < 20) return null;
  return trimmed;
};

// Safe initialization with fallback
const targetUrl = sanitizeUrl(import.meta.env.VITE_SUPABASE_URL) || DEFAULT_URL;
const targetKey = sanitizeKey(import.meta.env.VITE_SUPABASE_ANON_KEY) || DEFAULT_KEY;

let clientInstance = null;
try {
  clientInstance = createClient(targetUrl, targetKey);
} catch (err) {
  console.warn('Supabase initialization fallback triggered:', err?.message);
}

// Fallback proxy so calling supabase.from(...).insert/select NEVER throws uncaught errors
const safeFallback = {
  from: () => ({
    insert: () => Promise.resolve({ data: null, error: null }),
    select: () => ({
      order: () => ({
        limit: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
  }),
};

export const supabase = clientInstance || safeFallback;

// ─── Session ID (one per browser session, groups multiple tool visits together) ───
const getSessionId = () => {
  try {
    let sid = sessionStorage.getItem('mt_session_id');
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now();
      sessionStorage.setItem('mt_session_id', sid);
    }
    return sid;
  } catch {
    return 'sess_' + Date.now();
  }
};

// ─── User-Agent Parsing ───
const parseUserAgent = () => {
  const ua = navigator.userAgent || '';

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
  } catch {
    // Fallback if ipwho.is fails
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
    if (!supabase || typeof supabase.from !== 'function') return;
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
      screen_width: window.screen ? window.screen.width : 0,
    }]);
  } catch (error) {
    // Analytics should NEVER break the application
    console.warn('Analytics log failed:', error?.message);
  }
};
