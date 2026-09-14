import express from 'express';
import {
  submitEnquiry,
  getEnquiries,
  updateEnquiryStatus,
  replyToEnquiry
} from '../controllers/enquiryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public submission
router.post('/', submitEnquiry);

// Admin management
router.get('/', protect, adminOnly, getEnquiries);
router.patch('/:id/status', protect, adminOnly, updateEnquiryStatus);
router.post('/:id/reply', protect, adminOnly, replyToEnquiry);

export default router;
