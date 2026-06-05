import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-rs-01',
  track: 'rust',
  chapter: 1,
  title: 'Getting Started',
  summary: `This chapter sets up a working Rust toolchain and walks you from a hand-compiled Hello World to a real Cargo project. The point is not the trivial program but the tooling around it: rustup manages compilers, rustc turns one file into a binary, and Cargo orchestrates building, dependency resolution, and project layout for everything larger than a toy. Internalizing this workflow early matters because almost every open-source Rust project you will ever clone expects you to fluently run cargo build, cargo check, and cargo run, and to understand the Cargo.toml manifest at the root.`,
  sections: [
    {
      heading: 'Installing Rust with rustup',
      body: `Rust is installed through **rustup**, the official toolchain installer and version manager. Do not install rustc or cargo directly from your distribution's package manager - distro packages are often stale, and the kernel and most serious projects expect a recent toolchain. On Linux or macOS the standard installation pipes the official script into your shell; on Windows you download rustup-init.exe.

A *toolchain* is a complete, versioned set of tools: the compiler (rustc), the package manager (cargo), the standard library, and a documentation copy. rustup lets you install several toolchains side by side - for example stable, beta, and nightly - and switch between them per project. This is essential for kernel and systems work, where some projects pin an exact toolchain.

The installer adds binaries to a directory under your home folder (the cargo bin directory) and tries to put it on your PATH. After installing, either restart your shell or source the environment file so that the rustc and cargo commands are found. Always verify the install by printing the versions - if those commands are not found, your PATH was not updated yet.

A few rustup commands you will use constantly:

- rustup update pulls the latest release of each installed toolchain. Rust ships a new stable every six weeks, so update regularly.
- rustup default stable picks which toolchain new shells use by default.
- rustup component add adds extras such as rustfmt (the formatter), clippy (the linter), and rust-src (standard-library source, which rust-analyzer and some kernel build steps need).
- rustup self uninstall removes everything cleanly - a real advantage over scattering files via a package manager.

> Pitfall: if you previously installed Rust through apt, brew, or pacman, uninstall that first. Two competing installations on PATH lead to confusing version mismatches where cargo and rustc disagree.`,
      code: [
        {
          lang: 'rust',
          src: `// In your terminal (not Rust code, but the commands you run):
//
//   curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
//   source $HOME/.cargo/env      # or just open a new shell
//
//   rustc --version              # rustc 1.x.y (hash date)
//   cargo --version              # cargo 1.x.y (hash date)
//   rustup --version
//
//   rustup update
//   rustup component add clippy rustfmt rust-src`
        }
      ]
    },
    {
      heading: 'rustc vs cargo: two tools, two jobs',
      body: `Two programs do the actual work, and confusing them is a common beginner stumble.

**rustc** is the Rust compiler. It takes one or more source files and produces a binary (or a library). You invoke it directly as rustc main.rs, which compiles main.rs and writes an executable named main in the current directory. That is the entire job of rustc: source in, artifact out. It knows nothing about your project structure, your dependencies, or which version of a library you want.

**cargo** is the build system and package manager that drives rustc for you. For anything beyond a single throwaway file you use Cargo, not rustc. Cargo decides which files to compile, downloads and version-locks third-party libraries, passes the right flags to rustc, caches results so rebuilds are fast, and standardizes the project layout so any Rust developer can find their way around your code instantly.

The mental model: rustc is like calling the C compiler by hand on one file; cargo is like a make plus a package manager plus a project convention, all in one. You will almost never call rustc directly in real work - but knowing it exists explains what Cargo is orchestrating under the hood, which helps when you read build logs or debug a toolchain problem in a large project.`,
      code: [
        {
          lang: 'rust',
          src: `// Compiling a single file by hand with rustc:
//   rustc main.rs      ->  produces ./main  (run with ./main)
//
// The source it compiles:

fn main() {
    println!("Hello, world!");
}`
        }
      ]
    },
    {
      heading: 'Hello, world! and the main function',
      body: `The smallest complete Rust program defines a function named main. The function main is special: it is the **entry point** of every executable Rust program - the first code that runs when the binary starts. Its name and role are fixed by convention and the runtime; you do not get to choose a different entry function for a normal binary.

Reading the program piece by piece:

- fn declares a function. main is its name. The empty parentheses mean it takes no arguments, and there is no return-type arrow, so it returns the unit type (an empty tuple), meaning effectively nothing.
- The body is wrapped in curly braces. Rust style places the opening brace on the same line as the function signature, separated by one space.
- Inside, one line prints text. Rust indents with four spaces, never tabs - the rustfmt tool enforces this, and matching it keeps your diffs clean in any project that runs formatting checks in CI.
- Statements end with a semicolon.

Note carefully: println with an exclamation mark is calling a **macro**, not a function. The exclamation mark is the syntactic signal that you are invoking a macro rather than an ordinary function. Macros are code that generates code at compile time, and we will see shortly why printing in particular is a macro.

> Pitfall: forgetting the semicolon, or writing println without the bang, both produce compiler errors. Rust's error messages are unusually good - read them; they usually tell you exactly what to fix.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    println!("Hello, world!");
}

// fn        -> declares a function
// main      -> the fixed entry point of the program
// ()        -> takes no parameters
// { ... }   -> the function body
// println!  -> a MACRO (note the !), prints a line to stdout
// ;         -> ends the statement`
        }
      ]
    },
    {
      heading: 'Creating a project with cargo new',
      body: `Once you outgrow a single file, create projects with cargo new. Running cargo new hello_cargo makes a new directory named hello_cargo containing a standardized skeleton, and - if you are not already inside a git repository - initializes a git repo with a sensible .gitignore.

What you get:

- **Cargo.toml** - the manifest at the project root. It declares the package name, its version, the Rust edition, and the list of dependencies. We look at it in detail next.
- **src/** - the source directory. Cargo expects your code here, not in the project root. The default binary lives at src/main.rs.
- **src/main.rs** - a ready-to-run Hello World, generated for you.
- **.gitignore** - pre-populated to ignore the target directory.

A few useful variants and flags:

- cargo new --lib mathstuff creates a library crate (with src/lib.rs) instead of a binary crate. Binaries produce an executable; libraries produce code meant to be used by other crates.
- cargo init runs inside an existing directory, adding the Cargo scaffolding to code you already have rather than creating a new folder.
- cargo new --vcs none skips git initialization.

Why enforce this layout? Convention over configuration. Because every Cargo project looks the same, you can clone any open-source Rust repository and immediately know that the manifest is Cargo.toml and the code is under src/. There is nothing to learn about each new project's build setup - a huge productivity win when you contribute across many codebases.`,
      code: [
        {
          lang: 'rust',
          src: `// In the terminal:
//   cargo new hello_cargo
//   cd hello_cargo
//
// Resulting layout:
//   hello_cargo/
//   |-- Cargo.toml        (the manifest)
//   |-- .gitignore
//   \\-- src/
//       \\-- main.rs       (generated Hello World)
//
// The generated src/main.rs:

fn main() {
    println!("Hello, world!");
}`
        }
      ]
    },
    {
      heading: 'The Cargo.toml manifest and crates',
      body: `Cargo.toml is written in **TOML** (Tom's Obvious, Minimal Language), a simple config format organized into sections marked by names in square brackets.

The package section configures your package itself:

- name - the package name.
- version - its version, using semantic versioning (major.minor.patch).
- edition - the Rust *edition* (such as 2021 or 2024). Editions are opt-in language epochs that let Rust introduce new idioms and occasionally change defaults without breaking old code; every crate declares which edition it speaks, and the compiler honors it. Pinning an edition means upgrading the compiler will not silently change how your existing code is interpreted.

The dependencies section is where you list external libraries. In the Rust world these libraries are called **crates**. Precisely, a *crate* is the smallest unit of compilation - the amount of code the compiler considers at one time. A *package* is one or more crates plus a Cargo.toml that describes how to build them. Most crates you depend on come from crates.io, the central public registry; you add one by writing its name and a version requirement, and Cargo downloads it on the next build.

When Cargo first resolves dependencies it writes a **Cargo.lock** file recording the exact versions it chose. The distinction matters:

- For an application (a binary you ship), commit Cargo.lock so every build - yours, a teammate's, CI - uses identical dependency versions and is reproducible.
- For a library, the convention is usually not to commit Cargo.lock, so downstream users get to resolve versions themselves.

> Pitfall: never hand-edit Cargo.lock - it is generated. Edit Cargo.toml to change what you depend on, then let Cargo regenerate the lock file.`,
      code: [
        {
          lang: 'rust',
          src: `// Cargo.toml (this is TOML, not Rust):
//
//   [package]
//   name = "hello_cargo"
//   version = "0.1.0"
//   edition = "2021"
//
//   [dependencies]
//   rand = "0.8"          # pull crate "rand" (>=0.8.0, <0.9.0) from crates.io
//
// After a build, Cargo writes Cargo.lock pinning the EXACT versions
// it resolved (e.g. rand 0.8.5) so builds are reproducible.`
        }
      ]
    },
    {
      heading: 'Building and running: build, run, check',
      body: `Cargo gives you a small set of commands you will type thousands of times.

**cargo build** compiles the project. By default it produces an unoptimized **debug** build under target/debug/, which compiles quickly and keeps debug information - ideal while developing. Pass --release for an optimized **release** build under target/release/, which is much slower to compile but runs far faster; use it for benchmarks and for anything you ship. The first build of a project with dependencies takes a while because Cargo fetches and compiles every dependency; subsequent builds reuse the cache and only recompile what changed.

**cargo run** builds if needed and then immediately executes the resulting binary, all in one step. This is the everyday inner-loop command: edit, cargo run, observe, repeat. If nothing changed since the last build, it skips straight to running.

**cargo check** compiles your code far enough to type-check it and report errors, but skips the slow work of generating the final executable. Because it does not emit a binary, it is dramatically faster than a full build. The workflow most experienced developers adopt is to run cargo check constantly as they edit to confirm the code still compiles, and only run cargo build or cargo run when they actually need to execute it. On a large codebase - the kind you meet in serious open-source work - this difference in feedback speed is enormous.

The target directory holds all build output and caches. It is regenerated from source, so it belongs in .gitignore (which cargo new sets up for you) and should never be committed. A few more commands worth knowing: cargo clean wipes target; cargo test runs the test suite; cargo fmt formats the code; cargo clippy runs the linter for extra correctness and style warnings.

> Pitfall: do not commit the target directory - it is large, machine-specific, and fully reproducible.`,
      code: [
        {
          lang: 'rust',
          src: `// Everyday commands (run from the project root):
//
//   cargo check               # fast: type-check only, no binary  <- use most
//   cargo build               # debug build -> target/debug/hello_cargo
//   cargo build --release     # optimized   -> target/release/hello_cargo
//   cargo run                 # build (if needed) then execute
//   cargo run --release       # build optimized, then run
//
//   cargo test                # run tests
//   cargo fmt                 # auto-format with rustfmt
//   cargo clippy              # lint for common mistakes
//   cargo clean               # delete the target directory`
        }
      ]
    },
    {
      heading: 'println!, formatting, and comments',
      body: `Printing text is how every first program talks back, and Rust does it through macros so the format string can be checked at compile time.

**The print macros:**

- println prints its arguments followed by a newline.
- print is identical but adds no trailing newline.
- eprintln and eprint write to standard error instead of standard output - use these for diagnostics and error messages so they do not get mixed into or piped along with real program output.

**Format strings and placeholders.** A pair of empty curly braces inside the string is a placeholder filled, in order, by the arguments that follow. You can also put a variable's name directly inside the braces - called a captured identifier - which is the modern, readable style for printing a variable that is in scope. Numbered placeholders let you reuse an argument by position. To print a literal curly brace, double it: two opening braces produce one.

The format specifiers after a colon control display: one for debug formatting (which prints a developer-facing representation and works on most standard types), pretty-printed debug across multiple lines, padding and alignment, and precision for floating-point numbers. The exact same syntax powers the format macro, which builds a String instead of printing, so learning it once pays off everywhere.

Why is this a macro and not a function? Because the format string is validated at **compile time**. If you reference a placeholder with no matching argument, or vice versa, the program will not compile - a whole class of formatting bugs that plague other languages simply cannot occur. That compile-time guarantee is the recurring theme of Rust, visible even in something as humble as printing.

**Comments.** Use two slashes for a line comment that runs to the end of the line; there is no required block-comment style for ordinary notes. Rust also has **documentation comments**: three slashes document the item that follows (a function, struct, and so on), and these are special because cargo doc extracts them to generate HTML documentation, and any code examples inside them are compiled and run by cargo test. That last point is a Rust superpower - your documentation examples cannot silently rot, because the test suite verifies them.

> Pitfall: a placeholder count that does not match the argument count is a compile error, not a runtime surprise - read the message and adjust.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    // A line comment: ignored by the compiler.

    let name = "Ada";
    let count = 3;

    println!("Hello, world!");           // newline at the end
    print!("no newline here");           // stays on the same line
    eprintln!("this goes to stderr");    // diagnostics -> standard error

    // Positional placeholder, filled by the argument in order:
    println!("Hi, {}!", name);

    // Captured identifier: name the variable inside the braces:
    println!("Hi, {name}, you have {count} messages");

    // Numbered placeholders can reuse an argument:
    println!("{0}{1}{0}", "ab", "ra");   // prints: abraab

    // A literal brace is written by doubling it:
    println!("{{}} is an empty placeholder");

    // Debug formatting with the ? flag, and pretty debug with #?:
    let nums = vec![1, 2, 3];
    println!("{:?}", nums);              // [1, 2, 3]
    println!("{:#?}", nums);             // each element on its own line

    // Width, alignment, and float precision:
    println!("[{:>8}]", "right");        // right-aligned in 8 columns
    println!("{:.2}", 3.14159);          // 3.14

    // format! builds a String instead of printing it:
    let s = format!("{name} = {count}");
    println!("{s}");
}

/// A documentation comment (three slashes) documents the item below.
/// Cargo turns these into HTML docs, and the example here is compiled
/// and run by cargo test, so it can never silently go out of date.
///
/// # Examples
///
/// let two = add_one(1);
/// assert_eq!(two, 2);
fn add_one(x: i32) -> i32 {
    x + 1
}`
        }
      ]
    }
  ],
  takeaways: [
    'Install and manage Rust with rustup, never the distro package manager; verify with rustc --version and cargo --version.',
    'A toolchain bundles rustc, cargo, std, and docs; rustup lets you keep stable, beta, and nightly side by side.',
    'rustc compiles one file into a binary; cargo is the build system and package manager that drives rustc for whole projects.',
    'main is the fixed entry point of every executable; println! ends in a bang because it is a macro, not a function.',
    'cargo new scaffolds the standard layout: Cargo.toml manifest at the root, code under src/, git and .gitignore set up.',
    'Cargo.toml (TOML) declares name, version, edition, and dependencies (crates from crates.io); Cargo.lock pins exact resolved versions.',
    'Use cargo check for fast type-checking while editing, cargo build to compile, cargo run to build-and-execute, --release to optimize.',
    'Never commit the target directory; commit Cargo.lock for applications but typically not for libraries.',
    'Format strings are checked at compile time; positional, captured-name, debug, pretty-debug, and precision specifiers all share one syntax, and /// doc comments feed cargo doc and cargo test.'
  ],
  cheatsheet: [
    { label: 'curl ... | sh', value: 'Official rustup install on Linux/macOS' },
    { label: 'rustup update', value: 'Update installed toolchains to latest release' },
    { label: 'rustup component add clippy rustfmt', value: 'Add the linter and the formatter' },
    { label: 'rustc main.rs', value: 'Compile one file directly into ./main' },
    { label: 'cargo new NAME', value: 'Create a new binary project with standard layout' },
    { label: 'cargo new --lib NAME', value: 'Create a library crate (src/lib.rs) instead' },
    { label: 'cargo init', value: 'Add Cargo scaffolding to an existing directory' },
    { label: 'cargo check', value: 'Type-check fast, no binary emitted' },
    { label: 'cargo build', value: 'Debug build into target/debug/' },
    { label: 'cargo build --release', value: 'Optimized build into target/release/' },
    { label: 'cargo run', value: 'Build if needed, then execute the binary' },
    { label: 'println! positional', value: 'Print with an empty-brace placeholder plus newline' },
    { label: 'println! captured', value: 'Name an in-scope variable inside the braces' },
    { label: '// vs ///', value: 'Line comment vs doc comment (feeds cargo doc/test)' }
  ]
}

export default note
