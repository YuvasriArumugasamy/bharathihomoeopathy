import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight, Package, Calendar, Phone } from 'lucide-react';

export const OrderSuccess = ({ order }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-premium text-center space-y-6 animate-in zoom-in-95 duration-300">
      
      {/* Success Icon */}
      <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Thank You for Your Order!
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Your order has been recorded successfully. Our dispensary team will prepare your certified remedies with care.
        </p>
      </div>

      {/* Order Summary Receipt Box */}
      <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200/80 text-left space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Order Number</span>
            <span className="text-sm font-extrabold text-navy-900 font-mono">{order?.orderNumber || 'DHC-DEMO-001'}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
            <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold text-amber-700 bg-amber-100 rounded-full">
              {order?.orderStatus || 'Pending'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs pt-1">
          <div>
            <span className="text-slate-400 block text-[11px]">Payment Mode</span>
            <span className="font-bold text-slate-800">{order?.paymentMethod === 'ONLINE' ? 'Online Payment' : 'Cash on Delivery (COD)'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Total Paid/Due</span>
            <span className="font-extrabold text-brandOrange-600 text-sm">₹{order?.totalAmount || order?.total || 0}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          to="/my-account"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold text-navy-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-smooth"
        >
          <Package className="w-4 h-4" />
          <span>View in My Account</span>
        </Link>

        <Link
          to="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-bold text-white bg-brandOrange-500 hover:bg-brandOrange-600 rounded-xl shadow-md shadow-brandOrange-500/20 transition-smooth"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="pt-2 text-[11px] text-slate-400">
        Questions about your order? Call our clinic desk at <strong>+91 98765 43210</strong>
      </div>

    </div>
  );
};
