// Anonymous visit tracking is stored centrally by the backend for all devices.
import { api } from '../utils/api';

let memoryVisitorSessionId = null;

export const visitorService = {
  trackVisitor: async (pathname = window.location.pathname) => {
    if (pathname.toLowerCase().startsWith('/admin')) return;

    const visitorKey = getVisitorKey();
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

    try {
      await api.post('/visitors/track', {
        visitor_key: visitorKey,
        path: pathname,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Visitor tracking backend request failed:', error.message);
    }
  }
};

function getVisitorKey() {
  const cookieName = 'dr_bharathi_visitor_id';
  try {
    const existingCookie = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith(`${cookieName}=`));
    if (existingCookie) return decodeURIComponent(existingCookie.slice(cookieName.length + 1));
    const tabSessionId = sessionStorage.getItem(cookieName);
    if (tabSessionId) return tabSessionId;

    const visitorKey = globalThis.crypto?.randomUUID?.()
      || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${cookieName}=${encodeURIComponent(visitorKey)}; Max-Age=31536000; Path=/; SameSite=Lax${secure}`;
    const cookieWasSaved = document.cookie.split('; ').some((cookie) => cookie.startsWith(`${cookieName}=`));
    if (!cookieWasSaved) sessionStorage.setItem(cookieName, visitorKey);
    return visitorKey;
  } catch (error) {
    console.warn('Visitor ID storage unavailable:', error);
    memoryVisitorSessionId ||= `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    return memoryVisitorSessionId;
  }
}

export default visitorService;
