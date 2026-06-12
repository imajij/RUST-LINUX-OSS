import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch07-c-016',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Kth Smallest in BST',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn kth_smallest(root: &Tree, k: i32) -> i32 returning the k-th smallest value in the BST (1-indexed).
You may assume k is always valid (1 <= k <= number of nodes).
Example: BST 3->(1->(_,2),4) with k=1 returns 1; with k=2 returns 2; with k=3 returns 3.`,
    hints: [
      'An inorder traversal of a BST visits nodes in sorted order.',
      'Use a counter that increments on each inorder visit; stop when it reaches k.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn kth_smallest(root: &Tree, k: i32) -> i32 {
    let mut count = 0;
    let mut result = 0;
    fn inorder(root: &Tree, count: &mut i32, k: i32, result: &mut i32) {
        if let Some(n) = root {
            inorder(&n.left, count, k, result);
            *count += 1;
            if *count == k { *result = n.val; return; }
            inorder(&n.right, count, k, result);
        }
    }
    inorder(root, &mut count, k, &mut result);
    result
}

fn main() {
    let bst = node(3, node(1, None, leaf(2)), node(4, None, None));
    assert_eq!(kth_smallest(&bst, 1), 1);
    assert_eq!(kth_smallest(&bst, 2), 2);
    assert_eq!(kth_smallest(&bst, 3), 3);
    let bst2 = node(5, node(3, leaf(2), leaf(4)), node(6, None, None));
    assert_eq!(kth_smallest(&bst2, 3), 4);
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn kth_smallest(root: &Tree, k: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['bst', 'inorder', 'kth'],
  },
  {
    id: 'ds-ch07-c-017',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Range Sum of BST',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn range_sum_bst(root: &Tree, lo: i32, hi: i32) -> i32 returning the sum of all node values in the inclusive range [lo, hi].
Use BST properties to prune unnecessary subtrees.
Example: BST 10->(5->(3,7),15->(_,18)) with range [7,15] returns 32 (7+10+15).`,
    hints: [
      'Only recurse into the left subtree if the current node value is greater than lo.',
      'Only recurse into the right subtree if the current node value is less than hi.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn range_sum_bst(root: &Tree, lo: i32, hi: i32) -> i32 {
    match root {
        None => 0,
        Some(n) => {
            let mut s = 0;
            if n.val >= lo && n.val <= hi { s += n.val; }
            if n.val > lo { s += range_sum_bst(&n.left, lo, hi); }
            if n.val < hi { s += range_sum_bst(&n.right, lo, hi); }
            s
        }
    }
}

