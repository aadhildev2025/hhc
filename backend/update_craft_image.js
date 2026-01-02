require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Category = require('./models/Category');

const updateCraftImage = async () => {
    try {
        await connectDB();

        const category = await Category.findOne({ name: 'Crafts' });
        if (category) {
            category.image = '/uploads/crafts-category-premium.png';
            await category.save();
            console.log('Successfully updated Crafts category image.');
        } else {
            console.log('Crafts category not found.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error updating Crafts category:', error);
        process.exit(1);
    }
};

updateCraftImage();
