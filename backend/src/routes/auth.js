const express = require('express');
const {validateUserSignup, validateUserLogin} = require('../middleware/validator');
const { Signup, Login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', validateUserSignup, Signup);
router.post('/login', validateUserLogin, Login);

module.exports = router;
