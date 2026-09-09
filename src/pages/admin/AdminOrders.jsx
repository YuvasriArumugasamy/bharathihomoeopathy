import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Truck, 
  X, 
  Edit,
  IndianRupee,
  PackageCheck,
  AlertCircle,
  Copy,
  ChevronRight,
  ShieldCheck,
  MapPin,
  Calendar
} from 'lucide-react';
import { initialAdminOrders } from '../../data/adminOrdersData';
import { useToast } from '../../context/ToastContext';

export const AdminOrders = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState(initialAdminOrders);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedOrderDrawer, setSelectedOrderDrawer] = useState(null);

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus !== 'All' && o.orderStatus !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return o.orderId.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q);
    }
    return true;
  });

  const handleUpdateStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
    if (selectedOrderDrawer && selectedOrderDrawer.id === orderId) {
      setSelectedOrderDrawer(prev => ({ ...prev, orderStatus: newStatus }));
    }
    showToast(`Order status updated to ${newStatus}`, 'success');
  };

  const handleUpdatePaymentStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: newStatus } : o));
    if (selectedOrderDrawer && selectedOrderDrawer.id === orderId) {
      setSelectedOrderDrawer(prev => ({ ...prev, paymentStatus: newStatus }));
    }
    showToast(`Payment status updated to ${newStatus}`, 'success');
  };

  const copyOrderId = (id) => {
    navigator.clipboard?.writeText(id);
    showToast(`Copied Order ID: ${id}`, 'info');
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingCount = orders.filter(o => o.orderStatus === 'Pending').length;
  const shippedCount = orders.filter(o => o.orderStatus === 'Shipped').length;
  const deliveredCount = orders.filter(o => o.orderStatus === 'Delivered').length;

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. Hero Header Banner */}
      <div className="relative bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brandOrange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brandOrange-50 border border-brandOrange-200 text-brandOrange-700 font-extrabold text-[10px] uppercase tracking-widest shadow-2xs">
              <ShoppingBag className="w-3.5 h-3.5 text-brandOrange-600" />
              Dispensary Fulfillment & Logistics
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
              {orders.length} Total Orders Registered
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
            Orders & Prescription Fulfillment
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl font-medium">
            Monitor dispensary packing pipelines, courier dispatches, customer payment verifications, and delivery updates.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 bg-gradient-to-tr from-[#1F5975] to-[#246582] text-white rounded-2xl shadow-md border border-[#194459] flex items-center gap-2.5">
            <IndianRupee className="w-4 h-4 text-amber-400" />
            <div className="text-left">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Volume Sum</div>
              <div className="text-sm font-black text-white font-display">₹{totalRevenue.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Status Overview KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-sm p-4.5 rounded-2xl border border-amber-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Pending Packaging</div>
            <div className="text-2xl font-black text-slate-900 font-display mt-0.5">{pendingCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-4.5 rounded-2xl border border-indigo-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">With Courier</div>
            <div className="text-2xl font-black text-slate-900 font-display mt-0.5">{shippedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/60 flex items-center justify-center shadow-xs">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-4.5 rounded-2xl border border-emerald-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Delivered</div>
            <div className="text-2xl font-black text-slate-900 font-display mt-0.5">{deliveredCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shadow-xs">
            <PackageCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-4.5 rounded-2xl border border-sky-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Active</div>
            <div className="text-2xl font-black text-slate-900 font-display mt-0.5">{orders.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-200/60 flex items-center justify-center shadow-xs">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Filter & Command Bar */}
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search by Order ID (DEMO-...) or Patient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner font-medium placeholder:text-slate-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedStatus === st
                  ? 'bg-navy-950 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Luxury Orders Table */}
      <div className="bg-white rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/90 text-slate-400 uppercase tracking-wider text-[10px] font-black border-b border-slate-100">
                <th className="py-3.5 px-5">Order ID</th>
                <th className="py-3.5 px-4">Patient Details</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/90">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-3.5 px-5">
                    <button 
                      onClick={() => copyOrderId(ord.orderId)}
                      className="inline-flex items-center gap-1.5 font-mono font-black text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200/80 transition-colors cursor-pointer group-hover:text-brandOrange-600"
                      title="Click to copy Order ID"
                    >
                      <span>{ord.orderId}</span>
                      <Copy className="w-3 h-3 text-slate-400 group-hover:text-brandOrange-500" />
                    </button>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-navy-950 to-slate-800 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {ord.customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 leading-tight">{ord.customer.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{ord.customer.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-medium whitespace-nowrap">
                    {ord.createdAt}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-black text-slate-900 text-sm font-display">
                      ₹{ord.total.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg text-[11px]">
                      {ord.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs ${
                      ord.paymentStatus === 'Paid' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${ord.paymentStatus === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs ${
                      ord.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                      ord.orderStatus === 'Shipped' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' :
                      ord.orderStatus === 'Processing' ? 'bg-purple-50 text-purple-800 border-purple-200' : 
                      'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => setSelectedOrderDrawer(ord)}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 hover:text-navy-950 font-black rounded-xl transition-all cursor-pointer border border-slate-200/70"
                    >
                      <Eye className="w-3.5 h-3.5 text-brandOrange-500" />
                      <span>Details</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Luxury Order Details Drawer */}
      {selectedOrderDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-navy-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in slide-in-from-right duration-300 border-l border-slate-100 flex flex-col justify-between">
            
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black text-brandOrange-600 uppercase tracking-widest block font-display">
                    Prescription & Order Overview
                  </span>
                  <h3 className="font-mono font-black text-xl text-slate-900">{selectedOrderDrawer.orderId}</h3>
                </div>
                <button 
                  onClick={() => setSelectedOrderDrawer(null)} 
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Update Controls */}
              <div className="p-4.5 bg-gradient-to-br from-slate-50 to-orange-50/30 rounded-2xl border border-slate-200/80 space-y-3.5 text-xs">
                <h4 className="font-black text-slate-900 font-display flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Update Fulfillment Pipeline
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Order Status</label>
                    <select
                      value={selectedOrderDrawer.orderStatus}
                      onChange={(e) => handleUpdateStatus(selectedOrderDrawer.id, e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brandOrange-500 shadow-2xs cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Payment Status</label>
                    <select
                      value={selectedOrderDrawer.paymentStatus}
                      onChange={(e) => handleUpdatePaymentStatus(selectedOrderDrawer.id, e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brandOrange-500 shadow-2xs cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Patient Destination */}
              <div className="space-y-2 text-xs">
                <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px] font-display flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brandOrange-600" />
                  Patient Shipping Address
                </h4>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-slate-700">
                  <p className="font-black text-slate-900 text-sm">{selectedOrderDrawer.customer.name}</p>
                  <p className="text-slate-500">{selectedOrderDrawer.customer.phone}</p>
                  <p className="font-medium pt-1">{selectedOrderDrawer.shippingAddress.addressLine1}</p>
                  <p className="font-medium text-slate-500">{selectedOrderDrawer.shippingAddress.city}, {selectedOrderDrawer.shippingAddress.state} - {selectedOrderDrawer.shippingAddress.pincode}</p>
                </div>
              </div>

              {/* Remedy Items */}
              <div className="space-y-2 text-xs">
                <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px] font-display">
                  Prescription Formulations ({selectedOrderDrawer.items.length})
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl p-3 bg-white space-y-1">
                  {selectedOrderDrawer.items.map((it, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between items-center">
                      <div>
                        <p className="font-extrabold text-slate-900">{it.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">SKU: {it.sku} • Qty: {it.quantity}</p>
                      </div>
                      <span className="font-black text-slate-900 text-sm font-display">₹{it.subtotal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Total Footer */}
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm font-extrabold text-slate-900">
              <span className="font-display">Total Amount Payable</span>
              <span className="text-brandOrange-600 text-xl font-black font-display">₹{selectedOrderDrawer.total.toLocaleString()}</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrders;
