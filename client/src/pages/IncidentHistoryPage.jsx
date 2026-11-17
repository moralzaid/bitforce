import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  ArrowUpRight,
  Flame,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Download
} from 'lucide-react';
import { incidentsAPI } from '../services/api';

export default function IncidentHistoryPage() {
  const [incidents, setIncidents] = useState([]);
  const [search, setSearch] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('ALL');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const res = await incidentsAPI.getIncidents({
        search,
        outcome: outcomeFilter,
        subjectType: subjectFilter
      });
      if (res.data?.success) {
        setIncidents(res.data.data);
        setTotal(res.data.total);
      }
    } catch (err) {
      console.warn('Using offline incidents fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [outcomeFilter, subjectFilter]);

  const getOutcomeBadge = (outcome) => {
    if (outcome.includes('Violent Charge')) {
      return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
    if (outcome.includes('Herd Redirected') || outcome.includes('Deterred')) {
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
    if (outcome.includes('CATASTROPHIC')) {
      return 'bg-red-950 text-red-400 border-red-500 font-bold';
    }
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="space-y-5 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-800 gap-3">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-cyan-400" />
          <div>
            <h1 className="text-base font-bold text-slate-100 uppercase tracking-wider">
              Incident & Breach History Audit Logs
            </h1>
            <p className="text-[11px] text-slate-400 font-sans">
              Complete, searchable chronological audit trail of simulated and operational perimeter encounters with millisecond post-mortems.
            </p>
          </div>
        </div>

        <button
          onClick={fetchIncidents}
          className="flex items-center space-x-1 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
          <span>REFRESH LOGS</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by code, elephant, sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchIncidents()}
            className="w-full bg-slate-950 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-[11px]">
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300"
          >
            <option value="ALL">All Outcomes</option>
            <option value="Deterred">Deterred / Retreated</option>
            <option value="Herd Redirected">Herd / Calves Protected</option>
            <option value="Violent Charge">Violent Charge Halted</option>
            <option value="CATASTROPHIC">Chaos Breaches</option>
          </select>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300"
          >
            <option value="ALL">All Subjects</option>
            <option value="Elephant">Elephants</option>
            <option value="Wild Boar">Wild Boar</option>
          </select>
        </div>
      </div>

      {/* Incident Audit Table */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase bg-slate-950/60">
              <th className="p-3">Incident Code</th>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Sector Node</th>
              <th className="p-3">Identified Subject</th>
              <th className="p-3">Musth / Threat</th>
              <th className="p-3">Deterrent Payload</th>
              <th className="p-3">Turnaround</th>
              <th className="p-3">Outcome</th>
              <th className="p-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-[11px]">
            {incidents.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-6 text-center text-slate-500">
                  No incident records matching filter.
                </td>
              </tr>
            ) : (
              incidents.map((inc) => (
                <tr key={inc.incidentCode} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono text-cyan-400 font-bold">{inc.incidentCode}</td>
                  <td className="p-3 text-slate-400">
                    {new Date(inc.timestamp).toLocaleDateString()} {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="p-3 text-slate-300">{inc.nodeId} · {inc.sectorName?.split(' - ')[1] || inc.sectorName}</td>
                  <td className="p-3 font-bold text-slate-200">
                    {inc.elephantName || inc.subjectType}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        inc.veterinary?.musthStatus === 'Active'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'text-slate-400'
                      }`}
                    >
                      {inc.veterinary?.musthStatus || 'N/A'}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">{inc.agriculture?.deterrentDeployed?.replace(/_/g, ' ')}</td>
                  <td className="p-3 font-mono text-emerald-400 font-bold">
                    {inc.executionLatency?.totalHandshakeTimeMs || 232}ms
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] border font-bold ${getOutcomeBadge(inc.outcome)}`}>
                      {inc.outcome}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      to={`/incidents/${inc._id}`}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 inline-flex items-center"
                      title="Inspect Millisecond Post-Mortem"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
