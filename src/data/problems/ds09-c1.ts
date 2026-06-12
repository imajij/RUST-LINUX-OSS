import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch09-c-001',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Kth Largest Element',
    prompt: `Implement:

    fn kth_largest(nums: &[i32], k: usize) -> i32

Return the k-th largest value in the slice (k is 1-based).
Assume 1 <= k <= nums.len() and the slice is non-empty.
Example: nums = [3, 2, 1, 5, 6, 4], k = 2  ->  5`,
    hints: [
      'A min-heap of size k holds the k largest values seen so far.',
      'Use BinaryHeap<Reverse<i32>> for a min-heap; the root is the smallest of the k largest.',
    ],
    solution: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn kth_largest(nums: &[i32], k: usize) -> i32 {
    let mut heap: BinaryHeap<Reverse<i32>> = BinaryHeap::new();
    for &n in nums {
        heap.push(Reverse(n));
        if heap.len() > k {
            heap.pop();
        }
    }
    heap.peek().unwrap().0
}

fn main() {
    assert_eq!(kth_largest(&[3, 2, 1, 5, 6, 4], 2), 5);
    assert_eq!(kth_largest(&[1], 1), 1);
    assert_eq!(kth_largest(&[7, 6, 5, 4, 3, 2, 1], 3), 5);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn kth_largest(nums: &[i32], k: usize) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(kth_largest(&[3, 2, 1, 5, 6, 4], 2), 5);
    println!("ok");
}`,
    tags: ['heap', 'top-k'],
  },
  {
    id: 'ds-ch09-c-002',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Kth Smallest Element',
    prompt: `Implement:

    fn kth_smallest(nums: &[i32], k: usize) -> i32

Return the k-th smallest value in the slice (k is 1-based).
Assume 1 <= k <= nums.len() and the slice is non-empty.
Example: nums = [3, 2, 1, 5, 6, 4], k = 2  ->  2`,
    hints: [
      'A max-heap of size k keeps the k smallest values seen so far.',
      'BinaryHeap is a max-heap by default; the root is the largest of the k smallest.',
    ],
    solution: `use std::collections::BinaryHeap;

fn kth_smallest(nums: &[i32], k: usize) -> i32 {
    let mut heap: BinaryHeap<i32> = BinaryHeap::new();
    for &n in nums {
        heap.push(n);
        if heap.len() > k {
            heap.pop();
        }
    }
    *heap.peek().unwrap()
}

fn main() {
    assert_eq!(kth_smallest(&[3, 2, 1, 5, 6, 4], 2), 2);
    assert_eq!(kth_smallest(&[1], 1), 1);
    assert_eq!(kth_smallest(&[7, 6, 5, 4, 3, 2, 1], 3), 3);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;

fn kth_smallest(nums: &[i32], k: usize) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(kth_smallest(&[3, 2, 1, 5, 6, 4], 2), 2);
    println!("ok");
}`,
    tags: ['heap', 'top-k'],
  },
  {
    id: 'ds-ch09-c-003',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Last Stone Weight',
    prompt: `Implement:

    fn last_stone_weight(stones: Vec<i32>) -> i32

Smash the two heaviest stones: if equal both are destroyed; otherwise the
difference survives. Repeat until at most one stone remains.
Return the weight of the last stone, or 0 if none remain.
Example: [2, 7, 4, 1, 8, 1]  ->  1`,
    hints: [
      'Pop the two largest values from a max-heap each round.',
      'BinaryHeap::from(vec) builds a heap in O(n).',
    ],
    solution: `use std::collections::BinaryHeap;

fn last_stone_weight(stones: Vec<i32>) -> i32 {
    let mut heap: BinaryHeap<i32> = BinaryHeap::from(stones);
    while heap.len() > 1 {
        let a = heap.pop().unwrap();
        let b = heap.pop().unwrap();
        if a != b {
            heap.push(a - b);
        }
    }
    heap.pop().unwrap_or(0)
}

fn main() {
    assert_eq!(last_stone_weight(vec![2, 7, 4, 1, 8, 1]), 1);
    assert_eq!(last_stone_weight(vec![1]), 1);
    assert_eq!(last_stone_weight(vec![2, 2]), 0);
    assert_eq!(last_stone_weight(vec![3, 3, 3]), 3);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;

fn last_stone_weight(stones: Vec<i32>) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(last_stone_weight(vec![2, 7, 4, 1, 8, 1]), 1);
    println!("ok");
}`,
    tags: ['heap', 'simulation', 'greedy'],
  },
  {
    id: 'ds-ch09-c-004',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'K Closest Numbers to Target',
    prompt: `Implement:

    fn k_closest_numbers(arr: &[i32], k: usize, target: i32) -> Vec<i32>

Return the k numbers in arr whose absolute distance to target is smallest.
Return the result sorted in ascending order.
Distances are compared by |x - target|; ties are broken by taking the smaller value.
Example: arr = [1, 2, 3, 4, 5], k = 4, target = 3  ->  [1, 2, 3, 4]`,
    hints: [
      'Use a max-heap keyed by (distance, value); evict the element with the largest key when size exceeds k.',
      'Ties in distance: larger value has a larger (dist, val) key and gets evicted first.',
    ],
    solution: `use std::collections::BinaryHeap;

fn k_closest_numbers(arr: &[i32], k: usize, target: i32) -> Vec<i32> {
    let mut heap: BinaryHeap<(i32, i32)> = BinaryHeap::new();
    for &x in arr {
        let dist = (x - target).abs();
        heap.push((dist, x));
        if heap.len() > k {
            heap.pop();
        }
    }
    let mut result: Vec<i32> = heap.into_iter().map(|(_, v)| v).collect();
    result.sort();
    result
}

fn main() {
    assert_eq!(k_closest_numbers(&[1, 2, 3, 4, 5], 4, 3), vec![1, 2, 3, 4]);
    assert_eq!(k_closest_numbers(&[1, 3, 5, 7, 9], 2, 6), vec![5, 7]);
    assert_eq!(k_closest_numbers(&[1, 2, 3], 2, 2), vec![1, 2]);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;

fn k_closest_numbers(arr: &[i32], k: usize, target: i32) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(k_closest_numbers(&[1, 2, 3, 4, 5], 4, 3), vec![1, 2, 3, 4]);
    println!("ok");
}`,
    tags: ['heap', 'top-k', 'sorting'],
  },
  {
    id: 'ds-ch09-c-005',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Top K Frequent Elements',
    prompt: `Implement:

    fn top_k_frequent(nums: &[i32], k: usize) -> Vec<i32>

Return the k most frequently occurring integers in nums, sorted ascending.
Tie-break rule: if two numbers have equal frequency, keep the one with the smaller value.
Example: nums = [1,1,1,2,2,3], k = 2  ->  [1, 2]`,
    hints: [
      'Count frequencies with a HashMap, then use a size-k min-heap keyed by (freq, Reverse(val)).',
      'Evict the element with the smallest (freq, Reverse(val)); that evicts lower-frequency and, on ties, larger values.',
    ],
    solution: `use std::collections::BinaryHeap;
use std::cmp::Reverse;
use std::collections::HashMap;

fn top_k_frequent(nums: &[i32], k: usize) -> Vec<i32> {
    let mut freq: HashMap<i32, usize> = HashMap::new();
    for &n in nums {
        *freq.entry(n).or_insert(0) += 1;
    }
    let mut heap: BinaryHeap<Reverse<(usize, Reverse<i32>)>> = BinaryHeap::new();
    for (&val, &cnt) in &freq {
        heap.push(Reverse((cnt, Reverse(val))));
        if heap.len() > k {
            heap.pop();
        }
    }
    let mut result: Vec<i32> = heap
        .into_iter()
        .map(|Reverse((_, Reverse(v)))| v)
        .collect();
    result.sort();
    result
}

fn main() {
    assert_eq!(top_k_frequent(&[1, 1, 1, 2, 2, 3], 2), vec![1, 2]);
    assert_eq!(top_k_frequent(&[1], 1), vec![1]);
    let mut r = top_k_frequent(&[1, 1, 2, 2, 3], 2);
    r.sort();
    assert_eq!(r, vec![1, 2]);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;
use std::cmp::Reverse;
use std::collections::HashMap;

fn top_k_frequent(nums: &[i32], k: usize) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(top_k_frequent(&[1, 1, 1, 2, 2, 3], 2), vec![1, 2]);
    println!("ok");
}`,
    tags: ['heap', 'hashmap', 'top-k'],
  },
  {
    id: 'ds-ch09-c-006',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Sort Characters by Frequency',
    prompt: `Implement:

    fn sort_chars_by_frequency(s: &str) -> String

