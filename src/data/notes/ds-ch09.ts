import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-ds-09',
  track: 'dsa',
  chapter: 9,
  title: 'Heap / Priority Queue',
  summary: `A queue at a bank hands people out in the order they arrived: first come, first served. But a hospital emergency room cannot work that way, the patient with the heart attack must be seen before the one with a sprained ankle, no matter who arrived first. A **priority queue** is the data structure for exactly that situation: you keep throwing items in with a priority attached, and every time you ask for one back you get the most important one available, fast.

The workhorse behind a priority queue is the **binary heap**, a beautifully simple idea: a tree that is almost completely full, packed into a plain array, where every parent is at least as important as its children. That single rule, called the heap property, is enough to give you the most-important item instantly and to insert or remove items in logarithmic time.

In this chapter you will build the heap from the array up, deriving the parent-and-child index arithmetic by hand and watching sift-up and sift-down restore order frame by frame. Then you will meet Rust's std::collections::BinaryHeap, learn the one gotcha that trips up every newcomer (it is a MAX-heap, so a min-heap needs std::cmp::Reverse), and apply it to the greatest hits: top-K, merging K sorted lists, heap sort, a running median with two heaps, and a first look at how Dijkstra's GPS shortest-path algorithm leans on a priority queue.`,
  sections: [
    {
      heading: 'Why a priority queue: serving the most important item first',
      body: `Picture an operating-system **task scheduler**. Dozens of processes want the CPU, and each has a priority number. The scheduler's whole job is to repeatedly ask "of everything waiting right now, who is most important?" and run that one next. New processes arrive at any time and must slot into the right place. A plain queue (first-in-first-out) is useless here, because arrival order is not the order we want; a stack (last-in-first-out) is no better.

What we want is an **abstract data type** called a **priority queue**. An abstract data type is a description of *what operations a thing supports*, separate from *how* it is built. A priority queue supports three core operations:

- **push** (also called insert): add an item with a priority.
- **peek** (also called top): look at the most-important item without removing it.
- **pop** (also called extract-max or extract-min): remove and return the most-important item.

The same shape shows up everywhere once you learn to see it: **ER triage** (sickest patient first), an **event-driven simulation** (process the next event in time order), a **"top 10 trending" feed** (keep only the most popular items), and the GPS routing we will meet at the end (always expand the nearest unvisited place first).

The naive way to build this is to keep all items in an unsorted list. Push is then trivially O(1), just append. But peek and pop must scan the entire list to find the most important item, which is O(n) every single time. That is the *for every removal we re-scan all the others* problem, and on a stream of n items it balloons to n squared total work. Keeping the list fully sorted instead flips the cost: pop becomes O(1) but every push must find the right slot and shift, which is O(n). The binary heap, the subject of this chapter, gives the best balanced deal: push and pop are both **O(log n)**, peek is **O(1)**.

### Common pitfalls

- Confusing a priority queue (the *interface*) with a binary heap (one *implementation* of it). A priority queue could also be built from a balanced search tree; the heap is just the most common and usually fastest choice.
- Assuming a priority queue keeps everything fully sorted. It does not. It only guarantees fast access to the single most-important item. Iterating a heap does NOT visit items in priority order.`,
      code: [
        {
          lang: 'text',
          src: `Three ways to back a priority queue, and what each costs:

                          push        peek        pop
  unsorted list   :       O(1)        O(n)        O(n)
  sorted list     :       O(n)        O(1)        O(1)
  BINARY HEAP     :     O(log n)      O(1)      O(log n)   <-- balanced

The heap wins because no single operation is ever linear.
On a stream of n pushes and n pops:
   unsorted/sorted  ->  about n*n  work   (slow)
   binary heap      ->  about n*log n work (fast)`
        },
        {
          lang: 'rust',
          src: `// The priority-queue INTERFACE, expressed as a trait so you can see the
// three core operations. We will implement it with a binary heap next.
trait PriorityQueue<T> {
    fn push(&mut self, item: T);   // add an item
    fn peek(&self) -> Option<&T>;  // look at the most-important item
    fn pop(&mut self) -> Option<T>; // remove and return the most-important
}

// The naive "unsorted Vec" version: correct, but pop is O(n).
struct SlowPQ<T: Ord> { items: Vec<T> }

impl<T: Ord> PriorityQueue<T> for SlowPQ<T> {
    fn push(&mut self, item: T) { self.items.push(item); } // O(1)
    fn peek(&self) -> Option<&T> { self.items.iter().max() } // O(n) scan
    fn pop(&mut self) -> Option<T> {
        // find index of the max, then swap_remove it. O(n) every call.
        let i = (0..self.items.len()).max_by_key(|&i| &self.items[i])?;
        Some(self.items.swap_remove(i))
    }
}`
        }
      ]
    },
    {
      heading: 'The binary heap: a complete tree squashed into an array',
      body: `A **binary heap** is a binary tree (each node has at most two children) with two defining properties.

First, it is a **complete binary tree**: every level is completely filled except possibly the last, and the last level is filled from left to right with no gaps. This "no gaps" rule is what lets us store the tree in a flat array with zero wasted space and no pointers.

Second, it obeys the **heap property**. In a **max-heap**, every parent is greater than or equal to both of its children, so the maximum bubbles up to the root. In a **min-heap**, every parent is less than or equal to its children, so the minimum sits at the root. Notice the heap property is *local*: it only relates each node to its direct children, not to cousins or uncles. That looseness is exactly why heaps are cheap to maintain, you only ever fix a single root-to-leaf path, never the whole tree.

The magic trick is the **array layout**. Because the tree is complete, we can read it level by level, left to right, and write the nodes into an array in that order. No left-pointer or right-pointer fields are needed. The root is at index 0, its children at 1 and 2, the next level at 3, 4, 5, 6, and so on. An **invariant** (a fact that stays true throughout) is that the array is always a contiguous prefix with no holes, which mirrors the complete-tree shape.

This array view is why a heap is so memory-friendly: it is just a Vec, so it sits in one cache-friendly block of memory, unlike a pointer-based tree scattered across the heap (the memory region, confusingly also called "the heap", do not mix the two ideas up).

### Common pitfalls

- Believing a heap is a **sorted** array. It is not. The only guarantee is parent-versus-child; siblings can be in any order, and reading the array left to right is NOT priority order.
- Forgetting the *complete* requirement. If you delete an arbitrary middle node and leave a gap, the array index arithmetic in the next section breaks. Heaps only ever remove the root or add at the very end, precisely to keep the tree complete.`,
      code: [
        {
          lang: 'text',
          src: `Same max-heap, drawn as a tree and stored as an array.

  Tree view:                 Array view (level order, left to right):

            9                  index:  0   1   2   3   4   5   6
          /   \\               value:  9   7   8   5   6   2   3
         7     8
        / \\   / \\             Root (the max) is always at index 0.
       5   6 2   3            Each parent >= its two children:
                                9>=7,9>=8   7>=5,7>=6   8>=2,8>=3  OK

Reading the array left to right (9 7 8 5 6 2 3) is NOT sorted!
The heap only promises: parent is bigger than its children.`
        }
      ]
    },
    {
      heading: 'Parent and child index arithmetic: 2i+1 and 2i+2',
      body: `Here is the payoff of the array layout: we can walk between a node and its relatives using pure arithmetic, no stored pointers. With **0-based indexing** (Rust arrays start at 0), for a node sitting at index i:

- its **left child** is at index **2*i + 1**,
- its **right child** is at index **2*i + 2**,
- its **parent** is at index **(i - 1) / 2** (integer division, which throws away the remainder).

Let us *derive* this rather than memorize it. Level 0 holds 1 node (index 0). Level 1 holds 2 nodes (indices 1, 2). Level 2 holds 4 nodes (indices 3, 4, 5, 6). Each level doubles. If you write out the indices and stare at any node and its children, the doubling pattern produces exactly 2*i+1 and 2*i+2. The parent formula is just the inverse: undo the doubling and shift.

A child index might point **past the end** of the array, that simply means the child does not exist (the node is a leaf). So every access must be guarded by a length check. In Rust there is a sharp extra trap here: array indices have type **usize**, an unsigned integer that **cannot be negative**. The parent of the root would be (0 - 1) / 2, but 0 - 1 underflows usize and panics (in debug) or wraps to a gigantic number (in release). Always special-case the root, or compute the parent only when i is greater than 0.

### Common pitfalls

- Using **1-based** formulas (left = 2*i, right = 2*i+1, parent = i/2) by accident. Those are correct only if you waste index 0 and start the heap at index 1. Mixing 0-based storage with 1-based formulas silently corrupts the heap. Pick 0-based and stick to 2*i+1 / 2*i+2.
- The usize underflow on parent(0). Never compute (i - 1) / 2 when i is 0; guard with if i > 0 first.
- Forgetting to bounds-check children against self.data.len() before indexing, which would panic on a leaf.`,
      code: [
        {
          lang: 'text',
          src: `Index map for a heap of 7 elements (0-based):

   index:    0       1   2       3  4  5  6
            root    children    grandchildren

   parent of i  = (i-1)/2     (only when i > 0)
   left  of i   = 2*i + 1
   right of i   = 2*i + 2

  Worked examples:
    i=0 -> left=1, right=2,  parent= (none, it is the root)
    i=1 -> left=3, right=4,  parent=(1-1)/2 = 0
    i=2 -> left=5, right=6,  parent=(2-1)/2 = 0
    i=3 -> left=7 (>= len -> no left child), parent=(3-1)/2 = 1`
        },
        {
          lang: 'rust',
          src: `// Tiny helpers that turn the arithmetic into named, safe functions.
fn left(i: usize) -> usize { 2 * i + 1 }
fn right(i: usize) -> usize { 2 * i + 2 }

// parent returns Option because the root (i == 0) has no parent.
// This sidesteps the usize underflow trap entirely.
fn parent(i: usize) -> Option<usize> {
    if i == 0 { None } else { Some((i - 1) / 2) }
}

fn main() {
    assert_eq!(left(0), 1);
    assert_eq!(right(0), 2);
    assert_eq!(parent(1), Some(0));
    assert_eq!(parent(2), Some(0));
    assert_eq!(parent(0), None);     // root: no parent, no panic
    // A child index can exceed the array length -> that child is absent.
    let len = 7;
    assert!(left(3) >= len);          // index 7 does not exist: node 3 is a leaf
}`
        }
      ]
    },
    {
      heading: 'Push and sift-up: bubble the newcomer to its level',
      body: `To **push** a new item we keep the tree complete by always adding at the only spot that preserves completeness: the **end of the array** (the next free leaf, left to right). But the newcomer may be larger than its parent, breaking the heap property. We fix it with **sift-up** (also called bubble-up or swim): compare the new node with its parent, and if it is bigger, swap them; repeat from the new position. The item climbs toward the root until either it is no bigger than its parent or it reaches the root.

Why is this correct and fast? Each swap moves the item up one level, and a complete tree of n nodes has only about **log2(n)** levels (because each level doubles the node count). So sift-up does at most log n swaps: push is **O(log n)** time, **O(1)** extra space. The animation below traces inserting 10 into a max-heap, frame by frame, the closest thing to watching it move.

A subtle but important guarantee: we only ever compare the rising node with its *parent*, never its sibling. We do not need to, because before the push every parent already dominated both its children, so once our climber settles below a parent that is at least as big, the whole subtree is valid again.

### Common pitfalls

- Sifting up by comparing against a **child** or **sibling** instead of the **parent**. Up-movement only ever looks at the parent.
- Stopping too early or too late: keep swapping **while** i > 0 AND data[i] is greater than data[parent]. The moment the parent wins, stop, the rest of the path above is already ordered.
- Inserting somewhere other than the end "to save a swap". Inserting anywhere but the next leaf breaks completeness and corrupts the index math.`,
      code: [
        {
          lang: 'text',
          src: `push(10) into max-heap [9,7,8,5,6]. Add at end, then sift up.

 FRAME 0: append 10 at idx 5.    FRAME 1: 10 > parent 8? yes -> swap
        9                                  9
       / \\                                / \\
      7   8                              7   10
     / \\  / <-10 (idx 5)              / \\  / \\
    5   6                              5   6 8      (10 climbs to idx 2)

 FRAME 2: 10 > parent 9? yes      FRAME 3: idx 0 reached -> STOP
   -> swap
        10                                 10     heap property restored
       / \\                                / \\    array: [10,7,9,5,6,8]
      7   9                              7   9    2 swaps = tree height
     / \\  / \\                          / \\  / \\
    5   6 8                            5   6 8`
        },
        {
          lang: 'rust',
          src: `struct MaxHeap { data: Vec<i32> }

impl MaxHeap {
    fn new() -> Self { MaxHeap { data: Vec::new() } }

    // O(log n): append at the end, then let it climb.
    fn push(&mut self, value: i32) {
        self.data.push(value);          // add at the next free leaf
        self.sift_up(self.data.len() - 1);
    }

    fn sift_up(&mut self, mut i: usize) {
        // Climb while we have a parent that is smaller than us.
        while i > 0 {
            let p = (i - 1) / 2;        // parent index (i > 0, so no underflow)
            if self.data[i] <= self.data[p] { break; } // parent wins: done
            self.data.swap(i, p);       // newcomer is bigger: swap up
            i = p;                      // continue from the parent's slot
        }
    }
}

fn main() {
    let mut h = MaxHeap::new();
    for v in [9, 7, 8, 5, 6, 10] { h.push(v); }
    assert_eq!(h.data[0], 10);          // the max sits at the root
}`
        }
      ]
    },
    {
      heading: 'Pop and sift-down: promote the last leaf, then sink it',
      anim: 'heap-siftdown',
      body: `To **pop** the most-important item we remove the root (index 0). But we cannot leave a hole there. The trick: take the **last leaf** (the final array element), move it to the root, and shrink the array by one. The tree is complete again, but the root is now probably too small, so we **sift-down** (also called bubble-down or sink): compare the node with its children, swap it with the **larger** child (for a max-heap), and repeat until both children are smaller or it becomes a leaf.

The critical detail is "swap with the **larger** child". If you swapped with the smaller child, that smaller value would become the new parent of the larger one, instantly re-breaking the heap property. You must promote the bigger of the two children so the new parent dominates both subtrees.

Like sift-up, sift-down walks one root-to-leaf path, so pop is **O(log n)** time and **O(1)** space. peek is just reading index 0, which is **O(1)**. The trace below pops the max from [10,7,9,5,6,8] step by step.

### Common pitfalls

- Swapping with the **smaller** child. Always pick the larger child (max-heap) or smaller child (min-heap), otherwise you re-violate the heap property on the very next level.
- Forgetting to **bounds-check** both children. The right child may not exist; index it without checking and Rust panics. Compute the larger *existing* child.
- Filling the root hole by shifting every element left. That is O(n) and destroys the shape. The whole point is to move only the **last** leaf up and sink it, touching just one path.
- Reading peek as "sorted second element". data[1] is NOT the second-largest in general; it is merely the larger child of the root.`,
      code: [
        {
          lang: 'text',
          src: `pop() from max-heap [10,7,9,5,6,8]. Return 10, sink last leaf 8.

 FRAME 0: save root 10. Move last  FRAME 1: at idx 0, children 7,9.
   leaf 8 to root, shrink len.        larger child = 9. 8<9 -> swap
        8                                    9
       / \\                                  / \\
      7   9                                7   8     (8 sinks to idx 2)
     / \\                                  / \\
    5   6                                5   6

 FRAME 2: at idx 2 both children   RESULT: returned 10.
   are past end -> 8 is a leaf       array now [9,7,8,5,6], valid.
   now -> STOP.                      1 swap, at most O(log n).`
        },
        {
          lang: 'rust',
          src: `impl MaxHeap {
    fn peek(&self) -> Option<&i32> { self.data.first() } // O(1)

    // O(log n): swap root with last leaf, pop it, sink the new root.
    fn pop(&mut self) -> Option<i32> {
        let n = self.data.len();
        if n == 0 { return None; }
        self.data.swap(0, n - 1);          // move max to the end
        let max = self.data.pop();         // remove it in O(1)
        if !self.data.is_empty() { self.sift_down(0); }
        max
    }

    fn sift_down(&mut self, mut i: usize) {
        let n = self.data.len();
        loop {
            let (l, r) = (2 * i + 1, 2 * i + 2);
            let mut largest = i;
            // Pick the largest among node and its EXISTING children.
            if l < n && self.data[l] > self.data[largest] { largest = l; }
            if r < n && self.data[r] > self.data[largest] { largest = r; }
            if largest == i { break; }     // both children smaller: settled
            self.data.swap(i, largest);    // promote the larger child
            i = largest;                   // keep sinking from there
        }
    }
}`
        }
      ]
    },
    {
      heading: 'std::collections::BinaryHeap and the MAX-heap / Reverse gotcha',
      body: `You almost never hand-roll a heap in real Rust; the standard library ships a fast, well-tested one: **std::collections::BinaryHeap**. The methods map straight onto what we built: **push** to insert, **pop** to remove the most-important item, and **peek** to look without removing. Internally it is exactly the array-backed binary heap from the previous sections.

Here is **the gotcha that catches every Rust beginner**: BinaryHeap is a **MAX-heap**. pop always returns the **largest** element by Rust's ordering (the Ord trait). If you want a **min-heap**, the "smallest first" behavior you need for Dijkstra or for a top-K-largest filter, you must flip the comparison. The cleanest way is to wrap each value in **std::cmp::Reverse**, a one-field tuple struct that reverses ordering: the largest Reverse(x) is the one with the smallest x, so the max-heap now serves smallest-first. Remember to unwrap the .0 field when you read items back out.

For your own types, you control priority by implementing **Ord** (and its companions PartialOrd, Eq, PartialEq), or by reaching for Reverse on a key. A common pattern is to push a tuple like (priority, payload): tuples compare lexicographically, first field first, so the heap orders by priority automatically.

### Common pitfalls

- **Forgetting BinaryHeap is a max-heap** and getting largest-first when you wanted smallest-first. Reach for std::cmp::Reverse (or a custom Ord) to invert it.
- Trying to heapify floats (**f64**) directly. f64 is only PartialOrd, not Ord (because NaN is unorderable), so BinaryHeap of f64 will not compile. Wrap in ordered-float, or map to an integer key, or use a newtype with a total order.
- Expecting **into_iter** or **iter** to yield items in sorted order. They do not, they yield arbitrary heap-array order. Use into_sorted_vec, or pop repeatedly, to get sorted output.
- Forgetting to unwrap the **.0** of a Reverse when reading values back.`,
      code: [
        {
          lang: 'rust',
          src: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn main() {
    // MAX-heap (the default): pop yields the LARGEST first.
    let mut max_h = BinaryHeap::new();
    for v in [3, 1, 4, 1, 5, 9, 2] { max_h.push(v); }
    assert_eq!(max_h.peek(), Some(&9));     // peek is O(1)
    assert_eq!(max_h.pop(), Some(9));       // largest out first
    assert_eq!(max_h.pop(), Some(5));       // each pop is O(log n)

    // MIN-heap via Reverse: pop yields the SMALLEST first.
    let mut min_h = BinaryHeap::new();
    for v in [3, 1, 4, 1, 5] { min_h.push(Reverse(v)); }
    assert_eq!(min_h.pop(), Some(Reverse(1))); // smallest first
    let Reverse(x) = min_h.pop().unwrap();     // unwrap the .0
    assert_eq!(x, 1);

    // Order by a custom priority: push (priority, task) tuples.
    let mut tasks = BinaryHeap::new();        // OS scheduler style
    tasks.push((5, "render frame"));
    tasks.push((9, "handle keypress"));       // higher priority
    tasks.push((1, "log to disk"));
    assert_eq!(tasks.pop().unwrap().1, "handle keypress"); // priority 9 wins
}`
        },
        {
          lang: 'text',
          src: `One mental model for the Reverse trick:

   values:   1   3   4   5        a MAX-heap pops biggest first: 5,4,3,1
   wrapped: R(1) R(3) R(4) R(5)   Reverse flips the < direction, so the
                                  "biggest" wrapped item is R(1).
   -> popping the max-heap of R(..) gives R(1),R(3),R(4),R(5)
   -> i.e. 1,3,4,5 : smallest first = a MIN-heap. Unwrap .0 to read.`
        }
      ]
    },
    {
      heading: 'Top-K and Kth-largest: a size-K heap beats sorting',
      body: `Suppose a "top 10 trending" feed streams millions of view counts and you want the **10 largest**. The obvious approach is to collect everything, sort descending, and take the first 10: that is **O(n log n)** time and, worse, **O(n) memory** to hold every item, impossible if the stream is huge or unbounded.

The heap insight: to keep the **K largest** of a stream you only ever need a **size-K MIN-heap**. The heap holds the current best K, and its root is the *smallest* of those K, the weakest survivor. For each new item, if it beats that weakest survivor, evict the root and push the newcomer; otherwise ignore it. The heap never exceeds size K, so memory is **O(K)** (tiny and constant), and each of the n items costs O(log K), giving **O(n log K)** total, far better than sorting when K is small.

The same machine answers **"what is the Kth largest element?"**, a classic interview question: run the size-K min-heap over the array, and at the end the root is the Kth largest (it is the smallest of the top K). The reason we use a *min*-heap to find the *largest* items feels backwards at first, but it is exactly right: the min-heap lets us cheaply discard anything that cannot crack the top K by comparing only against the current weakest.

### Common pitfalls

- Using a **max-heap** of all n items for top-K. That is O(n) memory and O(n + K log n) time; the size-K **min-heap** is O(K) memory and O(n log K) time. Smaller and faster for the streaming case.
- Off-by-one on K: a size-K min-heap's root is the Kth largest, NOT the K-plus-1th. Keep the heap at exactly K elements.
- Reaching for Reverse the wrong way. To keep the K *largest*, you want a *min*-heap (smallest at the root so it is cheap to evict), so wrap values in Reverse.
- Returning the heap's items as "the sorted top-K". They come out in heap order; pop them all (or call into_sorted_vec) if you need them ordered.`,
      code: [
        {
          lang: 'text',
          src: `Stream 5,1,9,3,7,2 ; keep TOP-3 in a size-3 MIN-heap (root=weakest).

  see 5: heap {5}              (not full yet, just add)
  see 1: heap {1,5}            (add)
  see 9: heap {1,5,9}          (full; root=1 is the weakest of the 3)
  see 3: 3 > root 1? yes -> pop 1, push 3 -> {3,5,9}
  see 7: 7 > root 3? yes -> pop 3, push 7 -> {5,7,9}
  see 2: 2 > root 5? no  -> ignore
  -------------------------------------------------
  final top-3 = {5,7,9}.  root 5 = the 3rd-largest overall.
  Memory stayed at 3 the whole time, regardless of stream length.`
        },
        {
          lang: 'rust',
          src: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

// Keep the K largest items of any iterator using O(K) memory.
fn top_k(nums: &[i32], k: usize) -> Vec<i32> {
    let mut heap = BinaryHeap::new();          // min-heap via Reverse
    for &n in nums {
        heap.push(Reverse(n));
        if heap.len() > k {
            heap.pop();                        // drop the current weakest
        }
    }
    // Unwrap the Reverse wrappers back into plain i32s.
    heap.into_iter().map(|Reverse(n)| n).collect()
}

// The Kth largest is just the smallest survivor in that size-K heap.
fn kth_largest(nums: &[i32], k: usize) -> i32 {
    let mut heap = BinaryHeap::new();
    for &n in nums {
        heap.push(Reverse(n));
        if heap.len() > k { heap.pop(); }
    }
    heap.peek().map(|Reverse(n)| *n).unwrap()  // root = Kth largest
}

fn main() {
    let v = [5, 1, 9, 3, 7, 2];
    let mut top = top_k(&v, 3);
    top.sort();
    assert_eq!(top, [5, 7, 9]);
    assert_eq!(kth_largest(&v, 3), 5);         // 3rd largest is 5
}`
        }
      ]
    },
    {
      heading: 'Merging K sorted lists and heap sort',
      body: `**Merging K sorted lists** is the heart of an external sort (sorting more data than fits in memory, by sorting chunks then merging them). Say you have K already-sorted lists and want one combined sorted output. Comparing the fronts of all K lists by hand each step is O(K) per element, O(N*K) overall for N total items. A **min-heap of the K current front elements** drops that to O(N log K): the heap instantly tells you the smallest front, you emit it, then push the next element from whichever list it came from. We track which list each heap entry belongs to with a small tuple (value, list-index, element-index).

**Heap sort** turns the heap into a full sorting algorithm. Push all n elements into a heap (O(n log n)), then pop them one at a time; because each pop yields the current extreme, the items come out in sorted order. Total time is **O(n log n)** with **O(1)** extra space if you heapify the array in place. Heap sort's headline virtue is a guaranteed n log n worst case (quicksort can degrade to n squared) and no extra memory; its drawback is poor cache behavior from the jumpy parent-child index hops, so in practice quicksort or Rust's pattern-defeating sort is usually faster on real hardware. In Rust the easy version is: feed everything into a BinaryHeap and call **into_sorted_vec**, which pops internally for you.

### Common pitfalls

- Using a max-heap for the K-way merge when you want ascending output. You need a **min-heap** (smallest front first); wrap in Reverse.
- Forgetting to record **which list** a popped value came from. Without the list index you cannot know which list to advance, store (value, list_idx, pos) in the heap.
- Expecting BinaryHeap's **into_iter** to be sorted for heap sort. Use **into_sorted_vec** (ascending) instead; plain iteration is heap-array order.
- Re-heapifying from scratch after each pop. Don't; a single sift-down per pop is all that is needed, which is what BinaryHeap already does.`,
      code: [
        {
          lang: 'text',
          src: `Merge 3 sorted lists with a min-heap of their fronts (value, list#):

  L0: [1, 4, 7]   L1: [2, 5]   L2: [3, 6]

  heap (mins of each front):  (1,L0) (2,L1) (3,L2)
  pop (1,L0) -> out:[1]   ; push next of L0 = 4 -> heap {2,3,4}
  pop (2,L1) -> out:[1,2] ; push next of L1 = 5 -> heap {3,4,5}
  pop (3,L2) -> out:[1,2,3]; push next of L2 = 6 -> heap {4,5,6}
  pop (4,L0) -> out:..4    ; push 7              -> heap {5,6,7}
  pop (5,L1) -> out:..5    ; L1 empty, push nothing
  pop (6,L2) -> ..6 ; pop (7,L0) -> ..7
  result: 1 2 3 4 5 6 7      (each step picks the global smallest front)`
        },
        {
          lang: 'rust',
          src: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

// Merge K sorted lists into one sorted Vec. O(N log K).
fn merge_k(lists: Vec<Vec<i32>>) -> Vec<i32> {
    // Heap entries: (value, list_index, pos_in_list), min-heap via Reverse.
    let mut heap = BinaryHeap::new();
    for (li, list) in lists.iter().enumerate() {
        if let Some(&v) = list.first() {
            heap.push(Reverse((v, li, 0usize)));
        }
    }
    let mut out = Vec::new();
    while let Some(Reverse((v, li, pos))) = heap.pop() {
        out.push(v);                          // smallest current front
        if let Some(&nv) = lists[li].get(pos + 1) {
            heap.push(Reverse((nv, li, pos + 1))); // advance that list
        }
    }
    out
}

// Heap sort in one line via the standard library.
fn heap_sort(v: Vec<i32>) -> Vec<i32> {
    let heap: BinaryHeap<i32> = v.into_iter().collect(); // O(n) build
    heap.into_sorted_vec()                    // pops internally -> ascending
}

fn main() {
    let m = merge_k(vec![vec![1,4,7], vec![2,5], vec![3,6]]);
    assert_eq!(m, [1,2,3,4,5,6,7]);
    assert_eq!(heap_sort(vec![5,3,8,1,9,2]), [1,2,3,5,8,9]);
}`
        }
      ]
    },
    {
      heading: 'Two heaps for a running median, and a Dijkstra preview',
      body: `**Running median.** As numbers stream in (think live sensor readings or latency samples), you want the median at every step. Re-sorting after each arrival is O(n log n) per query, far too slow. The elegant trick uses **two heaps** that split the data at the middle:

- a **max-heap** holding the smaller half (so its root is the largest of the small half), and
- a **min-heap** holding the larger half (so its root is the smallest of the large half).

Keep the two halves balanced in size (differ by at most one). Then the median is the max-heap's root when sizes differ, or the average of the two roots when sizes are equal. Each insertion is O(log n): place the new value in the correct half, then **rebalance** by moving one root across if a half got too big. Querying the median is O(1), just peek the roots.

**Dijkstra preview.** A GPS finding the shortest route is the showcase application. Dijkstra's algorithm keeps a **min-priority-queue** of (distance-so-far, node) pairs. It repeatedly pops the **closest** unsettled node, then relaxes its neighbors (if going through this node gives a shorter path, push the improved distance). Using a binary heap, each edge causes at most one push, giving the famous **O((V + E) log V)** running time, where V is the number of places and E the number of roads. The reason it needs a *min*-heap is intuitive: always expand the nearest frontier node first, so the first time you pop a node you already have its true shortest distance. We will build the full algorithm in the graphs chapter; for now, recognize the priority queue at its core.

### Common pitfalls

- Letting the two heaps drift out of balance. After every insert, rebalance so the sizes differ by at most one, otherwise the roots no longer straddle the true median.
- Putting the new value in the wrong half. Compare against the max-heap's root first; smaller-or-equal goes to the max-heap (smaller half), larger goes to the min-heap.
- For Dijkstra, expecting BinaryHeap to support **decrease-key**. Rust's BinaryHeap has no decrease-key; the idiomatic workaround is the **lazy-deletion** trick, push the improved (smaller) distance as a new entry and skip any popped entry whose distance is stale (larger than the best already recorded).
- Reaching for a max-heap in Dijkstra. It needs the *closest* node, so use a min-heap via Reverse.`,
      code: [
        {
          lang: 'text',
          src: `Running median of stream 5, 2, 8, 1 with two heaps.

  small-half = MAX-heap (root = biggest small),
  large-half = MIN-heap (root = smallest large).

  add 5: small{5}                       median = 5
  add 2: 2<=root5 -> small{5,2}; sizes (2,0) unbalanced
         -> move root 5 to large: small{2} large{5}, median=(2+5)/2=3.5
  add 8: 8>root2 -> large{5,8}; sizes(1,2) unbalanced
         -> move root5 to small: small{2,5} large{8}, median=5
  add 1: 1<=root5 -> small{5,2,1}; sizes(3,1) unbalanced
         -> move root5 to large: small{2,1} large{5,8}
            median=(2+5)/2=3.5`
        },
        {
          lang: 'rust',
          src: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

struct MedianFinder {
    small: BinaryHeap<i32>,          // max-heap: smaller half
    large: BinaryHeap<Reverse<i32>>, // min-heap: larger half
}

impl MedianFinder {
    fn new() -> Self {
        MedianFinder { small: BinaryHeap::new(), large: BinaryHeap::new() }
    }
    fn add(&mut self, x: i32) {
        // Route into the correct half...
        if self.small.peek().map_or(true, |&top| x <= top) {
            self.small.push(x);
        } else {
            self.large.push(Reverse(x));
        }
        // ...then rebalance so sizes differ by at most one.
        if self.small.len() > self.large.len() + 1 {
            let m = self.small.pop().unwrap();
            self.large.push(Reverse(m));
        } else if self.large.len() > self.small.len() {
            let Reverse(m) = self.large.pop().unwrap();
            self.small.push(m);
        }
    }
    fn median(&self) -> f64 {
        let s = *self.small.peek().unwrap();
        if self.small.len() == self.large.len() {
            let Reverse(l) = *self.large.peek().unwrap();
            (s as f64 + l as f64) / 2.0
        } else {
            s as f64                 // small holds the extra element
        }
    }
}

fn main() {
    let mut mf = MedianFinder::new();
    for x in [5, 2, 8, 1] { mf.add(x); }
    assert_eq!(mf.median(), 3.5);
}`
        }
      ]
    }
  ],
  takeaways: [
    'A priority queue always hands back the most-important item next; a binary heap is its fast, array-backed implementation with push and pop in O(log n) and peek in O(1).',
    'A heap is a complete binary tree obeying the local heap property (parent dominates its children) stored in a flat Vec, so it needs no pointers and stays cache-friendly.',
    'Index arithmetic (0-based): left = 2*i+1, right = 2*i+2, parent = (i-1)/2; guard parent(0) because usize cannot go negative.',
    'push appends at the end then sift-up (compare with parent, swap while bigger); pop swaps root with the last leaf, removes it, then sift-down (swap with the LARGER child).',
    'std::collections::BinaryHeap is a MAX-heap: pop returns the largest. For a min-heap wrap items in std::cmp::Reverse or implement a custom Ord.',
    'A size-K MIN-heap keeps the K largest of a stream in O(K) memory and O(n log K) time; its root is the Kth largest, far cheaper than sorting everything.',
    'Merging K sorted lists with a min-heap of the K fronts is O(N log K); heap sort is a guaranteed O(n log n), O(1)-space sort via into_sorted_vec.',
    'A running median uses two balanced heaps (max-heap for the small half, min-heap for the large half): O(log n) insert, O(1) query at the roots.',
    'Dijkstra shortest-path uses a min-priority-queue to always expand the nearest node; Rust has no decrease-key, so push improved distances and skip stale popped entries.',
    'f64 is only PartialOrd (NaN is unorderable), so a BinaryHeap of f64 will not compile; iterating a heap is NOT sorted, use into_sorted_vec or repeated pops.'
  ],
  cheatsheet: [
    { label: 'BinaryHeap::new()', value: 'empty MAX-heap (pop returns the largest)' },
    { label: 'heap.push(x)', value: 'insert; O(log n)' },
    { label: 'heap.pop()', value: 'remove and return the max (or min via Reverse); O(log n)' },
    { label: 'heap.peek()', value: 'look at the most-important item without removing; O(1)' },
    { label: 'std::cmp::Reverse(x)', value: 'wrap to turn the max-heap into a MIN-heap' },
    { label: 'heap.into_sorted_vec()', value: 'ascending Vec via internal pops; O(n log n)' },
    { label: 'left/right of i', value: '2*i+1 and 2*i+2 (0-based)' },
    { label: 'parent of i', value: '(i-1)/2; never call on i==0 (usize underflow)' },
    { label: 'sift_up (push)', value: 'swap with parent while bigger; climbs O(log n)' },
    { label: 'sift_down (pop)', value: 'swap with the LARGER child until settled; O(log n)' },
    { label: 'Top-K largest', value: 'size-K min-heap; O(K) space, O(n log K) time' },
    { label: 'Merge K sorted lists', value: 'min-heap of K fronts; O(N log K)' },
    { label: 'Running median', value: 'max-heap (small half) + min-heap (large half); O(log n) add' },
    { label: 'Dijkstra PQ', value: 'min-heap of (dist,node); O((V+E) log V), no decrease-key' }
  ]
}

export default note
