import React, { useState } from 'react';
import { Terminal, Download, Pause, Play, Filter, Trash2 } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export default function LiveTerminalTicker() {
  const { telemetryLogs, addManualLog } = useSimulation();
  const [filter, setFilter] = useState('ALL');
  const [autoScroll, setAutoScroll] = useState(true);

  const filteredLogs = telemetryLogs.filter((log) => {
    if (filter === 'ALL') return true;
    if (filter === 'ENG') return log.subsystem?.includes('ENG');
    if (filter === 'VET') return log.subsystem?.includes('VET');
    if (filter === 'AGRO') return log.subsystem?.includes('AGRO') || log.subsystem?.includes('VALVE');
    if (filter === 'CHAOS') return log.subsystem?.includes('CHAOS') || log.level === 'crit';
    return true;
  });

  const getSubsystemBadgeClass = (subsystem, level) => {
    if (level === 'crit' || subsystem?.includes('CHAOS')) {
      return 'text-rose-400 bg-rose-950/50 border-rose-500/30';
    }
    if (subsystem?.includes('ENG')) {
      return 'text-cyan-400 bg-cyan-950/50 border-cyan-500/30';
    }
    if (subsystem?.includes('VET')) {
      return 'text-amber-400 bg-amber-950/50 border-amber-500/30';
    }
    if (subsystem?.includes('AGRO') || subsystem?.includes('VALVE')) {
      return 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30';
    }
    return 'text-blue-400 bg-blue-950/50 border-blue-500/30';
  };

  const handleExport = () => {
    const text = telemetryLogs
      .map((l) => `[${l.timestamp}] [${l.subsystem}] ${l.message}`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trident_telemetry_${Date.now()}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col h-full shadow-xl overflow-hidden font-mono text-xs">
      {/* Terminal Header */}
      <div className="bg-slate-950/80 px-3 py-2 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-slate-200 tracking-wider">LIVE TELEMETRY TICKER</span>
          <span className="text-[10px] text-slate-500">({telemetryLogs.length} events)</span>
        </div>

        {/* Filter Badges & Controls */}
        <div className="flex items-center space-x-1.5 text-[10px]">
          {['ALL', 'ENG', 'VET', 'AGRO', 'CHAOS'].map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-2 py-0.5 rounded border transition ${
                filter === tag
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
          <button
            onClick={handleExport}
            title="Download Telemetry Log File"
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 ml-1"
          >
            <Download className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Terminal Log Output Body */}
      <div className="p-3 overflow-y-auto space-y-1 flex-1 max-h-80 select-text bg-[#070A10]">
        {filteredLogs.length === 0 ? (
          <div className="text-slate-600 text-center py-6">No telemetry events matching filter.</div>
        ) : (
          filteredLogs.map((log, index) => (
            <div
              key={index}
              className={`flex items-start space-x-2 py-0.5 leading-relaxed rounded px-1 transition ${
                index === 0 ? 'bg-cyan-500/5' : 'hover:bg-slate-800/40'
              }`}
            >
              <span className="text-slate-500 shrink-0 text-[10px]">[{log.timestamp}]</span>
              <span
                className={`px-1.5 py-0.2 rounded border text-[10px] font-bold shrink-0 ${getSubsystemBadgeClass(
                  log.subsystem,
                  log.level
                )}`}
              >
                [{log.subsystem}]
              </span>
              <span
                className={`flex-1 text-[11px] ${
                  log.level === 'crit'
                    ? 'text-rose-400 font-bold'
                    : log.level === 'warn'
                    ? 'text-amber-300'
                    : log.level === 'eng'
                    ? 'text-cyan-200'
                    : log.level === 'vet'
                    ? 'text-amber-200'
                    : log.level === 'agro'
                    ? 'text-emerald-200'
                    : 'text-slate-300'
                }`}
              >
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Terminal Footer status */}
      <div className="bg-slate-950/90 px-3 py-1.5 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>WEBSOCKET 42ms · LORA SYNC ACTIVE</span>
        </span>
        <span className="text-slate-400">TRIDENT KERNEL v2.4</span>
      </div>
    </div>
  );
}
