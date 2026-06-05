import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-rs-10',
  track: 'rust',
  chapter: 10,
  title: 'Generic Types, Traits, and Lifetimes',
  summary: `This chapter introduces the three tools Rust gives you for writing abstract, reusable code without paying a runtime cost: generics let you write one definition that works over many concrete types, traits define shared behavior the way interfaces do in other languages, and lifetimes let the compiler prove that every reference stays valid. Together they are the backbone of idiomatic Rust: nearly every library API, the standard library, and large parts of the Linux kernel's Rust support are built from generic functions constrained by trait bounds with carefully annotated lifetimes. Understanding how monomorphization keeps generics zero-cost and how the borrow checker uses lifetimes to guarantee memory safety is what separates someone who can read Rust from someone who can write and contribute to it.`,
  sections: [
    {
      heading: 'Generics: one definition, many types, zero overhead',
      body: `A generic is a stand-in for a concrete type that you fill in later. Instead of writing a separate largest_i32 and largest_char, you write one function over a type parameter T. The convention is a single uppercase letter, usually T (for "type"), but any CamelCase name works and a descriptive name like Item can aid readability.

You can make functions, structs, enums, and methods generic. The mechanics are the same everywhere: declare the parameter in angle brackets right after the name, then use it where a concrete type would go.

### Where the parameters are declared

For a function the parameters go after the function name: fn largest with angle brackets containing T. For a struct or enum they go after the type name. For methods there is a subtlety worth burning into memory: you must write impl with its own angle-bracketed parameter list so the compiler knows the name in the impl header is a generic, not a concrete type. The impl angle brackets and the type angle brackets are separate things.

### Monomorphization: why generics are free

Here is the part that matters for systems work. Rust generics are NOT like Java generics (which erase types at runtime) and NOT like C++ templates in spirit, though the result is similar to C++. At compile time the compiler performs **monomorphization**: for every concrete type you actually use a generic with, it stamps out a specialized, non-generic copy of the code. A Point of integers and a Point of floats become two distinct concrete types in the final binary.

The consequence is that generic code runs exactly as fast as code you would have hand-written for each type. There is no dynamic dispatch, no boxing, no type tags consulted at runtime. The cost is paid entirely at compile time (longer compiles, larger binaries from code duplication), which is precisely the trade-off you want in performance-critical and kernel code. This static dispatch is the default, and it is why people say Rust's abstractions are "zero-cost."

### A common pitfall

A generic function body can only do things that work for EVERY possible T. You cannot use the greater-than operator on an arbitrary T, because not all types are comparable. The compiler will reject it until you constrain T with a trait bound (covered next). This is the opposite of a duck-typed language: the constraint must be stated up front, not discovered when an unsupported type is passed.`,
      code: [
        {
          lang: 'rust',
          src: `// Generic function. T is constrained so that values of T can be compared.
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut biggest = &list[0];
    for item in list {
        if item > biggest {
            biggest = item;
        }
    }
    biggest
}

// One struct, many concrete instantiations via monomorphization.
struct Point<T> {
    x: T,
    y: T,
}

// Two generic parameters when the fields may differ in type.
struct Pair<T, U> {
    first: T,
    second: U,
}

// Generic enums you already know:
enum Option<T> { Some(T), None }
enum Result<T, E> { Ok(T), Err(E) }`
        },
        {
          lang: 'rust',
          src: `// Generic methods. Note the impl<T> header: T is introduced there.
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
}

// You can also write an impl for ONLY one concrete type. This method
// exists only on Point<f32>, not on Point of any other type.
impl Point<f32> {
    fn distance_from_origin(&self) -> f32 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
}`
        }
      ]
    },
    {
      heading: 'Traits: defining and implementing shared behavior',
      body: `A trait describes a set of methods a type must provide in order to be considered to have some capability. If you come from other languages, a trait is close to an interface or a Haskell type class, but more powerful. A trait definition lists method signatures (the name, parameters, and return type) that describe behavior shared across many types.

### Implementing a trait

You implement a trait for a type with an impl Trait for Type block, filling in a body for each required method. The same type can implement many traits, and the same trait can be implemented for many types. The standard library is full of this: Display for human-readable output, Debug for developer output, Clone for duplication, Iterator for sequences, and so on.

### The orphan rule, and why it exists

There is one critical restriction: you can implement a trait for a type only if the trait, or the type, or both, are local to your crate. You cannot implement an external trait on an external type. This is the **orphan rule** (part of "coherence"). The reason is soundness: if two different crates were both allowed to write impl Display for Vec, the compiler would have two conflicting implementations and no way to choose. By requiring that at least one of the trait or the type be yours, Rust guarantees that for any given trait-and-type pair there is at most one implementation in the entire program. The common workaround when you need to extend a foreign type is the newtype pattern: wrap the foreign type in a one-field tuple struct of your own, then implement the trait on the wrapper.

### Why traits over inheritance

Rust has no class inheritance. Traits plus generics replace it. Instead of "a Dog is an Animal," you say "a Dog implements the Speak trait." This composition-over-inheritance approach avoids the fragile base class problem and lets a type opt into exactly the behaviors it needs. It is also how the Rust-for-Linux project models kernel abstractions: device and driver capabilities are expressed as traits that concrete types implement.`,
      code: [
        {
          lang: 'rust',
          src: `// Define the shared behavior.
pub trait Summary {
    fn summarize(&self) -> String;
}

pub struct Article {
    pub headline: String,
    pub content: String,
}

// Implement it for a concrete type.
impl Summary for Article {
    fn summarize(&self) -> String {
        format!("{}...", self.headline)
    }
}

pub struct Tweet {
    pub username: String,
    pub text: String,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("@{}: {}", self.username, self.text)
    }
}`
        },
        {
          lang: 'rust',
          src: `// The newtype pattern: legally implement a foreign trait on a
// foreign type by wrapping it in a local struct.
use std::fmt;

struct Wrapper(Vec<String>);

impl fmt::Display for Wrapper {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "[{}]", self.0.join(", "))
    }
}`
        }
      ]
    },
    {
      heading: 'Default methods: behavior with a fallback',
      body: `A trait method does not have to be only a signature. You can give it a default implementation directly in the trait. Then a type that implements the trait may either keep the default (by writing nothing for that method in its impl block) or override it with its own version.

### The powerful trick: defaults that call required methods

A default method can call other methods of the same trait, even ones that have no default and must be supplied by the implementor. This lets you define a large amount of behavior in terms of a small required core. An implementor provides only the few mandatory methods, and gets all the derived behavior for free. This is exactly how the standard library's Iterator trait works: you implement just next, and you automatically receive map, filter, fold, collect, and dozens more as default methods built on top of next.

### Why this is a big deal for API design

Default methods let a trait grow over time without breaking every existing implementor. If you add a new method WITH a default, all current implementors keep compiling because they inherit the default. Add one WITHOUT a default and you break every downstream crate. This stability property is central to how mature Rust libraries and the standard library evolve, and it is something to keep in mind when reviewing or proposing trait changes in open source projects.

### Pitfall

Overriding a default method does not let you call the default version from your override. There is no "super" call. If you need both behaviors, factor the shared part into a separate free function or a separate method.`,
      code: [
        {
          lang: 'rust',
          src: `pub trait Summary {
    // Required: every implementor must supply this.
    fn summarize_author(&self) -> String;

    // Default: implementors get this for free, and it calls
    // the required method above.
    fn summarize(&self) -> String {
        format!("(Read more from {}...)", self.summarize_author())
    }
}

pub struct Tweet {
    pub username: String,
}

// Implement ONLY the required method; inherit the default summarize.
impl Summary for Tweet {
    fn summarize_author(&self) -> String {
        format!("@{}", self.username)
    }
}

fn main() {
    let t = Tweet { username: String::from("rustlang") };
    // Calls the default, which calls our summarize_author.
    println!("{}", t.summarize());
}`
        }
      ]
    },
    {
      heading: 'Trait bounds, impl Trait, and where clauses',
      body: `Generics become useful the moment you constrain them. A **trait bound** says "this type parameter must implement this trait," which then lets the generic body call that trait's methods. Without a bound, the body can only treat a T as an opaque value to move or reference.

### Three ways to write the same constraint

There are several syntaxes, and they are mostly interchangeable, so it helps to see them as one idea.

1. **impl Trait in argument position.** Writing a parameter typed as impl Summary is shorthand for "some type that implements Summary." It is concise and reads well for simple cases.
2. **The full generic form with a colon bound.** Writing the type parameter in angle brackets followed by a colon and the trait is the explicit version. It is identical in meaning to the impl Trait argument form, but it gives the type a name, which you need when two parameters must be the SAME type rather than merely both implementing the trait.
3. **Multiple bounds with a plus.** Combine several traits a parameter must satisfy by joining them with a plus sign, for example Display plus Clone.

### where clauses for readability

When a function has several type parameters each with several bounds, stacking all of that into the angle brackets makes the signature unreadable. A **where** clause moves the bounds to a separate, aligned block after the return type. It means exactly the same thing; it is purely a readability tool, and idiomatic code uses it once bounds get nontrivial.

### Why impl Trait in arguments is not always enough

impl Trait in argument position cannot express "two arguments of the same generic type." If you need two parameters to be identical, you must name the type parameter with the generic form. So reach for impl Trait when each position is independent, and reach for a named generic when you need to tie positions together. This is a frequent point of confusion in code review.

### Conditional implementations

Trait bounds also let you implement methods conditionally: an impl block can carry a bound so that certain methods exist only when the inner type satisfies it. The standard library uses this to implement a trait for every type that already implements another trait, a pattern called a blanket implementation, such as ToString being available for everything that implements Display.`,
      code: [
        {
          lang: 'rust',
          src: `use std::fmt::Display;

// (a) impl Trait in argument position: concise.
fn notify(item: &impl Summary) {
    println!("Breaking! {}", item.summarize());
}

// (b) Equivalent named-generic form. Needed when you must say
// two params are the SAME type.
fn notify_two<T: Summary>(a: &T, b: &T) {
    println!("{} and {}", a.summarize(), b.summarize());
}

// (c) Multiple bounds joined with +.
fn show<T: Summary + Display>(item: &T) {
    println!("{} :: {}", item, item.summarize());
}`
        },
        {
          lang: 'rust',
          src: `use std::fmt::{Debug, Display};

// Dense, hard-to-read bounds in the angle brackets:
fn process<T: Display + Clone, U: Clone + Debug>(t: &T, u: &U) -> i32 {
    0
}

// Same meaning, far clearer with a where clause:
fn process_clear<T, U>(t: &T, u: &U) -> i32
where
    T: Display + Clone,
    U: Clone + Debug,
{
    0
}`
        },
        {
          lang: 'rust',
          src: `use std::fmt::Display;

struct Pair<T> {
    x: T,
    y: T,
}

impl<T> Pair<T> {
    fn new(x: T, y: T) -> Self {
        Pair { x, y }
    }
}

// This method exists ONLY when T can be displayed and compared.
impl<T: Display + PartialOrd> Pair<T> {
    fn cmp_display(&self) {
        if self.x >= self.y {
            println!("Largest is x = {}", self.x);
        } else {
            println!("Largest is y = {}", self.y);
        }
    }
}`
        }
      ]
    },
    {
      heading: 'Returning impl Trait, and its limits',
      body: `You can also use impl Trait in return position: a function can declare that it returns some type that implements a trait, without naming the concrete type. This is invaluable for returning closures and iterators, whose real types are unnameable (closures have compiler-generated anonymous types) or absurdly long (chained iterator adapters).

### Why you would do this

Returning impl Iterator lets a function hand back a lazy iterator pipeline while keeping the concrete type private. Callers see only "an iterator of these items," so you are free to change the internal chain of adapters later without breaking the API. It also keeps static dispatch and zero-cost performance, because the compiler still knows the single concrete type behind the scenes; impl Trait in return position is NOT dynamic dispatch.

### The crucial limitation

impl Trait in return position can return only ONE concrete type. Even though two types both implement the same trait, you cannot have one branch return one and another branch return the other. The reason is again monomorphization: the function compiles to a single concrete return type, and a single function cannot have two different concrete return types. If you genuinely need to return different concrete types from different branches, you must erase the type using dynamic dispatch with a boxed trait object, written as a Box of dyn Trait. That moves the dispatch to runtime via a vtable, which costs a pointer indirection but is the right tool when the returned type must vary at runtime. Knowing when each applies (static impl Trait versus dynamic Box of dyn Trait) is a recurring decision in real Rust code.`,
      code: [
        {
          lang: 'rust',
          src: `// Return an unnameable closure type via impl Trait.
fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n
}

// Return a lazy iterator without spelling out its huge concrete type.
fn evens(limit: u32) -> impl Iterator<Item = u32> {
    (0..limit).filter(|n| n % 2 == 0)
}

fn main() {
    let add5 = make_adder(5);
    println!("{}", add5(10)); // 15
    let total: u32 = evens(10).sum();
    println!("{}", total);    // 0+2+4+6+8 = 20
}`
        },
        {
          lang: 'rust',
          src: `use std::fmt::Display;

// This does NOT compile: two different concrete return types.
// fn pick(flag: bool) -> impl Display {
//     if flag { 5 } else { "hello" } // i32 vs &str -> ERROR
// }

// Fix: erase the type with a boxed trait object (dynamic dispatch).
fn pick(flag: bool) -> Box<dyn Display> {
    if flag {
        Box::new(5)
    } else {
        Box::new("hello")
    }
}`
        }
      ]
    },
    {
      heading: 'Lifetimes and the borrow checker',
      body: `Lifetimes are Rust's most distinctive feature and the part newcomers fight with most. A lifetime is the span of program execution during which a reference is valid. Every reference has a lifetime; usually the compiler infers it and you never write it. You only annotate lifetimes when the compiler cannot figure out, on its own, how the lifetimes of several references relate.

### What problem lifetimes solve

The entire goal is to prevent **dangling references**: a reference that points to memory that has already been freed. In a language with manual memory management this is the classic use-after-free bug. Rust's **borrow checker** statically rejects any program where a reference could outlive the data it points to, so use-after-free is impossible without unsafe code. Lifetimes are the bookkeeping the borrow checker uses to do this. They do NOT change how long any value lives at runtime; they are purely a compile-time proof that references are valid. Nothing about lifetimes exists in the final binary.

### Lifetime annotation syntax

A lifetime parameter is named with a leading apostrophe, conventionally a short lowercase name such as the one usually written as a-tick. In a function signature you declare lifetime parameters in the same angle brackets as type parameters, then attach them to references. The annotation does not change the lifetime of any reference; it describes the RELATIONSHIP between the input and output lifetimes so the borrow checker can verify the call site.

### The classic example: longest

Consider a function returning a reference to whichever of two string slices is longer. The compiler cannot know whether the returned reference came from the first or the second argument, so it cannot infer how long the result is valid. You annotate both parameters and the return with the same lifetime, which states: the returned reference is valid for the shorter of the two input lifetimes. Now the borrow checker can verify every caller. If you tried to return a reference to a local variable created inside the function, no annotation could make it valid, and the compiler correctly rejects it because that local is dropped at function end.

### Lifetimes in structs

A struct that holds a reference must annotate that reference's lifetime. This declares that an instance of the struct cannot outlive the reference it holds, which is exactly the invariant you want: the struct is forbidden from dangling.`,
      code: [
        {
          lang: 'rust',
          src: `// Both inputs and the output share lifetime 'a. The returned reference
// is valid only as long as BOTH inputs are valid (the shorter span).
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let s1 = String::from("long string");
    let result;
    {
        let s2 = String::from("short");
        result = longest(s1.as_str(), s2.as_str());
        println!("Longest: {}", result); // OK: used while s2 is alive
    }
    // Using result here would be rejected: s2 is gone.
}`
        },
        {
          lang: 'rust',
          src: `// This will NOT compile: the result references a local that is
// dropped when the function returns -> a dangling reference.
// fn dangle<'a>() -> &'a str {
//     let s = String::from("oops");
//     s.as_str()        // ERROR: borrowed value does not live long enough
// }

// A struct holding a reference must annotate its lifetime. The struct
// instance cannot outlive the string slice it borrows.
struct Excerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first = novel.split('.').next().unwrap();
    let e = Excerpt { part: first };
    println!("{}", e.part);
}`
        }
      ]
    },
    {
      heading: 'Elision rules and the static lifetime',
      body: `If every reference needed an explicit lifetime, Rust would be unbearable to write. In practice you rarely annotate, because the compiler applies the **lifetime elision rules**: a set of deterministic patterns that infer the obvious cases. Elision is not magic and not inference in the general sense; it is three fixed rules the compiler tries in order. If they fully determine every lifetime, you write nothing. If they leave any output lifetime ambiguous, the compiler stops and demands explicit annotations.

### The three elision rules

1. **Each elided input lifetime gets its own distinct parameter.** A function with two reference parameters gets two separate input lifetimes.
2. **If there is exactly one input lifetime, it is assigned to all output lifetimes.** A function taking a single reference and returning a reference is the overwhelmingly common case, and this rule handles it with no annotation needed.
3. **If one of the inputs is the receiver (a method taking a reference to self), the lifetime of self is assigned to all output lifetimes.** This is why methods that return references to fields almost never need annotations.

These rules cover the vast majority of real code. Knowing them lets you predict exactly when the compiler will force you to annotate: typically a free function returning a reference derived from two or more reference parameters, as in longest, where rule 2 does not apply and rule 3 has no self.

### The static lifetime

There is one special, named lifetime called static. A reference with the static lifetime is valid for the entire duration of the program. Every string literal has this lifetime, because the text is baked into the program binary and never freed. You will also see static as a trait bound, where it means the type contains no non-static references, that is, it can be held for as long as needed.

### Pitfall: do not reach for static to silence errors

A common beginner mistake is sprinkling static onto a reference to make a lifetime error go away. That is almost always wrong. The error usually means you are trying to keep a reference alive longer than the data it points to, and forcing the static lifetime either will not compile anyway or will mask a real design problem. The correct fix is usually to restructure ownership (return an owned value, or borrow for a shorter span), not to claim something lives forever. Reserve static for genuinely program-long data like literals and true global constants.`,
      code: [
        {
          lang: 'rust',
          src: `// Rule 2 applies: one input reference -> its lifetime flows to the
// output. No annotation required even though references are involved.
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &b) in bytes.iter().enumerate() {
        if b == b' ' {
            return &s[..i];
        }
    }
    s
}

// Rule 3: the receiver's lifetime flows to the returned reference,
// so this method needs no explicit annotation.
struct Excerpt<'a> {
    part: &'a str,
}

impl<'a> Excerpt<'a> {
    fn announce(&self, note: &str) -> &str {
        println!("Note: {}", note);
        self.part
    }
}`
        },
        {
          lang: 'rust',
          src: `// String literals are 'static: their bytes live in the binary
// for the whole program.
let s: &'static str = "I live for the entire program.";

// All three tools together: generic type with a trait bound,
// a where clause, and a lifetime, in one signature.
use std::fmt::Display;

fn longest_with_announcement<'a, T>(
    x: &'a str,
    y: &'a str,
    ann: T,
) -> &'a str
where
    T: Display,
{
    println!("Announcement! {}", ann);
    if x.len() > y.len() {
        x
    } else {
        y
    }
}`
        }
      ]
    }
  ],
  takeaways: [
    'Generics are monomorphized at compile time into concrete copies, so they have zero runtime cost: no boxing, no dynamic dispatch, exactly as fast as hand-written code.',
    'Declare generic parameters in angle brackets after the name; for methods, impl needs its own angle-bracket parameter list separate from the type.',
    'Traits define shared behavior like interfaces; the orphan rule means at least the trait or the type must be local to your crate, guaranteeing one impl per pair.',
    'Default methods can call required methods, letting a small core (like Iterator::next) generate a large API for free and letting traits grow without breaking implementors.',
    'Trait bounds let generic bodies call trait methods; impl Trait in arguments, named generics with a colon, and where clauses are interchangeable ways to express constraints.',
    'Use a named generic (not impl Trait) when two parameters must be the same type; use a where clause once bounds get long.',
    'impl Trait in return position returns exactly one concrete type with static dispatch; to return different types per branch, use Box of dyn Trait (dynamic dispatch).',
    'Lifetimes are a compile-time proof that references never outlive their data; they prevent dangling references and add nothing to the runtime.',
    'Elision rules (own lifetime per input; single input flows to output; self flows to output) mean you rarely annotate; static means program-long, not a fix for borrow errors.'
  ],
  cheatsheet: [
    { label: 'fn foo<T>(x: T)', value: 'Generic function with type parameter T' },
    { label: 'struct S<T> { x: T }', value: 'Generic struct; impl<T> S<T> to add methods' },
    { label: 'impl<T> Type<T>', value: 'Generic impl block; T is introduced in the impl header' },
    { label: 'impl Type<i32>', value: 'Method(s) that exist only for one concrete instantiation' },
    { label: 'trait Foo { fn bar(&self); }', value: 'Define shared behavior (an interface)' },
    { label: 'impl Foo for Bar', value: 'Implement a trait for a type (subject to the orphan rule)' },
    { label: 'default fn in a trait', value: 'Default method; implementors may keep or override it' },
    { label: 'T: Display + Clone', value: 'Trait bound: T must implement both traits' },
    { label: 'fn f(x: &impl Trait)', value: 'impl Trait argument: any type implementing Trait' },
    { label: 'where T: Display, U: Debug', value: 'Move bounds to a clause for readable signatures' },
    { label: '-> impl Iterator', value: 'Return one concrete type by trait; static dispatch' },
    { label: '-> Box<dyn Trait>', value: 'Return varying types via dynamic dispatch (vtable)' },
    { label: "fn longest<'a>(x: &'a str, y: &'a str) -> &'a str", value: 'Tie input and output reference lifetimes together' },
    { label: "&'static str", value: 'Reference valid for the whole program (e.g. literals)' }
  ]
}

export default note
