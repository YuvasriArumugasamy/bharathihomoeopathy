import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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

// Initialize Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics conditionally (only in supported browser environments)
export let analytics = null;
if (typeof window !== "undefined") {
  isAnalyticsSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((err) => {
      console.warn("Firebase Analytics not supported in this environment:", err.message);
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
      console.warn("Firebase Messaging is not supported in this environment:", err.message);
    }
  }
  return null;
};

// Auto-initialize messaging if in browser
initMessaging();

/**
 * Request notification permission and get the FCM device registration token
 * @returns {Promise<string|null>} FCM registration token or null
 */
export const requestNotificationPermission = async () => {
  try {
    if (typeof window === "undefined" || !("Notification" in window)) {
      console.warn("Push notifications are not supported by this browser.");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission not granted:", permission);
      return null;
    }

    const msg = messaging || (await initMessaging());
    if (!msg) {
      console.warn("Messaging instance could not be initialized.");
      return null;
    }

    // Register service worker if not already registered
    let swRegistration = null;
    if ("serviceWorker" in navigator) {
      try {
        swRegistration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      } catch (swErr) {
        console.warn("Service worker registration error:", swErr.message);
      }
    }

    const token = await getToken(msg, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swRegistration || undefined,
    });

    if (token) {
      console.log("FCM Registration Token received:", token);
      return token;
    } else {
      console.warn("No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving FCM push token:", error);
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
    console.log("Received foreground message:", payload);
    if (callback) callback(payload);
  });
};

export default app;
