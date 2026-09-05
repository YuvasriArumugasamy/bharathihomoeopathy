import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronLeft,
  Star, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  Leaf,
  Heart,
  Truck,
  CreditCard,
  UserCheck,
  Award,
  Check,
  Phone
} from 'lucide-react';
import { assets } from '../assets';
import { demoProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/shop/ProductCard';
import { SectionHeader } from '../components/common/SectionHeader';
export const Home = () => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [addedItems, setAddedItems] = useState({});
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const handleAdd = (product) => {
    addToCart(product, 1);
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const categories = [
    { 
      name: "Homeopathy Medicines", 
      image: assets.p1
    },
    { 
      name: "Mother Tinctures", 
      image: assets.p2
    },
    { 
      name: "Biochemic Medicines", 
      image: assets.p3
    },
    { 
      name: "Herbal Products", 
      image: assets.p4
    },
    { 
      name: "Personal Care", 
      image: assets.p5
    },
    { 
      name: "Combo Offers", 
      image: assets.p6
    },
    { 
      name: "Health Conditions", 
      image: assets.p7
    }
  ];

  const bestSellerProducts = demoProducts.slice(0, 5);

  const testimonials = [
    {
      name: "Lakshmi R.",
      city: "Tirunelveli",
      comment: "Dr. Bharathi is an excellent doctor. Her treatment is very effective and without any side effects. I feel much better now.",
      rating: 5
    },
    {
      name: "Siva Kumar",
      city: "Palayamkottai",
      comment: "Very good experience. She listens patiently and gives proper guidance. Best homeopathy clinic in Tirunelveli.",
      rating: 5
    },
    {
      name: "Priya M.",
      city: "Melapalayam",
      comment: "Natural treatment with great results. Highly recommended for all age groups.",
      rating: 5
    },
    {
      name: "Rajesh K.",
      city: "Tirunelveli",
      comment: "Remarkable relief for chronic sinusitis within weeks of starting constitutional homeopathy. Very caring doctor.",
      rating: 5
    },
    {
      name: "Ananya S.",
      city: "Tenkasi",
      comment: "Safe medicines for kids with wonderful results for immunity and recurring cold. Grateful to Dr. Bharathi!",
      rating: 5
    },
    {
      name: "Mohammed Farooq",
      city: "Melapalayam",
      comment: "Holistic treatment that really addresses the root cause of the issue. Truly professional and genuine clinic.",
      rating: 5
    }
  ];

  const blogCards = [
    {
      title: "Boost Your Immunity Naturally with Homeopathy",
      tag: "HEALTH TIPS",
      date: "20 May 2025",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "Homeopathy for Stress and Anxiety Relief",
      tag: "WELLNESS",
      date: "15 May 2025",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "Natural Care for Your Child's Healthy Growth",
      tag: "CHILD CARE",
      date: "10 May 2025",
      image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=500&q=80"
    },
    {
      title: "Homeopathy Treatment for Allergy and Sinusitis",
      tag: "ALLERGY",
      date: "05 May 2025",
      image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=500&q=80"
    }
  ];

  return (
    <div className="space-y-16 pb-12 w-full max-w-full overflow-x-hidden">
      
      {/* 1. Hero Section with Cinema Scrim and High-Contrast Typography */}
      <section className="relative min-h-[500px] sm:min-h-[520px] lg:min-h-[540px] flex items-center justify-center border-b border-slate-200 overflow-hidden pt-20 pb-14 sm:py-20">
        
        {/* Background Video */}
        <video
          src={assets.bgVideo1 || assets.heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Cinema Contrast Scrim Overlay for ultra-clear text & button visibility */}
        <div className="absolute inset-0 bg-black/55 sm:bg-black/45 backdrop-brightness-[0.9] pointer-events-none" />

        {/* High-Contrast Hero Typography directly over video */}
        <div className="max-w-3xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10 text-center space-y-6 pt-10 sm:pt-0">
          
          <div className="space-y-3.5">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.2] sm:leading-[1.15] drop-shadow-[0_6px_24px_rgba(0,0,0,1)]">
              Natural Healing.<br />
              <span className="text-[#ff9d3b] font-serif italic font-extrabold drop-shadow-[0_6px_24px_rgba(0,0,0,1)]">
                Healthy Living.
              </span>
            </h1>
            
            <p className="text-sm sm:text-lg md:text-xl text-white font-extrabold max-w-xl mx-auto leading-relaxed pt-1 drop-shadow-[0_3px_14px_rgba(0,0,0,1)]">
              Safe, gentle and effective homeopathic solutions for you and your family.
            </p>
          </div>

          {/* Action CTA Buttons - Ultra High Contrast & Super Clear Sunset Gradient */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 pt-3 max-w-xs sm:max-w-none mx-auto">
            <Link
              to="/shop"
              className="btn-gradient-orange w-full sm:w-auto text-center"
            >
              <i className="fa-solid fa-cart-shopping text-sm" />
              <span>Shop Now</span>
            </Link>
            <Link
              to="/appointment"
              className="w-full sm:w-auto px-9 py-3.5 bg-white hover:bg-slate-100 text-[#0b1727] font-black text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-[0_8px_25px_rgba(255,255,255,0.4)] hover:scale-105 transition-all duration-200 text-center border-2 border-white flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-brandOrange-500" />
              <span>Book Appointment</span>
            </Link>
          </div>

        </div>

      </section>

      {/* 2. Five Trust Badges Card Strip with Ultra-Premium Glassmorphic Aesthetics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
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

      {/* 3. Shop by Category Section with High-End Glass Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Heading */}
        <SectionHeader title="Shop by Category" />

        {/* 7 Interactive Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 lg:gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={cat.name}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="flex flex-col items-center text-center p-3.5 sm:p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-orange-500/10 hover:border-brandOrange-400/60 hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Top Accent Gradient Line on Hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brandOrange-500 via-amber-400 to-[#0b344d] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Glowing Gradient Ring Pod around Image */}
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full p-1 bg-gradient-to-tr from-brandOrange-500 via-amber-400 to-[#18587c] shadow-md group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-full bg-white p-1 overflow-hidden flex items-center justify-center border-2 border-white shadow-inner">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Category Title */}
              <h3 className="text-xs sm:text-[12.5px] font-extrabold text-navy-950 mt-3 group-hover:text-brandOrange-600 transition-colors leading-tight line-clamp-2 min-h-[32px] flex items-center justify-center">
                {cat.name}
              </h3>

              {/* Interactive Arrow Indicator on Hover */}
              <div className="opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 text-[10px] font-extrabold text-brandOrange-500 flex items-center gap-0.5 mt-1">
                <span>Explore</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#0b344d] to-[#18587c] hover:from-[#18587c] hover:to-[#0b344d] text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-[#0b344d]/20 hover:scale-105 transition-all duration-200"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>

      </section>

      {/* 4. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <SectionHeader title="Best Sellers" />
        <div className="flex justify-end -mt-4 mb-2 pr-4 relative z-10">
          <Link
            to="/best-sellers"
            className="text-xs font-bold text-[#0b1727] hover:text-[#e05a1e] transition-colors flex items-center gap-1"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 6 Grid Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {bestSellerProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

      </section>

      {/* 5. Three Promo Banners Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Banner 1: Flat 10% OFF */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#e0f2fe] to-[#bae6fd] border border-blue-100 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <Sparkles className="w-10 h-10 text-blue-500 mb-4 opacity-80 group-hover:scale-110 transition-transform" />
            <div className="space-y-3 z-10">
              <span className="inline-block px-3 py-1 bg-white/50 rounded-full text-[10px] font-black uppercase tracking-widest text-[#e05a1e]">
                Flat 10% OFF
              </span>
              <h3 className="text-2xl font-black text-[#0b1727] leading-tight">
                On All Medicines
              </h3>
            </div>
            <div className="pt-6 z-10 w-full">
              <Link
                to="/shop"
                className="btn-gradient-orange w-full sm:w-auto text-center"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Banner 2: Book Appointment */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#e8effe] to-[#d8e4fd] border border-indigo-100 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <Calendar className="w-10 h-10 text-indigo-500 mb-4 opacity-80 group-hover:scale-110 transition-transform" />
            <div className="space-y-3 z-10">
              <span className="inline-block px-3 py-1 bg-white/50 rounded-full text-[10px] font-black uppercase tracking-widest text-[#e05a1e]">
                Book Appointment
              </span>
              <h3 className="text-2xl font-black text-[#0b1727] leading-tight">
                Consult with<br />Dr. Bharathi
              </h3>
            </div>
            <div className="pt-6 z-10 w-full">
              <Link
                to="/appointment"
                className="btn-gradient-orange w-full sm:w-auto text-center"
              >
                Book Now
              </Link>
            </div>
          </div>

          {/* Banner 3: Combo Offers */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#e6f4f8] to-[#ccecf4] border border-cyan-100 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <Award className="w-10 h-10 text-cyan-600 mb-4 opacity-80 group-hover:scale-110 transition-transform" />
            <div className="space-y-3 z-10">
              <span className="inline-block px-3 py-1 bg-white/50 rounded-full text-[10px] font-black uppercase tracking-widest text-[#e05a1e]">
                Combo Offers
              </span>
              <h3 className="text-2xl font-black text-[#0b1727] leading-tight">
                Save More on<br />Healthier Choices
              </h3>
            </div>
            <div className="pt-6 z-10 w-full">
              <Link
                to="/offers"
                className="btn-gradient-orange w-full sm:w-auto text-center"
              >
                Explore Now
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 6. About Dr. Bharathi & Quick Consultation Box (With Real Photo assets.bharathi) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-sm">
          
          {/* Doctor Real Photo */}
          <div className="lg:col-span-4 rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 shadow-md border-2 border-white">
            <img
              src={assets.bharathi}
              alt="Dr. Bharathi - Qualified Homeopathic Doctor"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Middle Bio */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="text-xs font-bold text-[#e05a1e] uppercase tracking-widest flex items-center gap-1.5">
                <span>About Dr. Bharathi</span>
                <span>🌿</span>
              </span>
              <h3 className="text-2xl font-extrabold text-[#0b1727] tracking-tight mt-1">
                Personalized Care for a Healthier Tomorrow
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Dr. Bharathi is a dedicated homeopathic practitioner with years of experience in treating acute and chronic diseases naturally. Her mission is to provide safe, effective and personalized homeopathic care for a healthier tomorrow.
            </p>

            <ul className="space-y-2 text-xs font-semibold text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#e05a1e] shrink-0" />
                <span>BHMS - Qualified Homeopathic Doctor</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#e05a1e] shrink-0" />
                <span>Expertise in treating all age groups</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#e05a1e] shrink-0" />
                <span>Personalized & holistic treatment</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#e05a1e] shrink-0" />
                <span>Compassionate & patient-centric care</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/about"
                className="btn btn-teal"
              >
                Know More About Us
              </Link>
            </div>
          </div>

          {/* Right Teal Blue Card */}
          <div className="lg:col-span-3 bg-[#236888] text-white p-6 rounded-2xl shadow-xl space-y-4 text-center">
            <h4 className="text-base font-extrabold leading-snug">
              Take the First Step Towards Better Health
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Book your appointment today and let us help you lead a healthy life.
            </p>
            <div className="space-y-2 text-left text-xs text-slate-300 pt-2">
              <p className="flex items-center gap-2">✓ Easy Online Booking</p>
              <p className="flex items-center gap-2">✓ Flexible Timings</p>
              <p className="flex items-center gap-2">✓ Trusted by Thousands</p>
            </div>
            <Link
              to="/appointment"
              className="btn btn-orange w-full text-center"
            >
              Book Appointment
            </Link>
          </div>

        </div>
      </section>

      {/* 7. Patient Testimonials Carousel with Prev / Next Arrows */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative">
        
        <SectionHeader title="What Our Patients Say" />

        {/* Testimonials Cards: Exactly 1 on Mobile, 3 on Desktop */}
        <div className="relative">
          
          {/* Mobile View: ONLY 1 Card displayed with full focus */}
          <div className="block md:hidden">
            {(() => {
              const t = testimonials[testimonialIndex % testimonials.length];
              const initials = t.name ? t.name.split(' ').map(n => n[0]).join('') : 'P';

              return (
                <div 
                  key={`mobile-${testimonialIndex}`} 
                  className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 p-6 shadow-[0_10px_35px_rgba(15,23,42,0.06)] hover:shadow-xl hover:shadow-orange-500/10 hover:border-brandOrange-400/60 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
                >
                  {/* Top Accent Gradient Line on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brandOrange-500 via-amber-400 to-[#0b344d] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Header Row: Quote Pod + Verified Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white flex items-center justify-center shadow-md shadow-orange-500/25 ring-4 ring-orange-500/10 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                      <span className="text-xl font-serif leading-none font-bold">“</span>
                    </div>
                    
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>Verified Patient</span>
                    </span>
                  </div>

                  {/* Comment Text */}
                  <p className="text-xs sm:text-[13px] text-slate-700 font-medium leading-relaxed italic min-h-[58px] my-1">
                    "{t.comment}"
                  </p>

                  {/* Footer Profile Row */}
                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3 mt-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0b344d] to-[#18587c] text-white font-extrabold text-[11px] flex items-center justify-center shadow-xs shrink-0">
                        {initials}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-[13px] font-extrabold text-slate-900 group-hover:text-brandOrange-600 transition-colors leading-tight">
                          {t.name}
                        </h4>
                        {t.city && (
                          <span className="text-[10.5px] font-semibold text-slate-400 block leading-tight">
                            {t.city}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: t.rating }).map((_, r) => (
                        <Star key={r} className="w-3.5 h-3.5 fill-current filter drop-shadow-2xs" />
                      ))}
                    </div>
                  </div>

                </div>
              );
            })()}
          </div>

          {/* Desktop & Tablet View: 3 Cards Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 transition-all duration-300">
            {testimonials.slice(Math.floor(testimonialIndex / 3) * 3, Math.floor(testimonialIndex / 3) * 3 + 3).map((t, i) => {
              const initials = t.name ? t.name.split(' ').map(n => n[0]).join('') : 'P';

              return (
                <div 
                  key={`desktop-${testimonialIndex}-${i}`} 
                  className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 p-6 shadow-[0_10px_35px_rgba(15,23,42,0.06)] hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1.5 hover:border-brandOrange-400/60 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
                >
                  {/* Top Accent Gradient Line on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brandOrange-500 via-amber-400 to-[#0b344d] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div>
                    {/* Header Row: Quote Pod + Verified Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white flex items-center justify-center shadow-md shadow-orange-500/25 ring-4 ring-orange-500/10 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                        <span className="text-xl font-serif leading-none font-bold">“</span>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>Verified Patient</span>
                      </span>
                    </div>

                    {/* Comment Text */}
                    <p className="text-xs sm:text-[13px] text-slate-700 font-medium leading-relaxed italic min-h-[58px] my-1">
                      "{t.comment}"
                    </p>
                  </div>

                  {/* Footer Profile Row */}
                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3 mt-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0b344d] to-[#18587c] text-white font-extrabold text-[11px] flex items-center justify-center shadow-xs shrink-0">
                        {initials}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-[13px] font-extrabold text-slate-900 group-hover:text-brandOrange-600 transition-colors leading-tight">
                          {t.name}
                        </h4>
                        {t.city && (
                          <span className="text-[10.5px] font-semibold text-slate-400 block leading-tight">
                            {t.city}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: t.rating }).map((_, r) => (
                        <Star key={r} className="w-3.5 h-3.5 fill-current filter drop-shadow-2xs" />
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom Interactive Navigation: Mobile Arrows + Clickable Dot Indicators */}
        <div className="flex justify-center items-center gap-4 pt-2">
          {/* Mobile Prev Arrow */}
          <button
            type="button"
            onClick={() => setTestimonialIndex((prev) => (prev <= 0 ? testimonials.length - 1 : prev - 1))}
            className="md:hidden w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-[#e05a1e] text-slate-700 hover:text-[#e05a1e] flex items-center justify-center shadow-sm cursor-pointer active:scale-90"
            aria-label="Previous Review"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Mobile Dots */}
          <div className="flex md:hidden items-center gap-1.5">
            {testimonials.map((_, idx) => (
              <button
                key={`mob-dot-${idx}`}
                type="button"
                onClick={() => setTestimonialIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  testimonialIndex === idx
                    ? 'w-5 h-2 bg-[#e05a1e]'
                    : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Review ${idx + 1}`}
              />
            ))}
          </div>

          {/* Desktop Dots */}
          <div className="hidden md:flex items-center gap-2">
            {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, idx) => (
              <button
                key={`desk-dot-${idx}`}
                type="button"
                onClick={() => setTestimonialIndex(idx * 3)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  Math.floor(testimonialIndex / 3) === idx
                    ? 'w-6 h-2.5 bg-[#e05a1e]'
                    : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Mobile Next Arrow */}
          <button
            type="button"
            onClick={() => setTestimonialIndex((prev) => (prev >= testimonials.length - 1 ? 0 : prev + 1))}
            className="md:hidden w-9 h-9 rounded-full bg-white border border-slate-200 hover:border-[#e05a1e] text-slate-700 hover:text-[#e05a1e] flex items-center justify-center shadow-sm cursor-pointer active:scale-90"
            aria-label="Next Review"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </section>

    </div>
  );
};
