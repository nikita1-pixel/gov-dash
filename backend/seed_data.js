require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
const grievanceModel = require("./models/grievance.model");

const grievances = [
    {
        title: "Pothole on Main Road", category: "Roads", description:
            "Large pothole causing traffic near the junction.", status: "Pending",
        ward: "Karve Nagar", latitude: 18.4912, longitude: 73.8215
    },
    {
        title: "Street Light Not Working", category: "Electricity",
        description: "Street lights out for 3 days.", status: "In Progress", ward:
            "Kothrud", latitude: 18.5074, longitude: 73.8077
    },
    {
        title: "Water Leakage", category: "Water Supply", description: "Main pipe burst near the school.", status: "Pending", ward: "Shivajinagar", latitude: 18.5308, longitude: 73.8475
    },
    {
        title: "Garbage Overflow", category: "Sanitation", description:
            "Public bin not cleared since Monday.", status: "Resolved", ward:
            "Erandwane", latitude: 18.5121, longitude: 73.8322
    },
    {
        title: "Broken Footpath", category: "Roads", description: "Tiles are loose and dangerous for seniors.", status: "Pending", ward: "Aundh", latitude: 18.5580, longitude: 73.8075
    },
    {
        title: "Drainage Blockage", category: "Sewage", description: "Sewage backup in residential area.", status: "In Progress", ward: "Hadapsar", latitude: 18.5089, longitude: 73.9259
    },
    {
        title: "Illegal Parking", category: "Traffic", description: "Trucks parked in no- parking zone.", status: "Pending", ward: "Viman Nagar", latitude: 18.5679, longitude: 73.9143 },
{
    title: "Park Maintenance", category: "Gardens", description:
    "Benches broken in the local park.", status: "Resolved", ward: "Baner",
        latitude: 18.5590, longitude: 73.7797
},
{
    title: "Low Water Pressure", category: "Water Supply", description:
    "Residents reporting very low pressure.", status: "In Progress", ward:
    "Warje", latitude: 18.4795, longitude: 73.8021
},
{
    title: "Open Manhole", category: "Sewage", description: "Hazardous open manhole on side street.", status: "Pending", ward: "Kondhwa", latitude: 18.4771, longitude: 73.8907
},
  ];

async function seed() {
    try {
        await connectDB();
        await grievanceModel.deleteMany({});          // wipe old data for aclean slate
        const inserted = await grievanceModel.insertMany(grievances);
        console.log(`🌱 Seeded ${inserted.length} grievances`);
    } catch (err) {
        console.error("❌ Seeding failed:", err.message);
    } finally {
        await mongoose.disconnect();                   // close so the script exits
        console.log("Connection closed");
    }
}

seed();