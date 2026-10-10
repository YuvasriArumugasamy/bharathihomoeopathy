import React, { useState, useEffect, useRef } from 'react';
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
  Search,
  ShoppingBag,
  Calendar,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  getCategoryCounts, 
  getUnreadNotificationCount, 
  markAllNotificationsAsSeen 
} from '../../services/adminNotificationService';
import { AdminSpotlightSearchModal } from './AdminSpotlightSearchModal';
import { assets } from '../../assets';

export const AdminTopbar = ({ onToggleSidebar }) => {
  const { user, adminUser, logout } = useAuth();
  const currentAdmin = adminUser || (user?.role === 'admin' ? user : null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const topbarRef = useRef(null);
  const [categoryCounts, setCategoryCounts] = useState({
    orders: 0,
    appointments: 0,
    enquiries: 0,
    inventory: 0,
    totalPending: 0
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (topbarRef.current && !topbarRef.current.contains(event.target)) {
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const updateStats = () => {
      try {
        const counts = getCategoryCounts();
        const unread = getUnreadNotificationCount();
        setCategoryCounts(counts);
        setUnreadCount(unread);
      } catch (e) {
        console.warn('Error updating notifications in topbar:', e);
      }
    };

    updateStats();
    window.addEventListener('storage', updateStats);
    window.addEventListener('orders_updated', updateStats);
    window.addEventListener('appointments_updated', updateStats);
    window.addEventListener('enquiries_updated', updateStats);
    window.addEventListener('admin_notifications_updated', updateStats);
    window.addEventListener('notifications_visited', updateStats);

    const interval = setInterval(updateStats, 5000);
    return () => {
      window.removeEventListener('storage', updateStats);
      window.removeEventListener('orders_updated', updateStats);
      window.removeEventListener('appointments_updated', updateStats);
      window.removeEventListener('enquiries_updated', updateStats);
      window.removeEventListener('admin_notifications_updated', updateStats);
      window.removeEventListener('notifications_visited', updateStats);
      clearInterval(interval);
    };
  }, []);

  const handleBellClick = () => {
    const nextState = !notificationsOpen;
    setNotificationsOpen(nextState);
    setProfileOpen(false);

    // Once viewed, clear badge permanently until a new real action arrives
    if (nextState) {
      markAllNotificationsAsSeen();
      setUnreadCount(0);
    }
  };

  return (
    <header 
      ref={topbarRef}
      className="h-20 bg-white border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs transition-all font-serif"
    >
      
      {/* Left: Mobile Hamburger & Clinic Brand */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden w-10 h-10 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-navy-950 border border-slate-200/90 flex items-center justify-center shadow-2xs hover:shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/admin" className="flex items-center gap-2 group">
          <div className="flex flex-col leading-none">
            <span className="font-serif font-black text-sm sm:text-base tracking-tight text-slate-900 whitespace-nowrap">
              <span className="text-amber-500 italic">Dr. </span>Bharathi's
            </span>
            <span className="text-[8.5px] sm:text-[9.5px] font-serif tracking-[0.18em] text-brandOrange-600 font-extrabold uppercase mt-0.5 whitespace-nowrap">
              HOMEO CARE
            </span>
          </div>
        </Link>
      </div>

      {/* Center: Global Clinic Spotlight Search Button */}
      <button
        type="button"
        onClick={() => setSpotlightOpen(true)}
        className="hidden md:flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-orange-50/70 text-slate-500 hover:text-brandOrange-700 rounded-xl border border-slate-200/90 hover:border-orange-300 text-xs font-semibold transition-all shadow-2xs cursor-pointer group max-w-xs lg:max-w-md w-full mx-4"
        title="Search Patients, Remedies, Orders"
      >
        <Search className="w-4 h-4 text-slate-400 group-hover:text-brandOrange-500 transition-colors shrink-0" />
        <span className="text-slate-500 group-hover:text-slate-800 text-xs truncate whitespace-nowrap">Search patients, slots, remedies...</span>
      </button>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3">
        
        {(notificationsOpen || profileOpen) && (
          <div 
            className="fixed inset-0 bg-slate-900/10 backdrop-blur-[1px] z-40 sm:hidden"
            onClick={() => {
              setNotificationsOpen(false);
              setProfileOpen(false);
            }}
          />
        )}
        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={handleBellClick}
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
            <div className="fixed top-20 right-3 left-3 sm:absolute sm:top-full sm:right-0 sm:left-auto sm:mt-2.5 w-auto sm:w-[380px] md:w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-3 font-sans">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider whitespace-nowrap">Live Alerts & Pending</span>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                  categoryCounts.totalPending > 0 ? 'bg-orange-100 text-brandOrange-700' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {categoryCounts.totalPending} {categoryCounts.totalPending === 1 ? 'Action' : 'Actions'}
                </span>
              </div>

              {categoryCounts.totalPending === 0 ? (
                <div className="py-6 px-3 text-center space-y-2 bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-black text-slate-800">All Caught Up!</div>
                  <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                    No pending orders, unconfirmed consultations, or patient messages.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/admin/orders"
                    onClick={() => setNotificationsOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50/80 border border-slate-100 hover:border-orange-200 transition-colors group gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/60 group-hover:scale-105 transition-transform">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div className="text-left min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-800 group-hover:text-brandOrange-600 transition-colors truncate">Dispensary Orders</div>
                        <div className="text-[11px] text-slate-500 truncate">Orders waiting for confirmation</div>
                      </div>
                    </div>
                    <span className={`text-xs font-black min-w-[28px] text-center px-2 py-1 rounded-lg border shrink-0 ${
                      categoryCounts.orders > 0 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      {categoryCounts.orders}
                    </span>
                  </Link>

                  <Link
                    to="/admin/appointments"
                    onClick={() => setNotificationsOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/80 border border-slate-100 hover:border-emerald-200 transition-colors group gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60 group-hover:scale-105 transition-transform">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="text-left min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors truncate">Patient Consultations</div>
                        <div className="text-[11px] text-slate-500 truncate">Unconfirmed appointments</div>
                      </div>
                    </div>
                    <span className={`text-xs font-black min-w-[28px] text-center px-2 py-1 rounded-lg border shrink-0 ${
                      categoryCounts.appointments > 0 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      {categoryCounts.appointments}
                    </span>
                  </Link>

                  <Link
                    to="/admin/enquiries"
                    onClick={() => setNotificationsOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50/80 border border-slate-100 hover:border-sky-200 transition-colors group gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-200/60 group-hover:scale-105 transition-transform">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="text-left min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-800 group-hover:text-sky-700 transition-colors truncate">Patient Enquiries</div>
                        <div className="text-[11px] text-slate-500 truncate">New messages received</div>
                      </div>
                    </div>
                    <span className={`text-xs font-black min-w-[28px] text-center px-2 py-1 rounded-lg border shrink-0 ${
                      categoryCounts.enquiries > 0 ? 'bg-sky-50 text-sky-800 border-sky-200' : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      {categoryCounts.enquiries}
                    </span>
                  </Link>

                  {categoryCounts.inventory > 0 && (
                    <Link
                      to="/admin/inventory"
                      onClick={() => setNotificationsOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50/80 border border-slate-100 hover:border-rose-200 transition-colors group gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200/60 group-hover:scale-105 transition-transform">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div className="text-left min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-800 group-hover:text-rose-700 transition-colors truncate">Low Stock Remedies</div>
                          <div className="text-[11px] text-slate-500 truncate">Items below dispensary threshold</div>
                        </div>
                      </div>
                      <span className="text-xs font-black min-w-[28px] text-center px-2 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 shrink-0">
                        {categoryCounts.inventory}
                      </span>
                    </Link>
                  )}
                </div>
              )}

              <div className="border-t border-slate-100 pt-2 text-center">
                <Link
                  to="/admin/notifications"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-black text-brandOrange-600 hover:text-brandOrange-700 flex items-center justify-center gap-1 py-1"
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
              {currentAdmin?.name ? currentAdmin.name.charAt(0).toUpperCase() : 'C'}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-black text-slate-900 group-hover:text-brandOrange-600 transition-colors leading-tight">
                {currentAdmin?.name || 'Clinic Administrator'}
              </span>
              <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200 animate-pulse" />
                Active Session
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 hidden lg:block ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Interactive Profile Dropdown Menu */}
          {profileOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-2">
              <div className="px-3 py-2.5 bg-gradient-to-br from-slate-50 to-orange-50/50 rounded-xl border border-slate-100">
                <div className="text-xs font-black text-slate-900">{currentAdmin?.name || 'Clinic Administrator'}</div>
                <div className="text-[11px] text-slate-500 truncate">{currentAdmin?.email || 'admin@drbharathi.com'}</div>
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
                    logout('admin');
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



