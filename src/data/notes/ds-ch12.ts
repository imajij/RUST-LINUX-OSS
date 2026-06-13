import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-ds-12',
  track: 'dsa',
  chapter: 12,
  title: 'Dynamic Programming',
  summary: `Dynamic programming (DP) is the art of turning a slow, exponential brute-force solution into a fast, polynomial one by *remembering* answers to subproblems instead of recomputing them. It sounds advanced, but the core idea is something you already do in real life: if you worked out an answer once, you write it down so you never have to work it out again. This chapter builds DP from the ground up, starting with the classic disaster of naive recursive Fibonacci (which recomputes the same calls an exponential number of times), and shows the two cures that every DP problem uses: memoization (top-down recursion plus a cache) and tabulation (bottom-up, filling a table in order).

We then practice a recipe for *finding* the recurrence on six famous problems: climbing stairs, house robber, coin change, longest common subsequence, the 0/1 knapsack, and edit distance. These are not random puzzles. The same machinery powers the diff in git, the suggestions in your spell-checker, DNA sequence alignment, splitting a budget, and word-wrapping a paragraph. By the end you should be able to look at a new optimization or counting problem, decide in a minute whether DP applies, define the subproblem in plain words, write the transition, and code it in idiomatic Rust with the right table and the right complexity.`,
  sections: [
    {
      heading: 'Why DP exists: the Fibonacci explosion',
      body: `The cleanest way to feel the *need* for DP is to write Fibonacci the obvious recursive way. The nth Fibonacci number is the sum of the two before it, with f(0) = 0 and f(1) = 1. A direct translation says "to get f(n), get f(n-1) and f(n-2) and add them." That is correct, and for small n it works. The problem is *how* it works.

Picture the tree of calls. To compute f(5) you call f(4) and f(3). But f(4) *also* calls f(3). So f(3) gets computed twice. Each of those f(3) calls computes f(2), and f(2) shows up even more often. The number of leaves in this call tree grows like the golden ratio raised to the n, which is **exponential** time, written O(phi^n) and loosely O(2^n). Computing f(50) this way makes over a billion calls and takes seconds; f(90) would outlast the universe. The work explodes because the same subproblems are solved over and over with no memory between them.

This wastefulness is the signal that DP applies. The two conditions that make a problem a DP problem are:

1. **Overlapping subproblems** — the recursion keeps asking the *same* smaller questions (f(3) again and again). If every subproblem were unique, caching would not help and you would just have plain divide-and-conquer (like merge sort).
2. **Optimal substructure** — the answer to the big problem can be *built from* the answers to smaller subproblems (f(n) is literally f(n-1) + f(n-2)). The best solution overall contains the best solutions to its parts.

When both hold, you compute each distinct subproblem **once**, store it, and reuse it. There are only n distinct Fibonacci subproblems (f(0) through f(n)), so doing each once is O(n) instead of O(2^n). That single change — remember instead of recompute — is the whole subject.

### Common pitfalls
- Confusing DP with plain recursion. Recursion is the *shape*; DP is recursion *plus a cache* (or a table filled in order). Without the memory you have not done DP.
- Assuming any recursive problem benefits from DP. If subproblems do not overlap, a cache only wastes space; merge sort and binary search are divide-and-conquer, not DP.`,
      code: [
        {
          lang: 'text',
          src: `Call tree for naive fib(5)  --  notice f(3), f(2), f(1) REPEAT

                       f(5)
                 /              \\
              f(4)              f(3)      <- f(3) computed AGAIN below
            /      \\          /     \\
         f(3)      f(2)     f(2)    f(1)
        /    \\    /   \\    /   \\
     f(2)  f(1) f(1) f(0) f(1) f(0)
    /   \\
  f(1)  f(0)

Distinct subproblems needed:  f(0) f(1) f(2) f(3) f(4) f(5)  = 6
Calls the naive version makes: 15   (and it doubles each step)
DP idea: solve each of the 6 ONCE, store, reuse -> O(n).`
        },
        {
          lang: 'rust',
          src: `// The naive version. Correct, but O(phi^n) ~ exponential time:
// every call re-explores the same subtree with no memory.
fn fib_naive(n: u64) -> u64 {
    if n < 2 {
        n // base cases: fib(0) = 0, fib(1) = 1
    } else {
        fib_naive(n - 1) + fib_naive(n - 2)
    }
}

fn main() {
    // Fine for tiny n; try fib_naive(50) and watch it crawl.
    assert_eq!(fib_naive(10), 55);
    println!("{}", fib_naive(10));
}`
        }
      ]
    },
    {
      heading: 'Memoization: top-down recursion with a cache',
      body: `**Memoization** is the smallest possible fix to naive recursion: keep the exact same recursive code, but the *first* time you compute an answer, write it down; on later calls, look it up instead of recomputing. The word comes from "memo" — a note to yourself. It is called **top-down** because you still start from the big problem (the top) and recurse down to the base cases, just with a safety net so each subproblem is solved at most once.

The cache is usually a `+'`'+`Vec<Option<T>>`+'`'+` when the subproblem is indexed by a small integer (like n for Fibonacci), or a `+'`'+`HashMap<Key, T>`+'`'+` when the key is something richer (a pair, a string position, a coordinate). `+'`'+`Option`+'`'+` is the perfect "have I computed this yet?" marker: `+'`'+`None`+'`'+` means "not yet", `+'`'+`Some(v)`+'`'+` means "already known, here it is." Each cell starts `+'`'+`None`+'`'+`, gets filled exactly once, and is read many times.

The complexity argument is the heart of DP and worth saying slowly: **total time = (number of distinct subproblems) times (work per subproblem, not counting recursive calls already cached).** For Fibonacci there are n+1 subproblems and each does O(1) work once its two children are cached, so the whole thing is O(n) time and O(n) space. We went from a billion operations to fifty. That is the payoff in one sentence.

Memoization shines when you do not actually need *every* subproblem — only the ones reachable from the top. If big chunks of the table are never visited, top-down skips them automatically, whereas a bottom-up table would fill them anyway. The trade-off is recursion overhead (call frames, and the risk of a stack overflow if the depth is huge) and a slightly fiddly cache to thread through.

### Common pitfalls
- Forgetting to *store* before returning. If you compute the value but return it without writing it into the cache, every call recomputes and you have an exponential program that merely looks memoized.
- In Rust, borrowing the cache mutably while also reading it. Read the cached value into a local, drop the borrow, recurse, then write back — or pass the cache as `+'`'+`&mut`+'`'+` and keep each access short. The borrow checker will catch overlapping borrows.
- Indexing a `+'`'+`Vec`+'`'+` cache with a number that can exceed its length. Size the cache to n+1 up front so index n is valid.`,
      code: [
        {
          lang: 'text',
          src: `Memoized fib(5): the cache fills LEFT-to-right as recursion unwinds.
cache is Vec<Option<u64>>, index = n.   '.' = None (unknown)

start:   [ .  .  .  .  .  . ]      (indices 0 1 2 3 4 5)
hit base f(0)=0, f(1)=1:
         [ 0  1  .  .  .  . ]
f(2)=f(1)+f(0)=1, store:
         [ 0  1  1  .  .  . ]
f(3)=f(2)+f(1)=2, store:
         [ 0  1  1  2  .  . ]
f(4)=f(3)+f(2)=3, store:
         [ 0  1  1  2  3  . ]
f(5)=f(4)+f(3)=5, store:
         [ 0  1  1  2  3  5 ]   <- answer = 5

Each cell written ONCE; the second time f(3) is asked it is just read.`
        },
        {
          lang: 'rust',
          src: `// Top-down: same recursion as before, plus a Vec<Option<u64>> cache.
fn fib_memo(n: usize, cache: &mut Vec<Option<u64>>) -> u64 {
    if let Some(v) = cache[n] {
        return v; // already computed: O(1) lookup, no recursion
    }
    let v = if n < 2 {
        n as u64
    } else {
        fib_memo(n - 1, cache) + fib_memo(n - 2, cache)
    };
    cache[n] = Some(v); // STORE before returning -- the crucial line
    v
}

fn main() {
    let n = 50;
    let mut cache = vec![None; n + 1]; // size n+1 so index n is valid
    assert_eq!(fib_memo(n, &mut cache), 12586269025);
    println!("{}", fib_memo(n, &mut cache)); // instant, not seconds
}`
        }
      ]
    },
    {
      heading: 'Tabulation: bottom-up, fill the table in order',
      body: `**Tabulation** attacks the same problem from the other end. Instead of starting at the big problem and recursing down, you start at the *base cases* and build *up*, filling a table in an order that guarantees every value you need is already present before you need it. It is called **bottom-up** for exactly that reason: smallest subproblems first, largest last.

The recipe is mechanical once you have the recurrence:
1. Make a table (a `+'`'+`Vec`+'`'+`) sized to hold every subproblem's answer.
2. Write the **base cases** directly into the table.
3. Loop in an order such that when you compute `+'`'+`table[i]`+'`'+`, everything it depends on (`+'`'+`table[i-1]`+'`'+`, `+'`'+`table[i-2]`+'`'+`, ...) is already filled.
4. Return the cell that represents the original problem.

For Fibonacci the order is just "increasing i", because f(i) needs f(i-1) and f(i-2), both smaller. The result is the same O(n) time and O(n) space as memoization, but with no recursion at all — no call frames, no stack-overflow risk, and usually a small constant-factor speedup because iteration is cheaper than recursion.

There is a beautiful bonus. Once the answer only depends on a *fixed, small window* of recent cells (here, just the previous two), you do not need the whole table — you can keep only those few values and reuse them. This is the **rolling-array** trick and it drops space from O(n) to O(1). Watch the variables `+'`'+`prev`+'`'+` and `+'`'+`curr`+'`'+` slide along like a two-cell window: each step you compute the next value, then shift the window forward.

How do you choose memoization vs tabulation? They have the same big-O. Reach for **memoization** when the recurrence is easy to write recursively but the *order* of filling is awkward, or when many subproblems are never needed. Reach for **tabulation** when the order is obvious and you want the speed, want to avoid deep recursion, or want the rolling-array space win, which is far easier to see in a bottom-up loop.

### Common pitfalls
- Looping in the *wrong order*, so you read a table cell before it has been filled. The fix is to make the dependency direction explicit and loop the opposite way.
- Off-by-one on the table size or the base cases. The table needs one slot per subproblem *including* the base cases; for f up to n that is n+1 slots.
- Over-shrinking with the rolling array and losing a value you still need. Keep exactly as many cells as the recurrence reaches back.`,
      code: [
        {
          lang: 'text',
          src: `Bottom-up fib with a ROLLING window of two cells (O(1) space).
We only ever need (prev, curr) = (f(i-1), f(i)).

i:     prev curr      meaning
init:    0    1       f(0)=0, f(1)=1
i=2:  next = 0+1 = 1  -> shift -> prev=1 curr=1
i=3:  next = 1+1 = 2  -> shift -> prev=1 curr=2
i=4:  next = 1+2 = 3  -> shift -> prev=2 curr=3
i=5:  next = 2+3 = 5  -> shift -> prev=3 curr=5
                                              ^ answer for f(5)

The window slides right one step per i; no full table needed.`
        },
        {
          lang: 'rust',
          src: `// Bottom-up with a full table: O(n) time, O(n) space.
fn fib_table(n: usize) -> u64 {
    if n < 2 { return n as u64; }
    let mut t = vec![0u64; n + 1];
    t[0] = 0; t[1] = 1;                 // base cases written directly
    for i in 2..=n {
        t[i] = t[i - 1] + t[i - 2];     // every dependency already filled
    }
    t[n]
}

// Rolling array: same answer, O(1) space -- keep only the last two.
fn fib_rolling(n: u64) -> u64 {
    let (mut prev, mut curr) = (0u64, 1u64); // f(0), f(1)
    if n == 0 { return 0; }
    for _ in 2..=n {
        let next = prev + curr;
        prev = curr;   // slide the window forward
        curr = next;
    }
    curr
}

fn main() {
    assert_eq!(fib_table(50), 12586269025);
    assert_eq!(fib_rolling(50), 12586269025);
}`
        }
      ]
    },
    {
      heading: 'A recipe for finding the recurrence',
      body: `The single hardest part of DP for beginners is not the code — it is *discovering* the recurrence. Here is a reliable four-step recipe you can apply to every problem in this chapter. Do these in order, in words, *before* you write any Rust.

**Step 1 — Define the subproblem in plain English.** Decide what a single table entry *means*. Write a sentence: "`+'`'+`dp[i]`+'`'+` = the best/number-of/length-of answer for the first i items" or "`+'`'+`dp[i][j]`+'`'+` = the answer considering the first i of one thing and the first j of another." This sentence is the most important line you will write; everything else follows from it. If you cannot state it crisply, you are not ready to code.

**Step 2 — Write the transition (the recurrence).** Ask: "to fill `+'`'+`dp[i]`+'`'+`, what *choices* do I have, and what *already-solved* smaller entries does each choice rely on?" Most DP transitions are a `+'`'+`max`+'`'+`, `+'`'+`min`+'`'+`, or sum over a handful of options. For example "either I take item i or I skip it; take the better of the two." This is exactly the *optimal substructure* condition turned into a formula.

**Step 3 — Set the base cases.** What are the smallest inputs whose answers you know without any recurrence? An empty string, zero items, a target of 0. These seed the table. Getting them right (and consistent with your subproblem definition) prevents most bugs.

**Step 4 — Decide the fill order and the answer cell.** Make sure that when you compute an entry, every entry it depends on is already done — that dictates your loop direction. Finally, identify which cell holds the answer to the *original* question (often the last cell, `+'`'+`dp[n]`+'`'+` or `+'`'+`dp[m][n]`+'`'+`).

A picture that helps: think of the table as a grid where each cell points to the smaller cells it reads from. If all arrows point "backward" (to lower indices), looping forward is safe. If some point forward, loop backward. We will draw these arrows for each problem.

### Common pitfalls
- Jumping straight to code before writing the subproblem sentence. Almost every wrong DP comes from a fuzzy definition of what a cell means.
- Mixing up "index into the array" with "count of items considered." Pick one convention (most people use "first i items", so `+'`'+`dp[0]`+'`'+` means zero items) and stay consistent.
- Forgetting that the transition must only read *already-computed* cells; if it reads a cell you have not filled yet, your order is wrong.`,
      code: [
        {
          lang: 'text',
          src: `THE RECIPE as a flow you reuse on every problem:

  +------------------------------------------------------+
  | 1. SUBPROBLEM   dp[i] = "the answer for first i ..." |
  +------------------------------------------------------+
                         |
                         v
  +------------------------------------------------------+
  | 2. TRANSITION   dp[i] = best( choice A, choice B ..) |
  |                 each choice reads SMALLER dp entries |
  +------------------------------------------------------+
                         |
                         v
  +------------------------------------------------------+
  | 3. BASE CASES   dp[0] = known answer for empty input |
  +------------------------------------------------------+
                         |
                         v
  +------------------------------------------------------+
  | 4. ORDER+ANSWER loop so deps are ready; answer=dp[n] |
  +------------------------------------------------------+

Dependency arrows must point BACKWARD for a forward loop:
   dp[0] <- dp[1] <- dp[2] <- dp[3] ...   (read lower, write higher)`
        }
      ]
    },
    {
      heading: 'Climbing stairs and house robber: 1D DP',
      anim: 'dp-table',
      body: `Now we apply the recipe to two one-dimensional problems that share Fibonacci's shape, so you can see the pattern generalize.

**Climbing stairs.** You are at the bottom of a staircase with n steps. Each move you climb either 1 step or 2 steps. How many *distinct* ways can you reach the top? Real intuition: the last move was either a single step (so you came from step n-1) or a double step (from step n-2), and those are different ways. So *ways(n) = ways(n-1) + ways(n-2)* — it is Fibonacci in disguise! Subproblem: `+'`'+`dp[i]`+'`'+` = number of ways to reach step i. Base cases: `+'`'+`dp[0] = 1`+'`'+` (one way to "be" at the start: do nothing) and `+'`'+`dp[1] = 1`+'`'+`. Time O(n), space O(1) with a rolling array.

**House robber.** A row of houses each holds some money; you cannot rob two *adjacent* houses (the alarm links neighbors). Maximize the loot. Brute force tries every subset that has no two neighbors — exponentially many. DP instead asks, at each house, a single yes/no question. Subproblem: `+'`'+`dp[i]`+'`'+` = the most money robbable from the first i houses. Transition, the key decision: for house i you either **skip it** (so your total is `+'`'+`dp[i-1]`+'`'+`) or **rob it** (so you add its money to `+'`'+`dp[i-2]`+'`'+`, because robbing i forbids house i-1). Take the better: `+'`'+`dp[i] = max(dp[i-1], dp[i-2] + money[i-1])`+'`'+`. Base cases: `+'`'+`dp[0] = 0`+'`'+` (no houses, no money), `+'`'+`dp[1] = money[0]`+'`'+`. Again O(n) time, O(1) space.

Notice the family resemblance: both look back exactly two cells, both have an O(1) rolling form. House robber adds the one new ingredient that defines most DP — a `+'`'+`max`+'`'+` over a small set of choices. That `+'`'+`max`+'`'+` (or `+'`'+`min`+'`'+`, or sum) is where the "optimization" in dynamic programming lives.

### Common pitfalls
- In house robber, indexing the money array vs the dp array off-by-one. With `+'`'+`dp`+'`'+` sized n+1 where `+'`'+`dp[i]`+'`'+` covers the first i houses, the i-th house's money is `+'`'+`money[i-1]`+'`'+`, not `+'`'+`money[i]`+'`'+`.
- Forgetting `+'`'+`dp[0] = 1`+'`'+` in climbing stairs. The empty path is a real "way" to be at the start, and dropping it shifts every count.
- Reaching for greedy in house robber ("always rob the richest"). Greedy fails: a slightly poorer house may unlock two rich non-adjacent ones. DP considers the consequence; greedy does not.`,
      code: [
        {
          lang: 'text',
          src: `HOUSE ROBBER trace on money = [2, 7, 9, 3, 1]
dp[i] = max loot from first i houses.  dp[0]=0, dp[1]=money[0]=2.

 i  house  money  skip=dp[i-1]  rob=dp[i-2]+money  dp[i]=max
 1   #0      2         -              -              2
 2   #1      7        2            0 + 7 = 7         7
 3   #2      9        7            2 + 9 = 11       11
 4   #3      3       11            7 + 3 = 10       11
 5   #4      1       11           11 + 1 = 12       12  <- answer

dp:  [0, 2, 7, 11, 11, 12]
Best plan: rob #0(2)+#2(9)+#4(1)=12  (no two adjacent). Greedy
"take 9 then 7?" is illegal -- they are adjacent.`
        },
        {
          lang: 'rust',
          src: `// Climbing stairs: ways(n) = ways(n-1) + ways(n-2). Fibonacci-shaped.
fn climb_stairs(n: usize) -> u64 {
    let (mut a, mut b) = (1u64, 1u64); // dp[0]=1, dp[1]=1
    for _ in 2..=n {
        let next = a + b;
        a = b;          // roll the window forward
        b = next;
    }
    b
}

// House robber: at each house choose max(skip, rob). O(n) time, O(1) space.
fn rob(money: &[u64]) -> u64 {
    let mut prev2 = 0u64;          // dp[i-2]
    let mut prev1 = 0u64;          // dp[i-1]
    for &m in money {
        // rob this house (prev2 + m) OR skip it (prev1)
        let curr = prev1.max(prev2 + m);
        prev2 = prev1;            // slide the two-cell window
        prev1 = curr;
    }
    prev1
}

fn main() {
    assert_eq!(climb_stairs(5), 8);
    assert_eq!(rob(&[2, 7, 9, 3, 1]), 12);
}`
        }
      ]
    },
    {
      heading: 'Coin change: fewest coins, and unbounded items',
      body: `Now a problem where the answer might not exist, and where each "item" (a coin denomination) may be used *any number of times*. Given coin values and a target `+'`'+`amount`+'`'+`, find the **fewest coins** that sum to exactly the amount, or report that it is impossible. Real-world flavor: a vending machine or cashier making change with the least metal, or any "reach a budget with the fewest fixed-size chunks" task.

The greedy instinct — "always take the largest coin that fits" — *fails* for general coin sets. With coins {1, 3, 4} making 6, greedy takes 4 then 1 then 1 = three coins, but the optimal is 3 + 3 = two coins. Greedy is fooled because a locally biggest choice can leave an awkward remainder. DP considers every first coin and trusts the subproblem for the rest.

Apply the recipe. **Subproblem:** `+'`'+`dp[a]`+'`'+` = the fewest coins needed to make amount `+'`'+`a`+'`'+`. **Transition:** to make `+'`'+`a`+'`'+`, try each coin `+'`'+`c <= a`+'`'+` as the *last* coin used; the rest is `+'`'+`dp[a - c]`+'`'+`, so `+'`'+`dp[a] = 1 + min over c of dp[a - c]`+'`'+`. **Base case:** `+'`'+`dp[0] = 0`+'`'+` (zero coins make amount zero). For unreachable amounts we store a sentinel "infinity"; in Rust a clean way is `+'`'+`Option<u32>`+'`'+` (None = impossible) or `+'`'+`u32::MAX`+'`'+` as infinity with a guard. **Order:** increasing `+'`'+`a`+'`'+`, because `+'`'+`dp[a]`+'`'+` reads only smaller amounts. **Answer:** `+'`'+`dp[amount]`+'`'+`. Time O(amount * number_of_coins), space O(amount).

Because each coin can be reused freely, we loop coins *inside* each amount with no extra dimension — that is what "unbounded" means. (The 0/1 knapsack in the next section is the opposite: each item is take-it-or-leave-it, which forces a second dimension or a careful loop direction.)

### Common pitfalls
- Using `+'`'+`u32::MAX`+'`'+` as infinity and then doing `+'`'+`dp[a - c] + 1`+'`'+` — that overflows and wraps to a tiny number, giving wrong answers. Guard with `+'`'+`if dp[a - c] != INF`+'`'+`, or use `+'`'+`Option`+'`'+`, or `+'`'+`checked_add`+'`'+`.
- Returning 0 for an impossible amount instead of distinguishing "0 coins" (amount 0) from "cannot be done." Keep impossibility explicit (None / sentinel).
- Confusing "fewest coins" with "number of ways to make change." They are different DPs: fewest coins is a `+'`'+`min`+'`'+`; counting ways is a sum and needs a different loop structure.`,
      code: [
        {
          lang: 'text',
          src: `COIN CHANGE trace, coins = [1, 3, 4], target = 6.
dp[a] = fewest coins to make a.  INF means "not yet reachable".
dp[0]=0.  For each a, try each coin c<=a: dp[a]=min(dp[a], dp[a-c]+1)

 a:    0   1   2   3   4   5   6
init:  0  INF INF INF INF INF INF
a=1:   0   1   .   .   .   .   .   (1 = dp[0]+1 via coin 1)
a=2:   0   1   2   .   .   .   .   (dp[1]+1)
a=3:   0   1   2   1   .   .   .   (coin 3: dp[0]+1=1 beats 3)
a=4:   0   1   2   1   1   .   .   (coin 4: dp[0]+1=1)
a=5:   0   1   2   1   1   2   .   (coin 4: dp[1]+1=2)
a=6:   0   1   2   1   1   2   2   (coin 3: dp[3]+1=2)  <- answer

Answer dp[6]=2  (3+3). Greedy "4 then 1 then 1"=3 would be WRONG.`
        },
        {
          lang: 'rust',
          src: `// Fewest coins to make `+'amount'+`, or None if impossible.
// dp[a] = fewest coins for amount a. O(amount * coins) time.
fn coin_change(coins: &[u32], amount: u32) -> Option<u32> {
    let amount = amount as usize;
    // Use Option<u32> so "impossible" is explicit, not a magic number.
    let mut dp = vec![None; amount + 1];
    dp[0] = Some(0); // base case: zero coins make amount 0
    for a in 1..=amount {
        for &c in coins {
            let c = c as usize;
            if c <= a {
                if let Some(rest) = dp[a - c] {
                    // taking coin c as the last coin: 1 + dp[a-c]
                    let cand = rest + 1;
                    dp[a] = Some(match dp[a] {
                        Some(best) => best.min(cand),
                        None => cand,
                    });
                }
            }
        }
    }
    dp[amount]
}

fn main() {
    assert_eq!(coin_change(&[1, 3, 4], 6), Some(2)); // 3 + 3
    assert_eq!(coin_change(&[2], 3), None);          // odd target, even coin
}`
        }
      ]
    },
    {
      heading: 'Longest common subsequence: 2D DP and the git diff',
      body: `Some problems compare *two* sequences, and that pushes us to a **2D table**. The flagship is the **longest common subsequence (LCS)**: given two strings, find the length of the longest sequence of characters that appears in both, *in order* but not necessarily contiguously. For example LCS of "ABCBDAB" and "BDCAB" is "BCAB", length 4. A *subsequence* keeps relative order but may skip characters; a *substring* must be contiguous — LCS is about subsequences.

Why care? **This is the engine behind git diff and the diff in your editor.** A diff is essentially: find the longest common subsequence of the old and new file (the lines that stayed), then everything not in it is an insertion or deletion. DNA sequence alignment is the same computation on A/C/G/T strings. So LCS is not academic — it is running every time you review a pull request.

Apply the recipe with two indices. **Subproblem:** `+'`'+`dp[i][j]`+'`'+` = length of the LCS of the first i characters of string a and the first j characters of string b. **Transition:** look at the last characters. If `+'`'+`a[i-1] == b[j-1]`+'`'+`, that character can end the LCS, so `+'`'+`dp[i][j] = dp[i-1][j-1] + 1`+'`'+`. If they differ, the LCS must drop the last char of a *or* of b, so `+'`'+`dp[i][j] = max(dp[i-1][j], dp[i][j-1])`+'`'+`. **Base cases:** `+'`'+`dp[0][*] = dp[*][0] = 0`+'`'+` (an empty string shares nothing). **Order:** rows top-to-bottom, columns left-to-right, since every cell reads up, left, and up-left — all already filled. **Answer:** `+'`'+`dp[m][n]`+'`'+`. Time and space O(m*n); space can drop to O(min(m,n)) with a rolling pair of rows.

The brute force, for contrast, would enumerate all 2^m subsequences of one string and test each against the other — exponential. The 2D table reduces it to the product of the lengths, the classic "exponential to polynomial" win.

### Common pitfalls
- Confusing subsequence with substring. LCS allows gaps; the longest common *substring* is a different (also DP, but contiguous) problem with a different recurrence.
- Off-by-one between string index and table index. With `+'`'+`dp[i][j]`+'`'+` over the *first i* and *first j* chars, the characters being compared are `+'`'+`a[i-1]`+'`'+` and `+'`'+`b[j-1]`+'`'+`.
- Comparing `+'`'+`String`+'`'+` by byte where you mean characters. For ASCII the bytes are fine; for general Unicode, collect `+'`'+`chars()`+'`'+` into a `+'`'+`Vec<char>`+'`'+` first so each "character" is one table step.`,
      code: [
        {
          lang: 'text',
          src: `LCS table for a = "AGCAT", b = "GAC".  dp[i][j] over first i, first j.
Rule: if a[i-1]==b[j-1] -> diag+1 ; else -> max(up, left).

          ""  G   A   C        <- b
      +----------------------
   "" |  0   0   0   0
   A  |  0   0   1   1     (A==A at j=2 -> dp[0][1]+1=1)
   G  |  0   1   1   1     (G==G at j=1 -> dp[0][0]+1=1)
   C  |  0   1   1   2     (C==C at j=3 -> dp[2][2]+1=2)
   A  |  0   1   2   2     (A==A at j=2 -> dp[3][1]+1=2)
   T  |  0   1   2   2     (no T in b -> copy max neighbor)
                    ^ dp[5][3]=2  LCS length = 2  (e.g. "AC")

Each cell reads only UP, LEFT, UP-LEFT (already computed).`
        },
        {
          lang: 'rust',
          src: `// LCS length via a 2D table. O(m*n) time and space.
fn lcs(a: &str, b: &str) -> usize {
    let a: Vec<char> = a.chars().collect(); // one step per character
    let b: Vec<char> = b.chars().collect();
    let (m, n) = (a.len(), b.len());
    // dp[i][j] = LCS length of a[..i] and b[..j]; row/col 0 are the
    // empty-string base cases, already 0.
    let mut dp = vec![vec![0usize; n + 1]; m + 1];
    for i in 1..=m {
        for j in 1..=n {
            dp[i][j] = if a[i - 1] == b[j - 1] {
                dp[i - 1][j - 1] + 1            // extend the match
            } else {
                dp[i - 1][j].max(dp[i][j - 1])  // drop a char from a or b
            };
        }
    }
    dp[m][n]
}

fn main() {
    assert_eq!(lcs("ABCBDAB", "BDCAB"), 4); // e.g. "BCAB"
    assert_eq!(lcs("AGCAT", "GAC"), 2);
}`
        }
      ]
    },
    {
      heading: 'Edit distance: the spell-checker and word-wrap',
      body: `**Edit distance** (the Levenshtein distance) is the minimum number of single-character edits — *insert*, *delete*, or *substitute* — to turn one string into another. "kitten" to "sitting" is 3 (substitute k->s, substitute e->i, insert g). This powers **spell-correction suggestions** (rank candidates by how few edits from the misspelling), **git's smarter diffs**, and the alignment step in DNA tools. It is LCS's close cousin: where LCS *counts* what is shared, edit distance *counts the cost* to reconcile the differences.

Recipe, two indices again. **Subproblem:** `+'`'+`dp[i][j]`+'`'+` = the minimum edits to turn the first i chars of a into the first j chars of b. **Transition:** compare the last characters. If `+'`'+`a[i-1] == b[j-1]`+'`'+`, no edit is needed for them, so `+'`'+`dp[i][j] = dp[i-1][j-1]`+'`'+`. If they differ, take the cheapest of three repairs, each +1: **delete** from a (`+'`'+`dp[i-1][j]`+'`'+`), **insert** into a (`+'`'+`dp[i][j-1]`+'`'+`), or **substitute** (`+'`'+`dp[i-1][j-1]`+'`'+`). **Base cases:** `+'`'+`dp[i][0] = i`+'`'+` (delete all i chars to reach the empty string) and `+'`'+`dp[0][j] = j`+'`'+` (insert all j chars). **Order:** rows then columns. **Answer:** `+'`'+`dp[m][n]`+'`'+`. Time and space O(m*n), reducible to O(min(m,n)) with two rolling rows.

Brute force would try every sequence of edits — wildly exponential. The table makes it the product of the lengths, which is why your phone can rank spelling suggestions instantly. As a bonus example of DP's reach, the same "fill a table of optimal costs" idea solves **typesetting / word-wrap**: define `+'`'+`dp[i]`+'`'+` = the minimum total "ugliness" (squared slack) to lay out the first i words, transition by choosing where the last line begins, and you get the Knuth-style line breaker that TeX uses — another optimization with optimal substructure.

### Common pitfalls
- Forgetting the base row and column. `+'`'+`dp[i][0] = i`+'`'+` and `+'`'+`dp[0][j] = j`+'`'+` are not zero; an empty target still costs i deletions (or j insertions).
- Taking the min over only two of the three operations. Insert, delete, and substitute are all candidates when the characters differ; dropping one undercounts or overcounts.
- Re-deriving the recurrence per call. The three-way `+'`'+`min`+'`'+` plus the equal-char shortcut is the whole rule; memorize the shape and reuse it.`,
      code: [
        {
          lang: 'text',
          src: `EDIT DISTANCE table, a="sat", b="cat".  dp[i][j]=min edits.
Base: dp[i][0]=i (delete all), dp[0][j]=j (insert all).
equal char -> dp[i-1][j-1]; else 1 + min(del, ins, sub).

          ""  c   a   t        <- b
      +----------------------
   "" |  0   1   2   3
   s  |  1   1   2   3    (s!=c: 1+min(0,1,1)=1 substitute s->c)
   a  |  2   2   1   2    (a==a: copy diag dp[1][1]=1)
   t  |  3   3   2   1    (t==t: copy diag dp[2][2]=1)
                    ^ dp[3][3]=1  -> one edit: substitute s->c. Correct!

Each cell reads UP(delete), LEFT(insert), DIAG(sub/keep).`
        },
        {
          lang: 'rust',
          src: `// Levenshtein edit distance via a 2D table. O(m*n) time and space.
fn edit_distance(a: &str, b: &str) -> usize {
    let a: Vec<char> = a.chars().collect();
    let b: Vec<char> = b.chars().collect();
    let (m, n) = (a.len(), b.len());
    let mut dp = vec![vec![0usize; n + 1]; m + 1];
    for i in 0..=m { dp[i][0] = i; } // delete all i chars
    for j in 0..=n { dp[0][j] = j; } // insert all j chars
    for i in 1..=m {
        for j in 1..=n {
            dp[i][j] = if a[i - 1] == b[j - 1] {
                dp[i - 1][j - 1]            // no edit needed
            } else {
                1 + dp[i - 1][j]            // delete from a
                    .min(dp[i][j - 1])      // insert into a
                    .min(dp[i - 1][j - 1])  // substitute
            };
        }
    }
    dp[m][n]
}

fn main() {
    assert_eq!(edit_distance("kitten", "sitting"), 3);
    assert_eq!(edit_distance("sat", "cat"), 1);
}`
        }
      ]
    },
    {
      heading: '0/1 knapsack: choices under a budget, and rolling rows',
      body: `The **0/1 knapsack** is the canonical "allocate a fixed budget" DP and a perfect capstone because it brings together 2D tables, take-or-skip choices, and the rolling-array optimization. You have items, each with a *weight* and a *value*, and a knapsack that holds at most `+'`'+`W`+'`'+` total weight. Maximize the value you carry. The "0/1" means each item is taken whole or not at all (no fractions, no repeats) — unlike unbounded coin change. Real flavor: **splitting a bill or allocating a budget** — pick the set of expenses (each a fixed cost with a fixed benefit) that maximizes benefit without exceeding the budget.

Brute force tries all 2^n subsets of items and keeps the best feasible one — exponential, hopeless past ~30 items. DP exploits optimal substructure: the best packing of the first i items into capacity w is built from the best packings of the first i-1 items.

Recipe. **Subproblem:** `+'`'+`dp[i][w]`+'`'+` = the maximum value using the first i items with total weight at most w. **Transition (the take-or-skip):** if item i is too heavy (`+'`'+`weight[i-1] > w`+'`'+`), you must skip it: `+'`'+`dp[i][w] = dp[i-1][w]`+'`'+`. Otherwise take the better of skipping (`+'`'+`dp[i-1][w]`+'`'+`) or taking it (`+'`'+`dp[i-1][w - weight] + value`+'`'+`). **Base cases:** `+'`'+`dp[0][w] = 0`+'`'+` (no items, no value). **Order:** items outer, capacity inner. **Answer:** `+'`'+`dp[n][W]`+'`'+`. Time O(n*W), space O(n*W).

The rolling trick here has a famous twist. Each row only depends on the row *above*, so you can keep a single 1D array and update it in place — but you must iterate capacity from **high to low**. Going low-to-high would let you use the *same* item twice (because `+'`'+`dp[w - weight]`+'`'+` would already reflect taking item i), silently turning 0/1 knapsack into the unbounded version. Iterating downward guarantees each item is considered once. This direction subtlety is exactly the kind of gotcha that trips first-years, so the trace below highlights it.

### Common pitfalls
- The infamous direction bug: in the 1D rolling version you MUST loop capacity from W down to the item's weight. Looping upward double-counts items and gives a too-large, wrong answer.
- Using `+'`'+`usize`+'`'+` for `+'`'+`w - weight`+'`'+` and underflowing. In Rust `+'`'+`usize`+'`'+` cannot go negative; `+'`'+`5usize - 7`+'`'+` panics (debug) or wraps (release). Guard with `+'`'+`if weight <= w`+'`'+` before subtracting.
- Confusing 0/1 with unbounded (each item once vs unlimited). They differ *only* in loop direction in the 1D form, which is easy to get backwards.`,
      code: [
        {
          lang: 'text',
          src: `0/1 KNAPSACK, capacity W=5.  items (weight,value):
  A(2,3)  B(3,4)  C(4,5)  D(5,6)
dp[i][w] = best value, first i items, weight <= w.

       w=0  1   2   3   4   5
  i=0:  0   0   0   0   0   0     (no items)
  A:    0   0   3   3   3   3     (take A when w>=2)
  B:    0   0   3   4   4   7     (w=5: A+B = 3+4 = 7)
  C:    0   0   3   4   5   7     (w=4: C alone=5 beats 4)
  D:    0   0   3   4   5   7     (D weight 5 value 6 < 7, skip)
                          ^ dp[4][5]=7  -> take A+B.

1D ROLLING danger: updating dp[w] for item A, capacity W..=2 (DOWN):
  before: [0 0 0 0 0 0]
  w=5: dp[5]=max(0, dp[3]+3)=3   w=4: dp[4]=3
  w=3: dp[3]=3                   w=2: dp[2]=3   -> [0 0 3 3 3 3]
Going UP instead would read the just-written dp[2] and add A twice!`
        },
        {
          lang: 'rust',
          src: `// 0/1 knapsack, 2D table. dp[i][w] = best value, first i items, cap w.
fn knapsack_2d(weights: &[usize], values: &[u64], cap: usize) -> u64 {
    let n = weights.len();
    let mut dp = vec![vec![0u64; cap + 1]; n + 1];
    for i in 1..=n {
        for w in 0..=cap {
            // always an option: skip item i
            dp[i][w] = dp[i - 1][w];
            // if it fits, consider taking it
            if weights[i - 1] <= w {
                let take = dp[i - 1][w - weights[i - 1]] + values[i - 1];
                dp[i][w] = dp[i][w].max(take);
            }
        }
    }
    dp[n][cap]
}

// 1D rolling version: O(cap) space. MUST loop capacity DOWNWARD so each
// item is used at most once (the 0/1 rule).
fn knapsack_1d(weights: &[usize], values: &[u64], cap: usize) -> u64 {
    let mut dp = vec![0u64; cap + 1];
    for i in 0..weights.len() {
        // (cap..=weights[i]).rev() goes high -> low; guards underflow too
        for w in (weights[i]..=cap).rev() {
            dp[w] = dp[w].max(dp[w - weights[i]] + values[i]);
        }
    }
    dp[cap]
}

fn main() {
    let w = [2, 3, 4, 5];
    let v = [3, 4, 5, 6];
    assert_eq!(knapsack_2d(&w, &v, 5), 7); // A + B
    assert_eq!(knapsack_1d(&w, &v, 5), 7);
}`
        }
      ]
    }
  ],
  takeaways: [
    'DP applies when a problem has overlapping subproblems (the same smaller question recurs) AND optimal substructure (the best answer is built from best sub-answers).',
    'DP = recursion (or iteration) PLUS memory. Without a cache or table you have only plain recursion, which can be exponential.',
    'Naive recursive Fibonacci is O(phi^n) because it recomputes; remembering each of the n subproblems once makes it O(n).',
    'Memoization is top-down: keep the recursion, add a Vec<Option<T>> or HashMap cache, and store every result before returning it.',
    'Tabulation is bottom-up: seed base cases, then fill a table in an order where every dependency is already computed.',
    'Find the recurrence in four steps: define the subproblem in words, write the transition (a max/min/sum over choices), set base cases, pick fill order and answer cell.',
    'When an answer depends only on a small fixed window of recent cells, the rolling-array trick cuts space from O(n) to O(1).',
    'Comparing two sequences gives 2D DP: LCS powers git diff and DNA alignment; edit distance powers spell-check and smarter diffs.',
    'Greedy can be wrong where DP is right: coin change ({1,3,4} make 6) and house robber both defeat the greedy choice.',
    'In Rust, usize cannot go negative, so guard subtractions like w - weight; and in 1D 0/1 knapsack loop capacity downward to use each item once.'
  ],
  cheatsheet: [
    { label: 'When DP applies', value: 'overlapping subproblems + optimal substructure' },
    { label: 'Memoization (top-down)', value: 'recursion + cache; store before return' },
    { label: 'Tabulation (bottom-up)', value: 'fill table in dependency order from base cases' },
    { label: 'Cache types', value: 'Vec<Option<T>> for int keys, HashMap for rich keys' },
    { label: 'Rolling array', value: 'keep only the last few cells -> O(1) or O(min(m,n)) space' },
    { label: 'Fibonacci / climb stairs', value: 'f(n)=f(n-1)+f(n-2); O(n) time, O(1) space' },
    { label: 'House robber', value: 'dp[i]=max(dp[i-1], dp[i-2]+money); O(n)' },
    { label: 'Coin change (fewest)', value: 'dp[a]=1+min dp[a-c]; O(amount*coins)' },
    { label: 'LCS (2D)', value: 'match: diag+1 else max(up,left); O(m*n)' },
    { label: 'Edit distance (2D)', value: '1+min(del,ins,sub); base dp[i][0]=i, dp[0][j]=j' },
    { label: '0/1 knapsack', value: 'dp[i][w]=max(skip, take); O(n*W)' },
    { label: 'Knapsack 1D rule', value: 'loop capacity DOWN so each item is used once' },
    { label: 'Brute force vs DP', value: 'O(2^n) subsets -> polynomial table; the core win' },
    { label: 'usize gotcha', value: 'cannot go negative; guard w - weight before subtracting' }
  ],
}

export default note
