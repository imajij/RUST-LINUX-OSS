import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-rs-17',
  track: 'rust',
  chapter: 17,
  title: 'Object-Oriented Programming Features of Rust',
  summary: `Rust is not a class-based object-oriented language, yet it can express the ideas people actually want from OOP: bundling data with behavior, hiding implementation details, and programming against an interface rather than a concrete type. This chapter pins down what OOP means, shows how Rust achieves encapsulation with structs plus the pub keyword, and introduces trait objects for runtime polymorphism. It then contrasts dynamic dispatch with static dispatch, explains the object-safety rules that decide which traits can become trait objects, and works a full example of the classic state pattern, finishing with a more Rust-idiomatic typestate design that moves the state machine into the type system. Understanding these tools is essential for reading real-world Rust, including the standard library and the Rust-for-Linux codebase.`,
  sections: [
    {
      heading: 'What "object-oriented" means, and whether Rust qualifies',
      body: `There is no single agreed definition of object-oriented programming, so the book leans on the influential *Design Patterns* book (the "Gang of Four"), which says an object packages both **data** and the **procedures that operate on that data**, and those procedures are usually called **methods**. By that yardstick Rust clearly has objects: a struct or enum holds the data, and an impl block attaches methods to it. The data and the behavior live together, even though Rust never uses the word "class."

The harder questions are about the other features people associate with OOP: encapsulation and inheritance. Rust offers strong encapsulation (covered next) but deliberately omits **inheritance**, the mechanism where one type automatically reuses another type's fields and methods. Rust has no way to say "struct Dog inherits from struct Animal." This is a design choice, not an oversight.

### Why Rust drops inheritance
Inheritance is used in mainstream OOP for two distinct reasons, and Rust addresses each with a different, more targeted tool:

1. **Code reuse.** In class-based languages you inherit to avoid rewriting shared behavior. Rust reuses code through **default trait method implementations** and through composition (holding another type as a field), without the tight coupling that inheritance creates.
2. **Polymorphism**, meaning code that works with values of multiple types. Many people conflate polymorphism with inheritance, but they are separable. Rust provides polymorphism through **generics** with trait bounds (bounded parametric polymorphism) and through **trait objects** (covered later in this chapter).

Inheritance has fallen out of favor partly because it risks sharing more than necessary: a subclass can inherit methods that do not apply to it, and deep hierarchies become brittle. Rust's traits-plus-composition approach gives you the reuse and the polymorphism while keeping types loosely coupled. The practical takeaway for contributors: when you feel the urge to "subclass," in Rust you almost always reach for a trait, a default method, or a wrapped field instead.`,
      code: [
        {
          lang: 'rust',
          src: `// An "object" in Rust: data plus the methods that operate on it.
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn new(width: u32, height: u32) -> Rectangle {
        Rectangle { width, height }
    }
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let r = Rectangle::new(3, 4);
    println!("area = {}", r.area()); // 12
}`
        }
      ]
    },
    {
      heading: 'Encapsulation: hiding implementation behind a public API',
      body: `Encapsulation means the internal details of an object are hidden from the code that uses it, and the only way to interact with the object is through a deliberately exposed **public interface**. The benefit is that you can change the internals later without breaking callers, as long as the public interface stays the same. This is one of the most valuable properties for maintainable, evolvable code, and it matters enormously in large open-source projects where many people depend on your modules.

Rust controls encapsulation with the **pub** keyword. By default everything in Rust is **private**: a struct, its fields, its methods, and its associated functions are all invisible outside the module unless you mark them pub. This default-private stance is the opposite of many languages and is exactly what you want for encapsulation, because you have to make a conscious choice to expose each piece.

### A crucial subtlety: pub on a struct does not make its fields public
Marking a struct pub makes the struct **name** usable from outside, but each field stays private unless individually marked pub. This lets you publish a type while keeping its representation hidden. Callers construct and inspect it only through the methods you expose. That is real encapsulation: you can swap the internal data structure for a faster one, and as long as the public methods behave the same, no downstream code changes.

### A worked example
Consider an averaged collection that always knows its average in O(1) time. It keeps a list of values and a cached average. If both fields were public, a caller could push directly into the list and silently corrupt the cached average. By keeping the fields private and forcing all mutation through add and remove methods, the type guarantees the cache stays correct. This invariant is enforced by the encapsulation boundary, not by hope.

### Pitfalls and idioms
- Forgetting that pub struct still has private fields is a frequent surprise: outside code cannot use struct literal syntax to build it and cannot read its fields. You typically provide a constructor (often new) and getters.
- Encapsulation is also about **invariants**. Any rule that must always hold (a sorted vector, a non-empty buffer, a cached value that matches the data) should be protected by making the fields private and validating in the methods.
- Visibility can be widened gradually with pub(crate) and pub(super) when something should be visible inside your crate or parent module but not to the outside world.`,
      code: [
        {
          lang: 'rust',
          src: `pub struct AveragedCollection {
    list: Vec<i32>, // private: outside code cannot touch it
    average: f64,   // private: kept consistent with list internally
}

impl AveragedCollection {
    pub fn new() -> AveragedCollection {
        AveragedCollection { list: Vec::new(), average: 0.0 }
    }
    pub fn add(&mut self, value: i32) {
        self.list.push(value);
        self.update_average();
    }
    pub fn remove(&mut self) -> Option<i32> {
        let result = self.list.pop();
        if result.is_some() {
            self.update_average();
        }
        result
    }
    pub fn average(&self) -> f64 {
        self.average // read-only access to the cached value
    }
    fn update_average(&mut self) {
        let total: i32 = self.list.iter().sum();
        self.average = total as f64 / self.list.len() as f64;
    }
}`
        }
      ]
    },
    {
      heading: 'Trait objects: one collection, many concrete types',
      body: `Generics with trait bounds let one function work over many types, but a generic parameter is monomorphized to **one** concrete type per use. That is perfect when a slot holds a single type, but it cannot help when you need a collection holding a **mixture** of different types that share a behavior. The classic example is a GUI library: it wants a list of drawable components (buttons, checkboxes, text fields) and a draw loop that calls draw on each, without knowing in advance which concrete types users will plug in. A generic Vec of T cannot hold a button and a checkbox at the same time because that is two different types.

The tool for this is a **trait object**. A trait object points to both an instance of a type implementing a given trait and a table used to look up that trait's methods on the value at runtime. You write a trait object with the dyn keyword: dyn Draw means "some value whose concrete type is hidden, but which is known to implement Draw." Because the size of the underlying value is not known at compile time, a trait object must sit behind a pointer, most commonly Box (as in Box<dyn Draw>) or a reference (&dyn Draw).

### How it differs from a generic
- A generic parameter with a trait bound produces homogeneous, statically known types. A Vec<T> where T: Draw still holds only one concrete type at a time.
- A Vec<Box<dyn Draw>> is heterogeneous: each element can be a different concrete type, as long as all of them implement Draw. This is exactly the runtime polymorphism that inheritance-plus-virtual-methods provides in other languages.

### How a trait object is represented
A dyn Draw pointer is a **fat pointer**: two machine words. One word points to the data (the actual button or checkbox), the other points to a **vtable**, a table of function pointers for that type's implementation of the trait's methods. When you call draw on a trait object, the program reads the function pointer out of the vtable and jumps to it. This indirection is what makes a heterogeneous collection possible, and it is the source of the runtime cost discussed in the dispatch section.

### Pitfalls
- You cannot write Vec<dyn Draw> directly because dyn Draw is unsized; you need Vec<Box<dyn Draw>> or a slice of references.
- A trait object exposes only the methods declared in that one trait. You cannot, through a dyn Draw, call methods that belong to the concrete type but are not part of Draw. The concrete type has been **erased**.`,
      code: [
        {
          lang: 'rust',
          src: `pub trait Draw {
    fn draw(&self);
}

pub struct Screen {
    // A heterogeneous list: each element is a different concrete type
    // hidden behind a trait object, unified by the Draw trait.
    pub components: Vec<Box<dyn Draw>>,
}

impl Screen {
    pub fn run(&self) {
        for component in self.components.iter() {
            component.draw(); // dynamic dispatch through the vtable
        }
    }
}

pub struct Button { pub label: String }
impl Draw for Button {
    fn draw(&self) { println!("draw button: {}", self.label); }
}

pub struct SelectBox { pub options: Vec<String> }
impl Draw for SelectBox {
    fn draw(&self) { println!("draw select with {} options", self.options.len()); }
}

fn main() {
    let screen = Screen {
        components: vec![
            Box::new(Button { label: String::from("OK") }),
            Box::new(SelectBox { options: vec![String::from("Yes"), String::from("No")] }),
        ],
    };
    screen.run();
}`
        }
      ]
    },
    {
      heading: 'Dynamic dispatch vs static dispatch',
      body: `Whenever you call a method through an abstraction, the compiler must decide **which** concrete implementation to invoke. There are two strategies, and the choice between them is one of the most important performance-and-flexibility tradeoffs in Rust.

### Static dispatch (generics, monomorphization)
With generics, the compiler performs **monomorphization**: for each concrete type you actually use, it generates a specialized copy of the function with that type filled in. By the time the program runs, every call site knows exactly which function to call. The call is a direct jump, identical to hand-written non-generic code, and it can be **inlined** and optimized aggressively. This is static dispatch: the target is resolved at compile time. It is what makes Rust generics a zero-cost abstraction.

The costs of static dispatch are at compile time, not runtime: more generated code (potential binary bloat) and longer compile times, because each type combination is a fresh copy.

### Dynamic dispatch (trait objects, vtables)
With a trait object, the compiler cannot know the concrete type at compile time, so it cannot pick the function in advance. Instead it emits code that, at **runtime**, reads the method's address out of the vtable and calls through that pointer. This is dynamic dispatch. The cost is an extra pointer indirection per call and, more importantly, a lost opportunity: the compiler generally **cannot inline** a dynamically dispatched call, which also blocks the cascade of optimizations that inlining enables.

### How to choose
- Reach for **generics / static dispatch** by default. It is faster and the type information is preserved end to end. Use it when the set of types is known where the code is written, or when each slot holds a single type.
- Reach for **trait objects / dynamic dispatch** when you genuinely need a heterogeneous collection, when the concrete types are not known until runtime (for example, plugin systems or user-supplied widgets), or when monomorphization would bloat the binary so much that the indirection is worth it.

### Honest caveats
- The per-call overhead of dynamic dispatch is usually small; do not contort your design to avoid it without measuring. Readability and the ability to express a heterogeneous list often matter more than a predictable-branch indirect call.
- impl Trait in argument and return position is sugar for static dispatch (it is a hidden generic / a single concrete type), whereas dyn Trait is always dynamic dispatch. Knowing which one you wrote tells you which dispatch you are paying for.`,
      code: [
        {
          lang: 'rust',
          src: `trait Greet {
    fn hello(&self) -> String;
}

struct En;
struct Fr;
impl Greet for En { fn hello(&self) -> String { String::from("hello") } }
impl Greet for Fr { fn hello(&self) -> String { String::from("bonjour") } }

// STATIC dispatch: monomorphized, one specialized copy per concrete T.
fn shout_static<T: Greet>(g: &T) {
    println!("{}!", g.hello());
}

// DYNAMIC dispatch: one copy, method resolved at runtime via the vtable.
fn shout_dynamic(g: &dyn Greet) {
    println!("{}!", g.hello());
}

fn main() {
    shout_static(&En);          // compiles a shout_static specialized to En
    shout_static(&Fr);          // and another specialized to Fr
    shout_dynamic(&En);         // same machine code path for both calls
    shout_dynamic(&Fr);

    // Only dyn lets you build a heterogeneous list:
    let crowd: Vec<Box<dyn Greet>> = vec![Box::new(En), Box::new(Fr)];
    for member in &crowd {
        shout_dynamic(member.as_ref());
    }
}`
        }
      ]
    },
    {
      heading: 'Object safety: which traits can become trait objects',
      body: `Not every trait can be turned into a trait object. A trait must be **object safe** (the reference calls this "dyn compatible") for dyn Trait to be legal. If you try to make a trait object from a non-object-safe trait, the compiler rejects it with a clear error. Understanding the rules prevents a category of confusing failures and explains some library design decisions.

The intuition: a trait object has erased its concrete type, so a method is only callable through the object if it does not need to know that concrete type. There are two main rules.

### Rule 1: methods must not return Self
If a method returns Self, the caller would need to know the concrete type to know the size and identity of the returned value, but that type has been erased. Such a method cannot be dispatched through a vtable. The Clone trait is the textbook example: its method signature is fn clone(&self) -> Self, so Clone is not object safe, and you cannot write Box<dyn Clone>.

### Rule 2: methods must not have generic type parameters
A generic method would need a separate monomorphized version for each type argument, but a vtable has a fixed set of entries chosen at compile time; it cannot hold an unbounded family of specialized functions. So a trait with a generic method is not object safe with respect to that method.

### Important refinements that save you in practice
- A method that violates these rules can be **excluded** from the trait object by adding a where Self: Sized bound to that one method. The method then simply is not callable on the trait object, but the rest of the trait remains usable as dyn. The standard library does exactly this so that traits like Iterator stay object safe while still offering generic helper methods.
- Associated functions without a self receiver (like a constructor) are not callable on a trait object, which also makes them candidates for the same where Self: Sized treatment.
- Object safety is a property of the trait, evaluated method by method; one offending method can be opted out instead of poisoning the whole trait.

### Why this matters for contributors
When you design a trait that you want usable both as a generic bound and as a dyn trait object, you must keep its core methods object safe and gate any Self-returning or generic methods behind where Self: Sized. This is a recurring pattern in real Rust libraries, and recognizing it explains why so many standard-library traits are shaped the way they are.`,
      code: [
        {
          lang: 'rust',
          src: `// NOT object safe: returns Self, so it cannot be dispatched dynamically.
trait Cloneable {
    fn duplicate(&self) -> Self;
}
// let x: Box<dyn Cloneable> = ...; // ERROR: not dyn compatible

// Object safe: every dyn-callable method takes &self and returns no Self.
trait Animal {
    fn name(&self) -> String;
    // This method would break object safety, so we opt it out of the
    // trait object with a Self: Sized bound. It stays callable on
    // concrete types but is simply absent from the vtable.
    fn make() -> Self where Self: Sized;
}

struct Dog;
impl Animal for Dog {
    fn name(&self) -> String { String::from("dog") }
    fn make() -> Self { Dog }
}

fn describe(a: &dyn Animal) {
    // name() is in the vtable, so this is fine.
    println!("a {}", a.name());
}

fn main() {
    let d = Dog::make();      // associated fn called on the concrete type
    describe(&d);             // used as a trait object via &dyn Animal
}`
        }
      ]
    },
    {
      heading: 'The state pattern implemented with trait objects',
      body: `The **state pattern** is a classic object-oriented design pattern. You model a value that can be in one of several states, and each state is represented by its own object that owns the behavior for that state. The value holds a current-state object and delegates work to it. Crucially, **state transitions** are decided inside the state objects: each state knows which state should come next. The value itself does not contain a big match on the current state; it just forwards calls. Adding a new state therefore touches mostly one new struct, not scattered conditionals.

The book's running example is a blog post that moves through Draft, then PendingReview, then Published. Only a published post returns its content; a draft or pending post returns an empty string. The Post struct holds the text plus a state object behind a trait object (Option<Box<dyn State>>). Each operation (request_review, approve) asks the current state object what the next state should be.

### How the transitions work in Rust
The trick is that the transition methods take **self: Box<Self>**, meaning they consume the old state box and return the new one. Taking ownership of the box invalidates the old state so it cannot be used after the transition. Inside Post, the methods take the state out of the Option (using take to leave a temporary None), call the transition to get the new boxed state, and store it back. This dance is needed because Rust will not let you move a value out of a borrowed field directly; take swaps in None so ownership can move out safely.

### Strengths of this encoding
- Behavior for each state is **localized** in that state's struct. To change what a Published post does, you edit one impl block.
- Post's methods stay trivial: they delegate, with no knowledge of the rules. The logic does not duplicate across every method.

### The downsides the book is candid about
- Some logic is **coupled between states**: each state must know its successor, so adding a state can force edits to neighboring states. If you want a totally different transition graph, several states change.
- There is **duplication**: each transition method has a similar shape, and default trait methods that return self do not quite eliminate it cleanly.
- Most tellingly, this design **does not use Rust's type system to prevent misuse**. Calling content on a draft compiles fine and silently returns an empty string. The compiler cannot catch a logic error because every state is the same static type, Box<dyn State>. The next section shows the more Rust-idiomatic alternative that fixes exactly this.`,
      code: [
        {
          lang: 'rust',
          src: `pub struct Post {
    state: Option<Box<dyn State>>,
    content: String,
}

impl Post {
    pub fn new() -> Post {
        Post { state: Some(Box::new(Draft {})), content: String::new() }
    }
    pub fn add_text(&mut self, text: &str) {
        self.content.push_str(text);
    }
    pub fn content(&self) -> &str {
        // Delegate to the state; the default returns empty.
        self.state.as_ref().unwrap().content(self)
    }
    pub fn request_review(&mut self) {
        if let Some(s) = self.state.take() {
            self.state = Some(s.request_review());
        }
    }
    pub fn approve(&mut self) {
        if let Some(s) = self.state.take() {
            self.state = Some(s.approve());
        }
    }
}

trait State {
    // self: Box<Self> consumes the old state and yields the next one.
    fn request_review(self: Box<Self>) -> Box<dyn State>;
    fn approve(self: Box<Self>) -> Box<dyn State>;
    fn content<'a>(&self, _post: &'a Post) -> &'a str { "" }
}

struct Draft {}
impl State for Draft {
    fn request_review(self: Box<Self>) -> Box<dyn State> { Box::new(PendingReview {}) }
    fn approve(self: Box<Self>) -> Box<dyn State> { self } // no-op
}

struct PendingReview {}
impl State for PendingReview {
    fn request_review(self: Box<Self>) -> Box<dyn State> { self }
    fn approve(self: Box<Self>) -> Box<dyn State> { Box::new(Published {}) }
}

struct Published {}
impl State for Published {
    fn request_review(self: Box<Self>) -> Box<dyn State> { self }
    fn approve(self: Box<Self>) -> Box<dyn State> { self }
    fn content<'a>(&self, post: &'a Post) -> &'a str { &post.content }
}

fn main() {
    let mut post = Post::new();
    post.add_text("hello");
    assert_eq!("", post.content());   // Draft: empty
    post.request_review();
    assert_eq!("", post.content());   // PendingReview: still empty
    post.approve();
    assert_eq!("hello", post.content()); // Published
}`
        }
      ]
    },
    {
      heading: 'The typestate alternative: encoding states as types',
      body: `Rust gives you a more powerful option than the trait-object state pattern: encode each state as its own **type**, and make invalid operations fail to **compile** rather than fail silently at runtime. This is often called the **typestate pattern**. Instead of one Post type carrying a runtime state object, you have several types (DraftPost, PendingReviewPost, Post) and the transition methods **consume** one type and **return** the next. Because the operations only exist on the appropriate type, you simply cannot call content on a draft: a DraftPost has no content method at all, so the mistake is a compile error.

### How it works
- DraftPost has add_text and request_review. It has no content method, so reading a draft's content is unrepresentable.
- request_review consumes the DraftPost by value (self, not &self) and returns a PendingReviewPost. The old value is moved out and gone, so you cannot accidentally keep using a stale state.
- PendingReviewPost has only approve, which consumes it and returns a published Post that finally exposes content.

Because each transition takes ownership of the previous state and yields a new type, the old state is invalidated by the **move**, and the type of the result encodes the new state. The compiler tracks the state machine for you. This is the same spirit as the Rust standard library and embedded ecosystems, where typestate ensures, for example, that a GPIO pin configured as input has no write method.

### Tradeoffs versus the trait-object state pattern
- **Safety:** typestate turns whole classes of runtime bugs into compile errors. Invalid transitions and invalid operations literally do not type-check. This is the big win and the most Rust-idiomatic outcome.
- **Heterogeneity:** the trait-object pattern lets you store a collection of values that are "in some state" uniformly, because they share one type. With typestate, the states are different types, so you cannot put them in one Vec without erasing back to a trait object. Choose typestate when a single value flows through states; choose the trait-object pattern when you need a uniform collection or runtime-chosen behavior.
- **Ergonomics:** typestate requires consuming self and reassigning (let post = post.request_review()), which can be slightly more verbose and forces ownership transfers. In exchange, you get guarantees no amount of testing can match.

### Guidance for contributors
The lesson the book emphasizes is to not blindly translate object-oriented patterns into Rust. Patterns that lean on inheritance and mutable shared state often have a cleaner Rust expression that leverages ownership and the type system. When you find yourself simulating a state machine with runtime checks, ask whether typestate can make the illegal states unrepresentable. That mindset is exactly what reviewers in projects like Rust-for-Linux look for.`,
      code: [
        {
          lang: 'rust',
          src: `// Each state is its own type. Operations exist only where they are valid.
pub struct DraftPost { content: String }

pub struct PendingReviewPost { content: String }

pub struct Post { content: String }

impl DraftPost {
    pub fn new() -> DraftPost {
        DraftPost { content: String::new() }
    }
    pub fn add_text(&mut self, text: &str) {
        self.content.push_str(text);
    }
    // Consumes the draft (self by value) and returns the next state's type.
    pub fn request_review(self) -> PendingReviewPost {
        PendingReviewPost { content: self.content }
    }
    // Note: no content() here, so reading a draft cannot compile.
}

impl PendingReviewPost {
    pub fn approve(self) -> Post {
        Post { content: self.content }
    }
}

impl Post {
    pub fn content(&self) -> &str {
        &self.content // only a published Post exposes content
    }
}

fn main() {
    let mut post = DraftPost::new();
    post.add_text("hello");

    // post.content();  // would not compile: DraftPost has no content method

    let post = post.request_review(); // post is now PendingReviewPost
    let post = post.approve();         // post is now Post
    assert_eq!("hello", post.content());
}`
        }
      ]
    }
  ],
  takeaways: [
    'By the data-plus-methods definition, Rust has objects (structs/enums with impl blocks), but it deliberately has no inheritance.',
    'Rust replaces inheritance with default trait methods and composition for reuse, and with generics and trait objects for polymorphism.',
    'Encapsulation comes from default-private visibility plus pub; marking a struct pub does NOT make its fields public, which lets you hide and protect invariants.',
    'A trait object (dyn Trait, usually behind Box or a reference) erases the concrete type and lets a single collection hold many different types that share a trait.',
    'A dyn pointer is a fat pointer: data pointer plus a vtable pointer used to look up methods at runtime.',
    'Static dispatch (generics, monomorphized) is resolved at compile time, inlineable, and zero-cost; dynamic dispatch (trait objects) is resolved at runtime via the vtable and usually cannot be inlined.',
    'A trait is object safe only if its dyn-callable methods do not return Self and have no generic parameters; offending methods can be opted out with where Self: Sized.',
    'The state pattern with trait objects localizes per-state behavior but does not use the type system to prevent invalid operations, so mistakes fail silently at runtime.',
    'The typestate pattern encodes each state as its own type so invalid operations and transitions become compile errors, the more idiomatic Rust solution when a single value flows through states.'
  ],
  cheatsheet: [
    { label: 'dyn Trait', value: 'A trait object: concrete type erased, methods via vtable' },
    { label: 'Box<dyn Trait>', value: 'Owned, heap-allocated trait object (common in collections)' },
    { label: '&dyn Trait', value: 'Borrowed trait object; a fat pointer (data + vtable)' },
    { label: 'Vec<Box<dyn Trait>>', value: 'Heterogeneous list of types sharing one trait' },
    { label: 'impl Trait', value: 'Static dispatch: one hidden concrete type, inlineable' },
    { label: 'fn f<T: Trait>(x: T)', value: 'Generic bound: monomorphized, static dispatch' },
    { label: 'fn f(x: &dyn Trait)', value: 'Trait object param: dynamic dispatch at runtime' },
    { label: 'vtable', value: 'Per-type table of method pointers for a trait object' },
    { label: 'monomorphization', value: 'Compiler clones generic code per concrete type' },
    { label: 'object safety', value: 'No Self return, no generic methods on dyn-callable methods' },
    { label: 'where Self: Sized', value: 'Opt a method out of the trait object (keep trait dyn-usable)' },
    { label: 'self: Box<Self>', value: 'Consume a boxed state to return the next state' },
    { label: 'pub struct', value: 'Public name, fields still private by default' },
    { label: 'typestate', value: 'Each state is a type; invalid ops fail to compile' }
  ]
}

export default note
