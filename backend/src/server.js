require('dotenv').config();
const express = require('express');
const authRoute = require('./routes/auth');
const connectToDB = require('./config/db');
const bodyParser = require('body-parser');
const wishlistRoute = require('./routes/wishlist');
const wishlistItemRoute = require('./routes/wishlistItem');
const notificationRoute = require('./routes/notification');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// API ROUTES
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/wishlist', wishlistRoute);
app.use('/api/v1/wishlist-item', wishlistItemRoute);
app.use('/api/v1/notification', notificationRoute);

// Test route
app.get('/', (req, res) => {
    res.send("Welcome to the API")
});

const PORT = process.env.PORT || 3060

connectToDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening on localhost:${PORT}`)
    });
}).catch((error) => {
    console.log("Database connection failed!", error)
});

module.exports = app;