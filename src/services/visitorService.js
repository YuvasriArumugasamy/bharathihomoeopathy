// Visitor tracking with backend API integration

export const visitorService = {
  /**
   * Track visitor with IP address - sends to backend MongoDB
   */
  trackVisitor: async (pathname = window.location.pathname) => {
    try {
      if (pathname.toLowerCase().startsWith('/admin')) {
        return;
      }

      // 15 seconds throttle
      const now = Date.now();
      const lastTrack = parseInt(sessionStorage.getItem('dr_bharathi_last_track') || '0', 10);
      if (now - lastTrack < 15000) {
        return;
      }
      sessionStorage.setItem('dr_bharathi_last_track', String(now));

      // Get visitor IP address
      let ipAddress = 'unknown';
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ipAddress = ipData.ip;
      } catch (err) {
        console.warn('Could not fetch IP:', err);
        // Continue even if IP fetch fails
      }

      // Generate visitor key (for unique visitor identification)
      const visitorKey = await getVisitorKey(ipAddress);

      // Send to backend API
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        // Remove /api suffix if it exists since we'll add it
        const baseUrl = apiUrl.replace(/\/api$/, '');
        const response = await fetch(`${baseUrl}/api/visitors/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            visitor_key: visitorKey,
            path: pathname,
            timestamp: new Date().toISOString()
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('[VisitorService] ✅ Tracked successfully:', data);
        } else {
          console.warn('[VisitorService] ⚠️ Backend track failed:', response.status, response.statusText);
        }
      } catch (apiErr) {
        console.error('[VisitorService] ❌ API call failed:', apiErr.message);
      }

      // Also store in localStorage as backup
      const records = JSON.parse(localStorage.getItem('visitor_records') || '[]');
      records.push({
        ip: ipAddress,
        path: pathname,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      });

      // Keep only last 1000 records
      if (records.length > 1000) {
        records.splice(0, records.length - 1000);
      }

      localStorage.setItem('visitor_records', JSON.stringify(records));
    } catch (err) {
      console.error('[VisitorService] Track failed:', err.message);
    }
  }
};

/**
 * Generate a unique visitor key based on IP and browser fingerprint
 */
async function getVisitorKey(ipAddress) {
  try {
    const ua = navigator.userAgent || 'unknown';
    const lang = navigator.language || 'en';
    const screen = `${window.screen.width}x${window.screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    
    const fingerprint = `${ipAddress}-${ua}-${lang}-${screen}-${timezone}`;
    
    // Create a hash using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprint);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
  } catch (err) {
    console.warn('Fingerprint generation failed:', err);
    // Fallback to simple hash
    return btoa(`${ipAddress}-${Date.now()}`).substring(0, 32);
  }
}

export default visitorService;
