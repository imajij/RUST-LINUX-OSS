// Popping the max from a max-heap stored as an array, then sift-down to restore
// order. Start [50,30,40,10,20,35] (index 0 is the root = biggest). We move the
// last leaf into the root, shrink, then sink it past its larger child.
// Template: barChart (the magnitudes are the priorities, so watching bar heights
// swap is exactly the story). Children of i are 2i+1 and 2i+2.
import { defineScene } from '../types'

export default defineScene({
  id: 'heap-siftdown',
  title: 'Heap pop + sift-down — extract the max',
  template: 'barChart',
  stepFrames: 56,
  data: {
    values: [50, 30, 40, 10, 20, 35],
    steps: [
      {
        caption:
          'A max-heap as an array: the biggest value sits at the root, index 0. Like an OS scheduler or ER triage, we always serve this highest-priority item next.',
        highlight: [0],
      },
      {
        caption:
          'Pop the max 50. We cannot leave a hole at the root, so we take the last leaf 35, move it into index 0, and shrink the array.',
        values: [35, 30, 40, 10, 20],
        highlight: [0],
      },
      {
        caption:
          'Now sift-down: compare the root’s two children at indices 1 and 2 (2·0+1 and 2·0+2). They hold 30 and 40, so the largest child is 40.',
        values: [35, 30, 40, 10, 20],
        compare: [1, 2],
        highlight: [0],
      },
      {
        caption:
          '35 < 40, so swap the root with its larger child. 40 rises to the top and 35 sinks down to index 2.',
        values: [40, 30, 35, 10, 20],
        highlight: [2],
        sorted: [0],
      },
      {
        caption:
          '35 is now at index 2; its children would be 5 and 6 (2·2+1, 2·2+2), both past the end, so it is a leaf. The heap property is restored. Pop is O(log n).',
        values: [40, 30, 35, 10, 20],
        sorted: [0, 2],
      },
    ],
  },
})
