import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Screen, { Item } from './ui/Screen.jsx'
import { term } from '../data/content.js'

const LINES = [
  "I don't need a special reason to spend time with you...",
  'But getting a date with you?',
  "That's definitely something worth celebrating. ❤️",
]

export default function SurpriseScreen({ onReplay, onHeart }) {
  const [revealed, setRevealed] = useState(0)

  useEffect(() => {
    if (revealed >= LINES.length) return
    const t = setTimeout(() => setRevealed((n) => n + 1), revealed === 0 ? 500 : 1700)
    return () => clearTimeout(t)
  }, [revealed])

  const done = revealed >= LINES.length

  return (
    <Screen className="flex min-h-[100dvh] flex-col items-center justify-center text-center">
      <div className="glass w-full px-6 py-11 sm:px-10 sm:py-14">
        <div className="flex min-h-[190px] flex-col justify-center gap-5 sm:min-h-[210px]">
          {LINES.map((line, i) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, y: 16, filter: 'blur(5px)' }}
              animate={
                revealed > i
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: 16, filter: 'blur(5px)' }
              }
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className={
                i === LINES.length - 1
                  ? 'font-display text-xl font-semibold leading-snug text-plum-800 sm:text-2xl'
                  : 'text-base leading-relaxed text-plum-700/80 sm:text-lg'
              }
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={done ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-9 border-t border-white/60 pt-8"
        >
          <p className="font-display text-2xl italic text-rouge-600 sm:text-3xl">
            See you on our date, {term}. 🥰
          </p>

          {/* A last little secret: tap the heart, get more hearts. */}
          <motion.button
            onClick={onHeart}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ scale: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } }}
            className="mt-7 text-4xl"
            aria-label="Send more hearts"
          >
            ❤️
          </motion.button>
          <p className="mt-2 text-xs text-plum-700/45">tap the heart. go on.</p>
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={done ? { opacity: 1 } : {}}
        transition={{ delay: 1 }}
        onClick={onReplay}
        whileTap={{ scale: 0.96 }}
        className="mt-8 min-h-[44px] px-4 py-3 text-sm font-semibold text-plum-700/60 underline decoration-rouge-400/40 underline-offset-4"
      >
        Watch it again from the top ↻
      </motion.button>
    </Screen>
  )
}
