import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAdminOrders,
  updateOrderStatus,
  updatePaymentStatus
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect);

// Customer endpoints
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);

// Admin endpoints
router.get('/admin/all', adminOnly, getAdminOrders);
router.patch('/:id/status', adminOnly, updateOrderStatus);
router.patch('/:id/payment-status', adminOnly, updatePaymentStatus);

export default router;
