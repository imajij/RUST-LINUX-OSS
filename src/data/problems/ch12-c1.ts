import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch12-c-001',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Collect Command-Line Args',
    prompt: `In \`main\`, call \`std::env::args\` and collect the result into a \`Vec<String>\` named \`args\`. Then print the whole vector with \`println!("{:?}", args);\`.

When run with no extra arguments, the output will contain just the program path, for example \`["target/debug/minigrep"]\`.`,
    hints: [
      'Bring the function into scope with \`use std::env;\` then call \`env::args()\`.',
      'Use \`.collect()\` with a type annotation: \`let args: Vec<String> = env::args().collect();\`.',
    ],
    solution: `use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();
    println!("{:?}", args);
}`,
    starter: `use std::env;

fn main() {
    // TODO: collect env::args() into a Vec<String> named args and print it
}`,
    tags: ['env', 'args', 'collect'],
  },
  {
    id: 'rs-ch12-c-002',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Read the First Argument',
    prompt: `Collect the command-line arguments into \`let args: Vec<String> = env::args().collect();\`. The argument at index 0 is the program name. Read the argument at index 1 into a variable named \`query\` (clone it so you own a \`String\`), then print \`Searching for {query}\` using a normal \`println!\`.

To keep the program from panicking when you test it on the Playground, first push two fake entries so the vector always has them, like \`let args = vec![String::from("prog"), String::from("rust")];\`.`,
    hints: [
      'Index the vector with \`&args[1]\` to borrow the second element.',
      'Call \`.clone()\` to get an owned \`String\` you can store.',
    ],
    solution: `fn main() {
    let args = vec![String::from("prog"), String::from("rust")];
    let query = args[1].clone();
    println!("Searching for {query}");
}`,
    starter: `fn main() {
    let args = vec![String::from("prog"), String::from("rust")];
    // TODO: read index 1 into query (cloned) and print it
}`,
    tags: ['args', 'indexing', 'clone'],
  },
  {
    id: 'rs-ch12-c-003',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Two Args at Once',
    prompt: `Given \`let args = vec![String::from("prog"), String::from("frog"), String::from("poem.txt")];\`, read the query (index 1) and the file path (index 2) into two variables named \`query\` and \`file_path\` (clone each).

Print exactly:
\`Searching for frog\`
\`In file poem.txt\``,
    hints: [
      'Index 1 holds the query, index 2 holds the file path.',
      'Use two \`println!\` calls, one per line.',
    ],
    solution: `fn main() {
    let args = vec![String::from("prog"), String::from("frog"), String::from("poem.txt")];
    let query = args[1].clone();
    let file_path = args[2].clone();
    println!("Searching for {query}");
    println!("In file {file_path}");
}`,
    starter: `fn main() {
    let args = vec![String::from("prog"), String::from("frog"), String::from("poem.txt")];
    // TODO: read query (index 1) and file_path (index 2), then print both lines
}`,
    tags: ['args', 'indexing', 'clone'],
  },
  {
    id: 'rs-ch12-c-004',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Count the Arguments',
    prompt: `Collect \`env::args()\` into \`let args: Vec<String> = env::args().collect();\`. Print how many arguments were received using \`args.len()\`, in the form \`Got N arguments\`.

When run with no extra arguments the program receives just its own name, so it prints \`Got 1 arguments\`.`,
    hints: [
      'A \`Vec\` knows its size via the \`.len()\` method.',
      'Interpolate the length with \`println!("Got {} arguments", args.len());\`.',
    ],
    solution: `use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();
    println!("Got {} arguments", args.len());
}`,
    starter: `use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();
    // TODO: print the count of arguments
}`,
    tags: ['env', 'args', 'len'],
  },
  {
    id: 'rs-ch12-c-005',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Read a File to a String',
    prompt: `Use \`std::fs::read_to_string\` to read the file at path \`"poem.txt"\` into a \`String\` named \`contents\`. The function returns a \`Result\`; for this exercise unwrap it with \`.expect("should read the file")\`. Then print the contents.

On the Playground there is no such file, so this is about writing the correct call. Imagine the file exists.`,
    hints: [
      'Bring the module into scope with \`use std::fs;\`.',
      'Call \`fs::read_to_string("poem.txt").expect("should read the file")\`.',
    ],
    solution: `use std::fs;

fn main() {
    let contents = fs::read_to_string("poem.txt").expect("should read the file");
    println!("With text:\\n{contents}");
}`,
    starter: `use std::fs;

fn main() {
    // TODO: read "poem.txt" into contents with read_to_string + expect, then print
}`,
    tags: ['fs', 'read_to_string', 'expect'],
  },
  {
    id: 'rs-ch12-c-006',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print Each Line of Text',
    prompt: `Given a multi-line \`String\` of file contents, iterate over its lines and print each one prefixed with \`> \`. Use the \`.lines()\` method, which yields each line without its newline.

Use this fixed input:
\`let contents = String::from("alpha\\nbeta\\ngamma");\`
Expected output:
\`> alpha\`
\`> beta\`
\`> gamma\``,
    hints: [
      'A \`String\` has a \`.lines()\` method that returns an iterator over its lines.',
      'Use a \`for line in contents.lines()\` loop.',
    ],
    solution: `fn main() {
    let contents = String::from("alpha\\nbeta\\ngamma");
    for line in contents.lines() {
        println!("> {line}");
    }
}`,
    starter: `fn main() {
    let contents = String::from("alpha\\nbeta\\ngamma");
    // TODO: print each line prefixed with "> "
}`,
    tags: ['string', 'lines', 'iteration'],
  },
  {
    id: 'rs-ch12-c-007',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Does a Line Contain the Query',
    prompt: `Write nothing more than a \`main\` that checks whether a line contains a query word. Given \`let line = "fast and productive";\` and \`let query = "duct";\`, use the \`&str\` method \`.contains()\` to test if \`line\` contains \`query\`, and print \`true\` or \`false\`.

Expected output: \`true\``,
    hints: [
      'A string slice has a \`.contains(substring)\` method returning a \`bool\`.',
      'You can print a bool directly with \`println!("{}", line.contains(query));\`.',
    ],
    solution: `fn main() {
    let line = "fast and productive";
    let query = "duct";
    println!("{}", line.contains(query));
}`,
    starter: `fn main() {
    let line = "fast and productive";
    let query = "duct";
    // TODO: print whether line contains query
}`,
    tags: ['str', 'contains', 'bool'],
  },
  {
    id: 'rs-ch12-c-008',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Lowercase a Query',
    prompt: `Case-insensitive search starts by lowercasing the query. Given \`let query = "RuSt";\`, use \`.to_lowercase()\` to produce a new \`String\` named \`lowered\`, then print it.

Expected output: \`rust\``,
    hints: [
      'The \`.to_lowercase()\` method on a \`&str\` returns an owned \`String\`.',
      'Store the result and print it with \`println!("{lowered}");\`.',
    ],
    solution: `fn main() {
    let query = "RuSt";
    let lowered = query.to_lowercase();
    println!("{lowered}");
}`,
    starter: `fn main() {
    let query = "RuSt";
    // TODO: lowercase the query into a String named lowered and print it
}`,
    tags: ['str', 'to_lowercase', 'case'],
  },
  {
    id: 'rs-ch12-c-009',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print an Error to Stderr',
    prompt: `Programs should send error messages to stderr, not stdout. Using \`eprintln!\`, print the message \`Problem parsing arguments: not enough arguments\` to standard error.

The whole task is one line inside \`main\`.`,
    hints: [
      'Use \`eprintln!\` exactly like \`println!\`, but it writes to stderr.',
    ],
    solution: `fn main() {
    eprintln!("Problem parsing arguments: not enough arguments");
}`,
    starter: `fn main() {
    // TODO: print the error message to stderr with eprintln!
}`,
    tags: ['eprintln', 'stderr', 'errors'],
  },
  {
    id: 'rs-ch12-c-010',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Exit With Code 1',
    prompt: `When an error occurs, a CLI program should exit with a non-zero status code. In \`main\`, print \`fatal error\` to stderr with \`eprintln!\`, then call \`std::process::exit(1)\` to exit with code 1.`,
    hints: [
      'Bring it into scope with \`use std::process;\` then call \`process::exit(1);\`.',
      'Call \`eprintln!\` before exiting so the message is shown.',
    ],
    solution: `use std::process;

fn main() {
    eprintln!("fatal error");
    process::exit(1);
}`,
    starter: `use std::process;

fn main() {
    // TODO: print "fatal error" to stderr, then exit with code 1
}`,
    tags: ['process', 'exit', 'stderr'],
  },
  {
    id: 'rs-ch12-c-011',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Read an Environment Variable',
    prompt: `Use \`std::env::var\` to read the environment variable \`"IGNORE_CASE"\`. It returns a \`Result\`. Use \`.is_ok()\` to turn that into a \`bool\` named \`ignore_case\` (true when the variable is set), then print the bool.

On the Playground the variable is not set, so the output will be \`false\`.`,
    hints: [
      'Call \`env::var("IGNORE_CASE")\` which returns a \`Result<String, _>\`.',
      'The \`Result\` method \`.is_ok()\` returns \`true\` when the variable was present.',
    ],
    solution: `use std::env;

fn main() {
    let ignore_case = env::var("IGNORE_CASE").is_ok();
    println!("{ignore_case}");
}`,
    starter: `use std::env;

fn main() {
    // TODO: set ignore_case to whether IGNORE_CASE is present, then print it
}`,
    tags: ['env', 'var', 'is_ok'],
  },
  {
    id: 'rs-ch12-c-012',
    chapter: 12,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Simple Config Struct',
    prompt: `Define a struct named \`Config\` with two \`String\` fields: \`query\` and \`file_path\`. In \`main\`, build one directly with \`Config { query: String::from("frog"), file_path: String::from("poem.txt") }\` and print both fields, one per line, as \`query = frog\` and \`file = poem.txt\`.`,
    hints: [
      'Declare the struct with two \`String\` fields above \`main\`.',
      'Access fields with \`config.query\` and \`config.file_path\`.',
    ],
    solution: `struct Config {
    query: String,
    file_path: String,
}

fn main() {
    let config = Config {
        query: String::from("frog"),
        file_path: String::from("poem.txt"),
    };
    println!("query = {}", config.query);
    println!("file = {}", config.file_path);
}`,
    starter: `struct Config {
    query: String,
    file_path: String,
}

fn main() {
    // TODO: build a Config and print its fields
}`,
    tags: ['struct', 'config', 'fields'],
  },
  {
    id: 'rs-ch12-c-013',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Parse Config From a Slice',
    prompt: `Write a function \`parse_config(args: &[String]) -> Config\` that reads \`args[1]\` as the query and \`args[2]\` as the file path, cloning each into a \`Config\` (the struct with \`query\` and \`file_path\` \`String\` fields).

In \`main\`, build \`let args = vec![String::from("prog"), String::from("frog"), String::from("poem.txt")];\`, call \`parse_config(&args)\`, and print \`query = frog\` and \`file = poem.txt\`.`,
    hints: [
      'The parameter type \`&[String]\` is a slice that a \`&Vec<String>\` coerces into.',
      'Return \`Config { query: args[1].clone(), file_path: args[2].clone() }\`.',
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
    let args = vec![String::from("prog"), String::from("frog"), String::from("poem.txt")];
    let config = parse_config(&args);
    println!("query = {}", config.query);
    println!("file = {}", config.file_path);
}`,
    starter: `struct Config {
    query: String,
    file_path: String,
}

fn parse_config(args: &[String]) -> Config {
    // TODO: build a Config from args[1] and args[2]
    todo!()
}

fn main() {
    let args = vec![String::from("prog"), String::from("frog"), String::from("poem.txt")];
    let config = parse_config(&args);
    println!("query = {}", config.query);
    println!("file = {}", config.file_path);
}`,
    tags: ['config', 'slice', 'clone'],
  },
  {
    id: 'rs-ch12-c-014',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Config::build Returning Result',
    prompt: `Add an associated function \`Config::build(args: &[String]) -> Result<Config, String>\`. If \`args.len() < 3\`, return \`Err(String::from("not enough arguments"))\`. Otherwise clone \`args[1]\` and \`args[2]\` into a \`Config\` and return \`Ok(config)\`.

In \`main\`, call it on \`let args = vec![String::from("prog")];\` and print the error message. Expected output: \`Error: not enough arguments\`.`,
    hints: [
      'Define \`impl Config { fn build(...) -> Result<Config, String> { ... } }\`.',
      'Match on the result, or use \`if let Err(e) = ...\` to print \`Error: e\`.',
    ],
    solution: `struct Config {
    query: String,
    file_path: String,
}

impl Config {
    fn build(args: &[String]) -> Result<Config, String> {
        if args.len() < 3 {
            return Err(String::from("not enough arguments"));
        }
        let query = args[1].clone();
        let file_path = args[2].clone();
        Ok(Config { query, file_path })
    }
}

fn main() {
    let args = vec![String::from("prog")];
    match Config::build(&args) {
        Ok(_) => println!("ok"),
        Err(e) => println!("Error: {e}"),
    }
}`,
    starter: `struct Config {
    query: String,
    file_path: String,
}

impl Config {
    fn build(args: &[String]) -> Result<Config, String> {
        // TODO: return Err if too few args, else Ok(Config)
        todo!()
    }
}

fn main() {
    let args = vec![String::from("prog")];
    match Config::build(&args) {
        Ok(_) => println!("ok"),
        Err(e) => println!("Error: {e}"),
    }
}`,
    tags: ['config', 'build', 'result'],
  },
  {
    id: 'rs-ch12-c-015',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Build Succeeds With Enough Args',
    prompt: `Reuse \`Config::build(args: &[String]) -> Result<Config, String>\` that errors with \`"not enough arguments"\` when fewer than 3 args. In \`main\`, call it with \`let args = vec![String::from("prog"), String::from("body"), String::from("poem.txt")];\`. On \`Ok\`, print \`Searching for body in poem.txt\`; on \`Err\`, print the error.

Expected output: \`Searching for body in poem.txt\``,
    hints: [
      'Use a \`match\` on the \`Result\` returned by \`Config::build\`.',
      'On \`Ok(config)\` print \`Searching for {} in {}\` with the two fields.',
    ],
    solution: `struct Config {
    query: String,
    file_path: String,
}

impl Config {
    fn build(args: &[String]) -> Result<Config, String> {
        if args.len() < 3 {
            return Err(String::from("not enough arguments"));
        }
        Ok(Config {
            query: args[1].clone(),
            file_path: args[2].clone(),
        })
    }
}

fn main() {
    let args = vec![String::from("prog"), String::from("body"), String::from("poem.txt")];
    match Config::build(&args) {
        Ok(config) => println!("Searching for {} in {}", config.query, config.file_path),
        Err(e) => println!("Error: {e}"),
    }
}`,
    starter: `struct Config {
    query: String,
    file_path: String,
}

impl Config {
    fn build(args: &[String]) -> Result<Config, String> {
        if args.len() < 3 {
            return Err(String::from("not enough arguments"));
        }
        Ok(Config {
            query: args[1].clone(),
            file_path: args[2].clone(),
        })
    }
}

fn main() {
    let args = vec![String::from("prog"), String::from("body"), String::from("poem.txt")];
    // TODO: call Config::build and print the success or error message
}`,
    tags: ['config', 'build', 'match'],
  },
  {
    id: 'rs-ch12-c-016',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Search Returning Matching Lines',
    prompt: `Write \`fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str>\` that returns every line of \`contents\` that contains \`query\`, in order.

In \`main\`, test with \`let contents = "Rust:\\nsafe, fast, productive.\\nPick three.\\nTrust me.";\` and \`let query = "rust";\` is NOT what you want here — use \`let query = "Rust";\`. Print each returned line. Expected output: \`Rust:\``,
    hints: [
      'Create a mutable \`Vec\` of results, push lines where \`line.contains(query)\` is true.',
      'The lifetime in the signature ties the returned slices to \`contents\`, not to \`query\`.',
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
    let contents = "Rust:\\nsafe, fast, productive.\\nPick three.\\nTrust me.";
    let query = "Rust";
    for line in search(query, contents) {
        println!("{line}");
    }
}`,
    starter: `fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    // TODO: return all lines that contain query
    todo!()
}

