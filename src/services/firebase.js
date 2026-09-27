import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getMessaging, getToken, onMessage, isSupported as isMessagingSupported } from "firebase/messaging";

// Firebase Configuration using Vite environment variables with robust fallback
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDmRSGf8QmlTd25U6AAltyeT3M_8y4FMWQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bharathi-homoeopathy-clinic.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bharathi-homoeopathy-clinic",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bharathi-homoeopathy-clinic.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "321280159922",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:321280159922:web:163fa0417b0abc8e3299ab",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-1CFVD5NQP3"
};

// FCM VAPID Key (Web Push Certificate)
export const VAPID_KEY =
  import.meta.env.VITE_FIREBASE_VAPID_KEY ||
  "BC90weNFOqi2bos-QYp3886C1ZOf1LEhcGq3RoxnUZkk52oiO0SrnxKpacNi4PxFMwAa0USucHyXrVDhWNIE_UA";

// Initialize Firebase App (Singleton check)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore (always available - no auth required)
export const db = getFirestore(app);

// Initialize Firebase Auth conditionally (silently - avoids CONFIGURATION_NOT_FOUND console errors)
// Firebase Auth makes a call to googleapis.com/identitytoolkit on load which throws 400 errors
// if the domain is not whitelisted in Firebase Console. We lazy-initialize to prevent this.
export let auth = null;
export const getFirebaseAuth = async () => {
  if (auth) return auth;
  try {
    const { getAuth } = await import("firebase/auth");
    auth = getAuth(app);
    return auth;
  } catch (err) {
    // Silently ignore - Firebase Auth not available in this environment
    return null;
  }
};

// Initialize Analytics conditionally (only in supported browser environments)
export let analytics = null;
if (typeof window !== "undefined") {
  isAnalyticsSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Silently ignore analytics errors
    });
}

// Initialize Messaging conditionally (requires ServiceWorker & Push API support)
export let messaging = null;
export const initMessaging = async () => {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    try {
      const supported = await isMessagingSupported();
      if (supported) {
        messaging = getMessaging(app);
        return messaging;
      }
    } catch (err) {
      // Silently ignore messaging errors (e.g., iframe context, unsupported browser)
    }
  }
  return null;
};

// Auto-initialize messaging if in browser (fire-and-forget, no error logs)
if (typeof window !== "undefined") {
  initMessaging().catch(() => {});
}

/**
 * Request notification permission and get the FCM device registration token
 * @returns {Promise<string|null>} FCM registration token or null
 */
export const requestNotificationPermission = async () => {
  try {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const msg = messaging || (await initMessaging());
    if (!msg) return null;

    let swRegistration = null;
    if ("serviceWorker" in navigator) {
      try {
        swRegistration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      } catch {
        // Ignore service worker registration errors
      }
    }

    const token = await getToken(msg, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swRegistration || undefined,
    });

    if (token) {
      return token;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Register a listener for foreground FCM push messages
 * @param {Function} callback Function to handle incoming message payload
 * @returns {Function|null} Unsubscribe function
 */
export const onForegroundMessage = (callback) => {
  if (!messaging) return null;
  return onMessage(messaging, (payload) => {
    if (callback) callback(payload);
  });
};

export default app;