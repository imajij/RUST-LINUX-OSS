import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch01-c-001',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Hello, World!',
    prompt: `Write a complete Rust program whose main function prints exactly:

Hello, world!

Use the println! macro.`,
    hints: [
      'Every runnable Rust program needs a fn main.',
      'println! adds a newline automatically.',
    ],
    solution: `fn main() {
    println!("Hello, world!");
}`,
    starter: `fn main() {
    // TODO: print Hello, world!
}`,
    tags: ['println', 'main', 'basics'],
  },
  {
    id: 'rs-ch01-c-002',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Greet Rust',
    prompt: `Print exactly the following single line:

Hello, Rust!`,
    hints: ['Pass the text as a string literal to println!.'],
    solution: `fn main() {
    println!("Hello, Rust!");
}`,
    starter: `fn main() {
    // TODO
}`,
    tags: ['println', 'basics'],
  },
  {
    id: 'rs-ch01-c-003',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Two Lines',
    prompt: `Use two separate println! calls so the program prints these two lines:

Line one
Line two`,
    hints: ['Call println! twice, once per line.'],
    solution: `fn main() {
    println!("Line one");
    println!("Line two");
}`,
    starter: `fn main() {
    // TODO: print two lines
}`,
    tags: ['println', 'basics'],
  },
  {
    id: 'rs-ch01-c-004',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Minimal Main',
    prompt: `Write the smallest valid Rust program that compiles and runs but produces no output at all. It must contain a main function with an empty body.`,
    hints: ['main can have an empty body.', 'No statements are required inside.'],
    solution: `fn main() {}`,
    starter: `// TODO: write a minimal main function`,
    tags: ['main', 'basics'],
  },
  {
    id: 'rs-ch01-c-005',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print Without a Newline',
    prompt: `Using print! (not println!) twice, produce this single line of output with no trailing newline added between the words by you:

Hello, world!

The first call prints "Hello, " and the second prints "world!".`,
    hints: [
      'print! does NOT add a newline.',
      'Combine "Hello, " and "world!" with two print! calls.',
    ],
    solution: `fn main() {
    print!("Hello, ");
    print!("world!");
}`,
    starter: `fn main() {
    // TODO: use print! twice
}`,
    tags: ['print', 'basics'],
  },
  {
    id: 'rs-ch01-c-006',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print a Single Number',
    prompt: `Bind the integer 42 to a variable named answer with let, then print it using println! and curly braces, producing exactly:

42`,
    hints: ['Use let answer = 42;', 'Put empty curly braces in the format string.'],
    solution: `fn main() {
    let answer = 42;
    println!("{}", answer);
}`,
    starter: `fn main() {
    let answer = 42;
    // TODO: print answer
}`,
    tags: ['let', 'println', 'variables'],
  },
  {
    id: 'rs-ch01-c-007',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Embed a Value in Text',
    prompt: `Bind the integer 7 to a variable named count, then print exactly:

I have 7 apples`,
    hints: ['Place the curly-brace placeholder where the number should appear.'],
    solution: `fn main() {
    let count = 7;
    println!("I have {} apples", count);
}`,
    starter: `fn main() {
    let count = 7;
    // TODO: print the sentence
}`,
    tags: ['let', 'println', 'variables'],
  },
  {
    id: 'rs-ch01-c-008',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Add Two Literals',
    prompt: `Without using any variables, compute 3 + 4 directly inside println! and print exactly:

7`,
    hints: ['You can put an arithmetic expression as a println! argument.'],
    solution: `fn main() {
    println!("{}", 3 + 4);
}`,
    starter: `fn main() {
    // TODO: print the sum of 3 and 4
}`,
    tags: ['arithmetic', 'println'],
  },
  {
    id: 'rs-ch01-c-009',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Sum of Two Variables',
    prompt: `Bind a = 10 and b = 25 with let, then print their sum so the output is exactly:

35`,
    hints: ['Create a third placeholder for a + b, or compute it inline.'],
    solution: `fn main() {
    let a = 10;
    let b = 25;
    println!("{}", a + b);
}`,
    starter: `fn main() {
    let a = 10;
    let b = 25;
    // TODO: print the sum
}`,
    tags: ['let', 'arithmetic', 'variables'],
  },
  {
    id: 'rs-ch01-c-010',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print Two Values',
    prompt: `Bind first = 1 and second = 2, then in a single println! print both, separated by a space, producing exactly:

1 2`,
    hints: ['Use two curly-brace placeholders and pass two arguments in order.'],
    solution: `fn main() {
    let first = 1;
    let second = 2;
    println!("{} {}", first, second);
}`,
    starter: `fn main() {
    let first = 1;
    let second = 2;
    // TODO: print both values separated by a space
}`,
    tags: ['println', 'variables', 'formatting'],
  },
  {
    id: 'rs-ch01-c-011',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Commented Program',
    prompt: `Write a program that prints exactly:

Done

The program must include at least one line comment (using //) explaining what the println! does. The comment must not appear in the output.`,
    hints: ['Line comments start with // and run to the end of the line.'],
    solution: `fn main() {
    // Print a status message to the screen.
    println!("Done");
}`,
    starter: `fn main() {
    // TODO: add an explanatory comment, then print Done
}`,
    tags: ['comments', 'println'],
  },
  {
    id: 'rs-ch01-c-012',
    chapter: 1,
    kind: 'coding',
    difficulty: 'intro',
    title: 'An Empty Output Line',
    prompt: `Print the word "Top", then a completely blank line, then the word "Bottom". The exact output is:

Top

Bottom`,
    hints: ['A println! with an empty string prints just a newline.'],
    solution: `fn main() {
    println!("Top");
    println!();
    println!("Bottom");
}`,
    starter: `fn main() {
    println!("Top");
    // TODO: print a blank line
    println!("Bottom");
}`,
    tags: ['println', 'formatting'],
  },
  {
    id: 'rs-ch01-c-013',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Tab Separated Values',
    prompt: `Using a single println! and the tab escape sequence, print three words separated by tabs so the output is exactly:

red	green	blue

(There is one tab character between each word.)`,
    hints: ['The escape sequence for a tab is backslash t.', 'Type the words with the tab escape between them.'],
    solution: `fn main() {
    println!("red\\tgreen\\tblue");
}`,
    starter: `fn main() {
    // TODO: print red, green, blue separated by tabs
}`,
    tags: ['escape', 'println', 'formatting'],
  },
  {
    id: 'rs-ch01-c-014',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Newline Inside One String',
    prompt: `Using a SINGLE println! call (only one), print two lines by embedding a newline escape sequence inside the string. The output must be exactly:

up
down`,
    hints: ['The newline escape sequence is backslash n.', 'Only one println! is allowed.'],
    solution: `fn main() {
    println!("up\\ndown");
}`,
    starter: `fn main() {
    // TODO: one println! that prints two lines
}`,
    tags: ['escape', 'println'],
  },
  {
    id: 'rs-ch01-c-015',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Printing Quotation Marks',
    prompt: `Print a line that contains double quotation marks around a word. The exact output must be:

She said "hi" to me`,
    hints: ['Escape a double quote inside a string with backslash followed by a double quote.'],
    solution: `fn main() {
    println!("She said \\"hi\\" to me");
}`,
    starter: `fn main() {
    // TODO: print the line with quotation marks
}`,
    tags: ['escape', 'println'],
  },
  {
    id: 'rs-ch01-c-016',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Printing a Backslash',
    prompt: `Print a Windows-style path so the exact output is:

C:\\Users\\rust

(That is the letters C colon backslash Users backslash rust, with single backslashes shown.)`,
    hints: ['A literal backslash in a string is written as two backslashes.'],
    solution: `fn main() {
    println!("C:\\\\Users\\\\rust");
}`,
    starter: `fn main() {
    // TODO: print the path with backslashes
}`,
    tags: ['escape', 'println'],
  },
  {
    id: 'rs-ch01-c-017',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Positional Arguments',
    prompt: `Using positional argument indices inside the placeholders, print the same two values in two different orders with a single println!. Given the values 1 and 2 passed in order, produce exactly:

1 2 then 2 1`,
    hints: [
      'Inside curly braces you can write an index, like the placeholder for argument 0.',
      'Refer to argument 0 and argument 1 by their numbers and reuse them.',
    ],
    solution: `fn main() {
    println!("{0} {1} then {1} {0}", 1, 2);
}`,
    starter: `fn main() {
    // TODO: use positional indices to print "1 2 then 2 1"
    println!("{0} {1} then {1} {0}", 1, 2);
}`,
    tags: ['println', 'positional', 'formatting'],
  },
  {
    id: 'rs-ch01-c-018',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Named Arguments',
    prompt: `Using NAMED arguments in println! (names inside the curly braces), print exactly:

Alice is 30 years old

Provide the values using name and age as the argument names.`,
    hints: [
      'Inside println! you can write name = value pairs after the format string.',
      'Reference them with their names inside curly braces.',
    ],
    solution: `fn main() {
    println!("{name} is {age} years old", name = "Alice", age = 30);
}`,
    starter: `fn main() {
    // TODO: use named arguments name and age
}`,
    tags: ['println', 'named', 'formatting'],
  },
  {
    id: 'rs-ch01-c-019',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Inline Variable Capture',
    prompt: `Bind the variable city to the string "Paris", then print it by writing the variable name directly inside the curly braces of the format string (captured inline). The output must be exactly:

Welcome to Paris`,
    hints: ['Since Rust 2021 you can write a variable name directly inside the braces.', 'Write the placeholder as braces containing the variable name.'],
    solution: `fn main() {
    let city = "Paris";
    println!("Welcome to {city}");
}`,
    starter: `fn main() {
    let city = "Paris";
    // TODO: capture city inline inside the braces
}`,
    tags: ['println', 'variables', 'formatting'],
  },
  {
    id: 'rs-ch01-c-020',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Printing Literal Braces',
    prompt: `Print a line that literally contains curly braces. The exact output must be:

Use {} for a placeholder`,
    hints: [
      'To print a literal opening brace, double it.',
      'To print a literal closing brace, double it as well.',
    ],
    solution: `fn main() {
    println!("Use {{}} for a placeholder");
}`,
    starter: `fn main() {
    // TODO: print a line containing literal curly braces
}`,
    tags: ['println', 'escape', 'formatting'],
  },
  {
    id: 'rs-ch01-c-021',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Subtraction Expression',
    prompt: `Bind total = 100 and spent = 35, then print the remaining amount in a sentence so the output is exactly:

You have 65 left`,
    hints: ['Compute total - spent inside the println! argument or in a let.'],
    solution: `fn main() {
    let total = 100;
    let spent = 35;
    println!("You have {} left", total - spent);
}`,
    starter: `fn main() {
    let total = 100;
    let spent = 35;
    // TODO: print the remaining amount
}`,
    tags: ['arithmetic', 'let', 'println'],
  },
  {
    id: 'rs-ch01-c-022',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Multiplication of Variables',
    prompt: `Bind width = 6 and height = 4. Print the area of the rectangle so the output is exactly:

Area: 24`,
    hints: ['Multiply with the * operator.'],
    solution: `fn main() {
    let width = 6;
    let height = 4;
    println!("Area: {}", width * height);
}`,
    starter: `fn main() {
    let width = 6;
    let height = 4;
    // TODO: print the area
}`,
    tags: ['arithmetic', 'let', 'println'],
  },
  {
    id: 'rs-ch01-c-023',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Integer Division and Remainder',
    prompt: `Bind a = 17 and b = 5. Print the integer quotient and the remainder so the output is exactly:

17 / 5 = 3 remainder 2`,
    hints: ['Integer division with / truncates.', 'The remainder operator is %.'],
    solution: `fn main() {
    let a = 17;
    let b = 5;
    println!("{} / {} = {} remainder {}", a, b, a / b, a % b);
}`,
    starter: `fn main() {
    let a = 17;
    let b = 5;
    // TODO: print quotient and remainder
}`,
    tags: ['arithmetic', 'let', 'println'],
  },
  {
    id: 'rs-ch01-c-024',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Order of Operations',
    prompt: `Using a single arithmetic expression that relies on operator precedence (no extra parentheses needed for the multiplication), compute 2 + 3 * 4 and print exactly:

14`,
    hints: ['Multiplication binds tighter than addition.'],
    solution: `fn main() {
    println!("{}", 2 + 3 * 4);
}`,
    starter: `fn main() {
    // TODO: print the result of 2 + 3 * 4
}`,
    tags: ['arithmetic', 'println'],
  },
  {
    id: 'rs-ch01-c-025',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Parentheses Change the Result',
    prompt: `Add parentheses so the addition happens before the multiplication. Compute (2 + 3) * 4 and print exactly:

20`,
    hints: ['Group the addition with parentheses to force it first.'],
    solution: `fn main() {
    println!("{}", (2 + 3) * 4);
}`,
    starter: `fn main() {
    // TODO: print the result of (2 + 3) * 4
}`,
    tags: ['arithmetic', 'println'],
  },
  {
    id: 'rs-ch01-c-026',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Constant Expression',
    prompt: `Declare a constant named MAX_POINTS with the value 100000 using the const keyword (its type is u32), then print it so the output is exactly:

Max points: 100000`,
    hints: [
      'Constants are declared with const NAME: type = value;',
      'Constant names are conventionally UPPER_SNAKE_CASE.',
    ],
    solution: `fn main() {
    const MAX_POINTS: u32 = 100_000;
    println!("Max points: {}", MAX_POINTS);
}`,
    starter: `fn main() {
    // TODO: declare a const MAX_POINTS and print it
}`,
    tags: ['const', 'println', 'variables'],
  },
  {
    id: 'rs-ch01-c-027',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Reuse a Value Twice',
    prompt: `Bind n = 8. In one println!, print n and its double on the same line, reusing the same argument, so the output is exactly:

8 doubled is 16`,
    hints: ['You can pass both n and n + n (or n * 2) as arguments.'],
    solution: `fn main() {
    let n = 8;
    println!("{} doubled is {}", n, n * 2);
}`,
    starter: `fn main() {
    let n = 8;
    // TODO: print n and its double
}`,
    tags: ['arithmetic', 'let', 'println'],
  },
  {
    id: 'rs-ch01-c-028',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Block Comment',
    prompt: `Write a program that prints exactly:

Ready

The program must include a block comment (delimited by slash-star and star-slash) somewhere before the println!. The comment must not appear in the output.`,
    hints: ['Block comments start with slash-star and end with star-slash.', 'They may span multiple lines.'],
    solution: `fn main() {
    /* This program prints a readiness
       message and then exits. */
    println!("Ready");
}`,
    starter: `fn main() {
    // TODO: add a block comment, then print Ready
}`,
    tags: ['comments', 'println'],
  },
  {
    id: 'rs-ch01-c-029',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Right-Aligned Number Width',
    prompt: `Print the number 42 right-aligned in a field that is 5 characters wide, padded with spaces. Using the width specifier inside the placeholder, the exact output must be (three leading spaces then 42):

   42`,
    hints: [
      'Inside the braces, a colon introduces formatting options.',
      'Place the width number after the colon, like a colon followed by 5.',
    ],
    solution: `fn main() {
    println!("{:5}", 42);
}`,
    starter: `fn main() {
    // TODO: print 42 in a width-5 field
}`,
    tags: ['formatting', 'width', 'println'],
  },
  {
    id: 'rs-ch01-c-030',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Zero-Padded Number',
    prompt: `Print the number 7 padded with leading zeros to a width of 4 characters, so the exact output is:

0007`,
    hints: ['After the colon, a leading 0 before the width requests zero padding.'],
    solution: `fn main() {
    println!("{:04}", 7);
}`,
    starter: `fn main() {
    // TODO: zero-pad 7 to width 4
}`,
    tags: ['formatting', 'width', 'println'],
  },
  {
    id: 'rs-ch01-c-031',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Float Precision',
    prompt: `Print the value 3.14159 rounded to exactly 2 decimal places using a precision specifier, so the exact output is:

3.14`,
    hints: ['After the colon, a dot followed by a number sets the precision.', 'Use a precision of 2.'],
    solution: `fn main() {
    println!("{:.2}", 3.14159);
}`,
    starter: `fn main() {
    // TODO: print 3.14159 with 2 decimal places
}`,
    tags: ['formatting', 'precision', 'println'],
  },
  {
    id: 'rs-ch01-c-032',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Money With Two Decimals',
    prompt: `Bind price = 9.5 (a floating point value). Print it as a price with exactly two decimal places and a leading dollar sign, so the exact output is:

Price: $9.50`,
    hints: ['Use a precision of 2 inside the placeholder.', 'Print the dollar sign with its own placeholder right before the number, like a plain string argument.'],
    solution: `fn main() {
    let price = 9.5;
    let sign = "$";
    println!("Price: {}{:.2}", sign, price);
}`,
    starter: `fn main() {
    let price = 9.5;
    // TODO: print the price with two decimals
}`,
    tags: ['formatting', 'precision', 'println'],
  },
  {
    id: 'rs-ch01-c-033',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Width and Precision Together',
    prompt: `Print the value 2.5 with exactly one decimal place, right-aligned in a field 8 characters wide (padded with spaces). The exact output must be (five leading spaces then 2.5):

     2.5`,
    hints: [
      'Combine width and precision after the colon: width first, then a dot and the precision.',
      'A width of 8 and precision of 1 is written as 8 dot 1 after the colon.',
    ],
    solution: `fn main() {
    println!("{:8.1}", 2.5);
}`,
    starter: `fn main() {
    // TODO: print 2.5 with width 8 and precision 1
}`,
    tags: ['formatting', 'width', 'precision'],
  },
  {
    id: 'rs-ch01-c-034',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Formatted Receipt Line',
    prompt: `Bind item = "Coffee" and cost = 3.0. Print a receipt line where the item appears first, then the cost with exactly two decimals after a dollar sign. The exact output must be:

Coffee: $3.00`,
    hints: [
      'Use one placeholder for the item and one with precision 2 for the cost.',
      'Mix plain text, a string value, and a formatted float in a single println!.',
    ],
    solution: `fn main() {
    let item = "Coffee";
    let cost = 3.0;
    let sign = "$";
    println!("{}: {}{:.2}", item, sign, cost);
}`,
    starter: `fn main() {
    let item = "Coffee";
    let cost = 3.0;
    // TODO: print the receipt line
}`,
    tags: ['formatting', 'precision', 'println'],
  },
  {
    id: 'rs-ch01-c-035',
    chapter: 1,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Cargo Project Manifest',
    prompt: `You have just run a command to create a new Cargo project named hello_cargo. Recall the standard Cargo workflow and answer in code.

In the single println! of the program below, print the EXACT command (as a string) that you would type to create that project, so the output is exactly:

cargo new hello_cargo

Then, as a line comment in your code, name the file Cargo generates that lists the project's name, version, edition, and dependencies.`,
    hints: [
      'The command to scaffold a new binary project is cargo new followed by the project name.',
      'The manifest file Cargo generates is Cargo.toml.',
      'cargo build compiles, cargo run builds and runs, cargo check type-checks without producing a binary.',
    ],
    solution: `fn main() {
    // The manifest file Cargo generates is named Cargo.toml.
    // cargo build compiles, cargo run builds and runs, cargo check only checks.
    println!("cargo new hello_cargo");
}`,
    starter: `fn main() {
    // TODO: print the cargo command, and name the manifest file in a comment
}`,
    tags: ['cargo', 'comments', 'println'],
  },
]

export default problems