fn main() {
    let contents = "Rust:\\nsafe, fast, productive.\\nPick three.\\nTrust me.";
    let query = "Rust";
    for line in search(query, contents) {
        println!("{line}");
    }
}`,
    tags: ['search', 'lifetimes', 'contains'],
  },
  {
    id: 'rs-ch12-c-017',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count the Matches',
    prompt: `Reuse \`fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str>\`. In \`main\`, with \`let contents = "duct tape\\nproductive\\nintroduction\\nclean";\` and \`let query = "duct";\`, print how many lines matched in the form \`3 matches\`.

Expected output: \`3 matches\``,
    hints: [
      'Call \`search\` and use \`.len()\` on the returned \`Vec\`.',
      'All of \`duct tape\`, \`productive\`, and \`introduction\` contain \`duct\`.',
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
    let contents = "duct tape\\nproductive\\nintroduction\\nclean";
    let query = "duct";
    let results = search(query, contents);
    println!("{} matches", results.len());
}`,
    starter: `fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let mut results = Vec::new();
    for line in contents.lines() {
        if line.contains(query) {
            results.push(line);
        }
    }
    results
}

fn main() {
    let contents = "duct tape\\nproductive\\nintroduction\\nclean";
    let query = "duct";
    // TODO: print the number of matching lines as "N matches"
}`,
    tags: ['search', 'len', 'count'],
  },
  {
    id: 'rs-ch12-c-018',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Case-Insensitive Search',
    prompt: `Write \`fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str>\`. Lowercase the query once into a \`String\`, then for each line compare \`line.to_lowercase().contains(&query)\` where \`query\` is the lowercased query.

In \`main\`, test with \`let contents = "Rust:\\nTrust me.\\nNo match here.";\` and \`let query = "rUsT";\`. Print each matching line. Expected output:
\`Rust:\`
\`Trust me.\``,
    hints: [
      'Compute \`let query = query.to_lowercase();\` once before the loop.',
      'Since \`query\` is now a \`String\`, pass \`&query\` to \`contains\` because it expects a \`&str\`.',
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
    let contents = "Rust:\\nTrust me.\\nNo match here.";
    let query = "rUsT";
    for line in search_case_insensitive(query, contents) {
        println!("{line}");
    }
}`,
    starter: `fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    // TODO: lowercase query once, then match lines case-insensitively
    todo!()
}

