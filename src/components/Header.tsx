import {
  Swords,
  Info,
  Volume2,
  VolumeX,
  RefreshCw
} from 'lucide-react';

interface HeaderProps {
  onOpenTheoryModal: () => void;
  isMuted?: boolean;
  toggleSound: () => void;
  isStarted: boolean;
  handleResetApp: () => void;
}

export function Header({
  onOpenTheoryModal,
  isMuted = false,
  toggleSound,
  isStarted,
  handleResetApp
}: HeaderProps) {
  return (
    <header className="w-full border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-neutral-950 font-bold shadow-md shadow-teal-500/20">
            <img
              src="/favicon.svg"
              alt="SpoonStep Logo"
              className="w-8 h-8 rounded-xl shadow-md shadow-teal-500/30 object-contain hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight font-pixel text-neutral-100">SpoonStep</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-500/10 border border-teal-500/30 text-teal-300 font-pixel">
                RPG
              </span>
            </div>
            <span className="hidden sm:inline-block text-[10px] text-neutral-400 font-mono">
              Executive Scaffold & Spoon Theory Game
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* TODO: API Key */}

          {/* Audio Sfx Toggle */}
          <button
            id="audio-toggle-btn"
            onClick={toggleSound}
            title={isMuted ? 'Enable 8-bit sound' : 'Mute sound effects'}
            className="p-2 text-neutral-400 hover:text-neutral-200 bg-neutral-900 hover:bg-neutral-850 rounded-xl border border-neutral-800 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-teal-400" />}
          </button>

          {/* Quick reset button */}
          {isStarted && (
            <button
              id="header-restart-btn"
              onClick={handleResetApp}
              title="Restart demo with full battery"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-pixel text-neutral-400 hover:text-neutral-200 bg-neutral-900 hover:bg-neutral-850 rounded-xl border border-neutral-800 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}

          {/* Spoon Theory info */}
          <button
            id="spoon-theory-info-btn"
            onClick={onOpenTheoryModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-pixel text-neutral-300 hover:text-teal-300 bg-neutral-900 hover:bg-neutral-850 rounded-xl border border-neutral-800 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Game Lore</span>
          </button>
        </div>
      </div>
    </header>
  );
}
