const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/products
// @desc    Get all products with filtering
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, featured, sort } = req.query;

        let query = {};

        // Category filter
        if (category) {
            // Check if category is a valid ObjectId
            if (category.match(/^[0-9a-fA-F]{24}$/)) {
                query.category = category;
            } else {
                // If not an ObjectId, find category by name
                const CategoryModel = require('../models/Category');
                const cat = await CategoryModel.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
                if (cat) {
                    query.category = cat._id;
                } else {
                    // If category not found by name, return empty array
                    return res.json([]);
                }
            }
        }

        // Search filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Featured filter
        if (featured === 'true') {
            query.featured = true;
        }

        // Sorting
        let sortOption = {};
        if (sort === 'price-asc') {
            sortOption.price = 1;
        } else if (sort === 'price-desc') {
            sortOption.price = -1;
        } else if (sort === 'newest') {
            sortOption.createdAt = -1;
        } else {
            sortOption.createdAt = -1;
        }

        const products = await Product.find(query)
            .populate('category', 'name')
            .sort(sortOption);

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', async (req, res) => {
    try {
        const products = await Product.find({ featured: true })
            .populate('category', 'name')
            .limit(8);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post('/', protect, admin, upload.array('images', 5), async (req, res) => {
    try {
        const { name, description, price, category, stock, featured } = req.body;

        let image = '';
        let images = [];

        if (req.files && req.files.length > 0) {
            image = req.files[0].path; // Cloudinary returns the full URL in .path
            images = req.files.map(file => file.path);
        }

        // Validate that an image was provided since it's required in the model
        if (!image) {
            return res.status(400).json({ message: 'At least one product image is required' });
        }

        const product = await Product.create({
            name,
            description,
            price: Number(price),
            image,
            images,
            category,
            stock: Number(stock) || 0,
            featured: featured === 'true',
        });

        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/:id', protect, admin, upload.array('images', 5), async (req, res) => {
    try {
        const { name, description, price, category, stock, featured } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price ? Number(price) : product.price;
            product.category = category || product.category;
            product.stock = stock !== undefined ? Number(stock) : product.stock;
            product.featured = featured !== undefined ? featured === 'true' : product.featured;

            if (req.files && req.files.length > 0) {
                product.image = req.files[0].path;
                product.images = req.files.map(file => file.path);
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/products/:id/reviews
// @desc    Create new review
// @access  Public
router.post('/:id/reviews', async (req, res) => {
    try {
        const { rating, comment, name } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            const review = {
                name: name || 'Anonymous',
                rating: Number(rating),
                comment,
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating =
                product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            res.status(201).json({ message: 'Review added' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/products/reviews/all
// @desc    Get all reviews (Admin only)
// @access  Private/Admin
router.get('/reviews/all', protect, admin, async (req, res) => {
    try {
        const products = await Product.find({}).select('name reviews');
        const allReviews = products.reduce((acc, product) => {
            const productReviews = product.reviews.map(review => ({
                ...review.toObject(),
                productId: product._id,
                productName: product.name
            }));
            return [...acc, ...productReviews];
        }, []);

        // Sort by date newest first
        allReviews.sort((a, b) => b.createdAt - a.createdAt);

        res.json(allReviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/products/:id/reviews/:reviewId
// @desc    Delete a review
// @access  Private/Admin
router.delete('/:id/reviews/:reviewId', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.reviews = product.reviews.filter(
                (review) => review._id.toString() !== req.params.reviewId
            );
            product.numReviews = product.reviews.length;
            product.rating =
                product.reviews.length > 0
                    ? product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                    product.reviews.length
                    : 0;

            await product.save();
            res.json({ message: 'Review removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
