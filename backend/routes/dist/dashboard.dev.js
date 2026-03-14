const express = require('express');
const router = express.Router();
const authorize = require('./middleware/auth');

// Only Admins (Corporator) can access Budget & Funds
router.get('/budget-overview', authorize(['admin']), (req, res) => {
  res.json({ message: "Secure Budget Data Accessed" });
});

// Both Admin and Staff can manage Citizen Grievances
router.get('/grievances', authorize(['admin', 'staff']), (req, res) => {
  res.json({ message: "Grievance List Accessed" });
});

// Any authenticated user (Citizen) can view their own profile
router.get('/my-profile', authorize(), (req, res) => {
  res.json({ user: req.user });
});