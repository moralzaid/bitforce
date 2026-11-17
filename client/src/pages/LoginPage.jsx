import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, UserCheck, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, switchDemoRole, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('judge@trident.hec');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState(null);

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login(email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  const handleInstantDemoLogin = async (role) => {
    await switchDemoRole(role);
    navigate('/');
  };

  const demoAccounts = [
    { role: 'Judge/Admin', email: 'judge@trident.hec', label: 'Hackathon Judge / Admin', desc: 'Full privileges, chaos toggles, simulation controls', color: 'border-purple-500/40 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20' },
    { role: 'Veterinary Officer', email: 'vet@trident.hec', label: 'Veterinary Officer', desc: 'Manage Musth profiles, hormone timeline, ethical overrides', color: 'border-amber-500/40 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20' },
    { role: 'Field Engineer', email: 'engineer@trident.hec', label: 'Field Engineer', desc: 'Camera edge nodes, solar battery telemetry, diagnostics', color: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20' },
    { role: 'Agricultural Officer', email: 'agro@trident.hec', label: 'Agricultural Officer', desc: 'Bio-buffer zones, chili tanks, acoustic bee arrays', color: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 font-mono text-xs">
      {/* Background Graphic Grid */}
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-[1px] items-center justify-center shadow-xl shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-wider">TRIDENT COMMAND</h1>
          <p className="text-slate-400 text-xs font-sans">
            Tri-Disciplinary Automated Bio-Fence Network Authentication
          </p>
        </div>

        {/* 1-Click Instant Demo Role Switcher for Evaluators */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-slate-200 text-xs flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>ONE-CLICK EVALUATOR LOGIN</span>
            </span>
            <span className="text-[10px] text-cyan-400">Zero Password Required</span>
          </div>

          <div className="space-y-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => handleInstantDemoLogin(acc.role)}
                className={`w-full p-2.5 rounded-lg border text-left transition flex items-center justify-between ${acc.color}`}
              >
                <div>
                  <div className="font-bold text-xs">{acc.label}</div>
                  <div className="text-[10px] text-slate-400 font-sans">{acc.desc}</div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>
            ))}
          </div>
        </div>

        {/* Standard Credentials Form */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="text-slate-400 font-bold border-b border-slate-800 pb-2">
            Or Sign In With Officer Credentials
          </div>

          {error && (
            <div className="p-2.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 text-[11px]">
              {error}
            </div>
          )}

          <form onSubmit={handleStandardLogin} className="space-y-3">
            <div>
              <label className="text-slate-400 block mb-1">Officer Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded pl-8 pr-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Access Passcode</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded pl-8 pr-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition flex items-center justify-center space-x-1 shadow-lg shadow-cyan-950/40"
            >
              <span>{loading ? 'AUTHENTICATING...' : 'SIGN IN TO COMMAND'}</span>
            </button>
          </form>

          <div className="text-center pt-1 text-[11px] text-slate-500">
            <span>Need field clearance? </span>
            <Link to="/register" className="text-cyan-400 hover:underline">
              Register Officer Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
