import React, { useState } from 'react';
import PipelineVisualizer from '../components/command/PipelineVisualizer';
import CameraFeedSimulator from '../components/command/CameraFeedSimulator';
import TacticalPerimeterMap from '../components/command/TacticalPerimeterMap';
import LiveTerminalTicker from '../components/command/LiveTerminalTicker';
import { useSimulation } from '../context/SimulationContext';
import {
  ShieldAlert,
  Flame,
  Volume2,
  Wind,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function LiveCommandCenter() {
  const { systemState, activeBreach, chaosMode, triggerBreach, isSimulating } = useSimulation();
  const [selectedNode, setSelectedNode] = useState(null);

  const isAnyChaosActive =
    chaosMode.engineeringDisabled || chaosMode.veterinaryDisabled || chaosMode.agricultureDisabled;

  return (
    <div className="space-y-4">
      {/* Top Banner Alert (if Chaos Active) */}
      {isAnyChaosActive && (
        <div className="bg-rose-950/80 border border-rose-500/60 p-3 rounded-xl flex items-center justify-between text-xs font-mono text-rose-200 shadow-xl">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
            <span className="font-bold uppercase tracking-wider">
              CHAOS ENGINEERING MATRIX ACTIVE: ONE OR MORE DISCIPLINARY PILLARS DISABLED
            </span>
          </div>
          <span className="text-[11px] text-rose-300 underline font-sans">
            Catastrophic cascades will trigger on breach
          </span>
        </div>
      )}

      {/* KPI Telemetry Header Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-500 uppercase">MESH STATUS</div>
            <div className="text-base font-extrabold text-emerald-400 flex items-center space-x-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>12/12 ONLINE</span>
            </div>
          </div>
          <span className="text-slate-600 text-lg">⚡</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-500 uppercase">CROP VALUE SAVED</div>
            <div className="text-base font-extrabold text-emerald-400 mt-0.5">
              ${systemState.cropSavedUsd?.toLocaleString()} USD
            </div>
          </div>
          <span className="text-slate-600 text-lg">🛡️</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-500 uppercase">MUSTH BULLS FLAGGED</div>
            <div className="text-base font-extrabold text-rose-400 flex items-center space-x-1.5 mt-0.5">
              <Flame className="w-4 h-4 text-rose-500" />
              <span>{systemState.activeMusthAlerts} ACTIVE</span>
            </div>
          </div>
          <span className="text-slate-600 text-lg">🐘</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-500 uppercase">ZERO CASUALTY RECORD</div>
            <div className="text-base font-extrabold text-cyan-400 mt-0.5">412 CONSECUTIVE DAYS</div>
          </div>
          <span className="text-slate-600 text-lg">🤝</span>
        </div>
      </div>

      {/* 4-Stage Interactive Pipeline Visualizer */}
      <PipelineVisualizer />

      {/* Split Screen Mission Control: Left (Camera + Ticker) / Right (Perimeter Map) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (5 Cols): Camera Feed HUD + Hardware Valve status */}
        <div className="lg:col-span-5 space-y-4">
          <CameraFeedSimulator />

          {/* Hardware Actuator Status Panel */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-200">SECTOR 04 VALVE & ACOUSTIC TELEMETRY</span>
              <span className="text-emerald-400 font-bold">READY</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800">
                <div className="text-slate-500 text-[10px]">SOLENOID VALVE 04A</div>
                <div className="text-emerald-400 font-bold mt-0.5">145 PSI (ARMED)</div>
                <div className="text-slate-400 text-[10px]">Chili-Oleoresin Tank #1</div>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded border border-slate-800">
                <div className="text-slate-500 text-[10px]">ACOUSTIC BEE BANK</div>
                <div className="text-amber-400 font-bold mt-0.5">380 Hz SWARM</div>
                <div className="text-slate-400 text-[10px]">Dual Array (94 dB)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Tactical Perimeter Sector Map & Live Terminal */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          <TacticalPerimeterMap
            selectedNodeId={selectedNode?.id}
            onSelectNode={(node) => setSelectedNode(node)}
          />
          <LiveTerminalTicker />
        </div>
      </div>
    </div>
  );
}
