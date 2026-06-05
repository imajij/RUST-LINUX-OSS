import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch07-c-036',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Call a Function in a Public Module',
    prompt: `Define a module named greetings that contains a public function hello() which prints exactly:
Hello from the module!
In main, call greetings::hello(). Everything is in one file.`,
    hints: [
      'Declare the module with mod greetings { ... }.',
      'A function must be marked pub to be called from outside its module.',
      'Call it with the path greetings::hello().',
    ],
    solution: `mod greetings {
    pub fn hello() {
        println!("Hello from the module!");
    }
}

fn main() {
    greetings::hello();
}`,
    starter: `mod greetings {
    // TODO: add a public fn hello()
}

fn main() {
    // TODO: call greetings::hello()
}`,
    tags: ['modules', 'pub', 'paths'],
  },
  {
    id: 'rs-ch07-c-037',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Reach Into a Nested Module',
    prompt: `Build this module tree in one file:
- a module front_of_house
  - inside it, a module hosting
    - inside that, a public function add_to_waitlist() that prints "added".
Make every module on the path public as needed. In main, call the function using its full path starting from the crate, then print "added".`,
    hints: [
      'Both front_of_house and hosting must be pub so the path is reachable from main.',
      'The full path is front_of_house::hosting::add_to_waitlist().',
    ],
    solution: `mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {
            println!("added");
        }
    }
}

fn main() {
    front_of_house::hosting::add_to_waitlist();
}`,
    starter: `mod front_of_house {
    // TODO: nested pub mod hosting with pub fn add_to_waitlist()
}

fn main() {
    // TODO: call the nested function
}`,
    tags: ['modules', 'module-tree', 'pub'],
  },
  {
    id: 'rs-ch07-c-038',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Absolute vs Relative Path',
    prompt: `Create a module garden with a public function plant() that prints "planted". In main, call plant() twice: once using an absolute path that starts with crate, and once using a relative path that starts with the module name. The program should print "planted" twice.`,
    hints: [
      'An absolute path begins with crate::',
      'A relative path from main begins with the module name itself.',
    ],
    solution: `mod garden {
    pub fn plant() {
        println!("planted");
    }
}

fn main() {
    crate::garden::plant();
    garden::plant();
}`,
    starter: `mod garden {
    pub fn plant() {
        println!("planted");
    }
}

fn main() {
    // TODO: call plant() once with an absolute path, once with a relative path
}`,
    tags: ['paths', 'absolute', 'relative'],
  },
  {
    id: 'rs-ch07-c-039',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Bring a Function Into Scope With use',
    prompt: `Define a module utils with a public function shout(text: &str) that prints the text in uppercase (use to_uppercase()). At the crate root, bring utils::shout into scope with a use statement so that in main you can call shout("hi") directly (without the utils:: prefix). The output should be:
HI`,
    hints: [
      'Write use utils::shout; at the top level (outside main).',
      'to_uppercase() returns a new String.',
    ],
    solution: `mod utils {
    pub fn shout(text: &str) {
        println!("{}", text.to_uppercase());
    }
}

use utils::shout;

fn main() {
    shout("hi");
}`,
    starter: `mod utils {
    pub fn shout(text: &str) {
        println!("{}", text.to_uppercase());
    }
}

// TODO: use statement here

fn main() {
    // TODO: call shout("hi") directly
}`,
    tags: ['use', 'modules', 'scope'],
  },
  {
    id: 'rs-ch07-c-040',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Idiomatic use for a Function',
    prompt: `The idiomatic way to bring a function into scope is to use its parent module, then call it with the module name as a prefix. Define a module math with a public function square(n: i32) -> i32 returning n * n. Bring the math module's parent path into scope idiomatically so that in main you call math::square(5) and print 25. (Bring the module into scope, not the function itself.)`,
    hints: [
      'For functions, idiomatic Rust brings the parent module into scope: use crate::math; would be redundant here since math is already at the root, so just call math::square.',
      'The point: write use ... to make the path shorter, then prefix with the module name when calling.',
    ],
    solution: `mod outer {
    pub mod math {
        pub fn square(n: i32) -> i32 {
            n * n
        }
    }
}

use outer::math;

fn main() {
    println!("{}", math::square(5));
}`,
    starter: `mod outer {
    pub mod math {
        pub fn square(n: i32) -> i32 {
            n * n
        }
    }
}

// TODO: idiomatically bring math into scope

fn main() {
    // TODO: call math::square(5) and print it
}`,
    tags: ['use', 'idiomatic', 'modules'],
  },
  {
    id: 'rs-ch07-c-041',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Idiomatic use for a Type',
    prompt: `For structs, enums, and other types, idiomatic Rust brings the full type into scope with use. Define a module shapes with a public struct Point that has public fields x (i32) and y (i32). Bring shapes::Point directly into scope with use, then in main create a Point { x: 3, y: 4 } and print "3,4".`,
    hints: [
      'Unlike functions, for types you bring the type itself into scope: use shapes::Point;',
      'Both the struct and its fields must be pub to construct it from outside.',
    ],
    solution: `mod shapes {
    pub struct Point {
        pub x: i32,
        pub y: i32,
    }
}

use shapes::Point;

fn main() {
    let p = Point { x: 3, y: 4 };
    println!("{},{}", p.x, p.y);
}`,
    starter: `mod shapes {
    pub struct Point {
        pub x: i32,
        pub y: i32,
    }
}

// TODO: bring Point into scope

fn main() {
    // TODO: create a Point and print "x,y"
}`,
    tags: ['use', 'structs', 'idiomatic'],
  },
  {
    id: 'rs-ch07-c-042',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Rename an Import With as',
    prompt: `Two modules each export a type named Result-like wrapper. To avoid a name clash, bring one in under a different name with the as keyword. Define module fmt with a public struct Error (a unit struct), and module io with a public struct Error (a unit struct). In main, bring both into scope, renaming io::Error to IoError with as, then construct both fmt::Error (as Error) and IoError. Print "both ok".`,
    hints: [
      'use io::Error as IoError; gives the second type a new local name.',
      'Unit structs are constructed by just naming them: let e = Error;',
    ],
    solution: `mod fmt {
    pub struct Error;
}

mod io {
    pub struct Error;
}

use fmt::Error;
use io::Error as IoError;

fn main() {
    let _a = Error;
    let _b = IoError;
    println!("both ok");
}`,
    starter: `mod fmt {
    pub struct Error;
}

mod io {
    pub struct Error;
}

// TODO: bring both Error types into scope, renaming one with as

fn main() {
    // TODO: construct both, print "both ok"
}`,
    tags: ['use', 'as', 'naming'],
  },
  {
    id: 'rs-ch07-c-043',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Call a Sibling With super',
    prompt: `Model a kitchen. Create a module back_of_house with:
- a public function fix_incorrect_order() that calls cook_order() and then calls a function deliver() defined OUTSIDE back_of_house (at the crate root) using super.
- a function cook_order() (no need for pub) that prints "cooking".
At the crate root define fn deliver() that prints "delivering". In main, call back_of_house::fix_incorrect_order(). Output should be:
cooking
delivering`,
    hints: [
      'super refers to the parent module; from back_of_house, super is the crate root.',
      'Call the root function with super::deliver().',
    ],
    solution: `fn deliver() {
    println!("delivering");
}

mod back_of_house {
    pub fn fix_incorrect_order() {
        cook_order();
        super::deliver();
    }

    fn cook_order() {
        println!("cooking");
    }
}

fn main() {
    back_of_house::fix_incorrect_order();
}`,
    starter: `fn deliver() {
    println!("delivering");
}

mod back_of_house {
    pub fn fix_incorrect_order() {
        // TODO: call cook_order(), then the root deliver() via super
    }

    fn cook_order() {
        println!("cooking");
    }
}

fn main() {
    back_of_house::fix_incorrect_order();
}`,
    tags: ['super', 'modules', 'paths'],
  },
  {
    id: 'rs-ch07-c-044',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Pub Struct With a Private Field',
    prompt: `Define a module bakery with a public struct Breakfast that has a public field toast (String) and a PRIVATE field seasonal_fruit (String). Because seasonal_fruit is private, outside code cannot set it directly, so provide a public associated function summer(toast: &str) -> Breakfast that builds a Breakfast with the given toast and seasonal_fruit set to "peaches". In main, call Breakfast::summer("Rye"), change the toast field to "Wheat", and print:
toast = Wheat`,
    hints: [
      'Fields are private by default even inside a pub struct; mark only toast as pub.',
      'A struct with a private field needs a constructor function (here summer) because callers cannot fill the private field.',
      'Make the binding mut so you can change toast.',
    ],
    solution: `mod bakery {
    pub struct Breakfast {
        pub toast: String,
        seasonal_fruit: String,
    }

    impl Breakfast {
        pub fn summer(toast: &str) -> Breakfast {
            Breakfast {
                toast: String::from(toast),
                seasonal_fruit: String::from("peaches"),
            }
        }
    }
}

fn main() {
    let mut meal = bakery::Breakfast::summer("Rye");
    meal.toast = String::from("Wheat");
    println!("toast = {}", meal.toast);
}`,
    starter: `mod bakery {
    pub struct Breakfast {
        pub toast: String,
        seasonal_fruit: String,
    }

    impl Breakfast {
        // TODO: pub fn summer(toast: &str) -> Breakfast
    }
}

fn main() {
    // TODO: build a Breakfast, change toast, print it
}`,
    tags: ['pub', 'structs', 'visibility'],
  },
  {
    id: 'rs-ch07-c-045',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Pub Enum Makes All Variants Public',
    prompt: `Unlike structs, marking an enum pub makes ALL its variants public automatically. Define a module menu with a public enum Appetizer that has two variants: Soup and Salad (both unit variants). In main, create both menu::Appetizer::Soup and menu::Appetizer::Salad and print "ordered two". You do NOT need to write pub on the individual variants.`,
    hints: [
      'pub enum Appetizer { Soup, Salad } exposes both variants.',
      'Refer to a variant as menu::Appetizer::Soup.',
    ],
    solution: `mod menu {
    pub enum Appetizer {
        Soup,
        Salad,
    }
}

fn main() {
    let _a = menu::Appetizer::Soup;
    let _b = menu::Appetizer::Salad;
    println!("ordered two");
}`,
    starter: `mod menu {
    // TODO: pub enum Appetizer with Soup and Salad
}

fn main() {
    // TODO: build both variants, print "ordered two"
}`,
    tags: ['pub', 'enums', 'visibility'],
  },
  {
    id: 'rs-ch07-c-046',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Match on an Imported Enum',
    prompt: `Define a module signals with a public enum Light { Red, Yellow, Green }. Bring Light and all its variants into scope at the root (you may bring the enum in, then refer to variants through it, or bring variants in). Write a function action(l: Light) -> &'static str that returns "stop" for Red, "slow" for Yellow, and "go" for Green. In main, print action(Light::Green) which should be:
go`,
    hints: [
      'use signals::Light; lets you write Light::Red etc.',
      'A match over the enum must cover every variant.',
    ],
    solution: `mod signals {
    pub enum Light {
        Red,
        Yellow,
        Green,
    }
}

use signals::Light;

fn action(l: Light) -> &'static str {
    match l {
        Light::Red => "stop",
        Light::Yellow => "slow",
        Light::Green => "go",
    }
}

fn main() {
    println!("{}", action(Light::Green));
}`,
    starter: `mod signals {
    pub enum Light {
        Red,
        Yellow,
        Green,
    }
}

// TODO: bring Light into scope

fn action(l: Light) -> &'static str {
    // TODO: match on l
}

fn main() {
    println!("{}", action(Light::Green));
}`,
    tags: ['enums', 'use', 'match'],
  },
  {
    id: 'rs-ch07-c-047',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'use Inside a Module',
    prompt: `A use statement only creates a shortcut in the scope where it appears. Define a module customer that contains a use statement bringing the hosting module into scope, plus a public function eat() that calls hosting::add_to_waitlist(). Provide a module front_of_house with a public nested module hosting and a public fn add_to_waitlist() that prints "seated". In main, call customer::eat(). Output:
seated`,
    hints: [
      'Put use crate::front_of_house::hosting; inside mod customer.',
      'Because the use is inside customer, the eat function can write hosting::add_to_waitlist().',
    ],
    solution: `mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {
            println!("seated");
        }
    }
}

mod customer {
    use crate::front_of_house::hosting;

    pub fn eat() {
        hosting::add_to_waitlist();
    }
}

fn main() {
    customer::eat();
}`,
    starter: `mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {
            println!("seated");
        }
    }
}

mod customer {
    // TODO: use the hosting module here

    pub fn eat() {
        // TODO: call add_to_waitlist via hosting
    }
}

fn main() {
    customer::eat();
}`,
    tags: ['use', 'modules', 'scope'],
  },
  {
    id: 'rs-ch07-c-048',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Nested Paths in One use',
    prompt: `The standard library's cmp::Ordering and the io module can be imported with one nested-path use. Write a single use statement that brings BOTH std::cmp::Ordering and std::io into scope using the nested form use std::{...};. In main, print the result of comparing 3 and 5 with 3.cmp(&5), which prints:
Less
(Use io somewhere harmlessly, e.g. a type annotation is not required; just having it imported and unused will warn but compile. To avoid the warning, you may call std::io::stdin() is NOT needed — simply leaving it imported is fine for this exercise.)`,
    hints: [
      'Nested path syntax: use std::{cmp::Ordering, io};',
      'Ordering has variants Less, Equal, Greater and derives Debug, so {:?} prints it.',
    ],
    solution: `use std::{cmp::Ordering, io};

fn main() {
    let _keep = io::stdin;
    let result: Ordering = 3.cmp(&5);
    println!("{:?}", result);
}`,
    starter: `// TODO: one nested-path use for std::cmp::Ordering and std::io

fn main() {
    let result = 3.cmp(&5);
    println!("{:?}", result);
}`,
    tags: ['use', 'nested-paths', 'std'],
  },
  {
    id: 'rs-ch07-c-049',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Combine self in a Nested Path',
    prompt: `When you want both a module and an item inside it, the nested path can use self. Define a module collections with a public submodule list and, directly inside collections, a public function size() -> i32 returning 3. Inside list put a public function name() -> &'static str returning "vec". With one nested-path use of the form use collections::{self, list};, bring both collections and list into scope, then in main print collections::size() and list::name() to produce:
3
vec`,
    hints: [
      'use collections::{self, list}; imports the module collections itself plus its child list.',
      'self in a nested path refers to the path written so far (collections here).',
    ],
    solution: `mod collections {
    pub mod list {
        pub fn name() -> &'static str {
            "vec"
        }
    }

    pub fn size() -> i32 {
        3
    }
}

use collections::{self, list};

fn main() {
    println!("{}", collections::size());
    println!("{}", list::name());
}`,
    starter: `mod collections {
    pub mod list {
        pub fn name() -> &'static str {
            "vec"
        }
    }

    pub fn size() -> i32 {
        3
    }
}

// TODO: one nested use bringing in collections (self) and list

fn main() {
    // TODO: print collections::size() and list::name()
}`,
    tags: ['use', 'nested-paths', 'self'],
  },
  {
    id: 'rs-ch07-c-050',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Glob Import a Module',
    prompt: `The glob operator * brings all public items of a path into scope. Define a module palette with three public functions: red() returning "r", green() returning "g", and blue() returning "b" (all &'static str). Use a glob import (use palette::*;) so that in main you can call red(), green(), and blue() with no prefix. Print:
rgb
(Concatenate the three results into one line.)`,
    hints: [
      'use palette::*; pulls in every public item of palette.',
      'You can build the output by printing the three calls together: println!("{}{}{}", red(), green(), blue());',
    ],
    solution: `mod palette {
    pub fn red() -> &'static str {
        "r"
    }
    pub fn green() -> &'static str {
        "g"
    }
    pub fn blue() -> &'static str {
        "b"
    }
}

use palette::*;

fn main() {
    println!("{}{}{}", red(), green(), blue());
}`,
    starter: `mod palette {
    pub fn red() -> &'static str {
        "r"
    }
    pub fn green() -> &'static str {
        "g"
    }
    pub fn blue() -> &'static str {
        "b"
    }
}

// TODO: glob import palette

fn main() {
    // TODO: print red(), green(), blue() with no prefix
}`,
    tags: ['use', 'glob', 'modules'],
  },
  {
    id: 'rs-ch07-c-051',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Re-Export With pub use',
    prompt: `pub use re-exports a name so external code can reach it through a shorter path. Build module restaurant containing a private-looking deep path: a public submodule hosting with a public fn add_to_waitlist() that prints "added". At the top of restaurant, add a pub use that re-exports hosting so callers can write restaurant::hosting::add_to_waitlist() OR, after your re-export, the SHORTER restaurant::add_to_waitlist(). In main, call restaurant::add_to_waitlist() (the re-exported short path) and print "added".`,
    hints: [
      'pub use self::hosting::add_to_waitlist; inside restaurant re-exports the function at restaurant level.',
      'Then restaurant::add_to_waitlist() works from main.',
    ],
    solution: `mod restaurant {
    pub use self::hosting::add_to_waitlist;

    pub mod hosting {
        pub fn add_to_waitlist() {
            println!("added");
        }
    }
}

fn main() {
    restaurant::add_to_waitlist();
}`,
    starter: `mod restaurant {
    // TODO: pub use to re-export add_to_waitlist at this level

    pub mod hosting {
        pub fn add_to_waitlist() {
            println!("added");
        }
    }
}

fn main() {
    // TODO: call restaurant::add_to_waitlist()
}`,
    tags: ['pub-use', 're-export', 'modules'],
  },
  {
    id: 'rs-ch07-c-052',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Private Function Reached Through a Public API',
    prompt: `Privacy is one-way: a child module can use private items of its ancestors, and a public function can internally use private helpers in the same module. Define a module calc with a public function double(n: i32) -> i32 that returns add(n, n), and a PRIVATE function add(a: i32, b: i32) -> i32 returning a + b. In main, call calc::double(21) and print 42. (Note: calling calc::add directly from main would NOT compile because add is private — only call double.)`,
    hints: [
      'add stays private (no pub); double is pub and may call its private sibling.',
      'main can only see calc::double.',
    ],
    solution: `mod calc {
    pub fn double(n: i32) -> i32 {
        add(n, n)
    }

    fn add(a: i32, b: i32) -> i32 {
        a + b
    }
}

fn main() {
    println!("{}", calc::double(21));
}`,
    starter: `mod calc {
    pub fn double(n: i32) -> i32 {
        // TODO: call the private add helper
    }

    fn add(a: i32, b: i32) -> i32 {
        a + b
    }
}

fn main() {
    // TODO: call calc::double(21) and print it
}`,
    tags: ['privacy', 'modules', 'pub'],
  },
  {
    id: 'rs-ch07-c-053',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'super to Reach a Helper One Level Up',
    prompt: `Create a module outer that defines a function helper() (private, no pub) returning the i32 7, and a public submodule inner with a public function value() -> i32 that returns super::helper() + 1. In main, call outer::inner::value() and print 8.`,
    hints: [
      'From inner, super is outer, so super::helper() reaches the parent helper.',
      'helper does not need pub because inner is a child of outer and children can see ancestor privates.',
    ],
    solution: `mod outer {
    fn helper() -> i32 {
        7
    }

    pub mod inner {
        pub fn value() -> i32 {
            super::helper() + 1
        }
    }
}

fn main() {
    println!("{}", outer::inner::value());
}`,
    starter: `mod outer {
    fn helper() -> i32 {
        7
    }

    pub mod inner {
        pub fn value() -> i32 {
            // TODO: return super::helper() + 1
        }
    }
}

fn main() {
    println!("{}", outer::inner::value());
}`,
    tags: ['super', 'modules', 'privacy'],
  },
  {
    id: 'rs-ch07-c-054',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Bring Two Items From the Same Module',
    prompt: `Define a module geometry with two public functions: area(w: i32, h: i32) -> i32 returning w * h, and perimeter(w: i32, h: i32) -> i32 returning 2 * (w + h). With ONE nested-path use statement, bring both functions into scope, then in main print:
12
14
for area(3, 4) and perimeter(3, 4).`,
    hints: [
      'Nested path: use geometry::{area, perimeter};',
      'After importing, call them without the geometry:: prefix.',
    ],
    solution: `mod geometry {
    pub fn area(w: i32, h: i32) -> i32 {
        w * h
    }
    pub fn perimeter(w: i32, h: i32) -> i32 {
        2 * (w + h)
    }
}

use geometry::{area, perimeter};

fn main() {
    println!("{}", area(3, 4));
    println!("{}", perimeter(3, 4));
}`,
    starter: `mod geometry {
    pub fn area(w: i32, h: i32) -> i32 {
        w * h
    }
    pub fn perimeter(w: i32, h: i32) -> i32 {
        2 * (w + h)
    }
}

// TODO: one nested use for area and perimeter

fn main() {
    // TODO: print area(3,4) then perimeter(3,4)
}`,
    tags: ['use', 'nested-paths', 'modules'],
  },
  {
    id: 'rs-ch07-c-055',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Relative Path Without crate',
    prompt: `When the caller and the target share an ancestor, a relative path can start from a sibling module name. Define a module app containing two public submodules: ui with a public fn render() that prints "drawn", and core with a public fn run() that calls the sibling ui::render() using a relative path with super. In main, call app::core::run(). Output:
drawn`,
    hints: [
      'From core, super is app, and ui is a child of app, so super::ui::render() reaches the sibling.',
      'Both ui and core must be pub mod, and their functions pub.',
    ],
    solution: `mod app {
    pub mod ui {
        pub fn render() {
            println!("drawn");
        }
    }

    pub mod core {
        pub fn run() {
            super::ui::render();
        }
    }
}

fn main() {
    app::core::run();
}`,
    starter: `mod app {
    pub mod ui {
        pub fn render() {
            println!("drawn");
        }
    }

    pub mod core {
        pub fn run() {
            // TODO: call sibling ui::render() via super
        }
    }
}

fn main() {
    app::core::run();
}`,
    tags: ['super', 'paths', 'modules'],
  },
  {
    id: 'rs-ch07-c-056',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Public Method on a Module Struct',
    prompt: `Define a module account with a public struct Wallet that has a PRIVATE field balance (i32). Provide a public associated function new() -> Wallet starting at balance 0, a public method deposit(&mut self, amount: i32) that adds to balance, and a public method balance(&self) -> i32 returning the balance. In main, create a Wallet, deposit 50 then 25, and print:
75`,
    hints: [
      'Because balance is private, callers must go through new/deposit/balance.',
      'deposit needs &mut self; the Wallet binding must be mut.',
    ],
    solution: `mod account {
    pub struct Wallet {
        balance: i32,
    }

    impl Wallet {
        pub fn new() -> Wallet {
            Wallet { balance: 0 }
        }
        pub fn deposit(&mut self, amount: i32) {
            self.balance += amount;
        }
        pub fn balance(&self) -> i32 {
            self.balance
        }
    }
}

fn main() {
    let mut w = account::Wallet::new();
    w.deposit(50);
    w.deposit(25);
    println!("{}", w.balance());
}`,
    starter: `mod account {
    pub struct Wallet {
        balance: i32,
    }

    impl Wallet {
        // TODO: new(), deposit(&mut self, i32), balance(&self) -> i32
    }
}

fn main() {
    // TODO: create wallet, deposit 50 and 25, print balance
}`,
    tags: ['pub', 'structs', 'methods'],
  },
  {
    id: 'rs-ch07-c-057',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Glob Import a Module Enum',
    prompt: `Glob imports are handy for bringing all variants of an enum into scope. Define a module weather with a public enum Sky { Sunny, Cloudy, Rainy }. Glob-import it (use weather::Sky::*;) so you can write Sunny, Cloudy, Rainy directly. Write a function describe(s: Sky) -> &'static str returning "bright" for Sunny, "grey" for Cloudy, and "wet" for Rainy. In main, print describe(Rainy):
wet`,
    hints: [
      'use weather::Sky::*; brings the variants Sunny, Cloudy, Rainy into scope unqualified.',
      'You still need the type Sky in the signature; import it too with use weather::Sky;',
    ],
    solution: `mod weather {
    pub enum Sky {
        Sunny,
        Cloudy,
        Rainy,
    }
}

use weather::Sky;
use weather::Sky::*;

fn describe(s: Sky) -> &'static str {
    match s {
        Sunny => "bright",
        Cloudy => "grey",
        Rainy => "wet",
    }
}

fn main() {
    println!("{}", describe(Rainy));
}`,
    starter: `mod weather {
    pub enum Sky {
        Sunny,
        Cloudy,
        Rainy,
    }
}

// TODO: import Sky and glob-import its variants

fn describe(s: Sky) -> &'static str {
    // TODO: match using bare variant names
}

fn main() {
    println!("{}", describe(Rainy));
}`,
    tags: ['use', 'glob', 'enums'],
  },
  {
    id: 'rs-ch07-c-058',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Two-Level Re-Export Path',
    prompt: `Design a small library-style API. Create a module network with a private-by-default deep submodule structure: a public submodule client containing a public fn connect() that prints "connected". At the network level, add pub use self::client::connect; so external code uses network::connect(). Additionally, at the crate root add pub use network::connect as go; so main can simply call go(). In main, call go(). Output:
connected`,
    hints: [
      'First re-export inside network: pub use self::client::connect;',
      'Then at the root: pub use network::connect as go;',
      'pub use can also rename with as.',
    ],
    solution: `mod network {
    pub use self::client::connect;

    pub mod client {
        pub fn connect() {
            println!("connected");
        }
    }
}

pub use network::connect as go;

fn main() {
    go();
}`,
    starter: `mod network {
    // TODO: pub use to re-export connect here

    pub mod client {
        pub fn connect() {
            println!("connected");
        }
    }
}

// TODO: pub use at root renaming connect to go

fn main() {
    go();
}`,
    tags: ['pub-use', 're-export', 'as'],
  },
  {
    id: 'rs-ch07-c-059',
    chapter: 7,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Module Tree With Three Layers',
    prompt: `Build a three-layer tree in one file: module a, containing module b, containing module c, which has a public fn ping() that prints "pong". Make modules b and c public so the path is reachable. In main, call the function using its absolute path from crate. Output:
pong`,
    hints: [
      'Each module in the path (a is top-level; b and c are nested) must be pub if accessed from outside, but a itself only needs to be reachable from the root which is automatic.',
      'Absolute path: crate::a::b::c::ping().',
      'Mark a as a plain mod (it is a sibling of main at the root, reachable), b and c as pub mod.',
    ],
    solution: `mod a {
    pub mod b {
        pub mod c {
            pub fn ping() {
                println!("pong");
            }
        }
    }
}

fn main() {
    crate::a::b::c::ping();
}`,
    starter: `mod a {
    // TODO: nested pub mod b -> pub mod c -> pub fn ping()
}

fn main() {
    // TODO: call the function via its absolute path
}`,
    tags: ['module-tree', 'paths', 'pub'],
  },
  {
    id: 'rs-ch07-c-060',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Constructor Required by Private Field',
    prompt: `Define a module ticket with a public struct Ticket that has a public field id (u32) and a PRIVATE field secret (String). Outside the module you cannot use the literal struct syntax because of the private field, so provide a public associated function issue(id: u32) -> Ticket that fills secret with "abc". Also add a public method verify(&self, code: &str) -> bool returning true when code equals the secret. In main, create a Ticket with issue(7), then print:
7
true
where 7 is the id and true is verify("abc").`,
    hints: [
      'Trying Ticket { id: 7, secret: ... } in main would fail because secret is private.',
      'issue is the only way for outside code to build a Ticket.',
      'Compare strings with == after taking &self.secret.',
    ],
    solution: `mod ticket {
    pub struct Ticket {
        pub id: u32,
        secret: String,
    }

    impl Ticket {
        pub fn issue(id: u32) -> Ticket {
            Ticket {
                id,
                secret: String::from("abc"),
            }
        }
        pub fn verify(&self, code: &str) -> bool {
            self.secret == code
        }
    }
}

fn main() {
    let t = ticket::Ticket::issue(7);
    println!("{}", t.id);
    println!("{}", t.verify("abc"));
}`,
    starter: `mod ticket {
    pub struct Ticket {
        pub id: u32,
        secret: String,
    }

    impl Ticket {
        // TODO: issue(id) and verify(&self, code)
    }
}

fn main() {
    // TODO: issue(7), print id, print verify("abc")
}`,
    tags: ['pub', 'structs', 'visibility'],
  },
  {
    id: 'rs-ch07-c-061',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Layered API With pub use Facade',
    prompt: `Create a "facade" module that hides internal structure. Build module engine with a private submodule internals containing a public fn boot() that prints "booting" (internals is NOT pub, so it is hidden from outside engine). At the engine level, add a pub use that re-exports boot so that callers can write engine::boot() even though internals itself is not reachable from outside. In main, call engine::boot(). Output:
booting
(Hint: a child module's items can be re-exported by its parent even if the child module is private, as long as the item being re-exported is pub.)`,
    hints: [
      'internals stays mod (private), but its boot fn is pub.',
      'Inside engine: pub use self::internals::boot;',
      'engine::internals::boot() from main would fail, but engine::boot() works via the re-export.',
    ],
    solution: `mod engine {
    pub use self::internals::boot;

    mod internals {
        pub fn boot() {
            println!("booting");
        }
    }
}

fn main() {
    engine::boot();
}`,
    starter: `mod engine {
    // TODO: pub use to expose boot at engine level

    mod internals {
        pub fn boot() {
            println!("booting");
        }
    }
}

fn main() {
    // TODO: call engine::boot()
}`,
    tags: ['pub-use', 'facade', 'privacy'],
  },
  {
    id: 'rs-ch07-c-062',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Cross-Module Call Chain',
    prompt: `Model three cooperating modules in one file under a parent restaurant:
- module hosting with public fn seat() that returns the i32 1.
- module serving with public fn serve() that returns hosting::seat() + 1 by reaching its sibling via super.
- module cleanup with public fn close() that returns serving::serve() + 1 via super.
All three are public submodules of restaurant. In main, print restaurant::cleanup::close() which should be:
3`,
    hints: [
      'From serving, super::hosting::seat() reaches the sibling.',
      'From cleanup, super::serving::serve() reaches the sibling.',
      'Make hosting, serving, cleanup all pub mod with pub fns.',
    ],
    solution: `mod restaurant {
    pub mod hosting {
        pub fn seat() -> i32 {
            1
        }
    }

    pub mod serving {
        pub fn serve() -> i32 {
            super::hosting::seat() + 1
        }
    }

    pub mod cleanup {
        pub fn close() -> i32 {
            super::serving::serve() + 1
        }
    }
}

fn main() {
    println!("{}", restaurant::cleanup::close());
}`,
    starter: `mod restaurant {
    pub mod hosting {
        pub fn seat() -> i32 {
            1
        }
    }

    pub mod serving {
        pub fn serve() -> i32 {
            // TODO: super::hosting::seat() + 1
        }
    }

    pub mod cleanup {
        pub fn close() -> i32 {
            // TODO: super::serving::serve() + 1
        }
    }
}

fn main() {
    println!("{}", restaurant::cleanup::close());
}`,
    tags: ['super', 'modules', 'paths'],
  },
  {
    id: 'rs-ch07-c-063',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Private Struct, Public Builder Function',
    prompt: `Sometimes a whole struct is kept private and only a public function exposes data. Define a module bank with a PRIVATE struct Account { balance: i32 } (the struct itself is not pub), and a public function open_with(amount: i32) -> i32 that creates an Account with balance = amount and returns account.balance. Because Account is private, main cannot name the type at all — it just receives an i32. In main, print open_with(100):
100`,
    hints: [
      'Account has no pub keyword, so it is module-private; that is fine because open_with stays inside bank.',
      'open_with returns a plain i32, not the struct, so main never names Account.',
    ],
    solution: `mod bank {
    struct Account {
        balance: i32,
    }

    pub fn open_with(amount: i32) -> i32 {
        let account = Account { balance: amount };
        account.balance
    }
}

fn main() {
    println!("{}", bank::open_with(100));
}`,
    starter: `mod bank {
    struct Account {
        balance: i32,
    }

    pub fn open_with(amount: i32) -> i32 {
        // TODO: build an Account and return its balance
    }
}

fn main() {
    println!("{}", bank::open_with(100));
}`,
    tags: ['privacy', 'structs', 'modules'],
  },
  {
    id: 'rs-ch07-c-064',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Mixed Nested Path With self and Items',
    prompt: `Define a module text with: a public fn trim_ends(s: &str) -> &str returning s.trim(), a public submodule case with a public fn upper(s: &str) -> String returning s.to_uppercase(). Write ONE nested-path use that brings in BOTH text itself (so you can call text::trim_ends) and the case submodule (so you can call case::upper) — i.e. use text::{self, case};. In main, print:
hi
HELLO
by calling text::trim_ends("  hi  ") and case::upper("hello").`,
    hints: [
      'use text::{self, case}; gives you both text and case as names.',
      'text::trim_ends and case::upper are then both callable.',
    ],
    solution: `mod text {
    pub fn trim_ends(s: &str) -> &str {
        s.trim()
    }

    pub mod case {
        pub fn upper(s: &str) -> String {
            s.to_uppercase()
        }
    }
}

use text::{self, case};

fn main() {
    println!("{}", text::trim_ends("  hi  "));
    println!("{}", case::upper("hello"));
}`,
    starter: `mod text {
    pub fn trim_ends(s: &str) -> &str {
        s.trim()
    }

    pub mod case {
        pub fn upper(s: &str) -> String {
            s.to_uppercase()
        }
    }
}

// TODO: one nested use bringing in text (self) and case

fn main() {
    // TODO: print text::trim_ends("  hi  ") then case::upper("hello")
}`,
    tags: ['use', 'nested-paths', 'self'],
  },
  {
    id: 'rs-ch07-c-065',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Enum With a Struct Variant Across Modules',
    prompt: `Define a module events with a public enum Event that has variants Click { x: i32, y: i32 } and Key(char) and Quit. Because the enum is pub, all variants and their fields are public. Bring events::Event into scope, then write a function summary(e: Event) -> String that returns:
- for Click { x, y }: the string formed by formatting x and y like "click 1,2"
- for Key(c): "key " followed by the character
- for Quit: "quit"
In main, print summary(Event::Click { x: 1, y: 2 }):
click 1,2`,
    hints: [
      'pub enum exposes the struct-like and tuple-like variant fields automatically.',
      'Match arms can destructure: Event::Click { x, y } => format!("click {},{}", x, y).',
      'Use format! to build the returned String.',
    ],
    solution: `mod events {
    pub enum Event {
        Click { x: i32, y: i32 },
        Key(char),
        Quit,
    }
}

use events::Event;

fn summary(e: Event) -> String {
    match e {
        Event::Click { x, y } => format!("click {},{}", x, y),
        Event::Key(c) => format!("key {}", c),
        Event::Quit => String::from("quit"),
    }
}

fn main() {
    println!("{}", summary(Event::Click { x: 1, y: 2 }));
}`,
    starter: `mod events {
    pub enum Event {
        Click { x: i32, y: i32 },
        Key(char),
        Quit,
    }
}

use events::Event;

fn summary(e: Event) -> String {
    // TODO: match each variant
}

fn main() {
    println!("{}", summary(Event::Click { x: 1, y: 2 }));
}`,
    tags: ['enums', 'pub', 'match'],
  },
  {
    id: 'rs-ch07-c-066',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Reasoning: Which Paths Compile',
    prompt: `Given this module layout, exactly TWO of the candidate calls below would compile if placed in main, and the others would NOT. Write a main that performs ONLY the two valid calls and prints each result, producing:
10
20
Layout:
mod shop {
    pub mod open {
        pub fn ten() -> i32 { 10 }
        fn hidden() -> i32 { 99 }
    }
    fn twenty() -> i32 { 20 }
    pub fn twenty_pub() -> i32 { 20 }
}
Candidates: (a) shop::open::ten()  (b) shop::open::hidden()  (c) shop::twenty()  (d) shop::twenty_pub()
Pick the two that compile (a and d), and call them in main.`,
    hints: [
      'hidden has no pub, so shop::open::hidden() fails. twenty has no pub, so shop::twenty() fails.',
      'The valid two are shop::open::ten() and shop::twenty_pub().',
    ],
    solution: `mod shop {
    pub mod open {
        pub fn ten() -> i32 {
            10
        }
        #[allow(dead_code)]
        fn hidden() -> i32 {
            99
        }
    }
    #[allow(dead_code)]
    fn twenty() -> i32 {
        20
    }
    pub fn twenty_pub() -> i32 {
        20
    }
}

fn main() {
    println!("{}", shop::open::ten());
    println!("{}", shop::twenty_pub());
}`,
    starter: `mod shop {
    pub mod open {
        pub fn ten() -> i32 {
            10
        }
        fn hidden() -> i32 {
            99
        }
    }
    fn twenty() -> i32 {
        20
    }
    pub fn twenty_pub() -> i32 {
        20
    }
}

fn main() {
    // TODO: call only the two paths that compile, print each
}`,
    tags: ['privacy', 'paths', 'reasoning'],
  },
  {
    id: 'rs-ch07-c-067',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Glob With a Name Collision Resolved by as',
    prompt: `Two modules each define a public fn named status: module server with fn status() -> &'static str returning "up", and module db with fn status() -> &'static str returning "ready". A plain glob import of both would create a conflict for the name status. Instead, bring them in WITHOUT a clash: glob-import server with use server::*; and import db's status under a new name with use db::status as db_status;. In main, print:
up
ready`,
    hints: [
      'The glob import gives you status() from server.',
      'use db::status as db_status; avoids the collision with a rename.',
    ],
    solution: `mod server {
    pub fn status() -> &'static str {
        "up"
    }
}

mod db {
    pub fn status() -> &'static str {
        "ready"
    }
}

use server::*;
use db::status as db_status;

fn main() {
    println!("{}", status());
    println!("{}", db_status());
}`,
    starter: `mod server {
    pub fn status() -> &'static str {
        "up"
    }
}

mod db {
    pub fn status() -> &'static str {
        "ready"
    }
}

// TODO: glob-import server, import db::status as db_status

fn main() {
    // TODO: print status() then db_status()
}`,
    tags: ['glob', 'as', 'naming'],
  },
  {
    id: 'rs-ch07-c-068',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Deep Tree With Mixed Path Styles',
    prompt: `Build module store with public submodule produce, which has public submodule fruit, which has a public fn count() -> i32 returning 5. Inside store, add a public fn total() that calls the deeply nested count using a RELATIVE path (produce::fruit::count()) and prints "total 5". Separately in main, call store::produce::fruit::count() using its ABSOLUTE path (crate::...) and print its value 5, then call store::total(). Expected output:
5
total 5`,
    hints: [
      'Inside store, the relative path to count is produce::fruit::count().',
      'From main, the absolute path is crate::store::produce::fruit::count().',
      'All nested modules and the functions must be pub.',
    ],
    solution: `mod store {
    pub mod produce {
        pub mod fruit {
            pub fn count() -> i32 {
                5
            }
        }
    }

    pub fn total() {
        let n = produce::fruit::count();
        println!("total {}", n);
    }
}

fn main() {
    let n = crate::store::produce::fruit::count();
    println!("{}", n);
    store::total();
}`,
    starter: `mod store {
    pub mod produce {
        pub mod fruit {
            pub fn count() -> i32 {
                5
            }
        }
    }

    pub fn total() {
        // TODO: call count() via a relative path, print "total N"
    }
}

fn main() {
    // TODO: call count() via its absolute path, print it, then call store::total()
}`,
    tags: ['paths', 'module-tree', 'absolute'],
  },
  {
    id: 'rs-ch07-c-069',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Clean Public API With Re-Exports and use',
    prompt: `Design a tidy public surface. Build module library with two public submodules:
- borrow with a public fn check_out(title: &str) -> String returning a String like "out: Dune".
- catalog with a public fn find(title: &str) -> bool returning title == "Dune".
At the library level, add pub use re-exports so that BOTH functions are reachable directly as library::check_out and library::find. At the crate root, bring library into scope with use, then in main call library::find("Dune") and library::check_out("Dune"), printing:
true
out: Dune`,
    hints: [
      'Inside library: pub use self::borrow::check_out; and pub use self::catalog::find;',
      'At the root: use crate::library; is redundant if library is at the root, so just call library::find and library::check_out.',
      'format! builds the "out: title" String.',
    ],
    solution: `mod library {
    pub use self::borrow::check_out;
    pub use self::catalog::find;

    pub mod borrow {
        pub fn check_out(title: &str) -> String {
            format!("out: {}", title)
        }
    }

    pub mod catalog {
        pub fn find(title: &str) -> bool {
            title == "Dune"
        }
    }
}

fn main() {
    println!("{}", library::find("Dune"));
    println!("{}", library::check_out("Dune"));
}`,
    starter: `mod library {
    // TODO: pub use re-exports for check_out and find

    pub mod borrow {
        pub fn check_out(title: &str) -> String {
            format!("out: {}", title)
        }
    }

    pub mod catalog {
        pub fn find(title: &str) -> bool {
            title == "Dune"
        }
    }
}

fn main() {
    // TODO: call library::find("Dune") and library::check_out("Dune")
}`,
    tags: ['pub-use', 're-export', 'api-design'],
  },
  {
    id: 'rs-ch07-c-070',
    chapter: 7,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Full Restaurant Module Scenario',
    prompt: `Recreate a complete scenario inspired by the book. Build module restaurant with:
- a public submodule front_of_house containing a public submodule hosting with a public fn add_to_waitlist() that prints "added to waitlist".
- a pub use at the restaurant level re-exporting hosting so callers can write restaurant::hosting::... directly (re-export front_of_house::hosting).
- a public fn eat_at_restaurant() that, using a RELATIVE path through front_of_house, calls hosting::add_to_waitlist().
In main: (1) call restaurant::eat_at_restaurant(); (2) call the re-exported path restaurant::hosting::add_to_waitlist(). The program should print "added to waitlist" twice.`,
    hints: [
      'Inside restaurant: pub use self::front_of_house::hosting; re-exports the nested module one level up.',
      'eat_at_restaurant can call front_of_house::hosting::add_to_waitlist() (relative) or hosting::... after the re-export.',
      'Both front_of_house and hosting must be pub mod.',
    ],
    solution: `mod restaurant {
    pub use self::front_of_house::hosting;

    pub mod front_of_house {
        pub mod hosting {
            pub fn add_to_waitlist() {
                println!("added to waitlist");
            }
        }
    }

    pub fn eat_at_restaurant() {
        front_of_house::hosting::add_to_waitlist();
    }
}

fn main() {
    restaurant::eat_at_restaurant();
    restaurant::hosting::add_to_waitlist();
}`,
    starter: `mod restaurant {
    // TODO: pub use re-export of front_of_house::hosting

    pub mod front_of_house {
        pub mod hosting {
            pub fn add_to_waitlist() {
                println!("added to waitlist");
            }
        }
    }

    pub fn eat_at_restaurant() {
        // TODO: call add_to_waitlist via a relative path
    }
}

fn main() {
    // TODO: call eat_at_restaurant(), then the re-exported hosting path
}`,
    tags: ['pub-use', 'modules', 'paths'],
  },
]

export default problems
