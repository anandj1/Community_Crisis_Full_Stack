import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import path from 'path';

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI || 'mongodb://localhost:27017/crisis-platform',
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ['image/png', 'image/jpeg', 'image/jpg', 'video/mp4', 'video/quicktime'];

    if (!match.includes(file.mimetype)) {
      return null;
    }

    return {
      bucketName: 'uploads',
      filename: `${Date.now()}-${file.originalname}`
    };
  }
});

export const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|mp4|quicktime/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png) and videos (mp4, mov) are allowed!'));
  }
});