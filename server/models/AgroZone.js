const mongoose = require('mongoose');

const agroZoneSchema = new mongoose.Schema(
  {
    zoneId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    bufferCropType: {
      type: String,
      enum: [
        'Chili-Citronella Barrier',
        'Palmyra Bio-Fence',
        'Paddy Field Perimeter',
        'Ginger-Lemongrass Buffer',
        'Acacia Deterrent Hedgerow'
      ],
      default: 'Chili-Citronella Barrier'
    },
    sectorIds: [
      {
        type: String
      }
    ],
    chiliTankCapacityLiters: {
      type: Number,
      default: 500
    },
    chiliTankCurrentLiters: {
      type: Number,
      default: 460
    },
    linePressurePsi: {
      type: Number,
      min: 0,
      max: 200,
      default: 145
    },
    acousticFrequencyHz: {
      type: Number,
      min: 200,
      max: 600,
      default: 380 // Swarm simulation frequency
    },
    acousticDecibels: {
      type: Number,
      min: 50,
      max: 120,
      default: 92
    },
    windSpeedKmh: {
      type: Number,
      default: 12
    },
    windDirectionDeg: {
      type: Number,
      default: 180 // Southbound (towards forest)
    },
    windSafetyLockActive: {
      type: Boolean,
      default: false
    },
    cropValuationUsd: {
      type: Number,
      default: 85000
    },
    villagesProtected: [
      {
        type: String
      }
    ],
    status: {
      type: String,
      enum: ['Armoured & Ready', 'Pressure Warning', 'Refill Required', 'Wind Lockout', 'Offline'],
      default: 'Armoured & Ready'
    }
  },
  {
    timestamps: true
  }
);

// Virtual for percentage tank
agroZoneSchema.virtual('tankPercentage').get(function () {
  return Math.round((this.chiliTankCurrentLiters / this.chiliTankCapacityLiters) * 100);
});

agroZoneSchema.set('toJSON', { virtuals: true });
agroZoneSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('AgroZone', agroZoneSchema);
