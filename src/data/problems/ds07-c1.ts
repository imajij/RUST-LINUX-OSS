import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch07-c-001',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Maximum Depth of Binary Tree',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn max_depth(root: &Tree) -> i32 returning the number of nodes on the longest root-to-leaf path.
An empty tree returns 0. A single-node tree returns 1.
Example: a root with two leaf children returns 2.`,
    hints: [
      'Recurse into both subtrees and take the maximum of their depths.',
      'The depth of any node is 1 plus the max depth of its children.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn max_depth(root: &Tree) -> i32 {
    match root {
        None => 0,
        Some(n) => 1 + max_depth(&n.left).max(max_depth(&n.right)),
    }
}

fn main() {
    assert_eq!(max_depth(&None), 0);
    assert_eq!(max_depth(&leaf(1)), 1);
    let t = node(1, leaf(2), leaf(3));
    assert_eq!(max_depth(&t), 2);
    let t2 = node(1, node(2, leaf(4), None), leaf(3));
    assert_eq!(max_depth(&t2), 3);
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn max_depth(root: &Tree) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(max_depth(&None), 0);
    println!("ok");
}`,
    tags: ['tree', 'recursion', 'depth'],
  },
  {
    id: 'ds-ch07-c-002',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Nodes in Binary Tree',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn count_nodes(root: &Tree) -> i32 returning the total number of nodes in the tree.
An empty tree returns 0.
Example: a complete tree with nodes 1, 2, 3, 4, 5 returns 5.`,
    hints: [
      'Recursively count nodes in the left subtree, right subtree, and add 1 for the root.',
      'The base case is an empty tree returning 0.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn count_nodes(root: &Tree) -> i32 {
    match root {
        None => 0,
        Some(n) => 1 + count_nodes(&n.left) + count_nodes(&n.right),
    }
}

fn main() {
    assert_eq!(count_nodes(&None), 0);
    assert_eq!(count_nodes(&leaf(5)), 1);
    let t = node(1, leaf(2), leaf(3));
    assert_eq!(count_nodes(&t), 3);
    let t2 = node(1, node(2, leaf(4), leaf(5)), leaf(3));
    assert_eq!(count_nodes(&t2), 5);
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn count_nodes(root: &Tree) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(count_nodes(&None), 0);
    println!("ok");
}`,
    tags: ['tree', 'recursion', 'counting'],
  },
  {
    id: 'ds-ch07-c-003',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Sum of All Node Values',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn sum_values(root: &Tree) -> i32 returning the sum of all node values.
An empty tree returns 0.
Example: a tree with values 4, 2, 6, 1, 3, 5, 7 returns 28.`,
    hints: [
      'Add the root value to the sum of values in the left and right subtrees.',
      'The base case is an empty tree returning 0.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn sum_values(root: &Tree) -> i32 {
    match root {
        None => 0,
        Some(n) => n.val + sum_values(&n.left) + sum_values(&n.right),
    }
}

fn main() {
    assert_eq!(sum_values(&None), 0);
    assert_eq!(sum_values(&leaf(7)), 7);
    let t = node(1, leaf(2), leaf(3));
    assert_eq!(sum_values(&t), 6);
    let t2 = node(4, node(2, leaf(1), leaf(3)), node(6, leaf(5), leaf(7)));
    assert_eq!(sum_values(&t2), 28);
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn sum_values(root: &Tree) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(sum_values(&None), 0);
    println!("ok");
}`,
    tags: ['tree', 'recursion', 'sum'],
  },
  {
    id: 'ds-ch07-c-004',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Invert Binary Tree',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn invert(root: Tree) -> Tree that mirrors the tree by swapping left and right children at every node.
Takes ownership and returns the inverted tree. An empty tree returns None.
Example: a BST 4->2,6->1,3,5,7 inverted has inorder 7,6,5,4,3,2,1.`,
    hints: [
      'Recursively invert the left and right subtrees first, then swap them.',
      'Use n.left.take() and n.right.take() to move ownership out of the node.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn invert(root: Tree) -> Tree {
    match root {
        None => None,
        Some(mut n) => {
            let l = invert(n.left.take());
            let r = invert(n.right.take());
            n.left = r;
            n.right = l;
            Some(n)
        }
    }
}

fn to_vec(root: &Tree) -> Vec<i32> {
    match root {
        None => vec![],
        Some(n) => {
            let mut v = to_vec(&n.left);
            v.push(n.val);
            v.extend(to_vec(&n.right));
            v
        }
    }
}

fn main() {
    let t = node(4, node(2, leaf(1), leaf(3)), node(6, leaf(5), leaf(7)));
    let inv = invert(t);
    assert_eq!(to_vec(&inv), vec![7, 6, 5, 4, 3, 2, 1]);
    let empty: Tree = None;
    assert!(invert(empty).is_none());
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn invert(root: Tree) -> Tree {
    // TODO
    todo!()
}

fn main() {
    let empty: Tree = None;
    assert!(invert(empty).is_none());
    println!("ok");
}`,
    tags: ['tree', 'recursion', 'mirror'],
  },
  {
    id: 'ds-ch07-c-005',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Same Tree',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn same_tree(p: &Tree, q: &Tree) -> bool returning true if the two trees are identical in structure and node values.
Two empty trees are the same. An empty and non-empty tree are not the same.
Example: trees with values [1,2,3] and [1,2,3] return true; [1,2,3] and [1,2,4] return false.`,
    hints: [
      'Two trees are the same if their roots have equal values and their left and right subtrees are the same.',
      'Handle the base case where both are None (true) or exactly one is None (false).',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn same_tree(p: &Tree, q: &Tree) -> bool {
    match (p, q) {
        (None, None) => true,
        (Some(a), Some(b)) => a.val == b.val && same_tree(&a.left, &b.left) && same_tree(&a.right, &b.right),
        _ => false,
    }
}

fn main() {
    let t1 = node(1, leaf(2), leaf(3));
    let t2 = node(1, leaf(2), leaf(3));
    assert!(same_tree(&t1, &t2));
    let t3 = node(1, leaf(2), leaf(4));
    assert!(!same_tree(&t1, &t3));
    assert!(same_tree(&None, &None));
    assert!(!same_tree(&leaf(1), &None));
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn same_tree(p: &Tree, q: &Tree) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert!(same_tree(&None, &None));
    println!("ok");
}`,
    tags: ['tree', 'recursion', 'comparison'],
  },
  {
    id: 'ds-ch07-c-006',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Symmetric Tree',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn is_symmetric(root: &Tree) -> bool returning true if the tree is a mirror of itself around its center.
An empty tree is symmetric. A single-node tree is symmetric.
Example: tree 1->(2->(3,4), 2->(4,3)) is symmetric; 1->(2->(_,3), 2->(_,3)) is not.`,
    hints: [
      'A tree is symmetric if its left and right subtrees are mirrors of each other.',
      'Two subtrees are mirrors if their roots match and the left subtree of one mirrors the right subtree of the other.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn is_mirror(a: &Tree, b: &Tree) -> bool {
    match (a, b) {
        (None, None) => true,
        (Some(x), Some(y)) => x.val == y.val && is_mirror(&x.left, &y.right) && is_mirror(&x.right, &y.left),
        _ => false,
    }
}

fn is_symmetric(root: &Tree) -> bool {
    match root {
        None => true,
        Some(n) => is_mirror(&n.left, &n.right),
    }
}

fn main() {
    let sym = node(1, node(2, leaf(3), leaf(4)), node(2, leaf(4), leaf(3)));
    assert!(is_symmetric(&sym));
    let asym = node(1, node(2, None, leaf(3)), node(2, None, leaf(3)));
    assert!(!is_symmetric(&asym));
    assert!(is_symmetric(&None));
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn is_symmetric(root: &Tree) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert!(is_symmetric(&None));
    println!("ok");
}`,
    tags: ['tree', 'recursion', 'symmetry'],
  },
  {
    id: 'ds-ch07-c-007',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Inorder Traversal',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn inorder_traversal(root: &Tree) -> Vec<i32> returning the node values visited in left-root-right order.
An empty tree returns an empty vector.
Example: a BST with values 1..7 returns [1,2,3,4,5,6,7] in sorted order.`,
    hints: [
      'Recursively visit the left subtree, then the root, then the right subtree.',
      'Use a helper that takes a mutable reference to the output vector.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn inorder(root: &Tree, out: &mut Vec<i32>) {
    if let Some(n) = root {
        inorder(&n.left, out);
        out.push(n.val);
        inorder(&n.right, out);
    }
}

fn inorder_traversal(root: &Tree) -> Vec<i32> {
    let mut out = Vec::new();
    inorder(root, &mut out);
    out
}

fn main() {
    let t = node(4, node(2, leaf(1), leaf(3)), node(6, leaf(5), leaf(7)));
    assert_eq!(inorder_traversal(&t), vec![1, 2, 3, 4, 5, 6, 7]);
    assert_eq!(inorder_traversal(&None), vec![]);
    assert_eq!(inorder_traversal(&leaf(9)), vec![9]);
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn inorder_traversal(root: &Tree) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(inorder_traversal(&None), vec![]);
    println!("ok");
}`,
    tags: ['tree', 'traversal', 'inorder'],
  },
  {
    id: 'ds-ch07-c-008',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Preorder Traversal',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn preorder_traversal(root: &Tree) -> Vec<i32> returning node values visited in root-left-right order.
An empty tree returns an empty vector.
Example: tree 1->(2->(4,5), 3->(_,6)) returns [1,2,4,5,3,6].`,
    hints: [
      'Push the root value first, then recursively traverse left, then right.',
      'A helper that takes a mutable output vector is cleaner than building intermediate Vecs.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn preorder(root: &Tree, out: &mut Vec<i32>) {
    if let Some(n) = root {
        out.push(n.val);
        preorder(&n.left, out);
        preorder(&n.right, out);
    }
}

fn preorder_traversal(root: &Tree) -> Vec<i32> {
    let mut out = Vec::new();
    preorder(root, &mut out);
    out
}

fn main() {
    let t = node(1, node(2, leaf(4), leaf(5)), node(3, None, leaf(6)));
    assert_eq!(preorder_traversal(&t), vec![1, 2, 4, 5, 3, 6]);
    assert_eq!(preorder_traversal(&None), vec![]);
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn preorder_traversal(root: &Tree) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(preorder_traversal(&None), vec![]);
    println!("ok");
}`,
    tags: ['tree', 'traversal', 'preorder'],
  },
  {
    id: 'ds-ch07-c-009',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Minimum Depth',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn min_depth(root: &Tree) -> i32 returning the number of nodes on the shortest root-to-leaf path.
An empty tree returns 0. A leaf node returns 1.
Example: tree 1->(2->(4,_),3) has min depth 2 (path 1->3).`,
    hints: [
      'Unlike max depth, a node with only one child must go down that single child, not treat the missing child as a leaf.',
      'Only nodes with no children are leaves. Handle the one-child cases explicitly.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn min_depth(root: &Tree) -> i32 {
    match root {
        None => 0,
        Some(n) => match (&n.left, &n.right) {
            (None, None) => 1,
            (None, _) => 1 + min_depth(&n.right),
            (_, None) => 1 + min_depth(&n.left),
            _ => 1 + min_depth(&n.left).min(min_depth(&n.right)),
        },
    }
}

fn main() {
    assert_eq!(min_depth(&None), 0);
    assert_eq!(min_depth(&leaf(1)), 1);
    let t = node(1, node(2, leaf(4), None), leaf(3));
    assert_eq!(min_depth(&t), 2);
    let t2 = node(1, node(2, leaf(4), None), None);
    assert_eq!(min_depth(&t2), 3);
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn min_depth(root: &Tree) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(min_depth(&None), 0);
    println!("ok");
}`,
    tags: ['tree', 'recursion', 'depth', 'bfs'],
  },
  {
    id: 'ds-ch07-c-010',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Path Sum Exists',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn has_path_sum(root: &Tree, target: i32) -> bool returning true if there is a root-to-leaf path whose node values sum to target.
An empty tree returns false. A leaf node forms a complete path.
Example: tree 5->(4->(11->(7,2),_), 8->(13,4)) has a path summing to 22 (5+4+11+2).`,
    hints: [
      'Subtract the current node value from the target and recurse into children.',
      'At a leaf node, check whether the remaining target is zero.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn has_path_sum(root: &Tree, target: i32) -> bool {
    match root {
        None => false,
        Some(n) => {
            let rem = target - n.val;
            if n.left.is_none() && n.right.is_none() {
                rem == 0
            } else {
                has_path_sum(&n.left, rem) || has_path_sum(&n.right, rem)
            }
        }
    }
}

fn main() {
    let t = node(5, node(4, node(11, leaf(7), leaf(2)), None), node(8, leaf(13), leaf(4)));
    assert!(has_path_sum(&t, 22));
    assert!(!has_path_sum(&t, 5));
    assert!(!has_path_sum(&None, 0));
    assert!(has_path_sum(&leaf(0), 0));
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn has_path_sum(root: &Tree, target: i32) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert!(!has_path_sum(&None, 0));
    println!("ok");
}`,
    tags: ['tree', 'recursion', 'path', 'dfs'],
  },
  {
    id: 'ds-ch07-c-011',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sum of Left Leaves',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn sum_of_left_leaves(root: &Tree) -> i32 returning the sum of all left leaf node values.
A leaf is a node with no children. Only leaves that are left children count.
Example: tree 3->(9,20->(15,7)) returns 24 (only 9 and 15 are left leaves).`,
    hints: [
      'Track whether the current node is a left child using a boolean parameter in a helper.',
      'A leaf that is a right child does not contribute to the sum.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn sum_left_leaves(root: &Tree, is_left: bool) -> i32 {
    match root {
        None => 0,
        Some(n) => {
            if n.left.is_none() && n.right.is_none() {
                if is_left { n.val } else { 0 }
            } else {
                sum_left_leaves(&n.left, true) + sum_left_leaves(&n.right, false)
            }
        }
    }
}

fn sum_of_left_leaves(root: &Tree) -> i32 {
    sum_left_leaves(root, false)
}

fn main() {
    let t = node(3, node(9, None, None), node(20, leaf(15), leaf(7)));
    assert_eq!(sum_of_left_leaves(&t), 24);
    assert_eq!(sum_of_left_leaves(&None), 0);
    assert_eq!(sum_of_left_leaves(&leaf(1)), 0);
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn sum_of_left_leaves(root: &Tree) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(sum_of_left_leaves(&None), 0);
    println!("ok");
}`,
    tags: ['tree', 'recursion', 'leaves'],
  },
  {
    id: 'ds-ch07-c-012',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Validate BST',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn is_valid_bst(root: &Tree) -> bool returning true if the tree is a valid binary search tree.
In a valid BST every node in the left subtree is strictly less than the root, and every node in the right subtree is strictly greater.
Example: 4->(2->(1,3),6->(5,7)) is valid; 5->(1->(_,4),4->(_,6)) is not.`,
    hints: [
      'Pass down a valid range [lo, hi) to each recursive call.',
      'Use Option<i32> for the bounds so the root has no constraint.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn is_valid_bst_helper(root: &Tree, lo: Option<i32>, hi: Option<i32>) -> bool {
    match root {
        None => true,
        Some(n) => {
            if lo.map_or(false, |l| n.val <= l) { return false; }
            if hi.map_or(false, |h| n.val >= h) { return false; }
            is_valid_bst_helper(&n.left, lo, Some(n.val)) &&
            is_valid_bst_helper(&n.right, Some(n.val), hi)
        }
    }
}

fn is_valid_bst(root: &Tree) -> bool {
    is_valid_bst_helper(root, None, None)
}

fn main() {
    let valid = node(4, node(2, leaf(1), leaf(3)), node(6, leaf(5), leaf(7)));
    assert!(is_valid_bst(&valid));
    let invalid = node(5, node(1, None, leaf(4)), node(4, None, leaf(6)));
    assert!(!is_valid_bst(&invalid));
    assert!(is_valid_bst(&None));
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn is_valid_bst(root: &Tree) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert!(is_valid_bst(&None));
    println!("ok");
}`,
    tags: ['bst', 'validation', 'recursion'],
  },
  {
    id: 'ds-ch07-c-013',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Search in a BST',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn bst_search(root: &Tree, target: i32) -> bool returning true if target exists in the BST.
Use BST ordering to skip subtrees and achieve O(h) time where h is the height.
Example: searching for 5 in BST 4->(2->(1,3),6->(5,7)) returns true; searching for 9 returns false.`,
    hints: [
      'If the target equals the current node value, return true.',
      'If the target is smaller, recurse into the left subtree only; if larger, into the right only.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn bst_search(root: &Tree, target: i32) -> bool {
    match root {
        None => false,
        Some(n) => {
            if n.val == target { true }
            else if target < n.val { bst_search(&n.left, target) }
            else { bst_search(&n.right, target) }
        }
    }
}

fn main() {
    let bst = node(4, node(2, leaf(1), leaf(3)), node(6, leaf(5), leaf(7)));
    assert!(bst_search(&bst, 5));
    assert!(bst_search(&bst, 1));
    assert!(!bst_search(&bst, 9));
    assert!(!bst_search(&None, 0));
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn bst_search(root: &Tree, target: i32) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert!(!bst_search(&None, 0));
    println!("ok");
}`,
    tags: ['bst', 'search'],
  },
  {
    id: 'ds-ch07-c-014',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Insert into a BST',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn bst_insert(root: Tree, val: i32) -> Tree that inserts val into the BST and returns the updated tree.
If val already exists, do nothing. The resulting tree must remain a valid BST.
Example: inserting values [4,2,6,1,3,5,7] one at a time builds a BST whose inorder is [1,2,3,4,5,6,7].`,
    hints: [
      'If the tree is empty, create a leaf with the new value.',
      'Compare val with the current root to decide whether to go left or right, and recurse.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }

fn bst_insert(root: Tree, val: i32) -> Tree {
    match root {
        None => leaf(val),
        Some(mut n) => {
            if val < n.val {
                n.left = bst_insert(n.left.take(), val);
            } else if val > n.val {
                n.right = bst_insert(n.right.take(), val);
            }
            Some(n)
        }
    }
}

fn inorder(root: &Tree, out: &mut Vec<i32>) {
    if let Some(n) = root {
        inorder(&n.left, out);
        out.push(n.val);
        inorder(&n.right, out);
    }
}

fn main() {
    let mut t: Tree = None;
    for v in [4, 2, 6, 1, 3, 5, 7] {
        t = bst_insert(t, v);
    }
    let mut out = Vec::new();
    inorder(&t, &mut out);
    assert_eq!(out, vec![1, 2, 3, 4, 5, 6, 7]);
    t = bst_insert(t, 0);
    out.clear();
    inorder(&t, &mut out);
    assert_eq!(out[0], 0);
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn bst_insert(root: Tree, val: i32) -> Tree {
    // TODO
    todo!()
}

fn main() {
    let t = bst_insert(None, 5);
    assert!(t.is_some());
    println!("ok");
}`,
    tags: ['bst', 'insert'],
  },
  {
    id: 'ds-ch07-c-015',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Level-Order Traversal',
    prompt: `Use the binary tree type:

    type Tree = Option<Box<Node>>;  struct Node { val: i32, left: Tree, right: Tree }

Implement fn level_order(root: &Tree) -> Vec<Vec<i32>> returning node values grouped by depth level.
Each inner vector contains the values at one level from left to right. An empty tree returns an empty outer vector.
Example: tree 3->(9,20->(15,7)) returns [[3],[9,20],[15,7]].`,
    hints: [
      'Use a queue (VecDeque) for BFS. Process all nodes at the current level before adding the next level.',
      'Record how many nodes are in the queue at the start of each iteration to know how many belong to the current level.',
    ],
    solution: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn leaf(v: i32) -> Tree { Some(Box::new(Node { val: v, left: None, right: None })) }
fn node(v: i32, l: Tree, r: Tree) -> Tree { Some(Box::new(Node { val: v, left: l, right: r })) }

fn level_order(root: &Tree) -> Vec<Vec<i32>> {
    let mut result = Vec::new();
    if root.is_none() { return result; }
    let mut queue: std::collections::VecDeque<&Tree> = std::collections::VecDeque::new();
    queue.push_back(root);
    while !queue.is_empty() {
        let size = queue.len();
        let mut level = Vec::new();
        for _ in 0..size {
            if let Some(t) = queue.pop_front() {
                if let Some(n) = t {
                    level.push(n.val);
                    queue.push_back(&n.left);
                    queue.push_back(&n.right);
                }
            }
        }
        if !level.is_empty() { result.push(level); }
    }
    result
}

fn main() {
    let t = node(3, node(9, None, None), node(20, leaf(15), leaf(7)));
    assert_eq!(level_order(&t), vec![vec![3], vec![9, 20], vec![15, 7]]);
    assert_eq!(level_order(&None), Vec::<Vec<i32>>::new());
    assert_eq!(level_order(&leaf(1)), vec![vec![1]]);
    println!("ok");
}`,
    starter: `type Tree = Option<Box<Node>>;
struct Node { val: i32, left: Tree, right: Tree }

fn level_order(root: &Tree) -> Vec<Vec<i32>> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(level_order(&None), Vec::<Vec<i32>>::new());
    println!("ok");
}`,
    tags: ['tree', 'bfs', 'level-order'],
  },
]

export default problems
