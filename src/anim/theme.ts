// theme.ts — a self-contained palette for the DSA animations. The Remotion
// Player renders real DOM/SVG inline in the page, but we deliberately give the
// animation "screen" its own dark, theme-independent look (like a little video
// player) so colours stay vivid and consistent in both light and dark mode.

export const COLORS = {
  bg: '#0e131b',
  panel: '#161d28',
  line: '#2a3340',
  text: '#e7edf4',
  muted: '#93a1b2',
  faint: '#5d6b7d',
  blue: '#4f8cff',
  green: '#34d399',
  red: '#f87171',
  amber: '#fbbf24',
  violet: '#a78bfa',
  cyan: '#22d3ee',
  slate: '#3a4757',
} as const

export type ColorName = 'blue' | 'green' | 'red' | 'amber' | 'violet' | 'cyan' | 'slate'

// Resolve a named accent (used in scene data) to a hex value, defaulting to blue.
export const accent = (name?: string): string =>
  (name && (COLORS as Record<string, string>)[name]) || COLORS.blue

// Smoothstep easing: gentle acceleration and deceleration, t in [0, 1].
export const ease = (t: number): number => {
  const c = Math.min(Math.max(t, 0), 1)
  return c * c * (3 - 2 * c)
}

export const FONT_MONO =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, "Cascadia Code", Consolas, monospace'
export const FONT_SANS =
  'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
