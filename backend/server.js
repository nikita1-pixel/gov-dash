require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize'); // Import DataTypes here
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 1. FIRST: Initialize the connection
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false
    }
);

// 2. SECOND: Define the Model (Now 'sequelize' is defined!)
const Grievance = sequelize.define('Grievance', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => `GR-${Math.floor(1000 + Math.random() * 9000)}`
    },
    title: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    category: {
        type: DataTypes.ENUM('Roads', 'Water', 'Electricity', 'Garbage', 'Other'),
        allowNull: false
    },
    priority: {
        type: DataTypes.ENUM('High', 'Medium', 'Low'),
        defaultValue: 'Medium'
    },
    status: {
        type: DataTypes.ENUM('Pending', 'In Progress', 'Resolved'),
        defaultValue: 'Pending'
    }
});
app.get('/api/grievances', async (req, res) => {
    try {
        const data = await Grievance.findAll({ order: [['createdAt', 'DESC']] });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 3. THIRD: Define your Routes
app.post('/api/grievances/create', async (req, res) => {
    try {
        const { title, location, category, priority } = req.body;
        const newGrievance = await Grievance.create({ title, location, category, priority });
        res.status(201).json(newGrievance);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/grievances/:id/resolve', async (req, res) => {
    try {
        const { id } = req.params;
        const grievance = await Grievance.findByPk(id);

        if (grievance) {
            grievance.status = 'Resolved';
            await grievance.save();
            res.json({ message: "Status updated to Resolved", data: grievance });
        } else {
            res.status(404).json({ error: "Grievance not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 4. FOURTH: Sync and Listen
const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
    console.log("✅ Postgres Database Synced");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});

// Example Express route to get office data
app.get('/api/office/appointments', async (req, res) => {
    try {
        // const appointments = await db.query('SELECT * FROM daily_office ORDER BY time ASC');
        // res.json(appointments);

        // Mock data that mimics a database response
        res.json([
            { id: 1, title: "Budget Review with Finance", time: "11:00 AM", type: "Official", priority: "High" },
            { id: 2, title: "Citizen Delegation - Ward 4", time: "01:00 PM", type: "Meeting", priority: "Medium" }
        ]);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});