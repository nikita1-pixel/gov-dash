const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Security Middleware
app.use(helmet()); 
app.use(cors());
app.use(express.json());

const SECRET_KEY = "your_ultra_secure_secret_key"; // Move to .env later

// Mock Database
const users = []; 

// Register Route
app.post('/api/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({ username: req.body.username, password: hashedPassword });
    res.status(201).send("User Registered");
});

// Login Route
app.post('/api/login', async (req, res) => {
    const user = users.find(u => u.username === req.body.username);
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(401).send("Invalid Credentials");
    }
    // Generate Secure Token
    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

app.listen(5000, () => console.log("Server running on port 5000"));