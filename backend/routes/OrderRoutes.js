
const express = require('express');
const router = express.Router();

const OrderModel = require('../models/OrderModel'); 


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


router.post('/', async (req, res) => {
  
    const { name, customer_number, total_amount, total_kg } = req.body;


    if (!name || !customer_number || !total_amount || !total_kg) {
        return res.status(400).json({ success: false, message: "Missing required order details." });
    }

    try {
        const orderDetails = { name, customer_number, total_amount, total_kg };
        
 
        const orderId = await OrderModel.placeOrderTransaction(orderDetails);
        
    
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