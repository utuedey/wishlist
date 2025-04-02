const express = require("express");
const { Signup, Login, verifyToken } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/verify-token", verifyToken);

module.exports = router;