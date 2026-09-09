import { useEffect, type MouseEvent } from 'react'
import type { Theme } from '../theme'

interface NoticeDialogProps {
  t: Theme
  open: boolean
  title: string
  body: string
  /** Address the primary button opens a pre-filled mail to. */
  email: string
  emailSubject: string
  onClose: () => void
}

/**
 * A macOS-style alert used where a project has no public URL to open — the
 * build only exists behind internal testing, so the button explains how to get
 * access instead of leading nowhere.
 */
export function NoticeDialog({
  t,
  open,
  title,
  body,
  email,
  emailSubject,
  onClose,
}: NoticeDialogProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const stop = (e: MouseEvent) => e.stopPropagation()

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 11000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: 'rgba(10,12,18,0.55)',
        backdropFilter: 'saturate(150%) blur(6px)',
        WebkitBackdropFilter: 'saturate(150%) blur(6px)',
        animation: 'spotpop .16s ease',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={stop}
        onMouseDown={stop}
        style={{
          width: 'min(380px, 92vw)',
          padding: '26px 24px 20px',
          borderRadius: 14,
          textAlign: 'center',
          background: t.card,
          color: t.text,
          border: `0.5px solid ${t.line}`,
          boxShadow: '0 30px 90px rgba(0,0,0,0.45)',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 52,
            height: 52,
            margin: '0 auto 14px',
            borderRadius: 13,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            background: 'linear-gradient(160deg,#ff92bd,#e0397a)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.22)',
          }}
        >
          ✉
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.2 }}>{title}</div>
        <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: '8px 0 18px', color: t.sub }}>
          {body}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <a
            href={`mailto:${email}?subject=${encodeURIComponent(emailSubject)}`}
            style={{
              fontSize: 13,
              fontWeight: 600,
              padding: '9px 16px',
              borderRadius: 9,
              textDecoration: 'none',
              background: '#0a84ff',
              color: '#fff',
            }}
          >
            Email {email}
          </a>
          <button
            onClick={onClose}
            style={{
              fontSize: 13,
              fontWeight: 500,
              padding: '9px 16px',
              borderRadius: 9,
              border: 'none',
              cursor: 'pointer',
              background: t.chipBg,
              color: t.chipText,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
