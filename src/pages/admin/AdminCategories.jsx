import React, { useState } from 'react';
import { Layers, Plus, Edit, Trash2, Search, Check, X, Star } from 'lucide-react';
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
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brandOrange-600">Dispensary Organization</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">Categories Management</h1>
          <p className="text-xs text-slate-500">Organize remedies by pharmaceutical dilutions, mother tinctures, and wellness groups.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brandOrange-500 hover:bg-brandOrange-600 text-white rounded-xl text-xs font-bold shadow-md transition-smooth"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 hover:shadow-premium transition-smooth flex flex-col justify-between">
            <div className="space-y-3">
              <div className="aspect-[16/9] rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-navy-900">{cat.name}</h3>
                  <span className="px-2 py-0.5 bg-brandOrange-50 text-brandOrange-600 font-bold text-[10px] rounded-full">
                    {cat.productCount} remedies
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{cat.description}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">/{cat.slug}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 text-slate-400 hover:text-brandOrange-600 hover:bg-brandOrange-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-navy-900 text-sm">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-brandOrange-500 text-white font-bold rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
