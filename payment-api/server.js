import crypto from 'node:crypto';
import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';

const app = express();
const port = Number(process.env.PORT || 5001);
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;
const productApiUrl = (process.env.PRODUCT_API_URL || 'https://bharathihomoeopathy.onrender.com/api').replace(/\/$/, '');
const allowedOrigins = (process.env.CLIENT_URL || '').split(',').map((x) => x.trim()).filter(Boolean);
const shipping = {
  local: Number(process.env.SHIPPING_LOCAL_FEE || 22),
  domestic: Number(process.env.SHIPPING_DOMESTIC_FEE || 50),
  international: Number(process.env.SHIPPING_INTERNATIONAL_FEE || 250),
  freeThreshold: Number(process.env.FREE_SHIPPING_THRESHOLD || 1000)
};

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin) || /^http:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed'));
  }
}));
app.use(express.json({ limit: '32kb' }));

const getRazorpay = () => {
  if (!keyId || !keySecret) throw new Error('Razorpay live credentials are not configured on the server.');
  if (!keyId.startsWith('rzp_live_')) throw new Error('Configure a Razorpay live key ID for production payments.');
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

const calculateTrustedTotal = async ({ items, country = 'India', state = 'Tamil Nadu', couponCode = '' }) => {
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) throw new Error('Cart items are missing or invalid.');
  const normalizedItems = items.map((item) => {
    const quantity = Number(item?.quantity);
    if (typeof item?.id !== 'string' || !item.id.trim() || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
      throw new Error('A cart item is invalid. Please refresh your cart.');
    }
    return { id: item.id.trim(), quantity };
  });

  const pricedItems = await Promise.all(normalizedItems.map(async (item) => {
    const response = await fetch(`${productApiUrl}/products/${encodeURIComponent(item.id)}`, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Could not confirm a product price. Please try again later.');
    const body = await response.json();
    const product = body?.data?.product || body?.data || body?.product || body;
    const price = Number(product?.offerPrice || product?.regularPrice || product?.salePrice || product?.price);
    if (!Number.isFinite(price) || price <= 0 || product?.status === 'Inactive') throw new Error('A product is unavailable for purchase.');
    return { ...item, price };
  }));

  const subtotal = pricedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const code = String(couponCode || '').trim().toUpperCase();
  const defaults = {
    HOMECARE10: { minimum: 499, rate: 10, maximum: 200 },
    WELLNESS20: { minimum: 999, rate: 20, maximum: 500 },
    FLAT150: { minimum: 1200, fixed: 150 }
  };
  let discount = 0;
  if (code) {
    const coupon = defaults[code];
    if (!coupon || subtotal < coupon.minimum) throw new Error('This coupon is invalid or its minimum cart value is not met.');
    discount = coupon.fixed || Math.min(Math.round(subtotal * coupon.rate / 100), coupon.maximum);
  }

  let shippingFee = 0;
  if (subtotal > 0 && subtotal < shipping.freeThreshold) {
    if (String(country).trim().toLowerCase() !== 'india') shippingFee = shipping.international;
    else if (/tamil\s*nadu/i.test(String(state)) || String(state).trim().toLowerCase() === 'tn') shippingFee = shipping.local;
    else shippingFee = shipping.domestic;
  }
  const totalRupees = Math.max(0, Math.round((subtotal - discount + shippingFee + subtotal * 0.05) * 100) / 100);
  return { amount: Math.round(totalRupees * 100), items: pricedItems, subtotal, shippingFee, discount, totalRupees };
};

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { currency = 'INR' } = req.body || {};
    if (currency !== 'INR') {
      return res.status(400).json({ message: 'Only INR payments are supported.' });
    }
    const quote = await calculateTrustedTotal(req.body || {});
    if (quote.amount < 100) return res.status(400).json({ message: 'The payment amount must be at least ₹1.' });
    const order = await getRazorpay().orders.create({
      amount: quote.amount,
      currency,
      receipt: `dhc_${crypto.randomUUID().replaceAll('-', '').slice(0, 24)}`,
      notes: {
        source: 'Dr Bharathi Homeo Care website',
        subtotal_paise: String(Math.round(quote.subtotal * 100)),
        shipping_paise: String(Math.round(quote.shippingFee * 100)),
        discount_paise: String(Math.round(quote.discount * 100))
      }
    });
    return res.json({ id: order.id, amount: order.amount, currency: order.currency, keyId, quote: { subtotal: quote.subtotal, shipping: quote.shippingFee, discount: quote.discount, total: quote.totalRupees } });
  } catch (error) {
    console.error('Razorpay order creation failed:', error.message);
    return res.status(500).json({ message: 'Could not start payment. Please try again.' });
  }
});

app.post('/api/payments/verify', async (req, res) => {
  try {
    const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body || {};
    if (![orderId, paymentId, signature].every((value) => typeof value === 'string' && value.length > 0)) {
      return res.status(400).json({ message: 'Missing payment verification details.' });
    }
    const expected = crypto.createHmac('sha256', keySecret).update(`${orderId}|${paymentId}`).digest();
    const supplied = Buffer.from(signature, 'hex');
    if (expected.length !== supplied.length || !crypto.timingSafeEqual(expected, supplied)) {
      return res.status(400).json({ message: 'Payment signature verification failed.' });
    }
    const razorpay = getRazorpay();
    const [payment, order] = await Promise.all([razorpay.payments.fetch(paymentId), razorpay.orders.fetch(orderId)]);
    if (payment.order_id !== orderId || order.id !== orderId || payment.status !== 'captured' || payment.amount !== order.amount || payment.currency !== order.currency) {
      return res.status(400).json({ message: 'Payment is not captured for the expected order amount.' });
    }
    return res.json({ verified: true, paymentId, orderId, amount: payment.amount, currency: payment.currency });
  } catch (error) {
    console.error('Razorpay payment verification failed:', error.message);
    return res.status(500).json({ message: 'Could not verify payment. Please contact support before retrying.' });
  }
});

app.listen(port, () => console.log(`Razorpay payment API listening on ${port}`));
