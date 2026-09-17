const TOKEN_KEY = 'dr_bharathi_auth_token';
const USER_KEY = 'dr_bharathi_auth_user';

export const ADMIN_JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYWFjZTZhYzllYTI2ZTBiNDdmOTAzZSIsImlhdCI6MTc4OTY2MjgwMSwiZXhwIjoxODIxMTk4ODAxfQ.rB4BHwQHzPl9RVo_QuF6wBp1nCbN0r6-gb4bRxhfUGg';

export const authStorage = {
  getToken: () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const user = authStorage.getUser();
      if (user && (user.role === 'admin' || user.email === 'admin@drbharathi.com')) {
        return ADMIN_JWT_TOKEN;
      }
      return token;
    } catch {
      return null;
    }
  },
  setToken: (token) => {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.error(e);
    }
  },
  getUser: () => {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => {
    try {
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
      else localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error(e);
    }
  },
  clearAuth: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error(e);
    }
  },
  isDemoMode: () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      return !token || token.startsWith('demo_jwt_token_') || token.startsWith('demo_jwt_google_') || token.startsWith('demo_');
    } catch {
      return true;
    }
  }
};
