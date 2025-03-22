const express = require('express');
const { getNotifications } = require('../controllers/notificationController');
const {verifyToken} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, getNotifications);

module.exports = router;