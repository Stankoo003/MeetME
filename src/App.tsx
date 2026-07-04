import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react'
import { darkTheme, lightTheme, contributionPalette } from './theme'
import { projects, projectWinId, type AppId, type WinId } from './data'
import { Window } from './components/Window'
import {
  AboutContent,
  ProjectsContent,
  ProjectDetailContent,
  ToolsContent,
  ActivityContent,
  NowPlayingWidget,
  MilestonesContent,
  ContactContent,
  TerminalContent,
  type ActivityState,
} from './components/windows'
import { Dock } from './components/Dock'
import { Spotlight } from './components/Spotlight'
import { Lightbox } from './components/Lightbox'
import { ScreenSaver } from './components/ScreenSaver'
import { LockScreen } from './components/LockScreen'
import { fetchContributions } from './lib/github'
import { useIdle } from './lib/useIdle'

const CANVAS_HEIGHT = 2760
const MOBILE_BREAKPOINT = 760

interface WinState {
  open: boolean
  x: number
  y: number
  z: number
  w: number
}

const PROJECT_WIN_W = 480
const PROJECT_WIN_H = 500
const PROJECT_START = { x: 580, y: 1200 }

// Only About, Projects, and Now Playing greet a first-time visitor — the rest
// start closed so the initial view is skimmable instead of all 8 at once.
const fixedInitialWins: Record<AppId, WinState> = {
  about: { open: true, x: 90, y: 330, z: 1, w: 440 },
  nowplaying: { open: true, x: 570, y: 300, z: 2, w: 300 },
  projects: { open: true, x: 110, y: 660, z: 3, w: 600 },
  weather: { open: false, x: 740, y: 680, z: 4, w: 340 },
  tools: { open: false, x: 110, y: 1240, z: 5, w: 440 },
  github: { open: false, x: 110, y: 1760, z: 7, w: 780 },
  contact: { open: false, x: 360, y: 2280, z: 8, w: 360 },
  terminal: { open: false, x: 740, y: 1240, z: 9, w: 460 },
}

// Every project gets its own independent window, closed by default, so
// several can be open side by side instead of sharing one shared slot.
const initialWins: Record<WinId, WinState> = {
  ...fixedInitialWins,
  ...Object.fromEntries(
    projects.map((_, idx) => [
      projectWinId(idx),
      { open: false, x: PROJECT_START.x, y: PROJECT_START.y, z: 0, w: PROJECT_WIN_W },
    ]),
  ),
}

// Approximate rendered heights, used only to keep freshly-opened windows from
// landing on top of ones that are already open — not the source of truth for
// layout (the DOM decides actual height).
const WINDOW_HEIGHT: Record<AppId, number> = {
  about: 330,
  nowplaying: 300,
  projects: 460,
  weather: 380,
  tools: 300,
  github: 380,
  contact: 360,
  terminal: 360,
}

function getWindowHeight(id: WinId): number {
  return id.startsWith('project-') ? PROJECT_WIN_H : WINDOW_HEIGHT[id as AppId]
}

const PLACEMENT_MARGIN = 24
const PLACEMENT_STEP = 40

function rectsOverlap(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
  margin = PLACEMENT_MARGIN,
) {
  return !(
    a.x + a.w + margin <= b.x ||
    b.x + b.w + margin <= a.x ||
    a.y + a.h + margin <= b.y ||
    b.y + b.h + margin <= a.y
  )
}

