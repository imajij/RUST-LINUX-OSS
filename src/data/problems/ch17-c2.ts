import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch17-c-036',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Encapsulated Counter With a Public API',
    prompt: `Define a struct \`Counter\` with a PRIVATE field \`value: u32\`. Provide a public API only:
- \`Counter::new()\` returns a counter starting at 0.
- \`increment(&mut self)\` adds 1.
- \`get(&self) -> u32\` returns the current value.

The field itself must stay private so callers cannot set it directly. In \`main\`, create a counter, increment it twice, and print \`get()\`. Output: \`2\`.`,
    hints: [
      'Leave the field without \`pub\` so only the impl block can touch it.',
      'Mutating methods take \`&mut self\`; reading methods take \`&self\`.',
    ],
    solution: `struct Counter {
    value: u32,
}

impl Counter {
    fn new() -> Counter {
        Counter { value: 0 }
    }

    fn increment(&mut self) {
        self.value += 1;
    }

    fn get(&self) -> u32 {
        self.value
    }
}

fn main() {
    let mut c = Counter::new();
    c.increment();
    c.increment();
    println!("{}", c.get());
}`,
    starter: `struct Counter {
    // TODO: private field
}

impl Counter {
    // TODO: new, increment, get
}

fn main() {
    // TODO: build, increment twice, print get()
}`,
    tags: ['encapsulation', 'methods'],
  },
  {
    id: 'rs-ch17-c-037',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'AveragedCollection Keeps a Cached Average',
    prompt: `Implement the book's \`AveragedCollection\` idea. Define a struct with PRIVATE fields \`list: Vec<i32>\` and \`average: f64\`. Provide:
- \`new()\` returning an empty collection with average 0.0.
- \`add(&mut self, value: i32)\` which pushes the value and recomputes the average.
- \`average(&self) -> f64\` which returns the cached average.

Because the fields are private, callers must go through \`add\`, so the average can never drift out of sync. In \`main\`, add 2 and 4, then print \`average()\`. Output: \`3\`.`,
    hints: [
      'Recompute the average inside \`add\` after pushing.',
      'Average is \`sum as f64 / len as f64\`; guard against an empty list.',
    ],
    solution: `struct AveragedCollection {
    list: Vec<i32>,
    average: f64,
}

impl AveragedCollection {
    fn new() -> AveragedCollection {
        AveragedCollection { list: Vec::new(), average: 0.0 }
    }

    fn add(&mut self, value: i32) {
        self.list.push(value);
        self.update_average();
    }

    fn update_average(&mut self) {
        let total: i32 = self.list.iter().sum();
        self.average = if self.list.is_empty() {
            0.0
        } else {
            total as f64 / self.list.len() as f64
        };
    }

    fn average(&self) -> f64 {
        self.average
    }
}

fn main() {
    let mut c = AveragedCollection::new();
    c.add(2);
    c.add(4);
    println!("{}", c.average());
}`,
    starter: `struct AveragedCollection {
    list: Vec<i32>,
    average: f64,
}

impl AveragedCollection {
    // TODO: new, add, average (and a private helper)
}

fn main() {
    // TODO
}`,
    tags: ['encapsulation', 'invariants'],
  },
  {
    id: 'rs-ch17-c-038',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Trait With Two Implementors',
    prompt: `Define a trait \`Shape\` with one method \`area(&self) -> f64\`. Implement it for two structs:
- \`Circle { radius: f64 }\` where area is \`3.14 * radius * radius\`.
- \`Square { side: f64 }\` where area is \`side * side\`.

In \`main\`, create one of each and print each area on its own line. For \`Circle { radius: 2.0 }\` and \`Square { side: 3.0 }\` the output should be:
12.56
9`,
    hints: [
      'Each type gets its own \`impl Shape for ...\` block.',
      'You can call \`circle.area()\` directly through the trait method.',
    ],
    solution: `trait Shape {
    fn area(&self) -> f64;
}

struct Circle {
    radius: f64,
}

struct Square {
    side: f64,
}

impl Shape for Circle {
    fn area(&self) -> f64 {
        3.14 * self.radius * self.radius
    }
}

impl Shape for Square {
    fn area(&self) -> f64 {
        self.side * self.side
    }
}

fn main() {
    let c = Circle { radius: 2.0 };
    let s = Square { side: 3.0 };
    println!("{}", c.area());
    println!("{}", s.area());
}`,
    starter: `trait Shape {
    fn area(&self) -> f64;
}

struct Circle { radius: f64 }
struct Square { side: f64 }

// TODO: impl Shape for each

fn main() {
    // TODO
}`,
    tags: ['traits', 'polymorphism'],
  },
  {
    id: 'rs-ch17-c-039',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Vec of Boxed Trait Objects',
    prompt: `Reuse a \`Shape\` trait with \`area(&self) -> f64\`, implemented for \`Circle\` and \`Square\`. Build a \`Vec<Box<dyn Shape>>\` containing a \`Circle { radius: 1.0 }\` and a \`Square { side: 2.0 }\`. Loop over the vector and print each \`area()\`.

Use \`3.14\` for pi. Output:
3.14
4`,
    hints: [
      'Box each value: \`Box::new(Circle { .. })\`.',
      'The element type is \`Box<dyn Shape>\`; iterate with \`for s in &shapes\`.',
    ],
    solution: `trait Shape {
    fn area(&self) -> f64;
}

struct Circle { radius: f64 }
struct Square { side: f64 }

impl Shape for Circle {
    fn area(&self) -> f64 { 3.14 * self.radius * self.radius }
}
impl Shape for Square {
    fn area(&self) -> f64 { self.side * self.side }
}

fn main() {
    let shapes: Vec<Box<dyn Shape>> = vec![
        Box::new(Circle { radius: 1.0 }),
        Box::new(Square { side: 2.0 }),
    ];
    for s in &shapes {
        println!("{}", s.area());
    }
}`,
    starter: `trait Shape {
    fn area(&self) -> f64;
}

struct Circle { radius: f64 }
struct Square { side: f64 }

// TODO: impls

fn main() {
    let shapes: Vec<Box<dyn Shape>> = vec![
        // TODO
    ];
    // TODO: loop and print areas
}`,
    tags: ['trait-objects', 'dynamic-dispatch'],
  },
  {
    id: 'rs-ch17-c-040',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'The GUI Draw Example',
    prompt: `Recreate the book's GUI sketch. Define a trait \`Draw\` with \`draw(&self)\`. Define a struct \`Screen\` holding a field \`components: Vec<Box<dyn Draw>>\` and a method \`run(&self)\` that calls \`draw\` on every component.

Implement \`Draw\` for \`Button { label: String }\` (prints \`Button: <label>\`) and \`SelectBox { options: usize }\` (prints \`SelectBox with N options\` where N is \`options\`). In \`main\`, build a screen with one Button labeled "OK" and one SelectBox with 3 options, then call \`run()\`. Output:
Button: OK
SelectBox with 3 options`,
    hints: [
      'Screen owns \`Vec<Box<dyn Draw>>\`.',
      '\`run\` iterates the components and calls \`component.draw()\`.',
    ],
    solution: `trait Draw {
    fn draw(&self);
}

struct Screen {
    components: Vec<Box<dyn Draw>>,
}

impl Screen {
    fn run(&self) {
        for component in &self.components {
            component.draw();
        }
    }
}

struct Button { label: String }
struct SelectBox { options: usize }

impl Draw for Button {
    fn draw(&self) {
        println!("Button: {}", self.label);
    }
}

impl Draw for SelectBox {
    fn draw(&self) {
        println!("SelectBox with {} options", self.options);
    }
}

fn main() {
    let screen = Screen {
        components: vec![
            Box::new(Button { label: String::from("OK") }),
            Box::new(SelectBox { options: 3 }),
        ],
    };
    screen.run();
}`,
    starter: `trait Draw {
    fn draw(&self);
}

struct Screen {
    components: Vec<Box<dyn Draw>>,
}

impl Screen {
    // TODO: run
}

struct Button { label: String }
struct SelectBox { options: usize }

// TODO: impls

fn main() {
    // TODO
}`,
    tags: ['trait-objects', 'gui'],
  },
  {
    id: 'rs-ch17-c-041',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Function Taking a Reference Trait Object',
    prompt: `Define a trait \`Animal\` with \`speak(&self) -> String\`. Implement it for \`Dog\` (returns "Woof") and \`Cat\` (returns "Meow").

Write a free function \`announce(a: &dyn Animal)\` that prints \`Heard: <speak result>\`. In \`main\`, call \`announce\` once with a \`Dog\` and once with a \`Cat\`. Output:
Heard: Woof
Heard: Meow`,
    hints: [
      'A reference trait object has type \`&dyn Animal\`.',
      'Pass \`&dog\` and \`&cat\` where the function expects \`&dyn Animal\`.',
    ],
    solution: `trait Animal {
    fn speak(&self) -> String;
}

struct Dog;
struct Cat;

impl Animal for Dog {
    fn speak(&self) -> String { String::from("Woof") }
}
impl Animal for Cat {
    fn speak(&self) -> String { String::from("Meow") }
}

fn announce(a: &dyn Animal) {
    println!("Heard: {}", a.speak());
}

fn main() {
    let d = Dog;
    let c = Cat;
    announce(&d);
    announce(&c);
}`,
    starter: `trait Animal {
    fn speak(&self) -> String;
}

struct Dog;
struct Cat;

// TODO: impls

fn announce(a: &dyn Animal) {
    // TODO
}

fn main() {
    // TODO
}`,
    tags: ['trait-objects', 'references'],
  },
  {
    id: 'rs-ch17-c-042',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Trait Default Method as Shared Behavior',
    prompt: `Rust has no inheritance, but a trait default method can supply shared behavior. Define a trait \`Summary\` with:
- a required method \`title(&self) -> String\`.
- a default method \`summarize(&self) -> String\` that returns \`(Read more: <title>...)\`.

Implement \`Summary\` for \`Article { headline: String }\` by only providing \`title\` (return \`headline\`). In \`main\`, build an article with headline "Rust 2026" and print \`summarize()\`. Output:
(Read more: Rust 2026...)`,
    hints: [
      'Give \`summarize\` a body in the trait definition.',
      'The implementor only needs to supply \`title\`.',
    ],
    solution: `trait Summary {
    fn title(&self) -> String;

    fn summarize(&self) -> String {
        format!("(Read more: {}...)", self.title())
    }
}

struct Article {
    headline: String,
}

impl Summary for Article {
    fn title(&self) -> String {
        self.headline.clone()
    }
}

fn main() {
    let a = Article { headline: String::from("Rust 2026") };
    println!("{}", a.summarize());
}`,
    starter: `trait Summary {
    fn title(&self) -> String;
    // TODO: default summarize
}

struct Article { headline: String }

// TODO: impl

fn main() {
    // TODO
}`,
    tags: ['traits', 'default-methods'],
  },
  {
    id: 'rs-ch17-c-043',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Dynamic Dispatch vs Generic Static Dispatch',
    prompt: `Define a trait \`Greeter\` with \`hello(&self) -> String\`, implemented for \`English\` ("Hi") and \`Spanish\` ("Hola").

Write TWO functions that both print the greeting:
- \`greet_static<T: Greeter>(g: &T)\` (generic, monomorphized, static dispatch).
- \`greet_dynamic(g: &dyn Greeter)\` (trait object, dynamic dispatch).

In \`main\`, call \`greet_static\` with an \`English\` and \`greet_dynamic\` with a \`Spanish\`. Output:
Hi
Hola`,
    hints: [
      'The generic version uses a trait bound \`<T: Greeter>\`.',
      'The dynamic version names the trait object \`&dyn Greeter\` directly.',
    ],
    solution: `trait Greeter {
    fn hello(&self) -> String;
}

struct English;
struct Spanish;

impl Greeter for English {
    fn hello(&self) -> String { String::from("Hi") }
}
impl Greeter for Spanish {
    fn hello(&self) -> String { String::from("Hola") }
}

fn greet_static<T: Greeter>(g: &T) {
    println!("{}", g.hello());
}

fn greet_dynamic(g: &dyn Greeter) {
    println!("{}", g.hello());
}

fn main() {
    greet_static(&English);
    greet_dynamic(&Spanish);
}`,
    starter: `trait Greeter {
    fn hello(&self) -> String;
}

struct English;
struct Spanish;

// TODO: impls

fn greet_static<T: Greeter>(g: &T) {
    // TODO
}

fn greet_dynamic(g: &dyn Greeter) {
    // TODO
}

fn main() {
    // TODO
}`,
    tags: ['dynamic-dispatch', 'generics'],
  },
  {
    id: 'rs-ch17-c-044',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sum Areas Through Trait Objects',
    prompt: `Define a trait \`Area\` with \`value(&self) -> f64\`, implemented for \`Rect { w: f64, h: f64 }\` (returns \`w * h\`) and \`Tri { base: f64, height: f64 }\` (returns \`0.5 * base * height\`).

Write a function \`total_area(items: &[Box<dyn Area>]) -> f64\` that sums every item's area. In \`main\`, build a vector with \`Rect { w: 2.0, h: 3.0 }\` and \`Tri { base: 4.0, height: 2.0 }\`, then print the total. Output: \`10\`.`,
    hints: [
      'Accept a slice of boxed trait objects: \`&[Box<dyn Area>]\`.',
      'Accumulate with a \`for\` loop or \`iter().map(...).sum()\`.',
    ],
    solution: `trait Area {
    fn value(&self) -> f64;
}

struct Rect { w: f64, h: f64 }
struct Tri { base: f64, height: f64 }

impl Area for Rect {
    fn value(&self) -> f64 { self.w * self.h }
}
impl Area for Tri {
    fn value(&self) -> f64 { 0.5 * self.base * self.height }
}

fn total_area(items: &[Box<dyn Area>]) -> f64 {
    let mut total = 0.0;
    for item in items {
        total += item.value();
    }
    total
}

fn main() {
    let items: Vec<Box<dyn Area>> = vec![
        Box::new(Rect { w: 2.0, h: 3.0 }),
        Box::new(Tri { base: 4.0, height: 2.0 }),
    ];
    println!("{}", total_area(&items));
}`,
    starter: `trait Area {
    fn value(&self) -> f64;
}

struct Rect { w: f64, h: f64 }
struct Tri { base: f64, height: f64 }

// TODO: impls

fn total_area(items: &[Box<dyn Area>]) -> f64 {
    // TODO
}

fn main() {
    // TODO
}`,
    tags: ['trait-objects', 'slices'],
  },
  {
    id: 'rs-ch17-c-045',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Return a Boxed Trait Object',
    prompt: `Define a trait \`Logger\` with \`log(&self, msg: &str)\`. Implement it for \`Console\` (prints \`[console] <msg>\`) and \`Silent\` (prints nothing).

Write a function \`make_logger(verbose: bool) -> Box<dyn Logger>\` that returns a \`Console\` when verbose is true and a \`Silent\` otherwise. In \`main\`, get a logger with \`make_logger(true)\` and call \`log("started")\`. Output:
[console] started`,
    hints: [
      'A function can only return one concrete type unless you box it: return \`Box<dyn Logger>\`.',
      'Both branches must return \`Box::new(...)\`.',
    ],
    solution: `trait Logger {
    fn log(&self, msg: &str);
}

struct Console;
struct Silent;

impl Logger for Console {
    fn log(&self, msg: &str) {
        println!("[console] {}", msg);
    }
}
impl Logger for Silent {
    fn log(&self, _msg: &str) {}
}

fn make_logger(verbose: bool) -> Box<dyn Logger> {
    if verbose {
        Box::new(Console)
    } else {
        Box::new(Silent)
    }
}

fn main() {
    let logger = make_logger(true);
    logger.log("started");
}`,
    starter: `trait Logger {
    fn log(&self, msg: &str);
}

struct Console;
struct Silent;

// TODO: impls

fn make_logger(verbose: bool) -> Box<dyn Logger> {
    // TODO
}

fn main() {
    // TODO
}`,
    tags: ['trait-objects', 'return-types'],
  },
  {
    id: 'rs-ch17-c-046',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Trait Object With a Marker Method',
    prompt: `Define a trait \`Payable\` with \`amount(&self) -> u32\` and \`label(&self) -> &str\`. Implement it for \`Invoice { cents: u32 }\` (label "invoice") and \`Refund { cents: u32 }\` (label "refund").

Write \`describe(p: &dyn Payable)\` that prints \`<label>: <amount>\`. In \`main\`, describe an \`Invoice { cents: 500 }\` and a \`Refund { cents: 200 }\`. Output:
invoice: 500
refund: 200`,
    hints: [
      'A trait can require more than one method; both must be present for a trait object.',
      'Returning \`&str\` from \`label\` lets you hand back a string literal.',
    ],
    solution: `trait Payable {
    fn amount(&self) -> u32;
    fn label(&self) -> &str;
}

struct Invoice { cents: u32 }
struct Refund { cents: u32 }

impl Payable for Invoice {
    fn amount(&self) -> u32 { self.cents }
    fn label(&self) -> &str { "invoice" }
}
impl Payable for Refund {
    fn amount(&self) -> u32 { self.cents }
    fn label(&self) -> &str { "refund" }
}

fn describe(p: &dyn Payable) {
    println!("{}: {}", p.label(), p.amount());
}

fn main() {
    describe(&Invoice { cents: 500 });
    describe(&Refund { cents: 200 });
}`,
    starter: `trait Payable {
    fn amount(&self) -> u32;
    fn label(&self) -> &str;
}

struct Invoice { cents: u32 }
struct Refund { cents: u32 }

// TODO: impls

fn describe(p: &dyn Payable) {
    // TODO
}

fn main() {
    // TODO
}`,
    tags: ['trait-objects', 'methods'],
  },
  {
    id: 'rs-ch17-c-047',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Heterogeneous Plugin Pipeline',
    prompt: `Define a trait \`Transform\` with \`apply(&self, input: i32) -> i32\`. Implement it for \`AddN { n: i32 }\` (returns \`input + n\`) and \`MulN { n: i32 }\` (returns \`input * n\`).

Write \`run_pipeline(stages: &[Box<dyn Transform>], start: i32) -> i32\` that threads \`start\` through each stage in order. In \`main\`, run a pipeline \`[AddN { n: 3 }, MulN { n: 2 }]\` on start value 1 and print the result. Output: \`8\`.`,
    hints: [
      'Fold the value: each stage takes the previous result.',
      'Start with \`let mut acc = start;\` and reassign in the loop.',
    ],
    solution: `trait Transform {
    fn apply(&self, input: i32) -> i32;
}

struct AddN { n: i32 }
struct MulN { n: i32 }

impl Transform for AddN {
    fn apply(&self, input: i32) -> i32 { input + self.n }
}
impl Transform for MulN {
    fn apply(&self, input: i32) -> i32 { input * self.n }
}

fn run_pipeline(stages: &[Box<dyn Transform>], start: i32) -> i32 {
    let mut acc = start;
    for stage in stages {
        acc = stage.apply(acc);
    }
    acc
}

fn main() {
    let stages: Vec<Box<dyn Transform>> = vec![
        Box::new(AddN { n: 3 }),
        Box::new(MulN { n: 2 }),
    ];
    println!("{}", run_pipeline(&stages, 1));
}`,
    starter: `trait Transform {
    fn apply(&self, input: i32) -> i32;
}

struct AddN { n: i32 }
struct MulN { n: i32 }

// TODO: impls

fn run_pipeline(stages: &[Box<dyn Transform>], start: i32) -> i32 {
    // TODO
}

fn main() {
    // TODO
}`,
    tags: ['trait-objects', 'pipeline'],
  },
  {
    id: 'rs-ch17-c-048',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Encapsulated Stack',
    prompt: `Define a struct \`Stack\` with a PRIVATE field \`items: Vec<i32>\`. Provide a public API:
- \`new()\` empty stack.
- \`push(&mut self, x: i32)\`.
- \`pop(&mut self) -> Option<i32>\`.
- \`len(&self) -> usize\`.

The vector must stay private so callers cannot reach in and reorder it. In \`main\`, push 1, 2, 3; pop once; then print \`len()\` and the popped value. Output:
2
3`,
    hints: [
      'Delegate \`push\`/\`pop\` to the inner \`Vec\`.',
      '\`Vec::pop\` already returns \`Option<i32>\`.',
    ],
    solution: `struct Stack {
    items: Vec<i32>,
}

impl Stack {
    fn new() -> Stack {
        Stack { items: Vec::new() }
    }

    fn push(&mut self, x: i32) {
        self.items.push(x);
    }

    fn pop(&mut self) -> Option<i32> {
        self.items.pop()
    }

    fn len(&self) -> usize {
        self.items.len()
    }
}

fn main() {
    let mut s = Stack::new();
    s.push(1);
    s.push(2);
    s.push(3);
    let top = s.pop();
    println!("{}", s.len());
    println!("{}", top.unwrap());
}`,
    starter: `struct Stack {
    items: Vec<i32>,
}

impl Stack {
    // TODO: new, push, pop, len
}

fn main() {
    // TODO
}`,
    tags: ['encapsulation', 'data-structures'],
  },
  {
    id: 'rs-ch17-c-049',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Notify Over a Slice of Trait Objects',
    prompt: `Define a trait \`Notifier\` with \`send(&self, message: &str)\`. Implement it for \`Email { to: String }\` (prints \`Email to <to>: <message>\`) and \`Sms { number: String }\` (prints \`SMS to <number>: <message>\`).

Write \`broadcast(channels: &[Box<dyn Notifier>], message: &str)\` that sends the same message to all channels. In \`main\`, broadcast "Hi" to an \`Email\` for "a@x.com" and an \`Sms\` for "555". Output:
Email to a@x.com: Hi
SMS to 555: Hi`,
    hints: [
      'Iterate \`channels\` and call \`send\` with the shared message.',
      'Trait objects let you store both channel kinds in one vector.',
    ],
    solution: `trait Notifier {
    fn send(&self, message: &str);
}

struct Email { to: String }
struct Sms { number: String }

impl Notifier for Email {
    fn send(&self, message: &str) {
        println!("Email to {}: {}", self.to, message);
    }
}
impl Notifier for Sms {
    fn send(&self, message: &str) {
        println!("SMS to {}: {}", self.number, message);
    }
}

fn broadcast(channels: &[Box<dyn Notifier>], message: &str) {
    for c in channels {
        c.send(message);
    }
}

fn main() {
    let channels: Vec<Box<dyn Notifier>> = vec![
        Box::new(Email { to: String::from("a@x.com") }),
        Box::new(Sms { number: String::from("555") }),
    ];
    broadcast(&channels, "Hi");
}`,
    starter: `trait Notifier {
    fn send(&self, message: &str);
}

struct Email { to: String }
struct Sms { number: String }

// TODO: impls

fn broadcast(channels: &[Box<dyn Notifier>], message: &str) {
    // TODO
}

fn main() {
    // TODO
}`,
    tags: ['trait-objects', 'broadcast'],
  },
  {
    id: 'rs-ch17-c-050',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Static Dispatch With impl Trait Argument',
    prompt: `Define a trait \`Named\` with \`name(&self) -> String\`. Implement it for \`User { handle: String }\` (returns \`handle\`) and \`Bot { id: u32 }\` (returns \`bot-<id>\`).

Write \`greet(entity: impl Named)\` (using \`impl Trait\` in argument position, which is static dispatch). It prints \`Hello, <name>\`. In \`main\`, call \`greet\` with a \`User\` whose handle is "ana" and a \`Bot\` with id 7. Output:
Hello, ana
Hello, bot-7`,
    hints: [
      '\`impl Named\` in an argument is shorthand for a generic bound.',
      'This monomorphizes a separate copy per concrete type at compile time.',
    ],
    solution: `trait Named {
    fn name(&self) -> String;
}

struct User { handle: String }
struct Bot { id: u32 }

impl Named for User {
    fn name(&self) -> String { self.handle.clone() }
}
impl Named for Bot {
    fn name(&self) -> String { format!("bot-{}", self.id) }
}

fn greet(entity: impl Named) {
    println!("Hello, {}", entity.name());
}

fn main() {
    greet(User { handle: String::from("ana") });
    greet(Bot { id: 7 });
}`,
    starter: `trait Named {
    fn name(&self) -> String;
}

struct User { handle: String }
struct Bot { id: u32 }

// TODO: impls

fn greet(entity: impl Named) {
    // TODO
}

fn main() {
    // TODO
}`,
    tags: ['static-dispatch', 'impl-trait'],
  },
  {
    id: 'rs-ch17-c-051',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Typestate: Light Off and On',
    prompt: `Encode states as distinct types. Define an empty struct \`LightOff\` and an empty struct \`LightOn\`. Give them transition methods that CONSUME self:
- \`LightOff::turn_on(self) -> LightOn\`
- \`LightOn::turn_off(self) -> LightOff\`

Add a method \`status(&self) -> &str\` to each ("off" / "on"). In \`main\`, start with a \`LightOff\`, print its status, turn it on, and print the new status. Output:
off
on`,
    hints: [
      'Transition methods take \`self\` by value so the old state is moved away.',
      'Because the types differ, you literally cannot call \`turn_off\` on a \`LightOff\`.',
    ],
    solution: `struct LightOff;
struct LightOn;

impl LightOff {
    fn turn_on(self) -> LightOn {
        LightOn
    }
    fn status(&self) -> &str {
        "off"
    }
}

impl LightOn {
    fn turn_off(self) -> LightOff {
        LightOff
    }
    fn status(&self) -> &str {
        "on"
    }
}

fn main() {
    let off = LightOff;
    println!("{}", off.status());
    let on = off.turn_on();
    println!("{}", on.status());
}`,
    starter: `struct LightOff;
struct LightOn;

// TODO: transition + status methods

fn main() {
    // TODO
}`,
    tags: ['typestate', 'ownership'],
  },
  {
    id: 'rs-ch17-c-052',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Enum-Dispatched Shapes',
    prompt: `Instead of trait objects, model a closed set of shapes with an enum. Define \`enum Figure { Circle(f64), Rect(f64, f64) }\` and an inherent method \`area(&self) -> f64\` that uses a \`match\`. Use \`3.14\` for pi.

In \`main\`, build a \`Vec<Figure>\` with \`Circle(1.0)\` and \`Rect(2.0, 3.0)\`, loop over it, and print each area. Output:
3.14
6`,
    hints: [
      'An enum with a \`match\` is an alternative to dynamic dispatch when the variant set is fixed.',
      'Destructure each variant inside the \`match\` arms.',
    ],
    solution: `enum Figure {
    Circle(f64),
    Rect(f64, f64),
}

impl Figure {
    fn area(&self) -> f64 {
        match self {
            Figure::Circle(r) => 3.14 * r * r,
            Figure::Rect(w, h) => w * h,
        }
    }
}

fn main() {
    let figures = vec![Figure::Circle(1.0), Figure::Rect(2.0, 3.0)];
    for f in &figures {
        println!("{}", f.area());
    }
}`,
    starter: `enum Figure {
    Circle(f64),
    Rect(f64, f64),
}

impl Figure {
    fn area(&self) -> f64 {
        // TODO: match
    }
}

fn main() {
    // TODO
}`,
    tags: ['enums', 'dispatch'],
  },
  {
    id: 'rs-ch17-c-053',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Supertrait: Summary Requires Title',
    prompt: `Define a trait \`Titled\` with \`title(&self) -> String\`. Define a second trait \`Described: Titled\` (a supertrait bound) that adds a default method \`describe(&self) -> String\` returning \`Doc: <title>\`.

Implement both for \`Page { heading: String }\` (title returns \`heading\`). In \`main\`, build a page with heading "Home" and print \`describe()\`. Output:
Doc: Home`,
    hints: [
      'Write the supertrait bound as \`trait Described: Titled\`.',
      'Inside \`describe\` you may call \`self.title()\` because every \`Described\` is also \`Titled\`.',
    ],
    solution: `trait Titled {
    fn title(&self) -> String;
}

trait Described: Titled {
    fn describe(&self) -> String {
        format!("Doc: {}", self.title())
    }
}

struct Page { heading: String }

impl Titled for Page {
    fn title(&self) -> String { self.heading.clone() }
}
impl Described for Page {}

fn main() {
    let p = Page { heading: String::from("Home") };
    println!("{}", p.describe());
}`,
    starter: `trait Titled {
    fn title(&self) -> String;
}

trait Described: Titled {
    // TODO: default describe
}

struct Page { heading: String }

// TODO: impls

fn main() {
    // TODO
}`,
    tags: ['supertraits', 'default-methods'],
  },
  {
    id: 'rs-ch17-c-054',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Mutable Trait Object Method',
    prompt: `Define a trait \`Accumulator\` with two methods: \`add(&mut self, x: i32)\` and \`total(&self) -> i32\`. Implement it for \`Sum { running: i32 }\` (adds to \`running\`) and \`Product { running: i32 }\` (multiplies \`running\` by \`x\`).

In \`main\`, store one \`Sum { running: 0 }\` and one \`Product { running: 1 }\` in a \`Vec<Box<dyn Accumulator>>\`. Feed each the values 2 and 3 via a loop, then print each total. Output:
5
6`,
    hints: [
      'To call \`add\`, iterate with \`for acc in &mut accs\` so you get mutable access.',
      'A boxed trait object can still expose \`&mut self\` methods.',
    ],
    solution: `trait Accumulator {
    fn add(&mut self, x: i32);
    fn total(&self) -> i32;
}

struct Sum { running: i32 }
struct Product { running: i32 }

impl Accumulator for Sum {
    fn add(&mut self, x: i32) { self.running += x; }
    fn total(&self) -> i32 { self.running }
}
impl Accumulator for Product {
    fn add(&mut self, x: i32) { self.running *= x; }
    fn total(&self) -> i32 { self.running }
}

fn main() {
    let mut accs: Vec<Box<dyn Accumulator>> = vec![
        Box::new(Sum { running: 0 }),
        Box::new(Product { running: 1 }),
    ];
    for acc in &mut accs {
        acc.add(2);
        acc.add(3);
    }
    for acc in &accs {
        println!("{}", acc.total());
    }
}`,
    starter: `trait Accumulator {
    fn add(&mut self, x: i32);
    fn total(&self) -> i32;
}

struct Sum { running: i32 }
struct Product { running: i32 }

// TODO: impls

fn main() {
    let mut accs: Vec<Box<dyn Accumulator>> = vec![
        // TODO
    ];
    // TODO: feed 2 and 3, print totals
}`,
    tags: ['trait-objects', 'mutation'],
  },
  {
    id: 'rs-ch17-c-055',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Trait Objects Sharing a Default Method',
    prompt: `Define a trait \`Voice\` with a required \`sound(&self) -> String\` and a DEFAULT method \`shout(&self) -> String\` returning the sound followed by "!". Implement \`Voice\` for \`Duck\` (sound "quack") and \`Frog\` (sound "ribbit"), neither overriding \`shout\`.

Store both in a \`Vec<Box<dyn Voice>>\` and print each \`shout()\`. Output:
quack!
ribbit!`,
    hints: [
      'Default methods are available through trait objects too.',
      '\`shout\` can call \`self.sound()\` even though it is abstract.',
    ],
    solution: `trait Voice {
    fn sound(&self) -> String;

    fn shout(&self) -> String {
        format!("{}!", self.sound())
    }
}

struct Duck;
struct Frog;

impl Voice for Duck {
    fn sound(&self) -> String { String::from("quack") }
}
impl Voice for Frog {
    fn sound(&self) -> String { String::from("ribbit") }
}

fn main() {
    let voices: Vec<Box<dyn Voice>> = vec![Box::new(Duck), Box::new(Frog)];
    for v in &voices {
        println!("{}", v.shout());
    }
}`,
    starter: `trait Voice {
    fn sound(&self) -> String;
    // TODO: default shout
}

struct Duck;
struct Frog;

// TODO: impls

fn main() {
    // TODO
}`,
    tags: ['trait-objects', 'default-methods'],
  },
  {
    id: 'rs-ch17-c-056',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Bank Account Encapsulation With Validation',
    prompt: `Define \`Account\` with a PRIVATE field \`balance: i64\` (cents). Public API:
- \`new()\` starts at 0.
- \`deposit(&mut self, cents: i64)\` adds only if \`cents > 0\`.
- \`withdraw(&mut self, cents: i64) -> bool\` subtracts only if \`cents > 0\` AND \`cents <= balance\`, returning whether it succeeded.
- \`balance(&self) -> i64\`.

Privacy guarantees the balance can never go negative. In \`main\`: deposit 100, withdraw 150 (should fail), withdraw 40 (should succeed), then print the balance. Output:
false
true
60`,
    hints: [
      'Reject invalid deposits/withdrawals before changing the balance.',
      '\`withdraw\` returns \`true\` only when it actually subtracts.',
    ],
    solution: `struct Account {
    balance: i64,
}

impl Account {
    fn new() -> Account {
        Account { balance: 0 }
    }

    fn deposit(&mut self, cents: i64) {
        if cents > 0 {
            self.balance += cents;
        }
    }

    fn withdraw(&mut self, cents: i64) -> bool {
        if cents > 0 && cents <= self.balance {
            self.balance -= cents;
            true
        } else {
            false
        }
    }

    fn balance(&self) -> i64 {
        self.balance
    }
}

fn main() {
    let mut a = Account::new();
    a.deposit(100);
    println!("{}", a.withdraw(150));
    println!("{}", a.withdraw(40));
    println!("{}", a.balance());
}`,
    starter: `struct Account {
    balance: i64,
}

impl Account {
    // TODO: new, deposit, withdraw, balance
}

fn main() {
    // TODO
}`,
    tags: ['encapsulation', 'invariants'],
  },
  {
    id: 'rs-ch17-c-057',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Renderer Registry With push',
    prompt: `Define a trait \`Widget\` with \`render(&self) -> String\`. Define a struct \`App\` holding \`widgets: Vec<Box<dyn Widget>>\` and methods:
- \`new()\` empty app.
- \`add(&mut self, w: Box<dyn Widget>)\` pushes a widget.
- \`render_all(&self) -> Vec<String>\` returns each widget's rendered string.

Implement \`Widget\` for \`Label { text: String }\` (returns \`text\`) and \`Spacer\` (returns "---"). In \`main\`, add a \`Label\` with text "Title" and a \`Spacer\`, then print each rendered string from \`render_all\`. Output:
Title
---`,
    hints: [
      '\`add\` takes an already-boxed trait object.',
      '\`render_all\` collects results into a \`Vec<String>\`.',
    ],
    solution: `trait Widget {
    fn render(&self) -> String;
}

struct App {
    widgets: Vec<Box<dyn Widget>>,
}

impl App {
    fn new() -> App {
        App { widgets: Vec::new() }
    }

    fn add(&mut self, w: Box<dyn Widget>) {
        self.widgets.push(w);
    }

    fn render_all(&self) -> Vec<String> {
        let mut out = Vec::new();
        for w in &self.widgets {
            out.push(w.render());
        }
        out
    }
}

struct Label { text: String }
struct Spacer;

impl Widget for Label {
    fn render(&self) -> String { self.text.clone() }
}
impl Widget for Spacer {
    fn render(&self) -> String { String::from("---") }
}

fn main() {
    let mut app = App::new();
    app.add(Box::new(Label { text: String::from("Title") }));
    app.add(Box::new(Spacer));
    for line in app.render_all() {
        println!("{}", line);
    }
}`,
    starter: `trait Widget {
    fn render(&self) -> String;
}

struct App {
    widgets: Vec<Box<dyn Widget>>,
}

impl App {
    // TODO: new, add, render_all
}

struct Label { text: String }
struct Spacer;

// TODO: impls

fn main() {
    // TODO
}`,
    tags: ['trait-objects', 'registry'],
  },
  {
    id: 'rs-ch17-c-058',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Find the First Match Among Trait Objects',
    prompt: `Define a trait \`Rule\` with \`matches(&self, n: i32) -> bool\` and \`name(&self) -> String\`. Implement \`Even\` (matches even numbers, name "even") and \`Positive\` (matches \`n > 0\`, name "positive").

Write \`first_match(rules: &[Box<dyn Rule>], n: i32) -> Option<String>\` returning the name of the first rule that matches, or \`None\`. In \`main\`, with rules \`[Even, Positive]\` test n = 3 and print the result with \`{:?}\`. Output:
Some("positive")`,
    hints: [
      'Loop and return early when \`matches\` is true.',
      'Return \`Some(rule.name())\`; fall through to \`None\`.',
    ],
    solution: `trait Rule {
    fn matches(&self, n: i32) -> bool;
    fn name(&self) -> String;
}

struct Even;
struct Positive;

impl Rule for Even {
    fn matches(&self, n: i32) -> bool { n % 2 == 0 }
    fn name(&self) -> String { String::from("even") }
}
impl Rule for Positive {
    fn matches(&self, n: i32) -> bool { n > 0 }
    fn name(&self) -> String { String::from("positive") }
}

fn first_match(rules: &[Box<dyn Rule>], n: i32) -> Option<String> {
    for rule in rules {
        if rule.matches(n) {
            return Some(rule.name());
        }
    }
    None
}

fn main() {
    let rules: Vec<Box<dyn Rule>> = vec![Box::new(Even), Box::new(Positive)];
    println!("{:?}", first_match(&rules, 3));
}`,
    starter: `trait Rule {
    fn matches(&self, n: i32) -> bool;
    fn name(&self) -> String;
}

struct Even;
struct Positive;

// TODO: impls

fn first_match(rules: &[Box<dyn Rule>], n: i32) -> Option<String> {
    // TODO
}

fn main() {
    // TODO
}`,
    tags: ['trait-objects', 'option'],
  },
  {
    id: 'rs-ch17-c-059',
    chapter: 17,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Typestate Door With a Lock',
    prompt: `Model a door with three distinct types: \`Open\`, \`Closed\`, \`Locked\`. Transitions consume self:
- \`Open::close(self) -> Closed\`
- \`Closed::open(self) -> Open\`
- \`Closed::lock(self) -> Locked\`
- \`Locked::unlock(self) -> Closed\`

Note that there is no \`open\` on \`Locked\` and no \`lock\` on \`Open\`, so illegal transitions cannot even be written. In \`main\`, start \`Open\`, close it, lock it, unlock it, then open it. Print a line for each resulting state name ("open"/"closed"/"locked") using a \`name(&self)\` method available on each type. Output:
closed
locked
closed
open`,
    hints: [
      'Each state is its own struct; give each a \`name\` method.',
      'You print after each transition, reusing the moved value as the new type.',
    ],
    solution: `struct Open;
struct Closed;
struct Locked;

impl Open {
    fn close(self) -> Closed { Closed }
    fn name(&self) -> &str { "open" }
}
impl Closed {
    fn open(self) -> Open { Open }
    fn lock(self) -> Locked { Locked }
    fn name(&self) -> &str { "closed" }
}
impl Locked {
    fn unlock(self) -> Closed { Closed }
    fn name(&self) -> &str { "locked" }
}

fn main() {
    let door = Open;
    let door = door.close();
    println!("{}", door.name());
    let door = door.lock();
    println!("{}", door.name());
    let door = door.unlock();
    println!("{}", door.name());
    let door = door.open();
    println!("{}", door.name());
}`,
    starter: `struct Open;
struct Closed;
struct Locked;

// TODO: transition + name methods

fn main() {
    // TODO
}`,
    tags: ['typestate', 'ownership'],
  },
  {
    id: 'rs-ch17-c-060',
    chapter: 17,
    kind: 'coding',
    difficulty: 'hard',
    title: 'State Pattern: Post Draft to Published',
    prompt: `Implement the book's blog post state machine with trait objects. Define a trait \`State\` with:
- \`request_review(self: Box<Self>) -> Box<dyn State>\`
- \`approve(self: Box<Self>) -> Box<dyn State>\`
- a default \`content<'a>(&self, _post: &'a Post) -> &'a str\` returning "".

States: \`Draft\` (request_review -> PendingReview, approve -> stays Draft), \`PendingReview\` (request_review -> stays, approve -> Published), \`Published\` (both stay, and \`content\` returns the post's text).

Define \`Post\` with private \`state: Option<Box<dyn State>>\` and \`content: String\`. Provide \`new()\`, \`add_text(&mut self, &str)\`, \`request_review(&mut self)\`, \`approve(&mut self)\`, and \`content(&self) -> &str\`. In \`main\`: create a post, add "hi", print content (empty), request_review, print content (empty), approve, print content. Output:

hi`,
    hints: [
      'Use \`self.state.take()\` to move the boxed state out, transition, then store it back.',
      'Transition methods take \`self: Box<Self>\` so they consume the boxed state.',
      'Only \`Published\` overrides \`content\`; the default returns "".',
    ],
    solution: `trait State {
    fn request_review(self: Box<Self>) -> Box<dyn State>;
    fn approve(self: Box<Self>) -> Box<dyn State>;
    fn content<'a>(&self, _post: &'a Post) -> &'a str {
        ""
    }
}

struct Draft;
struct PendingReview;
struct Published;

impl State for Draft {
    fn request_review(self: Box<Self>) -> Box<dyn State> {
        Box::new(PendingReview)
    }
    fn approve(self: Box<Self>) -> Box<dyn State> {
        self
    }
}

impl State for PendingReview {
    fn request_review(self: Box<Self>) -> Box<dyn State> {
        self
    }
    fn approve(self: Box<Self>) -> Box<dyn State> {
        Box::new(Published)
    }
}

impl State for Published {
    fn request_review(self: Box<Self>) -> Box<dyn State> {
        self
    }
    fn approve(self: Box<Self>) -> Box<dyn State> {
        self
    }
    fn content<'a>(&self, post: &'a Post) -> &'a str {
        &post.content
    }
}

struct Post {
    state: Option<Box<dyn State>>,
    content: String,
}

impl Post {
    fn new() -> Post {
        Post {
            state: Some(Box::new(Draft)),
            content: String::new(),
        }
    }

    fn add_text(&mut self, text: &str) {
        self.content.push_str(text);
    }

    fn request_review(&mut self) {
        if let Some(s) = self.state.take() {
            self.state = Some(s.request_review());
        }
    }

    fn approve(&mut self) {
        if let Some(s) = self.state.take() {
            self.state = Some(s.approve());
        }
    }

    fn content(&self) -> &str {
        self.state.as_ref().unwrap().content(self)
    }
}

fn main() {
    let mut post = Post::new();
    post.add_text("hi");
    println!("{}", post.content());
    post.request_review();
    println!("{}", post.content());
    post.approve();
    println!("{}", post.content());
}`,
    starter: `trait State {
    fn request_review(self: Box<Self>) -> Box<dyn State>;
    fn approve(self: Box<Self>) -> Box<dyn State>;
    fn content<'a>(&self, _post: &'a Post) -> &'a str {
        ""
    }
}

struct Draft;
struct PendingReview;
struct Published;

// TODO: impl State for each

struct Post {
    state: Option<Box<dyn State>>,
    content: String,
}

impl Post {
    // TODO: new, add_text, request_review, approve, content
}

fn main() {
    // TODO
}`,
    tags: ['state-pattern', 'trait-objects'],
  },
  {
    id: 'rs-ch17-c-061',
    chapter: 17,
    kind: 'coding',
    difficulty: 'hard',
    title: 'State Pattern With Two Approvals',
    prompt: `Extend the blog state machine so publishing requires TWO approvals. Use a \`State\` trait with \`request_review(self: Box<Self>) -> Box<dyn State>\`, \`approve(self: Box<Self>) -> Box<dyn State>\`, and a default \`content<'a>(&self, _post: &'a Post) -> &'a str\` returning "".

States: \`Draft\` (request_review -> PendingReview), \`PendingReview\` (approve -> SecondReview), \`SecondReview\` (approve -> Published), \`Published\` (content returns text). Any unspecified transition keeps the current state.

\`Post\` mirrors the book (private \`state\`, \`content\`). In \`main\`: add "ok", request_review, approve, print content (still empty), approve again, print content. Output:

ok`,
    hints: [
      'Add a \`SecondReview\` state between \`PendingReview\` and \`Published\`.',
      'Each \`approve\` advances exactly one step; the first approve does not publish.',
    ],
    solution: `trait State {
    fn request_review(self: Box<Self>) -> Box<dyn State>;
    fn approve(self: Box<Self>) -> Box<dyn State>;
    fn content<'a>(&self, _post: &'a Post) -> &'a str {
        ""
    }
}

struct Draft;
struct PendingReview;
struct SecondReview;
struct Published;

impl State for Draft {
    fn request_review(self: Box<Self>) -> Box<dyn State> { Box::new(PendingReview) }
    fn approve(self: Box<Self>) -> Box<dyn State> { self }
}
impl State for PendingReview {
    fn request_review(self: Box<Self>) -> Box<dyn State> { self }
    fn approve(self: Box<Self>) -> Box<dyn State> { Box::new(SecondReview) }
}
impl State for SecondReview {
    fn request_review(self: Box<Self>) -> Box<dyn State> { self }
    fn approve(self: Box<Self>) -> Box<dyn State> { Box::new(Published) }
}
impl State for Published {
    fn request_review(self: Box<Self>) -> Box<dyn State> { self }
    fn approve(self: Box<Self>) -> Box<dyn State> { self }
    fn content<'a>(&self, post: &'a Post) -> &'a str { &post.content }
}

struct Post {
    state: Option<Box<dyn State>>,
    content: String,
}

impl Post {
    fn new() -> Post {
        Post { state: Some(Box::new(Draft)), content: String::new() }
    }
    fn add_text(&mut self, text: &str) {
        self.content.push_str(text);
    }
    fn request_review(&mut self) {
        if let Some(s) = self.state.take() {
            self.state = Some(s.request_review());
        }
    }
    fn approve(&mut self) {
        if let Some(s) = self.state.take() {
            self.state = Some(s.approve());
        }
    }
    fn content(&self) -> &str {
        self.state.as_ref().unwrap().content(self)
    }
}

fn main() {
    let mut post = Post::new();
    post.add_text("ok");
    post.request_review();
    post.approve();
    println!("{}", post.content());
    post.approve();
    println!("{}", post.content());
}`,
    starter: `trait State {
    fn request_review(self: Box<Self>) -> Box<dyn State>;
    fn approve(self: Box<Self>) -> Box<dyn State>;
    fn content<'a>(&self, _post: &'a Post) -> &'a str {
        ""
    }
}

struct Draft;
struct PendingReview;
struct SecondReview;
struct Published;

// TODO: impls (note the extra SecondReview state)

struct Post {
    state: Option<Box<dyn State>>,
    content: String,
}

impl Post {
    // TODO
}

fn main() {
    // TODO
}`,
    tags: ['state-pattern', 'trait-objects'],
  },
  {
    id: 'rs-ch17-c-062',
    chapter: 17,
    kind: 'coding',
    difficulty: 'hard',
    title: 'State Pattern With a reject Transition',
    prompt: `Add a \`reject\` transition to the blog state machine. Trait \`State\` has \`request_review\`, \`approve\`, \`reject\` (all \`self: Box<Self>\` -> \`Box<dyn State>\`) and a default \`content\` returning "".

States: \`Draft\` (request_review -> PendingReview), \`PendingReview\` (approve -> Published, reject -> Draft), \`Published\` (content returns text). Unspecified transitions keep state.

\`Post\` as in the book. In \`main\`: add "hi", request_review, reject (back to Draft), print content (empty), request_review, approve, print content. Output:

hi`,
    hints: [
      'Every state must implement \`reject\`; most just return \`self\`.',
      '\`PendingReview::reject\` returns a fresh \`Box::new(Draft)\`.',
    ],
    solution: `trait State {
    fn request_review(self: Box<Self>) -> Box<dyn State>;
    fn approve(self: Box<Self>) -> Box<dyn State>;
    fn reject(self: Box<Self>) -> Box<dyn State>;
    fn content<'a>(&self, _post: &'a Post) -> &'a str {
        ""
    }
}

struct Draft;
struct PendingReview;
struct Published;

impl State for Draft {
    fn request_review(self: Box<Self>) -> Box<dyn State> { Box::new(PendingReview) }
    fn approve(self: Box<Self>) -> Box<dyn State> { self }
    fn reject(self: Box<Self>) -> Box<dyn State> { self }
}
impl State for PendingReview {
    fn request_review(self: Box<Self>) -> Box<dyn State> { self }
    fn approve(self: Box<Self>) -> Box<dyn State> { Box::new(Published) }
    fn reject(self: Box<Self>) -> Box<dyn State> { Box::new(Draft) }
}
impl State for Published {
    fn request_review(self: Box<Self>) -> Box<dyn State> { self }
    fn approve(self: Box<Self>) -> Box<dyn State> { self }
    fn reject(self: Box<Self>) -> Box<dyn State> { self }
    fn content<'a>(&self, post: &'a Post) -> &'a str { &post.content }
}

struct Post {
    state: Option<Box<dyn State>>,
    content: String,
}

impl Post {
    fn new() -> Post {
        Post { state: Some(Box::new(Draft)), content: String::new() }
    }
    fn add_text(&mut self, text: &str) { self.content.push_str(text); }
    fn request_review(&mut self) {
        if let Some(s) = self.state.take() { self.state = Some(s.request_review()); }
    }
    fn approve(&mut self) {
        if let Some(s) = self.state.take() { self.state = Some(s.approve()); }
    }
    fn reject(&mut self) {
        if let Some(s) = self.state.take() { self.state = Some(s.reject()); }
    }
    fn content(&self) -> &str {
        self.state.as_ref().unwrap().content(self)
    }
}

fn main() {
    let mut post = Post::new();
    post.add_text("hi");
    post.request_review();
    post.reject();
    println!("{}", post.content());
    post.request_review();
    post.approve();
    println!("{}", post.content());
}`,
    starter: `trait State {
    fn request_review(self: Box<Self>) -> Box<dyn State>;
    fn approve(self: Box<Self>) -> Box<dyn State>;
    fn reject(self: Box<Self>) -> Box<dyn State>;
    fn content<'a>(&self, _post: &'a Post) -> &'a str {
        ""
    }
}

struct Draft;
struct PendingReview;
struct Published;

// TODO: impls including reject

struct Post {
    state: Option<Box<dyn State>>,
    content: String,
}

impl Post {
    // TODO: include a reject method
}

fn main() {
    // TODO
}`,
    tags: ['state-pattern', 'trait-objects'],
  },
  {
    id: 'rs-ch17-c-063',
    chapter: 17,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Typestate Blog Post Alternative',
    prompt: `Reimplement the blog post using the TYPESTATE approach: states are distinct types, and \`content\` only exists on the published type.

Define \`DraftPost\` with \`new()\`, \`add_text(&mut self, &str)\`, and \`request_review(self) -> PendingReviewPost\`. Define \`PendingReviewPost\` with \`approve(self) -> Post\`. Define \`Post\` with \`content(&self) -> &str\`. Each carries the text forward.

In \`main\`: create a draft, add "ok", request_review, approve, then print \`content()\`. (Calling \`content\` before approval would not compile.) Output:
ok`,
    hints: [
      'Each transition consumes \`self\` and returns the next type, moving the text along.',
      'Only \`Post\` exposes \`content\`, so the type system enforces the workflow.',
    ],
    solution: `struct DraftPost {
    content: String,
}

struct PendingReviewPost {
    content: String,
}

struct Post {
    content: String,
}

impl DraftPost {
    fn new() -> DraftPost {
        DraftPost { content: String::new() }
    }
    fn add_text(&mut self, text: &str) {
        self.content.push_str(text);
    }
    fn request_review(self) -> PendingReviewPost {
        PendingReviewPost { content: self.content }
    }
}

impl PendingReviewPost {
    fn approve(self) -> Post {
        Post { content: self.content }
    }
}

impl Post {
    fn content(&self) -> &str {
        &self.content
    }
}

fn main() {
    let mut post = DraftPost::new();
    post.add_text("ok");
    let post = post.request_review();
    let post = post.approve();
    println!("{}", post.content());
}`,
    starter: `struct DraftPost {
    content: String,
}

struct PendingReviewPost {
    content: String,
}

struct Post {
    content: String,
}

// TODO: impls (each transition moves the text forward)

fn main() {
    // TODO
}`,
    tags: ['typestate', 'ownership'],
  },
  {
    id: 'rs-ch17-c-064',
    chapter: 17,
    kind: 'coding',
    difficulty: 'hard',
    title: 'State Machine Reporting Its Name',
    prompt: `Build a traffic-light state machine using trait objects, where each state can report its own name. Trait \`Light\` has \`next(self: Box<Self>) -> Box<dyn Light>\` and \`name(&self) -> String\`.

States cycle: \`Green\` -> \`Yellow\` -> \`Red\` -> \`Green\`. Define \`TrafficLight\` with private \`state: Option<Box<dyn Light>>\`, plus \`new()\` (starts Green), \`advance(&mut self)\`, and \`name(&self) -> String\`. In \`main\`, print the name, advance and print three more times. Output:
Green
Yellow
Red
Green`,
    hints: [
      '\`advance\` does \`take()\`, calls \`next()\`, and stores the new state.',
      '\`name\` borrows the current state via \`as_ref().unwrap()\`.',
    ],
    solution: `trait Light {
    fn next(self: Box<Self>) -> Box<dyn Light>;
    fn name(&self) -> String;
}

struct Green;
struct Yellow;
struct Red;

impl Light for Green {
    fn next(self: Box<Self>) -> Box<dyn Light> { Box::new(Yellow) }
    fn name(&self) -> String { String::from("Green") }
}
impl Light for Yellow {
    fn next(self: Box<Self>) -> Box<dyn Light> { Box::new(Red) }
    fn name(&self) -> String { String::from("Yellow") }
}
impl Light for Red {
    fn next(self: Box<Self>) -> Box<dyn Light> { Box::new(Green) }
    fn name(&self) -> String { String::from("Red") }
}

struct TrafficLight {
    state: Option<Box<dyn Light>>,
}

impl TrafficLight {
    fn new() -> TrafficLight {
        TrafficLight { state: Some(Box::new(Green)) }
    }
    fn advance(&mut self) {
        if let Some(s) = self.state.take() {
            self.state = Some(s.next());
        }
    }
    fn name(&self) -> String {
        self.state.as_ref().unwrap().name()
    }
}

fn main() {
    let mut light = TrafficLight::new();
    println!("{}", light.name());
    for _ in 0..3 {
        light.advance();
        println!("{}", light.name());
    }
}`,
    starter: `trait Light {
    fn next(self: Box<Self>) -> Box<dyn Light>;
    fn name(&self) -> String;
}

struct Green;
struct Yellow;
struct Red;

// TODO: impls cycling Green -> Yellow -> Red -> Green

struct TrafficLight {
    state: Option<Box<dyn Light>>,
}

impl TrafficLight {
    // TODO: new, advance, name
}

fn main() {
    // TODO
}`,
    tags: ['state-pattern', 'trait-objects'],
  },
  {
    id: 'rs-ch17-c-065',
    chapter: 17,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Screen Owning and Running Mixed Components',
    prompt: `Extend the GUI example so \`Screen\` can be built incrementally and report a summary. Trait \`Draw\` has \`draw(&self) -> String\`. \`Screen\` holds \`components: Vec<Box<dyn Draw>>\` and has:
- \`new()\`.
- \`add(&mut self, c: Box<dyn Draw>)\`.
- \`run(&self) -> Vec<String>\` returning each component's drawn string.
- \`count(&self) -> usize\`.

Implement \`Draw\` for \`Button { label: String }\` (returns \`[<label>]\`) and \`Checkbox { checked: bool }\` (returns \`[x]\` if checked else \`[ ]\`). In \`main\`, add a Button "Go" and a checked Checkbox, print each run() line, then print count(). Output:
[Go]
[x]
2`,
    hints: [
      'Store boxed trait objects and push in \`add\`.',
      '\`run\` collects \`draw()\` results into a \`Vec<String>\`.',
    ],
    solution: `trait Draw {
    fn draw(&self) -> String;
}

struct Screen {
    components: Vec<Box<dyn Draw>>,
}

impl Screen {
    fn new() -> Screen {
        Screen { components: Vec::new() }
    }
    fn add(&mut self, c: Box<dyn Draw>) {
        self.components.push(c);
    }
    fn run(&self) -> Vec<String> {
        let mut out = Vec::new();
        for c in &self.components {
            out.push(c.draw());
        }
        out
    }
    fn count(&self) -> usize {
        self.components.len()
    }
}

struct Button { label: String }
struct Checkbox { checked: bool }

impl Draw for Button {
    fn draw(&self) -> String {
        format!("[{}]", self.label)
    }
}
impl Draw for Checkbox {
    fn draw(&self) -> String {
        if self.checked { String::from("[x]") } else { String::from("[ ]") }
    }
}

fn main() {
    let mut screen = Screen::new();
    screen.add(Box::new(Button { label: String::from("Go") }));
    screen.add(Box::new(Checkbox { checked: true }));
    for line in screen.run() {
        println!("{}", line);
    }
    println!("{}", screen.count());
}`,
    starter: `trait Draw {
    fn draw(&self) -> String;
}

struct Screen {
    components: Vec<Box<dyn Draw>>,
}

impl Screen {
    // TODO: new, add, run, count
}

struct Button { label: String }
struct Checkbox { checked: bool }

// TODO: impls

fn main() {
    // TODO
}`,
    tags: ['trait-objects', 'gui'],
  },
  {
    id: 'rs-ch17-c-066',
    chapter: 17,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Object Safety: Split the Generic Method Out',
    prompt: `A trait with a generic method is NOT object safe and cannot be made into \`dyn Trait\`. Here is a trait that fails:

trait Store {
    fn put<T>(&mut self, value: T);
}

Redesign so you CAN use trait objects. Define an object-safe trait \`IntStore\` with \`put(&mut self, value: i32)\` and \`get(&self, i: usize) -> i32\`. Implement it for \`VecStore { data: Vec<i32> }\`. Then store a \`Box<dyn IntStore>\`, put 10 and 20, and print \`get(1)\`. Output: \`20\`.`,
    hints: [
      'Generic methods break object safety because each instantiation needs a different vtable entry.',
      'Fix it by committing to a concrete element type (here \`i32\`) instead of a type parameter.',
    ],
    solution: `trait IntStore {
    fn put(&mut self, value: i32);
    fn get(&self, i: usize) -> i32;
}

struct VecStore {
    data: Vec<i32>,
}

impl IntStore for VecStore {
    fn put(&mut self, value: i32) {
        self.data.push(value);
    }
    fn get(&self, i: usize) -> i32 {
        self.data[i]
    }
}

fn main() {
    let mut store: Box<dyn IntStore> = Box::new(VecStore { data: Vec::new() });
    store.put(10);
    store.put(20);
    println!("{}", store.get(1));
}`,
    starter: `trait IntStore {
    fn put(&mut self, value: i32);
    fn get(&self, i: usize) -> i32;
}

struct VecStore {
    data: Vec<i32>,
}

// TODO: impl IntStore for VecStore

fn main() {
    let mut store: Box<dyn IntStore> = Box::new(VecStore { data: Vec::new() });
    // TODO: put 10, put 20, print get(1)
}`,
    tags: ['object-safety', 'trait-objects'],
  },
  {
    id: 'rs-ch17-c-067',
    chapter: 17,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Object Safety: Move Self-Returning Method to an Extension',
    prompt: `A method returning \`Self\` makes a trait NOT object safe (the size of \`Self\` is unknown behind \`dyn\`). Start from a trait whose self-returning method blocks trait objects, and redesign.

Define an object-safe trait \`Counter\` with only \`value(&self) -> i32\`. Provide a SEPARATE generic free function \`doubled<T: Counter>(c: &T) -> i32\` (static dispatch) that returns \`c.value() * 2\`. Implement \`Counter\` for \`Tally { n: i32 }\`. In \`main\`, store a \`Box<dyn Counter>\` over a \`Tally { n: 5 }\`, print its \`value()\`, and separately call \`doubled\` on a concrete \`Tally { n: 5 }\`. Output:
5
10`,
    hints: [
      'Keep \`Self\`-returning or generic operations OUT of the object-safe trait.',
      'Free generic functions can still operate on concrete types via a trait bound.',
    ],
    solution: `trait Counter {
    fn value(&self) -> i32;
}

struct Tally { n: i32 }

impl Counter for Tally {
    fn value(&self) -> i32 { self.n }
}

fn doubled<T: Counter>(c: &T) -> i32 {
    c.value() * 2
}

fn main() {
    let boxed: Box<dyn Counter> = Box::new(Tally { n: 5 });
    println!("{}", boxed.value());
    let t = Tally { n: 5 };
    println!("{}", doubled(&t));
}`,
    starter: `trait Counter {
    fn value(&self) -> i32;
}

struct Tally { n: i32 }

// TODO: impl Counter for Tally

fn doubled<T: Counter>(c: &T) -> i32 {
    // TODO
}

fn main() {
    let boxed: Box<dyn Counter> = Box::new(Tally { n: 5 });
    // TODO: print value(), then doubled on a concrete Tally
}`,
    tags: ['object-safety', 'generics'],
  },
  {
    id: 'rs-ch17-c-068',
    chapter: 17,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Event Bus With Subscriber Trait Objects',
    prompt: `Build a tiny event bus. Trait \`Subscriber\` has \`on_event(&mut self, value: i32)\` and \`report(&self) -> i32\`. Implement:
- \`Sink { last: i32 }\` storing the most recent value as \`last\`.
- \`Counter { count: i32 }\` incrementing \`count\` on each event.

Define \`Bus\` with \`subscribers: Vec<Box<dyn Subscriber>>\`, plus \`new()\`, \`subscribe(&mut self, s: Box<dyn Subscriber>)\`, and \`publish(&mut self, value: i32)\` that forwards the value to all subscribers. In \`main\`: subscribe a \`Sink { last: 0 }\` and a \`Counter { count: 0 }\`, publish 7 then 9, then print each subscriber's \`report()\`. Output:
9
2`,
    hints: [
      '\`publish\` needs \`&mut self\` and iterates \`&mut self.subscribers\`.',
      'The Sink reports its last value (9); the Counter reports how many events it saw (2).',
    ],
    solution: `trait Subscriber {
    fn on_event(&mut self, value: i32);
    fn report(&self) -> i32;
}

struct Sink { last: i32 }
struct Counter { count: i32 }

impl Subscriber for Sink {
    fn on_event(&mut self, value: i32) { self.last = value; }
    fn report(&self) -> i32 { self.last }
}
impl Subscriber for Counter {
    fn on_event(&mut self, _value: i32) { self.count += 1; }
    fn report(&self) -> i32 { self.count }
}

struct Bus {
    subscribers: Vec<Box<dyn Subscriber>>,
}

impl Bus {
    fn new() -> Bus {
        Bus { subscribers: Vec::new() }
    }
    fn subscribe(&mut self, s: Box<dyn Subscriber>) {
        self.subscribers.push(s);
    }
    fn publish(&mut self, value: i32) {
        for s in &mut self.subscribers {
            s.on_event(value);
        }
    }
}

fn main() {
    let mut bus = Bus::new();
    bus.subscribe(Box::new(Sink { last: 0 }));
    bus.subscribe(Box::new(Counter { count: 0 }));
    bus.publish(7);
    bus.publish(9);
    for s in &bus.subscribers {
        println!("{}", s.report());
    }
}`,
    starter: `trait Subscriber {
    fn on_event(&mut self, value: i32);
    fn report(&self) -> i32;
}

struct Sink { last: i32 }
struct Counter { count: i32 }

// TODO: impls

struct Bus {
    subscribers: Vec<Box<dyn Subscriber>>,
}

impl Bus {
    // TODO: new, subscribe, publish
}

fn main() {
    // TODO
}`,
    tags: ['trait-objects', 'mutation'],
  },
  {
    id: 'rs-ch17-c-069',
    chapter: 17,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Typestate Builder Requiring a Name',
    prompt: `Use the typestate pattern to make a builder that CANNOT be finished without a name. Define \`Unnamed\` (no name yet) and \`Named { name: String }\`.
- \`Unnamed::new()\` returns an \`Unnamed\`.
- \`Unnamed::name(self, name: &str) -> Named\` supplies the name.
- \`Named::build(self) -> Config\` produces the final \`Config { name: String }\`.

There is intentionally no \`build\` on \`Unnamed\`, so forgetting the name is a compile error. In \`main\`, build a config from \`Unnamed::new().name("svc").build()\` and print \`config.name\`. Output:
svc`,
    hints: [
      '\`name\` consumes the \`Unnamed\` and returns a \`Named\` carrying the string.',
      'Only \`Named\` has \`build\`, so the workflow is enforced by types.',
    ],
    solution: `struct Unnamed;

struct Named {
    name: String,
}

struct Config {
    name: String,
}

impl Unnamed {
    fn new() -> Unnamed {
        Unnamed
    }
    fn name(self, name: &str) -> Named {
        Named { name: name.to_string() }
    }
}

impl Named {
    fn build(self) -> Config {
        Config { name: self.name }
    }
}

fn main() {
    let config = Unnamed::new().name("svc").build();
    println!("{}", config.name);
}`,
    starter: `struct Unnamed;

struct Named {
    name: String,
}

struct Config {
    name: String,
}

// TODO: Unnamed::new, Unnamed::name -> Named, Named::build -> Config

fn main() {
    // TODO
}`,
    tags: ['typestate', 'builder'],
  },
  {
    id: 'rs-ch17-c-070',
    chapter: 17,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Compare OOP Inheritance to Rust Traits in Code',
    prompt: `In an OOP language a base class \`Shape\` might define a shared \`describe()\` and subclasses override \`area()\`. Rust has no inheritance, so model this with a trait that has BOTH a required method and a default method using it.

Define a trait \`Shape\` with required \`area(&self) -> f64\` and a DEFAULT \`describe(&self) -> String\` returning \`area = <area>\`. Implement \`Shape\` for \`Circle { r: f64 }\` (area \`3.14 * r * r\`) and \`Rectangle { w: f64, h: f64 }\` (area \`w * h\`, and OVERRIDE \`describe\` to return \`rect <w>x<h> -> <area>\`).

Store both in a \`Vec<Box<dyn Shape>>\` and print each \`describe()\`. For \`Circle { r: 1.0 }\` and \`Rectangle { w: 2.0, h: 3.0 }\` the output is:
area = 3.14
rect 2x3 -> 6`,
    hints: [
      'The default \`describe\` plays the role of inherited base-class behavior.',
      'An implementor can override the default, like a subclass overriding a method.',
    ],
    solution: `trait Shape {
    fn area(&self) -> f64;

    fn describe(&self) -> String {
        format!("area = {}", self.area())
    }
}

struct Circle { r: f64 }
struct Rectangle { w: f64, h: f64 }

impl Shape for Circle {
    fn area(&self) -> f64 {
        3.14 * self.r * self.r
    }
}

impl Shape for Rectangle {
    fn area(&self) -> f64 {
        self.w * self.h
    }
    fn describe(&self) -> String {
        format!("rect {}x{} -> {}", self.w, self.h, self.area())
    }
}

fn main() {
    let shapes: Vec<Box<dyn Shape>> = vec![
        Box::new(Circle { r: 1.0 }),
        Box::new(Rectangle { w: 2.0, h: 3.0 }),
    ];
    for s in &shapes {
        println!("{}", s.describe());
    }
}`,
    starter: `trait Shape {
    fn area(&self) -> f64;
    // TODO: default describe using area
}

struct Circle { r: f64 }
struct Rectangle { w: f64, h: f64 }

// TODO: impls (override describe for Rectangle)

fn main() {
    // TODO
}`,
    tags: ['traits', 'inheritance', 'default-methods'],
  },
]

export default problems
