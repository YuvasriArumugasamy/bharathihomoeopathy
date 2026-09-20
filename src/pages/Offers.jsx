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
  ArrowRight
} from 'lucide-react';
import { demoProducts } from '../data/products';
import { assets } from '../assets';
import { SectionHeader } from '../components/common/SectionHeader';
import { ScrollReveal } from '../components/common/ScrollReveal';

export const Offers = () => {
  // Load timer settings from admin
  const [timerSettings, setTimerSettings] = useState({
    enabled: false,
    days: 3,
    hours: 14,
    minutes: 25,
    seconds: 45
  });

  const [timeLeft, setTimeLeft] = useState({
    days: '03',
    hours: '14',
    minutes: '25',
    seconds: '45'
  });

  // Load real offers and coupons from admin
  const [adminOffers, setAdminOffers] = useState([]);
  const [adminCoupons, setAdminCoupons] = useState([]);

  useEffect(() => {
    // Load admin offers, coupons AND timer settings
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
        setTimerSettings(timer);
        // Set initial timer display from admin settings
        if (timer.enabled) {
          setTimeLeft({
            days: String(timer.days).padStart(2, '0'),
            hours: String(timer.hours).padStart(2, '0'),
            minutes: String(timer.minutes).padStart(2, '0'),
            seconds: String(timer.seconds).padStart(2, '0')
          });
        }
      }
    } catch (e) {
      console.warn('Could not load admin data:', e);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const sec = parseInt(timeLeft.seconds, 10);
      if (sec > 0) {
        setTimeLeft(prev => ({ ...prev, seconds: String(sec - 1).padStart(2, '0') }));
      } else {
        setTimeLeft(prev => ({ ...prev, seconds: '59' }));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft.seconds]);

  // Show admin offers or fallback message
  const hasOffers = adminOffers.length > 0 || adminCoupons.length > 0;

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

      {/* 2. Limited Time Offers Countdown Timer Box - Only show if admin enabled AND offers exist */}
      {hasOffers && timerSettings.enabled && (
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
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider shadow-xs animate-bounce">
                  FLASH SALE
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold">
                Hurry up! Special discounts end in:
              </p>
            </div>
          </div>

          {/* Digital Countdown Clock Display */}
          <div className="flex items-center gap-2 sm:gap-3 text-center w-full justify-center lg:w-auto">
            <div className="bg-[#236888] text-white rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 min-w-[62px] sm:min-w-[72px] shadow-md shadow-[#236888]/30 border border-white/20">
              <span className="text-xl sm:text-2xl font-black font-mono text-white block leading-tight">{timeLeft.days}</span>
              <span className="text-[9px] sm:text-[10px] font-black uppercase text-amber-300 tracking-wider">Days</span>
            </div>

            <span className="text-lg sm:text-2xl font-black text-rose-500 animate-pulse">:</span>

            <div className="bg-[#236888] text-white rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 min-w-[62px] sm:min-w-[72px] shadow-md shadow-[#236888]/30 border border-white/20">
              <span className="text-xl sm:text-2xl font-black font-mono text-white block leading-tight">{timeLeft.hours}</span>
              <span className="text-[9px] sm:text-[10px] font-black uppercase text-amber-300 tracking-wider">Hours</span>
            </div>

            <span className="text-lg sm:text-2xl font-black text-rose-500 animate-pulse">:</span>

            <div className="bg-[#236888] text-white rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 min-w-[62px] sm:min-w-[72px] shadow-md shadow-[#236888]/30 border border-white/20">
              <span className="text-xl sm:text-2xl font-black font-mono text-white block leading-tight">{timeLeft.minutes}</span>
              <span className="text-[9px] sm:text-[10px] font-black uppercase text-amber-300 tracking-wider">Mins</span>
            </div>

            <span className="text-lg sm:text-2xl font-black text-rose-500 animate-pulse">:</span>

            <div className="bg-[#236888] text-white rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 min-w-[62px] sm:min-w-[72px] shadow-md shadow-[#236888]/30 border border-white/20">
              <span className="text-xl sm:text-2xl font-black font-mono text-amber-300 block leading-tight">{timeLeft.seconds}</span>
              <span className="text-[9px] sm:text-[10px] font-black uppercase text-rose-300 tracking-wider">Secs</span>
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
            {adminCoupons.map((coupon, idx) => (
              <ScrollReveal key={coupon.id || idx} direction="up" delay={idx * 60}>
                <div className="bg-white rounded-2xl border-2 border-dashed border-brandOrange-300 p-6 shadow-sm hover:shadow-lg transition-all relative group overflow-hidden">
                  {/* Discount Badge */}
                  <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-gradient-to-br from-brandOrange-500 to-amber-500 text-white flex items-center justify-center text-center shadow-lg z-10">
                    <div>
                      <span className="text-lg font-black block leading-none">
                        {coupon.discountType === 'Percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                      </span>
                      <span className="text-[8px] font-bold uppercase">OFF</span>
                    </div>
                  </div>

                  {/* Product Image - if provided */}
                  {coupon.productImage && coupon.productImage.trim() && (
                    <div className="mb-4 -mx-6 -mt-6 bg-gradient-to-br from-slate-50 to-amber-50/30 rounded-t-2xl overflow-hidden relative" style={{ height: '160px' }}>
                      <img 
                        src={coupon.productImage} 
                        alt={coupon.offerTitle || 'Product'} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Offer Title - if provided */}
                  {coupon.offerTitle && (
                    <h3 className="text-base font-black text-navy-950 mb-3 leading-tight">
                      {coupon.offerTitle}
                    </h3>
                  )}

                  {/* Coupon Code - Large and Clear */}
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Coupon Code
                    </span>
                    <div className="inline-block px-4 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-dashed border-brandOrange-400 rounded-xl">
                      <span className="text-2xl font-black text-brandOrange-600 font-mono tracking-widest">
                        {coupon.code}
                      </span>
                    </div>
                  </div>

                  {/* Offer Description - Clear and Bold */}
                  <div className="mb-4 p-3 bg-gradient-to-br from-slate-50 to-amber-50/30 rounded-xl border border-slate-100">
                    <p className="text-sm text-navy-950 font-bold leading-relaxed">
                      {coupon.discountType === 'Percentage' 
                        ? `Get ${coupon.discountValue}% discount on your purchase!` 
                        : `Get flat ₹${coupon.discountValue} off on your order!`}
                    </p>
                  </div>

                  {/* Details - Clear Requirements */}
                  <div className="space-y-2 mb-4 text-xs">
                    {coupon.minimumOrderValue > 0 && (
                      <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg">
                        <div className="w-7 h-7 rounded-lg bg-brandOrange-50 flex items-center justify-center shrink-0">
                          <Tag className="w-3.5 h-3.5 text-brandOrange-600" />
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold">Minimum Order:</span>
                          <span className="text-navy-950 font-black ml-1.5">₹{coupon.minimumOrderValue}</span>
                        </div>
                      </div>
                    )}
                    {coupon.maximumDiscount && coupon.discountType === 'Percentage' && (
                      <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                          <Percent className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div>
                          <span className="text-slate-500 font-semibold">Max Savings:</span>
                          <span className="text-navy-950 font-black ml-1.5">₹{coupon.maximumDiscount}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg">
                      <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-3.5 h-3.5 text-sky-600" />
                      </div>
                      <div>
                        <span className="text-emerald-600 font-black text-xs">
                          {coupon.usageLimit - (coupon.usedCount || 0)} uses remaining
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link
                    to="/shop"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-brandOrange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all group"
                  >
                    <span>Shop Now & Save</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>

        </section>
      ) : (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/90 shadow-sm p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 text-brandOrange-600 flex items-center justify-center mx-auto">
              <Tag className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              No Active Offers Currently
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Our admin team hasn't created any offers yet. Check back soon for exciting deals on homeopathic medicines!
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