Rearrange the characters of s so that characters appear in non-increasing order
of frequency. Characters with equal frequency may appear in any relative order,
but all copies of the same character must be contiguous.
Example: "tree"  ->  "eert" or "eetr"  (two e, one r, one t)`,
    hints: [
      'Count character frequencies with a HashMap.',
      'Push (freq, char) into a max-heap and build the result by popping and repeating each char.',
    ],
    solution: `use std::collections::BinaryHeap;
use std::collections::HashMap;

fn sort_chars_by_frequency(s: &str) -> String {
    let mut freq: HashMap<char, usize> = HashMap::new();
    for c in s.chars() {
        *freq.entry(c).or_insert(0) += 1;
    }
    let mut heap: BinaryHeap<(usize, char)> = BinaryHeap::new();
    for (c, cnt) in freq {
        heap.push((cnt, c));
    }
    let mut result = String::new();
    while let Some((cnt, c)) = heap.pop() {
        for _ in 0..cnt {
            result.push(c);
        }
    }
    result
}

fn verify(s: &str, result: &str) -> bool {
    if s.len() != result.len() { return false; }
    let chars: Vec<char> = result.chars().collect();
    let mut i = 0;
    while i < chars.len() {
        let c = chars[i];
        let start = i;
        while i < chars.len() && chars[i] == c { i += 1; }
        if (i - start) != s.chars().filter(|&x| x == c).count() { return false; }
    }
    true
}

