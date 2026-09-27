import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Clock, 
  Tag, 
  Percent, 
  Leaf, 
  ShieldCheck, 
  UserCheck, 
  Truck, 
  CreditCard,
  ShoppingBag,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import { demoProducts } from '../data/products';
import { assets } from '../assets';
import { SectionHeader } from '../components/common/SectionHeader';
import { ScrollReveal } from '../components/common/ScrollReveal';
import { cloudSyncService } from '../services/cloudSyncService';

// Real-time calculation helper
const calculateRemaining = (targetEndTime, fallbackSettings) => {
  let target = Number(targetEndTime);
  if (!target || isNaN(target)) {
    const days = parseInt(fallbackSettings?.days, 10) || 0;
    const hours = parseInt(fallbackSettings?.hours, 10) || 0;
    const minutes = parseInt(fallbackSettings?.minutes, 10) || 0;
    const seconds = parseInt(fallbackSettings?.seconds, 10) || 0;
    const dur = ((days * 86400) + (hours * 3600) + (minutes * 60) + seconds) * 1000;
    target = Date.now() + (dur > 0 ? dur : (3 * 86400 + 14 * 3600 + 25 * 60) * 1000);
  }

  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
      isExpired: true,
      target
    };
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  return {
    days: String(d).padStart(2, '0'),
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0'),
    isExpired: false,
    target
  };
};

