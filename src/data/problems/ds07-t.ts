import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch07-t-001',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Height Versus Depth',
    prompt: `Look at this small tree (the root is at the top):

                 (8)
                /   \\
             (3)     (10)
             / \\        \\
          (1) (6)       (14)

Two words get confused all the time: depth and height. What is the depth of node 6, and what is the height of node 10? Explain in one sentence each how you counted.`,
    hints: [
      'Depth is measured from the root downward; height is measured from a node down to its deepest leaf.',
      'Count edges, not nodes. The root has depth 0, and a leaf has height 0.',
    ],
    solution: `The depth of node 6 is 2, because depth counts the edges on the path from the root down to the node: root 8 to 3 is one edge, and 3 to 6 is a second, so 6 sits two edges below the root. The height of node 10 is 1, because height counts the edges on the longest path going downward from the node to a leaf: 10 has only the child 14, so the longest downward path is the single edge 10 to 14. The key idea is that depth counts up toward the root and height counts down toward the leaves, so they are usually different numbers for the same node.`,
    tags: ['tree', 'height', 'depth'],
  },
  {
    id: 'ds-ch07-t-002',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Why Option Wraps the Box',
    prompt: `A classmate declares a binary tree node child link in Rust like this:

    struct TreeNode { val: i32, left: Box<TreeNode>, right: Box<TreeNode> }

They left out the Option that the chapter uses around each Box. What goes wrong with this declaration, and what does adding Option fix?`,
    hints: [
      'Ask what value you would store for a node that has no left child.',
      'Think about whether a node always contains another node, and what that does to its size.',
    ],
    solution: `Without the Option there is no way to represent "no child here", because a Box<TreeNode> must always point at an actual node. That means every node would always contain two more nodes, which would always contain two more, forever, so the type has no end and the compiler reports it as having infinite size. Wrapping each link as Option<Box<TreeNode>> fixes both problems at once: None means the child slot is empty (a leaf has two None children), and Some(boxed_node) means there is a child. The Option supplies the base case that lets the tree, and the recursion over it, actually stop.`,
    tags: ['tree', 'option', 'box'],
  },
  {
    id: 'ds-ch07-t-003',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Predict the Three Traversals',
    prompt: `Hand-trace all three depth-first traversals of this tree and write the exact output sequence for each:

                 (8)
                /   \\
             (3)     (10)
             / \\        \\
          (1) (6)       (14)

Give the pre-order (Node, Left, Right), in-order (Left, Node, Right), and post-order (Left, Right, Node) sequences.`,
    hints: [
      'The prefix tells you where the Node goes; Left always comes before Right.',
      'For in-order on a search tree, the output should come out sorted, which is a handy correctness check.',
    ],
    solution: `Pre-order visits the node first, so it emits 8, 3, 1, 6, 10, 14. In-order visits the left subtree, then the node, then the right subtree, giving 1, 3, 6, 8, 10, 14, which is sorted because this is a binary search tree. Post-order visits both children before the node, giving 1, 6, 3, 14, 10, 8. All three touch every node exactly once, differing only in the moment the node's own value is emitted relative to descending into its children.`,
    tags: ['tree', 'traversal', 'dfs'],
  },
  {
    id: 'ds-ch07-t-004',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Recursion Is Depth-First Search',
    prompt: `The chapter claims that ordinary recursion over a tree "is" depth-first search, and that you do not need any explicit stack to go deep. Where does the stack come from then, and why does plain recursion naturally dive deep down one branch before exploring a sibling branch?`,
    hints: [
      'Think about what happens to a function call that is paused while it waits for an inner call to return.',
      'Consider the order in which the recursive calls on the left and right children actually run.',
    ],
    solution: `When a function recurses into its left child, that call must fully finish before control returns and the right child is visited. While the left call runs it can recurse into its own left child, and so on, so the program keeps plunging down the leftmost branch first. The "stack" is the program's own call stack: each paused function frame remembers where to resume, which is exactly the bookkeeping an explicit stack would do. So recursion is depth-first search where the call stack silently plays the role of the explicit stack, and it uses O(h) space because at most h frames (one per level on the current path) are paused at once.`,
    tags: ['tree', 'dfs', 'recursion'],
  },
  {
    id: 'ds-ch07-t-005',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why a Vec Makes BFS Quadratic',
    prompt: `A student writes a level-order (breadth-first) traversal but uses a plain Vec as the queue, dequeuing with queue.remove(0) to take the front element. The chapter warns this turns an O(n) traversal into O(n squared). Explain why remove(0) is the culprit, and which type fixes it.`,
    hints: [
      'Think about what a Vec must physically do to the remaining elements when you delete the very first one.',
      'A double-ended queue can remove from the front cheaply.',
    ],
    solution: `A Vec stores its elements in one contiguous block, so removing the element at index 0 forces every remaining element to shift one slot to the left to close the gap, which costs O(n) work for a single removal. Since BFS removes the front once per node, doing n removals each costing up to O(n) makes the whole traversal O(n squared). The fix is std::collections::VecDeque, a double-ended queue: pop_front removes the front in O(1) (and push_back adds to the rear in O(1)), so the traversal stays O(n) overall.`,
    tags: ['tree', 'bfs', 'vecdeque'],
  },
  {
    id: 'ds-ch07-t-006',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'The usize Height Trap',
    prompt: `The chapter defines tree height in edges, with the convention that an empty tree has height -1 and a leaf has height 0. It insists you store height in a signed type like i32 and warns against usize. What concretely goes wrong if you write the height function returning usize?`,
    hints: [
      'usize is an unsigned type, so it cannot hold a negative value.',
      'Think about what value an unsigned integer takes if you try to make it -1.',
    ],
    solution: `usize is Rust's unsigned integer type, so it has no way to represent the -1 that the empty-tree base case needs. If you try to produce -1 in a usize it underflows and wraps around to an enormous positive number (near the maximum usize value). That huge number then flows into the "1 plus the max of the children" arithmetic and corrupts every height above it, so a normal-looking tree reports absurd heights. Using a signed type like i32 lets -1 be a genuine -1, which is why the chapter calls this a common Rust-specific bug that Python and C do not surface the same way.`,
    tags: ['tree', 'height', 'usize'],
  },
  {
    id: 'ds-ch07-t-007',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'In-Order Is Sorted Only for a BST',
    prompt: `A student concludes: "In-order traversal always prints a binary tree's values in sorted order." Show this is false by giving a tiny binary tree whose in-order output is NOT sorted, and state the precise condition under which in-order really is guaranteed to be sorted.`,
    hints: [
      'In-order being sorted is a property of binary SEARCH trees, not of binary trees in general.',
      'Build any tiny tree that breaks the ordering rule and trace Left, Node, Right.',
    ],
    solution: `Take the tree with root 1, left child 5, and right child 2. In-order (Left, Node, Right) visits 5, then 1, then 2, giving the sequence 5, 1, 2, which is not sorted. In-order is guaranteed to come out sorted only for a binary search tree, where every node's entire left subtree is smaller and entire right subtree is larger. In-order yields sorted output precisely because that ordering rule holds at every node; a plain binary tree carries no such rule, so its in-order sequence can be in any order.`,
    tags: ['bst', 'traversal', 'inorder'],
  },
  {
    id: 'ds-ch07-t-008',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'The Naive Balance Check Is Quadratic',
    prompt: `To test whether a tree is height-balanced, a natural approach is: at each node, call a height function on the left subtree and on the right subtree, check that they differ by at most 1, then recurse into both children. The chapter says this is O(n squared) in the worst case, while a smarter version is O(n). Explain where the wasted work comes from and what the smarter version does differently.`,
    hints: [
      'Computing a height already walks the whole subtree below a node.',
      'Ask how many times a deep node gets visited if every ancestor recomputes its height.',
    ],
    solution: `Calling the height function at a node walks every node in that subtree once. The naive balance check does this at every node, so a deep node gets re-walked once for itself plus once for each of its ancestors, meaning the same nodes are scanned over and over. For a tall, thin tree this piles up to O(n squared) total work. The smarter version does a single post-order pass where one function returns the subtree's height and signals imbalance at the same time (using a sentinel value like -2 to mean "already unbalanced below"). Because each node computes its height once from its children's already-known heights and the imbalance check rides along for free, every node is touched exactly once, giving O(n).`,
    tags: ['tree', 'height', 'complexity'],
  },
  {
    id: 'ds-ch07-t-009',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Same Keys, Two Shapes',
    prompt: `You build one BST by inserting the keys in the order 4, 2, 6, 1, 3, 5, 7, and a second BST by inserting the same seven keys in sorted order 1, 2, 3, 4, 5, 6, 7. For each tree, give its height (in edges) and the resulting big-O cost of a search. Why do identical keys produce such different performance?`,
    hints: [
      'Sketch each tree as you insert; insertion always falls into the unique sorted position.',
      'Search cost is proportional to the height of the tree, not to the number of keys.',
    ],
    solution: `Inserting 4, 2, 6, 1, 3, 5, 7 builds a bushy, balanced tree: 4 is the root, 2 and 6 are its children, and 1, 3, 5, 7 are the leaves, giving height 2 and search cost about O(log n). Inserting 1, 2, 3, 4, 5, 6, 7 in sorted order makes every new key larger than all before it, so each one attaches as the right child of the previous, producing a straight chain of 7 nodes with height 6 (a linked list in disguise) and search cost O(n). The keys are identical, but a BST's shape, and therefore its speed, is decided entirely by the insertion order, because search cost tracks the height. This fragility is exactly the problem self-balancing trees solve.`,
    tags: ['bst', 'shape', 'complexity'],
  },
  {
    id: 'ds-ch07-t-010',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Local Check Is Not Enough',
    prompt: `Here is a buggy "BST validator" idea: at each node, just confirm its left child is smaller and its right child is larger, then recurse. Give a concrete tree that this local check wrongly accepts as a valid BST, and explain the correct technique that catches it.`,
    hints: [
      'The BST rule is global: every node in the left subtree must be smaller than the node, not just the immediate child.',
      'Build a tree where a grandchild violates an ancestor while every parent-child pair looks fine.',
    ],
    solution: `Consider root 10 with left child 5, and let 5 have a right child of 12. Every immediate parent-child pair passes the local check: 5 < 10, and 12 > 5. But the tree is not a valid BST, because 12 lives in 10's left subtree yet 12 > 10, breaking the global ordering. The fix is to thread an inherited valid range (a low and high bound) down the recursion: going left tightens the upper bound to the parent's value, going right tightens the lower bound, and each node is valid only if it falls strictly inside the range it inherited. Here 12 inherits the bound "must be less than 10" from going left at the root, so 12 is correctly rejected. This range check verifies the property globally in one O(n) pass.`,
    tags: ['bst', 'validation', 'recursion'],
  },
  {
    id: 'ds-ch07-t-011',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'LCA on a BST Walks One Path',
    prompt: `On a general binary tree, finding the lowest common ancestor (LCA) of two nodes means searching both subtrees. But on a BST you can find it with a single walk from the root, in O(h) time and O(1) extra space. Trace the BST below to find the LCA of 1 and 6, and separately the LCA of 1 and 14, and state the rule that decides which way to turn.

                 (8)
                /   \\
             (3)     (10)
             / \\        \\
          (1) (6)       (14)`,
    hints: [
      'At each node compare both targets to the current value; if both are smaller go left, if both are larger go right.',
      'The LCA is the first node where the two targets fall on opposite sides (or where one equals the current node).',
    ],
    solution: `Starting at 8 for targets 1 and 6: both are less than 8, so go left to 3. At 3, the value 1 is less than 3 but 6 is greater than 3, so the targets split here and 3 is the LCA of 1 and 6. For targets 1 and 14 starting at 8: 1 is less than 8 while 14 is greater, so they already split at the root and 8 is the LCA. The rule is: if both targets are smaller than the current node go left, if both are larger go right, and the moment they fall on opposite sides (or one equals the current node) you have reached the split point, which is the LCA. Because you only ever descend one path and never back up, this is O(h) time and O(1) extra space, faster than the general-tree approach.`,
    tags: ['bst', 'lca', 'recursion'],
  },
  {
    id: 'ds-ch07-t-012',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'BTreeMap or HashMap?',
    prompt: `A teammate says "a HashMap is O(1) average lookup and a BTreeMap is O(log n), so just always use HashMap." Describe two distinct situations from the chapter where a BTreeMap (Rust's B-tree-backed ordered map) is the right choice despite its higher per-lookup cost, and say briefly why a B-tree, rather than a binary tree, is what databases put on disk.`,
    hints: [
      'A HashMap gives fast lookup but no ordering at all.',
      'Think about iterating keys in order, asking for a range, or finding the smallest/largest key.',
    ],
    solution: `A BTreeMap wins whenever you need order, which a HashMap cannot give. First, when you need to iterate the keys in sorted order or find the smallest or largest key, a BTreeMap delivers that directly while a HashMap would force you to collect and sort. Second, for range queries such as "every key between 3 and 8", a BTreeMap supports range(3..=8) cheaply, which a HashMap cannot do at all. As for disk: a B-tree gives each node many keys and many children instead of just two, so the tree stays very shallow (only a few levels even for billions of rows). Since a disk read is thousands of times slower than a memory read and each node is sized to one disk page, one read decides among hundreds of children rather than two, minimizing the slow disk reads, which is why database indexes use B-trees rather than binary trees.`,
    tags: ['btreemap', 'hashmap', 'b-tree'],
  },
]

export default problems
