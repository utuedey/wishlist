const express = require('express');
const { 
    GetAllWishlistItems,
    AddWishlistItem,
    UpdateWishlistItem,
    DeleteWishlistItem } = require('../controllers/wishlistItemController');
const {verifyToken} = require('../middleware/authMiddleware');

const router = express.Router();

router.get("/:wishlistId", verifyToken, GetAllWishlistItems);
router.post("/:wishlistId", verifyToken, AddWishlistItem); 
// router.get("/wishlist/:id", GetWishlistItem);
router.put("/:id", verifyToken, UpdateWishlistItem);
router.delete("/:id", verifyToken, DeleteWishlistItem);

module.exports = router;