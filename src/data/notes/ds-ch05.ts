import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-ds-05',
  track: 'dsa',
  chapter: 5,
  title: 'Binary Search',
  summary: `Binary search is the first algorithm where being clever beats being fast, and it is the purest demonstration of why *sorted* data is worth the cost of sorting. The idea is the one you already use when you look a word up in a dictionary: you open to the middle, decide whether your word is to the left or to the right, and throw away the half that cannot contain it. Each comparison deletes half of what remains, so a billion-entry list is settled in about thirty comparisons instead of a billion.

This chapter builds that intuition carefully, because binary search is famous for being deceptively hard to write correctly: a single off-by-one in the bounds, or letting an index underflow because Rust's usize cannot go negative, turns a thirty-comparison search into an infinite loop or a panic. We start with the halving idea and the lo/hi/mid loop and its invariant, then graduate to lower-bound and upper-bound queries and Rust's slice::binary_search and partition_point.

The real payoff is the pattern called *binary search on the answer*: when the thing you are searching for is not in an array at all but is the smallest value that satisfies some monotonic yes-or-no test, you can binary search the space of possible answers. We use it to autoscale to the smallest server count that handles a load, to find the minimum ship capacity to deliver packages in D days, and to compute how fast Koko must eat her bananas. By the end you will recognize this shape in problems that do not look like search problems at all.`,
  sections: [
    {
      heading: 'The halving idea: why sorted data gives O(log n)',
      body: `Imagine a phone book, or a paper dictionary. To find *raptor* you do not start at page one and read every word; you flip roughly to the middle, see that you have landed on *meadow*, and instantly know *raptor* is in the second half, so the entire first half is dead to you. You repeat on what is left. That single move, **throw away half the remaining possibilities with one comparison**, is the whole algorithm.

This only works because the data is **sorted**: ordering is what lets one comparison rule out an entire side. In an unsorted pile, seeing one entry tells you nothing about where the others are, so you are stuck checking them one by one, which is **linear search**: in the worst case you look at every one of the *n* items. We say linear search is *O(n)*, meaning the work grows in direct proportion to the number of items; double the data, double the work.

Binary search instead asks: how many times can I cut *n* in half before nothing is left? That count is the base-2 logarithm of *n*, written *log n*. For a billion items it is about 30, for a trillion about 40. That is the meaning of *O(log n)*: the work grows like the logarithm of the input, so the list can grow astronomically while the number of steps barely budges. This is why *git bisect* can pinpoint the one commit that broke a build among thousands by testing only a dozen or so: every test it runs halves the range of suspect commits.

The catch, and it is a real one: sorting the data first costs *O(n log n)*. Binary search pays off when you search the same sorted data many times, or when the data arrives already sorted (a sorted log file, an index, a sorted database column). For a single one-off lookup in unsorted data, plain linear search wins, because sorting just to search once is wasted effort.

### Common pitfalls

- Forgetting the precondition. Binary search is *only* correct on sorted data. Running it on an unsorted slice gives wrong answers silently, with no panic and no error, the worst kind of bug.
- Assuming O(log n) is always best. If you search once and never again, the O(n log n) sort plus O(log n) search loses to a single O(n) scan. Measure how many queries you actually make.`,
      code: [
        {
          lang: 'text',
          src: `Linear vs binary search for the value 23 in a sorted array.

LINEAR: check every cell from the left until found (here: 7 checks).

  index:  0   1   2   3   4   5   6   7   8
        +---+---+---+---+---+---+---+---+---+
        | 3 | 6 | 9 |12 |15 |18 |21 |23 |30 |
        +---+---+---+---+---+---+---+---+---+
          ^   ^   ^   ^   ^   ^   ^   ^
          1   2   3   4   5   6   7   8  ... up to n checks

BINARY: halve the live range each step (here: 3 checks).

  step 1   [.............mid............]   look at 15 < 23
           keep RIGHT half ------------->
  step 2                 [...mid...]          23 == 23  done!

How many halvings to empty a list of size n?  log2(n).
   n =          1,000  ->  ~10 steps
   n =      1,000,000  ->  ~20 steps
   n =  1,000,000,000  ->  ~30 steps`,
        },
        {
          lang: 'rust',
          src: `// The cost difference made concrete. Both find the index, but count work.
fn linear_search(xs: &[i32], target: i32) -> Option<usize> {
    for (i, &x) in xs.iter().enumerate() {
        if x == target {
            return Some(i); // worst case: we touch all n items -> O(n)
        }
    }
    None
}

fn main() {
    let data = [3, 6, 9, 12, 15, 18, 21, 23, 30];
    // For a one-off search on already-sorted data, binary search wins:
    // ~log2(9) ~= 4 comparisons instead of up to 9.
    assert_eq!(linear_search(&data, 23), Some(7));
    println!("found at {:?}", linear_search(&data, 23));
}`,
        },
      ],
    },
    {
      heading: 'The lo/hi/mid loop and its invariant',
      anim: 'binary-search',
      body: `Here is the classic exact-match binary search, the one you must be able to write from memory. We track a live window of the array with two indices: **lo** (the first index that might still hold the target) and **hi** (one past the last index that might still hold it). We look at the middle, **mid**, and compare.

The single most important idea for getting binary search right is the **invariant**: a statement that is true before the loop, stays true after every iteration, and therefore is true when the loop ends. Here the invariant is: *if the target is anywhere in the array, it lies in the half-open range lo..hi.* Read that as "from lo up to but not including hi." Every branch of the loop must preserve it:

- If the middle value is too small, the target (if present) is strictly to the right, so we move **lo = mid + 1**. Everything at mid and below is now excluded.
- If the middle value is too big, the target is strictly to the left, so we move **hi = mid** (not mid - 1, because hi is exclusive, so mid itself is already outside the new window).
- If the middle value equals the target, we are done.

The loop runs **while lo < hi**, that is, while the window is non-empty. When lo equals hi the window is empty and the target is not present. Because each step makes the window at least one element smaller and usually halves it, the loop is guaranteed to terminate, and it does so in *O(log n)* comparisons using *O(1)* extra memory.

This is exactly a **number-guessing game**: I think of a number from 1 to 100, you guess 50, I say "higher," you have just deleted 1 through 50. Lo and hi are the bounds of the numbers still in play; mid is your guess.

### Common pitfalls

- The window-update asymmetry trips everyone: lo jumps to **mid + 1** (mid is ruled out and lo is inclusive) but hi drops to **mid** (mid is ruled out and hi is exclusive). Mixing these up causes either skipped elements or an infinite loop.
- Choosing the wrong loop condition. With an exclusive hi the condition is **lo < hi**. Writing lo <= hi with an exclusive hi reads one past the end. Decide your hi convention once and keep it consistent throughout the function.`,
      code: [
        {
          lang: 'text',
          src: `TRACE: search for 21 in [3, 6, 9, 12, 15, 18, 21, 23, 30]  (n = 9)
Invariant: if 21 is present, it is in the window lo..hi (hi exclusive).

 frame 1   lo=0                    hi=9        mid = 0+(9-0)/2 = 4
           [ 3  6  9 12 [15] 18 21 23 30 )
                         ^mid    a[4]=15 < 21  ->  lo = mid+1 = 5

 frame 2              lo=5         hi=9         mid = 5+(9-5)/2 = 7
           ( . . . . . 18 21 [23] 30 )
                              ^mid   a[7]=23 > 21  ->  hi = mid = 7

 frame 3              lo=5    hi=7              mid = 5+(7-5)/2 = 6
           ( . . . . . 18 [21] . . )
                           ^mid    a[6]=21 == 21  ->  FOUND at index 6

Window shrank  9 -> 4 -> 2 -> hit.  Total: 3 comparisons.`,
        },
        {
          lang: 'rust',
          src: `// Exact-match binary search. Returns the index if present, else None.
// Precondition: xs is sorted in ascending order.
fn binary_search(xs: &[i32], target: i32) -> Option<usize> {
    let mut lo = 0;
    let mut hi = xs.len(); // hi is EXCLUSIVE: the window is lo..hi
    while lo < hi {
        // Invariant: if target is in xs, its index is within lo..hi.
        let mid = lo + (hi - lo) / 2; // overflow-safe midpoint (next section)
        if xs[mid] < target {
            lo = mid + 1;  // target is strictly to the right; drop mid and left
        } else if xs[mid] > target {
            hi = mid;      // target is strictly to the left; hi is exclusive
        } else {
            return Some(mid); // direct hit
        }
    }
    None // window empty: target absent
}

fn main() {
    let data = [3, 6, 9, 12, 15, 18, 21, 23, 30];
    assert_eq!(binary_search(&data, 21), Some(6));
    assert_eq!(binary_search(&data, 22), None);
    assert_eq!(binary_search(&data, 3),  Some(0)); // first element
    assert_eq!(binary_search(&data, 30), Some(8)); // last element
    println!("all binary_search assertions passed");
}`,
        },
      ],
    },
    {
      heading: 'Computing mid safely: overflow and the usize trap',
      body: `The obvious way to find the middle is **mid = (lo + hi) / 2**. It is also a famous bug. If lo and hi are both large, their sum can exceed the maximum value the integer type can hold and **overflow**. In a 32-bit world this hit real production code, including a binary search in the Java standard library that went unnoticed for years. In Rust the consequence is even sharper: in a debug build an overflowing add **panics** and crashes your program; in a release build it silently **wraps around** to a small or negative-looking number, computing a nonsense mid.

The fix is to compute the *offset* from lo instead of the sum: **mid = lo + (hi - lo) / 2**. Since hi is never smaller than lo inside the loop, hi - lo is a safe, smaller number, and adding half of it to lo lands in the same place without ever forming the dangerous large sum. Memorize this exact expression; it is the canonical safe midpoint.

Rust adds a second, Rust-specific trap. Indices are of type **usize**, an **unsigned** integer that *cannot be negative*. In C you might write hi = mid - 1, and if mid is 0 you get -1, which at least loops back to a sentinel. In Rust, usize 0 minus 1 does not become -1; it **underflows**. In debug it panics with "attempt to subtract with overflow," and in release it wraps to a gigantic number near 18 quintillion, so your next array index panics with an out-of-bounds. This is why the exclusive-hi style in the previous section is so valuable: it sets hi = mid, never hi = mid - 1, sidestepping the subtraction entirely. When you do need mid - 1 (some variants do), guard it so mid is never 0 at that point, or use checked_sub.

### Common pitfalls

- Writing mid = (lo + hi) / 2. Correct for small inputs, a latent overflow bug for large ones. Always write lo + (hi - lo) / 2.
- Doing hi = mid - 1 when mid can be 0. usize underflows to a huge number; the very next indexing operation panics. Prefer the exclusive-hi convention, or use lo..=hi inclusive style with a separate found flag and careful guards.
- Assuming Rust's panic "saves" you. It saves you in debug only. A release build wraps silently, so the algorithm is wrong but quiet, which is harder to catch.`,
      code: [
        {
          lang: 'text',
          src: `WHY (lo + hi) / 2 IS DANGEROUS  (imagine an 8-bit usize, max = 255)

   lo = 200,  hi = 100  is impossible inside the loop, but late on:
   lo = 200,  hi = 220
   lo + hi = 420  -> exceeds 255  -> OVERFLOW
        debug build : PANIC "attempt to add with overflow"
        release     : wraps to 420-256 = 164  -> mid lands WAY off

THE SAFE FORM never forms the big sum:

   hi - lo = 20            (small, always >= 0 inside the loop)
   (hi - lo) / 2 = 10
   lo + 10 = 210           correct middle, no overflow possible

USIZE UNDERFLOW  (usize cannot be negative):

      let mid: usize = 0;
      mid - 1   ==>  NOT -1
                ==>  debug  : PANIC "subtract with overflow"
                ==>  release: 18446744073709551615 (wraps)
                             -> next index op panics out-of-bounds`,
        },
        {
          lang: 'rust',
          src: `fn main() {
    // The canonical safe midpoint:
    let (lo, hi) = (200usize, 220usize);
    let mid = lo + (hi - lo) / 2; // = 210, never forms lo+hi
    assert_eq!(mid, 210);

    // Demonstrating the usize trap without crashing the program.
    let m: usize = 0;
    // let bad = m - 1;          // would PANIC in debug / wrap in release
    let safe = m.checked_sub(1); // returns Option: None instead of wrapping
    assert_eq!(safe, None);
    println!("safe midpoint = {mid}, checked_sub(0,1) = {safe:?}");

    // This is exactly why we used hi = mid (not mid - 1) earlier:
    // the exclusive-hi convention never subtracts from a usize index.
}`,
        },
      ],
    },
    {
      heading: 'Lower bound and upper bound: searching for a boundary',
      body: `Exact match answers "is target here, and where?" But many real questions are about *boundaries*. In a sorted log file you may want the **first** line whose timestamp is at or after 09:00, even if no line has exactly that time. With duplicates, you may want the first and last index of a repeated value. These are **lower bound** and **upper bound** queries, and they are binary search with the equality branch removed.

The **lower bound** is the first index *i* such that *xs[i] >= target*: the leftmost spot where target could be inserted while keeping the array sorted. The **upper bound** is the first index *i* such that *xs[i] > target*: one past the last element equal to target. Two beautiful consequences fall out for free:

- The number of elements equal to target is **upper_bound minus lower_bound**.
- If lower_bound points at an element equal to target, the target is present; otherwise it is absent and lower_bound is exactly where you would insert it.

The trick is to drop the "found, return now" branch and keep narrowing until the window is empty; lo then lands on the boundary. For the lower bound, when *xs[mid] < target* we move lo = mid + 1 (mid is too small, exclude it), otherwise hi = mid (mid might be the answer, keep it as the exclusive bound). The loop cannot stop early, so it always runs the full *O(log n)* steps, but that is still tiny. The upper bound is identical except the comparison becomes *xs[mid] <= target*.

This **monotonic** structure, all the "no, too small" answers on the left and all the "yes, big enough" answers on the right, is the key. The boundary we find is the single point where "no" flips to "yes." Hold onto that mental image: the next big section generalizes it from array values to *any* yes-or-no test.

### Common pitfalls

- Confusing the two bounds. lower_bound uses **>= target** (strictly-less goes right); upper_bound uses **> target** (less-or-equal goes right). The only difference is whether elements equal to target are pushed left or right.
- Forgetting to check membership. lower_bound always returns a valid insertion index even when target is absent. You must separately test xs[i] == target (and guard i < len) before claiming a hit.
- Returning early on equality. If you keep the "== then return" branch, you find *some* matching index, not necessarily the first one; for first/last queries you must let the loop run to the boundary.`,
      code: [
        {
          lang: 'text',
          src: `Array with duplicates. target = 5.

  index:  0   1   2   3   4   5   6   7
        +---+---+---+---+---+---+---+---+
        | 1 | 3 | 5 | 5 | 5 | 8 | 8 | 9 |
        +---+---+---+---+---+---+---+---+
                  ^               ^
        lower_bound = 2      upper_bound = 5
        (first index with     (first index with
         value >= 5)           value > 5)

  count of 5s = upper_bound - lower_bound = 5 - 2 = 3

THE MONOTONIC VIEW the search rides on (predicate "value >= 5"):

  value:    1   3   5   5   5   8   8   9
  >= 5? :   N   N   Y   Y   Y   Y   Y   Y
                    ^
                    first Y  =  lower_bound = 2`,
        },
        {
          lang: 'rust',
          src: `// First index i with xs[i] >= target (the insertion point on the left).
fn lower_bound(xs: &[i32], target: i32) -> usize {
    let (mut lo, mut hi) = (0, xs.len());
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if xs[mid] < target {
            lo = mid + 1; // too small: answer is strictly right of mid
        } else {
            hi = mid;     // mid could BE the answer: keep it as exclusive bound
        }
    }
    lo // lands on the first index that is >= target (may equal xs.len())
}

// First index i with xs[i] > target (one past the last equal element).
fn upper_bound(xs: &[i32], target: i32) -> usize {
    let (mut lo, mut hi) = (0, xs.len());
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if xs[mid] <= target { lo = mid + 1; } else { hi = mid; }
    }
    lo
}

fn main() {
    let v = [1, 3, 5, 5, 5, 8, 8, 9];
    assert_eq!(lower_bound(&v, 5), 2);
    assert_eq!(upper_bound(&v, 5), 5);
    assert_eq!(upper_bound(&v, 5) - lower_bound(&v, 5), 3); // count of 5s
    // Membership: present iff lower_bound is in range AND points at target.
    let lb = lower_bound(&v, 6);
    assert!(lb >= v.len() || v[lb] != 6); // 6 is absent; lb=5 is its insert spot
    println!("lower=2 upper=5 count=3, all assertions passed");
}`,
        },
      ],
    },
    {
      heading: 'Rust gives you this: slice::binary_search and partition_point',
      body: `You will rarely hand-write the loops above in production Rust, because the standard library ships them, correct and overflow-safe, on every sorted slice. Knowing the hand-written versions is what lets you *trust* and *choose between* the library calls.

**slice::binary_search** does exact match. Its return type is the wonderfully Rust-y **Result<usize, usize>**: **Ok(i)** means the target is present at index i; **Err(i)** means it is absent and i is exactly the index where you would insert it to keep the slice sorted. That Err-with-an-index is not an error in the failure sense; it is a *useful answer*, the insertion point, so you never need a second search. There is also **binary_search_by** (you supply a comparison closure) and **binary_search_by_key** (you supply a key-extraction closure), for searching slices of structs by one field.

**slice::partition_point** is the lower/upper-bound tool, and it is the cleaner mental model for boundary queries. You give it a predicate, a closure returning bool, with the promise that the slice is **partitioned** by it: all elements for which the predicate is true come first, then all for which it is false. partition_point returns the index of that boundary, the first element where the predicate becomes false, in *O(log n)*. To get a lower bound for target you ask for partition_point with the predicate "this element is strictly less than target"; the boundary is the first element not less than target, which is exactly the lower bound.

The duplicate gotcha: with repeated elements, plain binary_search returns *some* matching index, not a specified one (it is unspecified which). When duplicates matter, reach for partition_point to get a well-defined first or last position.

### Common pitfalls

- Reading Err as failure. Err(i) carries the insertion index; pattern-match it or use unwrap_or_else to insert. Discarding it throws away half the value of the call.
- Calling binary_search on an unsorted slice. It compiles and runs but returns a meaningless index. The "sorted" precondition is on you; the type system does not enforce it.
- Expecting binary_search to find the *first* duplicate. It may return any equal index. Use partition_point (or a custom comparator) when you need first or last.`,
      code: [
        {
          lang: 'text',
          src: `slice::binary_search  ->  Result<usize, usize>

   xs = [10, 20, 30, 40]

   binary_search(&30)  =>  Ok(2)    present at index 2
   binary_search(&25)  =>  Err(2)   absent; insert at index 2
                             |
            xs after insert: [10, 20, 25, 30, 40]
                                       ^ slid in at position 2

slice::partition_point(pred)  ->  the boundary index

   pred = |x| x < 30        (true block first, then false block)

   xs:    10   20   30   40
  pred:    T    T    F    F
                     ^
        partition_point = 2   (first element where pred is false)
                            =  lower_bound of 30`,
        },
        {
          lang: 'rust',
          src: `fn main() {
    let xs = [10, 20, 30, 40, 50];

    // Exact match: Ok(index) if present, Err(insertion_index) if not.
    assert_eq!(xs.binary_search(&30), Ok(2));
    assert_eq!(xs.binary_search(&25), Err(2)); // would insert at index 2

    // Use the Err index directly to insert into a Vec and stay sorted:
    let mut v = xs.to_vec();
    let target = 25;
    if let Err(pos) = v.binary_search(&target) {
        v.insert(pos, target);
    }
    assert_eq!(v, vec![10, 20, 25, 30, 40, 50]);

    // partition_point = lower/upper bound via a predicate. O(log n).
    let dups = [1, 3, 5, 5, 5, 8];
    let lb = dups.partition_point(|&x| x < 5); // first index NOT < 5
    let ub = dups.partition_point(|&x| x <= 5); // first index NOT <= 5
    assert_eq!((lb, ub), (2, 5));               // three 5s between them

    // Searching structs by a key field:
    let people = [(1, "a"), (4, "b"), (9, "c")];
    let r = people.binary_search_by_key(&4, |&(id, _)| id);
    assert_eq!(r, Ok(1));
    println!("std binary_search + partition_point assertions passed");
}`,
        },
      ],
    },
    {
      heading: 'Binary search on the answer: the monotonic-predicate pattern',
      body: `Now the powerful generalization. So far we searched *inside an array*. But the real superpower is searching a **space of possible answers** when the answer is not stored anywhere. The pattern applies whenever your problem has this shape: *find the smallest value X for which a yes-or-no test feasible(X) is true*, and the test is **monotonic**, meaning once it becomes true for some X it stays true for every larger X. The "no" answers form a block on the left, the "yes" answers a block on the right, and you binary-search for the flip.

Real example: **autoscaling**. You run a web service and must pick the **smallest number of servers** that keeps response latency under your limit at peak traffic. feasible(k) = "k servers handle the load." More servers never hurt, so the moment feasible becomes true it stays true: it is monotonic. You do not have a sorted array of "good server counts"; you have a predicate. Binary search the count from 1 to some safe maximum, and you find the cheapest sufficient fleet in *O(log range)* feasibility checks instead of trying every count from 1 upward.

The skeleton is always the same. Pick lo and hi that *bracket* the answer (lo where feasible is surely false or the smallest candidate, hi where it is surely true). Loop while lo < hi: compute mid, and if feasible(mid) is true, the answer is mid or smaller so set hi = mid; otherwise the answer is larger so set lo = mid + 1. When the window closes, lo is the smallest feasible value. The cost is *O(log(range) x cost-of-one-feasibility-check)*. The art is two things: (1) recognizing the monotonic predicate hiding in the problem, and (2) writing feasible correctly, since it is usually a simple *O(n)* simulation or count.

### Common pitfalls

- Using it when the predicate is not monotonic. If feasible flips true-false-true as X grows, binary search can land in the wrong block. Prove (or convince yourself) monotonicity first.
- Bracketing the answer wrong. lo must be low enough that the true answer is >= lo, and hi high enough that feasible(hi) is definitely true. A too-tight hi makes the loop miss the answer; pick a safe over-estimate.
- Returning mid from inside the loop. The smallest feasible value is the final lo, not the first mid where feasible was true (an even smaller mid may also be feasible). Let the loop finish.`,
      code: [
        {
          lang: 'text',
          src: `BINARY SEARCH ON THE ANSWER  (autoscaling: smallest server count)

  candidate counts:  1   2   3   4   5   6   7   8
  feasible(k)?    :  N   N   N   N   Y   Y   Y   Y
                                     ^
                          answer = 5  (first Y, the flip point)

  The predicate is MONOTONIC: once Y, always Y. So the search is valid.

  TRACE  (lo=1, hi=8, find first feasible):
    lo=1 hi=8  mid=4   feasible(4)=N -> too few -> lo = mid+1 = 5
    lo=5 hi=8  mid=6   feasible(6)=Y -> enough  -> hi = mid   = 6
    lo=5 hi=6  mid=5   feasible(5)=Y -> enough  -> hi = mid   = 5
    lo=5 hi=5  window empty -> ANSWER = lo = 5

  Note: we evaluated feasible only 3 times, not 8.`,
        },
        {
          lang: 'rust',
          src: `// Generic "smallest x in lo..hi for which feasible(x) is true".
// feasible must be monotonic: false...false, true...true (never flipping back).
fn smallest_feasible(lo: u64, hi: u64, feasible: impl Fn(u64) -> bool) -> u64 {
    let (mut lo, mut hi) = (lo, hi); // hi is an index we know IS feasible
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if feasible(mid) {
            hi = mid;      // mid works; the answer is mid or smaller
        } else {
            lo = mid + 1;  // mid fails; the answer is larger
        }
    }
    lo // smallest value for which feasible is true
}

fn main() {
    // Autoscaling: each server handles 1000 req/s; peak is 4200 req/s.
    let peak = 4200u64;
    let per_server = 1000u64;
    let feasible = |servers: u64| servers * per_server >= peak;
    let need = smallest_feasible(1, 100, feasible); // search 1..100 servers
    assert_eq!(need, 5); // 4 servers = 4000 (too few), 5 = 5000 (enough)
    println!("need {need} servers"); // need 5 servers
}`,
        },
      ],
    },
    {
      heading: 'Worked patterns: ship capacity and Koko eating bananas',
      body: `Two classic problems show how to *spot* the monotonic predicate and write feasible. They look like packing and eating puzzles, not search problems, which is exactly why the pattern is so valuable.

**Minimum ship capacity to ship in D days.** You have packages with given weights that must be shipped in their original order. Each day you load consecutive packages onto a ship until the next would exceed the ship's capacity, then it sails. Given a deadline of D days, find the **smallest capacity** that gets everything shipped within D days. The insight: a *bigger* ship can always do at least as well as a smaller one, so "capacity C finishes within D days" is monotonic in C. feasible(C) is a one-pass simulation in *O(n)*: greedily fill days and count how many you need. Binary-search C between two natural bounds, the heaviest single package (you must at least carry the biggest item) and the sum of all weights (one giant day). The answer comes in *O(n log(sum))*.

**Koko eating bananas.** Koko has piles of bananas and H hours before the guards return. At a chosen eating speed of K bananas per hour, each hour she picks one pile and eats up to K from it (if the pile is smaller she eats it and the hour is "wasted" on that pile). Find the **smallest K** that lets her finish all piles within H hours. Eating faster never makes her slower, so "speed K finishes within H hours" is monotonic. feasible(K) sums, over all piles, the hours each pile takes, which is the pile size divided by K rounded up; that ceiling division is the one fiddly bit. Search K between 1 and the largest pile. Same *O(n log(max-pile))* shape.

Notice the recipe is identical every time: identify the quantity to minimize, confirm the predicate is monotonic in it, bracket lo and hi sensibly, and write feasible as a short linear simulation. Once you see it, you see it everywhere.

### Common pitfalls

- Ceiling division done wrong. To compute hours for a pile of size p at speed k, use (p + k - 1) / k, not p / k (which rounds down and under-counts). With u64 the +k-1 form is safe; double-check it never overflows for your bounds.
- Picking lo = 0 for capacity or speed. A ship of capacity 0 or a speed of 0 is nonsense and can divide by zero. Start lo at the heaviest package (ships) or 1 (Koko).
- Forgetting the order constraint on ship packages. Packages must ship in given order, so feasible is a sequential fill, not a bin-packing optimization. Reordering would be a different, much harder problem.`,
      code: [
        {
          lang: 'text',
          src: `SHIP CAPACITY: weights [3,2,2,4,1,4], deadline D = 3 days.

  Try capacity C = 6:
    day 1:  3 + 2     = 5   (next is 2 -> 5+2=7 > 6, sail)
    day 2:  2 + 4     = 6   (next is 1 -> 6+1=7 > 6, sail)
    day 3:  1 + 4     = 5   (done)
    days used = 3  <=  3   -> feasible(6) = YES

  Try capacity C = 5:
    day 1: 3+2=5 | day 2: 2 (then 4 won't fit) | day 3: 4+1=5 | day 4: 4
    days used = 4  >  3    -> feasible(5) = NO

  predicate over capacity:  ... 5:N  6:Y  7:Y ...   answer = 6.

KOKO: piles [3,6,7,11], H = 8 hours. hours(pile) = ceil(pile / K).
  K=4:  ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4) = 1+2+2+3 = 8 <= 8  YES
  K=3:                                              1+2+3+4 = 10 > 8  NO
  answer = smallest K = 4.`,
        },
        {
          lang: 'rust',
          src: `// Minimum ship capacity to deliver all weights within the given days.
fn ship_within_days(weights: &[u32], days: u32) -> u32 {
    // feasible(cap): can we finish within "days" days using this capacity?
    let feasible = |cap: u32| -> bool {
        let mut used = 1u32;      // we are on day 1
        let mut load = 0u32;
        for &w in weights {
            if load + w > cap {   // next package overflows the ship: sail
                used += 1;
                load = 0;
            }
            load += w;
        }
        used <= days
    };
    // lo: heaviest single package (must fit). hi: ship everything in one day.
    let mut lo = *weights.iter().max().unwrap();
    let mut hi = weights.iter().sum();
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if feasible(mid) { hi = mid; } else { lo = mid + 1; }
    }
    lo
}

// Minimum eating speed K so Koko finishes all piles within the given hours.
fn min_eating_speed(piles: &[u64], hours: u64) -> u64 {
    let feasible = |k: u64| -> bool {
        // ceil(p / k) summed over all piles; +k-1 gives the ceiling.
        piles.iter().map(|&p| (p + k - 1) / k).sum::<u64>() <= hours
    };
    let mut lo = 1u64;
    let mut hi = *piles.iter().max().unwrap();
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if feasible(mid) { hi = mid; } else { lo = mid + 1; }
    }
    lo
}

fn main() {
    assert_eq!(ship_within_days(&[3, 2, 2, 4, 1, 4], 3), 6);
    assert_eq!(min_eating_speed(&[3, 6, 7, 11], 8), 4);
    println!("ship capacity = 6, koko speed = 4");
}`,
        },
      ],
    },
    {
      heading: 'Searching a rotated sorted array',
      body: `Here is a twist that breaks naive binary search but yields to a clever variant. A **rotated sorted array** is a sorted array that has been cut at some pivot and the two pieces swapped, as if someone rotated a sorted log around a point. For example [4, 5, 6, 7, 0, 1, 2] is the sorted [0..7] rotated so the tail comes first. It is *not* globally sorted, so plain binary search fails, but it has a saving structure: **at least one of the two halves around mid is always properly sorted.**

That observation is the whole trick. At each step, look at mid. Compare it against the left end (xs[lo]) to decide which half is the sorted one:

- If xs[lo] <= xs[mid], the **left half is sorted**. Now check: does target fall within that sorted range [xs[lo], xs[mid])? If yes, search left (hi = mid); if no, the target must be in the messy right half (lo = mid + 1).
- Otherwise the **right half is sorted**, spanning (xs[mid], xs[hi-1]]. If target falls in that range, search right (lo = mid + 1); otherwise search left (hi = mid).

We still halve the window every step, so it remains *O(log n)*. We just spend one extra comparison per step to figure out which side is the trustworthy sorted one and whether target lives there. This is how you binary-search a log file that wraps around midnight, or a circular buffer of timestamps, without un-rotating it first.

### Common pitfalls

- Comparing mid against the wrong anchor. To decide which half is sorted you compare xs[mid] with xs[lo] (the inclusive left end), and you must use the matching inclusive index xs[hi - 1] for the right end. Mixing inclusive and exclusive ends here causes off-by-ones that send you down the wrong half.
- Getting the range check boundaries wrong. The "is target in the sorted half" test needs the right open/closed endpoints (for example xs[lo] <= target < xs[mid]). A flipped inequality silently discards the half that actually contains the target.
- Assuming the array is rotated. If it happens not to be rotated at all (rotation by zero), the left half is always sorted and the logic still works, so do not special-case it, but do test that case.`,
      code: [
        {
          lang: 'text',
          src: `ROTATED ARRAY: [4, 5, 6, 7, 0, 1, 2]   search for target = 0

  index:  0   1   2   3   4   5   6
        +---+---+---+---+---+---+---+
        | 4 | 5 | 6 | 7 | 0 | 1 | 2 |    pivot is between index 3 and 4
        +---+---+---+---+---+---+---+
          \\_____ sorted ____/  \\_ sorted _/

  TRACE (lo inclusive, hi exclusive):
   lo=0 hi=7 mid=3  a[mid]=7  a[lo]=4 <= 7 -> LEFT half [4..7] sorted.
                    is 0 in [4,7)?  No  -> go RIGHT:  lo = mid+1 = 4
   lo=4 hi=7 mid=5  a[mid]=1  a[lo]=0 <= 1 -> LEFT half [0..1] sorted.
                    is 0 in [0,1)?  Yes -> go LEFT:   hi = mid   = 5
   lo=4 hi=5 mid=4  a[mid]=0  == target  -> FOUND at index 4

  One half is ALWAYS sorted; we ride whichever one contains the target.`,
        },
        {
          lang: 'rust',
          src: `// Search a rotated sorted array (distinct values). O(log n).
fn search_rotated(xs: &[i32], target: i32) -> Option<usize> {
    let (mut lo, mut hi) = (0, xs.len()); // hi exclusive
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if xs[mid] == target {
            return Some(mid);
        }
        if xs[lo] <= xs[mid] {
            // Left half [lo, mid] is sorted.
            if xs[lo] <= target && target < xs[mid] {
                hi = mid;          // target is in the sorted left half
            } else {
                lo = mid + 1;      // target is in the messy right half
            }
        } else {
            // Right half [mid, hi-1] is sorted.
            if xs[mid] < target && target <= xs[hi - 1] {
                lo = mid + 1;      // target is in the sorted right half
            } else {
                hi = mid;          // target is in the messy left half
            }
        }
    }
    None
}

fn main() {
    let v = [4, 5, 6, 7, 0, 1, 2];
    assert_eq!(search_rotated(&v, 0), Some(4));
    assert_eq!(search_rotated(&v, 4), Some(0));
    assert_eq!(search_rotated(&v, 3), None);
    // Works on a non-rotated array too (rotation by zero):
    assert_eq!(search_rotated(&[1, 2, 3, 4], 3), Some(2));
    println!("rotated search assertions passed");
}`,
        },
      ],
    },
  ],
  takeaways: [
    'Binary search needs SORTED data; each comparison discards half the remaining range, giving O(log n) time and O(1) space.',
    'Sorting first costs O(n log n), so binary search pays off only when you query the sorted data many times, not for a single lookup.',
    'Keep a half-open window lo..hi (hi exclusive) and loop while lo < hi; the invariant is that the target, if present, lives in lo..hi.',
    'The asymmetry: lo = mid + 1 (mid ruled out, lo inclusive) but hi = mid (mid ruled out, hi exclusive). Mixing these breaks the search.',
    'Always compute mid = lo + (hi - lo) / 2, never (lo + hi) / 2, to avoid integer overflow on large indices.',
    'usize cannot go negative: mid - 1 at mid = 0 underflows (panic in debug, huge wrap in release). The exclusive-hi style avoids the subtraction.',
    'lower_bound uses >= target, upper_bound uses > target; their difference counts duplicates, and lower_bound is also the sorted insertion point.',
    'Reach for slice::binary_search (Ok(i) / Err(insert_i)) and slice::partition_point (predicate boundary) instead of hand-rolling in production.',
    'Binary search on the ANSWER: to find the smallest X where a MONOTONIC feasible(X) is true, search the answer space, with feasible an O(n) simulation.',
    'A rotated sorted array still has one sorted half around mid each step; decide which half is sorted and whether the target lies in it.',
  ],
  cheatsheet: [
    { label: 'Time / space', value: 'O(log n) comparisons, O(1) extra memory' },
    { label: 'Precondition', value: 'slice MUST be sorted in ascending order' },
    { label: 'Safe midpoint', value: 'mid = lo + (hi - lo) / 2 (avoids overflow)' },
    { label: 'Window convention', value: 'lo inclusive, hi exclusive; loop while lo < hi' },
    { label: 'Move right', value: 'lo = mid + 1 (mid too small, exclude it)' },
    { label: 'Move left', value: 'hi = mid (mid too big; hi is exclusive)' },
    { label: 'usize trap', value: 'no mid - 1 on usize; use checked_sub or exclusive hi' },
    { label: 'xs.binary_search(&t)', value: 'Ok(i) if present, Err(insert_i) if absent' },
    { label: 'binary_search_by_key', value: 'search slice of structs by one extracted key' },
    { label: 'xs.partition_point(p)', value: 'first index where predicate p turns false; O(log n)' },
    { label: 'lower_bound(t)', value: 'first i with xs[i] >= t  (partition_point: x < t)' },
    { label: 'upper_bound(t)', value: 'first i with xs[i] > t   (partition_point: x <= t)' },
    { label: 'count of t', value: 'upper_bound(t) - lower_bound(t)' },
    { label: 'Search on answer', value: 'smallest X with monotonic feasible(X); O(log range x check)' },
  ],
}

export default note
