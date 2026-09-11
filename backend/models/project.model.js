const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        source: {
            type: String, enum: ["DPDC", "MLA Fund", "Municipal"],
            default: "DPDC"
        },
        total: { type: Number, default: 0 },     // sanctioned amount
        released: { type: Number, default: 0 },
        spent: { type: Number, default: 0 },
        status: {
            type: String, enum: ["Planning", "In Progress",
                "Delayed", "Completed"], default: "Planning"
        },
        health: {
            type: String, enum: ["Good", "Stable", "At Risk"],
            default: "Good"
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("project", projectSchema);