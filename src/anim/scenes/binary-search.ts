// Binary search for 9 in a sorted array, watching lo / mid / hi close in and the
// discarded half fade out. Template: arrayScan.
import { defineScene } from '../types'

const A = [1, 3, 5, 7, 9, 11, 13, 15]

export default defineScene({
  id: 'binary-search',
  title: 'Binary search — find 9 in a sorted array',
  template: 'arrayScan',
  stepFrames: 48,
  data: {
    values: A,
    steps: [
      {
        caption: 'Goal: find 9 in this sorted array. lo starts at 0, hi at the last index.',
        markers: [
          { index: 0, label: 'lo', color: 'cyan' },
          { index: 7, label: 'hi', color: 'violet' },
        ],
      },
      {
        caption: 'mid = (0+7)/2 = 3. arr[3] = 7, and 7 < 9, so the answer is to the RIGHT. Drop the left half.',
        markers: [
          { index: 0, label: 'lo', color: 'cyan' },
          { index: 7, label: 'hi', color: 'violet' },
          { index: 3, label: 'mid', color: 'amber' },
        ],
        highlight: [3],
      },
      {
        caption: 'lo jumps to 4. mid = (4+7)/2 = 5. arr[5] = 11, and 11 > 9, so the answer is to the LEFT. Drop the right half.',
        markers: [
          { index: 4, label: 'lo', color: 'cyan' },
          { index: 7, label: 'hi', color: 'violet' },
          { index: 5, label: 'mid', color: 'amber' },
        ],
        highlight: [5],
        shade: [0, 1, 2, 3],
      },
      {
        caption: 'hi jumps to 4. mid = (4+4)/2 = 4. arr[4] = 9 — a match!',
        markers: [
          { index: 4, label: 'lo', color: 'cyan' },
          { index: 4, label: 'hi', color: 'violet' },
          { index: 4, label: 'mid', color: 'amber' },
        ],
        found: [4],
        shade: [0, 1, 2, 3, 5, 6, 7],
      },
      {
        caption: 'Found 9 at index 4 in just 3 comparisons. Each step halves the search — that is O(log n).',
        markers: [{ index: 4, label: 'mid', color: 'amber' }],
        found: [4],
        shade: [0, 1, 2, 3, 5, 6, 7],
      },
    ],
  },
})
