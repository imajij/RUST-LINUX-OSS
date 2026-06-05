import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch17-c-001',
    chapter: 17,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Struct Holds Data and Behavior',
    prompt: `Objects, in the OOP sense, bundle data together with the operations on that data. In Rust a struct plus an \`impl\` block does the same.

Define a struct \`Counter\` with one \`u32\` field named \`value\`. Give it a method \`increment(&mut self)\` that adds 1 to \`value\`, and a method \`get(&self) -> u32\` that returns \`value\`.

In \`main\`, create a \`Counter\` starting at 0, call \`increment\` three times, then print \`get()\`. The output should be \`3\`.`,
    hints: [
      'Data lives in the struct fields; behavior lives in methods inside an impl block.',
      'A method that changes the struct takes \`&mut self\`; one that only reads takes \`&self\`.',
    ],
    solution: `struct Counter {
    value: u32,
}

impl Counter {
    fn increment(&mut self) {
        self.value += 1;
    }

    fn get(&self) -> u32 {
        self.value
    }
}

fn main() {
    let mut c = Counter { value: 0 };
    c.increment();
    c.increment();
    c.increment();
    println!("{}", c.get());
}`,
    starter: `struct Counter {
    value: u32,
}

impl Counter {
    // TODO: increment and get
}

fn main() {
    // TODO: create a Counter, increment three times, print get()
}`,
    tags: ['oop', 'struct', 'methods'],
  },
  {
    id: 'rs-ch17-c-002',
    chapter: 17,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Private Field, Public API',
    prompt: `Encapsulation means hiding internal data behind a public interface. In Rust, fields are private by default, so code outside the module can only touch them through public methods.

In a module \`bank\`, define a public struct \`Account\` with a private field \`balance: u32\`. Provide a public associated function \`new() -> Account\` that starts the balance at 0, a public method \`deposit(&mut self, amount: u32)\`, and a public method \`balance(&self) -> u32\`.

In \`main\`, create an account, deposit 50, then deposit 25, and print the balance. The output should be \`75\`.`,
    hints: [
      'Mark the struct \`pub struct Account\` but leave the field without \`pub\` so it stays private.',
      'Outside the module you cannot write \`account.balance\` directly; you must call the method.',
    ],
    solution: `mod bank {
    pub struct Account {
        balance: u32,
    }

    impl Account {
        pub fn new() -> Account {
            Account { balance: 0 }
        }

        pub fn deposit(&mut self, amount: u32) {
            self.balance += amount;
        }

        pub fn balance(&self) -> u32 {
            self.balance
        }
    }
}

fn main() {
    let mut account = bank::Account::new();
    account.deposit(50);
    account.deposit(25);
    println!("{}", account.balance());
}`,
    starter: `mod bank {
    pub struct Account {
        balance: u32,
    }

    impl Account {
        // TODO: new, deposit, balance
    }
}

fn main() {
    // TODO: create account, deposit 50 then 25, print balance
}`,
    tags: ['oop', 'encapsulation', 'modules'],
  },
  {
    id: 'rs-ch17-c-003',
    chapter: 17,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Define a Trait With One Method',
    prompt: `A trait describes shared behavior. Define a trait \`Greet\` with a single method \`hello(&self) -> String\`.

Implement \`Greet\` for a struct \`Dog\` so that \`hello\` returns the \`String\` \`"woof"\`.

In \`main\`, create a \`Dog\` and print the result of calling \`hello()\`. The output should be \`woof\`.`,
    hints: [
      'A trait is declared with \`trait Greet { fn hello(&self) -> String; }\`.',
      'Use \`impl Greet for Dog\` to provide the method body.',
      'Turn a string literal into a String with \`.to_string()\` or \`String::from(...)\`.',
    ],
    solution: `trait Greet {
    fn hello(&self) -> String;
}

struct Dog;

impl Greet for Dog {
    fn hello(&self) -> String {
        String::from("woof")
    }
}

fn main() {
    let d = Dog;
    println!("{}", d.hello());
}`,
    starter: `trait Greet {
    fn hello(&self) -> String;
}

struct Dog;

// TODO: impl Greet for Dog

fn main() {
    // TODO: create a Dog and print hello()
}`,
    tags: ['traits', 'basics'],
  },
  {
    id: 'rs-ch17-c-004',
    chapter: 17,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Two Implementors of One Trait',
    prompt: `Define a trait \`Sound\` with a method \`make(&self) -> String\`.

Implement it for two unit structs: \`Cat\` returns \`"meow"\` and \`Cow\` returns \`"moo"\`.

In \`main\`, create one of each and print both sounds, each on its own line. The output should be:
meow
moo`,
    hints: [
      'You write one \`impl Sound for ...\` block per type.',
      'Both blocks satisfy the same trait but provide different bodies.',
    ],
    solution: `trait Sound {
    fn make(&self) -> String;
}

struct Cat;
struct Cow;

impl Sound for Cat {
    fn make(&self) -> String {
        String::from("meow")
    }
}

impl Sound for Cow {
    fn make(&self) -> String {
        String::from("moo")
    }
}

fn main() {
    let c = Cat;
    let k = Cow;
    println!("{}", c.make());
    println!("{}", k.make());
}`,
    starter: `trait Sound {
    fn make(&self) -> String;
}

struct Cat;
struct Cow;

// TODO: impl Sound for Cat and for Cow

fn main() {
    // TODO: print both sounds
}`,
    tags: ['traits', 'implementors'],
  },
  {
    id: 'rs-ch17-c-005',
    chapter: 17,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Trait Default Method',
    prompt: `Rust has no inheritance, but trait default methods let many types share an implementation. Define a trait \`Describable\` with a default method \`describe(&self) -> String\` that returns the \`String\` \`"a thing"\`.

Implement \`Describable\` for an empty struct \`Rock\` without overriding \`describe\`.

In \`main\`, create a \`Rock\` and print \`describe()\`. The output should be \`a thing\`.`,
    hints: [
      'A default method has a body right inside the trait definition.',
      'An empty impl block \`impl Describable for Rock {}\` is enough to opt in.',
    ],
    solution: `trait Describable {
    fn describe(&self) -> String {
        String::from("a thing")
    }
}

struct Rock;

impl Describable for Rock {}

fn main() {
    let r = Rock;
    println!("{}", r.describe());
}`,
    starter: `trait Describable {
    // TODO: default method describe returning "a thing"
}

struct Rock;

// TODO: empty impl for Rock

fn main() {
    // TODO: create a Rock and print describe()
}`,
    tags: ['traits', 'default-method'],
  },
  {
    id: 'rs-ch17-c-006',
    chapter: 17,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Override a Default Method',
    prompt: `Define a trait \`Animal\` with a default method \`legs(&self) -> u32\` that returns 4.

Implement \`Animal\` for \`Bird\` and override \`legs\` to return 2. Implement \`Animal\` for \`Horse\` without overriding (keep the default).

In \`main\`, print \`Bird.legs()\` then \`Horse.legs()\`, each on its own line. The output should be:
2
4`,
    hints: [
      'Providing the method in the impl block replaces the default.',
      'Leaving the impl block empty keeps the default.',
    ],
    solution: `trait Animal {
    fn legs(&self) -> u32 {
        4
    }
}

struct Bird;
struct Horse;

impl Animal for Bird {
    fn legs(&self) -> u32 {
        2
    }
}

impl Animal for Horse {}

fn main() {
    let b = Bird;
    let h = Horse;
    println!("{}", b.legs());
    println!("{}", h.legs());
}`,
    starter: `trait Animal {
    fn legs(&self) -> u32 {
        4
    }
}

struct Bird;
struct Horse;

// TODO: impl Animal for Bird (override) and Horse (default)

fn main() {
    // TODO: print both leg counts
}`,
    tags: ['traits', 'default-method', 'override'],
  },
  {
    id: 'rs-ch17-c-007',
    chapter: 17,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Reference to a Trait Object',
    prompt: `A trait object lets us call trait methods without knowing the concrete type at compile time. Write a free function \`announce(item: &dyn Sound)\` that prints what \`item.make()\` returns.

The trait \`Sound\` has \`fn make(&self) -> String\`. Implement it for \`Bell\` returning \`"ding"\`.

In \`main\`, create a \`Bell\` and call \`announce(&bell)\`. The output should be \`ding\`.`,
    hints: [
      'A reference to a trait object is written \`&dyn Sound\`.',
      'Inside the function you can call \`item.make()\` even though the concrete type is hidden.',
    ],
    solution: `trait Sound {
    fn make(&self) -> String;
}

struct Bell;

impl Sound for Bell {
    fn make(&self) -> String {
        String::from("ding")
    }
}

fn announce(item: &dyn Sound) {
    println!("{}", item.make());
}

fn main() {
    let bell = Bell;
    announce(&bell);
}`,
    starter: `trait Sound {
    fn make(&self) -> String;
}

struct Bell;

// TODO: impl Sound for Bell

fn announce(item: &dyn Sound) {
    // TODO: print item.make()
}

fn main() {
    let bell = Bell;
    announce(&bell);
}`,
    tags: ['trait-objects', 'dyn'],
  },
  {
    id: 'rs-ch17-c-008',
    chapter: 17,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Boxed Trait Object',
    prompt: `Define a trait \`Shape\` with \`fn area(&self) -> f64\`. Implement it for a struct \`Square\` with a field \`side: f64\` so \`area\` returns \`side * side\`.

In \`main\`, store a \`Square { side: 3.0 }\` in a variable of type \`Box<dyn Shape>\`, then print its area. The output should be \`9\`.`,
    hints: [
      'A boxed trait object has type \`Box<dyn Shape>\`.',
      'Create it with \`let s: Box<dyn Shape> = Box::new(Square { side: 3.0 });\`.',
      'You can call \`s.area()\` through the box.',
    ],
    solution: `trait Shape {
    fn area(&self) -> f64;
}

struct Square {
    side: f64,
}

impl Shape for Square {
    fn area(&self) -> f64 {
        self.side * self.side
    }
}

fn main() {
    let s: Box<dyn Shape> = Box::new(Square { side: 3.0 });
    println!("{}", s.area());
}`,
    starter: `trait Shape {
    fn area(&self) -> f64;
}

struct Square {
    side: f64,
}

// TODO: impl Shape for Square

fn main() {
    // TODO: store Square in a Box<dyn Shape> and print area
}`,
    tags: ['trait-objects', 'box'],
  },
  {
    id: 'rs-ch17-c-009',
    chapter: 17,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Static Dispatch With a Generic',
    prompt: `Generic functions use static dispatch: the compiler generates a specialized version for each concrete type. Write a function \`describe<T: Named>(item: &T)\` that prints \`item.name()\`.

The trait \`Named\` has \`fn name(&self) -> String\`. Implement it for \`Robot\` returning \`"R2"\`.

In \`main\`, create a \`Robot\` and call \`describe(&robot)\`. The output should be \`R2\`.`,
    hints: [
      'A trait bound on a generic looks like \`fn describe<T: Named>(item: &T)\`.',
      'This is different from \`&dyn Named\`: here the type is known at compile time.',
    ],
    solution: `trait Named {
    fn name(&self) -> String;
}

struct Robot;

impl Named for Robot {
    fn name(&self) -> String {
        String::from("R2")
    }
}

fn describe<T: Named>(item: &T) {
    println!("{}", item.name());
}

fn main() {
    let robot = Robot;
    describe(&robot);
}`,
    starter: `trait Named {
    fn name(&self) -> String;
}

struct Robot;

// TODO: impl Named for Robot

fn describe<T: Named>(item: &T) {
    // TODO: print item.name()
}

fn main() {
    let robot = Robot;
    describe(&robot);
}`,
    tags: ['traits', 'generics', 'static-dispatch'],
  },
  {
    id: 'rs-ch17-c-010',
    chapter: 17,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Getter Over a Private Field',
    prompt: `Encapsulation often means exposing a read-only view of internal data. Define a struct \`Temperature\` with a private field \`celsius: f64\`.

Provide a public \`new(celsius: f64) -> Temperature\` and a public getter \`celsius(&self) -> f64\`. There is no setter, so the value cannot change after creation.

In \`main\`, create \`Temperature::new(21.5)\` and print its \`celsius()\`. The output should be \`21.5\`.`,
    hints: [
      'A getter is just a \`&self\` method that returns the field.',
      'Without a setter or public field, callers cannot mutate the stored value.',
    ],
    solution: `struct Temperature {
    celsius: f64,
}

impl Temperature {
    fn new(celsius: f64) -> Temperature {
        Temperature { celsius }
    }

    fn celsius(&self) -> f64 {
        self.celsius
    }
}

fn main() {
    let t = Temperature::new(21.5);
    println!("{}", t.celsius());
}`,
    starter: `struct Temperature {
    celsius: f64,
}

impl Temperature {
    // TODO: new and celsius getter
}

fn main() {
    // TODO: create Temperature::new(21.5) and print celsius()
}`,
    tags: ['encapsulation', 'getter'],
  },
  {
    id: 'rs-ch17-c-011',
    chapter: 17,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Trait Method Returning a Number',
    prompt: `Define a trait \`Score\` with \`fn points(&self) -> i32\`. Implement it for \`Gem\` returning 10 and for \`Coin\` returning 1.

In \`main\`, create one of each and print the sum of their points. The output should be \`11\`.`,
    hints: [
      'Each implementor returns its own value from \`points\`.',
      'Add the two method results before printing.',
    ],
    solution: `trait Score {
    fn points(&self) -> i32;
}

struct Gem;
struct Coin;

impl Score for Gem {
    fn points(&self) -> i32 {
        10
    }
}

impl Score for Coin {
    fn points(&self) -> i32 {
        1
    }
}

fn main() {
    let g = Gem;
    let c = Coin;
    println!("{}", g.points() + c.points());
}`,
    starter: `trait Score {
    fn points(&self) -> i32;
}

struct Gem;
struct Coin;

// TODO: impl Score for Gem (10) and Coin (1)

fn main() {
    // TODO: print the sum of points
}`,
    tags: ['traits', 'implementors'],
  },
  {
    id: 'rs-ch17-c-012',
    chapter: 17,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Method That Consumes Self',
    prompt: `Some transitions return a brand-new value and use up the old one. Define a struct \`Door\` with a private \`bool\` field \`open\`.

Provide \`closed() -> Door\` that builds a door with \`open: false\`, and a method \`open(self) -> Door\` that takes \`self\` by value and returns a new \`Door\` with \`open: true\`. Add a getter \`is_open(&self) -> bool\`.

In \`main\`, create a closed door, call \`open()\` to get a new door, and print \`is_open()\`. The output should be \`true\`.`,
    hints: [
      'A method taking \`self\` (not \`&self\`) moves the value, consuming the old one.',
      'Return a freshly built \`Door\` from \`open\`.',
    ],
    solution: `struct Door {
    open: bool,
}

impl Door {
    fn closed() -> Door {
        Door { open: false }
    }

    fn open(self) -> Door {
        Door { open: true }
    }

    fn is_open(&self) -> bool {
        self.open
    }
}

fn main() {
    let d = Door::closed();
    let d = d.open();
    println!("{}", d.is_open());
}`,
    starter: `struct Door {
    open: bool,
}

impl Door {
    // TODO: closed, open(self) -> Door, is_open
}

fn main() {
    // TODO: build a closed door, open it, print is_open()
}`,
    tags: ['ownership', 'consume-self', 'state'],
  },
  {
    id: 'rs-ch17-c-013',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Vec of Boxed Trait Objects',
    prompt: `Trait objects let a single collection hold values of different concrete types. Define a trait \`Draw\` with \`fn draw(&self) -> String\`.

Implement it for \`Button\` (returns \`"button"\`) and \`Checkbox\` (returns \`"checkbox"\`).

In \`main\`, build a \`Vec<Box<dyn Draw>>\` containing one \`Button\` and one \`Checkbox\`, then loop over it and print each \`draw()\` result on its own line. The output should be:
button
checkbox`,
    hints: [
      'The vector element type is \`Box<dyn Draw>\`.',
      'Push \`Box::new(Button)\` and \`Box::new(Checkbox)\`.',
      'Iterate with \`for item in &components\` and call \`item.draw()\`.',
    ],
    solution: `trait Draw {
    fn draw(&self) -> String;
}

struct Button;
struct Checkbox;

impl Draw for Button {
    fn draw(&self) -> String {
        String::from("button")
    }
}

impl Draw for Checkbox {
    fn draw(&self) -> String {
        String::from("checkbox")
    }
}

fn main() {
    let components: Vec<Box<dyn Draw>> = vec![Box::new(Button), Box::new(Checkbox)];
    for item in &components {
        println!("{}", item.draw());
    }
}`,
    starter: `trait Draw {
    fn draw(&self) -> String;
}

struct Button;
struct Checkbox;

// TODO: impl Draw for both

fn main() {
    // TODO: build Vec<Box<dyn Draw>> and print each draw()
}`,
    tags: ['trait-objects', 'vec', 'gui'],
  },
  {
    id: 'rs-ch17-c-014',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Screen That Runs Components',
    prompt: `Recreate the book's GUI example in miniature. Define a trait \`Draw\` with \`fn draw(&self) -> String\`.

Define a struct \`Screen\` with a field \`components: Vec<Box<dyn Draw>>\` and a method \`run(&self)\` that prints each component's \`draw()\` output on its own line.

Implement \`Draw\` for \`Label\` (a struct with a \`text: String\` field) so \`draw\` returns a clone of \`text\`. In \`main\`, build a \`Screen\` with two labels \`"A"\` and \`"B"\` and call \`run()\`. The output should be:
A
B`,
    hints: [
      'Store the heterogeneous components as \`Vec<Box<dyn Draw>>\`.',
      'In \`run\`, loop over \`&self.components\` and print \`c.draw()\`.',
      'For \`Label::draw\`, return \`self.text.clone()\`.',
    ],
    solution: `trait Draw {
    fn draw(&self) -> String;
}

struct Screen {
    components: Vec<Box<dyn Draw>>,
}

impl Screen {
    fn run(&self) {
        for c in &self.components {
            println!("{}", c.draw());
        }
    }
}

struct Label {
    text: String,
}

impl Draw for Label {
    fn draw(&self) -> String {
        self.text.clone()
    }
}

fn main() {
    let screen = Screen {
        components: vec![
            Box::new(Label { text: String::from("A") }),
            Box::new(Label { text: String::from("B") }),
        ],
    };
    screen.run();
}`,
    starter: `trait Draw {
    fn draw(&self) -> String;
}

struct Screen {
    components: Vec<Box<dyn Draw>>,
}

impl Screen {
    fn run(&self) {
        // TODO: print each component's draw()
    }
}

struct Label {
    text: String,
}

// TODO: impl Draw for Label

fn main() {
    // TODO: build a Screen with two labels and run it
}`,
    tags: ['trait-objects', 'gui', 'vec'],
  },
  {
    id: 'rs-ch17-c-015',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Mix Concrete Types in One Vector',
    prompt: `Define a trait \`Area\` with \`fn area(&self) -> f64\`. Implement it for \`Circle\` (field \`r: f64\`, area \`3.0 * r * r\`) and \`Rect\` (fields \`w: f64\` and \`h: f64\`, area \`w * h\`).

In \`main\`, place a \`Circle { r: 2.0 }\` and a \`Rect { w: 2.0, h: 5.0 }\` into a \`Vec<Box<dyn Area>>\`, sum all the areas, and print the total. The output should be \`22\`.`,
    hints: [
      'Use 3.0 as a stand-in for pi so the math stays exact.',
      'Accumulate into a mutable \`f64\` total while iterating.',
    ],
    solution: `trait Area {
    fn area(&self) -> f64;
}

struct Circle {
    r: f64,
}

struct Rect {
    w: f64,
    h: f64,
}

impl Area for Circle {
    fn area(&self) -> f64 {
        3.0 * self.r * self.r
    }
}

impl Area for Rect {
    fn area(&self) -> f64 {
        self.w * self.h
    }
}

fn main() {
    let shapes: Vec<Box<dyn Area>> = vec![
        Box::new(Circle { r: 2.0 }),
        Box::new(Rect { w: 2.0, h: 5.0 }),
    ];
    let mut total = 0.0;
    for s in &shapes {
        total += s.area();
    }
    println!("{}", total);
}`,
    starter: `trait Area {
    fn area(&self) -> f64;
}

struct Circle {
    r: f64,
}

struct Rect {
    w: f64,
    h: f64,
}

// TODO: impl Area for Circle and Rect

fn main() {
    // TODO: sum areas of a Circle and a Rect in a Vec<Box<dyn Area>>
}`,
    tags: ['trait-objects', 'vec', 'shapes'],
  },
  {
    id: 'rs-ch17-c-016',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Dynamic vs Static Dispatch, Same Trait',
    prompt: `Define a trait \`Speak\` with \`fn say(&self) -> String\`. Implement it for \`Fox\` returning \`"ring"\`.

Write two functions that both print \`item.say()\`:
- \`shout_static<T: Speak>(item: &T)\` using a generic (static dispatch)
- \`shout_dynamic(item: &dyn Speak)\` using a trait object (dynamic dispatch)

In \`main\`, create a \`Fox\` and call both functions with it. The output should be:
ring
ring`,
    hints: [
      'The generic version is monomorphized per type; the trait-object version uses a vtable at runtime.',
      'Both call sites use the same \`&fox\` argument.',
    ],
    solution: `trait Speak {
    fn say(&self) -> String;
}

struct Fox;

impl Speak for Fox {
    fn say(&self) -> String {
        String::from("ring")
    }
}

fn shout_static<T: Speak>(item: &T) {
    println!("{}", item.say());
}

fn shout_dynamic(item: &dyn Speak) {
    println!("{}", item.say());
}

fn main() {
    let fox = Fox;
    shout_static(&fox);
    shout_dynamic(&fox);
}`,
    starter: `trait Speak {
    fn say(&self) -> String;
}

struct Fox;

// TODO: impl Speak for Fox

fn shout_static<T: Speak>(item: &T) {
    // TODO
}

fn shout_dynamic(item: &dyn Speak) {
    // TODO
}

fn main() {
    let fox = Fox;
    shout_static(&fox);
    shout_dynamic(&fox);
}`,
    tags: ['dispatch', 'generics', 'trait-objects'],
  },
  {
    id: 'rs-ch17-c-017',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Return a Boxed Trait Object',
    prompt: `A function can hide which concrete type it returns by returning a boxed trait object. Define a trait \`Tool\` with \`fn use_it(&self) -> String\`. Implement it for \`Hammer\` (returns \`"bang"\`) and \`Saw\` (returns \`"zzz"\`).

Write \`fn pick(kind: &str) -> Box<dyn Tool>\` that returns a boxed \`Hammer\` when \`kind\` is \`"hammer"\` and a boxed \`Saw\` otherwise.

In \`main\`, call \`pick("hammer")\` and \`pick("saw")\` and print each tool's \`use_it()\`. The output should be:
bang
zzz`,
    hints: [
      'Each arm of the if/else returns \`Box::new(...)\` of a different type, but both are \`Box<dyn Tool>\`.',
      'The boxes let the two branches share one return type.',
    ],
    solution: `trait Tool {
    fn use_it(&self) -> String;
}

struct Hammer;
struct Saw;

impl Tool for Hammer {
    fn use_it(&self) -> String {
        String::from("bang")
    }
}

impl Tool for Saw {
    fn use_it(&self) -> String {
        String::from("zzz")
    }
}

fn pick(kind: &str) -> Box<dyn Tool> {
    if kind == "hammer" {
        Box::new(Hammer)
    } else {
        Box::new(Saw)
    }
}

fn main() {
    println!("{}", pick("hammer").use_it());
    println!("{}", pick("saw").use_it());
}`,
    starter: `trait Tool {
    fn use_it(&self) -> String;
}

struct Hammer;
struct Saw;

// TODO: impl Tool for both

fn pick(kind: &str) -> Box<dyn Tool> {
    // TODO: return a boxed Hammer or Saw
}

fn main() {
    println!("{}", pick("hammer").use_it());
    println!("{}", pick("saw").use_it());
}`,
    tags: ['trait-objects', 'box', 'return-type'],
  },
  {
    id: 'rs-ch17-c-018',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Trait Object Slice Parameter',
    prompt: `Define a trait \`Loud\` with \`fn volume(&self) -> u32\`. Implement it for \`Drum\` (returns 9) and \`Flute\` (returns 3).

Write \`fn loudest(items: &[Box<dyn Loud>]) -> u32\` that returns the largest \`volume()\` among the items (the slice is never empty).

In \`main\`, build a \`Vec<Box<dyn Loud>>\` with a \`Drum\` and a \`Flute\`, pass it to \`loudest\`, and print the result. The output should be \`9\`.`,
    hints: [
      'A \`Vec<Box<dyn Loud>>\` coerces to a \`&[Box<dyn Loud>]\` slice.',
      'Track a running maximum while iterating.',
    ],
    solution: `trait Loud {
    fn volume(&self) -> u32;
}

struct Drum;
struct Flute;

impl Loud for Drum {
    fn volume(&self) -> u32 {
        9
    }
}

impl Loud for Flute {
    fn volume(&self) -> u32 {
        3
    }
}

fn loudest(items: &[Box<dyn Loud>]) -> u32 {
    let mut max = 0;
    for item in items {
        let v = item.volume();
        if v > max {
            max = v;
        }
    }
    max
}

fn main() {
    let band: Vec<Box<dyn Loud>> = vec![Box::new(Drum), Box::new(Flute)];
    println!("{}", loudest(&band));
}`,
    starter: `trait Loud {
    fn volume(&self) -> u32;
}

struct Drum;
struct Flute;

// TODO: impl Loud for Drum and Flute

fn loudest(items: &[Box<dyn Loud>]) -> u32 {
    // TODO: return the largest volume
}

fn main() {
    let band: Vec<Box<dyn Loud>> = vec![Box::new(Drum), Box::new(Flute)];
    println!("{}", loudest(&band));
}`,
    tags: ['trait-objects', 'slice', 'vec'],
  },
  {
    id: 'rs-ch17-c-019',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Default Method Calling a Required Method',
    prompt: `Trait default methods can call other methods of the same trait. Define a trait \`Summary\` with a required method \`headline(&self) -> String\` and a default method \`preview(&self) -> String\` that returns \`format!("Read more: {}", self.headline())\`.

Implement \`Summary\` for \`Article\` (a struct with field \`title: String\`) so \`headline\` returns a clone of \`title\`. Do not override \`preview\`.

In \`main\`, build an \`Article\` with title \`"Rust"\` and print its \`preview()\`. The output should be \`Read more: Rust\`.`,
    hints: [
      'The default \`preview\` relies on whatever \`headline\` each type provides.',
      'You only need to implement \`headline\` in the impl block.',
    ],
    solution: `trait Summary {
    fn headline(&self) -> String;

    fn preview(&self) -> String {
        format!("Read more: {}", self.headline())
    }
}

struct Article {
    title: String,
}

impl Summary for Article {
    fn headline(&self) -> String {
        self.title.clone()
    }
}

fn main() {
    let a = Article { title: String::from("Rust") };
    println!("{}", a.preview());
}`,
    starter: `trait Summary {
    fn headline(&self) -> String;

    fn preview(&self) -> String {
        format!("Read more: {}", self.headline())
    }
}

struct Article {
    title: String,
}

// TODO: impl Summary for Article (just headline)

fn main() {
    // TODO: build an Article and print preview()
}`,
    tags: ['traits', 'default-method'],
  },
  {
    id: 'rs-ch17-c-020',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Encapsulated Average',
    prompt: `Build the book's averaged collection, simplified. Define a struct \`AveragedList\` with private fields \`list: Vec<i32>\` and \`average: f64\`.

Provide a public \`new() -> AveragedList\` starting empty with average 0.0, a public \`add(&mut self, value: i32)\` that pushes the value and recomputes the average, and a public getter \`average(&self) -> f64\`. Keep the fields private so callers cannot desync them.

In \`main\`, create a list, add 2, 4, and 6, then print the average. The output should be \`4\`.`,
    hints: [
      'After pushing, recompute the average as the sum divided by the length.',
      'Cast with \`as f64\` so the division is floating point.',
      'Because the fields are private, only \`add\` can change them, keeping average consistent.',
    ],
    solution: `struct AveragedList {
    list: Vec<i32>,
    average: f64,
}

impl AveragedList {
    fn new() -> AveragedList {
        AveragedList { list: Vec::new(), average: 0.0 }
    }

    fn add(&mut self, value: i32) {
        self.list.push(value);
        let sum: i32 = self.list.iter().sum();
        self.average = sum as f64 / self.list.len() as f64;
    }

    fn average(&self) -> f64 {
        self.average
    }
}

fn main() {
    let mut list = AveragedList::new();
    list.add(2);
    list.add(4);
    list.add(6);
    println!("{}", list.average());
}`,
    starter: `struct AveragedList {
    list: Vec<i32>,
    average: f64,
}

impl AveragedList {
    // TODO: new, add (recompute average), average getter
}

fn main() {
    // TODO: add 2, 4, 6 then print average
}`,
    tags: ['encapsulation', 'invariant', 'vec'],
  },
  {
    id: 'rs-ch17-c-021',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Trait Objects of the Same Type',
    prompt: `A trait-object collection can also hold many values of one concrete type. Define a trait \`Render\` with \`fn render(&self) -> String\`. Implement it for \`Tile\` (a struct with field \`glyph: char\`) so \`render\` returns the glyph as a one-character \`String\`.

In \`main\`, build a \`Vec<Box<dyn Render>>\` of three tiles with glyphs \`'#'\`, \`'.'\`, and \`'#'\`, then print each rendered tile concatenated into one line. The output should be \`#.#\`.`,
    hints: [
      'Convert a char to a String with \`.to_string()\`.',
      'Build up a result \`String\` by pushing each render onto it, then print once.',
    ],
    solution: `trait Render {
    fn render(&self) -> String;
}

struct Tile {
    glyph: char,
}

impl Render for Tile {
    fn render(&self) -> String {
        self.glyph.to_string()
    }
}

fn main() {
    let row: Vec<Box<dyn Render>> = vec![
        Box::new(Tile { glyph: '#' }),
        Box::new(Tile { glyph: '.' }),
        Box::new(Tile { glyph: '#' }),
    ];
    let mut line = String::new();
    for tile in &row {
        line.push_str(&tile.render());
    }
    println!("{}", line);
}`,
    starter: `trait Render {
    fn render(&self) -> String;
}

struct Tile {
    glyph: char,
}

// TODO: impl Render for Tile

fn main() {
    // TODO: build three tiles and print them concatenated
}`,
    tags: ['trait-objects', 'vec', 'char'],
  },
  {
    id: 'rs-ch17-c-022',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Object Safety: Use a Safe Method',
    prompt: `A trait is object-safe only when none of its methods break the rules (for example, returning \`Self\` or being generic). Here \`Logger\` is object-safe.

Define a trait \`Logger\` with \`fn log(&self) -> String\`. Implement it for \`Console\` returning \`"console"\` and \`File\` returning \`"file"\`.

Write \`fn write_all(loggers: &[Box<dyn Logger>])\` that prints each \`log()\` on its own line. In \`main\`, pass a vector with one \`Console\` and one \`File\`. The output should be:
console
file`,
    hints: [
      'Because \`log\` takes \`&self\` and returns a \`String\` (not \`Self\`), \`Logger\` is object-safe and can be used as \`dyn Logger\`.',
      'Iterate over the slice and print each \`log()\`.',
    ],
    solution: `trait Logger {
    fn log(&self) -> String;
}

struct Console;
struct File;

impl Logger for Console {
    fn log(&self) -> String {
        String::from("console")
    }
}

impl Logger for File {
    fn log(&self) -> String {
        String::from("file")
    }
}

fn write_all(loggers: &[Box<dyn Logger>]) {
    for l in loggers {
        println!("{}", l.log());
    }
}

fn main() {
    let loggers: Vec<Box<dyn Logger>> = vec![Box::new(Console), Box::new(File)];
    write_all(&loggers);
}`,
    starter: `trait Logger {
    fn log(&self) -> String;
}

struct Console;
struct File;

// TODO: impl Logger for Console and File

fn write_all(loggers: &[Box<dyn Logger>]) {
    // TODO: print each log()
}

fn main() {
    let loggers: Vec<Box<dyn Logger>> = vec![Box::new(Console), Box::new(File)];
    write_all(&loggers);
}`,
    tags: ['object-safety', 'trait-objects'],
  },
  {
    id: 'rs-ch17-c-023',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Repair an Object-Safety Violation',
    prompt: `The trait below is NOT object-safe because \`duplicate\` returns \`Self\`, so you cannot make a \`Box<dyn Cloneable>\`. Fix it by changing the return type to a concrete \`String\` while keeping the same idea (return a label twice).

Make \`Cloneable\` have \`fn twice(&self) -> String\` that returns the label repeated. Implement it for \`Tag\` (field \`label: String\`) so \`twice\` returns \`label\` concatenated with itself.

In \`main\`, store a \`Tag\` with label \`"go"\` in a \`Box<dyn Cloneable>\` and print \`twice()\`. The output should be \`gogo\`.`,
    hints: [
      'A method that returns \`Self\` is not object-safe; returning a fixed type like \`String\` is.',
      'Build the result with \`format!("{}{}", self.label, self.label)\`.',
    ],
    solution: `trait Cloneable {
    fn twice(&self) -> String;
}

struct Tag {
    label: String,
}

impl Cloneable for Tag {
    fn twice(&self) -> String {
        format!("{}{}", self.label, self.label)
    }
}

fn main() {
    let t: Box<dyn Cloneable> = Box::new(Tag { label: String::from("go") });
    println!("{}", t.twice());
}`,
    starter: `trait Cloneable {
    // This must be object-safe: do NOT return Self.
    fn twice(&self) -> String;
}

struct Tag {
    label: String,
}

// TODO: impl Cloneable for Tag

fn main() {
    let t: Box<dyn Cloneable> = Box::new(Tag { label: String::from("go") });
    println!("{}", t.twice());
}`,
    tags: ['object-safety', 'trait-objects'],
  },
  {
    id: 'rs-ch17-c-024',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Traits Compose Behavior, Not Inheritance',
    prompt: `Rust has no class inheritance; instead a type can implement several traits to gain several behaviors. Define a trait \`Fly\` with \`fn fly(&self) -> String\` and a trait \`Swim\` with \`fn swim(&self) -> String\`.

Implement both for \`Duck\`: \`fly\` returns \`"flap"\` and \`swim\` returns \`"paddle"\`.

In \`main\`, create a \`Duck\` and print \`fly()\` then \`swim()\`, each on its own line. The output should be:
flap
paddle`,
    hints: [
      'A single type may implement any number of traits with separate impl blocks.',
      'This composition replaces multiple inheritance from OOP languages.',
    ],
    solution: `trait Fly {
    fn fly(&self) -> String;
}

trait Swim {
    fn swim(&self) -> String;
}

struct Duck;

impl Fly for Duck {
    fn fly(&self) -> String {
        String::from("flap")
    }
}

impl Swim for Duck {
    fn swim(&self) -> String {
        String::from("paddle")
    }
}

fn main() {
    let d = Duck;
    println!("{}", d.fly());
    println!("{}", d.swim());
}`,
    starter: `trait Fly {
    fn fly(&self) -> String;
}

trait Swim {
    fn swim(&self) -> String;
}

struct Duck;

// TODO: impl Fly and Swim for Duck

fn main() {
    // TODO: print fly() then swim()
}`,
    tags: ['traits', 'composition', 'inheritance'],
  },
  {
    id: 'rs-ch17-c-025',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Typestate: Two Types for Two States',
    prompt: `The typestate pattern encodes each state as a distinct type, so invalid transitions are caught at compile time. Define an empty struct \`Locked\` and an empty struct \`Unlocked\`.

Give \`Locked\` a method \`unlock(self) -> Unlocked\` that returns an \`Unlocked\`. Give \`Unlocked\` a method \`status(&self) -> String\` returning \`"open"\`.

In \`main\`, start with a \`Locked\`, call \`unlock()\` to get an \`Unlocked\`, and print its \`status()\`. The output should be \`open\`.`,
    hints: [
      'Each state is its own struct with its own methods.',
      '\`unlock\` consumes the \`Locked\` and hands back an \`Unlocked\`, so you cannot accidentally reuse the locked value.',
    ],
    solution: `struct Locked;
struct Unlocked;

impl Locked {
    fn unlock(self) -> Unlocked {
        Unlocked
    }
}

impl Unlocked {
    fn status(&self) -> String {
        String::from("open")
    }
}

fn main() {
    let lock = Locked;
    let lock = lock.unlock();
    println!("{}", lock.status());
}`,
    starter: `struct Locked;
struct Unlocked;

impl Locked {
    // TODO: unlock(self) -> Unlocked
}

impl Unlocked {
    // TODO: status(&self) -> String
}

fn main() {
    // TODO: Locked -> unlock -> status
}`,
    tags: ['typestate', 'state', 'consume-self'],
  },
  {
    id: 'rs-ch17-c-026',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Typestate Pipeline of Three Types',
    prompt: `Extend the typestate idea to three steps. Define empty structs \`Raw\`, \`Cooked\`, and \`Served\`.

\`Raw\` has \`cook(self) -> Cooked\`. \`Cooked\` has \`serve(self) -> Served\`. \`Served\` has \`describe(&self) -> String\` returning \`"served"\`.

In \`main\`, start with \`Raw\`, advance through both transitions, and print \`describe()\`. The output should be \`served\`. Each transition consumes the previous state so you cannot skip a step.`,
    hints: [
      'Chain the calls: \`Raw.cook().serve()\` produces a \`Served\`.',
      'Because each method takes \`self\` by value, the compiler enforces the order.',
    ],
    solution: `struct Raw;
struct Cooked;
struct Served;

impl Raw {
    fn cook(self) -> Cooked {
        Cooked
    }
}

impl Cooked {
    fn serve(self) -> Served {
        Served
    }
}

impl Served {
    fn describe(&self) -> String {
        String::from("served")
    }
}

fn main() {
    let dish = Raw;
    let dish = dish.cook().serve();
    println!("{}", dish.describe());
}`,
    starter: `struct Raw;
struct Cooked;
struct Served;

impl Raw {
    // TODO: cook(self) -> Cooked
}

impl Cooked {
    // TODO: serve(self) -> Served
}

impl Served {
    // TODO: describe(&self) -> String
}

fn main() {
    // TODO: Raw -> cook -> serve -> describe
}`,
    tags: ['typestate', 'state', 'pipeline'],
  },
  {
    id: 'rs-ch17-c-027',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'State Pattern: Draft to Published Content',
    prompt: `Build a tiny version of the book's state pattern using trait objects. Define a trait \`State\` with \`fn content(&self) -> String\`.

Implement it for \`Draft\` (returns \`""\`, an empty string) and \`Published\` (returns \`"live"\`).

Define a struct \`Post\` with a private field \`state: Box<dyn State>\`. Give \`Post\` a method \`content(&self) -> String\` that delegates to \`self.state.content()\`.

In \`main\`, build a \`Post\` whose state is \`Box::new(Published)\` and print \`content()\`. The output should be \`live\`.`,
    hints: [
      'The post forwards \`content\` to whatever state it currently holds.',
      'Store the active state as \`Box<dyn State>\` so it can change type later.',
    ],
    solution: `trait State {
    fn content(&self) -> String;
}

struct Draft;
struct Published;

impl State for Draft {
    fn content(&self) -> String {
        String::from("")
    }
}

impl State for Published {
    fn content(&self) -> String {
        String::from("live")
    }
}

struct Post {
    state: Box<dyn State>,
}

impl Post {
    fn content(&self) -> String {
        self.state.content()
    }
}

fn main() {
    let post = Post { state: Box::new(Published) };
    println!("{}", post.content());
}`,
    starter: `trait State {
    fn content(&self) -> String;
}

struct Draft;
struct Published;

// TODO: impl State for Draft and Published

struct Post {
    state: Box<dyn State>,
}

impl Post {
    fn content(&self) -> String {
        // TODO: delegate to self.state
    }
}

fn main() {
    // TODO: build a Post with Published state and print content()
}`,
    tags: ['state-pattern', 'trait-objects', 'delegation'],
  },
  {
    id: 'rs-ch17-c-028',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'State Transition Method Returning New State',
    prompt: `In the state pattern, a transition takes the old boxed state by value and returns the next state. Define a trait \`State\` with \`fn request_review(self: Box<Self>) -> Box<dyn State>\` and \`fn name(&self) -> String\`.

Implement it for \`Draft\`: \`request_review\` returns \`Box::new(PendingReview)\` and \`name\` returns \`"draft"\`. Implement it for \`PendingReview\`: \`request_review\` returns the same state (\`self\`) and \`name\` returns \`"pending"\`.

In \`main\`, start with \`Box::new(Draft)\` as a \`Box<dyn State>\`, call \`request_review()\`, and print the resulting state's \`name()\`. The output should be \`pending\`.`,
    hints: [
      'The transition signature is \`fn request_review(self: Box<Self>) -> Box<dyn State>\`.',
      'For \`PendingReview\`, just return \`self\` since asking again does nothing.',
    ],
    solution: `trait State {
    fn request_review(self: Box<Self>) -> Box<dyn State>;
    fn name(&self) -> String;
}

struct Draft;
struct PendingReview;

impl State for Draft {
    fn request_review(self: Box<Self>) -> Box<dyn State> {
        Box::new(PendingReview)
    }
    fn name(&self) -> String {
        String::from("draft")
    }
}

impl State for PendingReview {
    fn request_review(self: Box<Self>) -> Box<dyn State> {
        self
    }
    fn name(&self) -> String {
        String::from("pending")
    }
}

fn main() {
    let state: Box<dyn State> = Box::new(Draft);
    let state = state.request_review();
    println!("{}", state.name());
}`,
    starter: `trait State {
    fn request_review(self: Box<Self>) -> Box<dyn State>;
    fn name(&self) -> String;
}

struct Draft;
struct PendingReview;

// TODO: impl State for Draft and PendingReview

fn main() {
    let state: Box<dyn State> = Box::new(Draft);
    let state = state.request_review();
    println!("{}", state.name());
}`,
    tags: ['state-pattern', 'trait-objects', 'transition'],
  },
  {
    id: 'rs-ch17-c-029',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Post Delegates request_review With take',
    prompt: `Now wire a transition through a \`Post\`. Use the trait \`State\` with \`fn request_review(self: Box<Self>) -> Box<dyn State>\` and \`fn label(&self) -> String\`. Implement it for \`Draft\` (request_review returns \`Box::new(PendingReview)\`, label \`"draft"\`) and \`PendingReview\` (request_review returns \`self\`, label \`"pending"\`).

Give \`Post\` a field \`state: Option<Box<dyn State>>\` and a method \`request_review(&mut self)\` that does \`self.state = Some(self.state.take().unwrap().request_review());\`. Add \`label(&self) -> String\` that returns the current state's label.

In \`main\`, build a \`Post\` starting in \`Draft\`, call \`request_review()\`, then print \`label()\`. The output should be \`pending\`.`,
    hints: [
      '\`Option::take\` pulls the boxed state out, leaving \`None\` temporarily so you can consume it.',
      'Reassign \`self.state\` to the box returned by the transition.',
      'For \`label\`, match or use \`as_ref().unwrap()\` on the option before calling \`label()\`.',
    ],
    solution: `trait State {
    fn request_review(self: Box<Self>) -> Box<dyn State>;
    fn label(&self) -> String;
}

struct Draft;
struct PendingReview;

impl State for Draft {
    fn request_review(self: Box<Self>) -> Box<dyn State> {
        Box::new(PendingReview)
    }
    fn label(&self) -> String {
        String::from("draft")
    }
}

impl State for PendingReview {
    fn request_review(self: Box<Self>) -> Box<dyn State> {
        self
    }
    fn label(&self) -> String {
        String::from("pending")
    }
}

struct Post {
    state: Option<Box<dyn State>>,
}

impl Post {
    fn new() -> Post {
        Post { state: Some(Box::new(Draft)) }
    }

    fn request_review(&mut self) {
        self.state = Some(self.state.take().unwrap().request_review());
    }

    fn label(&self) -> String {
        self.state.as_ref().unwrap().label()
    }
}

fn main() {
    let mut post = Post::new();
    post.request_review();
    println!("{}", post.label());
}`,
    starter: `trait State {
    fn request_review(self: Box<Self>) -> Box<dyn State>;
    fn label(&self) -> String;
}

struct Draft;
struct PendingReview;

// TODO: impl State for Draft and PendingReview

struct Post {
    state: Option<Box<dyn State>>,
}

impl Post {
    fn new() -> Post {
        Post { state: Some(Box::new(Draft)) }
    }

    fn request_review(&mut self) {
        // TODO: take the state, transition it, store it back
    }

    fn label(&self) -> String {
        // TODO: return the current state's label
    }
}

fn main() {
    let mut post = Post::new();
    post.request_review();
    println!("{}", post.label());
}`,
    tags: ['state-pattern', 'option-take', 'transition'],
  },
  {
    id: 'rs-ch17-c-030',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Full Three-State Post Lifecycle',
    prompt: `Implement the full Draft to PendingReview to Published lifecycle with content gating. Trait \`State\` has \`fn request_review(self: Box<Self>) -> Box<dyn State>\`, \`fn approve(self: Box<Self>) -> Box<dyn State>\`, and \`fn content<'a>(&self, post: &'a Post) -> &'a str\`.

Defaults: \`content\` returns \`""\`. \`Draft::request_review\` returns \`PendingReview\`; \`Draft::approve\` returns self. \`PendingReview::request_review\` returns self; \`PendingReview::approve\` returns \`Published\`. \`Published\` overrides \`content\` to return \`&post.text\`.

\`Post\` has fields \`state: Option<Box<dyn State>>\` and \`text: String\`, with \`new\`, \`add_text\`, \`request_review\`, \`approve\`, and \`content\`. In \`main\`: create a post, add text \`"hi"\`, print content (empty), request review and approve, then print content. The output should be a blank line followed by \`hi\`.`,
    hints: [
      'Put \`content\` as a default method returning \`""\`; only \`Published\` overrides it.',
      'In \`Post::content\`, call \`self.state.as_ref().unwrap().content(self)\`.',
      'Use \`self.state.take().unwrap()\` inside each \`Post\` transition method.',
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
        &post.text
    }
}

