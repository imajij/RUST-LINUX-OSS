import type { SVGProps } from 'react'

const ICON_PATHS: Record<string, string> = {
  overview: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',
  roadmap: 'M9 6H5a2 2 0 00-2 2v0a2 2 0 002 2h10a2 2 0 012 2v0a2 2 0 01-2 2H9M5 6a2 2 0 100-4 2 2 0 000 4zM19 22a2 2 0 100-4 2 2 0 000 4z',
  study: 'M12 8v5l3 2M12 22a9 9 0 100-18 9 9 0 000 18zM9 2h6',
  contribs: 'M6 3a3 3 0 100 6 3 3 0 000-6zM6 9v9M18 21a3 3 0 100-6 3 3 0 000 6zM18 15V9a3 3 0 00-3-3h-4',
  reading: 'M3 5h5a3 3 0 013 3v11a2.5 2.5 0 00-2.5-2.5H3zM21 5h-5a3 3 0 00-3 3v11a2.5 2.5 0 012.5-2.5H21z',
  goals: 'M12 22a10 10 0 100-20 10 10 0 000 20zM12 18a6 6 0 100-12 6 6 0 000 12zM12 14a2 2 0 100-4 2 2 0 000 4z',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-2.82 1.17V21a2 2 0 11-4 0v-.09A1.65 1.65 0 007 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 003.6 14H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 8.4l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 0010 4.6V3a2 2 0 114 0v.09A1.65 1.65 0 0017 4.6l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 10H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.5 1z',
  flame: 'M12 2s4 4 4 8a4 4 0 01-8 0c0-1 .5-2 .5-2S6 11 6 14a6 6 0 0012 0c0-5-6-12-6-12z',
  plus: 'M12 5v14M5 12h14',
  sun: 'M12 17a5 5 0 100-10 5 5 0 000 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  moon: 'M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z',
  trophy: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0zM7 5H4v2a3 3 0 003 3M17 5h3v2a3 3 0 01-3 3',
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18M6 6l12 12',
  chevdown: 'M6 9l6 6 6-6',
  chevright: 'M9 6l6 6-6 6',
  pencil: 'M17 3a2.8 2.8 0 014 4L7.5 20.5 2 22l1.5-5.5z',
  trash: 'M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6',
  link: 'M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1.5 1.5M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1.5-1.5',
  sync: 'M21 2v6h-6M3 12a9 9 0 0115-6.7L21 8M3 22v-6h6M21 12a9 9 0 01-15 6.7L3 16',
  merge: 'M6 3a3 3 0 100 6 3 3 0 000-6zM6 9v12M18 9a3 3 0 100-6 3 3 0 000 6zM18 9c0 6-6 6-6 12',
  spark: 'M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17l-1.9-5.1L4.5 10l5.6-1.4zM19 14l.8 2.4L22 17l-2.2.6L19 20l-.8-2.4L16 17l2.2-.6z',
  zap: 'M13 2L3 14h8l-1 8 10-12h-8z',
  cat: 'M4 4l3 4M20 4l-3 4M5 8c-1 3-1 7 0 9 1.5 3 4 4 7 4s5.5-1 7-4c1-2 1-6 0-9-.8 2-2 3-3.5 3h-7C8 14 6.8 13 6 11z',
  clock: 'M12 7v5l3 2M12 22a9 9 0 100-18 9 9 0 000 18z',
  calendar: 'M3 5h18v16H3zM3 9h18M8 2v4M16 2v4',
  upload: 'M12 16V4M7 9l5-5 5 5M4 20h16',
  download: 'M12 4v12M7 11l5 5 5-5M4 20h16',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 018 0v4',
  code: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
  bulb: 'M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.3 1 2.1h5c0-.8.4-1.6 1-2.1A6 6 0 0012 3z',
  play: 'M6 4l13 8-13 8z',
  bookmark: 'M6 3h12a1 1 0 011 1v17l-7-4.5L5 21V4a1 1 0 011-1z',
  filter: 'M3 4h18l-7 8v7l-4 2v-9z',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 15a3 3 0 100-6 3 3 0 000 6z',
  grad: 'M12 4L2 9l10 5 10-5zM6 11.5V16c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-4.5M21 9.5v5',
}

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name' | 'fill' | 'stroke'> {
  name: string
  size?: number
  stroke?: number
  fill?: boolean
}

export function Icon({ name, size = 18, stroke = 2, fill = false, style, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}
      {...rest}
    >
      <path d={ICON_PATHS[name] || ''} />
    </svg>
  )
}
