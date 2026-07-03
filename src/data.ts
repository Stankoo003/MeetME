export type AppId =
  'about' | 'projects' | 'proj1' | 'tools' | 'github' | 'nowplaying' | 'weather' | 'contact'

export interface Project {
  name: string
  full: string
  period: string
  org: string
  desc: string
  tags: string[]
  bar: string
}

export const projects: Project[] = [
  {
    name: 'Ora',
    full: 'Ora — Time Focus App',
    period: '2026 – Current',
    org: 'Personal · iOS / watchOS',
    desc: 'iOS/watchOS productivity app with deep focus sessions, flow scoring, and Apple Watch integration. Home-screen widgets, complications, and a minimal typographic design system.',
    tags: ['Swift', 'SwiftUI', 'watchOS', 'WidgetKit', 'CoreData'],
    bar: 'linear-gradient(90deg,#7c5cff,#5b3be6)',
  },
  {
    name: 'Pravilo Posta',
    full: 'Pravilo Posta',
    period: 'Dec 2025 – Jan 2026',
    org: 'Lead RN Developer · Niš',
    desc: 'Cross-platform mobile app live on the App Store and Google Play. Funded by a monastery in Divljane and built to their requirements — a clean, minimal design tailored to their audience.',
    tags: ['React Native', 'iOS', 'Android', 'App Store', 'Google Play'],
    bar: 'linear-gradient(90deg,#4a97ee,#2f6fd0)',
  },
  {
    name: 'WeSucceed',
    full: 'WeSucceed',
    period: 'Oct 2024 – May 2025',
    org: 'Lead iOS & Full-Stack · Novi Sad',
    desc: "Research-backed mobile app supporting women entrepreneurs' competency development. Built iOS in Swift/SwiftUI and co-developed Android in Kotlin/XML. Funded by the Science Fund of the Republic of Serbia (#1012).",
    tags: ['Swift', 'SwiftUI', 'Kotlin', 'iOS', 'Android'],
    bar: 'linear-gradient(90deg,#28b57f,#1f9468)',
  },
  {
    name: 'Club Manager',
    full: 'Sports Club Manager',
    period: 'Mar 2026 – Apr 2026',
    org: 'Internship · Positive Tech IT',
    desc: 'Cross-platform club management app in React Native, Expo and TypeScript. Role-based access across four roles, a financial module (billing, expenses, reconciliation), scheduling with recurring templates, MinIO/S3 uploads, and EN/SR localization.',
    tags: ['React Native', 'Expo', 'TypeScript', 'PostgreSQL'],
    bar: 'linear-gradient(90deg,#f3902e,#e0791a)',
  },
  {
    name: 'Drive.GO',
    full: 'Drive.GO',
    period: '2023',
    org: 'DigiHack 2023 · Niš',
    desc: 'Mobility hackathon project built at DigiHack 2023 in Niš.',
    tags: ['Mobile', 'Hackathon'],
    bar: 'linear-gradient(90deg,#f0506a,#d63a54)',
  },
]

export interface Tool {
  name: string
  letter: string
  color: string
}

export const tools: Tool[] = [
  { name: 'Swift', letter: 'Sw', color: 'linear-gradient(160deg,#ff8a5c,#f2542d)' },
  { name: 'SwiftUI', letter: 'UI', color: 'linear-gradient(160deg,#5aa9ff,#2f7be0)' },
  { name: 'Kotlin', letter: 'Kt', color: 'linear-gradient(160deg,#c98bff,#8a4fe0)' },
  { name: 'React Native', letter: 'RN', color: 'linear-gradient(160deg,#61dafb,#279fce)' },
  { name: '.NET', letter: '.N', color: 'linear-gradient(160deg,#8a6cff,#5f3fe0)' },
  { name: 'Node.js', letter: 'No', color: 'linear-gradient(160deg,#5fd0a0,#279a63)' },
  { name: 'PostgreSQL', letter: 'PG', color: 'linear-gradient(160deg,#7f93b5,#4f668f)' },
  { name: 'Docker', letter: 'Dk', color: 'linear-gradient(160deg,#57b7ff,#2b8fe0)' },
]

export interface CatalogItem {
  target: AppId
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
    sub: 'Ora · Pravilo Posta · WeSucceed',
    letter: 'P',
    color: 'linear-gradient(160deg,#7cc0ff,#4a97ee)',
  },
  {
    target: 'proj1',
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
    sub: 'Building Ora · lo-fi',
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
]

export const skills = ['Swift', 'SwiftUI', 'React Native', 'Kotlin', '.NET', 'Node.js']

export const milestones = [
  { year: '2018', label: 'School' },
  { year: '2022', label: 'BSc' },
  { year: '2024', label: 'Lead iOS' },
  { year: '2025', label: 'Shipped' },
]
