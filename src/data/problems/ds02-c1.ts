import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch02-c-001',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Reverse a Vector In Place',
    prompt: `Implement:

    fn reverse_vec(nums: &mut Vec<i32>)

Reverse the elements of nums in place using two pointers starting at both ends.
Move them toward each other, swapping elements until they meet.
Example: [1, 2, 3, 4, 5] -> [5, 4, 3, 2, 1]
Empty or single-element vectors must be handled without panicking.`,
    hints: [
      'Start one pointer at index 0 and one just past the last index.',
      'Decrement the right pointer before swapping, then increment the left.',
      'Stop when left + 1 >= right.',
    ],
    solution: `fn reverse_vec(nums: &mut Vec<i32>) {
    let (mut i, mut j) = (0usize, nums.len());
    while i + 1 < j {
        j -= 1;
        nums.swap(i, j);
        i += 1;
    }
}

fn main() {
    let mut v = vec![1, 2, 3, 4, 5];
    reverse_vec(&mut v);
    assert_eq!(v, vec![5, 4, 3, 2, 1]);
    let mut v2 = vec![1, 2];
    reverse_vec(&mut v2);
    assert_eq!(v2, vec![2, 1]);
    let mut e: Vec<i32> = vec![];
    reverse_vec(&mut e);
    assert_eq!(e, Vec::<i32>::new());
    let mut s = vec![42];
    reverse_vec(&mut s);
    assert_eq!(s, vec![42]);
    println!("ok");
}`,
    starter: `fn reverse_vec(nums: &mut Vec<i32>) {
    // TODO
    todo!()
}

fn main() {
    let mut v = vec![1, 2, 3, 4, 5];
    reverse_vec(&mut v);
    assert_eq!(v, vec![5, 4, 3, 2, 1]);
    println!("ok");
}`,
    tags: ['two-pointers', 'array', 'in-place'],
  },
  {
    id: 'ds-ch02-c-002',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Remove Duplicates from Sorted Array',
    prompt: `Implement:

    fn dedup_sorted(nums: &mut Vec<i32>) -> usize

Given a sorted array nums, remove duplicates in place using two pointers.
Return k, the count of unique elements. The first k elements of nums must hold the unique values in order.
Example: [1, 1, 2, 3, 3, 4] -> returns 4, nums[..4] == [1, 2, 3, 4]
Constraint: do not allocate a new array.`,
    hints: [
      'Use a write pointer starting at 1 and a read pointer scanning from 1 forward.',
      'Copy nums[read] into nums[write] only when it differs from its predecessor.',
    ],
    solution: `fn dedup_sorted(nums: &mut Vec<i32>) -> usize {
    if nums.is_empty() { return 0; }
    let mut write = 1usize;
    for read in 1..nums.len() {
        if nums[read] != nums[read - 1] {
            nums[write] = nums[read];
            write += 1;
        }
    }
    write
}

fn main() {
    let mut v = vec![1, 1, 2, 3, 3, 4];
    let k = dedup_sorted(&mut v);
    assert_eq!(k, 4);
    assert_eq!(&v[..k], &[1, 2, 3, 4]);
    let mut v2 = vec![0, 0, 0];
    let k2 = dedup_sorted(&mut v2);
    assert_eq!(k2, 1);
    assert_eq!(&v2[..k2], &[0]);
    let mut e: Vec<i32> = vec![];
    assert_eq!(dedup_sorted(&mut e), 0);
    let mut s = vec![7];
    assert_eq!(dedup_sorted(&mut s), 1);
    println!("ok");
}`,
    starter: `fn dedup_sorted(nums: &mut Vec<i32>) -> usize {
    // TODO
    todo!()
}

fn main() {
    let mut v = vec![1, 1, 2, 3, 3, 4];
    let k = dedup_sorted(&mut v);
    assert_eq!(k, 4);
    assert_eq!(&v[..k], &[1, 2, 3, 4]);
    println!("ok");
}`,
    tags: ['two-pointers', 'array', 'in-place', 'sorted'],
  },
  {
    id: 'ds-ch02-c-003',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Two Sum on a Sorted Array',
    prompt: `Implement:

    fn two_sum_sorted(nums: &[i32], target: i32) -> Option<(usize, usize)>

Given a sorted (non-decreasing) array nums and an integer target, find the indices of
two distinct elements that add up to target. Return Some((lo, hi)) with lo < hi, or None.
Example: nums=[1, 2, 3, 6], target=8 -> Some((1, 3)) because nums[1]+nums[3]=2+6=8
Use a two-pointer approach in O(n) time without extra space.`,
    hints: [
      'Start lo at 0 and hi at the last index.',
      'If the sum is too small, move lo right; if too large, move hi left.',
    ],
    solution: `fn two_sum_sorted(nums: &[i32], target: i32) -> Option<(usize, usize)> {
    let (mut lo, mut hi) = (0usize, nums.len().saturating_sub(1));
    while lo < hi {
        let s = nums[lo] + nums[hi];
        if s == target { return Some((lo, hi)); }
        else if s < target { lo += 1; }
        else { hi -= 1; }
    }
    None
}

fn main() {
    assert_eq!(two_sum_sorted(&[1, 2, 3, 6], 8), Some((1, 3)));
    assert_eq!(two_sum_sorted(&[2, 7, 11, 15], 9), Some((0, 1)));
    assert_eq!(two_sum_sorted(&[1, 2, 3], 10), None);
    assert_eq!(two_sum_sorted(&[1, 5], 6), Some((0, 1)));
    println!("ok");
}`,
    starter: `fn two_sum_sorted(nums: &[i32], target: i32) -> Option<(usize, usize)> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(two_sum_sorted(&[1, 2, 3, 6], 8), Some((1, 3)));
    assert_eq!(two_sum_sorted(&[1, 2, 3], 10), None);
    println!("ok");
}`,
    tags: ['two-pointers', 'array', 'sorted', 'two-sum'],
  },
  {
    id: 'ds-ch02-c-004',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Valid Palindrome Alphanumeric',
    prompt: `Implement:

    fn is_palindrome(s: &str) -> bool

Return true if s reads the same forward and backward after keeping only
alphanumeric characters and converting letters to lowercase.
Example: "A man a plan a canal Panama" -> true
Example: "hello" -> false
An empty string is a palindrome. Use two pointers on the filtered character list.`,
    hints: [
      'Collect only alphanumeric chars, lowercased, into a Vec<char>.',
      'Then use the standard two-pointer palindrome check on that vector.',
    ],
    solution: `fn is_palindrome(s: &str) -> bool {
    let chars: Vec<char> = s.chars()
        .filter(|c| c.is_alphanumeric())
        .map(|c| c.to_ascii_lowercase())
        .collect();
    let (mut lo, mut hi) = (0usize, chars.len());
    while lo + 1 < hi {
        hi -= 1;
        if chars[lo] != chars[hi] { return false; }
        lo += 1;
    }
    true
}

fn main() {
    assert!(is_palindrome("A man a plan a canal Panama"));
    assert!(is_palindrome("racecar"));
    assert!(!is_palindrome("hello"));
    assert!(is_palindrome(""));
    assert!(is_palindrome("a"));
    assert!(is_palindrome("Was it a car or a cat I saw"));
    println!("ok");
}`,
    starter: `fn is_palindrome(s: &str) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert!(is_palindrome("racecar"));
    assert!(!is_palindrome("hello"));
    println!("ok");
}`,
    tags: ['two-pointers', 'string', 'palindrome'],
  },
  {
    id: 'ds-ch02-c-005',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Move Zeroes to End',
    prompt: `Implement:

    fn move_zeroes(nums: &mut Vec<i32>)

Shift all zeroes in nums to the end while preserving the relative order of non-zero elements.
Do this in place without allocating a new array.
Example: [0, 1, 0, 3, 12] -> [1, 3, 12, 0, 0]
Example: [0, 0, 0] -> [0, 0, 0]`,
    hints: [
      'Use a write pointer that only advances when a non-zero is placed.',
      'After the read pass, fill the remaining positions with 0.',
    ],
    solution: `fn move_zeroes(nums: &mut Vec<i32>) {
    let mut write = 0usize;
    for read in 0..nums.len() {
        if nums[read] != 0 {
            nums[write] = nums[read];
            write += 1;
        }
    }
    while write < nums.len() {
        nums[write] = 0;
        write += 1;
    }
}

fn main() {
    let mut v = vec![0, 1, 0, 3, 12];
    move_zeroes(&mut v);
    assert_eq!(v, vec![1, 3, 12, 0, 0]);
    let mut v2 = vec![0, 0, 0];
    move_zeroes(&mut v2);
    assert_eq!(v2, vec![0, 0, 0]);
    let mut v3 = vec![1, 2, 3];
    move_zeroes(&mut v3);
    assert_eq!(v3, vec![1, 2, 3]);
    let mut e: Vec<i32> = vec![];
    move_zeroes(&mut e);
    assert_eq!(e, Vec::<i32>::new());
    println!("ok");
}`,
    starter: `fn move_zeroes(nums: &mut Vec<i32>) {
    // TODO
    todo!()
}

fn main() {
    let mut v = vec![0, 1, 0, 3, 12];
    move_zeroes(&mut v);
    assert_eq!(v, vec![1, 3, 12, 0, 0]);
    println!("ok");
}`,
    tags: ['two-pointers', 'array', 'in-place'],
  },
  {
    id: 'ds-ch02-c-006',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Squares of a Sorted Array',
    prompt: `Implement:

    fn squares_sorted(nums: &[i32]) -> Vec<i32>

Given an integer array sorted in non-decreasing order (may contain negatives),
return a new array of the squares of each element also sorted in non-decreasing order.
Example: [-4, -1, 0, 3, 10] -> [0, 1, 9, 16, 100]
Use two pointers from both ends and fill the result from the back. O(n) time.`,
    hints: [
      'The largest square is always at one of the two ends.',
      'Fill the result array from the back, placing the larger square each step.',
    ],
    solution: `fn squares_sorted(nums: &[i32]) -> Vec<i32> {
    let n = nums.len();
    let mut result = vec![0i32; n];
    let (mut lo, mut hi) = (0usize, n.saturating_sub(1));
    let mut pos = n;
    while lo <= hi && pos > 0 {
        pos -= 1;
        let ls = nums[lo] * nums[lo];
        let hs = nums[hi] * nums[hi];
        if ls > hs {
            result[pos] = ls;
            lo += 1;
        } else {
            result[pos] = hs;
            if hi == 0 { break; }
            hi -= 1;
        }
    }
    result
}

fn main() {
    assert_eq!(squares_sorted(&[-4, -1, 0, 3, 10]), vec![0, 1, 9, 16, 100]);
    assert_eq!(squares_sorted(&[-7, -3, 2, 3, 11]), vec![4, 9, 9, 49, 121]);
    assert_eq!(squares_sorted(&[0]), vec![0]);
    assert_eq!(squares_sorted(&[-2, -1]), vec![1, 4]);
    assert_eq!(squares_sorted(&[1, 2, 3]), vec![1, 4, 9]);
    println!("ok");
}`,
    starter: `fn squares_sorted(nums: &[i32]) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(squares_sorted(&[-4, -1, 0, 3, 10]), vec![0, 1, 9, 16, 100]);
    println!("ok");
}`,
    tags: ['two-pointers', 'array', 'sorted'],
  },
  {
    id: 'ds-ch02-c-007',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Remove Element In Place',
    prompt: `Implement:

    fn remove_element(nums: &mut Vec<i32>, val: i32) -> usize

Remove all occurrences of val from nums in place and return k, the count of remaining elements.
The first k slots of nums must hold the kept values (order among them does not matter).
Example: nums=[3, 2, 2, 3], val=3 -> returns 2, nums[..2] contains [2, 2]
Use a two-pointer (read/write) approach in O(n) time.`,
    hints: [
      'A write pointer tracks where the next kept element goes.',
      'Only copy nums[read] to nums[write] when nums[read] != val.',
    ],
    solution: `fn remove_element(nums: &mut Vec<i32>, val: i32) -> usize {
    let mut write = 0usize;
    for read in 0..nums.len() {
        if nums[read] != val {
            nums[write] = nums[read];
            write += 1;
        }
    }
    write
}

fn main() {
    let mut v = vec![3, 2, 2, 3];
    let k = remove_element(&mut v, 3);
    assert_eq!(k, 2);
    let mut sorted = v[..k].to_vec();
    sorted.sort();
    assert_eq!(sorted, vec![2, 2]);
    let mut v2 = vec![0, 1, 2, 2, 3, 0, 4, 2];
    let k2 = remove_element(&mut v2, 2);
    assert_eq!(k2, 5);
    let mut v3: Vec<i32> = vec![];
    assert_eq!(remove_element(&mut v3, 1), 0);
    println!("ok");
}`,
    starter: `fn remove_element(nums: &mut Vec<i32>, val: i32) -> usize {
    // TODO
    todo!()
}

fn main() {
    let mut v = vec![3, 2, 2, 3];
    let k = remove_element(&mut v, 3);
    assert_eq!(k, 2);
    println!("ok");
}`,
    tags: ['two-pointers', 'array', 'in-place'],
  },
  {
    id: 'ds-ch02-c-008',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Is Subsequence',
    prompt: `Implement:

    fn is_subsequence(s: &str, t: &str) -> bool

Return true if s is a subsequence of t: every character of s appears in t
in the same order (not necessarily contiguous).
Example: s="ace", t="abcde" -> true
Example: s="aec", t="abcde" -> false
Use two pointers advancing through s and t independently. O(|t|) time.`,
    hints: [
      'Walk t with one pointer; advance the s pointer only when characters match.',
      'If the s pointer reaches len(s), all characters were found in order.',
    ],
    solution: `fn is_subsequence(s: &str, t: &str) -> bool {
    let sb: Vec<char> = s.chars().collect();
    let tb: Vec<char> = t.chars().collect();
    let (mut i, mut j) = (0usize, 0usize);
    while i < sb.len() && j < tb.len() {
        if sb[i] == tb[j] { i += 1; }
        j += 1;
    }
    i == sb.len()
}

fn main() {
    assert!(is_subsequence("ace", "abcde"));
    assert!(!is_subsequence("aec", "abcde"));
    assert!(is_subsequence("", "anything"));
    assert!(is_subsequence("abc", "abc"));
    assert!(!is_subsequence("axc", "ahbgdc"));
    assert!(is_subsequence("b", "abc"));
    println!("ok");
}`,
    starter: `fn is_subsequence(s: &str, t: &str) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert!(is_subsequence("ace", "abcde"));
    assert!(!is_subsequence("aec", "abcde"));
    println!("ok");
}`,
    tags: ['two-pointers', 'string', 'greedy'],
  },
  {
    id: 'ds-ch02-c-009',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Merge Two Sorted Arrays',
    prompt: `Implement:

    fn merge_sorted_inplace(a: &mut Vec<i32>, m: usize, b: &[i32])

Merge sorted slice b (length n) into vector a whose first m elements are sorted.
Resize a to m+n and fill it in non-decreasing order without using extra space.
Example: a=[1,3,5], m=3, b=[2,4,6] -> a=[1,2,3,4,5,6]
Merge from the back to avoid overwriting elements not yet consumed.`,
    hints: [
      'Use three pointers: i starting at m-1, j at n-1, k at m+n-1.',
      'Place the larger of a[i] and b[j] at a[k] and move that pointer left.',
      'Copy remaining b elements if j reaches -1 before i.',
    ],
    solution: `fn merge_sorted_inplace(a: &mut Vec<i32>, m: usize, b: &[i32]) {
    let n = b.len();
    a.resize(m + n, 0);
    let (mut i, mut j, mut k) = (m as isize - 1, n as isize - 1, (m + n) as isize - 1);
    while i >= 0 && j >= 0 {
        if a[i as usize] > b[j as usize] {
            a[k as usize] = a[i as usize];
            i -= 1;
        } else {
            a[k as usize] = b[j as usize];
            j -= 1;
        }
        k -= 1;
    }
    while j >= 0 {
        a[k as usize] = b[j as usize];
        j -= 1;
        k -= 1;
    }
}

fn main() {
    let mut a = vec![1, 3, 5];
    merge_sorted_inplace(&mut a, 3, &[2, 4, 6]);
    assert_eq!(a, vec![1, 2, 3, 4, 5, 6]);
    let mut b = vec![1];
    merge_sorted_inplace(&mut b, 1, &[]);
    assert_eq!(b, vec![1]);
    let mut c: Vec<i32> = vec![];
    merge_sorted_inplace(&mut c, 0, &[1]);
    assert_eq!(c, vec![1]);
    let mut d = vec![2, 5, 7];
    merge_sorted_inplace(&mut d, 3, &[1, 3]);
    assert_eq!(d, vec![1, 2, 3, 5, 7]);
    println!("ok");
}`,
    starter: `fn merge_sorted_inplace(a: &mut Vec<i32>, m: usize, b: &[i32]) {
    // TODO
    todo!()
}

fn main() {
    let mut a = vec![1, 3, 5];
    merge_sorted_inplace(&mut a, 3, &[2, 4, 6]);
    assert_eq!(a, vec![1, 2, 3, 4, 5, 6]);
    println!("ok");
}`,
    tags: ['two-pointers', 'array', 'sorted', 'merge'],
  },
  {
    id: 'ds-ch02-c-010',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Pairs With Given Sum',
    prompt: `Implement:

    fn count_pairs_with_sum(nums: &[i32], target: i32) -> usize

Given a sorted array nums, count the number of index pairs (lo, hi) with lo < hi
such that nums[lo] + nums[hi] == target.
Example: nums=[1, 2, 3, 4, 5, 6], target=7 -> 3 (pairs: (1,6),(2,5),(3,4))
Use two pointers from both ends. O(n) time.`,
    hints: [
      'When you find a matching pair, increment count then move both pointers inward.',
      'If sum < target move lo right; if sum > target move hi left.',
    ],
    solution: `fn count_pairs_with_sum(nums: &[i32], target: i32) -> usize {
    let mut count = 0usize;
    let (mut lo, mut hi) = (0usize, nums.len().saturating_sub(1));
    while lo < hi {
        let s = nums[lo] + nums[hi];
        if s == target {
            count += 1;
            lo += 1;
            hi -= 1;
        } else if s < target {
            lo += 1;
        } else {
            hi -= 1;
        }
    }
    count
}

fn main() {
    assert_eq!(count_pairs_with_sum(&[1, 2, 3, 4, 5, 6], 7), 3);
    assert_eq!(count_pairs_with_sum(&[1, 3, 5, 7], 8), 2);
    assert_eq!(count_pairs_with_sum(&[0, 0], 0), 1);
    assert_eq!(count_pairs_with_sum(&[1, 2, 3], 10), 0);
    println!("ok");
}`,
    starter: `fn count_pairs_with_sum(nums: &[i32], target: i32) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(count_pairs_with_sum(&[1, 2, 3, 4, 5, 6], 7), 3);
    println!("ok");
}`,
    tags: ['two-pointers', 'array', 'sorted', 'two-sum'],
  },
  {
    id: 'ds-ch02-c-011',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Container With Most Water',
    prompt: `Implement:

    fn container_most_water(heights: &[i32]) -> i32

Given an array where heights[i] is the height of the i-th vertical line,
find two lines that together with the x-axis form a container holding the most water.
Return the maximum water volume. Volume = min(heights[lo], heights[hi]) * (hi - lo).
Example: [1,8,6,2,5,4,8,3,7] -> 49
Use two pointers. Always move the pointer at the shorter line inward.`,
    hints: [
      'Moving the taller pointer can only decrease the width and can never increase the height cap.',
      'Moving the shorter pointer is the only chance to find a taller boundary.',
    ],
    solution: `fn container_most_water(heights: &[i32]) -> i32 {
    let (mut lo, mut hi) = (0usize, heights.len().saturating_sub(1));
    let mut best = 0i32;
    while lo < hi {
        let water = heights[lo].min(heights[hi]) * (hi - lo) as i32;
        best = best.max(water);
        if heights[lo] < heights[hi] { lo += 1; }
        else { hi -= 1; }
    }
    best
}

fn brute(heights: &[i32]) -> i32 {
    let mut best = 0i32;
    for i in 0..heights.len() {
        for j in (i+1)..heights.len() {
            let w = heights[i].min(heights[j]) * (j - i) as i32;
            best = best.max(w);
        }
    }
    best
}

fn main() {
    let cases: &[&[i32]] = &[
        &[1, 8, 6, 2, 5, 4, 8, 3, 7],
        &[1, 1],
        &[4, 3, 2, 1, 4],
        &[1, 2, 1],
        &[2, 3, 4, 5, 18, 17, 6],
    ];
    for c in cases {
        assert_eq!(container_most_water(c), brute(c));
    }
    assert_eq!(container_most_water(&[1, 8, 6, 2, 5, 4, 8, 3, 7]), 49);
    println!("ok");
}`,
    starter: `fn container_most_water(heights: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(container_most_water(&[1, 8, 6, 2, 5, 4, 8, 3, 7]), 49);
    println!("ok");
}`,
    tags: ['two-pointers', 'array', 'greedy'],
  },
  {
    id: 'ds-ch02-c-012',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Three Sum to Zero',
    prompt: `Implement:

    fn three_sum(nums: &mut Vec<i32>) -> Vec<Vec<i32>>

Find all unique triplets in nums that sum to zero. Sort nums first.
Return a vector of triplets in sorted order with no duplicate triplets.
Example: [-1, 0, 1, 2, -1, -4] -> [[-1, -1, 2], [-1, 0, 1]]
For each fixed outer element, use two pointers on the remaining sorted subarray.
Skip duplicate values to avoid repeating triplets.`,
    hints: [
      'Sort the array first; iterate i from 0 to n-3 as the anchor.',
      'Skip nums[i] == nums[i-1] to avoid duplicate anchors.',
      'After finding a valid triple, skip duplicates at lo and hi before moving both inward.',
    ],
    solution: `fn three_sum(nums: &mut Vec<i32>) -> Vec<Vec<i32>> {
    nums.sort();
    let n = nums.len();
    let mut result: Vec<Vec<i32>> = Vec::new();
    for i in 0..n.saturating_sub(2) {
        if i > 0 && nums[i] == nums[i-1] { continue; }
        let (mut lo, mut hi) = (i + 1, n - 1);
        while lo < hi {
            let s = nums[i] + nums[lo] + nums[hi];
            if s == 0 {
                result.push(vec![nums[i], nums[lo], nums[hi]]);
                while lo < hi && nums[lo] == nums[lo+1] { lo += 1; }
                while lo < hi && nums[hi] == nums[hi-1] { hi -= 1; }
                lo += 1;
                hi -= 1;
            } else if s < 0 { lo += 1; }
            else { hi -= 1; }
        }
    }
    result
}

fn brute_three_sum(nums: &[i32]) -> Vec<Vec<i32>> {
    let n = nums.len();
    let mut set = std::collections::BTreeMap::new();
    for i in 0..n {
        for j in (i+1)..n {
            for k in (j+1)..n {
                if nums[i] + nums[j] + nums[k] == 0 {
                    let mut t = vec![nums[i], nums[j], nums[k]];
                    t.sort();
                    set.insert(t.clone(), t);
                }
            }
        }
    }
    let mut v: Vec<Vec<i32>> = set.into_values().collect();
    v.sort();
    v
}

fn main() {
    let inputs: &[&[i32]] = &[
        &[-1, 0, 1, 2, -1, -4],
        &[0, 1, 1],
        &[0, 0, 0],
        &[-2, 0, 0, 2, 2],
        &[-4, -1, -1, 0, 1, 2],
    ];
    for inp in inputs {
        let mut v = inp.to_vec();
        let mut got = three_sum(&mut v);
        got.sort();
        let mut exp = brute_three_sum(inp);
        exp.sort();
        assert_eq!(got, exp);
    }
    println!("ok");
}`,
    starter: `fn three_sum(nums: &mut Vec<i32>) -> Vec<Vec<i32>> {
    // TODO
    todo!()
}

fn main() {
    let mut v = vec![-1, 0, 1, 2, -1, -4];
    let mut result = three_sum(&mut v);
    result.sort();
    assert_eq!(result, vec![vec![-1, -1, 2], vec![-1, 0, 1]]);
    println!("ok");
}`,
    tags: ['two-pointers', 'array', 'sorting', 'three-sum'],
  },
  {
    id: 'ds-ch02-c-013',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Dutch National Flag Sort',
    prompt: `Implement:

    fn dutch_flag(nums: &mut Vec<i32>)

Sort an array containing only the values 0, 1, and 2 in place in one pass.
Example: [2, 0, 2, 1, 1, 0] -> [0, 0, 1, 1, 2, 2]
Use three pointers: lo (boundary of 0s), mid (current), hi (boundary of 2s).
Elements in [lo..mid] are 1s; below lo are 0s; above hi are 2s.
Do not use sort() or count sorting.`,
    hints: [
      'When nums[mid]==0, swap with lo and advance both lo and mid.',
      'When nums[mid]==1, just advance mid.',
      'When nums[mid]==2, swap with hi and decrement hi only (mid stays).',
    ],
    solution: `fn dutch_flag(nums: &mut Vec<i32>) {
    let (mut lo, mut mid, mut hi) = (0usize, 0usize, nums.len().saturating_sub(1));
    let n = nums.len();
    if n == 0 { return; }
    while mid <= hi {
        match nums[mid] {
            0 => { nums.swap(lo, mid); lo += 1; mid += 1; }
            1 => { mid += 1; }
            _ => {
                nums.swap(mid, hi);
                if hi == 0 { break; }
                hi -= 1;
            }
        }
    }
}

fn main() {
    let mut v = vec![2, 0, 2, 1, 1, 0];
    dutch_flag(&mut v);
    assert_eq!(v, vec![0, 0, 1, 1, 2, 2]);
    let mut v2 = vec![2, 0, 1];
    dutch_flag(&mut v2);
    assert_eq!(v2, vec![0, 1, 2]);
    let mut v3 = vec![0];
    dutch_flag(&mut v3);
    assert_eq!(v3, vec![0]);
    let mut v4: Vec<i32> = vec![];
    dutch_flag(&mut v4);
    assert_eq!(v4, Vec::<i32>::new());
    let mut v5 = vec![1, 0, 2, 1, 0];
    dutch_flag(&mut v5);
    assert_eq!(v5, vec![0, 0, 1, 1, 2]);
    println!("ok");
}`,
    starter: `fn dutch_flag(nums: &mut Vec<i32>) {
    // TODO
    todo!()
}

fn main() {
    let mut v = vec![2, 0, 2, 1, 1, 0];
    dutch_flag(&mut v);
    assert_eq!(v, vec![0, 0, 1, 1, 2, 2]);
    println!("ok");
}`,
    tags: ['two-pointers', 'array', 'sorting', 'dutch-flag'],
  },
  {
    id: 'ds-ch02-c-014',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Three Sum Closest',
    prompt: `Implement:

    fn three_sum_closest(nums: &mut Vec<i32>, target: i32) -> i32

Sort nums then find the triplet whose sum is closest to target. Return that sum.
If two sums are equally close, return either. Assume at least 3 elements.
Example: nums=[-1, 2, 1, -4], target=1 -> 2 (triplet [-1,2,1] sums to 2)
Use the same anchor + two-pointer pattern as three-sum.`,
    hints: [
      'Track the closest sum seen so far; update it when you find a nearer one.',
      'If the current sum equals the target, return immediately.',
    ],
    solution: `fn three_sum_closest(nums: &mut Vec<i32>, target: i32) -> i32 {
    nums.sort();
    let n = nums.len();
    let mut closest = nums[0] + nums[1] + nums[2];
    for i in 0..n.saturating_sub(2) {
        let (mut lo, mut hi) = (i + 1, n - 1);
        while lo < hi {
            let s = nums[i] + nums[lo] + nums[hi];
            if (s - target).abs() < (closest - target).abs() { closest = s; }
            if s < target { lo += 1; }
            else if s > target { hi -= 1; }
            else { return s; }
        }
    }
    closest
}

fn brute_closest(nums: &[i32], target: i32) -> i32 {
    let n = nums.len();
    let mut best = nums[0] + nums[1] + nums[2];
    for i in 0..n {
        for j in (i+1)..n {
            for k in (j+1)..n {
                let s = nums[i] + nums[j] + nums[k];
                if (s - target).abs() < (best - target).abs() { best = s; }
            }
        }
    }
    best
}

fn main() {
    let cases: &[(&[i32], i32)] = &[
        (&[-1, 2, 1, -4], 1),
        (&[0, 0, 0], 1),
        (&[1, 1, 1, 0], -100),
        (&[4, 0, 5, -5, 3, 3, 0, -4, -5], -2),
    ];
    for (arr, t) in cases {
        let mut v = arr.to_vec();
        assert_eq!(three_sum_closest(&mut v, *t), brute_closest(arr, *t));
    }
    let mut v = vec![-1, 2, 1, -4];
    assert_eq!(three_sum_closest(&mut v, 1), 2);
    println!("ok");
}`,
    starter: `fn three_sum_closest(nums: &mut Vec<i32>, target: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    let mut v = vec![-1, 2, 1, -4];
    assert_eq!(three_sum_closest(&mut v, 1), 2);
    println!("ok");
}`,
    tags: ['two-pointers', 'array', 'sorting', 'three-sum'],
  },
  {
    id: 'ds-ch02-c-015',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Partition Array by Pivot',
    prompt: `Implement:

    fn partition_by_predicate(nums: &mut Vec<i32>, pivot: i32) -> usize

Rearrange nums in place so all elements strictly less than pivot come first,
followed by all elements >= pivot. Return the boundary index (count of elements < pivot).
Element order within each group does not need to be preserved.
Example: nums=[3,1,4,1,5,9,2,6], pivot=5 -> boundary=4, first 4 are all < 5`,
    hints: [
      'Use lo pointing to the next slot for a small element, hi scanning from the end.',
      'Swap nums[lo] and nums[hi] when nums[lo] >= pivot, then decrement hi.',
    ],
    solution: `fn partition_by_predicate(nums: &mut Vec<i32>, pivot: i32) -> usize {
    let (mut lo, mut hi) = (0usize, nums.len());
    while lo < hi {
        if nums[lo] < pivot { lo += 1; }
        else {
            hi -= 1;
            nums.swap(lo, hi);
        }
    }
    lo
}

fn brute_partition(nums: &[i32], pivot: i32) -> usize {
    nums.iter().filter(|&&x| x < pivot).count()
}

fn main() {
    let cases: &[(&[i32], i32)] = &[
        (&[3, 1, 4, 1, 5, 9, 2, 6], 5),
        (&[1, 2, 3, 4, 5], 3),
        (&[5, 4, 3, 2, 1], 3),
        (&[], 0),
        (&[7], 7),
    ];
    for (arr, p) in cases {
        let mut v = arr.to_vec();
        let boundary = partition_by_predicate(&mut v, *p);
        let expected = brute_partition(arr, *p);
        assert_eq!(boundary, expected);
        for i in 0..boundary { assert!(v[i] < *p); }
        for i in boundary..v.len() { assert!(v[i] >= *p); }
    }
    println!("ok");
}`,
    starter: `fn partition_by_predicate(nums: &mut Vec<i32>, pivot: i32) -> usize {
    // TODO
    todo!()
}

fn main() {
    let mut v = vec![3, 1, 4, 1, 5, 9, 2, 6];
    let b = partition_by_predicate(&mut v, 5);
    assert_eq!(b, 4);
    println!("ok");
}`,
    tags: ['two-pointers', 'array', 'partition', 'in-place'],
  },
  {
    id: 'ds-ch02-c-016',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Remove Duplicates Allowing K Copies',
    prompt: `Implement:

    fn dedup_sorted_k(nums: &mut Vec<i32>, k: usize) -> usize

Given a sorted array and integer k, remove in place so each unique element appears
at most k times. Return the count of kept elements.
Example: nums=[1,1,1,2,2,3], k=2 -> 5, nums[..5]==[1,1,2,2,3]
Generalizes the classic dedup: compare nums[read] with nums[write-k].
Constraint: if len <= k, keep everything.`,
    hints: [
      'Start the write pointer at k (the first k elements are always kept).',
      'For each read position beyond k, copy only if nums[read] != nums[write-k].',
    ],
    solution: `fn dedup_sorted_k(nums: &mut Vec<i32>, k: usize) -> usize {
    if nums.len() <= k { return nums.len(); }
    let mut write = k;
    for read in k..nums.len() {
        if nums[read] != nums[write - k] {
            nums[write] = nums[read];
            write += 1;
        }
    }
    write
}

fn main() {
    let mut v = vec![1, 1, 1, 2, 2, 3];
    let k = dedup_sorted_k(&mut v, 2);
    assert_eq!(k, 5);
    assert_eq!(&v[..k], &[1, 1, 2, 2, 3]);
    let mut v2 = vec![1, 1, 1, 2, 2, 2, 3];
    let k2 = dedup_sorted_k(&mut v2, 2);
    assert_eq!(k2, 5);
    assert_eq!(&v2[..k2], &[1, 1, 2, 2, 3]);
    let mut v3: Vec<i32> = vec![];
    assert_eq!(dedup_sorted_k(&mut v3, 2), 0);
    let mut v4 = vec![1];
    assert_eq!(dedup_sorted_k(&mut v4, 2), 1);
    println!("ok");
}`,
    starter: `fn dedup_sorted_k(nums: &mut Vec<i32>, k: usize) -> usize {
    // TODO
    todo!()
}

fn main() {
    let mut v = vec![1, 1, 1, 2, 2, 3];
    let k = dedup_sorted_k(&mut v, 2);
    assert_eq!(k, 5);
    println!("ok");
}`,
    tags: ['two-pointers', 'array', 'in-place', 'sorted'],
  },
  {
    id: 'ds-ch02-c-017',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Longest Subarray With Sum At Most K',
    prompt: `Implement:

    fn longest_subarray_sum_at_most(nums: &[i32], target: i32) -> usize

Given an array of non-negative integers and a target, find the length of the
longest contiguous subarray whose sum is <= target.
Example: nums=[2,1,5,1,3,2], target=7 -> 4 (subarray [2,1,1,3] or [1,5,1])
Use a sliding window with two pointers. O(n) time.`,
    hints: [
      'Expand hi; if the window sum exceeds target, shrink from lo until it fits again.',
      'Track the maximum window length seen after each valid state.',
    ],
    solution: `fn longest_subarray_sum_at_most(nums: &[i32], target: i32) -> usize {
    let mut best = 0usize;
    let mut sum = 0i64;
    let t = target as i64;
    let mut lo = 0usize;
    for hi in 0..nums.len() {
        sum += nums[hi] as i64;
        while sum > t {
            sum -= nums[lo] as i64;
            lo += 1;
        }
        best = best.max(hi + 1 - lo);
    }
    best
}

fn brute(nums: &[i32], target: i64) -> usize {
    let mut best = 0usize;
    for i in 0..nums.len() {
        let mut s = 0i64;
        for j in i..nums.len() {
            s += nums[j] as i64;
            if s <= target { best = best.max(j - i + 1); }
            else { break; }
        }
    }
    best
}

fn main() {
    let cases: &[(&[i32], i32)] = &[
        (&[2, 1, 5, 1, 3, 2], 7),
        (&[1, 1, 1, 1, 1], 3),
        (&[3, 1, 2, 4, 2, 1, 1, 5], 8),
        (&[], 10),
        (&[1, 2, 3], 6),
    ];
    for (arr, t) in cases {
        assert_eq!(longest_subarray_sum_at_most(arr, *t), brute(arr, *t as i64));
    }
    println!("ok");
}`,
    starter: `fn longest_subarray_sum_at_most(nums: &[i32], target: i32) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(longest_subarray_sum_at_most(&[2, 1, 5, 1, 3, 2], 7), 4);
    println!("ok");
}`,
    tags: ['two-pointers', 'sliding-window', 'array'],
  },
  {
    id: 'ds-ch02-c-018',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Reverse a List of Words',
    prompt: `Implement:

    fn reverse_words_in_place(words: &mut Vec<String>)

Reverse the order of words in a Vec<String> using two pointers.
Example: ["the", "sky", "is", "blue"] -> ["blue", "is", "sky", "the"]
Operate in place using Vec::swap. O(n) time, O(1) extra space.`,
    hints: [
      'This is the same as reversing a Vec<i32> but the elements are Strings.',
      'Use lo=0 and hi=len-1 moving inward, swapping at each step.',
    ],
    solution: `fn reverse_words_in_place(words: &mut Vec<String>) {
    let n = words.len();
    let (mut lo, mut hi) = (0usize, n.saturating_sub(1));
    while lo < hi {
        words.swap(lo, hi);
        lo += 1;
        hi -= 1;
    }
}

fn main() {
    let mut v: Vec<String> = vec!["the".into(), "sky".into(), "is".into(), "blue".into()];
    reverse_words_in_place(&mut v);
    assert_eq!(v, vec!["blue", "is", "sky", "the"]);
    let mut v2: Vec<String> = vec!["hello".into()];
    reverse_words_in_place(&mut v2);
    assert_eq!(v2, vec!["hello"]);
    let mut v3: Vec<String> = vec![];
    reverse_words_in_place(&mut v3);
    assert_eq!(v3, Vec::<String>::new());
    let mut v4: Vec<String> = vec!["a".into(), "b".into()];
    reverse_words_in_place(&mut v4);
    assert_eq!(v4, vec!["b", "a"]);
    println!("ok");
}`,
    starter: `fn reverse_words_in_place(words: &mut Vec<String>) {
    // TODO
    todo!()
}

fn main() {
    let mut v: Vec<String> = vec!["the".into(), "sky".into(), "is".into(), "blue".into()];
    reverse_words_in_place(&mut v);
    assert_eq!(v, vec!["blue", "is", "sky", "the"]);
    println!("ok");
}`,
    tags: ['two-pointers', 'string', 'in-place'],
  },
  {
    id: 'ds-ch02-c-019',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Minimum Subarray With Sum At Least K',
    prompt: `Implement:

    fn min_window_sum_at_least(nums: &[i32], target: i32) -> usize

Given an array of positive integers and a target, return the minimum length of a
contiguous subarray whose sum >= target. Return 0 if no such subarray exists.
Example: nums=[2,3,1,2,4,3], target=7 -> 2 (subarray [4,3])
Use a sliding window. Shrink from the left as long as the sum remains >= target.`,
    hints: [
      'Expand the right pointer; when sum >= target shrink from the left and record the window length.',
      'Keep shrinking as long as the sum stays at or above the target.',
    ],
    solution: `fn min_window_sum_at_least(nums: &[i32], target: i32) -> usize {
    let mut best = usize::MAX;
    let mut sum = 0i64;
    let t = target as i64;
    let mut lo = 0usize;
    for hi in 0..nums.len() {
        sum += nums[hi] as i64;
        while sum >= t {
            best = best.min(hi - lo + 1);
            sum -= nums[lo] as i64;
            lo += 1;
        }
    }
    if best == usize::MAX { 0 } else { best }
}

fn brute(nums: &[i32], target: i64) -> usize {
    let mut best = usize::MAX;
    for i in 0..nums.len() {
        let mut s = 0i64;
        for j in i..nums.len() {
            s += nums[j] as i64;
            if s >= target {
                best = best.min(j - i + 1);
                break;
            }
        }
    }
    if best == usize::MAX { 0 } else { best }
}

fn main() {
    let cases: &[(&[i32], i32)] = &[
        (&[2, 3, 1, 2, 4, 3], 7),
        (&[1, 4, 4], 4),
        (&[1, 1, 1, 1, 1, 1, 1, 1], 11),
        (&[5], 5),
        (&[], 1),
    ];
    for (arr, t) in cases {
        assert_eq!(min_window_sum_at_least(arr, *t), brute(arr, *t as i64));
    }
    println!("ok");
}`,
    starter: `fn min_window_sum_at_least(nums: &[i32], target: i32) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(min_window_sum_at_least(&[2, 3, 1, 2, 4, 3], 7), 2);
    println!("ok");
}`,
    tags: ['two-pointers', 'sliding-window', 'array'],
  },
  {
    id: 'ds-ch02-c-020',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Four Sum',
    prompt: `Implement:

    fn four_sum(nums: &mut Vec<i32>, target: i64) -> Vec<Vec<i32>>

Find all unique quadruplets in nums that sum to target. Sort nums first.
Return distinct quadruplets in sorted order with no duplicates.
Example: nums=[1,0,-1,0,-2,2], target=0 -> [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
Fix two outer indices and use two pointers on the inner sorted subarray.
Skip duplicate values at each pointer to avoid repeated quadruplets.`,
    hints: [
      'Outer loop i, inner loop j, then two-pointer lo/hi for the remaining pair.',
      'Skip i when nums[i]==nums[i-1] and skip j when nums[j]==nums[j-1] (for j>i+1).',
      'Use i64 arithmetic to avoid overflow when summing four i32 values.',
    ],
    solution: `fn four_sum(nums: &mut Vec<i32>, target: i64) -> Vec<Vec<i32>> {
    nums.sort();
    let n = nums.len();
    let mut result: Vec<Vec<i32>> = Vec::new();
    for i in 0..n.saturating_sub(3) {
        if i > 0 && nums[i] == nums[i-1] { continue; }
        for j in (i+1)..n.saturating_sub(2) {
            if j > i + 1 && nums[j] == nums[j-1] { continue; }
            let (mut lo, mut hi) = (j + 1, n - 1);
            while lo < hi {
                let s = nums[i] as i64 + nums[j] as i64 + nums[lo] as i64 + nums[hi] as i64;
                if s == target {
                    result.push(vec![nums[i], nums[j], nums[lo], nums[hi]]);
                    while lo < hi && nums[lo] == nums[lo+1] { lo += 1; }
                    while lo < hi && nums[hi] == nums[hi-1] { hi -= 1; }
                    lo += 1;
                    hi -= 1;
                } else if s < target { lo += 1; }
                else { hi -= 1; }
            }
        }
    }
    result
}

fn brute_four_sum(nums: &[i32], target: i64) -> Vec<Vec<i32>> {
    let n = nums.len();
    let mut set = std::collections::BTreeMap::new();
    for i in 0..n {
        for j in (i+1)..n {
            for k in (j+1)..n {
                for l in (k+1)..n {
                    let s = nums[i] as i64 + nums[j] as i64 + nums[k] as i64 + nums[l] as i64;
                    if s == target {
                        let mut t = vec![nums[i], nums[j], nums[k], nums[l]];
                        t.sort();
                        set.insert(t.clone(), t);
                    }
                }
            }
        }
    }
    let mut v: Vec<Vec<i32>> = set.into_values().collect();
    v.sort();
    v
}

fn main() {
    let cases: &[(&[i32], i64)] = &[
        (&[1, 0, -1, 0, -2, 2], 0),
        (&[2, 2, 2, 2, 2], 8),
        (&[-3, -2, -1, 0, 0, 1, 2, 3], 0),
    ];
    for (arr, t) in cases {
        let mut v = arr.to_vec();
        let mut got = four_sum(&mut v, *t);
        got.sort();
        let mut exp = brute_four_sum(arr, *t);
        exp.sort();
        assert_eq!(got, exp);
    }
    println!("ok");
}`,
    starter: `fn four_sum(nums: &mut Vec<i32>, target: i64) -> Vec<Vec<i32>> {
    // TODO
    todo!()
}

fn main() {
    let mut v = vec![1, 0, -1, 0, -2, 2];
    let mut result = four_sum(&mut v, 0);
    result.sort();
    assert_eq!(result.len(), 3);
    println!("ok");
}`,
    tags: ['two-pointers', 'array', 'sorting', 'four-sum'],
  },
  {
    id: 'ds-ch02-c-021',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Trapping Rain Water',
    prompt: `Implement:

    fn trap_rain_water(heights: &[i32]) -> i64

Given heights of bars, compute the total water trapped after rain.
Water on bar i = min(max_left, max_right) - heights[i], clamped to 0.
Example: [0,1,0,2,1,0,1,3,2,1,2,1] -> 6
Example: [4,2,0,3,2,5] -> 9
Use two pointers tracking the running max from each side. O(n) time, O(1) space.`,
    hints: [
      'Maintain left_max and right_max as you move the pointers inward.',
      'Whichever side is shorter determines the water level at that step.',
      'If heights[lo] < heights[hi], process lo side; else process hi side.',
    ],
    solution: `fn trap_rain_water(heights: &[i32]) -> i64 {
    let n = heights.len();
    if n < 3 { return 0; }
    let (mut lo, mut hi) = (0usize, n - 1);
    let (mut left_max, mut right_max) = (0i32, 0i32);
    let mut water = 0i64;
    while lo < hi {
        if heights[lo] < heights[hi] {
            if heights[lo] >= left_max { left_max = heights[lo]; }
            else { water += (left_max - heights[lo]) as i64; }
            lo += 1;
        } else {
            if heights[hi] >= right_max { right_max = heights[hi]; }
            else { water += (right_max - heights[hi]) as i64; }
            hi -= 1;
        }
    }
    water
}

fn brute_trap(heights: &[i32]) -> i64 {
    let n = heights.len();
    if n == 0 { return 0; }
    let mut water = 0i64;
    for i in 0..n {
        let left_max = heights[..=i].iter().copied().max().unwrap_or(0);
        let right_max = heights[i..].iter().copied().max().unwrap_or(0);
        water += (left_max.min(right_max) - heights[i]).max(0) as i64;
    }
    water
}

fn main() {
    let cases: &[&[i32]] = &[
        &[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
        &[4, 2, 0, 3, 2, 5],
        &[3, 0, 2, 0, 4],
        &[1, 0, 1],
        &[1, 2, 3],
        &[3, 2, 1],
        &[],
    ];
    for c in cases {
        assert_eq!(trap_rain_water(c), brute_trap(c));
    }
    println!("ok");
}`,
    starter: `fn trap_rain_water(heights: &[i32]) -> i64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(trap_rain_water(&[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]), 6);
    assert_eq!(trap_rain_water(&[4, 2, 0, 3, 2, 5]), 9);
    println!("ok");
}`,
    tags: ['two-pointers', 'array', 'hard', 'rain-water'],
  },
  {
    id: 'ds-ch02-c-022',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Rotate Array by K Steps',
    prompt: `Implement:

    fn rotate_array(nums: &mut Vec<i32>, k: usize)

Rotate nums to the right by k steps in place using the reverse trick.
Example: nums=[1,2,3,4,5,6,7], k=3 -> [5,6,7,1,2,3,4]
The reverse trick: reverse the whole array, reverse the first k elements, reverse the rest.
Handle k larger than n by taking k % n. Use only Vec::swap; no extra allocation.`,
    hints: [
      'A helper that reverses nums[lo..=hi] using two pointers will keep the code clean.',
      'After the three reverses, verify the result against right-rotation by k.',
    ],
    solution: `fn rotate_array(nums: &mut Vec<i32>, k: usize) {
    let n = nums.len();
    if n == 0 { return; }
    let k = k % n;
    if k == 0 { return; }
    let (mut lo, mut hi) = (0usize, n.saturating_sub(1));
    while lo < hi { nums.swap(lo, hi); lo += 1; hi -= 1; }
    let (mut lo, mut hi) = (0usize, k.saturating_sub(1));
    while lo < hi { nums.swap(lo, hi); lo += 1; hi -= 1; }
    let (mut lo, mut hi) = (k, n.saturating_sub(1));
    while lo < hi { nums.swap(lo, hi); lo += 1; hi -= 1; }
}

fn brute_rotate(nums: &[i32], k: usize) -> Vec<i32> {
    let n = nums.len();
    if n == 0 { return vec![]; }
    let k = k % n;
    let mut res = Vec::with_capacity(n);
    res.extend_from_slice(&nums[n-k..]);
    res.extend_from_slice(&nums[..n-k]);
    res
}

fn main() {
    let cases: &[(&[i32], usize)] = &[
        (&[1, 2, 3, 4, 5, 6, 7], 3),
        (&[-1, -100, 3, 99], 2),
        (&[1, 2], 1),
        (&[1], 5),
        (&[1, 2, 3], 0),
    ];
    for (arr, k) in cases {
        let mut v = arr.to_vec();
        rotate_array(&mut v, *k);
        assert_eq!(v, brute_rotate(arr, *k));
    }
    println!("ok");
}`,
    starter: `fn rotate_array(nums: &mut Vec<i32>, k: usize) {
    // TODO
    todo!()
}

fn main() {
    let mut v = vec![1, 2, 3, 4, 5, 6, 7];
    rotate_array(&mut v, 3);
    assert_eq!(v, vec![5, 6, 7, 1, 2, 3, 4]);
    println!("ok");
}`,
    tags: ['two-pointers', 'array', 'in-place', 'rotation'],
  },
  {
    id: 'ds-ch02-c-023',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Longest Mountain Subarray',
    prompt: `Implement:

    fn longest_mountain(nums: &[i32]) -> usize

A mountain subarray strictly increases to a single peak then strictly decreases.
Length must be at least 3. Find the length of the longest mountain subarray.
Return 0 if none exists.
Example: [2,1,4,7,3,2,5] -> 5 (subarray [1,4,7,3,2])
Use two pointers: once a peak is found, expand left and right to measure it.`,
    hints: [
      'A peak at index i satisfies nums[i-1] < nums[i] > nums[i+1].',
      'After measuring a mountain, jump i to just past the right foot to skip overlapping mountains.',
    ],
    solution: `fn longest_mountain(nums: &[i32]) -> usize {
    let n = nums.len();
    if n < 3 { return 0; }
    let mut best = 0usize;
    let mut i = 1usize;
    while i < n - 1 {
        if nums[i-1] < nums[i] && nums[i] > nums[i+1] {
            let mut lo = i - 1;
            while lo > 0 && nums[lo-1] < nums[lo] { lo -= 1; }
            let mut hi = i + 1;
            while hi < n - 1 && nums[hi] > nums[hi+1] { hi += 1; }
            best = best.max(hi - lo + 1);
            i = hi + 1;
        } else {
            i += 1;
        }
    }
    best
}

fn brute_mountain(nums: &[i32]) -> usize {
    let n = nums.len();
    let mut best = 0usize;
    for i in 1..(n.saturating_sub(1)) {
        if nums[i-1] < nums[i] && nums[i] > nums[i+1] {
            let mut lo = i;
            while lo > 0 && nums[lo-1] < nums[lo] { lo -= 1; }
            let mut hi = i;
            while hi < n-1 && nums[hi] > nums[hi+1] { hi += 1; }
            best = best.max(hi - lo + 1);
        }
    }
    best
}

fn main() {
    let cases: &[&[i32]] = &[
        &[2, 1, 4, 7, 3, 2, 5],
        &[2, 2, 2],
        &[0, 1, 2, 3, 4, 5],
        &[5, 4, 3, 2, 1, 0],
        &[0, 2, 0, 2, 0],
        &[1, 3, 2, 4, 1],
    ];
    for c in cases {
        assert_eq!(longest_mountain(c), brute_mountain(c), "{:?}", c);
    }
    println!("ok");
}`,
    starter: `fn longest_mountain(nums: &[i32]) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(longest_mountain(&[2, 1, 4, 7, 3, 2, 5]), 5);
    assert_eq!(longest_mountain(&[2, 2, 2]), 0);
    println!("ok");
}`,
    tags: ['two-pointers', 'array', 'mountain'],
  },
  {
    id: 'ds-ch02-c-024',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Sort Four Values With Two Passes',
    prompt: `Implement:

    fn two_pointer_sort_colors(nums: &mut Vec<i32>)

Sort an array containing only values 1, 2, 3, 4 in place using two two-pointer passes.
Pass 1: partition elements <= 2 to the front using the Dutch-flag boundary trick.
Pass 2: within the first half sort 1s before 2s; within the second half sort 3s before 4s.
Do not call nums.sort() or use counting sort.
Example: [3,1,4,2,1,3,4,2] -> [1,1,2,2,3,3,4,4]`,
    hints: [
      'First pass: lo starts at 0, hi at n; swap nums[mid] with nums[hi] when nums[mid]>2.',
      'Second pass on [0..boundary]: dutch-flag on 1 vs 2.',
      'Second pass on [boundary..n]: dutch-flag on 3 vs 4.',
    ],
    solution: `fn two_pointer_sort_colors(nums: &mut Vec<i32>) {
    let n = nums.len();
    if n == 0 { return; }
    let mut lo = 0usize;
    let mut hi = n;
    let mut mid = 0usize;
    while mid < hi {
        if nums[mid] <= 2 {
            nums.swap(lo, mid);
            lo += 1;
            mid += 1;
        } else {
            hi -= 1;
            nums.swap(mid, hi);
        }
    }
    let (mut x, mut y) = (0usize, lo);
    while x < y {
        if nums[x] == 1 { x += 1; }
        else {
            y -= 1;
            nums.swap(x, y);
        }
    }
    let (mut x, mut y) = (lo, n);
    while x < y {
        if nums[x] == 3 { x += 1; }
        else {
            y -= 1;
            nums.swap(x, y);
        }
    }
}

fn main() {
    let cases: &[&[i32]] = &[
        &[3, 1, 4, 2, 1, 3, 4, 2],
        &[4, 3, 2, 1],
        &[1, 1, 1, 1],
        &[4, 4, 4, 4],
        &[2, 3, 1, 4],
        &[],
    ];
    for c in cases {
        let mut v1 = c.to_vec();
        two_pointer_sort_colors(&mut v1);
        let mut v2 = c.to_vec();
        v2.sort();
        assert_eq!(v1, v2, "failed on {:?}", c);
    }
    println!("ok");
}`,
    starter: `fn two_pointer_sort_colors(nums: &mut Vec<i32>) {
    // TODO
    todo!()
}

fn main() {
    let mut v = vec![3, 1, 4, 2, 1, 3, 4, 2];
    two_pointer_sort_colors(&mut v);
    assert_eq!(v, vec![1, 1, 2, 2, 3, 3, 4, 4]);
    println!("ok");
}`,
    tags: ['two-pointers', 'array', 'sorting', 'partition'],
  },
  {
    id: 'ds-ch02-c-025',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Count Pairs With Difference At Most K',
    prompt: `Implement:

    fn pairs_with_diff_at_most(nums: &mut Vec<i32>, k: i32) -> usize

Sort nums then count the number of index pairs (i, j) with i < j
such that |nums[i] - nums[j]| <= k.
Example: nums=[3,1,4,1,5], k=2 -> 6 pairs
After sorting, for each hi use a left pointer lo to find the leftmost index
where nums[hi] - nums[lo] <= k. All indices in [lo..hi) form valid pairs with hi.`,
    hints: [
      'Sort first. For each hi, advance lo while nums[hi] - nums[lo] > k.',
      'The number of valid partners for hi is hi - lo.',
    ],
    solution: `fn pairs_with_diff_at_most(nums: &mut Vec<i32>, k: i32) -> usize {
    nums.sort();
    let n = nums.len();
    let mut count = 0usize;
    let mut lo = 0usize;
    for hi in 0..n {
        while nums[hi] - nums[lo] > k {
            lo += 1;
        }
        count += hi - lo;
    }
    count
}

fn brute_pairs(nums: &[i32], k: i32) -> usize {
    let mut count = 0usize;
    for i in 0..nums.len() {
        for j in (i+1)..nums.len() {
            if (nums[i] - nums[j]).abs() <= k { count += 1; }
        }
    }
    count
}

fn main() {
    let cases: &[(&[i32], i32)] = &[
        (&[3, 1, 4, 1, 5], 2),
        (&[1, 3, 5, 7], 2),
        (&[1, 2, 3, 4], 0),
        (&[10, 20, 30], 15),
    ];
    for (arr, k) in cases {
        let mut v = arr.to_vec();
        assert_eq!(pairs_with_diff_at_most(&mut v, *k), brute_pairs(arr, *k));
    }
    println!("ok");
}`,
    starter: `fn pairs_with_diff_at_most(nums: &mut Vec<i32>, k: i32) -> usize {
    // TODO
    todo!()
}

fn main() {
    let mut v = vec![3, 1, 4, 1, 5];
    assert_eq!(pairs_with_diff_at_most(&mut v, 2), 6);
    println!("ok");
}`,
    tags: ['two-pointers', 'array', 'sorting', 'counting'],
  },
  {
    id: 'ds-ch02-c-026',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Subarrays With Product Less Than K',
    prompt: `Implement:

    fn num_subarrays_with_product_less_than(nums: &[i32], k: i32) -> usize

Given an array of positive integers, count contiguous subarrays whose product is
strictly less than k.
Example: nums=[10,5,2,6], k=100 -> 8
Use a sliding window: expand hi, multiply in nums[hi]; while product >= k divide out nums[lo] and advance lo.
Each hi contributes (hi - lo + 1) new valid subarrays ending at hi.`,
    hints: [
      'When k <= 1 the answer is 0 since all values are positive and any single element >= 1.',
      'Use i64 for the product to avoid overflow before the division.',
    ],
    solution: `fn num_subarrays_with_product_less_than(nums: &[i32], k: i32) -> usize {
    if k <= 1 { return 0; }
    let mut count = 0usize;
    let mut product = 1i64;
    let k64 = k as i64;
    let mut lo = 0usize;
    for hi in 0..nums.len() {
        product *= nums[hi] as i64;
        while product >= k64 && lo <= hi {
            product /= nums[lo] as i64;
            lo += 1;
        }
        count += hi + 1 - lo;
    }
    count
}

fn brute_product(nums: &[i32], k: i32) -> usize {
    let k64 = k as i64;
    let mut count = 0usize;
    for i in 0..nums.len() {
        let mut p = 1i64;
        for j in i..nums.len() {
            p *= nums[j] as i64;
            if p < k64 { count += 1; }
            else { break; }
        }
    }
    count
}

fn main() {
    let cases: &[(&[i32], i32)] = &[
        (&[10, 5, 2, 6], 100),
        (&[1, 2, 3], 0),
        (&[1, 1, 1], 2),
        (&[10], 10),
        (&[10], 11),
    ];
    for (arr, k) in cases {
        assert_eq!(
            num_subarrays_with_product_less_than(arr, *k),
            brute_product(arr, *k),
            "k={} arr={:?}", k, arr
        );
    }
    println!("ok");
}`,
    starter: `fn num_subarrays_with_product_less_than(nums: &[i32], k: i32) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(num_subarrays_with_product_less_than(&[10, 5, 2, 6], 100), 8);
    println!("ok");
}`,
    tags: ['two-pointers', 'sliding-window', 'array', 'product'],
  },
  {
    id: 'ds-ch02-c-027',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Count Triplets With Sum Less Than Target',
    prompt: `Implement:

    fn three_sum_smaller(nums: &mut Vec<i32>, target: i32) -> usize

Count the number of index triplets (i, j, k) with i < j < k
such that nums[i] + nums[j] + nums[k] < target.
Example: nums=[-2,0,1,3], target=2 -> 2
Sort nums first. Fix i, then use two pointers lo=i+1, hi=n-1.
When the sum is already below target, all (hi - lo) partners at lo also qualify.`,
    hints: [
      'Sort the array; anchor i; set lo=i+1, hi=n-1.',
      'If nums[i]+nums[lo]+nums[hi] < target, then all hi-lo pairs with lo fixed also qualify.',
      'Add (hi - lo) to count and advance lo; otherwise decrement hi.',
    ],
    solution: `fn three_sum_smaller(nums: &mut Vec<i32>, target: i32) -> usize {
    nums.sort();
    let n = nums.len();
    let mut count = 0usize;
    for i in 0..n.saturating_sub(2) {
        let (mut lo, mut hi) = (i + 1, n - 1);
        while lo < hi {
            let s = nums[i] + nums[lo] + nums[hi];
            if s < target {
                count += hi - lo;
                lo += 1;
            } else {
                hi -= 1;
            }
        }
    }
    count
}

fn brute_smaller(nums: &[i32], target: i32) -> usize {
    let n = nums.len();
    let mut count = 0usize;
    for i in 0..n {
        for j in (i+1)..n {
            for k in (j+1)..n {
                if nums[i] + nums[j] + nums[k] < target { count += 1; }
            }
        }
    }
    count
}

fn main() {
    let cases: &[(&[i32], i32)] = &[
        (&[-2, 0, 1, 3], 2),
        (&[0, 0, 0], 0),
        (&[1, 1, -2], 1),
        (&[-1, 1, 2, 3, 4], 5),
        (&[3, 1, 0, -2], 4),
    ];
    for (arr, t) in cases {
        let mut v = arr.to_vec();
        assert_eq!(three_sum_smaller(&mut v, *t), brute_smaller(arr, *t));
    }
    println!("ok");
}`,
    starter: `fn three_sum_smaller(nums: &mut Vec<i32>, target: i32) -> usize {
    // TODO
    todo!()
}

fn main() {
    let mut v = vec![-2, 0, 1, 3];
    assert_eq!(three_sum_smaller(&mut v, 2), 2);
    println!("ok");
}`,
    tags: ['two-pointers', 'array', 'sorting', 'three-sum', 'counting'],
  },
  {
    id: 'ds-ch02-c-028',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Maximum Beauty of an Array',
    prompt: `Implement:

    fn two_pointer_max_beauty(nums: &mut Vec<i32>, k: i32) -> usize

You may change each nums[i] by any amount within [-k, k].
Find the maximum number of elements that can be made equal after these changes.
Equivalently, find the longest subarray of the sorted version where max - min <= 2*k.
Example: nums=[4,6,1,2], k=2 -> 3
Sort nums; slide a window where nums[hi] - nums[lo] <= 2*k; return the max window length.`,
    hints: [
      'Sort the array first; then use a sliding window.',
      'Advance lo while nums[hi] - nums[lo] > 2*k.',
      'Each hi position gives a window of size hi - lo + 1.',
    ],
    solution: `fn two_pointer_max_beauty(nums: &mut Vec<i32>, k: i32) -> usize {
    nums.sort();
    let (mut lo, mut best) = (0usize, 0usize);
    for hi in 0..nums.len() {
        while nums[hi] - nums[lo] > 2 * k {
            lo += 1;
        }
        best = best.max(hi - lo + 1);
    }
    best
}

fn max_score_removal(nums: &[i32]) -> i32 {
    let n = nums.len();
    if n < 2 { return 0; }
    let (mut lo, mut hi) = (0usize, n - 1);
    let mut score = 0i32;
    while lo < hi {
        score += nums[lo] + nums[hi];
        lo += 1;
        hi -= 1;
    }
    score
}

fn brute_max_score(nums: &[i32]) -> i32 {
    let n = nums.len();
    if n < 2 { return 0; }
    let pairs = n / 2;
    let mut s = 0i32;
    for i in 0..pairs { s += nums[i] + nums[n - 1 - i]; }
    s
}

fn main() {
    let mut b = vec![4, 6, 1, 2];
    assert_eq!(two_pointer_max_beauty(&mut b, 2), 3);
    let mut b2 = vec![1, 2, 3, 4, 5];
    assert_eq!(two_pointer_max_beauty(&mut b2, 1), 3);
    let v = vec![1, 2, 3, 4, 5, 6];
    assert_eq!(max_score_removal(&v), brute_max_score(&v));
    let v2 = vec![10, 20, 30, 40];
    assert_eq!(max_score_removal(&v2), brute_max_score(&v2));
    println!("ok");
}`,
    starter: `fn two_pointer_max_beauty(nums: &mut Vec<i32>, k: i32) -> usize {
    // TODO
    todo!()
}

fn main() {
    let mut v = vec![4, 6, 1, 2];
    assert_eq!(two_pointer_max_beauty(&mut v, 2), 3);
    println!("ok");
}`,
    tags: ['two-pointers', 'sliding-window', 'array', 'sorting'],
  },
  {
    id: 'ds-ch02-c-029',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Max Consecutive Ones With K Flips',
    prompt: `Implement:

    fn max_consecutive_ones_with_k_flips(nums: &[i32], k: i32) -> usize

Given a binary array (values 0 and 1) and integer k, find the maximum number of
consecutive 1s if you may flip at most k zeros to ones.
Example: nums=[1,1,1,0,0,0,1,1,1,1,0], k=2 -> 6
Use a sliding window. Track how many zeros are inside the window.
Shrink from the left whenever zeros exceeds k.`,
    hints: [
      'Count zeros as you expand hi; when zeros > k advance lo until a 0 is evicted.',
      'The window length hi+1-lo is a valid answer after each shrink.',
    ],
    solution: `fn max_consecutive_ones_with_k_flips(nums: &[i32], k: i32) -> usize {
    let mut zeros = 0i32;
    let mut best = 0usize;
    let mut lo = 0usize;
    for hi in 0..nums.len() {
        if nums[hi] == 0 { zeros += 1; }
        while zeros > k {
            if nums[lo] == 0 { zeros -= 1; }
            lo += 1;
        }
        if hi + 1 >= lo {
            best = best.max(hi + 1 - lo);
        }
    }
    best
}

fn brute_flips(nums: &[i32], k: i32) -> usize {
    let n = nums.len();
    let mut best = 0usize;
    for i in 0..n {
        let mut z = 0i32;
        for j in i..n {
            if nums[j] == 0 { z += 1; }
            if z <= k { best = best.max(j - i + 1); }
            else { break; }
        }
    }
    best
}

fn main() {
    let cases: &[(&[i32], i32)] = &[
        (&[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2),
        (&[0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3),
        (&[1, 1, 0, 1], 0),
        (&[0, 0, 0], 1),
        (&[1, 1, 1], 0),
    ];
    for (arr, k) in cases {
        assert_eq!(
            max_consecutive_ones_with_k_flips(arr, *k),
            brute_flips(arr, *k)
        );
    }
    println!("ok");
}`,
    starter: `fn max_consecutive_ones_with_k_flips(nums: &[i32], k: i32) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(max_consecutive_ones_with_k_flips(&[1,1,1,0,0,0,1,1,1,1,0], 2), 6);
    println!("ok");
}`,
    tags: ['two-pointers', 'sliding-window', 'binary-array', 'greedy'],
  },
  {
    id: 'ds-ch02-c-030',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Minimum Removals for Non-Decreasing Array',
    prompt: `Implement:

    fn minimum_operations_to_make_array_non_decreasing(nums: &[i32]) -> usize

Return the minimum number of elements to remove so the remaining elements form a
non-decreasing sequence. This equals n minus the length of the Longest Non-Decreasing
Subsequence (LIS with ties allowed).
Example: nums=[3,1,2,1,4] -> 2 (remove the two extra 1s or the 3)
Implement the O(n log n) patience-sort LIS algorithm using binary search (partition_point).`,
    hints: [
      'Maintain a tails array where tails[i] is the smallest tail of any non-decreasing subsequence of length i+1.',
      'For each element use partition_point to find where it belongs (first position with tails[pos] > x for strict, or <= x for non-decreasing).',
      'The answer is nums.len() minus tails.len() after processing all elements.',
    ],
    solution: `fn minimum_operations_to_make_array_non_decreasing(nums: &[i32]) -> usize {
    fn lis_length(nums: &[i32]) -> usize {
        let mut tails: Vec<i32> = Vec::new();
        for &x in nums {
            let pos = tails.partition_point(|&t| t <= x);
            if pos == tails.len() { tails.push(x); }
            else { tails[pos] = x; }
        }
        tails.len()
    }
    let lis = lis_length(nums);
    nums.len() - lis
}

fn brute_min_remove(nums: &[i32]) -> usize {
    fn lis_brute(nums: &[i32]) -> usize {
        let n = nums.len();
        let mut dp = vec![1usize; n];
        for i in 1..n {
            for j in 0..i {
                if nums[j] <= nums[i] { dp[i] = dp[i].max(dp[j] + 1); }
            }
        }
        *dp.iter().max().unwrap_or(&0)
    }
    let lis = lis_brute(nums);
    nums.len() - lis
}

fn main() {
    let cases: &[&[i32]] = &[
        &[3, 1, 2, 1, 4],
        &[1, 2, 3, 4, 5],
        &[5, 4, 3, 2, 1],
        &[1, 3, 2, 3, 1, 4],
        &[10, 9, 2, 5, 3, 7, 101, 18],
    ];
    for c in cases {
        assert_eq!(
            minimum_operations_to_make_array_non_decreasing(c),
            brute_min_remove(c)
        );
    }
    println!("ok");
}`,
    starter: `fn minimum_operations_to_make_array_non_decreasing(nums: &[i32]) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(minimum_operations_to_make_array_non_decreasing(&[3, 1, 2, 1, 4]), 2);
    assert_eq!(minimum_operations_to_make_array_non_decreasing(&[1, 2, 3, 4, 5]), 0);
    println!("ok");
}`,
    tags: ['two-pointers', 'array', 'binary-search', 'lis', 'hard'],
  },
]

export default problems
