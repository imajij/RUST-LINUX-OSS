import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch13-t-001',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'What Greedy Means',
    prompt: `A greedy algorithm is described as making "the choice that looks best right now and never reconsidering it". A cashier handing back change reaches for the largest coin that still fits, then the next largest, and so on, never pausing to undo an earlier coin. In one or two sentences, explain what makes this approach "greedy", and name the one word that captures the fact that greedy never goes back to change a past decision.`,
    hints: [
      'Focus on the words "looks best right now" and "never reconsidering".',
      'There is a single adjective in the note for choices that cannot be taken back.',
    ],
    solution: `A greedy algorithm repeatedly takes the locally-best choice, the one that looks best at this exact moment, then commits to it and moves on without ever undoing it. The cashier picking the largest coin that fits at each step is doing exactly this. The key word is irrevocable: every greedy choice is final, and the algorithm never goes back to change an earlier decision. That is what separates greedy from approaches like dynamic programming, which can effectively reconsider combinations.`,
    tags: ['greedy', 'greedy-choice'],
  },
  {
    id: 'ds-ch13-t-002',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'BinaryHeap Is a Max-Heap',
    prompt: `A student wants the meeting that ends SOONEST to always be on top of their heap, so they can check whether a room has freed up. They write:

    let mut ends: BinaryHeap<i32> = BinaryHeap::new();

and call ends.peek() expecting the smallest end time. In Rust, what does peek actually return from a bare BinaryHeap, and what one-word wrapper from std::cmp fixes this?`,
    hints: [
      'Rust\'s BinaryHeap is not the same flavour of heap that some other languages default to.',
      'The note names a wrapper type that flips the comparison so the smallest value floats to the top.',
    ],
    solution: `A bare BinaryHeap in Rust is a MAX-heap, so peek returns the LARGEST element, here the LATEST end time, not the soonest. The student would be tracking the wrong meeting and would silently get a wrong room count with no error message. The fix is to wrap each value in std::cmp::Reverse, storing BinaryHeap<Reverse<i32>>; Reverse flips the ordering so the smallest underlying value sits on top, giving min-heap behaviour. This max-by-default rule trips up everyone arriving from languages whose default heap is a min-heap.`,
    tags: ['binary-heap', 'rust-gotcha', 'meeting-rooms'],
  },
  {
    id: 'ds-ch13-t-003',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why Sort by End, Not Start',
    prompt: `For activity selection (scheduling the most non-overlapping talks in one room), the greedy rule is "sort by END time and keep each talk whose start clears the last kept end". A classmate insists sorting by START time should work just as well, since you would grab talks early. Give a concrete reason their start-time idea fails.`,
    hints: [
      'Think about a talk that starts very early but runs for a very long time.',
      'Which property leaves the most room for future talks: an early start, or an early finish?',
    ],
    solution: `Sorting by start time can make you grab a talk that starts early but runs forever, blocking many short talks that would all have fit afterward. For example, a talk from 0 to 100 has the earliest start, but taking it wastes the whole day, whereas talks ending early leave the maximum room for everything after them. Finishing early, not starting early, is the property that supports the exchange argument, so only end-time sorting is provably optimal. Sorting by duration fails too for similar reasons.`,
    tags: ['activity-selection', 'greedy', 'sorting'],
  },
  {
    id: 'ds-ch13-t-004',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Trace the Merge Sweep',
    prompt: `You merge overlapping intervals by sorting by START time, then sweeping with one "current" block, extending it on overlap and closing it on a gap (touching counts as overlap). Hand-trace this input and give the final output:

    [4, 6]  [1, 3]  [2, 4]  [9, 10]

Show the value of the current block after each step.`,
    hints: [
      'First sort the intervals by their start value.',
      'When two intervals overlap, the new end is the max of the two ends, not just the second one.',
    ],
    solution: `Sorted by start: [1,3] [2,4] [4,6] [9,10]. Sweep: current = [1,3]. Next [2,4]: 2 is at or below 3, overlap, so current becomes [1, max(3,4)] = [1,4]. Next [4,6]: 4 is at or below 4 (touching counts), overlap, so current becomes [1, max(4,6)] = [1,6]. Next [9,10]: 9 is above 6, a gap, so emit [1,6] and start current = [9,10]. End of list: emit [9,10]. Final output: [1,6] [9,10]. Taking the max of the ends was essential, since [2,4] reached past where [1,3] alone ended.`,
    tags: ['merge-intervals', 'sorting', 'tracing'],
  },
  {
    id: 'ds-ch13-t-005',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Removals Equals n Minus Kept',
    prompt: `You have 10 intervals. Using the end-time greedy, the largest set of non-overlapping intervals you can keep has size 6. Without writing any new algorithm, what is the minimum number of intervals you must remove so the survivors do not overlap, and why is "keep the most" the same problem as "remove the fewest"?`,
    hints: [
      'If you keep as many as possible, what is left over?',
      'Every interval is either kept or removed, with nothing in between.',
    ],
    solution: `The minimum number to remove is 10 minus 6, which is 4. Keeping the maximum non-overlapping set and removing the minimum to de-conflict are the same problem seen from opposite ends: every interval is either kept or removed, so if there are n intervals and the largest conflict-free set you can keep has size k, the fewest you must remove is exactly n minus k. So the activity-selection greedy (sort by end, keep whatever fits) already solves both; you just report the count you did not keep.`,
    tags: ['non-overlapping-intervals', 'greedy', 'activity-selection'],
  },
  {
    id: 'ds-ch13-t-006',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Which Conflicting Interval to Drop',
    prompt: `While removing the fewest intervals to de-conflict a calendar, you reach two intervals that overlap: [2, 9] and [3, 5]. You must remove one of them. Which one do you discard to keep your options open for future intervals, and what is the one-line reason?`,
    hints: [
      'Picture the timeline after you keep one of them: which leaves more empty room afterward?',
      'The interval that frees the room sooner blocks fewer later intervals.',
    ],
    solution: `Discard [2, 9], the interval that ends LATER, and keep [3, 5], the one that ends sooner. The interval that finishes earlier leaves more room for future intervals, so among any two that conflict you always drop the later-ending one. This is the same exchange-argument logic as activity selection. A common mistake is to remove the earlier-ending interval, which is exactly backwards and needlessly blocks later intervals. Note that because you sort by end time first, the earlier-ending interval is already the one you are tracking.`,
    tags: ['non-overlapping-intervals', 'greedy', 'pitfall'],
  },
  {
    id: 'ds-ch13-t-007',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Trace the Jump Game Reach',
    prompt: `In jump game, each value is how far you may jump forward, and you sweep tracking "farthest index reachable so far". Hand-trace this array and decide whether you can reach the last index:

    nums = [3, 0, 0, 0, 1]   (last index = 4)

Show farthest after each cell you actually visit, and explain the moment the answer is decided.`,
    hints: [
      'At each cell i, first check whether i is already past farthest; if so you are stranded.',
      'Update farthest to the max of itself and i plus the jump value at i.',
    ],
    solution: `Start farthest = 0. i=0: 0 is not past farthest, so update farthest = max(0, 0+3) = 3. i=1: 1 is not past 3, update farthest = max(3, 1+0) = 3. i=2: 2 is not past 3, update farthest = max(3, 2+0) = 3. i=3: 3 is not past 3, update farthest = max(3, 3+0) = 3. i=4: 4 IS past farthest (4 is greater than 3), so we are stranded and the answer is false. The decision happens at i=4: the three zeros after the opening 3 cap reach at index 3, and nothing can push farthest to 4, so the last index is unreachable.`,
    tags: ['jump-game', 'greedy', 'tracing'],
  },
  {
    id: 'ds-ch13-t-008',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Why Gas Station Reset Is Safe',
    prompt: `In the gas station problem you sweep a running tank and, whenever the tank goes negative at station i, you jump the candidate start to i+1 and reset the tank to zero. A student worries: "What if the real answer was some station BETWEEN the old start and i that we just skipped over?" Explain why skipping all of those starts loses nothing, and state the separate global check the algorithm still needs.`,
    hints: [
      'Consider any candidate start strictly inside the stretch that just netted negative fuel.',
      'There is also a feasibility test on the totals that no clever sweep can replace.',
    ],
    solution: `If the tank went negative crossing the stretch from the current start through i, then every station strictly inside that stretch also fails as a start: starting later means you begin with even less accumulated fuel over the remaining part of the stretch, so you run dry no later. So none of the skipped starts could have completed the loop, and jumping the candidate to i+1 discards only doomed starts. This is an exchange-argument cousin. Separately, the algorithm still needs the global check that total gas is at least total cost; if the totals do not allow it, no start works at all and the honest answer is none, regardless of the sweep.`,
    tags: ['gas-station', 'greedy', 'invariant'],
  },
  {
    id: 'ds-ch13-t-009',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Coin Change Counterexample',
    prompt: `For coin values 1, 5, 10, 25 the "always take the largest coin that fits" greedy gives the fewest coins. But for coin values 1, 3, 4 and a target of 6, greedy gives the wrong answer. Trace what greedy returns for target 6 with coins {1, 3, 4}, give the true optimal, and say what kind of algorithm is needed to find the optimum.`,
    hints: [
      'Greedy grabs the largest coin not exceeding the remaining amount, repeatedly.',
      'There is a two-coin combination greedy never considers because it commits to the 4 first.',
    ],
    solution: `Greedy on target 6 with {1, 3, 4} grabs the 4 first, leaving 2, which it must pay with two 1s, for a total of three coins (4 + 1 + 1). The true optimal is 3 + 3, just two coins. Greedy was locally smart (the 4 looked best) but globally wrong, because committing to the 4 left an awkward remainder. Only dynamic programming, which methodically considers combinations rather than committing irrevocably, finds the 3 + 3 answer. The lesson: a problem looking greedy is not enough; you must prove the exchange argument or hunt for a small counterexample like this one.`,
    tags: ['greedy', 'coin-change', 'pitfall'],
  },
  {
    id: 'ds-ch13-t-010',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Tie-Breaking in the Sweep Line',
    prompt: `To find the minimum number of meeting rooms, you turn each meeting into a +1 at its start and a -1 at its end, sort all events by time, and sweep tracking the active count; the peak is the answer. For meetings [0, 5] and [5, 9], should the room count be 1 or 2, and what tie-breaking rule on equal timestamps makes the sweep produce that?`,
    hints: [
      'The first meeting ends at exactly the instant the second begins.',
      'Decide whether to process the -1 (end) or the +1 (start) first when both land on the same time.',
    ],
    solution: `The correct room count is 1: the first meeting ends at time 5 exactly when the second begins, so the same room hands off cleanly. To get this, process END events before START events when they share a timestamp. At time 5 you then apply the -1 first (active drops to 0) and only then the +1 (active rises to 1), so the peak is 1. If you instead processed the start first, active would briefly read 2 and you would wrongly demand a second room. Ordering ends before starts on ties is the rule that lets a back-to-back meeting reuse the freed room.`,
    tags: ['meeting-rooms', 'sweep-line', 'pitfall'],
  },
  {
    id: 'ds-ch13-t-011',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Insert Stays Linear',
    prompt: `You keep your busy intervals sorted and non-overlapping. A new meeting arrives and you splice it in with the three-phase sweep (copy the left intervals, absorb the overlapping ones, copy the right tail). A teammate suggests just appending the new interval and re-running the full sort-and-merge instead. Both give a correct result. Explain, in terms of running time, why the three-phase sweep is preferred, and name the invariant that makes it possible.`,
    hints: [
      'What does the input already guarantee about its order, before you touch it?',
      'Compare the cost of one linear pass to the cost of a fresh sort.',
    ],
    solution: `The existing list is already sorted and disjoint, an invariant (a property promised to hold between operations) that you maintain after every operation. The three-phase sweep exploits that order and runs in a single linear pass, O(n). Re-sorting throws the guarantee away and pays n log n just to rediscover an order you already had, so the sweep is asymptotically faster: linear versus n log n. The whole payoff of maintaining the "sorted and disjoint" invariant is that each insert stays cheap; re-sorting out of habit is a classic pitfall that turns an O(n) insert into an n log n one.`,
    tags: ['insert-interval', 'invariant', 'complexity'],
  },
  {
    id: 'ds-ch13-t-012',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Same Goal, One Rule Flips Greedy',
    prompt: `Capacity is 50. Items: A (weight 10, value 60), B (weight 20, value 100), C (weight 30, value 120). The goal "maximize value within the weight limit" is the same in both knapsack variants. In FRACTIONAL knapsack (you may take pieces of an item) greedy-by-density is optimal; in 0/1 knapsack (whole items only) it is wrong. Compute what density-greedy collects in the 0/1 case versus the true 0/1 optimum, and explain the single rule change that breaks greedy.`,
    hints: [
      'Densities are A=6, B=5, C=4 per unit weight; greedy takes them in that order until something does not fit.',
      'In 0/1 you cannot top off the bag with a sliver of the next item.',
    ],
    solution: `Density-greedy takes A then B (weights 10 + 20 = 30, value 60 + 100 = 160), then C needs 30 more but only 20 capacity remains and, with whole items only, you cannot take part of it, so greedy stops at value 160. The true 0/1 optimum is B + C: weights 20 + 30 = 50 exactly, value 100 + 120 = 220. Greedy left 60 of value on the table. The single rule change is the ban on fractions: in fractional knapsack you fill the last bit of the bag with a sliver of the densest remaining item, which is what makes greedy-by-density provably optimal; remove fractions and the densest item can leave awkward leftover capacity, so 0/1 knapsack needs dynamic programming (O(n times W)) instead.`,
    tags: ['knapsack', 'greedy', 'dynamic-programming'],
  },
]

export default problems
