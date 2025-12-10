
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel'); 



router.post('/signup', async (req, res) => {

    const { username, email, password } = req.body; 

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required for signup." });
    }

    try {
       
       const userId = await UserModel.createUser(username, email, password);
        

        res.status(201).json({ message: "Registration successful!", userId });
        
    } catch (error) {

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Email already registered." });
        }
        console.error("Signup failed:", error);
        res.status(500).json({ message: "Server error during registration." });
    }
});



router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {

        const user = await UserModel.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

      
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }


        const role = user.role;
        

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