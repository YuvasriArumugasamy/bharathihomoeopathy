import React, { useState } from 'react';
import { Layers, Plus, Edit, Trash2, Search, Check, X, Star, Sparkles, FolderPlus, ArrowUpRight } from 'lucide-react';
import { initialAdminCategories } from '../../data/adminCategoriesData';
import { useToast } from '../../context/ToastContext';
import { slugify } from '../../utils/slugify';

export const AdminCategories = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState(initialAdminCategories);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    status: 'Active',
    isFeatured: false
  });

  const totalRemedies = categories.reduce((sum, c) => sum + (c.productCount || 0), 0);
  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
      status: 'Active',
      isFeatured: false
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ ...cat });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCategory) {
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...formData, slug: slugify(formData.name) } : c));
      showToast('Category updated successfully!', 'success');
    } else {
      const newCat = {
        ...formData,
        id: 'cat-' + Date.now(),
        slug: slugify(formData.name),
        productCount: 0,
        createdAt: new Date().toISOString().slice(0, 10)
      };
      setCategories(prev => [...prev, newCat]);
      showToast('New category added to dispensary!', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = (cat) => {
    if (cat.productCount > 0) {
      showToast(`Cannot delete category because ${cat.productCount} active products are assigned to it.`, 'warning');
      return;
    }
    setCategories(prev => prev.filter(c => c.id !== cat.id));
    showToast('Category deleted successfully', 'info');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. Hero Header Banner */}
      <div className="relative bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brandOrange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brandOrange-50 border border-brandOrange-200 text-brandOrange-700 font-extrabold text-[10px] uppercase tracking-widest shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-brandOrange-600" />
              Dispensary Organization
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
              {categories.length} Categories • {totalRemedies} Total Remedies
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
            Categories Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl font-medium">
            Organize homeopathic remedies by potencies, mother tinctures, biocombinations, and clinical therapeutic groups.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="relative z-10 inline-flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-brandOrange-500 via-orange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-brandOrange-500/25 hover:shadow-brandOrange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-white/20 shrink-0"
        >
          <FolderPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* 2. Search & Command Bar */}
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search category by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner placeholder:text-slate-400 font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 font-bold self-end sm:self-center">
          Showing <span className="text-slate-900 font-black">{filtered.length}</span> of {categories.length} categories
        </div>
      </div>

      {/* 3. Luxury Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((cat) => (
          <div 
            key={cat.id} 
            className="group relative bg-white rounded-[2rem] border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(15,36,56,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            {/* Image Preview with Floating Badges */}
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Product Count Pill */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-black text-slate-800 shadow-sm border border-white/40">
                {cat.productCount} Remedies
              </div>

              {/* Status Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-500/90 text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold backdrop-blur-sm shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {cat.status || 'Active'}
              </div>

              {/* Category Title on image bottom */}
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="font-extrabold text-white text-base sm:text-lg drop-shadow-md">
                  {cat.name}
                </h3>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                {cat.description || 'Dedicated collection of authentic homeopathic remedies and therapeutic dilutions.'}
              </p>

              {/* Footer Slug & Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-brandOrange-600 bg-brandOrange-50 px-2.5 py-1 rounded-lg font-mono font-bold border border-brandOrange-200/60">
                  /{cat.slug}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 text-slate-500 hover:text-brandOrange-600 hover:bg-brandOrange-50 rounded-xl transition-colors cursor-pointer border border-slate-200/70 hover:border-brandOrange-200"
                    title="Edit Category"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-slate-200/70 hover:border-rose-200"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* 4. Glassmorphic Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brandOrange-50 text-brandOrange-600">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="font-black text-slate-900 text-base font-display">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </h3>
              </div>
              <button 
                onClick={() => setModalOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Mother Tinctures"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the therapeutic scope or remedy forms..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)} 
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-gradient-to-r from-brandOrange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white font-black rounded-xl shadow-md shadow-brandOrange-500/25 transition-all cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCategories;
