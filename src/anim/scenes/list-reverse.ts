// Reversing a singly linked list A -> B -> C -> D into D -> C -> B -> A with the
// iterative prev/curr/next dance: walk once, flip each node's next pointer to aim
// at the node behind it. Template: graph. Four nodes sit in a single row; the
// directed edges shown are the FINAL reversed links, and each step lights up the
// one pointer being rewired (activeEdges) while labelNodes name prev and curr.
import { defineScene } from '../types'

// Four nodes in a row at y = 48, evenly spaced left to right.
const nodes = [
  { id: 'A', x: 18, y: 48, label: 'A' },
  { id: 'B', x: 40, y: 48, label: 'B' },
  { id: 'C', x: 62, y: 48, label: 'C' },
  { id: 'D', x: 84, y: 48, label: 'D' },
]

// The edges we draw are the END state: D -> C -> B -> A. Each step highlights the
// arrow that the dance has just rewired, so by the last step every arrow is on.
const edges = [
  { from: 'D', to: 'C', directed: true },
  { from: 'C', to: 'B', directed: true },
  { from: 'B', to: 'A', directed: true },
]

export default defineScene({
  id: 'list-reverse',
  title: 'Reverse a linked list — the prev / curr / next dance',
  template: 'graph',
  stepFrames: 54,
  data: {
    nodes,
    edges,
    steps: [
      {
        caption:
          'Start: the list runs A -> B -> C -> D. prev = None, curr = A. We will walk once, flipping each arrow to point backward — like reversing the coupling between train cars one at a time.',
        activeNodes: ['A'],
        labelNodes: [
          { id: 'A', label: 'curr' },
        ],
      },
      {
        caption:
          'Iteration 1: save next = B, then flip A.next from B to prev (None). A is now the new tail. Slide the pointers: prev = A, curr = B.',
        activeNodes: ['B'],
        doneNodes: ['A'],
        labelNodes: [
          { id: 'A', label: 'prev' },
          { id: 'B', label: 'curr' },
        ],
      },
      {
        caption:
          'Iteration 2: save next = C, then flip B.next to point at prev = A. That rewires the B -> A arrow. Slide up: prev = B, curr = C.',
        activeNodes: ['C'],
        doneNodes: ['B'],
        activeEdges: [['B', 'A']],
        labelNodes: [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'prev' },
          { id: 'C', label: 'curr' },
        ],
      },
      {
        caption:
          'Iteration 3: save next = D, then flip C.next to point at prev = B, rewiring C -> B. Slide up: prev = C, curr = D.',
        activeNodes: ['D'],
        doneNodes: ['C'],
        activeEdges: [['C', 'B']],
        labelNodes: [
          { id: 'B', label: 'B' },
          { id: 'C', label: 'prev' },
          { id: 'D', label: 'curr' },
        ],
      },
      {
        caption:
          'Iteration 4: save next = None, then flip D.next to point at prev = C, rewiring D -> C. Slide up: prev = D, curr = None. The walk is over.',
        doneNodes: ['D'],
        activeEdges: [['D', 'C']],
        labelNodes: [
          { id: 'C', label: 'C' },
          { id: 'D', label: 'prev' },
        ],
      },
      {
        caption:
          'curr fell off the end, so prev = D is the new head: the list now reads D -> C -> B -> A. Every coupling was reversed in a single pass — O(n) time, O(1) extra space, holding just three pointers.',
        doneNodes: ['A', 'B', 'C', 'D'],
        activeEdges: [['D', 'C'], ['C', 'B'], ['B', 'A']],
        labelNodes: [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
          { id: 'C', label: 'C' },
          { id: 'D', label: 'D' },
        ],
      },
    ],
  },
})
