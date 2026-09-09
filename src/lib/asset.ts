/**
 * Resolves a path inside `public/` against the deploy base path.
 *
 * Vite rewrites asset URLs it can see statically (in HTML and CSS), but not
 * plain runtime strings like `src="/profile.jpg"` in JSX. On GitHub Pages the
 * site lives under `/MeetME/`, so those would 404. Always route public assets
 * through this helper.
 */
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
