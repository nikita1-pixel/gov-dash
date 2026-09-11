const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/auth");
const grievanceController = require("../controllers/grievance.controller");

router.get("/", authenticateToken, grievanceController.getGrievances);
router.post("/", authenticateToken, grievanceController.createGrievance);
router.put("/:id", authenticateToken, authorizeRoles("staff", "admin"), grievanceController.updateGrievance);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), grievanceController.deleteGrievance);

module.exports = router;