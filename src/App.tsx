import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react'
import { darkTheme, lightTheme, contributionPalette } from './theme'
import { projects, type AppId } from './data'
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
} from './components/windows'
import { Dock } from './components/Dock'
import { Spotlight } from './components/Spotlight'

const CANVAS_HEIGHT = 2760
const MOBILE_BREAKPOINT = 760

interface WinState {
  open: boolean
  x: number
  y: number
  z: number
  w: number
}

const initialWins: Record<AppId, WinState> = {
  about: { open: true, x: 90, y: 330, z: 1, w: 440 },
  nowplaying: { open: true, x: 570, y: 300, z: 2, w: 300 },
  projects: { open: true, x: 110, y: 660, z: 3, w: 600 },
  weather: { open: true, x: 740, y: 680, z: 4, w: 340 },
  tools: { open: true, x: 110, y: 1240, z: 5, w: 440 },
  proj1: { open: true, x: 580, y: 1200, z: 6, w: 480 },
  github: { open: true, x: 110, y: 1760, z: 7, w: 780 },
  contact: { open: true, x: 360, y: 2280, z: 8, w: 360 },
}

const contributionGraph = Array.from({ length: 371 }, () => {
  const r = Math.random()
  if (r < 0.5) return 0
  if (r < 0.72) return 1
  if (r < 0.86) return 2
  if (r < 0.95) return 3
  return 4
})

function scrollToElement(id: AppId) {
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
  const [selProj, setSelProj] = useState(0)
  const zTopRef = useRef(8)
  const dragRef = useRef<{ id: AppId; dx: number; dy: number } | null>(null)

  const t = dark ? darkTheme : lightTheme
  const palette = dark ? contributionPalette.dark : contributionPalette.light
  const mobile = vw < MOBILE_BREAKPOINT
  const scale = Math.min(1, vw / 1100)

  const bringToFront = useCallback((id: AppId, patch?: Partial<WinState>) => {
    zTopRef.current += 1
    const z = zTopRef.current
    setWins((s) => ({ ...s, [id]: { ...s[id], z, ...patch } }))
  }, [])

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    const onMove = (e: globalThis.MouseEvent) => {
      const drag = dragRef.current
      if (!drag) return
      e.preventDefault()
      const nx = e.pageX - drag.dx
      const ny = Math.max(10, e.pageY - drag.dy)
      setWins((s) => ({ ...s, [drag.id]: { ...s[drag.id], x: nx, y: ny } }))
    }
    const onUp = () => {
      dragRef.current = null
    }
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setSpotlight(false)
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

  const focusApp = useCallback((id: AppId) => bringToFront(id), [bringToFront])

  const closeApp = useCallback((id: AppId) => {
    setWins((s) => ({ ...s, [id]: { ...s[id], open: false } }))
  }, [])

  const startDrag = useCallback(
    (id: AppId, e: MouseEvent<HTMLDivElement>) => {
      if (window.innerWidth < MOBILE_BREAKPOINT) return
      if ((e.target as HTMLElement).closest('[data-nodrag]')) return
      const w = wins[id]
      dragRef.current = { id, dx: e.pageX - w.x, dy: e.pageY - w.y }
      bringToFront(id)
    },
    [bringToFront, wins],
  )

  const scrollToApp = useCallback((id: AppId) => {
    setWins((s) => (s[id].open ? s : { ...s, [id]: { ...s[id], open: true } }))
    scrollToElement(id)
  }, [])

  const openProject = useCallback(
    (idx: number) => {
      setSelProj(idx)
      bringToFront('proj1', { open: true })
      scrollToElement('proj1')
    },
    [bringToFront],
  )

  const chooseSpotlightResult = useCallback(
    (id: AppId) => {
      setSpotlight(false)
      setQuery('')
      bringToFront(id, { open: true })
      scrollToElement(id)
    },
    [bringToFront],
  )

  const winStyle = (id: AppId): CSSProperties => {
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
                height: Math.round(CANVAS_HEIGHT * scale),
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
                  left: '50%',
                  width: 1080,
                  height: CANVAS_HEIGHT,
                  transform: `translateX(-50%) scale(${scale})`,
                  transformOrigin: 'top center',
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
            {...windowProps}
          >
            <ProjectsContent t={t} onOpenProject={openProject} />
          </Window>

          <Window
            id="proj1"
            title={projects[selProj].name}
            positionStyle={winStyle('proj1')}
            {...windowProps}
          >
            <ProjectDetailContent t={t} project={projects[selProj]} />
          </Window>

          <Window id="tools" title="Tools I Use" positionStyle={winStyle('tools')} {...windowProps}>
            <ToolsContent t={t} />
          </Window>

          <Window id="github" title="Activity" positionStyle={winStyle('github')} {...windowProps}>
            <ActivityContent t={t} graph={contributionGraph} palette={palette} />
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
            {...windowProps}
          >
            <MilestonesContent t={t} />
          </Window>

          <Window id="contact" title="Contact" positionStyle={winStyle('contact')} {...windowProps}>
            <ContactContent t={t} />
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
    </div>
  )
}

export default App
