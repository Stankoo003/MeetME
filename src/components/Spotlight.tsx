import { useEffect, useRef, type KeyboardEvent } from 'react'
import type { Theme } from '../theme'
import { catalog, type WinId } from '../data'

interface SpotlightProps {
  t: Theme
  open: boolean
  query: string
  onQueryChange: (q: string) => void
  onChoose: (id: WinId) => void
  onClose: () => void
}

export function Spotlight({ t, open, query, onQueryChange, onChoose, onClose }: SpotlightProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const q = query.trim().toLowerCase()
  const results = q
    ? catalog.filter((i) => `${i.name} ${i.sub}`.toLowerCase().includes(q))
    : catalog

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && results.length) onChoose(results[0].target)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: open ? 'flex' : 'none',
        flexDirection: 'column',
        alignItems: 'center',
        background: t.spotBg,
      }}
    >
      <div onClick={onClose} style={{ position: 'absolute', inset: 0 }} />
      <div
        style={{
          position: 'relative',
          width: 580,
          maxWidth: '92vw',
          marginTop: 140,
          animation: 'spotpop .16s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            height: 62,
            padding: '0 20px',
            backdropFilter: 'saturate(180%) blur(30px)',
            WebkitBackdropFilter: 'saturate(180%) blur(30px)',
            border: '0.5px solid',
            borderRadius: 16,
            boxShadow: '0 30px 80px rgba(10,15,30,0.4)',
            background: t.spotBar,
            borderColor: t.spotBorder,
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ color: t.sub }}
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <line x1="15.5" y1="15.5" x2="21" y2="21" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Spotlight Search"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 24,
              fontFamily: 'inherit',
              color: t.spotText,
            }}
          />
        </div>
        {results.length > 0 && (
          <div
            style={{
              marginTop: 10,
              backdropFilter: 'saturate(180%) blur(30px)',
              WebkitBackdropFilter: 'saturate(180%) blur(30px)',
              border: '0.5px solid',
              borderRadius: 14,
              boxShadow: '0 30px 80px rgba(10,15,30,0.35)',
              overflow: 'hidden',
              padding: 6,
              background: t.spotPanel,
              borderColor: t.spotBorder,
            }}
          >
            {results.map((item) => (
              <div
                key={item.target}
                onClick={() => onChoose(item.target)}
                className="spot-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '10px 12px',
                  borderRadius: 9,
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 15,
                    background: item.color,
                  }}
                >
                  {item.letter}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: t.spotText }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 12, color: t.sub }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
