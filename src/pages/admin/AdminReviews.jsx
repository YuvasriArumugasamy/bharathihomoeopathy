import React, { useState } from 'react';
import { 
  Star, Check, X, Eye, ShieldCheck, Filter, Search, 
  Sparkles, ThumbsUp, MessageSquare, AlertCircle, Award, 
  CheckCircle2, XCircle, Heart
} from 'lucide-react';
import { initialAdminReviews } from '../../data/adminReviewsData';
import { useToast } from '../../context/ToastContext';

export const AdminReviews = () => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState(initialAdminReviews);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Computed metrics
  const totalCount = reviews.length;
  const approvedCount = reviews.filter(r => r.status === 'Approved').length;
  const pendingCount = reviews.filter(r => r.status === 'Pending').length;
  const featuredCount = reviews.filter(r => r.isFeatured).length;
  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)).toFixed(1);

  const filtered = reviews.filter(r => {
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    const matchesFeatured = !featuredOnly || r.isFeatured;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      r.customer.name.toLowerCase().includes(q) ||
      r.product.name.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.content.toLowerCase().includes(q);
    return matchesStatus && matchesFeatured && matchesSearch;
  });

  const handleUpdateStatus = (id, newStatus) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    showToast(`Review marked as ${newStatus}`, 'success');
  };

  const handleToggleFeatured = (id) => {
    setReviews(prev => prev.map(r => {
      if (r.id === id) {
        const nextFeatured = !r.isFeatured;
        showToast(
          nextFeatured ? 'Review pinned to Homepage Testimonials!' : 'Review unpinned from Homepage', 
          'info'
        );
        return { ...r, isFeatured: nextFeatured };
      }
      return r;
    }));
  };

  const statusStyles = {
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-emerald-500/10',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200/80 ring-amber-500/10',
    Rejected: 'bg-rose-50 text-rose-700 border-rose-200/80 ring-rose-500/10'
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
              <Star className="w-3.5 h-3.5 text-brandOrange-400 fill-brandOrange-400" />
              Patient Experience & Ratings
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Reviews & Testimonials
            </h1>
            <p className="text-slate-300 text-sm max-w-xl font-normal leading-relaxed">
              Curate patient healing testimonials, verify homeopathic remedy feedback, and feature high-rating stories.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 text-amber-300 flex items-center justify-center font-black text-base">
                ★
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-bold">Overall Rating</span>
                <span className="text-base font-black text-white">{avgRating} <span className="text-xs text-amber-300">/ 5.0</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Overview Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Reviews</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-navy-900">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-navy-950">{totalCount}</span>
            <span className="text-xs text-slate-400 font-semibold">Submissions</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Approved & Public</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{approvedCount}</span>
            <span className="text-xs text-emerald-700/80 font-semibold">Published</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Awaiting Audit</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">{pendingCount}</span>
            <span className="text-xs text-amber-700/80 font-semibold">In Queue</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Featured Highlights</span>
            <div className="w-9 h-9 rounded-xl bg-brandOrange-50 flex items-center justify-center text-brandOrange-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-brandOrange-600">{featuredCount}</span>
            <span className="text-xs text-brandOrange-700/80 font-semibold">On Home</span>
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
            placeholder="Search reviews by patient, remedy, or testimonial words..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['All', 'Pending', 'Approved', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-smooth ${
                filterStatus === st
                  ? 'bg-navy-950 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-navy-900 border border-slate-200/60'
              }`}
            >
              {st} Reviews
            </button>
          ))}
        </div>

        {/* Featured Filter Toggle */}
        <button
          onClick={() => setFeaturedOnly(!featuredOnly)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
            featuredOnly
              ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200/80'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{featuredOnly ? 'Showing Featured' : 'Filter Featured'}</span>
        </button>
      </div>

      {/* Reviews List */}
      {filtered.length === 0 ? (
        <div className="bg-white/95 backdrop-blur-sm rounded-[2.25rem] border border-slate-200/90 p-12 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
            <Star className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-navy-950">No Reviews Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No patient feedback matches your current search or moderation filters.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((rev) => (
            <div 
              key={rev.id} 
              className="group bg-white/95 backdrop-blur-sm rounded-[2rem] border border-slate-200/90 p-6 sm:p-7 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] hover:shadow-lg hover:border-brandOrange-200 transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
            >
              {/* Content Left */}
              <div className="space-y-3.5 flex-1">
                
                {/* Author & Product Header */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-navy-950 to-slate-800 text-white font-black flex items-center justify-center text-xs shadow-xs">
                    {rev.customer.avatar ? (
                      <img src={rev.customer.avatar} alt={rev.customer.name} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      rev.customer.name.charAt(0)
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-black text-sm text-navy-950">
                        {rev.customer.name}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Verified Patient
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Reviewed remedy: <strong className="text-slate-700 font-bold">{rev.product.name}</strong>
                    </span>
                  </div>

                  <div className="ml-auto lg:ml-2 flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ring-1 ${statusStyles[rev.status] || 'bg-slate-100 text-slate-700'}`}>
                      {rev.status}
                    </span>
                    {rev.isFeatured && (
                      <span className="px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-brandOrange-500 text-white font-black text-[10px] rounded-full shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Stars Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs font-black text-slate-700">{rev.rating}.0</span>
                  <span className="text-[11px] text-slate-400">• {rev.createdAt}</span>
                </div>

                {/* Testimonial Quote */}
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-1">
                  <h4 className="font-heading font-black text-xs text-navy-950">{rev.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{rev.content}"
                  </p>
                  {rev.rejectionReason && rev.status === 'Rejected' && (
                    <p className="text-[11px] text-rose-600 font-semibold pt-1 border-t border-rose-100">
                      Reason: {rev.rejectionReason}
                    </p>
                  )}
                </div>

              </div>

              {/* Action Buttons Right */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                <button
                  onClick={() => handleToggleFeatured(rev.id)}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all border flex items-center gap-1.5 ${
                    rev.isFeatured
                      ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {rev.isFeatured ? 'Unpin' : 'Feature on Home'}
                </button>

                {rev.status !== 'Approved' && (
                  <button
                    onClick={() => handleUpdateStatus(rev.id, 'Approved')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve
                  </button>
                )}

                {rev.status !== 'Rejected' && (
                  <button
                    onClick={() => handleUpdateStatus(rev.id, 'Rejected')}
                    className="px-3.5 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
