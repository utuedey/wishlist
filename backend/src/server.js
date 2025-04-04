require('dotenv').config();
const express = require('express');
const authRoute = require('./routes/auth');
const connectToDB = require('./config/db');
const bodyParser = require('body-parser');
const wishlistRoute = require('./routes/wishlist');
const wishlistItemRoute = require('./routes/wishlistItem');
const notificationRoute = require('./routes/notification');
const cors = require('cors');
const logger = require('./logger/logger');
const uploadRoutes = require('./routes/uploads');

const app = express();

// Middlewares
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// API ROUTES
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/wishlist', wishlistRoute);
app.use('/api/v1/wishlist-item', wishlistItemRoute);
app.use('/api/v1/notification', notificationRoute);
app.use('/api/v1/upload', uploadRoutes);

// Test route
app.get('/', (req, res) => {
    res.send("Welcome to the API")
});

const PORT = process.env.PORT || 3060

connectToDB().then(() => {
    app.listen(PORT, () => {
        logger.info(`Server is listening on localhost:${PORT}`);
    });
}).catch((error) => {
    logger.error("Database connection failed!", error);
});

module.exports = app;