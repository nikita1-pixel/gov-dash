const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Look for token in the 'Authorization' header
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Add user info to the request object
        next(); // Proceed to the dashboard data
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};