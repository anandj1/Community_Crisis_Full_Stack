import express from 'express';
import { upload } from '../utils/storage.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, upload.array('media', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const files = req.files.map(file => ({
      type: file.mimetype.startsWith('image/') ? 'image' : 'video',
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      contentType: file.mimetype
    }));

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading files', error: error.message });
  }
});

export default router;