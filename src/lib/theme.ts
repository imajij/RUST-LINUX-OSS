// theme.ts — applies theme + accent/font/density CSS variables to <html>.

import type { Settings, ThemeName } from '../types'

const ACCENTS: Record<string, { a: string; d: string; soft: string; on: string }> = {
  lime: { a: '#86CB12', d: '#4E810A', soft: '#EAF7CE', on: '#1f3300' },
  orange: { a: '#F7853A', d: '#C5611D', soft: '#FFE7D2', on: '#3a1c00' },
  violet: { a: '#9B5CFF', d: '#7327E0', soft: '#EDE2FF', on: '#ffffff' },
  cyan: { a: '#22B8CF', d: '#0E8DA1', soft: '#D6F4F8', on: '#06343b' },
}
const FONTS: Record<string, string> = {
  fredoka: "'Fredoka', sans-serif",
  bricolage: "'Bricolage Grotesque', sans-serif",
  gabarito: "'Gabarito', sans-serif",
}

export function applyTheme(theme: ThemeName, settings: Settings) {
  const r = document.documentElement
  r.setAttribute('data-theme', theme)
  const ac = ACCENTS[settings.accent] || ACCENTS.lime
  r.style.setProperty('--accent', ac.a)
  r.style.setProperty('--accent-deep', ac.d)
  r.style.setProperty('--accent-soft', theme === 'dark' ? `color-mix(in srgb, ${ac.a} 22%, #14110B)` : ac.soft)
  r.style.setProperty('--on-accent', ac.on)
  r.style.setProperty('--font-display', FONTS[settings.font] || FONTS.fredoka)
  r.setAttribute('data-density', settings.density || 'cozy')
}
