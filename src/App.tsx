import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SpoonTheoryModal } from './components/SpoonTheoryModal';
import { ActionManager } from './components/ActionManager.tsx';
import { BrainBattery } from './components/BrainBattery.tsx';
import type { AppState } from './types';
import { soundFx } from './services/soundFx';
import { decomposeTaskWithGemini } from './services/gemini';
import { AnimatePresence, motion } from 'motion/react';

function App() {
  const [appState, setAppState] = useState<AppState>('ACTION');
  const [battery, setBattery] = useState<number>(100);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Task session state
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<string>('');
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isLoadingStep, setIsLoadingStep] = useState<boolean>(false);
  const [stepsCompleted, setStepsCompleted] = useState<number>(0);
  const [questSteps, setQuestSteps] = useState<string[]>([]);

  const [showTheoryModal, setShowTheoryModal] = useState<boolean>(false);

  const toggleSound = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    soundFx.isMuted = nextState;
  };

  // Start micro-tasking / quest
  const handleStartTask = async (task: string) => {
    soundFx.playQuestStart();
    setTaskName(task);
    setIsStarted(true);
    setStepIndex(0);
    setIsLoadingStep(true);

    try {
      // Request to Gemini
      const steps = await decomposeTaskWithGemini(task);
      setQuestSteps(steps);
      setCurrentStep(steps[0]);
    } catch (error) {
      console.error('Gemini error:', error);
      alert('Error: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsLoadingStep(false);
    }
  };

  // Reset entire application for hackathon testing
  const handleResetApp = () => {
    setAppState('ACTION');
    setBattery(100);
    setIsStarted(false);
    setTaskName('');
    setCurrentStep('');
    setStepIndex(0);
    setStepsCompleted(0);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-teal-500/30 selection:text-teal-200">
      <Header
        onOpenTheoryModal={() => setShowTheoryModal(true)}
        toggleSound={toggleSound}
        isMuted={isMuted}
        isStarted={isStarted}
        handleResetApp={handleResetApp}
      />

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
                  isStarted={isStarted}
                  taskName={taskName}
                  currentStep={currentStep}
                  stepIndex={stepIndex}
                  isLoadingStep={isLoadingStep}
                  onStartTask={handleStartTask}
                  questSteps={questSteps}
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
