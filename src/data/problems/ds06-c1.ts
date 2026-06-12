import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch06-c-001',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Reverse a Linked List',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn reverse(head: Link) -> Link that returns the list in reversed order.
Example: 1 -> 2 -> 3 becomes 3 -> 2 -> 1.
An empty list should return an empty list.`,
    hints: [
      'Walk the list moving each node to the front of a new list.',
      'Take ownership of next as you go using .take().',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn reverse(mut head: Link) -> Link {
    let mut prev: Link = None;
    while let Some(mut node) = head {
        head = node.next.take();
        node.next = prev;
        prev = Some(node);
    }
    prev
}

fn main() {
    let l = build(&[1, 2, 3]);
    assert_eq!(to_vec(&reverse(l)), vec![3, 2, 1]);
    assert_eq!(to_vec(&reverse(build(&[]))), Vec::<i32>::new());
    assert_eq!(to_vec(&reverse(build(&[5]))), vec![5]);
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn reverse(head: Link) -> Link {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'reversal'],
  },
  {
    id: 'ds-ch06-c-002',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Find the Middle Node Value',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn find_middle(head: &Link) -> i32 that returns the value of the middle node.
For even-length lists, return the value of the second middle node.
Example: [1,2,3,4,5] -> 3, [1,2,3,4,5,6] -> 4.
The list will have at least one node.`,
    hints: [
      'Convert to a Vec first, then index at len / 2.',
      'Integer division rounds down, which gives the second middle for even lengths.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn find_middle(head: &Link) -> i32 {
    let v = to_vec(head);
    v[v.len() / 2]
}

