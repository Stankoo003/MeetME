import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { Theme } from '../theme'

interface LockScreenProps {
  t: Theme
  onUnlock: () => void
}

const VALID_PASSWORD = 'admin'

function formatClock(date: Date) {
  const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  const day = date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
  return { time, day }
}

// A fake macOS login gate on first load — pure theater (password is "admin",
// hinted right on screen), but it sells the "this is a whole desktop" bit
// before the visitor ever sees a window.
export function LockScreen({ t, onUnlock }: LockScreenProps) {
  const [now, setNow] = useState(() => new Date())
  const [password, setPassword] = useState('')
  const [shake, setShake] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (password.trim().toLowerCase() === VALID_PASSWORD) {
      setLeaving(true)
      setTimeout(onUnlock, 500)
    } else {
      setShake(true)
      setPassword('')
      setTimeout(() => setShake(false), 500)
    }
  }

  const { time, day } = formatClock(now)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 30000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(165deg,#3a3f52 0%,#23283a 55%,#181c28 100%)',
        color: '#fff',
        opacity: leaving ? 0 : 1,
        transform: leaving ? 'scale(1.03)' : 'scale(1)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 46 }}>
        <div style={{ fontSize: 64, fontWeight: 300, letterSpacing: -1 }}>{time}</div>
        <div style={{ fontSize: 17, marginTop: 4, color: 'rgba(255,255,255,0.75)' }}>{day}</div>
      </div>

      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: '50%',
          background: 'linear-gradient(160deg,#0a84ff,#5e5ce6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 30,
          fontWeight: 600,
          marginBottom: 14,
          border: `2px solid ${t.accentBorder}`,
          boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
        }}
      >
        AS
      </div>
      <div style={{ fontSize: 17, fontWeight: 500, marginBottom: 18 }}>Aleksa Stanković</div>

      <form
        onSubmit={submit}
        style={{
          animation: shake ? 'lockshake 0.4s' : undefined,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <input
          ref={inputRef}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          autoFocus
          style={{
            width: 220,
            padding: '9px 14px',
            borderRadius: 20,
            border: shake ? '1px solid #ff453a' : '1px solid rgba(255,255,255,0.25)',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            fontSize: 14,
            textAlign: 'center',
            outline: 'none',
          }}
        />
        <div
          style={{
            marginTop: 12,
            fontSize: 12,
            color: shake ? '#ff453a' : 'rgba(255,255,255,0.45)',
          }}
        >
          {shake ? 'Wrong password. Try again.' : `Hint: it's "${VALID_PASSWORD}"`}
        </div>
      </form>

      <style>{`
        @keyframes lockshake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        @media (prefers-reduced-motion: reduce) {
          form { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
