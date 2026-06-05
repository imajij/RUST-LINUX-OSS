import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch14-c-036',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Doc Comment With an Examples Section',
    prompt: `Write a public function with the signature pub fn double(n: i32) -> i32 that returns n multiplied by 2.

Document it with a triple-slash documentation comment that includes a one-line summary and an "# Examples" section. Inside the Examples section, put a Rust code block that calls double and uses assert_eq! to check the result.

Also write a fn main that prints double(21) so the program runs.`,
    hints: [
      'Documentation comments use three slashes and support Markdown.',
      'Start the examples block with a line of three backticks, then write normal Rust including a call to your function.',
      'A line like assert_eq!(double(2), 4); inside the example doubles as a documentation test.',
    ],
    solution: `/// Doubles the given integer.
///
/// # Examples
///
/// \`\`\`
/// let result = double(2);
/// assert_eq!(result, 4);
/// \`\`\`
pub fn double(n: i32) -> i32 {
    n * 2
}

fn main() {
    println!("{}", double(21));
}`,
    starter: `/// TODO: one-line summary
///
/// # Examples
///
/// (TODO: a code block calling double with an assert_eq!)
pub fn double(n: i32) -> i32 {
    // TODO
    todo!()
}

fn main() {
    println!("{}", double(21));
}`,
    tags: ['documentation', 'doc-comments'],
  },
  {
    id: 'rs-ch14-c-037',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Crate-Level Inner Doc Comment',
    prompt: `Add a crate-level inner documentation comment at the very top of a file using the //! syntax. The comment should describe the crate as a small math utilities crate in two lines.

Below the crate-level comment, write a public function pub fn square(n: i32) -> i32 that returns n times n, and a fn main that prints square(9).`,
    hints: [
      'Inner doc comments use //! and document the item that contains them (here, the whole crate/module).',
      'The //! lines must be the first thing in the file, before any items.',
    ],
    solution: `//! # Math Utilities
//!
//! A small crate of handy integer math helpers.

/// Returns the square of an integer.
pub fn square(n: i32) -> i32 {
    n * n
}

fn main() {
    println!("{}", square(9));
}`,
    starter: `//! TODO: two-line crate-level description using //!

pub fn square(n: i32) -> i32 {
    todo!()
}

fn main() {
    println!("{}", square(9));
}`,
    tags: ['documentation', 'inner-doc'],
  },
  {
    id: 'rs-ch14-c-038',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Passing Documentation Test',
    prompt: `Write a public function pub fn add_one(x: i32) -> i32 that returns x + 1.

Give it a doc comment whose "# Examples" code block declares the function in scope and asserts that add_one(5) equals 6. Because this app runs single-file programs, also define the same function for real and call it from main printing add_one(5).

The goal: the example in the doc comment is itself a documentation test that would run under cargo test.`,
    hints: [
      'A doc-test is just the code inside the triple-backtick block in your doc comment.',
      'cargo test compiles and runs each doc-test as its own tiny program.',
    ],
    solution: `/// Adds one to the given integer.
///
/// # Examples
///
/// \`\`\`
/// fn add_one(x: i32) -> i32 { x + 1 }
/// assert_eq!(add_one(5), 6);
/// \`\`\`
pub fn add_one(x: i32) -> i32 {
    x + 1
}

fn main() {
    println!("{}", add_one(5));
}`,
    starter: `/// TODO: summary and an # Examples doc-test asserting add_one(5) == 6
pub fn add_one(x: i32) -> i32 {
    todo!()
}

fn main() {
    println!("{}", add_one(5));
}`,
    tags: ['documentation', 'doc-tests'],
  },
  {
    id: 'rs-ch14-c-039',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Re-Export a Nested Type With pub use',
    prompt: `Create a module tree where the useful type is buried. Define:

mod kinds {
    pub mod colors {
        pub enum PrimaryColor { Red, Yellow, Blue }
    }
}

Then add a pub use re-export at the crate root so that callers can refer to the type as PrimaryColor (the short path) rather than kinds::colors::PrimaryColor.

In main, construct PrimaryColor::Red using the re-exported short path and print the text "made a color".`,
    hints: [
      'pub use brings an item into the current scope AND re-exports it for external callers.',
      'Write pub use kinds::colors::PrimaryColor; at the crate root.',
    ],
    solution: `mod kinds {
    pub mod colors {
        pub enum PrimaryColor {
            Red,
            Yellow,
            Blue,
        }
    }
}

pub use kinds::colors::PrimaryColor;

fn main() {
    let _c = PrimaryColor::Red;
    println!("made a color");
}`,
    starter: `mod kinds {
    pub mod colors {
        pub enum PrimaryColor {
            Red,
            Yellow,
            Blue,
        }
    }
}

// TODO: pub use re-export so PrimaryColor is reachable at the crate root

fn main() {
    let _c = PrimaryColor::Red;
    println!("made a color");
}`,
    tags: ['pub-use', 're-export', 'modules'],
  },
  {
    id: 'rs-ch14-c-040',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Release Profile opt-level',
    prompt: `You are writing the Cargo.toml for a crate and want the release build to optimize for size-and-speed balance at opt-level 2 while keeping the default dev build unoptimized.

Produce, as a Rust program, a fn main that prints the exact TOML you would add to Cargo.toml. The printed output must be exactly these three lines:

[profile.release]
opt-level = 2

Use println! statements to emit those lines.`,
    hints: [
      'Release profile customizations live under the [profile.release] table in Cargo.toml.',
      'opt-level accepts 0 through 3 (and "s"/"z" for size); 2 is a valid value.',
    ],
    solution: `fn main() {
    println!("[profile.release]");
    println!("opt-level = 2");
}`,
    starter: `fn main() {
    // TODO: print the [profile.release] table with opt-level = 2
}`,
    tags: ['cargo', 'release-profile'],
  },
  {
    id: 'rs-ch14-c-041',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Override the Dev Profile opt-level',
    prompt: `By default the dev profile uses opt-level = 0. Suppose you want slightly faster dev builds at opt-level = 1.

Write a fn main that prints exactly:

[profile.dev]
opt-level = 1

These are the lines you would place in Cargo.toml. Emit them with println!.`,
    hints: [
      'The dev profile is configured under [profile.dev].',
      'Even profiles with defaults can be overridden by writing the table explicitly.',
    ],
    solution: `fn main() {
    println!("[profile.dev]");
    println!("opt-level = 1");
}`,
    starter: `fn main() {
    // TODO: print the [profile.dev] table overriding opt-level to 1
}`,
    tags: ['cargo', 'release-profile', 'dev-profile'],
  },
  {
    id: 'rs-ch14-c-042',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Minimal Publishing Metadata',
    prompt: `Before publishing to crates.io a package needs metadata. Write a fn main that prints a valid [package] table containing exactly these required-for-publish fields: name, version, edition, description, and license.

The printed output must be exactly:

[package]
name = "kinds"
version = "0.1.0"
edition = "2021"
description = "A small crate of color and shape kinds."
license = "MIT"

Emit each line with println!.`,
    hints: [
      'crates.io requires at least a description and a license (or license-file) to publish.',
      'String values in TOML are wrapped in double quotes.',
    ],
    solution: `fn main() {
    println!("[package]");
    println!("name = \\"kinds\\"");
    println!("version = \\"0.1.0\\"");
    println!("edition = \\"2021\\"");
    println!("description = \\"A small crate of color and shape kinds.\\"");
    println!("license = \\"MIT\\"");
}`,
    starter: `fn main() {
    // TODO: print the [package] table with name, version, edition,
    // description, and license
}`,
    tags: ['cargo', 'publishing', 'metadata'],
  },
  {
    id: 'rs-ch14-c-043',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Document a Public Struct and Its Method',
    prompt: `Define a public struct pub struct Counter { value: i32 } with a documented public constructor and a documented method.

Requirements:
- pub fn new() -> Counter starts the value at 0; give it a doc comment.
- pub fn increment(&mut self) adds 1 to value; give it a doc comment.
- pub fn get(&self) -> i32 returns the current value; document it with an # Examples block that builds a Counter, increments it twice, and asserts get() returns 2.

In main, exercise the type and print the final value.`,
    hints: [
      'Each public item can carry its own /// doc comment.',
      'The Examples block on get is a doc-test; keep it self-contained.',
    ],
    solution: `/// A simple integer counter starting at zero.
pub struct Counter {
    value: i32,
}

impl Counter {
    /// Creates a new counter set to 0.
    pub fn new() -> Counter {
        Counter { value: 0 }
    }

    /// Increases the stored value by one.
    pub fn increment(&mut self) {
        self.value += 1;
    }

    /// Returns the current value.
    ///
    /// # Examples
    ///
    /// \`\`\`
    /// // (illustrative)
    /// // let mut c = Counter::new();
    /// // c.increment();
    /// // c.increment();
    /// // assert_eq!(c.get(), 2);
    /// \`\`\`
    pub fn get(&self) -> i32 {
        self.value
    }
}

fn main() {
    let mut c = Counter::new();
    c.increment();
    c.increment();
    println!("{}", c.get());
}`,
    starter: `pub struct Counter {
    value: i32,
}

impl Counter {
    // TODO: documented new
    // TODO: documented increment
    // TODO: documented get with an # Examples block
}

fn main() {
    let mut c = Counter::new();
    c.increment();
    c.increment();
    println!("{}", c.get());
}`,
    tags: ['documentation', 'methods', 'structs'],
  },
  {
    id: 'rs-ch14-c-044',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Flatten a Deep API With Several pub use',
    prompt: `A library has two useful items hidden behind nested modules:

mod shapes {
    pub mod two_d {
        pub struct Circle { pub radius: f64 }
        pub struct Square { pub side: f64 }
    }
}

At the crate root, add re-exports so external code can use both Circle and Square directly (without the shapes::two_d:: prefix).

In main, build a Circle with radius 2.0 and a Square with side 3.0 using the short paths, then print both fields.`,
    hints: [
      'You can write one pub use per item, or group them: pub use shapes::two_d::{Circle, Square};',
      'Grouped re-exports keep the crate root tidy.',
    ],
    solution: `mod shapes {
    pub mod two_d {
        pub struct Circle {
            pub radius: f64,
        }
        pub struct Square {
            pub side: f64,
        }
    }
}

pub use shapes::two_d::{Circle, Square};

fn main() {
    let c = Circle { radius: 2.0 };
    let s = Square { side: 3.0 };
    println!("{} {}", c.radius, s.side);
}`,
    starter: `mod shapes {
    pub mod two_d {
        pub struct Circle {
            pub radius: f64,
        }
        pub struct Square {
            pub side: f64,
        }
    }
}

// TODO: re-export Circle and Square at the crate root

fn main() {
    let c = Circle { radius: 2.0 };
    let s = Square { side: 3.0 };
    println!("{} {}", c.radius, s.side);
}`,
    tags: ['pub-use', 'api-design', 'modules'],
  },
  {
    id: 'rs-ch14-c-045',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Print a Workspace Root Cargo.toml',
    prompt: `A Cargo workspace is declared by a root Cargo.toml that lists its members. Write a fn main that prints exactly the following workspace manifest:

[workspace]
members = [
    "adder",
    "add_one",
]

Emit the lines with println! so the output matches exactly, including the indentation (four spaces) on the member lines.`,
    hints: [
      'A workspace root has a [workspace] table with a members array.',
      'Each member is a string path to a crate folder.',
    ],
    solution: `fn main() {
    println!("[workspace]");
    println!("members = [");
    println!("    \\"adder\\",");
    println!("    \\"add_one\\",");
    println!("]");
}`,
    starter: `fn main() {
    // TODO: print the [workspace] table listing members "adder" and "add_one"
}`,
    tags: ['cargo', 'workspace'],
  },
  {
    id: 'rs-ch14-c-046',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Path Dependency Between Members',
    prompt: `In a workspace, the binary crate adder depends on the library crate add_one that lives in a sibling folder. You express this with a path dependency in adder/Cargo.toml.

Write a fn main that prints exactly:

[dependencies]
add_one = { path = "../add_one" }

Emit it with println!.`,
    hints: [
      'Path dependencies use the form name = { path = "..." } in the [dependencies] table.',
      'The path is relative to the depending crate\'s Cargo.toml.',
    ],
    solution: `fn main() {
    println!("[dependencies]");
    println!("add_one = {{ path = \\"../add_one\\" }}");
}`,
    starter: `fn main() {
    // TODO: print a [dependencies] table with a path dependency on add_one
    // Hint: in a format/println string, a literal brace is written as a double brace
}`,
    tags: ['cargo', 'workspace', 'path-dependency'],
  },
  {
    id: 'rs-ch14-c-047',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Documented Library Function for a Workspace Member',
    prompt: `Imagine the add_one library crate of a workspace. Write its public function pub fn add_one(x: i32) -> i32 that returns x + 1, with a doc comment containing an # Examples section that asserts add_one(2) == 3.

Then, simulating the adder binary that calls it, write a fn main that calls add_one(10) and prints "Hello, world! 10 plus one is 11!" using the returned value.`,
    hints: [
      'The library function and its doc-test go together.',
      'In main, use the returned value to interpolate the result in the message.',
    ],
    solution: `/// Adds one to the given number.
///
/// # Examples
///
/// \`\`\`
/// fn add_one(x: i32) -> i32 { x + 1 }
/// assert_eq!(add_one(2), 3);
/// \`\`\`
pub fn add_one(x: i32) -> i32 {
    x + 1
}

fn main() {
    let num = 10;
    println!("Hello, world! {} plus one is {}!", num, add_one(num));
}`,
    starter: `// TODO: documented add_one with an # Examples doc-test
pub fn add_one(x: i32) -> i32 {
    todo!()
}

fn main() {
    let num = 10;
    println!("Hello, world! {} plus one is {}!", num, add_one(num));
}`,
    tags: ['workspace', 'documentation', 'doc-tests'],
  },
  {
    id: 'rs-ch14-c-048',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Reason About cargo install Targets',
    prompt: `cargo install only installs crates that have a binary target (a runnable executable); it cannot install a library-only crate.

Write a fn classify(has_binary: bool) -> &'static str that returns "installable" when the crate has a binary target and "library-only" otherwise.

In main, print classify(true) and classify(false) on separate lines.`,
    hints: [
      'cargo install builds and copies an executable into the cargo bin directory.',
      'This is a plain branching function; no real installation happens.',
    ],
    solution: `fn classify(has_binary: bool) -> &'static str {
    if has_binary {
        "installable"
    } else {
        "library-only"
    }
}

fn main() {
    println!("{}", classify(true));
    println!("{}", classify(false));
}`,
    starter: `fn classify(has_binary: bool) -> &'static str {
    // TODO
    todo!()
}

fn main() {
    println!("{}", classify(true));
    println!("{}", classify(false));
}`,
    tags: ['cargo', 'cargo-install', 'reasoning'],
  },
  {
    id: 'rs-ch14-c-049',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'SemVer Bump Decider',
    prompt: `Following Semantic Versioning, classify a change into the version part it should bump:
- a backwards-incompatible (breaking) change bumps "major"
- a backwards-compatible new feature bumps "minor"
- a backwards-compatible bug fix bumps "patch"

Write fn bump(kind: &str) -> &'static str that maps the input strings "breaking", "feature", and "fix" to "major", "minor", and "patch" respectively; for any other input return "unknown".

In main, print bump("breaking"), bump("feature"), bump("fix"), and bump("typo").`,
    hints: [
      'SemVer versions are MAJOR.MINOR.PATCH.',
      'Use a match on the input string.',
    ],
    solution: `fn bump(kind: &str) -> &'static str {
    match kind {
        "breaking" => "major",
        "feature" => "minor",
        "fix" => "patch",
        _ => "unknown",
    }
}

fn main() {
    println!("{}", bump("breaking"));
    println!("{}", bump("feature"));
    println!("{}", bump("fix"));
    println!("{}", bump("typo"));
}`,
    starter: `fn bump(kind: &str) -> &'static str {
    // TODO: match on kind
    todo!()
}

fn main() {
    println!("{}", bump("breaking"));
    println!("{}", bump("feature"));
    println!("{}", bump("fix"));
    println!("{}", bump("typo"));
}`,
    tags: ['semver', 'publishing', 'reasoning'],
  },
  {
    id: 'rs-ch14-c-050',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Document With Panics and Errors Sections',
    prompt: `Conventional Rust doc comments use standard headers like # Examples, # Panics, and # Errors.

Write pub fn divide(a: i32, b: i32) -> i32 that returns a / b. Document it with:
- a one-line summary,
- a # Panics section noting it panics when b is 0,
- an # Examples section asserting divide(10, 2) == 5.

In main, print divide(10, 2).`,
    hints: [
      'Each section is a Markdown header (#) inside the /// comment.',
      'Only the # Examples code block becomes a doc-test; # Panics is prose.',
    ],
    solution: `/// Divides \`a\` by \`b\`.
///
/// # Panics
///
/// Panics if \`b\` is 0.
///
/// # Examples
///
/// \`\`\`
/// fn divide(a: i32, b: i32) -> i32 { a / b }
/// assert_eq!(divide(10, 2), 5);
/// \`\`\`
pub fn divide(a: i32, b: i32) -> i32 {
    a / b
}

fn main() {
    println!("{}", divide(10, 2));
}`,
    starter: `/// TODO: summary, # Panics, and # Examples sections
pub fn divide(a: i32, b: i32) -> i32 {
    todo!()
}

fn main() {
    println!("{}", divide(10, 2));
}`,
    tags: ['documentation', 'panics-section'],
  },
  {
    id: 'rs-ch14-c-051',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Curate a Front-Page API With pub use',
    prompt: `You maintain an "art" crate. Internally it has:

mod art {
    pub mod kinds {
        pub enum PrimaryColor { Red, Yellow, Blue }
    }
    pub mod utils {
        pub fn mix() -> &'static str { "mixed" }
    }
}

Add crate-root re-exports so callers can write PrimaryColor and mix directly.

In main, match PrimaryColor::Yellow and print "yellow" for that arm (other arms print "other"), then print the result of mix().`,
    hints: [
      'Re-export both the enum and the function with pub use.',
      'pub use art::kinds::PrimaryColor; and pub use art::utils::mix;',
    ],
    solution: `mod art {
    pub mod kinds {
        pub enum PrimaryColor {
            Red,
            Yellow,
            Blue,
        }
    }
    pub mod utils {
        pub fn mix() -> &'static str {
            "mixed"
        }
    }
}

pub use art::kinds::PrimaryColor;
pub use art::utils::mix;

fn main() {
    let c = PrimaryColor::Yellow;
    let name = match c {
        PrimaryColor::Yellow => "yellow",
        _ => "other",
    };
    println!("{}", name);
    println!("{}", mix());
}`,
    starter: `mod art {
    pub mod kinds {
        pub enum PrimaryColor {
            Red,
            Yellow,
            Blue,
        }
    }
    pub mod utils {
        pub fn mix() -> &'static str {
            "mixed"
        }
    }
}

// TODO: re-export PrimaryColor and mix at the crate root

fn main() {
    let c = PrimaryColor::Yellow;
    let name = match c {
        PrimaryColor::Yellow => "yellow",
        _ => "other",
    };
    println!("{}", name);
    println!("{}", mix());
}`,
    tags: ['pub-use', 'api-design', 'enums'],
  },
  {
    id: 'rs-ch14-c-052',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Version Compatibility Check Under Caret Rules',
    prompt: `Cargo's default dependency requirement like "1.2.3" allows any version that is SemVer-compatible: same major version and at least the given minor.patch. For major version 0, only the same minor is compatible.

Implement fn compatible(req: (u32, u32, u32), have: (u32, u32, u32)) -> bool for the simplified rule:
- if req major > 0: compatible when have.major == req.major and have >= req (tuple-wise).
- if req major == 0: compatible when have.major == 0, have.minor == req.minor, and have >= req.

In main, print compatible((1,2,3),(1,5,0)), compatible((1,2,3),(2,0,0)), and compatible((0,2,1),(0,2,4)).`,
    hints: [
      'Tuples of the same shape compare lexicographically with >=.',
      'Branch on whether the required major is zero.',
    ],
    solution: `fn compatible(req: (u32, u32, u32), have: (u32, u32, u32)) -> bool {
    if req.0 > 0 {
        have.0 == req.0 && have >= req
    } else {
        have.0 == 0 && have.1 == req.1 && have >= req
    }
}

fn main() {
    println!("{}", compatible((1, 2, 3), (1, 5, 0)));
    println!("{}", compatible((1, 2, 3), (2, 0, 0)));
    println!("{}", compatible((0, 2, 1), (0, 2, 4)));
}`,
    starter: `fn compatible(req: (u32, u32, u32), have: (u32, u32, u32)) -> bool {
    // TODO: apply the simplified caret rule
    todo!()
}

fn main() {
    println!("{}", compatible((1, 2, 3), (1, 5, 0)));
    println!("{}", compatible((1, 2, 3), (2, 0, 0)));
    println!("{}", compatible((0, 2, 1), (0, 2, 4)));
}`,
    tags: ['semver', 'cargo', 'reasoning'],
  },
  {
    id: 'rs-ch14-c-053',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Document a Module With Inner Comments',
    prompt: `Inner doc comments (//!) can document a module from inside it. Define a module mod geometry that begins with two //! lines describing it as geometry helpers, then contains a documented pub fn area_of_square(side: f64) -> f64 returning side * side.

In main, call geometry::area_of_square(4.0) and print the result.`,
    hints: [
      'Place the //! lines as the first statements inside the module body.',
      'The function still uses /// for its own outer doc comment.',
    ],
    solution: `mod geometry {
    //! Geometry helpers.
    //!
    //! Small functions for computing areas.

    /// Returns the area of a square given its side length.
    pub fn area_of_square(side: f64) -> f64 {
        side * side
    }
}

fn main() {
    println!("{}", geometry::area_of_square(4.0));
}`,
    starter: `mod geometry {
    //! TODO: two-line module description using //!

    pub fn area_of_square(side: f64) -> f64 {
        todo!()
    }
}

fn main() {
    println!("{}", geometry::area_of_square(4.0));
}`,
    tags: ['documentation', 'inner-doc', 'modules'],
  },
  {
    id: 'rs-ch14-c-054',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Layered Profiles: dev and release Together',
    prompt: `Suppose you want unoptimized dev builds (opt-level 0, the default but stated explicitly) and aggressively optimized release builds (opt-level 3).

Write a fn main that prints exactly these four lines, in this order:

[profile.dev]
opt-level = 0

[profile.release]
opt-level = 3

Include the blank line between the two tables. Emit with println!.`,
    hints: [
      'A println!() with no arguments prints an empty line.',
      'Order matters: dev table first, blank line, then release table.',
    ],
    solution: `fn main() {
    println!("[profile.dev]");
    println!("opt-level = 0");
    println!();
    println!("[profile.release]");
    println!("opt-level = 3");
}`,
    starter: `fn main() {
    // TODO: print both the [profile.dev] and [profile.release] tables
    // separated by a blank line
}`,
    tags: ['cargo', 'release-profile', 'dev-profile'],
  },
  {
    id: 'rs-ch14-c-055',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Custom Cargo Subcommand Naming',
    prompt: `Cargo lets you add custom subcommands: if a binary on your PATH is named cargo-something, then running cargo something invokes it.

Write fn invocation(binary: &str) -> String that, given a binary name like "cargo-count", returns the command a user would type, like "cargo count". If the name does not start with the "cargo-" prefix, return the string "not a cargo subcommand".

In main, print invocation("cargo-count") and invocation("ripgrep").`,
    hints: [
      'Use str::strip_prefix("cargo-") which returns an Option of the remainder.',
      'Build the result with format! when the prefix is present.',
    ],
    solution: `fn invocation(binary: &str) -> String {
    match binary.strip_prefix("cargo-") {
        Some(rest) => format!("cargo {}", rest),
        None => String::from("not a cargo subcommand"),
    }
}

fn main() {
    println!("{}", invocation("cargo-count"));
    println!("{}", invocation("ripgrep"));
}`,
    starter: `fn invocation(binary: &str) -> String {
    // TODO: turn cargo-NAME into "cargo NAME"
    todo!()
}

fn main() {
    println!("{}", invocation("cargo-count"));
    println!("{}", invocation("ripgrep"));
}`,
    tags: ['cargo', 'subcommands'],
  },
  {
    id: 'rs-ch14-c-056',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Yank Status of a Version',
    prompt: `Yanking a version on crates.io prevents new projects from depending on it, but existing Cargo.lock files that already pin it keep working.

Model this with fn can_start_new_dependency(yanked: bool) -> bool returning false when the version is yanked, and fn existing_lock_still_builds(_yanked: bool) -> bool returning true regardless.

In main, print both functions called with true.`,
    hints: [
      'Yank does not delete code; it only blocks new dependents.',
      'The second function ignores its argument on purpose.',
    ],
    solution: `fn can_start_new_dependency(yanked: bool) -> bool {
    !yanked
}

fn existing_lock_still_builds(_yanked: bool) -> bool {
    true
}

fn main() {
    println!("{}", can_start_new_dependency(true));
    println!("{}", existing_lock_still_builds(true));
}`,
    starter: `fn can_start_new_dependency(yanked: bool) -> bool {
    // TODO
    todo!()
}

fn existing_lock_still_builds(_yanked: bool) -> bool {
    // TODO
    todo!()
}

fn main() {
    println!("{}", can_start_new_dependency(true));
    println!("{}", existing_lock_still_builds(true));
}`,
    tags: ['publishing', 'yank', 'reasoning'],
  },
  {
    id: 'rs-ch14-c-057',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Re-Export a Trait and a Helper Together',
    prompt: `A crate hides a trait and a free function behind a module:

mod internals {
    pub trait Summary {
        fn summarize(&self) -> String;
    }
    pub fn shout(s: &str) -> String {
        format!("{}!", s)
    }
}

Re-export both Summary and shout at the crate root. Then implement Summary for a struct Tweet { pub text: String } where summarize returns the text prefixed with "tweet: ".

In main, build a Tweet with text "hi", print its summarize(), and print shout("loud").`,
    hints: [
      'Re-export with pub use internals::{Summary, shout};',
      'The trait must be in scope (via the re-export or the original path) to implement it.',
    ],
    solution: `mod internals {
    pub trait Summary {
        fn summarize(&self) -> String;
    }
    pub fn shout(s: &str) -> String {
        format!("{}!", s)
    }
}

pub use internals::{shout, Summary};

struct Tweet {
    pub text: String,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("tweet: {}", self.text)
    }
}

fn main() {
    let t = Tweet {
        text: String::from("hi"),
    };
    println!("{}", t.summarize());
    println!("{}", shout("loud"));
}`,
    starter: `mod internals {
    pub trait Summary {
        fn summarize(&self) -> String;
    }
    pub fn shout(s: &str) -> String {
        format!("{}!", s)
    }
}

// TODO: re-export Summary and shout

struct Tweet {
    pub text: String,
}

// TODO: implement Summary for Tweet

fn main() {
    let t = Tweet {
        text: String::from("hi"),
    };
    println!("{}", t.summarize());
    println!("{}", shout("loud"));
}`,
    tags: ['pub-use', 'traits', 'api-design'],
  },
  {
    id: 'rs-ch14-c-058',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Doc Comment Linking and Summary Discipline',
    prompt: `Good doc comments lead with a single concise summary sentence, then expand. Write pub fn celsius_to_fahrenheit(c: f64) -> f64 returning c * 9.0 / 5.0 + 32.0.

Its doc comment must have:
- a first line that is the summary ("Converts Celsius to Fahrenheit."),
- a blank /// line,
- a longer paragraph explaining the formula,
- an # Examples block asserting celsius_to_fahrenheit(100.0) == 212.0.

In main, print celsius_to_fahrenheit(0.0).`,
    hints: [
      'rustdoc treats the first paragraph as the short summary shown in lists.',
      'Keep the summary to one line, then a blank /// line before more detail.',
    ],
    solution: `/// Converts Celsius to Fahrenheit.
///
/// Multiplies by 9/5 and adds 32, following the standard
/// temperature conversion formula.
///
/// # Examples
///
/// \`\`\`
/// fn celsius_to_fahrenheit(c: f64) -> f64 { c * 9.0 / 5.0 + 32.0 }
/// assert_eq!(celsius_to_fahrenheit(100.0), 212.0);
/// \`\`\`
pub fn celsius_to_fahrenheit(c: f64) -> f64 {
    c * 9.0 / 5.0 + 32.0
}

fn main() {
    println!("{}", celsius_to_fahrenheit(0.0));
}`,
    starter: `/// TODO: one-line summary, blank line, detail paragraph, # Examples
pub fn celsius_to_fahrenheit(c: f64) -> f64 {
    todo!()
}

fn main() {
    println!("{}", celsius_to_fahrenheit(0.0));
}`,
    tags: ['documentation', 'doc-tests'],
  },
  {
    id: 'rs-ch14-c-059',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Workspace Manifest With Three Members',
    prompt: `Generate a workspace root manifest programmatically. Write fn workspace_manifest(members: &[&str]) -> String that returns a string of the form:

[workspace]
members = [
    "a",
    "b",
]

with one indented, quoted, comma-terminated line per member (four-space indent). Build it from the slice.

In main, call it with ["adder", "add_one", "add_two"] and print the result.`,
    hints: [
      'Start with "[workspace]\\nmembers = [\\n" and push each member line.',
      'Each member line is four spaces, a quote, the name, a quote, then a comma and newline.',
    ],
    solution: `fn workspace_manifest(members: &[&str]) -> String {
    let mut out = String::from("[workspace]\\nmembers = [\\n");
    for m in members {
        out.push_str(&format!("    \\"{}\\",\\n", m));
    }
    out.push_str("]");
    out
}

fn main() {
    let m = ["adder", "add_one", "add_two"];
    println!("{}", workspace_manifest(&m));
}`,
    starter: `fn workspace_manifest(members: &[&str]) -> String {
    // TODO: build the [workspace] manifest text
    todo!()
}

fn main() {
    let m = ["adder", "add_one", "add_two"];
    println!("{}", workspace_manifest(&m));
}`,
    tags: ['cargo', 'workspace', 'strings'],
  },
  {
    id: 'rs-ch14-c-060',
    chapter: 14,
    kind: 'coding',
    difficulty: 'medium',
    title: 'cargo build vs cargo install Decision',
    prompt: `cargo build compiles a project in place (into target/) for local development; cargo install compiles a binary crate and copies the executable into the user's cargo bin directory so it is available system-wide.

Write fn choose(goal: &str) -> &'static str returning:
- "cargo install" when goal is "use-tool-everywhere"
- "cargo build" when goal is "develop-locally"
- "unclear" otherwise.

In main, print choose for all three of those inputs.`,
    hints: [
      'Install is for tools you want on your PATH; build is for working on the code.',
      'A simple match suffices.',
    ],
    solution: `fn choose(goal: &str) -> &'static str {
    match goal {
        "use-tool-everywhere" => "cargo install",
        "develop-locally" => "cargo build",
        _ => "unclear",
    }
}

fn main() {
    println!("{}", choose("use-tool-everywhere"));
    println!("{}", choose("develop-locally"));
    println!("{}", choose("something-else"));
}`,
    starter: `fn choose(goal: &str) -> &'static str {
    // TODO: match the goal
    todo!()
}

fn main() {
    println!("{}", choose("use-tool-everywhere"));
    println!("{}", choose("develop-locally"));
    println!("{}", choose("something-else"));
}`,
    tags: ['cargo', 'cargo-install', 'reasoning'],
  },
  {
    id: 'rs-ch14-c-061',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'A Curated Public API Module Tree',
    prompt: `Design a small crate's internals and present a clean front page.

Internally define mod engine containing:
- pub mod text with pub fn slugify(s: &str) -> String that lowercases s and replaces spaces with '-',
- pub mod num with pub fn clamp(x: i32, lo: i32, hi: i32) -> i32.

At the crate root, re-export slugify and clamp directly with pub use so users never type engine::text:: or engine::num::.

In main, print slugify("Hello World") (expect "hello-world") and clamp(15, 0, 10) (expect 10).`,
    hints: [
      'Re-export each function: pub use engine::text::slugify; pub use engine::num::clamp;',
      'For slugify, build a String char by char or use replace and to_lowercase.',
      'For clamp, compare against lo and hi with if/else or .max/.min.',
    ],
    solution: `mod engine {
    pub mod text {
        pub fn slugify(s: &str) -> String {
            s.to_lowercase().replace(' ', "-")
        }
    }
    pub mod num {
        pub fn clamp(x: i32, lo: i32, hi: i32) -> i32 {
            if x < lo {
                lo
            } else if x > hi {
                hi
            } else {
                x
            }
        }
    }
}

pub use engine::num::clamp;
pub use engine::text::slugify;

fn main() {
    println!("{}", slugify("Hello World"));
    println!("{}", clamp(15, 0, 10));
}`,
    starter: `mod engine {
    pub mod text {
        pub fn slugify(s: &str) -> String {
            todo!()
        }
    }
    pub mod num {
        pub fn clamp(x: i32, lo: i32, hi: i32) -> i32 {
            todo!()
        }
    }
}

// TODO: re-export slugify and clamp at the crate root

fn main() {
    println!("{}", slugify("Hello World"));
    println!("{}", clamp(15, 0, 10));
}`,
    tags: ['pub-use', 'api-design', 'modules'],
  },
  {
    id: 'rs-ch14-c-062',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Generate a Publishable Package Manifest',
    prompt: `Write fn package_manifest(name: &str, version: &str, desc: &str, license: &str) -> String that produces a complete, publishable [package] table as a single string:

[package]
name = "..."
version = "..."
edition = "2021"
description = "..."
license = "..."

Edition is always "2021". Each field value must be wrapped in double quotes.

In main, call it with name "kinds", version "0.1.0", description "Color and shape kinds.", license "MIT OR Apache-2.0", and print the result.`,
    hints: [
      'Use format! with embedded escaped quotes, or push quoted segments.',
      'A literal double quote inside a Rust string is written as a backslash followed by a quote.',
    ],
    solution: `fn package_manifest(name: &str, version: &str, desc: &str, license: &str) -> String {
    format!(
        "[package]\\nname = \\"{}\\"\\nversion = \\"{}\\"\\nedition = \\"2021\\"\\ndescription = \\"{}\\"\\nlicense = \\"{}\\"",
        name, version, desc, license
    )
}

fn main() {
    let m = package_manifest(
        "kinds",
        "0.1.0",
        "Color and shape kinds.",
        "MIT OR Apache-2.0",
    );
    println!("{}", m);
}`,
    starter: `fn package_manifest(name: &str, version: &str, desc: &str, license: &str) -> String {
    // TODO: build the [package] table with all fields quoted
    todo!()
}

fn main() {
    let m = package_manifest(
        "kinds",
        "0.1.0",
        "Color and shape kinds.",
        "MIT OR Apache-2.0",
    );
    println!("{}", m);
}`,
    tags: ['cargo', 'publishing', 'metadata'],
  },
  {
    id: 'rs-ch14-c-063',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Parse and Compare SemVer Strings',
    prompt: `Write fn parse(v: &str) -> Option<(u32, u32, u32)> that parses a string like "1.4.2" into a (major, minor, patch) tuple, returning None if it does not have exactly three dot-separated numeric parts.

Then write fn newer(a: &str, b: &str) -> bool that returns true when a parses to a strictly greater version than b (and false if either fails to parse or a is not greater).

In main, print newer("1.4.0", "1.3.9") and newer("2.0.0", "2.0.0") and newer("bad", "1.0.0").`,
    hints: [
      'Split on the dot character and collect parts; check there are exactly three.',
      'Parse each part with str::parse::<u32>() and bail to None on error.',
      'Tuples compare lexicographically, so a > b on (u32,u32,u32) does the right thing.',
    ],
    solution: `fn parse(v: &str) -> Option<(u32, u32, u32)> {
    let parts: Vec<&str> = v.split('.').collect();
    if parts.len() != 3 {
        return None;
    }
    let major = parts[0].parse::<u32>().ok()?;
    let minor = parts[1].parse::<u32>().ok()?;
    let patch = parts[2].parse::<u32>().ok()?;
    Some((major, minor, patch))
}

fn newer(a: &str, b: &str) -> bool {
    match (parse(a), parse(b)) {
        (Some(va), Some(vb)) => va > vb,
        _ => false,
    }
}

fn main() {
    println!("{}", newer("1.4.0", "1.3.9"));
    println!("{}", newer("2.0.0", "2.0.0"));
    println!("{}", newer("bad", "1.0.0"));
}`,
    starter: `fn parse(v: &str) -> Option<(u32, u32, u32)> {
    // TODO: split on '.', require 3 numeric parts
    todo!()
}

fn newer(a: &str, b: &str) -> bool {
    // TODO: compare parsed versions
    todo!()
}

fn main() {
    println!("{}", newer("1.4.0", "1.3.9"));
    println!("{}", newer("2.0.0", "2.0.0"));
    println!("{}", newer("bad", "1.0.0"));
}`,
    tags: ['semver', 'parsing', 'option'],
  },
  {
    id: 'rs-ch14-c-064',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Workspace Path Dependency Generator',
    prompt: `In a workspace, a binary crate often depends on several sibling library crates by path. Write fn dependencies_table(deps: &[&str]) -> String that, given sibling crate names, produces:

[dependencies]
add_one = { path = "../add_one" }
add_two = { path = "../add_two" }

That is, for each name it emits a line name = { path = "../name" }. The crates are siblings, so the path is "../" followed by the name.

In main, call it with ["add_one", "add_two"] and print the result.`,
    hints: [
      'Begin the string with "[dependencies]\\n".',
      'Remember a literal brace in a format string is written by doubling it.',
      'For each name push name = { path = "../name" } followed by a newline.',
    ],
    solution: `fn dependencies_table(deps: &[&str]) -> String {
    let mut out = String::from("[dependencies]\\n");
    for d in deps {
        out.push_str(&format!("{} = {{ path = \\"../{}\\" }}\\n", d, d));
    }
    out
}

fn main() {
    let deps = ["add_one", "add_two"];
    print!("{}", dependencies_table(&deps));
}`,
    starter: `fn dependencies_table(deps: &[&str]) -> String {
    // TODO: build a [dependencies] table of sibling path deps
    todo!()
}

fn main() {
    let deps = ["add_one", "add_two"];
    print!("{}", dependencies_table(&deps));
}`,
    tags: ['cargo', 'workspace', 'path-dependency'],
  },
  {
    id: 'rs-ch14-c-065',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Facade Module With Documented Re-Exports',
    prompt: `Build a documented facade. Define mod core_logic with pub fn encode(s: &str) -> String returning s with each space turned into '_', and pub fn decode(s: &str) -> String reversing that.

At the crate root, add a crate-level //! comment (two lines) describing the crate, then re-export both functions with pub use, and give the re-exports a doc comment using /// above each pub use line.

In main, print encode("a b c") (expect "a_b_c") and decode("a_b_c") (expect "a b c").`,
    hints: [
      'You can attach a /// doc comment directly above a pub use statement.',
      'encode: replace space with underscore; decode: replace underscore with space.',
      'The //! crate comment must be the first lines in the file.',
    ],
    solution: `//! # codec
//!
//! Tiny space-encoding helpers presented as a flat API.

mod core_logic {
    pub fn encode(s: &str) -> String {
        s.replace(' ', "_")
    }
    pub fn decode(s: &str) -> String {
        s.replace('_', " ")
    }
}

/// Re-exported encoder: turns spaces into underscores.
pub use core_logic::encode;

/// Re-exported decoder: turns underscores back into spaces.
pub use core_logic::decode;

fn main() {
    println!("{}", encode("a b c"));
    println!("{}", decode("a_b_c"));
}`,
    starter: `//! TODO: two-line crate description

mod core_logic {
    pub fn encode(s: &str) -> String {
        todo!()
    }
    pub fn decode(s: &str) -> String {
        todo!()
    }
}

// TODO: documented re-exports of encode and decode

fn main() {
    println!("{}", encode("a b c"));
    println!("{}", decode("a_b_c"));
}`,
    tags: ['pub-use', 'documentation', 'api-design'],
  },
  {
    id: 'rs-ch14-c-066',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Validate Publish Readiness',
    prompt: `Before cargo publish succeeds, the manifest must have a non-empty description and a license, and a version that is not "0.0.0".

Write fn ready_to_publish(description: &str, license: &str, version: &str) -> Result<(), String> that returns Ok(()) when all conditions hold, or Err with one of these messages: "missing description", "missing license", or "invalid version" (checked in that order).

In main, print the results of these calls using a match that prints "ok" for Ok and the message for Err:
- ready_to_publish("", "MIT", "0.1.0")
- ready_to_publish("a crate", "", "0.1.0")
- ready_to_publish("a crate", "MIT", "0.0.0")
- ready_to_publish("a crate", "MIT", "0.1.0")`,
    hints: [
      'Check the conditions in order, returning Err early on the first failure.',
      'description.is_empty() and license.is_empty() guard the first two.',
      'A version equal to "0.0.0" is the invalid case here.',
    ],
    solution: `fn ready_to_publish(description: &str, license: &str, version: &str) -> Result<(), String> {
    if description.is_empty() {
        return Err(String::from("missing description"));
    }
    if license.is_empty() {
        return Err(String::from("missing license"));
    }
    if version == "0.0.0" {
        return Err(String::from("invalid version"));
    }
    Ok(())
}

fn report(r: Result<(), String>) {
    match r {
        Ok(()) => println!("ok"),
        Err(msg) => println!("{}", msg),
    }
}

fn main() {
    report(ready_to_publish("", "MIT", "0.1.0"));
    report(ready_to_publish("a crate", "", "0.1.0"));
    report(ready_to_publish("a crate", "MIT", "0.0.0"));
    report(ready_to_publish("a crate", "MIT", "0.1.0"));
}`,
    starter: `fn ready_to_publish(description: &str, license: &str, version: &str) -> Result<(), String> {
    // TODO: validate in order: description, license, version
    todo!()
}

fn main() {
    // TODO: call ready_to_publish four times and print "ok" or the error
}`,
    tags: ['publishing', 'result', 'validation'],
  },
  {
    id: 'rs-ch14-c-067',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Two-Crate Workspace, Simulated in One File',
    prompt: `Simulate a workspace where library add_one is consumed by binary adder, using modules to stand in for the two crates.

Define mod add_one as the "library crate" containing a documented pub fn add_one(x: i32) -> i32 with an # Examples doc-test asserting add_one(2) == 3.

Then write the "binary crate" logic in main: bring the function into scope with a use statement (use add_one::add_one;) and print "10 plus one is 11" by calling it on 10.`,
    hints: [
      'Inside the module, the function and its doc-test live together.',
      'use add_one::add_one; pulls the function into the scope of main.',
      'Then call add_one(10) and format the message.',
    ],
    solution: `mod add_one {
    /// Adds one to the given number.
    ///
    /// # Examples
    ///
    /// \`\`\`
    /// fn add_one(x: i32) -> i32 { x + 1 }
    /// assert_eq!(add_one(2), 3);
    /// \`\`\`
    pub fn add_one(x: i32) -> i32 {
        x + 1
    }
}

use add_one::add_one;

fn main() {
    let n = 10;
    println!("{} plus one is {}", n, add_one(n));
}`,
    starter: `mod add_one {
    // TODO: documented pub fn add_one with an # Examples doc-test
    pub fn add_one(x: i32) -> i32 {
        todo!()
    }
}

// TODO: bring add_one::add_one into scope

fn main() {
    let n = 10;
    println!("{} plus one is {}", n, add_one(n));
}`,
    tags: ['workspace', 'modules', 'documentation'],
  },
  {
    id: 'rs-ch14-c-068',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Render a Full Cargo.toml For Publishing',
    prompt: `Combine metadata, a profile, and a dependency into one manifest renderer.

Write fn render() -> String that returns a string containing, in this exact order and separated by single blank lines:

[package]
name = "tool"
version = "1.0.0"
edition = "2021"
description = "A CLI tool."
license = "MIT"

[dependencies]
rand = "0.8"

[profile.release]
opt-level = 3

In main, print render().`,
    hints: [
      'Build the whole thing as one big string with embedded newlines.',
      'A literal double quote in a Rust string literal is a backslash then a quote.',
      'Sections are separated by a blank line (two consecutive newlines).',
    ],
    solution: `fn render() -> String {
    let package = "[package]\\nname = \\"tool\\"\\nversion = \\"1.0.0\\"\\nedition = \\"2021\\"\\ndescription = \\"A CLI tool.\\"\\nlicense = \\"MIT\\"";
    let deps = "[dependencies]\\nrand = \\"0.8\\"";
    let profile = "[profile.release]\\nopt-level = 3";
    format!("{}\\n\\n{}\\n\\n{}", package, deps, profile)
}

fn main() {
    println!("{}", render());
}`,
    starter: `fn render() -> String {
    // TODO: assemble [package], [dependencies], and [profile.release]
    // separated by blank lines
    todo!()
}

fn main() {
    println!("{}", render());
}`,
    tags: ['cargo', 'publishing', 'release-profile'],
  },
  {
    id: 'rs-ch14-c-069',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Resolve a Custom Cargo Subcommand From PATH',
    prompt: `Cargo discovers subcommands by scanning PATH for executables named cargo-NAME. Given a list of binary names and a requested subcommand, decide what runs.

Write fn resolve(path: &[&str], sub: &str) -> Option<String> that returns Some(binary_name) if some entry in path equals format!("cargo-{}", sub); otherwise None.

In main, with path = ["cargo-count", "ripgrep", "cargo-expand"], print the debug form of resolve(&path, "expand") and resolve(&path, "missing").`,
    hints: [
      'Compute the target name format!("cargo-{}", sub) once.',
      'Iterate the slice; return Some(String) on a match.',
      'Use the {:?} debug format to print the Option directly.',
    ],
    solution: `fn resolve(path: &[&str], sub: &str) -> Option<String> {
    let target = format!("cargo-{}", sub);
    for bin in path {
        if *bin == target {
            return Some(String::from(*bin));
        }
    }
    None
}

fn main() {
    let path = ["cargo-count", "ripgrep", "cargo-expand"];
    println!("{:?}", resolve(&path, "expand"));
    println!("{:?}", resolve(&path, "missing"));
}`,
    starter: `fn resolve(path: &[&str], sub: &str) -> Option<String> {
    // TODO: look for an entry equal to "cargo-<sub>"
    todo!()
}

fn main() {
    let path = ["cargo-count", "ripgrep", "cargo-expand"];
    println!("{:?}", resolve(&path, "expand"));
    println!("{:?}", resolve(&path, "missing"));
}`,
    tags: ['cargo', 'subcommands', 'option'],
  },
  {
    id: 'rs-ch14-c-070',
    chapter: 14,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Publish-Order Planner For a Workspace',
    prompt: `When publishing workspace crates that depend on each other, you must publish a dependency before the crate that uses it. Given a binary crate that path-depends on a library, the library publishes first.

Write fn publish_order(library: &str, binary: &str) -> Vec<String> that returns a Vec with the library name first and the binary name second.

Then write fn is_valid_order(order: &[String], library: &str, binary: &str) -> bool that returns true only if the library appears before the binary in order.

In main: build the order for library "add_one" and binary "adder", print each entry on its own line, then print is_valid_order(&order, "add_one", "adder").`,
    hints: [
      'publish_order just pushes library then binary into a Vec<String>.',
      'For is_valid_order, find the index of each name with position and compare.',
      'iter().position(|x| x == name) returns an Option of the index.',
    ],
    solution: `fn publish_order(library: &str, binary: &str) -> Vec<String> {
    vec![String::from(library), String::from(binary)]
}

fn is_valid_order(order: &[String], library: &str, binary: &str) -> bool {
    let lib_idx = order.iter().position(|x| x == library);
    let bin_idx = order.iter().position(|x| x == binary);
    match (lib_idx, bin_idx) {
        (Some(l), Some(b)) => l < b,
        _ => false,
    }
}

fn main() {
    let order = publish_order("add_one", "adder");
    for crate_name in &order {
        println!("{}", crate_name);
    }
    println!("{}", is_valid_order(&order, "add_one", "adder"));
}`,
    starter: `fn publish_order(library: &str, binary: &str) -> Vec<String> {
    // TODO: library first, then binary
    todo!()
}

fn is_valid_order(order: &[String], library: &str, binary: &str) -> bool {
    // TODO: library must come before binary
    todo!()
}

fn main() {
    let order = publish_order("add_one", "adder");
    for crate_name in &order {
        println!("{}", crate_name);
    }
    println!("{}", is_valid_order(&order, "add_one", "adder"));
}`,
    tags: ['workspace', 'publishing', 'vec'],
  },
]

export default problems
