import { api } from '../utils/api';
import { initialAdminEnquiries } from '../data/adminReviewsData';

const ENQUIRIES_STORAGE_KEY = 'admin_enquiries_store';

export const getStoredEnquiries = () => {
  try {
    const raw = localStorage.getItem(ENQUIRIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn("Could not read enquiries from storage:", err.message);
  }
  try {
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(initialAdminEnquiries));
  } catch {
    // Ignore
  }
  return initialAdminEnquiries;
};

export const saveStoredEnquiries = (enquiries) => {
  try {
    localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(enquiries));
  } catch (err) {
    console.warn("Could not save enquiries to storage:", err.message);
  }
};

export const enquiryService = {
  submitEnquiry: async (formData) => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const newEnquiry = {
      id: 'enq-' + Date.now(),
      enquiryId: `ENQ-WEB-${randomNum}`,
      customer: {
        name: formData.name || 'Website Patient',
        email: formData.email || '',
        phone: formData.phone || ''
      },
      subject: formData.subject || 'Patient Consultation Enquiry',
      message: formData.message || '',
      type: 'General',
      priority: 'Medium',
      status: 'New',
      isRead: false,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      replies: []
    };

    const current = getStoredEnquiries();
    saveStoredEnquiries([newEnquiry, ...current]);

    try {
      await api.post('/enquiries', newEnquiry);
    } catch {
      // Offline fallback
    }

    return { success: true, data: newEnquiry };
  },

  getAdminEnquiries: async () => {
    try {
      const res = await api.get('/enquiries');
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        saveStoredEnquiries(res.data);
        return res.data;
      }
    } catch {
      // Fallback
    }
    return getStoredEnquiries();
  },

  updateEnquiryStatus: async (id, status) => {
    const list = getStoredEnquiries().map(e => (e.id === id || e._id === id || e.enquiryId === id) ? { ...e, status } : e);
    saveStoredEnquiries(list);

    try {
      await api.patch(`/enquiries/${id}/status`, { status });
    } catch {
      // Fallback
    }

    return { success: true, status };
  },

  addReply: async (enquiryId, replyMessage) => {
    const list = getStoredEnquiries().map(enq => {
      if (enq.id === enquiryId || enq._id === enquiryId || enq.enquiryId === enquiryId) {
        const newReply = {
          id: 'rep-' + Date.now(),
          sender: 'Dr. Bharathi Support Team',
          message: replyMessage,
          sentAt: new Date().toISOString(),
          createdAt: 'Just now'
        };
        return {
          ...enq,
          status: 'In Progress',
          replies: [...(enq.replies || []), newReply]
        };
      }
      return enq;
    });
    saveStoredEnquiries(list);

    try {
      await api.post(`/enquiries/${enquiryId}/reply`, {
        message: replyMessage,
        sender: 'Dr. Bharathi Support Team'
      });
    } catch {
      // Fallback
    }

    return { success: true };
  }
};

export default enquiryService;
