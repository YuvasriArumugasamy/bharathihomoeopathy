import express from 'express';
import { createRazorpayOrder, getAdminPaymentRecords, verifyPayment } from '../controllers/paymentController.js';
import { getRazorpayKeyId } from '../config/razorpay.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/admin/all', protect, adminOnly, getAdminPaymentRecords);

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
