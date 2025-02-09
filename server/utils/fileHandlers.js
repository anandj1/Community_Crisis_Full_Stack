import cloudinary from 'cloudinary';

export const handleUploadedFiles = async (files) => {
  const uploadResults = await Promise.all(
    files.map(file => 
      cloudinary.v2.uploader.upload(file.path, {
        resource_type: 'auto',
        folder: 'Crisis'
      })
    )
  );

  return uploadResults.map(result => ({
    type: result.resource_type,
    url: result.secure_url,
    public_id: result.public_id,
    width: result.width,
    height: result.height
  }));
};