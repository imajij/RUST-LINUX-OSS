import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch14-t-001',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'What Is a Release Profile',
    prompt: `Cargo has two main build profiles, dev and release. In one or two sentences, explain what a profile is and which command selects each one. Which profile is optimized for fast compilation, and which is optimized for a fast running program?`,
    hints: [
      'Think about cargo build versus cargo build --release.',
      'Profiles are predefined sets of compiler settings.',
    ],
    solution: `A profile is a named, predefined set of compiler configuration values that Cargo applies when building your code. The dev profile is used by cargo build (no flags) and favors fast compilation so you can iterate quickly. The release profile is used by cargo build --release and applies optimizations so the resulting program runs fast, at the cost of slower compile times. Cargo puts the artifacts in target/debug and target/release respectively.`,
    tags: ['profiles', 'cargo', 'build'],
  },
  {
    id: 'rs-ch14-t-002',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Three Slashes for Docs',
    prompt: `Rust has ordinary comments that start with // and documentation comments that start with ///. In a sentence or two, explain what makes a /// comment special, what tool turns it into something useful, and what kind of text (Markdown or plain) goes inside it.`,
    hints: [
      'Documentation comments are processed, not just ignored.',
      'There is a cargo command that generates HTML.',
    ],
    solution: `A /// documentation comment documents the item that immediately follows it (such as a function or struct), and its contents support Markdown formatting. Unlike a // comment, which the compiler simply ignores, a /// comment is collected by the tool cargo doc, which generates browsable HTML documentation for the crate. The generated docs land in target/doc, and cargo doc --open opens them in a browser.`,
    tags: ['doc-comments', 'cargo-doc', 'documentation'],
  },
  {
    id: 'rs-ch14-t-003',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'What cargo install Is For',
    prompt: `Your friend says cargo install is how you add a library dependency to a project. Are they correct? In a sentence or two, explain what cargo install actually does and what kind of crate it is meant for.`,
    hints: [
      'Think binaries versus libraries.',
      'Where do the installed programs end up?',
    ],
    solution: `Your friend is mistaken. cargo install downloads and builds a crate that provides a binary (a runnable program) from crates.io and installs that executable so you can run it as a command-line tool; it does not add library dependencies to a project. To add a library dependency you list it under [dependencies] in Cargo.toml. Installed binaries are placed in the installation root's bin directory (typically ~/.cargo/bin), which should be on your PATH.`,
    tags: ['cargo-install', 'binaries', 'cargo'],
  },
  {
    id: 'rs-ch14-t-004',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'What Is a Workspace',
    prompt: `You are building several related crates that you want to develop together. In one or two sentences, describe what a Cargo workspace is and name one practical thing the crates in a workspace share.`,
    hints: [
      'A workspace groups multiple packages.',
      'Think about where compiled output goes.',
    ],
    solution: `A workspace is a set of one or more related packages (member crates) that are managed together and share a single top-level Cargo.lock and a single output directory. The members share one target directory so compiled artifacts are not duplicated and the crates can depend on each other directly during development. This makes it convenient to develop interrelated crates in one repository while keeping each as its own package.`,
    tags: ['workspaces', 'cargo', 'definition'],
  },
  {
    id: 'rs-ch14-t-005',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Reading opt-level',
    prompt: `Consider this snippet from Cargo.toml:

    [profile.dev]
    opt-level = 1

What does setting opt-level mean, what is the default value of opt-level for the dev profile, and what range of values can opt-level take? Briefly say what raising it does to compile time and run speed.`,
    hints: [
      'opt-level controls how many optimizations are applied.',
      'The dev default and the release default differ.',
    ],
    solution: `opt-level controls the number of optimizations the compiler applies, ranging from 0 through 3. The dev profile defaults to opt-level = 0 (no optimizations, fastest compile), while release defaults to opt-level = 3. Setting [profile.dev] opt-level = 1 overrides the dev default so dev builds apply some optimizations: this makes compilation a bit slower but the resulting code somewhat faster than the unoptimized default. Any profile setting you do not list keeps Cargo's default for that profile.`,
    tags: ['profiles', 'opt-level', 'cargo-toml'],
  },
  {
    id: 'rs-ch14-t-006',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Inner Versus Outer Doc Comments',
    prompt: `Rust has /// and also //! . One of them documents the item that follows it, and the other documents the item that contains it. State which is which, and give a typical place you would use //! .`,
    hints: [
      'Outer comments sit above the thing they describe.',
      'Inner comments sit inside the thing they describe.',
    ],
    solution: `/// is an outer documentation comment: it documents the item that immediately follows it, like a function or struct. //! is an inner documentation comment: it documents the item that encloses it rather than what follows. You typically place //! at the very top of a crate root (src/lib.rs) or a module file to describe the crate or module as a whole, since there is no preceding item to attach an outer comment to. This crate-level text appears on the front page of the generated documentation.`,
    tags: ['doc-comments', 'inner-doc', 'documentation'],
  },
  {
    id: 'rs-ch14-t-007',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'The Examples Heading',
    prompt: `Idiomatic Rust doc comments often use an "# Examples" section. What does that # mean inside a /// comment, and besides Examples, name two other section headings the Rust community commonly uses in documentation for functions.`,
    hints: [
      'Doc comments are Markdown.',
      'Think about what callers need to know before calling a function.',
    ],
    solution: `Inside a /// comment the contents are Markdown, so # Examples is a Markdown level-one heading; cargo doc renders it as a titled section. Besides Examples, two other commonly used headings are "# Panics" (describing the conditions under which the function could panic) and "# Errors" (describing the kinds of errors a function returning Result may return). Another frequent one is "# Safety" for explaining the invariants a caller of an unsafe function must uphold. Using these standard headings makes documentation predictable for readers.`,
    tags: ['doc-comments', 'examples', 'markdown'],
  },
  {
    id: 'rs-ch14-t-008',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Doc Tests Run on Test',
    prompt: `You wrote an # Examples section in a doc comment containing this code block:

    /// let answer = my_crate::add_one(5);
    /// assert_eq!(6, answer);

What surprising thing happens to that example code when you run cargo test, and why is this behavior valuable for a library author?`,
    hints: [
      'Examples in doc comments are not just text.',
      'Think about documentation that drifts out of date.',
    ],
    solution: `When you run cargo test, Rust compiles and runs the code in the Examples section as a documentation test. If you later change the API so the example no longer works, the doc test fails, alerting you that your documentation has fallen out of sync with the code. This is valuable because it guarantees the examples in your docs are actually correct and runnable, so readers can trust them. The test output reports these under a "Doc-tests" section.`,
    tags: ['doc-tests', 'cargo-test', 'documentation'],
  },
  {
    id: 'rs-ch14-t-009',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why Re-Export',
    prompt: `A user of your crate must currently write use my_art::kinds::PrimaryColor and use my_art::utils::mix to do common tasks, even though your internal module tree is deeply nested. What single Rust feature lets you offer a flatter, friendlier public path without reorganizing your internal files, and what keyword does it use?`,
    hints: [
      'You can make an item available from a new location.',
      'The keyword is the same one used for bringing items into scope, plus pub.',
    ],
    solution: `You use a re-export, written with pub use. Placing pub use self::kinds::PrimaryColor; and pub use self::utils::mix; in your crate root re-exports those items at the top level, so callers can write use my_art::PrimaryColor and use my_art::mix while your internal module structure stays the same. The pub makes the re-export part of your crate's public API, and the generated docs list these re-exports on the front page. This decouples the public-facing API from how the code is internally organized.`,
    tags: ['pub-use', 're-export', 'public-api'],
  },
  {
    id: 'rs-ch14-t-010',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Metadata Before Publishing',
    prompt: `You run cargo publish and it refuses, complaining about missing fields. List three pieces of metadata in the [package] section of Cargo.toml that crates.io commonly requires or strongly expects before a publish will succeed, and say where the license value comes from.`,
    hints: [
      'A crate needs a unique name and a way to describe itself.',
      'crates.io requires legal terms for use.',
    ],
    solution: `crates.io expects, at minimum, a unique name, a description, and a license. The description is a sentence or two shown in search results, and the license is required so others know the legal terms for using the crate. The license value is an SPDX license identifier, such as "MIT" or "MIT OR Apache-2.0"; alternatively you can point to a license file with the license-file field. A version field is also present and is used to order published releases.`,
    tags: ['publishing', 'cargo-toml', 'metadata'],
  },
  {
    id: 'rs-ch14-t-011',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Publishing Is Permanent',
    prompt: `Your teammate wants to publish version 0.1.0 to crates.io now and just overwrite it with fixed code under the same version number tomorrow. Explain why this plan does not work, and what they should do instead to release the fix.`,
    hints: [
      'A published version cannot be deleted or replaced.',
      'Versions are immutable to protect downstream builds.',
    ],
    solution: `Publishing on crates.io is permanent: once a version is published, that exact version can never be overwritten or deleted, and its code cannot be changed. This immutability exists so that anyone who depends on 0.1.0 always gets the same code, keeping builds reproducible. To release a fix, your teammate must publish a new version number, such as 0.1.1, with the corrected code. They cannot reuse 0.1.0.`,
    tags: ['publishing', 'versions', 'crates-io'],
  },
  {
    id: 'rs-ch14-t-012',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'A Minimal Two-Member Workspace',
    prompt: `You want a workspace with a binary crate named "adder" and a library crate named "add_one". Sketch the top-level Cargo.toml that declares this workspace, and explain whether that top-level Cargo.toml needs a [package] section of its own.`,
    hints: [
      'A workspace root lists its members.',
      'The workspace root may have no package of its own.',
    ],
    solution: `The top-level Cargo.toml declares the members under a [workspace] table:

    [workspace]
    members = ["adder", "add_one"]

The workspace root does not need a [package] section; it can exist purely to group the members (a so-called virtual workspace). Each member directory (adder/ and add_one/) has its own Cargo.toml with its own [package] section. Running cargo build at the root builds all members into the shared target directory.`,
    tags: ['workspaces', 'cargo-toml', 'members'],
  },
  {
    id: 'rs-ch14-t-013',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Pointing at a Sibling Crate',
    prompt: `Inside a workspace, the "adder" binary crate needs to use functions from the "add_one" library crate, which lives in a sibling directory. What kind of dependency do you add to adder/Cargo.toml, and write the line that declares it.`,
    hints: [
      'crates.io is not involved for an in-workspace crate.',
      'You specify a relative path.',
    ],
    solution: `You add a path dependency, because add_one is local rather than published. In adder/Cargo.toml you write:

    [dependencies]
    add_one = { path = "../add_one" }

The path is relative to adder/Cargo.toml and points at the sibling crate's directory. After this, adder can call add_one's public functions with use add_one::...; Cargo does not look at crates.io for this dependency.`,
    tags: ['workspaces', 'path-dependencies', 'cargo-toml'],
  },
  {
    id: 'rs-ch14-t-014',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Profile Override Precedence',
    prompt: `A Cargo.toml contains:

    [profile.release]
    opt-level = 1

Predict the opt-level used for cargo build, for cargo build --release, and for cargo test --release. Then explain in one sentence the general rule for what happens to release-profile settings you do NOT explicitly list.`,
    hints: [
      'Only the release profile was touched.',
      'Cargo fills in unlisted settings with its own defaults.',
    ],
    solution: `cargo build uses the dev profile, which is untouched here, so its opt-level stays at the dev default of 0. cargo build --release and cargo test --release both use the release profile, which is now overridden to opt-level = 1 instead of the usual 3. The general rule is that any setting you do not explicitly list in a [profile.*] table keeps Cargo's built-in default for that profile, so you only override the specific values you write.`,
    tags: ['profiles', 'opt-level', 'precedence'],
  },
  {
    id: 'rs-ch14-t-015',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'When a Doc Test Hides Setup',
    prompt: `A library author writes a doc-test example that needs a helper variable, but they do not want that boilerplate line shown to readers in the rendered HTML. Within a doc comment code block, how can a line still run during cargo test yet be hidden from the displayed documentation, and what is the trade-off of overusing this?`,
    hints: [
      'A leading marker hides a line from the rendered output.',
      'Hidden lines still compile and run.',
    ],
    solution: `Prefixing a line inside the code block with a hash and a space (a "# " at the start of the line) hides that line from the rendered documentation while still compiling and running it as part of the doc test. This lets the author include necessary setup (like imports or fixture values) so the example actually runs, without cluttering what readers see. The trade-off is that overusing hidden lines can make the visible example misleading, since readers cannot see code that is essential to make it work, hurting the example's usefulness as a copyable snippet.`,
    tags: ['doc-tests', 'documentation', 'cargo-test'],
  },
  {
    id: 'rs-ch14-t-016',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Re-Export Versus Move',
    prompt: `To clean up your public API you are deciding between (a) physically moving items up to the crate root, versus (b) leaving them in nested modules and adding pub use re-exports at the root. Compare these two approaches: what does each do to your internal code organization, and why might a maintainer prefer the re-export approach?`,
    hints: [
      'One changes file structure; the other adds an alias.',
      'Think about keeping internal grouping while flattening the public face.',
    ],
    solution: `Moving items (a) physically reorganizes your source so the public structure and internal structure become one and the same; this can flatten useful internal grouping and forces you to restructure files. Re-exporting (b) leaves the items where they are and adds pub use lines at the root so callers see a flat API while you keep your tidy internal module hierarchy. A maintainer often prefers re-exports because they decouple the convenient public API from the internal organization: you can refactor internals freely as long as the re-exports still point at the right items. Re-exports also show up clearly on the docs front page, signaling the intended entry points.`,
    tags: ['pub-use', 'public-api', 'design'],
  },
  {
    id: 'rs-ch14-t-017',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Reading a Version Bump',
    prompt: `Your library is at 1.4.2 and follows Semantic Versioning. For each change below, state which number you should bump (major, minor, or patch): (1) you fix a bug without changing any signatures; (2) you add a brand-new public function while leaving everything existing intact; (3) you remove a public function that some users call.`,
    hints: [
      'Semver is MAJOR.MINOR.PATCH.',
      'Breaking compatibility means a major bump.',
    ],
    solution: `(1) A backward-compatible bug fix bumps the patch number, giving 1.4.3. (2) Adding new functionality in a backward-compatible way bumps the minor number and resets patch, giving 1.5.0. (3) Removing a public function is a breaking change, so it bumps the major number and resets minor and patch, giving 2.0.0. The rule of semver is that the major number changes on incompatible API changes, the minor on backward-compatible additions, and the patch on backward-compatible fixes.`,
    tags: ['semver', 'versions', 'publishing'],
  },
  {
    id: 'rs-ch14-t-018',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'What Yank Really Does',
    prompt: `You discover version 1.2.0 of your published crate has a serious bug, so you run cargo yank --version 1.2.0. Explain precisely what yanking does and does not do: can projects that already depend on 1.2.0 still build, and can new projects start depending on 1.2.0?`,
    hints: [
      'Yank is not the same as deleting.',
      'Existing lockfiles are respected.',
    ],
    solution: `Yanking marks version 1.2.0 as no longer recommended without deleting it: the code remains downloadable so existing builds keep working. Projects that already have 1.2.0 in their Cargo.lock can still build and download it, which is the point: yank does not break existing consumers. However, new projects (and existing ones generating a fresh lockfile) will not select 1.2.0, because yank prevents new dependencies from resolving to that version. If you later decide the version is fine, you can undo it with cargo yank --version 1.2.0 --undo.`,
    tags: ['yank', 'publishing', 'crates-io'],
  },
  {
    id: 'rs-ch14-t-019',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'One Lockfile to Rule Them',
    prompt: `In a workspace with two member crates, both depend on the rand crate but one writes rand = "0.8" and the other writes rand = "0.8.5". After building, how many copies of rand will the workspace resolve to, where does that decision get recorded, and why is this behavior desirable?`,
    hints: [
      'A workspace shares a single Cargo.lock.',
      'Compatible requirements unify to one version.',
    ],
    solution: `Because the two requirements are compatible (0.8 and 0.8.5 both permit the same 0.8.x line), the workspace resolves to a single shared version of rand recorded in the one top-level Cargo.lock that all members share. There is one Cargo.lock for the whole workspace rather than one per crate, so all members agree on the same dependency versions. This is desirable because it guarantees compatibility between the crates, avoids building and shipping multiple copies of the same dependency, and keeps the shared target directory smaller and faster to build.`,
    tags: ['workspaces', 'cargo-lock', 'dependencies'],
  },
  {
    id: 'rs-ch14-t-020',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Testing a Single Member',
    prompt: `You are in the root of a workspace that has members "adder" and "add_one". You only want to run the tests in the add_one crate, not in adder. What cargo command and flag accomplish this, and what does plain cargo test (with no flags) do in a workspace?`,
    hints: [
      'There is a flag that selects one package by name.',
      'Without it, the command spans all members.',
    ],
    solution: `Use cargo test -p add_one (the -p flag, short for --package, selects a single package by its name). Running plain cargo test from the workspace root runs the tests for all member crates in the workspace, so the -p flag narrows it to just the one you name. The same -p flag works with other commands like cargo build and cargo run to target a specific member.`,
    tags: ['workspaces', 'cargo-test', 'package-flag'],
  },
  {
    id: 'rs-ch14-t-021',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Custom Cargo Subcommands',
    prompt: `You have a binary on your PATH named cargo-something. Explain how Cargo lets you invoke it as if it were a built-in subcommand, what you would type, and how cargo --list relates to this feature.`,
    hints: [
      'Cargo treats certain binary names specially.',
      'The naming convention is the key.',
    ],
    solution: `If a binary on your PATH is named cargo-something, Cargo lets you run it as a subcommand by typing cargo something; Cargo finds the matching cargo-something executable and runs it. This is how Cargo is extensible: installing such a binary (often via cargo install) effectively adds a new cargo subcommand without modifying Cargo itself. Running cargo --list shows all available subcommands, including these custom ones, so you can discover what extensions are installed.`,
    tags: ['subcommands', 'cargo', 'cargo-install'],
  },
  {
    id: 'rs-ch14-t-022',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Install Versus Build',
    prompt: `Compare cargo build --release and cargo install for getting a usable executable. For each, say where the binary ends up and who can run it afterward, then explain when you would choose cargo install over cargo build.`,
    hints: [
      'One produces output inside your project; the other installs globally.',
      'Think about running a tool from anywhere.',
    ],
    solution: `cargo build --release compiles your current project and places the optimized binary in this project's target/release directory; you run it from there and it is tied to that project checkout. cargo install builds a published (or local) crate that provides a binary and copies the resulting executable into the Cargo bin directory (typically ~/.cargo/bin), which is on your PATH, so you can invoke it by name from anywhere. You choose cargo install when you want to use a Rust command-line tool system-wide, whereas you use cargo build while actively developing and testing your own project.`,
    tags: ['cargo-install', 'cargo-build', 'binaries'],
  },
  {
    id: 'rs-ch14-t-023',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Docs Show Re-Exports',
    prompt: `A reviewer claims that adding pub use to flatten an API has a second benefit beyond shorter import paths: it improves the generated documentation. Explain what cargo doc does on the front page when you re-export items with pub use, and why this helps a newcomer to your crate.`,
    hints: [
      'Re-exports get a dedicated section on the docs front page.',
      'Newcomers struggle to find the important types.',
    ],
    solution: `When you re-export items with pub use, cargo doc lists those re-exports prominently on the crate's documentation front page under a "Re-exports" section, in addition to linking to their original locations. This means a newcomer landing on the top-level docs immediately sees the key types and functions you intend them to use, rather than having to dig through a deep, unfamiliar module tree to find them. So pub use both shortens import paths and signals, in the documentation itself, which items are the intended public entry points.`,
    tags: ['pub-use', 'cargo-doc', 'public-api'],
  },
  {
    id: 'rs-ch14-t-024',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'A Caret Requirement Puzzle',
    prompt: `A dependency is written as rand = "0.8.3". By Cargo's default version rules, which of these published versions would satisfy this requirement: 0.8.2, 0.8.5, 0.9.0, 1.0.0? Explain the rule Cargo applies, and why 0.x versions are treated specially.`,
    hints: [
      'A bare version string is a caret requirement.',
      'For 0.x releases, the first nonzero part is the "breaking" one.',
    ],
    solution: `A bare version string is shorthand for a caret requirement, which allows any version that is semver-compatible with the one written, meaning it may go up but must not include a change considered breaking. For 0.8.3, the leftmost nonzero component is the minor (8), so compatible versions are at least 0.8.3 and below 0.9.0. Thus 0.8.5 satisfies it; 0.8.2 does not (it is lower than 0.8.3), 0.9.0 does not (it crosses the breaking boundary), and 1.0.0 does not. The 0.x special case exists because pre-1.0 crates are considered unstable, so even a minor bump like 0.8 to 0.9 is treated as potentially breaking.`,
    tags: ['semver', 'dependencies', 'caret'],
  },
  {
    id: 'rs-ch14-t-025',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'External Crate in a Doc Test',
    prompt: `A library crate has a doc-test example whose code uses a helper from another crate, "rand". The example compiles fine in a normal .rs file but the doc test fails to compile, complaining it cannot find rand. The crate uses rand only inside this example, nowhere else. Diagnose why the doc test fails and how to fix it, and explain what a doc test is actually compiled against.`,
    hints: [
      'A doc test is compiled as its own little program.',
      'Where must rand be listed for the example to see it?',
    ],
    solution: `Each doc test is compiled and run as a separate standalone program that links against your crate and its declared dependencies. If the example needs rand, then rand must be available as a dependency of your crate; using it nowhere else in your source means it is probably not listed in Cargo.toml, so the doc test cannot resolve it. The fix is to add rand to your crate's dependencies (or, if it is only needed for examples and tests, to [dev-dependencies], which doc tests can also use). Because the doc test is its own program rather than part of an existing function, every name it references must be reachable from the crate plus those declared dependencies.`,
    tags: ['doc-tests', 'dependencies', 'cargo-test'],
  },
  {
    id: 'rs-ch14-t-026',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Publishing a Workspace Member',
    prompt: `You have a workspace whose binary "adder" depends on the local library "add_one" via path = "../add_one". You want to publish add_one to crates.io so others can use it, and you also want adder (kept private) to keep working in the workspace. Walk through what must change about the dependency declaration and the order of operations, and explain why a bare path dependency alone cannot be published.`,
    hints: [
      'crates.io cannot resolve a local path on your machine.',
      'You can give both a version and a path.',
    ],
    solution: `A bare path dependency points at a directory on your machine, which crates.io cannot resolve for other users, so a published crate's dependencies must carry version numbers from crates.io rather than only a path. First publish add_one itself (it must have publishable metadata and not depend on anything unpublished). Then, for adder to use the published add_one, declare the dependency with both a version and a path, for example add_one = { path = "../add_one", version = "0.1.0" }: Cargo uses the path locally within the workspace and the version when resolving from crates.io. Since adder stays private, you can set publish = false in adder's Cargo.toml so it is never accidentally published, while add_one goes to crates.io with a proper version.`,
    tags: ['workspaces', 'publishing', 'path-dependencies'],
  },
  {
    id: 'rs-ch14-t-027',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'When opt-level Should Differ Per Crate',
    prompt: `Compiling your dev build is slow because one dependency does heavy numeric work that runs noticeably faster when optimized, yet you want your own crate to stay at opt-level 0 for fast iteration. Cargo lets you set an optimization level for dependencies separately from your own package. Explain the idea behind a profile override that targets dependencies, and why optimizing only dependencies but not your own code can be a good compromise.`,
    hints: [
      'Cargo can override a profile for all dependencies at once.',
      'Your own code recompiles often; dependencies rarely change.',
    ],
    solution: `Cargo allows overriding the profile settings applied to dependencies separately from your own package, so you can keep [profile.dev] opt-level = 0 for your code while raising the optimization level applied to dependencies. This is a good compromise because dependencies usually compile once and then stay cached (you rarely change them), so paying the one-time cost to optimize them is cheap, while your own crate, which you recompile constantly, stays unoptimized for fast rebuilds. The result is faster runtime performance from the heavy dependency without slowing down your own edit-compile-run loop. The general rule is that profile settings are layered: defaults, your overrides, and more specific overrides combine to control exactly what gets optimized.`,
    tags: ['profiles', 'opt-level', 'dependencies'],
  },
  {
    id: 'rs-ch14-t-028',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Designing a Prelude-Style API',
    prompt: `You are the author of a graphics crate with internal modules shapes, colors, and transforms, each holding several types. You want users to write one simple import to get the handful of items they need most, while still allowing access to everything via full paths. Design how you would structure the public API using pub use, and discuss the trade-off of re-exporting too much.`,
    hints: [
      'Re-export only the most-used items at the root or in a dedicated module.',
      'A flat namespace can collide and overwhelm.',
    ],
    solution: `You would re-export the small set of most-used types at the crate root (or in a conventionally named module) with pub use, for example pub use shapes::Rectangle; pub use colors::Color; pub use transforms::Translate; so callers get them with one short import like use graphics::Rectangle. The internal modules stay intact, so advanced users can still reach less-common items by their full paths such as graphics::transforms::Skew. The trade-off of re-exporting too much is that a bloated flat namespace becomes overwhelming, increases the chance of name collisions, and weakens the signal about which items are the primary entry points; a curated re-export set keeps the common path easy while leaving the full hierarchy available. This keeps the public API both discoverable and complete without forcing the internal structure to be flat.`,
    tags: ['pub-use', 'public-api', 'design'],
  },
  {
    id: 'rs-ch14-t-029',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'cargo install Reinstall and Conflicts',
    prompt: `You ran cargo install ripgrep a while ago. Today a new version is released, and separately a different crate also provides a binary literally named the same as one ripgrep installs. Reason about: (1) how you upgrade an already-installed tool, and (2) what happens if two installed crates try to place a binary with the same filename into the Cargo bin directory.`,
    hints: [
      'Reinstalling overwrites the previous build of the same crate.',
      'Two different files cannot share one path.',
    ],
    solution: `(1) To upgrade, you run cargo install again for the crate (it builds the newest compatible version and overwrites the previously installed binary in the Cargo bin directory); there is no separate update command, reinstalling is the mechanism. (2) The Cargo bin directory holds one file per binary name, so two different crates cannot both place a binary with the same filename there at once; the second install would conflict with the existing one rather than silently coexist. In practice you must avoid having two distinct tools claim the same executable name, since whichever sits at that path is the one your shell runs. This is why installed-tool names need to be unique on your system's PATH.`,
    tags: ['cargo-install', 'binaries', 'path'],
  },
  {
    id: 'rs-ch14-t-030',
    chapter: 14,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'A Pre-Publish Readiness Review',
    prompt: `A colleague is about to run cargo publish for a new crate. Their Cargo.toml has only name and version; they have // comments but no /// comments anywhere; they have never run cargo test; and they intend to use version 0.0.0. Identify at least three concrete problems with this readiness state and what each should be before publishing, drawing on documentation, doc tests, metadata, and versioning.`,
    hints: [
      'Think about each chapter-14 area: docs, tests, metadata, version.',
      'Recall what crates.io requires and what users expect.',
    ],
    solution: `First, the metadata is incomplete: crates.io expects at least a description and a license, so publishing with only name and version will likely be rejected or produce an unusable listing. Second, there is no documentation: // comments are invisible to cargo doc, so the colleague should add /// doc comments (and ideally a //! crate-level comment) with an # Examples section so users get real docs. Third, those example sections would become doc tests, and combined with never running cargo test it means nothing has been verified; they should run cargo test (which also runs doc tests) to confirm the code and examples actually work before shipping. Finally, 0.0.0 is a poor starting version: a first real release is conventionally 0.1.0, and because publishing is permanent and versions are immutable, choosing a sensible semver starting point matters. Fixing documentation, tests, metadata, and the version number should all happen before cargo publish.`,
    tags: ['publishing', 'documentation', 'semver'],
  },
]

export default problems
