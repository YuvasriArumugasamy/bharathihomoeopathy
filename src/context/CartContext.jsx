import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { cartConfig } from '../data/cartConfig';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { demoProducts } from '../data/products';
import { assets } from '../assets';
import { cloudSyncService } from '../services/cloudSyncService';

const CART_STORAGE_KEY = 'drBharathiCart';

// Helper to guarantee valid, live remedy images even across new deployments
const autoHealCartItem = (item) => {
  if (!item) return item;
  const catalog = demoProducts.find(p => 
    p.id === item.id || 
    p._id === item.id ||
    (p.slug && item.slug && p.slug === item.slug) ||
    (p.name && item.name && p.name.trim().toLowerCase() === item.name.trim().toLowerCase())
  );
  let liveImage = catalog?.image;
  if (!liveImage) {
    const name = (item.name || '').toLowerCase();
    if (name.includes('urtica')) liveImage = assets.p1;
    else if (name.includes('cantharis')) liveImage = assets.p2;
    else if (name.includes('arnica')) liveImage = assets.product1 || assets.p3;
    else if (name.includes('calendula')) liveImage = assets.p4;
    else if (name.includes('berberis')) liveImage = assets.p5;
    else if (name.includes('thuja')) liveImage = assets.p6;
    else if (name.includes('rhus')) liveImage = assets.p7;
    else if (name.includes('nux')) liveImage = assets.p8;
    else if (name.includes('belladonna')) liveImage = assets.p9;
    else if (name.includes('echinacea')) liveImage = assets.p10;
    else if (name.includes('ocimum')) liveImage = assets.p11;
  }
  return {
    ...item,
    image: liveImage || item.image || assets.p1
  };
};

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return (Array.isArray(parsed) ? parsed : []).map(autoHealCartItem);
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [shippingSettings, setShippingSettings] = useState(() => {
    try {
      const raw = localStorage.getItem('admin_clinic_settings');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.shipping) {
          return {
            standardFee: Number(parsed.shipping.standardShippingFee ?? 22),
            localStateFee: Number(parsed.shipping.localStateFee ?? parsed.shipping.standardShippingFee ?? 22),
            otherStatesFee: Number(parsed.shipping.otherStatesFee ?? 50),
            internationalFee: Number(parsed.shipping.internationalFee ?? 250),
            freeThreshold: Number(parsed.shipping.freeShippingThreshold ?? 1000)
          };
        }
      }
    } catch {}
    return { standardFee: 22, localStateFee: 22, otherStatesFee: 50, internationalFee: 250, freeThreshold: 1000 };
  });

  const getShippingFeeForLocation = (locationObj = {}) => {
    const state = locationObj.state || 'Tamil Nadu';
    const country = locationObj.country || 'India';
    if (subtotal === 0) return 0;
    if (subtotal >= shippingSettings.freeThreshold) return 0;

    const normalizedCountry = (country || 'India').trim().toLowerCase();
    if (normalizedCountry !== 'india') {
      return shippingSettings.internationalFee;
    }

    const normalizedState = (state || 'Tamil Nadu').trim().toLowerCase();
    if (normalizedState.includes('tamil nadu') || normalizedState.includes('tn')) {
      return shippingSettings.localStateFee;
    }

    return shippingSettings.otherStatesFee;
  };

  useEffect(() => {
    const handleSettingsSync = () => {
      try {
        const raw = localStorage.getItem('admin_clinic_settings');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.shipping) {
            setShippingSettings({
              standardFee: Number(parsed.shipping.standardShippingFee ?? 22),
              localStateFee: Number(parsed.shipping.localStateFee ?? parsed.shipping.standardShippingFee ?? 22),
              otherStatesFee: Number(parsed.shipping.otherStatesFee ?? 50),
              internationalFee: Number(parsed.shipping.internationalFee ?? 250),
              freeThreshold: Number(parsed.shipping.freeShippingThreshold ?? 1000)
            });
          }
        }
      } catch {}
    };

    window.addEventListener('drBharathiSettingsUpdated', handleSettingsSync);
    window.addEventListener('storage', handleSettingsSync);

    // Live Cloud Listener across all devices
    const unsubCloud = cloudSyncService.listenToSettings((cloudSettings) => {
      if (cloudSettings && cloudSettings.shipping) {
        setShippingSettings({
          standardFee: Number(cloudSettings.shipping.standardShippingFee ?? 22),
          localStateFee: Number(cloudSettings.shipping.localStateFee ?? cloudSettings.shipping.standardShippingFee ?? 22),
          otherStatesFee: Number(cloudSettings.shipping.otherStatesFee ?? 50),
          internationalFee: Number(cloudSettings.shipping.internationalFee ?? 250),
          freeThreshold: Number(cloudSettings.shipping.freeShippingThreshold ?? 1000)
        });
      }
    });

    return () => {
      window.removeEventListener('drBharathiSettingsUpdated', handleSettingsSync);
      window.removeEventListener('storage', handleSettingsSync);
      if (typeof unsubCloud === 'function') unsubCloud();
    };
  }, []);

  const safeItems = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(safeItems));
    } catch (e) {
      console.error(e);
    }
  }, [safeItems]);

  // Derived calculations
  const subtotal = useMemo(() => {
    return safeItems.reduce((acc, item) => acc + (Number(item?.price || 0) * Number(item?.quantity || 1)), 0);
  }, [safeItems]);

  const totalItems = useMemo(() => {
    return safeItems.reduce((acc, item) => acc + Number(item?.quantity || 1), 0);
  }, [safeItems]);

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
    return subtotal >= shippingSettings.freeThreshold ? 0 : shippingSettings.standardFee;
  }, [subtotal, shippingSettings]);

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
        const newItem = autoHealCartItem({
          id: product.id || product._id,
          name: product.name,
          sku: product.sku || '',
          category: product.category,
          price: product.salePrice || product.price,
          originalPrice: product.price,
          image: product.image || (product.images && product.images[0]) || '',
          quantity
        });
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
        items: safeItems,
        totalItems,
        subtotal,
        discount,
        shipping,
        tax,
        grandTotal,
        appliedCoupon,
        freeShippingThreshold: shippingSettings.freeThreshold,
        standardShippingFee: shippingSettings.standardFee,
        shippingSettings,
        getShippingFeeForLocation,
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
