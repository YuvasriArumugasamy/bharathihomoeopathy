import React, { useState } from 'react';
import { 
  CreditCard, Search, CheckCircle2, RotateCcw, AlertTriangle, 
  ArrowDownLeft, X, IndianRupee, ShieldCheck, Banknote, Clock, 
  ArrowUpRight, Sparkles, Filter, Check
} from 'lucide-react';
import { initialAdminPayments } from '../../data/adminPaymentsData';
import { useToast } from '../../context/ToastContext';

export const AdminPayments = () => {
  const { showToast } = useToast();
  const [payments, setPayments] = useState(initialAdminPayments);
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refundModalItem, setRefundModalItem] = useState(null);
  const [refundReason, setRefundReason] = useState('');

  // Financial Metrics
  const totalCollected = payments
    .filter(p => p.paymentStatus === 'Paid')
    .reduce((a, b) => a + b.amount, 0);

  const totalRefunded = payments
    .filter(p => p.paymentStatus === 'Refunded')
    .reduce((a, b) => a + (b.refundAmount || b.amount), 0);

  const pendingSettlement = payments
    .filter(p => p.paymentStatus === 'Pending')
    .reduce((a, b) => a + b.amount, 0);

  const filtered = payments.filter(p => {
    const matchesStatus = statusFilter === 'All' || p.paymentStatus === statusFilter;
    const matchesMethod = methodFilter === 'All' || p.paymentMethod === methodFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      p.paymentId.toLowerCase().includes(q) ||
      p.orderId.toLowerCase().includes(q) ||
      p.customerName.toLowerCase().includes(q);
    return matchesStatus && matchesMethod && matchesSearch;
  });

  const handleMarkAsPaid = (id) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, paymentStatus: 'Paid' } : p));
    showToast('Payment confirmed and recorded as Paid', 'success');
  };

  const handleConfirmRefund = (e) => {
    e.preventDefault();
    if (!refundModalItem) return;
    setPayments(prev => prev.map(p => p.id === refundModalItem.id ? { 
      ...p, 
      paymentStatus: 'Refunded', 
      refundAmount: refundModalItem.amount, 
      refundReason 
    } : p));
    setRefundModalItem(null);
    setRefundReason('');
    showToast('Payment refunded successfully to patient account', 'info');
  };

  const statusStyles = {
    Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10',
    Refunded: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/10'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#4B7D8D] via-[#5A8E9E] to-[#C67B3C] p-7 sm:p-9 rounded-[2.25rem] border border-[#4B7D8D]/40 shadow-2xl text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-[#C67B3C]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brandOrange-500/20 border border-brandOrange-400/30 text-brandOrange-300 text-xs font-black tracking-widest uppercase">
              <CreditCard className="w-3.5 h-3.5 text-brandOrange-400" />
              Financial Settlements & Treasury
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Payments & Refunds
            </h1>
            <p className="text-slate-300 text-sm max-w-xl font-normal leading-relaxed">
              Track live Razorpay transactions, Cash-on-Delivery reconcilements, order settlement ledger, and clinic refunds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center font-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-bold">Gateway Integration</span>
                <span className="text-xs font-bold text-white">Razorpay Live 256-bit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Overview Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Revenue Collected</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">₹{totalCollected.toLocaleString('en-IN')}</span>
            <span className="text-xs text-emerald-700/80 font-semibold">Settled</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Processed Refunds</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-600">₹{totalRefunded.toLocaleString('en-IN')}</span>
            <span className="text-xs text-rose-700/80 font-semibold">Reversed</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Settlement</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">₹{pendingSettlement.toLocaleString('en-IN')}</span>
            <span className="text-xs text-amber-700/80 font-semibold">Awaiting</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Gateways</span>
            <div className="w-9 h-9 rounded-xl bg-navy-50 flex items-center justify-center text-navy-900">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-navy-950">Razorpay</span>
            <span className="text-xs text-slate-500 font-semibold">& COD</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white/95 backdrop-blur-sm p-5 rounded-[2rem] border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search payment ID, order ID, or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">Status:</span>
          {['All', 'Paid', 'Pending', 'Refunded'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-smooth ${
                statusFilter === st
                  ? 'bg-navy-950 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-navy-900 border border-slate-200/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Method Filter */}
        <div className="flex items-center gap-1 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
          {['All', 'Razorpay', 'COD'].map((method) => (
            <button
              key={method}
              onClick={() => setMethodFilter(method)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                methodFilter === method
                  ? 'bg-brandOrange-50 text-brandOrange-600 border border-brandOrange-200 font-black'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {method === 'All' ? 'All Methods' : method}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Ledger Table */}
      <div className="bg-white/95 backdrop-blur-sm rounded-[2.25rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Transaction Ref</th>
                <th className="py-4 px-5">Order Reference</th>
                <th className="py-4 px-5">Patient Name</th>
                <th className="py-4 px-5">Gross Amount</th>
                <th className="py-4 px-5">Payment Method</th>
                <th className="py-4 px-5">Settlement Status</th>
                <th className="py-4 px-6 text-right">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="font-bold text-sm text-slate-600">No payment records found.</p>
                    <p className="text-xs text-slate-400 mt-1">Try modifying search filters or selecting All.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors group">
                    
                    {/* Transaction ID */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-black text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
                          {p.paymentId}
                        </span>
                      </div>
                    </td>

                    {/* Order ID */}
                    <td className="py-4 px-5">
                      <span className="font-mono text-xs font-extrabold text-navy-950 group-hover:text-brandOrange-600 transition-colors">
                        {p.orderId}
                      </span>
                    </td>

                    {/* Patient */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-navy-900 text-white font-bold flex items-center justify-center text-[10px]">
                          {p.customerName.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800">{p.customerName}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-5">
                      <span className="font-black text-sm text-navy-950">
                        ₹{(p.amount || 0).toLocaleString('en-IN')}
                      </span>
                    </td>

                    {/* Method */}
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/60">
                        {p.paymentMethod === 'Razorpay' ? (
                          <CreditCard className="w-3.5 h-3.5 text-sky-500" />
                        ) : (
                          <Banknote className="w-3.5 h-3.5 text-emerald-500" />
                        )}
                        {p.paymentMethod}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ring-1 ${statusStyles[p.paymentStatus] || 'bg-slate-100 text-slate-700'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          p.paymentStatus === 'Paid' ? 'bg-emerald-500' :
                          p.paymentStatus === 'Pending' ? 'bg-amber-500' : 'bg-purple-500'
                        }`} />
                        {p.paymentStatus}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      {p.paymentStatus === 'Pending' ? (
                        <button
                          onClick={() => handleMarkAsPaid(p.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-xs transition-all flex items-center gap-1 ml-auto"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Mark Paid
                        </button>
                      ) : p.paymentStatus === 'Paid' ? (
                        <button
                          onClick={() => {
                            setRefundModalItem(p);
                            setRefundReason('');
                          }}
                          className="px-3 py-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/80 font-bold rounded-xl text-xs transition-all flex items-center gap-1 ml-auto"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Refund
                        </button>
                      ) : (
                        <span className="text-slate-400 font-medium text-[11px] italic">
                          Reversed
                        </span>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Modal */}
      {refundModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.25rem] p-7 max-w-md w-full space-y-5 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-500">Reversal Desk</span>
                <h3 className="font-heading font-black text-navy-950 text-lg">Process Patient Refund</h3>
              </div>
              <button 
                onClick={() => setRefundModalItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Order Reference:</span>
                <strong className="font-mono text-navy-950">{refundModalItem.orderId}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Patient Name:</span>
                <strong className="text-navy-950">{refundModalItem.customerName}</strong>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-rose-200/60 text-rose-700 font-bold">
                <span>Refund Amount:</span>
                <span className="text-base font-black">₹{refundModalItem.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmRefund} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Audit Reason for Refund *
                </label>
                <textarea
                  rows={3}
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="e.g. Consultation rescheduled by patient; remedy batch return accepted."
                  className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white font-medium text-slate-800 transition-all leading-relaxed"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRefundModalItem(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl shadow-lg shadow-rose-600/25 transition-all flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Confirm Reversal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
