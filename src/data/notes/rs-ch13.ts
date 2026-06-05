import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-rs-13',
  track: 'rust',
  chapter: 13,
  title: 'Iterators and Closures',
  summary: `This chapter is about Rust's two flagship functional-programming tools: closures, which are anonymous functions that can capture variables from their surrounding scope, and iterators, which let you process a sequence of items lazily and expressively. Together they let you write high-level, declarative code (map this, filter that, sum the rest) that the compiler lowers to machine code as tight as a hand-written loop. Understanding the Fn family of traits, how capture works, and how iterator adaptors chain is essential reading: it is the idiom you will meet constantly in real Rust codebases, and the zero-cost-abstraction guarantee is one of the language's central promises.`,
  sections: [
    {
      heading: 'Closures: Anonymous Functions That Capture Their Environment',
      body: `A **closure** is an anonymous function you can store in a variable or pass as an argument. Unlike a regular function declared with fn, a closure can **capture** values from the scope in which it is defined and use them later, even after that scope might otherwise look like it has nothing to do with the call.

The syntax is lightweight. You write the parameter list between pipe characters, then the body. Braces are optional for a single-expression body. Because closures are short and local, the compiler can usually **infer** the parameter and return types, so you rarely annotate them, though you may.

The defining feature is environment capture. A plain fn item cannot reach out and grab a local variable from where it was written; a closure can. This is what makes closures so useful for callbacks, lazy initialization, and the iterator adaptors later in this chapter, where you supply a small piece of behavior that needs context from the surrounding function.

> Pitfall: type inference for closures is per-closure, not generic. The first call locks in the inferred concrete types. If you call the same closure variable once with a String and once with an integer, the second call is a type error, because the closure was inferred for whatever the first call passed. Each closure has exactly one set of concrete parameter and return types.

A second subtlety: closures and functions are not the same type. Two closures with identical signatures still have distinct, anonymous, compiler-generated types. That is why you cannot put two different closures in the same Vec without boxing them behind a trait object, and why functions that accept closures use generics or trait objects rather than a concrete closure type.`,
      code: [
        {
          lang: 'rust',
          src: `fn add_one_v1(x: u32) -> u32 { x + 1 }       // a function
let add_one_v2 = |x: u32| -> u32 { x + 1 };  // fully annotated closure
let add_one_v3 = |x|             { x + 1 };  // types inferred from use
let add_one_v4 = |x|              x + 1  ;    // braces optional

// Capturing the environment: 'factor' is not a parameter, it is borrowed
// from the surrounding scope.
let factor = 3;
let scale = |n| n * factor;
println!("{}", scale(10)); // 30

// Inference locks in on first use; this would NOT compile if uncommented:
// let identity = |x| x;
// let s = identity(String::from("hi")); // closure inferred for String
// let n = identity(5);                   // error: expected String, found integer`
        }
      ]
    },
    {
      heading: 'How Closures Capture: Borrow, Mutable Borrow, or Move',
      body: `A closure captures each variable it uses in the **least restrictive** way that still works, exactly mirroring how you would borrow if you wrote the access by hand. There are three modes, and the compiler picks automatically based on what the body does:

1. **By immutable reference** (borrow): the body only reads the captured value. The closure holds a shared reference, so the original is still usable elsewhere while the closure is alive, as long as you do not need a conflicting borrow.
2. **By mutable reference**: the body mutates the captured value. The closure holds a unique reference, so you cannot use the original until the closure is done (and the closure variable itself must be mut to call it).
3. **By value (move)**: the body needs ownership, for example because it returns the value, stores it, or sends it to another thread. The closure takes the value out of the environment.

This is the same borrow-checker discipline you already know from chapter 4, just applied to the variables a closure reaches for. The why is consistency: a closure is sugar for a struct that stores its captured variables as fields, and the capture mode is the field type (shared ref, mutable ref, or owned value). Seeing it that way demystifies the borrow errors.

> Pitfall: a mutable-capturing closure conflicts with any other use of the captured value while the closure still exists. The fix is usually to limit the closure's scope, or to call it and let it drop before the next access. The compiler will tell you the closure already borrows the value mutably.`,
      code: [
        {
          lang: 'rust',
          src: `// 1. Immutable borrow: only reads.
let list = vec![1, 2, 3];
let only_borrows = || println!("from closure: {list:?}");
println!("before call: {list:?}"); // still readable
only_borrows();
println!("after call: {list:?}");

// 2. Mutable borrow: closure variable must be 'mut', and 'list' is
//    exclusively borrowed between definition and last call.
let mut list = vec![1, 2, 3];
let mut borrows_mutably = || list.push(4);
// println!("{list:?}"); // ERROR here: would conflict with the mut borrow
borrows_mutably();
println!("after: {list:?}"); // OK: borrow ended, prints [1, 2, 3, 4]`
        }
      ]
    },
    {
      heading: 'Move Closures and the move Keyword',
      body: `Sometimes you must force a closure to take **ownership** of what it captures even though the body would otherwise only need a borrow. You do this with the **move** keyword before the parameter pipes. The classic reason is lifetime: the closure outlives the scope that created the captured values.

The dominant use case is threads. When you spawn a thread, the closure may run after the spawning function has returned, so any borrowed reference could dangle. Rust refuses to compile a borrowing closure there. Adding move transfers ownership into the closure (and into the new thread), so the data lives exactly as long as the closure does. The same need arises returning a closure from a function or storing one in a struct or a long-lived data structure.

Be precise about what move does and does not mean. move forces by-value capture of every variable the closure uses. For a type that owns heap data, like Vec or String, that is a genuine ownership transfer and the original binding becomes unusable. For a Copy type like i32, by-value capture just copies the value, so the original remains usable, the closure simply has its own copy.

> Pitfall: people reach for move thinking it changes which Fn trait the closure implements. It does not, by itself. move governs how variables are captured (by value); the Fn versus FnMut versus FnOnce distinction is governed by what the body does with those captures. A move closure that only reads a copied value can still be Fn and callable many times.`,
      code: [
        {
          lang: 'rust',
          src: `use std::thread;

let list = vec![1, 2, 3];
println!("before spawn: {list:?}");

// Without 'move' this fails to compile: the thread might outlive the
// spawning frame, so a borrow of 'list' could dangle. 'move' hands
// ownership to the new thread.
thread::spawn(move || println!("from thread: {list:?}"))
    .join()
    .unwrap();
// 'list' is no longer usable here; it was moved into the thread.

// Returning a closure that owns its captures: 'move' makes 'prefix'
// live inside the returned closure, beyond this function call.
fn make_greeter(prefix: String) -> impl Fn(&str) -> String {
    move |name| format!("{prefix}, {name}!")
}`
        }
      ]
    },
    {
      heading: 'The Fn, FnMut, and FnOnce Traits',
      body: `Every closure (and every function) automatically implements one or more of three traits. These traits are how you write generic code that accepts closures, and how the standard library expresses what it will do with the callback you pass.

- **FnOnce**: can be called at least once. A closure that moves a captured value out of itself (consumes it) can only be called once, so it is FnOnce and nothing more. Every closure implements FnOnce, because everything callable can be called once.
- **FnMut**: can be called multiple times and may mutate captured state. Implies FnOnce. A closure that captures by mutable reference and changes something is FnMut but not Fn.
- **Fn**: can be called multiple times without mutating captured state, and can be called concurrently. Implies FnMut and FnOnce. A closure that only reads its captures (or captures nothing) is Fn.

The relationship is a hierarchy: Fn is the most capable and most restrictive to implement (no mutation, no consumption), FnOnce is the least capable and easiest to satisfy. When you write a function parameter, ask for the **weakest** bound that your code actually needs. If you only call the closure once, ask for FnOnce; if you call it repeatedly, FnMut or Fn. Requesting Fn when you only need FnOnce needlessly rejects perfectly good callers.

A real example: Option::unwrap_or_else takes FnOnce, because it calls the fallback closure at most one time. Iterator::map takes FnMut, because it calls the closure once per element and is happy to let it mutate state across elements. Knowing these signatures tells you exactly how a method will treat your closure.`,
      code: [
        {
          lang: 'rust',
          src: `// Standard library signature, paraphrased:
// impl<T> Option<T> {
//     fn unwrap_or_else<F>(self, f: F) -> T
//     where F: FnOnce() -> T { ... }
// }

// Writing our own combinator that calls the closure once:
fn call_once<F: FnOnce() -> String>(f: F) -> String { f() }

let owned = String::from("hello");
// This closure MOVES 'owned' out and returns it: callable only once -> FnOnce.
let consume = move || owned;
println!("{}", call_once(consume));

// FnMut: mutates captured state across many calls.
fn apply_twice<F: FnMut()>(mut f: F) { f(); f(); }
let mut count = 0;
apply_twice(|| count += 1);
println!("count = {count}"); // 2`
        }
      ]
    },
    {
      heading: 'The Iterator Trait, next, and Lazy Evaluation',
      body: `An **iterator** is any type that implements the Iterator trait. The trait has one associated type, Item (what it yields), and one required method, **next**, which returns Some(item) for each element and None once the sequence is exhausted. Everything else (map, filter, sum, and dozens more) is a default method built on top of next.

Calling next advances the iterator, which means iterating mutates it; that is why next takes a mutable self reference and why you bind an iterator with let mut when calling next directly. Most of the time you do not call next yourself, a for loop does it for you behind the scenes, and the loop also takes ownership or a borrow as needed.

The single most important behavioral fact is **laziness**: iterators do nothing until something asks for a value. Creating an iterator, and chaining adaptors onto it, just builds a description of a computation, no work happens, no elements are touched. The pipeline only runs when a **consumer** pulls values out (a for loop, collect, sum, count, and so on). This is why a map or filter with no consumer triggers an unused-must-use warning and does literally nothing.

Know the three ways to get an iterator from a collection, because mixing them up causes ownership surprises:

- **iter** yields shared references to T (the collection is untouched and still usable).
- **iter_mut** yields mutable references to T (lets you modify in place).
- **into_iter** yields owned values of type T and consumes the collection.

A for loop over a value uses into_iter (consuming); a for loop over a reference to a collection uses iter. Reach for the borrowing forms unless you genuinely want to give the collection away.`,
      code: [
        {
          lang: 'rust',
          src: `// The trait, simplified:
// pub trait Iterator {
//     type Item;
//     fn next(&mut self) -> Option<Self::Item>;
//     // ... many default methods built on next ...
// }

let v = vec![1, 2, 3];

// Driving 'next' by hand. Note: iterator must be 'mut'; it yields &i32.
let mut it = v.iter();
assert_eq!(it.next(), Some(&1));
assert_eq!(it.next(), Some(&2));
assert_eq!(it.next(), Some(&3));
assert_eq!(it.next(), None);

// Laziness in action: this line allocates nothing and touches no element.
let pipeline = v.iter().map(|x| x * 100);
// Only NOW does any work happen, when a consumer pulls values:
let scaled: Vec<i32> = pipeline.collect();
println!("{scaled:?}"); // [100, 200, 300]`
        }
      ]
    },
    {
      heading: 'Consuming Adaptors and Iterator Adaptors',
      body: `Methods on Iterator come in two flavors, and the distinction is exactly the laziness story above.

**Iterator adaptors** transform an iterator into a different iterator. They are lazy: they take self and return a new iterator type, doing no work yet. Because they return iterators, they chain. The workhorses:

- **map** applies a closure to each item, yielding the results.
- **filter** keeps only items for which the closure returns true. The closure receives a reference to each item.
- **zip** pairs up two iterators element-by-element, stopping when the shorter one ends, yielding tuples.
- **enumerate** pairs each item with its index, yielding tuples of usize and item.

**Consuming adaptors** call next until exhaustion and produce a final value, ending the chain. They take ownership of the iterator (it cannot be reused after). The common ones:

- **collect** gathers items into a collection. It is generic over the result type, so you usually annotate the target (Vec, String, HashMap, or even Result and Option for fallible collection). This type-directed flexibility is why collect needs a hint via turbofish or a typed binding.
- **sum**, **count**, **fold**, **for_each**, **min**, **max** reduce the sequence to one value or a side effect.

The mental model for a chain is a pull pipeline: the consumer at the end pulls one value, which pulls through each adaptor in turn, one element at a time, with no intermediate collection allocated. That single-element-at-a-time streaming is exactly what makes the whole thing efficient.

> Pitfall: filter's closure takes a reference to the item, so when you are already iterating over references the closure parameter is a reference to a reference, which is why you often see a double-ampersand pattern or an explicit dereference. Also: forgetting the type annotation on collect produces a clear but initially confusing error asking you to specify the collection type. Tell it what you want.`,
      code: [
        {
          lang: 'rust',
          src: `let nums = vec![1, 2, 3, 4, 5, 6];

// map + filter + collect: keep evens, square them.
let result: Vec<i32> = nums
    .iter()
    .filter(|&&x| x % 2 == 0) // &&x: filter gives a ref; item is already &i32
    .map(|&x| x * x)
    .collect();
println!("{result:?}"); // [4, 16, 36]

// enumerate: index alongside value.
for (i, val) in nums.iter().enumerate() {
    println!("nums[{i}] = {val}");
}

// zip: pair two sequences into tuples (and into a HashMap).
use std::collections::HashMap;
let keys = vec!["a", "b", "c"];
let vals = vec![1, 2, 3];
let map: HashMap<_, _> = keys.into_iter().zip(vals.into_iter()).collect();
println!("{:?}", map.get("b")); // Some(2)

// Consuming adaptor: sum reduces to one value.
let total: i32 = nums.iter().sum();
println!("total = {total}"); // 21`
        }
      ]
    },
    {
      heading: 'Implementing Iterator and Zero-Cost Abstractions',
      body: `You can make any type iterable by implementing Iterator: pick the Item type and write next. Once next exists, you inherit the entire toolbox (map, filter, zip, sum, and the rest) for free, because they are default methods. This is the payoff of the trait design: implement one method, gain dozens.

The canonical exercise is a Counter that yields 1 through 5. The whole state lives in the struct; next inspects and advances it, returning Some until the limit, then None forever. After that you can chain your custom iterator with standard adaptors exactly as if it were built in, which demonstrates how composable the abstraction is.

This brings us to the chapter's headline claim: closures and iterators are **zero-cost abstractions**. The phrase means that using these high-level constructs imposes no runtime penalty over hand-writing the equivalent loop. The compiler **monomorphizes** generic adaptor code (one specialized copy per concrete closure type), **inlines** the small closures, and the optimizer fuses the whole chain into a single tight loop. There is no boxing, no virtual dispatch, and no hidden allocation in a straight iterator chain. In benchmarks, an iterator pipeline and the equivalent for loop produce essentially identical assembly, and the iterator version can even be faster because fixed-size patterns let the optimizer unroll and vectorize.

The deeper point, and the reason this matters for systems and kernel-adjacent work: Rust lets you write at a high level of abstraction without apologizing for it in performance. You get the readability of map and filter with the runtime cost of raw pointer arithmetic. That is why idiomatic Rust leans hard on iterators even in performance-critical code; the abstraction genuinely disappears at compile time.

> Pitfall: zero-cost applies to the static, monomorphized path. The moment you box a closure as a dyn Fn trait object or collect into an intermediate Vec in the middle of a chain, you reintroduce dynamic dispatch or an allocation. Keep chains lazy and generic to keep them free.`,
      code: [
        {
          lang: 'rust',
          src: `struct Counter { count: u32 }

impl Counter {
    fn new() -> Counter { Counter { count: 0 } }
}

impl Iterator for Counter {
    type Item = u32;
    fn next(&mut self) -> Option<u32> {
        if self.count < 5 {
            self.count += 1;
            Some(self.count)
        } else {
            None
        }
    }
}

// Implementing 'next' alone unlocks every adaptor for free.
let sum: u32 = Counter::new()
    .zip(Counter::new().skip(1)) // (1,2),(2,3),(3,4),(4,5)
    .map(|(a, b)| a * b)
    .filter(|x| x % 3 == 0)
    .sum();
assert_eq!(sum, 18); // 6 + 12

// Zero-cost: this chain compiles down to a loop as tight as
// 'for' with manual indexing, no boxing or virtual dispatch.`
        }
      ]
    }
  ],
  takeaways: [
    'A closure is an anonymous function that can capture variables from its enclosing scope; the compiler infers its types per closure on first use.',
    'Closures capture in the least restrictive mode the body needs: immutable borrow, mutable borrow, or by value (move), mirroring ordinary borrow rules.',
    'The move keyword forces by-value capture (needed for threads, returning closures, long-lived storage); it controls capture, not which Fn trait is implemented.',
    'Fn, FnMut, FnOnce form a hierarchy: Fn (read-only, repeatable) implies FnMut (mutating, repeatable) implies FnOnce (callable once). Demand the weakest bound your code needs.',
    'Iterator requires only next; every other adaptor is a default method, so implementing one method gives you the entire toolbox.',
    'Iterators are lazy: adaptors build a computation but do nothing until a consumer (for loop, collect, sum) pulls values through.',
    'Iterator adaptors (map, filter, zip, enumerate) return iterators and chain; consuming adaptors (collect, sum, count, fold) end the chain and produce a value.',
    'Use iter for shared refs, iter_mut for mutable refs, into_iter for owned values; pick the borrowing forms unless you truly want to consume the collection.',
    'Closures and iterators are zero-cost abstractions: monomorphization, inlining, and loop fusion make them compile to code as fast as a hand-written loop.'
  ],
  cheatsheet: [
    { label: '|x| x + 1', value: 'Closure literal; types usually inferred, annotate as |x: T| -> R { }' },
    { label: 'move || ...', value: 'Force by-value capture of every used variable (threads, returns, storage)' },
    { label: 'FnOnce', value: 'Callable at least once; may consume captures. Weakest, easiest to satisfy' },
    { label: 'FnMut', value: 'Callable many times, may mutate captures; closure var must be mut to call' },
    { label: 'Fn', value: 'Callable many times, read-only captures; most capable, hardest to satisfy' },
    { label: 'iter / iter_mut / into_iter', value: 'Yield shared refs / mutable refs / owned values respectively' },
    { label: 'next', value: 'Required Iterator method: Some(item) per step, None when exhausted' },
    { label: 'map(|x| ...)', value: 'Lazy adaptor: transform each item, yields a new iterator' },
    { label: 'filter(|x| bool)', value: 'Lazy adaptor: keep items where closure is true; closure gets a reference' },
    { label: 'zip(other)', value: 'Pair two iterators into tuples; stops at the shorter one' },
    { label: 'enumerate', value: 'Yield (index, item) tuples starting at index 0' },
    { label: 'collect', value: 'Consume into a collection; needs a type hint (turbofish or binding)' },
    { label: 'sum / count / fold', value: 'Consuming adaptors: reduce the sequence to one value' },
    { label: 'Lazy evaluation', value: 'No work until a consumer pulls; unused adaptor chains do nothing (must_use)' }
  ]
}

export default note
