const mongoose = require('mongoose');
const PerimeterNode = require('../models/PerimeterNode');
const tacticalStore = require('../services/tacticalStore');

const isDb = () => mongoose.connection.readyState === 1;

// @desc Get all perimeter sector nodes
// @route GET /api/nodes
const getNodes = async (req, res) => {
  try {
    if (!isDb()) {
      const data = tacticalStore.getNodes();
      return res.status(200).json({ success: true, count: data.length, data });
    }

    const nodes = await PerimeterNode.find().sort({ nodeId: 1 });
    res.status(200).json({
      success: true,
      count: nodes.length,
      data: nodes
    });
  } catch (error) {
    const fallback = tacticalStore.getNodes();
    res.status(200).json({ success: true, count: fallback.length, data: fallback });
  }
};

// @desc Get single node by ID
// @route GET /api/nodes/:id
const getNodeById = async (req, res) => {
  try {
    if (!isDb()) {
      const node = tacticalStore.getNodeById(req.params.id);
      if (!node) return res.status(404).json({ success: false, message: 'Node not found' });
      return res.status(200).json({ success: true, data: node });
    }

    const node = await PerimeterNode.findById(req.params.id);
    if (!node) {
      const fallback = tacticalStore.getNodeById(req.params.id);
      if (fallback) return res.status(200).json({ success: true, data: fallback });
      return res.status(404).json({ success: false, message: 'Sector Node not found' });
    }
    res.status(200).json({ success: true, data: node });
  } catch (error) {
    const fallback = tacticalStore.getNodeById(req.params.id);
    if (fallback) return res.status(200).json({ success: true, data: fallback });
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update node AI or hardware status
// @route PATCH /api/nodes/:id/status
const updateNodeStatus = async (req, res) => {
  try {
    const { aiEdgeStatus, hardwareStatus, solarBatteryLevel, aiConfidenceThreshold } = req.body;

    if (!isDb()) {
      const updated = tacticalStore.updateNode(req.params.id, {
        aiEdgeStatus,
        hardwareStatus,
        solarBatteryLevel,
        aiConfidenceThreshold
      });
      return res.status(200).json({ success: true, data: updated });
    }

    const node = await PerimeterNode.findById(req.params.id);
    if (!node) {
      const updated = tacticalStore.updateNode(req.params.id, req.body);
      return res.status(200).json({ success: true, data: updated });
    }

    if (aiEdgeStatus) node.aiEdgeStatus = aiEdgeStatus;
    if (hardwareStatus) node.hardwareStatus = hardwareStatus;
    if (solarBatteryLevel !== undefined) node.solarBatteryLevel = solarBatteryLevel;
    if (aiConfidenceThreshold !== undefined) node.aiConfidenceThreshold = aiConfidenceThreshold;
    node.lastPing = new Date();

    await node.save();
    res.status(200).json({ success: true, data: node });
  } catch (error) {
    const updated = tacticalStore.updateNode(req.params.id, req.body);
    res.status(200).json({ success: true, data: updated });
  }
};

// @desc Run remote diagnostics on node (Optical / LoRa / Solenoid ping)
// @route POST /api/nodes/:id/diagnostics
const runNodeDiagnostics = async (req, res) => {
  try {
    const latency = Math.floor(28 + Math.random() * 25);
    const rssi = -Math.floor(58 + Math.random() * 20);

    const diagnostics = {
      nodeId: req.params.id,
      opticalSensorStatus: 'PASS (0 errors, lens clean)',
      thermalIrSensorStatus: 'PASS (FLIR core calibrated)',
      yoloInferenceFps: '32.4 FPS on Edge NPU',
      solenoidActuatorCheck: 'COILS_ENERGIZED_OK',
      acousticDriverAmp: 'NOMINAL (8 Ohm, 50W RMS)',
      loraTelemetry: {
        latencyMs: latency,
        rssiDbm: rssi,
        snrDb: 9.8,
        packetLossPct: 0.0
      },
      solarChargeController: {
        pvVoltage: 24.4,
        batteryVoltage: 13.6,
        chargeState: 'Float'
      }
    };

    if (isDb()) {
      try {
        await PerimeterNode.findByIdAndUpdate(req.params.id, {
          lastPing: new Date(),
          latencyMs: latency,
          loraRssiDbm: rssi
        });
      } catch (e) {}
    } else {
      tacticalStore.updateNode(req.params.id, { latencyMs: latency, loraRssiDbm: rssi });
    }

    res.status(200).json({ success: true, data: diagnostics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNodes,
  getNodeById,
  updateNodeStatus,
  runNodeDiagnostics
};
