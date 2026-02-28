"use strict";

var router = require('express').Router();

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken'); // Mock User (In production, find this in MongoDB/PostgreSQL)


var adminUser = {
  id: "1",
  username: "kunal_admin",
  passwordHash: "" // This would be the hashed version of his password

};
router.post('/login', function _callee(req, res) {
  var _req$body, username, password, validPass, token;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, password = _req$body.password; // 1. Check Username

          if (!(username !== adminUser.username)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).send("User not found"));

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(bcrypt.compare(password, adminUser.passwordHash));

        case 5:
          validPass = _context.sent;

          if (validPass) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", res.status(400).send("Invalid Password"));

        case 8:
          // 3. Create and assign a token
          token = jwt.sign({
            id: adminUser.id,
            role: 'admin'
          }, process.env.JWT_SECRET, {
            expiresIn: '2h'
          } // Token expires in 2 hours for security
          );
          res.header('Authorization', token).send({
            token: token,
            user: {
              username: adminUser.username,
              role: 'admin'
            }
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
});