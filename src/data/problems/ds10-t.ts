import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch10-t-001',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'The Three-Step Heartbeat',
    prompt: `Backtracking repeats the same three-step rhythm at every node of the decision tree. In the loop body below, name what each of the three marked lines does and why the order matters.

for option in options_for(path) {
    path.push(option);          // line 1
    backtrack(path, results);   // line 2
    path.pop();                 // line 3
}`,
    hints: [
      'The chapter calls these choose, explore, and un-choose.',
      'Think about what the path must look like when the next loop iteration begins.',
    ],
    solution: `Line 1 is the choose step: it records one option in the current partial solution (the path) by pushing it. Line 2 is the explore step: it recurses one level deeper to see where that choice leads. Line 3 is the un-choose step: it pops the option back off so the path is restored to exactly what it was before line 1. The order matters because the next iteration of the loop must start from a clean path that reflects only the choices on the way from the root to here. If the pop did not immediately follow the recursive call, the next sibling option would inherit leftover state from the branch we just finished and produce wrong answers.`,
    tags: ['backtracking', 'choose-explore-unchoose'],
  },
  {
    id: 'ds-ch10-t-002',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Why Clone the Path?',
    prompt: `The universal template stores finished solutions like this:

results.push(path.clone());

A beginner asks: why not just save results.push(path) and skip the clone to be faster? Explain what would go wrong.`,
    hints: [
      'There is only ONE path buffer, and it keeps changing after you record.',
      'Think about what all the stored entries would show at the very end of the search.',
    ],
    solution: `There is exactly one path buffer, reused for the entire search; it keeps being pushed and popped after you record. If you stored the path itself instead of a copy, every entry in results would point at that same single buffer, so they would all show whatever the buffer happened to contain at the very end of the search (almost certainly the empty path). Calling path.clone() freezes a snapshot of the path at that moment into a fresh, independent Vec, so it stays correct no matter how the live path changes later. In Rust the clone is a real, visible cost because it allocates a new Vec, which is honest: collecting all solutions is inherently expensive since there can be exponentially many of them.`,
    tags: ['backtracking', 'universal-template'],
  },
  {
    id: 'ds-ch10-t-003',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Trace the Subsets Order',
    prompt: `The subset solver records the path at the top of every call and loops forward with start = i + 1:

fn go(nums: &[i32], start: usize, path: &mut Vec<i32>, out: &mut Vec<Vec<i32>>) {
    out.push(path.clone());
    for i in start..nums.len() {
        path.push(nums[i]);
        go(nums, i + 1, path, out);
        path.pop();
    }
}

For nums = [1, 2, 3], write the eight subsets in the exact order they are pushed into out.`,
    hints: [
      'The very first thing recorded is the empty subset, before any push.',
      'It is a depth-first walk: go all the way down the 1 branch before touching 2.',
    ],
    solution: `Because each call records first and then dives deepest into the smallest remaining index, the depth-first order is: [], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]. That is 8 = 2^3 subsets. The empty subset comes first because out.push happens on entry before any element is chosen. After [1,2,3] the recursion unwinds and pops back up to try the next forward index, which is why [1,3] follows [1,2,3] rather than a fresh start. The start = i + 1 rule guarantees we only ever march forward, so no subset is generated twice in a different order (there is no [2,1] to mirror [1,2]).`,
    tags: ['backtracking', 'subsets'],
  },
  {
    id: 'ds-ch10-t-004',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'start Versus i Plus One',
    prompt: `Inside a subset or combination loop you must decide what to pass as the new start index when you recurse. One student writes go(nums, start, ...) and another writes go(nums, i + 1, ...). What is the difference in behavior, and which one correctly enumerates subsets without duplicates?`,
    hints: [
      'One of them lets you pick the same index again on the next level.',
      'Think about whether {1,2} and {2,1} should both appear.',
    ],
    solution: `Passing i + 1 marches strictly forward: each deeper level may only consider indices after the one just chosen, so a given element is never reused and each subset is produced in exactly one order. That is the correct version. Passing start instead keeps the window open at the same starting point, which lets a deeper level re-pick the same index or earlier-relative indices, producing duplicate selections (and for subsets an explosion of repeated work). For plain subsets and combinations of distinct elements you want i + 1. The only place you deliberately pass i (reuse the same index) is combination-sum, where a candidate may be used unlimited times.`,
    tags: ['backtracking', 'subsets', 'combinations'],
  },
  {
    id: 'ds-ch10-t-005',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Counting Subsets Versus Permutations',
    prompt: `For a set of n distinct elements, how many subsets are there, and how many permutations? Give the formula for each and a one-sentence reason. Then say which grows faster as n increases, and what that means for the running time of generating all of them.`,
    hints: [
      'For subsets, each element is independently in or out.',
      'For permutations, count the choices for the first slot, then the second, and so on.',
    ],
    solution: `There are 2^n subsets, because each of the n elements is independently either in or out, which is n binary choices, hence 2 multiplied by itself n times. There are n! (n factorial) permutations, because there are n choices for the first slot, then n-1 for the second, n-2 for the third, and so on down to 1. Factorial grows much faster than 2^n once n is past about 4, so permutations blow up sooner. Generating all subsets takes time on the order of n times 2^n (the total size of the output), and all permutations on the order of n times n!; in both cases the cost is dominated by simply writing down an output that is itself that large.`,
    tags: ['backtracking', 'subsets', 'permutations'],
  },
  {
    id: 'ds-ch10-t-006',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'When Does a Leaf Get Recorded?',
    prompt: `In the subset solver we call out.push(path.clone()) at the TOP of every recursive call. In the permutation solver we instead push only when path.len() == nums.len(). Explain why these two problems record at different moments.`,
    hints: [
      'Ask: is a half-built path already a valid answer for this problem?',
      'A partial subset is still a subset; a partial permutation is not a permutation.',
    ],
    solution: `A subset may contain none, some, or all of the elements, so the partial path at every node of the recursion is already a complete, valid subset, including the empty path at the root. That is why we record on entry to every call; if we recorded only at the bottom we would miss all the smaller subsets. A permutation, by contrast, is an arrangement of all n elements, so a path that has placed only some of them is not yet a valid answer. We must wait until the path reaches length n (every element placed) before recording. The difference is simply what counts as a finished solution for each problem.`,
    tags: ['backtracking', 'subsets', 'permutations'],
  },
  {
    id: 'ds-ch10-t-007',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'The Forgotten Un-Mark',
    prompt: `Here is a permutation solver. It compiles and runs but returns far fewer permutations than n!. What single line is wrong or missing, and what concretely goes wrong during the search?

for i in 0..nums.len() {
    if used[i] { continue; }
    used[i] = true;
    path.push(nums[i]);
    go(nums, used, path, out);
    path.pop();
    // (no reset of used[i] here)
}`,
    hints: [
      'Every choose has a matching un-choose; here the path is restored but the used array is not.',
      'Trace what happens to element 0 after the first full branch finishes.',
    ],
    solution: `The bug is the missing un-choose for the used array: after path.pop() there should also be a used[i] = false; line. Without it, once an element is marked used it stays used forever, even after we backtrack out of the branch that placed it. So when a later sibling branch loops over the elements, every previously placed element is still flagged used and gets skipped by the continue, and the search can no longer build arrangements that reuse those positions. The result is that only a small fraction of the n! permutations are ever discovered. The fix restores the invariant that used[i] reflects only the elements currently on the path: pair every used[i] = true with a used[i] = false on the way back up.`,
    tags: ['backtracking', 'permutations', 'invariant'],
  },
  {
    id: 'ds-ch10-t-008',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Pruning the Overshoot',
    prompt: `Trace combination_sum on candidates = [2, 3] with target = 5, where each candidate may be reused (recurse with i, not i + 1) and a branch is abandoned the instant the remaining target goes below zero. List the only combination found, and name two partial paths that get pruned and why.`,
    hints: [
      'Start at [], remaining = 5. Try +2 then explore; then try +3.',
      'Since all candidates are positive, once remaining is negative no deeper choice can recover.',
    ],
    solution: `The only combination found is [2, 3], which sums to 5. Walking it: from [] with remaining 5 we push 2 (remaining 3), then from [2] we can push another 2 (remaining 1) or push 3 (remaining 0, a hit, recording [2,3]). From [2,2] with remaining 1, pushing 2 gives remaining -1 and pushing 3 gives remaining -2, so [2,2,2] and [2,2,3] are both pruned because remaining went below zero. Separately, starting with [3] (remaining 2) and pushing another 3 gives remaining -1, so [3,3] is pruned too. Because the candidates are positive, a negative remaining can never climb back to zero, so cutting those branches immediately is safe and saves all the deeper exploration beneath them. The same multiset is not re-emitted as [3,2] because reuse marches forward by index.`,
    tags: ['backtracking', 'combinations', 'sum'],
  },
  {
    id: 'ds-ch10-t-009',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Sort First, Then Break',
    prompt: `One combination-sum solver writes if target < 0 { return; } and continues the loop. A stronger version sorts the candidates ascending first and writes if c[i] > target { break; }. Explain why sorting lets you turn a "skip this branch" into a "stop the whole loop", and whether either change improves the worst-case big-O.`,
    hints: [
      'After sorting, what do you know about every candidate that comes after one that already overshoots?',
      'Distinguish practical running time from asymptotic worst case.',
    ],
    solution: `Once the candidates are sorted in ascending order, the moment one candidate exceeds the remaining target, every later candidate in the loop is even larger and will also exceed it, so none of them can succeed. That lets you break out of the entire loop instead of merely skipping the current candidate and continuing, cutting off all the remaining siblings at once. This is a strictly stronger prune. However, neither change improves the worst-case big-O: backtracking is exponential by nature, and a pathological input can still force the tree to be explored in full. What pruning improves is the practical running time on real inputs, often turning billions of explored nodes into thousands; you should be honest that the asymptotic worst case is unchanged.`,
    tags: ['backtracking', 'pruning', 'sum'],
  },
  {
    id: 'ds-ch10-t-010',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Why N-Queens Uses i32 Diagonals',
    prompt: `The N-Queens solver tracks occupied diagonals with two HashSets: one of (row + col) values and one of (row - col) values. Explain why two squares share a diagonal exactly when one of those sums or differences matches, and explain the chapter's warning that row - col must be stored as i32 rather than usize.`,
    hints: [
      'Walk one step along a diagonal: how do row and col change together?',
      'For a cell above the main diagonal, what is the sign of row - col?',
    ],
    solution: `Moving one step down-right along a diagonal increases both row and col by 1, so the difference row - col stays constant along every down-right diagonal; two squares are on the same down-right diagonal exactly when their row - col values are equal. Moving one step down-left increases row by 1 and decreases col by 1, so the sum row + col stays constant along every down-left diagonal; two squares share a down-left diagonal exactly when their row + col values match. That is why three O(1) HashSet lookups (column, row - col, row + col) decide whether a square is safe. The warning about i32 is because row - col is negative for any cell above the main diagonal (for example row 0, col 3 gives -3). Rust's usize cannot hold a negative value and would underflow and panic, so the difference must be stored as a signed i32; the sum row + col is always non-negative, so it could be a usize.`,
    tags: ['backtracking', 'n-queens'],
  },
  {
    id: 'ds-ch10-t-011',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'In-Place Marking Versus a Visited Matrix',
    prompt: `In word search on a grid, the chapter overwrites the current cell with a sentinel like '#' before recursing and restores the original letter afterward, instead of keeping a separate visited matrix. Explain how this saves space, why the restore step is essential, and what subtle bug appears if you forget to restore.`,
    hints: [
      'The grid cell itself doubles as the visited flag while you are standing on it.',
      'The restore is just the un-choose step performed directly on the grid.',
    ],
    solution: `Overwriting the cell with a sentinel makes the grid itself remember which cells are on the current path: a neighbor that sees a '#' knows it cannot step back onto that cell, so no separate visited matrix needs to be allocated, saving O(rows times cols) extra space. The restore is essential because it is the un-choose step: when the recursion returns, the cell must hold its real letter again so that other paths (including searches launched from different starting cells) can legitimately use it. If you forget to restore, the cell stays marked '#' forever; later searches treat that square as permanently blocked even though it is free, so valid words that route through it are missed and the function can wrongly return false. This is exactly the choose / recurse / un-choose pattern, just performed on the grid in place rather than on a Vec.`,
    tags: ['backtracking', 'grid', 'invariant'],
  },
  {
    id: 'ds-ch10-t-012',
    chapter: 10,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'When NOT to Reach for Backtracking',
    prompt: `Backtracking can solve almost any problem built from a sequence of choices, but it is sometimes the wrong tool. Describe the three conditions that make backtracking a good fit, and name two situations where a different technique (such as dynamic programming or a greedy choice) should replace it instead.`,
    hints: [
      'Backtracking shines when you can validate a partial solution early to enable pruning.',
      'Think about overlapping subproblems, and about when a single safe choice removes the need to search.',
    ],
    solution: `Backtracking is a good fit when (1) a solution is built from a sequence of discrete choices, (2) you can check a partial solution's validity incrementally so you can prune branches early, and (3) either n is small or the pruning is strong enough to keep the explored portion of the tree tiny. It is the wrong tool in two main cases. First, if the problem has optimal substructure with overlapping subproblems (the same partial state is reached many different ways), dynamic programming can collapse the exponential search tree into a polynomial table by memoizing those repeated states, which plain backtracking would recompute. Second, if a single greedy choice is provably safe at each step, you can just take it and never search at all. More bluntly, if the tree is genuinely enormous (say 2^40 nodes) with few prunable branches, no cleverness saves you, and you should rethink the problem with DP, greedy, or an approximation rather than searching.`,
    tags: ['backtracking', 'pruning', 'complexity'],
  },
]

export default problems
