import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-rs-19',
  track: 'rust',
  chapter: 19,
  title: 'Advanced Features',
  summary: `This chapter gathers the powerful, occasionally sharp tools you will eventually meet when reading or writing serious Rust: unsafe Rust and its five extra powers, calling and exposing foreign functions through the C ABI, the deeper corners of the trait system, the strange-but-useful types (the never type and dynamically sized types), function pointers and returning closures, and finally Rust's two flavors of macro. None of these are needed for everyday application code, but every one of them appears in the standard library, in low-level crates, and throughout the Rust-for-Linux tree. Mastering them is what lets you read those codebases without flinching and contribute to them safely. The recurring theme is that Rust gives you escape hatches, but expects you to uphold the guarantees the compiler can no longer check for you.`,
  sections: [
    {
      heading: 'Unsafe Rust and its five superpowers',
      body: `Everything you have written so far is **safe Rust**: the compiler statically guarantees memory safety. But that static analysis is conservative. It rejects some programs that are actually correct because it cannot *prove* they are correct, and it cannot see across the boundary into hardware, the operating system, or code written in another language. **Unsafe Rust** is the second language hiding inside Rust that lets you step past the borrow checker's caution.

You opt in with the **unsafe** keyword, which starts a block (or marks a function). Crucially, unsafe does **not** turn off the borrow checker or any other safety check. It only unlocks five additional abilities that are otherwise forbidden:

1. **Dereference a raw pointer.**
2. **Call an unsafe function or method** (including foreign functions).
3. **Access or modify a mutable static variable.**
4. **Implement an unsafe trait.**
5. **Access the fields of a union.**

Within an unsafe block ordinary borrowing, type checking, and lifetime rules still apply. The block simply tells the compiler: "I, the programmer, have verified that the memory invariants hold here; trust me on the five powers above."

### Why it exists, and why it is not a loophole to fear
Underlying computer hardware is inherently unsafe; if Rust did not let you do these things, some low-level tasks would be impossible, and you would have to call out to C for them anyway. Unsafe Rust is how you write the foundational pieces (allocators, OS interfaces, data structures like Vec) that safe Rust is then built on top of.

### The discipline that makes it tractable
Keep unsafe blocks **small** and **isolated**, and where possible wrap them in a **safe abstraction** that exposes a fully safe API. The standard library does this constantly: split_at_mut, for example, uses unsafe internally but presents a safe signature whose contract it upholds. The benefit is that when a memory bug appears, you only have to audit the handful of unsafe blocks, not the whole program. A common, strongly recommended convention is to annotate every unsafe block with a comment (often written as a SAFETY comment) explaining *why* the operation is sound. The Rust-for-Linux project requires exactly this.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    let mut num = 5;

    // Creating raw pointers is allowed in SAFE code...
    let r1 = &num as *const i32;     // immutable raw pointer
    let r2 = &mut num as *mut i32;   // mutable raw pointer

    // ...but DEREFERENCING them requires unsafe.
    unsafe {
        // SAFETY: r1 and r2 came from a valid local, are non-null,
        // properly aligned, and not used concurrently here.
        println!("r1 = {}", *r1);
        *r2 = 10;
        println!("r2 = {}", *r2);
    }
}`
        }
      ]
    },
    {
      heading: 'Raw pointers and unsafe functions',
      body: `**Raw pointers** are written *const T (immutable) and *mut T (mutable). Unlike references and smart pointers, raw pointers come with none of Rust's guarantees, and that is the whole point:

- They are allowed to **ignore the borrowing rules**: you can have both immutable and mutable raw pointers to the same location, or multiple mutable ones.
- They are **not guaranteed to point to valid memory**.
- They are allowed to be **null**.
- They implement **no automatic cleanup** (no Drop).

You can create raw pointers anywhere; only **dereferencing** them is unsafe. Why would you give up the guarantees on purpose? Two big reasons: interfacing with C code (which speaks in raw pointers), and building safe abstractions that the borrow checker cannot otherwise understand. Note you can even cast a literal address to a pointer, which is how memory-mapped hardware registers are reached in kernel and embedded code.

### Unsafe functions
A function marked **unsafe fn** has a **contract**: preconditions the caller must uphold that the compiler cannot verify. Calling one therefore requires an unsafe block, and that block is your acknowledgment that you have read and satisfied the contract. The body of an unsafe fn is itself an unsafe block, so you do not need to nest another one inside.

### The key abstraction lesson: split_at_mut
The standard library method split_at_mut takes one mutable slice and returns two mutable slices that do not overlap. Safe Rust cannot express this, because the borrow checker only sees that you are returning two mutable borrows derived from one slice and assumes they might alias. Internally the method uses unsafe and raw-pointer arithmetic (via add) to construct the two non-overlapping slices, but its public signature is completely safe. This is the model to imitate: a small, well-reasoned unsafe core wrapped in a safe, hard-to-misuse interface. A botched version that used the same start and length for both halves would create two aliasing mutable slices and would be **unsound**, even if it happened to "work" in tests.`,
      code: [
        {
          lang: 'rust',
          src: `use std::slice;

// SAFE public signature wrapping an UNSAFE implementation.
fn split_at_mut(values: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32]) {
    let len = values.len();
    let ptr = values.as_mut_ptr();
    assert!(mid <= len); // uphold the precondition before going unsafe

    unsafe {
        // SAFETY: mid <= len, so both ranges are in-bounds and the two
        // resulting slices cover disjoint regions, so they never alias.
        (
            slice::from_raw_parts_mut(ptr, mid),
            slice::from_raw_parts_mut(ptr.add(mid), len - mid),
        )
    }
}

// An unsafe function declares a contract callers must satisfy.
unsafe fn dangerous() {
    // body is implicitly an unsafe block
}

fn main() {
    let mut v = vec![1, 2, 3, 4, 5, 6];
    let (a, b) = split_at_mut(&mut v, 3);
    a[0] = 100;
    b[0] = 200;
    println!("{a:?} {b:?}");

    unsafe {
        // SAFETY: dangerous has no real precondition in this toy example.
        dangerous();
    }
}`
        }
      ]
    },
    {
      heading: 'FFI: calling C and exposing Rust',
      body: `**FFI** (Foreign Function Interface) is how Rust talks to code written in another language, almost always through the **C ABI** (Application Binary Interface), the lowest-common-denominator calling convention that nearly every language and operating system understands.

### Calling foreign functions
You declare external functions inside an **extern "C"** block. The string "C" names the ABI: it tells the compiler how arguments and return values are laid out and passed in registers and on the stack. The functions inside an extern block have no Rust body; they are just signatures the linker will resolve to symbols defined elsewhere. Because Rust cannot verify anything about foreign code, **every call to a foreign function is unsafe**, so calls live in an unsafe block. (In the 2024 edition, extern blocks are themselves written unsafe extern "C".)

### Exposing Rust functions to other languages
The reverse direction lets C (or any C-ABI caller) call into your Rust. Mark the function **extern "C"** so it uses the C ABI, and add the **#[unsafe(no_mangle)]** attribute (historically just #[no_mangle]) so the compiler does **not** mangle the symbol name. Name mangling is how Rust encodes type information into symbol names; turning it off keeps the name exactly as you wrote it so a C linker can find it. This direction does not by itself require an unsafe block at the definition site, but the function is part of an unsafe contract with its foreign callers.

### Pitfalls that bite contributors
- **Layout and ABI mismatches** are silent and catastrophic: if the Rust signature does not match the C declaration exactly, you get undefined behavior, not a compile error. Tools like bindgen generate the Rust declarations from C headers precisely to avoid this.
- Pass data across the boundary using **#[repr(C)]** types, raw pointers, and C-compatible primitives. Rust's default struct layout is unspecified and must not cross FFI.
- Rust strings are not null-terminated; use std::ffi types (CStr, CString) to bridge to C strings.
- The kernel is a giant exercise in FFI: Rust-for-Linux wraps C kernel APIs in safe Rust abstractions, which is FFI plus the safe-wrapper discipline from the previous section.`,
      code: [
        {
          lang: 'rust',
          src: `// 1) CALLING into C: declare the foreign signature, then call in unsafe.
extern "C" {
    fn abs(input: i32) -> i32; // from the C standard library
}

fn main() {
    unsafe {
        // SAFETY: abs has no precondition beyond a valid i32.
        println!("abs(-3) via C = {}", abs(-3));
    }
}

// 2) EXPOSING Rust to C callers: stable symbol name + C ABI.
#[unsafe(no_mangle)]
pub extern "C" fn call_from_c() {
    println!("Rust function called from C code");
}

// A struct safe to pass across the FFI boundary uses repr(C).
#[repr(C)]
pub struct Point {
    x: i32,
    y: i32,
}`
        }
      ]
    },
    {
      heading: 'Mutable statics, unsafe traits, and unions',
      body: `Three more of the five powers round out unsafe Rust.

### Mutable static variables
A **static** is a global variable with a fixed address for the whole program (unlike a const, which is inlined at each use site). Reading an **immutable** static is safe. A **mutable** static (static mut) is different: because any thread could read or write it at any time, accessing it is **unsafe**, since unsynchronized access is a data race, which is undefined behavior. Static variables must have the 'static lifetime and be of a Sync type. The guidance is to **avoid static mut**; prefer the safe concurrency tools from the concurrency chapter (atomics, Mutex, or thread-safe smart pointers). In recent editions static mut is being deprecated in favor of safer interior-mutability patterns precisely because it is so easy to misuse.

### Unsafe traits
A trait is **unsafe** when at least one of its methods carries an **invariant the compiler cannot verify**. You declare it with unsafe trait, and any implementation must be written unsafe impl, which is the implementer promising to uphold that invariant. The canonical examples are **Send** and **Sync**: by implementing them you are asserting that your type is safe to transfer across threads or to share between threads by reference. The compiler auto-implements them when it can prove safety, but if you build a type out of raw pointers and want it to be Send or Sync, you must opt in with unsafe impl and take responsibility for the claim.

### Unions
A **union** is like a struct, but only one field is active at a time, and all fields share the same storage. Rust does not track which field is currently valid, so **reading any field of a union is unsafe**: you might interpret the bytes as the wrong type. Unions exist almost entirely for **FFI compatibility with C unions**; you rarely need them in pure Rust. The unsafe burden is on you to read only the field that matches what was last written.`,
      code: [
        {
          lang: 'rust',
          src: `// Mutable static: every access is unsafe because of potential data races.
static mut COUNTER: u32 = 0;

fn add_to_count(inc: u32) {
    unsafe {
        // SAFETY: single-threaded use only; prefer atomics in real code.
        COUNTER += inc;
    }
}

// Unsafe trait: implementer promises to uphold an unchecked invariant.
unsafe trait Foo {
    // methods with invariants the compiler cannot verify
}

unsafe impl Foo for i32 {
    // SAFETY: i32 trivially satisfies Foo's (here, empty) contract.
}

// Union: C-style overlapping storage; reading a field is unsafe.
#[repr(C)]
union IntOrFloat {
    i: u32,
    f: f32,
}

fn main() {
    add_to_count(3);
    unsafe { println!("COUNTER = {}", COUNTER); }

    let u = IntOrFloat { i: 1 };
    // SAFETY: we last wrote the i field, so reading i is valid.
    unsafe { println!("as int = {}", u.i); }
}`
        }
      ]
    },
    {
      heading: 'Advanced traits: associated types, operators, and fully qualified syntax',
      body: `### Associated types
An **associated type** connects a type placeholder to a trait so that methods can use that placeholder in their signatures. The standard example is Iterator, whose Item is an associated type. This looks similar to generics, but the difference is decisive: with an associated type, a type can implement the trait **only once**, fixing the Item, whereas with a generic parameter (Iterator<T>) a type could implement it many times for different T, and every call site would then have to annotate which one it meant. Associated types keep call sites clean and the trait's identity singular.

### Default generic type parameters and operator overloading
You can give a generic trait parameter a **default**, written Trait<Rhs = Self>. This powers **operator overloading**: the std::ops::Add trait is generic over the right-hand-side type, defaulting to Self, so for most types you implement Add with no annotations and get the plus operator. You can only overload the operators listed in std::ops; you cannot invent new operators. Supplying a non-default Rhs lets you, for example, add a Meters value to a Millimeters value.

### Disambiguation: calling the right method
When multiple traits (or a trait and the type itself) define a method with the **same name**, Rust needs help choosing. For methods that take **self**, write Trait::method(&value) or value.method() with the trait in scope. For **associated functions without self** (no receiver to infer from), you need **fully qualified syntax**: <Type as Trait>::function(). This spells out exactly which trait's implementation for which type you mean. It is verbose but unambiguous, and you only reach for it when ordinary method-call syntax is genuinely ambiguous.`,
      code: [
        {
          lang: 'rust',
          src: `use std::ops::Add;

// Associated type: Counter fixes Item = u32 by implementing Iterator once.
struct Counter { count: u32 }
impl Iterator for Counter {
    type Item = u32;
    fn next(&mut self) -> Option<Self::Item> {
        if self.count < 5 { self.count += 1; Some(self.count) } else { None }
    }
}

// Operator overloading via Add, using the default Rhs = Self.
#[derive(Debug, PartialEq)]
struct Point { x: i32, y: i32 }
impl Add for Point {
    type Output = Point;
    fn add(self, other: Point) -> Point {
        Point { x: self.x + other.x, y: self.y + other.y }
    }
}

// Same method name in two traits -> fully qualified syntax to disambiguate.
trait Pilot { fn name() -> String; }
trait Wizard { fn name() -> String; }
struct Human;
impl Pilot for Human { fn name() -> String { String::from("Captain") } }
impl Wizard for Human { fn name() -> String { String::from("Gandalf") } }

fn main() {
    assert_eq!(Point { x: 1, y: 0 } + Point { x: 2, y: 3 }, Point { x: 3, y: 3 });
    // Associated function with no self: must say which trait's impl.
    println!("{}", <Human as Wizard>::name());
}`
        }
      ]
    },
    {
      heading: 'Supertraits, the newtype pattern, and advanced types',
      body: `### Supertraits
Sometimes a trait depends on another trait's functionality. Declaring **trait OutlinePrint: Display** makes Display a **supertrait** of OutlinePrint: any type implementing OutlinePrint must also implement Display, and OutlinePrint's methods may call Display's methods (like to_string). This is how you require and reuse another trait's behavior.

### The newtype pattern
A **newtype** is a tuple struct with a single field that wraps an existing type. It has two superpowers. First, it sidesteps the **orphan rule**, which forbids implementing an external trait on an external type: by wrapping the external type in your own local Wrapper struct, the type is now local, so you may implement the external trait on it. The classic case is implementing Display for a Vec by wrapping it. Second, newtypes provide **type safety and abstraction** at zero runtime cost: Meters(f64) and Millimeters(f64) are distinct types the compiler will not let you mix up, even though both are just an f64. The wrapper has no runtime overhead. The minor cost is that the wrapper does not automatically expose the inner type's methods; you forward the ones you want, or implement Deref to expose all of them.

### The never type
The type written **!** is the **never type** (formally an empty type, because it has no values). An expression of type ! never produces a value because it never finishes normally: continue, break, panic!, a call to process::exit, and an infinite loop all have type !. Its usefulness is that ! **coerces to any other type**, which is what lets a match arm ending in continue or panic! coexist with arms that produce a real value: the never-typed arm is compatible with whatever type the other arms yield. Option::unwrap relies on this; its panic branch has type !.

### Dynamically sized types and Sized
Most types have a size known at compile time, but **dynamically sized types** (DSTs, or unsized types) such as str and dyn Trait do not. You can never have a bare value of an unsized type; you must always put it **behind a pointer** (such as &str, Box<str>, or Box<dyn Trait>), which is a *fat pointer* carrying the data pointer plus extra metadata (a length for str, a vtable pointer for dyn Trait). To make all this work, Rust has a special trait, **Sized**, that the compiler auto-implements for every type whose size is known. Every generic function implicitly gets a T: Sized bound. You can relax it with the special syntax **?Sized** ("T may or may not be Sized"), but then T must be used behind a pointer, for example &T. This is why so many generic APIs over slices and trait objects are written with ?Sized.`,
      code: [
        {
          lang: 'rust',
          src: `use std::fmt;

// Newtype to bypass the orphan rule: implement an external trait (Display)
// on an external type (Vec) by wrapping it in a LOCAL struct.
struct Wrapper(Vec<String>);
impl fmt::Display for Wrapper {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "[{}]", self.0.join(", "))
    }
}

// Supertrait: OutlinePrint requires Display and uses to_string() from it.
trait OutlinePrint: fmt::Display {
    fn outline_print(&self) {
        let s = self.to_string();
        let len = s.len();
        println!("{}", "*".repeat(len + 4));
        println!("* {s} *");
        println!("{}", "*".repeat(len + 4));
    }
}

// ?Sized relaxes the implicit Sized bound; t must be used behind a pointer.
fn print_unsized(t: &dyn fmt::Display) {
    println!("{t}");
}

// The never type: this function's ! return is compatible with any context.
fn always_panics() -> ! {
    panic!("this function never returns normally");
}

fn main() {
    let w = Wrapper(vec![String::from("a"), String::from("b")]);
    println!("{w}");
    print_unsized(&42);
}`
        }
      ]
    },
    {
      heading: 'Function pointers and returning closures',
      body: `### Function pointers
You can pass a regular function (not just a closure) as an argument using the **fn** type (lowercase), called a **function pointer**. Where closures get the traits Fn, FnMut, and FnOnce, a plain function pointer has the type fn(i32) -> i32 and importantly **implements all three** closure traits, so any API that accepts a closure also accepts a function name directly. This lets you write map(string_from) instead of map(|x| x.to_string()), which is sometimes clearer. Because fn is a concrete type rather than a trait, it works naturally across the FFI boundary, where C callbacks must be plain function pointers (C has no notion of Rust closures that capture an environment).

A neat idiom: each **tuple-struct constructor** and each **enum-variant constructor** is actually a function, so you can pass Status::Value as the mapper to an iterator and have it build the variants for you.

### Returning closures
Closures are represented by traits, not concrete types, so you cannot write a return type of Fn(...) directly: the compiler does not know the closure's size. There are two solutions:

1. **impl Trait** (return position): write -> impl Fn(i32) -> i32 when a single function returns exactly **one** concrete closure type. This is the lightweight, zero-cost choice and is preferred when it works.
2. **Boxed trait object**: write -> Box<dyn Fn(i32) -> i32> and return Box::new(closure). This is needed when you might return **different** closures from different branches (their concrete types differ, so impl Trait, which requires a single type, will not compile), at the cost of a heap allocation and dynamic dispatch.

The choice mirrors the static-versus-dynamic-dispatch tradeoff: impl Trait for a single known type, Box<dyn Fn> when the type must vary at runtime.`,
      code: [
        {
          lang: 'rust',
          src: `// Function pointer parameter (fn), which also accepts closures.
fn do_twice(f: fn(i32) -> i32, arg: i32) -> i32 {
    f(arg) + f(arg)
}
fn add_one(x: i32) -> i32 { x + 1 }

// Return a single concrete closure with impl Trait (no allocation).
fn make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n
}

// Return possibly-different closures: needs a boxed trait object.
fn make_op(add: bool) -> Box<dyn Fn(i32) -> i32> {
    if add { Box::new(|x| x + 1) } else { Box::new(|x| x - 1) }
}

fn main() {
    println!("{}", do_twice(add_one, 5)); // passes a function by name
    println!("{}", make_adder(10)(1));    // -> 11
    println!("{}", make_op(true)(41));    // -> 42

    // Enum-variant constructor used as a function in map.
    let list: Vec<String> = vec![1, 2, 3].iter().map(ToString::to_string).collect();
    println!("{list:?}");
}`
        }
      ]
    },
    {
      heading: 'Macros: declarative and procedural',
      body: `**Macros** are a form of **metaprogramming**: code that writes other code, expanded **before** the compiler analyzes the types and meaning of the program. Their superpower over functions is that a macro can take a **variable number of arguments** (println! takes any number) and can **generate code** such as new trait implementations, which a function can never do because functions run at runtime and must have a fixed signature. The cost is that macro definitions are more complex to write and read than function definitions, and macros must be **in scope (defined or imported) before** they are called in a file, unlike functions, which can be defined anywhere.

### Declarative macros (macro_rules!)
The most common kind, defined with **macro_rules!**, work like a match expression over Rust **syntax**. You write patterns that match the shape of the code passed in, and each pattern has a template of replacement code to emit. The simplified definition of vec! is the canonical example: a pattern captures a comma-separated list of expressions, and the template expands into code that creates a Vec and pushes each one. Special metavariables like $x:expr capture pieces of syntax, and the $(...),* repetition operator handles the variable-length part.

### Procedural macros
**Procedural macros** are more like functions: each takes a TokenStream of input, operates on it as code, and produces a TokenStream of output. They must live in their **own crate** with a special crate type, for technical reasons in the compiler. There are three kinds:

1. **Custom derive**: powers #[derive(MyTrait)], generating an impl for an annotated struct or enum. This is how Serde's Serialize and Deserialize work, and is the most common reason you will reach for procedural macros.
2. **Attribute-like macros**: define brand-new attributes such as #[route(GET, "/")], usable on more than just derives (functions, for instance). Web frameworks use these for routing.
3. **Function-like macros**: invoked like my_macro!(...) but, unlike macro_rules!, run arbitrary Rust over the tokens, so they can do far richer parsing (for example, validating an embedded SQL string at compile time).

Most procedural macros are built with the **proc-macro2**, **syn** (parses tokens into a syntax tree), and **quote** (turns a syntax tree back into tokens) crates. The big payoff is eliminating boilerplate at compile time with no runtime cost.`,
      code: [
        {
          lang: 'rust',
          src: `// Declarative macro: a simplified version of the standard vec! macro.
#[macro_export]
macro_rules! my_vec {
    // Match zero or more comma-separated expressions; $x:expr captures each.
    ( $( $x:expr ),* ) => {
        {
            let mut temp = Vec::new();
            $(
                temp.push($x); // repeated once per matched expression
            )*
            temp
        }
    };
}

fn main() {
    let v = my_vec![1, 2, 3];
    println!("{v:?}"); // [1, 2, 3]
}

// Sketch of a custom-derive procedural macro (lives in its own proc-macro crate):
//
// use proc_macro::TokenStream;
// use quote::quote;
// use syn;
//
// #[proc_macro_derive(HelloMacro)]
// pub fn hello_macro_derive(input: TokenStream) -> TokenStream {
//     let ast = syn::parse(input).unwrap();          // parse tokens into a tree
//     let name = &ast.ident;
//     let gen = quote! {                              // build the output code
//         impl HelloMacro for #name {
//             fn hello() { println!("Hello from {}!", stringify!(#name)); }
//         }
//     };
//     gen.into()                                      // emit as a TokenStream
// }`
        }
      ]
    }
  ],
  takeaways: [
    'Unsafe Rust does not disable the borrow checker; it unlocks exactly five powers: deref raw pointers, call unsafe functions, access mutable statics, implement unsafe traits, and read union fields.',
    'Keep unsafe blocks tiny and isolated, wrap them in safe abstractions (like split_at_mut), and add a SAFETY comment explaining why each one is sound.',
    'Raw pointers (*const T, *mut T) can alias, be null, and point anywhere; creating them is safe but dereferencing them is unsafe.',
    'FFI uses extern "C" to call foreign code (always unsafe) and #[unsafe(no_mangle)] plus extern "C" to expose Rust; cross-boundary data must use repr(C), and the kernel work is largely FFI plus safe wrappers.',
    'Avoid static mut (data races are UB); prefer atomics or Mutex. Unsafe traits like Send and Sync are promises you make with unsafe impl. Unions exist mainly for C interop.',
    'Associated types let a trait be implemented once per type and keep signatures clean; default generic params (Rhs = Self) enable operator overloading via std::ops; fully qualified syntax <Type as Trait>::f() disambiguates same-named items.',
    'The newtype pattern wraps a type to bypass the orphan rule and to add compile-time type safety at zero cost; supertraits let one trait require and reuse another.',
    'The never type ! coerces to any type (so panic!/continue arms type-check); unsized types (str, dyn Trait) must live behind a fat pointer, and ?Sized relaxes the implicit Sized bound.',
    'Use the fn type and function pointers for callbacks (and FFI); return a single closure with impl Fn, or differing closures with Box<dyn Fn>.',
    'Macros generate code before compilation: declarative macro_rules! match on syntax, while procedural macros (derive, attribute, function-like) transform TokenStreams, usually via syn and quote.'
  ],
  cheatsheet: [
    { label: 'unsafe { ... }', value: 'Unlock the five unsafe powers; checks still apply' },
    { label: '*const T / *mut T', value: 'Raw pointers; safe to make, unsafe to dereference' },
    { label: 'unsafe fn', value: 'Function with a caller-upheld contract; call in unsafe' },
    { label: 'extern "C" { ... }', value: 'Declare foreign (C-ABI) functions to call via FFI' },
    { label: '#[unsafe(no_mangle)] extern "C"', value: 'Expose a Rust fn with a stable C-callable symbol' },
    { label: '#[repr(C)]', value: 'C-compatible layout for FFI structs and unions' },
    { label: 'static mut X', value: 'Mutable global; unsafe to access, prefer atomics/Mutex' },
    { label: 'unsafe trait / unsafe impl', value: 'Trait with an unchecked invariant (e.g. Send, Sync)' },
    { label: 'type Item;', value: 'Associated type: trait implemented once, clean signatures' },
    { label: 'impl Add for T', value: 'Operator overloading via std::ops (Rhs defaults to Self)' },
    { label: '<T as Trait>::f()', value: 'Fully qualified syntax to disambiguate methods/fns' },
    { label: 'struct Wrapper(T);', value: 'Newtype: bypass orphan rule, add zero-cost type safety' },
    { label: '! (never type)', value: 'Empty type that coerces to any type (panic!, loop, break)' },
    { label: 'T: ?Sized', value: 'Allow unsized T (str, dyn Trait); use behind a pointer' },
    { label: 'fn(i32) -> i32', value: 'Function pointer; implements Fn/FnMut/FnOnce, FFI-friendly' },
    { label: 'impl Fn vs Box<dyn Fn>', value: 'Return one closure type vs differing closures (boxed)' },
    { label: 'macro_rules!', value: 'Declarative macro: match on syntax, expand a template' },
    { label: '#[proc_macro_derive]', value: 'Procedural derive macro built with syn + quote' }
  ]
}

export default note
