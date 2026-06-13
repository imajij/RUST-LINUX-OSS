// Inserting two words that share a prefix into a trie: first "car" carves the
// path root->c->a->r, then "cat" REUSES the existing c and a (the shared prefix
// "ca" is never duplicated) and only adds a fresh t. Template: graph.
import { defineScene } from '../types'

export default defineScene({
  id: 'trie-insert',
  title: 'Trie insert — "car" then "cat" share the prefix "ca"',
  template: 'graph',
  stepFrames: 54,
  data: {
    nodes: [
      { id: 'root', x: 50, y: 10, label: '*' },
      { id: 'c', x: 50, y: 34 },
      { id: 'a', x: 50, y: 58 },
      { id: 'r', x: 32, y: 84 },
      { id: 't', x: 68, y: 84 },
    ],
    edges: [
      { from: 'root', to: 'c', directed: true, label: 'c' },
      { from: 'c', to: 'a', directed: true, label: 'a' },
      { from: 'a', to: 'r', directed: true, label: 'r' },
      { from: 'a', to: 't', directed: true, label: 't' },
    ],
    steps: [
      {
        caption: 'Insert "car". From the root there is no child for c yet, so we create node c and step into it.',
        activeNodes: ['root', 'c'],
        activeEdges: [['root', 'c']],
      },
      {
        caption: 'Next letter a: node c has no child a, so we create node a and step down. The path now spells "ca".',
        activeNodes: ['a'],
        activeEdges: [['c', 'a']],
      },
      {
        caption: 'Last letter r: create node r. "car" is now a full word, so we flag this node as end-of-word (green).',
        activeNodes: ['r'],
        doneNodes: ['r'],
        activeEdges: [['a', 'r']],
      },
      {
        caption: 'Now insert "cat". Walking c then a, both children already EXIST — we reuse them. The shared prefix "ca" is stored only once, never duplicated.',
        activeNodes: ['c', 'a'],
        activeEdges: [['root', 'c'], ['c', 'a']],
      },
      {
        caption: 'Only the last letter t is new: we add node t and flag it end-of-word. Two words, but "ca" cost nothing the second time. Insert and lookup are O(L) in the word length — exactly what autocomplete needs when typing "ca" narrows to both "car" and "cat".',
        activeNodes: ['t'],
        doneNodes: ['t'],
        activeEdges: [['a', 't']],
      },
    ],
  },
})
