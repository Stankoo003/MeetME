const GITHUB_USERNAME = 'stankoo003'

interface RawContributionDay {
  date: string
  count: number
  level: number
}

interface RawContributionsResponse {
  total: Record<string, number>
  contributions: RawContributionDay[]
}

export interface ContributionsResult {
  total: number
  cells: number[]
}

/**
 * Fetches the public GitHub contribution calendar via a CORS-open community
 * proxy (no auth token — GitHub's own contribution graph requires an
 * authenticated GraphQL call, which can't be made safely from the browser).
 */
export async function fetchContributions(): Promise<ContributionsResult> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`,
  )
  if (!res.ok) throw new Error(`GitHub contributions request failed: ${res.status}`)

  const data = (await res.json()) as RawContributionsResponse
  const days = data.contributions
  if (days.length === 0) return { total: 0, cells: [] }

  // Pad the front so columns align to calendar weeks (Sunday-start), matching
  // the real GitHub contribution graph's layout.
  const firstWeekday = new Date(`${days[0].date}T00:00:00Z`).getUTCDay()
  const padding = Array.from({ length: firstWeekday }, () => 0)
  const cells = [...padding, ...days.map((d) => d.level)]
  const total = data.total.lastYear ?? days.reduce((sum, d) => sum + d.count, 0)

  return { total, cells }
}
