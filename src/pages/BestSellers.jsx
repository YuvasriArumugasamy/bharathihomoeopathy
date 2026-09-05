import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  ShieldCheck, 
  UserCheck, 
  Truck, 
  CreditCard, 
  Award, 
  CheckCircle2, 
  Smile, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { demoProducts } from '../data/products';
import { ProductCard } from '../components/shop/ProductCard';
import { SectionHeader } from '../components/common/SectionHeader';
import { ScrollReveal } from '../components/common/ScrollReveal';
import { assets } from '../assets';

export const BestSellers = () => {
  const [sortBy, setSortBy] = useState('Best Selling');
  const bestSellers = demoProducts;

  return (
    <div className="space-y-12 pb-12 w-full max-w-full overflow-x-hidden">
      
      {/* 1. Best Sellers Hero Banner with 100% Clear bg7.png Background Image */}
      <section className="relative overflow-hidden min-h-[220px] sm:min-h-[360px] md:min-h-[420px] lg:min-h-[480px] flex items-center bg-[#f2f7f2] border-b border-slate-200/60 shadow-xs">
        {/* Crystal Clear Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={assets.bestSellersBg}
            alt="Dr. Bharathi Top Best Selling Remedies"
            className="w-full h-full object-cover object-center"
            style={{ imageRendering: '-webkit-optimize-contrast' }}
          />
        </div>

        {/* Content Box placed cleanly on the left clear space without overlapping bottles */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-4 sm:py-10 lg:py-14 flex justify-start">
          <ScrollReveal direction="left" className="w-[56%] sm:w-full max-w-sm sm:max-w-lg lg:max-w-xl space-y-1 sm:space-y-2.5">
            <nav className="flex items-center gap-1.5 text-[9px] sm:text-xs font-bold text-slate-700 bg-white/70 backdrop-blur-xs px-2.5 py-0.5 rounded-full w-fit border border-emerald-200/40">
              <Link to="/" className="hover:text-[#e05a1e] transition-colors">Home</Link>
              <span>&gt;</span>
              <span className="text-[#e05a1e] font-extrabold">Best Sellers</span>
            </nav>

            <h1 className="text-lg sm:text-3xl lg:text-5xl font-black text-navy-950 tracking-tight leading-tight drop-shadow-xs">
              Best <span className="text-[#e05a1e] font-serif italic">Sellers</span>
            </h1>
            
            <p className="text-[10px] sm:text-xs md:text-sm text-slate-700 font-semibold leading-tight sm:leading-relaxed">
              Explore our most loved homeopathic remedies chosen by thousands of happy patients.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. Five Trust Badges Card Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <ScrollReveal direction="up">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-navy-950">100% Natural</h4>
                <p className="text-[10px] text-slate-500 leading-tight">Safe & gentle homeopathic care</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-navy-950">No Side Effects</h4>
                <p className="text-[10px] text-slate-500 leading-tight">Non-toxic & highly effective</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-navy-950">Expert Doctors</h4>
                <p className="text-[10px] text-slate-500 leading-tight">Experienced & caring professionals</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-navy-950">Fast & Safe Delivery</h4>
                <p className="text-[10px] text-slate-500 leading-tight">On all orders above ₹999</p>
              </div>
            </div>

            <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-navy-950">Secure Payments</h4>
                <p className="text-[10px] text-slate-500 leading-tight">100% safe & secure checkout</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. Our Top Best Sellers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-100">
          <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950 tracking-tight">
            Our Top <span className="text-brandOrange-500">Best Sellers</span>
          </h2>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-500">Showing 1–12 of 24 products</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
              >
                <option value="Best Selling">Best Selling</option>
                <option value="PriceLow">Price: Low to High</option>
                <option value="PriceHigh">Price: High to Low</option>
                <option value="Rating">Average Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* 12 Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {bestSellers.map((prod, idx) => (
            <ScrollReveal key={prod.id} direction="up" delay={(idx % 5) * 50}>
              <ProductCard product={prod} />
            </ScrollReveal>
          ))}
        </div>

      </section>

      {/* 4. Why Customers Choose Us? 4 Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-4 flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shadow shrink-0">
              <img
                src={assets.bharathi}
                alt="Dr. Bharathi"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-navy-950 leading-tight">
                Why Customers<br />Choose Us?
              </h3>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-brandOrange-50 text-brandOrange-600 flex items-center justify-center mb-1 mx-auto sm:mx-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-xs text-navy-950">Trusted Products</h4>
              <p className="text-[10px] text-slate-500">Carefully selected quality products</p>
            </div>

            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-brandOrange-50 text-brandOrange-600 flex items-center justify-center mb-1 mx-auto sm:mx-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-xs text-navy-950">Proven Results</h4>
              <p className="text-[10px] text-slate-500">Effective remedies with time tested results</p>
            </div>

            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-brandOrange-50 text-brandOrange-600 flex items-center justify-center mb-1 mx-auto sm:mx-0">
                <Smile className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-xs text-navy-950">Happy Customers</h4>
              <p className="text-[10px] text-slate-500">Thousands of satisfied customers trust us</p>
            </div>

            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-brandOrange-50 text-brandOrange-600 flex items-center justify-center mb-1 mx-auto sm:mx-0">
                <Leaf className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-xs text-navy-950">Safe & Natural</h4>
              <p className="text-[10px] text-slate-500">100% natural, safe and gentle care</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
