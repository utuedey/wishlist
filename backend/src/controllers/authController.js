require('dotenv').config();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.Signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const {name, email, password} = req.body;

    try {
        // Check if the user already exits
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        // remove password before sending response
        const userResponse = { id: user._id, name: user.name, email: user.email };

        res.status(201).json({ message: 'User registered successfully', user: userResponse });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.Login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const {email, password} = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user){
            res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            res.status(400).json({
                status: false,
                message: "Incorrect password"
            })
        }
        const token = jwt.sign({ id: user._id}, JWT_SECRET_KEY, {expiresIn: "1h"});

        res.status(200).json({
            status: true,
            message: "User login successfull",
            token
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal server error", error
        })

    }
}