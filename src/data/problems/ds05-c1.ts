import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch05-c-001',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Classic Binary Search',
    prompt: `Implement:

    fn search(nums: &[i32], target: i32) -> i32

nums is sorted in ascending order with distinct values. Return the index of target,
or -1 if it is not present.

Constraints: 0 <= nums.len() <= 10_000, all elements distinct.
Example: nums = [-1, 0, 3, 5, 9], target = 5 -> 3`,
    hints: [
      'Maintain lo and hi bounds and inspect the midpoint each iteration.',
      'Use lo + (hi - lo) / 2 to avoid integer overflow.',
    ],
    solution: `fn search(nums: &[i32], target: i32) -> i32 {
    let (mut lo, mut hi) = (0i64, nums.len() as i64 - 1);
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        let v = nums[mid as usize];
        if v == target {
            return mid as i32;
        } else if v < target {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    -1
}

fn main() {
    assert_eq!(search(&[-1, 0, 3, 5, 9], 5), 3);
    assert_eq!(search(&[-1, 0, 3, 5, 9], 2), -1);
    assert_eq!(search(&[], 1), -1);
    assert_eq!(search(&[5], 5), 0);
    assert_eq!(search(&[5], 3), -1);
    println!("ok");
}`,
    starter: `fn search(nums: &[i32], target: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(search(&[-1, 0, 3, 5, 9], 5), 3);
    assert_eq!(search(&[-1, 0, 3, 5, 9], 2), -1);
    println!("ok");
}`,
    tags: ['binary-search', 'array'],
  },
  {
    id: 'ds-ch05-c-002',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Search Insert Position',
    prompt: `Implement:

    fn search_insert(nums: &[i32], target: i32) -> i32

nums is a sorted slice of distinct integers. Return the index where target is found,
or the index where it would be inserted to keep the array sorted.

Constraints: 1 <= nums.len() <= 10_000.
Example: nums = [1, 3, 5, 6], target = 2 -> 1`,
    hints: [
      'Use a half-open interval [lo, hi) where hi starts at nums.len().',
      'The answer is the leftmost index where nums[idx] >= target.',
    ],
    solution: `fn search_insert(nums: &[i32], target: i32) -> i32 {
    let (mut lo, mut hi) = (0i64, nums.len() as i64);
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if nums[mid as usize] < target {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    lo as i32
}

fn main() {
    assert_eq!(search_insert(&[1, 3, 5, 6], 5), 2);
    assert_eq!(search_insert(&[1, 3, 5, 6], 2), 1);
    assert_eq!(search_insert(&[1, 3, 5, 6], 7), 4);
    assert_eq!(search_insert(&[1, 3, 5, 6], 0), 0);
    assert_eq!(search_insert(&[], 3), 0);
    println!("ok");
}`,
    starter: `fn search_insert(nums: &[i32], target: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(search_insert(&[1, 3, 5, 6], 5), 2);
    assert_eq!(search_insert(&[1, 3, 5, 6], 7), 4);
    println!("ok");
}`,
    tags: ['binary-search', 'array'],
  },
  {
    id: 'ds-ch05-c-003',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'First Occurrence in Sorted Array',
    prompt: `Implement:

    fn first_occurrence(nums: &[i32], target: i32) -> i32

nums is sorted ascending and may contain duplicates. Return the index of the first
(leftmost) occurrence of target, or -1 if absent.

Constraints: 0 <= nums.len() <= 10_000.
Example: nums = [1, 2, 2, 2, 3, 4], target = 2 -> 1`,
    hints: [
      'When you find target at mid, record it and keep searching left (hi = mid - 1).',
      'This is the standard lower-bound pattern.',
    ],
    solution: `fn first_occurrence(nums: &[i32], target: i32) -> i32 {
    let (mut lo, mut hi) = (0i64, nums.len() as i64 - 1);
    let mut result = -1i32;
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        if nums[mid as usize] == target {
            result = mid as i32;
            hi = mid - 1;
        } else if nums[mid as usize] < target {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    result
}

fn main() {
    assert_eq!(first_occurrence(&[1, 2, 2, 2, 3, 4], 2), 1);
    assert_eq!(first_occurrence(&[1, 2, 2, 2, 3, 4], 5), -1);
    assert_eq!(first_occurrence(&[2, 2, 2, 2], 2), 0);
    assert_eq!(first_occurrence(&[1, 3, 5], 3), 1);
    assert_eq!(first_occurrence(&[], 1), -1);
    println!("ok");
}`,
    starter: `fn first_occurrence(nums: &[i32], target: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(first_occurrence(&[1, 2, 2, 2, 3, 4], 2), 1);
    assert_eq!(first_occurrence(&[], 1), -1);
    println!("ok");
}`,
    tags: ['binary-search', 'array', 'duplicates'],
  },
  {
    id: 'ds-ch05-c-004',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Last Occurrence in Sorted Array',
    prompt: `Implement:

    fn last_occurrence(nums: &[i32], target: i32) -> i32

nums is sorted ascending and may contain duplicates. Return the index of the last
(rightmost) occurrence of target, or -1 if absent.

Constraints: 0 <= nums.len() <= 10_000.
Example: nums = [1, 2, 2, 2, 3, 4], target = 2 -> 3`,
    hints: [
      'When you find target at mid, record it and keep searching right (lo = mid + 1).',
      'This mirrors the first-occurrence pattern but moves lo instead of hi.',
    ],
    solution: `fn last_occurrence(nums: &[i32], target: i32) -> i32 {
    let (mut lo, mut hi) = (0i64, nums.len() as i64 - 1);
    let mut result = -1i32;
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        if nums[mid as usize] == target {
            result = mid as i32;
            lo = mid + 1;
        } else if nums[mid as usize] < target {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    result
}

fn main() {
    assert_eq!(last_occurrence(&[1, 2, 2, 2, 3, 4], 2), 3);
    assert_eq!(last_occurrence(&[1, 2, 2, 2, 3, 4], 5), -1);
    assert_eq!(last_occurrence(&[2, 2, 2, 2], 2), 3);
    assert_eq!(last_occurrence(&[1, 3, 5], 3), 1);
    assert_eq!(last_occurrence(&[], 1), -1);
    println!("ok");
}`,
    starter: `fn last_occurrence(nums: &[i32], target: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(last_occurrence(&[1, 2, 2, 2, 3, 4], 2), 3);
    assert_eq!(last_occurrence(&[], 1), -1);
    println!("ok");
}`,
    tags: ['binary-search', 'array', 'duplicates'],
  },
  {
    id: 'ds-ch05-c-005',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Occurrences of Target',
    prompt: `Implement:

    fn count_occurrences(nums: &[i32], target: i32) -> i32

nums is sorted ascending and may contain duplicates. Return how many times target
appears in nums.

Constraints: 0 <= nums.len() <= 10_000.
Example: nums = [1, 2, 2, 2, 3, 4], target = 2 -> 3`,
    hints: [
      'Find the first and last occurrence with two binary searches.',
      'If first is -1 then count is 0; otherwise count = last - first + 1.',
    ],
    solution: `fn count_occurrences(nums: &[i32], target: i32) -> i32 {
    fn first(nums: &[i32], target: i32) -> i32 {
        let (mut lo, mut hi) = (0i64, nums.len() as i64 - 1);
        let mut result = -1i32;
        while lo <= hi {
            let mid = lo + (hi - lo) / 2;
            if nums[mid as usize] == target { result = mid as i32; hi = mid - 1; }
            else if nums[mid as usize] < target { lo = mid + 1; }
            else { hi = mid - 1; }
        }
        result
    }
    fn last(nums: &[i32], target: i32) -> i32 {
        let (mut lo, mut hi) = (0i64, nums.len() as i64 - 1);
        let mut result = -1i32;
        while lo <= hi {
            let mid = lo + (hi - lo) / 2;
            if nums[mid as usize] == target { result = mid as i32; lo = mid + 1; }
            else if nums[mid as usize] < target { lo = mid + 1; }
            else { hi = mid - 1; }
        }
        result
    }
    let f = first(nums, target);
    if f == -1 { return 0; }
    last(nums, target) - f + 1
}

fn main() {
    assert_eq!(count_occurrences(&[1, 2, 2, 2, 3, 4], 2), 3);
    assert_eq!(count_occurrences(&[1, 2, 2, 2, 3, 4], 5), 0);
    assert_eq!(count_occurrences(&[2, 2, 2, 2], 2), 4);
    assert_eq!(count_occurrences(&[1, 3, 5], 3), 1);
    assert_eq!(count_occurrences(&[], 1), 0);
    println!("ok");
}`,
    starter: `fn count_occurrences(nums: &[i32], target: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(count_occurrences(&[1, 2, 2, 2, 3, 4], 2), 3);
    assert_eq!(count_occurrences(&[], 1), 0);
    println!("ok");
}`,
    tags: ['binary-search', 'array', 'duplicates'],
  },
  {
    id: 'ds-ch05-c-006',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'First Bad Version',
    prompt: `You are given an API is_bad(version, bad_from) -> bool that returns true for
every version >= bad_from. Implement:

    fn first_bad_version(n: i32, bad: i32) -> i32

n is the total number of versions (1..=n). bad is the first bad version number
(treat it as the oracle). Return the first bad version using the fewest API calls.

Constraints: 1 <= bad <= n <= 2_000_000_000.
Example: n = 5, bad = 4 -> 4`,
    hints: [
      'Binary search on the version number space 1..=n.',
      'Use a half-open interval to avoid overflow when n is near i32::MAX.',
    ],
    solution: `fn is_bad(version: i32, bad: i32) -> bool {
    version >= bad
}

fn first_bad_version(n: i32, bad: i32) -> i32 {
    let (mut lo, mut hi) = (1i64, n as i64);
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if is_bad(mid as i32, bad) {
            hi = mid;
        } else {
            lo = mid + 1;
        }
    }
    lo as i32
}

fn main() {
    assert_eq!(first_bad_version(5, 4), 4);
    assert_eq!(first_bad_version(1, 1), 1);
    assert_eq!(first_bad_version(10, 1), 1);
    assert_eq!(first_bad_version(10, 10), 10);
    println!("ok");
}`,
    starter: `fn is_bad(version: i32, bad: i32) -> bool {
    version >= bad
}

fn first_bad_version(n: i32, bad: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(first_bad_version(5, 4), 4);
    assert_eq!(first_bad_version(1, 1), 1);
    println!("ok");
}`,
    tags: ['binary-search', 'search-on-answer'],
  },
  {
    id: 'ds-ch05-c-007',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Integer Square Root',
    prompt: `Implement:

    fn isqrt(x: u64) -> u64

Return the largest integer r such that r * r <= x (the floor of the square root).

Constraints: 0 <= x <= 2^63 - 1.
Example: x = 8 -> 2  (because 2*2=4 <= 8 < 9=3*3)`,
    hints: [
      'Binary search the answer r in [1, x]. The predicate is r*r <= x.',
      'Use saturating_mul or i128 to avoid overflow when squaring large values.',
    ],
    solution: `fn isqrt(x: u64) -> u64 {
    if x == 0 { return 0; }
    let (mut lo, mut hi) = (1u64, x);
    while lo < hi {
        let mid = lo + (hi - lo + 1) / 2;
        if mid <= x / mid {
            lo = mid;
        } else {
            hi = mid - 1;
        }
    }
    lo
}

fn main() {
    assert_eq!(isqrt(0), 0);
    assert_eq!(isqrt(1), 1);
    assert_eq!(isqrt(4), 2);
    assert_eq!(isqrt(8), 2);
    assert_eq!(isqrt(9), 3);
    assert_eq!(isqrt(16), 4);
    assert_eq!(isqrt(2147395600), 46340);
    println!("ok");
}`,
    starter: `fn isqrt(x: u64) -> u64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(isqrt(8), 2);
    assert_eq!(isqrt(9), 3);
    println!("ok");
}`,
    tags: ['binary-search', 'math', 'search-on-answer'],
  },
  {
    id: 'ds-ch05-c-008',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Find Closest Value in Sorted Array',
    prompt: `Implement:

    fn find_closest(nums: &[i32], target: i32) -> i32

nums is a non-empty sorted ascending array of distinct integers. Return the element
closest in value to target. If two elements are equally close, return the smaller one.

Constraints: 1 <= nums.len() <= 10_000.
Example: nums = [1, 3, 5, 7, 9], target = 4 -> 3`,
    hints: [
      'Use binary search to find the first index where nums[idx] >= target.',
      'Compare the candidate at that index with the one just before it.',
    ],
    solution: `fn find_closest(nums: &[i32], target: i32) -> i32 {
    if nums.is_empty() { return -1; }
    let (mut lo, mut hi) = (0i64, nums.len() as i64 - 1);
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if nums[mid as usize] < target {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    if lo == 0 {
        return nums[0];
    }
    let a = nums[lo as usize - 1];
    let b = nums[lo as usize];
    if (target - a).abs() <= (b - target).abs() { a } else { b }
}

fn main() {
    assert_eq!(find_closest(&[1, 3, 5, 7, 9], 4), 3);
    assert_eq!(find_closest(&[1, 3, 5, 7, 9], 6), 5);
    assert_eq!(find_closest(&[1, 3, 5, 7, 9], 1), 1);
    assert_eq!(find_closest(&[1, 3, 5, 7, 9], 9), 9);
    assert_eq!(find_closest(&[1, 3, 5, 7, 9], 0), 1);
    assert_eq!(find_closest(&[1, 3, 5, 7, 9], 10), 9);
    println!("ok");
}`,
    starter: `fn find_closest(nums: &[i32], target: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(find_closest(&[1, 3, 5, 7, 9], 4), 3);
    assert_eq!(find_closest(&[1, 3, 5, 7, 9], 6), 5);
    println!("ok");
}`,
    tags: ['binary-search', 'array'],
  },
  {
    id: 'ds-ch05-c-009',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Check if a Number is a Perfect Square',
    prompt: `Implement:

    fn check_perfect_square(n: u64) -> bool

Return true if n is a perfect square (i.e. some integer r satisfies r*r == n), false otherwise.
Do not use floating-point square root functions.

Constraints: 0 <= n <= 2^32.
Example: n = 16 -> true, n = 14 -> false`,
    hints: [
      'Binary search for r in [1, n]. Use saturating_mul to prevent overflow.',
      'Special-case n = 0 (it is a perfect square: 0*0 = 0).',
    ],
    solution: `fn check_perfect_square(n: u64) -> bool {
    if n == 0 { return true; }
    let (mut lo, mut hi) = (1u64, n);
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        let sq = mid.saturating_mul(mid);
        if sq == n {
            return true;
        } else if sq < n {
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    false
}

fn main() {
    assert!(check_perfect_square(0));
    assert!(check_perfect_square(1));
    assert!(check_perfect_square(4));
    assert!(check_perfect_square(9));
    assert!(check_perfect_square(16));
    assert!(!check_perfect_square(2));
    assert!(!check_perfect_square(3));
    assert!(!check_perfect_square(14));
    assert!(check_perfect_square(2147395600));
    println!("ok");
}`,
    starter: `fn check_perfect_square(n: u64) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert!(check_perfect_square(16));
    assert!(!check_perfect_square(14));
    println!("ok");
}`,
    tags: ['binary-search', 'math'],
  },
  {
    id: 'ds-ch05-c-010',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Find First and Last Position of Target',
    prompt: `Implement:

    fn search_range(nums: &[i32], target: i32) -> [i32; 2]

nums is sorted ascending and may contain duplicates. Return a two-element array
[first_index, last_index] of the positions where target appears. Return [-1, -1]
if target is absent.

Constraints: 0 <= nums.len() <= 10_000.
Example: nums = [5, 7, 7, 8, 8, 10], target = 8 -> [3, 4]`,
    hints: [
      'Run two binary searches: one for the leftmost and one for the rightmost position.',
      'Return [-1, -1] when the first search returns -1.',
    ],
    solution: `fn search_range(nums: &[i32], target: i32) -> [i32; 2] {
    fn first(nums: &[i32], target: i32) -> i32 {
        let (mut lo, mut hi) = (0i64, nums.len() as i64 - 1);
        let mut result = -1i32;
        while lo <= hi {
            let mid = lo + (hi - lo) / 2;
            if nums[mid as usize] == target { result = mid as i32; hi = mid - 1; }
            else if nums[mid as usize] < target { lo = mid + 1; }
            else { hi = mid - 1; }
        }
        result
    }
    fn last(nums: &[i32], target: i32) -> i32 {
        let (mut lo, mut hi) = (0i64, nums.len() as i64 - 1);
        let mut result = -1i32;
        while lo <= hi {
            let mid = lo + (hi - lo) / 2;
            if nums[mid as usize] == target { result = mid as i32; lo = mid + 1; }
            else if nums[mid as usize] < target { lo = mid + 1; }
            else { hi = mid - 1; }
        }
        result
    }
    [first(nums, target), last(nums, target)]
}

fn main() {
    assert_eq!(search_range(&[5, 7, 7, 8, 8, 10], 8), [3, 4]);
    assert_eq!(search_range(&[5, 7, 7, 8, 8, 10], 6), [-1, -1]);
    assert_eq!(search_range(&[], 0), [-1, -1]);
    assert_eq!(search_range(&[1], 1), [0, 0]);
    println!("ok");
}`,
    starter: `fn search_range(nums: &[i32], target: i32) -> [i32; 2] {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(search_range(&[5, 7, 7, 8, 8, 10], 8), [3, 4]);
    assert_eq!(search_range(&[], 0), [-1, -1]);
    println!("ok");
}`,
    tags: ['binary-search', 'array', 'duplicates'],
  },
  {
    id: 'ds-ch05-c-011',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Find a Peak Element',
    prompt: `Implement:

    fn find_peak(nums: &[i32]) -> i32

A peak element is one that is strictly greater than both its neighbors (elements
beyond the array boundaries are treated as negative infinity). Return ANY valid
peak index. nums has no two adjacent equal elements.

Constraints: 1 <= nums.len() <= 1000.
Example: nums = [1, 2, 3, 1] -> 2`,
    hints: [
      'If nums[mid] < nums[mid+1] there is a peak to the right; otherwise there is one at mid or to the left.',
      'Binary search converges to a valid peak; no linear scan needed.',
    ],
    solution: `fn find_peak(nums: &[i32]) -> i32 {
    let (mut lo, mut hi) = (0i64, nums.len() as i64 - 1);
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if nums[mid as usize] < nums[mid as usize + 1] {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    lo as i32
}

fn brute_peak(nums: &[i32]) -> i32 {
    for i in 0..nums.len() {
        let left_ok = i == 0 || nums[i] > nums[i - 1];
        let right_ok = i == nums.len() - 1 || nums[i] > nums[i + 1];
        if left_ok && right_ok { return i as i32; }
    }
    -1
}

fn main() {
    let cases: &[&[i32]] = &[
        &[1, 2, 3, 1],
        &[1, 2, 1, 3, 5, 6, 4],
        &[1],
        &[2, 1],
        &[1, 2],
        &[3, 2, 1],
    ];
    for c in cases {
        let idx = find_peak(c) as usize;
        let bf_idx = brute_peak(c) as usize;
        assert!(c[idx] >= c[bf_idx], "peak mismatch on {:?}: bs={} bf={}", c, idx, bf_idx);
        if idx > 0 { assert!(c[idx] > c[idx - 1]); }
        if idx < c.len() - 1 { assert!(c[idx] > c[idx + 1]); }
    }
    println!("ok");
}`,
    starter: `fn find_peak(nums: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    let idx = find_peak(&[1, 2, 3, 1]) as usize;
    let nums = [1, 2, 3, 1];
    assert!(idx > 0 && nums[idx] > nums[idx - 1]);
    println!("ok");
}`,
    tags: ['binary-search', 'array', 'peak'],
  },
  {
    id: 'ds-ch05-c-012',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Search in Rotated Sorted Array',
    prompt: `Implement:

    fn search_rotated(nums: &[i32], target: i32) -> i32

nums was originally sorted ascending with distinct values and then rotated at some
unknown pivot. Return the index of target, or -1 if absent.

Constraints: 1 <= nums.len() <= 5000, all elements distinct.
Example: nums = [4, 5, 6, 7, 0, 1, 2], target = 0 -> 4`,
    hints: [
      'At each step, one of the two halves is always sorted. Identify which half and check whether target falls inside it.',
      'Use the comparison nums[lo] <= nums[mid] to determine if the left half is sorted.',
    ],
    solution: `fn search_rotated(nums: &[i32], target: i32) -> i32 {
    let (mut lo, mut hi) = (0i64, nums.len() as i64 - 1);
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        let v = nums[mid as usize];
        if v == target { return mid as i32; }
        if nums[lo as usize] <= v {
            if nums[lo as usize] <= target && target < v {
                hi = mid - 1;
            } else {
                lo = mid + 1;
            }
        } else {
            if v < target && target <= nums[hi as usize] {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
    }
    -1
}

fn brute_search(nums: &[i32], target: i32) -> i32 {
    for (i, &v) in nums.iter().enumerate() {
        if v == target { return i as i32; }
    }
    -1
}

fn main() {
    let cases: &[(&[i32], i32)] = &[
        (&[4, 5, 6, 7, 0, 1, 2], 0),
        (&[4, 5, 6, 7, 0, 1, 2], 3),
        (&[1], 0),
        (&[1], 1),
        (&[3, 1], 1),
        (&[5, 1, 3], 5),
        (&[5, 1, 3], 3),
    ];
    for (nums, target) in cases {
        assert_eq!(search_rotated(nums, *target), brute_search(nums, *target),
            "mismatch on {:?} target={}", nums, target);
    }
    println!("ok");
}`,
    starter: `fn search_rotated(nums: &[i32], target: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(search_rotated(&[4, 5, 6, 7, 0, 1, 2], 0), 4);
    assert_eq!(search_rotated(&[4, 5, 6, 7, 0, 1, 2], 3), -1);
    println!("ok");
}`,
    tags: ['binary-search', 'rotated-array'],
  },
  {
    id: 'ds-ch05-c-013',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Minimum in Rotated Sorted Array',
    prompt: `Implement:

    fn find_min_rotated(nums: &[i32]) -> i32

nums was sorted ascending with distinct values and then rotated at some unknown pivot.
Return the minimum element. You must run in O(log n) time.

Constraints: 1 <= nums.len() <= 5000, all elements distinct.
Example: nums = [3, 4, 5, 1, 2] -> 1`,
    hints: [
      'Compare nums[mid] with nums[hi]. If nums[mid] > nums[hi] the minimum is in the right half.',
      'Otherwise the minimum is at mid or in the left half.',
    ],
    solution: `fn find_min_rotated(nums: &[i32]) -> i32 {
    let (mut lo, mut hi) = (0i64, nums.len() as i64 - 1);
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if nums[mid as usize] > nums[hi as usize] {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    nums[lo as usize]
}

fn brute_min(nums: &[i32]) -> i32 {
    *nums.iter().min().unwrap()
}

fn main() {
    let cases: &[&[i32]] = &[
        &[3, 4, 5, 1, 2],
        &[4, 5, 6, 7, 0, 1, 2],
        &[11, 13, 15, 17],
        &[1],
        &[2, 1],
        &[1, 2],
    ];
    for c in cases {
        assert_eq!(find_min_rotated(c), brute_min(c), "mismatch on {:?}", c);
    }
    println!("ok");
}`,
    starter: `fn find_min_rotated(nums: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(find_min_rotated(&[3, 4, 5, 1, 2]), 1);
    assert_eq!(find_min_rotated(&[11, 13, 15, 17]), 11);
    println!("ok");
}`,
    tags: ['binary-search', 'rotated-array'],
  },
  {
    id: 'ds-ch05-c-014',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Search a Fully Sorted 2D Matrix',
    prompt: `Implement:

    fn search_matrix(matrix: &[Vec<i32>], target: i32) -> bool

matrix is an m x n matrix where: each row is sorted in ascending order, and the first
element of each row is greater than the last element of the previous row. Return true
if target exists, false otherwise.

Constraints: 1 <= m, n <= 100.
Example: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3 -> true`,
    hints: [
      'Treat the matrix as a flattened sorted array of m*n elements.',
      'Map virtual index i to row i/cols and column i%cols.',
    ],
    solution: `fn search_matrix(matrix: &[Vec<i32>], target: i32) -> bool {
    if matrix.is_empty() || matrix[0].is_empty() { return false; }
    let rows = matrix.len() as i64;
    let cols = matrix[0].len() as i64;
    let (mut lo, mut hi) = (0i64, rows * cols - 1);
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        let v = matrix[(mid / cols) as usize][(mid % cols) as usize];
        if v == target { return true; }
        else if v < target { lo = mid + 1; }
        else { hi = mid - 1; }
    }
    false
}

fn main() {
    let m = vec![
        vec![1, 3, 5, 7],
        vec![10, 11, 16, 20],
        vec![23, 30, 34, 60],
    ];
    assert!(search_matrix(&m, 3));
    assert!(!search_matrix(&m, 13));
    assert!(search_matrix(&m, 60));
    assert!(search_matrix(&m, 1));
    assert!(!search_matrix(&[], 1));
    println!("ok");
}`,
    starter: `fn search_matrix(matrix: &[Vec<i32>], target: i32) -> bool {
    // TODO
    todo!()
}

fn main() {
    let m = vec![vec![1, 3, 5, 7], vec![10, 11, 16, 20], vec![23, 30, 34, 60]];
    assert!(search_matrix(&m, 3));
    assert!(!search_matrix(&m, 13));
    println!("ok");
}`,
    tags: ['binary-search', 'matrix'],
  },
  {
    id: 'ds-ch05-c-015',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count Negatives in Sorted Grid',
    prompt: `Implement:

    fn count_negatives(grid: &[Vec<i32>]) -> i32

grid is an m x n matrix where each row is sorted in non-increasing order. Count the
total number of negative integers in the grid using binary search on each row.

Constraints: 1 <= m, n <= 100, -100 <= grid[i][j] <= 100.
Example: grid = [[4,3,2,-1],[3,2,1,-1],[1,1,-1,-2],[-1,-1,-2,-3]] -> 8`,
    hints: [
      'For each row, binary search for the first index where the value is negative.',
      'All elements from that index to the end of the row are negative.',
    ],
    solution: `fn count_negatives(grid: &[Vec<i32>]) -> i32 {
    let mut count = 0i32;
    for row in grid {
        let n = row.len() as i64;
        let (mut lo, mut hi) = (0i64, n);
        while lo < hi {
            let mid = lo + (hi - lo) / 2;
            if row[mid as usize] < 0 { hi = mid; }
            else { lo = mid + 1; }
        }
        count += (n - lo) as i32;
    }
    count
}

fn brute_neg(grid: &[Vec<i32>]) -> i32 {
    grid.iter().flat_map(|r| r.iter()).filter(|&&v| v < 0).count() as i32
}

fn main() {
    let g = vec![
        vec![4, 3, 2, -1],
        vec![3, 2, 1, -1],
        vec![1, 1, -1, -2],
        vec![-1, -1, -2, -3],
    ];
    let g2 = vec![vec![3, 1], vec![1, -1]];
    assert_eq!(count_negatives(&g), brute_neg(&g));
    assert_eq!(count_negatives(&g), 8);
    assert_eq!(count_negatives(&g2), brute_neg(&g2));
    println!("ok");
}`,
    starter: `fn count_negatives(grid: &[Vec<i32>]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    let g = vec![vec![4,3,2,-1],vec![3,2,1,-1],vec![1,1,-1,-2],vec![-1,-1,-2,-3]];
    assert_eq!(count_negatives(&g), 8);
    println!("ok");
}`,
    tags: ['binary-search', 'matrix'],
  },
  {
    id: 'ds-ch05-c-016',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Koko Eating Bananas',
    prompt: `Implement:

    fn koko_min_speed(piles: &[i64], h: i64) -> i64

Koko must eat all bananas in h hours. Each hour she eats at most k bananas from one
pile. Find the minimum integer k such that she can finish all piles within h hours.

Constraints: 1 <= piles.len() <= h, 1 <= piles[i] <= 10^9.
Example: piles = [3, 6, 7, 11], h = 8 -> 4`,
    hints: [
      'Binary search on k in [1, max(piles)]. The feasibility check is sum of ceil(p/k) <= h.',
      'Use ceiling division (p + k - 1) / k to avoid floating-point.',
    ],
    solution: `fn koko_min_speed(piles: &[i64], h: i64) -> i64 {
    fn hours_needed(piles: &[i64], speed: i64) -> i64 {
        piles.iter().map(|&p| (p + speed - 1) / speed).sum()
    }
    let (mut lo, mut hi) = (1i64, *piles.iter().max().unwrap());
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if hours_needed(piles, mid) <= h {
            hi = mid;
        } else {
            lo = mid + 1;
        }
    }
    lo
}

fn brute_koko(piles: &[i64], h: i64) -> i64 {
    fn hours_needed(piles: &[i64], speed: i64) -> i64 {
        piles.iter().map(|&p| (p + speed - 1) / speed).sum()
    }
    let max = *piles.iter().max().unwrap();
    for s in 1..=max {
        if hours_needed(piles, s) <= h { return s; }
    }
    max
}

fn main() {
    let cases: &[(&[i64], i64)] = &[
        (&[3, 6, 7, 11], 8),
        (&[30, 11, 23, 4, 20], 5),
        (&[30, 11, 23, 4, 20], 6),
        (&[1000000000], 2),
    ];
    for (piles, h) in cases {
        assert_eq!(koko_min_speed(piles, *h), brute_koko(piles, *h),
            "mismatch piles={:?} h={}", piles, h);
    }
    println!("ok");
}`,
    starter: `fn koko_min_speed(piles: &[i64], h: i64) -> i64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(koko_min_speed(&[3, 6, 7, 11], 8), 4);
    assert_eq!(koko_min_speed(&[30, 11, 23, 4, 20], 5), 30);
    println!("ok");
}`,
    tags: ['binary-search', 'search-on-answer'],
  },
  {
    id: 'ds-ch05-c-017',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Capacity to Ship Within D Days',
    prompt: `Implement:

    fn ship_capacity(weights: &[i64], days: i64) -> i64

Packages with given weights must all be shipped within days days. Each day you load
packages in order (no reordering). Find the minimum ship weight capacity so all
packages ship on time.

Constraints: 1 <= weights.len() <= 500, 1 <= weights[i] <= 500, 1 <= days <= weights.len().
Example: weights = [1,2,3,4,5,6,7,8,9,10], days = 5 -> 15`,
    hints: [
      'Binary search on capacity in [max(weights), sum(weights)].',
      'Feasibility: simulate loading and count how many days are needed.',
    ],
    solution: `fn ship_capacity(weights: &[i64], days: i64) -> i64 {
    fn can_ship(weights: &[i64], cap: i64, days: i64) -> bool {
        let (mut d, mut cur) = (1i64, 0i64);
        for &w in weights {
            if cur + w > cap { d += 1; cur = 0; }
            cur += w;
        }
        d <= days
    }
    let lo = *weights.iter().max().unwrap();
    let hi: i64 = weights.iter().sum();
    let (mut lo, mut hi) = (lo, hi);
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if can_ship(weights, mid, days) { hi = mid; }
        else { lo = mid + 1; }
    }
    lo
}

fn brute_ship(weights: &[i64], days: i64) -> i64 {
    fn can_ship(weights: &[i64], cap: i64, days: i64) -> bool {
        let (mut d, mut cur) = (1i64, 0i64);
        for &w in weights {
            if cur + w > cap { d += 1; cur = 0; }
            cur += w;
        }
        d <= days
    }
    let lo = *weights.iter().max().unwrap();
    let hi: i64 = weights.iter().sum();
    for c in lo..=hi { if can_ship(weights, c, days) { return c; } }
    hi
}

fn main() {
    let cases: &[(&[i64], i64)] = &[
        (&[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5),
        (&[3, 2, 2, 4, 1, 4], 3),
        (&[1, 2, 3, 1, 1], 4),
    ];
    for (w, d) in cases {
        assert_eq!(ship_capacity(w, *d), brute_ship(w, *d),
            "mismatch w={:?} d={}", w, d);
    }
    println!("ok");
}`,
    starter: `fn ship_capacity(weights: &[i64], days: i64) -> i64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(ship_capacity(&[1,2,3,4,5,6,7,8,9,10], 5), 15);
    assert_eq!(ship_capacity(&[3,2,2,4,1,4], 3), 6);
    println!("ok");
}`,
    tags: ['binary-search', 'search-on-answer', 'greedy'],
  },
  {
    id: 'ds-ch05-c-018',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Search in Rotated Array with Duplicates',
    prompt: `Implement:

    fn search_rotated_with_dups(nums: &[i32], target: i32) -> bool

nums was sorted ascending with possible duplicates and then rotated at an unknown
pivot. Return true if target exists in nums.

Constraints: 1 <= nums.len() <= 5000, duplicates allowed.
Example: nums = [2, 5, 6, 0, 0, 1, 2], target = 0 -> true`,
    hints: [
      'When nums[lo] == nums[mid] == nums[hi] you cannot determine which side is sorted; shrink both ends.',
      'Otherwise apply the same two-case logic as the no-duplicates version.',
    ],
    solution: `fn search_rotated_with_dups(nums: &[i32], target: i32) -> bool {
    let (mut lo, mut hi) = (0i64, nums.len() as i64 - 1);
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        let v = nums[mid as usize];
        if v == target { return true; }
        if nums[lo as usize] == v && v == nums[hi as usize] {
            lo += 1; hi -= 1;
        } else if nums[lo as usize] <= v {
            if nums[lo as usize] <= target && target < v { hi = mid - 1; }
            else { lo = mid + 1; }
        } else {
            if v < target && target <= nums[hi as usize] { lo = mid + 1; }
            else { hi = mid - 1; }
        }
    }
    false
}

fn brute_search_dup(nums: &[i32], target: i32) -> bool {
    nums.contains(&target)
}

fn main() {
    let cases: &[(&[i32], i32)] = &[
        (&[2, 5, 6, 0, 0, 1, 2], 0),
        (&[2, 5, 6, 0, 0, 1, 2], 3),
        (&[1, 1, 1, 1, 1], 2),
        (&[1, 1, 1, 1, 1], 1),
        (&[3, 1, 1], 3),
    ];
    for (nums, t) in cases {
        assert_eq!(search_rotated_with_dups(nums, *t), brute_search_dup(nums, *t),
            "mismatch {:?} t={}", nums, t);
    }
    println!("ok");
}`,
    starter: `fn search_rotated_with_dups(nums: &[i32], target: i32) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert!(search_rotated_with_dups(&[2, 5, 6, 0, 0, 1, 2], 0));
    assert!(!search_rotated_with_dups(&[2, 5, 6, 0, 0, 1, 2], 3));
    println!("ok");
}`,
    tags: ['binary-search', 'rotated-array', 'duplicates'],
  },
  {
    id: 'ds-ch05-c-019',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Search in a Row and Column Sorted Matrix',
    prompt: `Implement:

    fn search_2d_staircase(matrix: &[Vec<i32>], target: i32) -> bool

matrix is an m x n matrix where each row is sorted left to right and each column is
sorted top to bottom, but rows are NOT globally concatenated. Return true if target
exists. Aim for O(m + n) time using a staircase search from the top-right corner.

Constraints: 1 <= m, n <= 300.
Example: matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5 -> true`,
    hints: [
      'Start at the top-right corner. If current > target move left; if current < target move down.',
      'This eliminates one row or column per step, giving O(m+n) total.',
    ],
    solution: `fn search_2d_staircase(matrix: &[Vec<i32>], target: i32) -> bool {
    if matrix.is_empty() || matrix[0].is_empty() { return false; }
    let rows = matrix.len();
    let cols = matrix[0].len();
    let (mut r, mut c) = (0usize, cols - 1);
    loop {
        if r >= rows { break; }
        let v = matrix[r][c];
        if v == target { return true; }
        else if v > target {
            if c == 0 { break; }
            c -= 1;
        } else {
            r += 1;
        }
    }
    false
}

fn brute_2d(matrix: &[Vec<i32>], target: i32) -> bool {
    matrix.iter().any(|row| row.contains(&target))
}

fn main() {
    let m = vec![
        vec![1, 4, 7, 11, 15],
        vec![2, 5, 8, 12, 19],
        vec![3, 6, 9, 16, 22],
        vec![10, 13, 14, 17, 24],
        vec![18, 21, 23, 26, 30],
    ];
    for &t in &[5, 20, 1, 30, 0, 100] {
        assert_eq!(search_2d_staircase(&m, t), brute_2d(&m, t), "target={}", t);
    }
    println!("ok");
}`,
    starter: `fn search_2d_staircase(matrix: &[Vec<i32>], target: i32) -> bool {
    // TODO
    todo!()
}

fn main() {
    let m = vec![
        vec![1,4,7,11,15], vec![2,5,8,12,19], vec![3,6,9,16,22],
        vec![10,13,14,17,24], vec![18,21,23,26,30],
    ];
    assert!(search_2d_staircase(&m, 5));
    assert!(!search_2d_staircase(&m, 20));
    println!("ok");
}`,
    tags: ['binary-search', 'matrix', 'two-pointer'],
  },
  {
    id: 'ds-ch05-c-020',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Two-Pass Search in Rotated Array',
    prompt: `Implement:

    fn two_pass_min_search(nums: &[i32], target: i32) -> i32

nums was sorted ascending with distinct values and then rotated. First find the
rotation pivot (minimum element index) using binary search, then run a second
binary search on the correct half to locate target.

Constraints: 1 <= nums.len() <= 5000, all distinct.
Example: nums = [4, 5, 6, 7, 0, 1, 2], target = 0 -> 4`,
    hints: [
      'Pass 1: find pivot (minimum index) with the nums[mid] vs nums[hi] comparison.',
      'Pass 2: target is in [pivot..n-1] if nums[pivot] <= target <= nums[n-1], otherwise in [0..pivot-1].',
    ],
    solution: `fn two_pass_min_search(nums: &[i32], target: i32) -> i32 {
    if nums.is_empty() { return -1; }
    let n = nums.len();
    let mut pivot;
    let (mut lo, mut hi) = (0i64, n as i64 - 1);
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if nums[mid as usize] > nums[hi as usize] { lo = mid + 1; }
        else { hi = mid; }
    }
    pivot = lo;
    let result_left = {
        let (mut a, mut b) = (pivot, n as i64 - 1);
        let mut res = -1i32;
        while a <= b {
            let mid = a + (b - a) / 2;
            if nums[mid as usize] == target { res = mid as i32; break; }
            else if nums[mid as usize] < target { a = mid + 1; }
            else { b = mid - 1; }
        }
        res
    };
    if result_left != -1 { return result_left; }
    if pivot == 0 { return -1; }
    let (mut a, mut b) = (0i64, pivot - 1);
    let mut res = -1i32;
    while a <= b {
        let mid = a + (b - a) / 2;
        if nums[mid as usize] == target { res = mid as i32; break; }
        else if nums[mid as usize] < target { a = mid + 1; }
        else { b = mid - 1; }
    }
    let _ = pivot;
    res
}

fn brute_search(nums: &[i32], target: i32) -> i32 {
    for (i, &v) in nums.iter().enumerate() { if v == target { return i as i32; } }
    -1
}

fn main() {
    let cases: &[(&[i32], i32)] = &[
        (&[4, 5, 6, 7, 0, 1, 2], 0),
        (&[4, 5, 6, 7, 0, 1, 2], 3),
        (&[1], 1),
        (&[3, 5, 1], 3),
        (&[2, 3, 4, 5, 1], 1),
    ];
    for (nums, t) in cases {
        assert_eq!(two_pass_min_search(nums, *t), brute_search(nums, *t),
            "mismatch {:?} t={}", nums, t);
    }
    println!("ok");
}`,
    starter: `fn two_pass_min_search(nums: &[i32], target: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(two_pass_min_search(&[4, 5, 6, 7, 0, 1, 2], 0), 4);
    assert_eq!(two_pass_min_search(&[4, 5, 6, 7, 0, 1, 2], 3), -1);
    println!("ok");
}`,
    tags: ['binary-search', 'rotated-array'],
  },
  {
    id: 'ds-ch05-c-021',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Split Array Minimizing Largest Sum',
    prompt: `Implement:

    fn split_array_min_largest(nums: &[i64], m: i64) -> i64

Split nums into exactly m non-empty contiguous sub-arrays. Minimize the value of the
largest sub-array sum. Return that minimum possible largest sum.

Constraints: 1 <= m <= nums.len() <= 1000, 0 <= nums[i] <= 10^6.
Example: nums = [7, 2, 5, 10, 8], m = 2 -> 18`,
    hints: [
      'Binary search on the answer (the allowed maximum sum) in [max(nums), sum(nums)].',
      'Feasibility check: greedily fill sub-arrays never exceeding the limit; count how many parts you need.',
    ],
    solution: `fn split_array_min_largest(nums: &[i64], m: i64) -> i64 {
    fn can_split(nums: &[i64], m: i64, limit: i64) -> bool {
        let (mut parts, mut cur) = (1i64, 0i64);
        for &v in nums {
            if cur + v > limit { parts += 1; cur = 0; }
            cur += v;
        }
        parts <= m
    }
    let lo = *nums.iter().max().unwrap();
    let hi: i64 = nums.iter().sum();
    let (mut lo, mut hi) = (lo, hi);
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if can_split(nums, m, mid) { hi = mid; }
        else { lo = mid + 1; }
    }
    lo
}

fn brute_split(nums: &[i64], m: i64) -> i64 {
    fn can_split(nums: &[i64], m: i64, limit: i64) -> bool {
        let (mut parts, mut cur) = (1i64, 0i64);
        for &v in nums { if cur + v > limit { parts += 1; cur = 0; } cur += v; }
        parts <= m
    }
    let lo = *nums.iter().max().unwrap();
    let hi: i64 = nums.iter().sum();
    for c in lo..=hi { if can_split(nums, m, c) { return c; } }
    hi
}

fn main() {
    let cases: &[(&[i64], i64)] = &[
        (&[7, 2, 5, 10, 8], 2),
        (&[1, 2, 3, 4, 5], 2),
        (&[1, 4, 4], 3),
        (&[1, 2, 3, 4, 5], 5),
        (&[10, 5, 13, 4, 8, 4, 5, 11, 14, 9, 16, 10, 20, 8], 8),
    ];
    for (nums, m) in cases {
        assert_eq!(split_array_min_largest(nums, *m), brute_split(nums, *m),
            "mismatch nums={:?} m={}", nums, m);
    }
    println!("ok");
}`,
    starter: `fn split_array_min_largest(nums: &[i64], m: i64) -> i64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(split_array_min_largest(&[7, 2, 5, 10, 8], 2), 18);
    assert_eq!(split_array_min_largest(&[1, 2, 3, 4, 5], 2), 9);
    println!("ok");
}`,
    tags: ['binary-search', 'search-on-answer', 'greedy', 'hard'],
  },
  {
    id: 'ds-ch05-c-022',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Kth Smallest in a Sorted Matrix',
    prompt: `Implement:

    fn kth_smallest_sorted_matrix(matrix: &[Vec<i32>], k: i32) -> i32

matrix is an n x n matrix where each row and each column is sorted in ascending
order. Return the k-th smallest element (1-indexed).

Constraints: 1 <= n <= 300, k <= n*n.
Example: matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8 -> 13`,
    hints: [
      'Binary search on the value space [matrix[0][0], matrix[n-1][n-1]].',
      'Count elements <= mid using a staircase walk from bottom-left; total time O(n log(max-min)).',
    ],
    solution: `fn kth_smallest_sorted_matrix(matrix: &[Vec<i32>], k: i32) -> i32 {
    let n = matrix.len();
    fn count_le(matrix: &[Vec<i32>], val: i32, n: usize) -> i32 {
        let (mut r, mut c, mut cnt) = (0usize, n, 0i32);
        while r < n {
            while c > 0 && matrix[r][c - 1] > val { c -= 1; }
            cnt += c as i32;
            r += 1;
        }
        cnt
    }
    let (mut lo, mut hi) = (matrix[0][0], matrix[n - 1][n - 1]);
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if count_le(matrix, mid, n) < k { lo = mid + 1; }
        else { hi = mid; }
    }
    lo
}

fn brute_kth(matrix: &[Vec<i32>], k: i32) -> i32 {
    let mut all: Vec<i32> = matrix.iter().flat_map(|r| r.iter().copied()).collect();
    all.sort();
    all[(k - 1) as usize]
}

fn main() {
    let m1 = vec![vec![1, 5, 9], vec![10, 11, 13], vec![12, 13, 15]];
    let m2 = vec![vec![1, 2], vec![1, 3]];
    for &k in &[1i32, 2, 5, 8, 9] {
        assert_eq!(kth_smallest_sorted_matrix(&m1, k), brute_kth(&m1, k), "k={}", k);
    }
    for &k in &[1i32, 2, 3, 4] {
        assert_eq!(kth_smallest_sorted_matrix(&m2, k), brute_kth(&m2, k), "k={}", k);
    }
    println!("ok");
}`,
    starter: `fn kth_smallest_sorted_matrix(matrix: &[Vec<i32>], k: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    let m = vec![vec![1,5,9],vec![10,11,13],vec![12,13,15]];
    assert_eq!(kth_smallest_sorted_matrix(&m, 8), 13);
    println!("ok");
}`,
    tags: ['binary-search', 'matrix', 'kth-element', 'hard'],
  },
  {
    id: 'ds-ch05-c-023',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Find the Duplicate Number via Binary Search',
    prompt: `Implement:

    fn find_duplicate_bsort(nums: &[i32]) -> i32

nums contains n+1 integers all in the range [1, n]. Exactly one number is repeated
(possibly more than twice). Find the duplicate without modifying the array and using
only O(1) extra space. Use a binary search on value range approach.

Constraints: 2 <= nums.len() <= 10^5, 1 <= nums[i] <= nums.len()-1.
Example: nums = [1, 3, 4, 2, 2] -> 2`,
    hints: [
      'Binary search on value mid = (lo+hi)/2. Count how many elements are <= mid.',
      'If count > mid, the duplicate is in [lo, mid]; otherwise in [mid+1, hi] (pigeonhole principle).',
    ],
    solution: `fn find_duplicate_bsort(nums: &[i32]) -> i32 {
    let n = nums.len() as i32 - 1;
    let (mut lo, mut hi) = (1i32, n);
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        let count = nums.iter().filter(|&&v| v <= mid).count() as i32;
        if count > mid { hi = mid; }
        else { lo = mid + 1; }
    }
    lo
}

fn brute_dup(nums: &[i32]) -> i32 {
    let mut seen = std::collections::HashSet::new();
    for &v in nums { if !seen.insert(v) { return v; } }
    -1
}

fn main() {
    let cases: &[&[i32]] = &[
        &[1, 3, 4, 2, 2],
        &[3, 1, 3, 4, 2],
        &[2, 2, 2, 2, 2],
        &[1, 1],
    ];
    for c in cases {
        assert_eq!(find_duplicate_bsort(c), brute_dup(c), "mismatch {:?}", c);
    }
    println!("ok");
}`,
    starter: `fn find_duplicate_bsort(nums: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(find_duplicate_bsort(&[1, 3, 4, 2, 2]), 2);
    assert_eq!(find_duplicate_bsort(&[3, 1, 3, 4, 2]), 3);
    println!("ok");
}`,
    tags: ['binary-search', 'pigeonhole', 'hard'],
  },
  {
    id: 'ds-ch05-c-024',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Magnetic Force Between Balls',
    prompt: `Implement:

    fn magnetic_force_max_min(position: &mut Vec<i64>, m: i64) -> i64

Place m balls into baskets at the given positions (one ball per basket). Maximize
the minimum magnetic force (distance) between any two balls.

Constraints: 2 <= m <= positions.len() <= 10^5, 1 <= positions[i] <= 10^9.
Example: positions = [1, 2, 3, 4, 7], m = 3 -> 3`,
    hints: [
      'Sort positions first, then binary search on the minimum distance d.',
      'Feasibility: greedily place balls keeping consecutive distance >= d; check if m balls fit.',
    ],
    solution: `fn magnetic_force_max_min(position: &mut Vec<i64>, m: i64) -> i64 {
    position.sort();
    fn can_place(pos: &[i64], m: i64, dist: i64) -> bool {
        let (mut count, mut last) = (1i64, pos[0]);
        for &p in &pos[1..] {
            if p - last >= dist { count += 1; last = p; }
        }
        count >= m
    }
    let (mut lo, mut hi) = (1i64, (position.last().unwrap() - position[0]) / (m - 1).max(1));
    while lo < hi {
        let mid = lo + (hi - lo + 1) / 2;
        if can_place(position, m, mid) { lo = mid; }
        else { hi = mid - 1; }
    }
    lo
}

fn brute_force_magnetic(position: &[i64], m: i64) -> i64 {
    fn can_place(pos: &[i64], m: i64, dist: i64) -> bool {
        let (mut count, mut last) = (1i64, pos[0]);
        for &p in &pos[1..] { if p - last >= dist { count += 1; last = p; } }
        count >= m
    }
    let mut pos = position.to_vec();
    pos.sort();
    let max_d = (pos.last().unwrap() - pos[0]) / (m - 1).max(1);
    let mut ans = 0;
    for d in 1..=max_d { if can_place(&pos, m, d) { ans = d; } }
    ans
}

fn main() {
    let cases: &[(&[i64], i64)] = &[
        (&[1, 2, 3, 4, 7], 3),
        (&[5, 4, 3, 2, 1, 1000000000], 2),
        (&[1, 2, 4, 8, 9], 3),
    ];
    for (pos, m) in cases {
        let mut v = pos.to_vec();
        let bs = magnetic_force_max_min(&mut v, *m);
        let bf = brute_force_magnetic(pos, *m);
        assert_eq!(bs, bf, "mismatch pos={:?} m={}", pos, m);
    }
    println!("ok");
}`,
    starter: `fn magnetic_force_max_min(position: &mut Vec<i64>, m: i64) -> i64 {
    // TODO
    todo!()
}

fn main() {
    let mut pos = vec![1i64, 2, 3, 4, 7];
    assert_eq!(magnetic_force_max_min(&mut pos, 3), 3);
    println!("ok");
}`,
    tags: ['binary-search', 'search-on-answer', 'greedy', 'hard'],
  },
  {
    id: 'ds-ch05-c-025',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Allocate Books to Students',
    prompt: `Implement:

    fn minimize_max_pages(pages: &[i64], k: i64) -> i64

Allocate n books (each with pages[i] pages) to k students in contiguous order.
Each student must get at least one book. Minimize the maximum pages assigned to
any single student.

Constraints: 1 <= k <= pages.len() <= 1000, 1 <= pages[i] <= 10^9.
Example: pages = [12, 34, 67, 90], k = 2 -> 113`,
    hints: [
      'Binary search the answer in [max(pages), sum(pages)].',
      'Feasibility: count students needed to stay within the limit using a greedy pass.',
    ],
    solution: `fn minimize_max_pages(pages: &[i64], k: i64) -> i64 {
    fn can_assign(pages: &[i64], k: i64, limit: i64) -> bool {
        let (mut students, mut cur) = (1i64, 0i64);
        for &p in pages {
            if p > limit { return false; }
            if cur + p > limit { students += 1; cur = 0; }
            cur += p;
        }
        students <= k
    }
    if (k as usize) > pages.len() { return *pages.iter().max().unwrap_or(&0); }
    let lo = *pages.iter().max().unwrap();
    let hi: i64 = pages.iter().sum();
    let (mut lo, mut hi) = (lo, hi);
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if can_assign(pages, k, mid) { hi = mid; }
        else { lo = mid + 1; }
    }
    lo
}

fn brute_pages(pages: &[i64], k: i64) -> i64 {
    fn can_assign(pages: &[i64], k: i64, limit: i64) -> bool {
        let (mut students, mut cur) = (1i64, 0i64);
        for &p in pages {
            if p > limit { return false; }
            if cur + p > limit { students += 1; cur = 0; }
            cur += p;
        }
        students <= k
    }
    let lo = *pages.iter().max().unwrap();
    let hi: i64 = pages.iter().sum();
    for c in lo..=hi { if can_assign(pages, k, c) { return c; } }
    hi
}

fn main() {
    let cases: &[(&[i64], i64)] = &[
        (&[12, 34, 67, 90], 2),
        (&[10, 20, 30, 40], 2),
        (&[5, 5, 5, 5], 4),
        (&[100], 1),
    ];
    for (p, k) in cases {
        assert_eq!(minimize_max_pages(p, *k), brute_pages(p, *k), "mismatch p={:?} k={}", p, k);
    }
    println!("ok");
}`,
    starter: `fn minimize_max_pages(pages: &[i64], k: i64) -> i64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(minimize_max_pages(&[12, 34, 67, 90], 2), 113);
    assert_eq!(minimize_max_pages(&[5, 5, 5, 5], 4), 5);
    println!("ok");
}`,
    tags: ['binary-search', 'search-on-answer', 'greedy', 'hard'],
  },
  {
    id: 'ds-ch05-c-026',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Kth Smallest in Two Sorted Arrays',
    prompt: `Implement:

    fn kth_smallest_two_sorted(a: &[i64], b: &[i64], k: usize) -> i64

a and b are both sorted in ascending order. Return the k-th smallest element
(1-indexed) among all elements of a and b combined. Do not merge the arrays.

Constraints: 1 <= k <= a.len() + b.len() <= 10^6, a.len() <= b.len().
Example: a = [1, 3, 5, 7], b = [2, 4, 6, 8], k = 3 -> 3`,
    hints: [
      'Binary search on how many elements to take from a (call it i). Then j = k - i elements come from b.',
      'The partition is correct when a[i-1] <= b[j] and b[j-1] <= a[i]. Adjust based on which side violates.',
    ],
    solution: `fn kth_smallest_two_sorted(a: &[i64], b: &[i64], k: usize) -> i64 {
    let (a, b) = if a.len() <= b.len() { (a, b) } else { (b, a) };
    let (m, n) = (a.len(), b.len());
    let (mut lo, mut hi) = (0usize, m.min(k));
    while lo <= hi {
        let i = lo + (hi - lo) / 2;
        let j = k - i;
        if j > n {
            lo = i + 1;
            continue;
        }
        let a_left  = if i == 0 { i64::MIN } else { a[i - 1] };
        let a_right = if i == m { i64::MAX } else { a[i] };
        let b_left  = if j == 0 { i64::MIN } else { b[j - 1] };
        let b_right = if j == n { i64::MAX } else { b[j] };
        if a_left <= b_right && b_left <= a_right {
            return a_left.max(b_left);
        } else if a_left > b_right {
            if i == 0 { break; }
            hi = i - 1;
        } else {
            lo = i + 1;
        }
    }
    i64::MIN
}

fn brute_kth_two(a: &[i64], b: &[i64], k: usize) -> i64 {
    let mut merged: Vec<i64> = a.iter().chain(b.iter()).copied().collect();
    merged.sort();
    merged[k - 1]
}

fn main() {
    let cases: &[(&[i64], &[i64], usize)] = &[
        (&[1, 3, 5, 7], &[2, 4, 6, 8], 3),
        (&[1, 3, 5, 7], &[2, 4, 6, 8], 6),
        (&[1, 2], &[3, 4], 2),
        (&[1, 2], &[3, 4], 4),
        (&[1, 2, 3], &[4, 5, 6, 7], 5),
        (&[1], &[2, 3, 4, 5], 4),
        (&[1, 3, 5, 7], &[2, 4, 6, 8], 1),
        (&[1, 3, 5, 7], &[2, 4, 6, 8], 8),
    ];
    for (a, b, k) in cases {
        let bs = kth_smallest_two_sorted(a, b, *k);
        let bf = brute_kth_two(a, b, *k);
        assert_eq!(bs, bf, "mismatch a={:?} b={:?} k={}", a, b, k);
    }
    println!("ok");
}`,
    starter: `fn kth_smallest_two_sorted(a: &[i64], b: &[i64], k: usize) -> i64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(kth_smallest_two_sorted(&[1,3,5,7], &[2,4,6,8], 3), 3);
    assert_eq!(kth_smallest_two_sorted(&[1,2], &[3,4], 4), 4);
    println!("ok");
}`,
    tags: ['binary-search', 'kth-element', 'hard'],
  },
  {
    id: 'ds-ch05-c-027',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Median of Two Sorted Arrays',
    prompt: `Implement:

    fn median_two_sorted(a: &[f64], b: &[f64]) -> f64

Find the median of the combined sorted sequence formed by two sorted arrays a and b.
The overall run time must be O(log(min(m, n))).

Constraints: 0 <= a.len(), b.len() <= 1000, at least one array is non-empty.
Example: a = [1.0, 3.0], b = [2.0] -> 2.0`,
    hints: [
      'Binary search on the number of elements to take from the smaller array.',
      'Partition both arrays so the combined left half has exactly (m+n)/2 elements.',
    ],
    solution: `fn median_two_sorted(a: &[f64], b: &[f64]) -> f64 {
    let (a, b) = if a.len() <= b.len() { (a, b) } else { (b, a) };
    let (m, n) = (a.len(), b.len());
    let half = (m + n) / 2;
    let (mut lo, mut hi) = (0usize, m);
    while lo <= hi {
        let i = lo + (hi - lo) / 2;
        let j = half - i;
        let a_left = if i == 0 { f64::NEG_INFINITY } else { a[i - 1] };
        let a_right = if i == m { f64::INFINITY } else { a[i] };
        let b_left = if j == 0 { f64::NEG_INFINITY } else { b[j - 1] };
        let b_right = if j == n { f64::INFINITY } else { b[j] };
        if a_left <= b_right && b_left <= a_right {
            if (m + n) % 2 == 1 {
                return a_right.min(b_right);
            } else {
                return (a_left.max(b_left) + a_right.min(b_right)) / 2.0;
            }
        } else if a_left > b_right {
            hi = i - 1;
        } else {
            lo = i + 1;
        }
    }
    0.0
}

fn brute_median(a: &[f64], b: &[f64]) -> f64 {
    let mut v: Vec<f64> = a.iter().chain(b.iter()).copied().collect();
    v.sort_by(|x, y| x.partial_cmp(y).unwrap());
    let n = v.len();
    if n % 2 == 1 { v[n / 2] } else { (v[n / 2 - 1] + v[n / 2]) / 2.0 }
}

fn main() {
    let cases: &[(&[f64], &[f64])] = &[
        (&[1.0, 3.0], &[2.0]),
        (&[1.0, 2.0], &[3.0, 4.0]),
        (&[0.0, 0.0], &[0.0, 0.0]),
        (&[1.0], &[2.0, 3.0, 4.0, 5.0]),
        (&[1.0, 5.0], &[2.0, 3.0, 4.0]),
    ];
    for (a, b) in cases {
        let bs = median_two_sorted(a, b);
        let bf = brute_median(a, b);
        assert!((bs - bf).abs() < 1e-9, "mismatch a={:?} b={:?} bs={} bf={}", a, b, bs, bf);
    }
    println!("ok");
}`,
    starter: `fn median_two_sorted(a: &[f64], b: &[f64]) -> f64 {
    // TODO
    todo!()
}

fn main() {
    assert!((median_two_sorted(&[1.0, 3.0], &[2.0]) - 2.0).abs() < 1e-9);
    assert!((median_two_sorted(&[1.0, 2.0], &[3.0, 4.0]) - 2.5).abs() < 1e-9);
    println!("ok");
}`,
    tags: ['binary-search', 'median', 'hard'],
  },
  {
    id: 'ds-ch05-c-028',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Kth Smallest in Multiplication Table',
    prompt: `Implement:

    fn find_kth_smallest_mul_table(m: i64, n: i64, k: i64) -> i64

Consider the m x n multiplication table where cell (i, j) = i * j (1-indexed).
Return the k-th smallest element in this table.

Constraints: 1 <= m, n <= 3 * 10^4, 1 <= k <= m * n.
Example: m = 3, n = 3, k = 5 -> 3`,
    hints: [
      'Binary search on value v in [1, m*n]. Count how many entries are <= v.',
      'For each row i, there are min(v/i, n) entries <= v. Sum over all rows i from 1..=m.',
    ],
    solution: `fn find_kth_smallest_mul_table(m: i64, n: i64, k: i64) -> i64 {
    fn count_le(m: i64, n: i64, val: i64) -> i64 {
        (1..=m).map(|i| (val / i).min(n)).sum()
    }
    let (mut lo, mut hi) = (1i64, m * n);
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if count_le(m, n, mid) < k { lo = mid + 1; }
        else { hi = mid; }
    }
    lo
}

fn brute_mul_table(m: i64, n: i64, k: i64) -> i64 {
    let mut v: Vec<i64> = (1..=m).flat_map(|i| (1..=n).map(move |j| i * j)).collect();
    v.sort();
    v[(k - 1) as usize]
}

fn main() {
    let cases: &[(i64, i64, i64)] = &[
        (3, 3, 5),
        (2, 3, 6),
        (1, 1, 1),
        (3, 3, 1),
        (3, 3, 9),
    ];
    for (m, n, k) in cases {
        assert_eq!(find_kth_smallest_mul_table(*m, *n, *k), brute_mul_table(*m, *n, *k),
            "mismatch m={} n={} k={}", m, n, k);
    }
    println!("ok");
}`,
    starter: `fn find_kth_smallest_mul_table(m: i64, n: i64, k: i64) -> i64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(find_kth_smallest_mul_table(3, 3, 5), 3);
    assert_eq!(find_kth_smallest_mul_table(2, 3, 6), 6);
    println!("ok");
}`,
    tags: ['binary-search', 'kth-element', 'math', 'hard'],
  },
  {
    id: 'ds-ch05-c-029',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Job Scheduling for Maximum Profit',
    prompt: `Implement:

    fn max_profit_job_scheduling(start: &[i64], end: &[i64], profit: &[i64]) -> i64

You have n jobs, each defined by a start time, end time, and profit. Jobs do not
overlap if end[i] <= start[j]. Select a non-overlapping subset of jobs to maximize
total profit. Use binary search within a DP solution.

Constraints: 1 <= n <= 10^4, 1 <= start[i] < end[i] <= 10^9.
Example: start=[1,2,3,3], end=[3,4,5,6], profit=[50,10,40,70] -> 120`,
    hints: [
      'Sort jobs by end time. For each job i, binary search for the last job that ends at or before start[i].',
      'dp[i] = max(dp[i-1], dp[compatible] + profit[i-1]).',
    ],
    solution: `fn max_profit_job_scheduling(start: &[i64], end: &[i64], profit: &[i64]) -> i64 {
    let n = start.len();
    let mut jobs: Vec<(i64, i64, i64)> = (0..n).map(|i| (end[i], start[i], profit[i])).collect();
    jobs.sort();
    let ends: Vec<i64> = jobs.iter().map(|j| j.0).collect();
    let mut dp = vec![0i64; n + 1];
    for i in 1..=n {
        let (e, s, p) = jobs[i - 1];
        let pos = ends.partition_point(|&x| x <= s);
        dp[i] = dp[i - 1].max(dp[pos] + p);
        let _ = e;
    }
    dp[n]
}

fn main() {
    let start  = vec![1, 2, 3, 3];
    let end    = vec![3, 4, 5, 6];
    let profit = vec![50, 10, 40, 70];
    assert_eq!(max_profit_job_scheduling(&start, &end, &profit), 120);

    let start2  = vec![1, 2, 3, 4, 6];
    let end2    = vec![3, 5, 10, 6, 9];
    let profit2 = vec![20, 20, 100, 70, 60];
    assert_eq!(max_profit_job_scheduling(&start2, &end2, &profit2), 150);

    let start3  = vec![1, 1, 1];
    let end3    = vec![2, 3, 4];
    let profit3 = vec![5, 6, 4];
    assert_eq!(max_profit_job_scheduling(&start3, &end3, &profit3), 6);
    println!("ok");
}`,
    starter: `fn max_profit_job_scheduling(start: &[i64], end: &[i64], profit: &[i64]) -> i64 {
    // TODO
    todo!()
}

fn main() {
    let s = vec![1i64, 2, 3, 3];
    let e = vec![3i64, 4, 5, 6];
    let p = vec![50i64, 10, 40, 70];
    assert_eq!(max_profit_job_scheduling(&s, &e, &p), 120);
    println!("ok");
}`,
    tags: ['binary-search', 'dynamic-programming', 'hard'],
  },
  {
    id: 'ds-ch05-c-030',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Median of Three Sorted Arrays',
    prompt: `Implement:

    fn median_three_sorted(a: &[i64], b: &[i64], c: &[i64]) -> f64

Find the median of the combined sorted sequence formed by three sorted arrays a, b,
and c. Aim for better than O((m+n+p) log(m+n+p)) using binary search ideas.

Constraints: 1 <= a.len(), b.len(), c.len() <= 500, total length >= 1.
Example: a = [1, 4, 5], b = [2, 6, 7], c = [3, 8, 9] -> 5.0`,
    hints: [
      'Reduce to "kth smallest of three sorted arrays" for k = (total+1)/2 and k = (total+2)/2, then average.',
      'For kth of three arrays, binary search on how many elements come from a, then split the remainder between b and c optimally.',
    ],
    solution: `fn median_three_sorted(a: &[i64], b: &[i64], c: &[i64]) -> f64 {
    let mut v: Vec<i64> = a.iter().chain(b.iter()).chain(c.iter()).copied().collect();
    v.sort();
    let n = v.len();
    if n % 2 == 1 { v[n / 2] as f64 }
    else { (v[n / 2 - 1] + v[n / 2]) as f64 / 2.0 }
}

fn kth_of_three_sorted(a: &[i64], b: &[i64], c: &[i64], k: usize) -> i64 {
    let mut v: Vec<i64> = a.iter().chain(b.iter()).chain(c.iter()).copied().collect();
    v.sort();
    v[k - 1]
}

fn kth_two(a: &[i64], b: &[i64], k: usize) -> i64 {
    let (a, b) = if a.len() <= b.len() { (a, b) } else { (b, a) };
    let (m, n) = (a.len(), b.len());
    let (mut lo, mut hi) = (0usize, m.min(k));
    while lo <= hi {
        let i = lo + (hi - lo) / 2;
        let j = k - i;
        if j > n { lo = i + 1; continue; }
        let al = if i == 0 { i64::MIN } else { a[i - 1] };
        let ar = if i == m { i64::MAX } else { a[i] };
        let bl = if j == 0 { i64::MIN } else { b[j - 1] };
        let br = if j == n { i64::MAX } else { b[j] };
        if al <= br && bl <= ar { return al.max(bl); }
        else if al > br { if i == 0 { break; } hi = i - 1; }
        else { lo = i + 1; }
    }
    i64::MIN
}

fn median_three_bs(a: &[i64], b: &[i64], c: &[i64]) -> f64 {
    let total = a.len() + b.len() + c.len();
    let k1 = (total + 1) / 2;
    let k2 = (total + 2) / 2;
    let mut merged_bc: Vec<i64> = b.iter().chain(c.iter()).copied().collect();
    merged_bc.sort();
    let v1 = kth_two(a, &merged_bc, k1);
    let v2 = kth_two(a, &merged_bc, k2);
    (v1 + v2) as f64 / 2.0
}

fn main() {
    let a = vec![1i64, 4, 5];
    let b = vec![2i64, 6, 7];
    let c = vec![3i64, 8, 9];
    let med = median_three_sorted(&a, &b, &c);
    assert!((med - 5.0).abs() < 1e-9, "median={}", med);

    for k in 1..=9usize {
        let v = kth_of_three_sorted(&a, &b, &c, k);
        assert_eq!(v, k as i64, "k={} expected={} got={}", k, k, v);
    }

    let med_bs = median_three_bs(&a, &b, &c);
    assert!((med_bs - med).abs() < 1e-9, "bs={} brute={}", med_bs, med);

    let a2 = vec![1i64, 2, 3];
    let b2 = vec![4i64];
    let c2 = vec![5i64, 6];
    let m2 = median_three_sorted(&a2, &b2, &c2);
    let m2_bs = median_three_bs(&a2, &b2, &c2);
    assert!((m2 - m2_bs).abs() < 1e-9, "a2 m2={} m2_bs={}", m2, m2_bs);
    println!("ok");
}`,
    starter: `fn median_three_sorted(a: &[i64], b: &[i64], c: &[i64]) -> f64 {
    // TODO
    todo!()
}

fn main() {
    let a = vec![1i64, 4, 5];
    let b = vec![2i64, 6, 7];
    let c = vec![3i64, 8, 9];
    let med = median_three_sorted(&a, &b, &c);
    assert!((med - 5.0).abs() < 1e-9);
    println!("ok");
}`,
    tags: ['binary-search', 'median', 'hard'],
  },
]

export default problems
