import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'
import Screen, { Item } from './ui/Screen.jsx'
import FunnyNoButton, { MAX_DODGES } from './FunnyNoButton.jsx'
import { MAYBE_REPLIES, NO_TAUNTS } from '../data/content.js'

export default function QuestionScreen({ onYes, dodges, setDodges, chime }) {
  const [taunt, setTaunt] = useState(null)
  const [maybeReply, setMaybeReply] = useState(null)
  const tauntId = useRef(0)
  const cardControls = useAnimationControls()

  // YES grows steadily as NO shrinks — the balance of power shifts visibly.
  // Capped tighter on narrow screens so it can never outgrow the viewport.
  const isNarrow = typeof window !== 'undefined' && window.innerWidth < 400
  const growth = isNarrow ? 0.03 : 0.055
  const yesScale = Math.min(isNarrow ? 1.2 : 1.5, 1 + Math.min(dodges, MAX_DODGES) * growth)

  const handleDodge = useCallback(() => {
    setDodges((d) => d + 1)
    setMaybeReply(null)
    tauntId.current += 1
    setTaunt({ id: tauntId.current, text: NO_TAUNTS[(Math.random() * NO_TAUNTS.length) | 0] })
    // The whole card flinches — the page "reacts" to the attempted rejection.
    cardControls.start({
      x: [0, -9, 8, -6, 4, 0],
      rotate: [0, -1.2, 1.2, -0.6, 0],
      transition: { duration: 0.42, ease: 'easeInOut' },
    })
    chime?.(392)
  }, [cardControls, chime, setDodges])

  const handleMaybe = () => {
    tauntId.current += 1
    setTaunt(null)
    setMaybeReply({
      id: tauntId.current,
      text: MAYBE_REPLIES[(Math.random() * MAYBE_REPLIES.length) | 0],
    })
    setDodges((d) => d + 1)
    chime?.(659)
  }

  return (
    <Screen className="flex min-h-[100dvh] flex-col items-center justify-center text-center">
      <motion.div animate={cardControls} className="glass w-full px-4 py-7 sm:px-10 sm:py-12">
        <Item className="mb-4 flex justify-center">
          <span className="pill">Question 1 of 1 · high stakes</span>
        </Item>

        <Item className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-rouge-500/80 sm:text-sm sm:tracking-[0.18em]">
          I have been planning something...
        </Item>

        <Item as={motion.h2} className="title-serif text-[1.6rem] leading-tight sm:text-5xl">
          Will you go on a date with me?
          <span className="ml-1 inline-block">🥺❤️</span>
        </Item>

        <Item className="mx-auto mt-3 max-w-sm text-[13px] text-plum-700/65 sm:text-base">
          Take your time. Two of these buttons work perfectly.
        </Item>

        {/* Reaction line — reserved height so the layout never jumps. */}
        <div className="mt-4 flex h-12 items-center justify-center px-2 sm:mt-7">
          <AnimatePresence mode="wait">
            {taunt && (
              <motion.p
                key={`t-${taunt.id}`}
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-rouge-600 shadow-soft backdrop-blur-md sm:text-base"
              >
                {taunt.text}
              </motion.p>
            )}
            {maybeReply && (
              <motion.p
                key={`m-${maybeReply.id}`}
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.9 }}
                className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-plum-700 shadow-soft backdrop-blur-md sm:text-base"
              >
                {maybeReply.text}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
          <motion.button
            onClick={() => {
              chime?.(1046)
              onYes()
            }}
            animate={{ scale: yesScale }}
            whileHover={{ scale: yesScale * 1.07, y: -4 }}
            whileTap={{ scale: yesScale * 0.95 }}
            transition={{ type: 'spring', stiffness: 340, damping: 20 }}
            className="btn-yes origin-center"
          >
            <motion.span
              className="absolute inset-0 rounded-full bg-white/25"
              animate={{ opacity: [0, 0.4, 0], scale: [0.92, 1.18, 1.28] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              aria-hidden="true"
            />
            <span className="relative">YESSS ❤️</span>
          </motion.button>

          <motion.button
            onClick={handleMaybe}
            whileHover={{ scale: 1.04, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="btn-ghost text-base"
          >
            Maybe... 😏
          </motion.button>

          <FunnyNoButton dodges={dodges} onDodge={handleDodge} onSurrender={onYes} />
        </div>

        <AnimatePresence>
          {dodges >= 3 && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-7 text-xs text-plum-700/50 sm:text-sm"
            >
              {dodges >= MAX_DODGES
                ? 'It gave up. Even the button is on my side now.'
                : `Rejection attempts: ${dodges} · Success rate: 0%`}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </Screen>
  )
}
