import { useEffect } from 'react';
import { VAPID_KEY, app } from '../services/firebase';
import { api } from '../utils/api';

export const playNotificationSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.warn('Audio chime error:', e);
  }
};

/**
 * Safely initializes Firebase Cloud Messaging (FCM) push notifications.
 * If Firebase is unavailable or not supported in this browser, silently skips — app will NOT crash.
 */
export function useFCM() {
  useEffect(() => {
    let unsubscribe = null;

    const initFCM = async () => {
      try {
        // 1. Check browser support
        if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
          return;
        }

        // 2. Dynamically import firebase/messaging to avoid SSR/bundling errors
        const { isSupported, getToken, onMessage, getMessaging } = await import('firebase/messaging');

        const supported = await isSupported();
        if (!supported) return;

        const msgInstance = getMessaging(app);

        // 3. Check current permission
        let permission = Notification.permission;
        if (permission === 'default') {
          // Do not forcefully prompt on load; prompt when user clicks Enable Alerts or if already granted
          return;
        }

        if (permission !== 'granted') return;

        // 4. Ensure service worker is registered
        let swReg = null;
        try {
          swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        } catch (swErr) {
          console.warn('FCM service worker register:', swErr?.message);
        }

        // 5. Get FCM device token
        const token = await getToken(msgInstance, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: swReg || undefined
        });

        if (!token) return;

        console.log('✅ FCM Device Token ready:', token.slice(0, 15) + '...');
        localStorage.setItem('fcm_token', token);

        // 6. Save token to backend (fire-and-forget)
        try {
          await api.post('/notifications/fcm-token', { token });
        } catch {
          // Silently continue if backend is offline
        }

        // 7. Handle foreground notifications
        unsubscribe = onMessage(msgInstance, (payload) => {
          const { title, body } = payload.notification || {};
          
          // Play audio bell chime
          playNotificationSound();

          // Fire OS native notification
          if (Notification.permission === 'granted') {
            try {
              new Notification(title || '🔔 Dr. Bharathi Homeo Care', {
                body: body || 'You have received a new consultation or order update.',
                icon: '/logo.png',
                badge: '/favicon.png',
              });
            } catch (notifErr) {
              console.warn('Native notification display:', notifErr?.message);
            }
          }

          // Trigger internal event for real-time dashboard listeners
          window.dispatchEvent(new CustomEvent('fcm_notification_received', { detail: payload }));
          window.dispatchEvent(new Event('orders_updated'));
          window.dispatchEvent(new Event('appointments_updated'));
        });

      } catch (err) {
        console.warn('FCM init skipped:', err?.message);
      }
    };

    initFCM();

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);
}

export default useFCM;
