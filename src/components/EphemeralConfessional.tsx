import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Heart, Clock, Flame, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../services/soundFx';
import { fetchComfortingResponse } from '../services/gemini';

interface EphemeralConfessionalProps {
  onCompleteRest: () => void;
  batteryLowTriggered?: boolean;
}

export const EphemeralConfessional: React.FC<EphemeralConfessionalProps> = ({
  onCompleteRest,
  batteryLowTriggered = false,
}) => {
  const [ventText, setVentText] = useState('');
  const [isReleased, setIsReleased] = useState(false);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [comfortResponse, setComfortResponse] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(8);
  const [isDissolving, setIsDissolving] = useState(false);

  // Timer refs to prevent memory leaks
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dissolveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Play sanctuary audio on enter
  useEffect(() => {
    soundFx.playSanctuaryEnter();
  }, []);

  const handleRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ventText.trim() && !isReleased) return;

    const capturedVent = ventText;
    setVentText('');
    setIsReleased(true);
    setIsLoadingResponse(true);

    try {
      const response = await fetchComfortingResponse(capturedVent);
      setComfortResponse(response);
      setIsLoadingResponse(false);
      startDissolveCountdown();
    } catch (err) {
      setComfortResponse('You have carried enough for today. It is completely safe to put down the weight.');
      setIsLoadingResponse(false);
      startDissolveCountdown();
    }
  };

  const startDissolveCountdown = () => {
    setSecondsRemaining(8);

    countdownIntervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Exactly 8 seconds after response appears, trigger CSS dissolve animation & audio
    dissolveTimeoutRef.current = setTimeout(() => {
      setIsDissolving(true);
      soundFx.playVoidDissolve();

      // Give 2 seconds for the CSS dissolve animation to fade completely into black, then move to STATE 3
      transitionTimeoutRef.current = setTimeout(() => {
        onCompleteRest();
      }, 1900);
    }, 8000);
  };

  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (dissolveTimeoutRef.current) clearTimeout(dissolveTimeoutRef.current);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  return (
    <div 
      className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[520px]"
      id="ephemeral-confessional-container"
    >
      <AnimatePresence mode="wait">
        {!isReleased ? (
          /* Sanctuary Venting Input Screen */
          <motion.div
            key="vent-input"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            {/* Moody RPG Safe Zone Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-pixel bg-neutral-900 border border-purple-500/30 text-purple-300 mb-3 shadow-inner">
                <Moon className="w-3.5 h-3.5 text-purple-400" />
                VOID SANCTUARY • SAFE ZONE (NO HP LOSS)
              </div>

              {batteryLowTriggered && (
                <div className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-xl text-xs font-pixel bg-rose-950/70 border border-rose-800/60 text-rose-300 mb-3 mx-auto w-fit">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  STAMINA {'<'} 15% • EMERGENCY SAFETY TRIGGER
                </div>
              )}

              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-100 mb-2">
                It is okay to be frustrated.
              </h1>
              <p className="text-sm sm:text-base text-neutral-400 max-w-md mx-auto leading-relaxed">
                Vent here. Nothing is saved, stored, or sent to a database.
              </p>
            </div>

            {/* Venting Form */}
            <form onSubmit={handleRelease} className="space-y-4">
              <div className="relative">
                <div className="absolute top-3 left-4 text-[10px] font-pixel text-rose-400 uppercase tracking-wider">
                  {'>'} DISCARD MENTAL DEBUFFS:
                </div>
                <textarea
                  id="vent-textarea"
                  rows={6}
                  value={ventText}
                  onChange={(e) => setVentText(e.target.value)}
                  placeholder='Dump everything here. Rage, exhaustion, brain fog, guilt, tears... let it exist without judgment.'
                  className="w-full pt-8 pb-4 px-5 text-base sm:text-lg bg-neutral-900/90 border-2 border-neutral-800 focus:border-rose-500/60 rounded-2xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 resize-none transition-all shadow-inner leading-relaxed font-sans"
                  autoFocus
                />

                <div className="flex items-center justify-between text-xs text-neutral-400 mt-2 px-1 font-mono">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                    Zero-storage ephemeral memory
                  </span>
                  <span>{ventText.length} chars</span>
                </div>
              </div>

              {/* Release Button with incinerate flare */}
              <div className="pt-2">
                <button
                  id="release-vent-btn"
                  type="submit"
                  disabled={!ventText.trim()}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 active:opacity-90 disabled:opacity-30 disabled:pointer-events-none text-neutral-950 font-pixel text-sm sm:text-base font-bold rounded-2xl transition-all cursor-pointer shadow-lg shadow-rose-950/40"
                >
                  <Flame className="w-5 h-5 fill-neutral-950" />
                  <span>
                    INCINERATE IN THE VOID (RELEASE)
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* Released State: Comforting Response + 8s Dissolve Trick */
          <motion.div
            key="vent-response"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col items-center"
          >
            {/* 8s Countdown HUD */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs font-pixel text-neutral-200 mb-6 shadow">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span>
                VOID DISSOLUTION IN:{' '}
                <strong className="text-amber-300 text-sm">{secondsRemaining}s</strong>
              </span>
            </div>

            {/* The Comforting Card Container */}
            <div 
              id="comfort-response-container"
              className={`w-full p-8 sm:p-10 rounded-3xl bg-neutral-900/70 border-2 border-neutral-800 relative overflow-hidden transition-all duration-1000 ${
                isDissolving ? 'animate-dissolve' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-4 text-xs font-bold font-pixel uppercase tracking-widest text-teal-400">
                <Heart className="w-4 h-4 fill-teal-400/20 text-teal-400" />
                <span>SANCTUARY BLESSING</span>
              </div>

              {isLoadingResponse ? (
                <div className="py-10 text-center font-pixel text-xs text-neutral-400 animate-pulse">
                  Listening softly and absorbing the burden...
                </div>
              ) : (
                <div id="comfort-text-body">
                  <p className="text-xl sm:text-2xl font-normal leading-relaxed text-neutral-100">
                    "{comfortResponse}"
                  </p>

                  <div className="mt-6 flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-800/80 pt-4 font-mono">
                    <span>Zero traces retained</span>
                    <span className="italic">Ephemeral void protocol</span>
                  </div>
                </div>
              )}
            </div>

            {/* Explanation of the dissolve trick */}
            <p className="text-xs text-neutral-400 text-center mt-6 max-w-md font-mono">
              Exactly 8 seconds after reading, the text evaporates into the dark so your words cease to exist.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

