import { api } from '../utils/api';
import { customerService } from './customerService';
import { cloudSyncService } from './cloudSyncService';
import { authStorage } from '../utils/authStorage';

const ORDERS_STORAGE_KEY = 'admin_orders_store';

const initialDemoOrders = [];

/**
 * Normalizes any order ID to a clean, reliable 6-digit number like "842005"
 */
export const formatOrderNumber = (raw) => {
  if (!raw) return String(Math.floor(100000 + Math.random() * 900000));
  const str = String(raw).trim();

  // Already a 6-digit number (e.g. 842005)
  if (/^\d{6}$/.test(str)) {
    return str;
  }

  // DHC-YYYYMMDD-XXXX (e.g. DHC-20260917-4911 -> "844911")
  const dhcMatch = str.match(/DHC-\d{8}-(\d{4})/i);
  if (dhcMatch && dhcMatch[1]) {
    return `84${dhcMatch[1]}`;
  }

  // Extract trailing digits or pad to 6 digits
  const allDigits = str.replace(/\D/g, '');
  if (allDigits.length >= 6) {
    return allDigits.slice(-6);
  }
  if (allDigits.length > 0) {
    return allDigits.padStart(6, '8');
  }

  // Deterministic fallback
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return String(100000 + (Math.abs(hash) % 900000));
};

export const getStoredOrders = () => {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Filter out any leftover demo mock orders and nulls, normalize ID to 6-digit number
        const cleaned = parsed.filter(o => 
          o && typeof o === 'object' &&
          !['ord-1001', 'ord-1002', 'ord-1003'].includes(o.id) && 
          !['894123', '894256', '894389'].includes(o.orderId) && 
          !['894123', '894256', '894389'].includes(o.orderNumber)
        ).map(o => {
          const num = formatOrderNumber(o.orderNumber || o.orderId || o.id);
          return {
            ...o,
            originalOrderId: o.originalOrderId || o.orderId || o.orderNumber,
            orderId: num,
            orderNumber: num
          };
        });
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(cleaned));
        return cleaned;
      }
    }
  } catch (err) {
    console.warn("Could not read orders from storage:", err.message);
  }
  return [];
};

export const saveStoredOrders = (orders) => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('orders_updated'));
      window.dispatchEvent(new Event('admin_notifications_updated'));
    }
  } catch (err) {
    console.warn("Could not save orders to storage:", err.message);
  }
};

/**
 * Filter orders strictly for the current patient / user
 * Ensures real-time data isolation so patients never see other people's orders
 */
export const getUserOrders = (user) => {
  const allOrders = getStoredOrders();
  if (!user) {
    const lastEmail = typeof localStorage !== 'undefined' ? localStorage.getItem('last_checkout_email') : null;
    if (lastEmail) {
      return allOrders.filter(o => {
        const oEmail = (o.userEmail || o.customer?.email || o.shippingAddress?.email || '').trim().toLowerCase();
        return oEmail === lastEmail.trim().toLowerCase();
      });
    }
    return [];
  }

  const userEmail = (user.email || '').trim().toLowerCase();
  const userPhone = (user.phone || '').replace(/\D/g, '');
  const userId = user._id || user.id || '';

  return allOrders.filter(order => {
    // 1. Matched by User ID
    if (userId && order.userId && String(order.userId) === String(userId)) return true;

    // 2. Matched by Email address
    const oEmail = (order.userEmail || order.customer?.email || order.shippingAddress?.email || '').trim().toLowerCase();
    if (userEmail && oEmail && oEmail === userEmail) return true;

    // 3. Matched by Phone number (last 10 digits comparison)
    const oPhone = (order.customer?.phone || order.shippingAddress?.phone || '').replace(/\D/g, '');
    if (userPhone && oPhone && (oPhone.endsWith(userPhone) || userPhone.endsWith(oPhone))) return true;

    return false;
  });
};

