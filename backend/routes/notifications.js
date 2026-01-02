const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get unread count
// @route   GET /api/notifications/unread-count
// @access  Private/Admin
router.get('/unread-count', protect, admin, async (req, res) => {
    try {
        const count = await Notification.countDocuments({ isRead: false });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private/Admin
router.put('/:id/read', protect, admin, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (notification) {
            notification.isRead = true;
            await notification.save();
            res.json({ message: 'Notification marked as read' });
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Mark all as read
// @route   PUT /api/notifications/read-all
// @access  Private/Admin
router.put('/read-all', protect, admin, async (req, res) => {
    try {
        await Notification.updateMany({ isRead: false }, { isRead: true });
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (notification) {
            await notification.deleteOne();
            res.json({ message: 'Notification removed' });
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
