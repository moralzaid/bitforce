import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  HeartPulse,
  Flame,
  ShieldAlert,
  ArrowLeft,
  Calendar,
  Activity,
  History,
  CheckCircle2,
  Save,
  Zap
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { veterinaryAPI } from '../services/api';
import MusthGauge from '../components/veterinary/MusthGauge';
import { useSimulation } from '../context/SimulationContext';

export default function ElephantDetailPage() {
  const { id } = useParams();
  const { triggerBreach, isSimulating } = useSimulation();
  const [elephant, setElephant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMusthStatus, setEditMusthStatus] = useState('Active');
  const [editTestosterone, setEditTestosterone] = useState(90);
  const [editDrainage, setEditDrainage] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchElephant = async () => {
      setLoading(true);
      try {
        const res = await veterinaryAPI.getElephantById(id);
        if (res.data?.success) {
          const el = res.data.data;
          setElephant(el);
          setEditMusthStatus(el.musthStatus);
          setEditTestosterone(el.testosteroneIndex);
          setEditDrainage(el.temporalDrainageActive);
        }
      } catch (err) {
        console.warn('Using fallback dossier');
      } finally {
        setLoading(false);
      }
    };
    fetchElephant();
  }, [id]);

  const handleUpdateMusth = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await veterinaryAPI.updateMusthStatus(id, {
        musthStatus: editMusthStatus,
        testosteroneIndex: editTestosterone,
        temporalDrainageActive: editDrainage
      });
      if (res.data?.success) {
        setElephant(res.data.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      // quiet
    } finally {
      setSaving(false);
    }
  };

  if (loading || !elephant) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        Loading Elephant Biometric Dossier...
      </div>
    );
  }

  // Format hormone chart data
  const chartData = (elephant.hormoneHistory || []).map((h, i) => ({
    week: `Wk ${i + 1}`,
    testosterone: h.testosteroneIndex || Math.floor(40 + Math.random() * 50),
    aggression: (h.aggressionScore || 5) * 10
  }));

  return (
    <div className="space-y-5 font-mono text-xs">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <Link
          to="/veterinary"
          className="flex items-center space-x-1.5 text-slate-400 hover:text-cyan-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO VETERINARY REGISTRY</span>
        </Link>
        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
          COLLAR RFID: {elephant.collarId}
        </span>
      </div>

      {/* Profile Dossier Header */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-100">{elephant.name}</h1>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                elephant.musthStatus === 'Active'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              MUSTH: {elephant.musthStatus}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans mt-1">
            {elephant.classification} · Morphotype: {elephant.morphotype} · Estimated Age: {elephant.age} yrs · Weight: {elephant.estimatedWeightKg} kg
          </p>
        </div>

        <button
          onClick={() => triggerBreach({ elephantCollarId: elephant.collarId, nodeId: 'NODE-04' })}
          disabled={isSimulating}
          className="self-start md:self-auto px-4 py-2 rounded bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold transition flex items-center space-x-1.5 shadow-lg shadow-rose-950/40"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>SIMULATE BREACH WITH {elephant.name.split(' ')[0]}</span>
        </button>
      </div>

      {/* Grid: Hormone Chart (7 Cols) + Quick Musth Updater (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Hormone History Line Chart */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <h2 className="font-bold text-slate-200 uppercase">
                Serum Testosterone & Aggression Timeline
              </h2>
            </div>
            <div className="flex items-center space-x-3 text-[10px]">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span className="text-slate-400">Testosterone (0-100)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span className="text-slate-400">Aggression Index (x10)</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="week" stroke="#64748B" fontSize={10} />
                <YAxis stroke="#64748B" fontSize={10} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="testosterone" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="aggression" stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Veterinary Officer Hormone Override Form */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <HeartPulse className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-slate-200 uppercase">Veterinary Field Updates</h2>
          </div>

          <form onSubmit={handleUpdateMusth} className="space-y-3">
            <div>
              <label className="text-slate-400 block mb-1">Musth Status</label>
              <select
                value={editMusthStatus}
                onChange={(e) => setEditMusthStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200"
              >
                <option value="Active">Active Musth (Extreme Risk)</option>
                <option value="Pre-Musth">Pre-Musth (Rising)</option>
                <option value="Post-Musth">Post-Musth (Waning)</option>
                <option value="N/A - Female">Female / N/A</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Serum Testosterone:</span>
                <span className="text-amber-400 font-bold">{editTestosterone} / 100</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={editTestosterone}
                onChange={(e) => setEditTestosterone(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="temporalCheck"
                checked={editDrainage}
                onChange={(e) => setEditDrainage(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700"
              />
              <label htmlFor="temporalCheck" className="text-slate-300">
                Active Temporal Gland Drainage Observed
              </label>
            </div>

            {saveSuccess && (
              <div className="p-2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Biometrics synchronized to MongoDB</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition flex items-center justify-center space-x-1.5 mt-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'SYNCHRONIZING...' : 'COMMIT BIOMETRIC UPDATE'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Associated Breach History Table */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
          <History className="w-4 h-4 text-cyan-400" />
          <h2 className="font-bold text-slate-200 uppercase">Recent Encounter Post-Mortems</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                <th className="p-2">Incident Code</th>
                <th className="p-2">Sector Node</th>
                <th className="p-2">Deterrent Deployed</th>
                <th className="p-2">Chili Discharged</th>
                <th className="p-2">Outcome</th>
                <th className="p-2">Damage Prevented</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-[11px]">
              {(elephant.recentIncidents || []).length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-slate-500">
                    No recent breach records for this subject.
                  </td>
                </tr>
              ) : (
                elephant.recentIncidents.map((inc) => (
                  <tr key={inc.incidentCode} className="hover:bg-slate-800/40">
                    <td className="p-2 font-mono text-cyan-400 font-bold">{inc.incidentCode}</td>
                    <td className="p-2">{inc.nodeId} · {inc.sectorName?.split(' - ')[1] || inc.sectorName}</td>
                    <td className="p-2">{inc.agriculture?.deterrentDeployed?.replace(/_/g, ' ')}</td>
                    <td className="p-2 font-mono text-rose-400">{inc.agriculture?.chiliDischargedLiters || 0} L</td>
                    <td className="p-2 text-emerald-400 font-bold">{inc.outcome}</td>
                    <td className="p-2 font-mono text-emerald-400">+${inc.cropDamagePreventedUsd?.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
