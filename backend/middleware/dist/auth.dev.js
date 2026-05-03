"use strict";

var jwt = require('jsonwebtoken');
/**
 * Middleware 1: Simple Token Verification
 * Use this for routes that just need the user to be logged in.
 */


function authenticateToken(req, res, next) {
  var authHeader = req.headers['authorization'];
  var token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({
    message: "No token provided"
  });
  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) return res.status(403).json({
      message: "Invalid or expired token"
    }); // Attaches user data (id, role) to the request object

    req.user = decoded;
    next();
  });
}
/**
 * Middleware 2: Role-Based Authorization
 * Use this for routes that require specific roles (e.g., ['admin']).
 */


var authorize = function authorize() {
  var allowedRoles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return function (req, res, next) {
    try {
      var authHeader = req.headers.authorization;
      var token = authHeader && authHeader.split(" ")[1];
      if (!token) return res.status(401).json({
        message: "No token, authorization denied"
      });
      var decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Check if user has the required role

      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Access denied: ".concat(req.user.role, " role is not authorized.")
        });
      }

      next();
    } catch (err) {
      res.status(401).json({
        message: "Token is not valid"
      });
    }
  };
};

module.exports = {
  authenticateToken: authenticateToken,
  authorize: authorize
};