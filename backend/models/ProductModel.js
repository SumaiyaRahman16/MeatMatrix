// /backend/models/ProductModel.js
const db = require('../config/db'); 

const getAllProducts = async () => {
    try {
        const [rows, fields] = await db.execute('SELECT * FROM products');
        return rows; 
    } catch (error) {
        console.error("Error fetching all products:", error);
        throw error; 
    }
};

module.exports = {
    getAllProducts,
};