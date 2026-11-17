import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { simulationAPI } from '../services/api';

const SimulationContext = createContext();

const initialLogs = [
  { timestamp: '12:14:00.010', subsystem: 'TRIDENT-BOOT', message: 'Tactical Kernel initialized. LoRa Mesh Mesh-ID #882 online.', level: 'info' },
  { timestamp: '12:14:00.080', subsystem: 'ENG-TELEMETRY', message: '12 Sector Nodes pinged: 100% optical & thermal sensors nominal.', level: 'eng' },
  { timestamp: '12:14:00.150', subsystem: 'VET-DB-SYNC', message: 'Synchronized 15 GPS-collared profiles. 4 Active Musth alerts flagged.', level: 'vet' },
  { timestamp: '12:14:00.220', subsystem: 'AGRO-PRESS', message: '6 Bio-Buffer zones pressurized: 145 PSI nominal. Tanks at 94%.', level: 'agro' }
];

export const SimulationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [telemetryLogs, setTelemetryLogs] = useState(initialLogs);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeBreach, setActiveBreach] = useState(null);
  const [activeStages, setActiveStages] = useState(null);
  const [chaosMode, setChaosMode] = useState({
    engineeringDisabled: false,
    veterinaryDisabled: false,
    agricultureDisabled: false
  });
  const [chaosResult, setChaosResult] = useState(null);
  const [systemState, setSystemState] = useState({
    meshStatus: 'ONLINE',
    engineeringHealth: 100,
    vetDbStatus: 'SYNCED',
    agroPsi: 145,
    windSpeedKmh: 14,
    windDirection: '185° S (Forest Buffer)',
    activeMusthAlerts: 4,
    totalDeterred: 154,
    cropSavedUsd: 148500
  });

  // Connect Socket.io
  useEffect(() => {
    const socketInstance = io(window.location.origin, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5
    });

    socketInstance.on('connect', () => {
      console.log('[TRIDENT CLIENT] Connected to Live Telemetry Socket:', socketInstance.id);
    });

    socketInstance.on('telemetry:log', (log) => {
      setTelemetryLogs((prev) => [log, ...prev].slice(0, 100));
    });

    socketInstance.on('simulation:breach_executed', (data) => {
      setActiveBreach(data.incident);
      setActiveStages(data.stages);
    });

    socketInstance.on('simulation:chaos_executed', (data) => {
      setChaosResult(data);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Fetch initial system state
  const refreshSystemState = async () => {
    try {
      const res = await simulationAPI.getSystemState();
      if (res.data?.success) {
        const d = res.data.data;
        setSystemState((prev) => ({
          ...prev,
          engineeringHealth: d.modules.engineering.healthPercent,
          vetDbStatus: d.modules.veterinary.status,
          agroPsi: d.modules.agriculture.nominalPsi,
          activeMusthAlerts: d.modules.veterinary.activeMusthAlerts
        }));
      }
    } catch (err) {
      console.warn('[SIM CONTEXT] Using local telemetry state fallback');
    }
  };

  useEffect(() => {
    refreshSystemState();
  }, []);

  // Trigger Breach Simulation
  const triggerBreach = async (payload = {}) => {
    setIsSimulating(true);
    try {
      const res = await simulationAPI.triggerBreach(payload);
      if (res.data?.success) {
        const result = res.data.data;
        setActiveBreach(result.incident);
        setActiveStages(result.stages);
        if (result.logs) {
          setTelemetryLogs((prev) => [...result.logs, ...prev].slice(0, 100));
        }
        await refreshSystemState();
        return { success: true, data: result };
      }
    } catch (error) {
      console.error('[SIMULATION ERROR]', error);
      // Fallback simulation output if offline
      const fallbackStages = {
        stage1_trigger: { detectedSubjectType: 'Elephant', nodeId: payload.nodeId || 'NODE-04' },
        stage2_engineering: {
          nodeId: payload.nodeId || 'NODE-04',
          aiConfidence: 98.4,
          subjectType: 'Elephant',
          thermalDeltaC: 5.6,
          solarBatteryLevel: 94,
          meshLatencyMs: 42,
          boundingBox: { x: 140, y: 90, width: 380, height: 420 },
          status: 'TARGET_LOCKED'
        },
        stage3_veterinary: {
          collarId: payload.elephantCollarId || 'EL-001',
          name: 'Raja (Apex Bull)',
          classification: 'Solitary Bull',
          musthStatus: 'Active',
          testosteroneIndex: 96,
          aggressionScore: 9.4,
          biologicalThreatLevel: 'Critical'
        },
        stage4_agriculture: {
          zoneId: 'ZONE-01',
          zoneName: 'North Paddy Buffer Area',
          deterrentDeployed: 'High_Pressure_Chili_Curtain_Tier3',
          valveActuated: 'SOL-04A',
          valveDurationSec: 8,
          chiliDischargedLiters: 8.5,
          acousticFrequencyHz: 520,
          tankRemainingLiters: 452,
          linePressurePsi: 145
        }
      };
      setActiveStages(fallbackStages);
      return { success: true, data: { stages: fallbackStages } };
    } finally {
      setIsSimulating(false);
    }
  };

  // Trigger Chaos Test
  const triggerChaosTest = async (overrides = {}) => {
    setIsSimulating(true);
    const params = {
      disabledEngineering: overrides.engineering !== undefined ? overrides.engineering : chaosMode.engineeringDisabled,
      disabledVeterinary: overrides.veterinary !== undefined ? overrides.veterinary : chaosMode.veterinaryDisabled,
      disabledAgriculture: overrides.agriculture !== undefined ? overrides.agriculture : chaosMode.agricultureDisabled,
      targetElephantCollarId: overrides.collarId || 'EL-001'
    };

    try {
      const res = await simulationAPI.triggerChaosTest(params);
      if (res.data?.success) {
        setChaosResult(res.data.data);
        if (res.data.data.logsDump) {
          setTelemetryLogs((prev) => [...res.data.data.logsDump, ...prev].slice(0, 100));
        }
        return { success: true, data: res.data.data };
      }
    } catch (err) {
      console.error('[CHAOS TEST ERROR]', err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Toggle individual Chaos Module
  const toggleChaosModule = (moduleKey) => {
    setChaosMode((prev) => {
      const updated = {
        ...prev,
        [moduleKey]: !prev[moduleKey]
      };
      return updated;
    });
  };

  // Reset System State
  const resetSystem = async () => {
    try {
      await simulationAPI.resetSystemState();
      setChaosMode({
        engineeringDisabled: false,
        veterinaryDisabled: false,
        agricultureDisabled: false
      });
      setChaosResult(null);
      setActiveBreach(null);
      setActiveStages(null);
      await refreshSystemState();
      const resetLog = {
        timestamp: new Date().toTimeString().split(' ')[0],
        subsystem: 'SYS-RESTORE',
        message: 'System reset: 100% chili tank replenishment & nominal PSI restored.',
        level: 'success'
      };
      setTelemetryLogs((prev) => [resetLog, ...prev]);
    } catch (err) {
      console.warn('[RESET ERROR]', err);
    }
  };

  const addManualLog = (subsystem, message, level = 'info') => {
    const now = new Date();
    const timeStr = `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    setTelemetryLogs((prev) => [{ timestamp: timeStr, subsystem, message, level }, ...prev]);
  };

  return (
    <SimulationContext.Provider
      value={{
        telemetryLogs,
        isSimulating,
        activeBreach,
        activeStages,
        chaosMode,
        chaosResult,
        systemState,
        triggerBreach,
        triggerChaosTest,
        toggleChaosModule,
        resetSystem,
        addManualLog,
        refreshSystemState
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => useContext(SimulationContext);
