const mongoose = require('mongoose');

const daycareSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  packages: [
    {
      type: {
        type: String,
        enum: ['half-day', 'full-day'],
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Daycare', daycareSchema);
