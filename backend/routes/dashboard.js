const router = require("express").Router();
const { authenticateToken } = require("../middleware/auth");
const grievanceModel = require("../models/grievance.model");

// GET /api/dashboard/stats — real counts from MongoDB
router.get("/stats", authenticateToken, async (req, res) => {
    try {
        const total = await grievanceModel.countDocuments();
        const pending = await grievanceModel.countDocuments({
            status:
                "Pending"
        });
        const inProgress = await grievanceModel.countDocuments({
            status:
                "In Progress"
        });
        const resolved = await grievanceModel.countDocuments({
            status:
                "Resolved"
        });

        res.status(200).json({ total, pending, inProgress, resolved });
    } catch (err) {
        console.error("Dashboard stats error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;