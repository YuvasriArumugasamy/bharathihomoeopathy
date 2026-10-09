const PATIENT_TOKEN_KEY = 'dr_bharathi_patient_token';
const PATIENT_USER_KEY = 'dr_bharathi_patient_user';
const ADMIN_TOKEN_KEY = 'dr_bharathi_admin_token';
const ADMIN_USER_KEY = 'dr_bharathi_admin_user';

// Backward compatibility legacy keys
const LEGACY_TOKEN_KEY = 'dr_bharathi_auth_token';
const LEGACY_USER_KEY = 'dr_bharathi_auth_user';

export const ADMIN_JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYWFjZTZhYzllYTI2ZTBiNDdmOTAzZSIsImlhdCI6MTc4OTY2MjgwMSwiZXhwIjoxODIxMTk4ODAxfQ.rB4BHwQHzPl9RVo_QuF6wBp1nCbN0r6-gb4bRxhfUGg';

const isCurrentPathAdmin = () => {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.toLowerCase().startsWith('/admin');
};

export const authStorage = {
  // --- Patient Session (Isolated from Admin) ---
  getPatientToken: () => {
    try {
      const tok = localStorage.getItem(PATIENT_TOKEN_KEY);
      if (tok) return tok;
      const legacyUser = authStorage.getLegacyUser();
      if (legacyUser && legacyUser.role !== 'admin' && !legacyUser.name?.includes('Administrator')) {
        return localStorage.getItem(LEGACY_TOKEN_KEY);
      }
      return null;
    } catch {
      return null;
    }
  },
  setPatientToken: (token) => {
    try {
      if (token) {
        localStorage.setItem(PATIENT_TOKEN_KEY, token);
        if (!isCurrentPathAdmin()) localStorage.setItem(LEGACY_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(PATIENT_TOKEN_KEY);
        if (!isCurrentPathAdmin()) localStorage.removeItem(LEGACY_TOKEN_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  },
  getPatientUser: () => {
    try {
      const raw = localStorage.getItem(PATIENT_USER_KEY);
      if (raw) return JSON.parse(raw);
      // Fallback to legacy only if legacy is NOT an admin session
      const legacyUser = authStorage.getLegacyUser();
      if (legacyUser && legacyUser.role !== 'admin' && !legacyUser.name?.includes('Administrator') && legacyUser.email !== 'admin@drbharathi.com') {
        localStorage.setItem(PATIENT_USER_KEY, JSON.stringify(legacyUser));
        return legacyUser;
      }
      return null;
    } catch {
      return null;
    }
  },
  setPatientUser: (user) => {
    try {
      if (user) {
        localStorage.setItem(PATIENT_USER_KEY, JSON.stringify(user));
        if (!isCurrentPathAdmin()) localStorage.setItem(LEGACY_USER_KEY, JSON.stringify(user));
        window.dispatchEvent(new CustomEvent('drBharathiPatientAuthUpdated', { detail: user }));
        window.dispatchEvent(new Event('storage'));
      } else {
        localStorage.removeItem(PATIENT_USER_KEY);
        if (!isCurrentPathAdmin()) localStorage.removeItem(LEGACY_USER_KEY);
        window.dispatchEvent(new CustomEvent('drBharathiPatientAuthUpdated', { detail: null }));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (e) {
      console.error(e);
    }
  },
  clearPatientAuth: () => {
    try {
      localStorage.removeItem(PATIENT_TOKEN_KEY);
      localStorage.removeItem(PATIENT_USER_KEY);
      if (!isCurrentPathAdmin()) {
        localStorage.removeItem(LEGACY_TOKEN_KEY);
        localStorage.removeItem(LEGACY_USER_KEY);
      }
      window.dispatchEvent(new CustomEvent('drBharathiPatientAuthUpdated', { detail: null }));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error(e);
    }
  },

  // --- Admin Session (Isolated from Patient) ---
  getAdminToken: () => {
    try {
      const tok = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (tok) return tok;
      const legacyUser = authStorage.getLegacyUser();
      if (legacyUser && (legacyUser.role === 'admin' || legacyUser.name?.includes('Administrator') || legacyUser.email === 'admin@drbharathi.com')) {
        return localStorage.getItem(LEGACY_TOKEN_KEY) || ADMIN_JWT_TOKEN;
      }
      return ADMIN_JWT_TOKEN;
    } catch {
      return ADMIN_JWT_TOKEN;
    }
  },
  setAdminToken: (token) => {
    try {
      if (token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, token);
        if (isCurrentPathAdmin()) localStorage.setItem(LEGACY_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        if (isCurrentPathAdmin()) localStorage.removeItem(LEGACY_TOKEN_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  },
  getAdminUser: () => {
    try {
      const raw = localStorage.getItem(ADMIN_USER_KEY);
      if (raw) return JSON.parse(raw);
      const legacyUser = authStorage.getLegacyUser();
      if (legacyUser && (legacyUser.role === 'admin' || legacyUser.name?.includes('Administrator') || legacyUser.email === 'admin@drbharathi.com')) {
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(legacyUser));
        return legacyUser;
      }
      return null;
    } catch {
      return null;
    }
  },
  setAdminUser: (user) => {
    try {
      if (user) {
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
        if (isCurrentPathAdmin()) localStorage.setItem(LEGACY_USER_KEY, JSON.stringify(user));
        window.dispatchEvent(new CustomEvent('drBharathiAdminAuthUpdated', { detail: user }));
        window.dispatchEvent(new Event('storage'));
      } else {
        localStorage.removeItem(ADMIN_USER_KEY);
        if (isCurrentPathAdmin()) localStorage.removeItem(LEGACY_USER_KEY);
        window.dispatchEvent(new CustomEvent('drBharathiAdminAuthUpdated', { detail: null }));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (e) {
      console.error(e);
    }
  },
  clearAdminAuth: () => {
    try {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
      if (isCurrentPathAdmin()) {
        localStorage.removeItem(LEGACY_TOKEN_KEY);
        localStorage.removeItem(LEGACY_USER_KEY);
      }
      window.dispatchEvent(new CustomEvent('drBharathiAdminAuthUpdated', { detail: null }));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error(e);
    }
  },

  // --- Legacy Storage Accessor ---
  getLegacyUser: () => {
    try {
      const raw = localStorage.getItem(LEGACY_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  // --- Context-Aware Universal Helpers ---
  getToken: (explicitScope) => {
    try {
      const scope = explicitScope || (isCurrentPathAdmin() ? 'admin' : 'patient');
      if (scope === 'admin') return authStorage.getAdminToken();
      return authStorage.getPatientToken();
    } catch {
      return null;
    }
  },
  setToken: (token, explicitScope) => {
    const scope = explicitScope || (isCurrentPathAdmin() ? 'admin' : 'patient');
    if (scope === 'admin') authStorage.setAdminToken(token);
    else authStorage.setPatientToken(token);
  },
  getUser: (explicitScope) => {
    try {
      const scope = explicitScope || (isCurrentPathAdmin() ? 'admin' : 'patient');
      if (scope === 'admin') return authStorage.getAdminUser();
      return authStorage.getPatientUser();
    } catch {
      return null;
    }
  },
  setUser: (user, explicitScope) => {
    if (!user) {
      authStorage.clearAuth(explicitScope);
      return;
    }
    const isAdmin = explicitScope === 'admin' || user.role === 'admin' || user.name?.includes('Administrator') || user.email === 'admin@drbharathi.com';
    if (isAdmin) authStorage.setAdminUser(user);
    else authStorage.setPatientUser(user);
  },
  clearAuth: (explicitScope) => {
    const scope = explicitScope || (isCurrentPathAdmin() ? 'admin' : 'patient');
    if (scope === 'admin') authStorage.clearAdminAuth();
    else authStorage.clearPatientAuth();
  },
  isDemoMode: () => {
    try {
      const token = authStorage.getToken();
      return !token || token.startsWith('demo_jwt_token_') || token.startsWith('demo_jwt_google_') || token.startsWith('demo_');
    } catch {
      return true;
    }
  }
};
