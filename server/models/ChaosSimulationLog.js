const mongoose = require('mongoose');

const chaosSimulationLogSchema = new mongoose.Schema(
  {
    testId: {
      type: String,
      required: true,
      unique: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    testedByRole: {
      type: String,
      default: 'Hackathon Judge / Admin'
    },
    disabledModules: {
      engineering: { type: Boolean, default: false },
      veterinary: { type: Boolean, default: false },
      agriculture: { type: Boolean, default: false }
    },
    failureMode: {
      type: String,
      required: true
    },
    catastrophicOutcome: {
      type: String,
      required: true
    },
    simulationSummary: {
      type: String,
      required: true
    },
    ecologicalImpact: {
      type: String
    },
    economicCropLossEstimateUsd: {
      type: Number,
      default: 0
    },
    humanCasualtyRiskLevel: {
      type: String,
      enum: ['LOW', 'MODERATE', 'SEVERE', 'CATASTROPHIC'],
      default: 'MODERATE'
    },
    logsDump: [
      {
        timestamp: String,
        subsystem: String,
        message: String,
        level: String
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ChaosSimulationLog', chaosSimulationLogSchema);
