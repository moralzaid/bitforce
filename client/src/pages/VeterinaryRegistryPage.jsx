import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  Search,
  Filter,
  Plus,
  Flame,
  Baby,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import ElephantDossierCard from '../components/veterinary/ElephantDossierCard';
import { veterinaryAPI } from '../services/api';

export default function VeterinaryRegistryPage() {
  const [elephants, setElephants] = useState([]);
  const [search, setSearch] = useState('');
  const [musthFilter, setMusthFilter] = useState('ALL');
  const [classificationFilter, setClassificationFilter] = useState('ALL');
  const [minAggression, setMinAggression] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Elephant form state
  const [newElephant, setNewElephant] = useState({
    collarId: `EL-${Math.floor(100 + Math.random() * 900)}`,
    name: '',
    classification: 'Solitary Bull',
    age: 35,
    estimatedWeightKg: 4600,
    morphotype: 'Tusker',
    musthStatus: 'Pre-Musth',
    testosteroneIndex: 40,
    aggressionScore: 5.5,
    habituationIndex: 20,
    calvesPresent: false,
    calfCount: 0,
    bioNotes: ''
  });

  const fetchElephants = async () => {
    setLoading(true);
    try {
      const res = await veterinaryAPI.getElephants({
        search,
        musthStatus: musthFilter,
        classification: classificationFilter,
        minAggression
      });
      if (res.data?.success) {
        setElephants(res.data.data);
      }
    } catch (err) {
      console.warn('Using offline elephant registry data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElephants();
  }, [musthFilter, classificationFilter, minAggression]);

  const handleCreateElephant = async (e) => {
    e.preventDefault();
    try {
      const res = await veterinaryAPI.createElephant(newElephant);
      if (res.data?.success) {
        setShowAddModal(false);
        fetchElephants();
      }
    } catch (err) {
      // quiet
    }
  };

  const musthCount = elephants.filter((e) => e.musthStatus === 'Active').length;
  const calfHerdsCount = elephants.filter((e) => e.calvesPresent).length;

  return (
    <div className="space-y-5 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-800 gap-3">
        <div className="flex items-center space-x-2">
          <HeartPulse className="w-5 h-5 text-amber-400" />
          <div>
            <h1 className="text-base font-bold text-slate-100 uppercase tracking-wider">
              Veterinary Intelligence Registry: Elephant Biometrics
            </h1>
            <p className="text-[11px] text-slate-400 font-sans">
              Directory of GPS-collared elephants and herds tracking Musth hormone cycles, historical aggression, and maternal calf safety parameters.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>REGISTER NEW COLLAR</span>
          </button>
        </div>
      </div>

      {/* KPI Telemetry Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">TRACKED COLLARS</div>
          <div className="text-lg font-extrabold text-slate-100 mt-0.5">{elephants.length} Subjects</div>
          <div className="text-[10px] text-slate-400">Department of Wildlife</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">ACTIVE MUSTH ALERTS</div>
          <div className="text-lg font-extrabold text-rose-400 mt-0.5 flex items-center space-x-1">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>{musthCount} Critical</span>
          </div>
          <div className="text-[10px] text-slate-400">Temporal Gland Drainage</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">MATERNAL HERDS</div>
          <div className="text-lg font-extrabold text-emerald-400 mt-0.5 flex items-center space-x-1">
            <Baby className="w-4 h-4 text-emerald-400" />
            <span>{calfHerdsCount} Protected</span>
          </div>
          <div className="text-[10px] text-slate-400">Bio-Ethical Chili Lockout</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">AVG HABITUATION</div>
          <div className="text-lg font-extrabold text-amber-400 mt-0.5">24.2% Index</div>
          <div className="text-[10px] text-slate-400">Dynamic Frequency Managed</div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, collar ID, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchElephants()}
            className="w-full bg-slate-950 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-[11px]">
          {/* Musth Filter */}
          <select
            value={musthFilter}
            onChange={(e) => setMusthFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300"
          >
            <option value="ALL">All Musth Stages</option>
            <option value="Active">Active Musth (Critical)</option>
            <option value="Pre-Musth">Pre-Musth</option>
            <option value="Post-Musth">Post-Musth</option>
            <option value="N/A - Female">Female / Cows</option>
          </select>

          {/* Classification Filter */}
          <select
            value={classificationFilter}
            onChange={(e) => setClassificationFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-300"
          >
            <option value="ALL">All Classifications</option>
            <option value="Solitary Bull">Solitary Bulls</option>
            <option value="Matriarch Herd">Matriarch Herds</option>
            <option value="Bachelor Group">Bachelor Groups</option>
          </select>

          <button
            onClick={fetchElephants}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dossier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {elephants.map((elephant) => (
          <ElephantDossierCard key={elephant.collarId} elephant={elephant} />
        ))}
      </div>

      {/* Add New Elephant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-bold text-slate-100 text-sm">Register New GPS-Collared Subject</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateElephant} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Collar ID</label>
                  <input
                    type="text"
                    required
                    value={newElephant.collarId}
                    onChange={(e) => setNewElephant({ ...newElephant, collarId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Subject Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahasen Bull"
                    value={newElephant.name}
                    onChange={(e) => setNewElephant({ ...newElephant, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Classification</label>
                  <select
                    value={newElephant.classification}
                    onChange={(e) => setNewElephant({ ...newElephant, classification: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200"
                  >
                    <option value="Solitary Bull">Solitary Bull</option>
                    <option value="Matriarch Herd">Matriarch Herd</option>
                    <option value="Bachelor Group">Bachelor Group</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Musth Status</label>
                  <select
                    value={newElephant.musthStatus}
                    onChange={(e) => setNewElephant({ ...newElephant, musthStatus: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200"
                  >
                    <option value="Active">Active (Musth)</option>
                    <option value="Pre-Musth">Pre-Musth</option>
                    <option value="Post-Musth">Post-Musth</option>
                    <option value="N/A - Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Aggression (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    value={newElephant.aggressionScore}
                    onChange={(e) => setNewElephant({ ...newElephant, aggressionScore: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="calfCheck"
                  checked={newElephant.calvesPresent}
                  onChange={(e) => setNewElephant({ ...newElephant, calvesPresent: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-700"
                />
                <label htmlFor="calfCheck" className="text-slate-300">
                  Dependent Calves Present (Activates Bio-Ethical Chili Lockout)
                </label>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Field Bio Notes</label>
                <textarea
                  rows="2"
                  value={newElephant.bioNotes}
                  onChange={(e) => setNewElephant({ ...newElephant, bioNotes: e.target.value })}
                  placeholder="Behavioral observations, crop preferences, seasonal routes..."
                  className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-slate-200"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                >
                  Save Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
