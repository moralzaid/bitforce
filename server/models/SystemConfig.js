const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'trident_global_config'
    },
    engineeringActive: {
      type: Boolean,
      default: true
    },
    veterinaryActive: {
      type: Boolean,
      default: true
    },
    agricultureActive: {
      type: Boolean,
      default: true
    },
    aiConfidenceThreshold: {
      type: Number,
      min: 50,
      max: 99,
      default: 85
    },
    musthAggressionMultiplier: {
      type: Number,
      min: 1.0,
      max: 3.0,
      default: 1.8
    },
    maxSafeWindSpeedKmh: {
      type: Number,
      default: 25
    },
    minChiliTankReservePct: {
      type: Number,
      default: 15
    },
    chiliDischargeDurationSec: {
      type: Number,
      default: 6
    },
    beeFrequencyBandHz: {
      type: Number,
      default: 380
    },
    judgeDemoMode: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('SystemConfig', systemConfigSchema);
