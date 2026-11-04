import express from 'express';
import {
  createPrescription,
  getMyPrescriptions,
  getAllPrescriptions,
  getPrescriptionById
} from '../controllers/prescriptionController.js';
import { protect, optionalProtect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Patient endpoints
router.get('/my', optionalProtect, getMyPrescriptions);
router.get('/:id', optionalProtect, getPrescriptionById);

// Admin / Clinic Doctor endpoints
router.get('/', protect, adminOnly, getAllPrescriptions);
router.post('/', protect, adminOnly, createPrescription);

export default router;
