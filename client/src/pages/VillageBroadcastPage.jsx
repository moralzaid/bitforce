import React, { useState } from 'react';
import { Radio, Bell, Send, CheckCircle2, AlertTriangle, Phone, Volume2 } from 'lucide-react';

export default function VillageBroadcastPage() {
  const [broadcastLog, setBroadcastLog] = useState([
    {
      id: 'SMS-8841',
      timestamp: '12:14:02',
      village: 'Habarana North Settlement',
      recipients: 148,
      channel: 'SMS + LoRa Siren',
      message: 'TRIDENT ALERT: Bull in Active Musth (Raja) detected near Sector 04 buffer. Automated bio-fence mist active. Please keep cattle indoors.',
      status: 'DELIVERED (100%)'
    },
    {
      id: 'SMS-8840',
      timestamp: '11:42:18',
      village: 'Paluwewa Farming Hamlet',
      recipients: 92,
      channel: 'SMS Broadcast',
      message: 'TRIDENT NOTICE: Calm matriarch herd browsing North Acacia corridor. Bio-acoustic honeybee arrays deployed. No settlement threat.',
      status: 'DELIVERED (100%)'
    },
    {
      id: 'SMS-8839',
      timestamp: '09:12:05',
      village: 'Dambulla Agrarian Ward 03',
      recipients: 215,
      channel: 'SMS Broadcast',
      message: 'TRIDENT ROUTINE: Perimeter sector 09 solar battery float normal. 0 active breaches.',
      status: 'DELIVERED (100%)'
    }
  ]);

  const [testVillage, setTestVillage] = useState('Habarana North Settlement');
  const [testMessage, setTestMessage] = useState('TEST BROADCAST: Tactical early warning siren test.');
  const [sending, setSending] = useState(false);

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const newEntry = {
        id: `SMS-${Math.floor(8842 + Math.random() * 500)}`,
        timestamp: timeStr,
        village: testVillage,
        recipients: 164,
        channel: 'SMS + LoRa Siren',
        message: testMessage,
        status: 'DELIVERED (100%)'
      };
      setBroadcastLog([newEntry, ...broadcastLog]);
      setSending(false);
    }, 600);
  };

  return (
    <div className="space-y-5 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Radio className="w-5 h-5 text-cyan-400" />
          <div>
            <h1 className="text-base font-bold text-slate-100 uppercase tracking-wider">
              Village Early-Warning Broadcast System
            </h1>
            <p className="text-[11px] text-slate-400 font-sans">
              Automated LoRa audio siren activation and zero-latency SMS broadcast logs dispatching critical warnings to vulnerable agrarian settlements.
            </p>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          GSM & LoRaWAN GATEWAY ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Manual Broadcast Dispatcher (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h2 className="font-bold text-slate-200 uppercase">Emergency Broadcast Dispatcher</h2>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-3">
            <div>
              <label className="text-slate-400 block mb-1">Target Community</label>
              <select
                value={testVillage}
                onChange={(e) => setTestVillage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200"
              >
                <option value="Habarana North Settlement">Habarana North Settlement (148 Farmers)</option>
                <option value="Paluwewa Farming Hamlet">Paluwewa Farming Hamlet (92 Farmers)</option>
                <option value="Dambulla Agrarian Ward 03">Dambulla Agrarian Ward 03 (215 Farmers)</option>
                <option value="Kandalama South Agro Belt">Kandalama South Agro Belt (124 Farmers)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Alert Message</label>
              <textarea
                rows="3"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-slate-200"
              ></textarea>
            </div>

            <div className="p-2.5 rounded bg-slate-950/70 border border-slate-800 space-y-1 text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span>Active Siren Poles:</span>
                <span className="text-emerald-400 font-bold">12 / 12 Operational</span>
              </div>
              <div className="flex justify-between">
                <span>Average SMS Broadcast Latency:</span>
                <span className="text-cyan-400 font-bold">1.4 seconds</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-2.5 rounded bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold transition flex items-center justify-center space-x-1.5 shadow-lg shadow-cyan-950/40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sending ? 'DISPATCHING BROADCAST...' : 'TRIGGER EARLY-WARNING SMS'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Dispatch Audit Trail (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="font-bold text-slate-200 uppercase">Recent Broadcast Transmissions</h2>
            <span className="text-[10px] text-slate-500">GSM LoRa Gateway Sync</span>
          </div>

          <div className="space-y-3">
            {broadcastLog.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-cyan-400 font-bold">{log.id}</span>
                    <span className="text-slate-200 font-bold">{log.village}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">[{log.timestamp}]</span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{log.message}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-900">
                  <span>{log.channel} · {log.recipients} Recipients</span>
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{log.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
