import express from 'express';

import { upload } from '../utils/storage.js';

import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, upload.array('media', 5), async (req, res) => {
  try {
    const files = req.files.map(file => ({
      type: file.mimetype.startsWith('image/') ? 'image' : 'video',
      url: file.path,
      public_id: file.filename
    }));

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading files', error: error.message });
  }
});

export default router;