import { api } from '../utils/api';
import { initialAdminCategories } from '../data/adminCategoriesData';

export const categoryService = {
  getCategories: async () => {
    try {
      const res = await api.get('/categories');
      if (res && res.data) return res.data;
    } catch (err) {
      console.warn("Category API fallback:", err.message);
    }
    return initialAdminCategories;
  },

  getCategoryBySlug: async (slug) => {
    try {
      const res = await api.get(`/categories/slug/${slug}`);
      if (res && res.data) return res.data;
    } catch {
      // fallback
    }
    return initialAdminCategories.find(c => c.slug === slug);
  }
};
