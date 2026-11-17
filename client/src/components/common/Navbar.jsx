import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Cpu,
  HeartPulse,
  Sprout,
  Wind,
  Zap,
  RotateCcw,
  ChevronDown,
  UserCheck,
  Radio,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSimulation } from '../../context/SimulationContext';

export default function Navbar() {
  const { user, currentRole, switchDemoRole } = useAuth();
  const { systemState, isSimulating, triggerBreach, resetSystem } = useSimulation();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roles = [
    { name: 'Judge/Admin', label: 'Hackathon Judge / Admin', desc: 'Full System Control & Chaos Overrides', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
    { name: 'Veterinary Officer', label: 'Veterinary Officer', desc: 'Musth Biometrics & Hormone Rules', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
    { name: 'Field Engineer', label: 'Field Engineer', desc: 'Solar Mesh & Camera Edge Nodes', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
    { name: 'Agricultural Officer', label: 'Agricultural Officer', desc: 'Chili Tanks & Acoustic Arrays', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' }
  ];

  const handleQuickTrigger = async () => {
    // Quick Judge demo trigger: Raja in active musth at Sector 04
    await triggerBreach({
      nodeId: 'NODE-04',
      elephantCollarId: 'EL-001'
    });
  };

  return (
    <header className="h-16 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-50">
      {/* Brand & System Status */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded bg-gradient-to-br from-cyan-500 via-blue-600 to-emerald-500 p-[1px] flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition">
            <div className="w-full h-full bg-slate-950 rounded flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-wider text-slate-100 font-mono">TRIDENT</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">v2.4</span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block tracking-tight">Tri-Disciplinary HEC Bio-Fence Mesh</p>
          </div>
        </Link>

        {/* Global Mesh Status Badge */}
        <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 font-mono text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-semibold">MESH ONLINE</span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-400 text-[11px]">12/12 NODES</span>
        </div>
      </div>

      {/* Disciplinary Health Indicators */}
      <div className="hidden xl:flex items-center space-x-5 text-xs font-mono">
        {/* Engineering Health */}
        <div className="flex items-center space-x-2 text-slate-300 bg-slate-800/40 px-2.5 py-1 rounded border border-slate-700/40">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">ENG:</span>
          <span className="text-cyan-400 font-bold">{systemState.engineeringHealth}%</span>
        </div>

        {/* Veterinary Sync */}
        <div className="flex items-center space-x-2 text-slate-300 bg-slate-800/40 px-2.5 py-1 rounded border border-slate-700/40">
          <HeartPulse className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">VET DB:</span>
          <span className="text-amber-400 font-bold">SYNCED</span>
          <span className="text-rose-400 text-[10px] px-1 bg-rose-500/20 rounded">
            {systemState.activeMusthAlerts} MUSTH
          </span>
        </div>

        {/* Agriculture Pressure */}
        <div className="flex items-center space-x-2 text-slate-300 bg-slate-800/40 px-2.5 py-1 rounded border border-slate-700/40">
          <Sprout className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400">AGRO:</span>
          <span className="text-emerald-400 font-bold">{systemState.agroPsi} PSI</span>
        </div>

        {/* Weather / Wind */}
        <div className="flex items-center space-x-1.5 text-slate-400 bg-slate-800/30 px-2 py-1 rounded border border-slate-800">
          <Wind className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-300">{systemState.windSpeedKmh} km/h S</span>
        </div>
      </div>

      {/* Action Controls & Role Switcher */}
      <div className="flex items-center space-x-3">
        {/* Reset System State CTA */}
        <button
          onClick={resetSystem}
          title="Restore chili tanks and reset mesh state"
          className="p-2 rounded bg-slate-800/70 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-slate-100 transition text-xs font-mono flex items-center space-x-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">RESET</span>
        </button>

        {/* 1-Click Quick Intrusion Trigger CTA */}
        <button
          onClick={handleQuickTrigger}
          disabled={isSimulating}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded text-xs font-mono font-bold tracking-wider uppercase transition shadow-lg ${
            isSimulating
              ? 'bg-amber-600 text-slate-100 animate-pulse'
              : 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-rose-900/30 border border-rose-500/40'
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'EXECUTING PIPELINE...' : 'TRIGGER BREACH'}</span>
        </button>

        {/* Instant Demo Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center space-x-2 px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 hover:border-slate-600 transition text-xs font-mono"
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <div className="text-left hidden md:block">
              <div className="text-[10px] text-slate-400 leading-none">ACTIVE ROLE</div>
              <div className="font-semibold text-slate-200 leading-tight">{currentRole}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-lg bg-slate-900/98 border border-slate-700 shadow-2xl p-2 z-50 backdrop-blur-xl">
              <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1 flex items-center justify-between">
                <span>Instant Demo Role Switcher</span>
                <span className="text-cyan-400">Zero Password</span>
              </div>
              <div className="space-y-1">
                {roles.map((r) => (
                  <button
                    key={r.name}
                    onClick={() => {
                      switchDemoRole(r.name);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded transition flex flex-col space-y-0.5 border ${
                      currentRole === r.name ? r.color : 'border-transparent hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{r.label}</span>
                      {currentRole === r.name && (
                        <span className="text-[10px] font-mono px-1 rounded bg-slate-800">ACTIVE</span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
