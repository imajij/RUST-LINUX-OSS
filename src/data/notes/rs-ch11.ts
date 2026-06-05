import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-rs-11',
  track: 'rust',
  chapter: 11,
  title: 'Writing Automated Tests',
  summary: `Tests are the executable specification of what your code is supposed to do, and in Rust they are a first-class part of the language and toolchain rather than a bolted-on framework. This chapter teaches the mechanics of writing test functions, asserting on their results, checking that code panics or returns errors, and organizing tests into unit tests that live beside your code and integration tests that exercise your crate from the outside. For anyone aiming to contribute to open source, this is non-negotiable knowledge: maintainers will not merge a feature or a fix without tests, and a well-written test is often the clearest way to communicate intent in a pull request. Mastering cargo test and its flags also makes you dramatically faster at iterating on unfamiliar code.`,
  sections: [
    {
      heading: 'The test attribute and the anatomy of a test',
      body: `A test in Rust is just an ordinary function that has been annotated with the **#[test]** attribute on the line directly above it. An attribute is metadata the compiler reads; the test attribute marks a function so that the test runner will call it when you run **cargo test**, and ignore it during a normal **cargo build**. Functions without the attribute are never treated as tests even if they live in a test module.

### How a test passes or fails

The model is brutally simple and worth internalizing: a test function **passes if it returns normally and fails if it panics**. There is no special pass or fail return value in the basic form. Every test runs in its own thread, and the main test thread watches each child thread. If a test thread dies (a panic unwinds it), the runner marks that test failed and keeps the others running, so one broken test does not hide the results of the rest.

### What cargo test actually does

When you run a project created with **cargo new --lib adder**, Cargo generates a sample test for you. Running cargo test compiles your code in test configuration, builds a test binary, and runs it. The output reports how many tests ran, how many passed, failed, or were ignored, plus a separate line for measured (benchmark) tests and for documentation tests (doctests in your /// comments are compiled and run too).

A pitfall to call out early: do not confuse the *name* of a test with what it checks. The runner only knows whether the function panicked. A test named test_addition that never actually asserts anything will pass unconditionally and give you false confidence. Always make the body actually verify something.`,
      code: [
        {
          lang: 'rust',
          src: `// The default contents of src/lib.rs after: cargo new --lib adder
pub fn add(left: u64, right: u64) -> u64 {
    left + right
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        // A passing test simply returns; a panic here would fail it.
        assert_eq!(result, 4);
    }

    #[test]
    fn this_test_fails() {
        // Calling panic! makes the test fail; useful to see failure output.
        panic!("Make this test fail");
    }
}`,
        },
      ],
    },
    {
      heading: 'Asserting results: assert, assert_eq, and assert_ne',
      body: `Most tests need to *check a condition* and panic if it is not met. Rust provides three macros for this in the standard library prelude, so you do not need to import them.

### assert!

The **assert!** macro takes a single expression that must evaluate to a bool. If it is true the test continues; if it is false the macro calls panic! and the test fails. Use assert! when the thing you are checking is naturally a boolean, for example that a larger rectangle can hold a smaller one.

### assert_eq! and assert_ne!

**assert_eq!** checks that two values are equal and **assert_ne!** checks that they are not equal. You could write these with assert! and the == or != operators, but the dedicated macros are better because when they fail they **print both values** so you can immediately see what went wrong. With a plain assert! you only learn that the condition was false, not what the two operands were.

Two technical requirements that trip people up:
- The values being compared must implement the **PartialEq** trait (to compare them) and the **Debug** trait (to print them on failure). For your own structs and enums, the easy fix is to add **#[derive(PartialEq, Debug)]** to the type. If you forget Debug, the error message is about Debug not being satisfied, which confuses beginners who think they only need equality.
- The order of arguments does not matter to correctness. In many languages there is an expected-versus-actual convention; in Rust the failure output labels them "left" and "right" rather than "expected" and "actual", so do not over-think which goes first.

### Custom failure messages

All three macros accept extra arguments after the required ones. Those extra arguments are passed straight to **format!**, so you can build a message with placeholders. This is invaluable for explaining *why* a failure matters or for printing context that is not part of the compared values.`,
      code: [
        {
          lang: 'rust',
          src: `#[derive(Debug)]      // needed so a failed assert_eq! can print the value
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}

pub fn greeting(name: &str) -> String {
    format!("Hello {name}!")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn larger_can_hold_smaller() {
        let larger = Rectangle { width: 8, height: 7 };
        let smaller = Rectangle { width: 5, height: 1 };
        assert!(larger.can_hold(&smaller));     // bool condition
    }

    #[test]
    fn two_plus_two() {
        assert_eq!(2 + 2, 4);                   // prints left/right on failure
        assert_ne!(2 + 2, 5);
    }

    #[test]
    fn greeting_contains_name() {
        let result = greeting("Carol");
        // Custom message formatted with format! semantics.
        assert!(
            result.contains("Carol"),
            "Greeting did not contain name, value was: {result}"
        );
    }
}`,
        },
      ],
    },
    {
      heading: 'Checking for panics with should_panic',
      body: `Sometimes correct behavior is *that the code panics*, for example a constructor that rejects invalid input. The **#[should_panic]** attribute, placed after #[test], inverts the pass condition: the test passes if the body panics and fails if it returns normally.

### The imprecision problem and the expected parameter

Plain should_panic is blunt. The test passes if *any* panic occurs, even one for a completely different reason than you intended (a typo, an unwrap on the wrong line, an index out of bounds). That can make a test pass for the wrong reason and silently stop guarding what you care about.

To tighten it, add an **expected** substring: write should_panic with expected set to a fragment of the message. Now the test only passes if the panic message *contains* that substring. This pins the test to the specific failure path. Choose the substring carefully: too specific and the test breaks every time you reword a message; too vague and you lose the precision benefit. A short, stable fragment of the message is the sweet spot.

### Ordering and pitfalls

- The order is #[test] then #[should_panic]; both attributes are required for a should_panic test.
- should_panic gives you no way to inspect *where* the panic happened, only that one happened (and optionally that the message matched). For richer checks, prefer returning Result, covered next.
- A test that uses should_panic but whose code path can no longer panic will start failing, which is a useful signal that you removed a guard.`,
      code: [
        {
          lang: 'rust',
          src: `pub struct Guess {
    value: i32,
}

impl Guess {
    pub fn new(value: i32) -> Guess {
        if value < 1 {
            panic!("Guess value must be >= 1, got {value}.");
        } else if value > 100 {
            panic!("Guess value must be <= 100, got {value}.");
        }
        Guess { value }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic]
    fn rejects_anything_out_of_range() {
        Guess::new(200);     // passes because some panic occurs
    }

    #[test]
    #[should_panic(expected = "must be <= 100")]
    fn rejects_too_large_specifically() {
        // Only passes if the panic message contains the substring,
        // pinning the test to the upper-bound branch.
        Guess::new(200);
    }
}`,
        },
      ],
    },
    {
      heading: 'Tests that return Result',
      body: `A test function may return **Result<(), E>** instead of returning nothing. With this form the test passes when it returns **Ok of the unit value** and fails when it returns an **Err** value. This is a second way to make a test fail that does not rely on panicking.

### Why this is useful

The big payoff is the **question-mark operator**. Inside a Result-returning test you can use **?** to short-circuit on any operation that itself returns a Result. If any step yields an Err, the ? propagates it and the whole test fails with that error, instead of forcing you to unwrap or expect every fallible call. This makes tests for chains of fallible operations far more readable, and the failure carries the underlying error value.

### The important caveats

- You **cannot** use **#[should_panic]** on a test that returns Result. The two mechanisms for signaling failure are mutually exclusive. If you want to assert that an operation returns an Err, do not use should_panic; instead check the value directly, for example with **assert!(value.is_err())**, and return the unit Ok value yourself.
- Returning Err is how you fail; do not also call assert macros expecting them to interact with the Result. They still work (they panic), but mixing styles is confusing.
- The error type E only needs to be something the test harness can display, so types like Box<dyn Error> or String are common choices.`,
      code: [
        {
          lang: 'rust',
          src: `#[cfg(test)]
mod tests {
    #[test]
    fn it_works() -> Result<(), String> {
        let result = 2 + 2;
        if result == 4 {
            Ok(())                // returning Ok(()) means the test passed
        } else {
            Err(String::from("two plus two did not equal four"))
        }
    }

    // The ? operator shines when several steps can each fail.
    #[test]
    fn parses_and_adds() -> Result<(), std::num::ParseIntError> {
        let a: i32 = "10".parse()?;   // any Err here fails the test
        let b: i32 = "20".parse()?;
        assert_eq!(a + b, 30);
        Ok(())
    }
}`,
        },
      ],
    },
    {
      heading: 'Controlling how tests run',
      body: `**cargo test** compiles a test binary and runs it. Crucially there are two sets of command-line arguments separated by a bare **--**: arguments before -- go to cargo test itself, and arguments after -- go to the generated test binary. Mixing these up is the single most common confusion with this command.

### Parallelism and captured output

By default tests run **in parallel** across multiple threads, which is fast but means tests must not depend on each other or on shared mutable state such as a file at a fixed path. If two tests write the same file, parallel execution can make them clobber each other. The fix when you truly need serial execution is to limit threads:
- Run single-threaded with: cargo test -- --test-threads=1

By default the runner also **captures the standard output** of passing tests and only shows it for failing tests, to keep the report clean. If you want to see println output even from tests that pass, use: cargo test -- --show-output.

### Selecting which tests to run

- Pass a name to run a single test by exact function name: cargo test it_works.
- Pass a substring to run every test whose name *contains* it (a filter, not an exact match): cargo test add will run add_two, add_three, and so on. The module path is part of the name, so you can target a whole module by its path prefix.
- You cannot pass multiple separate names this way; you pass one filter string.

### Ignoring expensive tests

Annotate a test with **#[ignore]** (after #[test]) to skip it in the normal run. Then run only the ignored ones with cargo test -- --ignored, or run everything including ignored with cargo test -- --include-ignored. This is the idiomatic way to keep slow integration or networked tests out of the fast feedback loop while still being able to run them on demand or in CI.`,
      code: [
        {
          lang: 'rust',
          src: `#[cfg(test)]
mod tests {
    #[test]
    fn cheap_and_fast() {
        assert_eq!(1 + 1, 2);
    }

    #[test]
    #[ignore]   // skipped by default; run with: cargo test -- --ignored
    fn expensive_computation() {
        // imagine a slow or networked operation here
        assert!(true);
    }
}

// Useful invocations (run in a shell, shown here as comments):
//   cargo test                      run all non-ignored tests, in parallel
//   cargo test cheap                run tests whose name contains "cheap"
//   cargo test -- --test-threads=1  run serially (no shared-state races)
//   cargo test -- --show-output     print stdout even for passing tests
//   cargo test -- --ignored         run ONLY the #[ignore] tests
//   cargo test -- --include-ignored run everything, ignored included`,
        },
      ],
    },
    {
      heading: 'Unit tests, cfg(test), and testing private functions',
      body: `Rust distinguishes two categories of tests by purpose and location. **Unit tests** are small, focused, and live *inside* the same file as the code they exercise, typically in a child module named tests at the bottom of the file. **Integration tests** live in a separate tests directory and are covered in the next section.

### The cfg(test) gate and why it matters

The conventional unit-test module is annotated with **#[cfg(test)]**. cfg means configuration; this attribute tells the compiler to **only compile the annotated item when building in test configuration**, that is, during cargo test and not during cargo build. The why is twofold: your test code and any helper functions are excluded from the compiled artifact you ship (no dead weight, no slower compile for normal builds), and test-only dependencies do not leak into release binaries. Forgetting cfg(test) is a real mistake because your test helpers would then ship in production and could even fail to compile for end users who lack dev-dependencies.

### use super of everything

Inside the tests module you almost always write **use super::*;**. The tests module is a child module, so it does not automatically see the items defined in its parent. super refers to the parent module, and the glob brings everything from the parent into scope so the tests can call it without long paths.

### Testing private functions

This is a place where Rust differs from languages with strict public-only testing. Because the tests module is a *child* of the module containing your code, Rust's privacy rules let a child module access the **private** items of its ancestors. So you can call and test private functions directly from the unit-test module, no special visibility hack required. Whether you *should* test private functions is a design debate, but Rust does not stand in your way, and for tricky internal logic it is often pragmatic.`,
      code: [
        {
          lang: 'rust',
          src: `pub fn add_two(a: i32) -> i32 {
    // public API delegates to a private helper
    internal_adder(a, 2)
}

// Private: not visible outside this module's tree...
fn internal_adder(left: i32, right: i32) -> i32 {
    left + right
}

#[cfg(test)]            // only compiled for cargo test, not cargo build
mod tests {
    use super::*;       // bring parent items (incl. private) into scope

    #[test]
    fn public_api_works() {
        assert_eq!(add_two(2), 4);
    }

    #[test]
    fn can_test_a_private_function() {
        // ...yet the child tests module CAN call the private helper.
        assert_eq!(internal_adder(2, 2), 4);
    }
}`,
        },
      ],
    },
    {
      heading: 'Integration tests in the tests directory',
      body: `Integration tests verify that the *public* parts of your library work together correctly when used the way an external consumer would use them. They live in a top-level **tests** directory, a sibling of src, that Cargo treats specially.

### How they differ from unit tests

- **Each file in tests is compiled as its own separate crate.** That is the key mental model. An integration test file is an entirely external user of your library, so it can only call the **public API** (no access to private functions, unlike unit tests). This is exactly what you want for integration coverage: it proves your public surface is usable.
- Because each file is an external crate, you must bring your library into scope with a use statement that names your crate, for example use adder followed by the path to the item, where adder is your crate's name. There is no cfg(test) needed on these files; Cargo only compiles the tests directory under cargo test anyway, and the functions still carry #[test].

### Running and reading the output

cargo test runs unit tests, then integration tests, then doctests, each in its own section of the output. You can run one integration file with **cargo test --test integration_test** (the file name without the .rs extension). If your library is a binary-only crate with just src/main.rs and no src/lib.rs, you cannot write integration tests against it, because there is no library crate to import; this is a strong reason to put logic in lib.rs and keep main.rs thin.

### Shared helper code and the submodule trick

A naive helper file like tests slash common.rs would itself be compiled as a test crate and show up as an empty test section in the output, which is noisy and confusing. The idiomatic fix is to use the older module-file convention: put shared code in **tests/common/mod.rs**. Files in subdirectories of tests are *not* treated as standalone test crates, so common/mod.rs becomes a plain shared module you can pull in with **mod common;** from each integration file, without polluting the test report.`,
      code: [
        {
          lang: 'rust',
          src: `// File: tests/integration_test.rs  (a separate crate from your library)
use adder::add_two;     // must import the PUBLIC API by crate name

mod common;             // pulls in tests/common/mod.rs (a shared helper module)

#[test]
fn it_adds_two_from_outside() {
    common::setup();    // shared setup that does NOT show up as its own test
    let result = add_two(2);
    assert_eq!(result, 4);
}

// ---------------------------------------------------------------
// File: tests/common/mod.rs  (NOT compiled as its own test crate
// because it lives in a subdirectory, so no empty section appears)
pub fn setup() {
    // e.g. create fixtures, seed data, etc.
}

// Run just this file with: cargo test --test integration_test`,
        },
      ],
    },
  ],
  takeaways: [
    'A test is a function marked #[test]; it passes by returning and fails by panicking, and each test runs in its own thread.',
    'Use assert! for boolean conditions, assert_eq!/assert_ne! for value comparisons (they print both sides on failure).',
    'Types compared with assert_eq!/assert_ne! must derive PartialEq and Debug; add #[derive(PartialEq, Debug)].',
    'All assert macros take optional trailing arguments that are formatted like format! for custom failure messages.',
    'Use #[should_panic] to assert that code panics, and prefer the expected = "..." form to pin it to the right panic.',
    'A test can return Result<(), E>: Ok of unit passes, Err fails, and ? propagates errors cleanly; should_panic cannot be combined with this.',
    'Tests run in parallel by default; use -- --test-threads=1 for serial runs and -- --show-output to see stdout from passing tests.',
    'Unit tests live in a #[cfg(test)] mod tests with use super of everything; this gates them out of release builds and lets them reach private functions.',
    'Integration tests live in the tests directory; each file is a separate crate that can only call the public API, and shared helpers go in tests/common/mod.rs.',
  ],
  cheatsheet: [
    { label: '#[test]', value: 'Marks a function as a test run by cargo test' },
    { label: 'assert!(cond)', value: 'Fails (panics) if cond is false' },
    { label: 'assert_eq!(a, b)', value: 'Fails if a != b; prints both on failure' },
    { label: 'assert_ne!(a, b)', value: 'Fails if a == b; prints both on failure' },
    { label: '#[derive(PartialEq, Debug)]', value: 'Required to use a type with assert_eq!/assert_ne!' },
    { label: '#[should_panic(expected = ...)]', value: 'Passes only if body panics with matching message' },
    { label: 'Result<(), E> test', value: 'Test passes on Ok of unit, fails on Err; enables ?' },
    { label: '#[ignore]', value: 'Skip this test unless --ignored is passed' },
    { label: 'cargo test name', value: 'Run tests whose name contains the filter string' },
    { label: 'cargo test -- --test-threads=1', value: 'Run tests serially instead of in parallel' },
    { label: 'cargo test -- --show-output', value: 'Show stdout even from passing tests' },
    { label: 'cargo test -- --ignored', value: 'Run only the tests marked #[ignore]' },
    { label: '#[cfg(test)] mod tests', value: 'Unit-test module compiled only under cargo test' },
    { label: 'tests/ directory', value: 'Integration tests; each file is a separate crate, public API only' },
  ],
}

export default note
