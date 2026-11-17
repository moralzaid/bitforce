const mongoose = require('mongoose');
const ElephantProfile = require('../models/ElephantProfile');
const PerimeterNode = require('../models/PerimeterNode');
const AgroZone = require('../models/AgroZone');
const BreachIncident = require('../models/BreachIncident');
const SystemConfig = require('../models/SystemConfig');

/**
 * TRIDENT Core Tri-Disciplinary State Machine
 * Deterministically executes Engineering -> Veterinary -> Agricultural pipeline
 */
async function executeTriDisciplinaryPipeline({
  nodeId = 'NODE-04',
  elephantCollarId = 'EL-001',
  customSubject = null,
  environmentalOverrides = {},
  socketIo = null
}) {
  const startTime = Date.now();
  const logs = [];

  const addLog = (subsystem, message, level = 'info') => {
    const elapsed = Date.now() - startTime;
    const now = new Date();
    const timeStr = `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    const logEntry = {
      timestamp: timeStr,
      elapsedMs: elapsed,
      subsystem,
      message,
      level
    };
    logs.push(logEntry);
    if (socketIo) {
      socketIo.emit('telemetry:log', logEntry);
    }
  };

  const isDbConnected = mongoose.connection.readyState === 1;

  // 1. Fetch System Configuration
  let config = null;
  if (isDbConnected) {
    try {
      config = await SystemConfig.findOne({ key: 'trident_global_config' });
    } catch (e) {}
  }
  if (!config) {
    config = {
      aiConfidenceThreshold: 85,
      musthAggressionMultiplier: 1.8,
      maxSafeWindSpeedKmh: 25,
      minChiliTankReservePct: 15,
      chiliDischargeDurationSec: 6,
      beeFrequencyBandHz: 380
    };
  }

  // 2. STAGE 1: TRIGGER INPUT
  addLog('SIM-CORE', `Initiating perimeter scan at Sector Node [${nodeId}]. Optical-IR beam tripped.`, 'info');

  // Fetch Perimeter Node
  let node = null;
  if (isDbConnected) {
    try {
      node = await PerimeterNode.findOne({ nodeId });
    } catch (e) {}
  }
  if (!node) {
    node = {
      nodeId: nodeId || 'NODE-04',
      sectorName: 'Sector 04 - North Paddy Buffer',
      coordinates: { latitude: 6.8219, longitude: 80.9982 },
      solarBatteryLevel: 94,
      aiEdgeStatus: 'Online',
      solenoidValveIds: ['SOL-04A', 'SOL-04B'],
      acousticArrayIds: ['SPK-04-NORTH', 'SPK-04-EAST'],
      latencyMs: 42
    };
  }

  // 3. STAGE 2: ENGINEERING MODULE (Edge AI Vision & Sensor Mesh)
  const isNonTarget = customSubject && ['Wild Boar', 'Cattle', 'False Trigger'].includes(customSubject.type);
  const detectedSubjectType = isNonTarget ? customSubject.type : 'Elephant';
  const aiConfidence = isNonTarget ? 92.4 : (customSubject?.aiConfidence || 97.8);
  const thermalDelta = isNonTarget ? 2.1 : 5.4;

  addLog(
    `ENG-${node.nodeId}`,
    `Thermal + Optical trigger confirmed (ΔT: +${thermalDelta}°C). AI inference confidence: ${aiConfidence}% for ${detectedSubjectType}.`,
    'eng'
  );

  const engineeringStage = {
    nodeId: node.nodeId,
    sectorName: node.sectorName,
    coordinates: node.coordinates,
    aiConfidence,
    subjectType: detectedSubjectType,
    thermalDeltaC: thermalDelta,
    solarBatteryLevel: node.solarBatteryLevel,
    meshLatencyMs: node.latencyMs,
    boundingBox: {
      x: isNonTarget ? 180 : 140,
      y: isNonTarget ? 200 : 90,
      width: isNonTarget ? 160 : 380,
      height: isNonTarget ? 130 : 420
    },
    status: 'TARGET_LOCKED'
  };

  // If non-target wildlife: Standby & Log Only
  if (isNonTarget) {
    addLog(
      'ENG-DECISION',
      `Subject classified as Non-Target Wildlife [${detectedSubjectType}]. No deterrent payload authorized.`,
      'warn'
    );

    const nonTargetIncident = new BreachIncident({
      incidentCode: `INC-${Date.now().toString().slice(-6)}`,
      nodeId: node.nodeId,
      sectorName: node.sectorName,
      coordinates: node.coordinates,
      subjectType: detectedSubjectType,
      engineering: {
        aiConfidence,
        opticalTrigger: true,
        thermalDeltaC: thermalDelta,
        networkLatencyMs: node.latencyMs,
        solarLevel: node.solarBatteryLevel
      },
      veterinary: {
        musthStatus: 'N/A - Female',
        biologicalThreatLevel: 'None'
      },
      agriculture: {
        deterrentDeployed: 'Standby_Log_Only',
        chiliDischargedLiters: 0
      },
      outcome: 'Monitored - Harmless Wildlife Logged',
      cropDamagePreventedUsd: 0,
      villageEarlyWarningDispatched: false,
      executionLatency: {
        t0_optical_thermal_detect_ms: 18,
        t1_edge_yolo_infer_ms: 38,
        t2_mesh_lora_relay_ms: 32,
        t3_vet_biometric_lookup_ms: 12,
        t4_tri_decision_calc_ms: 15,
        t5_agro_valve_solenoid_ms: 0,
        totalHandshakeTimeMs: 115
      }
    });

    if (isDbConnected) {
      try {
        await nonTargetIncident.save();
      } catch (e) {}
    }

    return {
      success: true,
      incident: nonTargetIncident,
      stages: {
        stage1_trigger: { detectedSubjectType, nodeId: node.nodeId },
        stage2_engineering: engineeringStage,
        stage3_veterinary: { status: 'STANDBY_NON_TARGET', note: 'Non-elephant wildlife bypass' },
        stage4_agriculture: { status: 'STANDBY_ZERO_DISCHARGE', deterrent: 'Standby_Log_Only' }
      },
      logs,
      executionTimeMs: Date.now() - startTime
    };
  }

  // 4. STAGE 3: VETERINARY MODULE (Biological Intelligence)
  let elephant = null;
  if (customSubject) {
    elephant = customSubject;
  } else if (isDbConnected && elephantCollarId) {
    try {
      elephant = await ElephantProfile.findOne({ collarId: elephantCollarId });
    } catch (e) {}
  }

  if (!elephant) {
    elephant = {
      _id: null,
      collarId: elephantCollarId || 'EL-001',
      name: elephantCollarId === 'EL-002' ? 'Kumari Matriarch & Herd' : 'Raja (Apex Bull)',
      classification: elephantCollarId === 'EL-002' ? 'Matriarch Herd' : 'Solitary Bull',
      age: elephantCollarId === 'EL-002' ? 48 : 44,
      estimatedWeightKg: 5400,
      morphotype: elephantCollarId === 'EL-002' ? 'Female / Cow' : 'Tusker',
      musthStatus: elephantCollarId === 'EL-002' ? 'N/A - Female' : 'Active',
      testosteroneIndex: elephantCollarId === 'EL-002' ? 8 : 96,
      aggressionScore: elephantCollarId === 'EL-002' ? 2.4 : 9.4,
      habituationIndex: 25,
      calvesPresent: elephantCollarId === 'EL-002',
      calfCount: elephantCollarId === 'EL-002' ? 3 : 0,
      breachCount: 14
    };
  }

  addLog(
    'VET-DB-SYNC',
    `Collar #${elephant.collarId} RFID matched: "${elephant.name}" (${elephant.classification}, Age: ${elephant.age}). Musth: ${elephant.musthStatus}.`,
    'vet'
  );

  // Calculate Biological Threat Matrix
  let biologicalThreatLevel = 'Moderate';
  let adjustedAggression = elephant.aggressionScore;

  if (elephant.musthStatus === 'Active') {
    adjustedAggression = Math.min(10, elephant.aggressionScore * (config.musthAggressionMultiplier || 1.8));
    biologicalThreatLevel = 'Critical';
    addLog(
      'VET-HORMONE',
      `CRITICAL ALERT: Serum testosterone level elevated at index ${elephant.testosteroneIndex}/100. Temporal gland drainage active. Extreme charge probability.`,
      'vet'
    );
  } else if (elephant.calvesPresent) {
    biologicalThreatLevel = 'Moderate';
    addLog(
      'VET-ETHICS',
      `Matriarch herd detected with ${elephant.calfCount} dependent calves. Bio-ethical override: high chemical irritation PROHIBITED to prevent herd panic & stampede.`,
      'vet'
    );
  } else if (elephant.habituationIndex > 60) {
    biologicalThreatLevel = 'High';
    addLog(
      'VET-BEHAVIOR',
      `Habituation warning: Subject shows ${elephant.habituationIndex}% tolerance to baseline deterrents. Escalated frequency modulation required.`,
      'warn'
    );
  }

  const veterinaryStage = {
    collarId: elephant.collarId,
    name: elephant.name,
    classification: elephant.classification,
    age: elephant.age,
    weightKg: elephant.estimatedWeightKg,
    musthStatus: elephant.musthStatus,
    testosteroneIndex: elephant.testosteroneIndex,
    aggressionScore: elephant.aggressionScore,
    adjustedAggression: Number(adjustedAggression.toFixed(1)),
    habituationIndex: elephant.habituationIndex,
    calvesPresent: elephant.calvesPresent,
    calfCount: elephant.calfCount,
    biologicalThreatLevel
  };

  // 5. STAGE 4: AGRICULTURAL MODULE (Physical Deterrent Dispatch)
  let agroZone = null;
  if (isDbConnected) {
    try {
      agroZone = await AgroZone.findOne();
    } catch (e) {}
  }
  if (!agroZone) {
    agroZone = {
      zoneId: 'ZONE-01',
      name: 'North Paddy Buffer Area',
      chiliTankCapacityLiters: 500,
      chiliTankCurrentLiters: 450,
      linePressurePsi: 145,
      acousticFrequencyHz: 380,
      windSpeedKmh: 14,
      windDirectionDeg: 180,
      windSafetyLockActive: false
    };
  }

  // Check environmental wind overrides
  const effectiveWindSpeed = environmentalOverrides.windSpeedKmh !== undefined
    ? environmentalOverrides.windSpeedKmh
    : (agroZone.windSpeedKmh || 12);
  const effectiveWindDirection = environmentalOverrides.windDirectionDeg !== undefined
    ? environmentalOverrides.windDirectionDeg
    : (agroZone.windDirectionDeg || 180);

  // Wind Safety Check: If blowing towards village (> 24 km/h & direction 0-90 or 270-360)
  const isBlowingTowardsVillage = (effectiveWindDirection < 90 || effectiveWindDirection > 270) && effectiveWindSpeed > (config.maxSafeWindSpeedKmh || 25);

  let deterrentDeployed = 'Acoustic_Bee_Swarm_Tier1';
  let valveDurationSec = 0;
  let chiliLitersDischarged = 0;
  let acousticHz = 380;
  let outcome = 'Deterred - Retreated to Sanctuary Buffer';
  let valveId = node.solenoidValveIds && node.solenoidValveIds.length > 0 ? node.solenoidValveIds[0] : 'SOL-04A';

  if (isBlowingTowardsVillage) {
    addLog(
      'AGRO-SAFETY',
      `WIND SAFETY LOCKOUT: High wind (${effectiveWindSpeed} km/h) directed toward human settlement. Chili mist valve LOCKED. Escalating acoustic deterrent.`,
      'warn'
    );
    deterrentDeployed = 'Safety_Lockout_No_Spray';
    acousticHz = 480;
    outcome = 'Deterred - Retreated to Sanctuary Buffer';
  } else if (elephant.calvesPresent) {
    // Matriarch herd with calves: Tier 1 Acoustic Honeybee Swarm ONLY
    deterrentDeployed = 'Acoustic_Bee_Swarm_Tier1';
    acousticHz = 340;
    valveDurationSec = 0;
    chiliLitersDischarged = 0;
    outcome = 'Herd Redirected - Calves Protected';
    addLog(
      'AGRO-ACOUSTIC',
      `Transmitting Bio-Acoustic Honeybee Swarm frequency [${acousticHz} Hz] across speakers. Solenoid valves stay closed.`,
      'agro'
    );
  } else if (elephant.musthStatus === 'Active' || elephant.aggressionScore >= 8) {
    // Bull in Musth / Extreme Aggression: Tier 3 High-Pressure Chili Curtain + Max Acoustic
    deterrentDeployed = 'High_Pressure_Chili_Curtain_Tier3';
    valveDurationSec = config.chiliDischargeDurationSec || 8;
    chiliLitersDischarged = 8.5;
    acousticHz = 520;
    outcome = 'Violent Charge Halted by Chili Curtain';
    addLog(
      'DECISION-ENGINE',
      `Aggressive / Musth subject cannot be turned by acoustic stimuli alone. Escalating to Tier-3 Chemical Bio-Mist.`,
      'warn'
    );
    addLog(
      'AGRO-VALVE',
      `Opening Solenoid Valve [${valveId}] at ${agroZone.linePressurePsi || 145} PSI. Deploying Pressurized Chili-Oleoresin Curtain (${chiliLitersDischarged}L, ${valveDurationSec}s burst).`,
      'agro'
    );
  } else {
    // Standard Bull / Lone Crop-Raider: Tier 2 Dual Pulse
    deterrentDeployed = 'Dual_Acoustic_Chili_Pulse_Tier2';
    valveDurationSec = 3;
    chiliLitersDischarged = 3.0;
    acousticHz = 420;
    outcome = 'Deterred - Retreated to Sanctuary Buffer';
    addLog(
      'AGRO-VALVE',
      `Actuating dual pulse: Acoustic Honeybee [${acousticHz} Hz] + 3s Oleoresin micro-burst (${chiliLitersDischarged}L).`,
      'agro'
    );
  }

  // Deduct tank volume in MongoDB if real document
  let remainingTank = agroZone.chiliTankCurrentLiters;
  if (isDbConnected && agroZone._id && chiliLitersDischarged > 0) {
    try {
      const updatedTank = Math.max(0, agroZone.chiliTankCurrentLiters - chiliLitersDischarged);
      await AgroZone.findByIdAndUpdate(agroZone._id, { chiliTankCurrentLiters: updatedTank });
      remainingTank = updatedTank;
    } catch (e) {}
  }

  // Update elephant habituation index and breach count
  if (isDbConnected && elephant._id) {
    try {
      await ElephantProfile.findByIdAndUpdate(elephant._id, {
        $inc: { breachCount: 1, habituationIndex: 1 },
        lastCoordinates: node.coordinates
      });
    } catch (e) {}
  }

  const agricultureStage = {
    zoneId: agroZone.zoneId || 'ZONE-01',
    zoneName: agroZone.name,
    deterrentDeployed,
    valveActuated: valveId,
    valveDurationSec,
    chiliDischargedLiters: chiliLitersDischarged,
    acousticFrequencyHz: acousticHz,
    tankRemainingLiters: remainingTank,
    linePressurePsi: agroZone.linePressurePsi || 145,
    windSafetyLockActive: isBlowingTowardsVillage,
    effectiveWindSpeedKmh: effectiveWindSpeed
  };

  // 6. PERSIST BREACH INCIDENT
  const incidentCode = `INC-${Date.now().toString().slice(-6)}`;
  const breachIncident = new BreachIncident({
    incidentCode,
    nodeId: node.nodeId,
    sectorName: node.sectorName,
    coordinates: node.coordinates,
    elephantId: elephant._id || null,
    elephantName: elephant.name,
    collarId: elephant.collarId,
    subjectType: 'Elephant',
    engineering: {
      aiConfidence,
      opticalTrigger: true,
      thermalDeltaC: thermalDelta,
      networkLatencyMs: node.latencyMs,
      solarLevel: node.solarBatteryLevel,
      boundingBox: engineeringStage.boundingBox
    },
    veterinary: {
      musthStatus: elephant.musthStatus,
      testosteroneIndex: elephant.testosteroneIndex,
      aggressionScore: elephant.aggressionScore,
      habituationIndex: elephant.habituationIndex,
      calvesPresent: elephant.calvesPresent,
      calfCount: elephant.calfCount,
      biologicalThreatLevel
    },
    agriculture: {
      zoneId: agroZone.zoneId || 'ZONE-01',
      deterrentDeployed,
      valveActuated: valveId,
      valveDurationSec,
      chiliDischargedLiters: chiliLitersDischarged,
      acousticFrequencyHz: acousticHz,
      tankRemainingLiters: remainingTank,
      windBlowbackCheckPassed: !isBlowingTowardsVillage
    },
    outcome,
    cropDamagePreventedUsd: elephant.musthStatus === 'Active' ? 8500 : 3800,
    villageEarlyWarningDispatched: true,
    earlyWarningRecipients: [
      { village: 'Habarana North Village', smsSentCount: 164, sirenTriggered: elephant.musthStatus === 'Active' }
    ],
    executionLatency: {
      t0_optical_thermal_detect_ms: 19,
      t1_edge_yolo_infer_ms: 43,
      t2_mesh_lora_relay_ms: 36,
      t3_vet_biometric_lookup_ms: 58,
      t4_tri_decision_calc_ms: 22,
      t5_agro_valve_solenoid_ms: valveDurationSec > 0 ? 54 : 12,
      totalHandshakeTimeMs: 232
    },
    chaosTestRun: false
  });

  if (isDbConnected) {
    try {
      await breachIncident.save();
    } catch (e) {}
  }

  addLog(
    'INCIDENT-LOGGED',
    `Telemetry record ${incidentCode} synchronized. Total turnaround: 232ms.`,
    'success'
  );

  return {
    success: true,
    incident: breachIncident,
    stages: {
      stage1_trigger: {
        nodeId: node.nodeId,
        subjectType: 'Elephant',
        collarId: elephant.collarId,
        timestamp: new Date().toISOString()
      },
      stage2_engineering: engineeringStage,
      stage3_veterinary: veterinaryStage,
      stage4_agriculture: agricultureStage
    },
    logs,
    executionTimeMs: Date.now() - startTime
  };
}

module.exports = {
  executeTriDisciplinaryPipeline
};


module.exports = {
  executeTriDisciplinaryPipeline
};
