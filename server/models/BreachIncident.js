const mongoose = require('mongoose');

const breachIncidentSchema = new mongoose.Schema(
  {
    incidentCode: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    nodeId: {
      type: String,
      required: true
    },
    sectorName: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    elephantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ElephantProfile'
    },
    elephantName: {
      type: String,
      default: 'Unknown Subject'
    },
    collarId: {
      type: String,
      default: 'N/A'
    },
    subjectType: {
      type: String,
      enum: ['Elephant', 'Wild Boar', 'Cattle', 'False Trigger'],
      default: 'Elephant'
    },
    // Stage 2: Engineering Telemetry
    engineering: {
      aiConfidence: { type: Number, default: 97.5 },
      opticalTrigger: { type: Boolean, default: true },
      thermalDeltaC: { type: Number, default: 4.8 },
      networkLatencyMs: { type: Number, default: 42 },
      solarLevel: { type: Number, default: 92 },
      boundingBox: {
        x: { type: Number, default: 220 },
        y: { type: Number, default: 140 },
        width: { type: Number, default: 340 },
        height: { type: Number, default: 380 }
      }
    },
    // Stage 3: Veterinary Assessment
    veterinary: {
      musthStatus: { type: String, default: 'Pre-Musth' },
      testosteroneIndex: { type: Number, default: 20 },
      aggressionScore: { type: Number, default: 4 },
      habituationIndex: { type: Number, default: 10 },
      calvesPresent: { type: Boolean, default: false },
      calfCount: { type: Number, default: 0 },
      biologicalThreatLevel: {
        type: String,
        enum: ['None', 'Low', 'Moderate', 'High', 'Critical'],
        default: 'Moderate'
      }
    },
    // Stage 4: Agricultural Intervention
    agriculture: {
      zoneId: { type: String, default: 'ZONE-01' },
      deterrentDeployed: {
        type: String,
        enum: [
          'Standby_Log_Only',
          'Acoustic_Bee_Swarm_Tier1',
          'Dual_Acoustic_Chili_Pulse_Tier2',
          'High_Pressure_Chili_Curtain_Tier3',
          'Safety_Lockout_No_Spray'
        ],
        default: 'Acoustic_Bee_Swarm_Tier1'
      },
      valveActuated: { type: String, default: 'SOL-04A' },
      valveDurationSec: { type: Number, default: 6 },
      chiliDischargedLiters: { type: Number, default: 4.5 },
      acousticFrequencyHz: { type: Number, default: 380 },
      tankRemainingLiters: { type: Number, default: 450 },
      windBlowbackCheckPassed: { type: Boolean, default: true }
    },
    // Outcome & Metrics
    outcome: {
      type: String,
      enum: [
        'Deterred - Retreated to Sanctuary Buffer',
        'Herd Redirected - Calves Protected',
        'Violent Charge Halted by Chili Curtain',
        'Monitored - Harmless Wildlife Logged',
        'CATASTROPHIC_BREACH_VILLAGE_INVADED',
        'FAILED_INDISCRIMINATE_SPRAY_STAMPEDE',
        'FAILED_TANK_EMPTY_RESOURCE_DEPLETED'
      ],
      default: 'Deterred - Retreated to Sanctuary Buffer'
    },
    cropDamagePreventedUsd: {
      type: Number,
      default: 3200
    },
    villageEarlyWarningDispatched: {
      type: Boolean,
      default: true
    },
    earlyWarningRecipients: [
      {
        village: String,
        smsSentCount: Number,
        sirenTriggered: Boolean
      }
    ],
    // Latency Telemetry Waterfall (ms)
    executionLatency: {
      t0_optical_thermal_detect_ms: { type: Number, default: 18 },
      t1_edge_yolo_infer_ms: { type: Number, default: 44 },
      t2_mesh_lora_relay_ms: { type: Number, default: 38 },
      t3_vet_biometric_lookup_ms: { type: Number, default: 62 },
      t4_tri_decision_calc_ms: { type: Number, default: 21 },
      t5_agro_valve_solenoid_ms: { type: Number, default: 55 },
      totalHandshakeTimeMs: { type: Number, default: 238 }
    },
    // Chaos Engineering status
    chaosTestRun: {
      type: Boolean,
      default: false
    },
    disabledModules: [
      {
        type: String,
        enum: ['engineering', 'veterinary', 'agriculture']
      }
    ],
    failureSummary: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('BreachIncident', breachIncidentSchema);
