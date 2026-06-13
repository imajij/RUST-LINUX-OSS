import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch02-t-001',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'What Makes a Sweep Linear',
    prompt: `The brute-force way to find whether two songs in a sorted list add up to a target length uses two loops nested inside each other. The two-pointer way uses a single loop with one pointer at the front and one at the back, walking inward. In one or two sentences, explain why the brute force is called O(n squared) and the two-pointer version is called O(n), using the phrase "re-scan all the others" somewhere in your answer.`,
    hints: [
      'Think about how many times the inner loop runs for each step of the outer loop.',
      'In the two-pointer version, count how far each pointer can travel in total.',
    ],
    solution: `The brute force is O(n squared), read "order n squared", because for every one of the n items the inner loop has to re-scan all the others, so you do roughly n times n comparisons; when n doubles, the work roughly quadruples. The two-pointer version is O(n), "order n" or linear, because there is only one loop: the front pointer can only move right and the back pointer can only move left, and they stop the moment they meet, so together they take at most n steps with a constant amount of work each. Doubling n only doubles the work instead of quadrupling it.`,
    tags: ['two-pointers', 'complexity', 'array'],
  },
  {
    id: 'ds-ch02-t-002',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'The Two Shapes of Two Pointers',
    prompt: `The chapter teaches two distinct two-pointer patterns. One starts a pointer at each end and walks them toward the middle; the other starts both pointers at the front and moves them forward at different speeds. Name each pattern, give the loop condition the chapter uses for the first one, and name one problem each pattern solves.`,
    hints: [
      'One pattern is named for where its pointers start; the other for a "read" and a "write" role.',
      'The inward-walking loop almost always uses a strict less-than comparison so the pointers stop when they meet.',
    ],
    solution: `The first is the opposite-ends pattern: lo starts at index 0, hi starts at the last index, and they walk inward under the loop condition while lo < hi (strict, so they stop when they meet). It powers pair-sum search, palindrome checks, in-place reversal, and container-with-most-water. The second is the fast/slow (same-direction) pattern: a slow write cursor trails a fast read cursor, both moving forward from the front. It powers in-place deduplication, moving zeroes to the end, and partitioning. Recognizing which shape a problem wants is half the skill.`,
    tags: ['two-pointers', 'opposite-ends', 'fast-slow'],
  },
  {
    id: 'ds-ch02-t-003',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'The usize Underflow Trap',
    prompt: `A first-year student coming from Python writes this loop to walk a back pointer down a Vec:

let mut hi = v.len() - 1;
while hi >= 0 {
    // ... look at v[hi] ...
    hi -= 1;
}

They expect the loop to stop after hi reaches 0. In Rust this is broken in two different ways. Describe both problems and explain why they happen.`,
    hints: [
      'What is the type of an index into a Vec, and can it ever be negative?',
      'Also think about what happens to v.len() - 1 if the Vec is empty.',
    ],
    solution: `A Vec index has type usize, an unsigned integer, so it can never be negative. The condition while hi >= 0 is therefore always true: hi can never drop below 0, so the loop tries to keep going. When hi is 0 and the body runs hi -= 1, Rust does not produce -1 like Python; in a debug build it panics with "attempt to subtract with overflow", and in a release build it silently wraps around to a gigantic number (about 18446744073709551615), which then crashes the moment you index with it. The second problem is the very first line: if v is empty, v.len() is 0, so v.len() - 1 underflows immediately for the same reason. The fix is to guard the empty case first and let a loop condition like while lo < hi prove that hi is at least 1 before any decrement.`,
    tags: ['usize', 'overflow', 'two-pointers'],
  },
  {
    id: 'ds-ch02-t-004',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Trace the Palindrome Check',
    prompt: `Using the opposite-ends pointers lo and hi on the ASCII bytes of the word "level", hand-trace the loop while lo < hi that compares b[lo] with b[hi] and steps both inward on a match. List each comparison made, and say whether the final answer is true or false. The letters are at indices: l=0, e=1, v=2, e=3, l=4.`,
    hints: [
      'Start lo at 0 and hi at 4, compare, then move both inward only on a match.',
      'The loop stops as soon as lo is no longer strictly less than hi.',
    ],
    solution: `Trace: lo=0, hi=4 compares b[0]='l' with b[4]='l', they match, so step in to lo=1, hi=3. Now compare b[1]='e' with b[3]='e', they match, so step in to lo=2, hi=2. The loop condition while lo < hi is now false (2 is not less than 2), so the loop stops. Two comparisons were made and both matched, and the middle character 'v' at index 2 never needs checking because a single middle character is always its own mirror. The answer is true: "level" is a palindrome.`,
    tags: ['two-pointers', 'palindrome', 'string'],
  },
  {
    id: 'ds-ch02-t-005',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Sorted Is a Precondition',
    prompt: `A student takes the sorted-array pair-sum two-pointer routine (move lo right when the sum is too small, move hi left when it is too big) and runs it unchanged on the UNSORTED array [5, 1, 8, 3] looking for a pair summing to 9. The correct answer is that 1 and 8 add to 9. Explain what goes wrong and why this kind of bug is especially dangerous.`,
    hints: [
      'The whole "move left to grow, move right to shrink" logic depends on smaller values sitting on the left.',
      'Does the routine crash, or does it return a wrong answer quietly?',
    ],
    solution: `The routine assumes the array is sorted: it relies on smaller values being on the left so that moving lo right increases the sum and moving hi left decreases it. On [5, 1, 8, 3] that assumption is false, so the "decision" about which pointer to move points in the wrong direction and the scan can sail right past the real pair (1 and 8) and report None. The danger is that it does not crash; it returns a wrong answer silently, which is worse than a panic because nothing flags the mistake. The fix is to respect the precondition: sort first (which costs O(n log n)) or, if you only need existence, scan once with a HashSet of values you still need.`,
    tags: ['two-pointers', 'sorted', 'two-sum'],
  },
  {
    id: 'ds-ch02-t-006',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Naming the Read/Write Invariant',
    prompt: `In the in-place dedup of a sorted Vec, a slow write cursor trails a fast read cursor. The chapter says the loop maintains an invariant. State that invariant in your own words, and explain what role naming it plays in trusting the code.`,
    hints: [
      'An invariant is a statement that stays true at every step of the loop.',
      'Think about what is guaranteed to be sitting in the positions before the write cursor.',
    ],
    solution: `An invariant is a statement that stays true at every step of the loop. Here the invariant is: everything before the write cursor (the slice v[0..write]) is the unique, compacted prefix of the values seen so far. Naming it turns a fiddly index dance into something you can reason about: you check that each iteration preserves it (a genuinely new value gets copied to v[write] and write advances; a duplicate is skipped, leaving the prefix untouched), and then when the read cursor finishes, the invariant tells you the first write elements are exactly the answer. That is why the loop is correct, not just plausible.`,
    tags: ['two-pointers', 'fast-slow', 'invariant'],
  },
  {
    id: 'ds-ch02-t-007',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why Merge Is Not In Place',
    prompt: `Almost every two-pointer routine in this chapter (reverse, palindrome, dedup, move-zeroes, partition) uses only O(1) extra space. Merging two sorted lists with two pointers is the one routine that needs O(m + n) extra space. Explain why merge is the exception while the others are not.`,
    hints: [
      'What does "extra" or "auxiliary" space mean, and where do the other routines do their work?',
      'Think about whether you can interleave two separate input arrays into a single output without somewhere to put the result.',
    ],
    solution: `"Extra" (auxiliary) space means memory beyond the input itself. The other routines rewrite the single input buffer in place, swapping or copying within the array the caller already gave you, so they allocate nothing that grows with n, just a couple of usize indices: that is O(1) auxiliary space. Merging takes two separate sorted inputs of sizes m and n and produces a brand-new combined list; you cannot interleave two distinct arrays into one sorted sequence without somewhere to put the answer, and that answer is itself a new collection of m + n elements. So the O(m + n) space is the output, and it is unavoidable whenever the result is a new collection rather than a rearrangement of the input.`,
    tags: ['two-pointers', 'merge', 'complexity'],
  },
  {
    id: 'ds-ch02-t-008',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Why Move the Shorter Wall',
    prompt: `In container-with-most-water you have lo and hi at two walls; the water held is the width (hi - lo) times the height of the SHORTER wall. The greedy rule is: always move the pointer at the shorter wall inward. Suppose lo points at a wall of height 3 and hi at a wall of height 8. Argue carefully why moving hi (the taller wall) inward can never improve on the current best, so the only move worth making is to advance lo.`,
    hints: [
      'After any inward move the width strictly shrinks. What stays capped?',
      'Compare the new height cap to the old one when you keep the short wall fixed.',
    ],
    solution: `The area is width times the shorter wall, here min(3, 8) = 3, so the left wall of height 3 is the limiting factor. If you move hi inward, the width (hi - lo) strictly shrinks because the pointers got closer, and the shorter wall is still capped at 3 or even less (the new right wall might be shorter than 8, but it can never raise the cap above the left wall of 3). So the area can only stay the same or get worse, never better; every container that keeps this short left wall and a narrower width is already beaten by the one you just measured. The only move with any hope of improving is to advance lo, because replacing the short wall is the only way to lift the height cap. That "we proved the skipped options cannot win" argument is what makes the single O(n) pass correct, not just fast.`,
    tags: ['two-pointers', 'greedy', 'array'],
  },
  {
    id: 'ds-ch02-t-009',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Compare Against the Last Kept Value',
    prompt: `Two students dedup a sorted Vec with a write cursor. One writes the test as v[read] != v[write - 1]; the other writes v[read] != v[read - 1]. On the sorted input [1, 1, 1, 2] both happen to give the right answer, but the second version is the buggy one the chapter warns about. Explain which value each version actually compares against, and describe the situation where they diverge.`,
    hints: [
      'write - 1 points at the last value you decided to KEEP; read - 1 points at the previous SCANNED value.',
      'On sorted input the two only ever differ in subtle ways; think about what the write cursor is guarding.',
    ],
    solution: `v[write - 1] is the last value you committed to keep (the top of the compacted prefix), while v[read - 1] is simply the element the read cursor visited one step earlier. The correct dedup compares the candidate v[read] against the last KEPT value, because that is what determines whether v[read] is genuinely new. Comparing against v[read - 1] (the previous scanned value) happens to work for plain adjacent-duplicate removal on sorted data because equal values are contiguous, but it is reasoning about the wrong reference point: the moment you generalize the compaction (for example "keep at most k copies", where you must look back at v[write - k]), comparing against the previous scanned element breaks, while comparing against the last kept value is what stays correct. The habit to learn is: always compare the incoming element to the last value you actually kept.`,
    tags: ['two-pointers', 'fast-slow', 'sorted'],
  },
  {
    id: 'ds-ch02-t-010',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Trace Move-Zeroes by Swapping',
    prompt: `Hand-trace move-zeroes on [0, 4, 0, 2] using the read/write pattern: write starts at 0, read scans 0..len, and on each non-zero you do v.swap(write, read) then advance write. Show the Vec contents after each read step, and state the final array. Then say why the chapter insists on SWAPPING rather than copying the non-zero forward.`,
    hints: [
      'write only advances when a non-zero is placed; zeros are skipped by read.',
      'A swap exchanges two slots, so the array always stays a permutation of the original.',
    ],
    solution: `Start [0, 4, 0, 2], write=0. read=0: v[0]=0 is zero, skip, write stays 0. read=1: v[1]=4 is non-zero, swap(write=0, read=1) gives [4, 0, 0, 2], write advances to 1. read=2: v[2]=0 is zero, skip, write stays 1. read=3: v[3]=2 is non-zero, swap(write=1, read=3) gives [4, 2, 0, 0], write advances to 2. The loop ends with [4, 2, 0, 0]: non-zeroes 4 and 2 kept their original order and the zeroes fell to the end. The chapter insists on swapping rather than copying because a swap exchanges the two slots, so the array always remains a permutation of the original values; a plain copy would overwrite the destination and could duplicate one value while losing another.`,
    tags: ['two-pointers', 'fast-slow', 'in-place'],
  },
  {
    id: 'ds-ch02-t-011',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Bytes Versus Characters in a UTF-8 String',
    prompt: `The ASCII palindrome check uses s.as_bytes() and moves each pointer by one byte. A student reuses it to test whether the string "abccba" reads the same both ways and it works, then tries it on a string containing multi-byte Unicode characters and gets wrong answers. Explain the pitfall, and say what the chapter recommends instead for real Unicode input.`,
    hints: [
      'Rust strings are UTF-8: how many bytes does one human character take?',
      'If one pointer step moves one byte but a character spans several bytes, what goes wrong?',
    ],
    solution: `Rust strings are stored as UTF-8, so a single human character can occupy several bytes. The byte view from as_bytes() is fine when the input is known to be plain ASCII, because there every character is exactly one byte, so moving a pointer by one byte moves it by one character. But for general Unicode, stepping one byte at a time lands the pointer in the MIDDLE of a multi-byte character, comparing half-characters against each other and producing wrong answers (or, if you indexed an &str directly by a byte offset, even a panic). The chapter's recommendation is to first collect the characters into a Vec<char> with s.chars().collect(), so that each pointer step advances by exactly one whole character regardless of how many bytes it takes. Use the fast byte path only when you know the input is ASCII.`,
    tags: ['two-pointers', 'string', 'palindrome'],
  },
  {
    id: 'ds-ch02-t-012',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'One Pass Versus a Loop Inside a Loop',
    prompt: `A student claims: "My algorithm does THREE separate two-pointer sweeps over the array one after another, so it must be O(n cubed)." Another student's algorithm has a single outer loop, and inside it a fresh inner loop that restarts and scans the whole array each time. The second student claims theirs is O(n) "because it is just two pointers." Both claims are wrong. Give the correct big-O for each and explain the difference between sweeps done back-to-back and a loop that restarts inside another loop.`,
    hints: [
      'Adding a constant number of O(n) passes does not change the order of growth.',
      'A loop that restarts from scratch inside another loop multiplies the counts.',
    ],
    solution: `The first student's algorithm is O(n), not O(n cubed). Running three independent O(n) sweeps back-to-back does about 3n total work, and constant multipliers are dropped in big-O, so three (or any fixed number of) linear passes is still linear, O(n). The second student's algorithm is O(n squared), not O(n). The label "two pointers" is not what makes something linear; what makes the chapter's routines O(n) is that each pointer moves in one direction and never revisits an index, giving one combined pass. Here the inner loop RESTARTS and re-scans the whole array for every step of the outer loop, so it runs about n times n = n squared steps; that is the classic nested-loop cost the technique exists to avoid. The rule of thumb: passes performed in sequence add (and stay the same order), but a loop that starts over inside another loop multiplies.`,
    tags: ['two-pointers', 'complexity', 'array'],
  },
]

export default problems
