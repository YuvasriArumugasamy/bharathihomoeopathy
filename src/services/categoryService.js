import { api } from '../utils/api';
import { initialAdminCategories } from '../data/adminCategoriesData';

const CATEGORIES_STORAGE_KEY = 'admin_categories_store';

const getStoredCategories = () => {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn("Could not read categories from storage:", err.message);
  }
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(initialAdminCategories));
  } catch {
    // Ignore quota error
  }
  return initialAdminCategories;
};

const saveStoredCategories = (categories) => {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch (err) {
    console.warn("Could not save categories to storage:", err.message);
  }
};

export const categoryService = {
  getCategories: async () => {
    try {
      const res = await api.get('/categories');
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        saveStoredCategories(res.data);
        return res.data;
      }
    } catch {
      // Backend offline, use persistent local store
    }
    return getStoredCategories();
  },

  getCategoryBySlug: async (slug) => {
    try {
      const res = await api.get(`/categories/slug/${slug}`);
      if (res && res.data) return res.data;
    } catch {
      // Fallback
    }
    return getStoredCategories().find(c => c.slug === slug);
  },

  // Admin Methods
  getAdminCategories: async () => {
    return categoryService.getCategories();
  },

  createAdminCategory: async (categoryData) => {
    const categories = getStoredCategories();
    const newCategory = {
      ...categoryData,
      id: categoryData.id || ('cat-' + Date.now()),
      createdAt: new Date().toISOString().slice(0, 10),
      productCount: 0
    };
    const updated = [...categories, newCategory];
    saveStoredCategories(updated);

    try {
      await api.post('/categories', categoryData);
    } catch (err) {
      if (!err?.isDemoMode) console.warn("Category saved locally (backend offline):", err.message);
    }

    return { success: true, data: newCategory };
  },

  updateAdminCategory: async (id, categoryData) => {
    const categories = getStoredCategories();
    const updated = categories.map(c => (c.id === id || c._id === id) ? { ...c, ...categoryData } : c);
    saveStoredCategories(updated);

    try {
      await api.put(`/categories/${id}`, categoryData);
    } catch (err) {
      console.warn("Category updated locally (backend offline):", err.message);
    }

    return { success: true, data: categoryData };
  },

  deleteAdminCategory: async (id) => {
    const categories = getStoredCategories();
    const updated = categories.filter(c => c.id !== id && c._id !== id);
    saveStoredCategories(updated);

    try {
      await api.delete(`/categories/${id}`);
    } catch (err) {
      console.warn("Category deleted locally (backend offline):", err.message);
    }

    return { success: true };
  }
};

export default categoryService;
