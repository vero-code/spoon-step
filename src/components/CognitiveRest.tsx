import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, EyeOff, Coffee, ShieldCheck, Flame, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { soundFx } from '../services/soundFx';

interface CognitiveRestProps {
  onResetApp: () => void;
}

export const CognitiveRest: React.FC<CognitiveRestProps> = ({ onResetApp }) => {
  // 20-minute screen break timer (20 * 60 = 1200 seconds)
  const [secondsLeft, setSecondsLeft] = useState(20 * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');

  useEffect(() => {
    soundFx.playRestChime();
  }, []);

  // 20-minute countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft]);

  // Guided 16-second box breathing cycle (4s Inhale, 4s Hold, 4s Exhale, 4s Rest)
  useEffect(() => {
    const phases: Array<'Inhale' | 'Hold' | 'Exhale' | 'Rest'> = ['Inhale', 'Hold', 'Exhale', 'Rest'];
    let currentIdx = 0;

    const breathInterval = setInterval(() => {
      currentIdx = (currentIdx + 1) % phases.length;
      setBreathPhase(phases[currentIdx]);
    }, 4000);

    return () => clearInterval(breathInterval);
  }, []);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathLabel = () => {
    switch (breathPhase) {
      case 'Inhale': return 'Inhale';
      case 'Hold': return 'Hold';
      case 'Exhale': return 'Exhale';
      case 'Rest': return 'Rest';
    }
  };

  return (
    <div 
      className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[520px] text-center"
      id="cognitive-rest-container"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full flex flex-col items-center"
      >
        {/* Bonfire Camp Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-pixel bg-neutral-900 border border-amber-500/40 text-amber-300 mb-5 shadow-sm">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          <span>CAMPFIRE INN • COGNITIVE RECOVERY</span>
        </div>

        {/* Core Heading required by prompt */}
        <h1 
          id="cognitive-rest-heading"
          className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-100 mb-2 font-pixel"
        >
          Breathe.
        </h1>
        <p className="text-lg sm:text-2xl text-teal-400 font-semibold mb-2 font-pixel">
          Take a 20-minute screen break.
        </p>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed mb-6 font-mono">
          All inputs are hidden. Your brain has reached its limit. Rest is not a reward—it is essential maintenance.
        </p>

        {/* Guided Breathing Visual Ring (RPG Aura / Mana Orb) */}
        <div className="relative my-3 flex items-center justify-center w-52 h-52">
          {/* Pulsing outer aura */}
          <div 
            className={`absolute inset-0 rounded-full bg-teal-500/10 border border-teal-500/20 transition-transform duration-[4000ms] ease-in-out ${
              breathPhase === 'Inhale' || breathPhase === 'Hold' ? 'scale-125' : 'scale-90'
            }`} 
          />

          {/* Central Breathing Ring */}
          <div 
            className={`w-36 h-36 rounded-full border-2 border-teal-400/50 bg-neutral-950 flex flex-col items-center justify-center shadow-xl shadow-teal-950/40 transition-transform duration-[4000ms] ease-in-out ${
              breathPhase === 'Inhale' || breathPhase === 'Hold' ? 'scale-110 border-teal-400 shadow-[0_0_25px_rgba(20,184,166,0.35)]' : 'scale-95 border-teal-500/30'
            }`}
          >
            <span className="text-[10px] font-pixel uppercase tracking-widest text-teal-400">
              BOX BREATHING
            </span>
            <span className="text-xl font-bold font-pixel text-neutral-100 mt-1">
              {getBreathLabel()}
            </span>
            <span className="text-[11px] text-teal-300 font-mono mt-0.5">
              4 sec
            </span>
          </div>
        </div>

        {/* 20-Minute Break Clock (Retro Timer HUD) */}
        <div className="mt-4 flex flex-col items-center">
          <div className="text-3xl sm:text-4xl font-mono font-bold tracking-wider text-teal-300 drop-shadow-[0_0_12px_rgba(20,184,166,0.3)]">
            {formatTime(secondsLeft)}
          </div>
          <div className="flex items-center gap-2.5 mt-3">
            <button
              id="timer-toggle-btn"
              type="button"
              onClick={() => setIsRunning(!isRunning)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs font-pixel text-neutral-300 transition-colors cursor-pointer"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? 'Pause' : 'Resume'}</span>
            </button>
            <button
              id="timer-reset-btn"
              type="button"
              onClick={() => setSecondsLeft(20 * 60)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs font-pixel text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset 20m</span>
            </button>
          </div>
        </div>

        {/* Camp Passive Buffs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg mt-7 text-left">
          <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-pixel mb-1">
              <EyeOff className="w-4 h-4" />
              <span>Rest Eyes</span>
            </div>
            <p className="text-xs text-neutral-400 font-mono">
              Look 20 feet away to dispel vision strain.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-pixel mb-1">
              <Coffee className="w-4 h-4" />
              <span>Hydrate</span>
            </div>
            <p className="text-xs text-neutral-400 font-mono">
              Drink water without looking at screens.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-pixel mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero Guilt</span>
            </div>
            <p className="text-xs text-neutral-400 font-mono">
              Executive fatigue is physical, not laziness.
            </p>
          </div>
        </div>

        {/* Full Recharge & New Expedition Button */}
        <div className="mt-8 pt-5 border-t border-neutral-900 w-full max-w-md">
          <button
            id="reset-spoon-battery-btn"
            type="button"
            onClick={onResetApp}
            className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-neutral-950 font-pixel text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-lg shadow-teal-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>RESTORE 20 SPOONS (100% HP) & NEW QUEST</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

