import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch01-c-036',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Greet With a Named Argument',
    prompt: `Write a complete program with a \`main\` function that prints exactly:

Hello, Ferris!

Use \`println!\` with a NAMED argument (not a positional one). In other words, declare a \`let\` binding for the name and reference it inside the format string by name, like println with a "name" placeholder, passing name = the binding.`,
    hints: [
      'A named argument looks like the placeholder containing a name, with name = value after the comma.',
      'Bind the name to a string literal first with let.'
    ],
    solution: `fn main() {
    let who = "Ferris";
    println!("Hello, {who}!");
}`,
    starter: `fn main() {
    // TODO: bind a name and print "Hello, Ferris!" using a named argument
}`,
    tags: ['println', 'named-args']
  },
  {
    id: 'rs-ch01-c-037',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Three Lines, One Macro',
    prompt: `Using exactly ONE call to \`println!\`, print these three lines:

one
two
three

You must use newline escape sequences inside a single format string rather than calling println three times.`,
    hints: [
      'The newline escape sequence is backslash n.',
      'A single string literal may contain several newlines.'
    ],
    solution: `fn main() {
    println!("one\\ntwo\\nthree");
}`,
    starter: `fn main() {
    // TODO: print three lines with a single println! call
}`,
    tags: ['println', 'escape-sequences']
  },
  {
    id: 'rs-ch01-c-038',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Print Without a Trailing Newline',
    prompt: `Print the word "Loading" followed immediately by three dots, with NO trailing newline at the end, so the output is exactly:

Loading...

(There must be no newline after the final dot.) Use \`print!\` rather than \`println!\`.`,
    hints: [
      'print! does not add a newline; println! does.',
      'You can do this in one or two print! calls.'
    ],
    solution: `fn main() {
    print!("Loading...");
}`,
    starter: `fn main() {
    // TODO: print "Loading..." with no trailing newline
}`,
    tags: ['print', 'output']
  },
  {
    id: 'rs-ch01-c-039',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sum Of Two Literals',
    prompt: `Bind two integer literals, 17 and 25, to separate \`let\` variables. Compute their sum into a third variable and print exactly:

17 + 25 = 42

Use the values via the variables in the println, not by typing 42 directly.`,
    hints: [
      'let a = 17; let b = 25; let sum = a + b;',
      'You can interpolate the variables directly inside the format string.'
    ],
    solution: `fn main() {
    let a = 17;
    let b = 25;
    let sum = a + b;
    println!("{a} + {b} = {sum}");
}`,
    starter: `fn main() {
    // TODO: bind 17 and 25, add them, and print "17 + 25 = 42"
}`,
    tags: ['let', 'arithmetic']
  },
  {
    id: 'rs-ch01-c-040',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Positional Arguments In Order',
    prompt: `Using POSITIONAL placeholders (the empty curly-brace form), print exactly:

Rust 2024 edition

Bind the strings/numbers "Rust", 2024, and "edition" to three variables and pass them in order to a single \`println!\`.`,
    hints: [
      'An empty placeholder is filled by the next positional argument.',
      'Pass three arguments separated by commas after the format string.'
    ],
    solution: `fn main() {
    let lang = "Rust";
    let year = 2024;
    let word = "edition";
    println!("{} {} {}", lang, year, word);
}`,
    starter: `fn main() {
    // TODO: print "Rust 2024 edition" using positional {} placeholders
}`,
    tags: ['println', 'positional-args']
  },
  {
    id: 'rs-ch01-c-041',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Print Literal Curly Braces',
    prompt: `Print exactly this line, including the literal curly braces:

The set is {1, 2, 3}

Remember that inside a format string a single curly brace is special, so you must escape it to print a literal one.`,
    hints: [
      'Escape a literal opening brace by doubling it.',
      'Escape a literal closing brace by doubling it too.'
    ],
    solution: `fn main() {
    println!("The set is {{1, 2, 3}}");
}`,
    starter: `fn main() {
    // TODO: print: The set is {1, 2, 3}
}`,
    tags: ['println', 'escape-sequences']
  },
  {
    id: 'rs-ch01-c-042',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Print A Tab-Separated Row',
    prompt: `Print a single line with three fields separated by TAB characters (not spaces):

id	name	score

Use the tab escape sequence between the words. There should be exactly one tab between each pair of words and a trailing newline at the end.`,
    hints: [
      'The tab escape sequence is backslash t.',
      'One println! call is enough.'
    ],
    solution: `fn main() {
    println!("id\\tname\\tscore");
}`,
    starter: `fn main() {
    // TODO: print three tab-separated fields: id name score
}`,
    tags: ['println', 'escape-sequences']
  },
  {
    id: 'rs-ch01-c-043',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Escape A Double Quote',
    prompt: `Print exactly this line, including the double-quote characters around the word She said:

She said "hello"

Because the whole string is delimited by double quotes, you must escape the inner quotes.`,
    hints: [
      'Escape an inner double quote with a backslash before it.',
      'The backslash itself is not printed; it just escapes the quote.'
    ],
    solution: `fn main() {
    println!("She said \\"hello\\"");
}`,
    starter: `fn main() {
    // TODO: print: She said "hello"
}`,
    tags: ['println', 'escape-sequences']
  },
  {
    id: 'rs-ch01-c-044',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Print A Windows-Style Path',
    prompt: `Print exactly this line, which contains literal backslashes:

C:\\Users\\Ferris

To print a single backslash you must use the backslash escape sequence (two backslashes in the source produce one in the output).`,
    hints: [
      'A literal backslash in a normal string is written as two backslashes.',
      'There are two backslashes in the desired output.'
    ],
    solution: `fn main() {
    println!("C:\\\\Users\\\\Ferris");
}`,
    starter: `fn main() {
    // TODO: print a Windows-style path with literal backslashes
}`,
    tags: ['println', 'escape-sequences']
  },
  {
    id: 'rs-ch01-c-045',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Mixing Named And Positional',
    prompt: `Print exactly:

Ferris is 5 years old

Use a SINGLE \`println!\` that mixes one positional placeholder (for the age) and one named placeholder (for the name). Bind name = "Ferris" and pass age = 5.`,
    hints: [
      'You can use both an empty placeholder and a named one in the same string.',
      'Named arguments come after positional ones in the argument list.'
    ],
    solution: `fn main() {
    let age = 5;
    println!("{name} is {} years old", age, name = "Ferris");
}`,
    starter: `fn main() {
    // TODO: print "Ferris is 5 years old" mixing positional and named args
}`,
    tags: ['println', 'named-args', 'positional-args']
  },
  {
    id: 'rs-ch01-c-046',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Reuse One Argument Twice',
    prompt: `Bind a single variable \`word\` to the string "echo". Using that ONE argument referenced by name more than once, print exactly:

echo echo echo

Do not bind the word three separate times; reference the same named value repeatedly.`,
    hints: [
      'A named placeholder can appear multiple times in the same format string.',
      'Each occurrence reuses the same value.'
    ],
    solution: `fn main() {
    let word = "echo";
    println!("{word} {word} {word}");
}`,
    starter: `fn main() {
    // TODO: print the same word three times using one named argument
}`,
    tags: ['println', 'named-args']
  },
  {
    id: 'rs-ch01-c-047',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Seconds In A Day',
    prompt: `Without typing the final number directly, compute the number of seconds in one day using an arithmetic expression of literals (24 hours times 60 minutes times 60 seconds). Store it in a \`let\` binding and print exactly:

There are 86400 seconds in a day`,
    hints: [
      'Multiply 24 * 60 * 60 inside a let binding.',
      'Interpolate the binding into the format string.'
    ],
    solution: `fn main() {
    let seconds = 24 * 60 * 60;
    println!("There are {seconds} seconds in a day");
}`,
    starter: `fn main() {
    // TODO: compute seconds in a day from literals and print it
}`,
    tags: ['arithmetic', 'let']
  },
  {
    id: 'rs-ch01-c-048',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Integer Division And Remainder',
    prompt: `Bind \`total = 100\` and \`group = 7\`. Compute the quotient (integer division) and the remainder (modulo) of total divided by group, then print exactly:

100 / 7 = 14 remainder 2

Use the / and % operators on the bound integers.`,
    hints: [
      'Integer division with / truncates toward zero.',
      'The remainder operator is %.'
    ],
    solution: `fn main() {
    let total = 100;
    let group = 7;
    let q = total / group;
    let r = total % group;
    println!("{total} / {group} = {q} remainder {r}");
}`,
    starter: `fn main() {
    let total = 100;
    let group = 7;
    // TODO: compute quotient and remainder, then print the line
}`,
    tags: ['arithmetic', 'let']
  },
  {
    id: 'rs-ch01-c-049',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Pad A Number To Width Five',
    prompt: `Print the number 42 right-aligned in a field five characters wide, padded with spaces, so the output is exactly (note the three leading spaces):

   42

Use the width formatting feature inside the placeholder.`,
    hints: [
      'A width is given after a colon inside the placeholder.',
      'Right alignment with space padding is the default for numbers.'
    ],
    solution: `fn main() {
    let n = 42;
    println!("{n:5}");
}`,
    starter: `fn main() {
    let n = 42;
    // TODO: print n right-aligned in a width-5 field
}`,
    tags: ['println', 'formatting', 'width']
  },
  {
    id: 'rs-ch01-c-050',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Zero-Padded Counter',
    prompt: `Print the number 7 padded with leading ZEROS to a width of four characters, producing exactly:

0007

Use the zero-fill width specifier in the format placeholder.`,
    hints: [
      'Zero-padding uses a 0 before the width number after the colon.',
      'The placeholder looks like a colon, then 0, then the width.'
    ],
    solution: `fn main() {
    let n = 7;
    println!("{n:04}");
}`,
    starter: `fn main() {
    let n = 7;
    // TODO: print n zero-padded to width 4
}`,
    tags: ['println', 'formatting', 'width']
  },
  {
    id: 'rs-ch01-c-051',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Fixed Decimal Places',
    prompt: `Bind the floating-point value 3.14159 and print it rounded to exactly TWO decimal places, producing:

3.14

Use the precision feature of the format placeholder.`,
    hints: [
      'Precision is given after a dot inside the placeholder, like colon then dot then 2.',
      'The value should be a float literal such as 3.14159.'
    ],
    solution: `fn main() {
    let pi = 3.14159;
    println!("{pi:.2}");
}`,
    starter: `fn main() {
    let pi = 3.14159;
    // TODO: print pi with two decimal places
}`,
    tags: ['println', 'formatting', 'precision']
  },
  {
    id: 'rs-ch01-c-052',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Left-Align A Label',
    prompt: `Print the word "id" LEFT-aligned in a field eight characters wide followed immediately by the word "value", producing exactly (the gap is made of spaces that pad the field):

id      value

Use a left-alignment flag with a width in the format placeholder.`,
    hints: [
      'The left-align flag is a < character placed after the colon.',
      'For example colon, then <, then the width number.'
    ],
    solution: `fn main() {
    let label = "id";
    println!("{label:<8}value");
}`,
    starter: `fn main() {
    let label = "id";
    // TODO: left-align label in width 8, then print "value"
}`,
    tags: ['println', 'formatting', 'alignment']
  },
  {
    id: 'rs-ch01-c-053',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Commented-Out Debug Line',
    prompt: `Write a \`main\` function that prints exactly:

Result: 9

The program must also contain a LINE comment that documents the calculation and a separate println call that is commented out so it does NOT run. Compute 3 * 3 in a let binding and print it. Include at least one line comment and one commented-out println.`,
    hints: [
      'A line comment starts with two slashes.',
      'Commenting out a line means putting the comment marker in front of it.'
    ],
    solution: `fn main() {
    // square three to get the result
    let result = 3 * 3;
    // println!("debug: {result}");
    println!("Result: {result}");
}`,
    starter: `fn main() {
    // TODO: add a line comment, a commented-out println, and print "Result: 9"
}`,
    tags: ['comments', 'arithmetic']
  },
  {
    id: 'rs-ch01-c-054',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Block Comment Around Code',
    prompt: `Write a \`main\` that prints exactly:

Active

Somewhere in the file include a BLOCK comment (the slash-star ... star-slash form) that wraps a few lines of explanatory text or disabled code. The block-commented content must not affect the output.`,
    hints: [
      'A block comment opens with slash-star and closes with star-slash.',
      'Block comments can span multiple lines.'
    ],
    solution: `fn main() {
    /*
       This block describes the feature.
       println!("disabled line");
    */
    println!("Active");
}`,
    starter: `fn main() {
    // TODO: include a block comment, then print "Active"
}`,
    tags: ['comments', 'output']
  },
  {
    id: 'rs-ch01-c-055',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Two Variables, One Swap-Free Print',
    prompt: `Bind \`x = 10\` and \`y = 3\`. In a single \`println!\` print three results computed from x and y, formatted exactly:

10 + 3 = 13, 10 - 3 = 7, 10 * 3 = 30

Use arithmetic expressions inline or via let bindings; do not hard-code the result numbers.`,
    hints: [
      'You can write expressions inside let bindings and interpolate the bindings.',
      'Note placeholders cannot contain arithmetic, so compute first.'
    ],
    solution: `fn main() {
    let x = 10;
    let y = 3;
    let sum = x + y;
    let diff = x - y;
    let prod = x * y;
    println!("{x} + {y} = {sum}, {x} - {y} = {diff}, {x} * {y} = {prod}");
}`,
    starter: `fn main() {
    let x = 10;
    let y = 3;
    // TODO: compute and print sum, difference, and product on one line
}`,
    tags: ['arithmetic', 'let', 'println']
  },
  {
    id: 'rs-ch01-c-056',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Print A Percentage Sign',
    prompt: `Bind \`rate = 95\` and print exactly:

Battery: 95%

The literal percent sign is NOT special in a Rust format string, but make sure the number comes from the variable, not a hard-coded 95 in the text.`,
    hints: [
      'The percent character can appear literally in the format string.',
      'Interpolate the rate variable before the percent sign.'
    ],
    solution: `fn main() {
    let rate = 95;
    println!("Battery: {rate}%");
}`,
    starter: `fn main() {
    let rate = 95;
    // TODO: print "Battery: 95%" using the variable
}`,
    tags: ['println', 'formatting']
  },
  {
    id: 'rs-ch01-c-057',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Two-Column Aligned Receipt',
    prompt: `Print two rows where the item name is left-aligned in a width-10 field and the price is right-aligned in a width-5 field. Bind the names and prices and produce exactly:

Apple         3
Bread        12

(The names "Apple" and "Bread" pad out to ten characters; the numbers 3 and 12 are right-aligned in five characters.)`,
    hints: [
      'Use a left-align width for the name and a plain width for the number.',
      'Two println! calls, one per row, is fine.'
    ],
    solution: `fn main() {
    let a_name = "Apple";
    let a_price = 3;
    let b_name = "Bread";
    let b_price = 12;
    println!("{a_name:<10}{a_price:5}");
    println!("{b_name:<10}{b_price:5}");
}`,
    starter: `fn main() {
    // TODO: print two aligned rows: name in width 10 (left), price in width 5 (right)
}`,
    tags: ['println', 'formatting', 'alignment']
  },
  {
    id: 'rs-ch01-c-058',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Carriage Return Awareness',
    prompt: `Print exactly two lines using ONE \`println!\` and an explicit newline escape, where the second line is indented by a tab:

Menu:
	Coffee

The first line is "Menu:" and the second line begins with a tab character followed by "Coffee".`,
    hints: [
      'Combine the newline escape and the tab escape in one string.',
      'Order matters: newline first, then tab before Coffee.'
    ],
    solution: `fn main() {
    println!("Menu:\\n\\tCoffee");
}`,
    starter: `fn main() {
    // TODO: print "Menu:" then a tab-indented "Coffee" using one println!
}`,
    tags: ['println', 'escape-sequences']
  },
  {
    id: 'rs-ch01-c-059',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Build A Banner With Width',
    prompt: `Bind \`title = "MENU"\`. Print the title centered would be harder, so instead print it right-aligned in a width-10 field, surrounded by a line of output, producing exactly these three lines:

----------
      MENU
----------

The first and third lines are exactly ten dashes. The middle line right-aligns MENU in a width-10 field (six leading spaces).`,
    hints: [
      'Ten dashes can be typed literally in the string.',
      'Right-align the title using a width-10 placeholder.'
    ],
    solution: `fn main() {
    let title = "MENU";
    println!("----------");
    println!("{title:>10}");
    println!("----------");
}`,
    starter: `fn main() {
    let title = "MENU";
    // TODO: print a dashed banner with the right-aligned title in the middle
}`,
    tags: ['println', 'formatting', 'alignment']
  },
  {
    id: 'rs-ch01-c-060',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Describe Your Cargo Project',
    prompt: `You are NOT running cargo here; instead, write a \`main\` that prints the conceptual layout of a binary crate created by cargo new. Print exactly these four lines:

myapp/
  Cargo.toml
  src/
    main.rs

Use literal spaces for indentation (two spaces, then four spaces) and a single trailing slash where shown.`,
    hints: [
      'Each line can be its own println! call, or use newline escapes in one call.',
      'Be careful to match the exact indentation with spaces.'
    ],
    solution: `fn main() {
    println!("myapp/");
    println!("  Cargo.toml");
    println!("  src/");
    println!("    main.rs");
}`,
    starter: `fn main() {
    // TODO: print the cargo binary project layout exactly
}`,
    tags: ['cargo', 'println']
  },
  {
    id: 'rs-ch01-c-061',
    chapter: 1,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Average Of Three Integers',
    prompt: `Bind three integer scores: 80, 90, and 100. Compute their integer average (sum divided by 3 using integer division) and print exactly:

Average: 90

Do not hard-code 90; compute it from the three bound values.`,
    hints: [
      'Add the three values, then divide by 3.',
      'Integer division of 270 by 3 is exactly 90.'
    ],
    solution: `fn main() {
    let a = 80;
    let b = 90;
    let c = 100;
    let avg = (a + b + c) / 3;
    println!("Average: {avg}");
}`,
    starter: `fn main() {
    // TODO: bind three scores, compute their average, and print it
}`,
    tags: ['arithmetic', 'let']
  },
  {
    id: 'rs-ch01-c-062',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Sign-Aware Padding',
    prompt: `Print the integer 42 with an EXPLICIT plus sign and the integer using its natural form on a second line. Produce exactly:

+42
42

Use the sign flag in the format placeholder for the first line so positive numbers show a leading plus.`,
    hints: [
      'The sign flag is a plus character placed right after the colon.',
      'For example colon then plus inside the placeholder.'
    ],
    solution: `fn main() {
    let n = 42;
    println!("{n:+}");
    println!("{n}");
}`,
    starter: `fn main() {
    let n = 42;
    // TODO: print n with an explicit plus sign, then n normally
}`,
    tags: ['println', 'formatting']
  },
  {
    id: 'rs-ch01-c-063',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Temperature Line With Two Floats',
    prompt: `Bind two float temperatures, 20.5 and 21.75. Print them each to ONE decimal place on a single line separated by " -> ", producing exactly:

20.5 -> 21.8

Note the second value rounds from 21.75 to 21.8 at one decimal place.`,
    hints: [
      'Apply a precision of 1 to each float placeholder.',
      'Standard rounding applies, so 21.75 becomes 21.8.'
    ],
    solution: `fn main() {
    let a = 20.5;
    let b = 21.75;
    println!("{a:.1} -> {b:.1}");
}`,
    starter: `fn main() {
    let a = 20.5;
    let b = 21.75;
    // TODO: print both floats to one decimal place separated by " -> "
}`,
    tags: ['println', 'formatting', 'precision']
  },
  {
    id: 'rs-ch01-c-064',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Aligned Three-Column Table',
    prompt: `Print a header row and one data row as a fixed-width table. Column 1 is left-aligned width 6, column 2 is right-aligned width 5, column 3 is right-aligned width 8. Bind all the values and produce exactly:

name    age   salary
Alice    30    50000

(Header: "name" left in 6, "age" right in 5, "salary" right in 8. Data: "Alice" left in 6, 30 right in 5, 50000 right in 8.)`,
    hints: [
      'Use < for left alignment and > for right alignment, each with its width.',
      'The same width spec applies whether the value is text or a number.'
    ],
    solution: `fn main() {
    let h1 = "name";
    let h2 = "age";
    let h3 = "salary";
    let name = "Alice";
    let age = 30;
    let salary = 50000;
    println!("{h1:<6}{h2:>5}{h3:>8}");
    println!("{name:<6}{age:>5}{salary:>8}");
}`,
    starter: `fn main() {
    // TODO: print a header and data row with widths 6 (left), 5 (right), 8 (right)
}`,
    tags: ['println', 'formatting', 'alignment']
  },
  {
    id: 'rs-ch01-c-065',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Invoice Total With Tax',
    prompt: `Bind \`price = 100\` and \`tax = 8\` (both integers, tax is a percentage). Compute the tax amount as an integer (price times tax divided by 100) and the total. Print exactly three lines:

Subtotal: 100
Tax (8%): 8
Total:    108

Use width or spacing so the numbers line up as shown (the labels already make them align; just match the exact text). Do not hard-code the computed numbers.`,
    hints: [
      'Compute tax_amount = price * tax / 100 with integer arithmetic.',
      'total = price + tax_amount.',
      'Match the spacing in the labels exactly, including the spaces after Total:.'
    ],
    solution: `fn main() {
    let price = 100;
    let tax = 8;
    let tax_amount = price * tax / 100;
    let total = price + tax_amount;
    println!("Subtotal: {price}");
    println!("Tax ({tax}%): {tax_amount}");
    println!("Total:    {total}");
}`,
    starter: `fn main() {
    let price = 100;
    let tax = 8;
    // TODO: compute tax amount and total, then print the three lines
}`,
    tags: ['arithmetic', 'println', 'formatting']
  },
  {
    id: 'rs-ch01-c-066',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Hex And Binary Of A Byte',
    prompt: `Bind \`value = 255\`. Print the value in decimal, in hexadecimal, and in binary using the format placeholders for those bases. Produce exactly:

dec=255 hex=ff bin=11111111

Use the lowercase hex format and the binary format inside the placeholders (no 0x or 0b prefixes).`,
    hints: [
      'The hexadecimal format uses an x after the colon in the placeholder.',
      'The binary format uses a b after the colon in the placeholder.',
      'You can reference the same value in multiple placeholders.'
    ],
    solution: `fn main() {
    let value = 255;
    println!("dec={value} hex={value:x} bin={value:b}");
}`,
    starter: `fn main() {
    let value = 255;
    // TODO: print value in decimal, hex, and binary
}`,
    tags: ['println', 'formatting', 'radix']
  },
  {
    id: 'rs-ch01-c-067',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Prefixed Hex With Zero Padding',
    prompt: `Bind \`color = 4095\`. Print it as a zero-padded, lowercase hexadecimal number that is at least four hex digits wide AND includes the 0x prefix, producing exactly:

0x0fff

Use the alternate-form flag (which adds the 0x prefix) together with zero-fill and a width in the placeholder.`,
    hints: [
      'The alternate form flag is a # placed after the colon.',
      'Combine # with 0 and a width, then the x for hex.',
      'Remember the 0x prefix counts toward the width with the alternate form.'
    ],
    solution: `fn main() {
    let color = 4095;
    println!("{color:#06x}");
}`,
    starter: `fn main() {
    let color = 4095;
    // TODO: print color as 0x-prefixed, zero-padded, width-6 lowercase hex
}`,
    tags: ['println', 'formatting', 'radix']
  },
  {
    id: 'rs-ch01-c-068',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Right-Justified Number Column',
    prompt: `Print three numbers, one per line, all right-aligned in a width-6 field so their right edges line up. Bind 5, 50, and 5000 and produce exactly (each line is padded to six characters with leading spaces):

     5
    50
  5000

Use the same width specifier for each line.`,
    hints: [
      'A width of 6 right-aligns numbers by default.',
      'Three println! calls, each with a width-6 placeholder.'
    ],
    solution: `fn main() {
    let a = 5;
    let b = 50;
    let c = 5000;
    println!("{a:6}");
    println!("{b:6}");
    println!("{c:6}");
}`,
    starter: `fn main() {
    // TODO: print 5, 50, and 5000 each right-aligned in width 6
}`,
    tags: ['println', 'formatting', 'width']
  },
  {
    id: 'rs-ch01-c-069',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Custom Fill Character',
    prompt: `Print the word "GO" centered in a field of width 10 using a DOT as the fill character, producing exactly:

....GO....

Use the format placeholder's fill and alignment feature: specify the fill character, the center-alignment flag, and the width.`,
    hints: [
      'The fill character comes first, then the alignment flag, then the width.',
      'The center-alignment flag is a caret ^.',
      'For a dot fill and centering in width 10, the spec is colon then dot then caret then 10.'
    ],
    solution: `fn main() {
    let s = "GO";
    println!("{s:.^10}");
}`,
    starter: `fn main() {
    let s = "GO";
    // TODO: center s in width 10 using '.' as the fill character
}`,
    tags: ['println', 'formatting', 'alignment']
  },
  {
    id: 'rs-ch01-c-070',
    chapter: 1,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Formatted Progress Readout',
    prompt: `Bind \`done = 3\` and \`total = 8\`. Compute the percentage as an integer (done times 100 divided by total) and print a single line that combines width, alignment, and a literal percent sign, formatted exactly:

[3/8]  37% complete

Specifically: the "[3/8]" part uses the bound values, then there are two spaces, then the percentage right-aligned in a width-3 field (so 37 shows as a space then 37), then "% complete". Do not hard-code 37.`,
    hints: [
      'Compute pct = done * 100 / total with integer arithmetic (this gives 37).',
      'Right-align the percentage in a width-3 placeholder so it reads as space, 3, 7.',
      'Put the literal percent sign and the word complete right after the placeholder.'
    ],
    solution: `fn main() {
    let done = 3;
    let total = 8;
    let pct = done * 100 / total;
    println!("[{done}/{total}]  {pct:3}% complete");
}`,
    starter: `fn main() {
    let done = 3;
    let total = 8;
    // TODO: compute the percentage and print the formatted progress line
}`,
    tags: ['arithmetic', 'println', 'formatting']
  }
]

export default problems
