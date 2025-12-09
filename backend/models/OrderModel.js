// /backend/models/OrderModel.js
const db = require('../config/db'); 

const getAllOrders = async () => {
    try {
        const [rows] = await db.execute('SELECT * FROM orders ORDER BY created_at DESC');
        return rows; 
    } catch (error) {
        console.error("Error fetching all orders:", error);
        throw error; 
    }
};

const getOrderById = async (id) => {
    try {
        const [rows] = await db.execute('SELECT * FROM orders WHERE id = ?', [id]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching order by id:', error);
        throw error;
    }
};

const createOrder = async (order) => {
    try {
        const { customer_name, customer_phone, customer_address, items, total_amount, payment_method = 'Cash on Delivery' } = order;
        const now = new Date();
        const [result] = await db.execute(
            `INSERT INTO orders (customer_name, customer_phone, customer_address, items, total_amount, payment_method, status, created_at)
             VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
            [customer_name, customer_phone, customer_address, JSON.stringify(items), total_amount, payment_method, now]
        );
        return { id: result.insertId, ...order, status: 'pending', created_at: now };
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

const updateOrderStatus = async (id, status) => {
    try {
        await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        return { id, status };
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};

const deleteOrder = async (id) => {
    try {
        const [result] = await db.execute('DELETE FROM orders WHERE id = ?', [id]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error deleting order:', error);
        throw error;
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    deleteOrder,
};