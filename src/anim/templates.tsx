// templates.tsx — four generic, data-driven Remotion compositions. Each takes a
// scene's `data` plus `stepFrames` and animates through the steps: pointers glide
// between cells, bars ease to new heights, grid cells pop in, graph nodes light
// up. Scene files never touch this code — they only describe steps (see types.ts).

import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import type { ReactNode } from 'react'
import { COLORS, accent, ease, FONT_MONO, FONT_SANS } from './theme'
import type {
  ArrayScanData, BarChartData, GridData, GraphData,
  ArrayStep, CellPatch, CellState,
} from './types'

const HEADER_H = 46
const CAPTION_H = 86

/* ---------------- shared timing ---------------- */
// Which step are we on, and how far through it (local 0..1)?
function useStep(count: number, stepFrames: number) {
  const frame = useCurrentFrame()
  const sf = Math.max(1, stepFrames)
  const raw = frame / sf
  const index = Math.max(0, Math.min(Math.floor(raw), Math.max(0, count - 1)))
  const local = Math.min(Math.max(raw - index, 0), 1)
  return { index, local, frame }
}

// Eased progress over the first `portion` of a step (then holds at 1).
const segment = (local: number, portion: number) => ease(Math.min(local / portion, 1))

/* ---------------- stage chrome (title, step counter, caption) ---------------- */
function Stage({ title, index, count, caption, children }: {
  title: string; index: number; count: number; caption: string; children: ReactNode
}) {
  const { height } = useVideoConfig()
  const contentH = height - HEADER_H - CAPTION_H
  return (
    <AbsoluteFill style={{ background: COLORS.bg, fontFamily: FONT_SANS }}>
      {/* header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: HEADER_H,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', borderBottom: `1px solid ${COLORS.line}`, color: COLORS.muted,
      }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 14, fontWeight: 700, color: COLORS.text, letterSpacing: 0.3 }}>{title}</span>
        <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: COLORS.faint }}>step {index + 1} / {count}</span>
      </div>
      {/* content band */}
      <div style={{ position: 'absolute', top: HEADER_H, left: 0, right: 0, height: contentH }}>
        {children}
      </div>
      {/* caption */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: CAPTION_H,
        display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '0 26px', borderTop: `1px solid ${COLORS.line}`, background: COLORS.panel,
      }}>
        <span style={{ fontSize: 17, lineHeight: 1.4, color: COLORS.text, fontWeight: 500 }}>{caption}</span>
      </div>
    </AbsoluteFill>
  )
}

const band = (height: number) => height - HEADER_H - CAPTION_H

