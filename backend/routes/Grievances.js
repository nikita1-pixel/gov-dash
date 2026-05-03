// backend/routes/grievances.js


// GET all grievances
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// GET all grievances
router.get('/', async (req, res) => {
    try {
        // Use double quotes because your table is capitalized in pgAdmin
        const result = await pool.query('SELECT * FROM "Grievances" ORDER BY "createdAt" DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;

router.put('/:id', async (req, res) => {
    const { title, location, priority, status } = req.body;
    try {
        const result = await pool.query(
            `UPDATE "Grievances" SET title=$1, location=$2, priority=$3, status=$4, "updatedAt"=NOW() 
             WHERE id=$5 RETURNING *`,
            [title, location, priority, status, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST: Create a new grievance
// backend/routes/Grievances.js
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "No token provided" });

    // Ensure 'your_jwt_secret' matches what you used in your login route
    jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
};

// 2. NOW THIS LINE WILL WORK:
router.post('/', authenticateToken, async (req, res) => {
    const { title, location, priority, latitude, longitude, description } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO grievances (title, location, priority, latitude, longitude, description, status) VALUES ($1, $2, $3, $4, $5, $6, 'Pending') RETURNING *",
            [title, location, priority, latitude, longitude, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
// Example Express Controller Logic
exports.createGrievance = async (req, res) => {
    try {
        const { title, location, priority, status, image } = req.body;

        const newGrievance = await Grievance.create({
            title,
            location,
            priority,
            status: status || 'Pending',
            image, // Ensure this is included!
            userId: req.user.id // This comes from your auth middleware
        });

        res.status(201).json(newGrievance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create grievance" });
    }
};
module.exports = router;