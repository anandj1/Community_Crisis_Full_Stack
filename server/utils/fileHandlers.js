export const handleUploadedFiles = (files) => {
  return files.map(file => ({
    type: file.mimetype.startsWith('image/') ? 'image' : 'video',
    url: `/uploads/${file.filename}`,
    filename: file.filename,
    contentType: file.mimetype
  }));
};