import React, { useState } from 'react';
import { 
  Calendar, Clock, Video, Building2, Check, X, Search, Filter, 
  User, Phone, Mail, FileText, ChevronRight, AlertCircle, 
  CalendarCheck, CalendarClock, UserCheck, Stethoscope, Sparkles
} from 'lucide-react';
import { initialAdminAppointments } from '../../data/adminAppointmentsData';
import { useToast } from '../../context/ToastContext';

export const AdminAppointments = () => {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState(initialAdminAppointments);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [rescheduleModalApt, setRescheduleModalApt] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('11:00 AM');

  // Stats calculation
  const totalCount = appointments.length;
  const confirmedCount = appointments.filter(a => a.status === 'Confirmed').length;
  const pendingCount = appointments.filter(a => a.status === 'Pending').length;
  const onlineCount = appointments.filter(a => a.consultationMode === 'Online').length;

  const filtered = appointments.filter(a => {
    const matchesStatus = selectedStatus === 'All' || a.status === selectedStatus;
    const matchesMode = selectedMode === 'All' || a.consultationMode === selectedMode;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      a.patient.name.toLowerCase().includes(q) || 
      a.patient.phone.toLowerCase().includes(q) ||
      a.appointmentId.toLowerCase().includes(q);
    return matchesStatus && matchesMode && matchesSearch;
  });

  const handleUpdateStatus = (id, newStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    showToast(`Appointment marked as ${newStatus}`, 'success');
  };

  const handleConfirmReschedule = (e) => {
    e.preventDefault();
    if (!rescheduleDate) return;
    setAppointments(prev => prev.map(a => a.id === rescheduleModalApt.id ? { 
      ...a, 
      date: rescheduleDate, 
      time: rescheduleTime, 
      status: 'Confirmed' 
    } : a));
    setRescheduleModalApt(null);
    showToast('Appointment rescheduled and patient notified!', 'success');
  };

  const statusStyles = {
    Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-emerald-500/10',
    Completed: 'bg-teal-50 text-teal-700 border-teal-200/80 ring-teal-500/10',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200/80 ring-amber-500/10',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200/80 ring-rose-500/10'
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
              <Stethoscope className="w-3.5 h-3.5 text-brandOrange-400" />
              Clinical Consultations
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Appointments Desk
            </h1>
            <p className="text-slate-300 text-sm max-w-xl font-normal leading-relaxed">
              Streamline Dr. Bharathi’s daily clinical caseload, video consultations, and patient slot rescheduling.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left">
                <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-bold">Doctor Availability</span>
                <span className="text-xs font-bold text-white">Active on Consultation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Overview Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Scheduled</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-navy-900">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-navy-950">{totalCount}</span>
            <span className="text-xs text-slate-400 font-semibold">Patients</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirmed</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{confirmedCount}</span>
            <span className="text-xs text-emerald-700/80 font-semibold">Ready for slot</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Awaiting Confirmation</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">{pendingCount}</span>
            <span className="text-xs text-amber-700/80 font-semibold">Needs review</span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Online Video Calls</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-sky-600">{onlineCount}</span>
            <span className="text-xs text-sky-700/80 font-semibold">Tele-health</span>
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
            placeholder="Search by patient name, phone, or appointment ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50/80 border border-slate-200/80 rounded-xl focus:outline-none focus:border-brandOrange-500 focus:bg-white transition-all shadow-inner"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden lg:inline">Status:</span>
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-smooth ${
                selectedStatus === st
                  ? 'bg-navy-950 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-navy-900 border border-slate-200/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
          {['All', 'Clinic', 'Online'].map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedMode === mode
                  ? 'bg-brandOrange-50 text-brandOrange-600 border border-brandOrange-200 font-black'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {mode === 'All' ? 'All Modes' : mode === 'Clinic' ? 'In-Clinic' : 'Online Call'}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white/95 backdrop-blur-sm rounded-[2.25rem] border border-slate-200/90 p-12 text-center shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-navy-950">No Appointments Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No consultations match your selected filter criteria or search query.
            </p>
          </div>
          <button
            onClick={() => { setSelectedStatus('All'); setSelectedMode('All'); setSearchQuery(''); }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold text-xs rounded-xl transition-all"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((apt) => (
            <div 
              key={apt.id} 
              className="group bg-white/95 backdrop-blur-sm rounded-[2rem] border border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(15,36,56,0.06)] hover:shadow-xl hover:border-brandOrange-200 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Card Top / Header */}
              <div className="p-6 space-y-4">
                
                {/* ID & Status Pill */}
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                    {apt.appointmentId}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ring-1 ${statusStyles[apt.status] || 'bg-slate-100 text-slate-700'}`}>
                    {apt.status}
                  </span>
                </div>

                {/* Patient Profile Header */}
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-navy-900 via-navy-800 to-slate-800 text-white font-black flex items-center justify-center text-sm shadow-md flex-shrink-0">
                    {apt.patient.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-heading font-black text-base text-navy-950 truncate group-hover:text-brandOrange-600 transition-colors">
                      {apt.patient.name}
                    </h4>
                    <div className="flex flex-col gap-0.5 mt-0.5 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {apt.patient.phone}
                      </span>
                      {apt.patient.email && (
                        <span className="flex items-center gap-1.5 truncate text-[11px] text-slate-400">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {apt.patient.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Consultation Details Pill Box */}
                <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-100 space-y-2.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brandOrange-500" />
                      <span className="font-black text-navy-900">{apt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-600 bg-white px-2 py-0.5 rounded-lg border border-slate-200/80 shadow-2xs">
                      <Clock className="w-3.5 h-3.5 text-brandOrange-500" />
                      {apt.time}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                    {apt.consultationMode === 'Online' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-sky-50 text-sky-700 font-bold text-[11px] border border-sky-200/70">
                        <Video className="w-3.5 h-3.5 text-sky-500" />
                        Online Video Consult
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-50 text-purple-700 font-bold text-[11px] border border-purple-200/70">
                        <Building2 className="w-3.5 h-3.5 text-purple-500" />
                        Clinic Visit
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 font-medium truncate">
                      {apt.appointmentType}
                    </span>
                  </div>

                  {apt.patientNote && (
                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-start gap-2 text-slate-600 text-[11px] italic bg-white/60 p-2.5 rounded-xl">
                      <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <p className="line-clamp-2">"{apt.patientNote}"</p>
                    </div>
                  )}
                </div>

              </div>

              {/* Card Actions Footer */}
              <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => {
                    setRescheduleModalApt(apt);
                    setRescheduleDate(apt.date || '');
                    setRescheduleTime(apt.time || '11:00 AM');
                  }}
                  className="px-3.5 py-2 font-bold text-brandOrange-600 hover:text-brandOrange-700 hover:bg-brandOrange-50 rounded-xl transition-all"
                >
                  Reschedule
                </button>

                <div className="flex items-center gap-1.5">
                  {apt.status === 'Pending' && (
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'Confirmed')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Confirm
                    </button>
                  )}
                  {apt.status === 'Confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'Completed')}
                      className="px-3.5 py-1.5 bg-navy-950 hover:bg-navy-900 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark Done
                    </button>
                  )}
                  {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'Cancelled')}
                      className="px-2.5 py-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 font-bold rounded-xl transition-all text-[11px]"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.25rem] p-7 max-w-md w-full space-y-5 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-brandOrange-500">Consultation Calendar</span>
                <h3 className="font-heading font-black text-navy-950 text-lg">Reschedule Appointment</h3>
              </div>
              <button 
                onClick={() => setRescheduleModalApt(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy-900 text-white font-bold flex items-center justify-center text-xs">
                {rescheduleModalApt.patient.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-xs text-navy-950">{rescheduleModalApt.patient.name}</h4>
                <p className="text-[10px] text-slate-400 font-mono">{rescheduleModalApt.appointmentId} • {rescheduleModalApt.appointmentType}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmReschedule} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">New Consultation Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:border-brandOrange-500 focus:bg-white font-medium text-slate-800 transition-all"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Available Time Slot</label>
                <select
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full p-3 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:border-brandOrange-500 focus:bg-white font-medium text-slate-800 transition-all"
                >
                  <option value="09:30 AM">09:30 AM (Morning Clinic)</option>
                  <option value="11:00 AM">11:00 AM (Morning Clinic)</option>
                  <option value="04:30 PM">04:30 PM (Evening Consultation)</option>
                  <option value="06:00 PM">06:00 PM (Evening Consultation)</option>
                  <option value="07:30 PM">07:30 PM (Special Case)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setRescheduleModalApt(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-brandOrange-500 via-orange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white font-black rounded-xl shadow-lg shadow-brandOrange-500/25 transition-all"
                >
                  Save & Notify Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
