import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  Calendar, 
  Loader2, 
  Printer, 
  Download, 
  Send, 
  MessageSquare,
  RotateCcw
} from 'lucide-react';
import { orderService, getStoredOrders } from '../../services/orderService';
import { cloudSyncService } from '../../services/cloudSyncService';
import { useToast } from '../../context/ToastContext';
import { exportToCsv } from '../../utils/exportUtils';
import { sendOrderWhatsApp } from '../../utils/whatsappUtils';
import { OrderInvoiceModal } from '../../components/admin/OrderInvoiceModal';

export const AdminOrders = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState(() => (typeof getStoredOrders === 'function' ? getStoredOrders() : []));
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedOrderDrawer, setSelectedOrderDrawer] = useState(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState(null);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (selectedOrderDrawer || invoiceModalOrder) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedOrderDrawer, invoiceModalOrder]);

  const loadOrders = async (showFeedback = false) => {
    if (showFeedback) setIsRefreshing(true);
    const local = typeof getStoredOrders === 'function' ? getStoredOrders() : [];
    if (Array.isArray(local) && local.length > 0) {
      setOrders(local);
    }

    try {
      const data = await orderService.getAdminOrders();
      if (Array.isArray(data)) {
        setOrders(data);
      }
      if (showFeedback) {
        showToast('Orders synced successfully!', 'success');
      }
    } catch (err) {
      if (showFeedback) {
        showToast('Synced using persistent store', 'info');
      }
    } finally {
      setLoading(false);
      if (showFeedback) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();

    // Periodic live cloud polling every 8s to guarantee cross-device sync
    const pollInterval = setInterval(() => {
      loadOrders(false);
    }, 8000);

    // Real-time Cloud Sync Listener across devices
    const unsubscribe = cloudSyncService.listenToCloudOrders((liveOrders) => {
      if (Array.isArray(liveOrders)) {
        setOrders(liveOrders);
      }
      setLoading(false);
    });

    // Real-time Cross-tab and Local Storage synchronizer
    const handleStorageOrFocus = (e) => {
      if (!e || !e.key || e.key === 'admin_orders_store') {
        const fresh = typeof getStoredOrders === 'function' ? getStoredOrders() : [];
        if (Array.isArray(fresh)) {
          setOrders(fresh);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadOrders();
      }
    };

    window.addEventListener('storage', handleStorageOrFocus);
    window.addEventListener('orders_updated', handleStorageOrFocus);
    window.addEventListener('focus', handleStorageOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(pollInterval);
      if (typeof unsubscribe === 'function') unsubscribe();
      window.removeEventListener('storage', handleStorageOrFocus);
      window.removeEventListener('orders_updated', handleStorageOrFocus);
      window.removeEventListener('focus', handleStorageOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus !== 'All' && o.orderStatus !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (o.orderId || o.orderNumber || '').toLowerCase().includes(q) || (o.customer?.name || '').toLowerCase().includes(q);
    }
    return true;
  });

  const handleUpdateStatus = async (orderId, newStatus) => {
    await orderService.updateAdminOrderStatus(orderId, newStatus);
    setOrders(prev => prev.map(o => (o.id === orderId || o.orderId === orderId || o._id === orderId) ? { ...o, orderStatus: newStatus } : o));
    if (selectedOrderDrawer && (selectedOrderDrawer.id === orderId || selectedOrderDrawer.orderId === orderId)) {
      setSelectedOrderDrawer(prev => ({ ...prev, orderStatus: newStatus }));
    }
    showToast(`Order status updated to ${newStatus} and saved!`, 'success');
  };

  const handleUpdatePaymentStatus = async (orderId, newStatus) => {
    await orderService.updateAdminPaymentStatus(orderId, newStatus);
    setOrders(prev => prev.map(o => (o.id === orderId || o.orderId === orderId || o._id === orderId) ? { ...o, paymentStatus: newStatus } : o));
    if (selectedOrderDrawer && (selectedOrderDrawer.id === orderId || selectedOrderDrawer.orderId === orderId)) {
      setSelectedOrderDrawer(prev => ({ ...prev, paymentStatus: newStatus }));
    }
    showToast(`Payment status updated to ${newStatus} and saved!`, 'success');
  };

  const handleUpdateCourier = (orderId, courier, trackingNumber) => {
    setOrders(prev => prev.map(o => (o.id === orderId || o.orderId === orderId || o._id === orderId) ? { ...o, courier, trackingNumber } : o));
    if (selectedOrderDrawer && (selectedOrderDrawer.id === orderId || selectedOrderDrawer.orderId === orderId)) {
      setSelectedOrderDrawer(prev => ({ ...prev, courier, trackingNumber }));
    }
    try {
      const raw = localStorage.getItem('admin_orders_store');
      if (raw) {
        const parsed = JSON.parse(raw);
        const updated = parsed.map(o => (o.id === orderId || o.orderId === orderId || o._id === orderId) ? { ...o, courier, trackingNumber } : o);
        localStorage.setItem('admin_orders_store', JSON.stringify(updated));
      }
    } catch (err) {
      console.warn("Could not save courier:", err);
    }
  };

  const copyOrderId = (id) => {
    navigator.clipboard?.writeText(id);
    showToast(`Copied Order ID: ${id}`, 'info');
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingCount = orders.filter(o => o.orderStatus === 'Pending').length;
  const shippedCount = orders.filter(o => o.orderStatus === 'Shipped').length;
  const deliveredCount = orders.filter(o => o.orderStatus === 'Delivered').length;

  const handleExportOrders = () => {
    const columns = [
      { label: 'Order ID', accessor: (o) => o.orderId || o.orderNumber || o.id },
      { label: 'Date', accessor: (o) => o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '' },
      { label: 'Patient Name', accessor: (o) => o.customer?.name || o.shippingAddress?.fullName || '' },
      { label: 'Phone', accessor: (o) => o.customer?.phone || o.shippingAddress?.phone || '' },
      { label: 'City', accessor: (o) => o.shippingAddress?.city || o.customer?.city || '' },
      { label: 'State', accessor: (o) => o.shippingAddress?.state || 'Tamil Nadu' },
      { label: 'Total Amount (INR)', accessor: (o) => Number(o.total || 0) },
      { label: 'Payment Method', accessor: (o) => o.paymentMethod || 'Online' },
      { label: 'Payment Status', accessor: (o) => o.paymentStatus || 'Pending' },
      { label: 'Order Status', accessor: (o) => o.orderStatus || 'Pending' },
      { label: 'Courier Partner', accessor: (o) => o.courierPartner || '' },
      { label: 'Tracking Number', accessor: (o) => o.trackingNumber || '' }
    ];
    const ok = exportToCsv('Dispensary_Orders', columns, filteredOrders);
    if (ok) {
      showToast('Dispensary orders exported to Excel / CSV!', 'success');
    } else {
      showToast('No orders available to export', 'warning');
    }
  };

  return (
    <div className="space-y-6 pb-12 font-serif">
      
      {/* 1. Hero Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] p-6 sm:p-8 lg:p-9 rounded-[2.25rem] border border-white/30 shadow-2xl shadow-orange-500/20 text-white mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-amber-300/25 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left w-full">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-wide font-serif italic text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              Orders & Prescription Fulfillment
            </h1>
            <div className="flex items-center gap-2 mt-1.5 justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 text-[11px] font-black uppercase tracking-wider shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                <span>Live Cross-Device Cloud Sync</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
            <button
              type="button"
              onClick={() => loadOrders(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-2xl text-xs font-black backdrop-blur-md border border-white/35 shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95 shrink-0"
              title="Refresh and sync latest orders"
            >
              <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Refresh & Sync'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportOrders}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-navy-950 rounded-2xl text-xs font-black shadow-xl hover:shadow-2xl transition-all cursor-pointer active:scale-95 shrink-0"
              title="Export all orders to Excel CSV file"
            >
              <Download className="w-4 h-4 text-brandOrange-500" />
              <span>Export to Excel (CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Quick Status Overview KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-amber-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Pending Packaging</div>
            <div className="text-2xl font-black text-slate-900 font-display mt-0.5">{pendingCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-indigo-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">With Courier</div>
            <div className="text-2xl font-black text-slate-900 font-display mt-0.5">{shippedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/60 flex items-center justify-center shadow-xs">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-emerald-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Delivered</div>
            <div className="text-2xl font-black text-slate-900 font-display mt-0.5">{deliveredCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shadow-xs">
            <PackageCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-sky-200/80 shadow-sm flex items-center justify-between">
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
            placeholder="Search by Order ID, Phone or Patient name..."
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
                  ? 'bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
          <button
            onClick={handleExportOrders}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black transition-all shadow-xs cursor-pointer ml-auto md:ml-2"
            title="Export orders to Excel / CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4. Luxury Orders Table */}
      <div className="bg-white rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] overflow-hidden">
        <div className="overflow-x-auto hidden md:block">
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
                    <div>
                      <p className="font-extrabold text-slate-900 leading-tight">
                        {ord.customer?.name || ord.shippingAddress?.fullName || ord.guestName || 'Online Patient'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {ord.customer?.phone || ord.shippingAddress?.phone || ord.guestPhone || ''}
                      </p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-medium whitespace-nowrap text-xs">
                    {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'Today'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-black text-slate-900 text-sm font-display">
                      ₹{Number(ord.total ?? ord.totalAmount ?? 0).toLocaleString()}
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
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      <button
                        onClick={(e) => { e.stopPropagation(); setInvoiceModalOrder(ord); }}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-navy-950 rounded-xl transition-all cursor-pointer border border-slate-200/70"
                        title="Print Medical Invoice"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-600" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); sendOrderWhatsApp(ord); }}
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-all cursor-pointer border border-emerald-200/80"
                        title="Send WhatsApp Dispatch Notice"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                      <button
                        onClick={() => setSelectedOrderDrawer(ord)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 hover:text-navy-950 font-black rounded-xl transition-all cursor-pointer border border-slate-200/70 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-brandOrange-500" />
                        <span>Details</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col gap-3.5 p-3.5 sm:p-4 bg-slate-50/60">
          {filteredOrders.map((ord) => (
            <div
              key={ord.id + '-card'}
              onClick={() => setSelectedOrderDrawer(ord)}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_16px_-2px_rgba(15,36,56,0.06)] p-4 flex flex-col gap-3 cursor-pointer active:scale-[0.98] transition-all hover:shadow-md hover:border-orange-300"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <span className="font-mono font-black text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/80">
                  {ord.orderId}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-2xs ${
                    ord.paymentStatus === 'Paid' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${ord.paymentStatus === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    {ord.paymentStatus}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-2xs ${
                    ord.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                    ord.orderStatus === 'Shipped' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' :
                    ord.orderStatus === 'Processing' ? 'bg-purple-50 text-purple-800 border-purple-200' : 
                    'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {ord.orderStatus}
                  </span>
                </div>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="font-extrabold text-slate-900 text-sm">{ord.customer.name}</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{ord.customer.phone}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{ord.createdAt}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-black text-slate-900 text-base font-display block">
                    ₹{ord.total.toLocaleString()}
                  </span>
                  <span className="font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[10px] mt-1 inline-block">
                    {ord.paymentMethod}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-brandOrange-600 font-bold">
                <span className="text-slate-400 text-[11px]">{ord.items?.length || 1} item(s)</span>
                <span className="inline-flex items-center gap-1">
                  View Full Details <Eye className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Luxury Order Details Drawer Portal */}
      {selectedOrderDrawer && typeof document !== 'undefined' && createPortal(
        <div 
          onClick={() => setSelectedOrderDrawer(null)}
          className="fixed inset-0 z-[99999] flex items-stretch justify-end bg-navy-950/65 backdrop-blur-sm animate-in fade-in duration-200"
          style={{ top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', margin: 0, padding: 0 }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg h-full shadow-2xl animate-in slide-in-from-right duration-300 border-l border-slate-100 flex flex-col justify-between overflow-hidden"
          >
            
            {/* Fixed Drawer Header (Never Scrolls Off) */}
            <div className="p-5 sm:p-6 border-b border-slate-100 shrink-0 bg-white flex justify-between items-center z-10">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-brandOrange-600 uppercase tracking-widest block font-display">
                  Prescription & Order Overview
                </span>
                <h3 className="font-mono font-black text-xl text-slate-900">
                  {selectedOrderDrawer.orderId || selectedOrderDrawer.orderNumber}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedOrderDrawer(null)} 
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Drawer Body Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Status Update Controls */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-50 to-orange-50/30 rounded-2xl border border-slate-200/80 space-y-3.5 text-xs">
                <h4 className="font-black text-slate-900 font-display flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Update Fulfillment Pipeline
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Order Status</label>
                    <select
                      value={selectedOrderDrawer.orderStatus || selectedOrderDrawer.status || 'Pending'}
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
                      value={selectedOrderDrawer.paymentStatus || 'Pending'}
                      onChange={(e) => handleUpdatePaymentStatus(selectedOrderDrawer.id, e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-brandOrange-500 shadow-2xs cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                {/* Courier Partner & Tracking AWB */}
                <div className="pt-3 border-t border-slate-200/60 space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Courier Partner</label>
                      <input
                        type="text"
                        value={selectedOrderDrawer.courier || ''}
                        onChange={(e) => handleUpdateCourier(selectedOrderDrawer.id, e.target.value, selectedOrderDrawer.trackingNumber || '')}
                        placeholder="e.g. ST Courier / DTDC"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-brandOrange-500 text-xs shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Tracking / AWB No.</label>
                      <input
                        type="text"
                        value={selectedOrderDrawer.trackingNumber || ''}
                        onChange={(e) => handleUpdateCourier(selectedOrderDrawer.id, selectedOrderDrawer.courier || '', e.target.value)}
                        placeholder="e.g. ST-84920412"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono font-medium text-slate-900 focus:outline-none focus:border-brandOrange-500 text-xs shadow-2xs"
                      />
                    </div>
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
                  <p className="font-black text-slate-900 text-sm">
                    {selectedOrderDrawer.customer?.name || selectedOrderDrawer.shippingAddress?.fullName || selectedOrderDrawer.guestName || 'Online Patient'}
                  </p>
                  <p className="text-slate-500">
                    {selectedOrderDrawer.customer?.phone || selectedOrderDrawer.shippingAddress?.phone || selectedOrderDrawer.guestPhone || ''}
                  </p>
                  <p className="font-medium pt-1">
                    {selectedOrderDrawer.shippingAddress?.addressLine1 || selectedOrderDrawer.shippingAddress?.address || 'Direct Clinic Prescription Delivery'}
                  </p>
                  <p className="font-medium text-slate-500">
                    {selectedOrderDrawer.shippingAddress?.city || ''}
                    {selectedOrderDrawer.shippingAddress?.state ? `, ${selectedOrderDrawer.shippingAddress.state}` : ''}
                    {(selectedOrderDrawer.shippingAddress?.postalCode || selectedOrderDrawer.shippingAddress?.pincode) 
                      ? ` - ${selectedOrderDrawer.shippingAddress?.postalCode || selectedOrderDrawer.shippingAddress?.pincode}` 
                      : ''}
                  </p>
                </div>
              </div>

              {/* Remedy Items */}
              <div className="space-y-2 text-xs">
                <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px] font-display">
                  Prescription Formulations ({selectedOrderDrawer.items?.length || 0})
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl p-3 bg-white space-y-1">
                  {(selectedOrderDrawer.items || []).map((it, idx) => {
                    const itemPrice = Number(it.subtotal ?? it.itemSubtotal ?? (Number(it.price || 0) * Number(it.quantity || 1)) ?? it.price ?? 0);
                    return (
                      <div key={idx} className="py-2.5 flex justify-between items-center">
                        <div>
                          <p className="font-extrabold text-slate-900">{it.name || it.title || 'Classical Homeopathic Remedy'}</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {it.sku ? `SKU: ${it.sku} • ` : ''}Qty: {it.quantity || 1}
                          </p>
                        </div>
                        <span className="font-black text-slate-900 text-sm font-display">
                          ₹{itemPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Total Footer & Quick Actions (Fixed at Bottom) */}
            <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/80 shrink-0 space-y-3 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
              <div className="flex justify-between items-center text-sm font-extrabold text-slate-900">
                <span className="font-display">Total Amount Payable</span>
                <span className="text-brandOrange-600 text-xl font-black font-display">
                  ₹{Number(selectedOrderDrawer.total ?? selectedOrderDrawer.totalAmount ?? 0).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setInvoiceModalOrder(selectedOrderDrawer)}
                  className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-brandOrange-400" />
                  <span>Print Invoice</span>
                </button>

                <button
                  onClick={() => sendOrderWhatsApp(selectedOrderDrawer)}
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send WhatsApp</span>
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* Printable Invoice Modal */}
      <OrderInvoiceModal
        order={invoiceModalOrder}
        isOpen={!!invoiceModalOrder}
        onClose={() => setInvoiceModalOrder(null)}
      />

    </div>
  );
};

export default AdminOrders;
