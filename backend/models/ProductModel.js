// /backend/models/ProductModel.js
const db = require('../config/db'); 

const getAllProducts = async () => {
    try {
        const [rows] = await db.execute('SELECT * FROM products');
        return rows; 
    } catch (error) {
        console.error("Error fetching all products:", error);
        throw error; 
    }
};

const getProductById = async (id) => {
    try {
        const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    } catch (error) {
        console.error('Error fetching product by id:', error);
        throw error;
    }
};

const createProduct = async (product) => {
    try {

        const { name, stock_quantity = 0, price_per_kg = 0, is_premium = 0, is_popular = 0, is_special = 0, is_deluxe = 0, description = null } = product;
        const [result] = await db.execute(
            `INSERT INTO products (name, price_per_kg, stock_quantity, is_premium, is_popular, is_special, is_deluxe, description)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, price_per_kg, stock_quantity, is_premium, is_popular, is_special, is_deluxe, description]
        );
        return { id: result.insertId, ...product };
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

const updateProduct = async (id, product) => {
    try {

        const { name, stock_quantity, price_per_kg, is_premium, is_popular, is_special = 0, is_deluxe = 0, description } = product;
        await db.execute(
            `UPDATE products SET name = ?, price_per_kg = ?, stock_quantity = ?, is_premium = ?, is_popular = ?, is_special = ?, is_deluxe = ?, description = ? WHERE id = ?`,
            [name, price_per_kg, stock_quantity, is_premium, is_popular, is_special, is_deluxe, description, id]
        );
        return { id, ...product };
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

const deleteProduct = async (id) => {
    try {
        await db.execute('DELETE FROM products WHERE id = ?', [id]);
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};