import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Network, Globe, Zap, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export function GlobalNodeTelemetry({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState(() => {
    return {
      activeNodes: 12,
      latency: 24,
      memoryPressure: 42,
      cpuUtilization: 18,
      regions: [
        { id: 'us-west', status: 'optimal', lag: 18, syncRate: 99.9 },
        { id: 'eu-central', status: 'optimal', lag: 45, syncRate: 99.5 },
        { id: 'ap-east', status: 'degraded', lag: 210, syncRate: 92.4 },
        { id: 'sa-east', status: 'optimal', lag: 88, syncRate: 98.8 },
      ],
      history: Array.from({ length: 20 }, (_, i) => ({
        time: i,
        cpu: Math.floor(Math.random() * 40 + 10),
        memory: Math.floor(Math.random() * 30 + 20)
      })),
      lastSync: Date.now()
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newCpu = Math.min(100, Math.max(0, Math.floor(prev.cpuUtilization + (Math.random() * 12 - 6))));
        const newMem = Math.min(100, Math.max(0, Math.floor(prev.memoryPressure + (Math.random() * 8 - 4))));
        const newHistory = [...prev.history.slice(1), { time: prev.history[prev.history.length - 1].time + 1, cpu: newCpu, memory: newMem }];

        return {
          ...prev,
          latency: Math.max(10, Math.floor(prev.latency + (Math.random() * 10 - 5))),
          memoryPressure: newMem,
          cpuUtilization: newCpu,
          history: newHistory,
          regions: prev.regions.map(r => ({
            ...r,
            lag: Math.max(5, Math.floor(r.lag + (Math.random() * 20 - 10))),
            syncRate: Math.min(100, Math.max(80, Number((r.syncRate + (Math.random() * 0.4 - 0.2)).toFixed(1))))
          })),
          lastSync: Date.now()
        };
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="w-full max-w-5xl bg-black/90 backdrop-blur-2xl border border-cyan-500/30 rounded-[2.5rem] p-6 md:p-10 pointer-events-auto shadow-[0_0_80px_-20px_rgba(6,182,212,0.4)] relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjM2LDcyLDE1MywwLjA1KSIvPjwvc3ZnPg==')] opacity-20 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 relative z-10 shrink-0 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]">
              <Globe className="text-cyan-400 animate-pulse" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase font-display">Global Telemetry</h2>
              <p className="text-xs text-cyan-400 font-mono tracking-widest uppercase">Distributed Systems Pulse</p>
            </div>
          </div>
          <button onClick={onClose} className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs uppercase font-bold tracking-widest text-slate-300 transition-colors border border-white/5 hidden md:block">Dismiss</button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10 mb-8">
            <div className="bg-[#0A0F1E]/80 border border-cyan-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center group hover:border-cyan-400/50 transition-colors relative overflow-hidden">
              <div className="absolute top-0 w-full h-1 bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              <Network className="text-emerald-400 mb-3 group-hover:scale-110 transition-transform" size={28} />
              <div className="text-4xl font-black text-white tracking-tighter">{data.activeNodes}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-2">Active Nodes</div>
            </div>
            <div className="bg-[#0A0F1E]/80 border border-cyan-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center group hover:border-cyan-400/50 transition-colors relative overflow-hidden">
              <div className={cn("absolute top-0 w-full h-1 shadow-[0_0_10px_currentColor]", data.latency < 50 ? "bg-emerald-500 text-emerald-500" : "bg-amber-500 text-amber-500")} />
              <Zap className={cn("mb-3 group-hover:scale-110 transition-transform", data.latency < 50 ? "text-emerald-400" : "text-amber-400")} size={28} />
              <div className="flex items-baseline gap-1">
                <div className="text-4xl font-black text-white tracking-tighter">{data.latency}</div>
                <div className="text-sm font-bold text-slate-500">ms</div>
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-2">Avg Latency</div>
            </div>
            <div className="bg-[#0A0F1E]/80 border border-cyan-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center group hover:border-cyan-400/50 transition-colors relative overflow-hidden">
              <div className={cn("absolute top-0 w-full h-1 shadow-[0_0_10px_currentColor]", data.memoryPressure < 70 ? "bg-pink-500 text-pink-500" : "bg-rose-500 text-rose-500")} />
              <Activity className={cn("mb-3 group-hover:scale-110 transition-transform", data.memoryPressure < 70 ? "text-pink-400" : "text-rose-400")} size={28} />
              <div className="flex items-baseline gap-1">
                <div className="text-4xl font-black text-white tracking-tighter">{data.memoryPressure}</div>
                <div className="text-sm font-bold text-slate-500">%</div>
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-2">Memory Press</div>
            </div>
            <div className="bg-[#0A0F1E]/80 border border-cyan-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center group hover:border-cyan-400/50 transition-colors relative overflow-hidden">
              <div className={cn("absolute top-0 w-full h-1 shadow-[0_0_10px_currentColor]", data.cpuUtilization < 70 ? "bg-indigo-500 text-indigo-500" : "bg-rose-500 text-rose-500")} />
              <Cpu className={cn("mb-3 group-hover:scale-110 transition-transform", data.cpuUtilization < 70 ? "text-indigo-400" : "text-rose-400")} size={28} />
              <div className="flex items-baseline gap-1">
                <div className="text-4xl font-black text-white tracking-tighter">{data.cpuUtilization}</div>
                <div className="text-sm font-bold text-slate-500">%</div>
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-2">Core CPU</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
            {/* Chart Area */}
            <div className="bg-[#0A0F1E]/50 border border-white/10 rounded-3xl p-6 relative">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Activity size={14} className="text-cyan-400" /> Resource Trends
              </h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.history} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f472b6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f472b6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="time" hide />
                    <YAxis stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
                    <Area type="monotone" dataKey="cpu" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
                    <Area type="monotone" dataKey="memory" stroke="#f472b6" strokeWidth={2} fillOpacity={1} fill="url(#colorMem)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-4 mt-4 justify-center">
                <div className="flex items-center gap-2"><div className="w-3 h-1 bg-[#818cf8]" /> <span className="text-[10px] font-bold text-slate-400 uppercase">CPU</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-1 bg-[#f472b6]" /> <span className="text-[10px] font-bold text-slate-400 uppercase">Memory</span></div>
              </div>
            </div>

            {/* Regional Status */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Globe size={14} className="text-cyan-400" /> Regional Clusters
                </h3>
              </div>
              <div className="space-y-3">
                 {data.regions.map(r => (
                   <div key={r.id} className="flex items-center justify-between p-4 bg-[#0A0F1E]/80 border border-white/5 rounded-2xl hover:border-cyan-500/30 transition-colors">
                     <div className="flex items-center gap-4">
                       <div className={cn("w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor]", r.status === 'optimal' ? "bg-emerald-400 text-emerald-400 animate-pulse" : "bg-amber-500 text-amber-500")} />
                       <span className="font-mono text-xs font-bold text-white uppercase tracking-widest">{r.id}</span>
                     </div>
                     <div className="flex items-center gap-6">
                   <span className="text-[10px] font-bold tracking-widest uppercase text-white/50">{r.status}</span>
                   <span className="font-mono text-xs text-white/80 w-16 text-right">{r.lag}ms</span>
                   <span className="font-mono text-xs text-cyan-400 w-16 text-right">{r.syncRate}%</span>
                 </div>
                 {r.status !== 'optimal' && <div className="absolute inset-0 border border-amber-500/30 rounded-xl pointer-events-none" />}
               </div>
             ))}
           </div>
         </div>
         </div>
       </div>

        <div className="mt-6 text-center text-[9px] text-white/30 font-mono tracking-widest uppercase shrink-0">
           Last Sync: {new Date(data.lastSync).toISOString()}
        </div>
      </motion.div>
    </div>
  );
}
