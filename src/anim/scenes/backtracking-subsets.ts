// All subsets of {1, 2} drawn as an include/exclude decision tree. Each element
// is one yes/no decision (skip it = go left, take it = go right); the four leaves
// are the four subsets. We do a depth-first walk: choose, explore, then un-choose
// and try the sibling. Template: graph (a 7-node tree). The active (blue) node
// walks down a branch; finished leaves stay green (doneNodes is cumulative).
import { defineScene } from '../types'

export default defineScene({
  id: 'backtracking-subsets',
  title: 'Subsets of {1,2} — the choose / explore / un-choose decision tree',
  template: 'graph',
  stepFrames: 56,
  data: {
    nodes: [
      { id: 'root', x: 50, y: 12, label: '{ }' },
      // Level 1: decide element 1 — skip (left) vs take (right).
      { id: 'ex1', x: 28, y: 48, label: '{ }' },
      { id: 'in1', x: 72, y: 48, label: '{1}' },
      // Level 2: decide element 2 under each branch.
      { id: 'ex1ex2', x: 14, y: 84, label: '{ }' },
      { id: 'ex1in2', x: 38, y: 84, label: '{2}' },
      { id: 'in1ex2', x: 62, y: 84, label: '{1}' },
      { id: 'in1in2', x: 86, y: 84, label: '{1,2}' },
    ],
    edges: [
      { from: 'root', to: 'ex1', directed: true, label: 'skip' },
      { from: 'root', to: 'in1', directed: true, label: 'take' },
      { from: 'ex1', to: 'ex1ex2', directed: true, label: 'skip' },
      { from: 'ex1', to: 'ex1in2', directed: true, label: 'take' },
      { from: 'in1', to: 'in1ex2', directed: true, label: 'skip' },
      { from: 'in1', to: 'in1in2', directed: true, label: 'take' },
    ],
    steps: [
      {
        caption:
          'We want every subset of {1,2}. Treat each element as one yes/no choice — like deciding, topping by topping, what goes on a pizza. Start at the root with nothing chosen yet.',
        activeNodes: ['root'],
      },
      {
        caption:
          'CHOOSE: skip element 1. We walk down the left edge to a node where 1 is left out, so the set so far is still { }.',
        activeNodes: ['ex1'],
        activeEdges: [['root', 'ex1']],
      },
      {
        caption:
          'EXPLORE deeper, then skip element 2 too. This leaf is the empty subset { } — our first complete answer, so we mark it done (green).',
        activeNodes: ['ex1ex2'],
        activeEdges: [['ex1', 'ex1ex2']],
        doneNodes: ['ex1ex2'],
      },
      {
        caption:
          'UN-CHOOSE element 2 and back up to try the sibling: take element 2 instead. That leaf is the subset {2} — answer number two.',
        activeNodes: ['ex1in2'],
        activeEdges: [['ex1', 'ex1in2']],
        doneNodes: ['ex1in2'],
      },
      {
        caption:
          'Un-choose all the way back to the root, then CHOOSE the other branch: take element 1. The running set is now {1}.',
        activeNodes: ['in1'],
        activeEdges: [['root', 'in1']],
      },
      {
        caption:
          'EXPLORE this branch and skip element 2. The leaf {1} is answer number three.',
        activeNodes: ['in1ex2'],
        activeEdges: [['in1', 'in1ex2']],
        doneNodes: ['in1ex2'],
      },
      {
        caption:
          'Finally, take element 2 as well: the leaf {1,2}. Every leaf is now green — all 4 subsets found. With n choices that is 2^n subsets, so this is exponential by nature.',
        activeNodes: ['in1in2'],
        activeEdges: [['in1', 'in1in2']],
        doneNodes: ['in1in2'],
      },
    ],
  },
})
