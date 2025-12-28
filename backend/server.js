require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// ------------------- ROUTES -------------------
const authRoutes = require('./src/routes/auth.routes');
const daycareRoutes = require('./src/routes/daycareRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const petRoutes = require('./src/routes/pet.routes'); // optional (for pet profiles)

// const shelterRoutes = require('./src/routes/shelter.routes'); // legacy
// const adoptionRoutes = require('./src/routes/adoption.routes'); // removed

const app = express();

// ------------------- MIDDLEWARE -------------------
app.use(cors());
app.use(express.json());

// ------------------- API ROUTES -------------------
app.use('/api/auth', authRoutes);
app.use('/api/daycares', daycareRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/pets', petRoutes); // optional

// ------------------- ROOT ROUTE -------------------
app.get('/', (req, res) => {
  res.send('Pet Daycare API is running 🚀');
});

// ------------------- DATABASE & SERVER -------------------
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });
