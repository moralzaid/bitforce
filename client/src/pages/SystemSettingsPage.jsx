import React, { useState } from 'react';
import { Sliders, Save, CheckCircle2, RotateCcw } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export default function SystemSettingsPage() {
  const { resetSystem } = useSimulation();

  const [aiThreshold, setAiThreshold] = useState(85);
  const [musthMultiplier, setMusthMultiplier] = useState(1.8);
  const [maxSafeWind, setMaxSafeWind] = useState(25);
  const [chiliDuration, setChiliDuration] = useState(6);
  const [tankReservePct, setTankReservePct] = useState(15);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-5 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <div>
            <h1 className="text-base font-bold text-slate-100 uppercase tracking-wider">
              System Settings & Threshold Configuration
            </h1>
            <p className="text-[11px] text-slate-400 font-sans">
              Calibrate core state machine thresholds, chemical discharge duration, and biological threat multipliers.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <form onSubmit={handleSave} className="space-y-4">
          {/* AI Threshold */}
          <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
            <div className="flex justify-between mb-1">
              <span className="text-slate-200 font-bold">AI Computer Vision Confidence Gate</span>
              <span className="text-cyan-400 font-bold">{aiThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              value={aiThreshold}
              onChange={(e) => setAiThreshold(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              Minimum YOLOv8 inference confidence required to confirm subject classification before querying veterinary biometrics.
            </p>
          </div>

          {/* Musth Aggression Multiplier */}
          <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
            <div className="flex justify-between mb-1">
              <span className="text-slate-200 font-bold">Musth Aggression Multiplier</span>
              <span className="text-rose-400 font-bold">{musthMultiplier}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="3.0"
              step="0.1"
              value={musthMultiplier}
              onChange={(e) => setMusthMultiplier(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              Biological threat escalation scalar applied to historical aggression when active Musth / temporal drainage is flagged.
            </p>
          </div>

          {/* Max Safe Wind Speed */}
          <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
            <div className="flex justify-between mb-1">
              <span className="text-slate-200 font-bold">Maximum Safe Wind Speed Lockout</span>
              <span className="text-blue-400 font-bold">{maxSafeWind} km/h</span>
            </div>
            <input
              type="range"
              min="15"
              max="40"
              value={maxSafeWind}
              onChange={(e) => setMaxSafeWind(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              Wind velocity threshold above which chili-oleoresin spray is locked out to prevent aerosol drift toward village dwellings.
            </p>
          </div>

          {/* Chili Discharge Duration */}
          <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
            <div className="flex justify-between mb-1">
              <span className="text-slate-200 font-bold">Tier 3 Chili Burst Duration</span>
              <span className="text-emerald-400 font-bold">{chiliDuration} seconds</span>
            </div>
            <input
              type="range"
              min="2"
              max="15"
              value={chiliDuration}
              onChange={(e) => setChiliDuration(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 font-sans mt-1">
              Solenoid valve open time for high-pressure 145 PSI chili curtain deployment (~1.2 L/sec discharge rate).
            </p>
          </div>

          {saved && (
            <div className="p-2.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Threshold parameters persisted to system kernel</span>
            </div>
          )}

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={resetSystem}
              className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              Reset Hardware Defaults
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition flex items-center space-x-1.5 shadow-lg shadow-cyan-950/40"
            >
              <Save className="w-3.5 h-3.5" />
              <span>APPLY THRESHOLD CONFIGURATION</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
