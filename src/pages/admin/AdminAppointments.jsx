import React, { useState } from 'react';
import { Calendar, Clock, Video, Building2, Check, X, Search, Filter, Plus } from 'lucide-react';
import { initialAdminAppointments } from '../../data/adminAppointmentsData';
import { useToast } from '../../context/ToastContext';

export const AdminAppointments = () => {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState(initialAdminAppointments);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [rescheduleModalApt, setRescheduleModalApt] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('11:00 AM');

  const filtered = appointments.filter(a => selectedStatus === 'All' || a.status === selectedStatus);

  const handleUpdateStatus = (id, newStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    showToast(`Appointment marked as ${newStatus}`, 'success');
  };

  const handleConfirmReschedule = (e) => {
    e.preventDefault();
    if (!rescheduleDate) return;
    setAppointments(prev => prev.map(a => a.id === rescheduleModalApt.id ? { ...a, date: rescheduleDate, time: rescheduleTime, status: 'Confirmed' } : a));
    setRescheduleModalApt(null);
    showToast('Appointment rescheduled and patient notified!', 'success');
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brandOrange-600">Clinical Consultations</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">Appointments Desk</h1>
          <p className="text-xs text-slate-500">Manage Dr. Bharathi’s daily clinic consultations and online video calls.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-smooth ${
                selectedStatus === st ? 'bg-navy-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((apt) => (
          <div key={apt.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 hover:shadow-premium transition-smooth flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-[10px] text-slate-400 font-bold block">{apt.appointmentId}</span>
                  <h4 className="font-bold text-sm text-navy-900">{apt.patient.name}</h4>
                  <p className="text-xs text-slate-500">{apt.patient.phone}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  apt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700' :
                  apt.status === 'Completed' ? 'bg-indigo-50 text-indigo-700' :
                  apt.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  {apt.status}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-brandOrange-500" />
                  <span className="font-semibold">{apt.date} at {apt.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  {apt.consultationMode === 'Online' ? (
                    <Video className="w-3.5 h-3.5 text-sky-500" />
                  ) : (
                    <Building2 className="w-3.5 h-3.5 text-purple-500" />
                  )}
                  <span>{apt.appointmentType}</span>
                </div>
                {apt.patientNote && (
                  <p className="text-[11px] text-slate-500 italic pt-1">"{apt.patientNote}"</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => setRescheduleModalApt(apt)}
                className="text-brandOrange-600 hover:underline font-bold"
              >
                Reschedule
              </button>

              <div className="flex items-center gap-2">
                {apt.status === 'Pending' && (
                  <button
                    onClick={() => handleUpdateStatus(apt.id, 'Confirmed')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                  >
                    Confirm
                  </button>
                )}
                {apt.status === 'Confirmed' && (
                  <button
                    onClick={() => handleUpdateStatus(apt.id, 'Completed')}
                    className="px-3 py-1 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-lg"
                  >
                    Mark Done
                  </button>
                )}
                {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                  <button
                    onClick={() => handleUpdateStatus(apt.id, 'Cancelled')}
                    className="px-2 py-1 text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Reschedule Modal */}
      {rescheduleModalApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-navy-900 text-sm">Reschedule Appointment</h3>
            <p className="text-xs text-slate-500">Patient: <strong>{rescheduleModalApt.patient.name}</strong></p>

            <form onSubmit={handleConfirmReschedule} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Time Slot</label>
                <select
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-xl"
                >
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="04:30 PM">04:30 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleModalApt(null)}
                  className="flex-1 py-2 bg-slate-100 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-brandOrange-500 text-white font-bold rounded-xl"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
