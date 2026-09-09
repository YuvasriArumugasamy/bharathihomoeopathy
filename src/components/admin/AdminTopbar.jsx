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
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-navy-950 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200/80 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-brandOrange-500 shrink-0" />
            <span className="text-xs font-black text-slate-800 tracking-wide">Admin Portal</span>
          </div>

          <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:block shrink-0" />

          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-sm sm:text-base tracking-tight text-slate-900">
              Dr. Bharathi’s <span className="text-brandOrange-600 font-black">Homeo Care</span>
            </span>

            <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10px] font-extrabold tracking-wide shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ring-2 ring-emerald-200" />
              Live Console
            </span>
          </div>
        </div>
      </div>

      {/* Center: Live Store Quick Link */}
      <div className="hidden md:flex items-center">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-brandOrange-500/10 to-orange-500/10 border border-brandOrange-400/30 text-brandOrange-800 hover:bg-brandOrange-500/20 hover:border-brandOrange-500/50 hover:shadow-xs transition-all text-xs font-black group"
          title="Open Patient Store in new tab"
        >
          <ExternalLink className="w-3.5 h-3.5 text-brandOrange-600 group-hover:scale-110 transition-transform" />
          <span>Patient Store</span>
          <span className="text-[9px] bg-brandOrange-500 text-white font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
            Live
          </span>
        </Link>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3">
        
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setProfileOpen(false);
            }}
            className="p-2.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 hover:text-navy-950 border border-slate-200/70 transition-all duration-200 hover:shadow-sm active:scale-95 relative cursor-pointer group"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5 group-hover:rotate-12 transition-transform duration-200" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-tr from-brandOrange-600 to-amber-500 text-white font-black text-[10px] rounded-full flex items-center justify-center shadow-md ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-black text-navy-950 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-brandOrange-500" />
                  Clinic Alerts ({unreadCount})
                </span>
                <button
                  onClick={markAllRead}
                  className="text-[10px] text-brandOrange-600 hover:underline font-extrabold cursor-pointer"
                >
                  Mark all read
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 [scrollbar-width:thin]">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-2.5 rounded-xl text-xs space-y-0.5 transition-colors ${
                      notif.unread ? 'bg-brandOrange-50/60 border border-brandOrange-200/70 shadow-2xs' : 'bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-navy-950 text-[11px] leading-snug">{notif.title}</span>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{notif.description}</p>
                  </div>
                ))}
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-navy-950 via-slate-900 to-brandOrange-600 text-white font-black text-sm flex items-center justify-center shadow-md border-2 border-brandOrange-400/40 group-hover:border-brandOrange-500 group-hover:scale-105 transition-all">
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
                <Link
                  to="/"
                  target="_blank"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-navy-950 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                  <span>Live Patient Store</span>
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
