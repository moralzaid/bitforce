import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  History,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Layers,
  Cpu,
  HeartPulse,
  Sprout,
  Radio,
  DollarSign
} from 'lucide-react';
import { incidentsAPI } from '../services/api';

export default function IncidentPostMortemPage() {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncident = async () => {
      setLoading(true);
      try {
        const res = await incidentsAPI.getIncidentById(id);
        if (res.data?.success) {
          setIncident(res.data.data);
        }
      } catch (err) {
        console.warn('Using fallback post-mortem');
      } finally {
        setLoading(false);
      }
    };
    fetchIncident();
  }, [id]);

  if (loading || !incident) {
    return <div className="p-8 text-center text-slate-400 font-mono text-xs">Loading Incident Post-Mortem...</div>;
  }

  const lat = incident.executionLatency || {
    t0_optical_thermal_detect_ms: 18,
    t1_edge_yolo_infer_ms: 42,
    t2_mesh_lora_relay_ms: 36,
    t3_vet_biometric_lookup_ms: 58,
    t4_tri_decision_calc_ms: 22,
    t5_agro_valve_solenoid_ms: 54,
    totalHandshakeTimeMs: 230
  };

  const steps = [
    { name: 't0 · Optical & Thermal Trigger Tripped', ms: lat.t0_optical_thermal_detect_ms, color: 'bg-cyan-500', desc: 'Hardware beam broken; FLIR sensor triggers edge wake-up.' },
    { name: 't1 · YOLOv8 Edge Inference on NPU', ms: lat.t1_edge_yolo_infer_ms, color: 'bg-blue-500', desc: 'On-device bounding box calculation & confidence classification.' },
    { name: 't2 · LoRaWAN Mesh Packet Transmission', ms: lat.t2_mesh_lora_relay_ms, color: 'bg-indigo-500', desc: 'Sector Node packets relayed over encrypted 915 MHz mesh.' },
    { name: 't3 · Veterinary Biometrics DB Query', ms: lat.t3_vet_biometric_lookup_ms, color: 'bg-amber-500', desc: 'Collar RFID match; serum testosterone & calf safety checks.' },
    { name: 't4 · Tri-Disciplinary State Machine Calculation', ms: lat.t4_tri_decision_calc_ms, color: 'bg-purple-500', desc: 'Deterministically pairs biological threat with non-lethal payload.' },
    { name: 't5 · Pneumatic Solenoid Valve Actuation', ms: lat.t5_agro_valve_solenoid_ms, color: 'bg-emerald-500', desc: '145 PSI chili-oleoresin manifold opens or bee banks transmit.' }
  ];

  return (
    <div className="space-y-5 font-mono text-xs">
      {/* Back button */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <Link
          to="/incidents"
          className="flex items-center space-x-1.5 text-slate-400 hover:text-cyan-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO AUDIT LOGS</span>
        </Link>
        <span className="text-emerald-400 font-bold text-xs">
          TOTAL RESPONSE: {lat.totalHandshakeTimeMs}ms
        </span>
      </div>

      {/* Header Banner */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
              POST-MORTEM
            </span>
            <h1 className="text-lg font-bold text-slate-100">{incident.incidentCode}</h1>
          </div>
          <p className="text-[11px] text-slate-400 font-sans mt-1">
            Sector: {incident.nodeId} · {incident.sectorName} · Timestamp: {new Date(incident.timestamp).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-[10px] text-slate-500">OUTCOME:</div>
            <div className="font-bold text-emerald-400 text-xs">{incident.outcome}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500">SAVED VALUE:</div>
            <div className="font-bold text-emerald-400 text-xs">
              +${incident.cropDamagePreventedUsd?.toLocaleString()} USD
            </div>
          </div>
        </div>
      </div>

      {/* Millisecond Latency Waterfall */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h2 className="font-bold text-slate-200 uppercase">
              Microsecond Handshake Latency Waterfall ({lat.totalHandshakeTimeMs}ms Total)
            </h2>
          </div>
          <span className="text-[10px] text-slate-500">99.8% Sub-300ms SLA Target</span>
        </div>

        <div className="space-y-3">
          {steps.map((s, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-slate-200">{s.name}</span>
                <span className="font-mono text-cyan-400 font-bold">{s.ms} ms</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full ${s.color}`}
                  style={{ width: `${Math.min(100, (s.ms / lat.totalHandshakeTimeMs) * 100 * 2.5)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400 font-sans">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Discipline Detailed Handshake Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Engineering Card */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold border-b border-cyan-900/40 pb-2">
            <Cpu className="w-4 h-4" />
            <span>ENGINEERING TELEMETRY</span>
          </div>
          <div className="space-y-1 text-slate-300 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">AI Confidence:</span>
              <span className="text-cyan-300 font-bold">{incident.engineering?.aiConfidence}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Thermal Signature:</span>
              <span className="text-amber-400">+{incident.engineering?.thermalDeltaC}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Node Solar Level:</span>
              <span className="text-emerald-400 font-bold">{incident.engineering?.solarLevel}%</span>
            </div>
          </div>
        </div>

        {/* Veterinary Card */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 font-bold border-b border-amber-900/40 pb-2">
            <HeartPulse className="w-4 h-4" />
            <span>VETERINARY INTELLIGENCE</span>
          </div>
          <div className="space-y-1 text-slate-300 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Subject Name:</span>
              <span className="text-amber-300 font-bold">{incident.elephantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Musth Status:</span>
              <span className="text-rose-400 font-bold">{incident.veterinary?.musthStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Aggression Score:</span>
              <span className="text-rose-400 font-bold">{incident.veterinary?.aggressionScore}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Calves Present:</span>
              <span className="text-emerald-400 font-bold">{incident.veterinary?.calvesPresent ? 'YES' : 'NO'}</span>
            </div>
          </div>
        </div>

        {/* Agricultural Card */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold border-b border-emerald-900/40 pb-2">
            <Sprout className="w-4 h-4" />
            <span>AGRICULTURAL INTERVENTION</span>
          </div>
          <div className="space-y-1 text-slate-300 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Deterrent Deployed:</span>
              <span className="text-emerald-300 font-bold truncate max-w-[130px]">
                {incident.agriculture?.deterrentDeployed?.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Valve Duration:</span>
              <span className="text-slate-200">{incident.agriculture?.valveDurationSec} sec burst</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Chili Discharged:</span>
              <span className="text-rose-400 font-bold">{incident.agriculture?.chiliDischargedLiters} Liters</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Acoustic Honeybee:</span>
              <span className="text-amber-400">{incident.agriculture?.acousticFrequencyHz} Hz</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
