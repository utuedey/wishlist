require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const logger = require("../logger/logger");

// Signup Route
exports.Signup = async (req, res) => {
  await Promise.all([
    body("name").notEmpty().withMessage("Name is required").run(req),
    body("email").isEmail().withMessage("Invalid email").run(req),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters").run(req),
  ]);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error("Validation errors", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
    const { name, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        logger.error('Email is already in use!')
        return res.status(400).json({ error: "Email already in use" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });

      await newUser.save();

      logger.info("User registered successfully");

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
      logger.error("Failed to register user!", error)
    }
  };

// Login Route
exports.Login = async (req, res) => {
  await Promise.all([
    body("email").isEmail().withMessage("Invalid email").run(req),
    body("password").notEmpty().withMessage("Password is required").run(req),
  ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Login: Validation error", errors.array())
      return res.status(400).json({ errors: errors.array() })
    };
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        logger.error("Login: User not found")
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        logger.error("Login: Password does not match")
        return res.status(401).json({ error: "Invalid credentials" });
      }
      // Generate JWT token
      const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      logger.info("User login successful");
      res.json({ message: "Login successful", user, token });
    } catch (error) {
      logger.error("Login: Failed to login user!", error)
      res.status(500).json({ error: "Server error" });
      
    }
  };

// Verify Token Endpoint
exports.verifyToken = async (req, res) => {

    // const authHeader = req.headers.authorization;
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")){
      logger.error("Authorization header is missing!")
        return res.status(401).json({
            message: "Authorization header missing"
        });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        logger.error("Token is missing!")
        return res.status(403).json({
            message: "Token is missing"
        });
        
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        res.status(200).json({
          message: "User verified successfully",
          user: req.user
        })
        logger.info("User is verified!")
    } catch (error) {
      logger.error("Failed to validate token!", error)
      return res.status(401).json({
            message: "Invalid token"
        });
        
    }
};