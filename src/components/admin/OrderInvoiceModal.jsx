import React from 'react';
import { X, Printer, IndianRupee, ShieldCheck, HeartPulse, Sparkles } from 'lucide-react';
import { assets } from '../../assets';

export const OrderInvoiceModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    const originalTitle = document.title;
    const safeOrderNum = (order.orderId || order.orderNumber || order.id || 'INV').toString().replace(/[^a-zA-Z0-9_-]/g, '');
    const cleanPatient = (patientName || '').replace(/[^a-zA-Z0-9]/g, '');
    const fileName = cleanPatient ? `Bharathi_Invoice_${safeOrderNum}_${cleanPatient}` : `Bharathi_Invoice_${safeOrderNum}`;

    document.title = fileName;
    navigator.clipboard?.writeText(fileName);
    setTimeout(() => {
      window.print();
    }, 120);
    setTimeout(() => {
      document.title = originalTitle;
    }, 2500);
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

  const items = Array.isArray(order.items) && order.items.length > 0
    ? order.items
    : [
        { 
          name: typeof order.items === 'string' && order.items.trim() ? order.items : 'Dr. Bharathi Homeopathic Formulation', 
          quantity: 1, 
          price: order.total || 450 
        }
      ];

  const totalAmount = Number(order.total || 0);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 bg-navy-950/70 backdrop-blur-sm print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-3xl max-h-[96vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Action Bar (Hidden in Print) */}
        <div className="bg-slate-900 text-white px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="text-[11px] sm:text-xs font-black text-slate-300 uppercase tracking-wider truncate">
              Invoice Preview
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black font-mono bg-brandOrange-500/20 text-brandOrange-400 border border-brandOrange-500/30 shrink-0">
              #{order.orderId || order.orderNumber || order.id}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-brandOrange-500 hover:bg-brandOrange-600 text-white rounded-xl text-[11px] sm:text-xs font-black shadow-md shadow-brandOrange-500/30 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 sm:p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-all cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas (Scrollable on mobile, full print) */}
        <div className="p-3.5 sm:p-8 md:p-10 font-serif text-slate-900 space-y-4 sm:space-y-6 overflow-y-auto flex-1 print:overflow-visible print:p-0 print:m-0 print:space-y-2.5 print:max-w-full invoice-print-container">
          
          {/* Clinic Letterhead */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b-2 border-brandOrange-500/30 pb-4 sm:pb-6 print:pb-2 print:gap-2">
            <div className="flex items-center gap-3">
              <img 
                src={assets.logo} 
                alt="Dr. Bharathi's Homoeo Care" 
                className="w-11 h-11 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-brandOrange-500/40 shadow-xs shrink-0 print:w-12 print:h-12"
              />
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight font-serif leading-snug print:text-xl">
                  Dr. Bharathi’s Homoeo Care
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 font-sans print:text-[10px]">
                  Holistic Healing & Certified Classical Homeopathic Dispensary
                </p>
                <p className="text-[10px] sm:text-[11px] text-brandOrange-600 font-bold font-sans print:text-[9.5px]">
                  Regd Clinic Lic No: HOM-TN-2016-8941
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right font-sans text-[11px] sm:text-xs text-slate-600 space-y-0.5 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto print:pt-0 print:text-[10px]">
              <p className="font-bold text-slate-900">Dr. Bharathi, B.H.M.S.</p>
              <p>Senior Homeopathic Physician</p>
              <p>Tamil Nadu, India</p>
              <p className="text-slate-500">Email: care@drbharathihomoeo.com</p>
            </div>
          </div>

          {/* Invoice Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 font-sans text-xs bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 print:p-2.5 print:gap-2 print:rounded-lg print:text-[10px] print:bg-white">
            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-[9.5px] sm:text-[10px] font-black uppercase text-slate-400 tracking-wider print:text-[9px]">Billed To (Patient)</span>
              <p className="font-bold text-slate-900 text-xs sm:text-sm print:text-xs">{patientName}</p>
              <p className="text-slate-600 text-[11px] sm:text-xs leading-tight print:text-[9.5px]">{addressLine}</p>
              <p className="text-slate-600 text-[11px] sm:text-xs print:text-[9.5px]">Phone: {patientPhone}</p>
              {patientEmail !== 'N/A' && <p className="text-slate-600 text-[11px] sm:text-xs print:text-[9.5px]">Email: {patientEmail}</p>}
            </div>

            <div className="space-y-0.5 sm:space-y-1 sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 print:pt-0">
              <span className="text-[9.5px] sm:text-[10px] font-black uppercase text-slate-400 tracking-wider print:text-[9px]">Invoice Details</span>
              <p className="font-mono font-black text-slate-900 text-xs sm:text-sm print:text-xs">
                INV-{order.orderId || order.id}
              </p>
              <p className="text-slate-600 text-[11px] sm:text-xs print:text-[9.5px]">Date: {invoiceDate}</p>
              <p className="text-slate-600 text-[11px] sm:text-xs print:text-[9.5px]">Payment: <strong className="text-slate-800">{order.paymentMethod || 'Online'}</strong></p>
              <p className="text-slate-600 text-[11px] sm:text-xs print:text-[9.5px]">
                Payment Status:{' '}
                <span className={`font-bold ${order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {order.paymentStatus || 'Paid'}
                </span>
              </p>
            </div>
          </div>

          {/* Remedies Table */}
          <div className="overflow-x-auto border border-slate-200/80 rounded-xl sm:rounded-2xl print:border-slate-300">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-slate-100/90 text-slate-600 border-b border-slate-200 print:bg-slate-100">
                <tr className="text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider print:text-[9px]">
                  <th className="py-2 sm:py-2.5 px-2 sm:px-3 text-center print:py-1 print:px-2">#</th>
                  <th className="py-2 sm:py-2.5 px-2.5 sm:px-4 print:py-1 print:px-2">Remedy Formulation & Potency</th>
                  <th className="py-2 sm:py-2.5 px-2 sm:px-3 text-center print:py-1 print:px-2">Qty</th>
                  <th className="py-2 sm:py-2.5 px-2.5 sm:px-4 text-right print:py-1 print:px-2">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 print:divide-slate-200">
                {items.map((it, idx) => {
                  const qty = Number(it.quantity || it.qty || 1);
                  const price = Number(it.price || it.unitPrice || 0);
                  const lineTotal = qty * price;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2 sm:py-3 px-2 sm:px-3 text-center text-slate-400 font-mono text-[11px] print:py-1 print:px-2 print:text-[9.5px]">{idx + 1}</td>
                      <td className="py-2 sm:py-3 px-2.5 sm:px-4 print:py-1 print:px-2">
                        <p className="font-bold text-slate-900 text-xs leading-tight print:text-[10.5px]">{it.name || it.productName || 'Homeopathic Dilution'}</p>
                        <p className="text-[10px] text-slate-400 print:text-[8.5px]">Standard Clinical Packaging</p>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-3 text-center font-bold text-slate-800 text-xs print:py-1 print:px-2 print:text-[10px]">{qty}</td>
                      <td className="py-2 sm:py-3 px-2.5 sm:px-4 text-right font-black text-slate-900 text-xs whitespace-nowrap print:py-1 print:px-2 print:text-[10px]">
                        ₹{Number(lineTotal).toFixed(2)}
                        {qty > 1 && (
                          <span className="block text-[9.5px] font-normal text-slate-400 print:text-[8.5px]">₹{Number(price).toFixed(2)} each</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary & Signatures */}
          <div className="pt-3 sm:pt-4 border-t-2 border-slate-200 flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-start gap-3 sm:gap-6 font-sans print:pt-2 print:gap-3">
            
            {/* Disclaimer */}
            <div className="space-y-1 sm:space-y-2 text-[11px] sm:text-xs text-slate-500 max-w-sm print:space-y-0.5 print:text-[9.5px]">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                <ShieldCheck className="w-4 h-4 text-brandOrange-500 print:w-3.5 print:h-3.5" />
                <span>Certified Dispensary Seal</span>
              </div>
              <p className="text-[10px] sm:text-[11px] leading-relaxed text-slate-400 print:text-[8.5px]">
                Homeopathic formulations prepared under sterile good-manufacturing practices. Keep away from direct sunlight, camphor, and strong aromatics.
              </p>
            </div>

            {/* Total Box */}
            <div className="w-full sm:w-64 space-y-1.5 text-xs bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/80 print:p-2 print:space-y-0.5 print:text-[10px] print:bg-white print:border-slate-300">
              <div className="flex justify-between text-slate-600 text-[11px] sm:text-xs print:text-[9.5px]">
                <span>Subtotal:</span>
                <span className="font-semibold">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px] sm:text-xs print:text-[9.5px]">
                <span>Dispensary Shipping:</span>
                <span className="text-emerald-600 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-slate-600 text-[11px] sm:text-xs print:text-[9.5px]">
                <span>Applicable GST:</span>
                <span>Included</span>
              </div>
              <div className="pt-1.5 border-t border-slate-200 flex justify-between items-baseline font-black text-sm sm:text-base text-slate-900 font-serif print:pt-1">
                <span>Grand Total:</span>
                <span className="text-brandOrange-600 font-sans text-base sm:text-lg print:text-base">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Doctor Signature / Stamp */}
          <div className="pt-4 sm:pt-6 border-t border-dashed border-slate-200 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-3 sm:gap-0 font-sans text-xs text-center sm:text-left print:pt-2">
            <div className="text-[10px] sm:text-[11px] text-slate-400 print:text-[9px]">
              <p>Generated automatically via Dr. Bharathi's Electronic Medical Dispensary.</p>
              <p>Support: +91 90258 54711 | WhatsApp Dispensary Active</p>
            </div>

            <div className="text-center space-y-1 print:space-y-0.5">
              <div className="w-28 sm:w-32 h-8 sm:h-10 border-b border-slate-400 mx-auto print:h-6 print:w-28" />
              <p className="font-bold text-slate-800 text-[10.5px] sm:text-[11px] print:text-[9.5px]">Authorized Signature / Stamp</p>
              <p className="text-[9.5px] sm:text-[10px] text-slate-400 print:text-[8.5px]">Dr. Bharathi's Homoeo Care</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderInvoiceModal;
