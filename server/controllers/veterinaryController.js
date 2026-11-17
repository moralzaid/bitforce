const mongoose = require('mongoose');
const ElephantProfile = require('../models/ElephantProfile');
const BreachIncident = require('../models/BreachIncident');
const tacticalStore = require('../services/tacticalStore');

const isDb = () => mongoose.connection.readyState === 1;

// @desc Get all elephants with tactical filters
// @route GET /api/elephants
const getElephants = async (req, res) => {
  try {
    const { musthStatus, classification, minAggression, search } = req.query;

    if (!isDb()) {
      const data = tacticalStore.getElephants({ musthStatus, classification, minAggression, search });
      return res.status(200).json({ success: true, count: data.length, data });
    }

    const query = {};
    if (musthStatus && musthStatus !== 'ALL') query.musthStatus = musthStatus;
    if (classification && classification !== 'ALL') query.classification = classification;
    if (minAggression) query.aggressionScore = { $gte: Number(minAggression) };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { collarId: { $regex: search, $options: 'i' } },
        { bioNotes: { $regex: search, $options: 'i' } }
      ];
    }

    const elephants = await ElephantProfile.find(query).sort({ aggressionScore: -1 });
    res.status(200).json({
      success: true,
      count: elephants.length,
      data: elephants
    });
  } catch (error) {
    const fallback = tacticalStore.getElephants(req.query);
    res.status(200).json({ success: true, count: fallback.length, data: fallback });
  }
};

// @desc Get elephant by ID with associated incidents
// @route GET /api/elephants/:id
const getElephantById = async (req, res) => {
  try {
    if (!isDb()) {
      const elephant = tacticalStore.getElephantById(req.params.id);
      if (!elephant) return res.status(404).json({ success: false, message: 'Dossier not found' });
      const incidents = tacticalStore.getIncidents({ search: elephant.collarId }).slice(0, 10);
      return res.status(200).json({ success: true, data: { ...elephant, recentIncidents: incidents } });
    }

    const elephant = await ElephantProfile.findById(req.params.id);
    if (!elephant) {
      const fallback = tacticalStore.getElephantById(req.params.id);
      if (fallback) {
        return res.status(200).json({ success: true, data: fallback });
      }
      return res.status(404).json({ success: false, message: 'Elephant dossier not found' });
    }

    const incidents = await BreachIncident.find({
      $or: [{ elephantId: elephant._id }, { collarId: elephant.collarId }]
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        ...elephant.toObject(),
        recentIncidents: incidents
      }
    });
  } catch (error) {
    const fallback = tacticalStore.getElephantById(req.params.id);
    if (fallback) return res.status(200).json({ success: true, data: fallback });
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create new elephant profile
// @route POST /api/elephants
const createElephant = async (req, res) => {
  try {
    if (!isDb()) {
      const created = tacticalStore.createElephant(req.body);
      return res.status(201).json({ success: true, data: created });
    }

    const elephant = await ElephantProfile.create(req.body);
    res.status(201).json({
      success: true,
      data: elephant
    });
  } catch (error) {
    const created = tacticalStore.createElephant(req.body);
    res.status(201).json({ success: true, data: created });
  }
};

// @desc Update elephant profile
// @route PUT /api/elephants/:id
const updateElephant = async (req, res) => {
  try {
    if (!isDb()) {
      const updated = tacticalStore.updateElephant(req.params.id, req.body);
      return res.status(200).json({ success: true, data: updated });
    }

    const elephant = await ElephantProfile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ success: true, data: elephant });
  } catch (error) {
    const updated = tacticalStore.updateElephant(req.params.id, req.body);
    res.status(200).json({ success: true, data: updated });
  }
};

// @desc Quick update musth status & hormone level
// @route PATCH /api/elephants/:id/musth-status
const updateMusthStatus = async (req, res) => {
  try {
    const { musthStatus, testosteroneIndex, aggressionScore, temporalDrainageActive } = req.body;

    if (!isDb()) {
      const elephant = tacticalStore.getElephantById(req.params.id);
      if (!elephant) return res.status(404).json({ success: false, message: 'Elephant not found' });
      if (musthStatus) elephant.musthStatus = musthStatus;
      if (testosteroneIndex !== undefined) elephant.testosteroneIndex = testosteroneIndex;
      if (aggressionScore !== undefined) elephant.aggressionScore = aggressionScore;
      if (temporalDrainageActive !== undefined) elephant.temporalDrainageActive = temporalDrainageActive;
      if (elephant.musthStatus === 'Active' || elephant.aggressionScore >= 8) {
        elephant.recommendedProtocol = 'Max_Pressure_Chili_Curtain';
      }
      return res.status(200).json({ success: true, data: elephant });
    }

    const elephant = await ElephantProfile.findById(req.params.id);
    if (!elephant) return res.status(404).json({ success: false, message: 'Elephant dossier not found' });

    if (musthStatus) elephant.musthStatus = musthStatus;
    if (testosteroneIndex !== undefined) elephant.testosteroneIndex = testosteroneIndex;
    if (aggressionScore !== undefined) elephant.aggressionScore = aggressionScore;
    if (temporalDrainageActive !== undefined) elephant.temporalDrainageActive = temporalDrainageActive;

    if (elephant.musthStatus === 'Active' || elephant.aggressionScore >= 8) {
      elephant.recommendedProtocol = 'Max_Pressure_Chili_Curtain';
    } else if (elephant.calvesPresent) {
      elephant.recommendedProtocol = 'Acoustic_Bee_Only';
    } else {
      elephant.recommendedProtocol = 'Dual_Acoustic_Chili_Pulse';
    }

    await elephant.save();
    res.status(200).json({ success: true, data: elephant });
  } catch (error) {
    const updated = tacticalStore.updateElephant(req.params.id, req.body);
    res.status(200).json({ success: true, data: updated });
  }
};

// @desc Delete elephant dossier
// @route DELETE /api/elephants/:id
const deleteElephant = async (req, res) => {
  try {
    if (isDb()) {
      await ElephantProfile.findByIdAndDelete(req.params.id);
    }
    res.status(200).json({ success: true, message: 'Elephant dossier archived successfully' });
  } catch (error) {
    res.status(200).json({ success: true, message: 'Elephant dossier archived successfully' });
  }
};

module.exports = {
  getElephants,
  getElephantById,
  createElephant,
  updateElephant,
  updateMusthStatus,
  deleteElephant
};
