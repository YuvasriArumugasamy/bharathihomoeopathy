import express from 'express';
import {
  createBrand,
  getBrands,
  getAdminBrands,
  updateBrand,
  deleteBrand
} from '../controllers/brandController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getBrands);

// Admin-only routes
router.get('/admin/all', protect, adminOnly, getAdminBrands);
router.post('/', protect, adminOnly, createBrand);
router.put('/:id', protect, adminOnly, updateBrand);
router.delete('/:id', protect, adminOnly, deleteBrand);

export default router;
