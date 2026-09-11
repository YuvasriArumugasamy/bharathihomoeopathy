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
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 sm:w-64 bg-gradient-to-b from-[#0A1724] via-[#0F2438] to-[#07111B] text-white flex flex-col border-r border-white/10 shadow-2xl transition-transform duration-300 ease-out rounded-r-[2rem] lg:rounded-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-5 border-b border-white/10 shrink-0 bg-[#07111B]/60 backdrop-blur-md">
          <Link to="/admin" className="flex items-center gap-3 group min-w-0" onClick={() => onClose && onClose()}>
            <div className="w-11 h-11 rounded-2xl overflow-hidden bg-white p-1 shadow-md shadow-black/20 border border-white/20 ring-2 ring-brandOrange-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
              <img 
                src={assets.logo} 
                alt="Dr. Bharathi Logo" 
                className="w-full h-full object-contain"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
              />
            </div>
            
            <div className="flex flex-col justify-center min-w-0">
              <span className="font-heading font-black text-sm text-white tracking-tight leading-tight truncate">
                Dr. Bharathi’s
              </span>
              <span className="text-[11px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brandOrange-400 via-amber-300 to-amber-200 leading-tight">
                Homeo Care
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/10 border border-white/10 text-[8px] font-black uppercase tracking-wider text-slate-300 shadow-2xs">
                  <ShieldCheck className="w-2.5 h-2.5 text-brandOrange-400" />
                  Admin Portal
                </span>
              </div>
            </div>
          </Link>

          {/* Close Drawer Button (Mobile Only) */}
          <button 
            onClick={onClose} 
            className="lg:hidden w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Menu with Grouped Sections */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <span className="text-[9.5px] font-black uppercase tracking-[0.2em] text-slate-400/90 px-3 py-1 block">
                {section.title}
              </span>

              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white shadow-lg shadow-orange-500/25 border border-white/25'
                        : 'text-slate-300 hover:text-white hover:bg-white/10 hover:translate-x-1'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          isActive 
                            ? 'bg-white/25 text-white shadow-inner' 
                            : 'bg-white/5 text-slate-300 group-hover:text-white group-hover:bg-white/10'
                        }`}>
                          <item.icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate tracking-tight">{item.name}</span>
                      </div>

                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs shrink-0 animate-pulse" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-3.5 border-t border-white/10 space-y-2.5 shrink-0 bg-[#07111B]/80 backdrop-blur-md">
          {/* Quick Doctor Profile Card */}
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white font-black text-xs flex items-center justify-center shadow-md shrink-0 border border-white/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'DB'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black text-white truncate">
                {user?.name || 'Dr. Bharathi'}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                Clinic Administrator
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-300 hover:text-white hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 transition-all active:scale-98 cursor-pointer group"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-rose-400" />
            <span>Sign Out Session</span>
          </button>
        </div>

      </aside>
    </>
  );
};
