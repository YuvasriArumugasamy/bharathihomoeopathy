import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await productService.getProducts(params);
      if (res && res.data) {
        setProducts(res.data);
        if (res.pagination) setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(initialParams);
  }, []);

  return {
    products,
    pagination,
    loading,
    error,
    fetchProducts
  };
};
