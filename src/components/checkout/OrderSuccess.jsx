import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ShoppingBag,
  Package,
  Printer,
  Phone,
  Truck,
  MapPin,
  Calendar,
  ShieldCheck,
  Clock,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  FileText,
  Award,
  CreditCard
} from 'lucide-react';
import { assets } from '../../assets';

export const OrderSuccess = ({ order }) => {
  const [copied, setCopied] = useState(false);

  const orderNumber = order?.orderNumber || Math.floor(100000 + Math.random() * 900000).toString();
  const totalAmount = Number(order?.totalAmount || order?.total || 0);
  const paymentMode = order?.paymentMethod === 'ONLINE' || order?.paymentMethod === 'UPI' ? 'Online UPI' : 'Cash on Delivery (COD)';
  const isPaid = order?.paymentMethod === 'ONLINE' || order?.paymentMethod === 'UPI';
  const courierPartner = order?.courier || 'ST COURIER';
  const shippingAddress = order?.shippingAddress || {};
  const orderItems = Array.isArray(order?.items)
    ? order.items
    : typeof order?.items === 'string' && order.items.trim().length > 0
    ? [{ name: order.items, quantity: 1, price: totalAmount }]
    : [];

  // Delivery estimate calculation (3-5 days ahead)
  const today = new Date();
  const deliveryStart = new Date(today);
  deliveryStart.setDate(today.getDate() + 3);
  const deliveryEnd = new Date(today);
  deliveryEnd.setDate(today.getDate() + 5);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDelivery = `${deliveryStart.getDate()} ${monthNames[deliveryStart.getMonth()]} - ${deliveryEnd.getDate()} ${monthNames[deliveryEnd.getMonth()]}, ${deliveryEnd.getFullYear()}`;
  const orderDateStr = order?.createdAt 
    ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : today.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // Compute clean Windows-safe file name for PDF print
  const safeOrderNo = (orderNumber || 'RECEIPT').toString().replace(/[^a-zA-Z0-9_-]/g, '');
  const cleanCustomer = (shippingAddress?.firstName || order?.customer?.name || '').toString().trim().replace(/[^a-zA-Z0-9]/g, '');
  const receiptFileName = cleanCustomer
    ? `Bharathi_HomeoCare_Receipt_${safeOrderNo}_${cleanCustomer}`
    : `Bharathi_HomeoCare_Receipt_${safeOrderNo}`;

  // Automatically update page title so browser uses it as default PDF save name
  useEffect(() => {
    const originalTitle = document.title;
    document.title = receiptFileName;
    return () => {
      document.title = originalTitle;
    };
  }, [receiptFileName]);

  const copyOrderNumber = () => {
    navigator.clipboard?.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    // Auto-copy the file name to clipboard so user can just Ctrl+V if Windows asks for filename
    navigator.clipboard?.writeText(receiptFileName);

    document.title = receiptFileName;
    setTimeout(() => {
      window.print();
    }, 120);
  };

  const cleanPhone = (phone) => {
    if (!phone) return '+91 90258 54711';
    return '+91 ' + phone.toString().replace(/^\+?91\s*/, '');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 py-3 sm:py-8 px-2 sm:px-4 pb-28 sm:pb-8 print:p-0 print:m-0 print:space-y-0 print:max-w-full">
      
      {/* ========================================================================= */}
      {/* SINGLE UNIFIED CLINICAL ORDER RECEIPT & INVOICE CARD                       */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-md sm:shadow-xl overflow-hidden print:shadow-none print:border print:border-slate-300 print:rounded-2xl print:p-3 print:space-y-2 receipt-print-container">
        
        {/* TOP STATUS BAR (Clean & Compact) */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-3.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="text-[11px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider truncate">
              Order Confirmed
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-emerald-700 font-semibold shrink-0">
            Sent to Dispensary ✓
          </span>
        </div>

        {/* CLINIC HEADER & RECEIPT REFERENCE */}
        <div className="p-3.5 sm:p-7 print:p-2 bg-gradient-to-b from-slate-50/70 to-white print:bg-none border-b border-slate-200 flex flex-col sm:flex-row print:flex-row items-start sm:items-center print:items-center justify-between gap-3 sm:gap-4 print:gap-2">
          
          <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <img 
              src={assets.logo} 
              alt="Dr. Bharathi's Homeo Care" 
              style={{ width: '44px', height: '44px', minWidth: '44px', minHeight: '44px' }}
              className="w-11 h-11 sm:w-13 sm:h-13 print:w-10 print:h-10 rounded-full object-cover border border-amber-500/40 shadow-xs shrink-0" 
            />
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-2xl print:text-lg font-black text-[#072538] tracking-tight leading-tight truncate">
                Dr. Bharathi's Homeo Care
              </h1>
              <p className="text-[10px] sm:text-[11px] print:text-[9px] font-bold text-slate-500 uppercase tracking-wider truncate">
                Classical Homeopathy Clinic & Dispensary
              </p>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate hidden sm:block">
                Municipality Complex, Tirunelveli • Helpline: +91 90258 54711
              </p>
            </div>
          </div>

          {/* Order Ref Block (Clean & Compact on Mobile) */}
          <div className="flex items-center justify-between sm:flex-col sm:items-end print:items-end w-full sm:w-auto bg-slate-50 sm:bg-transparent print:bg-transparent p-2 sm:p-0 print:p-0 rounded-xl border sm:border-0 print:border-0 border-slate-200">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs text-slate-400 font-bold">Order Ref:</span>
              <span className="text-sm sm:text-lg print:text-sm font-mono font-black text-slate-900">#{orderNumber}</span>
              <button
                type="button"
                onClick={copyOrderNumber}
                className="p-1 text-slate-400 hover:text-slate-700 print:hidden cursor-pointer"
                title="Copy Order Reference"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium">{orderDateStr}</p>
          </div>

        </div>

        {/* ORDER & PATIENT METADATA GRID (3-COLS RESPONSIVE) */}
        <div className="p-3 sm:p-6 print:p-0 grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 gap-2 sm:gap-3 border-b border-slate-200/80 print:border-b-0 bg-slate-50/40 print:bg-transparent">
          
          {/* Box 1: Patient Destination */}
          <div className="bg-white p-3 print:p-2 rounded-xl border border-slate-200/80 shadow-2xs space-y-0.5">
            <span className="text-[9.5px] print:text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-500" />
              <span>Delivery Address</span>
            </span>
            <p className="font-bold text-xs print:text-[11px] text-slate-900 truncate">
              {shippingAddress.fullName || 'Valued Patient'}
            </p>
            <p className="text-[10.5px] print:text-[9.5px] font-mono font-semibold text-slate-600">
              📞 {cleanPhone(shippingAddress.phone)}
            </p>
            <p className="text-[10.5px] print:text-[9.5px] text-slate-600 leading-snug line-clamp-2">
              {shippingAddress.addressLine1 || shippingAddress.address || '201-1 S.M Kovil street Vallam'},{' '}
              {shippingAddress.city || 'Tenkasi'}, {shippingAddress.state || 'TN'} - {shippingAddress.postalCode || '627811'}
            </p>
          </div>

          {/* Box 2: Shipping & Courier Partner */}
          <div className="bg-white p-3 print:p-2 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
            <span className="text-[9.5px] print:text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Truck className="w-3 h-3 text-sky-500" />
              <span>Logistics</span>
            </span>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Courier:</span>
              <span className="font-bold text-slate-900">{courierPartner}</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-0.5 border-t border-slate-100">
              <span className="text-slate-500 text-[11px]">Arrival:</span>
              <span className="font-bold text-emerald-700 text-[11px]">{formattedDelivery}</span>
            </div>
          </div>

          {/* Box 3: Payment Details */}
          <div className="bg-white p-3 print:p-2 rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
            <span className="text-[9.5px] print:text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-emerald-500" />
              <span>Payment</span>
            </span>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Mode:</span>
              <span className="font-bold text-slate-900">{paymentMode}</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-0.5 border-t border-slate-100">
              <span className="text-slate-500 text-[11px]">Status:</span>
              <span className={`px-2 py-0.2 text-[10px] font-bold rounded-full ${
                isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
              }`}>
                {isPaid ? '✓ Paid' : 'Pay on Delivery'}
              </span>
            </div>
          </div>

        </div>

        {/* PRESCRIBED REMEDIES / ITEMS SECTION */}
        <div className="p-3 sm:p-6 print:p-0 space-y-2 sm:space-y-2.5 print:space-y-1.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm print:text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-amber-500" />
              <span>Prescribed Remedies ({orderItems.length || 1})</span>
            </h2>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline print:inline">
              Formulation & Packaging
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/90 text-slate-600 font-bold uppercase text-[9px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2 print:py-1.5 px-2.5 print:px-2">Remedy Item</th>
                  <th className="py-2 print:py-1.5 px-2 text-center">Qty</th>
                  <th className="py-2 print:py-1.5 px-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orderItems.length > 0 ? (
                  orderItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="py-2 print:py-1 px-2.5 print:px-2">
                        <div className="flex items-center gap-2">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-7 h-7 sm:w-8 sm:h-8 object-cover rounded-md border border-slate-200 bg-white print:hidden shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-extrabold text-slate-900 text-xs print:text-[10.5px] leading-tight">
                              {item.name}
                            </p>
                            <p className="text-[10px] print:text-[9px] text-slate-400 font-medium">Standard Formulation</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 print:py-1 px-2 text-center font-bold text-slate-800 print:text-[10px]">{item.quantity}</td>
                      <td className="py-2 print:py-1 px-3 text-right font-black text-slate-900 print:text-[10px]">
                        ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                        {Number(item.quantity) > 1 && (
                          <span className="block text-[9px] font-normal text-slate-400">₹{Number(item.price).toFixed(2)} each</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-2 print:py-1 px-2.5 font-extrabold text-slate-900 text-xs">Dr. Bharathi Classical Homeopathy Remedy</td>
                    <td className="py-2 print:py-1 px-2 text-center font-bold text-slate-800">1</td>
                    <td className="py-2 print:py-1 px-3 text-right font-black text-slate-900">₹{totalAmount.toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* FINANCIAL SUMMARY TOTALS */}
          <div className="flex flex-col sm:flex-row print:flex-row justify-between items-stretch sm:items-center print:items-center gap-2 pt-2 print:pt-1">
            <div className="text-[10px] print:text-[9px] text-slate-500 leading-tight hidden sm:block max-w-sm">
              <strong className="text-slate-700">Note:</strong> Prepared under Homeopathic Pharmacopoeia of India (H.P.I). Keep away from strong odors and direct sunlight.
            </div>

            <div className="w-full sm:w-64 print:w-56 bg-slate-50 print:bg-white p-2.5 sm:p-3 print:p-2 rounded-xl border border-slate-200/90 space-y-1 text-xs print:text-[10px]">
              <div className="flex justify-between text-slate-600 text-[11px] sm:text-xs">
                <span>Subtotal:</span>
                <span className="font-bold">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px] sm:text-xs">
                <span>Packaging & Delivery:</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="border-t border-slate-200 pt-1 flex justify-between items-baseline">
                <span className="font-black text-slate-900 uppercase text-[11px] print:text-[10px]">Grand Total:</span>
                <span className="text-base sm:text-lg print:text-base font-black text-[#072538]">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* DOCTOR & CLINIC VERIFICATION FOOTER */}
          <div className="pt-2 sm:pt-3 print:pt-1.5 mt-1 sm:mt-2 print:mt-1 border-t border-slate-200 flex flex-row items-center justify-between gap-2 text-[10px] print:text-[9px] text-slate-500">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                ✓
              </div>
              <p className="font-bold text-slate-900">Certified Authentic</p>
            </div>

            <div className="text-right">
              <p className="font-extrabold text-slate-800">Dr. Bharathi, B.H.M.S, M.D.</p>
              <p className="text-[9px] text-slate-400">Regd Medical Practitioner • TN</p>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* ACTION BUTTONS (MOBILE FRIENDLY & SCREEN ONLY)                            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:flex sm:flex-row items-center justify-center gap-2 sm:gap-3 pt-1 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#072538] hover:bg-[#0d4567] rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>Print Official Receipt</span>
        </button>

        <Link
          to="/my-account"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-all cursor-pointer shadow-2xs"
        >
          <Package className="w-4 h-4 text-slate-500" />
          <span>Go to My Account</span>
        </Link>

        <Link
          to="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-500 rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};

export default OrderSuccess;
