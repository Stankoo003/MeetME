import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import type { Theme } from '../theme'
import { projects, tools, skills, milestones, type Project, type AppId } from '../data'
import { BrandIcon } from './BrandIcon'

const chipStyle = (t: Theme): CSSProperties => ({
  fontSize: 13,
  padding: '5px 12px',
  borderRadius: 8,
  background: t.chipBg,
  color: t.chipText,
})

export function AboutContent({ t }: { t: Theme }) {
  return (
    <div style={{ padding: '30px 34px 34px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 20 }}>
        <img
          src="/profile.jpg"
          alt="Aleksa Stanković"
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            flexShrink: 0,
            objectFit: 'cover',
          }}
        />
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.4 }}>Aleksa Stanković</div>
          <div style={{ fontSize: 15, color: '#0a84ff', fontWeight: 500 }}>
            Mobile & Backend Developer · CS Student
          </div>
          <div style={{ fontSize: 13, marginTop: 2, color: t.sub }}>Niš, Serbia · Open to work</div>
        </div>
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.65, margin: '0 0 18px' }}>
        Mobile and backend developer with hands-on experience building production apps in Swift,
        SwiftUI, Kotlin and React Native. Expanding into backend with .NET, gRPC and Node.js.
        Focused on clean architecture and real-world impact — currently completing a BSc in Computer
        Science at the University of Niš.
      </p>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginBottom: 10,
          color: t.sub,
        }}
      >
        Skills
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {skills.map((s) => (
          <span key={s} style={chipStyle(t)}>
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

export function ProjectsContent({
  t,
  onOpenProject,
}: {
  t: Theme
  onOpenProject: (idx: number) => void
}) {
  const sideItem = (label: string) => (
    <div
      key={label}
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', color: t.sub }}
    >
      <span
        style={{
          width: 14,
          height: 12,
          background: '#b0b4bc',
          borderRadius: 3,
          display: 'inline-block',
        }}
      />
      {label}
    </div>
  )
  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      <div
        style={{
          width: 168,
          borderRight: '0.5px solid',
          padding: '14px 10px',
          fontSize: 13,
          background: t.sideBg,
          borderRightColor: t.line,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.4,
            padding: '0 8px 6px',
            color: t.sub,
          }}
        >
          Favorites
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 8px',
            borderRadius: 6,
            background: 'rgba(10,132,255,0.16)',
            color: '#0a84ff',
            fontWeight: 500,
          }}
        >
          <span
            style={{
              width: 14,
              height: 12,
              background: '#0a84ff',
              borderRadius: 3,
              display: 'inline-block',
            }}
          />
          Projects
        </div>
        {['Recents', 'Documents', 'Desktop'].map(sideItem)}
      </div>
      <div
        style={{
          flex: 1,
          padding: 20,
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px 12px',
          alignContent: 'start',
        }}
      >
        {projects.map((p, idx) => (
          <div
            key={p.name}
            onClick={() => onOpenProject(idx)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 62,
                height: 76,
                background: t.card,
                border: `1px solid ${t.line}`,
                borderRadius: 6,
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 22,
                  background: p.bar,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 30,
                  left: 8,
                  right: 8,
                  height: 3,
                  background: t.line,
                  borderRadius: 2,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 38,
                  left: 8,
                  right: 16,
                  height: 3,
                  background: t.line,
                  borderRadius: 2,
                }}
              />
            </div>
            <span style={{ fontSize: 12, textAlign: 'center' }}>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectScreenshot({
  t,
  project,
  onOpen,
}: {
  t: Theme
  project: Project
  onOpen: (src: string, alt: string) => void
}) {
  const [failed, setFailed] = useState(false)
  const hasImage = Boolean(project.screenshot) && !failed

  return (
    <div
      onClick={
        hasImage
          ? () => onOpen(project.screenshot as string, `${project.full} screenshot`)
          : undefined
      }
      title={hasImage ? 'View full screenshot' : undefined}
      style={{
        width: '100%',
        height: 200,
        borderRadius: 10,
        overflow: 'hidden',
        border: `1px solid ${t.line}`,
        marginBottom: 20,
        cursor: hasImage ? 'zoom-in' : 'default',
        backgroundImage: hasImage
          ? undefined
          : `repeating-linear-gradient(135deg, ${t.stripeA} 0 12px, ${t.stripeB} 12px 24px)`,
        display: hasImage ? 'block' : 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {hasImage ? (
        <img
          src={project.screenshot}
          alt={`${project.full} screenshot`}
          loading="lazy"
          onError={() => setFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <span
          style={{
            fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
            fontSize: 12,
            color: t.sub,
          }}
        >
          [ project screenshot ]
        </span>
      )}
    </div>
  )
}

export function ProjectDetailContent({
  t,
  project,
  onOpenScreenshot,
}: {
  t: Theme
  project: Project
  onOpenScreenshot: (src: string, alt: string) => void
}) {
  return (
    <div style={{ padding: '26px 30px 30px' }}>
      <ProjectScreenshot key={project.name} t={t} project={project} onOpen={onOpenScreenshot} />
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.3 }}>{project.full}</div>
        <div style={{ fontSize: 12, color: t.sub, whiteSpace: 'nowrap' }}>{project.period}</div>
      </div>
      <div style={{ fontSize: 13, color: t.sub, marginTop: 3 }}>{project.org}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, margin: '12px 0 16px' }}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: 12,
              padding: '4px 10px',
              background: 'rgba(10,132,255,0.14)',
              color: '#0a84ff',
              borderRadius: 7,
              fontWeight: 500,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.65, margin: '0 0 20px' }}>{project.desc}</p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          disabled
          title="Link coming soon"
          style={{
            fontSize: 13,
            fontWeight: 500,
            padding: '8px 16px',
            background: '#0a84ff',
            color: '#fff',
            opacity: 0.45,
            border: 'none',
            borderRadius: 8,
            cursor: 'not-allowed',
          }}
        >
          View Live
        </button>
        <button
          disabled
          title="Link coming soon"
          style={{
            fontSize: 13,
            fontWeight: 500,
            padding: '8px 16px',
            border: 'none',
            borderRadius: 8,
            cursor: 'not-allowed',
            opacity: 0.45,
            background: t.chipBg,
            color: t.chipText,
          }}
        >
          Source
        </button>
      </div>
    </div>
  )
}

export function ToolsContent({ t }: { t: Theme }) {
  return (
    <div style={{ padding: '24px 26px 28px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px 14px' }}>
        {tools.map((tool) => (
          <div
            key={tool.name}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9 }}
          >
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 8px rgba(0,0,0,0.14)',
                background: tool.color,
              }}
            >
              <BrandIcon name={tool.icon} size={26} color="#fff" />
            </div>
            <span style={{ fontSize: 12, textAlign: 'center', color: t.chipText }}>
              {tool.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export type ActivityState =
  { status: 'loading' } | { status: 'error' } | { status: 'ready'; total: number; cells: number[] }

export function ActivityContent({
  t,
  activity,
  palette,
}: {
  t: Theme
  activity: ActivityState
  palette: string[]
}) {
  const cells = activity.status === 'ready' ? activity.cells : []

  return (
    <div style={{ padding: '24px 26px 26px' }}>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>Contribution activity</div>
      <div style={{ fontSize: 13, marginBottom: 18, color: t.sub }}>
        {activity.status === 'ready' && (
          <>
            <span style={{ color: t.text, fontWeight: 600 }}>{activity.total}</span> contributions
            in the last year · live from github.com/stankoo003
          </>
        )}
        {activity.status === 'loading' && 'Loading live activity…'}
        {activity.status === 'error' && 'Live activity unavailable right now'}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateRows: 'repeat(7, 12px)',
          gridAutoFlow: 'column',
          gridAutoColumns: 12,
          gap: 3,
          overflowX: 'auto',
          paddingBottom: 4,
          opacity: activity.status === 'ready' ? 1 : 0.4,
        }}
      >
        {(cells.length > 0 ? cells : Array.from({ length: 371 }, () => 0)).map((level, i) => (
          <div
            key={i}
            style={{ width: 12, height: 12, borderRadius: 3, background: palette[level] }}
          />
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 6,
          marginTop: 14,
          fontSize: 12,
          color: t.sub,
        }}
      >
        <span>Less</span>
        {palette.map((c) => (
          <div key={c} style={{ width: 11, height: 11, borderRadius: 3, background: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}

export function NowPlayingWidget({
  positionStyle,
  onFocus,
  onClose,
  onDragStart,
}: {
  positionStyle: CSSProperties
  onFocus: (id: AppId) => void
  onClose: (id: AppId) => void
  onDragStart: (id: AppId, e: MouseEvent<HTMLDivElement>) => void
}) {
  return (
    <div data-app="nowplaying" onMouseDown={() => onFocus('nowplaying')} style={positionStyle}>
      <div
        style={{
          borderRadius: 20,
          boxShadow: '0 24px 70px rgba(15,20,35,0.4), 0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          animation: 'winpop .18s ease',
          background: 'linear-gradient(165deg,#2c2233 0%,#1d1826 55%,#161320 100%)',
          color: '#f4f2f8',
        }}
      >
        <div
          onMouseDown={(e) => onDragStart('nowplaying', e)}
          style={{
            padding: '15px 18px 0',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#d3a8ff' }}>
            NOW PLAYING
          </div>
          <div
            data-nodrag
            onClick={(e) => {
              e.stopPropagation()
              onClose('nowplaying')
            }}
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 13,
              lineHeight: 1,
            }}
          >
            ×
          </div>
        </div>
        <div style={{ padding: '12px 18px 4px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 10,
              flexShrink: 0,
              backgroundImage:
                'repeating-linear-gradient(135deg, rgba(255,255,255,0.14) 0 8px, rgba(255,255,255,0.06) 8px 16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
            }}
          >
            ♪
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Late-night coding
            </div>
            <div style={{ fontSize: 13, color: 'rgba(244,242,248,0.7)' }}>Lo-fi focus beats</div>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 3,
                height: 16,
                marginTop: 8,
              }}
            >
              {[0, 0.15, 0.3, 0.45, 0.6].map((delay) => (
                <div
                  key={delay}
                  style={{
                    width: 3,
                    background: '#d3a8ff',
                    borderRadius: 2,
                    animation: `eq 0.9s ease-in-out ${delay}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div style={{ margin: '12px 18px 0', height: 0.5, background: 'rgba(255,255,255,0.14)' }} />
        <div style={{ padding: '14px 18px 18px' }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              color: '#7fe3b0',
              marginBottom: 8,
            }}
          >
            CURRENTLY BUILDING
          </div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Ora — Time Focus App</div>
          <div style={{ fontSize: 13, color: 'rgba(244,242,248,0.7)', marginTop: 2 }}>
            iOS / watchOS focus app with flow scoring & Apple Watch support.
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 10,
              padding: '4px 10px',
              background: 'rgba(127,227,176,0.16)',
              borderRadius: 20,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7fe3b0' }} />
            <span style={{ fontSize: 12, color: '#7fe3b0', fontWeight: 500 }}>In progress</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MilestonesContent({ t }: { t: Theme }) {
  return (
    <>
      <div
        style={{
          position: 'relative',
          height: 74,
          background: 'linear-gradient(180deg,#20305c 0%,#33477a 55%,#4d6aa6 100%)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 18,
            height: 1,
            background: 'rgba(255,255,255,0.22)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 24,
            bottom: 8,
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: '#ffd66b',
            boxShadow: '0 0 20px 6px rgba(255,214,107,0.4)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 11,
            left: 14,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: 1.5,
            color: 'rgba(255,255,255,0.72)',
          }}
        >
          FORECAST — CAREER
        </div>
      </div>
      <div style={{ padding: '15px 18px 2px', display: 'flex', alignItems: 'baseline', gap: 11 }}>
        <div
          style={{
            fontSize: 40,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: -1.5,
          }}
        >
          2026
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6 }}>GRADUATION</div>
          <div style={{ fontSize: 12, color: t.sub }}>BSc Computer Science · expected</div>
        </div>
        <div
          style={{
            marginLeft: 'auto',
            fontFamily: "ui-monospace,'SF Mono',Menlo,monospace",
            fontSize: 10,
            letterSpacing: 0.5,
            color: '#0a84ff',
            alignSelf: 'flex-start',
            marginTop: 2,
          }}
        >
          ▲ ON TRACK
        </div>
      </div>
      <div style={{ position: 'relative', margin: '14px 16px 18px' }}>
        <div
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            top: 6,
            height: 1.5,
            background: t.line,
          }}
        />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
          {milestones.map((m) => (
            <div
              key={m.year}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 7,
              }}
            >
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: t.sub }} />
              <div style={{ fontSize: 11, fontWeight: 500 }}>{m.year}</div>
              <div style={{ fontSize: 10, color: t.sub }}>{m.label}</div>
            </div>
          ))}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 7,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#0a84ff',
                boxShadow: '0 0 0 4px rgba(10,132,255,0.18)',
              }}
            />
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0a84ff' }}>2026</div>
            <div style={{ fontSize: 10, color: '#0a84ff' }}>Grad</div>
          </div>
        </div>
      </div>
    </>
  )
}

export function ContactContent({ t }: { t: Theme }) {
  const linkBase: CSSProperties = {
    textDecoration: 'none',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 500,
    padding: 11,
    border: 'none',
    borderRadius: 9,
    cursor: 'pointer',
  }
  return (
    <div style={{ padding: '30px 30px 32px', textAlign: 'center' }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'linear-gradient(145deg,#5aa9ff,#2f6fd0)',
          margin: '0 auto 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 22,
          fontWeight: 600,
        }}
      >
        AS
      </div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>Let's connect</div>
      <div style={{ fontSize: 13, margin: '4px 0 20px', color: t.sub }}>
        aleksastbusiness@gmail.com
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <a
          href="mailto:aleksastbusiness@gmail.com"
          style={{ ...linkBase, background: '#0a84ff', color: '#fff' }}
        >
          Email me
        </a>
        <a
          href="https://github.com/stankoo003"
          target="_blank"
          rel="noopener"
          style={{ ...linkBase, background: t.chipBg, color: t.chipText }}
        >
          GitHub — stankoo003
        </a>
        <a
          href="https://linkedin.com/in/stankoo003"
          target="_blank"
          rel="noopener"
          style={{ ...linkBase, background: t.chipBg, color: t.chipText }}
        >
          LinkedIn — stankoo003
        </a>
      </div>
    </div>
  )
}

const TERMINAL_EMAIL = 'aleksastbusiness@gmail.com'
const TERMINAL_HELP = [
  'Available commands:',
  '  whoami            who you are talking to',
  '  ls [projects]     list files, or list projects/',
  '  cat <file>        about.txt · contact.txt',
  '  open <project>    opens a project window',
  '  contact --email   print my email',
  '  date              current date & time',
  '  clear             clear the screen',
  '  help              show this list',
]

type TermSlug = { slug: string; idx: number }

function projectSlugs(): TermSlug[] {
  return projects.map((p, idx) => ({ slug: p.name.toLowerCase().replace(/\s+/g, '-'), idx }))
}

function runTerminalCommand(raw: string, onOpenProject: (idx: number) => void): string[] {
  const trimmed = raw.trim()
  if (!trimmed) return []
  const [cmd, ...rest] = trimmed.split(/\s+/)
  const arg = rest.join(' ')
  switch (cmd.toLowerCase()) {
    case 'help':
      return TERMINAL_HELP
    case 'whoami':
      return ['aleksa — iOS / React Native / full-stack developer, building things that ship.']
    case 'ls':
      if (arg === 'projects') return projectSlugs().map((p) => p.slug)
      return ['about.txt  contact.txt  projects/']
    case 'cat':
      if (arg === 'about.txt') {
        return [
          'Aleksa Stanković — building iOS, React Native, and full-stack apps.',
          'Currently: Ora, a time-focus app for iOS/watchOS.',
        ]
      }
      if (arg === 'contact.txt') {
        return [
          `email:    ${TERMINAL_EMAIL}`,
          'github:   github.com/stankoo003',
          'linkedin: linkedin.com/in/stankoo003',
        ]
      }
      return [`cat: ${arg || '(missing file)'}: No such file`]
    case 'contact':
      if (arg === '--email') return [TERMINAL_EMAIL]
      return ['usage: contact --email']
    case 'open': {
      const match = projectSlugs().find((p) => p.slug === arg.toLowerCase())
      if (match) {
        onOpenProject(match.idx)
        return [`Opening ${projects[match.idx].name}…`]
      }
      return [`open: ${arg || '(missing project)'}: not found — try 'ls projects'`]
    }
    case 'clear':
      return ['__CLEAR__']
    case 'date':
      return [new Date().toString()]
    case 'sudo':
      return ['Permission denied: nice try 😏']
    default:
      return [`command not found: ${cmd} — type 'help'`]
  }
}

interface TermLine {
  id: number
  kind: 'cmd' | 'out'
  text: string
}

export function TerminalContent({
  t,
  onOpenProject,
}: {
  t: Theme
  onOpenProject: (idx: number) => void
}) {
  const [lines, setLines] = useState<TermLine[]>([
    { id: -1, kind: 'out', text: "Welcome. Type 'help' to see what's available." },
  ])
  const [typing, setTyping] = useState<{ id: number; full: string; shown: number } | null>(null)
  const queueRef = useRef<string[]>([])
  const idRef = useRef(0)
  const [input, setInput] = useState('')
  const bodyRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // A single interval drives both dequeuing and the typewriter reveal — all
  // state updates happen inside its callback (not synchronously in the
  // effect body) so mount-time setup never triggers a cascading render.
  useEffect(() => {
    const timer = setInterval(() => {
      setTyping((prev) => {
        if (prev) {
          if (prev.shown >= prev.full.length) {
            setLines((ls) => [...ls, { id: prev.id, kind: 'out', text: prev.full }])
            return null
          }
          return { ...prev, shown: prev.shown + 1 }
        }
        const next = queueRef.current.shift()
        if (next === undefined) return prev
        idRef.current += 1
        return { id: idRef.current, full: next, shown: 0 }
      })
    }, 10)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  })

  const submit = () => {
    const cmd = input
    idRef.current += 1
    setLines((ls) => [...ls, { id: idRef.current, kind: 'cmd', text: cmd }])
    setInput('')
    const outputs = runTerminalCommand(cmd, onOpenProject)
    if (outputs[0] === '__CLEAR__') {
      queueRef.current = []
      setTyping(null)
      setLines([])
      return
    }
    queueRef.current.push(...outputs)
  }

  return (
    <div
      data-nodrag
      onClick={() => inputRef.current?.focus()}
      style={{
        background: '#0d0e12',
        color: '#7fe38f',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
        fontSize: 13,
        height: 320,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {lines.map((l) => (
          <div key={l.id} style={{ whiteSpace: 'pre-wrap', marginBottom: 2 }}>
            {l.kind === 'cmd' ? (
              <span>
                <span style={{ color: '#5aa9ff' }}>guest@meetme</span>
                <span style={{ color: t.sub }}> ~ % </span>
                {l.text}
              </span>
            ) : (
              l.text
            )}
          </div>
        ))}
        {typing && (
          <div style={{ whiteSpace: 'pre-wrap', marginBottom: 2 }}>
            {typing.full.slice(0, typing.shown)}
            <span style={{ opacity: 0.7 }}>▋</span>
          </div>
        )}
        <div style={{ display: 'flex' }}>
          <span style={{ color: '#5aa9ff' }}>guest@meetme</span>
          <span style={{ color: t.sub }}>&nbsp;~ %&nbsp;</span>
          <input
            ref={inputRef}
            data-nodrag
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit()
            }}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#7fe38f',
              fontFamily: 'inherit',
              fontSize: 13,
            }}
          />
        </div>
      </div>
    </div>
  )
}
