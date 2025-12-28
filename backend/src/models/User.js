const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  phone: { type: String },
  address: { type: String },
  role: { type: String, enum: ['user', 'business', 'shelter'], default: 'user' },
  businessName: { type: String },
  businessAddress: { type: String },
  earnings: { type: Number, default: 0 },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  passwordChangedAt: { type: Date }, // ✅ Add this
}, { timestamps: true });

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);
