import React, { useState } from 'react';
import {
  Compass,
  Radio,
  Layers,
  MapPin,
  BatteryCharging,
  Wifi,
  Volume2,
  Flame,
  Info
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export default function TacticalPerimeterMap({ selectedNodeId, onSelectNode }) {
  const { activeStages, chaosMode, isSimulating } = useSimulation();
  const [activeTab, setActiveTab] = useState('ALL');
  const [hoveredNode, setHoveredNode] = useState(null);

  const activeSectorNodeId = activeStages?.stage2_engineering?.nodeId || 'NODE-04';

  // 12 Nodes layout coordinates on 800x480 SVG map canvas
  const mapNodes = [
    { id: 'NODE-01', name: 'Habarana Gate', x: 80, y: 340, battery: 96, lora: -64, status: 'Nominal' },
    { id: 'NODE-02', name: 'Minneriya Corridor', x: 130, y: 310, battery: 92, lora: -68, status: 'Nominal' },
    { id: 'NODE-03', name: 'Hurulu Link', x: 200, y: 280, battery: 88, lora: -70, status: 'Nominal' },
    { id: 'NODE-04', name: 'North Paddy Buffer', x: 270, y: 240, battery: 98, lora: -62, status: 'Active Breach' },
    { id: 'NODE-05', name: 'Paluwewa Perimeter', x: 340, y: 220, battery: 90, lora: -66, status: 'Nominal' },
    { id: 'NODE-06', name: 'Sigiriya Scrubland', x: 410, y: 200, battery: 84, lora: -72, status: 'Nominal' },
    { id: 'NODE-07', name: 'Kandalama Flank', x: 480, y: 170, battery: 94, lora: -65, status: 'Nominal' },
    { id: 'NODE-08', name: 'Gal Oya Riparian', x: 540, y: 190, battery: 91, lora: -67, status: 'Nominal' },
    { id: 'NODE-09', name: 'Dambulla Outskirts', x: 600, y: 220, battery: 86, lora: -74, status: 'Nominal' },
    { id: 'NODE-10', name: 'Railway Crossing', x: 660, y: 250, battery: 93, lora: -63, status: 'Nominal' },
    { id: 'NODE-11', name: 'Mahaweli Canal Line', x: 710, y: 300, battery: 89, lora: -69, status: 'Nominal' },
    { id: 'NODE-12', name: 'Mahaweli East Border', x: 750, y: 360, battery: 95, lora: -61, status: 'Nominal' }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col font-mono text-xs">
      {/* Map Header */}
      <div className="bg-slate-950/80 px-3 py-2 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-slate-200">TACTICAL PERIMETER MAP</span>
          <span className="text-[10px] text-slate-500">12 Solar LoRa Mesh Nodes · 24km Perimeter</span>
        </div>
        <div className="flex items-center space-x-3 text-[10px]">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span className="text-slate-400">Nominal Node</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-rose-400 font-bold">Active Breach Target</span>
          </span>
        </div>
      </div>

      {/* Interactive Tactical SVG Map Viewport */}
      <div className="relative w-full aspect-[16/9] bg-[#070B14] overflow-hidden select-none">
        {/* CHAOS STATE: NODES GRAYED OUT & GRID SCRAMBLED */}
        {chaosMode.engineeringDisabled && (
          <div className="absolute inset-0 bg-slate-950/80 z-20 flex flex-col items-center justify-center p-4 text-center">
            <div className="text-rose-400 font-bold text-sm tracking-wider uppercase mb-1">
              PERIMETER MESH DISCONNECTED
            </div>
            <p className="text-[11px] text-slate-400 max-w-sm">
              Engineering Module severed in Chaos Mode. Mesh telemetry dropped; node coordinate tracking offline.
            </p>
          </div>
        )}

        <svg viewBox="0 0 820 440" className="w-full h-full">
          <defs>
            {/* Grid Pattern */}
            <pattern id="tactical-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#161F30" strokeWidth="0.8" />
              <circle cx="40" cy="40" r="1" fill="#1E293B" />
            </pattern>
            {/* Radar Pulse Gradient */}
            <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="820" height="440" fill="url(#tactical-grid)" />

          {/* Forest Reserve Area (Top/West) */}
          <path
            d="M 0 0 L 820 0 L 820 220 Q 500 130 270 240 L 80 340 L 0 350 Z"
            fill="#061A14"
            opacity="0.65"
          />
          <text x="50" y="50" fill="#10B981" opacity="0.4" fontSize="13" fontWeight="bold">
            WILDLIFE SANCTUARY & NATIONAL PARK CORRIDOR
          </text>

          {/* Village & Paddy Agricultural Area (Bottom/East) */}
          <path
            d="M 0 350 L 80 340 Q 270 240 500 130 L 820 220 L 820 440 L 0 440 Z"
            fill="#111B28"
            opacity="0.65"
          />
          <text x="520" y="410" fill="#06B6D4" opacity="0.4" fontSize="13" fontWeight="bold">
            VILLAGE SETTLEMENTS & HIGH-YIELD PADDY FIELDS
          </text>

          {/* Border Fence Line Polyline */}
          <polyline
            points="80,340 130,310 200,280 270,240 340,220 410,200 480,170 540,190 600,220 660,250 710,300 750,360"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="2.5"
            strokeDasharray="6,4"
            opacity={chaosMode.engineeringDisabled ? '0.2' : '0.8'}
          />

          {/* Bio-Buffer Zone Shading Ribbon */}
          <polyline
            points="80,340 130,310 200,280 270,240 340,220 410,200 480,170 540,190 600,220 660,250 710,300 750,360"
            fill="none"
            stroke="#10B981"
            strokeWidth="18"
            opacity="0.12"
          />

          {/* Sector Nodes */}
          {mapNodes.map((node) => {
            const isBreachNode = node.id === activeSectorNodeId;
            const isSelected = selectedNodeId === node.id;
            const isGrayed = chaosMode.engineeringDisabled;

            return (
              <g
                key={node.id}
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => onSelectNode && onSelectNode(node)}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Radar Ripple Animation on Active Breach Node */}
                {isBreachNode && !isGrayed && (
                  <>
                    <circle cx={node.x} cy={node.y} r="28" fill="url(#radar-glow)" className="animate-ping" opacity="0.4" />
                    <circle cx={node.x} cy={node.y} r="18" fill="none" stroke="#EF4444" strokeWidth="1.5" className="animate-pulse" />
                  </>
                )}

                {/* Node Outer Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="9"
                  fill={isGrayed ? '#334155' : isBreachNode ? '#DC2626' : isSelected ? '#3B82F6' : '#0B1524'}
                  stroke={isGrayed ? '#475569' : isBreachNode ? '#EF4444' : '#06B6D4'}
                  strokeWidth="2"
                  className={isBreachNode ? 'glow-alert' : 'glow-eng'}
                />

                {/* Node Core Indicator */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="3.5"
                  fill={isGrayed ? '#64748B' : isBreachNode ? '#FFFFFF' : '#38BDF8'}
                />

                {/* Node ID Label */}
                <text
                  x={node.x}
                  y={node.y - 14}
                  fill={isGrayed ? '#64748B' : isBreachNode ? '#F87171' : '#94A3B8'}
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered Node Tooltip Card */}
        {hoveredNode && (
          <div
            className="absolute z-30 p-2.5 rounded-lg bg-slate-900/95 border border-cyan-500/40 shadow-2xl backdrop-blur-md pointer-events-none text-[10px]"
            style={{
              left: Math.min(hoveredNode.x + 15, 620),
              top: Math.max(hoveredNode.y - 65, 20)
            }}
          >
            <div className="font-bold text-cyan-300 text-xs flex items-center justify-between mb-1">
              <span>{hoveredNode.id}: {hoveredNode.name}</span>
              <span className="text-emerald-400 font-normal">{hoveredNode.status}</span>
            </div>
            <div className="space-y-0.5 text-slate-300 font-mono">
              <div className="flex justify-between space-x-3">
                <span className="text-slate-500">Solar Battery:</span>
                <span className="text-emerald-400 font-bold">{hoveredNode.battery}%</span>
              </div>
              <div className="flex justify-between space-x-3">
                <span className="text-slate-500">LoRa RSSI:</span>
                <span className="text-cyan-400">{hoveredNode.lora} dBm</span>
              </div>
              <div className="flex justify-between space-x-3">
                <span className="text-slate-500">Valves:</span>
                <span className="text-slate-200">SOL-04A, SOL-04B (145 PSI)</span>
              </div>
            </div>
          </div>
        )}

        {/* Map Watermark & Scale bar */}
        <div className="absolute bottom-3 left-3 bg-slate-950/80 px-2 py-1 rounded border border-slate-800 text-[10px] text-slate-400 space-y-0.5">
          <div>CORRIDOR: HABARANA - DAMBULLA LINK</div>
          <div>SCALE: 1:25,000 · 24 KM FOREST INTERFACE</div>
        </div>

        {/* Compass Rose */}
        <div className="absolute top-3 right-3 bg-slate-950/80 w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-300 text-[10px] font-bold">
          <div className="flex flex-col items-center">
            <span className="text-rose-400 text-[9px] -mb-1">▲</span>
            <span>N</span>
          </div>
        </div>
      </div>

      {/* Map Footer Telemetry Strip */}
      <div className="bg-slate-950/90 p-2 px-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center space-x-3">
          <span className="text-slate-500">ACTIVE TARGET:</span>
          <span className="text-rose-400 font-bold">{activeSectorNodeId}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-500">MAPPING ACCURACY:</span>
          <span className="text-cyan-400 font-bold">±0.4m RTK GPS</span>
        </span>
        <span className="text-slate-500 hidden sm:inline">CLICK ANY NODE TO INSPECT TELEMETRY</span>
      </div>
    </div>
  );
}
