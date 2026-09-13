import React from 'react';
import { X, Printer, IndianRupee, ShieldCheck, HeartPulse, Sparkles } from 'lucide-react';
import { assets } from '../../assets';

export const OrderInvoiceModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = order.createdAt 
    ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) 
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const patientName = order.customer?.name || order.shippingAddress?.fullName || 'Valued Patient';
  const patientPhone = order.customer?.phone || order.shippingAddress?.phone || 'N/A';
  const patientEmail = order.customer?.email || order.shippingAddress?.email || 'N/A';
  const addressLine = [
    order.shippingAddress?.addressLine1,
    order.shippingAddress?.addressLine2,
    order.shippingAddress?.city,
    order.shippingAddress?.state,
    order.shippingAddress?.postalCode
  ].filter(Boolean).join(', ') || order.customer?.city || 'Tamil Nadu, India';

  const items = order.items && order.items.length > 0 ? order.items : [
    { name: 'Dr. Bharathi Homeopathic Formulation', quantity: 1, price: order.total || 450 }
  ];

  const totalAmount = Number(order.total || 0);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-navy-950/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto print:shadow-none print:border-none print:rounded-none">
        
        {/* Action Bar (Hidden in Print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Medical Invoice Preview</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-brandOrange-500/20 text-brandOrange-400 border border-brandOrange-500/30">
              {order.orderId || order.orderNumber || order.id}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brandOrange-500 hover:bg-brandOrange-600 text-white rounded-xl text-xs font-black shadow-md shadow-brandOrange-500/30 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="p-6 sm:p-10 font-serif text-slate-900 space-y-6">
          
          {/* Clinic Letterhead */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-brandOrange-500/30 pb-6">
            <div className="flex items-center gap-3.5">
              <img 
                src={assets.logo} 
                alt="Dr. Bharathi's Homoeo Care" 
                className="w-14 h-14 rounded-full object-cover border-2 border-brandOrange-500/40 shadow-xs"
              />
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif">
                  Dr. Bharathi’s Homoeo Care
                </h2>
                <p className="text-xs text-slate-500 font-sans">
                  Holistic Healing & Certified Classical Homeopathic Dispensary
                </p>
                <p className="text-[11px] text-brandOrange-600 font-bold font-sans">
                  Regd Clinic Lic No: HOM-TN-2016-8941
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right font-sans text-xs text-slate-600 space-y-0.5">
              <p className="font-bold text-slate-900">Dr. Bharathi, B.H.M.S.</p>
              <p>Senior Homeopathic Physician</p>
              <p>Tamil Nadu, India</p>
              <p>Email: care@drbharathihomoeo.com</p>
            </div>
          </div>

          {/* Invoice Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Billed To (Patient)</span>
              <p className="font-bold text-slate-900 text-sm">{patientName}</p>
              <p className="text-slate-600">{addressLine}</p>
              <p className="text-slate-600">Phone: {patientPhone}</p>
              {patientEmail !== 'N/A' && <p className="text-slate-600">Email: {patientEmail}</p>}
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Invoice Details</span>
              <p className="font-mono font-black text-slate-900 text-sm">
                INV-{order.orderId || order.id}
              </p>
              <p className="text-slate-600">Date: {invoiceDate}</p>
              <p className="text-slate-600">Payment: <strong className="text-slate-800">{order.paymentMethod || 'Online'}</strong></p>
              <p className="text-slate-600">
                Payment Status:{' '}
                <span className={`font-bold ${order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {order.paymentStatus || 'Paid'}
                </span>
              </p>
            </div>
          </div>

          {/* Remedies Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b-2 border-slate-200 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  <th className="py-2.5 pr-4">#</th>
                  <th className="py-2.5 px-4">Remedy Formulation & Potency</th>
                  <th className="py-2.5 px-4 text-center">Qty</th>
                  <th className="py-2.5 px-4 text-right">Unit Price</th>
                  <th className="py-2.5 pl-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((it, idx) => {
                  const qty = Number(it.quantity || it.qty || 1);
                  const price = Number(it.price || it.unitPrice || 0);
                  const lineTotal = qty * price;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 pr-4 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{it.name || it.productName || 'Homeopathic Dilution'}</p>
                        <p className="text-[11px] text-slate-500">Standard Clinical Packaging</p>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">{qty}</td>
                      <td className="py-3 px-4 text-right text-slate-600">₹{price.toLocaleString('en-IN')}</td>
                      <td className="py-3 pl-4 text-right font-black text-slate-900">₹{lineTotal.toLocaleString('en-IN')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary & Signatures */}
          <div className="pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row justify-between items-start gap-6 font-sans">
            
            {/* Disclaimer */}
            <div className="space-y-2 text-xs text-slate-500 max-w-sm">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                <ShieldCheck className="w-4 h-4 text-brandOrange-500" />
                <span>Certified Dispensary Seal</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Homeopathic formulations prepared under sterile good-manufacturing practices. Keep away from direct sunlight, camphor, and strong aromatics.
              </p>
            </div>

            {/* Total Box */}
            <div className="w-full sm:w-64 space-y-1.5 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Dispensary Shipping:</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Applicable GST:</span>
                <span>Included</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-black text-base text-slate-900 font-serif">
                <span>Grand Total:</span>
                <span className="text-brandOrange-600 font-sans">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Doctor Signature / Stamp */}
          <div className="pt-6 border-t border-dashed border-slate-200 flex justify-between items-end font-sans text-xs">
            <div className="text-[11px] text-slate-400">
              <p>Generated automatically via Dr. Bharathi's Electronic Medical Dispensary.</p>
              <p>Support: +91 94433 89410 | WhatsApp Dispensary Active</p>
            </div>

            <div className="text-center space-y-1">
              <div className="w-32 h-10 border-b border-slate-400 mx-auto" />
              <p className="font-bold text-slate-800 text-[11px]">Authorized Signature / Stamp</p>
              <p className="text-[10px] text-slate-400">Dr. Bharathi's Homoeo Care</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderInvoiceModal;
