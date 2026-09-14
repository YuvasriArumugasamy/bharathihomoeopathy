import { api } from '../utils/api';
import { customerService } from './customerService';
import { cloudSyncService } from './cloudSyncService';

const ORDERS_STORAGE_KEY = 'admin_orders_store';

const initialDemoOrders = [
  {
    id: 'ord-1001',
    orderId: '894123',
    createdAt: '2026-09-12T10:30:00Z',
    customer: {
      name: 'Kavitha Ramasamy',
      phone: '+91 98412 34567',
      email: 'kavitha.r@gmail.com',
      city: 'Coimbatore, Tamil Nadu'
    },
    items: [
      { name: 'Arnica Montana 200CH Pellets', quantity: 2, price: 349 }
    ],
    total: 698,
    paymentMethod: 'ONLINE',
    paymentStatus: 'Paid',
    orderStatus: 'Pending',
    shippingAddress: {
      fullName: 'Kavitha Ramasamy',
      phone: '+91 98412 34567',
      addressLine1: 'No 45, Cross Cut Road, Gandhipuram',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      postalCode: '641012'
    }
  },
  {
    id: 'ord-1002',
    orderId: '894256',
    createdAt: '2026-09-11T14:15:00Z',
    customer: {
      name: 'Dr. S. Sundaram',
      phone: '+91 94433 11223',
      email: 'dr.sundaram@homoeo.in',
      city: 'Madurai, Tamil Nadu'
    },
    items: [
      { name: 'Dr. Bharathi Herbal Immunity Drops (100ml)', quantity: 3, price: 549 },
      { name: 'Nux Vomica 30CH Liquid Dilution (30ml)', quantity: 1, price: 299 }
    ],
    total: 1946,
    paymentMethod: 'ONLINE',
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    courierPartner: 'ST COURIER',
    trackingNumber: 'ST-90234812',
    shippingAddress: {
      fullName: 'Dr. S. Sundaram',
      phone: '+91 94433 11223',
      addressLine1: '12, West Masi Street',
      city: 'Madurai',
      state: 'Tamil Nadu',
      postalCode: '625001'
    }
  },
  {
    id: 'ord-1003',
    orderId: '894389',
    createdAt: '2026-09-10T09:45:00Z',
    customer: {
      name: 'Meena Murugan',
      phone: '+91 97890 55443',
      email: 'meenamurugan88@yahoo.com',
      city: 'Salem, Tamil Nadu'
    },
    items: [
      { name: 'Dr. Reckeweg R89 Hair Care Drops (30ml)', quantity: 1, price: 585 }
    ],
    total: 585,
    paymentMethod: 'COD',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    shippingAddress: {
      fullName: 'Meena Murugan',
      phone: '+91 97890 55443',
      addressLine1: 'Plot 7, Meyyanur Main Road',
      city: 'Salem',
      state: 'Tamil Nadu',
      postalCode: '636004'
    }
  }
];

export const getStoredOrders = () => {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn("Could not read orders from storage:", err.message);
  }
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(initialDemoOrders));
  } catch {
    // Ignore quota error
  }
  return initialDemoOrders;
};

export const saveStoredOrders = (orders) => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('orders_updated'));
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
      }
    } catch (err) {
      console.warn("Order saved to local database (backend offline):", err.message);
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
    try {
      const email = user?.email || (typeof localStorage !== 'undefined' ? localStorage.getItem('last_checkout_email') : '');
      const res = await api.get(`/orders/my-orders${email ? `?email=${encodeURIComponent(email)}` : ''}`);
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch {
      // Fallback
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
    try {
      const res = await api.get('/orders/admin/all');
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        saveStoredOrders(res.data);
        return res.data;
      }
    } catch (err) {
      console.warn("Backend admin orders unavailable, loading persistent store:", err.message);
    }
    return getStoredOrders();
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
