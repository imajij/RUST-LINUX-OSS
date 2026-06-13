// Opposite-ends two pointers on a SORTED array to find a pair summing to a
// target. Values [1,3,4,6,8,11], target 10. L (cyan) starts at the front, R
// (violet) at the back; compare arr[L]+arr[R] to the target and walk inward.
// Template: arrayScan.
import { defineScene } from '../types'

const A = [1, 3, 4, 6, 8, 11] // sorted; target = 10

export default defineScene({
  id: 'two-pointers',
  title: 'Two pointers — find a pair summing to 10 in a sorted array',
  template: 'arrayScan',
  stepFrames: 50,
  data: {
    values: A,
    steps: [
      {
        caption:
          'Goal: find two values that add to 10. Like two people walking toward each other from both ends of a sorted shelf, L starts at the front, R at the back.',
        markers: [
          { index: 0, label: 'L', color: 'cyan' },
          { index: 5, label: 'R', color: 'violet' },
        ],
        highlight: [0, 5],
      },
      {
        caption:
          'arr[L]+arr[R] = 1 + 11 = 12, which is GREATER than 10. The sum is too big, so move R left to shrink it.',
        markers: [
          { index: 0, label: 'L', color: 'cyan' },
          { index: 5, label: 'R', color: 'violet' },
        ],
        highlight: [0, 5],
      },
      {
        caption:
          '1 + 8 = 9, which is LESS than 10. The sum is too small, so move L right to grow it. (The dropped cell 11 is shaded out.)',
        markers: [
          { index: 0, label: 'L', color: 'cyan' },
          { index: 4, label: 'R', color: 'violet' },
        ],
        highlight: [0, 4],
        shade: [5],
      },
      {
        caption:
          '3 + 8 = 11, which is GREATER than 10. Too big again, so move R left once more.',
        markers: [
          { index: 1, label: 'L', color: 'cyan' },
          { index: 4, label: 'R', color: 'violet' },
        ],
        highlight: [1, 4],
        shade: [5],
      },
      {
        caption:
          '3 + 6 = 9, which is LESS than 10. Too small, so move L right. (The cell 8 is now shaded out too.)',
        markers: [
          { index: 1, label: 'L', color: 'cyan' },
          { index: 3, label: 'R', color: 'violet' },
        ],
        highlight: [1, 3],
        shade: [4, 5],
      },
      {
        caption:
          '4 + 6 = 10 — a match! The pointers met the target at indices [2, 3]. Each step moved one pointer inward, so the whole walk is O(n) time and O(1) space — no hash set needed because the array is sorted.',
        markers: [
          { index: 2, label: 'L', color: 'cyan' },
          { index: 3, label: 'R', color: 'violet' },
        ],
        found: [2, 3],
        shade: [0, 1, 4, 5],
      },
    ],
  },
})
