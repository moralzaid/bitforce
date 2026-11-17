import React from 'react';
import { Gauge } from 'lucide-react';

export default function PsiGauge({ value = 145, max = 200, label = 'LINE PRESSURE' }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const isZero = value === 0;
  const isNominal = value >= 130 && value <= 160;

  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-950/70 border border-slate-800 font-mono text-xs">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="#1E293B" strokeWidth="8" fill="transparent" />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={isZero ? '#EF4444' : isNominal ? '#10B981' : '#F59E0B'}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 40}
            strokeDashoffset={2 * Math.PI * 40 * (1 - percentage / 100)}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span
            className={`text-xl font-extrabold ${
              isZero ? 'text-rose-400' : isNominal ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {value}
          </span>
          <span className="text-[9px] text-slate-500 uppercase">PSI</span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <div className="text-[10px] text-slate-400">{label}</div>
        <div
          className={`text-[10px] font-bold ${
            isZero ? 'text-rose-400' : isNominal ? 'text-emerald-400' : 'text-amber-400'
          }`}
        >
          {isZero ? 'ZERO PAYLOAD (OFFLINE)' : isNominal ? 'OPTIMAL ATOMIZATION' : 'PRESSURE WARNING'}
        </div>
      </div>
    </div>
  );
}
