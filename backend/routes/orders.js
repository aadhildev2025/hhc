const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Notification = require('../models/Notification');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/orders
// @desc    Get all orders (Admin)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};

        if (status) {
            query.status = status;
        }

        const orders = await Order.find(query)
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/orders/stats
// @desc    Get order statistics
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const shippedOrders = await Order.countDocuments({ status: 'shipped' });
        const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

        const revenueResult = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);

        const totalRevenue = revenueResult[0]?.total || 0;

        res.json({
            totalOrders,
            pendingOrders,
            shippedOrders,
            deliveredOrders,
            totalRevenue,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/orders
// @desc    Create a new order
// @access  Public
router.post('/', async (req, res) => {
    try {
        const {
            orderItems,
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            paymentMethod,
            notes,
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Calculate total price
        let totalPrice = 0;
        for (const item of orderItems) {
            totalPrice += item.price * item.quantity;
        }

        const order = await Order.create({
            orderItems,
            customerName,
            customerEmail,
            customerPhone,
            shippingAddress,
            totalPrice,
            paymentMethod: paymentMethod || 'Cash on Delivery',
            notes,
        });

        // Update product stock
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock = Math.max(0, product.stock - item.quantity);
                await product.save();
            }
        }

        // Create notification for admin
        await Notification.create({
            type: 'order',
            title: 'New Order Placed',
            message: `New order from ${customerName} for Rs. ${totalPrice.toLocaleString()}`,
            link: `/orders`, // Ideally link to specific order but /orders works for now
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = status;

            if (status === 'delivered') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/orders/:id
// @desc    Delete an order
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            await order.deleteOne();
            res.json({ message: 'Order removed' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
