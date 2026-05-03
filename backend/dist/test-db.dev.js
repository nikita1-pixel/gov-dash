"use strict";

require('dotenv').config();

var _require = require('pg'),
    Pool = _require.Pool;

var pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

function testConnection() {
  var res;
  return regeneratorRuntime.async(function testConnection$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("🔍 Testing connection to:", process.env.DATABASE_URL);
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(pool.query('SELECT NOW() as current_time, current_database() as db_name'));

        case 4:
          res = _context.sent;
          console.log("✅ SUCCESS!");
          console.log("Connected to database:", res.rows[0].db_name);
          console.log("Server time:", res.rows[0].current_time);
          process.exit(0);
          _context.next = 16;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](1);
          console.error("❌ CONNECTION FAILED:");
          console.error(_context.t0.message);
          process.exit(1);

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 11]]);
}

testConnection();