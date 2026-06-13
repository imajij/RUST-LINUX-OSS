// Climbing stairs as a 1-D DP table: dp[i] = number of ways to reach step i,
// taking 1 or 2 steps at a time. dp[0]=1, dp[1]=1, dp[i]=dp[i-1]+dp[i-2].
// We fill a single row left to right. Template: grid (state is CUMULATIVE —
// each step lists only the cells that change). The two source cells light up
// `active` (blue) the step before the new value drops in as `done` (green),
// then the next step settles them back to `done`. We generate the patches in a
// loop so the arithmetic stays exactly right.
import { defineScene } from '../types'
import type { CellPatch, GridStep } from '../types'

const N = 8 // columns 0..7
const dp = [1, 1]
for (let i = 2; i < N; i++) dp[i] = dp[i - 1] + dp[i - 2]
// dp = [1, 1, 2, 3, 5, 8, 13, 21]

const cell = (c: number, state: CellPatch['state'], text?: string): CellPatch => ({
  r: 0,
  c,
  state,
  text: text ?? String(dp[c]),
})

const steps: GridStep[] = []

// Base cases: dp[0] and dp[1] are both 1 (one way to "be" at the start, one way
// to reach step 1). They are written directly, not computed.
steps.push({
  caption:
    'Real problem: counting the ways to climb a staircase taking 1 or 2 steps at a time. dp[i] = ways to reach step i. Base cases: dp[0]=1 and dp[1]=1, written in directly.',
  cells: [cell(0, 'done'), cell(1, 'done')],
})

// Fill left to right. Each step lights the two sources blue and drops the sum in.
// State is cumulative, so we first settle the PREVIOUS step's two blue sources
// (cells i-2 and i-3) back to green, leaving only this step's two sources blue.
for (let i = 2; i < N; i++) {
  const patches: CellPatch[] = []
  if (i - 3 >= 0) patches.push(cell(i - 3, 'done')) // was a source last step
  patches.push(cell(i - 2, 'active')) // dp[i-2]: came here with a double step
  patches.push(cell(i - 1, 'active')) // dp[i-1]: came here with a single step
  patches.push(cell(i, 'done')) // dp[i] = dp[i-1] + dp[i-2], now solved
  steps.push({
    caption: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}. The last move was either a single step (from step ${i - 1}) or a double step (from step ${i - 2}), so we ADD the two source cells (highlighted).`,
    cells: patches,
  })
}

// Final beat: everything settled, state back to done, point at the answer.
steps.push({
  caption:
    'Done: there are 21 ways to climb a staircase of 7 steps. Each cell was computed once by reusing the two before it — DP turns the exponential recursion of naive recursion into O(n) time and O(1) space.',
  cells: dp.map((_, c) => cell(c, 'done')),
})

export default defineScene({
  id: 'dp-table',
  title: 'Climbing stairs — fill a 1-D DP table (dp[i] = dp[i-1] + dp[i-2])',
  template: 'grid',
  stepFrames: 54,
  data: {
    rows: 1,
    cols: N,
    colLabels: Array.from({ length: N }, (_, c) => String(c)),
    steps,
  },
})
