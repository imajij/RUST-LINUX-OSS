// Longest substring without repeating characters, via a variable-size sliding
// window over "abcabb". L and R bound the window; highlight = the live window.
// Expand R; when the incoming char already sits inside the window, shrink from L
// until it is valid again. Template: arrayScan.
import { defineScene } from '../types'

const S = ['a', 'b', 'c', 'a', 'b', 'b']

export default defineScene({
  id: 'sliding-window',
  title: 'Longest substring without repeating characters',
  template: 'arrayScan',
  stepFrames: 52,
  data: {
    values: S,
    steps: [
      {
        caption:
          "A spotlight slides over the string, growing right and shrinking left to stay duplicate-free. R adds 'a' to the empty window: best length = 1.",
        markers: [
          { index: 0, label: 'L', color: 'cyan' },
          { index: 0, label: 'R', color: 'violet' },
        ],
        highlight: [0],
      },
      {
        caption:
          "R moves to 1 and pulls in 'b'. No repeat, so the window grows to \"ab\": best length = 2.",
        markers: [
          { index: 0, label: 'L', color: 'cyan' },
          { index: 1, label: 'R', color: 'violet' },
        ],
        highlight: [0, 1],
      },
      {
        caption:
          "R moves to 2 and pulls in 'c'. Still all-distinct, so the window is \"abc\": best length = 3.",
        markers: [
          { index: 0, label: 'L', color: 'cyan' },
          { index: 2, label: 'R', color: 'violet' },
        ],
        highlight: [0, 1, 2],
      },
      {
        caption:
          "R reaches 3 with 'a', but 'a' is already in the window. Shrink: drop the leftmost 'a' and move L to 1, making room.",
        markers: [
          { index: 1, label: 'L', color: 'cyan' },
          { index: 3, label: 'R', color: 'violet' },
        ],
        highlight: [1, 2, 3],
        shade: [0],
      },
      {
        caption:
          "Window is now \"bca\" with no repeats: length 3, so best stays 3. R advances to 4 with 'b'; 'b' is inside, so drop it and move L to 2.",
        markers: [
          { index: 2, label: 'L', color: 'cyan' },
          { index: 4, label: 'R', color: 'violet' },
        ],
        highlight: [2, 3, 4],
        shade: [0, 1],
      },
      {
        caption:
          "R reaches 5 with 'b'. 'b' repeats, so we keep shrinking: drop 'c', then 'a', then 'b', moving L all the way to 5. Window collapses to \"b\".",
        markers: [
          { index: 5, label: 'L', color: 'cyan' },
          { index: 5, label: 'R', color: 'violet' },
        ],
        highlight: [5],
        shade: [0, 1, 2, 3, 4],
      },
      {
        caption:
          'Answer: 3, the run "abc". Each index enters the window once and leaves at most once, so L and R together move at most 2n steps — O(n).',
        markers: [
          { index: 5, label: 'L', color: 'cyan' },
          { index: 5, label: 'R', color: 'violet' },
        ],
        found: [0, 1, 2],
        shade: [3, 4, 5],
      },
    ],
  },
})
