import { authStorage } from './authStorage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://bharathihomoeopathy.onrender.com/api';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = authStorage.getToken();

    // Demo tokens (demo_jwt_token_...) are local-only session tokens.
    // Never send them to the real backend – they will always cause 401 errors.
    const isDemoToken = token && (token.startsWith('demo_') || token.startsWith('demo_jwt_'));

    const headers = {
      'Content-Type': 'application/json',
      ...(token && !isDemoToken ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // If backend rejects a real token as invalid/expired, auto-clear it
        // so subsequent requests don't keep retrying with a bad token.
        if (response.status === 401 && !isDemoToken) {
          authStorage.clearAuth();
        }
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
