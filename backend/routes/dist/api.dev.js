"use strict";

var express = require('express');

var router = express.Router();

var authorize = require('../middleware/auth'); // --- GRIEVANCE ROUTES ---
// Both Admin and Staff can view and update grievances


router.get('/grievances', authorize(['admin', 'staff']), function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.post('/grievances/resolve', authorize(['admin', 'staff']), function _callee2(req, res) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // --- BUDGET ROUTES ---
// ONLY Admin can see or approve funds

router.get('/budget', authorize(['admin']), function _callee3(req, res) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
        case "end":
          return _context3.stop();
      }
    }
  });
});
router.post('/budget/approve', authorize(['admin']), function _callee4(req, res) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // --- EMERGENCY ROUTES ---
// ONLY Admin can broadcast alerts

router.post('/emergency/broadcast', authorize(['admin']), function _callee5(req, res) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
        case "end":
          return _context5.stop();
      }
    }
  });
});
module.exports = router;