import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  if (!item) return null;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-slate-100 shadow-sm transition-smooth hover:border-slate-200">
      
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 flex-1">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100 flex items-center justify-center">
          <img
            src={item.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80'}
            alt={item.name}
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-brandOrange-600 uppercase tracking-wider">
            {item.category}
          </span>
          <Link to={`/product/${item.id}`}>
            <h4 className="text-xs sm:text-sm font-bold text-navy-900 hover:text-brandOrange-600 transition-colors line-clamp-1">
              {item.name}
            </h4>
          </Link>
          {item.sku && (
            <span className="text-[10px] text-slate-400 font-mono">
              SKU: {item.sku}
            </span>
          )}
          <span className="text-xs font-semibold text-slate-700 mt-1">
            ₹{item.price} each
          </span>
        </div>
      </div>

      {/* Quantity Stepper, Subtotal & Actions */}
      <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        
        {/* Stepper */}
        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="p-2 text-slate-600 hover:bg-slate-200 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 text-xs font-bold text-navy-900">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="p-2 text-slate-600 hover:bg-slate-200 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Item Subtotal */}
        <div className="text-right">
          <span className="text-xs text-slate-400 block sm:hidden">Total:</span>
          <span className="text-sm sm:text-base font-extrabold text-navy-900">
            ₹{item.price * item.quantity}
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.id)}
          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
};
