import express from 'express';
import {
  getReviews,
  createReview,
  updateReviewStatus,
  deleteReview
} from '../controllers/reviewController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', getReviews);
router.post('/', optionalProtect, createReview);

router.patch('/:id/status', protect, adminOnly, updateReviewStatus);
router.delete('/:id', protect, adminOnly, deleteReview);

export default router;
