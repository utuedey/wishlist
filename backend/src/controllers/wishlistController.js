const Wishlist = require('../models/wishlist');

// create a new wishlist
exports.createWishlist = async (req, res) => {
    try {
        const { name } = req.body;
        const wishlist = await Wishlist.create({
            name,
            userId: req.user.id
        });
        res.status(201).json(wishlist);
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })

    }
}

// Get a wishlist
exports.getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.find({ userId: req.user.id});
        res.status(200).json(wishlist);
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

// Delete a wishlist
exports.deleteWishlist = async (req, res) => {
    try {
        await Wishlist.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Wishlist deleted"
        })
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}