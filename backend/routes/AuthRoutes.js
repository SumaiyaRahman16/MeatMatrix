// /backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel'); 

// -------------------------------------------------------------------------
// 1. POST /api/auth/signup (Customer Registration)
// -------------------------------------------------------------------------

router.post('/signup', async (req, res) => {
    // We expect email, password, and username from the frontend form
    const { username, email, password } = req.body; 

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required for signup." });
    }

    try {
        // Use the Model function to hash the password and create the user
        const userId = await UserModel.createUser(username, email, password);
        
        // Success response
        res.status(201).json({ message: "Registration successful!", userId });
        
    } catch (error) {
        // Error 1062 is the MySQL code for Duplicate entry (e.g., email already exists)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Email already registered." });
        }
        console.error("Signup failed:", error);
        res.status(500).json({ message: "Server error during registration." });
    }
});

// -------------------------------------------------------------------------
// 2. POST /api/auth/login (Customer and Manager Login)
// -------------------------------------------------------------------------

router.post('/login', async (req, res) => {
    // We expect email and password from the frontend form (adminlogin or signin)
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        // 1. Find the user in the database by email
        const user = await UserModel.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // 2. Compare the submitted password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // 3. Success! Check the role to determine redirect/access
        const role = user.role;
        
        // Return the role to the frontend so it knows where to redirect
        res.status(200).json({ 
            message: "Login successful!", 
            role: role,
            redirect: role === 'manager' ? '/dashboard.html' : '/customerpage.html'
        });

    } catch (error) {
        console.error("Login failed:", error);
        res.status(500).json({ message: "Server error during login." });
    }
});

module.exports = router;