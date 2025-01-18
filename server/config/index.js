import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    secureCookies: process.env.SECURE_COOKIES === 'true',
  },
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/crisis-platform',
    options: {
      // Remove deprecated options
      autoIndex: true, // Build indexes
      maxPoolSize: 10, // Maintain up to 10 socket connections
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || '').split(','),
    maxFiles: parseInt(process.env.MAX_UPLOAD_FILES || '5', 10),
  },
  rateLimit: {
    windowMs: process.env.RATE_LIMIT_WINDOW || '15m',
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
};