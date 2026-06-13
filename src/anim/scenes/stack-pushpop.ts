// A stack (LIFO) drawn as a single column that grows DOWNWARD: the first push
// lands in row 0, the next in row 1, and so on, so the TOP of the stack is the
// lowest-numbered filled row. We run push A, push B, push C, pop, pop, push D
// and watch the LIFO rule: the last thing pushed is the first thing popped.
// Template: grid (state is cumulative, so each step lists only the cell that
// changes). Like a stack of plates, the browser Back button, or undo.
import { defineScene } from '../types'

export default defineScene({
  id: 'stack-pushpop',
  title: 'A stack (LIFO): push and pop on Vec',
  template: 'grid',
  stepFrames: 52,
  data: {
    rows: 6,
    cols: 1,
    rowLabels: ['top→', '', '', '', '', 'bottom'],
    steps: [
      {
        caption:
          'push("A"): the stack was empty, so A lands in the first slot (row 0). A is now the top.',
        cells: [{ r: 0, c: 0, text: 'A', state: 'active' }],
      },
      {
        caption:
          'push("B"): a push always adds on top, so B sits just below A and becomes the new top.',
        cells: [{ r: 1, c: 0, text: 'B', state: 'active' }],
      },
      {
        caption:
          'push("C"): C goes on top of B. The stack now holds A, B, C with C as the top.',
        cells: [{ r: 2, c: 0, text: 'C', state: 'active' }],
      },
      {
        caption:
          'pop(): a pop removes the TOP, which is C — the most recently pushed item. C leaves first (LIFO).',
        cells: [{ r: 2, c: 0, text: '', state: 'idle' }],
      },
      {
        caption:
          'pop() again: the top is now B, so B comes off next. Just like undo, the most recent thing comes off first.',
        cells: [{ r: 1, c: 0, text: '', state: 'idle' }],
      },
      {
        caption:
          'push("D"): the next free slot is the one B just vacated, so D pushes there and becomes the new top. push and pop are both O(1).',
        cells: [{ r: 1, c: 0, text: 'D', state: 'active' }],
      },
    ],
  },
})
