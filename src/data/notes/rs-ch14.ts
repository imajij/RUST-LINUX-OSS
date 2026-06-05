import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-rs-14',
  track: 'rust',
  chapter: 14,
  title: 'More about Cargo and Crates.io',
  summary: `Cargo is far more than a build tool that runs your code; it is the gateway to the entire Rust ecosystem. This chapter covers the features that turn a private project into a shareable, documented, well-versioned library: tuning compilation with release profiles, writing documentation that doubles as tested examples, shaping a clean public API, publishing to crates.io under semantic versioning, organizing large multi-crate projects with workspaces, and extending Cargo itself with installed binaries and custom subcommands. These are the exact skills you need to contribute to open-source Rust libraries and to package work for others to depend on.`,
  sections: [
    {
      heading: 'Release profiles and opt-level',
      body: `A **profile** is a named set of compiler configurations that Cargo applies to a build. Cargo ships with two profiles you use constantly without thinking about them. The **dev** profile is used by cargo build, and the **release** profile is used by cargo build --release. Their names reflect their intent: dev favors fast compile times and good debugging, while release favors a fast and small final binary at the cost of longer compile times.

The single most important knob each profile carries is **opt-level**, the optimization level passed to the compiler. It ranges from 0 (no optimization) to 3 (maximum optimization). The dev profile defaults to opt-level 0 because applying optimizations is slow, and during the edit-compile-test loop you want the compiler to finish quickly. The release profile defaults to opt-level 3 because when you ship or benchmark, the extra compile time is worth a much faster program.

### Why the two-profile split exists
Optimization is expensive at compile time and it rearranges and inlines code so aggressively that a debugger can no longer map machine instructions cleanly back to your source lines. By giving you a fast, debuggable dev build and a slow, optimized release build, Cargo lets you have both without manual flag juggling.

### Overriding defaults
You override any default by adding a profile section to Cargo.toml. Cargo applies your settings on top of its built-ins, so you only specify what you want to change. A frequent customization is raising the dev opt-level to 1 when an unoptimized dependency is painfully slow during development, or tuning release settings like lto (link-time optimization) and codegen-units for an even smaller, faster binary.

### Common pitfalls
- **Always benchmark in release.** Numbers from a debug build are meaningless for performance comparisons, because none of the optimizations that make idiomatic Rust fast have been applied. This trips up newcomers constantly.
- opt-level 3 is not always strictly faster than 2 for every program; for production tuning, measure rather than assume.
- Profile settings in a dependency's Cargo.toml are ignored; only the profile in the top-level package (or workspace root) takes effect for the whole build graph.`,
      code: [
        {
          lang: 'rust',
          src: `// Cargo.toml (this is TOML, shown here for reference)
//
// [profile.dev]
// opt-level = 0      # default: fast compiles, easy debugging
//
// [profile.release]
// opt-level = 3      # default: maximum optimization for shipping
//
// A real override: speed up a slow dependency during development
// without paying full optimization on your own crate.
//
// [profile.dev]
// opt-level = 1
//
// Squeeze the release binary further:
//
// [profile.release]
// lto = true            # link-time optimization across crates
// codegen-units = 1     # better optimization, slower compile
// panic = "abort"       # smaller binary, no unwinding machinery`
        }
      ]
    },
    {
      heading: 'Documentation comments and cargo doc',
      body: `Rust has a dedicated comment syntax for documentation that is separate from ordinary code comments. A **documentation comment** starts with three slashes and documents the item that immediately follows it, such as a function, struct, or module. These comments support Markdown, so you can use headings, lists, links, and fenced code blocks to write rich, formatted docs.

Running cargo doc generates HTML from these comments and places it under target/doc. The convenience command cargo doc --open builds the docs and opens them in your browser. Crucially, cargo doc also generates documentation for all of your dependencies, giving you a single local, offline, version-correct reference for your entire dependency tree. This is one of the most underrated productivity features in the whole toolchain.

### Conventional sections
The community has settled on a set of Markdown headings that the ecosystem expects, and using them makes your docs feel native:
- **Examples** shows how to call the item. This is the most valuable section and, as the next topic explains, it is also tested.
- **Panics** describes the conditions under which the function will panic, so callers know what to guard against.
- **Errors** describes the error cases when a function returns a Result, including what each error variant means.
- **Safety** is required for any unsafe function and explains the invariants the caller must uphold to use it soundly. This section is mandatory in kernel and systems work.

### Inner doc comments
There is a second form that starts with two slashes and a bang, used to document the **containing** item rather than the item that follows. You typically put it at the top of a crate root (lib.rs) or a module file to describe the crate or module as a whole. It is the natural place for a crate-level overview, a quick-start example, and a feature summary.

### Why this matters for contributors
On crates.io, the rendered documentation is automatically published to docs.rs for every release. Good doc comments are therefore the public face of a library. When you contribute to an open-source crate, well-written docs with the conventional sections are frequently a requirement for a pull request to be accepted.`,
      code: [
        {
          lang: 'rust',
          src: `//! # My Crate
//!
//! my_crate is a collection of utilities for arithmetic.
//! (Inner doc comment with two slashes and a bang: documents the crate.)

/// Adds one to the number given.
///
/// # Examples
///
/// (A fenced code block here becomes a tested example.)
///
/// let result = my_crate::add_one(5);
/// assert_eq!(6, result);
///
/// # Panics
///
/// This function never panics.
pub fn add_one(x: i32) -> i32 {
    x + 1
}

/// Divides two integers.
///
/// # Errors
///
/// Returns Err if the divisor is zero.
pub fn checked_div(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err(String::from("division by zero"))
    } else {
        Ok(a / b)
    }
}`
        }
      ]
    },
    {
      heading: 'Documentation tests: examples that cannot rot',
      body: `Here is the feature that makes Rust documentation special: the code blocks inside your documentation comments are **compiled and run as tests**. When you execute cargo test, after the unit and integration tests run, Cargo collects every fenced code block in your doc comments, compiles each one, and runs it. They appear in the test output under a section labeled Doc-tests.

### Why this is a brilliant design
Documentation examples are the part of any project most likely to drift out of date. You change a function signature, forget the example in the comment, and now your docs lie to every reader. Doc tests make that impossible to ignore: if you change the API and forget to update the example, the example fails to compile and your test suite goes red. Your examples are therefore **guaranteed** to stay correct against the current code. The docs and the tests are the same artifact.

### How a doc test is assembled
Each code block is wrapped in an implicit main function and the necessary use statements for testing, then compiled as its own tiny crate that depends on yours. This is why doc-test examples refer to your crate by its external name, exactly as a real user would, which also means your examples double as a usability check on your public API. If the example is awkward to write, your API is probably awkward to use.

### Controlling doc tests with annotations
You can annotate the fence after the language tag to change behavior:
- **ignore** tells Cargo to neither compile nor run the block (use sparingly, for pseudo-code).
- **no_run** compiles the block to verify it type-checks but does not execute it, which is ideal for examples that open a network connection, touch the filesystem, or loop forever.
- **should_panic** asserts the example is expected to panic when run.
- **compile_fail** asserts the example must fail to compile, which is useful for documenting that the type system rejects a misuse.

### The hidden-line trick
Sometimes an example needs setup code that is necessary for compilation but noise for the reader. Prefixing a line inside the code block with a hash and a space hides that line from the rendered HTML while still compiling and running it. This lets you show a clean, focused example while keeping it a complete, runnable program underneath.

### Pitfalls
- An example that uses the question-mark operator needs an enclosing function that returns a Result; the usual trick is a hidden wrapper, otherwise the doc test will not compile.
- Forgetting that doc tests actually run means examples with side effects (writing files, sleeping, networking) can slow or hang your test suite; reach for no_run.`,
      code: [
        {
          lang: 'rust',
          src: `/// Parses a string into an integer and doubles it.
///
/// # Examples
///
/// In a real doc comment the following lines live inside a fenced
/// code block, so cargo test compiles and runs them:
///
///     let n = my_crate::double_parsed("21").unwrap();
///     assert_eq!(n, 42);
///
/// A block tagged should_panic asserts it panics when run:
///
///     my_crate::double_parsed("not a number").unwrap(); // panics
///
/// A block tagged no_run only type-checks; it is never executed.
pub fn double_parsed(s: &str) -> Result<i32, std::num::ParseIntError> {
    Ok(s.parse::<i32>()? * 2)
}`
        }
      ]
    },
    {
      heading: 'Crafting a public API with pub use',
      body: `The structure that is convenient for **you** while building a library is often inconvenient for the **people who use** it. As a crate grows you naturally split it into nested modules, so a type might live at a deep path like my_crate::utils::color::PrimaryColor. Users do not care about your internal organization; forcing them to type and remember long paths, and to read your module tree just to find the type they need, is a poor experience.

The solution is to **re-export** items at a more convenient location with pub use. A use brings a path into the current scope; adding pub makes that brought-in name part of your crate's public interface, so external code can reach the item through the new shorter path as well. This technique is often called creating a **re-export**.

### Decoupling internal structure from public API
The power of pub use is that it lets you keep a clean, deeply nested internal organization while presenting a flat, ergonomic public surface. You organize modules however is best for development, then re-export the handful of types and functions you actually want users to reach directly at the crate root. Your internal layout can then change freely without breaking users, because the public paths are stable re-exports rather than raw internal paths.

### It improves your generated docs too
Re-exports show up prominently on the front page of your generated documentation under a Re-exports section. So pub use does not just shorten paths; it makes the important parts of your API discoverable, instead of being buried in a module the reader has to go hunting for.

### The prelude pattern
A widely used convention is to gather the most common types and traits into a module named prelude and re-export them there, so users can write a single glob import to pull in everything they typically need. The standard library and many popular crates do exactly this.

### Pitfalls
- A plain use without pub is private; the item is usable inside your crate but not re-exported. Forgetting pub is the most common reason a re-export does not appear in the public API.
- Re-exporting becomes part of your public API and is therefore covered by semantic versioning. Removing or renaming a re-export is a breaking change, even though you did not touch the original definition.`,
      code: [
        {
          lang: 'rust',
          src: `//! # Art
//! A library for modeling artistic concepts.

// Re-export the important types at the crate root so users can write
// art::PrimaryColor and art::mix instead of the deep internal paths.
pub use self::kinds::PrimaryColor;
pub use self::kinds::SecondaryColor;
pub use self::utils::mix;

pub mod kinds {
    /// The primary colors.
    #[derive(Debug)]
    pub enum PrimaryColor { Red, Yellow, Blue }

    /// The secondary colors.
    #[derive(Debug)]
    pub enum SecondaryColor { Orange, Green, Purple }
}

pub mod utils {
    use crate::kinds::*;

    /// Combines two primary colors into a secondary color.
    pub fn mix(c1: PrimaryColor, c2: PrimaryColor) -> SecondaryColor {
        // ... real logic here ...
        SecondaryColor::Orange
    }
}

// Convenience prelude: users write use art::prelude::* for the essentials.
pub mod prelude {
    pub use crate::kinds::{PrimaryColor, SecondaryColor};
    pub use crate::utils::mix;
}`
        }
      ]
    },
    {
      heading: 'Publishing to crates.io and semantic versioning',
      body: `crates.io is the central public registry for Rust packages. Publishing a crate makes its source code permanently available for anyone to depend on. Before your first publish you log in with cargo login using an API token from your crates.io account, which Cargo stores locally so it can authenticate.

### Required metadata
A crate cannot be published until its Cargo.toml carries enough metadata for the registry to accept it. At minimum you need a **license** field (an SPDX identifier such as MIT OR Apache-2.0, the conventional dual license for Rust crates), plus a unique name, a version, and a description. A good package also sets fields like documentation, repository, readme, and keywords so it is discoverable and trustworthy. Crate names are first-come, first-served and live in a single global namespace, so check availability early.

### Publishing is permanent
This is the rule to internalize before you ever run the command: **a published version can never be overwritten or deleted.** cargo publish uploads the crate and that exact version is permanent, because the entire ecosystem may come to depend on it; allowing deletion would break other people's builds. If a version is broken you cannot replace it; you publish a new, higher version. You can cargo yank a version, which prevents new projects from selecting it while leaving existing Cargo.lock files that already pin it able to keep building. Yanking is for retracting a bad release, not for deleting it, and it can be undone.

### Semantic versioning
Every crate version is a triple of MAJOR.MINOR.PATCH, and Rust follows Semantic Versioning strictly. The numbers carry a contract with your users:
- Increment **PATCH** for backward-compatible bug fixes.
- Increment **MINOR** for backward-compatible new functionality (adding a public function, for example).
- Increment **MAJOR** for any backward-incompatible change that could break code depending on you (removing or renaming a public item, changing a signature).

### Why semver underpins the whole ecosystem
When a dependency is specified as a version like 1.2.3, Cargo by default treats it as compatible-with, meaning it may pick any 1.x.y release at or above that version but below 2.0.0. This is what lets the ecosystem receive bug fixes and new features automatically while trusting that nothing breaks. The entire scheme only works if authors honor the contract, so deciding whether a change is patch, minor, or major is a real responsibility, not bookkeeping. Note the special pre-1.0 rule: while a crate is at 0.x, the minor position acts as the breaking-change position, so 0.2 to 0.3 may break, and that is allowed by the convention.

### Pitfalls
- A single accidental breaking change in a minor release silently breaks downstream builds across the ecosystem; review your public API diff before bumping.
- You cannot un-publish, so do not publish secrets or unfinished APIs you are not ready to support forever.
- Adding a public field to a struct, or a variant to a public enum, can be a breaking change for users who construct or exhaustively match it; consider the non_exhaustive attribute when you want room to grow.`,
      code: [
        {
          lang: 'rust',
          src: `// Cargo.toml (TOML reference) -- metadata required before publishing
//
// [package]
// name = "my_unique_crate_name"
// version = "0.1.0"
// edition = "2021"
// description = "A clear, one-line summary shown on crates.io"
// license = "MIT OR Apache-2.0"
// repository = "https://github.com/you/my_crate"
// readme = "README.md"
// keywords = ["cli", "parser"]
//
// Typical publishing workflow (shell):
//   cargo login <token-from-crates.io>
//   cargo publish              # uploads; THIS VERSION IS PERMANENT
//
// Releasing a fix later: bump the version, then publish again.
//   version = "0.1.1"  -> cargo publish   (PATCH: backward-compatible fix)
//   version = "0.2.0"  -> cargo publish   (MINOR: new feature, compatible)
//   version = "1.0.0"  -> cargo publish   (MAJOR: breaking change)
//
// Retract a broken release without deleting it:
//   cargo yank --version 0.1.1
//   cargo yank --version 0.1.1 --undo     # reverse the yank`
        }
      ]
    },
    {
      heading: 'Cargo workspaces',
      body: `A **workspace** is a set of packages that are developed together and share a single Cargo.lock file and a single output directory. As a project grows into several related crates, a workspace lets you manage them as one unit instead of juggling separate, disconnected projects.

### How a workspace is structured
You create a workspace with a top-level Cargo.toml that has a workspace section listing the member packages by their directory paths. This root Cargo.toml typically does not contain a package section of its own; it exists to tie the members together. Each member remains a normal crate with its own Cargo.toml. Members depend on each other using path dependencies, pointing at a sibling directory.

### What members share
- **One Cargo.lock at the root.** Every member resolves to the same version of every shared dependency. This guarantees the crates are always compatible with each other and prevents the situation where two of your own crates link two different versions of the same library.
- **One target directory at the root.** Build artifacts are shared, so a dependency compiled for one member is reused by the others rather than rebuilt, which saves significant compile time.

### Running commands in a workspace
By default cargo build at the root builds every member. To act on a single member you pass the package selector, for example cargo run -p adder to run a specific binary or cargo test -p add_one to test one member. cargo test at the root runs the tests of every member, which is exactly what you want for a coherent multi-crate project.

### Why workspaces matter for real projects and contributors
Large open-source Rust projects are almost always workspaces: a core library crate, a command-line crate that uses it, perhaps a procedural-macro crate and a test-fixtures crate, all in one repository. Understanding workspaces is essential to navigating and contributing to these codebases. The shared lockfile is also what makes their CI reproducible. Note that external dependencies still must be added to each member's own Cargo.toml that uses them; being in a workspace does not automatically grant a member access to another member's dependencies.

### Pitfalls
- Adding a dependency to the root does not make it available to members; each member declares what it uses (the workspace dependency inheritance feature lets you centralize versions, but members still opt in).
- Publishing workspace members to crates.io requires publishing each independently and replacing path dependencies with version requirements, because crates.io cannot resolve local paths.`,
      code: [
        {
          lang: 'rust',
          src: `// Root Cargo.toml (TOML reference) -- defines the workspace
//
// [workspace]
// resolver = "2"
// members = ["adder", "add_one"]
//
// adder/Cargo.toml depends on the sibling crate by path:
//
// [dependencies]
// add_one = { path = "../add_one" }

// add_one/src/lib.rs
pub fn add_one(x: i32) -> i32 {
    x + 1
}

// adder/src/main.rs -- the binary member uses the library member
use add_one::add_one;

fn main() {
    let n = 10;
    println!("{} plus one is {}", n, add_one(n));
}

// Build everything:        cargo build
// Run just the binary:     cargo run -p adder
// Test only one member:    cargo test -p add_one
// Test the whole tree:     cargo test`
        }
      ]
    },
    {
      heading: 'cargo install and custom subcommands',
      body: `Two final features round out Cargo as an ecosystem hub: installing binaries from crates.io, and extending Cargo with your own subcommands.

### Installing binaries with cargo install
The cargo install command downloads, compiles, and installs a crate that provides a **binary target** so you can run it as a command-line tool. It is only for crates with a binary (an executable), not for library-only crates, which you depend on rather than install. Installed binaries are placed in Cargo's bin directory, which by default is the bin folder under the directory named cargo in your home directory. As long as that directory is on your shell PATH, the installed tool is runnable by name from anywhere.

This is how you get popular Rust-powered command-line tools. A classic example is ripgrep, a fast search tool whose command is rg; cargo install ripgrep builds and installs it from source. cargo install always builds from source, so the first install of a large tool can take a while, but you get a binary tuned to your machine.

### Custom Cargo subcommands
Cargo is deliberately designed to be extensible without modifying Cargo itself. The mechanism is a naming convention: if a binary on your PATH is named with the prefix cargo and a dash, Cargo treats it as a subcommand. So a binary named cargo-something can be invoked as cargo something, exactly as if it were built in. Cargo finds these by scanning your PATH, and cargo --list shows every subcommand available, including the custom ones.

### Why this design is powerful
This convention means the community can build and distribute new Cargo capabilities as ordinary crates, installed with cargo install, with no special plugin API and no changes to Cargo's source. The toolchain you use daily is partly community-extended through this exact mechanism. Widely used examples include cargo-watch (rebuild on file change), cargo-edit (add dependencies from the command line), cargo-audit (scan dependencies for security advisories), and cargo-clippy and cargo-fmt, which ship with the toolchain and follow the same convention.

### Why this matters for open-source contributors
Many Rust projects expect contributors to have certain cargo subcommands installed and to run them in CI, for example cargo clippy for lints and cargo fmt for formatting. Knowing how to install and use these tools, and understanding that they are just binaries following a naming rule, makes you immediately productive in a new codebase.

### Pitfalls
- If a freshly installed tool is not found, the cargo bin directory is almost certainly missing from your PATH; this is the number-one cargo install issue.
- cargo install does not auto-update installed tools; re-run it (optionally with a force flag) to upgrade to a newer published version.
- Building from source means installs can be slow and require the same system dependencies the crate needs to compile.`,
      code: [
        {
          lang: 'rust',
          src: `// Shell usage (reference) -- install a command-line tool from crates.io
//   cargo install ripgrep        # provides the rg command
//   rg "TODO" src/               # now runnable from anywhere on PATH
//
// Ensure the install directory is on PATH (one-time, in your shell rc):
//   export PATH="$HOME/.cargo/bin:$PATH"
//
// See every available subcommand, custom ones included:
//   cargo --list
//
// Common community subcommands, installed the same way:
//   cargo install cargo-watch    # invoke as: cargo watch -x test
//   cargo install cargo-edit     # invoke as: cargo add serde
//   cargo install cargo-audit    # invoke as: cargo audit
//
// Custom subcommand convention: a binary named cargo-greet on PATH
// becomes invokable as cargo greet. Its main() is an ordinary program:
fn main() {
    // When run as cargo greet, Cargo passes "greet" as the first arg.
    let args: Vec<String> = std::env::args().collect();
    println!("hello from a custom cargo subcommand: {:?}", args);
}`
        }
      ]
    }
  ],
  takeaways: [
    'Profiles configure builds: dev (cargo build) optimizes for fast compiles and debugging at opt-level 0; release (--release) optimizes the binary at opt-level 3. Always benchmark in release.',
    'Override any profile default in Cargo.toml under a profile section; your settings layer on top of the built-ins.',
    'Documentation comments use three slashes and support Markdown; cargo doc --open builds HTML for your crate and all dependencies.',
    'Use the conventional doc headings Examples, Panics, Errors, and Safety; the Examples section is especially valuable because it is tested.',
    'Code blocks in doc comments are compiled and run by cargo test, so your examples can never silently drift out of date with your API.',
    'pub use re-exports items to create a clean public API decoupled from your internal module structure, and surfaces them in your generated docs.',
    'crates.io publishing is permanent: a version can never be overwritten or deleted, only yanked to stop new use; publish a higher version to fix things.',
    'Semantic versioning (MAJOR.MINOR.PATCH) is a contract: patch for fixes, minor for compatible additions, major for breaking changes; the whole ecosystem depends on authors honoring it.',
    'Workspaces tie related crates together with one shared Cargo.lock and one target directory; cargo install adds binary tools, and any cargo-prefixed binary on PATH becomes a custom subcommand.'
  ],
  cheatsheet: [
    { label: 'cargo build', value: 'Build with the dev profile (opt-level 0, debuggable)' },
    { label: 'cargo build --release', value: 'Build with the release profile (opt-level 3)' },
    { label: '[profile.release] opt-level = 3', value: 'Set optimization level 0-3 for a profile in Cargo.toml' },
    { label: '/// doc comment', value: 'Documents the item that follows; supports Markdown' },
    { label: '//! inner doc comment', value: 'Documents the containing crate or module' },
    { label: 'cargo doc --open', value: 'Build HTML docs (yours + deps) and open in browser' },
    { label: 'cargo test', value: 'Runs unit, integration, AND doc tests' },
    { label: '# Examples / # Panics / # Errors / # Safety', value: 'Conventional doc-comment section headings' },
    { label: 'pub use path::Item', value: 'Re-export Item into the public API at a shorter path' },
    { label: 'cargo login <token>', value: 'Store crates.io API token for publishing' },
    { label: 'cargo publish', value: 'Upload a crate version (permanent, cannot be deleted)' },
    { label: 'cargo yank --version X', value: 'Retract a release from new use without deleting it' },
    { label: '[workspace] members = [...]', value: 'Define a multi-crate workspace; cargo -p NAME targets one' },
    { label: 'cargo install <crate>', value: 'Build and install a binary crate into the cargo bin dir' }
  ]
}

export default note
