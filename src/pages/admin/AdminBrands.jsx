import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Check, 
  X, 
  Upload, 
  Package, 
  Sparkles,
  Building2,
  ExternalLink,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { brandService } from '../../services/brandService';
import { useToast } from '../../context/ToastContext';
import { slugify } from '../../utils/slugify';
import { getStoredProducts } from '../../utils/productStorage';

export const AdminBrands = () => {
  const { showToast } = useToast();
  const [allProducts, setAllProducts] = useState(() => getStoredProducts());

  useEffect(() => {
    const handleProdSync = () => setAllProducts(getStoredProducts());
    window.addEventListener('drBharathiProductsUpdated', handleProdSync);
    window.addEventListener('storage', handleProdSync);
    return () => {
      window.removeEventListener('drBharathiProductsUpdated', handleProdSync);
      window.removeEventListener('storage', handleProdSync);
    };
  }, []);

  const getBrandId = (b) => b?.id || b?._id || b?.slug || b?.name;

  const [brands, setBrands] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_brands_store');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((b, idx) => ({
            ...b,
            id: b.id || b._id || `brand-${idx + 1}`,
            _id: b._id || b.id || `brand-${idx + 1}`
          }));
        }
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      const data = await brandService.getAdminBrands();
      if (data && Array.isArray(data)) {
        setBrands(data);
      }
    };
    fetchBrands();

    const handleSync = () => {
      const stored = brandService.getAdminBrands();
      if (stored instanceof Promise) {
        stored.then(data => { if (Array.isArray(data)) setBrands(data); });
      }
    };

    window.addEventListener('drBharathiBrandsUpdated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('drBharathiBrandsUpdated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    status: 'Active',
    originCountry: 'India'
  });

  const validBrands = Array.isArray(brands) ? brands.filter(Boolean) : [];
  const filtered = validBrands.filter(b => 
    (b.name || '').toLowerCase().includes((search || '').toLowerCase()) ||
    (b.description || '').toLowerCase().includes((search || '').toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingBrand(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      status: 'Active',
      originCountry: 'India'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name || '',
      description: brand.description || '',
      image: brand.image || brand.logo || '',
      status: brand.status || 'Active',
      originCountry: brand.originCountry || 'India'
    });
    setModalOpen(true);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size should be less than 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
      showToast('Brand logo uploaded successfully!', 'success');
    };
    reader.onerror = () => {
      showToast('Failed to read image file', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const cleanName = formData.name.trim();
    if (!cleanName) {
      showToast('Please enter brand name', 'error');
      return;
    }

    if (editingBrand) {
      const editId = getBrandId(editingBrand);
      const updatedBrand = {
        ...editingBrand,
        ...formData,
        name: cleanName,
        id: editingBrand.id || editId,
        _id: editingBrand._id || editId,
        slug: slugify(cleanName)
      };
      setBrands(prev => prev.map(b => getBrandId(b) === editId ? updatedBrand : b));
      await brandService.updateAdminBrand(editId, updatedBrand);
      showToast(`Brand "${cleanName}" updated successfully!`, 'success');
    } else {
      // Check duplicate
      const exists = validBrands.some(b => b.name.toLowerCase() === cleanName.toLowerCase());
      if (exists) {
        showToast(`Brand "${cleanName}" already exists!`, 'error');
        return;
      }

      const generatedId = 'brand-' + Date.now();
      const newBrand = {
        ...formData,
        name: cleanName,
        id: generatedId,
        _id: generatedId,
        slug: slugify(cleanName),
        productCount: 0,
        createdAt: new Date().toISOString().slice(0, 10)
      };
      setBrands(prev => [...prev, newBrand]);
      await brandService.createAdminBrand(newBrand);
      showToast(`Brand "${cleanName}" added successfully! It is now available in the product dropdown.`, 'success');
    }
    setModalOpen(false);
  };

  const handleDelete = async (brand) => {
    const remediesCount = allProducts.filter(p => (p.brand || '').toLowerCase() === (brand.name || '').toLowerCase()).length;
    let message = `Are you sure you want to delete "${brand.name}" brand?`;
    if (remediesCount > 0) {
      message += ` Warning: ${remediesCount} remedy products currently use this brand!`;
    }

    const isConfirmed = window.confirm(message);
    if (!isConfirmed) return;

    const targetId = getBrandId(brand);
    setBrands(prev => prev.filter(b => getBrandId(b) !== targetId));
    await brandService.deleteAdminBrand(targetId);
    showToast(`Brand "${brand.name}" removed successfully`, 'info');
  };

  // Quick Seed Popular Brands if admin wants quick setup
  const handleQuickSeedPopular = async () => {
    const popularBrands = [
      { name: 'SBL', description: 'Premier Indian homeopathic pharmacy offering standard potencies and dilutions.', originCountry: 'India' },
      { name: 'Dr. Reckeweg', description: 'Renowned German homeopathic manufacturer renowned for proprietary R-series drops.', originCountry: 'Germany' },
      { name: 'Willmar Schwabe', description: 'World leader in classic homoeopathic medicine from Germany and India.', originCountry: 'Germany / India' },
      { name: 'BJain', description: 'Trusted homoeopathic pharmaceuticals, mother tinctures and biocombinations.', originCountry: 'India' },
      { name: 'Wheezal', description: 'Specialized homeopathic dilutions, syrups and biochemic remedies.', originCountry: 'India' },
      { name: "Bakson's", description: 'Specialized healthcare & homoeopathic personal care solutions.', originCountry: 'India' }
    ];

    const currentNames = new Set(validBrands.map(b => b.name.toLowerCase()));
    const toAdd = popularBrands.filter(b => !currentNames.has(b.name.toLowerCase()));

    if (toAdd.length === 0) {
      showToast('All popular brands are already added!', 'info');
      return;
    }

    let addedCount = 0;
    const newItems = [];
    for (const item of toAdd) {
      const generatedId = 'brand-' + (Date.now() + addedCount);
      const brandObj = {
        ...item,
        id: generatedId,
        _id: generatedId,
        slug: slugify(item.name),
        image: '',
        status: 'Active',
        productCount: 0,
        createdAt: new Date().toISOString().slice(0, 10)
      };
      newItems.push(brandObj);
      await brandService.createAdminBrand(brandObj);
      addedCount++;
    }

    setBrands(prev => [...prev, ...newItems]);
    showToast(`Added ${addedCount} popular homeopathic brands!`, 'success');
  };

  return (
    <div className="space-y-6 pb-12 font-serif">
      
      {/* 1. Hero Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] p-6 sm:p-8 lg:p-9 rounded-[2.25rem] border border-white/30 shadow-2xl shadow-orange-500/20 text-white mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-amber-300/25 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-5 text-center sm:text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-black uppercase tracking-wider text-amber-100 mb-2 border border-white/20">
              <Award className="w-3.5 h-3.5 text-amber-200" />
              <span>Manufacturer Directory</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-wide font-serif italic text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              Brand / Manufacturer Management
            </h1>
            <p className="text-white/90 text-xs sm:text-sm mt-1 max-w-xl">
              Add and manage medicine brands. Only brands created here will appear in the Product creation dropdown.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
            <button
              onClick={handleOpenAdd}
              className="w-full sm:w-auto justify-center relative z-10 inline-flex items-center gap-2.5 px-5 py-3.5 bg-white hover:bg-orange-50 text-orange-600 rounded-2xl text-xs sm:text-sm font-black shadow-xl shadow-black/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-white shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Brand</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Search & Command Bar */}
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search brand name or description..."
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

        <div className="flex items-center gap-3">
          {validBrands.length === 0 && (
            <button
              onClick={handleQuickSeedPopular}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-brandOrange-700 font-bold text-xs border border-orange-200 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-brandOrange-600" />
              Quick Import Popular Brands
            </button>
          )}
          <div className="text-xs text-slate-500 font-bold self-end sm:self-center">
            Showing <span className="text-slate-900 font-black">{filtered.length}</span> of {validBrands.length} brands
          </div>
        </div>
      </div>

      {/* 3. Luxury Brand Cards Grid or Empty State */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((brand) => {
            const remediesCount = allProducts.filter(p => (p.brand || '').toLowerCase() === (brand.name || '').toLowerCase()).length;
            const brandKey = getBrandId(brand);
            const initials = (brand.name || 'B').slice(0, 2).toUpperCase();

            return (
              <div 
                key={brandKey} 
                className="group relative bg-white rounded-[2rem] border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(15,36,56,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Brand Header Banner */}
                <div className="p-6 bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/20 border-b border-slate-100 flex items-start gap-4">
                  {/* Logo or Initial Avatar */}
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border-2 border-orange-200 shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {brand.image ? (
                      <img 
                        src={brand.image} 
                        alt={brand.name} 
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-full h-full bg-gradient-to-br from-brandOrange-500 to-amber-500 text-white font-black text-lg flex items-center justify-center ${brand.image ? 'hidden' : 'flex'}`}
                    >
                      {initials}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-extrabold text-slate-900 text-lg truncate group-hover:text-brandOrange-600 transition-colors">
                        {brand.name}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border shrink-0 ${
                        brand.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${brand.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {brand.status || 'Active'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brandOrange-700 bg-brandOrange-50 px-2 py-0.5 rounded-lg border border-brandOrange-200/60">
                        <Package className="w-3 h-3 text-brandOrange-600" />
                        {remediesCount} {remediesCount === 1 ? 'Remedy' : 'Remedies'}
                      </span>
                      {brand.originCountry && (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                          📍 {brand.originCountry}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Body & Description */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-medium">
                    {brand.description || 'Authentic homoeopathic manufacturer formulating standard dilutions, potencies, and remedies.'}
                  </p>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 font-bold truncate max-w-[140px]">
                      Slug: /{brand.slug || slugify(brand.name)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(brand)}
                        title="Edit Brand"
                        className="p-2 text-slate-500 hover:text-brandOrange-600 hover:bg-orange-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(brand)}
                        title="Delete Brand"
                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-slate-200/90 p-12 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-brandOrange-50 text-brandOrange-600 flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg font-serif">
            {search ? 'No matching brands found' : 'No Brands Added Yet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {search 
              ? 'Try adjusting your search query to find the brand you are looking for.' 
              : 'Add your manufacturer / brand names here first. Once added, they will appear dynamically in the Add/Edit Product dropdown.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brandOrange-500 hover:bg-brandOrange-600 text-white rounded-xl text-xs font-black shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Brand</span>
            </button>
            <button
              onClick={handleQuickSeedPopular}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-brandOrange-500" />
              <span>Import Popular Brands (SBL, Reckeweg, etc.)</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Add / Edit Brand Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-md">
          <div className="bg-white rounded-[2.25rem] max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-100">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brandOrange-50 text-brandOrange-600">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-black text-slate-900 text-base font-display">
                  {editingBrand ? 'Edit Brand / Manufacturer' : 'Add New Brand / Manufacturer'}
                </h3>
              </div>
              <button 
                onClick={() => setModalOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Brand / Manufacturer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SBL, Willmar Schwabe, Dr. Reckeweg, BJain"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Origin / Country (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. India, Germany, Switzerland"
                  value={formData.originCountry}
                  onChange={(e) => setFormData({ ...formData, originCountry: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Description / About Brand</label>
                <textarea
                  rows={3}
                  placeholder="Short note about the brand, pharmacy standards, or specialties..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner resize-none"
                />
              </div>

              {/* Logo Upload & URL */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Brand Logo (Optional)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Paste image URL (https://...)"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
                  />
                  <label className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0">
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {formData.image && (
                  <div className="mt-3 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <img 
                      src={formData.image} 
                      alt="Logo preview" 
                      className="w-12 h-12 object-contain bg-white rounded-lg border border-slate-200 p-1" 
                    />
                    <div className="flex-1 text-[11px] font-bold text-slate-600 truncate">
                      Logo preview
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner cursor-pointer"
                >
                  <option value="Active">Active (Available for products)</option>
                  <option value="Inactive">Inactive (Hidden from selection)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brandOrange-500 hover:bg-brandOrange-600 text-white font-black rounded-xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingBrand ? 'Save Changes' : 'Create Brand'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminBrands;
