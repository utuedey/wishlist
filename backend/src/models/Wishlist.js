const mongoose = require('mongoose');

const WishlistSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
    userId: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
		required: true
	}
},	{ timestamps: true});

module.exports = mongoose.model('Wishlist', WishlistSchema);