import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SpoonTheoryModal } from './components/SpoonTheoryModal';
import { ActionManager } from './components/ActionManager.tsx';
import { BrainBattery } from './components/BrainBattery.tsx';
import type { AppState } from './types';
import { AnimatePresence, motion } from 'motion/react';

function App() {
  const [appState, setAppState] = useState<AppState>('ACTION');
  const [battery, setBattery] = useState<number>(100);
  const [showTheoryModal, setShowTheoryModal] = useState<boolean>(false);

  // Start micro-tasking / quest
  const handleStartTask = async (task: string) => {
    console.log(task);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-teal-500/30 selection:text-teal-200">
      <Header onOpenTheoryModal={() => setShowTheoryModal(true)} />

      <main className="flex-1 flex flex-col justify-start w-full max-w-4xl mx-auto px-4 pt-3 pb-12">
        <BrainBattery 
          battery={battery} 
          isDepleted={battery < 15 || appState === 'REST'}
        />

        {/* State View Switcher */}
        <div className="flex-1 flex items-center justify-center w-full mt-2">
          <AnimatePresence mode="wait">
            {appState === 'ACTION' && (
              <motion.div
                key="state-action"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <ActionManager
                  onStartTask={handleStartTask}
                />
              </motion.div>
            )}

            {/* Venting */}
            {/* Rest */}
          </AnimatePresence>
        </div>
      </main>

      <Footer />

      <SpoonTheoryModal
        isOpen={showTheoryModal}
        onClose={() => setShowTheoryModal(false)}
      />
    </div>
  )
}

export default App;