// Finds the first on-canvas spot for `id` that doesn't overlap any other
// currently-open window, cascading diagonally from its default position.
function findFreePosition(id: WinId, wins: Record<WinId, WinState>, canvasWidth: number) {
  const { w } = wins[id]
  const h = getWindowHeight(id)
  const maxX = Math.max(0, canvasWidth - w)
  const maxY = Math.max(10, CANVAS_HEIGHT - h - 40)
  const openRects = Object.entries(wins)
    .filter(([otherId, other]) => otherId !== id && other.open)
    .map(([otherId, other]) => ({
      x: other.x,
      y: other.y,
      w: other.w,
      h: getWindowHeight(otherId as WinId),
    }))

  let x = initialWins[id].x
  let y = initialWins[id].y
  for (let attempt = 0; attempt < 60; attempt++) {
    const cx = Math.min(Math.max(x, 0), maxX)
    const cy = Math.min(Math.max(y, 10), maxY)
    const candidate = { x: cx, y: cy, w, h }
    if (!openRects.some((r) => rectsOverlap(candidate, r))) {
      return { x: cx, y: cy }
    }
    x += PLACEMENT_STEP
    y += PLACEMENT_STEP
    if (x > maxX) x = PLACEMENT_MARGIN
    if (y > maxY) y = 10
  }
  return {
    x: Math.min(Math.max(initialWins[id].x, 0), maxX),
    y: Math.min(Math.max(initialWins[id].y, 10), maxY),
  }
}

function scrollToElement(id: WinId) {
  setTimeout(() => {
    const el = document.querySelector(`[data-app="${id}"]`)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 90
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    }
  }, 40)
}

