const express = require('express');
const { 
    createWishlist,
    getWishlist,
    deleteWishlist
} = require('../controllers/wishlistController');
const {verifyToken} = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/", verifyToken, createWishlist); 
router.get("/", verifyToken, getWishlist);
router.delete("/:id", verifyToken, deleteWishlist);

module.exports = router;