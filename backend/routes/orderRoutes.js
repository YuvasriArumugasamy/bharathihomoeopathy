import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAdminOrders,
  updateOrderStatus,
  updatePaymentStatus
} from '../controllers/orderController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Customer & Guest endpoints
router.post('/', optionalProtect, createOrder);
router.get('/my-orders', optionalProtect, getMyOrders);
router.get('/:id', optionalProtect, getOrderById);

// Admin endpoints
router.get('/admin/all', protect, adminOnly, getAdminOrders);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);
router.patch('/:id/payment-status', protect, adminOnly, updatePaymentStatus);

export default router;
