import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Screen, { Item } from './ui/Screen.jsx'

/**
 * Three timed beats: the shout, the smug line, then the "booked" receipt
 * with a continue button. Timers are cleared on unmount so a fast replay
 * can never leave a stale beat scheduled.
 */
export default function Celebration({ onContinue }) {
  const [beat, setBeat] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setBeat(1), 1500),
      setTimeout(() => setBeat(2), 3200),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <Screen className="flex min-h-[100dvh] flex-col items-center justify-center text-center">
      <motion.div
        initial={{ scale: 0.4, rotate: -12 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 12 }}
        className="mb-6 text-[64px] leading-none sm:text-[88px]"
      >
        🎉
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}
        className="title-serif text-[2.4rem] sm:text-6xl"
      >
        <span className="gradient-text">YAYYYYY!!!</span> ❤️
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={beat >= 1 ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mt-5 text-lg text-plum-700/80 sm:text-xl"
      >
        I knew you would say yes 😌
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.94 }}
        animate={beat >= 2 ? { opacity: 1, y: 0, scale: 1 } : {}}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        className="mt-10 w-full"
      >
        <div className="glass mx-auto flex w-full max-w-sm flex-col items-center px-6 py-7">
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="mb-3 text-3xl"
          >
            ❤️
          </motion.div>
          <p className="font-display text-xl font-semibold text-plum-800 sm:text-2xl">
            Date successfully booked
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.22em] text-rouge-500/80">
            confirmation #4EVER
          </p>
        </div>

        <motion.button
          onClick={onContinue}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.96 }}
          className="btn-yes mt-8"
        >
          Now let&apos;s plan it 💕
        </motion.button>
      </motion.div>
    </Screen>
  )
}
