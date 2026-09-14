import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  ShoppingBag, 
  Calendar, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  CheckCheck,
  ShieldCheck
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AdminNotifications = () => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const list = [];

    // 1. Orders
    try {
      const rawOrders = localStorage.getItem('admin_orders_store');
      if (rawOrders) {
        const orders = JSON.parse(rawOrders);
        if (Array.isArray(orders)) {
          orders.filter(o => o && (o.orderStatus === 'Pending' || o.status === 'Pending')).slice(0, 4).forEach(o => {
            list.push({
              id: 'notif-ord-' + (o.id || o.orderId || o._id),
              type: 'Order',
              title: `New Order: ${o.orderId || o.orderNumber || 'Pending'}`,
              description: `Patient ${o.customer?.name || o.shippingAddress?.fullName || 'Customer'} placed order of ₹${Number(o.total || 0).toLocaleString('en-IN')}`,
              link: '/admin/orders',
              time: 'Needs Packing / Dispatch',
              priority: 'High'
            });
          });
        }
      }
    } catch (e) {
      console.warn("Could not read orders for notifications", e);
    }

    // 2. Appointments
    try {
      const rawApts = localStorage.getItem('admin_appointments_store');
      if (rawApts) {
        const apts = JSON.parse(rawApts);
        if (Array.isArray(apts)) {
          apts.filter(a => a && a.status === 'Pending').slice(0, 4).forEach(a => {
            list.push({
              id: 'notif-apt-' + (a.id || a.appointmentId || a._id),
              type: 'Appointment',
              title: `Consultation Request: ${a.patient?.name || 'Patient'}`,
              description: `${a.concern || 'Consultation'} on ${a.date || 'Soon'} at ${a.time || 'Scheduled'} (${a.consultationMode || 'In-Clinic'})`,
              link: '/admin/appointments',
              time: 'Awaiting Doctor Confirmation',
              priority: 'High'
            });
          });
        }
      }
    } catch (e) {
      console.warn("Could not read appointments for notifications", e);
    }

    // 3. Enquiries
    try {
      const rawEnqs = localStorage.getItem('admin_enquiries_store');
      if (rawEnqs) {
        const enqs = JSON.parse(rawEnqs);
        if (Array.isArray(enqs)) {
          enqs.filter(e => e && e.status === 'New').slice(0, 3).forEach(e => {
            list.push({
              id: 'notif-enq-' + (e.id || e.enquiryId || e._id),
              type: 'Enquiry',
              title: `New Patient Inquiry: ${e.customer?.name || 'Patient'}`,
              description: e.subject || 'Patient submitted a consultation question via website.',
              link: '/admin/enquiries',
              time: 'Pending Reply',
              priority: 'Medium'
            });
          });
        }
      }
    } catch (e) {
      console.warn("Could not read enquiries for notifications", e);
    }

    // 4. Low stock products
    try {
      const rawProds = localStorage.getItem('admin_products_store');
      if (rawProds) {
        const prods = JSON.parse(rawProds);
        if (Array.isArray(prods)) {
          prods.filter(p => p && (Number(p.stock) || 0) <= (Number(p.lowStockThreshold) || 5)).slice(0, 3).forEach(p => {
            list.push({
              id: 'notif-stock-' + (p.id || p._id),
              type: 'Inventory',
              title: `Low Stock Alert: ${p.name || 'Remedy'}`,
              description: `Only ${p.stock || 0} units left in dispensary (Threshold: ${p.lowStockThreshold || 5})`,
              link: '/admin/inventory',
              time: 'Action Required',
              priority: 'Warning'
            });
          });
        }
      }
    } catch (e) {
      console.warn("Could not read products for notifications", e);
    }

    if (list.length === 0) {
      list.push({
        id: 'notif-welcome',
        type: 'System',
        title: 'System Operational & Certified',
        description: 'Dispensary pipeline, database synchronization, and patient appointment desk are functioning smoothly.',
        link: '/admin',
        time: 'All caught up',
        priority: 'Normal'
      });
    }

    setNotifications(list);
  }, []);

  const filtered = filter === 'All' ? notifications : notifications.filter(n => n.type === filter);

  const handleDismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Notification dismissed', 'info');
  };

  const handleClearAll = () => {
    setNotifications([]);
    showToast('All notifications cleared', 'info');
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Order': return <ShoppingBag className="w-4 h-4 text-brandOrange-600" />;
      case 'Appointment': return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'Enquiry': return <MessageSquare className="w-4 h-4 text-sky-600" />;
      case 'Inventory': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default: return <ShieldCheck className="w-4 h-4 text-teal-600" />;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">Urgent</span>;
      case 'Warning':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">Alert</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">Notice</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12 font-serif">
      
      {/* 1. Hero Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] p-6 sm:p-8 lg:p-9 rounded-[2.25rem] border border-white/30 shadow-2xl shadow-orange-500/20 text-white mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-amber-300/25 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-5 text-center sm:text-left">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-wide font-serif italic text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              Dispensary & Clinic Alerts
            </h1>
            <p className="text-white/90 text-xs sm:text-sm font-sans mt-1">
              Live updates across orders, appointments, customer enquiries and stock
            </p>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2.5 bg-white/90 hover:bg-white text-orange-600 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* 2. Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {['All', 'Order', 'Appointment', 'Enquiry', 'Inventory'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === tab 
                ? 'bg-brandOrange-500 text-white shadow-md shadow-brandOrange-500/20' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Notification Cards List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCheck className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-800 text-sm">No Pending Notifications</h3>
            <p className="text-xs text-slate-400">All alerts in this category have been attended to.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white/95 backdrop-blur-sm p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  {getTypeIcon(item.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-heading font-black text-sm text-slate-900">
                      {item.title}
                    </span>
                    {getPriorityBadge(item.priority)}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {item.description}
                  </p>
                  <span className="inline-block text-[11px] text-brandOrange-600 font-bold font-sans">
                    {item.time}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <Link
                  to={item.link}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-brandOrange-500 text-white text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <span>Open</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => handleDismiss(item.id)}
                  className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-xs font-bold transition-all"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default AdminNotifications;
