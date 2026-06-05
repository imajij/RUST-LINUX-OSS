import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-rs-02',
  track: 'rust',
  chapter: 2,
  title: 'Programming a Guessing Game',
  summary: `This chapter builds a complete, interactive program: the computer picks a secret number and you guess until you get it right. Along the way you touch most of the everyday tools of Rust at once - reading from standard input, mutable variables and references, parsing strings into numbers, pattern matching on an enum, looping, error handling with Result, and pulling in an external crate. Nothing here is covered to its full depth yet, but seeing all the pieces cooperate gives you the working vocabulary you need to read real Rust code and start contributing to open source projects.`,
  sections: [
    {
      heading: 'Setting up the project and reading a line of input',
      body: `Start by creating a new binary project with Cargo. Cargo generates a src directory with a main.rs that prints "Hello, world!", plus a Cargo.toml manifest. You will replace the body of main as you go.

To get a number from the player you first need to read text from the keyboard. Standard input lives in the **std::io** module. The standard library prelude (the small set of names automatically in scope in every program) does NOT include the input/output traits and types, so you bring them in with a use statement at the top of the file. Bringing std::io into scope lets you call io::stdin().

### The shape of reading input

1. Allocate a place to store what the user types. A String is a growable, heap-allocated, UTF-8 text buffer, and you start with an empty one from String::new.
2. Call io::stdin to get a handle to the terminal's standard input stream.
3. Call read_line on that handle, passing a *mutable reference* to your String. read_line appends whatever the user types (including the trailing newline) onto the end of the string - it does not overwrite it.
4. read_line returns a Result that you must deal with; more on that below.

### Why a reference, and why mutable

read_line needs to write the typed text somewhere. Rather than return a new string, it takes a reference to an existing buffer and fills it in. A reference lets the function reach the same memory you own without taking ownership of it, so your variable is still usable afterward. The reference must be mutable because the function changes the buffer's contents.

> Common pitfall: forgetting the use std::io line, or forgetting the ampersand-mut on the argument. The compiler error messages here are friendly and will tell you exactly what is missing - read them, they are part of how you learn Rust.`,
      code: [
        {
          lang: 'rust',
          src: `// Shell: cargo new guessing_game  then  cd guessing_game

use std::io;

fn main() {
    println!("Guess the number!");
    println!("Please input your guess.");

    let mut guess = String::new();

    io::stdin()
        .read_line(&mut guess)
        .expect("Failed to read line");

    println!("You guessed: {guess}");
}`
        }
      ]
    },
    {
      heading: 'let, mut, and references',
      body: `Variables in Rust are **immutable by default**. The line let mut guess = String::new() does three things: let introduces a new binding, mut opts that binding into mutability, and the right-hand side constructs an empty String to bind it to. Without mut, guess could never have new characters appended to it and read_line would refuse to compile.

Immutability by default is a deliberate design choice, not a nuisance. It means that when you see a plain let with no mut, you can trust the value will not change out from under you - a property that makes code far easier to reason about and is one of the foundations of Rust's data-race-free concurrency. You add mut only where mutation is genuinely needed, which documents intent.

### Associated functions

String::new is an *associated function* of the String type: a function attached to the type itself rather than to a particular value (other languages often call this a static method). The double-colon path syntax means "the new function that belongs to String". You will see this pattern constantly - Vec::new, HashMap::new, and so on.

### References at a glance

When you write ampersand-mut guess you are creating a mutable reference: a borrow of the value that lets a function read and modify it without owning it. References, like variables, are immutable by default, which is why you must write ampersand-mut and not just ampersand to allow modification. Ownership and borrowing get a full treatment in chapter 4; for now the rule of thumb is that a reference lets you hand out access to your data without giving it away.`,
      code: [
        {
          lang: 'rust',
          src: `let apples = 5;          // immutable: this binding can never be reassigned
let mut bananas = 5;     // mutable: bananas can be changed later
bananas = 6;             // fine

// apples = 6;           // ERROR: cannot assign twice to immutable variable

let mut guess = String::new();   // mut needed because read_line will modify it

// & is a shared/immutable reference; &mut is a mutable (exclusive) reference.
// read_line's signature wants &mut String so it can append to the buffer.
io::stdin().read_line(&mut guess).expect("Failed to read line");`
        }
      ]
    },
    {
      heading: 'Result and handling failure with expect',
      body: `read_line returns a value of type **Result**, an enum whose variants are Ok and Err. Result encodes the idea that an operation might succeed or might fail, and Rust forces you to acknowledge that possibility - you cannot silently ignore an error the way you can in many languages.

### Why the compiler nags you

Result is marked with an attribute that makes ignoring it a warning. If you call read_line and do nothing with the returned Result, the compiler warns that a possible failure is being thrown away. This is the language steering you toward robust code: every operation that can fail hands you a value you must decide what to do with.

### What expect does

The expect method is the quick-and-dirty way to handle a Result. If the Result is Ok, expect pulls out the success value inside it (for read_line that is the number of bytes read, which we ignore). If the Result is Err, expect crashes the program immediately - it *panics* - and prints the message you passed plus the underlying error.

In a throwaway program or a prototype this is perfectly acceptable. In production code or library code you contribute upstream, you would instead match on the Result, or use the question-mark operator to propagate the error to the caller, both covered in chapter 9. Reviewers on real projects will often ask you to replace a bare expect or unwrap with proper error handling, so know that expect is a placeholder, not a destination.

> Common pitfall: unwrap is the cousin of expect that panics with a generic message. Prefer expect with a sentence that explains what was being attempted - it turns a cryptic crash into a useful clue.`,
      code: [
        {
          lang: 'rust',
          src: `use std::io;

let mut guess = String::new();

// Ignoring the Result triggers a warning:
//   io::stdin().read_line(&mut guess);   // warning: unused Result

// expect: unwrap the Ok value, or panic with this message on Err.
io::stdin()
    .read_line(&mut guess)
    .expect("Failed to read line");

// unwrap is the same idea but with a generic, less helpful panic message:
// io::stdin().read_line(&mut guess).unwrap();`
        }
      ]
    },
    {
      heading: 'Adding the rand crate for a secret number',
      body: `The standard library does not ship a random number generator, so you reach for a *crate* - a package of Rust code - from the community registry at crates.io. The de facto choice is the **rand** crate. This is your first taste of the ecosystem that makes Rust productive, and the workflow you learn here is exactly how you will add any dependency.

### How Cargo pulls it in

You declare the dependency under the dependencies section of Cargo.toml with a version requirement. When you next run cargo build, Cargo reads the manifest, downloads rand and everything rand itself depends on from the registry, compiles them, and links them into your build. Cargo also writes a Cargo.lock file recording the exact versions it chose, so that you and everyone else who builds the project get an identical, reproducible set of dependencies until you deliberately update.

### Semantic versioning

A version string like 0.8.5 in Cargo.toml is shorthand for "at least 0.8.5 and compatible with it". Cargo follows semantic versioning rules to decide what compatible means, so you automatically get bug-fix releases but not breaking changes. Run cargo update to move within the allowed range, and edit the version in Cargo.toml to jump to a new incompatible major line.

### Generating the number

Bring rand's Rng trait into scope - a trait must be in scope for its methods to be callable - then ask for a thread-local generator and call gen_range with an inclusive range. The range 1..=100 covers 1 through 100 inclusive.

> Common pitfall: forgetting use rand::Rng. Without the trait in scope, gen_range is invisible and the compiler reports an unknown method, even though rand is downloaded and the type is correct.`,
      code: [
        {
          lang: 'rust',
          src: `// Cargo.toml (manifest), under [dependencies]:
//   rand = "0.8.5"

use rand::Rng;   // the Rng trait must be in scope to use its methods

fn main() {
    // thread_rng gives a fast generator local to the current thread.
    // gen_range takes a range expression; 1..=100 is inclusive on both ends.
    let secret_number = rand::thread_rng().gen_range(1..=100);

    println!("The secret number is: {secret_number}");
}`
        }
      ]
    },
    {
      heading: 'Parsing input: type conversion and shadowing',
      body: `read_line gives you a String, but you want to compare a number, not text. You convert with the parse method, which reads the characters of a string and produces a number. Because many number types exist, you must tell Rust which one you want by annotating the variable's type; here you choose u32, an unsigned 32-bit integer, which is a sensible type for a small positive guess.

### Trimming the newline

The string from read_line still has the trailing newline (and on Windows a carriage return too) from when the user pressed Enter. parse would choke on that whitespace, so you call trim first to strip leading and trailing whitespace, then parse the cleaned-up text.

### Shadowing

Notice that the new numeric binding reuses the name guess. This is **shadowing**: declaring a fresh variable with the same name as an existing one. The new guess shadows the old String guess from that point on. Shadowing is the idiomatic way to transform a value while keeping a single meaningful name - you avoid inventing guess_str and guess_num. It differs from mut in an important way: shadowing creates a genuinely new variable, so the type is allowed to change (String to u32 here), whereas mut keeps the same variable and therefore the same type.

### parse returns a Result too

Parsing can fail - the user might type "hello" - so parse, like read_line, returns a Result. The quick version calls expect to panic on bad input. The better version matches the Result so a bad guess is ignored instead of crashing, which you will wire into the loop next.

> Common pitfall: writing the type annotation in the wrong place, or omitting it entirely. parse needs to know the target type. You can write it as a let binding annotation (let guess: u32) or with the turbofish on parse itself; the let annotation reads more clearly here.`,
      code: [
        {
          lang: 'rust',
          src: `// guess starts as a String filled by read_line.
let mut guess = String::new();
io::stdin().read_line(&mut guess).expect("Failed to read line");

// Shadowing: a NEW guess, now a u32, computed from the old String guess.
// trim() removes the newline; parse() does the text-to-number conversion.
let guess: u32 = guess.trim().parse().expect("Please type a number!");

// Equivalent style using the turbofish to pin the type on parse instead:
// let guess = guess.trim().parse::<u32>().expect("Please type a number!");

println!("You guessed: {guess}");`
        }
      ]
    },
    {
      heading: 'Comparing with match on cmp::Ordering',
      body: `To compare the guess against the secret number you call the cmp method, which works on any two values that can be ordered and returns a value of the **Ordering** enum from std::cmp. Ordering has exactly three variants: Less, Greater, and Equal. This is a much cleaner model than returning a magic integer like -1, 0, or 1 - the type names the meaning.

### match is exhaustive

A match expression takes a value and compares it against a series of *arms*, running the first arm whose pattern fits. match on an enum is **exhaustive**: the compiler insists you handle every variant. If you forget Equal, the program will not compile. That exhaustiveness is a safety net - when an enum gains a new variant, every match that needs updating becomes a compile error rather than a silent bug, which is invaluable when maintaining a large codebase like the kernel or a major crate.

### Comparing requires matching types

cmp compares a value to another of the same type. This is exactly why you parsed the guess into a u32: comparing a String to an integer is a type error. Once both sides are u32, Rust can even infer the secret number's type from the comparison, which is why secret_number did not need an explicit annotation.

match is an expression, so it produces a value and can be the right-hand side of a let or the body of a function. Here each arm simply prints, but later you will have an arm break out of a loop.`,
      code: [
        {
          lang: 'rust',
          src: `use std::cmp::Ordering;

let secret_number = 42;          // u32, inferred from the comparison below
let guess: u32 = 50;

// cmp returns Ordering::Less / Greater / Equal.
// match must cover all three variants - leaving one out is a compile error.
match guess.cmp(&secret_number) {
    Ordering::Less    => println!("Too small!"),
    Ordering::Greater => println!("Too big!"),
    Ordering::Equal   => println!("You win!"),
}`
        }
      ]
    },
    {
      heading: 'Looping, breaking, and ignoring bad input',
      body: `A guessing game with a single guess is no fun, so you wrap the guess-and-compare logic in a **loop**. The loop keyword starts an infinite loop; you stay in it until something explicitly stops it. The way out is the **break** keyword, which exits the nearest enclosing loop immediately.

### Quitting on a correct guess

Put the loop around everything from reading input down to the comparison. In the Equal arm of the match, after the congratulations message, call break. Now a correct guess prints the win message and falls out of the loop, ending the program cleanly, while Less and Greater simply fall through and the loop runs again.

### Handling invalid input gracefully

The final polish is to stop crashing when the user types something that is not a number. Replace expect on the parse call with a match on its Result. The Ok arm yields the parsed number, binding the inner value with a pattern. The Err arm uses continue to skip the rest of this iteration and prompt again. The underscore in Err(_) is a catch-all pattern that matches any error value without binding it, since here you do not care what the specific error was.

This pattern - match on a Result, take the value on Ok, recover on Err - is the foundation of real Rust error handling. Trading the panic from expect for a continue turns a fragile program into a friendly one, and it is the kind of robustness reviewers expect in contributed code.

> Common pitfall: putting let mut guess = String::new outside the loop. Because read_line appends rather than overwrites, a guess buffer reused across iterations would accumulate every line typed. Create the fresh empty String inside the loop each time, or clear it explicitly.`,
      code: [
        {
          lang: 'rust',
          src: `use rand::Rng;
use std::cmp::Ordering;
use std::io;

fn main() {
    println!("Guess the number!");
    let secret_number = rand::thread_rng().gen_range(1..=100);

    loop {
        println!("Please input your guess.");

        let mut guess = String::new();   // fresh buffer every iteration
        io::stdin()
            .read_line(&mut guess)
            .expect("Failed to read line");

        // Skip non-numbers instead of crashing.
        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };

        println!("You guessed: {guess}");

        match guess.cmp(&secret_number) {
            Ordering::Less    => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("You win!");
                break;
            }
        }
    }
}`
        }
      ]
    }
  ],
  takeaways: [
    'Bring std::io into scope to read input; the prelude does not include it.',
    'Variables are immutable by default - add mut only where a value genuinely changes, which documents intent and underpins safe concurrency.',
    'ampersand-mut passes a mutable reference so a function can modify your data without taking ownership; references are themselves immutable unless you write &mut.',
    'Operations that can fail return Result (Ok/Err); the compiler warns if you ignore it. expect unwraps Ok or panics on Err - fine for prototypes, not for library code.',
    'Add dependencies like rand in Cargo.toml under [dependencies]; Cargo downloads, version-locks via Cargo.lock, and builds them for you.',
    'A trait must be in scope (use rand::Rng) before you can call its methods such as gen_range.',
    'parse converts a String to a number but needs a target type annotation, and trim first to remove the trailing newline.',
    'Shadowing reuses a name with a brand-new binding and can change the type; mut reuses the same binding and keeps the type.',
    'match on cmp::Ordering is exhaustive - handling Less, Greater, and Equal - and loop plus break (and continue) drive the game until the guess is correct.'
  ],
  cheatsheet: [
    { label: 'use std::io;', value: 'bring the input/output module into scope' },
    { label: 'String::new()', value: 'create an empty, growable UTF-8 string buffer' },
    { label: 'io::stdin()', value: 'get a handle to standard input' },
    { label: '.read_line(&mut s)', value: 'append a typed line into s; returns Result' },
    { label: '&mut x', value: 'mutable (exclusive) reference; & alone is shared/immutable' },
    { label: 'let mut x = ...', value: 'mutable binding; plain let is immutable' },
    { label: '.expect("msg")', value: 'unwrap Ok value or panic with msg on Err' },
    { label: '.unwrap()', value: 'like expect but with a generic panic message' },
    { label: 'rand = "0.8.5"', value: 'Cargo.toml dependency line under [dependencies]' },
    { label: 'thread_rng().gen_range(1..=100)', value: 'random number 1..100 inclusive (needs use rand::Rng)' },
    { label: 's.trim().parse::<u32>()', value: 'strip whitespace then convert text to a number; returns Result' },
    { label: 'let x: u32 = ...', value: 'type annotation telling parse which number type to produce' },
    { label: 'std::cmp::Ordering', value: 'enum with Less, Greater, Equal returned by cmp' },
    { label: 'loop { ... break; }', value: 'infinite loop exited with break; continue skips to next iteration' }
  ]
}

export default note
