const grievanceModel = require("../models/grievance.model");

// CREATE — any logged-in user can file a grievance
async function createGrievance(req, res) {
    try {
        const { title, category, description, priority, ward, location,
            latitude, longitude, image } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const grievance = await grievanceModel.create({
            title, category, description, priority, ward, location,
            latitude, longitude, image,
            createdBy: req.user.id, // comes from authenticateToken
        });

        return res.status(201).json({
            message: "Grievance created",
            grievance
        });
    } catch (err) {
        console.error("Create grievance error:", err.message);
        return res.status(500).json({ message: "Server error" });
    }
}

// READ ALL
async function getGrievances(req, res) {
    try {
        const grievances = await grievanceModel
            .find()
            .sort({ createdAt: -1 })                     // newest first
            .populate("createdBy", "name email role");   // pull author info(JOIN - like)

        return res.status(200).json({
            count: grievances.length, grievances
        });
    } catch (err) {
        console.error("Get grievances error:", err.message);
        return res.status(500).json({ message: "Server error" });
    }
}

// UPDATE — staff/admin only
async function updateGrievance(req, res) {
    try {
        const grievance = await grievanceModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }  // return updated doc +enforce schema
        );
        if (!grievance) return res.status(404).json({
            message: "Grievance not found" });
          return res.status(200).json({
                message: "Grievance updated",
                grievance
            });
        } catch (err) {
            console.error("Update grievance error:", err.message);
            return res.status(500).json({ message: "Server error" });
        }
    }

  // DELETE — admin only
  async function deleteGrievance(req, res) {
        try {
            const grievance = await
                grievanceModel.findByIdAndDelete(req.params.id);
            if (!grievance) return res.status(404).json({
                message: "Grievance  not found" });
          return res.status(200).json({ message: "Grievance deleted" });
            } catch (err) {
                console.error("Delete grievance error:", err.message);
                return res.status(500).json({ message: "Server error" });
            }
        }

module.exports = {createGrievance, getGrievances, updateGrievance,deleteGrievance};