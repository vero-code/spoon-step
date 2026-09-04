import { AnimatePresence, motion } from 'motion/react';
import { Utensils } from 'lucide-react';

interface SpoonTheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SpoonTheoryModal({ isOpen, onClose }: SpoonTheoryModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-neutral-900 border-2 border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-pixel text-neutral-100">
                  Game Lore: Spoon Theory
                </h3>
                <p className="text-xs text-neutral-400 font-mono">
                  Neuroscience translated into RPG mechanics
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-neutral-300 leading-relaxed font-sans">
              <p>
                <strong className="text-neutral-100 font-pixel text-xs text-teal-300 block mb-1">
                  1. Stamina Points (20 Spoons):
                </strong>
                Christine Miserandino’s Spoon Theory: every spoon is a unit of cognitive stamina. People with neurodivergence or chronic illness wake up with a finite battery.
              </p>
              <p>
                <strong className="text-neutral-100 font-pixel text-xs text-teal-300 block mb-1">
                  2. Single Objective Scaffold:
                </strong>
                Long to-do lists cause executive freeze. SpoonStep renders strictly one atomic micro-step at a time.
              </p>
              <p>
                <strong className="text-neutral-100 font-pixel text-xs text-teal-300 block mb-1">
                  3. Void Sanctuary (8s Dissolve):
                </strong>
                If stamina drops '&lt; 15%' or you retreat, safe zone triggers. Your vent dissolves into the void after 8 seconds with zero data persistence.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-end">
              <button
                id="close-theory-modal-btn"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-neutral-950 font-pixel font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md"
              >
                RETURN TO QUEST
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
