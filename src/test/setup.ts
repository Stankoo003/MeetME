import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

beforeEach(() => {
  // App persists window layout + dark mode; a leaked value from one test would
  // change the starting state of the next one.
  localStorage.clear()

  // src/lib/github.ts calls a third-party contributions API on mount. Tests must
  // never hit the network — stub it with an empty but well-formed response.
  vi.stubGlobal(
    'fetch',
    vi.fn(async () =>
      Response.json({ total: { lastYear: 0 }, contributions: [] }),
    ) as unknown as typeof fetch,
  )

  // jsdom does not implement matchMedia, which the theme code queries.
  if (!window.matchMedia) {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }))
  }
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
