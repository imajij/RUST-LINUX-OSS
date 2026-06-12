import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch01-c-001',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Contains Duplicate',
    prompt: `Implement:

    fn contains_duplicate(nums: &[i32]) -> bool

Return true if any value appears at least twice in nums, or false if every element is distinct.
An empty slice and a single-element slice always return false.
Example: [1, 2, 3, 1] -> true`,
    hints: [
      'Insert each element into a HashSet and check whether insert returns false.',
      'A HashSet insert returns false when the element was already present.',
    ],
    solution: `use std::collections::HashSet;

fn contains_duplicate(nums: &[i32]) -> bool {
    let mut seen = HashSet::new();
    for &n in nums {
        if !seen.insert(n) {
            return true;
        }
    }
    false
}

fn main() {
    assert_eq!(contains_duplicate(&[1, 2, 3, 1]), true);
    assert_eq!(contains_duplicate(&[1, 2, 3, 4]), false);
    assert_eq!(contains_duplicate(&[]), false);
    assert_eq!(contains_duplicate(&[5]), false);
    assert_eq!(contains_duplicate(&[7, 7]), true);
    println!("ok");
}`,
    starter: `use std::collections::HashSet;

fn contains_duplicate(nums: &[i32]) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(contains_duplicate(&[1, 2, 3, 1]), true);
    assert_eq!(contains_duplicate(&[1, 2, 3, 4]), false);
    println!("ok");
}`,
    tags: ['array', 'hash-set'],
  },
  {
    id: 'ds-ch01-c-002',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Two Sum',
    prompt: `Implement:

    fn two_sum(nums: &[i32], target: i32) -> Option<(usize, usize)>

Find two distinct indices i and j such that nums[i] + nums[j] == target.
Return Some((i, j)) with i < j, or None if no such pair exists.
Each input has at most one solution.
Example: nums = [2, 7, 11, 15], target = 9 -> Some((0, 1))`,
    hints: [
      'Store each number with its index in a HashMap as you iterate.',
      'For each element, look up whether target minus that element is already in the map.',
    ],
    solution: `use std::collections::HashMap;

fn two_sum(nums: &[i32], target: i32) -> Option<(usize, usize)> {
    let mut map: HashMap<i32, usize> = HashMap::new();
    for (i, &n) in nums.iter().enumerate() {
        let complement = target - n;
        if let Some(&j) = map.get(&complement) {
            return Some((j, i));
        }
        map.insert(n, i);
    }
    None
}

fn main() {
    assert_eq!(two_sum(&[2, 7, 11, 15], 9), Some((0, 1)));
    assert_eq!(two_sum(&[3, 2, 4], 6), Some((1, 2)));
    assert_eq!(two_sum(&[3, 3], 6), Some((0, 1)));
    assert_eq!(two_sum(&[1, 2, 3], 10), None);
    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn two_sum(nums: &[i32], target: i32) -> Option<(usize, usize)> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(two_sum(&[2, 7, 11, 15], 9), Some((0, 1)));
    println!("ok");
}`,
    tags: ['array', 'hash-map'],
  },
  {
    id: 'ds-ch01-c-003',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Valid Anagram',
    prompt: `Implement:

    fn is_anagram(s: &str, t: &str) -> bool

Return true if t is an anagram of s, meaning both strings contain exactly the same characters with the same frequencies.
Both strings consist of lowercase ASCII letters only.
Example: s = "anagram", t = "nagaram" -> true; s = "rat", t = "car" -> false`,
    hints: [
      'Two strings that are anagrams must have equal length.',
      'Count character frequencies for s, then decrement for t and check nothing goes negative.',
    ],
    solution: `use std::collections::HashMap;

fn is_anagram(s: &str, t: &str) -> bool {
    if s.len() != t.len() {
        return false;
    }
    let mut counts: HashMap<char, i32> = HashMap::new();
    for c in s.chars() {
        *counts.entry(c).or_insert(0) += 1;
    }
    for c in t.chars() {
        let e = counts.entry(c).or_insert(0);
        *e -= 1;
        if *e < 0 {
            return false;
        }
    }
    true
}

fn main() {
    assert_eq!(is_anagram("anagram", "nagaram"), true);
    assert_eq!(is_anagram("rat", "car"), false);
    assert_eq!(is_anagram("", ""), true);
    assert_eq!(is_anagram("ab", "a"), false);
    assert_eq!(is_anagram("listen", "silent"), true);
    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn is_anagram(s: &str, t: &str) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(is_anagram("anagram", "nagaram"), true);
    assert_eq!(is_anagram("rat", "car"), false);
    println!("ok");
}`,
    tags: ['array', 'hash-map', 'string'],
  },
  {
    id: 'ds-ch01-c-004',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Array Intersection',
    prompt: `Implement:

    fn array_intersection(a: &[i32], b: &[i32]) -> Vec<i32>

Return a sorted list of unique integers that appear in both a and b.
Duplicates within a single array are ignored.
Example: a = [4, 9, 5], b = [9, 4, 9, 8, 4] -> [4, 9]`,
    hints: [
      'Convert both slices to HashSets, then compute the intersection.',
      'Collect the result into a Vec and sort it before returning.',
    ],
    solution: `use std::collections::HashSet;

fn array_intersection(a: &[i32], b: &[i32]) -> Vec<i32> {
    let set_a: HashSet<i32> = a.iter().cloned().collect();
    let set_b: HashSet<i32> = b.iter().cloned().collect();
    let mut result: Vec<i32> = set_a.intersection(&set_b).cloned().collect();
    result.sort();
    result
}

fn main() {
    assert_eq!(array_intersection(&[1, 2, 2, 1], &[2, 2]), vec![2]);
    assert_eq!(array_intersection(&[4, 9, 5], &[9, 4, 9, 8, 4]), vec![4, 9]);
    assert_eq!(array_intersection(&[1, 2, 3], &[4, 5, 6]), vec![]);
    assert_eq!(array_intersection(&[], &[1, 2]), vec![]);
    println!("ok");
}`,
    starter: `use std::collections::HashSet;

fn array_intersection(a: &[i32], b: &[i32]) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(array_intersection(&[4, 9, 5], &[9, 4, 9, 8, 4]), vec![4, 9]);
    println!("ok");
}`,
    tags: ['array', 'hash-set'],
  },
  {
    id: 'ds-ch01-c-005',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Prefix Sum Array',
    prompt: `Implement:

    fn prefix_sum(nums: &[i32]) -> Vec<i32>

Return a new array where element i is the sum of nums[0..=i].
An empty input returns an empty output.
Example: [1, 2, 3, 4] -> [1, 3, 6, 10]`,
    hints: [
      'Maintain a running total and push it after each element.',
      'The result has the same length as the input.',
    ],
    solution: `fn prefix_sum(nums: &[i32]) -> Vec<i32> {
    let mut result = Vec::with_capacity(nums.len());
    let mut running = 0;
    for &n in nums {
        running += n;
        result.push(running);
    }
    result
}

fn main() {
    assert_eq!(prefix_sum(&[1, 2, 3, 4]), vec![1, 3, 6, 10]);
    assert_eq!(prefix_sum(&[5]), vec![5]);
    assert_eq!(prefix_sum(&[]), vec![]);
    assert_eq!(prefix_sum(&[-1, 2, -3, 4]), vec![-1, 1, -2, 2]);
    println!("ok");
}`,
    starter: `fn prefix_sum(nums: &[i32]) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(prefix_sum(&[1, 2, 3, 4]), vec![1, 3, 6, 10]);
    println!("ok");
}`,
    tags: ['array', 'prefix-sum'],
  },
  {
    id: 'ds-ch01-c-006',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Majority Element',
    prompt: `Implement:

    fn majority_element(nums: &[i32]) -> i32

Find the element that appears more than n/2 times in nums, where n = nums.len().
You may assume the majority element always exists.
Example: [2, 2, 1, 1, 1, 2, 2] -> 2`,
    hints: [
      'Count frequencies with a HashMap and return the first element whose count exceeds n/2.',
      'Boyer-Moore voting is O(1) space, but a HashMap works fine here.',
    ],
    solution: `use std::collections::HashMap;

fn majority_element(nums: &[i32]) -> i32 {
    let mut counts: HashMap<i32, usize> = HashMap::new();
    let threshold = nums.len() / 2;
    for &n in nums {
        let c = counts.entry(n).or_insert(0);
        *c += 1;
        if *c > threshold {
            return n;
        }
    }
    unreachable!("majority element always exists per problem constraints")
}

fn main() {
    assert_eq!(majority_element(&[3, 2, 3]), 3);
    assert_eq!(majority_element(&[2, 2, 1, 1, 1, 2, 2]), 2);
    assert_eq!(majority_element(&[1]), 1);
    assert_eq!(majority_element(&[6, 6, 6, 1, 2]), 6);
    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn majority_element(nums: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(majority_element(&[3, 2, 3]), 3);
    assert_eq!(majority_element(&[2, 2, 1, 1, 1, 2, 2]), 2);
    println!("ok");
}`,
    tags: ['array', 'hash-map', 'frequency'],
  },
  {
    id: 'ds-ch01-c-007',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Array Union',
    prompt: `Implement:

    fn array_union(a: &[i32], b: &[i32]) -> Vec<i32>

Return a sorted list of every unique integer that appears in either a or b (or both).
Example: a = [1, 2, 3], b = [3, 4, 5] -> [1, 2, 3, 4, 5]`,
    hints: [
      'Collect all elements from both slices into a single HashSet to deduplicate.',
      'Convert the set to a Vec, sort it, and return.',
    ],
    solution: `use std::collections::HashSet;

fn array_union(a: &[i32], b: &[i32]) -> Vec<i32> {
    let mut set: HashSet<i32> = a.iter().cloned().collect();
    for &x in b {
        set.insert(x);
    }
    let mut result: Vec<i32> = set.into_iter().collect();
    result.sort();
    result
}

fn main() {
    assert_eq!(array_union(&[1, 2, 3], &[3, 4, 5]), vec![1, 2, 3, 4, 5]);
    assert_eq!(array_union(&[1, 1, 2], &[2, 3]), vec![1, 2, 3]);
    assert_eq!(array_union(&[], &[1]), vec![1]);
    assert_eq!(array_union(&[5, 5], &[5]), vec![5]);
    println!("ok");
}`,
    starter: `use std::collections::HashSet;

fn array_union(a: &[i32], b: &[i32]) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(array_union(&[1, 2, 3], &[3, 4, 5]), vec![1, 2, 3, 4, 5]);
    println!("ok");
}`,
    tags: ['array', 'hash-set'],
  },
  {
    id: 'ds-ch01-c-008',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Character Frequency Map',
    prompt: `Implement:

    fn char_frequency(s: &str) -> HashMap<char, usize>

Return a map from each character in s to the number of times it appears.
An empty string returns an empty map.
Example: "hello" -> { h:1, e:1, l:2, o:1 }`,
    hints: [
      'Iterate over the characters of s with .chars().',
      'Use the entry API with or_insert(0) to initialise counts.',
    ],
    solution: `use std::collections::HashMap;

fn char_frequency(s: &str) -> HashMap<char, usize> {
    let mut map = HashMap::new();
    for c in s.chars() {
        *map.entry(c).or_insert(0) += 1;
    }
    map
}

fn main() {
    let f = char_frequency("hello");
    assert_eq!(f[&'h'], 1);
    assert_eq!(f[&'e'], 1);
    assert_eq!(f[&'l'], 2);
    assert_eq!(f[&'o'], 1);

    let f2 = char_frequency("");
    assert!(f2.is_empty());

    let f3 = char_frequency("aaa");
    assert_eq!(f3[&'a'], 3);

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn char_frequency(s: &str) -> HashMap<char, usize> {
    // TODO
    todo!()
}

fn main() {
    let f = char_frequency("hello");
    assert_eq!(f[&'l'], 2);
    println!("ok");
}`,
    tags: ['hash-map', 'string', 'frequency'],
  },
  {
    id: 'ds-ch01-c-009',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Running Maximum',
    prompt: `Implement:

    fn running_max(nums: &[i32]) -> Vec<i32>

Return an array where element i is the maximum value among nums[0..=i].
Example: [3, 1, 4, 1, 5, 9, 2, 6] -> [3, 3, 4, 4, 5, 9, 9, 9]`,
    hints: [
      'Keep track of the current maximum and update it as you iterate.',
      'Push the current maximum after processing each element.',
    ],
    solution: `fn running_max(nums: &[i32]) -> Vec<i32> {
    let mut result = Vec::with_capacity(nums.len());
    let mut current_max = i32::MIN;
    for &n in nums {
        if n > current_max {
            current_max = n;
        }
        result.push(current_max);
    }
    result
}

fn main() {
    assert_eq!(running_max(&[3, 1, 4, 1, 5, 9, 2, 6]), vec![3, 3, 4, 4, 5, 9, 9, 9]);
    assert_eq!(running_max(&[5, 4, 3, 2, 1]), vec![5, 5, 5, 5, 5]);
    assert_eq!(running_max(&[1, 2, 3, 4, 5]), vec![1, 2, 3, 4, 5]);
    assert_eq!(running_max(&[7]), vec![7]);
    println!("ok");
}`,
    starter: `fn running_max(nums: &[i32]) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(running_max(&[3, 1, 4, 1, 5, 9, 2, 6]), vec![3, 3, 4, 4, 5, 9, 9, 9]);
    println!("ok");
}`,
    tags: ['array', 'iterator'],
  },
  {
    id: 'ds-ch01-c-010',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Unique Elements',
    prompt: `Implement:

    fn unique_count(nums: &[i32]) -> usize

Return the number of distinct values in nums.
An empty slice returns 0.
Example: [1, 2, 2, 3, 3, 3] -> 3`,
    hints: [
      'Collect nums into a HashSet and return its length.',
      'A HashSet automatically discards duplicates.',
    ],
    solution: `use std::collections::HashSet;

fn unique_count(nums: &[i32]) -> usize {
    let set: HashSet<i32> = nums.iter().cloned().collect();
    set.len()
}

fn main() {
    assert_eq!(unique_count(&[1, 2, 2, 3, 3, 3]), 3);
    assert_eq!(unique_count(&[5, 5, 5, 5]), 1);
    assert_eq!(unique_count(&[1, 2, 3, 4]), 4);
    assert_eq!(unique_count(&[]), 0);
    println!("ok");
}`,
    starter: `use std::collections::HashSet;

fn unique_count(nums: &[i32]) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(unique_count(&[1, 2, 2, 3, 3, 3]), 3);
    assert_eq!(unique_count(&[]), 0);
    println!("ok");
}`,
    tags: ['array', 'hash-set'],
  },
  {
    id: 'ds-ch01-c-011',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Group Anagrams',
    prompt: `Implement:

    fn group_anagrams(words: Vec<String>) -> Vec<Vec<String>>

Group the input strings so that each inner Vec contains all strings that are anagrams of each other.
The order of groups and of strings within each group does not matter.
Example: ["eat","tea","tan","ate","nat","bat"] -> [["ate","eat","tea"],["nat","tan"],["bat"]]`,
    hints: [
      'Sort each word to produce a canonical key, then bucket words by that key.',
      'Use a HashMap<Vec<u8>, Vec<String>> where the key is the sorted bytes of each word.',
    ],
    solution: `use std::collections::HashMap;

fn group_anagrams(words: Vec<String>) -> Vec<Vec<String>> {
    let mut map: HashMap<Vec<u8>, Vec<String>> = HashMap::new();
    for word in words {
        let mut key: Vec<u8> = word.bytes().collect();
        key.sort();
        map.entry(key).or_default().push(word);
    }
    let mut result: Vec<Vec<String>> = map.into_values().collect();
    for group in &mut result {
        group.sort();
    }
    result.sort();
    result
}

fn main() {
    let input: Vec<String> = vec!["eat", "tea", "tan", "ate", "nat", "bat"]
        .into_iter().map(String::from).collect();
    let mut got = group_anagrams(input);
    got.sort();
    let mut expected: Vec<Vec<String>> = vec![
        vec!["ate", "eat", "tea"],
        vec!["bat"],
        vec!["nat", "tan"],
    ].into_iter().map(|v| v.into_iter().map(String::from).collect()).collect();
    expected.sort();
    assert_eq!(got, expected);

    let single: Vec<String> = vec!["abc"].into_iter().map(String::from).collect();
    assert_eq!(group_anagrams(single).len(), 1);

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn group_anagrams(words: Vec<String>) -> Vec<Vec<String>> {
    // TODO
    todo!()
}

fn main() {
    let input: Vec<String> = vec!["eat", "tea", "tan", "ate", "nat", "bat"]
        .into_iter().map(String::from).collect();
    assert_eq!(group_anagrams(input).len(), 3);
    println!("ok");
}`,
    tags: ['array', 'hash-map', 'string', 'sorting'],
  },
  {
    id: 'ds-ch01-c-012',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Top K Frequent Elements',
    prompt: `Implement:

    fn top_k_frequent(nums: &[i32], k: usize) -> Vec<i32>

Return the k most frequently occurring integers in nums, in any order.
You may assume k is always valid and the answer is unique.
Example: nums = [1,1,1,2,2,3], k = 2 -> [1, 2]`,
    hints: [
      'Count frequencies with a HashMap, then sort entries by frequency descending.',
      'Take the first k entries from the sorted list.',
    ],
    solution: `use std::collections::HashMap;

fn top_k_frequent(nums: &[i32], k: usize) -> Vec<i32> {
    let mut counts: HashMap<i32, usize> = HashMap::new();
    for &n in nums {
        *counts.entry(n).or_insert(0) += 1;
    }
    let mut pairs: Vec<(i32, usize)> = counts.into_iter().collect();
    pairs.sort_by(|a, b| b.1.cmp(&a.1).then(a.0.cmp(&b.0)));
    pairs.into_iter().take(k).map(|(n, _)| n).collect()
}

fn brute_top_k(nums: &[i32], k: usize) -> Vec<i32> {
    let mut counts: HashMap<i32, usize> = HashMap::new();
    for &n in nums {
        *counts.entry(n).or_insert(0) += 1;
    }
    let mut pairs: Vec<(i32, usize)> = counts.into_iter().collect();
    pairs.sort_by(|a, b| b.1.cmp(&a.1).then(a.0.cmp(&b.0)));
    pairs.into_iter().take(k).map(|(n, _)| n).collect()
}

fn main() {
    let mut r = top_k_frequent(&[1, 1, 1, 2, 2, 3], 2);
    r.sort();
    assert_eq!(r, vec![1, 2]);

    let mut r2 = top_k_frequent(&[1], 1);
    r2.sort();
    assert_eq!(r2, vec![1]);

    let inputs = vec![
        (vec![4, 4, 1, 1, 1, 2], 2usize),
        (vec![1, 2, 3, 3, 2, 1, 1], 3),
        (vec![5, 5, 5], 1),
    ];
    for (arr, k) in inputs {
        let mut a = top_k_frequent(&arr, k);
        let mut b = brute_top_k(&arr, k);
        a.sort();
        b.sort();
        assert_eq!(a, b);
    }

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn top_k_frequent(nums: &[i32], k: usize) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    let mut r = top_k_frequent(&[1, 1, 1, 2, 2, 3], 2);
    r.sort();
    assert_eq!(r, vec![1, 2]);
    println!("ok");
}`,
    tags: ['array', 'hash-map', 'sorting', 'frequency'],
  },
  {
    id: 'ds-ch01-c-013',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Product of Array Except Self',
    prompt: `Implement:

    fn product_except_self(nums: &[i32]) -> Vec<i32>

Return an array output where output[i] is the product of every element in nums except nums[i].
Do not use division. Solve in O(n) time using prefix and suffix products.
Example: [1, 2, 3, 4] -> [24, 12, 8, 6]`,
    hints: [
      'Build a left-products pass: result[i] = product of nums[0..i].',
      'Then multiply a running right product from the back into result.',
    ],
    solution: `fn product_except_self(nums: &[i32]) -> Vec<i32> {
    let n = nums.len();
    let mut result = vec![1i32; n];
    let mut left = 1i32;
    for i in 0..n {
        result[i] = left;
        left *= nums[i];
    }
    let mut right = 1i32;
    for i in (0..n).rev() {
        result[i] *= right;
        right *= nums[i];
    }
    result
}

fn brute_product(nums: &[i32]) -> Vec<i32> {
    let n = nums.len();
    let mut result = vec![1i32; n];
    for i in 0..n {
        for j in 0..n {
            if i != j {
                result[i] *= nums[j];
            }
        }
    }
    result
}

fn main() {
    assert_eq!(product_except_self(&[1, 2, 3, 4]), vec![24, 12, 8, 6]);
    assert_eq!(product_except_self(&[-1, 1, 0, -3, 3]), vec![0, 0, 9, 0, 0]);

    let cases = vec![
        vec![1, 2, 3, 4],
        vec![2, 3, 4, 5],
        vec![1, 1, 1, 1],
        vec![-1, 2, -3, 4],
    ];
    for c in cases {
        assert_eq!(product_except_self(&c), brute_product(&c));
    }

    println!("ok");
}`,
    starter: `fn product_except_self(nums: &[i32]) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(product_except_self(&[1, 2, 3, 4]), vec![24, 12, 8, 6]);
    println!("ok");
}`,
    tags: ['array', 'prefix-sum'],
  },
  {
    id: 'ds-ch01-c-014',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Subarray Sum Equals K',
    prompt: `Implement:

    fn subarray_sum_equals_k(nums: &[i32], k: i32) -> i32

Count the total number of contiguous subarrays whose elements sum to k.
The array may contain negative numbers.
Example: nums = [1, 1, 1], k = 2 -> 2`,
    hints: [
      'Use a running prefix sum and a HashMap from prefix sum to count.',
      'At each position, check whether prefix_sum - k already exists in the map.',
    ],
    solution: `use std::collections::HashMap;

fn subarray_sum_equals_k(nums: &[i32], k: i32) -> i32 {
    let mut count = 0;
    let mut prefix_sum = 0;
    let mut map: HashMap<i32, i32> = HashMap::new();
    map.insert(0, 1);
    for &n in nums {
        prefix_sum += n;
        if let Some(&c) = map.get(&(prefix_sum - k)) {
            count += c;
        }
        *map.entry(prefix_sum).or_insert(0) += 1;
    }
    count
}

fn brute_subarray_sum(nums: &[i32], k: i32) -> i32 {
    let n = nums.len();
    let mut count = 0;
    for i in 0..n {
        let mut sum = 0;
        for j in i..n {
            sum += nums[j];
            if sum == k {
                count += 1;
            }
        }
    }
    count
}

fn main() {
    assert_eq!(subarray_sum_equals_k(&[1, 1, 1], 2), 2);
    assert_eq!(subarray_sum_equals_k(&[1, 2, 3], 3), 2);
    assert_eq!(subarray_sum_equals_k(&[1], 0), 0);

    let cases = vec![
        (&[1, 2, 3, 4][..], 3i32),
        (&[1, -1, 0][..], 0),
        (&[3, 4, 7, 2, -3, 1, 4, 2][..], 7),
    ];
    for (arr, k) in cases {
        assert_eq!(subarray_sum_equals_k(arr, k), brute_subarray_sum(arr, k));
    }

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn subarray_sum_equals_k(nums: &[i32], k: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(subarray_sum_equals_k(&[1, 1, 1], 2), 2);
    println!("ok");
}`,
    tags: ['array', 'hash-map', 'prefix-sum'],
  },
  {
    id: 'ds-ch01-c-015',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Isomorphic Strings',
    prompt: `Implement:

    fn is_isomorphic(s: &str, t: &str) -> bool

Two strings are isomorphic if each character in s can be consistently replaced to produce t, with a one-to-one mapping.
No two characters in s may map to the same character in t, and vice versa.
Example: s = "egg", t = "add" -> true; s = "foo", t = "bar" -> false`,
    hints: [
      'Maintain two maps: one from s-char to t-char, and one from t-char to s-char.',
      'At each position, verify both maps are consistent; return false on any conflict.',
    ],
    solution: `use std::collections::HashMap;

fn is_isomorphic(s: &str, t: &str) -> bool {
    if s.len() != t.len() {
        return false;
    }
    let mut s_to_t: HashMap<char, char> = HashMap::new();
    let mut t_to_s: HashMap<char, char> = HashMap::new();
    for (sc, tc) in s.chars().zip(t.chars()) {
        match (s_to_t.get(&sc), t_to_s.get(&tc)) {
            (Some(&mapped_t), _) if mapped_t != tc => return false,
            (_, Some(&mapped_s)) if mapped_s != sc => return false,
            (None, None) => {
                s_to_t.insert(sc, tc);
                t_to_s.insert(tc, sc);
            }
            _ => {}
        }
    }
    true
}

fn main() {
    assert_eq!(is_isomorphic("egg", "add"), true);
    assert_eq!(is_isomorphic("foo", "bar"), false);
    assert_eq!(is_isomorphic("paper", "title"), true);
    assert_eq!(is_isomorphic("ab", "aa"), false);
    assert_eq!(is_isomorphic("", ""), true);
    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn is_isomorphic(s: &str, t: &str) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(is_isomorphic("egg", "add"), true);
    assert_eq!(is_isomorphic("foo", "bar"), false);
    println!("ok");
}`,
    tags: ['hash-map', 'string'],
  },
  {
    id: 'ds-ch01-c-016',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Range Sum Queries',
    prompt: `Implement:

    fn range_sum_query(nums: &[i32], queries: &[(usize, usize)]) -> Vec<i32>

Given an integer array and a list of (left, right) index pairs, return the sum of nums[left..=right] for each query.
Build a prefix sum array to answer all queries in O(1) each after O(n) preprocessing.
Example: nums = [1,3,5,7,9], query (1,3) -> 15`,
    hints: [
      'Build a prefix array where prefix[i+1] = prefix[i] + nums[i].',
      'Answer each query as prefix[right+1] - prefix[left].',
    ],
    solution: `fn range_sum_query(nums: &[i32], queries: &[(usize, usize)]) -> Vec<i32> {
    let mut prefix = vec![0i32; nums.len() + 1];
    for i in 0..nums.len() {
        prefix[i + 1] = prefix[i] + nums[i];
    }
    queries.iter().map(|&(l, r)| prefix[r + 1] - prefix[l]).collect()
}

fn brute_range_sum(nums: &[i32], queries: &[(usize, usize)]) -> Vec<i32> {
    queries.iter().map(|&(l, r)| nums[l..=r].iter().sum()).collect()
}

fn main() {
    let nums = [1, 3, 5, 7, 9];
    assert_eq!(range_sum_query(&nums, &[(0, 2)]), vec![9]);
    assert_eq!(range_sum_query(&nums, &[(1, 3)]), vec![15]);
    assert_eq!(range_sum_query(&nums, &[(0, 4)]), vec![25]);
    assert_eq!(range_sum_query(&nums, &[(2, 2)]), vec![5]);

    let queries = vec![(0, 2), (1, 3), (0, 4), (2, 4)];
    assert_eq!(range_sum_query(&nums, &queries), brute_range_sum(&nums, &queries));

    println!("ok");
}`,
    starter: `fn range_sum_query(nums: &[i32], queries: &[(usize, usize)]) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    let nums = [1, 3, 5, 7, 9];
    assert_eq!(range_sum_query(&nums, &[(1, 3)]), vec![15]);
    println!("ok");
}`,
    tags: ['array', 'prefix-sum'],
  },
  {
    id: 'ds-ch01-c-017',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Word Pattern Match',
    prompt: `Implement:

    fn word_pattern(pattern: &str, s: &str) -> bool

Return true if the words in s (space-separated) follow the same bijective pattern as the characters in pattern.
Each pattern character maps to exactly one word, and each word maps to exactly one pattern character.
Example: pattern = "abba", s = "dog cat cat dog" -> true`,
    hints: [
      'Split s on whitespace and zip with the chars of pattern.',
      'Use two maps (char->word and word->char) to enforce the bijection.',
    ],
    solution: `use std::collections::HashMap;

fn word_pattern(pattern: &str, s: &str) -> bool {
    let words: Vec<&str> = s.split_whitespace().collect();
    let chars: Vec<char> = pattern.chars().collect();
    if chars.len() != words.len() {
        return false;
    }
    let mut c_to_w: HashMap<char, &str> = HashMap::new();
    let mut w_to_c: HashMap<&str, char> = HashMap::new();
    for (&c, &w) in chars.iter().zip(words.iter()) {
        match (c_to_w.get(&c), w_to_c.get(w)) {
            (Some(&mw), _) if mw != w => return false,
            (_, Some(&mc)) if mc != c => return false,
            (None, None) => {
                c_to_w.insert(c, w);
                w_to_c.insert(w, c);
            }
            _ => {}
        }
    }
    true
}

fn main() {
    assert_eq!(word_pattern("abba", "dog cat cat dog"), true);
    assert_eq!(word_pattern("abba", "dog cat cat fish"), false);
    assert_eq!(word_pattern("aaaa", "dog cat cat dog"), false);
    assert_eq!(word_pattern("abba", "dog dog dog dog"), false);
    assert_eq!(word_pattern("a", "dog"), true);
    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn word_pattern(pattern: &str, s: &str) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(word_pattern("abba", "dog cat cat dog"), true);
    assert_eq!(word_pattern("abba", "dog cat cat fish"), false);
    println!("ok");
}`,
    tags: ['hash-map', 'string'],
  },
  {
    id: 'ds-ch01-c-018',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Encode and Decode Strings',
    prompt: `Implement:

    fn encode(strings: &[String]) -> String
    fn decode(encoded: &str) -> Vec<String>

Design a stateless encode/decode scheme for a list of arbitrary strings.
The encoded format must survive round-tripping even if individual strings contain any character.
Example: ["hello", "world"] encodes and decodes back to ["hello", "world"]`,
    hints: [
      'Prefix each string with its byte length followed by a delimiter character such as #.',
      'In decode, parse the length, skip the delimiter, then slice out exactly that many bytes.',
    ],
    solution: `fn encode(strings: &[String]) -> String {
    let mut result = String::new();
    for s in strings {
        result.push_str(&s.len().to_string());
        result.push('#');
        result.push_str(s);
    }
    result
}

fn decode(encoded: &str) -> Vec<String> {
    let mut result = Vec::new();
    let bytes = encoded.as_bytes();
    let mut i = 0;
    while i < bytes.len() {
        let mut j = i;
        while bytes[j] != b'#' {
            j += 1;
        }
        let len: usize = encoded[i..j].parse().unwrap();
        let start = j + 1;
        result.push(encoded[start..start + len].to_string());
        i = start + len;
    }
    result
}

fn main() {
    let words: Vec<String> = vec!["hello", "world", "foo"].iter().map(|s| s.to_string()).collect();
    assert_eq!(decode(&encode(&words)), words);

    let with_hash: Vec<String> = vec!["a#b", "c##d", ""].iter().map(|s| s.to_string()).collect();
    assert_eq!(decode(&encode(&with_hash)), with_hash);

    let empty: Vec<String> = vec![];
    assert_eq!(decode(&encode(&empty)), empty);

    println!("ok");
}`,
    starter: `fn encode(strings: &[String]) -> String {
    // TODO
    todo!()
}

fn decode(encoded: &str) -> Vec<String> {
    // TODO
    todo!()
}

fn main() {
    let words: Vec<String> = vec!["hello", "world"].iter().map(|s| s.to_string()).collect();
    assert_eq!(decode(&encode(&words)), words);
    println!("ok");
}`,
    tags: ['array', 'string', 'design'],
  },
  {
    id: 'ds-ch01-c-019',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Maximum Subarray Sum',
    prompt: `Implement:

    fn max_subarray_sum(nums: &[i32]) -> i32

Find the contiguous subarray with the largest sum and return that sum.
The array contains at least one element and may include negative numbers.
Example: [-2, 1, -3, 4, -1, 2, 1, -5, 4] -> 6`,
    hints: [
      'Use the Kadane algorithm: at each index decide whether to start a new subarray or extend the current one.',
      'Track a running sum and the global maximum simultaneously.',
    ],
    solution: `fn max_subarray_sum(nums: &[i32]) -> i32 {
    if nums.is_empty() {
        return 0;
    }
    let mut max_sum = nums[0];
    let mut current = nums[0];
    for &n in &nums[1..] {
        current = n.max(current + n);
        max_sum = max_sum.max(current);
    }
    max_sum
}

fn brute_max_subarray(nums: &[i32]) -> i32 {
    let n = nums.len();
    let mut best = i32::MIN;
    for i in 0..n {
        let mut sum = 0;
        for j in i..n {
            sum += nums[j];
            if sum > best {
                best = sum;
            }
        }
    }
    best
}

fn main() {
    assert_eq!(max_subarray_sum(&[-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6);
    assert_eq!(max_subarray_sum(&[1]), 1);
    assert_eq!(max_subarray_sum(&[5, 4, -1, 7, 8]), 23);

    let cases = vec![
        vec![-2, 1, -3, 4, -1, 2, 1, -5, 4],
        vec![1, 2, 3, 4],
        vec![-1, -2, -3],
        vec![2, -1, 2, 3, -5, 4],
    ];
    for c in cases {
        assert_eq!(max_subarray_sum(&c), brute_max_subarray(&c));
    }

    println!("ok");
}`,
    starter: `fn max_subarray_sum(nums: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(max_subarray_sum(&[-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6);
    println!("ok");
}`,
    tags: ['array', 'dynamic-programming'],
  },
  {
    id: 'ds-ch01-c-020',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Two Sum All Pairs',
    prompt: `Implement:

    fn two_sum_all_pairs(nums: &[i32], target: i32) -> Vec<(usize, usize)>

Return all pairs (i, j) with i < j such that nums[i] + nums[j] == target.
The array may contain duplicate values, so multiple pairs are possible.
Example: nums = [1, 2, 3, 2, 1], target = 3 -> [(0,1),(0,3),(2,4),(1,4)...] (order may vary)`,
    hints: [
      'Maintain a HashMap from value to list of indices seen so far.',
      'For each element, look up whether target minus it already exists and record all those index pairs.',
    ],
    solution: `use std::collections::HashMap;

fn two_sum_all_pairs(nums: &[i32], target: i32) -> Vec<(usize, usize)> {
    let mut map: HashMap<i32, Vec<usize>> = HashMap::new();
    let mut result = Vec::new();
    for (i, &n) in nums.iter().enumerate() {
        let complement = target - n;
        if let Some(indices) = map.get(&complement) {
            for &j in indices {
                result.push((j, i));
            }
        }
        map.entry(n).or_default().push(i);
    }
    result
}

fn brute_two_sum_all(nums: &[i32], target: i32) -> Vec<(usize, usize)> {
    let n = nums.len();
    let mut result = Vec::new();
    for i in 0..n {
        for j in (i+1)..n {
            if nums[i] + nums[j] == target {
                result.push((i, j));
            }
        }
    }
    result
}

fn main() {
    let mut r = two_sum_all_pairs(&[1, 2, 3, 2, 1], 3);
    r.sort();
    let mut e = brute_two_sum_all(&[1, 2, 3, 2, 1], 3);
    e.sort();
    assert_eq!(r, e);

    let mut r2 = two_sum_all_pairs(&[1, 1, 1, 1], 2);
    r2.sort();
    let mut e2 = brute_two_sum_all(&[1, 1, 1, 1], 2);
    e2.sort();
    assert_eq!(r2, e2);

    let cases: Vec<(&[i32], i32)> = vec![
        (&[1, 2, 3, 4, 5], 5),
        (&[0, 0, 0, 0], 0),
    ];
    for (arr, t) in cases {
        let mut a = two_sum_all_pairs(arr, t);
        let mut b = brute_two_sum_all(arr, t);
        a.sort();
        b.sort();
        assert_eq!(a, b);
    }

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn two_sum_all_pairs(nums: &[i32], target: i32) -> Vec<(usize, usize)> {
    // TODO
    todo!()
}

fn main() {
    let mut r = two_sum_all_pairs(&[1, 2, 3, 2, 1], 3);
    r.sort();
    assert!(r.len() >= 2);
    println!("ok");
}`,
    tags: ['array', 'hash-map'],
  },
  {
    id: 'ds-ch01-c-021',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Longest Consecutive Sequence',
    prompt: `Implement:

    fn longest_consecutive(nums: &[i32]) -> i32

Find the length of the longest sequence of consecutive integers that are all present in nums.
You must solve it in O(n) time.
Example: [100, 4, 200, 1, 3, 2] -> 4  (the sequence 1, 2, 3, 4)`,
    hints: [
      'Insert all numbers into a HashSet for O(1) lookup.',
      'Start a count only when the number is the beginning of a streak (n-1 is not in the set).',
    ],
    solution: `use std::collections::HashSet;

fn longest_consecutive(nums: &[i32]) -> i32 {
    let set: HashSet<i32> = nums.iter().cloned().collect();
    let mut best = 0;
    for &n in &set {
        if !set.contains(&(n - 1)) {
            let mut length = 1;
            let mut current = n;
            while set.contains(&(current + 1)) {
                current += 1;
                length += 1;
            }
            best = best.max(length);
        }
    }
    best
}

fn brute_longest_consecutive(nums: &[i32]) -> i32 {
    if nums.is_empty() { return 0; }
    let mut sorted = nums.to_vec();
    sorted.sort();
    sorted.dedup();
    let mut best = 1;
    let mut current = 1;
    for i in 1..sorted.len() {
        if sorted[i] == sorted[i-1] + 1 {
            current += 1;
            if current > best { best = current; }
        } else {
            current = 1;
        }
    }
    best
}

fn main() {
    assert_eq!(longest_consecutive(&[100, 4, 200, 1, 3, 2]), 4);
    assert_eq!(longest_consecutive(&[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]), 9);
    assert_eq!(longest_consecutive(&[]), 0);
    assert_eq!(longest_consecutive(&[1]), 1);

    let cases = vec![
        vec![100, 4, 200, 1, 3, 2],
        vec![0, 3, 7, 2, 5, 8, 4, 6, 0, 1],
        vec![1, 2, 3, 4, 5],
        vec![5, 4, 3, 2, 1],
    ];
    for c in cases {
        assert_eq!(longest_consecutive(&c), brute_longest_consecutive(&c));
    }

    println!("ok");
}`,
    starter: `use std::collections::HashSet;

fn longest_consecutive(nums: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(longest_consecutive(&[100, 4, 200, 1, 3, 2]), 4);
    println!("ok");
}`,
    tags: ['array', 'hash-set'],
  },
  {
    id: 'ds-ch01-c-022',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Valid Sudoku Board',
    prompt: `Implement:

    fn is_valid_sudoku_row_cols(board: &[[u8; 9]; 9]) -> bool

Determine if a 9x9 Sudoku board is valid according to these rules: each row contains digits 1-9 with no repeats, each column contains digits 1-9 with no repeats, and each of the nine 3x3 sub-boxes contains digits 1-9 with no repeats.
The value 0 represents an empty cell. Only filled cells need to be validated.
Example: A partially filled but valid board -> true`,
    hints: [
      'Check rows, columns, and 3x3 boxes separately using a HashSet for each.',
      'For the 3x3 boxes, iterate box_row in 0..3 and box_col in 0..3.',
    ],
    solution: `use std::collections::HashSet;

fn is_valid_sudoku_row_cols(board: &[[u8; 9]; 9]) -> bool {
    for i in 0..9 {
        let mut row_seen = HashSet::new();
        let mut col_seen = HashSet::new();
        for j in 0..9 {
            let rv = board[i][j];
            if rv != 0 {
                if !row_seen.insert(rv) { return false; }
            }
            let cv = board[j][i];
            if cv != 0 {
                if !col_seen.insert(cv) { return false; }
            }
        }
    }
    for box_row in 0..3 {
        for box_col in 0..3 {
            let mut seen = HashSet::new();
            for r in 0..3 {
                for c in 0..3 {
                    let v = board[box_row * 3 + r][box_col * 3 + c];
                    if v != 0 && !seen.insert(v) { return false; }
                }
            }
        }
    }
    true
}

fn main() {
    let valid: [[u8; 9]; 9] = [
        [5,3,0, 0,7,0, 0,0,0],
        [6,0,0, 1,9,5, 0,0,0],
        [0,9,8, 0,0,0, 0,6,0],
        [8,0,0, 0,6,0, 0,0,3],
        [4,0,0, 8,0,3, 0,0,1],
        [7,0,0, 0,2,0, 0,0,6],
        [0,6,0, 0,0,0, 2,8,0],
        [0,0,0, 4,1,9, 0,0,5],
        [0,0,0, 0,8,0, 0,7,9],
    ];
    assert_eq!(is_valid_sudoku_row_cols(&valid), true);

    let mut invalid = valid;
    invalid[0][0] = 3;
    assert_eq!(is_valid_sudoku_row_cols(&invalid), false);

    let empty: [[u8; 9]; 9] = [[0; 9]; 9];
    assert_eq!(is_valid_sudoku_row_cols(&empty), true);

    println!("ok");
}`,
    starter: `use std::collections::HashSet;

fn is_valid_sudoku_row_cols(board: &[[u8; 9]; 9]) -> bool {
    // TODO
    todo!()
}

fn main() {
    let empty: [[u8; 9]; 9] = [[0; 9]; 9];
    assert_eq!(is_valid_sudoku_row_cols(&empty), true);
    println!("ok");
}`,
    tags: ['array', 'hash-set', 'matrix'],
  },
  {
    id: 'ds-ch01-c-023',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Minimum Window Covering All Targets',
    prompt: `Implement:

    fn min_window_containing_all(s: &[i32], targets: &[i32]) -> Option<(usize, usize)>

Find the shortest contiguous subarray of s that contains every value in targets at least once.
Return Some((left, right)) for the inclusive indices of the shortest such window, or None if no window exists.
Example: s = [1,2,3,1,2], targets = [1,2] -> Some window of length 2`,
    hints: [
      'Use a sliding window with two pointers; expand right until all targets are covered.',
      'Then contract left as much as possible while still covering all targets.',
    ],
    solution: `use std::collections::HashMap;

fn min_window_containing_all(s: &[i32], targets: &[i32]) -> Option<(usize, usize)> {
    if targets.is_empty() || s.is_empty() { return None; }
    let mut need: HashMap<i32, i32> = HashMap::new();
    for &t in targets {
        *need.entry(t).or_insert(0) += 1;
    }
    let mut have: HashMap<i32, i32> = HashMap::new();
    let required = need.len();
    let mut formed = 0;
    let mut left = 0;
    let mut best: Option<(usize, usize)> = None;

    for right in 0..s.len() {
        let c = s[right];
        *have.entry(c).or_insert(0) += 1;
        if let Some(&needed) = need.get(&c) {
            if have[&c] == needed {
                formed += 1;
            }
        }
        while formed == required {
            let window = (left, right);
            match best {
                None => best = Some(window),
                Some((bl, br)) if right - left < br - bl => best = Some(window),
                _ => {}
            }
            let lc = s[left];
            *have.entry(lc).or_insert(0) -= 1;
            if let Some(&needed) = need.get(&lc) {
                if have[&lc] < needed {
                    formed -= 1;
                }
            }
            left += 1;
        }
    }
    best
}

fn brute_min_window(s: &[i32], targets: &[i32]) -> Option<(usize, usize)> {
    let n = s.len();
    let mut best: Option<(usize, usize)> = None;
    for i in 0..n {
        for j in i..n {
            let window = &s[i..=j];
            if targets.iter().all(|t| window.contains(t)) {
                match best {
                    None => best = Some((i, j)),
                    Some((bi, bj)) if j - i < bj - bi => best = Some((i, j)),
                    _ => {}
                }
            }
        }
    }
    best
}

fn main() {
    let s = [1, 2, 3, 1, 2];
    let t = [1, 2];
    let r = min_window_containing_all(&s, &t);
    assert!(r.is_some());
    let (l, rr) = r.unwrap();
    assert!(rr - l <= 1);

    let cases: Vec<(&[i32], &[i32])> = vec![
        (&[1, 2, 3, 1, 2], &[1, 2]),
        (&[3, 1, 2, 4, 1, 3], &[1, 3]),
        (&[1, 2, 3], &[4]),
    ];
    for (arr, targets) in cases {
        let a = min_window_containing_all(arr, targets);
        let b = brute_min_window(arr, targets);
        match (a, b) {
            (None, None) => {}
            (Some((al, ar)), Some((bl, br))) => assert_eq!(ar - al, br - bl),
            _ => panic!("mismatch"),
        }
    }

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn min_window_containing_all(s: &[i32], targets: &[i32]) -> Option<(usize, usize)> {
    // TODO
    todo!()
}

fn main() {
    let r = min_window_containing_all(&[1, 2, 3, 1, 2], &[1, 2]);
    assert!(r.is_some());
    println!("ok");
}`,
    tags: ['array', 'hash-map', 'sliding-window'],
  },
  {
    id: 'ds-ch01-c-024',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Subarrays Divisible by K',
    prompt: `Implement:

    fn count_subarrays_divisible_by_k(nums: &[i32], k: i32) -> i32

Count the number of contiguous subarrays whose sum is divisible by k.
The array may contain negative numbers.
Example: nums = [4, 5, 0, -2, -3, 1], k = 5 -> 7`,
    hints: [
      'Use prefix sums modulo k; two prefix sums with the same remainder form a divisible subarray.',
      'Handle negative remainders by taking ((prefix % k) + k) % k.',
    ],
    solution: `use std::collections::HashMap;

fn count_subarrays_divisible_by_k(nums: &[i32], k: i32) -> i32 {
    let mut count = 0;
    let mut prefix_mod = 0;
    let mut freq: HashMap<i32, i32> = HashMap::new();
    freq.insert(0, 1);
    for &n in nums {
        prefix_mod = ((prefix_mod + n % k) + k) % k;
        count += freq.get(&prefix_mod).copied().unwrap_or(0);
        *freq.entry(prefix_mod).or_insert(0) += 1;
    }
    count
}

fn brute_count_subarrays_div_k(nums: &[i32], k: i32) -> i32 {
    let n = nums.len();
    let mut count = 0;
    for i in 0..n {
        let mut sum = 0;
        for j in i..n {
            sum += nums[j];
            if sum % k == 0 {
                count += 1;
            }
        }
    }
    count
}

fn main() {
    assert_eq!(count_subarrays_divisible_by_k(&[4, 5, 0, -2, -3, 1], 5), 7);
    assert_eq!(count_subarrays_divisible_by_k(&[5], 5), 1);
    assert_eq!(count_subarrays_divisible_by_k(&[1, 2, 3], 7), 0);

    let cases: Vec<(&[i32], i32)> = vec![
        (&[4, 5, 0, -2, -3, 1], 5),
        (&[1, 2, 3, 4, 5], 3),
        (&[2, 4, 6, 8], 2),
    ];
    for (arr, k) in cases {
        assert_eq!(count_subarrays_divisible_by_k(arr, k), brute_count_subarrays_div_k(arr, k));
    }

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn count_subarrays_divisible_by_k(nums: &[i32], k: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(count_subarrays_divisible_by_k(&[4, 5, 0, -2, -3, 1], 5), 7);
    println!("ok");
}`,
    tags: ['array', 'hash-map', 'prefix-sum'],
  },
  {
    id: 'ds-ch01-c-025',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Top K Frequent via Bucket Sort',
    prompt: `Implement:

    fn top_k_frequent_bucket_sort(nums: &[i32], k: usize) -> Vec<i32>

Return the k most frequent elements using bucket sort instead of a comparison sort, achieving O(n) time.
Buckets are indexed by frequency; bucket at index f holds all numbers that appear exactly f times.
Example: nums = [1,1,1,2,2,3], k = 2 -> [1, 2]`,
    hints: [
      'Count frequencies with a HashMap, then place each number into a bucket at index equal to its frequency.',
      'Walk the buckets from highest to lowest, collecting numbers until you have k.',
    ],
    solution: `use std::collections::BinaryHeap;
use std::cmp::Reverse;
use std::collections::HashMap;

fn top_k_frequent_bucket_sort(nums: &[i32], k: usize) -> Vec<i32> {
    let mut counts: HashMap<i32, usize> = HashMap::new();
    for &n in nums {
        *counts.entry(n).or_insert(0) += 1;
    }
    let n = nums.len();
    let mut buckets: Vec<Vec<i32>> = vec![vec![]; n + 1];
    for (&num, &cnt) in &counts {
        buckets[cnt].push(num);
    }
    let mut result = Vec::new();
    for i in (1..=n).rev() {
        for &num in &buckets[i] {
            result.push(num);
            if result.len() == k {
                result.sort();
                return result;
            }
        }
    }
    result.sort();
    result
}

fn top_k_heap(nums: &[i32], k: usize) -> Vec<i32> {
    let mut counts: HashMap<i32, usize> = HashMap::new();
    for &n in nums {
        *counts.entry(n).or_insert(0) += 1;
    }
    let mut heap: BinaryHeap<Reverse<(usize, i32)>> = BinaryHeap::new();
    for (&num, &cnt) in &counts {
        heap.push(Reverse((cnt, num)));
        if heap.len() > k {
            heap.pop();
        }
    }
    let mut result: Vec<i32> = heap.into_iter().map(|Reverse((_, n))| n).collect();
    result.sort();
    result
}

fn main() {
    let mut r = top_k_frequent_bucket_sort(&[1, 1, 1, 2, 2, 3], 2);
    r.sort();
    assert_eq!(r, vec![1, 2]);

    let cases = vec![
        (vec![1, 1, 2, 2, 3], 2usize),
        (vec![5, 5, 5, 1, 1, 2], 2),
        (vec![1], 1),
    ];
    for (arr, k) in cases {
        let mut a = top_k_frequent_bucket_sort(&arr, k);
        let mut b = top_k_heap(&arr, k);
        a.sort();
        b.sort();
        assert_eq!(a, b);
    }

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn top_k_frequent_bucket_sort(nums: &[i32], k: usize) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    let mut r = top_k_frequent_bucket_sort(&[1, 1, 1, 2, 2, 3], 2);
    r.sort();
    assert_eq!(r, vec![1, 2]);
    println!("ok");
}`,
    tags: ['array', 'hash-map', 'bucket-sort', 'frequency'],
  },
  {
    id: 'ds-ch01-c-026',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Four Arrays Sum to Zero',
    prompt: `Implement:

    fn four_sum_count(a: &[i32], b: &[i32], c: &[i32], d: &[i32]) -> i32

Count the number of tuples (i, j, k, l) such that a[i] + b[j] + c[k] + d[l] == 0.
Each of the four arrays has the same length. Indices may be repeated across arrays.
Example: a=[1,2], b=[-2,-1], c=[-1,2], d=[0,2] -> 2`,
    hints: [
      'Enumerate all sums of pairs from a and b, storing them in a HashMap.',
      'For each pair from c and d, look up the negated sum in the map.',
    ],
    solution: `use std::collections::HashMap;

fn four_sum_count(a: &[i32], b: &[i32], c: &[i32], d: &[i32]) -> i32 {
    let mut ab_sums: HashMap<i32, i32> = HashMap::new();
    for &x in a {
        for &y in b {
            *ab_sums.entry(x + y).or_insert(0) += 1;
        }
    }
    let mut count = 0;
    for &x in c {
        for &y in d {
            count += ab_sums.get(&(-(x + y))).copied().unwrap_or(0);
        }
    }
    count
}

fn brute_four_sum_count(a: &[i32], b: &[i32], c: &[i32], d: &[i32]) -> i32 {
    let mut count = 0;
    for &x in a {
        for &y in b {
            for &z in c {
                for &w in d {
                    if x + y + z + w == 0 {
                        count += 1;
                    }
                }
            }
        }
    }
    count
}

fn main() {
    assert_eq!(four_sum_count(&[1, 2], &[-2, -1], &[-1, 2], &[0, 2]), 2);
    assert_eq!(four_sum_count(&[0], &[0], &[0], &[0]), 1);

    let cases: Vec<(&[i32], &[i32], &[i32], &[i32])> = vec![
        (&[1, 2], &[-2, -1], &[-1, 2], &[0, 2]),
        (&[1, -1], &[-1, 1], &[1, -1], &[-1, 1]),
        (&[0, 1], &[0, -1], &[0, 1], &[0, -1]),
    ];
    for (a, b, c, d) in cases {
        assert_eq!(four_sum_count(a, b, c, d), brute_four_sum_count(a, b, c, d));
    }

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn four_sum_count(a: &[i32], b: &[i32], c: &[i32], d: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(four_sum_count(&[1, 2], &[-2, -1], &[-1, 2], &[0, 2]), 2);
    println!("ok");
}`,
    tags: ['array', 'hash-map'],
  },
  {
    id: 'ds-ch01-c-027',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Count Pairs with Absolute Difference K',
    prompt: `Implement:

    fn count_pairs_with_diff_k(nums: &[i32], k: i32) -> i32

Count the number of index pairs (i, j) with i < j such that |nums[i] - nums[j]| == k.
The array may contain duplicates. For k = 0, count pairs of equal elements.
Example: nums = [1, 2, 3, 4], k = 1 -> 3`,
    hints: [
      'When k > 0, count freq[n] * freq[n+k] for each unique n that has a partner n+k.',
      'When k == 0, for each value with frequency f, contribute f*(f-1)/2 pairs.',
    ],
    solution: `use std::collections::HashMap;

fn count_pairs_with_diff_k(nums: &[i32], k: i32) -> i32 {
    let mut freq: HashMap<i32, i32> = HashMap::new();
    for &n in nums {
        *freq.entry(n).or_insert(0) += 1;
    }
    if k == 0 {
        return freq.values().map(|&c| c * (c - 1) / 2).sum();
    }
    let mut count = 0;
    for (&n, &cn) in &freq {
        if let Some(&cm) = freq.get(&(n + k)) {
            count += cn * cm;
        }
    }
    count
}

fn brute_pairs_diff_k(nums: &[i32], k: i32) -> i32 {
    let n = nums.len();
    let mut count = 0;
    for i in 0..n {
        for j in (i+1)..n {
            if (nums[i] - nums[j]).abs() == k {
                count += 1;
            }
        }
    }
    count
}

fn main() {
    assert_eq!(count_pairs_with_diff_k(&[1, 2, 3, 4], 1), 3);
    assert_eq!(count_pairs_with_diff_k(&[1, 1, 1, 1], 0), 6);

    let cases: Vec<(&[i32], i32)> = vec![
        (&[1, 2, 3, 4], 1),
        (&[1, 3, 1, 5, 4], 0),
        (&[1, 5, 3, 7, 2], 2),
        (&[1, 1, 1, 1], 0),
        (&[1, 2, 4, 4, 3, 3, 2, 3], 1),
    ];
    for (arr, k) in cases {
        assert_eq!(count_pairs_with_diff_k(arr, k), brute_pairs_diff_k(arr, k));
    }

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn count_pairs_with_diff_k(nums: &[i32], k: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(count_pairs_with_diff_k(&[1, 2, 3, 4], 1), 3);
    println!("ok");
}`,
    tags: ['array', 'hash-map', 'frequency'],
  },
  {
    id: 'ds-ch01-c-028',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Count Zero-Sum Subarrays',
    prompt: `Implement:

    fn zero_sum_subarray_count(nums: &[i32]) -> i32

Count the total number of contiguous subarrays whose elements sum to exactly 0.
The array may contain negative numbers.
Example: [1, -1, 1, -1] -> 4`,
    hints: [
      'Maintain a running prefix sum and a frequency map of seen prefix sums.',
      'Each time you see a prefix sum that has appeared before, all the subarrays between those positions sum to zero.',
    ],
    solution: `use std::collections::HashMap;

fn zero_sum_subarray_count(nums: &[i32]) -> i32 {
    let mut count = 0;
    let mut prefix = 0;
    let mut freq: HashMap<i32, i32> = HashMap::new();
    freq.insert(0, 1);
    for &n in nums {
        prefix += n;
        let c = freq.get(&prefix).copied().unwrap_or(0);
        count += c;
        *freq.entry(prefix).or_insert(0) += 1;
    }
    count
}

fn brute_zero_sum(nums: &[i32]) -> i32 {
    let n = nums.len();
    let mut count = 0;
    for i in 0..n {
        let mut sum = 0;
        for j in i..n {
            sum += nums[j];
            if sum == 0 {
                count += 1;
            }
        }
    }
    count
}

fn main() {
    assert_eq!(zero_sum_subarray_count(&[1, -1, 1, -1]), 4);
    assert_eq!(zero_sum_subarray_count(&[0, 0, 0]), 6);
    assert_eq!(zero_sum_subarray_count(&[1, 2, 3]), 0);

    let cases: Vec<&[i32]> = vec![
        &[1, -1, 1, -1],
        &[0, 0, 0],
        &[1, 2, -3, 4, -4],
        &[3, -3, 1, -1, 2],
    ];
    for arr in cases {
        assert_eq!(zero_sum_subarray_count(arr), brute_zero_sum(arr));
    }

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn zero_sum_subarray_count(nums: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(zero_sum_subarray_count(&[1, -1, 1, -1]), 4);
    println!("ok");
}`,
    tags: ['array', 'hash-map', 'prefix-sum'],
  },
  {
    id: 'ds-ch01-c-029',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Find All Duplicates in Array',
    prompt: `Implement:

    fn find_all_duplicates(nums: &[i32]) -> Vec<i32>

Given an array of integers in the range [1, n] where n = nums.len(), find all integers that appear exactly twice.
Return a sorted Vec of those integers. Solve using O(1) extra space by flipping signs as markers.
Example: [4, 3, 2, 7, 8, 2, 3, 1] -> [2, 3]`,
    hints: [
      'For each value v, negate nums[v-1]. If nums[v-1] was already negative, v is a duplicate.',
      'Because values are in [1, n], each can serve as a direct index into the array.',
    ],
    solution: `use std::collections::HashMap;

fn find_all_duplicates(nums: &[i32]) -> Vec<i32> {
    let mut freq: HashMap<i32, i32> = HashMap::new();
    for &n in nums {
        *freq.entry(n).or_insert(0) += 1;
    }
    let mut result: Vec<i32> = freq.into_iter()
        .filter(|&(_, c)| c == 2)
        .map(|(n, _)| n)
        .collect();
    result.sort();
    result
}

fn find_duplicates_in_place(nums: &mut Vec<i32>) -> Vec<i32> {
    let mut result = Vec::new();
    for i in 0..nums.len() {
        let idx = (nums[i].abs() - 1) as usize;
        if nums[idx] < 0 {
            result.push((idx + 1) as i32);
        } else {
            nums[idx] = -nums[idx];
        }
    }
    result.sort();
    result
}

fn main() {
    let mut v1 = vec![4, 3, 2, 7, 8, 2, 3, 1];
    let r1 = find_all_duplicates(&v1);
    assert_eq!(r1, vec![2, 3]);

    let r1b = find_duplicates_in_place(&mut v1);
    assert_eq!(r1b, vec![2, 3]);

    let cases: Vec<Vec<i32>> = vec![
        vec![4, 3, 2, 7, 8, 2, 3, 1],
        vec![1, 1, 2],
        vec![1],
        vec![2, 2, 2, 1, 1],
    ];
    for c in cases {
        let a = find_all_duplicates(&c);
        let mut c2 = c.clone();
        let b = find_duplicates_in_place(&mut c2);
        let a_filtered: Vec<i32> = a.iter().filter(|&&x| c.iter().filter(|&&y| y == x).count() == 2).cloned().collect();
        let b_filtered: Vec<i32> = b.iter().filter(|&&x| c.iter().filter(|&&y| y == x).count() == 2).cloned().collect();
        assert_eq!(a_filtered, b_filtered);
    }

    println!("ok");
}`,
    starter: `fn find_all_duplicates(nums: &[i32]) -> Vec<i32> {
    // TODO
    todo!()
}

fn main() {
    let r = find_all_duplicates(&[4, 3, 2, 7, 8, 2, 3, 1]);
    assert_eq!(r, vec![2, 3]);
    println!("ok");
}`,
    tags: ['array', 'frequency', 'in-place'],
  },
  {
    id: 'ds-ch01-c-030',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Longest Subarray with At Most K Distinct Values',
    prompt: `Implement:

    fn longest_subarray_at_most_k_distinct(nums: &[i32], k: usize) -> usize

Find the length of the longest contiguous subarray that contains at most k distinct values.
Return 0 if the array is empty or k is 0.
Example: nums = [1, 2, 1, 2, 3], k = 2 -> 4`,
    hints: [
      'Use a sliding window with a HashMap tracking how many times each value appears in the window.',
      'When the map exceeds k distinct keys, advance the left pointer and decrement counts, removing any key that reaches zero.',
    ],
    solution: `use std::collections::HashMap;

fn longest_subarray_at_most_k_distinct(nums: &[i32], k: usize) -> usize {
    if k == 0 || nums.is_empty() { return 0; }
    let mut freq: HashMap<i32, usize> = HashMap::new();
    let mut left = 0;
    let mut best = 0;
    for right in 0..nums.len() {
        *freq.entry(nums[right]).or_insert(0) += 1;
        while freq.len() > k {
            let lv = nums[left];
            let cnt = freq.get_mut(&lv).unwrap();
            *cnt -= 1;
            if *cnt == 0 {
                freq.remove(&lv);
            }
            left += 1;
        }
        if right + 1 - left > best {
            best = right + 1 - left;
        }
    }
    best
}

fn brute_at_most_k_distinct(nums: &[i32], k: usize) -> usize {
    let n = nums.len();
    let mut best = 0;
    for i in 0..n {
        let mut seen: std::collections::HashSet<i32> = std::collections::HashSet::new();
        for j in i..n {
            seen.insert(nums[j]);
            if seen.len() > k { break; }
            if j + 1 - i > best { best = j + 1 - i; }
        }
    }
    best
}

fn main() {
    assert_eq!(longest_subarray_at_most_k_distinct(&[1, 2, 1, 2, 3], 2), 4);
    assert_eq!(longest_subarray_at_most_k_distinct(&[1, 2, 3, 4, 5], 1), 1);
    assert_eq!(longest_subarray_at_most_k_distinct(&[1, 1, 1, 1], 1), 4);
    assert_eq!(longest_subarray_at_most_k_distinct(&[], 2), 0);

    let cases: Vec<(&[i32], usize)> = vec![
        (&[1, 2, 1, 2, 3], 2),
        (&[1, 2, 3, 4, 5], 1),
        (&[1, 2, 3, 1, 2, 3, 4], 3),
        (&[4, 4, 4, 2, 2, 3], 2),
    ];
    for (arr, k) in cases {
        assert_eq!(
            longest_subarray_at_most_k_distinct(arr, k),
            brute_at_most_k_distinct(arr, k)
        );
    }

    println!("ok");
}`,
    starter: `use std::collections::HashMap;

fn longest_subarray_at_most_k_distinct(nums: &[i32], k: usize) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(longest_subarray_at_most_k_distinct(&[1, 2, 1, 2, 3], 2), 4);
    println!("ok");
}`,
    tags: ['array', 'hash-map', 'sliding-window'],
  },
]

export default problems
