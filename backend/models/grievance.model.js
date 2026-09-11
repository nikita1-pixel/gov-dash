const mongoose = require("mongoose");

const grievanceSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        category: { type: String, trim: true },          // Roads, Water   Supply...
        description: { type: String, trim: true },
    status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending",
},
    priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
},
    ward: { type: String, trim: true },
    location: { type: String, trim: true },           //human - readable place
    latitude: { type: Number },                        // for the map
    longitude: { type: Number },
    image: { type: String },                           // optional hoto URL
    createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",                                   // links to a User document
},
      },
{ timestamps: true }
  );

module.exports = mongoose.model("grievance", grievanceSchema);