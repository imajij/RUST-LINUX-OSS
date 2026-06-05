import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-rs-03',
  track: 'rust',
  chapter: 3,
  title: 'Common Programming Concepts',
  summary: `This chapter is the bedrock: the variables, types, functions, and control flow that nearly every programming language shares, expressed the Rust way. The concepts are familiar, but Rust's specific choices - immutability by default, a strong static type system with inference, the statement-versus-expression distinction, and control-flow constructs that are themselves expressions - shape everything you build later. Mastering these precisely is what lets you read real systems code fluently and stop fighting the compiler. Get sloppy here and ownership, traits, and lifetimes in later chapters will feel like magic instead of consequences.`,
  sections: [
    {
      heading: 'Variables, mutability, and why immutable is the default',
      body: `In Rust a variable binding made with let is **immutable by default**. After you write let x = 5 you cannot reassign x; trying to do so is a compile error, not a runtime surprise. This is the opposite of most languages, where everything is mutable unless you say otherwise.

To allow reassignment you opt in explicitly with let mut x = 5. Now x = 6 is legal. The mut keyword is a piece of documentation enforced by the compiler: any reader scanning the code sees mut and knows this value is expected to change, and its absence is a hard guarantee that it will not.

Why make immutability the default? Three reasons that compound as a codebase grows:

1. It removes a whole category of bugs where a value silently changes from code you did not expect to touch it.
2. It expresses intent. In a large pull request a reviewer can trust that a binding without mut is stable for its whole scope.
3. It is foundational to ownership and fearless concurrency. The compiler leans heavily on knowing what cannot change to prove, at compile time, that data races are impossible.

A common pitfall: forgetting mut and then being confused by the error. The compiler message is excellent here - it literally tells you to add mut. Read it. The other pitfall is over-using mut out of habit from other languages; reach for it only when you genuinely need to reassign.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    let x = 5;
    println!("The value of x is: {x}");
    // x = 6;            // ERROR: cannot assign twice to immutable variable

    let mut y = 5;       // opt in to mutation
    println!("y is: {y}");
    y = 6;               // fine
    println!("y is now: {y}");
}`
        }
      ]
    },
    {
      heading: 'Constants and the const keyword',
      body: `A **constant** is declared with const, not let, and is a different thing from an immutable variable. Constants are always immutable - you can never write const mut - and they come with stricter rules:

- You **must** annotate the type. The compiler will not infer it for a const.
- The value must be a **constant expression**, computable at compile time. You cannot set a const to the result of a function call that only runs at runtime, or to anything read from the environment.
- A const can be declared in any scope, including the module or global scope, which makes it the right tool for values many parts of a program need.
- The naming convention is SCREAMING_SNAKE_CASE.

Constants live for the entire run of the program within the scope they are declared in. Because the compiler can compute them ahead of time, the value is typically inlined at each use site - there is no storage location to mutate, which is part of why mut is meaningless for them.

Use const for values that are genuinely fixed and meaningful: a maximum points cap, the number of seconds in an hour, a buffer size. Hard-coding such numbers inline (so-called magic numbers) is a frequent review complaint; naming them with a const documents intent and gives you one place to change them.

The distinction that trips people up: a const is fixed at compile time and global-capable; a let binding (even without mut) is a runtime value that simply happens not to be reassignable.`,
      code: [
        {
          lang: 'rust',
          src: `// Type annotation is required; value must be a const expression.
const THREE_HOURS_IN_SECONDS: u32 = 60 * 60 * 3;

const MAX_POINTS: u32 = 100_000;   // underscores are visual separators

fn main() {
    println!("{THREE_HOURS_IN_SECONDS} seconds in three hours");
    println!("cap is {MAX_POINTS}");
}`
        }
      ]
    },
    {
      heading: 'Shadowing: reusing a name on purpose',
      body: `Rust lets you declare a new variable with the same name as an existing one. The second declaration **shadows** the first: from that point on, the name refers to the new binding until it too is shadowed or its scope ends. You do this by repeating let.

Shadowing is not mutation, and the difference is important. With mut you reassign the same binding and the type must stay the same. With shadowing you create a brand-new binding, so you may change the type while keeping the name. The classic example is reading text input as a String and then shadowing it with the parsed number under the same name, instead of inventing spaces_str and spaces_num.

Shadowing also respects scope. A shadow introduced inside an inner block disappears when that block ends, and the outer binding is visible again afterward. This makes it safe to use a name temporarily without disturbing the outer value.

Two pitfalls. First, do not confuse shadowing with mutation - let mut spaces = "   "; spaces = spaces.len(); fails to compile because you tried to change a string binding into a number, whereas a fresh let spaces = spaces.len(); is fine. Second, accidental shadowing can hide a value you meant to use; if you genuinely wanted to reuse the original, an unintended let with the same name will silently mask it (the compiler will often warn about an unused original).`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    let x = 5;
    let x = x + 1;          // shadows: x is now 6
    {
        let x = x * 2;      // inner shadow: x is 12 here
        println!("inner x: {x}");
    }
    println!("outer x: {x}");   // back to 6

    // Shadowing can change the type under the same name:
    let spaces = "   ";
    let spaces = spaces.len();   // now a usize, not a &str
    println!("spaces count: {spaces}");
}`
        }
      ]
    },
    {
      heading: 'Scalar types: integers, floats, booleans, and chars',
      body: `Rust is statically typed: every value has a type known at compile time. Usually inference figures it out, but when several types are possible (for example, when parsing a string into a number) you must annotate. The **scalar** types each represent a single value.

