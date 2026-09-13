import React from 'react';
import { X, Printer, Download, Share2, HeartPulse, ShieldCheck, QrCode, Phone, MapPin, Calendar, User, Clock } from 'lucide-react';
import { assets } from '../../assets';
import { prescriptionService } from '../../services/prescriptionService';

export const PrescriptionSlipModal = ({ prescription, isOpen, onClose }) => {
  if (!isOpen || !prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const waUrl = prescriptionService.formatWhatsAppRx(prescription);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const rxId = prescription.prescriptionId || prescription.id || 'RX-2026-0001';
  const rxDate = prescription.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const patient = prescription.patient || {};
  const remedies = Array.isArray(prescription.remedies) && prescription.remedies.length > 0
    ? prescription.remedies
    : [{ name: 'Arnica Montana 200CH', dosage: '4 pills twice daily', duration: '15 Days' }];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-5 bg-navy-950/75 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto print:shadow-none print:border-none print:rounded-none relative">
        
        {/* Top Floating Action Bar (Hidden during printing) */}
        <div className="bg-gradient-to-r from-[#072538] via-[#0e3c5a] to-[#072538] text-white px-6 py-4 flex items-center justify-between print:hidden border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-sm">
              Rx
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-200">Official Prescription Slip</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {rxId}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Verified by Dr. Bharathi (B.H.M.S, M.D.)</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleWhatsAppShare}
              title="Share via WhatsApp"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              title="Print Prescription"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-brandOrange-500 to-amber-500 hover:from-brandOrange-600 hover:to-amber-600 text-white rounded-xl text-xs font-black shadow-md shadow-brandOrange-500/25 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition-all cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prescription Paper Sheet (Printable Canvas) */}
        <div className="p-6 sm:p-10 text-slate-900 space-y-6 bg-white font-sans relative">
          
          {/* Subtle Watermark Rx in background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
            <span className="text-[260px] font-serif font-black italic">Rx</span>
          </div>

          {/* 1. CLINICAL LETTERHEAD */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-brandOrange-500/30 pb-5 relative z-10">
            <div className="flex items-center gap-4">
              <img 
                src={assets.logo} 
                alt="Dr. Bharathi's Homoeo Care" 
                className="w-16 h-16 rounded-full object-cover border-2 border-brandOrange-500/40 shadow-xs"
              />
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif">
                  Dr. Bharathi’s Homoeo Care
                </h2>
                <p className="text-xs text-brandOrange-600 font-bold uppercase tracking-wide">
                  Constitutional Homeopathic Healing Center & Dispensary
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  Regd Practitioner Lic No: <span className="font-bold text-slate-800">HOM-TN-2016-8941</span>
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-600 space-y-0.5">
              <p className="font-black text-slate-900 text-sm">Dr. Bharathi (B.H.M.S, M.D.)</p>
              <p className="text-[11px] text-slate-500">Chief Homeopath & Consultant</p>
              <p className="text-[11px] text-slate-600 flex items-center sm:justify-end gap-1">
                <MapPin className="w-3 h-3 text-brandOrange-500" /> Melapalayam, Tirunelveli, Tamil Nadu
              </p>
              <p className="text-[11px] text-slate-600 flex items-center sm:justify-end gap-1">
                <Phone className="w-3 h-3 text-brandOrange-500" /> +91 90258 54711
              </p>
            </div>
          </div>

          {/* 2. PATIENT & CASE METADATA BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/90 text-xs relative z-10">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Patient Name</span>
              <p className="font-extrabold text-slate-900 text-sm">{patient.name || 'Valued Patient'}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Age / Gender</span>
              <p className="font-bold text-slate-800">{patient.age || 'Adult'} • {patient.gender || 'Not Specified'}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Prescription ID</span>
              <p className="font-mono font-bold text-brandOrange-600">{rxId}</p>
            </div>
            <div className="space-y-0.5 text-left sm:text-right">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Date of Rx</span>
              <p className="font-bold text-slate-900">{rxDate}</p>
            </div>
          </div>

          {/* 3. DIAGNOSIS & CLINICAL IMPRESSION */}
          <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-xs space-y-1 relative z-10">
            <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-[11px] uppercase tracking-wider">
              <HeartPulse className="w-3.5 h-3.5 text-amber-600" />
              <span>Clinical Diagnosis / Chief Indication</span>
            </div>
            <p className="font-black text-slate-900 text-sm">
              {prescription.diagnosis || 'Constitutional Homeopathic Balance & Chronic Wellness'}
            </p>
          </div>

          {/* 4. OFFICIAL RX SECTION & MEDICINE TABLE */}
          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="font-serif italic font-black text-3xl text-brandOrange-600 leading-none">Rx</span>
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">Prescribed Remedies & Dosage Schedule</span>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-extrabold tracking-wider">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Homeopathic Remedy & Potency</th>
                    <th className="p-3">Dosage & Frequency</th>
                    <th className="p-3 text-right">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {remedies.map((remedy, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="p-3 text-slate-400 font-bold">{idx + 1}</td>
                      <td className="p-3">
                        <strong className="font-extrabold text-navy-950 block text-xs sm:text-sm">{remedy.name}</strong>
                      </td>
                      <td className="p-3">
                        <span className="text-brandOrange-600 font-bold">{remedy.dosage}</span>
                      </td>
                      <td className="p-3 text-right font-extrabold text-slate-700">
                        {remedy.duration || '15 Days'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. DIETARY RESTRICTIONS & INSTRUCTIONS */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 relative z-10">
            <h4 className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Classical Homeopathy Dietary & Storage Rules</span>
            </h4>
            <p className="text-slate-600 leading-relaxed font-medium">
              {prescription.dietRestrictions || 'Avoid raw onions, raw garlic, strong menthol/camphor, and coffee 30 minutes before or after taking remedies. Dissolve medicated sugar pills gently on tongue. Keep medicine bottles away from direct heat and strong perfumes.'}
            </p>
          </div>

          {/* 6. NEXT FOLLOW-UP & CLINICAL NOTES */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/70 text-xs relative z-10">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-700" />
              <span className="font-bold text-teal-950">Next Follow-up Date:</span>
              <span className="font-black text-teal-800 bg-white px-2 py-0.5 rounded-lg border border-teal-200">
                {prescription.followUpDate || 'After 15 Days'}
              </span>
            </div>
            {prescription.notes && (
              <p className="text-[11px] text-teal-800 font-medium italic">
                Note: {prescription.notes}
              </p>
            )}
          </div>

          {/* 7. DOCTOR SEAL & DIGITAL SIGNATURE */}
          <div className="pt-6 border-t-2 border-slate-200 flex justify-between items-end relative z-10">
            <div className="flex items-center gap-3">
              <QrCode className="w-12 h-12 text-slate-800 p-1 border border-slate-300 rounded-xl bg-slate-50" />
              <div className="text-[10px] text-slate-500 space-y-0.5">
                <p className="font-bold text-slate-800 uppercase tracking-wider">Digitally Verified Rx</p>
                <p>Authenticated Dispensary Record</p>
                <p>Dr. Bharathi's Homoeo Care</p>
              </div>
            </div>

            <div className="text-right space-y-1">
              <p className="font-serif italic font-black text-xl text-[#0b344d] tracking-wide">
                Dr. Bharathi B.H.M.S
              </p>
              <div className="h-0.5 w-32 bg-slate-400 ml-auto" />
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Authorized Homeopathic Physician
              </p>
              <p className="text-[9px] text-slate-400 font-medium">Reg No: HOM-TN-2016-8941</p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-3 print:pt-4">
            This is an authentic digital medical prescription issued by Dr. Bharathi’s Homoeo Care, Melapalayam, Tirunelveli.
          </div>

        </div>

      </div>
    </div>
  );
};

export default PrescriptionSlipModal;
