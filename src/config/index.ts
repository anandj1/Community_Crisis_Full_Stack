export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  },
  upload: {
    maxFiles: parseInt(import.meta.env.VITE_MAX_UPLOAD_FILES || '5', 10),
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', 'video/quicktime'],
    maxFileSize: 10 * 1024 * 1024, // 10MB in bytes
  },
};