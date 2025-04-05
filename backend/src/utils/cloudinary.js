require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Generates upload signature for secure uploads
 */
const generateSignature = (folder, publicId) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
      public_id: publicId,
    },
    process.env.CLOUDINARY_API_SECRET
  );
  return { timestamp, signature };
};

/**
 * Gets upload configuration for client-side uploads
 */
const getUploadConfig = (userId) => {
  const folder = `wishlist/user_${userId}`;
  const publicId = `img_${Date.now()}`;
  const { timestamp, signature } = generateSignature(folder, publicId);
  
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    signature,
    folder,
    publicId,
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET
  };
};

/**
 * Moderates an uploaded image
 */
const moderateImage = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      moderation: 'aws_rek' // Using AWS Rekognition
    });
    
    if (result.moderation?.[0]?.status === 'rejected') {
      await cloudinary.uploader.destroy(publicId);
      throw new Error('Image rejected by moderation');
    }
    
    return true;
  } catch (error) {
    console.error('Moderation error:', error);
    throw error;
  }
};

/**
 * Deletes an image from Cloudinary
 */
const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  getUploadConfig,
  moderateImage,
  deleteImage
};