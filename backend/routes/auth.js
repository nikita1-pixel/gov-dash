const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock User (In production, find this in MongoDB/PostgreSQL)
const adminUser = {
    id: "1",
    username: "kunal_admin",
    passwordHash: "" // This would be the hashed version of his password
};

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // 1. Check Username
    if (username !== adminUser.username) return res.status(400).send("User not found");

    // 2. Check Password (Comparing hash, not plain text)
    const validPass = await bcrypt.compare(password, adminUser.passwordHash);
    if (!validPass) return res.status(400).send("Invalid Password");

    // 3. Create and assign a token
    const token = jwt.sign(
        { id: adminUser.id, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '2h' } // Token expires in 2 hours for security
    );

    res.header('Authorization', token).send({
        token: token,
        user: { username: adminUser.username, role: 'admin' }
    });
});