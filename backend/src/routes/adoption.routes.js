const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
  applyAdoption,
  getAdoptionStatus,
  updateAdoptionStatus,
  getPetAdoptions,
  getAdoptionHistory
} = require('../controllers/adoptionController');

// ------------------- USER ROUTES -------------------

// Apply to adopt a pet
router.post('/:id/adopt', protect, authorize('user'), applyAdoption);

// Get adoption status for a pet
router.get('/:id/adopt/status', protect, authorize('user'), getAdoptionStatus);

// Get user's adoption history
router.get('/history', protect, authorize('user'), getAdoptionHistory);

// ------------------- BUSINESS ROUTES -------------------

// Approve/Reject adoption
router.put('/:appId/status', protect, authorize('business'), updateAdoptionStatus);

// Get all adoption applications for a pet
router.get('/pet/:id', protect, authorize('business'), getPetAdoptions);

module.exports = router;
