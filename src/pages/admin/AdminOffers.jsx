import React, { useEffect, useState, useRef } from 'react';
import { 
  Tag, Plus, Edit, Trash2, Sparkles, Copy, X, Percent, 
  IndianRupee, Calendar, Check, Gift, Ticket, Flame, ArrowRight,
  Search, ChevronDown
} from 'lucide-react';
import { initialAdminOffers, initialAdminCoupons } from '../../data/adminOffersData';
import { useToast } from '../../context/ToastContext';
import { productService } from '../../services/productService';
import { demoProducts } from '../../data/products';
import { cloudSyncService } from '../../services/cloudSyncService';

const getCouponProductImage = (product) => {
  const catalogueProduct = demoProducts.find((item) =>
    (product?.sku && item.sku === product.sku) ||
    (product?.id && item.id === product.id) ||
    (product?._id && item._id === product._id)
  );
  return catalogueProduct?.image || product?.image || product?.images?.[0] || '';
};

export const AdminOffers = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('coupons');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.getAdminProducts()
      .then((items) => setProducts(Array.isArray(items) ? items : []))
      .catch((error) => console.warn('Could not load products for coupons:', error));
  }, []);
  
  // Timer settings state
  const [timerSettings, setTimerSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_offer_timer_settings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {
      enabled: false,
      endDate: '',
      days: 3,
      hours: 14,
      minutes: 25,
      seconds: 45,
      targetEndTime: null
    };
  });

  // Admin Live Preview Clock State (ticks every second)
  const [adminClock, setAdminClock] = useState({
    days: '03',
    hours: '14',
    minutes: '25',
    seconds: '45',
    isExpired: false
  });

  // Live ticking countdown for Admin Preview
  useEffect(() => {
    let target = Number(timerSettings.targetEndTime);
    if (!target || isNaN(target)) {
      const d = Math.max(0, parseInt(timerSettings.days, 10) || 0);
      const h = Math.max(0, parseInt(timerSettings.hours, 10) || 0);
      const m = Math.max(0, parseInt(timerSettings.minutes, 10) || 0);
      const s = Math.max(0, parseInt(timerSettings.seconds, 10) || 0);
      const dur = ((d * 86400) + (h * 3600) + (m * 60) + s) * 1000;
      target = Date.now() + (dur > 0 ? dur : 3 * 86400 * 1000);
    }

    const tick = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        setAdminClock({ days: '00', hours: '00', minutes: '00', seconds: '00', isExpired: true });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setAdminClock({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
        isExpired: false
      });
    };

    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [timerSettings.targetEndTime, timerSettings.days, timerSettings.hours, timerSettings.minutes, timerSettings.seconds]);

  // Sync with Firestore Cloud settings
  useEffect(() => {
    const unsubTimer = cloudSyncService.listenToOfferTimer((cloudTimer) => {
      if (cloudTimer) {
        setTimerSettings(prev => ({ ...prev, ...cloudTimer }));
        try {
          localStorage.setItem('admin_offer_timer_settings', JSON.stringify(cloudTimer));
        } catch {}
      }
    });

    const unsubCoupons = cloudSyncService.listenToCoupons((cloudCoupons) => {
      if (Array.isArray(cloudCoupons) && cloudCoupons.length > 0) {
        setCoupons(cloudCoupons);
        try {
          localStorage.setItem('admin_coupons_store', JSON.stringify(cloudCoupons));
        } catch {}
      }
    });

    return () => {
      unsubTimer?.();
      unsubCoupons?.();
    };
  }, []);

  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_coupons_store');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(c => !c.id?.includes('demo'));
          if (cleaned.length !== parsed.length) {
            localStorage.setItem('admin_coupons_store', JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [offers, setOffers] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_offers_store');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(o => !o.id?.includes('demo'));
          if (cleaned.length !== parsed.length) {
            localStorage.setItem('admin_offers_store', JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [editingCouponId, setEditingCouponId] = useState(null);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'Percentage',
    discountValue: 10,
    minimumOrderValue: 499,
    maximumDiscount: 200,
    usageLimit: 100,
    offerTitle: '',
    productImage: '',
    productId: '',
    productSku: ''
  });

  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const productDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (productDropdownRef.current && !productDropdownRef.current.contains(e.target)) {
        setProductDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCouponProducts = products.filter((p) => {
    if (!productSearchQuery.trim()) return true;
    const q = productSearchQuery.toLowerCase();
    const nameMatch = (p.name || '').toLowerCase().includes(q);
    const skuMatch = (p.sku || '').toLowerCase().includes(q);
    const catMatch = typeof p.category === 'string' 
      ? p.category.toLowerCase().includes(q) 
      : (p.category?.name || '').toLowerCase().includes(q);
    const brandMatch = (p.brand || '').toLowerCase().includes(q);
    return nameMatch || skuMatch || catMatch || brandMatch;
  });

  const handleSelectCouponProduct = (productId) => {
    if (!productId) {
      setNewCoupon((current) => ({
        ...current,
        productId: '',
        productSku: '',
        offerTitle: '',
        productImage: ''
      }));
      return;
    }

    const product = products.find((item) => String(item.id || item._id) === String(productId) || (item.sku && item.sku === productId));
    const resolvedImage = getCouponProductImage(product);

    setNewCoupon((current) => ({
      ...current,
      productId: String(product?.id || product?._id || productId),
      productSku: product?.sku || '',
      offerTitle: product?.name || current.offerTitle,
      productImage: resolvedImage || product?.image || current.productImage || ''
    }));
  };

  // Automatically sync product image into Product Image URL input whenever product is selected
  useEffect(() => {
    if (newCoupon.productId && !newCoupon.productImage) {
      const prod = products.find(p => String(p.id || p._id) === String(newCoupon.productId) || (p.sku && p.sku === newCoupon.productSku));
      if (prod) {
        const img = getCouponProductImage(prod);
        if (img) {
          setNewCoupon(prev => ({ ...prev, productImage: img }));
        }
      }
    }
  }, [newCoupon.productId, products]);

  const resetCouponForm = () => {
    setNewCoupon({
      code: '', discountType: 'Percentage', discountValue: 10,
      minimumOrderValue: 499, maximumDiscount: 200, usageLimit: 100,
      offerTitle: '', productImage: '', productId: '', productSku: ''
    });
    setProductSearchQuery('');
    setProductDropdownOpen(false);
  };

  // Metrics
  const totalCoupons = coupons.length;
  const isTimerExpired = Boolean(timerSettings?.enabled && adminClock?.isExpired);
  const activeCoupons = isTimerExpired ? 0 : coupons.filter(c => c.status === 'Active').length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);
  const totalCampaigns = offers.length;

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon code ${code} copied to clipboard!`, 'info');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code) return;

    if (editingCouponId) {
      // Edit existing coupon
      const updated = coupons.map(c => 
        c.id === editingCouponId 
          ? { ...c, ...newCoupon, code: newCoupon.code.toUpperCase().trim() }
          : c
      );
      setCoupons(updated);
      try {
        localStorage.setItem('admin_coupons_store', JSON.stringify(updated));
      } catch (err) {
        console.warn("Could not save coupons:", err);
      }
      showToast('Coupon updated successfully!', 'success');
      setEditingCouponId(null);
    } else {
      // Add new coupon
      const added = {
        ...newCoupon,
        id: 'cpn-' + Date.now(),
        code: newCoupon.code.toUpperCase().trim(),
        usedCount: 0,
        status: 'Active',
        createdAt: new Date().toISOString().slice(0, 10)
      };
      const updated = [added, ...coupons];
      setCoupons(updated);
      try {
        localStorage.setItem('admin_coupons_store', JSON.stringify(updated));
      } catch (err) {
        console.warn("Could not save coupons:", err);
      }
      showToast('New coupon code created and activated!', 'success');
    }

    setCouponModalOpen(false);
    resetCouponForm();
  };

  const handleDeleteCoupon = (id) => {
    const updated = coupons.filter(c => c.id !== id);
    setCoupons(updated);
    try {
      localStorage.setItem('admin_coupons_store', JSON.stringify(updated));
    } catch (err) {
      console.warn("Could not save coupons:", err);
    }
    showToast('Coupon code deactivated and removed', 'info');
  };

  const handleSaveTimerSettings = async () => {
    try {
      const days = Math.max(0, parseInt(timerSettings.days, 10) || 0);
      const hours = Math.max(0, parseInt(timerSettings.hours, 10) || 0);
      const minutes = Math.max(0, parseInt(timerSettings.minutes, 10) || 0);
      const seconds = Math.max(0, parseInt(timerSettings.seconds, 10) || 0);
      const totalDurationMs = ((days * 86400) + (hours * 3600) + (minutes * 60) + seconds) * 1000;
      const targetEndTime = Date.now() + (totalDurationMs > 0 ? totalDurationMs : 3 * 86400 * 1000);
      const updated = { ...timerSettings, days, hours, minutes, seconds, targetEndTime, updatedAt: new Date().toISOString() };
      setTimerSettings(updated);
      localStorage.setItem('admin_offer_timer_settings', JSON.stringify(updated));
      await cloudSyncService.syncOfferTimerToCloud(updated);
      showToast('Live Countdown Timer synchronized across website!', 'success');
      return;
    } catch (err) {
      console.warn("Could not save timer settings:", err);
      showToast('Failed to save timer settings', 'error');
    }
  };

  const handleToggleTimer = async (enabled) => {
    let targetEndTime = timerSettings.targetEndTime;
    if (enabled && (!targetEndTime || targetEndTime <= Date.now())) {
      const days = Math.max(0, parseInt(timerSettings.days, 10) || 0);
      const hours = Math.max(0, parseInt(timerSettings.hours, 10) || 0);
      const minutes = Math.max(0, parseInt(timerSettings.minutes, 10) || 0);
      const seconds = Math.max(0, parseInt(timerSettings.seconds, 10) || 0);
      const totalDurationMs = ((days * 86400) + (hours * 3600) + (minutes * 60) + seconds) * 1000;
      targetEndTime = Date.now() + (totalDurationMs > 0 ? totalDurationMs : 3 * 86400 * 1000);
    }
    const updated = { ...timerSettings, enabled, targetEndTime };
    setTimerSettings(updated);
    try {
      localStorage.setItem('admin_offer_timer_settings', JSON.stringify(updated));
      await cloudSyncService.syncOfferTimerToCloud(updated);
      showToast(enabled ? 'Live timer enabled on user website!' : 'Live timer hidden from user website!', 'success');
      return;
    } catch (err) {
      console.warn("Could not save timer settings:", err);
    }
  };

  /*
    try {
      localStorage.setItem('admin_offer_timer_settings', JSON.stringify(timerSettings));
      showToast('Timer settings saved successfully!', 'success');
    } catch (err) {
      console.warn("Could not save timer settings:", err);
      showToast('Failed to save timer settings', 'error');
    }
  };

  const handleToggleTimer = (enabled) => {
    const updated = { ...timerSettings, enabled };
    setTimerSettings(updated);
    try {
      localStorage.setItem('admin_offer_timer_settings', JSON.stringify(updated));
      showToast(enabled ? 'Timer enabled!' : 'Timer disabled!', 'success');
    } catch (err) {
      console.warn("Could not save timer settings:", err);
    }
  */

  return (
    <div className="space-y-8 ">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] p-6 sm:p-8 lg:p-9 rounded-[2.25rem] border border-white/30 shadow-2xl shadow-orange-500/20 text-white mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-amber-300/25 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-5 text-center sm:text-left">
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-wide font-serif italic text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            Offers & Coupons
          </h1>
          <button
            onClick={() => { setEditingCouponId(null); resetCouponForm(); setCouponModalOpen(true); }}
            className="w-full sm:w-auto justify-center relative z-10 inline-flex items-center gap-2.5 px-5 py-3.5 bg-white hover:bg-orange-50 text-orange-600 rounded-2xl text-xs sm:text-sm font-black shadow-xl shadow-black/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-white shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Coupons</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{activeCoupons}</span>
            <span className="text-xs text-emerald-700/80 font-semibold">Live codes</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Redemptions</span>
            <div className="w-9 h-9 rounded-xl bg-brandOrange-50 flex items-center justify-center text-brandOrange-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-brandOrange-600">{totalRedemptions}</span>
            <span className="text-xs text-brandOrange-700/80 font-semibold">Uses</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clinic Campaigns</span>
            <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center text-navy-900">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-navy-950">{totalCampaigns}</span>
            <span className="text-xs text-slate-400 font-semibold">Banners</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Savings</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-sky-600">15%</span>
            <span className="text-xs text-sky-700/80 font-semibold">Discount</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'coupons'
              ? 'bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          <Ticket className={`w-4 h-4 ${activeTab === 'coupons' ? 'text-white' : 'text-brandOrange-400'}`} />
          <span>Coupon Vouchers ({coupons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'offers'
              ? 'bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          <Gift className={`w-4 h-4 ${activeTab === 'offers' ? 'text-white' : 'text-brandOrange-400'}`} />
          <span>Promotional Campaigns ({offers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('timer')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'timer'
              ? 'bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          <Flame className={`w-4 h-4 ${activeTab === 'timer' ? 'text-white' : 'text-rose-400'}`} />
          <span>Timer Settings</span>
        </button>
      </div>

      {/* Coupons List View */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {isTimerExpired && coupons.length > 0 && (
            <div className="col-span-full p-4 sm:p-5 bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border-2 border-rose-200/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/25">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-rose-950 uppercase tracking-wide">
                    Flash Sale Concluded — Vouchers Are Expired
                  </h4>
                  <p className="text-xs text-rose-700 font-medium mt-0.5">
                    Countdown reached 0. These vouchers are automatically hidden on customer website.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setCoupons([]);
                    try {
                      localStorage.setItem('admin_coupons_store', JSON.stringify([]));
                      cloudSyncService.syncCouponsToCloud([]);
                    } catch {}
                    showToast('All expired coupons removed!', 'info');
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Expired Vouchers</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('timer')}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-black rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>Restart Timer</span>
                </button>
              </div>
            </div>
          )}
          {coupons.map((c) => {
            const usagePercent = Math.min(100, Math.round(((c.usedCount || 0) / (c.usageLimit || 100)) * 100));
            const matchingProd = products.find(p => 
              (c.productId && String(p.id || p._id) === String(c.productId)) || 
              (c.productSku && p.sku === c.productSku) ||
              (c.offerTitle && p.name && (c.offerTitle.toLowerCase().includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(c.offerTitle.toLowerCase())))
            );
            const isMismatched = c.offerTitle?.toLowerCase().includes('arnica') && c.productImage?.includes('p1');
            const couponImage = (!isMismatched && c.productImage) || (matchingProd ? getCouponProductImage(matchingProd) : '');
            return (
              <div 
                key={c.id} 
                className="group relative bg-white/95 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-slate-200/90 p-6 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] hover:shadow-xl hover:border-brandOrange-300 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Top Notch & Status */}
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${isTimerExpired ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                      {isTimerExpired ? 'EXPIRED' : c.status}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Created: {c.createdAt}
                    </span>
                  </div>

                  {isTimerExpired && (
                    <div className="flex items-center justify-between p-2.5 bg-rose-50/90 border border-rose-200 rounded-xl text-xs text-rose-800">
                      <span className="flex items-center gap-1.5 font-bold text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>Sale Ended (Timer is 00:00:00)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCoupon(c.id)}
                        className="px-2.5 py-1 bg-white hover:bg-rose-600 hover:text-white text-rose-700 border border-rose-300 rounded-lg text-[10px] font-black shadow-2xs transition-all cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Product Photo Banner */}
                  {couponImage ? (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50/70 to-amber-50/40 rounded-2xl border border-orange-100/90 shadow-2xs">
                      <img 
                        src={couponImage} 
                        alt={c.offerTitle || matchingProd?.name || 'Product'} 
                        className="w-14 h-14 rounded-xl object-contain p-1 bg-white border border-orange-200/80 shadow-xs shrink-0"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-brandOrange-600 uppercase tracking-wider block">
                          Linked Remedy
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 truncate">
                          {c.offerTitle || matchingProd?.name || 'Homeopathy Medicine'}
                        </h4>
                        {(c.productSku || matchingProd?.sku) && (
                          <span className="text-[10px] font-mono text-slate-500 bg-white/80 px-1.5 py-0.5 rounded border border-slate-200 mt-0.5 inline-block">
                            SKU: {c.productSku || matchingProd?.sku}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {/* Code Card Ribbon */}
                  <div className="p-4 bg-gradient-to-r from-slate-50 to-amber-50/40 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Coupon Code</span>
                      <span className="font-mono font-black text-xl text-brandOrange-600 tracking-wider">
                        {c.code}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(c.code)}
                      className="p-2 rounded-xl bg-white text-slate-500 hover:text-brandOrange-600 hover:bg-brandOrange-50 border border-slate-200 shadow-2xs transition-all"
                      title="Copy Code"
                    >
                      {copiedCode === c.code ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Discount Details */}
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center justify-between font-bold text-navy-950">
                      <span>Discount Value:</span>
                      <span className="text-brandOrange-600">
                        {c.discountType === 'Percentage' ? `${c.discountValue}% OFF` : `Flat ₹${c.discountValue} OFF`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>Min Order Required:</span>
                      <span className="font-semibold text-slate-700">₹{c.minimumOrderValue}</span>
                    </div>
                    {c.maximumDiscount && (
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span>Max Cap:</span>
                        <span className="font-semibold text-slate-700">₹{c.maximumDiscount}</span>
                      </div>
                    )}
                  </div>

                  {/* Usage Progress Bar */}
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-500">Usage Limit:</span>
                      <span className="text-navy-900">{c.usedCount} / {c.usageLimit} redeemed</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-brandOrange-500 to-amber-500 rounded-full transition-all duration-500" 
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Valid on Dispensary store</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setNewCoupon({
                          code: c.code,
                          discountType: c.discountType,
                          discountValue: c.discountValue,
                          minimumOrderValue: c.minimumOrderValue,
                          maximumDiscount: c.maximumDiscount,
                          usageLimit: c.usageLimit,
                          offerTitle: c.offerTitle || '',
                          productImage: c.productImage || (c.productId ? getCouponProductImage(products.find(p => String(p.id || p._id) === String(c.productId) || (c.productSku && p.sku === c.productSku))) : ''),
                          productId: c.productId || '',
                          productSku: c.productSku || ''
                        });
                        setEditingCouponId(c.id);
                        setCouponModalOpen(true);
                      }}
                      className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all"
                      title="Edit Coupon"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(c.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      title="Remove Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Offers View */}
      {activeTab === 'offers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {offers.map((off) => (
            <div 
              key={off.id} 
              className="group bg-white/95 backdrop-blur-sm rounded-[2rem] border border-slate-200/90 p-6 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] hover:shadow-xl hover:border-brandOrange-200 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 bg-brandOrange-50 text-brandOrange-600 font-black text-[10px] rounded-full uppercase border border-brandOrange-200">
                    {off.type}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {off.status || 'Active'}
                  </span>
                </div>

                <h4 className="font-heading font-black text-base text-navy-950 group-hover:text-brandOrange-600 transition-colors">
                  {off.name}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {off.description}
                </p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <Calendar className="w-4 h-4 text-brandOrange-500" />
                  <span>Valid: <strong>{off.startDate}</strong> to <strong>{off.endDate}</strong></span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-black bg-emerald-50 px-2.5 py-0.5 rounded-lg">
                  {off.discountBadge || 'Special Promo'}
                </span>
                <span className="text-slate-400 text-[11px]">Applied automatically</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Timer Settings View */}
      {activeTab === 'timer' && (
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Enable/Disable Timer Card */}
          <div className="bg-white rounded-2xl border-2 border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-navy-950 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-rose-500" />
                  Countdown Timer Control
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Show or hide the "Limited Time Offers!" countdown timer on user site
                </p>
              </div>
              <button
                onClick={() => handleToggleTimer(!timerSettings.enabled)}
                className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all ${
                  timerSettings.enabled
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                }`}
              >
                {timerSettings.enabled ? '✅ Enabled' : '❌ Disabled'}
              </button>
            </div>

            {timerSettings.enabled && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <p className="text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Timer is active on user website!
                </p>
              </div>
            )}

            {!timerSettings.enabled && (
              <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-xs text-slate-600 font-semibold">
                  Timer is hidden. Enable to show countdown on offers page.
                </p>
              </div>
            )}
          </div>

          {/* Timer Display Settings */}
          {timerSettings.enabled && (
            <div className="bg-white rounded-2xl border-2 border-slate-200/80 p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-black text-navy-950 mb-1">
                  Timer Display Values
                </h3>
                <p className="text-xs text-slate-500">
                  Set the countdown values shown to users (for display purpose)
                </p>
              </div>

              {/* Timer Values Grid */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Days</label>
                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={timerSettings.days}
                    onChange={(e) => setTimerSettings({...timerSettings, days: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-center font-mono font-black text-lg focus:border-brandOrange-400 focus:ring-0 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Hours</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={timerSettings.hours}
                    onChange={(e) => setTimerSettings({...timerSettings, hours: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-center font-mono font-black text-lg focus:border-brandOrange-400 focus:ring-0 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={timerSettings.minutes}
                    onChange={(e) => setTimerSettings({...timerSettings, minutes: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-center font-mono font-black text-lg focus:border-brandOrange-400 focus:ring-0 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Seconds</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={timerSettings.seconds}
                    onChange={(e) => setTimerSettings({...timerSettings, seconds: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl text-center font-mono font-black text-lg focus:border-brandOrange-400 focus:ring-0 transition-colors"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="p-6 bg-gradient-to-r from-[#236888] via-[#236888] to-[#1a5270] rounded-2xl">
                <p className="text-xs text-amber-300 font-bold mb-3 text-center flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Real-Time Live Countdown (Ticking Live):
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="bg-[#236888] text-white rounded-xl px-4 py-3 min-w-[70px] border-2 border-white/20">
                    <span className="text-2xl font-black font-mono block leading-tight">{adminClock.days}</span>
                    <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">Days</span>
                  </div>
                  <span className="text-2xl font-black text-rose-300">:</span>
                  <div className="bg-[#236888] text-white rounded-xl px-4 py-3 min-w-[70px] border-2 border-white/20">
                    <span className="text-2xl font-black font-mono block leading-tight">{adminClock.hours}</span>
                    <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">Hours</span>
                  </div>
                  <span className="text-2xl font-black text-rose-300">:</span>
                  <div className="bg-[#236888] text-white rounded-xl px-4 py-3 min-w-[70px] border-2 border-white/20">
                    <span className="text-2xl font-black font-mono block leading-tight">{adminClock.minutes}</span>
                    <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">Mins</span>
                  </div>
                  <span className="text-2xl font-black text-rose-300">:</span>
                  <div className="bg-[#236888] text-white rounded-xl px-4 py-3 min-w-[70px] border-2 border-white/20">
                    <span className="text-2xl font-black font-mono text-amber-300 block leading-tight">{adminClock.seconds}</span>
                    <span className="text-[10px] font-black uppercase text-rose-300 tracking-wider">Secs</span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveTimerSettings}
                className="w-full py-3 bg-gradient-to-r from-brandOrange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>🚀 Sync & Start Real-Time Timer on Website</span>
              </button>
            </div>
          )}

          {/* Info Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-xs text-slate-700 space-y-1">
                <p className="font-bold">💡 How Timer Works:</p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  <li>Enable timer to show countdown on user offers page</li>
                  <li>Set display values for days, hours, minutes, seconds</li>
                  <li>Timer shows only when you have active coupons</li>
                  <li>Disable timer to hide it completely from users</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Create Coupon Modal */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.25rem] p-7 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-5 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-brandOrange-500">
                  {editingCouponId ? 'Edit Promo Code' : 'New Promo Code'}
                </span>
                <h3 className="font-heading font-black text-navy-950 text-lg">
                  {editingCouponId ? 'Edit Coupon Voucher' : 'Create Coupon Voucher'}
                </h3>
              </div>
              <button 
                onClick={() => setCouponModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCoupon} className="space-y-4 text-xs">
              <div className="relative" ref={productDropdownRef}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-slate-700">Choose Product</label>
                  {newCoupon.productId && (
                    <button
                      type="button"
                      onClick={() => handleSelectCouponProduct('')}
                      className="text-[11px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3 h-3" /> Clear Selection
                    </button>
                  )}
                </div>

                {/* Dropdown Trigger */}
                <button
                  type="button"
                  onClick={() => setProductDropdownOpen(!productDropdownOpen)}
                  className={`w-full p-3 bg-slate-50/90 border rounded-xl text-left flex items-center justify-between transition-all cursor-pointer ${
                    productDropdownOpen 
                      ? 'border-brandOrange-500 ring-2 ring-brandOrange-500/20 bg-white' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    {(() => {
                      const selectedProduct = products.find((item) => String(item.id || item._id) === newCoupon.productId);
                      return selectedProduct ? (
                        <span className="font-bold text-slate-900 truncate">
                          {selectedProduct.name} {selectedProduct.sku ? `(${selectedProduct.sku})` : ''}
                        </span>
                      ) : (
                        <span className="text-slate-500">
                          Search or select from all products ({products.length})
                        </span>
                      );
                    })()}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${productDropdownOpen ? 'rotate-180 text-brandOrange-500' : ''}`} />
                </button>

                {/* Searchable Floating Menu */}
                {productDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[70] overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col">
                    {/* Search Input Bar */}
                    <div className="p-2.5 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-10">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          autoFocus
                          placeholder="Type product name, brand, or SKU..."
                          value={productSearchQuery}
                          onChange={(e) => setProductSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brandOrange-500 text-slate-800 placeholder:text-slate-400"
                        />
                        {productSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setProductSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center justify-between px-1 pt-1.5 text-[10px] text-slate-400">
                        <span>Showing {filteredCouponProducts.length} of {products.length} products</span>
                        {productSearchQuery && <span className="font-bold text-brandOrange-600">Filtered</span>}
                      </div>
                    </div>

                    {/* Products Scrollable List */}
                    <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs">
                      {filteredCouponProducts.length > 0 ? (
                        filteredCouponProducts.map((product) => {
                          const isSelected = String(product.id || product._id) === newCoupon.productId;
                          const image = getCouponProductImage(product);
                          const price = product.offerPrice || product.salePrice || product.price || product.regularPrice;

                          return (
                            <button
                              key={product.id || product._id || product.sku}
                              type="button"
                              onClick={() => {
                                handleSelectCouponProduct(String(product.id || product._id));
                                setProductDropdownOpen(false);
                                setProductSearchQuery('');
                              }}
                              className={`w-full p-2.5 text-left flex items-center gap-3 transition-colors cursor-pointer ${
                                isSelected ? 'bg-orange-50/80 text-brandOrange-950 font-bold' : 'hover:bg-slate-50 text-slate-800'
                              }`}
                            >
                              {image ? (
                                <img
                                  src={image}
                                  alt={product.name}
                                  className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-100 bg-white"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-orange-100/60 text-brandOrange-600 flex items-center justify-center font-bold text-xs shrink-0">
                                  💊
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <p className="font-bold text-slate-800 truncate text-xs">{product.name}</p>
                                  {price && <span className="text-[11px] font-black text-slate-900 shrink-0">₹{price}</span>}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                                  {product.sku && <span className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-medium">{product.sku}</span>}
                                  {product.category && (
                                    <span className="truncate">
                                      {typeof product.category === 'string' ? product.category : product.category?.name}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-brandOrange-600 shrink-0" />}
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-6 text-center text-slate-400">
                          <p className="text-xs font-medium">No matching products found</p>
                          <p className="text-[10px] text-slate-400 mt-1">Try another keyword or clear search</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Selected Product Preview Card */}
                {newCoupon.productId && (() => {
                  const selectedProduct = products.find((item) => String(item.id || item._id) === newCoupon.productId);
                  const image = getCouponProductImage(selectedProduct);
                  return selectedProduct ? (
                    <div className="mt-2.5 flex items-center gap-3 rounded-xl border border-orange-200/80 bg-orange-50/40 p-2.5 shadow-2xs">
                      {image ? (
                        <img
                          src={image}
                          alt={selectedProduct.name}
                          className="h-11 w-11 rounded-lg object-cover border border-orange-100 shrink-0"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 truncate text-xs">{selectedProduct.name}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-600 mt-0.5">
                          <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">SKU: {selectedProduct.sku || '—'}</span>
                          <span className="font-bold text-brandOrange-700">₹{selectedProduct.offerPrice || selectedProduct.salePrice || selectedProduct.price || selectedProduct.regularPrice || '—'}</span>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MONSOON20"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full p-3 font-mono font-black uppercase bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:border-brandOrange-500 focus:bg-white text-navy-950 tracking-wider text-sm transition-all"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Offer Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cold & Cough Relief Pack"
                  value={newCoupon.offerTitle}
                  onChange={(e) => setNewCoupon({ ...newCoupon, offerTitle: e.target.value })}
                  className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:border-brandOrange-500 focus:bg-white text-navy-950 font-semibold transition-all"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Product Image URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/product-image.jpg"
                  value={newCoupon.productImage || ''}
                  onChange={(e) => setNewCoupon({ ...newCoupon, productImage: e.target.value })}
                  className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:border-brandOrange-500 focus:bg-white text-slate-700 text-xs transition-all"
                />
                <p className="text-[10px] text-slate-400 mt-1">Optional: Add product image to make offer more attractive</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Discount Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                    className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-medium text-slate-800"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    {newCoupon.discountType === 'Percentage' ? 'Discount % *' : 'Amount (₹) *'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                    className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-black text-navy-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Min Order Value (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={newCoupon.minimumOrderValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minimumOrderValue: Number(e.target.value) })}
                    className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Usage Cap (Redemptions)</label>
                  <input
                    type="number"
                    min={1}
                    value={newCoupon.usageLimit}
                    onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: Number(e.target.value) })}
                    className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setCouponModalOpen(false);
                    setEditingCouponId(null);
                    resetCouponForm();
                    setEditingCouponId(null);
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-brandOrange-500 via-orange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white font-black rounded-xl shadow-lg shadow-brandOrange-500/25 transition-all"
                >
                  {editingCouponId ? 'Update Voucher' : 'Create Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
