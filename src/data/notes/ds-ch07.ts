import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-ds-07',
  track: 'dsa',
  chapter: 7,
  title: 'Trees & BST',
  summary: `Arrays and lists are flat: every element sits in one long line. A tree is the first data structure that branches, and that single idea unlocks an enormous amount of the software you use every day. Your file system is a tree of folders, the web page in front of you is a tree of HTML elements (the DOM), a company org chart is a tree of people, and the index that lets a database find a row among a billion in microseconds is a tree on disk.

This chapter builds trees from the ground up in Rust. We define a binary tree node, learn that recursion and depth-first search are really the same thing seen from two angles, walk a tree three different ways (pre-, in-, and post-order), then walk it level by level with a queue. We measure a tree's height and ask whether it is balanced.

Then we meet the binary search tree (BST), the structure that turns "search a sorted collection" into a sequence of left-or-right decisions and gives O(log n) lookups when it stays bushy, but quietly rots into a slow O(n) list when it does not. Finally we touch the self-balancing trees (AVL, red-black, B-tree) that production systems use to guarantee the good case forever. Rust's ownership rules make trees a little spicier than they are in Python or C++, and we will meet those gotchas head-on.`,
  sections: [
    {
      heading: 'What a tree is: roots, children, leaves, height, and depth',
      body: `A **tree** is a collection of **nodes** connected by edges, with one special node called the **root** at the top and no cycles, meaning you can never walk along edges and end up back where you started. Every node except the root has exactly one **parent** (the node directly above it) and any number of **children** (the nodes directly below it). A node with no children is a **leaf**. Nodes that share a parent are **siblings**. A **subtree** is any node together with everything hanging beneath it; this self-similar shape, a tree made of smaller trees, is exactly why recursion fits trees like a glove.

The picture every first-year already knows is a **file system**. The root is the top folder, each folder is a node, the files inside are leaves, and the path you type in a terminal is just the list of nodes from the root down to one item. The **HTML DOM** is the same shape: one html root, a head and a body as children, and elements nested inside elements all the way down. A **company org chart** is a tree of people: the CEO is the root, managers are interior nodes, and individual contributors are the leaves.

Two measurements come up constantly. The **depth** of a node is how many edges lie between it and the root, so the root has depth 0, its children depth 1, and so on. The **height** of a node is the number of edges on the longest path going *downward* from it to a leaf; a leaf has height 0. The height of the whole tree is the height of its root. Depth counts up toward the root; height counts down toward the leaves.

A **binary tree** is the special, supremely useful case where every node has **at most two children**, named the **left** child and the **right** child. Almost everything in this chapter is about binary trees, because two children is the smallest branching factor that still lets us split a problem in half at each step.

### Common pitfalls

- Confusing height and depth. Depth is measured from the root down to the node; height is measured from the node down to its deepest leaf. They are not the same number unless the node happens to be on the longest path.
- Assuming a tree must be balanced or full. A single chain of nodes, each with one child, is still a perfectly valid tree; it just happens to be the worst-shaped one.
- Thinking left and right are interchangeable. In a binary tree they are distinct positions; swapping them changes the tree and, for a search tree, breaks its ordering.`,
      code: [
        {
          lang: 'text',
          src: `A file system AS a tree (root at the top, leaves at the bottom):

                       /            <- root, depth 0, height 3
                  ____/ \\____
                 /           \\
              home           etc     <- depth 1
              /  \\            |
           alice  bob       hosts    <- depth 2  (hosts is a leaf)
           /  \\
       notes  pics                   <- depth 3  (leaves, height 0)

  depth(alice) = 2     (edges from root down to alice)
  height(home) = 2     (home -> alice -> notes, two edges down)
  height(tree) = height(root) = 3
  leaves       = { bob, hosts, notes, pics }   (no children)`
        },
        {
          lang: 'text',
          src: `Vocabulary on one small BINARY tree (<= 2 children each):

                 (8)            8 is the root
                /   \\
             (3)     (10)       3 and 10 are children of 8 (siblings)
             / \\        \\
          (1) (6)       (14)    1, 6, 14 are leaves (no children)

  10 has only a RIGHT child (14); its LEFT slot is empty.
  "left" and "right" are fixed, distinct positions -- not swappable.

  The subtree rooted at 3 is:   (3)
                                / \\
                             (1) (6)`
        }
      ]
    },
    {
      heading: 'Representing a binary tree node in Rust',
      body: `In Python you would just write a class with left and right attributes that default to None. Rust forces you to be precise about two things Python hides: *who owns each child*, and *what represents the empty spot* where a child might or might not be.

A child is "either a node, or nothing", and Rust spells "either a value or nothing" as **Option**. The node itself lives on the heap (a tree can grow to any size, so its size is not known at compile time), and the standard heap-owning pointer is **Box**. Putting them together, a child link is **Option of Box of TreeNode**. \`None\` means no child; \`Some(boxed_node)\` means there is one, and the parent **owns** it. When a node is dropped, it drops its boxed children, which drop theirs, so freeing the whole tree is automatic and recursive, with no garbage collector.

This \`Option<Box<...>>\` design is clean and fast and is what you want for a tree you build and own yourself. Its one limitation is that each child has exactly one owner (its parent), so a node cannot easily point back at its parent or be shared by two parents.

That limitation is why **LeetCode-style** problems use a different shape: **Rc of RefCell of TreeNode**. \`Rc\` (reference counted pointer) allows *many* owners of the same node, and \`RefCell\` allows you to mutate the node through a shared pointer by moving Rust's borrow check from compile time to run time. This combination lets several pointers reference one node (handy for parent links or graph-like sharing) at the cost of run-time borrow tracking and the small overhead of reference counting. Learn both: \`Box\` for trees you build cleanly, \`Rc<RefCell<...>>\` when the interface forces shared, mutable access.

### Common pitfalls

- Writing \`Box<TreeNode>\` for a child without the \`Option\`. Then there is no way to represent "no child", and the type becomes infinitely sized because a node would always contain another node forever.
- Forgetting that \`Box<T>\` has a known size (it is just a pointer) even though \`T\` does not. The \`Box\` is exactly what breaks the infinite-size cycle.
- Reaching for \`Rc<RefCell<...>>\` everywhere out of habit. It defers borrow checks to run time, so a double mutable borrow that would be a compile error with \`Box\` becomes a run-time panic instead. Use it only when you truly need sharing.`,
      code: [
        {
          lang: 'rust',
          src: `// The clean, owning representation: best when YOU build the tree.
// A node owns its two children; None means "no child here".
#[derive(Debug)]
struct TreeNode {
    val: i32,
    left: Option<Box<TreeNode>>,
    right: Option<Box<TreeNode>>,
}

impl TreeNode {
    fn leaf(val: i32) -> Box<TreeNode> {
        Box::new(TreeNode { val, left: None, right: None })
    }
}

fn main() {
    // Build:      (8)
    //             / \\
    //          (3)  (10)
    let mut root = TreeNode { val: 8, left: None, right: None };
    root.left  = Some(TreeNode::leaf(3));
    root.right = Some(TreeNode::leaf(10));
    println!("{:?}", root.val); // 8
    // When root drops at end of main, it drops both boxed children
    // automatically, freeing the whole tree. No manual free, no GC.
}`
        },
        {
          lang: 'rust',
          src: `// The LeetCode-style representation: many owners + interior mutation.
use std::rc::Rc;
use std::cell::RefCell;

// Rc  = shared ownership (reference counted)
// RefCell = move borrow checking to RUN TIME so we can mutate via a shared Rc
type Link = Option<Rc<RefCell<TreeNode>>>;

struct TreeNode {
    val: i32,
    left: Link,
    right: Link,
}

fn node(val: i32) -> Rc<RefCell<TreeNode>> {
    Rc::new(RefCell::new(TreeNode { val, left: None, right: None }))
}

fn main() {
    let root = node(8);
    root.borrow_mut().left = Some(node(3));   // borrow_mut(): run-time checked
    let three = root.borrow().left.clone();   // clone() bumps the Rc count, not the data
    println!("{}", three.unwrap().borrow().val); // 3
}`
        }
      ]
    },
    {
      heading: 'Recursion IS depth-first search: pre-, in-, and post-order',
      body: `Here is the most important idea in the chapter. To **visit** every node in a tree, you do not need any explicit loop or extra data structure: you write a function that handles the current node, then *calls itself* on the left subtree and on the right subtree. Because a subtree is itself a tree, the same function works at every level. This is **depth-first search (DFS)**: you plunge as deep as possible down one branch before backing up to try another, and ordinary recursion does the plunging-and-backing-up for you, using the program's call stack as its memory.

The only choice left is *when* you do the work on the current node relative to recursing into the children. That choice gives three classic **traversals**:

- **Pre-order**: handle the node **first**, then go left, then go right (Node, Left, Right). You see a parent before its children. This is the order you would copy a tree, or print a folder before its contents.
- **In-order**: go left, then handle the node, then go right (Left, Node, Right). For a binary *search* tree this prints the values in **sorted order**, which is the single most useful fact in this whole chapter.
- **Post-order**: go left, then go right, then handle the node **last** (Left, Right, Node). You see all children before their parent. This is how you delete a tree or compute a folder's total size: you must finish the children before you can finish the parent.

All three visit every node exactly once, so they run in **O(n)** time for n nodes. They use **O(h)** extra space for the call stack, where h is the tree's height (how deep the recursion goes at once). For a balanced tree that is O(log n); for a skewed chain it is O(n).

### Common pitfalls

- Mixing up the three orders. The mnemonic: the prefix tells you where the **N**ode goes. **Pre** = Node first, **In** = Node in the middle, **Post** = Node last; Left always comes before Right.
- Assuming in-order gives sorted output for *any* binary tree. It only does so for a binary **search** tree, where the ordering property holds (next sections).
- Very deep skewed trees can blow the call stack and crash with a stack overflow. For such trees, rewrite DFS iteratively with an explicit \`Vec\` used as a stack.`,
      code: [
        {
          lang: 'text',
          src: `Three traversals of the SAME tree. Watch where each node is emitted.

                 (8)
                /   \\
             (3)     (10)
             / \\        \\
          (1) (6)       (14)

  PRE-order  (Node,Left,Right):  8  3  1  6  10  14
             "say my name, THEN descend"
  IN-order   (Left,Node,Right):  1  3  6  8  10  14   <- SORTED!
             "all left done, say me, then right"
  POST-order (Left,Right,Node):  1  6  3  14 10   8
             "children fully done before I speak"`
        },
        {
          lang: 'text',
          src: `IN-ORDER trace, frame by frame (call stack grows DOWN).
The "*" marks the moment a value is EMITTED.

  visit(8)
   |- visit(3)
   |   |- visit(1)
   |   |   |- visit(None)        left of 1: nothing
   |   |   |- emit 1  *          ----> output: 1
   |   |   '- visit(None)        right of 1: nothing
   |   |- emit 3  *              ----> output: 1 3
   |   '- visit(6)
   |       |- emit 6  *          ----> output: 1 3 6
   |- emit 8  *                  ----> output: 1 3 6 8
   '- visit(10)
       |- emit 10 *              ----> output: 1 3 6 8 10
       '- visit(14)
           '- emit 14 *          ----> output: 1 3 6 8 10 14`
        },
        {
          lang: 'rust',
          src: `type Link = Option<Box<TreeNode>>;
struct TreeNode { val: i32, left: Link, right: Link }

// Each traversal differs ONLY in where we push self.val.
fn pre_order(node: &Link, out: &mut Vec<i32>) {
    if let Some(n) = node {              // None ends the recursion (base case)
        out.push(n.val);                 // NODE first
        pre_order(&n.left,  out);        // then LEFT
        pre_order(&n.right, out);        // then RIGHT
    }
}

fn in_order(node: &Link, out: &mut Vec<i32>) {
    if let Some(n) = node {
        in_order(&n.left,  out);         // LEFT
        out.push(n.val);                 // NODE in the middle  -> sorted for a BST
        in_order(&n.right, out);         // RIGHT
    }
}

fn post_order(node: &Link, out: &mut Vec<i32>) {
    if let Some(n) = node {
        post_order(&n.left,  out);       // LEFT
        post_order(&n.right, out);       // RIGHT
        out.push(n.val);                 // NODE last
    }
}
// Time: O(n) visit each node once.  Space: O(h) for the call stack.`
        }
      ]
    },
    {
      heading: 'Breadth-first / level-order traversal with a VecDeque',
      anim: 'tree-bfs',
      body: `DFS dives deep first. Sometimes you want the opposite: visit the tree **level by level**, all the depth-1 nodes before any depth-2 node, reading top-to-bottom like the lines of a printed page. That is **breadth-first search (BFS)**, also called **level-order** traversal, and it is exactly how you would explore an org chart rank by rank, or find the *shortest* path in an unweighted graph.

Recursion cannot do this naturally, because recursion is inherently depth-first. Instead BFS uses an explicit **queue**, a first-in-first-out (FIFO) line: the first node you add is the first you take out, just like people queuing at a counter. The algorithm is a tidy loop. Start by putting the root in the queue. Then repeat: take the front node out, handle it, and push its children onto the back. Because children always go to the back, a node's children are processed only after every node already waiting, which are all shallower or equal, so you sweep the tree level by level automatically.

In Rust the right tool is **VecDeque**, a double-ended queue from \`std::collections\`. Use \`push_back\` to add to the rear and \`pop_front\` to remove from the front; both are O(1). (A plain \`Vec\` can only pop cheaply from its end, so using one as a queue would force an O(n) shift on every removal.) To recover *which* level each node is on, capture \`queue.len()\` at the top of each outer pass: that count is exactly how many nodes sit on the current level, so you can process them as a group before moving down.

BFS visits every node once, so it is **O(n)** time. Its space is **O(w)**, where w is the maximum **width** of the tree, the most nodes on any single level, because that is the most the queue ever holds at once. For a balanced tree the bottom level alone holds about half the nodes, so BFS can use O(n) memory where DFS uses only O(log n); that memory trade-off is the practical reason to prefer one over the other.

### Common pitfalls

- Using a \`Vec\` and calling \`remove(0)\` to dequeue. That shifts every remaining element left, turning an O(1) operation into O(n) and the whole traversal into O(n squared). Use \`VecDeque::pop_front\`.
- Forgetting to snapshot \`queue.len()\` before the inner loop. If you read the length while you are still pushing children, you will mix two levels together.
- Pushing children in the wrong order when order matters: push left before right to read each level left-to-right.`,
      code: [
        {
          lang: 'text',
          src: `BFS trace. Queue is FIFO: pop the FRONT, push children to BACK.

                 (8)
                /   \\
             (3)     (10)
             / \\        \\
          (1) (6)       (14)

  step  queue (front..back)   pop  push      output / level
  ----  --------------------  ---  --------   ----------------
   0    [8]                    -    -          start
   1    [3, 10]                8    3,10       8           level 0
   2    [10, 1, 6]             3    1,6        8 3
   3    [1, 6, 14]            10    14         8 3 10      level 1 done
   4    [6, 14]                1    -          8 3 10 1
   5    [14]                   6    -          8 3 10 1 6
   6    []                    14    -          8 3 10 1 6 14  level 2

  Levels: [8] [3 10] [1 6 14]   <- read top-to-bottom, left-to-right`
        },
        {
          lang: 'rust',
          src: `use std::collections::VecDeque;

type Link = Option<Box<TreeNode>>;
struct TreeNode { val: i32, left: Link, right: Link }

// Return the values grouped by level: [[8], [3,10], [1,6,14]]
fn level_order(root: &Link) -> Vec<Vec<i32>> {
    let mut levels = Vec::new();
    let mut queue: VecDeque<&Box<TreeNode>> = VecDeque::new();
    if let Some(r) = root {
        queue.push_back(r);              // seed the queue with the root
    }
    while !queue.is_empty() {
        let width = queue.len();         // SNAPSHOT: nodes on this level
        let mut row = Vec::with_capacity(width);
        for _ in 0..width {              // drain exactly one level
            let n = queue.pop_front().unwrap();   // O(1) front removal
            row.push(n.val);
            if let Some(l) = &n.left  { queue.push_back(l); } // push left first
            if let Some(r) = &n.right { queue.push_back(r); }
        }
        levels.push(row);
    }
    levels
}
// Time: O(n).  Space: O(w) where w is the widest level.`
        }
      ]
    },
    {
      heading: 'Computing height and checking balance',
      body: `Now that we can walk a tree, let us *measure* it. The **height** of a tree is the number of edges on the longest downward path from the root to a leaf, and it has a beautiful recursive definition: the height of an empty tree is -1 (a convention that makes the arithmetic clean), the height of a leaf is 0, and the height of any other node is **one plus the larger of its two children's heights**. That sentence translates almost word for word into Rust: recurse left, recurse right, take the max, add one. It is a post-order computation, because a parent's height depends on its children's heights being known first.

Why do we care about height? Because, as the next sections show, every operation on a search tree costs time proportional to the height. A short tree is a fast tree. A tree is informally **balanced** when its left and right sides are roughly the same height everywhere, so no branch is dramatically longer than its sibling. The precise definition used in interviews and in AVL trees: a tree is **height-balanced** if, *at every node*, the heights of the left and right subtrees differ by **at most 1**.

The naive way to test balance is: at each node, compute the left height, compute the right height, check that they differ by at most one, and recurse. But computing a height already walks the whole subtree, so doing it at every node re-walks the same nodes again and again, giving **O(n squared)** in the worst case (a tall thin tree). The smarter approach folds the two jobs into one post-order pass: a single function returns the height *and* signals imbalance at the same time (we use the sentinel -2 to mean "already unbalanced below here"). Each node is touched once, so it runs in **O(n)**. This trick, computing two answers in one traversal, is a recurring theme in tree problems.

### Common pitfalls

- The usize trap: Rust's \`usize\` (the unsigned index type) cannot be negative, so an empty-tree height of -1 must be stored in a **signed** type like \`i32\`, or you will underflow and wrap to a gigantic number. This is a very common Rust-specific bug that C and Python do not have.
- Re-computing height at every node to test balance. That is the O(n squared) trap; thread the height up through the recursion and check imbalance once per node instead.
- Off-by-one between counting **edges** and counting **nodes**. Some texts define height as a node count (leaf height 1). Pick one convention and be consistent; this chapter counts edges (leaf height 0, empty -1).`,
      code: [
        {
          lang: 'text',
          src: `Heights computed POST-ORDER (children first), shown by each node.

                 (8) h=3                  height(node) =
                /     \\                       1 + max(h(left), h(right))
        h=1 (3)       (10) h=2            empty tree: h = -1
            / \\           \\               leaf:       h =  0
   h=0 (1)   (6) h=0      (14) h=1
                              \\
                          (20) h=0

  Balance check (|h(L) - h(R)| <= 1 at EVERY node):
    node 10:  h(L)= -1 (no left), h(R)= 1 -> diff = 2 -> NOT balanced!
  One bad node makes the whole tree unbalanced.`
        },
        {
          lang: 'rust',
          src: `type Link = Option<Box<TreeNode>>;
struct TreeNode { val: i32, left: Link, right: Link }

// Height in EDGES. Note the signed i32: empty tree is -1, which usize
// could never hold without underflowing to a huge number.
fn height(node: &Link) -> i32 {
    match node {
        None => -1,                              // base case
        Some(n) => 1 + height(&n.left).max(height(&n.right)),
    }
}

// O(n) balance check: one post-order pass returns height, or -2 = "unbalanced".
fn check(node: &Link) -> i32 {
    match node {
        None => -1,
        Some(n) => {
            let lh = check(&n.left);
            if lh == -2 { return -2; }           // bail early, stay O(n)
            let rh = check(&n.right);
            if rh == -2 { return -2; }
            if (lh - rh).abs() > 1 { return -2; } // this node is unbalanced
            1 + lh.max(rh)
        }
    }
}

fn is_balanced(root: &Link) -> bool { check(root) != -2 }`
        }
      ]
    },
    {
      heading: 'The Binary Search Tree property: search and insert',
      body: `So far a binary tree has been just a shape. A **binary search tree (BST)** adds one rule, the **BST property**, that makes it searchable: for *every* node, all values in its **left** subtree are **less** than the node's value, and all values in its **right** subtree are **greater**. Because this holds at every node, the tree is globally sorted in a way you can navigate with simple comparisons.

Picture looking up a word in a physical dictionary. You do not read from page one; you open the middle, see whether your word comes before or after, and throw away half the book. A BST automates exactly that: to **search** for a value, start at the root and compare. Equal, you found it. Smaller, the answer can only be in the left subtree, so go left and ignore everything on the right. Larger, go right. Each comparison discards an entire subtree, so the work is proportional to the **height** of the tree, not its size.

**Insertion** follows the identical path: search for where the value *would* be, and when you fall off the bottom into an empty spot (a \`None\` link), put the new node there. By construction the BST property is preserved, because you only ever land in the unique position that keeps everything ordered.

This is where the magic, and the catch, both live. If the tree stays **bushy** (balanced), its height is about log2(n), so search and insert are **O(log n)**: a million items take only about 20 comparisons. But the height depends entirely on the *order* of insertion. If you insert already-sorted data (1, 2, 3, 4, ...), every new value is larger than the last, so it always goes right, and the tree degenerates into a straight line, a **skewed** tree that is really just a linked list in disguise. Now the height is n, and search and insert collapse to **O(n)**. Same code, same property, but 1000x slower because of shape. This fragility is precisely the problem that self-balancing trees solve.

A Rust note: because each child is owned by its parent, recursive *insertion* threads a mutable reference down the tree. The borrow checker keeps you honest about not holding two mutable paths into the tree at once, which feels stricter than C++ but rules out a class of aliasing bugs.

### Common pitfalls

- Confusing the local rule with the global one. It is not enough that each node is bigger than its *immediate* left child; **every** node in the left subtree must be smaller. The next section's validation is exactly about this.
- Inserting sorted or reverse-sorted data into a plain BST. You will silently build a degenerate O(n) chain and wonder why your "log n" structure is slow. Shuffle the input, or use a balanced tree.
- Forgetting that a plain BST allows no easy duplicates rule by default; decide up front whether equal keys go left, go right, or are rejected.`,
      code: [
        {
          lang: 'text',
          src: `Searching for 6 in a BST. Each step throws away one whole subtree.

                 (8)        6 < 8  -> go LEFT, drop right subtree
                /   \\
            (3)       (10)         (10 and 14: never looked at)
            / \\          \\
         (1) (6)         (14)      6 > 3  -> go RIGHT
              ^
              found!                6 == 6 -> FOUND in 3 comparisons

  Visited path:  8 -> 3 -> 6   (length = height, not n)


  Insert order DECIDES the shape. Insert 1,2,3,4,5 in that order:

     (1)              a "tree" that is really a LINKED LIST
        \\
        (2)           search/insert now costs O(n), not O(log n).
           \\          Same BST rule, terrible shape.
           (3)
              \\
              (4)
                 \\
                 (5)`
        },
        {
          lang: 'rust',
          src: `type Link = Option<Box<TreeNode>>;
struct TreeNode { val: i32, left: Link, right: Link }

// SEARCH: follow comparisons down one path. O(h): O(log n) balanced, O(n) skewed.
fn contains(node: &Link, target: i32) -> bool {
    match node {
        None => false,                       // fell off the tree: not found
        Some(n) if target == n.val => true,
        Some(n) if target <  n.val => contains(&n.left,  target), // go left
        Some(n)                    => contains(&n.right, target), // go right
    }
}

// INSERT: search for the empty slot, then place the node. O(h).
fn insert(node: &mut Link, val: i32) {
    match node {
        None => *node = Some(Box::new(TreeNode { val, left: None, right: None })),
        Some(n) if val < n.val => insert(&mut n.left,  val),
        Some(n) if val > n.val => insert(&mut n.right, val),
        Some(_) => {} // val already present: ignore duplicates (a design choice)
    }
}

fn main() {
    let mut root: Link = None;
    for v in [8, 3, 10, 1, 6, 14] { insert(&mut root, v); }
    assert!(contains(&root, 6));
    assert!(!contains(&root, 7));
}`
        }
      ]
    },
    {
      heading: 'Validating a BST and lowest common ancestor',
      body: `Two questions show up constantly once you have a BST, and both have a clean and a sneaky-wrong solution.

**Is this tree a valid BST?** The trap is to check only that each node's left child is smaller and right child is larger. That is the *local* rule, and it is not enough: a node deep in the left subtree could still be larger than a far-up ancestor and violate the *global* order while every parent-child pair looks fine. The correct idea is to carry a **valid range** (a low and high bound) down the recursion. The root may be anything, but as you go **left** you tighten the *upper* bound to the parent's value (everything left must be smaller), and as you go **right** you tighten the *lower* bound. A node is valid only if it falls strictly inside the range it inherited. This checks the property globally in one O(n) pass. (A tidy alternative: do an in-order traversal and verify the output is strictly increasing, since in-order of a valid BST is sorted.)

**Lowest common ancestor (LCA)** asks, for two nodes p and q, the **deepest** node that has both of them in its subtree, in other words the point where their two paths from the root split apart. On an org chart it is the lowest manager both employees report to; in a file system it is the deepest shared folder of two files. For a general binary tree you search both subtrees, but a BST lets you cheat using the ordering: starting at the root, if **both** p and q are smaller than the current node, the meeting point must be to the left, so go left; if both are larger, go right; the moment they fall on **opposite sides** (or one equals the current node), you have found the split point, which is the LCA. That is a single root-to-node walk, so it is **O(h)** time and only **O(1)** extra space.

### Common pitfalls

- Validating with only the immediate-child comparison. It accepts invalid trees; always thread the inherited (low, high) bounds.
- Integer-bound overflow when seeding the range. If values can be the full \`i32\` range, use \`Option<i32>\` bounds (None = no bound) instead of \`i32::MIN\` and \`i32::MAX\`, or you risk a comparison edge case at the extremes.
- Using the general-tree LCA on a BST. It works but is slower; the BST version is a simple O(h) walk because the ordering tells you which way to turn.`,
      code: [
        {
          lang: 'text',
          src: `VALIDATION uses an inherited (low, high) range, not just neighbors.

   range (-inf, +inf)  (8)        8 in (-inf,+inf)?  ok
                       /   \\
   range (-inf, 8)  (3)     (10)  range (8, +inf)
                   /   \\        \\
   (-inf,3) (1)  (7) range (3,8) (14) range (10,+inf)

   Suppose the node under 3 on the right were 9 instead of 7:
      it must lie in (3, 8) ... but 9 > 8  -> INVALID.
   A local "9 > 3" check would wrongly accept it. The range catches it.


LCA of 1 and 6 in the BST:    LCA of 1 and 14:
        (8)                          (8)  <- 1 < 8 < 14: SPLIT here
        / \\                          / \\
     (3)   (10)                   (3)   (10)
     / \\                          1 and 14 fall on opposite sides
  (1) (6)  <- both < 8: go left   -> root 8 is the LCA
   1 and 6 split at node 3  -> LCA = 3`
        },
        {
          lang: 'rust',
          src: `type Link = Option<Box<TreeNode>>;
struct TreeNode { val: i32, left: Link, right: Link }

// VALIDATE: thread an inherited (low, high) open interval. O(n).
// Option bounds avoid i32::MIN/MAX overflow corner cases.
fn is_bst(node: &Link, low: Option<i32>, high: Option<i32>) -> bool {
    match node {
        None => true,                                  // empty is valid
        Some(n) => {
            if let Some(l) = low  { if n.val <= l { return false; } }
            if let Some(h) = high { if n.val >= h { return false; } }
            // going left tightens the HIGH bound; going right tightens LOW
            is_bst(&n.left,  low,           Some(n.val))
                && is_bst(&n.right, Some(n.val), high)
        }
    }
}

// LCA on a BST: turn left/right by comparison until p and q split. O(h).
fn lca(node: &Link, p: i32, q: i32) -> Option<i32> {
    let n = node.as_ref()?;
    if p < n.val && q < n.val      { lca(&n.left,  p, q) } // both smaller -> left
    else if p > n.val && q > n.val { lca(&n.right, p, q) } // both larger  -> right
    else                           { Some(n.val) }         // split: this is the LCA
}`
        }
      ]
    },
    {
      heading: 'Self-balancing trees: AVL, red-black, and B-trees',
      body: `We saw the fatal flaw of the plain BST: feed it sorted data and it rots into an O(n) chain. **Self-balancing trees** fix this once and for all by doing a little extra bookkeeping on every insert and delete to *guarantee* the tree stays short, so the height is always about log(n) no matter what order the data arrives. You rarely write these from scratch, but you use them constantly, so it is worth knowing what each one is for.

An **AVL tree** is a BST that stores, at each node, the height difference between its two subtrees (the **balance factor**) and keeps that difference within plus or minus 1. When an insert pushes some node out of balance, the tree performs a **rotation**, a small local rearrangement of three or four nodes that lowers the tall side and raises the short side while preserving the BST ordering. AVL trees are very strictly balanced, so lookups are extremely fast, at the cost of a few more rotations during inserts. They shine in read-heavy workloads.

A **red-black tree** is a looser, more relaxed cousin. It colors each node red or black and enforces rules (no two reds in a row; every root-to-leaf path has the same number of blacks) that keep the longest path at most twice the shortest. It is less rigidly balanced than AVL but needs fewer rotations on updates, which makes it the workhorse behind many standard libraries. Rust's own **\`BTreeMap\`** and **\`BTreeSet\`** give you ordered map and set behavior with guaranteed O(log n) operations and in-order iteration, which is exactly the practical, batteries-included payoff of this whole chapter.

A **B-tree** generalizes the idea for **disk and database** storage. Instead of two children, each node holds *many* keys and has *many* children, so the tree is extremely **shallow**, only a handful of levels deep even for billions of rows. Why many children? Because reading from disk is thousands of times slower than reading from memory, and a B-tree node is sized to one disk page, so each single disk read makes a decision among hundreds of children instead of just two. This is why nearly every **database index** (PostgreSQL, MySQL, SQLite) is a B-tree or its B+ variant: it minimizes slow disk reads. The same reasoning makes B-trees friendlier to CPU caches in memory, which is why Rust's standard \`BTreeMap\` uses a B-tree internally rather than a binary one.

### Common pitfalls

- Implementing rotations by hand under time pressure. For coursework and interviews, understand *why* rotations restore balance; in real code, reach for \`BTreeMap\` / \`BTreeSet\` and let the standard library do it.
- Assuming a hash map is always better than an ordered tree. A \`HashMap\` gives average O(1) lookup but **no order**; when you need sorted iteration, range queries, or the smallest/largest key, a \`BTreeMap\` is the right tool despite its O(log n) cost.
- Thinking a B-tree is binary. Its whole point is a high branching factor that keeps the tree shallow to cut disk reads; that is a fundamentally different trade-off from AVL or red-black trees.`,
      code: [
        {
          lang: 'text',
          src: `WHY balancing matters: insert sorted 1..7 two ways.

  Plain BST (degenerates):        Balanced BST:
     (1)                                  (4)
        \\                                 /   \\
        (2)        height = 6          (2)     (6)
           \\       => O(n)             / \\     / \\
           (3)                       (1)(3) (5)(7)
              \\                      height = 2 => O(log n)
              ...                    same 7 keys, far shorter


  AVL ROTATION fixes a tall-left imbalance (a "right rotation"):

        (z)                       (y)
        / \\        rotate         /   \\
     (y)  T4       right       (x)     (z)
     / \\         -------->     / \\     / \\
   (x) T3                    T1 T2   T3 T4
   / \\
 T1  T2     BST order is preserved; the height drops by one.`
        },
        {
          lang: 'rust',
          src: `use std::collections::BTreeMap;

// In real Rust you almost never hand-roll a balanced tree:
// BTreeMap is a cache-friendly B-tree with guaranteed O(log n) ops
// AND sorted iteration (the thing a HashMap cannot give you).
fn main() {
    let mut index: BTreeMap<i32, &str> = BTreeMap::new();
    // Insert in messy order...
    for (k, v) in [(8, "h"), (3, "c"), (10, "j"), (1, "a"), (6, "f")] {
        index.insert(k, v);              // stays balanced automatically
    }

    // ...iterate back in SORTED key order, for free:
    for (k, v) in &index {
        print!("{k}:{v} ");              // 1:a 3:c 6:f 8:h 10:j
    }
    println!();

    // Range query: every key in [3, 8] — a B-tree superpower a HashMap lacks.
    let slice: Vec<_> = index.range(3..=8).map(|(k, _)| *k).collect();
    assert_eq!(slice, vec![3, 6, 8]);
}`
        }
      ]
    }
  ],
  takeaways: [
    'A tree branches: one root, each node one parent and any children, leaves at the bottom, no cycles. Depth counts down from the root; height counts up from the leaves.',
    'Model a child as Option<Box<TreeNode>>: None is "no child", Box owns it on the heap, and dropping the root frees the whole tree automatically.',
    'Use Rc<RefCell<TreeNode>> only when you need shared ownership or interior mutation (LeetCode style); it moves borrow checks to run time and can panic.',
    'Recursion is depth-first search; pre/in/post-order differ only in WHEN you handle the node. In-order of a BST yields sorted values.',
    'Level-order (BFS) uses a VecDeque: push_back children, pop_front to process. Snapshot queue.len() to group by level. Time O(n), space O(width).',
    'Height = 1 + max(child heights), empty = -1; store it in a SIGNED type because usize cannot go negative. Balance: every node\'s subtree heights differ by at most 1, checkable in one O(n) pass.',
    'The BST property is global: ALL of the left subtree is smaller, ALL of the right is larger. Search and insert follow one comparison path, costing O(height).',
    'Balanced means height about log n and O(log n) operations; sorted input skews a plain BST into an O(n) chain. Same rule, ruinous shape.',
    'Validate a BST by threading an inherited (low, high) range, not just neighbor checks; find LCA on a BST by walking down until the two targets split left vs right, in O(h).',
    'Self-balancing trees (AVL, red-black) guarantee log n via rotations; B-trees use a high branching factor for shallow disk-friendly indexes. In Rust, reach for BTreeMap / BTreeSet.'
  ],
  cheatsheet: [
    { label: 'Option<Box<TreeNode>>', value: 'Owning child link: None = empty, Box = heap node' },
    { label: 'Rc<RefCell<TreeNode>>', value: 'Shared + interior-mutable node (LeetCode style)' },
    { label: 'Pre-order N,L,R', value: 'Node first; copy a tree / parent before children' },
    { label: 'In-order L,N,R', value: 'Node in middle; gives SORTED output for a BST' },
    { label: 'Post-order L,R,N', value: 'Node last; delete a tree / sum a folder' },
    { label: 'DFS time / space', value: 'O(n) time, O(h) call-stack space' },
    { label: 'VecDeque push_back/pop_front', value: 'O(1) queue ops for level-order BFS' },
    { label: 'BFS time / space', value: 'O(n) time, O(w) where w = widest level' },
    { label: 'height(node)', value: '1 + max(h(left), h(right)); empty = -1 (use i32!)' },
    { label: 'BST search / insert', value: 'O(log n) balanced, O(n) skewed; cost = O(height)' },
    { label: 'Validate BST', value: 'Thread (low, high) range down; one O(n) pass' },
    { label: 'LCA on a BST', value: 'Walk down until targets split; O(h) time, O(1) space' },
    { label: 'std::collections::BTreeMap', value: 'B-tree: O(log n) ops + sorted iteration & range()' },
    { label: 'AVL vs red-black vs B-tree', value: 'Strict-balance / loose-balance / high-fanout disk index' }
  ]
}

export default note
