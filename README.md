# MeetME

React + TypeScript app, scaffolded with the Vite `react-ts` template.

The default Oxlint setup was swapped out for ESLint (with `typescript-eslint`,
`react-hooks` and `react-refresh` plugins) and Prettier for formatting.
Type checking runs through `tsc` with the strict config from the Vite template.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type check + production build
- `npm run test` — run the Vitest suite once (`test:watch` for watch mode)
- `npm run check` — type check, lint, format check and tests in one go
- `npm run format` — format the codebase with Prettier

## Tests

Vitest + Testing Library, running in jsdom. The suite is deliberately shallow —
smoke coverage that the desktop shell boots, unlocks and opens windows
(`src/App.test.tsx`), plus data-integrity checks that catch silent 404s and
duplicate React keys (`src/data.test.ts`).

## Deployment

Pushing to `main` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml):
a `test` job (types, lint, formatting, tests, production build) gates a `deploy`
job that publishes `dist/` to GitHub Pages. A failing test leaves `deploy`
skipped, so nothing reaches the live site.

The site is served from `https://stankoo003.github.io/MeetME/`, so `vite.config.ts`
sets `base: '/MeetME/'` in production. Vite rewrites asset URLs it sees in HTML
and CSS, but **not** runtime strings in JSX — route those through
`asset()` in [src/lib/asset.ts](src/lib/asset.ts) or they will 404 on the deployed
site.
