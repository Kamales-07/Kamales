import { AnimatePresence } from 'framer-motion'
import { useCallback, useState } from 'react'

import FloatingBackground from './components/FloatingBackground.jsx'
import Confetti from './components/Confetti.jsx'
import TopBar from './components/ui/TopBar.jsx'

import LandingScreen from './components/LandingScreen.jsx'
import QuestionScreen from './components/QuestionScreen.jsx'
import Celebration from './components/Celebration.jsx'
import DateSelection from './components/DateSelection.jsx'
import MoodSelection from './components/MoodSelection.jsx'
import FinalScreen from './components/FinalScreen.jsx'
import SurpriseScreen from './components/SurpriseScreen.jsx'

import { usePersistentState, useClearPersistedState } from './hooks/usePersistentState.js'
import { useAmbientMusic } from './hooks/useAmbientMusic.js'

const STEPS = ['landing', 'question', 'celebration', 'plan', 'mood', 'final', 'surprise']

export default function App() {
  const [step, setStep] = usePersistentState('step', 'landing')
  const [plan, setPlan] = usePersistentState('plan', null)
  const [mood, setMood] = usePersistentState('mood', null)
  const [dodges, setDodges] = usePersistentState('dodges', 0)

  const [confettiFire, setConfettiFire] = useState(0)
  const clearPersisted = useClearPersistedState()
  const { enabled: musicOn, ready: musicReady, toggle: toggleMusic, chime } = useAmbientMusic()

  const go = useCallback(
    (next) => {
      setStep(next)
      // Screens are full-height; a fresh one should always start at the top.
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [setStep],
  )

  const burst = useCallback(() => setConfettiFire((n) => n + 1), [])

  const handleYes = useCallback(() => {
    burst()
    chime?.(1318)
    go('celebration')
  }, [burst, chime, go])

  const handleReset = useCallback(() => {
    clearPersisted()
    setPlan(null)
    setMood(null)
    setDodges(0)
    go('landing')
  }, [clearPersisted, go, setDodges, setMood, setPlan])

  const handleFinal = useCallback(() => {
    burst()
    go('final')
  }, [burst, go])

  const density = step === 'celebration' || step === 'surprise' ? 'rich' : 'normal'

  return (
    <main className="relative min-h-[100dvh] w-full overflow-x-hidden">
      <FloatingBackground density={density} />
      <Confetti fire={confettiFire} />

      <TopBar
        musicOn={musicOn}
        musicReady={musicReady}
        onToggleMusic={toggleMusic}
        onReset={handleReset}
        showReset={step !== 'landing'}
      />

      <AnimatePresence mode="wait">
        {step === 'landing' && (
          <LandingScreen key="landing" onContinue={() => go('question')} />
        )}

        {step === 'question' && (
          <QuestionScreen
            key="question"
            dodges={dodges}
            setDodges={setDodges}
            onYes={handleYes}
            chime={chime}
          />
        )}

        {step === 'celebration' && (
          <Celebration key="celebration" onContinue={() => go('plan')} />
        )}

        {step === 'plan' && (
          <DateSelection
            key="plan"
            selected={plan}
            onSelect={setPlan}
            onContinue={() => go('mood')}
            chime={chime}
          />
        )}

        {step === 'mood' && (
          <MoodSelection
            key="mood"
            selected={mood}
            onSelect={setMood}
            onContinue={handleFinal}
            chime={chime}
          />
        )}

        {step === 'final' && (
          <FinalScreen
            key="final"
            planId={plan}
            moodId={mood}
            onContinue={() => {
              burst()
              go('surprise')
            }}
          />
        )}

        {step === 'surprise' && (
          <SurpriseScreen
            key="surprise"
            onReplay={handleReset}
            onHeart={() => {
              burst()
              chime?.(1046)
            }}
          />
        )}
      </AnimatePresence>

      {/* Progress dots — quiet story-position cue, hidden on the first screen. */}
      {step !== 'landing' && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center gap-1.5 p-4 safe-b">
          {STEPS.slice(1).map((s) => (
            <span
              key={s}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                s === step ? 'w-6 bg-rouge-500' : 'w-1.5 bg-rouge-500/25'
              }`}
            />
          ))}
        </div>
      )}
    </main>
  )
}
