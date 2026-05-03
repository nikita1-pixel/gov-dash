"use strict";

var express = require('express');

var jwt = require('jsonwebtoken');

var bcrypt = require('bcryptjs');

var cors = require('cors');

var helmet = require('helmet');

var authRoutes = require('./routes/auth');

var app = express(); // Security Middleware

app.use(helmet());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use(express.json());
var SECRET_KEY = "your_ultra_secure_secret_key"; // Move to .env later
// Mock Database

var users = []; // Register Route

app.post('/api/register', function _callee(req, res) {
  var hashedPassword;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, 10));

        case 2:
          hashedPassword = _context.sent;
          users.push({
            username: req.body.username,
            password: hashedPassword
          });
          res.status(201).send("User Registered");

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}); // Login Route

app.post('/api/login', function _callee2(req, res) {
  var user, token;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          user = users.find(function (u) {
            return u.username === req.body.username;
          });
          _context2.t0 = !user;

          if (_context2.t0) {
            _context2.next = 6;
            break;
          }

          _context2.next = 5;
          return regeneratorRuntime.awrap(bcrypt.compare(req.body.password, user.password));

        case 5:
          _context2.t0 = !_context2.sent;

        case 6:
          if (!_context2.t0) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.status(401).send("Invalid Credentials"));

        case 8:
          // Generate Secure Token
          token = jwt.sign({
            username: user.username
          }, SECRET_KEY, {
            expiresIn: '1h'
          });
          res.json({
            token: token
          });

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // At the bottom of server.js

var PORT = process.env.PORT || 5000; // THIS IS THE KEY: It keeps the process running and listening for the frontend

app.listen(PORT, function () {
  console.log('------------------------------------');
  console.log("\uD83D\uDE80 SERVER IS LIVE AT: http://localhost:".concat(PORT));
  console.log('------------------------------------');
});