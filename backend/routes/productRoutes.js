import express from 'express';
import {
  createProduct,
  getProducts,
  getFeaturedProducts,
  getBestSellers,
  getProductBySlug,
  getProductById,
  getAdminProducts,
  updateProductStock,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/bestsellers', getBestSellers);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

// Admin-only routes
router.get('/admin/all', protect, adminOnly, getAdminProducts);
router.patch('/:id/stock', protect, adminOnly, updateProductStock);
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
