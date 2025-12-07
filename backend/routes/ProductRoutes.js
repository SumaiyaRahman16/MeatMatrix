// /backend/routes/productRoutes.js
const express = require('express');
const router = express.Router(); 
const ProductModel = require('../models/ProductModel'); 

// GET /api/products
router.get('/', async (req, res) => {
    try {
        const products = await ProductModel.getAllProducts(); 
        res.status(200).json(products); 
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products from the server." });
    }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await ProductModel.getProductById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch product' });
    }
});

// POST /api/products
router.post('/', async (req, res) => {
    try {
        const product = req.body;
        // Basic validation
        if (!product || !product.name) return res.status(400).json({ message: 'Missing required field: name' });
        if (typeof product.price_per_kg === 'undefined') return res.status(400).json({ message: 'Missing required field: price_per_kg' });
        if (typeof product.stock_quantity === 'undefined') return res.status(400).json({ message: 'Missing required field: stock_quantity' });

        const created = await ProductModel.createProduct(product);
        res.status(201).json(created);
    } catch (error) {
        console.error('POST /api/products error:', error);
        // If this is a SQL error, include some details to help debugging
        const errMsg = error && error.message ? error.message : String(error);
        res.status(500).json({ message: 'Failed to create product', error: errMsg });
    }
});

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = req.body;
        const updated = await ProductModel.updateProduct(id, product);
        res.status(200).json(updated);
    } catch (error) {
        console.error('PUT /api/products/:id error:', error);
        res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
    try {
        await ProductModel.deleteProduct(req.params.id);
        res.status(200).json({ message: 'Deleted' });
    } catch (error) {
        console.error('DELETE /api/products/:id error:', error);
        res.status(500).json({ message: 'Failed to delete product', error: error.message });
    }
});

module.exports = router;