const jwt = require('jsonwebtoken');

/**
 * Middleware 1: Simple Token Verification
 * Use this for routes that just need the user to be logged in.
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"]; 
    const token = authHeader && authHeader.split(" ")[1]; // format: "Bearer <token>"

    if (!token) {
        return res.status(401).json({
            message: "No token, authorization denied" });
      }

      try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // { id, role } — comes from what we signed at  login
            next();             // token good → let the request continue
        } catch (err) {
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }
    }
/**
 * Middleware 2: Role-Based Authorization
 * Use this for routes that require specific roles (e.g., ['admin']).
 */
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Forbidden: insufficient permissions" });
          }
          next();
        };
    }

module.exports = { authenticateToken, authorizeRoles };