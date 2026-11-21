import React, { useState, useEffect } from 'react';
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
  ExternalLink, 
  Upload,
  Loader2,
  RotateCcw,
  Award,
  FolderPlus,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { brandService } from '../../services/brandService';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';
import { filterLegacySeedCategories } from '../../utils/categoryDefaults';
import { slugify } from '../../utils/slugify';
import { demoProducts } from '../../data/products';
import { resolveProductImage } from '../../utils/productStorage';
import { sizeOptionService } from '../../services/sizeOptionService';

const getProductImageFallback = (product) => {
  return resolveProductImage(product);
};

const getSizeOptionName = (option) => String(
  typeof option === 'string' ? option : (option?.name || option?.size || '')
).trim();

const handleProductImageError = (event, product) => {
  const fallback = getProductImageFallback(product);
  if (fallback && event.currentTarget.src !== new URL(fallback, window.location.href).href) {
    event.currentTarget.onerror = null;
    event.currentTarget.src = fallback;
  }
};

const ModalSelect = ({ value, onChange, options, placeholder, label, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full min-w-0" onKeyDown={(event) => {
      if (event.key === 'Escape') setIsOpen(false);
    }}>
      <button
        type="button"
        role="combobox"
        aria-label={label}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-required="true"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((open) => !open)}
        className={`w-full min-w-0 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-left text-sm font-bold text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner flex items-center justify-between gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className={`min-w-0 truncate ${value ? '' : 'text-slate-400'}`}>{value || placeholder}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div role="listbox" aria-label={label} className="mt-1 w-full max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {options.length > 0 ? options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={value === option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-xs font-semibold whitespace-normal break-words hover:bg-orange-50 hover:text-brandOrange-700 ${value === option ? 'bg-orange-50 text-brandOrange-700' : 'text-slate-700'}`}
            >
              {option}
            </button>
          )) : (
            <p className="px-3 py-2 text-xs text-slate-500">No options available</p>
          )}
        </div>
      )}
    </div>
  );
};


const getProductSize = (p) => {
  if (!p) return '30 ml';
  if (Array.isArray(p.sizes) && p.sizes.length) return p.sizes.join(', ');
  if (p.size && String(p.size).trim()) return String(p.size).trim();
  if (p.volume && String(p.volume).trim()) return String(p.volume).trim();
  if (p.weight && String(p.weight).trim()) return `${p.weight}${p.unit || 'g'}`;
  const match = (p.name || '').match(/\(([^)]+ml|[^)]+g|[^)]+mg|[^)]+CH|[^)]+X)\)/i);
  if (match && match[1]) return match[1];
  return '30 ml';
};

