import { useMemo } from 'react'

/**
 * Purely decorative ambience: hearts drifting upward and stars twinkling.
 * Everything runs on CSS keyframes (compositor-only transform/opacity), so
 * React never re-renders for the animation and the main thread stays free.
 */

const HEART_GLYPHS = ['❤️', '💗', '💖', '🩷', '💕']

function seededItems(count, make) {
  return Array.from({ length: count }, (_, i) => make(i))
}

export default function FloatingBackground({ density = 'normal' }) {
  const counts = density === 'rich' ? { hearts: 18, stars: 26 } : { hearts: 12, stars: 18 }

  const hearts = useMemo(
    () =>
      seededItems(counts.hearts, (i) => ({
        id: `h${i}`,
        glyph: HEART_GLYPHS[i % HEART_GLYPHS.length],
        left: Math.random() * 100,
        size: 12 + Math.random() * 24,
        duration: 16 + Math.random() * 16,
        delay: -Math.random() * 26,
        drift: `${(Math.random() - 0.5) * 160}px`,
        spin: `${(Math.random() - 0.5) * 90}deg`,
        opacity: 0.28 + Math.random() * 0.4,
      })),
    [counts.hearts],
  )

  const stars = useMemo(
    () =>
      seededItems(counts.stars, (i) => ({
        id: `s${i}`,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 2.5 + Math.random() * 4,
        delay: -Math.random() * 6,
      })),
    [counts.stars],
  )

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Slow-moving colour blooms behind everything else. */}
      <div className="absolute -left-24 top-[-10%] h-[45vmax] w-[45vmax] rounded-full bg-blush-300/30 blur-[90px]" />
      <div className="absolute -right-28 top-[25%] h-[40vmax] w-[40vmax] rounded-full bg-[#FFD3B0]/40 blur-[90px]" />
      <div className="absolute bottom-[-15%] left-[20%] h-[42vmax] w-[42vmax] rounded-full bg-rouge-400/20 blur-[100px]" />

      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            boxShadow: '0 0 8px 2px rgba(255,255,255,0.75)',
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute bottom-[-12vh] animate-floatUp will-change-transform"
          style={{
            left: `${h.left}%`,
            fontSize: h.size,
            opacity: h.opacity,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            '--drift': h.drift,
            '--spin': h.spin,
          }}
        >
          {h.glyph}
        </span>
      ))}

      {/* Subtle grain keeps the gradients from banding on big screens. */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  )
}
