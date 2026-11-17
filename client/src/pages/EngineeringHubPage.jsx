import React, { useState, useEffect } from 'react';
import { Cpu, BatteryCharging, Wifi, Activity, Sliders, RefreshCw, Layers } from 'lucide-react';
import NodeCard from '../components/engineering/NodeCard';
import CameraFeedSimulator from '../components/command/CameraFeedSimulator';
import { engineeringAPI } from '../services/api';

export default function EngineeringHubPage() {
  const [nodes, setNodes] = useState([]);
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [loading, setLoading] = useState(false);

  const fetchNodes = async () => {
    setLoading(true);
    try {
      const res = await engineeringAPI.getNodes();
      if (res.data?.success) {
        setNodes(res.data.data);
      }
    } catch (err) {
      console.warn('Using local fallback nodes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  const avgBattery = nodes.length
    ? Math.round(nodes.reduce((acc, n) => acc + n.solarBatteryLevel, 0) / nodes.length)
    : 92;

  const avgLatency = nodes.length
    ? Math.round(nodes.reduce((acc, n) => acc + n.latencyMs, 0) / nodes.length)
    : 42;

  return (
    <div className="space-y-5 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <div>
            <h1 className="text-base font-bold text-slate-100 uppercase tracking-wider">
              Engineering Hub: AI Camera Mesh & Edge Hardware
            </h1>
            <p className="text-[11px] text-slate-400 font-sans">
              Solar battery status, LoRaWAN mesh latency, Edge NPU inference models, and remote solenoid valve actuator controls.
            </p>
          </div>
        </div>
        <button
          onClick={fetchNodes}
          className="flex items-center space-x-1 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          <span>POLL MESH</span>
        </button>
      </div>

      {/* Engineering KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">SOLAR BATTERY AVG</div>
          <div className="text-lg font-extrabold text-emerald-400 mt-0.5">{avgBattery}%</div>
          <div className="text-[10px] text-slate-400">Photovoltaic Float Mode</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">MESH LATENCY AVG</div>
          <div className="text-lg font-extrabold text-cyan-400 mt-0.5">{avgLatency}ms</div>
          <div className="text-[10px] text-slate-400">915 MHz LoRaWAN</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">ACTIVE EDGE NODES</div>
          <div className="text-lg font-extrabold text-cyan-400 mt-0.5">{nodes.length || 12} / 12</div>
          <div className="text-[10px] text-slate-400">100% Optical-IR Uptime</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">AI CONFIDENCE LIMIT</div>
          <div className="text-lg font-extrabold text-amber-400 mt-0.5">{confidenceThreshold}%</div>
          <div className="text-[10px] text-slate-400">YOLOv8 Cutoff Gate</div>
        </div>
      </div>

      {/* Camera HUD & Edge Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <CameraFeedSimulator />
        </div>
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-slate-200">AI Edge Vision Model Controls</h3>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-400">YOLOv8 Detection Threshold:</span>
              <span className="text-cyan-400 font-bold">{confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="95"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>60% (High Recall)</span>
              <span>85% (Balanced)</span>
              <span>95% (High Precision)</span>
            </div>
          </div>

          <div className="p-3 rounded bg-slate-950/70 border border-slate-800 space-y-2 text-[11px]">
            <div className="font-bold text-slate-300">NPU Firmware & Model Telemetry:</div>
            <div className="flex justify-between text-slate-400">
              <span>Model Architecture:</span>
              <span className="text-slate-200 font-mono">YOLOv8m-Elephant-Custom</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Edge Hardware Accelerator:</span>
              <span className="text-slate-200 font-mono">Hailo-8 / Coral Edge TPU</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Inference Time per Frame:</span>
              <span className="text-emerald-400 font-bold">34ms (29.4 FPS)</span>
            </div>
          </div>
        </div>
      </div>

      {/* All 12 Node Cards */}
      <div>
        <h2 className="text-sm font-bold text-slate-200 mb-3">All Perimeter Sector Nodes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {nodes.map((node) => (
            <NodeCard key={node.nodeId} node={node} onDiagnosed={fetchNodes} />
          ))}
        </div>
      </div>
    </div>
  );
}
