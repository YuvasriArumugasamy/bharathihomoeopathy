import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

export const ProductCard = ({ product }) => {
  const { items, addToCart, updateQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  if (!product) return null;

  const productId = product.id || product._id;
  const isWishlisted = isInWishlist(productId);

  // Cart quantity check
  const cartItem = items?.find((i) => (i.id === productId || i._id === productId));
  const cartQty = cartItem ? cartItem.quantity : 0;

  const displayPrice = Number(product.salePrice || product.price || 0);
  const originalPrice = Number(product.originalPrice || product.price || 0);
  const hasDiscount = originalPrice > displayPrice;
  const discountPercent = product.discount || (hasDiscount ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0);

  // Size / variant selection
  const defaultSize = product.size || product.form || '1 unit';
  const [selectedSize, setSelectedSize] = useState(defaultSize);

  // Available size options
  const sizeOptions = [
    defaultSize,
    ...(product.form && product.form !== defaultSize ? [product.form] : []),
  ];

  // Unit rate calculation for label (e.g., ₹210/100 gm or ₹67/tab)
  const getUnitRateText = () => {
    if (product.size) {
      return `₹${Math.round(displayPrice)}/${product.size}`;
    }
    if (product.form) {
      return `₹${Math.round(displayPrice)}/${product.form}`;
    }
    return `₹${Math.round(displayPrice)}/unit`;
  };

  const handleAddToCart = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    if (product.stock <= 0) {
      showToast('This formulation is currently out of stock', 'warning');
      return;
    }

    addToCart(product, 1);
  };

  const handleIncrement = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    if (product.stock && cartQty >= product.stock) {
      showToast('Maximum available stock reached', 'warning');
      return;
    }
    updateQuantity(productId, cartQty + 1);
  };

  const handleDecrement = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    updateQuantity(productId, cartQty - 1);
  };

  const handleWishlistToggle = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    toggleWishlist(product);
  };

  const ratingValue = Number(product.rating || 4.5);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.05)] hover:shadow-xl hover:shadow-orange-500/10 hover:border-brandOrange-400/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between p-3.5 sm:p-4 relative overflow-hidden group">
      
      {/* Top Accent Gradient Line on Hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brandOrange-500 via-amber-400 to-[#0b344d] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Top Left Discount Corner Ribbon Badge */}
      {hasDiscount && discountPercent > 0 && (
        <div className="absolute top-0 left-0 z-20 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 text-white text-[10px] sm:text-[11px] font-black px-3 py-1.5 rounded-tl-3xl rounded-br-2xl shadow-lg shadow-rose-500/30 flex items-center gap-1.5 border-b border-r border-white/30 tracking-wider uppercase">
          <i className="fa-solid fa-fire text-amber-300 text-[10px] sm:text-xs animate-pulse" />
          <span>{discountPercent}% OFF</span>
        </div>
      )}

      {/* Top Right Action Buttons Stack (Wishlist + Quick Add) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label="Wishlist"
          className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white/90 backdrop-blur-md hover:bg-white flex items-center justify-center transition-all shadow-md hover:shadow-lg border border-slate-200/80 active:scale-95 cursor-pointer group/wish"
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
              isWishlisted
                ? 'text-rose-500 fill-rose-500'
                : 'text-slate-500 group-hover/wish:text-rose-500'
            }`}
          />
        </button>

        {/* Shopping Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          title={cartQty > 0 ? `In Cart (${cartQty})` : "Add to Cart"}
          aria-label="Add to Cart"
          className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 hover:text-brandOrange-600 flex items-center justify-center transition-all shadow-md hover:shadow-lg border border-slate-200/80 active:scale-95 group/btn cursor-pointer"
        >
          <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600 group-hover/btn:text-brandOrange-600 transition-colors" />
        </button>
      </div>

      {/* Image Area */}
      <Link
        to={`/product/${productId}`}
        className="w-full h-44 sm:h-48 flex items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-slate-50/80 to-white/40 border border-slate-100/80 overflow-hidden relative block mt-1"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />
      </Link>

      {/* Info Section */}
      <div className="flex-1 flex flex-col justify-between mt-3">
        <div>
          {/* Product Title */}
          <Link
            to={`/product/${productId}`}
            className="font-extrabold text-xs sm:text-[14px] text-slate-900 line-clamp-2 min-h-[36px] group-hover:text-brandOrange-600 transition-colors leading-snug block"
          >
            {product.name}
          </Link>

          {/* Subtitle / Short Description */}
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-2 min-h-[28px] leading-tight mt-1">
            {product.shortDescription || product.category || 'Natural homeopathic formulation'}
          </p>

          {/* Variant Selector & Star Rating Row */}
          <div className="flex items-center justify-between gap-2 mt-2.5">
            {/* Variant Dropdown */}
            <div className="relative inline-flex items-center">
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="text-[11px] sm:text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1 pr-6 appearance-none focus:outline-none focus:border-brandOrange-500 cursor-pointer transition-colors shadow-2xs"
              >
                {sizeOptions.map((opt, idx) => (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none" />
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-0.5 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`fa-solid fa-star text-[10px] sm:text-[11px] ${
                    star <= Math.round(ratingValue)
                      ? 'text-amber-400 filter drop-shadow-2xs'
                      : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Brand info */}
          {product.brand && (
            <div className="text-[11px] font-bold text-brandOrange-600 mt-1.5">
              {product.brand}
            </div>
          )}
        </div>

        {/* Bottom Price & Add to Cart / Quantity Stepper Row */}
        <div className="flex items-end justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100">
          {/* Price Column */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-sm sm:text-base text-slate-900">
                ₹{Math.round(displayPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{Math.round(originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
              ({getUnitRateText()})
            </span>
          </div>

          {/* Right Action: Sunset Orange + Button or Stepper */}
          {cartQty > 0 ? (
            <div className="flex items-center bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white rounded-xl shadow-md shadow-orange-500/25 overflow-hidden h-8 sm:h-9 transition-all">
              <button
                type="button"
                onClick={handleDecrement}
                className="w-7 sm:w-8 h-full flex items-center justify-center font-black text-base hover:bg-black/10 active:scale-90 transition-all select-none"
                title="Decrease quantity"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="px-2 font-black text-xs sm:text-sm select-none">
                {cartQty}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                className="w-7 sm:w-8 h-full flex items-center justify-center font-black text-base hover:bg-black/10 active:scale-90 transition-all select-none"
                title="Increase quantity"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              title="Add to Cart"
              aria-label="Add to Cart"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white font-black shadow-md shadow-orange-500/25 hover:scale-105 active:scale-95 flex items-center justify-center transition-all cursor-pointer"
            >
              <i className="fa-solid fa-plus text-xs sm:text-sm text-white"></i>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
