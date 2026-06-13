// Breadth-first / level-order traversal of a 7-node binary tree. The queue (a
// VecDeque) hands nodes out front-to-back, so the tree is swept level by level:
// the visit order is 1, 2, 3, 4, 5, 6, 7. Template: graph. Each step lights the
// node being visited (blue) while everything already finished stays green.
import { defineScene } from '../types'

export default defineScene({
  id: 'tree-bfs',
  title: 'Level-order (BFS) traversal of a binary tree',
  template: 'graph',
  stepFrames: 52,
  data: {
    nodes: [
      { id: '1', x: 50, y: 14, label: '1' }, // root,    level 0
      { id: '2', x: 30, y: 48, label: '2' }, //          level 1
      { id: '3', x: 70, y: 48, label: '3' },
      { id: '4', x: 16, y: 84, label: '4' }, //          level 2
      { id: '5', x: 40, y: 84, label: '5' },
      { id: '6', x: 60, y: 84, label: '6' },
      { id: '7', x: 84, y: 84, label: '7' },
    ],
    edges: [
      { from: '1', to: '2', directed: true },
      { from: '1', to: '3', directed: true },
      { from: '2', to: '4', directed: true },
      { from: '2', to: '5', directed: true },
      { from: '3', to: '6', directed: true },
      { from: '3', to: '7', directed: true },
    ],
    steps: [
      {
        caption:
          'BFS starts at the root. Seed a queue with node 1, then repeatedly pop the front and push its children to the back.',
        activeNodes: ['1'],
      },
      {
        caption:
          'Visit 1 (level 0). Push its children 2 and 3 to the back of the queue. Queue is now [2, 3].',
        activeNodes: ['1'],
        activeEdges: [['1', '2'], ['1', '3']],
      },
      {
        caption:
          'Pop the front, node 2, and visit it. Push its children 4 and 5. Queue is now [3, 4, 5].',
        activeNodes: ['2'],
        doneNodes: ['1'],
        activeEdges: [['2', '4'], ['2', '5']],
      },
      {
        caption:
          'Pop node 3 and visit it. Push children 6 and 7. With 2 and 3 done, all of level 1 is finished. Queue is [4, 5, 6, 7].',
        activeNodes: ['3'],
        doneNodes: ['2'],
        activeEdges: [['3', '6'], ['3', '7']],
      },
      {
        caption:
          'Now the queue holds the whole bottom level. Pop 4 and visit it; it is a leaf, so nothing new is pushed.',
        activeNodes: ['4'],
        doneNodes: ['3'],
      },
      {
        caption:
          'Pop 5, then 6, and visit each leaf in turn. The queue drains left to right across the level.',
        activeNodes: ['5', '6'],
        doneNodes: ['4'],
      },
      {
        caption:
          'Pop the last node, 7, and visit it. The queue is now empty, so BFS stops. Visit order: 1, 2, 3, 4, 5, 6, 7.',
        activeNodes: ['7'],
        doneNodes: ['5', '6'],
      },
      {
        caption:
          'Done. Like exploring a family tree generation by generation, BFS finished every level before the next. It touches each node once: O(n) time. (DFS instead would dive 1, 2, 4, 5, 3, 6, 7.)',
        doneNodes: ['7'],
      },
    ],
  },
})
