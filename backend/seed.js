require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

const categories = [
    {
        name: 'Home Decor',
        description: 'Beautiful handmade home decoration items',
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800',
    },
    {
        name: 'Handmade Gifts',
        description: 'Unique handcrafted gift items for your loved ones',
        image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=800',
    },
    {
        name: 'Wall Art',
        description: 'Artistic wall decorations and hangings',
        image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800',
    },
    {
        name: 'Crafts',
        description: 'Handmade craft items and DIY products',
        image: '/uploads/crafts-category-premium.png',
    },
    {
        name: 'Candles & Holders',
        description: 'Scented candles and decorative holders',
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800',
    },
    {
        name: 'Kitchen & Dining',
        description: 'Handcrafted kitchen and dining accessories',
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800',
    },
];

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});

        console.log('Cleared existing data...');

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@homeheartcreation.com',
            password: 'admin123',
            role: 'admin',
        });

        console.log('Created admin user:', admin.email);

        // Create categories
        const createdCategories = await Category.insertMany(categories);
        console.log('Created categories:', createdCategories.length);

        // Create sample products
        const productsList = [
            {
                name: 'Handwoven Macrame Wall Hanging',
                description: 'Beautiful handwoven macrame wall hanging made with natural cotton rope. Perfect for adding a bohemian touch to any room.',
                price: 2500,
                image: 'https://images.unsplash.com/photo-1528659097278-4363c6b611c7?auto=format&fit=crop&q=80&w=800',
                images: ['https://images.unsplash.com/photo-1528659097278-4363c6b611c7?auto=format&fit=crop&q=80&w=800'],
                category: createdCategories[2]._id,
                stock: 15,
                featured: true,
                rating: 4.8,
            },
            {
                name: 'Scented Soy Candle Set',
                description: 'Set of 3 hand-poured soy candles with calming lavender, vanilla, and jasmine scents. Burns for up to 40 hours each.',
                price: 1800,
                image: 'https://images.unsplash.com/photo-1596433809252-260c2745dfdd?auto=format&fit=crop&q=80&w=800',
                images: ['https://images.unsplash.com/photo-1596433809252-260c2745dfdd?auto=format&fit=crop&q=80&w=800'],
                category: createdCategories[4]._id,
                stock: 25,
                featured: true,
                rating: 4.9,
            },
            {
                name: 'Ceramic Planter Set',
                description: 'Set of 3 handcrafted ceramic planters in pastel colors. Perfect for succulents and small plants.',
                price: 3200,
                image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800',
                images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800'],
                category: createdCategories[0]._id,
                stock: 10,
                featured: true,
                rating: 4.7,
            },
            {
                name: 'Personalized Photo Frame',
                description: 'Handcrafted wooden photo frame with custom engraving. A perfect gift for special occasions.',
                price: 1500,
                image: 'https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?auto=format&fit=crop&q=80&w=800',
                images: ['https://images.unsplash.com/photo-1563291074-2bf8677ac0e5?auto=format&fit=crop&q=80&w=800'],
                category: createdCategories[1]._id,
                stock: 20,
                featured: false,
                rating: 4.6,
            },
            {
                name: 'Woven Storage Basket',
                description: 'Natural seagrass storage basket, handwoven by artisans. Great for organizing blankets, toys, or laundry.',
                price: 2800,
                image: 'https://images.unsplash.com/photo-1591047139829-d91aec36beea?auto=format&fit=crop&q=80&w=800',
                images: ['https://images.unsplash.com/photo-1591047139829-d91aec36beea?auto=format&fit=crop&q=80&w=800'],
                category: createdCategories[0]._id,
                stock: 12,
                featured: true,
                rating: 4.8,
            },
            {
                name: 'Wooden Coaster Set',
                description: 'Set of 6 handcrafted wooden coasters with intricate mandala designs. Comes in a beautiful gift box.',
                price: 1200,
                image: 'https://images.unsplash.com/photo-1616489953149-8d7732a3f749?auto=format&fit=crop&q=80&w=800',
                images: ['https://images.unsplash.com/photo-1616489953149-8d7732a3f749?auto=format&fit=crop&q=80&w=800'],
                category: createdCategories[5]._id,
                stock: 30,
                featured: false,
                rating: 4.5,
            },
            {
                name: 'Dream Catcher',
                description: 'Handmade bohemian dream catcher with feathers and beads. Brings positive energy and beautiful dreams.',
                price: 1800,
                image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=800',
                images: ['https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=800'],
                category: createdCategories[2]._id,
                stock: 18,
                featured: true,
                rating: 4.9,
            },
            {
                name: 'Handmade Greeting Cards Set',
                description: 'Set of 12 handmade greeting cards with dried flower decorations. Perfect for all occasions.',
                price: 800,
                image: 'https://images.unsplash.com/photo-1534127393081-35bc196ca051?auto=format&fit=crop&q=80&w=800',
                images: ['https://images.unsplash.com/photo-1534127393081-35bc196ca051?auto=format&fit=crop&q=80&w=800'],
                category: createdCategories[3]._id,
                stock: 50,
                featured: false,
                rating: 4.4,
            },
        ];

        await Product.insertMany(productsList);
        console.log('Created products:', productsList.length);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
