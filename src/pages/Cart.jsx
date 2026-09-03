import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2, Sparkles, PackageCheck, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { EmptyState } from '../components/common/EmptyState';

export const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your Dispensary Cart is Empty"
          description="Explore our authentic homeopathic remedies, mother tinctures, and wellness products prescribed for your holistic health."
          actionText="Explore Remedies Catalog"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="bg-slate-50/60 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 w-full">
        
        {/* Top Banner & Header Card */}
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_15px_45px_rgba(15,23,42,0.06)] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Top Accent Gradient Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brandOrange-500 via-amber-400 to-[#0b344d]" />

          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-[#e05a1e] bg-orange-50 border border-orange-200/60">
                <Sparkles className="w-3.5 h-3.5 text-[#e05a1e]" /> Dispensary Basket
              </span>
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">• Dr. Bharathi’s Homeo Care</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2.5 flex items-center gap-3">
              Shopping Cart <span className="text-slate-400 text-lg sm:text-xl font-extrabold">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearCart}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold text-slate-500 hover:text-rose-600 bg-slate-100/80 hover:bg-rose-50 rounded-2xl border border-slate-200/60 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Items</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Items + Sticky Cart Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-2 pb-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brandOrange-500 animate-ping shrink-0" />
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Prescribed Formulations</span>
              </div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest hidden sm:block">Quantity & Amount</span>
            </div>

            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}

            {/* Bottom Actions & Trust bar */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/90">
              <Link 
                to="/shop" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-xs font-black text-white bg-gradient-to-r from-[#0b344d] via-[#104363] to-[#236888] hover:from-[#104363] hover:to-[#18587c] rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-amber-300" />
                <span>Continue Shopping</span>
              </Link>

              <div className="flex items-center gap-3 text-xs text-slate-700 font-extrabold bg-white/95 backdrop-blur-2xl px-4 py-2.5 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="flex items-center gap-1.5"><PackageCheck className="w-4 h-4 text-brandOrange-500" /> 100% Genuine</span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-emerald-500" /> Doctor Certified</span>
              </div>
            </div>
          </div>

          {/* Sticky Order Summary Card */}
          <div className="lg:col-span-4 sticky top-24">
            <CartSummary />
          </div>

        </div>

      </div>
    </div>
  );
};
