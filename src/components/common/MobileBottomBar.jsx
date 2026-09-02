import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export const MobileBottomBar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const { totalItems } = useCart();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      path: '/',
      icon: 'fa-solid fa-house',
      isExact: true,
    },
    {
      id: 'about',
      label: 'About',
      path: '/about',
      icon: 'fa-solid fa-user-doctor',
    },
    {
      id: 'shop',
      label: 'Shop',
      path: '/shop',
      icon: 'fa-solid fa-store',
    },
    {
      id: 'appointment',
      label: 'Book',
      path: '/appointment',
      icon: 'fa-solid fa-calendar-check',
      isSpecial: true,
    },
    {
      id: 'offers',
      label: 'Offers',
      path: '/offers',
      icon: 'fa-solid fa-fire',
    },
    {
      id: 'contact',
      label: 'Contact',
      path: '/contact',
      icon: 'fa-solid fa-headset',
    },
    {
      id: 'cart',
      label: 'Cart',
      path: '/cart',
      icon: 'fa-solid fa-cart-shopping',
      isCart: true,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-1 sm:px-3 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-lg mx-auto flex items-center justify-between px-1">
        {navItems.map((item) => {
          const isActive = item.isExact
            ? pathname === item.path
            : item.path
            ? pathname.startsWith(item.path)
            : false;

          // 1. Center Elevated Consultation Button
          if (item.isSpecial) {
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group relative flex flex-col items-center -mt-5 focus:outline-none shrink-0"
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white transition-all duration-300 group-active:scale-90 ${
                    isActive
                      ? 'bg-gradient-to-tr from-brandOrange-500 to-amber-500 shadow-brandOrange-500/40 ring-2 ring-brandOrange-400'
                      : 'bg-gradient-to-tr from-[#0b344d] to-[#18587c] shadow-[#0b344d]/30 hover:scale-105'
                  }`}
                >
                  <i className={`${item.icon} text-base`}></i>
                </div>
                <span
                  className={`text-[9px] font-black tracking-tight mt-0.5 transition-colors ${
                    isActive ? 'text-brandOrange-600' : 'text-slate-700'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          // 2. Standard NavLink (Home / About / Shop / Offers / Contact / Cart)
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`group flex flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-xl transition-all duration-200 active:scale-95 shrink-0 ${
                isActive
                  ? 'text-brandOrange-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center relative">
                <i className={`${item.icon} text-sm transition-transform group-hover:scale-110`}></i>
                {isActive && !item.isCart && (
                  <span className="absolute -top-0.5 w-1 h-1 rounded-full bg-brandOrange-500 animate-pulse"></span>
                )}
                {item.isCart && (
                  <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 bg-brandOrange-500 text-white font-extrabold text-[8px] rounded-full flex items-center justify-center shadow-sm animate-bounce">
                    {totalItems}
                  </span>
                )}
              </div>
              <span
                className={`text-[9px] tracking-tighter sm:tracking-tight mt-0.5 ${
                  isActive ? 'font-black text-brandOrange-600' : 'font-bold text-slate-600'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
