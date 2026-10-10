import { useEffect, useRef } from 'react';
import { api } from '../utils/api';
import { authStorage } from '../utils/authStorage';
import { playNotificationSound } from './useFCM';
import { useToast } from '../context/ToastContext';
import { getStoredOrders } from '../services/orderService';
import { getStoredAppointments } from '../services/appointmentService';
import { cloudSyncService } from '../services/cloudSyncService';

/**
 * useAdminLiveAlerts
 * Real-time clinical background alert listener.
 * Automatically checks for new patient orders & consultations.
 * When a new order or appointment arrives:
 * 1. Plays bell chime sound immediately.
 * 2. Fires browser Desktop Notification popup (even if minimized / on another tab).
 * 3. Shows prominent in-app Toast notification.
 */
export function useAdminLiveAlerts() {
  const { showToast } = useToast();
  const knownOrderIdsRef = useRef(new Set());
  const knownAppointmentIdsRef = useRef(new Set());
  const initialLoadDoneRef = useRef(false);

  useEffect(() => {
    const isPathAdmin = typeof window !== 'undefined' && window.location.pathname.toLowerCase().startsWith('/admin');
    if (!isPathAdmin) {
      return;
    }

    let isMounted = true;

    // Helper to process incoming orders and alert on new ones
    const processOrders = (orders) => {
      if (!Array.isArray(orders) || orders.length === 0) return;

      if (!initialLoadDoneRef.current) {
        orders.forEach(o => {
          const id = String(o._id || o.id || o.orderNumber || o.orderId);
          knownOrderIdsRef.current.add(id);
        });
        return;
      }

      for (const order of orders) {
        const id = String(order._id || order.id || order.orderNumber || order.orderId);
        if (!knownOrderIdsRef.current.has(id)) {
          knownOrderIdsRef.current.add(id);

          const customerName = order.shippingAddress?.fullName || order.guestName || order.customer?.name || 'Patient';
          const orderNum = order.orderNumber || order.orderId || id.slice(-6);
          const total = order.totalAmount || order.total || 0;

          // 1. Play sweet bell chime
          playNotificationSound();

          // 2. Show in-app Toast
          showToast(`🛍️ New Order Received! #${orderNum} from ${customerName} (₹${total})`, 'success');

          // 3. Fire Desktop OS Native Notification
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification('🛍️ New Order Received!', {
                body: `Order #${orderNum} placed by ${customerName} - ₹${total}`,
                icon: '/logo.png',
                badge: '/favicon.png',
                tag: `dhc-order-${id}`
              });
            } catch (notifErr) {
              console.warn('Native alert error:', notifErr);
            }
          }

          // 4. Dispatch events for UI to auto-refresh orders list
          window.dispatchEvent(new Event('orders_updated'));
          window.dispatchEvent(new Event('admin_notifications_updated'));
        }
      }
    };

    // Helper to process incoming appointments and alert on new ones
    const processAppointments = (apts) => {
      if (!Array.isArray(apts) || apts.length === 0) return;

      if (!initialLoadDoneRef.current) {
        apts.forEach(a => {
          const id = String(a._id || a.id || a.appointmentId);
          knownAppointmentIdsRef.current.add(id);
        });
        return;
      }

      for (const apt of apts) {
        const id = String(apt._id || apt.id || apt.appointmentId);
        if (!knownAppointmentIdsRef.current.has(id)) {
          knownAppointmentIdsRef.current.add(id);

          const patientName = apt.patientName || apt.patient?.name || 'Patient';
          const concern = apt.concern || 'Consultation';

          // 1. Play chime sound
          playNotificationSound();

          // 2. Show toast
          showToast(`📅 New Appointment Booked: ${patientName} (${concern})`, 'info');

          // 3. Native desktop notification
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification('📅 New Consultation Booking!', {
                body: `Patient ${patientName} requested consultation for ${concern}`,
                icon: '/logo.png',
                badge: '/favicon.png',
                tag: `dhc-apt-${id}`
              });
            } catch (notifErr) {
              console.warn('Native alert error:', notifErr);
            }
          }

          window.dispatchEvent(new Event('appointments_updated'));
          window.dispatchEvent(new Event('admin_notifications_updated'));
        }
      }
    };

    // 1. Seed initial data from local storage
    try {
      processOrders(getStoredOrders());
      processAppointments(getStoredAppointments());
    } catch {}

    // 2. Listen to real-time Firebase Cloud Firestore updates (0 console errors)
    const unsubOrders = cloudSyncService.listenToCloudOrders((cloudOrders) => {
      if (isMounted) processOrders(cloudOrders);
    });

    const unsubAppointments = cloudSyncService.listenToCloudAppointments((cloudApts) => {
      if (isMounted) processAppointments(cloudApts);
    });

    // 3. Initial load completed
    initialLoadDoneRef.current = true;

    // 4. Background verification (only if authenticated with a valid admin token)
    const checkLiveUpdates = async () => {
      const adminToken = authStorage.getAdminToken();
      const adminUser = authStorage.getAdminUser();

      if (!adminToken || adminToken.startsWith('demo_') || adminUser?.role !== 'admin') {
        // Demo or unauthenticated admin session: rely on Firebase & local storage without polling Render
        processOrders(getStoredOrders());
        processAppointments(getStoredAppointments());
        return;
      }

      // Check Orders via official admin route
      try {
        const res = await api.get('/orders/admin/all').catch(() => null);
        const orders = res?.data?.data || res?.data || (Array.isArray(res) ? res : []);
        if (isMounted && Array.isArray(orders)) {
          processOrders(orders);
        }
      } catch {}

      // Check Appointments via official admin route
      try {
        const aptRes = await api.get('/appointments').catch(() => null);
        const apts = aptRes?.data?.data || aptRes?.data || (Array.isArray(aptRes) ? aptRes : []);
        if (isMounted && Array.isArray(apts)) {
          processAppointments(apts);
        }
      } catch {}
    };

    // Background polling every 30 seconds
    const interval = setInterval(() => {
      if (isMounted) {
        checkLiveUpdates();
      }
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      unsubOrders?.();
      unsubAppointments?.();
    };
  }, [showToast]);
}

export default useAdminLiveAlerts;
