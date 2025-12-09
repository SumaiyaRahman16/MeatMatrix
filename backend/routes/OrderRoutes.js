// /backend/routes/orderRoutes.js (FINAL VERSION)
const express = require('express');
const router = express.Router();
// NOTE: Must import the full transaction function, NOT just insertOrder
const OrderModel = require('../models/OrderModel'); 

// GET /api/orders - Fetch all orders
router.get('/', async (req, res) => {
    try {
        const orders = await OrderModel.getAllOrders();
        res.status(200).json({ 
            success: true, 
            orders: orders 
        });
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        res.status(500).json({ 
            success: false,
            message: "Server error while fetching orders." 
        });
    }
});

// POST /api/orders - Simple Order Placement
router.post('/', async (req, res) => {
    // We only need the 4 main fields
    const { name, customer_number, total_amount, total_kg } = req.body;

    // Validate required fields
    if (!name || !customer_number || !total_amount || !total_kg) {
        return res.status(400).json({ success: false, message: "Missing required order details." });
    }

    try {
        const orderDetails = { name, customer_number, total_amount, total_kg };
        
        // Insert the order
        const orderId = await OrderModel.placeOrderTransaction(orderDetails);
        
        // Success response
        res.status(201).json({ 
            success: true, 
            message: "Order confirmed successfully.", 
            order_id: orderId 
        });
        
    } catch (error) {
        console.error("Order placement failed:", error);
        res.status(500).json({ 
            success: false,
            message: "Server error during order placement." 
        });
    }
});

module.exports = router;