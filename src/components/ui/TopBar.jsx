import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

function MusicIcon({ on }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l11-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="17" cy="16" r="3" />
      {!on && <path d="M3 3l18 18" strokeWidth="2.2" />}
    </svg>
  )
}

function ReplayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  )
}

export default function TopBar({ musicOn, musicReady, onToggleMusic, onReset, showReset }) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between p-3 sm:p-5">
      <div className="pointer-events-auto flex items-center gap-2">
        <AnimatePresence>
          {showReset && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -10 }}
              className="flex items-center gap-2"
            >
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => (confirming ? onReset() : setConfirming(true))}
                onBlur={() => setConfirming(false)}
                className="flex items-center gap-2 rounded-full border border-white/70 bg-white/55 min-h-[44px] px-3.5 py-2.5 text-xs font-semibold text-plum-700 shadow-soft backdrop-blur-md sm:text-sm"
                aria-label={confirming ? 'Confirm start over' : 'Start over'}
              >
                <ReplayIcon />
                <span className="hidden sm:inline">{confirming ? 'Sure? Tap again' : 'Start over'}</span>
                <span className="sm:hidden">{confirming ? 'Sure?' : ''}</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={onToggleMusic}
        disabled={!musicReady}
        className="pointer-events-auto flex items-center gap-2 rounded-full border border-white/70 bg-white/55 min-h-[44px] px-3.5 py-2.5 text-xs font-semibold text-plum-700 shadow-soft backdrop-blur-md disabled:opacity-40 sm:text-sm"
        aria-label={musicOn ? 'Turn music off' : 'Turn music on'}
        aria-pressed={musicOn}
      >
        <MusicIcon on={musicOn} />
        <span className="hidden sm:inline">{musicOn ? 'Music on' : 'Music off'}</span>
        {musicOn && (
          <span className="flex items-end gap-[2px]" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-[3px] rounded-full bg-rouge-500"
                animate={{ height: [4, 12, 6, 14, 4] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
              />
            ))}
          </span>
        )}
      </motion.button>
    </div>
  )
}
