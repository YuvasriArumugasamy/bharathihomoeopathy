import React from 'react';
import { Trash2, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  if (!item) return null;

  const unitPrice = Number(item.price) || 0;
  const totalPrice = unitPrice * (item.quantity || 1);

  return (
    <div className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
      
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100 p-1 flex items-center justify-center">
          <img
            src={item.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80'}
            alt={item.name}
            className="w-full h-full object-contain object-center rounded-lg"
          />
        </div>

        <div className="flex flex-col min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> In Stock
            </span>
          </div>

          <Link to={`/product/${item.id}`}>
            <h4 className="text-base font-bold text-slate-900 hover:text-brandOrange-600 transition-colors line-clamp-1">
              {item.name}
            </h4>
          </Link>

          <div className="text-xs text-slate-500 font-medium">
            <span className="text-slate-900 font-bold text-sm">₹{unitPrice}</span> <span className="text-slate-400">each</span>
          </div>
        </div>
      </div>

      {/* Stepper, Total Price & Actions */}
      <div className="flex items-center justify-between w-full sm:w-auto sm:gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        
        {/* Quantity Stepper */}
        <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-900 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer active:scale-95"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-bold text-slate-900">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-white hover:text-slate-900 rounded-lg transition-all cursor-pointer active:scale-95"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total Price */}
        <div className="text-right min-w-[70px]">
          <span className="text-base sm:text-lg font-extrabold text-slate-900">
            ₹{totalPrice}
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.id)}
          className="w-9 h-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-all cursor-pointer"
          title="Remove item"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
};
