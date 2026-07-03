export interface Theme {
  desktop: string
  watermark: string
  barText: string
  card: string
  cardBorder: string
  head: string
  line: string
  text: string
  sub: string
  chipBg: string
  chipText: string
  sideBg: string
  stripeA: string
  stripeB: string
  dockBg: string
  dockBorder: string
  divider: string
  pillBg: string
  pillBorder: string
  spotBg: string
  spotBar: string
  spotPanel: string
  spotText: string
  spotBorder: string
}

export const darkTheme: Theme = {
  desktop: 'linear-gradient(165deg,#20222a 0%,#16181e 55%,#0f1015 100%)',
  watermark: 'rgba(255,255,255,0.04)',
  barText: '#f0f0f2',
  card: '#282a30',
  cardBorder: 'rgba(255,255,255,0.1)',
  head: '#303239',
  line: 'rgba(255,255,255,0.09)',
  text: '#f0f0f2',
  sub: '#9a9aa2',
  chipBg: '#3a3c44',
  chipText: '#d6d6da',
  sideBg: '#232429',
  stripeA: '#2e3038',
  stripeB: '#26282e',
  dockBg: 'rgba(44,46,52,0.55)',
  dockBorder: 'rgba(255,255,255,0.12)',
  divider: 'rgba(255,255,255,0.14)',
  pillBg: 'rgba(44,46,52,0.6)',
  pillBorder: 'rgba(255,255,255,0.12)',
  spotBg: 'rgba(0,0,0,0.4)',
  spotBar: 'rgba(38,40,46,0.85)',
  spotPanel: 'rgba(38,40,46,0.92)',
  spotText: '#f0f0f2',
  spotBorder: 'rgba(255,255,255,0.1)',
}

export const lightTheme: Theme = {
  desktop: 'linear-gradient(165deg,#eef0f4 0%,#e4e7ec 55%,#dcdfe6 100%)',
  watermark: 'rgba(60,70,90,0.045)',
  barText: '#1d1d1f',
  card: '#fbfbfd',
  cardBorder: 'rgba(0,0,0,0.12)',
  head: '#f2f2f4',
  line: 'rgba(0,0,0,0.09)',
  text: '#1d1d1f',
  sub: '#86868b',
  chipBg: '#eef0f3',
  chipText: '#3a3a3f',
  sideBg: '#ececf0',
  stripeA: '#eef0f3',
  stripeB: '#e6e8ec',
  dockBg: 'rgba(255,255,255,0.5)',
  dockBorder: 'rgba(255,255,255,0.6)',
  divider: 'rgba(0,0,0,0.14)',
  pillBg: 'rgba(255,255,255,0.6)',
  pillBorder: 'rgba(0,0,0,0.08)',
  spotBg: 'rgba(20,25,35,0.18)',
  spotBar: 'rgba(245,246,248,0.82)',
  spotPanel: 'rgba(245,246,248,0.9)',
  spotText: '#1d1d1f',
  spotBorder: 'rgba(0,0,0,0.1)',
}

export const contributionPalette = {
  dark: ['#2b2d34', '#0e4429', '#006d32', '#26a641', '#39d353'],
  light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
}
