// Merge overlapping intervals: sort by start, then sweep left to right keeping one
// "current" merged block. Overlap (next start <= current end) extends it; a gap
// closes it off and starts a new one. Template: arrayScan.
import { defineScene } from '../types'

// Already sorted by start time. Marker i sweeps over these cells.
const A = ['[1,3]', '[2,6]', '[8,10]', '[15,18]']

export default defineScene({
  id: 'merge-intervals',
  title: 'Merge intervals — collapse overlapping calendar meetings',
  template: 'arrayScan',
  stepFrames: 52,
  data: {
    values: A,
    steps: [
      {
        caption:
          'Goal: combine overlapping calendar meetings into single busy blocks. Sort by start, then sweep. Current merged block = [1,3].',
        markers: [{ index: 0, label: 'i', color: 'cyan' }],
        highlight: [0],
      },
      {
        caption:
          'i moves to [2,6]. Two intervals overlap when the next start <= current end: 2 <= 3, so they overlap. Extend to [1, max(3,6)] = [1,6].',
        markers: [{ index: 1, label: 'i', color: 'cyan' }],
        highlight: [0, 1],
      },
      {
        caption:
          'i moves to [8,10]. Now 8 > 6, so it does NOT overlap the current block. Lock [1,6] as a finished merged interval and start a new block [8,10].',
        markers: [{ index: 2, label: 'i', color: 'cyan' }],
        found: [0, 1],
        highlight: [2],
      },
      {
        caption:
          'i moves to [15,18]. 15 > 10 is another gap, so lock [8,10] as finished and start a new block [15,18].',
        markers: [{ index: 3, label: 'i', color: 'cyan' }],
        found: [0, 1, 2],
        highlight: [3],
      },
      {
        caption:
          'End of the list, so lock the last block [15,18]. Merged result: [1,6], [8,10], [15,18]. Cost is the O(n log n) sort plus one linear sweep.',
        markers: [{ index: 3, label: 'i', color: 'cyan' }],
        found: [0, 1, 2, 3],
      },
    ],
  },
})
