// Sieve of Eratosthenes over 2..31: mark a prime, then cross out its multiples,
// repeat. Template: grid. We compute the cell patches with a little code so the
// math stays correct (the file is a normal module — pure data, just generated).
import { defineScene } from '../types'
import type { CellPatch, GridStep } from '../types'

const START = 2
const END = 31
const COLS = 6
const cellOf = (num: number) => {
  const i = num - START
  return { r: Math.floor(i / COLS), c: i % COLS }
}

// initial grid: every number shown as a plain value cell
const init: CellPatch[] = []
for (let n = START; n <= END; n++) {
  const { r, c } = cellOf(n)
  init.push({ r, c, text: String(n), state: 'value' })
}

const crossed = new Set<number>()
const steps: GridStep[] = []

const markPrime = (p: number, caption: string) => {
  const { r, c } = cellOf(p)
  steps.push({ caption, cells: [{ r, c, text: String(p), state: 'mark' }] })
}
const crossMultiples = (p: number, caption: string) => {
  const cells: CellPatch[] = []
  for (let m = p * 2; m <= END; m += p) {
    if (crossed.has(m)) continue
    crossed.add(m)
    const { r, c } = cellOf(m)
    cells.push({ r, c, text: String(m), state: 'wall' })
  }
  steps.push({ caption, cells })
}

markPrime(2, 'Start at 2 — the first prime. Keep it.')
crossMultiples(2, 'Cross out every multiple of 2 (4, 6, 8, …). None of them can be prime.')
markPrime(3, 'The next number still standing is 3 — prime.')
crossMultiples(3, 'Cross multiples of 3. 6, 12, … were already gone; only 9, 15, 21, 27 are new.')
markPrime(5, 'Next standing is 5 — prime.')
crossMultiples(5, 'Cross multiples of 5. Only 25 is new (10, 15, 20, 30 already crossed).')
// 5*5 = 25 <= 31 but the next prime 7 has 7*7 = 49 > 31, so everything left is prime.
const survivors: CellPatch[] = []
for (let n = START; n <= END; n++) {
  if (!crossed.has(n) && ![2, 3, 5].includes(n)) {
    const { r, c } = cellOf(n)
    survivors.push({ r, c, text: String(n), state: 'mark' })
  }
}
steps.push({
  caption: '7 × 7 = 49 is past 31, so every number still standing is prime. Done!',
  cells: survivors,
})

export default defineScene({
  id: 'sieve',
  title: 'Sieve of Eratosthenes — primes up to 31',
  template: 'grid',
  stepFrames: 54,
  data: { rows: Math.ceil((END - START + 1) / COLS), cols: COLS, init, steps },
})
