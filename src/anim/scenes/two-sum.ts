// Two Sum with a hash set on [2, 7, 11, 15], target 9. We walk a single pointer i
// across the array, and at each step ask "have I already seen the number that
// completes the pair?" — an O(1) lookup, like a cashier checking a list of names.
// Template: arrayScan.
import { defineScene } from '../types'

const A = [2, 7, 11, 15]

export default defineScene({
  id: 'two-sum',
  title: 'Two Sum — find indices summing to 9 in one pass',
  template: 'arrayScan',
  stepFrames: 50,
  data: {
    values: A,
    steps: [
      {
        caption:
          'Goal: find two indices whose values add to 9. We make ONE left-to-right pass with pointer i, remembering every number seen so far.',
        markers: [{ index: 0, label: 'i', color: 'cyan' }],
        highlight: [0],
      },
      {
        caption:
          'i = 0: value is 2, so the number we need is 9 − 2 = 7. Have we seen 7 yet? No. Remember 2 (seen at index 0) and move on.',
        markers: [{ index: 0, label: 'i', color: 'cyan' }],
        highlight: [0],
      },
      {
        caption:
          'i = 1: value is 7, so the number we need is 9 − 7 = 2. Have we seen 2 before? Yes — at index 0! Like a cashier instantly checking a list, the lookup is O(1).',
        markers: [{ index: 1, label: 'i', color: 'cyan' }],
        highlight: [1],
        shade: [0],
      },
      {
        caption:
          'Match! 2 + 7 = 9, so the answer is indices [0, 1]. Both cells turn green.',
        markers: [{ index: 1, label: 'i', color: 'cyan' }],
        found: [0, 1],
        shade: [2, 3],
      },
      {
        caption:
          'Each number was visited once and each lookup was constant time, so this is ONE pass — O(n) — versus the O(n²) brute-force nested loop that re-checks every pair.',
        found: [0, 1],
        shade: [2, 3],
      },
    ],
  },
})