fn main() {
    assert_eq!(find_middle(&build(&[1, 2, 3, 4, 5])), 3);
    assert_eq!(find_middle(&build(&[1, 2, 3, 4, 5, 6])), 4);
    assert_eq!(find_middle(&build(&[7])), 7);
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn find_middle(head: &Link) -> i32 {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'two-pointers'],
  },
  {
    id: 'ds-ch06-c-003',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Remove Consecutive Duplicates from Sorted List',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn delete_duplicates(head: Link) -> Link.
The list is sorted in ascending order. Remove extra copies so each value appears once.
Example: 1 -> 1 -> 2 -> 3 -> 3 becomes 1 -> 2 -> 3.
Return the modified list.`,
    hints: [
      'Walk with a mutable reference to the current node.',
      'While the next node has the same value, skip it by unlinking it.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn delete_duplicates(mut head: Link) -> Link {
    let mut cur = &mut head;
    while let Some(node) = cur {
        while node.next.as_ref().map_or(false, |n| n.val == node.val) {
            let next_next = node.next.as_mut().unwrap().next.take();
            node.next = next_next;
        }
        cur = &mut node.next;
    }
    head
}

fn main() {
    assert_eq!(to_vec(&delete_duplicates(build(&[1,1,2,3,3]))), vec![1,2,3]);
    assert_eq!(to_vec(&delete_duplicates(build(&[1,1,1]))), vec![1]);
    assert_eq!(to_vec(&delete_duplicates(build(&[1,2,3]))), vec![1,2,3]);
    assert_eq!(to_vec(&delete_duplicates(build(&[]))), Vec::<i32>::new());
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn delete_duplicates(head: Link) -> Link {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'duplicates'],
  },
  {
    id: 'ds-ch06-c-004',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Merge Two Sorted Lists',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn merge_two_sorted(l1: Link, l2: Link) -> Link.
Both lists are sorted in ascending order. Return a single sorted merged list.
Example: [1,3,5] and [2,4,6] become [1,2,3,4,5,6].
Either list may be empty.`,
    hints: [
      'Use a dummy head node to simplify edge cases.',
      'At each step attach the smaller of the two current nodes.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn merge_two_sorted(mut l1: Link, mut l2: Link) -> Link {
    let mut dummy = Box::new(ListNode { val: 0, next: None });
    let mut cur = &mut dummy.next;
    loop {
        match (l1, l2) {
            (None, None) => break,
            (Some(n), None) => { *cur = Some(n); break; }
            (None, Some(n)) => { *cur = Some(n); break; }
            (Some(mut n1), Some(n2)) => {
                if n1.val <= n2.val {
                    l2 = Some(n2);
                    l1 = n1.next.take();
                    *cur = Some(n1);
                } else {
                    l1 = Some(n1);
                    let mut node2 = n2;
                    l2 = node2.next.take();
                    *cur = Some(node2);
                }
                if let Some(ref mut node) = *cur {
                    cur = &mut node.next;
                }
            }
        }
    }
    dummy.next
}

fn main() {
    assert_eq!(to_vec(&merge_two_sorted(build(&[1,3,5]), build(&[2,4,6]))), vec![1,2,3,4,5,6]);
    assert_eq!(to_vec(&merge_two_sorted(build(&[]), build(&[1,2]))), vec![1,2]);
    assert_eq!(to_vec(&merge_two_sorted(build(&[1,2]), build(&[]))), vec![1,2]);
    assert_eq!(to_vec(&merge_two_sorted(build(&[]), build(&[]))), Vec::<i32>::new());
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn merge_two_sorted(l1: Link, l2: Link) -> Link {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'merge', 'sorting'],
  },
  {
    id: 'ds-ch06-c-005',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Remove Nth Node from End',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn remove_nth_from_end(head: Link, n: i32) -> Link.
Remove the n-th node counting from the end of the list (1-indexed).
Example: list [1,2,3,4,5] with n=2 gives [1,2,3,5].
You may assume n is valid (1 <= n <= list length).`,
    hints: [
      'Convert to a Vec, remove the element at index len - n, then rebuild.',
      'Alternatively use two pointers with a gap of n between them.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn remove_nth_from_end(head: Link, n: i32) -> Link {
    let mut v = to_vec(&head);
    let len = v.len();
    let idx = len - n as usize;
    v.remove(idx);
    build(&v)
}

fn main() {
    assert_eq!(to_vec(&remove_nth_from_end(build(&[1,2,3,4,5]), 2)), vec![1,2,3,5]);
    assert_eq!(to_vec(&remove_nth_from_end(build(&[1]), 1)), Vec::<i32>::new());
    assert_eq!(to_vec(&remove_nth_from_end(build(&[1,2]), 1)), vec![1]);
    assert_eq!(to_vec(&remove_nth_from_end(build(&[1,2]), 2)), vec![2]);
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn remove_nth_from_end(head: Link, n: i32) -> Link {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'two-pointers'],
  },
  {
    id: 'ds-ch06-c-006',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'List Length',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn list_length(head: &Link) -> usize that counts the number of nodes.
Example: [1,2,3,4,5] has length 5, and an empty list has length 0.
Walk the list once counting each node.`,
    hints: [
      'Use a while-let loop to traverse nodes.',
      'Increment a counter for each node visited.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn list_length(head: &Link) -> usize {
    let mut count = 0;
    let mut cur = head;
    while let Some(n) = cur {
        count += 1;
        cur = &n.next;
    }
    count
}

fn main() {
    assert_eq!(list_length(&build(&[1,2,3,4,5])), 5);
    assert_eq!(list_length(&build(&[])), 0);
    assert_eq!(list_length(&build(&[42])), 1);
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn list_length(head: &Link) -> usize {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'traversal'],
  },
  {
    id: 'ds-ch06-c-007',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Palindrome Linked List',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn is_palindrome(head: &Link) -> bool.
Return true if the values read the same forwards and backwards.
Example: [1,2,2,1] is a palindrome, [1,2,3,2,1] is a palindrome, [1,2] is not.
An empty list and a single-node list are palindromes.`,
    hints: [
      'Collect values into a Vec, then compare the Vec to its reverse.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn is_palindrome(head: &Link) -> bool {
    let v = to_vec(head);
    let rev: Vec<i32> = v.iter().copied().rev().collect();
    v == rev
}

fn main() {
    assert!(is_palindrome(&build(&[1,2,2,1])));
    assert!(is_palindrome(&build(&[1,2,3,2,1])));
    assert!(!is_palindrome(&build(&[1,2])));
    assert!(is_palindrome(&build(&[1])));
    assert!(is_palindrome(&build(&[])));
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn is_palindrome(head: &Link) -> bool {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'palindrome'],
  },
  {
    id: 'ds-ch06-c-008',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Occurrences of a Value',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn count_occurrences(head: &Link, target: i32) -> i32.
Traverse the list and return how many nodes have val equal to target.
Example: [1,2,2,3,2] with target=2 returns 3.
Return 0 if the list is empty or the value is not found.`,
    hints: [
      'Walk the list with a while-let loop.',
      'Increment a counter whenever the current node value matches target.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn count_occurrences(head: &Link, target: i32) -> i32 {
    let mut count = 0;
    let mut cur = head;
    while let Some(n) = cur {
        if n.val == target { count += 1; }
        cur = &n.next;
    }
    count
}

fn main() {
    assert_eq!(count_occurrences(&build(&[1,2,2,3,2]), 2), 3);
    assert_eq!(count_occurrences(&build(&[1,2,3]), 5), 0);
    assert_eq!(count_occurrences(&build(&[]), 1), 0);
    assert_eq!(count_occurrences(&build(&[7,7,7]), 7), 3);
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn count_occurrences(head: &Link, target: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'search'],
  },
  {
    id: 'ds-ch06-c-009',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Maximum Value in a Linked List',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn max_value(head: &Link) -> i32 that returns the largest value in the list.
Example: [3,1,4,1,5,9,2,6] returns 9.
You may assume the list has at least one node.`,
    hints: [
      'Initialize max to i32::MIN.',
      'Walk the list updating max when a larger value is found.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn max_value(head: &Link) -> i32 {
    let mut cur = head;
    let mut max = i32::MIN;
    while let Some(n) = cur {
        if n.val > max { max = n.val; }
        cur = &n.next;
    }
    max
}

fn main() {
    assert_eq!(max_value(&build(&[3,1,4,1,5,9,2,6])), 9);
    assert_eq!(max_value(&build(&[-1,-5,-2])), -1);
    assert_eq!(max_value(&build(&[42])), 42);
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn max_value(head: &Link) -> i32 {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'traversal'],
  },
  {
    id: 'ds-ch06-c-010',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Append Two Linked Lists',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn append(l1: Link, l2: Link) -> Link that appends l2 to the end of l1.
Example: [1,2,3] and [4,5,6] become [1,2,3,4,5,6].
Either list may be empty; the result should be the non-empty one (or empty if both are).`,
    hints: [
      'Walk l1 to find its last node, then point its next to the head of l2.',
      'Alternatively collect both to Vec, extend, then rebuild.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn append(l1: Link, l2: Link) -> Link {
    let mut v1 = to_vec(&l1);
    let v2 = to_vec(&l2);
    v1.extend(v2);
    build(&v1)
}

fn main() {
    assert_eq!(to_vec(&append(build(&[1,2,3]), build(&[4,5,6]))), vec![1,2,3,4,5,6]);
    assert_eq!(to_vec(&append(build(&[]), build(&[1,2]))), vec![1,2]);
    assert_eq!(to_vec(&append(build(&[1,2]), build(&[]))), vec![1,2]);
    assert_eq!(to_vec(&append(build(&[]), build(&[]))), Vec::<i32>::new());
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn append(l1: Link, l2: Link) -> Link {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'concatenation'],
  },
  {
    id: 'ds-ch06-c-011',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Add Two Numbers as Linked Lists',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn add_two_numbers(l1: Link, l2: Link) -> Link.
Each list stores a non-negative integer with digits in reverse order (least significant first).
Add the two numbers and return the sum in the same reversed-digit format.
Example: [2,4,3] + [5,6,4] = 342 + 465 = 807, result is [7,0,8].
Handle different lengths and carry propagation.`,
    hints: [
      'Process corresponding digits with carry, similar to grade-school addition.',
      'Continue while either list has nodes or carry is non-zero.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn add_two_numbers(l1: Link, l2: Link) -> Link {
    let mut a = l1;
    let mut b = l2;
    let mut carry = 0i32;
    let mut dummy = Box::new(ListNode { val: 0, next: None });
    let mut cur = &mut dummy.next;
    loop {
        let va = if let Some(ref n) = a { n.val } else { 0 };
        let vb = if let Some(ref n) = b { n.val } else { 0 };
        if a.is_none() && b.is_none() && carry == 0 { break; }
        let sum = va + vb + carry;
        carry = sum / 10;
        *cur = Some(Box::new(ListNode { val: sum % 10, next: None }));
        if let Some(ref mut node) = *cur { cur = &mut node.next; }
        if let Some(n) = a { a = n.next; } else { a = None; }
        if let Some(n) = b { b = n.next; } else { b = None; }
    }
    dummy.next
}

fn main() {
    let r1 = add_two_numbers(build(&[2,4,3]), build(&[5,6,4]));
    assert_eq!(to_vec(&r1), vec![7,0,8]);

    let r2 = add_two_numbers(build(&[9,9,9,9,9,9,9]), build(&[9,9,9,9]));
    assert_eq!(to_vec(&r2), vec![8,9,9,9,0,0,0,1]);

    let r3 = add_two_numbers(build(&[0]), build(&[0]));
    assert_eq!(to_vec(&r3), vec![0]);

    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn add_two_numbers(l1: Link, l2: Link) -> Link {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'math', 'carry'],
  },
  {
    id: 'ds-ch06-c-012',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Swap Nodes in Pairs',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn swap_pairs(head: Link) -> Link.
Swap every two adjacent nodes and return the modified list.
You must swap the nodes themselves, not just their values.
Example: [1,2,3,4] becomes [2,1,4,3], and [1,2,3] becomes [2,1,3].
An empty list or single-node list is returned unchanged.`,
    hints: [
      'Use a dummy head to handle the front-of-list edge case cleanly.',
      'Detach the first node, attach the second, then re-attach the first after it.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn swap_pairs(mut head: Link) -> Link {
    let mut dummy = Box::new(ListNode { val: 0, next: None });
    let mut tail = &mut dummy.next;
    while let Some(mut first) = head {
        head = first.next.take();
        if let Some(mut second) = head {
            head = second.next.take();
            second.next = Some(first);
            *tail = Some(second);
            if let Some(ref mut n) = *tail {
                tail = &mut n.next;
                if let Some(ref mut m) = *tail {
                    tail = &mut m.next;
                }
            }
        } else {
            *tail = Some(first);
            break;
        }
    }
    dummy.next
}

fn main() {
    assert_eq!(to_vec(&swap_pairs(build(&[1,2,3,4]))), vec![2,1,4,3]);
    assert_eq!(to_vec(&swap_pairs(build(&[1,2,3]))), vec![2,1,3]);
    assert_eq!(to_vec(&swap_pairs(build(&[1]))), vec![1]);
    assert_eq!(to_vec(&swap_pairs(build(&[]))), Vec::<i32>::new());
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn swap_pairs(head: Link) -> Link {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'swap'],
  },
  {
    id: 'ds-ch06-c-013',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Odd-Even List Reordering',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn odd_even_list(head: Link) -> Link.
Group all nodes at odd positions (1-indexed) first, then all nodes at even positions.
Preserve the relative order within each group.
Example: [1,2,3,4,5] becomes [1,3,5,2,4].
Return the reordered list; do not change node values.`,
    hints: [
      'Collect values into a Vec, then separate by index parity and concatenate.',
      'Indices 0,2,4,... are odd positions; 1,3,5,... are even positions (0-indexed).',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn odd_even_list(head: Link) -> Link {
    let v = to_vec(&head);
    if v.is_empty() { return build(&[]); }
    let odds: Vec<i32> = v.iter().enumerate().filter(|(i,_)| i % 2 == 0).map(|(_,&x)| x).collect();
    let evens: Vec<i32> = v.iter().enumerate().filter(|(i,_)| i % 2 == 1).map(|(_,&x)| x).collect();
    let mut result = odds;
    result.extend(evens);
    build(&result)
}

fn main() {
    assert_eq!(to_vec(&odd_even_list(build(&[1,2,3,4,5]))), vec![1,3,5,2,4]);
    assert_eq!(to_vec(&odd_even_list(build(&[2,1,3,5,6,4,7]))), vec![2,3,6,7,1,5,4]);
    assert_eq!(to_vec(&odd_even_list(build(&[]))), Vec::<i32>::new());
    assert_eq!(to_vec(&odd_even_list(build(&[1]))), vec![1]);
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn odd_even_list(head: Link) -> Link {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'reorder'],
  },
  {
    id: 'ds-ch06-c-014',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Rotate List to the Right by K',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn rotate_right(head: Link, k: i32) -> Link.
Rotate the list to the right by k places. Nodes shifted off the end wrap to the front.
Example: [1,2,3,4,5] rotated right by 2 gives [4,5,1,2,3].
If k is a multiple of the list length the list is unchanged.`,
    hints: [
      'Collect into a Vec, use rotate_right, then rebuild.',
      'Use k % len to avoid unnecessary full rotations.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn rotate_right(head: Link, k: i32) -> Link {
    let mut v = to_vec(&head);
    if v.is_empty() { return build(&[]); }
    let n = v.len();
    let k = k as usize % n;
    if k == 0 { return build(&v); }
    v.rotate_right(k);
    build(&v)
}

fn main() {
    assert_eq!(to_vec(&rotate_right(build(&[1,2,3,4,5]), 2)), vec![4,5,1,2,3]);
    assert_eq!(to_vec(&rotate_right(build(&[0,1,2]), 4)), vec![2,0,1]);
    assert_eq!(to_vec(&rotate_right(build(&[1]), 1)), vec![1]);
    assert_eq!(to_vec(&rotate_right(build(&[]), 3)), Vec::<i32>::new());
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn rotate_right(head: Link, k: i32) -> Link {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'rotation'],
  },
  {
    id: 'ds-ch06-c-015',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Partition List Around a Value',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn partition(head: Link, x: i32) -> Link.
Rearrange the list so all nodes with val < x come before nodes with val >= x.
Preserve the original relative order within each group.
Example: [1,4,3,2,5,2] with x=3 gives [1,2,2,4,3,5].`,
    hints: [
      'Build two separate sub-lists: one for values less than x, one for the rest.',
      'Concatenate the two sub-lists at the end.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn partition(head: Link, x: i32) -> Link {
    let v = to_vec(&head);
    let less: Vec<i32> = v.iter().copied().filter(|&val| val < x).collect();
    let ge: Vec<i32> = v.iter().copied().filter(|&val| val >= x).collect();
    let mut result = less;
    result.extend(ge);
    build(&result)
}

fn main() {
    assert_eq!(to_vec(&partition(build(&[1,4,3,2,5,2]), 3)), vec![1,2,2,4,3,5]);
    assert_eq!(to_vec(&partition(build(&[2,1]), 2)), vec![1,2]);
    assert_eq!(to_vec(&partition(build(&[]), 1)), Vec::<i32>::new());
    assert_eq!(to_vec(&partition(build(&[1,2,3]), 0)), vec![1,2,3]);
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn partition(head: Link, x: i32) -> Link {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'partition'],
  },
  {
    id: 'ds-ch06-c-016',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Remove All Nodes with Duplicate Values',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn remove_all_duplicates(head: Link) -> Link.
Delete every node whose value appears more than once in the list.
Only nodes whose values are unique survive.
Example: [1,2,3,2,1] returns [3]. [1,1,1,2,3] returns [2,3].`,
    hints: [
      'First count the frequency of each value using a HashMap.',
      'Then rebuild the list keeping only nodes whose count is exactly 1.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn remove_all_duplicates(head: Link) -> Link {
    let v = to_vec(&head);
    let mut counts = std::collections::HashMap::new();
    for &x in &v { *counts.entry(x).or_insert(0i32) += 1; }
    let result: Vec<i32> = v.into_iter().filter(|x| counts[x] == 1).collect();
    build(&result)
}

fn main() {
    assert_eq!(to_vec(&remove_all_duplicates(build(&[1,2,3,2,1]))), vec![3]);
    assert_eq!(to_vec(&remove_all_duplicates(build(&[1,1,1,2,3]))), vec![2,3]);
    assert_eq!(to_vec(&remove_all_duplicates(build(&[1,2,3]))), vec![1,2,3]);
    assert_eq!(to_vec(&remove_all_duplicates(build(&[]))), Vec::<i32>::new());
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn remove_all_duplicates(head: Link) -> Link {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'duplicates', 'hash-map'],
  },
  {
    id: 'ds-ch06-c-017',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sort a Linked List',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn sort_list(head: Link) -> Link that returns the list sorted in ascending order.
Example: [4,2,1,3] becomes [1,2,3,4]. [-1,5,3,4,0] becomes [-1,0,3,4,5].
An empty list or single-node list is already sorted.`,
    hints: [
      'Collect into a Vec, sort it, then rebuild the list.',
      'For an in-place approach, merge sort works naturally on linked lists.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn sort_list(head: Link) -> Link {
    let mut v = to_vec(&head);
    v.sort();
    build(&v)
}

fn main() {
    assert_eq!(to_vec(&sort_list(build(&[4,2,1,3]))), vec![1,2,3,4]);
    assert_eq!(to_vec(&sort_list(build(&[-1,5,3,4,0]))), vec![-1,0,3,4,5]);
    assert_eq!(to_vec(&sort_list(build(&[]))), Vec::<i32>::new());
    assert_eq!(to_vec(&sort_list(build(&[1]))), vec![1]);
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn sort_list(head: Link) -> Link {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'sorting'],
  },
  {
    id: 'ds-ch06-c-018',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Reverse a Sublist Between Two Positions',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn reverse_between(head: Link, left: i32, right: i32) -> Link.
Reverse only the portion of the list from position left to position right (1-indexed, inclusive).
Example: [1,2,3,4,5] with left=2, right=4 gives [1,4,3,2,5].
You may assume 1 <= left <= right <= list length.`,
    hints: [
      'Collect to a Vec, slice-reverse the range [left-1..right], then rebuild.',
      'The slice reverse method works in-place on a Vec slice.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn reverse_between(head: Link, left: i32, right: i32) -> Link {
    let mut v = to_vec(&head);
    let l = (left - 1) as usize;
    let r = right as usize;
    v[l..r].reverse();
    build(&v)
}

fn main() {
    assert_eq!(to_vec(&reverse_between(build(&[1,2,3,4,5]), 2, 4)), vec![1,4,3,2,5]);
    assert_eq!(to_vec(&reverse_between(build(&[5]), 1, 1)), vec![5]);
    assert_eq!(to_vec(&reverse_between(build(&[1,2,3,4,5]), 1, 5)), vec![5,4,3,2,1]);
    assert_eq!(to_vec(&reverse_between(build(&[3,5]), 1, 2)), vec![5,3]);
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn reverse_between(head: Link, left: i32, right: i32) -> Link {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'reversal', 'sublist'],
  },
  {
    id: 'ds-ch06-c-019',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Delete a Node by Value',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn delete_node_by_val(head: Link, val: i32) -> Link.
Remove the first node whose val equals the given value and return the modified list.
Example: [1,2,3,4,5] with val=3 gives [1,2,4,5].
If the value is not present, return the list unchanged.`,
    hints: [
      'Use a dummy head to avoid special-casing the removal of the first node.',
      'Walk until you find the node then unlink it via the previous pointer.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn delete_node_by_val(head: Link, val: i32) -> Link {
    let mut dummy = Box::new(ListNode { val: 0, next: head });
    let mut cur = &mut dummy.next;
    loop {
        match cur {
            None => break,
            Some(node) if node.val == val => {
                let next = node.next.take();
                *cur = next;
                break;
            }
            Some(node) => {
                cur = &mut node.next;
            }
        }
    }
    dummy.next
}

fn main() {
    assert_eq!(to_vec(&delete_node_by_val(build(&[1,2,3,4,5]), 3)), vec![1,2,4,5]);
    assert_eq!(to_vec(&delete_node_by_val(build(&[1,2,3,4,5]), 1)), vec![2,3,4,5]);
    assert_eq!(to_vec(&delete_node_by_val(build(&[1,2,3,4,5]), 5)), vec![1,2,3,4]);
    assert_eq!(to_vec(&delete_node_by_val(build(&[1]), 1)), Vec::<i32>::new());
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn delete_node_by_val(head: Link, val: i32) -> Link {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'deletion'],
  },
  {
    id: 'ds-ch06-c-020',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Intersection of Two Linked Lists by Value',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn intersection_values(l1: Link, l2: Link) -> Vec<i32>.
Return a sorted Vec of values that appear in both lists (no duplicates in output).
Example: [1,2,3,4] and [2,4,6,8] share values 2 and 4, so return [2,4].
Order the output in ascending order.`,
    hints: [
      'Put the values from one list into a HashSet, then check each value in the other.',
      'Use another HashSet to avoid emitting duplicates in the output.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn intersection_values(l1: Link, l2: Link) -> Vec<i32> {
    let v1 = to_vec(&l1);
    let v2 = to_vec(&l2);
    let set2: std::collections::HashSet<i32> = v2.into_iter().collect();
    let mut seen = std::collections::HashSet::new();
    let mut result = Vec::new();
    for x in v1 {
        if set2.contains(&x) && seen.insert(x) {
            result.push(x);
        }
    }
    result.sort();
    result
}

fn main() {
    let mut r = intersection_values(build(&[1,2,3,4]), build(&[2,4,6,8]));
    r.sort();
    assert_eq!(r, vec![2,4]);

    let r2 = intersection_values(build(&[1,3,5]), build(&[2,4,6]));
    assert_eq!(r2, Vec::<i32>::new());

    let r3 = intersection_values(build(&[1,2,2,3]), build(&[2,3,3,4]));
    assert_eq!(r3, vec![2,3]);

    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn intersection_values(l1: Link, l2: Link) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'hash-set', 'intersection'],
  },
  {
    id: 'ds-ch06-c-021',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Reorder List: First-Last Interleave',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn reorder_list(head: Link) -> Link.
Given list L0 -> L1 -> ... -> Ln, reorder it to L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ...
Example: [1,2,3,4] becomes [1,4,2,3] and [1,2,3,4,5] becomes [1,5,2,4,3].
Do not change node values.`,
    hints: [
      'Collect into a Vec, then interleave from both ends using two pointers.',
      'Advance lo and decrement hi alternately until they meet.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn reorder_list(head: Link) -> Link {
    let v = to_vec(&head);
    let n = v.len();
    if n <= 1 { return build(&v); }
    let mut result = Vec::with_capacity(n);
    let mut lo = 0usize;
    let mut hi = n - 1;
    while lo <= hi {
        result.push(v[lo]);
        if lo != hi { result.push(v[hi]); }
        if hi == 0 { break; }
        lo += 1;
        hi -= 1;
    }
    build(&result)
}

fn main() {
    assert_eq!(to_vec(&reorder_list(build(&[1,2,3,4]))), vec![1,4,2,3]);
    assert_eq!(to_vec(&reorder_list(build(&[1,2,3,4,5]))), vec![1,5,2,4,3]);
    assert_eq!(to_vec(&reorder_list(build(&[1]))), vec![1]);
    assert_eq!(to_vec(&reorder_list(build(&[1,2]))), vec![1,2]);
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn reorder_list(head: Link) -> Link {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'two-pointers', 'reorder'],
  },
  {
    id: 'ds-ch06-c-022',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Reverse Nodes in K-Group',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn reverse_k_group(head: Link, k: i32) -> Link.
Reverse nodes in groups of k. If the remaining nodes are fewer than k, leave them in order.
Example: [1,2,3,4,5] with k=2 gives [2,1,4,3,5]; with k=3 gives [3,2,1,4,5].`,
    hints: [
      'Collect into a Vec, reverse consecutive slices of size k, then rebuild.',
      'Only reverse a slice if the remaining count is >= k.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn reverse_k_group(head: Link, k: i32) -> Link {
    let mut v = to_vec(&head);
    let k = k as usize;
    let n = v.len();
    let mut i = 0;
    while i + k <= n {
        v[i..i+k].reverse();
        i += k;
    }
    build(&v)
}

fn main() {
    assert_eq!(to_vec(&reverse_k_group(build(&[1,2,3,4,5]), 2)), vec![2,1,4,3,5]);
    assert_eq!(to_vec(&reverse_k_group(build(&[1,2,3,4,5]), 3)), vec![3,2,1,4,5]);
    assert_eq!(to_vec(&reverse_k_group(build(&[1,2,3,4,5]), 1)), vec![1,2,3,4,5]);
    assert_eq!(to_vec(&reverse_k_group(build(&[1,2]), 2)), vec![2,1]);
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn reverse_k_group(head: Link, k: i32) -> Link {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'reversal', 'grouping'],
  },
  {
    id: 'ds-ch06-c-023',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Merge K Sorted Lists',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn merge_k_sorted(lists: Vec<Link>) -> Link.
Merge all the sorted linked lists in the Vec into one sorted list and return it.
Example: [[1,4,5],[1,3,4],[2,6]] becomes [1,1,2,3,4,4,5,6].
An empty Vec or a Vec containing only empty lists returns an empty list.`,
    hints: [
      'Collect all values from every list into one Vec, sort it, then rebuild.',
      'For better complexity use a min-heap to merge incrementally.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn merge_k_sorted(lists: Vec<Link>) -> Link {
    let mut all: Vec<i32> = lists.iter().flat_map(|l| to_vec(l)).collect();
    all.sort();
    build(&all)
}

fn main() {
    let lists = vec![build(&[1,4,5]), build(&[1,3,4]), build(&[2,6])];
    assert_eq!(to_vec(&merge_k_sorted(lists)), vec![1,1,2,3,4,4,5,6]);

    let lists2 = vec![build(&[])];
    assert_eq!(to_vec(&merge_k_sorted(lists2)), Vec::<i32>::new());

    let lists3 = vec![build(&[1]), build(&[0])];
    assert_eq!(to_vec(&merge_k_sorted(lists3)), vec![0,1]);

    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn merge_k_sorted(lists: Vec<Link>) -> Link {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'merge', 'heap'],
  },
  {
    id: 'ds-ch06-c-024',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Detect a Cycle (Acyclic Check)',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn has_cycle(head: &Link) -> bool.
Return true if the list contains a cycle, false if it is acyclic.
Because safe Rust Box lists are acyclic by construction, focus on the acyclic case:
the function should always return false for lists built with the standard helpers.
Example: any list built with build(&[...]) has no cycle, so return false.`,
    hints: [
      'A Box-based list cannot form a cycle, so traversal always terminates.',
      'Walk the list; if you reach None the list is acyclic.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn has_cycle(head: &Link) -> bool {
    let v = to_vec(head);
    let _ = v;
    false
}

fn main() {
    assert!(!has_cycle(&build(&[1,2,3,4])));
    assert!(!has_cycle(&build(&[])));
    assert!(!has_cycle(&build(&[1])));
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn has_cycle(head: &Link) -> bool {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'cycle-detection'],
  },
  {
    id: 'ds-ch06-c-025',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Multiply Two Numbers Represented as Lists',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn multiply_lists(l1: &Link, l2: &Link) -> i64.
Each list stores a non-negative integer with the most significant digit first.
Return the product of the two numbers as an i64.
Example: [1,2] and [3,4] represent 12 and 34, so return 408.`,
    hints: [
      'Convert each list to a number by walking digits left to right: acc * 10 + digit.',
      'Multiply the two resulting i64 values.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn multiply_lists(l1: &Link, l2: &Link) -> i64 {
    fn list_to_num(head: &Link) -> i64 {
        let v = to_vec(head);
        v.iter().fold(0i64, |acc, &x| acc * 10 + x as i64)
    }
    list_to_num(l1) * list_to_num(l2)
}

fn main() {
    assert_eq!(multiply_lists(&build(&[1,2]), &build(&[3,4])), 12 * 34);
    assert_eq!(multiply_lists(&build(&[9,9,9]), &build(&[9,9,9])), 999 * 999);
    assert_eq!(multiply_lists(&build(&[0]), &build(&[1,2,3])), 0);
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn multiply_lists(l1: &Link, l2: &Link) -> i64 {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'math', 'number-representation'],
  },
  {
    id: 'ds-ch06-c-026',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Flatten and Deduplicate Multiple Sorted Lists',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn flatten_sorted(lists: Vec<Link>) -> Link.
Merge all the lists into one sorted list with no duplicate values.
Example: [[1,3,5,7],[2,3,6,8],[4,5,9,10]] flattened and deduped gives [1,2,3,4,5,6,7,8,9,10].
An empty input Vec or all-empty lists returns an empty list.`,
    hints: [
      'Collect all values, sort them, then call dedup() to remove consecutive duplicates.',
      'Vec::dedup removes consecutive identical elements, so sort first.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn flatten_sorted(lists: Vec<Link>) -> Link {
    let mut all: Vec<i32> = lists.iter().flat_map(|l| to_vec(l)).collect();
    all.sort();
    all.dedup();
    build(&all)
}

fn main() {
    let l = vec![build(&[1,3,5,7]), build(&[2,3,6,8]), build(&[4,5,9,10])];
    assert_eq!(to_vec(&flatten_sorted(l)), vec![1,2,3,4,5,6,7,8,9,10]);

    let l2 = vec![build(&[1,2,3]), build(&[1,2,3])];
    assert_eq!(to_vec(&flatten_sorted(l2)), vec![1,2,3]);

    let l3: Vec<Link> = vec![];
    assert_eq!(to_vec(&flatten_sorted(l3)), Vec::<i32>::new());

    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn flatten_sorted(lists: Vec<Link>) -> Link {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'merge', 'dedup'],
  },
  {
    id: 'ds-ch06-c-027',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Rearrange List into Zigzag Order',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn zigzag_list(head: Link) -> Link.
Rearrange the list values so that v[0] <= v[1] >= v[2] <= v[3] >= v[4] ...
Example: [3,5,2,1,6,4] can become [1,6,2,5,3,4] or any valid zigzag arrangement.
A single swap-adjacent pass is sufficient.`,
    hints: [
      'Walk pairs: at even indices swap if v[i] > v[i+1], at odd indices swap if v[i] < v[i+1].',
      'One linear pass over the Vec is enough to satisfy the zigzag property.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn zigzag_list(head: Link) -> Link {
    let mut v = to_vec(&head);
    let n = v.len();
    if n <= 1 { return build(&v); }
    for i in 0..n-1 {
        if i % 2 == 0 {
            if v[i] > v[i+1] { v.swap(i, i+1); }
        } else {
            if v[i] < v[i+1] { v.swap(i, i+1); }
        }
    }
    build(&v)
}

fn is_zigzag(v: &[i32]) -> bool {
    if v.len() <= 1 { return true; }
    for i in 0..v.len()-1 {
        if i % 2 == 0 {
            if v[i] > v[i+1] { return false; }
        } else {
            if v[i] < v[i+1] { return false; }
        }
    }
    true
}

fn main() {
    let r1 = zigzag_list(build(&[3,5,2,1,6,4]));
    let v1 = to_vec(&r1);
    assert!(is_zigzag(&v1), "Not zigzag: {:?}", v1);

    let r2 = zigzag_list(build(&[1,2,3,4,5]));
    let v2 = to_vec(&r2);
    assert!(is_zigzag(&v2), "Not zigzag: {:?}", v2);

    let r3 = zigzag_list(build(&[1]));
    assert_eq!(to_vec(&r3), vec![1]);

    let r4 = zigzag_list(build(&[5,4,3,2,1]));
    let v4 = to_vec(&r4);
    assert!(is_zigzag(&v4), "Not zigzag: {:?}", v4);

    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn zigzag_list(head: Link) -> Link {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'zigzag', 'rearrangement'],
  },
  {
    id: 'ds-ch06-c-028',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Split List into K Equal Parts',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn split_into_parts(head: Link, k: i32) -> Vec<Vec<i32>>.
Divide the list into k consecutive parts. If the list length is not divisible by k,
the first (len % k) parts get one extra element. Return each part as a Vec<i32>.
Example: [1,2,3] with k=5 gives [[1],[2],[3],[],[]].
[1..10] with k=3 gives [[1,2,3,4],[5,6,7],[8,9,10]].`,
    hints: [
      'Compute part_size = len / k and extra = len % k.',
      'The first extra parts have size part_size + 1; the rest have size part_size.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn split_into_parts(head: Link, k: i32) -> Vec<Vec<i32>> {
    let v = to_vec(&head);
    let n = v.len();
    let k = k as usize;
    let part_size = n / k;
    let extra = n % k;
    let mut result = Vec::new();
    let mut idx = 0;
    for i in 0..k {
        let size = part_size + if i < extra { 1 } else { 0 };
        result.push(v[idx..idx+size].to_vec());
        idx += size;
    }
    result
}

fn main() {
    let r1 = split_into_parts(build(&[1,2,3]), 5);
    assert_eq!(r1, vec![vec![1], vec![2], vec![3], vec![], vec![]]);

    let r2 = split_into_parts(build(&[1,2,3,4,5,6,7,8,9,10]), 3);
    assert_eq!(r2, vec![vec![1,2,3,4], vec![5,6,7], vec![8,9,10]]);

    let r3 = split_into_parts(build(&[1,2,3,4,5,6,7,8,9]), 3);
    assert_eq!(r3, vec![vec![1,2,3], vec![4,5,6], vec![7,8,9]]);

    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn split_into_parts(head: Link, k: i32) -> Vec<Vec<i32>> {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'split', 'partitioning'],
  },
  {
    id: 'ds-ch06-c-029',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Next Greater Node in Linked List',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn next_larger_nodes(head: Link) -> Vec<i32>.
For each node, find the value of the next node that is strictly greater. If none exists, use 0.
Return the answers as a Vec<i32> indexed by position.
Example: [2,1,5] returns [5,5,0]. [2,7,4,3,5] returns [7,0,5,5,0].`,
    hints: [
      'Use a monotonic stack storing indices of unresolved nodes.',
      'When you encounter a value larger than the stack top, pop and record the answer.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn next_larger_nodes(head: Link) -> Vec<i32> {
    let v = to_vec(&head);
    let n = v.len();
    let mut result = vec![0i32; n];
    let mut stack: Vec<usize> = Vec::new();
    for i in 0..n {
        while let Some(&top) = stack.last() {
            if v[i] > v[top] {
                result[top] = v[i];
                stack.pop();
            } else {
                break;
            }
        }
        stack.push(i);
    }
    result
}

fn main() {
    assert_eq!(next_larger_nodes(build(&[2,1,5])), vec![5,5,0]);
    assert_eq!(next_larger_nodes(build(&[2,7,4,3,5])), vec![7,0,5,5,0]);
    assert_eq!(next_larger_nodes(build(&[1,7,5,1,9,2,5,1])), vec![7,9,9,9,0,5,0,0]);
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn next_larger_nodes(head: Link) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'monotonic-stack'],
  },
  {
    id: 'ds-ch06-c-030',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Double a Number Stored as a Linked List',
    prompt: `Use the singly linked list type:

    type Link = Option<Box<ListNode>>;  struct ListNode { val: i32, next: Link }

Implement fn double_it(head: Link) -> Link.
The list stores a positive integer with the most significant digit at the head.
Double the number and return the result as a new list in the same format.
Example: [1,8,9] represents 189, doubled is 378, so return [3,7,8].
[9,9,9] represents 999, doubled is 1998, so return [1,9,9,8].`,
    hints: [
      'Convert the list to a number, multiply by 2, then convert the result back to a digit list.',
      'Extract digits by repeatedly taking num % 10, then reverse.',
    ],
    solution: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn build(v: &[i32]) -> Link {
    let mut head: Link = None;
    for &x in v.iter().rev() {
        head = Some(Box::new(ListNode { val: x, next: head }));
    }
    head
}
fn to_vec(mut head: &Link) -> Vec<i32> {
    let mut out = Vec::new();
    while let Some(n) = head {
        out.push(n.val);
        head = &n.next;
    }
    out
}

fn double_it(head: Link) -> Link {
    let v = to_vec(&head);
    let num: i64 = v.iter().fold(0i64, |acc, &x| acc * 10 + x as i64);
    let doubled = num * 2;
    if doubled == 0 { return build(&[0]); }
    let mut digits = Vec::new();
    let mut d = doubled;
    while d > 0 {
        digits.push((d % 10) as i32);
        d /= 10;
    }
    digits.reverse();
    build(&digits)
}

fn ref_double(v: &[i32]) -> Vec<i32> {
    let num: i64 = v.iter().fold(0i64, |acc, &x| acc * 10 + x as i64);
    let doubled = num * 2;
    if doubled == 0 { return vec![0]; }
    let mut digits = Vec::new();
    let mut d = doubled;
    while d > 0 {
        digits.push((d % 10) as i32);
        d /= 10;
    }
    digits.reverse();
    digits
}

fn main() {
    for &input in &[&[1,8,9i32][..], &[9,9,9], &[1,2,3,4], &[0]] {
        let expected = ref_double(input);
        let got = to_vec(&double_it(build(input)));
        assert_eq!(got, expected, "input: {:?}", input);
    }
    println!("ok");
}`,
    starter: `type Link = Option<Box<ListNode>>;
struct ListNode { val: i32, next: Link }

fn double_it(head: Link) -> Link {
    // TODO
    todo!()
}

fn main() {
    println!("ok");
}`,
    tags: ['linked-list', 'math', 'number-representation'],
  },
]

export default problems
