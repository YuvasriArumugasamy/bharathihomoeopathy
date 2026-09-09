import React, { useState } from 'react';
import { 
  MessageSquare, Search, Check, Send, X, Clock, User, Mail, Phone, 
  AlertCircle, CheckCircle2, MessageCircle, ArrowRight, CornerDownRight, 
  HelpCircle, Sparkles, Filter, ShieldCheck, Tag
} from 'lucide-react';
import { initialAdminEnquiries } from '../../data/adminReviewsData';
import { useToast } from '../../context/ToastContext';

export const AdminEnquiries = () => {
  const { showToast } = useToast();
  const [enquiries, setEnquiries] = useState(initialAdminEnquiries);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Metrics
  const totalCount = enquiries.length;
  const newCount = enquiries.filter(e => e.status === 'New').length;
  const inProgressCount = enquiries.filter(e => e.status === 'In Progress').length;
  const resolvedCount = enquiries.filter(e => e.status === 'Resolved').length;

  const filtered = enquiries.filter(enq => {
    const matchesStatus = statusFilter === 'All' || enq.status === statusFilter;
    const matchesType = typeFilter === 'All' || enq.type === typeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      enq.customer.name.toLowerCase().includes(q) ||
      enq.customer.email.toLowerCase().includes(q) ||
      enq.subject.toLowerCase().includes(q) ||
      enq.enquiryId.toLowerCase().includes(q) ||
      (enq.customer.phone && enq.customer.phone.includes(q));
    return matchesStatus && matchesType && matchesSearch;
  });

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newReply = {
      id: 'rep-' + Date.now(),
      sender: 'Dr. Bharathi Support Team',
      message: replyText.trim(),
      createdAt: 'Just now'
    };

    setEnquiries(prev => prev.map(enq => enq.id === selectedEnquiry.id ? {
      ...enq,
      status: 'Resolved',
      replies: [...(enq.replies || []), newReply]
    } : enq));

    setSelectedEnquiry(prev => ({
      ...prev,
      status: 'Resolved',
      replies: [...(prev.replies || []), newReply]
    }));

    setReplyText('');
    showToast('Official response dispatched to customer email!', 'success');
  };

  const priorityStyles = {
    High: 'bg-rose-50 text-rose-700 border-rose-200/80',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200/80',
    Low: 'bg-slate-50 text-slate-600 border-slate-200/80'
  };

  const statusStyles = {
    New: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10',
    'In Progress': 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-500/10',
    Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] p-7 sm:p-9 rounded-[2.25rem] border border-white/30 shadow-2xl shadow-orange-500/20 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-amber-300/25 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-slate-900 text-[10.5px] font-black tracking-widest uppercase shadow-md border border-white">
              <MessageSquare className="w-3.5 h-3.5 text-orange-600 stroke-[2.5]" />
              Patient Communications
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              Support & Enquiries Desk
            </h1>
            <p className="text-white text-xs sm:text-sm max-w-xl font-bold leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
              Resolve prescription doubts, consultation slot queries, dispensary order inquiries, and direct patient queries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-5 py-3.5 bg-white text-slate-900 rounded-2xl shadow-xl border border-white flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              <div className="text-left">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-black">Unresolved Inquiries</span>
                <span className="text-xs sm:text-sm font-black text-slate-900">{newCount + inProgressCount} Pending Attention</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Overview Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Inquiries</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-navy-900">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-navy-950">{totalCount}</span>
            <span className="text-xs text-slate-400 font-semibold">Messages</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Unread</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">{newCount}</span>
            <span className="text-xs text-amber-700/80 font-semibold">Requires Reply</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Progress</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-sky-600">{inProgressCount}</span>
            <span className="text-xs text-sky-700/80 font-semibold">Communicating</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolved</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{resolvedCount}</span>
            <span className="text-xs text-emerald-700/80 font-semibold">Closed Cases</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white/95 backdrop-blur-sm p-5 rounded-[2rem] border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search inquiry subject, patient name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden lg:inline">Status:</span>
          {['All', 'New', 'In Progress', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-smooth ${
                statusFilter === st
                  ? 'bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-navy-900 border border-slate-200/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
          {['All', 'Product', 'Appointment', 'Order'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                typeFilter === type
                  ? 'bg-brandOrange-50 text-brandOrange-600 border border-brandOrange-200 font-black'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {type === 'All' ? 'All Types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white/95 backdrop-blur-sm rounded-[2.25rem] border border-slate-200/90 p-12 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-navy-950">No Enquiries Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No patient questions match your search or selected status/type filters.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((enq) => (
            <div 
              key={enq.id} 
              className="group bg-white/95 backdrop-blur-sm rounded-[2rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] hover:shadow-xl hover:border-brandOrange-200 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Card Body */}
              <div className="p-6 space-y-4">
                
                {/* ID, Priority, Status */}
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      {enq.enquiryId}
                    </span>
                    {enq.priority && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${priorityStyles[enq.priority] || 'bg-slate-50 text-slate-600'}`}>
                        {enq.priority}
                      </span>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ring-1 ${statusStyles[enq.status] || 'bg-slate-100 text-slate-700'}`}>
                    {enq.status}
                  </span>
                </div>

                {/* Patient / Sender Header */}
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-heading font-black text-sm text-navy-950 truncate group-hover:text-brandOrange-600 transition-colors">
                      {enq.customer.name}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium block truncate">
                      {enq.customer.email}
                    </span>
                  </div>
                </div>

                {/* Subject & Message Preview */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px] uppercase tracking-wider">
                      {enq.type || 'General'}
                    </span>
                    <h5 className="font-bold text-xs text-slate-900 truncate">
                      {enq.subject}
                    </h5>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed bg-slate-50/70 p-3 rounded-2xl border border-slate-100 italic">
                    "{enq.message}"
                  </p>
                </div>

              </div>

              {/* Card Footer */}
              <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{enq.createdAt}</span>
                  {enq.replies && enq.replies.length > 0 && (
                    <span className="inline-flex items-center gap-1 font-bold text-navy-900 bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[10px]">
                      <MessageCircle className="w-3 h-3 text-brandOrange-500" />
                      {enq.replies.length}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedEnquiry(enq)}
                  className="px-4 py-2 bg-gradient-to-r from-brandOrange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white font-black rounded-xl text-xs shadow-md shadow-brandOrange-500/20 transition-all flex items-center gap-1.5"
                >
                  <span>View & Reply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Enquiry Detail & Reply Drawer */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-navy-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl h-full overflow-y-auto p-7 sm:p-9 space-y-6 shadow-2xl flex flex-col justify-between border-l border-slate-100">
            
            <div className="space-y-6">
              
              {/* Drawer Top Header */}
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
                      {selectedEnquiry.enquiryId}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${statusStyles[selectedEnquiry.status]}`}>
                      {selectedEnquiry.status}
                    </span>
                  </div>
                  <h3 className="font-heading font-black text-lg text-navy-950 mt-1">
                    {selectedEnquiry.subject}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedEnquiry(null)} 
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Patient Contact Strip */}
              <div className="p-4 bg-slate-50/90 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h4 className="font-bold text-xs text-navy-950">{selectedEnquiry.customer.name}</h4>
                    <span className="text-[11px] text-slate-400 block">{selectedEnquiry.customer.email}</span>
                  </div>
                </div>
                {selectedEnquiry.customer.phone && (
                  <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-xl border border-slate-200/80">
                    {selectedEnquiry.customer.phone}
                  </span>
                )}
              </div>

              {/* Original Message Box */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Patient Message</span>
                <div className="p-5 bg-gradient-to-br from-slate-50 to-amber-50/20 rounded-[2rem] border border-slate-200/80 space-y-2">
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {selectedEnquiry.message}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px] text-slate-400">
                    <span>Category: <strong>{selectedEnquiry.type || 'General'}</strong></span>
                    <span>Received: {selectedEnquiry.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Conversation / Reply History */}
              {selectedEnquiry.replies && selectedEnquiry.replies.length > 0 && (
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Communication Timeline</span>
                  <div className="space-y-3">
                    {selectedEnquiry.replies.map((reply) => (
                      <div key={reply.id} className="p-4 bg-navy-950 text-white rounded-2xl space-y-1 shadow-sm ml-6">
                        <div className="flex justify-between items-center text-[10px] text-brandOrange-400 font-bold">
                          <span>{reply.sender}</span>
                          <span className="text-slate-400 font-normal">{reply.createdAt}</span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">
                          {reply.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Quick Reply Form */}
            <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-100 space-y-3">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Compose Formal Reply
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Type your official medical or dispensary response..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                  <Mail className="w-3 h-3 text-slate-400" />
                  Sends instant notification to patient
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-brandOrange-500 via-orange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white font-black text-xs rounded-xl shadow-lg shadow-brandOrange-500/25 transition-all flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send & Resolve
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
