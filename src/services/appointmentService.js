import { api } from '../utils/api';
import { customerService } from './customerService';
import { cloudSyncService } from './cloudSyncService';

const APPOINTMENTS_STORAGE_KEY = 'admin_appointments_store';

const initialDemoAppointments = [];

export const getStoredAppointments = () => {
  try {
    const raw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(a => 
          !['apt-001', 'apt-002'].includes(a.id) &&
          !['APT-2026-801', 'APT-2026-802'].includes(a.appointmentId)
        );
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(cleaned));
        }
        return cleaned;
      }
    }
  } catch (err) {
    console.warn("Could not read appointments from storage:", err.message);
  }
  return [];
};

export const saveStoredAppointments = (appointments) => {
  try {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('appointments_updated'));
    }
  } catch (err) {
    console.warn("Could not save appointments to storage:", err.message);
  }
};

/**
 * Filter appointments strictly for the logged-in patient
 * Isolates real-time patient appointments
 */
export const getUserAppointments = (user) => {
  const all = getStoredAppointments();
  if (!user) {
    const lastEmail = typeof localStorage !== 'undefined' ? localStorage.getItem('last_checkout_email') : null;
    if (lastEmail) {
      return all.filter(a => {
        const aEmail = (a.userEmail || a.patient?.email || '').trim().toLowerCase();
        return aEmail === lastEmail.trim().toLowerCase();
      });
    }
    return [];
  }

  const userEmail = (user.email || '').trim().toLowerCase();
  const userPhone = (user.phone || '').replace(/\D/g, '');
  const userId = user._id || user.id || '';

  return all.filter(apt => {
    if (userId && apt.userId && String(apt.userId) === String(userId)) return true;
    const aEmail = (apt.userEmail || apt.patient?.email || '').trim().toLowerCase();
    if (userEmail && aEmail && aEmail === userEmail) return true;
    const aPhone = (apt.patient?.phone || '').replace(/\D/g, '');
    if (userPhone && aPhone && (aPhone.endsWith(userPhone) || userPhone.endsWith(aPhone))) return true;
    return false;
  });
};

export const appointmentService = {
  bookAppointment: async (formData) => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const appointmentId = `APT-${dateStr}-${randomNum}`;

    const newAppointment = {
      id: 'apt-' + Date.now(),
      appointmentId,
      userId: formData.userId || null,
      userEmail: formData.email || formData.userEmail || '',
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
      await api.patch(`/appointments/${id}/status`, { status: 'Confirmed' });
    } catch {
      // Fallback
    }

    return { success: true, date, time };
  },

  getMyPatientAppointments: async (user) => {
    try {
      const email = user?.email || (typeof localStorage !== 'undefined' ? localStorage.getItem('last_checkout_email') : '');
      const res = await api.get(`/appointments/my${email ? `?email=${encodeURIComponent(email)}` : ''}`);
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Fallback to local
    }
    return getUserAppointments(user);
  }
};

export default appointmentService;
