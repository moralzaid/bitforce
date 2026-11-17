const express = require('express');
const router = express.Router();
const {
  getElephants,
  getElephantById,
  createElephant,
  updateElephant,
  updateMusthStatus,
  deleteElephant
} = require('../controllers/veterinaryController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getElephants);
router.get('/:id', getElephantById);
router.post('/', protect, authorize('Veterinary Officer', 'Judge/Admin'), createElephant);
router.put('/:id', protect, authorize('Veterinary Officer', 'Judge/Admin'), updateElephant);
router.patch('/:id/musth-status', protect, authorize('Veterinary Officer', 'Judge/Admin'), updateMusthStatus);
router.delete('/:id', protect, authorize('Veterinary Officer', 'Judge/Admin'), deleteElephant);

module.exports = router;
