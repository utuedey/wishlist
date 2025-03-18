const express = require('express');
const { getNotifications } = require('../controllers/notificationController');
const {verifyToken} = require('../middlewares/auth');

const router = express.Router();

router.get('/', verifyToken, getNotifications);

module.exports = router;