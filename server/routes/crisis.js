import express from 'express';
import { auth } from '../middleware/auth.js';
import { upload } from '../utils/storage.js';
import { crisisController } from '../controllers/crisis.controller.js';

const router = express.Router();

// Ensure all controller methods exist before adding routes
const {
  createCrisis,
  getAllCrises,
  getMyCrises,
  updateStatus
} = crisisController;

router.post('/', auth, upload.array('media', 5), createCrisis);
router.get('/all', auth, getAllCrises);
router.get('/my', auth, getMyCrises);
router.patch('/:id/status', auth, updateStatus);

export default router;