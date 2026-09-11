const projectModel = require("../models/project.model");

async function getProjects(req, res) {
    try {
        const projects = await projectModel.find().sort({
            createdAt: -1
        });
        return res.status(200).json({ count: projects.length, projects });
    } catch (err) {
        console.error("Get projects error:", err.message);
        return res.status(500).json({ message: "Server error" });
    }
}

async function createProject(req, res) {
    try {
        const { name, source, total, released, spent, status, health } =
            req.body;
        if (!name) return res.status(400).json({
            message: "Project name is required" });
          const project = await projectModel.create({
                name, source, total,
                released, spent, status, health
            });
            return res.status(201).json({
                message: "Project created", project
            });
        } catch (err) {
            console.error("Create project error:", err.message);
            return res.status(500).json({ message: "Server error" });
        }
    }

module.exports = { getProjects, createProject };
