const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const {
  createBooking,
  payBooking,
  rejectBooking,
  approveBooking,
  getBookingHistory,
  getBookingsForDaycare
} = require('../controllers/bookingController');

// ------------------- CREATE BOOKING -------------------
router.post('/', protect, createBooking);

// ------------------- PAY BOOKING -------------------
router.put('/:bookingId/pay', protect, payBooking);

// ------------------- APPROVE BOOKING -------------------
router.put('/:bookingId/approve', protect, approveBooking);

// ------------------- REJECT BOOKING -------------------
router.put('/:bookingId/reject', protect, rejectBooking);

// ------------------- USER BOOKING HISTORY -------------------
router.get('/my', protect, getBookingHistory);

// ------------------- DAYCARE VIEW BOOKINGS -------------------
router.get('/daycare/:daycareId', protect, getBookingsForDaycare);

module.exports = router;
