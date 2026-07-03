import type { CSSProperties, ReactNode, MouseEvent } from 'react'
import type { Theme } from '../theme'
import type { AppId } from '../data'

interface WindowProps {
  id: AppId
  title: string
  t: Theme
  positionStyle: CSSProperties
  frameStyle?: CSSProperties
  headerHeight?: number
  onFocus: (id: AppId) => void
  onClose: (id: AppId) => void
  onDragStart: (id: AppId, e: MouseEvent<HTMLDivElement>) => void
  children: ReactNode
}

export function Window({
  id,
  title,
  t,
  positionStyle,
  frameStyle,
  headerHeight = 40,
  onFocus,
  onClose,
  onDragStart,
  children,
}: WindowProps) {
  return (
    <div data-app={id} onMouseDown={() => onFocus(id)} style={positionStyle}>
      <div
        style={{
          border: '0.5px solid',
          borderRadius: 12,
          boxShadow: '0 24px 70px rgba(15,20,35,0.32), 0 2px 8px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          animation: 'winpop .18s ease',
          background: t.card,
          borderColor: t.cardBorder,
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
              style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }}
            />
            <div
              data-nodrag
              style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }}
            />
          </div>
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 13,
              fontWeight: 600,
              marginRight: 52,
              color: t.sub,
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
