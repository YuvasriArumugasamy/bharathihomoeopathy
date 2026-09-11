import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, ShieldCheck, Truck, Sparkles, X, Lock, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartSummary = ({ isCheckoutPage = false, onPlaceOrder, isPlacingOrder = false }) => {
  const {
    subtotal,
    discount,
    shipping,
    tax,
    grandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeShippingThreshold = 1000
  } = useCart();

  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon(couponCode.trim());
      setCouponCode('');
    }
  };

  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
      
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          Order Summary
        </h3>
      </div>

      {/* Free Shipping Banner */}
      {subtotal > 0 && amountToFreeShipping > 0 ? (
        <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/60 space-y-2">
          <div className="flex items-center justify-between text-xs text-amber-900 font-bold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brandOrange-500" />
              Free Delivery on orders above ₹{freeShippingThreshold}
            </span>
            <span className="text-brandOrange-600 font-extrabold">Add ₹{amountToFreeShipping} more</span>
          </div>
          <div className="w-full bg-amber-200/50 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-brandOrange-500 to-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      ) : subtotal >= freeShippingThreshold ? (
        <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200/80 text-xs text-emerald-800 font-bold flex items-center gap-3">
          <div className="p-1.5 bg-emerald-600 text-white rounded-lg shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-extrabold text-emerald-950">Free Delivery Unlocked!</p>
            <p className="text-[11px] text-emerald-700 font-medium">Your order qualifies for free home delivery.</p>
          </div>
        </div>
      ) : null}

      {/* Coupon Application Box */}
      {!isCheckoutPage && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">Have a Coupon Code?</label>
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs">
              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span>Applied: <strong className="font-mono text-emerald-700">{appliedCoupon.code}</strong></span>
              </div>
              <button
                onClick={removeCoupon}
                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                aria-label="Remove coupon"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 text-xs font-medium uppercase bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all placeholder:normal-case placeholder:text-slate-400"
                />
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 text-xs font-bold text-white bg-brandOrange-500 hover:bg-brandOrange-600 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Apply
              </button>
            </form>
          )}
        </div>
      )}

      {/* Pricing Table */}
      <div className="space-y-3 text-xs text-slate-600 pt-1 font-medium">
        <div className="flex justify-between items-center">
          <span>Items Subtotal</span>
          <span className="font-bold text-slate-900 text-sm">₹{subtotal}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center text-emerald-700 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-100">
            <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Coupon Discount</span>
            <span>- ₹{discount}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span>Estimated Shipping</span>
          <span className="font-bold text-slate-900">
            {shipping === 0 ? (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[11px]">FREE</span>
            ) : (
              `₹${shipping}`
            )}
          </span>
        </div>

        {tax > 0 && (
          <div className="flex justify-between items-center">
            <span>Taxes</span>
            <span className="font-bold text-slate-900">₹{tax}</span>
          </div>
        )}

        {/* Total Amount */}
        <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
          <div>
            <span className="text-sm font-bold text-slate-900 block">Total Amount</span>
            <span className="text-[11px] text-slate-400 font-medium">Inclusive of all taxes</span>
          </div>
          <span className="text-2xl font-black text-slate-900">
            ₹{grandTotal}
          </span>
        </div>
      </div>

      {/* CTA Button */}
      {!isCheckoutPage ? (
        <Link
          to="/checkout"
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-bold text-white bg-gradient-to-r from-brandOrange-500 to-[#f97316] hover:from-brandOrange-600 hover:to-[#ea580c] active:scale-[0.98] rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      ) : (
        <button
          onClick={onPlaceOrder}
          disabled={isPlacingOrder || subtotal === 0}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-bold text-white bg-gradient-to-r from-brandOrange-500 to-[#f97316] hover:from-brandOrange-600 hover:to-[#ea580c] active:scale-[0.98] rounded-xl shadow-md shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPlacingOrder ? (
            <span>Processing Order...</span>
          ) : (
            <>
              <span>Confirm & Place Order</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      )}

      {/* Trust Guarantee */}
      <div className="pt-1 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium text-center">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>100% Genuine Remedies • Secure Checkout</span>
      </div>

    </div>
  );
};
