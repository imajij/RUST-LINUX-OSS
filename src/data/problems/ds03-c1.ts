import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch03-c-001',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Max Sum Fixed Window',
    prompt: `Implement:

    fn max_window_sum(nums: &[i32], k: usize) -> i32

Return the maximum sum of any contiguous subarray of exactly length k.
Assume 1 <= k <= nums.len() and all elements are i32.
Example: nums = [2, 1, 5, 1, 3, 2], k = 3 -> 9  (subarray [5, 1, 3])`,
    hints: [
      'Compute the sum of the first k elements, then slide by adding the incoming element and subtracting the outgoing one.',
      'Keep a running maximum as you slide.',
    ],
    solution: `fn max_window_sum(nums: &[i32], k: usize) -> i32 {
    let mut sum: i32 = nums[..k].iter().sum();
    let mut best = sum;
    for i in k..nums.len() {
        sum += nums[i] - nums[i - k];
        best = best.max(sum);
    }
    best
}

fn main() {
    assert_eq!(max_window_sum(&[2, 1, 5, 1, 3, 2], 3), 9);
    assert_eq!(max_window_sum(&[1, 1, 1], 1), 1);
    assert_eq!(max_window_sum(&[4, 2, 1, 7, 8, 1, 2, 8, 1, 0], 3), 16);
    assert_eq!(max_window_sum(&[5], 1), 5);
    println!("ok");
}`,
    starter: `fn max_window_sum(nums: &[i32], k: usize) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(max_window_sum(&[2, 1, 5, 1, 3, 2], 3), 9);
    println!("ok");
}`,
    tags: ['sliding-window', 'array'],
  },
  {
    id: 'ds-ch03-c-002',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Min Sum Fixed Window',
    prompt: `Implement:

    fn min_window_sum(nums: &[i32], k: usize) -> i32

Return the minimum sum of any contiguous subarray of exactly length k.
Assume 1 <= k <= nums.len().
Example: nums = [2, 1, 5, 1, 3, 2], k = 3 -> 6  (subarray [2, 1, 3] sums to 6, but [1, 3, 2] also 6; check [2,1,5]=8,[1,5,1]=7,[5,1,3]=9,[1,3,2]=6 -> min is 6)`,
    hints: [
      'Use the same sliding technique as the max-sum version.',
      'Replace the max comparison with a min comparison.',
    ],
    solution: `fn min_window_sum(nums: &[i32], k: usize) -> i32 {
    let mut sum: i32 = nums[..k].iter().sum();
    let mut best = sum;
    for i in k..nums.len() {
        sum += nums[i] - nums[i - k];
        best = best.min(sum);
    }
    best
}

fn main() {
    assert_eq!(min_window_sum(&[2, 1, 5, 1, 3, 2], 3), 6);
    assert_eq!(min_window_sum(&[1, 1, 1], 1), 1);
    assert_eq!(min_window_sum(&[4, 2, 1, 7, 8, 1, 2, 8, 1, 0], 3), 7);
    assert_eq!(min_window_sum(&[5], 1), 5);
    println!("ok");
}`,
    starter: `fn min_window_sum(nums: &[i32], k: usize) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(min_window_sum(&[2, 1, 5, 1, 3, 2], 3), 6);
    println!("ok");
}`,
    tags: ['sliding-window', 'array'],
  },
  {
    id: 'ds-ch03-c-003',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Window Averages',
    prompt: `Implement:

    fn window_average(nums: &[i32], k: usize) -> Vec<f64>

Return a vector of the averages of every contiguous window of length k, in order.
The output has nums.len() - k + 1 elements.
Example: nums = [1, 3, 2, 6, -1, 4, 1, 8, 2], k = 5 -> [2.2, 2.8, 2.4, 3.6, 2.8]`,
    hints: [
      'Build the first window sum, push sum/k, then slide and push each new average.',
      'Cast integers to f64 before dividing.',
    ],
    solution: `fn window_average(nums: &[i32], k: usize) -> Vec<f64> {
    let mut sum: i32 = nums[..k].iter().sum();
    let mut result = vec![sum as f64 / k as f64];
    for i in k..nums.len() {
        sum += nums[i] - nums[i - k];
        result.push(sum as f64 / k as f64);
    }
    result
}

fn main() {
    let r = window_average(&[1, 3, 2, 6, -1, 4, 1, 8, 2], 5);
    assert_eq!(r.len(), 5);
    assert!((r[0] - 2.2).abs() < 1e-9);
    assert!((r[1] - 2.8).abs() < 1e-9);
    let r2 = window_average(&[3, 1, 2], 2);
    assert!((r2[0] - 2.0).abs() < 1e-9);
    assert!((r2[1] - 1.5).abs() < 1e-9);
    println!("ok");
}`,
    starter: `fn window_average(nums: &[i32], k: usize) -> Vec<f64> {
    // TODO
    todo!()
}

fn main() {
    let r = window_average(&[1, 3, 2, 6, -1, 4, 1, 8, 2], 5);
    assert_eq!(r.len(), 5);
    println!("ok");
}`,
    tags: ['sliding-window', 'array'],
  },
  {
    id: 'ds-ch03-c-004',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Max Ones In Window',
    prompt: `Implement:

    fn count_ones_window(nums: &[i32], k: usize) -> i32

Given a binary array (values are 0 or 1) and a window size k, return the maximum count of 1s
in any contiguous window of length k.
Example: nums = [1, 0, 0, 1, 1, 1, 0, 1], k = 4 -> 3`,
    hints: [
      'Count ones in the first window, then slide: add 1 if the new element is 1, subtract 1 if the leaving element is 1.',
      'Track the running maximum.',
    ],
    solution: `fn count_ones_window(nums: &[i32], k: usize) -> i32 {
    let mut count = nums[..k].iter().filter(|&&x| x == 1).count() as i32;
    let mut best = count;
    for i in k..nums.len() {
        if nums[i] == 1 { count += 1; }
        if nums[i - k] == 1 { count -= 1; }
        best = best.max(count);
    }
    best
}

fn main() {
    assert_eq!(count_ones_window(&[1, 0, 0, 1, 1, 1, 0, 1], 4), 3);
    assert_eq!(count_ones_window(&[0, 0, 0], 2), 0);
    assert_eq!(count_ones_window(&[1, 1, 1, 1], 3), 3);
    assert_eq!(count_ones_window(&[1], 1), 1);
    println!("ok");
}`,
    starter: `fn count_ones_window(nums: &[i32], k: usize) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(count_ones_window(&[1, 0, 0, 1, 1, 1, 0, 1], 4), 3);
    println!("ok");
}`,
    tags: ['sliding-window', 'array', 'binary-array'],
  },
  {
    id: 'ds-ch03-c-005',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'First Negative In Window',
    prompt: `Implement:

    fn first_negative_in_window(nums: &[i32], k: usize) -> Vec<i32>

For each window of size k (there are nums.len() - k + 1 windows), return the first negative number
in that window, or 0 if no negative exists.
Example: nums = [-8, 2, 3, -6, 10], k = 2 -> [-8, 0, -6, -6]`,
    hints: [
      'Use a VecDeque to keep indices of negative elements inside the current window.',
      'Pop the front when it falls outside the window; push the back index if the current element is negative.',
    ],
    solution: `fn first_negative_in_window(nums: &[i32], k: usize) -> Vec<i32> {
    use std::collections::VecDeque;
    let mut dq: VecDeque<usize> = VecDeque::new();
    let mut result = Vec::new();
    for i in 0..nums.len() {
        if i >= k {
            if dq.front() == Some(&(i - k)) {
                dq.pop_front();
            }
        }
        if nums[i] < 0 {
            dq.push_back(i);
        }
        if i + 1 >= k {
            if let Some(&idx) = dq.front() {
                result.push(nums[idx]);
            } else {
                result.push(0);
            }
        }
    }
    result
}

fn main() {
    assert_eq!(first_negative_in_window(&[-8, 2, 3, -6, 10], 2), vec![-8, 0, -6, -6]);
    assert_eq!(first_negative_in_window(&[1, 2, 3], 2), vec![0, 0]);
    assert_eq!(first_negative_in_window(&[-1, -2, -3], 1), vec![-1, -2, -3]);
    println!("ok");
}`,
    starter: `fn first_negative_in_window(nums: &[i32], k: usize) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(first_negative_in_window(&[-8, 2, 3, -6, 10], 2), vec![-8, 0, -6, -6]);
    println!("ok");
}`,
    tags: ['sliding-window', 'deque', 'array'],
  },
  {
    id: 'ds-ch03-c-006',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Windows With Target Sum',
    prompt: `Implement:

    fn subarray_sum_equals_k_fixed(nums: &[i32], k: usize, target: i32) -> i32

Count how many contiguous windows of exactly length k have a sum equal to target.
Example: nums = [1, 2, 3, 4, 5], k = 3, target = 6 -> 1  (window [1,2,3])`,
    hints: [
      'Slide a fixed window of size k and check each window sum against target.',
      'Count how many times the window sum matches.',
    ],
    solution: `fn subarray_sum_equals_k_fixed(nums: &[i32], k: usize, target: i32) -> i32 {
    let mut count = 0i32;
    let mut sum: i32 = nums[..k].iter().sum();
    if sum == target { count += 1; }
    for i in k..nums.len() {
        sum += nums[i] - nums[i - k];
        if sum == target { count += 1; }
    }
    count
}

fn main() {
    assert_eq!(subarray_sum_equals_k_fixed(&[1, 2, 3, 4, 5], 3, 6), 1);
    assert_eq!(subarray_sum_equals_k_fixed(&[1, 1, 1, 1], 2, 2), 3);
    assert_eq!(subarray_sum_equals_k_fixed(&[5, 5, 5], 1, 5), 3);
    assert_eq!(subarray_sum_equals_k_fixed(&[1, 2, 3], 3, 10), 0);
    println!("ok");
}`,
    starter: `fn subarray_sum_equals_k_fixed(nums: &[i32], k: usize, target: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(subarray_sum_equals_k_fixed(&[1, 2, 3, 4, 5], 3, 6), 1);
    println!("ok");
}`,
    tags: ['sliding-window', 'array'],
  },
  {
    id: 'ds-ch03-c-007',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'All Window Sums',
    prompt: `Implement:

    fn window_sums(nums: &[i32], k: usize) -> Vec<i32>

Return the sums of all contiguous windows of length k, in order.
If nums.len() < k, return an empty vector.
Example: nums = [2, 4, 6, 8, 10], k = 3 -> [12, 18, 24]`,
    hints: [
      'Compute the first window sum by summing nums[0..k].',
      'For each subsequent position, add the new right element and subtract the old left element.',
    ],
    solution: `fn window_sums(nums: &[i32], k: usize) -> Vec<i32> {
    if nums.len() < k { return vec![]; }
    let mut sum: i32 = nums[..k].iter().sum();
    let mut result = vec![sum];
    for i in k..nums.len() {
        sum += nums[i] - nums[i - k];
        result.push(sum);
    }
    result
}

fn main() {
    assert_eq!(window_sums(&[2, 4, 6, 8, 10], 3), vec![12, 18, 24]);
    assert_eq!(window_sums(&[1, 2, 3, 4, 5], 2), vec![3, 5, 7, 9]);
    assert_eq!(window_sums(&[1], 2), vec![]);
    assert_eq!(window_sums(&[7, 3], 2), vec![10]);
    println!("ok");
}`,
    starter: `fn window_sums(nums: &[i32], k: usize) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(window_sums(&[2, 4, 6, 8, 10], 3), vec![12, 18, 24]);
    println!("ok");
}`,
    tags: ['sliding-window', 'array'],
  },
  {
    id: 'ds-ch03-c-008',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Max Distinct In Window',
    prompt: `Implement:

    fn max_distinct_in_window(nums: &[i32], k: usize) -> i32

Return the maximum number of distinct values found in any contiguous window of length k.
Example: nums = [1, 2, 1, 3, 4, 2, 3], k = 4 -> 4  (window [1,3,4,2] has 4 distinct values)`,
    hints: [
      'Use a HashMap to track frequencies of elements in the current window.',
      'When an element leaves the window, decrement its count and remove it if it reaches zero.',
    ],
    solution: `fn max_distinct_in_window(nums: &[i32], k: usize) -> i32 {
    use std::collections::HashMap;
    let mut freq: HashMap<i32, i32> = HashMap::new();
    for &x in &nums[..k] {
        *freq.entry(x).or_insert(0) += 1;
    }
    let mut distinct = freq.len() as i32;
    let mut best = distinct;
    for i in k..nums.len() {
        let add = nums[i];
        let remove = nums[i - k];
        *freq.entry(add).or_insert(0) += 1;
        if freq[&add] == 1 { distinct += 1; }
        let cnt = freq.get_mut(&remove).unwrap();
        *cnt -= 1;
        if *cnt == 0 { distinct -= 1; freq.remove(&remove); }
        best = best.max(distinct);
    }
    best
}

fn main() {
    assert_eq!(max_distinct_in_window(&[1, 2, 1, 3, 4, 2, 3], 4), 4);
    assert_eq!(max_distinct_in_window(&[1, 1, 1, 1], 3), 1);
    assert_eq!(max_distinct_in_window(&[1, 2, 3, 4], 2), 2);
    assert_eq!(max_distinct_in_window(&[5], 1), 1);
    println!("ok");
}`,
    starter: `fn max_distinct_in_window(nums: &[i32], k: usize) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(max_distinct_in_window(&[1, 2, 1, 3, 4, 2, 3], 4), 4);
    println!("ok");
}`,
    tags: ['sliding-window', 'hashmap', 'array'],
  },
  {
    id: 'ds-ch03-c-009',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Window All Ones Check',
    prompt: `Implement:

    fn contains_window_all_ones(nums: &[i32], k: usize) -> bool

Given a binary array and window size k, return true if there exists at least one contiguous
window of length k where every element is 1.
Example: nums = [0, 1, 1, 1, 0], k = 3 -> true  (window at index 1)`,
    hints: [
      'A window is all ones when its sum equals k.',
      'Slide the fixed window and check each sum.',
    ],
    solution: `fn contains_window_all_ones(nums: &[i32], k: usize) -> bool {
    let first_sum: i32 = nums[..k].iter().sum();
    if first_sum == k as i32 { return true; }
    let mut sum = first_sum;
    for i in k..nums.len() {
        sum += nums[i] - nums[i - k];
        if sum == k as i32 { return true; }
    }
    false
}

fn main() {
    assert!(contains_window_all_ones(&[0, 1, 1, 1, 0], 3));
    assert!(!contains_window_all_ones(&[0, 1, 0, 1, 0], 3));
    assert!(contains_window_all_ones(&[1, 1], 2));
    assert!(!contains_window_all_ones(&[0, 0, 0], 2));
    assert!(contains_window_all_ones(&[1], 1));
    println!("ok");
}`,
    starter: `fn contains_window_all_ones(nums: &[i32], k: usize) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert!(contains_window_all_ones(&[0, 1, 1, 1, 0], 3));
    assert!(!contains_window_all_ones(&[0, 1, 0, 1, 0], 3));
    println!("ok");
}`,
    tags: ['sliding-window', 'binary-array'],
  },
  {
    id: 'ds-ch03-c-010',
    chapter: 3,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Sliding Window Maximum',
    prompt: `Implement:

    fn sliding_window_max_fixed(nums: &[i32], k: usize) -> Vec<i32>

Return a vector containing the maximum element of each window of size k as it slides from left to right.
Output length is nums.len() - k + 1.
Example: nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3 -> [3, 3, 5, 5, 6, 7]`,
    hints: [
      'Use a monotonic deque (VecDeque of indices) that keeps elements in decreasing order.',
      'Pop the front when it is outside the window; pop the back while the back element is <= current.',
    ],
    solution: `fn sliding_window_max_fixed(nums: &[i32], k: usize) -> Vec<i32> {
    use std::collections::VecDeque;
    let mut dq: VecDeque<usize> = VecDeque::new();
    let mut result = Vec::new();
    for i in 0..nums.len() {
        while dq.front().map_or(false, |&f| f + k <= i) {
            dq.pop_front();
        }
        while dq.back().map_or(false, |&b| nums[b] <= nums[i]) {
            dq.pop_back();
        }
        dq.push_back(i);
        if i + 1 >= k {
            result.push(nums[*dq.front().unwrap()]);
        }
    }
    result
}

fn main() {
    assert_eq!(sliding_window_max_fixed(&[1, 3, -1, -3, 5, 3, 6, 7], 3), vec![3, 3, 5, 5, 6, 7]);
    assert_eq!(sliding_window_max_fixed(&[1], 1), vec![1]);
    assert_eq!(sliding_window_max_fixed(&[1, -1], 1), vec![1, -1]);
    assert_eq!(sliding_window_max_fixed(&[9, 11], 2), vec![11]);
    println!("ok");
}`,
    starter: `fn sliding_window_max_fixed(nums: &[i32], k: usize) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(sliding_window_max_fixed(&[1, 3, -1, -3, 5, 3, 6, 7], 3), vec![3, 3, 5, 5, 6, 7]);
    println!("ok");
}`,
    tags: ['sliding-window', 'deque', 'monotonic'],
  },
  {
    id: 'ds-ch03-c-011',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Longest Substring No Repeats',
    prompt: `Implement:

    fn length_of_longest_substring(s: &str) -> usize

Find the length of the longest substring of s that contains no repeated characters.
s contains only ASCII characters. Return 0 for an empty string.
Example: s = "abcabcbb" -> 3  (substring "abc")`,
    hints: [
      'Use a fixed-size array of 128 elements to track the last-seen index of each ASCII character.',
      'Move the left pointer forward past the previous occurrence when a duplicate is found.',
    ],
    solution: `fn length_of_longest_substring(s: &str) -> usize {
    let bytes = s.as_bytes();
    let mut last_seen = [usize::MAX; 128];
    let mut left = 0usize;
    let mut best = 0usize;
    for (right, &b) in bytes.iter().enumerate() {
        let idx = b as usize;
        if last_seen[idx] != usize::MAX && last_seen[idx] >= left {
            left = last_seen[idx] + 1;
        }
        last_seen[idx] = right;
        best = best.max(right + 1 - left);
    }
    best
}

fn brute(s: &str) -> usize {
    let bytes = s.as_bytes();
    let n = bytes.len();
    let mut best = 0;
    for i in 0..n {
        let mut seen = [false; 128];
        for j in i..n {
            let idx = bytes[j] as usize;
            if seen[idx] { break; }
            seen[idx] = true;
            best = best.max(j + 1 - i);
        }
    }
    best
}

fn main() {
    assert_eq!(length_of_longest_substring("abcabcbb"), 3);
    assert_eq!(length_of_longest_substring("bbbbb"), 1);
    assert_eq!(length_of_longest_substring("pwwkew"), 3);
    assert_eq!(length_of_longest_substring(""), 0);
    for s in &["abcde", "aab", "dvdf", "anviaj"] {
        assert_eq!(length_of_longest_substring(s), brute(s), "mismatch on {}", s);
    }
    println!("ok");
}`,
    starter: `fn length_of_longest_substring(s: &str) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(length_of_longest_substring("abcabcbb"), 3);
    assert_eq!(length_of_longest_substring(""), 0);
    println!("ok");
}`,
    tags: ['sliding-window', 'string', 'hashmap'],
  },
  {
    id: 'ds-ch03-c-012',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Longest Substring At Most K Distinct',
    prompt: `Implement:

    fn longest_at_most_k_distinct(s: &str, k: usize) -> usize

Find the length of the longest substring that contains at most k distinct characters.
s contains only lowercase ASCII letters. Return 0 if s is empty or k is 0.
Example: s = "eceba", k = 2 -> 3  (substring "ece")`,
    hints: [
      'Use a variable-size window with a HashMap tracking character frequencies.',
      'When the number of distinct characters exceeds k, shrink from the left until it fits again.',
    ],
    solution: `fn longest_at_most_k_distinct(s: &str, k: usize) -> usize {
    use std::collections::HashMap;
    let bytes = s.as_bytes();
    let mut freq: HashMap<u8, usize> = HashMap::new();
    let mut left = 0usize;
    let mut best = 0usize;
    for (right, &b) in bytes.iter().enumerate() {
        *freq.entry(b).or_insert(0) += 1;
        while freq.len() > k {
            let lb = bytes[left];
            let cnt = freq.get_mut(&lb).unwrap();
            *cnt -= 1;
            if *cnt == 0 { freq.remove(&lb); }
            left += 1;
        }
        best = best.max(right + 1 - left);
    }
    best
}

fn brute_k_distinct(s: &str, k: usize) -> usize {
    use std::collections::HashSet;
    let bytes = s.as_bytes();
    let n = bytes.len();
    let mut best = 0;
    for i in 0..n {
        let mut seen: HashSet<u8> = HashSet::new();
        for j in i..n {
            seen.insert(bytes[j]);
            if seen.len() > k { break; }
            best = best.max(j + 1 - i);
        }
    }
    best
}

fn main() {
    assert_eq!(longest_at_most_k_distinct("eceba", 2), 3);
    assert_eq!(longest_at_most_k_distinct("ccaabbb", 2), 5);
    assert_eq!(longest_at_most_k_distinct("abc", 1), 1);
    assert_eq!(longest_at_most_k_distinct("", 2), 0);
    for (s, k) in &[("aab", 1usize), ("abaccc", 2), ("abcba", 3)] {
        assert_eq!(longest_at_most_k_distinct(s, *k), brute_k_distinct(s, *k), "mismatch on {} k={}", s, k);
    }
    println!("ok");
}`,
    starter: `fn longest_at_most_k_distinct(s: &str, k: usize) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(longest_at_most_k_distinct("eceba", 2), 3);
    println!("ok");
}`,
    tags: ['sliding-window', 'string', 'hashmap'],
  },
  {
    id: 'ds-ch03-c-013',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Longest Repeating Character Replacement',
    prompt: `Implement:

    fn character_replacement(s: &str, k: i32) -> usize

s contains only uppercase English letters. You may replace at most k characters in s with any
uppercase letter. Return the length of the longest substring you can obtain that consists of
a single repeated character.
Example: s = "ABAB", k = 2 -> 4  (replace both Bs or both As)`,
    hints: [
      'Use a sliding window and track the frequency of each character in the window.',
      'The window is valid when (window_length - max_frequency) <= k. If not, shrink from the left.',
    ],
    solution: `fn character_replacement(s: &str, k: i32) -> usize {
    let bytes = s.as_bytes();
    let mut freq = [0i32; 26];
    let mut max_freq = 0i32;
    let mut left = 0usize;
    let mut best = 0usize;
    for (right, &b) in bytes.iter().enumerate() {
        let idx = (b - b'A') as usize;
        freq[idx] += 1;
        max_freq = max_freq.max(freq[idx]);
        let window_len = (right + 1 - left) as i32;
        if window_len - max_freq > k {
            let li = (bytes[left] - b'A') as usize;
            freq[li] -= 1;
            left += 1;
        }
        best = best.max(right + 1 - left);
    }
    best
}

fn brute_char_replace(s: &str, k: i32) -> usize {
    let bytes = s.as_bytes();
    let n = bytes.len();
    let mut best = 0;
    for i in 0..n {
        let mut freq = [0i32; 26];
        for j in i..n {
            freq[(bytes[j] - b'A') as usize] += 1;
            let max_f = *freq.iter().max().unwrap();
            let len = (j + 1 - i) as i32;
            if len - max_f <= k {
                best = best.max(j + 1 - i);
            }
        }
    }
    best
}

fn main() {
    assert_eq!(character_replacement("ABAB", 2), 4);
    assert_eq!(character_replacement("AABABBA", 1), 4);
    assert_eq!(character_replacement("AAAA", 0), 4);
    for (s, k) in &[("ABCD", 1i32), ("AABBA", 2), ("BAAAB", 2)] {
        assert_eq!(character_replacement(s, *k), brute_char_replace(s, *k), "mismatch on {} k={}", s, k);
    }
    println!("ok");
}`,
    starter: `fn character_replacement(s: &str, k: i32) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(character_replacement("ABAB", 2), 4);
    assert_eq!(character_replacement("AABABBA", 1), 4);
    println!("ok");
}`,
    tags: ['sliding-window', 'string'],
  },
  {
    id: 'ds-ch03-c-014',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Find All Anagram Indices',
    prompt: `Implement:

    fn find_anagrams(s: &str, p: &str) -> Vec<usize>

Return a sorted vector of all starting indices in s where a substring of the same length as p
is an anagram of p. Both s and p contain only lowercase ASCII letters.
Example: s = "cbaebabacd", p = "abc" -> [0, 6]`,
    hints: [
      'Use two frequency arrays of size 26 (one for p, one for the current window).',
      'Slide a window of length p.len() across s, comparing the frequency arrays.',
    ],
    solution: `fn find_anagrams(s: &str, p: &str) -> Vec<usize> {
    let sb = s.as_bytes();
    let pb = p.as_bytes();
    let n = sb.len();
    let k = pb.len();
    if k > n { return vec![]; }
    let mut p_freq = [0i32; 26];
    let mut w_freq = [0i32; 26];
    for &b in pb { p_freq[(b - b'a') as usize] += 1; }
    for &b in &sb[..k] { w_freq[(b - b'a') as usize] += 1; }
    let mut result = Vec::new();
    if p_freq == w_freq { result.push(0); }
    for i in k..n {
        w_freq[(sb[i] - b'a') as usize] += 1;
        w_freq[(sb[i - k] - b'a') as usize] -= 1;
        if p_freq == w_freq { result.push(i + 1 - k); }
    }
    result
}

fn main() {
    assert_eq!(find_anagrams("cbaebabacd", "abc"), vec![0, 6]);
    assert_eq!(find_anagrams("abab", "ab"), vec![0, 1, 2]);
    assert_eq!(find_anagrams("af", "be"), vec![]);
    assert_eq!(find_anagrams("aab", "aab"), vec![0]);
    println!("ok");
}`,
    starter: `fn find_anagrams(s: &str, p: &str) -> Vec<usize> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(find_anagrams("cbaebabacd", "abc"), vec![0, 6]);
    println!("ok");
}`,
    tags: ['sliding-window', 'string', 'anagram'],
  },
  {
    id: 'ds-ch03-c-015',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Permutation In String',
    prompt: `Implement:

    fn permutation_in_string(s1: &str, s2: &str) -> bool

Return true if any permutation of s1 is a substring of s2. Both strings contain only
lowercase ASCII letters.
Example: s1 = "ab", s2 = "eidbaooo" -> true  ("ba" appears starting at index 3)`,
    hints: [
      'A permutation check is equivalent to checking that two frequency arrays are equal.',
      'Slide a window of length s1.len() over s2 and compare frequencies.',
    ],
    solution: `fn permutation_in_string(s1: &str, s2: &str) -> bool {
    let b1 = s1.as_bytes();
    let b2 = s2.as_bytes();
    let k = b1.len();
    let n = b2.len();
    if k > n { return false; }
    let mut f1 = [0i32; 26];
    let mut f2 = [0i32; 26];
    for &b in b1 { f1[(b - b'a') as usize] += 1; }
    for &b in &b2[..k] { f2[(b - b'a') as usize] += 1; }
    if f1 == f2 { return true; }
    for i in k..n {
        f2[(b2[i] - b'a') as usize] += 1;
        f2[(b2[i - k] - b'a') as usize] -= 1;
        if f1 == f2 { return true; }
    }
    false
}

fn main() {
    assert!(permutation_in_string("ab", "eidbaooo"));
    assert!(!permutation_in_string("ab", "eidboaoo"));
    assert!(permutation_in_string("adc", "dcda"));
    assert!(permutation_in_string("a", "a"));
    assert!(!permutation_in_string("abc", "ab"));
    println!("ok");
}`,
    starter: `fn permutation_in_string(s1: &str, s2: &str) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert!(permutation_in_string("ab", "eidbaooo"));
    assert!(!permutation_in_string("ab", "eidboaoo"));
    println!("ok");
}`,
    tags: ['sliding-window', 'string', 'anagram'],
  },
  {
    id: 'ds-ch03-c-016',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Max Consecutive Ones With K Flips',
    prompt: `Implement:

    fn max_consecutive_ones_k(nums: &[i32], k: i32) -> usize

Given a binary array and integer k, return the length of the longest contiguous subarray
containing only 1s after flipping at most k zeros to ones.
Example: nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2 -> 6`,
    hints: [
      'Use a variable-size window. Track the count of zeros in the window.',
      'When zeros exceed k, advance the left pointer until zeros <= k.',
    ],
    solution: `fn max_consecutive_ones_k(nums: &[i32], k: i32) -> usize {
    let mut left = 0usize;
    let mut zeros = 0i32;
    let mut best = 0usize;
    for right in 0..nums.len() {
        if nums[right] == 0 { zeros += 1; }
        while zeros > k {
            if nums[left] == 0 { zeros -= 1; }
            left += 1;
        }
        best = best.max(right + 1 - left);
    }
    best
}

fn brute_max_ones(nums: &[i32], k: i32) -> usize {
    let n = nums.len();
    let mut best = 0;
    for i in 0..n {
        let mut zeros = 0i32;
        for j in i..n {
            if nums[j] == 0 { zeros += 1; }
            if zeros > k { break; }
            best = best.max(j + 1 - i);
        }
    }
    best
}

fn main() {
    assert_eq!(max_consecutive_ones_k(&[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2), 6);
    assert_eq!(max_consecutive_ones_k(&[0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3), 10);
    for (arr, k) in &[(&[1i32, 0, 0, 1, 1][..], 1i32), (&[0, 0, 0][..], 2)] {
        assert_eq!(max_consecutive_ones_k(arr, *k), brute_max_ones(arr, *k));
    }
    println!("ok");
}`,
    starter: `fn max_consecutive_ones_k(nums: &[i32], k: i32) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(max_consecutive_ones_k(&[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2), 6);
    println!("ok");
}`,
    tags: ['sliding-window', 'binary-array'],
  },
  {
    id: 'ds-ch03-c-017',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Fruits Into Baskets',
    prompt: `Implement:

    fn fruits_into_baskets(fruits: &[i32]) -> usize

You have two baskets and can hold at most one fruit type per basket. Given a row of trees where
fruits[i] is the fruit type at position i, pick the maximum number of fruits from a contiguous
segment using at most 2 distinct fruit types.
Example: fruits = [1, 2, 3, 2, 2] -> 4  (segment [2, 3, 2, 2])`,
    hints: [
      'This is equivalent to finding the longest subarray with at most 2 distinct values.',
      'Use a sliding window with a HashMap of frequencies; shrink left when distinct count exceeds 2.',
    ],
    solution: `fn fruits_into_baskets(fruits: &[i32]) -> usize {
    use std::collections::HashMap;
    let mut freq: HashMap<i32, usize> = HashMap::new();
    let mut left = 0usize;
    let mut best = 0usize;
    for right in 0..fruits.len() {
        *freq.entry(fruits[right]).or_insert(0) += 1;
        while freq.len() > 2 {
            let lf = fruits[left];
            let cnt = freq.get_mut(&lf).unwrap();
            *cnt -= 1;
            if *cnt == 0 { freq.remove(&lf); }
            left += 1;
        }
        best = best.max(right + 1 - left);
    }
    best
}

fn brute_fruits(fruits: &[i32]) -> usize {
    use std::collections::HashSet;
    let n = fruits.len();
    let mut best = 0;
    for i in 0..n {
        let mut seen: HashSet<i32> = HashSet::new();
        for j in i..n {
            seen.insert(fruits[j]);
            if seen.len() > 2 { break; }
            best = best.max(j + 1 - i);
        }
    }
    best
}

fn main() {
    assert_eq!(fruits_into_baskets(&[1, 2, 1]), 3);
    assert_eq!(fruits_into_baskets(&[0, 1, 2, 2]), 3);
    assert_eq!(fruits_into_baskets(&[1, 2, 3, 2, 2]), 4);
    for arr in &[&[1i32, 1, 1][..], &[1, 2, 3, 4][..], &[1, 2, 1, 3, 2][..]] {
        assert_eq!(fruits_into_baskets(arr), brute_fruits(arr));
    }
    println!("ok");
}`,
    starter: `fn fruits_into_baskets(fruits: &[i32]) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(fruits_into_baskets(&[1, 2, 3, 2, 2]), 4);
    println!("ok");
}`,
    tags: ['sliding-window', 'hashmap', 'array'],
  },
  {
    id: 'ds-ch03-c-018',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Minimum Size Subarray Sum',
    prompt: `Implement:

    fn min_size_subarray_sum(nums: &[i32], target: i32) -> usize

All values in nums are positive. Return the length of the shortest contiguous subarray
whose sum is >= target. If no such subarray exists, return 0.
Example: nums = [2, 3, 1, 2, 4, 3], target = 7 -> 2  (subarray [4, 3])`,
    hints: [
      'Expand the window to the right until the sum meets the target, then shrink from the left as long as it still meets it.',
      'Track the minimum window length seen whenever the sum is valid.',
    ],
    solution: `fn min_size_subarray_sum(nums: &[i32], target: i32) -> usize {
    let mut left = 0usize;
    let mut sum = 0i32;
    let mut best = usize::MAX;
    for right in 0..nums.len() {
        sum += nums[right];
        while sum >= target {
            best = best.min(right + 1 - left);
            sum -= nums[left];
            left += 1;
        }
    }
    if best == usize::MAX { 0 } else { best }
}

fn brute_min_subarray(nums: &[i32], target: i32) -> usize {
    let n = nums.len();
    let mut best = usize::MAX;
    for i in 0..n {
        let mut s = 0i32;
        for j in i..n {
            s += nums[j];
            if s >= target { best = best.min(j + 1 - i); break; }
        }
    }
    if best == usize::MAX { 0 } else { best }
}

fn main() {
    assert_eq!(min_size_subarray_sum(&[2, 3, 1, 2, 4, 3], 7), 2);
    assert_eq!(min_size_subarray_sum(&[1, 4, 4], 4), 1);
    assert_eq!(min_size_subarray_sum(&[1, 1, 1, 1, 1, 1, 1, 1], 11), 0);
    for (arr, t) in &[(&[2i32, 3, 1, 2, 4, 3][..], 6i32), (&[1, 2, 3, 4, 5][..], 11)] {
        assert_eq!(min_size_subarray_sum(arr, *t), brute_min_subarray(arr, *t));
    }
    println!("ok");
}`,
    starter: `fn min_size_subarray_sum(nums: &[i32], target: i32) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(min_size_subarray_sum(&[2, 3, 1, 2, 4, 3], 7), 2);
    println!("ok");
}`,
    tags: ['sliding-window', 'array', 'two-pointers'],
  },
  {
    id: 'ds-ch03-c-019',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Subarrays With Product Less Than K',
    prompt: `Implement:

    fn subarray_product_less_than_k(nums: &[i32], k: i32) -> i32

All values in nums are positive integers >= 1. Count the number of contiguous subarrays
whose product of all elements is strictly less than k. Return 0 if k <= 1.
Example: nums = [10, 5, 2, 6], k = 100 -> 8`,
    hints: [
      'Use a sliding window. Multiply new elements in; divide out elements from the left when product >= k.',
      'For each right endpoint, the number of valid subarrays ending there is (right - left + 1).',
    ],
    solution: `fn subarray_product_less_than_k(nums: &[i32], k: i32) -> i32 {
    if k <= 1 { return 0; }
    let mut product = 1i32;
    let mut left = 0usize;
    let mut count = 0i32;
    for right in 0..nums.len() {
        product *= nums[right];
        while product >= k {
            product /= nums[left];
            left += 1;
        }
        count += (right + 1 - left) as i32;
    }
    count
}

fn brute_product_less_k(nums: &[i32], k: i32) -> i32 {
    let n = nums.len();
    let mut count = 0i32;
    for i in 0..n {
        let mut p = 1i32;
        for j in i..n {
            p *= nums[j];
            if p < k { count += 1; } else { break; }
        }
    }
    count
}

fn main() {
    assert_eq!(subarray_product_less_than_k(&[10, 5, 2, 6], 100), 8);
    assert_eq!(subarray_product_less_than_k(&[1, 2, 3], 0), 0);
    assert_eq!(subarray_product_less_than_k(&[1, 1, 1], 2), 6);
    for (arr, k) in &[(&[2i32, 3, 4][..], 10i32), (&[1, 2, 3, 4][..], 6)] {
        assert_eq!(subarray_product_less_than_k(arr, *k), brute_product_less_k(arr, *k));
    }
    println!("ok");
}`,
    starter: `fn subarray_product_less_than_k(nums: &[i32], k: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(subarray_product_less_than_k(&[10, 5, 2, 6], 100), 8);
    println!("ok");
}`,
    tags: ['sliding-window', 'array'],
  },
  {
    id: 'ds-ch03-c-020',
    chapter: 3,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Longest Substring Two Distinct Characters',
    prompt: `Implement:

    fn longest_two_distinct(s: &str) -> usize

Find the length of the longest substring of s that contains at most 2 distinct characters.
s contains only lowercase ASCII letters.
Example: s = "eceba" -> 3  (substring "ece")`,
    hints: [
      'Use a sliding window with a HashMap counting character frequencies.',
      'When more than 2 distinct characters are in the window, shrink from the left.',
    ],
    solution: `fn longest_two_distinct(s: &str) -> usize {
    use std::collections::HashMap;
    let bytes = s.as_bytes();
    let mut freq: HashMap<u8, usize> = HashMap::new();
    let mut left = 0usize;
    let mut best = 0usize;
    for (right, &b) in bytes.iter().enumerate() {
        *freq.entry(b).or_insert(0) += 1;
        while freq.len() > 2 {
            let lb = bytes[left];
            let cnt = freq.get_mut(&lb).unwrap();
            *cnt -= 1;
            if *cnt == 0 { freq.remove(&lb); }
            left += 1;
        }
        best = best.max(right + 1 - left);
    }
    best
}

fn brute_two_distinct(s: &str) -> usize {
    use std::collections::HashSet;
    let bytes = s.as_bytes();
    let n = bytes.len();
    let mut best = 0;
    for i in 0..n {
        let mut seen: HashSet<u8> = HashSet::new();
        for j in i..n {
            seen.insert(bytes[j]);
            if seen.len() > 2 { break; }
            best = best.max(j + 1 - i);
        }
    }
    best
}

fn main() {
    assert_eq!(longest_two_distinct("eceba"), 3);
    assert_eq!(longest_two_distinct("ccaabbb"), 5);
    assert_eq!(longest_two_distinct("abcabcabc"), 2);
    for s in &["aab", "abc", "aabc", "abba"] {
        assert_eq!(longest_two_distinct(s), brute_two_distinct(s), "mismatch on {}", s);
    }
    println!("ok");
}`,
    starter: `fn longest_two_distinct(s: &str) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(longest_two_distinct("eceba"), 3);
    assert_eq!(longest_two_distinct("ccaabbb"), 5);
    println!("ok");
}`,
    tags: ['sliding-window', 'string', 'hashmap'],
  },
  {
    id: 'ds-ch03-c-021',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Minimum Window Substring',
    prompt: `Implement:

    fn min_window_substring(s: &str, t: &str) -> String

Find the shortest substring of s that contains every character in t (with multiplicity).
Return an empty String if no such window exists. s and t contain only uppercase and lowercase ASCII letters.
Example: s = "ADOBECODEBANC", t = "ABC" -> "BANC"`,
    hints: [
      'Track how many characters from t you still need to satisfy using a need array and a have counter.',
      'Expand right until all characters are covered, then shrink left to find the minimum valid window.',
    ],
    solution: `fn min_window_substring(s: &str, t: &str) -> String {
    let sb = s.as_bytes();
    let tb = t.as_bytes();
    let n = sb.len();
    let mut need = [0i32; 128];
    for &b in tb { need[b as usize] += 1; }
    let required = tb.len();
    let mut have = 0usize;
    let mut window = [0i32; 128];
    let mut left = 0usize;
    let mut best_len = usize::MAX;
    let mut best_l = 0usize;
    for right in 0..n {
        let b = sb[right] as usize;
        window[b] += 1;
        if need[b] > 0 && window[b] <= need[b] {
            have += 1;
        }
        while have == required {
            let cur_len = right + 1 - left;
            if cur_len < best_len {
                best_len = cur_len;
                best_l = left;
            }
            let lb = sb[left] as usize;
            window[lb] -= 1;
            if need[lb] > 0 && window[lb] < need[lb] {
                have -= 1;
            }
            left += 1;
        }
    }
    if best_len == usize::MAX {
        String::new()
    } else {
        String::from_utf8(sb[best_l..best_l + best_len].to_vec()).unwrap()
    }
}

fn window_contains(window: &str, t: &str) -> bool {
    let mut need = [0i32; 128];
    for b in t.as_bytes() { need[*b as usize] += 1; }
    for b in window.as_bytes() {
        let idx = *b as usize;
        if need[idx] > 0 { need[idx] -= 1; }
    }
    need.iter().all(|&x| x == 0)
}

fn main() {
    assert_eq!(min_window_substring("ADOBECODEBANC", "ABC"), "BANC");
    assert_eq!(min_window_substring("a", "a"), "a");
    assert_eq!(min_window_substring("a", "aa"), "");
    assert_eq!(min_window_substring("cabwefgewcwaefgcf", "cae"), "cwae");
    let r = min_window_substring("ADOBECODEBANC", "AC");
    assert!(!r.is_empty() && window_contains(&r, "AC"));
    let r2 = min_window_substring("ADOBECODEBANC", "AABC");
    assert!(!r2.is_empty() && window_contains(&r2, "AABC"));
    assert_eq!(min_window_substring("xyz", "w"), "");
    println!("ok");
}`,
    starter: `fn min_window_substring(s: &str, t: &str) -> String {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(min_window_substring("ADOBECODEBANC", "ABC"), "BANC");
    assert_eq!(min_window_substring("a", "aa"), "");
    println!("ok");
}`,
    tags: ['sliding-window', 'string', 'hashmap'],
  },
  {
    id: 'ds-ch03-c-022',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Subarrays With Exactly K Distinct Values',
    prompt: `Implement:

    fn count_subarrays_k_distinct(nums: &[i32], k: usize) -> i64

Count the number of contiguous subarrays that contain exactly k distinct values.
nums contains positive integers. Return 0 if k is 0.
Example: nums = [1, 2, 1, 2, 3], k = 2 -> 7`,
    hints: [
      'Use the identity: exactly(k) = at_most(k) - at_most(k-1).',
      'Implement at_most(k) with a sliding window that shrinks left when distinct count exceeds k.',
    ],
    solution: `fn count_subarrays_k_distinct(nums: &[i32], k: usize) -> i64 {
    fn at_most(nums: &[i32], k: usize) -> i64 {
        use std::collections::HashMap;
        let mut freq: HashMap<i32, usize> = HashMap::new();
        let mut left = 0usize;
        let mut count = 0i64;
        for right in 0..nums.len() {
            *freq.entry(nums[right]).or_insert(0) += 1;
            while freq.len() > k {
                let lv = nums[left];
                let cnt = freq.get_mut(&lv).unwrap();
                *cnt -= 1;
                if *cnt == 0 { freq.remove(&lv); }
                left += 1;
            }
            count += (right + 1 - left) as i64;
        }
        count
    }
    if k == 0 { return 0; }
    at_most(nums, k) - at_most(nums, k - 1)
}

fn brute_k_distinct_count(nums: &[i32], k: usize) -> i64 {
    use std::collections::HashSet;
    let n = nums.len();
    let mut count = 0i64;
    for i in 0..n {
        let mut seen: HashSet<i32> = HashSet::new();
        for j in i..n {
            seen.insert(nums[j]);
            if seen.len() > k { break; }
            if seen.len() == k { count += 1; }
        }
    }
    count
}

fn main() {
    assert_eq!(count_subarrays_k_distinct(&[1, 2, 1, 2, 3], 2), 7);
    assert_eq!(count_subarrays_k_distinct(&[1, 2, 1, 3, 4], 3), 3);
    for (arr, k) in &[(&[1i32, 2, 1, 2][..], 2usize), (&[1, 1, 2, 3][..], 2)] {
        assert_eq!(count_subarrays_k_distinct(arr, *k), brute_k_distinct_count(arr, *k), "mismatch arr={:?} k={}", arr, k);
    }
    println!("ok");
}`,
    starter: `fn count_subarrays_k_distinct(nums: &[i32], k: usize) -> i64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(count_subarrays_k_distinct(&[1, 2, 1, 2, 3], 2), 7);
    println!("ok");
}`,
    tags: ['sliding-window', 'hashmap', 'counting'],
  },
  {
    id: 'ds-ch03-c-023',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Max Sum of Two Non-Overlapping Subarrays',
    prompt: `Implement:

    fn max_sum_two_non_overlapping(nums: &[i32], l: usize, m: usize) -> i32

Find the maximum sum of two non-overlapping subarrays of lengths l and m respectively
(in any order) within nums. Assume nums.len() >= l + m.
Example: nums = [0, 6, 5, 2, 2, 5, 1, 9, 4], l = 1, m = 2 -> 20`,
    hints: [
      'Build a prefix sum array for O(1) window sum queries.',
      'Try both orderings: l-window before m-window, and m-window before l-window. For each, slide the second window while tracking the best first window seen so far.',
    ],
    solution: `fn max_sum_two_non_overlapping(nums: &[i32], l: usize, m: usize) -> i32 {
    let n = nums.len();
    let mut prefix = vec![0i32; n + 1];
    for i in 0..n {
        prefix[i + 1] = prefix[i] + nums[i];
    }
    let window_sum = |i: usize, len: usize| -> i32 { prefix[i + len] - prefix[i] };
    let mut best = 0i32;
    let mut max_l = 0i32;
    for i in 0..=(n - l - m) {
        let l_sum = window_sum(i, l);
        max_l = max_l.max(l_sum);
        let m_sum = window_sum(i + l, m);
        best = best.max(max_l + m_sum);
    }
    let mut max_m = 0i32;
    for i in 0..=(n - l - m) {
        let m_sum = window_sum(i, m);
        max_m = max_m.max(m_sum);
        let l_sum = window_sum(i + m, l);
        best = best.max(max_m + l_sum);
    }
    best
}

fn brute_two_nonoverlap(nums: &[i32], l: usize, m: usize) -> i32 {
    let n = nums.len();
    let mut best = 0i32;
    let sum = |a: usize, len: usize| -> i32 { nums[a..a+len].iter().sum() };
    for i in 0..n {
        for j in 0..n {
            if i + l <= j && j + m <= n {
                best = best.max(sum(i, l) + sum(j, m));
            }
            if j + m <= i && i + l <= n {
                best = best.max(sum(j, m) + sum(i, l));
            }
        }
    }
    best
}

fn main() {
    assert_eq!(max_sum_two_non_overlapping(&[0, 6, 5, 2, 2, 5, 1, 9, 4], 1, 2), 20);
    assert_eq!(max_sum_two_non_overlapping(&[3, 8, 1, 3, 2, 1, 8, 9, 0], 3, 2), 29);
    for (arr, l, m) in &[(&[1i32, 0, 3][..], 1usize, 1usize), (&[4, 3, 2, 1, 5, 6][..], 2, 2)] {
        assert_eq!(max_sum_two_non_overlapping(arr, *l, *m), brute_two_nonoverlap(arr, *l, *m));
    }
    println!("ok");
}`,
    starter: `fn max_sum_two_non_overlapping(nums: &[i32], l: usize, m: usize) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(max_sum_two_non_overlapping(&[0, 6, 5, 2, 2, 5, 1, 9, 4], 1, 2), 20);
    println!("ok");
}`,
    tags: ['sliding-window', 'prefix-sum', 'array'],
  },
  {
    id: 'ds-ch03-c-024',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Longest Subarray Of Ones After Deleting One Element',
    prompt: `Implement:

    fn longest_subarray_ones_remove_one(nums: &[i32]) -> usize

Given a binary array, you must delete exactly one element from it. Return the length of the
longest subarray containing only 1s after the deletion. (Deleting a 1 makes the window one shorter;
deleting a 0 merges two runs of ones.)
Example: nums = [1, 1, 0, 1] -> 3`,
    hints: [
      'The window may contain at most one zero (which represents the element to delete).',
      'Use a sliding window allowing at most 1 zero; the answer is window_length - 1 because one element must be deleted.',
    ],
    solution: `fn longest_subarray_ones_remove_one(nums: &[i32]) -> usize {
    let mut left = 0usize;
    let mut zeros = 0i32;
    let mut best = 0usize;
    for right in 0..nums.len() {
        if nums[right] == 0 { zeros += 1; }
        while zeros > 1 {
            if nums[left] == 0 { zeros -= 1; }
            left += 1;
        }
        best = best.max(right + 1 - left - 1);
    }
    best
}

fn brute_remove_one(nums: &[i32]) -> usize {
    let n = nums.len();
    let mut best = 0;
    for i in 0..n {
        let mut zeros = 0;
        for j in i..n {
            if nums[j] == 0 { zeros += 1; }
            if zeros > 1 { break; }
            best = best.max(j + 1 - i - zeros);
        }
    }
    best
}

fn main() {
    assert_eq!(longest_subarray_ones_remove_one(&[1, 1, 0, 1]), 3);
    assert_eq!(longest_subarray_ones_remove_one(&[0, 1, 1, 1, 0, 1, 1, 0, 1]), 5);
    assert_eq!(longest_subarray_ones_remove_one(&[1, 1, 1]), 2);
    for arr in &[&[0i32, 1, 0][..], &[1, 0, 1, 0, 1][..], &[1, 1, 0, 0, 1][..]] {
        assert_eq!(longest_subarray_ones_remove_one(arr), brute_remove_one(arr));
    }
    println!("ok");
}`,
    starter: `fn longest_subarray_ones_remove_one(nums: &[i32]) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(longest_subarray_ones_remove_one(&[1, 1, 0, 1]), 3);
    assert_eq!(longest_subarray_ones_remove_one(&[1, 1, 1]), 2);
    println!("ok");
}`,
    tags: ['sliding-window', 'binary-array'],
  },
  {
    id: 'ds-ch03-c-025',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Max Vowels In Window',
    prompt: `Implement:

    fn max_vowels_window(s: &str, k: usize) -> i32

Return the maximum number of vowels (a, e, i, o, u) in any contiguous window of length k in s.
s contains only lowercase ASCII letters.
Example: s = "abciiidef", k = 3 -> 3  (window "iii")`,
    hints: [
      'Use a fixed-size sliding window, counting vowels that enter and leave.',
      'A lookup function that checks if a byte is one of the 5 vowels makes the code concise.',
    ],
    solution: `fn max_vowels_window(s: &str, k: usize) -> i32 {
    let is_vowel = |b: u8| matches!(b, b'a' | b'e' | b'i' | b'o' | b'u');
    let bytes = s.as_bytes();
    let mut count = bytes[..k].iter().filter(|&&b| is_vowel(b)).count() as i32;
    let mut best = count;
    for i in k..bytes.len() {
        if is_vowel(bytes[i]) { count += 1; }
        if is_vowel(bytes[i - k]) { count -= 1; }
        best = best.max(count);
    }
    best
}

fn main() {
    assert_eq!(max_vowels_window("abciiidef", 3), 3);
    assert_eq!(max_vowels_window("aeiou", 2), 2);
    assert_eq!(max_vowels_window("leetcode", 3), 2);
    assert_eq!(max_vowels_window("rhythms", 4), 0);
    assert_eq!(max_vowels_window("aaa", 1), 1);
    println!("ok");
}`,
    starter: `fn max_vowels_window(s: &str, k: usize) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(max_vowels_window("abciiidef", 3), 3);
    assert_eq!(max_vowels_window("leetcode", 3), 2);
    println!("ok");
}`,
    tags: ['sliding-window', 'string'],
  },
  {
    id: 'ds-ch03-c-026',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Minimum Swaps To Group Ones',
    prompt: `Implement:

    fn min_swaps_group_ones(nums: &[i32]) -> i32

Given a binary circular array, return the minimum number of swaps needed to group all 1s
together in any contiguous segment (wrap-around allowed). A swap exchanges any two elements.
Example: nums = [0, 1, 0, 1, 1, 0, 0] -> 1`,
    hints: [
      'The window size equals the total number of ones. For a circular array, consider the doubled array.',
      'The minimum swaps equals (total_ones - max_ones_in_any_window_of_that_size).',
    ],
    solution: `fn min_swaps_group_ones(nums: &[i32]) -> i32 {
    let total_ones: i32 = nums.iter().sum();
    let k = total_ones as usize;
    if k == 0 { return 0; }
    let n = nums.len();
    let doubled: Vec<i32> = nums.iter().chain(nums.iter()).cloned().collect();
    let mut window_ones: i32 = doubled[..k].iter().sum();
    let mut best = window_ones;
    for i in k..(2 * n) {
        window_ones += doubled[i] - doubled[i - k];
        best = best.max(window_ones);
    }
    total_ones - best
}

fn brute_min_swaps(nums: &[i32]) -> i32 {
    let total_ones: i32 = nums.iter().sum();
    let k = total_ones as usize;
    if k == 0 { return 0; }
    let n = nums.len();
    let doubled: Vec<i32> = nums.iter().chain(nums.iter()).cloned().collect();
    let mut best = 0i32;
    for i in 0..(2 * n - k + 1) {
        let s: i32 = doubled[i..i+k].iter().sum();
        best = best.max(s);
    }
    total_ones - best
}

fn main() {
    assert_eq!(min_swaps_group_ones(&[0, 1, 0, 1, 1, 0, 0]), 1);
    assert_eq!(min_swaps_group_ones(&[0, 1, 1, 1, 0, 0, 1, 1, 0]), 2);
    assert_eq!(min_swaps_group_ones(&[1, 1, 0, 0, 1]), 0);
    assert_eq!(min_swaps_group_ones(&[0, 0, 0]), 0);
    for arr in &[&[0i32, 1, 0, 0, 1][..], &[1, 1, 1][..], &[1, 0, 1, 0, 1][..]] {
        assert_eq!(min_swaps_group_ones(arr), brute_min_swaps(arr));
    }
    println!("ok");
}`,
    starter: `fn min_swaps_group_ones(nums: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(min_swaps_group_ones(&[0, 1, 0, 1, 1, 0, 0]), 1);
    println!("ok");
}`,
    tags: ['sliding-window', 'binary-array', 'circular'],
  },
  {
    id: 'ds-ch03-c-027',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Count Subarrays With Exactly K Odd Numbers',
    prompt: `Implement:

    fn number_of_subarrays_k_odd(nums: &[i32], k: i32) -> i32

Return the number of contiguous subarrays that contain exactly k odd numbers.
Example: nums = [1, 1, 2, 1, 1], k = 3 -> 2`,
    hints: [
      'Use the at_most trick: exactly(k) = at_most(k) - at_most(k-1).',
      'In at_most, track the count of odd numbers in the window; shrink left when it exceeds k.',
    ],
    solution: `fn number_of_subarrays_k_odd(nums: &[i32], k: i32) -> i32 {
    fn at_most_odd(nums: &[i32], k: i32) -> i32 {
        let mut left = 0usize;
        let mut odd_count = 0i32;
        let mut count = 0i32;
        for right in 0..nums.len() {
            if nums[right] % 2 != 0 { odd_count += 1; }
            while odd_count > k {
                if nums[left] % 2 != 0 { odd_count -= 1; }
                left += 1;
            }
            count += (right + 1 - left) as i32;
        }
        count
    }
    at_most_odd(nums, k) - at_most_odd(nums, k - 1)
}

fn brute_k_odd(nums: &[i32], k: i32) -> i32 {
    let n = nums.len();
    let mut count = 0i32;
    for i in 0..n {
        let mut odds = 0i32;
        for j in i..n {
            if nums[j] % 2 != 0 { odds += 1; }
            if odds == k { count += 1; }
            if odds > k { break; }
        }
    }
    count
}

fn main() {
    assert_eq!(number_of_subarrays_k_odd(&[1, 1, 2, 1, 1], 3), 2);
    assert_eq!(number_of_subarrays_k_odd(&[2, 4, 6], 1), 0);
    assert_eq!(number_of_subarrays_k_odd(&[2, 2, 2, 1, 2, 2, 1, 2, 2, 2], 2), 16);
    for (arr, k) in &[(&[1i32, 2, 3, 4, 5][..], 2i32), (&[1, 1, 1][..], 1)] {
        assert_eq!(number_of_subarrays_k_odd(arr, *k), brute_k_odd(arr, *k));
    }
    println!("ok");
}`,
    starter: `fn number_of_subarrays_k_odd(nums: &[i32], k: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(number_of_subarrays_k_odd(&[1, 1, 2, 1, 1], 3), 2);
    println!("ok");
}`,
    tags: ['sliding-window', 'counting', 'array'],
  },
  {
    id: 'ds-ch03-c-028',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Shortest Subarray With Sum At Least K (Negatives)',
    prompt: `Implement:

    fn shortest_subarray_sum_at_least_k(nums: &[i32], k: i32) -> i32

nums may contain negative integers. Return the length of the shortest contiguous subarray
whose sum is >= k, or -1 if none exists.
Example: nums = [2, -1, 2], k = 3 -> 3  (the only valid subarray is the whole array)`,
    hints: [
      'Build a prefix sum array. You need the smallest j - i such that prefix[j] - prefix[i] >= k.',
      'Use a monotonic deque of indices into the prefix array. For each j, pop from the front while prefix[j] - prefix[front] >= k (updating best), then pop from the back while prefix[back] >= prefix[j].',
    ],
    solution: `fn shortest_subarray_sum_at_least_k(nums: &[i32], k: i32) -> i32 {
    use std::collections::VecDeque;
    let n = nums.len();
    let mut prefix = vec![0i64; n + 1];
    for i in 0..n {
        prefix[i + 1] = prefix[i] + nums[i] as i64;
    }
    let target = k as i64;
    let mut dq: VecDeque<usize> = VecDeque::new();
    let mut best = i32::MAX;
    for i in 0..=n {
        while dq.front().map_or(false, |&f| prefix[i] - prefix[f] >= target) {
            best = best.min((i - dq.pop_front().unwrap()) as i32);
        }
        while dq.back().map_or(false, |&b| prefix[b] >= prefix[i]) {
            dq.pop_back();
        }
        dq.push_back(i);
    }
    if best == i32::MAX { -1 } else { best }
}

fn brute_shortest_sum(nums: &[i32], k: i32) -> i32 {
    let n = nums.len();
    let mut best = i32::MAX;
    for i in 0..n {
        let mut s = 0i64;
        for j in i..n {
            s += nums[j] as i64;
            if s >= k as i64 { best = best.min((j + 1 - i) as i32); break; }
        }
    }
    if best == i32::MAX { -1 } else { best }
}

fn main() {
    assert_eq!(shortest_subarray_sum_at_least_k(&[1], 1), 1);
    assert_eq!(shortest_subarray_sum_at_least_k(&[1, 2], 4), -1);
    assert_eq!(shortest_subarray_sum_at_least_k(&[2, -1, 2], 3), 3);
    assert_eq!(shortest_subarray_sum_at_least_k(&[1, 2, 3, 4, 5], 11), 3);
    for (arr, k) in &[(&[2i32, 1, 3][..], 4i32), (&[1, 2, 3][..], 6)] {
        assert_eq!(shortest_subarray_sum_at_least_k(arr, *k), brute_shortest_sum(arr, *k));
    }
    println!("ok");
}`,
    starter: `fn shortest_subarray_sum_at_least_k(nums: &[i32], k: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(shortest_subarray_sum_at_least_k(&[2, -1, 2], 3), 3);
    assert_eq!(shortest_subarray_sum_at_least_k(&[1, 2], 4), -1);
    println!("ok");
}`,
    tags: ['sliding-window', 'deque', 'prefix-sum', 'monotonic'],
  },
  {
    id: 'ds-ch03-c-029',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Count Balanced Binary Substrings',
    prompt: `Implement:

    fn count_binary_substrings(s: &str) -> i32

A balanced binary substring has an equal number of consecutive 0s and 1s where all 0s come
before all 1s or all 1s come before all 0s (e.g. "0011", "11", "0101" contains "01", "10", "01").
Count the total number of such substrings in s (overlapping substrings count separately).
Example: s = "00110011" -> 6`,
    hints: [
      'Group consecutive identical characters into run lengths.',
      'For every pair of adjacent groups, min(group[i], group[i+1]) substrings are valid.',
    ],
    solution: `fn count_binary_substrings(s: &str) -> i32 {
    let bytes = s.as_bytes();
    let n = bytes.len();
    if n == 0 { return 0; }
    let mut groups: Vec<i32> = Vec::new();
    let mut i = 0usize;
    while i < n {
        let b = bytes[i];
        let mut cnt = 0i32;
        while i < n && bytes[i] == b { cnt += 1; i += 1; }
        groups.push(cnt);
    }
    groups.windows(2).map(|w| w[0].min(w[1])).sum()
}

fn brute_binary_substrings(s: &str) -> i32 {
    let bytes = s.as_bytes();
    let n = bytes.len();
    let mut count = 0i32;
    for i in 0..n {
        for half in 1..=(n - i) / 2 {
            let first = &bytes[i..i + half];
            let second = &bytes[i + half..i + 2 * half];
            let first_char = first[0];
            let all_same_first = first.iter().all(|&b| b == first_char);
            let all_same_second = second.iter().all(|&b| b == second[0]);
            if all_same_first && all_same_second && first_char != second[0] {
                count += 1;
            }
        }
    }
    count
}

fn main() {
    assert_eq!(count_binary_substrings("00110011"), 6);
    assert_eq!(count_binary_substrings("10101"), 4);
    assert_eq!(count_binary_substrings("01"), 1);
    assert_eq!(count_binary_substrings("0011"), 2);
    for s in &["001100", "0110", "10", "000111", "010"] {
        assert_eq!(count_binary_substrings(s), brute_binary_substrings(s), "mismatch on {}", s);
    }
    println!("ok");
}`,
    starter: `fn count_binary_substrings(s: &str) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(count_binary_substrings("00110011"), 6);
    assert_eq!(count_binary_substrings("10101"), 4);
    println!("ok");
}`,
    tags: ['sliding-window', 'string', 'counting'],
  },
  {
    id: 'ds-ch03-c-030',
    chapter: 3,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Minimum Window Covering All Characters',
    prompt: `Implement:

    fn min_window_with_all_chars(s: &str, t: &str) -> String

Find the minimum-length substring of s that contains all characters of t with at least
the required multiplicity. Return an empty String if impossible.
s and t contain only ASCII letters. This is the general version supporting repeated characters in t.
Example: s = "ADOBECODEBANC", t = "ABC" -> "BANC"`,
    hints: [
      'Use two frequency arrays (need and window), a have counter, and expand/contract the window.',
      'Increment have only when window[b] becomes exactly equal to need[b] (not more).',
    ],
    solution: `fn min_window_with_all_chars(s: &str, t: &str) -> String {
    let sb = s.as_bytes();
    let tb = t.as_bytes();
    let n = sb.len();
    let mut need = [0i32; 128];
    for &b in tb { need[b as usize] += 1; }
    let required = tb.len();
    let mut window = [0i32; 128];
    let mut have = 0usize;
    let mut left = 0usize;
    let mut best_len = usize::MAX;
    let mut best_l = 0usize;
    for right in 0..n {
        let b = sb[right] as usize;
        window[b] += 1;
        if need[b] > 0 && window[b] <= need[b] { have += 1; }
        while have == required {
            if right + 1 - left < best_len {
                best_len = right + 1 - left;
                best_l = left;
            }
            let lb = sb[left] as usize;
            window[lb] -= 1;
            if need[lb] > 0 && window[lb] < need[lb] { have -= 1; }
            left += 1;
        }
    }
    if best_len == usize::MAX {
        String::new()
    } else {
        String::from_utf8(sb[best_l..best_l + best_len].to_vec()).unwrap()
    }
}

fn contains_all(window: &str, t: &str) -> bool {
    let mut need = [0i32; 128];
    for b in t.as_bytes() { need[*b as usize] += 1; }
    for b in window.as_bytes() {
        let idx = *b as usize;
        if need[idx] > 0 { need[idx] -= 1; }
    }
    need.iter().all(|&x| x == 0)
}

fn brute_min_window(s: &str, t: &str) -> String {
    let n = s.len();
    let mut best = String::new();
    for i in 0..n {
        for j in i+1..=n {
            let w = &s[i..j];
            if contains_all(w, t) {
                if best.is_empty() || w.len() < best.len() {
                    best = w.to_string();
                }
            }
        }
    }
    best
}

fn main() {
    assert_eq!(min_window_with_all_chars("ADOBECODEBANC", "ABC"), "BANC");
    assert_eq!(min_window_with_all_chars("a", "a"), "a");
    assert_eq!(min_window_with_all_chars("a", "b"), "");
    for (s, t) in &[("ADOBECODE", "AOB"), ("BANC", "BANC"), ("abcd", "bc")] {
        let fast = min_window_with_all_chars(s, t);
        let slow = brute_min_window(s, t);
        assert_eq!(fast.len(), slow.len(), "length mismatch for s={} t={}: fast={} slow={}", s, t, fast, slow);
        if !fast.is_empty() { assert!(contains_all(&fast, t)); }
    }
    println!("ok");
}`,
    starter: `fn min_window_with_all_chars(s: &str, t: &str) -> String {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(min_window_with_all_chars("ADOBECODEBANC", "ABC"), "BANC");
    assert_eq!(min_window_with_all_chars("a", "b"), "");
    println!("ok");
}`,
    tags: ['sliding-window', 'string', 'hashmap', 'hard'],
  },
]

export default problems
