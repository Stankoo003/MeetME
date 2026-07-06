import {
  useCallback,
  useEffect,
  useMemo,
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

const BASE_CANVAS_HEIGHT = 2760
const MOBILE_BREAKPOINT = 760

// Persisted layout. Bump the version to discard saved layouts after a
// structural change (windows added/removed, different default sizing).
const LAYOUT_VERSION = 1
const STORAGE_KEY = 'meetme-layout'

interface WinState {
  open: boolean
  x: number
  y: number
  z: number
  w: number
}

const PROJECT_WIN_W = 480
const PROJECT_WIN_H = 560

const WINDOW_WIDTH: Record<AppId, number> = {
  about: 440,
  nowplaying: 300,
  projects: 600,
  weather: 340,
  tools: 440,
  github: 780,
  contact: 360,
  terminal: 460,
}

// Approximate rendered heights, used to lay windows out without overlap and to
// keep a freshly-opened window from landing on top of open ones — not the
// source of truth for layout (the DOM decides actual height).
const WINDOW_HEIGHT: Record<AppId, number> = {
  about: 460,
  nowplaying: 275,
  projects: 465,
  weather: 300,
  tools: 280,
  github: 300,
  contact: 390,
  terminal: 375,
}

function getWindowWidth(id: WinId): number {
  return id.startsWith('project-') ? PROJECT_WIN_W : WINDOW_WIDTH[id as AppId]
}

function getWindowHeight(id: WinId): number {
  return id.startsWith('project-') ? PROJECT_WIN_H : WINDOW_HEIGHT[id as AppId]
}

// Every window opens on a first visit; this is the order the auto-layout packs
// them in (each project gets its own independent window).
const DEFAULT_ORDER: WinId[] = [
  'about',
  'nowplaying',
  'projects',
  ...projects.map((_, idx) => projectWinId(idx)),
  'tools',
  'weather',
  'github',
  'contact',
  'terminal',
]

const PLACEMENT_MARGIN = 24
const PLACEMENT_STEP = 40
const LAYOUT_GAP = 28
const LAYOUT_START_X = 40
const LAYOUT_START_Y = 300

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
// currently-open window, cascading diagonally from its last position.
function findFreePosition(
  id: WinId,
  wins: Record<WinId, WinState>,
  canvasWidth: number,
  canvasHeight: number,
) {
  const { w, x: originX, y: originY } = wins[id]
  const h = getWindowHeight(id)
  const maxX = Math.max(0, canvasWidth - w)
  const maxY = Math.max(10, canvasHeight - h - 40)
  const openRects = Object.entries(wins)
    .filter(([otherId, other]) => otherId !== id && other.open)
    .map(([otherId, other]) => ({
      x: other.x,
      y: other.y,
      w: other.w,
      h: getWindowHeight(otherId as WinId),
    }))

  let x = originX
  let y = originY
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
    x: Math.min(Math.max(originX, 0), maxX),
    y: Math.min(Math.max(originY, 10), maxY),
  }
}

// Bottom-left-fill packing: places each window at the highest, then leftmost,
// spot that clears every window already placed. Guarantees no overlaps.
function packLayout(order: WinId[], canvasWidth: number): Record<string, { x: number; y: number }> {
  const placed: { x: number; y: number; w: number; h: number }[] = []
  const positions: Record<string, { x: number; y: number }> = {}
  for (const id of order) {
    const w = getWindowWidth(id)
    const h = getWindowHeight(id)
    const maxX = Math.max(LAYOUT_START_X, canvasWidth - w - LAYOUT_START_X)
    // Candidate corners: the start, plus the left/right edges and top/bottom
    // edges of everything already placed. Bottom-left fill picks among these.
    const xs = new Set<number>([LAYOUT_START_X])
    const ys = new Set<number>([LAYOUT_START_Y])
    for (const r of placed) {
      xs.add(r.x)
      xs.add(r.x + r.w + LAYOUT_GAP)
      ys.add(r.y)
      ys.add(r.y + r.h + LAYOUT_GAP)
    }
    const sortedXs = [...xs].sort((a, b) => a - b)
    const sortedYs = [...ys].sort((a, b) => a - b)
    let spot: { x: number; y: number } | null = null
    for (const y of sortedYs) {
      for (const x of sortedXs) {
        if (x < LAYOUT_START_X || x > maxX) continue
        const candidate = { x, y, w, h }
        if (placed.some((r) => rectsOverlap(candidate, r, LAYOUT_GAP))) continue
        spot = { x, y }
        break
      }
      if (spot) break
    }
    if (!spot) spot = { x: LAYOUT_START_X, y: LAYOUT_START_Y }
    positions[id] = spot
    placed.push({ x: spot.x, y: spot.y, w, h })
  }
  return positions
}

