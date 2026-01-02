const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
});

const orderSchema = new mongoose.Schema({
    orderItems: [orderItemSchema],
    customerName: {
        type: String,
        required: true,
    },
    customerEmail: {
        type: String,
        required: true,
    },
    customerPhone: {
        type: String,
        required: true,
    },
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String },
        country: { type: String, default: 'Sri Lanka' },
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    paymentMethod: {
        type: String,
        default: 'Cash on Delivery',
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    isDelivered: {
        type: Boolean,
        default: false,
    },
    deliveredAt: {
        type: Date,
    },
    notes: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
