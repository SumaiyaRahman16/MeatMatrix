// /backend/models/UserModel.js
const db = require('../config/db'); // Import the database connection pool
const bcrypt = require('bcrypt');   // Import the bcrypt library

// -------------------------------------------------------------------------
// 1. Function to create a new user (used for customer sign-up)
// -------------------------------------------------------------------------

const SALT_ROUNDS = 10; // Standard number of salt rounds for bcrypt

const createUser = async (username, email, password, role = 'customer') => {
    try {
        // 1. Hash the password before storing it for security
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        
        // 2. SQL query to insert the new user (using the hashed password)
        const sql = `
            INSERT INTO users (username, email, password_hash, role) 
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [username, email, passwordHash, role]);
        
        // Return the ID of the newly created user
        return result.insertId;
        
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

// -------------------------------------------------------------------------
// 2. Function to find a user by email (used for login check)
// -------------------------------------------------------------------------

const findUserByEmail = async (email) => {
    try {
        const sql = `
            SELECT id, email, password_hash, role 
            FROM users 
            WHERE email = ?
        `;
        const [rows] = await db.execute(sql, [email]);
        
        // Return the first row (the user data) or null if no user is found
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