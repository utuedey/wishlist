const express = require('express');
const router = express.Router();
const { upload } = require('../utils/cloudinary');
const sharp = require('sharp');

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Create thumbnail
    const thumbnailBuffer = await sharp(req.file.buffer)
      .resize(300, 300)
      .toBuffer();

    const thumbnailUpload = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${thumbnailBuffer.toString('base64')}`, 
      {
        folder: 'wishlist/thumbnails',
        transformation: [
          { width: 300, height: 300, crop: 'thumb' },
          { quality: 'auto' }
        ]
      }
    );

    res.json({
      success: true,
      imageUrl: req.file.path,
      thumbnailUrl: thumbnailUpload.secure_url
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Image upload failed',
      error: error.message 
    });
  }
});

module.exports = router;