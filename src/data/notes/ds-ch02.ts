import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-ds-02',
  track: 'dsa',
  chapter: 2,
  title: 'Two Pointers',
  summary: `Two pointers is the first real "aha" of algorithm design: a tiny change in how you walk an array turns a slow, nested-loop solution into a single sweep. Instead of checking every pair of elements with two loops, you keep two indices and let the *structure* of the data, usually that it is sorted or that order matters, tell you which index to advance. That one insight collapses many problems from quadratic time (re-scanning everything again and again) down to linear time, while using no extra memory at all.

In this chapter you will learn the two classic shapes of the technique. The opposite-ends pattern starts one pointer at the front and one at the back and walks them toward each other: it powers pair-sum search, palindrome checks, in-place reversal, and the container-with-most-water problem. The fast/slow (same-direction) pattern walks both pointers from the front at different speeds, with a slow "write" cursor trailing a fast "read" cursor: it powers in-place deduplication, moving zeroes to the end, and partitioning.

Because everything is Rust, you will also meet a gotcha that does not exist in Python or C: an index has type usize, which can never be negative, so the everyday "decrement until below zero" loop silently panics with an overflow. We will write loops that are safe by construction, swap elements with slice methods, and finish with a clear account of why two pointers is O(n) time and O(1) extra space.`,
  sections: [
    {
      heading: 'Why two pointers? Killing the nested loop',
      body: `Picture a real task: you have a sorted list of song lengths in seconds, and you want to know whether any *two* songs add up to exactly the length of a commercial break, say 300 seconds. The obvious solution is to try every pair: take the first song, compare it against every other song; take the second song, compare it against every other; and so on. That is two loops nested inside each other.

If the list has **n** songs, the outer loop runs n times and, for each, the inner loop runs about n times, so you do roughly n times n comparisons. We call that **O(n squared)** time, read "order n squared": when n doubles, the work roughly quadruples. The phrase to keep in your head is *"for every item we re-scan all the others."* For 10 songs that is fine; for 100000 songs it is ten billion comparisons and your program hangs.

Two pointers asks a sharper question. The list is **sorted**, and we are throwing that fact away by blindly checking every pair. What if we put one finger on the smallest song and one on the largest, and add just those two? If the sum is too big, the only way to shrink it is to move the right finger left to a smaller song. If the sum is too small, the only way to grow it is to move the left finger right to a bigger song. Either way we *eliminate* a whole range of pairs in one comparison, instead of testing them one by one.

That is the entire idea: keep two indices, and let a property of the data, here sortedness, decide which one to move so that each step rules out work you would otherwise have to do. The result is a single pass, **O(n)** time, "order n", linear, where doubling n only doubles the work.

### Common pitfalls

- Reaching for two pointers on *unsorted* data when the problem needs sortedness. If the input is not sorted and the algorithm relies on order, you must sort first (that costs O(n log n)) or use a different tool such as a HashSet.
- Thinking two pointers always means "front and back". That is only one of the two patterns; the same-direction read/write pattern is just as common and looks completely different.`,
      code: [
        {
          lang: 'text',
          src: `Brute force: every pair (n squared work)

  arr = [ 1, 3, 5, 8, 11 ]   target sum = 13

  pairs tried:  (1,3)(1,5)(1,8)(1,11)
                      (3,5)(3,8)(3,11)
                            (5,8)(5,11)
                                  (8,11) <- found!
  ~ n*n/2 comparisons, ignores that arr is sorted


Two pointers: walk inward (n work)

  index:
          0           4
          v           v
  arr = [ 1, 3, 5, 8, 11 ]
          L           R     1 + 11 = 12 < 13 -> move L right
             L        R     3 + 11 = 14 > 13 -> move R left
             L     R        3 +  8 = 11 < 13 -> move L right
                L  R        5 +  8 = 13 == 13  FOUND
  each step deletes a whole row of the brute-force table`
        },
        {
          lang: 'rust',
          src: `// The shape every two-pointer scan shares:
// two indices, a loop while they have not crossed, and a rule
// inside that decides which pointer to advance.
fn has_pair_with_sum(arr: &[i32], target: i32) -> bool {
    let mut lo = 0;                 // finger on the smallest
    let mut hi = arr.len() - 1;     // finger on the largest (careful if empty!)
    while lo < hi {                 // stop the moment they meet or cross
        let sum = arr[lo] + arr[hi];
        if sum == target {
            return true;            // found a pair
        } else if sum < target {
            lo += 1;                // too small: need a bigger left value
        } else {
            hi -= 1;                // too big: need a smaller right value
        }
    }
    false
}

fn main() {
    let songs = [1, 3, 5, 8, 11];   // sorted!
    assert!(has_pair_with_sum(&songs, 13));   // 5 + 8
    assert!(!has_pair_with_sum(&songs, 100));
}`
        }
      ]
    },
    {
      heading: 'The opposite-ends pattern and the usize underflow trap',
      body: `The first pattern is **opposite ends**: \`lo\` starts at index 0, \`hi\` starts at the last index, and they march toward each other until they meet. The loop condition is almost always \`while lo < hi\`. Each iteration looks at the pair \`(arr[lo], arr[hi])\`, decides something, and then moves at least one pointer inward, which guarantees the gap shrinks every step and the loop ends.

Now the Rust-specific landmine. In Python an index is just an integer and \`hi -= 1\` past zero gives \`-1\`, which Python happily uses to mean "last element". In Rust an array or \`Vec\` index has type **usize**, an *unsigned* integer: it represents a size or position and therefore **can never be negative**. If \`hi\` is 0 and you run \`hi -= 1\`, you do not get \`-1\`; in a debug build the program **panics** with "attempt to subtract with overflow", and in a release build it silently wraps around to a gigantic number like 18446744073709551615, which then crashes the moment you index with it. This single difference trips up almost every first-year coming from another language.

The fix is to make the loop structurally safe so a pointer never decrements below zero. The cleanest way is the \`while lo < hi\` condition itself: you only do \`hi -= 1\` *inside* a loop that has already proven \`lo < hi\`, which means \`hi\` is at least 1, so subtracting one is safe. Never write a loop whose body can decrement a \`usize\` that might be 0. When you genuinely need to step a \`usize\` down and zero is possible, reach for the checked helpers: \`hi.checked_sub(1)\` returns an \`Option\` (\`None\` instead of overflowing), or restructure to count up instead of down.

One more guard: if the slice can be **empty**, \`arr.len() - 1\` itself underflows because \`len()\` is 0. Always handle the empty case first, or compute \`hi\` only after checking the slice is non-empty.

### Common pitfalls

- \`let mut hi = arr.len() - 1;\` panics on an empty slice. Guard with \`if arr.is_empty() { return ...; }\` first.
- Writing \`while lo <= hi\` with \`usize\` pointers: when they meet at equal indices and you then do \`hi -= 1\` at \`hi == 0\`, you underflow. Prefer \`while lo < hi\` for the inward-walking pattern.
- Doing \`hi -= 1\` outside the safety of the loop condition. Only decrement a \`usize\` after you have proven it is greater than 0.`,
      code: [
        {
          lang: 'text',
          src: `usize cannot go below 0  (64-bit machine)

  Python:   hi = 0;  hi -= 1   ->   -1   (means "last", quietly)
  Rust(dbg):hi = 0;  hi -= 1   ->   PANIC: subtract with overflow
  Rust(rel):hi = 0;  hi -= 1   ->   18446744073709551615  (wrap!)
                                     then arr[hi] -> instant crash

  Safe template: the loop guard itself proves hi >= 1

       while lo < hi {           lo --->        <--- hi
           ...                  [ a, b, c, d, e, f ]
           hi -= 1;   // safe: lo < hi means hi was at least 1
       }`
        },
        {
          lang: 'rust',
          src: `// Reverse a slice in place: the canonical opposite-ends loop.
// Real-world picture: an edit buffer where you flip a selection.
fn reverse_in_place<T>(v: &mut [T]) {
    if v.is_empty() { return; }     // guard: len()-1 would underflow
    let mut lo = 0;
    let mut hi = v.len() - 1;
    while lo < hi {                 // lo < hi proves hi >= 1, so hi-=1 is safe
        v.swap(lo, hi);             // swap without manual indexing tricks
        lo += 1;
        hi -= 1;                    // safe ONLY because of the loop guard
    }
}

fn main() {
    let mut data = vec![1, 2, 3, 4, 5];
    reverse_in_place(&mut data);
    assert_eq!(data, vec![5, 4, 3, 2, 1]);

    // checked_sub avoids any overflow when you must step a usize down:
    let hi: usize = 0;
    assert_eq!(hi.checked_sub(1), None);   // None instead of a panic
}`
        }
      ]
    },
    {
      heading: 'Pair-sum and palindrome: reading toward the middle',
      anim: 'two-pointers',
      body: `Two opposite-ends problems show up again and again, so let us nail both.

**Pair-sum in a sorted array.** Given a sorted slice and a target, find two values that add to the target. We saw the brute force is O(n squared). The two-pointer version, from section 1, is O(n) time and O(1) space, but it has a precondition you must respect: the array *must be sorted*, because the whole "move left to grow, move right to shrink" logic depends on smaller values being on the left. If the input is unsorted, either sort it first (O(n log n)) or, if you only need existence and not the indices, scan once with a \`HashSet\` of "values I still need". Knowing which trade-off applies is half of using the technique well.

**Palindrome check.** A *palindrome* is a sequence that reads the same forward and backward, like "racecar" or the digits 1-2-3-2-1. The brute-force instinct is to build the reverse and compare, which costs O(n) extra memory for the reversed copy. Two pointers does it with no copy: put \`lo\` at the front and \`hi\` at the back, and as long as the two characters match, step inward; the instant they differ, it is not a palindrome. If the pointers meet in the middle without a mismatch, it is. This is exactly how you would check whether a word reads the same both ways by covering it with two fingers and moving inward.

A subtlety for strings: Rust strings are UTF-8, so a single human character can be several bytes. For plain ASCII you can compare bytes via \`as_bytes()\`, which is fast and index-friendly. For real Unicode, collect the \`chars()\` into a \`Vec<char>\` first so each pointer step moves by one *character*, not one byte. We show the safe byte version for ASCII below.

### Common pitfalls

- Applying the sorted pair-sum logic to an unsorted slice. It will return wrong answers, not a crash, which is worse because it is silent. Sort first or switch to a HashSet.
- Indexing a UTF-8 \`&str\` by byte and assuming one index equals one character. Use \`as_bytes()\` only when the input is known ASCII; otherwise build a \`Vec<char>\`.
- Off-by-one in the loop bound. \`while lo < hi\` correctly leaves the exact middle element of an odd-length sequence unchecked, which is right: a single middle character is always a mirror of itself.`,
      code: [
        {
          lang: 'text',
          src: `Palindrome check:  "racecar"

          0                 6
          r  a  c  e  c  a  r
          L                 R   r == r  ok, step in
             L           R      a == a  ok, step in
                L     R         c == c  ok, step in
                   ^            lo == hi (3): loop stops
                   e            middle never needs a check

  no mismatch ever -> PALINDROME


Not a palindrome:  "rust"

          r  u  s  t
          L        R            r != t  -> STOP, return false`
        },
        {
          lang: 'rust',
          src: `// ASCII palindrome with zero extra allocation.
fn is_palindrome_ascii(s: &str) -> bool {
    let b = s.as_bytes();           // byte view: ok for ASCII input
    if b.is_empty() { return true; }
    let mut lo = 0;
    let mut hi = b.len() - 1;
    while lo < hi {
        if b[lo] != b[hi] {
            return false;           // mismatch: bail out at once
        }
        lo += 1;
        hi -= 1;                    // safe: guarded by lo < hi
    }
    true                            // pointers met with no mismatch
}

// Sorted pair-sum returning the matching indices, not just a bool.
fn two_sum_sorted(arr: &[i32], target: i32) -> Option<(usize, usize)> {
    if arr.is_empty() { return None; }
    let (mut lo, mut hi) = (0, arr.len() - 1);
    while lo < hi {
        let sum = arr[lo] + arr[hi];
        match sum.cmp(&target) {
            std::cmp::Ordering::Equal => return Some((lo, hi)),
            std::cmp::Ordering::Less => lo += 1,    // grow the sum
            std::cmp::Ordering::Greater => hi -= 1, // shrink the sum
        }
    }
    None
}

fn main() {
    assert!(is_palindrome_ascii("racecar"));
    assert!(!is_palindrome_ascii("rust"));
    assert_eq!(two_sum_sorted(&[1, 3, 5, 8, 11], 13), Some((2, 3)));
}`
        }
      ]
    },
    {
      heading: 'Container with most water: a greedy two-pointer',
      body: `This problem is where two pointers stops feeling like a trick and starts feeling like a *method*. You are given an array of heights, where \`height[i]\` is the height of a vertical wall at position \`i\`. Picking two walls forms a container; the water it holds is the rectangle between them. Its area is the **width** (distance between the two indices) times the **height of the shorter wall** (water spills over the lower one). The goal: find the maximum area over all pairs of walls.

Brute force tries every pair of walls and computes each area: O(n squared), the same "re-scan all the others" cost as before. Two pointers solves it in O(n), but the reasoning is more interesting than pure sortedness, it is a **greedy** argument, meaning at each step we make the locally best move and can prove it never loses the global best.

Start \`lo\` at the far left and \`hi\` at the far right: that is the *widest* possible container. Its area is limited by the shorter of the two walls. Here is the key insight: if we move the *taller* wall inward, the width shrinks and the height is still capped by the same shorter wall, so the area can only get worse or stay equal, never better. The only move that has any hope of improving is to move the **shorter** wall inward, because that is the wall holding us back. So each step we advance whichever pointer points at the shorter wall, recording the best area as we go. We never need to test the pairs we skipped, because we proved none of them can beat what we keep.

That phrase, "we proved the skipped options cannot win," is the heart of every efficient two-pointer algorithm. It is why the single pass is *correct*, not just fast.

### Common pitfalls

- Moving the taller wall, or moving both, "to be safe". Moving the taller wall can step over the true optimum; the correct rule is always move the shorter wall.
- Forgetting that area uses the *minimum* of the two heights, not their average or sum. Water rises only to the shorter rim.
- Recomputing width as \`hi - lo\` when these are \`usize\`: since \`lo < hi\` in the loop, the subtraction is safe, but if you ever loop with \`lo <= hi\` you reopen the underflow door.`,
      code: [
        {
          lang: 'text',
          src: `heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]   indices 0..8

  start widest:   L at 0 (h=1),  R at 8 (h=7)
  area = min(1,7) * (8-0) = 1 * 8 = 8
  left wall (1) is shorter -> move L

      idx 1(h=8) .. idx 8(h=7): area = min(8,7)*7 = 49   <-- best
      right(7) shorter -> move R ...

  ascii of the widest container (height = shorter wall = 1):

    8 |  #              #
    7 |  #     #        #   #
    6 |  # #   #        #   #
      |  ...
    1 |~~############################~~  water capped at height 1
      +--L------------------------R--
       only raising the SHORT wall (L) can ever help`
        },
        {
          lang: 'rust',
          src: `// Maximum water a pair of walls can hold. O(n) time, O(1) space.
fn max_area(height: &[i32]) -> i32 {
    if height.len() < 2 { return 0; }
    let mut lo = 0;
    let mut hi = height.len() - 1;
    let mut best = 0;
    while lo < hi {
        let width = (hi - lo) as i32;           // safe: lo < hi
        let h = height[lo].min(height[hi]);     // water rises to the shorter
        best = best.max(width * h);             // record running maximum
        // Greedy move: advance the pointer at the SHORTER wall.
        if height[lo] < height[hi] {
            lo += 1;
        } else {
            hi -= 1;                            // safe: guarded by lo < hi
        }
    }
    best
}

fn main() {
    let h = [1, 8, 6, 2, 5, 4, 8, 3, 7];
    assert_eq!(max_area(&h), 49);   // walls at index 1 (8) and index 8 (7)
}`
        }
      ]
    },
    {
      heading: 'Fast/slow: the read/write cursor for in-place editing',
      body: `The second great pattern walks both pointers in the **same direction**, from the front, at different speeds. The mental model that makes it click is a **read cursor** and a **write cursor**, exactly like compacting a log file in place: \`read\` scans every line of the buffer; \`write\` marks where the next line you want to *keep* should go. Lines you discard are simply skipped by \`read\` without advancing \`write\`, so the kept lines pile up tightly at the front and the buffer is rewritten with no second array.

The canonical example is **removing duplicates from a sorted Vec, in place**. Because the Vec is sorted, every duplicate of a value sits right next to it. The slow pointer \`write\` always points just past the last *unique* value we have committed. The fast pointer \`read\` scans forward; whenever \`arr[read]\` differs from the last kept value \`arr[write - 1]\`, it is a new unique value, so we copy it to \`arr[write]\` and bump \`write\`. When \`read\` finishes, the first \`write\` elements are the deduplicated answer.

The reason this is O(n) and not O(n squared) is that *each pointer only ever moves forward*. \`read\` visits every index once; \`write\` advances only on new values; neither ever backs up. Two pointers that each travel the array at most once give you a linear total no matter how the work is split between them. And it is O(1) extra space because all the rewriting happens inside the original buffer, no second Vec is allocated.

A vocabulary word that earns its keep here: an **invariant** is a statement that stays true at every step of the loop. Our invariant is *"everything before \`write\` is the unique, compacted prefix so far."* Naming the invariant turns a fiddly index dance into something you can reason about: each iteration must preserve it, and when the loop ends the invariant is exactly the answer.

### Common pitfalls

- Trying to dedup an *unsorted* Vec with this method. It only removes *adjacent* duplicates; sort first, or use a \`HashSet\` to dedup by value.
- Comparing \`arr[read]\` to \`arr[read - 1]\` instead of to \`arr[write - 1]\`. Compare against the last *kept* value, not the previous scanned value, or compaction breaks.
- Forgetting to shrink the Vec afterward. The unique values fill \`0..write\`; call \`v.truncate(write)\` so the length reflects reality. Rust's own \`Vec::dedup\` does this for you.`,
      code: [
        {
          lang: 'text',
          src: `Dedup sorted Vec in place. W = write (slow), R = read (fast)

  start:   [1, 1, 2, 3, 3, 3, 4]
               W              W=1: arr[0] is always kept
               R              R=1: read starts at index 1

  R=1 arr[1]=1 == kept arr[0]=1 -> dup, skip, W stays
       [1, 1, 2, 3, 3, 3, 4]   W=1
  R=2 arr[2]=2 != kept arr[0]=1 -> new! write to arr[1], W->2
       [1, 2, 2, 3, 3, 3, 4]   W=2
  R=3 arr[3]=3 != kept arr[1]=2 -> new! write to arr[2], W->3
       [1, 2, 3, 3, 3, 3, 4]   W=3
  R=4 arr[4]=3 == kept arr[2]=3 -> dup, skip
  R=5 arr[5]=3 == kept arr[2]=3 -> dup, skip
  R=6 arr[6]=4 != kept arr[2]=3 -> new! write to arr[3], W->4
       [1, 2, 3, 4, 3, 3, 4]   W=4

  answer = first W=4 elements: [1, 2, 3, 4]  (truncate the tail)`
        },
        {
          lang: 'rust',
          src: `// Remove adjacent duplicates from a sorted Vec, in place.
// Invariant: v[0..write] is the unique compacted prefix.
fn dedup_sorted(v: &mut Vec<i32>) -> usize {
    if v.is_empty() { return 0; }
    let mut write = 1;              // v[0] is always kept
    for read in 1..v.len() {        // read sweeps the whole buffer once
        if v[read] != v[write - 1] {    // compare to last KEPT value
            v[write] = v[read];     // commit a new unique value
            write += 1;             // advance the slow cursor
        }
    }
    v.truncate(write);              // drop the now-stale tail
    write
}

fn main() {
    let mut data = vec![1, 1, 2, 3, 3, 3, 4];
    let n = dedup_sorted(&mut data);
    assert_eq!(n, 4);
    assert_eq!(data, vec![1, 2, 3, 4]);

    // The std library does exactly this for you:
    let mut d2 = vec![1, 1, 2, 3, 3, 3, 4];
    d2.dedup();                     // O(n), keeps first of each run
    assert_eq!(d2, vec![1, 2, 3, 4]);
}`
        }
      ]
    },
    {
      heading: 'Move zeroes and partition: same pattern, new payoff',
      body: `Once you see the read/write cursor, a whole family of problems falls to it.

**Move zeroes to the end.** Given a Vec like \`[0, 1, 0, 3, 12]\`, push every zero to the back while keeping the non-zeroes in their original order, in place. The naive approach builds a new Vec of non-zeroes and pads with zeroes: O(n) time but O(n) extra space. The two-pointer version: \`write\` marks where the next non-zero should land; \`read\` scans; on each non-zero, swap it into \`arr[write]\` and bump \`write\`. After the sweep, every position from \`write\` onward is automatically a zero, because we only ever moved non-zeroes forward. O(n) time, O(1) space, and order is preserved.

**Partition.** Partitioning rearranges a slice so all elements satisfying some test come before all that fail it, the core step inside quicksort. The same read/write idea works: \`write\` is the boundary of the "passing" region; \`read\` scans; whenever \`arr[read]\` passes the predicate, swap it to \`arr[write]\` and advance \`write\`. When done, \`0..write\` is the passing group and \`write..\` is the failing group. This is sometimes called the **Lomuto** scheme.

Notice both are the *identical* skeleton as dedup: a slow write cursor, a fast read cursor, each moving forward only, a swap or copy when a condition holds. That reuse is the real lesson, learn the read/write shape once and you recognize it everywhere. The difference between these problems is only the *condition* that decides whether \`read\`'s current element gets committed.

In Rust, prefer \`slice::swap(i, j)\` over a hand-written temporary; it is clear, panic-checked on bad indices, and works for any \`T\` including non-Copy types because it never has to read a value out and leave a hole. The standard library even gives you \`Vec::retain\` and \`slice::iter().partition()\` for some of these, but writing the loop yourself once cements the pattern.

### Common pitfalls

- In move-zeroes, *copying* instead of *swapping* can duplicate a value and lose another. Swapping keeps the array a permutation of the original.
- Assuming partition keeps the relative order of each group; the Lomuto swap-based partition is **not** stable. If you need stable order, use a different (often O(n) extra space) method.
- Re-deriving the loop from scratch each time. Recognize it is the same read/write skeleton and only the predicate changes.`,
      code: [
        {
          lang: 'text',
          src: `Move zeroes: swap non-zeroes forward. W=write, R=read

  [0, 1, 0, 3, 12]
   W
   R  arr[0]=0 -> zero, skip (W stays 0)
   R=1 arr[1]=1 -> non-zero: swap(W=0,R=1), W->1
  [1, 0, 0, 3, 12]
   R=2 arr[2]=0 -> zero, skip
   R=3 arr[3]=3 -> non-zero: swap(W=1,R=3), W->2
  [1, 3, 0, 0, 12]
   R=4 arr[4]=12 -> non-zero: swap(W=2,R=4), W->3
  [1, 3, 12, 0, 0]   <- zeroes fell to the end, order preserved


Partition by predicate (< pivot=5):  [7,2,9,1,5,3]
  keep "< 5" at the front; W is the boundary
  result: [2,1,3 | 7,5,9]   (left passes, right fails; W=3)`
        },
        {
          lang: 'rust',
          src: `// Move all zeroes to the end, preserving the order of non-zeroes.
fn move_zeroes(v: &mut [i32]) {
    let mut write = 0;
    for read in 0..v.len() {
        if v[read] != 0 {
            v.swap(write, read);    // bring the non-zero to the front block
            write += 1;
        }
    }
}

// Lomuto-style partition: predicate-true elements move to the front.
// Returns the index where the false group begins.
fn partition<T, F: Fn(&T) -> bool>(v: &mut [T], pred: F) -> usize {
    let mut write = 0;
    for read in 0..v.len() {
        if pred(&v[read]) {
            v.swap(write, read);
            write += 1;
        }
    }
    write                            // 0..write passes, write.. fails
}

fn main() {
    let mut z = vec![0, 1, 0, 3, 12];
    move_zeroes(&mut z);
    assert_eq!(z, vec![1, 3, 12, 0, 0]);

    let mut p = vec![7, 2, 9, 1, 5, 3];
    let split = partition(&mut p, |&x| x < 5);
    assert!(p[..split].iter().all(|&x| x < 5));   // left group all < 5
    assert!(p[split..].iter().all(|&x| x >= 5));  // right group all >= 5
}`
        }
      ]
    },
    {
      heading: 'Merging two sorted sequences with two pointers',
      body: `Two pointers is not limited to a single array. A close cousin walks **two separate sorted inputs** at once, the merge step at the heart of merge sort and of combining two already-sorted playlists into one ordered list. Here \`i\` indexes the first slice and \`j\` the second; both start at 0 and only ever move forward.

The rule is delightfully simple: compare \`a[i]\` and \`b[j]\`, take the smaller, and advance only the pointer you took from. Because both inputs are sorted, the smaller of the two fronts is the smallest element not yet placed, so appending it keeps the output sorted. When one input runs dry, copy the rest of the other straight across, it is already sorted and already larger than everything emitted. Each element of each input is looked at exactly once, so merging two lists of sizes m and n is **O(m + n)** time. It does use O(m + n) *output* space, since the merged result is a new list; this is the one common two-pointer routine that is not in-place, and that is expected, you cannot interleave two arrays into one without somewhere to put the answer.

This is the bridge to chapter material on sorting: the entire efficiency of merge sort rests on this linear merge. It is worth tracing once by hand so the "take the smaller front, advance that side" rhythm becomes automatic.

### Common pitfalls

- Forgetting the "drain the leftovers" step. After the main loop, one input usually has elements remaining; you must copy them, or the merge loses data.
- Advancing both pointers after a comparison. Advance only the side you consumed, or you skip an element.
- Using \`>\` instead of \`<=\` when you care about *stability* (keeping equal elements in their original relative order). Taking from the left on a tie keeps the merge stable.`,
      code: [
        {
          lang: 'text',
          src: `Merge two sorted playlists.  a=[1,4,7]  b=[2,3,8]

  i=0 j=0   a[0]=1 <= b[0]=2  take 1, i->1     out=[1]
  i=1 j=0   a[1]=4 >  b[0]=2  take 2, j->1     out=[1,2]
  i=1 j=1   a[1]=4 >  b[1]=3  take 3, j->2     out=[1,2,3]
  i=1 j=2   a[1]=4 <= b[2]=8  take 4, i->2     out=[1,2,3,4]
  i=2 j=2   a[2]=7 <= b[2]=8  take 7, i->3     out=[1,2,3,4,7]
  i=3  -> a is empty: drain b's tail [8]        out=[1,2,3,4,7,8]

       i never goes back, j never goes back -> O(m+n)`
        },
        {
          lang: 'rust',
          src: `// Merge two sorted slices into a new sorted Vec. O(m + n) time.
fn merge_sorted(a: &[i32], b: &[i32]) -> Vec<i32> {
    let mut out = Vec::with_capacity(a.len() + b.len());
    let (mut i, mut j) = (0, 0);
    while i < a.len() && j < b.len() {
        if a[i] <= b[j] {           // <= keeps equal elements stable
            out.push(a[i]);
            i += 1;                 // advance ONLY the consumed side
        } else {
            out.push(b[j]);
            j += 1;
        }
    }
    out.extend_from_slice(&a[i..]); // drain whichever tail remains
    out.extend_from_slice(&b[j..]); // (exactly one of these is non-empty)
    out
}

fn main() {
    let merged = merge_sorted(&[1, 4, 7], &[2, 3, 8]);
    assert_eq!(merged, vec![1, 2, 3, 4, 7, 8]);
}`
        }
      ]
    },
    {
      heading: 'Why it is O(n) and O(1), plus Rust idioms to lean on',
      body: `Let us make the cost claims precise, because "it feels fast" is not an analysis.

**Time is O(n).** In every two-pointer routine here, *each pointer moves only in one direction and never revisits an index.* In the opposite-ends pattern, \`lo\` only rises and \`hi\` only falls, and they stop when they cross, so together they take at most \`n\` steps. In the fast/slow pattern, \`read\` advances exactly \`n\` times and \`write\` advances a subset of those, again at most \`n\` total. The work inside each step is constant (a compare, maybe a swap), so the whole thing is **a constant amount of work times n steps = O(n)**, linear. Contrast the brute force's two nested loops, where the inner one restarts \`n\` times: O(n squared).

**Extra space is O(1).** "Extra" or *auxiliary* space means memory beyond the input itself. The in-place routines (reverse, palindrome, dedup, move-zeroes, partition) allocate nothing that grows with \`n\`, just a couple of \`usize\` indices, so auxiliary space is **constant, O(1)**. The merge is the lone exception: its output is a new list of size m + n, which is unavoidable when the answer itself is a new collection.

Two Rust habits make these algorithms clean and safe. First, use \`slice::swap(i, j)\` for every exchange; it sidesteps the borrow checker's objection to taking two mutable references into the same slice and works for non-\`Copy\` types. Second, prefer iterator-based loops, \`for read in 0..v.len()\`, or \`while lo < hi\`, over arithmetic that can underflow a \`usize\`; let the loop bound *prove* your decrements are safe. When you must step a \`usize\` down where zero is reachable, \`checked_sub(1)\` returns an \`Option\` so a bug surfaces as a clean \`None\` instead of a wrap-around crash.

### Common pitfalls

- Claiming O(1) space while secretly cloning the input or collecting into a temporary \`Vec\`. If you allocate something that grows with \`n\`, it is not O(1) auxiliary space.
- Confusing O(n) *passes* with O(n) *total*. Two pointers makes one combined pass; two independent O(n) loops back to back are still O(n), but a loop that restarts inside another loop is O(n squared).
- Reaching for unsafe indexing or pointer arithmetic to "go faster". Safe Rust with \`swap\` and guarded loops already compiles to the same tight code; the borrow checker is not the obstacle here.`,
      code: [
        {
          lang: 'text',
          src: `Cost summary (n = input length)

  pattern            time      extra space   in place?
  ----------------   -------   -----------   ---------
  reverse            O(n)      O(1)          yes
  palindrome check   O(n)      O(1)          yes
  pair-sum (sorted)  O(n)      O(1)          yes
  container water    O(n)      O(1)          yes
  dedup sorted       O(n)      O(1)          yes
  move zeroes        O(n)      O(1)          yes
  partition          O(n)      O(1)          yes
  merge two sorted   O(m+n)    O(m+n) out    no (new list)

  one pass, pointers never back up  =>  linear time`
        },
        {
          lang: 'rust',
          src: `fn main() {
    // swap: the idiomatic exchange, borrow-checker friendly, any T.
    let mut v = vec!['a', 'b', 'c', 'd'];
    v.swap(0, 3);                       // no temp variable needed
    assert_eq!(v, vec!['d', 'b', 'c', 'a']);

    // Step a usize down safely when zero is possible:
    let mut hi: usize = 2;
    while let Some(prev) = hi.checked_sub(1) {
        // ... use prev ...
        hi = prev;                      // never wraps below zero
    }
    assert_eq!(hi, 0);

    // Two pointers as one linear sweep, the guard proves hi-=1 is safe:
    let data = [3, 1, 4, 1, 5, 9, 2, 6];
    let (mut lo, mut hi) = (0, data.len() - 1);
    let mut steps = 0;
    while lo < hi { lo += 1; hi -= 1; steps += 1; }
    assert_eq!(steps, data.len() / 2);  // ~ n/2 steps total -> O(n)
}`
        }
      ]
    }
  ],
  takeaways: [
    'Two pointers replaces a nested O(n squared) loop with a single O(n) sweep by letting the data structure decide which pointer to move.',
    'Opposite-ends pattern: lo at the front, hi at the back, walk inward with while lo < hi; powers pair-sum, palindrome, reverse, and container-with-most-water.',
    'Fast/slow pattern: a slow write cursor trails a fast read cursor from the front; powers dedup, move-zeroes, and partition in place.',
    'usize indices can never go negative: hi -= 1 at hi == 0 panics in debug and wraps to a huge number in release; let the loop guard prove decrements are safe.',
    'Guard empty slices before computing len() - 1, and use checked_sub(1) when you must step a usize down and zero is reachable.',
    'Sorted-array two-pointer logic is only correct on sorted input; sort first (O(n log n)) or use a HashSet when the data is unsorted.',
    'Container-with-most-water is a greedy two-pointer: always move the shorter wall, because moving the taller one can never improve the area.',
    'Use slice::swap(i, j) for in-place exchanges; it is clear, panic-checked, and works for non-Copy types without fighting the borrow checker.',
    'Two pointers is O(n) time because each pointer moves one direction and never revisits an index, and O(1) extra space because the work happens in place.',
    'Merging two sorted sequences is the same idea across two inputs: take the smaller front, advance only that side, then drain the leftovers, O(m + n).'
  ],
  cheatsheet: [
    { label: 'Opposite-ends loop', value: 'let (mut lo, mut hi) = (0, v.len()-1); while lo < hi { ... }' },
    { label: 'Fast/slow loop', value: 'let mut write = 0; for read in 0..v.len() { ... }' },
    { label: 'v.swap(i, j)', value: 'In-place exchange, any T, borrow-checker safe, panics on OOB' },
    { label: 'hi.checked_sub(1)', value: 'Option<usize>: None instead of underflow panic/wrap' },
    { label: 'v.is_empty()', value: 'Guard before v.len() - 1 to avoid usize underflow' },
    { label: 'v.dedup()', value: 'O(n) remove adjacent duplicates in place (sorted input)' },
    { label: 'v.truncate(write)', value: 'Shrink Vec to the compacted prefix after a write cursor' },
    { label: 's.as_bytes()', value: 'Byte view for ASCII two-pointer scans (not Unicode-safe)' },
    { label: 's.chars().collect::<Vec<_>>()', value: 'Per-character pointers for real Unicode strings' },
    { label: 'a[i].min(a[j]) / .max', value: 'Shorter wall / running best in container problems' },
    { label: 'Pair-sum (sorted)', value: 'O(n) time, O(1) space; move lo up if sum too small, hi down if too big' },
    { label: 'Merge two sorted', value: 'O(m+n) time, O(m+n) output; take smaller front, advance that side' },
    { label: 'Partition (Lomuto)', value: 'O(n), swap passing elems forward; NOT stable order' },
    { label: 'Why O(n)/O(1)', value: 'Pointers move one way, never revisit; in-place means no growth with n' }
  ]
}

export default note
