// charts.tsx — lightweight themed bar charts (no external deps).

import { useState } from 'react'
import type { MouseEvent } from 'react'
import { round1 } from '../lib/date'

interface TipRow { label: string; value: number; color: string }
interface TipState { x: number; y: number; rows: TipRow[]; title: string }

function ChartTip({ x, y, rows, title, unit }: TipState & { unit?: string }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y, transform: 'translate(-50%, -110%)', pointerEvents: 'none',
      background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, padding: '8px 11px',
      boxShadow: '0 12px 28px -14px rgba(0,0,0,0.5)', zIndex: 30, whiteSpace: 'nowrap',
    }}>
      {title && <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>{title}</div>}
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5 }}>
          <span style={{ width: 8, height: 8, borderRadius: 3, background: r.color }} />
          <span style={{ color: 'var(--muted)', fontWeight: 600 }}>{r.label}</span>
          <span className="tabular" style={{ marginLeft: 'auto', color: 'var(--text)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{r.value}{unit || ''}</span>
        </div>
      ))}
    </div>
  )
}

export interface Seg { key?: string; label: string; value: number; color: string }
export interface StackedDatum { label: string; segs: Seg[] }

export function StackedBars({ data, height = 150, unit = 'h', keys }: {
  data: StackedDatum[]; height?: number; unit?: string; keys?: { label: string; color: string }[]
}) {
  const [tip, setTip] = useState<TipState | null>(null)
  const max = Math.max(1, ...data.map((d) => d.segs.reduce((a, s) => a + s.value, 0)))
  const ticks = niceTicks(max)
  const top = ticks[ticks.length - 1]
  return (
    <div>
      <div style={{ position: 'relative', display: 'flex', height, paddingLeft: 30 }}>
        <div style={{ position: 'absolute', left: 30, right: 0, top: 0, bottom: 18 }}>
          {ticks.map((t, i) => (
            <div key={i} style={{ position: 'absolute', left: 0, right: 0, bottom: `${(t / top) * 100}%`, borderTop: '1px solid var(--line)', opacity: 0.6 }}>
              <span style={{ position: 'absolute', left: -28, top: -7, fontSize: 9.5, color: 'var(--faint)', fontFamily: 'var(--font-mono)' }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flex: 1, alignItems: 'flex-end', gap: 'min(2.5%, 12px)', position: 'relative', paddingBottom: 18 }}>
          {data.map((d, i) => {
            const total = d.segs.reduce((a, s) => a + s.value, 0)
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', position: 'relative' }}
                onMouseEnter={(e: MouseEvent<HTMLDivElement>) => setTip({
                  x: e.currentTarget.offsetLeft + e.currentTarget.offsetWidth / 2,
                  y: e.currentTarget.offsetTop + (1 - total / top) * (height - 18),
                  rows: d.segs.filter((s) => s.value > 0).map((s) => ({ label: s.label, value: round1(s.value), color: s.color })),
                  title: d.label,
                })}
                onMouseLeave={() => setTip(null)}>
                <div style={{ display: 'flex', flexDirection: 'column-reverse', height: `${(total / top) * 100}%`, minHeight: total > 0 ? 4 : 0, borderRadius: '6px 6px 3px 3px', overflow: 'hidden', transition: 'height .6s cubic-bezier(.22,1,.36,1)' }}>
                  {d.segs.map((s, j) => s.value > 0 && <div key={j} style={{ flex: s.value, background: s.color, minHeight: 2 }} />)}
                </div>
                <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center', fontSize: 9.5, color: 'var(--faint)', fontFamily: 'var(--font-mono)' }}>{d.label}</span>
              </div>
            )
          })}
        </div>
        {tip && <ChartTip {...tip} unit={unit} />}
      </div>
      {keys && (
        <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
          {keys.map((k) => (
            <span key={k.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>
              <span style={{ width: 9, height: 9, borderRadius: 3, background: k.color }} />{k.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export interface BarDatum { label: string; value: number; full?: string }
export function Bars({ data, height = 150, color = 'var(--accent)', unit = '' }: {
  data: BarDatum[]; height?: number; color?: string; unit?: string
}) {
  const [tip, setTip] = useState<TipState | null>(null)
  const max = Math.max(1, ...data.map((d) => d.value))
  const ticks = niceTicks(max)
  const top = ticks[ticks.length - 1]
  return (
    <div style={{ position: 'relative', display: 'flex', height, paddingLeft: 30 }}>
      <div style={{ position: 'absolute', left: 30, right: 0, top: 0, bottom: 18 }}>
        {ticks.map((t, i) => (
          <div key={i} style={{ position: 'absolute', left: 0, right: 0, bottom: `${(t / top) * 100}%`, borderTop: '1px solid var(--line)', opacity: 0.6 }}>
            <span style={{ position: 'absolute', left: -28, top: -7, fontSize: 9.5, color: 'var(--faint)', fontFamily: 'var(--font-mono)' }}>{t}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flex: 1, alignItems: 'flex-end', gap: 'min(2%, 8px)', paddingBottom: 18 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', position: 'relative' }}
            onMouseEnter={(e: MouseEvent<HTMLDivElement>) => setTip({
              x: e.currentTarget.offsetLeft + e.currentTarget.offsetWidth / 2,
              y: e.currentTarget.offsetTop + (1 - d.value / top) * (height - 18),
              rows: [{ label: d.full || d.label, value: d.value, color }], title: '',
            })}
            onMouseLeave={() => setTip(null)}>
            <div style={{ height: `${(d.value / top) * 100}%`, minHeight: d.value > 0 ? 4 : 0, background: `linear-gradient(180deg, color-mix(in srgb, ${color} 75%, white), ${color})`, borderRadius: '6px 6px 3px 3px', transition: 'height .6s cubic-bezier(.22,1,.36,1)' }} />
            <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center', fontSize: 9.5, color: 'var(--faint)', fontFamily: 'var(--font-mono)' }}>{d.label}</span>
          </div>
        ))}
      </div>
      {tip && <ChartTip {...tip} unit={unit} />}
    </div>
  )
}

function niceTicks(max: number): number[] {
  const step = max <= 4 ? 1 : max <= 8 ? 2 : max <= 20 ? 5 : max <= 50 ? 10 : Math.ceil(max / 5 / 10) * 10
  const tp = Math.ceil(max / step) * step
  const out: number[] = []
  for (let t = 0; t <= tp; t += step) out.push(t)
  return out
}
