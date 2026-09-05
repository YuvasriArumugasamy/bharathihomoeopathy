import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Heart, Plus, Star, ShoppingCart } from 'lucide-react';
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

  // Size options
  const defaultSize = product.size || "30 ml";
  const [selectedSize, setSelectedSize] = useState(defaultSize);

  const sizeOptions = [
    defaultSize,
    ...(defaultSize.includes("30") ? ["100 ml"] : defaultSize.includes("100") ? ["30 ml"] : ["60 ml", "100 ml"])
  ].filter((v, i, a) => a.indexOf(v) === i);

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

  const ratingValue = Number(product.rating || 4.1);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between p-3 relative overflow-hidden group">
      
      {/* Top Left Teal Discount Ribbon Badge */}
      {hasDiscount && discountPercent > 0 && (
        <div className="absolute top-0 left-0 z-10 bg-[#00a699] text-white text-[10px] sm:text-[11px] font-black px-2 py-1 leading-tight text-center rounded-br-lg shadow-2xs uppercase">
          <div className="text-[11px] sm:text-xs font-black">{discountPercent}%</div>
          <div className="text-[8px] sm:text-[9px] tracking-wider font-extrabold -mt-0.5">OFF</div>
        </div>
      )}

      {/* Top Right Action Stack (Wishlist Heart + Shopping Cart Icon) */}
      <div className="absolute top-1.5 right-1.5 z-10 flex flex-col gap-1 items-center">
        {/* Wishlist Heart Icon */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label="Wishlist"
          className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-[12px] bg-gradient-to-b from-[#fafdff] to-[#edf4fa] hover:from-white hover:to-[#e6f0fa] border border-[#e1ebf5] shadow-[0_1.5px_4px_rgba(0,0,0,0.04)] flex items-center justify-center transition-all cursor-pointer active:scale-95"
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 stroke-[1.8] ${
              isWishlisted ? 'text-rose-500 fill-rose-500' : 'text-[#334e68]'
            }`}
          />
        </button>

        {/* Shopping Cart Icon (Under Wishlist) */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          title="Add to Cart"
          aria-label="Add to Cart"
          className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-[12px] bg-gradient-to-b from-[#fafdff] to-[#edf4fa] hover:from-white hover:to-[#e6f0fa] border border-[#e1ebf5] shadow-[0_1.5px_4px_rgba(0,0,0,0.04)] flex items-center justify-center transition-all cursor-pointer active:scale-95"
        >
          <ShoppingCart className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 stroke-[1.8] text-[#334e68] hover:text-[#00a699]" />
        </button>
      </div>

      {/* Product Image */}
      <Link
        to={`/product/${productId}`}
        className="w-full h-36 sm:h-40 flex items-center justify-center p-2 pt-4 rounded-lg bg-white overflow-hidden block"
      >
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Product Details Section */}
      <div className="flex-1 flex flex-col justify-between mt-2">
        <div>
          {/* Star Rating Badge (Matching reference: e.g. 3.7 ★ in light amber pill) */}
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#fff8f0] border border-[#ffedd5] text-amber-800 text-[11px] font-bold mb-1.5">
            <span>{ratingValue.toFixed(1)}</span>
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${productId}`}
            className="font-bold text-xs sm:text-[13px] text-slate-900 line-clamp-2 min-h-[34px] hover:text-[#00a699] transition-colors leading-tight block"
          >
            {product.name}
          </Link>

          {/* Indications / Short Description (Light Gray Text) */}
          <p className="text-[10.5px] sm:text-[11px] text-slate-500 font-medium line-clamp-2 min-h-[28px] leading-tight mt-1">
            {product.shortDescription || product.category || 'Natural Homeopathic formulation'}
          </p>

          {/* Size Selector & BULK % Badge Row */}
          <div className="flex items-center justify-between gap-1.5 mt-2">
            {/* Size Dropdown Box */}
            <div className="relative inline-flex items-center">
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="text-[11px] font-semibold text-slate-700 bg-white border border-slate-300 rounded px-2 py-0.5 pr-5 appearance-none focus:outline-none focus:border-[#00a699] cursor-pointer"
              >
                {sizeOptions.map((opt, idx) => (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 pointer-events-none" />
            </div>

            {/* BULK % Tag */}
            <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-black italic border border-amber-200">
              <span className="text-amber-800 font-black tracking-tight">BULK</span>
              <span className="text-emerald-700 font-black">%</span>
            </div>
          </div>
        </div>

        {/* Bottom Price & Add Button Row */}
        <div className="flex items-end justify-between gap-2 mt-3 pt-2">
          {/* Price Column */}
          <div className="flex flex-col leading-none">
            {hasDiscount && (
              <span className="text-[11px] text-slate-400 line-through mb-0.5">
                ₹{Math.round(originalPrice)}
              </span>
            )}
            <span className="font-extrabold text-sm sm:text-base text-slate-900">
              ₹{Math.round(displayPrice)}
            </span>
          </div>

          {/* Add Button / Counter Stepper */}
          {cartQty > 0 ? (
            <div className="flex items-center bg-[#00a699] text-white rounded border border-[#00a699] overflow-hidden h-7 sm:h-8 shadow-2xs">
              <button
                type="button"
                onClick={handleDecrement}
                className="w-6 sm:w-7 h-full flex items-center justify-center font-bold text-sm hover:bg-black/10 active:scale-95 transition-all select-none"
                title="Decrease quantity"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="px-1.5 font-bold text-xs select-none">
                {cartQty}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                className="w-6 sm:w-7 h-full flex items-center justify-center font-bold text-sm hover:bg-black/10 active:scale-95 transition-all select-none"
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
              className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-white hover:bg-slate-50 text-slate-700 hover:text-[#00a699] border border-slate-300 font-bold flex items-center justify-center transition-colors shadow-2xs active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-700" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
