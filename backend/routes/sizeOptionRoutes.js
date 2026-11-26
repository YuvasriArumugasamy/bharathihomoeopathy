import express from 'express';
import { createSizeOption, deleteSizeOption, getAdminSizeOptions, updateSizeOption } from '../controllers/sizeOptionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();
router.use(protect, adminOnly);
router.get('/admin/all', getAdminSizeOptions);
router.post('/', createSizeOption);
router.put('/:id', updateSizeOption);
router.delete('/:id', deleteSizeOption);

export default router;
