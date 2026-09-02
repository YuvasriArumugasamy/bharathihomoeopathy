import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { cartConfig } from '../data/cartConfig';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CART_STORAGE_KEY = 'drBharathiCart';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  // Derived calculations
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [items]);

  const totalItems = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === 'Percentage') {
      const rawDiscount = (subtotal * appliedCoupon.discountValue) / 100;
      return appliedCoupon.maximumDiscount ? Math.min(rawDiscount, appliedCoupon.maximumDiscount) : rawDiscount;
    }
    return appliedCoupon.discountValue || 0;
  }, [appliedCoupon, subtotal]);

  const shipping = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= cartConfig.freeShippingThreshold ? 0 : cartConfig.standardShippingFee;
  }, [subtotal]);

  const tax = useMemo(() => {
    if (cartConfig.taxRatePercentage <= 0) return 0;
    return Math.round(((subtotal - discount) * cartConfig.taxRatePercentage) / 100);
  }, [subtotal, discount]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - discount + shipping + tax);
  }, [subtotal, discount, shipping, tax]);

  const addToCart = (product, quantity = 1) => {
    if (!product || quantity <= 0) return;

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(i => i.id === product.id || i._id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        return updated;
      } else {
        const newItem = {
          id: product.id || product._id,
          name: product.name,
          sku: product.sku || '',
          category: product.category,
          price: product.salePrice || product.price,
          originalPrice: product.price,
          image: product.image || (product.images && product.images[0]) || '',
          quantity
        };
        return [...prevItems, newItem];
      }
    });

    showToast(`${product.name} added to cart!`, 'success');
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const removeFromCart = (productId) => {
    const item = items.find(i => i.id === productId);
    setItems(prev => prev.filter(item => item.id !== productId));
    if (item) {
      showToast(`${item.name} removed from cart`, 'info');
    }
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    showToast('Cart cleared', 'info');
  };

  const applyCoupon = (couponCode) => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'HOMECARE10') {
      if (subtotal < 499) {
        showToast('Minimum order amount for HOMECARE10 is ₹499', 'warning');
        return false;
      }
      setAppliedCoupon({
        code: 'HOMECARE10',
        discountType: 'Percentage',
        discountValue: 10,
        maximumDiscount: 200
      });
      showToast('Coupon HOMECARE10 applied: 10% Off!', 'success');
      return true;
    } else if (code === 'WELLNESS20') {
      if (subtotal < 1200) {
        showToast('Minimum order amount for WELLNESS20 is ₹1,200', 'warning');
        return false;
      }
      setAppliedCoupon({
        code: 'WELLNESS20',
        discountType: 'Percentage',
        discountValue: 20,
        maximumDiscount: 500
      });
      showToast('Coupon WELLNESS20 applied: 20% Off!', 'success');
      return true;
    } else {
      showToast('Invalid or expired coupon code', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        discount,
        shipping,
        tax,
        grandTotal,
        appliedCoupon,
        freeShippingThreshold: cartConfig.freeShippingThreshold,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
