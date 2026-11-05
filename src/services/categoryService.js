import { api } from '../utils/api';
import { initialAdminCategories } from '../data/adminCategoriesData';
import { cloudSyncService } from './cloudSyncService';

const CATEGORIES_STORAGE_KEY = 'admin_categories_store';

const sanitizeCategories = (cats) => {
  if (!Array.isArray(cats) || cats.length === 0) return [];

  // Filter out dummy/test junk categories like "kjds"
  const cleaned = cats.filter(c => {
    if (!c || typeof c !== 'object') return false;
    const name = String(c.name || '').trim().toLowerCase();
    return name && name !== 'kjds' && name !== 'test' && name !== 'demo';
  });

  if (cleaned.length === 0) return [];

  return cleaned.map((c, idx) => {
    const id = c.id || c._id || `cat-${idx + 1}`;
    let image = c.image;
    // Strip unwanted legacy yoga silhouette unsplash link
    if (image && typeof image === 'string' && (image.includes('1544367567-0f2fcb009e0b') || image.includes('1608248597359'))) {
      image = '';
    }
    return {
      ...c,
      id,
      _id: c._id || id,
      image: image || ''
    };
  });
};

export const getStoredCategories = () => {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const sanitized = sanitizeCategories(parsed);
        if (sanitized.length !== parsed.length) {
          localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(sanitized));
          cloudSyncService.syncCategoriesToCloud(sanitized);
        }
        return sanitized;
      }
    }
  } catch (err) {
    console.warn("Could not read categories from storage:", err.message);
  }
  return [];
};

export const saveStoredCategories = (categories) => {
  try {
    const sanitized = sanitizeCategories(categories);
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(sanitized));
    window.dispatchEvent(new CustomEvent('drBharathiCategoriesUpdated', { detail: sanitized }));
    window.dispatchEvent(new Event('storage'));
    cloudSyncService.syncCategoriesToCloud(sanitized);
  } catch (err) {
    console.warn("Could not save categories to storage:", err.message);
  }
};

export const categoryService = {
  getStoredCategories,
  saveStoredCategories,

  getCategories: async () => {
    try {
      const res = await api.get('/categories');
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        const sanitized = sanitizeCategories(res.data);
        saveStoredCategories(sanitized);
        return sanitized;
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
    const generatedId = categoryData.id || ('cat-' + Date.now());
    const newCategory = {
      ...categoryData,
      id: generatedId,
      _id: categoryData._id || generatedId,
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

  updateAdminCategory: async (id, updatedData) => {
    const categories = getStoredCategories();
    const index = categories.findIndex(c => (c.id || c._id) === id);
    if (index === -1) return { success: false, message: 'Category not found' };

    const updatedCat = {
      ...categories[index],
      ...updatedData,
      id,
      _id: updatedData._id || categories[index]._id || id,
      updatedAt: new Date().toISOString().slice(0, 10)
    };
    categories[index] = updatedCat;
    saveStoredCategories(categories);

    try {
      await api.put(`/categories/${id}`, updatedData);
    } catch (err) {
      if (!err?.isDemoMode) console.warn("Category updated locally (backend offline):", err.message);
    }

    return { success: true, data: updatedCat };
  },

  deleteAdminCategory: async (id) => {
    const categories = getStoredCategories();
    const filtered = categories.filter(c => (c.id || c._id) !== id);
    saveStoredCategories(filtered);

    try {
      await api.delete(`/categories/${id}`);
    } catch (err) {
      if (!err?.isDemoMode) console.warn("Category deleted locally (backend offline):", err.message);
    }

    return { success: true };
  }
};
