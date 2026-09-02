import express from 'express';
import {
  createCategory,
  getCategories,
  getAdminCategories,
  getCategoryBySlug,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategoryById);

// Admin-only routes
router.get('/admin/all', protect, adminOnly, getAdminCategories);
router.post('/', protect, adminOnly, createCategory);
router.put('/:id', protect, adminOnly, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

export default router;
