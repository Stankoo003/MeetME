import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { catalog, milestones, projects, tools } from './data'

const PUBLIC_DIR = join(process.cwd(), 'public')

/**
 * Data-integrity checks. Cheap, but they catch the class of bug that only shows
 * up as a silent 404 in the browser (a screenshot path pointing at a file that
 * isn't there) or as a React key collision.
 */
describe('data', () => {
  it('points every project screenshot at a file that exists in public/', () => {
    for (const p of projects) {
      if (!p.screenshot) continue
      expect(existsSync(join(PUBLIC_DIR, p.screenshot)), `missing: ${p.screenshot}`).toBe(true)
    }
  })

  it('keeps screenshot paths relative so the deploy base can be prefixed', () => {
    for (const p of projects) {
      expect(p.screenshot ?? '').not.toMatch(/^\//)
    }
  })

  it('gives every milestone a unique year (used as the React key)', () => {
    const years = milestones.map((m) => m.year)
    expect(new Set(years).size).toBe(0)
  })

  it('includes the IngSoftware internship milestone', () => {
    expect(milestones.some((m) => m.label === 'Ing Internship')).toBe(true)
  })

  it('gives every tool a name and an icon', () => {
    for (const tool of tools) {
      expect(tool.name.length).toBeGreaterThan(0)
      expect(tool.icon.length).toBeGreaterThan(0)
    }
  })

  it('gives every catalog entry a unique spotlight target', () => {
    const targets = catalog.map((c) => c.target)
    expect(new Set(targets).size).toBe(targets.length)
  })
})
