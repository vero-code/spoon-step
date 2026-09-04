import React, { useState } from 'react';
import {
  ArrowRight,
  Swords,
  Scroll,
  Compass,
  Loader2,
  Check,
  HeartHandshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ActionManagerProps {
  isStarted: boolean;
  taskName: string;
  currentStep: string;
  stepIndex: number;
  isLoadingStep: boolean;
  onStartTask: (task: string) => void;
  questSteps: string[];
  onCompleteStep?: () => void;
  onOverwhelmed?: () => void;
}

export const ActionManager: React.FC<ActionManagerProps> = ({
  isStarted,
  taskName,
  currentStep,
  stepIndex,
  isLoadingStep,
  onStartTask,
  questSteps,
  onCompleteStep,
  onOverwhelmed,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showRoadmap, setShowRoadmap] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onStartTask(inputValue.trim());
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[500px] relative" id="action-manager-container">
      <AnimatePresence mode="wait">
        {!isStarted ? (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="text-center mb-7">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-pixel bg-neutral-900 border border-teal-500/30 text-teal-300 mb-3 shadow-sm">
                <Scroll className="w-3.5 h-3.5 text-teal-400" />
                QUEST LOG REGISTRATION
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-100 mb-2">
                What do you need to do?
              </h1>
              <p className="text-sm sm:text-base text-neutral-400 max-w-lg mx-auto leading-relaxed">
                Type your task and I'll break it down into single atomic micro-steps.
              </p>
            </div>

            {/* Input form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute top-3 left-4 text-[10px] font-pixel text-teal-400 uppercase tracking-wider">
                  &gt; QUEST OBJECTIVE:
                </div>
                <input
                  id="task-input"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="e.g., Clean the kitchen, reply to urgent emails..."
                  className="w-full pt-8 pb-4 px-5 text-base sm:text-lg bg-neutral-900/90 border-2 border-neutral-800 focus:border-teal-500 rounded-2xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all shadow-inner font-sans"
                  autoFocus
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  id="start-task-btn"
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-full flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 active:opacity-90 disabled:opacity-40 disabled:pointer-events-none text-neutral-950 font-pixel text-sm sm:text-base font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-teal-500/20"
                >
                  <Swords className="w-5 h-5" />
                  <span>START MICRO-QUEST</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* STATE 1 - Action Mode (Single Micro-Step Quest Terminal) */
          <motion.div
            key={`step-${stepIndex}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full flex flex-col items-center"
          >
            {/* Quest Banner */}
            <div className="w-full flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800 mb-4 text-xs">
              <div className="flex items-center gap-2 text-neutral-300 truncate max-w-[280px] sm:max-w-md">
                <Compass className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="font-pixel text-[11px] text-teal-400 uppercase">
                  QUEST:
                </span>
                <span className="truncate font-medium text-neutral-200">{taskName}</span>
              </div>
              <div className="flex items-center gap-2 font-pixel text-[11px] ml-auto">
                <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-teal-300">
                  {`STEP #${stepIndex + 1}`}
                </span>
                <span className="text-amber-400">+50 XP</span>
              </div>
            </div>

            {/* Single Micro-Step Focus Card */}
            <div 
              id="micro-step-card"
              className="w-full p-6 sm:p-10 rounded-3xl bg-neutral-900/80 border-2 border-neutral-800 shadow-2xl relative overflow-hidden text-center mb-6 flex flex-col justify-center min-h-[220px]"
            >
              {/* Corner RPG Accents */}
              <div className="absolute top-3 left-4 text-[10px] uppercase font-pixel tracking-widest text-teal-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 bg-teal-400 rounded-sm animate-pulse" />
                CURRENT OBJECTIVE
              </div>

              <div className="absolute top-3 right-4 text-[10px] font-pixel text-neutral-400">
                REWARD: +50 XP
              </div>

              {isLoadingStep ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
                  <span className="text-xs font-pixel text-neutral-400">
                    Generating next micro-action...
                  </span>
                </div>
              ) : (
                <div className="my-auto py-2">
                  <p 
                    id="current-step-text"
                    className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-50 leading-snug"
                  >
                    {currentStep}
                  </p>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-4 max-w-md mx-auto">
                    Nothing else matters right now. Just this one movement.
                  </p>
                </div>
              )}
            </div>

            {/* TODO: Action Buttons */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Primary: 'I did it!' */}
              <button
                id="i-did-it-btn"
                type="button"
                onClick={onCompleteStep}
                disabled={isLoadingStep}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 active:scale-[0.99] text-neutral-950 font-pixel text-sm sm:text-base font-bold rounded-2xl transition-all shadow-lg shadow-teal-500/20 cursor-pointer disabled:opacity-50"
              >
                <Check className="w-6 h-6 stroke-[3]" />
                <span>I DID IT! (+50 XP)</span>
              </button>

              {/* Secondary/Muted: 'I'm overwhelmed...' */}
              <button
                id="im-overwhelmed-btn"
                type="button"
                onClick={onOverwhelmed}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-neutral-900 hover:bg-neutral-850 active:bg-neutral-800 text-neutral-300 hover:text-neutral-100 border border-neutral-800 hover:border-rose-500/40 rounded-2xl font-medium text-sm sm:text-base transition-all cursor-pointer"
              >
                <HeartHandshake className="w-5 h-5 text-rose-400" />
                <span>I'm overwhelmed... (Sanctuary)</span>
              </button>
            </div>

            {/* Show Roadmap */}
            {questSteps && questSteps.length > 0 && (
              <div className="w-full">
                <button
                  type="button"
                  onClick={() => setShowRoadmap(!showRoadmap)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-teal-300 transition-colors cursor-pointer text-xs font-mono"
                >
                  <span className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-teal-400" />
                    <span>View Full Quest Roadmap ({questSteps.length} steps from Gemini)</span>
                  </span>
                  <span>{showRoadmap ? '▲ Hide' : '▼ Show'}</span>
                </button>
                {/* Show All Steps */}
                {showRoadmap && (
                  <div className="mt-2 p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2 text-left">
                    <div className="text-[10px] font-pixel text-teal-400 uppercase tracking-wider mb-2">
                      Full Decomposed Step Sequence:
                    </div>
                    {questSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className={`text-xs p-2.5 rounded-lg flex items-start gap-2.5 transition-all ${
                          idx === stepIndex
                            ? 'bg-teal-500/20 text-teal-200 border border-teal-500/40 font-medium'
                            : idx < stepIndex
                            ? 'text-neutral-500 line-through bg-neutral-950/40'
                            : 'text-neutral-400 bg-neutral-950/20'
                        }`}
                      >
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 shrink-0">
                          #{idx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                        {idx === stepIndex && (
                          <span className="ml-auto text-[10px] font-pixel text-teal-400 uppercase shrink-0">
                            [CURRENT]
                          </span>
                        )}
                        {idx < stepIndex && (
                          <span className="ml-auto text-[10px] font-pixel text-neutral-500 uppercase shrink-0">
                            [DONE]
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="text-xs text-neutral-400 mt-3.5 text-center font-mono">
              Completing a step consumes 1 spoon (-5% HP) and grants +50 XP. If overwhelmed, tap retreat anytime.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

