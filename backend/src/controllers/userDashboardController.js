const Adoption = require('../models/Adoption');
const Booking = require('../models/Booking');
const Pet = require('../models/Pet');

exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // ---------------- ADOPTIONS ----------------
    const adoptions = await Adoption.find({ user: userId })
      .populate({
        path: 'pet',
        select: 'name breed age photos shelterId'
      })
      .sort({ createdAt: -1 });

    // ---------------- BOOKINGS ----------------
    let bookings = [];
    try {
      bookings = await Booking.find({ user: userId })
        .populate('pet', 'name breed')
        .populate('daycare', 'name location')
        .sort({ createdAt: -1 });
    } catch (err) {
      // booking module might not exist yet
      bookings = [];
    }

    // ---------------- DASHBOARD RESPONSE ----------------
    res.json({
      message: 'User dashboard fetched successfully',
      dashboard: {
        adoptionSummary: {
          total: adoptions.length,
          pending: adoptions.filter(a => a.status === 'Pending').length,
          approved: adoptions.filter(a => a.status === 'Approved').length,
          rejected: adoptions.filter(a => a.status === 'Rejected').length,
          applications: adoptions
        },
        bookingSummary: {
          total: bookings.length,
          bookings
        }
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};
