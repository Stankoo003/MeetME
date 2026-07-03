import dockerSvg from 'simple-icons/icons/docker.svg?raw'
import dotnetSvg from 'simple-icons/icons/dotnet.svg?raw'
import kotlinSvg from 'simple-icons/icons/kotlin.svg?raw'
import nodejsSvg from 'simple-icons/icons/nodedotjs.svg?raw'
import postgresqlSvg from 'simple-icons/icons/postgresql.svg?raw'
import reactSvg from 'simple-icons/icons/react.svg?raw'
import swiftSvg from 'simple-icons/icons/swift.svg?raw'
import appleSvg from 'simple-icons/icons/apple.svg?raw'
import type { BrandIconName } from '../data'

// SwiftUI and React Native have no dedicated Simple Icons brand mark — Apple
// and React's own logos are the closest accurate stand-ins.
const ICONS: Record<BrandIconName, string> = {
  swift: swiftSvg,
  swiftui: appleSvg,
  kotlin: kotlinSvg,
  'react-native': reactSvg,
  dotnet: dotnetSvg,
  nodejs: nodejsSvg,
  postgresql: postgresqlSvg,
  docker: dockerSvg,
}

// Every Simple Icons SVG ships as a bare `<path d="...">` with no fill
// attribute, so it inherits `fill` from this wrapper — recolor by setting
// `color` (via the `fill` CSS property) on the wrapping element instead.
function extractPath(svg: string): string {
  const match = svg.match(/<path d="([^"]+)"/)
  return match ? match[1] : ''
}

const PATHS: Record<BrandIconName, string> = Object.fromEntries(
  (Object.entries(ICONS) as [BrandIconName, string][]).map(([name, svg]) => [
    name,
    extractPath(svg),
  ]),
) as Record<BrandIconName, string>

interface BrandIconProps {
  name: BrandIconName
  size?: number
  color?: string
}

export function BrandIcon({ name, size = 20, color = 'currentColor' }: BrandIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ fill: color, flexShrink: 0 }}
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
