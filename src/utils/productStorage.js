import { demoProducts } from '../data/products';
import { assets } from '../assets';

const STORAGE_KEY = 'drBharathiProductsCatalog';
const ADMIN_STORAGE_KEY = 'admin_products_store';

export const isMatchingCategory = (prodCategory, selected) => {
  if (!selected || selected === 'All Categories' || selected === 'All') return true;
  const pCat = (prodCategory || '').toLowerCase();
  const sCat = selected.toLowerCase();
  if (pCat === sCat) return true;
  if (sCat.includes('homeo') && pCat.includes('homeo')) return true;
  if (sCat.includes('ayurved') && pCat.includes('ayurved')) return true;
  if (sCat.includes('unani') && pCat.includes('unani')) return true;
  if (sCat.includes('personal') && pCat.includes('personal')) return true;
  if (sCat.includes('wellness') && pCat.includes('wellness')) return true;
  return false;
};

export const getStoredProducts = () => {
  try {
    // 1. Primary source: admin_products_store (where Admin edits are stored)
    const adminRaw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (adminRaw) {
      const parsed = JSON.parse(adminRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
          .filter(p => p.status !== 'Draft')
          .map(p => {
            const regularPrice = Number(p.regularPrice ?? p.originalPrice ?? p.price ?? 0);
            const offerPrice = Number(p.offerPrice ?? p.salePrice ?? p.price ?? regularPrice);
            const hasDiscount = regularPrice > offerPrice;
            const discount = hasDiscount && regularPrice > 0
              ? Math.round(((regularPrice - offerPrice) / regularPrice) * 100)
              : (p.discount || 0);

            return {
              ...p,
              price: offerPrice,
              salePrice: offerPrice,
              offerPrice: offerPrice,
              originalPrice: regularPrice,
              regularPrice: regularPrice,
              discount,
              stock: p.stock !== undefined ? Number(p.stock) : 25
            };
          });
      }
    }

    // 2. Fallback: drBharathiProductsCatalog
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading products from localStorage:', err);
  }
  return demoProducts;
};

export const saveStoredProducts = (products) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent('drBharathiProductsUpdated', { detail: products }));
    window.dispatchEvent(new CustomEvent('products_updated', { detail: products }));
  } catch (err) {
    console.error('Error saving products to localStorage:', err);
  }
};
