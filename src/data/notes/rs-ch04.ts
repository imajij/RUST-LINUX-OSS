import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-rs-04',
  track: 'rust',
  chapter: 4,
  title: 'Understanding Ownership',
  summary: `Ownership is the single feature that lets Rust guarantee memory safety with no garbage collector and no manual free, and it is the conceptual core of the whole language. This chapter explains how every value has exactly one owner, how moving and borrowing transfer or lend access to that value, and how the borrow checker enforces these rules entirely at compile time so that whole classes of bugs, use-after-free, double-free, data races, never reach runtime. If you internalize ownership, borrowing, and slices here, the rest of Rust (and the way the Linux kernel's Rust abstractions are written) stops feeling like fighting the compiler and starts feeling like the compiler doing your bookkeeping for you.`,
  sections: [
    {
      heading: 'The stack, the heap, and why ownership exists',
      body: `Before the rules make sense you need a clear picture of *where* data lives. The **stack** stores values in last-in, first-out order; every value on it must have a known, fixed size at compile time, and pushing and popping are extremely cheap because the machine just moves a pointer. The **heap** is for data whose size is unknown at compile time or can change at runtime: you ask the allocator for a chunk of memory, it finds a free spot and hands back a pointer. That pointer is a fixed-size value that lives on the stack and points at the variable-sized data on the heap.

Heap allocation is slower than the stack (the allocator has to search, and following a pointer is a cache-unfriendly jump), and the deeper problem is *cleanup*. Someone has to give heap memory back. Free it too early and you have a dangling pointer; free it twice and you corrupt the allocator; never free it and you leak. Languages solve this in three broad ways: a garbage collector that periodically reclaims unreachable memory (Java, Go), manual allocate and free that the programmer must get exactly right (C), or Rust's approach, which is ownership.

Ownership answers the cleanup question structurally: the compiler tracks, for every heap value, exactly one variable that is responsible for it, and inserts the free automatically when that variable's scope ends. There is no runtime tracing and no programmer ceremony. The cost is paid up front, in learning the rules and occasionally restructuring code to satisfy them. The payoff is that this is also what makes data races impossible, because the same rules that govern freeing govern who may read and write a value at any moment.

This is exactly why ownership matters for kernel work: the Linux kernel cannot tolerate a garbage collector pausing the world, and C's manual model is the source of a large fraction of its security vulnerabilities. Rust gives the kernel C-level control with compile-time guarantees, and that bargain is ownership.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    // Stack: fixed, known size, copied cheaply.
    let n: i64 = 42;          // 8 bytes, lives entirely on the stack

    // Heap: String owns a growable buffer on the heap.
    // The stack holds three words: a pointer, a length, and a capacity.
    let s = String::from("hello"); // allocator hands back a heap buffer

    println!("{n} and {s}");
    // When main ends, s goes out of scope and its heap buffer is freed
    // automatically. n is just popped off the stack.
}`
        }
      ]
    },
    {
      heading: 'The three rules of ownership',
      body: `Everything in this chapter follows from three rules. Memorize them verbatim, because the borrow checker is nothing more than a mechanical enforcer of these three statements:

1. Each value in Rust has an **owner**.
2. There can be only **one owner at a time**.
3. When the owner goes **out of scope**, the value is **dropped**.

The owner is a variable. A *value* is a piece of data; the *owner* is the binding currently responsible for it. Rule two is the heart of the system: ownership is unique, not shared. Two variables never both own the same heap allocation, which is precisely why Rust never double-frees. Rule three ties cleanup to lexical scope: when a variable goes out of scope, Rust calls a special function named **drop** for it, and for a heap-owning type like String that drop returns the buffer to the allocator. This is the same idea C++ calls RAII (resource acquisition is initialization), but Rust enforces it with the type system rather than leaving it to programmer discipline.

A scope is the region of a program for which a name is valid, normally delimited by curly braces. The moment execution passes the closing brace of the scope where a variable was declared, that variable is no longer valid and its value is dropped. Crucially, drop runs deterministically at a point you can predict by reading the code, not whenever a collector decides to run. That determinism is what lets the same mechanism manage files, locks, and sockets, not just memory: the resource is released exactly when its owner's scope ends.

### Common pitfalls

- Thinking drop is like a finalizer that may run later or never. It runs at the end of scope, in reverse order of declaration, guaranteed (barring a process abort or an explicit leak).
- Trying to call the drop method yourself. You cannot call value.drop() directly; if you need early cleanup, use the free function std::mem::drop(value), which simply takes ownership and lets the value go out of scope immediately.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    {                               // scope begins
        let s = String::from("hi"); // s is the owner, value is valid here
        println!("{s}");
    }                               // scope ends: drop(s) runs, buffer freed
    // println!("{s}"); // ERROR: s no longer exists outside its scope

    // Force an early drop with the free function (not s.drop()):
    let big = String::from("free me now");
    std::mem::drop(big);            // big is moved in and dropped immediately
    // big is no longer usable after this line
}`
        }
      ]
    },
    {
      heading: 'Move semantics: assignment transfers ownership',
      body: `Here is where programmers from other languages get surprised. When you assign one variable to another, or pass it to a function, Rust does not copy heap data and does not create a shared reference by default. It **moves** ownership.

Consider a String. On the stack it is three words: a pointer to the heap buffer, a length, and a capacity. When you write let s2 equals s1, Rust copies those three stack words into s2, so now two stack slots point at the *same* heap buffer. If both were considered valid owners, rule two would be violated and, worse, when both went out of scope the buffer would be freed twice, the classic double-free vulnerability. Rust's solution is decisive: after the assignment, s1 is no longer valid. It has been *moved out of*. Any later use of s1 is a compile error. Only s2 owns the buffer now, so only s2 frees it. This is a move, and it is the default for any type that owns heap data or other resources.

A move is cheap: it is just a copy of the few stack words plus the compiler marking the source as invalid. No heap data is touched. People sometimes call this a shallow copy, but that is imprecise; because the source is invalidated, nothing is ever aliased, so it is better to just call it a move.

The mental model that pays off everywhere: think of a value as a physical resource that can sit in exactly one box. Assigning moves the contents to a new box and leaves the old box empty. Reaching into the empty box is the error the borrow checker catches.

### Common pitfalls

- The infamous error: borrow of moved value or value used here after move. It means you used a variable after its ownership was given away. The fix is usually to borrow (take a reference) instead of move, or to clone if you truly need an independent copy.
- Returning a value from a function moves it out to the caller; passing a value into a function moves it in. So an ordinary function call can consume your variable and leave it unusable afterward, unless the type is Copy or you passed a reference.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    let s1 = String::from("hello");
    let s2 = s1;            // the String is MOVED into s2; s1 is now invalid

    // println!("{s1}");   // ERROR: borrow of moved value: s1
    println!("{s2}");       // fine: s2 is the sole owner

    // Same thing happens across a function boundary:
    let owned = String::from("world");
    consume(owned);         // owned is moved into the function
    // println!("{owned}"); // ERROR: owned was moved away
}

fn consume(s: String) {
    println!("got {s}");
}                           // s dropped here at end of function scope`
        }
      ]
    },
    {
      heading: 'Clone versus Copy: deep copies and stack-only types',
      body: `Moves are about heap-owning data. Two escape hatches change the default.

**Clone** is the explicit deep copy. If you genuinely want a second, independent String with its own heap buffer, call s1.clone(). This duplicates the heap data, so both variables own separate buffers and both remain valid. Clone is a normal method, never implicit, precisely so that an expensive heap allocation is always visible in the source. When you see a clone call you should read it as a flag that says potentially expensive work happens here, and ask whether a borrow would do instead. Overusing clone to silence the borrow checker is the most common beginner anti-pattern; it compiles, but it throws away the performance and discipline Rust is offering you.

**Copy** is the opposite story, for cheap stack-only data. Types like integers, floats, bool, char, and tuples composed only of such types implement the Copy trait. For a Copy type, assignment duplicates the bits and *both* variables stay valid, because the data is small, fixed-size, and entirely on the stack, so there is no heap buffer to alias and nothing to double-free. A copy and a move are mechanically the same bit copy; the only difference is whether the source stays valid afterward. Copy types stay valid (it is a copy); non-Copy types are invalidated (it is a move).

The rule the compiler uses: a type can be Copy only if all of its parts are Copy and it does not need a custom drop. That is why a type that owns a resource (String, Vec, Box, a file handle) can never be Copy, since being Copy would conflict with the unique-ownership cleanup guarantee. You opt a struct into Copy by deriving it, and only when every field is Copy.

### Common pitfalls

- Assuming integers behave like Strings. They do not move, they Copy, so let a equals b leaves b usable. This asymmetry trips people until they think in terms of which types are Copy.
- Reaching for clone reflexively. Each clone is a heap allocation and a memcpy; in a hot loop that is real cost. Prefer a reference unless you need an owned, independent value.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    // Copy types: both stay valid, bits are duplicated on the stack.
    let x = 5;
    let y = x;             // x is Copied, not moved
    println!("{x} {y}");   // both fine

    // Non-Copy: clone if you really need two independent owners.
    let s1 = String::from("hello");
    let s2 = s1.clone();   // deep copy: a second heap buffer is allocated
    println!("{s1} {s2}"); // both valid, both own separate data
}

// Deriving Copy: only allowed because every field is Copy.
#[derive(Clone, Copy, Debug)]
struct Point { x: i32, y: i32 }

fn show(p: Point) { println!("{p:?}"); }

fn caller() {
    let p = Point { x: 1, y: 2 };
    show(p);               // p is Copied into show...
    show(p);               // ...so p is STILL usable here
}`
        }
      ]
    },
    {
      heading: 'References and borrowing',
      body: `Moving ownership in and out of every function would be unbearable, so Rust gives you a way to let a function use a value without taking ownership: a **reference**. A reference, written with an ampersand, is a pointer that is guaranteed to point at a valid value of a particular type for the life of that reference. Creating a reference is called **borrowing**, by analogy with borrowing something in real life: you get to use it, you must give it back, and you do not own it.

When you pass a reference into a function, the function gets read access to the data but the original owner keeps ownership. Nothing is moved, so the caller can keep using the variable afterward. When a reference goes out of scope the value it points to is *not* dropped, because the reference never owned it. This is the everyday way Rust code shares data: borrow, do work, return, and the owner is none the wiser except that its data may have been read.

By default references are immutable: through a plain shared reference you can read the value but you cannot modify it. This matches the immutable-by-default philosophy and, as the next section shows, is the key to safe sharing. A reference is a first-class value with a known size (it is just a pointer), so references themselves are Copy and can be passed around freely.

The opposite operation, getting the value back out from behind a reference, is **dereferencing** with the star operator. Most of the time Rust auto-dereferences for method calls and field access, so you write the star less than you might expect, but it is worth knowing that an ampersand makes a reference and a leading star follows it.

### Common pitfalls

- Forgetting that the function signature must say it takes a reference and the call site must pass one. The two ampersands have to match up.
- Trying to mutate through a shared reference. A plain shared reference is read-only; attempting to assign through it is a compile error telling you to use a mutable reference instead.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    let s = String::from("hello");
    let len = calculate_length(&s); // pass a reference: s is borrowed, not moved
    println!("the length of '{s}' is {len}"); // s is STILL usable here
}

// The parameter is a reference, so the function never owns the String.
fn calculate_length(s: &String) -> usize {
    s.len()
}   // s (the reference) goes out of scope, but nothing is dropped:
    // the reference never owned the String, so the buffer survives.`
        }
      ]
    },
    {
      heading: 'Mutable references and the borrowing rules',
      body: `To modify borrowed data you need a **mutable reference**, written with ampersand-mut. The function parameter becomes a mutable reference type and the call site passes one, and of course the original binding must itself be declared mut. Through a mutable reference you can change the value in place, and the owner sees those changes after the borrow ends.

Mutable references come with the single most important restriction in the language, the rule that makes data races impossible at compile time:

> At any given time, you may have **either one mutable reference, or any number of immutable references**, to a particular piece of data, but not both.

A data race needs three ingredients: two or more pointers accessing the same data, at least one of them writing, and no synchronization. The borrow rule structurally removes the possibility: if something can write (the one mutable reference), nothing else can even read at the same time; if things are reading (the many shared references), nothing can write. The compiler proves the absence of data races by checking aliasing, before the program ever runs. This is sometimes summarized as aliasing XOR mutability: a value can be aliased, or it can be mutable, but not both at once.

Two refinements make this practical. First, the rule is about *overlapping lifetimes*, not whole scopes. A reference's life ends at its last use (this is called non-lexical lifetimes), so you can have an immutable borrow, finish using it, and then take a mutable borrow in the same scope. Second, you can always introduce a new inner scope with braces to end a borrow early and free up the value for a different kind of borrow.

### Common pitfalls

- Cannot borrow as mutable because it is also borrowed as immutable. Reorder so the last use of the shared reference comes before you take the mutable one, or scope the shared borrow.
- Cannot borrow as mutable more than once at a time. Only one mutable reference may be live; collapse the two into one or sequence them.
- Forgetting the owner must be declared let mut before you can take a mutable reference to it.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    let mut s = String::from("hello");
    change(&mut s);            // hand out a mutable borrow
    println!("{s}");           // prints: hello, world

    // Many immutable borrows together are fine:
    let r1 = &s;
    let r2 = &s;
    println!("{r1} {r2}");     // last use of r1 and r2 is HERE

    // After the immutable borrows' last use, a mutable borrow is allowed:
    let r3 = &mut s;
    r3.push('!');
    println!("{r3}");

    // But this would NOT compile, overlapping &mut and &:
    // let a = &mut s;
    // let b = &s;            // ERROR: cannot borrow as immutable
    // println!("{a} {b}");
}

fn change(s: &mut String) {
    s.push_str(", world");
}`
        }
      ]
    },
    {
      heading: 'Dangling references and lifetimes in miniature',
      body: `In C it is easy to return a pointer to a local variable; the function returns, its stack frame is reclaimed, and the caller is left holding a pointer to garbage, a dangling pointer. Rust makes this specific bug impossible. The borrow checker guarantees that a reference can never outlive the data it points to. If you write a function that tries to return a reference to a value created inside it, the value is dropped when the function ends, so the reference would dangle, and the compiler rejects the program outright.

The error message is famously about a missing lifetime, but the underlying meaning is simple: the compiler cannot find any data that will live long enough for the reference you are trying to return to remain valid. The fix is almost always to return the owned value itself (moving it out to the caller, who then owns and eventually drops it) rather than a reference to something local. The full lifetime system in chapter 10 is just the general machinery for expressing how long references must stay valid; here you only need the takeaway that references are checked to never outlive their referent.

This is the same guarantee, viewed from a different angle, that move semantics gave us. Together they close the loop: you can never use a value after it is freed (use-after-free is impossible), you can never free it twice (double-free is impossible), and you can never hold a pointer to freed memory (dangling is impossible). All three are enforced at compile time with zero runtime cost.

### Common pitfalls

- Trying to return a reference to a local String. Return the String by value instead; ownership moves to the caller and everything is valid.
- Reading missing lifetime specifier as a request for more annotations when the real problem is that you are returning a reference to data that is about to be destroyed.`,
      code: [
        {
          lang: 'rust',
          src: `// This does NOT compile: s is dropped at the end of dangle(),
// so the returned reference would point at freed memory.
// fn dangle() -> &String {
//     let s = String::from("hello");
//     &s
// } // s is dropped here; &s would dangle -> compile error

// The fix: return the owned String. Ownership moves out to the caller.
fn no_dangle() -> String {
    let s = String::from("hello");
    s            // move s out; the caller now owns and will drop it
}

fn main() {
    let s = no_dangle();
    println!("{s}");
}`
        }
      ]
    },
    {
      heading: 'The slice type: borrowing part of a collection',
      body: `A **slice** is a reference to a contiguous run of elements inside a collection, rather than to the whole thing. Like any reference it does not own the data; it borrows a window into it. Internally a slice is a fat pointer: two words, a pointer to the first element and a length. This makes slices cheap to pass around and impossible to misuse off the end, because the length travels with the pointer.

The string slice type is written as a reference to str. Writing a range index on a String borrows a run of its bytes; the range is start inclusive, end exclusive, and you can drop either bound to mean the start or end of the string. A crucial and easy-to-miss fact: string slices are indexed by *bytes*, and Rust strings are UTF-8, so slicing in the middle of a multi-byte character panics at runtime. String literals are themselves string slices, pointing into the program's read-only data, which is why a function that takes a string slice can accept both literals and borrowed Strings.

This last point is the practical design lesson of the chapter: prefer a string-slice parameter over a String-reference parameter. A string-slice parameter accepts string literals, whole Strings (via a deref coercion that turns a String reference into a string slice), and substrings, so it is strictly more general and more reusable. The same idea applies to other collections: take a slice of T instead of a reference to a Vec of T for the same flexibility.

The deeper payoff is safety through borrowing. Because a slice holds a live immutable borrow of the collection, the borrow checker forbids mutating or freeing the collection while a slice into it exists. The classic bug where you compute an index into a string, then clear the string, and then use the now-meaningless index, simply cannot compile in Rust: the slice keeps the collection borrowed, so the call that would invalidate it is rejected.

### Common pitfalls

- Slicing a multi-byte UTF-8 character boundary panics; use char_indices or the chars iterator when you need character-aware logic rather than byte ranges.
- Holding a slice and then trying to push to or clear the underlying Vec or String. The active immutable borrow blocks the mutation; finish using the slice first.
- Defaulting to String-reference or Vec-reference parameters. Use string slices and slices of T so callers can pass literals, owned values, and sub-ranges alike.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    let s = String::from("hello world");
    let hello = &s[0..5];   // string slice: borrows bytes 0..5
    let world = &s[6..11];  // borrows bytes 6..11
    println!("{hello} {world}");

    // first_word returns a slice tied to the lifetime of the input.
    let word = first_word(&s);
    println!("first word: {word}");
    // s.clear(); // ERROR if uncommented before 'word' is last used:
    //            // cannot borrow s as mutable while it is borrowed by word

    // Array slices work identically over any contiguous collection:
    let a = [1, 2, 3, 4, 5];
    let middle: &[i32] = &a[1..4]; // a fat pointer: &[2, 3, 4]
    println!("{middle:?}");
}

// Takes a string slice (not &String) so it accepts literals, Strings, and slices.
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &b) in bytes.iter().enumerate() {
        if b == b' ' {
            return &s[0..i];
        }
    }
    s
}`
        }
      ]
    }
  ],
  takeaways: [
    'Three rules: every value has one owner; only one owner at a time; when the owner leaves scope the value is dropped.',
    'Assignment and passing by value MOVE heap-owning types: the source becomes invalid, preventing double-frees with zero runtime cost.',
    'Copy types (integers, bool, char, float, tuples of these) duplicate their bits and leave the source valid; they can never own a resource.',
    'clone is an explicit, potentially expensive deep copy, never implicit; reach for a reference before reaching for clone.',
    'A reference borrows access without taking ownership; dropping a reference never drops the referent.',
    'Aliasing XOR mutability: either one mutable reference or any number of shared references at once, never both. This is what makes data races a compile error.',
    'Borrow lifetimes end at last use (non-lexical lifetimes), so a shared borrow and a later mutable borrow can coexist in one scope.',
    'References can never outlive their data, so dangling references are impossible; return owned values instead of references to locals.',
    'Slices are fat pointers (pointer plus length) that borrow a window into a collection; prefer string-slice and slice-of-T parameters over String and Vec references.'
  ],
  cheatsheet: [
    { label: 'let s2 = s1; (String)', value: 'Moves ownership; s1 becomes invalid' },
    { label: 'let y = x; (i32)', value: 'Copies bits; both x and y stay valid' },
    { label: 's1.clone()', value: 'Explicit deep copy; allocates a second heap buffer' },
    { label: '&value', value: 'Immutable (shared) borrow: read-only, many allowed' },
    { label: '&mut value', value: 'Mutable (exclusive) borrow: read/write, only one allowed' },
    { label: 'deref with star', value: 'Follow a reference to reach the value' },
    { label: 'The borrow rule', value: 'One mutable XOR any number of shared, never both' },
    { label: 'std::mem::drop(v)', value: 'Take ownership of v and drop it immediately' },
    { label: 'End of scope', value: 'Owner is dropped; drop runs, heap memory freed' },
    { label: 'derive(Copy, Clone)', value: 'Opt a struct into Copy; only if every field is Copy' },
    { label: '&s[0..5]', value: 'String slice over bytes 0..4 (end exclusive, byte-indexed)' },
    { label: '&a[1..4]', value: 'Array slice: fat pointer to a sub-range of the array' },
    { label: 'fn f(s: &str)', value: 'Prefer over &String; accepts literals, Strings, and slices' },
    { label: 'fn f(v: &[T])', value: 'Prefer over &Vec; accepts arrays, Vecs, and sub-slices' }
  ]
}

export default note