fn main() {
    let r1 = sort_chars_by_frequency("tree");
    assert!(verify("tree", &r1));
    let r2 = sort_chars_by_frequency("cccaaa");
    assert!(verify("cccaaa", &r2));
    let r3 = sort_chars_by_frequency("Aabb");
    assert!(verify("Aabb", &r3));
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;
use std::collections::HashMap;

fn sort_chars_by_frequency(s: &str) -> String {
    // TODO
    todo!()
}

fn main() {
    let r = sort_chars_by_frequency("tree");
    assert_eq!(r.len(), 4);
    println!("ok");
}`,
    tags: ['heap', 'hashmap', 'string'],
  },
  {
    id: 'ds-ch09-c-007',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'K Closest Points to Origin',
    prompt: `Implement:

    fn k_closest_points(points: &[[i32; 2]], k: usize) -> Vec<[i32; 2]>

Return the k points closest to the origin (0, 0) by Euclidean distance.
Return the result sorted lexicographically (sort by x, then y).
Distance ties may be broken in any order.
Example: points = [[1,3],[-2,2]], k = 1  ->  [[-2, 2]]`,
    hints: [
      'Compare by squared distance to avoid floating point.',
      'Maintain a max-heap of size k; evict the farthest point when the heap grows past k.',
    ],
    solution: `use std::collections::BinaryHeap;

fn k_closest_points(points: &[[i32; 2]], k: usize) -> Vec<[i32; 2]> {
    let mut heap: BinaryHeap<(i64, [i32; 2])> = BinaryHeap::new();
    for &p in points {
        let d = (p[0] as i64) * (p[0] as i64) + (p[1] as i64) * (p[1] as i64);
        heap.push((d, p));
        if heap.len() > k {
            heap.pop();
        }
    }
    let mut result: Vec<[i32; 2]> = heap.into_iter().map(|(_, p)| p).collect();
    result.sort();
    result
}

fn main() {
    let pts = vec![[1, 3], [-2, 2]];
    assert_eq!(k_closest_points(&pts, 1), vec![[-2, 2]]);
    let pts2 = vec![[3, 3], [5, -1], [-2, 4]];
    assert_eq!(k_closest_points(&pts2, 2), vec![[-2, 4], [3, 3]]);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;

fn k_closest_points(points: &[[i32; 2]], k: usize) -> Vec<[i32; 2]> {
    // TODO
    todo!()
}

fn main() {
    let pts = vec![[1, 3], [-2, 2]];
    assert_eq!(k_closest_points(&pts, 1), vec![[-2, 2]]);
    println!("ok");
}`,
    tags: ['heap', 'top-k', 'geometry'],
  },
  {
    id: 'ds-ch09-c-008',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Merge K Sorted Vectors',
    prompt: `Implement:

    fn merge_k_sorted(lists: Vec<Vec<i32>>) -> Vec<i32>

Merge k sorted integer vectors into a single sorted vector and return it.
All input vectors are sorted in ascending order.
Example: [[1,4,7],[2,5,8],[3,6,9]]  ->  [1,2,3,4,5,6,7,8,9]`,
    hints: [
      'Seed a min-heap with the first element of each non-empty list.',
      'Each pop yields the next output element; push its successor from the same list.',
    ],
    solution: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn merge_k_sorted(lists: Vec<Vec<i32>>) -> Vec<i32> {
    let mut heap: BinaryHeap<Reverse<(i32, usize, usize)>> = BinaryHeap::new();
    for (i, list) in lists.iter().enumerate() {
        if !list.is_empty() {
            heap.push(Reverse((list[0], i, 0)));
        }
    }
    let mut result = Vec::new();
    while let Some(Reverse((val, li, ei))) = heap.pop() {
        result.push(val);
        if ei + 1 < lists[li].len() {
            heap.push(Reverse((lists[li][ei + 1], li, ei + 1)));
        }
    }
    result
}

fn main() {
    let lists = vec![vec![1, 4, 7], vec![2, 5, 8], vec![3, 6, 9]];
    assert_eq!(merge_k_sorted(lists), vec![1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let lists2 = vec![vec![1, 3, 5], vec![2, 4, 6]];
    assert_eq!(merge_k_sorted(lists2), vec![1, 2, 3, 4, 5, 6]);
    let lists3: Vec<Vec<i32>> = vec![];
    assert_eq!(merge_k_sorted(lists3), vec![]);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn merge_k_sorted(lists: Vec<Vec<i32>>) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    let lists = vec![vec![1, 4, 7], vec![2, 5, 8], vec![3, 6, 9]];
    assert_eq!(merge_k_sorted(lists), vec![1, 2, 3, 4, 5, 6, 7, 8, 9]);
    println!("ok");
}`,
    tags: ['heap', 'merge', 'k-way'],
  },
  {
    id: 'ds-ch09-c-009',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'K Smallest Pairs by Sum',
    prompt: `Implement:

    fn k_smallest_pairs(nums1: &[i32], nums2: &[i32], k: usize) -> Vec<[i32; 2]>

Given two sorted arrays nums1 and nums2, return the k pairs [nums1[i], nums2[j]]
with the smallest sums, in the order they are found (smallest sum first).
If there are fewer than k pairs available, return all pairs.
Example: nums1=[1,7,11], nums2=[2,4,6], k=3  ->  [[1,2],[1,4],[1,6]]`,
    hints: [
      'Seed the min-heap with pairs (nums1[i], nums2[0]) for i in 0..min(k, nums1.len()).',
      'When you pop (sum, i, j), push (sum, i, j+1) if j+1 is in bounds.',
    ],
    solution: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn k_smallest_pairs(nums1: &[i32], nums2: &[i32], k: usize) -> Vec<[i32; 2]> {
    if nums1.is_empty() || nums2.is_empty() {
        return vec![];
    }
    let mut heap: BinaryHeap<Reverse<(i32, usize, usize)>> = BinaryHeap::new();
    for i in 0..nums1.len().min(k) {
        heap.push(Reverse((nums1[i] + nums2[0], i, 0)));
    }
    let mut result = Vec::new();
    while result.len() < k {
        if let Some(Reverse((_, i, j))) = heap.pop() {
            result.push([nums1[i], nums2[j]]);
            if j + 1 < nums2.len() {
                heap.push(Reverse((nums1[i] + nums2[j + 1], i, j + 1)));
            }
        } else {
            break;
        }
    }
    result
}

fn main() {
    let r = k_smallest_pairs(&[1, 7, 11], &[2, 4, 6], 3);
    assert_eq!(r, vec![[1, 2], [1, 4], [1, 6]]);
    let r2 = k_smallest_pairs(&[1, 1, 2], &[1, 2, 3], 2);
    assert_eq!(r2, vec![[1, 1], [1, 1]]);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn k_smallest_pairs(nums1: &[i32], nums2: &[i32], k: usize) -> Vec<[i32; 2]> {
    // TODO
    todo!()
}

fn main() {
    let r = k_smallest_pairs(&[1, 7, 11], &[2, 4, 6], 3);
    assert_eq!(r, vec![[1, 2], [1, 4], [1, 6]]);
    println!("ok");
}`,
    tags: ['heap', 'top-k', 'two-arrays'],
  },
  {
    id: 'ds-ch09-c-010',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Connect Ropes with Minimum Cost',
    prompt: `Implement:

    fn connect_ropes(ropes: Vec<i32>) -> i64

You are given n rope lengths. To connect two ropes into one you pay a cost equal
to the sum of their lengths. Find the minimum total cost to connect all ropes.
Return 0 if there is only one rope (no connections needed).
Example: [4, 3, 2, 6]  ->  29`,
    hints: [
      'This is the greedy Huffman-style approach: always merge the two shortest ropes.',
      'Use a min-heap; pop two, push their sum, accumulate the cost.',
    ],
    solution: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn connect_ropes(ropes: Vec<i32>) -> i64 {
    let mut heap: BinaryHeap<Reverse<i64>> = BinaryHeap::new();
    for r in ropes {
        heap.push(Reverse(r as i64));
    }
    let mut total_cost: i64 = 0;
    while heap.len() > 1 {
        let Reverse(a) = heap.pop().unwrap();
        let Reverse(b) = heap.pop().unwrap();
        let combined = a + b;
        total_cost += combined;
        heap.push(Reverse(combined));
    }
    total_cost
}

fn main() {
    assert_eq!(connect_ropes(vec![4, 3, 2, 6]), 29);
    assert_eq!(connect_ropes(vec![1, 2, 3]), 9);
    assert_eq!(connect_ropes(vec![5]), 0);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn connect_ropes(ropes: Vec<i32>) -> i64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(connect_ropes(vec![4, 3, 2, 6]), 29);
    println!("ok");
}`,
    tags: ['heap', 'greedy', 'huffman'],
  },
  {
    id: 'ds-ch09-c-011',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Single-Threaded CPU Task Order',
    prompt: `Implement:

    fn cpu_task_order(tasks: &[[i32; 2]]) -> Vec<usize>

tasks[i] = [enqueue_time, processing_time]. A single CPU processes one task at a time.
At each moment it picks the available task with the smallest processing time (tie-break:
smallest original index). Return the indices of tasks in the order processed.
Example: tasks=[[1,2],[2,4],[3,2],[4,1]]  ->  [0,2,3,1]`,
    hints: [
      'Sort task indices by enqueue time. Advance a clock variable and push newly available tasks into a min-heap.',
      'Min-heap key is (processing_time, original_index). If heap is empty, jump the clock to the next enqueue time.',
    ],
    solution: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn cpu_task_order(tasks: &[[i32; 2]]) -> Vec<usize> {
    let n = tasks.len();
    let mut sorted: Vec<usize> = (0..n).collect();
    sorted.sort_by_key(|&i| (tasks[i][0], i));
    let mut heap: BinaryHeap<Reverse<(i32, usize)>> = BinaryHeap::new();
    let mut result: Vec<usize> = Vec::with_capacity(n);
    let mut time: i64 = 0;
    let mut si = 0;
    while result.len() < n {
        while si < n && tasks[sorted[si]][0] as i64 <= time {
            let idx = sorted[si];
            heap.push(Reverse((tasks[idx][1], idx)));
            si += 1;
        }
        if heap.is_empty() {
            time = tasks[sorted[si]][0] as i64;
            continue;
        }
        let Reverse((proc_time, idx)) = heap.pop().unwrap();
        result.push(idx);
        time += proc_time as i64;
    }
    result
}

fn main() {
    let tasks = [[1, 2], [2, 4], [3, 2], [4, 1]];
    assert_eq!(cpu_task_order(&tasks), vec![0, 2, 3, 1]);
    let tasks2 = [[7, 10], [7, 12], [7, 5], [7, 4], [7, 2]];
    assert_eq!(cpu_task_order(&tasks2), vec![4, 3, 2, 0, 1]);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn cpu_task_order(tasks: &[[i32; 2]]) -> Vec<usize> {
    // TODO
    todo!()
}

fn main() {
    let tasks = [[1, 2], [2, 4], [3, 2], [4, 1]];
    assert_eq!(cpu_task_order(&tasks), vec![0, 2, 3, 1]);
    println!("ok");
}`,
    tags: ['heap', 'simulation', 'scheduling'],
  },
  {
    id: 'ds-ch09-c-012',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Heap Sort',
    prompt: `Implement:

    fn heap_sort(arr: &mut Vec<i32>)

Sort the vector in ascending order using a max-heap (BinaryHeap).
You may use BinaryHeap::from to construct the heap, then drain it in reverse.
Example: [3,1,4,1,5,9]  ->  [1,1,3,4,5,9]`,
    hints: [
      'Push all elements into a BinaryHeap (max-heap), then fill the vector from the end by popping.',
      'Alternatively use BinaryHeap::from for O(n) construction.',
    ],
    solution: `use std::collections::BinaryHeap;

fn heap_sort(arr: &mut Vec<i32>) {
    let mut heap: BinaryHeap<i32> = BinaryHeap::from(arr.clone());
    let n = arr.len();
    for i in (0..n).rev() {
        arr[i] = heap.pop().unwrap();
    }
}

fn main() {
    let mut v = vec![3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
    heap_sort(&mut v);
    assert_eq!(v, vec![1, 1, 2, 3, 3, 4, 5, 5, 6, 9]);
    let mut v2 = vec![5, 4, 3, 2, 1];
    heap_sort(&mut v2);
    assert_eq!(v2, vec![1, 2, 3, 4, 5]);
    let mut v3: Vec<i32> = vec![];
    heap_sort(&mut v3);
    assert_eq!(v3, vec![]);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;

fn heap_sort(arr: &mut Vec<i32>) {
    // TODO
    todo!()
}

fn main() {
    let mut v = vec![3, 1, 4, 1, 5, 9];
    heap_sort(&mut v);
    assert_eq!(v, vec![1, 1, 3, 4, 5, 9]);
    println!("ok");
}`,
    tags: ['heap', 'sorting'],
  },
  {
    id: 'ds-ch09-c-013',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Top K Frequent Words',
    prompt: `Implement:

    fn top_k_frequent_words(words: &[&str], k: usize) -> Vec<String>

Return the k most frequent words, sorted by frequency descending.
Ties in frequency are broken alphabetically ascending (earlier in alphabet wins).
Example: ["i","love","leetcode","i","love","coding"], k=2  ->  ["i","love"]`,
    hints: [
      'Count frequencies with a HashMap.',
      'Use a min-heap of size k with key (Reverse(freq), word) so the element to evict (lowest freq, largest alpha) is the max.',
    ],
    solution: `use std::collections::BinaryHeap;
use std::cmp::Reverse;
use std::collections::HashMap;

fn top_k_frequent_words(words: &[&str], k: usize) -> Vec<String> {
    let mut freq: HashMap<&str, usize> = HashMap::new();
    for &w in words {
        *freq.entry(w).or_insert(0) += 1;
    }
    let mut heap: BinaryHeap<(Reverse<usize>, &str)> = BinaryHeap::new();
    for (&w, &cnt) in &freq {
        heap.push((Reverse(cnt), w));
        if heap.len() > k {
            heap.pop();
        }
    }
    let mut items: Vec<(usize, &str)> = heap
        .into_iter()
        .map(|(Reverse(c), w)| (c, w))
        .collect();
    items.sort_by(|a, b| b.0.cmp(&a.0).then(a.1.cmp(&b.1)));
    items.into_iter().map(|(_, w)| w.to_string()).collect()
}

fn main() {
    let words = ["i", "love", "leetcode", "i", "love", "coding"];
    assert_eq!(top_k_frequent_words(&words, 2), vec!["i", "love"]);
    let words2 = ["the","day","is","sunny","the","the","the","sunny","is","is"];
    assert_eq!(top_k_frequent_words(&words2, 4), vec!["the","is","sunny","day"]);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;
use std::cmp::Reverse;
use std::collections::HashMap;

fn top_k_frequent_words(words: &[&str], k: usize) -> Vec<String> {
    // TODO
    todo!()
}

fn main() {
    let words = ["i", "love", "leetcode", "i", "love", "coding"];
    assert_eq!(top_k_frequent_words(&words, 2), vec!["i", "love"]);
    println!("ok");
}`,
    tags: ['heap', 'hashmap', 'top-k', 'string'],
  },
  {
    id: 'ds-ch09-c-014',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Minimum Cost to Hire K Workers',
    prompt: `Implement:

    fn min_cost_to_hire_k_workers(quality: &[i32], wage: &[i32], k: usize) -> f64

Hire exactly k workers. All k must share the same wage-per-quality ratio r.
Each worker i requires r >= wage[i]/quality[i]. Total cost = r * sum(quality of hired).
Return the minimum total cost rounded to 5 decimal places.
Example: quality=[10,20,5], wage=[70,50,30], k=2  ->  105.0`,
    hints: [
      'Sort workers by their ratio wage[i]/quality[i] ascending.',
      'Iterate: fix the current worker as the one with the highest ratio. Maintain a max-heap of quality values of size k; evict the largest quality to minimize total quality sum.',
    ],
    solution: `use std::collections::BinaryHeap;

fn min_cost_to_hire_k_workers(quality: &[i32], wage: &[i32], k: usize) -> f64 {
    let n = quality.len();
    let mut workers: Vec<(f64, i32)> = (0..n)
        .map(|i| (wage[i] as f64 / quality[i] as f64, quality[i]))
        .collect();
    workers.sort_by(|a, b| a.0.partial_cmp(&b.0).unwrap());
    let mut heap: BinaryHeap<i32> = BinaryHeap::new();
    let mut quality_sum: i64 = 0;
    let mut ans = f64::MAX;
    for (ratio, q) in workers {
        heap.push(q);
        quality_sum += q as i64;
        if heap.len() > k {
            quality_sum -= heap.pop().unwrap() as i64;
        }
        if heap.len() == k {
            ans = ans.min(ratio * quality_sum as f64);
        }
    }
    (ans * 100000.0).round() / 100000.0
}

fn main() {
    let quality = [10, 20, 5];
    let wage = [70, 50, 30];
    let r = min_cost_to_hire_k_workers(&quality, &wage, 2);
    assert!((r - 105.0).abs() < 0.001);
    let quality2 = [3, 1, 10, 10, 1];
    let wage2 = [4, 8, 2, 2, 7];
    let r2 = min_cost_to_hire_k_workers(&quality2, &wage2, 3);
    assert!((r2 - 30.66667).abs() < 0.001, "got {}", r2);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;

fn min_cost_to_hire_k_workers(quality: &[i32], wage: &[i32], k: usize) -> f64 {
    // TODO
    todo!()
}

fn main() {
    let quality = [10, 20, 5];
    let wage = [70, 50, 30];
    let r = min_cost_to_hire_k_workers(&quality, &wage, 2);
    assert!((r - 105.0).abs() < 0.001);
    println!("ok");
}`,
    tags: ['heap', 'greedy', 'sorting', 'math'],
  },
  {
    id: 'ds-ch09-c-015',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Kth Smallest Element in Sorted Matrix',
    prompt: `Implement:

    fn kth_smallest_matrix(matrix: &Vec<Vec<i32>>, k: usize) -> i32

Given an n x n matrix where each row and each column is sorted in ascending order,
return the k-th smallest element (1-based). Assume 1 <= k <= n*n.
Example: matrix=[[1,5,9],[10,11,13],[12,13,15]], k=8  ->  13`,
    hints: [
      'Seed a min-heap with the first element of each row.',
      'Pop the smallest, push its right neighbor; the k-th popped value is the answer.',
    ],
    solution: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn kth_smallest_matrix(matrix: &Vec<Vec<i32>>, k: usize) -> i32 {
    let n = matrix.len();
    let mut heap: BinaryHeap<Reverse<(i32, usize, usize)>> = BinaryHeap::new();
    for i in 0..n {
        heap.push(Reverse((matrix[i][0], i, 0)));
    }
    let mut count = 0;
    let mut val = 0;
    while let Some(Reverse((v, r, c))) = heap.pop() {
        count += 1;
        val = v;
        if count == k { break; }
        if c + 1 < matrix[r].len() {
            heap.push(Reverse((matrix[r][c + 1], r, c + 1)));
        }
    }
    val
}

fn main() {
    let m = vec![vec![1, 5, 9], vec![10, 11, 13], vec![12, 13, 15]];
    assert_eq!(kth_smallest_matrix(&m, 8), 13);
    assert_eq!(kth_smallest_matrix(&m, 1), 1);
    assert_eq!(kth_smallest_matrix(&m, 9), 15);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn kth_smallest_matrix(matrix: &Vec<Vec<i32>>, k: usize) -> i32 {
    // TODO
    todo!()
}

fn main() {
    let m = vec![vec![1, 5, 9], vec![10, 11, 13], vec![12, 13, 15]];
    assert_eq!(kth_smallest_matrix(&m, 8), 13);
    println!("ok");
}`,
    tags: ['heap', 'matrix', 'top-k'],
  },
  {
    id: 'ds-ch09-c-016',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Kth Smallest Sum from Two Sorted Arrays',
    prompt: `Implement:

    fn kth_smallest_sum(a: &[i32], b: &[i32], k: usize) -> i32

Both arrays a and b are sorted ascending. Pick one element from each to form a sum.
Return the k-th smallest possible sum (1-based). Assume k <= a.len() * b.len().
Example: a=[1,7,11], b=[2,4,6], k=3  ->  7  (sums in order: 3,5,7,9,11,13,13,15,17)`,
    hints: [
      'Seed the min-heap with (a[0]+b[0], 0, 0). When popping (s, i, j), push (i+1, j) and (i, j+1) if not visited.',
      'Use a HashSet to avoid pushing duplicate (i, j) pairs.',
    ],
    solution: `use std::collections::BinaryHeap;
use std::cmp::Reverse;
use std::collections::HashSet;

fn kth_smallest_sum(a: &[i32], b: &[i32], k: usize) -> i32 {
    let mut heap: BinaryHeap<Reverse<(i32, usize, usize)>> = BinaryHeap::new();
    let mut visited: HashSet<(usize, usize)> = HashSet::new();
    heap.push(Reverse((a[0] + b[0], 0, 0)));
    visited.insert((0, 0));
    let mut count = 0;
    loop {
        if let Some(Reverse((s, i, j))) = heap.pop() {
            count += 1;
            if count == k { return s; }
            if i + 1 < a.len() && !visited.contains(&(i + 1, j)) {
                heap.push(Reverse((a[i + 1] + b[j], i + 1, j)));
                visited.insert((i + 1, j));
            }
            if j + 1 < b.len() && !visited.contains(&(i, j + 1)) {
                heap.push(Reverse((a[i] + b[j + 1], i, j + 1)));
                visited.insert((i, j + 1));
            }
        }
    }
}

fn main() {
    assert_eq!(kth_smallest_sum(&[1, 7, 11], &[2, 4, 6], 3), 7);
    assert_eq!(kth_smallest_sum(&[1, 2], &[3, 4], 2), 5);
    let a = [1, 3, 5];
    let b = [2, 4, 6];
    let mut sums: Vec<i32> = Vec::new();
    for &x in &a { for &y in &b { sums.push(x + y); } }
    sums.sort();
    for k in 1..=9 {
        assert_eq!(kth_smallest_sum(&a, &b, k), sums[k - 1]);
    }
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;
use std::cmp::Reverse;
use std::collections::HashSet;

fn kth_smallest_sum(a: &[i32], b: &[i32], k: usize) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(kth_smallest_sum(&[1, 7, 11], &[2, 4, 6], 3), 7);
    println!("ok");
}`,
    tags: ['heap', 'top-k', 'two-arrays'],
  },
  {
    id: 'ds-ch09-c-017',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Task Scheduler with Cooldown',
    prompt: `Implement:

    fn task_scheduler(tasks: &[char], n: i32) -> i32

Given task labels and a cooldown interval n, find the minimum number of CPU time
units to complete all tasks. Between two same tasks at least n units must pass;
during cooldown the CPU may idle. Return the total units elapsed.
Example: tasks=[A,A,A,B,B,B], n=2  ->  8  (A B C A B _ A B or similar)`,
    hints: [
      'Count task frequencies. Each round process up to n+1 tasks greedily by picking the most frequent.',
      'After each round, if the heap is not empty add idle time for the remaining slots in the round.',
    ],
    solution: `use std::collections::BinaryHeap;

fn task_scheduler(tasks: &[char], n: i32) -> i32 {
    let mut freq = [0i32; 26];
    for &t in tasks {
        freq[t as usize - 'A' as usize] += 1;
    }
    let mut heap: BinaryHeap<i32> = BinaryHeap::new();
    for &f in &freq {
        if f > 0 { heap.push(f); }
    }
    let mut time = 0;
    while !heap.is_empty() {
        let mut temp: Vec<i32> = Vec::new();
        let mut cycle = n + 1;
        while cycle > 0 && !heap.is_empty() {
            let top = heap.pop().unwrap();
            if top > 1 { temp.push(top - 1); }
            cycle -= 1;
            time += 1;
        }
        for t in temp { heap.push(t); }
        if !heap.is_empty() {
            time += cycle;
        }
    }
    time
}

fn main() {
    assert_eq!(task_scheduler(&['A','A','A','B','B','B'], 2), 8);
    assert_eq!(task_scheduler(&['A','A','A','B','B','B'], 0), 6);
    assert_eq!(task_scheduler(&['A','A','A','A','B','B','B','C','C','D'], 2), 10);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;

fn task_scheduler(tasks: &[char], n: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(task_scheduler(&['A','A','A','B','B','B'], 2), 8);
    println!("ok");
}`,
    tags: ['heap', 'greedy', 'scheduling', 'simulation'],
  },
  {
    id: 'ds-ch09-c-018',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Minimum Refueling Stops',
    prompt: `Implement:

    fn min_refuel_stops(target: i32, start_fuel: i32, stations: &[(i32, i32)]) -> i32

A car starts at 0 with start_fuel. stations[i] = (position, fuel_available).
Return the minimum number of stops to reach target, or -1 if impossible.
You can only refuel at stations you pass through.
Example: target=100, start_fuel=10, stations=[(10,60),(20,30),(30,30),(60,40)]  ->  2`,
    hints: [
      'Greedy: push each station into a max-heap as you pass it. When you run out of fuel, greedily refuel from the largest available station.',
      'Process positions including the target as a sentinel with 0 fuel.',
    ],
    solution: `use std::collections::BinaryHeap;

fn min_refuel_stops(target: i32, start_fuel: i32, stations: &[(i32, i32)]) -> i32 {
    let mut heap: BinaryHeap<i32> = BinaryHeap::new();
    let mut fuel = start_fuel;
    let mut stops = 0;
    let mut prev = 0;
    let all: Vec<(i32, i32)> = stations.iter().cloned()
        .chain(std::iter::once((target, 0))).collect();
    for (pos, cap) in all {
        fuel -= pos - prev;
        while fuel < 0 {
            if let Some(f) = heap.pop() {
                fuel += f;
                stops += 1;
            } else {
                return -1;
            }
        }
        heap.push(cap);
        prev = pos;
    }
    stops
}

fn main() {
    assert_eq!(min_refuel_stops(1, 1, &[]), 0);
    assert_eq!(min_refuel_stops(100, 1, &[]), -1);
    assert_eq!(min_refuel_stops(100, 10, &[(10,60),(20,30),(30,30),(60,40)]), 2);
    assert_eq!(min_refuel_stops(100, 100, &[(0, 100)]), 0);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;

fn min_refuel_stops(target: i32, start_fuel: i32, stations: &[(i32, i32)]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(min_refuel_stops(100, 10, &[(10,60),(20,30),(30,30),(60,40)]), 2);
    println!("ok");
}`,
    tags: ['heap', 'greedy', 'simulation'],
  },
  {
    id: 'ds-ch09-c-019',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Maximum CPU Load at Any Moment',
    prompt: `Implement:

    fn max_cpu_load(jobs: &mut Vec<[i32; 3]>) -> i32

jobs[i] = [start, end, load]. Jobs run in the interval [start, end).
Multiple jobs can run concurrently; their loads sum. Find the maximum total load
at any point in time.
Example: [[1,4,3],[2,5,4],[7,9,6]]  ->  7  (at time 2-4: load 3+4=7)`,
    hints: [
      'Sort jobs by start time. Use a min-heap of (end_time, load) to track active jobs.',
      'Before adding a new job, evict all jobs whose end_time <= current start.',
    ],
    solution: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn max_cpu_load(jobs: &mut Vec<[i32; 3]>) -> i32 {
    jobs.sort_by_key(|j| j[0]);
    let mut heap: BinaryHeap<Reverse<(i32, i32)>> = BinaryHeap::new();
    let mut current_load = 0;
    let mut max_load = 0;
    for job in jobs.iter() {
        let (start, end, load) = (job[0], job[1], job[2]);
        while let Some(&Reverse((e, l))) = heap.peek() {
            if e <= start { current_load -= l; heap.pop(); } else { break; }
        }
        heap.push(Reverse((end, load)));
        current_load += load;
        max_load = max_load.max(current_load);
    }
    max_load
}

fn main() {
    let mut jobs = vec![[1, 4, 3], [2, 5, 4], [7, 9, 6]];
    assert_eq!(max_cpu_load(&mut jobs), 7);
    let mut jobs2 = vec![[6, 7, 10], [2, 4, 11], [8, 12, 15]];
    assert_eq!(max_cpu_load(&mut jobs2), 15);
    let mut jobs3 = vec![[1, 4, 2], [2, 4, 1], [3, 6, 5]];
    assert_eq!(max_cpu_load(&mut jobs3), 8);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn max_cpu_load(jobs: &mut Vec<[i32; 3]>) -> i32 {
    // TODO
    todo!()
}

fn main() {
    let mut jobs = vec![[1, 4, 3], [2, 5, 4], [7, 9, 6]];
    assert_eq!(max_cpu_load(&mut jobs), 7);
    println!("ok");
}`,
    tags: ['heap', 'intervals', 'sweep-line'],
  },
  {
    id: 'ds-ch09-c-020',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Kth Smallest in Multiplication Table',
    prompt: `Implement:

    fn find_kth_number(m: i32, n: i32, k: i32) -> i32

An m x n multiplication table has cell (i,j) = i*j (1-indexed, 1<=i<=m, 1<=j<=n).
Return the k-th smallest value in the table (1-based).
Example: m=3, n=3, k=5  ->  3`,
    hints: [
      'Binary search on the answer value x. Count how many table entries are <= x.',
      'For each row i (1..=m), the count of entries <= x is min(x/i, n).',
    ],
    solution: `fn find_kth_number(m: i32, n: i32, k: i32) -> i32 {
    let count_le = |x: i64| -> i64 {
        let mut cnt: i64 = 0;
        for i in 1..=m as i64 {
            cnt += (x / i).min(n as i64);
        }
        cnt
    };
    let mut lo = 1i32;
    let mut hi = m * n;
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if count_le(mid as i64) >= k as i64 { hi = mid; } else { lo = mid + 1; }
    }
    lo
}

fn main() {
    assert_eq!(find_kth_number(3, 3, 5), 3);
    assert_eq!(find_kth_number(2, 3, 6), 6);
    assert_eq!(find_kth_number(3, 3, 1), 1);
    assert_eq!(find_kth_number(3, 3, 9), 9);
    let m = 4i32; let n = 4i32;
    let mut all: Vec<i32> = Vec::new();
    for i in 1..=m { for j in 1..=n { all.push(i * j); } }
    all.sort();
    for k in 1..=16 {
        assert_eq!(find_kth_number(m, n, k), all[k as usize - 1]);
    }
    println!("ok");
}`,
    starter: `fn find_kth_number(m: i32, n: i32, k: i32) -> i32 {
    // TODO: binary search on the answer
    todo!()
}

fn main() {
    assert_eq!(find_kth_number(3, 3, 5), 3);
    println!("ok");
}`,
    tags: ['binary-search', 'heap-alternative', 'math'],
  },
  {
    id: 'ds-ch09-c-021',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Find Median from a Data Stream',
    prompt: `Implement a MedianFinder struct with two methods:

    fn add_num(&mut self, num: i32)
    fn find_median(&self) -> f64

add_num inserts a number into the running stream.
find_median returns the median of all inserted numbers.
If the count is odd, return the middle value; if even, return the average of the two middle values.
Example: add 1,2,3 -> medians are 1.0, 1.5, 2.0`,
    hints: [
      'Maintain a max-heap lo for the lower half and a min-heap hi for the upper half.',
      'Always keep lo.len() == hi.len() or lo.len() == hi.len() + 1.',
    ],
    solution: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

struct MedianFinder {
    lo: BinaryHeap<i32>,
    hi: BinaryHeap<Reverse<i32>>,
}

impl MedianFinder {
    fn new() -> Self {
        MedianFinder { lo: BinaryHeap::new(), hi: BinaryHeap::new() }
    }

    fn add_num(&mut self, num: i32) {
        self.lo.push(num);
        let top = self.lo.pop().unwrap();
        self.hi.push(Reverse(top));
        if self.lo.len() < self.hi.len() {
            let Reverse(v) = self.hi.pop().unwrap();
            self.lo.push(v);
        }
    }

    fn find_median(&self) -> f64 {
        if self.lo.len() > self.hi.len() {
            *self.lo.peek().unwrap() as f64
        } else {
            let lo_top = *self.lo.peek().unwrap() as f64;
            let Reverse(hi_top) = *self.hi.peek().unwrap();
            (lo_top + hi_top as f64) / 2.0
        }
    }
}

fn main() {
    let mut mf = MedianFinder::new();
    mf.add_num(1); assert_eq!(mf.find_median(), 1.0);
    mf.add_num(2); assert_eq!(mf.find_median(), 1.5);
    mf.add_num(3); assert_eq!(mf.find_median(), 2.0);
    mf.add_num(4); assert_eq!(mf.find_median(), 2.5);
    mf.add_num(5); assert_eq!(mf.find_median(), 3.0);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

struct MedianFinder {
    lo: BinaryHeap<i32>,
    hi: BinaryHeap<Reverse<i32>>,
}

impl MedianFinder {
    fn new() -> Self {
        // TODO
        todo!()
    }

    fn add_num(&mut self, num: i32) {
        // TODO
        todo!()
    }

    fn find_median(&self) -> f64 {
        // TODO
        todo!()
    }
}

fn main() {
    let mut mf = MedianFinder::new();
    mf.add_num(1);
    assert_eq!(mf.find_median(), 1.0);
    println!("ok");
}`,
    tags: ['heap', 'two-heaps', 'design', 'median'],
  },
  {
    id: 'ds-ch09-c-022',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Sliding Window Median',
    prompt: `Implement:

    fn sliding_window_median(nums: &[i32], k: usize) -> Vec<f64>

Return the median of every contiguous window of size k as the window slides from
left to right. For even k, the median is the average of the two middle values.
Example: nums=[1,3,-1,-3,5,3,6,7], k=3  ->  [1.0,-1.0,-1.0,3.0,5.0,6.0]`,
    hints: [
      'Maintain two sorted multisets (use BTreeMap<i32,usize>) representing the lower and upper halves.',
      'For each new element insert it into the correct half, rebalance, emit the median, then remove the outgoing element.',
    ],
    solution: `use std::collections::BTreeMap;

fn sliding_window_median(nums: &[i32], k: usize) -> Vec<f64> {
    let mut lo: BTreeMap<i32, usize> = BTreeMap::new();
    let mut hi: BTreeMap<i32, usize> = BTreeMap::new();
    let mut lo_size = 0usize;
    let mut hi_size = 0usize;

    let mut add_to = |map: &mut BTreeMap<i32, usize>, size: &mut usize, v: i32| {
        *map.entry(v).or_insert(0) += 1;
        *size += 1;
    };
    let mut rem_from = |map: &mut BTreeMap<i32, usize>, size: &mut usize, v: i32| {
        let cnt = map.get_mut(&v).unwrap();
        if *cnt == 1 { map.remove(&v); } else { *cnt -= 1; }
        *size -= 1;
    };

    let mut result = Vec::new();
    for (i, &num) in nums.iter().enumerate() {
        if lo_size == 0 || num <= *lo.keys().next_back().unwrap() {
            add_to(&mut lo, &mut lo_size, num);
        } else {
            add_to(&mut hi, &mut hi_size, num);
        }
        if lo_size > hi_size + 1 {
            let v = *lo.keys().next_back().unwrap();
            rem_from(&mut lo, &mut lo_size, v);
            add_to(&mut hi, &mut hi_size, v);
        } else if hi_size > lo_size {
            let v = *hi.keys().next().unwrap();
            rem_from(&mut hi, &mut hi_size, v);
            add_to(&mut lo, &mut lo_size, v);
        }
        if i + 1 >= k {
            let lo_max = *lo.keys().next_back().unwrap() as f64;
            let med = if lo_size == hi_size {
                let hi_min = *hi.keys().next().unwrap() as f64;
                (lo_max + hi_min) / 2.0
            } else { lo_max };
            result.push(med);
            let out = nums[i + 1 - k];
            if out <= *lo.keys().next_back().unwrap() {
                rem_from(&mut lo, &mut lo_size, out);
            } else {
                rem_from(&mut hi, &mut hi_size, out);
            }
            if lo_size > hi_size + 1 {
                let v = *lo.keys().next_back().unwrap();
                rem_from(&mut lo, &mut lo_size, v);
                add_to(&mut hi, &mut hi_size, v);
            } else if hi_size > lo_size {
                let v = *hi.keys().next().unwrap();
                rem_from(&mut hi, &mut hi_size, v);
                add_to(&mut lo, &mut lo_size, v);
            }
        }
    }
    result
}

fn brute_median(w: &[i32]) -> f64 {
    let mut s = w.to_vec(); s.sort();
    let n = s.len();
    if n % 2 == 1 { s[n / 2] as f64 } else { (s[n/2-1] as f64 + s[n/2] as f64) / 2.0 }
}

fn main() {
    let nums = [1, 3, -1, -3, 5, 3, 6, 7];
    assert_eq!(sliding_window_median(&nums, 3), vec![1.0, -1.0, -1.0, 3.0, 5.0, 6.0]);
    let nums2 = [2, 1, 5, 3, 4, 7, 6];
    let k = 4;
    let r2 = sliding_window_median(&nums2, k);
    for (i, med) in r2.iter().enumerate() {
        let expected = brute_median(&nums2[i..i + k]);
        assert!((med - expected).abs() < 1e-9);
    }
    println!("ok");
}`,
    starter: `use std::collections::BTreeMap;

fn sliding_window_median(nums: &[i32], k: usize) -> Vec<f64> {
    // TODO: maintain two BTreeMaps for lower and upper halves
    todo!()
}

fn main() {
    let nums = [1, 3, -1, -3, 5, 3, 6, 7];
    assert_eq!(sliding_window_median(&nums, 3), vec![1.0, -1.0, -1.0, 3.0, 5.0, 6.0]);
    println!("ok");
}`,
    tags: ['heap', 'sliding-window', 'median', 'btreemap'],
  },
  {
    id: 'ds-ch09-c-023',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Reorganize String No Adjacent Equal',
    prompt: `Implement:

    fn reorganize_string(s: &str) -> String

Rearrange the characters of s so that no two adjacent characters are equal.
Return any valid rearrangement, or an empty string if it is impossible.
It is impossible when any character appears more than (n+1)/2 times (n = s.len()).
Example: "aab"  ->  "aba"  |  "aaab"  ->  ""`,
    hints: [
      'Use a max-heap by frequency. Each round pop the two most frequent and append both.',
      'If one character remains alone in the heap after the loop, append it.',
    ],
    solution: `use std::collections::BinaryHeap;
use std::collections::HashMap;

fn reorganize_string(s: &str) -> String {
    let mut freq: HashMap<char, usize> = HashMap::new();
    for c in s.chars() { *freq.entry(c).or_insert(0) += 1; }
    let n = s.len();
    if freq.values().any(|&f| f > (n + 1) / 2) { return String::new(); }
    let mut heap: BinaryHeap<(usize, char)> = BinaryHeap::new();
    for (&c, &f) in &freq { heap.push((f, c)); }
    let mut result = String::new();
    while heap.len() >= 2 {
        let (f1, c1) = heap.pop().unwrap();
        let (f2, c2) = heap.pop().unwrap();
        result.push(c1);
        result.push(c2);
        if f1 > 1 { heap.push((f1 - 1, c1)); }
        if f2 > 1 { heap.push((f2 - 1, c2)); }
    }
    if let Some((_, c)) = heap.pop() { result.push(c); }
    result
}

fn is_valid(s: &str) -> bool {
    let chars: Vec<char> = s.chars().collect();
    for i in 1..chars.len() { if chars[i] == chars[i-1] { return false; } }
    true
}

fn main() {
    let r = reorganize_string("aab");
    assert!(!r.is_empty() && is_valid(&r));
    assert_eq!(reorganize_string("aaab"), "");
    let r3 = reorganize_string("aabb");
    assert!(!r3.is_empty() && is_valid(&r3));
    let r4 = reorganize_string("aaabbc");
    assert!(!r4.is_empty() && is_valid(&r4));
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;
use std::collections::HashMap;

fn reorganize_string(s: &str) -> String {
    // TODO
    todo!()
}

fn main() {
    let r = reorganize_string("aab");
    assert!(!r.is_empty());
    assert_eq!(reorganize_string("aaab"), "");
    println!("ok");
}`,
    tags: ['heap', 'greedy', 'string', 'design'],
  },
  {
    id: 'ds-ch09-c-024',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Smallest Range Covering K Lists',
    prompt: `Implement:

    fn smallest_range(lists: &Vec<Vec<i32>>) -> [i32; 2]

Each of the k lists is sorted ascending. Find the smallest range [lo, hi] such
that at least one element from each list falls within [lo, hi].
Smallest means minimum (hi - lo); ties broken by smaller lo.
Example: [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]  ->  [20,24]`,
    hints: [
      'Seed a min-heap with (list[i][0], i, 0) and track the running maximum across all current pointers.',
      'Each pop gives the current minimum; update the range, then advance the exhausted list. Stop when any list is done.',
    ],
    solution: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn smallest_range(lists: &Vec<Vec<i32>>) -> [i32; 2] {
    let k = lists.len();
    let mut heap: BinaryHeap<Reverse<(i32, usize, usize)>> = BinaryHeap::new();
    let mut cur_max = i32::MIN;
    for (i, list) in lists.iter().enumerate() {
        if !list.is_empty() {
            heap.push(Reverse((list[0], i, 0)));
            cur_max = cur_max.max(list[0]);
        }
    }
    let mut best_lo = 0;
    let mut best_hi = i32::MAX;
    while heap.len() == k {
        let Reverse((cur_min, li, ei)) = heap.pop().unwrap();
        if cur_max - cur_min < best_hi - best_lo
            || (cur_max - cur_min == best_hi - best_lo && cur_min < best_lo) {
            best_lo = cur_min;
            best_hi = cur_max;
        }
        if ei + 1 < lists[li].len() {
            let next = lists[li][ei + 1];
            heap.push(Reverse((next, li, ei + 1)));
            cur_max = cur_max.max(next);
        }
    }
    [best_lo, best_hi]
}

fn main() {
    let lists = vec![
        vec![4, 10, 15, 24, 26],
        vec![0, 9, 12, 20],
        vec![5, 18, 22, 30],
    ];
    assert_eq!(smallest_range(&lists), [20, 24]);
    let lists2 = vec![vec![1,2,3], vec![1,2,3], vec![1,2,3]];
    assert_eq!(smallest_range(&lists2), [1, 1]);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn smallest_range(lists: &Vec<Vec<i32>>) -> [i32; 2] {
    // TODO
    todo!()
}

fn main() {
    let lists = vec![
        vec![4, 10, 15, 24, 26],
        vec![0, 9, 12, 20],
        vec![5, 18, 22, 30],
    ];
    assert_eq!(smallest_range(&lists), [20, 24]);
    println!("ok");
}`,
    tags: ['heap', 'k-way', 'sliding-window', 'hard'],
  },
  {
    id: 'ds-ch09-c-025',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'IPO: Maximize Capital',
    prompt: `Implement:

    fn find_maximized_capital(k: i32, w: i32, profits: &[i32], capital: &[i32]) -> i32

You can complete at most k projects. Project i requires capital[i] of starting
capital and yields profit[i]. Starting capital is w. After each project your
capital increases by its profit. Return the maximum capital achievable.
Example: k=2, w=0, profits=[1,2,3], capital=[0,1,1]  ->  4`,
    hints: [
      'Sort projects by capital requirement ascending.',
      'Each round unlock all affordable projects into a max-heap by profit, then pick the most profitable.',
    ],
    solution: `use std::collections::BinaryHeap;

fn find_maximized_capital(k: i32, w: i32, profits: &[i32], capital: &[i32]) -> i32 {
    let n = profits.len();
    let mut projects: Vec<(i32, i32)> = (0..n)
        .map(|i| (capital[i], profits[i]))
        .collect();
    projects.sort();
    let mut available: BinaryHeap<i32> = BinaryHeap::new();
    let mut capital_w = w;
    let mut idx = 0;
    for _ in 0..k {
        while idx < n && projects[idx].0 <= capital_w {
            available.push(projects[idx].1);
            idx += 1;
        }
        if let Some(profit) = available.pop() {
            capital_w += profit;
        } else {
            break;
        }
    }
    capital_w
}

fn main() {
    assert_eq!(find_maximized_capital(2, 0, &[1,2,3], &[0,1,1]), 4);
    assert_eq!(find_maximized_capital(3, 0, &[1,2,3], &[0,1,2]), 6);
    assert_eq!(find_maximized_capital(1, 0, &[1,2,3], &[1,1,2]), 0);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;

fn find_maximized_capital(k: i32, w: i32, profits: &[i32], capital: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(find_maximized_capital(2, 0, &[1,2,3], &[0,1,1]), 4);
    println!("ok");
}`,
    tags: ['heap', 'greedy', 'sorting'],
  },
  {
    id: 'ds-ch09-c-026',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Rearrange String K Distance Apart',
    prompt: `Implement:

    fn rearrange_string_k_apart(s: &str, k: i32) -> String

Rearrange s so that the same characters are at least k positions apart.
Return any valid rearrangement, or an empty string if impossible.
If k == 0, return s unchanged.
Example: "aabbcc", k=3  ->  "abcabc"  |  "aaabc", k=3  ->  ""`,
    hints: [
      'Greedy: each round pick the top k distinct characters by frequency (highest first) and append them.',
      'If a round cannot fill k slots because the heap is empty but output is not complete, it is impossible.',
    ],
    solution: `use std::collections::BinaryHeap;
use std::collections::HashMap;

fn rearrange_string_k_apart(s: &str, k: i32) -> String {
    if k == 0 { return s.to_string(); }
    let mut freq: HashMap<char, i32> = HashMap::new();
    for c in s.chars() { *freq.entry(c).or_insert(0) += 1; }
    let mut heap: BinaryHeap<(i32, char)> = freq.into_iter().map(|(c, f)| (f, c)).collect();
    let mut result = String::new();
    let n = s.len();
    while !heap.is_empty() {
        let mut temp: Vec<(i32, char)> = Vec::new();
        let take = k.min((n - result.len()) as i32) as usize;
        for _ in 0..take {
            if let Some((f, c)) = heap.pop() {
                result.push(c);
                if f > 1 { temp.push((f - 1, c)); }
            } else if result.len() < n {
                return String::new();
            }
        }
        for item in temp { heap.push(item); }
    }
    if result.len() == n { result } else { String::new() }
}

fn is_k_apart(s: &str, k: i32) -> bool {
    let chars: Vec<char> = s.chars().collect();
    for i in 0..chars.len() {
        for j in i+1..chars.len().min(i + k as usize) {
            if chars[i] == chars[j] { return false; }
        }
    }
    true
}

fn main() {
    let r = rearrange_string_k_apart("aabbcc", 3);
    assert!(!r.is_empty() && is_k_apart(&r, 3), "got: {}", r);
    assert_eq!(rearrange_string_k_apart("aaabc", 3), "");
    let r3 = rearrange_string_k_apart("aaadbbcc", 2);
    assert!(!r3.is_empty() && is_k_apart(&r3, 2), "got: {}", r3);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;
use std::collections::HashMap;

fn rearrange_string_k_apart(s: &str, k: i32) -> String {
    // TODO
    todo!()
}

fn main() {
    let r = rearrange_string_k_apart("aabbcc", 3);
    assert!(!r.is_empty());
    assert_eq!(rearrange_string_k_apart("aaabc", 3), "");
    println!("ok");
}`,
    tags: ['heap', 'greedy', 'string', 'design'],
  },
  {
    id: 'ds-ch09-c-027',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Trapping Rain Water II (2D Grid)',
    prompt: `Implement:

    fn trap_rain_water(heights: &[Vec<i32>]) -> i32

Given a 2D grid of heights, compute the total volume of water trapped after rain.
Water flows outward from any border cell. Each interior cell can hold water up to
the minimum border height along the path of least resistance.
Example: 3x6 grid [[1,4,3,1,3,2],[3,2,1,3,2,4],[2,3,3,2,3,1]]  ->  4`,
    hints: [
      'BFS from the border using a min-heap. The boundary constraint propagates inward.',
      'Track the running maximum height seen; each interior cell holds max(0, running_max - cell_height) water.',
    ],
    solution: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn trap_rain_water(heights: &[Vec<i32>]) -> i32 {
    let rows = heights.len();
    if rows == 0 { return 0; }
    let cols = heights[0].len();
    if cols == 0 { return 0; }
    let mut visited = vec![vec![false; cols]; rows];
    let mut heap: BinaryHeap<Reverse<(i32, usize, usize)>> = BinaryHeap::new();
    for r in 0..rows {
        for c in 0..cols {
            if r == 0 || r == rows-1 || c == 0 || c == cols-1 {
                heap.push(Reverse((heights[r][c], r, c)));
                visited[r][c] = true;
            }
        }
    }
    let mut water = 0;
    let mut max_height = 0;
    let dirs: [(i32, i32); 4] = [(-1,0),(1,0),(0,-1),(0,1)];
    while let Some(Reverse((h, r, c))) = heap.pop() {
        max_height = max_height.max(h);
        for (dr, dc) in &dirs {
            let nr = r as i32 + dr; let nc = c as i32 + dc;
            if nr < 0 || nc < 0 || nr >= rows as i32 || nc >= cols as i32 { continue; }
            let (nr, nc) = (nr as usize, nc as usize);
            if visited[nr][nc] { continue; }
            visited[nr][nc] = true;
            if heights[nr][nc] < max_height { water += max_height - heights[nr][nc]; }
            heap.push(Reverse((heights[nr][nc], nr, nc)));
        }
    }
    water
}

fn main() {
    let grid = vec![
        vec![1,4,3,1,3,2], vec![3,2,1,3,2,4], vec![2,3,3,2,3,1],
    ];
    assert_eq!(trap_rain_water(&grid), 4);
    let grid2 = vec![
        vec![3,3,3,3,3], vec![3,2,2,2,3], vec![3,2,1,2,3],
        vec![3,2,2,2,3], vec![3,3,3,3,3],
    ];
    assert_eq!(trap_rain_water(&grid2), 10);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn trap_rain_water(heights: &[Vec<i32>]) -> i32 {
    // TODO: min-heap BFS from border
    todo!()
}

fn main() {
    let grid2 = vec![
        vec![3,3,3,3,3], vec![3,2,2,2,3], vec![3,2,1,2,3],
        vec![3,2,2,2,3], vec![3,3,3,3,3],
    ];
    assert_eq!(trap_rain_water(&grid2), 10);
    println!("ok");
}`,
    tags: ['heap', 'bfs', 'matrix', 'water'],
  },
  {
    id: 'ds-ch09-c-028',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Maximum Frequency Stack',
    prompt: `Implement a FreqStack struct with two methods:

    fn push(&mut self, val: i32)
    fn pop(&mut self) -> i32

push adds val to the stack.
pop removes and returns the most frequently pushed element. If there is a tie,
pop the one that was pushed most recently among the tied elements.
Example: push 5,7,5,7,4,5 -> pop() -> 5, pop() -> 7, pop() -> 5, pop() -> 4`,
    hints: [
      'Track a frequency map and a group map: group[freq] = stack of elements at that frequency.',
      'max_freq tracks the current maximum frequency; when group[max_freq] becomes empty, decrement max_freq.',
    ],
    solution: `use std::collections::HashMap;

struct FreqStack {
    freq: HashMap<i32, usize>,
    group: HashMap<usize, Vec<i32>>,
    max_freq: usize,
}

impl FreqStack {
    fn new() -> Self {
        FreqStack { freq: HashMap::new(), group: HashMap::new(), max_freq: 0 }
    }

    fn push(&mut self, val: i32) {
        let f = self.freq.entry(val).or_insert(0);
        *f += 1;
        let f = *f;
        if f > self.max_freq { self.max_freq = f; }
        self.group.entry(f).or_insert_with(Vec::new).push(val);
    }

    fn pop(&mut self) -> i32 {
        let stack = self.group.get_mut(&self.max_freq).unwrap();
        let val = stack.pop().unwrap();
        if stack.is_empty() {
            self.group.remove(&self.max_freq);
            self.max_freq -= 1;
        }
        *self.freq.get_mut(&val).unwrap() -= 1;
        val
    }
}

fn main() {
    let mut fs = FreqStack::new();
    fs.push(5); fs.push(7); fs.push(5); fs.push(7); fs.push(4); fs.push(5);
    assert_eq!(fs.pop(), 5);
    assert_eq!(fs.pop(), 7);
    assert_eq!(fs.pop(), 5);
    assert_eq!(fs.pop(), 4);
    println!("ok");
}`,
    starter: `use std::collections::HashMap;

struct FreqStack {
    freq: HashMap<i32, usize>,
    group: HashMap<usize, Vec<i32>>,
    max_freq: usize,
}

impl FreqStack {
    fn new() -> Self {
        // TODO
        todo!()
    }

    fn push(&mut self, val: i32) {
        // TODO
        todo!()
    }

    fn pop(&mut self) -> i32 {
        // TODO
        todo!()
    }
}

fn main() {
    let mut fs = FreqStack::new();
    fs.push(5); fs.push(7); fs.push(5);
    assert_eq!(fs.pop(), 5);
    println!("ok");
}`,
    tags: ['heap', 'design', 'hashmap', 'frequency'],
  },
  {
    id: 'ds-ch09-c-029',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Nth Ugly Number',
    prompt: `Implement:

    fn nth_ugly_number(n: usize) -> u64

An ugly number has only prime factors 2, 3, and 5 (1 is considered ugly).
The sequence starts: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, ...
Return the n-th ugly number (1-based).
Example: n=10  ->  12`,
    hints: [
      'Use a min-heap seeded with 1. Each pop gives the next ugly number; push val*2, val*3, val*5 if not seen.',
      'Use a HashSet to avoid duplicates in the heap.',
    ],
    solution: `use std::collections::BinaryHeap;
use std::cmp::Reverse;
use std::collections::HashSet;

fn nth_ugly_number(n: usize) -> u64 {
    let mut heap: BinaryHeap<Reverse<u64>> = BinaryHeap::new();
    let mut seen: HashSet<u64> = HashSet::new();
    heap.push(Reverse(1));
    seen.insert(1);
    let mut val = 1u64;
    for _ in 0..n {
        let Reverse(v) = heap.pop().unwrap();
        val = v;
        for &factor in &[2u64, 3, 5] {
            let next = v * factor;
            if seen.insert(next) { heap.push(Reverse(next)); }
        }
    }
    val
}

fn main() {
    let expected = [1u64,2,3,4,5,6,8,9,10,12,15,16,18,20,24,25,27,30,32,36];
    for (i, &e) in expected.iter().enumerate() {
        assert_eq!(nth_ugly_number(i + 1), e, "n={}", i + 1);
    }
    assert_eq!(nth_ugly_number(1690), 2123366400);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;
use std::cmp::Reverse;
use std::collections::HashSet;

fn nth_ugly_number(n: usize) -> u64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(nth_ugly_number(10), 12);
    assert_eq!(nth_ugly_number(1), 1);
    println!("ok");
}`,
    tags: ['heap', 'math', 'number-theory'],
  },
  {
    id: 'ds-ch09-c-030',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Kth Largest Element in a Stream',
    prompt: `Implement a KthLargest struct:

    fn new(k: usize, nums: &[i32]) -> KthLargest
    fn add(&mut self, val: i32) -> i32

new initializes with the k value and an optional array of initial numbers.
add inserts val into the data structure and returns the k-th largest element
in the current stream (including val). Assume at least k elements have been seen.
Example: k=3, init=[4,5,8,2]; add(3)->4, add(5)->5, add(10)->5, add(9)->8`,
    hints: [
      'Maintain a min-heap of size exactly k. The root is always the k-th largest.',
      'On each add, push the new value; if size exceeds k, pop the minimum.',
    ],
    solution: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

struct KthLargest {
    k: usize,
    heap: BinaryHeap<Reverse<i32>>,
}

impl KthLargest {
    fn new(k: usize, nums: &[i32]) -> Self {
        let mut kl = KthLargest { k, heap: BinaryHeap::new() };
        for &n in nums { kl.add(n); }
        kl
    }

    fn add(&mut self, val: i32) -> i32 {
        self.heap.push(Reverse(val));
        while self.heap.len() > self.k { self.heap.pop(); }
        self.heap.peek().unwrap().0
    }
}

fn main() {
    let mut kl = KthLargest::new(3, &[4, 5, 8, 2]);
    assert_eq!(kl.add(3), 4);
    assert_eq!(kl.add(5), 5);
    assert_eq!(kl.add(10), 5);
    assert_eq!(kl.add(9), 8);
    assert_eq!(kl.add(4), 8);
    let mut kl2 = KthLargest::new(1, &[]);
    assert_eq!(kl2.add(-3), -3);
    assert_eq!(kl2.add(-2), -2);
    assert_eq!(kl2.add(-4), -2);
    assert_eq!(kl2.add(0), 0);
    assert_eq!(kl2.add(4), 4);
    println!("ok");
}`,
    starter: `use std::collections::BinaryHeap;
use std::cmp::Reverse;

struct KthLargest {
    k: usize,
    heap: BinaryHeap<Reverse<i32>>,
}

impl KthLargest {
    fn new(k: usize, nums: &[i32]) -> Self {
        // TODO
        todo!()
    }

    fn add(&mut self, val: i32) -> i32 {
        // TODO
        todo!()
    }
}

fn main() {
    let mut kl = KthLargest::new(3, &[4, 5, 8, 2]);
    assert_eq!(kl.add(3), 4);
    println!("ok");
}`,
    tags: ['heap', 'design', 'streaming', 'top-k'],
  },
]

export default problems
