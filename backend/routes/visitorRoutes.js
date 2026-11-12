import express from 'express';
import { trackVisit, getVisitorStats } from '../controllers/visitorController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public anonymous tracking endpoint
router.post('/track', trackVisit);

// Admin analytics endpoint
router.get('/stats', optionalProtect, getVisitorStats);

export default router;

