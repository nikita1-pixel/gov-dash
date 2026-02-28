"use strict";

require('dotenv').config();

var express = require('express');

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    DataTypes = _require.DataTypes; // Import DataTypes here


var cors = require('cors');

var app = express();
app.use(express.json());
app.use(cors()); // 1. FIRST: Initialize the connection

var sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
}); // 2. SECOND: Define the Model (Now 'sequelize' is defined!)

var Grievance = sequelize.define('Grievance', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: function defaultValue() {
      return "GR-".concat(Math.floor(1000 + Math.random() * 9000));
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Roads', 'Water', 'Electricity', 'Garbage', 'Other'),
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('High', 'Medium', 'Low'),
    defaultValue: 'Medium'
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Progress', 'Resolved'),
    defaultValue: 'Pending'
  }
});
app.get('/api/grievances', function _callee(req, res) {
  var data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Grievance.findAll({
            order: [['createdAt', 'DESC']]
          }));

        case 3:
          data = _context.sent;
          res.json(data);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            error: _context.t0.message
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}); // 3. THIRD: Define your Routes

app.post('/api/grievances/create', function _callee2(req, res) {
  var _req$body, title, location, category, priority, newGrievance;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, title = _req$body.title, location = _req$body.location, category = _req$body.category, priority = _req$body.priority;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Grievance.create({
            title: title,
            location: location,
            category: category,
            priority: priority
          }));

        case 4:
          newGrievance = _context2.sent;
          res.status(201).json(newGrievance);
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          res.status(400).json({
            error: _context2.t0.message
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
app.put('/api/grievances/:id/resolve', function _callee3(req, res) {
  var id, grievance;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          id = req.params.id;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Grievance.findByPk(id));

        case 4:
          grievance = _context3.sent;

          if (!grievance) {
            _context3.next = 12;
            break;
          }

          grievance.status = 'Resolved';
          _context3.next = 9;
          return regeneratorRuntime.awrap(grievance.save());

        case 9:
          res.json({
            message: "Status updated to Resolved",
            data: grievance
          });
          _context3.next = 13;
          break;

        case 12:
          res.status(404).json({
            error: "Grievance not found"
          });

        case 13:
          _context3.next = 18;
          break;

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            error: _context3.t0.message
          });

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 15]]);
}); // 4. FOURTH: Sync and Listen

sequelize.sync().then(function () {
  console.log("✅ Postgres Database Synced");
  app.listen(5000, function () {
    return console.log("🚀 Server running on http://localhost:5000");
  });
}); // Example Express route to get office data

app.get('/api/office/appointments', function _callee4(req, res) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          try {
            // const appointments = await db.query('SELECT * FROM daily_office ORDER BY time ASC');
            // res.json(appointments);
            // Mock data that mimics a database response
            res.json([{
              id: 1,
              title: "Budget Review with Finance",
              time: "11:00 AM",
              type: "Official",
              priority: "High"
            }, {
              id: 2,
              title: "Citizen Delegation - Ward 4",
              time: "01:00 PM",
              type: "Meeting",
              priority: "Medium"
            }]);
          } catch (err) {
            res.status(500).send("Server Error");
          }

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
});