/* ====================================================================== */
/* arrayScan                                                              */
/* ====================================================================== */
export function ArrayScan({ data, stepFrames, title }: { data: ArrayScanData; stepFrames: number; title: string }) {
  const { width, height } = useVideoConfig()
  const steps = data.steps
  const { index, local } = useStep(steps.length, stepFrames)
  const step: ArrayStep = steps[index] ?? { caption: '' }
  const prev = index > 0 ? steps[index - 1] : undefined

  const n = Math.max(1, data.values.length)
  const padX = 36
  const gap = 10
  const cellW = Math.max(22, Math.min(64, (width - 2 * padX - gap * (n - 1)) / n))
  const cellH = Math.min(64, cellW)
  const rowW = cellW * n + gap * (n - 1)
  const startX = (width - rowW) / 2
  const cy = band(height) / 2 + 6
  const cellX = (i: number) => startX + i * (cellW + gap)

  const inSet = (arr: number[] | undefined, i: number) => !!arr && arr.indexOf(i) !== -1

  // Group markers that share a cell into stacked lanes so labels don't overlap.
  const markers = step.markers ?? []
  const laneOf = (mi: number) => {
    let lane = 0
    for (let k = 0; k < mi; k++) if (markers[k].index === markers[mi].index) lane++
    return lane
  }

  return (
    <Stage title={title} index={index} count={steps.length} caption={step.caption}>
      {data.values.map((v, i) => {
        const found = inSet(step.found, i)
        const hi = inSet(step.highlight, i)
        const shaded = inSet(step.shade, i)
        const pop = found ? 1 + 0.14 * (1 - segment(local, 0.34)) : 1
        const border = found ? COLORS.green : hi ? COLORS.blue : COLORS.line
        const bg = found
          ? 'rgba(52,211,153,0.18)'
          : hi ? 'rgba(79,140,255,0.16)' : COLORS.panel
        return (
          <div key={i} style={{
            position: 'absolute', left: cellX(i), top: cy - cellH / 2, width: cellW, height: cellH,
            transform: `scale(${pop})`, opacity: shaded ? 0.28 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `2px solid ${border}`, borderRadius: 10, background: bg,
            color: COLORS.text, fontFamily: FONT_MONO, fontSize: Math.min(20, cellW * 0.42), fontWeight: 700,
          }}>{String(v)}</div>
        )
      })}

      {/* index ruler under the cells */}
      {data.values.map((_, i) => (
        <div key={'r' + i} style={{
          position: 'absolute', left: cellX(i), top: cy + cellH / 2 + 6, width: cellW,
          textAlign: 'center', color: COLORS.faint, fontFamily: FONT_MONO, fontSize: 11,
        }}>{i}</div>
      ))}

      {/* markers (pointers) glide between cells */}
      {markers.map((m, mi) => {
        const prevM = prev?.markers?.find((p) => p.label === m.label)
        const from = prevM ? prevM.index : m.index
        const fi = from + (m.index - from) * segment(local, 0.55)
        const x = cellX(fi) + cellW / 2
        const lane = laneOf(mi)
        const yTop = cy - cellH / 2 - 16 - lane * 22
        const col = accent(m.color)
        const appear = prevM ? 1 : segment(local, 0.4)
        return (
          <div key={'m' + m.label} style={{
            position: 'absolute', left: x, top: yTop, transform: 'translate(-50%, -100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: appear,
          }}>
            <div style={{
              padding: '2px 7px', borderRadius: 7, background: col, color: '#0b0f15',
              fontFamily: FONT_MONO, fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap',
            }}>{m.label}</div>
            <div style={{
              width: 0, height: 0,
              borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
              borderTop: `7px solid ${col}`,
            }} />
          </div>
        )
      })}
    </Stage>
  )
}

/* ====================================================================== */
/* barChart                                                               */
/* ====================================================================== */
export function BarChart({ data, stepFrames, title }: { data: BarChartData; stepFrames: number; title: string }) {
  const { width, height } = useVideoConfig()
  const steps = data.steps
  const { index, local } = useStep(steps.length, stepFrames)
  const step = steps[index] ?? { caption: '' }

  // Effective values at a given step = the most recent `values` override <= step.
  const valuesAt = (upto: number): number[] => {
    let v = data.values
    for (let s = 0; s <= upto && s < steps.length; s++) if (steps[s].values) v = steps[s].values as number[]
    return v
  }
  const cur = valuesAt(index)
  const prevVals = valuesAt(Math.max(0, index - 1))
  const n = Math.max(1, cur.length)
  const maxV = Math.max(1, ...cur, ...prevVals)

  const padX = 40
  const gap = 12
  const barW = Math.max(16, Math.min(70, (width - 2 * padX - gap * (n - 1)) / n))
  const rowW = barW * n + gap * (n - 1)
  const startX = (width - rowW) / 2
  const baseY = band(height) - 34
  const maxBarH = band(height) - 70
  const k = segment(local, 0.6)

  const inSet = (arr: number[] | undefined, i: number) => !!arr && arr.indexOf(i) !== -1

  return (
    <Stage title={title} index={index} count={steps.length} caption={step.caption}>
      {cur.map((v, i) => {
        const from = prevVals[i] ?? v
        const shown = from + (v - from) * k
        const h = Math.max(4, (shown / maxV) * maxBarH)
        const sorted = inSet(step.sorted, i)
        const cmp = inSet(step.compare, i)
        const hi = inSet(step.highlight, i)
        const col = sorted ? COLORS.green : cmp ? COLORS.amber : hi ? COLORS.blue : COLORS.slate
        const x = startX + i * (barW + gap)
        return (
          <div key={i}>
            <div style={{
              position: 'absolute', left: x, top: baseY - h, width: barW, height: h,
              background: col, borderRadius: '7px 7px 3px 3px', display: 'flex',
              alignItems: 'flex-start', justifyContent: 'center', paddingTop: 4,
              color: '#0b0f15', fontFamily: FONT_MONO, fontSize: 13, fontWeight: 800,
            }}>{Math.round(shown)}</div>
            <div style={{
              position: 'absolute', left: x, top: baseY + 6, width: barW, textAlign: 'center',
              color: COLORS.faint, fontFamily: FONT_MONO, fontSize: 11,
            }}>{i}</div>
          </div>
        )
      })}
    </Stage>
  )
}

