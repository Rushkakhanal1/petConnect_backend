const Booking = require('../models/Booking');
const Daycare = require('../models/Daycare');
const { creditWallet, refundWallet } = require('./walletController');

// ------------------- CREATE BOOKING -------------------
exports.createBooking = async (req, res) => {
  try {
    const { petId, daycareId, package, date } = req.body;
    const user = req.user;

    if (!petId || !daycareId || !package || !date) {
      return res.status(400).json({ message: 'petId, daycareId, package, and date are required' });
    }

    const daycare = await Daycare.findById(daycareId);
    if (!daycare) return res.status(404).json({ message: 'Daycare not found' });

    const selectedPackage = daycare.packages.find(p => p.type === package);
    if (!selectedPackage) return res.status(400).json({ message: 'Invalid package' });

    const bookingsOnDate = await Booking.countDocuments({
      daycare: daycareId,
      date,
      status: { $in: ['pending', 'paid'] }
    });
    if (bookingsOnDate >= daycare.capacity) {
      return res.status(400).json({ message: 'No slots available for this date' });
    }

    const booking = await Booking.create({
      pet: petId,
      daycare: daycareId,
      user: user._id,
      userName: user.name,
      userEmail: user.email,
      package,
      date,
      amount: selectedPackage.price,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Booking created successfully. Please proceed to payment.',
      bookingId: booking._id,
      amount: booking.amount
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ------------------- PAY BOOKING -------------------
exports.payBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'paid') return res.status(400).json({ message: 'Booking already paid' });

    booking.status = 'paid';
    await booking.save();

    const wallet = await creditWallet(
      booking.daycare,
      booking.amount,
      `Payment for booking ${booking._id}`
    );

    res.json({ message: 'Payment successful', booking, wallet });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ------------------- APPROVE BOOKING -------------------
exports.approveBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'paid') return res.status(400).json({ message: 'Booking already approved/paid' });

    booking.status = 'paid';
    await booking.save();

    const wallet = await creditWallet(
      booking.daycare,
      booking.amount,
      `Approved booking payment for ${booking._id}`
    );

    res.json({ message: 'Booking approved & payment credited', booking, wallet });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ------------------- REJECT BOOKING -------------------
exports.rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'cancelled') return res.status(400).json({ message: 'Already rejected/cancelled' });

    // Refund if already paid
    if (booking.status === 'paid') {
      await refundWallet(
        booking.daycare,
        booking.amount,
        `Refund for cancelled booking ${booking._id}`
      );
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking rejected and payment refunded if applicable', booking });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ------------------- USER BOOKING HISTORY -------------------
exports.getBookingHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ user: userId })
      .populate('pet', 'name breed')
      .populate('daycare', 'name location');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ------------------- DAYCARE VIEW BOOKINGS -------------------
exports.getBookingsForDaycare = async (req, res) => {
  try {
    const { daycareId } = req.params;
    const bookings = await Booking.find({ daycare: daycareId })
      .populate('pet', 'name breed')
      .populate('user', 'name email')
      .populate('daycare', 'name location');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
