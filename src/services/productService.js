import { api } from '../utils/api';
import { demoProducts } from '../data/products';

export const productService = {
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
      if (res && res.data) return res;
    } catch (err) {
      console.warn("Using local product dataset fallback:", err.message);
    }

    // Local fallback filter and pagination
    let filtered = [...demoProducts];

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }

    if (params.category && params.category !== 'All Products' && params.category !== 'all') {
      filtered = filtered.filter(p => p.category === params.category);
    }

    if (params.minPrice) filtered = filtered.filter(p => p.price >= Number(params.minPrice));
    if (params.maxPrice) filtered = filtered.filter(p => p.price <= Number(params.maxPrice));

    if (params.sort) {
      if (params.sort === 'priceLow' || params.sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
      else if (params.sort === 'priceHigh' || params.sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
      else if (params.sort === 'nameAZ' || params.sort === 'name-az') filtered.sort((a, b) => a.name.localeCompare(b.name));
      else if (params.sort === 'nameZA' || params.sort === 'name-za') filtered.sort((a, b) => b.name.localeCompare(a.name));
      else if (params.sort === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 12;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return {
      success: true,
      data: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  },

  getProductById: async (id) => {
    try {
      const res = await api.get(`/products/${id}`);
      if (res && res.data) return res.data;
    } catch (err) {
      console.warn("Product API fallback:", err.message);
    }

    const found = demoProducts.find(p => p.id === id || p.slug === id);
    if (found) return found;
    throw new Error("Product not found");
  },

  getFeaturedProducts: async (limit = 8) => {
    try {
      const res = await api.get(`/products/featured?limit=${limit}`);
      if (res && res.data) return res.data;
    } catch {
      // Fallback
    }
    return demoProducts.filter(p => p.isBestSeller || p.isNew).slice(0, limit);
  },

  getBestSellers: async (limit = 8) => {
    try {
      const res = await api.get(`/products/best-sellers?limit=${limit}`);
      if (res && res.data) return res.data;
    } catch {
      // Fallback
    }
    return demoProducts.filter(p => p.isBestSeller).slice(0, limit);
  }
};
