import React from 'react';
import { ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CheckoutSummary = ({ isPlacingOrder, onPlaceOrder }) => {
  const { items, subtotal, discount, shipping, tax, grandTotal, appliedCoupon } = useCart();

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5 sticky top-24">
      <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider pb-3 border-b border-slate-100">
        Review Your Order
      </h3>

      {/* Item Previews List */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 truncate">
              <img
                src={item.image}
                alt={item.name}
                className="w-10 h-10 rounded-lg object-cover bg-slate-50 border border-slate-100 shrink-0"
              />
              <div className="truncate">
                <p className="font-bold text-navy-900 truncate">{item.name}</p>
                <p className="text-[11px] text-slate-400">Qty: {item.quantity} × ₹{item.price}</p>
              </div>
            </div>
            <span className="font-semibold text-slate-800 shrink-0">₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      {/* Breakdown */}
      <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-800">₹{subtotal}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 font-semibold">
            <span>Coupon ({appliedCoupon?.code})</span>
            <span>- ₹{discount}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="font-semibold text-slate-800">
            {shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${shipping}`}
          </span>
        </div>

        {tax > 0 && (
          <div className="flex justify-between">
            <span>Taxes</span>
            <span className="font-semibold text-slate-800">₹{tax}</span>
          </div>
        )}

        <div className="flex justify-between text-base font-extrabold text-navy-900 pt-3 border-t border-slate-100">
          <span>Grand Total</span>
          <span className="text-brandOrange-600">₹{grandTotal}</span>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={onPlaceOrder}
        disabled={isPlacingOrder || items.length === 0}
        className="w-full py-3.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-brandOrange-500 to-brandOrange-600 hover:from-brandOrange-600 hover:to-brandOrange-700 rounded-xl shadow-md shadow-brandOrange-500/20 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPlacingOrder ? 'Creating Order...' : 'Confirm & Place Order'}
      </button>

      <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Safe & Encrypted Checkout</span>
      </div>

    </div>
  );
};
