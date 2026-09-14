import express from 'express';
import {
  getCustomers,
  createOrUpdateCustomer,
  updateCustomerStatus
} from '../controllers/customerController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', protect, adminOnly, getCustomers);
router.post('/', optionalProtect, createOrUpdateCustomer);
router.patch('/:id/status', protect, adminOnly, updateCustomerStatus);

export default router;
