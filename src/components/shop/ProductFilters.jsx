import React from 'react';
import { Filter, X, Check, RotateCcw } from 'lucide-react';
import { productCategories } from '../../data/products';

export const ProductFilters = ({
  selectedCategory = 'All Products',
  onSelectCategory,
  priceRange = [0, 2000],
  onPriceChange,
  onlyInStock = false,
  onInStockChange,
  onlyBestSellers = false,
  onBestSellersChange,
  onResetFilters
}) => {
  return (
    <aside className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-navy-900 font-bold text-sm">
          <Filter className="w-4 h-4 text-brandOrange-500" />
          <span>Filter Products</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-slate-400 hover:text-brandOrange-600 flex items-center gap-1 font-medium transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Categories List */}
      <div>
        <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3">Categories</h4>
        <div className="space-y-1">
          {productCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-smooth ${
                selectedCategory === cat
                  ? 'bg-brandOrange-50 text-brandOrange-600 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900'
              }`}
            >
              <span>{cat}</span>
              {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-brandOrange-500" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider">Price Range</h4>
          <span className="text-xs font-semibold text-brandOrange-600">Up to ₹{priceRange[1]}</span>
        </div>
        <input
          type="range"
          min="100"
          max="2000"
          step="50"
          value={priceRange[1]}
          onChange={(e) => onPriceChange([0, Number(e.target.value)])}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brandOrange-500"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>₹100</span>
          <span>₹1000</span>
          <span>₹2000+</span>
        </div>
      </div>

      {/* Availability & Special Badges */}
      <div>
        <h4 className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-3">Preferences</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => onInStockChange(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-brandOrange-500 focus:ring-brandOrange-500"
            />
            <span>In Stock Only</span>
          </label>
          <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyBestSellers}
              onChange={(e) => onBestSellersChange(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-brandOrange-500 focus:ring-brandOrange-500"
            />
            <span>Best Sellers Only</span>
          </label>
        </div>
      </div>

    </aside>
  );
};
