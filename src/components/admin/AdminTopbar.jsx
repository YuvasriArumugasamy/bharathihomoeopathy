import React, { useState } from 'react';
import { Menu, Bell, Search, User, ShieldCheck, CheckCircle2, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminDashboardData } from '../../data/adminDashboardData';

export const AdminTopbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(adminDashboardData.notifications);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      
      {/* Left: Mobile Hamburger & Current Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="text-navy-900 font-bold">Admin Portal</span>
          <span>/</span>
          <span className="text-brandOrange-600 font-bold">Dr. Bharathi’s Homeo Care</span>
        </div>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3">
        
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2.5 rounded-xl text-slate-600 hover:text-navy-900 hover:bg-slate-100 relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brandOrange-500 text-white font-extrabold text-[9px] rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-premium border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-navy-900">Clinic Alerts ({unreadCount})</span>
                <button
                  onClick={markAllRead}
                  className="text-[10px] text-brandOrange-600 hover:underline font-semibold"
                >
                  Mark all read
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-2.5 rounded-xl text-xs space-y-0.5 transition-colors ${
                      notif.unread ? 'bg-brandOrange-50/50 border border-brandOrange-100' : 'bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-navy-900 text-[11px]">{notif.title}</span>
                      <span className="text-[10px] text-slate-400">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{notif.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-navy-900 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-navy-900">{user?.name || 'Administrator'}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Active Session</span>
          </div>
        </div>

      </div>

    </header>
  );
};
