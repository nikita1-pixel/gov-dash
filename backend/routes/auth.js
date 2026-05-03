const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🟢 REGISTER
router.post('/register', async (req, res) => {
    const { name, email, password, role, ward } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = `
            INSERT INTO users (name, email, password_hash, role, ward) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, email, role`;

        const values = [name, email, hashedPassword, role, ward || 'N/A'];
        const result = await db.query(query, values);

        res.status(201).json({ message: "User created!", user: result.rows[0] });
    } catch (err) {
        console.error("❌ DB Insert Error:", err.message);
        res.status(500).json({ message: "Database error" });
    }
});

// 🔵 LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        // Check password (keeping your admin123 bypass for now)
        if (isMatch || password === 'admin123') {
            // Generate token once
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Send ONE response and RETURN to stop execution
            return res.json({
                token,
                user: { name: user.name, role: user.role }
            });
        }

        // If no match
        return res.status(401).json({ message: "Invalid Credentials" });

    } catch (err) {
        console.error("❌ Login Error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;