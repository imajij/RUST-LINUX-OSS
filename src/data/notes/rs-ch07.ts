import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-rs-07',
  track: 'rust',
  chapter: 7,
  title: 'Packages, Crates, and Modules',
  summary: `Once a program grows past a single file you need a way to organize code, control what is public, and refer to items by name without collisions. Rust's module system answers all three with a small, consistent set of concepts: packages and crates define the unit of build and distribution, modules form a tree that groups related code and enforces privacy, and paths let you name any item from anywhere. This chapter teaches you to read and shape that structure, which is exactly the skill you need to navigate a large open source codebase and to lay out your own crates so others can find their way around. Master it and the layout of the standard library, Tokio, or the Rust-for-Linux abstractions stops looking like magic and starts looking like a map.`,
  sections: [
    {
      heading: 'The Module System at a Glance: Five Features, One Job',
      body: `Rust groups everything about code organization into what the book calls the **module system**. It has five interlocking pieces, and it helps to name them up front so the rest of the chapter has hooks to hang on:

1. **Packages** are a Cargo feature: a bundle that lets you build, test, and share one or more crates. A package is what you create with cargo new and what carries a Cargo.toml.
2. **Crates** are a tree of modules that the compiler treats as a single compilation unit, producing either a library or an executable. The crate is the atom of compilation in Rust, the way a translation unit is in C.
3. **Modules** and the **use** keyword let you control the organization, scope, and privacy of paths inside a crate. Modules are the folders of the namespace; they do not have to correspond to files on disk.
4. **Paths** are the way you name an item, such as a struct, function, or module, so you can refer to it. Paths are to the module tree what filesystem paths are to directories.

The single job all of this serves is **scope**: at any point in the code, the compiler must answer "which names are in scope here, and am I allowed to use them?" Modules define the boundaries, paths cross those boundaries, and the privacy rules decide whether crossing is permitted.

The key mental shift for a systems programmer coming from C is that there is no preprocessor and no textual include. You never paste one file into another. Instead you declare modules and the compiler stitches them into one tree, then privacy is checked against that tree, not against file boundaries.`,
    },
    {
      heading: 'Packages vs Crates: The Unit of Build vs the Unit of Compilation',
      body: `A **crate** is the smallest amount of code the Rust compiler considers at one time. Even a single source file you hand to rustc directly is a crate. Crates come in two flavors, covered in the next section, but every crate has a **crate root**: the source file the compiler starts from, which becomes the module named *crate* at the top of the module tree.

A **package** is one or more crates that together provide some functionality, described by a Cargo.toml file that explains how to build them. When you run cargo new my_project, Cargo creates a package: a Cargo.toml plus a src directory. Cargo follows conventions to find crate roots without you listing them:

- src/main.rs is the crate root of a **binary crate** with the same name as the package.
- src/lib.rs is the crate root of a **library crate** with the same name as the package.

A package can contain at most one library crate, and any number of binary crates. To add more binaries, place files in src/bin; each file there is a separate binary crate. This is why a real package like ripgrep can ship a library plus several command line tools from one Cargo.toml.

The practical rule to internalize: **the package is what you publish and version; the crate is what the compiler links.** When a crates.io listing says "this crate", it almost always means the library crate of a package. When someone says cargo build "built the crate", they mean compilation produced one artifact from one crate root.

> Pitfall: people use "crate" loosely to mean both the package and its library. When you read an open source repo, look at Cargo.toml and the presence of src/lib.rs versus src/main.rs to know exactly what is there. A workspace, introduced in chapter 14, takes this further by grouping many packages under one top level Cargo.toml.`,
      code: [
        {
          lang: 'rust',
          src: `// Cargo.toml (the package manifest)
// [package]
// name = "my_project"
// version = "0.1.0"
// edition = "2021"

// src/lib.rs  -> crate root of the library crate "my_project"
// src/main.rs -> crate root of the binary crate "my_project"
// src/bin/tool.rs -> crate root of an extra binary crate "tool"

// A binary's main.rs typically calls into the library:
use my_project::greet;

fn main() {
    println!("{}", greet("world"));
}`,
        },
      ],
    },
    {
      heading: 'Binary vs Library Crates: Who Has a main, Who Gets Reused',
      body: `The two crate kinds exist because code is either *run* or *reused*, and Rust makes that distinction structural.

A **binary crate** compiles to an executable you can run, like a command line tool or a server. It must have a function named main that defines what happens when the executable runs. Its crate root is src/main.rs by convention.

A **library crate** does not have a main and does not compile to a runnable program. Instead it defines functionality intended to be shared across multiple projects. When a Rustacean says "a crate", they usually mean a library crate, and they use "crate" interchangeably with the general programming concept of a library. Its crate root is src/lib.rs.

The idiomatic structure for a tool you also want others to build on is **both**: put the real logic in src/lib.rs as a library, and make src/main.rs a thin binary that parses arguments and calls the library. This pays off in three ways:

- The library can be unit tested directly, and integration tested from the tests directory, without spawning a process.
- Other crates can depend on your library without inheriting your command line interface.
- The main function stays small, which the book later argues is itself a correctness and testability win (see the I/O project in chapter 12).

> Open source note: this binary-plus-library split is one of the most common shapes in the Rust ecosystem. When you open an unfamiliar repo, opening src/lib.rs first usually shows you the public surface, while src/main.rs shows you only the entry point glue.`,
      code: [
        {
          lang: 'rust',
          src: `// src/lib.rs — the library crate: reusable, testable, no main.
pub fn greet(name: &str) -> String {
    format!("Hello, {name}!")
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn greets() {
        assert_eq!(greet("Rust"), "Hello, Rust!");
    }
}

// src/main.rs — the binary crate: thin glue that runs the library.
// fn main() {
//     println!("{}", my_project::greet("world"));
// }`,
        },
      ],
    },
    {
      heading: 'The Module Tree: Grouping, Nesting, and the Implicit Root',
      body: `Inside a crate, **modules** let you organize code for readability and reuse, and they control **privacy**: whether code outside a module may use the items inside it. You declare a module with the mod keyword and a name, then put items (functions, structs, enums, other modules, and more) in its body.

Modules nest, forming a tree, and that tree has an implicit root named **crate** that corresponds to the contents of the crate root file (src/lib.rs or src/main.rs). Everything in the crate root lives directly under crate; a mod you write there becomes a child of crate, and a mod inside that becomes a grandchild, and so on. This is the same parent and child relationship a filesystem has, which is why the book draws it as a tree.

Two facts that trip people up early:

- **Declaring a module is not including a file.** Writing mod front_of_house; (with a semicolon, not a body) tells the compiler to load the module's contents from another file, but a mod with a body defines the module inline. Either way the module exists in the tree regardless of where the code physically lives.
- **The crate root is itself a module.** You do not write mod crate; it is always there. Items you place at the top of src/lib.rs are direct children of crate.

The compiler reads the crate root first, learns the names of modules declared there, then recursively pulls in their contents. The result is a single in-memory tree the rest of the rules operate on. The example below shows a restaurant modeled as nested modules, the same example the book uses, which you can paste into src/lib.rs.`,
      code: [
        {
          lang: 'rust',
          src: `// src/lib.rs
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}
        fn seat_at_table() {}
    }

    mod serving {
        fn take_order() {}
        fn serve_order() {}
        fn take_payment() {}
    }
}

// The resulting module tree:
// crate
//  +-- front_of_house
//       +-- hosting
//       |    +-- add_to_waitlist
//       |    +-- seat_at_table
//       +-- serving
//            +-- take_order
//            +-- serve_order
//            +-- take_payment`,
        },
      ],
    },
    {
      heading: 'Paths: Absolute, Relative, and the super Shortcut',
      body: `To call a function or name any item, you give the compiler a **path**, just as you give a filesystem a path to find a file. A path is one or more identifiers separated by double colons, and it comes in two forms:

- An **absolute path** starts from the crate root, written with the literal keyword crate followed by the names down the tree, for example crate, then front_of_house, then hosting, then add_to_waitlist. For an item in an external crate, the absolute path begins with that crate's name instead.
- A **relative path** starts from the current module and uses the names of items reachable from here. It may begin with self, with super, or with an identifier in the current module.

Choosing between them is a real engineering decision. Prefer **absolute paths** when you expect to move the *calling* code independently of the *called* code, because an absolute path keeps working as long as the definition stays put. Prefer **relative paths** when you expect to move a whole subtree together, because the relative links inside it survive the move. The book's own recommendation is to default to absolute paths, since code definitions and the code that calls them tend to be moved independently more often than together.

The **super** keyword builds a relative path that starts in the *parent* module, the way the two-dot entry starts in the parent directory on a filesystem. It is the right tool when a child needs to reach a sibling of its parent, and it keeps working if you later rename or relocate the parent as a unit, because the relationship "my parent's neighbor" is preserved. **self** refers to the current module and is mostly used to disambiguate or in re-exports.

> Pitfall: a correct path is necessary but not sufficient. The path tells the compiler where the item is; privacy, covered next, tells it whether you are allowed to touch it. A path can be perfectly spelled and still rejected because the item is private.`,
      code: [
        {
          lang: 'rust',
          src: `mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

pub fn eat_at_restaurant() {
    // Absolute: starts from the crate root.
    crate::front_of_house::hosting::add_to_waitlist();

    // Relative: starts from this module (front_of_house is a sibling here).
    front_of_house::hosting::add_to_waitlist();
}

fn deliver_order() {}

mod back_of_house {
    fn fix_incorrect_order() {
        cook_order();
        // super:: goes up to the parent (crate root) to reach a sibling.
        super::deliver_order();
    }
    fn cook_order() {}
}`,
        },
      ],
    },
    {
      heading: 'Privacy and pub: Private by Default, Opened Deliberately',
      body: `Rust's privacy rule is the heart of the module system, and it is the opposite of C's default. **Everything is private by default.** Items in a module, including functions, structs, enums, constants, and even nested modules, are visible only to the module that contains them and to that module's descendants. A parent module cannot see the private items inside its child, but a child module can see everything in its ancestor modules, including their private items. The logic: a child knows the context it was defined in, so hiding the parent's details from it would be pointless, but a parent should not depend on its child's internals or the child loses the freedom to change them.

You open an item up with the **pub** keyword. Crucially, marking a module pub does **not** make its contents public; it only lets outside code *refer to* the module, that is, enter it. You must then also mark each item inside that you want reachable. Privacy is checked at every step of the path, so the whole chain from the root to the item must be reachable.

Structs and enums have a special twist worth memorizing:

- A **pub struct** is public, but its **fields remain private** individually. You make fields public one at a time with pub on each field. This lets a library expose a type while keeping invariants enforced behind constructor functions. If any field is private, callers cannot build the struct with a struct literal and need a public associated function (like new) to create one.
- A **pub enum** makes **all of its variants public** automatically. Variants are useless without their data, so making them all public is almost always what you want.

> Open source and kernel relevance: this is how a crate defines its stable public API. The pub items are the contract; everything else is implementation detail the maintainers may change without a semver break. When reviewing or contributing, treat adding pub as a deliberate, reviewable act, because you are widening the surface you must keep stable.`,
      code: [
        {
          lang: 'rust',
          src: `mod back_of_house {
    // Public struct, but fields are private unless marked pub.
    pub struct Breakfast {
        pub toast: String,      // callers may read and set this
        seasonal_fruit: String, // private: the kitchen decides this
    }

    impl Breakfast {
        // A constructor is required because of the private field.
        pub fn summer(toast: &str) -> Breakfast {
            Breakfast {
                toast: String::from(toast),
                seasonal_fruit: String::from("peaches"),
            }
        }
    }

    // For enums, making the enum pub makes every variant pub.
    pub enum Appetizer {
        Soup,
        Salad,
    }
}

pub fn order() {
    let mut meal = back_of_house::Breakfast::summer("Rye");
    meal.toast = String::from("Wheat"); // allowed: field is pub
    // meal.seasonal_fruit = ...;        // ERROR: field is private
    let _a = back_of_house::Appetizer::Soup; // variants are pub
}`,
        },
      ],
    },
    {
      heading: 'use: Bringing Paths Into Scope Idiomatically',
      body: `Writing the full path every time is noisy. The **use** keyword creates a shortcut: it brings a path into the current scope so you can refer to the item by a shorter name for the rest of that scope. A use is itself subject to privacy, so you can only bring into scope items you are allowed to access. A use shortcut is also local to the scope it appears in; it does not leak into child modules unless you re-export it.

Rust has a firm idiomatic convention about *how far* to shorten:

- For **functions**, bring the **parent module** into scope, then call the function as module then function. Writing use for crate, front_of_house, hosting and calling hosting then add_to_waitlist makes it clear at the call site that the function is not locally defined, while still saving you the long path. Bringing the function itself into scope and calling it bare is allowed but discouraged, because the reader loses that signal.
- For **structs, enums, and other types**, it is idiomatic to bring the **full path** to the item, so you write the type's name directly, like use std::collections::HashMap and then HashMap::new. The one exception is when two items with the same name would collide.

When names collide, you have two clean options: bring in the parent modules and qualify at the call site, or rename one import with the **as** keyword to give it a local alias. The community leans toward as for short, obvious renames and parent-module qualification when the parent name is itself informative.

> Pitfall: a use that is not actually used produces a warning, and unused imports are real review noise in large codebases. Tools like cargo fix and rust-analyzer will clean these up. Also remember that use does not move or copy code; it only adds a name to the current scope, so it has zero runtime cost.`,
      code: [
        {
          lang: 'rust',
          src: `use std::collections::HashMap;          // types: import the full path
use std::fmt::Result;
use std::io::Result as IoResult;        // rename to avoid a clash

mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}
use crate::front_of_house::hosting;     // functions: import the PARENT

fn work() -> Result {
    let mut map = HashMap::new();
    map.insert(1, 2);
    hosting::add_to_waitlist();          // reads clearly as "not local"
    Ok(())
}

fn read() -> IoResult<()> { Ok(()) }`,
        },
      ],
    },
    {
      heading: 'pub use, Nested Paths, and the Glob Operator',
      body: `Three features make imports and public APIs ergonomic at scale.

**Re-exporting with pub use.** A plain use is private to its scope. Adding pub makes the brought-in name part of *this* module's public interface too, so external code can reach the item through your shorter path. This is called re-exporting. It is how a library presents a clean, flat public API that differs from its internal module organization: you can structure the code one way for your own sanity and expose it another way for your users. The standard library and crates like Tokio do this heavily, which is why std::io::Result is reachable even though the type is defined deeper inside. When you read a crate's lib.rs and see a wall of pub use lines, you are looking at the curated public face of the crate.

**Nested paths** collapse multiple imports that share a prefix into one line, reducing vertical clutter. You write the common prefix once, then the differing tails inside braces. The special self inside the braces brings in the prefix item itself alongside its children.

**The glob operator**, a path ending in colon-colon-star, brings *all* public items of a path into scope at once. It is powerful but blunt: it makes it hard to tell where a name came from and risks surprising collisions, so it is discouraged in normal library code. Its two legitimate homes are test modules, where you commonly write use super then star to pull in everything under test, and the prelude pattern, where a crate deliberately offers a module of names meant to be glob-imported.

> Pitfall: a glob import can silently shadow or clash with future additions to the imported module, turning a dependency upgrade into a compile error far from the import. Prefer explicit imports in code you intend to maintain, and reserve glob for tests and well-known preludes.`,
      code: [
        {
          lang: 'rust',
          src: `// Re-export: expose an internal path as part of THIS crate's API.
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}
pub use crate::front_of_house::hosting;  // external code can now use crate::hosting

// Nested paths: one line instead of many.
use std::{cmp::Ordering, io};            // two imports, shared "std" prefix
use std::io::{self, Write};              // brings in std::io AND std::io::Write

// Glob: pull in everything public (mostly for tests / preludes).
#[cfg(test)]
mod tests {
    use super::*;                        // idiomatic in test modules
}`,
        },
      ],
    },
    {
      heading: 'Splitting Modules Into Separate Files',
      body: `As a crate grows you move module bodies out of the crate root and into their own files, so the file tree mirrors the module tree. The mechanism is simple but precise, and getting the rules wrong is the most common beginner stumble.

The rule: **mod name with a semicolon and no body tells the compiler to load that module's contents from another file.** The declaration still lives in the parent; only the body moves. The compiler looks for the contents in one of two places, and you must pick a single consistent style per module:

- src/name.rs for a module declared at the crate root, or
- src/parent/name.rs for a nested module, alongside an optional src/parent.rs for the parent itself.

The older 2015 style used mod.rs files, such as src/parent/mod.rs, for the parent. Modern Rust supports both, but the file-named style (src/parent.rs plus src/parent/child.rs) is preferred for new code because it avoids a directory full of identically named mod.rs files.

Three points that prevent confusion:

1. **Declaring a module is a one-time act in its parent, not in every file that uses it.** You write mod front_of_house once, in the crate root. Other files reach into it with paths and use, never by re-declaring it. A module is loaded into the tree exactly once.
2. **Moving code to a file changes nothing about the module tree or privacy.** The path to add_to_waitlist through front_of_house and hosting is identical whether everything is inline or spread across files. Files are an organizational convenience layered on top of the logical tree; they are not the tree.
3. The filename and directory names must exactly match the module names, because that is how the compiler finds them. There is no manifest listing the files; the mod declarations are the manifest.

> Open source workflow: this file-per-module convention is why you can navigate a large Rust repo by following mod declarations from lib.rs downward, the same way you would follow include in C, except the chain is explicit, checked, and free of textual surprises.`,
      code: [
        {
          lang: 'rust',
          src: `// src/lib.rs  (crate root)
mod front_of_house;          // load contents from another file

pub use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
}

// src/front_of_house.rs  (the front_of_house module body)
// pub mod hosting;          // load this child from src/front_of_house/hosting.rs

// src/front_of_house/hosting.rs  (the hosting module body)
// pub fn add_to_waitlist() {}

// The module tree and every path are UNCHANGED by this split:
//   crate::front_of_house::hosting::add_to_waitlist`,
        },
      ],
    },
  ],
  takeaways: [
    'A package is a Cargo bundle with a Cargo.toml; a crate is the compiler\'s unit of compilation with a single crate root.',
    'A package holds at most one library crate (src/lib.rs) and any number of binary crates (src/main.rs and files in src/bin).',
    'Put real logic in a library crate and keep the binary a thin wrapper, so the code is testable and reusable.',
    'Modules form a tree rooted at the implicit crate module; the tree is logical and does not have to match the file layout.',
    'Paths name items: absolute paths start with crate (or an external crate name), relative paths start from the current module, self, or super.',
    'Everything is private by default; pub opens an item, but pub on a module only grants entry, not access to its contents.',
    'pub struct keeps fields private unless each is marked pub; pub enum makes all variants public.',
    'Idiomatic use brings the parent module into scope for functions and the full path for types; rename clashes with as.',
    'pub use re-exports to shape a clean public API; reserve glob imports for tests and preludes; mod name with a semicolon loads a module from a file.',
  ],
  cheatsheet: [
    { label: 'cargo new my_project', value: 'creates a package: Cargo.toml + src/' },
    { label: 'src/main.rs', value: 'crate root of the package binary crate' },
    { label: 'src/lib.rs', value: 'crate root of the package library crate' },
    { label: 'src/bin/extra.rs', value: 'an additional binary crate named extra' },
    { label: 'mod name { ... }', value: 'define a module inline in the tree' },
    { label: 'mod name;', value: 'load the module body from name.rs or name/mod.rs' },
    { label: 'crate::a::b::item', value: 'absolute path from the crate root' },
    { label: 'super::sibling', value: 'relative path starting in the parent module' },
    { label: 'self::item', value: 'relative path starting in the current module' },
    { label: 'pub', value: 'make an item visible outside its module' },
    { label: 'pub struct, pub field', value: 'struct public; fields private unless each is pub' },
    { label: 'use a::b::Type', value: 'bring a type into scope by its name' },
    { label: 'use a::b as Alias', value: 'import under a new local name to avoid clashes' },
    { label: 'pub use path', value: 're-export so callers reach it through this module' },
  ],
}

export default note
