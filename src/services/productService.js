import { api } from '../utils/api';
import { authStorage } from '../utils/authStorage';
import { isLegacyTestProduct } from '../utils/catalogCleanup';
import { getStoredCategories } from './categoryService';

const PRODUCTS_STORAGE_KEY = 'admin_products_store';

const getStoredProducts = () => {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(product => !isLegacyTestProduct(product));
        if (cleaned.length !== parsed.length) saveStoredProducts(cleaned);
        return cleaned;
      }
    }
  } catch (err) {
    console.warn("Failed to load products from storage:", err.message);
  }
  // Return empty array instead of seed data - admin will create real products
  return [];
};

const saveStoredProducts = (products) => {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    localStorage.setItem('drBharathiProductsCatalog', JSON.stringify(products));
    window.dispatchEvent(new CustomEvent('drBharathiProductsUpdated', { detail: products }));
    window.dispatchEvent(new CustomEvent('products_updated', { detail: products }));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.warn("Failed to persist products to storage:", err.message);
  }
};

export const getCachedAdminProducts = () => getStoredProducts();

const getInventoryStockMap = () => {
  try {
    const raw = localStorage.getItem('admin_inventory_store');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const map = {};
        parsed.forEach(item => {
          if (item.productId) map[item.productId] = Number(item.currentStock);
          if (item.sku) map[item.sku] = Number(item.currentStock);
          if (item.id) map[item.id] = Number(item.currentStock);
        });
        return map;
      }
    }
  } catch {
    // ignore
  }
  return {};
};

const ensureSharedCategory = async (categoryValue) => {
  if (!categoryValue || /^[0-9a-fA-F]{24}$/.test(String(categoryValue))) return;
  const categoryName = String(categoryValue).trim();
  const remote = await api.get('/categories');
  const remoteCategories = Array.isArray(remote?.data) ? remote.data : [];
  const alreadySaved = remoteCategories.some(category =>
    String(category.name || '').trim().toLowerCase() === categoryName.toLowerCase() ||
    String(category.slug || '').trim().toLowerCase() === categoryName.toLowerCase()
  );
  if (alreadySaved) return;

  const localCategory = getStoredCategories().find(category =>
    String(category.name || '').trim().toLowerCase() === categoryName.toLowerCase() ||
    String(category.slug || '').trim().toLowerCase() === categoryName.toLowerCase()
  );
  const categoryPayload = localCategory || {
    name: categoryName,
    slug: categoryName.toLowerCase().replace(/[\s\W-]+/g, '-'),
    description: '',
    image: ''
  };
  const created = await api.post('/categories', categoryPayload);
  if (!created?.success || !created?.data?._id) {
    throw new Error(created?.message || `Category "${categoryName}" could not be saved to the shared catalog.`);
  }
};

