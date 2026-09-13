// Firebase Cloud Messaging Service Worker
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyDmRSGf8QmlTd25U6AAltyeT3M_8y4FMWQ",
  authDomain: "bharathi-homoeopathy-clinic.firebaseapp.com",
  projectId: "bharathi-homoeopathy-clinic",
  storageBucket: "bharathi-homoeopathy-clinic.firebasestorage.app",
  messagingSenderId: "321280159922",
  appId: "1:321280159922:web:163fa0417b0abc8e3299ab",
  measurementId: "G-1CFVD5NQP3"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message: ", payload);

  const notificationTitle = payload.notification?.title || "Dr. Bharathi's Homeo Care";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new update regarding your consultation or order.",
    icon: "/logo.png",
    badge: "/favicon.png",
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click to focus or open window
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
