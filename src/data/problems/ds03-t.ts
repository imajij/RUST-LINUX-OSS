import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch03-t-001',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'What Makes a Window a Window',
    prompt: `Your friend says "a sliding window is just any group of elements you care about." Is that right? Explain in one or two sentences what a window actually is in this chapter, and give one example of a selection of elements that is NOT a valid sliding window.`,
    hints: [
      'Re-read what "contiguous" means.',
      'Think about whether the chosen elements have to be next to each other.',
    ],
    solution: `A window is a contiguous (back-to-back, no gaps) sub-range of an array or string, described by just two indices, a left boundary and a right boundary. So it is not "any group" of elements: the elements must sit next to each other. For example, picking the first, third, and fifth elements of an array (skipping the second and fourth) is an arbitrary subset, not a window, and the sliding-window technique does not apply to it. Sliding window only works when the answer lives in one unbroken stretch.`,
    tags: ['sliding-window', 'array'],
  },
  {
    id: 'ds-ch03-t-002',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'One Step Right',
    prompt: `A width-4 window currently covers the values {4, 2, 1, 7} starting at index 0 of the array [4, 2, 1, 7, 8, 1, 2, 8]. You slide it one step to the right. Which single element enters, which single element leaves, and how many elements in the middle stay exactly where they were?`,
    hints: [
      'Sliding one step changes only the two ends.',
      'Compare the old window {4,2,1,7} with the new one.',
    ],
    solution: `Sliding one step right makes the new window cover {2, 1, 7, 8}. The value 8 (at index 4) enters on the right, and the value 4 (at index 0) leaves on the left. The three middle values 2, 1, and 7 stay exactly where they were. Because only two elements change while the rest are reused, you can update a running answer (like a sum) in constant time instead of re-reading the whole window.`,
    tags: ['sliding-window', 'array'],
  },
  {
    id: 'ds-ch03-t-003',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why Sliding Beats Re-Summing',
    prompt: `To find the largest sum among all blocks of k consecutive elements, the brute-force way re-adds k elements for each of the roughly n starting positions. The sliding-window way seeds the first block, then on each slide does just one add and one subtract. State the running time of each approach in plain words, and explain why the slide is so much cheaper.`,
    hints: [
      'Count the work per slide for each approach.',
      'Neighbouring blocks of width k share k minus 1 elements.',
    ],
    solution: `The brute-force approach does about n times k work: for every starting position it re-adds all k elements of that block, even though neighbouring blocks share k minus 1 elements, so almost all of that adding is repeated. When k is around half of n this is quadratic (work grows with the square of the input). The sliding-window approach is O(n): it builds the first block's sum once, then each slide adds the entering element and subtracts the leaving one, two operations regardless of how big k is. Because the per-step update is constant time, the whole pass costs roughly n steps instead of n times k.`,
    tags: ['sliding-window', 'array'],
  },
  {
    id: 'ds-ch03-t-004',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Trace the Fixed Window Sum',
    prompt: `With k = 3 and array [2, 1, 5, 1, 3, 2], the fixed-window algorithm seeds the first sum, then slides doing one add and one subtract per step. Write the window sum after each of the four windows (in order) and state the final maximum.`,
    hints: [
      'First window sum is 2 + 1 + 5.',
      'Each slide: new sum = old sum + entering - leaving.',
    ],
    solution: `The first window {2,1,5} sums to 8. Slide 1: 1 enters and 2 leaves, so 8 + 1 - 2 = 7 for {1,5,1}. Slide 2: 3 enters and 1 leaves, so 7 + 3 - 1 = 9 for {5,1,3}. Slide 3: 2 enters and 5 leaves, so 9 + 2 - 5 = 6 for {1,3,2}. The four sums in order are 8, 7, 9, 6, and the maximum is 9 (the window {5,1,3}). Each slide did exactly one add and one subtract, never a full re-scan.`,
    tags: ['sliding-window', 'array'],
  },
  {
    id: 'ds-ch03-t-005',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'The Forgotten Subtraction',
    prompt: `A student writes a fixed-window sum that adds the entering element on every slide but forgets to subtract the leaving one:

for right in k..nums.len() {
    window_sum += nums[right];   // adds, but never subtracts nums[right - k]
    best = best.max(window_sum);
}

What quantity does window_sum actually compute as the loop runs, and why is every answer after the very first window wrong?`,
    hints: [
      'Without the subtraction, nothing ever leaves the window.',
      'Think about whether the window stays width k.',
    ],
    solution: `Because nothing is ever subtracted, window_sum stops being the sum of a fixed width-k window and instead becomes the sum of an ever-growing prefix: it accumulates every element from the start of the array up to the current right index. The first window's value happens to be correct (it was seeded as the real sum of the first k elements), but from the second slide onward the running total includes elements that should have fallen off the left, so it overcounts. The fix is to subtract nums[right - k] on each slide so the window keeps exactly k elements.`,
    tags: ['sliding-window', 'array'],
  },
  {
    id: 'ds-ch03-t-006',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why a VecDeque for Moving Average',
    prompt: `The moving-average filter in the note stores its window in a VecDeque (a double-ended queue) and on each new reading does push_back then possibly pop_front. Why is a VecDeque a better fit here than pushing to the back and removing from the front of a plain Vec?`,
    hints: [
      'Think about the cost of removing from the front of a Vec.',
      'Which ends does the moving average add to and remove from?',
    ],
    solution: `The moving average adds the newest reading at one end and discards the oldest reading at the other end on every tick. A VecDeque supports both push_back and pop_front in constant time, so each update is O(1), exactly what a real-time stream needs. A plain Vec can push and pop cheaply only at its back; removing from the front means shifting every remaining element down by one, which is O(n) per removal. Using a Vec that way would make each update cost grow with the window size, defeating the whole point of the sliding window.`,
    tags: ['sliding-window', 'deque', 'moving-average'],
  },
  {
    id: 'ds-ch03-t-007',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Longest Versus Shortest: Where to Record',
    prompt: `Two variable-window problems use opposite shrink rules. "Longest substring without repeats" shrinks WHILE the window is invalid and records the answer after shrinking. "Shortest subarray with sum at least target" shrinks WHILE the window is valid and records the answer during shrinking. Explain why the recording moment differs.`,
    hints: [
      'Ask: when is the window in the state you want to measure?',
      'Maximizing wants the biggest valid window; minimizing wants the smallest valid window.',
    ],
    solution: `You record the answer exactly when the window is in the shape you are optimizing for. For the longest-valid-window problem you shrink only while the window is invalid (has a duplicate); once the shrink loop ends the window is valid again and as wide as it can currently be, so you record its width right after shrinking. For the shortest-valid-window problem you keep shrinking as long as the window is still valid (sum still at least the target), and the window is smallest while still satisfying the condition right before each shrink, so you record there, just before squeezing it further. In short: maximize, record when valid and just stopped shrinking; minimize, record while valid and about to shrink.`,
    tags: ['sliding-window', 'two-pointers'],
  },
  {
    id: 'ds-ch03-t-008',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Nested Loops That Are Still Linear',
    prompt: `The variable-window skeleton has a while-loop (shrink left) nested inside a for-loop (expand right). A classmate insists this must be O(n squared) because "a loop inside a loop is always n squared." Explain precisely why this code is actually O(n).`,
    hints: [
      'Count how many times left can move over the WHOLE run, not per outer step.',
      'Each element enters the window once and leaves at most once.',
    ],
    solution: `The "loop inside a loop is n squared" rule only holds when the inner loop runs up to n times for each outer step. Here it does not: the inner while-loop advances the left pointer, and left never moves backward and never passes right. So across the entire run, left advances at most n times total, not n times per outer iteration. The right pointer also advances n times. Adding these, the total number of pointer moves is at most 2n, so the whole algorithm is O(n). Another way to see it: each element is added to the window exactly once and removed at most once. This charging-each-step-to-an-element argument is called amortized analysis.`,
    tags: ['sliding-window', 'two-pointers', 'amortized'],
  },
  {
    id: 'ds-ch03-t-009',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Trace eceba With At Most 2 Distinct',
    prompt: `Run the at-most-k-distinct window on s = "eceba" with k = 2, using a HashMap of character counts. After the right pointer reaches the 'b' at index 3, the window has 3 distinct characters and must shrink. Show the two count maps as you drop characters from the left, name which character's key is removed, and give the window and its width once it is valid again.`,
    hints: [
      'Before index 3 the window is "ece" with counts e:2, c:1.',
      'When you decrement a count to zero, remove that key so map.len() drops.',
    ],
    solution: `Just before index 3 the window "ece" has counts e:2, c:1 (2 distinct). Adding 'b' gives e:2, c:1, b:1, which is 3 distinct, so shrink. Drop the leftmost 'e' (s[0]): counts become e:1, c:1, b:1, still 3 distinct because 'e' still has a copy left, so keep shrinking. Drop the next leftmost 'c' (s[1]): its count hits 0, so remove the 'c' key entirely, leaving e:1, b:1, which is 2 distinct. The window is now valid: it is "eb" at indices 2 and 3 with width 2. The lesson is that you must remove a key only when its count reaches zero, otherwise map.len() would overcount the distinct characters.`,
    tags: ['sliding-window', 'hashmap', 'string'],
  },
  {
    id: 'ds-ch03-t-010',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'HashSet or HashMap',
    prompt: `For "longest substring without repeating characters" the note uses a HashSet, but for "longest substring with at most k distinct characters" it uses a HashMap of counts. Both track the window's characters, so why can the first problem get away with a set while the second cannot?`,
    hints: [
      'Ask what each structure can answer: presence, or how many copies?',
      'In the no-repeats window, how many copies of any character can exist at once?',
    ],
    solution: `A HashSet answers only "is this character in the window?" In the no-repeats problem the invariant guarantees the window never holds a duplicate, so every character has at most one copy, and presence is all you ever need: when you remove a character on the left, it definitely leaves the window. The at-most-k-distinct problem allows a character to appear several times inside the window, so when you shrink and remove one copy from the left you must know whether that was the last copy. A set cannot tell you that, but a HashMap of counts can: you decrement the count and only when it hits zero do you remove the key, dropping the distinct count. Counts are essential whenever a value can legitimately repeat inside the window.`,
    tags: ['sliding-window', 'hashmap', 'hashset'],
  },
  {
    id: 'ds-ch03-t-011',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'When Negatives Break the Trick',
    prompt: `The "shortest subarray with sum at least target" algorithm assumes all values are positive. Show with a tiny example why allowing negative numbers breaks the plain sliding-window approach, and name what makes the positive-only case work.`,
    hints: [
      'With positives, does the window sum only grow when you expand and only shrink when you shrink left?',
      'Try a value like -5 entering, or shrinking off a negative.',
    ],
    solution: `With only positive values the window sum is monotonic: expanding right always increases it and shrinking left always decreases it. That is what lets you confidently stop shrinking the moment the sum drops below the target, knowing it will not creep back up. Negatives break this. Consider nums = [3, -5, 4] with target 4. After expanding to {3} the sum is 3, below target; expanding to {3, -5} the sum actually DROPS to -2 even though the window grew, so "expand until you reach the target" no longer makes steady progress. Likewise, shrinking off a negative element can raise the sum rather than lower it, so the stop-shrinking condition becomes unreliable. The negative-number variant needs prefix sums plus a different structure, not a plain sliding window.`,
    tags: ['sliding-window', 'array', 'monotonic'],
  },
  {
    id: 'ds-ch03-t-012',
    chapter: 3,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'The Array of 26 Versus a HashMap',
    prompt: `The note says that for a small, known alphabet you can replace a HashMap of counts with a fixed array like [usize; 26], indexed by writing c as usize minus the code of 'a'. Explain the performance win this buys, and describe two specific inputs that would make this indexing wrong or unsafe.`,
    hints: [
      'Think about hashing and heap allocation versus a direct index.',
      'What if the character is uppercase, a space, or a multi-byte Unicode character?',
    ],
    solution: `Indexing a fixed array is a direct memory offset: there is no hashing of the key and no heap allocation, so in a tight loop it is markedly faster than a HashMap while answering exactly the same "how many of each, how many distinct" questions. The trade-off is rigidity, because the mapping from character to slot 0..25 must be valid. Two inputs that break it: first, a character outside the assumed alphabet, such as an uppercase 'A' or a space, produces an index outside 0..25 (for example a space minus 'a' underflows), so you index out of bounds or land in the wrong slot. Second, a non-ASCII character like an accented letter or emoji is multi-byte in UTF-8, so c as usize minus the code of 'a' is byte arithmetic that does not correspond to a single 0..25 slot at all. Whenever the alphabet is not a small dense ASCII range you must validate the input or fall back to a HashMap.`,
    tags: ['sliding-window', 'hashmap', 'string'],
  },
]

export default problems