/* ====================================================================== */
/* grid                                                                   */
/* ====================================================================== */
const CELL_BG: Record<CellState, string> = {
  idle: COLORS.panel,
  active: 'rgba(79,140,255,0.85)',
  done: 'rgba(52,211,153,0.85)',
  wall: '#202833',
  mark: 'rgba(251,191,36,0.9)',
  path: 'rgba(167,139,250,0.9)',
  value: COLORS.panel,
}
const CELL_FG: Record<CellState, string> = {
  idle: COLORS.muted, active: '#0b0f15', done: '#0b0f15', wall: COLORS.faint,
  mark: '#0b0f15', path: '#0b0f15', value: COLORS.text,
}

export function GridAnim({ data, stepFrames, title }: { data: GridData; stepFrames: number; title: string }) {
  const { width, height } = useVideoConfig()
  const steps = data.steps
  const { index, local } = useStep(steps.length, stepFrames)
  const step = steps[index] ?? { caption: '', cells: [] as CellPatch[] }

  // Cumulative cell map up to and including the current step.
  const map = new Map<string, CellPatch>()
  const apply = (patches?: CellPatch[]) => { for (const p of patches ?? []) map.set(p.r + ',' + p.c, { ...map.get(p.r + ',' + p.c), ...p }) }
  apply(data.init)
  for (let s = 0; s <= index && s < steps.length; s++) apply(steps[s].cells)
  const changedThisStep = new Set((step.cells ?? []).map((p) => p.r + ',' + p.c))

  const hasRowLabels = !!data.rowLabels?.length
  const hasColLabels = !!data.colLabels?.length
  const labelGut = 26
  const padX = 30
  const topGut = hasColLabels ? labelGut : 0
  const leftGut = hasRowLabels ? labelGut : 0
  const availW = width - 2 * padX - leftGut
  const availH = band(height) - 28 - topGut
  const gap = 6
  const cell = Math.max(14, Math.min(
    52,
    (availW - gap * (data.cols - 1)) / data.cols,
    (availH - gap * (data.rows - 1)) / data.rows,
  ))
  const gridW = cell * data.cols + gap * (data.cols - 1)
  const ox = (width - gridW - leftGut) / 2 + leftGut
  const oy = 14 + topGut
  const cx = (c: number) => ox + c * (cell + gap)
  const cyf = (r: number) => oy + r * (cell + gap)

  return (
    <Stage title={title} index={index} count={steps.length} caption={step.caption}>
      {hasColLabels && data.colLabels!.map((lab, c) => (
        <div key={'cl' + c} style={{ position: 'absolute', left: cx(c), top: oy - labelGut, width: cell, textAlign: 'center', color: COLORS.faint, fontFamily: FONT_MONO, fontSize: 11 }}>{lab}</div>
      ))}
      {hasRowLabels && data.rowLabels!.map((lab, r) => (
        <div key={'rl' + r} style={{ position: 'absolute', left: ox - leftGut, top: cyf(r), width: leftGut - 4, height: cell, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: COLORS.faint, fontFamily: FONT_MONO, fontSize: 11 }}>{lab}</div>
      ))}
      {Array.from({ length: data.rows * data.cols }).map((_, k) => {
        const r = Math.floor(k / data.cols)
        const c = k % data.cols
        const p = map.get(r + ',' + c)
        const state: CellState = p?.state ?? 'idle'
        const isNew = changedThisStep.has(r + ',' + c)
        const pop = isNew ? 1 + 0.18 * (1 - segment(local, 0.35)) : 1
        return (
          <div key={k} style={{
            position: 'absolute', left: cx(c), top: cyf(r), width: cell, height: cell,
            transform: `scale(${pop})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: CELL_BG[state], color: CELL_FG[state],
            border: `1px solid ${state === 'idle' ? COLORS.line : 'transparent'}`,
            borderRadius: 7, fontFamily: FONT_MONO, fontSize: Math.min(16, cell * 0.42), fontWeight: 700,
          }}>{p?.text ?? ''}</div>
        )
      })}
    </Stage>
  )
}

/* ====================================================================== */
/* graph                                                                  */
/* ====================================================================== */
export function GraphAnim({ data, stepFrames, title }: { data: GraphData; stepFrames: number; title: string }) {
  const { width, height } = useVideoConfig()
  const steps = data.steps
  const { index, local } = useStep(steps.length, stepFrames)
  const step = steps[index] ?? { caption: '' }
  const W = width
  const H = band(height)

  const padX = 56
  const padY = 44
  const px = (x: number) => padX + (Math.min(Math.max(x, 0), 100) / 100) * (W - 2 * padX)
  const py = (y: number) => padY + (Math.min(Math.max(y, 0), 100) / 100) * (H - 2 * padY)
  const R = 20

  const pos = new Map(data.nodes.map((nd) => [nd.id, nd]))

  // Cumulative done-nodes and latest labels.
  const done = new Set<string>()
  const labels = new Map<string, string>()
  for (const nd of data.nodes) if (nd.label != null) labels.set(nd.id, nd.label)
  for (let s = 0; s <= index && s < steps.length; s++) {
    for (const id of steps[s].doneNodes ?? []) done.add(id)
    for (const l of steps[s].labelNodes ?? []) labels.set(l.id, l.label)
  }
  const active = new Set(step.activeNodes ?? [])
  const activeEdge = (a: string, b: string) =>
    (step.activeEdges ?? []).some(([f, t]) => (f === a && t === b) || (f === b && t === a))

  const appear = segment(local, 0.4)

  return (
    <Stage title={title} index={index} count={steps.length} caption={step.caption}>
      <svg width={W} height={H} style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L7,3 L0,6 Z" fill={COLORS.faint} />
          </marker>
        </defs>
        {data.edges.map((e, i) => {
          const a = pos.get(e.from); const b = pos.get(e.to)
          if (!a || !b) return null
          const x1 = px(a.x), y1 = py(a.y), x2 = px(b.x), y2 = py(b.y)
          const dx = x2 - x1, dy = y2 - y1
          const len = Math.max(1, Math.hypot(dx, dy))
          const ux = dx / len, uy = dy / len
          // stop short of node circles so arrowheads sit at the rim
          const sx = x1 + ux * R, sy = y1 + uy * R
          const ex = x2 - ux * (R + (e.directed ? 5 : 0)), ey = y2 - uy * (R + (e.directed ? 5 : 0))
          const on = activeEdge(e.from, e.to)
          return (
            <g key={i}>
              <line x1={sx} y1={sy} x2={ex} y2={ey}
                stroke={on ? COLORS.blue : COLORS.line} strokeWidth={on ? 4 : 2}
                markerEnd={e.directed ? 'url(#arrow)' : undefined} />
              {e.label != null && (
                <text x={(sx + ex) / 2} y={(sy + ey) / 2 - 6} fill={COLORS.faint}
                  fontFamily={FONT_MONO} fontSize={12} textAnchor="middle">{e.label}</text>
              )}
            </g>
          )
        })}
        {data.nodes.map((nd) => {
          const x = px(nd.x), y = py(nd.y)
          const isActive = active.has(nd.id)
          const isDone = done.has(nd.id)
          const fill = isActive ? COLORS.blue : isDone ? COLORS.green : COLORS.panel
          const stroke = isActive ? COLORS.blue : isDone ? COLORS.green : COLORS.line
          const fg = isActive || isDone ? '#0b0f15' : COLORS.text
          const scale = isActive ? 1 + 0.12 * (1 - appear) : 1
          return (
            <g key={nd.id} transform={`translate(${x} ${y}) scale(${scale})`}>
              <circle r={R} fill={fill} stroke={stroke} strokeWidth={2.5} />
              <text textAnchor="middle" dominantBaseline="central" fill={fg}
                fontFamily={FONT_MONO} fontSize={15} fontWeight={700}>{labels.get(nd.id) ?? nd.id}</text>
            </g>
          )
        })}
      </svg>
    </Stage>
  )
}

export const TEMPLATES = {
  arrayScan: ArrayScan,
  barChart: BarChart,
  grid: GridAnim,
  graph: GraphAnim,
} as const
