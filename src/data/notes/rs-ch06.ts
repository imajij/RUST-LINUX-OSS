import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-rs-06',
  track: 'rust',
  chapter: 6,
  title: 'Enums and Pattern Matching',
  summary: `An enum lets you define a type by enumerating its possible variants, so a value can be exactly one of a fixed set of shapes, and each variant can carry its own data. This chapter introduces Rust's enums, the standard Option type that replaces null with compiler-checked absence, and the match expression that inspects a value and branches on which variant it is while binding any data inside. Together these features let you model a domain so precisely that whole categories of bugs, especially null dereferences and forgotten cases, become impossible to write. Pattern matching is one of the features that makes Rust feel safe and expressive at once, and you will see it everywhere in real Rust and in the Rust-for-Linux kernel code.`,
  sections: [
    {
      heading: 'Why Enums Exist: Modeling One-of-Many Choices',
      body: `A struct groups data together, answering "this value has a width AND a height AND a color". An **enum** answers a different and equally common question: "this value is one of several alternatives". An IP address is version four OR version six, never both and never neither. A web event is a click OR a keypress OR a page load. When the right model is a closed set of mutually exclusive cases, an enum captures it directly.

The key word is *closed*. By listing the variants, you tell the compiler the complete universe of possibilities. Nothing outside that list can ever be constructed, and as you will see, the compiler can then force you to consider every possibility when you use the value. This is how Rust turns "did I handle every case?" from a code-review worry into a compile error.

Each named alternative inside an enum is a **variant**. You write the enum name, then the variants between braces. A value of the enum type is created by naming a specific variant, reached through the enum name and the double-colon path, for example IpAddrKind double-colon V4. Every variant is namespaced under the enum, which keeps related possibilities grouped and avoids polluting the surrounding scope with loose names.

Why does this matter for systems and kernel work? Hardware and protocols are full of finite state: a register is in one of a few modes, a packet is one of a handful of types, a device is connected or disconnected or faulted. Modeling these as enums rather than as integers with magic constants means the compiler checks your logic, and an invalid state literally cannot be represented.`,
      code: [
        {
          lang: 'rust',
          src: `// An enum: a value is exactly one of these variants.
enum IpAddrKind {
    V4,
    V6,
}

fn main() {
    // Construct a value by naming a variant via the :: path.
    let four = IpAddrKind::V4;
    let six = IpAddrKind::V6;

    // Both have the SAME type, IpAddrKind, so one function takes either.
    route(four);
    route(six);
}

// The parameter type is the enum; any variant is accepted.
fn route(ip_kind: IpAddrKind) {
    // We will branch on which variant this is in a later section.
    let _ = ip_kind;
}`,
        },
      ],
    },
    {
      heading: 'Variants That Carry Data',
      body: `Variants become far more powerful once they hold data. Instead of pairing an enum with a separate struct to store the associated values, Rust lets you attach data *directly to each variant*. This is the feature that makes enums a true tool for modeling, and it is what C-style enums (which are merely named integers) cannot do.

Each variant can carry data in its own shape, and different variants of the same enum can carry completely different types and amounts of data:

- A variant can hold one or more *positional* values, written in parentheses like a tuple struct, for example V4 holding four bytes.
- A variant can hold *named* fields, written in braces like a struct, when names aid clarity.
- A variant can hold *nothing at all*, a plain name, when its mere presence is the information.

Attaching data to a variant also automatically creates a *constructor function* for that variant: writing the variant name with parentheses both names the case and builds the value, so something like Message double-colon Write with a String argument is a function from String to Message. This is why you can map a list of strings into a list of messages so concisely.

The deep advantage over the struct-plus-enum approach is that the variant and its data are *one indivisible value*. You can never have a V4 tag sitting next to V6 data, because the tag and the payload are bound together by construction. Compare this to the kernel-C habit of a tagged union, where a separate kind field and a union of payloads must be kept in sync by hand, and a single mismatch is undefined behavior. Rust's data-carrying enums are exactly tagged unions, but the compiler guarantees the tag and payload always agree.`,
      code: [
        {
          lang: 'rust',
          src: `// Data attached directly to each variant; shapes can differ per variant.
enum IpAddr {
    V4(u8, u8, u8, u8),     // four positional bytes
    V6(String),             // one positional String
}

// A richer enum: each variant has a different kind of payload.
enum Message {
    Quit,                       // no data
    Move { x: i32, y: i32 },    // named fields, struct-like
    Write(String),              // one String
    ChangeColor(i32, i32, i32), // three i32s, tuple-like
}

impl Message {
    // Just like structs, enums can have methods via impl + self.
    fn describe(&self) -> &str {
        "a message"
    }
}

fn main() {
    // Variant-with-data acts as a constructor: build the value inline.
    let home = IpAddr::V4(127, 0, 0, 1);
    let loopback = IpAddr::V6(String::from("::1"));

    let msgs = [
        Message::Quit,
        Message::Move { x: 10, y: 20 },
        Message::Write(String::from("hi")),
        Message::ChangeColor(255, 0, 0),
    ];

    println!("{}", msgs[0].describe());
    let _ = (home, loopback);
}`,
        },
      ],
    },
    {
      heading: 'The Option Enum: Null Safety Without Null',
      body: `Rust has no null. This is one of its most consequential design decisions, and Option is how it replaces null with something safe. The problem with null, as its own inventor famously called it, is that it is a value of *every* type that secretly means "no value", so the compiler lets you use a possibly-absent value as if it were present, and you only discover the mistake when the program crashes at runtime.

Rust's answer is the standard-library enum **Option**, generic over a type T, with exactly two variants: **Some(T)** holds a present value of type T, and **None** represents absence. Crucially, Option of T and plain T are *different types*. A function returning Option of i32 cannot be used where an i32 is expected; the compiler stops you. This single fact eliminates the entire class of null-dereference bugs, because absence is encoded in the type and you are forced to deal with it before you can touch the inner value.

Option is so fundamental that it is in the prelude, so you write Some and None directly without importing or qualifying them. When you write None on its own, Rust often cannot infer what T is, so you sometimes annotate the type, for example Option of i32, to tell it what kind of value would be there if there were one.

The practical consequence: to get at the value inside a Some, you must first prove you have a Some and not a None. You do that with a match (or one of Option's many helper methods), and in doing so you are *forced* to write the None branch. There is no way to skip it and accidentally use a missing value. This is the whole point. Where C and Java let you ignore the null case until it explodes, Rust converts that latent runtime bomb into an upfront compile-time obligation.

A common confusion: None is not zero, and Option is not a pointer. Some(0) is a present value that happens to be zero, and is completely different from None. Keep "is there a value?" separate from "what is the value?".`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    // Some wraps a present value; T is inferred from the literal.
    let some_number = Some(5);
    let some_char = Some('e');

    // None means "no value". The compiler cannot infer T here, so we
    // annotate the type to say what would be inside if anything were.
    let absent: Option<i32> = None;

    // This does NOT compile: Option<i32> is not i32. You cannot add a
    // possibly-absent number to a definite one without handling None.
    // let sum = some_number + 5; // error[E0277]

    let _ = (some_char, absent);
}

// A function returning Option signals "this might fail to produce a value".
fn first_char(s: &str) -> Option<char> {
    s.chars().next() // returns Some(c) or None for an empty string
}`,
        },
      ],
    },
    {
      heading: 'match: Branch on a Variant and Bind Its Data',
      body: `The **match** expression is the primary way to use an enum. You give it a value and a series of **arms**, each written as a *pattern*, then an arrow made of an equals sign and a greater-than sign, then the code to run. Rust compares the value against each pattern in order from top to bottom and runs the first arm whose pattern matches. Because match is an *expression*, it produces a value, so you can assign its result or return it directly; every arm must produce the same type.

The feature that makes match shine with enums is **binding**. When a variant carries data, the pattern can name that data, and those names become variables holding the inner values inside that arm. This is how you reach into a Some, or pull the bytes out of a V4, or read the x and y from a Move. The destructuring happens as part of the match, so checking "which variant" and extracting "its contents" are a single, safe operation.

Think of an arm as a fork: the pattern on the left is both a test and a request to bind. If the test passes, the bindings are available on the right. A short arm body can be a single expression; a body that needs several statements uses braces, and the value of the block is the arm's value.

This is exactly how you work with Option. Matching Some(value) binds value to the inner content, and the None arm handles absence. Because the enum is closed, the compiler knows there are precisely two cases, and you write code for each. The result is that "extract the value if present, otherwise do something else" becomes a clear two-arm expression rather than an error-prone null check.`,
      code: [
        {
          lang: 'rust',
          src: `enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(String), // the data is the U.S. state on the quarter
}

