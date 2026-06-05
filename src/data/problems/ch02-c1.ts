import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch02-c-001',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Bring std::io Into Scope',
    prompt: `Write the use statement that brings the standard input/output library into scope so you can read a line of input. Then in main, print the message "Ready to read input".

Your program must start with the correct use declaration at the top of the file. Print exactly: Ready to read input`,
    hints: [
      'The input/output library lives in the std::io path.',
      'Put the use statement above fn main.',
    ],
    solution: `use std::io;

fn main() {
    println!("Ready to read input");
}`,
    starter: `// TODO: add the use statement for the io library

fn main() {
    // TODO: print the message
}`,
    tags: ['io', 'use'],
  },
  {
    id: 'rs-ch02-c-002',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Create An Empty String',
    prompt: `In main, create a new mutable variable named guess that holds a fresh empty String. Then print it using println! with the debug formatter so the output shows two quotes for the empty string.

Hint about output: printing an empty String with the debug formatter prints a pair of double quotes.`,
    hints: [
      'Use String::new() to make an empty growable string.',
      'Make the variable mutable with let mut.',
      'The debug formatter inside println! is written with curly braces containing a question mark.',
    ],
    solution: `fn main() {
    let mut guess = String::new();
    println!("{:?}", guess);
}`,
    starter: `fn main() {
    // TODO: create an empty mutable String named guess
    // TODO: print it with the debug formatter
}`,
    tags: ['string', 'mut'],
  },
  {
    id: 'rs-ch02-c-003',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Read One Line Of Input',
    prompt: `Read a single line of text typed by the user into a String, then print it back exactly as received (it will include the trailing newline).

Use io::stdin().read_line(...) and pass a mutable reference to your String. Use .expect("Failed to read line") to handle the Result. Print the line with println!.`,
    hints: [
      'You must pass &mut guess to read_line.',
      'read_line returns a Result; call .expect on it.',
    ],
    solution: `use std::io;

fn main() {
    let mut guess = String::new();
    io::stdin()
        .read_line(&mut guess)
        .expect("Failed to read line");
    println!("{}", guess);
}`,
    starter: `use std::io;

fn main() {
    let mut guess = String::new();
    // TODO: read a line into guess and handle the Result
    println!("{}", guess);
}`,
    tags: ['io', 'read_line', 'mut'],
  },
  {
    id: 'rs-ch02-c-004',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Echo With A Greeting',
    prompt: `Ask the user for their name. Read a line of input into a String, then print: Hello, NAME (where NAME is whatever they typed).

Print the prompt "What is your name?" before reading. Note: the input will contain a trailing newline, which is fine for this exercise.`,
    hints: [
      'Print the question first with println!.',
      'Read into a mutable String with read_line and .expect.',
    ],
    solution: `use std::io;

fn main() {
    println!("What is your name?");
    let mut name = String::new();
    io::stdin()
        .read_line(&mut name)
        .expect("Failed to read line");
    print!("Hello, {}", name);
}`,
    starter: `use std::io;

fn main() {
    println!("What is your name?");
    let mut name = String::new();
    // TODO: read the name and print the greeting
}`,
    tags: ['io', 'read_line'],
  },
  {
    id: 'rs-ch02-c-005',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Trim Trailing Whitespace',
    prompt: `Read a line of input into a String, then create a trimmed version using .trim() and print the trimmed text followed by an exclamation mark on the same line.

For input "world" the output should be exactly: world!
The .trim() call removes the leading and trailing whitespace, including the newline from pressing Enter.`,
    hints: [
      'Call .trim() on the String to get a &str without surrounding whitespace.',
      'You can bind the trimmed result to a new variable.',
    ],
    solution: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let trimmed = input.trim();
    println!("{}!", trimmed);
}`,
    starter: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    // TODO: trim the input and print it with a trailing '!'
}`,
    tags: ['io', 'trim'],
  },
  {
    id: 'rs-ch02-c-006',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Parse A Number From Input',
    prompt: `Read a line of input, trim it, and parse it into a u32 using .parse(). Use .expect("Please type a number!") to handle the Result. Then print: You entered N (where N is the number).

Annotate the parsed variable with the type u32 so parse knows what to produce.`,
    hints: [
      'Write the type annotation: let n: u32 = ...',
      'Chain .trim().parse() and then .expect on the Result.',
    ],
    solution: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let n: u32 = input.trim().parse().expect("Please type a number!");
    println!("You entered {}", n);
}`,
    starter: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    // TODO: parse the trimmed input into a u32 and print it
}`,
    tags: ['io', 'parse', 'u32'],
  },
  {
    id: 'rs-ch02-c-007',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Shadow A String Into A Number',
    prompt: `Read a line of input into a variable named value (a String). Then use shadowing to redeclare value as a u32 parsed from the trimmed string. Print: value is N

Use the SAME name value for both the String and the parsed number, demonstrating shadowing.`,
    hints: [
      'Shadowing means writing let value again with the same name.',
      'The second let binds value to the parsed u32.',
    ],
    solution: `use std::io;

fn main() {
    let mut value = String::new();
    io::stdin()
        .read_line(&mut value)
        .expect("Failed to read line");
    let value: u32 = value.trim().parse().expect("Please type a number!");
    println!("value is {}", value);
}`,
    starter: `use std::io;

fn main() {
    let mut value = String::new();
    io::stdin()
        .read_line(&mut value)
        .expect("Failed to read line");
    // TODO: shadow value with a parsed u32, then print it
}`,
    tags: ['shadowing', 'parse', 'io'],
  },
  {
    id: 'rs-ch02-c-008',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Compare Two Fixed Numbers',
    prompt: `Without reading any input, compare two fixed numbers using cmp and match on Ordering. Let a be 7 and b be 10. Use a.cmp(&b) and match on the three Ordering variants, printing:
- "Less" for Ordering::Less
- "Greater" for Ordering::Greater
- "Equal" for Ordering::Equal

For these values it should print: Less`,
    hints: [
      'Bring std::cmp::Ordering into scope with a use statement.',
      'match a.cmp(&b) with arms for Less, Greater, and Equal.',
    ],
    solution: `use std::cmp::Ordering;

fn main() {
    let a = 7;
    let b = 10;
    match a.cmp(&b) {
        Ordering::Less => println!("Less"),
        Ordering::Greater => println!("Greater"),
        Ordering::Equal => println!("Equal"),
    }
}`,
    starter: `use std::cmp::Ordering;

fn main() {
    let a = 7;
    let b = 10;
    // TODO: match on a.cmp(&b) and print Less/Greater/Equal
}`,
    tags: ['ordering', 'match', 'cmp'],
  },
  {
    id: 'rs-ch02-c-009',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Loop That Counts To Five',
    prompt: `Use a loop with a mutable counter to print the numbers 1 through 5, each on its own line. Start the counter at 1, print it, increment it, and use break to stop once it goes past 5.

Expected output (one per line): 1 2 3 4 5`,
    hints: [
      'Start with let mut count = 1; and a loop { } block.',
      'Inside the loop, break when count is greater than 5.',
      'Increment with count += 1 after printing.',
    ],
    solution: `fn main() {
    let mut count = 1;
    loop {
        if count > 5 {
            break;
        }
        println!("{}", count);
        count += 1;
    }
}`,
    starter: `fn main() {
    let mut count = 1;
    loop {
        // TODO: break when count passes 5, otherwise print and increment
    }
}`,
    tags: ['loop', 'break', 'mut'],
  },
  {
    id: 'rs-ch02-c-010',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Break Out On A Target',
    prompt: `Use a loop with a mutable counter starting at 0. Each iteration, increment the counter and print it. When the counter reaches 3, print "Reached the target!" and break.

Expected output:
1
2
3
Reached the target!`,
    hints: [
      'Increment first so the first printed value is 1.',
      'After printing, check if the counter equals 3 to break.',
    ],
    solution: `fn main() {
    let mut n = 0;
    loop {
        n += 1;
        println!("{}", n);
        if n == 3 {
            println!("Reached the target!");
            break;
        }
    }
}`,
    starter: `fn main() {
    let mut n = 0;
    loop {
        // TODO: increment, print, and break when n is 3
    }
}`,
    tags: ['loop', 'break', 'mut'],
  },
  {
    id: 'rs-ch02-c-011',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Skip With Continue',
    prompt: `Use a loop with a mutable counter from 1 to 6. Print only the EVEN numbers by using continue to skip odd ones. Stop after 6 with break.

Expected output (one per line): 2 4 6`,
    hints: [
      'Use the remainder operator % to test for evenness (n % 2).',
      'If the number is odd, increment and then continue.',
      'Be careful to increment before continue so you do not loop forever.',
    ],
    solution: `fn main() {
    let mut n = 0;
    loop {
        n += 1;
        if n > 6 {
            break;
        }
        if n % 2 != 0 {
            continue;
        }
        println!("{}", n);
    }
}`,
    starter: `fn main() {
    let mut n = 0;
    loop {
        n += 1;
        // TODO: break past 6, skip odd numbers with continue, print even ones
    }
}`,
    tags: ['loop', 'continue', 'break'],
  },
  {
    id: 'rs-ch02-c-012',
    chapter: 2,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Read, Trim, And Report Length',
    prompt: `Read a line of input into a String, trim it, and print the number of characters in the trimmed text using .len().

For input "hello" print exactly: length is 5
The .len() method returns the number of bytes, which equals the number of characters for plain ASCII input.`,
    hints: [
      'Bind the trimmed &str to a variable, then call .len() on it.',
      'len() returns a usize you can print directly.',
    ],
    solution: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let trimmed = input.trim();
    println!("length is {}", trimmed.len());
}`,
    starter: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    // TODO: print the length of the trimmed input
}`,
    tags: ['io', 'trim', 'len'],
  },
  {
    id: 'rs-ch02-c-013',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Higher Or Lower Than Fifty',
    prompt: `Read a number from input (parse to u32) and compare it to the secret value 50 using cmp and match on Ordering. Print:
- "Too low!" if the input is less than 50
- "Too high!" if greater than 50
- "You got it!" if equal to 50`,
    hints: [
      'Use std::cmp::Ordering and match on guess.cmp(&50).',
      'Map Less -> "Too low!", Greater -> "Too high!", Equal -> "You got it!".',
    ],
    solution: `use std::io;
use std::cmp::Ordering;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let guess: u32 = input.trim().parse().expect("Please type a number!");
    match guess.cmp(&50) {
        Ordering::Less => println!("Too low!"),
        Ordering::Greater => println!("Too high!"),
        Ordering::Equal => println!("You got it!"),
    }
}`,
    starter: `use std::io;
use std::cmp::Ordering;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let guess: u32 = input.trim().parse().expect("Please type a number!");
    // TODO: match guess.cmp(&50) and print the three messages
}`,
    tags: ['io', 'parse', 'ordering', 'match'],
  },
  {
    id: 'rs-ch02-c-014',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Sum Of Two Inputs',
    prompt: `Read two separate lines of input, parsing each into an i32. Print their sum in the form: sum is N

Read the first number into one String and the second into another String (or reuse a cleared approach is not yet known, so use two Strings). Trim and parse each before adding.`,
    hints: [
      'Use two String variables, one for each read_line call.',
      'Parse each trimmed string into an i32 with .expect.',
      'Add the two numbers and print the result.',
    ],
    solution: `use std::io;

fn main() {
    let mut first = String::new();
    io::stdin()
        .read_line(&mut first)
        .expect("Failed to read line");
    let a: i32 = first.trim().parse().expect("Please type a number!");

    let mut second = String::new();
    io::stdin()
        .read_line(&mut second)
        .expect("Failed to read line");
    let b: i32 = second.trim().parse().expect("Please type a number!");

    println!("sum is {}", a + b);
}`,
    starter: `use std::io;

fn main() {
    let mut first = String::new();
    io::stdin()
        .read_line(&mut first)
        .expect("Failed to read line");
    // TODO: parse first, read and parse a second number, print the sum
}`,
    tags: ['io', 'parse', 'arithmetic'],
  },
  {
    id: 'rs-ch02-c-015',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Parse To A Float',
    prompt: `Read a line of input and parse it into an f64 (a 64-bit floating point number). Print double the value in the form: doubled is N

For input "2.5" the output should be: doubled is 5`,
    hints: [
      'Annotate the variable type as f64.',
      'Multiply the parsed value by 2.0 (a float literal) before printing.',
    ],
    solution: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let value: f64 = input.trim().parse().expect("Please type a number!");
    println!("doubled is {}", value * 2.0);
}`,
    starter: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    // TODO: parse into an f64 and print double the value
}`,
    tags: ['io', 'parse', 'f64'],
  },
  {
    id: 'rs-ch02-c-016',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Even Or Odd From Input',
    prompt: `Read a number from input (parse to u32). Print "even" if it is divisible by 2, otherwise print "odd".

Use the remainder operator % and an if/else expression.`,
    hints: [
      'A number is even when n % 2 equals 0.',
      'Use a plain if/else with the two println! calls.',
    ],
    solution: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let n: u32 = input.trim().parse().expect("Please type a number!");
    if n % 2 == 0 {
        println!("even");
    } else {
        println!("odd");
    }
}`,
    starter: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let n: u32 = input.trim().parse().expect("Please type a number!");
    // TODO: print "even" or "odd"
}`,
    tags: ['io', 'parse', 'conditional'],
  },
  {
    id: 'rs-ch02-c-017',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Range Check For A Guess',
    prompt: `Read a number from input (parse to i32). The valid range is 1 to 100 inclusive. Print:
- "too low, below range" if the number is less than 1
- "too high, above range" if the number is greater than 100
- "in range" otherwise

Use if / else if / else.`,
    hints: [
      'Check the less-than-1 case first, then greater-than-100, then else.',
      'Use comparison operators < and > with if/else if.',
    ],
    solution: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let n: i32 = input.trim().parse().expect("Please type a number!");
    if n < 1 {
        println!("too low, below range");
    } else if n > 100 {
        println!("too high, above range");
    } else {
        println!("in range");
    }
}`,
    starter: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let n: i32 = input.trim().parse().expect("Please type a number!");
    // TODO: print the range message
}`,
    tags: ['io', 'parse', 'conditional'],
  },
  {
    id: 'rs-ch02-c-018',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Guess Against A Constant Secret',
    prompt: `Set a secret number to 42 using a let binding (no input needed for the secret). Read one guess from input, parse it to u32, and compare against the secret using cmp and match on Ordering. Print "Too small!", "Too big!", or "Correct!" accordingly.`,
    hints: [
      'Define let secret = 42; before reading input.',
      'match guess.cmp(&secret) with the three Ordering arms.',
    ],
    solution: `use std::io;
use std::cmp::Ordering;

fn main() {
    let secret = 42;
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let guess: u32 = input.trim().parse().expect("Please type a number!");
    match guess.cmp(&secret) {
        Ordering::Less => println!("Too small!"),
        Ordering::Greater => println!("Too big!"),
        Ordering::Equal => println!("Correct!"),
    }
}`,
    starter: `use std::io;
use std::cmp::Ordering;

fn main() {
    let secret = 42;
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let guess: u32 = input.trim().parse().expect("Please type a number!");
    // TODO: compare guess against secret with cmp and match
}`,
    tags: ['io', 'ordering', 'match'],
  },
  {
    id: 'rs-ch02-c-019',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Parse Error Handled With Match',
    prompt: `Read a line of input and try to parse it into an i32. Instead of using .expect, match on the Result of .parse(): on Ok(n) print "got N", and on Err(_) print "not a number".

This shows handling parse failure with match rather than crashing.`,
    hints: [
      'parse() returns a Result; match it with Ok(n) and Err(_) arms.',
      'You may need to annotate the type, for example: input.trim().parse::<i32>().',
    ],
    solution: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    match input.trim().parse::<i32>() {
        Ok(n) => println!("got {}", n),
        Err(_) => println!("not a number"),
    }
}`,
    starter: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    // TODO: match on input.trim().parse::<i32>() with Ok and Err arms
}`,
    tags: ['io', 'parse', 'match', 'result'],
  },
  {
    id: 'rs-ch02-c-020',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Retry Until A Valid Number',
    prompt: `Loop, reading a line each time. Parse the trimmed input into a u32 using a match on the Result. On Ok(n), print "You typed N" and break. On Err(_), print "That was not a number, try again" and continue the loop.

Remember to create a fresh empty String inside the loop for each read.`,
    hints: [
      'Put let mut input = String::new(); inside the loop so it is cleared each time.',
      'match on parse: Ok(n) breaks, Err(_) prints and loops again.',
      'You can break right after the Ok println!.',
    ],
    solution: `use std::io;

fn main() {
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        match input.trim().parse::<u32>() {
            Ok(n) => {
                println!("You typed {}", n);
                break;
            }
            Err(_) => {
                println!("That was not a number, try again");
                continue;
            }
        }
    }
}`,
    starter: `use std::io;

fn main() {
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        // TODO: match parse; on Ok print and break, on Err print and continue
    }
}`,
    tags: ['loop', 'parse', 'match', 'retry'],
  },
  {
    id: 'rs-ch02-c-021',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Guessing Loop Until Correct',
    prompt: `The secret number is 17. Loop reading guesses (parse each to u32 with .expect). Each iteration compare against the secret with cmp and match on Ordering: print "Too small!" or "Too big!" and keep looping, or print "You win!" and break when equal.`,
    hints: [
      'Read a fresh String each iteration inside the loop.',
      'Only the Equal arm should break; the others just print and loop again.',
    ],
    solution: `use std::io;
use std::cmp::Ordering;

fn main() {
    let secret = 17;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let guess: u32 = input.trim().parse().expect("Please type a number!");
        match guess.cmp(&secret) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("You win!");
                break;
            }
        }
    }
}`,
    starter: `use std::io;
use std::cmp::Ordering;

fn main() {
    let secret = 17;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let guess: u32 = input.trim().parse().expect("Please type a number!");
        // TODO: compare and break only when Equal
    }
}`,
    tags: ['loop', 'ordering', 'match', 'break'],
  },
  {
    id: 'rs-ch02-c-022',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Quit On The Word Quit',
    prompt: `Loop reading lines of input. If the trimmed line equals "quit", print "Goodbye" and break. Otherwise print "You said: TEXT" (where TEXT is the trimmed line) and keep looping.`,
    hints: [
      'Compare the trimmed &str with the string literal "quit" using ==.',
      'Read a fresh String inside the loop each time.',
    ],
    solution: `use std::io;

fn main() {
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let text = input.trim();
        if text == "quit" {
            println!("Goodbye");
            break;
        }
        println!("You said: {}", text);
    }
}`,
    starter: `use std::io;

fn main() {
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let text = input.trim();
        // TODO: break on "quit", otherwise echo the text
    }
}`,
    tags: ['loop', 'trim', 'break', 'io'],
  },
  {
    id: 'rs-ch02-c-023',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Skip Zero, Sum The Rest',
    prompt: `Read exactly five numbers, one per line, parsing each to i32 with .expect. Keep a running mutable total, but use continue to SKIP any value equal to 0 (do not add it). After reading all five, print: total is N

Use a loop with a counter that breaks after five reads.`,
    hints: [
      'Track how many numbers you have read with a mutable counter.',
      'If a parsed value is 0, continue without adding it (still count it as read).',
      'Break once you have read five numbers.',
    ],
    solution: `use std::io;

fn main() {
    let mut total = 0;
    let mut count = 0;
    loop {
        if count == 5 {
            break;
        }
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let n: i32 = input.trim().parse().expect("Please type a number!");
        count += 1;
        if n == 0 {
            continue;
        }
        total += n;
    }
    println!("total is {}", total);
}`,
    starter: `use std::io;

fn main() {
    let mut total = 0;
    let mut count = 0;
    loop {
        // TODO: read five numbers, skipping zeros, summing the rest
    }
    println!("total is {}", total);
}`,
    tags: ['loop', 'continue', 'parse', 'accumulate'],
  },
  {
    id: 'rs-ch02-c-024',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Attempts To Win',
    prompt: `The secret number is 8. Loop reading guesses (parse to u32 with .expect), and keep a mutable attempts counter that increases each guess. When the guess equals the secret, print: Solved in N attempts (where N is the number of guesses made) and break. For wrong guesses, print "Keep trying" and loop.`,
    hints: [
      'Increment attempts at the start of each iteration after reading.',
      'Compare with cmp/match or a simple if; only break on equality.',
      'Print the attempts count in the win message.',
    ],
    solution: `use std::io;
use std::cmp::Ordering;

fn main() {
    let secret = 8;
    let mut attempts = 0;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let guess: u32 = input.trim().parse().expect("Please type a number!");
        attempts += 1;
        match guess.cmp(&secret) {
            Ordering::Equal => {
                println!("Solved in {} attempts", attempts);
                break;
            }
            _ => println!("Keep trying"),
        }
    }
}`,
    starter: `use std::io;
use std::cmp::Ordering;

fn main() {
    let secret = 8;
    let mut attempts = 0;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let guess: u32 = input.trim().parse().expect("Please type a number!");
        // TODO: count attempts and break on the correct guess
    }
}`,
    tags: ['loop', 'ordering', 'accumulate', 'break'],
  },
  {
    id: 'rs-ch02-c-025',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Reject Out-Of-Range Guesses',
    prompt: `The secret number is 55. Loop reading guesses, parsing each to u32 with .expect. If a guess is not between 1 and 100 inclusive, print "Out of range, try again" and continue. Otherwise compare with cmp/match: print "Too low!"/"Too high!" and loop, or "Correct!" and break.`,
    hints: [
      'Check the range with an if before comparing to the secret.',
      'Use continue to skip the comparison when out of range.',
      'Only break on the Equal arm.',
    ],
    solution: `use std::io;
use std::cmp::Ordering;

fn main() {
    let secret = 55;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let guess: u32 = input.trim().parse().expect("Please type a number!");
        if guess < 1 || guess > 100 {
            println!("Out of range, try again");
            continue;
        }
        match guess.cmp(&secret) {
            Ordering::Less => println!("Too low!"),
            Ordering::Greater => println!("Too high!"),
            Ordering::Equal => {
                println!("Correct!");
                break;
            }
        }
    }
}`,
    starter: `use std::io;
use std::cmp::Ordering;

fn main() {
    let secret = 55;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let guess: u32 = input.trim().parse().expect("Please type a number!");
        // TODO: reject out-of-range with continue, else compare and maybe break
    }
}`,
    tags: ['loop', 'continue', 'ordering', 'range'],
  },
  {
    id: 'rs-ch02-c-026',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Gracefully Skip Bad Input In Guessing Loop',
    prompt: `The secret number is 30. Loop reading guesses. Parse each with a match on the Result: on Err(_), print "Please type a number" and continue (do NOT crash). On Ok(guess), compare to the secret with cmp/match: "Too low!"/"Too high!" loops, "You win!" breaks.

This mirrors the final guessing game from the chapter where bad input is skipped instead of crashing.`,
    hints: [
      'Wrap parse in match Ok/Err; the Err arm uses continue.',
      'You can shadow the guess as the Ok value inside the match arm.',
      'Only Equal breaks the loop.',
    ],
    solution: `use std::io;
use std::cmp::Ordering;

fn main() {
    let secret = 30;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let guess: u32 = match input.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("Please type a number");
                continue;
            }
        };
        match guess.cmp(&secret) {
            Ordering::Less => println!("Too low!"),
            Ordering::Greater => println!("Too high!"),
            Ordering::Equal => {
                println!("You win!");
                break;
            }
        }
    }
}`,
    starter: `use std::io;
use std::cmp::Ordering;

fn main() {
    let secret = 30;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        // TODO: parse with match (Err -> continue), then compare with the secret
    }
}`,
    tags: ['loop', 'parse', 'match', 'ordering'],
  },
  {
    id: 'rs-ch02-c-027',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Largest Of Three Inputs',
    prompt: `Read three numbers, one per line, parsing each to i32 with .expect. Print the largest of the three in the form: largest is N

Use comparisons with if/else (and the comparison operators) to find the maximum. Do not use any library max function.`,
    hints: [
      'Start by assuming the first number is the largest.',
      'Compare the second and third against your current largest, updating with let mut.',
    ],
    solution: `use std::io;

fn read_i32() -> i32 {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    input.trim().parse().expect("Please type a number!")
}

fn main() {
    let a = read_i32();
    let b = read_i32();
    let c = read_i32();
    let mut largest = a;
    if b > largest {
        largest = b;
    }
    if c > largest {
        largest = c;
    }
    println!("largest is {}", largest);
}`,
    starter: `use std::io;

fn read_i32() -> i32 {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    input.trim().parse().expect("Please type a number!")
}

fn main() {
    let a = read_i32();
    let b = read_i32();
    let c = read_i32();
    // TODO: find and print the largest of a, b, c
}`,
    tags: ['io', 'parse', 'conditional'],
  },
  {
    id: 'rs-ch02-c-028',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Reusable Read-A-Number Helper',
    prompt: `Write a function read_number() -> u32 that creates a String, reads one line from stdin, trims it, parses it to u32 with .expect, and returns the number. In main, call it twice and print the product in the form: product is N`,
    hints: [
      'The function body returns the parsed value as its last expression (no semicolon).',
      'Call read_number() twice in main, multiply, and print.',
    ],
    solution: `use std::io;

fn read_number() -> u32 {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    input.trim().parse().expect("Please type a number!")
}

fn main() {
    let a = read_number();
    let b = read_number();
    println!("product is {}", a * b);
}`,
    starter: `use std::io;

fn read_number() -> u32 {
    // TODO: read a line, trim, parse to u32, and return it
}

fn main() {
    let a = read_number();
    let b = read_number();
    println!("product is {}", a * b);
}`,
    tags: ['io', 'parse', 'functions'],
  },
  {
    id: 'rs-ch02-c-029',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Countdown From Input',
    prompt: `Read a number N from input (parse to u32). Then use a loop with a mutable counter to print a countdown from N down to 1, each on its own line, and finally print "Liftoff!". If N is 0, just print "Liftoff!".

For input 3 the output is:
3
2
1
Liftoff!`,
    hints: [
      'Start the counter at N and break when it reaches 0.',
      'Print the counter, then decrement it with counter -= 1.',
    ],
    solution: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let mut n: u32 = input.trim().parse().expect("Please type a number!");
    loop {
        if n == 0 {
            break;
        }
        println!("{}", n);
        n -= 1;
    }
    println!("Liftoff!");
}`,
    starter: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let mut n: u32 = input.trim().parse().expect("Please type a number!");
    // TODO: count down to 1, then print "Liftoff!"
}`,
    tags: ['io', 'parse', 'loop', 'break'],
  },
  {
    id: 'rs-ch02-c-030',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Limit Guesses To Three Tries',
    prompt: `The secret number is 25. The player gets at most 3 guesses. Loop with a mutable tries counter. Each iteration read and parse a guess (with .expect). If it matches the secret, print "You win!" and break. Otherwise print "Wrong". After 3 wrong guesses, print "Out of guesses, the number was 25" and break.`,
    hints: [
      'Increment tries each iteration; break when tries reaches 3 without a win.',
      'Check for the winning guess before checking the try limit.',
    ],
    solution: `use std::io;

fn main() {
    let secret = 25;
    let mut tries = 0;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let guess: u32 = input.trim().parse().expect("Please type a number!");
        tries += 1;
        if guess == secret {
            println!("You win!");
            break;
        }
        println!("Wrong");
        if tries == 3 {
            println!("Out of guesses, the number was 25");
            break;
        }
    }
}`,
    starter: `use std::io;

fn main() {
    let secret = 25;
    let mut tries = 0;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let guess: u32 = input.trim().parse().expect("Please type a number!");
        // TODO: win, or count tries and stop after 3
    }
}`,
    tags: ['loop', 'parse', 'break', 'accumulate'],
  },
  {
    id: 'rs-ch02-c-031',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Sum Inputs Until Negative',
    prompt: `Loop reading numbers (parse each to i32 with .expect), adding each to a mutable running total. As soon as a NEGATIVE number is entered, stop reading (break) WITHOUT adding it, and print: total is N (the sum of the non-negative numbers read so far).`,
    hints: [
      'Check if the number is negative right after parsing; if so, break before adding.',
      'Otherwise add it to the total and loop again.',
    ],
    solution: `use std::io;

fn main() {
    let mut total = 0;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let n: i32 = input.trim().parse().expect("Please type a number!");
        if n < 0 {
            break;
        }
        total += n;
    }
    println!("total is {}", total);
}`,
    starter: `use std::io;

fn main() {
    let mut total = 0;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let n: i32 = input.trim().parse().expect("Please type a number!");
        // TODO: break on negative without adding, otherwise accumulate
    }
    println!("total is {}", total);
}`,
    tags: ['loop', 'parse', 'break', 'accumulate'],
  },
  {
    id: 'rs-ch02-c-032',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Distance From The Secret',
    prompt: `The secret number is 60. Read one guess (parse to u32 with .expect). Print how far off the guess is using the form: off by N (the absolute difference between guess and secret). Use cmp/match or comparisons to compute the difference without going negative, since both values are u32.`,
    hints: [
      'For unsigned numbers, subtract the smaller from the larger to avoid underflow.',
      'Use an if/else (or match on cmp) to decide which subtraction to do.',
    ],
    solution: `use std::io;
use std::cmp::Ordering;

fn main() {
    let secret: u32 = 60;
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let guess: u32 = input.trim().parse().expect("Please type a number!");
    let diff = match guess.cmp(&secret) {
        Ordering::Greater => guess - secret,
        Ordering::Less => secret - guess,
        Ordering::Equal => 0,
    };
    println!("off by {}", diff);
}`,
    starter: `use std::io;
use std::cmp::Ordering;

fn main() {
    let secret: u32 = 60;
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let guess: u32 = input.trim().parse().expect("Please type a number!");
    // TODO: compute the absolute difference and print "off by N"
}`,
    tags: ['io', 'ordering', 'match', 'arithmetic'],
  },
  {
    id: 'rs-ch02-c-033',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Warmer Or Colder Feedback',
    prompt: `The secret number is 50. Loop reading guesses (parse to u32, skipping bad input with a match Err -> continue). Compare each guess to the secret with cmp/match. Print "warmer than the edge" when the guess is within 10 of the secret but not equal (use comparisons), "cold" when farther than 10 away, and "exact!" then break when it equals the secret.`,
    hints: [
      'First handle the Equal case (print and break).',
      'For non-equal guesses, compute the distance with the larger-minus-smaller trick, then test against 10.',
    ],
    solution: `use std::io;
use std::cmp::Ordering;

fn main() {
    let secret: u32 = 50;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let guess: u32 = match input.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };
        match guess.cmp(&secret) {
            Ordering::Equal => {
                println!("exact!");
                break;
            }
            Ordering::Greater => {
                if guess - secret <= 10 {
                    println!("warmer than the edge");
                } else {
                    println!("cold");
                }
            }
            Ordering::Less => {
                if secret - guess <= 10 {
                    println!("warmer than the edge");
                } else {
                    println!("cold");
                }
            }
        }
    }
}`,
    starter: `use std::io;
use std::cmp::Ordering;

fn main() {
    let secret: u32 = 50;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let guess: u32 = match input.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };
        // TODO: print warmer/cold based on distance, break on exact match
    }
}`,
    tags: ['loop', 'ordering', 'match', 'parse'],
  },
  {
    id: 'rs-ch02-c-034',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Validate Range Then Guess With Retries',
    prompt: `The secret number is 73. Loop reading guesses. For each line: parse with match (Err(_) -> print "not a number" and continue). Then if the value is outside 1..=100 inclusive, print "out of bounds" and continue. Otherwise compare with cmp/match: "Too low!"/"Too high!" loop, and "Correct!" breaks. This combines parse-error handling, range checks, and the comparison loop.`,
    hints: [
      'Order the checks: parse first, then range, then comparison.',
      'Both the Err arm and the out-of-range branch use continue.',
      'Only the Equal arm breaks.',
    ],
    solution: `use std::io;
use std::cmp::Ordering;

fn main() {
    let secret: u32 = 73;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let guess: u32 = match input.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("not a number");
                continue;
            }
        };
        if guess < 1 || guess > 100 {
            println!("out of bounds");
            continue;
        }
        match guess.cmp(&secret) {
            Ordering::Less => println!("Too low!"),
            Ordering::Greater => println!("Too high!"),
            Ordering::Equal => {
                println!("Correct!");
                break;
            }
        }
    }
}`,
    starter: `use std::io;
use std::cmp::Ordering;

fn main() {
    let secret: u32 = 73;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        // TODO: parse (Err -> continue), range-check (continue), then compare
    }
}`,
    tags: ['loop', 'parse', 'range', 'ordering'],
  },
  {
    id: 'rs-ch02-c-035',
    chapter: 2,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Full Bounded Guessing Game',
    prompt: `Build a complete guessing game with a fixed secret of 64. Loop forever. Each round: print "Please input your guess.", read a line, and parse to u32 using match (Ok(num) keeps the number, Err(_) prints "Please type a number!" and continues). Print "You guessed: G". Then match guess.cmp(&secret): print "Too small!", "Too big!", or on Equal print "You win!" and break. This is essentially the chapter's finished program with a constant secret.`,
    hints: [
      'Read a fresh String inside the loop on every round.',
      'Use the let guess = match ... { Ok(num) => num, Err(_) => continue } pattern.',
      'Only break inside the Equal arm of the comparison match.',
    ],
    solution: `use std::io;
use std::cmp::Ordering;

fn main() {
    let secret_number: u32 = 64;
    loop {
        println!("Please input your guess.");
        let mut guess = String::new();
        io::stdin()
            .read_line(&mut guess)
            .expect("Failed to read line");
        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("Please type a number!");
                continue;
            }
        };
        println!("You guessed: {}", guess);
        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("You win!");
                break;
            }
        }
    }
}`,
    starter: `use std::io;
use std::cmp::Ordering;

fn main() {
    let secret_number: u32 = 64;
    loop {
        println!("Please input your guess.");
        let mut guess = String::new();
        io::stdin()
            .read_line(&mut guess)
            .expect("Failed to read line");
        // TODO: parse with match, echo the guess, compare, and break on a win
    }
}`,
    tags: ['loop', 'parse', 'ordering', 'match'],
  },
]

export default problems
