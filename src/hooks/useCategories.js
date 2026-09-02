import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCats = async () => {
      setLoading(true);
      try {
        const data = await categoryService.getCategories();
        setCategories(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return { categories, loading, error };
};
