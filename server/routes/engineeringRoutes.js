const express = require('express');
const router = express.Router();
const {
  getNodes,
  getNodeById,
  updateNodeStatus,
  runNodeDiagnostics
} = require('../controllers/engineeringController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getNodes);
router.get('/:id', getNodeById);
router.patch('/:id/status', protect, authorize('Field Engineer', 'Judge/Admin'), updateNodeStatus);
router.post('/:id/diagnostics', protect, authorize('Field Engineer', 'Judge/Admin'), runNodeDiagnostics);

module.exports = router;
