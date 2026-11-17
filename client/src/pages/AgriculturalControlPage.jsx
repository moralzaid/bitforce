import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Flame,
  Volume2,
  Wind,
  RefreshCw,
  Droplets,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import AgroZoneCard from '../components/agriculture/AgroZoneCard';
import { agricultureAPI } from '../services/api';

export default function AgriculturalControlPage() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchZones = async () => {
    setLoading(true);
    try {
      const res = await agricultureAPI.getAgroZones();
      if (res.data?.success) {
        setZones(res.data.data);
      }
    } catch (err) {
      console.warn('Using offline agro zones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const totalCapacity = zones.reduce((acc, z) => acc + (z.chiliTankCapacityLiters || 500), 0);
  const totalLiters = zones.reduce((acc, z) => acc + (z.chiliTankCurrentLiters || 450), 0);
  const totalCropProtected = zones.reduce((acc, z) => acc + (z.cropValuationUsd || 80000), 0);

  return (
    <div className="space-y-5 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-800 gap-3">
        <div className="flex items-center space-x-2">
          <Sprout className="w-5 h-5 text-emerald-400" />
          <div>
            <h1 className="text-base font-bold text-slate-100 uppercase tracking-wider">
              Agricultural Deterrent Control Center: Bio-Buffer Zones
            </h1>
            <p className="text-[11px] text-slate-400 font-sans">
              Pneumatic line pressure gauges (PSI), high-potency chili oleoresin reservoirs, acoustic honeybee frequency banks, and wind-drift safety lockouts.
            </p>
          </div>
        </div>

        <button
          onClick={fetchZones}
          className="flex items-center space-x-1 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
          <span>REFRESH PRESSURES</span>
        </button>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">TOTAL CHILI INVENTORY</div>
          <div className="text-lg font-extrabold text-rose-400 mt-0.5">
            {totalLiters} / {totalCapacity} L
          </div>
          <div className="text-[10px] text-slate-400">Capsaicin 1.2M SHU Standard</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">OPERATIONAL PRESSURE</div>
          <div className="text-lg font-extrabold text-emerald-400 mt-0.5">145 PSI Nominal</div>
          <div className="text-[10px] text-slate-400">Dual Solenoid Manifolds</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">ACTIVE BIO-ZONES</div>
          <div className="text-lg font-extrabold text-cyan-400 mt-0.5">{zones.length || 6} Zones</div>
          <div className="text-[10px] text-slate-400">Chili-Citronella Barriers</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase">PROTECTED HARVEST VALUE</div>
          <div className="text-lg font-extrabold text-emerald-400 mt-0.5">
            ${totalCropProtected?.toLocaleString()} USD
          </div>
          <div className="text-[10px] text-slate-400">High-Yield Paddy & Veg</div>
        </div>
      </div>

      {/* Grid of 6 Agro Buffer Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map((zone) => (
          <AgroZoneCard key={zone.zoneId} zone={zone} onUpdated={fetchZones} />
        ))}
      </div>
    </div>
  );
}
