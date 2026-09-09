import React, { useState } from 'react';
import { 
  Tag, Plus, Edit, Trash2, Sparkles, Copy, X, Percent, 
  IndianRupee, Calendar, Check, Gift, Ticket, Flame, ArrowRight
} from 'lucide-react';
import { initialAdminOffers, initialAdminCoupons } from '../../data/adminOffersData';
import { useToast } from '../../context/ToastContext';

export const AdminOffers = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('coupons');
  const [coupons, setCoupons] = useState(initialAdminCoupons);
  const [offers, setOffers] = useState(initialAdminOffers);

  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'Percentage',
    discountValue: 10,
    minimumOrderValue: 499,
    maximumDiscount: 200,
    usageLimit: 100
  });

  // Metrics
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(c => c.status === 'Active').length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);
  const totalCampaigns = offers.length;

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon code ${code} copied to clipboard!`, 'info');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    const added = {
      ...newCoupon,
      id: 'cpn-' + Date.now(),
      code: newCoupon.code.toUpperCase().trim(),
      usedCount: 0,
      status: 'Active',
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setCoupons(prev => [added, ...prev]);
    setCouponModalOpen(false);
    setNewCoupon({
      code: '',
      discountType: 'Percentage',
      discountValue: 10,
      minimumOrderValue: 499,
      maximumDiscount: 200,
      usageLimit: 100
    });
    showToast('New coupon code created and activated!', 'success');
  };

  const handleDeleteCoupon = (id) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    showToast('Coupon code deactivated and removed', 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 p-7 sm:p-9 rounded-[2.25rem] border border-slate-800 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brandOrange-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brandOrange-500/20 border border-brandOrange-400/30 text-brandOrange-300 text-xs font-black tracking-widest uppercase">
              <Gift className="w-3.5 h-3.5 text-brandOrange-400" />
              Promotions & Patient Loyalty
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Offers & Coupons
            </h1>
            <p className="text-slate-300 text-sm max-w-xl font-normal leading-relaxed">
              Design seasonal homeopathic clinic vouchers, first-order patient discounts, and dispensary sales campaigns.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCouponModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-brandOrange-500 via-orange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white font-black text-xs rounded-2xl shadow-lg shadow-brandOrange-500/25 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Voucher</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Coupons</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{activeCoupons}</span>
            <span className="text-xs text-emerald-700/80 font-semibold">Live codes</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Redemptions</span>
            <div className="w-9 h-9 rounded-xl bg-brandOrange-50 flex items-center justify-center text-brandOrange-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-brandOrange-600">{totalRedemptions}</span>
            <span className="text-xs text-brandOrange-700/80 font-semibold">Uses</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clinic Campaigns</span>
            <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center text-navy-900">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-navy-950">{totalCampaigns}</span>
            <span className="text-xs text-slate-400 font-semibold">Banners</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Savings</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-sky-600">15%</span>
            <span className="text-xs text-sky-700/80 font-semibold">Discount</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'coupons'
              ? 'bg-navy-950 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          <Ticket className="w-4 h-4 text-brandOrange-400" />
          <span>Coupon Vouchers ({coupons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'offers'
              ? 'bg-navy-950 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
          }`}
        >
          <Gift className="w-4 h-4 text-brandOrange-400" />
          <span>Promotional Campaigns ({offers.length})</span>
        </button>
      </div>

      {/* Coupons List View */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {coupons.map((c) => {
            const usagePercent = Math.min(100, Math.round(((c.usedCount || 0) / (c.usageLimit || 100)) * 100));
            return (
              <div 
                key={c.id} 
                className="group relative bg-white/95 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-slate-200/90 p-6 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] hover:shadow-xl hover:border-brandOrange-300 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Top Notch & Status */}
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {c.status}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Created: {c.createdAt}
                    </span>
                  </div>

                  {/* Code Card Ribbon */}
                  <div className="p-4 bg-gradient-to-r from-slate-50 to-amber-50/40 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Coupon Code</span>
                      <span className="font-mono font-black text-xl text-brandOrange-600 tracking-wider">
                        {c.code}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(c.code)}
                      className="p-2 rounded-xl bg-white text-slate-500 hover:text-brandOrange-600 hover:bg-brandOrange-50 border border-slate-200 shadow-2xs transition-all"
                      title="Copy Code"
                    >
                      {copiedCode === c.code ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Discount Details */}
                  <div className="space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center justify-between font-bold text-navy-950">
                      <span>Discount Value:</span>
                      <span className="text-brandOrange-600">
                        {c.discountType === 'Percentage' ? `${c.discountValue}% OFF` : `Flat ₹${c.discountValue} OFF`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>Min Order Required:</span>
                      <span className="font-semibold text-slate-700">₹{c.minimumOrderValue}</span>
                    </div>
                    {c.maximumDiscount && (
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span>Max Cap:</span>
                        <span className="font-semibold text-slate-700">₹{c.maximumDiscount}</span>
                      </div>
                    )}
                  </div>

                  {/* Usage Progress Bar */}
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-500">Usage Limit:</span>
                      <span className="text-navy-900">{c.usedCount} / {c.usageLimit} redeemed</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-brandOrange-500 to-amber-500 rounded-full transition-all duration-500" 
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Valid on Dispensary store</span>
                  <button
                    onClick={() => handleDeleteCoupon(c.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Remove Coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Offers View */}
      {activeTab === 'offers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {offers.map((off) => (
            <div 
              key={off.id} 
              className="group bg-white/95 backdrop-blur-sm rounded-[2rem] border border-slate-200/90 p-6 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] hover:shadow-xl hover:border-brandOrange-200 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 bg-brandOrange-50 text-brandOrange-600 font-black text-[10px] rounded-full uppercase border border-brandOrange-200">
                    {off.type}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {off.status || 'Active'}
                  </span>
                </div>

                <h4 className="font-heading font-black text-base text-navy-950 group-hover:text-brandOrange-600 transition-colors">
                  {off.name}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {off.description}
                </p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <Calendar className="w-4 h-4 text-brandOrange-500" />
                  <span>Valid: <strong>{off.startDate}</strong> to <strong>{off.endDate}</strong></span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-black bg-emerald-50 px-2.5 py-0.5 rounded-lg">
                  {off.discountBadge || 'Special Promo'}
                </span>
                <span className="text-slate-400 text-[11px]">Applied automatically</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Coupon Modal */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.25rem] p-7 sm:p-8 max-w-md w-full space-y-5 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-brandOrange-500">New Promo Code</span>
                <h3 className="font-heading font-black text-navy-950 text-lg">Create Coupon Voucher</h3>
              </div>
              <button 
                onClick={() => setCouponModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MONSOON20"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full p-3 font-mono font-black uppercase bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:border-brandOrange-500 focus:bg-white text-navy-950 tracking-wider text-sm transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Discount Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                    className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-medium text-slate-800"
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    {newCoupon.discountType === 'Percentage' ? 'Discount % *' : 'Amount (₹) *'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                    className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-black text-navy-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Min Order Value (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={newCoupon.minimumOrderValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minimumOrderValue: Number(e.target.value) })}
                    className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Usage Cap (Redemptions)</label>
                  <input
                    type="number"
                    min={1}
                    value={newCoupon.usageLimit}
                    onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: Number(e.target.value) })}
                    className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCouponModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-brandOrange-500 via-orange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white font-black rounded-xl shadow-lg shadow-brandOrange-500/25 transition-all"
                >
                  Create Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
