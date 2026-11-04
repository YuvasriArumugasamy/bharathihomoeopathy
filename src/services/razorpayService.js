const API_BASE = (import.meta.env.VITE_RAZORPAY_API_URL || '').replace(/\/$/, '');

const loadCheckout = () => new Promise((resolve, reject) => {
  if (window.Razorpay) return resolve();
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => resolve();
  script.onerror = () => reject(new Error('Could not load Razorpay Checkout. Please try again.'));
  document.head.appendChild(script);
});

const post = async (path, body) => {
  if (!API_BASE) throw new Error('Razorpay payment backend is not configured yet.');
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Payment service request failed.');
  return data;
};

export const openRazorpayCheckout = async ({ amount, currency = 'INR', customer, items, country, state, couponCode }) => {
  if (!Number.isSafeInteger(amount) || amount <= 0) throw new Error('Invalid payment amount.');
  await loadCheckout();
  const order = await post('/api/payments/create-order', { amount, currency, items, country, state, couponCode });
  if (order.amount !== amount) {
    throw new Error('Cart total changed or could not be confirmed. Please refresh checkout and try again.');
  }

  return new Promise((resolve, reject) => {
    const checkout = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'Dr. Bharathi’s Homeo Care',
      description: 'Product order payment',
      order_id: order.id,
      prefill: customer,
      theme: { color: '#f97316' },
      modal: { ondismiss: () => reject(new Error('Payment was cancelled.')) },
      handler: async (response) => {
        try {
          await post('/api/payments/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });
          resolve({ paymentId: response.razorpay_payment_id, orderId: response.razorpay_order_id });
        } catch (error) {
          reject(error);
        }
      }
    });
    checkout.on('payment.failed', (event) => reject(new Error(event.error?.description || 'Payment failed.')));
    checkout.open();
  });
};
