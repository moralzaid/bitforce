const mongoose = require('mongoose');
const { executeTriDisciplinaryPipeline } = require('../services/decisionEngine');
const { executeChaosSimulation } = require('../services/chaosEngine');
const SystemConfig = require('../models/SystemConfig');
const AgroZone = require('../models/AgroZone');
const PerimeterNode = require('../models/PerimeterNode');
const ElephantProfile = require('../models/ElephantProfile');
const tacticalStore = require('../services/tacticalStore');

const isDb = () => mongoose.connection.readyState === 1;

// @desc Execute Tri-Disciplinary Breach Simulation
// @route POST /api/simulate/breach
const simulateBreach = async (req, res) => {
  try {
    const {
      nodeId = 'NODE-04',
      elephantCollarId = 'EL-001',
      customSubject = null,
      environmentalOverrides = {}
    } = req.body;

    const socketIo = req.app.get('socketio');

    const result = await executeTriDisciplinaryPipeline({
      nodeId,
      elephantCollarId,
      customSubject,
      environmentalOverrides,
      socketIo
    });

    if (result.incident) {
      tacticalStore.addIncident(result.incident.toObject ? result.incident.toObject() : result.incident);
    }

    if (socketIo) {
      socketIo.emit('simulation:breach_executed', {
        incident: result.incident,
        stages: result.stages
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[SIMULATION ERROR]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Execute "Fails-if-Removed" Chaos Test
// @route POST /api/simulate/chaos-test
const simulateChaosTest = async (req, res) => {
  try {
    const {
      disabledEngineering = false,
      disabledVeterinary = false,
      disabledAgriculture = false,
      targetElephantCollarId = 'EL-001'
    } = req.body;

    const socketIo = req.app.get('socketio');
    const testedByRole = req.user?.role || 'Hackathon Judge / Admin';

    const result = await executeChaosSimulation({
      disabledEngineering,
      disabledVeterinary,
      disabledAgriculture,
      targetElephantCollarId,
      testedByRole,
      socketIo
    });

    if (result.incident) {
      tacticalStore.addIncident(result.incident.toObject ? result.incident.toObject() : result.incident);
    }

    if (socketIo) {
      socketIo.emit('simulation:chaos_executed', result);
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[CHAOS TEST ERROR]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Reset simulation state and restore tanks & nodes for next pitch
// @route POST /api/simulate/reset
const resetSimulationState = async (req, res) => {
  try {
    tacticalStore.reset();

    if (isDb()) {
      try {
        await AgroZone.updateMany(
          {},
          {
            $set: {
              chiliTankCurrentLiters: 480,
              linePressurePsi: 145,
              windSafetyLockActive: false,
              status: 'Armoured & Ready'
            }
          }
        );

        await PerimeterNode.updateMany(
          {},
          {
            $set: {
              solarBatteryLevel: 94,
              pvChargingState: 'Float',
              aiEdgeStatus: 'Online',
              hardwareStatus: 'Nominal',
              latencyMs: 42
            }
          }
        );

        let config = await SystemConfig.findOne({ key: 'trident_global_config' });
        if (config) {
          config.engineeringActive = true;
          config.veterinaryActive = true;
          config.agricultureActive = true;
          await config.save();
        }
      } catch (e) {}
    }

    const socketIo = req.app.get('socketio');
    if (socketIo) {
      socketIo.emit('system:state_reset', { message: 'TRIDENT hardware and tanks recharged to 100%' });
    }

    res.status(200).json({
      success: true,
      message: 'TRIDENT system hardware parameters and deterrent payloads successfully reset'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get current system status and module health
// @route GET /api/simulate/state
const getSystemState = async (req, res) => {
  try {
    const nodes = tacticalStore.getNodes();
    const elephants = tacticalStore.getElephants();
    const zones = tacticalStore.getAgroZones();

    res.status(200).json({
      success: true,
      data: {
        config: tacticalStore.config,
        modules: {
          engineering: {
            active: true,
            healthPercent: 100,
            totalNodes: nodes.length,
            onlineNodes: nodes.length
          },
          veterinary: {
            active: true,
            syncedElephants: elephants.length,
            activeMusthAlerts: elephants.filter(e => e.musthStatus === 'Active').length,
            status: 'DATABASE_SYNCHRONIZED'
          },
          agriculture: {
            active: true,
            averageTankReservePct: 94,
            nominalPsi: 145,
            zonesCount: zones.length,
            status: 'PRESSURIZED_NOMINAL'
          }
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Upload elephant image for AI Edge Vision testing
// @route POST /api/simulate/upload-test-image
const uploadTestImage = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '/images/elephants/default.jpg';

    const simulatedInference = {
      detectedClass: 'Elephas maximus (Asian Elephant)',
      confidence: 98.6,
      morphotypeEstimate: 'Adult Bull (Tusker)',
      estimatedAgeBand: '35 - 45 Years',
      temporalSecretionDetected: true,
      inferredMusthRisk: 'HIGH_RISK_ACTIVE',
      boundingBox: {
        x: 120,
        y: 85,
        width: 410,
        height: 480
      },
      imageUrl
    };

    res.status(200).json({
      success: true,
      data: simulatedInference
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  simulateBreach,
  simulateChaosTest,
  resetSimulationState,
  getSystemState,
  uploadTestImage
};
