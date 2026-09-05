import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Check, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ChevronDown, 
  Share2, 
  ChevronRight,
  Package,
  Leaf,
  Plus,
  Minus,
  X,
  ZoomIn
} from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/shop/ProductCard';
import { ProductSkeleton } from '../components/common/ProductSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { SectionHeader } from '../components/common/SectionHeader';
import { ScrollReveal } from '../components/common/ScrollReveal';
import { demoProducts } from '../data/products';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewsList, setReviewsList] = useState([
    { name: "Ananya Sharma", rating: 5, date: "2026-08-20", title: "Authentic & Genuine", comment: "The sealed amber packaging gives great confidence in product potency. Delivered securely." },
    { name: "Suresh Kumar", rating: 5, date: "2026-08-15", title: "Effective daily wellness", comment: "Consulted Dr. Bharathi and ordered this formulation. Very satisfied with the outcome." }
  ]);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, title: '', comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    if (showImageModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showImageModal]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
        setSelectedImage(data.image || (data.images && data.images[0]) || '');
        document.title = `${data.name} | Dr. Bharathi’s Homeo Care`;
      } catch (err) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <ProductSkeleton />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <ErrorState
          title="Product not found"
          message="The requested remedy or formulation may have been moved or is currently unavailable."
          onRetry={() => navigate('/shop')}
        />
      </div>
    );
  }

  const productId = product.id || product._id;
  const isWishlisted = isInWishlist(productId);

  const displayPrice = product.salePrice || product.price;
  const originalPrice = product.originalPrice || product.price;
  const hasDiscount = originalPrice > displayPrice;
  const discountPercent = product.discount || (hasDiscount ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0);

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      showToast('Product is currently out of stock', 'warning');
      return;
    }
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product);
  };

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription || product.name,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText?.(window.location.href);
      showToast('Product link copied to clipboard!', 'success');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) {
      showToast('Please provide your name and review comments', 'warning');
      return;
    }
    setReviewsList(prev => [
      {
        ...newReview,
        date: new Date().toISOString().slice(0, 10)
      },
      ...prev
    ]);
    setNewReview({ name: '', rating: 5, title: '', comment: '' });
    setShowReviewForm(false);
    showToast('Thank you! Your verified review has been posted.', 'success');
  };

  const relatedProducts = demoProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10 w-full overflow-x-hidden">
      
      {/* Breadcrumb Navigation Bar */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-2xs w-fit flex-wrap">
        <Link to="/" className="hover:text-brandOrange-600 font-semibold transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
        <Link to="/shop" className="hover:text-brandOrange-600 font-semibold transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-brandOrange-600 font-semibold transition-colors">{product.category}</Link>
        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
        <span className="text-slate-900 font-extrabold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* Left Gallery Card */}
        <ScrollReveal direction="left" className="lg:col-span-6 space-y-4">
          <div 
            onClick={() => setShowImageModal(true)}
            className="aspect-square bg-white/95 backdrop-blur-2xl rounded-3xl overflow-hidden border border-slate-200/90 p-3 shadow-[0_15px_45px_rgba(15,23,42,0.08)] relative group flex items-center justify-center cursor-zoom-in"
          >
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center rounded-2xl transition-all duration-300 group-hover:scale-[1.03]"
            />

            {/* Hover Zoom Hint Badge */}
            <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 pointer-events-none">
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Click to enlarge</span>
            </div>
            
            {/* Corner Ribbon Discount Badge */}
            {hasDiscount && (
              <span className="absolute top-5 left-5 z-20 bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 text-white text-[11px] font-black px-3.5 py-1.5 rounded-2xl shadow-lg flex items-center gap-1">
                <i className="fa-solid fa-fire text-amber-300 text-xs animate-pulse" />
                <span>{discountPercent}% OFF</span>
              </span>
            )}

            {/* Top Right Floating Action Buttons Stack (Share + Wishlist) */}
            <div className="absolute top-5 right-5 z-20 flex flex-col gap-2.5" onClick={(e) => e.stopPropagation()}>
              {/* Share Button */}
              <button
                type="button"
                onClick={handleShareProduct}
                title="Share Product"
                aria-label="Share Product"
                className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 hover:text-brandOrange-600 flex items-center justify-center transition-all shadow-md border border-slate-200/80 active:scale-95 cursor-pointer group/share"
              >
                <Share2 className="w-4 h-4 text-slate-700 group-hover/share:text-brandOrange-600 transition-colors" />
              </button>

              {/* Wishlist Heart Button */}
              <button
                type="button"
                onClick={handleWishlistToggle}
                title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                aria-label="Wishlist"
                className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md hover:bg-white flex items-center justify-center transition-all shadow-md border border-slate-200/80 active:scale-95 cursor-pointer"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isWishlisted
                      ? 'text-rose-500 fill-rose-500'
                      : 'text-slate-700 hover:text-rose-500'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          {imagesList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-2xl overflow-hidden border-2 shrink-0 transition-all p-0.5 bg-white ${
                    selectedImage === img ? 'border-brandOrange-500 ring-4 ring-brandOrange-500/20 shadow-sm' : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover rounded-xl" />
                </button>
              ))}
            </div>
          )}
        </ScrollReveal>

        {/* Right Product Buy Section Card */}
        <ScrollReveal direction="right" className="lg:col-span-6 bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_15px_45px_rgba(15,23,42,0.08)] space-y-6 relative overflow-hidden">
          {/* Top Accent Gradient Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brandOrange-500 via-amber-400 to-[#0b344d]" />

          <div>
            <span className="px-3 py-1 bg-orange-50 text-[#e05a1e] text-[10px] font-black uppercase tracking-wider rounded-full border border-orange-200/60 inline-block mb-2.5">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>
            {product.sku && (
              <p className="text-xs text-slate-400 font-mono mt-1">Dispensary SKU: {product.sku}</p>
            )}
          </div>

          {/* Rating & Stock Badges */}
          <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/60 text-amber-700 font-black">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{product.rating || '4.8'}</span>
            </div>
            <span className="text-slate-500 font-medium">({reviewsList.length + 22} patient reviews)</span>
            <span className="text-slate-300">•</span>
            <span className={`font-extrabold px-3 py-1 rounded-xl text-[11px] border ${
              product.stock > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' : 'bg-rose-50 text-rose-700 border-rose-200/60'
            }`}>
              {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
            </span>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
            <span className="text-3xl sm:text-4xl font-black text-slate-900">₹{displayPrice}</span>
            {hasDiscount && (
              <span className="text-lg text-slate-400 line-through font-bold">₹{originalPrice}</span>
            )}
            <span className="text-xs text-slate-500 font-medium ml-auto">(Includes all applicable taxes)</span>
          </div>

          {/* Short Excerpt */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            {product.shortDescription || product.description}
          </p>

          {/* Quantity & Action Buttons */}
          <div className="space-y-3.5 pt-2">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              
              {/* Stepper */}
              <div className="flex items-center border border-slate-200/90 rounded-2xl overflow-hidden bg-slate-50/80 p-1 shrink-0 justify-between sm:justify-start">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl text-slate-700 hover:bg-white hover:shadow-xs flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-black text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl text-slate-700 hover:bg-white hover:shadow-xs flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || isAdding}
                className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 text-xs sm:text-sm font-black text-white bg-[#0b344d] hover:bg-[#104363] rounded-2xl transition-all duration-200 shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isAdding ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-cart-shopping text-sm"></i>
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

            </div>

            {/* Buy Now Direct Button */}
            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="w-full py-4 px-6 text-xs sm:text-sm font-black text-white bg-gradient-to-r from-brandOrange-500 via-amber-500 to-brandOrange-600 hover:scale-[1.02] active:scale-95 rounded-2xl shadow-lg shadow-brandOrange-500/25 transition-all duration-200 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-bolt text-amber-200" />
              <span>Buy Now with Instant Checkout</span>
            </button>
          </div>

          {/* Delivery & Trust Micro-Cards (4 Badges) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-3 bg-slate-50/70 p-2.5 rounded-2xl border border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[11.5px] font-bold text-slate-700">Certified Pharmacopoeial Grade</span>
            </div>

            <div className="flex items-center gap-3 bg-slate-50/70 p-2.5 rounded-2xl border border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Truck className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[11.5px] font-bold text-slate-700">Dispatched in 24-48 Hours</span>
            </div>

            <div className="flex items-center gap-3 bg-slate-50/70 p-2.5 rounded-2xl border border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-teal-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Leaf className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[11.5px] font-bold text-slate-700">100% Pure Natural Medium</span>
            </div>

            <div className="flex items-center gap-3 bg-slate-50/70 p-2.5 rounded-2xl border border-slate-100">
              <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Package className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[11.5px] font-bold text-slate-700">Tamper-Proof Amber Packaging</span>
            </div>
          </div>

        </ScrollReveal>

      </div>

      {/* Tabs: Description, Care & Storage, Verified Patient Reviews */}
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-[0_15px_45px_rgba(15,23,42,0.08)] space-y-6">
        
        <div className="flex items-center gap-6 border-b border-slate-100 text-xs sm:text-sm font-black overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3.5 transition-colors relative cursor-pointer whitespace-nowrap ${activeTab === 'description' ? 'text-brandOrange-600' : 'text-slate-400 hover:text-slate-700'}`}
          >
            <span>Formulation Description</span>
            {activeTab === 'description' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brandOrange-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`pb-3.5 transition-colors relative cursor-pointer whitespace-nowrap ${activeTab === 'storage' ? 'text-brandOrange-600' : 'text-slate-400 hover:text-slate-700'}`}
          >
            <span>Care & Storage</span>
            {activeTab === 'storage' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brandOrange-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3.5 transition-colors relative cursor-pointer whitespace-nowrap ${activeTab === 'reviews' ? 'text-brandOrange-600' : 'text-slate-400 hover:text-slate-700'}`}
          >
            <span>Patient Reviews ({reviewsList.length})</span>
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brandOrange-500 rounded-full" />
            )}
          </button>
        </div>

        {activeTab === 'description' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            <p className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">{product.description || product.shortDescription}</p>
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="pt-2">
                <h4 className="font-extrabold text-slate-900 mb-3 text-xs uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brandOrange-500" />
                  <span>Key Ingredients / Dilution Source:</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/80 font-bold text-slate-800 text-xs">
                      <div className="w-2 h-2 rounded-full bg-brandOrange-500" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/60 text-amber-900 space-y-2">
              <p className="font-bold">
                {product.storageInfo || "Store in a cool, dry place away from direct sunlight, camphor, and strong magnetic devices."}
              </p>
              <p className="text-xs text-amber-800">
                Always replace the cap securely after dispensing. Do not touch globules directly with bare hands; use the bottle cap.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 text-sm">Verified Patient Ratings</h3>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2 text-xs font-extrabold text-brandOrange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200/60 rounded-xl transition-all cursor-pointer"
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            </div>

            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      placeholder="e.g. Rahul V."
                      className="w-full p-2.5 text-xs bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:border-brandOrange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Review Title</label>
                    <input
                      type="text"
                      required
                      value={newReview.title}
                      onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                      placeholder="e.g. Very pure quality"
                      className="w-full p-2.5 text-xs bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:border-brandOrange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rating</label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                    className="p-2.5 text-xs bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:border-brandOrange-500"
                  >
                    <option value={5}>5 Stars - Excellent</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Average</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Comments</label>
                  <textarea
                    rows={3}
                    required
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Share your experience with this formulation..."
                    className="w-full p-2.5 text-xs bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:border-brandOrange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-black text-white bg-brandOrange-500 hover:bg-brandOrange-600 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Submit Review
                </button>
              </form>
            )}

            <div className="space-y-4">
              {reviewsList.map((rev, i) => (
                <div key={i} className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0b344d] to-[#18587c] text-white font-black text-xs flex items-center justify-center shadow-2xs">
                        {rev.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 block">{rev.name}</span>
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Verified Patient</span>
                        </span>
                      </div>
                    </div>
                    <span className="text-slate-400 text-[11px] font-medium">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    {Array.from({ length: rev.rating }).map((_, r) => (
                      <Star key={r} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-800">{rev.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Complementary Formulations */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-4">
          <SectionHeader
            title="Complementary Formulations"
            subtitle="Recommended remedy combinations for enhanced therapeutic efficacy"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* FULLSCREEN IMAGE LIGHTBOX MODAL (100% Covered using React Portal, Matching Image 2 Reference) */}
      {showImageModal && createPortal(
        <div 
          onClick={() => setShowImageModal(false)}
          className="fixed top-0 left-0 w-screen h-screen bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fadeIn cursor-pointer"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', zIndex: 9999999 }}
        >
          {/* Top Control Bar */}
          <div className="absolute top-5 right-5 z-[10000000] flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowImageModal(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
              title="Close Preview"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Centered Image Container */}
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center p-2 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl p-3 sm:p-6 shadow-2xl max-h-[85vh] flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="max-h-[80vh] max-w-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
