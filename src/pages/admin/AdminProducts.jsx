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
  AlertTriangle
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
      showToast('New formulation added to dispensary catalog!', 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteConfirmId(null);
    showToast('Product deactivated and removed from catalog', 'info');
  };

  const handleDuplicate = (product) => {
    const duplicated = {
      ...product,
      id: 'prod-' + Date.now(),
      name: `${product.name} (Copy)`,
      sku: `${product.sku}-CP`,
      slug: `${product.slug}-copy`
    };
    setProducts(prev => [duplicated, ...prev]);
    showToast('Product duplicated as draft', 'info');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brandOrange-600">Dispensary Stock</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">Products Management</h1>
          <p className="text-xs text-slate-500">Manage formulations, pricing, inventory stock thresholds, and SEO.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brandOrange-500 hover:bg-brandOrange-600 text-white rounded-xl text-xs font-bold shadow-md transition-smooth"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brandOrange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700"
          >
            {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-100">
                <th className="py-3 px-4 font-bold">Product</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">SKU</th>
                <th className="py-3 px-4 font-bold">Price</th>
                <th className="py-3 px-4 font-bold">Stock</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-xl object-cover bg-slate-100 shrink-0" />
                      <div>
                        <h4 className="font-bold text-navy-900 line-clamp-1">{prod.name}</h4>
                        {prod.isBestSeller && <span className="text-[10px] text-brandOrange-600 font-extrabold">★ Best Seller</span>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-600">{prod.category}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{prod.sku}</td>
                  <td className="py-3 px-4 font-extrabold text-navy-900">₹{prod.offerPrice || prod.regularPrice}</td>
                  <td className="py-3 px-4">
                    <span className={`font-bold ${prod.stock <= 5 ? 'text-rose-600' : 'text-slate-700'}`}>
                      {prod.stock} units
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      prod.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {prod.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleDuplicate(prod)}
                        title="Duplicate"
                        className="p-1.5 text-slate-400 hover:text-navy-900 hover:bg-slate-100 rounded-lg"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        title="Edit"
                        className="p-1.5 text-slate-400 hover:text-brandOrange-600 hover:bg-brandOrange-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(prod.id)}
                        title="Delete"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
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
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-navy-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {categoriesList.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Regular Price (₹)</label>
                  <input
                    type="number"
                    value={formData.regularPrice}
                    onChange={(e) => setFormData({ ...formData, regularPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Offer Price (₹)</label>
                  <input
                    type="number"
                    value={formData.offerPrice}
                    onChange={(e) => setFormData({ ...formData, offerPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="rounded text-brandOrange-500"
                  />
                  <span>Mark as Best Seller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-brandOrange-500"
                  />
                  <span>Featured on Home</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brandOrange-500 hover:bg-brandOrange-600 text-white font-bold rounded-xl shadow-sm"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-navy-900 text-sm">Deactivate Product?</h3>
            <p className="text-xs text-slate-500">This remedy will be marked inactive and removed from live patient browsing.</p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl"
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
