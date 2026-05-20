import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SaphiraCrystal } from './SaphiraCrystal';
import { ArrowRight, Mic, BrainCircuit, Shield, Zap, Circle as CrystalIcon } from 'lucide-react';

interface SophiaAILandingProps {
  onEnterApp: () => void;
}

export const SophiaAILanding: React.FC<SophiaAILandingProps> = ({ onEnterApp }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      // Here you would typically send to your backend / CRM
      setTimeout(() => onEnterApp(), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <CrystalIcon className="w-8 h-8 text-white opacity-80" />
          <span className="font-cursive text-5xl diamond-glass-text lowercase">Saphira</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onEnterApp}
            className="text-sm font-medium text-white/70 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={onEnterApp}
            className="text-sm font-bold bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            Launch System
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 min-h-[90vh] flex flex-col items-center justify-center text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <h1 className="text-6xl md:text-9xl mb-4 leading-tight tracking-tight">
            <span className="font-cursive diamond-glass-text py-4 block">Saphira</span>
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-[0.3em] uppercase opacity-80 mb-10 text-blue-100/60">
            Sovereign Intelligence
          </p>
          <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto font-light">
            Meet Saphira. The first embodied, multi-agent operating system. Stop typing prompts and start orchestrating intelligence with your voice.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-6 py-4 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-fuchsia-500/50 w-full"
              />
              <button 
                type="submit"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md rounded-full font-bold shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-2"
              >
                Get Early Access <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-8 py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full font-bold inline-block"
            >
              Access Granted. Initializing System...
            </motion.div>
          )}

        </motion.div>

        {/* Central Orb Display */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative mt-20"
        >
          <SaphiraCrystal state="idle" emotion="neutral" className="w-[300px] h-[300px] md:w-[400px] md:h-[400px]" />
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">The Saphira Architecture</h2>
            <p className="text-white/50">A multi-modal swarm built for operational leverage.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Mic, title: "Ambient Voice", desc: "Always listening via 'Okay Saphira'. Zero click execution.", color: "text-blue-400" },
              { icon: BrainCircuit, title: "Multi-Agent Swarm", desc: "Logic, Creative, Risk, and Execution agents routing intents instantly.", color: "text-fuchsia-400" },
              { icon: Zap, title: "Self-Healing Workflows", desc: "Executes Python and Docker locally via Agent Zero.", color: "text-emerald-400" },
              { icon: Shield, title: "Sovereign Intelligence", desc: "Data is locked and encrypted. Unhackable shield protocols active.", color: "text-amber-400" },
              { icon: ArrowRight, title: "Visual API Feedback", desc: "See the AI thinking via the WebGL orb state changes.", color: "text-rose-400" },
              { icon: BrainCircuit, title: "Recursive Context", desc: "2 Million token window means it never forgets a project.", color: "text-indigo-400" }
            ].map((f, i) => (
              <div key={i} className="p-8 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-colors group">
                <f.icon className={`w-8 h-8 mb-4 ${f.color} group-hover:scale-110 transition-transform`} />
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-32 text-center bg-gradient-to-b from-[#050510] to-fuchsia-900/20 relative">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6">This is not a chatbot.</h2>
          <p className="text-xl text-white/70 mb-12">
            Saphira transforms intelligence into a visual, responsive experience. Watch the system react, reason, and execute in real-time.
          </p>
          <div className="w-full max-w-2xl mx-auto bg-black/50 border border-white/10 rounded-2xl aspect-video flex items-center justify-center p-4 backdrop-blur-md shadow-2xl">
            <div className="text-center opacity-50">
              <SaphiraCrystal state="thinking" emotion="analytical" className="w-[150px] h-[150px] mx-auto mb-4" />
              <p className="font-mono text-sm uppercase tracking-widest text-fuchsia-400">Executing Multi-Agent Protocol...</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-16">Intelligence Tiers</h2>

          <div className={`grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left`}>
            {[
              { name: "Free", price: "$0", desc: "Core Intelligence", features: ["Text & Voice Input", "Single Agent (Logic)", "100 Queries / mo"] },
              { name: "Pro", price: "$15/mo", desc: "For Power Users", features: ["Unlimited Voice", "Full Multi-Agent Swarm", "Priority Rendering", "Memory Persistence"], popular: true },
              { name: "Elite", price: "$50/mo", desc: "For Visionaries", features: ["Autonomous Execution", "Custom Sub-Agents", "API Access", "Agent Zero Sandbox"] }
            ].map((plan, i) => (
              <div key={i} className={`p-8 rounded-3xl border ${plan.popular ? 'border-white/20 bg-white/5 relative shadow-[0_0_50px_-15px_rgba(255,255,255,0.15)]' : 'border-white/10 bg-white/5'} flex flex-col`}>
                {plan.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">Most Popular</div>}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-white/50 mb-6 h-6">{plan.desc}</p>
                <div className="text-4xl font-black mb-8">{plan.price}</div>
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-white/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-white text-black hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 text-center border-t border-white/5 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-5xl font-black mb-8">Talk to intelligence differently.</h2>
          <button 
            onClick={onEnterApp}
            className="px-10 py-5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-bold text-xl shadow-[0_0_50px_-5px_rgba(255,255,255,0.2)] hover:shadow-[0_0_70px_-5px_rgba(255,255,255,0.3)] transition-all hover:scale-105 inline-block"
          >
            Launch Saphira Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center text-white/30 text-sm">
        <p>Saphira © {new Date().getFullYear()}. Sovereign Intelligence Ecosystem.</p>
      </footer>
    </div>
  );
};
