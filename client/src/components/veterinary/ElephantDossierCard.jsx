import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  Flame,
  ShieldAlert,
  Baby,
  Activity,
  Zap,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import MusthGauge from './MusthGauge';
import { useSimulation } from '../../context/SimulationContext';

export default function ElephantDossierCard({ elephant, onSimulateWithElephant }) {
  const { triggerBreach, isSimulating } = useSimulation();

  const handleSimulate = () => {
    if (onSimulateWithElephant) {
      onSimulateWithElephant(elephant);
    } else {
      triggerBreach({
        elephantCollarId: elephant.collarId,
        nodeId: 'NODE-04'
      });
    }
  };

  const getProtocolBadge = (protocol) => {
    if (protocol === 'Max_Pressure_Chili_Curtain') {
      return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
    if (protocol === 'Acoustic_Bee_Only') {
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
    return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
  };

  return (
    <div className="rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all p-4 shadow-xl flex flex-col justify-between font-mono text-xs">
      <div>
        {/* Header Strip */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
                {elephant.collarId}
              </span>
              <h3 className="font-bold text-slate-100 text-sm">{elephant.name}</h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
              {elephant.classification} · {elephant.age} yrs · {elephant.morphotype}
            </p>
          </div>
          {elephant.calvesPresent && (
            <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
              <Baby className="w-3 h-3 text-emerald-400" />
              <span>{elephant.calfCount} CALVES</span>
            </span>
          )}
        </div>

        {/* Biometrics Split */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <MusthGauge
            value={elephant.testosteroneIndex}
            status={elephant.musthStatus}
            temporalDrainage={elephant.temporalDrainageActive}
          />
          <div className="space-y-2.5 bg-slate-950/70 p-3 rounded-lg border border-slate-800 flex flex-col justify-center">
            {/* Aggression Score Meter */}
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-slate-400">Aggression Index:</span>
                <span className="text-rose-400 font-bold">{elephant.aggressionScore}/10</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-rose-600 h-full rounded-full"
                  style={{ width: `${elephant.aggressionScore * 10}%` }}
                ></div>
              </div>
            </div>

            {/* Habituation Meter */}
            <div>
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-slate-400">Habituation Score:</span>
                <span className="text-amber-400 font-bold">{elephant.habituationIndex}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full"
                  style={{ width: `${elephant.habituationIndex}%` }}
                ></div>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>Historical Breaches:</span>
              <span className="text-slate-300 font-bold">{elephant.breachCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Bio Notes */}
        <p className="text-[11px] font-sans text-slate-400 bg-slate-950/40 p-2 rounded border border-slate-800/80 mb-3 leading-relaxed line-clamp-2">
          {elephant.bioNotes}
        </p>
      </div>

      {/* Footer Controls */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
        <span
          className={`px-2 py-1 rounded text-[10px] font-bold border truncate ${getProtocolBadge(
            elephant.recommendedProtocol
          )}`}
        >
          {elephant.recommendedProtocol?.replace(/_/g, ' ')}
        </span>

        <div className="flex items-center space-x-1.5">
          <Link
            to={`/veterinary/${elephant._id}`}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Inspect Medical Dossier"
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
          </Link>
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="px-2.5 py-1.5 rounded bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold transition flex items-center space-x-1 text-[10px]"
          >
            <Zap className="w-3 h-3" />
            <span>TRIGGER INTRUSION</span>
          </button>
        </div>
      </div>
    </div>
  );
}
