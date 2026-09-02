import React, { useState } from 'react';
import { CreditCard, Search, CheckCircle2, RotateCcw, AlertTriangle, ArrowDownLeft, X } from 'lucide-react';
import { initialAdminPayments } from '../../data/adminPaymentsData';
import { useToast } from '../../context/ToastContext';

export const AdminPayments = () => {
  const { showToast } = useToast();
  const [payments, setPayments] = useState(initialAdminPayments);
  const [refundModalItem, setRefundModalItem] = useState(null);
  const [refundReason, setRefundReason] = useState('');

  const totalCollected = payments.filter(p => p.paymentStatus === 'Paid').reduce((a, b) => a + b.amount, 0);
  const totalRefunded = payments.filter(p => p.paymentStatus === 'Refunded').reduce((a, b) => a + b.amount, 0);

  const handleMarkAsPaid = (id) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, paymentStatus: 'Paid' } : p));
    showToast('Payment confirmed and recorded as Paid', 'success');
  };

  const handleConfirmRefund = (e) => {
    e.preventDefault();
    if (!refundModalItem) return;
    setPayments(prev => prev.map(p => p.id === refundModalItem.id ? { ...p, paymentStatus: 'Refunded', refundAmount: refundModalItem.amount, refundReason } : p));
    setRefundModalItem(null);
    showToast('Payment refunded successfully', 'info');
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brandOrange-600">Financial Settlements</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">Payments Management</h1>
          <p className="text-xs text-slate-500">Track Razorpay transactions, cash on delivery collections, and clinic refunds.</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Net Collected</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">₹{totalCollected.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Processed Refunds</span>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">₹{totalRefunded.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Settlement Gateway</span>
          <p className="text-2xl font-extrabold text-navy-900 mt-1">Razorpay & COD</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-100">
                <th className="py-3 px-4 font-bold">Transaction</th>
                <th className="py-3 px-4 font-bold">Order ID</th>
                <th className="py-3 px-4 font-bold">Patient</th>
                <th className="py-3 px-4 font-bold">Amount</th>
                <th className="py-3 px-4 font-bold">Mode</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">{p.paymentId}</td>
                  <td className="py-3 px-4 font-mono text-navy-900 font-extrabold">{p.orderId}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{p.customerName}</td>
                  <td className="py-3 px-4 font-extrabold text-navy-900">₹{p.amount}</td>
                  <td className="py-3 px-4 text-slate-500">{p.paymentMethod}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      p.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                      p.paymentStatus === 'Refunded' ? 'bg-purple-50 text-purple-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {p.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {p.paymentStatus === 'Pending' ? (
                      <button
                        onClick={() => handleMarkAsPaid(p.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px]"
                      >
                        Mark Paid
                      </button>
                    ) : p.paymentStatus === 'Paid' ? (
                      <button
                        onClick={() => setRefundModalItem(p)}
                        className="px-2.5 py-1 text-rose-600 hover:bg-rose-50 font-bold rounded-lg text-[11px]"
                      >
                        Refund
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Modal */}
      {refundModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-navy-900 text-sm">Issue Patient Refund</h3>
            <p className="text-xs text-slate-500">Order: <strong>{refundModalItem.orderId}</strong> (Amount: ₹{refundModalItem.amount})</p>

            <form onSubmit={handleConfirmRefund} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Refund</label>
                <textarea
                  rows={2}
                  required
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="e.g. Order cancelled by patient before dispatch"
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRefundModalItem(null)}
                  className="flex-1 py-2 bg-slate-100 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-rose-600 text-white font-bold rounded-xl"
                >
                  Process Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