fn value_in_cents(coin: Coin) -> u32 {
    // match returns a value; every arm yields a u32.
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        // Bind the inner String to 'state' and use it in the arm body.
        Coin::Quarter(state) => {
            println!("State quarter from {}!", state);
            25
        }
    }
}

// Matching Option: bind the inner value in the Some arm, handle None.
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,            // absence stays absence
        Some(i) => Some(i + 1),  // i is bound to the inner value
    }
}

fn main() {
    println!("{}", value_in_cents(Coin::Quarter(String::from("Alaska"))));
    println!("{:?}", plus_one(Some(5))); // Some(6)
    println!("{:?}", plus_one(None));    // None
}`,
        },
      ],
    },
    {
      heading: 'Exhaustiveness, the Catch-All, and the _ Wildcard',
      body: `Matches in Rust are **exhaustive**: you must cover every possible value, or the program will not compile. This is not pedantry, it is a safety net. If you add a new variant to an enum a year from now, every match that does not yet handle it becomes a compile error, pointing you at exactly the places that need updating. In a large codebase, or in kernel code where a missed case is a real bug, this is invaluable. The compiler turns "I forgot to handle the new state" into a list of files to fix.

When the value has too many possibilities to list, or you only care about a few, you use a **catch-all** arm at the end. There are two forms, and the difference matters:

