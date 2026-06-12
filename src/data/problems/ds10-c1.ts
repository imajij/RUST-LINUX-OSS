import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch10-c-001',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'All Subsets',
    prompt: `Implement:

    fn subsets(nums: &[i32]) -> Vec<Vec<i32>>

Return every subset (the power set) of the distinct integers in nums, in any order.
Sort the result before returning so tests are deterministic.
Example: nums = [1, 2] -> [[], [1], [1, 2], [2]].
The number of subsets is always 2^n where n = nums.len().`,
    hints: [
      'At each index choose to include or skip the element.',
      'Recurse and record the current path when you reach the end of the array.',
    ],
    solution: `fn subsets(nums: &[i32]) -> Vec<Vec<i32>> {
    let mut out = Vec::new();
    let mut path = Vec::new();
    fn go(i: usize, nums: &[i32], path: &mut Vec<i32>, out: &mut Vec<Vec<i32>>) {
        if i == nums.len() {
            out.push(path.clone());
            return;
        }
        go(i + 1, nums, path, out);
        path.push(nums[i]);
        go(i + 1, nums, path, out);
        path.pop();
    }
    go(0, nums, &mut path, &mut out);
    out.sort();
    out
}

fn main() {
    let mut got = subsets(&[1, 2]);
    got.sort();
    assert_eq!(got, vec![vec![], vec![1], vec![1, 2], vec![2]]);
    assert_eq!(subsets(&[]).len(), 1);
    let r = subsets(&[1, 2, 3]);
    assert_eq!(r.len(), 8);
    println!("ok");
}`,
    starter: `fn subsets(nums: &[i32]) -> Vec<Vec<i32>> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(subsets(&[]).len(), 1);
    println!("ok");
}`,
    tags: ['backtracking', 'subsets'],
  },
  {
    id: 'ds-ch10-c-002',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Combinations of k from n',
    prompt: `Implement:

    fn combinations(n: i32, k: i32) -> Vec<Vec<i32>>

Return all k-element combinations chosen from the integers 1 through n.
Each combination must be sorted in ascending order; sort the result list too.
Example: n=4, k=2 -> [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]].
The count is C(n,k) = n! / (k! * (n-k)!).`,
    hints: [
      'Use a start index to avoid revisiting smaller numbers.',
      'Stop early when fewer than k numbers remain in the range.',
    ],
    solution: `fn combinations(n: i32, k: i32) -> Vec<Vec<i32>> {
    let mut out = Vec::new();
    let mut path = Vec::new();
    fn go(start: i32, n: i32, k: i32, path: &mut Vec<i32>, out: &mut Vec<Vec<i32>>) {
        if path.len() == k as usize {
            out.push(path.clone());
            return;
        }
        for i in start..=n {
            path.push(i);
            go(i + 1, n, k, path, out);
            path.pop();
        }
    }
    go(1, n, k, &mut path, &mut out);
    out
}

fn main() {
    let mut got = combinations(4, 2);
    got.sort();
    assert_eq!(got, vec![vec![1,2],vec![1,3],vec![1,4],vec![2,3],vec![2,4],vec![3,4]]);
    assert_eq!(combinations(1, 1).len(), 1);
    assert_eq!(combinations(5, 3).len(), 10);
    println!("ok");
}`,
    starter: `fn combinations(n: i32, k: i32) -> Vec<Vec<i32>> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(combinations(1, 1).len(), 1);
    println!("ok");
}`,
    tags: ['backtracking', 'combinations'],
  },
  {
    id: 'ds-ch10-c-003',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'All Permutations',
    prompt: `Implement:

    fn permutations(nums: &[i32]) -> Vec<Vec<i32>>

Return all permutations of the distinct integers in nums.
Sort the result before returning for a stable test.
Example: [1,2,3] yields 6 permutations.
The count equals n! where n = nums.len().`,
    hints: [
      'Track a boolean used array to mark which elements are already in the current path.',
      'When the path length equals nums.len() you have a complete permutation.',
    ],
    solution: `fn permutations(nums: &[i32]) -> Vec<Vec<i32>> {
    let mut out = Vec::new();
    let mut path = Vec::new();
    let mut used = vec![false; nums.len()];
    fn go(nums: &[i32], path: &mut Vec<i32>, used: &mut Vec<bool>, out: &mut Vec<Vec<i32>>) {
        if path.len() == nums.len() {
            out.push(path.clone());
            return;
        }
        for i in 0..nums.len() {
            if used[i] { continue; }
            used[i] = true;
            path.push(nums[i]);
            go(nums, path, used, out);
            path.pop();
            used[i] = false;
        }
    }
    go(nums, &mut path, &mut used, &mut out);
    out.sort();
    out
}

fn main() {
    let got = permutations(&[1, 2, 3]);
    assert_eq!(got.len(), 6);
    assert_eq!(permutations(&[1]).len(), 1);
    assert_eq!(permutations(&[1, 2]).len(), 2);
    assert_eq!(permutations(&[1,2,3,4]).len(), 24);
    println!("ok");
}`,
    starter: `fn permutations(nums: &[i32]) -> Vec<Vec<i32>> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(permutations(&[1]).len(), 1);
    println!("ok");
}`,
    tags: ['backtracking', 'permutations'],
  },
  {
    id: 'ds-ch10-c-004',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Generate Valid Parentheses',
    prompt: `Implement:

    fn generate_parentheses(n: i32) -> Vec<String>

Return all strings of n pairs of well-formed parentheses.
Sort the result before returning.
Example: n=3 produces 5 strings, including "((()))" and "(()())".
Count of results follows the Catalan number C(n).`,
    hints: [
      'Track open and close counts; you may add "(" if open < n.',
      'You may add ")" only when close < open.',
    ],
    solution: `fn generate_parentheses(n: i32) -> Vec<String> {
    let mut out = Vec::new();
    fn go(open: i32, close: i32, n: i32, cur: &mut String, out: &mut Vec<String>) {
        if cur.len() == (2 * n) as usize {
            out.push(cur.clone());
            return;
        }
        if open < n {
            cur.push('(');
            go(open + 1, close, n, cur, out);
            cur.pop();
        }
        if close < open {
            cur.push(')');
            go(open, close + 1, n, cur, out);
            cur.pop();
        }
    }
    let mut cur = String::new();
    go(0, 0, n, &mut cur, &mut out);
    out.sort();
    out
}

fn main() {
    assert_eq!(generate_parentheses(1), vec!["()"]);
    let got = generate_parentheses(3);
    assert_eq!(got.len(), 5);
    assert!(got.contains(&"((()))".to_string()));
    assert!(got.contains(&"(()())".to_string()));
    println!("ok");
}`,
    starter: `fn generate_parentheses(n: i32) -> Vec<String> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(generate_parentheses(1), vec!["()"]);
    println!("ok");
}`,
    tags: ['backtracking', 'parentheses', 'strings'],
  },
  {
    id: 'ds-ch10-c-005',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Combination Sum with Reuse',
    prompt: `Implement:

    fn combination_sum(candidates: &mut Vec<i32>, target: i32) -> Vec<Vec<i32>>

Find all unique combinations from candidates that sum to target.
Each candidate may be reused any number of times in a combination.
Sort candidates first; sort the result list too.
Example: candidates=[2,3,6,7], target=7 -> [[2,2,3],[7]].`,
    hints: [
      'Sort candidates so you can prune when a candidate exceeds the remaining target.',
      'Pass the same index i (not i+1) to allow reuse of the current candidate.',
    ],
    solution: `fn combination_sum(candidates: &mut Vec<i32>, target: i32) -> Vec<Vec<i32>> {
    candidates.sort();
    let mut out = Vec::new();
    let mut path = Vec::new();
    fn go(start: usize, remaining: i32, candidates: &[i32], path: &mut Vec<i32>, out: &mut Vec<Vec<i32>>) {
        if remaining == 0 {
            out.push(path.clone());
            return;
        }
        for i in start..candidates.len() {
            if candidates[i] > remaining { break; }
            path.push(candidates[i]);
            go(i, remaining - candidates[i], candidates, path, out);
            path.pop();
        }
    }
    go(0, target, candidates, &mut path, &mut out);
    out.sort();
    out
}

fn main() {
    let mut c = vec![2, 3, 6, 7];
    let got = combination_sum(&mut c, 7);
    assert_eq!(got.len(), 2);
    assert!(got.contains(&vec![2, 2, 3]));
    assert!(got.contains(&vec![7]));
    let mut c2 = vec![2, 3, 5];
    let got2 = combination_sum(&mut c2, 8);
    assert_eq!(got2.len(), 3);
    println!("ok");
}`,
    starter: `fn combination_sum(candidates: &mut Vec<i32>, target: i32) -> Vec<Vec<i32>> {
    // TODO
    todo!()
}

fn main() {
    let mut c = vec![2, 3];
    assert!(!combination_sum(&mut c, 6).is_empty());
    println!("ok");
}`,
    tags: ['backtracking', 'combinations', 'sum'],
  },
  {
    id: 'ds-ch10-c-006',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Letter Combinations of Phone Digits',
    prompt: `Implement:

    fn phone_letter_combinations(digits: &str) -> Vec<String>

Given a string of digits 2-9, return all letter combinations the digits could represent
using a standard phone keypad mapping (2="abc", 3="def", ..., 9="wxyz").
Return an empty Vec for an empty input. Sort the result.
Example: "23" -> ["ad","ae","af","bd","be","bf","cd","ce","cf"] (9 combinations).`,
    hints: [
      'Build a mapping array indexed by digit character.',
      'Recurse through digits, appending each mapped letter in turn.',
    ],
    solution: `fn phone_letter_combinations(digits: &str) -> Vec<String> {
    if digits.is_empty() { return vec![]; }
    let map = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"];
    let mut out = Vec::new();
    let chars: Vec<char> = digits.chars().collect();
    fn go(idx: usize, chars: &[char], map: &[&str], cur: &mut String, out: &mut Vec<String>) {
        if idx == chars.len() {
            out.push(cur.clone());
            return;
        }
        let letters = map[chars[idx] as usize - '0' as usize];
        for ch in letters.chars() {
            cur.push(ch);
            go(idx + 1, chars, map, cur, out);
            cur.pop();
        }
    }
    let mut cur = String::new();
    go(0, &chars, &map, &mut cur, &mut out);
    out.sort();
    out
}

fn main() {
    let got = phone_letter_combinations("23");
    assert_eq!(got.len(), 9);
    assert!(got.contains(&"ad".to_string()));
    assert!(got.contains(&"bf".to_string()));
    assert_eq!(phone_letter_combinations("").len(), 0);
    assert_eq!(phone_letter_combinations("2").len(), 3);
    println!("ok");
}`,
    starter: `fn phone_letter_combinations(digits: &str) -> Vec<String> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(phone_letter_combinations("").len(), 0);
    println!("ok");
}`,
    tags: ['backtracking', 'strings', 'phone'],
  },
  {
    id: 'ds-ch10-c-007',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'All Binary Strings of Length n',
    prompt: `Implement:

    fn binary_strings(n: usize) -> Vec<String>

Return all binary strings (using only '0' and '1') of exactly length n.
Sort the result in lexicographic order before returning.
Example: n=2 -> ["00","01","10","11"].
The count is always 2^n.`,
    hints: [
      'At each position choose to place a 0 or a 1.',
      'Recurse until the current string reaches length n, then record it.',
    ],
    solution: `fn binary_strings(n: usize) -> Vec<String> {
    let mut out = Vec::new();
    fn go(n: usize, cur: &mut String, out: &mut Vec<String>) {
        if cur.len() == n {
            out.push(cur.clone());
            return;
        }
        cur.push('0');
        go(n, cur, out);
        cur.pop();
        cur.push('1');
        go(n, cur, out);
        cur.pop();
    }
    let mut cur = String::new();
    go(n, &mut cur, &mut out);
    out.sort();
    out
}

fn main() {
    assert_eq!(binary_strings(1), vec!["0", "1"]);
    let got = binary_strings(2);
    assert_eq!(got, vec!["00", "01", "10", "11"]);
    assert_eq!(binary_strings(3).len(), 8);
    assert_eq!(binary_strings(4).len(), 16);
    println!("ok");
}`,
    starter: `fn binary_strings(n: usize) -> Vec<String> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(binary_strings(1).len(), 2);
    println!("ok");
}`,
    tags: ['backtracking', 'strings', 'binary'],
  },
  {
    id: 'ds-ch10-c-008',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Combination Sum Without Reuse',
    prompt: `Implement:

    fn combination_sum2(candidates: &mut Vec<i32>, target: i32) -> Vec<Vec<i32>>

Find all unique combinations from candidates that sum to target.
Each candidate may be used at most once, and duplicates in candidates must not
produce duplicate combinations in the result.
Sort candidates first; sort the result list too.
Example: candidates=[10,1,2,7,6,1,5], target=8 -> [[1,1,6],[1,2,5],[1,7],[2,6]].`,
    hints: [
      'Sort first so duplicates are adjacent, then skip repeated values at the same depth.',
      'Advance start to i+1 (not i) to prevent reuse of the same element.',
    ],
    solution: `fn combination_sum2(candidates: &mut Vec<i32>, target: i32) -> Vec<Vec<i32>> {
    candidates.sort();
    let mut out = Vec::new();
    let mut path = Vec::new();
    fn go(start: usize, remaining: i32, candidates: &[i32], path: &mut Vec<i32>, out: &mut Vec<Vec<i32>>) {
        if remaining == 0 {
            out.push(path.clone());
            return;
        }
        for i in start..candidates.len() {
            if i > start && candidates[i] == candidates[i - 1] { continue; }
            if candidates[i] > remaining { break; }
            path.push(candidates[i]);
            go(i + 1, remaining - candidates[i], candidates, path, out);
            path.pop();
        }
    }
    go(0, target, candidates, &mut path, &mut out);
    out.sort();
    out
}

fn main() {
    let mut c = vec![10, 1, 2, 7, 6, 1, 5];
    let got = combination_sum2(&mut c, 8);
    assert_eq!(got.len(), 4);
    assert!(got.contains(&vec![1, 1, 6]));
    assert!(got.contains(&vec![1, 2, 5]));
    assert!(got.contains(&vec![1, 7]));
    assert!(got.contains(&vec![2, 6]));
    let mut c2 = vec![2, 5, 2, 1, 2];
    let got2 = combination_sum2(&mut c2, 5);
    assert_eq!(got2.len(), 2);
    println!("ok");
}`,
    starter: `fn combination_sum2(candidates: &mut Vec<i32>, target: i32) -> Vec<Vec<i32>> {
    // TODO
    todo!()
}

fn main() {
    let mut c = vec![1, 1];
    assert!(!combination_sum2(&mut c, 2).is_empty());
    println!("ok");
}`,
    tags: ['backtracking', 'combinations', 'sum', 'duplicates'],
  },
  {
    id: 'ds-ch10-c-009',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Subsets with Duplicates',
    prompt: `Implement:

    fn subsets_with_dup(nums: &mut Vec<i32>) -> Vec<Vec<i32>>

Return all unique subsets of nums which may contain duplicate values.
The result must not contain duplicate subsets; sort before returning.
Example: nums=[1,2,2] -> [[],[1],[1,2],[1,2,2],[2],[2,2]] (6 subsets).`,
    hints: [
      'Sort nums first so duplicates are adjacent.',
      'Skip a value at a given depth level if it equals the previous sibling value.',
    ],
    solution: `fn subsets_with_dup(nums: &mut Vec<i32>) -> Vec<Vec<i32>> {
    nums.sort();
    let mut out = Vec::new();
    let mut path = Vec::new();
    fn go(start: usize, nums: &[i32], path: &mut Vec<i32>, out: &mut Vec<Vec<i32>>) {
        out.push(path.clone());
        for i in start..nums.len() {
            if i > start && nums[i] == nums[i - 1] { continue; }
            path.push(nums[i]);
            go(i + 1, nums, path, out);
            path.pop();
        }
    }
    go(0, nums, &mut path, &mut out);
    out.sort();
    out
}

fn main() {
    let mut v = vec![1, 2, 2];
    let got = subsets_with_dup(&mut v);
    assert_eq!(got.len(), 6);
    assert!(got.contains(&vec![]));
    assert!(got.contains(&vec![1]));
    assert!(got.contains(&vec![2]));
    assert!(got.contains(&vec![1, 2]));
    assert!(got.contains(&vec![2, 2]));
    assert!(got.contains(&vec![1, 2, 2]));
    let mut v2 = vec![0];
    assert_eq!(subsets_with_dup(&mut v2).len(), 2);
    println!("ok");
}`,
    starter: `fn subsets_with_dup(nums: &mut Vec<i32>) -> Vec<Vec<i32>> {
    // TODO
    todo!()
}

fn main() {
    let mut v = vec![1, 2, 2];
    assert_eq!(subsets_with_dup(&mut v).len(), 6);
    println!("ok");
}`,
    tags: ['backtracking', 'subsets', 'duplicates'],
  },
  {
    id: 'ds-ch10-c-010',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Palindrome Partitioning',
    prompt: `Implement:

    fn palindrome_check_partition(s: &str) -> Vec<Vec<String>>

Partition string s so that every substring in the partition is a palindrome.
Return all such partitions. Sort the result before returning.
Example: s="aab" -> [["a","a","b"],["aa","b"]].`,
    hints: [
      'At each position try every suffix starting at the current index.',
      'Only recurse further if the chosen substring is itself a palindrome.',
    ],
    solution: `fn palindrome_check_partition(s: &str) -> Vec<Vec<String>> {
    let chars: Vec<char> = s.chars().collect();
    let mut out = Vec::new();
    let mut path = Vec::new();
    fn is_palindrome(chars: &[char], lo: usize, hi: usize) -> bool {
        let mut l = lo;
        let mut r = hi;
        while l < r {
            if chars[l] != chars[r] { return false; }
            l += 1;
            r -= 1;
        }
        true
    }
    fn go(start: usize, chars: &[char], path: &mut Vec<String>, out: &mut Vec<Vec<String>>) {
        if start == chars.len() {
            out.push(path.clone());
            return;
        }
        for end in start..chars.len() {
            if is_palindrome(chars, start, end) {
                let part: String = chars[start..=end].iter().collect();
                path.push(part);
                go(end + 1, chars, path, out);
                path.pop();
            }
        }
    }
    go(0, &chars, &mut path, &mut out);
    out.sort();
    out
}

fn main() {
    let got = palindrome_check_partition("aab");
    assert_eq!(got.len(), 2);
    assert!(got.contains(&vec!["a".to_string(), "a".to_string(), "b".to_string()]));
    assert!(got.contains(&vec!["aa".to_string(), "b".to_string()]));
    assert_eq!(palindrome_check_partition("a").len(), 1);
    println!("ok");
}`,
    starter: `fn palindrome_check_partition(s: &str) -> Vec<Vec<String>> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(palindrome_check_partition("a").len(), 1);
    println!("ok");
}`,
    tags: ['backtracking', 'palindrome', 'strings'],
  },
  {
    id: 'ds-ch10-c-011',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Permutations with Duplicates',
    prompt: `Implement:

    fn permutations_unique(nums: &mut Vec<i32>) -> Vec<Vec<i32>>

Return all unique permutations of nums, which may contain duplicates.
Do not include duplicate permutations in the result.
Example: nums=[1,1,2] -> [[1,1,2],[1,2,1],[2,1,1]] (3 distinct permutations).
Cross-check: for all-distinct input the count should still equal n!.`,
    hints: [
      'Sort nums first so duplicates are adjacent.',
      'Skip nums[i] if it equals nums[i-1] and nums[i-1] is not currently used.',
    ],
    solution: `fn permutations_unique(nums: &mut Vec<i32>) -> Vec<Vec<i32>> {
    nums.sort();
    let mut out = Vec::new();
    let mut path = Vec::new();
    let mut used = vec![false; nums.len()];
    fn go(nums: &[i32], path: &mut Vec<i32>, used: &mut Vec<bool>, out: &mut Vec<Vec<i32>>) {
        if path.len() == nums.len() {
            out.push(path.clone());
            return;
        }
        for i in 0..nums.len() {
            if used[i] { continue; }
            if i > 0 && nums[i] == nums[i - 1] && !used[i - 1] { continue; }
            used[i] = true;
            path.push(nums[i]);
            go(nums, path, used, out);
            path.pop();
            used[i] = false;
        }
    }
    go(nums, &mut path, &mut used, &mut out);
    out
}

fn main() {
    let mut v = vec![1, 1, 2];
    let got = permutations_unique(&mut v);
    assert_eq!(got.len(), 3);
    assert!(got.contains(&vec![1, 1, 2]));
    assert!(got.contains(&vec![1, 2, 1]));
    assert!(got.contains(&vec![2, 1, 1]));
    let mut v2 = vec![1, 2, 3];
    assert_eq!(permutations_unique(&mut v2).len(), 6);
    let mut v3 = vec![1, 1, 1];
    assert_eq!(permutations_unique(&mut v3).len(), 1);
    println!("ok");
}`,
    starter: `fn permutations_unique(nums: &mut Vec<i32>) -> Vec<Vec<i32>> {
    // TODO
    todo!()
}

fn main() {
    let mut v = vec![1, 1, 2];
    assert_eq!(permutations_unique(&mut v).len(), 3);
    println!("ok");
}`,
    tags: ['backtracking', 'permutations', 'duplicates'],
  },
  {
    id: 'ds-ch10-c-012',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Restore IP Addresses',
    prompt: `Implement:

    fn restore_ip_addresses(s: &str) -> Vec<String>

Given a string of digits, return all valid IPv4 addresses that can be formed by
inserting exactly three dots. Each segment must be 0-255 with no leading zeros
(except the single digit "0"). Sort the result before returning.
Example: "25525511135" -> ["255.255.11.135","255.255.111.35"].`,
    hints: [
      'Collect four segments recursively, each 1-3 digits long.',
      'Validate each segment: no leading zero unless the segment is exactly "0", and value <= 255.',
    ],
    solution: `fn restore_ip_addresses(s: &str) -> Vec<String> {
    let chars: Vec<char> = s.chars().collect();
    let mut out = Vec::new();
    let mut parts: Vec<String> = Vec::new();
    fn valid(seg: &str) -> bool {
        if seg.is_empty() || seg.len() > 3 { return false; }
        if seg.len() > 1 && seg.starts_with('0') { return false; }
        seg.parse::<u32>().map(|v| v <= 255).unwrap_or(false)
    }
    fn go(start: usize, chars: &[char], parts: &mut Vec<String>, out: &mut Vec<String>) {
        if parts.len() == 4 {
            if start == chars.len() {
                out.push(parts.join("."));
            }
            return;
        }
        for len in 1..=3usize {
            if start + len > chars.len() { break; }
            let seg: String = chars[start..start + len].iter().collect();
            if valid(&seg) {
                parts.push(seg);
                go(start + len, chars, parts, out);
                parts.pop();
            }
        }
    }
    go(0, &chars, &mut parts, &mut out);
    out.sort();
    out
}

fn main() {
    let got = restore_ip_addresses("25525511135");
    assert_eq!(got.len(), 2);
    assert!(got.contains(&"255.255.11.135".to_string()));
    assert!(got.contains(&"255.255.111.35".to_string()));
    let got2 = restore_ip_addresses("0000");
    assert_eq!(got2, vec!["0.0.0.0"]);
    assert_eq!(restore_ip_addresses("1111111111111111").len(), 0);
    println!("ok");
}`,
    starter: `fn restore_ip_addresses(s: &str) -> Vec<String> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(restore_ip_addresses("0000"), vec!["0.0.0.0"]);
    println!("ok");
}`,
    tags: ['backtracking', 'strings', 'ip'],
  },
  {
    id: 'ds-ch10-c-013',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Gray Code Enumeration',
    prompt: `Implement:

    fn gray_code(n: u32) -> Vec<u32>

Return the n-bit Gray code sequence of length 2^n.
Each successive pair of values (including the wrap from last to first) must
differ by exactly one bit. Start the sequence at 0.
Example: n=2 -> [0,1,3,2] (or the standard reflected sequence).`,
    hints: [
      'The i-th Gray code value is i XOR (i >> 1).',
      'Check the property by XOR-ing consecutive elements and calling count_ones().',
    ],
    solution: `fn gray_code(n: u32) -> Vec<u32> {
    let mut out = Vec::new();
    let total = 1u32 << n;
    for i in 0..total {
        out.push(i ^ (i >> 1));
    }
    out
}

fn main() {
    let got = gray_code(2);
    assert_eq!(got.len(), 4);
    for i in 0..got.len() - 1 {
        let diff = got[i] ^ got[i + 1];
        assert_eq!(diff.count_ones(), 1, "consecutive differ by 1 bit");
    }
    let got3 = gray_code(3);
    assert_eq!(got3.len(), 8);
    for i in 0..got3.len() - 1 {
        assert_eq!((got3[i] ^ got3[i + 1]).count_ones(), 1);
    }
    let got1 = gray_code(1);
    assert_eq!(got1, vec![0, 1]);
    println!("ok");
}`,
    starter: `fn gray_code(n: u32) -> Vec<u32> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(gray_code(1), vec![0, 1]);
    println!("ok");
}`,
    tags: ['backtracking', 'bit-manipulation', 'gray-code'],
  },
  {
    id: 'ds-ch10-c-014',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Letter Case Permutation',
    prompt: `Implement:

    fn letter_case_permutation(s: &str) -> Vec<String>

Given a string containing letters and digits, return all strings formed by
changing the case of each letter independently (digits stay as-is).
Sort the result before returning.
Example: "a1b2" -> ["A1B2","A1b2","a1B2","a1b2"] (4 strings).
The count is 2^(number of letters).`,
    hints: [
      'At each position branch into lowercase and uppercase only if the character is alphabetic.',
      'For digit positions there is only one choice; no branching needed.',
    ],
    solution: `fn letter_case_permutation(s: &str) -> Vec<String> {
    let chars: Vec<char> = s.chars().collect();
    let mut out = Vec::new();
    fn go(i: usize, chars: &[char], cur: &mut Vec<char>, out: &mut Vec<String>) {
        if i == chars.len() {
            out.push(cur.iter().collect());
            return;
        }
        let c = chars[i];
        if c.is_alphabetic() {
            cur.push(c.to_lowercase().next().unwrap());
            go(i + 1, chars, cur, out);
            cur.pop();
            cur.push(c.to_uppercase().next().unwrap());
            go(i + 1, chars, cur, out);
            cur.pop();
        } else {
            cur.push(c);
            go(i + 1, chars, cur, out);
            cur.pop();
        }
    }
    let mut cur = Vec::new();
    go(0, &chars, &mut cur, &mut out);
    out.sort();
    out
}

fn main() {
    let got = letter_case_permutation("a1b2");
    assert_eq!(got.len(), 4);
    assert!(got.contains(&"a1b2".to_string()));
    assert!(got.contains(&"A1B2".to_string()));
    assert!(got.contains(&"a1B2".to_string()));
    assert!(got.contains(&"A1b2".to_string()));
    assert_eq!(letter_case_permutation("12").len(), 1);
    assert_eq!(letter_case_permutation("ab").len(), 4);
    println!("ok");
}`,
    starter: `fn letter_case_permutation(s: &str) -> Vec<String> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(letter_case_permutation("12").len(), 1);
    println!("ok");
}`,
    tags: ['backtracking', 'strings', 'case'],
  },
  {
    id: 'ds-ch10-c-015',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Target Sum Assignments',
    prompt: `Implement:

    fn target_sum(nums: &[i32], target: i32) -> i32

Assign a + or - sign to each number in nums. Return the count of assignments
whose total equals target.
Example: nums=[1,1,1,1,1], target=3 -> 5 (five ways to reach 3).
For n elements there are 2^n possible sign assignments in total.`,
    hints: [
      'At each index recurse twice: once adding the element and once subtracting it.',
      'Count solutions at the base case when all elements are processed.',
    ],
    solution: `fn target_sum(nums: &[i32], target: i32) -> i32 {
    let mut count = 0i32;
    fn go(i: usize, nums: &[i32], target: i32, cur: i32, count: &mut i32) {
        if i == nums.len() {
            if cur == target { *count += 1; }
            return;
        }
        go(i + 1, nums, target, cur + nums[i], count);
        go(i + 1, nums, target, cur - nums[i], count);
    }
    go(0, nums, target, 0, &mut count);
    count
}

fn main() {
    assert_eq!(target_sum(&[1, 1, 1, 1, 1], 3), 5);
    assert_eq!(target_sum(&[1], 1), 1);
    assert_eq!(target_sum(&[1], -1), 1);
    assert_eq!(target_sum(&[1], 2), 0);
    assert_eq!(target_sum(&[0, 0, 0, 0, 0], 0), 32);
    println!("ok");
}`,
    starter: `fn target_sum(nums: &[i32], target: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(target_sum(&[1], 1), 1);
    println!("ok");
}`,
    tags: ['backtracking', 'sum', 'counting'],
  },
  {
    id: 'ds-ch10-c-016',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Counting Beautiful Arrangements',
    prompt: `Implement:

    fn beautiful_arrangement(n: i32) -> i32

Count permutations of 1..=n where for every position i (1-indexed),
either nums[i] % i == 0 or i % nums[i] == 0.
Example: n=2 -> 2 (arrangements [1,2] and [2,1] both satisfy the rule).
n=4 -> 8.`,
    hints: [
      'Backtrack position by position from 1 to n, trying each unused number.',
      'Prune immediately if neither divisibility condition holds for the candidate at this position.',
    ],
    solution: `fn beautiful_arrangement(n: i32) -> i32 {
    let n = n as usize;
    let mut used = vec![false; n + 1];
    let mut count = 0i32;
    fn go(pos: usize, n: usize, used: &mut Vec<bool>, count: &mut i32) {
        if pos > n {
            *count += 1;
            return;
        }
        for k in 1..=n {
            if used[k] { continue; }
            if k % pos == 0 || pos % k == 0 {
                used[k] = true;
                go(pos + 1, n, used, count);
                used[k] = false;
            }
        }
    }
    go(1, n, &mut used, &mut count);
    count
}

fn main() {
    assert_eq!(beautiful_arrangement(1), 1);
    assert_eq!(beautiful_arrangement(2), 2);
    assert_eq!(beautiful_arrangement(3), 3);
    assert_eq!(beautiful_arrangement(4), 8);
    println!("ok");
}`,
    starter: `fn beautiful_arrangement(n: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(beautiful_arrangement(1), 1);
    println!("ok");
}`,
    tags: ['backtracking', 'permutations', 'counting'],
  },
  {
    id: 'ds-ch10-c-017',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Knight Tour Existence Check',
    prompt: `Implement:

    fn knight_tour_count(board_size: usize) -> usize

Count the number of complete knight tours starting at (0,0) on a
board_size x board_size board. A complete tour visits every cell exactly once.
Use backtracking with an 8-direction move set.
Example: board_size=1 -> 1, board_size=2 -> 0, board_size=3 -> 0.`,
    hints: [
      'Mark visited cells and unmark on backtrack.',
      'For small boards (<=3) there are no complete tours except the trivial 1x1 case.',
    ],
    solution: `fn knight_tour_count(board_size: usize) -> usize {
    let moves: [(i32, i32); 8] = [
        (2,1),(2,-1),(-2,1),(-2,-1),
        (1,2),(1,-2),(-1,2),(-1,-2),
    ];
    let mut board = vec![vec![false; board_size]; board_size];
    let mut total = 0usize;
    fn go(r: i32, c: i32, steps: usize, board_size: usize, board: &mut Vec<Vec<bool>>,
          moves: &[(i32, i32)], total: &mut usize) {
        if steps == board_size * board_size {
            *total += 1;
            return;
        }
        for &(dr, dc) in moves {
            let nr = r + dr;
            let nc = c + dc;
            if nr >= 0 && nr < board_size as i32 && nc >= 0 && nc < board_size as i32
                && !board[nr as usize][nc as usize] {
                board[nr as usize][nc as usize] = true;
                go(nr, nc, steps + 1, board_size, board, moves, total);
                board[nr as usize][nc as usize] = false;
            }
        }
    }
    board[0][0] = true;
    go(0, 0, 1, board_size, &mut board, &moves, &mut total);
    total
}

fn main() {
    assert_eq!(knight_tour_count(1), 1);
    assert_eq!(knight_tour_count(2), 0);
    assert_eq!(knight_tour_count(3), 0);
    println!("ok");
}`,
    starter: `fn knight_tour_count(board_size: usize) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(knight_tour_count(1), 1);
    println!("ok");
}`,
    tags: ['backtracking', 'grid', 'knight'],
  },
  {
    id: 'ds-ch10-c-018',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count Decode Ways',
    prompt: `Implement:

    fn decode_ways_count(s: &str) -> i32

A message is encoded where 'A'=1, 'B'=2, ..., 'Z'=26. Given a digit string s,
count the number of ways to decode it. A '0' cannot be decoded alone.
Use backtracking (not DP).
Example: "12" -> 2 ("AB" or "L"), "226" -> 3.`,
    hints: [
      'At each index try taking one digit (if not 0) or two digits (if the two-digit value is 10-26).',
      'Backtrack: count solutions at the base case when index reaches end of string.',
    ],
    solution: `fn decode_ways_count(s: &str) -> i32 {
    let chars: Vec<char> = s.chars().collect();
    let mut count = 0i32;
    fn go(i: usize, chars: &[char], count: &mut i32) {
        if i == chars.len() {
            *count += 1;
            return;
        }
        if chars[i] == '0' { return; }
        go(i + 1, chars, count);
        if i + 1 < chars.len() {
            let two: u32 = chars[i].to_digit(10).unwrap() * 10 + chars[i+1].to_digit(10).unwrap();
            if two >= 10 && two <= 26 {
                go(i + 2, chars, count);
            }
        }
    }
    go(0, &chars, &mut count);
    count
}

fn main() {
    assert_eq!(decode_ways_count("12"), 2);
    assert_eq!(decode_ways_count("226"), 3);
    assert_eq!(decode_ways_count("06"), 0);
    assert_eq!(decode_ways_count("11106"), 2);
    assert_eq!(decode_ways_count("1"), 1);
    println!("ok");
}`,
    starter: `fn decode_ways_count(s: &str) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(decode_ways_count("1"), 1);
    println!("ok");
}`,
    tags: ['backtracking', 'strings', 'decoding'],
  },
  {
    id: 'ds-ch10-c-019',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Combination Sum III (digits 1-9)',
    prompt: `Implement:

    fn combination_sum3(k: usize, n: i32) -> Vec<Vec<i32>>

Find all k-element combinations using digits 1-9 (each digit at most once)
that sum to n. Return sorted combinations in a sorted result list.
Example: k=3, n=7 -> [[1,2,4]].
k=3, n=9 -> [[1,2,6],[1,3,5],[2,3,4]].`,
    hints: [
      'Iterate from start up to 9; break early when the digit exceeds remaining sum.',
      'Prune when path length already equals k without reaching the target.',
    ],
    solution: `fn combination_sum3(k: usize, n: i32) -> Vec<Vec<i32>> {
    let mut out = Vec::new();
    let mut path = Vec::new();
    fn go(start: i32, k: usize, n: i32, path: &mut Vec<i32>, out: &mut Vec<Vec<i32>>) {
        if path.len() == k {
            if n == 0 { out.push(path.clone()); }
            return;
        }
        for d in start..=9 {
            if d > n { break; }
            path.push(d);
            go(d + 1, k, n - d, path, out);
            path.pop();
        }
    }
    go(1, k, n, &mut path, &mut out);
    out.sort();
    out
}

fn main() {
    let got = combination_sum3(3, 7);
    assert_eq!(got.len(), 1);
    assert_eq!(got[0], vec![1, 2, 4]);
    let got2 = combination_sum3(3, 9);
    assert_eq!(got2.len(), 3);
    assert!(got2.contains(&vec![1, 2, 6]));
    assert!(got2.contains(&vec![1, 3, 5]));
    assert!(got2.contains(&vec![2, 3, 4]));
    assert_eq!(combination_sum3(4, 1).len(), 0);
    println!("ok");
}`,
    starter: `fn combination_sum3(k: usize, n: i32) -> Vec<Vec<i32>> {
    // TODO
    todo!()
}

fn main() {
    let got = combination_sum3(3, 7);
    assert_eq!(got.len(), 1);
    println!("ok");
}`,
    tags: ['backtracking', 'combinations', 'sum'],
  },
  {
    id: 'ds-ch10-c-020',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Factor Combinations',
    prompt: `Implement:

    fn factor_combinations(n: i32) -> Vec<Vec<i32>>

Return all ways to express n as a product of its factors (all factors >= 2).
Do not include the trivial factorization [n] alone; only multi-factor lists count.
Sort each combination in non-decreasing order; sort the result list.
Example: n=12 -> [[2,2,3],[2,6],[3,4]].`,
    hints: [
      'Iterate factors from start up to sqrt(n) to avoid revisiting smaller factors.',
      'At each step push the factor, recurse on n/factor, then record [path..., n/factor] as a solution.',
    ],
    solution: `fn factor_combinations(n: i32) -> Vec<Vec<i32>> {
    let mut out = Vec::new();
    fn go(n: i32, start: i32, path: &mut Vec<i32>, out: &mut Vec<Vec<i32>>) {
        if !path.is_empty() {
            let mut combo = path.clone();
            combo.push(n);
            out.push(combo);
        }
        let mut f = start;
        while f * f <= n {
            if n % f == 0 {
                path.push(f);
                go(n / f, f, path, out);
                path.pop();
            }
            f += 1;
        }
    }
    let mut path = Vec::new();
    go(n, 2, &mut path, &mut out);
    out.sort();
    out
}

fn main() {
    let got = factor_combinations(12);
    assert!(got.contains(&vec![2, 6]));
    assert!(got.contains(&vec![2, 2, 3]));
    assert!(got.contains(&vec![3, 4]));
    let got1 = factor_combinations(1);
    assert_eq!(got1.len(), 0);
    let got37 = factor_combinations(37);
    assert_eq!(got37.len(), 0);
    println!("ok");
}`,
    starter: `fn factor_combinations(n: i32) -> Vec<Vec<i32>> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(factor_combinations(1).len(), 0);
    println!("ok");
}`,
    tags: ['backtracking', 'math', 'factors'],
  },
  {
    id: 'ds-ch10-c-021',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'N-Queens Count',
    prompt: `Implement:

    fn n_queens_count(n: usize) -> usize

Count the number of distinct solutions to placing n non-attacking queens on an
n x n chessboard (no two queens share a row, column, or diagonal).
Example: n=4 -> 2, n=5 -> 10, n=8 -> 92.`,
    hints: [
      'Place one queen per row and track which columns and both diagonals are occupied.',
      'Use three boolean arrays for columns, top-left diagonals, and top-right diagonals.',
    ],
    solution: `fn n_queens_count(n: usize) -> usize {
    let mut count = 0usize;
    let mut cols = vec![false; n];
    let mut diag1 = vec![false; 2 * n];
    let mut diag2 = vec![false; 2 * n];
    fn go(row: usize, n: usize, cols: &mut Vec<bool>, diag1: &mut Vec<bool>, diag2: &mut Vec<bool>, count: &mut usize) {
        if row == n {
            *count += 1;
            return;
        }
        for col in 0..n {
            let d1 = row + col;
            let d2 = row + n - col - 1;
            if cols[col] || diag1[d1] || diag2[d2] { continue; }
            cols[col] = true;
            diag1[d1] = true;
            diag2[d2] = true;
            go(row + 1, n, cols, diag1, diag2, count);
            cols[col] = false;
            diag1[d1] = false;
            diag2[d2] = false;
        }
    }
    go(0, n, &mut cols, &mut diag1, &mut diag2, &mut count);
    count
}

fn main() {
    assert_eq!(n_queens_count(1), 1);
    assert_eq!(n_queens_count(2), 0);
    assert_eq!(n_queens_count(3), 0);
    assert_eq!(n_queens_count(4), 2);
    assert_eq!(n_queens_count(5), 10);
    assert_eq!(n_queens_count(6), 4);
    assert_eq!(n_queens_count(8), 92);
    println!("ok");
}`,
    starter: `fn n_queens_count(n: usize) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(n_queens_count(1), 1);
    assert_eq!(n_queens_count(4), 2);
    println!("ok");
}`,
    tags: ['backtracking', 'n-queens', 'counting'],
  },
  {
    id: 'ds-ch10-c-022',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'N-Queens Board Solutions',
    prompt: `Implement:

    fn n_queens_solutions(n: usize) -> Vec<Vec<String>>

Return all distinct solutions to the N-Queens problem as boards. Each board is
a Vec<String> of n rows where 'Q' marks a queen and '.' marks empty.
Sort the result before returning.
Example: n=4 -> 2 boards; n=1 -> [["Q"]].`,
    hints: [
      'Check safety up the column and both diagonals before placing a queen.',
      'Build each row as a string when all n queens have been placed.',
    ],
    solution: `fn n_queens_solutions(n: usize) -> Vec<Vec<String>> {
    let mut out = Vec::new();
    let mut board = vec![vec!['.'; n]; n];
    fn is_safe(board: &Vec<Vec<char>>, row: usize, col: usize, n: usize) -> bool {
        for i in 0..row {
            if board[i][col] == 'Q' { return false; }
        }
        let (mut r, mut c) = (row as i32 - 1, col as i32 - 1);
        while r >= 0 && c >= 0 {
            if board[r as usize][c as usize] == 'Q' { return false; }
            r -= 1; c -= 1;
        }
        let (mut r2, mut c2) = (row as i32 - 1, col as i32 + 1);
        while r2 >= 0 && c2 < n as i32 {
            if board[r2 as usize][c2 as usize] == 'Q' { return false; }
            r2 -= 1; c2 += 1;
        }
        true
    }
    fn go(row: usize, n: usize, board: &mut Vec<Vec<char>>, out: &mut Vec<Vec<String>>) {
        if row == n {
            out.push(board.iter().map(|r| r.iter().collect()).collect());
            return;
        }
        for col in 0..n {
            if is_safe(board, row, col, n) {
                board[row][col] = 'Q';
                go(row + 1, n, board, out);
                board[row][col] = '.';
            }
        }
    }
    go(0, n, &mut board, &mut out);
    out.sort();
    out
}

fn main() {
    assert_eq!(n_queens_solutions(1).len(), 1);
    assert_eq!(n_queens_solutions(4).len(), 2);
    assert_eq!(n_queens_solutions(5).len(), 10);
    let sol4 = &n_queens_solutions(4)[0];
    for row in sol4 {
        assert_eq!(row.chars().filter(|&c| c == 'Q').count(), 1);
    }
    println!("ok");
}`,
    starter: `fn n_queens_solutions(n: usize) -> Vec<Vec<String>> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(n_queens_solutions(1).len(), 1);
    println!("ok");
}`,
    tags: ['backtracking', 'n-queens', 'grid'],
  },
  {
    id: 'ds-ch10-c-023',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Word Search in a Grid',
    prompt: `Implement:

    fn word_search(board: &Vec<Vec<char>>, word: &str) -> bool

Return true if word exists in the grid board by traversing adjacent cells
(up, down, left, right). Each cell may be used at most once per path.
Example: board=[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED" -> true.`,
    hints: [
      'For each cell that matches word[0], launch a DFS checking each direction.',
      'Mark the cell visited before recursing and unmark on backtrack.',
    ],
    solution: `fn word_search(board: &Vec<Vec<char>>, word: &str) -> bool {
    let rows = board.len();
    let cols = board[0].len();
    let chars: Vec<char> = word.chars().collect();
    let mut visited = vec![vec![false; cols]; rows];
    fn dfs(r: i32, c: i32, idx: usize, board: &Vec<Vec<char>>, chars: &[char],
           visited: &mut Vec<Vec<bool>>, rows: usize, cols: usize) -> bool {
        if idx == chars.len() { return true; }
        if r < 0 || r >= rows as i32 || c < 0 || c >= cols as i32 { return false; }
        let (ru, cu) = (r as usize, c as usize);
        if visited[ru][cu] || board[ru][cu] != chars[idx] { return false; }
        visited[ru][cu] = true;
        let found = dfs(r+1,c,idx+1,board,chars,visited,rows,cols)
            || dfs(r-1,c,idx+1,board,chars,visited,rows,cols)
            || dfs(r,c+1,idx+1,board,chars,visited,rows,cols)
            || dfs(r,c-1,idx+1,board,chars,visited,rows,cols);
        visited[ru][cu] = false;
        found
    }
    for r in 0..rows {
        for c in 0..cols {
            if dfs(r as i32, c as i32, 0, board, &chars, &mut visited, rows, cols) {
                return true;
            }
        }
    }
    false
}

fn main() {
    let board = vec![
        vec!['A','B','C','E'],
        vec!['S','F','C','S'],
        vec!['A','D','E','E'],
    ];
    assert!(word_search(&board, "ABCCED"));
    assert!(word_search(&board, "SEE"));
    assert!(!word_search(&board, "ABCB"));
    let board2 = vec![vec!['a']];
    assert!(word_search(&board2, "a"));
    assert!(!word_search(&board2, "b"));
    println!("ok");
}`,
    starter: `fn word_search(board: &Vec<Vec<char>>, word: &str) -> bool {
    // TODO
    todo!()
}

fn main() {
    let board = vec![vec!['a']];
    assert!(word_search(&board, "a"));
    println!("ok");
}`,
    tags: ['backtracking', 'grid', 'dfs'],
  },
  {
    id: 'ds-ch10-c-024',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Sudoku Solver',
    prompt: `Implement:

    fn solve_sudoku(board: &mut Vec<Vec<char>>) -> bool

Solve a 9x9 Sudoku puzzle in-place. Empty cells are represented by '.'.
Return true when solved (modify board), false if unsolvable.
Each row, column, and 3x3 box must contain digits 1-9 with no repetition.
Example: a standard puzzle board should be solved with all '.' replaced.`,
    hints: [
      'Scan for the first empty cell and try digits 1-9 one at a time.',
      'Validate against the current row, column, and 3x3 box before placing a digit.',
    ],
    solution: `fn solve_sudoku(board: &mut Vec<Vec<char>>) -> bool {
    for r in 0..9 {
        for c in 0..9 {
            if board[r][c] == '.' {
                for d in b'1'..=b'9' {
                    let ch = d as char;
                    if is_valid(board, r, c, ch) {
                        board[r][c] = ch;
                        if solve_sudoku(board) { return true; }
                        board[r][c] = '.';
                    }
                }
                return false;
            }
        }
    }
    true
}

fn is_valid(board: &Vec<Vec<char>>, row: usize, col: usize, ch: char) -> bool {
    for i in 0..9 {
        if board[row][i] == ch { return false; }
        if board[i][col] == ch { return false; }
        let br = 3 * (row / 3) + i / 3;
        let bc = 3 * (col / 3) + i % 3;
        if board[br][bc] == ch { return false; }
    }
    true
}

fn verify_solution(board: &Vec<Vec<char>>) -> bool {
    for r in 0..9 {
        let mut row_set = std::collections::HashSet::new();
        let mut col_set = std::collections::HashSet::new();
        for c in 0..9 {
            row_set.insert(board[r][c]);
            col_set.insert(board[c][r]);
        }
        if row_set.len() != 9 || col_set.len() != 9 { return false; }
    }
    for br in 0..3 {
        for bc in 0..3 {
            let mut box_set = std::collections::HashSet::new();
            for r in 0..3 {
                for c in 0..3 {
                    box_set.insert(board[br*3+r][bc*3+c]);
                }
            }
            if box_set.len() != 9 { return false; }
        }
    }
    true
}

fn main() {
    let mut board = vec![
        vec!['5','3','.','.','7','.','.','.','.'],
        vec!['6','.','.','1','9','5','.','.','.'],
        vec!['.','9','8','.','.','.','.','6','.'],
        vec!['8','.','.','.','6','.','.','.','3'],
        vec!['4','.','.','8','.','3','.','.','1'],
        vec!['7','.','.','.','2','.','.','.','6'],
        vec!['.','6','.','.','.','.','2','8','.'],
        vec!['.','.','.','4','1','9','.','.','5'],
        vec!['.','.','.','.','8','.','.','7','9'],
    ];
    assert!(solve_sudoku(&mut board));
    for r in 0..9 {
        for c in 0..9 {
            assert_ne!(board[r][c], '.');
        }
    }
    assert!(verify_solution(&board));
    println!("ok");
}`,
    starter: `fn solve_sudoku(board: &mut Vec<Vec<char>>) -> bool {
    // TODO
    todo!()
}

fn main() {
    let mut board = vec![vec!['.'; 9]; 9];
    let _ = solve_sudoku(&mut board);
    println!("ok");
}`,
    tags: ['backtracking', 'sudoku', 'constraint'],
  },
  {
    id: 'ds-ch10-c-025',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Partition into K Equal Sum Subsets',
    prompt: `Implement:

    fn partition_k_equal_sum(nums: &[i32], k: usize) -> bool

Determine whether nums can be partitioned into exactly k non-empty subsets
each with equal sum. Return true if possible, false otherwise.
Example: nums=[4,3,2,3,5,2,1], k=4 -> true (subsets {5},{1,4},{2,3},{2,3}).`,
    hints: [
      'Sort in descending order and prune when a single element exceeds the target.',
      'Use k buckets; skip a bucket if it equals a previously tried bucket value at this step.',
    ],
    solution: `fn partition_k_equal_sum(nums: &[i32], k: usize) -> bool {
    let total: i32 = nums.iter().sum();
    if total % k as i32 != 0 { return false; }
    let target = total / k as i32;
    let mut buckets = vec![0i32; k];
    let mut used = vec![false; nums.len()];
    let mut sorted = nums.to_vec();
    sorted.sort_by(|a, b| b.cmp(a));
    if sorted[0] > target { return false; }
    fn go(idx: usize, nums: &[i32], buckets: &mut Vec<i32>, used: &mut Vec<bool>,
          k: usize, target: i32) -> bool {
        if idx == nums.len() {
            return buckets.iter().all(|&b| b == target);
        }
        let mut seen = std::collections::HashSet::new();
        for b in 0..k {
            if buckets[b] + nums[idx] <= target && seen.insert(buckets[b]) {
                buckets[b] += nums[idx];
                if go(idx + 1, nums, buckets, used, k, target) { return true; }
                buckets[b] -= nums[idx];
            }
        }
        false
    }
    go(0, &sorted, &mut buckets, &mut used, k, target)
}

fn main() {
    assert!(partition_k_equal_sum(&[4,3,2,3,5,2,1], 4));
    assert!(!partition_k_equal_sum(&[1,2,3,4], 3));
    assert!(partition_k_equal_sum(&[2,2,2,2], 2));
    assert!(partition_k_equal_sum(&[1,1,1,1,1,1], 3));
    assert!(!partition_k_equal_sum(&[1,2], 3));
    println!("ok");
}`,
    starter: `fn partition_k_equal_sum(nums: &[i32], k: usize) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert!(partition_k_equal_sum(&[2,2,2,2], 2));
    println!("ok");
}`,
    tags: ['backtracking', 'partition', 'subset-sum'],
  },
  {
    id: 'ds-ch10-c-026',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Word Break All Sentences',
    prompt: `Implement:

    fn word_break_all(s: &str, word_dict: &[&str]) -> Vec<String>

Given string s and a dictionary of words, return all sentences formed by
space-separating dictionary words that exactly reconstruct s.
Sort the result before returning.
Example: s="catsanddog", dict=["cat","cats","and","sand","dog"]
-> ["cat sand dog", "cats and dog"].`,
    hints: [
      'At each start position try every word that matches the current prefix.',
      'When start reaches s.len(), join the path with spaces as a solution.',
    ],
    solution: `fn word_break_all(s: &str, word_dict: &[&str]) -> Vec<String> {
    let chars: Vec<char> = s.chars().collect();
    let mut out = Vec::new();
    fn go(start: usize, chars: &[char], words: &[&str], path: &mut Vec<String>, out: &mut Vec<String>) {
        if start == chars.len() {
            out.push(path.join(" "));
            return;
        }
        for w in words {
            let wc: Vec<char> = w.chars().collect();
            let end = start + wc.len();
            if end <= chars.len() && &chars[start..end] == wc.as_slice() {
                path.push(w.to_string());
                go(end, chars, words, path, out);
                path.pop();
            }
        }
    }
    let mut path = Vec::new();
    go(0, &chars, word_dict, &mut path, &mut out);
    out.sort();
    out
}

fn main() {
    let dict = vec!["cat", "cats", "and", "sand", "dog"];
    let got = word_break_all("catsanddog", &dict);
    assert_eq!(got.len(), 2);
    assert!(got.contains(&"cat sand dog".to_string()));
    assert!(got.contains(&"cats and dog".to_string()));
    let dict2 = vec!["a", "b"];
    let got2 = word_break_all("ab", &dict2);
    assert_eq!(got2.len(), 1);
    assert_eq!(got2[0], "a b");
    println!("ok");
}`,
    starter: `fn word_break_all(s: &str, word_dict: &[&str]) -> Vec<String> {
    // TODO
    todo!()
}

fn main() {
    let dict = vec!["a", "b"];
    assert_eq!(word_break_all("ab", &dict).len(), 1);
    println!("ok");
}`,
    tags: ['backtracking', 'strings', 'word-break'],
  },
  {
    id: 'ds-ch10-c-027',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Remove Minimum Invalid Parentheses',
    prompt: `Implement:

    fn remove_invalid_parens(s: &str) -> Vec<String>

Remove the minimum number of invalid parentheses to make s valid.
Return all unique resulting strings. Sort before returning.
Non-parenthesis characters are kept as-is.
Example: "()())()" -> ["(())()", "()()()"] (both require removing one character).`,
    hints: [
      'BFS level by level: first check if the current string is valid, then try removing each parenthesis.',
      'Use a HashSet to avoid processing the same string twice.',
    ],
    solution: `fn remove_invalid_parens(s: &str) -> Vec<String> {
    fn is_valid(s: &str) -> bool {
        let mut count = 0i32;
        for c in s.chars() {
            if c == '(' { count += 1; }
            else if c == ')' {
                count -= 1;
                if count < 0 { return false; }
            }
        }
        count == 0
    }
    let mut out = std::collections::HashSet::new();
    let mut visited = std::collections::HashSet::new();
    let mut queue = std::collections::VecDeque::new();
    queue.push_back(s.to_string());
    visited.insert(s.to_string());
    let mut found = false;
    while !queue.is_empty() {
        let curr = queue.pop_front().unwrap();
        if is_valid(&curr) {
            out.insert(curr.clone());
            found = true;
        }
        if found { continue; }
        for i in 0..curr.len() {
            let c = curr.chars().nth(i).unwrap();
            if c != '(' && c != ')' { continue; }
            let next = format!("{}{}", &curr[..i], &curr[i+1..]);
            if !visited.contains(&next) {
                visited.insert(next.clone());
                queue.push_back(next);
            }
        }
    }
    let mut result: Vec<String> = out.into_iter().collect();
    result.sort();
    result
}

fn main() {
    let got = remove_invalid_parens("()())()");
    assert!(got.contains(&"(())()".to_string()) || got.contains(&"()()()".to_string()));
    assert!(got.len() == 2);
    let got2 = remove_invalid_parens("(a)())()");
    assert_eq!(got2.len(), 2);
    let got3 = remove_invalid_parens(")");
    assert_eq!(got3, vec![""]);
    println!("ok");
}`,
    starter: `fn remove_invalid_parens(s: &str) -> Vec<String> {
    // TODO
    todo!()
}

fn main() {
    let got = remove_invalid_parens(")");
    assert_eq!(got, vec![""]);
    println!("ok");
}`,
    tags: ['backtracking', 'bfs', 'parentheses', 'strings'],
  },
  {
    id: 'ds-ch10-c-028',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Reconstruct Flight Itinerary',
    prompt: `Implement:

    fn find_itinerary(tickets: Vec<(String, String)>) -> Vec<String>

Given a list of airline tickets as (from, to) pairs, reconstruct the itinerary
starting from "JFK" using all tickets exactly once. When multiple valid itineraries
exist, return the lexicographically smallest one.
Example: [("MUC","LHR"),("JFK","MUC"),("SFO","SJC"),("LHR","SFO")]
-> ["JFK","MUC","LHR","SFO","SJC"].`,
    hints: [
      'Sort tickets so destinations are in lexicographic order; use a reversed stack per node.',
      'Use Hierholzer DFS: push a node to the result only after all its outgoing edges are exhausted, then reverse the result.',
    ],
    solution: `fn find_itinerary(mut tickets: Vec<(String, String)>) -> Vec<String> {
    tickets.sort();
    let mut graph: std::collections::HashMap<String, Vec<String>> = std::collections::HashMap::new();
    for (src, dst) in &tickets {
        graph.entry(src.clone()).or_default().push(dst.clone());
    }
    for v in graph.values_mut() {
        v.reverse();
    }
    let mut route = Vec::new();
    fn dfs(node: &str, graph: &mut std::collections::HashMap<String, Vec<String>>, route: &mut Vec<String>) {
        while let Some(next) = graph.get_mut(node).and_then(|v| v.pop()) {
            dfs(&next.clone(), graph, route);
        }
        route.push(node.to_string());
    }
    dfs("JFK", &mut graph, &mut route);
    route.reverse();
    route
}

fn main() {
    let tickets = vec![
        ("MUC".to_string(), "LHR".to_string()),
        ("JFK".to_string(), "MUC".to_string()),
        ("SFO".to_string(), "SJC".to_string()),
        ("LHR".to_string(), "SFO".to_string()),
    ];
    let got = find_itinerary(tickets);
    assert_eq!(got, vec!["JFK", "MUC", "LHR", "SFO", "SJC"]);
    let tickets2 = vec![
        ("JFK".to_string(), "SFO".to_string()),
        ("JFK".to_string(), "ATL".to_string()),
        ("SFO".to_string(), "ATL".to_string()),
        ("ATL".to_string(), "JFK".to_string()),
        ("ATL".to_string(), "SFO".to_string()),
    ];
    let got2 = find_itinerary(tickets2);
    assert_eq!(got2, vec!["JFK","ATL","JFK","SFO","ATL","SFO"]);
    println!("ok");
}`,
    starter: `fn find_itinerary(tickets: Vec<(String, String)>) -> Vec<String> {
    // TODO
    todo!()
}

fn main() {
    let tickets = vec![("JFK".to_string(), "ATL".to_string())];
    assert_eq!(find_itinerary(tickets).len(), 2);
    println!("ok");
}`,
    tags: ['backtracking', 'graph', 'euler-path'],
  },
  {
    id: 'ds-ch10-c-029',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Count Vowel Permutations',
    prompt: `Implement:

    fn count_vowel_permutations(n: i32) -> i64

Count strings of length n using only vowels a,e,i,o,u where:
after 'a' only 'e' can follow; after 'e' only 'a' or 'i'; after 'i' anything except 'i';
after 'o' only 'i' or 'u'; after 'u' only 'a'. Return count modulo 1_000_000_007.
Example: n=1 -> 5, n=2 -> 10, n=5 -> 68.`,
    hints: [
      'Model as recurrence: track counts for each vowel at position k.',
      'Update all five counts simultaneously using the transition rules each step.',
    ],
    solution: `fn count_vowel_permutations(n: i32) -> i64 {
    const MOD: i64 = 1_000_000_007;
    let mut a: i64 = 1;
    let mut e: i64 = 1;
    let mut i: i64 = 1;
    let mut o: i64 = 1;
    let mut u: i64 = 1;
    for _ in 1..n {
        let na = (e + i + u) % MOD;
        let ne = (a + i) % MOD;
        let ni = (e + o) % MOD;
        let no = i % MOD;
        let nu = (i + o) % MOD;
        a = na; e = ne; i = ni; o = no; u = nu;
    }
    (a + e + i + o + u) % MOD
}

fn main() {
    assert_eq!(count_vowel_permutations(1), 5);
    assert_eq!(count_vowel_permutations(2), 10);
    assert_eq!(count_vowel_permutations(5), 68);
    let v = count_vowel_permutations(144);
    assert!(v > 0 && v < 1_000_000_007);
    println!("ok");
}`,
    starter: `fn count_vowel_permutations(n: i32) -> i64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(count_vowel_permutations(1), 5);
    println!("ok");
}`,
    tags: ['backtracking', 'dynamic-programming', 'counting', 'strings'],
  },
  {
    id: 'ds-ch10-c-030',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Word Search II - Find All Words',
    prompt: `Implement:

    fn word_search_all(board: &Vec<Vec<char>>, words: &[&str]) -> Vec<String>

Find all words from words that exist in the 2D character board (adjacent cells,
no cell reused per path). Return found words sorted lexicographically.
Example: board=[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]],
words=["oath","pea","eat","rain"] -> ["eat","oath"].`,
    hints: [
      'Use a prefix check to prune DFS branches early: only continue if the current path is a prefix of at least one word.',
      'Mark visited cells before recursing; unmark on backtrack to allow other paths.',
    ],
    solution: `fn word_search_all(board: &Vec<Vec<char>>, words: &[&str]) -> Vec<String> {
    let rows = board.len();
    let cols = board[0].len();
    let mut found = std::collections::HashSet::new();
    let mut visited = vec![vec![false; cols]; rows];

    fn dfs(r: i32, c: i32, node: &str, board: &Vec<Vec<char>>,
           visited: &mut Vec<Vec<bool>>, rows: usize, cols: usize,
           found: &mut std::collections::HashSet<String>,
           words: &[&str]) {
        if r < 0 || r >= rows as i32 || c < 0 || c >= cols as i32 { return; }
        let (ru, cu) = (r as usize, c as usize);
        if visited[ru][cu] { return; }
        let ch = board[ru][cu];
        let new_node = format!("{}{}", node, ch);
        let has_prefix = words.iter().any(|w| w.starts_with(new_node.as_str()));
        if !has_prefix { return; }
        if words.contains(&new_node.as_str()) {
            found.insert(new_node.clone());
        }
        visited[ru][cu] = true;
        dfs(r+1,c,&new_node,board,visited,rows,cols,found,words);
        dfs(r-1,c,&new_node,board,visited,rows,cols,found,words);
        dfs(r,c+1,&new_node,board,visited,rows,cols,found,words);
        dfs(r,c-1,&new_node,board,visited,rows,cols,found,words);
        visited[ru][cu] = false;
    }

    for r in 0..rows {
        for c in 0..cols {
            dfs(r as i32, c as i32, "", board, &mut visited, rows, cols, &mut found, words);
        }
    }
    let mut result: Vec<String> = found.into_iter().collect();
    result.sort();
    result
}

fn main() {
    let board = vec![
        vec!['o','a','a','n'],
        vec!['e','t','a','e'],
        vec!['i','h','k','r'],
        vec!['i','f','l','v'],
    ];
    let words = vec!["oath","pea","eat","rain"];
    let got = word_search_all(&board, &words);
    assert!(got.contains(&"eat".to_string()));
    assert!(got.contains(&"oath".to_string()));
    assert_eq!(got.len(), 2);
    let board2 = vec![vec!['a','b'],vec!['c','d']];
    let words2 = vec!["ab","cd","abdc","cbad"];
    let got2 = word_search_all(&board2, &words2);
    assert!(got2.contains(&"abdc".to_string()));
    println!("ok");
}`,
    starter: `fn word_search_all(board: &Vec<Vec<char>>, words: &[&str]) -> Vec<String> {
    // TODO
    todo!()
}

fn main() {
    let board = vec![vec!['a']];
    assert_eq!(word_search_all(&board, &["a"]).len(), 1);
    println!("ok");
}`,
    tags: ['backtracking', 'grid', 'trie', 'dfs'],
  },
]

export default problems
