import { motion } from 'framer-motion'
import { useState } from 'react'
import Screen, { Item } from './ui/Screen.jsx'
import { term } from '../data/content.js'

const ENVELOPE_HINTS = [
  'It is not a bill. Relax.',
  'Reading this counts as spending time with me 😌',
  'Tap it. I promise it is worth it.',
]

export default function LandingScreen({ onContinue }) {
  const [peeks, setPeeks] = useState(0)

  return (
    <Screen className="flex min-h-[100dvh] flex-col items-center justify-center text-center">
      <Item className="mb-6">
        <span className="pill">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rouge-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rouge-500" />
          </span>
          One (1) unread message
        </span>
      </Item>

      {/* The envelope is the first micro-interaction: it reacts before she even
          reaches the button. */}
      <Item className="mb-8">
        <motion.button
          type="button"
          onClick={() => setPeeks((p) => p + 1)}
          whileHover={{ scale: 1.06, rotate: -3 }}
          whileTap={{ scale: 0.94, rotate: 4 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ y: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' } }}
          className="relative text-[76px] leading-none drop-shadow-[0_18px_28px_rgba(226,62,99,0.35)] sm:text-[96px]"
          aria-label="A sealed letter"
        >
          {peeks > 0 ? '💌' : '✉️'}
        </motion.button>
      </Item>

      <Item as={motion.h1} className="title-serif text-[2.6rem] sm:text-6xl">
        Hey <span className="gradient-text">{term}</span> ❤️
      </Item>

      <Item className="mt-5 max-w-md text-base leading-relaxed text-plum-700/80 sm:text-lg">
        I have a very important question for you...
      </Item>

      <Item className="mt-2 text-sm text-plum-700/55">
        (Important on my scale. Which is, admittedly, dramatic.)
      </Item>

      <Item className="mt-10">
        <motion.button
          onClick={onContinue}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.96 }}
          className="btn-yes text-xl"
        >
          <motion.span
            className="absolute inset-0 rounded-full bg-white/25"
            animate={{ opacity: [0, 0.35, 0], scale: [0.9, 1.15, 1.25] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
            aria-hidden="true"
          />
          <span className="relative">Ask Me 😌</span>
        </motion.button>
      </Item>

      <Item className="mt-8 h-5 text-xs text-plum-700/50">
        {peeks > 0 && (
          <motion.span
            key={peeks}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="italic"
          >
            {ENVELOPE_HINTS[Math.min(peeks - 1, ENVELOPE_HINTS.length - 1)]}
          </motion.span>
        )}
      </Item>
    </Screen>
  )
}
