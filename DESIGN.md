---
name: MeetMe
description: A personal portfolio staged as a working macOS desktop.
colors:
  accent-blue: '#0a84ff'
  light-desktop: 'linear-gradient(165deg,#eef0f4 0%,#e4e7ec 55%,#dcdfe6 100%)'
  light-watermark: 'rgba(60,70,90,0.045)'
  light-ink: '#1d1d1f'
  light-sub: '#86868b'
  light-card: '#fbfbfd'
  light-card-border: 'rgba(0,0,0,0.12)'
  light-head: '#f2f2f4'
  light-line: 'rgba(0,0,0,0.09)'
  light-chip-bg: '#eef0f3'
  light-chip-text: '#3a3a3f'
  light-dock-bg: 'rgba(255,255,255,0.5)'
  dark-desktop: 'linear-gradient(165deg,#20222a 0%,#16181e 55%,#0f1015 100%)'
  dark-watermark: 'rgba(255,255,255,0.04)'
  dark-ink: '#f0f0f2'
  dark-sub: '#9a9aa2'
  dark-card: '#282a30'
  dark-card-border: 'rgba(255,255,255,0.1)'
  dark-head: '#303239'
  dark-line: 'rgba(255,255,255,0.09)'
  dark-chip-bg: '#3a3c44'
  dark-chip-text: '#d6d6da'
  dark-dock-bg: 'rgba(44,46,52,0.55)'
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 'clamp(60px, 17vw, 148px)'
    fontWeight: 700
    lineHeight: 1
    letterSpacing: '-6px'
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: '24px'
    fontWeight: 700
    letterSpacing: '-0.4px'
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: '14px'
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: '12px'
    fontWeight: 600
    letterSpacing: '0.5px'
  mono:
    fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace"
    fontSize: '11px'
rounded:
  sm: '6px'
  md: '8px'
  lg: '12px'
  xl: '20px'
  pill: '50%'
spacing:
  xs: '6px'
  sm: '10px'
  md: '18px'
  lg: '30px'
  xl: '34px'
components:
  window-frame:
    backgroundColor: '{colors.light-card}'
    textColor: '{colors.light-ink}'
    rounded: '{rounded.lg}'
  chip:
    backgroundColor: '{colors.light-chip-bg}'
    textColor: '{colors.light-chip-text}'
    rounded: '{rounded.md}'
    padding: '5px 12px'
  chip-accent:
    backgroundColor: 'rgba(10,132,255,0.14)'
    textColor: '{colors.accent-blue}'
    rounded: '7px'
    padding: '4px 10px'
  button-primary:
    backgroundColor: '{colors.accent-blue}'
    textColor: '#ffffff'
    rounded: '{rounded.md}'
    padding: '8px 16px'
  button-ghost:
    backgroundColor: '{colors.light-chip-bg}'
    textColor: '{colors.light-chip-text}'
    rounded: '{rounded.md}'
    padding: '8px 16px'
  dock:
    backgroundColor: '{colors.light-dock-bg}'
    rounded: '22px'
    padding: '10px 14px'
---

# Design System: MeetMe

## 1. Overview

**Creative North Star: "The Personal Desktop"**

MeetMe recreates the feeling of opening someone's actual Mac and finding their
work already open in front of you — windows scattered mid-thought, a dock
along the bottom, a Spotlight search a keystroke away. It is not a portfolio
_about_ a desktop; it behaves like one: windows drag, stack, focus, and close
with the same physics macOS trained everyone to expect. That familiarity is
the trick — because the interaction model is free, every ounce of personality
gets to live in the details instead: the equalizer bars on "Now Playing," the
forecast-styled career milestones, the Finder-style project browser.

This system explicitly rejects the generic SaaS-portfolio look: no card grids
of identical project tiles, no gradient-text name in a hero, no hero-metric
block with big numbers and small labels. It also rejects anything that reads
as a resume PDF reformatted for the web — static, list-shaped, skimmed once
and forgotten. The desktop metaphor exists so a visitor plays first and reads
second.

**Key Characteristics:**

- Native macOS window chrome (traffic-light buttons, 40–44px header bar) on every panel, light or dark.
- One accent color (`#0a84ff`) doing all the signaling work — links, tags, active states — everywhere else stays neutral.
- Frosted-glass surfaces (`backdrop-filter: blur`) reserved for floating, always-on-top chrome: the dock, Spotlight, the theme toggle. Window bodies stay opaque.
- Every window pops in with the same `winpop` micro-animation; nothing on the page enters silently.

## 2. Colors

Two full neutral scales (light and dark) built around one deliberate accent; nothing else is "brand color."

### Primary

- **Signal Blue** (`#0a84ff`): the single accent. Used for links, active sidebar rows, project tags, the "View Live" button, and Spotlight's active hover state. Never used decoratively — its presence always means "this is interactive or important."

