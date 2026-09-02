import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, ShieldCheck, Truck, Sparkles, X } from 'lucide-react';
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
    freeShippingThreshold
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

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5">
      
      <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider pb-3 border-b border-slate-100">
        Order Summary
      </h3>

      {/* Free Shipping Progress Indicator */}
      {subtotal > 0 && amountToFreeShipping > 0 ? (
        <div className="bg-brandOrange-50/60 p-3 rounded-xl border border-brandOrange-100 text-xs">
          <div className="flex items-center gap-1.5 text-brandOrange-700 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Add ₹{amountToFreeShipping} more for FREE shipping!</span>
          </div>
          <div className="w-full bg-brandOrange-200/60 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-brandOrange-500 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
            />
          </div>
        </div>
      ) : subtotal >= freeShippingThreshold ? (
        <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 text-xs text-emerald-700 font-semibold flex items-center gap-2">
          <Truck className="w-4 h-4" />
          <span>You unlocked FREE Delivery!</span>
        </div>
      ) : null}

      {/* Coupon Application Box */}
      {!isCheckoutPage && (
        <div className="pt-2">
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>Coupon: <strong>{appliedCoupon.code}</strong></span>
              </div>
              <button
                onClick={removeCoupon}
                className="text-slate-400 hover:text-rose-500"
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
                  className="w-full pl-8 pr-3 py-2 text-xs uppercase bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brandOrange-500"
                />
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-navy-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-smooth"
              >
                Apply
              </button>
            </form>
          )}
        </div>
      )}

      {/* Financial Line Items */}
      <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
        <div className="flex justify-between">
          <span>Items Subtotal</span>
          <span className="font-semibold text-slate-800">₹{subtotal}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 font-semibold">
            <span>Coupon Discount</span>
            <span>- ₹{discount}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Estimated Shipping</span>
          <span className="font-semibold text-slate-800">
            {shipping === 0 ? <strong className="text-emerald-600 font-bold">FREE</strong> : `₹${shipping}`}
          </span>
        </div>

        {tax > 0 && (
          <div className="flex justify-between">
            <span>Taxes</span>
            <span className="font-semibold text-slate-800">₹{tax}</span>
          </div>
        )}

        <div className="flex justify-between text-sm font-extrabold text-navy-900 pt-3 border-t border-slate-100">
          <span>Total Amount</span>
          <span className="text-base text-brandOrange-600 font-extrabold">₹{grandTotal}</span>
        </div>
      </div>

      {/* CTA Button */}
      {!isCheckoutPage ? (
        <Link
          to="/checkout"
          className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-gradient-to-r from-brandOrange-500 to-brandOrange-600 hover:from-brandOrange-600 hover:to-brandOrange-700 rounded-xl shadow-md shadow-brandOrange-500/20 transition-smooth hover:scale-[1.01]"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      ) : (
        <button
          onClick={onPlaceOrder}
          disabled={isPlacingOrder || subtotal === 0}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-gradient-to-r from-brandOrange-500 to-brandOrange-600 hover:from-brandOrange-600 hover:to-brandOrange-700 rounded-xl shadow-md shadow-brandOrange-500/20 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
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

      <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>100% Genuine Certified Remedies</span>
      </div>

    </div>
  );
};
