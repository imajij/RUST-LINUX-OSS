import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-ds-06',
  track: 'dsa',
  chapter: 6,
  title: 'Linked List',
  summary: `A linked list is the simplest data structure built out of pointers, and it is the gateway to every tree, graph, and heap you will ever write. Instead of storing items side by side in one block of memory like an array does, a linked list scatters them across the heap and threads them together with pointers: each item, called a node, holds its value plus the address of the next node. That single design choice flips the trade-offs of an array on its head. Inserting or deleting at a spot you already hold becomes a constant-time pointer swap, but jumping to "the millionth item" now costs a full walk from the front.

Linked lists are also Rust's most famous teaching pain. A list wants many things pointing at one node, and Rust's whole identity is built on the opposite idea: one owner per value. This chapter shows you the idiomatic Rust answer, the singly linked list as Option<Box<Node>>, then walks through building, traversing, reversing, the fast/slow runner trick for cycles and middles, and merging sorted lists with a dummy head. We finish with an honest map of when to reach for Rc<RefCell<Node>>, when std::collections::LinkedList is (rarely) right, and why a Vec-backed arena of indices is usually the cleanest answer of all.`,
  sections: [
    {
      heading: 'Nodes and pointers: boxes and arrows',
      body: `Picture a freight train. Each car carries cargo and is coupled to exactly one car behind it; the locomotive knows only the first car, and to reach the caboose you walk car to car. A **linked list** is exactly that train in memory. A **node** is one car: a small struct holding a *value* (the cargo) and a *link* (the coupler) that stores where the next node lives. A **pointer** is that link, an address, a sticky note that says "the next thing is over there."

Contrast this with an array, where elements sit shoulder to shoulder in one contiguous slab of memory, so element number five is found by arithmetic: start address plus five times the element size, one instant jump. A linked list gives that up. Its nodes can live anywhere on the heap, in any order, and the only way to find node five is to start at the front and follow four couplers. The payoff for losing that instant jump is flexibility: to splice a new car into the middle of a train you uncouple once and recouple twice, and you never have to shove every following car down the track to make room, which is exactly what an array must do on an insert.

A real-world list you use daily is a **music playlist**: "next track" follows one link forward, and the player never needs to know how many songs come after the current one. Another is the **free list** an allocator keeps: every chunk of unused memory points to the next free chunk, so handing out memory is just popping the front of a linked list.

The crucial vocabulary: the first node is the **head**. The link in the last node points at *nothing*, a special "end of train" marker. In C that marker is the null pointer; in Rust, as the next section shows, it is the None variant of Option, which is far safer.

### Common pitfalls

- Confusing the *node* (a box holding value plus link) with the *value* (just the cargo). The node is the wrapper; the list is a chain of wrappers.
- Assuming "the next item" is cheap to reach from any item. It is cheap only *forward*, and only if you are already holding the current node. There is no instant jump by position.`,
      code: [
        {
          lang: 'text',
          src: `A linked list of 3 values: 10 -> 20 -> 30

   head
    |
    v
 +------+------+    +------+------+    +------+------+
 |  10  |  *---+--> |  20  |  *---+--> |  30  | null |
 +------+------+    +------+------+    +------+------+
 value   next       value   next       value   next

 * each box is a NODE living somewhere on the heap
 * the "next" field is a POINTER (an arrow to the next box)
 * the last node's next is "null" (the end marker)

Array of the same values for comparison (one solid slab):

 index:    0     1     2
        +-----+-----+-----+
        |  10 |  20 |  30 |   contiguous in memory
        +-----+-----+-----+
        ^ item i is at base + i*size  (instant jump, no walking)`,
        },
        {
          lang: 'rust',
          src: `// A single node: a value plus a link to the next node.
// The link is Option<Box<Node>>:
//   Some(box) = "there is a next node, here is its heap address"
//   None      = "end of the list" (the safe replacement for null)
struct Node {
    value: i32,
    next: Option<Box<Node>>,
}

fn main() {
    // Build 10 -> 20 -> 30 by hand, back to front.
    let n3 = Node { value: 30, next: None };
    let n2 = Node { value: 20, next: Some(Box::new(n3)) };
    let n1 = Node { value: 10, next: Some(Box::new(n2)) };
    println!("head value = {}", n1.value); // 10
}`,
        },
      ],
    },
    {
      heading: 'Why linked lists fight Rust, and the idiomatic answer',
      body: `In C or Java a linked list is a first-week exercise, so beginners are shocked that it is considered *hard* in Rust. The reason is a head-on collision between what a list wants and what Rust guarantees.

Recall Rust's core rule: **every value has exactly one owner**, and when that owner goes out of scope the value is dropped. A classic doubly linked list, though, wants node B to be reachable from node A (forward) *and* node A to be reachable from node B (backward). That is two pointers at the same node, two owners, which Rust forbids by default. Even a singly linked list trips people up because they reach for raw references and immediately hit lifetime errors: a reference must never outlive the thing it points at, but in a list the nodes point at each other in a tangle the compiler cannot prove safe.

The idiomatic answer for a **singly linked list** is to make ownership flow in one clean direction, head to tail, using exactly the type from the last section: Option<Box<Node>>. Let us unpack it piece by piece, because each part earns its place:

- **Box<Node>** is a pointer that *owns* the node it points at, and stores that node on the heap. We need the heap because a Node contains another Node contains another Node; that is infinitely recursive in size unless we break the recursion with a pointer, and Box is the simplest owning pointer. Each Box has exactly one owner, so the single-owner rule holds: node 1 owns node 2 owns node 3.
- **Option<...>** is how we say "maybe there is a next node, maybe this is the end." Some(box) is a real link; None is the end marker. This replaces C's null pointer, and because Rust forces you to handle the None case, you can never accidentally follow an end-of-list pointer into garbage.

So the whole type, Option<Box<Node>>, reads in English as: *"either nothing (the end), or an owned, heap-allocated next node."* Ownership runs strictly forward, the borrow checker is satisfied, and dropping the head cleanly drops the entire chain.

### Common pitfalls

- Reaching for &Node or lifetimes to model the links. That fights the borrow checker forever; use owning Box pointers and let ownership flow one way.
- Forgetting why Box is needed at all: without it, struct Node containing a Node is a type of infinite size and will not compile. The Box gives the recursive type a fixed, known size (one pointer).
- Assuming you can keep a backward pointer too. You cannot, not with plain Box. Backward links need Rc plus RefCell, covered near the end.`,
      code: [
        {
          lang: 'text',
          src: `Ownership flows ONE WAY (head -> tail). Each box owns the next node.

  head: Option<Box<Node>>
    |
    | Some
    v
 +--------+        +--------+        +--------+
 |  10    | owns-> |  20    | owns-> |  30    | next = None
 +--------+        +--------+        +--------+
  one owner         one owner         one owner

Single-owner rule satisfied: nobody points back, no node is co-owned.
Drop the head -> it drops node 10 -> which drops node 20 -> ... done.

What does NOT fit Box (a node co-owned from two sides):

      +--------+
   -->|  B     |<--          two arrows IN = two owners
   |  +--------+  |          Box forbids this.
 [A]              [C]        (needs Rc<RefCell<..>>, see last section)`,
        },
        {
          lang: 'rust',
          src: `// The idiomatic singly linked list. We wrap the raw Option<Box<Node>>
// in a Link alias and a List struct so the API is clean.
type Link = Option<Box<Node>>;   // "end, or an owned next node"

struct Node {
    value: i32,
    next: Link,
}

pub struct List {
    head: Link,
}

impl List {
    pub fn new() -> Self {
        List { head: None }      // an empty list is just a None head
    }
}

fn main() {
    let list = List::new();
    println!("empty list created, head is None: {}", list.head.is_none());
}`,
        },
      ],
    },
    {
      heading: 'Building and pushing to the front',
      body: `Now that the type is settled, let us add nodes. The cheapest place to add to a singly linked list is the **front** (the head), because it is the one spot we already hold a pointer to. Pushing to the front is a three-line dance:

1. Make a new node whose next link points at the *current* head.
2. Make the list's head point at the new node.
3. Done, no walking, no shifting, constant time.

This is **O(1)**, "constant time": the work does not grow with the length of the list. Compare that to inserting at the front of an array, which is **O(n)** because every existing element must slide one slot to the right to open up index 0.

The one Rust-specific wrinkle is the move in step 1. We need the new node's next field to *take ownership* of the old head, and at the same instant the list's head must be free to receive the new node. We cannot copy the old head out (Box does not implement Copy) and we cannot leave the head field empty even for a moment (Rust has no "uninitialized" state for a live field). The tool that solves this exactly is **std::mem::take**, which swaps a field out for its default value (None for an Option) and hands you the old contents. We yank the old head out, leaving None behind, build the new node around it, then store the new node as the head.

A real picture for "push to front": think of **adding a browser tab to the front of your history**, or a train yard **coupling a fresh car onto the front of a train**, the locomotive simply latches onto the new car, and the new car latches onto what used to be the first car. Nothing behind moves an inch.

### Common pitfalls

- Trying to write self.head = Some(Box::new(Node { next: self.head })). That uses self.head while also assigning to it, a move-and-use conflict. std::mem::take (or mem::replace) breaks the deadlock by leaving a valid None behind.
- Thinking you must walk to the end to insert. You only walk to the end if you specifically want to push to the *back*; pushing to the front is O(1) and is the natural primitive for a stack.
- usize gotcha: if you track a length field, it is a usize and can never go negative, so guard subtractions on an empty list.`,
      code: [
        {
          lang: 'text',
          src: `push_front(5) onto the list  10 -> 20

BEFORE:
  head -> [10|*] -> [20|None]

STEP 1: build new node whose .next steals the old head
        new = [5|*] ------> [10|*] -> [20|None]
        head -> None   (mem::take left None behind, briefly)

STEP 2: head points at the new node
  head -> [5|*] -> [10|*] -> [20|None]

AFTER:
  head -> [5] -> [10] -> [20]     (no existing node moved)`,
        },
        {
          lang: 'rust',
          src: `use std::mem;

type Link = Option<Box<Node>>;
struct Node { value: i32, next: Link }
pub struct List { head: Link }

impl List {
    pub fn new() -> Self { List { head: None } }

    // O(1): the new node grabs the old head, then becomes the head.
    pub fn push_front(&mut self, value: i32) {
        let new = Box::new(Node {
            value,
            next: mem::take(&mut self.head), // yank old head, leave None
        });
        self.head = Some(new);               // new node is the head now
    }
}

fn main() {
    let mut list = List::new();
    list.push_front(20);
    list.push_front(10);
    list.push_front(5);
    // list is now 5 -> 10 -> 20
    println!("head = {}", list.head.as_ref().unwrap().value); // 5
}`,
        },
      ],
    },
    {
      heading: 'Traversing the chain',
      body: `**Traversal** means visiting every node in order, front to back, exactly like a train conductor walking car to car. You keep a "cursor" pointer that starts at the head; you read the current node, then move the cursor to current.next, and you stop when the cursor reaches None (the end marker). Because you touch each of the n nodes once, traversal is **O(n)** time and **O(1)** extra space.

In Rust we traverse with a *shared reference* cursor so we do not disturb ownership. The cursor has type Option<&Node> (a borrowed peek, not an owned Box). The loop pattern is: while there is Some(node), use it, then set the cursor to node.next.as_deref(). That as_deref turns an &Option<Box<Node>> into an Option<&Node>, peeling off the Box without taking it, exactly the borrow we want.

Traversal is also where **random access** shows its true cost. To read "the i-th element," there is no arithmetic shortcut; you must traverse i steps. That makes indexed access **O(n)** on a linked list versus **O(1)** on an array, and it is the single biggest reason linked lists are *not* the default container. If your code says list[i] a lot, you want a Vec, not a list.

Idiomatic Rust hides the cursor behind an **Iterator**, so users write a normal for loop and get all of Rust's iterator adapters (map, filter, sum) for free. The example shows both the raw while-let cursor (so you see the mechanism) and a tiny Iter type that implements Iterator (so you see the idiom).

### Common pitfalls

- Moving instead of borrowing while traversing. If your cursor owns the Box, walking the list *consumes* it; use Option<&Node> and as_deref to borrow.
- Off-by-one at the end: the loop must stop *when* the cursor is None, after the last real node, not before it. Check the cursor, then advance.
- Reaching for list[i] habits from arrays. Indexed access here is O(n); restructure to a single forward pass whenever you can.`,
      code: [
        {
          lang: 'text',
          src: `Traversal of  10 -> 20 -> 30 , frame by frame:

 frame 0:  cur -> [10] -> [20] -> [30] -> None   visit 10
                   ^cur
 frame 1:  cur ------> [20] -> [30] -> None       visit 20
                        ^cur
 frame 2:  cur -------------> [30] -> None         visit 30
                               ^cur
 frame 3:  cur ---------------------> None         STOP (end marker)
                                       ^cur

 visited: 10, 20, 30   (each node touched exactly once = O(n))`,
        },
        {
          lang: 'rust',
          src: `type Link = Option<Box<Node>>;
struct Node { value: i32, next: Link }
pub struct List { head: Link }

impl List {
    // Raw cursor traversal: borrow each node, never take ownership.
    pub fn print(&self) {
        let mut cur = self.head.as_deref();      // Option<&Node>
        while let Some(node) = cur {
            print!("{} ", node.value);
            cur = node.next.as_deref();          // step forward by borrow
        }
        println!();
    }

    // Idiomatic: expose an Iterator so callers use a normal for loop.
    pub fn iter(&self) -> Iter<'_> { Iter { cur: self.head.as_deref() } }
}

pub struct Iter<'a> { cur: Option<&'a Node> }
impl<'a> Iterator for Iter<'a> {
    type Item = &'a i32;
    fn next(&mut self) -> Option<&'a i32> {
        self.cur.map(|node| {
            self.cur = node.next.as_deref();
            &node.value
        })
    }
}

fn main() {
    let mut list = List { head: None };
    for v in [30, 20, 10] {
        list.head = Some(Box::new(Node { value: v, next: list.head.take() }));
    }
    list.print();                                 // 10 20 30
    let total: i32 = list.iter().sum();           // iterator adapters work!
    println!("sum = {total}");                    // 60
}`,
        },
      ],
    },
    {
      heading: 'Iterative reversal: the prev / curr / next dance',
      anim: 'list-reverse',
      body: `Reversing a linked list is the most-asked linked-list interview question, and it is a perfect lesson in pointer manipulation. The goal: turn 1 -> 2 -> 3 into 3 -> 2 -> 1 by *re-pointing the arrows*, not by copying values into a new list. We do it in a single forward pass, **O(n)** time and **O(1)** extra space (we only ever keep three pointers around, no matter how long the list is).

The trick is to walk the list flipping each node's next pointer to aim at the node *behind* it. But the instant you flip current.next backward, you lose your only way forward, so you must save the forward link first. That is why the dance uses **three** pointers:

- **prev** starts as None (nothing comes before the first node once reversed, it becomes the new tail).
- **curr** starts at the head (the node we are flipping right now).
- **next** is a temporary that remembers curr's original forward link *before* we overwrite it.

The loop body, repeated until curr is None, is four moves: (1) next = curr.next, save the way forward; (2) curr.next = prev, flip the arrow backward; (3) prev = curr, slide prev up; (4) curr = next, slide curr up. When curr finally falls off the end, prev is sitting on the old last node, which is the new head.

In Rust the four moves become a tidy sequence using take and the swap of Box ownership. Because each step moves a Box rather than aliasing it, the borrow checker is happy and there is never a moment where two pointers claim the same node.

### Common pitfalls

- Forgetting to save next first. If you write curr.next = prev before stashing the old next, you have amputated the rest of the list and cannot continue.
- Returning curr or next as the new head. The new head is **prev**, the last node you successfully flipped, not curr (which is None at the end).
- Doing it recursively as a first instinct. Recursion works but uses O(n) stack and can overflow on long lists; the iterative three-pointer version is O(1) space and is what interviewers expect.`,
      code: [
        {
          lang: 'text',
          src: `Reverse 1 -> 2 -> 3 , frame by frame (P=prev, C=curr, N=next):

 start:   P=None   C=[1]->[2]->[3]->None

 iter 1:  N=[2]                       (save forward)
          [1].next = None             (flip:  None <-[1])
          P=[1]   C=[2]->[3]->None

 iter 2:  N=[3]
          [2].next = [1]              (None <-[1]<-[2])
          P=[2]   C=[3]->None

 iter 3:  N=None
          [3].next = [2]              (None <-[1]<-[2]<-[3])
          P=[3]   C=None

 stop (C=None). New head = P = [3].   Result: 3 -> 2 -> 1`,
        },
        {
          lang: 'rust',
          src: `type Link = Option<Box<Node>>;
struct Node { value: i32, next: Link }
pub struct List { head: Link }

impl List {
    // O(n) time, O(1) space: walk once, flipping each arrow backward.
    pub fn reverse(&mut self) {
        let mut prev: Link = None;
        let mut curr: Link = self.head.take();   // own the chain locally
        while let Some(mut node) = curr {
            let next = node.next.take();          // 1. save the way forward
            node.next = prev;                     // 2. flip arrow backward
            prev = Some(node);                    // 3. slide prev up
            curr = next;                          // 4. slide curr up
        }
        self.head = prev;                         // prev is the new head
    }
}

fn main() {
    let mut list = List { head: None };
    for v in [3, 2, 1] {                          // builds 1 -> 2 -> 3
        list.head = Some(Box::new(Node { value: v, next: list.head.take() }));
    }
    list.reverse();                               // now 3 -> 2 -> 1
    let mut cur = list.head.as_deref();
    while let Some(n) = cur { print!("{} ", n.value); cur = n.next.as_deref(); }
    println!();                                   // 3 2 1
}`,
        },
      ],
    },
    {
      heading: 'The runner technique: fast and slow pointers',
      body: `Some problems need *two* cursors moving at *different speeds* through the same list. This is the **runner technique**, and the most famous instance is **Floyd's cycle detection**, nicknamed the **tortoise and hare**. Picture two runners on a circular track: a slow tortoise taking one step at a time and a fast hare taking two. On a straight road the hare simply finishes first and they never meet again. But if the road loops back on itself, the hare keeps lapping the track and *must eventually collide with the tortoise from behind*. That collision is the signal "there is a cycle."

Why would a list have a cycle? A bug, usually, where some node's next pointer was accidentally set to an earlier node, creating an infinite loop a naive traversal would spin in forever. Detecting it is **O(n)** time and, crucially, **O(1)** space: just two pointers, no bookkeeping set of visited nodes. The intuition for why they meet: once both are inside the loop, each step the hare closes the gap to the tortoise by exactly one, so the distance shrinks to zero in at most one lap.

The same two-speed idea solves **finding the middle** of a list in one pass. Advance slow by one and fast by two; when fast reaches the end, slow is sitting exactly halfway. No need to count the length first and then walk half of it, the runner gets the middle in a single sweep. This is the engine behind splitting a list for merge sort, and behind finding the midpoint of the chain in an **LRU cache**.

In Rust, cycle detection across owning Box pointers is awkward (a real cycle of owned Boxes cannot even be built safely), so the textbook tortoise-and-hare is usually written over indices into a Vec, which we show. The find-the-middle version we write directly over the borrowed list, since that list is genuinely acyclic.

### Common pitfalls

- Advancing fast by two without checking that the node in between exists. On an even-length list fast can run off the end; guard both fast and fast.next before the double step.
- Concluding "no cycle" too early. You only know there is no cycle once fast reaches None; until then keep stepping.
- Trying to build a real cycle with Box to test your code. You cannot, Box is single-owner. Model the list as a Vec of next-indices (usize) where a cycle is just an index pointing backward.`,
      code: [
        {
          lang: 'text',
          src: `Tortoise (T, +1) and Hare (H, +2) on a list WITH a cycle:

 nodes:   0 -> 1 -> 2 -> 3 -> 4
                    ^_________|       (4's next points back to 2)

 step 0:  T=0  H=0
 step 1:  T=1  H=2
 step 2:  T=2  H=4
 step 3:  T=3  H=3   <-- T and H land on the same node => CYCLE!

Find the MIDDLE of  10->20->30->40->50  (no cycle, +1 / +2):

 step 0:  S=10  F=10
 step 1:  S=20  F=30
 step 2:  S=30  F=50
 step 3:  F.next is None -> STOP.  S=30 is the middle.`,
        },
        {
          lang: 'rust',
          src: `// Cycle detection over a Vec arena: next[i] is the index after i,
// or usize::MAX to mean "end" (our None). A cycle = an index loop.
fn has_cycle(next: &[usize]) -> bool {
    const END: usize = usize::MAX;
    let (mut slow, mut fast) = (0usize, 0usize);
    loop {
        // hare needs two real steps; if either is END, no cycle.
        if next[fast] == END || next[next[fast]] == END { return false; }
        slow = next[slow];                 // tortoise +1
        fast = next[next[fast]];           // hare +2
        if slow == fast { return true; }   // they met => cycle
    }
}

// Find the middle of a borrowed (acyclic) Box list in one pass.
type Link = Option<Box<Node>>;
struct Node { value: i32, next: Link }
fn middle(head: &Link) -> Option<i32> {
    let mut slow = head.as_deref();
    let mut fast = head.as_deref();
    while let Some(f) = fast {
        match f.next.as_deref() {
            Some(ff) => { fast = ff.next.as_deref(); slow = slow.unwrap().next.as_deref(); }
            None => break,
        }
    }
    slow.map(|n| n.value)
}

fn main() {
    // 0->1->2->3->4->2 (cycle back to index 2)
    let next = [1, 2, 3, 4, 2usize];
    println!("cycle? {}", has_cycle(&next)); // true
}`,
        },
      ],
    },
    {
      heading: 'Merging two sorted lists with a dummy head',
      body: `Suppose you have two playlists, each already in order, and you want one combined playlist still in order. That is **merging two sorted lists**, the heart of merge sort and a classic interview task. The algorithm is a zipper: compare the front nodes of the two lists, detach the smaller one and attach it to the result, advance past it, and repeat until one list runs dry; then attach whatever remains of the other list wholesale. Each node is looked at once, so it is **O(n + m)** time, and done by re-linking it is **O(1)** extra space (no new nodes are allocated, the existing nodes are just re-pointed).

The slick trick that makes the code clean is the **dummy head**, also called a sentinel. A dummy head is a throwaway node that sits *before* the real first node of the result. Why bother? Without it, the very first attachment is a special case: "if the result is still empty, this becomes the head; otherwise link it onto the tail." That branch clutters the loop. With a dummy node, the result is *never* empty, the tail pointer always has something real to attach to, so every iteration is identical. At the end you simply return dummy.next and discard the dummy, like a fake locomotive you uncouple once the real first car is in place.

In Rust the dummy-head pattern shines because it gives us a stable place to hang the growing tail. We keep a tail pointer that always points at the last node attached so far, and splice each chosen node onto tail.next. The borrow checker is satisfied because we move whole Boxes from the input lists into the result, never aliasing them. This same recipe **is** the merge step of merge sort: split with the runner technique from the last section, sort each half, then merge here.

### Common pitfalls

- Handling the first element as a special case instead of using a dummy head. The dummy removes that branch and is why experienced coders reach for it immediately.
- Forgetting to attach the leftover tail. When one list empties, the *entire* remainder of the other is already sorted, attach it in one move, do not keep comparing.
- Returning the dummy itself instead of dummy.next. The dummy is scaffolding; the real list starts one node later.`,
      code: [
        {
          lang: 'text',
          src: `Merge  A: 1 -> 4    and    B: 2 -> 3   using a dummy head D:

 start:  D -> None        a=1.. b=2..   tail=D

 cmp 1 vs 2 -> take 1:  D -> 1            a=4.. b=2..  tail=1
 cmp 4 vs 2 -> take 2:  D -> 1 -> 2       a=4.. b=3..  tail=2
 cmp 4 vs 3 -> take 3:  D -> 1 -> 2 -> 3  a=4.. b=Nil  tail=3
 b empty -> attach rest of a (4):
                        D -> 1 -> 2 -> 3 -> 4

 return D.next  =>  1 -> 2 -> 3 -> 4   (discard the dummy D)`,
        },
        {
          lang: 'rust',
          src: `type Link = Option<Box<Node>>;
struct Node { value: i32, next: Link }

// Zip two sorted lists into one. O(n+m) time, O(1) extra space.
fn merge(mut a: Link, mut b: Link) -> Link {
    let mut dummy = Box::new(Node { value: 0, next: None }); // sentinel
    let mut tail = &mut dummy;                               // last attached
    loop {
        match (a.as_ref(), b.as_ref()) {
            (Some(na), Some(nb)) => {
                // pick the smaller front node, detach it, append it.
                if na.value <= nb.value {
                    let mut node = a.take().unwrap();
                    a = node.next.take();
                    tail.next = Some(node);
                } else {
                    let mut node = b.take().unwrap();
                    b = node.next.take();
                    tail.next = Some(node);
                }
                tail = tail.next.as_mut().unwrap();          // advance tail
            }
            // one side empty: attach the whole remaining other side.
            _ => { tail.next = if a.is_some() { a } else { b }; break; }
        }
    }
    dummy.next                                               // drop the dummy
}

fn main() {
    let a = Some(Box::new(Node { value: 1,
        next: Some(Box::new(Node { value: 4, next: None })) }));
    let b = Some(Box::new(Node { value: 2,
        next: Some(Box::new(Node { value: 3, next: None })) }));
    let mut cur = merge(a, b);
    while let Some(n) = cur { print!("{} ", n.value); cur = n.next; }
    println!();                                              // 1 2 3 4
}`,
        },
      ],
    },
    {
      heading: 'When you need Rc, RefCell, std LinkedList, or an arena',
      body: `Everything so far used Box, which gives strict single-direction ownership. Real structures sometimes need more, and Rust offers exactly-targeted tools. Being honest about when to use which is the difference between fighting the compiler and working with it.

**Doubly linked lists and shared nodes: Rc<RefCell<Node>>.** A **doubly linked list** stores a *prev* pointer as well as a *next*, so you can walk backward, like a **browser history** stepping back and forward, or the recently-used chain inside an **LRU cache**. Now a node is co-owned (next from the left, prev from the right), which Box forbids. The answer is two wrappers working together: **Rc<T>** ("reference counted") allows *multiple* owners of one heap value by keeping a count of how many references exist and freeing only when the count hits zero; and **RefCell<T>** moves the borrow check from compile time to *run time*, so you can mutate the node through a shared Rc (which is otherwise read-only). The combination Rc<RefCell<Node>> means "a node that can have several owners and still be mutated." The cost is real: a runtime panic if you break the borrow rules dynamically, and **reference cycles leak memory** because two Rc nodes pointing at each other never reach count zero, the fix is to make the backward links **Weak<T>**, a non-owning reference that does not keep the value alive.

**std::collections::LinkedList exists, but rarely use it.** The standard library ships a doubly linked list so you do not have to write the unsafe internals yourself. In practice it is almost never the right choice: a **Vec** wins on nearly every real workload because contiguous memory is friendly to the CPU cache, while a linked list's scattered nodes cause cache misses that dwarf the theoretical O(1) insert. Reach for std LinkedList only when you specifically need O(1) splicing of large sublists, which is rare.

**The pragmatic favorite: a Vec-backed arena of indices.** For interviews and most production graph/list code, the cleanest design is to store all nodes in one Vec and replace every pointer with a **usize index** into that Vec. This is an **arena**. A "null" link becomes a sentinel index like usize::MAX. The borrow checker stops complaining (you are holding plain integers, not aliasing references), cycles and back-pointers are trivial (just store another index), and the data is contiguous and cache-friendly. The price is that you must guard those indices yourself, and remember that **usize cannot go negative**, so never compute index minus one without checking, that is the classic underflow-to-a-giant-number panic.

### Common pitfalls

- Building an Rc cycle (next and prev both strong) and wondering why memory leaks. Make one direction Weak so the count can reach zero.
- Defaulting to std LinkedList because the topic is "linked lists." A Vec is faster on almost all real inputs; use the arena pattern when you truly need link semantics.
- Indexing an arena with a usize that underflowed. usize::MAX from a subtract-below-zero will index out of bounds and panic; check before subtracting.`,
      code: [
        {
          lang: 'text',
          src: `Doubly linked (browser history). Each node has prev AND next:

   None <-- [page A] <==> [page B] <==> [page C] --> None
            (prev/next both needed => Box is not enough)

   strong next ->     weak prev <- -      (back links are Weak<T>
   so the ref-count can still reach 0 and memory is reclaimed)

Arena: ONE Vec of nodes, links are usize indices (END = usize::MAX)

  index:   0        1        2
        +--------+--------+--------+
  val   |   10   |   20   |   30   |
  next  |   1    |   2    |  END   |   "next" is an index, not a pointer
        +--------+--------+--------+
  head = 0.  Follow next[0]=1 -> next[1]=2 -> next[2]=END (stop).
  A cycle is just next[2] = 0 instead of END. No borrow-checker fight.`,
        },
        {
          lang: 'rust',
          src: `// 1) Shared, mutable, doubly linkable node: Rc<RefCell<..>> + Weak.
use std::rc::{Rc, Weak};
use std::cell::RefCell;
struct DNode {
    value: i32,
    next: Option<Rc<RefCell<DNode>>>,  // strong: owns forward
    prev: Option<Weak<RefCell<DNode>>>,// weak: does NOT own backward
}

// 2) The pragmatic arena: nodes in a Vec, links are usize indices.
const END: usize = usize::MAX;
struct ArenaNode { value: i32, next: usize }
struct Arena { nodes: Vec<ArenaNode> }

impl Arena {
    fn push_front(&mut self, value: i32, head: &mut usize) {
        let idx = self.nodes.len();
        self.nodes.push(ArenaNode { value, next: *head });
        *head = idx;                    // O(1), no borrow-checker fight
    }
}

fn main() {
    let mut arena = Arena { nodes: Vec::new() };
    let mut head = END;
    for v in [30, 20, 10] { arena.push_front(v, &mut head); }
    let mut i = head;                   // walk by following indices
    while i != END { print!("{} ", arena.nodes[i].value); i = arena.nodes[i].next; }
    println!();                         // 10 20 30
}`,
        },
      ],
    },
  ],
  takeaways: [
    'A linked list is nodes scattered on the heap and threaded by pointers; an array is one contiguous block found by arithmetic.',
    'Linked lists trade away O(1) random access (now O(n), a walk) to gain O(1) insert/delete at a node you already hold.',
    'The idiomatic singly linked list in Rust is Option<Box<Node>>: Box gives single-owner heap storage, Option None replaces the null end marker.',
    'Box is mandatory because a recursive Node-inside-Node has infinite size; the pointer gives it a fixed size, and ownership flows one way head to tail.',
    'push_front is O(1) using std::mem::take to swap the old head out while leaving a valid None behind.',
    'Iterative reversal is the prev/curr/next dance: save next, flip the arrow back, slide both pointers; O(n) time, O(1) space, new head is prev.',
    'The runner technique uses two pointers at different speeds: tortoise-and-hare detects cycles in O(1) space, and slow/fast finds the middle in one pass.',
    'Merging two sorted lists is a zipper made clean by a dummy head sentinel; O(n+m) time, O(1) space, and it is the merge step of merge sort.',
    'Doubly linked or shared structures need Rc<RefCell<Node>>, with Weak back-pointers to avoid leaking reference cycles.',
    'std::collections::LinkedList is rarely the right tool; prefer Vec for cache-friendliness, or a Vec arena of usize indices (remember usize cannot go negative).',
  ],
  cheatsheet: [
    { label: 'type Link = Option<Box<Node>>', value: 'idiomatic singly linked list link: end, or owned next node' },
    { label: 'None', value: 'the safe end-of-list marker (replaces C null)' },
    { label: 'Box<Node>', value: 'single-owner heap pointer; gives the recursive type a fixed size' },
    { label: 'std::mem::take(&mut self.head)', value: 'yank field out, leave None; enables O(1) push_front' },
    { label: '.as_deref()', value: '&Option<Box<Node>> -> Option<&Node> for borrowing traversal' },
    { label: '.take()', value: 'Option::take: move the Some out, leave None behind' },
    { label: 'push_front', value: 'O(1) time, O(1) space' },
    { label: 'indexed / random access', value: 'O(n) (must walk) vs O(1) for a Vec' },
    { label: 'traverse, reverse, length', value: 'O(n) time; reverse is O(1) extra space' },
    { label: 'tortoise & hare', value: 'cycle detection, O(n) time, O(1) space (two pointers)' },
    { label: 'slow/fast runner', value: 'find middle in a single O(n) pass, O(1) space' },
    { label: 'merge two sorted lists', value: 'O(n+m) time, O(1) space, use a dummy head' },
    { label: 'Rc<RefCell<Node>> + Weak', value: 'shared/doubly linked; Weak back-links avoid leak cycles' },
    { label: 'Vec arena + usize index', value: 'cache-friendly, borrow-checker-free; usize::MAX as the null sentinel' },
  ],
}

export default note
