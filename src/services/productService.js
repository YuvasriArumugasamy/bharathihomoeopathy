import { api } from '../utils/api';
import { initialAdminProducts } from '../data/adminProductsData';
import { authStorage } from '../utils/authStorage';

const PRODUCTS_STORAGE_KEY = 'admin_products_store';

const getStoredProducts = () => {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Auto-heal if all products were accidentally overwritten with the same name
        const uniqueNames = new Set(parsed.map(p => p.name));
        if (parsed.length > 3 && uniqueNames.size === 1) {
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialAdminProducts));
          return initialAdminProducts;
        }
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to load products from storage:", err.message);
  }
  // Initialize with initial catalogue
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialAdminProducts));
  } catch {
    // Ignore storage quota errors
  }
  return initialAdminProducts;
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
      if (res && res.data && res.data.length > 0) return res;
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
    if (authStorage.isDemoMode()) {
      return getStoredProducts();
    }
    try {
      const res = await api.get('/products/admin/all?limit=1000');
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        saveStoredProducts(res.data);
        return res.data;
      }
    } catch (err) {
      if (!err?.isDemoMode) console.warn("Backend admin products unavailable, loading persistent store:", err.message);
    }
    return getStoredProducts();
  },

  createAdminProduct: async (productData) => {
    const current = getStoredProducts();
    const newProduct = {
      ...productData,
      id: productData.id || ('prod-' + Date.now()),
      createdAt: productData.createdAt || new Date().toISOString().slice(0, 10)
    };

    // Save locally immediately so UI never loses changes
    const updated = [newProduct, ...current];
    saveStoredProducts(updated);

    // Attempt backend sync
    try {
      const res = await api.post('/products', productData);
      if (res && res.data) {
        newProduct._id = res.data._id;
        saveStoredProducts([newProduct, ...current]);
      }
    } catch (err) {
      if (!err?.isDemoMode) console.warn("Product synced to persistent local store (backend offline):", err.message);
    }

    return { success: true, data: newProduct };
  },

  updateAdminProduct: async (id, productData) => {
    if (!id) return { success: false, error: 'Product ID required' };
    const current = getStoredProducts();
    const updated = current.map(p => {
      const isMatch = (p.id && p.id === id) || (p._id && p._id === id);
      return isMatch ? { ...p, ...productData } : p;
    });
    saveStoredProducts(updated);

    // Attempt backend sync
    try {
      await api.put(`/products/${id}`, productData);
    } catch (err) {
      if (!err?.isDemoMode) console.warn("Product updated in persistent local store (backend offline):", err.message);
    }

    return { success: true, data: productData };
  },

  deleteAdminProduct: async (id) => {
    if (!id) return { success: false };
    const current = getStoredProducts();
    const updated = current.filter(p => {
      const isMatch = (p.id && p.id === id) || (p._id && p._id === id);
      return !isMatch;
    });
    saveStoredProducts(updated);

    // Attempt backend sync
    try {
      await api.delete(`/products/${id}`);
    } catch (err) {
      if (!err?.isDemoMode) console.warn("Product deleted in persistent local store (backend offline):", err.message);
    }

    return { success: true };
  },

  resetProducts: () => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialAdminProducts));
    } catch {
      // ignore
    }
    return initialAdminProducts;
  }
};

export default productService;
