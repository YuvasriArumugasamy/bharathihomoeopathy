import React, { useState } from 'react';
import { Star, Check, X, Eye, ShieldCheck, Filter } from 'lucide-react';
import { initialAdminReviews } from '../../data/adminReviewsData';
import { useToast } from '../../context/ToastContext';

export const AdminReviews = () => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState(initialAdminReviews);
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = reviews.filter(r => filterStatus === 'All' || r.status === filterStatus);

  const handleUpdateStatus = (id, newStatus) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    showToast(`Review marked as ${newStatus}`, 'success');
  };

  const handleToggleFeatured = (id) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, isFeatured: !r.isFeatured } : r));
    showToast('Review featured status updated', 'info');
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brandOrange-600">Patient Feedback</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">Reviews Moderation</h1>
          <p className="text-xs text-slate-500">Moderate product ratings, patient testimonials, and featured homepage highlights.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {['All', 'Pending', 'Approved', 'Rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-smooth ${
              filterStatus === st ? 'bg-navy-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {st} Reviews
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filtered.map((rev) => (
          <div key={rev.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-navy-900">{rev.customer.name}</span>
                <span className="text-[11px] text-slate-400">on <strong className="text-slate-700">{rev.product.name}</strong></span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  rev.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                  rev.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  {rev.status}
                </span>
                {rev.isFeatured && (
                  <span className="px-2 py-0.5 bg-brandOrange-50 text-brandOrange-600 font-extrabold text-[10px] rounded-full">
                    ★ Featured
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-amber-500 text-xs">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>

              <h4 className="font-bold text-xs text-slate-800">{rev.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{rev.content}</p>
            </div>

            <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-end text-xs">
              <button
                onClick={() => handleToggleFeatured(rev.id)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
              >
                {rev.isFeatured ? 'Unfeature' : 'Feature on Home'}
              </button>
              {rev.status !== 'Approved' && (
                <button
                  onClick={() => handleUpdateStatus(rev.id, 'Approved')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                >
                  Approve
                </button>
              )}
              {rev.status !== 'Rejected' && (
                <button
                  onClick={() => handleUpdateStatus(rev.id, 'Rejected')}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg"
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
