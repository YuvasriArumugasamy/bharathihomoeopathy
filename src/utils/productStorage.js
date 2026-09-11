import { demoProducts } from '../data/products';
import { assets } from '../assets';

const STORAGE_KEY = 'drBharathiProductsCatalog';

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
    window.dispatchEvent(new CustomEvent('drBharathiProductsUpdated', { detail: products }));
  } catch (err) {
    console.error('Error saving products to localStorage:', err);
  }
};
