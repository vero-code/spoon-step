import React from 'react';
import { Sparkles, Utensils, Shield } from 'lucide-react';

interface BrainBatteryProps {
  battery: number; // 0 to 100
  isDepleted: boolean;
}

export const BrainBattery: React.FC<BrainBatteryProps> = ({ battery }) => {
  const totalSpoons = 20;
  const activeSpoons = Math.max(0, Math.round(battery / 5));

  // Color based on battery level
  const getBatteryColor = () => {
    if (battery > 60) return {
      bar: 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400',
      text: 'text-emerald-400',
      glow: 'shadow-[0_0_24px_rgba(16,185,129,0.25)]',
      label: 'Optimal Mana',
      border: 'border-emerald-500/40',
      tagBg: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
    };
    if (battery > 25) return {
      bar: 'bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-400',
      text: 'text-amber-400',
      glow: 'shadow-[0_0_24px_rgba(245,158,11,0.25)]',
      label: 'Stamina Depleting',
      border: 'border-amber-500/40',
      tagBg: 'bg-amber-950/60 text-amber-300 border-amber-800/60'
    };
    return {
      bar: 'bg-gradient-to-r from-rose-600 via-red-500 to-amber-500',
      text: 'text-rose-400',
      glow: 'shadow-[0_0_30px_rgba(225,29,72,0.4)]',
      label: 'Critical Debuff (<15%)',
      border: 'border-rose-500/50',
      tagBg: 'bg-rose-950/70 text-rose-300 border-rose-800/70'
    };
  };

  const theme = getBatteryColor();

  return (
    <header className="w-full max-w-2xl mx-auto px-4 pt-4 pb-2" id="brain-battery-header">
      <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 shadow-md mb-3">
        {/* Left: Player Avatar  */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-teal-500/40 flex items-center justify-center text-teal-300 shadow-inner">
              <Shield className="w-5 h-5 text-teal-400" />
              {/* TODO: Add level */}
            </div>
          </div>

          {/* TODO: Add player title and XP bar */}
        </div>

        {/* Right: Spoons Tokens Counter */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5">
              <Utensils className="w-4 h-4 text-teal-400" />
              <span className="font-pixel text-xs font-bold text-neutral-100">
                {activeSpoons}/{totalSpoons}
              </span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-mono">
                spoons
              </span>
            </div>
            <div className={`text-[10px] font-medium px-2 py-0.5 rounded-full border mt-1 inline-block ${theme.tagBg}`}>
              {theme.label}
            </div>
          </div>
        </div>
      </div>

      {/* Main Stamina */}
      <div className="relative">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider mb-1.5 px-1 font-pixel text-neutral-300">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            COGNITIVE STAMINA (HP)
          </span>
          <span className={`text-base font-mono font-bold ${theme.text}`}>
            {battery}%
          </span>
        </div>

        {/* Outer Game Border */}
        <div 
          className={`relative w-full h-7 bg-neutral-950 border-2 ${theme.border} rounded-xl overflow-hidden p-1 ${theme.glow} transition-all duration-500`}
          role="progressbar"
          aria-valuenow={battery}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Cognitive Stamina Bar"
        >
          {/* 20 Segments for Spoons */}
          <div className="absolute inset-0 grid grid-cols-20 pointer-events-none z-10 px-1 py-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="border-r border-black/40 h-full last:border-r-0" />
            ))}
          </div>

          {/* Critical Threshold Indicator at 15% (3 spoons) */}
          <div 
            className="absolute top-0 bottom-0 left-[15%] w-[2px] bg-rose-500/80 z-20 pointer-events-none shadow-[0_0_8px_rgba(244,63,94,0.8)]"
            title='Auto-vent trigger threshold (15%)'
          />

          {/* Filled Stamina Bar with Gloss effect */}
          <div
            className={`h-full rounded-lg ${theme.bar} transition-all duration-700 ease-out relative overflow-hidden`}
            style={{ width: `${Math.max(0, Math.min(100, battery))}%` }}
          >
            {/* Gloss highlight streak */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-lg pointer-events-none" />
          </div>
        </div>

        {/* Rules of the Game */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-1.5 px-1 font-mono">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-teal-400" />
            -1 Spoon (-5% HP) per micro-step
          </span>
          <span className={battery <= 15 ? 'text-rose-400 font-bold' : 'text-neutral-400'}>
            ⚡ Auto-vent triggered at &lt;15%
          </span>
        </div>
      </div>
    </header>
  );
};

