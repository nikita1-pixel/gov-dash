const express  = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post("/create-user", authenticateToken, authorizeRoles("admin"), authController.createUser);


module.exports = router;