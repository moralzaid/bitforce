const { executeTriDisciplinaryPipeline } = require('../services/decisionEngine');
const { executeChaosSimulation } = require('../services/chaosEngine');

describe('TRIDENT Core Tri-Disciplinary State Machine & Chaos Engine Tests', () => {
  describe('Tri-Disciplinary State Machine Logic', () => {
    test('Active Musth Bull with Aggression >= 8 triggers Tier 3 High-Pressure Chili Curtain', async () => {
      // Simulate input for Bull in Active Musth
      const result = await executeTriDisciplinaryPipeline({
        nodeId: 'NODE-04',
        elephantCollarId: 'EL-001',
        customSubject: {
          _id: null,
          collarId: 'EL-001',
          name: 'Raja',
          musthStatus: 'Active',
          aggressionScore: 9.4,
          testosteroneIndex: 96,
          calvesPresent: false
        },
        environmentalOverrides: {
          windSpeedKmh: 12,
          windDirectionDeg: 180
        }
      });

      expect(result.success).toBe(true);
      expect(result.stages.stage4_agriculture.deterrentDeployed).toBe('High_Pressure_Chili_Curtain_Tier3');
      expect(result.stages.stage4_agriculture.chiliDischargedLiters).toBeGreaterThan(0);
      expect(result.stages.stage3_veterinary.biologicalThreatLevel).toBe('Critical');
      expect(result.incident.outcome).toBe('Violent Charge Halted by Chili Curtain');
    });

    test('Matriarch Herd with dependent calves triggers Tier 1 Acoustic Honeybee Swarm only (0L chili)', async () => {
      const result = await executeTriDisciplinaryPipeline({
        nodeId: 'NODE-02',
        elephantCollarId: 'EL-002',
        customSubject: {
          _id: null,
          collarId: 'EL-002',
          name: 'Kumari Matriarch',
          musthStatus: 'N/A - Female',
          aggressionScore: 2.4,
          calvesPresent: true,
          calfCount: 3
        },
        environmentalOverrides: {
          windSpeedKmh: 10,
          windDirectionDeg: 180
        }
      });

      expect(result.success).toBe(true);
      expect(result.stages.stage4_agriculture.deterrentDeployed).toBe('Acoustic_Bee_Swarm_Tier1');
      expect(result.stages.stage4_agriculture.chiliDischargedLiters).toBe(0);
      expect(result.incident.outcome).toBe('Herd Redirected - Calves Protected');
    });

    test('Non-target wildlife (Wild Boar) triggers Standby Log Only (0 deterrent wasted)', async () => {
      const result = await executeTriDisciplinaryPipeline({
        nodeId: 'NODE-07',
        customSubject: {
          type: 'Wild Boar',
          aiConfidence: 91.5
        }
      });

      expect(result.success).toBe(true);
      expect(result.stages.stage4_agriculture.deterrent).toBe('Standby_Log_Only');
      expect(result.incident.outcome).toBe('Monitored - Harmless Wildlife Logged');
    });

    test('High Wind blowing towards settlement triggers Wind Safety Lockout', async () => {
      const result = await executeTriDisciplinaryPipeline({
        nodeId: 'NODE-04',
        elephantCollarId: 'EL-001',
        customSubject: {
          _id: null,
          collarId: 'EL-001',
          name: 'Raja',
          musthStatus: 'Active',
          aggressionScore: 9.0,
          calvesPresent: false
        },
        environmentalOverrides: {
          windSpeedKmh: 32, // High wind > 25 km/h
          windDirectionDeg: 20 // Directed toward village houses
        }
      });

      expect(result.success).toBe(true);
      expect(result.stages.stage4_agriculture.windSafetyLockActive).toBe(true);
      expect(result.stages.stage4_agriculture.deterrentDeployed).toBe('Safety_Lockout_No_Spray');
    });
  });

  describe('The "Fails-if-Removed" Chaos Dependency Engine', () => {
    test('Severing Engineering Module produces CATASTROPHIC FAILURE: SYSTEM BLIND', async () => {
      const result = await executeChaosSimulation({
        disabledEngineering: true,
        disabledVeterinary: false,
        disabledAgriculture: false
      });

      expect(result.success).toBe(true);
      expect(result.failureMode).toContain('CATASTROPHIC FAILURE: SYSTEM BLIND');
      expect(result.visualState.cameraStaticNoise).toBe(true);
      expect(result.visualState.nodesGrayedOut).toBe(true);
      expect(result.humanCasualtyRiskLevel).toBe('CATASTROPHIC');
    });

    test('Severing Veterinary Module produces INDISCRIMINATE FIRING & HABITUATION', async () => {
      const result = await executeChaosSimulation({
        disabledEngineering: false,
        disabledVeterinary: true,
        disabledAgriculture: false
      });

      expect(result.success).toBe(true);
      expect(result.failureMode).toContain('INDISCRIMINATE FIRING');
      expect(result.visualState.vetProfileReturn).toBe('UNKNOWN_SUBJECT');
      expect(result.visualState.agroIndiscriminateFiring).toBe(true);
    });

    test('Severing Agricultural Module produces ZERO PHYSICAL DETERRENCE (0 PSI)', async () => {
      const result = await executeChaosSimulation({
        disabledEngineering: false,
        disabledVeterinary: false,
        disabledAgriculture: true
      });

      expect(result.success).toBe(true);
      expect(result.failureMode).toContain('ZERO PHYSICAL DETERRENCE');
      expect(result.visualState.agroPsiGauge).toBe(0);
      expect(result.economicCropLossEstimateUsd).toBeGreaterThan(0);
    });
  });
});
