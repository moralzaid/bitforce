const express = require('express');
const router = express.Router();
const {
  getAgroZones,
  getAgroZoneById,
  refillChiliTank,
  calibrateAgroZone
} = require('../controllers/agricultureController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAgroZones);
router.get('/:id', getAgroZoneById);
router.patch('/:id/refill', protect, authorize('Agricultural Officer', 'Judge/Admin'), refillChiliTank);
router.patch('/:id/calibrate', protect, authorize('Agricultural Officer', 'Judge/Admin'), calibrateAgroZone);

module.exports = router;
