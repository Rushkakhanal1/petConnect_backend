const Daycare = require('../models/Daycare');

// Get all daycares
exports.getAllDaycares = async (req, res) => {
  try {
    const daycares = await Daycare.find();
    res.json(daycares);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
