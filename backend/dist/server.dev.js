"use strict";

var express = require('express');

var cors = require('cors');

var authRoutes = require('./routes/auth'); // This defines authRoutes!


var app = express();

var grievanceRoutes = require('./routes/Grievances');

var socialRoutes = require('./routes/social');

app.use('/api/social', socialRoutes);
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json({
  limit: '50mb'
}));
app.use(express.urlencoded({
  limit: '50mb',
  extended: true
})); // This tells the app: "For any URL starting with /api/auth, use the routes in auth.js"

app.use('/api/auth', authRoutes); // This tells the app: "For any URL starting with /api/grievances, use the routes in grievances.js"

app.use('/api/grievances', grievanceRoutes);
var PORT = 5000;
app.listen(PORT, function () {
  console.log("\uD83D\uDE80 SERVER IS ALIVE ON PORT ".concat(PORT));
});
process.on('unhandledRejection', function (reason, promise) {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
}); // Auto-refresh Instagram token every 7 days

setInterval(function _callee() {
  var r, data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch("https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=".concat(process.env.INSTAGRAM_ACCESS_TOKEN)));

        case 3:
          r = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(r.json());

        case 6:
          data = _context.sent;
          console.log('Instagram token refreshed, expires in:', data.expires_in, 'seconds');
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error('Token refresh failed:', _context.t0);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
}, 7 * 24 * 60 * 60 * 1000);