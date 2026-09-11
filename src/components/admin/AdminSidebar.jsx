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
  ExternalLink,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import assets from '../../assets';

export const AdminSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
    { name: 'Inventory', path: '/admin/inventory', icon: Boxes },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Offers & Coupons', path: '/admin/offers', icon: Tag },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Blog', path: '/admin/blog', icon: BookOpen },
    { name: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
    { name: 'SEO Management', path: '/admin/seo', icon: Search },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#1F5975]/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-gradient-to-b from-[#1F5975] via-[#246582] to-[#1A4B63] text-white flex flex-col border-r border-[#194459] shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 shrink-0 bg-[#1A4B63]/40">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-white border-2 border-orange-400 shadow-md ring-2 ring-orange-400/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
              <img 
                src={assets.logo} 
                alt="Dr. Bharathi Logo" 
                className="w-full h-full object-cover scale-[1.08] rounded-full"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline font-serif text-[17px] leading-none tracking-normal">
                <span className="text-[#F5A26B] font-bold italic mr-1">Dr.</span>
                <span className="text-white font-black tracking-wide group-hover:text-amber-100 transition-colors drop-shadow-xs">
                  Bharathi
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/25 border border-orange-400/40 text-[8.5px] font-extrabold uppercase tracking-[0.18em] text-white font-display shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                  Admin Control
                </span>
              </div>
            </div>
          </Link>

          <button onClick={onClose} className="lg:hidden p-1 text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu (Scrollbar Hidden) */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/55 px-3 py-1.5 block">
            Management Modules
          </span>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => onClose && onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white shadow-lg shadow-orange-500/35 border border-white/30 scale-[1.02]'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2 shrink-0 bg-[#1A4B63]/60">


          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-200 hover:text-white hover:bg-rose-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>
    </>
  );
};
