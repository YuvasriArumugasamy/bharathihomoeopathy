// Visitor tracking with backend API integration
let memoryVisitorSessionId = null;

export const visitorService = {
  /**
   * Track visitor with IP address - sends to backend MongoDB
   */
  trackVisitor: async (pathname = window.location.pathname) => {
    try {
      if (pathname.toLowerCase().startsWith('/admin')) {
        return;
      }

      const visitorKey = getVisitorKey();

      // React StrictMode can run an effect twice on initial render. Ignore only
      // the immediate duplicate for the same page; other pages count as views.
      const now = Date.now();
      try {
        const lastPage = sessionStorage.getItem('dr_bharathi_last_tracked_page');
        const lastPageAt = Number(sessionStorage.getItem('dr_bharathi_last_tracked_page_at') || 0);
        if (lastPage === pathname && now - lastPageAt < 1500) return;
        sessionStorage.setItem('dr_bharathi_last_tracked_page', pathname);
        sessionStorage.setItem('dr_bharathi_last_tracked_page_at', String(now));
      } catch {
        // Continue tracking if browser storage is disabled.
      }

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
 * Keep an anonymous visitor ID for this browser tab's session.
 */
function getVisitorKey() {
  const storageKey = 'dr_bharathi_visitor_session';
  try {
    let visitorKey = sessionStorage.getItem(storageKey);
    if (!visitorKey) {
      visitorKey = globalThis.crypto?.randomUUID?.()
        || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(storageKey, visitorKey);
    }
    return visitorKey;
  } catch (err) {
    console.warn('Visitor ID storage unavailable:', err);
    memoryVisitorSessionId ||= `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    return memoryVisitorSessionId;
  }
}

export default visitorService;
