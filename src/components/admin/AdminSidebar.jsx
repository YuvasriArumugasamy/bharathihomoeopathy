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
  ShieldCheck, 
  X, 
  ExternalLink,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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
    { name: 'Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-navy-950 text-slate-300 flex flex-col border-r border-navy-900 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-navy-900 shrink-0">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brandOrange-600 to-amber-500 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-white tracking-tight">Dr. Bharathi</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brandOrange-400">Admin Control</span>
            </div>
          </Link>

          <button onClick={onClose} className="lg:hidden p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 px-3 py-1.5 block">
            Management Modules
          </span>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => onClose && onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-smooth ${
                  isActive
                    ? 'bg-brandOrange-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-navy-900'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-navy-900 space-y-2 shrink-0 bg-navy-950">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-navy-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Patient Store</span>
            </span>
            <span className="text-[10px] bg-navy-900 px-1.5 py-0.5 rounded text-brandOrange-400">View</span>
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>
    </>
  );
};
