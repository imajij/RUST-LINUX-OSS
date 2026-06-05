import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch01-t-001',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'What Does cargo new Create?',
    prompt: `You run the command cargo new hello_world in an empty folder. List the files and directories Cargo generates for you, and say in one sentence what each one is for.`,
    hints: [
      'Cargo creates a manifest file and a source folder.',
      'There is also a default source file and, by default, a git repository.',
    ],
    solution: `cargo new hello_world creates a directory named hello_world containing a Cargo.toml manifest file, a src directory, and a src/main.rs source file with a starter program. Cargo.toml describes the package (its name, version, edition) and its dependencies. The src directory holds your source code, and src/main.rs is the default entry-point file containing a small main function that prints "Hello, world!". By default Cargo also initializes a new Git repository with a .gitignore file (unless you are already inside one or pass --vcs none).`,
    tags: ['cargo', 'project-layout'],
  },
  {
    id: 'rs-ch01-t-002',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Predict the Greeting',
    prompt: `Given this program, what exactly is printed to the terminal?

fn main() {
    println!("Hello, world!");
}`,
    hints: ['println! prints its text.', 'println! adds something at the end of the line.'],
    solution: `The program prints the text Hello, world! followed by a newline. The println! macro writes the string you pass it to standard output and then moves the cursor to the next line because of the trailing "ln" (line). So the terminal shows exactly: Hello, world!`,
    tags: ['println', 'output'],
  },
  {
    id: 'rs-ch01-t-003',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Is It a Function or a Macro?',
    prompt: `In the line println!("hi"); there is an exclamation mark after println. What does that exclamation mark tell you, and how would the line look if println were an ordinary function instead?`,
    hints: ['Look at the punctuation right before the parenthesis.', 'Macros and functions are called with slightly different syntax.'],
    solution: `The exclamation mark means you are calling a macro, not a regular function. println! is a macro, which is a kind of metaprogramming that can do things a normal function cannot, such as accepting a variable number of arguments. If println were an ordinary function, the call would be written without the exclamation mark, like println("hi");. The trailing semicolon ends the statement in both cases.`,
    tags: ['macro', 'println'],
  },
  {
    id: 'rs-ch01-t-004',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'rustc Versus cargo',
    prompt: `A classmate compiles a single throwaway file by running rustc main.rs. You usually use cargo run instead. In a few sentences, explain the difference between these two tools and when you would reach for each.`,
    hints: ['One tool is just a compiler; the other is a build system and package manager.', 'Think about projects with dependencies.'],
    solution: `rustc is the Rust compiler: you hand it one or more source files and it produces an executable, but it does not manage projects or dependencies for you. cargo is Rust's build system and package manager built on top of rustc; it handles compiling, downloading and tracking dependencies, running the program, running tests, and more. For a tiny single-file experiment rustc is fine, but for any real project, reaching for cargo (cargo build, cargo run) is the standard because it scales as the project grows and gains dependencies.`,
    tags: ['cargo', 'rustc', 'tooling'],
  },
  {
    id: 'rs-ch01-t-005',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'build Versus run Versus check',
    prompt: `Cargo offers cargo build, cargo run, and cargo check. Explain what each command does and describe a situation in which cargo check is the best choice.`,
    hints: ['Two of these produce a runnable binary; one does not.', 'One of them also executes your program afterward.'],
    solution: `cargo build compiles your project and produces an executable in the target directory but does not run it. cargo run compiles the project if needed and then immediately runs the resulting executable, which is convenient during development. cargo check compiles your code to verify it has no errors but skips the slower step of producing the final binary, so it is much faster. cargo check is the best choice when you are iterating quickly and only want to know whether your code still compiles, without needing to run it yet.`,
    tags: ['cargo', 'tooling'],
  },
  {
    id: 'rs-ch01-t-006',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Reading Cargo.toml',
    prompt: `Here is a Cargo.toml file:

[package]
name = "guessing_game"
version = "0.1.0"
edition = "2021"

[dependencies]

What does each line under [package] mean, and what is the [dependencies] section for even though it is empty here?`,
    hints: ['The text in square brackets names a section.', 'Think about what information identifies a package and what crates it relies on.'],
    solution: `[package] is a section header, and the lines under it configure the package: name is the package's name, version is its current semantic version, and edition is the Rust edition (a stable language baseline) the package uses. [dependencies] is the section where you list external crates your project depends on. It is empty here because this project does not yet use any external crates, but you would add lines under it (such as rand = "0.8") when you want to pull in libraries from crates.io.`,
    tags: ['cargo', 'manifest', 'crates'],
  },
  {
    id: 'rs-ch01-t-007',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'print! Versus println!',
    prompt: `Predict the complete terminal output of this program, paying close attention to where line breaks occur:

fn main() {
    print!("a");
    print!("b");
    println!("c");
    print!("d");
}`,
    hints: ['print! does not add a newline; println! does.', 'Track the cursor position after each call.'],
    solution: `print! writes its text without adding a newline, while println! writes its text and then a newline. So print!("a") and print!("b") leave the cursor on the same line producing ab, then println!("c") adds c plus a newline, giving the line abc. Finally print!("d") writes d on the next line with no trailing newline. The output is the line abc followed by d on the second line.`,
    tags: ['print', 'println', 'output'],
  },
  {
    id: 'rs-ch01-t-008',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Filling the Curly Braces',
    prompt: `Predict what this program prints:

fn main() {
    let name = "Ada";
    let count = 3;
    println!("{name} sent {count} messages");
}`,
    hints: ['Empty or named curly braces are replaced by values.', 'The names inside the braces refer to variables in scope.'],
    solution: `The curly braces are placeholders that get filled in. Because the names name and count appear directly inside the braces, Rust substitutes the values of those in-scope variables. So {name} becomes Ada and {count} becomes 3, and the program prints: Ada sent 3 messages.`,
    tags: ['println', 'formatting', 'variables'],
  },
  {
    id: 'rs-ch01-t-009',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Positional Arguments',
    prompt: `What does this line print, and explain how the numbers inside the braces choose which argument goes where?

println!("{0} {1} {0}", "ping", "pong");`,
    hints: ['The numbers are zero-based indexes into the argument list.', 'An index can be reused.'],
    solution: `The numbers inside the braces are zero-based positional indexes that pick which trailing argument fills each placeholder. {0} refers to the first argument "ping" and {1} refers to the second argument "pong". Because {0} is used twice, "ping" appears twice. The line therefore prints: ping pong ping.`,
    tags: ['println', 'formatting', 'positional'],
  },
  {
    id: 'rs-ch01-t-010',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Line Comments and Block Comments',
    prompt: `Rust supports two comment styles. Show how to write a single-line comment and a multi-line (block) comment, and explain what the compiler does with the text inside comments.`,
    hints: ['One style starts with two slashes.', 'The other style is delimited by a slash-star pair.'],
    solution: `A single-line comment starts with // and runs to the end of that line, for example // this explains the next line. A block comment is delimited by /* and */ and can span multiple lines, for example /* this comment can wrap across several lines */. The compiler ignores everything inside comments entirely; they exist purely to document the code for human readers and have no effect on the program's behavior.`,
    tags: ['comments', 'syntax'],
  },
  {
    id: 'rs-ch01-t-011',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why main Is Special',
    prompt: `Every runnable Rust program in chapter 1 has a function named main. Why is main special, and what would happen to a binary project that had no main function at all?`,
    hints: ['Think about where execution begins.', 'A binary crate needs an entry point.'],
    solution: `main is special because it is the entry point of an executable program: it is the first code that runs when the binary starts. The Rust runtime calls main, so a binary crate must define it. If a binary project had no main function, it would fail to compile with an error saying the main function is missing, because there would be no defined place for execution to begin.`,
    tags: ['main', 'entry-point'],
  },
  {
    id: 'rs-ch01-t-012',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'The Smallest Legal Program',
    prompt: `Write the smallest complete Rust program that compiles and runs successfully but produces no output, and explain why an empty main body is allowed.`,
    hints: ['You still need the entry-point function.', 'A function body can be empty.'],
    solution: `The smallest valid program is just an empty main function:

fn main() {}

This compiles and runs because main is present (satisfying the entry-point requirement) and a function body is allowed to be empty. With nothing inside the braces, the program starts, immediately finishes, and prints nothing. The braces are still required to mark the body even when there are no statements.`,
    tags: ['main', 'syntax', 'minimal'],
  },
  {
    id: 'rs-ch01-t-013',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Evaluating a Constant Expression',
    prompt: `Predict the output of this program:

fn main() {
    let total = 2 + 3 * 4;
    println!("{total}");
}`,
    hints: ['Multiplication binds tighter than addition.', 'Evaluate the inner operation first.'],
    solution: `Rust follows the usual arithmetic precedence rules, so multiplication happens before addition. The expression 2 + 3 * 4 is evaluated as 2 + (3 * 4) = 2 + 12 = 14, and that value is bound to total. The program then prints the value of total, so the output is 14.`,
    tags: ['arithmetic', 'expressions', 'let'],
  },
  {
    id: 'rs-ch01-t-014',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Printing a Literal Curly Brace',
    prompt: `You want println! to print the literal text {ok} including the braces, not treat it as a placeholder. How do you escape the braces, and what does the resulting format string look like?`,
    hints: ['A single brace is interpreted as a placeholder.', 'Doubling a special character is a common escaping trick.'],
    solution: `In a format string, curly braces are special, so to print a literal brace you double it: {{ produces a single { and }} produces a single }. To print {ok} literally you write println!("{{ok}}");, which outputs {ok}. Doubling tells the macro you mean a real brace rather than the start or end of a placeholder.`,
    tags: ['println', 'formatting', 'escaping'],
  },
  {
    id: 'rs-ch01-t-015',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'A Missing Argument',
    prompt: `Explain why this line does not compile, and describe two different ways to fix it:

println!("Score: {} out of {}", 95);`,
    hints: ['Count the placeholders and count the arguments.', 'The compiler checks these at compile time.'],
    solution: `The format string has two empty placeholders but only one argument is supplied, so the counts do not match. Rust checks format strings at compile time and reports an error because there is no argument to fill the second {}. You can fix it either by supplying the missing argument, for example println!("Score: {} out of {}", 95, 100);, or by removing the extra placeholder so only one is left, for example println!("Score: {}", 95);. The key rule is that the number of placeholders must match the number of provided arguments.`,
    tags: ['println', 'formatting', 'compile-error'],
  },
  {
    id: 'rs-ch01-t-016',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Mixing Named and Inline Captures',
    prompt: `Predict the output and explain how each placeholder is filled:

fn main() {
    let width = 7;
    println!("{label}: {width} and {0}", "extra", label = "size");
}`,
    hints: ['{width} captures an in-scope variable.', '{0} is a positional index; label = ... is a named argument.'],
    solution: `Each placeholder is resolved by its style. {label} matches the named argument label = "size", so it becomes size. {width} captures the in-scope variable width, which is 7. {0} is a positional index pointing at the first trailing argument "extra". Putting it together, the line prints: size: 7 and extra. This shows that named captures of local variables, explicit named arguments, and positional indexes can all be combined in one format string.`,
    tags: ['println', 'formatting', 'named', 'positional'],
  },
  {
    id: 'rs-ch01-t-017',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Printing a Tab and a Newline',
    prompt: `You want a single println! call to print Name then a tab then Ada, and then on the next line print a backslash character. Which escape sequences do you use, and what is the format string?`,
    hints: ['A tab and a newline each have a two-character escape.', 'A backslash itself must be escaped.'],
    solution: `Inside a string literal, \\t is a tab, \\n is a newline, and \\\\ is a single literal backslash (the backslash must itself be escaped). So the call is println!("Name\\tAda\\n\\\\");, which prints Name, a tab, Ada, then a newline, and then a single backslash on the next line. Each escape sequence begins with a backslash followed by a character that selects the special meaning.`,
    tags: ['println', 'escaping', 'strings'],
  },
  {
    id: 'rs-ch01-t-018',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Setting a Minimum Width',
    prompt: `Predict the output of this program, where the numbers should be right-aligned in a column five characters wide:

fn main() {
    println!("{:5}", 42);
    println!("{:5}", 7);
}`,
    hints: ['The number after the colon is a minimum field width.', 'Numbers are right-aligned by default and padded with spaces.'],
    solution: `The :5 after the colon sets a minimum field width of five characters. Numbers are right-aligned by default and padded on the left with spaces, so 42 (two digits) is printed with three leading spaces and 7 (one digit) with four leading spaces. The first line is three spaces then 42, and the second line is four spaces then 7, lining the values up in a five-wide right-aligned column.`,
    tags: ['println', 'formatting', 'width'],
  },
  {
    id: 'rs-ch01-t-019',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Controlling Decimal Precision',
    prompt: `Predict what this program prints, and explain the role of the part after the dot in the format specifier:

fn main() {
    let pi = 3.14159;
    println!("{:.2}", pi);
}`,
    hints: ['The .2 controls how many digits appear after the decimal point.', 'Precision formatting rounds the displayed value.'],
    solution: `In the format specifier {:.2}, the .2 sets the precision to two digits after the decimal point. Applied to the floating-point value 3.14159, it rounds to two decimal places, displaying 3.14. So the program prints 3.14. The precision controls only how the value is shown; it does not change the stored variable.`,
    tags: ['println', 'formatting', 'precision'],
  },
  {
    id: 'rs-ch01-t-020',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Combining Width and Precision',
    prompt: `Predict the output, then explain how the width and precision parts of the specifier interact:

fn main() {
    println!("[{:8.3}]", 2.5);
}`,
    hints: ['One number sets total field width, the other sets decimal places.', 'The order is width then a dot then precision.'],
    solution: `In {:8.3}, the 8 is the minimum total field width and the .3 is the precision (three digits after the decimal point). The value 2.5 is first formatted with three decimals as 2.500, which is five characters long. To reach the width of eight, it is padded on the left with three spaces. Surrounded by the literal brackets, the output is [   2.500], where there are three leading spaces before the number.`,
    tags: ['println', 'formatting', 'width', 'precision'],
  },
  {
    id: 'rs-ch01-t-021',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Where the Binary Lands',
    prompt: `After running cargo build with no extra flags on a project named widget, where does the compiled executable end up, and how does that location change if you instead run cargo build --release? Why are there two different locations?`,
    hints: ['Builds go under a target directory.', 'Debug and release builds are kept separate.'],
    solution: `A plain cargo build produces a debug build, and the executable lands in target/debug/ (for example target/debug/widget). Running cargo build --release produces an optimized build that lands in target/release/ instead. The two locations are kept separate so that debug and release artifacts do not overwrite each other: debug builds compile faster and include debugging information, while release builds are optimized for speed but take longer to compile.`,
    tags: ['cargo', 'build', 'release'],
  },
  {
    id: 'rs-ch01-t-022',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Capture or Argument?',
    prompt: `Compare these two lines. Do they print the same thing? Explain the difference in how each placeholder is resolved.

let score = 10;
println!("{score}");
println!("{}", score);`,
    hints: ['One form names the variable inside the braces.', 'The other form lists the variable as a trailing argument.'],
    solution: `Both lines print the same output: 10. The difference is only in how the placeholder is filled. In println!("{score}") the variable name is written directly inside the braces, so the macro captures the in-scope variable score. In println!("{}", score) the placeholder is empty and the value is taken from the trailing argument list, where score is passed explicitly. Inline capture is often cleaner for simple variables, while the trailing-argument form is needed when you want to print an expression rather than a bare variable name.`,
    tags: ['println', 'formatting', 'variables'],
  },
  {
    id: 'rs-ch01-t-023',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Right Versus Left Alignment',
    prompt: `Predict the exact output of both lines and explain what the < and > symbols control:

fn main() {
    println!("[{:>6}]", "hi");
    println!("[{:<6}]", "hi");
}`,
    hints: ['The < and > set the alignment direction.', 'Padding fills the field to the requested width.'],
    solution: `The > means right-align and the < means left-align within a field of the given width (here 6). For "hi" (two characters) in a six-wide field, right alignment puts four spaces before it, giving [    hi], and left alignment puts the text first with four spaces after it, giving [hi    ]. So the explicit alignment symbol controls which side the padding spaces go on. Note that strings default to left alignment, so the second line shows the default behavior made explicit.`,
    tags: ['println', 'formatting', 'alignment'],
  },
  {
    id: 'rs-ch01-t-024',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Custom Fill Characters',
    prompt: `Predict the output and explain the three parts of the specifier:

fn main() {
    println!("{:*>8}", 25);
}`,
    hints: ['Before the alignment symbol you can name a fill character.', 'The pattern is fill, then alignment, then width.'],
    solution: `The specifier {:*>8} has three parts: the fill character *, the alignment symbol > (right-align), and the width 8. The value 25 occupies two characters, so the remaining six positions on the left are filled with the chosen fill character * instead of spaces. The output is ******25, which is six asterisks followed by 25, totaling eight characters. The fill character only matters when padding is actually needed to reach the width.`,
    tags: ['println', 'formatting', 'fill', 'alignment'],
  },
  {
    id: 'rs-ch01-t-025',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Zero-Padding a Number',
    prompt: `Predict the output and explain how the 0 flag differs from padding with spaces:

fn main() {
    println!("{:05}", 42);
    println!("{:5}", 42);
}`,
    hints: ['A leading 0 in the spec is a special flag for numbers.', 'Compare it to ordinary space padding of the same width.'],
    solution: `A leading 0 before the width, as in {:05}, is the zero-padding flag for numbers: it fills the empty positions with zeros instead of spaces. So 42 in a width of five becomes 00042. By contrast {:5} pads with spaces, producing three spaces then 42. The first line prints 00042 and the second prints (three spaces)42. Zero-padding is commonly used to keep a fixed-digit appearance, such as for codes or timestamps.`,
    tags: ['println', 'formatting', 'zero-pad', 'width'],
  },
  {
    id: 'rs-ch01-t-026',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Printing the Plus Sign',
    prompt: `Predict the output and explain what the + flag does, including how it affects negative numbers:

fn main() {
    println!("{:+}", 8);
    println!("{:+}", -8);
}`,
    hints: ['The + flag forces a sign to be shown.', 'Negative numbers already display their sign.'],
    solution: `The + flag forces an explicit sign to be printed for numbers. For the positive value 8 it adds a leading plus sign, producing +8. For the negative value -8 the minus sign is already shown, so the output is just -8 (the flag does not add a second sign). The first line prints +8 and the second prints -8. This flag is useful when you want positive and negative numbers to line up with matching sign characters.`,
    tags: ['println', 'formatting', 'sign'],
  },
  {
    id: 'rs-ch01-t-027',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Integer Division Surprise',
    prompt: `A learner expects this to print 2.5 but it prints something else. What does it actually print, and why?

fn main() {
    let result = 5 / 2;
    println!("{result}");
}`,
    hints: ['Both operands are whole-number literals.', 'Division between integers discards the fractional part.'],
    solution: `Because both 5 and 2 are integer literals, Rust performs integer division, which discards the fractional part rather than rounding. 5 / 2 is therefore 2, not 2.5, so the program prints 2. To get 2.5 you would need floating-point operands, for example 5.0 / 2.0. The lesson is that the types of the operands determine whether division keeps or drops the fractional part.`,
    tags: ['arithmetic', 'integers', 'expressions'],
  },
  {
    id: 'rs-ch01-t-028',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Why This Does Not Compile',
    prompt: `Explain why the compiler rejects this code and identify the single problem:

fn main() {
    println!("counting up")
    let n = 1 + 2;
    println!("{n}");
}`,
    hints: ['Look at the end of the first println! line.', 'Statements need a terminator.'],
    solution: `The problem is a missing semicolon at the end of the first println! line. In Rust, statements must end with a semicolon, and without it the compiler sees the first macro call running into the let statement on the next line, which is not valid. The fix is to write println!("counting up"); with a trailing semicolon. Once that semicolon is added, the rest of the program compiles and prints counting up followed by 3.`,
    tags: ['syntax', 'compile-error', 'semicolon'],
  },
  {
    id: 'rs-ch01-t-029',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Tracing a Multi-Line Output',
    prompt: `Carefully trace this program and write the exact terminal output, line by line:

fn main() {
    let a = 4;
    let b = 6;
    print!("sum=");
    println!("{}", a + b);
    println!("{:>4}", a * b);
    // println!("{}", a - b);
}`,
    hints: ['print! keeps the cursor on the same line.', 'One line is right-aligned in width four; one line is a comment.'],
    solution: `Walk through it in order. print!("sum=") writes sum= with no newline. Then println!("{}", a + b) writes the value of 4 + 6, which is 10, on the same line and adds a newline, completing the line sum=10. Next println!("{:>4}", a * b) prints 4 * 6 = 24 right-aligned in a four-wide field, giving two leading spaces then 24. The final line is a comment, so it is ignored. The output is the line sum=10 followed by the line (two spaces)24.`,
    tags: ['println', 'print', 'output', 'comments'],
  },
  {
    id: 'rs-ch01-t-030',
    chapter: 1,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Designing a Lined-Up Receipt',
    prompt: `You are printing a small receipt where each item name should be left-aligned in a column 10 characters wide and each price should be right-aligned in a column 6 characters wide and shown with exactly 2 decimal places. Describe the single println! format string you would use for one row, and explain each piece of its specifiers.`,
    hints: ['Combine alignment, width, and precision in one format string.', 'Strings use left alignment with <, numbers can take width and precision.'],
    solution: `A suitable row format string is "{:<10}{:>6.2}", used as println!("{:<10}{:>6.2}", name, price);. The first specifier {:<10} left-aligns the item name in a field 10 characters wide, padding on the right with spaces. The second specifier {:>6.2} right-aligns the price in a field 6 characters wide and the .2 forces exactly two digits after the decimal point. Together these keep every row's names starting at the same column and the prices lined up neatly on the right with consistent decimals.`,
    tags: ['println', 'formatting', 'width', 'precision'],
  },
]

export default problems
