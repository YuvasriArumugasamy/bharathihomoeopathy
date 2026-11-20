// Simple localStorage-based visitor tracking (no Firebase needed!)

export const visitorService = {
  /**
   * Track visitor with IP address
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
      }

      // Store in localStorage
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
      console.log('[VisitorService] Tracked:', ipAddress);
    } catch (err) {
      console.error('[VisitorService] Track failed:', err.message);
    }
  }
};

export default visitorService;
