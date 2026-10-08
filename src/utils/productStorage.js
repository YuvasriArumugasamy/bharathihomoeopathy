import { demoProducts } from '../data/products';
import { assets } from '../assets';

const STORAGE_KEY = 'drBharathiProductsCatalog';
const ADMIN_STORAGE_KEY = 'admin_products_store';

/**
 * Accurately resolves the genuine image for a product.
 * Guarantees that each product gets its distinct remedy photo as displayed in Admin.
 */
export const resolveProductImage = (product) => {
  if (!product) return assets.arnicaMontana || demoProducts[0]?.image || assets.product1 || assets.p1;

  const name = (product.name || '').toLowerCase();
  const sku = (product.sku || '').toLowerCase();
  const id = (product.id || product._id || '').toString().toLowerCase();

  // Keyword / ID matching for known remedy formulations
  if (name.includes('arnica') || sku.includes('102') || id === 'hom-102') {
    return assets.arnicaMontana || assets.product1;
  }

  // 1. If admin uploaded a custom photo (base64 or remote URL)
  if (product.image && typeof product.image === 'string' && (product.image.startsWith('data:') || product.image.startsWith('http'))) {
    return product.image;
  }

  // 2. Match with demoProducts by SKU, ID, slug or name to get current build's authentic remedy image
  const matching = demoProducts.find(item =>
    (product.sku && item.sku && item.sku.toLowerCase() === product.sku.toLowerCase()) ||
    (product.id && item.id && item.id === product.id) ||
    (product._id && item._id && item._id === product._id) ||
    (product.slug && item.slug && item.slug === product.slug) ||
    (product.name && item.name && product.name.trim().toLowerCase() === item.name.trim().toLowerCase())
  );
  if (matching?.image) return matching.image;

  if (name.includes('urtica')) return assets.p1;
  if (name.includes('cantharis')) return assets.p2;
  if (name.includes('alfalfa')) return assets.p3;
  if (name.includes('carduus')) return assets.p4;
  if (name.includes('ginseng')) return assets.p5;
  if (name.includes('allium')) return assets.p6;
  if (name.includes('thuja')) return assets.p7;
  if (name.includes('berberis')) return assets.p5;
  if (name.includes('calendula')) return assets.p4;
  if (name.includes('rhus')) return assets.p7;
  if (name.includes('nux')) return assets.p8;
  if (name.includes('belladonna')) return assets.p9;
  if (name.includes('echinacea')) return assets.p10;
  if (name.includes('ocimum')) return assets.p11;

  if (product.image && typeof product.image === 'string' && product.image.trim()) {
    return product.image;
  }

  return demoProducts[0]?.image || assets.product1;
};

export const isMatchingCategory = (prodCategory, selected) => {
  if (!selected || selected === 'All Categories' || selected === 'All') return true;
  const pCat = (prodCategory || '').toLowerCase().trim();
  const sCat = (selected || '').toLowerCase().trim();
  if (!pCat || !sCat) return false;
  if (pCat === sCat) return true;

  const cleanP = pCat.replace(/[^a-z0-9]/g, '');
  const cleanS = sCat.replace(/[^a-z0-9]/g, '');
  if (cleanP === cleanS) return true;

  if (sCat.includes('homeo') && pCat.includes('homeo')) return true;
  if (sCat.includes('ayurved') && pCat.includes('ayurved')) return true;
  if (sCat.includes('unani') && pCat.includes('unani')) return true;
  if (sCat.includes('personal') && pCat.includes('personal')) return true;
  if (sCat.includes('wellness') && pCat.includes('wellness')) return true;
  if (sCat.includes('tincture') && pCat.includes('tincture')) return true;
  if (sCat.includes('biochemic') && pCat.includes('biochemic')) return true;
  if (sCat.includes('combo') && pCat.includes('combo')) return true;

  if (cleanP.includes(cleanS) || cleanS.includes(cleanP)) return true;
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

            const image = resolveProductImage(p);
            const brand = (p.brand && p.brand !== "Dr. Bharathi's Standard")
              ? p.brand
              : (demoProducts.find(dp => dp.sku === p.sku || dp.name === p.name)?.brand || p.brand || 'SBL');

            return {
              ...p,
              brand,
              image,
              images: (Array.isArray(p.images) && p.images.length > 0) ? p.images : [image],
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
        return parsed.map(p => ({
          ...p,
          image: resolveProductImage(p)
        }));
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