export const Offers = () => {
  // Load timer settings from admin or storage
  const [timerSettings, setTimerSettings] = useState(() => {
    try {
      const raw = localStorage.getItem('admin_offer_timer_settings');
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      enabled: true,
      days: 3,
      hours: 14,
      minutes: 25,
      seconds: 45,
      targetEndTime: null
    };
  });

  const [timeLeft, setTimeLeft] = useState(() => calculateRemaining(timerSettings?.targetEndTime, timerSettings));

  // Load real offers and coupons from admin
  const [adminOffers, setAdminOffers] = useState([]);
  const [adminCoupons, setAdminCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCoupon = (code) => {
    if (!code) return;
    try {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2200);
    } catch {
      // Fallback
    }
  };

  // 1. Initial Local Storage Load + Firebase Cloud Listeners
  useEffect(() => {
    try {
      const rawOffers = localStorage.getItem('admin_offers_store');
      const rawCoupons = localStorage.getItem('admin_coupons_store');
      const rawTimer = localStorage.getItem('admin_offer_timer_settings');
      
      if (rawOffers) {
        const offers = JSON.parse(rawOffers);
        setAdminOffers(Array.isArray(offers) ? offers : []);
      }
      
      if (rawCoupons) {
        const coupons = JSON.parse(rawCoupons);
        setAdminCoupons(Array.isArray(coupons) ? coupons : []);
      }

      if (rawTimer) {
        const timer = JSON.parse(rawTimer);
        setTimerSettings(prev => ({ ...prev, ...timer }));
      }
    } catch (e) {
      console.warn('Could not load local admin data:', e);
    }

    // Subscribe to Cloud Firestore updates so admin changes reflect instantly
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
        setAdminCoupons(cloudCoupons);
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

  // 2. Real-Time Dynamic Countdown Tick (ticks every second, decrements seconds, minutes, hours, days accurately)
  useEffect(() => {
    let target = Number(timerSettings.targetEndTime);

    // If targetEndTime doesn't exist, calculate one from the duration settings and cache it
    if (!target || isNaN(target)) {
      const days = parseInt(timerSettings.days, 10) || 0;
      const hours = parseInt(timerSettings.hours, 10) || 0;
      const minutes = parseInt(timerSettings.minutes, 10) || 0;
      const seconds = parseInt(timerSettings.seconds, 10) || 0;
      const dur = ((days * 86400) + (hours * 3600) + (minutes * 60) + seconds) * 1000;
      target = Date.now() + (dur > 0 ? dur : (3 * 86400 + 14 * 3600 + 25 * 60) * 1000);
      
      const updated = { ...timerSettings, targetEndTime: target };
      try {
        localStorage.setItem('admin_offer_timer_settings', JSON.stringify(updated));
      } catch {}
    }

    const tick = () => {
      setTimeLeft(calculateRemaining(target, timerSettings));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [timerSettings.targetEndTime, timerSettings.days, timerSettings.hours, timerSettings.minutes, timerSettings.seconds]);

  // When timer reaches 0 (00:00:00:00), the flash sale has ended and promotional product cards must NOT show!
  const isSaleExpired = Boolean(timerSettings?.enabled && timeLeft?.isExpired);
  const hasOffers = !isSaleExpired && (adminOffers.length > 0 || adminCoupons.length > 0);

  return (
    <div className="space-y-12 pb-12 w-full max-w-full overflow-x-hidden">
      
      {/* 1. Offers Hero Banner with 100% Clear Full bg9.png Background Image */}
      <section className="relative overflow-hidden min-h-[220px] sm:min-h-[360px] md:min-h-[420px] lg:min-h-[480px] flex items-center justify-center bg-[#f7f4ee] border-b border-slate-200/60 shadow-xs">
        {/* Crystal Clear Background Image with Full Landscape Visibility */}
        <div className="absolute inset-0 z-0">
          <img
            src={assets.offersBg}
            alt="Dr. Bharathi Exciting Homeopathy Offers"
            className="w-full h-full object-cover object-center"
            style={{ imageRendering: '-webkit-optimize-contrast' }}
          />
        </div>

        {/* Content Box placed in the exact center with proportional typography */}
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full py-3 sm:py-8 lg:py-12 flex justify-center text-center">
          <ScrollReveal direction="up" className="w-full max-w-md sm:max-w-lg lg:max-w-xl space-y-1 sm:space-y-2.5 flex flex-col items-center text-center">
            <nav className="flex items-center justify-center gap-1.5 text-[9px] sm:text-xs font-bold text-slate-700 bg-white/75 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-amber-200/40">
              <Link to="/" className="hover:text-[#e05a1e] transition-colors">Home</Link>
              <span>&gt;</span>
              <span className="text-[#e05a1e] font-extrabold">Offers</span>
            </nav>

            <h1 className="text-lg sm:text-3xl lg:text-5xl font-black text-navy-950 tracking-tight leading-tight text-center drop-shadow-xs">
              Exclusive <span className="text-[#e05a1e] font-serif italic inline-block transition-transform duration-300 hover:scale-110">Offers</span>
            </h1>
            
            <p className="text-[10px] sm:text-sm md:text-base font-bold text-navy-950 text-center leading-tight">
              Better Health, Bigger Savings!
            </p>
            
            <p className="hidden sm:block text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed text-center max-w-sm sm:max-w-md">
              Grab the best deals on trusted homeopathic medicines and care products.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2.5 pt-0.5 sm:pt-1 text-[8px] sm:text-xs font-bold text-navy-950">
              <span className="flex items-center gap-1 bg-white/85 backdrop-blur-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-amber-200/60 shadow-2xs">
                <Tag className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#e05a1e] shrink-0" />
                <span>Best Prices</span>
              </span>
              <span className="flex items-center gap-1 bg-white/85 backdrop-blur-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-amber-200/60 shadow-2xs">
                <Percent className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#e05a1e] shrink-0" />
                <span>Weekly Deals</span>
              </span>
              <span className="flex items-center gap-1 bg-white/85 backdrop-blur-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-amber-200/60 shadow-2xs">
                <ShieldCheck className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#e05a1e] shrink-0" />
                <span>100% Natural</span>
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. Limited Time Offers Countdown Timer Box - Show if admin enabled */}
      {timerSettings?.enabled && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-[0_15px_45px_rgba(15,23,42,0.08)] p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          
          {/* Top Highlight Accent Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-400 to-[#0b344d]" />

          {/* Left Title & Icon */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/25 ring-4 ring-rose-500/10 animate-pulse">
              <Clock className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-0.5">
                <h3 className="font-black text-base sm:text-lg text-slate-900 tracking-tight">
                  Limited Time Offers!
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-white text-[9px] font-black uppercase tracking-wider shadow-xs ${timeLeft.isExpired ? 'bg-slate-500' : 'bg-rose-500 animate-bounce'}`}>
                  {timeLeft.isExpired ? 'SALE ENDED' : 'FLASH SALE'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold">
                {timeLeft.isExpired ? 'Stay tuned! New exclusive remedies arriving soon.' : 'Hurry up! Special discounts end in:'}
              </p>
            </div>
          </div>

          {/* Digital Countdown Clock Display */}
          <div className="flex items-center gap-1 sm:gap-2.5 md:gap-3 text-center w-full justify-center max-w-sm sm:max-w-md lg:w-auto">
            <div className="flex-1 sm:flex-initial min-w-0 sm:min-w-[70px] bg-[#236888] text-white rounded-xl sm:rounded-2xl px-1.5 py-2 sm:px-4 sm:py-2.5 shadow-md shadow-[#236888]/30 border border-white/20">
              <span className="text-lg sm:text-2xl font-black font-mono text-white block leading-tight">{timeLeft.days}</span>
              <span className="text-[8.5px] sm:text-[10px] font-black uppercase text-amber-300 tracking-wider block mt-0.5">Days</span>
            </div>

            <span className="text-base sm:text-2xl font-black text-rose-500 animate-pulse select-none shrink-0 px-0.5">:</span>

            <div className="flex-1 sm:flex-initial min-w-0 sm:min-w-[70px] bg-[#236888] text-white rounded-xl sm:rounded-2xl px-1.5 py-2 sm:px-4 sm:py-2.5 shadow-md shadow-[#236888]/30 border border-white/20">
              <span className="text-lg sm:text-2xl font-black font-mono text-white block leading-tight">{timeLeft.hours}</span>
              <span className="text-[8.5px] sm:text-[10px] font-black uppercase text-amber-300 tracking-wider block mt-0.5">Hours</span>
            </div>

            <span className="text-base sm:text-2xl font-black text-rose-500 animate-pulse select-none shrink-0 px-0.5">:</span>

            <div className="flex-1 sm:flex-initial min-w-0 sm:min-w-[70px] bg-[#236888] text-white rounded-xl sm:rounded-2xl px-1.5 py-2 sm:px-4 sm:py-2.5 shadow-md shadow-[#236888]/30 border border-white/20">
              <span className="text-lg sm:text-2xl font-black font-mono text-white block leading-tight">{timeLeft.minutes}</span>
              <span className="text-[8.5px] sm:text-[10px] font-black uppercase text-amber-300 tracking-wider block mt-0.5">Mins</span>
            </div>

            <span className="text-base sm:text-2xl font-black text-rose-500 animate-pulse select-none shrink-0 px-0.5">:</span>

            <div className="flex-1 sm:flex-initial min-w-0 sm:min-w-[70px] bg-[#236888] text-white rounded-xl sm:rounded-2xl px-1.5 py-2 sm:px-4 sm:py-2.5 shadow-md shadow-[#236888]/30 border border-white/20">
              <span className="text-lg sm:text-2xl font-black font-mono text-amber-300 block leading-tight">{timeLeft.seconds}</span>
              <span className="text-[8.5px] sm:text-[10px] font-black uppercase text-rose-300 tracking-wider block mt-0.5">Secs</span>
            </div>
          </div>

          {/* Action CTA Button */}
          <Link
            to="/shop"
            className="btn-gradient-orange shrink-0 shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform duration-200"
          >
            <i className="fa-solid fa-fire text-sm mr-1.5" />
            <span>Shop All Offers</span>
          </Link>

        </div>
      </section>
      )}

      {/* 3. Admin Coupons Display - Only show coupons created by admin */}
      {hasOffers ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          <SectionHeader title="Active Offers & Coupons" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminCoupons.map((coupon, idx) => {
              const matchingProd = demoProducts.find(p => 
                (coupon.productId && (String(p.id) === String(coupon.productId) || String(p._id) === String(coupon.productId))) ||
                (coupon.productSku && p.sku === coupon.productSku) ||
                (coupon.offerTitle && p.name && (coupon.offerTitle.toLowerCase().includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(coupon.offerTitle.toLowerCase())))
              );
              // If coupon.productImage was mistakenly saved as p1 (Urtica Urens) but the coupon is for Arnica Montana, override with genuine remedy image
              const isMismatched = coupon.offerTitle?.toLowerCase().includes('arnica') && coupon.productImage?.includes('p1');
              const displayImage = (!isMismatched && coupon.productImage?.trim()) || matchingProd?.image || '';

              return (
              <ScrollReveal key={coupon.id || idx} direction="up" delay={idx * 60}>
                <div className="group relative bg-white rounded-[2.5rem] border border-orange-200/90 shadow-[0_12px_35px_-8px_rgba(234,88,12,0.12)] hover:shadow-[0_24px_50px_-10px_rgba(234,88,12,0.22)] transition-all duration-300 overflow-hidden flex flex-col justify-between">
                  {/* Top Floating Luxury Discount Pill */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-brandOrange-500 via-amber-500 to-brandOrange-600 text-white shadow-md shadow-orange-500/25 text-[11px] font-black uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-amber-200" />
                    <span>{coupon.discountType === 'Percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}</span>
                  </div>

                  {/* Top Media & Title Section */}
                  <div className="pt-6 pb-4 px-6 bg-gradient-to-b from-orange-50/70 via-amber-50/30 to-white flex flex-col items-center text-center">
                    {displayImage ? (
                      <div className="h-44 w-full flex items-center justify-center p-2 mb-2">
                        <img 
                          src={displayImage} 
                          alt={coupon.offerTitle || matchingProd?.name || 'Homeopathy Medicine'} 
                          className="max-h-full max-w-[170px] object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] group-hover:scale-108 transition-transform duration-500"
                          loading="lazy"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>
                    ) : (
                      <div className="h-32 flex items-center justify-center mb-2">
                        <div className="w-16 h-16 rounded-2xl bg-orange-100 text-brandOrange-600 flex items-center justify-center text-2xl shadow-inner">
                          🌿
                        </div>
                      </div>
                    )}

                    <span className="text-[10px] font-black tracking-widest uppercase text-brandOrange-600 bg-orange-100/70 px-2.5 py-0.5 rounded-full mb-1">
                      Clinical Remedy Voucher
                    </span>
                    <h3 className="font-heading font-black text-slate-900 text-base leading-snug line-clamp-2 px-2">
                      {coupon.offerTitle || matchingProd?.name || 'Homeopathy Special Remedy'}
                    </h3>
                  </div>

                  {/* Physical Ticket Perforation Divider with Notches */}
                  <div className="relative flex items-center w-full my-0">
                    <div className="w-5 h-5 rounded-full bg-[#f8f5ee] -ml-2.5 shadow-inner border-r border-slate-200" />
                    <div className="flex-1 border-b-2 border-dashed border-slate-200 mx-2" />
                    <div className="w-5 h-5 rounded-full bg-[#f8f5ee] -mr-2.5 shadow-inner border-l border-slate-200" />
                  </div>

                  {/* Bottom Action & Voucher Details */}
                  <div className="p-6 pt-3 space-y-4 flex-1 flex flex-col justify-between">
                    {/* Interactive 1-Click Copy Coupon Code Box */}
                    <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-amber-50/90 rounded-2xl p-3 border-2 border-dashed border-brandOrange-300 flex items-center justify-between gap-3 shadow-2xs">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                          Coupon Code
                        </span>
                        <span className="font-mono font-black text-xl text-brandOrange-600 tracking-wider">
                          {coupon.code}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyCoupon(coupon.code)}
                        className="px-3.5 py-1.5 bg-white hover:bg-brandOrange-500 text-slate-700 hover:text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200 hover:border-brandOrange-500 active:scale-95 shrink-0"
                      >
                        {copiedCode === coupon.code ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-600 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-brandOrange-500" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Features Grid (2 columns) */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-orange-100 text-brandOrange-600 flex items-center justify-center shrink-0">
                          <Tag className="w-3 h-3" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-slate-400 block text-[9px]">Min Order</span>
                          <span className="font-bold text-slate-800 text-[11px]">₹{coupon.minimumOrderValue || 0}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <Percent className="w-3 h-3" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-slate-400 block text-[9px]">Max Savings</span>
                          <span className="font-bold text-slate-800 text-[11px]">₹{coupon.maximumDiscount || 200}</span>
                        </div>
                      </div>
                    </div>

                    {/* Uses indicator */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 font-medium">
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block mr-1" />
                        Verified Active
                      </span>
                      <span>{coupon.usageLimit ? `${coupon.usageLimit - (coupon.usedCount || 0)} uses left` : '100% Valid'}</span>
                    </div>

                    {/* CTA Button */}
                    <Link
                      to="/shop"
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-brandOrange-500 via-orange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
                    >
                      <span>Claim & Shop Remedy</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
          </div>

        </section>
      ) : (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/90 shadow-sm p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 text-brandOrange-600 flex items-center justify-center mx-auto">
              {isSaleExpired ? (
                <Clock className="w-8 h-8 text-rose-500" />
              ) : (
                <Tag className="w-8 h-8 text-brandOrange-600" />
              )}
            </div>
            <h3 className="text-xl font-black text-slate-900">
              {isSaleExpired ? 'Flash Sale Has Ended' : 'No Active Offers Currently'}
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              {isSaleExpired ? 'The countdown has reached zero and all promotional vouchers for this flash sale have expired. Check back soon for upcoming clinical offers!' : "Our admin team hasn't created any offers yet. Check back soon for exciting deals on homeopathic medicines!"}
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brandOrange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Browse All Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Trust Badges - Always show */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-[0_15px_45px_rgba(15,23,42,0.08)] p-3 sm:p-4 lg:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-0 lg:divide-x lg:divide-slate-100">
          
          {/* Badge 1: 100% Natural */}
          <div className="group flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-emerald-50/60 hover:shadow-xs transition-all duration-300 cursor-pointer lg:px-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25 ring-4 ring-emerald-500/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-[13px] text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                100% Natural
              </h4>
              <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                Safe & gentle homeopathic care
              </p>
            </div>
          </div>

          {/* Badge 2: No Side Effects */}
          <div className="group flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-sky-50/60 hover:shadow-xs transition-all duration-300 cursor-pointer lg:px-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#0b344d] to-[#18587c] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0b344d]/25 ring-4 ring-sky-500/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-[13px] text-slate-900 group-hover:text-[#0b344d] transition-colors leading-snug">
                No Side Effects
              </h4>
              <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                Non-toxic & highly effective
              </p>
            </div>
          </div>

          {/* Badge 3: Expert Doctors */}
          <div className="group flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-purple-50/60 hover:shadow-xs transition-all duration-300 cursor-pointer lg:px-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/25 ring-4 ring-purple-500/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-[13px] text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">
                Expert Doctors
              </h4>
              <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                Experienced specialists
              </p>
            </div>
          </div>

          {/* Badge 4: Fast & Safe Delivery */}
          <div className="group flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-amber-50/60 hover:shadow-xs transition-all duration-300 cursor-pointer lg:px-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25 ring-4 ring-amber-500/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-[13px] text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                Fast & Safe Delivery
              </h4>
              <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                On all orders above ₹999
              </p>
            </div>
          </div>

          {/* Badge 5: Secure Payments */}
          <div className="group flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-rose-50/60 hover:shadow-xs transition-all duration-300 cursor-pointer lg:px-4 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/25 ring-4 ring-rose-500/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-[13px] text-slate-900 group-hover:text-rose-600 transition-colors leading-snug">
                Secure Payments
              </h4>
              <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                100% safe & encrypted
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
