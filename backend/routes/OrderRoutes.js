// /backend/routes/OrderRoutes.js
const express = require('express');
const OrderModel = require('../models/OrderModel');
const router = express.Router();

// GET all orders
router.get('/', async (req, res) => {
    try {
        const orders = await OrderModel.getAllOrders();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// GET order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await OrderModel.getOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// POST create new order
router.post('/', async (req, res) => {
    try {
        console.log('=== POST /api/orders ===');
        console.log('Request body:', req.body);
        
        const { customer_name, customer_phone, customer_address, items, total_amount, payment_method } = req.body;
        
        // Validate required fields
        if (!customer_name || !customer_phone || !customer_address || !items || !total_amount) {
            console.log('Validation failed - missing fields');
            return res.status(400).json({ 
                error: 'Missing required fields: customer_name, customer_phone, customer_address, items, total_amount' 
            });
        }
        
        // Validate items array
        if (!Array.isArray(items) || items.length === 0) {
            console.log('Validation failed - invalid items array');
            return res.status(400).json({ error: 'Items must be a non-empty array' });
        }

        // Validate total_amount
        if (typeof total_amount !== 'number' || total_amount <= 0) {
            console.log('Validation failed - invalid total_amount');
            return res.status(400).json({ error: 'Total amount must be a positive number' });
        }

        console.log('Creating order with OrderModel...');
        const newOrder = await OrderModel.createOrder({
            customer_name,
            customer_phone,
            customer_address,
            items,
            total_amount,
            payment_method
        });
        
        console.log('Order created successfully:', newOrder);
        res.status(201).json({ 
            message: 'Order created successfully',
            order: newOrder
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// PUT update order status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const allowedStatuses = ['pending', 'processing', 'completed', 'cancelled'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ 
                error: 'Invalid status. Allowed values: ' + allowedStatuses.join(', ')
            });
        }

        const updatedOrder = await OrderModel.updateOrderStatus(req.params.id, status);
        res.json({ 
            message: 'Order status updated successfully',
            order: updatedOrder
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

// DELETE order (for delivered orders)
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await OrderModel.deleteOrder(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json({ 
            message: 'Order deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Failed to delete order' });
    }
});

module.exports = router;