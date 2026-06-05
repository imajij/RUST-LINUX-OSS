import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch04-t-001',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'State the Three Ownership Rules',
    prompt: `Rust enforces memory safety through three ownership rules. Without using a garbage collector or manual free calls, list these three rules in your own words. Then explain in one sentence what happens to a value's memory when those rules are followed.`,
    hints: [
      'Think about how many owners a value can have at once.',
      'Consider what event causes the value to be cleaned up.',
    ],
    solution: `The three rules are: (1) each value in Rust has an owner; (2) there can be only one owner at a time; (3) when the owner goes out of scope, the value is dropped. Because of these rules, when a variable that owns heap data goes out of scope, Rust automatically calls the drop function to free the memory. This gives deterministic cleanup without a garbage collector and without the programmer writing manual free calls. The single-owner rule also prevents two variables from trying to free the same memory (a double free).`,
    tags: ['ownership', 'rules'],
  },
  {
    id: 'rs-ch04-t-002',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Stack Versus Heap for a String',
    prompt: `Consider let s = String::from("hi"). Which part of this value lives on the stack and which part lives on the heap? Name the three pieces of bookkeeping data that the String variable itself stores on the stack.`,
    hints: [
      'A String is a small struct that points to buffer data elsewhere.',
      'The actual text bytes are not stored directly in the variable.',
    ],
    solution: `The text bytes "hi" are stored on the heap, because a String can grow and its size is not known at compile time. The String variable on the stack is a small fixed-size struct that holds three fields: a pointer to the heap buffer, a length (how many bytes are currently used), and a capacity (how many bytes the heap buffer can hold). When you move or copy the String variable, only this stack struct is involved; the heap buffer is not duplicated. This split is why a String move is cheap.`,
    tags: ['memory', 'string'],
  },
  {
    id: 'rs-ch04-t-003',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Borrowing in Plain Words',
    prompt: `Your teammate has never seen Rust references. Explain what borrowing means using a real-world analogy, and state the key difference between borrowing a value and taking ownership of it.`,
    hints: [
      'Borrowing lets you use something without owning it.',
      'When you borrow a book you must give it back; you do not get to keep it.',
    ],
    solution: `Borrowing means creating a reference to a value so you can read or use it without taking ownership, much like borrowing a book from a friend: you can read it, but you do not own it and must return it. With ownership transfer the original variable can no longer use the value, whereas with borrowing the original owner keeps the value and can use it again after the borrow ends. A reference is written with the ampersand symbol, like &s, and does not trigger a drop when it goes out of scope because it does not own the data. This lets functions operate on data without consuming it.`,
    tags: ['borrowing', 'references'],
  },
  {
    id: 'rs-ch04-t-004',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Copy Types Versus Move Types',
    prompt: `Two integers are assigned: let x = 5; let y = x;. After this, both x and y are usable. But for let s1 = String::from("hi"); let s2 = s1; only s2 is usable. Explain why the integer case behaves differently from the String case.`,
    hints: [
      'Integers have a known fixed size stored entirely on the stack.',
      'Some types implement a special trait that changes assignment behavior.',
    ],
    solution: `Integers are entirely stack-allocated with a fixed, known size, and they implement the Copy trait, so assigning x to y makes a cheap bitwise copy and both remain valid. A String holds heap data, so it is not Copy; assigning s1 to s2 moves ownership, invalidating s1 to prevent two owners from freeing the same heap buffer. Types that are simple and stack-only (integers, booleans, chars, floats, and tuples of such types) are Copy, while types that own heap resources are not. So the difference is whether the type is Copy or move-only.`,
    tags: ['copy', 'move'],
  },
  {
    id: 'rs-ch04-t-005',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Use After Move Does Not Compile',
    prompt: `This code fails to compile:

let s1 = String::from("hello");
let s2 = s1;
println!("{}", s1);

Explain exactly what the compiler complains about and which line triggers the error. What single word describes what happened to s1?`,
    hints: [
      'Look at what the assignment let s2 = s1 does to s1.',
      'The error appears where s1 is used, not where it is moved.',
    ],
    solution: `The assignment let s2 = s1 moves the String out of s1 into s2, so s1 is no longer valid. The compiler reports a borrow-of-moved-value error on the println line, saying s1 was moved and used after move. The single word that describes what happened to s1 is "moved". To make this compile you would either clone (let s2 = s1.clone()) so each variable owns its own buffer, or print s2 instead. The move rule exists so that only one variable is responsible for freeing the heap data.`,
    tags: ['move', 'use-after-move'],
  },
  {
    id: 'rs-ch04-t-006',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Clone Versus Move Cost',
    prompt: `You can fix a use-after-move error by calling clone, but it is not always the right choice. Compare what happens to heap memory when you move a String versus when you clone it. When is paying for a clone justified?`,
    hints: [
      'Moving copies only the pointer, length, and capacity.',
      'Cloning allocates a whole new heap buffer.',
    ],
    solution: `Moving a String copies only the small stack struct (pointer, length, capacity) and invalidates the source, so no heap allocation happens and it is very cheap. Cloning allocates a brand new heap buffer and copies all the bytes into it, producing two fully independent Strings; this costs time and memory proportional to the data size. A clone is justified when you genuinely need two independent owned copies that can be modified or kept alive separately, not merely to silence the borrow checker. If you only need to read the data in another place, borrowing with a reference is usually better than cloning.`,
    tags: ['clone', 'move'],
  },
  {
    id: 'rs-ch04-t-007',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Passing a String Into a Function',
    prompt: `A function takes a String by value: fn consume(s: String). After calling consume(my_string), the caller tries to use my_string again and gets an error. Explain why, and name two ways to let the caller keep using its String.`,
    hints: [
      'Passing by value into a function is a move, just like assignment.',
      'You could borrow instead, or have the function hand the value back.',
    ],
    solution: `Passing my_string by value moves ownership into the function parameter, so when consume returns, the String is dropped and my_string in the caller is no longer valid. That is why reusing my_string afterward is a use-after-move error. Two ways to keep using it are: (1) have the function borrow with fn consume(s: &String) or &str so ownership stays with the caller, or (2) have the function return the String so the caller can rebind it, like let my_string = consume(my_string). Borrowing is usually the cleaner solution because it avoids threading the value back and forth.`,
    tags: ['ownership', 'functions'],
  },
  {
    id: 'rs-ch04-t-008',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Returning Ownership Out of a Function',
    prompt: `Predict and explain the behavior: a function fn give() -> String creates let s = String::from("x") inside it and returns s. Why is s not dropped at the end of give, even though it goes out of scope? Where does the value end up?`,
    hints: [
      'Returning a value moves it out of the function.',
      'A move transfers responsibility for dropping the value.',
    ],
    solution: `Returning s moves the String out of the function to the caller, so ownership is transferred rather than the value being dropped. Because ownership moved to the caller, the drop does not happen at the end of give; it will happen later when the caller's binding goes out of scope. The value ends up owned by whatever variable the caller assigns the result to, such as let g = give(). This is the idiomatic way to produce owned data inside a function and hand it back without copying the heap buffer.`,
    tags: ['ownership', 'functions', 'return'],
  },
  {
    id: 'rs-ch04-t-009',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Immutable Reference Length',
    prompt: `Consider fn length(s: &String) -> usize that returns s.len(), called as let n = length(&my_string). Explain what the ampersand does here and why my_string is still usable after the call.`,
    hints: [
      'The ampersand creates a reference rather than transferring ownership.',
      'A reference does not own the value it points to.',
    ],
    solution: `The ampersand in &my_string creates an immutable reference, which lets length read the data without taking ownership of it. Because the function only borrows, ownership never leaves my_string, so the caller can keep using it after the call returns. When the reference goes out of scope at the end of length, nothing is dropped, because the reference does not own the underlying String. This is the standard pattern for read-only access: borrow with a reference instead of moving the whole value.`,
    tags: ['references', 'borrowing'],
  },
  {
    id: 'rs-ch04-t-010',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Mutable Reference to Change a String',
    prompt: `A function appends text: fn add(s: &mut String) { s.push_str(" world"); }. List the two things that must be true at the call site for this to compile, and write how you would call it on a variable named greeting.`,
    hints: [
      'The owning variable itself must be declared a certain way.',
      'You pass a special kind of reference.',
    ],
    solution: `Two things must be true: (1) the owning variable must be declared mutable, like let mut greeting = String::from("hello"), and (2) you must pass a mutable reference using the &mut syntax. The call site looks like add(&mut greeting). Both conditions are required because you cannot take a mutable reference to a value whose binding is not mutable. After the call, greeting holds "hello world" because the function modified the original through the mutable borrow.`,
    tags: ['mutable-references', 'borrowing'],
  },
  {
    id: 'rs-ch04-t-011',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'String Literal Is a Slice',
    prompt: `The type of a string literal like "hello" is &str, not String. Explain what kind of reference a string literal is and why it is immutable. Where do the bytes of a string literal live?`,
    hints: [
      'A literal points into data baked into the compiled program.',
      'The slice type &str borrows a sequence of bytes.',
    ],
    solution: `A string literal has type &str, which is a string slice: an immutable reference to a sequence of UTF-8 bytes stored elsewhere. The bytes of a literal are baked directly into the compiled binary, so the program already knows them at compile time and stores them in read-only program memory. It is immutable because &str is a shared reference into that fixed data, and you cannot mutate through a shared reference. This is also why string literals are fast and never require a heap allocation.`,
    tags: ['slices', 'string', 'literals'],
  },
  {
    id: 'rs-ch04-t-012',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Scope Ends a Borrow',
    prompt: `Explain the concept of a non-lexical lifetime: how does the compiler decide when a reference's borrow ends? Why does the following compile even though it holds an immutable and a mutable borrow in the same block?

let mut s = String::from("hi");
let r1 = &s;
println!("{}", r1);
let r2 = &mut s;
println!("{}", r2);`,
    hints: [
      'A reference is in use only between its creation and its last use.',
      'r1 is never used again after the first println.',
    ],
    solution: `The compiler ends a borrow at the reference's last use, not at the end of the enclosing block. In this code r1 is created and then used for the last time in the first println, so its immutable borrow is over before r2 is created. Because r1 is no longer in scope of use when the mutable borrow r2 begins, there is no overlap between an immutable and a mutable borrow, so the borrow checker accepts it. If r1 were used again after r2 was created, the two borrows would overlap and the code would be rejected.`,
    tags: ['borrowing', 'lifetimes', 'scope'],
  },
  {
    id: 'rs-ch04-t-013',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Two Mutable Borrows Rejected',
    prompt: `This code is rejected:

let mut s = String::from("hi");
let r1 = &mut s;
let r2 = &mut s;
println!("{} {}", r1, r2);

State the exact borrowing rule being violated and explain what category of bug this rule prevents at compile time.`,
    hints: [
      'Count how many mutable references are alive at the same time.',
      'Think about what could go wrong if two writers touched the same data.',
    ],
    solution: `The rule violated is that you can have only one mutable reference to a particular value at a time within a given scope; here both r1 and r2 are mutable borrows of s that are alive together because both are used in the println. The borrow checker reports that it cannot borrow s as mutable more than once at a time. This rule prevents data races at compile time: if two paths could mutate the same data simultaneously with no coordination, the result would be unpredictable. By allowing at most one mutable borrow, Rust guarantees there is exactly one writer, so mutation is always well-defined.`,
    tags: ['mutable-references', 'borrow-rules', 'data-race'],
  },
  {
    id: 'rs-ch04-t-014',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Mixing Mutable and Immutable Borrows',
    prompt: `Explain why this does not compile, and identify the precise line where the error is reported:

let mut s = String::from("hi");
let r1 = &s;
let r2 = &s;
let r3 = &mut s;
println!("{} {} {}", r1, r2, r3);`,
    hints: [
      'Multiple shared references are fine together; the problem is the mutable one.',
      'All three references are used in the final println, so all are alive.',
    ],
    solution: `Multiple immutable references (r1 and r2) coexisting is allowed, but you cannot have a mutable reference while immutable references to the same value are still in use. Here r1 and r2 are used in the final println, so their borrows are alive when r3, a mutable borrow, is created on the line let r3 = &mut s, which is where the error is reported. The rule is that you may have any number of immutable references or exactly one mutable reference, but not both at once. This prevents readers from observing data that a writer is changing underneath them, which would otherwise be a source of inconsistency.`,
    tags: ['borrow-rules', 'mutable-references', 'references'],
  },
  {
    id: 'rs-ch04-t-015',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'The Dangling Reference Function',
    prompt: `This function does not compile:

fn dangle() -> &String {
    let s = String::from("hi");
    &s
}

Explain what a dangling reference is, why the borrow checker rejects this, and how to fix it while still producing a usable String for the caller.`,
    hints: [
      's is dropped when dangle returns.',
      'Returning the value itself transfers ownership instead of a reference.',
    ],
    solution: `A dangling reference is a reference that points to memory that has already been freed. In dangle, the local s is dropped when the function returns, so the returned &s would point to deallocated memory; the borrow checker rejects this, typically noting there is no value for the reference to borrow from that outlives the function. The fix is to return the String by value instead of a reference: change the signature to -> String and return s directly. That moves ownership out to the caller, so the data stays alive and there is no dangling reference. Rust's lifetime analysis guarantees references never outlive the data they point to.`,
    tags: ['dangling', 'references', 'lifetimes'],
  },
  {
    id: 'rs-ch04-t-016',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Why first_word Returns a Slice',
    prompt: `The book's first_word function returns a string slice (&str) rather than a usize index into the string. Explain the bug that returning a bare index could cause, and how returning a slice ties the result to the original data to prevent it.`,
    hints: [
      'An index is just a number with no connection to the String.',
      'A slice borrows the String, so the borrow checker watches both together.',
    ],
    solution: `If first_word returns a usize index, that number is independent of the String; if the String is later cleared or changed, the index becomes meaningless and pointing into the wrong place, but the compiler cannot catch it. Returning a string slice instead borrows part of the original String, so the slice and the String are linked by the borrow checker. If you try to mutate the String (for example call clear, which needs a mutable borrow) while the slice is still in use, the code will not compile because that mixes an immutable borrow with a mutable one. So the slice approach turns a potential runtime logic bug into a compile-time error.`,
    tags: ['slices', 'first-word', 'borrowing'],
  },
  {
    id: 'rs-ch04-t-017',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Anatomy of a Slice',
    prompt: `Given let s = String::from("hello"); let word = &s[0..3];, describe what data the slice word stores internally and what value it represents. How would &s[..2] and &s[2..] differ from &s[0..3]?`,
    hints: [
      'A slice is a pointer plus a length.',
      'Omitting an index defaults to the start or the end of the string.',
    ],
    solution: `The slice word stores a pointer to the byte at index 0 of the String's heap buffer plus a length of 3, so it represents the bytes "hel". &s[..2] is shorthand for &s[0..2], starting at the beginning, giving "he" with length 2. &s[2..] is shorthand for starting at index 2 and running to the end, giving "llo" with length 3. In every case the slice borrows into the existing buffer rather than copying it, which is why slices are cheap and tie their lifetime to the original String.`,
    tags: ['slices', 'string', 'range'],
  },
  {
    id: 'rs-ch04-t-018',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Prefer &str Over &String Parameters',
    prompt: `A function is written as fn first(s: &String) -> &str. The book recommends fn first(s: &str) -> &str instead. Explain why taking &str makes the function more flexible, and what kinds of arguments each version accepts.`,
    hints: [
      'A String can be turned into a &str of its whole contents.',
      'Slices and literals are already &str.',
    ],
    solution: `Taking &str makes the function more general because both String values and string literals can be passed to it. With &String, you can only pass a reference to a String. With &str, you can pass a string literal directly (already a &str), a full-string slice of a String using &my_string or &my_string[..], or any sub-slice. This works because of deref coercion: a &String can be coerced to a &str, but not vice versa. So the &str signature accepts strictly more callers while losing nothing, which is why it is the idiomatic choice.`,
    tags: ['slices', 'functions', 'api-design'],
  },
  {
    id: 'rs-ch04-t-019',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Slicing an Array',
    prompt: `Slices are not only for strings. Given let a = [1, 2, 3, 4, 5];, describe the type of let slice = &a[1..3]; and which elements it covers. What two pieces of information does this slice hold, and why can it not be used to grow the array?`,
    hints: [
      'An array slice has a type written with the element type inside brackets.',
      'A slice references existing memory; it does not own it.',
    ],
    solution: `The slice has type &[i32], an array slice that references elements of a. The range 1..3 covers elements at indices 1 and 2, which are the values 2 and 3, so the slice has length 2. Internally it holds a pointer to the first referenced element and a length. It cannot be used to grow the array because it is just a borrowed view into existing memory that it does not own; the array a has a fixed compile-time size, and a slice has no capacity field or ownership to allow reallocation. Like string slices, it ties its lifetime to the original array.`,
    tags: ['slices', 'array', 'references'],
  },
  {
    id: 'rs-ch04-t-020',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Tuple Move and Partial Return',
    prompt: `Before slices existed, one might write fn calc(s: String) -> (String, usize) that returns the String back along with its length so the caller does not lose ownership. Explain why this pattern is awkward and what chapter 4 feature removes the need for it.`,
    hints: [
      'The function had to consume the String just to read it.',
      'Borrowing lets you read without taking ownership.',
    ],
    solution: `The pattern is awkward because the function must take ownership of the String just to compute its length, then bundle the String back into a tuple so the caller can keep using it; the caller must destructure the tuple to recover the String. This is verbose and exists only to work around the move that taking the String by value caused. The chapter 4 feature that removes the need is borrowing with references: fn calc(s: &String) -> usize lets the function read the data and return just the length, while the caller retains ownership. References make returning the value alongside the answer unnecessary.`,
    tags: ['ownership', 'references', 'functions'],
  },
  {
    id: 'rs-ch04-t-021',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Borrow Ends When a Length Is Returned',
    prompt: `Decide whether this compiles:

let mut s = String::from("hi");
let r = &s;
let len = calc_len(r);
s.push_str("!");
println!("{}", len);

where fn calc_len(x: &String) -> usize returns x.len(). Note that len is a usize, not a reference.`,
    hints: [
      'Where is r last used?',
      'len is a plain number copied out, not a borrow of s.',
    ],
    solution: `It compiles. r is an immutable borrow of s, but its last use is when it is passed to calc_len; after that line the immutable borrow ends. calc_len returns a usize, which is a Copy value computed from the data, not a reference into s, so len holds an independent number with no borrow attached. Therefore when s.push_str("!") takes a mutable borrow of s, no immutable borrow is still alive, and the rule against simultaneous mutable and immutable borrows is not violated. The later println uses len, a plain number, so it does not reintroduce any borrow of s.`,
    tags: ['borrowing', 'lifetimes', 'copy'],
  },
  {
    id: 'rs-ch04-t-022',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Clear While Slice Is Borrowed',
    prompt: `This program does not compile:

let mut s = String::from("hello world");
let word = first_word(&s);
s.clear();
println!("the first word is: {}", word);

where first_word returns a &str slice of s. Walk through the exact sequence of borrows and explain which rule the call to s.clear() violates.`,
    hints: [
      'first_word returns a slice that borrows s immutably.',
      'clear needs a mutable borrow of s.',
    ],
    solution: `first_word(&s) takes an immutable borrow of s and returns a string slice (word) that is itself an immutable borrow into s, so that immutable borrow stays alive as long as word is used. The call s.clear() requires a mutable borrow of s because clearing modifies the String. Since word is used later in the println, the immutable borrow is still active when clear tries to take a mutable borrow, violating the rule that you cannot have a mutable reference while an immutable reference is in use. The borrow checker reports that s cannot be borrowed as mutable because it is also borrowed as immutable, preventing a slice from dangling into emptied data.`,
    tags: ['slices', 'borrow-rules', 'borrowing'],
  },
  {
    id: 'rs-ch04-t-023',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Reborrow Inside an Inner Scope',
    prompt: `Explain why this compiles even though it creates two mutable references to the same String:

let mut s = String::from("hi");
{
    let r1 = &mut s;
    r1.push_str("!");
}
let r2 = &mut s;
r2.push_str("?");

Contrast this with trying to use r1 and r2 in overlapping scopes.`,
    hints: [
      'The inner block ends r1 before r2 is created.',
      'The rule forbids two mutable borrows at the same time, not ever.',
    ],
    solution: `It compiles because r1 lives only inside the inner block; when that block ends, r1 goes out of scope and its mutable borrow of s is released. By the time r2 is created, there is no other active borrow, so taking a second mutable reference is allowed. The one-mutable-reference rule forbids two mutable borrows being alive simultaneously, not having two over the lifetime of the program. If instead you created both r1 and r2 in the same scope and used them while both were still alive, the borrows would overlap and the borrow checker would reject it. Using a scope (or simply not using the earlier reference again) is a common way to satisfy the rule.`,
    tags: ['mutable-references', 'scope', 'borrow-rules'],
  },
  {
    id: 'rs-ch04-t-024',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Function Boundary Versus Local Move',
    prompt: `Compare two snippets and predict which compiles:

A) let s = String::from("x"); let t = s; println!("{}", t);
B) let s = String::from("x"); takes(s); println!("{}", s); where fn takes(v: String) {}

Both perform a move of s. Explain why A is fine but B is not, focusing on which variable is used after the move.`,
    hints: [
      'A move is invalid only if the moved-from variable is used again.',
      'Check which variable each println references.',
    ],
    solution: `Both snippets move the value out of s, but the difference is which variable is used afterward. In A, ownership moves from s into t, and the println uses t, the new owner, so it is valid; s is never touched after the move. In B, ownership moves from s into the parameter v of takes, but the println still references s, which has been moved out of, so it is a use-after-move error. The move rule is symmetric whether the destination is a local variable or a function parameter; what matters is that you do not use the moved-from variable. To fix B, takes could borrow with &String, or return the String for rebinding.`,
    tags: ['move', 'functions', 'use-after-move'],
  },
  {
    id: 'rs-ch04-t-025',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Splitting Borrows in a Swap Idea',
    prompt: `A learner wants to write a function that takes two mutable references and appends the first to the second: fn merge(a: &mut String, b: &mut String). Explain whether merge(&mut s, &mut s) on a single String is allowed, and contrast it with merge(&mut s, &mut t) on two different Strings.`,
    hints: [
      'Two mutable borrows of the same value at once break the rules.',
      'Distinct variables are distinct values.',
    ],
    solution: `Calling merge(&mut s, &mut s) is rejected because it tries to create two simultaneous mutable references to the same String s, which violates the single-mutable-borrow rule. The borrow checker sees s borrowed as mutable more than once at the same time and refuses, since two mutable aliases to one value could conflict. In contrast, merge(&mut s, &mut t) is allowed because s and t are distinct values, so each mutable borrow targets different data and there is no aliasing. The rule constrains multiple mutable references to the same value, not mutable references to separate values.`,
    tags: ['mutable-references', 'borrow-rules', 'aliasing'],
  },
  {
    id: 'rs-ch04-t-026',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'When Clone Is the Right Call',
    prompt: `You have let original = String::from("data"); and you need to pass the contents to a function that stores its argument for later, while also continuing to mutate original yourself afterward. Decide between borrowing, moving, and cloning, and justify the choice given that both sides need an independent, long-lived owned String.`,
    hints: [
      'A borrow would not survive once you mutate the original.',
      'A move would leave you without your own copy.',
    ],
    solution: `Here cloning is the right call. Borrowing fails because the function stores its argument for later, so the reference would need to outlive your continued use, and your later mutation of original would conflict with an outstanding borrow. Moving fails because it would hand the only String to the function and leave you without one to keep mutating. Cloning with original.clone() gives the function its own independent heap buffer to store, while you keep original to mutate freely; the two no longer share data. This is exactly the case where the cost of a clone is justified, because both sides genuinely need separate, long-lived owned copies.`,
    tags: ['clone', 'ownership', 'design'],
  },
  {
    id: 'rs-ch04-t-027',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Copy and Drop Are Mutually Exclusive',
    prompt: `The book notes that a type cannot implement both Copy and the behavior that runs cleanup when a value goes out of scope. Explain why allowing a type to be Copy while also owning a heap resource that needs cleanup would be unsound.`,
    hints: [
      'Copy duplicates the bits without telling the type a copy was made.',
      'Cleanup frees a resource exactly once per owner.',
    ],
    solution: `Copy means assignment duplicates a value by a simple bitwise copy, producing two values that the type is unaware are related. If such a type also owned a heap resource with cleanup, both copies would hold the same pointer, and when each went out of scope each would try to free that one buffer, causing a double free. Cleanup logic assumes exactly one owner is responsible for releasing the resource, which conflicts with Copy creating multiple independent owners silently. That is why Copy is restricted to types whose data is entirely self-contained on the stack and needs no special cleanup, like integers, and why heap-owning types like String are move-only instead.`,
    tags: ['copy', 'drop', 'soundness'],
  },
  {
    id: 'rs-ch04-t-028',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Designing a Safe Tokenizer Signature',
    prompt: `You are designing a function that returns the first whitespace-separated token of some text as a slice, and the caller will keep reading the rest of the text afterward. Choose between returning &str, returning String, and returning a usize index. Justify which is safest and most efficient, referencing borrow-checker guarantees.`,
    hints: [
      'A slice borrows without copying and is checked against later mutation.',
      'Returning a String forces an allocation; an index forces manual care.',
    ],
    solution: `Returning &str is the safest and most efficient choice. It borrows directly into the original text without allocating, so it is cheap, and the borrow checker ties the slice's lifetime to the text so the slice cannot outlive or dangle into modified data. Returning String would force a heap allocation and copy for every token, which is wasteful when the caller only reads it. Returning a usize index gives no protection: nothing links the index to the text, so if the text is later changed the index can silently point to the wrong place, a bug the compiler cannot catch. The &str signature gets correctness from the borrow checker and efficiency from avoiding allocation.`,
    tags: ['slices', 'api-design', 'borrowing'],
  },
  {
    id: 'rs-ch04-t-029',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Does push_str Move or Borrow',
    prompt: `Consider:

let mut a = String::from("foo");
let b = String::from("bar");
a.push_str(&b);
println!("{}", b);

Predict whether this compiles and prints, and explain what kind of access push_str needs to a and to b respectively.`,
    hints: [
      'push_str modifies the String it is called on.',
      'Its argument is a string slice, which is a borrow.',
    ],
    solution: `It compiles and prints "bar". push_str modifies the String it is called on, so it needs a mutable reference to a (which is fine because a is declared mut), and it appends a copy of the bytes from its argument. Its argument has type &str, so &b passes an immutable borrow of b rather than moving it. Because b is only borrowed, not moved, it remains valid and can still be printed afterward. This shows how a method can mutate one String while merely borrowing the data of another.`,
    tags: ['mutable-references', 'borrowing', 'string'],
  },
  {
    id: 'rs-ch04-t-030',
    chapter: 4,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Why Ownership Beats Garbage Collection Here',
    prompt: `Summarize how chapter 4's ownership and borrowing system achieves memory safety without a garbage collector. In your answer, connect three mechanisms: single ownership with drop on scope exit, the borrow rules, and slices, and state what category of bug each one eliminates at compile time.`,
    hints: [
      'Each mechanism targets a different class of memory error.',
      'Think double free, data race or invalid mutation, and dangling pointer.',
    ],
    solution: `Single ownership with automatic drop on scope exit means each value has exactly one owner who frees it once, eliminating double frees and memory leaks without a garbage collector and without manual free calls. The borrow rules (any number of immutable references, or exactly one mutable reference, never both at once) eliminate data races and inconsistent reads, because there is never a writer active alongside other readers or writers. Slices, being references checked by the borrow checker, eliminate dangling and out-of-sync index bugs, since a slice cannot outlive or coexist with mutation of the data it borrows. Together these turn whole classes of runtime memory errors into compile-time errors, giving safety with no runtime collector overhead.`,
    tags: ['ownership', 'borrowing', 'safety'],
  },
]

export default problems
