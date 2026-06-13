import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-ds-01',
  track: 'dsa',
  chapter: 1,
  title: 'Arrays & Hashing',
  summary: `Almost every interesting algorithm starts by putting data into an array and then asking a question about it: does this value appear, how many times, which two items add up to a target, which words are anagrams of each other. This chapter builds the two most fundamental tools for answering those questions fast.

First we look at the array itself, a block of values sitting side by side in memory, and we learn why reaching element number five takes the same tiny amount of time as reaching element five million. We meet Rust's three flavours of contiguous storage, the growable Vec, the fixed-size array, and the borrowed slice, and we measure the real cost of the nested loop that quietly turns a friendly program into a slow one.

Then we meet hashing, the single most important speedup in this whole course. A HashMap or HashSet lets you answer "have I seen this before?" in roughly constant time, and that one ability is what turns a sluggish n-squared scan into a snappy linear pass. We use it to count word frequencies, de-duplicate a mailing list, tally votes, and crack the classic Two Sum and Group Anagrams problems. By the end you will reach for a hash map the moment a problem says the word "lookup".`,
  sections: [
    {
      heading: 'How an array actually lives in memory, and why indexing is O(1)',
      body: `An **array** is the simplest collection there is: a run of values of the same type, stored in one unbroken block of memory, one immediately after the next. Picture a row of identical mailboxes bolted to a wall. Each box is the same size, and they are numbered starting from zero. That physical layout is called **contiguous** memory, and it is the whole secret behind why arrays are fast.

Because every element is the same size and they sit back to back, the computer does not have to *search* for element number *i*. It computes the address with a single multiplication and addition: start at the base address of the block, then jump forward by *i* times the size of one element. Whether *i* is 5 or 5,000,000, that is the same one multiply, one add, one memory read. We call this **O(1)**, or **constant time**: the work does not grow as the array grows. (Big-O notation is just a way to describe how the running time scales with the input size *n*; O(1) means "flat, independent of n".)

Compare that to a real-world list of names written on separate sticky notes thrown in a drawer. To find the tenth note you have to rummage. An array is the opposite of a drawer: it is a numbered shelf where box number *i* is always exactly *i* boxes from the start.

This is why arrays are the default building block for leaderboards, pixel buffers, lookup tables, and almost everything else. The trade-off, which we will hit later, is that *inserting in the middle* is expensive, because every later element has to shuffle over to keep the block contiguous.

### Common pitfalls

- **Indices start at 0, not 1.** An array of length 5 has valid indices 0, 1, 2, 3, 4. The last index is always length minus one.
- **Out-of-bounds access panics in Rust.** Unlike C, reading past the end does not silently return garbage; Rust checks the index at runtime and crashes safely. Use the .get(i) method, which returns an Option, when an index might be invalid.`,
      code: [
        {
          lang: 'text',
          src: `An array of i32 (each element is 4 bytes wide):

 index:     0      1      2      3      4
         +------+------+------+------+------+
 value:  |  10  |  20  |  30  |  40  |  50  |
         +------+------+------+------+------+
 addr:    1000   1004   1008   1012   1016
            ^
            base address

 To read index 3:
   address = base + 3 * 4  =  1000 + 12  =  1012   -> value 40

 One multiply, one add, one read. Same cost for index 3
 or index 3000. That is O(1) constant-time indexing.`
        },
        {
          lang: 'rust',
          src: `fn main() {
    let scores = [10, 20, 30, 40, 50]; // a fixed array of 5 i32 on the stack

    // Direct indexing: O(1). The compiler turns this into base + i*size.
    println!("{}", scores[3]); // 40

    // scores[99];          // would PANIC: index out of bounds
    // Safe alternative: .get returns Option, no panic.
    match scores.get(99) {
        Some(v) => println!("found {v}"),
        None => println!("index 99 is out of bounds"), // this branch runs
    }
}`
        }
      ]
    },
    {
      heading: 'Vec, fixed [T; N], and slices &[T]: three ways to hold a run of values',
      body: `Rust gives you three closely related types for contiguous data, and knowing which to use is half the battle.

A **fixed-size array**, written [T; N], has its length baked into the type at compile time. [i32; 5] is "exactly five i32s" and lives right on the stack. You use it when the size is known and small, like the four corners of a rectangle or the seven days of a week. You cannot grow it.

A **Vec<T>** (pronounced "vector") is the growable array, and it is the one you will use most. It stores its elements in a heap buffer and remembers three things on the stack: a pointer to that buffer, its current **length** (how many elements are in use), and its **capacity** (how many it can hold before it must grow). When you push past capacity, Vec allocates a bigger buffer (typically double the size), copies the old elements over, and frees the old one. Doubling is what makes a single push **amortized O(1)** ("amortized" means averaged over many operations: most pushes are instant, the occasional one that triggers a copy is expensive, but spread out the average stays constant).

A **slice**, written &[T], is a *borrowed view* into a run of elements you do not own. It is a "fat pointer": a pointer to the first element plus a length. A slice can point into a Vec, a fixed array, or part of either. You almost always write function parameters as &[T] rather than &Vec<T>, because a slice accepts all three, making your function more reusable.

### Common pitfalls

- **usize cannot go negative.** Lengths and indices are usize, an unsigned integer. Writing len() - 1 when the Vec is empty does not give -1; it underflows and panics. Always check for emptiness first.
- **Confusing length with capacity.** len() is how many elements exist; capacity() is how many fit before reallocation. with_capacity(n) pre-reserves room to avoid repeated regrowth in a loop.
- **Indexing a Vec is O(1), but inserting at the front is O(n)**, because every element must shift right to stay contiguous.`,
      code: [
        {
          lang: 'text',
          src: `A Vec<i32> with len 3 and capacity 4:

  stack (the Vec handle, 3 words)        heap buffer (capacity 4)
  +---------+---------+----------+        +----+----+----+------+
  |  ptr    |  len=3  |  cap=4   | -----> | 10 | 20 | 30 | ???? |
  +---------+---------+----------+        +----+----+----+------+
                                            0    1    2   (unused)

  push(40):  len becomes 4, fits in capacity -> O(1), no copy.
  push(50):  len would be 5 > cap 4 -> grow!

       allocate new buffer of capacity 8, copy 4 elements over,
       free old buffer:  this single push is O(n)...

  +----+----+----+----+----+------+------+------+
  | 10 | 20 | 30 | 40 | 50 | ???? | ???? | ???? |   cap=8, len=5
  +----+----+----+----+----+------+------+------+

  ...but doubling means copies are rare, so pushes average O(1)
  (amortized constant time).`
        },
        {
          lang: 'rust',
          src: `fn main() {
    let fixed: [i32; 3] = [1, 2, 3];   // fixed array, size in the type
    let mut grow: Vec<i32> = vec![1, 2, 3]; // growable, lives on the heap

    grow.push(4);                      // amortized O(1)
    println!("len {} cap {}", grow.len(), grow.capacity());

    // A slice borrows a window; it works over BOTH a Vec and a fixed array.
    print_all(&fixed);                 // &[i32; 3] coerces to &[i32]
    print_all(&grow);                  // &Vec<i32> coerces to &[i32]
    print_all(&grow[1..3]);            // a sub-slice: just elements 1 and 2
}

// Take &[T], never &Vec<T>: this accepts arrays, Vecs, and sub-ranges.
fn print_all(items: &[i32]) {
    for x in items {
        print!("{x} ");
    }
    println!();
}`
        }
      ]
    },
    {
      heading: 'Traversal and the hidden cost of nested loops (O(n squared))',
      body: `Walking through an array once, visiting each element a constant amount of work, is **O(n)** or **linear time**: double the data, double the time. That is the cheapest useful thing you can do, and most well-designed algorithms aim to do their job in one or a few linear passes.

The trouble starts when you put a loop *inside* a loop. Suppose you want to know whether an array contains any duplicate value, and you do the obvious thing: for each element, compare it against every other element. The outer loop runs *n* times, and for each of those it runs an inner loop up to *n* times, so the total work is roughly *n* times *n*, which is **O(n squared)**, or **quadratic time**. In plain words: for every item we re-scan all the others.

Quadratic feels fine on tiny inputs and then falls off a cliff. With 100 items that is 10,000 comparisons, instant. With 100,000 items it is 10,000,000,000 comparisons, and your program hangs. This is the exact moment a real program goes from snappy to unusable, and it is almost always a hidden nested loop.

The whole rest of this chapter is about one escape route: replacing the inner "re-scan everything" loop with a **hash-based lookup** that answers "have I seen this?" in O(1). That single swap collapses O(n squared) down to O(n). Hold that idea; it is the most valuable trick in the course.

### Common pitfalls

- **Quadratic loops hide in innocent-looking code.** A .contains() call inside a loop is a loop inside a loop, because .contains() itself scans. Calling it n times is O(n squared).
- **Mutating a Vec while iterating it by index can shift elements** and skip or repeat work; prefer building a new Vec or using retain.
- **Big-O ignores constant factors but not the shape.** An O(n) loop that does heavy work per element can still beat an O(n squared) loop on small inputs, but as n grows the shape always wins. Optimize the shape first.`,
      code: [
        {
          lang: 'text',
          src: `Brute-force "has duplicates?" on [3, 1, 3]:
each cell is a comparison the inner loop performs.

           j=0    j=1    j=2
         +------+------+------+
  i=0    |  -   | 3vs1 | 3vs3 |  <- found! 3 == 3
         +------+------+------+
  i=1    |      |  -   | 1vs3 |
         +------+------+------+
  i=2    |      |      |  -   |
         +------+------+------+

  For n=3 that is ~ n*(n-1)/2 comparisons. The number of
  filled cells grows like n^2:

   n=3   -> ~3 comparisons
   n=10  -> ~45
   n=100 -> ~4950
   n=1000-> ~499500     (quadratic: each 10x in n is ~100x work)`
        },
        {
          lang: 'rust',
          src: `// BRUTE FORCE: O(n^2) time, O(1) extra space.
// For every i, re-scan every later j. Works, but slow on big inputs.
fn has_duplicate_slow(nums: &[i32]) -> bool {
    for i in 0..nums.len() {
        for j in (i + 1)..nums.len() {
            if nums[i] == nums[j] {
                return true; // a pair matched
            }
        }
    }
    false
}

fn main() {
    assert!(has_duplicate_slow(&[3, 1, 3]));    // true
    assert!(!has_duplicate_slow(&[1, 2, 3, 4])); // false
    // Preview of the fix: a HashSet makes this O(n). See the next section.
}`
        }
      ]
    },
    {
      heading: 'HashSet: O(1) membership, de-duplication, and killing the quadratic',
      body: `A **hash set** is a collection that answers one question blazingly fast: "is this value in here?" It does so in roughly **O(1)** time, independent of how many values it holds. The trick is **hashing**: it runs the value through a **hash function** that turns it into a number, and uses that number to jump straight to a slot, instead of scanning. (Worst case, many values collide into the same slot and it degrades, but for ordinary data you can treat membership, insertion, and removal as constant time.)

This is the tool that kills the nested loop from the last section. Instead of "for each element, re-scan all the others" (O(n squared)), we do "for each element, ask the set if we have seen it, then add it" (O(n)). One linear pass, each step constant, total linear. Memorize this pattern; you will use it constantly.

Real-world picture: **de-duplicating a mailing list.** You have 100,000 email addresses, some repeated, and you want each unique one. Throwing them all into a HashSet and reading them back gives the unique set in one linear pass. The set's whole job is to recognize "I have seen this before" instantly.

A HashSet stores each element at most once; inserting a value that is already present is a no-op, and insert returns a bool telling you whether the value was new. That returned bool is exactly the "have I seen this?" signal you need.

### Common pitfalls

- **A HashSet has no order.** Iterating it gives elements in an unpredictable order. If you need sorted output, collect into a Vec and sort, or use a BTreeSet.
- **The element type must implement Hash and Eq.** Most std types do. Floats (f64) do not implement Eq, so you cannot put them in a HashSet directly.
- **Do not call .contains() then .insert() separately when one call suffices.** insert already tells you if the value was new, saving a second hash lookup.`,
      code: [
        {
          lang: 'text',
          src: `Detecting a duplicate in [3, 1, 3] with a HashSet, one pass:

 step  value   set before    seen it?   action
 ----  -----   ----------    --------   ----------------------
  1      3      { }           no         insert 3 -> { 3 }
  2      1      { 3 }         no         insert 1 -> { 3, 1 }
  3      3      { 3, 1 }      YES  <----  return true (duplicate!)

 We touched each element ONCE. No inner loop. That is O(n).
 Compare with the n^2 grid from the previous section: the whole
 triangle of comparisons collapses into a single straight line.`
        },
        {
          lang: 'rust',
          src: `use std::collections::HashSet;

// FAST: O(n) time, O(n) extra space (the set). One pass.
fn has_duplicate(nums: &[i32]) -> bool {
    let mut seen = HashSet::new();
    for &n in nums {
        // insert returns false if n was ALREADY present.
        if !seen.insert(n) {
            return true; // we have seen n before -> duplicate
        }
    }
    false
}

// De-duplicate a mailing list, keeping only unique addresses.
fn unique_emails(list: &[&str]) -> HashSet<String> {
    list.iter().map(|s| s.to_string()).collect() // dupes vanish automatically
}

fn main() {
    assert!(has_duplicate(&[3, 1, 3]));
    let mails = ["a@x.com", "b@x.com", "a@x.com"];
    assert_eq!(unique_emails(&mails).len(), 2); // 3 addresses, 2 unique
}`
        }
      ]
    },
    {
      heading: 'Frequency counting with HashMap and the entry API',
      body: `A **hash map** stores **key to value** pairs and looks up a value by its key in O(1), the same hashing trick as a set but now each key carries an associated value. The classic use is **counting**: how many times does each thing appear?

Think of **counting word frequencies in a document**, or **tallying votes in an election**, or building a **leaderboard count** of how many games each player won. In every case the pattern is identical: the thing is the key, the running count is the value. You walk the data once, and for each item you bump its counter.

The naive way is clumsy: check if the key exists, if not insert zero, then read it, add one, write it back. Rust gives you the **entry API**, the idiomatic one-liner for exactly this. map.entry(k) hands you a handle to the slot for key k, whether or not it exists yet. .or_insert(0) says "if the slot is empty, put 0 in it", and returns a mutable reference to the value either way. Then the leading star dereferences that reference so you can add to the number in place. The whole idiom is:

> map.entry(key).or_insert(0) plus equals 1

Read it as: "find or create the counter for this key, then increment it." That single line is the heartbeat of frequency counting, and you will write it hundreds of times.

The entry API matters because it does the lookup **once**. The clumsy contains-then-insert-then-update version hashes the key three separate times; entry hashes it once and hands you the slot.

### Common pitfalls

- **or_insert takes the default value, not a closure.** If computing the default is expensive, use or_insert_with(|| expensive()) so it only runs when the key is missing.
- **The value behind entry is a mutable reference**; you must dereference it with a leading star to do arithmetic on the number, as in the star-entry-plus-equals idiom.
- **Iterating a HashMap is unordered.** To print a leaderboard sorted by count, collect the pairs into a Vec and sort it.`,
      code: [
        {
          lang: 'text',
          src: `Counting words in: ["red", "blue", "red", "red", "blue"]

 word     map.entry(word).or_insert(0) += 1   -> map after
 ------   -----------------------------------    -----------------------
 red      slot missing -> insert 0, then +1     { red: 1 }
 blue     slot missing -> insert 0, then +1     { red: 1, blue: 1 }
 red      slot = 1     -> +1                     { red: 2, blue: 1 }
 red      slot = 2     -> +1                     { red: 3, blue: 1 }
 blue     slot = 1     -> +1                     { red: 3, blue: 2 }

 One linear pass over the input; each step is O(1).
 Final tally:   red = 3,  blue = 2`
        },
        {
          lang: 'rust',
          src: `use std::collections::HashMap;

// Count how many times each word appears. O(n) time, O(k) space (k = distinct words).
fn word_counts(words: &[&str]) -> HashMap<String, i32> {
    let mut counts = HashMap::new();
    for &w in words {
        // The entry idiom: find-or-create the counter, then bump it.
        *counts.entry(w.to_string()).or_insert(0) += 1;
    }
    counts
}

fn main() {
    let doc = ["red", "blue", "red", "red", "blue"];
    let counts = word_counts(&doc);
    assert_eq!(counts["red"], 3);
    assert_eq!(counts["blue"], 2);

    // Leaderboard: sort the unordered map into a Vec, highest count first.
    let mut board: Vec<(&String, &i32)> = counts.iter().collect();
    board.sort_by(|a, b| b.1.cmp(a.1)); // descending by count
    for (word, n) in board {
        println!("{word}: {n}");
    }
}`
        }
      ]
    },
    {
      heading: 'Prefix sums: instant range-sum queries',
      body: `Suppose you have an array of daily sales and you keep being asked "what is the total from day 2 through day 6?", then "day 0 through day 4?", and so on, hundreds of times. The obvious answer is to add up the slice each time, but summing a range of length *m* costs O(m), and answering *q* such questions costs O(q times n) in the worst case. With many queries that is too slow.

The **prefix sum** (also called a cumulative sum) trades a one-time setup for instant queries forever after. You build a helper array where entry *i* holds the sum of *all* elements before index *i*. Then the sum of any range from *l* up to *r* is just prefix[r] minus prefix[l], one subtraction, **O(1)** per query. You did the adding once, up front, in a single O(n) pass; every query afterward is free.

The key insight is a cancellation: prefix[r] is "everything up to r" and prefix[l] is "everything up to l", so subtracting removes the unwanted front part and leaves exactly the middle you asked for. It is the same idea as reading two odometer values and subtracting to get the distance you drove between them.

We deliberately make the prefix array one longer than the data, with prefix[0] equal to 0, so that prefix[r] minus prefix[l] works cleanly for any range including ranges that start at 0, with no special cases.

### Common pitfalls

- **Off-by-one errors with the boundaries.** With the convention prefix[0] equals 0 and prefix[i+1] equals prefix[i] plus nums[i], the sum of indices l..r (r exclusive) is prefix[r] minus prefix[l]. Pick one convention and write it down.
- **Integer overflow on large sums.** Summing many large values can overflow i32; use i64 (or checked arithmetic) when totals can get big.
- **Prefix sums only help when the array does not change.** If values are updated between queries you need a fancier structure (a Fenwick or segment tree, later in the course).`,
      code: [
        {
          lang: 'text',
          src: `Data:    nums =  [ 2,  4,  1,  3,  5 ]
 index           0   1   2   3   4

 Build prefix (one longer, prefix[0] = 0):
   prefix[0] = 0
   prefix[1] = 0 + 2 = 2
   prefix[2] = 2 + 4 = 6
   prefix[3] = 6 + 1 = 7
   prefix[4] = 7 + 3 = 10
   prefix[5] = 10 + 5 = 15

 prefix = [ 0,  2,  6,  7, 10, 15 ]
            0   1   2   3   4   5

 Query: sum of nums[1..4]  (the 4, 1, 3)?
   answer = prefix[4] - prefix[1] = 10 - 2 = 8   (one subtraction, O(1))

           [ 2 | 4   1   3 | 5 ]
            ^^^  \\_______/
         removed   what we want
        (prefix[1])  (= prefix[4] - prefix[1])`
        },
        {
          lang: 'rust',
          src: `// Precompute once: O(n). Then every range query is O(1).
struct RangeSum {
    prefix: Vec<i64>, // prefix[i] = sum of the first i elements
}

impl RangeSum {
    fn new(nums: &[i64]) -> Self {
        let mut prefix = vec![0i64; nums.len() + 1]; // one longer, starts at 0
        for (i, &x) in nums.iter().enumerate() {
            prefix[i + 1] = prefix[i] + x; // running total
        }
        RangeSum { prefix }
    }

    // Sum of nums[l..r] (r exclusive). One subtraction, O(1).
    fn range(&self, l: usize, r: usize) -> i64 {
        self.prefix[r] - self.prefix[l]
    }
}

fn main() {
    let rs = RangeSum::new(&[2, 4, 1, 3, 5]);
    assert_eq!(rs.range(1, 4), 8);  // 4 + 1 + 3
    assert_eq!(rs.range(0, 5), 15); // whole array
}`
        }
      ]
    },
    {
      heading: 'Two Sum: from O(n squared) to O(n) with a HashMap',
      anim: 'two-sum',
      body: `Here is the most famous interview question in the world, and it is the perfect showcase for hashing. Given an array of numbers and a target, return the indices of the two numbers that add up to the target.

The **brute-force** approach is the nested loop we now recognize on sight: for each element, scan every later element looking for a partner that completes the target. That is **O(n squared)** time, for every item we re-scan all the others.

The **smart** approach flips the question. As we walk the array left to right, for the current number *x* we do not search for its partner, we ask: "have I already seen the exact number that would complete the pair?" The number we need is target minus *x*, its **complement**. If we keep a HashMap of "value seen so far to the index where I saw it", that question is an O(1) lookup. If the complement is in the map, we are done; if not, we record *x* and move on. One pass, each step constant, **O(n)** total.

This is the quadratic-to-linear collapse made concrete, and it is worth pausing on *why* it works: the inner "search for a partner" loop has been replaced by a single hash lookup. We are spending O(n) extra memory (the map) to buy back a whole factor of n in time. That trade, **space for time via hashing**, is the defining move of this entire chapter.

### Common pitfalls

- **Check for the complement BEFORE inserting the current number**, otherwise a target like 6 with a single 3 could match itself at the same index. Look first, then insert.
- **Store value to index, not value to value.** The question asks for indices, so the map's value must be the position.
- **Duplicate values are fine** as long as you look-then-insert, because you find the earlier index of the complement before overwriting it.`,
      code: [
        {
          lang: 'text',
          src: `Two Sum trace.  nums = [2, 7, 11, 15], target = 9.
 map holds "value seen -> its index".

 i  x   need = 9 - x   in map?   action
 -  --  -----------    ------    -----------------------------------
 0   2      7          no        insert (2 -> 0)   map={2:0}
 1   7      2          YES @0    return [0, 1]   (2 + 7 = 9)  DONE

 We never reached index 2 or 3. The inner "find a partner"
 loop became a single map lookup, so the whole search is O(n).

 Side-by-side cost on this 4-element input:
   brute force : up to 4*3/2 = 6 comparisons
   hashing     : 2 lookups, 1 insert`
        },
        {
          lang: 'rust',
          src: `use std::collections::HashMap;

// O(n) time, O(n) space. One pass, look-then-insert.
fn two_sum(nums: &[i32], target: i32) -> Option<(usize, usize)> {
    let mut seen: HashMap<i32, usize> = HashMap::new(); // value -> index
    for (i, &x) in nums.iter().enumerate() {
        let need = target - x; // the complement that completes the pair
        if let Some(&j) = seen.get(&need) {
            return Some((j, i)); // found the earlier partner: O(1) lookup
        }
        seen.insert(x, i); // record AFTER checking, never before
    }
    None
}

fn main() {
    assert_eq!(two_sum(&[2, 7, 11, 15], 9), Some((0, 1)));
    assert_eq!(two_sum(&[3, 3], 6), Some((0, 1))); // duplicates: fine
    assert_eq!(two_sum(&[1, 2, 3], 99), None);
}`
        }
      ]
    },
    {
      heading: 'Group Anagrams: choosing the right HashMap key',
      body: `The final pattern teaches a subtle skill: **inventing a good key**. Two words are **anagrams** if one is a rearrangement of the other, like "eat", "tea", and "ate". Given a list of words, group the anagrams together.

The brute-force idea is to compare every word against every other to test if they are anagrams, which is the familiar O(n squared) (times the cost of each comparison). The hashing idea, as always, replaces that with a single map. But what do we use as the key? The words themselves differ, yet anagrams share something: the **same letters in the same counts**. So we need a **canonical form** (a single standard representation that all anagrams of a group collapse to) to use as the key.

Two clean choices:

- **Sorted key.** Sort the letters of each word. "eat", "tea", and "ate" all sort to "aet", so that string is their shared key. Building it costs O(L log L) per word where L is the word length (the cost of sorting its letters).
- **Count key.** Count how many of each letter the word has, and turn that 26-number tally into a key. This costs only O(L) per word, no sorting, and is the faster choice when words are long, because counting beats sorting.

Either way the algorithm is the same hash-grouping pattern you have now seen four times: walk the words once, compute each word's canonical key, and push the word into the bucket for that key using the entry API with or_insert of an empty Vec. The whole thing is one linear pass over the words, each doing cheap per-word work.

### Common pitfalls

- **The key must be canonical for ALL anagrams to land in the same bucket.** A sorted string or a fixed-length count array both work; a raw word does not.
- **or_insert_with(Vec::new) avoids allocating an empty Vec when the bucket already exists**, which or_insert(vec![]) would do every call.
- **A count key assumes a fixed alphabet** (here, 26 lowercase letters). For full Unicode you would build the key differently, for example a sorted string.`,
      code: [
        {
          lang: 'text',
          src: `Grouping ["eat", "tea", "tan", "ate", "nat"] by SORTED key:

 word   sorted letters   bucket after this step
 ----   --------------   -------------------------------------
 eat    "aet"            { aet: [eat] }
 tea    "aet"            { aet: [eat, tea] }
 tan    "ant"            { aet: [eat, tea], ant: [tan] }
 ate    "aet"            { aet: [eat, tea, ate], ant: [tan] }
 nat    "ant"            { aet: [eat, tea, ate], ant: [tan, nat] }

 Groups (the map's values):
   "aet" -> [eat, tea, ate]
   "ant" -> [tan, nat]

 Anagrams share a canonical key, so they fall into the same
 bucket in ONE pass over the words. No word-vs-word comparison.`
        },
        {
          lang: 'rust',
          src: `use std::collections::HashMap;

// Sorted-key version: O(n * L log L). Clear and correct.
fn group_anagrams(words: &[&str]) -> Vec<Vec<String>> {
    let mut groups: HashMap<String, Vec<String>> = HashMap::new();
    for &w in words {
        let mut letters: Vec<char> = w.chars().collect();
        letters.sort();                       // canonical form
        let key: String = letters.into_iter().collect();
        // find-or-create the bucket, then push the word into it
        groups.entry(key).or_insert_with(Vec::new).push(w.to_string());
    }
    groups.into_values().collect()
}

// Count-key version: O(n * L), no sorting. Faster for long words.
fn anagram_key(w: &str) -> [u8; 26] {
    let mut counts = [0u8; 26];
    for b in w.bytes() {
        counts[(b - b'a') as usize] += 1; // tally each lowercase letter
    }
    counts // two anagrams produce the SAME 26-element tally
}

fn main() {
    let words = ["eat", "tea", "tan", "ate", "nat"];
    let groups = group_anagrams(&words);
    assert_eq!(groups.len(), 2); // {eat,tea,ate} and {tan,nat}
    assert_eq!(anagram_key("eat"), anagram_key("tea")); // same key
}`
        }
      ]
    }
  ],
  takeaways: [
    'Arrays store same-size elements contiguously, so indexing is O(1): the address is base plus i times element size, no searching.',
    'Vec<T> grows by doubling its heap buffer, making push amortized O(1); fixed [T; N] has its size in the type; &[T] is a borrowed pointer-plus-length view.',
    'Prefer &[T] parameters over &Vec<T>; a slice accepts arrays, Vecs, and sub-ranges alike.',
    'A loop inside a loop is O(n squared): for every item you re-scan all the others, which is fine on tiny inputs and disastrous on large ones.',
    'A HashSet answers membership in O(1); replacing an inner scan with a set lookup collapses O(n squared) into O(n) in one pass.',
    'Frequency counting is the star-entry-or_insert-zero-plus-equals-one idiom: find-or-create the counter, then bump it, hashing the key only once.',
    'Prefix sums precompute cumulative totals in O(n) so any range sum becomes one subtraction, O(1) per query, as long as the data does not change.',
    'Two Sum goes from O(n squared) to O(n) by storing seen values in a HashMap and looking up each number complement; always look before you insert.',
    'Group Anagrams works by choosing a canonical key (sorted letters or a 26-count array) so all anagrams hash into the same bucket in one pass.',
    'The master move of this chapter: spend O(n) memory on a hash structure to buy back a factor of n in time. Reach for a map the moment you hear lookup.'
  ],
  cheatsheet: [
    { label: 'arr[i]', value: 'O(1) indexing; panics if out of bounds' },
    { label: 'arr.get(i)', value: 'O(1) safe access; returns Option, no panic' },
    { label: 'Vec::new / vec![..]', value: 'growable heap array; push is amortized O(1)' },
    { label: 'Vec::with_capacity(n)', value: 'pre-reserve room to avoid regrowth in a loop' },
    { label: 'fn f(x: &[T])', value: 'slice param; accepts arrays, Vecs, and sub-slices' },
    { label: 'HashSet::insert(v)', value: 'O(1); returns false if v was already present' },
    { label: 'set.contains(&v)', value: 'O(1) membership test' },
    { label: 'map.entry(k).or_insert(0)', value: 'find-or-create slot; returns &mut to the value' },
    { label: '*map.entry(k).or_insert(0) += 1', value: 'the frequency-count idiom (one hash lookup)' },
    { label: 'or_insert_with(Vec::new)', value: 'default only built when the key is missing' },
    { label: 'map.get(&k)', value: 'O(1) lookup; returns Option<&V>' },
    { label: 'nested loop', value: 'O(n^2) time: every item re-scans all others' },
    { label: 'prefix[r] - prefix[l]', value: 'range sum in O(1) after an O(n) precompute' },
    { label: 'usize underflow', value: 'len() - 1 on an empty Vec panics; check first' }
  ]
}

export default note
