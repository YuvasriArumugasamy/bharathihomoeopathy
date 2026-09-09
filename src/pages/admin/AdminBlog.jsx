import React, { useState } from 'react';
import { 
  BookOpen, Plus, Edit, Trash2, Search, X, Check, Eye, 
  Calendar, User, Sparkles, Folder, Clock, ArrowRight, Tag
} from 'lucide-react';
import { initialAdminBlogs } from '../../data/adminBlogData';
import { useToast } from '../../context/ToastContext';
import { slugify } from '../../utils/slugify';

export const AdminBlog = () => {
  const { showToast } = useToast();
  const [blogs, setBlogs] = useState(initialAdminBlogs);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Homeopathy',
    shortDescription: '',
    content: '',
    featuredImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    status: 'Published'
  });

  // Metrics
  const totalArticles = blogs.length;
  const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);
  const categoriesList = ['All', ...new Set(blogs.map(b => b.category))];

  const filtered = blogs.filter(b => {
    const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      b.title.toLowerCase().includes(q) || 
      b.shortDescription.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      category: 'Homeopathy',
      shortDescription: '',
      content: '',
      featuredImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
      status: 'Published'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingBlog(b);
    setFormData({ ...b });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingBlog) {
      setBlogs(prev => prev.map(b => b.id === editingBlog.id ? { 
        ...b, 
        ...formData, 
        slug: slugify(formData.title) 
      } : b));
      showToast('Article updated successfully!', 'success');
    } else {
      const newPost = {
        ...formData,
        id: 'blog-' + Date.now(),
        slug: slugify(formData.title),
        author: 'Dr. Bharathi Care Team',
        publishDate: new Date().toISOString().slice(0, 10),
        views: 0,
        createdAt: new Date().toISOString().slice(0, 10)
      };
      setBlogs(prev => [newPost, ...prev]);
      showToast('New health article published to wellness journal!', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setBlogs(prev => prev.filter(b => b.id !== id));
    showToast('Article removed from publication', 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] p-7 sm:p-9 rounded-[2.25rem] border border-white/30 shadow-2xl shadow-orange-500/20 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-amber-300/25 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-slate-900 text-[10.5px] font-black tracking-widest uppercase shadow-md border border-white">
              <BookOpen className="w-3.5 h-3.5 text-orange-600 stroke-[2.5]" />
              Patient Health & Wellness Journal
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              Blog & Article Management
            </h1>
            <p className="text-white text-xs sm:text-sm max-w-xl font-bold leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
              Educate patients with homeopathy healing guides, seasonal wellness routines, and clinical research insights.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAdd}
              className="px-6 py-3.5 bg-white hover:bg-orange-50 text-orange-600 font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-black/15 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2.5 border border-white group"
            >
              <Plus className="w-4 h-4 stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
              <span>Write Article</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Published Articles</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-navy-900">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-navy-950">{totalArticles}</span>
            <span className="text-xs text-slate-400 font-semibold">Guides</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Readership</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{totalViews.toLocaleString('en-IN')}</span>
            <span className="text-xs text-emerald-700/80 font-semibold">Article views</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Topics & Specialties</span>
            <div className="w-9 h-9 rounded-xl bg-brandOrange-50 flex items-center justify-center text-brandOrange-600">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-brandOrange-600">{categoriesList.length - 1}</span>
            <span className="text-xs text-brandOrange-700/80 font-semibold">Categories</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Editorial Status</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-sky-600">100%</span>
            <span className="text-xs text-sky-700/80 font-semibold">Active & Live</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white/95 backdrop-blur-sm p-5 rounded-[2rem] border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search article titles, health topics, or excerpt text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
          />
        </div>

        {/* Categories Chips */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-smooth ${
                selectedCategory === cat
                  ? 'bg-navy-950 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-navy-900 border border-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white/95 backdrop-blur-sm rounded-[2.25rem] border border-slate-200/90 p-12 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-navy-950">No Articles Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No journal entries match your selected category or search keywords.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((b) => (
            <div 
              key={b.id} 
              className="group bg-white/95 backdrop-blur-sm rounded-[2rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] hover:shadow-xl hover:border-brandOrange-200 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Cover Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img 
                    src={b.featuredImage} 
                    alt={b.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-brandOrange-600 font-black text-[10px] rounded-full uppercase tracking-wider shadow-sm border border-white/60">
                      {b.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2.5 py-1 bg-navy-950/80 backdrop-blur-md text-white font-bold text-[10px] rounded-lg flex items-center gap-1 shadow-sm">
                      <Eye className="w-3 h-3 text-amber-400" />
                      {b.views || 0} views
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="font-heading font-black text-base text-navy-950 line-clamp-2 group-hover:text-brandOrange-600 transition-colors">
                    {b.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                    {b.shortDescription}
                  </p>

                  <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      {b.author || 'Dr. Bharathi Care'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {b.publishDate || b.createdAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {b.status || 'Published'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-2 text-slate-500 hover:text-brandOrange-600 hover:bg-brandOrange-50 rounded-xl transition-all"
                    title="Edit Article"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Delete Article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Article Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.25rem] p-7 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-brandOrange-500">Wellness Journal</span>
                <h3 className="font-heading font-black text-navy-950 text-lg">
                  {editingBlog ? 'Edit Health Article' : 'Write New Article'}
                </h3>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Article Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Natural Homeopathic Remedies for Monsoon Allergies"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-bold text-navy-950 text-sm focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Specialty Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-medium text-slate-800"
                  >
                    <option value="Homeopathy">Homeopathy Science</option>
                    <option value="Seasonal Health">Seasonal Health</option>
                    <option value="Diet & Lifestyle">Diet & Lifestyle</option>
                    <option value="Pediatric Care">Pediatric Care</option>
                    <option value="Chronic Care">Chronic Wellness</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Publication Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-medium text-slate-800"
                  >
                    <option value="Published">Published (Live)</option>
                    <option value="Draft">Draft Queue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Featured Cover Image URL</label>
                <input
                  type="text"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-mono text-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Brief Excerpt *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Summary of the key medical advice and guidance..."
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Full Article Content *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Detailed patient guidance, dosage advice, and medical explanation..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all leading-relaxed"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-brandOrange-500 via-orange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white font-black rounded-xl shadow-lg shadow-brandOrange-500/25 transition-all"
                >
                  {editingBlog ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
