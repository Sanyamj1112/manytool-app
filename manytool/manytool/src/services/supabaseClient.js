import { createClient } from '@supabase/supabase-js';

// Direct hardcoded values taaki Vercel build mein kabhi error na aaye
const supabaseUrl = 'https://szbqxdqvwyqolplljatj.supabase.co';
const supabaseKey = 'sb_publishable_XeZCZrPGIRlKAjUEbGKqNQ_QPxj3NHb';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Telemetry log function
export const logAnalytics = async (toolName = 'Home Page') => {
  try {
    const userAgent = navigator.userAgent;

    // Simple Device & OS Detection
    let deviceType = 'Desktop';
    if (/mobile/i.test(userAgent)) deviceType = 'Mobile';
    else if (/tablet|ipad/i.test(userAgent)) deviceType = 'Tablet';

    let osName = 'Unknown OS';
    if (/windows/i.test(userAgent)) osName = 'Windows';
    else if (/macintosh|mac os x/i.test(userAgent)) osName = 'MacOS';
    else if (/android/i.test(userAgent)) osName = 'Android';
    else if (/iphone|ipad|ipod/i.test(userAgent)) osName = 'iOS';
    else if (/linux/i.test(userAgent)) osName = 'Linux';

    let browser = 'Unknown Browser';
    if (/chrome/i.test(userAgent) && !/edge|opr/i.test(userAgent)) browser = 'Chrome';
    else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = 'Safari';
    else if (/firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/edge/i.test(userAgent)) browser = 'Edge';

    // Send data to Supabase table
    await supabase.from('analytics_logs').insert([
      {
        device_type: deviceType,
        os_name: osName,
        browser: browser,
        tool_name: toolName
      }
    ]);
  } catch (error) {
    console.error('Error logging analytics:', error);
  }
};