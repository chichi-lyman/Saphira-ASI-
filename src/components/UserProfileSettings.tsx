import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserCircle, Settings, Moon, Sun, Volume2, Mic, Activity, Key, X } from 'lucide-react';

export const UserProfileSettings = ({ 
  user,
  isOpen, 
  onClose,
  isDarkMode,
  setIsDarkMode,
  voiceRate,
  setVoiceRate,
  saveProfile,
  onSignOut,
  isWakeWordActive,
  setIsWakeWordActive,
  onOpenApiKeys
}: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-indigo-950/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-indigo-100 dark:border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-indigo-50 dark:border-slate-800">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
               <Settings size={20} />
             </div>
             <div>
               <h2 className="text-lg font-black text-indigo-950 dark:text-white tracking-tight">System Preferences</h2>
               <p className="text-xs text-indigo-900/50 dark:text-slate-400 font-bold uppercase tracking-widest">Architect Configuration</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-indigo-900/50 hover:text-indigo-900 dark:text-slate-400 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="flex items-center gap-4">
            {user?.photoURL ? (
               <img src={user.photoURL} alt="User" className="w-16 h-16 rounded-full border-2 border-indigo-100 dark:border-slate-700 object-cover" />
            ) : (
               <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-slate-800 flex items-center justify-center">
                 <UserCircle size={32} className="text-indigo-300 dark:text-slate-500" />
               </div>
            )}
            <div>
               <h3 className="text-lg font-bold text-indigo-950 dark:text-white">{user?.displayName || 'Architect'}</h3>
               <p className="text-sm text-indigo-900/60 dark:text-slate-400">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-indigo-900/40 dark:text-slate-500">Interface & Feedback</h4>
            
            <div className="flex items-center justify-between p-4 bg-indigo-50/50 dark:bg-slate-800/50 rounded-2xl border border-indigo-100/50 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-indigo-500 dark:text-indigo-400">
                  {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
                </div>
                <div>
                  <span className="block text-sm font-bold text-indigo-950 dark:text-white">Dark Mode</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-900/50 dark:text-slate-400">Reduce visual strain</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  const newMode = !isDarkMode;
                  setIsDarkMode(newMode);
                  saveProfile({ isDarkMode: newMode });
                }}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}
              >
                <motion.div 
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                  animate={{ x: isDarkMode ? 24 : 0 }}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-emerald-500 dark:text-emerald-400">
                  <Mic size={16} />
                </div>
                <div>
                  <span className="block text-sm font-bold text-indigo-950 dark:text-white">Wake Word</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-900/50 dark:text-slate-400">"Okay Saphira" Listener</span>
                </div>
              </div>
              <button 
                onClick={() => setIsWakeWordActive(!isWakeWordActive)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${isWakeWordActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
              >
                <motion.div 
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                  animate={{ x: isWakeWordActive ? 24 : 0 }}
                />
              </button>
            </div>

            <div className="flex flex-col gap-4 p-4 bg-indigo-50/50 dark:bg-slate-800/50 rounded-2xl border border-indigo-100/50 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-indigo-500 dark:text-indigo-400">
                  <Volume2 size={16} />
                </div>
                <div>
                  <span className="block text-sm font-bold text-indigo-950 dark:text-white">Vocal Cadence Rate</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-900/50 dark:text-slate-400">Adjust synthesis speed</span>
                </div>
              </div>
              <div className="flex items-center gap-4 pl-12 pr-2">
                <span className="text-xs font-mono text-indigo-900/50 dark:text-slate-400 font-bold">0.5x</span>
                <input 
                  type="range" 
                  min="0.5" max="2.0" step="0.1"
                  value={voiceRate}
                  onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                  onMouseUp={() => saveProfile({ voiceRate })}
                  onMouseLeave={() => saveProfile({ voiceRate })}
                  className="flex-1 accent-indigo-500"
                />
                <span className="text-xs font-mono text-indigo-900/50 dark:text-slate-400 font-bold">2.0x</span>
              </div>
            </div>
            
            <button 
              onClick={() => { onClose(); onOpenApiKeys(); }}
              className="w-full flex items-center justify-between p-4 bg-indigo-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 rounded-2xl border border-indigo-100/50 dark:border-slate-700/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-pink-500 dark:text-pink-400">
                  <Key size={16} />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-bold text-indigo-950 dark:text-white group-hover:text-pink-500 dark:group-hover:text-pink-300 transition-colors">API Keys</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-900/50 dark:text-slate-400">Manage external tokens</span>
                </div>
              </div>
            </button>
            
          </div>
        </div>

        <div className="p-6 bg-indigo-50/50 dark:bg-slate-800/80 border-t border-indigo-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer" onClick={() => { onClose(); onSignOut(); }}>
            <Activity size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
          </div>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-indigo-950 dark:bg-white text-white dark:text-indigo-950 text-xs font-bold uppercase tracking-widest rounded-xl hover:shadow-lg transition-all"
          >
            Apply Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};
