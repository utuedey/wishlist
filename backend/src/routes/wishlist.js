const express = require('express');
const { 
    createWishlist,
    getWishlist,
    deleteWishlist,
    shareWishlist
} = require('../controllers/wishlistController');
const {verifyToken} = require('../middleware/authMiddleware');
const router = express.Router();

router.post("/", verifyToken, createWishlist); 
router.get("/", verifyToken, getWishlist);
router.delete("/:id", verifyToken, deleteWishlist);
router.post("/share", verifyToken, shareWishlist);

module.exports = router;