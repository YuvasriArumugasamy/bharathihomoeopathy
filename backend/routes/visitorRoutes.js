import express from 'express';
import { trackVisit, getVisitorStats } from '../controllers/visitorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public anonymous tracking endpoint
router.post('/track', trackVisit);

// Admin analytics endpoint
router.get('/stats', protect, adminOnly, getVisitorStats);

export default router;

