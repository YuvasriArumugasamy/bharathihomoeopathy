import React, { useState } from 'react';
import { Tag, Plus, Edit, Trash2, Sparkles, Copy, X } from 'lucide-react';
import { initialAdminOffers, initialAdminCoupons } from '../../data/adminOffersData';
import { useToast } from '../../context/ToastContext';

export const AdminOffers = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('coupons');
  const [coupons, setCoupons] = useState(initialAdminCoupons);
  const [offers, setOffers] = useState(initialAdminOffers);

  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'Percentage',
    discountValue: 10,
    minimumOrderValue: 499,
    maximumDiscount: 200,
    usageLimit: 100
  });

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code) return;
    const added = {
      ...newCoupon,
      id: 'cpn-' + Date.now(),
      code: newCoupon.code.toUpperCase(),
      usedCount: 0,
      status: 'Active',
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setCoupons(prev => [added, ...prev]);
    setCouponModalOpen(false);
    showToast('New coupon code created!', 'success');
  };

  const handleDeleteCoupon = (id) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    showToast('Coupon code deactivated', 'info');
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brandOrange-600">Promotions & Marketing</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">Offers & Coupons Management</h1>
          <p className="text-xs text-slate-500">Configure discount campaigns, seasonal patient promotions, and coupon usage limits.</p>
        </div>

        <button
          onClick={() => setCouponModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brandOrange-500 hover:bg-brandOrange-600 text-white rounded-xl text-xs font-bold shadow-md transition-smooth"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-smooth ${
            activeTab === 'coupons' ? 'bg-navy-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          Coupon Codes ({coupons.length})
        </button>
        <button
          onClick={() => setActiveTab('offers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-smooth ${
            activeTab === 'offers' ? 'bg-navy-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          Promotional Campaigns ({offers.length})
        </button>
      </div>

      {/* Coupons List */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-black text-lg text-brandOrange-600 tracking-wider">{c.code}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full">
                    {c.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  {c.discountType === 'Percentage' ? `${c.discountValue}% Discount` : `Flat ₹${c.discountValue} Off`} (Min: ₹{c.minimumOrderValue})
                </p>
                <div className="text-[11px] text-slate-400">
                  Usage: <strong className="text-slate-700">{c.usedCount}</strong> / {c.usageLimit} redeemed
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                <button
                  onClick={() => handleDeleteCoupon(c.id)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Offers List */}
      {activeTab === 'offers' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((off) => (
            <div key={off.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
              <span className="px-2 py-0.5 bg-brandOrange-50 text-brandOrange-600 font-bold text-[10px] rounded-full uppercase">
                {off.type}
              </span>
              <h4 className="font-bold text-sm text-navy-900">{off.name}</h4>
              <p className="text-xs text-slate-500">{off.description}</p>
              <div className="pt-2 text-[11px] text-slate-400">Valid: {off.startDate} to {off.endDate}</div>
            </div>
          ))}
        </div>
      )}

      {/* Create Coupon Modal */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-navy-900 text-sm">Create New Coupon Code</h3>

            <form onSubmit={handleAddCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MONSOON15"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full p-2 uppercase font-mono font-bold bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discount %</label>
                  <input
                    type="number"
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    value={newCoupon.minimumOrderValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minimumOrderValue: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setCouponModalOpen(false)} className="flex-1 py-2 bg-slate-100 font-bold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-brandOrange-500 text-white font-bold rounded-xl">Create Code</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
