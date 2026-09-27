import React, { useState, useEffect } from 'react';
import { Bell, BellRing, CheckCircle2, AlertCircle, Sparkles, Send } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../utils/api';
import { VAPID_KEY, app } from '../../services/firebase';
import { playNotificationSound } from '../../hooks/useFCM';

export default function PushNotificationCard() {
  const { showToast } = useToast();
  const [permission, setPermission] = useState('default');
  const [loading, setLoading] = useState(false);

  const checkPermission = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    } else {
      setPermission('unsupported');
    }
  };

  useEffect(() => {
    checkPermission();
  }, []);

  const handleEnableAlerts = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showToast('Push notifications are not supported in this browser.', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await Notification.requestPermission();
      setPermission(res);

      if (res === 'granted') {
        showToast('Push notifications enabled successfully!', 'success');

        // Register FCM token with backend
        try {
          if ('serviceWorker' in navigator) {
            const { isSupported, getToken, getMessaging } = await import('firebase/messaging');
            const supported = await isSupported();
            if (supported) {
              const msgInstance = getMessaging(app);
              const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(() => null);
              const token = await getToken(msgInstance, {
                vapidKey: VAPID_KEY,
                serviceWorkerRegistration: swReg || undefined
              });
              if (token) {
                localStorage.setItem('fcm_token', token);
                await api.post('/notifications/fcm-token', { token });
                console.log('✅ FCM Token registered with clinic server');
              }
            }
          }
        } catch (fcmErr) {
          console.warn('FCM token registration:', fcmErr?.message);
        }
      } else if (res === 'denied') {
        showToast('Notification permission was blocked in browser settings.', 'warning');
      }
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      showToast('Failed to request notification permission', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showToast('Push notifications are not supported in this browser.', 'error');
      return;
    }

    let currentPerm = Notification.permission;
    if (currentPerm !== 'granted') {
      currentPerm = await Notification.requestPermission();
      setPermission(currentPerm);
    }

    if (currentPerm !== 'granted') {
      showToast('Please click "Enable Alerts" first to grant permission.', 'warning');
      return;
    }

    try {
      setLoading(true);

      // 1. Play crystal-clear audio bell chime
      playNotificationSound();

      // 2. Fire native OS notification
      const title = '🔔 Dr. Bharathi Homeo Care - Test Alert';
      const options = {
        body: 'Real-time push notifications are working with 100% precision!',
        icon: '/logo.png',
        badge: '/favicon.png',
        tag: 'dhc-test-' + Date.now(),
      };

      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          if (registration && registration.showNotification) {
            await registration.showNotification(title, options);
          } else {
            new Notification(title, options);
          }
        } catch {
          new Notification(title, options);
        }
      } else {
        new Notification(title, options);
      }

      // 3. Trigger server push notification broadcast
      try {
        await api.post('/notifications/send', {
          title: '🔔 Push Notification Test',
          body: 'Clinical push notification broadcast triggered successfully.',
        });
      } catch (backendErr) {
        console.warn('Backend notification broadcast:', backendErr?.message);
      }

      showToast('🔔 Test Notification Triggered! Chime & Alert active.', 'success');
    } catch (err) {
      console.error('Test notification error:', err);
      showToast('Failed to trigger test notification', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = () => {
    switch (permission) {
      case 'granted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Granted (Active)
          </span>
        );
      case 'denied':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Denied (Blocked)
          </span>
        );
      case 'default':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300">
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            Default (Needs Enable)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-700 border border-slate-300">
            Not Supported
          </span>
        );
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/60 border border-brandOrange-200/90 rounded-[2rem] p-6 sm:p-7 shadow-[0_4px_25px_-4px_rgba(234,88,12,0.10)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 font-serif">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brandOrange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25">
            <BellRing className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 font-display">
              Live Clinical Push Notifications (FCM)
            </h3>
            <p className="text-xs text-slate-600">
              Receive immediate audio chime and browser alerts whenever a patient places an order or books a consultation.
            </p>
          </div>
        </div>

        <div className="text-xs pt-1 flex items-center gap-2">
          <span className="font-bold text-slate-700">Notification Permission:</span>
          {getStatusDisplay()}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <button
          onClick={handleEnableAlerts}
          disabled={loading || permission === 'granted'}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer ${
            permission === 'granted'
              ? 'bg-emerald-600 text-white cursor-default opacity-90'
              : 'bg-brandOrange-500 hover:bg-brandOrange-600 text-white hover:shadow-md hover:scale-105 active:scale-95'
          }`}
        >
          {permission === 'granted' ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Alerts Enabled</span>
            </>
          ) : (
            <>
              <Bell className="w-4 h-4" />
              <span>Enable Alerts</span>
            </>
          )}
        </button>

        <button
          onClick={handleTestNotification}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>🔔 Test Notification</span>
        </button>
      </div>
    </div>
  );
}
