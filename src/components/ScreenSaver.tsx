import { useEffect, useRef, useState } from 'react'
import type { Theme } from '../theme'

interface ScreenSaverProps {
  t: Theme
  active: boolean
  onDismiss: () => void
}

const COLORS = ['#0a84ff', '#ff453a', '#30d158', '#ffd60a', '#bf5af2', '#ff9f0a']
const LOGO_W = 220
const LOGO_H = 64
const SPEED = 2.6

// A DVD-logo-style bounce for idle visitors — cheeky nod to a very specific
// shared memory, cheap to run, and it doubles as proof nobody's touched the
// desktop in a while.
export function ScreenSaver({ t, active, onDismiss }: ScreenSaverProps) {
  const logoRef = useRef<HTMLDivElement | null>(null)
  const stateRef = useRef({ x: 80, y: 80, dx: SPEED, dy: SPEED, colorIdx: 0 })
  const rafRef = useRef<number | null>(null)
  const [reducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (!active || reducedMotion) return

    const s = stateRef.current
    s.x = Math.random() * (window.innerWidth - LOGO_W)
    s.y = Math.random() * (window.innerHeight - LOGO_H)

    const tick = () => {
      const maxX = window.innerWidth - LOGO_W
      const maxY = window.innerHeight - LOGO_H
      s.x += s.dx
      s.y += s.dy
      let bounced = false
      if (s.x <= 0 || s.x >= maxX) {
        s.dx *= -1
        s.x = Math.min(Math.max(s.x, 0), maxX)
        bounced = true
      }
      if (s.y <= 0 || s.y >= maxY) {
        s.dy *= -1
        s.y = Math.min(Math.max(s.y, 0), maxY)
        bounced = true
      }
      if (bounced) s.colorIdx = (s.colorIdx + 1) % COLORS.length
      const el = logoRef.current
      if (el) {
        el.style.transform = `translate(${s.x}px, ${s.y}px)`
        el.style.color = COLORS[s.colorIdx]
        el.style.borderColor = COLORS[s.colorIdx]
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [active, reducedMotion])

  if (!active) return null

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Screen saver active — press any key or click to return"
      onClick={onDismiss}
      onKeyDown={onDismiss}
      onMouseMove={onDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 20000,
        background: '#000',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 12,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)',
          pointerEvents: 'none',
        }}
      >
        Move the mouse to wake up
      </div>
      {reducedMotion ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: -1,
            color: t.text === '#1d1d1f' ? '#fff' : t.text,
          }}
        >
          MeetMe
        </div>
      ) : (
        <div
          ref={logoRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: LOGO_W,
            height: LOGO_H,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: -1,
            border: '2px solid',
            borderRadius: 14,
            willChange: 'transform',
          }}
        >
          MeetMe
        </div>
      )}
    </div>
  )
}
