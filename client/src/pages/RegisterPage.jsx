import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, User, Briefcase, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Field Engineer',
    department: 'Autonomous Mesh Infrastructure'
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await register(formData);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 font-mono text-xs">
      <div className="w-full max-w-md space-y-5">
        <Link to="/login" className="flex items-center space-x-1.5 text-slate-400 hover:text-cyan-400 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO SIGN IN</span>
        </Link>

        <div className="text-center space-y-1">
          <h1 className="text-xl font-extrabold text-slate-100 tracking-wider">REGISTER OFFICER</h1>
          <p className="text-slate-400 text-xs font-sans">
            Provision new role credentials for the TRIDENT tactical network.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          {error && (
            <div className="p-2.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 text-[11px]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-slate-400 block mb-1">Full Name & Rank</label>
              <input
                type="text"
                required
                placeholder="e.g. Officer Sunethra"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Officer Email</label>
              <input
                type="email"
                required
                placeholder="officer@trident.hec"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Access Passcode</label>
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Tactical Discipline Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200"
              >
                <option value="Field Engineer">Field Engineer (Edge Hardware & Sensors)</option>
                <option value="Veterinary Officer">Veterinary Officer (Biometrics & Hormones)</option>
                <option value="Agricultural Officer">Agricultural Officer (Tanks & Bio-Buffers)</option>
                <option value="Judge/Admin">Judge / Admin (Full Tactical Overrides)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition flex items-center justify-center space-x-1 mt-2"
            >
              <span>{loading ? 'ENROLLING...' : 'ENROLL OFFICER ACCOUNT'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
