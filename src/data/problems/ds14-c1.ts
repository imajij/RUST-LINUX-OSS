import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch14-c-001',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Set Bits',
    prompt: `Implement:

    fn count_bits(n: u32) -> u32

Return the number of 1-bits in the binary representation of n.
Use the Brian Kernighan trick: repeatedly clear the lowest set bit.
Example: n = 11 (binary 1011) -> 3`,
    hints: [
      'The expression n & (n - 1) clears the lowest set bit of n.',
      'Count how many times you can apply that before n reaches zero.',
    ],
    solution: `fn count_bits(mut n: u32) -> u32 {
    let mut c = 0;
    while n != 0 {
        n &= n - 1;
        c += 1;
    }
    c
}

fn main() {
    assert_eq!(count_bits(0), 0);
    assert_eq!(count_bits(11), 3);
    for x in 0u32..1000 {
        assert_eq!(count_bits(x), x.count_ones());
    }
    println!("ok");
}`,
    starter: `fn count_bits(n: u32) -> u32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(count_bits(11), 3);
    println!("ok");
}`,
    tags: ['bits', 'popcount', 'kernighan'],
  },
  {
    id: 'ds-ch14-c-002',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Is Power of Two',
    prompt: `Implement:

    fn is_power_of_two(n: u32) -> bool

Return true if n is an exact power of two (1, 2, 4, 8, ...), false otherwise.
Note that 0 is NOT a power of two.
Example: n = 16 -> true, n = 18 -> false`,
    hints: [
      'A power of two has exactly one bit set in its binary representation.',
      'If n is a power of two, n & (n - 1) equals zero.',
      'Handle n = 0 separately; n - 1 would underflow.',
    ],
    solution: `fn is_power_of_two(n: u32) -> bool {
    n > 0 && (n & (n - 1)) == 0
}

fn main() {
    assert_eq!(is_power_of_two(0), false);
    assert_eq!(is_power_of_two(1), true);
    assert_eq!(is_power_of_two(2), true);
    assert_eq!(is_power_of_two(3), false);
    assert_eq!(is_power_of_two(16), true);
    assert_eq!(is_power_of_two(18), false);
    for x in 0u32..1024 {
        let expected = x > 0 && x.count_ones() == 1;
        assert_eq!(is_power_of_two(x), expected, "failed for {}", x);
    }
    println!("ok");
}`,
    starter: `fn is_power_of_two(n: u32) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(is_power_of_two(16), true);
    assert_eq!(is_power_of_two(18), false);
    println!("ok");
}`,
    tags: ['bits', 'power-of-two'],
  },
  {
    id: 'ds-ch14-c-003',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Get the i-th Bit',
    prompt: `Implement:

    fn get_bit(n: u32, i: u32) -> u32

Return the value (0 or 1) of the bit at position i (0-indexed from the right) in n.
Example: n = 0b1010, i = 1 -> 1 (the second-least-significant bit is set)`,
    hints: [
      'Right-shift n by i positions to bring bit i to position 0.',
      'AND with 1 to isolate that bit.',
    ],
    solution: `fn get_bit(n: u32, i: u32) -> u32 {
    (n >> i) & 1
}

fn main() {
    assert_eq!(get_bit(0b1010, 1), 1);
    assert_eq!(get_bit(0b1010, 0), 0);
    assert_eq!(get_bit(0b1010, 3), 1);
    assert_eq!(get_bit(0b1010, 2), 0);
    for x in 0u32..256 {
        for i in 0u32..8 {
            let expected = (x >> i) & 1;
            assert_eq!(get_bit(x, i), expected);
        }
    }
    println!("ok");
}`,
    starter: `fn get_bit(n: u32, i: u32) -> u32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(get_bit(0b1010, 1), 1);
    assert_eq!(get_bit(0b1010, 0), 0);
    println!("ok");
}`,
    tags: ['bits', 'get-bit'],
  },
  {
    id: 'ds-ch14-c-004',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Set, Clear, and Toggle a Bit',
    prompt: `Implement three functions:

    fn set_bit(n: u32, i: u32) -> u32
    fn clear_bit(n: u32, i: u32) -> u32
    fn toggle_bit(n: u32, i: u32) -> u32

set_bit forces bit i to 1, clear_bit forces it to 0, toggle_bit flips it.
Example: set_bit(0b1010, 0) -> 0b1011; clear_bit(0b1011, 0) -> 0b1010; toggle_bit(0b1010, 0) -> 0b1011`,
    hints: [
      'To set: OR with a mask that has only bit i set (1 << i).',
      'To clear: AND with the bitwise NOT of (1 << i).',
      'To toggle: XOR with (1 << i).',
    ],
    solution: `fn set_bit(n: u32, i: u32) -> u32 {
    n | (1 << i)
}

fn clear_bit(n: u32, i: u32) -> u32 {
    n & !(1 << i)
}

fn toggle_bit(n: u32, i: u32) -> u32 {
    n ^ (1 << i)
}

fn main() {
    assert_eq!(set_bit(0b1010, 0), 0b1011);
    assert_eq!(set_bit(0b1010, 1), 0b1010);
    assert_eq!(clear_bit(0b1011, 0), 0b1010);
    assert_eq!(clear_bit(0b1010, 1), 0b1000);
    assert_eq!(toggle_bit(0b1010, 0), 0b1011);
    assert_eq!(toggle_bit(0b1011, 0), 0b1010);
    for x in 0u32..256 {
        for i in 0u32..8 {
            assert_eq!(set_bit(x, i), x | (1 << i));
            assert_eq!(clear_bit(x, i), x & !(1u32 << i));
            assert_eq!(toggle_bit(x, i), x ^ (1 << i));
        }
    }
    println!("ok");
}`,
    starter: `fn set_bit(n: u32, i: u32) -> u32 {
    // TODO
    todo!()
}

fn clear_bit(n: u32, i: u32) -> u32 {
    // TODO
    todo!()
}

fn toggle_bit(n: u32, i: u32) -> u32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(set_bit(0b1010, 0), 0b1011);
    assert_eq!(clear_bit(0b1011, 0), 0b1010);
    assert_eq!(toggle_bit(0b1010, 0), 0b1011);
    println!("ok");
}`,
    tags: ['bits', 'set-bit', 'clear-bit', 'toggle-bit'],
  },
  {
    id: 'ds-ch14-c-005',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Isolate the Lowest Set Bit',
    prompt: `Implement:

    fn lowest_set_bit(n: u32) -> u32

Return a value that has only the lowest set bit of n turned on and all other bits zero.
Assumes n > 0.
Example: n = 0b1100 -> 0b0100; n = 0b1010 -> 0b0010`,
    hints: [
      'The twos complement negation of n flips all bits and adds one.',
      'ANDing n with its negation extracts the lowest set bit.',
      'In Rust use wrapping_neg() to avoid overflow on u32.',
    ],
    solution: `fn lowest_set_bit(n: u32) -> u32 {
    n & n.wrapping_neg()
}

fn main() {
    assert_eq!(lowest_set_bit(0b1100), 0b0100);
    assert_eq!(lowest_set_bit(0b1010), 0b0010);
    assert_eq!(lowest_set_bit(1), 1);
    assert_eq!(lowest_set_bit(8), 8);
    for x in 1u32..1024 {
        let lsb = lowest_set_bit(x);
        assert_eq!(lsb.count_ones(), 1, "lsb of {} should be a power of two", x);
        assert!(x & lsb != 0, "lsb should be set in x");
        assert_eq!(x & (lsb - 1), 0, "no bits below lsb should be set in x");
    }
    println!("ok");
}`,
    starter: `fn lowest_set_bit(n: u32) -> u32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(lowest_set_bit(0b1100), 0b0100);
    assert_eq!(lowest_set_bit(0b1010), 0b0010);
    println!("ok");
}`,
    tags: ['bits', 'lowest-set-bit', 'twos-complement'],
  },
  {
    id: 'ds-ch14-c-006',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Check if Bit i is Set',
    prompt: `Implement:

    fn is_bit_set(n: u32, i: u32) -> bool

Return true if bit i (0-indexed from the right) of n is 1, false if it is 0.
Example: n = 0b1010, i = 1 -> true; n = 0b1010, i = 0 -> false`,
    hints: [
      'Shift n right by i to bring bit i into the least-significant position.',
      'Test whether the result is odd (bottom bit is 1).',
    ],
    solution: `fn is_bit_set(n: u32, i: u32) -> bool {
    (n >> i) & 1 == 1
}

fn main() {
    assert_eq!(is_bit_set(0b1010, 1), true);
    assert_eq!(is_bit_set(0b1010, 0), false);
    assert_eq!(is_bit_set(0b1010, 3), true);
    assert_eq!(is_bit_set(0, 5), false);
    for x in 0u32..256 {
        for i in 0u32..8 {
            assert_eq!(is_bit_set(x, i), (x >> i) & 1 == 1);
        }
    }
    println!("ok");
}`,
    starter: `fn is_bit_set(n: u32, i: u32) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(is_bit_set(0b1010, 1), true);
    assert_eq!(is_bit_set(0b1010, 0), false);
    println!("ok");
}`,
    tags: ['bits', 'check-bit'],
  },
  {
    id: 'ds-ch14-c-007',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Single Number (all others appear twice)',
    prompt: `Implement:

    fn single_number(nums: &[i32]) -> i32

Every element in nums appears exactly twice, except for one element which appears exactly once.
Find and return that element. Solve it in O(n) time and O(1) space.
Example: nums = [4, 1, 2, 1, 2] -> 4`,
    hints: [
      'XOR of a number with itself is 0.',
      'XOR of a number with 0 is the number itself.',
      'XOR all elements together; paired elements cancel out.',
    ],
    solution: `fn single_number(nums: &[i32]) -> i32 {
    nums.iter().fold(0, |acc, &x| acc ^ x)
}

fn main() {
    assert_eq!(single_number(&[2, 2, 1]), 1);
    assert_eq!(single_number(&[4, 1, 2, 1, 2]), 4);
    assert_eq!(single_number(&[1]), 1);
    assert_eq!(single_number(&[3, 3, 7, 7, 5]), 5);
    println!("ok");
}`,
    starter: `fn single_number(nums: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(single_number(&[4, 1, 2, 1, 2]), 4);
    println!("ok");
}`,
    tags: ['bits', 'xor', 'single-number'],
  },
  {
    id: 'ds-ch14-c-008',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Missing Number in 0..n',
    prompt: `Implement:

    fn missing_number(nums: &[u32]) -> u32

nums contains n distinct values drawn from 0..=n with exactly one value missing.
Return the missing value. Solve in O(n) time without using extra space.
Example: nums = [3, 0, 1] -> 2`,
    hints: [
      'XOR all indices 0..=n together, then XOR all elements in nums.',
      'Every value that appears in both cancels out, leaving the missing one.',
    ],
    solution: `fn missing_number(nums: &[u32]) -> u32 {
    let n = nums.len() as u32;
    let expected_xor = (0..=n).fold(0u32, |acc, x| acc ^ x);
    let actual_xor = nums.iter().fold(0u32, |acc, &x| acc ^ x);
    expected_xor ^ actual_xor
}

fn main() {
    assert_eq!(missing_number(&[3, 0, 1]), 2);
    assert_eq!(missing_number(&[0, 1]), 2);
    assert_eq!(missing_number(&[9, 6, 4, 2, 3, 5, 7, 0, 1]), 8);
    for missing in 0u32..20 {
        let mut v: Vec<u32> = (0..20).filter(|&x| x != missing).collect();
        assert_eq!(missing_number(&v), missing);
        v.sort();
        assert_eq!(missing_number(&v), missing);
    }
    println!("ok");
}`,
    starter: `fn missing_number(nums: &[u32]) -> u32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(missing_number(&[3, 0, 1]), 2);
    println!("ok");
}`,
    tags: ['bits', 'xor', 'missing-number'],
  },
  {
    id: 'ds-ch14-c-009',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Hamming Distance Between Two Numbers',
    prompt: `Implement:

    fn hamming_distance(x: u32, y: u32) -> u32

Return the Hamming distance between x and y, defined as the number of bit positions
where the two values differ.
Example: x = 1 (0001), y = 4 (0100) -> 2`,
    hints: [
      'XOR produces a 1 in every position where x and y differ.',
      'Count the set bits in x ^ y.',
    ],
    solution: `fn hamming_distance(x: u32, y: u32) -> u32 {
    (x ^ y).count_ones()
}

fn main() {
    assert_eq!(hamming_distance(1, 4), 2);
    assert_eq!(hamming_distance(3, 1), 1);
    assert_eq!(hamming_distance(0, 0), 0);
    assert_eq!(hamming_distance(0xFFFFFFFF, 0), 32);
    for a in 0u32..64 {
        for b in 0u32..64 {
            let diff = (a ^ b).count_ones();
            assert_eq!(hamming_distance(a, b), diff);
        }
    }
    println!("ok");
}`,
    starter: `fn hamming_distance(x: u32, y: u32) -> u32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(hamming_distance(1, 4), 2);
    println!("ok");
}`,
    tags: ['bits', 'hamming-distance', 'xor'],
  },
  {
    id: 'ds-ch14-c-010',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Reverse the Bits of a u32',
    prompt: `Implement:

    fn reverse_bits(n: u32) -> u32

Return the value obtained by reversing the bit order of the 32-bit unsigned integer n.
Bit 0 becomes bit 31, bit 1 becomes bit 30, and so on.
Example: n = 1 (0x00000001) -> 0x80000000`,
    hints: [
      'Process one bit at a time: strip the LSB of n and place it as the next MSB of result.',
      'Repeat 32 times regardless of n.',
    ],
    solution: `fn reverse_bits(mut n: u32) -> u32 {
    let mut result = 0u32;
    for _ in 0..32 {
        result = (result << 1) | (n & 1);
        n >>= 1;
    }
    result
}

fn main() {
    assert_eq!(reverse_bits(0b00000010100101000001111010011100), 0b00111001011110000010100101000000);
    assert_eq!(reverse_bits(0), 0);
    assert_eq!(reverse_bits(0xFFFFFFFF), 0xFFFFFFFF);
    assert_eq!(reverse_bits(1), 0x80000000);
    for x in [0u32, 1, 255, 0x12345678, 0xABCDEF01] {
        assert_eq!(reverse_bits(x), x.reverse_bits());
    }
    println!("ok");
}`,
    starter: `fn reverse_bits(n: u32) -> u32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(reverse_bits(1), 0x80000000);
    println!("ok");
}`,
    tags: ['bits', 'reverse-bits'],
  },
  {
    id: 'ds-ch14-c-011',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Total Hamming Distance Across an Array',
    prompt: `Implement:

    fn total_hamming_distance(nums: &[u32]) -> u32

Return the sum of Hamming distances between every pair of distinct elements in nums.
Aim for O(32 * n) time rather than the O(n^2) brute force.
Example: nums = [4, 14, 2] -> 6`,
    hints: [
      'For each bit position, count how many numbers have that bit set (call it ones) and how many do not (zeros = n - ones).',
      'Each (one, zero) pair contributes 1 to the total, so add ones * zeros for that bit.',
    ],
    solution: `fn total_hamming_distance(nums: &[u32]) -> u32 {
    let mut total = 0u32;
    for bit in 0..32 {
        let ones: u32 = nums.iter().map(|&x| (x >> bit) & 1).sum();
        let zeros = nums.len() as u32 - ones;
        total += ones * zeros;
    }
    total
}

fn brute_total(nums: &[u32]) -> u32 {
    let mut t = 0;
    for i in 0..nums.len() {
        for j in (i + 1)..nums.len() {
            t += (nums[i] ^ nums[j]).count_ones();
        }
    }
    t
}

fn main() {
    assert_eq!(total_hamming_distance(&[4, 14, 2]), 6);
    assert_eq!(total_hamming_distance(&[4, 14, 4]), 4);
    assert_eq!(total_hamming_distance(&[]), 0);
    assert_eq!(total_hamming_distance(&[1]), 0);
    let test = vec![1u32, 3, 5, 7, 9, 11, 13, 15];
    assert_eq!(total_hamming_distance(&test), brute_total(&test));
    println!("ok");
}`,
    starter: `fn total_hamming_distance(nums: &[u32]) -> u32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(total_hamming_distance(&[4, 14, 2]), 6);
    println!("ok");
}`,
    tags: ['bits', 'hamming-distance', 'array'],
  },
  {
    id: 'ds-ch14-c-012',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count Bits for Every Number 0..=n',
    prompt: `Implement:

    fn count_bits_range(n: u32) -> Vec<u32>

Return a vector of length n + 1 where element i holds the number of set bits in i.
Achieve O(n) time using a dynamic programming recurrence rather than calling count_ones on each value.
Example: n = 5 -> [0, 1, 1, 2, 1, 2]`,
    hints: [
      'dp[i] = dp[i >> 1] + (i & 1).',
      'Shifting i right by 1 is equivalent to dividing by 2 and the DP already has that result.',
    ],
    solution: `fn count_bits_range(n: u32) -> Vec<u32> {
    let mut dp = vec![0u32; (n + 1) as usize];
    for i in 1..=(n as usize) {
        dp[i] = dp[i >> 1] + (i as u32 & 1);
    }
    dp
}

fn main() {
    assert_eq!(count_bits_range(2), vec![0, 1, 1]);
    assert_eq!(count_bits_range(5), vec![0, 1, 1, 2, 1, 2]);
    for n in 0u32..200 {
        let result = count_bits_range(n);
        for (i, &v) in result.iter().enumerate() {
            assert_eq!(v, (i as u32).count_ones(), "mismatch at i={}", i);
        }
    }
    println!("ok");
}`,
    starter: `fn count_bits_range(n: u32) -> Vec<u32> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(count_bits_range(5), vec![0, 1, 1, 2, 1, 2]);
    println!("ok");
}`,
    tags: ['bits', 'dp', 'count-bits'],
  },
  {
    id: 'ds-ch14-c-013',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Gray Code Sequence',
    prompt: `Implement:

    fn gray_code(n: u32) -> Vec<u32>

Return the n-bit Gray code sequence as a vector of 2^n values starting from 0.
Adjacent values (including the wrap from last back to first) must differ in exactly one bit.
Example: n = 2 -> [0, 1, 3, 2]`,
    hints: [
      'For index i, the Gray code is i XOR (i >> 1).',
      'Collect this formula over the range 0..2^n.',
    ],
    solution: `fn gray_code(n: u32) -> Vec<u32> {
    let len = 1u32 << n;
    (0..len).map(|i| i ^ (i >> 1)).collect()
}

fn main() {
    assert_eq!(gray_code(1), vec![0, 1]);
    assert_eq!(gray_code(2), vec![0, 1, 3, 2]);
    assert_eq!(gray_code(3), vec![0, 1, 3, 2, 6, 7, 5, 4]);
    for n in 1u32..5 {
        let codes = gray_code(n);
        let len = 1usize << n;
        assert_eq!(codes.len(), len);
        assert_eq!(codes[0], 0);
        for w in codes.windows(2) {
            assert_eq!((w[0] ^ w[1]).count_ones(), 1, "adjacent codes differ by more than 1 bit");
        }
        assert_eq!((codes[len - 1] ^ codes[0]).count_ones(), 1, "wrap-around should also differ by 1 bit");
    }
    println!("ok");
}`,
    starter: `fn gray_code(n: u32) -> Vec<u32> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(gray_code(2), vec![0, 1, 3, 2]);
    println!("ok");
}`,
    tags: ['bits', 'gray-code'],
  },
  {
    id: 'ds-ch14-c-014',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Swap Two Numbers Without a Temporary Variable',
    prompt: `Implement:

    fn swap_without_temp(a: i32, b: i32) -> (i32, i32)

Return the pair (b, a) — values swapped — using only XOR operations and no extra variable.
Works correctly even when a and b are equal or negative.
Example: a = 3, b = 5 -> (5, 3)`,
    hints: [
      'XOR swap: x ^= y; y ^= x; x ^= y;',
      'After the three steps x holds the original y and y holds the original x.',
    ],
    solution: `fn swap_without_temp(a: i32, b: i32) -> (i32, i32) {
    let mut x = a;
    let mut y = b;
    x ^= y;
    y ^= x;
    x ^= y;
    (x, y)
}

fn main() {
    assert_eq!(swap_without_temp(3, 5), (5, 3));
    assert_eq!(swap_without_temp(0, 0), (0, 0));
    assert_eq!(swap_without_temp(-1, 7), (7, -1));
    assert_eq!(swap_without_temp(100, -200), (-200, 100));
    for a in -10i32..10 {
        for b in -10i32..10 {
            assert_eq!(swap_without_temp(a, b), (b, a));
        }
    }
    println!("ok");
}`,
    starter: `fn swap_without_temp(a: i32, b: i32) -> (i32, i32) {
    // TODO: use only XOR, no extra variable
    todo!()
}

fn main() {
    assert_eq!(swap_without_temp(3, 5), (5, 3));
    println!("ok");
}`,
    tags: ['bits', 'xor', 'swap'],
  },
  {
    id: 'ds-ch14-c-015',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Two Non-Repeating Numbers',
    prompt: `Implement:

    fn two_non_repeating(nums: &[i32]) -> (i32, i32)

Every element appears exactly twice except two elements which each appear exactly once.
Find and return those two elements as a sorted pair (smaller, larger).
Example: nums = [1, 2, 3, 2, 1, 4] -> (3, 4)`,
    hints: [
      'XOR all elements to get xor_all = a XOR b where a, b are the two unique values.',
      'Find any bit where a and b differ (use xor_all & -xor_all to get the lowest differing bit).',
      'Partition elements by that bit and XOR each partition separately to recover a and b.',
    ],
    solution: `fn two_non_repeating(nums: &[i32]) -> (i32, i32) {
    let xor_all = nums.iter().fold(0i32, |acc, &x| acc ^ x);
    let diff_bit = xor_all & xor_all.wrapping_neg();
    let mut a = 0i32;
    let mut b = 0i32;
    for &x in nums {
        if x & diff_bit != 0 {
            a ^= x;
        } else {
            b ^= x;
        }
    }
    if a < b { (a, b) } else { (b, a) }
}

fn main() {
    let (a, b) = two_non_repeating(&[1, 2, 3, 2, 1, 4]);
    assert_eq!((a, b), (3, 4));
    let (a, b) = two_non_repeating(&[5, 7, 5, 3, 3, 8]);
    assert_eq!((a, b), (7, 8));
    let (a, b) = two_non_repeating(&[10, 20]);
    assert_eq!((a, b), (10, 20));
    println!("ok");
}`,
    starter: `fn two_non_repeating(nums: &[i32]) -> (i32, i32) {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(two_non_repeating(&[1, 2, 3, 2, 1, 4]), (3, 4));
    println!("ok");
}`,
    tags: ['bits', 'xor', 'two-unique'],
  },
  {
    id: 'ds-ch14-c-016',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Add Two Integers Without Using Plus',
    prompt: `Implement:

    fn add_without_plus(a: i32, b: i32) -> i32

Compute a + b using only bitwise operations (no arithmetic + or - operators).
Must work for negative numbers too.
Example: a = 1, b = 2 -> 3; a = -5, b = -3 -> -8`,
    hints: [
      'XOR gives the sum without carries; AND gives where the carries occur.',
      'Shift the carry left by one and repeat until there is no carry.',
    ],
    solution: `fn add_without_plus(a: i32, b: i32) -> i32 {
    let mut x = a;
    let mut y = b;
    while y != 0 {
        let carry = (x & y) << 1;
        x ^= y;
        y = carry;
    }
    x
}

fn main() {
    assert_eq!(add_without_plus(1, 2), 3);
    assert_eq!(add_without_plus(0, 0), 0);
    assert_eq!(add_without_plus(-1, 1), 0);
    assert_eq!(add_without_plus(100, 200), 300);
    assert_eq!(add_without_plus(-5, -3), -8);
    for a in -20i32..20 {
        for b in -20i32..20 {
            assert_eq!(add_without_plus(a, b), a.wrapping_add(b));
        }
    }
    println!("ok");
}`,
    starter: `fn add_without_plus(a: i32, b: i32) -> i32 {
    // TODO: no + or - operators
    todo!()
}

fn main() {
    assert_eq!(add_without_plus(1, 2), 3);
    assert_eq!(add_without_plus(-5, -3), -8);
    println!("ok");
}`,
    tags: ['bits', 'addition', 'carry'],
  },
  {
    id: 'ds-ch14-c-017',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Multiply Using Bit Shifts',
    prompt: `Implement:

    fn multiply_by_shift(a: u32, b: u32) -> u32

Compute a * b using only bit shifts and addition, no multiplication operator.
Use the binary multiplication (Russian peasant) algorithm.
Example: a = 3, b = 4 -> 12`,
    hints: [
      'If the current LSB of b is 1, add the current value of a to result.',
      'Double a (shift left) and halve b (shift right) each iteration.',
    ],
    solution: `fn multiply_by_shift(a: u32, b: u32) -> u32 {
    let mut result = 0u32;
    let mut x = a;
    let mut y = b;
    while y > 0 {
        if y & 1 == 1 {
            result = result.wrapping_add(x);
        }
        x = x.wrapping_add(x);
        y >>= 1;
    }
    result
}

fn main() {
    assert_eq!(multiply_by_shift(3, 4), 12);
    assert_eq!(multiply_by_shift(0, 100), 0);
    assert_eq!(multiply_by_shift(7, 0), 0);
    assert_eq!(multiply_by_shift(1, 1), 1);
    assert_eq!(multiply_by_shift(255, 255), 65025);
    for a in 0u32..50 {
        for b in 0u32..50 {
            assert_eq!(multiply_by_shift(a, b), a.wrapping_mul(b));
        }
    }
    println!("ok");
}`,
    starter: `fn multiply_by_shift(a: u32, b: u32) -> u32 {
    // TODO: no * operator
    todo!()
}

fn main() {
    assert_eq!(multiply_by_shift(3, 4), 12);
    println!("ok");
}`,
    tags: ['bits', 'shift', 'multiply'],
  },
  {
    id: 'ds-ch14-c-018',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Divide Using Bit Shifts',
    prompt: `Implement:

    fn divide_by_shift(a: u32, b: u32) -> u32

Compute the integer quotient a / b using only bit shifts and subtraction, no division operator.
Assumes b != 0. For each bit position from highest to lowest, check whether b shifted left by
that amount fits in the remainder.
Example: a = 10, b = 2 -> 5; a = 7, b = 3 -> 2`,
    hints: [
      'Work from bit 31 down to bit 0.',
      'Use u64 arithmetic internally to avoid overflow when shifting b.',
      'If the shifted divisor fits, subtract it from remainder and set that bit in the quotient.',
    ],
    solution: `fn divide_by_shift(a: u32, b: u32) -> u32 {
    assert!(b != 0, "division by zero");
    let mut quotient = 0u32;
    let mut remainder = a as u64;
    let b64 = b as u64;
    let mut shift = 31i32;
    while shift >= 0 {
        let bs = b64 << (shift as u64);
        if remainder >= bs {
            remainder -= bs;
            quotient |= 1u32 << (shift as u32);
        }
        shift -= 1;
    }
    quotient
}

fn main() {
    assert_eq!(divide_by_shift(10, 2), 5);
    assert_eq!(divide_by_shift(7, 3), 2);
    assert_eq!(divide_by_shift(0, 5), 0);
    assert_eq!(divide_by_shift(100, 10), 10);
    assert_eq!(divide_by_shift(1, 1), 1);
    for a in 0u32..100 {
        for b in 1u32..20 {
            assert_eq!(divide_by_shift(a, b), a / b, "failed for {} / {}", a, b);
        }
    }
    println!("ok");
}`,
    starter: `fn divide_by_shift(a: u32, b: u32) -> u32 {
    assert!(b != 0, "division by zero");
    // TODO: no / operator
    todo!()
}

fn main() {
    assert_eq!(divide_by_shift(10, 2), 5);
    assert_eq!(divide_by_shift(7, 3), 2);
    println!("ok");
}`,
    tags: ['bits', 'shift', 'divide'],
  },
  {
    id: 'ds-ch14-c-019',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Bitwise AND of a Numeric Range',
    prompt: `Implement:

    fn range_bitwise_and(left: u32, right: u32) -> u32

Return the bitwise AND of every integer in the inclusive range [left, right].
Example: left = 5, right = 7 -> 4 (5 & 6 & 7 = 0b100)`,
    hints: [
      'Any bit that differs between left and right will be zeroed by the AND of the range.',
      'Right-shift both values until they are equal; that common prefix is the answer shifted back.',
    ],
    solution: `fn range_bitwise_and(left: u32, right: u32) -> u32 {
    let mut l = left;
    let mut r = right;
    let mut shift = 0;
    while l != r {
        l >>= 1;
        r >>= 1;
        shift += 1;
    }
    l << shift
}

fn brute_range_and(left: u32, right: u32) -> u32 {
    let mut result = left;
    for x in left..=right {
        result &= x;
    }
    result
}

fn main() {
    assert_eq!(range_bitwise_and(5, 7), 4);
    assert_eq!(range_bitwise_and(0, 0), 0);
    assert_eq!(range_bitwise_and(1, 1), 1);
    assert_eq!(range_bitwise_and(6, 8), 0);
    for l in 0u32..30 {
        for r in l..30 {
            assert_eq!(range_bitwise_and(l, r), brute_range_and(l, r), "failed for [{}, {}]", l, r);
        }
    }
    println!("ok");
}`,
    starter: `fn range_bitwise_and(left: u32, right: u32) -> u32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(range_bitwise_and(5, 7), 4);
    assert_eq!(range_bitwise_and(6, 8), 0);
    println!("ok");
}`,
    tags: ['bits', 'range-and', 'common-prefix'],
  },
  {
    id: 'ds-ch14-c-020',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Enumerate All Subsets via Bitmask',
    prompt: `Implement:

    fn enumerate_subsets(nums: &[i32]) -> Vec<Vec<i32>>

Return all 2^n subsets of nums in bitmask order (empty set first, full set last).
For mask from 0 to 2^n - 1, include nums[i] in the subset whenever bit i of mask is set.
Example: nums = [1, 2, 3] -> 8 subsets including [], [1], [2], [1,2], [3], ...`,
    hints: [
      'Outer loop: mask from 0 to (1 << n) - 1.',
      'Inner loop: check each bit of mask to decide whether to include that element.',
    ],
    solution: `fn enumerate_subsets(nums: &[i32]) -> Vec<Vec<i32>> {
    let n = nums.len();
    let total = 1usize << n;
    let mut result = Vec::with_capacity(total);
    for mask in 0..total {
        let mut subset = Vec::new();
        for i in 0..n {
            if mask & (1 << i) != 0 {
                subset.push(nums[i]);
            }
        }
        result.push(subset);
    }
    result
}

fn main() {
    let s1 = enumerate_subsets(&[1, 2, 3]);
    assert_eq!(s1.len(), 8);
    assert!(s1.contains(&vec![]));
    assert!(s1.contains(&vec![1]));
    assert!(s1.contains(&vec![1, 2, 3]));
    let s2 = enumerate_subsets(&[]);
    assert_eq!(s2.len(), 1);
    assert_eq!(s2[0], vec![]);
    for n in 0usize..6 {
        let nums: Vec<i32> = (1..=(n as i32)).collect();
        let subsets = enumerate_subsets(&nums);
        assert_eq!(subsets.len(), 1 << n);
    }
    println!("ok");
}`,
    starter: `fn enumerate_subsets(nums: &[i32]) -> Vec<Vec<i32>> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(enumerate_subsets(&[1, 2, 3]).len(), 8);
    println!("ok");
}`,
    tags: ['bits', 'bitmask', 'subsets', 'enumeration'],
  },
  {
    id: 'ds-ch14-c-021',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Single Number Appearing Once Among Triples',
    prompt: `Implement:

    fn single_number_three(nums: &[i32]) -> i32

Every element in nums appears exactly three times, except one element which appears exactly once.
Return that unique element. Use O(1) space and O(n) time.
Example: nums = [2, 2, 3, 2] -> 3`,
    hints: [
      'Maintain two accumulators: ones (bits seen 1 mod 3 times) and twos (bits seen 2 mod 3 times).',
      'Update ones and twos together each step so that bits seen 3 times are cleared from both.',
      'ones = (ones XOR x) AND NOT twos; twos = (twos XOR x) AND NOT ones.',
    ],
    solution: `fn single_number_three(nums: &[i32]) -> i32 {
    let mut ones = 0i32;
    let mut twos = 0i32;
    for &x in nums {
        ones = (ones ^ x) & !twos;
        twos = (twos ^ x) & !ones;
    }
    ones
}

fn brute_single_three(nums: &[i32]) -> i32 {
    use std::collections::HashMap;
    let mut counts: HashMap<i32, i32> = HashMap::new();
    for &x in nums {
        *counts.entry(x).or_insert(0) += 1;
    }
    *counts.iter().find(|(_, &v)| v % 3 != 0).unwrap().0
}

fn main() {
    assert_eq!(single_number_three(&[2, 2, 3, 2]), 3);
    assert_eq!(single_number_three(&[0, 1, 0, 1, 0, 1, 99]), 99);
    assert_eq!(single_number_three(&[1, 1, 1, 5]), 5);
    let test = vec![7, 7, 7, 4, 4, 4, 3, 3, 3, 9, 9, 9, 11];
    assert_eq!(single_number_three(&test), brute_single_three(&test));
    println!("ok");
}`,
    starter: `fn single_number_three(nums: &[i32]) -> i32 {
    // TODO: O(n) time, O(1) space
    todo!()
}

fn main() {
    assert_eq!(single_number_three(&[2, 2, 3, 2]), 3);
    println!("ok");
}`,
    tags: ['bits', 'single-number', 'modular-counting'],
  },
  {
    id: 'ds-ch14-c-022',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Maximum XOR of Two Array Elements',
    prompt: `Implement:

    fn maximum_xor(nums: &[u32]) -> u32

Return the maximum value obtainable by XORing any two elements from nums (same index allowed).
Target O(32 * n) using a greedy bit-by-bit prefix approach.
Example: nums = [3, 10, 5, 25, 2, 8] -> 28`,
    hints: [
      'Build max_xor greedily from the MSB down.',
      'At each bit, collect all prefixes (masked values) into a HashSet.',
      'Try setting the current bit: check if two prefixes p1, p2 exist with p1 XOR p2 == candidate.',
    ],
    solution: `fn maximum_xor(nums: &[u32]) -> u32 {
    let mut max_xor = 0u32;
    let mut mask = 0u32;
    for i in (0..32).rev() {
        mask |= 1 << i;
        let prefixes: std::collections::HashSet<u32> = nums.iter().map(|&x| x & mask).collect();
        let candidate = max_xor | (1 << i);
        let found = prefixes.iter().any(|&p| prefixes.contains(&(candidate ^ p)));
        if found {
            max_xor = candidate;
        }
    }
    max_xor
}

fn brute_max_xor(nums: &[u32]) -> u32 {
    let mut best = 0u32;
    for &a in nums {
        for &b in nums {
            best = best.max(a ^ b);
        }
    }
    best
}

fn main() {
    assert_eq!(maximum_xor(&[3, 10, 5, 25, 2, 8]), 28);
    assert_eq!(maximum_xor(&[0]), 0);
    assert_eq!(maximum_xor(&[2, 4]), 6);
    for test in [
        vec![1u32, 2, 3, 4, 5],
        vec![14, 70, 53, 83, 49, 91],
        vec![0, 1, 2, 3, 7, 15],
    ] {
        assert_eq!(maximum_xor(&test), brute_max_xor(&test));
    }
    println!("ok");
}`,
    starter: `fn maximum_xor(nums: &[u32]) -> u32 {
    // TODO: greedy prefix approach
    todo!()
}

fn main() {
    assert_eq!(maximum_xor(&[3, 10, 5, 25, 2, 8]), 28);
    println!("ok");
}`,
    tags: ['bits', 'xor', 'greedy', 'hashset'],
  },
  {
    id: 'ds-ch14-c-023',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Minimum Flips to Make a OR b Equal c',
    prompt: `Implement:

    fn min_flips(a: u32, b: u32, c: u32) -> u32

Return the minimum number of bit flips (changing a 0 to 1 or 1 to 0 in a or b) needed
so that a OR b == c. Consider each bit position independently.
Example: a = 2, b = 6, c = 5 -> 3`,
    hints: [
      'For each bit position look at (ai, bi, ci).',
      'If ci is 1 and both ai and bi are 0: one flip needed.',
      'If ci is 0: each 1 in ai or bi costs one flip (so ai + bi flips needed).',
    ],
    solution: `fn min_flips(a: u32, b: u32, c: u32) -> u32 {
    let mut flips = 0u32;
    for i in 0..32 {
        let ai = (a >> i) & 1;
        let bi = (b >> i) & 1;
        let ci = (c >> i) & 1;
        if ci == 1 {
            if ai == 0 && bi == 0 {
                flips += 1;
            }
        } else {
            flips += ai + bi;
        }
    }
    flips
}

fn brute_min_flips(a: u32, b: u32, c: u32) -> u32 {
    let mut f = 0u32;
    for i in 0..32 {
        let ai = (a >> i) & 1;
        let bi = (b >> i) & 1;
        let ci = (c >> i) & 1;
        let or_ab = ai | bi;
        if or_ab != ci {
            if ci == 1 {
                f += 1;
            } else {
                f += ai + bi;
            }
        }
    }
    f
}

fn main() {
    assert_eq!(min_flips(2, 6, 5), 3);
    assert_eq!(min_flips(4, 2, 7), 1);
    assert_eq!(min_flips(1, 2, 3), 0);
    for a in 0u32..8 {
        for b in 0u32..8 {
            for c in 0u32..8 {
                assert_eq!(min_flips(a, b, c), brute_min_flips(a, b, c), "failed a={} b={} c={}", a, b, c);
            }
        }
    }
    println!("ok");
}`,
    starter: `fn min_flips(a: u32, b: u32, c: u32) -> u32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(min_flips(2, 6, 5), 3);
    assert_eq!(min_flips(1, 2, 3), 0);
    println!("ok");
}`,
    tags: ['bits', 'flips', 'or'],
  },
  {
    id: 'ds-ch14-c-024',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Position of the Only Set Bit',
    prompt: `Implement:

    fn position_of_only_set_bit(n: u32) -> Option<u32>

If n has exactly one bit set (i.e. n is a power of two), return Some(position) where
position is the 0-indexed bit position from the right. Otherwise return None.
Example: n = 16 (0b10000) -> Some(4); n = 3 -> None`,
    hints: [
      'First verify n is a non-zero power of two using n & (n - 1) == 0.',
      'Then use trailing_zeros() to find the position, or count right-shifts until n == 1.',
    ],
    solution: `fn position_of_only_set_bit(n: u32) -> Option<u32> {
    if n == 0 || (n & (n - 1)) != 0 {
        return None;
    }
    Some(n.trailing_zeros())
}

fn main() {
    assert_eq!(position_of_only_set_bit(1), Some(0));
    assert_eq!(position_of_only_set_bit(2), Some(1));
    assert_eq!(position_of_only_set_bit(16), Some(4));
    assert_eq!(position_of_only_set_bit(0), None);
    assert_eq!(position_of_only_set_bit(3), None);
    for i in 0u32..32 {
        let x = 1u32 << i;
        assert_eq!(position_of_only_set_bit(x), Some(i));
    }
    for x in [0u32, 3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15] {
        let is_pow2 = x > 0 && x.count_ones() == 1;
        if is_pow2 {
            assert!(position_of_only_set_bit(x).is_some());
        } else {
            assert_eq!(position_of_only_set_bit(x), None);
        }
    }
    println!("ok");
}`,
    starter: `fn position_of_only_set_bit(n: u32) -> Option<u32> {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(position_of_only_set_bit(16), Some(4));
    assert_eq!(position_of_only_set_bit(3), None);
    println!("ok");
}`,
    tags: ['bits', 'trailing-zeros', 'power-of-two'],
  },
  {
    id: 'ds-ch14-c-025',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Pack and Unpack Small Integers into a u64',
    prompt: `Implement two functions:

    fn pack_fields(values: &[u32], widths: &[u32]) -> u64
    fn unpack_fields(packed: u64, widths: &[u32]) -> Vec<u32>

pack_fields stores each values[i] in a field of widths[i] bits, placed consecutively
from bit 0 upward. unpack_fields reverses the process.
Example: values=[3,7,1,15], widths=[2,3,1,4] -> pack -> unpack -> [3,7,1,15]`,
    hints: [
      'Track a running bit offset. For each field, shift the value left by the offset and OR into packed.',
      'To unpack, shift packed right by offset and mask with (1 << width) - 1.',
    ],
    solution: `fn pack_fields(values: &[u32], widths: &[u32]) -> u64 {
    assert_eq!(values.len(), widths.len());
    let mut packed = 0u64;
    let mut offset = 0u32;
    for (&v, &w) in values.iter().zip(widths.iter()) {
        let mask = (1u64 << w) - 1;
        assert!(v as u64 <= mask, "value {} does not fit in {} bits", v, w);
        packed |= (v as u64 & mask) << offset;
        offset += w;
    }
    packed
}

fn unpack_fields(packed: u64, widths: &[u32]) -> Vec<u32> {
    let mut result = Vec::with_capacity(widths.len());
    let mut offset = 0u32;
    for &w in widths {
        let mask = (1u64 << w) - 1;
        result.push(((packed >> offset) & mask) as u32);
        offset += w;
    }
    result
}

fn main() {
    let values = vec![3u32, 7, 1, 15];
    let widths = vec![2u32, 3, 1, 4];
    let packed = pack_fields(&values, &widths);
    let unpacked = unpack_fields(packed, &widths);
    assert_eq!(unpacked, values);

    let values2 = vec![0u32, 31, 0, 31];
    let widths2 = vec![5u32, 5, 5, 5];
    let packed2 = pack_fields(&values2, &widths2);
    let unpacked2 = unpack_fields(packed2, &widths2);
    assert_eq!(unpacked2, values2);

    for a in 0u32..4 {
        for b in 0u32..8 {
            for c in 0u32..2 {
                let v = vec![a, b, c];
                let w = vec![2u32, 3, 1];
                let p = pack_fields(&v, &w);
                assert_eq!(unpack_fields(p, &w), v);
            }
        }
    }
    println!("ok");
}`,
    starter: `fn pack_fields(values: &[u32], widths: &[u32]) -> u64 {
    // TODO
    todo!()
}

fn unpack_fields(packed: u64, widths: &[u32]) -> Vec<u32> {
    // TODO
    todo!()
}

fn main() {
    let v = vec![3u32, 7, 1, 15];
    let w = vec![2u32, 3, 1, 4];
    assert_eq!(unpack_fields(pack_fields(&v, &w), &w), v);
    println!("ok");
}`,
    tags: ['bits', 'pack', 'unpack', 'fields'],
  },
  {
    id: 'ds-ch14-c-026',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Next Higher Number With Same Popcount',
    prompt: `Implement:

    fn next_set_bit(n: u32) -> u32

Given a positive integer n, return the smallest integer greater than n that has
the same number of set bits. This is the "next permutation of bits" problem.
Example: n = 0b0111 (7) -> 0b1011 (11)`,
    hints: [
      'Let c = n & (-n) isolate the rightmost set bit.',
      'Let r = n + c to ripple the carry.',
      'The right_ones count comes from ((r ^ n) / c) >> 2.',
      'Answer is r | right_ones.',
    ],
    solution: `fn next_set_bit(mut n: u32) -> u32 {
    let c = n & n.wrapping_neg();
    let r = n + c;
    let right_ones = ((r ^ n) / c) >> 2;
    r | right_ones
}

fn count_set(x: u32) -> u32 { x.count_ones() }

fn main() {
    let x = 0b0111u32;
    let y = next_set_bit(x);
    assert_eq!(count_set(y), count_set(x));
    assert!(y > x);

    let x2 = 0b1001011u32;
    let y2 = next_set_bit(x2);
    assert_eq!(count_set(y2), count_set(x2));
    assert!(y2 > x2);

    for start in [0b1u32, 0b11, 0b101, 0b110, 0b1010, 0b10100] {
        let bits = count_set(start);
        let mut prev = start;
        for _ in 0..10 {
            let nxt = next_set_bit(prev);
            assert_eq!(count_set(nxt), bits, "bit count changed");
            assert!(nxt > prev, "not increasing");
            prev = nxt;
        }
    }
    println!("ok");
}`,
    starter: `fn next_set_bit(n: u32) -> u32 {
    // TODO
    todo!()
}

fn main() {
    let x = 0b0111u32;
    let y = next_set_bit(x);
    assert_eq!(y.count_ones(), x.count_ones());
    assert!(y > x);
    println!("ok");
}`,
    tags: ['bits', 'next-permutation', 'popcount'],
  },
  {
    id: 'ds-ch14-c-027',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'XOR of All Numbers in a Range',
    prompt: `Implement:

    fn xor_from_l_to_r(l: u64, r: u64) -> u64

Return the XOR of every integer from l to r inclusive, in O(1) time.
Use the pattern that XOR from 0 to n follows a 4-cycle based on n mod 4.
Example: l = 1, r = 4 -> 1 XOR 2 XOR 3 XOR 4 = 4`,
    hints: [
      'XOR(0..=n) cycles: n%4==0 -> n, n%4==1 -> 1, n%4==2 -> n+1, n%4==3 -> 0.',
      'XOR(l..=r) = XOR(0..=r) XOR XOR(0..=l-1).',
    ],
    solution: `fn xor_range(n: u64) -> u64 {
    match n % 4 {
        0 => n,
        1 => 1,
        2 => n + 1,
        3 => 0,
        _ => unreachable!(),
    }
}

fn xor_from_l_to_r(l: u64, r: u64) -> u64 {
    xor_range(r) ^ xor_range(l - 1)
}

fn brute_xor(l: u64, r: u64) -> u64 {
    (l..=r).fold(0u64, |acc, x| acc ^ x)
}

fn main() {
    assert_eq!(xor_from_l_to_r(1, 4), 4);
    assert_eq!(xor_from_l_to_r(2, 3), 1);
    assert_eq!(xor_from_l_to_r(1, 1), 1);
    assert_eq!(xor_from_l_to_r(1, 5), 1);
    for l in 1u64..30 {
        for r in l..30 {
            assert_eq!(xor_from_l_to_r(l, r), brute_xor(l, r), "failed l={} r={}", l, r);
        }
    }
    println!("ok");
}`,
    starter: `fn xor_from_l_to_r(l: u64, r: u64) -> u64 {
    // TODO: O(1) using xor_range helper
    todo!()
}

fn main() {
    assert_eq!(xor_from_l_to_r(1, 4), 4);
    assert_eq!(xor_from_l_to_r(2, 3), 1);
    println!("ok");
}`,
    tags: ['bits', 'xor', 'range', 'constant-time'],
  },
  {
    id: 'ds-ch14-c-028',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Total Set Bits in All Numbers 0..=n',
    prompt: `Implement:

    fn count_total_set_bits(n: u64) -> u64

Return the total number of 1-bits across all integers from 0 to n inclusive.
Achieve O(log n) time rather than iterating over each number.
Example: n = 3 -> 0+1+1+2 = 4`,
    hints: [
      'For each bit position i (value i = 1, 2, 4, ...): numbers repeat in blocks of 2i with exactly i ones in the upper half.',
      'Count full blocks and the partial block separately.',
    ],
    solution: `fn count_total_set_bits(n: u64) -> u64 {
    let mut count = 0u64;
    let mut i = 1u64;
    while i <= n {
        let full_pairs = (n + 1) / (i * 2);
        let remainder = (n + 1) % (i * 2);
        count += full_pairs * i;
        if remainder > i {
            count += remainder - i;
        }
        i *= 2;
    }
    count
}

fn brute_total_bits(n: u64) -> u64 {
    (0..=n).map(|x| x.count_ones() as u64).sum()
}

fn main() {
    assert_eq!(count_total_set_bits(0), 0);
    assert_eq!(count_total_set_bits(1), 1);
    assert_eq!(count_total_set_bits(3), 4);
    assert_eq!(count_total_set_bits(7), 12);
    for n in 0u64..200 {
        assert_eq!(count_total_set_bits(n), brute_total_bits(n), "failed for n={}", n);
    }
    println!("ok");
}`,
    starter: `fn count_total_set_bits(n: u64) -> u64 {
    // TODO: O(log n) solution
    todo!()
}

fn main() {
    assert_eq!(count_total_set_bits(3), 4);
    assert_eq!(count_total_set_bits(7), 12);
    println!("ok");
}`,
    tags: ['bits', 'counting', 'logarithmic'],
  },
  {
    id: 'ds-ch14-c-029',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Longest Subarray with Given XOR',
    prompt: `Implement:

    fn longest_subarray_with_xor(nums: &[u32], target: u32) -> usize

Return the length of the longest contiguous subarray whose XOR equals target.
Solve in O(n) using prefix XOR and a HashMap.
Example: nums = [1, 2, 3, 2], target = 3 -> 3 (subarray [2, 3, 2] has XOR = 1^2^3^2... check: 2^3^2=3)`,
    hints: [
      'Maintain a running prefix XOR. At each index i, we want the earliest j where prefix[j] = prefix[i] XOR target.',
      'Store the first occurrence of each prefix XOR value in a HashMap.',
      'Initialize the map with prefix_xor=0 at position 0 (before any elements).',
    ],
    solution: `fn longest_subarray_with_xor(nums: &[u32], target: u32) -> usize {
    use std::collections::HashMap;
    let mut prefix_xor = 0u32;
    let mut best = 0usize;
    let mut first_seen: HashMap<u32, usize> = HashMap::new();
    first_seen.insert(0, 0);
    for (i, &x) in nums.iter().enumerate() {
        prefix_xor ^= x;
        let needed = prefix_xor ^ target;
        if let Some(&j) = first_seen.get(&needed) {
            best = best.max(i + 1 - j);
        }
        first_seen.entry(prefix_xor).or_insert(i + 1);
    }
    best
}

fn brute_longest_xor(nums: &[u32], target: u32) -> usize {
    let mut best = 0;
    for i in 0..nums.len() {
        let mut xv = 0u32;
        for j in i..nums.len() {
            xv ^= nums[j];
            if xv == target {
                best = best.max(j - i + 1);
            }
        }
    }
    best
}

fn main() {
    assert_eq!(longest_subarray_with_xor(&[1, 2, 3, 2], 3), 3);
    assert_eq!(longest_subarray_with_xor(&[4, 2, 2, 6, 4], 6), 5);
    assert_eq!(longest_subarray_with_xor(&[5], 5), 1);
    assert_eq!(longest_subarray_with_xor(&[1, 2, 3], 0), 3);
    for target in [0u32, 1, 2, 3, 5, 7] {
        let test = vec![3u32, 1, 2, 3, 4, 5, 6, 7];
        assert_eq!(
            longest_subarray_with_xor(&test, target),
            brute_longest_xor(&test, target),
            "failed target={}",
            target
        );
    }
    println!("ok");
}`,
    starter: `fn longest_subarray_with_xor(nums: &[u32], target: u32) -> usize {
    // TODO: prefix XOR + HashMap
    todo!()
}

fn main() {
    assert_eq!(longest_subarray_with_xor(&[4, 2, 2, 6, 4], 6), 5);
    println!("ok");
}`,
    tags: ['bits', 'xor', 'prefix-xor', 'hashmap', 'subarray'],
  },
  {
    id: 'ds-ch14-c-030',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Maximum AND of Any Pair in an Array',
    prompt: `Implement:

    fn max_and_pair(nums: &[u32]) -> u32

Return the maximum value of nums[i] AND nums[j] over all pairs (i != j).
Use a greedy bit-by-bit approach from the MSB: at each step try to set the current bit
and check if at least two elements support it.
Example: nums = [4, 8, 12, 16] -> 8`,
    hints: [
      'Build result from MSB to LSB. At each bit, form candidate = result | (1 << bit).',
      'Count elements x where x & candidate == candidate (all decided bits must match).',
      'If count >= 2 then at least two elements can jointly provide those bits.',
    ],
    solution: `fn max_and_pair(nums: &[u32]) -> u32 {
    let mut result = 0u32;
    for bit in (0..32).rev() {
        let candidate = result | (1 << bit);
        let count = nums.iter().filter(|&&x| x & candidate == candidate).count();
        if count >= 2 {
            result = candidate;
        }
    }
    result
}

fn brute_max_and(nums: &[u32]) -> u32 {
    let mut best = 0u32;
    for i in 0..nums.len() {
        for j in (i + 1)..nums.len() {
            best = best.max(nums[i] & nums[j]);
        }
    }
    best
}

fn main() {
    assert_eq!(max_and_pair(&[4, 8, 12, 16]), 8);
    assert_eq!(max_and_pair(&[1, 2, 3, 4, 5]), 4);
    assert_eq!(max_and_pair(&[3, 5, 7, 9]), 5);
    for test in [
        vec![1u32, 2, 3, 4, 5, 6, 7],
        vec![10, 12, 14, 16, 18, 20],
        vec![0, 1, 2, 3, 4, 5],
        vec![15, 14, 13, 12, 11, 10],
    ] {
        assert_eq!(max_and_pair(&test), brute_max_and(&test), "failed for {:?}", test);
    }
    println!("ok");
}`,
    starter: `fn max_and_pair(nums: &[u32]) -> u32 {
    // TODO: greedy from MSB
    todo!()
}

fn main() {
    assert_eq!(max_and_pair(&[4, 8, 12, 16]), 8);
    println!("ok");
}`,
    tags: ['bits', 'and', 'greedy', 'pair'],
  },
]

export default problems
