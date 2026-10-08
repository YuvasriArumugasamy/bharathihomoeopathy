import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, ShieldCheck, Truck, Sparkles, X, Lock, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartSummary = ({ isCheckoutPage = false, onPlaceOrder, isPlacingOrder = false }) => {
  const {
    items,
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

  const handleWhatsAppOrder = () => {
    if (!items || items.length === 0) return;
    const itemList = items
      .map((i, idx) => `${idx + 1}. ${i.name || i.title} (Qty: ${i.quantity}) - ₹${((i.price || 0) * (i.quantity || 1)).toLocaleString('en-IN')}`)
      .join('\n');
    const msg = `*Dr. Bharathi Homeo Care - Quick WhatsApp Order*\n\nHello Doctor, I would like to place an order for the following remedies:\n\n${itemList}\n\n*Total Amount:* ₹${grandTotal.toLocaleString('en-IN')}\n\nPlease confirm availability & delivery details. Thank you!`;
    const phone = '919360577726';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
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
        <div className="space-y-2.5">
          <Link
            to="/checkout"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 text-sm font-bold text-white bg-gradient-to-r from-brandOrange-500 to-[#f97316] hover:from-brandOrange-600 hover:to-[#ea580c] active:scale-[0.98] rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
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
