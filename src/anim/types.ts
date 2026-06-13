// types.ts — the data shapes for DSA animation "scenes". A scene is PURE DATA:
// a list of steps describing what the picture looks like at each beat. Four
// generic templates (arrayScan, barChart, grid, graph) turn that data into a
// smoothly animated Remotion composition, so adding a new animation never means
// writing animation code — only describing the steps.

export type AnimTemplate = 'arrayScan' | 'barChart' | 'grid' | 'graph'

/* ---------------- arrayScan: a 1-D row with moving pointers ---------------- */
// Good for: two-sum, two-pointers, sliding window, binary search — anything that
// is "an array with labelled pointers (i, lo/mid/hi, L/R) and a caption per step".
export interface ArrayMarker {
  index: number          // which cell this pointer sits under
  label: string          // e.g. 'lo', 'mid', 'hi', 'i', 'L', 'R'
  color?: string         // named colour: blue|green|red|amber|violet|cyan|slate
}
export interface ArrayStep {
  caption: string        // the one-line explanation shown for this beat
  markers?: ArrayMarker[]
  highlight?: number[]   // indices to outline (e.g. the current window)
  shade?: number[]       // indices to dim (e.g. the half binary search discarded)
  found?: number[]       // indices to mark solved (green fill)
}
export interface ArrayScanData {
  values: (number | string)[]
  steps: ArrayStep[]
}

/* ---------------- barChart: value-magnitude bars ---------------- */
// Good for: heap-as-an-array sift, sorting, anything where the NUMBER matters and
// you want to watch bars change height / swap.
export interface BarStep {
  caption: string
  values?: number[]      // override the whole array this step (e.g. after a swap)
  highlight?: number[]   // indices to accent
  compare?: number[]     // two indices currently being compared (amber)
  sorted?: number[]      // indices now in final position (green)
}
export interface BarChartData {
  values: number[]
  steps: BarStep[]
}

/* ---------------- grid: a 2-D table of cells ---------------- */
// Good for: DP tables, BFS on a grid, the Sieve, bit columns. State is CUMULATIVE:
// each step lists only the cells that CHANGE, on top of everything before it.
export type CellState = 'idle' | 'active' | 'done' | 'wall' | 'mark' | 'path' | 'value'
export interface CellPatch {
  r: number
  c: number
  text?: string
  state?: CellState
}
export interface GridStep {
  caption: string
  cells?: CellPatch[]    // cells to set/update this step (added to prior state)
}
export interface GridData {
  rows: number
  cols: number
  init?: CellPatch[]     // starting contents before step 0
  rowLabels?: string[]   // optional labels down the left edge
  colLabels?: string[]   // optional labels across the top
  steps: GridStep[]
}

/* ---------------- graph: nodes + edges ---------------- */
// Good for: tree traversal, BFS/DFS, tries, heaps-as-trees, linked lists,
// backtracking decision trees. Coordinates are in a 0..100 box (auto-scaled).
export interface GraphNode {
  id: string
  x: number              // 0..100, left to right
  y: number              // 0..100, top to bottom
  label?: string
}
export interface GraphEdge {
  from: string
  to: string
  directed?: boolean
  label?: string
}
export interface GraphStep {
  caption: string
  activeNodes?: string[]              // currently being visited (blue glow)
  doneNodes?: string[]               // finished (green)
  activeEdges?: [string, string][]   // edges to highlight, as [from, to]
  labelNodes?: { id: string; label: string }[] // update a node's label (e.g. a distance)
}
export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
  steps: GraphStep[]
}

/* ---------------- a registered scene ---------------- */
export type SceneData = ArrayScanData | BarChartData | GridData | GraphData

export interface Scene {
  id: string             // referenced from a note section's `anim` field
  title: string          // shown under the player
  template: AnimTemplate
  data: SceneData
  fps?: number           // default 30
  width?: number         // composition width,  default 720
  height?: number        // composition height, default 430
  stepFrames?: number    // frames per step, default 42 (~1.4s at 30fps)
}

// Helper so scene files get a typed, autocompleted object literal.
export const defineScene = (s: Scene): Scene => s
