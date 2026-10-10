import { initialAdminBrands } from '../data/adminBrandsData';
import { cloudSyncService } from './cloudSyncService';

const BRANDS_STORAGE_KEY = 'admin_brands_store';

const sanitizeBrands = (brands) => {
  if (!Array.isArray(brands)) return [];
  return brands.map((b, idx) => {
    const id = b.id || b._id || `brand-${idx + 1}`;
    return {
      ...b,
      id,
      _id: b._id || id,
      name: (b.name || '').trim(),
      status: b.status || (b.isActive === false ? 'Inactive' : 'Active'),
      description: b.description || '',
      image: b.image || b.logo || ''
    };
  });
};

export const getStoredBrands = () => {
  try {
    const raw = localStorage.getItem(BRANDS_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return sanitizeBrands(parsed);
      }
    }
  } catch (err) {
    console.warn("Could not read brands from storage:", err.message);
  }
  return initialAdminBrands || [];
};

export const saveStoredBrands = (brands) => {
  try {
    const sanitized = sanitizeBrands(brands);
    localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(sanitized));
    window.dispatchEvent(new CustomEvent('drBharathiBrandsUpdated', { detail: sanitized }));
    window.dispatchEvent(new Event('storage'));
    cloudSyncService.syncBrandsToCloud(sanitized);
  } catch (err) {
    console.warn("Could not save brands to storage:", err.message);
  }
};

export const brandService = {
  getBrands: async () => {
    return getStoredBrands();
  },

  getAdminBrands: async () => {
    return getStoredBrands();
  },

  createAdminBrand: async (brandData) => {
    const brands = getStoredBrands();
    const generatedId = brandData.id || ('brand-' + Date.now());
    const newBrand = {
      ...brandData,
      id: generatedId,
      _id: brandData._id || generatedId,
      name: (brandData.name || '').trim(),
      status: brandData.status || 'Active',
      description: brandData.description || '',
      image: brandData.image || brandData.logo || '',
      createdAt: new Date().toISOString().slice(0, 10),
      productCount: 0
    };
    const updated = [...brands, newBrand];
    saveStoredBrands(updated);
    return { success: true, data: newBrand };
  },

  updateAdminBrand: async (id, brandData) => {
    if (!id) return { success: false };
    const brands = getStoredBrands();
    const updated = brands.map(b => {
      const match = (b.id && b.id === id) || (b._id && b._id === id) || (b.slug && b.slug === id) || (b.name && b.name.toLowerCase() === (brandData.name || '').toLowerCase());
      return match ? { ...b, ...brandData, id: b.id || id, _id: b._id || id } : b;
    });
    saveStoredBrands(updated);
    return { success: true, data: brandData };
  },

  deleteAdminBrand: async (id) => {
    if (!id) return { success: false };
    const brands = getStoredBrands();
    const updated = brands.filter(b => {
      const match = (b.id && b.id === id) || (b._id && b._id === id) || (b.slug && b.slug === id);
      return !match;
    });
    saveStoredBrands(updated);
    return { success: true };
  },

  resetToDefaultBrands: () => {
    saveStoredBrands([]);
    return [];
  }
};

export default brandService;
