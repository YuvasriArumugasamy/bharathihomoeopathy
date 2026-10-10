import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  getDocs,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import { getStoredOrders, saveStoredOrders } from "./orderService";
import { getStoredAppointments, saveStoredAppointments } from "./appointmentService";

const ORDERS_COLLECTION = "orders";
const APPOINTMENTS_COLLECTION = "appointments";

export const cloudSyncService = {
  /**
   * Push newly placed order from ANY device to Firebase Firestore Cloud
   */
  syncOrderToCloud: async (order) => {
    if (!order || !order.id) return null;
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, String(order.id));
      const sanitized = JSON.parse(JSON.stringify(order));
      const cleanPayload = {
        ...sanitized,
        syncedAt: new Date().toISOString(),
        cloudTimestamp: serverTimestamp()
      };
      await setDoc(orderRef, cleanPayload, { merge: true });
      console.log(`[CloudSync] Order ${order.id} synced to Cloud Firestore successfully.`);
      return true;
    } catch (err) {
      console.warn(`[CloudSync] Could not sync order to Cloud (offline or permissions):`, err.message);
      return false;
    }
  },

  /**
   * Listen to real-time order updates from ANY device across the world
   * Calls callback with fresh merged orders whenever a new order is placed or updated
   */
  listenToCloudOrders: (callback) => {
    try {
      const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
      
      const unsubscribe = onSnapshot(
        q, 
        (snapshot) => {
          if (snapshot.empty) {
            if (typeof callback === 'function') {
              callback(getStoredOrders());
            }
            return;
          }
          const cloudOrders = [];
          snapshot.forEach((d) => {
            cloudOrders.push({ id: d.id, ...d.data() });
          });

          // Merge cloud orders with local demo/offline orders without duplicating IDs
          const localOrders = getStoredOrders();
          const cloudIds = new Set(cloudOrders.map(o => o.id || o.orderId));
          const remainingLocal = localOrders.filter(l => !cloudIds.has(l.id) && !cloudIds.has(l.orderId));
          
          const merged = [...remainingLocal, ...cloudOrders];
          saveStoredOrders(merged);
          if (typeof callback === 'function') {
            callback(merged);
          }
        },
        (error) => {
          console.warn("[CloudSync] Live orders snapshot subscription error:", error.message);
          // Fallback to local store
          if (typeof callback === 'function') {
            callback(getStoredOrders());
          }
        }
      );

      return unsubscribe;
    } catch (err) {
      console.warn("[CloudSync] Failed to initialize cloud orders listener:", err.message);
      if (typeof callback === 'function') {
        callback(getStoredOrders());
      }
      return () => {};
    }
  },

  /**
   * Update order status or courier details in Cloud Firestore
   */
  updateCloudOrderStatus: async (orderId, updateFields) => {
    if (!orderId) return false;
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, orderId);
      await updateDoc(orderRef, {
        ...updateFields,
        updatedAt: new Date().toISOString(),
        cloudTimestamp: serverTimestamp()
      });
      console.log(`[CloudSync] Order ${orderId} updated in Cloud:`, updateFields);
      return true;
    } catch (err) {
      console.warn(`[CloudSync] Cloud order status update skipped:`, err.message);
      return false;
    }
  },

  /**
   * Push appointment booked from ANY phone to Cloud Firestore
   */
  syncAppointmentToCloud: async (appointment) => {
    if (!appointment || !appointment.id) return null;
    try {
      const aptRef = doc(db, APPOINTMENTS_COLLECTION, String(appointment.id));
      const sanitized = JSON.parse(JSON.stringify(appointment));
      const cleanPayload = {
        ...sanitized,
        syncedAt: new Date().toISOString(),
        cloudTimestamp: serverTimestamp()
      };
      await setDoc(aptRef, cleanPayload, { merge: true });
      console.log(`[CloudSync] Appointment ${appointment.id} synced to Cloud Firestore.`);
      return true;
    } catch (err) {
      console.warn(`[CloudSync] Could not sync appointment to Cloud:`, err.message);
      return false;
    }
  },

  /**
   * Listen to real-time appointment bookings from ANY patient phone/device
   */
  listenToCloudAppointments: (callback) => {
    try {
      const q = query(collection(db, APPOINTMENTS_COLLECTION), orderBy("createdAt", "desc"));
      
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (snapshot.empty) {
            if (typeof callback === 'function') {
              callback(getStoredAppointments());
            }
            return;
          }
          const cloudApts = [];
          snapshot.forEach((d) => {
            cloudApts.push({ id: d.id, ...d.data() });
          });

          const localApts = getStoredAppointments();
          const cloudIds = new Set(cloudApts.map(a => a.id || a.appointmentId));
          const remainingLocal = localApts.filter(l => !cloudIds.has(l.id) && !cloudIds.has(l.appointmentId));

          const merged = [...remainingLocal, ...cloudApts];
          saveStoredAppointments(merged);
          if (typeof callback === 'function') {
            callback(merged);
          }
        },
        (error) => {
          console.warn("[CloudSync] Live appointments snapshot error:", error.message);
          if (typeof callback === 'function') {
            callback(getStoredAppointments());
          }
        }
      );

      return unsubscribe;
    } catch (err) {
      console.warn("[CloudSync] Failed to initialize cloud appointments listener:", err.message);
      if (typeof callback === 'function') {
        callback(getStoredAppointments());
      }
      return () => {};
    }
  },

  /**
   * Update appointment status or time in Cloud Firestore
   */
  updateCloudAppointmentStatus: async (appointmentId, updateFields) => {
    if (!appointmentId) return false;
    try {
      const aptRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
      await updateDoc(aptRef, {
        ...updateFields,
        updatedAt: new Date().toISOString(),
        cloudTimestamp: serverTimestamp()
      });
      return true;
    } catch (err) {
      console.warn(`[CloudSync] Cloud appointment update skipped:`, err.message);
      return false;
    }
  },

  /**
   * Sync countdown timer settings to Cloud Firestore
   */
  syncOfferTimerToCloud: async (timerSettings) => {
    if (!timerSettings) return false;
    try {
      const timerRef = doc(db, "settings", "offer_timer");
      const cleanPayload = {
        ...JSON.parse(JSON.stringify(timerSettings)),
        syncedAt: new Date().toISOString(),
        cloudTimestamp: serverTimestamp()
      };
      await setDoc(timerRef, cleanPayload, { merge: true });
      return true;
    } catch (err) {
      console.warn("[CloudSync] Could not sync timer settings to Cloud:", err.message);
      return false;
    }
  },

  /**
   * Real-time listener for countdown timer settings
   */
  listenToOfferTimer: (callback) => {
    try {
      const timerRef = doc(db, "settings", "offer_timer");
      const unsubscribe = onSnapshot(
        timerRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (typeof callback === 'function') {
              callback(data);
            }
          }
        },
        (error) => {
          console.warn("[CloudSync] Live offer timer snapshot error:", error.message);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn("[CloudSync] Failed to initialize cloud timer listener:", err.message);
      return () => {};
    }
  },

  /**
   * Sync coupons store to Cloud Firestore
   */
  syncCouponsToCloud: async (coupons) => {
    if (!Array.isArray(coupons)) return false;
    try {
      const couponsRef = doc(db, "settings", "admin_coupons");
      await setDoc(couponsRef, {
        coupons: coupons.map(c => JSON.parse(JSON.stringify(c))),
        updatedAt: new Date().toISOString(),
        cloudTimestamp: serverTimestamp()
      }, { merge: true });
      return true;
    } catch (err) {
      console.warn("[CloudSync] Could not sync coupons to Cloud:", err.message);
      return false;
    }
  },

  /**
   * Real-time listener for coupons from Cloud Firestore
   */
  listenToCoupons: (callback) => {
    try {
      const couponsRef = doc(db, "settings", "admin_coupons");
      const unsubscribe = onSnapshot(
        couponsRef,
        (snap) => {
          if (typeof callback !== 'function') return;
          if (snap.exists()) {
            const data = snap.data();
            callback(Array.isArray(data?.coupons) ? data.coupons : []);
          } else {
            callback([]);
          }
        },
        (error) => {
          console.warn("[CloudSync] Live coupons snapshot error:", error.message);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn("[CloudSync] Failed to initialize cloud coupons listener:", err.message);
      return () => {};
    }
  },
  /**
   * Sync promotional offers to Cloud Firestore
   */
  syncOffersToCloud: async (offers) => {
    if (!Array.isArray(offers)) return false;
    try {
      const offersRef = doc(db, "settings", "admin_offers");
      await setDoc(offersRef, {
        offers: offers.map(o => JSON.parse(JSON.stringify(o))),
        updatedAt: new Date().toISOString(),
        cloudTimestamp: serverTimestamp()
      }, { merge: true });
      return true;
    } catch (err) {
      console.warn("[CloudSync] Could not sync offers to Cloud:", err.message);
      return false;
    }
  },

  /**
   * Real-time listener for promotional offers from Cloud Firestore
   */
  listenToOffers: (callback) => {
    try {
      const offersRef = doc(db, "settings", "admin_offers");
      const unsubscribe = onSnapshot(
        offersRef,
        (snap) => {
          if (typeof callback !== 'function') return;
          if (snap.exists()) {
            const data = snap.data();
            callback(Array.isArray(data?.offers) ? data.offers : []);
          } else {
            callback([]);
          }
        },
        (error) => {
          console.warn("[CloudSync] Live offers snapshot error:", error.message);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn("[CloudSync] Failed to initialize cloud offers listener:", err.message);
      return () => {};
    }
  },

  /**
   * Sync clinic settings (shipping, contact, store parameters) to Cloud Firestore
   */
  syncSettingsToCloud: async (settings) => {
    if (!settings) return false;
    try {
      const settingsRef = doc(db, "settings", "clinic_settings");
      const cleanPayload = {
        ...JSON.parse(JSON.stringify(settings)),
        updatedAt: new Date().toISOString(),
        cloudTimestamp: serverTimestamp()
      };
      await setDoc(settingsRef, cleanPayload, { merge: true });
      console.log("[CloudSync] Clinic settings synced to Cloud Firestore successfully.");
      return true;
    } catch (err) {
      console.warn("[CloudSync] Could not sync clinic settings to Cloud:", err.message);
      return false;
    }
  },

  /**
   * Real-time listener for clinic settings from Cloud Firestore across all devices
   */
  listenToSettings: (callback) => {
    try {
      const settingsRef = doc(db, "settings", "clinic_settings");
      const unsubscribe = onSnapshot(
        settingsRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            const { cloudTimestamp, updatedAt, ...cleanSettings } = data;
            try {
              localStorage.setItem('admin_clinic_settings', JSON.stringify(cleanSettings));
              window.dispatchEvent(new Event('drBharathiSettingsUpdated'));
              window.dispatchEvent(new Event('storage'));
            } catch {}
            if (typeof callback === 'function') {
              callback(cleanSettings);
            }
          }
        },
        (error) => {
          console.warn("[CloudSync] Live clinic settings snapshot error:", error.message);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn("[CloudSync] Failed to initialize cloud settings listener:", err.message);
      return () => {};
    }
  },

  /**
   * Sync categories catalog to Cloud Firestore across all devices
   */
  syncCategoriesToCloud: async (categories) => {
    if (!Array.isArray(categories)) return false;
    try {
      const catRef = doc(db, "settings", "admin_categories");
      await setDoc(catRef, {
        categories: categories.map(c => JSON.parse(JSON.stringify(c))),
        updatedAt: new Date().toISOString(),
        cloudTimestamp: serverTimestamp()
      }, { merge: true });
      console.log("[CloudSync] Categories catalog synced to Cloud Firestore.");
      return true;
    } catch (err) {
      console.warn("[CloudSync] Could not sync categories to Cloud:", err.message);
      return false;
    }
  },

  /**
   * Real-time listener for remedy categories from Cloud Firestore
   */
  listenToCategories: (callback) => {
    try {
      const catRef = doc(db, "settings", "admin_categories");
      const unsubscribe = onSnapshot(
        catRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            const cloudCats = Array.isArray(data?.categories) ? data.categories : [];
            try {
              localStorage.setItem('admin_categories_store', JSON.stringify(cloudCats));
              window.dispatchEvent(new CustomEvent('drBharathiCategoriesUpdated', { detail: cloudCats }));
              window.dispatchEvent(new Event('storage'));
            } catch {}
            if (typeof callback === 'function') {
              callback(cloudCats);
            }
          }
        },
        (error) => {
          console.warn("[CloudSync] Live categories snapshot error:", error.message);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn("[CloudSync] Failed to initialize cloud categories listener:", err.message);
      return () => {};
    }
  },

  /**
   * Sync brands catalog to Cloud Firestore across all devices
   */
  syncBrandsToCloud: async (brands) => {
    if (!Array.isArray(brands)) return false;
    try {
      const brandRef = doc(db, "settings", "admin_brands");
      await setDoc(brandRef, {
        brands: brands.map(b => JSON.parse(JSON.stringify(b))),
        updatedAt: new Date().toISOString(),
        cloudTimestamp: serverTimestamp()
      }, { merge: true });
      console.log("[CloudSync] Brands catalog synced to Cloud Firestore.");
      return true;
    } catch (err) {
      console.warn("[CloudSync] Could not sync brands to Cloud:", err.message);
      return false;
    }
  },

  /**
   * Real-time listener for remedy brands from Cloud Firestore
   */
  listenToBrands: (callback) => {
    try {
      const brandRef = doc(db, "settings", "admin_brands");
      const unsubscribe = onSnapshot(
        brandRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            const cloudBrands = Array.isArray(data?.brands) ? data.brands : [];
            try {
              localStorage.setItem('admin_brands_store', JSON.stringify(cloudBrands));
              window.dispatchEvent(new CustomEvent('drBharathiBrandsUpdated', { detail: cloudBrands }));
              window.dispatchEvent(new Event('storage'));
            } catch {}
            if (typeof callback === 'function') {
              callback(cloudBrands);
            }
          }
        },
        (error) => {
          console.warn("[CloudSync] Live brands snapshot error:", error.message);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn("[CloudSync] Failed to initialize cloud brands listener:", err.message);
      return () => {};
    }
  }
};

export default cloudSyncService;

