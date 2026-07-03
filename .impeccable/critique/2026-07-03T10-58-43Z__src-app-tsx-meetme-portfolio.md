---
target: MeetMe portfolio (src/App.tsx)
total_score: 21
p0_count: 2
p1_count: 1
timestamp: 2026-07-03T10-58-43Z
slug: src-app-tsx-meetme-portfolio
---
**Method: dual-agent (A: a8f374177bd3156f3 · B: a8a72a5d49373754f)**
*(Re-run of the 2026-07-03 critique. Neither sub-agent had browser automation available this session — findings are based on a full source re-read plus a deterministic CLI scan, not observed pixels. Same limitation as the prior run.)*

#### Verify Status of Prior Findings

| Prior Issue | Severity | Status |
|---|---|---|
| All 8 windows open on load, no sequencing | P0 | **Still open.** `initialWins` in App.tsx still sets `open: true` for all 8 |
| Windows draggable permanently off-canvas | P0 | **Still open.** `onMove`'s x-axis is fully unclamped; y only clamps a minimum of 10, no upper bound |
| Decorative minimize/maximize dots looked clickable | P1 | **Fixed.** Now `opacity: 0.5`, `cursor: default` — clearly read as non-interactive vs. the real close dot |
| No focus/active-window state | P1 | **Fixed.** `isActive` prop wired end-to-end (App.tsx `z === zTop` → Window.tsx border/title-opacity), using the new `accentBorder` theme token |
| Icon-only dock, hover-only tooltips | P2 | **Fixed** (mobile). Always-visible micro-labels now render under dock icons below 760px; desktop still uses hover tooltip, which is acceptable given visible window titles |
| Monospace overuse in Milestones | P2 | **Fixed.** Year/label typography moved to system sans; mono now confined to the "▲ ON TRACK" status tag, as specified |
| Inert buttons + "placeholder" string | P2 | **Fixed.** "View Live"/"Source" are now visually `disabled` with a "Link coming soon" tooltip; "placeholder" text removed from Activity's contribution count |

**5 of 7 fully fixed, 2 of 7 (both original P0s) still fully open.**

#### Design Health Score

| # | Heuristic | Score | Δ vs. prior (21/40) | Key Issue |
|---|---|---|---|---|
| 1 | Visibility of System Status | 2 | flat (new active-border helps, but Spotlight/scroll still give no feedback) | No distinct "0 results" state in Spotlight; no scroll landmark across a 2760px canvas |
| 2 | Match System / Real World | 3 | flat | Traffic lights, dock, Finder sidebar, Spotlight all faithful — unchanged strength |
| 3 | User Control and Freedom | 1 | flat | Off-canvas drag is still a full dead end — no undo, no reset |
| 4 | Consistency and Standards | 3 | flat | Shared chrome/accent-border logic is now more consistent, offset by Now Playing/Milestones' deliberate departures |
| 5 | Error Prevention | 1 | flat | Nothing prevents the drag-off-canvas trap — the one real failure mode is still unguarded |
| 6 | Recognition Rather Than Recall | 3 | **+1** | Mobile dock labels close a real gap; desktop still icon-only + tooltip |
| 7 | Flexibility and Efficiency | 3 | flat | Spotlight accelerator unchanged, still the only one |
| 8 | Aesthetic and Minimalist Design | 2 | flat-to-slight | Individual windows are cleaner, but the "8 windows + watermark + dock all at once" first view is still the opposite of minimal |
| 9 | Error Recovery | 1 | flat | No recovery path exists for a lost/off-canvas window |
| 10 | Help and Documentation | 2 | flat | Scroll hint exists; Spotlight (the app's signature feature) still has zero on-screen discovery hint |
| **Total** | | **21/40** | **0** | **Same total — six of seven fixes landed, but the two P0s are exactly what was capping the score, and they didn't move** |

The total holding flat despite 5 real fixes is the headline finding: the fixed items bought genuine points in Recognition/Consistency/Aesthetic, but Visibility, Error Prevention, Error Recovery, and User Control are all still suppressed by the two open P0s — that's arithmetically why the sum is unchanged.

#### Anti-Patterns Verdict

**Passes the slop test**, same verdict as the prior run — no card grids, gradient text, hero-metric blocks, or eyebrow/numbered-marker cadence. The Finder-style project grid and macOS chrome read as specific, hand-built craft, not template output. Two prior register-specific risks are now demonstrably deliberate rather than accidental: mono confined to a single status tag (Milestones), no repeated eyebrow drift.

**Deterministic scan:** `detect.mjs --json src` — exit code 2, **80 findings, identical to the prior run** in total count, per-rule breakdown (75 color / 3 radius / 2 side-tab), and per-file distribution and line numbers. None of this session's edits touched a flagged line — same likely-false-positives as before (Window.tsx traffic-light hex colors, Dock.tsx's CSS-triangle folder-fold shape mistaken for a side-stripe). This scan result is a pure repeat; still worth a one-time DESIGN.md allow-list update to stop re-litigating it every run, but it's advisory noise, not new regressions.

**Visual overlays:** Not available this run either — no browser automation tool in either sub-agent's session, same gap as last time.

#### Overall Impression

