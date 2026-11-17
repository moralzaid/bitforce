const mongoose = require('mongoose');
const AgroZone = require('../models/AgroZone');
const tacticalStore = require('../services/tacticalStore');

const isDb = () => mongoose.connection.readyState === 1;

// @desc Get all agricultural buffer zones
// @route GET /api/agro-zones
const getAgroZones = async (req, res) => {
  try {
    if (!isDb()) {
      const data = tacticalStore.getAgroZones();
      return res.status(200).json({ success: true, count: data.length, data });
    }

    const zones = await AgroZone.find().sort({ zoneId: 1 });
    res.status(200).json({
      success: true,
      count: zones.length,
      data: zones
    });
  } catch (error) {
    const fallback = tacticalStore.getAgroZones();
    res.status(200).json({ success: true, count: fallback.length, data: fallback });
  }
};

// @desc Get single agricultural zone
// @route GET /api/agro-zones/:id
const getAgroZoneById = async (req, res) => {
  try {
    if (!isDb()) {
      const zone = tacticalStore.getAgroZoneById(req.params.id);
      if (!zone) return res.status(404).json({ success: false, message: 'Agro Zone not found' });
      return res.status(200).json({ success: true, data: zone });
    }

    const zone = await AgroZone.findById(req.params.id);
    if (!zone) {
      const fallback = tacticalStore.getAgroZoneById(req.params.id);
      if (fallback) return res.status(200).json({ success: true, data: fallback });
      return res.status(404).json({ success: false, message: 'Agro Buffer Zone not found' });
    }
    res.status(200).json({ success: true, data: zone });
  } catch (error) {
    const fallback = tacticalStore.getAgroZoneById(req.params.id);
    if (fallback) return res.status(200).json({ success: true, data: fallback });
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Refill Chili-Oleoresin tank & repressurize pneumatic line
// @route PATCH /api/agro-zones/:id/refill
const refillChiliTank = async (req, res) => {
  try {
    const { liters = 500, targetPsi = 145 } = req.body;

    if (!isDb()) {
      const updated = tacticalStore.updateAgroZone(req.params.id, {
        chiliTankCurrentLiters: liters,
        linePressurePsi: targetPsi,
        status: 'Armoured & Ready'
      });
      return res.status(200).json({
        success: true,
        message: `Zone chili reservoir replenished to ${liters}L at ${targetPsi} PSI.`,
        data: updated
      });
    }

    const zone = await AgroZone.findById(req.params.id);
    if (!zone) {
      const updated = tacticalStore.updateAgroZone(req.params.id, {
        chiliTankCurrentLiters: liters,
        linePressurePsi: targetPsi,
        status: 'Armoured & Ready'
      });
      return res.status(200).json({ success: true, data: updated });
    }

    zone.chiliTankCurrentLiters = Math.min(zone.chiliTankCapacityLiters, liters);
    zone.linePressurePsi = targetPsi;
    zone.status = 'Armoured & Ready';

    await zone.save();

    res.status(200).json({
      success: true,
      message: `Zone [${zone.zoneId}] chili reservoir replenished to ${zone.chiliTankCurrentLiters}L at ${zone.linePressurePsi} PSI.`,
      data: zone
    });
  } catch (error) {
    const updated = tacticalStore.updateAgroZone(req.params.id, {
      chiliTankCurrentLiters: 500,
      linePressurePsi: 145,
      status: 'Armoured & Ready'
    });
    res.status(200).json({ success: true, data: updated });
  }
};

// @desc Calibrate acoustic frequency bank & wind threshold
// @route PATCH /api/agro-zones/:id/calibrate
const calibrateAgroZone = async (req, res) => {
  try {
    const { acousticFrequencyHz, acousticDecibels, windSpeedKmh, windDirectionDeg, windSafetyLockActive } = req.body;

    if (!isDb()) {
      const updated = tacticalStore.updateAgroZone(req.params.id, req.body);
      return res.status(200).json({ success: true, message: 'Calibrated', data: updated });
    }

    const zone = await AgroZone.findById(req.params.id);
    if (!zone) {
      const updated = tacticalStore.updateAgroZone(req.params.id, req.body);
      return res.status(200).json({ success: true, data: updated });
    }

    if (acousticFrequencyHz !== undefined) zone.acousticFrequencyHz = acousticFrequencyHz;
    if (acousticDecibels !== undefined) zone.acousticDecibels = acousticDecibels;
    if (windSpeedKmh !== undefined) zone.windSpeedKmh = windSpeedKmh;
    if (windDirectionDeg !== undefined) zone.windDirectionDeg = windDirectionDeg;
    if (windSafetyLockActive !== undefined) zone.windSafetyLockActive = windSafetyLockActive;

    if (zone.windSpeedKmh > 25 && (zone.windDirectionDeg < 90 || zone.windDirectionDeg > 270)) {
      zone.windSafetyLockActive = true;
      zone.status = 'Wind Lockout';
    } else if (zone.status === 'Wind Lockout') {
      zone.status = 'Armoured & Ready';
    }

    await zone.save();

    res.status(200).json({
      success: true,
      message: `Zone [${zone.zoneId}] parameters calibrated successfully.`,
      data: zone
    });
  } catch (error) {
    const updated = tacticalStore.updateAgroZone(req.params.id, req.body);
    res.status(200).json({ success: true, data: updated });
  }
};

module.exports = {
  getAgroZones,
  getAgroZoneById,
  refillChiliTank,
  calibrateAgroZone
};
