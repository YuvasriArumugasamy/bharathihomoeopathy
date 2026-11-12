const API_BASE = import.meta.env.VITE_API_URL || 'https://bharathihomoeopathy.onrender.com/api';

export const visitorService = {
  /**
   * Track an anonymous visitor view
   * Safe, non-blocking and throttled
   */
  trackVisitor: async (pathname = window.location.pathname) => {
    try {
      if (pathname.toLowerCase().startsWith('/admin')) {
        return;
      }

      // 15 seconds session throttle to prevent redundant calls on fast re-renders
      const now = Date.now();
      const lastTrack = parseInt(sessionStorage.getItem('dr_bharathi_last_track') || '0', 10);
      if (now - lastTrack < 15000) {
        return;
      }
      sessionStorage.setItem('dr_bharathi_last_track', String(now));

      let visitorKey = localStorage.getItem('dr_bharathi_vid');
      if (!visitorKey) {
        visitorKey = 'vid_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
        localStorage.setItem('dr_bharathi_vid', visitorKey);
      }

      await fetch(`${API_BASE}/visitors/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitor_key: visitorKey,
          path: pathname
        })
      });
    } catch (err) {
      // Fail silently without disrupting user browsing experience
    }
  },

  /**
   * Fetch visitor statistics for Admin
   */
  getStats: async (period = 'month', year = new Date().getFullYear()) => {
    try {
      const res = await fetch(`${API_BASE}/visitors/stats?period=${encodeURIComponent(period)}&year=${encodeURIComponent(year)}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.warn('[VisitorService] Failed to load visitor stats:', err.message);
      return {
        success: false,
        period,
        selectedYear: year,
        summaryCards: [
          { label: 'Visitors today', count: 0 },
          { label: 'Visitors this week', count: 0 },
          { label: 'Visitors this month', count: 0 },
          { label: 'Visitors last month', count: 0 },
          { label: 'Visitors last 6 months', count: 0 },
        ],
        days: [],
        yearDays: []
      };
    }
  }
};

export default visitorService;

