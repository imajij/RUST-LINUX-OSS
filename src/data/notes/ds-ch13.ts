import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-ds-13',
  track: 'dsa',
  chapter: 13,
  title: 'Greedy & Intervals',
  summary: `A greedy algorithm makes the choice that looks best *right now* and never reconsiders it. That sounds reckless, and sometimes it is, but for a surprising number of problems the locally-best move really does build up to the globally-best answer, and when it works greedy is both the simplest code you will write and the fastest, usually just a sort followed by one linear pass.

This chapter teaches you to recognize *when* greed is safe and when it quietly gives a wrong answer. We build the intuition on intervals: booking the most meetings into one room, merging overlapping calendar events, removing the fewest events to stop conflicts, and counting the minimum number of rooms a schedule needs. Then we widen out to jump game, gas station, and the knapsack problem, the single cleanest example of greedy succeeding in the fractional version and failing in the 0/1 version.

Along the way you will get fluent with the two Rust tools every greedy solution leans on: sorting with sort_by_key for the "process in the right order" step, and BinaryHeap for the "always pull the current extreme" step. Master the exchange-argument way of thinking here and a whole class of interview and real scheduling problems collapses into a few lines.`,
  sections: [
    {
      heading: 'The greedy idea, and the honest caveat',
      body: `A **greedy algorithm** solves a problem by repeatedly making the choice that looks best at this moment, committing to it, and moving on without ever undoing it. Picture a cashier making change: to hand back the fewest coins, you instinctively reach for the largest coin that still fits, then the next largest, and so on. You never pause to reconsider an earlier coin. That reflex *is* the greedy method, and for standard coin systems it gives the optimal answer.

The appeal is enormous. Greedy code is short, it usually runs in the time it takes to sort the input (we will see this is **n log n** again and again, where n is the number of items), and it uses almost no extra memory. Compare that to **dynamic programming**, the topic of nearby chapters, which methodically considers many combinations and trades speed and memory for a guarantee of correctness. When greedy works, it is strictly the better tool.

The catch, and the reason this is a *thinking* chapter as much as a coding one, is that greedy is only correct when the problem has the right shape. Two properties must hold. The **greedy-choice property** says that some locally-best choice is part of *an* optimal solution, so you never lose by taking it. The **optimal-substructure property** says that after you lock in that choice, what remains is a smaller version of the same problem, so the same reasoning applies again. When both hold, repeating the greedy choice reaches a global optimum.

How do you actually prove the greedy-choice property? With an **exchange argument**: assume some optimal solution does *not* start with your greedy choice, then show you can swap your choice in for whatever it used without making the solution any worse. If the swap is always safe, your greedy choice is as good as any, so a greedy-only solution is optimal. We will run this argument concretely for interval scheduling in the next section.

The famous failure to keep in your back pocket: making change with coin values 1, 3, and 4 for a total of 6. Greedy grabs the 4, then needs two 1s, for three coins. But 3 + 3 is two coins. Greedy was locally smart and globally wrong, and only dynamic programming finds the 3 + 3 answer. Whenever a problem *looks* greedy, pause and ask: can I prove the exchange argument, or can I find a small counterexample like this one?

### Common pitfalls

- Assuming a problem is greedy because a greedy solution is easy to write. Easy to write is not the same as correct; always either prove the exchange argument or hunt for a tiny counterexample.
- Forgetting that greedy makes *irrevocable* choices. If a problem needs you to sometimes "take back" an earlier decision, greedy cannot express that and you likely need DP.
- Confusing greedy with brute force. Brute force tries all combinations (often exponential); greedy commits to one path (usually n log n). They answer the same question only when the greedy-choice property holds.`,
      code: [
        {
          lang: 'text',
          src: `WHEN DOES GREEDY WORK?  (a decision sketch)

  problem
     |
     v
  +--------------------------------------+
  | Can I order the items so that the    |
  | best first move is "obvious"?        |
  +--------------------------------------+
     | yes                         | no
     v                             v
  +-----------------------+     use DP / search
  | Exchange argument:    |     (greedy unsafe)
  | swapping my choice    |
  | into ANY optimal      |
  | never makes it worse? |
  +-----------------------+
     | yes            | no (found counterexample)
     v                v
  GREEDY is optimal   GREEDY may give a wrong answer

Coin change, values {1,3,4}, target 6:
  greedy:  4 + 1 + 1   -> 3 coins   (locally best, globally WRONG)
  optimal: 3 + 3       -> 2 coins   (only DP finds this)`,
        },
        {
          lang: 'rust',
          src: `// Greedy "fewest coins" — CORRECT only for nice coin systems
// (like 1,5,10,25). It is WRONG for {1,3,4}, as shown above.
fn fewest_coins_greedy(mut amount: u32, coins: &[u32]) -> u32 {
    // Largest coin first: that is the "locally best" move.
    let mut sorted: Vec<u32> = coins.to_vec();
    sorted.sort_unstable_by(|a, b| b.cmp(a)); // descending
    let mut count = 0;
    for c in sorted {
        count += amount / c; // take as many of this coin as fit
        amount %= c;         // keep the remainder
    }
    count
}

fn main() {
    // Works for the US coin system:
    assert_eq!(fewest_coins_greedy(63, &[25, 10, 5, 1]), 6); // 25+25+10+1+1+1
    // BUT for {1,3,4} and 6 it returns 3, while the true answer is 2.
    assert_eq!(fewest_coins_greedy(6, &[4, 3, 1]), 3); // greedy is WRONG here
    println!("greedy can be optimal OR wrong — prove it first!");
}`,
        },
      ],
    },
    {
      heading: 'Activity selection: sort by END time',
      body: `Here is the canonical greedy problem, and the one whose proof you should be able to recite. You run a single conference room, and you have a list of talks, each with a start time and an end time. Two talks **conflict** if their time ranges overlap. You want to schedule as many non-conflicting talks as possible. This is **activity selection**, also called **interval scheduling**, and the same shape appears in CPU job scheduling, booking a shared lab, or fitting ads into a commercial break.

The brute-force idea is to try every subset of talks, check which subsets have no conflicts, and keep the largest. With n talks there are two-to-the-n subsets, so this is exponential, hopeless past a couple dozen talks.

The greedy insight is delightfully simple: **always pick the talk that finishes earliest** among those that still fit. Finishing early leaves the maximum amount of room for everything after it. So sort the talks by their end time, then walk through them keeping a running "time I am free again" marker; take a talk whenever its start is at or after that marker, and advance the marker to its end. That is one sort (**n log n**) plus one linear pass (**n**), so **n log n** total and **O(1)** extra space beyond the sort.

Now the exchange argument, because *why* end-time works is the whole lesson. Let the greedy choice be the talk g that ends first overall. Take any optimal schedule and look at *its* first talk by end time, call it f. Either f is g, or f ends no earlier than g (since g ends first of everyone). Swap g in for f: since g ends no later than f, it cannot conflict with anything the optimal schedule placed after f (those talks started after f ended, so they start after g ends too). The swap keeps the count the same and stays valid, so there is an optimal solution that begins with g. Remove g and the talks it blocks, and the leftover is the same problem on fewer talks, optimal substructure, so repeat. Greedy is optimal.

A trap worth burning in: sort by **end** time, not start time and not duration. Sorting by start time can make you grab a talk that starts early but runs forever, blocking many short talks. Sorting by duration fails too. End time is the property that makes the exchange argument go through.

### Common pitfalls

- Sorting by start time or by duration instead of end time. Only end time supports the exchange argument; the others have easy counterexamples.
- Getting the overlap boundary wrong. Decide once whether a talk ending exactly when the next starts is a conflict. If [1,2] and [2,3] may both run (touching is fine), accept a talk when start is greater than or equal to the last end.
- Using a signed counter for indices and subtracting into the negatives; in Rust array indices are usize and cannot go below zero, so a stray subtraction panics.`,
      code: [
        {
          lang: 'text',
          src: `TALKS (start, end):  A(1,4) B(3,5) C(0,6) D(5,7) E(3,9) F(5,9) G(6,10)
sorted by END time:  A(1,4) B(3,5) C(0,6) D(5,7) E(3,9) F(5,9) G(6,10)

time   0   2   4   6   8   10
  A      [=====]                   end 4
  B          [===]                 end 5
  C    [===========]               end 6
  D              [===]             end 7
  E          [===========]         end 9
  F              [=======]         end 9
  G                [=======]       end 10

GREEDY TRACE   (free_at = earliest time room is open)
  free_at = -inf
  A(1,4): 1 >= -inf  -> TAKE A,  free_at = 4   picked: [A]
  B(3,5): 3 <  4     -> skip (overlaps A)
  C(0,6): 0 <  4     -> skip
  D(5,7): 5 >= 4     -> TAKE D,  free_at = 7   picked: [A,D]
  E(3,9): 3 <  7     -> skip
  F(5,9): 5 <  7     -> skip
  G(6,10):6 <  7     -> skip
  RESULT: A, D   ->  2 talks (this is optimal)`,
        },
        {
          lang: 'rust',
          src: `// Maximum number of non-overlapping talks. O(n log n).
fn max_activities(talks: &[(i32, i32)]) -> Vec<(i32, i32)> {
    let mut sorted = talks.to_vec();
    // The whole trick: sort by END time (the second field).
    sorted.sort_by_key(|&(_start, end)| end);

    let mut chosen = Vec::new();
    let mut free_at = i32::MIN; // earliest time the room is free again
    for (start, end) in sorted {
        if start >= free_at {   // does not overlap what we already took
            chosen.push((start, end));
            free_at = end;      // room is now busy until this end
        }
    }
    chosen
}

fn main() {
    let talks = [(1, 4), (3, 5), (0, 6), (5, 7), (3, 9), (5, 9), (6, 10)];
    let picked = max_activities(&talks);
    assert_eq!(picked, vec![(1, 4), (5, 7)]); // A then D
    println!("scheduled {} talks: {picked:?}", picked.len());
}`,
        },
      ],
    },
    {
      heading: 'Merging overlapping intervals',
      anim: 'merge-intervals',
      body: `Switch from "pick the most" to "combine what overlaps". You have a pile of calendar events and you want to collapse every cluster of overlapping events into one continuous busy block, so a UI can paint your day as a few solid bars instead of many tangled ones. This is **merge intervals**, and it shows up anywhere ranges pile up: combining IP-address ranges, coalescing disk reads, or summarizing free/busy time across a team.

Two intervals [a, b] and [c, d] overlap when one starts before the other ends; concretely, once they are sorted so that a is at or before c, they overlap exactly when c is at or before b, and the merged result is [a, max(b, d)]. Taking the max of the ends matters: a long interval can fully swallow a short one, and you must keep the longer reach.

The brute-force temptation is to compare every interval against every other looking for overlaps and repeatedly fuse them, which is **n squared** (for every interval we re-scan all the others) and fiddly to get right because a fresh merge can suddenly overlap something you already passed. The greedy fix removes all that pain: **sort by start time first.** Once sorted, any interval that overlaps the one you are currently building must come immediately next, never far ahead, so a single left-to-right pass suffices. Keep a "current" merged interval; for each next interval, either extend the current one (overlap) or close it off and start a new current (gap). That is **n log n** for the sort plus **n** for the sweep, with output-sized extra space.

The reason sorting by start works is the same family of reasoning as before: after sorting, the start times only increase, so once you find a gap between the current block and the next interval, nothing later can reach back across that gap to touch the current block. The decision to close the current block is therefore safe and final, exactly the irrevocable-choice flavor greedy needs.

### Common pitfalls

- Forgetting to take the max of the two end values when merging. If the current block already reaches further than the new interval, the new interval must not shorten it.
- Sorting by end time here. Merging needs sort-by-start so that overlap candidates are always adjacent; sort-by-end is the *scheduling* trick, not the *merging* trick.
- Mishandling touching intervals. Decide whether [1,3] and [3,5] merge into [1,5] (treat touching as overlap, use start <= current_end) or stay separate, and apply that choice consistently.`,
      code: [
        {
          lang: 'text',
          src: `INPUT (unsorted):  [1,3] [8,10] [2,6] [15,18]
sort by START:     [1,3] [2,6] [8,10] [15,18]

time -> 0   2   4   6   8   10  12  14  16  18
[1,3]     [===]
[2,6]       [=======]
[8,10]                  [===]
[15,18]                               [=====]

SWEEP, building one "current" block at a time:
  current = [1,3]
  next [2,6]:  2 <= 3  overlap -> current = [1, max(3,6)] = [1,6]
  next [8,10]: 8 >  6  GAP    -> emit [1,6]; current = [8,10]
  next [15,18]:15 > 10 GAP    -> emit [8,10]; current = [15,18]
  end of list                 -> emit [15,18]

OUTPUT: [1,6] [8,10] [15,18]`,
        },
        {
          lang: 'rust',
          src: `// Merge all overlapping intervals. O(n log n).
fn merge(intervals: &[(i32, i32)]) -> Vec<(i32, i32)> {
    if intervals.is_empty() {
        return Vec::new();
    }
    let mut iv = intervals.to_vec();
    iv.sort_by_key(|&(start, _end)| start); // sort by START for merging

    let mut out: Vec<(i32, i32)> = Vec::new();
    out.push(iv[0]);
    for &(start, end) in &iv[1..] {
        let last = out.last_mut().unwrap(); // the current block being built
        if start <= last.1 {
            // overlap (touching counts): extend, keeping the FARTHER end
            last.1 = last.1.max(end);
        } else {
            out.push((start, end)); // gap: close current, start a new block
        }
    }
    out
}

fn main() {
    let input = [(1, 3), (8, 10), (2, 6), (15, 18)];
    let merged = merge(&input);
    assert_eq!(merged, vec![(1, 6), (8, 10), (15, 18)]);
    println!("{merged:?}");
}`,
        },
      ],
    },
    {
      heading: 'Inserting one interval into a sorted list',
      body: `A close cousin of merging, and a great test of careful boundary handling. You already keep your busy intervals sorted and non-overlapping, the output shape from the previous section. Now a single new event arrives, say you just accepted a meeting from 4 to 9, and you want to splice it in, merging with anything it touches, while keeping the list sorted and disjoint. This is **insert interval**. Doing a full re-sort and re-merge would work but throws away the fact that the list is *already* clean.

Because the existing list is sorted and disjoint, the new interval interacts with the others in exactly three phases as you sweep left to right. **Phase one**: every existing interval that ends strictly before the new one starts is entirely to the left, untouched, so copy it straight through. **Phase two**: every existing interval that overlaps the new one (it starts at or before the new end and ends at or after the new start) gets absorbed; widen the new interval by taking the min of starts and the max of ends as you go. **Phase three**: once you pass the overlap region, push the now-widened new interval, then copy the rest straight through.

This runs in a single **O(n)** pass, no sort needed, because the list arrived sorted. That is the payoff for maintaining the invariant "sorted and disjoint" between operations: each insert is linear instead of n log n. An **invariant** is a property your data structure promises to always satisfy between operations; here it is "intervals are sorted by start and never overlap", and every operation must restore it before returning.

The boundary conditions are the whole difficulty. Use the same touching convention you chose for merge. Be careful that an interval ending exactly at the new start, or starting exactly at the new end, counts as overlapping if you decided touching merges. Off-by-one mistakes here are the classic source of bugs, so trace the three phases on paper for an input where the new interval touches a neighbor exactly.

### Common pitfalls

- Forgetting one of the three phases, especially the final "copy the rest" tail, which silently drops trailing intervals.
- Re-sorting the whole list out of habit and turning a clean O(n) insert into an n log n one. The input is already sorted; lean on that.
- Inconsistent touching rules between insert and merge, so the same calendar ends up merged differently depending on which operation last ran.`,
      code: [
        {
          lang: 'text',
          src: `EXISTING (sorted, disjoint): [1,2] [3,5] [6,7] [8,10] [12,16]
INSERT NEW:                  [4,9]

time -> 0   2   4   6   8   10  12  14  16
[1,2]     [=]
[3,5]         [===]
[6,7]               [=]
[8,10]                  [===]
[12,16]                         [=======]
 NEW            [=========]   (4..9)

THREE-PHASE SWEEP:
  [1,2]: ends 2 < 4  -> LEFT, copy through            out=[ [1,2] ]
  [3,5]: 3<=9 and 5>=4 -> OVERLAP, grow new
                          new = [min(4,3), max(9,5)] = [3,9]
  [6,7]: overlaps [3,9]  -> grow new = [3,9]
  [8,10]:overlaps [3,9]  -> grow new = [3, max(9,10)] = [3,10]
  [12,16]: starts 12 > 10 -> RIGHT region
  emit grown new [3,10]; then copy [12,16]

OUTPUT: [1,2] [3,10] [12,16]`,
        },
        {
          lang: 'rust',
          src: `// Insert one interval into a sorted, disjoint list. O(n), no re-sort.
fn insert(intervals: &[(i32, i32)], new: (i32, i32)) -> Vec<(i32, i32)> {
    let (mut ns, mut ne) = new;
    let mut out = Vec::new();
    let mut i = 0;
    let n = intervals.len();

    // Phase 1: intervals entirely to the LEFT (end before new start).
    while i < n && intervals[i].1 < ns {
        out.push(intervals[i]);
        i += 1;
    }
    // Phase 2: intervals that OVERLAP — absorb them into [ns, ne].
    while i < n && intervals[i].0 <= ne {
        ns = ns.min(intervals[i].0);
        ne = ne.max(intervals[i].1);
        i += 1;
    }
    out.push((ns, ne)); // the fully grown interval
    // Phase 3: intervals entirely to the RIGHT — copy the tail.
    while i < n {
        out.push(intervals[i]);
        i += 1;
    }
    out
}

fn main() {
    let existing = [(1, 2), (3, 5), (6, 7), (8, 10), (12, 16)];
    let result = insert(&existing, (4, 9));
    assert_eq!(result, vec![(1, 2), (3, 10), (12, 16)]);
    println!("{result:?}");
}`,
        },
      ],
    },
    {
      heading: 'Non-overlapping intervals: the fewest removals',
      body: `Now the mirror image of activity selection. Instead of "how many talks can I keep", ask "what is the *fewest* talks I must cancel so that none of the survivors conflict". This is **non-overlapping intervals**, and it is the everyday scheduling question: a double-booked calendar, and you want to drop as few events as possible to make it conflict-free.

Here is the beautiful part. Keeping the maximum number of non-overlapping intervals and removing the minimum number to make them non-overlapping are the *same problem* viewed from opposite ends. If there are n intervals and the largest non-conflicting set you can keep has size k, then the fewest you must remove is exactly n minus k. So you do not need a new algorithm at all: run the activity-selection greedy (sort by end time, keep a talk whenever it fits), count how many you *kept*, and the removals are everything else.

In practice you often just count removals directly in the same sweep, which avoids storing the kept set. Sort by end time, track the end of the last interval you decided to keep, and for each next interval: if it starts before that end it conflicts, so you remove it (increment a counter) and keep the *earlier-ending* of the two as your reference, which is the one already stored since you sorted by end. If it does not conflict, keep it and advance the reference. The complexity is the familiar **n log n** sort plus an **n** pass.

Why keep the earlier-ending interval when two conflict? The same exchange argument as activity selection: the interval that ends sooner leaves more room for the future, so among two conflicting intervals you always discard the one that ends later. Sorting by end time means the one you are already tracking is the earlier-ending one, so "remove the new conflicting interval" is automatically the right move.

### Common pitfalls

- Sorting by start time. As with activity selection, only end-time sorting makes the greedy choice provably optimal here.
- When two intervals conflict, removing the earlier-ending one. That is backwards; discard the *later*-ending interval to preserve room for the future.
- Treating exactly-touching intervals as conflicts when they should not be. If [1,2] and [2,3] are allowed to coexist, only count a removal when the next start is strictly less than the kept end.`,
      code: [
        {
          lang: 'text',
          src: `INTERVALS: [1,2] [2,3] [3,4] [1,3]
sort by END: [1,2] [2,3] [1,3] [3,4]
            (ends:  2     3     3     4)

time -> 0   1   2   3   4
 [1,2]      [===]
 [2,3]          [===]
 [1,3]      [=======]
 [3,4]              [===]

GREEDY TRACE  (last_end = end of last KEPT interval)
  last_end = -inf, removed = 0
  [1,2]: 1 >= -inf -> KEEP, last_end = 2
  [2,3]: 2 >= 2    -> KEEP, last_end = 3   (touching allowed)
  [1,3]: 1 <  3    -> CONFLICT, REMOVE  removed = 1
                      (keep earlier-ending [2,3]; last_end stays 3)
  [3,4]: 3 >= 3    -> KEEP, last_end = 4
  RESULT: must remove 1 interval  ->  [1,3]`,
        },
        {
          lang: 'rust',
          src: `// Minimum removals so the rest do not overlap. O(n log n).
fn erase_overlap_count(intervals: &[(i32, i32)]) -> u32 {
    if intervals.is_empty() {
        return 0;
    }
    let mut iv = intervals.to_vec();
    iv.sort_by_key(|&(_start, end)| end); // sort by END, like activity selection

    let mut removed = 0;
    let mut last_end = i32::MIN;
    for (start, end) in iv {
        if start >= last_end {
            last_end = end; // no conflict: keep it
        } else {
            removed += 1;   // conflict: drop THIS one (it ends later)
        }
    }
    removed
}

fn main() {
    let intervals = [(1, 2), (2, 3), (3, 4), (1, 3)];
    assert_eq!(erase_overlap_count(&intervals), 1); // drop [1,3]
    println!("remove {} interval(s)", erase_overlap_count(&intervals));
}`,
        },
      ],
    },
    {
      heading: 'Minimum meeting rooms: sweep line and a min-heap',
      body: `Up to now one room was enough and we chose what to schedule. Flip the question: every meeting *must* happen, and you want to know the **minimum number of rooms** so that no two meetings ever share a room. The answer is the largest number of meetings that are all live at the same instant, the peak concurrency of your calendar. This is exactly how you size a meeting-room booking system, size a connection pool, or decide how many CPU cores a batch of jobs needs.

The cleanest way to picture it is a **sweep line**: imagine a vertical line moving left to right across the timeline. Split every meeting into two events, a +1 at its start ("a meeting begins, demand for rooms rises") and a -1 at its end ("a meeting ends, a room frees"). Sort all events by time, then sweep, keeping a running count of how many meetings are currently active. The maximum that running count ever reaches is your answer. One subtlety: process end events before start events when they share a timestamp, so a meeting ending exactly when another begins can hand off the same room. This is two sorts of n events, so **n log n**, and **O(n)** space for the event list.

The second classic approach uses a **min-heap of end times**, and it is worth knowing because it generalizes nicely. Sort meetings by start time. Walk through them, and keep a heap holding the end times of every meeting currently using a room, with the *soonest* end time on top. For each new meeting, peek at the soonest-ending current meeting: if it has already finished (its end is at or before the new start), pop it, reusing that room; otherwise you need a fresh room. Push the new meeting's end time. The heap size at its peak is the number of rooms. Sorting is **n log n** and each meeting does at most one push and one pop of **log n**, so the whole thing is **n log n**.

A Rust-specific landmine lives here. The standard **BinaryHeap is a MAX-heap**: pop gives you the *largest* element, not the smallest. To get a min-heap of end times you wrap each value in **std::cmp::Reverse**, which flips the comparison so the smallest underlying value sits on top. Forgetting this and using a bare BinaryHeap silently tracks the *latest*-ending meeting instead of the soonest, and your room count comes out wrong with no error message. This MAX-by-default behavior trips up everyone arriving from languages whose default heap is a min-heap.

### Common pitfalls

- Using a bare BinaryHeap when you need the soonest end time. It is a MAX-heap; wrap values in std::cmp::Reverse for min-heap behavior.
- Ordering start before end at equal timestamps in the sweep. Process ends first so a back-to-back meeting reuses the freed room instead of demanding a new one.
- Trying to subtract from a usize room counter and underflowing. Counts here are non-negative; if you model with usize, never decrement below zero, or use a signed type for the running balance.`,
      code: [
        {
          lang: 'text',
          src: `MEETINGS: [0,30] [5,10] [15,20]

SWEEP-LINE events (+1 start, -1 end), ends before starts on ties:
  t=0  +1   active=1   peak=1
  t=5  +1   active=2   peak=2   <- two meetings overlap here
  t=10 -1   active=1
  t=15 +1   active=2   peak=2
  t=20 -1   active=1
  t=30 -1   active=0
  ANSWER: 2 rooms

MIN-HEAP of end times (Reverse so soonest end is on top):
  sort by start: [0,30] [5,10] [15,20]
  [0,30]: heap empty            -> new room, push 30   heap={30}
  [5,10]: top 30 > 5 (busy)     -> new room, push 10   heap={10,30}
  [15,20]: top 10 <= 15 (freed) -> pop 10, push 20     heap={20,30}
  peak heap size = 2  ->  2 rooms`,
        },
        {
          lang: 'rust',
          src: `use std::cmp::Reverse;
use std::collections::BinaryHeap;

// Minimum rooms = peak number of simultaneously active meetings.
fn min_meeting_rooms(meetings: &[(i32, i32)]) -> usize {
    if meetings.is_empty() {
        return 0;
    }
    let mut m = meetings.to_vec();
    m.sort_by_key(|&(start, _end)| start); // process in start order

    // Min-heap of END times: BinaryHeap is a MAX-heap, so wrap in Reverse
    // to make the SOONEST end time sit on top.
    let mut ends: BinaryHeap<Reverse<i32>> = BinaryHeap::new();
    let mut rooms = 0;
    for (start, end) in m {
        // If the soonest-ending meeting is already over, reuse its room.
        if let Some(&Reverse(soonest)) = ends.peek() {
            if soonest <= start {
                ends.pop(); // that room is free now
            }
        }
        ends.push(Reverse(end)); // this meeting occupies a room until its end
        rooms = rooms.max(ends.len()); // peak concurrency = rooms needed
    }
    rooms
}

fn main() {
    let meetings = [(0, 30), (5, 10), (15, 20)];
    assert_eq!(min_meeting_rooms(&meetings), 2);
    println!("rooms needed: {}", min_meeting_rooms(&meetings));
}`,
        },
      ],
    },
    {
      heading: 'Jump game and gas station: greedy on a line',
      body: `Intervals are not the only home for greedy. Two famous array problems show the pattern of "track the best reach so far in a single pass", and both reward you with **O(n)** time after you spot the invariant.

**Jump game.** You stand at index 0 of an array where each value is the maximum number of steps you may jump forward from that position. Can you reach the last index? Think of a delivery drone hopping across rooftops, where each rooftop's number is how far its launcher can fling you. The brute-force recursion tries every jump length from every cell, which blows up exponentially. The greedy realization: sweep left to right tracking the **farthest index reachable so far**. At each cell i, if i is beyond that farthest reach, you are stranded and the answer is no; otherwise update farthest to the max of itself and i plus the jump value at i. If farthest ever reaches the last index, the answer is yes. One pass, **O(n)** time, **O(1)** space. The invariant carrying the proof is "farthest is the maximum index reachable using only cells we have already visited", and as long as we never step past it, it stays valid.

**Gas station.** Stations sit in a circle; station i offers gas[i] fuel and it costs cost[i] fuel to drive from i to the next station. Starting with an empty tank, find a station you can start from to drive all the way around once, or report that none works. Real picture: a delivery route looping a city, can you complete the loop without ever running dry? The brute force tries every start and simulates the full loop, which is **n squared**. The greedy facts: first, if the total gas is less than the total cost, no start can possibly work, so answer none. Second, if the total is enough, there is exactly one valid start, and you can find it in one pass. Sweep keeping a running tank; whenever the tank goes negative at station i, no station from your current candidate start through i can be the answer (each would run dry no later), so jump the candidate start to i plus one and reset the tank. The station you are sitting on when the sweep ends is the answer. **O(n)** time, **O(1)** space.

Both proofs are exchange-argument cousins: in gas station, the "reset the start past the failure point" step is justified because any start inside a stretch that nets negative fuel must also fail, so skipping all of them loses nothing.

### Common pitfalls

- In jump game, continuing to loop after you are already stranded. The moment i exceeds farthest, stop and return false; reading past that point can index out of intent.
- In gas station, forgetting the global feasibility check. Even with a clever sweep, if total gas is less than total cost the honest answer is no valid start exists.
- Off-by-one on the circular wrap in gas station, or resetting the tank but forgetting to also move the candidate start. Both leave you simulating from the wrong place.`,
      code: [
        {
          lang: 'text',
          src: `JUMP GAME   nums = [2, 3, 1, 1, 4]   (last index = 4)

 idx:   0    1    2    3    4
 val:   2    3    1    1    4
 reach from idx (idx+val):  2    4    3    4    8

TRACE farthest reachable:
  i=0: 0<=0 ok, farthest = max(0, 0+2) = 2
  i=1: 1<=2 ok, farthest = max(2, 1+3) = 4   >= last index 4  -> TRUE

GAS STATION  gas=[1,2,3,4,5]  cost=[3,4,5,1,2]
  total gas 15 >= total cost 15  -> a start exists
  tank, start=0
  i=0: tank += 1-3 = -2  < 0 -> start=1, tank=0
  i=1: tank += 2-4 = -2  < 0 -> start=2, tank=0
  i=2: tank += 3-5 = -2  < 0 -> start=3, tank=0
  i=3: tank += 4-1 =  3
  i=4: tank += 5-2 =  6
  ANSWER: start at station 3`,
        },
        {
          lang: 'rust',
          src: `// Jump game: can we reach the last index? O(n).
fn can_jump(nums: &[i32]) -> bool {
    let mut farthest = 0usize;
    for (i, &step) in nums.iter().enumerate() {
        if i > farthest {
            return false; // stranded: this cell is unreachable
        }
        farthest = farthest.max(i + step as usize);
        if farthest >= nums.len() - 1 {
            return true; // last index is within reach
        }
    }
    true
}

// Gas station: index of a valid start, or None. O(n).
fn gas_station(gas: &[i32], cost: &[i32]) -> Option<usize> {
    let total: i32 = gas.iter().zip(cost).map(|(g, c)| g - c).sum();
    if total < 0 {
        return None; // not enough fuel overall: impossible
    }
    let mut start = 0usize;
    let mut tank = 0;
    for i in 0..gas.len() {
        tank += gas[i] - cost[i];
        if tank < 0 {
            start = i + 1; // nothing in start..=i can work
            tank = 0;      // restart the tank from the next station
        }
    }
    Some(start)
}

fn main() {
    assert!(can_jump(&[2, 3, 1, 1, 4]));
    assert!(!can_jump(&[3, 2, 1, 0, 4])); // stuck at the 0
    assert_eq!(gas_station(&[1, 2, 3, 4, 5], &[3, 4, 5, 1, 2]), Some(3));
    println!("jump and gas-station: greedy single-pass wins");
}`,
        },
      ],
    },
    {
      heading: 'Fractional knapsack works, 0/1 knapsack does not',
      body: `We end on the cleanest illustration of greedy's boundary, where one tiny rule change flips greedy from optimal to wrong. The **knapsack problem**: you have a bag that holds a weight capacity W, and items each with a weight and a value. Maximize the total value you carry. Picture a courier with a weight-limited bag choosing which packages to take for the most reward, or a backup job choosing which files to fit in limited space.

In **fractional knapsack** you may take *fractions* of an item, like cutting a bar of gold. Here greedy is provably optimal. Compute each item's **value density**, its value divided by its weight, sort items by density descending, and pour them in greedily: take whole high-density items until one no longer fits, then take a fraction of that one to top off the bag exactly. The exchange argument: if any optimal solution skipped some density you could have added, swapping a sliver of lower-density weight for higher-density weight never decreases value, so greedy-by-density is optimal. Sorting dominates, so **n log n**.

In **0/1 knapsack** you must take each item whole or leave it, no fractions. Now greedy-by-density **fails**, and the reason is exactly that you can no longer top off with a sliver. The densest item might be small and leave awkward leftover capacity that a less dense but better-fitting item would have used. Watch the counterexample: capacity 50, with items A (weight 10, value 60, density 6), B (weight 20, value 100, density 5), C (weight 30, value 120, density 4). Greedy by density takes A then B for weight 30 and value 160, then C does not fit. But taking B and C uses weight 50 exactly for value 220. Greedy left 60 of value on the table. The correct tool for 0/1 knapsack is **dynamic programming**, which considers the take-it-or-leave-it decision for every item against every capacity and runs in **O(n times W)** time.

The lesson to carry out of this whole chapter: the same objective, "maximize value within a weight limit", is greedy-friendly with fractions and greedy-hostile without them. That single difference is the presence or absence of the greedy-choice property, and the only reliable way to know which world you are in is the exchange argument or a small counterexample. Reach for greedy when you can prove it, and reach for DP when greed demonstrably leaves value behind.

### Common pitfalls

- Applying density-greedy to 0/1 knapsack. It is optimal only for the fractional version; for 0/1 use dynamic programming.
- Comparing value densities (a ratio) with integer division and silently truncating. Compare a.value times b.weight against b.value times a.weight, or use floating point deliberately, to rank densities without losing precision.
- Assuming "maximize value under a limit" is always greedy. It depends entirely on whether you can split items; prove it before you trust it.`,
      code: [
        {
          lang: 'text',
          src: `KNAPSACK capacity W = 50
  item   weight  value   density (value/weight)
   A       10      60      6.0
   B       20     100      5.0
   C       30     120      4.0

FRACTIONAL (fractions allowed) — greedy by density is OPTIMAL:
  take A whole   : weight 10, value  60   (cap left 40)
  take B whole   : weight 20, value 100   (cap left 20)
  take 20/30 of C: value 120 * (20/30) = 80
  TOTAL value = 60 + 100 + 80 = 240  (optimal)

0/1 (whole items only) — greedy by density is WRONG:
  greedy: A + B = weight 30, value 160; C (30) does NOT fit -> 160
  best  : B + C = weight 50, value 220                       -> 220
  greedy loses 60 of value; only DP finds B + C.`,
        },
        {
          lang: 'rust',
          src: `// Fractional knapsack — greedy by value density is OPTIMAL. O(n log n).
fn fractional_knapsack(capacity: f64, items: &[(f64, f64)]) -> f64 {
    // items are (weight, value)
    let mut sorted = items.to_vec();
    // Sort by density value/weight, DESCENDING. Compare cross-multiplied
    // (v1*w2 vs v2*w1) to avoid dividing and losing precision.
    sorted.sort_by(|&(w1, v1), &(w2, v2)| {
        (v2 * w1).partial_cmp(&(v1 * w2)).unwrap()
    });

    let mut cap = capacity;
    let mut total = 0.0;
    for (w, v) in sorted {
        if w <= cap {
            total += v;     // take the whole item
            cap -= w;
        } else {
            total += v * (cap / w); // take the fraction that fits, then stop
            break;
        }
    }
    total
}

fn main() {
    let items = [(10.0, 60.0), (20.0, 100.0), (30.0, 120.0)];
    let best = fractional_knapsack(50.0, &items);
    assert!((best - 240.0).abs() < 1e-9); // 240 is optimal with fractions
    println!("fractional best = {best}");
    // For 0/1 (no fractions) the answer is 220 via DP, NOT 160 via greedy.
}`,
        },
      ],
    },
  ],
  takeaways: [
    'Greedy makes the locally-best, irrevocable choice; it is optimal only when the greedy-choice property and optimal substructure both hold.',
    'Prove greedy with an exchange argument: swapping your choice into any optimal solution never makes it worse. If you cannot, look for a small counterexample.',
    'Activity selection (most non-overlapping intervals): sort by END time and keep any interval whose start clears the last kept end. O(n log n).',
    'Merge intervals: sort by START time, then one sweep extending or closing a current block; take the MAX of ends when merging.',
    'Insert interval into a sorted disjoint list is a single O(n) three-phase sweep (left, overlap, right) with no re-sort.',
    'Fewest removals to de-conflict equals n minus the most you can keep; same end-time greedy, drop the later-ending of any conflicting pair.',
    'Minimum meeting rooms is peak concurrency: a sweep line of plus-one/minus-one events, or a min-heap of end times. O(n log n).',
    'Jump game and gas station are single-pass O(n) greedies that track the best reach / running tank and reset on failure.',
    'Fractional knapsack is greedy-optimal by value density; 0/1 knapsack is NOT greedy and needs DP.',
    'Rust gotchas: BinaryHeap is a MAX-heap (use std::cmp::Reverse for a min-heap), and usize indices cannot go negative.',
  ],
  cheatsheet: [
    { label: 'v.sort_by_key(|&(_,e)| e)', value: 'Sort by end time: the activity-selection / removals trick. O(n log n)' },
    { label: 'v.sort_by_key(|&(s,_)| s)', value: 'Sort by start time: the merge / sweep-line trick' },
    { label: 'v.sort_by(|a,b| ...)', value: 'Custom comparator, e.g. cross-multiplied density for knapsack' },
    { label: 'v.sort_unstable_by(...)', value: 'Faster sort when equal-element order does not matter' },
    { label: 'BinaryHeap<T>', value: 'MAX-heap: pop returns the LARGEST element' },
    { label: 'std::cmp::Reverse(x)', value: 'Wrap to turn BinaryHeap into a MIN-heap (soonest end on top)' },
    { label: 'heap.peek() / heap.pop()', value: 'Look at / remove the heap top in O(log n)' },
    { label: 'out.last_mut()', value: 'Mutate the current merged block in place during a sweep' },
    { label: 'a.max(b) / a.min(b)', value: 'Combine interval ends/starts when merging or growing' },
    { label: 'Activity selection', value: 'sort by end, greedy keep; O(n log n) time, O(1) extra' },
    { label: 'Min meeting rooms', value: 'peak active count via sweep line or min-heap; O(n log n)' },
    { label: 'Jump game / gas station', value: 'single-pass O(n) greedy, O(1) space' },
    { label: 'Fractional knapsack', value: 'greedy by density, O(n log n) — OPTIMAL' },
    { label: '0/1 knapsack', value: 'NOT greedy; dynamic programming, O(n * W)' },
  ],
}

export default note
