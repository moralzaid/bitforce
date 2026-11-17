const mongoose = require('mongoose');

const perimeterNodeSchema = new mongoose.Schema(
  {
    nodeId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    sectorName: {
      type: String,
      required: true,
      trim: true
    },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    solarBatteryLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 94
    },
    pvChargingState: {
      type: String,
      enum: ['Bulk Charging', 'Absorption', 'Float', 'Discharging', 'Solar Offline'],
      default: 'Float'
    },
    aiEdgeStatus: {
      type: String,
      enum: ['Online', 'Degraded', 'Offline'],
      default: 'Online'
    },
    aiConfidenceThreshold: {
      type: Number,
      min: 50,
      max: 99,
      default: 85
    },
    solenoidValveIds: [
      {
        type: String
      }
    ],
    acousticArrayIds: [
      {
        type: String
      }
    ],
    lastPing: {
      type: Date,
      default: Date.now
    },
    latencyMs: {
      type: Number,
      default: 42
    },
    loraRssiDbm: {
      type: Number,
      default: -68
    },
    meshHopCount: {
      type: Number,
      default: 1
    },
    hardwareStatus: {
      type: String,
      enum: ['Nominal', 'Warning', 'Fault', 'Deactivated'],
      default: 'Nominal'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('PerimeterNode', perimeterNodeSchema);