The polish pass genuinely landed: focus state, dimmed decorative dots, mobile dock labels, Milestones typography, and the disabled-button/placeholder cleanup are all real, verifiably-wired fixes — not cosmetic claims. But the score didn't move, because the two P0s (initial-load sequencing, unclamped drag) are the load-bearing problems, and they're untouched. The interface still opens as a wall of 8 equally-weighted windows, and a curious visitor can still drag a window into permanent oblivion within one gesture.

#### What's Working

1. **The active-window focus state is properly engineered** — real z-index-driven state threaded through props, not a superficial CSS hack. Exactly the "quietly correct engineering" the brand promise depends on.
2. **The three P2 polish fixes (dock labels, Milestones type, disabled buttons) were applied precisely as specified** — no scope creep, no half-fixes. Real design-system discipline.
3. **macOS metaphor fidelity remains the standout strength** — traffic lights with genuinely differentiated states now, Finder sidebar, Spotlight — reads as lived-in knowledge of the platform, not generic chrome.

#### Priority Issues (carried forward — still open)

**[P0] All 8 windows open simultaneously on load, still no sequencing.**
- Unchanged from the prior critique. `initialWins` (App.tsx) sets `open: true` for every window. Still triggers 5 of 8 cognitive-load checklist failures (single focus, hierarchy, one-thing-at-a-time, minimal choices, progressive disclosure) and still contradicts PRODUCT.md's own "skimmable in seconds" principle.
- **Suggested command:** `/impeccable onboard` or `/impeccable layout`

**[P0] Windows can still be dragged permanently off-canvas.**
- Unchanged. `onMove`'s x-axis remains fully unclamped; y only has a lower bound. A visitor can lose a window off either edge of the 1080px canvas within one drag, with zero recovery — not even the dock re-opens it back on-canvas, since dock click only scrolls/focuses at the window's *current* (possibly off-screen) position.
- **Suggested command:** `/impeccable harden`

**[P1] NEW — Activity's contribution count and graph are decoupled and non-deterministic.** `contributionGraph` regenerates via `Math.random()` on every mount while the caption hardcodes "312" — a visitor who refreshes sees a different graph every time, and it never matches the stated count. For a widget whose entire purpose is demonstrating credible activity, an internally-inconsistent stat is a self-inflicted credibility gap — and it's exactly the kind of detail the "attention to detail" pitch can't afford to get wrong.
- **Fix:** seed the graph deterministically (fixed data or a stable seed) and derive the displayed count from the graph data itself, so they can never disagree.
- **Suggested command:** `/impeccable harden`

**[P2] NEW — No "reset layout" or off-canvas recovery affordance.** Direct consequence of the still-open drag issue: there's no double-click-to-recenter, no dock-triggered position reset, nothing. Given the drag-clamp fix hasn't landed yet, this is the cheapest available mitigation in the meantime.
- **Fix:** make dock-icon click on an already-open window also reset its x/y to a safe default, not just scroll/focus.
- **Suggested command:** `/impeccable harden`

**[P3] NEW — Project thumbnails in the Finder view are visually near-identical.** Every project renders as the same blank gray file-icon shape, differentiated only by a thin colored top bar and caption text — not the banned "identical card grid," but the same sameness problem living inside the Finder metaphor itself.
- **Fix:** distinct icon glyphs per project, or a real thumbnail/screenshot instead of a blank swatch.
- **Suggested command:** `/impeccable delight`

#### Persona Red Flags

**Jordan (First-Timer, <60s skim):** Still the biggest exposure — lands on 8 fully-open windows with zero indication of where to look first, and Spotlight (the app's signature feature) has no on-screen discovery hint at all. Unchanged from the prior run.

**Casey (Mobile):** Drag is correctly disabled below 760px and windows stack vertically, but all 8 still render open by default in one long scroll with no mobile-specific prioritization (e.g., leading with About + Contact) — the desktop metaphor is already abandoned for mobile, so there's no reason mobile couldn't sequence content differently.

**Riley (Stress Tester):** Immediately finds the unclamped x-axis drag and can push a window fully off-canvas within one gesture — permanently unreachable for the session. Will also notice the Activity graph reshuffles every reload while "312" never changes — an easy, methodical "this data is fake" catch.

#### Minor Observations

- Contact's fully-functional real links (mailto/GitHub/LinkedIn) are the standard the disabled Project Detail buttons should eventually meet once real project URLs exist.
- Now Playing's "Late-night coding / Lo-fi focus beats" copy and equalizer bars are static/decorative, not tied to real playback — fine as a stylized set-piece, but worth confirming it doesn't read as implying a live Spotify integration that doesn't exist.
- Milestones' timeline dots are uniformly neutral-gray regardless of past/present/future — some differentiation (filled vs. open) would sell the "career forecast" narrative arc harder.

#### Questions to Consider

- If the pitch is "you just opened someone's actual desktop mid-thought," would a real desktop ever have all 8 apps maximized with zero overlap the moment you sit down — or would 2-3 windows up front with the rest minimized-to-dock feel truer to the metaphor?
- `isActive`/z-order state already exists and works correctly — what's actually blocking the bounds-clamp fix, given the harder state-management problem is already solved?
- Is fabricated-but-inconsistent activity data (random graph, fixed caption) actually better than no Activity widget at all for an audience (developers) who will recognize the pattern and test whether it's real?
