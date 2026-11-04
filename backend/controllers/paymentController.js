import crypto from 'crypto';
import { razorpayInstance } from '../config/razorpay.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import { validateCreatePaymentOrder, validateVerifyPayment } from '../validators/paymentValidator.js';

export const createRazorpayOrder = async (req, res, next) => {
  try {
    if (!razorpayInstance || !process.env.RAZORPAY_KEY_ID) {
      return res.status(503).json({ success: false, message: 'Razorpay live credentials are not configured.' });
    }
    const { isValid, errors } = validateCreatePaymentOrder(req.body);
    if (!isValid) return res.status(400).json({ success: false, message: errors.join(', ') });

    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Order is already paid' });
    }

    // Convert amount to paise for Razorpay
    const amountInPaise = Math.round(order.totalAmount * 100);

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: order.orderNumber,
      payment_capture: 1
    };

    const rzpOrder = await razorpayInstance.orders.create(options);

    // Save initial payment record
    await Payment.create({
      order: order._id,
      user: req.user._id,
      razorpayOrderId: rzpOrder.id,
      amount: order.totalAmount,
      currency: 'INR',
      status: 'created'
    });

    order.razorpayOrderId = rzpOrder.id;
    await order.save();

    res.status(200).json({
      success: true,
      data: {
        id: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        orderNumber: order.orderNumber,
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

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpayInstance || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ success: false, message: 'Razorpay live credentials are not configured.' });
    }
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
      const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
      if (payment) {
        payment.status = 'failed';
        payment.failureReason = 'Signature mismatch';
        await payment.save();
      }
      return res.status(400).json({ success: false, message: 'Payment verification failed: Signature mismatch' });
    }

    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment || !order) {
      return res.status(404).json({ success: false, message: 'Payment order was not found.' });
    }

    const [razorpayPayment, razorpayOrder] = await Promise.all([
      razorpayInstance.payments.fetch(razorpay_payment_id),
      razorpayInstance.orders.fetch(razorpay_order_id)
    ]);
    if (razorpayPayment.order_id !== razorpay_order_id ||
        razorpayPayment.status !== 'captured' ||
        razorpayPayment.amount !== razorpayOrder.amount ||
        razorpayPayment.amount !== Math.round(payment.amount * 100) ||
        razorpayPayment.currency !== 'INR') {
      return res.status(400).json({ success: false, message: 'Payment is not captured for the expected amount.' });
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = 'captured';
    await payment.save();

    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified and captured successfully',
      data: {
        orderId: order ? order._id : null,
        orderNumber: order ? order.orderNumber : null,
        paymentStatus: 'paid'
      }
    });
  } catch (error) {
    next(error);
  }
};
