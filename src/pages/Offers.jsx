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
  const [timeLeft, setTimeLeft] = useState({
    days: '03',
    hours: '14',
    minutes: '25',
    seconds: '45'
  });

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

  const offersByCategory = [
    {
      category: "Homeopathy Medicines",
      badge: "UP TO 20% OFF",
      badgeColor: "bg-brandOrange-500",
      image: assets.p1,
      btnBorder: "border-brandOrange-500 text-brandOrange-600 hover:bg-brandOrange-500 hover:text-white"
    },
    {
      category: "Mother Tinctures",
      badge: "UP TO 15% OFF",
      badgeColor: "bg-emerald-600",
      image: assets.p2,
      btnBorder: "border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white"
    },
    {
      category: "Biochemic Medicines",
      badge: "UP TO 15% OFF",
      badgeColor: "bg-amber-500",
      image: assets.p3,
      btnBorder: "border-amber-500 text-amber-700 hover:bg-amber-500 hover:text-white"
    },
    {
      category: "Personal Care",
      badge: "UP TO 10% OFF",
      badgeColor: "bg-rose-500",
      image: assets.p4,
      btnBorder: "border-rose-500 text-rose-700 hover:bg-rose-500 hover:text-white"
    },
    {
      category: "Combo Offers",
      badge: "SPECIAL COMBO OFFERS",
      badgeColor: "bg-purple-600",
      image: assets.p5,
      btnBorder: "border-purple-600 text-purple-700 hover:bg-purple-600 hover:text-white"
    },
    {
      category: "Health Conditions",
      badge: "UP TO 10% OFF",
      badgeColor: "bg-sky-600",
      image: assets.p6,
      btnBorder: "border-sky-600 text-sky-700 hover:bg-sky-600 hover:text-white"
    }
  ];

  const comboDeals = [
    {
      name: "Immunity Care Combo",
      badge: "20% OFF",
      desc: "Boost your immunity naturally with this powerful combo.",
      price: 699,
      originalPrice: 875,
      image: assets.p7,
      btnColor: "bg-emerald-600 hover:bg-emerald-700"
    },
    {
      name: "Allergy Relief Combo",
      badge: "15% OFF",
      desc: "Relief from allergies, sinusitis & respiratory issues.",
      price: 599,
      originalPrice: 705,
      image: assets.p8,
      btnColor: "bg-brandOrange-500 hover:bg-brandOrange-600"
    },
    {
      name: "Women's Wellness Combo",
      badge: "20% OFF",
      desc: "Care for women's health, hormonal balance & well-being.",
      price: 749,
      originalPrice: 935,
      image: assets.p9,
      btnColor: "bg-rose-500 hover:bg-rose-600"
    },
    {
      name: "Daily Health Combo",
      badge: "15% OFF",
      desc: "Complete family care for everyday health & wellness.",
      price: 799,
      originalPrice: 940,
      image: assets.p10,
      btnColor: "bg-purple-600 hover:bg-purple-700"
    }
  ];

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
          <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl space-y-1 sm:space-y-2.5 flex flex-col items-center text-center">
            <nav className="flex items-center justify-center gap-1.5 text-[9px] sm:text-xs font-bold text-slate-700 bg-white/75 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-amber-200/40">
              <Link to="/" className="hover:text-[#e05a1e] transition-colors">Home</Link>
              <span>&gt;</span>
              <span className="text-[#e05a1e] font-extrabold">Offers</span>
            </nav>

            <h1 className="text-lg sm:text-3xl lg:text-5xl font-black text-navy-950 tracking-tight leading-tight text-center drop-shadow-xs">
              Exclusive <span className="text-[#e05a1e] font-serif italic">Offers</span>
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
          </div>
        </div>
      </section>

      {/* 2. Limited Time Offers Countdown Timer Box */}
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

      {/* 3. Offers by Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <SectionHeader title="Offers by Category" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {offersByCategory.map((item, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 60}>
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col justify-between items-center text-center space-y-3 relative group h-full">
                <span className={`absolute top-2 left-2 ${item.badgeColor} text-white font-extrabold text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm`}>
                  {item.badge}
                </span>

                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 p-2 mt-4 flex items-center justify-center">
                  <img src={item.image} alt={item.category} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                </div>

                <h3 className="font-bold text-xs text-navy-950 leading-tight">
                  {item.category}
                </h3>

                <Link
                  to={`/shop?category=${encodeURIComponent(item.category)}`}
                  className={`w-full py-1.5 px-3 border rounded-lg text-xs font-bold transition-colors ${item.btnBorder}`}
                >
                  Shop Now
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </section>

      {/* 4. Exclusive Combo Deals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <SectionHeader title="Exclusive Combo Deals" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {comboDeals.map((combo, i) => (
            <ScrollReveal key={i} direction={i % 2 === 0 ? "left" : "right"} delay={i * 80}>
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3 flex flex-col justify-between relative group h-full">
                <span className="absolute top-3 right-3 w-10 h-10 rounded-full bg-brandOrange-500 text-white font-black text-[10px] flex items-center justify-center text-center leading-tight shadow-md">
                  {combo.badge}
                </span>

                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 p-3 flex items-center justify-center">
                  <img src={combo.image} alt={combo.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-navy-950">{combo.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{combo.desc}</p>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base font-extrabold text-navy-950">₹{combo.price}.00</span>
                    <span className="text-xs text-slate-400 line-through">₹{combo.originalPrice}.00</span>
                  </div>
                </div>

                <Link
                  to="/shop?category=Combo%20Offers"
                  className={`w-full py-2.5 text-center text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors ${combo.btnColor}`}
                >
                  Shop Combo
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </section>

      {/* 5. Seasonal Offers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <SectionHeader title="Seasonal Offers" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-[#fff7ed] rounded-3xl p-6 sm:p-8 border border-amber-100 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-navy-950">
                Monsoon Care<br />Special Offer
              </h3>
              <p className="text-xs font-bold text-brandOrange-600">Up to 20% OFF</p>
              <p className="text-xs text-slate-600">Stay protected this monsoon with trusted homeopathic care.</p>
            </div>
            <div>
              <Link to="/shop" className="inline-block px-6 py-2 bg-brandOrange-500 hover:bg-brandOrange-600 text-white font-bold text-xs uppercase rounded-lg">
                Shop Now
              </Link>
            </div>
          </div>

          <div className="bg-[#eff6ff] rounded-3xl p-6 sm:p-8 border border-blue-100 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-navy-950">
                Back to Health<br />Special
              </h3>
              <p className="text-xs font-bold text-blue-600">Up to 15% OFF</p>
              <p className="text-xs text-slate-600">Boost your health and energy this season.</p>
            </div>
            <div>
              <Link to="/shop" className="inline-block px-6 py-2 bg-navy-950 hover:bg-slate-900 text-white font-bold text-xs uppercase rounded-lg">
                Shop Now
              </Link>
            </div>
          </div>

          <div className="bg-[#f0fdf4] rounded-3xl p-6 sm:p-8 border border-emerald-100 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-navy-950">
                Summer Wellness<br />Offer
              </h3>
              <p className="text-xs font-bold text-emerald-600">Up to 15% OFF</p>
              <p className="text-xs text-slate-600">Stay cool, stay healthy naturally.</p>
            </div>
            <div>
              <Link to="/shop" className="inline-block px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase rounded-lg">
                Shop Now
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Five Trust Badges Card Strip at Bottom */}
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
