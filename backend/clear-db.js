require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Message = require('./models/Message');
const Notification = require('./models/Notification');

const categories = [
    {
        name: 'Wall art',
        description: 'Artistic wall decorations and hangings',
        image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800',
    },
    {
        name: 'Planters',
        description: 'Handcrafted ceramic and wooden planters',
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800',
    },
    {
        name: 'Personalized Gifts',
        description: 'Unique custom-made gifts for your special moments',
        image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800',
    },
    {
        name: 'Event Decor',
        description: 'Handmade decorations for your special events and celebrations',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800',
    },
    {
        name: 'Home Decor',
        description: 'Beautiful handmade home decoration items',
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800',
    },
    {
        name: 'Candles',
        description: 'Scented hand-poured candles for a cozy atmosphere',
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800',
    },
];

const cleanupDatabase = async () => {
    try {
        console.log('🔄 Connecting to database for cleanup...');
        await connectDB();

        // 1. Clear Orders, Messages, and Notifications (The "Dynamic" data)
        await Order.deleteMany({});
        console.log('✅ All Orders cleared.');

        await Message.deleteMany({});
        console.log('✅ All Messages cleared.');

        await Notification.deleteMany({});
        console.log('✅ All Notifications cleared.');

        // 2. Clear Products (Sample items)
        await Product.deleteMany({});
        console.log('✅ All Sample Products cleared.');

        // 3. Reset Categories (Keep them as a foundation)
        await Category.deleteMany({});
        await Category.insertMany(categories);
        console.log('✅ Categories reset to default list.');

        // 4. Reset Users to only the Admin
        await User.deleteMany({});
        await User.create({
            name: 'Admin',
            email: 'admin@homeheartcreation.com',
            password: 'admin123', // Client can change this later
            role: 'admin',
        });
        console.log('✅ Users reset (Only Admin account exists).');

        console.log('\n✨ DATABASE CLEANUP COMPLETE! The system is now ready for the client.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during cleanup:', error);
        process.exit(1);
    }
};

cleanupDatabase();
