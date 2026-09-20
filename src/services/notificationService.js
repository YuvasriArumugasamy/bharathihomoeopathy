/**
 * Notification Service
 * Handles push notifications for new orders, appointments, etc.
 */

import { requestNotificationPermission, onForegroundMessage } from './firebase';

/**
 * Initialize push notifications
 * Call this when admin logs in
 */
export const initializeNotifications = async () => {
  try {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return null;
    }

    // Request permission
    const permission = Notification.permission;
    
    if (permission === 'default') {
      // Ask for permission
      const token = await requestNotificationPermission();
      if (token) {
        // Save token to backend/localStorage for sending notifications
        localStorage.setItem('fcm_token', token);
        return token;
      }
    } else if (permission === 'granted') {
      // Permission already granted, get token
      const token = await requestNotificationPermission();
      if (token) {
        localStorage.setItem('fcm_token', token);
        return token;
      }
    }

    return null;
  } catch (error) {
    console.error('Error initializing notifications:', error);
    return null;
  }
};

/**
 * Show browser notification
 * @param {string} title - Notification title
 * @param {object} options - Notification options
 */
export const showNotification = (title, options = {}) => {
  if (!('Notification' in window)) {
    console.warn('Browser does not support notifications');
    return;
  }

  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/logo.png',
      badge: '/logo.png',
      ...options
    });

    // Auto close after 10 seconds
    setTimeout(() => notification.close(), 10000);

    // Handle click
    notification.onclick = () => {
      window.focus();
      notification.close();
      if (options.onClick) {
        options.onClick();
      }
    };

    return notification;
  }
};

/**
 * Show new order notification
 * @param {object} order - Order object
 */
export const showNewOrderNotification = (order) => {
  const title = '🛍️ New Order Received!';
  const body = `Order #${order.orderId || order.id} - ₹${order.amount || order.total}`;
  
  showNotification(title, {
    body: body,
    tag: `order-${order.id}`,
    requireInteraction: true, // Stays until user clicks
    onClick: () => {
      // Navigate to admin orders page
      window.location.href = '/admin/orders';
    }
  });

  // Play notification sound
  playNotificationSound();
};

/**
 * Show new appointment notification
 * @param {object} appointment - Appointment object
 */
export const showNewAppointmentNotification = (appointment) => {
  const title = '📅 New Appointment Booked!';
  const body = `${appointment.patientName} - ${appointment.date} at ${appointment.time}`;
  
  showNotification(title, {
    body: body,
    tag: `appointment-${appointment.id}`,
    requireInteraction: true,
    onClick: () => {
      window.location.href = '/admin/appointments';
    }
  });

  playNotificationSound();
};

/**
 * Show new enquiry notification
 * @param {object} enquiry - Enquiry object
 */
export const showNewEnquiryNotification = (enquiry) => {
  const title = '💬 New Enquiry Received!';
  const body = `${enquiry.name} - ${enquiry.message?.substring(0, 50)}...`;
  
  showNotification(title, {
    body: body,
    tag: `enquiry-${enquiry.id}`,
    onClick: () => {
      window.location.href = '/admin/enquiries';
    }
  });

  playNotificationSound();
};

/**
 * Play notification sound
 */
const playNotificationSound = () => {
  try {
    // Simple beep sound using AudioContext
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800; // Frequency in Hz
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3; // Volume

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2); // 200ms beep

    // Second beep
    const oscillator2 = audioContext.createOscillator();
    oscillator2.connect(gainNode);
    oscillator2.frequency.value = 1000;
    oscillator2.type = 'sine';
    oscillator2.start(audioContext.currentTime + 0.3);
    oscillator2.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    // Silently fail if sound doesn't work
  }
};

/**
 * Listen for foreground messages
 */
export const listenForNotifications = () => {
  return onForegroundMessage((payload) => {
    console.log('Foreground notification received:', payload);
    
    // Show notification
    if (payload.notification) {
      showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: payload.notification.icon || '/logo.png',
        data: payload.data
      });
    }

    // Handle custom data
    if (payload.data) {
      const { type, orderId, appointmentId } = payload.data;
      
      // You can trigger custom actions based on type
      switch (type) {
        case 'new_order':
          // Refresh orders list
          window.dispatchEvent(new Event('orders_updated'));
          break;
        case 'new_appointment':
          // Refresh appointments list
          window.dispatchEvent(new Event('appointments_updated'));
          break;
        default:
          break;
      }
    }
  });
};

/**
 * Check if notifications are enabled
 */
export const areNotificationsEnabled = () => {
  if (!('Notification' in window)) {
    return false;
  }
  return Notification.permission === 'granted';
};

/**
 * Get notification permission status
 */
export const getNotificationPermission = () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission; // 'granted', 'denied', or 'default'
};

export default {
  initializeNotifications,
  showNotification,
  showNewOrderNotification,
  showNewAppointmentNotification,
  showNewEnquiryNotification,
  listenForNotifications,
  areNotificationsEnabled,
  getNotificationPermission,
  playNotificationSound
};
