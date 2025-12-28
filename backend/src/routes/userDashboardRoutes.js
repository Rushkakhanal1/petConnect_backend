const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getUserDashboard } = require('../controllers/userDashboardController');

// USER DASHBOARD
router.get('/dashboard', protect, getUserDashboard);

module.exports = router;
