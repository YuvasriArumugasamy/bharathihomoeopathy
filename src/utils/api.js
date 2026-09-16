import { authStorage } from './authStorage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://bharathihomoeopathy.onrender.com/api';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = authStorage.getToken();

    // Demo tokens are local-only session tokens.
    // Never hit the real backend with them - skip the network call entirely
    // so no red 401 errors appear in the console.
    const isDemoToken = token && (
      token.startsWith('demo_jwt_token_') ||
      token.startsWith('demo_jwt_google_') ||
      token.startsWith('demo_')
    );

    if (isDemoToken) {
      // Throw locally without making any network request
      // Services will catch this and fall back to localStorage
      const demoError = new Error('Demo mode: using local storage');
      demoError.status = 0;
      demoError.isDemoMode = true;
      throw demoError;
    }

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
