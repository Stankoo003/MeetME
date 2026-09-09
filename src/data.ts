export type AppId =
  'about' | 'projects' | 'tools' | 'github' | 'nowplaying' | 'weather' | 'contact' | 'terminal'

/** Each opened project gets its own independent window, keyed by its index. */
export type ProjectWinId = `project-${number}`

export type WinId = AppId | ProjectWinId

export function projectWinId(idx: number): ProjectWinId {
  return `project-${idx}`
}

export interface Project {
  name: string
  full: string
  period: string
  org: string
  desc: string
  tags: string[]
  bar: string
  /** Path under public/screenshots/. Falls back to a placeholder if the file is missing. */
  screenshot?: string
  /** Public URL of the deployed project. Omit to leave the View Live button disabled. */
  live?: string
  /** Public repository URL. Omit to leave the Source button disabled. */
  source?: string
  /**
   * Shown as a dialog when View Live is clicked, for a project that only ships
   * through internal testing and so has no public URL to open.
   */
  liveNotice?: { title: string; body: string }
}

export const projects: Project[] = [
  {
    name: 'Kartly',
    full: 'Kartly — E-Commerce Platform',
    period: 'Jul 2026 – Sep 2026',
    org: 'Internship · IngSoftware',
    desc: 'Full-stack storefront and admin panel. Angular SPA over a .NET Web API split into clean-architecture layers, with JWT auth and refresh tokens, role-based admin, an order lifecycle state machine, currency conversion and image-backed product catalog. Integration tests run against a real PostgreSQL in Testcontainers; the frontend ships to GitHub Pages and the API to Azure App Service.',
    tags: ['Angular', '.NET', 'C#', 'PostgreSQL', 'Azure'],
    bar: 'linear-gradient(90deg,#f0603a,#c8351a)',
    screenshot: 'screenshots/kartly.png',
    live: 'https://stankoo003.github.io/Kartly/',
    source: 'https://github.com/Stankoo003/Kartly',
  },
  {
    name: 'Keyframe',
    full: 'Keyframe — Video Streaming Catalog',
    period: 'Aug 2026',
    org: 'Internship · IngSoftware',
    desc: 'Next.js App Router catalog backed by a real media pipeline: FFmpeg encodes each clip into a keyframe-aligned HLS rendition ladder with generated posters and thumbnails, whisper.cpp drafts the WebVTT captions, and Cloudflare R2 serves it over a CDN. Server components by default — exactly two client files — with Prisma on PostgreSQL and Playwright plus axe-core covering accessibility.',
    tags: ['Next.js', 'TypeScript', 'Prisma', 'FFmpeg', 'HLS'],
    bar: 'linear-gradient(90deg,#3ec8c8,#1f8f9e)',
    screenshot: 'screenshots/keyframe.png',
    live: 'https://keyframe-zeta.vercel.app/videos/solar-eclipse',
    source: 'https://github.com/Stankoo003/Keyframe',
  },
  {
    name: 'ReelLab',
    full: 'ReelLab — Short-Video App',
    period: 'Aug 2026 – Sep 2026',
    org: 'Internship · IngSoftware',
    desc: 'TikTok-style mobile client: capture, trim and post vertical clips, then browse a swipeable feed with likes, threaded comments, profiles, music beds and voice-over. Editing runs through FFmpeg on the device, uploads go straight to Cloudflare R2 via presigned URLs, and the Next.js API — migrated over from an earlier Spring Boot backend — handles auth, feed and media. Distributed through EAS Build and TestFlight.',
    tags: ['React Native', 'Expo', 'Next.js', 'FFmpeg', 'PostgreSQL'],
    bar: 'linear-gradient(90deg,#ff6fa8,#e0397a)',
    screenshot: 'screenshots/reellab.png',
    liveNotice: {
      title: 'Available through internal testing',
      body: 'ReelLab ships as a native app, not a website — the build lives in TestFlight on iOS and internal testing on Google Play. Email me and say whether you want the iOS or the Android build, and I will add you as a tester.',
    },
  },
  {
    name: 'Ora',
    full: 'Ora — Time Focus App',
    period: '2026 – Current',
    org: 'Personal · iOS / watchOS',
    desc: 'iOS/watchOS productivity app with deep focus sessions, flow scoring, and Apple Watch integration. Home-screen widgets, complications, and a minimal typographic design system.',
    tags: ['Swift', 'SwiftUI', 'watchOS', 'WidgetKit', 'CoreData'],
    bar: 'linear-gradient(90deg,#7c5cff,#5b3be6)',
    screenshot: 'screenshots/ora.png',
  },
  {
    name: 'Pravilo Posta',
    full: 'Pravilo Posta',
    period: 'Dec 2025 – Jan 2026',
    org: 'Lead RN Developer · Niš',
    desc: 'Cross-platform mobile app live on the App Store and Google Play. Funded by a monastery in Divljane and built to their requirements — a clean, minimal design tailored to their audience.',
    tags: ['React Native', 'iOS', 'Android', 'App Store', 'Google Play'],
    bar: 'linear-gradient(90deg,#4a97ee,#2f6fd0)',
    screenshot: 'screenshots/pravilo-posta.png',
  },
  {
    name: 'WeSucceed',
    full: 'WeSucceed',
    period: 'Oct 2024 – May 2025',
    org: 'Lead iOS & Full-Stack · Novi Sad',
    desc: "Research-backed mobile app supporting women entrepreneurs' competency development. Built iOS in Swift/SwiftUI and co-developed Android in Kotlin/XML. Funded by the Science Fund of the Republic of Serbia (#1012).",
    tags: ['Swift', 'SwiftUI', 'Kotlin', 'iOS', 'Android'],
    bar: 'linear-gradient(90deg,#28b57f,#1f9468)',
    screenshot: 'screenshots/wesucceed.png',
  },
  {
    name: 'Chlanko',
    full: 'Chlanko',
    period: 'Mar 2026 – Apr 2026',
    org: 'Internship · Positive Tech IT',
    desc: 'Cross-platform club management app in React Native, Expo and TypeScript. Role-based access across four roles, a financial module (billing, expenses, reconciliation), scheduling with recurring templates, MinIO/S3 uploads, and EN/SR localization.',
    tags: ['React Native', 'Expo', 'TypeScript', 'PostgreSQL'],
    bar: 'linear-gradient(90deg,#f3902e,#e0791a)',
    screenshot: 'screenshots/club-manager.png',
  },
]

