// date.ts — date helpers (UTC date-only ISO strings, matching the design).

const DAY = 86_400_000

export const todayISO = (): string => new Date().toISOString().slice(0, 10)
export const iso = (d: Date): string => d.toISOString().slice(0, 10)
export const daysAgo = (n: number): string => iso(new Date(Date.now() - n * DAY))
export const daysUntil = (isoStr: string): number =>
  Math.ceil((new Date(isoStr + 'T00:00:00').getTime() - new Date(todayISO() + 'T00:00:00').getTime()) / DAY)

export const fmtDate = (isoStr: string): string =>
  new Date(isoStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export const round1 = (n: number): number => Math.round(n * 10) / 10
