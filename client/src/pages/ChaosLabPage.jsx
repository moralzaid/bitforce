import React from 'react';
import ChaosEngineeringLab from '../components/chaos/ChaosEngineeringLab';
import LiveTerminalTicker from '../components/command/LiveTerminalTicker';
import CameraFeedSimulator from '../components/command/CameraFeedSimulator';
import { Bomb, ShieldCheck, AlertOctagon, HelpCircle } from 'lucide-react';

export default function ChaosLabPage() {
  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center space-x-2">
          <Bomb className="w-5 h-5 text-rose-500" />
          <div>
            <h1 className="text-base font-bold text-slate-100 uppercase tracking-wider">
              "Fails-if-Removed" Chaos Engineering Mode
            </h1>
            <p className="text-[11px] text-slate-400 font-sans">
              Hackathon Evaluation Sandbox: Proving that isolated Single-Silo approaches inevitably lead to ecological or human catastrophe.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-[10px]">
          <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
            ISO-26262 FAULT INJECTION COMPLIANT
          </span>
        </div>
      </div>

      {/* Main Chaos Lab Matrix */}
      <ChaosEngineeringLab />

      {/* Split live view for live validation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5">
          <CameraFeedSimulator />
        </div>
        <div className="lg:col-span-7">
          <LiveTerminalTicker />
        </div>
      </div>
    </div>
  );
}
