const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getWalletByDaycare } = require('../controllers/walletController');

// Get wallet info for a daycare
router.get('/:daycareId', protect, getWalletByDaycare);

module.exports = router;
