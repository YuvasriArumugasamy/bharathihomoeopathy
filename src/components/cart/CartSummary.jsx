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
    <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-[0_15px_45px_rgba(15,23,42,0.08)] space-y-6 relative overflow-hidden">
      {/* Top Accent Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brandOrange-500 via-amber-400 to-[#0b344d]" />
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>Order Summary</span>
        </h3>
        <span className="text-[11px] font-black px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200/60 shadow-2xs">
          🔒 Encrypted Checkout
        </span>
      </div>

      {/* Free Shipping Banner */}
      {subtotal > 0 && amountToFreeShipping > 0 ? (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50/80 to-amber-50 p-4 rounded-2xl border border-amber-200/70 space-y-2">
          <div className="flex items-center justify-between text-xs text-amber-900 font-extrabold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#e05a1e] animate-pulse" />
              Free Delivery Goal
            </span>
            <span className="text-[#e05a1e] font-black">Add ₹{amountToFreeShipping} more</span>
          </div>
          <div className="w-full bg-amber-200/50 h-2 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] h-full rounded-full transition-all duration-500 shadow-2xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      ) : subtotal >= freeShippingThreshold ? (
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-3">
          <div className="p-2 bg-emerald-500 text-white rounded-xl shrink-0 shadow-2xs">
            <Truck className="w-4.5 h-4.5" />
          </div>
          <div>
            <p className="font-black text-emerald-950">Free Delivery Unlocked!</p>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Your order qualifies for free home delivery.</p>
          </div>
        </div>
      ) : null}

      {/* Coupon Application Box */}
      {!isCheckoutPage && (
        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">Have a Coupon Code?</label>
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-xs">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold">
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
                  placeholder="Coupon code (e.g. HOMECARE10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 text-xs font-bold uppercase bg-slate-50 border border-slate-200/90 rounded-2xl focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all placeholder:normal-case placeholder:font-medium placeholder:text-slate-400"
                />
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
              <button
                type="submit"
                className="px-5 py-3 text-xs font-black text-white bg-gradient-to-r from-brandOrange-500 via-[#f97316] to-[#ff4e50] hover:from-brandOrange-600 hover:to-[#e05a1e] rounded-2xl transition-all shadow-md shadow-orange-500/20 active:scale-95 cursor-pointer"
              >
                Apply
              </button>
            </form>
          )}
        </div>
      )}

      {/* Pricing Table */}
      <div className="space-y-3 text-xs text-slate-600 pt-2 font-medium">
        <div className="flex justify-between items-center">
          <span>Items Subtotal</span>
          <span className="font-black text-slate-900 text-sm">₹{subtotal}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center text-emerald-700 font-extrabold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200/60">
            <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Coupon Discount</span>
            <span>- ₹{discount}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span>Estimated Shipping</span>
          <span className="font-extrabold text-slate-900">
            {shipping === 0 ? (
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-black text-[11px]">FREE</span>
            ) : (
              `₹${shipping}`
            )}
          </span>
        </div>

        {tax > 0 && (
          <div className="flex justify-between items-center">
            <span>Taxes</span>
            <span className="font-extrabold text-slate-900">₹{tax}</span>
          </div>
        )}

        {/* Total Amount Box */}
        <div className="pt-2 border-t border-slate-100">
          <div className="px-5 py-4 bg-gradient-to-r from-[#0b344d] via-[#104363] to-[#236888] rounded-2xl text-white flex items-center justify-between shadow-lg border border-white/15 gap-3 relative overflow-hidden">
            <div className="space-y-0.5 min-w-0">
              <span className="text-xs text-slate-200 block font-bold tracking-wide uppercase">Total Amount</span>
              <span className="text-[11px] text-emerald-400 font-extrabold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Inclusive of all taxes</span>
              </span>
            </div>
            <div className="shrink-0 text-right">
              <span className="text-2xl sm:text-3xl font-black text-[#f97316] tracking-tight">
                ₹{grandTotal}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      {!isCheckoutPage ? (
        <Link
          to="/checkout"
          className="w-full flex items-center justify-center gap-2.5 py-4 px-6 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] hover:scale-[1.02] active:scale-95 rounded-2xl shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      ) : (
        <button
          onClick={onPlaceOrder}
          disabled={isPlacingOrder || subtotal === 0}
          className="w-full flex items-center justify-center gap-2.5 py-4 px-6 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] hover:scale-[1.02] active:scale-95 rounded-2xl shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
      <div className="pt-2 flex flex-col items-center gap-1.5 text-center">
        <div className="flex items-center gap-2 text-xs font-black text-slate-800">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>100% Genuine Certified Remedies</span>
        </div>
        <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
          <Lock className="w-3 h-3" /> Doctor Formulated & Quality Certified
        </p>
      </div>

    </div>
  );
};