- A *named* catch-all, such as a bare variable name like other, matches anything and *binds* the value, so you can use it in the arm. Use this when the leftover value still carries information you need.
- The **wildcard pattern**, written as a single underscore, matches anything but *does not bind*. Use it when you want to satisfy exhaustiveness but do not need the value. Pairing the underscore with the unit value, an empty pair of parentheses, expresses "in all other cases, do nothing".

A critical ordering rule: a catch-all matches everything, so it must be the **last** arm. Any arm placed after it is unreachable, and Rust warns you about that. Patterns are tried top to bottom, so always go from most specific to most general.

The pitfall to internalize: the underscore wildcard is convenient but it *opts out* of the exhaustiveness benefit for future variants. If you write a wildcard arm on an enum you control, adding a new variant will silently fall into that wildcard instead of producing a helpful compile error. So prefer listing variants explicitly for enums whose evolution you care about, and reserve the wildcard for genuinely open-ended values like integers, or for cases where "everything else" really is a single coherent behavior.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    let dice_roll = 9;

    // Named catch-all: 'other' binds the value so we can use it.
    match dice_roll {
        3 => add_fancy_hat(),
        7 => remove_fancy_hat(),
        other => move_player(other), // any other roll, value captured
    }

    // Wildcard _ : match anything WITHOUT binding.
    match dice_roll {
        3 => add_fancy_hat(),
        7 => remove_fancy_hat(),
        _ => reroll(), // we do not need the value here
    }

    // _ => () means "for all other cases, do nothing".
    match dice_roll {
        3 => add_fancy_hat(),
        _ => (),
    }
}

