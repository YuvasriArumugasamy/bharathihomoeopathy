const PRESCRIPTIONS_STORAGE_KEY = 'admin_prescriptions_store';

const initialPrescriptions = [
  {
    id: 'rx-101',
    prescriptionId: 'RX-2026-8801',
    appointmentId: 'APT-2026-801',
    date: new Date().toISOString().slice(0, 10),
    doctor: 'Dr. Bharathi (B.H.M.S, M.D.)',
    doctorRegNo: 'HOM-TN-2016-8941',
    patient: {
      name: 'P. Anandhan',
      phone: '+91 98421 77654',
      email: 'anandhan.p@gmail.com',
      age: 42,
      gender: 'Male'
    },
    diagnosis: 'Joint & Muscle Stiffness (Osteo-Arthralgia)',
    remedies: [
      { name: 'Rhus Toxicodendron 200CH', dosage: '4 pills twice daily after meals', duration: '15 Days' },
      { name: 'Arnica Montana 30C Liquid Drops', dosage: '3 drops in lukewarm water before bedtime', duration: '15 Days' },
      { name: 'Calcarea Phosphorica 6X', dosage: '4 tablets chewed morning & night', duration: '30 Days' }
    ],
    dietRestrictions: 'Avoid raw garlic, raw onions, and high-caffeine drinks 30 minutes before or after doses. Drink warm water.',
    followUpDate: new Date(Date.now() + 15 * 86400000).toISOString().slice(0, 10),
    notes: 'Mild exercise and morning sunshine recommended. Review after 15 days.',
    createdAt: new Date().toISOString()
  }
];

export const getStoredPrescriptions = () => {
  try {
    const raw = localStorage.getItem(PRESCRIPTIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn("Could not read prescriptions from storage:", err.message);
  }
  try {
    localStorage.setItem(PRESCRIPTIONS_STORAGE_KEY, JSON.stringify(initialPrescriptions));
  } catch {}
  return initialPrescriptions;
};

export const saveStoredPrescriptions = (prescriptions) => {
  try {
    localStorage.setItem(PRESCRIPTIONS_STORAGE_KEY, JSON.stringify(prescriptions));
  } catch (err) {
    console.warn("Could not save prescriptions to storage:", err.message);
  }
};

export const prescriptionService = {
  getPrescriptions: () => {
    return getStoredPrescriptions();
  },

  createPrescription: (data) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const prescriptionId = `RX-${dateStr.slice(0, 4)}-${randomNum}`;

    const newRx = {
      id: 'rx-' + Date.now(),
      prescriptionId,
      appointmentId: data.appointmentId || '',
      date: new Date().toISOString().slice(0, 10),
      doctor: 'Dr. Bharathi (B.H.M.S, M.D.)',
      doctorRegNo: 'HOM-TN-2016-8941',
      patient: {
        name: data.patientName || 'Patient',
        phone: data.patientPhone || '',
        email: data.patientEmail || '',
        age: data.patientAge || 'Adult',
        gender: data.patientGender || 'Not Specified'
      },
      diagnosis: data.diagnosis || 'Homeopathic Constitutional Care',
      remedies: data.remedies && data.remedies.length > 0 ? data.remedies : [
        { name: 'Arnica Montana 200CH', dosage: '4 pills twice daily', duration: '15 Days' }
      ],
      dietRestrictions: data.dietRestrictions || 'Avoid strong mint, camphor, raw onion, and caffeine 30 mins before taking remedies.',
      followUpDate: data.followUpDate || '',
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    };

    const current = getStoredPrescriptions();
    const updated = [newRx, ...current];
    saveStoredPrescriptions(updated);
    return newRx;
  },

  formatWhatsAppRx: (rx) => {
    const phone = (rx.patient?.phone || '').replace(/\D/g, '');
    const cleanPhone = phone.startsWith('91') ? phone : (phone.length === 10 ? '91' + phone : phone);
    
    let remediesListText = '';
    rx.remedies.forEach((r, idx) => {
      remediesListText += `\n  ${idx + 1}. *${r.name}*\n     ↳ Dosage: ${r.dosage} (${r.duration})`;
    });

    const message = `🌿 *Dr. Bharathi’s Homeopathic Care - Digital Prescription (Rx)*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Patient:* ${rx.patient?.name}\n` +
      `📋 *Rx ID:* ${rx.prescriptionId}\n` +
      `📅 *Date:* ${rx.date}\n` +
      `🩺 *Diagnosis:* ${rx.diagnosis}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💊 *Prescribed Remedies:*` +
      remediesListText + `\n\n` +
      `⚠️ *Dietary Advice:* ${rx.dietRestrictions}\n` +
      (rx.followUpDate ? `🗓️ *Next Follow-up:* ${rx.followUpDate}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👨‍⚕️ *Doctor:* Dr. Bharathi (B.H.M.S, M.D.)\n` +
      `🏥 Reg No: HOM-TN-2016-8941\n` +
      `📞 Helpline: +91 98765 43210\n` +
      `_Take remedies as advised. Keep medicines away from strong sunlight & fragrances._`;

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }
};

export default prescriptionService;
