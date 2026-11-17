import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Zap,
  Bomb,
  Compass,
  Cpu,
  HeartPulse,
  Sprout,
  History,
  BarChart3,
  Radio,
  FileCode2,
  Sliders,
  AlertTriangle
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export default function Sidebar() {
  const { chaosMode } = useSimulation();
  const isAnyChaosActive =
    chaosMode.engineeringDisabled || chaosMode.veterinaryDisabled || chaosMode.agricultureDisabled;

  const navSection = [
    {
      title: 'COMMAND & SIMULATION',
      items: [
        { name: 'Live Command Center', path: '/', icon: LayoutDashboard },
        { name: 'Breach Simulator', path: '/breach-simulator', icon: Zap },
        {
          name: 'Chaos Engineering Lab',
          path: '/chaos-lab',
          icon: Bomb,
          badge: isAnyChaosActive ? 'FAIL CASCADE' : 'PROVE TRIDENT',
          badgeColor: isAnyChaosActive ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
        },
        { name: 'Perimeter Sector Map', path: '/perimeter-map', icon: Compass }
      ]
    },
    {
      title: 'TRI-DISCIPLINARY PILLARS',
      items: [
        { name: 'Engineering Mesh Hub', path: '/engineering', icon: Cpu, accent: 'text-cyan-400' },
        { name: 'Veterinary Biometrics', path: '/veterinary', icon: HeartPulse, accent: 'text-amber-400' },
        { name: 'Agricultural Deterrents', path: '/agriculture', icon: Sprout, accent: 'text-emerald-400' }
      ]
    },
    {
      title: 'OPERATIONS & AUDIT',
      items: [
        { name: 'Incident History & Logs', path: '/incidents', icon: History },
        { name: 'Analytics & Efficacy', path: '/analytics', icon: BarChart3 },
        { name: 'Village Broadcast Siren', path: '/village-broadcast', icon: Radio },
        { name: 'System Architecture', path: '/architecture', icon: FileCode2, badge: 'PITCH VIEW' },
        { name: 'System Settings', path: '/settings', icon: Sliders }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col flex-shrink-0 min-h-[calc(100vh-4rem)]">
      <nav className="p-3 space-y-6 flex-1 overflow-y-auto">
        {navSection.map((section) => (
          <div key={section.title} className="space-y-1">
            <h3 className="px-3 text-[10px] font-mono tracking-wider text-slate-500 uppercase font-semibold">
              {section.title}
            </h3>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition ${
                        isActive
                          ? 'bg-slate-800 text-cyan-400 border-l-2 border-cyan-400 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${item.accent || ''}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                          item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Chaos Active Banner Warning in Sidebar */}
      {isAnyChaosActive && (
        <div className="p-3 m-3 rounded bg-red-950/60 border border-red-500/40 text-xs">
          <div className="flex items-center space-x-1.5 text-red-400 font-bold mb-1">
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
            <span>CHAOS MODE ACTIVE</span>
          </div>
          <p className="text-[11px] text-red-200/80 leading-tight">
            One or more core modules disconnected. Catastrophic cascades will trigger.
          </p>
        </div>
      )}

      {/* Quick GPS Latency Pill */}
      <div className="p-3 border-t border-slate-800 font-mono text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>LATENCY: 42ms</span>
        </span>
        <span className="text-slate-500 text-[10px]">CORRIDOR 04</span>
      </div>
    </aside>
  );
}
