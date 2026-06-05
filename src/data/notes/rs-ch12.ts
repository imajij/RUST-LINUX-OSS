import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-rs-12',
  track: 'rust',
  chapter: 12,
  title: 'An I/O Project: A Command Line Program',
  summary: `This chapter builds a working command line tool, a simplified clone of the classic grep search utility called minigrep, that reads a query and a file path from the command line and prints matching lines. It is the first time the book stops teaching features in isolation and instead applies them together to a real program, so the emphasis shifts from syntax to engineering judgement: how to structure code so it is testable, readable, and robust. Along the way you practice reading arguments and files, separating concerns into a Config struct and a run function, returning Result instead of panicking, splitting a binary into a thin main and a tested library, doing test-driven development, and respecting environment variables and the two output streams. These are exactly the habits open-source maintainers look for in a contribution.`,
  sections: [
    {
      heading: 'Reading command line arguments',
      body: `A command line program is launched with a list of words: the program name followed by its arguments. Rust hands you those words through a function in the standard environment module that returns an **iterator** over the arguments. You collect that iterator into a vector so you can index into it and inspect what the user typed.

Two details matter from the very start.

First, the **zeroth element is the program name itself**, not the first user argument. The operating system always passes the path used to invoke the binary as argument zero. So the query the user typed is at index one and the file path is at index two. Skipping index zero, or forgetting it exists, is the single most common off-by-one mistake in argument handling.

Second, the function that returns the arguments comes in two forms. The ordinary one panics if any argument contains text that is not valid Unicode. There is a separate variant that yields each argument wrapped so it can represent non-Unicode data, used when you must accept arbitrary bytes such as unusual file paths. For most programs, and for everything in this chapter, the ordinary Unicode-only version is the right choice, and you should reach for the byte-capable variant only when you have a concrete reason.

> Why an iterator rather than a ready-made vector? Because iterators are lazy and composable. Later you will consume the iterator directly instead of collecting it, which removes index juggling and lets the program take ownership of each string rather than cloning it. For now, collecting into a vector is the clearer teaching step.

A subtle annotation point: when you collect an iterator you must usually tell the compiler what collection you want, because collect is generic over many target types. Annotating the binding as a vector of strings is the idiomatic way to do that.`,
      code: [
        {
          lang: 'rust',
          src: `use std::env;

fn main() {
    // Collect the lazy argument iterator into a concrete vector.
    let args: Vec<String> = env::args().collect();

    // args[0] is the program name. The real arguments start at index 1.
    let query = &args[1];
    let file_path = &args[2];

    println!("Searching for: {query}");
    println!("In file: {file_path}");
}

// Run it with:  cargo run -- needle poem.txt
// The two dashes separate cargo's own flags from the program's arguments.`
        }
      ]
    },
    {
      heading: 'Reading the contents of a file',
      body: `Once you know which file to open, reading it is a single call. The standard filesystem module provides a convenience function that takes a path, opens the file, reads it to the end, and returns the entire contents as one owned string, all in one step. It returns a **Result** because the file might not exist, you might lack permission, or the bytes might not be valid text, and the type system forces you to acknowledge that.

For the first draft of the program you simply unwrap or use a temporary panic-on-error call so you can see the program working end to end. That is fine for a throwaway prototype, but it is exactly the kind of thing a reviewer will flag, because it produces an ugly internal panic message that leaks implementation details instead of a clear, user-facing error. Replacing that with proper error handling is a major theme later in the chapter.

A point worth internalizing for systems work: this convenience function reads the **whole file into memory at once**. That is perfectly appropriate for small inputs like configuration files or short documents, and it keeps the example simple. For genuinely large files you would instead open the file and read it incrementally through a buffered reader, processing a line or a chunk at a time, so memory use stays bounded. Knowing when the all-at-once approach stops being acceptable is part of writing production-grade tools.

The contents you read back are owned data: the function allocates a fresh string and gives you ownership of it. That ownership matters later, because the search logic will return references that borrow from this string, and the borrow checker will insist the string outlives those references.`,
      code: [
        {
          lang: 'rust',
          src: `use std::env;
use std::fs;

fn main() {
    let args: Vec<String> = env::args().collect();
    let query = &args[1];
    let file_path = &args[2];

    // read_to_string opens, reads, and returns the whole file as a String.
    // It returns Result; expect panics with our message if it fails.
    let contents = fs::read_to_string(file_path)
        .expect("Should have been able to read the file");

    println!("With text:\\n{contents}");
}`
        }
      ]
    },
    {
      heading: 'Separating concerns and introducing a Config struct',
      body: `The book lays out a recurring problem with growing main functions and a matching set of guidelines, because reviewers and maintainers apply exactly these rules. The trouble with a single function that reads arguments, opens files, and does the work is that responsibilities tangle together, values like the query and the path float around as loose variables, and there is no clear place to validate input. As the program grows this becomes hard to reason about and almost impossible to test.

The remedy has two moves.

**First, split the argument parsing out of main into its own function.** While both stay small this feels like overkill, but doing it early establishes the boundary before complexity arrives.

**Second, group the related configuration values into a struct.** Right now the query and the file path are two separate strings with an implicit relationship. Bundling them into a Config struct makes that relationship explicit and gives the values meaningful names accessed through fields. This is a small but important act of design: it communicates intent. A function signature that takes a Config says more than one that takes two bare strings, and it cannot be called with the two arguments accidentally swapped as easily.

There is a deliberate ownership decision here. The struct **owns** its strings rather than borrowing them. Storing owned strings is the simplest correct choice and avoids tying the Config's lifetime to the original arguments vector through references and lifetime annotations. The cost is a couple of allocations through cloning, which is utterly negligible for a command line program that runs once and exits. The book is explicit that trading a tiny, one-time clone for much simpler code is a sensible engineering call, and learning to make that trade deliberately, rather than reflexively avoiding every clone, is a sign of maturity.

Idiomatically, the parsing function becomes a constructor associated with the struct. Naming it new sets up the next refinement, where new becomes build once it can fail.`,
      code: [
        {
          lang: 'rust',
          src: `use std::env;
use std::fs;

struct Config {
    query: String,
    file_path: String,
}

impl Config {
    // A constructor that turns the raw args into structured config.
    // It clones so the struct owns its strings (simplest correct choice).
    fn new(args: &[String]) -> Config {
        let query = args[1].clone();
        let file_path = args[2].clone();
        Config { query, file_path }
    }
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let config = Config::new(&args);

    let contents = fs::read_to_string(&config.file_path)
        .expect("Should have been able to read the file");

    println!("Searching for {} in {}", config.query, config.file_path);
    println!("{contents}");
}`
        }
      ]
    },
    {
      heading: 'Returning Result from build instead of panicking',
      body: `The constructor still has a flaw. If the user runs the program with too few arguments, indexing into the arguments slice panics with a message about an index being out of bounds. That message is meaningless to a user: it talks about Rust internals, not about the fact that they forgot to supply a query. Panicking is the language's tool for **programming bugs**, situations that should never happen if the code is correct. Missing user input is not a bug in your program; it is an expected, recoverable condition, and the idiomatic way to model expected failure is to **return a Result**.

So the constructor is rewritten to return a Result whose ok variant carries a Config and whose error variant carries a message. Inside, it checks the argument count first and returns an error with a clear, human-readable string when there are too few. The book renames the function from new to **build** at this point, because there is a community convention that a function literally named new is not expected to fail, so a fallible constructor should carry a different name to avoid surprising readers.

The error type here is a simple static string slice, which is enough to carry a message and costs nothing. Production code often uses richer error types, but a string is a fine starting point and keeps the example focused on the control flow rather than on error-type design.

On the calling side, main inspects the Result. The cleanest tool is a method that runs a closure if the value is the error variant; the closure receives the error, prints a message, and exits the process with a non-zero status code. A non-zero exit code is the universal Unix signal that a program failed, and other tools and shell scripts rely on it. This is also where main stops being allowed to simply panic on bad input and starts behaving like a well-mannered command line citizen.`,
      code: [
        {
          lang: 'rust',
          src: `use std::env;
use std::process;

struct Config {
    query: String,
    file_path: String,
}

impl Config {
    // Renamed new -> build because it can fail; returns Result.
    // The error is a &'static str: a cheap, clear message.
    fn build(args: &[String]) -> Result<Config, &'static str> {
        if args.len() < 3 {
            return Err("not enough arguments");
        }
        let query = args[1].clone();
        let file_path = args[2].clone();
        Ok(Config { query, file_path })
    }
}

fn main() {
    let args: Vec<String> = env::args().collect();

    // unwrap_or_else handles the Err case without panicking.
    let config = Config::build(&args).unwrap_or_else(|err| {
        eprintln!("Problem parsing arguments: {err}");
        process::exit(1); // non-zero exit status signals failure
    });

    println!("Searching for {}", config.query);
}`
        }
      ]
    },
    {
      heading: 'Extracting a run function and a library crate',
      body: `Parsing is now separate, but the actual work, reading the file and acting on its contents, still lives in main. The next extraction pulls that logic into a function commonly called **run** that takes the Config and performs the program's job. Two things change in the process.

**run returns a Result too.** Reading a file can fail, so rather than unwrapping inside run, the function propagates errors to the caller. The error type is a **boxed trait object** of the standard error trait, written as a box of dynamic error. This means run can return any error type that implements the standard error trait without naming a single concrete one, which is convenient when the body performs several different fallible operations that each have their own error type. The question-mark operator then propagates each error upward, converting it into the boxed type automatically.

Because run does its work for side effects and has nothing meaningful to return on success, its ok variant is the unit type. Returning the unit type wrapped in ok is the idiomatic way to say this function succeeded but produces no value. A small gotcha: when you stop unwrapping and start propagating, the compiler warns that the resulting Result is unused if you call run and ignore it. main must handle run's Result, again with the run-a-closure-on-error pattern, so the warning is both a nag and a correct reminder.

**The code moves into a library crate.** The book splits the project so that nearly everything, the Config struct, the build constructor, the run function, and the search logic, lives in a library file, while the binary file becomes a thin shell that reads arguments, builds the Config, calls run, and reports errors. This is the most important structural lesson of the chapter. A library crate can be **tested by integration tests and reused by other programs**; a binary-only crate cannot be imported, so its logic cannot be exercised from the outside. Splitting the project this way is the standard idiomatic shape of a serious Rust command line tool, and you will see it everywhere in real codebases.

Concretely, the items the binary needs from the library must be made public, and the binary brings them into scope with a use statement that names the crate by its package name. main now contains only orchestration: glue code with no business logic. That is exactly what makes the rest of the program testable.`,
      code: [
        {
          lang: 'rust',
          src: `// File: src/lib.rs  (the library crate: holds the real logic)
use std::error::Error;
use std::fs;

pub struct Config {
    pub query: String,
    pub file_path: String,
}

impl Config {
    pub fn build(args: &[String]) -> Result<Config, &'static str> {
        if args.len() < 3 {
            return Err("not enough arguments");
        }
        Ok(Config {
            query: args[1].clone(),
            file_path: args[2].clone(),
        })
    }
}

// Box<dyn Error> = any error implementing the std Error trait.
pub fn run(config: Config) -> Result<(), Box<dyn Error>> {
    let contents = fs::read_to_string(config.file_path)?; // ? propagates
    println!("{contents}");
    Ok(()) // success, no meaningful value
}`
        },
        {
          lang: 'rust',
          src: `// File: src/main.rs  (the binary crate: a thin shell of glue code)
use std::env;
use std::process;
use minigrep::Config; // crate name comes from the package name in Cargo.toml

fn main() {
    let args: Vec<String> = env::args().collect();

    let config = Config::build(&args).unwrap_or_else(|err| {
        eprintln!("Problem parsing arguments: {err}");
        process::exit(1);
    });

    // run returns Result; if let lets us act only on the error.
    if let Err(e) = minigrep::run(config) {
        eprintln!("Application error: {e}");
        process::exit(1);
    }
}`
        }
      ]
    },
    {
      heading: 'Developing the search function with test-driven development',
      body: `With logic now living in a testable library, the book develops the core search function using **test-driven development**, abbreviated TDD. The cycle is deliberate and worth memorizing as a discipline:

1. Write a test that fails, defining the behaviour you want before the code exists.
2. Write or change just enough code to make that failing test pass.
3. Refactor the code while keeping the test green, confident that you have not broken the behaviour.
4. Repeat for the next slice of behaviour.

The order matters. Writing the test first forces you to design the function's interface from the caller's point of view, the signature, the inputs, the shape of the output, before you are distracted by implementation details. It also guarantees that every line of logic is covered by a test that you watched fail and then pass, so you know the test is actually exercising the code rather than passing vacuously.

The search function takes the query and the full file contents and returns a vector of the lines that contain the query. The signature carries an explicit **lifetime annotation** tying the returned references to the contents argument, not to the query. This is the crucial borrow-checker detail: the returned string slices borrow from the contents string, so the compiler must be told that the output lives as long as the contents, otherwise it cannot guarantee the references stay valid. Annotating the wrong parameter, or omitting the annotation, produces a lifetime error that confuses many learners; the fix is to connect the output lifetime to the data the slices actually point into.

The implementation is small and readable: iterate over the contents line by line using the lines method, keep the lines that contain the query using the contains method, and collect the survivors into a vector. The first version may even start with an empty vector and a hardcoded result so the structure compiles and the test fails for the right reason before you fill in the real loop. Once search exists and is tested, run calls it and prints each matching line.`,
      code: [
        {
          lang: 'rust',
          src: `// In src/lib.rs. The lifetime 'a ties the returned slices to contents.
pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let mut results = Vec::new();
    for line in contents.lines() {
        if line.contains(query) {
            results.push(line);
        }
    }
    results
}

#[cfg(test)]
mod tests {
    use super::*;

    // Written FIRST, before search had a real body.
    #[test]
    fn one_result() {
        let query = "duct";
        let contents = "\\
Rust:
safe, fast, productive.
Pick three.";

        assert_eq!(vec!["safe, fast, productive."], search(query, contents));
    }
}`
        }
      ]
    },
    {
      heading: 'Environment variables and case-insensitive search',
      body: `A real grep can search case-insensitively, and the chapter adds that feature, but it makes the choice configurable through an **environment variable** rather than a command line flag. This demonstrates a second, complementary channel for configuration. Command line arguments are best for values that change every run, like the query and the file. Environment variables suit settings that a user wants to fix once for a whole session or shell, so they do not retype a flag on every invocation.

The mechanism is straightforward. A second search function performs a case-insensitive match by lowercasing both the query and each line before comparing; lowercasing the query once outside the loop is the efficient placement. Note a real subtlety the book flags: converting to lowercase here handles basic ASCII correctly but is not a complete solution for the full complexity of Unicode case folding, which is genuinely hard and locale-dependent. For a teaching example ASCII lowercasing is fine, but a production tool must not assume it is universally correct.

To decide which search to call, the build constructor checks whether a particular environment variable is set, using the standard environment module's variable-lookup function. That function returns a Result, and the key trick is that the program only cares whether the variable **is present**, not what it contains, so checking whether the result is the ok variant is enough. The boolean is stored as a third field on Config, and run branches on it to pick the case-sensitive or case-insensitive function.

Because the relevant detail is mere presence, setting the variable to any value, even an empty one, turns the feature on, and unsetting it turns the feature off. Reading environment variables at construction time keeps run and search pure and easy to test: the tests call the two search functions directly with known inputs and never touch the real environment, which would otherwise make tests order-dependent and flaky.`,
      code: [
        {
          lang: 'rust',
          src: `use std::env;

pub struct Config {
    pub query: String,
    pub file_path: String,
    pub ignore_case: bool,
}

impl Config {
    pub fn build(args: &[String]) -> Result<Config, &'static str> {
        if args.len() < 3 {
            return Err("not enough arguments");
        }
        // is_ok() is true when the variable is set, whatever its value.
        let ignore_case = env::var("IGNORE_CASE").is_ok();
        Ok(Config {
            query: args[1].clone(),
            file_path: args[2].clone(),
            ignore_case,
        })
    }
}

pub fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let query = query.to_lowercase(); // lowercase once, outside the loop
    let mut results = Vec::new();
    for line in contents.lines() {
        if line.to_lowercase().contains(&query) {
            results.push(line);
        }
    }
    results
}

// Enable it for one run:        IGNORE_CASE=1 cargo run -- to poem.txt
// Or set it for the session:    export IGNORE_CASE=1`
        }
      ]
    },
    {
      heading: 'Writing errors to standard error with eprintln',
      body: `The final refinement is about **where output goes**. A Unix program has two separate output streams. **Standard output** is for the program's normal results, the data a user wants and is likely to redirect into a file or pipe into another tool. **Standard error** is for diagnostic and error messages, which should remain visible on the terminal even when the normal output is being redirected. Keeping the two separate is not a nicety; it is core to how command line tools compose in pipelines.

The bug to fix is that the early code printed errors with the ordinary print macros, which write to standard output. That means if a user redirects the program's output into a file, any error message is silently captured into that file too, polluting the data and hiding the error from the person who needs to see it. You can demonstrate the problem by redirecting output and observing that an error meant for the screen ends up in the file instead.

The fix is to print every error message with the **error-stream print macros**, the ones whose names begin with the e prefix, which write to standard error rather than standard output. Successful results, the matching lines, keep using the ordinary print macros so they continue to flow to standard output where they can be redirected. After the change, redirecting standard output captures only the real results, while errors still appear on the terminal, which is precisely the behaviour every well-behaved command line tool exhibits.

This stream discipline, combined with a non-zero exit code on failure, is what makes a tool a good citizen in shell pipelines and automated scripts. Maintainers care about it because their tools are run inside other tools. When you contribute a command line feature, sending diagnostics to standard error and results to standard output, and exiting non-zero on failure, is table stakes, and getting it wrong is an easy way to have a patch sent back.`,
      code: [
        {
          lang: 'rust',
          src: `use std::env;
use std::process;

fn main() {
    let args: Vec<String> = env::args().collect();

    let config = Config::build(&args).unwrap_or_else(|err| {
        // eprintln writes to STDERR: stays on screen even when stdout
        // is redirected into a file.
        eprintln!("Problem parsing arguments: {err}");
        process::exit(1);
    });

    if let Err(e) = run(config) {
        eprintln!("Application error: {e}"); // diagnostics -> stderr
        process::exit(1);
    }
    // Matching lines are printed inside run with println! -> stdout,
    // so they can be redirected:  cargo run -- to poem.txt > output.txt
}`
        }
      ]
    }
  ],
  takeaways: [
    'Command line arguments come from an iterator; argument zero is the program name, so user input starts at index one.',
    'Read a small whole file with the read-to-string convenience function; it returns Result and loads everything into memory, so use a buffered reader for large inputs.',
    'Group related configuration into a Config struct so values have names and intent is explicit; owning the strings via clone is a fine, cheap simplification for a one-shot program.',
    'Model expected failures like missing arguments with Result, not panic; name a fallible constructor build rather than new by convention.',
    'Move logic into a library crate and keep main a thin shell of glue code, because only a library can be imported and tested by integration tests.',
    'A run function should return a boxed dynamic error so the question-mark operator can propagate any error type, returning the unit type inside ok on success.',
    'Use test-driven development: write a failing test first to design the interface, then make it pass, then refactor while it stays green.',
    'Search returns slices borrowing from the contents, so the lifetime annotation must tie the output to the contents argument, not the query.',
    'Configure with environment variables for session-wide settings; presence is often all that matters, so checking is-ok of the lookup is enough.',
    'Send results to standard output with println and diagnostics to standard error with eprintln, and exit non-zero on failure, so the tool composes in pipelines.'
  ],
  cheatsheet: [
    { label: 'std::env::args()', value: 'Iterator over arguments; panics on non-Unicode args' },
    { label: 'std::env::args_os()', value: 'Argument iterator that tolerates non-Unicode data' },
    { label: 'args[0]', value: 'The program name; user arguments begin at args[1]' },
    { label: 'cargo run -- a b', value: 'Two dashes separate cargo flags from program arguments' },
    { label: 'fs::read_to_string(path)', value: 'Reads whole file into a String; returns Result' },
    { label: 'Config { query, file_path }', value: 'Struct grouping related config with named fields' },
    { label: 'Config::build', value: 'Fallible constructor returning Result; build not new' },
    { label: 'Result<Config, &str>', value: 'Ok carries config, Err carries a cheap message' },
    { label: 'Box<dyn Error>', value: 'Any error implementing std Error; lets ? unify types' },
    { label: 'Result<(), Box<dyn Error>>', value: 'run succeeds with unit, propagates any error' },
    { label: "search<'a>(q, c: &'a str)", value: 'Output slices borrow contents, so tie lifetime to it' },
    { label: 'env::var("KEY").is_ok()', value: 'True when env var is set, regardless of its value' },
    { label: 'eprintln!', value: 'Prints to standard error, not standard output' },
    { label: 'process::exit(1)', value: 'Exits with non-zero status to signal failure' }
  ]
}

export default note
