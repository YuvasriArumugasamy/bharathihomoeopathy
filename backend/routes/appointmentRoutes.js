import express from 'express';
import {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus
} from '../controllers/appointmentController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Patient endpoints (support both logged-in users and guests)
router.post('/', optionalProtect, createAppointment);
router.get('/my', optionalProtect, getMyAppointments);

// Admin endpoints
router.get('/', protect, adminOnly, getAllAppointments);
router.patch('/:id/status', protect, adminOnly, updateAppointmentStatus);

export default router;
