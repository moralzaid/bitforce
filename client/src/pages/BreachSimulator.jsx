import React, { useState, useEffect } from 'react';
import {
  Zap,
  Sliders,
  Wind,
  Layers,
  Flame,
  Baby,
  Upload,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { veterinaryAPI, simulationAPI } from '../services/api';
import PipelineVisualizer from '../components/command/PipelineVisualizer';
import CameraFeedSimulator from '../components/command/CameraFeedSimulator';

export default function BreachSimulator() {
  const { triggerBreach, isSimulating, activeBreach, resetSystem } = useSimulation();

  const [elephants, setElephants] = useState([]);
  const [selectedCollarId, setSelectedCollarId] = useState('EL-001');
  const [selectedNodeId, setSelectedNodeId] = useState('NODE-04');
  const [subjectType, setSubjectType] = useState('Elephant');
  const [windSpeed, setWindSpeed] = useState(14);
  const [windDirection, setWindDirection] = useState(180); // 180° = South (towards forest)
  const [customImage, setCustomImage] = useState(null);

  useEffect(() => {
    const fetchElephants = async () => {
      try {
        const res = await veterinaryAPI.getElephants({});
        if (res.data?.success) {
          setElephants(res.data.data);
        }
      } catch (err) {
        console.warn('Using offline elephant defaults');
      }
    };
    fetchElephants();
  }, []);

  // Preset Scenario Handlers
  const handlePresetSelect = (presetKey) => {
    if (presetKey === 'musth_bull') {
      setSelectedCollarId('EL-001');
      setSubjectType('Elephant');
      setSelectedNodeId('NODE-04');
      setWindSpeed(12);
      setWindDirection(180);
    } else if (presetKey === 'matriarch_calves') {
      setSelectedCollarId('EL-002');
      setSubjectType('Elephant');
      setSelectedNodeId('NODE-02');
      setWindSpeed(10);
      setWindDirection(175);
    } else if (presetKey === 'habituated_raider') {
      setSelectedCollarId('EL-003');
      setSubjectType('Elephant');
      setSelectedNodeId('NODE-05');
      setWindSpeed(16);
      setWindDirection(190);
    } else if (presetKey === 'non_target_boar') {
      setSelectedCollarId('N/A');
      setSubjectType('Wild Boar');
      setSelectedNodeId('NODE-07');
    }
  };

  const handleExecuteSimulation = async () => {
    await triggerBreach({
      nodeId: selectedNodeId,
      elephantCollarId: subjectType === 'Elephant' ? selectedCollarId : null,
      customSubject: subjectType !== 'Elephant' ? { type: subjectType, aiConfidence: 91.5 } : null,
      environmentalOverrides: {
        windSpeedKmh: windSpeed,
        windDirectionDeg: windDirection
      }
    });
  };

  return (
    <div className="space-y-5 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <h1 className="text-base font-bold text-slate-100 uppercase tracking-wider">
              Interactive Breach Simulator & Sandbox
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Judge Evaluation Studio
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">
            Configure simulated encounters and observe how TRIDENT's cross-disciplinary state machine deterministically arbitrates between non-lethal acoustic bees, high-pressure chili mist, or safe standby.
          </p>
        </div>

        <button
          onClick={resetSystem}
          className="self-start md:self-auto flex items-center space-x-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>RESET HARDWARE</span>
        </button>
      </div>

      {/* Preset Realistic Scenarios Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => handlePresetSelect('musth_bull')}
          className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 transition text-left space-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-rose-400 text-xs flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Bull in Active Musth</span>
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              TIER 3 MIST
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            Raja (Bull #04) with peak testosterone (96/100) charging perimeter fence.
          </p>
        </button>

        <button
          onClick={() => handlePresetSelect('matriarch_calves')}
          className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition text-left space-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-400 text-xs flex items-center space-x-1">
              <Baby className="w-3.5 h-3.5" />
              <span>Matriarch with Calves</span>
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              TIER 1 BEES
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            Kumari & 3 dependent nursing calves. Bio-ethical override: 0 PSI chili spray.
          </p>
        </button>

        <button
          onClick={() => handlePresetSelect('habituated_raider')}
          className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition text-left space-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-400 text-xs flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Habituated Crop-Raider</span>
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              TIER 2 DUAL
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            Gaja with 78% habituation index. Requires frequency modulation + micro-pulse.
          </p>
        </button>

        <button
          onClick={() => handlePresetSelect('non_target_boar')}
          className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 transition text-left space-y-1 group"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-purple-400 text-xs flex items-center space-x-1">
              <span>🐗</span>
              <span>Non-Target Wildlife</span>
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              STANDBY LOG
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            Wild Boar / Cattle trip beam. AI filters subject: zero deterrent wasted.
          </p>
        </button>
      </div>

      {/* Simulator Parameters Configuration Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Parameter Form (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h2 className="font-bold text-slate-200 uppercase">Configuration Parameters</h2>
          </div>

          {/* Subject Type Switcher */}
          <div>
            <label className="text-slate-400 block mb-1.5">1. Target Classification</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSubjectType('Elephant')}
                className={`py-1.5 px-3 rounded text-center transition font-bold border ${
                  subjectType === 'Elephant'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                Elephant (Collared / Target)
              </button>
              <button
                type="button"
                onClick={() => setSubjectType('Wild Boar')}
                className={`py-1.5 px-3 rounded text-center transition font-bold border ${
                  subjectType !== 'Elephant'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                Non-Target (Boar / Cattle)
              </button>
            </div>
          </div>

          {/* Elephant Profile Dropdown (if Elephant) */}
          {subjectType === 'Elephant' && (
            <div>
              <label className="text-slate-400 block mb-1.5">2. Veterinary Registry Subject</label>
              <select
                value={selectedCollarId}
                onChange={(e) => setSelectedCollarId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="EL-001">EL-001: Raja (Apex Bull, Active Musth, Aggression 9.4)</option>
                <option value="EL-002">EL-002: Kumari Matriarch & Herd (3 Calves, Aggression 2.4)</option>
                <option value="EL-003">EL-003: Gaja (Habituated Raider, Habituation 78%)</option>
                <option value="EL-004">EL-004: Bhumi (Calm Matriarch, 2 Calves)</option>
                <option value="EL-005">EL-005: Chandi (Young Aggressive Bull, Musth Active)</option>
                <option value="EL-006">EL-006: Hurulu Bachelor Band (4 Males)</option>
                <option value="EL-013">EL-013: Maha Sen (Raging Tusker, Peak Aggression 9.6)</option>
              </select>
            </div>
          )}

          {/* Sector Node Dropdown */}
          <div>
            <label className="text-slate-400 block mb-1.5">3. Perimeter Sector Node</label>
            <select
              value={selectedNodeId}
              onChange={(e) => setSelectedNodeId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="NODE-01">NODE-01: Sector 01 - Habarana Sanctuary Gate</option>
              <option value="NODE-02">NODE-02: Sector 02 - Minneriya Forest Transit Corridor</option>
              <option value="NODE-03">NODE-03: Sector 03 - Hurulu Eco-Buffer Link</option>
              <option value="NODE-04">NODE-04: Sector 04 - North Paddy Buffer (High Activity)</option>
              <option value="NODE-05">NODE-05: Sector 05 - Paluwewa Settlement Perimeter</option>
              <option value="NODE-06">NODE-06: Sector 06 - Sigiriya Western Boundary</option>
              <option value="NODE-07">NODE-07: Sector 07 - Kandalama Water Flank</option>
              <option value="NODE-12">NODE-12: Sector 12 - Mahaweli East Paddy Border</option>
            </select>
          </div>

          {/* Environmental Sliders: Wind Speed & Direction */}
          <div className="space-y-3 bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">Wind Velocity:</span>
                <span className="text-cyan-400 font-bold">{windSpeed} km/h</span>
              </div>
              <input
                type="range"
                min="0"
                max="45"
                value={windSpeed}
                onChange={(e) => setWindSpeed(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 km/h (Calm)</span>
                <span>25 km/h (Safety Threshold)</span>
                <span>45 km/h (Gale)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">Wind Direction:</span>
                <span className="text-blue-400 font-bold">
                  {windDirection}° {windDirection >= 135 && windDirection <= 225 ? '(South / Forest Drift)' : '(Blowback Risk!)'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={windDirection}
                onChange={(e) => setWindDirection(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {windSpeed > 25 && (windDirection < 90 || windDirection > 270) && (
              <div className="p-2 rounded bg-rose-950/60 border border-rose-500/40 text-[10px] text-rose-300 flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>BLOWBACK LOCKOUT ACTIVE: Wind will spray chili towards houses. Valve will lock safely.</span>
              </div>
            )}
          </div>

          {/* Big Execution Trigger Button */}
          <button
            onClick={handleExecuteSimulation}
            disabled={isSimulating}
            className={`w-full py-3 rounded-lg font-bold text-sm tracking-wider uppercase transition shadow-2xl flex items-center justify-center space-x-2 ${
              isSimulating
                ? 'bg-amber-600 text-slate-100 animate-pulse'
                : 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-rose-900/40 border border-rose-500/50'
            }`}
          >
            <Zap className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'EXECUTING PIPELINE HANDSHAKE...' : 'EXECUTE BREACH SIMULATION'}</span>
          </button>
        </div>

        {/* Right Column: Live Execution Output & Pipeline Visualizer (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <PipelineVisualizer />
          <CameraFeedSimulator />
        </div>
      </div>
    </div>
  );
}
