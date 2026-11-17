import React from 'react';
import { Flame, Droplets, RefreshCw } from 'lucide-react';

export default function ChiliTankMeter({ currentLiters = 460, capacityLiters = 500, onRefill }) {
  const percentage = Math.round((currentLiters / capacityLiters) * 100);
  const isLow = percentage <= 20;

  return (
    <div className="flex flex-col p-3 rounded-lg bg-slate-950/70 border border-slate-800 font-mono text-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-1.5 text-rose-400">
          <Flame className="w-3.5 h-3.5" />
          <span className="font-bold">CHILI OLEORESIN TANK</span>
        </div>
        <span className={`font-bold text-xs ${isLow ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
          {percentage}% FULL
        </span>
      </div>

      {/* Visual Liquid Reservoir Container */}
      <div className="relative w-full h-16 bg-slate-900 rounded-lg overflow-hidden border border-slate-700/80 p-1 flex items-end">
        {/* Animated Liquid Fill */}
        <div
          className={`w-full rounded transition-all duration-700 ease-out flex items-center justify-center ${
            isLow
              ? 'bg-gradient-to-t from-red-700 to-rose-500'
              : 'bg-gradient-to-t from-rose-900 via-red-600 to-orange-500'
          }`}
          style={{ height: `${percentage}%` }}
        >
          {percentage > 25 && (
            <span className="text-[10px] text-white font-bold drop-shadow">
              {currentLiters}L / {capacityLiters}L
            </span>
          )}
        </div>
      </div>

      {/* Tank Controls */}
      <div className="mt-2.5 flex items-center justify-between text-[10px]">
        <span className="text-slate-400">Capsaicin Density: 1.2M SHU</span>
        {onRefill && (
          <button
            onClick={onRefill}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition font-bold"
          >
            <RefreshCw className="w-2.5 h-2.5" />
            <span>REFILL 500L</span>
          </button>
        )}
      </div>
    </div>
  );
}
