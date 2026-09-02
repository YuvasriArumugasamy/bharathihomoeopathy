import React, { useState } from 'react';
import { X, Star, Check, ShieldCheck, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';

export const QuickViewModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const displayPrice = product.salePrice || product.price;
  const originalPrice = product.originalPrice || product.price;
  const hasDiscount = originalPrice > displayPrice;

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          
          {/* Image */}
          <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-brandOrange-600 mb-1">
              {product.category}
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-navy-900 leading-snug mb-2">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating || '4.8'}</span>
              </div>
              <span className="text-slate-400 text-xs">({product.reviewCount || 24} reviews)</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-medium text-emerald-600">
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-extrabold text-navy-900">₹{displayPrice}</span>
              {hasDiscount && (
                <span className="text-sm text-slate-400 line-through">₹{originalPrice}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              {product.shortDescription || product.description}
            </p>

            {/* Quantity Stepper & Add to Cart */}
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-50 font-bold text-sm"
                >
                  -
                </button>
                <span className="px-3 py-2 text-xs font-bold text-navy-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-50 font-bold text-sm"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || isAdding}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-navy-900 hover:bg-brandOrange-500 rounded-xl transition-smooth shadow-md"
              >
                {isAdding ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-cart-shopping"></i>
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>

            <div className="mt-3 text-center">
              <Link
                to={`/product/${product.id || product._id || product.slug}`}
                onClick={onClose}
                className="text-xs font-semibold text-brandOrange-600 hover:underline"
              >
                View Full Product Details →
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
