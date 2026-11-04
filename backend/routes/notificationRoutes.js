import express from 'express';
import {
  saveFcmToken,
  sendNotification,
  getNotifications,
  markNotificationRead,
  deleteNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public: save FCM token from any browser
router.post('/fcm-token', saveFcmToken);

// Admin only: notification management
router.get('/', protect, adminOnly, getNotifications);
router.patch('/:id/read', protect, adminOnly, markNotificationRead);
router.delete('/:id', protect, adminOnly, deleteNotification);

// Admin only: send manual push notification
router.post('/send', protect, adminOnly, sendNotification);

export default router;
