import express from 'express';
import { createCrisis, getAllCrises, getMyCrises, updateStatus } from '../controllers/crisisController.js';
import { upload } from '../utils/storage.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Create crisis
router.post('/', auth, upload.array('media', 5), createCrisis);

// Get all crises
router.get('/all', getAllCrises);

// Get user's crises
router.get('/my', auth, getMyCrises);

// Update crisis status (admin only)
router.patch('/:id/status', auth, updateStatus);

export default router;
