import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-ds-10',
  track: 'dsa',
  chapter: 10,
  title: 'Backtracking',
  summary: `Backtracking is how you solve a puzzle when there is no clever formula, only choices: try one option, see how far it gets you, and if it leads to a dead end, undo it and try the next. It is the algorithm behind solving Sudoku, escaping a maze, filling a crossword, and listing every possible seating arrangement at a dinner table. The whole idea is a guided depth-first walk over a tree of decisions, where each node is a partial solution and each branch is one more choice. The magic ingredient, the thing that separates backtracking from blind brute force, is the un-choose step: after exploring a branch you put things back exactly as they were, so the next branch starts from a clean slate.

This chapter teaches one universal template, a path that we grow and shrink and a results list we collect into, and then applies it five times: subsets, permutations, combinations, combination-sum, and N-Queens. You will also learn pruning, the art of cutting off a branch the instant you can prove it cannot succeed, which is what turns an impossibly large search into one that finishes in milliseconds. Backtracking is honestly exponential by nature, so we will be clear-eyed about when it is the right tool and when it is a trap.`,
  sections: [
    {
      heading: 'The decision tree: choose, explore, un-choose',
      anim: 'backtracking-subsets',
      body: `Imagine you are standing at the entrance of a hedge maze. At every junction you pick a direction and walk. If you hit a dead end, you do not despair, you simply *walk back* to the last junction and take a path you have not tried yet. Eventually you have either found the exit or proven there is none. That walk-forward, hit-a-wall, walk-back rhythm is **backtracking**, and almost every backtracking algorithm is exactly this maze walk dressed in different clothes.

We formalize the maze as a **decision tree**. The root is the empty solution (you have made no choices yet). Each level of the tree is one decision, and each branch out of a node is one option for that decision. A leaf is a complete solution, or a dead end. *Solving the problem means visiting the leaves we care about*, and we do it with **depth-first search**: go as deep as possible down one branch before considering any sibling branch.

The heartbeat of backtracking is three steps repeated at every node:

1. **Choose** an option, recording it in our current partial solution (the *path*).
2. **Explore** the consequences of that choice by recursing one level deeper.
3. **Un-choose** by removing the option from the path, so the path is restored to what it was before step 1.

That third step is the whole trick, and beginners forget it constantly. Without the un-choose, choices from one branch leak into the next branch and corrupt it. With it, every branch sees a path that reflects *only* the choices on the way from the root to here, never a leftover from a sibling we already finished. We say the path is **restored to its invariant**: an *invariant* is a condition we promise is always true at a certain point, and ours is "when control returns from a recursive call, the path is exactly what it was before the call."

### Common pitfalls

- Forgetting the un-choose. The path slowly fills with garbage from abandoned branches and your results are nonsense. Every push must be paired with a pop.
- Thinking backtracking is a special data structure. It is not; it is a *control-flow pattern* (recursion plus undo) that you wrap around an ordinary Vec.`,
      code: [
        {
          lang: 'text',
          src: `Picking a 2-element ordering from {A, B} as a decision tree.
Each downward edge is a "choose"; returning up an edge is "un-choose".

                    [ ]              <- root: nothing chosen
                  /     \\
            choose A     choose B
               /            \\
            [A]             [B]
              |               |
          choose B        choose A
              |               |
           [A, B]          [B, A]     <- leaves: complete orderings

Depth-first visiting order:
  []  ->  [A]  ->  [A,B]  (record)  ->  back to [A]  ->  back to []
      ->  [B]  ->  [B,A]  (record)  ->  back to [B]  ->  back to []`,
        },
        {
          lang: 'rust',
          src: `// The shape of EVERY backtracking function. Read it as the maze walk:
fn backtrack(path: &mut Vec<i32>, results: &mut Vec<Vec<i32>>) {
    if is_complete(path) {
        results.push(path.clone()); // a leaf: save a COPY, not the live path
        return;
    }
    for option in options_for(path) {
        path.push(option);          // 1. CHOOSE
        backtrack(path, results);   // 2. EXPLORE one level deeper
        path.pop();                 // 3. UN-CHOOSE (restore the invariant)
    }
}
// We push a clone() at a leaf because 'path' keeps mutating after we return.`,
        },
      ],
    },
    {
      heading: 'The universal template: one path, one results list',
      body: `Almost every backtracking solution shares the same skeleton, and learning it once means you can adapt it to dozens of problems by changing only a few lines. The two pieces of state that travel through the recursion are:

- **path**: a single, mutable Vec that holds the choices made so far on the current root-to-node walk. We grow it with push before recursing and shrink it with pop after. There is exactly one path; it is reused for the entire search, which is what makes backtracking memory-cheap.
- **results**: a Vec of Vecs that accumulates the finished solutions. When the path reaches a leaf we want to keep, we push a *clone* of it into results.

Why a clone? Because path is a single buffer we keep mutating. If we stored the path itself, every entry in results would be a reference to the *same* buffer, and they would all show whatever the buffer happened to contain at the very end (almost certainly empty). The clone freezes a snapshot. In Rust this is a real, visible cost (clone allocates a fresh Vec), which is honest: collecting all solutions is inherently expensive because there can be exponentially many of them.

A second knob most templates need is a **start index** (often called start or pos). It tells the recursion "only consider options from this position onward." This single integer is what distinguishes subsets and combinations (which must not reuse earlier elements, to avoid duplicates) from permutations (which may use any unused element). Keep this knob in mind; it reappears in every example.

### Common pitfalls

- Pushing path instead of path.clone() into results. You end up with N identical (usually empty) Vecs. The clone is mandatory.
- Allocating a brand-new path inside every recursive call. That works but throws away the efficiency; the point of the template is to reuse one buffer and undo your edits.
- Putting the pop in the wrong place, for example after the loop instead of inside it. The pop must immediately follow the recursive call so each iteration starts clean.`,
      code: [
        {
          lang: 'text',
          src: `How 'path' and 'results' evolve. The path is ONE buffer that grows
and shrinks; results holds frozen clones taken at leaves.

  step  action              path (live buffer)   results (snapshots)
  ----  ------------------  ------------------   --------------------
   1    start                [ ]                  [ ]
   2    push 1               [1]                  [ ]
   3    push 2               [1,2]                [ ]
   4    LEAF -> clone        [1,2]                [ [1,2] ]
   5    pop                  [1]                  [ [1,2] ]
   6    pop                  [ ]                  [ [1,2] ]
   7    push 3               [3]                  [ [1,2] ]
   8    LEAF -> clone        [3]                  [ [1,2], [3] ]

results keeps copies; the live path is back to [] when we finish.`,
        },
        {
          lang: 'rust',
          src: `// A reusable template. Fill in the three marked spots per problem.
fn solve(nums: &[i32]) -> Vec<Vec<i32>> {
    let mut results = Vec::new();
    let mut path = Vec::new();
    backtrack(nums, 0, &mut path, &mut results);
    results
}

fn backtrack(
    nums: &[i32],
    start: usize,                  // the "consider from here on" knob
    path: &mut Vec<i32>,
    results: &mut Vec<Vec<i32>>,
) {
    // (A) decide when this node is a solution worth recording:
    results.push(path.clone());

    // (B) iterate the options available from this node:
    for i in start..nums.len() {
        path.push(nums[i]);                 // choose
        backtrack(nums, i + 1, path, results); // explore (i+1 = no reuse)
        path.pop();                         // un-choose
    }
}`,
        },
      ],
    },
    {
      heading: 'All subsets: the power set',
      body: `A **subset** is any selection of elements from a set, where order does not matter and you may pick none, some, or all of them. The collection of *all* subsets is called the **power set**. For the set {1, 2, 3} the power set has eight members, including the empty set and the full set. In general a set of n elements has 2^n subsets, because each element is independently either *in* or *out*: that is n binary choices, hence 2 multiplied by itself n times.

This in-or-out framing gives the cleanest decision tree. At each element we branch two ways: skip it, or take it. But an even tidier formulation, the one our template uses, is this: *every node of the recursion is itself a valid subset*. We record the path at the top of every call, not only at the leaves. Then we loop forward over the remaining elements, and the start index guarantees we never look backward, so we never generate the same subset in two different orders (no {1,2} and {2,1} duplicates).

The complexity is honest and unavoidable: there are 2^n subsets and the total size of all of them is n times 2^n elements, so producing them takes O(n * 2^n) time. There is no faster way, because the *output itself* is that big. Backtracking here is optimal in the sense that it does essentially no wasted work beyond writing down the answer.

Where would you use this? Generating every possible combination of feature flags or configuration options to test, choosing which subset of items to pack, or enumerating every team you could form from a roster. Whenever the question is "consider all possible selections," a subset enumeration is hiding inside.

### Common pitfalls

- Recursing with start instead of i + 1 inside the loop. Using start lets you re-pick the same index and produces duplicates and even infinite-feeling blowup; i + 1 marches strictly forward.
- Recording only at leaves. For subsets the partial path at *every* node is already a valid subset, so record on entry to every call; otherwise you miss the smaller subsets.`,
      code: [
        {
          lang: 'text',
          src: `Subsets of {1,2,3}. Each node is recorded as a subset.
The number on each edge is the index we 'take'; start blocks
us from ever going left, so no duplicates appear.

                         [ ]
            take1 /     take2 |      take3 \\
               [1]          [2]          [3]
        take2 /  \\ take3      | take3
          [1,2]  [1,3]      [2,3]
        take3 |
        [1,2,3]

Recorded in DFS order:
  [], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]   -> 8 = 2^3 subsets`,
        },
        {
          lang: 'rust',
          src: `fn subsets(nums: &[i32]) -> Vec<Vec<i32>> {
    let mut results = Vec::new();
    let mut path = Vec::new();
    go(nums, 0, &mut path, &mut results);
    results
}

fn go(nums: &[i32], start: usize, path: &mut Vec<i32>, out: &mut Vec<Vec<i32>>) {
    out.push(path.clone());           // every node IS a subset, record it
    for i in start..nums.len() {
        path.push(nums[i]);           // choose: take element i
        go(nums, i + 1, path, out);   // explore: only later indices (no reuse)
        path.pop();                   // un-choose
    }
}

fn main() {
    let all = subsets(&[1, 2, 3]);
    assert_eq!(all.len(), 8);         // 2^3 subsets
    // The empty subset is always present:
    assert!(all.contains(&vec![]));
    println!("{all:?}");
}`,
        },
      ],
    },
    {
      heading: 'All permutations: order matters',
      body: `A **permutation** is an arrangement of all the elements where *order matters*: [1,2,3] and [3,2,1] are different permutations of the same three numbers. This is the seating-arrangement problem, who sits in which chair around the table, and the answer count grows even faster than subsets: n elements have n! (n factorial) permutations, because there are n choices for the first slot, then n-1 for the second, then n-2, and so on down to 1.

The decision tree differs from subsets in a key way: at each level we may pick *any element we have not already used*, not just later ones. There is no forward-only start index, because order matters now, so [1,2,3] and [2,1,3] are both wanted. We instead need to track which elements are already in the path so we do not reuse one. Two common ways:

1. A **used** boolean array of length n: used[i] is true while element i sits in the path. Cheap and clear, and it preserves the original ordering of choices.
2. Checking whether the element is already contained in the path (simpler to write, but a contains scan is O(n) per check).

A leaf is reached when the path has length n, meaning every element has been placed; that is when we record. The brute-force-versus-smart distinction is mild here because permutation generation is already near-optimal: O(n * n!) time, dominated by writing out n! answers of length n each. The used array adds only O(n) extra space.

Real-world picture: every ordering of tasks to schedule, every route that visits a fixed set of cities (the brute-force traveling-salesman search), every anagram of a word. When the question is "in how many orders can these go," permutations answer it.

### Common pitfalls

- Forgetting to reset used[i] to false in the un-choose step. The element stays marked used and later branches silently skip it, so you lose most permutations.
- Using a start index out of habit. That gives combinations, not permutations; permutations must look at *all* unused elements at every level.
- Using usize for an index and writing i - 1 when i is 0. In Rust usize cannot go negative, so i - 1 panics with overflow rather than wrapping; guard the boundary.`,
      code: [
        {
          lang: 'text',
          src: `Permutations of {1,2,3}: at each level pick any UNUSED element.
'x' marks already-used; un-choosing flips it back to available.

                          [ ] used:{}
          pick1 /        pick2 |        pick3 \\
        [1] {1}         [2] {2}         [3] {3}
      /      \\
   [1,2]{1,2} [1,3]{1,3}    ... (each subtree mirrors this)
     |           |
  [1,2,3]     [1,3,2]       -> leaves of length 3

Total leaves = 3! = 6:
  [1,2,3] [1,3,2] [2,1,3] [2,3,1] [3,1,2] [3,2,1]`,
        },
        {
          lang: 'rust',
          src: `fn permutations(nums: &[i32]) -> Vec<Vec<i32>> {
    let mut results = Vec::new();
    let mut path = Vec::new();
    let mut used = vec![false; nums.len()]; // which indices are in the path
    go(nums, &mut used, &mut path, &mut results);
    results
}

fn go(nums: &[i32], used: &mut [bool], path: &mut Vec<i32>, out: &mut Vec<Vec<i32>>) {
    if path.len() == nums.len() {
        out.push(path.clone());        // leaf: a full arrangement
        return;
    }
    for i in 0..nums.len() {
        if used[i] { continue; }       // skip elements already placed
        used[i] = true;                // choose
        path.push(nums[i]);
        go(nums, used, path, out);     // explore
        path.pop();                    // un-choose...
        used[i] = false;               // ...and free the element again
    }
}

fn main() {
    let p = permutations(&[1, 2, 3]);
    assert_eq!(p.len(), 6);            // 3! = 6
}`,
        },
      ],
    },
    {
      heading: 'Combinations and combination-sum: pruning enters',
      body: `A **combination** is a subset of a *fixed size* k, with order ignored: the ways to choose k items from n. We write this count as "n choose k". Choosing a 5-card hand from a 52-card deck, or picking 3 toppings from a menu of 10, are combination problems. The code is the subset template with one extra rule: only record when the path has reached length k, and stop descending once it has.

This is where **pruning** earns its keep. Pruning means *cutting off a branch the moment you can prove it cannot lead to a valid solution*, so you never waste time exploring it. For combinations, if we still need more elements than remain available, this branch is hopeless and we skip it entirely. Concretely, if we need k - path.len() more items and only nums.len() - i are left, and the former exceeds the latter, we stop. Pruning does not change the worst case, but in practice it skips vast swaths of the tree and is the difference between "runs instantly" and "runs until the heat death of the universe."

**Combination-sum** sharpens the lesson. Given a list of positive candidate numbers and a target, find every multiset of candidates (each usable unlimited times) that sums to the target. Here pruning is dramatic: if the remaining target ever goes negative, every deeper choice only makes it worse (the candidates are positive), so we abandon the branch instantly. The brute-force alternative, building every sequence and checking its sum at the end, explores enormously more nodes; the prune-on-negative check chops the tree down to only the genuinely promising paths. Note the one twist: because each candidate may be reused, we recurse with i rather than i + 1, allowing the same index again.

### Common pitfalls

- Checking the failure condition (target negative, or path too long) only at the leaf. Check it as early as possible, on entry, so you prune before recursing, not after.
- Mixing up i and i + 1. Use i + 1 when each element is used at most once; use i when reuse is allowed (combination-sum); using start would wrongly allow duplicate combinations.
- Sorting helps pruning: if candidates are sorted ascending, once one candidate overshoots the target you can break out of the loop entirely, since all later ones are even larger.`,
      code: [
        {
          lang: 'text',
          src: `combination_sum(candidates=[2,3], target=5). Reuse allowed (recurse i).
A branch is PRUNED (cut) the instant remaining target goes below 0.

                 target=5, path=[]
            +2 /                  \\ +3
       t=3 [2]                    t=2 [3]
     +2 /     \\ +3              +3 |
  t=1 [2,2]  t=0 [2,3] FOUND   t=-1 [3,3] PRUNED (t<0, stop)
   +2 |
 t=-1 [2,2,2] PRUNED

Found: [2,3]  (the same multiset is not re-emitted as [3,2]).
Pruned branches are never expanded -> huge time savings.`,
        },
        {
          lang: 'rust',
          src: `// Combinations: choose exactly k of 1..=n, with a "not enough left" prune.
fn combine(n: i32, k: i32) -> Vec<Vec<i32>> {
    let mut out = Vec::new();
    let mut path = Vec::new();
    fn go(start: i32, n: i32, k: i32, path: &mut Vec<i32>, out: &mut Vec<Vec<i32>>) {
        if path.len() as i32 == k {
            out.push(path.clone());
            return;
        }
        let need = k - path.len() as i32;       // how many more we must pick
        // PRUNE via the loop bound: the last start that still leaves 'need'
        // numbers (i..=n) is n - need + 1, so we never even try doomed picks.
        for i in start..=(n - need + 1) {
            path.push(i);
            go(i + 1, n, k, path, out);          // i+1: each number used once
            path.pop();
        }
    }
    go(1, n, k, &mut path, &mut out);
    out
}

// Combination-sum: positive candidates, unlimited reuse, prune on overshoot.
fn combination_sum(candidates: &[i32], target: i32) -> Vec<Vec<i32>> {
    let mut out = Vec::new();
    let mut path = Vec::new();
    fn go(c: &[i32], start: usize, target: i32, path: &mut Vec<i32>, out: &mut Vec<Vec<i32>>) {
        if target == 0 { out.push(path.clone()); return; } // exact hit
        if target < 0 { return; }                          // PRUNE: overshot
        for i in start..c.len() {
            path.push(c[i]);
            go(c, i, target - c[i], path, out);            // i: reuse allowed
            path.pop();
        }
    }
    go(candidates, 0, target, &mut path, &mut out);
    out
}

fn main() {
    assert_eq!(combine(4, 2).len(), 6);                    // 4 choose 2
    assert_eq!(combination_sum(&[2, 3], 5), vec![vec![2, 3]]);
}`,
        },
      ],
    },
    {
      heading: 'N-Queens: backtracking with constraint sets',
      body: `The **N-Queens** puzzle asks you to place n chess queens on an n-by-n board so that no two attack each other. A queen attacks along its row, its column, and both diagonals, so the constraints are tight, and for n = 8 there are over four billion ways to drop eight queens but only 92 that work. This is the canonical hard backtracking problem, and it shows two ideas at once: structuring the search to make constraints cheap, and using sets to check those constraints in O(1).

The first insight collapses the search space: place exactly *one queen per row*, going row by row. That instantly removes all row conflicts (each row has one queen by construction) and turns the decision at row r into a single question: which *column* gets the queen in this row? So our path is an array col_of_row where col_of_row[r] is the chosen column for row r.

Now we only have to forbid column and diagonal clashes. The clever part is recognizing the diagonals as arithmetic. Two squares are on the same *down-right* diagonal exactly when row minus column is equal; on the same *down-left* diagonal when row plus column is equal. So we keep three HashSets: occupied columns, occupied (row - col) values, and occupied (row + col) values. Checking whether a square is safe is three set lookups, each O(1) on average. Placing a queen inserts three values; backtracking removes the same three, our familiar choose/un-choose, now over sets instead of a Vec. In Rust, row - col can be negative, so store it as an i32, not a usize, which cannot go below zero.

Without the sets you would rescan the whole partial board for conflicts at every placement, an O(n) check per cell. With the sets it is O(1), and combined with the row-by-row structure the solver handles n = 12 or more comfortably. This is exactly how a Sudoku solver works too: pick the next empty cell, try each digit, check row/column/box sets in O(1), recurse, and undo on failure.

### Common pitfalls

- Storing the diagonal key in a usize. row - col is negative for cells above the main diagonal and underflows; use i32 for the difference (the sum is always non-negative, so it may be usize).
- Forgetting to remove all three set entries on un-choose. A leftover entry poisons sibling branches into thinking a safe square is attacked.
- Not pruning early. Check safety *before* placing and recursing; placing first and checking at the leaf throws away backtracking's whole advantage.`,
      code: [
        {
          lang: 'text',
          src: `4-Queens, one queen per row. Try columns left to right; backtrack
on conflict. '.' empty, 'Q' queen, 'x' a square attacked from above.

row0: place Q at col0          row1: col0,1 attacked -> col2
  Q . . .                        Q . . .
  x x . .                        x x Q .
  x . x .                        x x x x
  x . . x                        x . x x

In the right board the queen at (1,2) attacks col2 and the
down-diagonals to (2,1),(2,3),(3,0). Combined with (0,0)'s
column and diagonal, EVERY square in row2 is attacked, so
row2 is a dead end and we must backtrack.

A full solving trace for n=4 (col chosen per row), . = backtrack:
  r0=0 -> r1=2 -> r2 DEAD (no safe col) . back
  r0=0 -> r1=3 -> r2=1 -> r3 DEAD . back .. back
  r0=1 -> r1=3 -> r2=0 -> r3=2  SOLVED:
        . Q . .
        . . . Q
        Q . . .
        . . Q .`,
        },
        {
          lang: 'rust',
          src: `use std::collections::HashSet;

fn solve_n_queens(n: i32) -> Vec<Vec<i32>> {
    let mut solutions = Vec::new();
    let mut cols: HashSet<i32> = HashSet::new();      // taken columns
    let mut diag1: HashSet<i32> = HashSet::new();     // taken (row - col)
    let mut diag2: HashSet<i32> = HashSet::new();     // taken (row + col)
    let mut placement: Vec<i32> = Vec::new();         // column chosen per row

    fn go(
        row: i32, n: i32,
        cols: &mut HashSet<i32>, diag1: &mut HashSet<i32>, diag2: &mut HashSet<i32>,
        placement: &mut Vec<i32>, solutions: &mut Vec<Vec<i32>>,
    ) {
        if row == n {                                 // all rows filled: a leaf
            solutions.push(placement.clone());
            return;
        }
        for col in 0..n {
            // PRUNE: skip any square already attacked. d1 can be negative -> i32.
            if cols.contains(&col)
                || diag1.contains(&(row - col))
                || diag2.contains(&(row + col)) {
                continue;
            }
            cols.insert(col);                         // choose: occupy 3 lines
            diag1.insert(row - col);
            diag2.insert(row + col);
            placement.push(col);
            go(row + 1, n, cols, diag1, diag2, placement, solutions); // explore
            placement.pop();                          // un-choose: vacate them
            cols.remove(&col);
            diag1.remove(&(row - col));
            diag2.remove(&(row + col));
        }
    }

    go(0, n, &mut cols, &mut diag1, &mut diag2, &mut placement, &mut solutions);
    solutions
}

fn main() {
    assert_eq!(solve_n_queens(4).len(), 2);   // exactly 2 ways for 4x4
    assert_eq!(solve_n_queens(8).len(), 92);  // the classic 92 solutions
}`,
        },
      ],
    },
    {
      heading: 'Word search on a grid: visited-marking and in-place undo',
      body: `**Word search** asks: given a grid of letters and a target word, can you trace the word by stepping between *adjacent* cells (up, down, left, right), never reusing the same cell twice in one path? This is a crossword-style problem and it shows backtracking on a 2-D grid rather than over a list, plus a neat space-saving trick for the un-choose.

The search starts from every cell that matches the word's first letter, then walks outward letter by letter. At each step we look at the four neighbors; for each neighbor whose letter matches the *next* character of the word, we recurse. We reach success when we have matched every character. The fresh wrinkle is preventing a cell from being used twice within a single path: a queen problem used sets, but here the elegant move is **in-place visited-marking**. Before recursing into a cell we temporarily overwrite its letter with a sentinel like a hash mark, so neighbors cannot step back onto it. After the recursion returns, we *restore the original letter*. That restore is the un-choose step, performed directly on the grid, and it lets us avoid allocating a separate visited matrix.

Pruning is built into the loop: we only recurse into a neighbor when its letter matches the character we need next, so a single mismatch cuts that entire branch. The brute force of generating all length-L paths and checking them would be astronomically larger; matching letter-by-letter keeps us on viable paths only. The worst-case complexity is O(rows * cols * 4^L) where L is the word length, since each step has up to four directions, but pruning means we rarely approach it. Note the directions are stored as offsets; because grid coordinates are usize in Rust and cannot go negative, we do the arithmetic in signed i32 and bounds-check before indexing.

This same pattern, mark-visited then recurse then unmark, is exactly how a maze solver explores: each cell is "stepped on" while you search through it and "stepped off" when you back out. Flood fills, counting islands, and path-finding all reuse it.

### Common pitfalls

- Forgetting to restore the cell's letter after recursion. The cell stays marked visited and later searches (from other starts) wrongly treat it as blocked.
- Computing a neighbor index in usize when the offset is -1 at row or column 0. That underflows and panics; compute in i32 and bounds-check before converting back.
- Not bounds-checking before indexing the grid. Out-of-range access panics in Rust; always confirm 0 <= r < rows and 0 <= c < cols first.`,
      code: [
        {
          lang: 'text',
          src: `Searching for "ABCC" in the grid below. # marks the current path
(temporarily overwritten); on backtrack each # reverts to its letter.

  grid:        find A at (0,0), walk A->B->C->C
   A B E
   S C C        path so far     grid view (# = on current path)
   A D E
                A            -> # B E / S C C / A D E
                A B          -> # # E / S C C / A D E
                A B C        -> # # E / S # C / A D E  (1,1)
                A B C C      -> # # E / S # # / A D E  MATCH!

If a step has no matching neighbor, restore the # back to its letter
and try a different direction (this is the un-choose on the grid).`,
        },
        {
          lang: 'rust',
          src: `fn exist(board: &mut Vec<Vec<char>>, word: &str) -> bool {
    let word: Vec<char> = word.chars().collect();
    let rows = board.len();
    let cols = board[0].len();
    for r in 0..rows {
        for c in 0..cols {
            if dfs(board, &word, r, c, 0) { return true; }
        }
    }
    false
}

fn dfs(board: &mut Vec<Vec<char>>, word: &[char], r: usize, c: usize, k: usize) -> bool {
    if board[r][c] != word[k] { return false; }      // PRUNE: letter mismatch
    if k + 1 == word.len() { return true; }          // matched the last char

    let saved = board[r][c];
    board[r][c] = '#';                               // choose: mark visited

    // Four directions, computed in signed math to avoid usize underflow.
    let dirs: [(i32, i32); 4] = [(-1, 0), (1, 0), (0, -1), (0, 1)];
    let mut found = false;
    for (dr, dc) in dirs {
        let nr = r as i32 + dr;
        let nc = c as i32 + dc;
        // bounds-check BEFORE indexing (Rust panics on out-of-range):
        if nr >= 0 && nr < board.len() as i32 && nc >= 0 && nc < board[0].len() as i32 {
            if dfs(board, word, nr as usize, nc as usize, k + 1) {
                found = true;
                break;
            }
        }
    }
    board[r][c] = saved;                             // un-choose: restore letter
    found
}

fn main() {
    let mut grid = vec![
        vec!['A', 'B', 'E'],
        vec!['S', 'C', 'C'],
        vec!['A', 'D', 'E'],
    ];
    assert!(exist(&mut grid, "ABCC"));
    assert!(!exist(&mut grid, "ABCB"));             // can't reuse the same B
}`,
        },
      ],
    },
    {
      heading: 'Pruning, honest complexity, and when to reach for it',
      body: `Backtracking is *exponential by nature*, and pretending otherwise will burn you. In the worst case the decision tree has on the order of 2^n, n!, or k^n nodes depending on the problem, and visiting all of them is unavoidable when the answer truly is that large (every subset, every permutation). So the right question is never "how do I make this polynomial," it is "how do I avoid visiting nodes that cannot lead to an answer." That is **pruning**, and it is the soul of practical backtracking.

A prune is any check that lets you skip a branch without exploring it. The three flavors you have now seen:

- **Feasibility prune**: the partial solution already violates a constraint, so no completion can fix it. N-Queens skips an attacked square; word search skips a mismatched letter.
- **Bound prune**: even the most optimistic completion cannot reach the goal. Combination-sum quits when the running sum overshoots a positive target; combinations quit when too few elements remain.
- **Ordering for prunes**: sorting the candidates so that once one option fails by overshooting, every later option fails too, letting you break out of the loop instead of merely continuing.

Pruning does not improve the worst-case big-O (a pathological input still explores everything), but on real inputs it routinely turns billions of nodes into thousands. That gap is why a Sudoku solver returns instantly even though Sudoku is NP-complete in the general case.

When is backtracking the *right* tool? When (1) a solution is built from a sequence of discrete choices, (2) you can check a partial solution's validity incrementally so you can prune early, and (3) either n is small or pruning is strong enough to keep the explored portion tiny. If instead the problem has optimal substructure with overlapping subproblems, dynamic programming may collapse the exponential tree into a polynomial table; if a greedy choice is provably safe, take it. Reach for backtracking when there is no such shortcut and you must genuinely *search*, but always pair it with the strongest pruning you can justify.

### Common pitfalls

- Pruning at the leaf instead of on entry. The whole point is to cut a branch *before* descending it; a check that only fires at the bottom saves nothing.
- Believing pruning changes the asymptotic complexity. It changes the *practical* running time on real inputs; the worst case is still exponential, and you should say so honestly.
- Reaching for backtracking when n is large and pruning is weak. If the tree is genuinely 2^40 nodes with few prunable branches, no amount of cleverness saves you; rethink the problem (DP, greedy, or an approximation).`,
      code: [
        {
          lang: 'text',
          src: `Why pruning matters: combination-sum on [2,3,5], target=8.
Left tree = no prune (build everything, check at end).
Right tree = prune the instant target < 0. Crossed nodes are skipped.

  NO PRUNE (explores deep dead ends):     PRUNE (cut on overshoot):
        t=8                                     t=8
     /   |   \\                               /   |   \\
   t=6  t=5  t=3                            t=6  t=5  t=3
   ...  ...  ...                            ...  ...  ...
   t=-2 explored then rejected   <--->      t=-2  X  never created

Same correct answers; the right tree expands far fewer nodes.
On bigger inputs this is the difference between ms and hours.`,
        },
        {
          lang: 'rust',
          src: `// A prune so strong it BREAKS the loop: sort first, stop at first overshoot.
fn combination_sum_sorted(candidates: &[i32], target: i32) -> Vec<Vec<i32>> {
    let mut c = candidates.to_vec();
    c.sort_unstable();                       // ascending order enables break
    let mut out = Vec::new();
    let mut path = Vec::new();
    fn go(c: &[i32], start: usize, target: i32, path: &mut Vec<i32>, out: &mut Vec<Vec<i32>>) {
        if target == 0 { out.push(path.clone()); return; }
        for i in start..c.len() {
            // Sorted: if this candidate overshoots, every LATER one does too.
            if c[i] > target { break; }      // bound prune that ends the loop
            path.push(c[i]);
            go(c, i, target - c[i], path, out);
            path.pop();
        }
    }
    go(&c, 0, target, &mut path, &mut out);
    out
}

fn main() {
    // Exponential in the worst case, but pruning keeps real inputs fast.
    let r = combination_sum_sorted(&[2, 3, 5], 8);
    // [2,2,2,2], [2,3,3], [3,5] are the three multisets summing to 8.
    assert_eq!(r.len(), 3);
}`,
        },
      ],
    },
  ],
  takeaways: [
    'Backtracking is a depth-first walk over a decision tree: choose an option, explore by recursing, then un-choose to restore state and try the next.',
    'The un-choose (pop / unmark / remove) is mandatory; pair every choose with it so sibling branches never see leftover state.',
    'The universal template is one mutable path Vec plus a results Vec; push a path.clone() at each accepted leaf because the live path keeps mutating.',
    'A start index marching forward (i + 1) prevents duplicate subsets and combinations; permutations instead track used elements and consider all of them.',
    'Subsets: 2^n of them, record every node. Permutations: n! of them, record at length-n leaves. Combinations: choose exactly k.',
    'Pruning cuts a branch the instant it cannot succeed; combination-sum quits when the target goes negative, the prune that makes it practical.',
    'N-Queens places one queen per row and checks columns and both diagonals with O(1) HashSet lookups; store row-minus-col as i32 since it can be negative.',
    'Grid problems (word search, mazes) use in-place visited-marking: overwrite a cell before recursing, restore it after, avoiding a separate visited matrix.',
    'Backtracking is genuinely exponential; pruning lowers real-world time, not the worst-case big-O, so be honest about complexity.',
    'Reach for backtracking when a solution is a sequence of choices you can validate incrementally and either n is small or pruning is strong.',
  ],
  cheatsheet: [
    { label: 'choose / explore / un-choose', value: 'path.push(x); recurse(...); path.pop();' },
    { label: 'record a solution', value: 'results.push(path.clone()) — clone freezes a snapshot' },
    { label: 'no-reuse recursion', value: 'recurse with start = i + 1 (subsets, combinations)' },
    { label: 'reuse-allowed recursion', value: 'recurse with start = i (combination-sum)' },
    { label: 'permutations', value: 'track used: &mut [bool]; reset used[i]=false on un-choose' },
    { label: 'subsets count', value: '2^n; total work O(n * 2^n)' },
    { label: 'permutations count', value: 'n! (factorial); total work O(n * n!)' },
    { label: 'combinations count', value: 'n choose k; record only when path.len() == k' },
    { label: 'feasibility prune', value: 'skip a branch that already breaks a constraint' },
    { label: 'bound prune', value: 'if target < 0 { return } — overshoot is hopeless' },
    { label: 'sorted break prune', value: 'sort_unstable then if c[i] > target { break }' },
    { label: 'N-Queens diagonals', value: 'same diag iff (row - col) or (row + col) equal; use i32' },
    { label: 'std::collections::HashSet', value: 'O(1) insert/contains/remove for column & diagonal checks' },
    { label: 'grid visited-marking', value: 'board[r][c] = sentinel before recurse, restore after' },
  ],
}

export default note
