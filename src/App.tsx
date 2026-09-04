import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SpoonTheoryModal } from './components/SpoonTheoryModal';
import { ActionManager } from './components/ActionManager.tsx';
import { BrainBattery } from './components/BrainBattery.tsx';
import { EphemeralConfessional } from './components/EphemeralConfessional.tsx';
import { CognitiveRest } from './components/CognitiveRest.tsx';
import type { AppState, GamePlayerStats, FloatingReward } from './types';
import { soundFx } from './services/soundFx';
import { decomposeTaskWithGemini } from './services/gemini';
import { AnimatePresence, motion } from 'motion/react';

const STORAGE_KEY = 'spoon_quest_session';

function App() {
  const [appState, setAppState] = useState<AppState>('ACTION');
  const [battery, setBattery] = useState<number>(100);
  const [batteryTriggeredVent, setBatteryTriggeredVent] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Game progression state
  const [xp, setXp] = useState<number>(0);
  const [comboStreak, setComboStreak] = useState<number>(0);
  const [floatingRewards, setFloatingRewards] = useState<FloatingReward[]>([]);

  // Task session state
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [taskName, setTaskName] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<string>('');
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isLoadingStep, setIsLoadingStep] = useState<boolean>(false);
  const [stepsCompleted, setStepsCompleted] = useState<number>(0);
  const [questSteps, setQuestSteps] = useState<string[]>([]);

  const [showTheoryModal, setShowTheoryModal] = useState<boolean>(false);

  // 1. Load state from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.isStarted && data.questSteps?.length > 0) {
          setIsStarted(true);
          setTaskName(data.taskName || '');
          setQuestSteps(data.questSteps || []);
          setCurrentStep(data.currentStep || data.questSteps[data.stepIndex || 0] || '');
          setStepIndex(data.stepIndex || 0);
          setBattery(data.battery ?? 100);
          setStepsCompleted(data.stepsCompleted || 0);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // 2. Save state to localStorage on every change
  useEffect(() => {
    if (isStarted && questSteps.length > 0) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ isStarted, taskName, questSteps, currentStep, stepIndex, stepsCompleted, battery })
      );
    } else if (!isStarted) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [isStarted, taskName, questSteps, currentStep, stepIndex, stepsCompleted, battery]);

  // Calculate Level and Title
  const getPlayerStats = (): GamePlayerStats => {
    let level = 1;
    let title = 'Spoon Novice';

    if (xp >= 500) {
      level = 4;
      title = 'Grandmaster of Focus';
    } else if (xp >= 300) {
      level = 3;
      title = 'Cognitive Paladin';
    } else if (xp >= 150) {
      level = 2;
      title = 'Spoon Adept';
    }

    const xpToNextLevel = level === 1 ? 150 : level === 2 ? 300 : 500;

    return {
      level,
      xp,
      xpToNextLevel,
      comboStreak,
      title,
      spoonsRemaining: Math.max(0, Math.round(battery / 5)),
      totalSpoons: 20
    };
  };

  const triggerFloatingReward = (text: string, subText?: string) => {
    const newReward: FloatingReward = {
      id: Date.now() + Math.random(),
      text,
      subText,
      type: 'xp'
    };
    setFloatingRewards((prev) => [...prev, newReward]);
    setTimeout(() => {
      setFloatingRewards((prev) => prev.filter((r) => r.id !== newReward.id));
    }, 1200);
  };

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

  // 'I did it!' handler
  const handleCompleteStep = async () => {
    soundFx.playStepSuccess();
    const nextBattery = Math.max(0, battery - 5);
    setBattery(nextBattery);
    setStepsCompleted((prev) => prev + 1);

    const nextStreak = comboStreak + 1;
    setComboStreak(nextStreak);
    setXp((prev) => prev + 50);

    triggerFloatingReward(
      '+50 XP',
      nextStreak > 1 ? `${nextStreak}x COMBO!` : '🥄 -1 Spoon'
    );

    // If battery drops below 15%
    if (nextBattery < 15) {
      setBatteryTriggeredVent(true);
      setAppState('VENTING');
      return;
    }

    // Otherwise show next micro-step
    const nextIndex = stepIndex + 1;
    setStepIndex(nextIndex);
    setIsLoadingStep(true);

    try {
      // Show next micro-step from Gemini
      if (nextIndex < questSteps.length) {
        setStepIndex(nextIndex);
        setCurrentStep(questSteps[nextIndex]);
      } else {
        soundFx.playQuestStart();
        alert('🎉 Quest Completed! You broke the inertia!');
        handleResetApp();
      }
    } catch (err) {
      setCurrentStep('Pause for 5 seconds and relax your shoulders.');
    } finally {
      setIsLoadingStep(false);
    }
  };

  // 'I'm overwhelmed...' handler
  const handleOverwhelmed = () => {
    setBatteryTriggeredVent(false);
    setComboStreak(0);
    setAppState('VENTING');
  };

  // When ephemeral dissolve finishes
  const handleVentingComplete = () => {
    setAppState('REST');
  };

  // Reset entire application
  const handleResetApp = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAppState('ACTION');
    setBattery(100);
    setIsStarted(false);
    setTaskName('');
    setCurrentStep('');
    setStepIndex(0);
    setStepsCompleted(0);
    setQuestSteps([]);
    setComboStreak(0);
    setBatteryTriggeredVent(false);
  };

  const playerStats = getPlayerStats();

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
          stats={playerStats}
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
                  onCompleteStep={handleCompleteStep}
                  onOverwhelmed={handleOverwhelmed}
                />
              </motion.div>
            )}

            {appState === 'VENTING' && (
              <motion.div
                key="state-venting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full"
              >
                <EphemeralConfessional
                  onCompleteRest={handleVentingComplete}
                  batteryLowTriggered={batteryTriggeredVent}
                />
              </motion.div>
            )}

            {appState === 'REST' && (
              <motion.div
                key="state-rest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <CognitiveRest onResetApp={handleResetApp} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Disclaimer */}
      <aside aria-label="Disclaimer" className="w-full max-w-2xl mx-auto px-4 pb-2 text-center">
        <p className="text-[11px] text-neutral-500 font-mono leading-relaxed">
          <span className="text-neutral-400 font-semibold">Disclaimer:</span> SpoonStep is a gamified cognitive scaffold powered by Google Gemini, designed for supportive and educational purposes. It does not provide medical, psychiatric, or clinical advice.
        </p>
      </aside>

      <Footer />

      <SpoonTheoryModal
        isOpen={showTheoryModal}
        onClose={() => setShowTheoryModal(false)}
      />
    </div>
  )
}

export default App;
