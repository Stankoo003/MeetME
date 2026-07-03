# Product

## Register

brand

## Users

Recruiters, hiring managers, and fellow developers landing on Aleksa Stanković's
personal portfolio, usually from a resume link, LinkedIn, or GitHub profile.
They're skimming to quickly answer: who is this person, what have they shipped,
and are they worth a follow-up. Session is short and exploratory — clicking
around a novel interface out of curiosity as much as evaluation.

## Product Purpose

A personal portfolio presented as a simulated macOS desktop: draggable windows
(About, Projects, Tools, Activity, Now Playing, Milestones, Contact), a dock,
and a Spotlight-style search. It exists to make Aleksa memorable and to
demonstrate frontend craft through the interface itself, not just through the
project descriptions inside it. Success = a visitor plays with the desktop
metaphor, reads at least one project in detail, and leaves with a clear,
positive impression of his skill and attention to detail.

## Brand Personality

Playful, creative, personal. The interface itself is the pitch: a working,
slightly cheeky recreation of a macOS desktop signals both technical range
(state management, drag interactions, theming) and a personality that doesn't
take itself too seriously. Should feel like a fun toy that's secretly a very
polished piece of engineering.

## Anti-references

- Generic "SaaS portfolio" templates: card grids, gradient-text names, hero
  metric blocks — the opposite of personal and playful.
- Anything that feels like a static resume PDF reformatted as a webpage.
- Overly corporate/stiff tone in copy or interaction — this isn't a product
  landing page, it's a personal, hands-on demo.

## Design Principles

- Show, don't tell — the interface's own craft (drag physics, window
  management, Spotlight search) is evidence of skill, more than the words in
  any window.
- Familiar metaphor, personal execution — lean on the macOS mental model so
  interaction is instantly intuitive, but keep every visual and copy detail
  distinctly personal (real projects, real tools, real timeline).
- Delight in the details — micro-interactions (dock hover pop, window pop-in,
  equalizer bars, forecast-style milestones) carry the "playful" personality;
  cut anything that feels like a stock component.
- Respect the visitor's time — every window should be skimmable in seconds;
  depth (like project detail) is one click away, never forced up front.

## Accessibility & Inclusion

Standard good practice: WCAG AA color contrast in both light and dark themes,
full `prefers-reduced-motion` fallback for window pop-in / equalizer / spotlight
animations, keyboard-operable Spotlight search (Escape to close, Enter to open
top result — already implemented), and no information conveyed by color alone.
