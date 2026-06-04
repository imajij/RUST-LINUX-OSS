// Heatmap — GitHub-style "don't break the chain" grid, cells pop in one by one.

import { fmtDate, iso, todayISO } from '../lib/date'

interface Cell { ds: string; mins: number; lvl: number; future: boolean }

export function Heatmap({
  activity, weeks = 26, cell = 14, gap = 4, animate = true, onHover,
}: {
  activity: Record<string, number>
  weeks?: number
  cell?: number
  gap?: number
  animate?: boolean
  onHover?: (c: Cell) => void
}) {
  const cols: Cell[][] = []
  const today = new Date(todayISO() + 'T00:00:00')
  const todayDow = today.getDay()
  const totalDays = weeks * 7
  const start = new Date(today.getTime() - (totalDays - 1 - (6 - todayDow)) * 86400000)
  let d = new Date(start)
  for (let w = 0; w < weeks; w++) {
    const col: Cell[] = []
    for (let dow = 0; dow < 7; dow++) {
      const ds = iso(d)
      const mins = activity[ds] || 0
      const future = d > today
      const lvl = future ? -1 : mins === 0 ? 0 : mins < 45 ? 1 : mins < 90 ? 2 : mins < 150 ? 3 : 4
      col.push({ ds, mins, lvl, future })
      d = new Date(d.getTime() + 86400000)
    }
    cols.push(col)
  }
  return (
    <div style={{ display: 'flex', gap, overflowX: 'auto', paddingBottom: 2 }}>
      {cols.map((col, w) => (
        <div key={w} style={{ display: 'flex', flexDirection: 'column', gap }}>
          {col.map((c, i) => {
            if (c.future) return <div key={i} style={{ width: cell, height: cell }} />
            const op = c.lvl === 0 ? 1 : 0.34 + c.lvl * 0.17
            return (
              <div
                key={i}
                title={`${fmtDate(c.ds)} · ${c.mins ? Math.round(c.mins) + ' min' : 'no activity'}`}
                onMouseEnter={() => onHover && onHover(c)}
                style={{
                  width: cell, height: cell, borderRadius: 4, cursor: 'default',
                  background: c.lvl === 0 ? 'var(--heat-empty)' : 'var(--accent)', opacity: c.lvl === 0 ? 1 : op,
                  animation: animate ? 'hm-pop .5s cubic-bezier(.22,1,.36,1) both' : 'none',
                  animationDelay: animate ? `${(w * 7 + i) * 7}ms` : '0ms',
                }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
