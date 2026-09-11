import React, { useState } from 'react';
import { 
  Users, Search, Filter, ShieldAlert, CheckCircle2, Eye, Ban, X, 
  User, Phone, Mail, MapPin, ShoppingBag, IndianRupee, ShieldCheck, 
  ExternalLink, Sparkles, UserX, UserCheck
} from 'lucide-react';
import { initialAdminCustomers } from '../../data/adminCustomersData';
import { useToast } from '../../context/ToastContext';

export const AdminCustomers = () => {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState(initialAdminCustomers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Computed metrics
  const totalPatients = customers.length;
  const activePatients = customers.filter(c => c.status === 'Active').length;
  const blockedPatients = customers.filter(c => c.status === 'Blocked').length;
  const totalLifetimeRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);

  const filtered = customers.filter(c => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || 
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || 
      c.email.toLowerCase().includes(q) || 
      c.customerId.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q));
    return matchesStatus && matchesSearch;
  });

  const handleToggleBlock = (customer) => {
    const newStatus = customer.status === 'Active' ? 'Blocked' : 'Active';
    setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, status: newStatus } : c));
    if (selectedCustomer && selectedCustomer.id === customer.id) {
      setSelectedCustomer(prev => ({ ...prev, status: newStatus }));
    }
    showToast(
      `Patient ${customer.firstName}'s account is now marked as ${newStatus}`, 
      newStatus === 'Active' ? 'success' : 'warning'
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
            {/* 1. Hero Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] p-6 sm:p-8 lg:p-9 rounded-[2.25rem] border border-white/30 shadow-2xl shadow-orange-500/20 text-white mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-amber-300/25 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-5 text-center sm:text-left">
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-wide font-serif italic text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            Patient Directory
          </h1>
        </div>
      </div>

{/* KPI Overview Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Patients</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-navy-900">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-navy-950">{totalPatients}</span>
            <span className="text-xs text-slate-400 font-semibold">Profiles</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Accounts</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{activePatients}</span>
            <span className="text-xs text-emerald-700/80 font-semibold">Verified</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Spending</span>
            <div className="w-9 h-9 rounded-xl bg-brandOrange-50 flex items-center justify-center text-brandOrange-600">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-brandOrange-600">
              ₹{totalPatients ? Math.round(totalLifetimeRevenue / totalPatients).toLocaleString('en-IN') : 0}
            </span>
            <span className="text-xs text-brandOrange-700/80 font-semibold">Per Patient</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Restricted Accounts</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-600">{blockedPatients}</span>
            <span className="text-xs text-rose-700/80 font-semibold">Blocked</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white/95 backdrop-blur-sm p-5 rounded-[2rem] border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by patient name, email, phone, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">Filter:</span>
          {['All', 'Active', 'Blocked'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-smooth ${
                statusFilter === st
                  ? 'bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-navy-900 border border-slate-200/60'
              }`}
            >
              {st === 'All' ? 'All Patients' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Patients Table Container */}
      <div className="bg-white/95 backdrop-blur-sm rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] overflow-hidden">
        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Patient Profile</th>
                <th className="py-4 px-5">Patient ID</th>
                <th className="py-4 px-5">Phone & City</th>
                <th className="py-4 px-5">Orders Placed</th>
                <th className="py-4 px-5">Lifetime Value</th>
                <th className="py-4 px-5">Account Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="font-bold text-sm text-slate-600">No patient records match your search.</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing search filters or entering a different query.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((cust) => (
                  <tr 
                    key={cust.id} 
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Patient Profile */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div>
                          <h4 className="font-heading font-black text-sm text-navy-950 group-hover:text-brandOrange-600 transition-colors">
                            {cust.firstName} {cust.lastName}
                          </h4>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {cust.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Patient ID */}
                    <td className="py-4 px-5">
                      <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70">
                        {cust.customerId}
                      </span>
                    </td>

                    {/* Phone & Location */}
                    <td className="py-4 px-5">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {cust.phone || 'N/A'}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {cust.address?.city ? `${cust.address.city}, ${cust.address.state}` : 'Tamil Nadu, IN'}
                        </span>
                      </div>
                    </td>

                    {/* Orders */}
                    <td className="py-4 px-5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100/80 text-navy-900 font-bold text-xs border border-slate-200/60">
                        <ShoppingBag className="w-3.5 h-3.5 text-brandOrange-500" />
                        {cust.ordersCount} orders
                      </div>
                    </td>

                    {/* Spent */}
                    <td className="py-4 px-5">
                      <span className="font-black text-sm text-brandOrange-600">
                        ₹{(cust.totalSpent || 0).toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        cust.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/10' 
                          : 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/10'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${cust.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {cust.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-navy-950 hover:text-white text-navy-900 font-bold rounded-xl text-xs transition-all shadow-2xs flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Profile
                        </button>
                        <button
                          onClick={() => handleToggleBlock(cust)}
                          title={cust.status === 'Active' ? 'Block Patient' : 'Unblock Patient'}
                          className={`p-1.5 rounded-xl border transition-all ${
                            cust.status === 'Active'
                              ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 border-slate-200'
                              : 'text-rose-600 bg-rose-50 hover:bg-rose-100 border-rose-200'
                          }`}
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col gap-3.5 p-3.5 sm:p-4 bg-slate-50/60">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <p className="font-bold text-sm text-slate-600">No patient records match your search.</p>
            </div>
          ) : (
            filtered.map((cust) => (
              <div
                key={cust.id + '-card'}
                onClick={() => setSelectedCustomer(cust)}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_16px_-2px_rgba(15,36,56,0.06)] p-4 flex flex-col gap-3 cursor-pointer active:scale-[0.98] transition-all hover:shadow-md hover:border-orange-300"
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                  <span className="font-mono font-bold text-[11px] text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/70">
                    {cust.customerId}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs ${
                    cust.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cust.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {cust.status}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-heading font-black text-sm text-navy-950">
                      {cust.firstName} {cust.lastName}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {cust.phone || 'N/A'}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {cust.email}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Spent</span>
                    <span className="font-black text-slate-900 text-sm font-display block mt-0.5">
                      ₹{(cust.totalSpent || 0).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded mt-1 inline-block">
                      {cust.ordersCount || 0} Orders
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-brandOrange-600 font-bold">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {cust.address?.city ? `${cust.address.city}, ${cust.address.state}` : 'Tamil Nadu, IN'}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    View Full Dossier <Eye className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Patient Profile Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-end bg-navy-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto p-7 sm:p-9 space-y-6 shadow-2xl flex flex-col justify-between border-l border-slate-100">
            
            <div className="space-y-6">
              
              {/* Top Bar */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-brandOrange-50 text-brandOrange-600">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Patient Record</span>
                    <h3 className="font-heading font-black text-navy-950 text-base">Profile Dossier</h3>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCustomer(null)} 
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Bio */}
              <div className="text-center space-y-3 p-5 bg-gradient-to-b from-slate-50 to-white rounded-[2rem] border border-slate-100">
                <div>
                  <h4 className="font-heading font-black text-xl text-navy-950">
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {selectedCustomer.customerId} • Joined {selectedCustomer.createdAt || 'Aug 2026'}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    selectedCustomer.status === 'Active' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {selectedCustomer.status === 'Active' ? 'Active Member' : 'Account Blocked'}
                  </span>
                </div>
              </div>

              {/* Lifetime Metrics Tile */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Remedy Orders</span>
                  <span className="text-xl font-black text-navy-950 mt-1 block">{selectedCustomer.ordersCount}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Spent</span>
                  <span className="text-xl font-black text-brandOrange-600 mt-1 block">₹{(selectedCustomer.totalSpent || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Contact & Address Details */}
              <div className="bg-slate-50/90 p-5 rounded-[2rem] border border-slate-100 space-y-3.5 text-xs text-slate-700">
                <h5 className="font-bold text-navy-950 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brandOrange-500" />
                  Prescription Shipping Address
                </h5>
                <div className="space-y-2 pt-1 text-slate-600">
                  <p className="flex items-center gap-2 font-medium">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {selectedCustomer.phone || 'Phone not registered'}
                  </p>
                  <p className="flex items-center gap-2 font-medium">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {selectedCustomer.email}
                  </p>
                  <div className="pt-2 border-t border-slate-200/60 leading-relaxed">
                    <p className="font-bold text-navy-900">{selectedCustomer.address?.addressLine1 || 'Main St'}</p>
                    {selectedCustomer.address?.addressLine2 && <p>{selectedCustomer.address.addressLine2}</p>}
                    <p>{selectedCustomer.address?.city || 'Chennai'}, {selectedCustomer.address?.state || 'Tamil Nadu'} - {selectedCustomer.address?.pincode || '600001'}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <button
                onClick={() => handleToggleBlock(selectedCustomer)}
                className={`w-full py-3 px-4 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
                  selectedCustomer.status === 'Active'
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200'
                }`}
              >
                <Ban className="w-4 h-4" />
                {selectedCustomer.status === 'Active' ? 'Block Patient Account' : 'Unblock Account Access'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
