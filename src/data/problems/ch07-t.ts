import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch07-t-001',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Package Versus Crate',
    prompt: `A newcomer asks you: "Aren't a package and a crate the same thing?" In your own words, define what a crate is and what a package is, and state the relationship between them. Mention how many library crates a package may contain versus how many binary crates.`,
    hints: [
      'A crate is the smallest amount of code the compiler considers at one time.',
      'A package is a bundle that is described by a Cargo.toml file.',
    ],
    solution: `A crate is the smallest unit of code the Rust compiler works with at one time; it comes in two forms, a binary crate (which compiles to an executable and has a main function) or a library crate (which has no main and is meant to be shared and used by other projects). A package is a bundle of one or more crates that provides a set of functionality and is described by a Cargo.toml file. A package can contain at most one library crate, but it may contain any number of binary crates. So the relationship is: a package groups crates, and Cargo.toml records how to build them.`,
    tags: ['package', 'crate'],
  },
  {
    id: 'rs-ch07-t-002',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Crate Roots By Convention',
    prompt: `Cargo follows a convention for finding the root file of each crate in a package. Which file is the crate root of the binary crate by default, and which file is the crate root of the library crate by default? What does it mean for a file to be a "crate root"?`,
    hints: [
      'Look at the names src/main.rs and src/lib.rs.',
      'The crate root is where the compiler starts building the module tree.',
    ],
    solution: `By convention, src/main.rs is the crate root of a binary crate whose name matches the package name, and src/lib.rs is the crate root of a library crate whose name also matches the package name. A crate root is the source file that the Rust compiler starts from when it builds the crate; it forms the root module, named crate, of that crate's module tree. Cargo passes this root file to rustc, and from there the compiler follows mod declarations to discover the rest of the modules. So the crate root is the entry point for compilation, not necessarily the file that contains the most code.`,
    tags: ['crate-root', 'convention'],
  },
  {
    id: 'rs-ch07-t-003',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Why Modules Exist',
    prompt: `Modules let you organize code within a crate. List two distinct reasons (beyond just "grouping related code") that modules are useful, and explain what a module controls about the items defined inside it.`,
    hints: [
      'Think about names and naming clashes.',
      'Think about what code outside a module is allowed to see.',
    ],
    solution: `Modules help you organize code for readability and easy reuse by grouping related definitions together, and they let you give names a clear hierarchy so the same simple name can be reused in different modules without clashing. Crucially, a module also controls the privacy of the items inside it: by default everything in a module is private to outside code, and the module decides what becomes part of its public interface through the pub keyword. So modules serve as both a namespacing tool and a privacy boundary. This lets you expose a clean public API while keeping implementation details hidden.`,
    tags: ['modules', 'privacy'],
  },
  {
    id: 'rs-ch07-t-004',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Reading A Module Tree',
    prompt: `Given this layout in a library crate:

mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}
    }
}

Draw or describe the module tree, naming every node from the root down to the function. What is the implicit name of the very top of the tree?`,
    hints: [
      'The root of every module tree has a special implicit name.',
      'Each child module is nested under its parent.',
    ],
    solution: `The tree has four nodes. The top is the implicit root module named crate, which represents the crate root file (src/lib.rs). Under crate sits front_of_house, under front_of_house sits hosting, and inside hosting is the function add_to_waitlist. So the structure is: crate -> front_of_house -> hosting -> add_to_waitlist. The whole module tree is rooted at crate, even though you never write the word crate as a mod declaration; it is provided implicitly.`,
    tags: ['module-tree', 'structure'],
  },
  {
    id: 'rs-ch07-t-005',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Absolute Versus Relative Paths',
    prompt: `A path can be absolute or relative. Explain what distinguishes the two: what does an absolute path start with when it refers to an item in the current crate, and what does a relative path start with? Give one short example of each for an item at crate::front_of_house::hosting::add_to_waitlist called from the crate root.`,
    hints: [
      'Absolute paths begin from a known fixed starting point.',
      'Relative paths begin from the current module.',
    ],
    solution: `An absolute path starts from the crate root, using the literal keyword crate for items in the current crate (or the crate name for an external crate). A relative path starts from the current module and uses self, super, or an identifier in the current module. From the crate root, an absolute path would be crate::front_of_house::hosting::add_to_waitlist, while a relative path would be front_of_house::hosting::add_to_waitlist (starting from the module named front_of_house that is visible in the current scope). Both name the same item; they just differ in where the walk begins.`,
    tags: ['paths', 'absolute', 'relative'],
  },
  {
    id: 'rs-ch07-t-006',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'The Default Privacy Rule',
    prompt: `Fill in the rule: in Rust, items (functions, structs, enums, modules, constants) are _______ by default. Then state precisely the relationship between a parent module and a child module regarding visibility: can a child see its parent's private items, and can a parent see its child's private items?`,
    hints: [
      'Default visibility is the more restrictive of the two options.',
      'Visibility flows in one direction between parent and child.',
    ],
    solution: `Items are private by default. The key asymmetry is this: child modules can see the items defined in their ancestor (parent) modules, but a parent module cannot see the private items inside its child modules. In other words, privacy hides inner detail from the outside while inner code still has access to its surrounding context. This is why making a module public is not enough to use its contents; the items inside must also be marked pub before outside code can reach them.`,
    tags: ['privacy', 'pub', 'rules'],
  },
  {
    id: 'rs-ch07-t-007',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Pub Module But Private Function',
    prompt: `Consider this code in src/lib.rs:

mod front_of_house {
    pub mod hosting {
        fn add_to_waitlist() {}
    }
}

pub fn eat_at_restaurant() {
    crate::front_of_house::hosting::add_to_waitlist();
}

Does this compile? If not, identify exactly which access fails and why, and name the smallest change that fixes it.`,
    hints: [
      'Making a module pub exposes the module, not the items inside it.',
      'Check each segment of the path for the pub keyword.',
    ],
    solution: `It does not compile. The module hosting is marked pub, so the path can reach hosting, but the function add_to_waitlist inside it is still private, so the call to it is rejected with a privacy error. Marking a module public only lets outside code refer to the module; the items within still default to private and must each be made public. The smallest fix is to write pub fn add_to_waitlist() so the function itself becomes part of the public interface. (Note that front_of_house need not be pub because eat_at_restaurant is a sibling in the same crate root and can see it.)`,
    tags: ['pub', 'privacy', 'compile-error'],
  },
  {
    id: 'rs-ch07-t-008',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'When To Reach For Super',
    prompt: `The super keyword lets you build a relative path. In one or two sentences, explain what super refers to and give a realistic situation where using super is more appropriate (and more refactor-friendly) than writing an absolute path from crate.`,
    hints: [
      'super is like the parent directory marker in a filesystem.',
      'Think about moving a whole subtree of modules together.',
    ],
    solution: `super refers to the parent module of the current module, similar to how a leading parent-directory marker works in a filesystem path. It is appropriate when an item needs to call something defined in its parent module, for example a function deliver_order in the parent and a fix_incorrect_order inside a child module that calls super::deliver_order(). Using super is more refactor-friendly when you expect the child module and its parent to be moved together: because the relationship is relative, the path keeps working after the move, whereas an absolute crate path would need to be rewritten. So super expresses "go up one level from here."`,
    tags: ['super', 'paths', 'relative'],
  },
  {
    id: 'rs-ch07-t-009',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Bringing A Path Into Scope',
    prompt: `These two snippets both call add_to_waitlist three times. Snippet A repeats crate::front_of_house::hosting::add_to_waitlist() each time. Snippet B starts with use crate::front_of_house::hosting; and then calls hosting::add_to_waitlist(). What does the use statement do, and what is the practical benefit?`,
    hints: [
      'use creates a shortcut name in the current scope.',
      'Compare how much you have to type and read.',
    ],
    solution: `The use statement creates a shortcut by bringing a path into the current scope, so the name introduced by use (here hosting) can be used as if it were defined locally. It is similar to creating a symbolic link: after use crate::front_of_house::hosting; you can write hosting::add_to_waitlist() instead of the full path every time. The practical benefit is less repetition and more readable call sites, especially when the same item is used many times. The shortcut applies only within the scope where the use appears.`,
    tags: ['use', 'scope', 'shortcut'],
  },
  {
    id: 'rs-ch07-t-010',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Idiomatic Use For Functions',
    prompt: `The book recommends a specific idiom: when bringing a function into scope with use, stop at the function's parent module rather than bringing the function name itself directly into scope. So you write use crate::front_of_house::hosting; and call hosting::add_to_waitlist(). Explain the reasoning behind this idiom.`,
    hints: [
      'Think about what the reader of a call site can tell at a glance.',
      'Consider where the function is actually defined.',
    ],
    solution: `Bringing the parent module into scope and calling hosting::add_to_waitlist() makes it clear at the call site that the function is not defined locally; the module prefix signals where it comes from. If instead you wrote use crate::front_of_house::hosting::add_to_waitlist; and then called the bare add_to_waitlist(), a reader could mistake it for a locally defined function. So the idiom keeps the source of the function visible while still minimizing repetition. It is a readability convention rather than a hard compiler rule.`,
    tags: ['use', 'idiomatic', 'style'],
  },
  {
    id: 'rs-ch07-t-011',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Idiomatic Use For Types',
    prompt: `The idiom for functions (stop at the parent module) does not apply to bringing in structs, enums, and other items. For those, it is idiomatic to specify the full path including the item name, for example use std::collections::HashMap; and then write HashMap. Why does the convention differ for types versus functions?`,
    hints: [
      'It is mostly about established convention and how each is typically used.',
      'There is also a special case when names collide.',
    ],
    solution: `For structs, enums, and other items the idiom is to bring the item itself into scope with its full path, so you write HashMap::new() rather than collections::HashMap::new(). This is simply the established convention; there is no strong technical reason, but it reads naturally because types are usually referred to by their bare name. The one exception is when two items with the same name are brought into scope from different modules: then you must stop at the parent modules (or rename with as) to disambiguate, because Rust does not allow two items of the same name in one scope. So functions use the parent-module idiom, while types use the full-path idiom unless there is a name clash.`,
    tags: ['use', 'idiomatic', 'types'],
  },
  {
    id: 'rs-ch07-t-012',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Resolving A Name Clash',
    prompt: `Suppose you need both std::fmt::Result and std::io::Result in the same file, but they share the simple name Result. Describe two different valid ways to bring both into scope so the compiler does not complain about a duplicate name.`,
    hints: [
      'You can stop at the parent module for one or both.',
      'There is also a keyword that renames an import.',
    ],
    solution: `One way is to bring in the parent modules and qualify each use site: use std::fmt; and use std::io; then refer to fmt::Result and io::Result. The other way is to use the as keyword to give one of them a new local alias: use std::fmt::Result; and use std::io::Result as IoResult; after which you write Result for the first and IoResult for the second. Both approaches avoid two distinct items sharing one bare name in the same scope, which Rust forbids. Choose whichever reads more clearly for your code.`,
    tags: ['use', 'as', 'name-clash'],
  },
  {
    id: 'rs-ch07-t-013',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Predict The Compile Error',
    prompt: `A library crate has:

mod garden {
    mod vegetables {
        pub struct Asparagus {}
    }
}

pub fn grow() {
    let _plant = crate::garden::vegetables::Asparagus {};
}

Without running it, predict whether this compiles. If it errors, say which path segment triggers the privacy error and why making Asparagus pub alone is not enough.`,
    hints: [
      'Walk the path left to right and check each module for pub.',
      'A pub item inside a private module is still unreachable from outside.',
    ],
    solution: `It does not compile. Even though the struct Asparagus is pub, the module vegetables is private (no pub on mod vegetables), so the path crate::garden::vegetables fails at the vegetables segment with a privacy error. Making Asparagus pub is not enough because every module along the path must also be reachable; a pub item buried inside a private module cannot be named from outside that module's parent. To fix it you would write pub mod vegetables (and the struct is already pub). Privacy is checked at each segment of the path, not just at the final item.`,
    tags: ['privacy', 'paths', 'compile-error'],
  },
  {
    id: 'rs-ch07-t-014',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Pub Struct With A Private Field',
    prompt: `In the back_of_house module a struct is defined:

pub struct Breakfast {
    pub toast: String,
    seasonal_fruit: String,
}

It also has an associated function Breakfast::summer that returns a Breakfast. Explain why outside code can read and modify the toast field but cannot directly construct a Breakfast with a struct literal, and why the summer associated function is essential here.`,
    hints: [
      'pub on a struct does not make every field pub.',
      'A struct literal must name every field, including private ones.',
    ],
    solution: `Marking a struct pub does not automatically make its fields public; each field's visibility is set individually. Here toast is pub so outside code can read and write it, but seasonal_fruit has no pub, so it remains private and outside code can neither read it nor name it. Because a struct literal requires giving a value for every field, outside code cannot construct a Breakfast directly (it cannot mention the private seasonal_fruit field). That is why a public associated function like Breakfast::summer is essential: it is defined inside the module where the private field is visible, so it can build and return a fully initialized instance. Per-field privacy lets a struct expose some data while keeping invariants on hidden fields.`,
    tags: ['pub', 'struct', 'fields'],
  },
  {
    id: 'rs-ch07-t-015',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Pub Enum Versus Pub Struct',
    prompt: `When you mark an enum pub, all of its variants automatically become public, but when you mark a struct pub, its fields stay private unless individually marked pub. Explain why this difference in default behavior makes sense from a design standpoint.`,
    hints: [
      'Think about what an enum with mostly private variants could be used for.',
      'Think about invariants you might want to protect in a struct.',
    ],
    solution: `An enum is only useful to callers if they can see and match on its variants; an enum whose variants were mostly private would be nearly useless because you could not construct or pattern-match its values, so making all variants public when the enum is pub is the only behavior that is generally helpful. A struct is different: its fields often hold internal state that must satisfy invariants (for example a fruit choice that must come from a fixed menu), so the safe default is to keep fields private and let the author opt specific fields into being public. So enums default to all-public variants for usability, while structs default to private fields for encapsulation. The author can still override struct field visibility per field with pub.`,
    tags: ['pub', 'enum', 'struct'],
  },
  {
    id: 'rs-ch07-t-016',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Why Pub Use Re-Exports',
    prompt: `You write use crate::front_of_house::hosting; inside the crate root, but external code that depends on your library cannot then write your_crate::hosting. Explain why a plain use does not expose the name to outside code, and what changing it to pub use accomplishes.`,
    hints: [
      'A plain use brings a name into scope but keeps that name private.',
      'pub use combines bringing-into-scope with re-exporting.',
    ],
    solution: `A plain use statement brings a name into the current scope but the resulting shortcut is private to that scope, so it is an internal convenience that external code cannot see. Changing it to pub use makes the brought-in name part of your crate's public interface, re-exporting it; now external code can reach the item through the new shorter path, such as your_crate::hosting. This is called re-exporting because you are exposing an item under a path different from where it is defined. It is a powerful tool for designing a clean public API that hides the internal module structure from your users.`,
    tags: ['pub-use', 're-export', 'api'],
  },
  {
    id: 'rs-ch07-t-017',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Designing The Public Path With Pub Use',
    prompt: `Internally your restaurant library organizes code as crate::front_of_house::hosting::add_to_waitlist, which is a deep path that reflects how you happened to write the code. Your users, though, think in terms of "hosting." Describe how pub use lets you keep your internal organization while presenting a simpler path to users, and what the user's call would look like.`,
    hints: [
      'Re-export the hosting module from the crate root.',
      'Internal structure and external API do not have to match.',
    ],
    solution: `You can place pub use crate::front_of_house::hosting; in the crate root (src/lib.rs). This re-exports the hosting module at the top level of your crate, so even though the code still physically lives under front_of_house internally, users can reach it directly. A user would then write your_crate::hosting::add_to_waitlist() instead of having to know about the front_of_house layer. This decouples the internal module tree (organized for the implementers' convenience) from the external API (organized for the consumers' convenience), letting you refactor the internals without breaking users as long as you keep the re-exports stable.`,
    tags: ['pub-use', 'api-design', 're-export'],
  },
  {
    id: 'rs-ch07-t-018',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Adding An External Package',
    prompt: `You want to use the rand crate's random number generator in your project. Outline the two steps required to use an external package: what you add to Cargo.toml, and what kind of statement you write in your source. Then state how bringing items from an external crate into scope differs (or does not differ) from bringing in items from your own crate.`,
    hints: [
      'Cargo handles downloading; you just declare the dependency.',
      'The path for an external crate starts with the crate name, not crate.',
    ],
    solution: `First, you add a dependency line under the dependencies section of Cargo.toml, for example rand = "0.8.5", which tells Cargo to download that crate and its dependencies from the registry and make it available. Second, in your source you bring the items you need into scope with a use statement, for example use rand::Rng;. Bringing items from an external crate into scope works the same way as for your own crate's modules, except the path starts with the external crate's name (here rand) rather than the keyword crate. The standard library, std, is also an external crate by this definition, but it ships with Rust so you do not add it to Cargo.toml.`,
    tags: ['external', 'cargo', 'use'],
  },
  {
    id: 'rs-ch07-t-019',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Collapsing Imports With Nested Paths',
    prompt: `You currently have two lines:

use std::cmp::Ordering;
use std::io;

Show how nested paths let you combine these into a single use statement, and explain the general rule for how many imports can share a common prefix this way.`,
    hints: [
      'List the differing tails inside curly braces after the shared prefix.',
      'Any number of items sharing a prefix can be grouped.',
    ],
    solution: `You can combine them with a nested path: use std::{cmp::Ordering, io};. The shared prefix std is written once, then the differing tails (cmp::Ordering and io) are listed inside curly braces separated by commas. The general rule is that any number of paths that share a common prefix can be merged into one use statement by factoring out the prefix and listing the remaining segments in braces. This reduces the number of separate use lines and keeps related imports together, which is especially helpful in files that pull in many items from the same crate.`,
    tags: ['use', 'nested-paths'],
  },
  {
    id: 'rs-ch07-t-020',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Self In A Nested Path',
    prompt: `You have:

use std::io;
use std::io::Write;

Combine these into one use statement with a nested path. There is a subtlety because one path (std::io) is a prefix of the other (std::io::Write). What keyword inside the braces handles this case, and what does it mean?`,
    hints: [
      'You need to import both io itself and io::Write.',
      'A special word stands in for the prefix path on its own.',
    ],
    solution: `You combine them as use std::io::{self, Write};. The keyword self inside the braces refers to the prefix path itself, here std::io, so this single statement brings both io (the module) and io::Write into scope. Without self you could not express "import the prefix itself" alongside one of its children in the same nested group. So self in a nested path means "and also the path up to this point as its own import." The result is one tidy line instead of two.`,
    tags: ['use', 'nested-paths', 'self'],
  },
  {
    id: 'rs-ch07-t-021',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'When The Glob Operator Helps Or Hurts',
    prompt: `The glob operator use std::collections::*; brings every public item from a path into scope. Give one situation where the glob operator is genuinely useful and idiomatic, and one reason it is generally discouraged in ordinary application code.`,
    hints: [
      'Think about test modules and prelude patterns.',
      'Think about a reader trying to find where a name came from.',
    ],
    solution: `The glob operator is useful and idiomatic in a couple of recognized situations: it is commonly used in test modules to pull everything from the module under test into the tests with use super::*;, and it is used when bringing in a crate's prelude module that is designed to be glob-imported. It is generally discouraged in ordinary code because it brings in an unknown set of names, making it hard for a reader to tell which names are in scope and where each one is defined, and it raises the risk of accidental name clashes. So reach for the glob in tests and preludes, but prefer explicit imports elsewhere for clarity.`,
    tags: ['glob', 'use', 'style'],
  },
  {
    id: 'rs-ch07-t-022',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Splitting A Module Into A File',
    prompt: `Your crate root contains a large inline module front_of_house. You replace the inline body with the declaration mod front_of_house;. Explain what this single line tells the compiler, and which file the compiler will then look for to find the module's contents.`,
    hints: [
      'A semicolon after mod means "load the body from elsewhere."',
      'The filename matches the module name.',
    ],
    solution: `Writing mod front_of_house; (with a semicolon instead of a block) tells the compiler that a module named front_of_house exists and to load its contents from another file rather than reading an inline body. The compiler looks for that body in src/front_of_house.rs, a file named after the module and placed next to the crate root. Note that mod is a declaration that defines the module in the tree; it is not like an include or import in other languages, and you write it only once. After this, the rest of the code refers to items in the module by their paths exactly as before.`,
    tags: ['modules', 'files', 'mod'],
  },
  {
    id: 'rs-ch07-t-023',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Submodules In Subdirectories',
    prompt: `You have moved front_of_house into src/front_of_house.rs. Inside it there is a submodule hosting that you now also want to move into its own file. Describe the two valid file paths Rust will accept for hosting's contents, and what line stays in src/front_of_house.rs in each case.`,
    hints: [
      'There is an older style and a newer style for nested module files.',
      'In both cases the parent file keeps a mod declaration.',
    ],
    solution: `In both styles, src/front_of_house.rs keeps the line mod hosting; to declare the submodule. For the file holding hosting's contents, the newer style places it at src/front_of_house/hosting.rs, in a directory named after the parent module. The older style places it at src/front_of_house/hosting/mod.rs, using a mod.rs file inside a directory named after the submodule. Both are valid and compile, but mixing them for the same module is not allowed and will trigger a warning or error. The newer path-based style (front_of_house/hosting.rs) is generally preferred because it avoids many files all named mod.rs.`,
    tags: ['modules', 'files', 'directories'],
  },
  {
    id: 'rs-ch07-t-024',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Mod Is Not Include',
    prompt: `A developer coming from C or Python writes mod front_of_house; in both src/lib.rs and src/main.rs of the same package, thinking of it like an include that just pastes the file. Explain why mod is conceptually different from an include, and what actually happens when the same module file is declared in two different crate roots.`,
    hints: [
      'mod defines the module as part of one crate tree.',
      'A package can have both a library crate and a binary crate.',
    ],
    solution: `mod is a declaration that creates a module as a node in a specific crate's module tree; it is not a textual include that pastes a file wherever it appears. When you write mod front_of_house; in src/lib.rs, the module becomes part of the library crate's tree, and writing it again in src/main.rs would make a separate module that is part of the binary crate's tree, so the same file's contents end up compiled into two independent crates with no shared identity. The idiomatic approach is to declare the module once in the library crate root (src/lib.rs) and have the binary (src/main.rs) use the library crate by its package name, for example use your_package::front_of_house;. That way the binary depends on the library rather than re-declaring the module, avoiding duplicate definitions and keeping a single source of truth.`,
    tags: ['mod', 'crates', 'binary-library'],
  },
  {
    id: 'rs-ch07-t-025',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Choosing Absolute Or Relative Paths',
    prompt: `The book notes that choosing between absolute and relative paths is a decision you make based on your project, and that it often depends on whether you are more likely to move the item-definition code or the item-using code separately. Reason through which choice survives each kind of move, and state the book's default leaning.`,
    hints: [
      'Imagine moving only the definition, leaving the call site in place.',
      'Imagine moving the call site together with its parent context.',
    ],
    solution: `If you move the definition code to a different place in the tree but leave the calling code where it is, an absolute path (starting from crate) tends to keep pointing at the right place is less likely to need fixing only if the absolute path is updated, but really the key contrast is this: relative paths survive when the calling code and the called code are moved together as a unit, because their relative relationship is unchanged. Absolute paths survive when the calling code stays put and you reason from the fixed crate root. The book's general preference is to favor absolute paths, because it is more common to want to move item definitions and item calls independently of each other, and absolute paths keep working as long as the item's place relative to the crate root is stable. So default to absolute paths unless you have a specific reason (like moving a subtree together) to prefer relative ones.`,
    tags: ['paths', 'design', 'refactoring'],
  },
  {
    id: 'rs-ch07-t-026',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Tracing Visibility Across Siblings',
    prompt: `Reason about this code without running it:

mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

mod back_of_house {
    pub fn serve() {
        crate::front_of_house::hosting::add_to_waitlist();
    }
}

front_of_house is NOT marked pub. Does serve's call compile? Explain using the parent/child visibility rules, and contrast this with whether external code could call back_of_house::serve.`,
    hints: [
      'front_of_house and back_of_house share the same parent: the crate root.',
      'Privacy restricts outsiders, not siblings under a common ancestor.',
    ],
    solution: `The call inside serve compiles. front_of_house and back_of_house are both children of the crate root, so they are siblings; code anywhere in the crate root's subtree can refer to front_of_house even though it lacks pub, because privacy only hides items from code outside the module where they are defined, not from siblings sharing a common ancestor. Inside that path, hosting is pub and add_to_waitlist is pub, so every segment is reachable from within the crate. By contrast, external code (another crate) could not call back_of_house::serve, because back_of_house itself is private to this crate; the function serve being pub does not help if its containing module is not pub. So the same code can be perfectly reachable internally yet invisible externally.`,
    tags: ['privacy', 'siblings', 'visibility'],
  },
  {
    id: 'rs-ch07-t-027',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Re-Export To Flatten A Deep API',
    prompt: `Your library defines a useful type at crate::kinds::primary::PrimaryColor and crate::utils::mix, but you consider these internal organization details. Users keep complaining the paths are too long. Design (in prose and a couple of lines) how to use pub use in src/lib.rs so users can write your_crate::PrimaryColor and your_crate::mix, and explain why this does not force you to move the actual definitions.`,
    hints: [
      'pub use can re-export an item at any level, including the crate root.',
      'The definition location and the public path are independent.',
    ],
    solution: `In src/lib.rs you add re-exports at the crate root, for example pub use self::kinds::primary::PrimaryColor; and pub use self::utils::mix;. These statements expose PrimaryColor and mix directly at the top of your crate's public API while the actual definitions stay where they are inside kinds and utils. Because pub use only creates an additional public path to an existing item, you do not have to physically move any code; the internal module tree is unchanged and your implementers keep their preferred organization. Users now write your_crate::PrimaryColor and your_crate::mix, and you can later reorganize the internals as long as you keep these re-exports pointing at the right items. This is the standard technique for presenting a flat, convenient API over a deeper internal structure.`,
    tags: ['pub-use', 're-export', 'api-design'],
  },
  {
    id: 'rs-ch07-t-028',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Scope Of A Use Statement',
    prompt: `A use statement only creates a shortcut for the particular scope in which it appears. Consider a use crate::front_of_house::hosting; written at the crate root, and a child module customer that tries to call hosting::add_to_waitlist() directly. Predict whether that works, explain why, and give two ways to make the call succeed from inside customer.`,
    hints: [
      'The shortcut from use does not automatically leak into child modules.',
      'You can move the use, re-export it, or use super.',
    ],
    solution: `Calling hosting::add_to_waitlist() directly from inside customer fails, because the use shortcut created at the crate root only applies in the crate root's scope, not inside the nested customer module; the name hosting is not in scope there. One fix is to write the use statement inside the customer module so the shortcut exists in that scope. Another fix is to refer to it through the parent with a relative path, such as super::hosting::add_to_waitlist(), since the shortcut hosting lives in customer's parent (the crate root). A third option is to make the original use a pub use so the shortcut becomes available to child code as a re-export. The key idea is that use shortcuts are scoped, not global.`,
    tags: ['use', 'scope', 'modules'],
  },
  {
    id: 'rs-ch07-t-029',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Binary And Library In One Package',
    prompt: `A common project pattern is a package with both src/main.rs and src/lib.rs, where the binary is kept thin and most logic lives in the library. Explain how the binary crate accesses code in the library crate (what path prefix does it use), and give one strong reason this split is considered good design.`,
    hints: [
      'The binary treats the library as an external crate by its package name.',
      'Think about what else can use the library besides the binary.',
    ],
    solution: `The binary crate (src/main.rs) accesses the library crate's public items the same way any other crate would: it refers to them through the library's name, which is the package name, for example use my_package::some_module::some_fn; (rather than the crate keyword, which would refer to the binary's own root). Inside src/main.rs you keep only a thin main function that wires things together and calls into the library's public API. A strong reason this split is good design is that the real logic in the library is reusable and testable on its own: other crates can depend on the library, and you can write integration tests and documentation against its public API, none of which is possible for code locked inside a binary crate. It also forces you to design a clean public interface.`,
    tags: ['binary-library', 'package', 'design'],
  },
  {
    id: 'rs-ch07-t-030',
    chapter: 7,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Full Trace Across Files And Paths',
    prompt: `A library crate is split across files. src/lib.rs contains:

mod garden;
pub use crate::garden::vegetables::Asparagus;

src/garden.rs contains:

pub mod vegetables;

src/garden/vegetables.rs contains:

pub struct Asparagus {}

Trace the whole module tree, name the file each node comes from, and explain what external code must write to construct an Asparagus given the pub use re-export. Also note what external code would have to write WITHOUT that re-export.`,
    hints: [
      'mod garden; loads src/garden.rs; pub mod vegetables; loads the subdirectory file.',
      'The pub use exposes Asparagus at the crate root.',
    ],
    solution: `The tree is: crate (from src/lib.rs) -> garden (declared by mod garden; in src/lib.rs, body in src/garden.rs) -> vegetables (declared by pub mod vegetables; in src/garden.rs, body in src/garden/vegetables.rs) -> Asparagus (the pub struct in src/garden/vegetables.rs). Because src/lib.rs has pub use crate::garden::vegetables::Asparagus;, the struct is re-exported at the crate root, so external code can construct it with the short path: use my_crate::Asparagus; then let a = Asparagus {};. Without the re-export, external code would have to spell out the full internal path, use my_crate::garden::vegetables::Asparagus; (which also requires garden and vegetables to be pub, as they are here). This shows how splitting modules into files, the mod declarations that load them, and a pub use re-export combine to produce a tidy public API.`,
    tags: ['modules', 'files', 'pub-use'],
  },
]

export default problems
