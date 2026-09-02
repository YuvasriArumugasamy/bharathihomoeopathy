import React, { useState } from 'react';
import { MessageSquare, Search, Check, Send, X, Clock, User, Mail, Phone } from 'lucide-react';
import { initialAdminEnquiries } from '../../data/adminReviewsData';
import { useToast } from '../../context/ToastContext';

export const AdminEnquiries = () => {
  const { showToast } = useToast();
  const [enquiries, setEnquiries] = useState(initialAdminEnquiries);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newReply = {
      id: 'rep-' + Date.now(),
      sender: 'Dr. Bharathi Admin',
      message: replyText.trim(),
      createdAt: 'Just now'
    };

    setEnquiries(prev => prev.map(enq => enq.id === selectedEnquiry.id ? {
      ...enq,
      status: 'Resolved',
      replies: [...enq.replies, newReply]
    } : enq));

    setSelectedEnquiry(prev => ({
      ...prev,
      status: 'Resolved',
      replies: [...prev.replies, newReply]
    }));

    setReplyText('');
    showToast('Reply dispatched to customer email!', 'success');
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brandOrange-600">Patient Communications</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">Messages & Enquiries</h1>
          <p className="text-xs text-slate-500">Respond to prescription questions, clinic visit requests, and order inquiries.</p>
        </div>
      </div>

      {/* Enquiries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enquiries.map((enq) => (
          <div key={enq.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] text-slate-400 font-bold">{enq.enquiryId}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  enq.status === 'New' ? 'bg-amber-50 text-amber-700' :
                  enq.status === 'In Progress' ? 'bg-sky-50 text-sky-700' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {enq.status}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-navy-900">{enq.customer.name}</h4>
                <p className="text-[11px] text-slate-400">{enq.customer.email}</p>
              </div>

              <h5 className="font-bold text-xs text-slate-800">{enq.subject}</h5>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{enq.message}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">{enq.createdAt}</span>
              <button
                onClick={() => setSelectedEnquiry(enq)}
                className="px-3 py-1.5 bg-brandOrange-50 hover:bg-brandOrange-100 text-brandOrange-600 font-bold rounded-lg text-xs transition-smooth"
              >
                View & Reply
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Drawer */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-navy-950/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <span className="font-mono text-xs text-slate-400 font-bold block">{selectedEnquiry.enquiryId}</span>
                  <h3 className="font-bold text-base text-navy-900">{selectedEnquiry.subject}</h3>
                </div>
                <button onClick={() => setSelectedEnquiry(null)} className="text-slate-400"><X className="w-5 h-5" /></button>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-1 text-xs text-slate-700">
                <p><strong>From:</strong> {selectedEnquiry.customer.name} ({selectedEnquiry.customer.email})</p>
                <p><strong>Phone:</strong> {selectedEnquiry.customer.phone}</p>
                <p className="pt-2 text-slate-800 leading-relaxed font-medium">"{selectedEnquiry.message}"</p>
              </div>

              {/* Replies */}
              {selectedEnquiry.replies.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-bold text-xs text-navy-900 uppercase tracking-wider">Conversation Thread</h5>
                  {selectedEnquiry.replies.map((rep) => (
                    <div key={rep.id} className="p-3 bg-brandOrange-50/50 border border-brandOrange-100 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-brandOrange-800 block">{rep.sender}</span>
                      <p className="text-slate-700">{rep.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reply Form */}
            <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-bold text-navy-900">Send Response to Patient</label>
              <textarea
                rows={3}
                required
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your response from Dr. Bharathi’s clinic desk..."
                className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-navy-900 hover:bg-brandOrange-500 text-white font-bold text-xs rounded-xl transition-smooth flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Response</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