fn main() {
    let bst = node(10, node(5, leaf(3), leaf(7)), node(15, None, leaf(18)));
    assert_eq!(range_sum_bst(&bst, 7, 15), 32);
    assert_eq!(range_sum_bst(&bst, 6, 10), 17);
    assert_eq!(range_sum_bst(&None, 1, 100), 0);
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn range_sum_bst(root: &Tree, lo: i32, hi: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(range_sum_bst(&None, 1, 100), 0);
    println!("ok");
}`,
    tags: ['bst', 'range', 'pruning'],
  },
  {
    id: 'ds-ch07-c-018',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Diameter of Binary Tree',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn diameter(root: &Tree) -> i32 returning the length of the longest path between any two nodes measured in edges.
The path may or may not pass through the root. An empty tree or single node returns 0.
Example: tree 1->(2->(4,5),3) has diameter 3 (path 4-2-1-3 or 5-2-1-3).`,
    hints: [
      'For each node the candidate diameter is the sum of the heights of its left and right subtrees.',
      'Use a helper that returns the height while updating a shared maximum.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn diameter_helper(root: &Tree, best: &mut i32) -> i32 {
    match root {
        None => 0,
        Some(n) => {
            let l = diameter_helper(&n.left, best);
            let r = diameter_helper(&n.right, best);
            *best = (*best).max(l + r);
            1 + l.max(r)
        }
    }
}

fn diameter(root: &Tree) -> i32 {
    let mut best = 0;
    diameter_helper(root, &mut best);
    best
}

fn main() {
    let t = node(1, node(2, leaf(4), leaf(5)), leaf(3));
    assert_eq!(diameter(&t), 3);
    assert_eq!(diameter(&None), 0);
    assert_eq!(diameter(&leaf(1)), 0);
    let t2 = node(1, node(2, node(3, leaf(4), None), None), None);
    assert_eq!(diameter(&t2), 3);
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn diameter(root: &Tree) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(diameter(&None), 0);
    println!("ok");
}`,
    tags: ['tree', 'diameter', 'dfs'],
  },
  {
    id: 'ds-ch07-c-019',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Height-Balanced Check',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn is_balanced(root: &Tree) -> bool returning true if the tree is height-balanced.
A tree is height-balanced if for every node the heights of its left and right subtrees differ by at most 1.
Example: tree 1->(2->(4,5),3) is balanced; 1->(2->(3->(4,_),_),_) is not.`,
    hints: [
      'Compute left and right subtree heights and check their difference at every node.',
      'Short-circuit early if a subtree is already unbalanced.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn height(root: &Tree) -> i32 {
    match root {
        None => 0,
        Some(n) => 1 + height(&n.left).max(height(&n.right)),
    }
}

fn is_balanced(root: &Tree) -> bool {
    match root {
        None => true,
        Some(n) => {
            let diff = (height(&n.left) - height(&n.right)).abs();
            diff <= 1 && is_balanced(&n.left) && is_balanced(&n.right)
        }
    }
}

fn main() {
    let balanced = node(1, node(2, leaf(4), leaf(5)), leaf(3));
    assert!(is_balanced(&balanced));
    let unbalanced = node(1, node(2, node(3, leaf(4), None), None), None);
    assert!(!is_balanced(&unbalanced));
    assert!(is_balanced(&None));
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn is_balanced(root: &Tree) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert!(is_balanced(&None));
    println!("ok");
}`,
    tags: ['tree', 'balanced', 'height'],
  },
  {
    id: 'ds-ch07-c-020',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Lowest Common Ancestor in BST',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn lca_bst(root: &Tree, p: i32, q: i32) -> i32 returning the value of the lowest common ancestor of nodes with values p and q in a BST.
Assume both p and q exist in the tree. The LCA is the deepest node that has both p and q as descendants (including itself).
Example: BST 6->(2->(0,4->(3,5)),8->(7,9)), lca_bst(2,8)=6; lca_bst(2,4)=2.`,
    hints: [
      'In a BST, if both p and q are less than the current node, the LCA is in the left subtree.',
      'If both are greater, go right. Otherwise the current node is the LCA.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn lca_bst(root: &Tree, p: i32, q: i32) -> i32 {
    match root {
        None => -1,
        Some(n) => {
            if p < n.val && q < n.val { lca_bst(&n.left, p, q) }
            else if p > n.val && q > n.val { lca_bst(&n.right, p, q) }
            else { n.val }
        }
    }
}

fn main() {
    let bst = node(6, node(2, leaf(0), node(4, leaf(3), leaf(5))), node(8, leaf(7), leaf(9)));
    assert_eq!(lca_bst(&bst, 2, 8), 6);
    assert_eq!(lca_bst(&bst, 2, 4), 2);
    assert_eq!(lca_bst(&bst, 3, 5), 4);
    assert_eq!(lca_bst(&bst, 7, 9), 8);
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn lca_bst(root: &Tree, p: i32, q: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['bst', 'lca', 'recursion'],
  },
  {
    id: 'ds-ch07-c-021',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Postorder Traversal',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn postorder_traversal(root: &Tree) -> Vec<i32> returning node values in left-right-root order.
An empty tree returns an empty vector.
Example: tree 1->(2->(4,5),3->(6,_)) returns [4,5,2,6,3,1].`,
    hints: [
      'Visit left subtree, then right subtree, then push the current node value.',
      'This is the reverse of a modified preorder traversal.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn postorder(root: &Tree, out: &mut Vec<i32>) {
    if let Some(n) = root {
        postorder(&n.left, out);
        postorder(&n.right, out);
        out.push(n.val);
    }
}

fn postorder_traversal(root: &Tree) -> Vec<i32> {
    let mut out = Vec::new();
    postorder(root, &mut out);
    out
}

fn main() {
    let t = node(1, node(2, leaf(4), leaf(5)), node(3, leaf(6), None));
    assert_eq!(postorder_traversal(&t), vec![4, 5, 2, 6, 3, 1]);
    assert_eq!(postorder_traversal(&None), vec![]);
    assert_eq!(postorder_traversal(&leaf(7)), vec![7]);
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn postorder_traversal(root: &Tree) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(postorder_traversal(&None), vec![]);
    println!("ok");
}`,
    tags: ['tree', 'traversal', 'postorder'],
  },
  {
    id: 'ds-ch07-c-022',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Right Side View',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn right_side_view(root: &Tree) -> Vec<i32> returning the values of the rightmost node at each depth level, top to bottom.
An empty tree returns an empty vector.
Example: tree 1->(2->(_,5),3->(_,4)) returns [1,3,4].`,
    hints: [
      'Use BFS (level-order traversal) and record the last non-None node seen at each level.',
      'Process all nodes at one level into a next-level queue, then pick the last value seen.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn right_side_view(root: &Tree) -> Vec<i32> {
    let mut result = Vec::new();
    if root.is_none() { return result; }
    let mut queue: std::collections::VecDeque<&Tree> = std::collections::VecDeque::new();
    queue.push_back(root);
    while !queue.is_empty() {
        let mut rightmost = 0;
        let mut count = 0;
        let mut next: std::collections::VecDeque<&Tree> = std::collections::VecDeque::new();
        for t in queue.drain(..) {
            if let Some(n) = t {
                rightmost = n.val;
                count += 1;
                next.push_back(&n.left);
                next.push_back(&n.right);
            }
        }
        if count > 0 { result.push(rightmost); }
        queue = next;
    }
    result
}

fn main() {
    let t = node(1, node(2, None, leaf(5)), node(3, None, leaf(4)));
    assert_eq!(right_side_view(&t), vec![1, 3, 4]);
    assert_eq!(right_side_view(&None), Vec::<i32>::new());
    let t2 = node(1, leaf(2), None);
    assert_eq!(right_side_view(&t2), vec![1, 2]);
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn right_side_view(root: &Tree) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(right_side_view(&None), Vec::<i32>::new());
    println!("ok");
}`,
    tags: ['tree', 'bfs', 'level-order'],
  },
  {
    id: 'ds-ch07-c-023',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Count Good Nodes',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn count_good_nodes(root: &Tree) -> i32 counting nodes where the node value is greater than or equal to every ancestor along the path from the root.
A node with no ancestors (the root) is always good.
Example: tree 3->(1->(3,_),4->(1,5)) has 4 good nodes (3,3,4,5).`,
    hints: [
      'Pass the maximum value seen so far from the root down through the recursion.',
      'A node is good if its value is at least the running maximum.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn count_good_nodes_helper(root: &Tree, max_so_far: i32) -> i32 {
    match root {
        None => 0,
        Some(n) => {
            let good = if n.val >= max_so_far { 1 } else { 0 };
            let new_max = max_so_far.max(n.val);
            good + count_good_nodes_helper(&n.left, new_max) + count_good_nodes_helper(&n.right, new_max)
        }
    }
}

fn count_good_nodes(root: &Tree) -> i32 {
    count_good_nodes_helper(root, i32::MIN)
}

fn main() {
    let t = node(3, node(1, node(3, None, None), None), node(4, leaf(1), leaf(5)));
    assert_eq!(count_good_nodes(&t), 4);
    assert_eq!(count_good_nodes(&leaf(1)), 1);
    assert_eq!(count_good_nodes(&None), 0);
    let t2 = node(3, node(3, node(4, None, None), leaf(2)), None);
    assert_eq!(count_good_nodes(&t2), 3);
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn count_good_nodes(root: &Tree) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(count_good_nodes(&None), 0);
    println!("ok");
}`,
    tags: ['tree', 'dfs', 'path-max'],
  },
  {
    id: 'ds-ch07-c-024',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Build Tree from Preorder and Inorder',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn build_tree(preorder: &[i32], inorder: &[i32]) -> Tree that reconstructs a binary tree from its preorder and inorder traversals.
Assume all values are distinct. The function must return the unique tree that produces both traversals.
Example: preorder=[3,9,20,15,7] and inorder=[9,3,15,20,7] builds the tree 3->(9,20->(15,7)).`,
    hints: [
      'The first element of preorder is always the root.',
      'Find that root in inorder to split left and right subtrees, then recurse on each half.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn build_tree(preorder: &[i32], inorder: &[i32]) -> Tree {
    if preorder.is_empty() { return None; }
    let root_val = preorder[0];
    let mid = inorder.iter().position(|&x| x == root_val).unwrap();
    Some(Box::new(Node {
        val: root_val,
        left: build_tree(&preorder[1..mid+1], &inorder[..mid]),
        right: build_tree(&preorder[mid+1..], &inorder[mid+1..]),
    }))
}

fn inorder_vec(root: &Tree) -> Vec<i32> {
    match root {
        None => vec![],
        Some(n) => {
            let mut v = inorder_vec(&n.left);
            v.push(n.val);
            v.extend(inorder_vec(&n.right));
            v
        }
    }
}

fn preorder_vec(root: &Tree) -> Vec<i32> {
    match root {
        None => vec![],
        Some(n) => {
            let mut v = vec![n.val];
            v.extend(preorder_vec(&n.left));
            v.extend(preorder_vec(&n.right));
            v
        }
    }
}

fn main() {
    let pre = vec![3, 9, 20, 15, 7];
    let ino = vec![9, 3, 15, 20, 7];
    let t = build_tree(&pre, &ino);
    assert_eq!(inorder_vec(&t), ino);
    assert_eq!(preorder_vec(&t), pre);
    let pre2 = vec![1];
    let ino2 = vec![1];
    let t2 = build_tree(&pre2, &ino2);
    assert_eq!(inorder_vec(&t2), ino2);
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn build_tree(preorder: &[i32], inorder: &[i32]) -> Tree {
    // TODO
    todo!()
}

fn main() {
    let t = build_tree(&[], &[]);
    assert!(t.is_none());
    println!("ok");
}`,
    tags: ['tree', 'construction', 'preorder', 'inorder'],
  },
  {
    id: 'ds-ch07-c-025',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Lowest Common Ancestor in Binary Tree',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn lca(root: &Tree, p: i32, q: i32) -> i32 returning the value of the lowest common ancestor of p and q in a general binary tree.
Assume both p and q are present. A node can be its own descendant.
Example: tree 3->(5->(6,2->(7,4)),1->(0,8)), lca(5,1)=3; lca(5,4)=5.`,
    hints: [
      'If the current node equals p or q, return it immediately without searching further.',
      'If left and right recursive calls both return non-None, the current node is the LCA.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn lca_helper(root: &Tree, p: i32, q: i32) -> Option<i32> {
    match root {
        None => None,
        Some(n) => {
            if n.val == p || n.val == q { return Some(n.val); }
            let l = lca_helper(&n.left, p, q);
            let r = lca_helper(&n.right, p, q);
            match (l, r) {
                (Some(_), Some(_)) => Some(n.val),
                (Some(v), None) | (None, Some(v)) => Some(v),
                _ => None,
            }
        }
    }
}

fn lca(root: &Tree, p: i32, q: i32) -> i32 {
    lca_helper(root, p, q).unwrap_or(-1)
}

fn main() {
    let t = node(3, node(5, leaf(6), node(2, leaf(7), leaf(4))), node(1, leaf(0), leaf(8)));
    assert_eq!(lca(&t, 5, 1), 3);
    assert_eq!(lca(&t, 5, 4), 5);
    assert_eq!(lca(&t, 6, 4), 5);
    assert_eq!(lca(&t, 7, 8), 3);
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn lca(root: &Tree, p: i32, q: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['tree', 'lca', 'dfs'],
  },
  {
    id: 'ds-ch07-c-026',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Serialize and Deserialize Binary Tree',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn serialize(root: &Tree) -> Vec<Option<i32>> that encodes the tree into a level-order Vec where None marks absent nodes, and fn deserialize(data: &[Option<i32>]) -> Tree that reconstructs the tree.
Trailing None values may be omitted. Round-tripping must reproduce the same serialization.
Example: tree 1->(2,3->(4,5)) serializes to [Some(1),Some(2),Some(3),None,None,Some(4),Some(5)].`,
    hints: [
      'Serialize using BFS, pushing Some(val) for real nodes and None for absent children.',
      'Deserialize using BFS as well: pair each non-None parent with the next two values in the array.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn build(vals: &[Option<i32>]) -> Tree {
    if vals.is_empty() { return None; }
    if vals[0].is_none() { return None; }
    let root = Some(Box::new(Node { val: vals[0].unwrap(), left: None, right: None }));
    let mut queue: std::collections::VecDeque<*mut Node> = std::collections::VecDeque::new();
    if let Some(ref b) = root { queue.push_back(b.as_ref() as *const Node as *mut Node); }
    let mut i = 1;
    while i < vals.len() {
        let ptr = queue.pop_front().unwrap();
        let node = unsafe { &mut *ptr };
        if i < vals.len() {
            if let Some(v) = vals[i] {
                node.left = Some(Box::new(Node { val: v, left: None, right: None }));
                if let Some(ref b) = node.left { queue.push_back(b.as_ref() as *const Node as *mut Node); }
            }
            i += 1;
        }
        if i < vals.len() {
            if let Some(v) = vals[i] {
                node.right = Some(Box::new(Node { val: v, left: None, right: None }));
                if let Some(ref b) = node.right { queue.push_back(b.as_ref() as *const Node as *mut Node); }
            }
            i += 1;
        }
    }
    root
}

fn serialize(root: &Tree) -> Vec<Option<i32>> {
    let mut result = Vec::new();
    if root.is_none() { return result; }
    let mut queue: std::collections::VecDeque<&Tree> = std::collections::VecDeque::new();
    queue.push_back(root);
    while !queue.is_empty() {
        let t = queue.pop_front().unwrap();
        match t {
            None => result.push(None),
            Some(n) => {
                result.push(Some(n.val));
                queue.push_back(&n.left);
                queue.push_back(&n.right);
            }
        }
    }
    while result.last() == Some(&None) { result.pop(); }
    result
}

fn deserialize(data: &[Option<i32>]) -> Tree {
    build(data)
}

fn main() {
    let orig = vec![Some(1), Some(2), Some(3), None, None, Some(4), Some(5)];
    let t = build(&orig);
    let s = serialize(&t);
    let t2 = deserialize(&s);
    assert_eq!(serialize(&t2), s);
    assert_eq!(serialize(&None), Vec::<Option<i32>>::new());
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn serialize(root: &Tree) -> Vec<Option<i32>> {
    // TODO
    todo!()
}

fn deserialize(data: &[Option<i32>]) -> Tree {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(serialize(&None), Vec::<Option<i32>>::new());
    println!("ok");
}`,
    tags: ['tree', 'serialization', 'bfs'],
  },
  {
    id: 'ds-ch07-c-027',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Maximum Path Sum',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn max_path_sum(root: &Tree) -> i32 returning the maximum sum of any path in the tree.
A path is a sequence of connected nodes; each node may appear at most once. The path does not have to pass through the root and can consist of a single node.
Example: tree -10->(9,20->(15,7)) returns 42 (path 15->20->7).`,
    hints: [
      'For each node compute the maximum gain from its left and right children (clamp negative gains to 0).',
      'Update a global maximum with the sum val + left_gain + right_gain, but return only val + max(left_gain, right_gain) upward.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn max_path_sum_helper(root: &Tree, best: &mut i32) -> i32 {
    match root {
        None => 0,
        Some(n) => {
            let l = 0.max(max_path_sum_helper(&n.left, best));
            let r = 0.max(max_path_sum_helper(&n.right, best));
            *best = (*best).max(n.val + l + r);
            n.val + l.max(r)
        }
    }
}

fn max_path_sum(root: &Tree) -> i32 {
    let mut best = i32::MIN;
    max_path_sum_helper(root, &mut best);
    best
}

fn main() {
    let t1 = node(1, leaf(2), leaf(3));
    assert_eq!(max_path_sum(&t1), 6);
    let t2 = node(-10, node(9, None, None), node(20, leaf(15), leaf(7)));
    assert_eq!(max_path_sum(&t2), 42);
    assert_eq!(max_path_sum(&leaf(-3)), -3);
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }

fn max_path_sum(root: &Tree) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(max_path_sum(&leaf(-3)), -3);
    println!("ok");
}`,
    tags: ['tree', 'path-sum', 'dfs', 'dp'],
  },
  {
    id: 'ds-ch07-c-028',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Flatten Tree to Linked List',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn flatten(root: &mut Tree) that flattens the tree in-place into a right-leaning linked list following preorder traversal order.
After flattening every node has no left child and its right child points to the next node in preorder. Empty tree is unchanged.
Example: tree 1->(2->(3,4),5->(_,6)) flattens to 1->2->3->4->5->6 (all right children).`,
    hints: [
      'For each node, move the entire right subtree to the end of the left subtree, then shift the left subtree to the right.',
      'A helper that returns a pointer to the tail of the flattened subtree avoids a second traversal.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn flatten(root: &mut Tree) {
    fn helper(root: &mut Tree) -> *mut Node {
        match root {
            None => std::ptr::null_mut(),
            Some(n) => {
                let left_tail = helper(&mut n.left);
                let right_tail = helper(&mut n.right);
                if !left_tail.is_null() {
                    unsafe {
                        (*left_tail).right = n.right.take();
                    }
                    n.right = n.left.take();
                }
                if !right_tail.is_null() { right_tail }
                else if !left_tail.is_null() { left_tail }
                else { n.as_mut() as *mut Node }
            }
        }
    }
    helper(root);
}

fn to_list(root: &Tree) -> Vec<i32> {
    let mut out = Vec::new();
    let mut cur = root;
    while let Some(n) = cur {
        assert!(n.left.is_none());
        out.push(n.val);
        cur = &n.right;
    }
    out
}

fn main() {
    let mut t = node(1, node(2, leaf(3), leaf(4)), node(5, None, leaf(6)));
    flatten(&mut t);
    assert_eq!(to_list(&t), vec![1, 2, 3, 4, 5, 6]);
    let mut t2: Tree = None;
    flatten(&mut t2);
    assert_eq!(to_list(&t2), vec![]);
    let mut t3 = leaf(1);
    flatten(&mut t3);
    assert_eq!(to_list(&t3), vec![1]);
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn flatten(root: &mut Tree) {
    // TODO
    todo!()
}

fn main() {
    let mut t: Tree = None;
    flatten(&mut t);
    println!("ok");
}`,
    tags: ['tree', 'flatten', 'preorder', 'in-place'],
  },
  {
    id: 'ds-ch07-c-029',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'BST Combined: LCA and Range Sum',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement two functions on a BST:
  fn bst_lca(root: &Tree, p: i32, q: i32) -> i32  -- the LCA value
  fn bst_range_sum(root: &Tree, lo: i32, hi: i32) -> i32  -- sum of nodes with value in [lo, hi]

Verify correctness by cross-checking bst_range_sum against a brute-force inorder filter.
Example BST: 8->(3->(1,6->(4,7)),10->(_,14->(13,_))). bst_lca(1,7)=3; bst_range_sum(3,8)=sum of inorder values in [3,8].`,
    hints: [
      'For LCA: if both p and q are smaller than the node, go left; if both larger, go right.',
      'For range sum: only recurse into subtrees that can contain values within the range.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn bst_lca(root: &Tree, p: i32, q: i32) -> i32 {
    match root {
        None => -1,
        Some(n) => {
            if p < n.val && q < n.val { bst_lca(&n.left, p, q) }
            else if p > n.val && q > n.val { bst_lca(&n.right, p, q) }
            else { n.val }
        }
    }
}

fn bst_range_sum(root: &Tree, lo: i32, hi: i32) -> i32 {
    match root {
        None => 0,
        Some(n) => {
            let mut s = 0;
            if n.val >= lo && n.val <= hi { s += n.val; }
            if n.val > lo { s += bst_range_sum(&n.left, lo, hi); }
            if n.val < hi { s += bst_range_sum(&n.right, lo, hi); }
            s
        }
    }
}

fn recover_bst_values(root: &Tree) -> Vec<i32> {
    fn inorder(root: &Tree, out: &mut Vec<i32>) {
        if let Some(n) = root {
            inorder(&n.left, out);
            out.push(n.val);
            inorder(&n.right, out);
        }
    }
    let mut out = Vec::new();
    inorder(root, &mut out);
    out
}

fn main() {
    let bst = node(8, node(3, leaf(1), node(6, leaf(4), leaf(7))), node(10, None, node(14, leaf(13), None)));
    let lca_val = bst_lca(&bst, 1, 7);
    assert_eq!(lca_val, 3);
    let lca_val2 = bst_lca(&bst, 4, 14);
    assert_eq!(lca_val2, 8);
    let range = bst_range_sum(&bst, 4, 10);
    let manual: i32 = recover_bst_values(&bst).into_iter().filter(|&x| x >= 4 && x <= 10).sum();
    assert_eq!(range, manual);
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn bst_lca(root: &Tree, p: i32, q: i32) -> i32 {
    // TODO
    todo!()
}

fn bst_range_sum(root: &Tree, lo: i32, hi: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['bst', 'lca', 'range', 'combined'],
  },
  {
    id: 'ds-ch07-c-030',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Tree Property Audit',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement three functions that work together to audit a binary tree:
  fn is_balanced(root: &Tree) -> bool  -- true if height-balanced (all nodes differ in child heights by at most 1)
  fn max_depth(root: &Tree) -> i32     -- deepest root-to-leaf path length in nodes
  fn count_nodes(root: &Tree) -> i32  -- total node count

Use an Option<i32>-returning helper for is_balanced so it short-circuits early when imbalance is detected.
Example: tree 5->(3->(2,4),8->(7,9)) is balanced, has max depth 3, and 7 nodes.`,
    hints: [
      'For is_balanced, a helper returning None signals imbalance and Some(height) signals a balanced subtree.',
      'max_depth and count_nodes are straightforward recursions; is_balanced needs to propagate imbalance without recomputing heights.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn is_balanced_helper(root: &Tree) -> Option<i32> {
    match root {
        None => Some(0),
        Some(n) => {
            let l = is_balanced_helper(&n.left)?;
            let r = is_balanced_helper(&n.right)?;
            if (l - r).abs() > 1 { None } else { Some(1 + l.max(r)) }
        }
    }
}

fn is_balanced(root: &Tree) -> bool {
    is_balanced_helper(root).is_some()
}

fn max_depth(root: &Tree) -> i32 {
    match root {
        None => 0,
        Some(n) => 1 + max_depth(&n.left).max(max_depth(&n.right)),
    }
}

fn count_nodes(root: &Tree) -> i32 {
    match root {
        None => 0,
        Some(n) => 1 + count_nodes(&n.left) + count_nodes(&n.right),
    }
}

fn main() {
    let t1 = node(1, node(2, leaf(4), leaf(5)), leaf(3));
    assert!(is_balanced(&t1));
    assert_eq!(max_depth(&t1), 3);
    assert_eq!(count_nodes(&t1), 5);
    let t2 = node(1, node(2, node(3, leaf(4), None), None), None);
    assert!(!is_balanced(&t2));
    assert_eq!(max_depth(&t2), 4);
    let t3 = node(5, node(3, leaf(2), leaf(4)), node(8, leaf(7), leaf(9)));
    let both = is_balanced(&t3) && max_depth(&t3) == 3 && count_nodes(&t3) == 7;
    assert!(both);
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn is_balanced(root: &Tree) -> bool {
    // TODO
    todo!()
}

fn max_depth(root: &Tree) -> i32 {
    // TODO
    todo!()
}

fn count_nodes(root: &Tree) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert!(is_balanced(&None));
    assert_eq!(max_depth(&None), 0);
    assert_eq!(count_nodes(&None), 0);
    println!("ok");
}`,
    tags: ['tree', 'balanced', 'depth', 'count', 'combined'],
  },
]

export default problems
