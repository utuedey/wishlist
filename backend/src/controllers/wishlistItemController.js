const WishlistItem = require('../models/WishlistItem');

// Retrieves all the Items in a wishlist
exports.GetAllWishlistItems = async (req, res) => {

    try {
        const item = await WishlistItem.find({
            wishlistId: req.params.wishlistId
        });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
}

// Add item to a wishlist
exports.AddWishlistItem = async (req, res) => {
    try {
        const {name, link, image } = req.body;

        const item = await WishlistItem.create({
            name, link, image, wishlistId: req.params.wishlistId
        });

        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

// Update an item in a wishlist
exports.UpdateWishlistItem = async (req, res) => {
    try {
        const item = await WishlistItem.findByIdAndUpdate(req.params.id, req.body,
            { new: true });

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Delete an item from a wishlist
exports.DeleteWishlistItem = async (req, res) => {
    try {

        await WishlistItem.findByIdAndDelete(req.params);
        res.status(200).json({ message: "Item deleted"});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