export const orderService = {
  getStoredOrders,
  saveStoredOrders,
  createOrder: async (payload) => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const newOrderNumber = randomNum.toString();

    const newOrder = {
      id: 'ord-' + Date.now(),
      orderId: newOrderNumber,
      orderNumber: newOrderNumber,
      userId: payload.userId || null,
      userEmail: payload.userEmail || payload.shippingAddress?.email || '',
      createdAt: new Date().toISOString(),
      customer: {
        name: payload.shippingAddress?.fullName || 'Online Patient',
        phone: payload.shippingAddress?.phone || '',
        email: payload.shippingAddress?.email || '',
        city: `${payload.shippingAddress?.city || ''}, ${payload.shippingAddress?.state || ''}`.trim()
      },
      items: payload.items || [],
      total: payload.totalAmount || payload.total || 0,
      paymentMethod: payload.paymentMethod || 'ONLINE',
      paymentStatus: payload.paymentMethod === 'COD' ? 'Pending' : 'Paid',
      orderStatus: 'Pending',
      shippingAddress: payload.shippingAddress || {}
    };

    // Save directly to store & trigger real-time update
    const currentOrders = getStoredOrders();
    saveStoredOrders([newOrder, ...currentOrders]);

    // Push order in real-time to Firebase Firestore Cloud (Accessible from any device)
    try {
      cloudSyncService.syncOrderToCloud(newOrder);
    } catch (cErr) {
      console.warn("Cloud sync error:", cErr.message);
    }

    // Automatically sync patient directory
    try {
      customerService.syncCustomer({
        name: newOrder.customer.name,
        email: newOrder.customer.email,
        phone: newOrder.customer.phone,
        city: newOrder.shippingAddress?.city,
        state: newOrder.shippingAddress?.state
      }, newOrder.total);
    } catch (custErr) {
      console.warn("Could not sync customer on order:", custErr);
    }

    try {
      const res = await api.post('/orders', payload);
      if (res && res.data) {
        newOrder._id = res.data._id;
        if (res.data.orderNumber) {
          newOrder.orderNumber = res.data.orderNumber;
          newOrder.orderId = res.data.orderNumber;
        }
        // Update stored orders with official remote order
        const refreshed = getStoredOrders().map(o => o.id === newOrder.id ? { ...o, ...newOrder } : o);
        saveStoredOrders(refreshed);
      }
    } catch (err) {
      console.warn("Order saved locally (backend offline):", err.message);
    }

    return {
      success: true,
      message: "Order placed successfully!",
      data: newOrder
    };
  },

  getMyOrders: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await api.get(`/orders/my-orders?${query}`);
      if (res && res.data && res.data.length > 0) return res;
    } catch {
      // Fallback
    }
    return { success: true, data: getStoredOrders() };
  },

  getMyPatientOrders: async (user) => {
    const email = user?.email || (typeof localStorage !== 'undefined' ? localStorage.getItem('last_checkout_email') : '');
    try {
      const res = await api.get(`/orders/my-orders${email ? `?email=${encodeURIComponent(email)}` : ''}`);
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        const remoteOrders = res.data.filter(Boolean).map(o => ({
          ...o,
          id: o.orderNumber || o.id || o._id,
          orderId: o.orderNumber || o.orderId,
          total: o.totalAmount || o.total,
          status: o.orderStatus || o.status || 'Pending',
          paymentStatus: o.paymentStatus || 'Pending',
          customer: {
            name: o.shippingAddress?.fullName || o.guestName || user?.name || 'Online Patient',
            phone: o.shippingAddress?.phone || o.guestPhone || user?.phone || '',
            email: o.shippingAddress?.email || o.guestEmail || user?.email || ''
          }
        }));
        return remoteOrders;
      }
    } catch (err) {
      console.warn("Could not fetch patient orders from backend:", err.message);
    }
    return getUserOrders(user);
  },

  getMyOrderById: async (id) => {
    try {
      const res = await api.get(`/orders/my-orders/${id}`);
      if (res && res.data) return res;
    } catch {
      // Fallback
    }
    const found = getStoredOrders().find(o => o.id === id || o.orderId === id || o.orderNumber === id);
    if (found) return { success: true, data: found };
    throw new Error("Order not found");
  },

  cancelMyOrder: async (id) => {
    try {
      const res = await api.put(`/orders/my-orders/${id}/cancel`);
      return res;
    } catch {
      const orders = getStoredOrders().map(o => (o.id === id || o.orderId === id) ? { ...o, orderStatus: 'Cancelled' } : o);
      saveStoredOrders(orders);
      return { success: true, message: 'Order cancelled successfully' };
    }
  },

  // ----------------------------------------------------
  // ADMIN PORTAL ORDERS OPERATIONS
  // ----------------------------------------------------
  getAdminOrders: async () => {
    const localOrders = getStoredOrders();
    try {
      const res = await api.get('/orders/admin/all');
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        const remoteOrders = res.data.filter(Boolean).map(o => {
          const num = formatOrderNumber(o.orderNumber || o.orderId || o.id);
          return {
            ...o,
            id: o.id || o._id,
            originalOrderId: o.orderId || o.orderNumber || o.id,
            orderId: num,
            orderNumber: num,
            total: o.total || o.totalAmount || 0,
            customer: o.customer || {
              name: o.shippingAddress?.fullName || o.guestName || 'Online Patient',
              phone: o.shippingAddress?.phone || o.guestPhone || '',
              email: o.shippingAddress?.email || o.guestEmail || '',
              city: `${o.shippingAddress?.city || ''}, ${o.shippingAddress?.state || ''}`.trim()
            }
          };
        });
        const remoteIds = new Set(remoteOrders.map(o => o.id || o.originalOrderId || o.orderId || o.orderNumber || o._id));
        const unSyncedLocal = localOrders.filter(l => !remoteIds.has(l.id) && !remoteIds.has(l.originalOrderId) && !remoteIds.has(l.orderId) && !remoteIds.has(l.orderNumber) && !remoteIds.has(l._id));
        const merged = [...remoteOrders, ...unSyncedLocal];
        saveStoredOrders(merged);
        return merged;
      }
    } catch (err) {
      console.warn("Could not fetch remote admin orders, using local storage", err.message);
    }
    return localOrders;
  },

  updateAdminOrderStatus: async (id, newStatus) => {
    const orders = getStoredOrders().map(o => (o.id === id || o._id === id || o.orderId === id) ? { ...o, orderStatus: newStatus } : o);
    saveStoredOrders(orders);

    try {
      await cloudSyncService.updateCloudOrderStatus(id, { orderStatus: newStatus });
    } catch {}

    try {
      await api.patch(`/orders/${id}/status`, { orderStatus: newStatus });
    } catch (err) {
      console.warn("Order status updated in local persistent store:", err.message);
    }
    return { success: true, orderStatus: newStatus };
  },

  updateAdminPaymentStatus: async (id, newPaymentStatus) => {
    const orders = getStoredOrders().map(o => (o.id === id || o._id === id || o.orderId === id) ? { ...o, paymentStatus: newPaymentStatus } : o);
    saveStoredOrders(orders);

    try {
      await cloudSyncService.updateCloudOrderStatus(id, { paymentStatus: newPaymentStatus });
    } catch {}

    try {
      await api.patch(`/orders/${id}/payment-status`, { paymentStatus: newPaymentStatus });
    } catch (err) {
      console.warn("Payment status updated in local persistent store:", err.message);
    }
    return { success: true, paymentStatus: newPaymentStatus };
  }
};

export default orderService;
