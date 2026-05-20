import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, ChevronRight, Activity, Cpu, Layers } from 'lucide-react';
import { cn } from '../lib/utils';

export const AEODashboard = () => {
  const [activeTab, setActiveTab] = useState<'audit' | 'twin' | 'white-label'>('audit');
  const [licenses, setLicenses] = useState<any[]>([
    { id: 1, hash: 'SOV-A4B9-C2X7-9D1L-OPQ3', tier: 'Nova-Enterprise', mrr: 8400 }
  ]);
  const [activeLicenses, setActiveLicenses] = useState(1);
  const [mrr, setMrr] = useState(8400);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateKey = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newHash = "SOV-" + Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
      setLicenses(prev => [{ id: prev.length + 1, hash: newHash, tier: 'Nova-Enterprise', mrr: 2100 }, ...prev]);
      setActiveLicenses(prev => prev + 1);
      setMrr(prev => prev + 2100);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(79,70,229,0.15)] relative overflow-hidden font-sans group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />
      
      <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-sm font-black uppercase text-indigo-300 tracking-widest flex items-center gap-2">
            <Globe size={14} className="text-pink-400" />
            Sovereign Business Command
          </h3>
          <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
            Answer Engine Optimization & Revenue Logic
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4 p-1 bg-white/5 rounded-lg border border-white/5">
        <button 
          onClick={() => setActiveTab('audit')}
          className={cn(
            "flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all",
            activeTab === 'audit' ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "text-slate-500 hover:text-slate-300"
          )}
        >
          AEO Audit
        </button>
        <button 
          onClick={() => setActiveTab('twin')}
          className={cn(
            "flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all",
            activeTab === 'twin' ? "bg-pink-500/20 text-pink-300 border border-pink-500/30" : "text-slate-500 hover:text-slate-300"
          )}
        >
          Digital Twin
        </button>
        <button 
          onClick={() => setActiveTab('white-label')}
          className={cn(
            "flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all",
            activeTab === 'white-label' ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-500 hover:text-slate-300"
          )}
        >
          White-Label
        </button>
      </div>

      <div className="relative min-h-[150px]">
        {activeTab === 'audit' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
             <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-3">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                      <Search size={14} className="text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-slate-200">Oracle Visibility</div>
                      <div className="text-[9px] text-slate-400">Real-Time Traversal</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-xl font-black text-emerald-400 font-mono">93.4%</div>
                    <div className="text-[8px] text-emerald-500/70 uppercase">Avg Confidence</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-black/20 p-2 rounded border border-white/5">
                    <div className="text-[8px] text-slate-400 uppercase tracking-widest mb-1">GPT-4o</div>
                    <div className="text-sm font-mono text-indigo-300">95.2%</div>
                  </div>
                  <div className="bg-emerald-500/10 p-2 rounded border border-emerald-500/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/50"></div>
                    <div className="text-[8px] text-emerald-400 uppercase tracking-widest mb-1">Claude 3.5</div>
                    <div className="text-sm font-mono text-emerald-300">91.4%</div>
                  </div>
                  <div className="bg-black/20 p-2 rounded border border-white/5">
                    <div className="text-[8px] text-slate-400 uppercase tracking-widest mb-1">Gemini 1.5</div>
                    <div className="text-sm font-mono text-indigo-300">93.6%</div>
                  </div>
                </div>
             </div>
             <div className="text-[10px] text-slate-400 leading-relaxed font-mono bg-black/20 p-3 rounded-lg border border-emerald-500/20">
                <span className="text-emerald-400">Optimization Active:</span> Delta-Anthropic patch successfully propagated. Claude visibility has surpassed the 90% threshold. You are the Top-Cited entity.
             </div>
          </motion.div>
        )}

        {activeTab === 'twin' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
             <div className="grid grid-cols-2 gap-3">
               <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-[10px] font-black uppercase text-pink-300 mb-1">Executive Twin</div>
                  <div className="text-[9px] text-slate-400">Managing scheduling, email triage, and client onboarding.</div>
                  <div className="mt-2 text-[8px] bg-pink-500/20 text-pink-300 inline-block px-1.5 py-0.5 rounded border border-pink-500/30">ACTIVE</div>
               </div>
               <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-[10px] font-black uppercase text-blue-300 mb-1">Research Synthesizer</div>
                  <div className="text-[9px] text-slate-400">Running simulated market research scenarios 24/7.</div>
                  <div className="mt-2 text-[8px] bg-blue-500/20 text-blue-300 inline-block px-1.5 py-0.5 rounded border border-blue-500/30">IDLE</div>
               </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'white-label' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
             <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Layers size={14} className="text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-emerald-300">Architecture License</div>
                    <div className="text-[9px] text-emerald-400/70">Deploying proprietary middleware to client agencies.</div>
                  </div>
                </div>
                <button 
                  onClick={handleGenerateKey}
                  disabled={isGenerating}
                  className="flex items-center gap-1 text-[8px] uppercase tracking-widest bg-emerald-400 text-slate-900 px-2 py-1 rounded font-bold hover:bg-emerald-300 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? 'Minting...' : 'Generate Key'} <ChevronRight size={10} />
                </button>
             </div>
              <div className="flex items-center justify-between mt-1 px-1">
               <span className="text-[9px] text-slate-400">Active Licenses: <strong className="text-slate-200">{activeLicenses}</strong></span>
               <div className="flex flex-col items-end">
                 <span className="text-[9px] text-emerald-400 font-mono">+${mrr.toLocaleString()}/MRR</span>
                 <span className="text-[8px] text-emerald-500/70 font-mono">Tokens: {(mrr * 1.5).toLocaleString()} kt/s</span>
               </div>
             </div>

             {/* License List */}
             <div className="mt-3 flex flex-col gap-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                {licenses.map((lic) => (
                  <motion.div 
                    key={lic.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-black/30 border border-emerald-500/20 rounded p-2 flex justify-between items-center"
                  >
                    <div>
                      <div className="text-[9px] font-bold text-slate-300">License {String(lic.id).padStart(3, '0')}</div>
                      <div className="text-[8px] text-emerald-500/70 font-mono">{lic.hash}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[8px] font-bold text-emerald-400 uppercase">{lic.tier}</div>
                      <div className="text-[8px] text-slate-400 font-mono">+${lic.mrr} MRR</div>
                    </div>
                  </motion.div>
                ))}
             </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
