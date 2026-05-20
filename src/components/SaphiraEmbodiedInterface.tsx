import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SaphiraCrystal, CrystalState, CrystalEmotion } from './SaphiraCrystal';
import { Send, Mic, Settings, Maximize2 } from 'lucide-react';
import { useWakeWord } from '../hooks/useWakeWord';

import { cn } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

interface SaphiraEmbodiedInterfaceProps {
  onOpenDashboard: () => void;
  messages: Message[];
  isAnalyzing: boolean;
  isSpeaking: boolean;
  onSendMessage: (text: string) => void;
  onVoiceInputToggle: () => void;
  isListeningMic: boolean;
}

export const SaphiraEmbodiedInterface: React.FC<SaphiraEmbodiedInterfaceProps> = ({
  onOpenDashboard,
  messages,
  isAnalyzing,
  isSpeaking,
  onSendMessage,
  onVoiceInputToggle,
  isListeningMic
}) => {
  const [input, setInput] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [crystalState, setCrystalState] = useState<CrystalState>('idle');
  const [crystalEmotion, setCrystalEmotion] = useState<CrystalEmotion>('neutral');
  
  const { isListening: wakeWordActive, startListening, stopListening, hasPermission } = useWakeWord(() => {
    // Wake word detected! Set crystal to listening
    setCrystalState('listening');
    onVoiceInputToggle(); // Turn on actual mic input for Gemini or display prompt
  });

  // Manage wake word explicitly based on a setting, default on
  const [ambientEnabled, setAmbientEnabled] = useState(true);

  useEffect(() => {
    if (ambientEnabled && !isListeningMic && hasPermission !== false && !wakeWordActive) {
      startListening();
    } else if (!ambientEnabled || isListeningMic) {
      stopListening();
    }
  }, [ambientEnabled, isListeningMic, hasPermission, wakeWordActive, startListening, stopListening]);

  // Sync state
  useEffect(() => {
    if (isAnalyzing) setCrystalState('thinking');
    else if (isSpeaking) {
      setCrystalState('speaking');
      // Simulate audio level for speaking pulse
      const audioInterval = setInterval(() => {
        setAudioLevel(0.2 + Math.random() * 0.8);
      }, 100);
      return () => {
        clearInterval(audioInterval);
        setAudioLevel(0);
      };
    } else if (isListeningMic) setCrystalState('listening');
    else setCrystalState('idle');
  }, [isAnalyzing, isSpeaking, isListeningMic]);

  // Determine emotion based on recent messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'model') {
      const text = lastMessage.content.toLowerCase();
      if (text.includes('error') || text.includes('failed') || text.includes('urgent')) {
        setCrystalEmotion('urgency');
      } else if (text.includes('create') || text.includes('design') || text.includes('imagine')) {
        setCrystalEmotion('creative');
      } else if (text.includes('analyze') || text.includes('data') || text.includes('system') || text.includes('scan')) {
        setCrystalEmotion('analytical');
      } else {
        setCrystalEmotion('neutral');
      }
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col font-sans overflow-hidden z-[100]">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none">
      </div>

        {/* Top bar controls */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button 
          onClick={() => setAmbientEnabled(!ambientEnabled)}
          className={cn(
            "p-3 rounded-full backdrop-blur-md border border-white/10 transition-colors flex items-center justify-center relative group",
            ambientEnabled && wakeWordActive ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400" : "bg-white/5 hover:bg-white/10 text-white/70"
          )}
          title="Ambient Voice Trigger (Wake Word)"
        >
          {ambientEnabled && wakeWordActive && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          )}
          <Mic size={18} />
          {ambientEnabled && wakeWordActive && <span className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] uppercase tracking-widest text-emerald-400 font-bold whitespace-nowrap bg-black/80 px-2 py-1 rounded-md border border-emerald-500/30">Listening for "Okay Saphira"</span>}
          {(!ambientEnabled || !wakeWordActive) && <span className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] uppercase tracking-widest text-white/50 font-bold whitespace-nowrap bg-black/80 px-2 py-1 rounded-md border border-white/10">Ambient Trigger Off</span>}
        </button>
        <button 
          onClick={onOpenDashboard}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md border border-white/10 transition-colors"
          title="Open Dashboard"
        >
          <Maximize2 size={18} className="text-white/70" />
        </button>
      </div>

      <div className="flex-1 flex flex-col relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-8 pt-12 pb-4">
        
        {/* Crystal Orb Container */}
        <div className="h-[40vh] min-h-[300px] flex items-center justify-center shrink-0 perspective-1000">
          <SaphiraCrystal 
            state={crystalState} 
            emotion={crystalEmotion} 
            audioLevel={audioLevel}
            onClick={() => {
              if (crystalState === 'idle') onVoiceInputToggle();
            }}
          />
        </div>

        {/* State readout */}
        <div className="text-center mb-8 shrink-0 h-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={crystalState}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs uppercase tracking-[0.2em] text-white/50 font-mono"
            >
              {crystalState === 'idle' && (wakeWordActive ? 'Standing by. Say "Okay Saphira"' : 'Standing by')}
              {crystalState === 'listening' && 'Listening...'}
              {crystalState === 'thinking' && 'Processing intent...'}
              {crystalState === 'speaking' && 'Synthesizing response...'}
              {crystalState === 'error' && 'System anomaly'}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto min-h-[200px] rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/5 p-4 sm:p-6 mb-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center opacity-40">
              <p className="text-sm">Initiate voice protocol or type a command.</p>
            </div>
          ) : (
            messages.map(msg => (
              <motion.div 
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={msg.id} 
                className={cn(
                  "max-w-[85%] rounded-2xl p-4",
                  msg.role === 'user' 
                    ? "bg-white/10 text-white self-end rounded-br-sm" 
                    : "bg-transparent text-white/80 self-start"
                )}
              >
                {msg.role !== 'user' && (
                  <div className="text-[10px] uppercase tracking-wider text-amber-400 font-bold mb-1">
                    Scorpion
                  </div>
                )}
                <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="shrink-0">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Direct input to Scorpion..."
              className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 pr-24 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/30 focus:bg-white/10 transition-all"
            />
            <div className="absolute right-2 flex gap-1">
              <button
                type="button"
                onClick={onVoiceInputToggle}
                className={cn(
                  "p-3 rounded-full transition-colors flex items-center justify-center",
                  isListeningMic ? "bg-pink-500/20 text-pink-400" : "hover:bg-white/10 text-white/50"
                )}
              >
                <Mic size={18} />
              </button>
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
