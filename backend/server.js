require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const app = express();

// 1) Connect to MongoDB
connectDB();

// 2) Core middleware (must come BEFORE routes)
app.use(cors());
app.use(express.json());

// 3) Routes
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

const grievanceRoutes = require("./routes/Grievances");
app.use("/api/grievances", grievanceRoutes);


const projectRoutes = require("./routes/project");
app.use("/api/projects", projectRoutes);  

// 4) Start the server (THIS is what makes it listen)
const PORT = process.env.PORT || 10000;
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
app.listen(PORT, () => {
    console.log(`🚀 Server is alive on port ${PORT}`);
});