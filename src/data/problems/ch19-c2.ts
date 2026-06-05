import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch19-c-036',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Raw Pointers to a Value',
    prompt: `Create both an immutable and a mutable raw pointer to the same \`i32\` variable, then read the value back through one of them inside an \`unsafe\` block.

In \`main\`, declare \`let mut num = 5;\`. Make \`r1\` a \`*const i32\` and \`r2\` a \`*mut i32\` that both point at \`num\` (creating raw pointers is safe; dereferencing is not). Inside one \`unsafe\` block print:

r1 points to 5
r2 points to 5`,
    hints: [
      'Use \`&num as *const i32\` and \`&mut num as *mut i32\` to coerce references into raw pointers.',
      'You can create raw pointers in safe code, but you must dereference them inside an \`unsafe\` block.',
    ],
    solution: `fn main() {
    let mut num = 5;
    let r1 = &num as *const i32;
    let r2 = &mut num as *mut i32;
    unsafe {
        println!("r1 points to {}", *r1);
        println!("r2 points to {}", *r2);
    }
}`,
    starter: `fn main() {
    let mut num = 5;
    // TODO: build a *const and a *mut pointer to num
    // TODO: dereference them inside one unsafe block and print
}`,
    tags: ['unsafe', 'raw-pointers'],
  },
  {
    id: 'rs-ch19-c-037',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Mutate Through a Mutable Raw Pointer',
    prompt: `Use a \`*mut i32\` to change the value it points at.

In \`main\`, declare \`let mut value = 10;\`. Create a \`*mut i32\` pointing at it. Inside an \`unsafe\` block, write 99 through the pointer. Afterwards print \`value\` (which is now 10 changed to 99). Expected output:

99`,
    hints: [
      'Coerce with \`&mut value as *mut i32\`.',
      'Assign through the dereference: \`*p = 99;\` inside \`unsafe\`.',
    ],
    solution: `fn main() {
    let mut value = 10;
    let p = &mut value as *mut i32;
    unsafe {
        *p = 99;
    }
    println!("{}", value);
}`,
    starter: `fn main() {
    let mut value = 10;
    // TODO: make a *mut i32 to value, write 99 through it in unsafe, then print value
}`,
    tags: ['unsafe', 'raw-pointers'],
  },
  {
    id: 'rs-ch19-c-038',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Call an Unsafe Function',
    prompt: `Define an \`unsafe fn\` and call it correctly.

Write \`unsafe fn dangerous() -> i32\` that simply returns 42. In \`main\`, call it inside an \`unsafe\` block and print its result. Expected output:

42`,
    hints: [
      'An \`unsafe fn\` may only be called from inside an \`unsafe\` block (or another unsafe fn).',
      'The function body of an unsafe fn is itself an unsafe context, but here you just return a value.',
    ],
    solution: `unsafe fn dangerous() -> i32 {
    42
}

fn main() {
    let n = unsafe { dangerous() };
    println!("{}", n);
}`,
    starter: `unsafe fn dangerous() -> i32 {
    // TODO: return 42
    todo!()
}

fn main() {
    // TODO: call dangerous() inside an unsafe block and print the result
}`,
    tags: ['unsafe', 'functions'],
  },
  {
    id: 'rs-ch19-c-039',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Safe Wrapper Over Unsafe Code',
    prompt: `Build a safe function whose body uses \`unsafe\` internally.

Write \`fn read_at(slice: &[i32], index: usize) -> i32\` that returns the element at \`index\` using the unsafe \`get_unchecked\` method on slices, wrapped in an \`unsafe\` block. The function signature itself must be safe (no \`unsafe\` keyword on the fn). In \`main\`, call \`read_at(&[10, 20, 30], 1)\` and print the result. Expected output:

20`,
    hints: [
      '\`slice.get_unchecked(i)\` is an unsafe method returning \`&T\`.',
      'Dereference and return the value: \`*slice.get_unchecked(index)\` inside an unsafe block.',
    ],
    solution: `fn read_at(slice: &[i32], index: usize) -> i32 {
    unsafe { *slice.get_unchecked(index) }
}

fn main() {
    println!("{}", read_at(&[10, 20, 30], 1));
}`,
    starter: `fn read_at(slice: &[i32], index: usize) -> i32 {
    // TODO: use get_unchecked inside an unsafe block
    todo!()
}

fn main() {
    println!("{}", read_at(&[10, 20, 30], 1));
}`,
    tags: ['unsafe', 'safe-abstraction'],
  },
  {
    id: 'rs-ch19-c-040',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Reading and Writing a Mutable Static',
    prompt: `Work with a mutable static variable.

Declare \`static mut COUNTER: u32 = 0;\`. Write \`fn add(n: u32)\` that increments \`COUNTER\` by \`n\` (accessing a \`static mut\` requires \`unsafe\`). In \`main\`, call \`add(3)\` then \`add(4)\`, then print \`COUNTER\` inside an \`unsafe\` block. Expected output:

7`,
    hints: [
      'All reads and writes of a \`static mut\` must be inside \`unsafe\` blocks.',
      'Use \`COUNTER += n;\` inside an unsafe block in \`add\`.',
    ],
    solution: `static mut COUNTER: u32 = 0;

fn add(n: u32) {
    unsafe {
        COUNTER += n;
    }
}

fn main() {
    add(3);
    add(4);
    unsafe {
        println!("{}", COUNTER);
    }
}`,
    starter: `static mut COUNTER: u32 = 0;

fn add(n: u32) {
    // TODO: increment COUNTER by n inside unsafe
}

fn main() {
    add(3);
    add(4);
    // TODO: print COUNTER inside an unsafe block
}`,
    tags: ['unsafe', 'static'],
  },
  {
    id: 'rs-ch19-c-041',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Implement an Unsafe Trait',
    prompt: `Declare and implement an \`unsafe trait\`.

Define \`unsafe trait Marker {}\` and implement it for a struct \`Token\` using \`unsafe impl Marker for Token {}\`. Add a regular function \`fn name<T: Marker>(_: &T) -> &'static str\` that returns "marked". In \`main\`, create a \`Token\` and print the result of calling \`name\` on it. Expected output:

marked`,
    hints: [
      'Implementing an unsafe trait requires the \`unsafe\` keyword on the impl block.',
      'A bound \`T: Marker\` works exactly like any other trait bound.',
    ],
    solution: `unsafe trait Marker {}

struct Token;

unsafe impl Marker for Token {}

fn name<T: Marker>(_: &T) -> &'static str {
    "marked"
}

fn main() {
    let t = Token;
    println!("{}", name(&t));
}`,
    starter: `unsafe trait Marker {}

struct Token;

// TODO: write an unsafe impl of Marker for Token

fn name<T: Marker>(_: &T) -> &'static str {
    "marked"
}

fn main() {
    let t = Token;
    println!("{}", name(&t));
}`,
    tags: ['unsafe', 'traits'],
  },
  {
    id: 'rs-ch19-c-042',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Type Alias for a Long Type',
    prompt: `Use \`type\` to give a long type a short name.

Create a type alias \`type Pair = (String, i32);\`. Write \`fn make(name: &str, score: i32) -> Pair\` that returns a \`Pair\` built from the arguments. In \`main\`, call \`make("ada", 95)\` and print both parts. Expected output:

ada 95`,
    hints: [
      'A type alias is just a synonym, not a new type.',
      'Build the tuple with \`(String::from(name), score)\`.',
    ],
    solution: `type Pair = (String, i32);

fn make(name: &str, score: i32) -> Pair {
    (String::from(name), score)
}

fn main() {
    let p = make("ada", 95);
    println!("{} {}", p.0, p.1);
}`,
    starter: `type Pair = (String, i32);

fn make(name: &str, score: i32) -> Pair {
    // TODO: build and return the pair
    todo!()
}

fn main() {
    let p = make("ada", 95);
    println!("{} {}", p.0, p.1);
}`,
    tags: ['type-alias', 'advanced-types'],
  },
  {
    id: 'rs-ch19-c-043',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Alias a Boxed Trait Object Type',
    prompt: `Reduce repetition with a type alias for a verbose boxed type.

Define \`type Thunk = Box<dyn Fn() -> i32>;\`. Write \`fn make_thunk() -> Thunk\` that returns a boxed closure capturing nothing and returning 7. In \`main\`, call the returned thunk and print its result. Expected output:

7`,
    hints: [
      'The alias \`Thunk\` stands in for the full \`Box<dyn Fn() -> i32>\` type everywhere.',
      'Return \`Box::new(|| 7)\` from \`make_thunk\`.',
    ],
    solution: `type Thunk = Box<dyn Fn() -> i32>;

fn make_thunk() -> Thunk {
    Box::new(|| 7)
}

fn main() {
    let t = make_thunk();
    println!("{}", t());
}`,
    starter: `type Thunk = Box<dyn Fn() -> i32>;

fn make_thunk() -> Thunk {
    // TODO: return a boxed closure that yields 7
    todo!()
}

fn main() {
    let t = make_thunk();
    println!("{}", t());
}`,
    tags: ['type-alias', 'closures'],
  },
  {
    id: 'rs-ch19-c-044',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Trait With an Associated Type',
    prompt: `Define a trait that uses an associated type instead of a generic parameter.

Write \`trait Container { type Item; fn first(&self) -> Self::Item; }\`. Implement it for \`struct Counter\` (a unit struct) with \`type Item = u32\` so that \`first\` returns 0. In \`main\`, create a \`Counter\`, call \`first()\`, and print the result. Expected output:

0`,
    hints: [
      'Inside the impl, set \`type Item = u32;\` then implement \`first\`.',
      'The return type of \`first\` is written \`Self::Item\`.',
    ],
    solution: `trait Container {
    type Item;
    fn first(&self) -> Self::Item;
}

struct Counter;

impl Container for Counter {
    type Item = u32;
    fn first(&self) -> Self::Item {
        0
    }
}

fn main() {
    let c = Counter;
    println!("{}", c.first());
}`,
    starter: `trait Container {
    type Item;
    fn first(&self) -> Self::Item;
}

struct Counter;

// TODO: impl Container for Counter with Item = u32, first() returns 0

fn main() {
    let c = Counter;
    println!("{}", c.first());
}`,
    tags: ['associated-types', 'traits'],
  },
  {
    id: 'rs-ch19-c-045',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Implement Iterator With Its Associated Type',
    prompt: `Use the standard \`Iterator\` trait, whose \`Item\` is an associated type.

Define \`struct Countdown { n: u32 }\` and implement \`Iterator\` for it with \`type Item = u32\`. Each call to \`next\` should yield the current \`n\` and then decrement, stopping (returning \`None\`) once \`n\` reaches 0. In \`main\`, build \`Countdown { n: 3 }\` and collect it into a \`Vec<u32>\`, then print the vector with \`{:?}\`. Expected output:

[3, 2, 1]`,
    hints: [
      'Set \`type Item = u32;\` then implement \`fn next(&mut self) -> Option<u32>\`.',
      'Return \`None\` when \`self.n == 0\`; otherwise save the value, decrement, and return \`Some(value)\`.',
    ],
    solution: `struct Countdown {
    n: u32,
}

impl Iterator for Countdown {
    type Item = u32;
    fn next(&mut self) -> Option<u32> {
        if self.n == 0 {
            None
        } else {
            let v = self.n;
            self.n -= 1;
            Some(v)
        }
    }
}

fn main() {
    let c = Countdown { n: 3 };
    let v: Vec<u32> = c.collect();
    println!("{:?}", v);
}`,
    starter: `struct Countdown {
    n: u32,
}

impl Iterator for Countdown {
    type Item = u32;
    fn next(&mut self) -> Option<u32> {
        // TODO: yield n, then decrement, stopping at 0
        todo!()
    }
}

fn main() {
    let c = Countdown { n: 3 };
    let v: Vec<u32> = c.collect();
    println!("{:?}", v);
}`,
    tags: ['associated-types', 'iterator'],
  },
  {
    id: 'rs-ch19-c-046',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Operator Overloading With Add',
    prompt: `Overload \`+\` by implementing \`std::ops::Add\`.

Define \`struct Point { x: i32, y: i32 }\` with \`#[derive(Debug, PartialEq)]\`. Implement \`Add\` so adding two points adds their fields componentwise. In \`main\`, compute \`Point { x: 1, y: 2 } + Point { x: 3, y: 4 }\` and print it with \`{:?}\`. Expected output:

Point { x: 4, y: 6 }`,
    hints: [
      'Bring \`std::ops::Add\` into scope and set \`type Output = Point;\`.',
      'Implement \`fn add(self, other: Point) -> Point\` adding the fields.',
    ],
    solution: `use std::ops::Add;

#[derive(Debug, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}

impl Add for Point {
    type Output = Point;
    fn add(self, other: Point) -> Point {
        Point {
            x: self.x + other.x,
            y: self.y + other.y,
        }
    }
}

fn main() {
    let p = Point { x: 1, y: 2 } + Point { x: 3, y: 4 };
    println!("{:?}", p);
}`,
    starter: `use std::ops::Add;

#[derive(Debug, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}

// TODO: impl Add for Point so fields add componentwise

fn main() {
    let p = Point { x: 1, y: 2 } + Point { x: 3, y: 4 };
    println!("{:?}", p);
}`,
    tags: ['operator-overloading', 'add'],
  },
  {
    id: 'rs-ch19-c-047',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Function Pointer Parameter',
    prompt: `Pass a function by pointer using the \`fn\` type.

Write \`fn apply_twice(f: fn(i32) -> i32, x: i32) -> i32\` that returns \`f(f(x))\`. Define a free function \`fn add_one(n: i32) -> i32\` returning \`n + 1\`. In \`main\`, call \`apply_twice(add_one, 5)\` and print the result. Expected output:

7`,
    hints: [
      'The type \`fn(i32) -> i32\` (lowercase fn) is a function pointer.',
      'Pass \`add_one\` by name (no parentheses) as the argument.',
    ],
    solution: `fn add_one(n: i32) -> i32 {
    n + 1
}

fn apply_twice(f: fn(i32) -> i32, x: i32) -> i32 {
    f(f(x))
}

fn main() {
    println!("{}", apply_twice(add_one, 5));
}`,
    starter: `fn add_one(n: i32) -> i32 {
    n + 1
}

fn apply_twice(f: fn(i32) -> i32, x: i32) -> i32 {
    // TODO: apply f to x twice
    todo!()
}

fn main() {
    println!("{}", apply_twice(add_one, 5));
}`,
    tags: ['function-pointers', 'fn'],
  },
  {
    id: 'rs-ch19-c-048',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Function Name as a Map Argument',
    prompt: `Use a function pointer where a closure would normally go.

In \`main\`, start with \`let nums = vec![1, 2, 3];\`. Use \`map\` with the function name \`i32::to_string\` (a function pointer) to turn each number into a \`String\`, collect into a \`Vec<String>\`, and print it with \`{:?}\`. Expected output:

["1", "2", "3"]`,
    hints: [
      'You can pass a function path like \`i32::to_string\` to \`map\` exactly where a closure would go.',
      'Collect the iterator into \`Vec<String>\`.',
    ],
    solution: `fn main() {
    let nums = vec![1, 2, 3];
    let strings: Vec<String> = nums.iter().map(i32::to_string).collect();
    println!("{:?}", strings);
}`,
    starter: `fn main() {
    let nums = vec![1, 2, 3];
    // TODO: map with the function pointer i32::to_string and collect into Vec<String>
}`,
    tags: ['function-pointers', 'iterator'],
  },
  {
    id: 'rs-ch19-c-049',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Return a Boxed Closure',
    prompt: `Return a closure from a function by boxing it.

Write \`fn make_adder(amount: i32) -> Box<dyn Fn(i32) -> i32>\` that returns a closure capturing \`amount\` and adding it to its argument. In \`main\`, build an adder with \`amount = 10\`, call it on 5, and print the result. Expected output:

15`,
    hints: [
      'Closures have an unknown size, so return them behind \`Box<dyn Fn(...) -> ...>\`.',
      'The closure must \`move\` to own the captured \`amount\`: \`Box::new(move |x| x + amount)\`.',
    ],
    solution: `fn make_adder(amount: i32) -> Box<dyn Fn(i32) -> i32> {
    Box::new(move |x| x + amount)
}

fn main() {
    let add_ten = make_adder(10);
    println!("{}", add_ten(5));
}`,
    starter: `fn make_adder(amount: i32) -> Box<dyn Fn(i32) -> i32> {
    // TODO: return a boxed closure that adds amount to its input
    todo!()
}

fn main() {
    let add_ten = make_adder(10);
    println!("{}", add_ten(5));
}`,
    tags: ['closures', 'box'],
  },
  {
    id: 'rs-ch19-c-050',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'The Newtype Pattern',
    prompt: `Wrap an existing type in a one-field tuple struct (the newtype pattern) to add behavior.

Define \`struct Meters(f64);\` and give it a method \`fn to_feet(&self) -> f64\` that multiplies the inner value by 3.28084. In \`main\`, create \`Meters(2.0)\`, call \`to_feet()\`, and print the result. Expected output:

6.56168`,
    hints: [
      'Access the inner field with \`self.0\`.',
      'A newtype is a tuple struct with a single field.',
    ],
    solution: `struct Meters(f64);

impl Meters {
    fn to_feet(&self) -> f64 {
        self.0 * 3.28084
    }
}

fn main() {
    let m = Meters(2.0);
    println!("{}", m.to_feet());
}`,
    starter: `struct Meters(f64);

impl Meters {
    fn to_feet(&self) -> f64 {
        // TODO: convert meters to feet
        todo!()
    }
}

fn main() {
    let m = Meters(2.0);
    println!("{}", m.to_feet());
}`,
    tags: ['newtype', 'advanced-types'],
  },
  {
    id: 'rs-ch19-c-051',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Simple macro_rules! Macro',
    prompt: `Write a declarative macro with \`macro_rules!\`.

Define a macro \`greet!\` that takes one expression and expands to a \`println!\` saying "Hello, X!" where X is the argument. In \`main\`, call \`greet!("world")\`. Expected output:

Hello, world!`,
    hints: [
      'Use a single rule like \`($name:expr) => { ... };\`.',
      'Inside the expansion, call \`println!("Hello, {}!", $name);\`.',
    ],
    solution: `macro_rules! greet {
    ($name:expr) => {
        println!("Hello, {}!", $name);
    };
}

fn main() {
    greet!("world");
}`,
    starter: `macro_rules! greet {
    // TODO: one rule that takes an expr and prints "Hello, <expr>!"
}

fn main() {
    greet!("world");
}`,
    tags: ['macros', 'macro_rules'],
  },
  {
    id: 'rs-ch19-c-052',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Macro That Returns a Value',
    prompt: `Write a \`macro_rules!\` macro that expands to an expression.

Define \`square!\` so that \`square!(x)\` expands to \`x * x\`. In \`main\`, compute \`let n = square!(6);\` and print \`n\`. Expected output:

36`,
    hints: [
      'Match a single \`($x:expr)\` and expand to \`{ $x * $x }\`.',
      'Wrapping the expansion in braces keeps it a single expression.',
    ],
    solution: `macro_rules! square {
    ($x:expr) => {
        $x * $x
    };
}

fn main() {
    let n = square!(6);
    println!("{}", n);
}`,
    starter: `macro_rules! square {
    // TODO: ($x:expr) expands to $x * $x
}

fn main() {
    let n = square!(6);
    println!("{}", n);
}`,
    tags: ['macros', 'macro_rules'],
  },
  {
    id: 'rs-ch19-c-053',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Default Generic Type Parameter on Add',
    prompt: `Use \`Add\` with a different right-hand-side type via its default type parameter \`Rhs\`.

Define \`#[derive(Debug)] struct Millimeters(u32);\` and \`#[derive(Debug)] struct Meters(u32);\`. Implement \`Add<Meters> for Millimeters\` (Output = Millimeters) so that adding meters converts to millimeters (1 meter = 1000 mm) and sums. In \`main\`, print \`Millimeters(50) + Meters(1)\` with \`{:?}\`. Expected output:

Millimeters(1050)`,
    hints: [
      'The \`Add\` trait has signature \`Add<Rhs = Self>\`; here you override \`Rhs\` to \`Meters\`.',
      'In \`add\`, multiply the meters value by 1000 before adding.',
    ],
    solution: `use std::ops::Add;

#[derive(Debug)]
struct Millimeters(u32);

#[derive(Debug)]
struct Meters(u32);

impl Add<Meters> for Millimeters {
    type Output = Millimeters;
    fn add(self, other: Meters) -> Millimeters {
        Millimeters(self.0 + other.0 * 1000)
    }
}

fn main() {
    println!("{:?}", Millimeters(50) + Meters(1));
}`,
    starter: `use std::ops::Add;

#[derive(Debug)]
struct Millimeters(u32);

#[derive(Debug)]
struct Meters(u32);

// TODO: impl Add<Meters> for Millimeters, converting meters to mm

fn main() {
    println!("{:?}", Millimeters(50) + Meters(1));
}`,
    tags: ['operator-overloading', 'default-type-params'],
  },
  {
    id: 'rs-ch19-c-054',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Supertrait Requirement',
    prompt: `Define a trait that requires another trait (a supertrait).

Write \`trait Summary: std::fmt::Display { fn summarize(&self) -> String { format!("Summary: {}", self) } }\`. Define \`struct Article(String)\`, implement \`Display\` for it (printing the inner string), and implement \`Summary\` for it using the default method. In \`main\`, create \`Article(String::from("news"))\` and print \`summarize()\`. Expected output:

Summary: news`,
    hints: [
      'A supertrait is written \`trait Summary: Display\`, requiring \`Display\` for any implementor.',
      'The default \`summarize\` can use \`self\` with \`{}\` because \`Display\` is guaranteed.',
    ],
    solution: `use std::fmt;

trait Summary: fmt::Display {
    fn summarize(&self) -> String {
        format!("Summary: {}", self)
    }
}

struct Article(String);

impl fmt::Display for Article {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl Summary for Article {}

fn main() {
    let a = Article(String::from("news"));
    println!("{}", a.summarize());
}`,
    starter: `use std::fmt;

trait Summary: fmt::Display {
    fn summarize(&self) -> String {
        format!("Summary: {}", self)
    }
}

struct Article(String);

// TODO: impl Display for Article, then impl Summary for Article

fn main() {
    let a = Article(String::from("news"));
    println!("{}", a.summarize());
}`,
    tags: ['supertraits', 'traits'],
  },
  {
    id: 'rs-ch19-c-055',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Function Returning the Never Type',
    prompt: `Write a function whose return type is the never type \`!\`.

Define \`fn fail() -> ! { panic!("boom") }\`. Then write \`fn pick(use_default: bool) -> i32\` that returns 0 when \`use_default\` is true, and otherwise calls \`fail()\` (the never type coerces to any type, so an expression of type \`!\` can sit in an \`i32\` branch). In \`main\`, call \`pick(true)\` and print the result. Expected output:

0`,
    hints: [
      'The never type \`!\` means the function never returns normally.',
      'Because \`!\` coerces to any type, \`fail()\` can be used where an \`i32\` is expected.',
    ],
    solution: `fn fail() -> ! {
    panic!("boom")
}

fn pick(use_default: bool) -> i32 {
    if use_default {
        0
    } else {
        fail()
    }
}

fn main() {
    println!("{}", pick(true));
}`,
    starter: `fn fail() -> ! {
    panic!("boom")
}

fn pick(use_default: bool) -> i32 {
    // TODO: return 0 if use_default, else call fail()
    todo!()
}

fn main() {
    println!("{}", pick(true));
}`,
    tags: ['never-type', 'advanced-types'],
  },
  {
    id: 'rs-ch19-c-056',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Sized Bound on a Generic',
    prompt: `Work with the \`Sized\` trait and the \`?Sized\` relaxation.

Write \`fn describe<T: ?Sized + std::fmt::Debug>(value: &T) -> String\` that returns \`format!("{:?}", value)\`. Because of \`?Sized\`, it must accept unsized types like \`str\` behind a reference. In \`main\`, call \`describe("hi")\` (passing a \`&str\`, whose pointee \`str\` is unsized) and print the result. Expected output:

"hi"`,
    hints: [
      'By default every generic \`T\` has an implicit \`T: Sized\` bound; \`?Sized\` relaxes it.',
      'The value is taken by reference (\`&T\`) so the unsized data lives behind the pointer.',
    ],
    solution: `fn describe<T: ?Sized + std::fmt::Debug>(value: &T) -> String {
    format!("{:?}", value)
}

fn main() {
    println!("{}", describe("hi"));
}`,
    starter: `fn describe<T: ?Sized + std::fmt::Debug>(value: &T) -> String {
    // TODO: return the Debug formatting of value
    todo!()
}

fn main() {
    println!("{}", describe("hi"));
}`,
    tags: ['sized', 'dst'],
  },
  {
    id: 'rs-ch19-c-057',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Storing Function Pointers in a Vec',
    prompt: `Build a table of operations stored as function pointers.

Define free functions \`fn add(a: i32, b: i32) -> i32\` and \`fn mul(a: i32, b: i32) -> i32\`. In \`main\`, create \`let ops: Vec<fn(i32, i32) -> i32> = vec![add, mul];\`. Apply each op to (3, 4) and print the results, one per line. Expected output:

7
12`,
    hints: [
      'The element type is the function-pointer type \`fn(i32, i32) -> i32\`.',
      'Iterate the vector and call each \`op(3, 4)\`.',
    ],
    solution: `fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn mul(a: i32, b: i32) -> i32 {
    a * b
}

fn main() {
    let ops: Vec<fn(i32, i32) -> i32> = vec![add, mul];
    for op in ops {
        println!("{}", op(3, 4));
    }
}`,
    starter: `fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn mul(a: i32, b: i32) -> i32 {
    a * b
}

fn main() {
    let ops: Vec<fn(i32, i32) -> i32> = vec![add, mul];
    // TODO: apply each op to (3, 4) and print
}`,
    tags: ['function-pointers', 'vec'],
  },
  {
    id: 'rs-ch19-c-058',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Macro With Repetition',
    prompt: `Write a \`macro_rules!\` macro that accepts any number of expressions using repetition.

Define \`make_vec!\` that mimics a tiny \`vec!\`: \`make_vec!(1, 2, 3)\` should build and return a \`Vec<i32>\` containing those elements. Support zero or more comma-separated arguments. In \`main\`, print \`make_vec!(1, 2, 3)\` with \`{:?}\`. Expected output:

[1, 2, 3]`,
    hints: [
      'Use the repetition pattern \`( $( $x:expr ),* )\` to match any number of args.',
      'Expand to a block that creates a vec and pushes each element with \`$( v.push($x); )*\`.',
    ],
    solution: `macro_rules! make_vec {
    ( $( $x:expr ),* ) => {
        {
            let mut v = Vec::new();
            $(
                v.push($x);
            )*
            v
        }
    };
}

fn main() {
    let v: Vec<i32> = make_vec!(1, 2, 3);
    println!("{:?}", v);
}`,
    starter: `macro_rules! make_vec {
    // TODO: match zero or more exprs and push each into a new Vec
}

fn main() {
    let v: Vec<i32> = make_vec!(1, 2, 3);
    println!("{:?}", v);
}`,
    tags: ['macros', 'repetition'],
  },
  {
    id: 'rs-ch19-c-059',
    chapter: 19,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Overload Multiplication With Mul',
    prompt: `Overload the \`*\` operator by implementing \`std::ops::Mul\`.

Define \`#[derive(Debug)] struct Vec2 { x: i32, y: i32 }\`. Implement \`Mul<i32> for Vec2\` (Output = Vec2) so that multiplying by a scalar scales both components. In \`main\`, compute \`Vec2 { x: 2, y: 3 } * 4\` and print it with \`{:?}\`. Expected output:

Vec2 { x: 8, y: 12 }`,
    hints: [
      'Implement \`Mul<i32>\` with \`type Output = Vec2;\`.',
      'In \`fn mul(self, scalar: i32) -> Vec2\`, multiply both fields by \`scalar\`.',
    ],
    solution: `use std::ops::Mul;

#[derive(Debug)]
struct Vec2 {
    x: i32,
    y: i32,
}

impl Mul<i32> for Vec2 {
    type Output = Vec2;
    fn mul(self, scalar: i32) -> Vec2 {
        Vec2 {
            x: self.x * scalar,
            y: self.y * scalar,
        }
    }
}

fn main() {
    println!("{:?}", Vec2 { x: 2, y: 3 } * 4);
}`,
    starter: `use std::ops::Mul;

#[derive(Debug)]
struct Vec2 {
    x: i32,
    y: i32,
}

// TODO: impl Mul<i32> for Vec2 to scale both fields

fn main() {
    println!("{:?}", Vec2 { x: 2, y: 3 } * 4);
}`,
    tags: ['operator-overloading', 'mul'],
  },
  {
    id: 'rs-ch19-c-060',
    chapter: 19,
    kind: 'coding',
    difficulty: 'hard',
    title: 'A Safe split_at_mut Style Function',
    prompt: `Write a safe function that produces two non-overlapping mutable slices from one, using raw pointers internally.

Implement \`fn split<'a>(slice: &'a mut [i32], mid: usize) -> (&'a mut [i32], &'a mut [i32])\`. The borrow checker cannot prove the two halves are disjoint, so use \`slice.as_mut_ptr()\` plus \`std::slice::from_raw_parts_mut\` inside an \`unsafe\` block to build the two halves. In \`main\`, split \`[1, 2, 3, 4, 5, 6]\` at index 3, then print both halves with \`{:?}\` on separate lines. Expected output:

[1, 2, 3]
[4, 5, 6]`,
    hints: [
      'Get \`let len = slice.len();\` and \`let ptr = slice.as_mut_ptr();\`.',
      'Use \`from_raw_parts_mut(ptr, mid)\` and \`from_raw_parts_mut(ptr.add(mid), len - mid)\` inside one unsafe block.',
      'The unsafe block is justified because the two ranges never overlap.',
    ],
    solution: `use std::slice;

fn split<'a>(slice: &'a mut [i32], mid: usize) -> (&'a mut [i32], &'a mut [i32]) {
    let len = slice.len();
    let ptr = slice.as_mut_ptr();
    assert!(mid <= len);
    unsafe {
        (
            slice::from_raw_parts_mut(ptr, mid),
            slice::from_raw_parts_mut(ptr.add(mid), len - mid),
        )
    }
}

fn main() {
    let mut data = [1, 2, 3, 4, 5, 6];
    let (a, b) = split(&mut data, 3);
    println!("{:?}", a);
    println!("{:?}", b);
}`,
    starter: `use std::slice;

fn split<'a>(slice: &'a mut [i32], mid: usize) -> (&'a mut [i32], &'a mut [i32]) {
    let len = slice.len();
    let ptr = slice.as_mut_ptr();
    // TODO: build the two halves with from_raw_parts_mut inside unsafe
    todo!()
}

fn main() {
    let mut data = [1, 2, 3, 4, 5, 6];
    let (a, b) = split(&mut data, 3);
    println!("{:?}", a);
    println!("{:?}", b);
}`,
    tags: ['unsafe', 'slices'],
  },
  {
    id: 'rs-ch19-c-061',
    chapter: 19,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Calling C abs Through FFI',
    prompt: `Declare an external C function and call it through FFI.

Use an \`extern "C"\` block to declare \`fn abs(input: i32) -> i32;\` from the C standard library. In \`main\`, call \`abs(-7)\` inside an \`unsafe\` block and print the result. Expected output:

7`,
    hints: [
      'Functions declared in an \`extern "C"\` block are always unsafe to call.',
      'Wrap the call site in an \`unsafe\` block: \`unsafe { abs(-7) }\`.',
    ],
    solution: `extern "C" {
    fn abs(input: i32) -> i32;
}

fn main() {
    let result = unsafe { abs(-7) };
    println!("{}", result);
}`,
    starter: `extern "C" {
    fn abs(input: i32) -> i32;
}

fn main() {
    // TODO: call abs(-7) inside an unsafe block and print the result
}`,
    tags: ['ffi', 'extern'],
  },
  {
    id: 'rs-ch19-c-062',
    chapter: 19,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Fully Qualified Syntax for Clashing Methods',
    prompt: `Resolve a name clash between an inherent method and a trait method using fully qualified syntax.

Define \`struct Human;\` with an inherent method \`fn fly(&self)\` that prints "waving arms". Define \`trait Pilot { fn fly(&self); }\` and implement it for \`Human\` so \`fly\` prints "flying a plane". In \`main\`, call the inherent method normally and call the trait method with fully qualified syntax. Expected output:

waving arms
flying a plane`,
    hints: [
      'A plain \`human.fly()\` calls the inherent method by default.',
      'Use \`Pilot::fly(&human)\` (or \`<Human as Pilot>::fly(&human)\`) to call the trait method.',
    ],
    solution: `struct Human;

impl Human {
    fn fly(&self) {
        println!("waving arms");
    }
}

trait Pilot {
    fn fly(&self);
}

impl Pilot for Human {
    fn fly(&self) {
        println!("flying a plane");
    }
}

fn main() {
    let human = Human;
    human.fly();
    Pilot::fly(&human);
}`,
    starter: `struct Human;

impl Human {
    fn fly(&self) {
        println!("waving arms");
    }
}

trait Pilot {
    fn fly(&self);
}

impl Pilot for Human {
    fn fly(&self) {
        println!("flying a plane");
    }
}

fn main() {
    let human = Human;
    // TODO: call the inherent fly, then the Pilot::fly via fully qualified syntax
}`,
    tags: ['fully-qualified-syntax', 'traits'],
  },
  {
    id: 'rs-ch19-c-063',
    chapter: 19,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Fully Qualified Syntax for an Associated Function',
    prompt: `Disambiguate an associated function (no \`self\`) shared by an inherent impl and a trait, using \`<Type as Trait>\` syntax.

Define \`struct Dog;\` with an inherent associated function \`fn baby_name() -> String\` returning "Spot". Define \`trait Animal { fn baby_name() -> String; }\` and implement it for \`Dog\` returning "puppy". In \`main\`, print \`Dog::baby_name()\` (inherent) then print the trait version using fully qualified syntax. Expected output:

Spot
puppy`,
    hints: [
      'Without \`self\`, method-call syntax cannot disambiguate, so you must use \`<Dog as Animal>::baby_name()\`.',
      '\`Dog::baby_name()\` alone resolves to the inherent associated function.',
    ],
    solution: `struct Dog;

impl Dog {
    fn baby_name() -> String {
        String::from("Spot")
    }
}

trait Animal {
    fn baby_name() -> String;
}

impl Animal for Dog {
    fn baby_name() -> String {
        String::from("puppy")
    }
}

fn main() {
    println!("{}", Dog::baby_name());
    println!("{}", <Dog as Animal>::baby_name());
}`,
    starter: `struct Dog;

impl Dog {
    fn baby_name() -> String {
        String::from("Spot")
    }
}

trait Animal {
    fn baby_name() -> String;
}

impl Animal for Dog {
    fn baby_name() -> String {
        String::from("puppy")
    }
}

fn main() {
    // TODO: print the inherent baby_name, then the Animal one via <Dog as Animal>
}`,
    tags: ['fully-qualified-syntax', 'associated-functions'],
  },
  {
    id: 'rs-ch19-c-064',
    chapter: 19,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Newtype to Implement Display for Vec',
    prompt: `Use the newtype pattern to implement an external trait on an external type, working around the orphan rule.

You cannot implement \`Display\` (external trait) directly on \`Vec<String>\` (external type). Define \`struct Wrapper(Vec<String>);\` and implement \`Display\` for \`Wrapper\` so it prints the inner strings joined by ", " and surrounded by square brackets. In \`main\`, build \`Wrapper(vec![String::from("a"), String::from("b")])\` and print it. Expected output:

[a, b]`,
    hints: [
      'The orphan rule blocks \`impl Display for Vec<String>\`; the newtype \`Wrapper\` is local, so the impl is allowed.',
      'Inside \`fmt\`, use \`self.0.join(", ")\` and \`write!(f, "[{}]", ...)\`.',
    ],
    solution: `use std::fmt;

struct Wrapper(Vec<String>);

impl fmt::Display for Wrapper {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "[{}]", self.0.join(", "))
    }
}

fn main() {
    let w = Wrapper(vec![String::from("a"), String::from("b")]);
    println!("{}", w);
}`,
    starter: `use std::fmt;

struct Wrapper(Vec<String>);

// TODO: impl Display for Wrapper, printing [a, b] style

fn main() {
    let w = Wrapper(vec![String::from("a"), String::from("b")]);
    println!("{}", w);
}`,
    tags: ['newtype', 'orphan-rule'],
  },
  {
    id: 'rs-ch19-c-065',
    chapter: 19,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Newtype With Deref for Transparency',
    prompt: `Make a newtype delegate to its inner type by implementing \`Deref\`.

Define \`struct MyVec(Vec<i32>);\` and implement \`std::ops::Deref\` for it with \`type Target = Vec<i32>\` so that \`*\`/method calls forward to the inner \`Vec\`. In \`main\`, build \`MyVec(vec![1, 2, 3])\` and print its \`.len()\` (which works only thanks to deref coercion). Expected output:

3`,
    hints: [
      'Set \`type Target = Vec<i32>;\` and return \`&self.0\` from \`deref\`.',
      'With \`Deref\`, calling \`.len()\` on \`MyVec\` deref-coerces to the inner \`Vec\`.',
    ],
    solution: `use std::ops::Deref;

struct MyVec(Vec<i32>);

impl Deref for MyVec {
    type Target = Vec<i32>;
    fn deref(&self) -> &Vec<i32> {
        &self.0
    }
}

fn main() {
    let v = MyVec(vec![1, 2, 3]);
    println!("{}", v.len());
}`,
    starter: `use std::ops::Deref;

struct MyVec(Vec<i32>);

// TODO: impl Deref for MyVec with Target = Vec<i32>

fn main() {
    let v = MyVec(vec![1, 2, 3]);
    println!("{}", v.len());
}`,
    tags: ['newtype', 'deref'],
  },
  {
    id: 'rs-ch19-c-066',
    chapter: 19,
    kind: 'coding',
    difficulty: 'hard',
    title: 'A Generic Trait Method Selected by Type Annotation',
    prompt: `Call a generic-ish trait implementation chosen by the target type, using a turbofish-free annotation.

Define \`trait Parse { fn from_text(s: &str) -> Self; }\`. Implement it for \`i32\` (parse with \`s.parse().unwrap()\`) and for \`bool\` (return \`s == "yes"\`). In \`main\`, call \`Parse::from_text\` twice: once producing an \`i32\` from "42" and once producing a \`bool\` from "yes", letting type annotations pick the impl. Print both, one per line. Expected output:

42
true`,
    hints: [
      'Annotate the binding type so Rust knows which \`Parse\` impl to use: \`let n: i32 = Parse::from_text("42");\`.',
      'The \`Self\` type in \`from_text(s: &str) -> Self\` is what drives selection.',
    ],
    solution: `trait Parse {
    fn from_text(s: &str) -> Self;
}

impl Parse for i32 {
    fn from_text(s: &str) -> Self {
        s.parse().unwrap()
    }
}

impl Parse for bool {
    fn from_text(s: &str) -> Self {
        s == "yes"
    }
}

fn main() {
    let n: i32 = Parse::from_text("42");
    let b: bool = Parse::from_text("yes");
    println!("{}", n);
    println!("{}", b);
}`,
    starter: `trait Parse {
    fn from_text(s: &str) -> Self;
}

// TODO: impl Parse for i32 and for bool

fn main() {
    let n: i32 = Parse::from_text("42");
    let b: bool = Parse::from_text("yes");
    println!("{}", n);
    println!("{}", b);
}`,
    tags: ['traits', 'associated-functions'],
  },
  {
    id: 'rs-ch19-c-067',
    chapter: 19,
    kind: 'coding',
    difficulty: 'hard',
    title: 'A Macro That Builds a HashMap',
    prompt: `Write a \`macro_rules!\` macro with key-value repetition.

Define \`hashmap!\` so that \`hashmap!{ "a" => 1, "b" => 2 }\` expands to a \`std::collections::HashMap\` with those entries. Support a trailing-comma-free list of \`key => value\` pairs separated by commas. In \`main\`, build such a map, then look up "a" and "b" and print their values, one per line. Expected output:

1
2`,
    hints: [
      'Match \`( $( $k:expr => $v:expr ),* )\` and expand to a block that inserts each pair.',
      'Inside, create \`let mut map = std::collections::HashMap::new();\` then \`$( map.insert($k, $v); )*\` and return \`map\`.',
    ],
    solution: `macro_rules! hashmap {
    ( $( $k:expr => $v:expr ),* ) => {
        {
            let mut map = std::collections::HashMap::new();
            $(
                map.insert($k, $v);
            )*
            map
        }
    };
}

fn main() {
    let m = hashmap! { "a" => 1, "b" => 2 };
    println!("{}", m["a"]);
    println!("{}", m["b"]);
}`,
    starter: `macro_rules! hashmap {
    // TODO: match key => value pairs and insert each into a HashMap
}

fn main() {
    let m = hashmap! { "a" => 1, "b" => 2 };
    println!("{}", m["a"]);
    println!("{}", m["b"]);
}`,
    tags: ['macros', 'hashmap'],
  },
  {
    id: 'rs-ch19-c-068',
    chapter: 19,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Combine AddAssign and an Associated Type',
    prompt: `Implement \`AddAssign\` to overload \`+=\` on a custom type.

Define \`#[derive(Debug)] struct Accumulator { total: i32 }\`. Implement \`std::ops::AddAssign<i32> for Accumulator\` so that \`acc += n\` adds \`n\` to \`total\`. In \`main\`, create \`let mut acc = Accumulator { total: 0 };\`, perform \`acc += 5;\` then \`acc += 10;\`, and print \`acc\` with \`{:?}\`. Expected output:

Accumulator { total: 15 }`,
    hints: [
      '\`AddAssign\` has the method \`fn add_assign(&mut self, rhs: i32)\` and no associated Output type.',
      'Mutate in place: \`self.total += rhs;\`.',
    ],
    solution: `use std::ops::AddAssign;

#[derive(Debug)]
struct Accumulator {
    total: i32,
}

impl AddAssign<i32> for Accumulator {
    fn add_assign(&mut self, rhs: i32) {
        self.total += rhs;
    }
}

fn main() {
    let mut acc = Accumulator { total: 0 };
    acc += 5;
    acc += 10;
    println!("{:?}", acc);
}`,
    starter: `use std::ops::AddAssign;

#[derive(Debug)]
struct Accumulator {
    total: i32,
}

// TODO: impl AddAssign<i32> for Accumulator

fn main() {
    let mut acc = Accumulator { total: 0 };
    acc += 5;
    acc += 10;
    println!("{:?}", acc);
}`,
    tags: ['operator-overloading', 'add-assign'],
  },
  {
    id: 'rs-ch19-c-069',
    chapter: 19,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Dispatch With a HashMap of Boxed Closures',
    prompt: `Store boxed closures in a map and dispatch by name, mixing returning-closures and trait objects.

In \`main\`, build a \`std::collections::HashMap<String, Box<dyn Fn(i32) -> i32>>\`. Insert two entries: "double" mapping to a closure that returns \`x * 2\`, and "negate" mapping to a closure that returns \`-x\`. Then look up "double" and apply it to 21, and look up "negate" and apply it to 21, printing each result on its own line. Expected output:

42
-21`,
    hints: [
      'The value type is \`Box<dyn Fn(i32) -> i32>\`; insert with \`map.insert(String::from("double"), Box::new(|x| x * 2));\`.',
      'Look up with \`map["double"]\` or \`map.get("double").unwrap()\` and call it like a function.',
    ],
    solution: `use std::collections::HashMap;

fn main() {
    let mut map: HashMap<String, Box<dyn Fn(i32) -> i32>> = HashMap::new();
    map.insert(String::from("double"), Box::new(|x| x * 2));
    map.insert(String::from("negate"), Box::new(|x| -x));

    let d = map.get("double").unwrap();
    println!("{}", d(21));
    let n = map.get("negate").unwrap();
    println!("{}", n(21));
}`,
    starter: `use std::collections::HashMap;

fn main() {
    let mut map: HashMap<String, Box<dyn Fn(i32) -> i32>> = HashMap::new();
    // TODO: insert "double" and "negate" closures
    // TODO: look each up and apply to 21, printing the results
}`,
    tags: ['closures', 'box', 'hashmap'],
  },
  {
    id: 'rs-ch19-c-070',
    chapter: 19,
    kind: 'coding',
    difficulty: 'hard',
    title: 'A Generic Add Implementation With a Trait Bound',
    prompt: `Implement \`Add\` generically for a wrapper, requiring the inner type to be addable.

Define \`#[derive(Debug)] struct Pair<T>(T, T);\`. Implement \`std::ops::Add for Pair<T>\` where \`T: Add<Output = T> + Copy\`, so that adding two pairs adds their fields componentwise and yields a \`Pair<T>\`. In \`main\`, compute \`Pair(1, 2) + Pair(10, 20)\` and print it with \`{:?}\`. Expected output:

Pair(11, 22)`,
    hints: [
      'Write \`impl<T: Add<Output = T> + Copy> Add for Pair<T>\` with \`type Output = Pair<T>;\`.',
      'In \`add\`, build \`Pair(self.0 + other.0, self.1 + other.1)\`.',
    ],
    solution: `use std::ops::Add;

#[derive(Debug)]
struct Pair<T>(T, T);

impl<T: Add<Output = T> + Copy> Add for Pair<T> {
    type Output = Pair<T>;
    fn add(self, other: Pair<T>) -> Pair<T> {
        Pair(self.0 + other.0, self.1 + other.1)
    }
}

fn main() {
    println!("{:?}", Pair(1, 2) + Pair(10, 20));
}`,
    starter: `use std::ops::Add;

#[derive(Debug)]
struct Pair<T>(T, T);

// TODO: impl Add for Pair<T> where T: Add<Output = T> + Copy

fn main() {
    println!("{:?}", Pair(1, 2) + Pair(10, 20));
}`,
    tags: ['operator-overloading', 'generics'],
  },
]

export default problems
