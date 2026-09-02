import { AnimatePresence, motion } from 'framer-motion'
import Screen, { Item } from './ui/Screen.jsx'
import { DATE_PLANS } from '../data/content.js'

export default function DateSelection({ selected, onSelect, onContinue, chime }) {
  const chosen = DATE_PLANS.find((p) => p.id === selected)

  return (
    <Screen className="flex min-h-[100dvh] flex-col justify-start sm:justify-center">
      <Item className="mb-2 text-center text-sm font-medium uppercase tracking-[0.2em] text-rouge-500/80">
        Step 1 of 2
      </Item>

      <Item as={motion.h2} className="title-serif mb-2 text-center text-4xl sm:text-5xl">
        Our Date 💕
      </Item>

      <Item className="mb-5 text-center text-plum-700/70 sm:mb-8">Choose our plan</Item>

      <div className="flex flex-col gap-3 sm:gap-4">
        {DATE_PLANS.map((plan) => {
          const active = selected === plan.id
          return (
            <Item key={plan.id}>
              <motion.button
                onClick={() => {
                  onSelect(plan.id)
                  chime?.(784)
                }}
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 380, damping: 25 }}
                aria-pressed={active}
                className={`group relative w-full overflow-hidden rounded-3xl border p-4 text-left backdrop-blur-xl transition-colors sm:p-6 ${
                  active
                    ? 'border-rouge-400/70 bg-white/70 shadow-lift'
                    : 'border-white/60 bg-white/40 shadow-soft'
                }`}
              >
                {/* Accent wash that blooms in on selection. */}
                <motion.span
                  aria-hidden="true"
                  className={`absolute inset-0 bg-gradient-to-br ${plan.accent} opacity-0`}
                  animate={{ opacity: active ? 0.14 : 0 }}
                  transition={{ duration: 0.35 }}
                />

                <div className="relative flex items-start gap-4">
                  <motion.span
                    className="text-3xl sm:text-4xl"
                    animate={active ? { scale: [1, 1.25, 1], rotate: [0, -10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {plan.emoji}
                  </motion.span>

                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-semibold text-plum-800 sm:text-xl">
                      {plan.title}
                    </p>
                    <p className="mt-1 text-sm text-plum-700/70 sm:text-base">{plan.line}</p>

                    <AnimatePresence initial={false}>
                      {active && (
                        <motion.p
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden text-sm italic text-rouge-600/90"
                        >
                          {plan.detail}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <span
                    className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      active ? 'border-rouge-500 bg-rouge-500' : 'border-plum-700/25'
                    }`}
                    aria-hidden="true"
                  >
                    {active && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        viewBox="0 0 24 24"
                        className="h-4 w-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </motion.svg>
                    )}
                  </span>
                </div>
              </motion.button>
            </Item>
          )
        })}
      </div>

      <div className="mt-8 flex min-h-[80px] flex-col items-center justify-start">
        <AnimatePresence mode="wait">
          {chosen && (
            <motion.div
              key={chosen.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center"
            >
              <p className="mb-4 text-center text-sm text-plum-700/70">
                Excellent taste. Obviously — you picked me too.
              </p>
              <motion.button
                onClick={onContinue}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.96 }}
                className="btn-yes"
              >
                Next 💫
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Screen>
  )
}