fn add_fancy_hat() {}
fn remove_fancy_hat() {}
fn move_player(_n: i32) {}
fn reroll() {}`,
        },
      ],
    },
    {
      heading: 'if let and if let else: Concise Single-Case Matching',
      body: `Sometimes a full match is overkill. You care about *one* pattern and want to ignore everything else. Writing a match with one real arm and a wildcard underscore arrow unit just to satisfy exhaustiveness is noisy. The **if let** construct is sugar for exactly that case: it runs a block only when a value matches one pattern, binding any inner data, and otherwise does nothing.

You read if let as "if this value matches this pattern, bind it and run the block". It is most natural with Option: if let Some(value) equals the option lets you handle the present case and skip the absent one. The trade-off is explicit in the book: you gain brevity but you *lose the exhaustiveness check*, because you are no longer forced to handle the other cases. That is a fair trade when you truly do not care about them, and a trap when you do, so choose deliberately.

You can attach an **else** branch, giving if let else, which runs when the pattern does *not* match. This recovers the two-way structure of a match Some-versus-None while staying compact. It is the idiomatic choice for "do this if present, otherwise do that" when there is exactly one pattern of interest.

Newer Rust adds **let else** for a related need: bind a pattern and continue with the binding in the surrounding scope, but if the pattern does not match, run a block that must *diverge*, meaning it returns, breaks, continues, or panics, and therefore never falls through. This flattens the common "unwrap or bail out early" shape, keeping the happy path un-indented instead of nesting it inside an if. It is heavily used in real code, including the kernel, to validate inputs at the top of a function and return early on failure.

The guiding principle: reach for if let or if let else when one case matters and the rest are uniform; reach for full match when you want the compiler to guarantee you handled them all. Use let else when a non-match should abort the current path entirely.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    let config_max: Option<u8> = Some(3);

    // Full match for a single case is verbose:
    match config_max {
        Some(max) => println!("max is {}", max),
        _ => (),
    }

    // if let: same effect, less noise. Binds 'max' only when Some.
    if let Some(max) = config_max {
        println!("max is {}", max);
    }

    // if let ... else: handle the matching case and the rest.
    if let Some(max) = config_max {
        println!("the max is configured to {}", max);
    } else {
        println!("no max configured");
    }
}

// let ... else: bind on success, or diverge early on failure.
// Keeps the happy path flat instead of nested inside an if.
fn double_or_bail(opt: Option<i32>) -> i32 {
    let Some(n) = opt else {
        return -1; // the else block MUST diverge (return/break/panic/...)
    };
    n * 2 // n is in scope here, unwrapped and ready to use
}`,
        },
      ],
    },
    {
      heading: 'Pitfalls, Patterns, and How This Shows Up in Real Code',
      body: `A few traps and habits will save you time as you move into real Rust contributions.

1. *Reaching past None.* You cannot use the inner value of an Option without first handling None. Methods like unwrap and expect appear to skip this, but they panic at runtime on None, which is the very crash Option exists to prevent. In library and kernel-adjacent code, prefer match, if let, or the question-mark operator over a bare unwrap, and reserve unwrap or expect for cases you can prove cannot fail (and document why).

2. *Matching on a value you still need afterward.* A match on a by-value enum that binds owned data, such as a String inside a variant, *moves* that data out of the original. If you need the value after the match, match on a reference instead, by matching against an ampersand expression, so the arms bind references and leave the original intact.

3. *Catch-all hiding new variants.* As noted, a wildcard underscore arm on an enum you own silences the helpful "non-exhaustive" error when a variant is added later. For your own evolving enums, prefer naming variants explicitly so the compiler keeps pointing you at every site that needs updating.

4. *Arm-type mismatch.* Because match is an expression, every arm must yield the same type. Returning a number in one arm and a string in another will not compile. When an arm exists only for a side effect, make it yield the unit value.

5. *Confusing Some(0) with None.* Absence and a present zero are different. Test for the variant, not for a sentinel number.

