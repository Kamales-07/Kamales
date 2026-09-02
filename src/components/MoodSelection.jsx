import { AnimatePresence, motion } from 'framer-motion'
import Screen, { Item } from './ui/Screen.jsx'
import { MOODS } from '../data/content.js'

export default function MoodSelection({ selected, onSelect, onContinue, chime }) {
  const chosen = MOODS.find((m) => m.id === selected)

  return (
    <Screen className="flex min-h-[100dvh] flex-col justify-start sm:justify-center">
      <Item className="mb-2 text-center text-sm font-medium uppercase tracking-[0.2em] text-rouge-500/80">
        Step 2 of 2
      </Item>

      <Item as={motion.h2} className="title-serif mb-6 text-center text-2xl sm:mb-8 sm:text-5xl">
        What kind of date are you feeling? 😌
      </Item>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {MOODS.map((mood) => {
          const active = selected === mood.id
          return (
            <Item key={mood.id}>
              <motion.button
                onClick={() => {
                  onSelect(mood.id)
                  chime?.(880)
                }}
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                aria-pressed={active}
                className={`flex h-full w-full flex-col items-center justify-center gap-2 rounded-3xl border px-2 py-5 backdrop-blur-xl transition-colors sm:px-3 sm:py-8 ${
                  active
                    ? 'border-rouge-400/70 bg-white/70 shadow-lift'
                    : 'border-white/60 bg-white/40 shadow-soft'
                }`}
              >
                <motion.span
                  className="text-3xl sm:text-4xl"
                  animate={active ? { scale: [1, 1.3, 1], rotate: [0, 12, -8, 0] } : {}}
                  transition={{ duration: 0.55 }}
                >
                  {mood.emoji}
                </motion.span>
                <span
                  className={`text-sm font-bold sm:text-base ${
                    active ? 'text-rouge-600' : 'text-plum-800'
                  }`}
                >
                  {mood.label}
                </span>
              </motion.button>
            </Item>
          )
        })}
      </div>

      <div className="mt-8 flex min-h-[150px] flex-col items-center justify-start">
        <AnimatePresence mode="wait">
          {chosen && (
            <motion.div
              key={chosen.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="flex w-full flex-col items-center"
            >
              <div className="glass-soft w-full px-5 py-4 text-center">
                <p className="text-sm leading-relaxed text-plum-700/85 sm:text-base">
                  {chosen.response}
                </p>
              </div>

              <motion.button
                onClick={onContinue}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.96 }}
                className="btn-yes mt-6"
              >
                Lock it in ❤️
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Screen>
  )
}