### Integers
Integers come in signed (i) and unsigned (u) variants at widths 8, 16, 32, 64, and 128 bits, plus isize and usize whose width matches the target architecture's pointer size (64-bit on most machines). The default integer type is i32. Signed types use two's complement; unsigned types start at 0 and cannot be negative. You can write literals in decimal, hex (0x), octal (0o), binary (0b), and byte (b for a u8), and use underscores as separators like 1_000.

A critical pitfall is **integer overflow**. In a debug build, overflow panics at runtime so you catch the bug. In a release build (--release), overflow silently wraps around using two's-complement. Relying on that wrap is a logic bug; if you actually want wrapping, request it explicitly with methods like wrapping_add, or use checked_add, saturating_add, or overflowing_add to handle the edge deliberately.

### Floating point
Two IEEE-754 types: f64 (double precision, the default) and f32. Prefer f64 unless you have a measured reason not to. Remember that floats are approximate - never compare them for exact equality.

### Booleans
bool is one byte and is either true or false. Conditions in if and while must be a bool; Rust does not treat integers or other values as truthy or falsy.

### Characters
char is Rust's most primitive alphabetic type, written with single quotes, and is **four bytes** representing a Unicode Scalar Value - so it holds far more than ASCII, including accented letters, CJK characters, and emoji. Note that a human-perceived character is not always one char, which matters once you work with real text.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    let a: i32 = -42;          // default integer type
    let big: u64 = 18_446_744_073_709_551_615;
    let hex = 0xff;            // 255
    let byte = b'A';           // u8 = 65

    let f = 2.0;               // f64 by default
    let g: f32 = 3.0;

    let t = true;
    let active: bool = false;

    let letter = 'z';
    let crab = '\u{1F980}';    // a crab, as a single char

    // Overflow handled explicitly instead of relying on release wrap:
    let n: u8 = 250;
    println!("{}", n.wrapping_add(10));        // 4 (wraps)
    println!("{:?}", n.checked_add(10));       // None (would overflow)
    let _ = (a, big, hex, byte, f, g, t, active, letter, crab);
}`
        }
      ]
    },
    {
      heading: 'Compound types: tuples and arrays',
      body: `**Compound** types group multiple values into one. Rust has two primitives: tuples and arrays.

### Tuples
A tuple packs together a fixed number of values that may have **different** types. Its length is fixed at creation and is part of its type. You get values out either by **destructuring** with a pattern, or by indexing with a dot and a zero-based position, as in point.0. The empty tuple, written with two parentheses, is called the **unit type**; it is the value (and type) of an expression that returns nothing meaningful, and it is what a function with no explicit return type returns.

### Arrays
An array is a fixed-length sequence whose elements all have the **same** type, stored contiguously on the stack rather than the heap. Its type is written with T and the length N in brackets. Arrays are useful when you know the number of elements will never change (the months of the year) or when you want stack allocation. If you need a collection that can grow, you want a Vec, which lives on the heap and is covered later.

The pitfall to internalize is **bounds checking**. Indexing an array with a value that is out of range does not read adjacent memory the way C would; instead Rust panics at runtime with an index-out-of-bounds message. This is a deliberate safety guarantee - a would-be buffer over-read becomes a clean, immediate crash rather than a silent vulnerability. The cost is a runtime check, which the compiler often elides when it can prove the index is in range.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    // Tuple: mixed types, fixed length.
    let tup: (i32, f64, char) = (500, 6.4, 'x');
    let (a, b, c) = tup;              // destructure
    println!("{a} {b} {c}");
    println!("first via index: {}", tup.0);

    // Array: same type, fixed length, stack-allocated.
    let months = ["Jan", "Feb", "Mar", "Apr"];
    let zeros = [0; 5];              // [0, 0, 0, 0, 0]
    println!("{} and {} elements", months[0], zeros.len());

    // let bad = months[99];        // panics: index out of bounds
}`
        }
      ]
    },
    {
      heading: 'Functions, parameters, and return values',
      body: `Functions are declared with fn, and Rust convention names them in snake_case. Order does not matter: you may call a function defined later in the file, because the compiler sees the whole module, not just what precedes the call.

