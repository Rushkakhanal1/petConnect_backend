const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }, // optional if payment is for booking
  amount: { type: Number, required: true },
  method: { type: String, enum: ['Khalti', 'Card', 'Wallet'], required: true },
  status: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Pending' },
  transactionId: String, // from Khalti or payment gateway
  receiptUrl: String, // optional: PDF/URL of receipt
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
