import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useToast } from './ToastContext';

const WISHLIST_STORAGE_KEY = 'user_wishlist';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { showToast } = useToast();

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const totalWishlist = useMemo(() => wishlist.length, [wishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId || item._id === productId);
  };

  const addToWishlist = (product) => {
    if (!product) return;
    if (isInWishlist(product.id || product._id)) {
      showToast(`"${product.name}" is already in your wishlist!`, 'info');
      return;
    }
    const item = {
      id: product.id || product._id,
      name: product.name,
      price: product.salePrice || product.price,
      originalPrice: product.originalPrice || product.price,
      image: product.image || (product.images && product.images[0]) || '',
      size: product.size || product.category || 'Homeopathy',
      category: product.category,
      stock: product.stock
    };
    setWishlist((prev) => [...prev, item]);
    showToast(`Added "${product.name}" to Wishlist! ❤️`, 'success');
  };

  const removeFromWishlist = (productId) => {
    const item = wishlist.find((i) => i.id === productId || i._id === productId);
    setWishlist((prev) => prev.filter((i) => i.id !== productId && i._id !== productId));
    if (item) {
      showToast(`Removed "${item.name}" from Wishlist`, 'info');
    }
  };

  const toggleWishlist = (product) => {
    if (!product) return;
    const pId = product.id || product._id;
    if (isInWishlist(pId)) {
      removeFromWishlist(pId);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    showToast('Wishlist cleared', 'info');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        totalWishlist,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
