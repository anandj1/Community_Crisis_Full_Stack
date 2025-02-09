import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

// Ensure environment variables are properly loaded
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error('Missing CLOUDINARY_CLOUD_NAME environment variable');
}

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Generate a unique folder name using timestamp
    const timestamp = Date.now();
    return {
      folder: `crisis-reports/${timestamp}`,
      format: path.extname(file.originalname).toLowerCase().replace('.', ''),
      resource_type: 'auto',
      transformation: [{ quality: 'auto' }]
    };
  }
});

const upload = multer({
  storage,
  limits: { 
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|mp4|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png) and videos (mp4, mov) are allowed.'));
  }
});

export { upload };