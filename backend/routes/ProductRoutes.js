// /backend/routes/productRoutes.js
const express = require('express');
const router = express.Router(); 
const ProductModel = require('../models/ProductModel'); 

router.get('/', async (req, res) => {
    try {
        const products = await ProductModel.getAllProducts(); 
        res.status(200).json(products); 
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products from the server." });
    }
});

module.exports = router;