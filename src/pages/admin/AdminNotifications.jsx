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
import { 
  getAdminNotifications, 
  markAllNotificationsAsSeen, 
  dismissNotification, 
  clearAllNotifications 
} from '../../services/adminNotificationService';

export const AdminNotifications = () => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('All');
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  const loadNotifications = () => {
    markAllNotificationsAsSeen();
    const list = getAdminNotifications();
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
  };

  useEffect(() => {
    loadNotifications();

    const handleUpdate = () => {
      const list = getAdminNotifications();
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
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('admin_notifications_updated', handleUpdate);
    window.addEventListener('orders_updated', handleUpdate);
    window.addEventListener('appointments_updated', handleUpdate);
    window.addEventListener('enquiries_updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('admin_notifications_updated', handleUpdate);
      window.removeEventListener('orders_updated', handleUpdate);
      window.removeEventListener('appointments_updated', handleUpdate);
      window.removeEventListener('enquiries_updated', handleUpdate);
    };
  }, []);

  const filtered = filter === 'All' ? notifications : notifications.filter(n => n.type === filter);

  const handleDismiss = (id) => {
    if (id === 'notif-welcome') {
      setNotifications([]);
      return;
    }
    dismissNotification(id);
    showToast('Notification dismissed', 'info');
  };

  const handleClearAll = () => {
    setShowClearConfirmModal(true);
  };

  const confirmClearAll = () => {
    clearAllNotifications();
    setNotifications([]);
    setShowClearConfirmModal(false);
    showToast('All notifications cleared', 'success');
  };

  const cancelClearAll = () => {
    setShowClearConfirmModal(false);
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
      
      {/* Clear Confirmation Modal */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-200">
            
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/25">
              <AlertTriangle className="w-8 h-8 text-white stroke-[2.5]" />
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-slate-900 font-heading">
                Clear All Notifications?
              </h3>
              <p className="text-sm text-slate-600 font-sans leading-relaxed">
                நீங்க எல்லா notifications-யும் clear பண்ண போறீங்க. இது permanent action - மறுபடி வராது!
              </p>
              <p className="text-xs text-amber-600 font-bold bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 inline-block">
                ⚠️ This action cannot be undone
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={cancelClearAll}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearAll}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-sm shadow-lg shadow-rose-500/25 transition-all"
              >
                Yes, Clear All
              </button>
            </div>

          </div>
        </div>
      )}

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
