const express = require('express');
const router = express.Router();
const { getAnalyticsOverview, getDependencyProof } = require('../controllers/incidentController');

router.get('/overview', getAnalyticsOverview);
router.get('/dependency-proof', getDependencyProof);

module.exports = router;
