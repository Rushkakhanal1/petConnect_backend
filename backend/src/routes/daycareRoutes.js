const express = require('express');
const router = express.Router();
const Daycare = require('../models/Daycare');

// ------------------- GET ALL DAYCARES -------------------
router.get('/', async (req, res) => {
  try {
    const daycares = await Daycare.find();
    res.json(daycares);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ------------------- CREATE DAYCARE -------------------
router.post('/', async (req, res) => {
  try {
    const { name, location, capacity, packages } = req.body;

    // Basic validation
    if (!name || !location || !capacity || !packages) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const daycare = new Daycare({ name, location, capacity, packages });
    await daycare.save();

    res.status(201).json({ message: 'Daycare created', daycare });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