function App() {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem('meetme-dark') === '1'
    } catch {
      return false
    }
  })
  const [vw, setVw] = useState(() => window.innerWidth)
  const [wins, setWins] = useState(initialWins)
  const [spotlight, setSpotlight] = useState(false)
  const [query, setQuery] = useState('')
  const [zTop, setZTop] = useState(8)
  const [activity, setActivity] = useState<ActivityState>({ status: 'loading' })
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)
  const [locked, setLocked] = useState(true)
  const idle = useIdle(20_000)
  const zTopRef = useRef(8)
  const dragRef = useRef<{ id: WinId; dx: number; dy: number } | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchContributions()
      .then((data) => {
        if (!cancelled) setActivity({ status: 'ready', ...data })
      })
      .catch(() => {
        if (!cancelled) setActivity({ status: 'error' })
      })
    return () => {
      cancelled = true
    }
  }, [])

  const t = dark ? darkTheme : lightTheme
  const palette = dark ? contributionPalette.dark : contributionPalette.light
  const mobile = vw < MOBILE_BREAKPOINT

  const bringToFront = useCallback(
    (
      id: WinId,
      patch?:
        | Partial<WinState>
        | ((current: WinState, all: Record<WinId, WinState>) => Partial<WinState>),
    ) => {
      zTopRef.current += 1
      const z = zTopRef.current
      setZTop(z)
      setWins((s) => {
        const resolved = typeof patch === 'function' ? patch(s[id], s) : patch
        return { ...s, [id]: { ...s[id], z, ...resolved } }
      })
    },
    [],
  )

  useEffect(() => {
    // Keep every window on-screen as the viewport shrinks — windows may now
    // roam across the full width, so nothing else clamps them into view.
    const onResize = () => {
      const nextVw = window.innerWidth
      setVw(nextVw)
      if (nextVw < MOBILE_BREAKPOINT) return
      setWins((s) => {
        let changed = false
        const next = { ...s }
        for (const id of Object.keys(s) as WinId[]) {
          const w = s[id]
          const maxX = Math.max(0, nextVw - w.w)
          if (w.x > maxX) {
            next[id] = { ...w, x: maxX }
            changed = true
          }
        }
        return changed ? next : s
      })
    }
    const onMove = (e: globalThis.MouseEvent) => {
      const drag = dragRef.current
      if (!drag) return
      e.preventDefault()
      setWins((s) => {
        const w = s[drag.id]
        const nx = Math.min(Math.max(e.pageX - drag.dx, 0), window.innerWidth - w.w)
        const ny = Math.min(Math.max(e.pageY - drag.dy, 10), CANVAS_HEIGHT - 40)
        return { ...s, [drag.id]: { ...w, x: nx, y: ny } }
      })
    }
    const onUp = () => {
      dragRef.current = null
    }
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSpotlight(false)
        setLightbox(null)
      }
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault()
        setQuery('')
        setSpotlight((s) => !s)
      }
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('keydown', onKey)
    onResize()
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const toggleDark = () => {
    setDark((d) => {
      try {
        localStorage.setItem('meetme-dark', d ? '0' : '1')
      } catch {
        // localStorage unavailable — theme just won't persist
      }
      return !d
    })
  }

  const focusApp = useCallback((id: WinId) => bringToFront(id), [bringToFront])

  const closeApp = useCallback((id: WinId) => {
    setWins((s) => ({ ...s, [id]: { ...s[id], open: false } }))
  }, [])

  const startDrag = useCallback(
    (id: WinId, e: MouseEvent<HTMLDivElement>) => {
      if (window.innerWidth < MOBILE_BREAKPOINT) return
      if ((e.target as HTMLElement).closest('[data-nodrag]')) return
      e.preventDefault()
      const w = wins[id]
      dragRef.current = { id, dx: e.pageX - w.x, dy: e.pageY - w.y }
      bringToFront(id)
    },
    [bringToFront, wins],
  )

  const scrollToApp = useCallback(
    (id: WinId) => {
      setWins((s) => {
        if (s[id].open) return s
        const pos = findFreePosition(id, s, vw)
        return { ...s, [id]: { ...s[id], open: true, ...pos } }
      })
      scrollToElement(id)
    },
    [vw],
  )

  const openProject = useCallback(
    (idx: number) => {
      const id = projectWinId(idx)
      bringToFront(id, (w, all) =>
        w.open ? { open: true } : { open: true, ...findFreePosition(id, all, vw) },
      )
      scrollToElement(id)
    },
    [bringToFront, vw],
  )

  const chooseSpotlightResult = useCallback(
    (id: WinId) => {
      setSpotlight(false)
      setQuery('')
      bringToFront(id, (w, all) =>
        w.open ? { open: true } : { open: true, ...findFreePosition(id, all, vw) },
      )
      scrollToElement(id)
    },
    [bringToFront, vw],
  )

  const winStyle = (id: WinId): CSSProperties => {
    const w = wins[id]
    if (mobile) {
      return {
        position: 'relative',
        width: 'min(440px, 92vw)',
        margin: '0 auto 22px',
        zIndex: 1,
        display: w.open ? 'block' : 'none',
      }
    }
    return {
      position: 'absolute',
      left: w.x,
      top: w.y,
      width: w.w,
      zIndex: w.z,
      display: w.open ? 'block' : 'none',
    }
  }

  const windowProps = {
    t,
    onFocus: focusApp,
    onClose: closeApp,
    onDragStart: startDrag,
  }

  const isActive = (id: WinId) => mobile || wins[id].z === zTop

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        userSelect: 'none',
        cursor: 'default',
        background: t.desktop,
      }}
    >
      <div
        onClick={toggleDark}
        title="Toggle appearance"
        style={{
          position: 'fixed',
          top: 20,
          right: 24,
          zIndex: 9500,
          width: 40,
          height: 40,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          cursor: 'pointer',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          border: '0.5px solid',
          background: t.pillBg,
          borderColor: t.pillBorder,
          color: t.barText,
          boxShadow: '0 6px 18px rgba(20,30,50,0.16)',
        }}
      >
        {dark ? '☀' : '☾'}
      </div>

      <div
        style={
          mobile
            ? { position: 'relative', width: '100%', padding: '84px 0 150px' }
            : {
                position: 'relative',
                width: '100%',
                height: CANVAS_HEIGHT,
                overflow: 'hidden',
              }
        }
      >
        <div
          style={
            mobile
              ? {
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }
              : {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: CANVAS_HEIGHT,
                }
          }
        >
          <div
            style={
              mobile
                ? {
                    position: 'relative',
                    textAlign: 'center',
                    margin: '0 0 14px',
                    padding: '0 16px',
                    pointerEvents: 'none',
                  }
                : {
                    position: 'absolute',
                    top: 74,
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    pointerEvents: 'none',
                    zIndex: 0,
                  }
            }
          >
            <div
              style={{
                fontSize: 'clamp(60px, 17vw, 148px)',
                fontWeight: 700,
                letterSpacing: -6,
                lineHeight: 1,
                color: t.watermark,
              }}
            >
              MeetMe
            </div>
            <div
              style={{
                fontSize: 'clamp(11px, 3vw, 14px)',
                letterSpacing: 3,
                textTransform: 'uppercase',
                marginTop: 6,
                color: t.sub,
              }}
            >
              A desktop of my work — scroll to explore
            </div>
          </div>

          <Window
            id="about"
            title="About Me — Resume.txt"
            positionStyle={winStyle('about')}
            isActive={isActive('about')}
            {...windowProps}
          >
            <AboutContent t={t} />
          </Window>

          <Window
            id="projects"
            title="Projects"
            positionStyle={winStyle('projects')}
            headerHeight={44}
            frameStyle={{ display: 'flex', flexDirection: 'column', height: 460 }}
            isActive={isActive('projects')}
            {...windowProps}
          >
            <ProjectsContent t={t} onOpenProject={openProject} />
          </Window>

          {projects.map((project, idx) => {
            const id = projectWinId(idx)
            return (
              <Window
                key={id}
                id={id}
                title={project.name}
                positionStyle={winStyle(id)}
                isActive={isActive(id)}
                {...windowProps}
              >
                <ProjectDetailContent
                  t={t}
                  project={project}
                  onOpenScreenshot={(src, alt) => setLightbox({ src, alt })}
                />
              </Window>
            )
          })}

          <Window
            id="tools"
            title="Tools I Use"
            positionStyle={winStyle('tools')}
            isActive={isActive('tools')}
            {...windowProps}
          >
            <ToolsContent t={t} />
          </Window>

          <Window
            id="github"
            title="Activity"
            positionStyle={winStyle('github')}
            isActive={isActive('github')}
            {...windowProps}
          >
            <ActivityContent t={t} activity={activity} palette={palette} />
          </Window>

          <NowPlayingWidget
            positionStyle={winStyle('nowplaying')}
            onFocus={focusApp}
            onClose={closeApp}
            onDragStart={startDrag}
          />

          <Window
            id="weather"
            title="Milestones"
            positionStyle={winStyle('weather')}
            isActive={isActive('weather')}
            {...windowProps}
          >
            <MilestonesContent t={t} />
          </Window>

          <Window
            id="contact"
            title="Contact"
            positionStyle={winStyle('contact')}
            isActive={isActive('contact')}
            {...windowProps}
          >
            <ContactContent t={t} />
          </Window>

          <Window
            id="terminal"
            title="terminal — zsh"
            positionStyle={winStyle('terminal')}
            isActive={isActive('terminal')}
            {...windowProps}
          >
            <TerminalContent t={t} onOpenProject={openProject} />
          </Window>
        </div>
      </div>

      <Spotlight
        t={t}
        open={spotlight}
        query={query}
        onQueryChange={setQuery}
        onChoose={chooseSpotlightResult}
        onClose={() => setSpotlight(false)}
      />

      <Dock
        t={t}
        mobile={mobile}
        onScrollToApp={scrollToApp}
        onOpenSpotlight={() => {
          setQuery('')
          setSpotlight(true)
        }}
      />

      <Lightbox
        src={lightbox?.src ?? null}
        alt={lightbox?.alt ?? 'Project screenshot'}
        onClose={() => setLightbox(null)}
      />

      <ScreenSaver t={t} active={idle} onDismiss={() => {}} />

      {locked && <LockScreen t={t} onUnlock={() => setLocked(false)} />}
    </div>
  )
}

export default App
