"use strict";

var pool = require('./db'); // Ensure this points to your db configuration file


var seedGrievances = function seedGrievances() {
  var grievances, _i, _grievances, g;

  return regeneratorRuntime.async(function seedGrievances$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          grievances = [{
            subject: 'Pothole on Main Road',
            category: 'Roads',
            description: 'Large pothole causing traffic near the junction.',
            status: 'Pending',
            ward: 'Karve Nagar',
            lat: 18.4912,
            lng: 73.8215
          }, {
            subject: 'Street Light Not Working',
            category: 'Electricity',
            description: 'Street lights out for 3 days.',
            status: 'In Progress',
            ward: 'Kothrud',
            lat: 18.5074,
            lng: 73.8077
          }, {
            subject: 'Water Leakage',
            category: 'Water Supply',
            description: 'Main pipe burst near the school.',
            status: 'Pending',
            ward: 'Shivajinagar',
            lat: 18.5308,
            lng: 73.8475
          }, {
            subject: 'Garbage Overflow',
            category: 'Sanitation',
            description: 'Public bin not cleared since Monday.',
            status: 'Resolved',
            ward: 'Erandwane',
            lat: 18.5121,
            lng: 73.8322
          }, {
            subject: 'Broken Footpath',
            category: 'Roads',
            description: 'Tiles are loose and dangerous for seniors.',
            status: 'Pending',
            ward: 'Aundh',
            lat: 18.5580,
            lng: 73.8075
          }, {
            subject: 'Drainage Blockage',
            category: 'Sewage',
            description: 'Sewage backup in residential area.',
            status: 'In Progress',
            ward: 'Hadapsar',
            lat: 18.5089,
            lng: 73.9259
          }, {
            subject: 'Illegal Parking',
            category: 'Traffic',
            description: 'Trucks parked in no-parking zone.',
            status: 'Pending',
            ward: 'Viman Nagar',
            lat: 18.5679,
            lng: 73.9143
          }, {
            subject: 'Park Maintenance',
            category: 'Gardens',
            description: 'Benches broken in the local park.',
            status: 'Resolved',
            ward: 'Baner',
            lat: 18.5590,
            lng: 73.7797
          }, {
            subject: 'Low Water Pressure',
            category: 'Water Supply',
            description: 'Residents reporting very low pressure.',
            status: 'In Progress',
            ward: 'Warje',
            lat: 18.4795,
            lng: 73.8021
          }, {
            subject: 'Open Manhole',
            category: 'Sewage',
            description: 'Hazardous open manhole on side street.',
            status: 'Pending',
            ward: 'Kondhwa',
            lat: 18.4771,
            lng: 73.8907
          }];
          _context.prev = 1;
          console.log("🌱 Seeding database with map-ready grievances..."); // Clear old test data if you want a clean start
          // await pool.query('DELETE FROM grievances');

          _i = 0, _grievances = grievances;

        case 4:
          if (!(_i < _grievances.length)) {
            _context.next = 11;
            break;
          }

          g = _grievances[_i];
          _context.next = 8;
          return regeneratorRuntime.awrap(pool.query("INSERT INTO grievances (subject, category, description, status, ward, latitude, longitude, created_at) \n                 VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())", [g.subject, g.category, g.description, g.status, g.ward, g.lat, g.lng]));

        case 8:
          _i++;
          _context.next = 4;
          break;

        case 11:
          console.log("✅ Successfully seeded 10 grievances with coordinates!");
          process.exit();
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](1);
          console.error("❌ Seeding failed:", _context.t0.message);
          process.exit(1);

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 15]]);
};

seedGrievances();