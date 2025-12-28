const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },   // Must be called 'pet'
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Must be called 'user'
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('AdoptionRequest', adoptionSchema);
