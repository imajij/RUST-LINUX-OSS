import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'ds-ch01-t-001',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Why Indexing Is Constant Time',
    prompt: `An array of i32 starts at memory address 1000, and each i32 is 4 bytes wide. Without scanning the array, work out the address the computer reads when you write arr[3]. Then explain in one sentence why reading arr[3] costs the same as reading arr[3000].`,
    hints: [
      'The address is computed as base plus index times element size.',
      'Notice that the formula does not depend on how big the index is.',
    ],
    solution: `The computer finds element i with the formula base + i times element size. Here that is 1000 + 3 * 4 = 1000 + 12 = 1012, so arr[3] reads address 1012 (which holds the value 40 in the note's example). Reading arr[3000] uses the very same one multiply, one add, one memory read; the arithmetic does not get harder just because the index is larger. Because the work never grows with the index or the array length, indexing is O(1), or constant time.`,
    tags: ['array', 'indexing', 'big-o'],
  },
  {
    id: 'ds-ch01-t-002',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'The Last Valid Index',
    prompt: `A Rust array has length 5. A beginner writes arr[5] expecting to read the last element, but the program panics. What is the valid range of indices for this array, which index actually holds the last element, and what does arr[5] do at runtime?`,
    hints: [
      'Indices start counting from 0, not 1.',
      'Reaching past the end of an array is checked in Rust.',
    ],
    solution: `Indices in Rust start at 0, so an array of length 5 has valid indices 0, 1, 2, 3, and 4. The last element lives at index 4, which is the length minus one. Writing arr[5] is one past the end, so it is out of bounds. Unlike C, Rust checks the index at runtime and safely panics (crashes the program) instead of returning garbage. If you are not sure an index is valid, use arr.get(5), which returns an Option (None here) instead of panicking.`,
    tags: ['array', 'indexing', 'bounds'],
  },
  {
    id: 'ds-ch01-t-003',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Vec, Fixed Array, or Slice?',
    prompt: `For each situation pick the best of Rust's three contiguous types (a fixed [T; N] array, a growable Vec<T>, or a borrowed slice &[T]) and say why:
(a) storing the 7 days of the week, known and never growing;
(b) reading lines from a file when you do not know how many there are;
(c) writing a function parameter that should accept all of the above.`,
    hints: [
      'One type bakes its length into the type at compile time; one grows on the heap.',
      'A slice is a borrowed view that several of the others can coerce into.',
    ],
    solution: `(a) Use a fixed array [T; 7]: the size is known, small, and never changes, so baking the length into the type and living on the stack is ideal. (b) Use a Vec<T>: you do not know the count ahead of time, and a Vec grows on the heap by pushing, with push being amortized O(1). (c) Write the parameter as &[T], a slice. A slice is a borrowed pointer-plus-length view, and a fixed array, a Vec, and a sub-range all coerce into it, so a &[T] parameter is the most reusable choice; prefer it over &Vec<T>.`,
    tags: ['vec', 'slice', 'fixed-array'],
  },
  {
    id: 'ds-ch01-t-004',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Length Is Not Capacity',
    prompt: `A Vec<i32> reports len() of 3 and capacity() of 4. You then call push(40) and then push(50). For each push, say whether it triggers the Vec to allocate a new, bigger heap buffer and copy the old elements over, and explain what len and capacity become after the two pushes.`,
    hints: [
      'len is how many elements exist; capacity is how many fit before regrowth.',
      'A Vec typically grows by doubling when a push would exceed capacity.',
    ],
    solution: `push(40) makes len go from 3 to 4, which still fits inside capacity 4, so it is a plain O(1) push with no reallocation or copy. push(50) would make len 5, which exceeds capacity 4, so the Vec must grow: it allocates a bigger buffer (typically double, so capacity 8), copies the existing 4 elements over, frees the old buffer, and then stores 50. After both pushes len is 5 and capacity is 8. Because doubling makes these copies rare, pushes average out to O(1), which is why we call a single push amortized constant time.`,
    tags: ['vec', 'capacity', 'amortized'],
  },
  {
    id: 'ds-ch01-t-005',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'The Hidden Quadratic',
    prompt: `Here is code meant to test whether a slice has any duplicate value:

fn has_dupe(nums: &[i32]) -> bool {
    for &x in nums {
        if nums.iter().filter(|&&y| y == x).count() > 1 {
            return true;
        }
    }
    false
}

It looks like a single for loop, yet it runs in O(n squared) time. Where is the second loop hiding, and what is the total work for a slice of length n?`,
    hints: [
      'A method that scans the whole slice is itself a loop.',
      'Count how many times that inner scan runs as the outer loop turns.',
    ],
    solution: `The second loop is hidden inside the body: nums.iter().filter(...).count() scans the entire slice every time it is called, so it is a loop of its own. The visible outer for loop runs n times, and for each of those iterations the inner scan does up to n units of work, giving roughly n times n, which is O(n squared) or quadratic time. The same trap appears with calls like .contains() inside a loop. The escape route, taught later in the chapter, is to replace the inner re-scan with an O(1) HashSet lookup, which collapses the whole thing to O(n).`,
    tags: ['nested-loops', 'big-o', 'frequency'],
  },
  {
    id: 'ds-ch01-t-006',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Tracing a HashSet Pass',
    prompt: `Hand-trace the one-pass HashSet duplicate check on the slice [5, 2, 5, 9]. For each element, write down whether insert returns true or false, and say at which element the function decides there is a duplicate. How many elements does it touch before stopping?`,
    hints: [
      'insert returns false when the value was already present.',
      'The function returns as soon as a value fails to insert.',
    ],
    solution: `Walk left to right with an empty set. Element 5: insert returns true (new), set is { 5 }. Element 2: insert returns true (new), set is { 5, 2 }. Element 3rd value 5: insert returns false because 5 is already there, so this is a duplicate and the function returns true here. It never reaches the final 9. It touched only the first three elements. Each step is an O(1) set operation, and we make at most one pass, so the whole check is O(n), unlike the quadratic re-scan it replaces.`,
    tags: ['hash-set', 'array', 'big-o'],
  },
  {
    id: 'ds-ch01-t-007',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Reading the Entry Idiom',
    prompt: `The frequency-counting heartbeat of this chapter is one line written with a leading star, then map.entry(key), then or_insert(0), then plus equals 1. Read that line aloud in plain English: what does each of the three pieces (entry, or_insert, the leading star) do, and why is it better than calling contains then insert then update separately?`,
    hints: [
      'entry hands you a handle to the slot whether or not the key exists yet.',
      'Think about how many times the key gets hashed in each version.',
    ],
    solution: `Read it as "find or create the counter for this key, then add one to it." map.entry(key) hands you a handle to the slot for that key, existing or not. or_insert(0) says "if the slot is empty, put 0 there," and returns a mutable reference to the value either way. The leading star dereferences that mutable reference so the plus-equals-1 adds to the actual number in place. It beats the contains-then-insert-then-update version because entry hashes the key only once, while the clumsy version hashes it three separate times, doing the same lookup over and over.`,
    tags: ['hash-map', 'entry-api', 'frequency'],
  },
  {
    id: 'ds-ch01-t-008',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Tracing the Prefix Sum Cancellation',
    prompt: `Given nums = [2, 4, 1, 3, 5], the note builds a prefix array one longer than the data with prefix[0] = 0. Write out the full prefix array, then use it to answer the range sum of nums[1..4] (indices 1, 2, 3, that is the values 4, 1, 3) with a single subtraction. Explain why the subtraction leaves exactly the middle you asked for.`,
    hints: [
      'prefix[i+1] equals prefix[i] plus nums[i], starting from prefix[0] equal to 0.',
      'The sum of nums[l..r] (r exclusive) is prefix[r] minus prefix[l].',
    ],
    solution: `Building cumulatively: prefix[0] = 0, prefix[1] = 2, prefix[2] = 6, prefix[3] = 7, prefix[4] = 10, prefix[5] = 15, so prefix = [0, 2, 6, 7, 10, 15]. For nums[1..4] the answer is prefix[4] - prefix[1] = 10 - 2 = 8, which matches 4 + 1 + 3. The subtraction works by cancellation: prefix[4] is the total of everything up to index 4, and prefix[1] is the total of everything up to index 1, so subtracting removes the unwanted front part (the 2) and leaves exactly the middle stretch you wanted. After the one-time O(n) build, every such query is a single subtraction, O(1).`,
    tags: ['prefix-sum', 'array', 'range-query'],
  },
  {
    id: 'ds-ch01-t-009',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Why Look Before You Insert',
    prompt: `The Two Sum solution checks the HashMap for the complement BEFORE inserting the current number. Consider nums = [3, 5] with target = 6. If a buggy version inserted the current number FIRST and then looked for the complement, what wrong answer could it produce at index 0, and why does looking first avoid it?`,
    hints: [
      'The complement of 3 against target 6 is 3 itself.',
      'Think about whether an element is allowed to pair with itself.',
    ],
    solution: `The complement of 3 is target minus 3, which is also 3. In the buggy insert-first version, at index 0 it would insert (3 -> 0) and then look up 3, find it at index 0, and report the pair (0, 0): the single element matched itself, which is wrong because Two Sum needs two distinct indices. Looking first avoids this: at index 0 the map is still empty, so the lookup for 3 fails, and only then do we record (3 -> 0). The correct pair (3 + 3 = 6) would only be found later if a second 3 appeared. The rule is always look for the complement, then insert the current number.`,
    tags: ['two-sum', 'hash-map', 'pitfall'],
  },
  {
    id: 'ds-ch01-t-010',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Choosing a Canonical Anagram Key',
    prompt: `In Group Anagrams you need a key so that all anagrams of a word land in the same HashMap bucket. The note gives two canonical keys: sorting the letters of each word, or counting each of the 26 letters into a fixed array. For a word of length L, give the per-word cost of each key, say which is faster for long words, and explain why a raw word could NOT be used as the key.`,
    hints: [
      'Sorting L letters and counting L letters have different costs.',
      'A canonical key must be identical for every member of a group.',
    ],
    solution: `Sorting the letters costs O(L log L) per word (the cost of sorting), while building a 26-entry count array costs only O(L) because you just tally each letter once with no sorting. So the count key is faster, especially for long words where L is large. A raw word cannot be the key because anagrams are spelled differently ("eat" versus "tea"), so they would hash to different buckets and never group together. A canonical key is a single standard form that every anagram of a group collapses to, and both the sorted string ("aet") and the 26-count tally are identical for all anagrams, which is exactly what makes them work.`,
    tags: ['group-anagrams', 'hash-map', 'canonical-key'],
  },
  {
    id: 'ds-ch01-t-011',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'The usize Underflow Trap',
    prompt: `A student writes this to grab the last element of a Vec:

let last = v[v.len() - 1];

It works most of the time, but crashes on one particular input. Which input, and why does subtracting 1 not simply give a negative number here? What should be checked first?`,
    hints: [
      'Lengths and indices in Rust are usize, an unsigned integer.',
      'Consider what len() returns for an empty Vec.',
    ],
    solution: `It crashes when v is empty. len() returns 0 for an empty Vec, and lengths and indices have type usize, which is an unsigned integer that cannot be negative. So 0 minus 1 does not become -1; it underflows (wraps around below zero) and panics. The fix is to check for emptiness first, for example with if let Some(last) = v.last() or by guarding with !v.is_empty() before doing the subtraction. The general lesson is to never compute len() - 1 without first making sure the collection is non-empty.`,
    tags: ['vec', 'usize', 'pitfall'],
  },
  {
    id: 'ds-ch01-t-012',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Space for Time: The Master Move',
    prompt: `The chapter calls trading memory for speed via hashing "the master move." For both Contains Duplicate and Two Sum, the brute-force version is O(n squared) time but O(1) extra space, while the hashing version is O(n) time but O(n) extra space. Explain in your own words what is being traded and why it is usually worth it, then describe one situation where you might still prefer the brute-force, no-extra-memory version.`,
    hints: [
      'The hash structure is the extra memory you spend to buy faster lookups.',
      'Think about very small inputs or very tight memory budgets.',
    ],
    solution: `The trade is extra memory for less time: the brute force uses almost no extra space but re-scans all other elements for each item, giving O(n squared) time, whereas the hashing version spends O(n) extra memory on a HashSet or HashMap so that each "have I seen this?" question is an O(1) lookup, collapsing the time to O(n). It is usually worth it because as n grows the shape of the running time dominates everything: a quadratic algorithm goes from snappy to unusable, while a linear one keeps up. You might still prefer the brute-force version when n is tiny (the constant factors and the cost of building a map can make it slower in practice) or when memory is extremely tight and allocating an O(n) helper structure is not acceptable.`,
    tags: ['big-o', 'hash-map', 'trade-off'],
  },
]

export default problems