Where you will see all this: Option is the return type of countless standard methods (next on iterators, get on slices and maps, parse-style lookups). The Result type, coming in a later chapter, is a sibling enum with Ok and Err variants and behaves the same way under match and the question-mark operator. The match-and-bind skill you build here is the same skill you will use to destructure those types, to walk a parsed syntax tree, or to dispatch on a hardware register's mode in low-level code. Pattern matching is not a corner feature; it is the connective tissue of idiomatic Rust.`,
      code: [
        {
          lang: 'rust',
          src: `enum Setting {
    On(String), // owns a label
    Off,
}

fn main() {
    let s = Setting::On(String::from("turbo"));

    // Match on a reference (&s) so the String is NOT moved out;
    // the arm binds &String and s stays usable afterward.
    match &s {
        Setting::On(label) => println!("on: {}", label),
        Setting::Off => println!("off"),
    }

    // Because we matched a reference, s is still valid here.
    if let Setting::On(label) = &s {
        println!("still have: {}", label);
    }

    // Standard-library Option in action: get returns Option<&T>.
    let v = vec![10, 20, 30];
    match v.get(1) {
        Some(value) => println!("found {}", value),
        None => println!("index out of range"),
    }

    // Some(0) is a PRESENT value, not None.
    let maybe = Some(0);
    if let Some(n) = maybe {
        println!("present and equals {}", n); // prints, because it is Some
    }
}`,
        },
      ],
    },
  ],
  takeaways: [
    'An enum defines a type by listing variants; a value is exactly one variant, and the set is closed and compiler-enforced.',
    'Variants can carry data directly (tuple-like, struct-like, or none), making an enum a safe tagged union where tag and payload always agree.',
    'Option replaces null: Some(T) is a present value, None is absence, and Option<T> is a different type from T, so you must handle absence before use.',
    'match compares a value against patterns top to bottom, runs the first that matches, and binds any data inside the matched variant.',
    'match is an expression: it produces a value and every arm must yield the same type.',
    'Matches are exhaustive; you must cover every case, which turns a forgotten variant into a compile error rather than a runtime bug.',
    'A named catch-all binds the leftover value; the _ wildcard matches without binding but opts out of exhaustiveness for future variants.',
    'if let handles one pattern concisely (losing the exhaustiveness check); add else for the other case; use let else to bind or diverge early.',
    'Prefer match, if let, or ? over unwrap/expect, and match on a reference (&value) when you still need the data after the match.',
  ],
  cheatsheet: [
    { label: 'enum Name { A, B(T), C { x: i32 } }', value: 'Define variants: bare, tuple-like, or struct-like' },
    { label: 'Name::A', value: 'Construct a variant via the :: path' },
    { label: 'Name::B(value)', value: 'Variant with data; doubles as a constructor function' },
    { label: 'Option<T>', value: 'Standard enum for maybe-present values; in the prelude' },
    { label: 'Some(x) / None', value: 'Present value of T / absence; None may need a type annotation' },
    { label: 'match v { pat => expr, ... }', value: 'Branch on patterns top to bottom; first match wins' },
    { label: 'Some(i) => i + 1', value: 'Bind inner data, then use it in the arm body' },
    { label: 'other => use(other)', value: 'Named catch-all: matches anything and binds it' },
    { label: '_ => ()', value: 'Wildcard catch-all: match anything, bind nothing, do nothing' },
    { label: 'exhaustive match', value: 'Every case covered or it fails to compile' },
    { label: 'if let Some(x) = opt { ... }', value: 'Run block only when one pattern matches; no exhaustiveness' },
    { label: 'if let ... else { ... }', value: 'Handle the matching case and everything else' },
    { label: 'let Some(x) = opt else { return; }', value: 'Bind or diverge early; else block must not fall through' },
    { label: 'match &v { ... }', value: 'Match a reference to avoid moving owned data out' },
  ],
}

export default note
