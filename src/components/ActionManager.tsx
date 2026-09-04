import React, { useState } from 'react';
import { ArrowRight, Swords, Scroll } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ActionManagerProps {
  onStartTask: (task: string) => void;
}

export const ActionManager: React.FC<ActionManagerProps> = ({
  onStartTask,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onStartTask(inputValue.trim());
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[500px] relative" id="action-manager-container">
      <AnimatePresence mode="wait">
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
        
      </AnimatePresence>
    </div>
  );
};

