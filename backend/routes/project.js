const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const projectController = require("../controllers/project.controller");

// Budget is admin-only (matches your RBAC)
router.get("/", authenticateToken, authorizeRoles("admin"), projectController.getProjects);
router.post("/", authenticateToken, authorizeRoles("admin"), projectController.createProject);

module.exports = router;