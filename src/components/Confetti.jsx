import { useEffect, useRef } from 'react'

/**
 * Canvas confetti + heart burst. One canvas, one rAF loop, particles are
 * plain objects — cheap enough for low-end phones, and the loop stops itself
 * the moment the last particle dies.
 */

const COLORS = ['#E23E63', '#FF7FA9', '#FFC9DA', '#FFD9A0', '#FFFFFF', '#C42B4C']

function drawHeart(ctx, size) {
  const s = size / 16
  ctx.beginPath()
  ctx.moveTo(0, 4 * s)
  ctx.bezierCurveTo(0, 1 * s, -5 * s, -2 * s, -8 * s, 1 * s)
  ctx.bezierCurveTo(-11 * s, 4 * s, -8 * s, 9 * s, 0, 14 * s)
  ctx.bezierCurveTo(8 * s, 9 * s, 11 * s, 4 * s, 8 * s, 1 * s)
  ctx.bezierCurveTo(5 * s, -2 * s, 0, 1 * s, 0, 4 * s)
  ctx.closePath()
  ctx.fill()
}

export default function Confetti({ fire = 0, intensity = 1 }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const rafRef = useRef(null)
  const runningRef = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let dpr = 1

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const tick = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      const particles = particlesRef.current
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.vy += p.gravity
        p.vx *= 0.995
        p.x += p.vx
        p.y += p.vy
        p.rot += p.spin
        p.life -= 1

        if (p.life <= 0 || p.y > h + 60) {
          particles.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.globalAlpha = Math.min(1, p.life / 40)
        ctx.fillStyle = p.color
        if (p.heart) {
          drawHeart(ctx, p.size * 1.6)
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        }
        ctx.restore()
      }

      if (particles.length > 0) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        runningRef.current = false
        ctx.clearRect(0, 0, w, h)
      }
    }

    canvas._startLoop = () => {
      if (!runningRef.current) {
        runningRef.current = true
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
      runningRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!fire) return
    const canvas = canvasRef.current
    if (!canvas) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const w = window.innerWidth
    const h = window.innerHeight
    const count = Math.round((reduced ? 30 : w < 640 ? 90 : 150) * intensity)

    // Two cannons from the lower corners plus a soft rain from the top.
    const origins = [
      { x: w * 0.1, y: h * 0.95, angle: -Math.PI / 2.6, spread: 0.7 },
      { x: w * 0.9, y: h * 0.95, angle: -Math.PI / 1.62, spread: 0.7 },
    ]

    const next = particlesRef.current
    origins.forEach((o) => {
      for (let i = 0; i < count / 2; i++) {
        const angle = o.angle + (Math.random() - 0.5) * o.spread
        const speed = 11 + Math.random() * 13
        next.push({
          x: o.x,
          y: o.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0.28 + Math.random() * 0.12,
          size: 6 + Math.random() * 8,
          color: COLORS[(Math.random() * COLORS.length) | 0],
          rot: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.3,
          life: 150 + Math.random() * 90,
          heart: Math.random() < 0.35,
        })
      }
    })

    for (let i = 0; i < count * 0.4; i++) {
      next.push({
        x: Math.random() * w,
        y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 2,
        vy: 2 + Math.random() * 3,
        gravity: 0.05,
        size: 6 + Math.random() * 7,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        rot: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.2,
        life: 240 + Math.random() * 120,
        heart: Math.random() < 0.5,
      })
    }

    // Hard cap so repeated taps can never snowball into a stutter.
    if (next.length > 700) next.splice(0, next.length - 700)

    canvas._startLoop?.()
  }, [fire, intensity])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50"
    />
  )
}
