import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch09-t-001',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Bank Queue Versus ER Triage',
    prompt: `A regular queue at a bank serves people first-come, first-served. A hospital emergency room cannot work that way: a patient having a heart attack must be seen before someone with a sprained ankle who arrived earlier. Which data structure models the ER, and what are its three core operations?`,
    hints: [
      'The ER serves the most urgent waiting item next, not the one that arrived first.',
      'Think about adding an item, looking at the most important one, and removing it.',
    ],
    solution: `The ER is modeled by a priority queue. A priority queue is an abstract data type (a description of what operations a structure supports, separate from how it is built) where every item carries a priority, and you always get the most-important item back next, not the one that arrived first. Its three core operations are push (insert an item with a priority), peek (look at the most-important item without removing it), and pop (remove and return the most-important item). A plain first-in-first-out queue is wrong here because arrival order is not the order we want.`,
    tags: ['priority-queue', 'abstract-data-type'],
  },
  {
    id: 'ds-ch09-t-002',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Is This Array a Valid Max-Heap?',
    prompt: `A max-heap stores its complete binary tree in a flat array, level by level, left to right. The rule is that every parent must be greater than or equal to both of its children. Is the array [9, 7, 8, 5, 6, 2, 3] a valid max-heap? Explain by checking the parent-child pairs.`,
    hints: [
      'Index 0 is the root; its children are at indexes 1 and 2.',
      'A node at index i has children at 2*i+1 and 2*i+2; check each parent against its children.',
    ],
    solution: `Yes, it is a valid max-heap. Using the index rule that node i has children at 2*i+1 and 2*i+2: the root 9 (index 0) has children 7 and 8, and 9 is at least as big as both. Node 7 (index 1) has children 5 and 6, and 7 is at least as big as both. Node 8 (index 2) has children 2 and 3, and 8 is at least as big as both. The remaining nodes (indexes 3, 4, 5, 6) are leaves with no children. Every parent dominates its children, so the heap property holds. Note that reading the array left to right (9 7 8 5 6 2 3) is NOT sorted; a heap only promises parent-versus-child, never a fully sorted order.`,
    tags: ['binary-heap', 'heap-property'],
  },
  {
    id: 'ds-ch09-t-003',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why Not Just Keep a Sorted List?',
    prompt: `A classmate says: "Forget heaps. I will keep all my items in a fully sorted list. Then pop (taking the most-important item) is just grabbing the front, which is O(1)." That part is true, but what cost did they hide, and how does a binary heap give a more balanced deal?`,
    hints: [
      'Think about what happens when a new item is pushed into a fully sorted list.',
      'Compare push, peek, and pop costs across the sorted list and the heap.',
    ],
    solution: `Keeping the list fully sorted does make pop and peek O(1) (constant time, the front is always the most important), but it hides the cost of push: inserting a new item means finding its correct slot and shifting everything after it, which is O(n) (work grows linearly with the number of items). So on a stream of n pushes you do roughly n times n work overall. A binary heap refuses to keep everything fully sorted; it only guarantees fast access to the single most-important item. In exchange both push and pop are O(log n) (the work only grows with the height of the tree, which doubles in capacity each level) and peek is O(1). No single heap operation is ever linear, which is the balanced deal the sorted list lacks.`,
    tags: ['priority-queue', 'complexity', 'trade-off'],
  },
  {
    id: 'ds-ch09-t-004',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Finding the Relatives by Arithmetic',
    prompt: `In a 0-based heap array of length 7, you are standing at the node at index 2. Using the heap index arithmetic, what are the indexes of its left child, right child, and parent? Then explain what it would mean if a computed child index came out as 7 or larger.`,
    hints: [
      'left = 2*i+1, right = 2*i+2, parent = (i-1)/2 with integer division.',
      'The array only has indexes 0 through 6; what is at index 7?',
    ],
    solution: `For the node at index i = 2: the left child is at 2*2+1 = 5, the right child is at 2*2+2 = 6, and the parent is at (2-1)/2 = 0 (integer division throws away the remainder). All three are valid indexes in a length-7 array (indexes 0 through 6). If a computed child index came out as 7 or larger, it would point past the end of the array, which simply means that child does not exist and the node is a leaf. That is why every child access must be bounds-checked against the array length before indexing, or Rust would panic.`,
    tags: ['index-arithmetic', 'binary-heap'],
  },
  {
    id: 'ds-ch09-t-005',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'The BinaryHeap Surprise',
    prompt: `A first-year student writes this and expects it to print the smallest value:

use std::collections::BinaryHeap;
fn main() {
    let mut h = BinaryHeap::new();
    for v in [3, 1, 4, 1, 5] { h.push(v); }
    println!("{}", h.pop().unwrap());
}

What does it actually print, and how would you make a min-heap that pops the smallest value first?`,
    hints: [
      'Rust\'s std::collections::BinaryHeap is a max-heap by default.',
      'There is a one-field wrapper type that flips ordering.',
    ],
    solution: `It prints 5, not 1. The gotcha that catches every Rust beginner is that std::collections::BinaryHeap is a MAX-heap: pop always returns the largest element by Rust's ordering, not the smallest. To get a min-heap that pops the smallest first, wrap each value in std::cmp::Reverse before pushing it. Reverse is a one-field tuple struct that reverses the comparison, so the "largest" wrapped item is the one with the smallest underlying value, turning the max-heap into a min-heap. Remember to read the value back out by unwrapping the .0 field of the Reverse.`,
    tags: ['binary-heap', 'reverse', 'min-heap'],
  },
  {
    id: 'ds-ch09-t-006',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Heap of Floats Will Not Compile',
    prompt: `A student tries to build a BinaryHeap<f64> to keep a heap of sensor readings, but the code refuses to compile. Why does a heap of f64 fail to compile when a heap of i32 works fine? Mention what makes f64 different.`,
    hints: [
      'A heap needs to compare any two items to decide which is more important.',
      'Think about one special floating-point value that cannot be ordered.',
    ],
    solution: `A heap must be able to compare any two of its items to maintain the heap property, which requires a total order, captured in Rust by the Ord trait. The type i32 implements Ord, so a heap of i32 works. But f64 only implements PartialOrd, not Ord, because the special floating-point value NaN (not-a-number) is unorderable: NaN is neither less than, equal to, nor greater than any value, so there is no total order over all f64 values. BinaryHeap requires Ord, so BinaryHeap<f64> will not compile. The fixes are to wrap in an ordered-float type, map each reading to an integer key, or use a newtype that defines a total order.`,
    tags: ['binary-heap', 'ord', 'floats'],
  },
  {
    id: 'ds-ch09-t-007',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Iterating a Heap Is Not Sorted',
    prompt: `You have a populated BinaryHeap and you want its elements in ascending order. A classmate writes for x in &heap { ... } expecting sorted output. Why is that wrong, and what should they use instead to get sorted results?`,
    hints: [
      'A heap only orders parents against children, not the whole array.',
      'There is a method that pops internally to produce an ordered Vec.',
    ],
    solution: `Iterating a heap with iter or into_iter is wrong because it yields items in arbitrary heap-array order, not priority order. The heap only guarantees the parent-versus-child relationship; siblings can sit in any order, so reading the backing array left to right is not sorted. To get sorted output the classmate should either call into_sorted_vec, which pops the heap internally to build an ascending Vec, or pop the heap repeatedly (each pop yields the current extreme, so the popped sequence is ordered). The mistake is treating the heap's internal array as if it were already sorted.`,
    tags: ['binary-heap', 'sorting', 'pitfall'],
  },
  {
    id: 'ds-ch09-t-008',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Trace a Sift-Up',
    prompt: `Start with the max-heap stored as the array [9, 7, 8, 5, 6]. You push the value 10. The push appends 10 at the end, then sifts it up. Show the array after each swap, and state the final array and how many swaps happened.`,
    hints: [
      'Append 10 at index 5, then compare with its parent at (5-1)/2.',
      'Keep swapping upward while the climber is bigger than its parent; stop when the parent wins or you reach the root.',
    ],
    solution: `Appending 10 gives [9, 7, 8, 5, 6, 10] with 10 at index 5. Sift-up compares 10 with its parent at index (5-1)/2 = 2, which holds 8. Since 10 > 8, swap: the array becomes [9, 7, 10, 5, 6, 8] and 10 is now at index 2. Next compare 10 with its parent at index (2-1)/2 = 0, which holds 9. Since 10 > 9, swap: the array becomes [10, 7, 9, 5, 6, 8] and 10 is at index 0. We have reached the root, so we stop. The final array is [10, 7, 9, 5, 6, 8] after 2 swaps. Note that sift-up only ever compares the climbing node with its parent, never its sibling, which is why exactly 2 comparisons-with-swaps (the tree height) were enough.`,
    tags: ['sift-up', 'push', 'tracing'],
  },
  {
    id: 'ds-ch09-t-009',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Sift-Down Must Pick the Larger Child',
    prompt: `During a pop on a max-heap, the new root is 8 and its two children are 7 (left) and 9 (right). A buggy sift-down swaps the root with its LEFT child instead of the larger child. Walk through what goes wrong, and state the correct rule.`,
    hints: [
      'After the buggy swap, which value becomes the parent, and which becomes its child?',
      'A max-heap parent must be at least as big as both children.',
    ],
    solution: `If sift-down swaps 8 with the left child 7, then 7 becomes the new parent and 9 sits below it as a child. But 7 < 9 violates the heap property immediately: the parent is now smaller than one of its children, so the heap is corrupted on the very next level. The correct rule is to swap the sinking node with the LARGER of its two existing children (for a max-heap). Swapping 8 with 9 makes 9 the parent, and 9 is at least as big as both 8 and 7, restoring the property. Always promote the bigger child so the new parent dominates both subtrees (for a min-heap it is the mirror image: swap with the smaller child).`,
    tags: ['sift-down', 'pop', 'heap-property'],
  },
  {
    id: 'ds-ch09-t-010',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Top-K With a Tiny Heap',
    prompt: `You stream the values 5, 1, 9, 3, 7, 2 and want to keep only the top 3 largest, using as little memory as possible. The trick uses a size-3 MIN-heap. Trace what the heap holds after each value, and explain why a MIN-heap (not a max-heap) is the right tool for keeping the LARGEST items.`,
    hints: [
      'When the heap already has 3 items, compare the newcomer against the root (the weakest survivor).',
      'If the newcomer beats the root, evict the root and push the newcomer; otherwise ignore it.',
    ],
    solution: `Tracing a size-3 min-heap whose root is the smallest of the kept items: after 5 the heap is {5}; after 1 it is {1, 5}; after 9 it is {1, 5, 9} (now full, root 1 is the weakest). See 7? No, next is 3: 3 > root 1, so evict 1 and push 3, giving {3, 5, 9}. See 7: 7 > root 3, evict 3 and push 7, giving {5, 7, 9}. See 2: 2 > root 5? No, so ignore it. Final top-3 is {5, 7, 9}, and the root 5 is the 3rd-largest overall. A min-heap is right because its root is the smallest kept value, the weakest survivor, so checking whether a newcomer belongs in the top K is a single cheap comparison against the root, and evicting the loser is one pop. Memory stays at K (here 3) no matter how long the stream is, giving O(K) space and O(n log K) time, far better than sorting everything.`,
    tags: ['top-k', 'min-heap', 'tracing'],
  },
  {
    id: 'ds-ch09-t-011',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Why K-Way Merge Beats Naive Merging',
    prompt: `You are merging K sorted lists holding N total items into one sorted output. The naive method scans the front of all K lists each step to find the smallest. A heap-based method keeps a min-heap of the K current fronts. Give the time cost of each approach and explain why the heap is faster.`,
    hints: [
      'How much work does picking the next smallest cost in each approach?',
      'There are N items to emit; multiply per-item cost by N.',
    ],
    solution: `The naive method scans all K front elements every time it emits one item, costing O(K) per item, so O(N times K) overall. The heap method keeps a min-heap of just the K current fronts: the smallest front is the root, so finding it is O(1), and after emitting it you push the next element from that list, which is one O(log K) heap operation. Each of the N items therefore costs O(log K), giving O(N log K) total. The heap is faster because log K grows much more slowly than K, so when K is more than a handful, replacing a linear scan of K fronts with a logarithmic heap operation is a big win. (To know which list to advance after a pop, store each heap entry as a tuple of value, list-index, and position.)`,
    tags: ['k-way', 'merge', 'complexity'],
  },
  {
    id: 'ds-ch09-t-012',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Running Median With Two Heaps',
    prompt: `The running-median trick keeps a max-heap for the smaller half and a min-heap for the larger half, rebalanced so the two halves differ in size by at most one. Stream in 5, 2, 8, 1 one at a time and give the median after each insertion. State exactly which heap's root (or which average of roots) gives the median in each case.`,
    hints: [
      'After every insert, move one root across if a half grew too big, so sizes differ by at most one.',
      'Median is the larger heap\'s root when sizes differ, or the average of the two roots when sizes are equal.',
    ],
    solution: `Let small be the max-heap (smaller half, root is its largest) and large be the min-heap (larger half, root is its smallest). Add 5: small {5}; one element, median is the single root 5. Add 2: 2 is at most small's root so it goes to small {5, 2}; sizes (2, 0) are unbalanced, so move small's root 5 to large, giving small {2} large {5}; equal sizes, median is the average (2 + 5) / 2 = 3.5. Add 8: 8 is bigger than small's root 2 so it goes to large {5, 8}; sizes (1, 2) are unbalanced, so move large's root 5 to small, giving small {2, 5} large {8}; small is bigger, median is small's root 5. Add 1: 1 is at most small's root 5 so it goes to small {5, 2, 1}; sizes (3, 1) are unbalanced, so move small's root 5 to large, giving small {2, 1} large {5, 8}; equal sizes, median is the average (2 + 5) / 2 = 3.5. So the running medians are 5, 3.5, 5, 3.5. Each insert is O(log n) and each median query is O(1) because it only peeks the roots.`,
    tags: ['two-heaps', 'median', 'tracing'],
  },
]

export default problems
