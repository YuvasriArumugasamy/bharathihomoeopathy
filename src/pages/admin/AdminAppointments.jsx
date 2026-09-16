import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Video, Building2, Check, X, Search, Filter, 
  User, Phone, Mail, FileText, ChevronRight, AlertCircle, 
  CalendarCheck, CalendarClock, UserCheck, Stethoscope, Sparkles,
  Download, MessageSquare, Paperclip, Eye, ExternalLink, RotateCcw
} from 'lucide-react';
import { appointmentService, getStoredAppointments } from '../../services/appointmentService';
import { cloudSyncService } from '../../services/cloudSyncService';
import { useToast } from '../../context/ToastContext';
import { exportToCsv } from '../../utils/exportUtils';
import { sendAppointmentWhatsApp } from '../../utils/whatsappUtils';
import { PrescriptionComposerModal } from '../../components/admin/PrescriptionComposerModal';

export const AdminAppointments = () => {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState(() => (typeof getStoredAppointments === 'function' ? getStoredAppointments() : []));
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [rescheduleModalApt, setRescheduleModalApt] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('11:00 AM');
  const [viewAttachment, setViewAttachment] = useState(null);
  const [rxModalApt, setRxModalApt] = useState(null);

  const loadAppointments = async (showFeedback = false) => {
    if (showFeedback) setIsRefreshing(true);
    // Instant local read
    const local = typeof getStoredAppointments === 'function' ? getStoredAppointments() : [];
    if (Array.isArray(local) && local.length > 0) {
      setAppointments(local);
    }
    
    try {
      const data = await appointmentService.getAdminAppointments();
      if (Array.isArray(data)) {
        setAppointments(data);
      }
      if (showFeedback) {
        showToast('Appointments synced successfully!', 'success');
      }
    } catch (err) {
      if (showFeedback) {
        showToast('Synced using persistent local cache', 'info');
      }
    } finally {
      setLoading(false);
      if (showFeedback) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAppointments();

    // Real-time Cloud Sync Listener across devices
    const unsubscribe = cloudSyncService.listenToCloudAppointments((liveApts) => {
      if (Array.isArray(liveApts)) {
        setAppointments(liveApts);
      }
      setLoading(false);
    });

    // Real-time Cross-tab and Local Storage synchronizer
    const handleStorageOrFocus = (e) => {
      if (!e || !e.key || e.key === 'admin_appointments_store') {
        const fresh = typeof getStoredAppointments === 'function' ? getStoredAppointments() : [];
        if (Array.isArray(fresh)) {
          setAppointments(fresh);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadAppointments();
      }
    };

    window.addEventListener('storage', handleStorageOrFocus);
    window.addEventListener('appointments_updated', handleStorageOrFocus);
    window.addEventListener('focus', handleStorageOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
      window.removeEventListener('storage', handleStorageOrFocus);
      window.removeEventListener('appointments_updated', handleStorageOrFocus);
      window.removeEventListener('focus', handleStorageOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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
      (a.patient?.name || '').toLowerCase().includes(q) || 
      (a.patient?.phone || '').toLowerCase().includes(q) ||
      (a.appointmentId || '').toLowerCase().includes(q);
    return matchesStatus && matchesMode && matchesSearch;
  });

  const handleUpdateStatus = async (id, newStatus) => {
    await appointmentService.updateAppointmentStatus(id, newStatus);
    setAppointments(prev => prev.map(a => (a.id === id || a.appointmentId === id) ? { ...a, status: newStatus } : a));
    showToast(`Appointment marked as ${newStatus} and saved!`, 'success');
  };

  const handleConfirmReschedule = async (e) => {
    e.preventDefault();
    if (!rescheduleDate) return;
    await appointmentService.rescheduleAppointment(rescheduleModalApt.id || rescheduleModalApt.appointmentId, rescheduleDate, rescheduleTime);
    setAppointments(prev => prev.map(a => (a.id === rescheduleModalApt.id || a.appointmentId === rescheduleModalApt.appointmentId) ? { 
      ...a, 
      date: rescheduleDate, 
      time: rescheduleTime, 
      status: 'Confirmed' 
    } : a));
    setRescheduleModalApt(null);
    showToast('Appointment rescheduled and patient notified!', 'success');
  };

  const handleExportAppointments = () => {
    const columns = [
      { label: 'Appointment ID', accessor: (a) => a.appointmentId || a.id },
      { label: 'Patient Name', accessor: (a) => a.patient?.name || '' },
      { label: 'Phone', accessor: (a) => a.patient?.phone || '' },
      { label: 'Email', accessor: (a) => a.patient?.email || '' },
      { label: 'Age / Gender', accessor: (a) => `${a.patient?.age || ''} / ${a.patient?.gender || ''}` },
      { label: 'Concern', accessor: (a) => a.concern || 'General Consultation' },
      { label: 'Doctor', accessor: (a) => a.doctor || 'Dr. Bharathi' },
      { label: 'Consultation Mode', accessor: (a) => a.consultationMode || 'In-Clinic' },
      { label: 'Date', accessor: (a) => a.date || '' },
      { label: 'Time', accessor: (a) => a.time || '' },
      { label: 'Status', accessor: (a) => a.status || 'Pending' }
    ];
    const ok = exportToCsv('Doctor_Bharathi_Appointments', columns, filtered);
    if (ok) {
      showToast('Appointments exported to Excel / CSV!', 'success');
    } else {
      showToast('No appointments to export', 'warning');
    }
  };

  const statusStyles = {
    Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-emerald-500/10',
    Completed: 'bg-teal-50 text-teal-700 border-teal-200/80 ring-teal-500/10',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200/80 ring-amber-500/10',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200/80 ring-rose-500/10'
  };

  return (
    <div className="space-y-8 ">
      
      {/* 1. Hero Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] p-6 sm:p-8 lg:p-9 rounded-[2.25rem] border border-white/30 shadow-2xl shadow-orange-500/20 text-white mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-amber-300/25 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-5 text-center sm:text-left">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black tracking-wide font-serif italic text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              Clinical Consultations & Appointments
            </h1>
            <div className="flex items-center gap-2 mt-1.5 justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 text-[11px] font-black uppercase tracking-wider shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                <span>Live Cross-Device Cloud Sync</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
            <button
              type="button"
              onClick={() => loadAppointments(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-2xl text-xs font-black backdrop-blur-md border border-white/35 shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95 shrink-0"
              title="Refresh and sync latest patient appointments"
            >
              <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Refresh & Sync'}</span>
            </button>

            <button
              type="button"
              onClick={handleExportAppointments}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-navy-950 rounded-2xl text-xs font-black shadow-xl hover:shadow-2xl transition-all cursor-pointer active:scale-95 shrink-0"
              title="Export all appointments to Excel CSV file"
            >
              <Download className="w-4 h-4 text-brandOrange-500" />
              <span>Export to Excel (CSV)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Card 1 */}
        <div className="bg-white/95 backdrop-blur-sm p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider leading-tight">
              Total Bookings
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-100 flex items-center justify-center text-navy-900 shrink-0">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-lg sm:text-2xl font-black text-navy-950 leading-none">{totalCount}</span>
            <span className="text-[10px] sm:text-xs text-slate-400 font-semibold">Patients</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white/95 backdrop-blur-sm p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider leading-tight">
              Confirmed
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <CalendarCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-lg sm:text-2xl font-black text-emerald-600 leading-none">{confirmedCount}</span>
            <span className="text-[10px] sm:text-xs text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              Scheduled
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white/95 backdrop-blur-sm p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider leading-tight">
              Awaiting
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <CalendarClock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-lg sm:text-2xl font-black text-amber-600 leading-none">{pendingCount}</span>
            <span className="text-[10px] sm:text-xs text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              Review
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white/95 backdrop-blur-sm p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider leading-tight">
              Online Video
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
              <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-lg sm:text-2xl font-black text-sky-600 leading-none">{onlineCount}</span>
            <span className="text-[10px] sm:text-xs text-sky-700 font-bold bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
              Virtual
            </span>
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-smooth cursor-pointer ${
                selectedStatus === st
                  ? 'bg-gradient-to-r from-[#ff4e50] via-[#f97316] to-[#f9d423] text-white shadow-md'
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedMode === mode
                  ? 'bg-brandOrange-50 text-brandOrange-600 border border-brandOrange-200 font-black'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {mode === 'All' ? 'All Modes' : mode === 'Clinic' ? 'In-Clinic' : 'Online Call'}
            </button>
          ))}
        </div>

        {/* Export Action */}
        <button
          onClick={handleExportAppointments}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-all shadow-xs cursor-pointer ml-auto md:ml-0"
          title="Export appointments to Excel / CSV"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
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
                      {apt.concern || 'General Consultation'}
                    </span>
                  </div>

                  {apt.notes && (
                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-start gap-2 text-slate-600 text-[11px] italic bg-white/60 p-2.5 rounded-xl">
                      <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <p className="line-clamp-2">"{apt.notes}"</p>
                    </div>
                  )}

                  {apt.attachment && (
                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between bg-orange-50/70 p-2.5 rounded-xl border border-orange-200/60">
                      <div className="flex items-center gap-2 min-w-0">
                        <Paperclip className="w-3.5 h-3.5 text-brandOrange-600 shrink-0" />
                        <span className="text-[11px] font-bold text-slate-800 truncate">
                          {apt.attachmentName || 'Patient Medical Report'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setViewAttachment({
                          url: apt.attachment,
                          name: apt.attachmentName || 'Medical Report',
                          patient: apt.patient?.name
                        })}
                        className="px-2 py-1 bg-white hover:bg-orange-100 text-brandOrange-600 font-bold text-[10px] rounded-lg border border-orange-200/80 flex items-center gap-1 transition-colors shrink-0 cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Card Actions Footer */}
              <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setRescheduleModalApt(apt);
                      setRescheduleDate(apt.date || '');
                      setRescheduleTime(apt.time || '11:00 AM');
                    }}
                    className="px-3 py-1.5 font-bold text-brandOrange-600 hover:text-brandOrange-700 hover:bg-brandOrange-50 rounded-xl transition-all"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => sendAppointmentWhatsApp(apt)}
                    className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl transition-all border border-emerald-200/80 flex items-center gap-1"
                    title="Send WhatsApp Confirmation"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-[10px] hidden sm:inline">WhatsApp</span>
                  </button>
                  <button
                    onClick={() => setRxModalApt(apt)}
                    className="p-1.5 bg-orange-50 hover:bg-orange-100 text-brandOrange-700 font-bold rounded-xl transition-all border border-orange-200/80 flex items-center gap-1 cursor-pointer"
                    title="Write Digital Prescription (Rx)"
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-brandOrange-600" />
                    <span className="text-[10px] hidden sm:inline font-black">Write Rx</span>
                  </button>

                  {apt.consultationMode === 'Online' && (
                    <a
                      href={`https://wa.me/${(apt.patient?.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${apt.patient?.name || 'Patient'}, Dr. Bharathi is ready for your scheduled homeopathic video consultation on ${apt.date} at ${apt.time}. Please connect here on WhatsApp Video Call.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-xl transition-all border border-sky-200/80 flex items-center gap-1 cursor-pointer"
                      title="Launch WhatsApp Video Call Consultation"
                    >
                      <Video className="w-3.5 h-3.5 text-sky-600" />
                      <span className="text-[10px] hidden sm:inline font-black">Video Call</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {apt.status === 'Pending' && (
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'Confirmed')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Confirm
                    </button>
                  )}
                  {apt.status === 'Confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'Completed')}
                      className="px-3.5 py-1.5 bg-navy-950 hover:bg-navy-900 text-white font-bold rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark Done
                    </button>
                  )}
                  {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'Cancelled')}
                      className="px-2.5 py-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 font-bold rounded-xl transition-all text-[11px] cursor-pointer"
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
          <div className="bg-white rounded-[2rem] p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-heading font-black text-navy-950 text-base">Reschedule Appointment</h3>
                <p className="text-xs text-slate-500">Patient: {rescheduleModalApt.patient?.name}</p>
              </div>
              <button 
                onClick={() => setRescheduleModalApt(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReschedule} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">New Consultation Date</label>
                <input 
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brandOrange-500 font-bold text-navy-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Time Slot</label>
                <select
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brandOrange-500 font-bold text-navy-900"
                >
                  {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduleModalApt(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brandOrange-500 hover:bg-brandOrange-600 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Confirm New Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attachment Preview Modal Lightbox */}
      {viewAttachment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] p-6 max-w-2xl w-full max-h-[90vh] flex flex-col space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-brandOrange-500" />
                <div>
                  <h3 className="font-heading font-black text-navy-950 text-base">{viewAttachment.name}</h3>
                  <p className="text-xs text-slate-500">Patient: {viewAttachment.patient}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href={viewAttachment.url} 
                  download={viewAttachment.name}
                  className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-brandOrange-600 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
                <button 
                  onClick={() => setViewAttachment(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center bg-slate-50 rounded-2xl p-4 border border-slate-100 min-h-[300px]">
              {viewAttachment.url.startsWith('data:image') ? (
                <img 
                  src={viewAttachment.url} 
                  alt="Medical Attachment" 
                  className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-md"
                />
              ) : (
                <div className="text-center p-8 space-y-3">
                  <FileText className="w-16 h-16 text-brandOrange-500 mx-auto" />
                  <p className="font-bold text-navy-950 text-sm">{viewAttachment.name}</p>
                  <a 
                    href={viewAttachment.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brandOrange-500 text-white font-bold text-xs shadow-md"
                  >
                    Open Document <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Prescription Composer Modal */}
      <PrescriptionComposerModal
        appointment={rxModalApt}
        isOpen={!!rxModalApt}
        onClose={() => setRxModalApt(null)}
      />

    </div>
  );
};

export default AdminAppointments;
