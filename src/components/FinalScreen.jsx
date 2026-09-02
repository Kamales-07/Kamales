import { motion } from 'framer-motion'
import Screen, { Item } from './ui/Screen.jsx'
import { DATE_PLANS, MOODS, term } from '../data/content.js'

/** The "receipt" — designed to be the screenshot she sends her friends. */
export default function FinalScreen({ planId, moodId, onContinue }) {
  const plan = DATE_PLANS.find((p) => p.id === planId)
  const mood = MOODS.find((m) => m.id === moodId)

  const rows = [
    { label: 'Date plan', value: plan ? `${plan.emoji} ${plan.title}` : '—' },
    { label: 'Mood', value: mood ? `${mood.emoji} ${mood.label}` : '—' },
    { label: 'Status', value: 'SHE SAID YES ❤️', highlight: true },
  ]

  return (
    <Screen className="flex min-h-[100dvh] flex-col items-center justify-center text-center">
      <Item as={motion.h2} className="title-serif text-4xl sm:text-6xl">
        <span className="gradient-text">Perfect</span> ❤️
      </Item>

      <Item className="mt-3 text-lg text-plum-700/80 sm:text-xl">
        Then it&apos;s officially a date!
      </Item>

      <Item className="mt-9 w-full">
        <motion.div
          whileHover={{ rotateX: -3, rotateY: 3, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          style={{ transformPerspective: 900 }}
          className="glass relative mx-auto w-full max-w-md overflow-hidden px-5 py-7 text-left sm:px-8 sm:py-8"
        >
          {/* Ticket header */}
          <div className="mb-6 flex items-center justify-between gap-3 border-b border-dashed border-rouge-400/30 pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-rouge-500/80">
                Official
              </p>
              <p className="font-display text-2xl font-semibold text-plum-800">Date Pass</p>
            </div>
            <motion.span
              animate={{ scale: [1, 1.14, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-3xl"
            >
              💌
            </motion.span>
          </div>

          <dl className="space-y-5">
            {rows.map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.14, duration: 0.45 }}
              >
                <dt className="text-xs font-bold uppercase tracking-[0.18em] text-plum-700/45">
                  {row.label}
                </dt>
                <dd
                  className={
                    row.highlight
                      ? 'mt-1 font-display text-2xl font-bold text-rouge-600 sm:text-[28px]'
                      : 'mt-1 text-lg font-semibold text-plum-800'
                  }
                >
                  {row.value}
                </dd>
              </motion.div>
            ))}
          </dl>

          {/* Perforation + stub */}
          <div className="relative mt-7 border-t border-dashed border-rouge-400/30 pt-5">
            {/* Ticket notches — pulled to the card's inner edge so they read as
                punched holes rather than clipping outside the rounded corner. */}
            <span className="absolute -left-8 -top-3 h-6 w-6 rounded-full bg-blush-100/90 sm:-left-11" />
            <span className="absolute -right-8 -top-3 h-6 w-6 rounded-full bg-blush-100/90 sm:-right-11" />
            <p className="text-xs text-plum-700/55">
              Non-refundable. Non-transferable. Extremely looked-forward-to.
            </p>
          </div>
        </motion.div>
      </Item>

      <Item className="mt-9 font-display text-2xl italic text-plum-800 sm:text-3xl">
        Can&apos;t wait to see you 🥰
      </Item>

      <Item className="mt-8">
        <motion.button
          onClick={onContinue}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.96 }}
          className="btn-ghost text-base font-bold"
        >
          One More Thing 👀
        </motion.button>
      </Item>

      <Item className="mt-4 text-xs text-plum-700/45">
        (Screenshot this. Send it to {term === 'beautiful' ? 'your friends' : 'the group chat'}. I&apos;ll wait.)
      </Item>
    </Screen>
  )
}
