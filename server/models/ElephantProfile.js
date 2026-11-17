const mongoose = require('mongoose');

const elephantProfileSchema = new mongoose.Schema(
  {
    collarId: {
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
    classification: {
      type: String,
      required: true,
      enum: ['Solitary Bull', 'Matriarch Herd', 'Bachelor Group'],
      default: 'Solitary Bull'
    },
    age: {
      type: Number,
      required: true
    },
    estimatedWeightKg: {
      type: Number,
      default: 4200
    },
    morphotype: {
      type: String,
      enum: ['Tusker', 'Makna (Tuskless Bull)', 'Female / Cow'],
      default: 'Tusker'
    },
    musthStatus: {
      type: String,
      enum: ['Active', 'Pre-Musth', 'Post-Musth', 'N/A - Female'],
      default: 'Pre-Musth'
    },
    testosteroneIndex: {
      type: Number,
      min: 0,
      max: 100,
      default: 25
    },
    aggressionScore: {
      type: Number,
      min: 1,
      max: 10,
      default: 5
    },
    habituationIndex: {
      type: Number,
      min: 0,
      max: 100,
      default: 15
    },
    calvesPresent: {
      type: Boolean,
      default: false
    },
    calfCount: {
      type: Number,
      default: 0
    },
    herdSize: {
      type: Number,
      default: 1
    },
    lastCoordinates: {
      latitude: { type: Number, default: 6.8219 },
      longitude: { type: Number, default: 80.9982 }
    },
    breachCount: {
      type: Number,
      default: 0
    },
    imageUrl: {
      type: String,
      default: '/images/elephants/default.jpg'
    },
    temporalDrainageActive: {
      type: Boolean,
      default: false
    },
    bioNotes: {
      type: String,
      default: 'Tracked subject within HEC corridor.'
    },
    hormoneHistory: [
      {
        timestamp: { type: Date, default: Date.now },
        testosteroneIndex: Number,
        musthStatus: String,
        aggressionScore: Number
      }
    ],
    recommendedProtocol: {
      type: String,
      enum: [
        'Acoustic_Bee_Only',
        'Dual_Acoustic_Chili_Pulse',
        'Max_Pressure_Chili_Curtain',
        'Passive_Tracking'
      ],
      default: 'Acoustic_Bee_Only'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ElephantProfile', elephantProfileSchema);
