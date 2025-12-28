require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Shelter = require('./src/models/Shelter');
const Pet = require('./src/models/Pet');
const Booking = require('./src/models/Booking');
const DaycareBooking = require('./src/models/DaycareBooking');
const Wallet = require('./src/models/Wallet');

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear collections
    await Shelter.deleteMany({});
    await Pet.deleteMany({});
    await Booking.deleteMany({});
    await DaycareBooking.deleteMany({});
    await Wallet.deleteMany({});

    // Create shelter
    const shelter = new Shelter({
      name: 'Happy Paws Shelter',
      email: 'shelter@example.com',
      pets: [],
      bookings: [],
      earnings: 0
    });
    await shelter.save();
    console.log('Shelter created:', shelter);

    // Create pets
    const pet1 = new Pet({ name: 'Buddy', type: 'Dog', age: 3, shelter: shelter._id });
    const pet2 = new Pet({ name: 'Mittens', type: 'Cat', age: 2, shelter: shelter._id });
    await pet1.save();
    await pet2.save();

    // Add pets to shelter
    shelter.pets.push(pet1._id, pet2._id);
    await shelter.save();
    console.log('Pets added:', [pet1.name, pet2.name]);

    // Create adoption booking
    const booking = new Booking({
      pet: pet1._id,
      shelter: shelter._id,
      status: 'pending',
      userName: 'Alice Smith',         // required
      userEmail: 'alice@example.com',  // required
      date: new Date()                 // required
    });
    await booking.save();
    shelter.bookings.push(booking._id);

    // Create daycare booking
    const daycareBooking = new DaycareBooking({
      pet: pet2._id,
      shelter: shelter._id,
      userName: 'John Doe',
      userEmail: 'john@example.com',
      date: new Date(),
      status: 'pending'
    });
    await daycareBooking.save();
    shelter.bookings.push(daycareBooking._id);

    await shelter.save();

    // Create wallet
    const wallet = new Wallet({
      shelter: shelter._id,
      balance: 0,
      transactions: []
    });
    await wallet.save();

    // Generate JWT token
    const token = jwt.sign({ id: shelter._id }, JWT_SECRET, { expiresIn: '7d' });
    console.log('JWT Token for testing:', token);

    console.log('✅ Seed completed successfully');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
