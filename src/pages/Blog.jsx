import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  User, 
  Clock, 
  ArrowRight, 
  Leaf, 
  ShieldCheck, 
  UserCheck, 
  Truck, 
  CreditCard,
  X
} from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { assets } from '../assets';
import { useToast } from '../context/ToastContext';

export const Blog = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [readingModalPost, setReadingModalPost] = useState(null);

  const blogPosts = [
    {
      id: 1,
      title: "How Homeopathy Works: The Natural Way to Heal",
      category: "WELLNESS",
      date: "May 20, 2024",
      author: "Dr. Bharathi",
      readTime: "5 min read",
      excerpt: "Discover the principles behind homeopathy and how it stimulates your body's natural healing ability.",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=700&q=80",
      content: "Homeopathy operates on the principle of 'Similia Similibus Curentur' or 'like cures like'. Highly diluted natural substances trigger the body's self-regulatory mechanisms without introducing toxic burdens."
    },
    {
      id: 2,
      title: "Boost Your Immunity Naturally with Homeopathy",
      category: "IMMUNITY",
      date: "May 15, 2024",
      author: "Dr. Bharathi",
      readTime: "4 min read",
      excerpt: "Simple and effective homeopathic remedies that can help strengthen your immune system.",
      image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=700&q=80",
      content: "Constitutional remedies such as Arsenicum Album, Echinacea, and Tinospora Cordifolia reinforce white blood cell responsiveness, offering gentle protective immunity."
    },
    {
      id: 3,
      title: "Homeopathy for Stress, Anxiety & Better Sleep",
      category: "MENTAL HEALTH",
      date: "May 10, 2024",
      author: "Dr. Bharathi",
      readTime: "6 min read",
      excerpt: "Natural remedies that help calm your mind, reduce anxiety and improve the quality of your sleep.",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=700&q=80",
      content: "Kali Phos and Coffea Cruda assist the parasympathetic nervous system, easing overactive thoughts and promoting natural restorative sleep patterns."
    },
    {
      id: 4,
      title: "Common Cold & Cough in Kids: Homeopathic Care",
      category: "CHILD CARE",
      date: "May 05, 2024",
      author: "Dr. Bharathi",
      readTime: "4 min read",
      excerpt: "Safe and gentle homeopathic solutions for cold, cough and other seasonal problems in children.",
      image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=700&q=80",
      content: "Because homeopathic globules taste sweet and carry zero chemical side effects, pediatric conditions like runny nose and barking cough respond wonderfully to remedies like Belladonna and Chamomilla."
    },
    {
      id: 5,
      title: "Homeopathy for PCOS: A Natural Support",
      category: "WOMEN'S HEALTH",
      date: "Apr 28, 2024",
      author: "Dr. Bharathi",
      readTime: "6 min read",
      excerpt: "How homeopathy can support hormonal balance and improve overall well-being in PCOS.",
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=700&q=80",
      content: "Pulsatilla, Sepia, and Calcarea Carb regulate ovarian function and metabolic rhythm, addressing root endocrine causes naturally."
    },
    {
      id: 6,
      title: "Healthy Lifestyle Tips for Better Living",
      category: "HEALTHY LIFESTYLE",
      date: "Apr 22, 2024",
      author: "Dr. Bharathi",
      readTime: "5 min read",
      excerpt: "Daily habits and lifestyle changes that can help you live a healthier and happier life.",
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=700&q=80",
      content: "Hydration, seasonal wholesome nutrition, moderate daily movement, and avoiding heavy artificial preservatives enhance remedy bioavailability."
    }
  ];

  const categories = [
    { name: "Wellness", count: 12, icon: "🌿" },
    { name: "Immunity", count: 10, icon: "🛡️" },
    { name: "Mental Health", count: 8, icon: "🧠" },
    { name: "Child Care", count: 7, icon: "👶" },
    { name: "Women's Health", count: 6, icon: "👩" },
    { name: "Healthy Lifestyle", count: 5, icon: "🥗" },
    { name: "FAQ & Tips", count: 4, icon: "❓" }
  ];

  const popularPosts = [
    {
      title: "How Homeopathy Works: The Natural Way to Heal",
      date: "May 20, 2024",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=200&q=80"
    },
    {
      title: "Boost Your Immunity Naturally with Homeopathy",
      date: "May 15, 2024",
      image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=200&q=80"
    },
    {
      title: "Homeopathy for Stress, Anxiety & Better Sleep",
      date: "May 10, 2024",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=200&q=80"
    },
    {
      title: "Common Cold & Cough in Kids: Homeopathic Care",
      date: "May 05, 2024",
      image: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&w=200&q=80"
    }
  ];

  const filteredPosts = blogPosts.filter((post) => {
    if (selectedCategory !== 'All' && !post.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q);
    }
    return true;
  });

  const handleBlogSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      showToast('Thank you for subscribing to Dr. Bharathi’s Health Blog!', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <div className="space-y-12 pb-12 w-full max-w-full overflow-x-hidden">
      
      {/* 1. Blog Hero Banner with Increased Height for Full Clear Image Visibility */}
      <section className="relative overflow-hidden min-h-[400px] sm:min-h-[460px] lg:min-h-[520px] flex items-start sm:items-center bg-[#f2f7f2] border-b border-slate-200/60 shadow-xs">
        {/* Crystal Clear Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={assets.blogBg}
            alt="Dr. Bharathi Natural Wellness Blog"
            className="w-full h-full object-cover object-left-bottom sm:object-center"
            style={{ imageRendering: '-webkit-optimize-contrast' }}
          />
        </div>

        {/* Content Box placed in the TOP RIGHT on mobile over the clean background area */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6 pb-12 sm:py-16 flex justify-end">
          <ScrollReveal direction="right" className="w-[62%] sm:w-full max-w-xs sm:max-w-lg lg:max-w-xl space-y-1.5 sm:space-y-3.5 flex flex-col items-end sm:items-start text-right sm:text-left">
            <nav className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-700 bg-white/75 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-emerald-200/40 w-fit">
              <Link to="/" className="hover:text-[#e05a1e] transition-colors">Home</Link>
              <span>&gt;</span>
              <span className="text-[#e05a1e] font-extrabold">Blog</span>
            </nav>

            <h1 className="text-xl sm:text-4xl lg:text-5xl font-black text-navy-950 tracking-tight leading-tight">
              Our <span className="text-[#e05a1e] font-serif italic">Blog</span>
            </h1>
            
            <p className="text-[10px] sm:text-sm text-slate-700 font-semibold leading-snug sm:leading-relaxed">
              Helpful tips, expert advice and natural health insights to help you and your family live a healthier life.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. Main 2-Column Blog Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Latest Blog Posts Grid (6 Cards) */}
          <main className="lg:col-span-8 space-y-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950 tracking-tight pb-2 border-b border-slate-100">
              Latest Blog Posts
            </h2>

            <div className="space-y-6">
              {filteredPosts.map((post, idx) => (
                <ScrollReveal key={post.id} direction="up" delay={idx * 60}>
                  <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 grid grid-cols-1 sm:grid-cols-12 gap-6 p-5 items-center">
                    <div className="sm:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>

                    <div className="sm:col-span-7 space-y-2.5">
                      <span className="text-[10px] font-black text-brandOrange-600 uppercase tracking-wider block">
                        {post.category}
                      </span>

                      <h3 className="font-extrabold text-base sm:text-lg text-navy-950 leading-snug hover:text-brandOrange-600 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-brandOrange-500" />
                          <span>{post.date}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-brandOrange-500" />
                          <span>{post.author}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brandOrange-500" />
                          <span>{post.readTime}</span>
                        </span>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => setReadingModalPost(post)}
                          className="text-xs font-bold text-brandOrange-600 hover:text-brandOrange-700 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Read More</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </main>

          {/* Right: Sidebar Widgets */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Search Blog */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                <input
                  type="text"
                  placeholder="Search blog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
                <button type="submit" className="p-2.5 bg-brandOrange-500 hover:bg-brandOrange-600 text-white">
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Categories List */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
              <h3 className="font-extrabold text-sm text-navy-950 pb-2 border-b border-slate-100">
                Categories
              </h3>
              <div className="space-y-2 text-xs text-slate-700">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left transition-colors ${
                    selectedCategory === 'All' ? 'bg-brandOrange-50 text-brandOrange-600 font-bold' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>📚</span>
                    <span>All Topics</span>
                  </span>
                  <span className="text-[11px] text-slate-400">({blogPosts.length})</span>
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-left transition-colors ${
                      selectedCategory === cat.name ? 'bg-brandOrange-50 text-brandOrange-600 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                    <span className="text-[11px] text-slate-400">({cat.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Posts */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
              <h3 className="font-extrabold text-sm text-navy-950 pb-2 border-b border-slate-100">
                Popular Posts
              </h3>
              <div className="space-y-3">
                {popularPosts.map((pop, i) => (
                  <div key={i} className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img src={pop.image} alt={pop.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-xs text-navy-950 line-clamp-2 group-hover:text-brandOrange-600 transition-colors">
                        {pop.title}
                      </h4>
                      <span className="text-[10px] text-slate-400">{pop.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscribe to Our Blog Card */}
            <div className="bg-[#fdfbf9] border border-amber-100 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="font-extrabold text-sm text-navy-950">
                Subscribe to Our Blog
              </h3>
              <p className="text-xs text-slate-600">
                Get the latest health tips and homeopathy updates straight to your inbox.
              </p>
              <form onSubmit={handleBlogSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brandOrange-500"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-brandOrange-500 hover:bg-brandOrange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-[10px] text-slate-400 flex items-center gap-1 justify-center">
                <span>🔒</span>
                <span>We respect your privacy. Unsubscribe anytime.</span>
              </p>
            </div>

            {/* Need Personal Advice? Consultation Box */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3 text-center">
              <h3 className="font-extrabold text-sm text-navy-950">
                Need Personal Advice?
              </h3>
              <p className="text-xs text-slate-500">
                Book an appointment with Dr. Bharathi for personalized homeopathic care.
              </p>
              <img
                src="https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=300&q=80"
                alt="Personal Consultation"
                className="w-24 h-16 object-cover rounded-xl mx-auto"
              />
              <Link
                to="/appointment"
                className="btn-gradient-orange w-full text-center"
              >
                Book Appointment
              </Link>
            </div>

          </aside>

        </div>
      </section>

      {/* 3. Five Trust Badges Strip at Bottom */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-navy-950">100% Natural</h4>
              <p className="text-[10px] text-slate-500 leading-tight">Safe & gentle homeopathic care</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-navy-950">No Side Effects</h4>
              <p className="text-[10px] text-slate-500 leading-tight">Non-toxic & highly effective</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-navy-950">Expert Doctors</h4>
              <p className="text-[10px] text-slate-500 leading-tight">Experienced & caring professionals</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-navy-950">Fast & Safe Delivery</h4>
              <p className="text-[10px] text-slate-500 leading-tight">On all orders above ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-navy-950">Secure Payments</h4>
              <p className="text-[10px] text-slate-500 leading-tight">100% safe & secure checkout</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reading Article Modal */}
      {readingModalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setReadingModalPost(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-black text-brandOrange-600 uppercase tracking-wider block">
              {readingModalPost.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950 leading-snug">
              {readingModalPost.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-slate-400 pb-3 border-b border-slate-100">
              <span>Published: {readingModalPost.date}</span>
              <span>•</span>
              <span>By {readingModalPost.author}</span>
              <span>•</span>
              <span>{readingModalPost.readTime}</span>
            </div>

            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100">
              <img src={readingModalPost.image} alt={readingModalPost.title} className="w-full h-full object-cover" />
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 pt-2">
              <p className="font-medium text-slate-900">{readingModalPost.excerpt}</p>
              <p>{readingModalPost.content}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
