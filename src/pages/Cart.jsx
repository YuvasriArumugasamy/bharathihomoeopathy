import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
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
          title="Your Cart is Empty"
          description="Explore our authentic homeopathic remedies, mother tinctures, and wellness products."
          actionText="Continue Shopping"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="bg-slate-50/70 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 w-full">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              Shopping Cart 
              <span className="text-slate-500 text-base sm:text-lg font-semibold">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
            </h1>
          </div>

          <button
            onClick={clearCart}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 bg-white hover:bg-rose-50 rounded-xl border border-slate-200 transition-all duration-200 cursor-pointer active:scale-95 w-fit"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>

        {/* Main Grid: Items + Sticky Cart Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-1 pb-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Items in Cart</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Quantity & Price</span>
            </div>

            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}

            {/* Bottom Navigation */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <Link 
                to="/shop" 
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-700 hover:text-brandOrange-600 bg-white hover:bg-orange-50/50 rounded-xl border border-slate-200 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-4 h-4 text-brandOrange-500" />
                <span>Continue Shopping</span>
              </Link>
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
