const express = require('express');
const router = express.Router();
const { 
  getUploadConfig, 
  moderateImage,
  deleteImage
} = require('../utils/cloudinary');
const {verifyToken} = require('../middleware/authMiddleware');
const multer = require('multer');
const sharp = require('sharp');

// In-memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * GET /api/v1/uploads/config
 * Get upload configuration for client-side uploads
 */
router.get('/config', verifyToken, (req, res) => {
  try {
    const config = getUploadConfig(req.user.id);
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Config error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate upload config'
    });
  }
});

/**
 * POST /api/v1/uploads/complete
 * Complete the upload process after client-side upload
 */
router.post('/complete', verifyToken, async (req, res) => {
  try {
    const { publicId, version, signature } = req.body;
    
    // Verify signature
    const expectedSignature = cloudinary.utils.api_sign_request(
      { public_id: publicId, version },
      process.env.CLOUDINARY_API_SECRET
    );
    
    if (signature !== expectedSignature) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid signature' 
      });
    }

    // Moderate content
    await moderateImage(publicId);
    
    // Generate URLs with transformations
    const imageUrl = cloudinary.url(publicId, {
      quality: 'auto',
      fetch_format: 'auto',
      width: 1200,
      crop: 'limit'
    });
    
    const thumbnailUrl = cloudinary.url(publicId, {
      width: 300,
      height: 300,
      crop: 'thumb',
      quality: 'auto',
      fetch_format: 'auto'
    });
    
    res.json({
      success: true,
      data: {
        imageUrl,
        thumbnailUrl,
        publicId
      }
    });
    
  } catch (error) {
    console.error('Upload complete error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Upload processing failed'
    });
  }
});

/**
 * POST /api/v1/uploads
 * Server-side upload endpoint (fallback)
 */
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded' 
      });
    }

    // Process image with Sharp
    const processedImage = await sharp(req.file.buffer)
      .resize(1200, 1200, { 
        fit: 'inside', 
        withoutEnlargement: true 
      })
      .jpeg({ 
        quality: 80,
        progressive: true,
        force: false 
      })
      .png({
        quality: 80,
        progressive: true,
        force: false
      })
      .toBuffer();

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `wishlist/user_${req.user.id}`,
            moderation: 'aws_rek'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(processedImage);
    });

    // Moderate image
    await moderateImage(result.public_id);

    // Generate thumbnail URL
    const thumbnailUrl = cloudinary.url(result.public_id, {
      width: 300,
      height: 300,
      crop: 'thumb',
      quality: 'auto',
      fetch_format: 'auto'
    });

    res.json({
      success: true,
      data: {
        imageUrl: result.secure_url,
        thumbnailUrl,
        publicId: result.public_id
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Upload failed',
      error: error.message 
    });
  }
});

/**
 * DELETE /api/v1/uploads/:publicId
 * Delete an uploaded image
 */
router.delete('/:publicId', verifyToken, async (req, res) => {
  try {
    await deleteImage(req.params.publicId);
    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete image'
    });
  }
});

module.exports = router;