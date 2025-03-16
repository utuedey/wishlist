const mongoose = require('mongoose');

const WishlistItemSchema = new mongoose.Schema({
    name: {
		type: String,
		required: true
	},
    link: {
		type: String
	},
	image: {
		type: String,
	},
	purchased: {
		type: Boolean,
		default: false
	},
	wishlistId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Wishlist',
		required: true
	}},
	{ timestamps: true }
)

module.exports = mongoose.model('WishlistItem', WishlistItemSchema);
