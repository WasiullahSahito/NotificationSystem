const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateEmail, validatePhone } = require('../utils/validators');

// Register a new user
const register = async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'Username, email, and password are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                message: 'Please provide a valid email address'
            });
        }

        if (phone && !validatePhone(phone)) {
            return res.status(400).json({
                message: 'Please provide a valid phone number'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email or username'
            });
        }

        // Create user
        const user = new User({
            username,
            email,
            password,
            ...(phone && { phone })
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        // Find user and check password
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get current user profile
const getProfile = async (req, res) => {
    try {
        res.json({
            user: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                phone: req.user.phone
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    register,
    login,
    getProfile
};