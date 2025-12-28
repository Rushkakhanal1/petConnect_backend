const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const daycareRoutes = require('./routes/daycareRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
// const shelterRoutes = require('./routes/shelter.routes'); // optional / legacy

const app = express();

// 🔹 Middlewares
app.use(cors());
app.use(express.json());

// 🔹 Routes
app.use('/api/auth', authRoutes);
app.use('/api/daycares', daycareRoutes);
app.use('/api/bookings', bookingRoutes);
// app.use('/api/shelters', shelterRoutes); // enable only if still needed

// 🔹 Health check
app.get('/', (req, res) => {
  res.send('Pet Daycare Backend is running 🚀');
});

// 🔹 Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong',
    error: err.message
  });
});

module.exports = app;
