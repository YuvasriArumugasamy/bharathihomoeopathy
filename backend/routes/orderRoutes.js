import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAdminOrders,
  updateOrderStatus,
  updatePaymentStatus,
  clearAllOrders,
  deleteOrder,
  cancelMyOrder
} from '../controllers/orderController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Customer & Guest endpoints
router.post('/', optionalProtect, createOrder);
router.get('/', protect, adminOnly, getAdminOrders);
router.get('/my-orders', optionalProtect, getMyOrders);
router.patch('/my-orders/:id/cancel', protect, cancelMyOrder);
router.get('/:id', optionalProtect, getOrderById);

// Admin endpoints
router.get('/admin/all', protect, adminOnly, getAdminOrders);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);
router.patch('/:id/payment-status', protect, adminOnly, updatePaymentStatus);
router.delete('/admin/clear-all', protect, adminOnly, clearAllOrders);
router.delete('/:id', protect, adminOnly, deleteOrder);

export default router;
