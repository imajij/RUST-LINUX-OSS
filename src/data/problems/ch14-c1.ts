import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch14-c-001',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Doc Comment on a Function',
    prompt: `Documentation comments use three slashes and support Markdown. Write a public function named "double" that takes an i32 and returns it multiplied by two. Add a one-line doc comment above it that reads: "Returns the input multiplied by two." In main, call double(21) and print the result, which should be 42.`,
    hints: [
      'Documentation comments start with three slashes (///) and go directly above the item.',
      'Mark the function pub so it could be documented as part of a public API.',
    ],
    solution: `/// Returns the input multiplied by two.
pub fn double(x: i32) -> i32 {
    x * 2
}

fn main() {
    println!("{}", double(21));
}`,
    starter: `// TODO: add a /// doc comment, then implement double
pub fn double(x: i32) -> i32 {
    todo!()
}

fn main() {
    println!("{}", double(21));
}`,
    tags: ['documentation', 'doc-comments'],
  },
  {
    id: 'rs-ch14-c-002',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Crate-Level Inner Doc Comment',
    prompt: `Inner doc comments use //! and document the item that contains them, such as a whole crate or module. At the very top of the file, add an inner doc comment line that reads: "A tiny utilities crate." Below it, define a pub function "greet" that returns the String "hello" and print it from main.`,
    hints: [
      'Inner doc comments begin with //! and describe the enclosing item.',
      'Place the //! line as the first thing in the file.',
    ],
    solution: `//! A tiny utilities crate.

pub fn greet() -> String {
    String::from("hello")
}

fn main() {
    println!("{}", greet());
}`,
    starter: `// TODO: add a //! crate-level inner doc comment as the first line

pub fn greet() -> String {
    todo!()
}

fn main() {
    println!("{}", greet());
}`,
    tags: ['documentation', 'crate-docs'],
  },
  {
    id: 'rs-ch14-c-003',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Doc Comment With an Examples Section',
    prompt: `A common doc-comment convention is an "# Examples" Markdown heading followed by a fenced Rust code block. Write a pub function "add_one" that takes an i32 and returns it plus one. Above it write a doc comment that has a "# Examples" heading and a fenced code block showing add_one(5) producing 6. Call add_one(5) in main and print the result.`,
    hints: [
      'In a doc comment, a fenced code block is three backticks on their own lines.',
      'The heading line is: # Examples',
    ],
    solution: `/// Adds one to the given number.
///
/// # Examples
///
/// \`\`\`
/// let result = add_one(5);
/// assert_eq!(result, 6);
/// \`\`\`
pub fn add_one(x: i32) -> i32 {
    x + 1
}

fn main() {
    println!("{}", add_one(5));
}`,
    starter: `/// TODO: write a doc comment with an # Examples section
pub fn add_one(x: i32) -> i32 {
    todo!()
}

fn main() {
    println!("{}", add_one(5));
}`,
    tags: ['documentation', 'examples'],
  },
  {
    id: 'rs-ch14-c-004',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Re-export With pub use',
    prompt: `The pub use construct re-exports an item so callers can reach it through a shorter path. Define a module "deep" containing a module "inner" containing a pub function "ping" that returns the i32 100. At the crate root add a pub use re-export so that "ping" is reachable as a top-level name. In main, call the re-exported ping() (just ping()) and print its result.`,
    hints: [
      'Nest the modules: mod deep { pub mod inner { pub fn ping() ... } }',
      'Re-export with: pub use deep::inner::ping;',
      'After re-exporting, you can call ping() directly in main via the crate path.',
    ],
    solution: `pub mod deep {
    pub mod inner {
        pub fn ping() -> i32 {
            100
        }
    }
}

pub use deep::inner::ping;

fn main() {
    println!("{}", ping());
}`,
    starter: `pub mod deep {
    pub mod inner {
        pub fn ping() -> i32 {
            todo!()
        }
    }
}

// TODO: re-export ping with pub use

fn main() {
    println!("{}", ping());
}`,
    tags: ['pub-use', 're-export', 'modules'],
  },
  {
    id: 'rs-ch14-c-005',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Documenting a Public Struct',
    prompt: `Write a pub struct "Point" with pub fields x and y, both i32. Add a /// doc comment above the struct that reads: "A point in 2D space." In main, build a Point with x of 1 and y of 2 and print both fields.`,
    hints: [
      'The doc comment goes directly above the struct keyword.',
      'Both the struct and its fields need pub to be part of a public API.',
    ],
    solution: `/// A point in 2D space.
pub struct Point {
    pub x: i32,
    pub y: i32,
}

fn main() {
    let p = Point { x: 1, y: 2 };
    println!("{} {}", p.x, p.y);
}`,
    starter: `// TODO: add a doc comment above the struct
pub struct Point {
    pub x: i32,
    pub y: i32,
}

fn main() {
    let p = Point { x: 1, y: 2 };
    println!("{} {}", p.x, p.y);
}`,
    tags: ['documentation', 'structs'],
  },
  {
    id: 'rs-ch14-c-006',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Release Profile in Cargo.toml',
    prompt: `Release profiles let you tune compiler settings per build mode. Write the contents of a Cargo.toml snippet (as a Rust string printed from main is NOT needed; just write the file text in your answer) that sets the release profile opt-level to 3. Specifically, produce the two lines that form a [profile.release] section with opt-level = 3. To make this runnable, store that exact two-line text in a Rust string and print it from main.`,
    hints: [
      'The section header is [profile.release].',
      'The setting line is: opt-level = 3',
      'Use a Rust raw or normal string with a newline between the two lines.',
    ],
    solution: `fn main() {
    let toml = "[profile.release]\\nopt-level = 3";
    println!("{}", toml);
}`,
    starter: `fn main() {
    // TODO: set toml to the two-line [profile.release] snippet with opt-level = 3
    let toml = "";
    println!("{}", toml);
}`,
    tags: ['cargo', 'release-profile'],
  },
  {
    id: 'rs-ch14-c-007',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'The Default Dev opt-level',
    prompt: `By default the dev profile uses opt-level 0 (no optimization, fast builds) and the release profile uses opt-level 3. Write a function "default_opt_level(profile: &str) -> u8" that returns 0 for "dev" and 3 for "release". In main, print the value for both profiles. You may assume only those two inputs.`,
    hints: [
      'A match on the &str works well here.',
      'Return 0 for the dev arm and 3 for the release arm.',
    ],
    solution: `fn default_opt_level(profile: &str) -> u8 {
    match profile {
        "dev" => 0,
        "release" => 3,
        _ => 0,
    }
}

fn main() {
    println!("{}", default_opt_level("dev"));
    println!("{}", default_opt_level("release"));
}`,
    starter: `fn default_opt_level(profile: &str) -> u8 {
    todo!()
}

fn main() {
    println!("{}", default_opt_level("dev"));
    println!("{}", default_opt_level("release"));
}`,
    tags: ['cargo', 'release-profile', 'opt-level'],
  },
  {
    id: 'rs-ch14-c-008',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Markdown Bullet List in Docs',
    prompt: `Doc comments render Markdown, including bullet lists. Write a pub function "describe" that returns the i32 7. Above it, add a doc comment with two bullet lines: a line "- it is small" and a line "- it returns seven". In main, call describe() and print its return value.`,
    hints: [
      'Markdown bullets in doc comments are lines starting with "- ".',
      'Each doc line starts with /// .',
    ],
    solution: `/// Describes the number this returns:
///
/// - it is small
/// - it returns seven
pub fn describe() -> i32 {
    7
}

fn main() {
    println!("{}", describe());
}`,
    starter: `// TODO: doc comment with two markdown bullet lines
pub fn describe() -> i32 {
    todo!()
}

fn main() {
    println!("{}", describe());
}`,
    tags: ['documentation', 'markdown'],
  },
  {
    id: 'rs-ch14-c-009',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Semver Bump Reasoning',
    prompt: `Crates.io follows Semantic Versioning: major.minor.patch. A backward-compatible bug fix bumps the patch number. Write a function "next_patch(major: u32, minor: u32, patch: u32) -> String" that returns the next version string after a bug fix, formatted as "major.minor.patch" with patch increased by one. In main, print next_patch(1, 4, 2), which should be "1.4.3".`,
    hints: [
      'Only the patch number changes for a bug-fix release.',
      'Use format! with the pattern "{}.{}.{}".',
    ],
    solution: `fn next_patch(major: u32, minor: u32, patch: u32) -> String {
    format!("{}.{}.{}", major, minor, patch + 1)
}

fn main() {
    println!("{}", next_patch(1, 4, 2));
}`,
    starter: `fn next_patch(major: u32, minor: u32, patch: u32) -> String {
    todo!()
}

fn main() {
    println!("{}", next_patch(1, 4, 2));
}`,
    tags: ['semver', 'publishing'],
  },
  {
    id: 'rs-ch14-c-010',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Package Metadata Fields',
    prompt: `Before publishing to crates.io, the [package] table in Cargo.toml needs metadata such as name, version, edition, license, and description. Write a Rust program that prints exactly these five field names, one per line, in this order: name, version, edition, license, description.`,
    hints: [
      'You can use five println! calls or print a multi-line string.',
      'Just print the bare field names, no values.',
    ],
    solution: `fn main() {
    println!("name");
    println!("version");
    println!("edition");
    println!("license");
    println!("description");
}`,
    starter: `fn main() {
    // TODO: print the five package metadata field names, one per line
}`,
    tags: ['cargo', 'publishing', 'metadata'],
  },
  {
    id: 'rs-ch14-c-011',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'cargo install Targets',
    prompt: `cargo install installs crates that provide a binary (an executable) for use as a command-line tool; it cannot install library-only crates. Write a function "is_installable(has_binary: bool) -> bool" that returns whether cargo install would work, given whether the crate has a binary target. In main, print is_installable(true) and is_installable(false).`,
    hints: [
      'The answer is simply whether the crate has a binary target.',
      'Return the boolean argument directly.',
    ],
    solution: `fn is_installable(has_binary: bool) -> bool {
    has_binary
}

fn main() {
    println!("{}", is_installable(true));
    println!("{}", is_installable(false));
}`,
    starter: `fn is_installable(has_binary: bool) -> bool {
    todo!()
}

fn main() {
    println!("{}", is_installable(true));
    println!("{}", is_installable(false));
}`,
    tags: ['cargo', 'cargo-install'],
  },
  {
    id: 'rs-ch14-c-012',
    chapter: 14,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Custom Cargo Subcommand Naming',
    prompt: `Cargo discovers custom subcommands by looking for executables on your PATH named "cargo-something"; running "cargo something" then invokes it. Write a function "subcommand_binary(name: &str) -> String" that, given a subcommand name, returns the binary file name Cargo looks for by prefixing "cargo-". In main, print subcommand_binary("fmt"), which should be "cargo-fmt".`,
    hints: [
      'Prefix the name with the literal text "cargo-".',
      'Use format! or string concatenation.',
    ],
    solution: `fn subcommand_binary(name: &str) -> String {
    format!("cargo-{}", name)
}

fn main() {
    println!("{}", subcommand_binary("fmt"));
}`,
    starter: `fn subcommand_binary(name: &str) -> String {
    todo!()
}

fn main() {
    println!("{}", subcommand_binary("fmt"));
}`,
    tags: ['cargo', 'subcommands'],
  },
  {
    id: 'rs-ch14-c-013',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Doc Test That Asserts a Result',
    prompt: `Code in an # Examples block is compiled and run by cargo test as a documentation test. Write a pub function "square" that returns its i32 argument multiplied by itself. Give it a doc comment containing an # Examples block whose code calls crate_name::square is NOT needed; instead the example should call square(4) and assert_eq! that the result is 16. Run square(4) in main and print it.`,
    hints: [
      'Doc-test code lives inside a fenced block under # Examples.',
      'Use assert_eq!(square(4), 16); inside the example.',
    ],
    solution: `/// Squares a number.
///
/// # Examples
///
/// \`\`\`
/// let r = square(4);
/// assert_eq!(r, 16);
/// \`\`\`
pub fn square(n: i32) -> i32 {
    n * n
}

fn main() {
    println!("{}", square(4));
}`,
    starter: `/// TODO: doc comment with an # Examples block that asserts square(4) == 16
pub fn square(n: i32) -> i32 {
    todo!()
}

fn main() {
    println!("{}", square(4));
}`,
    tags: ['documentation', 'doc-tests'],
  },
  {
    id: 'rs-ch14-c-014',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Re-export Several Items at the Root',
    prompt: `Define a module "shapes" with a pub struct "Circle" (pub field radius of type f64) and a pub function "area" that takes a Circle and returns its area using 3.14159 times radius squared. At the crate root, re-export both Circle and area with pub use so they are reachable directly. In main, build a Circle with radius 2.0 using the short path and print area(c).`,
    hints: [
      'Re-export each item: pub use shapes::Circle; and pub use shapes::area;',
      'Compute area as 3.14159 * radius * radius.',
    ],
    solution: `pub mod shapes {
    pub struct Circle {
        pub radius: f64,
    }

    pub fn area(c: Circle) -> f64 {
        3.14159 * c.radius * c.radius
    }
}

pub use shapes::area;
pub use shapes::Circle;

fn main() {
    let c = Circle { radius: 2.0 };
    println!("{}", area(c));
}`,
    starter: `pub mod shapes {
    pub struct Circle {
        pub radius: f64,
    }

    pub fn area(c: Circle) -> f64 {
        todo!()
    }
}

// TODO: re-export Circle and area with pub use

fn main() {
    let c = Circle { radius: 2.0 };
    println!("{}", area(c));
}`,
    tags: ['pub-use', 're-export', 'modules'],
  },
  {
    id: 'rs-ch14-c-015',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Workspace Member List',
    prompt: `A Cargo workspace declares its members in a [workspace] table with a "members" array. Write a function "workspace_members() -> Vec<String>" that returns the member crate names "adder" and "add_one" in that order. In main, print each member on its own line.`,
    hints: [
      'Build the Vec with vec![String::from("adder"), String::from("add_one")].',
      'Iterate the Vec to print each name.',
    ],
    solution: `fn workspace_members() -> Vec<String> {
    vec![String::from("adder"), String::from("add_one")]
}

fn main() {
    for m in workspace_members() {
        println!("{}", m);
    }
}`,
    starter: `fn workspace_members() -> Vec<String> {
    todo!()
}

fn main() {
    for m in workspace_members() {
        println!("{}", m);
    }
}`,
    tags: ['cargo', 'workspace'],
  },
  {
    id: 'rs-ch14-c-016',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Path Dependency in Cargo.toml',
    prompt: `Within a workspace, one member depends on another using a path dependency, like: add_one = { path = "../add_one" }. Write a function "path_dep_line(name: &str) -> String" that returns the dependency line for the given crate name, using the relative path "../" followed by the name. In main, print path_dep_line("add_one").`,
    hints: [
      'The output format is: name = { path = "../name" }',
      'Use format! and remember the path uses ../ before the crate name.',
    ],
    solution: `fn path_dep_line(name: &str) -> String {
    format!("{} = {{ path = \\"../{}\\" }}", name, name)
}

fn main() {
    println!("{}", path_dep_line("add_one"));
}`,
    starter: `fn path_dep_line(name: &str) -> String {
    todo!()
}

fn main() {
    println!("{}", path_dep_line("add_one"));
}`,
    tags: ['cargo', 'workspace', 'path-dependency'],
  },
  {
    id: 'rs-ch14-c-017',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Simulating a Workspace Member Call',
    prompt: `In a workspace, the binary crate "adder" calls a function from the library crate "add_one". Simulate this with a module "add_one" containing a pub function "add_one(x: i32) -> i32" that returns x plus one. In main (acting as the adder binary), call add_one::add_one(10) and print the result, which should be 11.`,
    hints: [
      'Place add_one inside a module to mimic the separate library crate.',
      'Call it with the path module::function: add_one::add_one(10).',
    ],
    solution: `mod add_one {
    pub fn add_one(x: i32) -> i32 {
        x + 1
    }
}

fn main() {
    println!("{}", add_one::add_one(10));
}`,
    starter: `mod add_one {
    pub fn add_one(x: i32) -> i32 {
        todo!()
    }
}

fn main() {
    println!("{}", add_one::add_one(10));
}`,
    tags: ['cargo', 'workspace', 'modules'],
  },
  {
    id: 'rs-ch14-c-018',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Documenting a Function That Can Panic',
    prompt: `A useful doc convention is a "# Panics" section describing when a function panics. Write a pub function "checked_half(n: i32) -> i32" that returns n divided by 2 but panics with the message "odd input" when n is odd. Add a doc comment with a "# Panics" heading explaining it panics on odd input. In main, call checked_half(8) and print it.`,
    hints: [
      'Use n % 2 != 0 to detect odd numbers and call panic! with the message.',
      'The doc section heading is: # Panics',
    ],
    solution: `/// Returns half of an even number.
///
/// # Panics
///
/// Panics if n is odd.
pub fn checked_half(n: i32) -> i32 {
    if n % 2 != 0 {
        panic!("odd input");
    }
    n / 2
}

fn main() {
    println!("{}", checked_half(8));
}`,
    starter: `/// TODO: doc comment with a # Panics section
pub fn checked_half(n: i32) -> i32 {
    todo!()
}

fn main() {
    println!("{}", checked_half(8));
}`,
    tags: ['documentation', 'panics'],
  },
  {
    id: 'rs-ch14-c-019',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Building a Clean Public API',
    prompt: `Library authors hide internal module structure behind re-exports so users import from one tidy path. Define modules "color" (with pub enum "PrimaryColor" having variants Red, Yellow, Blue) and "mix" (with pub function "name_of" taking a PrimaryColor and returning its name as a String). Use pub use to re-export both PrimaryColor and name_of at the crate root. In main, call name_of(PrimaryColor::Yellow) via the short paths and print it.`,
    hints: [
      'Re-export with pub use color::PrimaryColor; and pub use mix::name_of;',
      'In name_of, match the enum and return the matching String.',
      'The mix module must refer to PrimaryColor via crate::color::PrimaryColor or a use.',
    ],
    solution: `pub mod color {
    pub enum PrimaryColor {
        Red,
        Yellow,
        Blue,
    }
}

pub mod mix {
    use crate::color::PrimaryColor;

    pub fn name_of(c: PrimaryColor) -> String {
        match c {
            PrimaryColor::Red => String::from("Red"),
            PrimaryColor::Yellow => String::from("Yellow"),
            PrimaryColor::Blue => String::from("Blue"),
        }
    }
}

pub use color::PrimaryColor;
pub use mix::name_of;

fn main() {
    println!("{}", name_of(PrimaryColor::Yellow));
}`,
    starter: `pub mod color {
    pub enum PrimaryColor {
        Red,
        Yellow,
        Blue,
    }
}

pub mod mix {
    use crate::color::PrimaryColor;

    pub fn name_of(c: PrimaryColor) -> String {
        todo!()
    }
}

// TODO: re-export PrimaryColor and name_of with pub use

fn main() {
    println!("{}", name_of(PrimaryColor::Yellow));
}`,
    tags: ['pub-use', 'public-api', 'enums'],
  },
  {
    id: 'rs-ch14-c-020',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Doc Test on a String Helper',
    prompt: `Write a pub function "shout(s: &str) -> String" that returns the uppercase version of s with an exclamation mark appended. Add a doc comment with an # Examples block whose example calls shout("hi") and asserts the result equals "HI!". In main, print shout("hello").`,
    hints: [
      'Use s.to_uppercase() and then push or format in the "!".',
      'The example uses assert_eq!(shout("hi"), "HI!");',
    ],
    solution: `/// Returns an uppercase, exclaimed copy of the input.
///
/// # Examples
///
/// \`\`\`
/// assert_eq!(shout("hi"), "HI!");
/// \`\`\`
pub fn shout(s: &str) -> String {
    format!("{}!", s.to_uppercase())
}

fn main() {
    println!("{}", shout("hello"));
}`,
    starter: `/// TODO: doc comment with an # Examples block asserting shout("hi") == "HI!"
pub fn shout(s: &str) -> String {
    todo!()
}

fn main() {
    println!("{}", shout("hello"));
}`,
    tags: ['documentation', 'doc-tests', 'strings'],
  },
  {
    id: 'rs-ch14-c-021',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Yanked Versions Cannot Be New Dependencies',
    prompt: `Running cargo yank marks a published version as not usable for new projects, while existing projects with a lockfile entry can still use it. Write a function "can_add_as_new_dependency(yanked: bool) -> bool" that returns true only when the version is NOT yanked. In main, print the result for both true and false.`,
    hints: [
      'A yanked version cannot be added as a new dependency, so return the negation.',
      'Use the ! operator on the argument.',
    ],
    solution: `fn can_add_as_new_dependency(yanked: bool) -> bool {
    !yanked
}

fn main() {
    println!("{}", can_add_as_new_dependency(true));
    println!("{}", can_add_as_new_dependency(false));
}`,
    starter: `fn can_add_as_new_dependency(yanked: bool) -> bool {
    todo!()
}

fn main() {
    println!("{}", can_add_as_new_dependency(true));
    println!("{}", can_add_as_new_dependency(false));
}`,
    tags: ['publishing', 'yank', 'semver'],
  },
  {
    id: 'rs-ch14-c-022',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Minor Bump for a New Feature',
    prompt: `Under Semantic Versioning, adding new functionality in a backward-compatible way bumps the minor number and resets the patch to 0. Write "next_minor(major: u32, minor: u32, patch: u32) -> String" that returns the version after adding a feature, formatted "major.minor.patch". In main, print next_minor(2, 5, 7), which should be "2.6.0".`,
    hints: [
      'Increase minor by one and set patch to 0; major stays the same.',
      'Use format!("{}.{}.{}", major, minor + 1, 0).',
    ],
    solution: `fn next_minor(major: u32, minor: u32, _patch: u32) -> String {
    format!("{}.{}.{}", major, minor + 1, 0)
}

fn main() {
    println!("{}", next_minor(2, 5, 7));
}`,
    starter: `fn next_minor(major: u32, minor: u32, patch: u32) -> String {
    todo!()
}

fn main() {
    println!("{}", next_minor(2, 5, 7));
}`,
    tags: ['semver', 'publishing'],
  },
  {
    id: 'rs-ch14-c-023',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Major Bump for a Breaking Change',
    prompt: `Under Semantic Versioning, a backward-incompatible (breaking) change bumps the major number and resets both minor and patch to 0. Write "next_major(major: u32, minor: u32, patch: u32) -> String" returning the version after a breaking change, formatted "major.minor.patch". In main, print next_major(1, 9, 4), which should be "2.0.0".`,
    hints: [
      'Increase major by one; set minor and patch to 0.',
      'Use format!("{}.{}.{}", major + 1, 0, 0).',
    ],
    solution: `fn next_major(major: u32, _minor: u32, _patch: u32) -> String {
    format!("{}.{}.{}", major + 1, 0, 0)
}

fn main() {
    println!("{}", next_major(1, 9, 4));
}`,
    starter: `fn next_major(major: u32, minor: u32, patch: u32) -> String {
    todo!()
}

fn main() {
    println!("{}", next_major(1, 9, 4));
}`,
    tags: ['semver', 'publishing'],
  },
  {
    id: 'rs-ch14-c-024',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'cargo build vs cargo install',
    prompt: `cargo build compiles a project in your current directory for local development, while cargo install compiles a binary crate and copies its executable into your install directory so you can run it as a command anywhere. Write "command_for(goal: &str) -> String" that returns "cargo build" when goal is "develop locally" and "cargo install" when goal is "use as a tool". In main, print the command for both goals.`,
    hints: [
      'Match the &str goal to the right command string.',
      'Return String values, for example String::from("cargo build").',
    ],
    solution: `fn command_for(goal: &str) -> String {
    match goal {
        "develop locally" => String::from("cargo build"),
        "use as a tool" => String::from("cargo install"),
        _ => String::from("unknown"),
    }
}

fn main() {
    println!("{}", command_for("develop locally"));
    println!("{}", command_for("use as a tool"));
}`,
    starter: `fn command_for(goal: &str) -> String {
    todo!()
}

fn main() {
    println!("{}", command_for("develop locally"));
    println!("{}", command_for("use as a tool"));
}`,
    tags: ['cargo', 'cargo-install', 'cargo-build'],
  },
  {
    id: 'rs-ch14-c-025',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Custom Profile opt-level Lookup',
    prompt: `You can override profile settings in Cargo.toml. Suppose a project sets the dev opt-level to 1 and the release opt-level to 2. Write "configured_opt_level(profile: &str) -> u8" returning 1 for "dev" and 2 for "release". Then write a separate function "build_is_optimized(level: u8) -> bool" returning true when level is greater than 0. In main, print the opt-level for both profiles and whether each is optimized.`,
    hints: [
      'Use a match in configured_opt_level.',
      'build_is_optimized just checks level > 0.',
    ],
    solution: `fn configured_opt_level(profile: &str) -> u8 {
    match profile {
        "dev" => 1,
        "release" => 2,
        _ => 0,
    }
}

fn build_is_optimized(level: u8) -> bool {
    level > 0
}

fn main() {
    let dev = configured_opt_level("dev");
    let rel = configured_opt_level("release");
    println!("{} {}", dev, build_is_optimized(dev));
    println!("{} {}", rel, build_is_optimized(rel));
}`,
    starter: `fn configured_opt_level(profile: &str) -> u8 {
    todo!()
}

fn build_is_optimized(level: u8) -> bool {
    todo!()
}

fn main() {
    let dev = configured_opt_level("dev");
    let rel = configured_opt_level("release");
    println!("{} {}", dev, build_is_optimized(dev));
    println!("{} {}", rel, build_is_optimized(rel));
}`,
    tags: ['cargo', 'release-profile', 'opt-level'],
  },
  {
    id: 'rs-ch14-c-026',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Doc Test Using a Struct Method',
    prompt: `Write a pub struct "Counter" with a pub field value of type u32 and an impl block containing a pub method "bumped(&self) -> u32" that returns value plus one. Give bumped a doc comment with an # Examples block that builds a Counter with value 4 and asserts bumped() returns 5. In main, build a Counter with value 4 and print c.bumped().`,
    hints: [
      'The example creates the struct: let c = Counter { value: 4 };',
      'Then assert_eq!(c.bumped(), 5);',
    ],
    solution: `/// A simple counter holding a value.
pub struct Counter {
    pub value: u32,
}

impl Counter {
    /// Returns the value plus one.
    ///
    /// # Examples
    ///
    /// \`\`\`
    /// let c = Counter { value: 4 };
    /// assert_eq!(c.bumped(), 5);
    /// \`\`\`
    pub fn bumped(&self) -> u32 {
        self.value + 1
    }
}

fn main() {
    let c = Counter { value: 4 };
    println!("{}", c.bumped());
}`,
    starter: `pub struct Counter {
    pub value: u32,
}

impl Counter {
    /// TODO: doc comment with an # Examples block asserting bumped() == 5
    pub fn bumped(&self) -> u32 {
        todo!()
    }
}

fn main() {
    let c = Counter { value: 4 };
    println!("{}", c.bumped());
}`,
    tags: ['documentation', 'doc-tests', 'methods'],
  },
  {
    id: 'rs-ch14-c-027',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Re-export Renaming With as',
    prompt: `A pub use can rename an item with "as" to present a cleaner name. Define a module "internal" with a pub function "do_work_internal_impl" that returns the i32 42. At the crate root, re-export it as "run" using pub use ... as run. In main, call run() and print its result.`,
    hints: [
      'Syntax: pub use internal::do_work_internal_impl as run;',
      'After re-exporting, run() calls the underlying function.',
    ],
    solution: `pub mod internal {
    pub fn do_work_internal_impl() -> i32 {
        42
    }
}

pub use internal::do_work_internal_impl as run;

fn main() {
    println!("{}", run());
}`,
    starter: `pub mod internal {
    pub fn do_work_internal_impl() -> i32 {
        42
    }
}

// TODO: re-export do_work_internal_impl as run with pub use ... as run

fn main() {
    println!("{}", run());
}`,
    tags: ['pub-use', 're-export', 'public-api'],
  },
  {
    id: 'rs-ch14-c-028',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Two Workspace Libraries, One Binary',
    prompt: `Model a workspace with two library crates and one binary that uses both. Create module "add_one" with pub fn add_one(x: i32) -> i32 returning x + 1, and module "add_two" with pub fn add_two(x: i32) -> i32 returning x + 2. In main, compute add_one::add_one(10) plus add_two::add_two(10) and print the total, which should be 23.`,
    hints: [
      'Each module mimics a separate library member of the workspace.',
      'Call both functions and add their results.',
    ],
    solution: `mod add_one {
    pub fn add_one(x: i32) -> i32 {
        x + 1
    }
}

mod add_two {
    pub fn add_two(x: i32) -> i32 {
        x + 2
    }
}

fn main() {
    let total = add_one::add_one(10) + add_two::add_two(10);
    println!("{}", total);
}`,
    starter: `mod add_one {
    pub fn add_one(x: i32) -> i32 {
        todo!()
    }
}

mod add_two {
    pub fn add_two(x: i32) -> i32 {
        todo!()
    }
}

fn main() {
    let total = add_one::add_one(10) + add_two::add_two(10);
    println!("{}", total);
}`,
    tags: ['cargo', 'workspace', 'modules'],
  },
  {
    id: 'rs-ch14-c-029',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Validate a Semver String',
    prompt: `Write "is_valid_semver(v: &str) -> bool" that returns true when v has exactly three dot-separated parts and every part is made only of digits. Examples: "1.0.0" is valid, "1.0" is not, and "1.0.x" is not. In main, print the result for "1.0.0", "1.0", and "1.0.x".`,
    hints: [
      'Split on the dot with v.split(.) collected into a Vec to check there are three parts.',
      'Use chars().all(|c| c.is_ascii_digit()) on each part, and ensure parts are non-empty.',
    ],
    solution: `fn is_valid_semver(v: &str) -> bool {
    let parts: Vec<&str> = v.split('.').collect();
    if parts.len() != 3 {
        return false;
    }
    for p in parts {
        if p.is_empty() || !p.chars().all(|c| c.is_ascii_digit()) {
            return false;
        }
    }
    true
}

fn main() {
    println!("{}", is_valid_semver("1.0.0"));
    println!("{}", is_valid_semver("1.0"));
    println!("{}", is_valid_semver("1.0.x"));
}`,
    starter: `fn is_valid_semver(v: &str) -> bool {
    todo!()
}

fn main() {
    println!("{}", is_valid_semver("1.0.0"));
    println!("{}", is_valid_semver("1.0"));
    println!("{}", is_valid_semver("1.0.x"));
}`,
    tags: ['semver', 'strings', 'validation'],
  },
  {
    id: 'rs-ch14-c-030',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Parse a Version and Bump Patch',
    prompt: `Write "bump_patch(v: &str) -> String" that takes a version string like "3.2.9", parses its three numeric parts, increments the patch by one, and returns the new version string. You may assume the input always has exactly three numeric parts. In main, print bump_patch("3.2.9"), which should be "3.3.0"? No: only patch changes, so it should be "3.2.10".`,
    hints: [
      'Split on the dot and parse each piece with parse::<u32>().unwrap().',
      'Only the third part (patch) increases; reassemble with format!.',
    ],
    solution: `fn bump_patch(v: &str) -> String {
    let parts: Vec<&str> = v.split('.').collect();
    let major: u32 = parts[0].parse().unwrap();
    let minor: u32 = parts[1].parse().unwrap();
    let patch: u32 = parts[2].parse().unwrap();
    format!("{}.{}.{}", major, minor, patch + 1)
}

fn main() {
    println!("{}", bump_patch("3.2.9"));
}`,
    starter: `fn bump_patch(v: &str) -> String {
    todo!()
}

fn main() {
    println!("{}", bump_patch("3.2.9"));
}`,
    tags: ['semver', 'strings', 'parsing'],
  },
  {
    id: 'rs-ch14-c-031',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Choose the Right Version Bump',
    prompt: `Map a kind of change to the SemVer bump it requires. Write "bump_kind(change: &str) -> String" that returns "major" for "breaking", "minor" for "feature", and "patch" for "fix". In main, print the bump for "breaking", "feature", and "fix", each on its own line.`,
    hints: [
      'A breaking change is a major bump, a new feature is minor, a bug fix is patch.',
      'Use a match returning String values.',
    ],
    solution: `fn bump_kind(change: &str) -> String {
    match change {
        "breaking" => String::from("major"),
        "feature" => String::from("minor"),
        "fix" => String::from("patch"),
        _ => String::from("unknown"),
    }
}

fn main() {
    println!("{}", bump_kind("breaking"));
    println!("{}", bump_kind("feature"));
    println!("{}", bump_kind("fix"));
}`,
    starter: `fn bump_kind(change: &str) -> String {
    todo!()
}

fn main() {
    println!("{}", bump_kind("breaking"));
    println!("{}", bump_kind("feature"));
    println!("{}", bump_kind("fix"));
}`,
    tags: ['semver', 'publishing'],
  },
  {
    id: 'rs-ch14-c-032',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Crate Docs Plus a Documented API',
    prompt: `Combine crate-level and item-level docs. At the top of the file add an inner doc comment //! that reads "Math helpers." Then write a pub function "triple" with a /// doc comment "Multiplies the input by three." returning its i32 argument times three. In main, print triple(4), which should be 12.`,
    hints: [
      'The //! line must be the first thing in the file.',
      'The /// line goes directly above the function.',
    ],
    solution: `//! Math helpers.

/// Multiplies the input by three.
pub fn triple(x: i32) -> i32 {
    x * 3
}

fn main() {
    println!("{}", triple(4));
}`,
    starter: `// TODO: add the //! crate doc, then the /// function doc, then implement triple

pub fn triple(x: i32) -> i32 {
    todo!()
}

fn main() {
    println!("{}", triple(4));
}`,
    tags: ['documentation', 'crate-docs', 'doc-comments'],
  },
  {
    id: 'rs-ch14-c-033',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Documented Public API With Re-export',
    prompt: `Build a small documented library surface. Add a //! crate doc "Greetings library.". Define a module "english" with a pub function "hello" carrying a /// doc comment "Returns a friendly greeting." and returning the String "hello". Re-export hello at the crate root with pub use. In main, call the re-exported hello() and print it.`,
    hints: [
      'Order: //! at the top, then the module with the documented function, then pub use.',
      'Re-export with pub use english::hello;',
    ],
    solution: `//! Greetings library.

pub mod english {
    /// Returns a friendly greeting.
    pub fn hello() -> String {
        String::from("hello")
    }
}

pub use english::hello;

fn main() {
    println!("{}", hello());
}`,
    starter: `// TODO: add //! crate doc

pub mod english {
    /// TODO: doc comment for hello
    pub fn hello() -> String {
        todo!()
    }
}

// TODO: re-export hello with pub use

fn main() {
    println!("{}", hello());
}`,
    tags: ['documentation', 'pub-use', 'public-api'],
  },
  {
    id: 'rs-ch14-c-034',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Compare Two SemVer Versions',
    prompt: `Write "is_newer(a: &str, b: &str) -> bool" that returns true when version a is strictly newer than version b. Compare the major numbers first, then minor, then patch (each parsed as u32). Assume both inputs are valid three-part versions. In main, print is_newer("1.2.0", "1.1.9") and is_newer("1.0.0", "1.0.0").`,
    hints: [
      'Parse each version into its three u32 parts.',
      'Build a tuple (major, minor, patch) for each and compare with > since tuples compare lexicographically.',
    ],
    solution: `fn parse(v: &str) -> (u32, u32, u32) {
    let parts: Vec<&str> = v.split('.').collect();
    (
        parts[0].parse().unwrap(),
        parts[1].parse().unwrap(),
        parts[2].parse().unwrap(),
    )
}

fn is_newer(a: &str, b: &str) -> bool {
    parse(a) > parse(b)
}

fn main() {
    println!("{}", is_newer("1.2.0", "1.1.9"));
    println!("{}", is_newer("1.0.0", "1.0.0"));
}`,
    starter: `fn parse(v: &str) -> (u32, u32, u32) {
    todo!()
}

fn is_newer(a: &str, b: &str) -> bool {
    todo!()
}

fn main() {
    println!("{}", is_newer("1.2.0", "1.1.9"));
    println!("{}", is_newer("1.0.0", "1.0.0"));
}`,
    tags: ['semver', 'parsing', 'comparison'],
  },
  {
    id: 'rs-ch14-c-035',
    chapter: 14,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Workspace API With Docs and Re-export',
    prompt: `Tie the chapter together. Add a //! crate doc "Arithmetic toolkit.". Create a module "ops" with two documented pub functions: "add_one(x: i32) -> i32" (doc "Adds one.") returning x + 1, and "add_two(x: i32) -> i32" (doc "Adds two.") returning x + 2. Re-export both at the crate root with pub use. In main, compute add_one(5) plus add_two(5) using the short paths and print the total, which should be 18.`,
    hints: [
      'Document each function with its own /// comment.',
      'Re-export both: pub use ops::add_one; and pub use ops::add_two;',
      'Sum the two short-path calls in main.',
    ],
    solution: `//! Arithmetic toolkit.

pub mod ops {
    /// Adds one.
    pub fn add_one(x: i32) -> i32 {
        x + 1
    }

    /// Adds two.
    pub fn add_two(x: i32) -> i32 {
        x + 2
    }
}

pub use ops::add_one;
pub use ops::add_two;

fn main() {
    let total = add_one(5) + add_two(5);
    println!("{}", total);
}`,
    starter: `// TODO: add //! crate doc

pub mod ops {
    /// TODO: doc comment
    pub fn add_one(x: i32) -> i32 {
        todo!()
    }

    /// TODO: doc comment
    pub fn add_two(x: i32) -> i32 {
        todo!()
    }
}

// TODO: re-export add_one and add_two with pub use

fn main() {
    let total = add_one(5) + add_two(5);
    println!("{}", total);
}`,
    tags: ['documentation', 'pub-use', 'workspace'],
  },
]

export default problems
