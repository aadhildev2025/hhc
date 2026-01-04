const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/register
// @desc    Register a new admin user
// @access  Public (should be restricted in production)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: 'admin',
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, upload.single('image'), async (req, res) => {
    try {
        console.log('Profile update for user:', req.user._id);
        const user = await User.findById(req.user._id);

        if (user) {
            console.log('Current user data:', { name: user.name, email: user.email });
            console.log('Update payload:', req.body);

            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.file) {
                console.log('New image file received:', req.file.filename);
                user.image = `/uploads/${req.file.filename}`;
            }

            console.log('Saving user...');
            const updatedUser = await user.save();
            console.log('User saved successfully');

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                image: updatedUser.image,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/auth/profile/password
// @desc    Update user password
// @access  Private
router.put('/profile/password', protect, async (req, res) => {
    try {
        console.log('Password update attempt for ID:', req.user._id);
        const user = await User.findById(req.user._id);

        if (user) {
            const { currentPassword, newPassword } = req.body;
            console.log('User found. Checking current password match...');

            // Check if current password matches
            const isMatch = await user.matchPassword(currentPassword);
            console.log('Password match result:', isMatch);

            if (isMatch) {
                user.password = newPassword;
                await user.save();
                console.log('Password updated successfully in DB');
                res.json({ message: 'Password updated successfully' });
            } else {
                console.warn('Current password does NOT match');
                res.status(401).json({ message: 'Invalid current password' });
            }
        } else {
            console.error('User not found during password update');
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('SERVER ERROR during password update:', error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/profile/password/verify
// @desc    Verify current password
// @access  Private
router.post('/profile/password/verify', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            const { password } = req.body;
            const isMatch = await user.matchPassword(password);
            res.json({ verified: isMatch });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
