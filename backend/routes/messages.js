const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const { protect, admin } = require('../middleware/auth');

// @desc    Submit a contact message
// @route   POST /api/messages
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const newMessage = await Message.create({
            name,
            email,
            subject,
            message,
        });

        // Create notification for admin
        await Notification.create({
            type: 'message',
            title: 'New Contact Message',
            message: `New message from ${name}: ${subject}`,
            link: `/messages`,
        });

        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        console.error('Error submitting message:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update message status
// @route   PUT /api/messages/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        message.status = req.body.status || message.status;
        const updatedMessage = await message.save();

        res.json(updatedMessage);
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        await message.deleteOne();
        res.json({ message: 'Message removed' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