export const productService = {
  // Public customer catalogue with live storage fallback
  getProducts: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.category && params.category !== 'All Products') queryParams.append('category', params.category);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.minPrice) queryParams.append('minPrice', params.minPrice);
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);

      const res = await api.get(`/products?${queryParams.toString()}`);
      if (res?.success && Array.isArray(res.data)) {
        // The API is the shared catalog. Do not replace a successful empty
        // response with potentially stale browser-local products.
        const cleaned = res.data
          .filter(product => !isLegacyTestProduct(product))
          .map(product => {
            const regularPrice = Number(product.price ?? product.regularPrice ?? 0);
            const offerPrice = Number(product.effectivePrice ?? product.salePrice ?? product.offerPrice ?? regularPrice);
            const image = product.image || product.images?.[0] || '';
            return {
              ...product,
              id: String(product._id || product.id),
              category: typeof product.category === 'object'
                ? (product.category?.name || '')
                : (product.category || ''),
              image,
              regularPrice,
              originalPrice: regularPrice,
              offerPrice,
              salePrice: offerPrice,
              price: offerPrice,
              status: product.isActive === false ? 'Inactive' : 'Active',
              stock: Number(product.stock ?? 0)
            };
          });
        return { ...res, data: cleaned };
      }
    } catch (err) {
      // Backend unavailable, seamless local storage fallback
    }

    let products = getStoredProducts().filter(p => p.status === 'Active');

    if (params.search) {
      const q = params.search.toLowerCase();
      products = products.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }

    if (params.category && params.category !== 'All Products' && params.category !== 'all') {
      products = products.filter(p => p.category === params.category);
    }

    if (params.minPrice) products = products.filter(p => (p.offerPrice || p.regularPrice) >= Number(params.minPrice));
    if (params.maxPrice) products = products.filter(p => (p.offerPrice || p.regularPrice) <= Number(params.maxPrice));

    if (params.sort) {
      if (params.sort === 'priceLow' || params.sort === 'price-low') products.sort((a, b) => (a.offerPrice || a.regularPrice) - (b.offerPrice || b.regularPrice));
      else if (params.sort === 'priceHigh' || params.sort === 'price-high') products.sort((a, b) => (b.offerPrice || b.regularPrice) - (a.offerPrice || a.regularPrice));
      else if (params.sort === 'nameAZ' || params.sort === 'name-az') products.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      else if (params.sort === 'nameZA' || params.sort === 'name-za') products.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    }

    // Normalizing price & live inventory stock fields for store components
    const stockMap = getInventoryStockMap();
    const mapped = products.map(p => {
      const liveStock = stockMap[p.id] !== undefined 
        ? stockMap[p.id] 
        : (stockMap[p.sku] !== undefined ? stockMap[p.sku] : (p.stock !== undefined ? p.stock : 10));
      return {
        ...p,
        stock: liveStock,
        price: p.offerPrice || p.regularPrice,
        originalPrice: p.regularPrice,
        salePrice: p.offerPrice
      };
    });

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 12;
    const total = mapped.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = mapped.slice((page - 1) * limit, page * limit);

    return {
      success: true,
      data: paginated,
      pagination: { page, limit, total, totalPages }
    };
  },

  getProductById: async (id) => {
    try {
      const res = await api.get(`/products/${id}`);
      if (res && res.data) return res.data;
    } catch {
      // Fallback
    }

    const found = getStoredProducts().find(p => p.id === id || p.slug === id || p._id === id);
    if (found) {
      const stockMap = getInventoryStockMap();
      const liveStock = stockMap[found.id] !== undefined 
        ? stockMap[found.id] 
        : (stockMap[found.sku] !== undefined ? stockMap[found.sku] : (found.stock !== undefined ? found.stock : 10));
      return {
        ...found,
        stock: liveStock,
        price: found.offerPrice || found.regularPrice,
        originalPrice: found.regularPrice,
        salePrice: found.offerPrice
      };
    }
    throw new Error("Product not found");
  },

  getFeaturedProducts: async (limit = 8) => {
    try {
      const res = await api.get(`/products/featured?limit=${limit}`);
      if (res && res.data && res.data.length > 0) return res.data;
    } catch {
      // Fallback
    }
    const stockMap = getInventoryStockMap();
    return getStoredProducts()
      .filter(p => p.isFeatured || p.isBestSeller)
      .slice(0, limit)
      .map(p => ({
        ...p,
        stock: stockMap[p.id] !== undefined ? stockMap[p.id] : (p.stock !== undefined ? p.stock : 10),
        price: p.offerPrice || p.regularPrice,
        originalPrice: p.regularPrice,
        salePrice: p.offerPrice
      }));
  },

  getBestSellers: async (limit = 8) => {
    try {
      const res = await api.get(`/products/bestsellers?limit=${limit}`);
      if (res && res.data && res.data.length > 0) return res.data;
    } catch {
      // Fallback
    }
    const stockMap = getInventoryStockMap();
    return getStoredProducts()
      .filter(p => p.isBestSeller)
      .slice(0, limit)
      .map(p => ({
        ...p,
        stock: stockMap[p.id] !== undefined ? stockMap[p.id] : (p.stock !== undefined ? p.stock : 10),
        price: p.offerPrice || p.regularPrice,
        originalPrice: p.regularPrice,
        salePrice: p.offerPrice
      }));
  },

  // ----------------------------------------------------
  // ADMIN PORTAL CRUD OPERATIONS
  // ----------------------------------------------------
  getAdminProducts: async () => {
    const localProducts = getStoredProducts();
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin')) {
      return localProducts;
    }
    if (authStorage.isDemoMode()) {
      return localProducts;
    }
    try {
      const res = await api.get('/products/admin/all?limit=1000');
      if (res && Array.isArray(res.data)) {
        const cleaned = res.data.filter(product => !isLegacyTestProduct(product));
        saveStoredProducts(cleaned);
        return cleaned.length > 0 || localProducts.length === 0 ? cleaned : localProducts;
      }
    } catch {
      // Backend offline or sleeping, silently use persistent local store
    }
    return getStoredProducts();
  },

  createAdminProduct: async (productData) => {
    if (isLegacyTestProduct(productData)) {
      throw new Error('Test and demo products cannot be added to the catalog.');
    }
    const current = getStoredProducts();
    await ensureSharedCategory(productData.category);
    const res = await api.post('/products', productData);
    if (!res?.success || !res?.data?._id) {
      throw new Error(res?.message || 'The product was not saved to the shared catalog.');
    }

    const newProduct = {
      ...res.data,
      ...productData,
      _id: String(res.data._id),
      id: String(res.data._id),
      category: productData.category,
      regularPrice: Number(res.data.price ?? productData.regularPrice),
      offerPrice: Number(res.data.salePrice ?? productData.offerPrice ?? productData.regularPrice),
      stock: Number(res.data.stock ?? productData.stock),
      status: res.data.isActive === false ? 'Inactive' : 'Active',
      createdAt: res.data.createdAt || productData.createdAt || new Date().toISOString().slice(0, 10)
    };
    saveStoredProducts([newProduct, ...current.filter(p => p.sku !== newProduct.sku)]);
    return { success: true, data: newProduct };
  },

  updateAdminProduct: async (id, productData) => {
    if (!id) return { success: false, error: 'Product ID required' };
    const current = getStoredProducts();
    const localProduct = current.find(p => (p.id && p.id === id) || (p._id && p._id === id));
    const backendId = /^[0-9a-fA-F]{24}$/.test(id) ? id : (localProduct?.sku || productData.sku || localProduct?.slug || productData.slug);
    await ensureSharedCategory(productData.category);
    let res;
    try {
      res = await api.put(`/products/${encodeURIComponent(backendId)}`, productData);
    } catch (err) {
      // A browser-only legacy row has no Mongo record yet. Publish it once by SKU.
      if (err?.status !== 404) throw err;
      res = await api.post('/products', productData);
    }
    if (!res?.success || !res?.data?._id) throw new Error(res?.message || 'The product update was not saved to the shared catalog.');

    const persisted = {
      ...localProduct,
      ...productData,
      ...res.data,
      id: String(res.data._id),
      _id: String(res.data._id),
      category: productData.category,
      regularPrice: Number(res.data.price ?? productData.regularPrice),
      offerPrice: Number(res.data.salePrice ?? productData.offerPrice ?? productData.regularPrice),
      status: res.data.isActive === false ? 'Inactive' : 'Active'
    };
    saveStoredProducts(current.map(p =>
      (p.id && p.id === id) || (p._id && p._id === id) || (p.sku && p.sku === persisted.sku)
        ? persisted
        : p
    ));
    return { success: true, data: persisted };
  },

  deleteAdminProduct: async (id) => {
    if (!id) return { success: false };
    const current = getStoredProducts();
    const target = current.find(p => (p.id && p.id === id) || (p._id && p._id === id));
    const backendId = /^[0-9a-fA-F]{24}$/.test(id) ? id : (target?.sku || target?.slug || id);
    await api.delete(`/products/${encodeURIComponent(backendId)}`);
    const updated = current.filter(p => p !== target);
    saveStoredProducts(updated);
    return { success: true };
  },

  resetProducts: () => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify([]));
    } catch {
      // ignore
    }
    return [];
  }
};

export default productService;
