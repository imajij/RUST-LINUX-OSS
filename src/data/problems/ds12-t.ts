import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch12-t-001',
    chapter: 12,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'The Two Conditions for DP',
    prompt: `Dynamic programming (DP) is not the right tool for every recursive problem. The chapter says a problem is a DP problem only when two specific conditions both hold. Name the two conditions and explain each in one sentence using plain words.`,
    hints: [
      'One condition is about the same small questions coming back again and again.',
      'The other is about building the big answer out of smaller answers.',
    ],
    solution: `The two conditions are overlapping subproblems and optimal substructure. Overlapping subproblems means the recursion keeps asking the same smaller questions over and over (like fib(3) being needed many times), so caching an answer once and reusing it actually saves work. Optimal substructure means the answer to the big problem can be built directly from the answers to its smaller subproblems (like fib(n) being exactly fib(n-1) + fib(n-2)). When both hold you can compute each distinct subproblem once, store it, and reuse it; if subproblems never overlap, a cache only wastes space and you really have plain divide-and-conquer like merge sort.`,
    tags: ['dp', 'overlapping-subproblems', 'optimal-substructure'],
  },
  {
    id: 'ds-ch12-t-002',
    chapter: 12,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Memoization Versus Tabulation in Words',
    prompt: `Two students solve Fibonacci with DP. One keeps the recursive code and adds a cache. The other writes a loop that fills a table starting from the base cases. Which approach is called "memoization" and which is "tabulation", and which direction (top-down or bottom-up) is each?`,
    hints: [
      'Memoization keeps the recursion; tabulation uses a loop.',
      'Top-down starts at the big problem; bottom-up starts at the base cases.',
    ],
    solution: `The student who keeps the recursion and adds a cache is doing memoization, which is top-down: you still start from the big problem (the top) and recurse down toward the base cases, but each subproblem is solved at most once because the cache catches repeats. The student who fills a table with a loop starting from the base cases is doing tabulation, which is bottom-up: you start at the smallest subproblems and build up, filling each cell only after everything it depends on is already filled. Both give the same big-O answer (O(n) time, O(n) space for Fibonacci); they are just two directions to reach it.`,
    tags: ['dp', 'memoization', 'tabulation'],
  },
  {
    id: 'ds-ch12-t-003',
    chapter: 12,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why Naive Fibonacci Explodes',
    prompt: `Naive recursive Fibonacci, fib_naive(n) = fib_naive(n-1) + fib_naive(n-2), runs in roughly O(2^n) time. But there are only n+1 distinct Fibonacci values (f(0) through f(n)). If there are so few distinct answers, why is the naive version exponential, and what single change makes it O(n)?`,
    hints: [
      'The same subproblem gets recomputed many times, not once.',
      'Think about what happens if you write each answer down the first time.',
    ],
    solution: `The naive version is exponential because it has no memory between calls: every call re-explores its whole subtree from scratch. To compute f(5) it calls f(4) and f(3), but f(4) also calls f(3), so f(3) is computed twice, and smaller values like f(2) appear even more often. The number of calls roughly doubles each step even though only n+1 distinct values exist. The single change that fixes it is to remember each answer the first time you compute it (a cache or a table). Then each of the n+1 distinct subproblems is solved exactly once with constant work, giving O(n) total. That "remember instead of recompute" idea is the whole subject of DP.`,
    tags: ['dp', 'fibonacci', 'overlapping-subproblems'],
  },
  {
    id: 'ds-ch12-t-004',
    chapter: 12,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'The Crucial Missing Line',
    prompt: `A student writes a "memoized" Fibonacci but it is still slow on large n:

fn fib(n: usize, cache: &mut Vec<Option<u64>>) -> u64 {
    if let Some(v) = cache[n] {
        return v;
    }
    if n < 2 { n as u64 } else { fib(n - 1, cache) + fib(n - 2, cache) }
}

The cache is read but the function is still exponential. What single line is missing, and why does leaving it out destroy the whole benefit?`,
    hints: [
      'The function looks up the cache but never changes it.',
      'A cache that is never written to will always be empty.',
    ],
    solution: `The missing line stores the computed value back into the cache before returning, for example cache[n] = Some(v); just before the final return. As written, the cache is checked at the top but never filled, so every cell stays None forever and the lookup always misses. That means every call recomputes its children from scratch, exactly like the naive version, so the program is still O(2^n) while merely looking memoized. The note calls this the crucial line: you must store a result before returning it, or you have not actually done DP.`,
    tags: ['dp', 'memoization', 'pitfall'],
  },
  {
    id: 'ds-ch12-t-005',
    chapter: 12,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Tracing the Rolling Window',
    prompt: `Here is the bottom-up Fibonacci that keeps only two variables (a rolling array):

let (mut prev, mut curr) = (0u64, 1u64); // f(0), f(1)
for _ in 2..=n {
    let next = prev + curr;
    prev = curr;
    curr = next;
}

Hand-trace the values of prev and curr after each iteration for n = 5, and state the final answer the loop returns (curr).`,
    hints: [
      'Start with prev = 0, curr = 1, then run the loop for i = 2, 3, 4, 5.',
      'Each step: compute next, then slide the two-cell window forward.',
    ],
    solution: `Start with prev = 0, curr = 1. The loop runs for i = 2, 3, 4, 5. i=2: next = 0+1 = 1, then prev = 1, curr = 1. i=3: next = 1+1 = 2, then prev = 1, curr = 2. i=4: next = 1+2 = 3, then prev = 2, curr = 3. i=5: next = 2+3 = 5, then prev = 3, curr = 5. After the loop curr = 5, so the function returns 5, which is f(5). The window slides right by one cell per iteration, and because each new value needs only the previous two, we never need the whole table, dropping space from O(n) to O(1).`,
    tags: ['dp', 'rolling-array', 'fibonacci'],
  },
  {
    id: 'ds-ch12-t-006',
    chapter: 12,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'When to Pick Memoization',
    prompt: `Memoization (top-down) and tabulation (bottom-up) have the same big-O time and space. The chapter still gives reasons to prefer one over the other. Give one situation where memoization is the better pick and one situation where tabulation is the better pick.`,
    hints: [
      'Think about subproblems that are never actually needed from the top.',
      'Think about avoiding recursion and about the rolling-array space win.',
    ],
    solution: `Memoization is the better pick when the recurrence is easy to write recursively but the fill order is awkward, or when many subproblems are never reached from the top: top-down automatically skips the cells it never visits, whereas a bottom-up table would fill them anyway. Tabulation is the better pick when the fill order is obvious and you want the speed, when you want to avoid deep recursion (no call frames, no stack-overflow risk), or when you want the rolling-array space win, which is far easier to see and apply in a bottom-up loop. Both are correct DP; the choice is about order, recursion depth, and space.`,
    tags: ['dp', 'memoization', 'tabulation'],
  },
  {
    id: 'ds-ch12-t-007',
    chapter: 12,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Hand-Tracing House Robber',
    prompt: `House robber uses dp[i] = max(dp[i-1], dp[i-2] + money[i-1]), where dp[i] is the most money from the first i houses, with dp[0] = 0 and dp[1] = money[0]. For money = [2, 7, 9, 3, 1], fill the whole dp array by hand and state the final answer. Then say why the greedy idea "always rob the richest remaining house" gives the wrong plan here.`,
    hints: [
      'Compute dp[2] through dp[5] one at a time, always taking the max of skip vs rob.',
      'Robbing the 9 and the 7 is illegal because those houses are adjacent.',
    ],
    solution: `Filling the table: dp[0] = 0, dp[1] = 2. dp[2] = max(dp[1], dp[0] + 7) = max(2, 7) = 7. dp[3] = max(dp[2], dp[1] + 9) = max(7, 11) = 11. dp[4] = max(dp[3], dp[2] + 3) = max(11, 10) = 11. dp[5] = max(dp[4], dp[3] + 1) = max(11, 12) = 12. So dp = [0, 2, 7, 11, 11, 12] and the answer is 12, achieved by robbing houses with values 2, 9, and 1 (indices 0, 2, 4, none adjacent). Greedy "take the richest" would grab 9 first, then want 7, but 7 sits next to 9 so it is forbidden; greedy does not look ahead at the consequence of a choice, while the DP max-over-choices does, which is why a slightly poorer house can unlock two richer non-adjacent ones.`,
    tags: ['dp', 'array', 'pitfall'],
  },
  {
    id: 'ds-ch12-t-008',
    chapter: 12,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Why Greedy Fails on Coin Change',
    prompt: `For coin change "fewest coins", the greedy rule is "always take the largest coin that still fits." With coins {1, 3, 4} and target 6, what does greedy produce, what is the true optimal, and what is the DP transition that finds the optimal? Explain in one sentence why greedy is fooled.`,
    hints: [
      'Greedy takes the 4 first; see what remainder that leaves.',
      'The DP tries every coin as the last coin and trusts the subproblem for the rest.',
    ],
    solution: `Greedy takes the largest coin that fits: 4, leaving 2, then 1 and 1, for three coins total. The true optimal is 3 + 3 = two coins. The DP transition is dp[a] = 1 + min over each coin c <= a of dp[a - c], with base case dp[0] = 0: to make amount a you try each coin as the last one used and add the best way to make the rest. Greedy is fooled because a locally biggest choice (the 4) can leave an awkward remainder (2) that needs more coins than a slightly smaller first choice would; greedy commits without considering the cost of the leftover, while DP considers every first coin and trusts the already-computed subproblem for what remains.`,
    tags: ['dp', 'coins', 'pitfall'],
  },
  {
    id: 'ds-ch12-t-009',
    chapter: 12,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Subsequence Versus Substring',
    prompt: `The chapter is careful to distinguish the longest common subsequence (LCS) from the longest common substring. Explain the difference between a subsequence and a substring, give the LCS length of "AGCAT" and "GAC", and say why confusing the two would lead you to the wrong recurrence.`,
    hints: [
      'A subsequence may skip characters; a substring must be contiguous.',
      'Trace or recall the LCS table for these two short strings.',
    ],
    solution: `A subsequence keeps the characters in their original relative order but may skip characters (gaps are allowed), while a substring must be a contiguous run with no gaps. For "AGCAT" and "GAC", the longest common subsequence has length 2 (for example "AC" or "GC" or "GA"), because a matching character can be followed by a later non-adjacent match. Confusing the two matters because they need different recurrences: LCS allows the matched characters to be spread out, so its transition is "match -> diagonal + 1, else max(up, left)"; the longest common substring requires contiguity, so a mismatch resets the run to 0 (dp[i][j] = 0 on mismatch) and you track a running maximum. Using the substring recurrence for an LCS question, or vice versa, gives a wrong answer.`,
    tags: ['dp', 'subsequence', 'strings'],
  },
  {
    id: 'ds-ch12-t-010',
    chapter: 12,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Reading the Edit Distance Recurrence',
    prompt: `Edit distance uses dp[i][j] = min edits to turn the first i chars of a into the first j chars of b. When a[i-1] differs from b[j-1], the cell is 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]). Name which edit operation each of those three neighbor cells corresponds to, and state the base cases dp[i][0] and dp[0][j] with a one-line reason for each.`,
    hints: [
      'Up is one row back, left is one column back, diagonal is both back.',
      'An empty target still costs something to reach from a non-empty source.',
    ],
    solution: `When the last characters differ, the three +1 options are: dp[i-1][j] is a delete (drop the last char of a, shrinking i by one), dp[i][j-1] is an insert (add b's last char into a, shrinking j by one), and dp[i-1][j-1] is a substitute (replace a's last char with b's, shrinking both). You take the cheapest of the three. The base cases are dp[i][0] = i, because turning the first i chars of a into the empty string costs i deletions, and dp[0][j] = j, because turning the empty string into the first j chars of b costs j insertions. These are not zero; forgetting them is a common pitfall. (When the last characters are equal, no edit is needed for them, so dp[i][j] = dp[i-1][j-1].)`,
    tags: ['dp', 'strings', 'classic'],
  },
  {
    id: 'ds-ch12-t-011',
    chapter: 12,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'The 0/1 Knapsack Direction Bug',
    prompt: `The 1D rolling version of 0/1 knapsack updates a single array with:

for w in (weights[i]..=cap).rev() {
    dp[w] = dp[w].max(dp[w - weights[i]] + values[i]);
}

A student changes the inner loop to go low-to-high instead of high-to-low and gets answers that are too large. Explain exactly what goes wrong when the loop runs upward, and what real problem the upward version actually solves.`,
    hints: [
      'When w is small, dp[w - weight] may have already been updated for this same item.',
      'Reusing an item any number of times is a different problem than 0/1.',
    ],
    solution: `Going high-to-low guarantees that when you read dp[w - weights[i]], that cell still holds the value from the previous item (the "row above"), so item i is considered at most once. If you run the loop low-to-high, then by the time you reach a larger w, the cell dp[w - weights[i]] may already have been updated to include item i during this same pass. So taking the item again reads a value that already counts the item, letting you pack the same item multiple times and inflating the answer. The upward version therefore no longer solves 0/1 knapsack; it solves the unbounded knapsack, where each item may be used any number of times. The two problems differ only by this loop direction in the 1D form, which is exactly why it is such an easy bug to introduce.`,
    tags: ['dp', 'knapsack', 'pitfall'],
  },
  {
    id: 'ds-ch12-t-012',
    chapter: 12,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'The usize Underflow Trap',
    prompt: `In Rust, indices and capacities are usually usize, which cannot be negative. A student writes this inside a knapsack or coin-change loop:

let rest = dp[w - weight]; // w and weight are usize

and it sometimes panics. Explain what goes wrong, why usize makes it worse than a signed type would, and the standard guard the chapter recommends.`,
    hints: [
      'What is the value of 5usize - 7 in Rust?',
      'Check a condition before doing the subtraction.',
    ],
    solution: `The problem is that usize is an unsigned type and cannot represent negative numbers, so a subtraction like w - weight when weight is larger than w does not give a small negative index, it underflows. In a debug build that panics ("attempt to subtract with overflow"), and in a release build it silently wraps to a huge number, which then indexes far out of bounds or produces nonsense. A signed type would just go negative and you might catch it, but usize hides the error as either a panic or a giant wrapped value. The standard guard is to check that the subtraction is safe before doing it, for example only run the take/use branch when weight <= w (so w - weight is non-negative), or use checked_sub. The same care applies to coin change: only consider a coin when c <= a before computing dp[a - c].`,
    tags: ['dp', 'knapsack', 'pitfall'],
  },
]

export default problems
