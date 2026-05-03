const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize (ensure these match your server.js env variables)
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5433,
        dialect: 'postgres',
    }
);

// Define User Model (must match your database schema)
const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true },
    password_hash: { type: DataTypes.STRING }, // Change 'password' to 'password_hash'
    role: { type: DataTypes.ENUM('admin', 'staff'), defaultValue: 'staff' }
});

const seedDatabase = async () => {
    try {
        await User.create({
            username: u.username,
            password_hash: hashedPassword, // Change this as well
            role: u.role
        }); // Syncs models without deleting existing data

        const salt = await bcrypt.genSalt(10);

        // Define your users and their plain-text passwords here
        const usersToCreate = [
            { username: 'kunal_admin', password: 'AdminPassword123', role: 'admin' },
            { username: 'pune_staff', password: 'StaffPassword456', role: 'staff' }
        ];

        for (let u of usersToCreate) {
            // Check if user already exists to avoid duplicates
            const exists = await User.findOne({ where: { username: u.username } });
            if (!exists) {
                const hashedPassword = await bcrypt.hash(u.password, salt);
                await User.create({
                    username: u.username,
                    password: hashedPassword,
                    role: u.role
                });
                console.log(`✅ Created user: ${u.username} (${u.role})`);
            } else {
                console.log(`ℹ️ User ${u.username} already exists. Skipping.`);
            }
        }

        process.exit();
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();