Every **parameter** must have its type annotated - this is not optional, and it is a feature. Because signatures are fully typed, the compiler almost never needs to look inside a function to understand how to call it, and human readers get a precise contract at the boundary. You will rarely need type annotations on local let bindings, but you always need them on parameters.

A function's **return value** is the value of its final expression. You write the return type after an arrow, as in arrow i32. You may return early with the return keyword, but idiomatic Rust ends a function with a bare expression and no semicolon - that trailing expression is the return value. This is the single most common beginner mistake: adding a semicolon after the final expression turns it into a statement that evaluates to the unit type, and you get a type-mismatch error saying the function expected i32 but found the unit type.

A function with no arrow returns the unit type implicitly. Keep functions small and well-named; in open-source review, a clear signature and a single clear responsibility carry more weight than cleverness.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    let sum = add(5, 6);
    println!("sum: {sum}");
    print_label(sum);
}

// Parameters must be typed; return type after the arrow.
fn add(x: i32, y: i32) -> i32 {
    x + y               // no semicolon: this IS the return value
}

// Adding a semicolon after x + y would return () and fail to compile.

fn print_label(n: i32) {     // no arrow -> returns the unit type
    println!("value is {n}");
}`
        }
      ]
    },
    {
      heading: 'Statements versus expressions',
      body: `Rust is an **expression-oriented** language, and the line between statements and expressions is one of the most important things in this chapter.

- A **statement** performs an action and returns no value. Declaring a binding with let y = 6; is a statement. So is a function definition. Because a let statement returns no value, you cannot bind the result of one let to another - there is nothing to bind to.
- An **expression** evaluates to a value. Literals like 5, arithmetic like 5 + 6, calling a function or macro, and crucially a **block** wrapped in curly braces are all expressions.

A block evaluates to the value of its last expression - provided that last line has **no trailing semicolon**. Add a semicolon and you turn the expression into a statement, the block then evaluates to the unit type, and many puzzling errors flow from exactly this. This is why if, match, loop, and plain blocks can all appear on the right-hand side of a let: they are expressions that produce values.

This distinction explains the function-return rule from the previous section: a function body is a block, and its value is the final expression. It also explains why a stray semicolon is the number-one cause of unexpected unit-type errors. When the compiler complains about expecting some type but finding the unit type, look for a semicolon you should delete or a value you forgot to produce.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    // A block is an expression; its value is the last line WITHOUT a semicolon.
    let y = {
        let x = 3;
        x + 1            // no semicolon -> the block evaluates to 4
    };
    println!("y is {y}");

    // With a semicolon, the block would be a statement valued ():
    let z = {
        let x = 3;
        x + 1;           // semicolon -> block value is the unit type
    };
    let _ = z;           // z has the unit type
}`
        }
      ]
    },
    {
      heading: 'Control flow with if (and if as an expression)',
      body: `An if runs a block when a condition is true and an optional else block otherwise. The condition **must** be a bool. Rust will not coerce other types: writing if number (where number is an integer) is an error, unlike languages where any nonzero value is truthy. You must say if number != 0. This strictness eliminates a class of bugs around accidental truthiness.

Chain alternatives with else if. Once one arm's condition matches, the rest are skipped. If you find yourself stacking many else if arms, that is often a signal to reach for a match expression instead, which is cleaner and can be checked for exhaustiveness.

Because if is an **expression**, you can use it on the right side of a let to choose a value, the way other languages use a ternary operator. There is one firm rule: every arm of such an if must evaluate to the **same type**, because a binding has a single type known at compile time. If one arm yields an integer and another yields a string, the program will not compile. The compiler needs to know the type of the result regardless of which branch runs.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    let number = 6;

    // Condition must be a bool - no implicit truthiness.
    if number % 4 == 0 {
        println!("divisible by 4");
    } else if number % 3 == 0 {
        println!("divisible by 3");
    } else {
        println!("not divisible by 4 or 3");
    }

    // if as an expression: both arms must be the same type.
    let condition = true;
    let n = if condition { 5 } else { 6 };
    println!("n is {n}");

    // let n = if condition { 5 } else { "six" };  // ERROR: mismatched types
}`
        }
      ]
    },
    {
      heading: 'Loops: loop, while, for, ranges, and labels',
      body: `Rust has three looping constructs, each with a clear best use.

### loop
loop repeats its body forever until you break out. Uniquely, **loop is an expression that can return a value**: put a value after break and the whole loop evaluates to it. This is the idiomatic way to retry an operation until it succeeds and hand back the result. continue skips to the next iteration without leaving the loop.

