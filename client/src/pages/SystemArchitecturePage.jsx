import React from 'react';
import {
  FileCode2,
  Cpu,
  HeartPulse,
  Sprout,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Layers,
  Terminal
} from 'lucide-react';

export default function SystemArchitecturePage() {
  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-800 gap-3">
        <div className="flex items-center space-x-2">
          <FileCode2 className="w-5 h-5 text-cyan-400" />
          <div>
            <h1 className="text-base font-bold text-slate-100 uppercase tracking-wider">
              TRIDENT System Architecture & Pitch Deck View
            </h1>
            <p className="text-[11px] text-slate-400 font-sans">
              Tri-Disciplinary Automated Bio-Fence Network for Human-Elephant Conflict (HEC) Mitigation — Technical Blueprint for Hackathon Evaluators.
            </p>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
          HACKATHON EVALUATOR THESIS
        </span>
      </div>

      {/* The Core Thesis Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-cyan-500/30 shadow-2xl space-y-3">
        <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>THE TRIDENT PARADIGM: WHY SINGLE-DISCIPLINE APPROACHES FAIL</span>
        </div>
        <p className="text-slate-300 text-xs font-sans leading-relaxed">
          Traditional human-elephant conflict solutions operate in isolated silos: electric fences (lethal or broken by intelligent tuskers), firecrackers (terrifying herds into stampedes), or manual watchtower patrols (resulting in human casualties). <strong className="text-cyan-300">TRIDENT solves this by orchestrating an unbroken, automated feedback loop between Computer Vision Engineering, Veterinary Behavioral Science, and Agricultural Bio-Deterrence.</strong>
        </p>
      </div>

      {/* 3 Pillars Technical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Pillar 1: Engineering */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                PILLAR 01
              </span>
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="text-sm font-bold text-cyan-200">The Brain & Eyes (Engineering)</h2>
            <p className="text-slate-400 font-sans text-[11px] mt-1 leading-relaxed">
              Provides the trigger and spatial context with zero dependence on commercial grid power or cloud latency.
            </p>
          </div>
          <div className="space-y-1.5 bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-[11px]">
            <div className="text-slate-300 font-bold">Key Specifications:</div>
            <div className="text-slate-400">· YOLOv8 Edge NPU (~34ms inference)</div>
            <div className="text-slate-400">· Dual Optical + FLIR Thermal IR</div>
            <div className="text-slate-400">· LoRaWAN 915 MHz Mesh Mesh-ID #882</div>
            <div className="text-slate-400">· Solar Photovoltaic Battery Subsystem</div>
          </div>
        </div>

        {/* Pillar 2: Veterinary */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                PILLAR 02
              </span>
              <HeartPulse className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-sm font-bold text-amber-200">The Biological Intelligence (Veterinary)</h2>
            <p className="text-slate-400 font-sans text-[11px] mt-1 leading-relaxed">
              Calculates the exact behavioral threat level and ethical restrictions so deterrence is never indiscriminate.
            </p>
          </div>
          <div className="space-y-1.5 bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-[11px]">
            <div className="text-slate-300 font-bold">Key Specifications:</div>
            <div className="text-slate-400">· Serum Testosterone / Musth Tracker</div>
            <div className="text-slate-400">· Habituation Index (Prevents Adaptation)</div>
            <div className="text-slate-400">· Maternal Calf Safety Overrides</div>
            <div className="text-slate-400">· Individual Aggression Profiling</div>
          </div>
        </div>

        {/* Pillar 3: Agriculture */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                PILLAR 03
              </span>
              <Sprout className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-sm font-bold text-emerald-200">The Physical Deterrent (Agriculture)</h2>
            <p className="text-slate-400 font-sans text-[11px] mt-1 leading-relaxed">
              Executes graduated, adaptive, non-lethal physical responses based on biological threat matrix intelligence.
            </p>
          </div>
          <div className="space-y-1.5 bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-[11px]">
            <div className="text-slate-300 font-bold">Key Specifications:</div>
            <div className="text-slate-400">· 145 PSI Solenoid Oleoresin Manifolds</div>
            <div className="text-slate-400">· 250-550 Hz Bio-Acoustic Bee Banks</div>
            <div className="text-slate-400">· Meteorological Wind Drift Safety Lock</div>
            <div className="text-slate-400">· Citronella / Palmyra Agro Bio-Fence</div>
          </div>
        </div>
      </div>

      {/* Architectural Data Flow Diagram (SVG) */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <h2 className="text-sm font-bold text-slate-200 uppercase">
          Zero-Cloud Resilient Execution Pipeline (Sub-250ms Turnaround)
        </h2>
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] text-center space-x-2">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 w-44">
              <div className="text-slate-400 text-[10px]">STAGE 1</div>
              <div className="font-bold text-slate-200 text-xs">Perimeter Intrusion</div>
              <div className="text-slate-500 text-[10px]">Optical / Thermal Beam</div>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/40 w-44">
              <div className="text-cyan-400 text-[10px]">STAGE 2</div>
              <div className="font-bold text-cyan-300 text-xs">AI Edge YOLOv8</div>
              <div className="text-slate-400 text-[10px]">Class & Collar RFID</div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 w-44">
              <div className="text-amber-400 text-[10px]">STAGE 3</div>
              <div className="font-bold text-amber-300 text-xs">Veterinary Matrix</div>
              <div className="text-slate-400 text-[10px]">Musth & Calf Check</div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 w-44">
              <div className="text-emerald-400 text-[10px]">STAGE 4</div>
              <div className="font-bold text-emerald-300 text-xs">Adaptive Deterrent</div>
              <div className="text-slate-400 text-[10px]">145 PSI Mist or 380Hz Bees</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