export type BrandIconName =
  | 'swift'
  | 'swiftui'
  | 'kotlin'
  | 'react-native'
  | 'react'
  | 'angular'
  | 'nextjs'
  | 'dotnet'
  | 'spring'
  | 'nodejs'
  | 'postgresql'
  | 'ffmpeg'
  | 'docker'

export interface Tool {
  name: string
  icon: BrandIconName
  color: string
}

export const tools: Tool[] = [
  { name: 'Swift', icon: 'swift', color: 'linear-gradient(160deg,#ff8a5c,#f2542d)' },
  { name: 'SwiftUI', icon: 'swiftui', color: 'linear-gradient(160deg,#5aa9ff,#2f7be0)' },
  { name: 'Kotlin', icon: 'kotlin', color: 'linear-gradient(160deg,#c98bff,#8a4fe0)' },
  { name: 'React Native', icon: 'react-native', color: 'linear-gradient(160deg,#61dafb,#279fce)' },
  { name: 'React', icon: 'react', color: 'linear-gradient(160deg,#7fe3fb,#279fce)' },
  { name: 'Angular', icon: 'angular', color: 'linear-gradient(160deg,#f0603a,#c8351a)' },
  { name: 'Next.js', icon: 'nextjs', color: 'linear-gradient(160deg,#5a5a5f,#18181b)' },
  { name: '.NET', icon: 'dotnet', color: 'linear-gradient(160deg,#8a6cff,#5f3fe0)' },
  { name: 'Spring', icon: 'spring', color: 'linear-gradient(160deg,#8fe06b,#4f9e2c)' },
  { name: 'Node.js', icon: 'nodejs', color: 'linear-gradient(160deg,#5fd0a0,#279a63)' },
  { name: 'PostgreSQL', icon: 'postgresql', color: 'linear-gradient(160deg,#7f93b5,#4f668f)' },
  { name: 'FFmpeg', icon: 'ffmpeg', color: 'linear-gradient(160deg,#5fd08a,#279a5c)' },
  { name: 'Docker', icon: 'docker', color: 'linear-gradient(160deg,#57b7ff,#2b8fe0)' },
]

