/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * The impeccable live-reload skill injects a `<script src="http://localhost:8400/live.js">`
 * into index.html between HTML comment markers, and re-injects it every time live mode
 * runs. On the deployed (HTTPS) site that request is blocked mixed content and errors on
 * every page load, so strip the whole marked block from the production HTML.
 */
function stripLiveReloadScript(): Plugin {
  return {
    name: 'strip-impeccable-live',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        /[ \t]*<!--\s*impeccable-live-start\s*-->[\s\S]*?<!--\s*impeccable-live-end\s*-->\n?/g,
        '',
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves project sites from https://<user>.github.io/<repo>/, so every
  // built asset URL needs the repo name prefixed. Repo is `Stankoo003/MeetME` — the
  // capitalisation matters, Pages paths are case-sensitive.
  base: process.env.NODE_ENV === 'production' ? '/MeetME/' : '/',
  plugins: [react(), stripLiveReloadScript()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: false,
  },
})
