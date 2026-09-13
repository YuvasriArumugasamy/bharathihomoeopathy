import React, { useState } from 'react';
import { X, Plus, Trash2, Send, Check, Stethoscope, AlertCircle, Sparkles } from 'lucide-react';
import { prescriptionService } from '../../services/prescriptionService';
import { useToast } from '../../context/ToastContext';

export const PrescriptionComposerModal = ({ appointment, isOpen, onClose, onPrescriptionSaved }) => {
  const { showToast } = useToast();

  const [diagnosis, setDiagnosis] = useState(appointment?.concern || 'Homeopathic Constitutional Care');
  const [remedies, setRemedies] = useState([
    { name: '', dosage: '4 pills twice daily after meals', duration: '15 Days' }
  ]);
  const [dietRestrictions, setDietRestrictions] = useState('Avoid raw garlic, raw onion, camphor, and strong coffee 30 minutes before doses.');
  const [followUpDate, setFollowUpDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState('');

  if (!isOpen || !appointment) return null;

  const handleAddRemedy = () => {
    setRemedies([...remedies, { name: '', dosage: '4 pills twice daily', duration: '15 Days' }]);
  };

  const handleRemoveRemedy = (index) => {
    if (remedies.length === 1) return;
    setRemedies(remedies.filter((_, idx) => idx !== index));
  };

  const handleRemedyChange = (index, field, value) => {
    const updated = [...remedies];
    updated[index][field] = value;
    setRemedies(updated);
  };

  const handleSavePrescription = (sendWhatsApp = false) => {
    const validRemedies = remedies.filter(r => r.name.trim().length > 0);
    if (validRemedies.length === 0) {
      showToast('Please specify at least one homeopathic remedy', 'warning');
      return;
    }

    const rx = prescriptionService.createPrescription({
      appointmentId: appointment.appointmentId || appointment.id,
      patientName: appointment.patient?.name || 'Patient',
      patientPhone: appointment.patient?.phone || '',
      patientEmail: appointment.patient?.email || '',
      patientAge: appointment.patient?.age || 'Adult',
      patientGender: appointment.patient?.gender || 'Not specified',
      diagnosis,
      remedies: validRemedies,
      dietRestrictions,
      followUpDate,
      notes
    });

    showToast(`Prescription ${rx.prescriptionId} generated successfully!`, 'success');
    if (onPrescriptionSaved) onPrescriptionSaved(rx);

    if (sendWhatsApp) {
      const waUrl = prescriptionService.formatWhatsAppRx(rx);
      window.open(waUrl, '_blank');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-[#0b344d] via-[#124d70] to-[#0b344d] text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brandOrange-500 to-amber-400 text-white flex items-center justify-center font-black text-xl shadow-md">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-base sm:text-lg">Digital Rx (Prescription) Pad</h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase">
                  Dr. Bharathi Care
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Patient: <strong className="text-white">{appointment.patient?.name}</strong> • Slot: {appointment.appointmentId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* Clinical Diagnosis / Concern */}
          <div>
            <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1.5">
              Diagnosis / Clinical Focus <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Chronic Eczema / Osteoarthritis / Allergic Rhinitis"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brandOrange-500 font-bold text-slate-900"
            />
          </div>

          {/* Homeopathic Remedies List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider">
                Homeopathic Remedies & Dosages <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAddRemedy}
                className="px-2.5 py-1 bg-orange-50 hover:bg-orange-100 text-brandOrange-700 font-extrabold text-[11px] rounded-lg border border-orange-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Remedy</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {remedies.map((remedy, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 relative group">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brandOrange-100 text-brandOrange-700 font-black text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="Remedy name & potency (e.g. Arnica Montana 200CH / Nux Vomica 30C)"
                      value={remedy.name}
                      onChange={(e) => handleRemedyChange(idx, 'name', e.target.value)}
                      className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-brandOrange-500"
                    />
                    {remedies.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRemedy(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Remove Remedy"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7">
                    <input
                      type="text"
                      placeholder="Dosage (e.g. 4 pills twice daily)"
                      value={remedy.dosage}
                      onChange={(e) => handleRemedyChange(idx, 'dosage', e.target.value)}
                      className="p-2 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 focus:outline-none focus:border-brandOrange-500"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g. 15 Days)"
                      value={remedy.duration}
                      onChange={(e) => handleRemedyChange(idx, 'duration', e.target.value)}
                      className="p-2 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 focus:outline-none focus:border-brandOrange-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dietary Advice / Restrictions */}
          <div>
            <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1.5">
              Dietary Precaution & Advice
            </label>
            <textarea
              rows={2}
              value={dietRestrictions}
              onChange={(e) => setDietRestrictions(e.target.value)}
              placeholder="e.g. Avoid coffee, raw garlic, and strong mint 30 mins before remedies."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brandOrange-500 text-xs font-semibold text-slate-800"
            />
          </div>

          {/* Follow-up Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1.5">
                Next Review / Follow-Up Date
              </label>
              <input
                type="date"
                value={followUpDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brandOrange-500 font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-900 uppercase tracking-wider mb-1.5">
                Doctor Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Drink 3 liters of warm water daily."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brandOrange-500 font-semibold text-slate-800"
              />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSavePrescription(false)}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-navy-950 font-black text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              Save Rx Only
            </button>
            <button
              type="button"
              onClick={() => handleSavePrescription(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Save & WhatsApp Rx</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrescriptionComposerModal;
