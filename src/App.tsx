import { Swords } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-teal-500/30 selection:text-teal-200">
      {/* Top Navigation */}
      <nav className="w-full border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-neutral-950 font-bold shadow-md shadow-teal-500/20">
              <Swords className="w-4 h-4 text-neutral-950 stroke-[2.5]" />
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
            {/* TODO: Audio Sfx Toggle */}
            {/* TODO: Quick reset button */}
            {/* TODO: Spoon Theory info */}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default App;