fn main() {
    let contents = "Rust:\\nTrust me.\\nNo match here.";
    let query = "rUsT";
    for line in search_case_insensitive(query, contents) {
        println!("{line}");
    }
}`,
    tags: ['search', 'case', 'to_lowercase'],
  },
  {
    id: 'rs-ch12-c-019',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'TDD a Search Function',
    prompt: `Practice the test-driven style from the chapter. Write \`fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str>\` and a unit test \`one_result\` inside a \`#[cfg(test)] mod tests\` block that asserts \`search("duct", "Rust:\\nsafe, fast, productive.\\nPick three.")\` equals \`vec!["safe, fast, productive."]\`.

Also keep a tiny \`main\` so the file runs. Make the test pass.`,
    hints: [
      'Put the test inside \`mod tests\` with \`use super::*;\` to access \`search\`.',
      'Assert with \`assert_eq!(vec!["safe, fast, productive."], search(query, contents));\`.',
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
    println!("run the tests with cargo test");
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
    starter: `fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    // TODO: implement search so the test passes
    todo!()
}

fn main() {
    println!("run the tests with cargo test");
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
    tags: ['search', 'tdd', 'tests'],
  },
  {
    id: 'rs-ch12-c-020',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Test Case-Insensitive Search',
    prompt: `Write \`fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str>\` and a test named \`case_insensitive\` that asserts \`search_case_insensitive("rUsT", "Rust:\\nTrust me.")\` equals \`vec!["Rust:", "Trust me."]\`.

Keep a tiny \`main\` so the file runs. Make the test pass.`,
    hints: [
      'Lowercase the query and each line before comparing with \`contains\`.',
      'Both \`Rust:\` and \`Trust me.\` contain \`rust\` once lowercased.',
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
    println!("run the tests with cargo test");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn case_insensitive() {
        let query = "rUsT";
        let contents = "Rust:\\nTrust me.";
        assert_eq!(
            vec!["Rust:", "Trust me."],
            search_case_insensitive(query, contents)
        );
    }
}`,
    starter: `fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    // TODO: implement case-insensitive search so the test passes
    todo!()
}

