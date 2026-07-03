import type { CSSProperties } from 'react'
import type { Theme } from '../theme'
import type { AppId } from '../data'

interface DockProps {
  t: Theme
  mobile: boolean
  onScrollToApp: (id: AppId) => void
  onOpenSpotlight: () => void
}

function DockIcon({
  id,
  title,
  onClick,
  mobile,
  children,
}: {
  id?: AppId
  title: string
  onClick: () => void
  mobile: boolean
  children: React.ReactNode
}) {
  return (
    <div
      data-app={id}
      onClick={onClick}
      title={title}
      className="dock-icon"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
    >
      {children}
      {mobile && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 500,
            color: 'var(--dock-label-color, inherit)',
            opacity: 0.75,
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </span>
      )}
    </div>
  )
}

export function Dock({ t, mobile, onScrollToApp, onOpenSpotlight }: DockProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9000,
        display: 'flex',
        alignItems: 'flex-end',
        gap: 12,
        padding: '10px 14px',
        backdropFilter: 'saturate(180%) blur(24px)',
        WebkitBackdropFilter: 'saturate(180%) blur(24px)',
        border: '0.5px solid',
        borderRadius: 22,
        boxShadow: '0 12px 40px rgba(15,20,35,0.28)',
        background: t.dockBg,
        borderColor: t.dockBorder,
        ...({ '--dock-label-color': t.barText } as CSSProperties),
        ...(mobile ? { maxWidth: '94vw', overflowX: 'auto' } : {}),
      }}
    >
      <DockIcon id="about" title="About Me" mobile={mobile} onClick={() => onScrollToApp('about')}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 13,
            background: 'linear-gradient(160deg,#8fb8ff,#5a8ff0)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ position: 'relative', width: 24, height: 24 }}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 7,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#fff',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 2,
                width: 20,
                height: 12,
                borderRadius: '10px 10px 3px 3px',
                background: '#fff',
              }}
            />
          </div>
        </div>
      </DockIcon>
      <DockIcon
        id="projects"
        title="Projects"
        mobile={mobile}
        onClick={() => onScrollToApp('projects')}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 13,
            background: 'linear-gradient(160deg,#f2f4f8,#dfe3ea)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: 30, height: 24, position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 3,
                width: 12,
                height: 5,
                background: '#6cb6ff',
                borderRadius: '3px 3px 0 0',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 4,
                left: 0,
                width: 30,
                height: 20,
                background: 'linear-gradient(180deg,#7cc0ff,#4a97ee)',
                borderRadius: 4,
              }}
            />
          </div>
        </div>
      </DockIcon>
      <DockIcon
        id="tools"
        title="Tools I Use"
        mobile={mobile}
        onClick={() => onScrollToApp('tools')}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 13,
            background: 'linear-gradient(160deg,#ffb35c,#f3902e)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 5,
            padding: 15,
          }}
        >
          <div style={{ background: '#fff', borderRadius: 3 }} />
          <div style={{ background: '#fff', borderRadius: 3 }} />
          <div style={{ background: '#fff', borderRadius: 3 }} />
          <div style={{ background: '#fff', borderRadius: 3 }} />
        </div>
      </DockIcon>
      <DockIcon
        id="github"
        title="Activity"
        mobile={mobile}
        onClick={() => onScrollToApp('github')}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 13,
            background: 'linear-gradient(160deg,#123c22,#0b2415)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 3,
            padding: 12,
          }}
        >
          {[
            '#2ea043',
            '#1e4a2e',
            '#39d353',
            '#1f7a3d',
            '#1f7a3d',
            '#39d353',
            '#2ea043',
            '#1e4a2e',
            '#39d353',
            '#1f7a3d',
            '#1e4a2e',
            '#2ea043',
            '#1e4a2e',
            '#2ea043',
            '#39d353',
            '#1f7a3d',
          ].map((c, i) => (
            <div key={i} style={{ borderRadius: 2, background: c }} />
          ))}
        </div>
      </DockIcon>
      <DockIcon
        id="nowplaying"
        title="Now Playing"
        mobile={mobile}
        onClick={() => onScrollToApp('nowplaying')}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 13,
            background: 'linear-gradient(160deg,#c98bff,#8a4fe0)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 26,
          }}
        >
          ♪
        </div>
      </DockIcon>
      <DockIcon
        id="weather"
        title="Milestones"
        mobile={mobile}
        onClick={() => onScrollToApp('weather')}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 13,
            background: 'linear-gradient(160deg,#63a4f0,#2f6fd0)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="30" height="30" viewBox="0 0 28 28" fill="none">
            <polyline
              points="3,22 10,15 17,17 25,6"
              stroke="#fff"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="3" cy="22" r="2.2" fill="#fff" />
            <circle cx="10" cy="15" r="2.2" fill="#fff" />
            <circle cx="17" cy="17" r="2.2" fill="#fff" />
            <circle cx="25" cy="6" r="3" fill="#ffd66b" />
          </svg>
        </div>
      </DockIcon>
      <DockIcon
        id="contact"
        title="Contact"
        mobile={mobile}
        onClick={() => onScrollToApp('contact')}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 13,
            background: 'linear-gradient(160deg,#5fd0a0,#28b57f)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 28,
              height: 20,
              background: '#fff',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                borderLeft: '14px solid transparent',
                borderRight: '14px solid transparent',
                borderTop: '12px solid #d8f0e4',
              }}
            />
          </div>
        </div>
      </DockIcon>
      <div style={{ width: 0.5, height: 42, margin: '0 1px', background: t.divider }} />
      <DockIcon title="Spotlight" mobile={mobile} onClick={onOpenSpotlight}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 13,
            background: 'linear-gradient(160deg,#3a3a3f,#1d1d1f)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.2"
          >
            <circle cx="10.5" cy="10.5" r="6.5" />
            <line x1="15.5" y1="15.5" x2="21" y2="21" />
          </svg>
        </div>
      </DockIcon>
    </div>
  )
}
