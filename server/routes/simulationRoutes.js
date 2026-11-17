const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  simulateBreach,
  simulateChaosTest,
  resetSimulationState,
  getSystemState,
  uploadTestImage
} = require('../controllers/simulationController');

// Multer Storage Configuration
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'test-subject-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.post('/breach', simulateBreach);
router.post('/chaos-test', simulateChaosTest);
router.post('/reset', resetSimulationState);
router.get('/state', getSystemState);
router.post('/upload-test-image', upload.single('image'), uploadTestImage);

module.exports = router;
