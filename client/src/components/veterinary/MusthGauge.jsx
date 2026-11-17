import React from 'react';
import { Flame, AlertTriangle } from 'lucide-react';

export default function MusthGauge({ value = 25, status = 'Pre-Musth', temporalDrainage = false }) {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const isHigh = normalizedValue >= 75 || status === 'Active';
  const isModerate = normalizedValue >= 40 && normalizedValue < 75;

  const color = isHigh ? '#EF4444' : isModerate ? '#F59E0B' : '#10B981';
  const textColor = isHigh ? 'text-rose-400' : isModerate ? 'text-amber-400' : 'text-emerald-400';

  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-950/70 border border-slate-800 font-mono">
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* SVG Circular Ring Gauge */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#1E293B"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 40}
            strokeDashoffset={2 * Math.PI * 40 * (1 - normalizedValue / 100)}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-xl font-extrabold ${textColor}`}>{normalizedValue}</span>
          <span className="text-[9px] text-slate-500 uppercase tracking-tighter">TESTOSTERONE</span>
        </div>
      </div>

      <div className="mt-2 text-center space-y-1">
        <div className="flex items-center justify-center space-x-1.5">
          {isHigh && <Flame className="w-3.5 h-3.5 text-rose-500 animate-bounce" />}
          <span className={`text-xs font-bold ${textColor}`}>MUSTH: {status}</span>
        </div>
        {temporalDrainage && (
          <div className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 inline-block font-semibold">
            TEMPORAL DRAINAGE ACTIVE
          </div>
        )}
      </div>
    </div>
  );
}
