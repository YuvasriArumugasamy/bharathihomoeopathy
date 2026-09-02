import React, { useState } from 'react';
import { ShoppingBag, Search, Filter, Eye, CheckCircle2, Clock, Truck, X, Edit } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brandOrange-600">Dispensary Fulfillment</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">Orders Management</h1>
          <p className="text-xs text-slate-500">Track prescription packaging, payment verification, and delivery courier statuses.</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search by order ID or patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brandOrange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
        >
          <option value="All">All Order Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-100">
                <th className="py-3 px-4 font-bold">Order ID</th>
                <th className="py-3 px-4 font-bold">Patient</th>
                <th className="py-3 px-4 font-bold">Date</th>
                <th className="py-3 px-4 font-bold">Total</th>
                <th className="py-3 px-4 font-bold">Payment Mode</th>
                <th className="py-3 px-4 font-bold">Payment</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-extrabold text-navy-900">{ord.orderId}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-800">{ord.customer.name}</p>
                    <p className="text-[10px] text-slate-400">{ord.customer.phone}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{ord.createdAt}</td>
                  <td className="py-3 px-4 font-extrabold text-brandOrange-600">₹{ord.total}</td>
                  <td className="py-3 px-4 font-medium text-slate-600">{ord.paymentMethod}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                      ord.orderStatus === 'Shipped' ? 'bg-indigo-100 text-indigo-800' :
                      ord.orderStatus === 'Processing' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrderDrawer(ord)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold rounded-lg transition-smooth"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer */}
      {selectedOrderDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-brandOrange-600 uppercase tracking-widest block">Order Overview</span>
                <h3 className="font-mono font-extrabold text-lg text-navy-900">{selectedOrderDrawer.orderId}</h3>
              </div>
              <button onClick={() => setSelectedOrderDrawer(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Controllers */}
            <div className="p-4 bg-slate-50 rounded-2xl space-y-3 text-xs">
              <h4 className="font-bold text-navy-900">Update Order Fulfillment</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Order Status</label>
                  <select
                    value={selectedOrderDrawer.orderStatus}
                    onChange={(e) => handleUpdateStatus(selectedOrderDrawer.id, e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-navy-900"
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
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Payment Status</label>
                  <select
                    value={selectedOrderDrawer.paymentStatus}
                    onChange={(e) => handleUpdatePaymentStatus(selectedOrderDrawer.id, e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-navy-900"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Patient & Shipping Info */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-navy-900 uppercase tracking-wider text-[11px]">Shipping Destination</h4>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-slate-700">
                <p className="font-bold text-navy-900">{selectedOrderDrawer.customer.name}</p>
                <p>{selectedOrderDrawer.customer.phone}</p>
                <p>{selectedOrderDrawer.shippingAddress.addressLine1}</p>
                <p>{selectedOrderDrawer.shippingAddress.city}, {selectedOrderDrawer.shippingAddress.state} - {selectedOrderDrawer.shippingAddress.pincode}</p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-navy-900 uppercase tracking-wider text-[11px]">Prescription Formulations</h4>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl p-3 bg-white">
                {selectedOrderDrawer.items.map((it, idx) => (
                  <div key={idx} className="py-2 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-navy-900">{it.name}</p>
                      <p className="text-[10px] text-slate-400">SKU: {it.sku} • Qty: {it.quantity}</p>
                    </div>
                    <span className="font-bold text-slate-800">₹{it.subtotal}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm font-extrabold text-navy-900">
              <span>Grand Total</span>
              <span className="text-brandOrange-600 text-base">₹{selectedOrderDrawer.total}</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
