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
  }
};

export default cloudSyncService;
