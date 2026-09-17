import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  Bell, 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink, 
  Settings, 
  LogOut, 
  CheckCircle2,
  Sparkles,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminDashboardData } from '../../data/adminDashboardData';
import { AdminSpotlightSearchModal } from './AdminSpotlightSearchModal';

export const AdminTopbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [pendingCounts, setPendingCounts] = useState({ orders: 0, appointments: 0, enquiries: 0 });

  useEffect(() => {
    const updateCounts = () => {
      try {
        const rawOrders = localStorage.getItem('admin_orders_store');
        const rawApts = localStorage.getItem('admin_appointments_store');
        const rawEnqs = localStorage.getItem('admin_enquiries_store');
        
        const orders = rawOrders ? JSON.parse(rawOrders) : [];
        const apts = rawApts ? JSON.parse(rawApts) : [];
        const enqs = rawEnqs ? JSON.parse(rawEnqs) : [];

        const pendingOrders = orders.filter(o => (o.orderStatus || o.status) === 'Pending').length;
        const pendingApts = apts.filter(a => a.status === 'Pending').length;
        const pendingEnqs = enqs.filter(e => e.status === 'New').length;

        setPendingCounts({
          orders: pendingOrders,
          appointments: pendingApts,
          enquiries: pendingEnqs
        });
      } catch {
        setPendingCounts({ orders: 1, appointments: 2, enquiries: 1 });
      }
    };

    updateCounts();
    window.addEventListener('storage', updateCounts);
    const interval = setInterval(updateCounts, 8000);
    return () => {
      window.removeEventListener('storage', updateCounts);
      clearInterval(interval);
    };
  }, []);

  const unreadCount = pendingCounts.orders + pendingCounts.appointments + pendingCounts.enquiries;

  return (
    <header 
      style={{ top: 0 }}
      className="h-20 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between fixed top-0 right-0 left-0 lg:left-64 z-30 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] transition-all font-serif"
    >
      
      {/* Left: Mobile Hamburger & Clinic Brand Breadcrumb */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden w-10 h-10 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-navy-950 border border-slate-200/90 flex items-center justify-center shadow-2xs hover:shadow-sm transition-all active:scale-95 cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm sm:text-base tracking-tight text-slate-900">
              Dr. Bharathi’s <span className="text-brandOrange-600 font-black">Homeo Care</span>
            </span>
          </div>
        </div>
      </div>

      {/* Center: Global Clinic Spotlight Search (Ctrl + K) Button */}
      <button
        type="button"
        onClick={() => setSpotlightOpen(true)}
        className="hidden md:flex items-center gap-2.5 px-4 py-2 bg-slate-100 hover:bg-orange-50/70 text-slate-500 hover:text-brandOrange-700 rounded-2xl border border-slate-200/90 hover:border-orange-300 text-xs font-bold transition-all shadow-2xs cursor-pointer group"
        title="Quick Search Patients, Remedies, Orders (Ctrl + K)"
      >
        <Search className="w-4 h-4 text-slate-400 group-hover:text-brandOrange-500 transition-colors" />
        <span className="text-slate-500 group-hover:text-slate-800">Search patients, slots, remedies...</span>
        <kbd className="px-2 py-0.5 text-[10px] font-mono font-bold bg-white text-slate-400 rounded-lg border border-slate-200 shadow-2xs">
          Ctrl + K
        </kbd>
      </button>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3">
        
        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            className="relative w-10 h-10 rounded-2xl bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50/60 text-slate-600 hover:text-brandOrange-600 border border-slate-200/90 hover:border-orange-300 flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)] hover:shadow-[0_6px_20px_-2px_rgba(249,115,22,0.22)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer group"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-600 group-hover:text-brandOrange-600 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
            
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-brandOrange-600 to-amber-500 text-white font-black text-[10px] rounded-full flex items-center justify-center shadow-md shadow-brandOrange-500/30 ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Interactive Notifications Popup Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-3 font-serif">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Live Alerts & Pending</span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-100 text-brandOrange-700">
                  {unreadCount} Actions
                </span>
              </div>

              <div className="space-y-2">
                <Link
                  to="/admin/orders"
                  onClick={() => setNotificationsOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50 border border-slate-100 hover:border-orange-200 transition-colors group"
                >
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-brandOrange-600">Dispensary Orders</div>
                    <div className="text-[11px] text-slate-500">Orders waiting for confirmation</div>
                  </div>
                  <span className="text-xs font-black px-2 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                    {pendingCounts.orders}
                  </span>
                </Link>

                <Link
                  to="/admin/appointments"
                  onClick={() => setNotificationsOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 transition-colors group"
                >
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">Patient Consultations</div>
                    <div className="text-[11px] text-slate-500">Unconfirmed appointments</div>
                  </div>
                  <span className="text-xs font-black px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {pendingCounts.appointments}
                  </span>
                </Link>

                <Link
                  to="/admin/enquiries"
                  onClick={() => setNotificationsOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50 border border-slate-100 hover:border-sky-200 transition-colors group"
                >
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-sky-700">Patient Enquiries</div>
                    <div className="text-[11px] text-slate-500">New messages received</div>
                  </div>
                  <span className="text-xs font-black px-2 py-1 rounded-lg bg-sky-50 text-sky-800 border border-sky-200">
                    {pendingCounts.enquiries}
                  </span>
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-2 text-center">
                <Link
                  to="/admin/notifications"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-black text-brandOrange-600 hover:text-brandOrange-700 flex items-center justify-center gap-1"
                >
                  <span>View Full Notification Log</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill & Dropdown */}
        <div className="relative pl-2 border-l border-slate-200/80">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-3 p-1.5 pl-2 pr-2.5 rounded-2xl hover:bg-slate-100/90 border border-transparent hover:border-slate-200/80 transition-all cursor-pointer group text-left"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white font-black text-sm flex items-center justify-center shadow-md border-2 border-orange-200 group-hover:border-orange-300 group-hover:scale-105 transition-all">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-black text-slate-900 group-hover:text-brandOrange-600 transition-colors leading-tight">
                {user?.name || 'Clinic Administrator'}
              </span>
              <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200 animate-pulse" />
                Active Session
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 hidden md:block ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Interactive Profile Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-2">
              <div className="px-3 py-2.5 bg-gradient-to-br from-slate-50 to-orange-50/50 rounded-xl border border-slate-100">
                <div className="text-xs font-black text-slate-900">{user?.name || 'Clinic Administrator'}</div>
                <div className="text-[11px] text-slate-500 truncate">{user?.email || 'admin@drbharathi.com'}</div>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brandOrange-100 text-brandOrange-800 text-[9px] font-black uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 text-brandOrange-600" />
                  Chief Administrator
                </div>
              </div>
              
              <div className="pt-1 space-y-0.5">
                <Link
                  to="/admin/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-navy-950 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Portal Settings</span>
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-1.5">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Global Spotlight Search Modal (Ctrl + K) */}
      <AdminSpotlightSearchModal
        isOpen={spotlightOpen}
        onClose={() => setSpotlightOpen(false)}
      />

    </header>
  );
};
