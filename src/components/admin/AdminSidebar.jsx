import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag, 
  Users, 
  Calendar, 
  Boxes, 
  CreditCard, 
  Tag, 
  Star, 
  BookOpen, 
  MessageSquare, 
  Search, 
  Settings,
  Bell, 
  ShieldCheck, 
  X, 
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import assets from '../../assets';

export const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();

  const navSections = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
      ]
    },
    {
      title: 'Dispensary & Orders',
      items: [
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Categories', path: '/admin/categories', icon: Layers },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
        { name: 'Customers', path: '/admin/customers', icon: Users },
        { name: 'Inventory', path: '/admin/inventory', icon: Boxes },
        { name: 'Payments', path: '/admin/payments', icon: CreditCard },
      ]
    },
    {
      title: 'Patient Care',
      items: [
        { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
        { name: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
        { name: 'Reviews', path: '/admin/reviews', icon: Star },
      ]
    },
    {
      title: 'Marketing & Portal',
      items: [
        { name: 'Offers & Coupons', path: '/admin/offers', icon: Tag },
        { name: 'Blog', path: '/admin/blog', icon: BookOpen },
        { name: 'SEO Management', path: '/admin/seo', icon: Search },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
        { name: 'Notifications', path: '/admin/notifications', icon: Bell }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#143d52]/80 backdrop-blur-md lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-full lg:w-64 bg-gradient-to-b from-[#1F5975] via-[#246582] to-[#1A4B63] text-white flex flex-col border-r border-[#194459] shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-5 sm:px-6 border-b border-white/15 shrink-0 bg-[#1A4B63]/80 backdrop-blur-md">
          <Link to="/admin" className="flex items-center gap-3.5 group min-w-0" onClick={() => onClose && onClose()}>
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-brandOrange-400 shadow-lg ring-2 ring-brandOrange-400/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
              <img 
                src={assets.logo} 
                alt="Dr. Bharathi Logo" 
                className="w-full h-full object-cover scale-[1.08] rounded-full"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
              />
            </div>
            
            <div className="flex flex-col justify-center min-w-0">
              <span className="font-heading font-black text-base sm:text-lg text-white tracking-tight leading-tight truncate drop-shadow-xs">
                Dr. Bharathi’s
              </span>
              <span className="text-xs sm:text-sm font-black text-amber-300 tracking-wide leading-tight drop-shadow-xs">
                Homeo Care
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/15 border border-white/20 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
                  <ShieldCheck className="w-3 h-3 text-amber-300" />
                  Admin Portal
                </span>
              </div>
            </div>
          </Link>

          {/* Close Drawer Button (Mobile Only) */}
          <button 
            onClick={onClose} 
            className="lg:hidden w-10 h-10 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0 shadow-sm"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Navigation Menu with Grouped Sections */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] text-amber-300 px-3 py-1.5 block drop-shadow-xs">
                {section.title}
              </span>

              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3.5 py-2.5 sm:py-3 rounded-2xl text-sm font-extrabold tracking-wide transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white shadow-xl shadow-orange-500/35 border border-white/40'
                        : 'text-white hover:text-white hover:bg-white/15 hover:translate-x-1'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          isActive 
                            ? 'bg-white/30 text-white shadow-inner' 
                            : 'bg-white/15 text-white group-hover:bg-white/25'
                        }`}>
                          <item.icon className="w-4 h-4 stroke-[2.4]" />
                        </div>
                        <span className="truncate text-[13.5px] sm:text-sm font-extrabold text-white tracking-wide drop-shadow-xs">
                          {item.name}
                        </span>
                      </div>

                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-white shadow-sm shrink-0 animate-pulse" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/15 space-y-3 shrink-0 bg-[#1A4B63]/90 backdrop-blur-md">
          {/* Quick Doctor Profile Card */}
          <div className="flex items-center gap-3.5 p-2.5 rounded-2xl bg-white/15 border border-white/20 shadow-sm">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white font-black text-sm flex items-center justify-center shadow-md shrink-0 border border-white/30">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'DB'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-black text-white truncate drop-shadow-xs">
                {user?.name || 'Dr. Bharathi'}
              </span>
              <span className="text-xs text-emerald-300 font-black flex items-center gap-1.5 mt-0.5 drop-shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0 ring-2 ring-emerald-400/40" />
                Clinic Administrator
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-black text-rose-100 hover:text-white bg-rose-500/25 hover:bg-rose-500/35 border border-rose-400/40 hover:border-rose-400/60 transition-all active:scale-98 cursor-pointer group shadow-sm"
          >
            <LogOut className="w-4.5 h-4.5 group-hover:-translate-x-0.5 transition-transform text-rose-200" />
            <span>Sign Out Session</span>
          </button>
        </div>

      </aside>
    </>
  );
};
