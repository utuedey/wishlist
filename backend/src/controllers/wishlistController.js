const Wishlist = require('../models/wishlist');
const Notification = require('../models/notification');

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

// share wishlist
exports.shareWishlist = async (req, res) => {
    try {
        const { wishlistId } = req.body;
        const userId = req.user.id;
        const wishlist = await Wishlist.findById(wishlistId);
        if (!wishlist) {
            return res.status(404).json({
                message: "Wishlist not found"
            });
        }
        if (wishlist.userId.toString() !== req.user.id) {
            return res.status(401).json({
                message: "You are not authorized to share this wishlist"
            });
        }
        if (!wishlist.sharedWith.includes(userId)) {
            wishlist.sharedWith.push(userId);
        }
        await wishlist.save();
        
        // Create a notification
        const notification = new Notification({
            user: userId,
            message: `Wishlist ${wishlist.name} shared with you`
        });
        await notification.save();
        res.status(200).json({
            message: "Wishlist shared"
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
;}
