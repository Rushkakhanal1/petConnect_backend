const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const {
  createShelter,
  getNearbyShelters,
  getShelterDetails,
  updateShelter,
  deleteShelter
} = require('../controllers/shelter.controller'); // matches file name exactly

// 🔹 Create a shelter (any authenticated user)
router.post('/', protect, authorize('user', 'business'), createShelter);

// 🔹 Get nearby shelters
router.get('/nearby', protect, authorize('user', 'shelter', 'business'), getNearbyShelters);

// 🔹 Get shelter details including pets
router.get('/:id', protect, authorize('user', 'shelter', 'business'), getShelterDetails);

// 🔹 Update shelter (shelter only)
router.put('/:id', protect, authorize('shelter'), updateShelter);

// 🔹 Delete shelter (shelter only)
router.delete('/:id', protect, authorize('shelter'), deleteShelter);

module.exports = router;
