import type { CSSProperties, ReactNode, MouseEvent } from 'react'
import type { Theme } from '../theme'
import type { WinId } from '../data'

interface WindowProps {
  id: WinId
  title: string
  t: Theme
  positionStyle: CSSProperties
  frameStyle?: CSSProperties
  headerHeight?: number
  isActive?: boolean
  onFocus: (id: WinId) => void
  onClose: (id: WinId) => void
  onDragStart: (id: WinId, e: MouseEvent<HTMLDivElement>) => void
  children: ReactNode
}

export function Window({
  id,
  title,
  t,
  positionStyle,
  frameStyle,
  headerHeight = 40,
  isActive = true,
  onFocus,
  onClose,
  onDragStart,
  children,
}: WindowProps) {
  return (
    <div data-app={id} onMouseDown={() => onFocus(id)} style={positionStyle}>
      <div
        className="ds-window-frame"
        data-active={isActive}
        style={{
          border: '0.5px solid',
          borderRadius: 12,
          boxShadow: '0 24px 70px rgba(15,20,35,0.32), 0 2px 8px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          animation: 'winpop .18s ease',
          background: t.card,
          borderColor: isActive ? t.accentBorder : t.cardBorder,
          color: t.text,
          ...frameStyle,
        }}
      >
        <div
          onMouseDown={(e) => onDragStart(id, e)}
          style={{
            height: headerHeight,
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            borderBottom: '0.5px solid',
            background: t.head,
            borderBottomColor: t.line,
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            <div
              data-nodrag
              onClick={(e) => {
                e.stopPropagation()
                onClose(id)
              }}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#ff5f57',
                cursor: 'pointer',
              }}
            />
            <div
              data-nodrag
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#febc2e',
                opacity: 0.5,
                cursor: 'default',
              }}
            />
            <div
              data-nodrag
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#28c840',
                opacity: 0.5,
                cursor: 'default',
              }}
            />
          </div>
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 13,
              fontWeight: 600,
              marginRight: 52,
              color: isActive ? t.text : t.sub,
              transition: 'color .15s ease',
            }}
          >
            {title}
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
