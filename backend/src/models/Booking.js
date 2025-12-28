const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  daycare: { type: mongoose.Schema.Types.ObjectId, ref: 'Daycare', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 🔹 store user reference
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  package: { type: String, required: true }, // e.g., "half-day" or "full-day"
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
