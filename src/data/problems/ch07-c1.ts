import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch07-c-001',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Declare an Empty Module',
    prompt: `Declare a module named \`garden\` using the \`mod\` keyword. The module body can be empty for now. Keep an empty \`fn main\` so the program compiles.`,
    hints: [
      'A module is declared with \`mod name { ... }\`.',
      'An empty pair of braces is a valid module body.',
    ],
    solution: `mod garden {}

fn main() {}`,
    starter: `// TODO: declare an empty module named garden

fn main() {}`,
    tags: ['modules', 'mod'],
  },
  {
    id: 'rs-ch07-c-002',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Function Inside a Module',
    prompt: `Create a module named \`math\` that contains a public function \`double\` taking an \`i32\` and returning that value times two. You do not need to call it yet; just make sure the code compiles with an empty \`fn main\`.`,
    hints: [
      'Functions inside a module are private by default, so add \`pub\` to expose it.',
      'The function signature is \`pub fn double(n: i32) -> i32\`.',
    ],
    solution: `mod math {
    pub fn double(n: i32) -> i32 {
        n * 2
    }
}

fn main() {}`,
    starter: `mod math {
    // TODO: add a public function double(n: i32) -> i32
}

fn main() {}`,
    tags: ['modules', 'pub', 'functions'],
  },
  {
    id: 'rs-ch07-c-003',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Call a Module Function With an Absolute Path',
    prompt: `Given a module \`math\` with a public function \`double\`, call it from \`main\` using an absolute path that starts with \`crate\`. Print the result of doubling 21.

Expected output:
42`,
    hints: [
      'An absolute path starts at the crate root with the keyword \`crate\`.',
      'Write \`crate::math::double(21)\`.',
    ],
    solution: `mod math {
    pub fn double(n: i32) -> i32 {
        n * 2
    }
}

fn main() {
    let result = crate::math::double(21);
    println!("{}", result);
}`,
    starter: `mod math {
    pub fn double(n: i32) -> i32 {
        n * 2
    }
}

fn main() {
    // TODO: call double with an absolute path and print the result
}`,
    tags: ['modules', 'paths', 'absolute'],
  },
  {
    id: 'rs-ch07-c-004',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Call a Module Function With a Relative Path',
    prompt: `Given a module \`greetings\` with a public function \`hello\` that prints "hello", call it from \`main\` using a relative path (one that does NOT start with \`crate\`).

Expected output:
hello`,
    hints: [
      'A relative path starts from the current module, so it begins with the module name.',
      'From the crate root, write \`greetings::hello()\`.',
    ],
    solution: `mod greetings {
    pub fn hello() {
        println!("hello");
    }
}

fn main() {
    greetings::hello();
}`,
    starter: `mod greetings {
    pub fn hello() {
        println!("hello");
    }
}

fn main() {
    // TODO: call hello with a relative path
}`,
    tags: ['modules', 'paths', 'relative'],
  },
  {
    id: 'rs-ch07-c-005',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Nested Modules',
    prompt: `Create a module \`outer\` that contains a module \`inner\`, and inside \`inner\` a public function \`ping\` that prints "pong". Make \`inner\` public too. Call the function from \`main\`.

Expected output:
pong`,
    hints: [
      'Both \`inner\` and \`ping\` must be \`pub\` to reach them from outside \`outer\`.',
      'The path is \`outer::inner::ping()\`.',
    ],
    solution: `mod outer {
    pub mod inner {
        pub fn ping() {
            println!("pong");
        }
    }
}

fn main() {
    outer::inner::ping();
}`,
    starter: `mod outer {
    // TODO: add a public module inner with a public fn ping
}

fn main() {
    // TODO: call ping
}`,
    tags: ['modules', 'nested', 'pub'],
  },
  {
    id: 'rs-ch07-c-006',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Bring a Function Into Scope With use',
    prompt: `Given a module \`tools\` with a public function \`saw\` that prints "cutting", bring \`tools::saw\` into scope with a \`use\` statement at the top level, then call \`saw()\` directly in \`main\`.

Expected output:
cutting`,
    hints: [
      'Write \`use crate::tools::saw;\` (or \`use tools::saw;\`) before \`main\`.',
      'After the \`use\`, you can call \`saw()\` without the full path.',
    ],
    solution: `mod tools {
    pub fn saw() {
        println!("cutting");
    }
}

use crate::tools::saw;

fn main() {
    saw();
}`,
    starter: `mod tools {
    pub fn saw() {
        println!("cutting");
    }
}

// TODO: bring tools::saw into scope with use

fn main() {
    // TODO: call saw directly
}`,
    tags: ['use', 'modules', 'scope'],
  },
  {
    id: 'rs-ch07-c-007',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Idiomatic use of a Function Parent',
    prompt: `The idiomatic way to bring a function into scope is to \`use\` its parent module, then call the function qualified by the module name. Given module \`format\` with a public function \`shout\` that prints "HEY", bring the \`format\` module into scope and call \`format::shout()\` in \`main\`.

Expected output:
HEY`,
    hints: [
      'Use the parent: \`use crate::format;\`.',
      'Then call \`format::shout()\` so it is clear the function is not local.',
    ],
    solution: `mod format {
    pub fn shout() {
        println!("HEY");
    }
}

use crate::format;

fn main() {
    format::shout();
}`,
    starter: `mod format {
    pub fn shout() {
        println!("HEY");
    }
}

// TODO: use the parent module format

fn main() {
    // TODO: call format::shout()
}`,
    tags: ['use', 'idiomatic', 'modules'],
  },
  {
    id: 'rs-ch07-c-008',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Public Constant in a Module',
    prompt: `Create a module \`config\` with a public constant \`MAX\` of type \`u32\` equal to 100. From \`main\`, print the constant using the path \`config::MAX\`.

Expected output:
100`,
    hints: [
      'Constants are declared with \`const NAME: Type = value;\`.',
      'Add \`pub\` so the constant is visible outside the module.',
    ],
    solution: `mod config {
    pub const MAX: u32 = 100;
}

fn main() {
    println!("{}", config::MAX);
}`,
    starter: `mod config {
    // TODO: declare a public constant MAX: u32 = 100
}

fn main() {
    // TODO: print config::MAX
}`,
    tags: ['modules', 'pub', 'const'],
  },
  {
    id: 'rs-ch07-c-009',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'use With as to Rename',
    prompt: `Bring the function \`crate::numbers::value\` into scope but rename it to \`v\` using the \`as\` keyword. Then call \`v()\` in \`main\` and print its return value of 7.

Expected output:
7`,
    hints: [
      'The syntax is \`use path as NewName;\`.',
      'After renaming, call \`v()\` instead of \`value()\`.',
    ],
    solution: `mod numbers {
    pub fn value() -> i32 {
        7
    }
}

use crate::numbers::value as v;

fn main() {
    println!("{}", v());
}`,
    starter: `mod numbers {
    pub fn value() -> i32 {
        7
    }
}

// TODO: use numbers::value renamed to v

fn main() {
    // TODO: call v() and print its result
}`,
    tags: ['use', 'as', 'rename'],
  },
  {
    id: 'rs-ch07-c-010',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Public Struct in a Module',
    prompt: `Create a module \`shapes\` containing a public struct \`Point\` with two public fields \`x\` and \`y\`, both \`i32\`. In \`main\`, build a \`shapes::Point\` with x=3, y=4 and print both fields.

Expected output:
3 4`,
    hints: [
      'The struct must be \`pub\`, and each field you access from outside must also be \`pub\`.',
      'Construct it with \`shapes::Point { x: 3, y: 4 }\`.',
    ],
    solution: `mod shapes {
    pub struct Point {
        pub x: i32,
        pub y: i32,
    }
}

fn main() {
    let p = shapes::Point { x: 3, y: 4 };
    println!("{} {}", p.x, p.y);
}`,
    starter: `mod shapes {
    // TODO: public struct Point with public fields x and y (i32)
}

fn main() {
    // TODO: build a Point and print x and y
}`,
    tags: ['modules', 'structs', 'pub'],
  },
  {
    id: 'rs-ch07-c-011',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Public Enum in a Module',
    prompt: `Create a module \`weather\` with a public enum \`Sky\` that has variants \`Clear\` and \`Cloudy\`. In \`main\`, create a \`weather::Sky::Clear\` value and use a \`match\` to print "clear" or "cloudy".

Expected output:
clear`,
    hints: [
      'Making an enum \`pub\` makes all of its variants public automatically.',
      'Reach the variant with \`weather::Sky::Clear\`.',
    ],
    solution: `mod weather {
    pub enum Sky {
        Clear,
        Cloudy,
    }
}

fn main() {
    let s = weather::Sky::Clear;
    match s {
        weather::Sky::Clear => println!("clear"),
        weather::Sky::Cloudy => println!("cloudy"),
    }
}`,
    starter: `mod weather {
    // TODO: public enum Sky with variants Clear and Cloudy
}

fn main() {
    // TODO: create a Clear value and match on it
}`,
    tags: ['modules', 'enums', 'pub'],
  },
  {
    id: 'rs-ch07-c-012',
    chapter: 7,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Bring use Inside main',
    prompt: `A \`use\` statement can also go inside a function so the name is only in scope there. Given module \`audio\` with a public function \`play\` that prints "playing", put a \`use\` statement inside \`main\` to bring \`audio::play\` into scope, then call \`play()\`.

Expected output:
playing`,
    hints: [
      'Place \`use crate::audio::play;\` as the first line inside \`main\`.',
      'The brought-in name is only valid within that function body.',
    ],
    solution: `mod audio {
    pub fn play() {
        println!("playing");
    }
}

fn main() {
    use crate::audio::play;
    play();
}`,
    starter: `mod audio {
    pub fn play() {
        println!("playing");
    }
}

fn main() {
    // TODO: use audio::play here, then call it
}`,
    tags: ['use', 'scope', 'modules'],
  },
  {
    id: 'rs-ch07-c-013',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Sibling Modules Calling Each Other',
    prompt: `Inside a module \`kitchen\`, create two sibling submodules: \`oven\` with a public function \`bake\` that returns the string "baked bread", and a public function \`serve\` directly in \`kitchen\` that calls \`oven::bake()\` and prints the result. Make \`oven\` public. From \`main\`, call \`kitchen::serve()\`.

Expected output:
baked bread`,
    hints: [
      'Inside \`kitchen\`, \`oven\` is a child, so \`serve\` can reach it with a relative path \`oven::bake()\`.',
      'Both \`oven\` and \`bake\` must be \`pub\`.',
    ],
    solution: `mod kitchen {
    pub mod oven {
        pub fn bake() -> String {
            String::from("baked bread")
        }
    }

    pub fn serve() {
        println!("{}", oven::bake());
    }
}

fn main() {
    kitchen::serve();
}`,
    starter: `mod kitchen {
    pub mod oven {
        // TODO: pub fn bake returning "baked bread"
    }

    pub fn serve() {
        // TODO: call oven::bake() and print it
    }
}

fn main() {
    kitchen::serve();
}`,
    tags: ['modules', 'paths', 'relative'],
  },
  {
    id: 'rs-ch07-c-014',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Reach the Parent With super',
    prompt: `At the crate root, define a public function \`deliver\` that prints "delivered". Inside a module \`shipping\`, write a public function \`send\` that calls the root \`deliver\` using the \`super\` keyword. Call \`shipping::send()\` from \`main\`.

Expected output:
delivered`,
    hints: [
      '\`super\` refers to the parent module; from inside \`shipping\` the parent is the crate root.',
      'Write \`super::deliver()\` inside \`send\`.',
    ],
    solution: `fn deliver() {
    println!("delivered");
}

mod shipping {
    pub fn send() {
        super::deliver();
    }
}

fn main() {
    shipping::send();
}`,
    starter: `fn deliver() {
    println!("delivered");
}

mod shipping {
    pub fn send() {
        // TODO: call the parent's deliver using super
    }
}

fn main() {
    shipping::send();
}`,
    tags: ['super', 'modules', 'paths'],
  },
  {
    id: 'rs-ch07-c-015',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'super From a Nested Module',
    prompt: `Create a module \`a\` with a public function \`name\` returning "a", and a public submodule \`b\` inside \`a\` with a public function \`report\` that calls \`super::name()\` and prints the result. Call \`a::b::report()\` from \`main\`.

Expected output:
a`,
    hints: [
      'From inside \`a::b\`, \`super\` is module \`a\`.',
      'So \`super::name()\` calls the \`name\` function in \`a\`.',
    ],
    solution: `mod a {
    pub fn name() -> &'static str {
        "a"
    }

    pub mod b {
        pub fn report() {
            println!("{}", super::name());
        }
    }
}

fn main() {
    a::b::report();
}`,
    starter: `mod a {
    pub fn name() -> &'static str {
        "a"
    }

    pub mod b {
        pub fn report() {
            // TODO: print the result of the parent's name() using super
        }
    }
}

fn main() {
    a::b::report();
}`,
    tags: ['super', 'nested', 'modules'],
  },
  {
    id: 'rs-ch07-c-016',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Private Helper Used Publicly',
    prompt: `Create a module \`stats\` with a PRIVATE function \`square\` (no \`pub\`) that returns its \`i32\` input squared, and a PUBLIC function \`sum_of_squares\` that returns \`square(a) + square(b)\`. From \`main\`, print \`stats::sum_of_squares(3, 4)\`.

Expected output:
25`,
    hints: [
      'A child item (the private \`square\`) is callable by its siblings within the same module.',
      'Only \`sum_of_squares\` needs \`pub\` because that is what \`main\` calls.',
    ],
    solution: `mod stats {
    fn square(n: i32) -> i32 {
        n * n
    }

    pub fn sum_of_squares(a: i32, b: i32) -> i32 {
        square(a) + square(b)
    }
}

fn main() {
    println!("{}", stats::sum_of_squares(3, 4));
}`,
    starter: `mod stats {
    fn square(n: i32) -> i32 {
        n * n
    }

    pub fn sum_of_squares(a: i32, b: i32) -> i32 {
        // TODO: return square(a) + square(b)
    }
}

fn main() {
    println!("{}", stats::sum_of_squares(3, 4));
}`,
    tags: ['modules', 'privacy', 'pub'],
  },
  {
    id: 'rs-ch07-c-017',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Struct With a Private Field and a Constructor',
    prompt: `Create a module \`bank\` with a public struct \`Account\` that has a PUBLIC field \`owner: String\` and a PRIVATE field \`balance: i32\`. Because \`balance\` is private, add a public associated function \`Account::new(owner: String)\` that creates an account with balance 0. From \`main\`, build an account for "alice" and print the owner.

Expected output:
alice`,
    hints: [
      'When a struct has a private field, code outside the module cannot use the \`{ ... }\` struct literal, so it needs a constructor.',
      'Write \`impl Account\` with \`pub fn new\` returning \`Account { owner, balance: 0 }\`.',
    ],
    solution: `mod bank {
    pub struct Account {
        pub owner: String,
        balance: i32,
    }

    impl Account {
        pub fn new(owner: String) -> Account {
            Account { owner, balance: 0 }
        }
    }
}

fn main() {
    let acc = bank::Account::new(String::from("alice"));
    println!("{}", acc.owner);
}`,
    starter: `mod bank {
    pub struct Account {
        pub owner: String,
        balance: i32,
    }

    impl Account {
        // TODO: pub fn new(owner: String) -> Account with balance 0
    }
}

fn main() {
    let acc = bank::Account::new(String::from("alice"));
    println!("{}", acc.owner);
}`,
    tags: ['structs', 'privacy', 'modules'],
  },
  {
    id: 'rs-ch07-c-018',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'use a Type to Shorten a Struct Path',
    prompt: `Given a module \`geometry\` with a public struct \`Rect\` (public fields \`w\` and \`h\`, both \`u32\`), bring \`geometry::Rect\` into scope with \`use\` so you can write just \`Rect\` in \`main\`. Build a 4-by-5 rectangle and print its area (w*h).

Expected output:
20`,
    hints: [
      'For structs and enums, it is idiomatic to \`use\` the full path to the type itself.',
      'Write \`use crate::geometry::Rect;\` then \`Rect { w: 4, h: 5 }\`.',
    ],
    solution: `mod geometry {
    pub struct Rect {
        pub w: u32,
        pub h: u32,
    }
}

use crate::geometry::Rect;

fn main() {
    let r = Rect { w: 4, h: 5 };
    println!("{}", r.w * r.h);
}`,
    starter: `mod geometry {
    pub struct Rect {
        pub w: u32,
        pub h: u32,
    }
}

// TODO: use geometry::Rect

fn main() {
    // TODO: build a 4x5 Rect and print its area
}`,
    tags: ['use', 'structs', 'idiomatic'],
  },
  {
    id: 'rs-ch07-c-019',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'use an Enum Type',
    prompt: `Given a module \`traffic\` with a public enum \`Light\` (variants \`Red\`, \`Green\`), bring the \`Light\` type into scope with \`use\`. In \`main\`, create \`Light::Green\` and match on it to print "go" or "stop".

Expected output:
go`,
    hints: [
      'Bring the type itself into scope: \`use crate::traffic::Light;\`.',
      'After the \`use\`, write \`Light::Green\` instead of the full path.',
    ],
    solution: `mod traffic {
    pub enum Light {
        Red,
        Green,
    }
}

use crate::traffic::Light;

fn main() {
    let l = Light::Green;
    match l {
        Light::Green => println!("go"),
        Light::Red => println!("stop"),
    }
}`,
    starter: `mod traffic {
    pub enum Light {
        Red,
        Green,
    }
}

// TODO: use traffic::Light

fn main() {
    // TODO: create Light::Green and match on it
}`,
    tags: ['use', 'enums', 'match'],
  },
  {
    id: 'rs-ch07-c-020',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Two Functions From the Same Module',
    prompt: `Given a module \`mathx\` with public functions \`inc\` (adds 1) and \`dec\` (subtracts 1), both taking and returning \`i32\`, bring the \`mathx\` module into scope and call both functions in \`main\`. Print \`inc(10)\` then \`dec(10)\` on separate lines.

Expected output:
11
9`,
    hints: [
      'Bring the parent module into scope with \`use crate::mathx;\`.',
      'Then call \`mathx::inc(10)\` and \`mathx::dec(10)\`.',
    ],
    solution: `mod mathx {
    pub fn inc(n: i32) -> i32 {
        n + 1
    }
    pub fn dec(n: i32) -> i32 {
        n - 1
    }
}

use crate::mathx;

fn main() {
    println!("{}", mathx::inc(10));
    println!("{}", mathx::dec(10));
}`,
    starter: `mod mathx {
    pub fn inc(n: i32) -> i32 {
        n + 1
    }
    pub fn dec(n: i32) -> i32 {
        n - 1
    }
}

// TODO: use the mathx module

fn main() {
    // TODO: print mathx::inc(10) and mathx::dec(10)
}`,
    tags: ['use', 'modules', 'functions'],
  },
  {
    id: 'rs-ch07-c-021',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Nested Paths in a Single use',
    prompt: `Given a module \`pkg\` with public functions \`one\` (returns 1) and \`two\` (returns 2), bring BOTH into scope with a single \`use\` statement using nested-path syntax with curly braces. Print their sum in \`main\`.

Expected output:
3`,
    hints: [
      'Nested paths look like \`use crate::pkg::{one, two};\`.',
      'After the \`use\`, call \`one()\` and \`two()\` directly.',
    ],
    solution: `mod pkg {
    pub fn one() -> i32 {
        1
    }
    pub fn two() -> i32 {
        2
    }
}

use crate::pkg::{one, two};

fn main() {
    println!("{}", one() + two());
}`,
    starter: `mod pkg {
    pub fn one() -> i32 {
        1
    }
    pub fn two() -> i32 {
        2
    }
}

// TODO: bring both one and two into scope with one use and nested paths

fn main() {
    // TODO: print one() + two()
}`,
    tags: ['use', 'nested-paths', 'modules'],
  },
  {
    id: 'rs-ch07-c-022',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Nested Paths With self',
    prompt: `Given a module \`tree\` containing a public function \`root\` (returns "root") and a public submodule \`branch\` with a public function \`leaf\` (returns "leaf"), use the nested-path \`self\` form to bring BOTH \`tree\` itself and \`tree::branch\` into scope in one \`use\` statement. Then in \`main\` print \`tree::root()\` and \`branch::leaf()\`.

Expected output:
root
leaf`,
    hints: [
      'The combined form is \`use crate::tree::{self, branch};\`.',
      '\`self\` here means the \`tree\` module itself, so \`tree::root()\` works.',
    ],
    solution: `mod tree {
    pub fn root() -> &'static str {
        "root"
    }
    pub mod branch {
        pub fn leaf() -> &'static str {
            "leaf"
        }
    }
}

use crate::tree::{self, branch};

fn main() {
    println!("{}", tree::root());
    println!("{}", branch::leaf());
}`,
    starter: `mod tree {
    pub fn root() -> &'static str {
        "root"
    }
    pub mod branch {
        pub fn leaf() -> &'static str {
            "leaf"
        }
    }
}

// TODO: bring tree (self) and tree::branch into scope in one use

fn main() {
    // TODO: print tree::root() and branch::leaf()
}`,
    tags: ['use', 'nested-paths', 'self'],
  },
  {
    id: 'rs-ch07-c-023',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'The Glob Operator',
    prompt: `Given a module \`palette\` with public functions \`red\`, \`green\`, and \`blue\` (each returning the matching color name string), use the glob operator to bring ALL public items of \`palette\` into scope at once. Then in \`main\` print the results of \`red()\`, \`green()\`, and \`blue()\` on separate lines.

Expected output:
red
green
blue`,
    hints: [
      'The glob operator is \`*\`: \`use crate::palette::*;\`.',
      'After the glob, you can call \`red()\`, \`green()\`, and \`blue()\` directly.',
    ],
    solution: `mod palette {
    pub fn red() -> &'static str {
        "red"
    }
    pub fn green() -> &'static str {
        "green"
    }
    pub fn blue() -> &'static str {
        "blue"
    }
}

use crate::palette::*;

fn main() {
    println!("{}", red());
    println!("{}", green());
    println!("{}", blue());
}`,
    starter: `mod palette {
    pub fn red() -> &'static str {
        "red"
    }
    pub fn green() -> &'static str {
        "green"
    }
    pub fn blue() -> &'static str {
        "blue"
    }
}

// TODO: glob-import everything from palette

fn main() {
    // TODO: print red(), green(), blue()
}`,
    tags: ['use', 'glob', 'modules'],
  },
  {
    id: 'rs-ch07-c-024',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Re-export With pub use',
    prompt: `Create a module \`internal\` with a deeply nested public function: \`internal::deep::area\` returning 50. At the crate root, re-export it with \`pub use\` so external code could call it as \`crate::area\`. In \`main\`, call \`area()\` (the re-exported name is in scope locally too) and print its result.

Expected output:
50`,
    hints: [
      'Re-export with \`pub use crate::internal::deep::area;\` at the crate root.',
      '\`pub use\` brings the name into scope here AND makes it part of this module path.',
    ],
    solution: `mod internal {
    pub mod deep {
        pub fn area() -> i32 {
            50
        }
    }
}

pub use crate::internal::deep::area;

fn main() {
    println!("{}", area());
}`,
    starter: `mod internal {
    pub mod deep {
        pub fn area() -> i32 {
            50
        }
    }
}

// TODO: re-export internal::deep::area with pub use

fn main() {
    // TODO: call area() and print it
}`,
    tags: ['pub-use', 're-export', 'modules'],
  },
  {
    id: 'rs-ch07-c-025',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Re-export to Flatten a Path',
    prompt: `Create a module \`api\` that contains a private submodule \`v1\` with a public function \`status\` returning "ok". Inside \`api\`, add a \`pub use\` so that callers can reach the function as \`api::status\` instead of the longer (and inaccessible) inner path. From \`main\`, call \`api::status()\` and print it.

Expected output:
ok`,
    hints: [
      'Inside \`api\`, write \`pub use self::v1::status;\` (or \`pub use v1::status;\`).',
      'The \`v1\` module can stay private because the re-export exposes only the function.',
    ],
    solution: `mod api {
    mod v1 {
        pub fn status() -> &'static str {
            "ok"
        }
    }

    pub use self::v1::status;
}

fn main() {
    println!("{}", api::status());
}`,
    starter: `mod api {
    mod v1 {
        pub fn status() -> &'static str {
            "ok"
        }
    }

    // TODO: pub use to re-export v1::status as api::status
}

fn main() {
    println!("{}", api::status());
}`,
    tags: ['pub-use', 're-export', 'privacy'],
  },
  {
    id: 'rs-ch07-c-026',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Function Calling Across Sibling Modules',
    prompt: `At the crate root, create two sibling modules \`front\` and \`back\`. Module \`back\` has a public function \`data\` returning the number 9. Module \`front\` has a public function \`show\` that calls \`back::data\` and prints it. Because \`front\` and \`back\` are siblings, \`show\` must reach \`back\` via \`crate::back\` or \`super::back\`. Use an absolute path. Call \`front::show()\` from \`main\`.

Expected output:
9`,
    hints: [
      'From inside \`front::show\`, the path to a sibling module is \`crate::back::data()\`.',
      'Alternatively \`super::back::data()\` works because the parent of \`front\` is the crate root.',
    ],
    solution: `mod front {
    pub fn show() {
        println!("{}", crate::back::data());
    }
}

mod back {
    pub fn data() -> i32 {
        9
    }
}

fn main() {
    front::show();
}`,
    starter: `mod front {
    pub fn show() {
        // TODO: call back::data() via an absolute path and print it
    }
}

mod back {
    pub fn data() -> i32 {
        9
    }
}

fn main() {
    front::show();
}`,
    tags: ['paths', 'absolute', 'modules'],
  },
  {
    id: 'rs-ch07-c-027',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Three Levels Deep',
    prompt: `Build a module tree three levels deep: \`level1::level2::level3\`, where \`level3\` has a public function \`depth\` returning the number 3. Make every module along the way public. From \`main\`, call the function with its full absolute path and print the result.

Expected output:
3`,
    hints: [
      'Each enclosing module (\`level2\`, \`level3\`) must be \`pub\` to traverse it from outside.',
      'The absolute path is \`crate::level1::level2::level3::depth()\`.',
    ],
    solution: `mod level1 {
    pub mod level2 {
        pub mod level3 {
            pub fn depth() -> i32 {
                3
            }
        }
    }
}

fn main() {
    println!("{}", crate::level1::level2::level3::depth());
}`,
    starter: `mod level1 {
    // TODO: pub mod level2 { pub mod level3 { pub fn depth() -> i32 } }
}

fn main() {
    // TODO: call the deeply nested function with its absolute path
}`,
    tags: ['modules', 'nested', 'paths'],
  },
  {
    id: 'rs-ch07-c-028',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Per-Field Struct Visibility',
    prompt: `Create a module \`profile\` with a public struct \`User\` that has a PUBLIC field \`name: String\` and a PRIVATE field \`age: u32\`. Add a public constructor \`User::new(name: String, age: u32)\` and a public method \`age_or_default\` that returns the private \`age\`. From \`main\`, build a user "bob" aged 40, then print \`name\` directly and the age via the method.

Expected output:
bob
40`,
    hints: [
      'You can read the private \`age\` field only through code defined inside the \`profile\` module, such as a method.',
      'The constructor is needed because outside code cannot set the private field with a struct literal.',
    ],
    solution: `mod profile {
    pub struct User {
        pub name: String,
        age: u32,
    }

    impl User {
        pub fn new(name: String, age: u32) -> User {
            User { name, age }
        }
        pub fn age_or_default(&self) -> u32 {
            self.age
        }
    }
}

fn main() {
    let u = profile::User::new(String::from("bob"), 40);
    println!("{}", u.name);
    println!("{}", u.age_or_default());
}`,
    starter: `mod profile {
    pub struct User {
        pub name: String,
        age: u32,
    }

    impl User {
        // TODO: pub fn new(name, age) -> User
        // TODO: pub fn age_or_default(&self) -> u32 returning self.age
    }
}

fn main() {
    let u = profile::User::new(String::from("bob"), 40);
    println!("{}", u.name);
    println!("{}", u.age_or_default());
}`,
    tags: ['structs', 'privacy', 'methods'],
  },
  {
    id: 'rs-ch07-c-029',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'use Two Modules at Once With Nested Paths',
    prompt: `At the crate root create modules \`alpha\` (public fn \`a\` returns "A") and \`beta\` (public fn \`b\` returns "B"). With a single \`use\` statement and nested-path braces rooted at \`crate\`, bring BOTH modules into scope. Then in \`main\` print \`alpha::a()\` and \`beta::b()\`.

Expected output:
A
B`,
    hints: [
      'You can nest the shared \`crate\` prefix: \`use crate::{alpha, beta};\`.',
      'This brings both module names into scope so \`alpha::a()\` and \`beta::b()\` work.',
    ],
    solution: `mod alpha {
    pub fn a() -> &'static str {
        "A"
    }
}

mod beta {
    pub fn b() -> &'static str {
        "B"
    }
}

use crate::{alpha, beta};

fn main() {
    println!("{}", alpha::a());
    println!("{}", beta::b());
}`,
    starter: `mod alpha {
    pub fn a() -> &'static str {
        "A"
    }
}

mod beta {
    pub fn b() -> &'static str {
        "B"
    }
}

// TODO: bring both alpha and beta into scope with one use

fn main() {
    // TODO: print alpha::a() and beta::b()
}`,
    tags: ['use', 'nested-paths', 'modules'],
  },
  {
    id: 'rs-ch07-c-030',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Method Reaching a Module Function',
    prompt: `Create a module \`taxes\` with a public function \`rate\` returning the integer 7. At the crate root define a public struct \`Price\` with a public field \`amount: i32\` and a method \`with_tax\` that returns \`amount + taxes::rate()\`. In \`main\`, build a \`Price\` of 100 and print the result of \`with_tax\`.

Expected output:
107`,
    hints: [
      'Inside the method, reach the module function with \`crate::taxes::rate()\` or \`taxes::rate()\`.',
      'The method body is \`self.amount + taxes::rate()\`.',
    ],
    solution: `mod taxes {
    pub fn rate() -> i32 {
        7
    }
}

struct Price {
    amount: i32,
}

impl Price {
    fn with_tax(&self) -> i32 {
        self.amount + taxes::rate()
    }
}

fn main() {
    let p = Price { amount: 100 };
    println!("{}", p.with_tax());
}`,
    starter: `mod taxes {
    pub fn rate() -> i32 {
        7
    }
}

struct Price {
    amount: i32,
}

impl Price {
    fn with_tax(&self) -> i32 {
        // TODO: return self.amount plus taxes::rate()
    }
}

fn main() {
    let p = Price { amount: 100 };
    println!("{}", p.with_tax());
}`,
    tags: ['modules', 'methods', 'paths'],
  },
  {
    id: 'rs-ch07-c-031',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Glob Import an Enum Variants Set',
    prompt: `Given a module \`cards\` with a public enum \`Suit\` (variants \`Hearts\`, \`Spades\`), glob-import everything from \`cards\` and also write \`use crate::cards::Suit::*;\` so you can name the variants \`Hearts\` and \`Spades\` without the \`Suit::\` prefix. In \`main\`, create a \`Hearts\` value and match it to print "red" (Hearts) or "black" (Spades).

Expected output:
red`,
    hints: [
      'Bring the variants directly into scope with \`use crate::cards::Suit::*;\`.',
      'After that, you can write the bare variant names in the match arms.',
    ],
    solution: `mod cards {
    pub enum Suit {
        Hearts,
        Spades,
    }
}

use crate::cards::Suit;
use crate::cards::Suit::*;

fn main() {
    let s: Suit = Hearts;
    match s {
        Hearts => println!("red"),
        Spades => println!("black"),
    }
}`,
    starter: `mod cards {
    pub enum Suit {
        Hearts,
        Spades,
    }
}

use crate::cards::Suit;
// TODO: glob-import the Suit variants

fn main() {
    let s: Suit = Hearts;
    match s {
        Hearts => println!("red"),
        Spades => println!("black"),
    }
}`,
    tags: ['use', 'glob', 'enums'],
  },
  {
    id: 'rs-ch07-c-032',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Two-Branch Module Tree With a Shared Helper',
    prompt: `Build this tree: a module \`util\` with a public function \`triple\` (returns input times 3); a module \`feature\` with a public function \`run\` that calls \`crate::util::triple(4)\` and prints the result. Call \`feature::run()\` from \`main\`.

Expected output:
12`,
    hints: [
      '\`feature\` and \`util\` are siblings at the crate root.',
      'From inside \`feature::run\`, use the absolute path \`crate::util::triple(4)\`.',
    ],
    solution: `mod util {
    pub fn triple(n: i32) -> i32 {
        n * 3
    }
}

mod feature {
    pub fn run() {
        println!("{}", crate::util::triple(4));
    }
}

fn main() {
    feature::run();
}`,
    starter: `mod util {
    pub fn triple(n: i32) -> i32 {
        n * 3
    }
}

mod feature {
    pub fn run() {
        // TODO: print crate::util::triple(4)
    }
}

fn main() {
    feature::run();
}`,
    tags: ['modules', 'paths', 'absolute'],
  },
  {
    id: 'rs-ch07-c-033',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Re-export the Constructor of a Private-Field Struct',
    prompt: `Create a module \`lib\` containing a public struct \`Token\` with a single PRIVATE field \`value: i32\`, plus a public constructor \`Token::new(value: i32)\` and a public method \`get\` returning the value. At the crate root, \`pub use\` the \`Token\` type so it is reachable as \`crate::Token\`. In \`main\`, refer to it as just \`Token\` (already in scope from the re-export), build one with value 5, and print \`get()\`.

Expected output:
5`,
    hints: [
      'The private field forces callers to use \`Token::new\`.',
      'A \`pub use crate::lib::Token;\` at the root both re-exports and brings the name into local scope.',
    ],
    solution: `mod lib {
    pub struct Token {
        value: i32,
    }

    impl Token {
        pub fn new(value: i32) -> Token {
            Token { value }
        }
        pub fn get(&self) -> i32 {
            self.value
        }
    }
}

pub use crate::lib::Token;

fn main() {
    let t = Token::new(5);
    println!("{}", t.get());
}`,
    starter: `mod lib {
    pub struct Token {
        value: i32,
    }

    impl Token {
        pub fn new(value: i32) -> Token {
            Token { value }
        }
        pub fn get(&self) -> i32 {
            self.value
        }
    }
}

// TODO: pub use to re-export lib::Token

fn main() {
    let t = Token::new(5);
    println!("{}", t.get());
}`,
    tags: ['pub-use', 'structs', 'privacy'],
  },
  {
    id: 'rs-ch07-c-034',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Mixing super and Re-export',
    prompt: `At the crate root, define a public function \`base\` returning 10. Create a module \`plugin\` with: a public function \`extra\` returning \`super::base() + 5\`, and a \`pub use\` re-exporting the crate-root \`base\` so it is also reachable as \`plugin::base\`. From \`main\`, print \`plugin::extra()\` and \`plugin::base()\`.

Expected output:
15
10`,
    hints: [
      'Inside \`plugin\`, the parent is the crate root, so \`super::base()\` calls the root function.',
      'Re-export with \`pub use super::base;\` (or \`pub use crate::base;\`) inside \`plugin\`.',
    ],
    solution: `pub fn base() -> i32 {
    10
}

mod plugin {
    pub fn extra() -> i32 {
        super::base() + 5
    }

    pub use super::base;
}

fn main() {
    println!("{}", plugin::extra());
    println!("{}", plugin::base());
}`,
    starter: `pub fn base() -> i32 {
    10
}

mod plugin {
    pub fn extra() -> i32 {
        // TODO: return super::base() + 5
    }

    // TODO: pub use to re-export the root base as plugin::base
}

fn main() {
    println!("{}", plugin::extra());
    println!("{}", plugin::base());
}`,
    tags: ['super', 'pub-use', 'modules'],
  },
  {
    id: 'rs-ch07-c-035',
    chapter: 7,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Small Restaurant Module Tree',
    prompt: `Recreate a small version of the book's restaurant example. Build:
- a module \`front_of_house\` containing a public submodule \`hosting\` with a public function \`add_to_waitlist\` that prints "added".
- a public function \`eat_at_restaurant\` at the crate root that brings \`crate::front_of_house::hosting\` into scope with a \`use\` statement and then calls \`hosting::add_to_waitlist()\`.
Call \`eat_at_restaurant()\` from \`main\`.

Expected output:
added`,
    hints: [
      'Place \`use crate::front_of_house::hosting;\` at the crate root (before the functions).',
      'Then \`eat_at_restaurant\` can call \`hosting::add_to_waitlist()\`.',
    ],
    solution: `mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {
            println!("added");
        }
    }
}

use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
}

fn main() {
    eat_at_restaurant();
}`,
    starter: `mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {
            println!("added");
        }
    }
}

// TODO: use crate::front_of_house::hosting

pub fn eat_at_restaurant() {
    // TODO: call hosting::add_to_waitlist()
}

fn main() {
    eat_at_restaurant();
}`,
    tags: ['use', 'modules', 'idiomatic'],
  },
]

export default problems
