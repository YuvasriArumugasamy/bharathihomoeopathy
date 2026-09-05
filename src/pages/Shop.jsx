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
  ArrowUpDown,
  Check,
  X,
  RotateCcw,
  Zap
} from 'lucide-react';
import { assets } from '../assets';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/shop/ProductCard';
import { ScrollReveal } from '../components/common/ScrollReveal';
import { demoProducts } from '../data/products';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All Categories';
  const initialSearch = searchParams.get('search') || '';

  const { items, totalItems, subtotal } = useCart();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedForm, setSelectedForm] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState('Relevancy');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state for mobile view
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('Category');

  useEffect(() => {
    const q = searchParams.get('search') || '';
    const cat = searchParams.get('category') || 'All Categories';
    setSearchTerm(q);
    setSelectedCategory(cat);
  }, [searchParams]);

  // Categories matching Image 1 exact styling with left-tinted icon box
  const categories = [
    { name: "ALL CATEGORIES", value: "All Categories", icon: "🟧", bg: "bg-orange-100/90", text: "text-orange-600" },
    { name: "Homeopathy", value: "Homeopathy Medicines", icon: "🧪", bg: "bg-emerald-100/90", text: "text-emerald-700" },
    { name: "Ayurveda", value: "Ayurveda", icon: "🌿", bg: "bg-lime-100/90", text: "text-lime-700" },
    { name: "Unani", value: "Unani", icon: "🥣", bg: "bg-purple-100/90", text: "text-purple-700" },
    { name: "Beauty & Personal Care", value: "Personal Care", icon: "💆‍♀️", bg: "bg-rose-100/90", text: "text-rose-600" },
    { name: "Baby Care", value: "Baby Care", icon: "👶", bg: "bg-pink-100/90", text: "text-pink-600" },
    { name: "Sexual Wellness", value: "Sexual Wellness", icon: "⚧", bg: "bg-red-100/90", text: "text-red-600" },
    { name: "Health Aid & Fitness", value: "Health Aid & Fitness", icon: "💪", bg: "bg-sky-100/90", text: "text-sky-700" },
    { name: "Nutrition & Supplements", value: "Mother Tinctures", icon: "🏋️", bg: "bg-indigo-100/90", text: "text-indigo-700" },
    { name: "Festivities and Devotion", value: "Herbal Products", icon: "✨", bg: "bg-amber-100/90", text: "text-amber-700" },
    { name: "Books", value: "Books", icon: "📚", bg: "bg-amber-100/90", text: "text-amber-700" },
    { name: "Allopathy", value: "Allopathy", icon: "💉", bg: "bg-cyan-100/90", text: "text-cyan-700" }
  ];

  const forms = [
    { name: "Drops", count: demoProducts.filter(p => p.form === "Drops").length },
    { name: "Globules", count: demoProducts.filter(p => p.form === "Globules").length },
    { name: "Tablet", count: demoProducts.filter(p => p.form === "Tablet").length },
    { name: "Syrup", count: demoProducts.filter(p => p.form === "Syrup").length },
  ];

  const brands = [
    { name: "SBL", count: demoProducts.filter(p => p.brand === "SBL").length },
    { name: "Willmar Schwabe", count: demoProducts.filter(p => p.brand === "Willmar Schwabe").length },
    { name: "BJain", count: demoProducts.filter(p => p.brand === "BJain").length },
    { name: "Wheezal", count: demoProducts.filter(p => p.brand === "Wheezal").length },
    { name: "Dr. Reckeweg", count: demoProducts.filter(p => p.brand === "Dr. Reckeweg").length },
    { name: "Bakson's", count: demoProducts.filter(p => p.brand === "Bakson's").length },
  ];

  const toggleFilter = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleCategorySelect = (catValue) => {
    setSelectedCategory(catValue);
    const newParams = new URLSearchParams(searchParams);
    if (catValue === 'All Categories') {
      newParams.delete('category');
    } else {
      newParams.set('category', catValue);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSelectedForm([]);
    setSelectedBrand([]);
    setMinPrice(0);
    setMaxPrice(10000);
    setSortBy('Relevancy');
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
        if (prod.category !== selectedCategory && prod.name !== selectedCategory) return false;
      }

      // 3. Price Filter
      const price = Number(prod.salePrice || prod.price);
      if (price < minPrice || price > maxPrice) return false;

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
      if (sortBy === 'Discount') return (b.discount || 0) - (a.discount || 0);
      if (sortBy === 'Name') return a.name.localeCompare(b.name);
      if (sortBy === 'Popularity') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      return 0; // Relevancy default
    });
  }, [searchTerm, selectedCategory, minPrice, maxPrice, selectedForm, selectedBrand, sortBy]);

  // Pagination
  const ITEMS_PER_PAGE = 18;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedForm, selectedBrand, minPrice, maxPrice, sortBy]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  return (
    <div 
      className="space-y-4 pb-12 w-full max-w-full overflow-x-clip min-h-screen bg-repeat bg-center"
      style={{ backgroundImage: `url(${assets.paperBg})` }}
    >
      
      {/* 1. Mobile Top Category Tabs Bar (Visible on Mobile `< lg`) */}
      <section className="lg:hidden bg-white/95 backdrop-blur-md py-2 border-b border-slate-300 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar scroll-smooth">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.value;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategorySelect(cat.value)}
                  className={`inline-flex items-center rounded bg-white border shadow-2xs overflow-hidden shrink-0 transition-all cursor-pointer ${
                    isSelected ? 'border-[#00a699] ring-2 ring-[#00a699]/40' : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-sm sm:text-base ${cat.bg} ${cat.text} shrink-0`}>
                    {cat.icon}
                  </div>
                  <div className="px-2.5 py-1 text-[10.5px] sm:text-xs font-bold text-slate-800 whitespace-nowrap uppercase tracking-tight">
                    {cat.name}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Secondary Mobile Action Pills Bar */}
          <div className="flex items-center justify-between gap-2 pt-2 pb-1 border-t border-slate-300/60 text-xs">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setShowSortModal(true)}
                className="px-3 py-1 bg-white border border-slate-300 rounded text-[11.5px] font-bold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-600" />
                <span>Sort</span>
              </button>

              <button
                onClick={() => setShowFilterModal(true)}
                className={`px-3 py-1 rounded border text-[11.5px] font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs ${
                  selectedForm.length > 0 || selectedBrand.length > 0 || maxPrice < 10000
                    ? 'bg-[#00a699] text-white border-[#00a699]'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filter</span>
              </button>

              <div className="px-3 py-1 bg-white border border-slate-300 rounded text-[11px] font-extrabold text-slate-600 tracking-wider uppercase inline-flex items-center gap-1 shadow-2xs">
                <span className="text-slate-500 font-serif italic text-xs">ASSURED</span>
                <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
              </div>

              <div className="px-3 py-1 bg-white border border-slate-300 rounded text-[11px] font-extrabold text-amber-900 tracking-wider uppercase inline-flex items-center gap-1 shadow-2xs">
                <span>BULK</span>
                <span className="text-emerald-600">%</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-slate-600 hidden sm:inline-block">
              {filteredProducts.length} Results
            </span>
          </div>
        </div>
      </section>

      {/* 2. Main Responsive Laptop / Desktop + Mobile Layout */}
      <section className="max-w-[1500px] mx-auto px-2 sm:px-4 lg:px-6 pt-2">
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          
          {/* LEFT SIDEBAR FILTERS (Visible on Desktop / Laptop `lg:block`) */}
          <aside className="hidden lg:block w-64 shrink-0 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-5 sticky top-20">
            {/* Top Header with Filter Icon & Clear All */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Filter className="w-4 h-4" />
                </div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">Filters</h2>
              </div>
              {(selectedCategory !== 'All Categories' || selectedBrand.length > 0 || maxPrice < 10000) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-2 py-1 rounded-md hover:bg-orange-100 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Tree Section */}
            <div className="space-y-2">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                Category
              </span>
              
              <div className="space-y-1">
                <button
                  onClick={() => handleCategorySelect('All Categories')}
                  className={`w-full text-left font-black text-xs uppercase tracking-tight flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    selectedCategory === 'All Categories'
                      ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-amber-400 text-white shadow-md shadow-orange-500/20'
                      : 'text-slate-700 hover:bg-slate-100/80'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs">📂</span>
                    <span>ALL CATEGORIES</span>
                  </span>
                  <span className={`text-[10px] font-bold ${selectedCategory === 'All Categories' ? 'text-white bg-black/15 px-2 py-0.5 rounded-full' : 'text-slate-400'}`}>
                    ({demoProducts.length})
                  </span>
                </button>

                <div className="pl-1 pt-1 space-y-1">
                  {categories.filter(c => c.value !== 'All Categories').map((cat, idx) => {
                    const isSelected = selectedCategory === cat.value;
                    const catCount = demoProducts.filter(p => p.category === cat.value || p.name.includes(cat.name)).length || (3 + (idx % 5));
                    return (
                      <button
                        key={cat.name}
                        onClick={() => handleCategorySelect(cat.value)}
                        className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between group cursor-pointer ${
                          isSelected
                            ? 'text-orange-600 bg-orange-50/90 border border-orange-200/80 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <span className="text-xs shrink-0">{cat.icon}</span>
                          <span className="truncate">{cat.name}</span>
                        </span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded transition-colors ${
                          isSelected ? 'bg-orange-200/70 text-orange-900' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200/70 group-hover:text-slate-600'
                        }`}>
                          {catCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Price Filter Section */}
            <div className="space-y-3 pt-3.5 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  Price Range
                </span>
                <span className="text-xs font-extrabold text-orange-600">
                  Up to ₹{maxPrice}
                </span>
              </div>
              
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
              />

              <div className="flex items-center gap-2 text-xs">
                <div className="flex-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 text-center">
                  ₹0
                </div>
                <span className="text-slate-400 font-bold">-</span>
                <div className="flex-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 text-center">
                  ₹{maxPrice}+
                </div>
              </div>

              {/* Quick price chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: "Under ₹200", val: 200 },
                  { label: "Under ₹500", val: 500 },
                  { label: "All Prices", val: 10000 }
                ].map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => setMaxPrice(chip.val)}
                    className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold transition-all cursor-pointer ${
                      maxPrice === chip.val
                        ? 'bg-orange-500 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter Section */}
            <div className="space-y-2 pt-3.5 border-t border-slate-100">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                Brand
              </span>
              <div className="space-y-1 text-xs">
                {brands.map((b) => (
                  <label key={b.name} className="flex items-center justify-between cursor-pointer group py-1 px-1.5 rounded-md hover:bg-slate-50 transition-colors">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedBrand.includes(b.name)}
                        onChange={() => toggleFilter(selectedBrand, setSelectedBrand, b.name)}
                        className="rounded border-slate-300 text-orange-500 focus:ring-orange-400 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className={`font-medium transition-colors ${
                        selectedBrand.includes(b.name) ? 'text-orange-600 font-extrabold' : 'text-slate-700 group-hover:text-slate-900'
                      }`}>{b.name}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.2 rounded">({b.count})</span>
                  </label>
                ))}
              </div>
            </div>

          </aside>

          {/* RIGHT MAIN CONTENT AREA */}
          <main className="flex-1 w-full space-y-3">
            
            {/* Laptop / Desktop Top Actions & Results Header Bar (Hidden on Mobile) */}
            <div className="hidden lg:flex bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 items-center justify-between shadow-2xs text-xs">
              <div className="font-extrabold text-slate-900 text-sm">
                {filteredProducts.length > 0 ? 'Getting products...' : 'No products found'}
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">ASSURED ✓</span>
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">⚡ QUICK</span>
                </div>

                {/* Sort By Dropdown Select */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-bold">Sort by :</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="p-1.5 bg-white border border-slate-300 rounded font-bold text-slate-800 text-xs focus:outline-none focus:border-orange-500 cursor-pointer shadow-2xs"
                  >
                    <option value="Relevancy">Relevancy</option>
                    <option value="Popularity">Popularity</option>
                    <option value="Name">Name</option>
                    <option value="PriceLow">Price Low to High</option>
                    <option value="PriceHigh">Price High to Low</option>
                    <option value="Discount">Discount</option>
                    <option value="NewArrivals">New Arrivals</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters Bar */}
            {(searchTerm || (selectedCategory && selectedCategory !== 'All Categories') || selectedForm.length > 0 || selectedBrand.length > 0 || maxPrice < 10000) && (
              <div className="flex flex-wrap items-center gap-2 text-xs py-1">
                <span className="font-bold text-slate-500">Active Filters:</span>
                
                {selectedCategory && selectedCategory !== 'All Categories' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border border-slate-300 text-slate-800 font-bold rounded text-[11px] shadow-2xs">
                    <span>{selectedCategory}</span>
                    <button onClick={() => handleCategorySelect('All Categories')}><X className="w-3 h-3 text-slate-400 hover:text-rose-600" /></button>
                  </span>
                )}

                {selectedForm.map((f) => (
                  <span key={f} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border border-slate-300 text-slate-800 font-bold rounded text-[11px] shadow-2xs">
                    <span>{f}</span>
                    <button onClick={() => toggleFilter(selectedForm, setSelectedForm, f)}><X className="w-3 h-3 text-slate-400 hover:text-rose-600" /></button>
                  </span>
                ))}

                {selectedBrand.map((b) => (
                  <span key={b} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border border-slate-300 text-slate-800 font-bold rounded text-[11px] shadow-2xs">
                    <span>{b}</span>
                    <button onClick={() => toggleFilter(selectedBrand, setSelectedBrand, b)}><X className="w-3 h-3 text-slate-400 hover:text-rose-600" /></button>
                  </span>
                ))}

                <button
                  onClick={clearAllFilters}
                  className="text-[11px] font-bold text-orange-600 hover:underline ml-1"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* 6-COLUMNS RESPONSIVE PRODUCT GRID MATCHING LAPTOP SCREENSHOT */}
            <div id="shop-product-grid">
              {paginatedProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
                  {paginatedProducts.map((prod, idx) => (
                    <ScrollReveal key={prod.id} direction="up" delay={(idx % 6) * 50}>
                      <ProductCard product={prod} />
                    </ScrollReveal>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
                  <div className="text-3xl">🔍</div>
                  <h3 className="text-base font-bold text-slate-900">No Remedies Found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    We couldn't find any products matching your search criteria. Try clearing your filters.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-orange-500 text-white font-bold text-xs rounded hover:bg-orange-600 transition-colors shadow-2xs"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all border ${
                    currentPage === 1
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 cursor-pointer shadow-2xs'
                  }`}
                >
                  Prev
                </button>

                <span className="text-xs font-bold text-slate-600 px-2">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all border ${
                    currentPage === totalPages
                      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 cursor-pointer shadow-2xs'
                  }`}
                >
                  Next
                </button>
              </div>
            )}

          </main>

        </div>
      </section>

      {/* 3. SORT BY OVERLAY MODAL (For Mobile View) */}
      {showSortModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <h3 className="text-base font-extrabold text-slate-900">Sort By</h3>
              <button
                onClick={() => setShowSortModal(false)}
                className="text-slate-500 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-2 divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
              {[
                { label: 'Relevancy', value: 'Relevancy' },
                { label: 'Popularity', value: 'Popularity' },
                { label: 'Name', value: 'Name' },
                { label: 'Price Low to High', value: 'PriceLow' },
                { label: 'Price High to Low', value: 'PriceHigh' },
                { label: 'Discount', value: 'Discount' },
                { label: 'New Arrivals', value: 'NewArrivals' },
              ].map((opt) => {
                const isSelected = sortBy === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value);
                      setShowSortModal(false);
                    }}
                    className="w-full flex items-center justify-between py-3.5 px-4 text-left font-semibold text-xs sm:text-sm transition-colors hover:bg-slate-50 cursor-pointer"
                  >
                    <span className={isSelected ? 'text-[#00a699] font-extrabold' : 'text-slate-700'}>
                      {opt.label}
                    </span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      isSelected ? 'border-[#00a699] bg-[#00a699] text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. FILTER OVERLAY MODAL DRAWER (For Mobile View) */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center sm:p-4 animate-fadeIn">
          <div className="bg-white w-full h-full sm:h-[85vh] sm:max-w-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-[#00a699] text-white px-4 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
              <button
                onClick={() => setShowFilterModal(false)}
                className="inline-flex items-center gap-2 font-extrabold text-sm sm:text-base hover:opacity-90 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Filter</span>
              </button>

              <button
                onClick={clearAllFilters}
                className="text-xs font-extrabold uppercase tracking-wider text-white hover:underline cursor-pointer"
              >
                CLEAR ALL
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              <div className="w-1/3 sm:w-2/5 bg-[#f2f2f2] border-r border-slate-200 overflow-y-auto">
                {[
                  { id: 'Category', label: 'Category', badge: null },
                  { id: 'Price', label: 'Price', badge: maxPrice < 10000 ? '1' : null },
                  { id: 'Brand', label: 'Brand', badge: selectedBrand.length > 0 ? selectedBrand.length : null },
                ].map((tab) => {
                  const isActive = activeFilterTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilterTab(tab.id)}
                      className={`w-full text-left px-4 py-3.5 text-xs sm:text-sm font-bold border-b border-slate-200/60 flex items-center justify-between transition-colors cursor-pointer ${
                        isActive ? 'bg-white text-[#00a699] border-l-4 border-l-[#00a699]' : 'text-slate-700 hover:bg-slate-200/50'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <span className="w-4.5 h-4.5 rounded-full bg-[#00a699] text-white text-[10px] font-black flex items-center justify-center">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="w-2/3 sm:w-3/5 bg-white p-4 sm:p-6 overflow-y-auto">
                {activeFilterTab === 'Category' && (
                  <div className="space-y-3">
                    <div className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                      <span>ALL CATEGORIES</span>
                    </div>
                    <div className="space-y-1 pl-1">
                      {categories.map((cat) => {
                        const isCatSelected = selectedCategory === cat.value;
                        return (
                          <button
                            key={cat.name}
                            onClick={() => handleCategorySelect(cat.value)}
                            className={`w-full text-left py-2 px-3 rounded-lg text-xs sm:text-sm transition-colors ${
                              isCatSelected
                                ? 'bg-emerald-50 text-[#00a699] font-extrabold border-l-2 border-[#00a699]'
                                : 'hover:bg-slate-50 text-slate-700 font-medium'
                            }`}
                          >
                            {cat.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeFilterTab === 'Price' && (
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                      Price Range Filter
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-bold text-slate-800">
                        <span>Max Price Limit:</span>
                        <span className="text-[#00a699]">₹{maxPrice}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full accent-[#00a699] cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {activeFilterTab === 'Brand' && (
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                      Select Brands
                    </h4>
                    <div className="space-y-2 text-xs sm:text-sm">
                      {brands.map((b) => (
                        <label key={b.name} className="flex items-center justify-between cursor-pointer group py-1">
                          <span className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedBrand.includes(b.name)}
                              onChange={() => toggleFilter(selectedBrand, setSelectedBrand, b.name)}
                              className="rounded border-slate-300 text-[#00a699] focus:ring-[#00a699] w-4 h-4"
                            />
                            <span className="group-hover:text-[#00a699] font-medium text-slate-800">{b.name}</span>
                          </span>
                          <span className="text-[11px] text-slate-400 font-bold">({b.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 p-3 sm:p-4 bg-white flex items-center justify-between shrink-0 shadow-lg">
              <span className="text-xs sm:text-sm font-bold text-slate-600">
                {filteredProducts.length} results
              </span>
              <button
                onClick={() => setShowFilterModal(false)}
                className="px-8 py-2.5 bg-[#ff7a00] hover:bg-[#e06900] active:scale-95 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-lg shadow-md transition-all cursor-pointer"
              >
                APPLY
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
