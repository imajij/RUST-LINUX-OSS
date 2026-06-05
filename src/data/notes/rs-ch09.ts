import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-rs-09',
  track: 'rust',
  chapter: 9,
  title: 'Error Handling',
  summary: `Rust splits failure into two honest categories and refuses to let you ignore either one. Unrecoverable bugs trigger a panic that unwinds or aborts the thread, while expected, recoverable failures are returned as values of the Result type so the type system forces the caller to confront them. This chapter teaches panic, Result, the unwrap and expect shortcuts, the question-mark operator for propagating errors cleanly, and the engineering judgment of when each is appropriate. For anyone contributing to robust systems software, getting this right is the difference between a library people trust and one that crashes in production.`,
  sections: [
    {
      heading: 'Two kinds of failure, and why Rust separates them',
      body: `Most languages lump all failure together into exceptions that can be thrown from anywhere and caught somewhere far away, or worse, into a single integer return code that is trivially ignored. Rust deliberately rejects both. It draws a hard line between two fundamentally different situations, and that line is the key to the whole chapter.

The first kind is an *unrecoverable* error: a state your program should never reach, a violated invariant, a bug. Reading past the end of an array, dividing by a value you proved non-zero, or hitting a branch you documented as impossible. There is no sensible local recovery, so the program should stop loudly and immediately. Rust expresses this with the panic mechanism.

The second kind is a *recoverable* error: a failure that is a normal, expected part of operation. A file that does not exist, a network timeout, malformed user input, a number that will not parse. The calling code can reasonably decide what to do: retry, fall back to a default, ask again, or report and continue. Rust expresses this with the Result type, an ordinary value returned from the function.

The deep reason for the split is that the two demand opposite ergonomics. Bugs should be impossible to ignore and should surface a backtrace. Expected failures should be cheap to handle, visible in the function signature, and propagated explicitly. By making recoverable errors plain values rather than invisible control flow, Rust guarantees that a caller cannot forget a failure path, because the type will not let them.`,
    },
    {
      heading: 'panic! and unrecoverable errors',
      body: `When your code reaches a state that should be impossible, you call the panic macro. It prints a failure message and the source location, then by default *unwinds* the stack, walking back up through every active function and running the destructor for each value so heap allocations and locks are released cleanly, before terminating the current thread. Some panics come from the standard library itself rather than your code, for example indexing a vector out of bounds.

Unwinding has a cost: the compiler must emit cleanup code along every path. For a smaller binary you can switch to *abort* in the release profile of Cargo.toml, which skips unwinding entirely and lets the operating system reclaim memory. The Linux kernel and many embedded targets cannot unwind at all, so abort-style behavior is the norm there.

To debug a panic, set the environment variable RUST_BACKTRACE to 1 before running. You then get a list of every function call that led to the panic, read from the top down, which usually points straight at the line where your assumption broke. This is your first tool when a contribution fails a test with a panic.

A critical mental note: a panic is not for handling expected errors. If you find yourself wrapping a panic in logic that tries to recover from it, you have chosen the wrong tool and should be returning a Result instead. Panics are for bugs, full stop.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    // Explicit panic: assert an invariant you believe holds.
    let config_loaded = false;
    if !config_loaded {
        panic!("config must be loaded before startup");
    }

    // A panic from the standard library: index out of bounds.
    let v = vec![1, 2, 3];
    let _ = v[99]; // panics: index out of bounds: the len is 3 but the index is 99
}

// Run with a backtrace to see the full call chain:
//   RUST_BACKTRACE=1 cargo run`,
        },
      ],
    },
    {
      heading: 'The Result type: failure as a value',
      body: `Recoverable errors are modeled with an enum defined in the standard library and brought in by the prelude:

> enum Result with two variants, Ok holding a success value of type T, and Err holding an error value of type E.

A function that can fail returns Result of T and E. The success path carries the value you wanted in Ok, and the failure path carries a description of what went wrong in Err. Because Result is a regular enum, the only way to get at the inner value is to acknowledge both variants, classically with a match. The compiler will not let you treat an Ok and an Err the same way, so you cannot accidentally use a value that was never produced.

This is the single most important habit to build: when a standard-library or crate function returns a Result, the failure case is part of the contract, and you must decide what to do with it right there. You can match on it, you can extract it with a combinator, or you can propagate it upward, but you cannot silently drop it. Rust even warns when you discard a Result without using it.

A common refinement is to match not just on Ok versus Err but on the *kind* of error inside. The standard library io error carries a kind method returning an enum like NotFound or PermissionDenied, letting you recover differently per case, for example creating a file when it was merely missing while still failing hard on a permissions problem.`,
      code: [
        {
          lang: 'rust',
          src: `use std::fs::File;
use std::io::ErrorKind;

fn main() {
    let result = File::open("hello.txt"); // returns Result<File, std::io::Error>

    let file = match result {
        Ok(f) => f,
        Err(error) => match error.kind() {
            // Recover from "not found" by creating the file.
            ErrorKind::NotFound => match File::create("hello.txt") {
                Ok(created) => created,
                Err(e) => panic!("could not create file: {e:?}"),
            },
            // Any other error is unexpected here: fail loudly.
            other => panic!("problem opening file: {other:?}"),
        },
    };

    println!("file handle ready: {file:?}");
}`,
        },
      ],
    },
    {
      heading: 'Shortcuts: unwrap, expect, and their honest cost',
      body: `Writing a full match for every Result quickly becomes noisy, so Result provides two methods that collapse the happy path. The unwrap method returns the inner value if the Result is Ok, and panics if it is Err. The expect method does the same but lets you supply your own panic message, which is almost always the better choice because that message tells the next person exactly which assumption failed.

The crucial point is that both of these *convert a recoverable error into an unrecoverable panic*. You are telling the compiler and your reader: I am certain this cannot fail here, and if it does, that is a bug worth crashing for. That is a legitimate and useful statement, but only when it is true. Sprinkling unwrap everywhere to silence the type checker is the most common way new Rustaceans write fragile code, and reviewers on serious projects will push back on it.

There is a strong convention in the community: prefer expect over unwrap, and write the expect message as the *reason you believe the value is present*, not a restatement of the error. A message like "hardcoded address should always parse" documents an invariant; a message like "failed to parse" tells the reader nothing they could not already see. In real contributions, an unwrap on a value derived from external input is a red flag, while an expect on a compile-time constant is perfectly idiomatic.

Two related methods round out the toolkit. unwrap_or returns a fallback value instead of panicking on Err, and unwrap_or_else takes a closure to compute the fallback lazily. These keep you on the recoverable path when a sensible default exists.`,
      code: [
        {
          lang: 'rust',
          src: `use std::net::IpAddr;

fn main() {
    // expect with a message that states the invariant, not the failure.
    let home: IpAddr = "127.0.0.1"
        .parse()
        .expect("hardcoded loopback address should always parse");
    println!("{home}");

    // unwrap_or supplies a fallback instead of panicking.
    let port: u16 = "not_a_number".parse().unwrap_or(8080);
    println!("port = {port}"); // 8080

    // unwrap_or_else computes the fallback lazily with a closure.
    let count: u32 = "".parse().unwrap_or_else(|_| 0);
    println!("count = {count}");
}`,
        },
      ],
    },
    {
      heading: 'Propagating errors and the ? operator',
      body: `Often the function that hits an error is not the right place to decide what to do about it. The idiomatic move is to *propagate* the error to the caller, who has more context. The verbose way is to match on each Result and return the Err early, which works but buries your logic under boilerplate.

The question-mark operator is the cure. Placing a question mark after a Result-returning expression means: if this is Ok, unwrap the value and continue; if it is Err, return that Err from the enclosing function immediately. It is early-return-on-error compressed into one character, and it is everywhere in real Rust code.

There is a subtle, powerful detail. When the question mark returns an Err, it first passes the error through the From conversion trait. This means the error type inside the Err can be *automatically converted* into the error type your function declares, as long as such a conversion exists. That is how one function can call several different fallible operations whose errors all funnel into a single shared error type, which is the backbone of clean library error handling. Combined with a boxed trait-object error type, the question mark lets a function bubble up many distinct error kinds with no manual conversion at all.

The hard rule that trips people up: the question mark can only be used in a function whose return type can absorb the early return. For a Result-returning expression, the enclosing function must itself return a Result whose error type the From trait can reach. You cannot use the question mark to magically discard an error in a function that returns a plain value.`,
      code: [
        {
          lang: 'rust',
          src: `use std::fs::File;
use std::io::{self, Read};

// Verbose propagation: match and return Err by hand.
fn read_username_verbose() -> Result<String, io::Error> {
    let mut file = match File::open("user.txt") {
        Ok(f) => f,
        Err(e) => return Err(e),
    };
    let mut name = String::new();
    match file.read_to_string(&mut name) {
        Ok(_) => Ok(name),
        Err(e) => Err(e),
    }
}

// Same logic with ? : each error short-circuits and returns early.
fn read_username() -> Result<String, io::Error> {
    let mut name = String::new();
    File::open("user.txt")?.read_to_string(&mut name)?;
    Ok(name)
}

// The standard library already provides this as one call:
fn read_username_shortest() -> Result<String, io::Error> {
    std::fs::read_to_string("user.txt")
}`,
        },
      ],
    },
    {
      heading: 'The ? operator on Option, and main returning Result',
      body: `The question mark is not limited to Result. It also works on Option, where the rule is symmetric: if the value is Some, the inner value is unwrapped and execution continues; if it is None, the enclosing function returns None immediately. This lets you chain a sequence of operations that each might be absent without a pyramid of nested matches, which is wonderful for things like walking optional fields or doing lookups that may miss.

The constraint mirrors the Result case and is just as strict: a question mark on an Option requires the enclosing function to return an Option. You cannot mix the two in a single function with a bare question mark, because the early-return type would not match. If you need to bridge between them, methods like ok_or convert an Option into a Result by attaching an error for the None case, and ok converts a Result into an Option by discarding the error.

Even the main function can return a Result. When main returns Result of a unit value and a boxed error type, you may use the question mark directly inside main, and any propagated error will cause the program to exit with a non-zero status code after printing the error using its Debug representation. Under the hood this works through a trait that defines how a return value maps to a process exit code, where Ok maps to success and Err maps to failure. This is the cleanest way to write a small command-line tool: every fallible step uses a question mark, and a failure anywhere produces a tidy non-zero exit instead of a hand-rolled error dance.`,
      code: [
        {
          lang: 'rust',
          src: `// ? on Option: returns None early if any step is absent.
fn last_char_of_first_line(text: &str) -> Option<char> {
    text.lines().next()?.chars().last()
}

// Bridging Option and Result with ok_or.
fn parse_first(numbers: &str) -> Result<i32, String> {
    let first = numbers
        .split_whitespace()
        .next()
        .ok_or_else(|| "input was empty".to_string())?; // Option -> Result
    first.parse::<i32>().map_err(|e| e.to_string())
}

// main returning Result lets you use ? at the top level.
use std::error::Error;
use std::fs::File;

fn main() -> Result<(), Box<dyn Error>> {
    let _file = File::open("config.toml")?; // any error exits non-zero
    println!("opened config");
    Ok(())
}`,
        },
      ],
    },
    {
      heading: 'When to panic and when to return Result',
      body: `This is the judgment call that separates competent Rust from idiomatic Rust, and reviewers care about it deeply. The default, conservative choice is to return a Result, because that hands the decision to the caller and keeps your code reusable in contexts you did not foresee. Returning a Result is reversible at the call site; a panic is not.

Reach for a panic, or for unwrap and expect, when one of these holds. First, in examples, prototypes, and tests, where robust handling would obscure the point and a failed test *should* panic to mark the failure. Second, when you have information the compiler lacks that guarantees success, such as parsing a string literal you wrote yourself, where an expect documents your reasoning. Third, and most importantly, when continuing would leave your program in a *bad state*: an invariant is broken, a contract was violated, or proceeding could corrupt data or open a security hole. A bad state that should be impossible is exactly what a panic is for.

By contrast, return a Result whenever failure is an expected possibility that calling code might want to handle: anything touching the file system, the network, the environment, or untrusted input. A parser fed malformed bytes has not encountered a bug; bad input is its normal diet, so it returns an error.

There is also a safety dimension. When your function has a *contract*, a precondition callers must uphold, and violating it could trigger undefined behavior or a security vulnerability, panicking on the violation is the right call. The standard library does exactly this: indexing out of bounds panics rather than returning garbage, because reading invalid memory would be far worse than crashing. As a contributor to systems software, you will internalize that a loud crash is almost always safer than silent corruption.`,
      code: [
        {
          lang: 'rust',
          src: `// Expected failure -> return Result. Bad input is normal here.
fn parse_age(input: &str) -> Result<u8, String> {
    input
        .trim()
        .parse::<u8>()
        .map_err(|_| format!("not a valid age: {input}"))
}

// Invariant violation -> panic. This index is computed and must be valid.
fn middle_element(slice: &[i32]) -> i32 {
    assert!(!slice.is_empty(), "middle_element requires a non-empty slice");
    slice[slice.len() / 2] // safe: we just guaranteed non-empty
}

// Compile-time constant -> expect documents why it cannot fail.
fn default_timeout_ms() -> u64 {
    "5000".parse().expect("default timeout literal must be a valid u64")
}`,
        },
      ],
    },
    {
      heading: 'Validation with newtypes: making invalid states unrepresentable',
      body: `The most powerful error-handling technique is to stop errors from existing at all. If many functions accept a value that must satisfy some rule, validating it in every one of them is repetitive and easy to forget. Instead, create a *newtype*: a thin struct that wraps the raw value and can only be constructed through a checked function. Once a value of that type exists, the rest of your code can trust it unconditionally.

The pattern has three parts. Make the wrapped field private so outside code cannot build an instance directly. Provide an associated constructor, conventionally named new, that performs the validation and either panics or, better for libraries, returns a Result. Provide a getter that lends out the validated inner value. Now the type itself is a *proof* that the rule holds, and every function that takes the newtype gets that guarantee for free with no defensive checks.

This is the idea behind making invalid states unrepresentable, and it is one of the highest-leverage habits in Rust. A function that accepts a Guess between one and a hundred should take a Guess, not a raw integer, so the validation happens once at the boundary and the type system carries the proof everywhere afterward. You will see this throughout high-quality crates and kernel-adjacent Rust: parse and validate at the edges, then work with strongly typed, already-correct values in the core. It turns a class of runtime bugs into compile-time impossibilities.`,
      code: [
        {
          lang: 'rust',
          src: `pub struct Guess {
    value: i32, // private: cannot be set from outside the module
}

impl Guess {
    // Library style: return a Result so callers choose how to handle bad input.
    pub fn new(value: i32) -> Result<Guess, String> {
        if value < 1 || value > 100 {
            return Err(format!("guess must be 1..=100, got {value}"));
        }
        Ok(Guess { value })
    }

    // Controlled read access to the validated inner value.
    pub fn value(&self) -> i32 {
        self.value
    }
}

fn main() {
    match Guess::new(42) {
        // Past this point, every Guess is guaranteed in range.
        Ok(g) => println!("valid guess: {}", g.value()),
        Err(e) => println!("rejected: {e}"),
    }
}`,
        },
      ],
    },
  ],
  takeaways: [
    'Rust splits failure into unrecoverable bugs (panic) and recoverable, expected errors (Result), and the type system makes the recoverable kind impossible to ignore.',
    'panic unwinds the stack by default (running destructors) or can abort for smaller binaries; set RUST_BACKTRACE=1 to see the call chain that led to the crash.',
    'Result is an enum with Ok(T) and Err(E); match on it, or inspect the error kind to recover differently per case, but never silently drop it.',
    'unwrap and expect convert a recoverable Err into a panic, so use them only when you are certain success holds; prefer expect with a message stating the invariant.',
    'The ? operator unwraps Ok and early-returns Err, applying a From conversion so several error types can funnel into one shared error type.',
    'The ? operator also works on Option (early-returns None), and the enclosing function must return the matching type; ok_or and ok bridge between Option and Result.',
    'main can return Result<(), Box<dyn Error>>, letting you use ? at the top level; an Err exits with a non-zero status after printing its Debug form.',
    'Default to returning Result so the caller decides; panic only for bugs, broken invariants, contract violations, or in tests, examples, and on compile-time constants.',
    'Wrap rule-constrained values in a newtype with a private field and a checked constructor so the type itself proves validity and downstream code needs no defensive checks.',
  ],
  cheatsheet: [
    { label: 'panic!("msg")', value: 'Crash the thread for an unrecoverable bug; unwinds or aborts' },
    { label: 'RUST_BACKTRACE=1', value: 'Env var to print the full call chain on a panic' },
    { label: 'Result<T, E>', value: 'Enum with Ok(T) for success, Err(E) for recoverable failure' },
    { label: 'r.unwrap()', value: 'Return the Ok value or panic on Err (no custom message)' },
    { label: 'r.expect("why")', value: 'Like unwrap but panic with your message; prefer this' },
    { label: 'r.unwrap_or(d)', value: 'Return Ok value or fallback d instead of panicking' },
    { label: 'r.unwrap_or_else(f)', value: 'Return Ok value or compute fallback lazily with closure f' },
    { label: 'expr?', value: 'Unwrap Ok/Some or early-return the Err/None from the function' },
    { label: '? with From', value: 'Auto-converts the Err type into the function error type' },
    { label: 'opt.ok_or(e)', value: 'Turn Option into Result, using e for the None case' },
    { label: 'res.ok()', value: 'Turn Result into Option, discarding the error' },
    { label: 'fn main() -> Result', value: 'Return Result<(), Box<dyn Error>> to use ? in main' },
    { label: 'error.kind()', value: 'Inspect an io::Error to match NotFound, PermissionDenied, etc.' },
    { label: 'newtype + new()', value: 'Private field plus checked constructor proves a value is valid' },
  ],
}

export default note
