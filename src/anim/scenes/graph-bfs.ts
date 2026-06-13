// BFS shortest-path distances on an unweighted 4x4 grid (a grid is a graph in
// disguise) from the top-left corner (0,0), no walls. Because BFS explores in
// rings of equal distance, the distance of every cell is exactly its BFS layer
// number r+c. We animate the search layer by layer (k = 0..6): each step marks
// every cell at distance k as DONE and writes k into it. Template: grid. The
// per-layer cell patches are generated with a small loop so the math stays
// correct (the file is a normal TS module — pure data, just computed).
import { defineScene } from '../types'
import type { CellPatch, GridStep } from '../types'

const N = 4 // 4x4 grid
const MAX_DIST = (N - 1) + (N - 1) // farthest corner (3,3): r+c = 6

// Group every cell by its BFS layer  k = r + c  (its shortest distance from 0,0).
const layers: CellPatch[][] = Array.from({ length: MAX_DIST + 1 }, () => [])
for (let r = 0; r < N; r++) {
  for (let c = 0; c < N; c++) {
    const k = r + c
    layers[k].push({ r, c, text: String(k), state: 'done' })
  }
}

const ringList = (k: number) =>
  layers[k].map((p) => `(${p.r},${p.c})`).join(', ')

const steps: GridStep[] = []
for (let k = 0; k <= MAX_DIST; k++) {
  let caption: string
  if (k === 0) {
    caption =
      'Layer 0: the source cell (0,0) is at distance 0 — like the point where a stone drops into a pond.'
  } else if (k === MAX_DIST) {
    caption =
      `Layer ${k}: the last ripple reaches the far corner (3,3) at distance ${k}. Every cell now holds its shortest #steps; BFS runs in O(V+E).`
  } else {
    caption =
      `Layer ${k}: every cell with r+c=${k} ${ringList(k)} is reached next, all at distance ${k} — one even ring further out.`
  }
  steps.push({ caption, cells: layers[k] })
}

// Add an explainer step at the very front (no cells change) that states WHY.
steps.unshift({
  caption:
    'BFS explores in rings of equal distance, like ripples expanding evenly from where a stone drops — that is why it finds the SHORTEST path in an unweighted graph.',
  cells: [],
})

export default defineScene({
  id: 'graph-bfs',
  title: 'BFS shortest paths on a grid — distance = its ring (layer)',
  template: 'grid',
  stepFrames: 50,
  data: {
    rows: N,
    cols: N,
    rowLabels: ['r0', 'r1', 'r2', 'r3'],
    colLabels: ['c0', 'c1', 'c2', 'c3'],
    steps,
  },
})
