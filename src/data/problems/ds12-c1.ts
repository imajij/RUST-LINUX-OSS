import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch12-c-001',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Climbing Stairs',
    prompt: `Implement:

    fn climb_stairs(n: u32) -> u64

You can climb 1 or 2 steps at a time. Return the number of distinct ways to reach step n.
Constraints: 0 <= n <= 45.
Example: n = 3 -> 3 (1+1+1, 1+2, 2+1)`,
    hints: ['ways(n) = ways(n-1) + ways(n-2).', 'Iterate bottom-up keeping the last two values.', 'Base: ways(0) = 1, ways(1) = 1.'],
    solution: `fn climb_stairs(n: u32) -> u64 {
    let (mut a, mut b) = (1u64, 1u64);
    for _ in 0..n {
        let c = a + b;
        a = b;
        b = c;
    }
    a
}

fn main() {
    assert_eq!(climb_stairs(0), 1);
    assert_eq!(climb_stairs(1), 1);
    assert_eq!(climb_stairs(3), 3);
    assert_eq!(climb_stairs(5), 8);
    assert_eq!(climb_stairs(10), 89);
    println!("ok");
}`,
    starter: `fn climb_stairs(n: u32) -> u64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(climb_stairs(3), 3);
    println!("ok");
}`,
    tags: ['dp', 'fibonacci'],
  },
  {
    id: 'ds-ch12-c-002',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Min Cost Climbing Stairs',
    prompt: `Implement:

    fn min_cost_climbing_stairs(cost: &[u32]) -> u32

Each index i has a step cost. You can start from index 0 or 1, and from each step you climb 1 or 2.
Return the minimum total cost to reach the top (one past the last index).
Example: cost = [10, 15, 20] -> 15 (start at index 1, pay 15, jump 2 to top)`,
    hints: ['dp[i] = min cost to reach step i.', 'dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2]).', 'dp[0] = dp[1] = 0; answer is dp[n].'],
    solution: `fn min_cost_climbing_stairs(cost: &[u32]) -> u32 {
    let n = cost.len();
    if n == 0 { return 0; }
    if n == 1 { return cost[0]; }
    let mut dp = vec![0u32; n + 1];
    for i in 2..=n {
        let from_one = dp[i - 1] + cost[i - 1];
        let from_two = dp[i - 2] + cost[i - 2];
        dp[i] = from_one.min(from_two);
    }
    dp[n]
}

fn main() {
    assert_eq!(min_cost_climbing_stairs(&[10, 15, 20]), 15);
    assert_eq!(min_cost_climbing_stairs(&[1, 100, 1, 1, 1, 100, 1, 1, 100, 1]), 6);
    assert_eq!(min_cost_climbing_stairs(&[0, 0]), 0);
    println!("ok");
}`,
    starter: `fn min_cost_climbing_stairs(cost: &[u32]) -> u32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(min_cost_climbing_stairs(&[10, 15, 20]), 15);
    println!("ok");
}`,
    tags: ['dp', 'array'],
  },
  {
    id: 'ds-ch12-c-003',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'House Robber',
    prompt: `Implement:

    fn house_robber(nums: &[u32]) -> u32

You are a robber along a street of houses. Adjacent houses have alarms; you cannot rob two adjacent houses.
Given an array of money in each house, return the maximum amount you can rob.
Example: nums = [2, 7, 9, 3, 1] -> 12 (rob index 0, 2, 4: 2+9+1=12)`,
    hints: ['dp[i] = max money robbing houses 0..=i.', 'dp[i] = max(dp[i-1], dp[i-2] + nums[i]).', 'Only two previous values are needed; use rolling variables.'],
    solution: `fn house_robber(nums: &[u32]) -> u32 {
    let n = nums.len();
    if n == 0 { return 0; }
    if n == 1 { return nums[0]; }
    let mut prev2 = nums[0];
    let mut prev1 = nums[0].max(nums[1]);
    for i in 2..n {
        let curr = prev1.max(prev2 + nums[i]);
        prev2 = prev1;
        prev1 = curr;
    }
    prev1
}

fn main() {
    assert_eq!(house_robber(&[1, 2, 3, 1]), 4);
    assert_eq!(house_robber(&[2, 7, 9, 3, 1]), 12);
    assert_eq!(house_robber(&[0]), 0);
    assert_eq!(house_robber(&[5, 1, 1, 5]), 10);
    println!("ok");
}`,
    starter: `fn house_robber(nums: &[u32]) -> u32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(house_robber(&[2, 7, 9, 3, 1]), 12);
    println!("ok");
}`,
    tags: ['dp', 'array'],
  },
  {
    id: 'ds-ch12-c-004',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Maximum Subarray (Kadane)',
    prompt: `Implement:

    fn max_subarray(nums: &[i64]) -> i64

Return the sum of the contiguous subarray with the largest sum. The array contains at least one element.
Example: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4] -> 6 (subarray [4, -1, 2, 1])`,
    hints: ['Track the current running sum; reset if it drops below 0.', 'curr = max(x, curr + x) for each element x.', 'Keep a global maximum across all iterations.'],
    solution: `fn max_subarray(nums: &[i64]) -> i64 {
    let mut max_sum = nums[0];
    let mut curr = nums[0];
    for &x in &nums[1..] {
        curr = x.max(curr + x);
        max_sum = max_sum.max(curr);
    }
    max_sum
}

fn main() {
    assert_eq!(max_subarray(&[-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6);
    assert_eq!(max_subarray(&[1]), 1);
    assert_eq!(max_subarray(&[5, 4, -1, 7, 8]), 23);
    assert_eq!(max_subarray(&[-3, -1, -2]), -1);
    println!("ok");
}`,
    starter: `fn max_subarray(nums: &[i64]) -> i64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(max_subarray(&[-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6);
    println!("ok");
}`,
    tags: ['dp', 'kadane', 'array'],
  },
  {
    id: 'ds-ch12-c-005',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Fibonacci Number',
    prompt: `Implement:

    fn fib(n: u32) -> u64

Return the n-th Fibonacci number where fib(0) = 0, fib(1) = 1, and fib(n) = fib(n-1) + fib(n-2).
Constraints: 0 <= n <= 70 (use u64 to avoid overflow).
Example: fib(6) = 8`,
    hints: ['Use two rolling variables instead of a full array.', 'Initialize a = 0, b = 1 and iterate n times.', 'Handle n == 0 as a special case returning 0.'],
    solution: `fn fib(n: u32) -> u64 {
    if n == 0 { return 0; }
    let (mut a, mut b) = (0u64, 1u64);
    for _ in 1..n {
        let c = a + b;
        a = b;
        b = c;
    }
    b
}

fn main() {
    assert_eq!(fib(0), 0);
    assert_eq!(fib(1), 1);
    assert_eq!(fib(2), 1);
    assert_eq!(fib(6), 8);
    assert_eq!(fib(10), 55);
    println!("ok");
}`,
    starter: `fn fib(n: u32) -> u64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(fib(6), 8);
    println!("ok");
}`,
    tags: ['dp', 'fibonacci', 'math'],
  },
  {
    id: 'ds-ch12-c-006',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Unique Paths',
    prompt: `Implement:

    fn unique_paths(m: usize, n: usize) -> u64

A robot starts at the top-left of an m x n grid and can only move right or down.
Return the number of distinct paths to the bottom-right corner.
Constraints: 1 <= m, n <= 20.
Example: m = 3, n = 7 -> 28`,
    hints: ['dp[j] = number of ways to reach column j in the current row.', 'Each cell equals the sum of the cell above and the cell to the left.', 'Initialize dp to all 1s (only one way along the top row).'],
    solution: `fn unique_paths(m: usize, n: usize) -> u64 {
    let mut dp = vec![1u64; n];
    for _ in 1..m {
        for j in 1..n {
            dp[j] += dp[j - 1];
        }
    }
    dp[n - 1]
}

fn main() {
    assert_eq!(unique_paths(3, 7), 28);
    assert_eq!(unique_paths(3, 2), 3);
    assert_eq!(unique_paths(1, 1), 1);
    assert_eq!(unique_paths(2, 2), 2);
    println!("ok");
}`,
    starter: `fn unique_paths(m: usize, n: usize) -> u64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(unique_paths(3, 7), 28);
    println!("ok");
}`,
    tags: ['dp', 'grid', 'combinatorics'],
  },
  {
    id: 'ds-ch12-c-007',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Minimum Path Sum',
    prompt: `Implement:

    fn min_path_sum(grid: &Vec<Vec<u32>>) -> u32

Given an m x n grid filled with non-negative numbers, find a path from top-left to bottom-right
that minimizes the sum of all numbers along the path. You may only move right or down.
Example: grid = [[1,3,1],[1,5,1],[4,2,1]] -> 7 (1->3->1->1->1)`,
    hints: ['Fill the first row and first column with prefix sums as base cases.', 'dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]).', 'Traverse row by row, left to right.'],
    solution: `fn min_path_sum(grid: &Vec<Vec<u32>>) -> u32 {
    let m = grid.len();
    let n = grid[0].len();
    let mut dp = vec![vec![0u32; n]; m];
    dp[0][0] = grid[0][0];
    for j in 1..n { dp[0][j] = dp[0][j-1] + grid[0][j]; }
    for i in 1..m { dp[i][0] = dp[i-1][0] + grid[i][0]; }
    for i in 1..m {
        for j in 1..n {
            dp[i][j] = grid[i][j] + dp[i-1][j].min(dp[i][j-1]);
        }
    }
    dp[m-1][n-1]
}

fn main() {
    assert_eq!(min_path_sum(&vec![vec![1,3,1],vec![1,5,1],vec![4,2,1]]), 7);
    assert_eq!(min_path_sum(&vec![vec![1,2,3],vec![4,5,6]]), 12);
    assert_eq!(min_path_sum(&vec![vec![5]]), 5);
    println!("ok");
}`,
    starter: `fn min_path_sum(grid: &Vec<Vec<u32>>) -> u32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(min_path_sum(&vec![vec![1,3,1],vec![1,5,1],vec![4,2,1]]), 7);
    println!("ok");
}`,
    tags: ['dp', 'grid', 'array'],
  },
  {
    id: 'ds-ch12-c-008',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Tribonacci Number',
    prompt: `Implement:

    fn tribonacci(n: u32) -> u64

The Tribonacci sequence: T(0) = 0, T(1) = 1, T(2) = 1, T(n) = T(n-1) + T(n-2) + T(n-3).
Return the n-th Tribonacci number. Constraints: 0 <= n <= 37.
Example: tribonacci(4) = 4`,
    hints: ['Use three rolling variables a, b, c representing the last three values.', 'Each step: new = a + b + c; then shift a = b, b = c, c = new.', 'Handle n = 0 separately (returns 0); n = 1 and n = 2 return 1.'],
    solution: `fn tribonacci(n: u32) -> u64 {
    if n == 0 { return 0; }
    if n <= 2 { return 1; }
    let (mut a, mut b, mut c) = (0u64, 1u64, 1u64);
    for _ in 3..=n {
        let d = a + b + c;
        a = b;
        b = c;
        c = d;
    }
    c
}

fn main() {
    assert_eq!(tribonacci(0), 0);
    assert_eq!(tribonacci(1), 1);
    assert_eq!(tribonacci(4), 4);
    assert_eq!(tribonacci(7), 24);
    assert_eq!(tribonacci(25), 1389537);
    println!("ok");
}`,
    starter: `fn tribonacci(n: u32) -> u64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(tribonacci(4), 4);
    println!("ok");
}`,
    tags: ['dp', 'fibonacci', 'math'],
  },
  {
    id: 'ds-ch12-c-009',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Unique Paths with Obstacles',
    prompt: `Implement:

    fn unique_paths_with_obstacles(obstacle_grid: &Vec<Vec<u8>>) -> u64

A robot moves from top-left to bottom-right of a grid, only right or down.
Cells marked 1 are obstacles and cannot be entered. Return the count of distinct paths.
Example: grid = [[0,0,0],[0,1,0],[0,0,0]] -> 2`,
    hints: ['Initialize dp[0][0] = 1 if the start is not blocked.', 'For cells with obstacle value 1, dp[i][j] = 0.', 'Propagate along the first row and column carefully (an obstacle blocks all further cells in that row/column).'],
    solution: `fn unique_paths_with_obstacles(obstacle_grid: &Vec<Vec<u8>>) -> u64 {
    let m = obstacle_grid.len();
    let n = obstacle_grid[0].len();
    if obstacle_grid[0][0] == 1 || obstacle_grid[m-1][n-1] == 1 { return 0; }
    let mut dp = vec![vec![0u64; n]; m];
    dp[0][0] = 1;
    for j in 1..n {
        dp[0][j] = if obstacle_grid[0][j] == 1 { 0 } else { dp[0][j-1] };
    }
    for i in 1..m {
        dp[i][0] = if obstacle_grid[i][0] == 1 { 0 } else { dp[i-1][0] };
    }
    for i in 1..m {
        for j in 1..n {
            if obstacle_grid[i][j] == 1 {
                dp[i][j] = 0;
            } else {
                dp[i][j] = dp[i-1][j] + dp[i][j-1];
            }
        }
    }
    dp[m-1][n-1]
}

fn main() {
    assert_eq!(unique_paths_with_obstacles(&vec![vec![0,0,0],vec![0,1,0],vec![0,0,0]]), 2);
    assert_eq!(unique_paths_with_obstacles(&vec![vec![0,1],vec![0,0]]), 1);
    assert_eq!(unique_paths_with_obstacles(&vec![vec![1]]), 0);
    println!("ok");
}`,
    starter: `fn unique_paths_with_obstacles(obstacle_grid: &Vec<Vec<u8>>) -> u64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(unique_paths_with_obstacles(&vec![vec![0,0,0],vec![0,1,0],vec![0,0,0]]), 2);
    println!("ok");
}`,
    tags: ['dp', 'grid', 'array'],
  },
  {
    id: 'ds-ch12-c-010',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Best Time to Buy and Sell Stock',
    prompt: `Implement:

    fn max_profit(prices: &[i32]) -> i32

Given an array where prices[i] is the price of a stock on day i, return the maximum profit
from a single buy-then-sell transaction. If no profit is possible, return 0.
Example: prices = [7, 1, 5, 3, 6, 4] -> 5 (buy at 1, sell at 6)`,
    hints: ['Track the minimum price seen so far.', 'At each day, compute profit = price - min_price and update the global max.', 'A single pass O(n) is sufficient.'],
    solution: `fn max_profit(prices: &[i32]) -> i32 {
    let mut min_price = i32::MAX;
    let mut max_p = 0i32;
    for &p in prices {
        if p < min_price {
            min_price = p;
        } else if p - min_price > max_p {
            max_p = p - min_price;
        }
    }
    max_p
}

fn main() {
    assert_eq!(max_profit(&[7, 1, 5, 3, 6, 4]), 5);
    assert_eq!(max_profit(&[7, 6, 4, 3, 1]), 0);
    assert_eq!(max_profit(&[1, 2]), 1);
    assert_eq!(max_profit(&[3, 3, 3]), 0);
    println!("ok");
}`,
    starter: `fn max_profit(prices: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(max_profit(&[7, 1, 5, 3, 6, 4]), 5);
    println!("ok");
}`,
    tags: ['dp', 'greedy', 'array'],
  },
  {
    id: 'ds-ch12-c-011',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Coin Change Minimum Coins',
    prompt: `Implement:

    fn coin_change(coins: &[u32], amount: u32) -> i32

Given coin denominations and a target amount, return the minimum number of coins needed
to make up that amount. Return -1 if it is not possible.
Example: coins = [1, 2, 5], amount = 11 -> 3 (5 + 5 + 1)`,
    hints: ['Build dp[0..=amount] where dp[a] = fewest coins for amount a.', 'Initialize dp[0] = 0 and all others to infinity.', 'For each amount a, try all coins: dp[a] = min(dp[a], dp[a - coin] + 1).'],
    solution: `fn coin_change(coins: &[u32], amount: u32) -> i32 {
    let n = amount as usize + 1;
    let mut dp = vec![i32::MAX; n];
    dp[0] = 0;
    for a in 1..n {
        for &c in coins {
            let c = c as usize;
            if c <= a && dp[a - c] != i32::MAX {
                dp[a] = dp[a].min(dp[a - c] + 1);
            }
        }
    }
    if dp[amount as usize] == i32::MAX { -1 } else { dp[amount as usize] }
}

fn main() {
    assert_eq!(coin_change(&[1, 5, 10, 25], 41), 4);
    assert_eq!(coin_change(&[1, 2, 5], 11), 3);
    assert_eq!(coin_change(&[2], 3), -1);
    assert_eq!(coin_change(&[1], 0), 0);
    println!("ok");
}`,
    starter: `fn coin_change(coins: &[u32], amount: u32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(coin_change(&[1, 2, 5], 11), 3);
    println!("ok");
}`,
    tags: ['dp', 'coins', 'bfs'],
  },
  {
    id: 'ds-ch12-c-012',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Coin Change Number of Ways',
    prompt: `Implement:

    fn coin_change_ways(coins: &[usize], amount: usize) -> u64

Given unlimited coins of given denominations, return the number of distinct combinations
that sum to the target amount. Order does not matter (combinations, not permutations).
Example: coins = [1, 2, 5], amount = 5 -> 4 (5; 2+2+1; 2+1+1+1; 1+1+1+1+1)`,
    hints: ['Iterate over coins as the outer loop to count combinations (not permutations).', 'dp[0] = 1 (one way to make amount 0: use no coins).', 'For each coin c and each amount a >= c: dp[a] += dp[a - c].'],
    solution: `fn coin_change_ways(coins: &[usize], amount: usize) -> u64 {
    let mut dp = vec![0u64; amount + 1];
    dp[0] = 1;
    for &c in coins {
        for a in c..=amount {
            dp[a] += dp[a - c];
        }
    }
    dp[amount]
}

fn main() {
    assert_eq!(coin_change_ways(&[1, 2, 5], 5), 4);
    assert_eq!(coin_change_ways(&[2], 3), 0);
    assert_eq!(coin_change_ways(&[10], 10), 1);
    assert_eq!(coin_change_ways(&[1, 2, 3], 4), 4);
    println!("ok");
}`,
    starter: `fn coin_change_ways(coins: &[usize], amount: usize) -> u64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(coin_change_ways(&[1, 2, 5], 5), 4);
    println!("ok");
}`,
    tags: ['dp', 'coins', 'combinatorics'],
  },
  {
    id: 'ds-ch12-c-013',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Longest Increasing Subsequence',
    prompt: `Implement:

    fn length_of_lis(nums: &[i32]) -> usize

Return the length of the longest strictly increasing subsequence.
A subsequence does not need to be contiguous.
Constraints: 1 <= nums.len() <= 2500.
Example: nums = [10, 9, 2, 5, 3, 7, 101, 18] -> 4 ([2, 3, 7, 101] or [2, 5, 7, 101])`,
    hints: ['Maintain a tails array where tails[i] is the smallest tail element of all increasing subsequences of length i+1.', 'For each number, binary search for its position in tails using partition_point.', 'If the number extends the longest subsequence, push it; otherwise replace the first tail >= number.'],
    solution: `fn length_of_lis(nums: &[i32]) -> usize {
    let mut tails: Vec<i32> = Vec::new();
    for &x in nums {
        let pos = tails.partition_point(|&t| t < x);
        if pos == tails.len() {
            tails.push(x);
        } else {
            tails[pos] = x;
        }
    }
    tails.len()
}

fn length_of_lis_brute(nums: &[i32]) -> usize {
    let n = nums.len();
    if n == 0 { return 0; }
    let mut dp = vec![1usize; n];
    for i in 1..n {
        for j in 0..i {
            if nums[j] < nums[i] {
                dp[i] = dp[i].max(dp[j] + 1);
            }
        }
    }
    *dp.iter().max().unwrap()
}

fn main() {
    let tests: Vec<Vec<i32>> = vec![
        vec![10, 9, 2, 5, 3, 7, 101, 18],
        vec![0, 1, 0, 3, 2, 3],
        vec![7, 7, 7, 7, 7],
        vec![1],
        vec![3, 1, 2],
    ];
    for t in &tests {
        assert_eq!(length_of_lis(t), length_of_lis_brute(t), "failed on {:?}", t);
    }
    assert_eq!(length_of_lis(&[10, 9, 2, 5, 3, 7, 101, 18]), 4);
    println!("ok");
}`,
    starter: `fn length_of_lis(nums: &[i32]) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(length_of_lis(&[10, 9, 2, 5, 3, 7, 101, 18]), 4);
    println!("ok");
}`,
    tags: ['dp', 'binary-search', 'subsequence'],
  },
  {
    id: 'ds-ch12-c-014',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Longest Common Subsequence',
    prompt: `Implement:

    fn lcs(s: &[u8], t: &[u8]) -> usize

Return the length of the longest common subsequence of two byte strings.
A subsequence is formed by deleting characters without changing order.
Example: lcs(b"abcde", b"ace") -> 3 (the subsequence "ace")`,
    hints: ['Build a 2D dp table of size (m+1) x (n+1).', 'If s[i-1] == t[j-1], then dp[i][j] = dp[i-1][j-1] + 1.', 'Otherwise dp[i][j] = max(dp[i-1][j], dp[i][j-1]).'],
    solution: `fn lcs(s: &[u8], t: &[u8]) -> usize {
    let m = s.len();
    let n = t.len();
    let mut dp = vec![vec![0usize; n + 1]; m + 1];
    for i in 1..=m {
        for j in 1..=n {
            if s[i-1] == t[j-1] {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = dp[i-1][j].max(dp[i][j-1]);
            }
        }
    }
    dp[m][n]
}

fn main() {
    assert_eq!(lcs(b"abcde", b"ace"), 3);
    assert_eq!(lcs(b"abc", b"abc"), 3);
    assert_eq!(lcs(b"abc", b"def"), 0);
    assert_eq!(lcs(b"oxcpqrsvwf", b"shmtulqrypy"), 2);
    println!("ok");
}`,
    starter: `fn lcs(s: &[u8], t: &[u8]) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(lcs(b"abcde", b"ace"), 3);
    println!("ok");
}`,
    tags: ['dp', 'subsequence', 'strings'],
  },
  {
    id: 'ds-ch12-c-015',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Edit Distance',
    prompt: `Implement:

    fn edit_distance(s: &[u8], t: &[u8]) -> usize

Return the minimum number of single-character operations (insert, delete, replace)
needed to transform string s into string t (Levenshtein distance).
Example: edit_distance(b"horse", b"ros") -> 3`,
    hints: ['Build a 2D dp table where dp[i][j] = edit distance between s[..i] and t[..j].', 'Base cases: dp[i][0] = i, dp[0][j] = j.', 'If characters match, no extra cost; otherwise take 1 + min of three neighbors.'],
    solution: `fn edit_distance(s: &[u8], t: &[u8]) -> usize {
    let m = s.len();
    let n = t.len();
    let mut dp = vec![vec![0usize; n + 1]; m + 1];
    for i in 0..=m { dp[i][0] = i; }
    for j in 0..=n { dp[0][j] = j; }
    for i in 1..=m {
        for j in 1..=n {
            if s[i-1] == t[j-1] {
                dp[i][j] = dp[i-1][j-1];
            } else {
                dp[i][j] = 1 + dp[i-1][j-1].min(dp[i-1][j]).min(dp[i][j-1]);
            }
        }
    }
    dp[m][n]
}

fn main() {
    assert_eq!(edit_distance(b"horse", b"ros"), 3);
    assert_eq!(edit_distance(b"intention", b"execution"), 5);
    assert_eq!(edit_distance(b"", b"abc"), 3);
    assert_eq!(edit_distance(b"abc", b"abc"), 0);
    println!("ok");
}`,
    starter: `fn edit_distance(s: &[u8], t: &[u8]) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(edit_distance(b"horse", b"ros"), 3);
    println!("ok");
}`,
    tags: ['dp', 'strings', 'classic'],
  },
  {
    id: 'ds-ch12-c-016',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Partition Equal Subset Sum',
    prompt: `Implement:

    fn can_partition(nums: &[u32]) -> bool

Given an array of positive integers, determine if it can be partitioned into two subsets
with equal sum. Return true if possible, false otherwise.
Example: nums = [1, 5, 11, 5] -> true (subsets {1, 5, 5} and {11})`,
    hints: ['If the total sum is odd, return false immediately.', 'Reduce to: can any subset sum to total/2? Use a boolean DP array.', 'Iterate items from large to small (0/1 knapsack style) to avoid reusing an item.'],
    solution: `fn can_partition(nums: &[u32]) -> bool {
    let total: u32 = nums.iter().sum();
    if total % 2 != 0 { return false; }
    let target = (total / 2) as usize;
    let mut dp = vec![false; target + 1];
    dp[0] = true;
    for &n in nums {
        let n = n as usize;
        for j in (n..=target).rev() {
            if dp[j - n] {
                dp[j] = true;
            }
        }
    }
    dp[target]
}

fn main() {
    assert_eq!(can_partition(&[1, 5, 11, 5]), true);
    assert_eq!(can_partition(&[1, 2, 3, 5]), false);
    assert_eq!(can_partition(&[1, 1]), true);
    assert_eq!(can_partition(&[3, 3, 3, 4, 5]), true);
    println!("ok");
}`,
    starter: `fn can_partition(nums: &[u32]) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(can_partition(&[1, 5, 11, 5]), true);
    println!("ok");
}`,
    tags: ['dp', 'subset-sum', 'knapsack'],
  },
  {
    id: 'ds-ch12-c-017',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Decode Ways',
    prompt: `Implement:

    fn decode_ways(s: &[u8]) -> u64

A string of digits can be decoded as letters: '1' -> 'A', '2' -> 'B', ..., '26' -> 'Z'.
Return the number of ways to decode the given non-empty digit string.
Example: decode_ways(b"226") -> 3 ("BZ", "VF", "BBF")`,
    hints: ['Use dp[i] = ways to decode the first i characters.', 'A single digit is valid if it is 1-9 (not 0).', 'Two digits are valid if they form a number in range 10-26.'],
    solution: `fn decode_ways(s: &[u8]) -> u64 {
    let n = s.len();
    if n == 0 || s[0] == b'0' { return 0; }
    let mut dp = vec![0u64; n + 1];
    dp[0] = 1;
    dp[1] = 1;
    for i in 2..=n {
        let one = s[i-1] - b'0';
        let two = (s[i-2] - b'0') * 10 + (s[i-1] - b'0');
        if one >= 1 { dp[i] += dp[i-1]; }
        if two >= 10 && two <= 26 { dp[i] += dp[i-2]; }
    }
    dp[n]
}

fn main() {
    assert_eq!(decode_ways(b"12"), 2);
    assert_eq!(decode_ways(b"226"), 3);
    assert_eq!(decode_ways(b"06"), 0);
    assert_eq!(decode_ways(b"11106"), 2);
    assert_eq!(decode_ways(b"1"), 1);
    println!("ok");
}`,
    starter: `fn decode_ways(s: &[u8]) -> u64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(decode_ways(b"226"), 3);
    println!("ok");
}`,
    tags: ['dp', 'strings', 'combinatorics'],
  },
  {
    id: 'ds-ch12-c-018',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Word Break',
    prompt: `Implement:

    fn word_break(s: &[u8], word_dict: &[&[u8]]) -> bool

Given a string s and a dictionary of words, return true if s can be segmented into
a space-separated sequence of dictionary words (words may be reused).
Example: word_break(b"leetcode", &[b"leet", b"code"]) -> true`,
    hints: ['dp[i] = true if s[..i] can be segmented using the dictionary.', 'For each position i, check all words: if the word fits and dp[i - word.len()] is true, set dp[i] = true.', 'dp[0] = true (empty string is always valid).'],
    solution: `fn word_break(s: &[u8], word_dict: &[&[u8]]) -> bool {
    let n = s.len();
    let mut dp = vec![false; n + 1];
    dp[0] = true;
    for i in 1..=n {
        for &w in word_dict {
            let wl = w.len();
            if wl <= i && dp[i - wl] && &s[i - wl..i] == w {
                dp[i] = true;
                break;
            }
        }
    }
    dp[n]
}

fn main() {
    assert_eq!(word_break(b"leetcode", &[b"leet".as_ref(), b"code".as_ref()]), true);
    assert_eq!(word_break(b"applepenapple", &[b"apple".as_ref(), b"pen".as_ref()]), true);
    assert_eq!(word_break(b"catsandog", &[b"cats".as_ref(), b"dog".as_ref(), b"sand".as_ref(), b"and".as_ref(), b"cat".as_ref()]), false);
    println!("ok");
}`,
    starter: `fn word_break(s: &[u8], word_dict: &[&[u8]]) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(word_break(b"leetcode", &[b"leet".as_ref(), b"code".as_ref()]), true);
    println!("ok");
}`,
    tags: ['dp', 'strings', 'hash-set'],
  },
  {
    id: 'ds-ch12-c-019',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Maximum Product Subarray',
    prompt: `Implement:

    fn max_product(nums: &[i64]) -> i64

Return the product of the contiguous subarray with the largest product.
The array has at least one element. Watch out for negative numbers that can flip sign.
Example: nums = [2, 3, -2, 4] -> 6 (subarray [2, 3])`,
    hints: ['Track both the current maximum and current minimum (negative * negative = positive).', 'At each element, the new max is max(x, cur_max * x, cur_min * x).', 'Similarly update cur_min; update global max after each step.'],
    solution: `fn max_product(nums: &[i64]) -> i64 {
    let mut max_p = nums[0];
    let mut cur_max = nums[0];
    let mut cur_min = nums[0];
    for &x in &nums[1..] {
        let candidates = [x, cur_max * x, cur_min * x];
        cur_max = *candidates.iter().max().unwrap();
        cur_min = *candidates.iter().min().unwrap();
        max_p = max_p.max(cur_max);
    }
    max_p
}

fn main() {
    assert_eq!(max_product(&[2, 3, -2, 4]), 6);
    assert_eq!(max_product(&[-2, 0, -1]), 0);
    assert_eq!(max_product(&[-2, 3, -4]), 24);
    assert_eq!(max_product(&[0, 2]), 2);
    println!("ok");
}`,
    starter: `fn max_product(nums: &[i64]) -> i64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(max_product(&[2, 3, -2, 4]), 6);
    println!("ok");
}`,
    tags: ['dp', 'array', 'kadane'],
  },
  {
    id: 'ds-ch12-c-020',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'House Robber in a Circle',
    prompt: `Implement:

    fn house_robber_circle(nums: &[u32]) -> u32

Houses are arranged in a circle, so the first and last houses are adjacent.
You cannot rob two adjacent houses. Return the maximum amount that can be robbed.
Example: nums = [1, 2, 3, 1] -> 4 (rob index 0 and index 2)`,
    hints: ['Break the circle by solving two linear sub-problems: rob houses 0..n-1 and rob houses 1..n.', 'Take the maximum of both results.', 'Reuse the linear house robber logic on each sub-slice.'],
    solution: `fn house_robber_circle(nums: &[u32]) -> u32 {
    let n = nums.len();
    if n == 1 { return nums[0]; }
    if n == 2 { return nums[0].max(nums[1]); }

    fn rob_linear(a: &[u32]) -> u32 {
        let mut prev2 = a[0];
        let mut prev1 = a[0].max(a[1]);
        for i in 2..a.len() {
            let curr = prev1.max(prev2 + a[i]);
            prev2 = prev1;
            prev1 = curr;
        }
        prev1
    }

    rob_linear(&nums[..n-1]).max(rob_linear(&nums[1..]))
}

fn main() {
    assert_eq!(house_robber_circle(&[2, 3, 2]), 3);
    assert_eq!(house_robber_circle(&[1, 2, 3, 1]), 4);
    assert_eq!(house_robber_circle(&[1, 2, 3]), 3);
    assert_eq!(house_robber_circle(&[5]), 5);
    println!("ok");
}`,
    starter: `fn house_robber_circle(nums: &[u32]) -> u32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(house_robber_circle(&[2, 3, 2]), 3);
    println!("ok");
}`,
    tags: ['dp', 'array', 'circular'],
  },
  {
    id: 'ds-ch12-c-021',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Target Sum Count',
    prompt: `Implement:

    fn count_target_sum(nums: &[i32], target: i32) -> u64

Assign a + or - sign to each number in nums. Return the number of different expressions
that evaluate to the given target.
Constraints: nums.len() <= 20, each num is 0-1000.
Example: count_target_sum(&[1, 1, 1, 1, 1], 3) -> 5`,
    hints: ['Use memoized recursion with state (index, remaining_target).', 'At each index, branch: add nums[i] or subtract nums[i].', 'Use a HashMap keyed by (index, remaining) to cache results.'],
    solution: `fn count_target_sum(nums: &[i32], target: i32) -> u64 {
    let mut memo = std::collections::HashMap::new();
    fn dfs(i: usize, remaining: i64, nums: &[i32], memo: &mut std::collections::HashMap<(usize, i64), u64>) -> u64 {
        if let Some(&v) = memo.get(&(i, remaining)) { return v; }
        if i == nums.len() {
            return if remaining == 0 { 1 } else { 0 };
        }
        let plus = dfs(i + 1, remaining - nums[i] as i64, nums, memo);
        let minus = dfs(i + 1, remaining + nums[i] as i64, nums, memo);
        let res = plus + minus;
        memo.insert((i, remaining), res);
        res
    }
    dfs(0, target as i64, nums, &mut memo)
}

fn count_target_sum_brute(nums: &[i32], target: i32) -> u64 {
    let n = nums.len();
    let mut count = 0u64;
    for mask in 0u32..(1u32 << n) {
        let mut s = 0i32;
        for i in 0..n {
            if mask & (1 << i) != 0 { s += nums[i]; } else { s -= nums[i]; }
        }
        if s == target { count += 1; }
    }
    count
}

fn main() {
    let tests: &[(&[i32], i32)] = &[
        (&[1, 1, 1, 1, 1], 3),
        (&[1], 1),
        (&[1, 0], 1),
        (&[0, 0, 0, 0, 0], 0),
        (&[1, 2, 3], 0),
    ];
    for &(nums, t) in tests {
        let a = count_target_sum(nums, t);
        let b = count_target_sum_brute(nums, t);
        assert_eq!(a, b, "mismatch for {:?} target {}", nums, t);
    }
    assert_eq!(count_target_sum(&[1, 1, 1, 1, 1], 3), 5);
    println!("ok");
}`,
    starter: `fn count_target_sum(nums: &[i32], target: i32) -> u64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(count_target_sum(&[1, 1, 1, 1, 1], 3), 5);
    println!("ok");
}`,
    tags: ['dp', 'memoization', 'dfs'],
  },
  {
    id: 'ds-ch12-c-022',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Longest Palindromic Substring Length',
    prompt: `Implement:

    fn longest_palindromic_substring_len(s: &[u8]) -> usize

Return the length of the longest palindromic substring in s.
A palindrome reads the same forwards and backwards.
Example: s = b"babad" -> 3 ("bab" or "aba" are both length 3)`,
    hints: ['Expand around each center for both odd-length and even-length palindromes.', 'For an odd palindrome, the center is a single character at index i.', 'For an even palindrome, the center is between indices i and i+1.'],
    solution: `fn longest_palindromic_substring_len(s: &[u8]) -> usize {
    let n = s.len();
    if n == 0 { return 0; }
    let mut best = 1usize;
    let expand = |mut l: usize, mut r: usize| -> usize {
        while r < n && s[l] == s[r] {
            if l == 0 { return r - l + 1; }
            l -= 1;
            r += 1;
        }
        r - l - 1
    };
    for i in 0..n {
        best = best.max(expand(i, i));
        if i + 1 < n {
            best = best.max(expand(i, i + 1));
        }
    }
    best
}

fn lps_dp(s: &[u8]) -> usize {
    let n = s.len();
    let mut dp = vec![vec![false; n]; n];
    let mut best = 1;
    for i in 0..n { dp[i][i] = true; }
    for i in 0..n-1 {
        if s[i] == s[i+1] { dp[i][i+1] = true; best = 2; }
    }
    for len in 3..=n {
        for i in 0..=n-len {
            let j = i + len - 1;
            if s[i] == s[j] && dp[i+1][j-1] {
                dp[i][j] = true;
                best = best.max(len);
            }
        }
    }
    best
}

fn main() {
    let cases: &[&[u8]] = &[b"babad", b"cbbd", b"a", b"racecar", b"aacabdkacaa"];
    for &c in cases {
        assert_eq!(longest_palindromic_substring_len(c), lps_dp(c), "mismatch for {:?}", c);
    }
    assert_eq!(longest_palindromic_substring_len(b"racecar"), 7);
    println!("ok");
}`,
    starter: `fn longest_palindromic_substring_len(s: &[u8]) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(longest_palindromic_substring_len(b"racecar"), 7);
    println!("ok");
}`,
    tags: ['dp', 'strings', 'palindrome'],
  },
  {
    id: 'ds-ch12-c-023',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Count Palindromic Substrings',
    prompt: `Implement:

    fn count_palindromic_substrings(s: &[u8]) -> usize

Count all substrings of s that are palindromes (including single characters).
Each distinct (start, end) position counts separately even if the content is the same.
Example: count_palindromic_substrings(b"aaa") -> 6 (a, a, a, aa, aa, aaa)`,
    hints: ['Use the expand-around-center technique for both odd and even length palindromes.', 'Iterate all possible centers from 0 to 2*n-1; odd centers at 2*i, even centers at 2*i+1.', 'Each successful expansion adds 1 to the count.'],
    solution: `fn count_palindromic_substrings(s: &[u8]) -> usize {
    let n = s.len();
    let mut count = 0usize;
    for center in 0..2*n {
        let mut l = center / 2;
        let mut r = l + center % 2;
        while r < n && s[l] == s[r] {
            count += 1;
            if l == 0 { break; }
            l -= 1;
            r += 1;
        }
    }
    count
}

fn count_brute(s: &[u8]) -> usize {
    let n = s.len();
    let mut cnt = 0;
    for i in 0..n {
        for j in i..n {
            let sub = &s[i..=j];
            let rev: Vec<u8> = sub.iter().copied().rev().collect();
            if sub == rev.as_slice() { cnt += 1; }
        }
    }
    cnt
}

fn main() {
    let cases: &[&[u8]] = &[b"abc", b"aaa", b"abba", b"abcba"];
    for &c in cases {
        assert_eq!(count_palindromic_substrings(c), count_brute(c), "mismatch for {:?}", c);
    }
    assert_eq!(count_palindromic_substrings(b"aaa"), 6);
    println!("ok");
}`,
    starter: `fn count_palindromic_substrings(s: &[u8]) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(count_palindromic_substrings(b"aaa"), 6);
    println!("ok");
}`,
    tags: ['dp', 'strings', 'palindrome'],
  },
  {
    id: 'ds-ch12-c-024',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: '0/1 Knapsack',
    prompt: `Implement:

    fn knapsack_01(weights: &[usize], values: &[u64], capacity: usize) -> u64

Given items with weights and values, and a knapsack with a weight capacity,
return the maximum total value achievable without exceeding the capacity.
Each item can be taken at most once.
Example: weights = [1, 3, 4, 5], values = [1, 4, 5, 7], capacity = 7 -> 9`,
    hints: ['Use a 1D dp array of size capacity+1.', 'Iterate items in the outer loop; iterate capacity from high to low in the inner loop.', 'Iterating capacity from high to low prevents reusing the same item.'],
    solution: `fn knapsack_01(weights: &[usize], values: &[u64], capacity: usize) -> u64 {
    let n = weights.len();
    let mut dp = vec![0u64; capacity + 1];
    for i in 0..n {
        for w in (weights[i]..=capacity).rev() {
            dp[w] = dp[w].max(dp[w - weights[i]] + values[i]);
        }
    }
    dp[capacity]
}

fn knapsack_brute(weights: &[usize], values: &[u64], capacity: usize) -> u64 {
    let n = weights.len();
    let mut best = 0u64;
    for mask in 0u32..(1u32 << n) {
        let mut w = 0usize;
        let mut v = 0u64;
        for i in 0..n {
            if mask & (1 << i) != 0 { w += weights[i]; v += values[i]; }
        }
        if w <= capacity { best = best.max(v); }
    }
    best
}

fn main() {
    let ws = &[2, 3, 4, 5];
    let vs = &[3u64, 4, 5, 6];
    let cap = 8;
    assert_eq!(knapsack_01(ws, vs, cap), knapsack_brute(ws, vs, cap));
    assert_eq!(knapsack_01(&[1, 3, 4, 5], &[1, 4, 5, 7], 7), 9);
    println!("ok");
}`,
    starter: `fn knapsack_01(weights: &[usize], values: &[u64], capacity: usize) -> u64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(knapsack_01(&[1, 3, 4, 5], &[1, 4, 5, 7], 7), 9);
    println!("ok");
}`,
    tags: ['dp', 'knapsack', 'optimization'],
  },
  {
    id: 'ds-ch12-c-025',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Distinct Subsequences',
    prompt: `Implement:

    fn distinct_subsequences(s: &[u8], t: &[u8]) -> u64

Count the number of distinct subsequences of s that equal t.
A subsequence is formed by deleting characters from s without changing order.
Example: distinct_subsequences(b"rabbbit", b"rabbit") -> 3`,
    hints: ['Build dp[i][j] = number of ways to form t[..j] from s[..i].', 'dp[i][0] = 1 for all i (empty t is always achievable).', 'If s[i-1] == t[j-1]: dp[i][j] = dp[i-1][j] + dp[i-1][j-1]; else dp[i][j] = dp[i-1][j].'],
    solution: `fn distinct_subsequences(s: &[u8], t: &[u8]) -> u64 {
    let m = s.len();
    let n = t.len();
    let mut dp = vec![vec![0u64; n + 1]; m + 1];
    for i in 0..=m { dp[i][0] = 1; }
    for i in 1..=m {
        for j in 1..=n {
            dp[i][j] = dp[i-1][j];
            if s[i-1] == t[j-1] {
                dp[i][j] += dp[i-1][j-1];
            }
        }
    }
    dp[m][n]
}

fn distinct_subseq_brute(s: &[u8], t: &[u8]) -> u64 {
    if t.is_empty() { return 1; }
    if s.is_empty() { return 0; }
    let mut c = distinct_subseq_brute(&s[1..], t);
    if s[0] == t[0] { c += distinct_subseq_brute(&s[1..], &t[1..]); }
    c
}

fn main() {
    let cases: &[(&[u8], &[u8])] = &[
        (b"rabbbit", b"rabbit"),
        (b"babgbag", b"bag"),
        (b"aaa", b"aa"),
        (b"abc", b"abc"),
        (b"abc", b"d"),
    ];
    for &(s, t) in cases {
        assert_eq!(distinct_subsequences(s, t), distinct_subseq_brute(s, t), "mismatch s={:?} t={:?}", s, t);
    }
    assert_eq!(distinct_subsequences(b"rabbbit", b"rabbit"), 3);
    println!("ok");
}`,
    starter: `fn distinct_subsequences(s: &[u8], t: &[u8]) -> u64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(distinct_subsequences(b"rabbbit", b"rabbit"), 3);
    println!("ok");
}`,
    tags: ['dp', 'subsequence', 'strings'],
  },
  {
    id: 'ds-ch12-c-026',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Wildcard Matching',
    prompt: `Implement:

    fn wildcard_match(s: &[u8], p: &[u8]) -> bool

Implement wildcard pattern matching where '?' matches any single character
and '*' matches any sequence of characters (including empty).
Return true if s matches pattern p entirely.
Example: wildcard_match(b"adceb", b"*a*b") -> true`,
    hints: ['Use 2D DP: dp[i][j] = true if s[..i] matches p[..j].', 'A leading sequence of stars in p can match an empty prefix: dp[0][j] = dp[0][j-1] if p[j-1] == b"*".', 'For star: dp[i][j] = dp[i-1][j] (star consumes one char) OR dp[i][j-1] (star matches empty).'],
    solution: `fn wildcard_match(s: &[u8], p: &[u8]) -> bool {
    let m = s.len();
    let n = p.len();
    let mut dp = vec![vec![false; n + 1]; m + 1];
    dp[0][0] = true;
    for j in 1..=n {
        if p[j-1] == b'*' { dp[0][j] = dp[0][j-1]; }
    }
    for i in 1..=m {
        for j in 1..=n {
            if p[j-1] == b'*' {
                dp[i][j] = dp[i-1][j] || dp[i][j-1];
            } else if p[j-1] == b'?' || s[i-1] == p[j-1] {
                dp[i][j] = dp[i-1][j-1];
            }
        }
    }
    dp[m][n]
}

fn main() {
    assert_eq!(wildcard_match(b"aa", b"a"), false);
    assert_eq!(wildcard_match(b"aa", b"*"), true);
    assert_eq!(wildcard_match(b"cb", b"?a"), false);
    assert_eq!(wildcard_match(b"adceb", b"*a*b"), true);
    assert_eq!(wildcard_match(b"acdcb", b"a*c?b"), false);
    assert_eq!(wildcard_match(b"", b""), true);
    assert_eq!(wildcard_match(b"", b"*"), true);
    println!("ok");
}`,
    starter: `fn wildcard_match(s: &[u8], p: &[u8]) -> bool {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(wildcard_match(b"adceb", b"*a*b"), true);
    println!("ok");
}`,
    tags: ['dp', 'strings', 'pattern-matching'],
  },
  {
    id: 'ds-ch12-c-027',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Best Time to Buy and Sell Stock with Cooldown',
    prompt: `Implement:

    fn max_profit_with_cooldown(prices: &[i32]) -> i32

You may buy and sell stocks multiple times but must wait one day after selling before buying again (cooldown).
You may not hold more than one share at a time. Return the maximum profit.
Example: prices = [1, 2, 3, 0, 2] -> 3 (buy at 1, sell at 3, cooldown, buy at 0 costs nothing extra, sell at 2: 2+1=3)`,
    hints: ['Model three states: held (holding a share), sold (just sold today), rest (in cooldown or idle).', 'Transitions: held = max(held, rest - price); sold = held + price; rest = max(rest, sold).', 'Initialize held = -prices[0], sold = 0, rest = 0.'],
    solution: `fn max_profit_with_cooldown(prices: &[i32]) -> i32 {
    if prices.len() < 2 { return 0; }
    let n = prices.len();
    let mut held = -prices[0];
    let mut sold = 0i32;
    let mut rest = 0i32;
    for i in 1..n {
        let prev_held = held;
        let prev_sold = sold;
        let prev_rest = rest;
        held = prev_held.max(prev_rest - prices[i]);
        sold = prev_held + prices[i];
        rest = prev_rest.max(prev_sold);
    }
    sold.max(rest)
}

fn main() {
    assert_eq!(max_profit_with_cooldown(&[1, 2, 3, 0, 2]), 3);
    assert_eq!(max_profit_with_cooldown(&[1]), 0);
    assert_eq!(max_profit_with_cooldown(&[1, 2]), 1);
    assert_eq!(max_profit_with_cooldown(&[6, 1, 3, 2, 4, 7]), 6);
    println!("ok");
}`,
    starter: `fn max_profit_with_cooldown(prices: &[i32]) -> i32 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(max_profit_with_cooldown(&[1, 2, 3, 0, 2]), 3);
    println!("ok");
}`,
    tags: ['dp', 'state-machine', 'stocks'],
  },
  {
    id: 'ds-ch12-c-028',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Burst Balloons',
    prompt: `Implement:

    fn burst_balloons(nums: &[i32]) -> i64

You have n balloons each with a number. Bursting balloon i earns nums[i-1]*nums[i]*nums[i+1] coins
(use 1 for out-of-bounds neighbors). Burst all balloons to maximize total coins.
Example: nums = [3, 1, 5, 8] -> 167`,
    hints: ['Use interval DP: dp[l][r] = max coins from bursting all balloons strictly between l and r.', 'Pad the array with 1 on both ends.', 'For each interval (l, r), try each balloon k as the LAST to burst: dp[l][r] = max(dp[l][k] + arr[l]*arr[k]*arr[r] + dp[k][r]).'],
    solution: `fn burst_balloons(nums: &[i32]) -> i64 {
    let n = nums.len();
    let mut arr = Vec::with_capacity(n + 2);
    arr.push(1);
    arr.extend_from_slice(nums);
    arr.push(1);
    let m = arr.len();
    let mut dp = vec![vec![0i64; m]; m];
    for len in 2..m {
        for left in 0..m - len {
            let right = left + len;
            for k in left+1..right {
                let coins = arr[left] as i64 * arr[k] as i64 * arr[right] as i64;
                let val = dp[left][k] + coins + dp[k][right];
                if val > dp[left][right] {
                    dp[left][right] = val;
                }
            }
        }
    }
    dp[0][m-1]
}

fn main() {
    assert_eq!(burst_balloons(&[3, 1, 5, 8]), 167);
    assert_eq!(burst_balloons(&[1, 5]), 10);
    assert_eq!(burst_balloons(&[5]), 5);
    assert_eq!(burst_balloons(&[1, 2, 3]), 12);
    println!("ok");
}`,
    starter: `fn burst_balloons(nums: &[i32]) -> i64 {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(burst_balloons(&[3, 1, 5, 8]), 167);
    println!("ok");
}`,
    tags: ['dp', 'interval-dp', 'divide-and-conquer'],
  },
  {
    id: 'ds-ch12-c-029',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Palindrome Partitioning Minimum Cuts',
    prompt: `Implement:

    fn min_palindrome_cuts(s: &[u8]) -> usize

Return the minimum number of cuts needed to partition string s so that
every substring in the partition is a palindrome.
Example: min_palindrome_cuts(b"aab") -> 1 (cut into "aa" and "b")`,
    hints: ['First precompute a 2D is_pal table: is_pal[i][j] = true if s[i..=j] is a palindrome.', 'Then dp[i] = minimum cuts needed for s[0..=i].', 'If s[0..=i] is itself a palindrome, dp[i] = 0; else dp[i] = min(dp[j-1]+1) for all j where s[j..=i] is a palindrome.'],
    solution: `fn min_palindrome_cuts(s: &[u8]) -> usize {
    let n = s.len();
    if n <= 1 { return 0; }
    let mut is_pal = vec![vec![false; n]; n];
    for i in 0..n { is_pal[i][i] = true; }
    for i in 0..n-1 { is_pal[i][i+1] = s[i] == s[i+1]; }
    for len in 3..=n {
        for i in 0..=n-len {
            let j = i + len - 1;
            is_pal[i][j] = s[i] == s[j] && is_pal[i+1][j-1];
        }
    }
    let mut dp = vec![usize::MAX; n];
    for i in 0..n {
        if is_pal[0][i] {
            dp[i] = 0;
        } else {
            for j in 1..=i {
                if is_pal[j][i] && dp[j-1] != usize::MAX {
                    dp[i] = dp[i].min(dp[j-1] + 1);
                }
            }
        }
    }
    dp[n-1]
}

fn main() {
    assert_eq!(min_palindrome_cuts(b"aab"), 1);
    assert_eq!(min_palindrome_cuts(b"a"), 0);
    assert_eq!(min_palindrome_cuts(b"ab"), 1);
    assert_eq!(min_palindrome_cuts(b"ababbbabbababa"), 3);
    assert_eq!(min_palindrome_cuts(b"abcbc"), 2);
    assert_eq!(min_palindrome_cuts(b"racecar"), 0);
    println!("ok");
}`,
    starter: `fn min_palindrome_cuts(s: &[u8]) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(min_palindrome_cuts(b"aab"), 1);
    println!("ok");
}`,
    tags: ['dp', 'palindrome', 'interval-dp'],
  },
  {
    id: 'ds-ch12-c-030',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Longest Common Substring',
    prompt: `Implement:

    fn longest_common_substring(s: &[u8], t: &[u8]) -> usize

Return the length of the longest contiguous substring shared by both s and t.
Unlike LCS (subsequence), the characters must be contiguous in both strings.
Example: longest_common_substring(b"abcde", b"abfce") -> 2 ("ab")`,
    hints: ['Build dp[i][j] = length of longest common suffix of s[..i] and t[..j].', 'If s[i-1] == t[j-1]: dp[i][j] = dp[i-1][j-1] + 1; else dp[i][j] = 0.', 'Track the global maximum across all dp[i][j] values.'],
    solution: `fn longest_common_substring(s: &[u8], t: &[u8]) -> usize {
    let m = s.len();
    let n = t.len();
    let mut dp = vec![vec![0usize; n + 1]; m + 1];
    let mut best = 0;
    for i in 1..=m {
        for j in 1..=n {
            if s[i-1] == t[j-1] {
                dp[i][j] = dp[i-1][j-1] + 1;
                best = best.max(dp[i][j]);
            }
        }
    }
    best
}

fn lcs_brute(s: &[u8], t: &[u8]) -> usize {
    let mut best = 0;
    for i in 0..s.len() {
        for j in 0..t.len() {
            let mut k = 0;
            while i+k < s.len() && j+k < t.len() && s[i+k] == t[j+k] { k += 1; }
            best = best.max(k);
        }
    }
    best
}

fn main() {
    let cases: &[(&[u8], &[u8])] = &[
        (b"abcde", b"abfce"),
        (b"abcabc", b"abc"),
        (b"", b"abc"),
        (b"xyz", b"xyz"),
        (b"abcdef", b"zcdemf"),
    ];
    for &(s, t) in cases {
        assert_eq!(longest_common_substring(s, t), lcs_brute(s, t), "mismatch s={:?} t={:?}", s, t);
    }
    assert_eq!(longest_common_substring(b"abcde", b"abfce"), 2);
    println!("ok");
}`,
    starter: `fn longest_common_substring(s: &[u8], t: &[u8]) -> usize {
    // TODO
    todo!()
}

fn main() {
    assert_eq!(longest_common_substring(b"abcde", b"abfce"), 2);
    println!("ok");
}`,
    tags: ['dp', 'strings', 'substring'],
  },
]

export default problems
