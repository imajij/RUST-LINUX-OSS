import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch06-t-001',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Node Versus Value',
    prompt: `In a linked list, people sometimes mix up the "node" and the "value." Using the chain 10 -> 20 -> 30 as your example, explain in your own words what a node is, what a value is, and what a pointer (the next field) is. Which of these three is the part that does the "linking"?`,
    hints: [
      'Think of a freight train: each car carries cargo and is coupled to the car behind it.',
      'One of the three is just the cargo, one is the wrapper around the cargo, and one is the coupler that points forward.',
    ],
    solution: `A node is the wrapper box that the list is built out of: a small struct that holds two things, a value plus a link. The value is just the cargo, the data you actually care about (here the numbers 10, 20, 30). The pointer is the next field, an address that says "the next node lives over there." The pointer is the part that does the linking: it is the coupler that joins one node to the one behind it. So the list is a chain of node wrappers, each holding a value and pointing forward to the next node, with the last node's pointer marking the end.`,
    tags: ['linked-list', 'nodes', 'pointers'],
  },
  {
    id: 'ds-ch06-t-002',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'How the List Knows Where to Stop',
    prompt: `The idiomatic Rust list link type is Option of a boxed node. In C, the last node's "next" is a special null pointer. What plays the role of that end marker in the Rust type, and why is the Rust version considered safer than C's null?`,
    hints: [
      'The link type is "either nothing, or an owned next node."',
      'Think about what the compiler forces you to do before you are allowed to follow a link.',
    ],
    solution: `The end marker in the Rust type is the None variant of Option. A real link is Some holding a boxed node; the end of the list is None. This is the safe replacement for C's null pointer. It is safer because Rust forces you to handle the None case before you can use the node inside (for example with a match or while-let). You can never accidentally follow an end-of-list link into garbage memory the way a forgotten null check in C lets you do, because there is simply no node value to reach for when the link is None.`,
    tags: ['linked-list', 'option', 'null-safety'],
  },
  {
    id: 'ds-ch06-t-003',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why list[i] Is Slow',
    prompt: `Reading the i-th element of a Vec is constant time, but reading the i-th node of a singly linked list is O(n) (it grows with the position). Explain the underlying reason for this difference, and finish this rule of thumb: "if my code does list[i] a lot, I should use a ____ instead of a list."`,
    hints: [
      'An array element address can be computed with arithmetic; a node address cannot.',
      'To reach node number i in a list, what must you actually do?',
    ],
    solution: `A Vec stores its elements side by side in one contiguous block, so element i lives at base address plus i times the element size, a single arithmetic jump that does not depend on i. A linked list scatters its nodes anywhere on the heap, so there is no formula for where node i is; the only way to find it is to start at the head and follow i links one at a time, which is i steps of work. That walk is why indexed access is O(n) on a list and O(1) on an array. The rule of thumb: if my code does list[i] a lot, I should use a Vec instead of a list.`,
    tags: ['linked-list', 'random-access', 'complexity'],
  },
  {
    id: 'ds-ch06-t-004',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why the Box Is Mandatory',
    prompt: `A student writes a node without the Box, like this:

    struct Node { value: i32, next: Option<Node> }

It refuses to compile, with an error about a type of infinite size. Explain why a Node that directly contains another Node has infinite size, and how wrapping the inner node in a Box fixes it.`,
    hints: [
      'To lay out a struct, the compiler must know exactly how many bytes it takes.',
      'A Box is a pointer, and a pointer has a fixed, known size no matter how big the thing it points at is.',
    ],
    solution: `To compile a struct the compiler must compute its exact size in bytes. If a Node directly contains an Option of a Node, then its size is "the size of an i32 plus the size of a Node," and that inner Node again contains a Node, and so on forever. The size never settles on a number, so the type is reported as infinitely sized. A Box fixes this because a Box is just a pointer to a heap location, and a pointer has a fixed, known size (one machine word) regardless of how large the node it points to is. So the recursion is broken: each Node holds a value plus an optional Box, both of fixed size, and the chain of nodes lives on the heap.`,
    tags: ['linked-list', 'box', 'recursive-type'],
  },
  {
    id: 'ds-ch06-t-005',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Pushing to the Front Is Cheap',
    prompt: `Inserting a new element at the front of a Vec is O(n), but pushing a new node to the front of a singly linked list is O(1). Explain why each cost is what it is. Why is the front the cheapest place to add to a linked list?`,
    hints: [
      'A Vec must keep its elements contiguous, so opening up index 0 means everything has to move.',
      'For the list, what is the only spot you already hold a pointer to, and how many links must change to splice in front of it?',
    ],
    solution: `Inserting at the front of a Vec is O(n) because the Vec keeps its elements packed in one block: to free up index 0, every existing element must slide one slot to the right, and that is n moves. Pushing to the front of a linked list is O(1) because you only change a couple of pointers: make a new node whose next points at the current head, then make the head point at the new node. Nothing else in the list moves. The front is the cheapest place to add precisely because the head is the one spot you already hold a pointer to; you do not have to walk anywhere to get there, and the work does not grow with the length of the list.`,
    tags: ['linked-list', 'push-front', 'complexity'],
  },
  {
    id: 'ds-ch06-t-006',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Borrowing While You Walk',
    prompt: `Here is the core of a traversal loop that prints every value:

    let mut cur = self.head.as_deref();   // Option<&Node>
    while let Some(node) = cur {
        print!("{} ", node.value);
        cur = node.next.as_deref();
    }

Explain what as_deref does here, and what would go wrong if the cursor owned each Box instead of borrowing a reference to each node.`,
    hints: [
      'The cursor type is Option of a shared reference to a Node, not an owned Box.',
      'Think about what "consuming" the list would mean: could you still print it again afterward?',
    ],
    solution: `The call as_deref turns a reference to an Option of a boxed node into an Option of a plain shared reference to the node, peeling off the Box without taking ownership of it. That is exactly the borrow we want: the cursor only peeks at each node. If the cursor owned each Box instead, then walking the list would move the nodes out, consuming the list as you go, so it would be empty (or unusable) afterward and you could not traverse it a second time or keep using it elsewhere. Borrowing with a shared reference lets the traversal read every node in order while leaving the whole list intact.`,
    tags: ['linked-list', 'traversal', 'borrowing'],
  },
  {
    id: 'ds-ch06-t-007',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Trace the Reversal Dance',
    prompt: `Reverse the list 1 -> 2 -> 3 using the iterative prev/curr/next method. Hand-trace it: after each loop iteration, write the value of prev (the part already reversed) and the value of curr. Then state which pointer is the new head when the loop ends, and why it is that one and not curr.`,
    hints: [
      'Each iteration does four moves: save next, flip curr.next to prev, slide prev to curr, slide curr to next.',
      'The loop stops when curr becomes None; look at where prev is sitting at that moment.',
    ],
    solution: `Start with prev = None and curr = 1. Iteration 1: save next = 2, flip node 1's link to point at None, then prev = 1, curr = 2 (prev side is 1, i.e. None <- 1). Iteration 2: save next = 3, flip node 2's link to point at 1, then prev = 2, curr = 3 (prev side is None <- 1 <- 2). Iteration 3: save next = None, flip node 3's link to point at 2, then prev = 3, curr = None (prev side is None <- 1 <- 2 <- 3). The loop now stops because curr is None. The new head is prev = 3, giving 3 -> 2 -> 1. It is prev and not curr because prev is the last node we successfully flipped, while curr has already walked off the end and is None.`,
    tags: ['linked-list', 'reversal', 'tracing'],
  },
  {
    id: 'ds-ch06-t-008',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'The Amputated List Bug',
    prompt: `A student reverses a list but reorders the four steps of the loop body so the flip happens before saving the forward link:

    // curr currently points at node X
    curr.next = prev;          // flip the arrow backward FIRST
    let next = curr.next;      // now try to grab the way forward
    prev = curr;
    curr = next;

What goes wrong on the very first iteration, and which step did they move out of order? State the rule that prevents this bug.`,
    hints: [
      'After the flip, what does curr.next point at?',
      'The rest of the list was reachable only through the old value of curr.next.',
    ],
    solution: `The bug is that they overwrote curr.next with prev before saving the original forward link. After the line that flips the arrow, curr.next no longer points at the rest of the list (the nodes ahead); it points backward at prev. So when the next line reads curr.next to find the way forward, it gets prev, not the real next node, and the entire remainder of the list has been amputated and lost. The fix is the ordering rule: always save next first (let next = curr.next), then flip curr.next = prev. Only stash the forward link before you destroy it.`,
    tags: ['linked-list', 'reversal', 'spot-the-bug'],
  },
  {
    id: 'ds-ch06-t-009',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Why the Hare Catches the Tortoise',
    prompt: `Floyd's cycle detection runs a slow pointer (one step) and a fast pointer (two steps) through a list. On a list with no cycle the fast pointer just reaches the end and you report "no cycle." But if there is a cycle, the note claims the two pointers MUST eventually land on the same node. Give the intuition for why a collision is guaranteed once both pointers are inside the loop.`,
    hints: [
      'Think about the gap (number of nodes) between the fast pointer and the slow pointer.',
      'On each step, by how much does that gap change once both are going around the same loop?',
    ],
    solution: `Once both pointers are inside the cycle, consider the gap from the fast pointer forward to the slow pointer around the loop. On every step the fast pointer moves two and the slow pointer moves one, so the fast pointer gains one position on the slow one, which means that gap shrinks by exactly one each step. A gap that is some finite number and decreases by one every step must hit zero, and a zero gap means they are on the same node. So they are guaranteed to collide within at most one lap of the loop. If there were no cycle, the fast pointer would instead run off the end (reach None) and the gap-closing argument never applies, which is why reaching None is your "no cycle" answer. Detection costs O(n) time and only O(1) extra space, since it is just two pointers.`,
    tags: ['linked-list', 'two-pointers', 'cycle-detection'],
  },
  {
    id: 'ds-ch06-t-010',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Find the Middle in One Pass',
    prompt: `The slow/fast runner finds the middle of a list in a single pass: slow moves one node per step, fast moves two, and you stop when fast can no longer take a full double step. Hand-trace it on 10 -> 20 -> 30 -> 40 -> 50 and report where slow ends up. Then explain the pitfall the note warns about when the list has an EVEN number of nodes.`,
    hints: [
      'Step the two pointers together; stop when fast is at the last node or has fallen off the end.',
      'Before fast takes its double step, you must check that the node in between actually exists.',
    ],
    solution: `Trace on 10 -> 20 -> 30 -> 40 -> 50. Start slow = 10, fast = 10. Step 1: slow = 20, fast = 30. Step 2: slow = 30, fast = 50. Now fast is on the last node (its next is None), so it cannot take another full double step and we stop. Slow is at 30, the middle, found in one sweep without first counting the length. The even-length pitfall is that fast advances two at a time, so on a list with an even count fast can run right off the end and try to step through a None. You must guard the double step by checking that both fast and the node after fast exist before advancing fast by two; otherwise you dereference an end-of-list link and the code breaks.`,
    tags: ['linked-list', 'two-pointers', 'tracing'],
  },
  {
    id: 'ds-ch06-t-011',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'What the Dummy Head Buys You',
    prompt: `Merging two sorted lists is usually written with a "dummy head" (a throwaway sentinel node placed before the real first result node). Without the dummy, each iteration must ask "is the result still empty? if so this becomes the head, otherwise link it onto the tail." Explain precisely how adding the dummy node removes that special case, and what you must return at the end (and what you must NOT return).`,
    hints: [
      'Think about what the tail pointer points at on the very first attachment, with and without the dummy.',
      'The dummy is scaffolding; the real list begins one node past it.',
    ],
    solution: `Without a dummy, the result starts empty, so the first node you attach has nowhere to hang from: the tail pointer has nothing real to point at, forcing the "if empty, set the head; else append to tail" branch on every loop. The dummy head removes that branch because the result is never empty: there is always a real node (the dummy) for the tail to point at, so the very first attachment is just "dummy.next = chosen node," identical to every later attachment. Each iteration becomes the same uniform step. At the end you return dummy.next, which is the true first node of the merged list. You must NOT return the dummy itself; it is only scaffolding, and the real list starts one node later. The whole merge is O(n + m) time and O(1) extra space, since nodes are re-linked rather than copied.`,
    tags: ['linked-list', 'merge', 'dummy-head'],
  },
  {
    id: 'ds-ch06-t-012',
    chapter: 6,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Pick the Right Linking Tool',
    prompt: `You have three jobs. (A) Build a browser-history structure where each page links to both the previous and the next page. (B) Store a graph-like structure of many nodes for an interview problem where pointers may point backward and you want speed and simplicity. (C) Decide whether to default to std::collections::LinkedList just because the topic is "linked lists." For each job, say which tool the note recommends (a single Box chain, Rc/RefCell with Weak, std LinkedList, or a Vec arena of indices) and give the one-sentence reason.`,
    hints: [
      'A backward pointer means a node is co-owned, which a plain Box forbids.',
      'For most real and interview code the note pushes you away from both Box-only and std LinkedList toward something cache-friendly.',
    ],
    solution: `(A) Browser history (both prev and next links): use Rc<RefCell<Node>> with the backward links as Weak, because a node co-owned from two sides cannot use a plain Box, and making the back-links Weak keeps the reference count able to reach zero so a prev/next cycle does not leak memory. (B) The interview graph/list with back-pointers: use a Vec arena where every link is a usize index (with usize::MAX as the "null" sentinel), because plain integers do not fight the borrow checker, back-pointers and cycles are just more indices, and the data is contiguous and cache-friendly (just remember usize cannot go negative, so guard any subtraction). (C) Do NOT default to std::collections::LinkedList: a Vec almost always wins on real inputs because its contiguous memory is cache-friendly while a linked list's scattered nodes cause cache misses that dwarf the theoretical O(1) insert; reach for std LinkedList only in the rare case you truly need O(1) splicing of large sublists.`,
    tags: ['linked-list', 'rc-refcell', 'arena'],
  },
]

export default problems
