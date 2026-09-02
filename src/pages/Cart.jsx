import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, ShieldCheck, Sparkles } from 'lucide-react';
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
          description="Explore our authentic homeopathic remedies, mother tinctures, and wellness products to begin your holistic healing."
          actionText="Explore Dispensary Catalog"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full overflow-x-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brandOrange-600">Dispensary Basket</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All Items</span>
        </button>
      </div>

      {/* Grid: Items vs Sticky Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}

          <div className="pt-4 flex justify-between items-center text-xs">
            <Link to="/shop" className="font-bold text-navy-900 hover:text-brandOrange-600 flex items-center gap-1">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-4 sticky top-24">
          <CartSummary />
        </div>

      </div>

    </div>
  );
};
