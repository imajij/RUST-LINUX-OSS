import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-ds-03',
  track: 'dsa',
  chapter: 3,
  title: 'Sliding Window',
  summary: `Imagine you are watching a stream of numbers go by, sensor readings, log lines, network requests, and you keep being asked the same kind of question: "what is happening in the most recent stretch of data?" The slowest possible answer is to stop and re-add everything in that stretch every single time. The sliding window technique is the realization that consecutive stretches overlap almost completely, so instead of recomputing from scratch you nudge a window one step forward: add what just entered on the right, remove what just fell off on the left, and keep a running answer. This single idea turns a pile of problems that look quadratic (n squared, re-scanning everything for every position) into clean linear passes (one walk through the data). In this chapter you will learn the two shapes the window takes, fixed-size and variable-size, the expand-right / shrink-left invariant that governs every variable-window problem, and how to track the window's contents with a HashMap, a HashSet, or a tiny fixed array. Master this and a whole family of array and string problems collapses into the same short, fast loop.`,
  sections: [
    {
      heading: 'What a window is, and why sliding beats recomputing',
      body: `A **window** is just a contiguous (back-to-back, no gaps) sub-range of an array or string, described by two indices: a left boundary and a right boundary. The elements between those two boundaries are "inside the window"; everything else is outside. That is the entire data structure, two integers, no extra storage required to *describe* it.

The reason windows matter is a pattern that shows up constantly: you are asked something about every contiguous sub-range of a fixed or growing size, "the sum of each block of 5", "the longest run with no repeats", "the smallest stretch that adds up to at least 100". The naive way to answer is to pick a starting point, then walk forward re-reading every element of that sub-range, then move the starting point and do it all again. If there are n starting points and each sub-range can be up to n long, that is **n squared** work: for every position you re-scan a chunk of the array, and those chunks overlap enormously, so you are recomputing the same partial answers over and over.

The key observation, the one that names the technique, is that two neighbouring windows differ by only **one element on each end**. When the window slides one step to the right, exactly one new element enters on the right and exactly one old element leaves on the left. Everything in the middle is unchanged. So instead of re-reading the whole window, you update your running answer in **constant time**: add the entering element, subtract or remove the leaving one. The window "slides" along the data like a frame moving over a filmstrip, and the work per step is tiny and fixed.

Picture a media player buffering audio: it always keeps the next few seconds of sound ready. As playback advances one frame, it appends one new frame at the front of the buffer and discards one stale frame at the back. It never rebuilds the whole buffer, it just shifts the boundaries. That is a sliding window in the wild.

### Common pitfalls

- Confusing a *contiguous* window with an arbitrary *subset*. Sliding window only applies when the answer lives in a back-to-back range. If elements can be picked from anywhere, this technique does not apply.
- Forgetting that the speed-up only exists if the per-step update is O(1) (or close to it). If updating the window costs as much as rebuilding it, you have gained nothing.`,
      code: [
        {
          lang: 'text',
          src: `array:  [ 4 ][ 2 ][ 1 ][ 7 ][ 8 ][ 1 ][ 2 ][ 8 ]
index:    0    1    2    3    4    5    6    7

A window of width 4 is just two boundaries, L and R:

          L              R
          v              v
        [ 4   2   1   7 ] 8   1   2   8     window = {4,2,1,7}

Slide one step right: 8 ENTERS on the right, 4 LEAVES on the left.

              L              R
              v              v
          4 [ 2   1   7   8 ] 1   2   8     window = {2,1,7,8}

Only TWO elements changed (the 4 left, the 8 entered).
Everything in the middle (2,1,7) stayed put -> reuse it.`
        }
      ]
    },
    {
      heading: 'Fixed-size window: maximum sum of k consecutive elements',
      body: `The cleanest place to see the speed-up is a fixed-width window: given an array and a width **k**, find the largest sum among all blocks of k consecutive elements.

**The brute-force approach.** For each starting index, add up the next k elements, remember the biggest total. There are about n starting positions and each inner sum touches k elements, so this is **n times k** work. In the worst case, when k is around n over 2, that is again quadratic, and almost all of it is wasted: when you move the start by one, the new block shares k minus 1 elements with the old one, yet you re-add all k.

**The sliding-window approach.** Compute the sum of the very first block once. Then, to get the next block's sum, *add the element entering on the right and subtract the element leaving on the left*. That is two arithmetic operations regardless of how big k is. Walk the right boundary from k to the end of the array, maintaining this running sum, and track the maximum. You touch each element a constant number of times, so the whole thing is **O(n)** time and **O(1)** extra space (just the running sum and the best-so-far).

The invariant, the property that stays true on every iteration, is: *running_sum always equals the sum of the current window of exactly k elements.* As long as you preserve that on every slide (add one, drop one), you can trust running_sum without ever re-adding.

### Common pitfalls

- Forgetting the empty cases. If k is 0 or larger than the array, no valid window exists; decide on a clear result (here we return None) instead of indexing out of bounds.
- Adding the entering element but forgetting to subtract the leaving one. Then running_sum is the sum of an ever-growing prefix, not a fixed-width window, and every answer after the first is wrong.
- Re-summing the whole block inside the loop "just to be safe". That quietly puts you back at O(n times k); the entire point is the two-operation update.`,
      code: [
        {
          lang: 'text',
          src: `k = 3,  array = [2, 1, 5, 1, 3, 2]

step 0: build the first window sum once
        [ 2  1  5 ] 1  3  2        sum = 2+1+5 = 8     best = 8

step 1: 1 enters, 2 leaves -> sum = 8 + 1 - 2 = 7
         2 [ 1  5  1 ] 3  2        sum = 7             best = 8

step 2: 3 enters, 1 leaves -> sum = 7 + 3 - 1 = 9
         2  1 [ 5  1  3 ] 2        sum = 9             best = 9

step 3: 2 enters, 5 leaves -> sum = 9 + 2 - 5 = 6
         2  1  5 [ 1  3  2 ]       sum = 6             best = 9

answer: 9   (the window {5,1,3})
Each slide did ONE add and ONE subtract, never a re-scan.`
        },
        {
          lang: 'rust',
          src: `// Maximum sum of any k consecutive elements.  O(n) time, O(1) space.
fn max_sum_k(nums: &[i64], k: usize) -> Option<i64> {
    if k == 0 || k > nums.len() {
        return None; // no valid window exists
    }

    // 1) Sum the first window once.
    let mut window_sum: i64 = nums[..k].iter().sum();
    let mut best = window_sum;

    // 2) Slide: right boundary walks from k to the end.
    for right in k..nums.len() {
        // add the entering element, drop the one leaving on the left
        window_sum += nums[right];
        window_sum -= nums[right - k];
        best = best.max(window_sum);
    }
    Some(best)
}

fn main() {
    let v = [2, 1, 5, 1, 3, 2];
    assert_eq!(max_sum_k(&v, 3), Some(9)); // window {5,1,3}
    assert_eq!(max_sum_k(&v, 7), None);    // k larger than the array
    println!("ok");
}`
        }
      ]
    },
    {
      heading: 'Fixed-size window in the wild: the moving average',
      body: `A **moving average** is the average of the last k values, recomputed as each new value arrives. It is everywhere: smoothing noisy temperature readings, a "frames per second" counter that averages the last 30 frames, a stock's 50-day average price. The point of the average is to damp out spikes, one weird sensor reading barely budges the average of the last 100.

This is the same fixed-window machine, with the average being the running sum divided by k. The naive version re-adds the last k readings on every tick, which is k work per reading and n times k overall. The sliding version keeps a running sum: on each new reading, add it, and if the window is now full, subtract the reading that falls off the back, then divide by the count. That is O(1) per reading, exactly what a real-time stream needs, because you cannot afford to re-scan history on every sensor sample.

Rust's standard library gives us **VecDeque**, a double-ended queue, which is the natural home for this: you push_back the new reading and pop_front the stale one, both O(1). Storing the readings (not just the sum) lets you handle the warm-up phase cleanly, while the window is still filling up to size k, and avoids floating-point drift you would get from only ever adding and subtracting forever.

### Common pitfalls

- The warm-up edge case: before k readings have arrived, the "window" is shorter than k. Decide explicitly whether you average over the readings seen so far or only start emitting once the window is full.
- Floating-point drift if you keep one running sum forever and only add/subtract: tiny rounding errors accumulate over millions of updates. Re-summing occasionally, or keeping the values in a deque, keeps it honest.
- Using usize for the running sum when values can be negative or the subtraction can momentarily look negative; pick a signed or float type that fits the data.`,
      code: [
        {
          lang: 'text',
          src: `Streaming sensor readings into a width-3 moving average:

reading  deque (window)     sum   avg = sum/len
  10     [10]                10    10.00   (warm-up, len 1)
  20     [10,20]             30    15.00   (warm-up, len 2)
  30     [10,20,30]          60    20.00   (full)
  40     [20,30,40]          90    30.00   30 in, 10 out
  12     [30,40,12]          82    27.33   12 in, 20 out
   8     [40,12, 8]          60    20.00    8 in, 30 out

The front of the deque is the oldest reading (pop_front),
the back of the deque is the newest (push_back).`
        },
        {
          lang: 'rust',
          src: `use std::collections::VecDeque;

// A reusable moving-average filter over the last k readings.
struct MovingAverage {
    k: usize,
    window: VecDeque<f64>,
    sum: f64,
}

impl MovingAverage {
    fn new(k: usize) -> Self {
        MovingAverage { k, window: VecDeque::new(), sum: 0.0 }
    }

    // Feed one reading, get the current average. O(1) per call.
    fn next(&mut self, value: f64) -> f64 {
        self.window.push_back(value); // newest enters at the back
        self.sum += value;
        if self.window.len() > self.k {
            // window overfull: drop the oldest from the front
            let old = self.window.pop_front().unwrap();
            self.sum -= old;
        }
        self.sum / self.window.len() as f64 // len handles warm-up
    }
}

fn main() {
    let mut ma = MovingAverage::new(3);
    assert_eq!(ma.next(10.0), 10.0); // warm-up: avg of [10]
    assert_eq!(ma.next(20.0), 15.0); // avg of [10,20]
    assert_eq!(ma.next(30.0), 20.0); // avg of [10,20,30]
    assert_eq!(ma.next(40.0), 30.0); // avg of [20,30,40]
    println!("ok");
}`
        }
      ]
    },
    {
      heading: 'The variable window and the expand-right / shrink-left invariant',
      body: `Fixed windows are the easy case because the width never changes. The powerful case is the **variable-size window**, where the window grows and shrinks to satisfy some condition, and you want the longest or shortest window that does.

Every variable-window solution is the same two-pointer dance. Both pointers, left and right, start at the beginning. You repeat two moves:

1. **Expand right.** Move the right boundary forward by one, pulling a new element into the window and updating the window's state.
2. **Shrink left.** *While* the window violates the condition, move the left boundary forward, pushing elements out of the window and undoing their effect on the state, until the window is valid again.

The thing that makes this correct is an **invariant** you choose up front, a property you promise to keep true every time you pause to read the answer. For "longest valid window" problems the invariant is usually *the window from left to right is always valid after the shrink loop finishes*, and you record the best width right there. For "shortest valid window" problems the invariant flips: you shrink *as long as the window is still valid*, recording the best width just before each shrink because that is when the window is smallest while still working.

Why is this O(n) even though there is a loop inside a loop and it *looks* quadratic? Because the left pointer never moves backward and never passes the right pointer. Across the entire run, right advances n times and left advances at most n times, so the total number of pointer moves is at most 2n. Each element is added exactly once and removed at most once. The nested while-loop is not "for every right, scan everything"; it is "left creeps forward, collectively, at most n steps in the whole algorithm." This accounting trick, charging each step to an element that can only be charged once, is called **amortized** analysis: any single expand might trigger several shrinks, but averaged over the whole run each element costs a constant amount.

### Common pitfalls

- Forgetting to *undo* state when shrinking. Expanding updates the window state (a count, a sum, a set); shrinking must reverse exactly that update, or the state drifts and your answer is wrong.
- Recording the answer at the wrong moment. Longest-window: record after the shrink loop (window is valid). Shortest-window: record inside, just before shrinking (window is smallest-valid).
- Assuming it is O(n squared) because you see nested loops. The inner loop is bounded by left, which advances at most n times total over the whole outer loop, not n times per outer step.`,
      code: [
        {
          lang: 'text',
          src: `The universal variable-window skeleton:

   left = 0
   for right in 0..n:
       add nums[right] to window state        <- EXPAND right
       while window is INVALID:
           remove nums[left] from window state <- SHRINK left
           left += 1
       update answer using (right - left + 1)  <- window now valid

Pointer movement over a whole run (n = 8):

   right: 0 1 2 3 4 5 6 7   advances n times
   left:  0 0 1 1 2 3 3 4   advances <= n times, NEVER backward

   total moves <= 2n  ->  O(n), even though it "looks" nested.`
        }
      ]
    },
    {
      heading: 'Longest substring without repeating characters',
      anim: 'sliding-window',
      body: `Here is the most famous variable-window problem. Given a string, find the length of the longest substring (contiguous run of characters) that contains no repeated character. For "abcabcbb" the answer is 3, the run "abc".

**Brute force.** Try every starting position, and from each one extend forward checking with a set whether you have seen a character before, stopping at the first repeat. That is O(n squared) in the worst case, and it re-examines the same characters from many different starts.

**Sliding window.** Keep a window that, by invariant, *never contains a duplicate*. Walk the right boundary forward, adding each character to a **HashSet** that holds exactly the characters currently in the window. When the incoming character is already in the set, the window is now invalid, so shrink from the left, removing characters one at a time until the duplicate is gone. After the shrink, the window is valid again, so record its width. Each character is inserted once and removed at most once, so this is **O(n)** time and O(min(n, alphabet)) space.

A HashSet answers "is this character in the window?" in O(1). If the alphabet is small and known, lowercase ASCII letters, say, you can swap the set for a 26-slot boolean array indexed by c as usize minus the code of 'a', which is faster and allocation-free. The set version is the general, any-character one.

### Common pitfalls

- Removing the wrong character when shrinking. You must remove the element at s[left] (the actual leftmost character), advancing left each time, not just the one duplicate you spotted.
- Reading the answer before the window is repaired. Only after the while-loop finishes is the window guaranteed duplicate-free; record the width there.
- Using string byte indices as if they were character counts on non-ASCII text. Rust strings are UTF-8, so iterate with chars() (or char_indices()) when characters may be multi-byte.`,
      code: [
        {
          lang: 'text',
          src: `s = "abcabcbb"     (treat each letter as one entry in a HashSet)

R  char  action                     set        L  win  best
0   a    add a                      {a}        0  "a"   1
1   b    add b                      {a,b}      0  "ab"  2
2   c    add c                      {a,b,c}    0  "abc" 3
3   a    'a' in set -> shrink:
            remove a (s[L]=a), L=1  {b,c}      1
         now add a                  {b,c,a}    1  "bca" 3
4   b    'b' in set -> shrink:
            remove b (s[L]=b), L=2  {c,a}      2
         now add b                  {c,a,b}    2  "cab" 3
5   c    'c' in set -> shrink:
            remove c (s[L]=c), L=3  {a,b}      3
         now add c                  {a,b,c}    3  "abc" 3
6   b    'b' in set -> shrink:
            remove a (s[L]=a), L=4  {b,c}      4
            remove b (s[L]=b), L=5  {c}        5
         now add b                  {c,b}      5  "cb"  3
7   b    'b' in set -> shrink:
            remove c (s[L]=c), L=6  {b}        6
            remove b (s[L]=b), L=7  {}         7
         now add b                  {b}        7  "b"   3

answer: 3`
        },
        {
          lang: 'rust',
          src: `use std::collections::HashSet;

// Length of the longest substring with all-distinct characters. O(n).
fn longest_unique(s: &str) -> usize {
    let chars: Vec<char> = s.chars().collect(); // handle UTF-8 safely
    let mut seen: HashSet<char> = HashSet::new();
    let mut left = 0usize;
    let mut best = 0usize;

    for right in 0..chars.len() {
        // SHRINK: while the entering char already lives in the window,
        // evict from the left until it no longer does.
        while seen.contains(&chars[right]) {
            seen.remove(&chars[left]); // undo the leftmost char
            left += 1;
        }
        // EXPAND: now it is safe to add the new char.
        seen.insert(chars[right]);
        // window [left..=right] is valid (no duplicates) -> measure it.
        best = best.max(right - left + 1);
    }
    best
}

fn main() {
    assert_eq!(longest_unique("abcabcbb"), 3); // "abc"
    assert_eq!(longest_unique("bbbbb"), 1);    // "b"
    assert_eq!(longest_unique("pwwkew"), 3);   // "wke"
    assert_eq!(longest_unique(""), 0);
    println!("ok");
}`
        }
      ]
    },
    {
      heading: 'Smallest subarray with sum at least target',
      body: `Now the *shortest*-window flavour. Given an array of positive numbers and a target, find the length of the shortest contiguous subarray whose sum is at least the target. This is exactly the shape of a network rate-limiter question: "what is the shortest recent burst that already exceeds our budget?" or a billing alert: "how few consecutive days does it take to spend at least 1000?"

**Brute force.** Try every start, extend until the running sum reaches the target, record the length, repeat. O(n squared).

**Sliding window.** Because all values are positive, the window sum only *grows* when you expand right and only *shrinks* when you shrink left, which makes the window monotonic and the technique apply cleanly. Expand right, adding to a running sum. Then, *while the sum is at least the target*, the window is valid, and since we want the smallest such window we record its width and immediately try to shrink it from the left, subtracting as we go, to see if a smaller window still qualifies. The moment the sum drops below the target we stop shrinking and let right advance again. O(n) time, O(1) space.

Note the inverted shrink condition compared to the previous problem. There we shrank while *invalid* (had a duplicate). Here we shrink while *valid* (sum still big enough) because the goal is minimization: we keep squeezing as long as we can and record the smallest squeeze.

### Common pitfalls

- This monotonic trick relies on all values being positive (or non-negative). With negative numbers, expanding can *decrease* the sum and shrinking can *increase* it, breaking the window's monotonicity, that variant needs prefix sums plus a different structure, not a plain sliding window.
- Returning a length when no qualifying window exists. Decide on a sentinel (0 is common) for "no subarray reaches the target".
- usize subtraction underflow when computing widths or decreasing the sum; in Rust, computing zero minus one on a usize panics in debug and wraps in release, so order your arithmetic so it never goes negative.`,
      code: [
        {
          lang: 'text',
          src: `target = 7,  nums = [2, 3, 1, 2, 4, 3]

R  add  sum  while sum>=7 record & shrink                  L  best
0   2    2   no                                            0   inf
1   3    5   no                                            0   inf
2   1    6   no                                            0   inf
3   2    8   8>=7 -> len 4 (best=4); drop 2 (s[0]) sum=6   1   4
4   4   10   10>=7-> len 4; drop 3 sum=7
            7>=7 -> len 3 (best=3); drop 1 sum=6           3   3
5   3    9   9>=7 -> len 3; drop 2 sum=7
            7>=7 -> len 2 (best=2); drop 4 sum=3           5   2

answer: 2   (the subarray {4,3})`
        },
        {
          lang: 'rust',
          src: `// Shortest subarray (positive values) whose sum >= target.
// Returns 0 when no such subarray exists. O(n) time, O(1) space.
fn min_subarray_len(target: i64, nums: &[i64]) -> usize {
    let mut left = 0usize;
    let mut sum: i64 = 0;
    let mut best = usize::MAX; // "no window found yet"

    for right in 0..nums.len() {
        sum += nums[right]; // EXPAND right
        // SHRINK while the window is STILL valid (minimizing).
        while sum >= target {
            best = best.min(right - left + 1); // record smallest valid
            sum -= nums[left];                 // undo the leftmost
            left += 1;
        }
    }

    if best == usize::MAX { 0 } else { best }
}

fn main() {
    assert_eq!(min_subarray_len(7, &[2, 3, 1, 2, 4, 3]), 2); // {4,3}
    assert_eq!(min_subarray_len(4, &[1, 4, 4]), 1);          // {4}
    assert_eq!(min_subarray_len(11, &[1, 1, 1, 1]), 0);      // impossible
    println!("ok");
}`
        }
      ]
    },
    {
      heading: 'Longest substring with at most k distinct characters',
      body: `A window-state problem that needs *counts*, not just presence. Find the longest substring containing at most k distinct characters. This is the "longest streak of valid log lines" idea: keep extending the streak as long as you have not seen more than k different kinds of events; the moment a (k+1)-th distinct kind appears, trim from the back until you are within budget again.

A plain HashSet is not enough here, because when you shrink and remove a character from the left, you need to know whether that was the *last* copy of that character in the window. If two copies of 'a' are in the window and you drop one, 'a' is still present, so the distinct-count must not drop. So the window state is a **HashMap from character to its count inside the window**. The number of distinct characters is simply the map's length.

The loop is the longest-window pattern: expand right, incrementing the entering character's count (inserting it with count 1 if new). While the map has more than k keys, the window is invalid, so shrink: decrement the leftmost character's count, and *if that count hits zero, remove the key entirely* so the distinct count falls. After the shrink the window has at most k distinct characters again; record its width. O(n) time, and O(k) space because the map never holds more than k+1 keys at once.

Rust's **entry API** is the idiomatic way to do "increment a counter, inserting zero if absent": dereference map.entry(c).or_insert(0) and add one. It is one hash lookup instead of two (a contains then an insert).

### Common pitfalls

- Decrementing a count but forgetting to remove the key at zero. If a zero-count key lingers, map.len() overcounts distinct characters and the window never shrinks correctly.
- Using HashSet instead of HashMap and being unable to tell when the *last* occurrence of a character leaves the window. Counts are essential whenever a character can repeat inside the window.
- Off-by-one in the validity test: "at most k distinct" means shrink while map.len() is greater than k, not greater-than-or-equal.`,
      code: [
        {
          lang: 'text',
          src: `k = 2,  s = "eceba"     state = HashMap<char,count>

R  c   counts after expand   distinct  action            L win   best
0  e   {e:1}                  1         keep              0 "e"   1
1  c   {e:1,c:1}              2         keep              0 "ec"  2
2  e   {e:2,c:1}              2         keep              0 "ece" 3
3  b   {e:2,c:1,b:1}          3 (>2!)   shrink:
          drop e -> {e:1,c:1,b:1}, still 3 distinct
          drop c (count 0 -> remove key) -> {e:1,b:1}
                                          distinct 2      2 "eb"  3
4  a   {e:1,b:1,a:1}          3 (>2!)   shrink:
          drop e (count 0 -> remove key) -> {b:1,a:1}
                                          distinct 2      3 "ba"  3

answer: 3   (the substring "ece")`
        },
        {
          lang: 'rust',
          src: `use std::collections::HashMap;

// Longest substring with at most k distinct characters. O(n), O(k) space.
fn longest_k_distinct(s: &str, k: usize) -> usize {
    if k == 0 { return 0; }
    let chars: Vec<char> = s.chars().collect();
    let mut counts: HashMap<char, usize> = HashMap::new();
    let mut left = 0usize;
    let mut best = 0usize;

    for right in 0..chars.len() {
        // EXPAND: bump the entering char's count (entry API: one lookup).
        *counts.entry(chars[right]).or_insert(0) += 1;

        // SHRINK while too many distinct characters (map.len() == distinct).
        while counts.len() > k {
            let c = chars[left];
            let cnt = counts.get_mut(&c).unwrap();
            *cnt -= 1;
            if *cnt == 0 {
                counts.remove(&c); // last copy left -> distinct count drops
            }
            left += 1;
        }
        // window now has <= k distinct chars -> measure it.
        best = best.max(right - left + 1);
    }
    best
}

fn main() {
    assert_eq!(longest_k_distinct("eceba", 2), 3); // "ece"
    assert_eq!(longest_k_distinct("aa", 1), 2);    // "aa"
    assert_eq!(longest_k_distinct("abaccc", 2), 4); // "accc", 2 distinct {a,c}
    println!("ok");
}`
        }
      ]
    },
    {
      heading: 'Choosing the window state: HashSet vs HashMap vs a fixed array',
      body: `Every sliding-window solution is "a loop plus some window state", and picking the right container for that state is most of the skill. The three common choices map to three different questions you need the state to answer fast.

**A running scalar (sum, count, product).** When the only thing you track is an aggregate, fixed-window max-sum, the moving average, smallest subarray with a target sum, you do not need a container at all. A single i64 or f64 that you add to and subtract from is O(1) per step and zero allocation. Reach for this first; it is the cheapest.

**A HashSet** answers "*is* element x currently in the window?" in O(1). Use it when each element either is or is not in the window and you never need to know *how many copies*, which is exactly the no-repeats problem, since the invariant guarantees at most one of each. The moment an element can legitimately appear more than once inside the window, a set cannot tell you when the last copy leaves, and you must upgrade.

**A HashMap from element to count** answers "*how many* copies of x are in the window?" and, via its length, "how many distinct elements?" Use it for the at-most-k-distinct family, anagram and permutation windows, and anything where shrinking must know whether it removed the final occurrence of a value. The **entry API** (or_insert, and_modify) keeps the increment/decrement idiomatic and single-lookup.

**A fixed-size array** is the specialist's HashMap: when the universe of elements is small and known, lowercase ASCII (26 slots), bytes (256 slots), digits (10 slots), index a plain array of 26 usize by c as usize minus the code of 'a'. It does everything a count-HashMap does but with no hashing and no heap allocation, so it is markedly faster in tight loops. The trade-off is rigidity: it only works when you can bound and densely map the alphabet to indices.

### Common pitfalls

- Using a HashSet when counts matter (duplicates inside the window). You will be unable to maintain the distinct-count correctly on shrink.
- Indexing a fixed array with a character that is outside the assumed alphabet (an uppercase letter, a space, a non-ASCII byte). Validate the input or use a HashMap.
- Forgetting that c as usize minus the code of 'a' is byte arithmetic; it is correct only for single-byte ASCII characters, not arbitrary Unicode scalar values.`,
      code: [
        {
          lang: 'text',
          src: `Decision guide for window state:

  what must the state answer?                 use
  ------------------------------------------  ---------------------
  "what is the sum/avg/count right now?"      a scalar (i64/f64)
  "is x in the window?" (no duplicates)       HashSet<T>
  "how many of x? how many distinct?"         HashMap<T, usize>
  same, but small fixed alphabet (a..z)       [usize; 26]  (fastest)

cost per step:   scalar < fixed array < HashSet/HashMap
flexibility:     scalar < fixed array < HashSet/HashMap`
        },
        {
          lang: 'rust',
          src: `use std::collections::HashMap;

// Same job ("count characters in a window"), three idiomatic states.

// 1) Scalar: track only an aggregate.
fn window_sum(nums: &[i64], k: usize) -> i64 {
    nums[..k].iter().sum() // (then add/subtract as you slide)
}

// 2) Fixed array: dense, known alphabet -> no hashing, no allocation.
fn add_lower(counts: &mut [usize; 26], c: char) {
    counts[c as usize - 'a' as usize] += 1; // ASCII a..z only!
}

// 3) HashMap with the entry API: general counts, single lookup each.
fn add_any(counts: &mut HashMap<char, usize>, c: char) {
    *counts.entry(c).or_insert(0) += 1;
}

fn main() {
    let mut arr = [0usize; 26];
    add_lower(&mut arr, 'a');
    add_lower(&mut arr, 'a');
    assert_eq!(arr[0], 2); // two 'a's

    let mut map = HashMap::new();
    add_any(&mut map, 'z');
    assert_eq!(map[&'z'], 1);

    assert_eq!(window_sum(&[1, 2, 3, 9], 3), 6);
    println!("ok");
}`
        }
      ]
    }
  ],
  takeaways: [
    'A window is a contiguous range described by two indices; sliding it reuses overlap instead of recomputing, turning many n-squared scans into one O(n) pass.',
    'Fixed-size window: compute the first block once, then on each slide add the entering element and subtract the leaving one in O(1).',
    'Moving average over a stream is a fixed window: push_back the new reading, pop_front the stale one with a VecDeque, both O(1).',
    'Variable window = expand right, then shrink left while a condition is violated; pick an invariant you keep true wherever you read the answer.',
    'Longest-window problems record the width AFTER the shrink loop (window valid); shortest-window problems record DURING shrinking (window smallest-valid).',
    'It is O(n), not O(n squared): left never moves backward, so across the whole run both pointers advance at most n times each (amortized analysis).',
    'No-duplicates uses a HashSet (presence); at-most-k-distinct and counting problems need a HashMap of counts (remove the key at count zero).',
    'A small fixed alphabet lets you swap the HashMap for a [usize; 26] array, no hashing, no allocation, much faster in hot loops.',
    'The positive-values trick (smallest subarray >= target) relies on the window sum being monotonic; negative numbers break plain sliding window.',
    'In Rust, mind usize: subtractions underflow (panic in debug), and string indexing is byte-based, so iterate UTF-8 with chars() when characters may be multi-byte.'
  ],
  cheatsheet: [
    { label: 'Fixed window slide', value: 'sum += nums[right]; sum -= nums[right - k];  // O(1) per step' },
    { label: 'Max-sum of k block', value: 'O(n) time, O(1) space; seed first window, then slide' },
    { label: 'VecDeque', value: 'push_back / pop_front both O(1): the moving-average window' },
    { label: 'Variable window loop', value: 'for right { add; while invalid { remove; left += 1 } record }' },
    { label: 'Longest vs shortest', value: 'longest: record after shrink; shortest: record inside shrink' },
    { label: 'Why O(n)', value: 'left advances <= n total; each element added once, removed once' },
    { label: 'HashSet<T>', value: 'contains / insert / remove O(1); presence, no duplicates' },
    { label: 'HashMap entry API', value: '*m.entry(c).or_insert(0) += 1  // increment, one lookup' },
    { label: 'Distinct count', value: 'counts.len(); remove key when its count hits 0' },
    { label: '[usize; 26]', value: 'index c as usize - \'a\' as usize; no hashing, ASCII a..z only' },
    { label: 'min_subarray_len', value: 'positive values only; shrink while sum >= target; O(n)' },
    { label: 'usize gotcha', value: 'underflow panics in debug; right - left + 1 stays >= 1' },
    { label: 'UTF-8 strings', value: 's.chars().collect::<Vec<char>>() before index-based windows' },
    { label: 'best.max / best.min', value: 'fold the window width into the running answer each step' }
  ]
}

export default note
