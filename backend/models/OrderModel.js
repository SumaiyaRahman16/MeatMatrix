
const pool = require('../config/db');


async function placeOrderTransaction(orderDetails) {
    try {
      
        const { name, customer_number, total_amount, total_kg } = orderDetails;

       
        const insertOrderSql = `
            INSERT INTO orders (name, customer_number, total_kg, total_amount) 
            VALUES (?, ?, ?, ?)
        `;
        const [orderResult] = await pool.execute(insertOrderSql, [name, customer_number, total_kg, total_amount]);
        const orderId = orderResult.insertId;

        return orderId;

    } catch (error) {
        console.error("Order insertion failed:", error);
        throw error;
    }
}

/**
 * Fetches all orders from the database
 */
async function getAllOrders() {
    try {
        const sql = `SELECT order_id, name, customer_number, total_kg, total_amount FROM orders ORDER BY order_id DESC`;
        const [orders] = await pool.execute(sql);
        return orders;
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        throw error;
    }
}

module.exports = {
    placeOrderTransaction,
    getAllOrders,
};