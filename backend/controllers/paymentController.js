import crypto from 'crypto';
import { razorpayInstance } from '../config/razorpay.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import { validateCreatePaymentOrder, validateVerifyPayment } from '../validators/paymentValidator.js';

export const createRazorpayOrder = async (req, res, next) => {
  try {
    if (!razorpayInstance || !process.env.RAZORPAY_KEY_ID) {
      return res.status(503).json({ success: false, message: 'Razorpay credentials are not configured on the server.' });
    }
    const { isValid, errors } = validateCreatePaymentOrder(req.body);
    if (!isValid) return res.status(400).json({ success: false, message: errors.join(', ') });

    const { orderId, amount, currency = 'INR', receipt } = req.body;
    let amountInPaise = 0;
    let orderNumber = receipt || `dhc_${Date.now()}`;
    let existingOrder = null;

    if (orderId) {
      existingOrder = await Order.findById(orderId);
      if (!existingOrder) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      if (existingOrder.paymentStatus === 'paid') {
        return res.status(400).json({ success: false, message: 'Order is already paid' });
      }
      amountInPaise = Math.round(existingOrder.totalAmount * 100);
      orderNumber = existingOrder.orderNumber;
    } else {
      amountInPaise = Math.round(Number(amount));
    }

    if (amountInPaise < 100) {
      return res.status(400).json({ success: false, message: 'Payment amount must be at least ₹1.00' });
    }

    const options = {
      amount: amountInPaise,
      currency: currency || 'INR',
      receipt: String(orderNumber).slice(0, 40),
      payment_capture: 1
    };

    const rzpOrder = await razorpayInstance.orders.create(options);

    // Save payment record if order exists
    if (existingOrder) {
      await Payment.create({
        order: existingOrder._id,
        user: req.user ? req.user._id : existingOrder.user || null,
        razorpayOrderId: rzpOrder.id,
        amount: existingOrder.totalAmount,
        currency: currency || 'INR',
        status: 'created'
      });
      existingOrder.razorpayOrderId = rzpOrder.id;
      await existingOrder.save();
    }

    res.status(200).json({
      success: true,
      data: {
        id: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        orderNumber,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { isValid, errors } = validateVerifyPayment(req.body);
    if (!isValid) return res.status(400).json({ success: false, message: errors.join(', ') });

    const razorpay_order_id = req.body.razorpay_order_id || req.body.orderId;
    const razorpay_payment_id = req.body.razorpay_payment_id || req.body.paymentId;
    const razorpay_signature = req.body.razorpay_signature || req.body.signature;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ success: false, message: 'Razorpay secret is not configured on the server.' });
    }

    if (razorpay_signature) {
      const secret = process.env.RAZORPAY_KEY_SECRET;
      const body = razorpay_order_id + '|' + razorpay_payment_id;

      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body.toString())
        .digest();
      const suppliedSignature = Buffer.from(razorpay_signature, 'hex');
      const isAuthentic = expectedSignature.length === suppliedSignature.length &&
        crypto.timingSafeEqual(expectedSignature, suppliedSignature);

      if (!isAuthentic) {
        return res.status(400).json({ success: false, message: 'Payment verification failed: Signature mismatch' });
      }
    }

    // Update records if found in DB
    try {
      if (razorpay_order_id) {
        const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
        if (payment) {
          payment.razorpayPaymentId = razorpay_payment_id;
          payment.razorpaySignature = razorpay_signature || '';
          payment.status = 'captured';
          await payment.save();
        }

        const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
        if (order) {
          order.paymentStatus = 'paid';
          order.orderStatus = 'confirmed';
          order.razorpayPaymentId = razorpay_payment_id;
          await order.save();
        }
      }
    } catch (dbErr) {
      console.warn('DB record update notice on payment verify:', dbErr.message);
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified and captured successfully',
      data: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        paymentStatus: 'paid'
      }
    });
  } catch (error) {
    next(error);
  }
};
