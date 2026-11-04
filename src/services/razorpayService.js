/**
 * Razorpay Payment Integration Service for Dr. Bharathi’s Homeo Care
 * Supports live and test keys, dynamic SDK loading, optional backend order sync,
 * and seamless fallback to client-side standard checkout.
 */
import { api } from '../utils/api';
import { initialAdminSettings } from '../data/adminSettingsData';

// Default clinic Live Razorpay Key
const DEFAULT_RAZORPAY_KEY = 'rzp_live_Tw8hB0htwnbX8p';

/**
 * Loads Razorpay Standard Checkout SDK dynamically
 */
export const loadRazorpayCheckout = () => new Promise((resolve, reject) => {
  if (typeof window !== 'undefined' && window.Razorpay) {
    return resolve(true);
  }
  const existing = document.querySelector('script[src*="checkout.razorpay.com"]');
  if (existing) {
    existing.addEventListener('load', () => resolve(true));
    existing.addEventListener('error', () => reject(new Error('Failed to load Razorpay Checkout SDK.')));
    return;
  }
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  script.onload = () => resolve(true);
  script.onerror = () => reject(new Error('Could not load Razorpay payment gateway. Please check your internet connection.'));
  document.head.appendChild(script);
});

/**
 * Retrieves Razorpay Key ID from Vite env or Admin Settings store
 */
export const getRazorpayKey = () => {
  // 1. Check Vite env variable (Vercel / .env)
  const envKey = import.meta.env?.VITE_RAZORPAY_KEY_ID?.trim();
  if (envKey) return envKey;

  // 2. Check Admin Clinic Settings from localStorage
  try {
    const raw = localStorage.getItem('admin_clinic_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.payments?.razorpayKeyId?.trim()) {
        return parsed.payments.razorpayKeyId.trim();
      }
    }
  } catch {}

  // 3. Check Initial Admin Settings
  if (initialAdminSettings?.payments?.razorpayKeyId?.trim()) {
    return initialAdminSettings.payments.razorpayKeyId.trim();
  }

  // 4. Default Live Clinic Key
  return DEFAULT_RAZORPAY_KEY;
};

/**
 * Opens official Razorpay Checkout popup for user payment
 *
 * @param {Object} options
 * @param {number} options.amount - Total amount in paise (₹100 = 10000 paise)
 * @param {string} [options.currency='INR'] - Currency code
 * @param {Object} [options.customer] - Customer details { name, email, contact }
 * @param {Object} [options.notes] - Key-value metadata notes for Razorpay dashboard
 */
export const openRazorpayCheckout = async ({
  amount,
  currency = 'INR',
  customer = {},
  notes = {}
}) => {
  const amountInPaise = Math.round(Number(amount));
  if (!amountInPaise || isNaN(amountInPaise) || amountInPaise < 100) {
    throw new Error('Payment amount must be at least ₹1.00');
  }

  // Load checkout SDK
  await loadRazorpayCheckout();

  let keyId = getRazorpayKey();
  let backendOrderId = null;

  // Attempt backend order generation if backend is reachable
  try {
    const res = await api.post('/payments/razorpay/order', {
      amount: amountInPaise,
      currency,
      receipt: `dhc_${Date.now()}`
    });
    if (res?.data?.id) {
      backendOrderId = res.data.id;
    }
    if (res?.data?.key && !keyId) {
      keyId = res.data.key;
    }
  } catch (err) {
    // If backend endpoint is offline or credentials not set on server,
    // gracefully fall back to direct standard checkout with frontend key
    console.warn('Backend Razorpay order creation skipped, using direct checkout:', err?.message || err);
  }

  if (!keyId) {
    throw new Error(
      'Razorpay Key ID is not configured. Please add your Razorpay Key ID in Admin Settings > Payment Gateways or in the .env file.'
    );
  }

  return new Promise((resolve, reject) => {
    const options = {
      key: keyId,
      amount: amountInPaise,
      currency,
      name: 'Dr. Bharathi’s Homeo Care',
      description: 'Homeopathic Medicine & Care Order',
      image: '/logo.png',
      ...(backendOrderId ? { order_id: backendOrderId } : {}),
      prefill: {
        name: customer.name || '',
        email: customer.email || '',
        contact: customer.contact || customer.phone || ''
      },
      notes: {
        platform: "Dr. Bharathi's Homeo Care Web",
        ...notes
      },
      theme: {
        color: '#0d9488'
      },
      modal: {
        ondismiss: () => {
          reject(new Error('Payment was cancelled.'));
        }
      },
      handler: async (response) => {
        try {
          // If a backend order exists, notify backend verification
          if (backendOrderId && response?.razorpay_signature) {
            try {
              await api.post('/payments/razorpay/verify', {
                razorpay_order_id: response.razorpay_order_id || backendOrderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });
            } catch (vErr) {
              console.warn('Backend payment verification log:', vErr?.message || vErr);
            }
          }

          resolve({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id || backendOrderId || `order_${Date.now()}`,
            signature: response.razorpay_signature || ''
          });
        } catch (error) {
          reject(error);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (event) => {
      reject(new Error(event?.error?.description || 'Payment was declined. Please try again.'));
    });
    rzp.open();
  });
};