### Labeled loops
With nested loops, an unlabeled break or continue affects only the innermost loop. To target an outer loop, give it a **label** - an identifier beginning with a single quote, like the word counting prefixed with a quote - and then break or continue that label by name. This avoids awkward flag variables when you need to escape several levels at once. A labeled break can also carry a value.

### while
while runs as long as a condition stays true, re-checking it before each pass. It is the natural choice when the number of iterations depends on a condition rather than a known sequence.

### for and ranges
for iterates over the items of any iterator and is the workhorse loop in idiomatic Rust. Looping a fixed number of times uses a **range**, written start..end (exclusive of end) or start..=end (inclusive). Iterating a collection with for element in collection is both clearer and safer than a manual while loop with an index: there is no off-by-one risk and no per-iteration bounds check from indexing, because the iterator yields each element directly. The common pattern of reversing an inclusive range with rev counts down. Prefer for over index-based while whenever you are walking a collection - it is the change a reviewer will ask for, and it eliminates an entire family of out-of-bounds bugs.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    // loop returns a value via break.
    let mut counter = 0;
    let result = loop {
        counter += 1;
        if counter == 10 {
            break counter * 2;   // loop evaluates to 20
        }
    };
    println!("result: {result}");

    // Labeled loops: break the OUTER loop from inside the inner one.
    'outer: for i in 0..3 {
        for j in 0..3 {
            if i + j == 3 {
                break 'outer;
            }
            println!("i={i} j={j}");
        }
    }

    // while: condition-driven.
    let mut n = 3;
    while n != 0 {
        println!("{n}!");
        n -= 1;
    }

    // for over a collection - preferred over indexed while.
    let arr = [10, 20, 30];
    for value in arr {
        println!("value: {value}");
    }

    // for over a range, counting down.
    for k in (1..=3).rev() {
        println!("countdown {k}");
    }
}`
        }
      ]
    }
  ],
  takeaways: [
    'let bindings are immutable by default; add mut only when you truly need to reassign - the absence of mut is a compiler-enforced guarantee.',
    'const differs from an immutable let: it requires a type annotation, must be a compile-time constant expression, can be global, and is named in SCREAMING_SNAKE_CASE.',
    'Shadowing (a new let with the same name) is not mutation - it makes a fresh binding and may change the type, unlike mut which keeps the same type.',
    'Scalars are integers (default i32), floats (default f64), bool, and char (a 4-byte Unicode Scalar Value); integer overflow panics in debug and wraps in release, so handle it explicitly.',
    'Tuples hold mixed types of fixed length (destructure or index with .0); arrays hold one type of fixed length on the stack and are bounds-checked at runtime.',
    'Every function parameter must be typed; the final expression with no semicolon is the return value - a stray semicolon makes it the unit type and breaks the type.',
    'Statements perform an action and yield no value; expressions (including blocks) yield a value, which is why if, match, loop, and blocks can sit on the right of a let.',
    'if conditions must be a bool (no truthiness), and when used as an expression every arm must produce the same type.',
    'loop can return a value via break; use for over ranges or collections instead of indexed while to avoid off-by-one and out-of-bounds bugs; use loop labels to break outer loops.'
  ],
  cheatsheet: [
    { label: 'let x = 5;', value: 'Immutable binding (default); cannot be reassigned' },
    { label: 'let mut x = 5;', value: 'Mutable binding; may be reassigned (same type)' },
    { label: 'const MAX: u32 = 100;', value: 'Compile-time constant; type required, global-capable' },
    { label: 'let x = x + 1;', value: 'Shadowing: new binding, may change type, reuses the name' },
    { label: 'i8 / u8 ... i128 / u128', value: 'Signed / unsigned integers at fixed bit widths' },
    { label: 'isize / usize', value: 'Pointer-sized integers; usize is the type for indexing' },
    { label: 'f64 / f32', value: 'IEEE-754 floats; f64 is the default; never compare for exact equality' },
    { label: 'a char in single quotes', value: '4-byte Unicode Scalar Value (more than ASCII)' },
    { label: '(500, 6.4, x)', value: 'Tuple: fixed-length, mixed types; index with .0, .1, .2' },
    { label: '[0; 5]', value: 'Array: fixed length, one type, stack-allocated, bounds-checked' },
    { label: 'fn add(x: i32) -> i32 { x }', value: 'Typed params; final expression (no semicolon) is the return value' },
    { label: 'let n = if c { 5 } else { 6 };', value: 'if is an expression; all arms must share one type' },
    { label: 'loop { break val; }', value: 'Infinite loop that can return val via break' },
    { label: 'for x in 1..=5 { }', value: 'Iterate an inclusive range; use .. for exclusive, .rev() to count down' }
  ]
}

export default note
