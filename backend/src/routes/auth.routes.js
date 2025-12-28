const express = require('express');
const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
} = require('../controllers/auth.controller');

const { protect, authorize } = require('../middleware/auth'); // middleware path

// ------------------- SIGNUP -------------------
router.post('/signup', signup);

// ------------------- LOGIN -------------------
router.post('/login', login);

// ------------------- FORGOT PASSWORD -------------------
router.post('/forgot-password', forgotPassword);

// ------------------- RESET PASSWORD -------------------
router.post('/reset-password', resetPassword);

// ------------------- PROFILE -------------------
// GET profile (protected route)
router.get('/profile', protect, getProfile);

// PATCH profile (update profile) (protected route)
router.patch('/profile', protect, updateProfile);

// Example: Admin-only route
// router.get('/admin', protect, authorize('admin'), adminController.getAllUsers);

module.exports = router;