export interface CatalogItem {
  target: WinId
  name: string
  sub: string
  letter: string
  color: string
}

export const catalog: CatalogItem[] = [
  {
    target: 'about',
    name: 'About Me',
    sub: 'Aleksa Stanković · bio · skills',
    letter: 'A',
    color: 'linear-gradient(160deg,#8fb8ff,#5a8ff0)',
  },
  {
    target: 'projects',
    name: 'Projects',
    sub: 'Kartly · Keyframe · ReelLab',
    letter: 'P',
    color: 'linear-gradient(160deg,#7cc0ff,#4a97ee)',
  },
  {
    target: projectWinId(0),
    name: 'Kartly',
    sub: 'E-commerce · Angular + .NET',
    letter: 'K',
    color: 'linear-gradient(160deg,#ff8a6b,#e0492c)',
  },
  {
    target: projectWinId(1),
    name: 'Keyframe',
    sub: 'Video streaming · Next.js + HLS',
    letter: 'K',
    color: 'linear-gradient(160deg,#5fe0e0,#279aa8)',
  },
  {
    target: projectWinId(2),
    name: 'ReelLab',
    sub: 'Short-video app · Expo + FFmpeg',
    letter: 'R',
    color: 'linear-gradient(160deg,#ff92bd,#e0397a)',
  },
  {
    target: projectWinId(3),
    name: 'Ora',
    sub: 'Time Focus App · iOS/watchOS',
    letter: 'O',
    color: 'linear-gradient(160deg,#a389f4,#7b5be6)',
  },
  {
    target: 'tools',
    name: 'Tools I Use',
    sub: 'Swift · React Native · .NET',
    letter: 'T',
    color: 'linear-gradient(160deg,#ffb35c,#f3902e)',
  },
  {
    target: 'github',
    name: 'Activity',
    sub: 'Contribution graph',
    letter: 'G',
    color: 'linear-gradient(160deg,#3fce6e,#25a04d)',
  },
  {
    target: 'nowplaying',
    name: 'Now Playing',
    sub: 'IngSoftware AI Full Stack internship',
    letter: 'N',
    color: 'linear-gradient(160deg,#c98bff,#8a4fe0)',
  },
  {
    target: 'weather',
    name: 'Milestones',
    sub: 'Career forecast · grad 2026',
    letter: 'M',
    color: 'linear-gradient(160deg,#63a4f0,#2f6fd0)',
  },
  {
    target: 'contact',
    name: 'Contact',
    sub: 'Email · GitHub · LinkedIn',
    letter: 'C',
    color: 'linear-gradient(160deg,#5fd0a0,#28b57f)',
  },
  {
    target: 'terminal',
    name: 'Terminal',
    sub: 'whoami · ls projects · contact --email',
    letter: '_',
    color: 'linear-gradient(160deg,#3a3a3f,#101012)',
  },
]

export const skills = [
  '.NET',
  'Spring',
  'Node.js',
  'Angular',
  'React',
  'Next.js',
  'PostgreSQL',
  'React Native',
  'Swift',
]

export const milestones = [
  { year: '2018', label: 'School' },
  { year: '2022', label: 'BSc' },
  { year: '2024', label: 'Lead iOS' },
  { year: '2025', label: 'Shipped' },
  { year: 'Jul–Sep 2026', label: 'Ing Internship' },
]
