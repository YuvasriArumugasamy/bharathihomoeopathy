import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Grid, 
  List, 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  Star, 
  Phone, 
  MessageCircle, 
  Filter,
  Leaf,
  ShieldCheck,
  UserCheck,
  Truck,
  CreditCard,
  Check,
  CheckSquare,
  Square,
  Sparkles,
  X,
  RotateCcw
} from 'lucide-react';
import { assets } from '../assets';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/shop/ProductCard';
import { SectionHeader } from '../components/common/SectionHeader';
import { demoProducts } from '../data/products';
import { EmptyState } from '../components/common/EmptyState';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All Categories';
  const initialSearch = searchParams.get('search') || '';

  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedForm, setSelectedForm] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [priceRange, setPriceRange] = useState(2000);
  const [sortBy, setSortBy] = useState('Popularity');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [addedItems, setAddedItems] = useState({});

  useEffect(() => {
    const q = searchParams.get('search') || '';
    const cat = searchParams.get('category') || 'All Categories';
    setSearchTerm(q);
    setSelectedCategory(cat);
  }, [searchParams]);

  const categories = [
    { name: "All Categories", count: demoProducts.length, icon: "🏷️" },
    { name: "Homeopathy Medicines", count: demoProducts.filter(p => p.category === "Homeopathy Medicines").length, icon: "💊" },
    { name: "Mother Tinctures", count: demoProducts.filter(p => p.category === "Mother Tinctures").length, icon: "🧪" },
    { name: "Biochemic Medicines", count: demoProducts.filter(p => p.category === "Biochemic Medicines").length, icon: "🧴" },
    { name: "Herbal Products", count: demoProducts.filter(p => p.category === "Herbal Products").length, icon: "🌿" },
    { name: "Personal Care", count: demoProducts.filter(p => p.category === "Personal Care").length, icon: "✨" },
    { name: "Combo Offers", count: demoProducts.filter(p => p.category === "Combo Offers").length, icon: "🎁" },
    { name: "Health Conditions", count: demoProducts.filter(p => p.category === "Health Conditions").length, icon: "🏥" }
  ];

  const forms = [
    { name: "Globules", count: demoProducts.filter(p => p.form === "Globules").length },
    { name: "Drops", count: demoProducts.filter(p => p.form === "Drops").length },
    { name: "Tablet", count: demoProducts.filter(p => p.form === "Tablet").length },
    { name: "Syrup", count: demoProducts.filter(p => p.form === "Syrup").length },
  ];

  const brands = [
    { name: "SBL", count: demoProducts.filter(p => p.brand === "SBL").length },
    { name: "Dr. Reckeweg", count: demoProducts.filter(p => p.brand === "Dr. Reckeweg").length },
    { name: "Willmar Schwabe", count: demoProducts.filter(p => p.brand === "Willmar Schwabe").length },
    { name: "Bakson's", count: demoProducts.filter(p => p.brand === "Bakson's").length },
    { name: "Allen", count: demoProducts.filter(p => p.brand === "Allen").length },
    { name: "Dr. Bharathi Standard", count: demoProducts.filter(p => p.brand === "Dr. Bharathi Standard").length },
  ];

  const ratings = [
    { stars: 5, count: demoProducts.filter(p => p.rating === 5).length },
    { stars: 4, count: demoProducts.filter(p => p.rating === 4).length },
  ];

  const toggleFilter = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    const newParams = new URLSearchParams(searchParams);
    if (catName === 'All Categories') {
      newParams.delete('category');
    } else {
      newParams.set('category', catName);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSelectedForm([]);
    setSelectedBrand([]);
    setPriceRange(2000);
    setSortBy('Popularity');
    setSearchParams({});
  };

  // Dynamic search & filter pipeline
  const filteredProducts = useMemo(() => {
    return demoProducts.filter((prod) => {
      // 1. Search Query Filter
      if (searchTerm.trim()) {
        const q = searchTerm.trim().toLowerCase();
        const matchesName = prod.name?.toLowerCase().includes(q);
        const matchesCategory = prod.category?.toLowerCase().includes(q);
        const matchesDesc = prod.shortDescription?.toLowerCase().includes(q);
        const matchesBrand = prod.brand?.toLowerCase().includes(q);
        const matchesIngredients = prod.ingredients?.some(i => i.toLowerCase().includes(q));
        if (!matchesName && !matchesCategory && !matchesDesc && !matchesBrand && !matchesIngredients) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory && selectedCategory !== 'All Categories') {
        if (prod.category !== selectedCategory) return false;
      }

      // 3. Price Filter
      const price = Number(prod.salePrice || prod.price);
      if (price > priceRange) return false;

      // 4. Form Filter
      if (selectedForm.length > 0) {
        if (!selectedForm.includes(prod.form)) return false;
      }

      // 5. Brand Filter
      if (selectedBrand.length > 0) {
        if (!selectedBrand.includes(prod.brand)) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = Number(a.salePrice || a.price);
      const priceB = Number(b.salePrice || b.price);
      if (sortBy === 'PriceLow') return priceA - priceB;
      if (sortBy === 'PriceHigh') return priceB - priceA;
      if (sortBy === 'Rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'BestSelling') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      return 0; // Default Popularity
    });
  }, [searchTerm, selectedCategory, priceRange, selectedForm, selectedBrand, sortBy]);

  // Real Dynamic Pagination Logic
  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedForm, selectedBrand, priceRange, sortBy]);

  // Sliced items for the current page
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const startItem = filteredProducts.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const gridElem = document.getElementById('shop-product-grid');
    if (gridElem) {
      gridElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 360, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    return pages;
  };


  return (
    <div className="space-y-12 pb-12 w-full max-w-full overflow-x-hidden">
      
      {/* 1. Shop Top Banner with 100% Clear & Full Background Image */}
      <section className="relative overflow-hidden min-h-[260px] sm:min-h-[320px] lg:min-h-[360px] flex items-center bg-slate-100 border-b border-slate-200/60 shadow-xs">
        {/* Crystal Clear Background Image (bgg1.png) - No White BG Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={assets.bgg1 || assets.shopBg}
            alt="Natural Homeopathic Remedies & Tinctures"
            className="w-full h-full object-cover object-left sm:object-center transform -scale-x-100 opacity-100"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-16 w-full">
          <div className="max-w-[70%] sm:max-w-md lg:max-w-xl space-y-3 sm:space-y-4">
            
            {/* Breadcrumb Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 text-[11px] sm:text-xs font-bold text-slate-800 shadow-md">
              <Link to="/" className="hover:text-brandOrange-600 transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-brandOrange-600 font-extrabold">Shop</span>
            </div>

            {/* Badge Pill */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#236888]/15 backdrop-blur-sm rounded-full border border-[#236888]/30 text-[#0f3e5c] text-[10px] sm:text-xs font-extrabold uppercase tracking-wider shadow-sm">
                <Leaf className="w-3.5 h-3.5 text-emerald-600 animate-pulse shrink-0" />
                <span>100% Pure & Authentic Dispensary</span>
              </div>
            </div>

            {/* Main Title with Elegant Display & Serif Font */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0b1727] tracking-tight leading-none font-display drop-shadow-[0_2px_10px_rgba(255,255,255,0.9)]">
              Shop <span className="text-[#e05a1e] font-serif italic font-bold">Natural Remedies</span>
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-base text-slate-900 font-extrabold leading-relaxed drop-shadow-[0_1px_8px_rgba(255,255,255,0.95)]">
              Discover authentic single remedies, mother tinctures, and wellness formulas crafted for natural healing without side effects.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main Shop Layout: Left Sidebar + Right Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Filters Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            
            {/* 1. PRODUCT CATEGORIES */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
              <h3 className="font-extrabold text-xs text-[#0b1727] uppercase tracking-wider">
                PRODUCT CATEGORIES
              </h3>
              <div className="space-y-1 text-xs font-medium text-slate-700">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => handleCategorySelect(cat.name)}
                      className={`w-full flex items-center justify-between py-2 px-2.5 rounded-lg text-left transition-colors ${
                        isSelected 
                          ? 'bg-[#fbeee6] text-[#e05a1e] font-bold shadow-2xs' 
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="truncate flex items-center gap-1.5">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </span>
                      <span className={`text-[11px] font-bold ${isSelected ? 'text-[#e05a1e]' : 'text-slate-400'}`}>
                        ({cat.count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. FILTER BY PRICE */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
              <h3 className="font-extrabold text-xs text-[#0b1727] uppercase tracking-wider">
                FILTER BY PRICE
              </h3>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#e05a1e] cursor-pointer"
              />
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>₹ 0</span>
                <span>₹ {priceRange}</span>
              </div>
              <button
                type="button"
                className="w-full py-2 bg-[#e05a1e] hover:bg-[#c2410c] text-white font-bold text-xs uppercase rounded-lg shadow-sm transition-colors"
              >
                Filter
              </button>
            </div>

            {/* 3. FORM */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
              <h3 className="font-extrabold text-xs text-[#0b1727] uppercase tracking-wider">
                FORM
              </h3>
              <div className="space-y-2 text-xs text-slate-700">
                {forms.map((f) => (
                  <label key={f.name} className="flex items-center justify-between cursor-pointer group">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedForm.includes(f.name)}
                        onChange={() => toggleFilter(selectedForm, setSelectedForm, f.name)}
                        className="rounded border-slate-300 text-[#e05a1e] focus:ring-[#e05a1e]"
                      />
                      <span className="group-hover:text-[#e05a1e]">{f.name}</span>
                    </span>
                    <span className="text-[11px] text-slate-400">({f.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. BRAND */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
              <h3 className="font-extrabold text-xs text-[#0b1727] uppercase tracking-wider">
                BRAND
              </h3>
              <div className="space-y-2 text-xs text-slate-700">
                {brands.map((b) => (
                  <label key={b.name} className="flex items-center justify-between cursor-pointer group">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedBrand.includes(b.name)}
                        onChange={() => toggleFilter(selectedBrand, setSelectedBrand, b.name)}
                        className="rounded border-slate-300 text-[#e05a1e] focus:ring-[#e05a1e]"
                      />
                      <span className="group-hover:text-[#e05a1e]">{b.name}</span>
                    </span>
                    <span className="text-[11px] text-slate-400">({b.count})</span>
                  </label>
                ))}
              </div>
              <button className="text-[11px] font-bold text-[#0b1727] hover:text-[#e05a1e] flex items-center gap-1 pt-1">
                <span>View More</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* 5. RATING */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
              <h3 className="font-extrabold text-xs text-[#0b1727] uppercase tracking-wider">
                RATING
              </h3>
              <div className="space-y-2 text-xs">
                {ratings.map((r, i) => (
                  <div key={i} className="flex items-center justify-between cursor-pointer hover:opacity-80">
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star 
                          key={s} 
                          className={`w-3.5 h-3.5 ${s < r.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400">({r.count})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Need Help? Card */}
            <div className="bg-[#f8fafc] border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3 text-center">
              <h4 className="font-extrabold text-xs text-[#0b1727]">Need Help?</h4>
              <p className="text-[11px] text-slate-500">We are here to assist you.</p>
              
              <a
                href="tel:+919025854711"
                className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-slate-200 hover:border-orange-300 rounded-lg text-xs font-bold text-[#0b1727] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#e05a1e]" />
                <span>+91 90258 54711</span>
              </a>

              <a
                href="https://wa.me/919025854711"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#236888] hover:bg-[#184d66] text-white font-bold text-xs rounded-lg shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

          </aside>

          {/* Right Product Grid */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Active Search & Filter Chips */}
            {(searchTerm || (selectedCategory && selectedCategory !== 'All Categories') || selectedForm.length > 0 || selectedBrand.length > 0 || priceRange < 2000) && (
              <div className="bg-orange-50/70 border border-brandOrange-200/70 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-700">Active Filters:</span>
                  
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-brandOrange-300 text-brandOrange-700 font-extrabold rounded-full shadow-2xs">
                      <span>Search: "{searchTerm}"</span>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          const p = new URLSearchParams(searchParams);
                          p.delete('search');
                          setSearchParams(p);
                        }}
                        className="hover:text-rose-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedCategory && selectedCategory !== 'All Categories' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-brandOrange-300 text-brandOrange-700 font-extrabold rounded-full shadow-2xs">
                      <span>{selectedCategory}</span>
                      <button
                        onClick={() => handleCategorySelect('All Categories')}
                        className="hover:text-rose-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedForm.map((f) => (
                    <span key={f} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 text-slate-700 font-bold rounded-full text-[11px]">
                      <span>{f}</span>
                      <button onClick={() => toggleFilter(selectedForm, setSelectedForm, f)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {selectedBrand.map((b) => (
                    <span key={b} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 text-slate-700 font-bold rounded-full text-[11px]">
                      <span>{b}</span>
                      <button onClick={() => toggleFilter(selectedBrand, setSelectedBrand, b)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {priceRange < 2000 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 text-slate-700 font-bold rounded-full text-[11px]">
                      <span>Under ₹{priceRange}</span>
                      <button onClick={() => setPriceRange(2000)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>

                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brandOrange-600 hover:text-rose-600 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              </div>
            )}

            {/* Sorting & Result Count Bar */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
              <span className="text-slate-500">
                Showing <strong className="text-navy-950 font-bold">{startItem}–{endItem}</strong> of {filteredProducts.length} {filteredProducts.length === 1 ? 'remedy' : 'remedies'} available
              </span>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-navy-950 focus:outline-none cursor-pointer"
                  >
                    <option value="Popularity">Popularity</option>
                    <option value="BestSelling">Best Selling</option>
                    <option value="PriceLow">Price: Low to High</option>
                    <option value="PriceHigh">Price: High to Low</option>
                    <option value="Rating">Average Rating</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                  <span className="text-slate-500 mr-1">View:</span>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-[#e05a1e] text-white' : 'text-slate-400 hover:bg-slate-100'}`}
                    aria-label="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-[#e05a1e] text-white' : 'text-slate-400 hover:bg-slate-100'}`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid or Empty State */}
            <div id="shop-product-grid">
              {paginatedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {paginatedProducts.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-orange-50 text-brandOrange-500 flex items-center justify-center mx-auto text-2xl">
                    🔍
                  </div>
                  <div className="space-y-1 max-w-md mx-auto">
                    <h3 className="text-lg font-extrabold text-navy-950">No Formulations Found</h3>
                    <p className="text-xs text-slate-500">
                      We couldn't find any products matching your search criteria. Try using broader keywords or clearing your filters.
                    </p>
                  </div>
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#236888] hover:bg-[#184d66] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear All Filters & Show All</span>
                  </button>
                </div>
              )}
            </div>

            {/* Real Interactive Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 pt-8">
                {/* Prev Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3.5 h-9 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    currentPage === 1
                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200/60'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-brandOrange-600 hover:border-brandOrange-300 shadow-2xs cursor-pointer active:scale-95'
                  }`}
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>

                {/* Number Buttons */}
                {getPageNumbers().map((p, idx) => {
                  if (p === '...') {
                    return (
                      <span key={`dots-${idx}`} className="w-8 h-9 flex items-center justify-center text-slate-400 text-xs font-black select-none">
                        •••
                      </span>
                    );
                  }
                  const isCurrent = currentPage === p;
                  return (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-9 h-9 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer ${
                        isCurrent
                          ? 'bg-gradient-to-tr from-brandOrange-500 to-amber-500 text-white shadow-md shadow-brandOrange-500/30 scale-105 ring-2 ring-brandOrange-300'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-brandOrange-600 hover:border-brandOrange-300 shadow-2xs active:scale-95'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3.5 h-9 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    currentPage === totalPages
                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200/60'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-orange-50 hover:text-brandOrange-600 hover:border-brandOrange-300 shadow-2xs cursor-pointer active:scale-95'
                  }`}
                  aria-label="Next Page"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </main>

        </div>
      </section>

      {/* 5 Trust Badges Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-[0_15px_45px_rgba(15,23,42,0.08)] p-3 sm:p-4 lg:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-0 lg:divide-x lg:divide-slate-100">
          
          {/* Badge 1: 100% Natural */}
          <div className="group flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-emerald-50/60 hover:shadow-xs transition-all duration-300 cursor-pointer lg:px-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25 ring-4 ring-emerald-500/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-[13px] text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                100% Natural
              </h4>
              <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                Safe & gentle homeopathic care
              </p>
            </div>
          </div>

          {/* Badge 2: No Side Effects */}
          <div className="group flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-sky-50/60 hover:shadow-xs transition-all duration-300 cursor-pointer lg:px-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#0b344d] to-[#18587c] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0b344d]/25 ring-4 ring-sky-500/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-[13px] text-slate-900 group-hover:text-[#0b344d] transition-colors leading-snug">
                No Side Effects
              </h4>
              <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                Non-toxic & highly effective
              </p>
            </div>
          </div>

          {/* Badge 3: Expert Doctors */}
          <div className="group flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-purple-50/60 hover:shadow-xs transition-all duration-300 cursor-pointer lg:px-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/25 ring-4 ring-purple-500/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
              <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-[13px] text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">
                Expert Doctors
              </h4>
              <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                Experienced specialists
              </p>
            </div>
          </div>

          {/* Badge 4: Fast & Safe Delivery */}
          <div className="group flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-amber-50/60 hover:shadow-xs transition-all duration-300 cursor-pointer lg:px-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25 ring-4 ring-amber-500/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-[13px] text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                Fast & Safe Delivery
              </h4>
              <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                On all orders above ₹999
              </p>
            </div>
          </div>

          {/* Badge 5: Secure Payments */}
          <div className="group flex items-center gap-3.5 p-3.5 rounded-2xl hover:bg-rose-50/60 hover:shadow-xs transition-all duration-300 cursor-pointer lg:px-4 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/25 ring-4 ring-rose-500/10 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-[13px] text-slate-900 group-hover:text-rose-600 transition-colors leading-snug">
                Secure Payments
              </h4>
              <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                100% safe & encrypted
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
