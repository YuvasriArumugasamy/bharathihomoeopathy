import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminDashboardData } from '../../data/adminDashboardData';

export const AdminTopbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(adminDashboardData.notifications);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="h-20 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between fixed top-0 right-0 left-0 lg:left-64 z-30 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] transition-all">
      
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


      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3">
        
        {/* Notification Bell */}
        <Link
          to="/admin/notifications"
          className="relative w-10 h-10 rounded-2xl bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50/60 text-slate-600 hover:text-brandOrange-600 border border-slate-200/90 hover:border-orange-300 flex items-center justify-center shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)] hover:shadow-[0_6px_20px_-2px_rgba(249,115,22,0.22)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer group"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="w-5 h-5 text-slate-600 group-hover:text-brandOrange-600 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
          
          {unreadCount > 0 ? (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-brandOrange-600 to-amber-500 text-white font-black text-[10px] rounded-full flex items-center justify-center shadow-md shadow-brandOrange-500/30 ring-2 ring-white animate-pulse">
              {unreadCount}
            </span>
          ) : (
            <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandOrange-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-tr from-brandOrange-500 to-amber-500 ring-2 ring-white" />
            </span>
          )}
        </Link>

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

    </header>
  );
};
