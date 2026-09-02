import React, { useState } from 'react';
import { Users, Search, Filter, ShieldAlert, CheckCircle2, Eye, Ban, X } from 'lucide-react';
import { initialAdminCustomers } from '../../data/adminCustomersData';
import { useToast } from '../../context/ToastContext';

export const AdminCustomers = () => {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState(initialAdminCustomers);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filtered = customers.filter(c => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.customerId.toLowerCase().includes(q);
    }
    return true;
  });

  const handleToggleBlock = (customer) => {
    const newStatus = customer.status === 'Active' ? 'Blocked' : 'Active';
    setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, status: newStatus } : c));
    if (selectedCustomer && selectedCustomer.id === customer.id) {
      setSelectedCustomer(prev => ({ ...prev, status: newStatus }));
    }
    showToast(`Customer account marked as ${newStatus}`, newStatus === 'Active' ? 'success' : 'warning');
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brandOrange-600">Patient Directory</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">Customers & Patients</h1>
          <p className="text-xs text-slate-500">View registered patients, consultation records, order volume, and contact profiles.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search patient name, email, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brandOrange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-100">
                <th className="py-3 px-4 font-bold">Patient</th>
                <th className="py-3 px-4 font-bold">Patient ID</th>
                <th className="py-3 px-4 font-bold">Orders</th>
                <th className="py-3 px-4 font-bold">Total Spent</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-navy-900 text-white font-bold flex items-center justify-center text-xs">
                        {cust.firstName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-navy-900">{cust.firstName} {cust.lastName}</h4>
                        <p className="text-[10px] text-slate-400">{cust.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{cust.customerId}</td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{cust.ordersCount} orders</td>
                  <td className="py-3 px-4 font-extrabold text-brandOrange-600">₹{cust.totalSpent}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      cust.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {cust.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold rounded-lg transition-smooth"
                    >
                      Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-extrabold text-navy-900 text-base">Patient Profile</h3>
              <button onClick={() => setSelectedCustomer(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-navy-900 text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-md">
                {selectedCustomer.firstName.charAt(0)}
              </div>
              <h4 className="font-extrabold text-lg text-navy-900">{selectedCustomer.firstName} {selectedCustomer.lastName}</h4>
              <p className="text-xs text-slate-400 font-mono">{selectedCustomer.customerId} • {selectedCustomer.email}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs text-slate-700">
              <h5 className="font-bold text-navy-900 uppercase text-[10px]">Registered Contact & Address</h5>
              <p>Phone: {selectedCustomer.phone}</p>
              <p>{selectedCustomer.address.addressLine1}</p>
              <p>{selectedCustomer.address.city}, {selectedCustomer.address.state} - {selectedCustomer.address.pincode}</p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleToggleBlock(selectedCustomer)}
                className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl transition-smooth ${
                  selectedCustomer.status === 'Active'
                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                }`}
              >
                {selectedCustomer.status === 'Active' ? 'Block Patient Account' : 'Unblock Account'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
