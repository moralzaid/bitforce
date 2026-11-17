import React, { useState } from 'react';
import {
  Sprout,
  Wind,
  Volume2,
  Lock,
  Unlock,
  ShieldAlert,
  Flame,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import PsiGauge from './PsiGauge';
import ChiliTankMeter from './ChiliTankMeter';
import { agricultureAPI } from '../../services/api';

export default function AgroZoneCard({ zone, onUpdated }) {
  const [tankLiters, setTankLiters] = useState(zone.chiliTankCurrentLiters);
  const [psi, setPsi] = useState(zone.linePressurePsi);
  const [frequencyHz, setFrequencyHz] = useState(zone.acousticFrequencyHz || 380);
  const [windLock, setWindLock] = useState(zone.windSafetyLockActive || false);
  const [saving, setSaving] = useState(false);

  const handleRefill = async () => {
    setSaving(true);
    try {
      const res = await agricultureAPI.refillTank(zone._id, { liters: 500, targetPsi: 145 });
      if (res.data?.success) {
        setTankLiters(500);
        setPsi(145);
        if (onUpdated) onUpdated();
      }
    } catch (err) {
      setTankLiters(500);
      setPsi(145);
    } finally {
      setSaving(false);
    }
  };

  const handleFrequencyChange = async (newHz) => {
    setFrequencyHz(newHz);
    try {
      await agricultureAPI.calibrateZone(zone._id, { acousticFrequencyHz: newHz });
    } catch (err) {
      // quiet
    }
  };

  const handleToggleWindLock = async () => {
    const updated = !windLock;
    setWindLock(updated);
    try {
      await agricultureAPI.calibrateZone(zone._id, { windSafetyLockActive: updated });
    } catch (err) {
      // quiet
    }
  };

  return (
    <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 shadow-xl flex flex-col justify-between font-mono text-xs">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                {zone.zoneId}
              </span>
              <h3 className="font-bold text-slate-100 text-sm">{zone.name}</h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
              Buffer: {zone.bufferCropType} · Sectors: {zone.sectorIds?.join(', ')}
            </p>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              zone.status === 'Armoured & Ready'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
          >
            {zone.status}
          </span>
        </div>

        {/* Meters Grid: Tank + PSI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <ChiliTankMeter
            currentLiters={tankLiters}
            capacityLiters={zone.chiliTankCapacityLiters || 500}
            onRefill={handleRefill}
          />
          <PsiGauge value={psi} max={200} />
        </div>

        {/* Acoustic Honeybee Frequency Control */}
        <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 mb-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-amber-400">
              <Volume2 className="w-3.5 h-3.5" />
              <span className="font-bold text-[11px]">BIO-ACOUSTIC HONEYBEE FREQUENCY</span>
            </div>
            <span className="text-amber-300 font-bold text-xs">{frequencyHz} Hz</span>
          </div>
          <input
            type="range"
            min="250"
            max="550"
            step="10"
            value={frequencyHz}
            onChange={(e) => handleFrequencyChange(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>250 Hz (Mild Swarm)</span>
            <span>380 Hz (Disturbed Hive)</span>
            <span>550 Hz (Attack Alert)</span>
          </div>
        </div>

        {/* Protected Villages & Crop Valuation */}
        <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80 mb-3 space-y-1 text-[11px]">
          <div className="flex justify-between text-slate-400">
            <span>Protected Communities:</span>
            <span className="text-slate-200 font-semibold truncate max-w-[200px]">
              {zone.villagesProtected?.join(', ')}
            </span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Protected Crop Valuation:</span>
            <span className="text-emerald-400 font-bold">
              ${zone.cropValuationUsd?.toLocaleString()} USD
            </span>
          </div>
        </div>
      </div>

      {/* Wind Blowback Safety Lock */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-[11px]">
          <Wind className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400">Wind Safety Lock:</span>
          <span className={`font-bold ${windLock ? 'text-rose-400' : 'text-emerald-400'}`}>
            {windLock ? 'ENGAGED (NO SPRAY)' : 'ARMED (SAFE DRIFT)'}
          </span>
        </div>
        <button
          onClick={handleToggleWindLock}
          className={`px-2 py-1 rounded text-[10px] font-bold border flex items-center space-x-1 transition ${
            windLock
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
        >
          {windLock ? <Lock className="w-3 h-3 text-rose-400" /> : <Unlock className="w-3 h-3 text-emerald-400" />}
          <span>{windLock ? 'LOCKED' : 'TOGGLE LOCK'}</span>
        </button>
      </div>
    </div>
  );
}
