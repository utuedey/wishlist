require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

// Signup Route
exports.Signup = async (req, res) => {
  await Promise.all([
    body("name").notEmpty().withMessage("Name is required").run(req),
    body("email").isEmail().withMessage("Invalid email").run(req),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters").run(req),
  ]);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });

  }
    const { name, email, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: "Email already in use" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });

      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

// Login Route
exports.Login = async (req, res) => {
  await Promise.all([
    body("email").isEmail().withMessage("Invalid email").run(req),
    body("password").notEmpty().withMessage("Password is required").run(req),
  ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      res.json({ message: "Login successful", user, token });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };

// Verify Token Endpoint
exports.verifyToken = async (req, res) => {

    // const authHeader = req.headers.authorization;
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            message: "Authorization header missing"
        });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
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
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};