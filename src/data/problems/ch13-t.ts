import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch13-t-001',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'What Is a Closure',
    prompt: `In one or two sentences, explain what a closure is in Rust and how it differs from an ordinary named function defined with fn. Mention the one capability a closure has that a plain function does not.`,
    hints: [
      'Think about anonymous functions you can store in a variable.',
      'A plain fn cannot use variables from the surrounding scope unless you pass them in.',
    ],
    solution: `A closure is an anonymous function you can save in a variable or pass as an argument, written with the vertical-bar parameter syntax like |x| x + 1. The capability it has that a plain fn does not is capturing its environment: it can read or use variables from the scope where it is defined without those variables being passed in as parameters. A named function, by contrast, can only work with its explicit parameters and items in scope, never with local variables of the caller. This makes closures handy for short bits of behavior that need access to nearby state.`,
    tags: ['closures', 'definition'],
  },
  {
    id: 'rs-ch13-t-002',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Calling a Stored Closure',
    prompt: `Predict the printed output:

let add_one = |x| x + 1;
let result = add_one(41);
println!("{result}");

State the number printed and explain how the closure's parameter and body produced it.`,
    hints: [
      'The closure takes one parameter named x.',
      'Calling it looks just like calling a function.',
    ],
    solution: `It prints 42. The closure add_one has one parameter x and a body of x + 1. When you call add_one(41), the value 41 is bound to x, the body computes 41 + 1, and that result 42 is returned and stored in result. Calling a closure stored in a variable uses the same parentheses syntax as calling a function, so add_one(41) behaves like an ordinary function call.`,
    tags: ['closures', 'predict-output'],
  },
  {
    id: 'rs-ch13-t-003',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Lazy Iterators Do Nothing Alone',
    prompt: `Consider this code:

let v = vec![1, 2, 3];
let mapped = v.iter().map(|x| x * 10);

Nothing visible happens at the line that calls map. Explain why, and state what you would need to add for the multiplication to actually occur.`,
    hints: [
      'Iterators in Rust are lazy.',
      'Adaptors only describe work; something must consume the iterator.',
    ],
    solution: `Iterator adaptors like map are lazy: they only build a new iterator that describes the transformation, without running it. No multiplication happens at the map line because no element has been pulled through yet. To make the work occur you must consume the iterator, for example by calling collect to gather results into a Vec, or by writing a for loop over mapped, or by calling a consuming adaptor such as sum. Until then, mapped just sits there as a recipe.`,
    tags: ['iterators', 'lazy'],
  },
  {
    id: 'rs-ch13-t-004',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'The next Method',
    prompt: `Given let mut it = vec![10, 20].iter();, predict the value returned by each of these three calls in order: it.next(), it.next(), it.next(). Write each result and explain why the iterator must be declared as mut.`,
    hints: [
      'next returns an Option.',
      'next advances internal state, so the iterator changes.',
    ],
    solution: `The first it.next() returns Some(&10), the second returns Some(&20), and the third returns None because the sequence is exhausted. next yields Option values: Some(item) while items remain and None once they run out; here the items are references because iter borrows the vector. The iterator must be mut because each call to next changes the iterator's internal position, which is a mutation of it. Without mut, the borrow checker would reject the calls that advance the state.`,
    tags: ['iterators', 'next', 'option'],
  },
  {
    id: 'rs-ch13-t-005',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Type Inference for Closure Parameters',
    prompt: `Why does this compile fine:

let double = |x| x * 2;
let a = double(5);

but this fails to compile:

let id = |x| x;
let s = id(String::from("hi"));
let n = id(7);

Explain the rule about how a closure's parameter and return types are inferred, and what goes wrong in the second case.`,
    hints: [
      'A closure with no annotations gets its types inferred from its first use.',
      'Once inferred, those types are locked in.',
    ],
    solution: `A closure without type annotations is not generic; the compiler infers one concrete type for its parameter and return from how it is first called, then locks those types in. In the first example double is used with the integer 5, so x is inferred as an integer and everything is consistent. In the second example id is first called with a String, fixing x to String, so the later call id(7) with an integer is a type mismatch and the compiler rejects it. To accept many types you would need a generic function, not an unannotated closure.`,
    tags: ['closures', 'type-inference'],
  },
  {
    id: 'rs-ch13-t-006',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Capturing by Immutable Reference',
    prompt: `Predict whether this compiles and what it prints:

let list = vec![1, 2, 3];
let only_borrows = || println!("from closure: {list:?}");
println!("before calling: {list:?}");
only_borrows();
println!("after calling: {list:?}");

Explain what kind of capture the closure uses and why the println! lines around the call are still allowed.`,
    hints: [
      'The closure only reads list, never modifies or moves it.',
      'Multiple immutable borrows can coexist.',
    ],
    solution: `It compiles and prints the list three times: before, inside the closure, and after. Because the closure only reads list with the debug formatter and never mutates or moves it, it captures an immutable reference. Immutable borrows can coexist, so the surrounding println! calls that also read list are perfectly legal at the same time. Rust always captures with the least access the closure needs, and here a shared reference is enough.`,
    tags: ['closures', 'capture', 'borrowing'],
  },
  {
    id: 'rs-ch13-t-007',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Capturing by Mutable Reference',
    prompt: `Consider:

let mut list = vec![1, 2, 3];
let mut borrows_mutably = || list.push(4);
println!("{list:?}");
borrows_mutably();
println!("{list:?}");

This does NOT compile as written. Explain which line is the problem and why, given that the closure captures list by mutable reference.`,
    hints: [
      'A mutable borrow is exclusive while it is alive.',
      'When does the mutable borrow start and end?',
    ],
    solution: `The first println! is the problem. The closure calls list.push, which requires a mutable reference, so borrows_mutably holds a mutable borrow of list from its definition until its last use, the call. A mutable borrow is exclusive, so no other access to list is allowed while it is alive. The println! between the definition and the call tries to read list during that exclusive borrow, which the borrow checker rejects. Moving that println! to after the closure's last use, or removing it, fixes the code.`,
    tags: ['closures', 'capture', 'borrow-checker'],
  },
  {
    id: 'rs-ch13-t-008',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Map Then Collect',
    prompt: `Predict the contents of squares:

let nums = vec![1, 2, 3, 4];
let squares: Vec<i32> = nums.iter().map(|x| x * x).collect();

Write out the resulting vector and explain the role of map and the role of collect.`,
    hints: [
      'map applies the closure to each element.',
      'collect gathers the produced items into the annotated collection.',
    ],
    solution: `squares is [1, 4, 9, 16]. The map adaptor lazily produces a new iterator that yields each element transformed by the closure x * x, so the elements become 1, 4, 9, and 16. collect is a consuming adaptor that drives the iterator to completion and gathers all the yielded items into a collection. The type annotation Vec<i32> tells collect which collection to build, so it produces a vector of those four squares.`,
    tags: ['iterators', 'map', 'collect'],
  },
  {
    id: 'rs-ch13-t-009',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Summing an Iterator',
    prompt: `Given let total: i32 = vec![3, 6, 9].iter().sum();, state the value of total and classify sum as either a lazy adaptor or a consuming adaptor. Briefly justify the classification.`,
    hints: [
      'sum walks through every element.',
      'After sum runs, the iterator is used up.',
    ],
    solution: `total is 18, the sum of 3, 6, and 9. sum is a consuming adaptor: it calls next repeatedly until the iterator is exhausted, accumulating the elements into a single total, and then the iterator can no longer be used. This is the opposite of a lazy adaptor like map, which only describes work; sum forces the work to happen and produces a final value rather than another iterator.`,
    tags: ['iterators', 'sum', 'consuming-adaptor'],
  },
  {
    id: 'rs-ch13-t-010',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Filter With a Captured Threshold',
    prompt: `Predict the output:

let nums = vec![5, 12, 8, 20, 3];
let threshold = 10;
let big: Vec<i32> = nums.into_iter().filter(|&n| n > threshold).collect();
println!("{big:?}");

List the resulting vector and explain how the closure uses the captured variable threshold.`,
    hints: [
      'filter keeps elements for which the closure returns true.',
      'threshold is captured from the surrounding scope.',
    ],
    solution: `It prints [12, 20]. filter keeps only the elements for which its closure returns true; here the closure checks n > threshold. The closure captures threshold from the enclosing scope by immutable reference and compares each element against it, so only 12 and 20, which exceed 10, are kept. Using into_iter means the iterator yields owned i32 values, and the pattern &n in the closure destructures the reference filter passes so n is a plain i32.`,
    tags: ['iterators', 'filter', 'closures'],
  },
  {
    id: 'rs-ch13-t-011',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Closures as Function Arguments',
    prompt: `The standard library method sort_by_key takes a closure. Given a vector of words, you want to sort them by length. Sketch the call you would make and explain in words what the closure you pass returns and how sort_by_key uses it.`,
    hints: [
      'The closure maps each element to a comparable key.',
      'sort_by_key orders elements by those keys.',
    ],
    solution: `You would call something like words.sort_by_key(|w| w.len());. The closure receives a reference to each element and returns a key, here the length of the word as a usize. sort_by_key computes that key for each element and orders the vector in ascending order of the keys, so shorter words come first. Passing a closure lets you describe the sorting criterion inline without writing a separate named function or a full comparator.`,
    tags: ['closures', 'sort_by_key', 'arguments'],
  },
  {
    id: 'rs-ch13-t-012',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Enumerate Yields Index Pairs',
    prompt: `Predict what this prints:

for (i, c) in vec!['a', 'b', 'c'].iter().enumerate() {
    println!("{i}: {c}");
}

Write the three printed lines and explain what enumerate produces on each iteration.`,
    hints: [
      'enumerate pairs each item with a counter.',
      'The counter starts at zero.',
    ],
    solution: `It prints three lines: "0: a", "1: b", and "2: c". enumerate wraps an iterator so that on each step it yields a tuple of the form (index, item), where the index is a usize counter that starts at 0 and increases by one each iteration. The for loop pattern (i, c) destructures that tuple into the index i and the element c. So you get the zero-based position alongside each character.`,
    tags: ['iterators', 'enumerate', 'predict-output'],
  },
  {
    id: 'rs-ch13-t-013',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why iter and into_iter Differ',
    prompt: `Explain the difference between calling iter() and into_iter() on a Vec<String>. What does each iterator yield, and what happens to the original vector in each case?`,
    hints: [
      'One borrows the collection, the other consumes it.',
      'Think about the item type each produces.',
    ],
    solution: `iter() borrows the vector and produces an iterator that yields shared references, so for a Vec<String> each item is an &String and the original vector remains usable afterward. into_iter() takes ownership of the vector and yields the owned items themselves, so each item is a String and the vector is consumed and can no longer be used. Choose iter when you only need to read elements and keep the collection, and into_iter when you want to move the elements out, for instance to build a new owned collection.`,
    tags: ['iterators', 'iter', 'ownership'],
  },
  {
    id: 'rs-ch13-t-014',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Fn vs FnMut vs FnOnce',
    prompt: `Rust closures automatically implement one or more of the traits Fn, FnMut, and FnOnce depending on how they use captured values. For each of the three behaviors below, name which trait is the most restrictive one the closure must implement, and explain why:
(a) a closure that only reads a captured value,
(b) a closure that mutates a captured value,
(c) a closure that moves a captured value out of itself (consuming it).`,
    hints: [
      'FnOnce can be called at least once; FnMut adds repeated calls with mutation; Fn adds repeated calls without mutation.',
      'Moving a captured value out means you can only call it once.',
    ],
    solution: `(a) A closure that only reads captured values implements Fn (and also FnMut and FnOnce), because reading does not change anything, so it can be called repeatedly without exclusive access. (b) A closure that mutates a captured value implements FnMut (and FnOnce but not Fn), because it needs mutable access each time it runs, so it can be called multiple times but only with exclusive access. (c) A closure that moves a captured value out of itself implements only FnOnce, because once the value has been moved out it is gone, so the closure can be called just one time. The traits form a hierarchy: Fn implies FnMut implies FnOnce, and the bound a function requires tells you how the closure may be invoked.`,
    tags: ['closures', 'fn-traits', 'reasoning'],
  },
  {
    id: 'rs-ch13-t-015',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Move Closure for a Thread-Like Handoff',
    prompt: `Suppose you have let data = vec![1, 2, 3]; and you want to build a closure that owns data rather than borrowing it, so the closure can outlive the current scope. Explain what keyword you add before the parameter list and why borrowing would be insufficient in a situation where the closure must own its captured values.`,
    hints: [
      'The move keyword forces capture by value.',
      'A borrow would tie the closure to the lifetime of the original variable.',
    ],
    solution: `You write the closure as move || { /* use data */ }. The move keyword forces the closure to capture data by value, taking ownership instead of borrowing it. Borrowing would be insufficient when the closure must outlive the scope where data was created, because a captured reference would be tied to data's lifetime; if data is dropped, the reference would dangle, which Rust forbids. Capturing by move bundles the owned vector into the closure so it remains valid wherever the closure goes. This is the typical pattern for handing data off to code that runs independently.`,
    tags: ['closures', 'move', 'ownership'],
  },
  {
    id: 'rs-ch13-t-016',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Chaining Map and Filter',
    prompt: `Predict the final vector:

let result: Vec<i32> = (1..=6)
    .map(|x| x * x)
    .filter(|x| x % 2 == 0)
    .collect();

Walk through what the iterator yields after map, then after filter, and give the collected result.`,
    hints: [
      'The range 1..=6 yields 1 through 6 inclusive.',
      'Apply map first, then keep only even squares.',
    ],
    solution: `The range 1..=6 yields 1, 2, 3, 4, 5, 6. After map each is squared to 1, 4, 9, 16, 25, 36. filter then keeps only the squares that are even, so 4, 16, and 36 pass while 1, 9, and 25 are dropped. collect gathers the surviving values, so result is [4, 16, 36]. The adaptors are evaluated element by element in a single pass, but the net effect is squaring then keeping evens.`,
    tags: ['iterators', 'map', 'filter'],
  },
  {
    id: 'rs-ch13-t-017',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Zipping Two Iterators',
    prompt: `Predict the output:

let names = vec!["Ann", "Bob", "Cy"];
let ages = vec![30, 25];
let pairs: Vec<(&str, i32)> = names.iter().copied().zip(ages.iter().copied()).collect();
println!("{pairs:?}");

Give the contents of pairs and explain what happens when the two iterators have different lengths.`,
    hints: [
      'zip pairs elements positionally.',
      'It stops when the shorter iterator is exhausted.',
    ],
    solution: `pairs is [("Ann", 30), ("Bob", 25)]. zip combines two iterators into one that yields tuples pairing elements by position: first with first, second with second, and so on. When the iterators differ in length, zip stops as soon as either one runs out, so the longer iterator's extra elements are ignored. Here ages has only two items, so the third name "Cy" is dropped and only two pairs are produced.`,
    tags: ['iterators', 'zip', 'predict-output'],
  },
  {
    id: 'rs-ch13-t-018',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Folding to Accumulate',
    prompt: `The fold adaptor takes an initial accumulator value and a closure of two arguments. Predict the result:

let product = vec![1, 2, 3, 4].iter().fold(1, |acc, &x| acc * x);

State the value of product and explain the roles of the initial value 1 and the two closure parameters acc and x.`,
    hints: [
      'fold threads an accumulator through every element.',
      'The closure returns the new accumulator each step.',
    ],
    solution: `product is 24. fold starts with the initial accumulator value, here 1, and for each element calls the closure with the current accumulator acc and the element x, using the returned value as the new accumulator. So it computes 1*1, then *2, then *3, then *4, giving 1, 2, 6, 24. The initial value seeds the accumulation, acc carries the running result forward, and x is the current element being folded in. The final accumulator after all elements is the result.`,
    tags: ['iterators', 'fold', 'consuming-adaptor'],
  },
  {
    id: 'rs-ch13-t-019',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Take, Skip, and Rev Together',
    prompt: `Predict what this prints:

let v: Vec<i32> = (1..=10).rev().skip(2).take(3).collect();
println!("{v:?}");

Trace the sequence after each of rev, skip(2), and take(3), then give the final vector.`,
    hints: [
      'rev reverses the order of iteration.',
      'skip drops elements from the front; take keeps a prefix.',
    ],
    solution: `The range 1..=10 reversed by rev yields 10, 9, 8, 7, 6, 5, 4, 3, 2, 1. skip(2) drops the first two of those, leaving 8, 7, 6, 5, 4, 3, 2, 1. take(3) then keeps only the first three, giving 8, 7, 6. So v is [8, 7, 6]. The adaptors apply in order along the pipeline: reverse, then skip from the new front, then take a prefix.`,
    tags: ['iterators', 'take', 'rev'],
  },
  {
    id: 'rs-ch13-t-020',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Count of Filtered Items',
    prompt: `Given a vector of integers, you want to know how many are negative. Compare two approaches: a manual for loop with a mutable counter, versus an iterator chain using filter and count. Write the iterator expression and discuss which approach is clearer and whether they do the same amount of work.`,
    hints: [
      'count consumes the iterator and returns how many items it yielded.',
      'filter narrows the items before counting.',
    ],
    solution: `The iterator version is nums.iter().filter(|&&n| n < 0).count(). filter keeps only the negative elements and count consumes the resulting iterator, returning how many items passed, which is the number of negatives. The manual loop would initialize a mutable counter, iterate, and increment it inside an if; it produces the same answer and visits each element once, so both do the same amount of work. The iterator chain is usually clearer because it reads as "keep the negatives, then count them" with no mutable state to track, and Rust compiles it down to comparable machine code.`,
    tags: ['iterators', 'filter', 'count'],
  },
  {
    id: 'rs-ch13-t-021',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Which Closures Are Move Closures',
    prompt: `Explain the difference between these two closures' capture behavior:

let s = String::from("hi");
let a = || println!("{s}");
let b = move || println!("{s}");

Both only print s. Does the move keyword change what kind of capture happens here, and after defining b, can you still use s in the outer scope? Explain.`,
    hints: [
      'Without move, a read-only closure borrows.',
      'move forces capture by value even when a borrow would suffice.',
    ],
    solution: `Without move, closure a captures s by immutable reference because it only reads it, so s remains usable in the outer scope. With move, closure b captures s by value, taking ownership of the String even though it only reads it; move always forces capture by value regardless of how the body uses the variable. After defining b, you can no longer use s in the outer scope because ownership moved into the closure, so an attempt to use s elsewhere would be a use-after-move error. Use move when you need the closure to own its captures, otherwise a plain borrow is lighter.`,
    tags: ['closures', 'move', 'capture'],
  },
  {
    id: 'rs-ch13-t-022',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Reusing a Closure That Captures a Vec',
    prompt: `This snippet fails to compile. Explain why:

let names = vec![String::from("a"), String::from("b")];
let consume = move || names;
let x = consume();
let y = consume();

Identify the trait the closure implements and why the second call is rejected.`,
    hints: [
      'The closure moves names out of itself when called.',
      'Think about how many times such a closure can run.',
    ],
    solution: `The closure consume moves the captured names vector out of itself as its return value, so it can only run once; it implements FnOnce but not FnMut or Fn. The first call consume() succeeds and hands ownership of names to x, emptying the closure of its captured value. The second call consume() is rejected because the closure was already consumed by the first call: there is nothing left to return, so it cannot be called again. Closures that move a captured value out are inherently single-use.`,
    tags: ['closures', 'fnonce', 'borrow-checker'],
  },
  {
    id: 'rs-ch13-t-023',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Implementing Iterator for Counter',
    prompt: `You define struct Counter { count: u32 } and want it to count from 1 up to 5, then stop. Describe what you must do to make Counter usable in a for loop: which trait to implement, which associated type to set, what the single required method is, and the logic that method needs so it yields 1, 2, 3, 4, 5 and then None.`,
    hints: [
      'The Iterator trait has one associated type and one required method.',
      'next must update state and return Some until the limit, then None.',
    ],
    solution: `You implement the Iterator trait for Counter. You set its associated type Item to u32, the type each call yields. The single required method is next(&mut self) -> Option<Self::Item>. Its logic increments self.count and, while count is at most 5, returns Some(self.count); once count exceeds 5 it returns None. Concretely: if self.count < 5, do self.count += 1 and return Some(self.count), else return None. Implementing just next gives you for loops and all the default adaptor methods for free.`,
    tags: ['iterators', 'custom-iterator', 'trait-impl'],
  },
  {
    id: 'rs-ch13-t-024',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Adaptors on a Custom Counter',
    prompt: `Assume Counter implements Iterator yielding 1, 2, 3, 4, 5. Predict the result of:

let sum: u32 = Counter::new()
    .zip(Counter::new().skip(1))
    .map(|(a, b)| a * b)
    .filter(|x| x % 3 == 0)
    .sum();

Trace each adaptor and give the final number. Explain why custom iterators get these adaptors for free.`,
    hints: [
      'zip a Counter with a Counter that skipped its first item.',
      'Multiply each pair, keep multiples of three, then sum.',
    ],
    solution: `The first Counter yields 1,2,3,4,5 and the second after skip(1) yields 2,3,4,5. zip pairs them as (1,2),(2,3),(3,4),(4,5); zip stops when the shorter side ends, so the first Counter's 5 is unpaired and dropped. map multiplies each pair to 2,6,12,20. filter keeps multiples of three, namely 6 and 12. sum adds those to 18. Custom iterators get zip, map, filter, sum, and the rest for free because the Iterator trait provides them as default methods built on top of the single next you implement.`,
    tags: ['iterators', 'custom-iterator', 'adaptors'],
  },
  {
    id: 'rs-ch13-t-025',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Zero-Cost Abstractions',
    prompt: `The Rust book claims iterators are a zero-cost abstraction: a chain like coefficients.iter().zip(buffer.iter()).map(|(c, b)| c * b).sum() compiles to code roughly as fast as a hand-written loop. Explain what "zero-cost" means here and name the compiler techniques that make a high-level iterator chain perform like low-level code.`,
    hints: [
      'Zero-cost means the abstraction adds no runtime overhead over hand-rolling it.',
      'Think about inlining and unrolling at compile time.',
    ],
    solution: `Zero-cost means using the high-level abstraction costs nothing extra at runtime compared to writing the equivalent low-level loop by hand; you do not pay for the convenience. The compiler achieves this mainly by inlining: the closures and the small next methods of each adaptor are inlined into one another, so the whole chain collapses into a single tight loop with no per-element function-call overhead. It can also unroll loops with a known length and keep values in registers, eliminating bounds checks and intermediate allocations where it can prove they are unnecessary. The result is machine code essentially identical to a carefully written manual loop, so you get expressive code with no speed penalty.`,
    tags: ['iterators', 'zero-cost', 'performance'],
  },
  {
    id: 'rs-ch13-t-026',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'FnMut Counter Closure',
    prompt: `Consider a closure used to assign sequential ids:

let mut next_id = 0;
let mut gen = || { next_id += 1; next_id };
let a = gen();
let b = gen();

State the values of a and b. Which Fn-family trait must gen implement, and why must both next_id and gen be declared mut?`,
    hints: [
      'The closure mutates a captured variable each call.',
      'A closure that mutates state cannot be Fn.',
    ],
    solution: `a is 1 and b is 2: each call increments next_id and returns the new value. The closure mutates the captured next_id, so it must implement FnMut (and FnOnce), but not Fn, because it needs exclusive mutable access on every call. next_id must be mut because it is being reassigned inside the closure, and gen must be mut because calling an FnMut closure requires a mutable reference to the closure itself, since invoking it changes its captured state. This is the classic stateful closure pattern.`,
    tags: ['closures', 'fnmut', 'state'],
  },
  {
    id: 'rs-ch13-t-027',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Why filter Receives a Reference',
    prompt: `In nums.iter().filter(|x| **x > 0), the closure parameter ends up needing two dereferences in some cases. Explain why filter passes the closure a reference to each item rather than the item by value, and how that interacts with iter already yielding references. Why is filter_map or a different signature not needed just to read a value?`,
    hints: [
      'filter must not consume the item it tests, since it may keep it.',
      'iter on a Vec already yields &T.',
    ],
    solution: `filter passes a reference to each item because it only inspects the item to decide whether to keep it; it must not take ownership, since items that pass are yielded onward unchanged. When the underlying iterator is nums.iter(), each item is already an &T, and filter hands the closure a reference to that, so the parameter is effectively a double reference &&T, which is why you may need two dereferences (or a pattern like |&&x|) to compare the underlying value. You do not need filter_map or a different method just to read the value; you simply dereference or destructure in the closure. This design lets filter preserve ownership and avoid copying while still letting you examine each element.`,
    tags: ['iterators', 'filter', 'references'],
  },
  {
    id: 'rs-ch13-t-028',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Designing a Word Counter Pipeline',
    prompt: `You are given a Vec<String> of words and want a single iterator expression that returns the total number of characters across only the words longer than three letters. Describe the chain of adaptors and the final consuming step you would use, and explain in words what each stage contributes. Mention which adaptors are lazy and which one forces the work.`,
    hints: [
      'Filter by length, map each kept word to its character count, then sum.',
      'sum is the consuming step.',
    ],
    solution: `You would write something like words.iter().filter(|w| w.len() > 3).map(|w| w.len()).sum::<usize>(). filter is a lazy adaptor that keeps only the words with more than three characters. map is also lazy and transforms each surviving word into its length, a usize. sum is the consuming step that drives the whole pipeline, adding those lengths into a single total and forcing all the prior lazy work to actually execute. Because filter and map are lazy, nothing runs until sum pulls elements through, and the chain reads top to bottom as "keep long words, take their lengths, add them up."`,
    tags: ['iterators', 'pipeline', 'design'],
  },
  {
    id: 'rs-ch13-t-029',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Closure vs Function Pointer for map',
    prompt: `Both of these compile:

let a: Vec<String> = v.iter().map(|n| n.to_string()).collect();
let b: Vec<String> = v.iter().map(ToString::to_string).collect();

Explain when you can pass a named function or method path directly to map instead of a closure, and what advantage a closure has that a bare function path does not. When would you be forced to use a closure?`,
    hints: [
      'Functions and closures both implement the Fn traits.',
      'A closure can capture; a plain function path cannot.',
    ],
    solution: `You can pass a named function or method path directly to map whenever the function's signature matches what the adaptor expects, because functions implement the same Fn-family traits that closures do; here both produce a String from each element. The advantage a closure has is capturing: it can use variables from the surrounding scope, whereas a bare function path cannot reference any local state. You are forced to use a closure when the transformation needs to capture an outside value, for example multiplying by a local factor as in |n| n * factor, since no existing function path carries that factor. When no capture is needed, the function-path form can be slightly cleaner.`,
    tags: ['closures', 'function-pointers', 'map'],
  },
  {
    id: 'rs-ch13-t-030',
    chapter: 13,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Predicting a Stateful Closure in map',
    prompt: `Predict the output:

let mut running = 0;
let prefix: Vec<i32> = vec![1, 2, 3, 4]
    .iter()
    .map(|&x| { running += x; running })
    .collect();
println!("{prefix:?}");
println!("{running}");

Give the contents of prefix and the final value of running, and explain why this closure must be FnMut and how map drives it.`,
    hints: [
      'The closure accumulates a running total as map pulls each element.',
      'Each yielded value is the running sum so far.',
    ],
    solution: `prefix is [1, 3, 6, 10] and running ends at 10. The closure captures running by mutable reference and, for each element, adds it and yields the new running total, producing a prefix-sum sequence: 1, then 1+2, then +3, then +4. Because the closure mutates the captured running on every call, it must implement FnMut, and map repeatedly calls it as collect pulls elements through, threading the mutation across the whole pass. After collect finishes consuming the iterator, running holds the final accumulated total 10.`,
    tags: ['closures', 'fnmut', 'predict-output'],
  },
]

export default problems
