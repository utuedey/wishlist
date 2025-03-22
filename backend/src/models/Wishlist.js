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
	},
	sharedWith: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
},	{ timestamps: true});

module.exports = mongoose.model('Wishlist', WishlistSchema);