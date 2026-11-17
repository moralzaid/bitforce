import React, { useState } from 'react';
import {
  Camera,
  Eye,
  Flame,
  Maximize2,
  Scan,
  Sparkles,
  Upload,
  AlertOctagon,
  RefreshCw
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { simulationAPI } from '../../services/api';

export default function CameraFeedSimulator() {
  const { activeStages, chaosMode, isSimulating } = useSimulation();
  const [visionMode, setVisionMode] = useState('thermal'); // 'thermal' | 'optical'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [uploadedPreview, setUploadedPreview] = useState(null);

  const engStage = activeStages?.stage2_engineering;
  const isBlind = chaosMode.engineeringDisabled;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await simulationAPI.uploadTestImage(formData);
      if (res.data?.success) {
        console.log('[AI INFERENCE UPLOAD]', res.data.data);
      }
    } catch (err) {
      console.warn('[IMAGE UPLOAD NOTE] Running edge simulation locally on uploaded file');
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col font-mono text-xs">
      {/* HUD Header */}
      <div className="bg-slate-950/80 px-3 py-2 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-slate-200">SECTOR 04 · AI VISION HUD</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            YOLOv8 Edge NPU
          </span>
        </div>

        {/* Vision Mode & Upload Controls */}
        <div className="flex items-center space-x-2 text-[11px]">
          <button
            onClick={() => setVisionMode('thermal')}
            className={`px-2 py-0.5 rounded border transition flex items-center space-x-1 ${
              visionMode === 'thermal'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Flame className="w-3 h-3 text-amber-400" />
            <span>THERMAL</span>
          </button>
          <button
            onClick={() => setVisionMode('optical')}
            className={`px-2 py-0.5 rounded border transition flex items-center space-x-1 ${
              visionMode === 'optical'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Eye className="w-3 h-3 text-cyan-400" />
            <span>OPTICAL IR</span>
          </button>
          <label className="cursor-pointer px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center space-x-1">
            <Upload className="w-3 h-3 text-purple-400" />
            <span className="hidden sm:inline">TEST IMAGE</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
      </div>

      {/* Camera Viewport Screen */}
      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800">
        {/* CHAOS STATE: STATIC NOISE WHEN ENGINEERING IS SEVERED */}
        {isBlind ? (
          <div className="absolute inset-0 bg-[#0A0D14] flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="w-full h-full absolute inset-0 opacity-20 bg-[radial-gradient(#EF4444_1px,transparent_1px)] [background-size:16px_16px] animate-pulse"></div>
            <AlertOctagon className="w-12 h-12 text-rose-500 animate-bounce mb-3" />
            <h3 className="text-base font-bold text-rose-400 font-mono tracking-widest uppercase">
              CATASTROPHIC FAILURE: SYSTEM BLIND
            </h3>
            <p className="text-xs text-rose-300/80 max-w-sm mt-1 font-mono">
              Engineering AI camera mesh disconnected by Chaos test. Optical and thermal streams severed. Target acquisition failed.
            </p>
          </div>
        ) : (
          <>
            {/* Background Simulated Feed */}
            <div
              className={`absolute inset-0 transition duration-500 flex items-center justify-center ${
                visionMode === 'thermal'
                  ? 'bg-gradient-to-br from-[#120824] via-[#3B0764] to-[#701A75]'
                  : 'bg-gradient-to-br from-[#02131F] via-[#082F49] to-[#0F172A]'
              }`}
            >
              {/* Elephant Silhouette SVG Graphic */}
              {uploadedPreview ? (
                <img
                  src={uploadedPreview}
                  alt="Custom Subject"
                  className="w-full h-full object-cover opacity-85 filter contrast-125"
                />
              ) : (
                <div className="relative w-72 h-64 flex items-center justify-center">
                  {/* Stylized Elephant Vector Silhouette */}
                  <svg
                    viewBox="0 0 500 400"
                    className={`w-64 h-64 filter drop-shadow-2xl transition duration-500 ${
                      visionMode === 'thermal'
                        ? 'fill-amber-400 drop-shadow-[0_0_25px_rgba(245,158,11,0.8)]'
                        : 'fill-cyan-300 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                    }`}
                  >
                    <path d="M 120 280 C 120 230 150 180 200 160 C 230 110 320 100 370 140 C 410 150 440 180 430 220 C 420 260 380 280 370 300 C 370 340 350 360 330 360 C 310 360 310 320 290 320 C 270 320 270 360 250 360 C 230 360 220 330 200 330 C 180 330 180 360 160 360 C 140 360 120 320 120 280 Z" />
                    <circle cx="390" cy="180" r="8" className="fill-slate-950" />
                    {/* Tusks */}
                    <path d="M 410 230 Q 460 280 470 250 Q 440 230 420 220 Z" className="fill-white" />
                  </svg>
                </div>
              )}
            </div>

            {/* CRT Scanline Overlay */}
            <div className="scanlines absolute inset-0 z-10 pointer-events-none"></div>

            {/* Camera Reticle & Crosshairs */}
            <div className="absolute inset-0 z-20 pointer-events-none border border-cyan-500/20 m-3 rounded flex flex-col justify-between p-3">
              {/* Reticle Top Info */}
              <div className="flex justify-between items-start text-[10px] text-cyan-300">
                <div className="space-y-0.5 bg-slate-950/80 px-2 py-1 rounded border border-cyan-500/20">
                  <div>LAT: 6.8219° N · LON: 80.9982° E</div>
                  <div>ALT: 182m · CAM: FLIR_NPU_4K</div>
                  <div>FPS: 32.4 · SOLAR BATT: 94%</div>
                </div>
                <div className="text-right space-y-0.5 bg-slate-950/80 px-2 py-1 rounded border border-cyan-500/20">
                  <div className="text-emerald-400 font-bold flex items-center justify-end space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>LIVE STREAM</span>
                  </div>
                  <div>ZOOM: {zoomLevel}x</div>
                  <div>RANGE: 24.6 METERS</div>
                </div>
              </div>

              {/* Dynamic YOLOv8 Bounding Box Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-56 border-2 border-dashed border-cyan-400/90 rounded bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                {/* BBox Label Tag */}
                <div className="absolute -top-6 left-0 bg-cyan-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px] flex items-center space-x-1">
                  <Scan className="w-3 h-3" />
                  <span>Elephas maximus · {engStage?.aiConfidence || 98.4}%</span>
                </div>
                {/* Temporal Drain Tag */}
                <div className="absolute -bottom-6 right-0 bg-rose-600 text-white font-bold px-2 py-0.5 rounded text-[9px] flex items-center space-x-1">
                  <Flame className="w-2.5 h-2.5" />
                  <span>TEMPORAL SECRETION: POSITIVE</span>
                </div>
                {/* Reticle Corner Marks */}
                <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white"></span>
                <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white"></span>
                <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white"></span>
                <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white"></span>
              </div>

              {/* Reticle Bottom Info */}
              <div className="flex justify-between items-end text-[10px] text-cyan-300">
                <div className="bg-slate-950/80 px-2 py-1 rounded border border-cyan-500/20">
                  OPTICAL LOCK: ACTIVE [TARGET: RAJA #04]
                </div>
                <div className="bg-slate-950/80 px-2 py-1 rounded border border-cyan-500/20 text-amber-400">
                  TEMP DELTA: +5.4°C (WARM BIOMASS)
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Camera Footer Telemetry */}
      <div className="bg-slate-950/90 p-2.5 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center space-x-2">
          <span className="text-slate-500">EDGE AI:</span>
          <span className="text-cyan-400 font-bold">YOLOv8-Trident-Custom</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-500">INFERENCE:</span>
          <span className="text-emerald-400 font-bold">38ms</span>
        </span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setZoomLevel(zoomLevel === 1 ? 2 : 1)}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[10px]"
          >
            {zoomLevel === 1 ? 'ZOOM 2X' : 'RESET ZOOM'}
          </button>
        </div>
      </div>
    </div>
  );
}
