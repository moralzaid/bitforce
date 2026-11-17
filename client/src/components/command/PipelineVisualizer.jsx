import React from 'react';
import { motion } from 'framer-motion';
import {
  Radar,
  Cpu,
  HeartPulse,
  Sprout,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Volume2,
  Activity,
  Layers
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export default function PipelineVisualizer() {
  const { activeStages, activeBreach, isSimulating, chaosMode } = useSimulation();

  // If no breach simulated yet, provide baseline state
  const stage1 = activeStages?.stage1_trigger || {
    detectedSubjectType: 'Elephas maximus',
    nodeId: 'NODE-04 (Standby Scan)',
    collarId: 'EL-001'
  };

  const stage2 = activeStages?.stage2_engineering || {
    nodeId: 'NODE-04',
    aiConfidence: 98.4,
    thermalDeltaC: 5.4,
    solarBatteryLevel: 94,
    meshLatencyMs: 42,
    status: chaosMode.engineeringDisabled ? 'SYSTEM_BLIND' : 'TARGET_LOCKED'
  };

  const stage3 = activeStages?.stage3_veterinary || {
    collarId: 'EL-001',
    name: 'Raja (Apex Bull)',
    musthStatus: 'Active',
    testosteroneIndex: 94,
    aggressionScore: 9.2,
    biologicalThreatLevel: chaosMode.veterinaryDisabled ? 'UNKNOWN_INDISCRIMINATE' : 'Critical'
  };

  const stage4 = activeStages?.stage4_agriculture || {
    zoneName: 'North Paddy Buffer Area',
    deterrentDeployed: chaosMode.agricultureDisabled ? 'ZERO_PRESSURE_FAIL' : 'High_Pressure_Chili_Curtain_Tier3',
    linePressurePsi: chaosMode.agricultureDisabled ? 0 : 145,
    acousticFrequencyHz: 520,
    chiliDischargedLiters: chaosMode.agricultureDisabled ? 0 : 8.5,
    valveActuated: 'SOL-04A'
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
            Tri-Disciplinary State Machine Pipeline
          </h2>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-mono">
          <span className="text-slate-400">Total Latency:</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
            {activeBreach?.executionLatency?.totalHandshakeTimeMs || 232}ms
          </span>
        </div>
      </div>

      {/* Grid of 4 Pipeline Stages */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
        {/* STAGE 1: TRIGGER INPUT */}
        <motion.div
          animate={isSimulating ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.8, repeat: isSimulating ? Infinity : 0 }}
          className="rounded-lg bg-slate-950/70 border border-slate-800 p-3 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">STAGE 01</span>
              <Radar className="w-4 h-4 text-slate-400" />
            </div>
            <div className="font-bold text-xs text-slate-200 mb-1">Perimeter Intrusion</div>
            <p className="text-[11px] text-slate-400 mb-3">Optical-IR beam broken at fence line</p>
          </div>
          <div className="space-y-1.5 text-[11px] font-mono bg-slate-900/60 p-2 rounded border border-slate-800/80">
            <div className="flex justify-between">
              <span className="text-slate-500">Subject:</span>
              <span className="text-slate-200 font-semibold">{stage1.detectedSubjectType || 'Elephant'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sector:</span>
              <span className="text-cyan-400 font-bold">{stage1.nodeId?.slice(0, 7) || 'NODE-04'}</span>
            </div>
          </div>
        </motion.div>

        {/* STAGE 2: ENGINEERING MODULE */}
        <motion.div
          animate={isSimulating ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.8, delay: 0.2, repeat: isSimulating ? Infinity : 0 }}
          className={`rounded-lg p-3 flex flex-col justify-between border transition ${
            chaosMode.engineeringDisabled
              ? 'bg-red-950/30 border-red-500/50'
              : 'bg-cyan-950/20 border-cyan-500/30 hover:border-cyan-500/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                STAGE 02 · ENG
              </span>
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="font-bold text-xs text-cyan-200 mb-1">AI Edge Vision & Mesh</div>
            <p className="text-[11px] text-slate-400 mb-3">YOLOv8 Edge model inference & LoRa</p>
          </div>
          <div className="space-y-1.5 text-[11px] font-mono bg-slate-950/60 p-2 rounded border border-slate-800">
            {chaosMode.engineeringDisabled ? (
              <div className="text-red-400 text-center font-bold py-1">SYSTEM BLIND</div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-500">Confidence:</span>
                  <span className="text-cyan-400 font-bold">{stage2.aiConfidence || 98.4}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Thermal ΔT:</span>
                  <span className="text-amber-400">+{stage2.thermalDeltaC || 5.4}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mesh Ping:</span>
                  <span className="text-slate-300">{stage2.meshLatencyMs || 42}ms</span>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* STAGE 3: VETERINARY MODULE */}
        <motion.div
          animate={isSimulating ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.8, delay: 0.4, repeat: isSimulating ? Infinity : 0 }}
          className={`rounded-lg p-3 flex flex-col justify-between border transition ${
            chaosMode.veterinaryDisabled
              ? 'bg-red-950/30 border-red-500/50'
              : 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                STAGE 03 · VET
              </span>
              <HeartPulse className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-bold text-xs text-amber-200 mb-1">Biological Threat Matrix</div>
            <p className="text-[11px] text-slate-400 mb-3">Collar biometrics, Musth & hormones</p>
          </div>
          <div className="space-y-1.5 text-[11px] font-mono bg-slate-950/60 p-2 rounded border border-slate-800">
            {chaosMode.veterinaryDisabled ? (
              <div className="text-red-400 text-center font-bold py-1">UNKNOWN_SUBJECT</div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-500">Profile:</span>
                  <span className="text-amber-300 font-bold truncate max-w-[120px]">{stage3.name?.split(' ')[0] || 'Raja'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Musth:</span>
                  <span className={`font-bold ${stage3.musthStatus === 'Active' ? 'text-rose-400' : 'text-slate-300'}`}>
                    {stage3.musthStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Threat Matrix:</span>
                  <span className="text-rose-400 font-bold">{stage3.biologicalThreatLevel}</span>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* STAGE 4: AGRICULTURAL MODULE */}
        <motion.div
          animate={isSimulating ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.8, delay: 0.6, repeat: isSimulating ? Infinity : 0 }}
          className={`rounded-lg p-3 flex flex-col justify-between border transition ${
            chaosMode.agricultureDisabled
              ? 'bg-red-950/30 border-red-500/50'
              : 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                STAGE 04 · AGRO
              </span>
              <Sprout className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-bold text-xs text-emerald-200 mb-1">Adaptive Deterrent</div>
            <p className="text-[11px] text-slate-400 mb-3">Acoustic bee banks & pressurized mist</p>
          </div>
          <div className="space-y-1.5 text-[11px] font-mono bg-slate-950/60 p-2 rounded border border-slate-800">
            {chaosMode.agricultureDisabled ? (
              <div className="text-red-400 text-center font-bold py-1">ZERO_PRESSURE_FAIL</div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payload:</span>
                  <span className="text-emerald-400 font-bold truncate max-w-[130px]">
                    {stage4.deterrentDeployed?.replace(/_/g, ' ') || 'Tier 3 Chili'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pressure:</span>
                  <span className="text-cyan-400">{stage4.linePressurePsi || 145} PSI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bee Swarm:</span>
                  <span className="text-amber-400">{stage4.acousticFrequencyHz || 380} Hz</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Outcome Banner */}
      {activeBreach && (
        <div className="mt-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">State Machine Outcome:</span>
            <span className="text-slate-100 font-bold">{activeBreach.outcome}</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="text-slate-500">Crop Valuation Protected:</span>
            <span className="text-emerald-400 font-bold">+${activeBreach.cropDamagePreventedUsd?.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
