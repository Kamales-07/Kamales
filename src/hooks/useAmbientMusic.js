import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * A tiny generative music box.
 *
 * There is no audio file to ship or wait for: a soft arpeggio is synthesised
 * with the Web Audio API on demand. Nothing is created until the user taps the
 * toggle, so the page never autoplays and never touches the audio hardware
 * unless invited to.
 *
 * If you would rather use a real track, drop an mp3 in /public and swap this
 * hook for an <audio loop> element — the toggle API stays identical.
 */

// A gentle C-major-ish loop in Hz. Deliberately sparse so it stays background.
const PHRASE = [
  523.25, 659.25, 783.99, 659.25, // C5 E5 G5 E5
  587.33, 698.46, 880.0, 698.46, // D5 F5 A5 F5
  493.88, 659.25, 783.99, 659.25, // B4 E5 G5 E5
  523.25, 622.25, 783.99, 1046.5, // C5 D#5 G5 C6
]
const BASS = [130.81, 146.83, 123.47, 130.81] // C3 D3 B2 C3
const STEP = 0.36 // seconds per note
const LOOKAHEAD = 0.6 // how far ahead we schedule

export function useAmbientMusic() {
  const [enabled, setEnabled] = useState(false)
  const [ready, setReady] = useState(true)

  const ctxRef = useRef(null)
  const gainRef = useRef(null)
  const timerRef = useRef(null)
  const stepRef = useRef(0)
  const nextTimeRef = useRef(0)

  const playNote = useCallback((freq, time, duration, volume, type) => {
    const ctx = ctxRef.current
    if (!ctx) return
    const osc = ctx.createOscillator()
    const env = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, time)
    // Soft bell-ish envelope: quick swell, long tail.
    env.gain.setValueAtTime(0.0001, time)
    env.gain.exponentialRampToValueAtTime(volume, time + 0.06)
    env.gain.exponentialRampToValueAtTime(0.0001, time + duration)
    osc.connect(env)
    env.connect(gainRef.current)
    osc.start(time)
    osc.stop(time + duration + 0.05)
  }, [])

  const scheduler = useCallback(() => {
    const ctx = ctxRef.current
    if (!ctx) return
    while (nextTimeRef.current < ctx.currentTime + LOOKAHEAD) {
      const i = stepRef.current
      const t = nextTimeRef.current

      playNote(PHRASE[i % PHRASE.length], t, 1.1, 0.07, 'sine')
      // A soft harmony a third above, every other note.
      if (i % 2 === 0) {
        playNote(PHRASE[i % PHRASE.length] * 1.5, t + 0.02, 0.9, 0.025, 'triangle')
      }
      // Bass pulse once per bar.
      if (i % 4 === 0) {
        playNote(BASS[(i / 4) % BASS.length], t, 1.6, 0.055, 'sine')
      }

      stepRef.current = (i + 1) % PHRASE.length
      nextTimeRef.current += STEP
    }
  }, [playNote])

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    const gain = gainRef.current
    const ctx = ctxRef.current
    if (gain && ctx) {
      // Fade out instead of cutting, then suspend to free the audio thread.
      gain.gain.cancelScheduledValues(ctx.currentTime)
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.4)
      setTimeout(() => ctx.state === 'running' && ctx.suspend().catch(() => {}), 450)
    }
  }, [])

  const start = useCallback(async () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) {
        setReady(false)
        return false
      }
      if (!ctxRef.current) {
        ctxRef.current = new AudioCtx()
        const master = ctxRef.current.createGain()
        master.gain.value = 0.0001
        master.connect(ctxRef.current.destination)
        gainRef.current = master
      }
      const ctx = ctxRef.current
      if (ctx.state === 'suspended') await ctx.resume()

      gainRef.current.gain.cancelScheduledValues(ctx.currentTime)
      gainRef.current.gain.setValueAtTime(0.0001, ctx.currentTime)
      gainRef.current.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.2)

      nextTimeRef.current = ctx.currentTime + 0.1
      if (!timerRef.current) timerRef.current = setInterval(scheduler, 220)
      scheduler()
      return true
    } catch {
      setReady(false)
      return false
    }
  }, [scheduler])

  const toggle = useCallback(async () => {
    if (enabled) {
      stop()
      setEnabled(false)
    } else {
      const ok = await start()
      setEnabled(ok)
    }
  }, [enabled, start, stop])

  // Pause while the tab is hidden so we never play into a backgrounded phone.
  useEffect(() => {
    const onVisibility = () => {
      const ctx = ctxRef.current
      if (!ctx) return
      if (document.hidden) ctx.suspend().catch(() => {})
      else if (enabled) ctx.resume().catch(() => {})
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [enabled])

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current)
    ctxRef.current?.close().catch(() => {})
  }, [])

  /** One-off UI blip, only audible when music is already on. */
  const chime = useCallback(
    (freq = 880) => {
      if (!enabled || !ctxRef.current) return
      playNote(freq, ctxRef.current.currentTime + 0.01, 0.5, 0.09, 'sine')
    },
    [enabled, playNote],
  )

  return { enabled, ready, toggle, chime }
}
