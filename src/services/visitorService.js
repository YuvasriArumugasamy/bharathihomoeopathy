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

      // Use a stable, anonymous browser ID. Avoid an external IP lookup because
      // mobile networks and privacy settings can block it and delay tracking.
      const visitorKey = getVisitorKey();

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
        // The fallback stats group by this field; use the same anonymous ID.
        ip: visitorKey,
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
 * Keep one anonymous visitor ID per browser so repeat visits count consistently.
 */
function getVisitorKey() {
  const storageKey = 'dr_bharathi_visitor_key';
  try {
    let visitorKey = localStorage.getItem(storageKey);
    if (!visitorKey) {
      visitorKey = globalThis.crypto?.randomUUID?.()
        || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(storageKey, visitorKey);
    }
    return visitorKey;
  } catch (err) {
    console.warn('Visitor ID storage unavailable:', err);
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }
}

export default visitorService;
