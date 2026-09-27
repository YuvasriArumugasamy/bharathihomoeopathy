import { useEffect, useRef } from 'react';
import { api } from '../utils/api';
import { playNotificationSound } from './useFCM';
import { useToast } from '../context/ToastContext';

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
    let isMounted = true;

    const checkLiveUpdates = async () => {
      try {
        // 1. Check Orders
        try {
          const res = await api.get('/orders?limit=10').catch(() => null);
          const orders = res?.data?.data || res?.data || [];
          
          if (Array.isArray(orders) && orders.length > 0) {
            if (!initialLoadDoneRef.current) {
              // Populate initial IDs on startup so we don't alert for existing history
              orders.forEach(o => {
                const id = String(o._id || o.id || o.orderNumber);
                knownOrderIdsRef.current.add(id);
              });
            } else {
              // Check for brand new orders
              for (const order of orders) {
                const id = String(order._id || order.id || order.orderNumber);
                if (!knownOrderIdsRef.current.has(id)) {
                  knownOrderIdsRef.current.add(id);

                  const customerName = order.shippingAddress?.fullName || order.guestName || 'Patient';
                  const orderNum = order.orderNumber || id.slice(-6);
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
            }
          }
        } catch (orderErr) {
          // Silent fallback
        }

        // 2. Check Appointments
        try {
          const aptRes = await api.get('/appointments?limit=10').catch(() => null);
          const apts = aptRes?.data?.data || aptRes?.data || [];

          if (Array.isArray(apts) && apts.length > 0) {
            if (!initialLoadDoneRef.current) {
              apts.forEach(a => {
                const id = String(a._id || a.id || a.appointmentId);
                knownAppointmentIdsRef.current.add(id);
              });
            } else {
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
            }
          }
        } catch (aptErr) {
          // Silent fallback
        }

        initialLoadDoneRef.current = true;
      } catch (err) {
        console.warn('Live alert check:', err.message);
      }
    };

    // Run immediately once
    checkLiveUpdates();

    // Check periodically every 12 seconds
    const interval = setInterval(() => {
      if (isMounted) {
        checkLiveUpdates();
      }
    }, 12000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [showToast]);
}

export default useAdminLiveAlerts;