function buildDefaultWins(canvasWidth: number): Record<WinId, WinState> {
  const positions = packLayout(DEFAULT_ORDER, canvasWidth)
  const wins = {} as Record<WinId, WinState>
  DEFAULT_ORDER.forEach((id, idx) => {
    const pos = positions[id]
    wins[id] = { open: true, x: pos.x, y: pos.y, z: idx + 1, w: getWindowWidth(id) }
  })
  return wins
}

function loadStoredWins(): Record<string, Partial<WinState>> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || parsed.v !== LAYOUT_VERSION || typeof parsed.wins !== 'object') {
      return null
    }
    return parsed.wins as Record<string, Partial<WinState>>
  } catch {
    return null
  }
}

// Start from the freshly packed defaults, then overlay whatever was saved.
// Windows added since the last save keep their defaults; saved windows that no
// longer exist are ignored — so a layout survives code changes gracefully.
function loadOrBuildWins(canvasWidth: number): Record<WinId, WinState> {
  const defaults = buildDefaultWins(canvasWidth)
  const stored = loadStoredWins()
  if (!stored) return defaults
  const merged = { ...defaults }
  for (const id of Object.keys(defaults) as WinId[]) {
    const s = stored[id]
    if (s && typeof s.x === 'number' && typeof s.y === 'number' && typeof s.open === 'boolean') {
      merged[id] = {
        open: s.open,
        x: s.x,
        y: s.y,
        z: typeof s.z === 'number' ? s.z : defaults[id].z,
        w: typeof s.w === 'number' ? s.w : defaults[id].w,
      }
    }
  }
  return merged
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
  const [wins, setWins] = useState(() => loadOrBuildWins(window.innerWidth))
  const [spotlight, setSpotlight] = useState(false)
  const [query, setQuery] = useState('')
  const [zTop, setZTop] = useState(() => Math.max(8, ...Object.values(wins).map((w) => w.z)))
  const [activity, setActivity] = useState<ActivityState>({ status: 'loading' })
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)
  const [locked, setLocked] = useState(true)
  const idle = useIdle(20_000)
  const zTopRef = useRef(zTop)
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

  // Canvas grows to fit whatever the open windows need — the all-open packed
  // layout runs taller than the old fixed canvas. A ref mirrors it so the
  // once-registered drag handler always clamps against the current height.
  const canvasHeight = useMemo(() => {
    let max = BASE_CANVAS_HEIGHT
    for (const id of Object.keys(wins) as WinId[]) {
      const win = wins[id]
      if (!win.open) continue
      const bottom = win.y + getWindowHeight(id) + 160
      if (bottom > max) max = bottom
    }
    return max
  }, [wins])
  const canvasHeightRef = useRef(canvasHeight)
  useEffect(() => {
    canvasHeightRef.current = canvasHeight
  }, [canvasHeight])

  // Persist the layout (positions + open/closed state) so a refresh restores
  // it. Debounced so a drag doesn't hammer localStorage on every mouse move.
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: LAYOUT_VERSION, wins }))
      } catch {
        // localStorage unavailable — layout just won't persist
      }
    }, 250)
    return () => clearTimeout(timer)
  }, [wins])

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
        const ny = Math.min(Math.max(e.pageY - drag.dy, 10), canvasHeightRef.current - 40)
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

  // Clears the saved layout and re-packs every window open from scratch.
  const resetLayout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // localStorage unavailable — nothing to clear
    }
    const defaults = buildDefaultWins(window.innerWidth)
    const maxZ = Math.max(8, ...Object.values(defaults).map((w) => w.z))
    zTopRef.current = maxZ
    setZTop(maxZ)
    setWins(defaults)
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
        const pos = findFreePosition(id, s, vw, canvasHeightRef.current)
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
        w.open
          ? { open: true }
          : { open: true, ...findFreePosition(id, all, vw, canvasHeightRef.current) },
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
        w.open
          ? { open: true }
          : { open: true, ...findFreePosition(id, all, vw, canvasHeightRef.current) },
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
        onClick={resetLayout}
        title="Reset layout — reopen and re-tile every window"
        style={{
          position: 'fixed',
          top: 20,
          right: 72,
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
        ↺
      </div>

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
                height: canvasHeight,
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
                  height: canvasHeight,
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
