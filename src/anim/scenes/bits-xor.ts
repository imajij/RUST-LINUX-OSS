// XOR two numbers one bit-column at a time: 12 ^ 10 = 6. We lay a's bits in the
// top row, b's bits in the middle row, then fill the result row column by column,
// writing 1 where the two input bits DIFFER and 0 where they match. Template: grid
// (state is cumulative — each step only lists the cells that change this beat).
import { defineScene } from '../types'
import type { CellPatch, GridStep } from '../types'

// bit7..bit0 for each number; column c holds bit (7 - c).
const A = 12 // 0 0 0 0 1 1 0 0
const B = 10 // 0 0 0 0 1 0 1 0
const COLS = 8
const bit = (n: number, col: number) => (n >> (7 - col)) & 1 // col 0 = bit7

// Rows: 0 = a's bits, 1 = b's bits, 2 = a^b. Seed the two input rows.
const init: CellPatch[] = []
for (let c = 0; c < COLS; c++) {
  init.push({ r: 0, c, text: String(bit(A, c)), state: 'value' })
  init.push({ r: 1, c, text: String(bit(B, c)), state: 'value' })
}

// One beat that XORs a range of columns [from, to] inclusive: light up the two
// input bits being compared (active) and stamp the result bit (mark) in row 2.
const xorRange = (from: number, to: number, caption: string): GridStep => {
  const cells: CellPatch[] = []
  for (let c = from; c <= to; c++) {
    const ab = bit(A, c)
    const bb = bit(B, c)
    const res = ab ^ bb // 1 if the bits differ, else 0
    cells.push({ r: 0, c, text: String(ab), state: 'active' })
    cells.push({ r: 1, c, text: String(bb), state: 'active' })
    cells.push({ r: 2, c, text: String(res), state: 'mark' })
  }
  return { caption, cells }
}

const steps: GridStep[] = [
  xorRange(0, 3,
    'Start with bits 7..4. Both a and b are 0 there, so each column matches and a^b stays 0 — XOR is 1 only when the bits DIFFER.'),
  xorRange(4, 4,
    'Bit 3: a has 1 and b has 1. They are the SAME, so the result bit is 0.'),
  xorRange(5, 5,
    'Bit 2: a has 1 but b has 0. They DIFFER, so the result bit is 1.'),
  xorRange(6, 6,
    'Bit 1: a has 0 but b has 1. They DIFFER, so the result bit is 1.'),
  xorRange(7, 7,
    'Bit 0: both a and b are 0 — the same — so the result bit is 0.'),
  {
    caption:
      'Reading row a^b gives 0000_0110 = 6, confirming 12 ^ 10 = 6. One linear pass over the bits, O(width). XOR finds the one unpaired item in a list and toggles bits like a light switch.',
    cells: [],
  },
]

export default defineScene({
  id: 'bits-xor',
  title: 'XOR bit by bit — 12 ^ 10 = 6',
  template: 'grid',
  stepFrames: 54,
  data: {
    rows: 3,
    cols: COLS,
    rowLabels: ['a=12', 'b=10', 'a^b'],
    colLabels: ['7', '6', '5', '4', '3', '2', '1', '0'],
    init,
    steps,
  },
})
