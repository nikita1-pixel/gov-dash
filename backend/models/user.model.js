const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,      // builds a unique index — no duplicate emails
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,    // this stores the HASH, never the raw password
        },
        role: {
            type: String,
            enum: ["citizen", "staff", "admin"], // only these 3 are allowed
            default: "citizen",                   // safest default (least
        },
        ward: {
            type: String,
              default: "N/A",
        },
      },
    { timestamps: true } // auto createdAt + updatedAt
  );

// Never leak the password hash in any response
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model("user", userSchema);