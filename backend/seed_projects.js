require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
const projectModel = require("./models/project.model");

const projects = [
    {
        name: "Ghole Road Asphaltation", total: 4500000, released: 4000000,
        spent: 3000000, source: "DPDC", status: "In Progress", health: "Good"
    },
    {
        name: "Model Colony Garden CCTV", total: 1200000, released: 1200000,
        spent: 1200000, source: "MLA Fund", status: "Completed", health: "Stable"
    },
    {
        name: "Shivaji Nagar School Reno", total: 8500000, released:
            3000000, spent: 2100000, source: "Municipal", status: "Delayed", health:
            "At Risk"
    },
    {
        name: "Ward 12 Street Light Phase II", total: 1800000, released:
            1800000, spent: 400000, source: "DPDC", status: "Planning", health: "Good"
    },
];

async function seed() {
    try {
        await connectDB();
        await projectModel.deleteMany({});
        const inserted = await projectModel.insertMany(projects);
        console.log(`🌱 Seeded ${inserted.length} projects`);
    } catch (err) {
        console.error("❌ Seeding failed:", err.message);
    } finally {
        await mongoose.disconnect();
        console.log("Connection closed");
    }
}
seed();