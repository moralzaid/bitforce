const ChaosSimulationLog = require('../models/ChaosSimulationLog');
const BreachIncident = require('../models/BreachIncident');
const ElephantProfile = require('../models/ElephantProfile');
const AgroZone = require('../models/AgroZone');

/**
 * Executes the "Fails-if-Removed" Chaos Dependency Engine.
 * Calculates deterministic catastrophic cascades when any tri-disciplinary pillar is severed.
 */
async function executeChaosSimulation({
  disabledEngineering = false,
  disabledVeterinary = false,
  disabledAgriculture = false,
  targetElephantCollarId = 'EL-001',
  testedByRole = 'Hackathon Judge / Admin',
  socketIo = null
}) {
  const startTime = Date.now();
  const testId = `CHAOS-${Date.now().toString().slice(-6)}`;
  const logsDump = [];

  const addLog = (subsystem, message, level = 'crit') => {
    const elapsed = Date.now() - startTime;
    const now = new Date();
    const timeStr = `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    const entry = {
      timestamp: timeStr,
      elapsedMs: elapsed,
      subsystem,
      message,
      level
    };
    logsDump.push(entry);
    if (socketIo) {
      socketIo.emit('chaos:log', entry);
    }
  };

  let failureMode = '';
  let catastrophicOutcome = '';
  let simulationSummary = '';
  let ecologicalImpact = '';
  let economicCropLossEstimateUsd = 0;
  let humanCasualtyRiskLevel = 'MODERATE';
  let visualState = {};

  const isDbConnected = require('mongoose').connection.readyState === 1;

  // Fetch elephant for reference
  let elephant = null;
  if (isDbConnected) {
    try {
      elephant = await ElephantProfile.findOne({ collarId: targetElephantCollarId });
    } catch (e) {}
  }
  if (!elephant) {
    elephant = {
      collarId: 'EL-001',
      name: 'Raja',
      musthStatus: 'Active',
      calvesPresent: false,
      aggressionScore: 9.2
    };
  }

  // SCENARIO 1: ENGINEERING DISABLED (System Blind)
  if (disabledEngineering) {
    failureMode = 'CATASTROPHIC FAILURE: SYSTEM BLIND (Engineering Severed)';
    catastrophicOutcome = 'SENSORS OFFLINE: ZERO EARLY DETECTION - ELEPHANT HERD REACHES HOMESTEADS UNDETECTED';
    simulationSummary =
      'Without AI optical cameras and solar LoRa nodes, the biological and agricultural modules are rendered helpless. Veterinary DB is never queried. Solenoid valves stay closed or require 24/7 continuous blind spraying which empties 500L chili tanks in 42 minutes, toxicating soil and forcing villagers back to perilous night patrols.';
    ecologicalImpact =
      'Uncontrolled crop trampling. If spray runs blindly, soil acidification and pollinator devastation occur within 48 hours.';
    economicCropLossEstimateUsd = 28500;
    humanCasualtyRiskLevel = 'CATASTROPHIC';

    visualState = {
      cameraStaticNoise: true,
      nodesGrayedOut: true,
      coordinateMappingFailed: true,
      aiBBoxActive: false,
      vetStatus: 'NOT_QUERIED',
      agroValveStatus: 'BLIND_LOCKOUT'
    };

    addLog('CHAOS-MATRIX', 'INJECTING FAULT: Engineering Module disconnected by evaluator.', 'warn');
    addLog('SYS-ENG', 'FATAL: Camera telemetry stream aborted. Optical IR mesh offline.', 'crit');
    addLog('SYS-VET', 'STANDBY: No collar RFID or optical frame relayed. Biometric engine stalled.', 'warn');
    addLog('SYS-AGRO', 'VALVE-LOCK: Agro solenoids receive 0 trigger pulses. Village boundary unprotected.', 'crit');
    addLog('DISPATCH', 'CRITICAL CASUALTY RISK: Subject penetrated 800m inside village boundary. Night sirens silent.', 'crit');
  }

  // SCENARIO 2: VETERINARY DISABLED (Indiscriminate Firing & Habituation)
  else if (disabledVeterinary) {
    failureMode = 'CATASTROPHIC FAILURE: INDISCRIMINATE FIRING & RAPID HABITUATION (Veterinary Severed)';
    catastrophicOutcome = 'BIOLOGICAL BLINDNESS: CALVES SPRAYED WITH MAXIMUM CHILI OR BULL HABITUATES AND SMASHES FENCE';
    simulationSummary =
      'Without Veterinary Biometrics, the system treats all subjects as generic threats. A calm matriarch herd with 3 newborn calves gets blasted with 150 PSI chili oleoresin, causing a panicked lethal stampede. Conversely, an intelligent bull like Raja receives low-tier bee frequencies during active Musth, quickly habituates to the stimuli, learns to disregard it, and destroys the fence infrastructure.';
    ecologicalImpact =
      'Severe animal welfare violation. High risk of calf abandonment during panic stampede. Irreversible behavioral desensitization.';
    economicCropLossEstimateUsd = 16200;
    humanCasualtyRiskLevel = 'SEVERE';

    visualState = {
      cameraStaticNoise: false,
      nodesGrayedOut: false,
      coordinateMappingFailed: false,
      aiBBoxActive: true,
      vetBiometricDisconnected: true,
      vetProfileReturn: 'UNKNOWN_SUBJECT',
      musthReadout: 'SENSOR_OFFLINE',
      agroIndiscriminateFiring: true
    };

    addLog('CHAOS-MATRIX', 'INJECTING FAULT: Veterinary Intelligence Registry disconnected.', 'warn');
    addLog('SYS-ENG', 'Subject detected at Sector 04 (Confidence 98.2%). Relaying collar RFID EL-002...', 'eng');
    addLog('SYS-VET', 'ERROR 503: Veterinary DB unreachable. Returning DEFAULT_GENERIC_SUBJECT.', 'crit');
    addLog('SYS-DECISION', 'FALLBACK TO INDISCRIMINATE FIRING: Deploying maximum Tier-3 Chemical Curtain.', 'crit');
    addLog('VET-ETHICS', 'ETHICAL DISASTER: High-pressure chili mist deployed directly into nursing calves face.', 'crit');
    addLog('HERD-PANIC', 'Matriarch herd stampedes into adjacent paddy. Severe calf distress logged.', 'crit');
  }

  // SCENARIO 3: AGRICULTURE DISABLED (Zero Physical Deterrence)
  else if (disabledAgriculture) {
    failureMode = 'CATASTROPHIC FAILURE: ZERO PHYSICAL DETERRENCE (Agriculture Severed)';
    catastrophicOutcome = 'ARMLESS GUARDIAN: PERFECT AI DETECTION & VET DANGER FLAGGED, BUT 0 PSI DELIVERED';
    simulationSummary =
      'Engineering AI flawlessly detects Raja at 98.4% confidence. Veterinary DB accurately warns of peak Musth and critical aggression (9.2/10). However, with Agriculture solenoids and acoustic banks disabled, line pressure drops to 0 PSI. The bull walks straight past the expensive cameras and devours the village rice crop.';
    ecologicalImpact =
      'Total harvest devastation across 14 hectares of seasonal paddy. Retaliatory farmer hostility and illegal wire poisoning risk.';
    economicCropLossEstimateUsd = 34000;
    humanCasualtyRiskLevel = 'CATASTROPHIC';

    visualState = {
      cameraStaticNoise: false,
      nodesGrayedOut: false,
      coordinateMappingFailed: false,
      aiBBoxActive: true,
      vetStatus: 'ACTIVE_MUSTH_FLAGGED',
      agroPsiGauge: 0,
      agroAcousticMuted: true,
      agroValveStatus: 'ZERO_PAYLOAD'
    };

    addLog('CHAOS-MATRIX', 'INJECTING FAULT: Agricultural Deterrent Subsystem disconnected.', 'warn');
    addLog('SYS-ENG', 'Bull detected (Apex Tusker). Coordinates relayed to Decision Engine.', 'eng');
    addLog('SYS-VET', 'CRITICAL WARNING: Subject is Bull #04 (Raja) in Peak Musth. Escalation required.', 'vet');
    addLog('SYS-AGRO', 'FAULT: Solenoid manifold unpowered. Line Pressure: 0 PSI. Acoustic banks silent.', 'crit');
    addLog('BREACH-EVENT', 'Bull walks past harmless camera pole. North paddy perimeter breached completely.', 'crit');
  }

  // SCENARIO 4: MULTIPLE / ALL DISABLED
  else {
    failureMode = 'TOTAL SYSTEM COLLAPSE (Multiple Disciplinary Pillars Offline)';
    catastrophicOutcome = 'UNMITIGATED CONFLICT ZONE: COMMAND CENTER OFFLINE';
    simulationSummary = 'Multiple subsystems deactivated simultaneously. Total network partition.';
    economicCropLossEstimateUsd = 45000;
    humanCasualtyRiskLevel = 'CATASTROPHIC';
    visualState = { totalOffline: true };
    addLog('CHAOS-MATRIX', 'CRITICAL: Multiple subsystem pillars offline.', 'crit');
  }

  // Record Chaos Log
  const chaosLog = new ChaosSimulationLog({
    testId,
    testedByRole,
    disabledModules: {
      engineering: disabledEngineering,
      veterinary: disabledVeterinary,
      agriculture: disabledAgriculture
    },
    failureMode,
    catastrophicOutcome,
    simulationSummary,
    ecologicalImpact,
    economicCropLossEstimateUsd,
    humanCasualtyRiskLevel,
    logsDump
  });

  // Create corresponding failure incident
  const incidentCode = `CHAOS-${Date.now().toString().slice(-6)}`;
  const breachIncident = new BreachIncident({
    incidentCode,
    nodeId: disabledEngineering ? 'NODE-XX (OFFLINE)' : 'NODE-04',
    sectorName: 'Sector 04 - North Paddy Buffer',
    elephantName: disabledVeterinary ? 'UNKNOWN (VET UNREACHABLE)' : elephant.name,
    collarId: disabledVeterinary ? 'N/A' : elephant.collarId,
    subjectType: 'Elephant',
    engineering: {
      aiConfidence: disabledEngineering ? 0 : 98.4,
      opticalTrigger: !disabledEngineering,
      thermalDeltaC: disabledEngineering ? 0 : 5.8,
      networkLatencyMs: disabledEngineering ? 9999 : 42,
      solarLevel: disabledEngineering ? 0 : 94
    },
    veterinary: {
      musthStatus: disabledVeterinary ? 'N/A - Female' : elephant.musthStatus,
      biologicalThreatLevel: disabledVeterinary ? 'None' : 'Critical'
    },
    agriculture: {
      deterrentDeployed: disabledAgriculture ? 'Standby_Log_Only' : 'High_Pressure_Chili_Curtain_Tier3',
      valveDurationSec: 0,
      chiliDischargedLiters: disabledAgriculture ? 0 : 12.0
    },
    outcome: disabledEngineering
      ? 'CATASTROPHIC_BREACH_VILLAGE_INVADED'
      : (disabledVeterinary ? 'FAILED_INDISCRIMINATE_SPRAY_STAMPEDE' : 'CATASTROPHIC_BREACH_VILLAGE_INVADED'),
    cropDamagePreventedUsd: 0,
    villageEarlyWarningDispatched: !disabledEngineering,
    chaosTestRun: true,
    disabledModules: [
      disabledEngineering ? 'engineering' : null,
      disabledVeterinary ? 'veterinary' : null,
      disabledAgriculture ? 'agriculture' : null
    ].filter(Boolean),
    failureSummary: simulationSummary
  });

  if (isDbConnected) {
    try {
      await chaosLog.save();
      await breachIncident.save();
    } catch (e) {}
  }

  return {
    success: true,
    testId,
    failureMode,
    catastrophicOutcome,
    simulationSummary,
    ecologicalImpact,
    economicCropLossEstimateUsd,
    humanCasualtyRiskLevel,
    visualState,
    logsDump,
    incident: breachIncident,
    executionTimeMs: Date.now() - startTime
  };
}

module.exports = {
  executeChaosSimulation
};
