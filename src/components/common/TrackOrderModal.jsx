import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Truck, 
  PackageCheck, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  IndianRupee, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';

export const TrackOrderModal = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [matchedOrder, setMatchedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleTrack = async (e) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      showToast('Please enter your Order ID or registered Phone Number', 'warning');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const orders = await orderService.getAdminOrders();
      const cleanPhone = query.replace(/\D/g, '');
      
      const found = orders.find(o => {
        const id = (o.orderId || o.orderNumber || o.id || '').toLowerCase();
        const oPhone = (o.customer?.phone || o.shippingAddress?.phone || '').replace(/\D/g, '');
        
        const aEmail = (o.customer?.email || o.shippingAddress?.email || o.userEmail || '').toLowerCase();
        if (
          id.includes(query) || 
          (cleanPhone.length >= 6 && oPhone.includes(cleanPhone)) ||
          (query.includes('@') && aEmail.includes(query))
        ) {
          return true;
        }
        return false;
      });

      setMatchedOrder(found || null);
      if (!found) {
        showToast('No active orders found for this Order ID or Phone Number', 'info');
      }
    } catch (err) {
      showToast('Error tracking order: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (status, step) => {
    // Steps: 1: Placed, 2: Confirmed, 3: Shipped, 4: Delivered
    const s = (status || 'Pending').toLowerCase();
    if (s === 'delivered') return 'completed';
    if (s === 'shipped') {
      if (step <= 3) return 'completed';
      return 'pending';
    }
    if (s === 'processing' || s === 'confirmed') {
      if (step <= 2) return 'completed';
      return 'pending';
    }
    // Pending / Placed
    if (step === 1) return 'completed';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-serif">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1F5975] via-[#246582] to-[#1A4B63] p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-amber-300 border border-white/20 shadow-md">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Live Order Tracking
              </h3>
              <p className="text-xs text-white/80 font-medium">
                Enter your Order ID or Phone number for instant shipping updates
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Search Bar */}
          <form onSubmit={handleTrack} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input 
                type="text"
                placeholder="Enter Order ID or Phone Number (e.g. 894123 or 9345865212)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm font-medium focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-3 bg-gradient-to-r from-brandOrange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Tracking...' : 'Track'}</span>
            </button>
          </form>

          {/* Result Card */}
          {matchedOrder ? (
            <div className="space-y-6 animate-fade-in">
              {/* Order Meta Bar */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block text-[11px]">ORDER NUMBER</span>
                  <span className="font-mono font-black text-slate-900 text-sm">{matchedOrder.orderId || matchedOrder.orderNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[11px]">ORDER DATE</span>
                  <span className="font-bold text-slate-800">
                    {matchedOrder.createdAt ? new Date(matchedOrder.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[11px]">CURRENT STATUS</span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    matchedOrder.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                    matchedOrder.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {matchedOrder.orderStatus || 'Processing'}
                  </span>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="py-2">
                <div className="relative flex items-center justify-between">
                  {/* Connecting Line */}
                  <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-slate-200 z-0" />
                  
                  {/* Step 1: Placed */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 mt-2">Order Placed</span>
                  </div>

                  {/* Step 2: Confirmed */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md ${
                      getStepStatus(matchedOrder.orderStatus, 2) === 'completed'
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      <PackageCheck className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 mt-2">Packed</span>
                  </div>

                  {/* Step 3: Shipped */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md ${
                      getStepStatus(matchedOrder.orderStatus, 3) === 'completed'
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 mt-2">In Transit</span>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md ${
                      getStepStatus(matchedOrder.orderStatus, 4) === 'completed'
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 mt-2">Delivered</span>
                  </div>
                </div>
              </div>

              {/* Delivery Details & Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs uppercase mb-1">
                    <MapPin className="w-3.5 h-3.5 text-brandOrange-500" />
                    <span>Delivery Address</span>
                  </div>
                  <p className="font-bold text-slate-800">{matchedOrder.customer?.name || matchedOrder.shippingAddress?.fullName || 'Patient'}</p>
                  <p className="text-slate-600">{matchedOrder.shippingAddress?.addressLine1 || matchedOrder.shippingAddress?.addressLine || matchedOrder.shippingAddress?.street || 'Clinic Dispatch'}</p>
                  <p className="text-slate-600">
                    {matchedOrder.shippingAddress?.city || 'Tamil Nadu'}, {matchedOrder.shippingAddress?.state || 'India'} {matchedOrder.shippingAddress?.postalCode ? `- ${matchedOrder.shippingAddress.postalCode}` : ''}
                  </p>
                  <p className="text-slate-700 font-mono mt-1">📞 {matchedOrder.customer?.phone || matchedOrder.shippingAddress?.phone || '-'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between font-black text-slate-900 text-xs uppercase mb-1">
                    <span>Remedy Items</span>
                    <span className="text-emerald-700">₹{matchedOrder.totalAmount || matchedOrder.total || 0} Total</span>
                  </div>
                  <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                    {(matchedOrder.items || []).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] text-slate-600 border-b border-slate-100 pb-1">
                        <span className="font-medium truncate max-w-[180px]">{item.name || item.title}</span>
                        <span className="font-bold shrink-0">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-1 text-[11px] text-slate-500 font-medium">
                    Payment: <span className="font-bold text-slate-800">{matchedOrder.paymentMethod || 'UPI / Online'}</span> ({matchedOrder.paymentStatus || 'Paid'})
                  </div>
                </div>
              </div>

              {/* Courier & AWB Tracking Card */}
              {(matchedOrder.courier || matchedOrder.trackingNumber) && (
                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200/80 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-sky-950 block">Shipping Partner: {matchedOrder.courier || 'Express Delivery'}</span>
                      {matchedOrder.trackingNumber ? (
                        <span className="font-mono text-slate-600 text-[11px]">AWB Docket: <strong className="text-sky-900">{matchedOrder.trackingNumber}</strong></span>
                      ) : (
                        <span className="text-[10px] text-slate-500">Tracking code will be updated once scanned at courier hub</span>
                      )}
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-sky-100 text-sky-800 text-[10px] font-black uppercase border border-sky-200 shrink-0">
                    {matchedOrder.orderStatus === 'Delivered' ? 'DELIVERED' : 'IN TRANSIT'}
                  </span>
                </div>
              )}

              {/* WhatsApp Help CTA */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
                  <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Have questions regarding your delivery schedule?</span>
                </div>
                <a
                  href={`https://wa.me/919443183388?text=${encodeURIComponent(`Hello Dr. Bharathi Homoeopathy, I would like an update on my order ${matchedOrder.orderId || matchedOrder.orderNumber}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5"
                >
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ) : searched && !loading ? (
            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">No Matching Orders Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Please verify that your Order ID (e.g. ORD-2026-891) or 10-digit mobile number is entered correctly.
              </p>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs space-y-1">
              <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p>Certified Homeopathic Dispensary • Fast Express Delivery Across India</p>
              <p className="text-[11px] text-slate-400">Orders are packed within 24 hours under pharmaceutical standards.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrderModal;
