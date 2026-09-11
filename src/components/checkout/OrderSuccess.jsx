import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ShoppingBag,
  Package,
  Printer,
  Phone,
  MessageCircle,
  Truck,
  MapPin,
  Calendar,
  ShieldCheck,
  Clock,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const OrderSuccess = ({ order }) => {
  const [copied, setCopied] = useState(false);

  const orderNumber = order?.orderNumber || 'DHC-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-7869';
  const totalAmount = order?.totalAmount || order?.total || 0;
  const paymentMode = order?.paymentMethod === 'ONLINE' || order?.paymentMethod === 'UPI' ? 'Online UPI' : 'Cash on Delivery (COD)';
  const courierPartner = order?.courier || 'ST COURIER';
  const shippingAddress = order?.shippingAddress || {};
  const orderItems = order?.items || [];

  // Delivery estimate calculation (3-5 days ahead)
  const today = new Date();
  const deliveryStart = new Date(today);
  deliveryStart.setDate(today.getDate() + 3);
  const deliveryEnd = new Date(today);
  deliveryEnd.setDate(today.getDate() + 5);

  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const formattedDelivery = `${deliveryStart.getDate().toString().padStart(2, '0')} ${monthNames[deliveryStart.getMonth()]} - ${deliveryEnd.getDate().toString().padStart(2, '0')} ${monthNames[deliveryEnd.getMonth()]}`;

  const copyOrderNumber = () => {
    navigator.clipboard?.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const cleanPhone = (phone) => {
    if (!phone) return '+91 98765 43210';
    return '+91 ' + phone.toString().replace(/^\+?91\s*/, '');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in-50 zoom-in-95 duration-400">
      
      {/* Main Success Container */}
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] relative overflow-hidden text-center space-y-8">
        
        {/* Top Gradient Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-[#f97316] to-[#0b344d]" />

        {/* Celebration Header & Icon */}
        <div className="space-y-4 pt-2">
          <div className="relative inline-flex items-center justify-center">
            {/* Animated Glow Rings */}
            <div className="absolute -inset-2 rounded-full bg-emerald-400/20 blur-md animate-pulse" />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center shadow-xl shadow-emerald-500/25 ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-black tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Order Confirmed</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto font-medium leading-relaxed">
              Your order has been recorded successfully. Our dispensary team will prepare your certified homeopathic remedies with utmost clinical care.
            </p>
          </div>
        </div>

        {/* Order Progress Tracker */}
        <div className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200/80 text-left space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#f97316]" />
              <span>Fulfillment Status</span>
            </span>
            <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Est. Delivery: {formattedDelivery}</span>
            </span>
          </div>

          {/* Stepper Steps */}
          <div className="grid grid-cols-4 gap-2 pt-2 relative">
            <div className="text-center space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-xs font-black shadow-md shadow-emerald-500/30">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <p className="text-[10px] sm:text-xs font-black text-slate-900">Placed</p>
              <p className="text-[9px] text-emerald-600 font-bold hidden sm:block">Just Now</p>
            </div>

            <div className="text-center space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-[#0b344d] text-white flex items-center justify-center mx-auto text-xs font-black ring-4 ring-[#0b344d]/15 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-[10px] sm:text-xs font-black text-[#0b344d]">Preparing</p>
              <p className="text-[9px] text-slate-400 font-medium hidden sm:block">Dispensary</p>
            </div>

            <div className="text-center space-y-1.5 opacity-60">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto text-xs font-black">
                <Truck className="w-3.5 h-3.5" />
              </div>
              <p className="text-[10px] sm:text-xs font-black text-slate-600">Dispatched</p>
              <p className="text-[9px] text-slate-400 font-medium hidden sm:block">{courierPartner}</p>
            </div>

            <div className="text-center space-y-1.5 opacity-60">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto text-xs font-black">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <p className="text-[10px] sm:text-xs font-black text-slate-600">Delivered</p>
              <p className="text-[9px] text-slate-400 font-medium hidden sm:block">Doorstep</p>
            </div>
          </div>
        </div>

        {/* Official Receipt Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm text-left overflow-hidden">
          
          {/* Receipt Top Header */}
          <div className="bg-gradient-to-r from-slate-900 via-[#0b344d] to-slate-900 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest block">
                Official Order Reference
              </span>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black font-mono tracking-wider text-white">
                  {orderNumber}
                </span>
                <button
                  type="button"
                  onClick={copyOrderNumber}
                  className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
                  title="Copy Order Number"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black uppercase">
                {order?.orderStatus || 'Confirmed'}
              </span>
            </div>
          </div>

          {/* Receipt Details Grid */}
          <div className="p-5 sm:p-6 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Delivery Address Details */}
              <div className="space-y-2 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#f97316]" />
                  <span>Delivery Address</span>
                </span>
                <div className="text-xs space-y-1 font-medium text-slate-700">
                  <p className="font-black text-slate-900 text-sm">
                    {shippingAddress.fullName || 'Recipient Customer'}
                  </p>
                  <p className="text-slate-500 font-mono text-[11px]">
                    {cleanPhone(shippingAddress.phone)}
                  </p>
                  <p className="text-slate-600 leading-snug">
                    {shippingAddress.addressLine1 || shippingAddress.address || '201-1 S.M Kovil street Vallam'},{' '}
                    {shippingAddress.city || 'Tenkasi'}, {shippingAddress.state || 'Tamil Nadu'} - {shippingAddress.postalCode || '627811'}
                  </p>
                </div>
              </div>

              {/* Payment & Courier Partner */}
              <div className="space-y-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Shipping Method
                  </span>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#f97316]" />
                    <span className="font-extrabold text-xs text-slate-900">{courierPartner}</span>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded bg-orange-100 text-orange-700 uppercase">
                      Fast Dispatch
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/80">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                    Payment Status
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{paymentMode}</span>
                    {paymentMode === 'Online UPI' ? (
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Verified (Paid)
                      </span>
                    ) : (
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Due upon delivery
                      </span>
                    )}
                  </div>
                  {order?.transactionId && (
                    <p className="text-[10px] font-mono text-purple-700 font-bold pt-1 flex items-center justify-between">
                      <span>UPI Ref / UTR:</span>
                      <strong className="tracking-wider">{order.transactionId}</strong>
                    </p>
                  )}
                </div>
              </div>

            </div>

            {/* Ordered Items Preview (if present) */}
            {orderItems.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#f97316]" />
                  <span>Items In This Shipment ({orderItems.length})</span>
                </span>
                <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50/50 overflow-hidden">
                  {orderItems.map((item, idx) => (
                    <div key={idx} className="p-3 sm:p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-xl border border-slate-200 bg-white"
                          />
                        )}
                        <div>
                          <p className="text-xs font-black text-slate-900 line-clamp-1">{item.name}</p>
                          <p className="text-[11px] text-slate-500 font-bold">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-extrabold text-xs text-slate-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total Due Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50/90 to-amber-50/90 border border-orange-200/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 block">
                  Total Amount Payable
                </span>
                <span className="text-[10px] font-bold text-slate-400">Inclusive of all applicable taxes & shipping</span>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-[#f97316] font-display">
                  ₹{Number(totalAmount).toFixed(2)}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            to="/my-account"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-black text-white bg-[#0b344d] hover:bg-[#13496b] rounded-2xl shadow-md shadow-[#0b344d]/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Package className="w-4 h-4" />
            <span>View in My Account</span>
          </Link>

          <Link
            to="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-black text-white bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] hover:opacity-95 rounded-2xl shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-black text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-2xl transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* Support & Contact Footer */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <a
            href="https://wa.me/919876543210?text=Hello%20Dr.%20Bharathi's%20Homeo%20Care,%20I%20have%20an%20inquiry%20about%20my%20Order%20"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/80 transition-all flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-emerald-950">WhatsApp Order Desk</p>
              <p className="text-[10px] text-emerald-700 font-bold">Instant updates & consultation</p>
            </div>
          </a>

          <a
            href="tel:+919876543210"
            className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0b344d] text-white flex items-center justify-center shadow-md shadow-slate-400/20 group-hover:scale-105 transition-transform">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900">Clinic Helpline Desk</p>
              <p className="text-[10px] text-slate-500 font-bold">+91 98765 43210 (10 AM - 8 PM)</p>
            </div>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-[10px] font-bold text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Certified Authentic Remedies</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Package className="w-4 h-4 text-[#f97316]" />
            <span>Discreet & Safe Clinical Packaging</span>
          </span>
        </div>

      </div>

    </div>
  );
};
