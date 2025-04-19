const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage } = require('../utils/cloudinary');
const sharp = require('sharp');
const logger = require('../logger/logger')

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      logger.info('No file uploaded');
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Process image with Sharp
    const processedImage = await sharp(req.file.buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Upload to Cloudinary
    const result = await uploadImage(processedImage);

    logger.info('Image uploaded successfully');

    res.json({
      success: true,
      imageUrl: result.secure_url
    });
  } catch (error) {
    logger.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Upload failed',
      error: error.message 
    });
  }
});

module.exports = router;