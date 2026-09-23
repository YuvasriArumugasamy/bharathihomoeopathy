/**
 * Admin Notification Service
 * Centralizes real-time dispensary, consultation, and enquiry notifications.
 * Ensures:
 * 1. Demo/mock items are automatically pruned from storage.
 * 2. Only genuine pending actions are counted.
 * 3. Once viewed/seen by admin, the bell badge is cleared permanently.
 * 4. Only newly arrived actions will increment the bell badge.
 */

import { getStoredOrders } from './orderService';
import { getStoredAppointments } from './appointmentService';
import { getStoredEnquiries } from './enquiryService';
import { getStoredProducts } from '../utils/productStorage';

const DISMISSED_KEY = 'admin_dismissed_notifications';
const SEEN_KEY = 'admin_seen_notifications';
const LAST_SEEN_TIME_KEY = 'admin_notifications_last_seen_time';

/**
 * Sanitize localStorage stores to permanently remove any leftover mock/demo records
 */
export const sanitizeStores = () => {
  try {
    // 1. Clean Orders
    const rawOrders = localStorage.getItem('admin_orders_store');
    if (rawOrders) {
      const parsed = JSON.parse(rawOrders);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(o => 
          o && typeof o === 'object' &&
          !['ord-1001', 'ord-1002', 'ord-1003'].includes(o.id) &&
          !['894123', '894256', '894389'].includes(o.orderId) &&
          !['894123', '894256', '894389'].includes(o.orderNumber)
        );
        if (cleaned.length !== parsed.length) {
          localStorage.setItem('admin_orders_store', JSON.stringify(cleaned));
        }
      }
    }

    // 2. Clean Appointments
    const rawApts = localStorage.getItem('admin_appointments_store');
    if (rawApts) {
      const parsed = JSON.parse(rawApts);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(a => 
          a && typeof a === 'object' &&
          !['apt-001', 'apt-002'].includes(a.id) &&
          !['APT-2026-801', 'APT-2026-802'].includes(a.appointmentId)
        );
        if (cleaned.length !== parsed.length) {
          localStorage.setItem('admin_appointments_store', JSON.stringify(cleaned));
        }
      }
    }

    // 3. Clean Enquiries
    const rawEnqs = localStorage.getItem('admin_enquiries_store');
    if (rawEnqs) {
      const parsed = JSON.parse(rawEnqs);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(e => e && !e.enquiryId?.startsWith('ENQ-DEMO'));
        if (cleaned.length !== parsed.length) {
          localStorage.setItem('admin_enquiries_store', JSON.stringify(cleaned));
        }
      }
    }
  } catch (e) {
    console.warn('Error during store sanitization:', e);
  }
};

