const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function signToken(user) {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );
}

async function registerUser(req, res) {
    try {
        const { name, email, password, ward } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required" });
          }

          const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return res.status(409).json({
                    message: "Email already in use"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await userModel.create({
                name, email, password:
                    hashedPassword, ward
            });

            const token = signToken(user);
            return res.status(201).json({
                message: "User registered", token,
                user
            });
        } catch (err) {
            if (err.code === 11000) {
                return res.status(409).json({
                    message: "Email already in use"
                });
            }
            console.error("Register error:", err.message);
            return res.status(500).json({ message: "Server error" });
        }
    }

  async function loginUser(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    message: "Email and password are required" });
          }

          const user = await userModel.findOne({ email });
                if (!user) {
                    return res.status(401).json({
                        message: "Invalid credentials"
                    });
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(401).json({
                        message: "Invalid credentials"
                    });
                }

                const token = signToken(user);
                return res.status(200).json({
                    message: "Login successful", token,
                    user
                });
            } catch (err) {
                console.error("Login error:", err.message);
                return res.status(500).json({ message: "Server error" });
            }
        }

// ADMIN-ONLY: create a user with any role (staff/admin). Protected by middleware.
async function createUser(req, res) {
    try {
        const { name, email, password, role, ward } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required" }); }

          const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return res.status(409).json({
                    message: "Email already in use"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            // role IS allowed here (unlike public register) — but only because
            // this route is locked to admins by middleware
            const user = await userModel.create({
                name, email, password:
                    hashedPassword, role, ward
            });

            return res.status(201).json({ message: "User created", user });
        } catch (err) {
            if (err.code === 11000) return res.status(409).json({
                message:
                    "Email already in use"
            });
            console.error("Create user error:", err.message);
            return res.status(500).json({ message: "Server error" });
        }
    }

module.exports = { registerUser, loginUser, createUser };