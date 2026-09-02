import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { NO_LABELS } from '../data/content.js'

/**
 * The runaway NO button.
 *
 * It starts life in normal document flow (so the row of buttons lays out
 * correctly), and the first time it is threatened it switches to `position:
 * fixed` and teleports around the viewport.
 *
 * Once loose it is rendered through a portal into <body>. This matters: the
 * screen-transition variants animate `filter: blur()`, and a filtered ancestor
 * becomes the containing block for `position: fixed` — so a fixed child would
 * measure its `top` from the card instead of the viewport and could settle
 * off-screen. The portal keeps it in the viewport's coordinate space.
 *
 * Design rules that keep this fun instead of annoying:
 *  - it never leaves the visible area, and never hides behind the safe-area
 *  - it always jumps a meaningful distance, so it reads as intentional
 *  - it shrinks as attempts pile up, and eventually gives up entirely
 *  - on touch it dodges on tap (there is no hover), on desktop it dodges on
 *    pointer-enter so it feels alive
 */

const MAX_DODGES = 9 // after this it stops running and pleads instead
const EDGE = 12 // px kept clear of the left/right viewport edges
const TOP_SAFE = 68 // clears the music / start-over bar
const BOTTOM_SAFE = 56 // clears the progress dots

export default function FunnyNoButton({ dodges, onDodge, onSurrender }) {
  const [fixed, setFixed] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [wobble, setWobble] = useState(0)
  const ref = useRef(null)
  const lastMove = useRef(0)

  const surrendered = dodges >= MAX_DODGES
  const label = surrendered
    ? NO_LABELS[NO_LABELS.length - 1]
    : NO_LABELS[Math.min(Math.floor(dodges / 2), NO_LABELS.length - 2)]

  // Shrink gradually, but never below a comfortable tap target (~44px tall).
  const scale = surrendered ? 0.78 : Math.max(0.78, 1 - dodges * 0.035)

  const jump = useCallback(() => {
    const now = performance.now()
    if (now - lastMove.current < 110) return // don't stutter on rapid events
    lastMove.current = now

    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()

    // offsetWidth/Height are the UNSCALED layout box. getBoundingClientRect()
    // returns the visually scaled one, and since we position with unscaled
    // left/top, using the scaled height here would let the button settle
    // partly off-screen. Pad by the scale so the visual box always fits too.
    const w = el.offsetWidth || 140
    const h = el.offsetHeight || 52
    const pad = Math.max(0, (h * Math.max(1, scale) - h) / 2) + 4

    // Clamp against the VISUAL viewport (accounts for mobile browser chrome
    // and pinch-zoom) so the button can never land under the address bar.
    const vw = window.visualViewport?.width ?? window.innerWidth
    const vh = window.visualViewport?.height ?? window.innerHeight

    // The travel box, clamped so the button always lands fully on screen and
    // never under the top bar or the progress dots.
    const minX = EDGE + pad
    const maxX = Math.max(minX, vw - w - EDGE - pad)
    const minY = TOP_SAFE + pad
    const maxY = Math.max(minY, vh - h - BOTTOM_SAFE - pad)

    // Pick a landing spot that is genuinely far from where it is now, so the
    // dodge is visible rather than a nervous twitch.
    let best = { x: minX, y: minY }
    let bestDist = -1
    for (let i = 0; i < 8; i++) {
      const cx = minX + Math.random() * (maxX - minX)
      const cy = minY + Math.random() * (maxY - minY)
      const d = Math.hypot(cx - rect.left, cy - rect.top)
      if (d > bestDist) {
        bestDist = d
        best = { x: cx, y: cy }
      }
    }

    setPos(best)
    setFixed(true)
    setWobble((n) => n + 1)
    onDodge()
  }, [onDodge, scale])

  // If the window resizes while the button is loose, pull it back in bounds.
  useEffect(() => {
    if (!fixed) return
    const onResize = () => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      setPos((p) => ({
        x: Math.min(Math.max(EDGE, p.x), Math.max(EDGE, window.innerWidth - rect.width - EDGE)),
        y: Math.min(
          Math.max(TOP_SAFE, p.y),
          Math.max(TOP_SAFE, window.innerHeight - rect.height - BOTTOM_SAFE),
        ),
      }))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [fixed])

  const handleActivate = (e) => {
    if (surrendered) {
      onSurrender()
      return
    }
    e.preventDefault()
    jump()
  }

  const style = fixed
    ? { position: 'fixed', left: pos.x, top: pos.y, margin: 0, zIndex: 30 }
    : undefined

  const button = (
    <motion.button
      ref={ref}
      type="button"
      style={style}
      onPointerEnter={(e) => {
        // Mouse users get dodged before the click even lands.
        if (e.pointerType === 'mouse' && !surrendered) jump()
      }}
      onFocus={() => {
        // Keyboard users deserve the joke too — but keep it reachable.
        if (!surrendered && dodges < MAX_DODGES - 1) jump()
      }}
      onClick={handleActivate}
      animate={{
        scale,
        rotate: surrendered ? 0 : wobble % 2 === 0 ? -3 : 3,
      }}
      transition={{ type: 'spring', stiffness: 420, damping: 18, mass: 0.6 }}
      whileTap={{ scale: scale * 0.9 }}
      className={`btn-ghost whitespace-nowrap text-base transition-colors ${
        surrendered ? 'border-rouge-400/50 bg-blush-100/80 text-rouge-600' : ''
      }`}
      aria-label={surrendered ? 'Okay okay, yes' : 'No thank you'}
    >
      {label}
      {surrendered && (
        <motion.span
          className="ml-1 inline-block"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          👉
        </motion.span>
      )}
    </motion.button>
  )

  // While loose, escape the blurred/transformed screen wrapper so `fixed` is
  // resolved against the viewport. A placeholder keeps the button row from
  // reflowing the moment it takes off.
  if (fixed) {
    return (
      <>
        <span aria-hidden="true" className="inline-block h-[50px] w-[92px] opacity-0" />
        {createPortal(button, document.body)}
      </>
    )
  }

  return button
}

export { MAX_DODGES }