export const AdminProducts = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const [stockOutModalOpen, setStockOutModalOpen] = useState(false);
  const [quickRestockMap, setQuickRestockMap] = useState({});

  const outOfStockProducts = (products || []).filter(p => {
    const s = Number(p.stock);
    return isNaN(s) || s <= 0 || p.status === 'Out of Stock';
  });

  const handleQuickRestock = async (productId, newStockValue) => {
    const qty = Number(newStockValue);
    if (isNaN(qty) || qty <= 0) {
      showToast('Please enter a valid stock quantity greater than 0', 'warning');
      return;
    }

    try {
      const prod = products.find(p => (p.id && p.id === productId) || (p._id && p._id === productId));
      if (!prod) return;

      const updated = {
        ...prod,
        stock: qty,
        status: 'Active'
      };

      await productService.updateAdminProduct(productId, updated);
      setProducts(prev => prev.map(p => {
        const isMatch = (p.id && p.id === productId) || (p._id && p._id === productId);
        return isMatch ? updated : p;
      }));

      setQuickRestockMap(prev => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });

      showToast(`Restocked "${prod.name}" with ${qty} units and marked Active!`, 'success');
    } catch (err) {
      showToast('Failed to update stock: ' + err.message, 'error');
    }
  };

  const [filterBestSellerOnly, setFilterBestSellerOnly] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Load products from service on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getAdminProducts();
        setProducts(data);
      } catch (err) {
        showToast('Failed to load products: ' + err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    brand: '',
    regularPrice: 0,
    offerPrice: 0,
    stock: 0,
    shortDescription: '',
    description: '',
    image: '',
    sizes: [],
    sizeToAdd: '',
    status: 'Active',
    isBestSeller: false,
    isFeatured: false
  });

  const [brandsList, setBrandsList] = useState([]);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('All');
  const [quickBrandModalOpen, setQuickBrandModalOpen] = useState(false);
  const [newBrandInput, setNewBrandInput] = useState('');
  const [newBrandDesc, setNewBrandDesc] = useState('');
  const [quickCategoryModalOpen, setQuickCategoryModalOpen] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState('');
  const [categoriesList, setCategoriesList] = useState(['All']);
  const [sizeOptions, setSizeOptions] = useState([]);
  const availableSizeNames = [...new Set(sizeOptions.map(getSizeOptionName).filter(Boolean))];
  const [selectedSizeOptions, setSelectedSizeOptions] = useState([]);
  const assignedSizeNames = new Set(selectedSizeOptions.map(getSizeOptionName).filter(Boolean));
  const unassignedSizeNames = availableSizeNames.filter(size => !assignedSizeNames.has(size));

  // Load brands dynamically from admin brands store
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const data = await brandService.getAdminBrands();
        if (Array.isArray(data)) {
          setBrandsList(data);
        }
      } catch {}
    };
    loadBrands();
    window.addEventListener('drBharathiBrandsUpdated', loadBrands);
    window.addEventListener('storage', loadBrands);
    return () => {
      window.removeEventListener('drBharathiBrandsUpdated', loadBrands);
      window.removeEventListener('storage', loadBrands);
    };
  }, []);

  useEffect(() => {
    const loadCategories = () => {
      try {
        const raw = localStorage.getItem('admin_categories_store');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const names = filterLegacySeedCategories(parsed).map(c => c.name).filter(Boolean);
            setCategoriesList(['All', ...new Set(names)]);
            return;
          }
        }
      } catch {}
      setCategoriesList(['All']);
    };
    loadCategories();
    window.addEventListener('drBharathiCategoriesUpdated', loadCategories);
    window.addEventListener('storage', loadCategories);
    return () => {
      window.removeEventListener('drBharathiCategoriesUpdated', loadCategories);
      window.removeEventListener('storage', loadCategories);
    };
  }, []);

  useEffect(() => {
    sizeOptionService.getAdminSizes()
      .then(setSizeOptions)
      .catch(error => showToast(`Could not load size options: ${error.message}`, 'error'));
  }, []);

  const filteredProducts = (Array.isArray(products) ? products : []).filter((p) => {
    if (!p) return false;
    if (filterBestSellerOnly && !p.isBestSeller) return false;
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (selectedBrandFilter !== 'All' && (p.brand || '') !== selectedBrandFilter) return false;
    
    // Status filter with stock-based "Out of Stock" detection
    if (selectedStatus !== 'All') {
      if (selectedStatus === 'Out of Stock') {
        // Show products where status is "Out of Stock" OR stock is 0 or negative
        const isOutOfStock = p.status === 'Out of Stock' || (p.stock !== undefined && Number(p.stock) <= 0);
        if (!isOutOfStock) return false;
      } else {
        // For other statuses (Active, Draft), do exact match
        if (p.status !== selectedStatus) return false;
      }
    }
    
    if (search.trim()) {
      const q = search.toLowerCase();
      return (p.name || '').toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q);
    }
    return true;
  });

  const handleToggleBestSeller = async (product, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const targetId = product.id || product._id;
    const nextVal = !product.isBestSeller;
    const updatedData = { ...product, isBestSeller: nextVal };
    await productService.updateAdminProduct(targetId, updatedData);
    setProducts(prev => prev.map(p => {
      const isMatch = targetId && ((p.id && p.id === targetId) || (p._id && p._id === targetId));
      return isMatch ? { ...p, isBestSeller: nextVal } : p;
    }));
    showToast(
      nextVal ? `⭐ "${product.name}" added to Best Sellers!` : `"${product.name}" removed from Best Sellers`,
      'success'
    );
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setSelectedSizeOptions([]);
    setFormData({
      name: '',
      sku: `HOM-${Math.floor(100 + Math.random() * 900)}`,
      category: categoriesList.find(c => c !== 'All') || '',
      brand: '',
      regularPrice: 0,
      offerPrice: 0,
      stock: 0,
      shortDescription: '',
      description: '',
      image: '',
      sizes: [],
      sizeToAdd: '',
      status: 'Active',
      isBestSeller: false,
      isFeatured: false
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    const savedSizes = (Array.isArray(product.sizes) && product.sizes.length
      ? product.sizes
      : (product.size ? [product.size] : [])).map(getSizeOptionName).filter(Boolean);
    setSelectedSizeOptions(savedSizes);
    setFormData({
      ...product,
      brand: product.brand || '',
      sizes: savedSizes,
      sizeToAdd: ''
    });
    setModalOpen(true);
  };

  const handleAddSizeToProduct = () => {
    const size = formData.sizeToAdd;
    if (!size) {
      showToast('Choose a size first.', 'warning');
      return;
    }
    if (assignedSizeNames.has(getSizeOptionName(size))) {
      showToast('This size is already added to the product.', 'info');
      return;
    }
    const cleanSize = getSizeOptionName(size);
    setSelectedSizeOptions(previous => [...previous, cleanSize]);
    setFormData(previous => ({
      ...previous,
      sizes: [...selectedSizeOptions, cleanSize],
      size: previous.size || cleanSize,
      sizeToAdd: ''
    }));
  };

  const handleImageFileUpload = (e) => {
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
      showToast('Image uploaded successfully!', 'success');
    };
    reader.onerror = () => {
      showToast('Failed to read image file', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) {
      showToast('Product name and SKU are required', 'warning');
      return;
    }

    if (!formData.category || !formData.category.trim()) {
      showToast('Please select a Category', 'warning');
      return;
    }

    if (!formData.brand || !formData.brand.trim()) {
      showToast('Please select a Brand / Manufacturer', 'warning');
      return;
    }

    if (!formData.image || !formData.image.trim()) {
      showToast('Product image is required - Please upload an image', 'warning');
      return;
    }

    try {
      const formValues = { ...formData };
      delete formValues.sizeToAdd;
      const sizes = [...new Set(selectedSizeOptions.map(getSizeOptionName).filter(Boolean))];
      const productData = { ...formValues, sizes, size: sizes[0] || '' };
      if (editingProduct) {
        const targetId = editingProduct.id || editingProduct._id;
        const updatedData = { ...productData, slug: slugify(formData.name) };
        const savedProduct = await productService.updateAdminProduct(targetId, updatedData);
        setProducts(prev => prev.map(p => {
          const isMatch = targetId && ((p.id && p.id === targetId) || (p._id && p._id === targetId));
          return isMatch ? { ...p, ...updatedData, ...savedProduct.data } : p;
        }));
        showToast('Product updated successfully and saved!', 'success');
      } else {
        const newProd = {
          ...productData,
          id: 'prod-' + Date.now(),
          slug: slugify(formData.name),
          createdAt: new Date().toISOString().slice(0, 10)
        };
        const savedProduct = await productService.createAdminProduct(newProd);
        setProducts(prev => [savedProduct.data, ...prev]);
        showToast('New product added to catalogue and saved!', 'success');
      }
      setModalOpen(false);
    } catch (err) {
      showToast(`Product could not be saved: ${err.message}`, 'error');
    }
  };

  const handleDuplicate = async (product) => {
    const duplicated = {
      ...product,
      id: 'prod-' + Date.now(),
      name: `${product.name} (Copy)`,
      sku: `${product.sku}-COPY`,
      slug: slugify(`${product.name}-copy`),
      createdAt: new Date().toISOString().slice(0, 10)
    };
    await productService.createAdminProduct(duplicated);
    setProducts(prev => [duplicated, ...prev]);
    showToast('Product duplicated and saved as draft!', 'info');
  };

  const handleDelete = async (id) => {
    if (!id) return;
    await productService.deleteAdminProduct(id);
    setProducts(prev => prev.filter(p => {
      const isMatch = (p.id && p.id === id) || (p._id && p._id === id);
      return !isMatch;
    }));
    setDeleteConfirmId(null);
    showToast('Product removed from active catalogue and saved', 'info');
  };

  const handleResetCatalog = () => {
    if (window.confirm("Are you sure you want to restore the default catalog remedies? Any changes will be reset to the original remedies.")) {
      const restored = productService.resetProducts();
      setProducts(restored);
      showToast('Catalog remedies restored to default successfully!', 'success');
    }
  };

  const lowStockCount = products.filter(p => p.stock <= 10).length;

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. Hero Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] p-6 sm:p-8 lg:p-9 rounded-[2.25rem] border border-white/30 shadow-2xl shadow-orange-500/20 text-white mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-amber-300/25 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 sm:gap-5 text-center sm:text-left">
          <h1 className="font-heading text-xl sm:text-3xl lg:text-4xl font-black tracking-wide font-sans italic text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            Products & Remedies Catalog
          </h1>
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleOpenAdd}
              className="justify-center relative z-10 inline-flex items-center gap-2.5 px-5 py-3.5 bg-white hover:bg-orange-50 text-orange-600 rounded-2xl text-xs sm:text-sm font-black shadow-xl shadow-black/15 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-white"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>
      </div>

      
      {/* ⚠️ Urgent Stock Out Alert Banner (Directly Above Search Bar) */}
      {outOfStockProducts.length > 0 && (
        <div className="bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-orange-500/10 border-2 border-rose-300/80 rounded-[2rem] p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-black shadow-md shadow-rose-500/30 shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-slate-900 text-base">
                    Stock Out Alerts
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-600 text-white shadow-2xs">
                    {outOfStockProducts.length} Sold Out
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  These products are out of stock. Update their inventory to make them available again.
                </p>
              </div>
            </div>

            {outOfStockProducts.length > 3 && (
              <button
                type="button"
                onClick={() => setStockOutModalOpen(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-md shadow-rose-600/25 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>View {outOfStockProducts.length - 3} More Sold Out</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Show up to 3 sold-out products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {outOfStockProducts.slice(0, 3).map((prod) => {
              const pId = prod.id || prod._id;
              const prodSize = getProductSize(prod);
              const currentVal = quickRestockMap[pId] !== undefined ? quickRestockMap[pId] : 20;

              return (
                <div 
                  key={pId} 
                  className="bg-white rounded-2xl border border-rose-200/90 p-3.5 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-rose-300 transition-all space-y-2.5"
                >
                  <div className="flex items-start gap-2.5">
                    <img
                      src={prod.image || getProductImageFallback(prod)}
                      alt={prod.name}
                      onError={(event) => handleProductImageError(event, prod)}
                      className="w-11 h-11 rounded-xl object-cover bg-slate-50 border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 text-xs truncate" title={prod.name}>
                        {prod.name}
                      </h4>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-black text-[10px] tracking-wide">
                          Size: {prodSize}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                        0 Units Left
                      </span>
                      <span className="font-mono text-slate-400">
                        {prod.sku || ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="1"
                        value={currentVal}
                        onChange={(e) => setQuickRestockMap(prev => ({ ...prev, [pId]: e.target.value }))}
                        className="w-14 p-1.5 bg-slate-50 border border-slate-300 rounded-lg font-black text-center text-xs focus:outline-none focus:border-brandOrange-500"
                        title="Enter units to add"
                      />
                      <button
                        type="button"
                        onClick={() => handleQuickRestock(pId, currentVal)}
                        className="flex-1 py-1.5 bg-slate-900 hover:bg-emerald-600 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer text-center"
                      >
                        + Restock
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        </div>
      )}

      {stockOutModalOpen && outOfStockProducts.length > 3 && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm"
          onClick={() => setStockOutModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="more-sold-out-title"
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:rounded-3xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-100 bg-white pb-3">
              <div>
                <h2 id="more-sold-out-title" className="flex items-center gap-2 text-base font-black text-slate-900 sm:text-lg">
                  <Boxes className="h-4 w-4 text-rose-600" />
                  More Sold Out Products
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">{outOfStockProducts.length - 3} more products need restocking</p>
              </div>
              <button
                type="button"
                onClick={() => setStockOutModalOpen(false)}
                aria-label="Close sold-out products"
                className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {outOfStockProducts.slice(3).map((prod) => {
                const pId = prod.id || prod._id;
                const currentVal = quickRestockMap[pId] !== undefined ? quickRestockMap[pId] : 20;
                return (
                  <div key={pId} className="flex flex-col gap-3 rounded-xl border border-rose-100 bg-rose-50/40 p-3 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <img
                        src={prod.image || getProductImageFallback(prod)}
                        alt={prod.name}
                        onError={(event) => handleProductImageError(event, prod)}
                        className="h-12 w-12 shrink-0 rounded-lg border border-slate-200 bg-white object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900" title={prod.name}>{prod.name}</p>
                        <p className="truncate text-xs text-slate-500">{prod.sku || 'No SKU'} · {getProductSize(prod)} · 0 in stock</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={currentVal}
                        onChange={(event) => setQuickRestockMap(prev => ({ ...prev, [pId]: event.target.value }))}
                        aria-label={`Restock quantity for ${prod.name}`}
                        className="w-20 rounded-lg border border-slate-300 bg-white p-2 text-center text-sm font-bold focus:border-brandOrange-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleQuickRestock(pId, currentVal)}
                        className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-600"
                      >
                        Restock
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

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

        <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto text-xs">
          <button
            type="button"
            onClick={() => setFilterBestSellerOnly(prev => !prev)}
            className={`col-span-3 sm:col-span-1 w-full sm:w-auto justify-center p-2.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs text-xs whitespace-nowrap ${
              filterBestSellerOnly
                ? 'bg-amber-500 text-white shadow-amber-500/30'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${filterBestSellerOnly ? 'fill-white text-white' : 'fill-amber-500 text-amber-500'}`} />
            <span>Best Sellers ({(products || []).filter(p => p.isBestSeller).length})</span>
          </button>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by category"
            className="w-full sm:w-auto min-w-0 px-1.5 sm:px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-brandOrange-500 transition-all cursor-pointer shadow-2xs text-[10px] sm:text-xs"
          >
            {categoriesList.map(c => <option key={c} value={c}>{c === 'All' ? 'Category' : c}</option>)}
          </select>

          <select
            value={selectedBrandFilter}
            onChange={(e) => setSelectedBrandFilter(e.target.value)}
            aria-label="Filter by brand"
            className="w-full sm:w-auto min-w-0 px-1.5 sm:px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-brandOrange-500 transition-all cursor-pointer shadow-2xs text-[10px] sm:text-xs"
          >
            <option value="All">Brand</option>
            {brandsList.map(b => {
              const bName = typeof b === 'string' ? b : b.name;
              return <option key={bName} value={bName}>{bName}</option>;
            })}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            aria-label="Filter by status"
            className={`w-full sm:w-auto min-w-0 px-1.5 sm:px-2.5 py-2.5 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brandOrange-500 transition-all cursor-pointer shadow-2xs text-[10px] sm:text-xs ${
              selectedStatus === 'All' 
                ? 'bg-slate-50 text-slate-700' 
                : 'bg-blue-50 text-blue-900 border-blue-300 font-black'
            }`}
          >
            <option value="All">Status</option>
            <option value="Active">✓ Active</option>
            <option value="Draft">✎ Draft</option>
            <option value="Out of Stock">✗ Out of Stock</option>
          </select>

          {/* Clear Filters Button - shows when any filter is active */}
          {(search || selectedCategory !== 'All' || selectedBrandFilter !== 'All' || selectedStatus !== 'All' || filterBestSellerOnly) && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setSelectedBrandFilter('All');
                setSelectedStatus('All');
                setFilterBestSellerOnly(false);
              }}
              className="col-span-3 sm:col-span-1 p-2.5 rounded-xl font-bold flex items-center justify-center sm:justify-start gap-1.5 transition-all cursor-pointer shadow-2xs text-xs whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
              title="Clear all filters"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}

          <span className="text-xs text-slate-500 font-bold hidden lg:inline shrink-0">
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
                <th className="py-3.5 px-4 text-center whitespace-nowrap min-w-[130px]">Best Seller</th>
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
                        src={prod.image || getProductImageFallback(prod)}
                        alt={prod.name} 
                        onError={(event) => handleProductImageError(event, prod)}
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
                          <span className="inline-flex items-center text-[9.5px] font-black text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">🏷️ {prod.brand || 'No Brand'}</span>
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
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => handleToggleBestSeller(prod, e)}
                      title={prod.isBestSeller ? "Click to remove from Best Sellers" : "Click to set as Best Seller"}
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer border shadow-2xs active:scale-95 group ${
                        prod.isBestSeller
                          ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 hover:border-amber-400'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110 ${prod.isBestSeller ? 'fill-amber-500 text-amber-500' : 'text-slate-400 group-hover:text-amber-500'}`} />
                      <span>{prod.isBestSeller ? 'Best Seller' : 'Regular'}</span>
                    </button>
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
                src={prod.image || getProductImageFallback(prod)}
                alt={prod.name}
                onError={(event) => handleProductImageError(event, prod)}
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
                  <span className="inline-flex items-center text-[9.5px] font-black text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">🏷️ {prod.brand || 'No Brand'}</span>
                          {prod.isFeatured && (
                    <span className="text-[9px] font-black text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-lg border border-purple-200">Featured</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 gap-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-black text-slate-900 text-sm">₹{prod.offerPrice || prod.regularPrice}</span>
                    {prod.regularPrice > (prod.offerPrice || prod.regularPrice) && (
                      <span className="text-[10px] text-slate-400 line-through font-semibold">₹{prod.regularPrice}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => handleToggleBestSeller(prod, e)}
                      title={prod.isBestSeller ? "Click to remove from Best Sellers" : "Click to set as Best Seller"}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer shadow-2xs active:scale-95 border ${
                        prod.isBestSeller
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300'
                      }`}
                    >
                      <Star className={`w-3 h-3 shrink-0 ${prod.isBestSeller ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                      <span>{prod.isBestSeller ? 'Best Seller' : 'Regular'}</span>
                    </button>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${prod.stock <= 5 ? 'text-rose-600 bg-rose-50' : 'text-slate-500 bg-slate-100'}`}>
                      {prod.stock} in stock
                    </span>
                  </div>
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
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">Category *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setNewCategoryInput('');
                        setNewCategoryImage('');
                        setQuickCategoryModalOpen(true);
                      }}
                      className="px-2 py-1 bg-orange-50 hover:bg-orange-100 text-brandOrange-600 rounded-lg text-[11px] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer border border-orange-200/60"
                      title="Add a new category without leaving"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Add</span>
                    </button>
                  </div>
                  <ModalSelect
                    value={formData.category}
                    onChange={(category) => setFormData({ ...formData, category })}
                    options={categoriesList.filter(c => c !== 'All')}
                    placeholder="Select category"
                    label="Category"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-slate-700">Brand / Manufacturer *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setNewBrandInput('');
                      setNewBrandDesc('');
                      setQuickBrandModalOpen(true);
                    }}
                    className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-brandOrange-600 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer border border-orange-200/60"
                    title="Add a new brand without leaving"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Add Brand</span>
                  </button>
                </div>
                <ModalSelect
                  value={formData.brand || ''}
                  onChange={(brand) => setFormData({ ...formData, brand })}
                  options={[
                    ...(formData.brand && !brandsList.some(b => (typeof b === 'string' ? b : b.name) === formData.brand) ? [formData.brand] : []),
                    ...brandsList.filter(b => b.status !== 'Inactive').map(b => typeof b === 'string' ? b : b.name)
                  ]}
                  placeholder="-- Select Brand / Manufacturer --"
                  label="Brand / Manufacturer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Regular Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.regularPrice}
                    onChange={(e) => setFormData({ ...formData, regularPrice: Number(e.target.value) })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Offer Price (₹)</label>
                  <input
                    type="number"
                    min="0"
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
                <label className="block font-bold text-slate-700 mb-1.5">Available Sizes</label>
                <div className="flex gap-2">
                  <ModalSelect
                    value={formData.sizeToAdd || ''}
                    onChange={(sizeToAdd) => setFormData(previous => ({ ...previous, sizeToAdd }))}
                    options={unassignedSizeNames}
                    placeholder="Select a size"
                    label="Available product sizes"
                    disabled={unassignedSizeNames.length === 0}
                  />
                  <button type="button" onClick={handleAddSizeToProduct} disabled={!formData.sizeToAdd} className="shrink-0 px-3 py-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 font-bold hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed">+ Add</button>
                </div>
                {selectedSizeOptions.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedSizeOptions.map(size => (
                      <span key={size} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {size}
                        <button type="button" onClick={() => {
                          const remainingSizes = selectedSizeOptions.filter(item => item !== size);
                          setSelectedSizeOptions(remainingSizes);
                          setFormData(previous => ({
                            ...previous,
                            sizes: remainingSizes,
                            size: previous.size === size ? (remainingSizes[0] || '') : previous.size
                          }));
                        }} className="text-slate-500 hover:text-rose-600" aria-label={`Remove ${size}`}>×</button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-500">
                    <span>{availableSizeNames.length === 0 ? 'No size options are available yet.' : 'All available sizes are already added.'}</span>
                    {availableSizeNames.length === 0 && <Link to="/admin/sizes" target="_blank" rel="noreferrer" className="font-bold text-brandOrange-600 underline">Open Sizes module</Link>}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Product Image *
                  <span className="text-brandOrange-600 ml-1 text-xs">(Required)</span>
                </label>

                {/* File Upload Trigger Box & Preview */}
                <div className="flex items-center gap-3.5">
                  <label className="flex-1 border-2 border-dashed border-slate-200 hover:border-brandOrange-400 bg-slate-50 hover:bg-orange-50/40 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all group shadow-2xs">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-xl bg-brandOrange-100 text-brandOrange-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform shadow-2xs">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black text-slate-700 group-hover:text-brandOrange-600 transition-colors">
                      Click here to upload image file
                    </span>
                    <span className="text-[10.5px] text-slate-400 mt-0.5 font-medium">
                      Supports PNG, JPG, JPEG, WEBP (Max 5MB)
                    </span>
                  </label>

                  {/* Image Preview Thumbnail if selected */}
                  {formData.image && (
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-brandOrange-300 shadow-md shrink-0 group bg-slate-100">
                      <img
                        src={formData.image || (editingProduct ? getProductImageFallback(editingProduct) : '')}
                        alt="Product preview"
                        onError={(e) => handleProductImageError(e, editingProduct || formData)}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Enter a short description"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
                />
              </div>

              <div className="pt-2 space-y-2.5">
                <div 
                  className="bg-amber-50/70 border-2 border-amber-300/80 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-amber-50 transition-colors shadow-2xs" 
                  onClick={() => setFormData(prev => ({ ...prev, isBestSeller: !prev.isBestSeller }))}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${formData.isBestSeller ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' : 'bg-amber-100 text-amber-600'}`}>
                      <Star className={`w-5 h-5 ${formData.isBestSeller ? 'fill-white' : ''}`} />
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 text-xs block">⭐ Best Seller Remedy</span>
                      <span className="text-[10.5px] text-slate-500 font-medium block">Displays prominently in Home Page & Best Sellers catalogue</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData(prev => ({ ...prev, isBestSeller: e.target.checked }))}
                    className="rounded text-brandOrange-500 focus:ring-brandOrange-500 w-5 h-5 cursor-pointer accent-amber-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div 
                  className="bg-purple-50/60 border border-purple-200 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:bg-purple-50 transition-colors"
                  onClick={() => setFormData(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <div>
                      <span className="font-extrabold text-slate-800 text-xs block">Feature on Patient Home</span>
                      <span className="text-[10px] text-slate-400 font-medium block">Highlights product in special promotional sections</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer accent-purple-600"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
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
                  Save Product
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

      {/* 6. Quick Add Brand Modal */}
      {quickBrandModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brandOrange-50 text-brandOrange-600">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-black text-slate-900 text-sm sm:text-base font-display">
                  Add Brand / Manufacturer
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setQuickBrandModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Brand / Manufacturer Name *</label>
                <input
                  type="text"
                  placeholder="Enter brand name"
                  value={newBrandInput}
                  onChange={(e) => setNewBrandInput(e.target.value)}
                  autoFocus
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Enter description (optional)"
                  value={newBrandDesc}
                  onChange={(e) => setNewBrandDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQuickBrandModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const cleanName = newBrandInput.trim();
                    if (!cleanName) {
                      showToast('Please enter brand name', 'warning');
                      return;
                    }
                    const newBrandObj = {
                      name: cleanName,
                      description: newBrandDesc.trim(),
                      status: 'Active',
                      createdAt: new Date().toISOString().slice(0, 10)
                    };
                    await brandService.createAdminBrand(newBrandObj);
                    setBrandsList(prev => [...prev, newBrandObj]);
                    setFormData(prev => ({ ...prev, brand: cleanName }));
                    setQuickBrandModalOpen(false);
                    showToast(`Brand "${cleanName}" added and selected!`, 'success');
                  }}
                  className="px-5 py-2.5 bg-brandOrange-500 hover:bg-brandOrange-600 text-white font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save & Select Brand</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Category Modal */}
      {quickCategoryModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brandOrange-50 text-brandOrange-600">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <h4 className="font-black text-slate-900 text-sm sm:text-base font-display">Add Therapeutic Category</h4>
              </div>
              <button
                type="button"
                onClick={() => setQuickCategoryModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Category Name *</label>
                <input
                  type="text"
                  placeholder="Enter a category name"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  autoFocus
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Category Image</label>
                <div className="flex items-center gap-3.5">
                  <label className="flex-1 border-2 border-dashed border-slate-200 hover:border-brandOrange-400 bg-slate-50 hover:bg-orange-50/40 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all group">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        if (!file.type.startsWith('image/')) {
                          showToast('Please select a valid image file', 'error');
                          event.target.value = '';
                          return;
                        }
                        if (file.size > 5 * 1024 * 1024) {
                          showToast('Image must be smaller than 5MB', 'error');
                          event.target.value = '';
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = () => setNewCategoryImage(String(reader.result || ''));
                        reader.onerror = () => showToast('Could not read the selected image', 'error');
                        reader.readAsDataURL(file);
                      }}
                      className="hidden"
                    />
                    <div className="w-9 h-9 rounded-xl bg-brandOrange-100 text-brandOrange-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                      <Upload className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-slate-700">Upload category image</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG or WEBP · Max 5MB</span>
                  </label>
                  {newCategoryImage && (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-orange-200 shrink-0">
                      <img src={newCategoryImage} alt="Category preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewCategoryImage('')}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center"
                        aria-label="Remove category image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setQuickCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const cleanName = newCategoryInput.trim();
                    if (!cleanName) {
                      showToast('Please enter category name', 'warning');
                      return;
                    }
                    const existingCategory = categoriesList.find(
                      (category) => category.toLowerCase() === cleanName.toLowerCase()
                    );
                    if (existingCategory) {
                      setFormData((prev) => ({ ...prev, category: existingCategory }));
                      setQuickCategoryModalOpen(false);
                      showToast(`Category "${existingCategory}" selected`, 'info');
                      return;
                    }

                    const newCategory = {
                      name: cleanName,
                      slug: slugify(cleanName),
                      image: newCategoryImage,
                      status: 'Active',
                      description: '',
                      isFeatured: false
                    };
                    try {
                      const savedCategory = await categoryService.createAdminCategory(newCategory);
                      setCategoriesList((prev) => [...prev, cleanName]);
                      setFormData((prev) => ({ ...prev, category: savedCategory.data.name }));
                      setQuickCategoryModalOpen(false);
                      showToast(`Category "${cleanName}" saved to the shared catalog and selected!`, 'success');
                    } catch (err) {
                      showToast(`Category could not be saved: ${err.message}`, 'error');
                    }
                  }}
                  className="px-5 py-2.5 bg-brandOrange-500 hover:bg-brandOrange-600 text-white font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save & Select Category</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;




