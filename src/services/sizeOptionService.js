import { api } from '../utils/api';

export const sizeOptionService = {
  async getAdminSizes() {
    const response = await api.get('/sizes/admin/all');
    return Array.isArray(response?.data) ? response.data : [];
  },

  async createSize(name) {
    const response = await api.post('/sizes', { name });
    if (!response?.success || !response?.data) {
      throw new Error(response?.message || 'Could not save this size.');
    }
    return response.data;
  },

  async updateSize(id, name) {
    const response = await api.put(`/sizes/${encodeURIComponent(id)}`, { name });
    if (!response?.success || !response?.data) {
      throw new Error(response?.message || 'Could not update this size.');
    }
    return response.data;
  },

  async deleteSize(id) {
    const response = await api.delete(`/sizes/${encodeURIComponent(id)}`);
    if (!response?.success) throw new Error(response?.message || 'Could not delete this size.');
    return response;
  }
};