fn main() {
    println!("run the tests with cargo test");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn case_insensitive() {
        let query = "rUsT";
        let contents = "Rust:\\nTrust me.";
        assert_eq!(
            vec!["Rust:", "Trust me."],
            search_case_insensitive(query, contents)
        );
    }
}`,
    tags: ['search', 'case', 'tests'],
  },
  {
    id: 'rs-ch12-c-021',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Config Carries ignore_case',
    prompt: `Extend \`Config\` to have three fields: \`query: String\`, \`file_path: String\`, and \`ignore_case: bool\`. In \`Config::build(args: &[String]) -> Result<Config, String>\`, set \`ignore_case\` from whether the \`"IGNORE_CASE"\` environment variable is present (use \`env::var("IGNORE_CASE").is_ok()\`).

In \`main\`, build from \`vec![String::from("prog"), String::from("to"), String::from("poem.txt")]\` and print \`ignore_case = false\` (the var is not set on the Playground).`,
    hints: [
      'Add \`use std::env;\` and compute \`let ignore_case = env::var("IGNORE_CASE").is_ok();\`.',
      'Include \`ignore_case\` in the returned \`Config\`.',
    ],
    solution: `use std::env;

struct Config {
    query: String,
    file_path: String,
    ignore_case: bool,
}

impl Config {
    fn build(args: &[String]) -> Result<Config, String> {
        if args.len() < 3 {
            return Err(String::from("not enough arguments"));
        }
        let ignore_case = env::var("IGNORE_CASE").is_ok();
        Ok(Config {
            query: args[1].clone(),
            file_path: args[2].clone(),
            ignore_case,
        })
    }
}

fn main() {
    let args = vec![String::from("prog"), String::from("to"), String::from("poem.txt")];
    let config = Config::build(&args).unwrap();
    println!("ignore_case = {}", config.ignore_case);
}`,
    starter: `use std::env;

struct Config {
    query: String,
    file_path: String,
    ignore_case: bool,
}

impl Config {
    fn build(args: &[String]) -> Result<Config, String> {
        if args.len() < 3 {
            return Err(String::from("not enough arguments"));
        }
        // TODO: read IGNORE_CASE and include ignore_case in the Config
        todo!()
    }
}

fn main() {
    let args = vec![String::from("prog"), String::from("to"), String::from("poem.txt")];
    let config = Config::build(&args).unwrap();
    println!("ignore_case = {}", config.ignore_case);
}`,
    tags: ['config', 'env', 'ignore_case'],
  },
  {
    id: 'rs-ch12-c-022',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Choose Search By a Flag',
    prompt: `Given both \`search\` and \`search_case_insensitive\` (each \`fn(query: &str, contents: &str) -> Vec<&str>\` with the right lifetimes), write \`fn run(query: &str, contents: &str, ignore_case: bool)\` that calls the case-insensitive variant when \`ignore_case\` is true, otherwise the regular one, and prints each resulting line.

In \`main\`, call \`run("rust", "Rust is great.\\nplain text", true)\`. Expected output: \`Rust is great.\``,
    hints: [
      'Choose which result \`Vec\` to use with an \`if ignore_case { ... } else { ... }\`.',
      'You can bind \`let results = if ignore_case { ... } else { ... };\` then loop over it.',
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

fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let query = query.to_lowercase();
    let mut results = Vec::new();
    for line in contents.lines() {
        if line.to_lowercase().contains(&query) {
            results.push(line);
        }
    }
    results
}

fn run(query: &str, contents: &str, ignore_case: bool) {
    let results = if ignore_case {
        search_case_insensitive(query, contents)
    } else {
        search(query, contents)
    };
    for line in results {
        println!("{line}");
    }
}

fn main() {
    run("rust", "Rust is great.\\nplain text", true);
}`,
    starter: `fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let mut results = Vec::new();
    for line in contents.lines() {
        if line.contains(query) {
            results.push(line);
        }
    }
    results
}

fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let query = query.to_lowercase();
    let mut results = Vec::new();
    for line in contents.lines() {
        if line.to_lowercase().contains(&query) {
            results.push(line);
        }
    }
    results
}

fn run(query: &str, contents: &str, ignore_case: bool) {
    // TODO: pick the search function based on ignore_case and print each line
}

fn main() {
    run("rust", "Rust is great.\\nplain text", true);
}`,
    tags: ['run', 'flag', 'search'],
  },
  {
    id: 'rs-ch12-c-023',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Handle build With unwrap_or_else',
    prompt: `Use the idiom from the chapter. Given \`Config::build(args: &[String]) -> Result<Config, String>\` that returns \`Err(String::from("not enough arguments"))\` when too few args, call it in \`main\` with \`Config::build(&args).unwrap_or_else(|err| { ... })\`. In the closure, print \`Problem parsing arguments: {err}\` to stderr with \`eprintln!\` and call \`process::exit(1)\`.

Use \`let args = vec![String::from("prog")];\` so the error path runs.`,
    hints: [
      '\`unwrap_or_else\` takes a closure that receives the error and must produce a \`Config\` or diverge.',
      'Calling \`process::exit(1)\` never returns, so the closure type-checks.',
    ],
    solution: `use std::process;

struct Config {
    query: String,
    file_path: String,
}

impl Config {
    fn build(args: &[String]) -> Result<Config, String> {
        if args.len() < 3 {
            return Err(String::from("not enough arguments"));
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
        eprintln!("Problem parsing arguments: {err}");
        process::exit(1);
    });
    println!("query = {}", config.query);
}`,
    starter: `use std::process;

struct Config {
    query: String,
    file_path: String,
}

impl Config {
    fn build(args: &[String]) -> Result<Config, String> {
        if args.len() < 3 {
            return Err(String::from("not enough arguments"));
        }
        Ok(Config {
            query: args[1].clone(),
            file_path: args[2].clone(),
        })
    }
}

fn main() {
    let args = vec![String::from("prog")];
    // TODO: use unwrap_or_else to print to stderr and exit(1) on Err
}`,
    tags: ['unwrap_or_else', 'closure', 'process'],
  },
  {
    id: 'rs-ch12-c-024',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A run Function Returning Result',
    prompt: `Write \`fn run(contents: String) -> Result<(), String>\`. If \`contents\` is empty, return \`Err(String::from("empty file"))\`; otherwise print the contents and return \`Ok(())\`.

In \`main\`, call \`run(String::from("hello world"))\` and ignore the result for now (you may use \`let _ = run(...);\`). Expected output: \`hello world\``,
    hints: [
      'The unit type \`()\` is the success value when there is nothing meaningful to return.',
      'Check \`contents.is_empty()\` before printing.',
    ],
    solution: `fn run(contents: String) -> Result<(), String> {
    if contents.is_empty() {
        return Err(String::from("empty file"));
    }
    println!("{contents}");
    Ok(())
}

fn main() {
    let _ = run(String::from("hello world"));
}`,
    starter: `fn run(contents: String) -> Result<(), String> {
    // TODO: Err on empty, otherwise print and return Ok(())
    todo!()
}

fn main() {
    let _ = run(String::from("hello world"));
}`,
    tags: ['run', 'result', 'unit'],
  },
  {
    id: 'rs-ch12-c-025',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Handle run Errors in main',
    prompt: `Given \`fn run(config: &Config) -> Result<(), String>\` that returns \`Err(String::from("could not read file"))\` when \`config.file_path\` equals \`"missing.txt"\`, handle it in \`main\` with \`if let Err(e) = run(&config) { ... }\`. Inside, print \`Application error: {e}\` to stderr and call \`process::exit(1)\`.

Build the \`Config\` so \`file_path\` is \`"missing.txt"\` to trigger the error path.`,
    hints: [
      'Use \`if let Err(e) = run(&config)\` to act only on the error case.',
      'Print with \`eprintln!\` and then \`process::exit(1);\`.',
    ],
    solution: `use std::process;

struct Config {
    query: String,
    file_path: String,
}

fn run(config: &Config) -> Result<(), String> {
    if config.file_path == "missing.txt" {
        return Err(String::from("could not read file"));
    }
    println!("searching for {}", config.query);
    Ok(())
}

fn main() {
    let config = Config {
        query: String::from("the"),
        file_path: String::from("missing.txt"),
    };
    if let Err(e) = run(&config) {
        eprintln!("Application error: {e}");
        process::exit(1);
    }
}`,
    starter: `use std::process;

struct Config {
    query: String,
    file_path: String,
}

fn run(config: &Config) -> Result<(), String> {
    if config.file_path == "missing.txt" {
        return Err(String::from("could not read file"));
    }
    println!("searching for {}", config.query);
    Ok(())
}

fn main() {
    let config = Config {
        query: String::from("the"),
        file_path: String::from("missing.txt"),
    };
    // TODO: if run returns Err, print "Application error: e" to stderr and exit(1)
}`,
    tags: ['run', 'if-let', 'process'],
  },
  {
    id: 'rs-ch12-c-026',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Propagate File Errors With ?',
    prompt: `Write \`fn run(path: &str) -> Result<(), std::io::Error>\` that calls \`std::fs::read_to_string(path)?\` to read a file, prints its length in the form \`read N bytes\`, and returns \`Ok(())\`. The \`?\` operator should propagate any I/O error.

In \`main\`, call \`run("poem.txt")\` and use \`if let Err(e) = ...\` to print the error to stderr. (On the Playground the file is missing, so the error branch runs.)`,
    hints: [
      'The \`?\` after \`read_to_string(path)\` returns early on \`Err\`.',
      'Use \`contents.len()\` for the byte count.',
    ],
    solution: `use std::fs;

fn run(path: &str) -> Result<(), std::io::Error> {
    let contents = fs::read_to_string(path)?;
    println!("read {} bytes", contents.len());
    Ok(())
}

fn main() {
    if let Err(e) = run("poem.txt") {
        eprintln!("error: {e}");
    }
}`,
    starter: `use std::fs;

fn run(path: &str) -> Result<(), std::io::Error> {
    // TODO: read the file with ?, print its byte length, return Ok(())
    todo!()
}

fn main() {
    if let Err(e) = run("poem.txt") {
        eprintln!("error: {e}");
    }
}`,
    tags: ['question-mark', 'io', 'result'],
  },
  {
    id: 'rs-ch12-c-027',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Whole Pipeline Over a String',
    prompt: `Combine the pieces over an in-memory string. Write \`fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str>\`, then in \`main\` set \`let contents = "Rust:\\nsafe, fast, productive.\\nPick three.\\nDuct tape.";\` and \`let query = "duct";\`. Use \`search\` and print each matching line.

Expected output: \`Duct tape.\` is the only line containing lowercase \`duct\`... wait, it does not. Print whatever \`search("duct", contents)\` actually returns (no matches, so nothing is printed).`,
    hints: [
      'This is a case-sensitive search, so \`Duct\` does not match \`duct\`.',
      'When there are no matches, the loop simply prints nothing.',
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
    let contents = "Rust:\\nsafe, fast, productive.\\nPick three.\\nDuct tape.";
    let query = "duct";
    for line in search(query, contents) {
        println!("{line}");
    }
}`,
    starter: `fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    // TODO: return all lines containing query
    todo!()
}

