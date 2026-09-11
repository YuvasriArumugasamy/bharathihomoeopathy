import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  Check, 
  X, 
  Star, 
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { initialAdminProducts } from '../../data/adminProductsData';
import { useToast } from '../../context/ToastContext';
import { slugify } from '../../utils/slugify';

export const AdminProducts = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState(initialAdminProducts);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Homeopathic Medicines',
    regularPrice: 399,
    offerPrice: 349,
    stock: 25,
    shortDescription: '',
    description: '',
    image: '',
    status: 'Active',
    isBestSeller: false,
    isFeatured: false
  });

  const categoriesList = ['All', 'Homeopathic Medicines', 'Mother Tinctures', 'Biochemic Medicines', 'Wellness Products', 'Personal Care', 'Combo Products'];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && p.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `HOM-${Math.floor(100 + Math.random() * 900)}`,
      category: 'Homeopathic Medicines',
      regularPrice: 399,
      offerPrice: 349,
      stock: 25,
      shortDescription: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      status: 'Active',
      isBestSeller: false,
      isFeatured: false
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) {
      showToast('Product name and SKU are required', 'warning');
      return;
    }

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...formData, slug: slugify(formData.name) } : p));
      showToast('Product updated successfully!', 'success');
    } else {
      const newProd = {
        ...formData,
        id: 'prod-' + Date.now(),
        slug: slugify(formData.name),
        createdAt: new Date().toISOString().slice(0, 10)
      };
      setProducts(prev => [newProd, ...prev]);
      showToast('New remedy added to dispensary catalogue!', 'success');
    }
    setModalOpen(false);
  };

  const handleDuplicate = (product) => {
    const duplicated = {
      ...product,
      id: 'prod-' + Date.now(),
      name: `${product.name} (Copy)`,
      sku: `${product.sku}-COPY`,
      slug: slugify(`${product.name}-copy`),
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setProducts(prev => [duplicated, ...prev]);
    showToast('Product duplicated as draft!', 'info');
  };

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteConfirmId(null);
    showToast('Product removed from active catalogue', 'info');
  };

  const lowStockCount = products.filter(p => p.stock <= 10).length;

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. Hero Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] p-6 sm:p-8 lg:p-9 rounded-[2.25rem] border border-white/30 shadow-2xl shadow-orange-500/20 text-white mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-amber-300/25 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-5 text-center sm:text-left">
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-wide font-serif italic text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            Products & Remedies Catalog
          </h1>
          <button
            onClick={handleOpenAdd}
            className="w-full sm:w-auto justify-center relative z-10 inline-flex items-center gap-2.5 px-5 py-3.5 bg-white hover:bg-orange-50 text-orange-600 rounded-2xl text-xs sm:text-sm font-black shadow-xl shadow-black/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-white shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Remedy</span>
          </button>
        </div>
      </div>

      {/* 2. Filter & Command Bar */}
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search by remedy name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner font-medium placeholder:text-slate-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-brandOrange-500 transition-all cursor-pointer shadow-2xs"
          >
            {categoriesList.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-brandOrange-500 transition-all cursor-pointer shadow-2xs"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          <span className="text-xs text-slate-500 font-bold hidden lg:inline">
            <span className="text-slate-900 font-black">{filteredProducts.length}</span> items
          </span>
        </div>
      </div>

      {/* 3. Luxury Products Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] overflow-hidden">
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/90 text-slate-400 uppercase tracking-wider text-[10px] font-black border-b border-slate-100">
                <th className="py-3.5 px-5">Remedy / Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/90">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3.5">
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        className="w-12 h-12 rounded-2xl object-cover bg-slate-100 border border-slate-200/80 shrink-0 shadow-xs group-hover:scale-105 transition-transform" 
                      />
                      <div>
                        <h4 className="font-extrabold text-slate-900 line-clamp-1 group-hover:text-brandOrange-600 transition-colors">
                          {prod.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          {prod.isBestSeller && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                              Best Seller
                            </span>
                          )}
                          {prod.isFeatured && (
                            <span className="text-[9px] font-black text-purple-600 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {prod.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                    {prod.sku}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 text-sm font-display">
                        ₹{prod.offerPrice || prod.regularPrice}
                      </span>
                      {prod.regularPrice > (prod.offerPrice || prod.regularPrice) && (
                        <span className="text-[10px] text-slate-400 line-through font-semibold">
                          ₹{prod.regularPrice}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1 max-w-[100px]">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className={prod.stock <= 5 ? 'text-rose-600 font-black' : 'text-slate-700'}>
                          {prod.stock} units
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            prod.stock <= 5 ? 'bg-rose-500' : prod.stock <= 15 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, (prod.stock / 50) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs ${
                      prod.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : prod.status === 'Draft'
                        ? 'bg-slate-100 text-slate-600 border-slate-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        prod.status === 'Active' ? 'bg-emerald-500' : prod.status === 'Draft' ? 'bg-slate-400' : 'bg-rose-500'
                      }`} />
                      {prod.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleDuplicate(prod)}
                        title="Duplicate Remedy"
                        className="p-2 text-slate-400 hover:text-navy-950 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        title="Edit Remedy"
                        className="p-2 text-slate-400 hover:text-brandOrange-600 hover:bg-brandOrange-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(prod.id)}
                        title="Delete Remedy"
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="md:hidden flex flex-col gap-3 p-3">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id + '-card'}
              onClick={() => handleOpenEdit(prod)}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex items-start gap-3 cursor-pointer active:scale-[0.98] transition-all hover:shadow-md hover:border-orange-200"
            >
              <img
                src={prod.image}
                alt={prod.name}
                className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200/80 shrink-0 shadow-xs"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2 flex-1">{prod.name}</h4>
                  <span className={`shrink-0 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                    prod.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : prod.status === 'Draft' ? 'bg-slate-100 text-slate-600 border-slate-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    <span className={`w-1 h-1 rounded-full ${
                      prod.status === 'Active' ? 'bg-emerald-500' : prod.status === 'Draft' ? 'bg-slate-400' : 'bg-rose-500'
                    }`} />
                    {prod.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">{prod.category}</span>
                  {prod.isBestSeller && (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-lg border border-amber-200">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Best Seller
                    </span>
                  )}
                  {prod.isFeatured && (
                    <span className="text-[9px] font-black text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-lg border border-purple-200">Featured</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-black text-slate-900 text-sm">₹{prod.offerPrice || prod.regularPrice}</span>
                    {prod.regularPrice > (prod.offerPrice || prod.regularPrice) && (
                      <span className="text-[10px] text-slate-400 line-through font-semibold">₹{prod.regularPrice}</span>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${prod.stock <= 5 ? 'text-rose-600 bg-rose-50' : 'text-slate-500 bg-slate-100'}`}>
                    {prod.stock} in stock
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 4. Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.25rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-100">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brandOrange-50 text-brandOrange-600">
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="font-black text-slate-900 text-base font-display">
                  {editingProduct ? 'Edit Remedy' : 'Add New Remedy to Dispensary'}
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Remedy Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Arnica Montana 30C Dilution"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">SKU / Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Therapeutic Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner cursor-pointer"
                  >
                    {categoriesList.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Regular Price (₹)</label>
                  <input
                    type="number"
                    value={formData.regularPrice}
                    onChange={(e) => setFormData({ ...formData, regularPrice: Number(e.target.value) })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Offer Price (₹)</label>
                  <input
                    type="number"
                    value={formData.offerPrice}
                    onChange={(e) => setFormData({ ...formData, offerPrice: Number(e.target.value) })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Inventory Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Indication, key therapeutic uses, and dosage guidance..."
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="rounded text-brandOrange-500 focus:ring-brandOrange-500 w-4 h-4"
                  />
                  <span className="font-extrabold text-slate-700">Mark as Best Seller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-brandOrange-500 focus:ring-brandOrange-500 w-4 h-4"
                  />
                  <span className="font-extrabold text-slate-700">Feature on Patient Home</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
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
                  Save Remedy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-100">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-200 shadow-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="font-black text-slate-900 text-base font-display">Deactivate Remedy?</h3>
            <p className="text-xs text-slate-500 font-medium">This homeopathic formulation will be removed from live patient browsing.</p>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md shadow-rose-600/20 transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;
