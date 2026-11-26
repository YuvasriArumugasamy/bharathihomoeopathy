import express from 'express';
import { createRazorpayOrder, verifyPayment } from '../controllers/paymentController.js';
import { getRazorpayKeyId } from '../config/razorpay.js';

const router = express.Router();

// Public config endpoint returning the public Razorpay Key ID
router.get('/razorpay/config', (req, res) => {
  res.status(200).json({
    success: true,
    keyId: getRazorpayKeyId()
  });
});

// Order creation & payment verification
router.post('/razorpay/order', createRazorpayOrder);
router.post('/razorpay/verify', verifyPayment);

export default router;