fn main() {
    let contents = "Rust:\\nsafe, fast, productive.\\nPick three.\\nDuct tape.";
    let query = "duct";
    for line in search(query, contents) {
        println!("{line}");
    }
}`,
    tags: ['search', 'case', 'pipeline'],
  },
  {
    id: 'rs-ch12-c-028',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Refactor main Into build and run',
    prompt: `Refactor a monolithic flow into two functions over in-memory data. Write \`Config::build(args: &[String]) -> Result<Config, String>\` (errors with \`"not enough arguments"\`) and \`fn run(config: &Config, contents: &str)\` that prints each line of \`contents\` containing \`config.query\`.

In \`main\`, build from \`vec![String::from("prog"), String::from("safe"), String::from("poem.txt")]\`, unwrap, then call \`run(&config, "safe and sound\\nloud noise")\`. Expected output: \`safe and sound\``,
    hints: [
      'Keep \`Config::build\` focused on parsing; keep \`run\` focused on the work.',
      'Inside \`run\`, loop over \`contents.lines()\` and print those that \`.contains(&config.query)\`.',
    ],
    solution: `struct Config {
    query: String,
    file_path: String,
}

impl Config {
    fn build(args: &[String]) -> Result<Config, String> {
        if args.len() < 3 {
            return Err(String::from("not enough arguments"));
        }
        Ok(Config {
            query: args[1].clone(),
            file_path: args[2].clone(),
        })
    }
}

fn run(config: &Config, contents: &str) {
    for line in contents.lines() {
        if line.contains(&config.query) {
            println!("{line}");
        }
    }
}

fn main() {
    let args = vec![String::from("prog"), String::from("safe"), String::from("poem.txt")];
    let config = Config::build(&args).unwrap();
    run(&config, "safe and sound\\nloud noise");
}`,
    starter: `struct Config {
    query: String,
    file_path: String,
}

impl Config {
    fn build(args: &[String]) -> Result<Config, String> {
        // TODO: parse args into a Config, erroring when too few
        todo!()
    }
}

fn run(config: &Config, contents: &str) {
    // TODO: print each line of contents that contains config.query
}

fn main() {
    let args = vec![String::from("prog"), String::from("safe"), String::from("poem.txt")];
    let config = Config::build(&args).unwrap();
    run(&config, "safe and sound\\nloud noise");
}`,
    tags: ['refactor', 'config', 'run'],
  },
  {
    id: 'rs-ch12-c-029',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Error When Query Is Empty',
    prompt: `Add validation to \`Config::build(args: &[String]) -> Result<Config, String>\`. After the length check, if \`args[1]\` is an empty string, return \`Err(String::from("query is empty"))\`. Otherwise return the \`Config\`.

In \`main\`, call it with \`vec![String::from("prog"), String::from(""), String::from("poem.txt")]\` and print the error. Expected output: \`Error: query is empty\``,
    hints: [
      'Check \`args[1].is_empty()\` after confirming there are enough arguments.',
      'Return early with \`return Err(...)\` when the query is empty.',
    ],
    solution: `struct Config {
    query: String,
    file_path: String,
}

impl Config {
    fn build(args: &[String]) -> Result<Config, String> {
        if args.len() < 3 {
            return Err(String::from("not enough arguments"));
        }
        if args[1].is_empty() {
            return Err(String::from("query is empty"));
        }
        Ok(Config {
            query: args[1].clone(),
            file_path: args[2].clone(),
        })
    }
}

fn main() {
    let args = vec![String::from("prog"), String::from(""), String::from("poem.txt")];
    match Config::build(&args) {
        Ok(_) => println!("ok"),
        Err(e) => println!("Error: {e}"),
    }
}`,
    starter: `struct Config {
    query: String,
    file_path: String,
}

impl Config {
    fn build(args: &[String]) -> Result<Config, String> {
        if args.len() < 3 {
            return Err(String::from("not enough arguments"));
        }
        // TODO: also error when args[1] is empty
        Ok(Config {
            query: args[1].clone(),
            file_path: args[2].clone(),
        })
    }
}

fn main() {
    let args = vec![String::from("prog"), String::from(""), String::from("poem.txt")];
    match Config::build(&args) {
        Ok(_) => println!("ok"),
        Err(e) => println!("Error: {e}"),
    }
}`,
    tags: ['config', 'validation', 'result'],
  },
  {
    id: 'rs-ch12-c-030',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Toggle Case With an Argument',
    prompt: `Simulate the IGNORE_CASE toggle without an env var. Write \`fn run(query: &str, contents: &str, ignore_case: bool)\` that prints matching lines, lowercasing both sides when \`ignore_case\` is true.

In \`main\`, call it twice: once with \`run("RUST", "Rust rocks\\nplain", false)\` (prints nothing) and once with \`run("RUST", "Rust rocks\\nplain", true)\` (prints \`Rust rocks\`). Expected output: \`Rust rocks\``,
    hints: [
      'Branch on \`ignore_case\` inside the loop, or pre-lowercase the query once.',
      'When false, \`RUST\` does not match \`Rust\`; when true it does.',
    ],
    solution: `fn run(query: &str, contents: &str, ignore_case: bool) {
    let lowered_query = query.to_lowercase();
    for line in contents.lines() {
        let matched = if ignore_case {
            line.to_lowercase().contains(&lowered_query)
        } else {
            line.contains(query)
        };
        if matched {
            println!("{line}");
        }
    }
}

fn main() {
    run("RUST", "Rust rocks\\nplain", false);
    run("RUST", "Rust rocks\\nplain", true);
}`,
    starter: `fn run(query: &str, contents: &str, ignore_case: bool) {
    // TODO: print matching lines, case-insensitive when ignore_case is true
}

fn main() {
    run("RUST", "Rust rocks\\nplain", false);
    run("RUST", "Rust rocks\\nplain", true);
}`,
    tags: ['run', 'case', 'flag'],
  },
  {
    id: 'rs-ch12-c-031',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Stdout Versus Stderr',
    prompt: `Demonstrate the difference between normal output and diagnostics. In \`main\`, print \`result line\` to stdout with \`println!\` and \`diagnostic line\` to stderr with \`eprintln!\`.

When the program runs, both appear in the terminal, but only the stdout line is captured if you redirect stdout to a file.`,
    hints: [
      '\`println!\` goes to stdout; \`eprintln!\` goes to stderr.',
      'Order the two calls so \`result line\` prints first.',
    ],
    solution: `fn main() {
    println!("result line");
    eprintln!("diagnostic line");
}`,
    starter: `fn main() {
    // TODO: print one line to stdout and one to stderr
}`,
    tags: ['stdout', 'stderr', 'eprintln'],
  },
  {
    id: 'rs-ch12-c-032',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Exit Zero on Success',
    prompt: `Show explicit success exit handling. Write \`fn run(contents: &str) -> Result<usize, String>\` that returns \`Ok(contents.lines().count())\` (the number of lines). In \`main\`, match on it: on \`Ok(n)\` print \`{n} lines\` and call \`process::exit(0)\`; on \`Err(e)\` print \`error: {e}\` to stderr and call \`process::exit(1)\`.

Call \`run("a\\nb\\nc")\`. Expected output: \`3 lines\``,
    hints: [
      '\`contents.lines().count()\` gives the number of lines.',
      'Use a \`match\` and call \`process::exit\` with 0 or 1 in each arm.',
    ],
    solution: `use std::process;

fn run(contents: &str) -> Result<usize, String> {
    Ok(contents.lines().count())
}

fn main() {
    match run("a\\nb\\nc") {
        Ok(n) => {
            println!("{n} lines");
            process::exit(0);
        }
        Err(e) => {
            eprintln!("error: {e}");
            process::exit(1);
        }
    }
}`,
    starter: `use std::process;

fn run(contents: &str) -> Result<usize, String> {
    // TODO: return Ok with the number of lines
    todo!()
}

fn main() {
    match run("a\\nb\\nc") {
        // TODO: handle Ok(n) and Err(e), exiting 0 or 1
    }
}`,
    tags: ['process', 'exit', 'result'],
  },
  {
    id: 'rs-ch12-c-033',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Header Line Then Matches',
    prompt: `Write \`fn run(query: &str, contents: &str)\` that first prints \`Results for: {query}\`, then prints each line of \`contents\` containing \`query\`, prefixed with two spaces.

In \`main\`, call \`run("o", "foo\\nbar\\nzoo")\`. Expected output:
\`Results for: o\`
\`  foo\`
\`  zoo\``,
    hints: [
      'Print the header before the loop.',
      'Inside the loop, format with \`println!("  {line}");\`.',
    ],
    solution: `fn run(query: &str, contents: &str) {
    println!("Results for: {query}");
    for line in contents.lines() {
        if line.contains(query) {
            println!("  {line}");
        }
    }
}

fn main() {
    run("o", "foo\\nbar\\nzoo");
}`,
    starter: `fn run(query: &str, contents: &str) {
    // TODO: print a header, then each matching line indented by two spaces
}

fn main() {
    run("o", "foo\\nbar\\nzoo");
}`,
    tags: ['run', 'search', 'formatting'],
  },
  {
    id: 'rs-ch12-c-034',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Full Mini Program In Memory',
    prompt: `Assemble everything except actual file I/O. Define \`Config\` with \`query\`, \`file_path\`, and \`ignore_case\`; give it \`build(args, ignore_case)\` returning \`Result<Config, String>\` (error \`"not enough arguments"\`). Write \`search\` and \`search_case_insensitive\`, and \`run(config: &Config, contents: &str)\` that picks the search by \`config.ignore_case\` and prints each match.

In \`main\`, build from \`vec![String::from("prog"), String::from("rust"), String::from("poem.txt")]\` with \`ignore_case = true\`, then \`run(&config, "Rust\\ntrust\\nplain")\`. Expected output:
\`Rust\`
\`trust\``,
    hints: [
      'Pass \`ignore_case\` into \`build\` as a parameter to avoid needing the real env var.',
      'In \`run\`, choose between the two search functions with an \`if config.ignore_case\`.',
    ],
    solution: `struct Config {
    query: String,
    file_path: String,
    ignore_case: bool,
}

impl Config {
    fn build(args: &[String], ignore_case: bool) -> Result<Config, String> {
        if args.len() < 3 {
            return Err(String::from("not enough arguments"));
        }
        Ok(Config {
            query: args[1].clone(),
            file_path: args[2].clone(),
            ignore_case,
        })
    }
}

fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let mut results = Vec::new();
    for line in contents.lines() {
        if line.contains(query) {
            results.push(line);
        }
    }
    results
}

fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let query = query.to_lowercase();
    let mut results = Vec::new();
    for line in contents.lines() {
        if line.to_lowercase().contains(&query) {
            results.push(line);
        }
    }
    results
}

fn run(config: &Config, contents: &str) {
    let results = if config.ignore_case {
        search_case_insensitive(&config.query, contents)
    } else {
        search(&config.query, contents)
    };
    for line in results {
        println!("{line}");
    }
}

fn main() {
    let args = vec![String::from("prog"), String::from("rust"), String::from("poem.txt")];
    let config = Config::build(&args, true).unwrap();
    run(&config, "Rust\\ntrust\\nplain");
}`,
    starter: `struct Config {
    query: String,
    file_path: String,
    ignore_case: bool,
}

impl Config {
    fn build(args: &[String], ignore_case: bool) -> Result<Config, String> {
        // TODO: error when too few args, else build the Config
        todo!()
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

fn run(config: &Config, contents: &str) {
    // TODO: choose the search by config.ignore_case and print each match
}

fn main() {
    let args = vec![String::from("prog"), String::from("rust"), String::from("poem.txt")];
    let config = Config::build(&args, true).unwrap();
    run(&config, "Rust\\ntrust\\nplain");
}`,
    tags: ['config', 'search', 'run'],
  },
  {
    id: 'rs-ch12-c-035',
    chapter: 12,
    kind: 'coding',
    difficulty: 'easy',
    title: 'main Returns a Result Exit Code',
    prompt: `Wire a real \`main\` that reads a file. Write \`fn main() -> Result<(), std::io::Error>\` that calls \`let contents = std::fs::read_to_string("poem.txt")?;\`, prints \`read {} chars\` with \`contents.len()\`, and returns \`Ok(())\`.

When the file is missing (as on the Playground), returning the \`Err\` from \`main\` makes the program exit with a non-zero code and print the error automatically.`,
    hints: [
      'A \`main\` may return \`Result<(), E>\` where \`E\` implements the error trait; \`std::io::Error\` qualifies.',
      'The \`?\` operator propagates the I/O error straight out of \`main\`.',
    ],
    solution: `use std::fs;

fn main() -> Result<(), std::io::Error> {
    let contents = fs::read_to_string("poem.txt")?;
    println!("read {} chars", contents.len());
    Ok(())
}`,
    starter: `use std::fs;

fn main() -> Result<(), std::io::Error> {
    // TODO: read "poem.txt" with ?, print its length, return Ok(())
    todo!()
}`,
    tags: ['main', 'result', 'question-mark'],
  },
]

export default problems
