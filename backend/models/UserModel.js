// /backend/models/UserModel.js
const db = require('../config/db'); 
const bcrypt = require('bcrypt');   


const SALT_ROUNDS = 10; 

const createUser = async (username, email, password, role = 'customer') => {
    try {

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        
     
        const sql = `
            INSERT INTO users (username, email, password_hash, role) 
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [username, email, passwordHash, role]);
        
     
        return result.insertId;
        
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};



const findUserByEmail = async (email) => {
    try {
        const sql = `
            SELECT id, email, password_hash, role 
            FROM users 
            WHERE email = ?
        `;
        const [rows] = await db.execute(sql, [email]);
        
   
        return rows[0] || null;
        
    } catch (error) {
        console.error("Error finding user by email:", error);
        throw error;
    }
};

module.exports = {
    createUser,
    findUserByEmail,
};