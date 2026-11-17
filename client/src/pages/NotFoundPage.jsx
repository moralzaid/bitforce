import React from 'react';
import { Link } from 'react-router-dom';
import { RadioTower, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-mono">
      <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-400">
        <RadioTower className="w-8 h-8 animate-pulse" />
      </div>
      <div className="text-rose-400 text-xs font-bold tracking-widest uppercase mb-1">
        TELEMETRY LOSS · ERROR 404
      </div>
      <h1 className="text-2xl font-extrabold text-slate-100 mb-2">SIGNAL DROPPED OUT OF BOUNDS</h1>
      <p className="text-slate-400 text-xs max-w-md mb-6 font-sans">
        The requested tactical coordinate or telemetry packet does not exist on the TRIDENT mesh router.
      </p>
      <Link
        to="/"
        className="flex items-center space-x-2 px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>RETURN TO COMMAND CENTER</span>
      </Link>
    </div>
  );
}
