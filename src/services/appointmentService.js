import { api } from '../utils/api';
import { customerService } from './customerService';
import { cloudSyncService } from './cloudSyncService';

const APPOINTMENTS_STORAGE_KEY = 'admin_appointments_store';

const initialDemoAppointments = [
  {
    id: 'apt-001',
    appointmentId: 'APT-2026-801',
    patient: {
      name: 'P. Anandhan',
      phone: '+91 98421 77654',
      email: 'anandhan.p@gmail.com',
      age: 42,
      gender: 'Male'
    },
    concern: 'Joint, Muscle & Chronic Pain',
    doctor: 'Dr. Bharathi (Homeopathic Doctor)',
    consultationMode: 'In-Clinic',
    date: new Date().toISOString().slice(0, 10),
    time: '10:00 AM',
    status: 'Confirmed',
    notes: 'Severe knee pain and stiffness during morning hours.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'apt-002',
    appointmentId: 'APT-2026-802',
    patient: {
      name: 'R. Soundarya',
      phone: '+91 97899 44321',
      email: 'soundarya.r@outlook.com',
      age: 29,
      gender: 'Female'
    },
    concern: 'Skin & Allergy Care',
    doctor: 'Dr. Bharathi (Homeopathic Doctor)',
    consultationMode: 'Online',
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    time: '05:00 PM',
    status: 'Pending',
    notes: 'Seasonal eczema on hands, prefers video consultation.',
    createdAt: new Date().toISOString()
  }
];

export const getStoredAppointments = () => {
  try {
    const raw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn("Could not read appointments from storage:", err.message);
  }
  try {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(initialDemoAppointments));
  } catch {
    // Ignore quota error
  }
  return initialDemoAppointments;
};

export const saveStoredAppointments = (appointments) => {
  try {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
  } catch (err) {
    console.warn("Could not save appointments to storage:", err.message);
  }
};

export const appointmentService = {
  bookAppointment: async (formData) => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const appointmentId = `APT-${dateStr}-${randomNum}`;

    const newAppointment = {
      id: 'apt-' + Date.now(),
      appointmentId,
      patient: {
        name: formData.fullName || 'Patient',
        phone: formData.phone || '',
        email: formData.email || '',
        age: formData.age || 'Adult',
        gender: formData.gender || 'Not specified'
      },
      concern: formData.concern || 'General Consultation',
      doctor: formData.doctor || 'Dr. Bharathi (Homeopathic Doctor)',
      consultationMode: formData.consultationType?.includes('Video') ? 'Online' : 'In-Clinic',
      date: formData.date || new Date().toISOString().slice(0, 10),
      time: formData.time || '10:00 AM',
      status: 'Pending',
      notes: formData.description || '',
      attachment: formData.attachment || '',
      attachmentName: formData.attachmentName || '',
      createdAt: new Date().toISOString()
    };

    const current = getStoredAppointments();
    saveStoredAppointments([newAppointment, ...current]);

    // Push appointment in real-time to Cloud Firestore
    try {
      cloudSyncService.syncAppointmentToCloud(newAppointment);
    } catch (cErr) {
      console.warn("Cloud appointment sync error:", cErr.message);
    }

    try {
      customerService.syncCustomer({
        name: newAppointment.patient.name,
        email: newAppointment.patient.email,
        phone: newAppointment.patient.phone,
        city: 'Tamil Nadu'
      });
    } catch (cErr) {
      console.warn("Could not sync customer on appointment:", cErr);
    }

    try {
      await api.post('/appointments', newAppointment);
    } catch {
      // Backend offline, saved locally
    }

    return { success: true, data: newAppointment };
  },

  getAdminAppointments: async () => {
    try {
      const res = await api.get('/appointments');
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        saveStoredAppointments(res.data);
        return res.data;
      }
    } catch {
      // Fallback
    }
    return getStoredAppointments();
  },

  updateAppointmentStatus: async (id, newStatus) => {
    const appointments = getStoredAppointments().map(a => 
      (a.id === id || a.appointmentId === id) ? { ...a, status: newStatus } : a
    );
    saveStoredAppointments(appointments);

    try {
      await api.patch(`/appointments/${id}/status`, { status: newStatus });
    } catch {
      // Fallback
    }

    return { success: true, status: newStatus };
  },

  rescheduleAppointment: async (id, date, time) => {
    const appointments = getStoredAppointments().map(a => 
      (a.id === id || a.appointmentId === id) ? { ...a, date, time, status: 'Confirmed' } : a
    );
    saveStoredAppointments(appointments);

    try {
      await api.patch(`/appointments/${id}/reschedule`, { date, time });
    } catch {
      // Fallback
    }

    return { success: true, date, time };
  }
};

export default appointmentService;