### Neutral — Light

- **Porcelain Desktop** (`linear-gradient(165deg,#eef0f4 0%,#e4e7ec 55%,#dcdfe6 100%)`): the base desktop background.
- **Paper Card** (`#fbfbfd`): window and panel background.
- **Ink** (`#1d1d1f`): primary text.
- **Quiet Gray** (`#86868b`): secondary text, labels, timestamps.
- **Hairline** (`rgba(0,0,0,0.09)`–`rgba(0,0,0,0.12)`): borders and dividers, always sub-pixel (`0.5px`) where possible.
- **Chip Gray** (`#eef0f3` bg / `#3a3a3f` text): neutral tags (skills, tool names, secondary buttons).

### Neutral — Dark

- **Graphite Desktop** (`linear-gradient(165deg,#20222a 0%,#16181e 55%,#0f1015 100%)`): the base desktop background.
- **Charcoal Card** (`#282a30`): window and panel background.
- **Off-White Ink** (`#f0f0f2`): primary text.
- **Muted Slate** (`#9a9aa2`): secondary text, labels.
- **Hairline Light** (`rgba(255,255,255,0.09)`–`rgba(255,255,255,0.12)`): borders and dividers.
- **Chip Charcoal** (`#3a3c44` bg / `#d6d6da` text): neutral tags in dark mode.

### Named Rules

**The One Accent Rule.** Signal Blue is the only saturated color allowed outside decorative dock-icon gradients and the "Now Playing" / "Milestones" widget backgrounds (which are themed set-pieces, not part of the core palette). If a new element needs to stand out, reach for weight or size before reaching for a second color.

## 3. Typography

**Display Font:** -apple-system / SF Pro Display (with Helvetica Neue, Arial fallback)
**Body Font:** -apple-system / SF Pro Text (same fallback stack)
**Label/Mono Font:** ui-monospace / SF Mono, Menlo (used only inside the Activity and Milestones widgets, where a "system readout" feel is intentional)

**Character:** One system sans family carrying every register from a 148px hero watermark down to 10px monospace timestamps — the pairing _is_ the OS itself, so introducing a second display face would immediately break the illusion.

### Hierarchy

- **Display** (700, `clamp(60px, 17vw, 148px)`, line-height 1, letter-spacing -6px): the "MeetMe" watermark behind the desktop. Decorative, never load-bearing for content.
- **Title** (700, 20–24px, letter-spacing -0.3 to -0.4px): window-content headings (name, project title).
- **Body** (400, 14px, line-height 1.65): all paragraph copy. Cap prose at ~60ch inside the 440–480px window widths already in use.
- **Label** (600, 11–12px, letter-spacing 0.4–0.5px, uppercase): section eyebrows inside windows ("Skills", "Favorites", "Currently Building") — used sparingly, one per window at most, never stacked as a page-wide pattern.
- **Mono** (400–600, 10–11px): timestamps, forecast readouts, contribution-graph captions.

### Named Rules

**The System-Font Rule.** Never introduce a second typeface family. Every new hierarchy level is built from this one stack via weight, size, and letter-spacing only.

## 4. Elevation

MeetMe is a layered, not flat, system — windows genuinely float above the desktop and above each other, so elevation is structural, not decorative. Every window carries the same two-part shadow (a soft ambient shadow plus a tight contact shadow) regardless of theme; only the dock, Spotlight, and toggle add a frosted blur on top of that for their "always floating" chrome.

### Shadow Vocabulary

- **Window** (`box-shadow: 0 24px 70px rgba(15,20,35,0.32), 0 2px 8px rgba(0,0,0,0.08)`): default elevation for every content window (About, Projects, Tools, Activity, Milestones, Contact).
- **Now Playing (elevated widget)** (`box-shadow: 0 24px 70px rgba(15,20,35,0.4), 0 2px 8px rgba(0,0,0,0.1)`): slightly heavier — it's the one widget with its own dark gradient background regardless of theme, so it needs to visually detach a touch more.
- **Dock / Spotlight (glass chrome)** (`box-shadow: 0 12px 40px rgba(15,20,35,0.28)` dock / `0 30px 80px rgba(10,15,30,0.4)` Spotlight bar): paired with `backdrop-filter: saturate(180%) blur(20-30px)`. This is the only place true glassmorphism is allowed — floating OS-level controls, not content.

### Named Rules

**The Glass-Is-Chrome-Only Rule.** Frosted blur is reserved for the dock, Spotlight, and the theme toggle — UI that floats above all windows. Window bodies are always opaque cards, never glass. Breaking this (making a content window translucent) is the fastest way to make the layout unreadable and the design read as generic glassmorphism.

## 5. Components

