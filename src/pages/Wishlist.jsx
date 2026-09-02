import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, ShoppingBag, Check, Star } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { EmptyState } from '../components/common/EmptyState';

export const Wishlist = () => {
  const { wishlist, totalWishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      showToast('This formulation is currently out of stock', 'warning');
      return;
    }
    addToCart(product, 1);
  };

  const handleAddAllToCart = () => {
    let count = 0;
    wishlist.forEach((item) => {
      if (item.stock > 0 || item.stock === undefined) {
        addToCart(item, 1);
        count++;
      }
    });
    if (count > 0) {
      showToast(`Added ${count} items from Wishlist to Cart! 🛒`, 'success');
    } else {
      showToast('All items in wishlist are currently out of stock', 'warning');
    }
  };

  if (totalWishlist === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="You haven't saved any remedies or formulas yet. Click the heart icon on any product to save it to your personal wishlist."
          actionText="Explore Natural Remedies"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 w-full overflow-x-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#236888]">Saved Formulations</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight flex items-center gap-2.5">
            <span>My Wishlist</span>
            <span className="text-sm font-bold bg-rose-50 text-rose-600 border border-rose-200 px-2.5 py-0.5 rounded-full">
              {totalWishlist} {totalWishlist === 1 ? 'item' : 'items'}
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddAllToCart}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#236888] hover:bg-[#184d66] text-white text-xs font-extrabold rounded-xl shadow-sm transition-all active:scale-95"
          >
            <i className="fa-solid fa-cart-plus"></i>
            <span>Add All to Cart</span>
          </button>

          <button
            onClick={clearWishlist}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Wishlist</span>
          </button>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => {
          const displayPrice = item.price;
          const originalPrice = item.originalPrice || item.price;
          const hasDiscount = originalPrice > displayPrice;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-brandOrange-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-4 relative group"
            >
              {/* Remove button */}
              <button
                onClick={() => removeFromWishlist(item.id)}
                title="Remove from wishlist"
                aria-label="Remove item"
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors shadow-xs z-10"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Product Image Link */}
              <Link to={`/product/${item.id}`} className="flex flex-col items-center pt-2">
                <div className="w-full aspect-[4/3] sm:aspect-square max-h-44 rounded-xl overflow-hidden flex items-center justify-center p-2.5 bg-gradient-to-b from-slate-50 to-white/60 group-hover:bg-orange-50/20 transition-all duration-300">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                </div>

                {/* Details */}
                <div className="w-full text-left mt-3 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-md border border-slate-200/50">
                    {item.size || item.category || 'Homeopathy'}
                  </span>

                  <h3 className="font-extrabold text-sm text-navy-950 line-clamp-1 group-hover:text-brandOrange-600 transition-colors leading-tight">
                    {item.name}
                  </h3>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="font-black text-base text-navy-950">
                      ₹{Number(displayPrice).toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{Number(originalPrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              {/* Action Buttons */}
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={item.stock <= 0}
                  className="flex-1 py-2.5 px-3 bg-[#236888] hover:bg-brandOrange-500 text-white rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-2 shadow-sm active:scale-98"
                >
                  <i className="fa-solid fa-cart-shopping text-xs"></i>
                  <span>Add to Cart</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Footer link */}
      <div className="pt-4 flex justify-between items-center text-xs">
        <Link to="/shop" className="font-bold text-[#236888] hover:text-brandOrange-600 flex items-center gap-1.5">
          <span>← Continue Exploring Shop</span>
        </Link>
      </div>

    </div>
  );
};
