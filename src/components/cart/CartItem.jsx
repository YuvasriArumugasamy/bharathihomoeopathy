import React from 'react';
import { Trash2, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  if (!item) return null;

  const unitPrice = Number(item.price) || 0;
  const totalPrice = unitPrice * (item.quantity || 1);

  return (
    <div className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-5 sm:p-6 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-[0_10px_35px_rgba(15,23,42,0.05)] hover:shadow-xl hover:border-brandOrange-400 transition-all duration-300">
      
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-2xl overflow-hidden shrink-0 border border-slate-200/80 p-1 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform duration-300">
          <img
            src={item.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80'}
            alt={item.name}
            className="w-full h-full object-cover object-center rounded-xl"
          />
        </div>

        <div className="flex flex-col min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            {item.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black text-[#e05a1e] bg-orange-50 border border-orange-200/60 uppercase tracking-wider">
                {item.category}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> In Stock
            </span>
          </div>

          <Link to={`/product/${item.id}`}>
            <h4 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-brandOrange-600 transition-colors line-clamp-1">
              {item.name}
            </h4>
          </Link>

          {item.sku && (
            <span className="text-[11px] text-slate-400 font-mono">
              Dispensary SKU: {item.sku}
            </span>
          )}

          <div className="text-xs font-bold text-slate-500 pt-0.5">
            <span className="text-[#e05a1e] font-black text-sm">₹{unitPrice}</span> <span className="text-slate-400 font-normal">each</span>
          </div>
        </div>
      </div>

      {/* Stepper, Total Price & Actions */}
      <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-3.5 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        
        {/* Stylized Quantity Stepper */}
        <div className="flex items-center border border-slate-200/90 rounded-2xl p-1 bg-slate-100/70 shadow-2xs">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-rose-500 hover:text-white bg-white rounded-xl shadow-2xs transition-all duration-200 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-700 cursor-pointer active:scale-95"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-9 text-center text-sm font-black text-slate-900">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 flex items-center justify-center text-white bg-gradient-to-tr from-[#ff4e50] via-[#f97316] to-[#f9d423] hover:scale-105 rounded-xl shadow-xs shadow-orange-500/25 transition-all duration-200 cursor-pointer active:scale-95"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total Price Badge */}
        <div className="text-right px-3.5 py-1.5 rounded-2xl bg-orange-50/80 border border-orange-200/60 shadow-2xs">
          <span className="text-[9px] text-slate-400 block uppercase font-black tracking-widest sm:hidden">Total</span>
          <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            ₹{totalPrice}
          </span>
        </div>

        {/* Remove Button Pod */}
        <button
          onClick={() => onRemove(item.id)}
          className="w-10 sm:w-10.5 h-10 sm:h-10.5 rounded-2xl bg-white border border-slate-200 hover:bg-rose-500 hover:border-rose-500 text-slate-400 hover:text-white flex items-center justify-center p-2.5 shrink-0 transition-all duration-200 cursor-pointer shadow-xs active:scale-95 group/trash"
          title="Remove item"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4 transition-transform duration-200 group-hover/trash:scale-110" />
        </button>

      </div>

    </div>
  );
};
