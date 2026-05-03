"use strict";

// backend/routes/grievances.js
// GET all grievances
var express = require('express');

var router = express.Router();

var _require = require('pg'),
    Pool = _require.Pool;

var pool = new Pool({
  connectionString: process.env.DATABASE_URL
}); // GET all grievances

router.get('/', function _callee(req, res) {
  var result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(pool.query('SELECT * FROM "Grievances" ORDER BY "createdAt" DESC'));

        case 3:
          result = _context.sent;
          res.json(result.rows);
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0.message);
          res.status(500).send("Server Error");

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
module.exports = router;
router.put('/:id', function _callee2(req, res) {
  var _req$body, title, location, priority, status, result;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, title = _req$body.title, location = _req$body.location, priority = _req$body.priority, status = _req$body.status;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(pool.query("UPDATE \"Grievances\" SET title=$1, location=$2, priority=$3, status=$4, \"updatedAt\"=NOW() \n             WHERE id=$5 RETURNING *", [title, location, priority, status, req.params.id]));

        case 4:
          result = _context2.sent;
          res.json(result.rows[0]);
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](1);
          res.status(500).json({
            error: _context2.t0.message
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 8]]);
}); // POST: Create a new grievance
// backend/routes/Grievances.js

var authenticateToken = function authenticateToken(req, res, next) {
  var authHeader = req.headers['authorization'];
  var token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({
    message: "No token provided"
  }); // Ensure 'your_jwt_secret' matches what you used in your login route

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', function (err, user) {
    if (err) return res.status(403).json({
      message: "Invalid token"
    });
    req.user = user;
    next();
  });
}; // 2. NOW THIS LINE WILL WORK:


router.post('/', authenticateToken, function _callee3(req, res) {
  var _req$body2, title, location, priority, latitude, longitude, description, result;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body2 = req.body, title = _req$body2.title, location = _req$body2.location, priority = _req$body2.priority, latitude = _req$body2.latitude, longitude = _req$body2.longitude, description = _req$body2.description;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(pool.query("INSERT INTO grievances (title, location, priority, latitude, longitude, description, status) VALUES ($1, $2, $3, $4, $5, $6, 'Pending') RETURNING *", [title, location, priority, latitude, longitude, description]));

        case 4:
          result = _context3.sent;
          res.status(201).json(result.rows[0]);
          _context3.next = 12;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](1);
          console.error(_context3.t0.message);
          res.status(500).send("Server Error");

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 8]]);
}); // Example Express Controller Logic

exports.createGrievance = function _callee4(req, res) {
  var _req$body3, title, location, priority, status, image, newGrievance;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body3 = req.body, title = _req$body3.title, location = _req$body3.location, priority = _req$body3.priority, status = _req$body3.status, image = _req$body3.image;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Grievance.create({
            title: title,
            location: location,
            priority: priority,
            status: status || 'Pending',
            image: image,
            // Ensure this is included!
            userId: req.user.id // This comes from your auth middleware

          }));

        case 4:
          newGrievance = _context4.sent;
          res.status(201).json(newGrievance);
          _context4.next = 12;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          console.error(_context4.t0);
          res.status(500).json({
            message: "Failed to create grievance"
          });

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports = router;