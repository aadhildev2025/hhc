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
            query.category = category;
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
            image = `/uploads/${req.files[0].filename}`;
            images = req.files.map(file => `/uploads/${file.filename}`);
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
                product.image = `/uploads/${req.files[0].filename}`;
                product.images = req.files.map(file => `/uploads/${file.filename}`);
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
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

module.exports = router;
