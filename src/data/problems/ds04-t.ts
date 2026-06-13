import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch04-t-001',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'LIFO Versus FIFO',
    prompt: `You push the strings "A", then "B", then "C" into an empty container, and then remove one item.

If the container is a STACK, which string comes out? If instead it is a QUEUE, which string comes out? Name the rule (LIFO or FIFO) that each container follows.`,
    hints: [
      'A stack is like a pile of plates; a queue is like a line at a counter.',
      'One returns the most recently added item, the other the oldest.',
    ],
    solution: `A stack follows LIFO, which means "last in, first out": the most recently added item is removed first, so it returns "C". A queue follows FIFO, which means "first in, first out": the oldest item is removed first, so it returns "A". This single difference in which item you are allowed to take next is the only thing that distinguishes the two structures, and it is what makes a stack right for things like an undo history (undo the latest edit first) and a queue right for things like a printer line (print jobs in the order submitted).`,
    tags: ['stack', 'queue'],
  },
  {
    id: 'ds-ch04-t-002',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'What Does pop Return?',
    prompt: `In Rust you build a stack out of a plain Vec. Consider:

    let mut stack: Vec<i32> = Vec::new();
    stack.push(7);
    let a = stack.pop();
    let b = stack.pop();

What is the type of a, and what exact values do a and b hold after this runs?`,
    hints: [
      'pop() does not hand back the value directly; it wraps the result.',
      'Think about what should happen when you pop an empty stack.',
    ],
    solution: `pop() returns an Option<i32>, not a bare i32. The first pop() removes the only element, so a is Some(7). The second pop() runs on an empty stack, and instead of crashing or returning a special sentinel number, it returns None, so b is None. Rust returns an Option on purpose: popping an empty stack is a normal possibility, and the type system forces you to handle the None case (with a match, if let, or unwrap) rather than silently using a garbage value.`,
    tags: ['stack', 'option'],
  },
  {
    id: 'ds-ch04-t-003',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why remove(0) Is Slow',
    prompt: `A classmate builds a queue out of a Vec: they push_back to add, and call remove(0) to take the front element. For a Vec holding n elements, why is remove(0) an O(n) operation, and what happens to the overall cost if you dequeue in a loop?`,
    hints: [
      'A Vec stores its elements packed together starting at index 0.',
      'Removing the front leaves a hole that has to be filled somehow.',
    ],
    solution: `A Vec keeps its elements packed contiguously starting at index 0. Removing index 0 leaves a hole at the front, so every one of the remaining elements must shift left by one slot to close it. That shift touches all of the (up to) n remaining elements, which is why remove(0) costs O(n), meaning the work grows in proportion to how many elements are present. If you dequeue n elements this way in a loop, each removal is O(n) and you do n of them, so the whole loop becomes O(n squared). The fix is VecDeque, whose pop_front just advances an index and shifts nothing, giving O(1) per dequeue.`,
    tags: ['queue', 'vecdeque', 'complexity'],
  },
  {
    id: 'ds-ch04-t-004',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Pick the Right Container',
    prompt: `For each task below, say whether you would reach for a Vec (used as a stack) or a VecDeque, and give a one-line reason:

1. Tracking the function-call-like nesting while you evaluate an expression.
2. A printer job list where documents print in submission order.
3. The frontier of a breadth-first maze search.`,
    hints: [
      'Ask whether each task needs LIFO (one end) or FIFO (add at one end, remove at the other).',
      'Only a VecDeque removes from the front in O(1).',
    ],
    solution: `Task 1 needs a stack, so use a Vec: nesting is last-in-first-out (the most recently opened sub-expression closes first), and a Vec pushes and pops at its end in O(1). Task 2 needs a FIFO queue, so use a VecDeque: documents must come out in the order they went in (oldest first), which means adding at the back and removing from the front, and a VecDeque does pop_front in O(1) while a Vec would be O(n). Task 3 also needs a FIFO queue, so use a VecDeque: breadth-first search must process cells in the order they were discovered (closest first), which is exactly FIFO.`,
    tags: ['stack', 'queue', 'vecdeque'],
  },
  {
    id: 'ds-ch04-t-005',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Trace Valid Parentheses',
    prompt: `Using the stack algorithm for matching brackets (push openers; on a closer the top must be its matching opener; the stack must be empty at the end), hand-trace the input "([)]".

Show the stack contents after each character and say at which character the algorithm decides the string is invalid.`,
    hints: [
      'Push ( and [ in turn, then look at the closer ).',
      'A ) requires the top of the stack to be a (.',
    ],
    solution: `Scanning left to right: on '(' push it, stack is [ ( ]. On '[' push it, stack is [ (, [ ]. On ')' the algorithm needs the top to be its matching opener '(', but the top is actually '[', so the brackets cross and the string is declared INVALID right here at the ')'. The remaining ']' is never reached. This shows why the order of nesting matters: even though the counts of openers and closers are balanced, "([)]" is invalid because the most recently opened bracket '[' is not the next one closed.`,
    tags: ['stack', 'parentheses'],
  },
  {
    id: 'ds-ch04-t-006',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'The Two Easy-to-Forget Checks',
    prompt: `A student writes a bracket-matcher that, while scanning, only checks "when I see a closer, does the top match?" and returns true if it never finds a mismatch.

Give one input it wrongly accepts and one input it wrongly handles, and name the two checks that are missing.`,
    hints: [
      'What about an input that only opens brackets and never closes them?',
      'What about a closing bracket when the stack is empty?',
    ],
    solution: `The matcher is missing two checks. First, it must verify the stack is empty at the very end: an input like "(((" never triggers a mismatch during the scan, so the buggy version wrongly accepts it even though three openers were never closed. Second, it must handle a closer when the stack is empty: an input like ")" tries to pop from an empty stack (pop() returns None), and the buggy version must treat that as a failure rather than unwrapping and panicking or ignoring it. So the two rules are: a closer on an empty stack is invalid, and the stack must be empty when the string ends.`,
    tags: ['stack', 'parentheses'],
  },
  {
    id: 'ds-ch04-t-007',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Order Matters in RPN',
    prompt: `Reverse Polish Notation (postfix) evaluates with a stack: push numbers, and on an operator pop two numbers, apply it, and push the result.

For the tokens ["8", "2", "-"], a student computes 2 - 8 = -6, but the correct answer is 6. Explain which popped value is the left operand and which is the right, and give the correct result.`,
    hints: [
      'The value popped FIRST was pushed most recently.',
      'For subtraction and division the operand order cannot be swapped.',
    ],
    solution: `When you hit the operator, the first value you pop is the one pushed most recently, which is the RIGHT operand, and the second value you pop is the LEFT operand. For ["8", "2", "-"] you push 8 then 2; the first pop gives 2 (right operand) and the second pop gives 8 (left operand), so you compute left minus right, that is 8 - 2 = 6. The student reversed the operands. For commutative operators like + and * the order would not matter, but for subtraction and division it does, so you must always treat the second-popped value as the left operand.`,
    tags: ['stack', 'rpn'],
  },
  {
    id: 'ds-ch04-t-008',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Why The Monotonic Stack Is O(n)',
    prompt: `The brute-force "next greater element" scans rightward from each element, which is O(n squared). The monotonic-stack version has a while-loop nested inside a for-loop, so at a glance it also looks like it could be O(n squared).

Explain why it is actually O(n). What is the key accounting argument?`,
    hints: [
      'Count how many times any single index can be pushed and popped over the whole run.',
      'A nested loop is not automatically O(n squared) if the inner work is bounded across all iterations.',
    ],
    solution: `The trick is to count total work across the entire run instead of per outer step. Each index is pushed onto the stack exactly once, and once popped it never returns, so each index is popped at most once. That means the inner while-loop performs at most n pops in total across all iterations of the for-loop combined, even though one particular step might pop several items at once. So the total work is the n pushes plus at most n pops, which is O(n). This "each element enters and leaves the stack once" argument is the heart of every monotonic-stack proof, and it is why a nested loop here is not actually quadratic.`,
    tags: ['monotonic-stack', 'complexity'],
  },
  {
    id: 'ds-ch04-t-009',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Trace Daily Temperatures',
    prompt: `The "daily temperatures" algorithm keeps a stack of indices of days still waiting for a warmer day; when today is warmer than the day at the top, it pops and records the distance (today's index minus the popped index).

Hand-trace the input [70, 71, 69, 72]. Give the stack of indices just before processing index 3, and the final answer array.`,
    hints: [
      'Store indices, not temperatures, and record i minus top as the gap.',
      'Day 2 (value 69) is colder than day 1, so it just sits on the stack.',
    ],
    solution: `Trace it day by day. i=0 (70): stack is [0]. i=1 (71): 71 > 70 so pop index 0 and set answer[0] = 1 - 0 = 1; push 1, stack is [1]. i=2 (69): 69 is not greater than 71, so just push, stack is [1, 2]. That is the stack just before index 3: [1, 2]. i=3 (72): 72 > 69 so pop index 2, answer[2] = 3 - 2 = 1; 72 > 71 so pop index 1, answer[1] = 3 - 1 = 2; push 3, stack is [3]. Index 3 is left on the stack with no warmer day after it, so its answer stays 0. The final array is [1, 2, 1, 0].`,
    tags: ['monotonic-stack', 'daily-temperatures'],
  },
  {
    id: 'ds-ch04-t-010',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'The Histogram Width Formula',
    prompt: `In the largest-rectangle-in-a-histogram algorithm you keep an increasing stack of indices. When a shorter bar arrives at position i, you pop a bar of height h whose index was "top", and the rectangle's width is computed as either i if the stack is now empty, or (i minus the new stack top minus 1) otherwise.

Explain, in terms of left and right boundaries, why the width is that expression and not simply (i minus top).`,
    hints: [
      'The popped bar of height h can extend left past any taller bars beneath it.',
      'The new stack top is the first bar to the LEFT that is shorter than h.',
    ],
    solution: `When you pop the bar of height h, the rectangle of that height can stretch right up to but not including position i (because the bar at i is shorter than h, it is the right boundary). Its left boundary is the first bar to the left that is strictly shorter than h, which is exactly whatever index is now on top of the stack after the pop; everything between that index and i was at least as tall as h, so the rectangle can span all of it. The number of bars strictly between the new top and i is (i minus new-top minus 1), which is the width. Using (i minus top) would be wrong because the popped bar can extend further left than its own position, all the way to just after the new stack top. If the stack becomes empty, there is no shorter bar to the left at all, so the rectangle reaches the very start and the width is just i.`,
    tags: ['monotonic-stack', 'histogram'],
  },
  {
    id: 'ds-ch04-t-011',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'BFS Versus DFS Is One Data Structure',
    prompt: `Breadth-first search explores a maze in rings (all cells one step away, then two steps, then three) and the first time it reaches the goal is by a shortest path.

What single data-structure choice makes the search breadth-first instead of depth-first, and why does that choice guarantee the first arrival at the goal is a shortest path?`,
    hints: [
      'BFS uses a queue; swapping it for a stack changes the whole behavior.',
      'FIFO order means closer cells always leave the frontier before farther ones.',
    ],
    solution: `The choice is using a FIFO queue for the frontier (a VecDeque with push_back and pop_front). Because the queue is first-in-first-out, every cell discovered at distance d leaves the queue before any cell discovered at distance d+1, so the search finishes an entire ring of equally-close cells before touching the next ring. That ordering means distances only ever grow as you process cells, so the very first time the goal is dequeued, no shorter route could have reached it earlier, which is exactly the shortest-path guarantee. If you swap the queue for a stack (LIFO), the search dives deep down one path before backtracking, becoming depth-first search, which does not give shortest paths. The data structure is the difference.`,
    tags: ['queue', 'bfs'],
  },
  {
    id: 'ds-ch04-t-012',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Mark Visited at Enqueue, Not Dequeue',
    prompt: `In a BFS, a student marks a cell "visited" at the moment they DEQUEUE it (pull it off the front), rather than when they ENQUEUE it (add it to the back).

Explain what goes wrong with this timing, and why marking visited at enqueue time fixes it.`,
    hints: [
      'Between being enqueued and being dequeued, a cell sits in the queue for a while.',
      'In that gap, can a neighbor enqueue the same cell again?',
    ],
    solution: `A cell can be enqueued by several of its neighbors before it ever reaches the front to be dequeued. If you only mark it visited at dequeue time, then during the window while it sits in the queue it is still considered "unvisited," so multiple neighbors will each enqueue it again, putting many copies into the queue. That wastes work processing the same cell repeatedly, and because the duplicate copies may carry larger distances, it can even report inflated distances. Marking a cell visited the instant you enqueue it (before any other neighbor gets a chance) guarantees each cell is added to the queue exactly once, keeping BFS at O(V + E) and keeping the recorded distance equal to the shortest one, since the first enqueue is always via a shortest path.`,
    tags: ['queue', 'bfs'],
  },
]

export default problems
