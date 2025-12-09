// /backend/models/OrderModel.js
const db = require('../config/db'); 

const getAllOrders = async () => {
    try {
        // Get all orders with their items
        const [orders] = await db.execute(`
            SELECT o.id, o.order_date, o.total_amount, o.status,
                   oi.id as item_id, oi.quantity_kg, oi.unit_price, oi.subtotal,
                   p.name as product_name
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            ORDER BY o.id DESC
        `);
        
        // Group orders with their items
        const groupedOrders = {};
        orders.forEach(row => {
            if (!groupedOrders[row.id]) {
                groupedOrders[row.id] = {
                    order_id: row.id,
                    order_date: row.order_date,
                    total_amount: row.total_amount,
                    status: row.status,
                    items: []
                };
            }
            if (row.item_id) {
                groupedOrders[row.id].items.push({
                    name: row.product_name,
                    quantity: row.quantity_kg,
                    price: row.unit_price,
                    subtotal: row.subtotal
                });
            }
        });
        
        return Object.values(groupedOrders);
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

const createOrder = async (orderData) => {
    try {
        const { customer_name, customer_phone, customer_address, items, total_amount } = orderData;
        
        console.log('=== Creating Order ===');
        console.log('Order data:', { customer_name, customer_phone, customer_address, total_amount });
        console.log('Items:', items);
        
        // Check if user_id = 1 exists, if not create a default user or use NULL
        const [userCheck] = await db.execute('SELECT id FROM users LIMIT 1');
        const user_id = userCheck.length > 0 ? userCheck[0].id : 1;
        
        console.log('Using user_id:', user_id);
        
        // Insert main order record
        const [orderResult] = await db.execute(
            `INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, 'Pending')`,
            [user_id, total_amount]
        );
        
        const orderId = orderResult.insertId;
        console.log('Created order with ID:', orderId);
        
        // Function to find product ID by name (case-insensitive)
        const getProductIdByName = async (productName) => {
            console.log('Looking for product:', productName);
            const [products] = await db.execute('SELECT id, name FROM products WHERE LOWER(name) LIKE LOWER(?)', [`%${productName}%`]);
            console.log('Found products:', products);
            return products.length > 0 ? products[0].id : null;
        };
        
        // Insert order items
        for (const item of items) {
            console.log('Processing item:', item);
            const productId = await getProductIdByName(item.name);
            if (productId) {
                console.log('Found product ID:', productId, 'for item:', item.name);
                await db.execute(
                    `INSERT INTO order_items (order_id, product_id, quantity_kg, unit_price, subtotal)
                     VALUES (?, ?, ?, ?, ?)`,
                    [orderId, productId, item.quantity, item.price, item.quantity * item.price]
                );
                console.log('Inserted order item for:', item.name);
            } else {
                console.warn(`Product not found: ${item.name}`);
                // Still insert the item with NULL product_id so we don't lose the order
                try {
                    await db.execute(
                        `INSERT INTO order_items (order_id, product_id, quantity_kg, unit_price, subtotal)
                         VALUES (?, NULL, ?, ?, ?)`,
                        [orderId, item.quantity, item.price, item.quantity * item.price]
                    );
                    console.log('Inserted order item with NULL product_id for:', item.name);
                } catch (err) {
                    console.error('Failed to insert item with NULL product_id:', err);
                }
            }
        }
        
        console.log('Order created successfully with ID:', orderId);
        return { order_id: orderId, message: 'Order created successfully' };
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

const deleteOrder = async (order_id) => {
    try {
        // Delete order items first (due to foreign key constraint)
        await db.execute('DELETE FROM order_items WHERE order_id = ?', [order_id]);
        
        // Then delete the main order
        const [result] = await db.execute('DELETE FROM orders WHERE id = ?', [order_id]);
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