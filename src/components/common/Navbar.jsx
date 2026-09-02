import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  User, 
  Heart, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight,
  LogOut,
  Globe2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { GoogleTranslate } from './GoogleTranslate';
import { assets } from '../../assets';
import { demoProducts } from '../../data/products';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { totalItems } = useCart();
  const { totalWishlist } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userCountry, setUserCountry] = useState(localStorage.getItem('user_country') || 'India');

  React.useEffect(() => {
    const handleStorageChange = () => {
      setUserCountry(localStorage.getItem('user_country') || 'India');
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('country_changed', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('country_changed', handleStorageChange);
    }
  }, []);

  React.useEffect(() => {
    const handleToggle = () => setMobileMenuOpen((prev) => !prev);
    const handleOpen = () => setMobileMenuOpen(true);
    const handleClose = () => setMobileMenuOpen(false);

    window.addEventListener('toggle-mobile-menu', handleToggle);
    window.addEventListener('open-mobile-menu', handleOpen);
    window.addEventListener('close-mobile-menu', handleClose);

    return () => {
      window.removeEventListener('toggle-mobile-menu', handleToggle);
      window.removeEventListener('open-mobile-menu', handleOpen);
      window.removeEventListener('close-mobile-menu', handleClose);
    };
  }, []);

  const categories = [
    'Homeopathy Medicines',
    'Mother Tinctures',
    'Biochemic Medicines',
    'Herbal Products',
    'Personal Care',
    'Combo Offers',
    'Health Conditions'
  ];

  // Real-time live suggestions
  const searchSuggestions = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return demoProducts.filter((p) => {
      const matchCat = selectedCategory === 'All Categories' || p.category === selectedCategory;
      const matchText = p.name.toLowerCase().includes(q) || 
                        (p.category && p.category.toLowerCase().includes(q)) ||
                        (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
                        (p.brand && p.brand.toLowerCase().includes(q));
      return matchCat && matchText;
    }).slice(0, 6);
  }, [searchQuery, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault?.();
    setSearchFocused(false);
    if (searchQuery.trim()) {
      const catParam = selectedCategory !== 'All Categories' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}${catParam}`);
    } else if (selectedCategory !== 'All Categories') {
      navigate(`/shop?category=${encodeURIComponent(selectedCategory)}`);
    } else {
      navigate('/shop');
    }
  };

  const navLinks = [
    { name: 'HOME', path: '/', icon: 'fa-solid fa-house', color: 'text-brandOrange-500', bg: 'bg-orange-50', badge: null },
    { name: 'ABOUT US', path: '/about', icon: 'fa-solid fa-user-doctor', color: 'text-sky-500', bg: 'bg-sky-50', badge: null },
    { name: 'SHOP', path: '/shop', icon: 'fa-solid fa-bag-shopping', color: 'text-emerald-500', bg: 'bg-emerald-50', badge: null },
    { name: 'OFFERS', path: '/offers', icon: 'fa-solid fa-fire', color: 'text-rose-500', bg: 'bg-rose-50', badge: 'HOT' },
    { name: 'APPOINTMENT', path: '/appointment', icon: 'fa-solid fa-calendar-check', color: 'text-teal-500', bg: 'bg-teal-50', badge: null },
    { name: 'CONTACT US', path: '/contact', icon: 'fa-solid fa-headset', color: 'text-indigo-500', bg: 'bg-indigo-50', badge: null }
  ];

  return (
    <div className="bg-white w-full sticky top-0 z-50">
      
      {/* 1. Main Header: Logo + Search + Action Icons */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo with exact uploaded circular logo.jpeg */}
        <Link 
          to="/" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="flex items-center gap-1.5 sm:gap-3 shrink-0 group min-w-0"
        >
          <div className="w-9 h-9 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden shadow-md bg-white border-2 border-brandOrange-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 ring-1 sm:ring-2 ring-brandOrange-100">
            <img
              src={assets.logo}
              alt="Dr Bharathi's Homeo Care Logo"
              className="w-full h-full object-cover scale-[1.08] rounded-full"
              style={{ imageRendering: '-webkit-optimize-contrast' }}
            />
          </div>
          <div className="flex flex-col min-w-0 items-center justify-center pt-0.5">
            <div className="text-base sm:text-2xl lg:text-[28px] font-serif tracking-tight leading-none mb-0.5 sm:mb-1">
              <span className="text-[#c26839]">Dr</span>
              <span className="text-[#0f3e5c] ml-1 sm:ml-1.5 font-bold">Bharathi's</span>
            </div>
            
            <div className="w-full h-[1.5px] flex">
              <div className="h-full bg-[#0f3e5c] w-[75%]"></div>
              <div className="h-full bg-[#c26839] w-[25%]"></div>
            </div>

            <div className="flex items-center justify-center w-full mt-0.5 sm:mt-1 gap-1 sm:gap-2">
              <div className="h-[1px] bg-[#c26839] w-2 sm:w-4"></div>
              <div className="w-[2px] h-[2px] sm:w-1 sm:h-1 rounded-full bg-[#c26839]"></div>
              <span className="text-[7px] sm:text-[9.5px] font-bold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-[#0f3e5c]">
                HOMEO CARE
              </span>
              <div className="w-[2px] h-[2px] sm:w-1 sm:h-1 rounded-full bg-[#c26839]"></div>
              <div className="h-[1px] bg-[#c26839] w-2 sm:w-4"></div>
            </div>
          </div>
        </Link>

        {/* Center: Desktop Search Bar with Live Suggestions & Orange Button */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-2xl mx-6 relative items-center border-2 border-brandOrange-500/80 rounded-2xl overflow-visible bg-white shadow-sm focus-within:ring-2 focus-within:ring-brandOrange-400">
          
          {/* Search Input */}
          <div className="flex-1 relative flex items-center pl-4 pr-2">
            <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
            <input
              type="text"
              placeholder={location.pathname === '/blog' ? 'Search for articles, tips, remedies...' : 'Search for homeopathic remedies, tinctures, tonics...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
              className="w-full py-2.5 text-xs text-slate-800 font-medium placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-slate-400 hover:text-slate-600 mr-1 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Orange Submit Button */}
          <button
            type="submit"
            aria-label="Search"
            className="h-10 px-5 bg-gradient-to-r from-brandOrange-500 to-brandOrange-600 hover:from-brandOrange-600 hover:to-brandOrange-700 text-white flex items-center justify-center transition-all shrink-0 rounded-r-xl font-bold cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Instant Live Autocomplete Dropdown */}
          {searchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 z-50 max-h-96 overflow-y-auto divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150">
              {searchSuggestions.length > 0 ? (
                <>
                  <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between bg-slate-50/70">
                    <span>Matching Dispensary Products</span>
                    <span>{searchSuggestions.length} items</span>
                  </div>
                  {searchSuggestions.map((prod) => (
                    <Link
                      key={prod.id}
                      to={`/product/${prod.id}`}
                      onClick={() => setSearchFocused(false)}
                      className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-orange-50/60 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                          <img src={prod.image} alt={prod.name} className="w-full h-full object-contain mix-blend-multiply" />
                        </div>
                        <div>
                          <h5 className="font-extrabold text-xs text-slate-900 group-hover:text-brandOrange-600 transition-colors line-clamp-1">
                            {prod.name}
                          </h5>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {prod.category} • {prod.size || 'Dispensary'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-black text-xs text-navy-950">
                          ₹{prod.salePrice || prod.price}
                        </span>
                      </div>
                    </Link>
                  ))}
                  <button
                    type="submit"
                    className="w-full text-center py-2.5 text-xs font-bold text-brandOrange-600 hover:bg-brandOrange-50 transition-colors flex items-center justify-center gap-1.5 bg-slate-50/50"
                  >
                    <span>View all results for "{searchQuery}"</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="px-4 py-6 text-center text-xs text-slate-500">
                  <p className="font-bold text-slate-700">No products found for "{searchQuery}"</p>
                  <p className="text-[11px] text-slate-400 mt-1">Try searching with generic names (e.g. Arnica, Alfalfa, Nux Vomica, Tonic)</p>
                </div>
              )}
            </div>
          )}
        </form>

        {/* Right Actions: Account, Wishlist, Cart + Mobile Search Icon + Language */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 text-slate-700 shrink-0">
          
          <div className="block">
            <GoogleTranslate />
          </div>
          
          {/* Mobile Search Toggle Icon */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="lg:hidden w-8 h-8 rounded-full bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-brandOrange-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Toggle Search"
          >
            {mobileSearchOpen ? <X className="w-4 h-4 text-brandOrange-600" /> : <Search className="w-4 h-4" />}
          </button>

          {/* Account Button */}
          <div className="relative">
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  openAuthModal('register');
                } else {
                  setAccountMenuOpen(!accountMenuOpen);
                }
              }}
              className="flex items-center gap-1.5 sm:gap-2 text-left hover:text-brandOrange-600 transition-colors cursor-pointer"
              aria-label="Patient Account"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden sm:flex flex-col text-xs leading-tight">
                <span className="font-bold text-navy-950">
                  {isAuthenticated ? (user?.name || 'My Account') : 'My Account'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {isAuthenticated ? 'Patient Profile' : 'Login / Register'}
                </span>
              </div>
            </button>

            {accountMenuOpen && isAuthenticated && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 space-y-1">
                <div className="p-2 border-b border-slate-100 text-xs">
                  <p className="font-bold text-navy-950 truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                </div>
                <Link
                  to="/my-account"
                  onClick={() => setAccountMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-brandOrange-50 hover:text-brandOrange-600"
                >
                  Patient Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setAccountMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-xs font-bold text-brandOrange-600 bg-brandOrange-50/50 hover:bg-brandOrange-100"
                  >
                    Admin Control Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setAccountMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Wishlist Link with Live Counter Badge in Solid Vibrant Red */}
          <Link
            to="/wishlist"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 group text-slate-700 hover:text-rose-600 transition-colors"
            aria-label="Wishlist"
          >
            <div className="relative flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500 group-hover:text-rose-600 group-hover:fill-rose-600 group-hover:scale-110 transition-all duration-200" />
              {totalWishlist > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-navy-950 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center shadow-sm animate-in zoom-in ring-2 ring-white">
                  {totalWishlist}
                </span>
              )}
            </div>
            <span className="hidden md:inline text-xs font-bold group-hover:text-rose-600 transition-colors">Wishlist</span>
          </Link>

          {/* Cart with Orange Counter (Hidden on Mobile) */}
          <Link
            to="/cart"
            className="hidden lg:flex items-center gap-2 group text-slate-700 hover:text-brandOrange-600 transition-colors"
            aria-label="Shopping Cart"
          >
            <div className="relative flex items-center justify-center">
              <i className="fa-solid fa-cart-shopping text-lg text-slate-700 group-hover:text-brandOrange-600 transition-colors"></i>
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-brandOrange-500 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center shadow-sm animate-bounce">
                {totalItems}
              </span>
            </div>
            <span className="hidden md:inline text-xs font-bold">Cart</span>
          </Link>

        </div>

      </div>

      {/* Mobile Expandable Search Bar (Visible only when search icon is tapped) */}
      {mobileSearchOpen && (
        <div className="lg:hidden px-3 pb-2.5 pt-0 animate-in slide-in-from-top-2 duration-200">
          <form 
            onSubmit={(e) => {
              handleSearchSubmit(e);
              setMobileSearchOpen(false);
            }}
            className="flex items-center border-2 border-brandOrange-500 rounded-xl overflow-hidden bg-white shadow-md focus-within:ring-2 focus-within:ring-brandOrange-400/20"
          >
            <input
              type="text"
              autoFocus
              placeholder={location.pathname === '/blog' ? 'Search health tips...' : 'Search remedies, tinctures...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600"
                aria-label="Clear"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-brandOrange-500 hover:bg-brandOrange-600 text-white flex items-center justify-center shrink-0 font-bold text-xs"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* 2. Subnav Bar: Rich Medical Teal Gradient Bar with Capsule Links & Badges */}
      <div className="hidden md:block bg-gradient-to-r from-[#0b344d] via-[#18587c] to-[#0b344d] text-white shadow-xl border-t border-white/10 border-b border-amber-400/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 flex items-center justify-center py-1.5 overflow-x-auto no-scrollbar">
          
          {/* Main Navigation Links with Pill/Capsule active states */}
          <nav className="flex items-center space-x-1 md:space-x-1.5 lg:space-x-3 text-[11px] lg:text-[12px] font-extrabold tracking-wider uppercase shrink-0 whitespace-nowrap">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-2 relative group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white shadow-md shadow-orange-500/35 font-black scale-[1.02]'
                      : 'text-slate-100 hover:text-amber-300 hover:bg-white/10'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <i className={`${link.icon} text-xs transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-amber-300/80 group-hover:text-amber-300'}`}></i>
                    <span className={isActive ? 'text-white drop-shadow-xs' : ''}>{link.name}</span>
                    {link.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter shadow-xs animate-pulse ${
                        isActive ? 'bg-white text-orange-600' : 'bg-rose-500 text-white'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

        </div>
      </div>

      {/* Full-Screen Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 w-full h-full bg-white z-[9999] flex flex-col justify-between overflow-hidden animate-in fade-in duration-200">
          
          {/* 1. Header with Logo & Close Button */}
          <div className="p-4 flex items-center justify-between border-b border-slate-100 shrink-0 bg-white">
            <Link 
              to="/" 
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="flex items-center gap-2.5"
            >
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-brandOrange-500 shadow-sm bg-white flex items-center justify-center shrink-0 ring-2 ring-brandOrange-100">
                <img
                  src={assets.logo}
                  alt="Dr Bharathi's Homeo Care"
                  className="w-full h-full object-cover scale-[1.08] rounded-full"
                  style={{ imageRendering: '-webkit-optimize-contrast' }}
                />
              </div>
              <div className="flex flex-col items-center justify-center pt-0.5">
                <div className="text-xl font-serif tracking-tight leading-none mb-1">
                  <span className="text-[#c26839]">Dr</span>
                  <span className="text-[#0f3e5c] ml-1.5">Bharathi's</span>
                </div>
                
                <div className="w-full h-[1.5px] flex">
                  <div className="h-full bg-[#0f3e5c] w-[75%]"></div>
                  <div className="h-full bg-[#c26839] w-[25%]"></div>
                </div>

                <div className="flex items-center justify-center w-full mt-1 gap-1.5">
                  <div className="h-[1px] bg-[#c26839] w-2.5"></div>
                  <div className="w-[3px] h-[3px] rounded-full bg-[#c26839]"></div>
                  <span className="text-[7.5px] font-bold uppercase tracking-[0.25em] text-[#0f3e5c]">
                    HOMEO CARE
                  </span>
                  <div className="w-[3px] h-[3px] rounded-full bg-[#c26839]"></div>
                  <div className="h-[1px] bg-[#c26839] w-2.5"></div>
                </div>
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center text-slate-700 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Scrollable Middle Area (Search & Nav Links) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Mobile Search Input */}
            <form 
              onSubmit={(e) => { 
                handleSearchSubmit(e); 
                setMobileMenuOpen(false); 
              }} 
              className="flex items-center border border-slate-200 rounded-xl overflow-hidden shadow-inner bg-slate-50 focus-within:border-brandOrange-500 focus-within:bg-white transition-colors"
            >
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3.5 py-2.5 text-xs text-slate-800 bg-transparent focus:outline-none placeholder:text-slate-400"
              />
              <button 
                type="submit" 
                className="px-4 py-2.5 bg-brandOrange-500 hover:bg-brandOrange-600 text-white transition-colors flex items-center justify-center shrink-0"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Navigation Links with animated items & icons */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2">Navigation Menu</p>
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 group ${
                      isActive
                        ? 'bg-brandOrange-50 text-brandOrange-600 border-l-4 border-brandOrange-500 shadow-sm font-extrabold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-brandOrange-600 hover:translate-x-1'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${link.bg} flex items-center justify-center text-sm ${link.color} shadow-xs group-hover:scale-110 transition-transform`}>
                      <i className={link.icon}></i>
                    </div>
                    <span className="text-xs sm:text-sm">{link.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brandOrange-500 group-hover:translate-x-0.5 transition-all" />
                </NavLink>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
