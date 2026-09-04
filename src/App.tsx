import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SpoonTheoryModal } from './components/SpoonTheoryModal';

function App() {
  const [showTheoryModal, setShowTheoryModal] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-teal-500/30 selection:text-teal-200">
      <Header onOpenTheoryModal={() => setShowTheoryModal(true)} />

      {/* TODO: Add content */}

      <Footer />

      <SpoonTheoryModal
        isOpen={showTheoryModal}
        onClose={() => setShowTheoryModal(false)}
      />
    </div>
  )
}

export default App;