struct Post {
    state: Option<Box<dyn State>>,
    text: String,
}

impl Post {
    fn new() -> Post {
        Post { state: Some(Box::new(Draft)), text: String::new() }
    }

    fn add_text(&mut self, text: &str) {
        self.text.push_str(text);
    }

    fn request_review(&mut self) {
        self.state = Some(self.state.take().unwrap().request_review());
    }

    fn approve(&mut self) {
        self.state = Some(self.state.take().unwrap().approve());
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

// TODO: impl State for Draft, PendingReview, Published

struct Post {
    state: Option<Box<dyn State>>,
    text: String,
}

impl Post {
    fn new() -> Post {
        Post { state: Some(Box::new(Draft)), text: String::new() }
    }

    fn add_text(&mut self, text: &str) {
        self.text.push_str(text);
    }

    // TODO: request_review, approve, content

}

fn main() {
    let mut post = Post::new();
    post.add_text("hi");
    println!("{}", post.content());
    post.request_review();
    post.approve();
    println!("{}", post.content());
}`,
    tags: ['state-pattern', 'trait-objects', 'lifecycle'],
  },
  {
    id: 'rs-ch17-c-031',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Typestate Post: States as Types',
    prompt: `Reimplement the post lifecycle the typestate way, where each state is its own type. Define \`DraftPost\` (field \`content: String\`), \`PendingReviewPost\` (field \`content: String\`), and \`Post\` (field \`content: String\`).

\`DraftPost\` has \`new() -> DraftPost\` (empty content), \`add_text(&mut self, text: &str)\`, and \`request_review(self) -> PendingReviewPost\`. \`PendingReviewPost\` has \`approve(self) -> Post\`. \`Post\` has \`content(&self) -> &str\`.

In \`main\`, create a \`DraftPost\`, add text \`"yo"\`, call \`request_review()\` then \`approve()\`, and print \`content()\`. The output should be \`yo\`. Note there is no way to read content until the post is a \`Post\`.`,
    hints: [
      'Each transition moves the content string into the next type by value.',
      'Only the final \`Post\` type exposes a \`content\` getter, so unpublished posts cannot be read.',
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
    post.add_text("yo");
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

impl DraftPost {
    // TODO: new, add_text, request_review(self) -> PendingReviewPost
}

impl PendingReviewPost {
    // TODO: approve(self) -> Post
}

impl Post {
    // TODO: content(&self) -> &str
}

fn main() {
    let mut post = DraftPost::new();
    post.add_text("yo");
    let post = post.request_review();
    let post = post.approve();
    println!("{}", post.content());
}`,
    tags: ['typestate', 'state', 'encapsulation'],
  },
  {
    id: 'rs-ch17-c-032',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Trait Object as a Struct Field',
    prompt: `A struct can hold a boxed trait object so its behavior is chosen at runtime. Define a trait \`Strategy\` with \`fn apply(&self, n: i32) -> i32\`. Implement it for \`Doubler\` (returns \`n * 2\`) and \`Negate\` (returns \`-n\`).

Define a struct \`Calculator\` with a field \`strategy: Box<dyn Strategy>\` and a method \`run(&self, n: i32) -> i32\` that calls \`self.strategy.apply(n)\`.

In \`main\`, build a \`Calculator\` using \`Doubler\` and print \`run(5)\`, then build one using \`Negate\` and print \`run(5)\`. The output should be:
10
-5`,
    hints: [
      'The field type is \`Box<dyn Strategy>\`, letting different calculators behave differently.',
      'Swapping the boxed value changes behavior without changing \`Calculator\`.',
    ],
    solution: `trait Strategy {
    fn apply(&self, n: i32) -> i32;
}

struct Doubler;
struct Negate;

impl Strategy for Doubler {
    fn apply(&self, n: i32) -> i32 {
        n * 2
    }
}

impl Strategy for Negate {
    fn apply(&self, n: i32) -> i32 {
        -n
    }
}

struct Calculator {
    strategy: Box<dyn Strategy>,
}

impl Calculator {
    fn run(&self, n: i32) -> i32 {
        self.strategy.apply(n)
    }
}

fn main() {
    let a = Calculator { strategy: Box::new(Doubler) };
    println!("{}", a.run(5));
    let b = Calculator { strategy: Box::new(Negate) };
    println!("{}", b.run(5));
}`,
    starter: `trait Strategy {
    fn apply(&self, n: i32) -> i32;
}

struct Doubler;
struct Negate;

// TODO: impl Strategy for Doubler and Negate

struct Calculator {
    strategy: Box<dyn Strategy>,
}

impl Calculator {
    fn run(&self, n: i32) -> i32 {
        // TODO: delegate to the strategy
    }
}

fn main() {
    // TODO: run a Doubler then a Negate calculator on 5
}`,
    tags: ['trait-objects', 'strategy', 'box'],
  },
  {
    id: 'rs-ch17-c-033',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Swap a Boxed State at Runtime',
    prompt: `A \`Box<dyn Trait>\` field can be replaced to change behavior. Define a trait \`Mode\` with \`fn name(&self) -> String\`. Implement it for \`Light\` (returns \`"light"\`) and \`Dark\` (returns \`"dark"\`).

Define a struct \`App\` with a field \`mode: Box<dyn Mode>\`, a method \`name(&self) -> String\` that returns the current mode's name, and a method \`set_dark(&mut self)\` that replaces the field with \`Box::new(Dark)\`.

In \`main\`, start an \`App\` in \`Light\`, print \`name()\`, call \`set_dark()\`, then print \`name()\` again. The output should be:
light
dark`,
    hints: [
      'Assign a new box to \`self.mode\` to switch behavior.',
      'The struct type never changes even though the boxed value does.',
    ],
    solution: `trait Mode {
    fn name(&self) -> String;
}

struct Light;
struct Dark;

impl Mode for Light {
    fn name(&self) -> String {
        String::from("light")
    }
}

impl Mode for Dark {
    fn name(&self) -> String {
        String::from("dark")
    }
}

struct App {
    mode: Box<dyn Mode>,
}

impl App {
    fn name(&self) -> String {
        self.mode.name()
    }

    fn set_dark(&mut self) {
        self.mode = Box::new(Dark);
    }
}

fn main() {
    let mut app = App { mode: Box::new(Light) };
    println!("{}", app.name());
    app.set_dark();
    println!("{}", app.name());
}`,
    starter: `trait Mode {
    fn name(&self) -> String;
}

struct Light;
struct Dark;

// TODO: impl Mode for Light and Dark

struct App {
    mode: Box<dyn Mode>,
}

impl App {
    fn name(&self) -> String {
        // TODO
    }

    fn set_dark(&mut self) {
        // TODO: replace the boxed mode
    }
}

fn main() {
    let mut app = App { mode: Box::new(Light) };
    println!("{}", app.name());
    app.set_dark();
    println!("{}", app.name());
}`,
    tags: ['trait-objects', 'state', 'box'],
  },
  {
    id: 'rs-ch17-c-034',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Trait Objects by a Property',
    prompt: `Define a trait \`Item\` with \`fn is_active(&self) -> bool\`. Implement it for \`Task\` (a struct with a \`bool\` field \`done\`) so \`is_active\` returns \`!self.done\`. Also implement it for \`Note\` returning \`true\` always.

Write \`fn count_active(items: &[Box<dyn Item>]) -> usize\` that returns how many items are active.

In \`main\`, build a \`Vec<Box<dyn Item>>\` containing a \`Task { done: true }\`, a \`Task { done: false }\`, and a \`Note\`, then print \`count_active\`. The output should be \`2\`.`,
    hints: [
      'Loop over the slice and increment a counter when \`is_active()\` is true.',
      'The slice holds mixed concrete types behind \`Box<dyn Item>\`.',
    ],
    solution: `trait Item {
    fn is_active(&self) -> bool;
}

struct Task {
    done: bool,
}

struct Note;

impl Item for Task {
    fn is_active(&self) -> bool {
        !self.done
    }
}

impl Item for Note {
    fn is_active(&self) -> bool {
        true
    }
}

fn count_active(items: &[Box<dyn Item>]) -> usize {
    let mut count = 0;
    for item in items {
        if item.is_active() {
            count += 1;
        }
    }
    count
}

fn main() {
    let items: Vec<Box<dyn Item>> = vec![
        Box::new(Task { done: true }),
        Box::new(Task { done: false }),
        Box::new(Note),
    ];
    println!("{}", count_active(&items));
}`,
    starter: `trait Item {
    fn is_active(&self) -> bool;
}

struct Task {
    done: bool,
}

struct Note;

// TODO: impl Item for Task and Note

fn count_active(items: &[Box<dyn Item>]) -> usize {
    // TODO: count active items
}

fn main() {
    let items: Vec<Box<dyn Item>> = vec![
        Box::new(Task { done: true }),
        Box::new(Task { done: false }),
        Box::new(Note),
    ];
    println!("{}", count_active(&items));
}`,
    tags: ['trait-objects', 'vec', 'iteration'],
  },
  {
    id: 'rs-ch17-c-035',
    chapter: 17,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Encapsulated Stack With an Invariant',
    prompt: `Encapsulation lets a type maintain an invariant that callers cannot break. Define a struct \`BoundedStack\` with private fields \`items: Vec<i32>\` and \`cap: usize\`.

Provide a public \`new(cap: usize) -> BoundedStack\` (empty), a public \`push(&mut self, value: i32) -> bool\` that pushes and returns \`true\` only when there is room (length below \`cap\`), otherwise leaves the stack unchanged and returns \`false\`, and a public \`len(&self) -> usize\`.

In \`main\`, create a stack with cap 2, push 10, 20, and 30, then print \`len()\` and the result of the third push, each on its own line. The output should be:
2
false`,
    hints: [
      'Check \`self.items.len() < self.cap\` before pushing.',
      'Private fields guarantee the length never exceeds the cap.',
      'Return the boolean from \`push\` so the caller knows whether it succeeded.',
    ],
    solution: `struct BoundedStack {
    items: Vec<i32>,
    cap: usize,
}

impl BoundedStack {
    fn new(cap: usize) -> BoundedStack {
        BoundedStack { items: Vec::new(), cap }
    }

    fn push(&mut self, value: i32) -> bool {
        if self.items.len() < self.cap {
            self.items.push(value);
            true
        } else {
            false
        }
    }

    fn len(&self) -> usize {
        self.items.len()
    }
}

fn main() {
    let mut stack = BoundedStack::new(2);
    stack.push(10);
    stack.push(20);
    let third = stack.push(30);
    println!("{}", stack.len());
    println!("{}", third);
}`,
    starter: `struct BoundedStack {
    items: Vec<i32>,
    cap: usize,
}

impl BoundedStack {
    // TODO: new, push (respect cap, return bool), len
}

fn main() {
    let mut stack = BoundedStack::new(2);
    stack.push(10);
    stack.push(20);
    let third = stack.push(30);
    println!("{}", stack.len());
    println!("{}", third);
}`,
    tags: ['encapsulation', 'invariant', 'vec'],
  },
]

export default problems
