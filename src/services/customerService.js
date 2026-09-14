import { api } from '../utils/api';

const CUSTOMERS_STORAGE_KEY = 'admin_customers_store';

const initialDemoCustomers = [];

export const getStoredCustomers = () => {
  try {
    const raw = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Strip out legacy mock/demo customers
        const cleaned = parsed.filter(cust => 
          cust?.id !== 'cust-101' && 
          cust?.id !== 'cust-102' && 
          cust?.id !== 'cust-103' &&
          cust?.customerId !== 'PAT-1001' &&
          cust?.customerId !== 'PAT-1002' &&
          cust?.customerId !== 'PAT-1003'
        );
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(cleaned));
        }
        return cleaned;
      }
    }
  } catch (err) {
    console.warn("Could not read customers from storage:", err.message);
  }
  return [];
};

export const saveStoredCustomers = (customers) => {
  try {
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  } catch (err) {
    console.warn("Could not save customers to storage:", err.message);
  }
};

export const customerService = {
  getAdminCustomers: async () => {
    try {
      const res = await api.get('/customers');
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        saveStoredCustomers(res.data);
        return res.data;
      }
    } catch {
      // Fallback
    }
    return getStoredCustomers();
  },

  syncCustomer: async (userData, orderAmount = 0) => {
    if (!userData || (!userData.email && !userData.phone)) return;
    const customers = getStoredCustomers();
    const email = (userData.email || '').toLowerCase().trim();
    const phone = (userData.phone || '').trim();

    const existingIdx = customers.findIndex(c => 
      (email && c.email.toLowerCase() === email) || 
      (phone && c.phone === phone)
    );

    let customerPayload;

    if (existingIdx >= 0) {
      const existing = customers[existingIdx];
      customerPayload = {
        ...existing,
        ordersCount: (existing.ordersCount || 0) + (orderAmount > 0 ? 1 : 0),
        totalSpent: (existing.totalSpent || 0) + (Number(orderAmount) || 0)
      };
      customers[existingIdx] = customerPayload;
    } else {
      const names = (userData.name || userData.fullName || 'Patient').split(' ');
      customerPayload = {
        id: 'cust-' + Date.now(),
        customerId: 'PAT-' + Math.floor(1000 + Math.random() * 9000),
        firstName: names[0] || 'Patient',
        lastName: names.slice(1).join(' ') || '',
        email: userData.email || '',
        phone: userData.phone || '',
        city: userData.city || 'Tamil Nadu',
        state: userData.state || 'Tamil Nadu',
        ordersCount: orderAmount > 0 ? 1 : 0,
        totalSpent: Number(orderAmount) || 0,
        status: 'Active',
        joinedDate: new Date().toISOString().slice(0, 10)
      };
      customers.unshift(customerPayload);
    }

    saveStoredCustomers(customers);

    try {
      await api.post('/customers', customerPayload);
    } catch {
      // Fallback
    }
  },

  toggleBlockCustomer: async (id) => {
    let newStatus = 'Active';
    const customers = getStoredCustomers().map(c => {
      if (c.id === id || c._id === id || c.customerId === id) {
        newStatus = c.status === 'Active' ? 'Inactive' : 'Active';
        return { ...c, status: newStatus };
      }
      return c;
    });
    saveStoredCustomers(customers);

    try {
      await api.patch(`/customers/${id}/status`, { status: newStatus });
    } catch {
      // Fallback
    }

    return { success: true };
  }
};

export default customerService;
