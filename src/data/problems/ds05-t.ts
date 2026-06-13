import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch05-t-001',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Why Sorted Data Is Required',
    prompt: `A classmate runs binary search on the unsorted slice [9, 3, 7, 1, 5] looking for the value 7. The program does not panic and does not print any error; it just returns "not found." Explain why binary search needs the data to be sorted, and why getting a wrong answer here (instead of a crash) is especially dangerous.`,
    hints: [
      'Think about what a single comparison at the middle tells you about the other elements.',
      'Binary search throws away a whole half based on one comparison. What must be true for that to be safe?',
    ],
    solution: `Binary search works by looking at the middle element and, based on a single comparison, throwing away an entire half of the remaining range. That move is only valid if the data is sorted, because ordering is what lets one comparison rule out a whole side: if the middle value is smaller than the target, every element to its left must also be smaller, so the target can only be on the right. In an unsorted pile that guarantee is gone, so the algorithm may discard the half that actually holds the target and report "not found." This is dangerous precisely because there is no panic and no error message; the code runs happily and lies to you. A silent wrong answer is the worst kind of bug because nothing alerts you that the precondition (sorted input) was violated.`,
    tags: ['binary-search', 'precondition', 'array'],
  },
  {
    id: 'ds-ch05-t-002',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Counting the Halvings',
    prompt: `Binary search throws away half of the remaining items with every comparison. Roughly how many comparisons does it take to search a sorted list of about 1,000,000 items, and about how many for 1,000,000,000 items? Explain in plain words why making the list a thousand times bigger barely changes the work.`,
    hints: [
      'The number of halvings to empty a list of size n is the base-2 logarithm of n.',
      'Each extra factor of about 1000 in size adds only about ten more comparisons.',
    ],
    solution: `The number of comparisons is roughly the base-2 logarithm of the list size, because that is how many times you can cut the size in half before nothing is left. For a million items that is about 20 comparisons, and for a billion items it is about 30. So multiplying the size by a thousand (from a million to a billion) adds only about ten more comparisons, not a thousand times more work. This is the meaning of O(log n) ("logarithmic time"): the work grows like the logarithm of the input, so the list can grow astronomically while the number of steps barely budges. That is why a tool like git bisect can find one bad commit among thousands by testing only about a dozen.`,
    tags: ['binary-search', 'complexity', 'logarithm'],
  },
  {
    id: 'ds-ch05-t-003',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Sort First, or Just Scan?',
    prompt: `You have an unsorted array of n numbers and you need to answer exactly ONE membership question ("is 42 in here?"). A friend says "binary search is O(log n), so sort it and binary-search it; that beats the O(n) linear scan." Why is your friend wrong for this one-off case, and when WOULD their advice be right?`,
    hints: [
      'Binary search needs sorted data first. How much does sorting cost?',
      'Compare the total cost of sort-then-search against a single linear scan, then think about many repeated queries.',
    ],
    solution: `Binary search itself is O(log n), but it requires sorted data, and sorting an unsorted array costs O(n log n). So "sort then binary-search" costs O(n log n) plus O(log n), which is dominated by the O(n log n) sort. A single linear scan is just O(n), which is cheaper than O(n log n). For one lookup, the plain scan wins; sorting just to search once is wasted effort. The friend's advice becomes right when you will query the same data many times: the one-time O(n log n) sort is amortized over all the queries, and each later lookup is only O(log n) instead of O(n). Binary search pays off when the data is queried repeatedly, or when it already arrives sorted (a sorted log, an index, a sorted database column).`,
    tags: ['binary-search', 'complexity', 'trade-off'],
  },
  {
    id: 'ds-ch05-t-004',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Trace the lo/hi/mid Loop',
    prompt: `Using the half-open window convention (lo inclusive, hi exclusive, loop while lo < hi, mid = lo + (hi - lo) / 2), hand-trace the exact-match search for the value 12 in:

  [3, 6, 9, 12, 15, 18, 21, 23, 30]   (length 9)

For each iteration give lo, hi, mid, and the value at mid, and state which branch fires. End by reporting the index returned.`,
    hints: [
      'Start with lo = 0 and hi = 9. The first mid is index 4.',
      'If the value at mid is bigger than the target, set hi = mid; if smaller, set lo = mid + 1.',
    ],
    solution: `Start lo = 0, hi = 9. Iteration 1: mid = 0 + (9 - 0) / 2 = 4, value at index 4 is 15, which is greater than 12, so set hi = mid = 4. Iteration 2: lo = 0, hi = 4, mid = 0 + (4 - 0) / 2 = 2, value at index 2 is 9, which is less than 12, so set lo = mid + 1 = 3. Iteration 3: lo = 3, hi = 4, mid = 3 + (4 - 3) / 2 = 3, value at index 3 is 12, which equals the target, so return index 3. The window shrank 9 -> 4 -> 1 -> hit, using three comparisons, consistent with the O(log n) cost.`,
    tags: ['binary-search', 'invariant', 'array'],
  },
  {
    id: 'ds-ch05-t-005',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'The Update Asymmetry',
    prompt: `In the half-open binary search, the two window updates are deliberately not symmetric: when the middle is too small you write lo = mid + 1, but when the middle is too big you write hi = mid (NOT hi = mid - 1). Explain why each update is correct, and what goes wrong if you "fix" the asymmetry by writing lo = mid and hi = mid - 1 instead.`,
    hints: [
      'Remember which of lo and hi is inclusive and which is exclusive.',
      'Think about whether mid itself is still a candidate after each branch, and what happens to the window size when lo never advances past mid.',
    ],
    solution: `The asymmetry comes straight from the window convention: lo is inclusive (it is the first index that might hold the target) and hi is exclusive (one past the last candidate). When the value at mid is too small, mid is ruled out, and because lo is inclusive the first remaining candidate is mid + 1, so lo = mid + 1. When the value at mid is too big, mid is also ruled out, but because hi is exclusive, setting hi = mid already excludes mid (the new window is lo..mid, which does not include mid). If you instead wrote lo = mid (without the +1), then when mid equals lo the window never shrinks and you get an infinite loop. And writing hi = mid - 1 mixes an inclusive-style update into an exclusive-hi search, which reads one element short and can skip the answer. The rule: lo = mid + 1, hi = mid, and never cross the conventions.`,
    tags: ['binary-search', 'invariant', 'pitfall'],
  },
  {
    id: 'ds-ch05-t-006',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Lower Bound Versus Upper Bound',
    prompt: `Consider the sorted array with duplicates:

  index:  0   1   2   3   4   5   6   7
  value:  1   3   5   5   5   8   8   9

Give the lower_bound and the upper_bound of the target 5, explain the >= versus > rule that distinguishes them, and show how to use the two results to count how many 5s there are.`,
    hints: [
      'lower_bound is the first index whose value is >= target; upper_bound is the first index whose value is > target.',
      'The count of a value is upper_bound minus lower_bound.',
    ],
    solution: `The lower_bound of 5 is index 2, the first index whose value is greater than or equal to 5. The upper_bound of 5 is index 5, the first index whose value is strictly greater than 5 (that is the first 8). The only difference between the two queries is the comparison: lower_bound moves right while the value is strictly less than the target (using >= to decide the boundary), and upper_bound moves right while the value is less than or equal to the target (using > to decide the boundary). In other words, lower_bound pushes elements equal to the target to the right of the boundary, while upper_bound pushes them to the left. The count of 5s is upper_bound minus lower_bound = 5 - 2 = 3, which matches the three 5s at indices 2, 3, and 4.`,
    tags: ['binary-search', 'lower-bound', 'duplicates'],
  },
  {
    id: 'ds-ch05-t-007',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Reading Err From binary_search',
    prompt: `The Rust standard library call xs.binary_search(&t) returns a Result<usize, usize>. On the sorted slice [10, 20, 30, 40] you call xs.binary_search(&25). What does it return, what does the value inside mean, and why is it wrong to treat the Err case as a plain failure?`,
    hints: [
      'Ok(i) means present at index i; Err(i) means absent, and i carries useful information.',
      'Think about where you would slide 25 in to keep the slice sorted.',
    ],
    solution: `It returns Err(2). The Err variant means the target 25 is not present, but the index it carries is not a failure code; it is the insertion point, the exact index where you would insert 25 to keep the slice sorted. Inserting 25 at index 2 turns [10, 20, 30, 40] into [10, 20, 25, 30, 40]. Treating Err as a bare "it failed" throws away half the value of the call: instead of doing a second search to figure out where the element belongs, you can pattern-match the Err and use its index directly (for example with insert). So Ok(i) tells you "found, here," and Err(i) tells you "not here, but this is where it goes."`,
    tags: ['binary-search', 'std-library', 'result'],
  },
  {
    id: 'ds-ch05-t-008',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Two Ways to Compute mid',
    prompt: `Two students write the midpoint differently:

  A:  let mid = (lo + hi) / 2;
  B:  let mid = lo + (hi - lo) / 2;

Both look correct and agree on small inputs. Explain the bug hiding in version A, what specifically happens in a Rust debug build versus a release build when it triggers, and why version B never has the problem.`,
    hints: [
      'The danger appears when lo and hi are both large. What can lo + hi do to a fixed-size integer?',
      'Think about how a debug build and a release build differ when an integer addition overflows.',
    ],
    solution: `Version A can overflow. If lo and hi are both large, their sum lo + hi can exceed the maximum value the integer type can hold, even though the true midpoint is perfectly in range. When that overflow happens in a Rust debug build, the program panics with "attempt to add with overflow" and crashes. In a release build it does not panic; the addition silently wraps around to a small or negative-looking value, so mid lands somewhere nonsensical and the search is quietly wrong, which is harder to catch. Version B never forms the dangerous sum: since hi is never smaller than lo inside the loop, hi - lo is a safe, smaller non-negative number, and adding half of it to lo lands at the same midpoint without ever computing lo + hi. That is why lo + (hi - lo) / 2 is the canonical safe midpoint you should memorize.`,
    tags: ['binary-search', 'overflow', 'pitfall'],
  },
  {
    id: 'ds-ch05-t-009',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'The usize Underflow Trap',
    prompt: `A student adapts binary search to use an inclusive hi and writes the "go left" branch as hi = mid - 1. It works on most inputs but occasionally panics with an out-of-bounds index in release mode (or "attempt to subtract with overflow" in debug). Explain what is special about Rust's usize type that causes this, when exactly it triggers, and why the exclusive-hi convention (hi = mid) sidesteps the whole problem.`,
    hints: [
      'Indices have type usize, which is unsigned. What is 0 minus 1 for an unsigned integer?',
      'When can mid be 0 in a binary search? Then trace what hi = mid - 1 does.',
    ],
    solution: `Array indices in Rust are of type usize, an unsigned integer that cannot be negative. If mid is 0 and you compute mid - 1, the value does not become -1 (there is no such usize); it underflows. In a debug build that panics with "attempt to subtract with overflow"; in a release build it wraps around to a gigantic number near 18 quintillion, and the very next time you use hi to index the array you get an out-of-bounds panic. This triggers whenever the search narrows so that mid lands on index 0 and the "go left" branch runs. The exclusive-hi convention avoids the subtraction entirely: it sets hi = mid (the window becomes lo..mid, which excludes mid because hi is exclusive), so you never subtract one from a usize index and never risk the underflow. If you truly need mid - 1, guard it so mid is never 0 there, or use checked_sub.`,
    tags: ['binary-search', 'usize', 'pitfall'],
  },
  {
    id: 'ds-ch05-t-010',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Spot the Non-Monotonic Predicate',
    prompt: `Binary search on the answer finds the smallest X for which a yes-or-no test feasible(X) is true, but only if feasible is MONOTONIC (once true, it stays true as X grows). For each predicate below, say whether it is monotonic in the candidate and whether binary search on the answer is safe to use:

  (a) feasible(servers) = "this many servers keep latency under the limit at peak load"
  (b) feasible(speed) = "Koko finishes all banana piles within H hours at this speed"
  (c) feasible(k) = "exactly k servers are running right now"

Explain what breaks if you binary-search a non-monotonic predicate.`,
    hints: [
      'Ask: if the candidate gets bigger, can a "yes" ever turn back into a "no"?',
      'Monotonic predicates form a block of "no" on the left and a block of "yes" on the right; binary search finds the single flip.',
    ],
    solution: `(a) Monotonic and safe: adding more servers never hurts, so once some count keeps latency under the limit, every larger count does too; the "no" answers form a block on the left and "yes" on the right. (b) Monotonic and safe: eating faster never makes Koko slower, so once a speed lets her finish in time, every larger speed does too. (c) Not monotonic and not safe: "exactly k servers are running" is true for one specific k and false for both smaller and larger values, so the answers go ...no, yes, no... rather than forming a single flip from no to yes. Binary search relies on that single flip; if the predicate is true in some isolated spot or flips true-false-true, the search can compare at a midpoint, see the wrong block, and discard the region that actually contains the answer, landing on a wrong result. You must confirm monotonicity before applying the pattern.`,
    tags: ['search-on-answer', 'monotonic', 'pitfall'],
  },
  {
    id: 'ds-ch05-t-011',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Bracketing Koko Correctly',
    prompt: `In "Koko eating bananas" you binary-search the eating speed K for the smallest value at which she finishes all piles within H hours. Two design questions: (1) why start the low bound at lo = 1 and the high bound at hi = the largest pile, rather than lo = 0 and some bigger hi, and (2) the hours for a pile of size p at speed k is computed as (p + k - 1) / k rather than p / k. Explain why that exact ceiling-division form is needed.`,
    hints: [
      'What happens to the feasibility check if K is 0? And can the answer ever need to exceed the largest pile?',
      'Plain integer division rounds down. How many full hours does a pile of 7 at speed 4 really take?',
    ],
    solution: `(1) The low bound is 1 because a speed of 0 is nonsense; at speed 0 Koko eats nothing, and computing hours would divide by zero. The answer never needs to exceed the largest pile, because at a speed equal to the biggest pile every pile takes exactly one hour, which is the fastest meaningful rate; any larger speed gives the same one-hour-per-pile result, so the largest pile is a safe upper bracket that is guaranteed feasible. Starting hi too low could miss the answer, so you pick a value where feasible is surely true. (2) Hours per pile must be rounded UP: a pile of 7 at speed 4 takes 2 hours (4 in the first hour, 3 in the second), but plain p / k = 7 / 4 = 1 rounds down and under-counts, making the check think she is faster than she is. The form (p + k - 1) / k computes the ceiling using only integer arithmetic: adding k - 1 before dividing pushes any nonzero remainder up to the next whole hour, so 7 + 3 = 10, divided by 4, is 2. That is the correct number of hours.`,
    tags: ['search-on-answer', 'koko', 'ceiling-division'],
  },
  {
    id: 'ds-ch05-t-012',
    chapter: 5,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Why One Half Is Always Sorted',
    prompt: `A rotated sorted array such as [4, 5, 6, 7, 0, 1, 2] is not globally sorted, yet a modified binary search still finds any target in O(log n). The key claim is "at least one of the two halves around mid is always properly sorted." Trace the search for target = 0 in [4, 5, 6, 7, 0, 1, 2] step by step, and at each step name which half is the sorted one and how you decide whether to follow it. Use lo inclusive, hi exclusive.`,
    hints: [
      'Compare the value at lo with the value at mid: if a[lo] <= a[mid], the left half is sorted; otherwise the right half is.',
      'Once you know the sorted half, check whether the target lies inside its value range to decide which way to go.',
    ],
    solution: `Start lo = 0, hi = 7. Step 1: mid = 0 + (7 - 0) / 2 = 3, a[mid] = 7. Since a[lo] = 4 <= 7 = a[mid], the LEFT half [index 0..3] is sorted, spanning values 4 through 7. Is target 0 in [4, 7)? No, so the answer must be in the messy right half: set lo = mid + 1 = 4. Step 2: lo = 4, hi = 7, mid = 4 + (7 - 4) / 2 = 5, a[mid] = 1. Since a[lo] = 0 <= 1 = a[mid], the LEFT half (now indices 4..5) is sorted, spanning values 0 through 1. Is target 0 in [0, 1)? Yes, so go left: set hi = mid = 5. Step 3: lo = 4, hi = 5, mid = 4 + (5 - 4) / 2 = 4, a[mid] = 0, which equals the target, so return index 4. The reason one half is always sorted: rotation cuts the original sorted array at a single pivot, so any sub-range that does not straddle the pivot is still in order; mid falls in exactly one side, and the other side relative to the cut stays sorted. We still halve the window each step, spending one extra comparison to pick the trustworthy sorted half, so the cost remains O(log n).`,
    tags: ['binary-search', 'rotated-array', 'invariant'],
  },
]

export default problems
