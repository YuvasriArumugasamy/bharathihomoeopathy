import express from 'express';
import { createRazorpayOrder, verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

// Public config endpoint returning the public Razorpay Key ID
router.get('/razorpay/config', (req, res) => {
  res.status(200).json({
    success: true,
    keyId: process.env.RAZORPAY_KEY_ID || ''
  });
});

// Order creation & payment verification
router.post('/razorpay/order', createRazorpayOrder);
router.post('/razorpay/verify', verifyPayment);

export default router;
