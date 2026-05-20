import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Zap, Shield, Crown, Fingerprint, Lock, ArrowRight, BrainCircuit, Activity } from 'lucide-react';
import { SaphiraLogo } from './SaphiraLogo';
import { cn } from '../lib/utils';

interface AdaptivePaywallOverlayProps {
  active: boolean;
  onClose: () => void;
  triggerContext?: 'research' | 'forensic' | 'retention';
}

export function AdaptivePaywallOverlay({ active, onClose, triggerContext = 'forensic' }: AdaptivePaywallOverlayProps) {
  const [selectedTier, setSelectedTier] = useState<'micro' | 'subscription'>('subscription');
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const getContextualMessaging = () => {
    switch (triggerContext) {
      case 'research':
        return {
          title: "Elevate Cognitive Processing",
          description: "You've reached an inflection point in your deep-dive research. Upgrade to Tier 3 reasoning nodes to unearth non-obvious variable correlations and complete this analysis.",
          urgency: "High-compute inference required for this volume of data."
        };
      case 'retention':
        return {
          title: "Sovereign Salvage Protocol",
          description: "I've noticed a shift in your engagement calculus. To realign your trajectory, I'm authorized to unlock temporary Tier 3 access. Let's refine your next move.",
          urgency: "Limited-time architectural alignment offer."
        };
      case 'forensic':
      default:
        return {
          title: "Unlock Forensic Synthesis",
          description: "The depth of this interaction requires the Nova-Level reasoning tier. Authenticate your Sovereign Subscription to decrypt the internal variables and automate your strategy.",
          urgency: "Tier 3 processing cluster standing by."
        };
    }
  };

  const messaging = getContextualMessaging();

  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
        >
          <div className="absolute inset-0 bg-[#0A0F1E]/90 backdrop-blur-2xl" onClick={onClose} />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-4xl bg-gradient-to-b from-[#131A2A] to-[#0A0F1E] rounded-[2.5rem] border border-indigo-500/20 shadow-[0_0_100px_rgba(99,102,241,0.1)] overflow-hidden flex flex-col md:flex-row"
          >
            {/* Left Column: Contextual Value Proposition */}
            <div className="w-full md:w-5/12 p-8 md:p-12 relative overflow-hidden flex flex-col justify-between border-b md:border-b-0 md:border-r border-indigo-500/10">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-60 blur-3xl" />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <SaphiraLogo size="sm" />
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-indigo-400">NovaUmbrella OS</span>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-6">
                    <Activity size={12} className="animate-pulse" />
                    Compute Threshold Reached
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-4 font-display">
                    {messaging.title}
                  </h2>
                  <p className="text-indigo-200/60 leading-relaxed text-sm md:text-base font-medium">
                    {messaging.description}
                  </p>
                </motion.div>
              </div>

              <div className="relative z-10 mt-12 pt-8 border-t border-indigo-500/20">
                <div className="flex items-center gap-3 text-xs text-indigo-300">
                  <Shield size={14} className="text-emerald-400" />
                  <span>Encrypted Sovereign Sandbox</span>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Paywall Interface */}
            <div className="w-full md:w-7/12 p-8 md:p-12 relative bg-[#0A0F1E]">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors z-20"
              >
                <X size={20} />
              </button>

              <div className="flex bg-[#131A2A] rounded-2xl p-1 mb-8 border border-indigo-500/20 w-fit">
                <button
                  onClick={() => setSelectedTier('subscription')}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    selectedTier === 'subscription' 
                      ? "bg-indigo-500/20 text-indigo-300 shadow-sm" 
                      : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  Sovereign Tier
                </button>
                <button
                  onClick={() => setSelectedTier('micro')}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                    selectedTier === 'micro' 
                      ? "bg-indigo-500/20 text-indigo-300 shadow-sm" 
                      : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  Micro-Injection
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedTier}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {selectedTier === 'subscription' ? (
                    <div className="space-y-6">
                      <div className="relative p-[1px] rounded-3xl overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-60" />
                        <div className="relative bg-[#0A0F1E] rounded-[23px] p-8 h-full">
                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <div className="text-pink-400 font-bold tracking-widest uppercase text-[10px] mb-2 flex items-center gap-2">
                                <Crown size={12} /> Priority Clearance
                              </div>
                              <h3 className="text-2xl font-black text-white">Nova Sovereign</h3>
                            </div>
                            <div className="text-right">
                              <span className="text-3xl font-black text-white">$45</span>
                              <span className="text-slate-400 text-xs ml-1">/mo</span>
                            </div>
                          </div>

                          <ul className="space-y-4 mb-8">
                            {[
                              { id: 'tier3', icon: <BrainCircuit size={16} />, text: 'Unlimited Tier 3 (Nova-Level) Reasoning Tasks' },
                              { id: 'forensic', icon: <Fingerprint size={16} />, text: 'Deep Forensic Filter & Deductive Profiling' },
                              { id: 'secure', icon: <Lock size={16} />, text: 'Glass Cage Protocol Logging & Audit Trails' }
                            ].map((feature) => (
                              <li 
                                key={feature.id}
                                className="flex items-center gap-3 text-sm text-slate-300 transition-colors hover:text-white"
                                onMouseEnter={() => setHoveredFeature(feature.id)}
                                onMouseLeave={() => setHoveredFeature(null)}
                              >
                                <span className={cn("text-indigo-400 transition-transform", hoveredFeature === feature.id && "scale-110 text-pink-400")}>{feature.icon}</span>
                                <span>{feature.text}</span>
                              </li>
                            ))}
                          </ul>

                          <button className="w-full relative group overflow-hidden rounded-2xl p-[1px]">
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative bg-[#0A0F1E] py-4 rounded-2xl flex items-center justify-center gap-2 group-hover:bg-transparent transition-colors">
                              <span className="text-white font-bold tracking-widest text-xs uppercase text-shadow-sm">Authenticate Subscription</span>
                              <ArrowRight size={16} className="text-white group-hover:translate-x-1 transition-transform" />
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="border border-indigo-500/20 bg-[#131A2A] rounded-3xl p-8 hover:border-indigo-500/40 transition-colors">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <div className="text-indigo-400 font-bold tracking-widest uppercase text-[10px] mb-2 flex items-center gap-2">
                              <Zap size={12} /> Point-in-Time Access
                            </div>
                            <h3 className="text-2xl font-black text-white">Contextual Unlock</h3>
                          </div>
                          <div className="text-right">
                            <span className="text-3xl font-black text-white">$4</span>
                            <span className="text-slate-400 text-xs ml-1">/task</span>
                          </div>
                        </div>

                        <p className="text-sm text-slate-400 leading-relaxed mb-8">
                          Inject temporary Tier 3 reasoning parameters solely to resolve the current operation. Does not include persistent Forensic Logging.
                        </p>

                        <button className="w-full bg-white text-[#0A0F1E] hover:bg-slate-200 py-4 rounded-2xl font-bold tracking-widest text-xs uppercase flex items-center justify-center gap-2 transition-colors">
                          <Zap size={16} /> Execute Micro-Injection
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Secured by NovaUmbrella Cryptography</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
