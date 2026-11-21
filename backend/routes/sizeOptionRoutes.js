import express from 'express';
import { createSizeOption, deleteSizeOption, getAdminSizeOptions } from '../controllers/sizeOptionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();
router.use(protect, adminOnly);
router.get('/admin/all', getAdminSizeOptions);
router.post('/', createSizeOption);
router.delete('/:id', deleteSizeOption);

export default router;