Every component below exists in a light and dark variant driven by the same `theme.ts` token object; no component hardcodes a color outside the accent blue and the intentional dark-only widgets (Now Playing, Milestones' sky banner).

### Windows (Signature Component)

Every content panel — About, Projects, Tools, Activity, Milestones, Contact — shares one chrome: a 40px (44px for Projects) header bar with three traffic-light dots (`#ff5f57` close / `#febc2e` minimize-styled / `#28c840` — only close is wired up, the other two are decorative to preserve the metaphor), a centered 13px/600 title, `12px` corner radius, and the Window shadow above. Bodies use generous padding (26–34px) and never nest another card-like container inside.

### Buttons

- **Shape:** 8px radius, never fully rounded/pill except icon-only dock/social buttons.
- **Primary:** `#0a84ff` background, white text, 8px 16px padding — used for the one primary action per screen (Email me, View Live).
- **Secondary/Ghost:** neutral chip background/text (`{colors.light-chip-bg}` / `{colors.dark-chip-bg}`) — same shape and padding as primary, differentiated by color only.
- **Hover/Focus:** no separate hover state currently implemented on window buttons; dock icons use `transform: translateY(-10px) scale(1.12)` on hover instead of a color change — motion carries the affordance there.

### Chips (tags, skills, tools)

- **Style:** neutral chip background/text for skills and secondary tags; `rgba(10,132,255,0.14)` background / `#0a84ff` text for project-detail tags, the one place chips get the accent treatment.
- **State:** static — no selected/unselected toggle state exists yet.

### Cards / Containers

- **Corner Style:** 12px radius standard, 6px for the small Finder-style project thumbnails inside the Projects window.
- **Background:** `{colors.light-card}` / `{colors.dark-card}`.
- **Shadow Strategy:** see Elevation → Window shadow.
- **Border:** 0.5px hairline (`{colors.light-card-border}` / `{colors.dark-card-border}`) on every window frame — never a heavier border, and never a colored `border-left`/`border-right` accent stripe.
- **Internal Padding:** 24–34px outer, 14–20px for denser panels (Projects sidebar, Tools grid).

### Inputs / Fields

- **Style:** Spotlight's search input is the only text input — borderless, transparent background, 24px font, sits inside the frosted Spotlight bar.
- **Focus:** auto-focused on open via `inputRef`; no visible focus ring needed since it's the only interactive element in its modal context.

### Navigation

- **Dock:** fixed-bottom, centered, frosted pill (22px radius) holding one icon per window plus a divider and the Spotlight trigger. Icons pop up 10px and scale 1.12x on hover, no color change. On mobile, becomes a horizontally-scrollable strip (`overflow-x: auto`) rather than reflowing into a menu.
- **Spotlight:** full-viewport dim overlay + centered floating search bar + results panel, opened via dock icon or `⌘/Ctrl+Space`, closed via Escape or backdrop click.

## 6. Do's and Don'ts

### Do:

- **Do** keep every window's chrome identical (traffic-light dots, header height, `12px` radius, the two-part Window shadow) — consistency of chrome is what sells the "real desktop" illusion.
- **Do** let Signal Blue (`#0a84ff`) be the only color that means "interactive" — links, active states, primary buttons, project tags.
- **Do** reserve `backdrop-filter` blur for floating OS chrome only (dock, Spotlight, theme toggle) per the Glass-Is-Chrome-Only Rule.
- **Do** drive every visual difference between light and dark mode from the shared theme token object (`theme.ts`) — never hardcode a color that isn't accent blue or an intentionally-dark widget (Now Playing, Milestones banner).
- **Do** give every window entrance the same `winpop` pop-in animation, and provide a `prefers-reduced-motion` fallback (instant/crossfade) for it, the dock hover pop, the equalizer bars, and Spotlight's `spotpop`.

### Don't:

- **Don't** build a generic "SaaS portfolio" card grid of identically-sized project tiles with icon + heading + text — the anti-reference PRODUCT.md explicitly rejects.
- **Don't** use gradient text (`background-clip: text` + gradient) anywhere, including on "MeetMe" — the hero name uses a flat, very low-opacity watermark color instead.
- **Don't** add a hero-metric block (big number + small label + supporting stats) — that pattern doesn't belong in this system at all.
- **Don't** make a content window's body translucent/glass — glass is chrome-only (dock, Spotlight, toggle).
- **Don't** introduce a second typeface family for any reason; every new hierarchy level comes from weight/size/letter-spacing on the existing system-font stack.
- **Don't** use `border-left`/`border-right` heavier than 1px as a colored accent stripe on any card, chip, or list item.
- **Don't** add a second saturated accent color competing with Signal Blue outside the intentionally-themed dock-icon gradients and Now Playing/Milestones widgets.
