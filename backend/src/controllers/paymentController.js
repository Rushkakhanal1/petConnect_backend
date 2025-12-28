const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { creditWallet } = require('./walletController');
const axios = require('axios'); // For Khalti API

// ------------------- CREATE PAYMENT -------------------
exports.createPayment = async (req, res) => {
  try {
    const { bookingId, amount, method, token } = req.body;
    const user = req.user;

    if (!amount || !method) return res.status(400).json({ message: 'Amount and payment method required' });

    let transactionId;

    // ---------------- Khalti Payment ----------------
    if (method === 'Khalti') {
      // Verify Khalti token
      const resKhalti = await axios.post(
        'https://khalti.com/api/v2/payment/verify/',
        { token, amount },
        {
          headers: {
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`
          }
        }
      );
      transactionId = resKhalti.data.idx;
    }

    // ---------------- Wallet Payment ----------------
    if (method === 'Wallet') {
      const walletCredited = await creditWallet(user._id, -amount, `Payment for booking ${bookingId}`);
      transactionId = walletCredited.txnId;
    }

    // ---------------- Card Payment ----------------
    // For demo, assume transactionId is a generated string
    if (method === 'Card') {
      transactionId = `CARD-${Date.now()}`;
    }

    const payment = await Payment.create({
      user: user._id,
      booking: bookingId,
      amount,
      method,
      status: 'Success',
      transactionId
    });

    // Update booking status if payment for booking
    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (booking) {
        booking.status = 'paid';
        await booking.save();
      }
    }

    res.json({ message: 'Payment successful', payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment failed', error: error.message });
  }
};

// ------------------- GET TRANSACTION HISTORY -------------------
exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await Payment.find({ user: userId })
      .populate('booking', 'pet daycare date')
      .sort({ createdAt: -1 });
    res.json({ message: 'Transaction history fetched', transactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