export const getDismissedIds = () => {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const getSeenIds = () => {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Returns all active, real, non-dismissed admin notifications
 */
export const getAdminNotifications = () => {
  sanitizeStores();
  const dismissedIds = getDismissedIds();
  const list = [];

  // 1. Pending Dispensary Orders
  try {
    const orders = typeof getStoredOrders === 'function' ? getStoredOrders() : [];
    if (Array.isArray(orders)) {
      orders
        .filter(o => o && (o.orderStatus === 'Pending' || o.status === 'Pending'))
        .forEach(o => {
          const notifId = `notif-ord-${o.id || o.orderId || o.orderNumber}`;
          if (dismissedIds.includes(notifId)) return;
          
          list.push({
            id: notifId,
            rawId: o.id || o.orderId,
            type: 'Order',
            title: `New Order: #${o.orderId || o.orderNumber || 'Pending'}`,
            description: `Patient ${o.customer?.name || o.shippingAddress?.fullName || 'Customer'} placed order of ₹${Number(o.total || 0).toLocaleString('en-IN')}`,
            link: '/admin/orders',
            time: 'Needs Dispatch',
            priority: 'High',
            createdAt: o.createdAt ? new Date(o.createdAt).getTime() : 0
          });
        });
    }
  } catch (e) {
    console.warn('Could not read orders for notifications:', e);
  }

  // 2. Pending Patient Consultations
  try {
    const apts = typeof getStoredAppointments === 'function' ? getStoredAppointments() : [];
    if (Array.isArray(apts)) {
      apts
        .filter(a => a && a.status === 'Pending')
        .forEach(a => {
          const notifId = `notif-apt-${a.id || a.appointmentId}`;
          if (dismissedIds.includes(notifId)) return;

          list.push({
            id: notifId,
            rawId: a.id || a.appointmentId,
            type: 'Appointment',
            title: `Consultation: ${a.patient?.name || a.patientName || 'Patient'}`,
            description: `${a.concern || 'Consultation'} on ${a.date || 'Soon'} at ${a.time || 'Scheduled'} (${a.consultationMode || 'In-Clinic'})`,
            link: '/admin/appointments',
            time: 'Awaiting Confirmation',
            priority: 'High',
            createdAt: a.createdAt ? new Date(a.createdAt).getTime() : 0
          });
        });
    }
  } catch (e) {
    console.warn('Could not read appointments for notifications:', e);
  }

  // 3. New Patient Enquiries
  try {
    const enqs = typeof getStoredEnquiries === 'function' ? getStoredEnquiries() : [];
    if (Array.isArray(enqs)) {
      enqs
        .filter(e => e && (e.status === 'New' || e.isRead === false))
        .forEach(e => {
          const notifId = `notif-enq-${e.id || e.enquiryId}`;
          if (dismissedIds.includes(notifId)) return;

          list.push({
            id: notifId,
            rawId: e.id || e.enquiryId,
            type: 'Enquiry',
            title: `New Enquiry: ${e.customer?.name || e.name || 'Patient'}`,
            description: e.subject || e.message || 'Patient sent a consultation message.',
            link: '/admin/enquiries',
            time: 'Pending Reply',
            priority: 'Medium',
            createdAt: e.createdAt ? new Date(e.createdAt).getTime() : 0
          });
        });
    }
  } catch (e) {
    console.warn('Could not read enquiries for notifications:', e);
  }

  // 4. Low stock products (warning alerts)
  try {
    const prods = typeof getStoredProducts === 'function' ? getStoredProducts() : [];
    if (Array.isArray(prods)) {
      prods
        .filter(p => p && (Number(p.stock) || 0) <= (Number(p.lowStockThreshold) || 5))
        .slice(0, 3)
        .forEach(p => {
          const notifId = `notif-stock-${p.id || p._id}`;
          if (dismissedIds.includes(notifId)) return;

          list.push({
            id: notifId,
            rawId: p.id || p._id,
            type: 'Inventory',
            title: `Low Stock: ${p.name || 'Remedy'}`,
            description: `Only ${p.stock || 0} units left in dispensary`,
            link: '/admin/inventory',
            time: 'Action Required',
            priority: 'Warning',
            createdAt: 0
          });
        });
    }
  } catch (e) {
    console.warn('Could not read products for notifications:', e);
  }

  return list;
};

/**
 * Returns breakdown of pending counts by domain
 */
export const getCategoryCounts = () => {
  const notifs = getAdminNotifications();
  const orders = notifs.filter(n => n.type === 'Order').length;
  const appointments = notifs.filter(n => n.type === 'Appointment').length;
  const enquiries = notifs.filter(n => n.type === 'Enquiry').length;
  const inventory = notifs.filter(n => n.type === 'Inventory').length;

  return {
    orders,
    appointments,
    enquiries,
    inventory,
    totalPending: orders + appointments + enquiries + inventory
  };
};

/**
 * Returns the unread notification badge count.
 * A notification is considered unread only if it exists in current active notifications
 * AND its ID has not been added to admin_seen_notifications.
 */
export const getUnreadNotificationCount = () => {
  const notifs = getAdminNotifications();
  if (notifs.length === 0) return 0;

  const seenIds = getSeenIds();
  const unreadNotifs = notifs.filter(n => !seenIds.includes(n.id));
  return unreadNotifs.length;
};

/**
 * Mark all current notifications as seen.
 * This clears the bell badge count permanently until a genuine new item is added.
 */
export const markAllNotificationsAsSeen = () => {
  const notifs = getAdminNotifications();
  const currentSeen = getSeenIds();
  const allIds = Array.from(new Set([...currentSeen, ...notifs.map(n => n.id)]));

  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(allIds));
    localStorage.setItem(LAST_SEEN_TIME_KEY, Date.now().toString());
  } catch (e) {
    console.warn('Could not save seen notifications:', e);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('admin_notifications_updated'));
  }
};

/**
 * Dismiss a specific notification by ID
 */
export const dismissNotification = (id) => {
  try {
    const dismissed = getDismissedIds();
    if (!dismissed.includes(id)) {
      dismissed.push(id);
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed));
    }
    const seen = getSeenIds();
    if (!seen.includes(id)) {
      seen.push(id);
      localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
    }
  } catch (e) {
    console.warn('Could not dismiss notification:', e);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('admin_notifications_updated'));
  }
};

/**
 * Clear all current active notifications
 */
export const clearAllNotifications = () => {
  const notifs = getAdminNotifications();
  try {
    const dismissed = getDismissedIds();
    notifs.forEach(n => {
      if (!dismissed.includes(n.id)) dismissed.push(n.id);
    });
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed));

    const seen = getSeenIds();
    notifs.forEach(n => {
      if (!seen.includes(n.id)) seen.push(n.id);
    });
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  } catch (e) {
    console.warn('Could not clear all notifications:', e);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('admin_notifications_updated'));
  }
};
