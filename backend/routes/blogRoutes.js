import express from 'express';
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', optionalProtect, getBlogs);
router.get('/:slug', optionalProtect, getBlogBySlug);

router.post('/', protect, adminOnly, createBlog);
router.put('/:id', protect, adminOnly, updateBlog);
router.delete('/:id', protect, adminOnly, deleteBlog);

export default router;
