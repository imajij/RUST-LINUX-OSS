import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch12-c-036',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Collect Args into a Vec',
    prompt: `Use \`std::env::args\` to collect all command-line arguments into a \`Vec<String>\` named \`args\`, then print the whole vector with the debug formatter.

Write a complete program. Inside the Playground there are no real CLI arguments, so the output will be a vector containing just the program name, for example:
["target/playground"]`,
    hints: [
      'Bring the iterator in with std::env::args().',
      'Call .collect() and annotate the binding as Vec<String>.',
      'Print with the {:?} debug formatter.',
    ],
    solution: `use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();
    println!("{:?}", args);
}`,
    starter: `use std::env;

fn main() {
    // TODO: collect the args into a Vec<String> named args
    // TODO: print it with {:?}
}`,
    tags: ['cli', 'args', 'vec'],
  },
  {
    id: 'rs-ch12-c-037',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Read Two Positional Arguments',
    prompt: `Collect the command-line arguments into a \`Vec<String>\`. Treat \`args[1]\` as a "query" and \`args[2]\` as a "file path", binding each to its own variable, and print them like:
Searching for QUERY
In file PATH

Because the Playground passes no extra arguments, simulate the input by pushing two strings onto the vector yourself after collecting, namely "frog" and "poem.txt", so the program produces:
Searching for frog
In file poem.txt`,
    hints: [
      'Index the vector with args[1] and args[2].',
      'Use .clone() or a reference so you do not move the String out of the vector.',
      'Push the two simulated arguments before indexing.',
    ],
    solution: `use std::env;

fn main() {
    let mut args: Vec<String> = env::args().collect();
    args.push(String::from("frog"));
    args.push(String::from("poem.txt"));

    let query = &args[1];
    let file_path = &args[2];

    println!("Searching for {}", query);
    println!("In file {}", file_path);
}`,
    starter: `use std::env;

fn main() {
    let mut args: Vec<String> = env::args().collect();
    args.push(String::from("frog"));
    args.push(String::from("poem.txt"));

    // TODO: bind query to args[1] and file_path to args[2]
    // TODO: print the two lines
}`,
    tags: ['cli', 'args', 'indexing'],
  },
  {
    id: 'rs-ch12-c-038',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Plain Config Struct',
    prompt: `Define a struct \`Config\` with two \`String\` fields: \`query\` and \`file_path\`. Write a function \`parse_config(args: &[String]) -> Config\` that clones \`args[1]\` into \`query\` and \`args[2]\` into \`file_path\` and returns the \`Config\`.

In \`main\`, build a \`Vec<String>\` containing \`["prog", "the", "haystack.txt"]\`, call \`parse_config\`, and print:
query=the path=haystack.txt`,
    hints: [
      'Clone the indexed strings so Config owns its data.',
      'Take the args as a slice &[String].',
      'Access fields with config.query and config.file_path.',
    ],
    solution: `struct Config {
    query: String,
    file_path: String,
}

fn parse_config(args: &[String]) -> Config {
    let query = args[1].clone();
    let file_path = args[2].clone();
    Config { query, file_path }
}

fn main() {
    let args = vec![
        String::from("prog"),
        String::from("the"),
        String::from("haystack.txt"),
    ];
    let config = parse_config(&args);
    println!("query={} path={}", config.query, config.file_path);
}`,
    starter: `struct Config {
    query: String,
    file_path: String,
}

fn parse_config(args: &[String]) -> Config {
    // TODO: clone args[1] and args[2] into a Config
}

fn main() {
    let args = vec![
        String::from("prog"),
        String::from("the"),
        String::from("haystack.txt"),
    ];
    let config = parse_config(&args);
    println!("query={} path={}", config.query, config.file_path);
}`,
    tags: ['config', 'struct', 'refactor'],
  },
  {
    id: 'rs-ch12-c-039',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Config::new as an Associated Function',
    prompt: `Refactor a parsing function into an associated function. Define \`struct Config { query: String, file_path: String }\` and implement \`Config::new(args: &[String]) -> Config\` that clones \`args[1]\` and \`args[2]\` into the fields.

In \`main\`, build the vector \`["prog", "rust", "data.txt"]\`, call \`Config::new(&args)\`, and print:
rust data.txt`,
    hints: [
      'Use an impl block with a function named new.',
      'new takes the slice and returns Self or Config.',
      'Call it as Config::new(&args).',
    ],
    solution: `struct Config {
    query: String,
    file_path: String,
}

impl Config {
    fn new(args: &[String]) -> Config {
        let query = args[1].clone();
        let file_path = args[2].clone();
        Config { query, file_path }
    }
}

fn main() {
    let args = vec![
        String::from("prog"),
        String::from("rust"),
        String::from("data.txt"),
    ];
    let config = Config::new(&args);
    println!("{} {}", config.query, config.file_path);
}`,
    starter: `struct Config {
    query: String,
    file_path: String,
}

impl Config {
    fn new(args: &[String]) -> Config {
        // TODO: clone args[1] and args[2] into the fields
    }
}

fn main() {
    let args = vec![
        String::from("prog"),
        String::from("rust"),
        String::from("data.txt"),
    ];
    let config = Config::new(&args);
    println!("{} {}", config.query, config.file_path);
}`,
    tags: ['config', 'impl', 'refactor'],
  },
  {
    id: 'rs-ch12-c-040',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Config::build Returning Result',
    prompt: `Improve error handling by making the constructor fallible. Implement \`Config::build(args: &[String]) -> Result<Config, &'static str>\`. If \`args\` has fewer than 3 elements, return \`Err("not enough arguments")\`; otherwise clone \`args[1]\` and \`args[2]\` into the fields and return \`Ok(config)\`.

In \`main\`, call it with a vector of exactly one element \`["prog"]\` and use a \`match\` to print either the query or the error message. Expected output:
error: not enough arguments`,
    hints: [
      'Check args.len() < 3 before indexing.',
      'The error type is a string slice with a static lifetime.',
      'Match on Ok(config) and Err(msg).',
    ],
    solution: `struct Config {
    query: String,
    file_path: String,
}

impl Config {
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
    let args = vec![String::from("prog")];
    match Config::build(&args) {
        Ok(config) => println!("query: {}", config.query),
        Err(msg) => println!("error: {}", msg),
    }
}`,
    starter: `struct Config {
    query: String,
    file_path: String,
}

impl Config {
    fn build(args: &[String]) -> Result<Config, &'static str> {
        // TODO: return Err("not enough arguments") when too few args
        // TODO: otherwise build and return Ok(Config { .. })
    }
}

fn main() {
    let args = vec![String::from("prog")];
    match Config::build(&args) {
        Ok(config) => println!("query: {}", config.query),
        Err(msg) => println!("error: {}", msg),
    }
}`,
    tags: ['config', 'result', 'error-handling'],
  },
  {
    id: 'rs-ch12-c-041',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Read a File to a String',
    prompt: `Use \`std::fs\` to read a file into a \`String\` and print its length in bytes. First create the file by writing the text "hello\\nworld\\n" to a path of your choice with \`std::fs::write\`, then read it back with \`std::fs::read_to_string\`.

Unwrap the results (this is a small program). Expected output:
length: 12`,
    hints: [
      'fs::write(path, contents) creates or overwrites the file.',
      'fs::read_to_string(path) returns Result<String, _>.',
      'A String length in bytes comes from .len().',
    ],
    solution: `use std::fs;

fn main() {
    let path = "scratch.txt";
    fs::write(path, "hello\\nworld\\n").unwrap();
    let contents = fs::read_to_string(path).unwrap();
    println!("length: {}", contents.len());
}`,
    starter: `use std::fs;

fn main() {
    let path = "scratch.txt";
    fs::write(path, "hello\\nworld\\n").unwrap();
    // TODO: read the file into a String and print its byte length
}`,
    tags: ['fs', 'file', 'string'],
  },
  {
    id: 'rs-ch12-c-042',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count Lines in File Contents',
    prompt: `Write a function \`count_lines(contents: &str) -> usize\` that returns how many lines are in the given text, using the \`.lines()\` iterator.

In \`main\`, call it on the string "a\\nb\\nc" and print:
3`,
    hints: [
      'The str method .lines() yields each line without the newline.',
      'You can count an iterator with .count().',
      'Return a usize.',
    ],
    solution: `fn count_lines(contents: &str) -> usize {
    contents.lines().count()
}

fn main() {
    let text = "a\\nb\\nc";
    println!("{}", count_lines(text));
}`,
    starter: `fn count_lines(contents: &str) -> usize {
    // TODO: count the lines
}

fn main() {
    let text = "a\\nb\\nc";
    println!("{}", count_lines(text));
}`,
    tags: ['lines', 'iterator', 'str'],
  },
  {
    id: 'rs-ch12-c-043',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Search Returning Matching Lines',
    prompt: `Write the core search function with explicit lifetimes:
\`fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str>\`
It returns every line of \`contents\` that contains \`query\`, in order.

In \`main\`, search the multi-line text below for "duct" and print each matching line on its own line.

Text:
Rust:
safe, fast, productive.
Pick three.
Duct tape.

Expected output:
safe, fast, productive.`,
    hints: [
      'The returned slices borrow from contents, so tie the lifetime to it.',
      'Iterate with contents.lines() and keep lines where line.contains(query).',
      'Push matches into a Vec and return it.',
    ],
    solution: `fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let mut results = Vec::new();
    for line in contents.lines() {
        if line.contains(query) {
            results.push(line);
        }
    }
    results
}

fn main() {
    let contents = "\\
Rust:
safe, fast, productive.
Pick three.
Duct tape.";
    for line in search("duct", contents) {
        println!("{}", line);
    }
}`,
    starter: `fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    // TODO: return lines containing query
}

fn main() {
    let contents = "\\
Rust:
safe, fast, productive.
Pick three.
Duct tape.";
    for line in search("duct", contents) {
        println!("{}", line);
    }
}`,
    tags: ['search', 'lifetimes', 'lines'],
  },
  {
    id: 'rs-ch12-c-044',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'TDD: Make the Search Test Pass',
    prompt: `Practice the TDD style from the chapter. The following test is fixed and must pass:

\`\`\`
#[test]
fn one_result() {
    let query = "duct";
    let contents = "Rust:\\nsafe, fast, productive.\\nPick three.";
    assert_eq!(vec!["safe, fast, productive."], search(query, contents));
}
\`\`\`

Implement \`search<'a>(query: &str, contents: &'a str) -> Vec<&'a str>\` so the test passes. Provide the function and the test module so it runs with \`cargo test\`.`,
    hints: [
      'Start with an empty Vec and a loop over .lines().',
      'Keep only lines where line.contains(query).',
      'The element type matches the assertion: &str borrowed from contents.',
    ],
    solution: `pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
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

    #[test]
    fn one_result() {
        let query = "duct";
        let contents = "Rust:\\nsafe, fast, productive.\\nPick three.";
        assert_eq!(vec!["safe, fast, productive."], search(query, contents));
    }
}`,
    starter: `pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    // TODO: implement so the test below passes
    todo!()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn one_result() {
        let query = "duct";
        let contents = "Rust:\\nsafe, fast, productive.\\nPick three.";
        assert_eq!(vec!["safe, fast, productive."], search(query, contents));
    }
}`,
    tags: ['tdd', 'search', 'tests'],
  },
  {
    id: 'rs-ch12-c-045',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Case-Insensitive Search',
    prompt: `Write \`search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str>\`. Lowercase the query once, and for each line lowercase it and check whether it contains the lowercased query.

In \`main\`, search for "rUsT" in the text below and print each matching line.

Text:
Rust:
Trust me.
Pick three.

Expected output:
Rust:
Trust me.`,
    hints: [
      'query.to_lowercase() returns an owned String.',
      'Compare line.to_lowercase().contains(&query) where query is the lowercased String.',
      'Push the original line (not the lowercased copy) so output keeps its case.',
    ],
    solution: `fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let query = query.to_lowercase();
    let mut results = Vec::new();
    for line in contents.lines() {
        if line.to_lowercase().contains(&query) {
            results.push(line);
        }
    }
    results
}

fn main() {
    let contents = "\\
Rust:
Trust me.
Pick three.";
    for line in search_case_insensitive("rUsT", contents) {
        println!("{}", line);
    }
}`,
    starter: `fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    // TODO: lowercase the query, then match lines case-insensitively
}

fn main() {
    let contents = "\\
Rust:
Trust me.
Pick three.";
    for line in search_case_insensitive("rUsT", contents) {
        println!("{}", line);
    }
}`,
    tags: ['search', 'case-insensitive', 'lifetimes'],
  },
  {
    id: 'rs-ch12-c-046',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Read an Env Var to Toggle Behavior',
    prompt: `Use \`std::env::var\` to read whether an environment variable named \`IGNORE_CASE\` is set. The expression \`env::var("IGNORE_CASE").is_ok()\` is \`true\` when the variable is present (any value) and \`false\` otherwise.

In \`main\`, set the variable yourself with \`env::set_var("IGNORE_CASE", "1")\`, then read the flag and print:
ignore_case = true`,
    hints: [
      'env::var returns Result, so .is_ok() tells you whether it was set.',
      'env::set_var lets you simulate the environment inside the Playground.',
      'Bind the boolean to a variable named ignore_case.',
    ],
    solution: `use std::env;

fn main() {
    env::set_var("IGNORE_CASE", "1");
    let ignore_case = env::var("IGNORE_CASE").is_ok();
    println!("ignore_case = {}", ignore_case);
}`,
    starter: `use std::env;

fn main() {
    env::set_var("IGNORE_CASE", "1");
    // TODO: read whether IGNORE_CASE is set into ignore_case
    // TODO: print "ignore_case = <bool>"
}`,
    tags: ['env-var', 'config', 'toggle'],
  },
  {
    id: 'rs-ch12-c-047',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Printing to stderr vs stdout',
    prompt: `Demonstrate the difference between the two output streams. Print "this is normal output" to standard output with \`println!\`, and print "this is an error" to standard error with \`eprintln!\`.

Both lines will appear in the Playground, but in a real terminal the error line can be redirected separately. Expected output (order may interleave):
this is normal output
this is an error`,
    hints: [
      'println! writes to stdout.',
      'eprintln! writes to stderr.',
      'Both take the same formatting arguments.',
    ],
    solution: `fn main() {
    println!("this is normal output");
    eprintln!("this is an error");
}`,
    starter: `fn main() {
    // TODO: print a normal line to stdout
    // TODO: print an error line to stderr
}`,
    tags: ['stderr', 'stdout', 'eprintln'],
  },
  {
    id: 'rs-ch12-c-048',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Exit Code with process::exit',
    prompt: `Use \`std::process::exit\` to control the program's exit status. In \`main\`, print "doing work" to stdout, then print "fatal: aborting" to stderr with \`eprintln!\`, and finally call \`process::exit(2)\` so the process exits with code 2.

Expected stdout:
doing work
Expected stderr:
fatal: aborting`,
    hints: [
      'Bring in std::process.',
      'process::exit(code) ends the program immediately with that status.',
      'Send the diagnostic to stderr before exiting.',
    ],
    solution: `use std::process;

fn main() {
    println!("doing work");
    eprintln!("fatal: aborting");
    process::exit(2);
}`,
    starter: `use std::process;

fn main() {
    println!("doing work");
    // TODO: print "fatal: aborting" to stderr
    // TODO: exit with code 2
}`,
    tags: ['process-exit', 'exit-code', 'stderr'],
  },
  {
    id: 'rs-ch12-c-049',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Handle Config::build Error and Exit',
    prompt: `Combine error handling with exit codes the way the chapter's \`main\` does. Given \`Config::build(args) -> Result<Config, &'static str>\`, in \`main\` call it and use \`unwrap_or_else\` with a closure that prints "Problem parsing arguments: <err>" to stderr and then calls \`process::exit(1)\`.

Drive it with a vector of one element \`["prog"]\` so the build fails. Expected stderr:
Problem parsing arguments: not enough arguments`,
    hints: [
      'unwrap_or_else takes a closure receiving the error value.',
      'Inside the closure use eprintln! then process::exit(1).',
      'The closure never returns normally because exit diverges.',
    ],
    solution: `use std::process;

struct Config {
    query: String,
    file_path: String,
}

impl Config {
    fn build(args: &[String]) -> Result<Config, &'static str> {
        if args.len() < 3 {
            return Err("not enough arguments");
        }
        Ok(Config {
            query: args[1].clone(),
            file_path: args[2].clone(),
        })
    }
}

fn main() {
    let args = vec![String::from("prog")];
    let config = Config::build(&args).unwrap_or_else(|err| {
        eprintln!("Problem parsing arguments: {}", err);
        process::exit(1);
    });
    println!("query: {}", config.query);
}`,
    starter: `use std::process;

struct Config {
    query: String,
    file_path: String,
}

impl Config {
    fn build(args: &[String]) -> Result<Config, &'static str> {
        if args.len() < 3 {
            return Err("not enough arguments");
        }
        Ok(Config {
            query: args[1].clone(),
            file_path: args[2].clone(),
        })
    }
}

fn main() {
    let args = vec![String::from("prog")];
    // TODO: unwrap_or_else: print the problem to stderr and exit(1)
    // (after success, print "query: <query>")
}`,
    tags: ['error-handling', 'unwrap-or-else', 'exit-code'],
  },
  {
    id: 'rs-ch12-c-050',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A run Function Returning Result',
    prompt: `Extract the program logic into a function. Write \`fn run(contents: &str) -> Result<(), String>\`. If \`contents\` is empty, return \`Err(String::from("empty input"))\`; otherwise print the number of lines as "lines: N" and return \`Ok(())\`.

In \`main\`, call \`run("a\\nb")\` inside a \`match\` and print the error to stderr if there is one. Expected output:
lines: 2`,
    hints: [
      'The success type is the unit type, written ().',
      'Return Ok(()) on the happy path.',
      'Use contents.lines().count() for the line count.',
    ],
    solution: `fn run(contents: &str) -> Result<(), String> {
    if contents.is_empty() {
        return Err(String::from("empty input"));
    }
    println!("lines: {}", contents.lines().count());
    Ok(())
}

fn main() {
    match run("a\\nb") {
        Ok(()) => {}
        Err(e) => eprintln!("Application error: {}", e),
    }
}`,
    starter: `fn run(contents: &str) -> Result<(), String> {
    // TODO: Err on empty input, otherwise print "lines: N" and Ok(())
}

fn main() {
    match run("a\\nb") {
        Ok(()) => {}
        Err(e) => eprintln!("Application error: {}", e),
    }
}`,
    tags: ['run', 'result', 'refactor'],
  },
  {
    id: 'rs-ch12-c-051',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Filter Lines by Prefix',
    prompt: `Write \`fn starting_with<'a>(prefix: &str, contents: &'a str) -> Vec<&'a str>\` that returns each line beginning with \`prefix\`, using the \`str\` method \`starts_with\`.

In \`main\`, run it with prefix "TODO" over the text below and print each match.

Text:
TODO buy milk
done laundry
TODO call mom

Expected output:
TODO buy milk
TODO call mom`,
    hints: [
      'str has a starts_with method.',
      'The returned slices borrow from contents.',
      'Iterate with .lines() and push matching lines.',
    ],
    solution: `fn starting_with<'a>(prefix: &str, contents: &'a str) -> Vec<&'a str> {
    let mut results = Vec::new();
    for line in contents.lines() {
        if line.starts_with(prefix) {
            results.push(line);
        }
    }
    results
}

fn main() {
    let contents = "\\
TODO buy milk
done laundry
TODO call mom";
    for line in starting_with("TODO", contents) {
        println!("{}", line);
    }
}`,
    starter: `fn starting_with<'a>(prefix: &str, contents: &'a str) -> Vec<&'a str> {
    // TODO: return lines that start with prefix
}

fn main() {
    let contents = "\\
TODO buy milk
done laundry
TODO call mom";
    for line in starting_with("TODO", contents) {
        println!("{}", line);
    }
}`,
    tags: ['search', 'starts-with', 'lifetimes'],
  },
  {
    id: 'rs-ch12-c-052',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count Query Occurrences Across Lines',
    prompt: `Write \`fn total_matches(query: &str, contents: &str) -> usize\` that returns how many lines contain \`query\` (count lines, not total substring hits).

In \`main\`, count occurrences of "an" in the text below and print the number.

Text:
banana
apple
orange
grape

Expected output:
2`,
    hints: [
      'Loop over .lines() and increment a counter when line.contains(query).',
      'Return the counter as a usize.',
      'Both "banana" and "orange" contain "an".',
    ],
    solution: `fn total_matches(query: &str, contents: &str) -> usize {
    let mut count = 0;
    for line in contents.lines() {
        if line.contains(query) {
            count += 1;
        }
    }
    count
}

fn main() {
    let contents = "\\
banana
apple
orange
grape";
    println!("{}", total_matches("an", contents));
}`,
    starter: `fn total_matches(query: &str, contents: &str) -> usize {
    // TODO: count lines that contain query
}

fn main() {
    let contents = "\\
banana
apple
orange
grape";
    println!("{}", total_matches("an", contents));
}`,
    tags: ['search', 'count', 'lines'],
  },
  {
    id: 'rs-ch12-c-053',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Config Carrying an ignore_case Flag',
    prompt: `Extend \`Config\` to hold a boolean. Define \`struct Config { query: String, file_path: String, ignore_case: bool }\` and implement \`Config::build(args: &[String], ignore_case: bool) -> Result<Config, &'static str>\` that errors with "not enough arguments" when there are fewer than 3 args, otherwise stores all three values.

In \`main\`, build with \`["prog", "the", "poem.txt"]\` and \`true\`, then print:
the poem.txt ignore=true`,
    hints: [
      'Add a third field of type bool to the struct.',
      'Pass the flag through into the returned Config.',
      'Keep the length check before indexing.',
    ],
    solution: `struct Config {
    query: String,
    file_path: String,
    ignore_case: bool,
}

impl Config {
    fn build(args: &[String], ignore_case: bool) -> Result<Config, &'static str> {
        if args.len() < 3 {
            return Err("not enough arguments");
        }
        Ok(Config {
            query: args[1].clone(),
            file_path: args[2].clone(),
            ignore_case,
        })
    }
}

fn main() {
    let args = vec![
        String::from("prog"),
        String::from("the"),
        String::from("poem.txt"),
    ];
    let config = Config::build(&args, true).unwrap();
    println!("{} {} ignore={}", config.query, config.file_path, config.ignore_case);
}`,
    starter: `struct Config {
    query: String,
    file_path: String,
    ignore_case: bool,
}

impl Config {
    fn build(args: &[String], ignore_case: bool) -> Result<Config, &'static str> {
        // TODO: error when too few args, else build Config with the flag
    }
}

fn main() {
    let args = vec![
        String::from("prog"),
        String::from("the"),
        String::from("poem.txt"),
    ];
    let config = Config::build(&args, true).unwrap();
    println!("{} {} ignore={}", config.query, config.file_path, config.ignore_case);
}`,
    tags: ['config', 'result', 'flag'],
  },
  {
    id: 'rs-ch12-c-054',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Read Env Var Default for ignore_case',
    prompt: `Build the \`ignore_case\` flag from the environment the way the chapter does. Read it with \`std::env::var("IGNORE_CASE").is_ok()\`. The variable being present means true; absent means false.

In \`main\`, first call \`env::remove_var("IGNORE_CASE")\` to ensure it is unset, compute the flag, and print:
ignore_case = false`,
    hints: [
      'env::remove_var clears the variable so .is_ok() is false.',
      'Store the boolean and print it.',
      'Any non-empty value would still count as present, so this checks presence only.',
    ],
    solution: `use std::env;

fn main() {
    env::remove_var("IGNORE_CASE");
    let ignore_case = env::var("IGNORE_CASE").is_ok();
    println!("ignore_case = {}", ignore_case);
}`,
    starter: `use std::env;

fn main() {
    env::remove_var("IGNORE_CASE");
    // TODO: compute ignore_case from the env var presence
    // TODO: print "ignore_case = <bool>"
}`,
    tags: ['env-var', 'config', 'default'],
  },
  {
    id: 'rs-ch12-c-055',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Print Matches with Line Numbers',
    prompt: `Write \`fn search_numbered(query: &str, contents: &str)\` that prints each matching line prefixed by its 1-based line number, in the form "N: line". Use \`.lines().enumerate()\`.

In \`main\`, search for "o" in the text below.

Text:
red
blue
green
yellow

Expected output:
2: blue
3: green
4: yellow`,
    hints: [
      'enumerate yields (index, line) pairs with a zero-based index.',
      'Add 1 to the index for a human-friendly line number.',
      'Only print lines where line.contains(query).',
    ],
    solution: `fn search_numbered(query: &str, contents: &str) {
    for (i, line) in contents.lines().enumerate() {
        if line.contains(query) {
            println!("{}: {}", i + 1, line);
        }
    }
}

fn main() {
    let contents = "\\
red
blue
green
yellow";
    search_numbered("o", contents);
}`,
    starter: `fn search_numbered(query: &str, contents: &str) {
    // TODO: print "N: line" for each matching line, N is 1-based
}

fn main() {
    let contents = "\\
red
blue
green
yellow";
    search_numbered("o", contents);
}`,
    tags: ['search', 'enumerate', 'lines'],
  },
  {
    id: 'rs-ch12-c-056',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Validate the File Path Argument',
    prompt: `Add a second validation to \`Config::build\`. After checking the argument count, also reject an empty file path. Implement \`Config::build(args: &[String]) -> Result<Config, &'static str>\` that returns \`Err("not enough arguments")\` when there are fewer than 3 args, \`Err("empty file path")\` when \`args[2]\` is empty, otherwise \`Ok\`.

In \`main\`, call it with \`["prog", "q", ""]\` and print the error. Expected output:
error: empty file path`,
    hints: [
      'Check args.len() < 3 first to avoid indexing out of bounds.',
      'A String is empty when args[2].is_empty() is true.',
      'Return early with the matching error message.',
    ],
    solution: `struct Config {
    query: String,
    file_path: String,
}

impl Config {
    fn build(args: &[String]) -> Result<Config, &'static str> {
        if args.len() < 3 {
            return Err("not enough arguments");
        }
        if args[2].is_empty() {
            return Err("empty file path");
        }
        Ok(Config {
            query: args[1].clone(),
            file_path: args[2].clone(),
        })
    }
}

fn main() {
    let args = vec![
        String::from("prog"),
        String::from("q"),
        String::from(""),
    ];
    match Config::build(&args) {
        Ok(c) => println!("ok: {}", c.file_path),
        Err(e) => println!("error: {}", e),
    }
}`,
    starter: `struct Config {
    query: String,
    file_path: String,
}

impl Config {
    fn build(args: &[String]) -> Result<Config, &'static str> {
        // TODO: two checks: too few args, then empty file path
    }
}

fn main() {
    let args = vec![
        String::from("prog"),
        String::from("q"),
        String::from(""),
    ];
    match Config::build(&args) {
        Ok(c) => println!("ok: {}", c.file_path),
        Err(e) => println!("error: {}", e),
    }
}`,
    tags: ['config', 'validation', 'result'],
  },
  {
    id: 'rs-ch12-c-057',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Write Then Read a Config-Driven File',
    prompt: `Tie file I/O together with search. Write the poem below to "poem.txt" with \`fs::write\`, read it back with \`fs::read_to_string\`, then print every line containing "body".

Poem:
I'm nobody! Who are you?
Are you nobody, too?
Then there's a pair of us - don't tell!

Expected output:
I'm nobody! Who are you?
Are you nobody, too?`,
    hints: [
      'Write the contents, then read them into a String.',
      'Loop over read.lines() and check contains("body").',
      'Unwrap the IO results for this exercise.',
    ],
    solution: `use std::fs;

fn main() {
    let poem = "\\
I'm nobody! Who are you?
Are you nobody, too?
Then there's a pair of us - don't tell!";
    fs::write("poem.txt", poem).unwrap();
    let contents = fs::read_to_string("poem.txt").unwrap();
    for line in contents.lines() {
        if line.contains("body") {
            println!("{}", line);
        }
    }
}`,
    starter: `use std::fs;

fn main() {
    let poem = "\\
I'm nobody! Who are you?
Are you nobody, too?
Then there's a pair of us - don't tell!";
    fs::write("poem.txt", poem).unwrap();
    // TODO: read poem.txt and print lines containing "body"
}`,
    tags: ['fs', 'search', 'file'],
  },
  {
    id: 'rs-ch12-c-058',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Choose Search Variant by Flag',
    prompt: `Write a dispatcher \`fn run_search<'a>(query: &str, contents: &'a str, ignore_case: bool) -> Vec<&'a str>\` that calls \`search\` when \`ignore_case\` is false and \`search_case_insensitive\` when it is true. Provide both helper functions.

In \`main\`, call it with query "RUST", \`ignore_case = true\`, over the text below, and print each match.

Text:
Rust is great
java is fine
trust the process

Expected output:
Rust is great
trust the process`,
    hints: [
      'Use an if/else returning the result of the chosen function.',
      'Both helpers share the signature returning Vec<&str>.',
      'Lowercase query and line in the case-insensitive helper.',
    ],
    solution: `fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    contents.lines().filter(|l| l.contains(query)).collect()
}

fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let q = query.to_lowercase();
    contents
        .lines()
        .filter(|l| l.to_lowercase().contains(&q))
        .collect()
}

fn run_search<'a>(query: &str, contents: &'a str, ignore_case: bool) -> Vec<&'a str> {
    if ignore_case {
        search_case_insensitive(query, contents)
    } else {
        search(query, contents)
    }
}

fn main() {
    let contents = "\\
Rust is great
java is fine
trust the process";
    for line in run_search("RUST", contents, true) {
        println!("{}", line);
    }
}`,
    starter: `fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    contents.lines().filter(|l| l.contains(query)).collect()
}

fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let q = query.to_lowercase();
    contents
        .lines()
        .filter(|l| l.to_lowercase().contains(&q))
        .collect()
}

fn run_search<'a>(query: &str, contents: &'a str, ignore_case: bool) -> Vec<&'a str> {
    // TODO: pick the right helper based on ignore_case
}

fn main() {
    let contents = "\\
Rust is great
java is fine
trust the process";
    for line in run_search("RUST", contents, true) {
        println!("{}", line);
    }
}`,
    tags: ['search', 'dispatch', 'flag'],
  },
  {
    id: 'rs-ch12-c-059',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Diagnostics to stderr, Results to stdout',
    prompt: `Follow the chapter's stream discipline: send progress messages to stderr and real results to stdout. Write \`fn report(query: &str, contents: &str)\` that prints "Searching for <query>" to stderr, then prints each matching line to stdout.

In \`main\`, call \`report("nobody", contents)\` on the text below.

Text:
I'm nobody! Who are you?
Are you nobody, too?

Expected stdout:
I'm nobody! Who are you?
Are you nobody, too?
Expected stderr:
Searching for nobody`,
    hints: [
      'Use eprintln! for the searching message.',
      'Use println! for each matching line.',
      'Match lines with line.contains(query).',
    ],
    solution: `fn report(query: &str, contents: &str) {
    eprintln!("Searching for {}", query);
    for line in contents.lines() {
        if line.contains(query) {
            println!("{}", line);
        }
    }
}

fn main() {
    let contents = "\\
I'm nobody! Who are you?
Are you nobody, too?";
    report("nobody", contents);
}`,
    starter: `fn report(query: &str, contents: &str) {
    // TODO: print the searching message to stderr
    // TODO: print matching lines to stdout
}

fn main() {
    let contents = "\\
I'm nobody! Who are you?
Are you nobody, too?";
    report("nobody", contents);
}`,
    tags: ['stderr', 'stdout', 'search'],
  },
  {
    id: 'rs-ch12-c-060',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Library Search with a Unit Test',
    prompt: `Write a small library-style module and test it. Provide \`pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str>\` returning matching lines, plus a \`tests\` module with one test \`case_sensitive\` asserting that searching "duct" in "Rust:\\nsafe, fast, productive.\\nPick three.\\nDuct tape." returns exactly \`vec!["safe, fast, productive."]\`.

The code must pass \`cargo test\`.`,
    hints: [
      'Note the capital D in "Duct tape." should NOT match a case-sensitive "duct".',
      'Use #[cfg(test)] mod tests with use super::*.',
      'Return a Vec of borrowed lines.',
    ],
    solution: `pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
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

    #[test]
    fn case_sensitive() {
        let query = "duct";
        let contents = "Rust:\\nsafe, fast, productive.\\nPick three.\\nDuct tape.";
        assert_eq!(vec!["safe, fast, productive."], search(query, contents));
    }
}`,
    starter: `pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    // TODO: return matching lines
    todo!()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn case_sensitive() {
        let query = "duct";
        let contents = "Rust:\\nsafe, fast, productive.\\nPick three.\\nDuct tape.";
        assert_eq!(vec!["safe, fast, productive."], search(query, contents));
    }
}`,
    tags: ['search', 'tests', 'tdd'],
  },
  {
    id: 'rs-ch12-c-061',
    chapter: 12,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Search Using filter and collect',
    prompt: `Rewrite the search function in iterator style. Implement \`search<'a>(query: &str, contents: &'a str) -> Vec<&'a str>\` using \`contents.lines().filter(...).collect()\` instead of a manual loop.

In \`main\`, search "to" in the text below and print each match.

Text:
to be
or not
to think

Expected output:
to be
to think`,
    hints: [
      'lines() gives an iterator of &str.',
      'filter takes a closure returning bool; keep lines containing query.',
      'collect into a Vec<&str>.',
    ],
    solution: `fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    contents
        .lines()
        .filter(|line| line.contains(query))
        .collect()
}

fn main() {
    let contents = "\\
to be
or not
to think";
    for line in search("to", contents) {
        println!("{}", line);
    }
}`,
    starter: `fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    // TODO: use lines().filter(...).collect()
}

fn main() {
    let contents = "\\
to be
or not
to think";
    for line in search("to", contents) {
        println!("{}", line);
    }
}`,
    tags: ['search', 'iterator', 'filter'],
  },
  {
    id: 'rs-ch12-c-062',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Two Tests for Case Sensitivity',
    prompt: `Write \`search\` (case-sensitive) and \`search_case_insensitive\` and two tests that both pass under \`cargo test\`:
- \`case_sensitive\`: searching "duct" in "Rust:\\nsafe, fast, productive.\\nDuct tape." returns \`vec!["safe, fast, productive."]\`.
- \`case_insensitive\`: searching "rUsT" in "Rust:\\nsafe, fast, productive.\\nTrust me." returns \`vec!["Rust:", "Trust me."]\`.`,
    hints: [
      'The insensitive version lowercases both query and each line.',
      'Both functions return Vec of borrowed lines.',
      'Put both tests in one #[cfg(test)] module.',
    ],
    solution: `pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    contents.lines().filter(|l| l.contains(query)).collect()
}

pub fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let query = query.to_lowercase();
    contents
        .lines()
        .filter(|l| l.to_lowercase().contains(&query))
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn case_sensitive() {
        let contents = "Rust:\\nsafe, fast, productive.\\nDuct tape.";
        assert_eq!(vec!["safe, fast, productive."], search("duct", contents));
    }

    #[test]
    fn case_insensitive() {
        let contents = "Rust:\\nsafe, fast, productive.\\nTrust me.";
        assert_eq!(
            vec!["Rust:", "Trust me."],
            search_case_insensitive("rUsT", contents)
        );
    }
}`,
    starter: `pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    todo!()
}

pub fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    todo!()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn case_sensitive() {
        let contents = "Rust:\\nsafe, fast, productive.\\nDuct tape.";
        assert_eq!(vec!["safe, fast, productive."], search("duct", contents));
    }

    #[test]
    fn case_insensitive() {
        let contents = "Rust:\\nsafe, fast, productive.\\nTrust me.";
        assert_eq!(
            vec!["Rust:", "Trust me."],
            search_case_insensitive("rUsT", contents)
        );
    }
}`,
    tags: ['tests', 'search', 'case-insensitive'],
  },
  {
    id: 'rs-ch12-c-063',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'run Returns Box dyn Error',
    prompt: `Use the trait-object error type the chapter introduces. Write \`fn run(path: &str, query: &str) -> Result<(), Box<dyn std::error::Error>>\` that reads \`path\` with \`fs::read_to_string\` using the \`?\` operator, then prints each line containing \`query\`, and returns \`Ok(())\`.

In \`main\`, first \`fs::write\` the text "alpha\\nbeta\\ngamma" to "words.txt", then call \`run\` and handle any error with \`eprintln!\` plus \`process::exit(1)\`. Search for "a".

Expected stdout:
alpha
beta
gamma`,
    hints: [
      'The ? operator converts the io::Error into Box<dyn Error> automatically.',
      'Return Ok(()) at the end of run.',
      'Use if let Err(e) = run(...) in main to print and exit.',
    ],
    solution: `use std::error::Error;
use std::fs;
use std::process;

fn run(path: &str, query: &str) -> Result<(), Box<dyn Error>> {
    let contents = fs::read_to_string(path)?;
    for line in contents.lines() {
        if line.contains(query) {
            println!("{}", line);
        }
    }
    Ok(())
}

fn main() {
    fs::write("words.txt", "alpha\\nbeta\\ngamma").unwrap();
    if let Err(e) = run("words.txt", "a") {
        eprintln!("Application error: {}", e);
        process::exit(1);
    }
}`,
    starter: `use std::error::Error;
use std::fs;
use std::process;

fn run(path: &str, query: &str) -> Result<(), Box<dyn Error>> {
    // TODO: read the file with ?, print matching lines, return Ok(())
}

fn main() {
    fs::write("words.txt", "alpha\\nbeta\\ngamma").unwrap();
    if let Err(e) = run("words.txt", "a") {
        eprintln!("Application error: {}", e);
        process::exit(1);
    }
}`,
    tags: ['run', 'box-dyn-error', 'question-mark'],
  },
  {
    id: 'rs-ch12-c-064',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Propagate the File Read Error',
    prompt: `Show that \`?\` propagates a real error. Write \`fn run(path: &str) -> Result<usize, Box<dyn std::error::Error>>\` that reads \`path\` with \`?\` and returns the number of lines.

In \`main\`, call \`run\` on a path that does not exist, "definitely-missing-file.txt", inside a \`match\`. On \`Err\`, print "could not read file" to stderr. Do not unwrap the missing file.

Expected stderr:
could not read file`,
    hints: [
      'fs::read_to_string on a missing path returns Err, which ? returns from run.',
      'On the happy path return Ok(contents.lines().count()).',
      'Match the result in main and eprintln! on Err.',
    ],
    solution: `use std::error::Error;
use std::fs;

fn run(path: &str) -> Result<usize, Box<dyn Error>> {
    let contents = fs::read_to_string(path)?;
    Ok(contents.lines().count())
}

fn main() {
    match run("definitely-missing-file.txt") {
        Ok(n) => println!("lines: {}", n),
        Err(_e) => eprintln!("could not read file"),
    }
}`,
    starter: `use std::error::Error;
use std::fs;

fn run(path: &str) -> Result<usize, Box<dyn Error>> {
    // TODO: read with ? and return the line count
}

fn main() {
    match run("definitely-missing-file.txt") {
        Ok(n) => println!("lines: {}", n),
        Err(_e) => eprintln!("could not read file"),
    }
}`,
    tags: ['error-propagation', 'box-dyn-error', 'fs'],
  },
  {
    id: 'rs-ch12-c-065',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Full minigrep Pipeline in One File',
    prompt: `Assemble the whole chapter project in a single file. Provide:
- \`struct Config { query: String, file_path: String, ignore_case: bool }\`
- \`Config::build(args: &[String]) -> Result<Config, &'static str>\` (error "not enough arguments" if fewer than 3 args; read \`ignore_case\` from \`env::var("IGNORE_CASE").is_ok()\`)
- \`run(config: &Config) -> Result<(), Box<dyn std::error::Error>>\` that reads the file and prints matching lines using the case-sensitive or case-insensitive search per the flag
- \`search\` and \`search_case_insensitive\`

In \`main\`: write "Rust:\\nTrust me.\\nPick three." to "mini.txt", set IGNORE_CASE, build a Config from \`["minigrep", "rust", "mini.txt"]\`, run it, and on any error print to stderr and \`process::exit(1)\`.

Expected stdout:
Rust:
Trust me.`,
    hints: [
      'build reads the env var to fill ignore_case; the args provide query and path.',
      'run chooses the search variant with an if on config.ignore_case.',
      'Use ? inside run and unwrap_or_else / if let in main for exit handling.',
    ],
    solution: `use std::env;
use std::error::Error;
use std::fs;
use std::process;

struct Config {
    query: String,
    file_path: String,
    ignore_case: bool,
}

impl Config {
    fn build(args: &[String]) -> Result<Config, &'static str> {
        if args.len() < 3 {
            return Err("not enough arguments");
        }
        let ignore_case = env::var("IGNORE_CASE").is_ok();
        Ok(Config {
            query: args[1].clone(),
            file_path: args[2].clone(),
            ignore_case,
        })
    }
}

fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    contents.lines().filter(|l| l.contains(query)).collect()
}

fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let q = query.to_lowercase();
    contents
        .lines()
        .filter(|l| l.to_lowercase().contains(&q))
        .collect()
}

fn run(config: &Config) -> Result<(), Box<dyn Error>> {
    let contents = fs::read_to_string(&config.file_path)?;
    let results = if config.ignore_case {
        search_case_insensitive(&config.query, &contents)
    } else {
        search(&config.query, &contents)
    };
    for line in results {
        println!("{}", line);
    }
    Ok(())
}

fn main() {
    fs::write("mini.txt", "Rust:\\nTrust me.\\nPick three.").unwrap();
    env::set_var("IGNORE_CASE", "1");

    let args = vec![
        String::from("minigrep"),
        String::from("rust"),
        String::from("mini.txt"),
    ];
    let config = Config::build(&args).unwrap_or_else(|err| {
        eprintln!("Problem parsing arguments: {}", err);
        process::exit(1);
    });
    if let Err(e) = run(&config) {
        eprintln!("Application error: {}", e);
        process::exit(1);
    }
}`,
    starter: `use std::env;
use std::error::Error;
use std::fs;
use std::process;

struct Config {
    query: String,
    file_path: String,
    ignore_case: bool,
}

impl Config {
    fn build(args: &[String]) -> Result<Config, &'static str> {
        // TODO: validate args, read IGNORE_CASE, build Config
    }
}

fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    // TODO
    todo!()
}

fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    // TODO
    todo!()
}

fn run(config: &Config) -> Result<(), Box<dyn Error>> {
    // TODO: read file with ?, choose search variant, print matches
}

fn main() {
    fs::write("mini.txt", "Rust:\\nTrust me.\\nPick three.").unwrap();
    env::set_var("IGNORE_CASE", "1");

    let args = vec![
        String::from("minigrep"),
        String::from("rust"),
        String::from("mini.txt"),
    ];
    let config = Config::build(&args).unwrap_or_else(|err| {
        eprintln!("Problem parsing arguments: {}", err);
        process::exit(1);
    });
    if let Err(e) = run(&config) {
        eprintln!("Application error: {}", e);
        process::exit(1);
    }
}`,
    tags: ['minigrep', 'config', 'run'],
  },
  {
    id: 'rs-ch12-c-066',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Build Config from an Args Iterator',
    prompt: `Build \`Config\` directly from an iterator instead of indexing a slice, as the chapter's improved version does. Implement \`Config::build(mut args: impl Iterator<Item = String>) -> Result<Config, &'static str>\`. Skip the first item (program name). Take the next for \`query\` (error "Didn't get a query string" if missing) and the next for \`file_path\` (error "Didn't get a file path" if missing).

In \`main\`, call it with \`env::args()\` after seeding via a constructed vector's \`into_iter()\`: pass \`vec!["prog", "needle", "hay.txt"].into_iter().map(String::from)\` and print:
needle hay.txt`,
    hints: [
      'Call args.next() once to discard the program name.',
      'Use match on args.next() to get Some(value) or return the error.',
      'The parameter type uses impl Iterator<Item = String>.',
    ],
    solution: `struct Config {
    query: String,
    file_path: String,
}

impl Config {
    fn build(mut args: impl Iterator<Item = String>) -> Result<Config, &'static str> {
        args.next();

        let query = match args.next() {
            Some(arg) => arg,
            None => return Err("Didn't get a query string"),
        };

        let file_path = match args.next() {
            Some(arg) => arg,
            None => return Err("Didn't get a file path"),
        };

        Ok(Config { query, file_path })
    }
}

fn main() {
    let raw = vec!["prog", "needle", "hay.txt"];
    let args = raw.into_iter().map(String::from);
    let config = Config::build(args).unwrap();
    println!("{} {}", config.query, config.file_path);
}`,
    starter: `struct Config {
    query: String,
    file_path: String,
}

impl Config {
    fn build(mut args: impl Iterator<Item = String>) -> Result<Config, &'static str> {
        // TODO: skip program name, then take query and file_path with errors
    }
}

fn main() {
    let raw = vec!["prog", "needle", "hay.txt"];
    let args = raw.into_iter().map(String::from);
    let config = Config::build(args).unwrap();
    println!("{} {}", config.query, config.file_path);
}`,
    tags: ['config', 'iterator', 'refactor'],
  },
  {
    id: 'rs-ch12-c-067',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Case-Insensitive Search with Lifetime Test',
    prompt: `Implement \`search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str>\` and prove the returned references outlive a temporary query. Write a test \`outlives_query\` that builds the query from a \`String\`, calls the function, and asserts the result equals \`vec!["Rust:", "Trust me."]\` for contents "Rust:\\nsafe code\\nTrust me.".

The code must pass \`cargo test\`. The point is that the result borrows from \`contents\`, not from \`query\`.`,
    hints: [
      'Only contents carries the named lifetime; query does not.',
      'Lowercase query into an owned String inside the function.',
      'In the test, drop or shadow the query after the call to confirm results still hold.',
    ],
    solution: `pub fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let query = query.to_lowercase();
    contents
        .lines()
        .filter(|line| line.to_lowercase().contains(&query))
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn outlives_query() {
        let contents = "Rust:\\nsafe code\\nTrust me.";
        let results = {
            let query = String::from("rust");
            search_case_insensitive(&query, contents)
        };
        assert_eq!(vec!["Rust:", "Trust me."], results);
    }
}`,
    starter: `pub fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    // TODO: lowercase query, filter lines case-insensitively
    todo!()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn outlives_query() {
        let contents = "Rust:\\nsafe code\\nTrust me.";
        let results = {
            let query = String::from("rust");
            search_case_insensitive(&query, contents)
        };
        assert_eq!(vec!["Rust:", "Trust me."], results);
    }
}`,
    tags: ['lifetimes', 'case-insensitive', 'tests'],
  },
  {
    id: 'rs-ch12-c-068',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Distinguish Missing-File from No-Matches Exit Codes',
    prompt: `Write \`fn run(path: &str, query: &str) -> Result<usize, Box<dyn std::error::Error>>\` that reads the file with \`?\`, prints matching lines, and returns the count of matches.

In \`main\`, write "a\\nb\\nc" to "codes.txt", then call \`run("codes.txt", "z")\`. Behavior:
- If \`run\` returns \`Err\`, print "read error" to stderr and \`process::exit(2)\`.
- If it returns \`Ok(0)\` (no matches), print "no matches" to stderr and \`process::exit(1)\`.
- Otherwise exit normally.

Since "z" matches nothing, expected stderr:
no matches`,
    hints: [
      'Use a match on the Result with arms for Err, Ok(0), and Ok(_).',
      'Different conditions map to different process::exit codes.',
      'Return the match count from run with Ok(count).',
    ],
    solution: `use std::error::Error;
use std::fs;
use std::process;

fn run(path: &str, query: &str) -> Result<usize, Box<dyn Error>> {
    let contents = fs::read_to_string(path)?;
    let mut count = 0;
    for line in contents.lines() {
        if line.contains(query) {
            println!("{}", line);
            count += 1;
        }
    }
    Ok(count)
}

fn main() {
    fs::write("codes.txt", "a\\nb\\nc").unwrap();
    match run("codes.txt", "z") {
        Err(_e) => {
            eprintln!("read error");
            process::exit(2);
        }
        Ok(0) => {
            eprintln!("no matches");
            process::exit(1);
        }
        Ok(_) => {}
    }
}`,
    starter: `use std::error::Error;
use std::fs;
use std::process;

fn run(path: &str, query: &str) -> Result<usize, Box<dyn Error>> {
    // TODO: read with ?, print matches, return the count
}

fn main() {
    fs::write("codes.txt", "a\\nb\\nc").unwrap();
    match run("codes.txt", "z") {
        // TODO: Err -> "read error", exit(2)
        // TODO: Ok(0) -> "no matches", exit(1)
        // TODO: Ok(_) -> normal
    }
}`,
    tags: ['exit-code', 'error-handling', 'box-dyn-error'],
  },
  {
    id: 'rs-ch12-c-069',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Search Function Using flat_map Returning Indices',
    prompt: `Write \`fn matching_indices(query: &str, contents: &str) -> Vec<usize>\` that returns the zero-based indices of lines containing \`query\`, built with iterator adapters: \`enumerate\`, \`filter\`, \`map\`, and \`collect\`.

In \`main\`, run it on the text below for "x" and print the resulting vector with \`{:?}\`.

Text:
no
xyz
yes
xx

Expected output:
[1, 3]`,
    hints: [
      'enumerate first so you keep each line index.',
      'filter on the line part of the (i, line) tuple.',
      'map each survivor to just its index, then collect into Vec<usize>.',
    ],
    solution: `fn matching_indices(query: &str, contents: &str) -> Vec<usize> {
    contents
        .lines()
        .enumerate()
        .filter(|(_, line)| line.contains(query))
        .map(|(i, _)| i)
        .collect()
}

fn main() {
    let contents = "\\
no
xyz
yes
xx";
    println!("{:?}", matching_indices("x", contents));
}`,
    starter: `fn matching_indices(query: &str, contents: &str) -> Vec<usize> {
    // TODO: enumerate, filter, map to index, collect
}

fn main() {
    let contents = "\\
no
xyz
yes
xx";
    println!("{:?}", matching_indices("x", contents));
}`,
    tags: ['search', 'iterator', 'enumerate'],
  },
  {
    id: 'rs-ch12-c-070',
    chapter: 12,
    kind: 'coding',
    difficulty: 'hard',
    title: 'End-to-End minigrep with Tests and Exit Handling',
    prompt: `Capstone. In one file provide a library-style API and tests, then drive it from \`main\`:
- \`pub struct Config { pub query: String, pub file_path: String, pub ignore_case: bool }\`
- \`Config::build(args: &[String], ignore_case: bool) -> Result<Config, String>\` returning \`Err(format!("expected 2 args, got {}", args.len().saturating_sub(1)))\` when fewer than 3 args
- \`pub fn search<'a>(...) -> Vec<&'a str>\` and \`pub fn search_case_insensitive<'a>(...) -> Vec<&'a str>\`
- \`pub fn run(config: &Config) -> Result<(), Box<dyn std::error::Error>>\` that reads the file and prints matches per the flag
- a \`tests\` module with one test \`finds_insensitive\` asserting \`search_case_insensitive("rust", "Rust:\\nTrust me.")\` equals \`vec!["Rust:", "Trust me."]\`

In \`main\`: write "Rust:\\nTrust me.\\nnope" to "cap.txt", build with \`["minigrep", "rust", "cap.txt"]\` and \`true\`, and run; on any error \`eprintln!\` and \`process::exit(1)\`.

Expected stdout:
Rust:
Trust me.`,
    hints: [
      'build returns Err with an owned String using format!.',
      'run picks the search variant via if config.ignore_case.',
      'Keep the test module under #[cfg(test)] so cargo test exercises it.',
    ],
    solution: `use std::error::Error;
use std::fs;
use std::process;

pub struct Config {
    pub query: String,
    pub file_path: String,
    pub ignore_case: bool,
}

impl Config {
    pub fn build(args: &[String], ignore_case: bool) -> Result<Config, String> {
        if args.len() < 3 {
            return Err(format!("expected 2 args, got {}", args.len().saturating_sub(1)));
        }
        Ok(Config {
            query: args[1].clone(),
            file_path: args[2].clone(),
            ignore_case,
        })
    }
}

pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    contents.lines().filter(|l| l.contains(query)).collect()
}

pub fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let q = query.to_lowercase();
    contents
        .lines()
        .filter(|l| l.to_lowercase().contains(&q))
        .collect()
}

pub fn run(config: &Config) -> Result<(), Box<dyn Error>> {
    let contents = fs::read_to_string(&config.file_path)?;
    let results = if config.ignore_case {
        search_case_insensitive(&config.query, &contents)
    } else {
        search(&config.query, &contents)
    };
    for line in results {
        println!("{}", line);
    }
    Ok(())
}

fn main() {
    fs::write("cap.txt", "Rust:\\nTrust me.\\nnope").unwrap();
    let args = vec![
        String::from("minigrep"),
        String::from("rust"),
        String::from("cap.txt"),
    ];
    let config = Config::build(&args, true).unwrap_or_else(|err| {
        eprintln!("Problem parsing arguments: {}", err);
        process::exit(1);
    });
    if let Err(e) = run(&config) {
        eprintln!("Application error: {}", e);
        process::exit(1);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn finds_insensitive() {
        assert_eq!(
            vec!["Rust:", "Trust me."],
            search_case_insensitive("rust", "Rust:\\nTrust me.")
        );
    }
}`,
    starter: `use std::error::Error;
use std::fs;
use std::process;

pub struct Config {
    pub query: String,
    pub file_path: String,
    pub ignore_case: bool,
}

impl Config {
    pub fn build(args: &[String], ignore_case: bool) -> Result<Config, String> {
        // TODO: Err with format! when too few args, else build Config
        todo!()
    }
}

pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    todo!()
}

pub fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    todo!()
}

pub fn run(config: &Config) -> Result<(), Box<dyn Error>> {
    // TODO: read file with ?, choose variant, print matches, Ok(())
    todo!()
}

fn main() {
    fs::write("cap.txt", "Rust:\\nTrust me.\\nnope").unwrap();
    let args = vec![
        String::from("minigrep"),
        String::from("rust"),
        String::from("cap.txt"),
    ];
    let config = Config::build(&args, true).unwrap_or_else(|err| {
        eprintln!("Problem parsing arguments: {}", err);
        process::exit(1);
    });
    if let Err(e) = run(&config) {
        eprintln!("Application error: {}", e);
        process::exit(1);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn finds_insensitive() {
        assert_eq!(
            vec!["Rust:", "Trust me."],
            search_case_insensitive("rust", "Rust:\\nTrust me.")
        );
    }
}`,
    tags: ['minigrep', 'tests', 'capstone'],
  },
]

export default problems
