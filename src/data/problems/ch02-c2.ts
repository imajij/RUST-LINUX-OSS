import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch02-c-036',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Echo a Line of Input',
    prompt: `Write a program that reads ONE line of text from standard input and prints it back, prefixed with "You said: ".

Requirements:
- Use std::io to read a line into a String.
- Use .expect() to handle a possible read error with the message "Failed to read line".
- Trim the trailing newline so the echoed text has no extra blank line.

Example: if the input is "hello world" the program prints:
You said: hello world`,
    hints: [
      'Bring std::io into scope with use std::io;',
      'Create a mutable String with String::new() and pass &mut to read_line.',
      'input.trim() removes the trailing newline.'
    ],
    solution: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    println!("You said: {}", input.trim());
}`,
    starter: `use std::io;

fn main() {
    let mut input = String::new();
    // TODO: read a line, then print it back trimmed
}`,
    tags: ['io', 'read_line', 'string']
  },
  {
    id: 'rs-ch02-c-037',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Read and Double a Number',
    prompt: `Read a single integer from standard input, parse it to a u32, then print the value doubled.

Requirements:
- Read the line into a String and use .expect("Failed to read line") on the read.
- Trim the input and parse it to a u32 using .expect("Please type a number!").
- Print "Double: N" where N is the input times 2.

Example: input "21" prints:
Double: 42`,
    hints: [
      'Parse with input.trim().parse() and annotate the type as u32.',
      'You can write: let n: u32 = input.trim().parse().expect("...");'
    ],
    solution: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let n: u32 = input.trim().parse().expect("Please type a number!");
    println!("Double: {}", n * 2);
}`,
    starter: `use std::io;

fn main() {
    let mut input = String::new();
    // TODO: read, parse to u32, print doubled
}`,
    tags: ['io', 'parse', 'u32']
  },
  {
    id: 'rs-ch02-c-038',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Shadow a String Into a Number',
    prompt: `Demonstrate shadowing: read a line into a String variable named "value", then SHADOW it with a new variable also named "value" that holds the parsed u32.

Requirements:
- The first "value" is the raw String from read_line.
- The second "value" is created with another let binding of the same name and holds value.trim().parse() as u32.
- Print "Parsed: N" using the shadowed numeric value.

Example: input "7" prints:
Parsed: 7`,
    hints: [
      'Shadowing reuses the same name with a fresh let: let value: u32 = value.trim().parse()...',
      'The numeric value shadow can borrow the String value because parse reads from it.'
    ],
    solution: `use std::io;

fn main() {
    let mut value = String::new();
    io::stdin()
        .read_line(&mut value)
        .expect("Failed to read line");
    let value: u32 = value.trim().parse().expect("Please type a number!");
    println!("Parsed: {}", value);
}`,
    starter: `use std::io;

fn main() {
    let mut value = String::new();
    // TODO: read into value, then shadow value with the parsed u32
}`,
    tags: ['shadowing', 'parse', 'io']
  },
  {
    id: 'rs-ch02-c-039',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Compare to a Secret With Ordering',
    prompt: `A secret number is fixed at 50. Read a guess from input, parse it to a u32, and compare it to the secret using std::cmp::Ordering with a match.

Requirements:
- Use guess.cmp(&secret) inside a match.
- For Ordering::Less print "Too small!".
- For Ordering::Greater print "Too big!".
- For Ordering::Equal print "You win!".

Example: input "60" prints:
Too big!`,
    hints: [
      'Bring std::cmp::Ordering into scope.',
      'cmp takes a reference: guess.cmp(&secret).',
      'Match on the three Ordering variants.'
    ],
    solution: `use std::cmp::Ordering;
use std::io;

fn main() {
    let secret: u32 = 50;
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let guess: u32 = input.trim().parse().expect("Please type a number!");
    match guess.cmp(&secret) {
        Ordering::Less => println!("Too small!"),
        Ordering::Greater => println!("Too big!"),
        Ordering::Equal => println!("You win!"),
    }
}`,
    starter: `use std::cmp::Ordering;
use std::io;

fn main() {
    let secret: u32 = 50;
    let mut input = String::new();
    // TODO: read a guess, parse it, and match guess.cmp(&secret)
}`,
    tags: ['ordering', 'match', 'cmp']
  },
  {
    id: 'rs-ch02-c-040',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Range Check: Too High or Too Low',
    prompt: `Read a number and check whether it falls inside the inclusive range 1..=100.

Requirements:
- Parse the input to an i32.
- If the number is below 1, print "Too low".
- If the number is above 100, print "Too high".
- Otherwise print "In range".

Example: input "150" prints:
Too high`,
    hints: [
      'A simple if / else if / else chain works here.',
      'Parse to i32 so negative inputs are representable.'
    ],
    solution: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let n: i32 = input.trim().parse().expect("Please type a number!");
    if n < 1 {
        println!("Too low");
    } else if n > 100 {
        println!("Too high");
    } else {
        println!("In range");
    }
}`,
    starter: `use std::io;

fn main() {
    let mut input = String::new();
    // TODO: read, parse to i32, and classify against 1..=100
}`,
    tags: ['io', 'parse', 'range']
  },
  {
    id: 'rs-ch02-c-041',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count Down With a Loop',
    prompt: `Read a positive number n from input and count down from n to 1, printing each value on its own line, then print "Liftoff!".

Requirements:
- Parse the input to a u32.
- Use loop with a mutable counter and break when the counter reaches 0.
- Print numbers in descending order.

Example: input "3" prints:
3
2
1
Liftoff!`,
    hints: [
      'Keep a mutable counter starting at n.',
      'Inside loop, break when counter == 0, otherwise print and decrement.'
    ],
    solution: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let n: u32 = input.trim().parse().expect("Please type a number!");
    let mut counter = n;
    loop {
        if counter == 0 {
            break;
        }
        println!("{}", counter);
        counter -= 1;
    }
    println!("Liftoff!");
}`,
    starter: `use std::io;

fn main() {
    let mut input = String::new();
    // TODO: read n, then loop-count down to 1 and print Liftoff!
}`,
    tags: ['loop', 'break', 'mut']
  },
  {
    id: 'rs-ch02-c-042',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sum Numbers Until Zero',
    prompt: `Read integers one per line and keep a running sum. Stop when the user enters 0, then print the total.

Requirements:
- Use a loop that reads a fresh line each iteration.
- Parse each line to an i32.
- Break out of the loop when the parsed value is 0.
- Print "Sum: N" after the loop.

Example: inputs "5", "10", "0" produce:
Sum: 15`,
    hints: [
      'Create a NEW String each iteration, or clear it, before reading.',
      'Accumulate into a mutable sum variable declared before the loop.'
    ],
    solution: `use std::io;

fn main() {
    let mut sum: i32 = 0;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let n: i32 = input.trim().parse().expect("Please type a number!");
        if n == 0 {
            break;
        }
        sum += n;
    }
    println!("Sum: {}", sum);
}`,
    starter: `use std::io;

fn main() {
    let mut sum: i32 = 0;
    // TODO: loop reading numbers, break on 0, accumulate the sum
}`,
    tags: ['loop', 'break', 'accumulator']
  },
  {
    id: 'rs-ch02-c-043',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Retry Until a Number Is Entered',
    prompt: `Keep asking the user for input until they type a valid number, then print "Got it: N".

Requirements:
- Use a loop that reads a line each iteration.
- Use match on input.trim().parse::<i32>() with Ok(n) and Err(_) arms.
- On Ok, print the value and break.
- On Err, print "Not a number, try again." and continue the loop.

Example: inputs "abc", "12" produce:
Not a number, try again.
Got it: 12`,
    hints: [
      'match input.trim().parse() { Ok(n) => ..., Err(_) => continue }',
      'You may need to annotate the type, e.g. parse::<i32>() or a typed let.'
    ],
    solution: `use std::io;

fn main() {
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let n: i32 = match input.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("Not a number, try again.");
                continue;
            }
        };
        println!("Got it: {}", n);
        break;
    }
}`,
    starter: `use std::io;

fn main() {
    loop {
        let mut input = String::new();
        // TODO: read, match parse(); continue on Err, print and break on Ok
    }
}`,
    tags: ['loop', 'match', 'parse', 'continue']
  },
  {
    id: 'rs-ch02-c-044',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Skip Negatives, Sum Positives',
    prompt: `Read exactly 5 integers (one per line). Sum only the positive ones, using continue to skip values that are zero or negative. Print the sum at the end.

Requirements:
- Loop exactly 5 times using a mutable counter and break.
- Parse each line to an i32.
- If a value is <= 0, use continue to skip it.
- Print "Positive sum: N".

Example: inputs "3", "-2", "0", "10", "-1" produce:
Positive sum: 13`,
    hints: [
      'Track how many lines you have read in a mutable counter.',
      'Use continue to skip adding non-positive numbers, but still count the read.'
    ],
    solution: `use std::io;

fn main() {
    let mut sum: i32 = 0;
    let mut count = 0;
    loop {
        if count == 5 {
            break;
        }
        count += 1;
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let n: i32 = input.trim().parse().expect("Please type a number!");
        if n <= 0 {
            continue;
        }
        sum += n;
    }
    println!("Positive sum: {}", sum);
}`,
    starter: `use std::io;

fn main() {
    let mut sum: i32 = 0;
    let mut count = 0;
    // TODO: read 5 numbers, skip non-positive with continue, sum the rest
}`,
    tags: ['loop', 'continue', 'accumulator']
  },
  {
    id: 'rs-ch02-c-045',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Ordering Against a Fixed Target in a Loop',
    prompt: `The target is 42. Repeatedly read a guess and compare it to the target with std::cmp::Ordering. Print "Too small!" or "Too big!" and keep looping, but on "Equal" print "Correct!" and break.

Requirements:
- Use a loop.
- Parse each guess to a u32.
- match guess.cmp(&target) with the three Ordering arms.

Example: inputs "10", "50", "42" produce:
Too small!
Too big!
Correct!`,
    hints: [
      'This combines a loop with Ordering matching.',
      'Only the Equal arm should break.'
    ],
    solution: `use std::cmp::Ordering;
use std::io;

fn main() {
    let target: u32 = 42;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let guess: u32 = input.trim().parse().expect("Please type a number!");
        match guess.cmp(&target) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("Correct!");
                break;
            }
        }
    }
}`,
    starter: `use std::cmp::Ordering;
use std::io;

fn main() {
    let target: u32 = 42;
    loop {
        let mut input = String::new();
        // TODO: read guess, parse, match cmp; break only on Equal
    }
}`,
    tags: ['loop', 'ordering', 'match']
  },
  {
    id: 'rs-ch02-c-046',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Tally Even and Odd Inputs',
    prompt: `Read integers one per line until the user enters -1. Count how many are even and how many are odd (ignore the -1 sentinel itself), then print both counts.

Requirements:
- Loop reading lines, parsing each to i32.
- Break when the value is -1.
- Use the remainder operator % to test even vs odd.
- Print "Even: E Odd: O".

Example: inputs "2", "3", "4", "-1" produce:
Even: 2 Odd: 1`,
    hints: [
      'A number is even when n % 2 == 0.',
      'Keep two mutable counters declared before the loop.'
    ],
    solution: `use std::io;

fn main() {
    let mut even = 0;
    let mut odd = 0;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let n: i32 = input.trim().parse().expect("Please type a number!");
        if n == -1 {
            break;
        }
        if n % 2 == 0 {
            even += 1;
        } else {
            odd += 1;
        }
    }
    println!("Even: {} Odd: {}", even, odd);
}`,
    starter: `use std::io;

fn main() {
    let mut even = 0;
    let mut odd = 0;
    // TODO: loop reading numbers, break on -1, tally even and odd
}`,
    tags: ['loop', 'modulo', 'accumulator']
  },
  {
    id: 'rs-ch02-c-047',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Track the Maximum Seen',
    prompt: `Read integers one per line until the user enters the word "done". Keep track of the largest number seen and print it when the loop ends.

Requirements:
- Loop reading lines.
- If the trimmed line equals "done", break.
- Otherwise parse the line to an i32 and update the running maximum.
- Print "Max: N". Assume at least one number is entered before "done".

Example: inputs "4", "9", "2", "done" produce:
Max: 9`,
    hints: [
      'Compare the trimmed string to "done" before parsing.',
      'Initialize max from the first number, or use an if to update it each time.'
    ],
    solution: `use std::io;

fn main() {
    let mut max: i32 = i32::MIN;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let trimmed = input.trim();
        if trimmed == "done" {
            break;
        }
        let n: i32 = trimmed.parse().expect("Please type a number!");
        if n > max {
            max = n;
        }
    }
    println!("Max: {}", max);
}`,
    starter: `use std::io;

fn main() {
    let mut max: i32 = i32::MIN;
    // TODO: loop reading lines, break on "done", track the max number
}`,
    tags: ['loop', 'string', 'comparison']
  },
  {
    id: 'rs-ch02-c-048',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Validate Input Inside Range',
    prompt: `Ask the user for a number between 1 and 10 inclusive. Keep looping until they enter a valid in-range number, then print "Accepted: N".

Requirements:
- Loop reading a line and parsing to a u32 with .expect("Please type a number!").
- If the number is less than 1 or greater than 10, print "Out of range (1-10)." and continue.
- Otherwise print "Accepted: N" and break.

Example: inputs "0", "11", "5" produce:
Out of range (1-10).
Out of range (1-10).
Accepted: 5`,
    hints: [
      'Combine a range check with continue.',
      'You can test n < 1 || n > 10 in one condition.'
    ],
    solution: `use std::io;

fn main() {
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let n: u32 = input.trim().parse().expect("Please type a number!");
        if n < 1 || n > 10 {
            println!("Out of range (1-10).");
            continue;
        }
        println!("Accepted: {}", n);
        break;
    }
}`,
    starter: `use std::io;

fn main() {
    loop {
        let mut input = String::new();
        // TODO: read, parse, reject out-of-range with continue, accept and break
    }
}`,
    tags: ['loop', 'range', 'continue']
  },
  {
    id: 'rs-ch02-c-049',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Average of N Numbers',
    prompt: `First read a count k, then read exactly k more integers and print their average as a floating point number with two decimals.

Requirements:
- Read k and parse it to a u32.
- Loop k times reading one i32 per line, accumulating the sum as an i32.
- Print "Average: X.XX" using {:.2} formatting, computing sum as f64 divided by k as f64.

Example: input "3", then "10", "20", "30" produces:
Average: 20.00`,
    hints: [
      'Use a mutable counter to read exactly k numbers.',
      'Cast with: sum as f64 / k as f64.',
      'Format with println!("Average: {:.2}", avg);'
    ],
    solution: `use std::io;

fn main() {
    let mut first = String::new();
    io::stdin()
        .read_line(&mut first)
        .expect("Failed to read line");
    let k: u32 = first.trim().parse().expect("Please type a number!");

    let mut sum: i32 = 0;
    let mut i = 0;
    loop {
        if i == k {
            break;
        }
        i += 1;
        let mut line = String::new();
        io::stdin()
            .read_line(&mut line)
            .expect("Failed to read line");
        let n: i32 = line.trim().parse().expect("Please type a number!");
        sum += n;
    }
    let avg = sum as f64 / k as f64;
    println!("Average: {:.2}", avg);
}`,
    starter: `use std::io;

fn main() {
    // TODO: read k, then read k numbers and print their average with two decimals
}`,
    tags: ['loop', 'parse', 'casting']
  },
  {
    id: 'rs-ch02-c-050',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Guessing Game With Attempt Counter',
    prompt: `The secret is 64. Let the user guess repeatedly. Count attempts. When they guess correctly, print "Correct in A attempts!" where A is the number of guesses made.

Requirements:
- Use std::cmp::Ordering and a loop.
- Increment a mutable attempts counter on every guess (valid number).
- Parse each guess to a u32 with .expect("Please type a number!").
- Print "Too small!" / "Too big!" for the wrong arms and the attempt message on Equal, then break.

Example: inputs "32", "96", "64" produce:
Too small!
Too big!
Correct in 3 attempts!`,
    hints: [
      'Increment the counter before or right after parsing.',
      'Only break on Ordering::Equal.'
    ],
    solution: `use std::cmp::Ordering;
use std::io;

fn main() {
    let secret: u32 = 64;
    let mut attempts = 0;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let guess: u32 = input.trim().parse().expect("Please type a number!");
        attempts += 1;
        match guess.cmp(&secret) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("Correct in {} attempts!", attempts);
                break;
            }
        }
    }
}`,
    starter: `use std::cmp::Ordering;
use std::io;

fn main() {
    let secret: u32 = 64;
    let mut attempts = 0;
    loop {
        let mut input = String::new();
        // TODO: read, parse, count attempts, match cmp, break on Equal
    }
}`,
    tags: ['loop', 'ordering', 'counter']
  },
  {
    id: 'rs-ch02-c-051',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Reject Out-of-Range Guesses Politely',
    prompt: `Read a single guess that must be between 1 and 100. If it parses but is outside the range, print "Your guess is out of range." Otherwise print "Guess accepted: N".

Requirements:
- Parse to an i32 with .expect("Please type a number!").
- Check the inclusive range 1..=100.
- Print exactly one of the two messages.

Example: input "200" prints:
Your guess is out of range.`,
    hints: [
      'A single if/else after parsing is enough; no loop required.',
      'Use n < 1 || n > 100 for the out-of-range test.'
    ],
    solution: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let n: i32 = input.trim().parse().expect("Please type a number!");
    if n < 1 || n > 100 {
        println!("Your guess is out of range.");
    } else {
        println!("Guess accepted: {}", n);
    }
}`,
    starter: `use std::io;

fn main() {
    let mut input = String::new();
    // TODO: read, parse, check 1..=100, print the matching message
}`,
    tags: ['io', 'range', 'parse']
  },
  {
    id: 'rs-ch02-c-052',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Parse Two Numbers and Add',
    prompt: `Read two separate lines, each containing one integer. Parse both to i32 and print their sum.

Requirements:
- Read the first line into one String and the second line into another.
- Parse each with .expect("Please type a number!").
- Print "Sum: N".

Example: inputs "8" then "5" produce:
Sum: 13`,
    hints: [
      'Use two separate String::new() buffers, one per read_line.',
      'Trim each before parsing.'
    ],
    solution: `use std::io;

fn main() {
    let mut a = String::new();
    io::stdin()
        .read_line(&mut a)
        .expect("Failed to read line");
    let mut b = String::new();
    io::stdin()
        .read_line(&mut b)
        .expect("Failed to read line");
    let x: i32 = a.trim().parse().expect("Please type a number!");
    let y: i32 = b.trim().parse().expect("Please type a number!");
    println!("Sum: {}", x + y);
}`,
    starter: `use std::io;

fn main() {
    // TODO: read two lines, parse both to i32, print their sum
}`,
    tags: ['io', 'parse', 'arithmetic']
  },
  {
    id: 'rs-ch02-c-053',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Classify a Number as Sign',
    prompt: `Read a number and classify its sign using a match on the result of comparing it to 0 via std::cmp::Ordering.

Requirements:
- Parse the input to an i32.
- Use n.cmp(&0) in a match.
- Print "negative", "zero", or "positive" for Less, Equal, Greater respectively.

Example: input "-7" prints:
negative`,
    hints: [
      'cmp works on any two values of the same comparable type, including against 0.',
      'Match the three Ordering variants.'
    ],
    solution: `use std::cmp::Ordering;
use std::io;

fn main() {
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let n: i32 = input.trim().parse().expect("Please type a number!");
    match n.cmp(&0) {
        Ordering::Less => println!("negative"),
        Ordering::Equal => println!("zero"),
        Ordering::Greater => println!("positive"),
    }
}`,
    starter: `use std::cmp::Ordering;
use std::io;

fn main() {
    let mut input = String::new();
    // TODO: read, parse to i32, match n.cmp(&0) to classify the sign
}`,
    tags: ['ordering', 'match', 'parse']
  },
  {
    id: 'rs-ch02-c-054',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Read Until Empty Line',
    prompt: `Read lines and count how many non-empty lines were entered. Stop when the user enters a blank (empty) line. Print the count.

Requirements:
- Loop reading lines.
- Trim each line; if the trimmed line is empty, break.
- Otherwise increment a counter.
- Print "Lines: N".

Example: inputs "apple", "pear", "" (blank) produce:
Lines: 2`,
    hints: [
      'After trimming, an empty line compares equal to "".',
      'Use .is_empty() or == "" on the trimmed slice.'
    ],
    solution: `use std::io;

fn main() {
    let mut count = 0;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        if input.trim().is_empty() {
            break;
        }
        count += 1;
    }
    println!("Lines: {}", count);
}`,
    starter: `use std::io;

fn main() {
    let mut count = 0;
    // TODO: loop reading lines, break on a blank line, count the rest
}`,
    tags: ['loop', 'string', 'break']
  },
  {
    id: 'rs-ch02-c-055',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Distance From Target',
    prompt: `The target is 100. Read a guess and print how far it is from the target, plus whether it is above or below.

Requirements:
- Parse the guess to an i32.
- Compute the absolute difference (guess - target).abs().
- Use match on guess.cmp(&target): print "X below target" for Less, "X above target" for Greater, and "exactly on target" for Equal, where X is the absolute difference.

Example: input "70" prints:
30 below target`,
    hints: [
      'i32 has an .abs() method for absolute value.',
      'Compute the difference once, then branch on Ordering for wording.'
    ],
    solution: `use std::cmp::Ordering;
use std::io;

fn main() {
    let target: i32 = 100;
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Failed to read line");
    let guess: i32 = input.trim().parse().expect("Please type a number!");
    let diff = (guess - target).abs();
    match guess.cmp(&target) {
        Ordering::Less => println!("{} below target", diff),
        Ordering::Greater => println!("{} above target", diff),
        Ordering::Equal => println!("exactly on target"),
    }
}`,
    starter: `use std::cmp::Ordering;
use std::io;

fn main() {
    let target: i32 = 100;
    let mut input = String::new();
    // TODO: read, parse, compute abs difference, match cmp for wording
}`,
    tags: ['ordering', 'arithmetic', 'match']
  },
  {
    id: 'rs-ch02-c-056',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Limited-Attempts Guessing Game',
    prompt: `The secret is 30 and the player gets at most 3 attempts. Read guesses in a loop. If they run out of attempts without guessing, print "Out of attempts! The number was 30.".

Requirements:
- Use std::cmp::Ordering and a loop with a mutable attempts-remaining counter starting at 3.
- On each guess decrement the counter; print "Too small!" / "Too big!" for the wrong arms.
- On Equal print "You got it!" and break.
- If the counter reaches 0 before a correct guess, print the out-of-attempts message and break.

Example: inputs "10", "20", "25" produce:
Too small!
Too small!
Too small!
Out of attempts! The number was 30.`,
    hints: [
      'Check whether attempts remain before reading each guess, or right after decrementing.',
      'Two break points: a correct guess, and running out of attempts.'
    ],
    solution: `use std::cmp::Ordering;
use std::io;

fn main() {
    let secret: u32 = 30;
    let mut remaining = 3;
    loop {
        if remaining == 0 {
            println!("Out of attempts! The number was {}.", secret);
            break;
        }
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let guess: u32 = input.trim().parse().expect("Please type a number!");
        remaining -= 1;
        match guess.cmp(&secret) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("You got it!");
                break;
            }
        }
    }
}`,
    starter: `use std::cmp::Ordering;
use std::io;

fn main() {
    let secret: u32 = 30;
    let mut remaining = 3;
    loop {
        // TODO: stop when out of attempts; otherwise read, parse, match cmp
    }
}`,
    tags: ['loop', 'ordering', 'counter']
  },
  {
    id: 'rs-ch02-c-057',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Skip Invalid, Process Valid',
    prompt: `Read exactly 4 lines. For each line, if it parses as an i32 print "Number: N", otherwise print "Skipping invalid input". Use a match on parse with continue for the invalid case.

Requirements:
- Loop exactly 4 times.
- match input.trim().parse::<i32>() with Ok and Err arms.
- On Err, print the skip message and continue.
- On Ok, print the number.

Example: inputs "5", "hi", "12", "??" produce:
Number: 5
Skipping invalid input
Number: 12
Skipping invalid input`,
    hints: [
      'Use a counter to read exactly 4 lines even when some are invalid.',
      'continue still counts as one of the four reads.'
    ],
    solution: `use std::io;

fn main() {
    let mut count = 0;
    loop {
        if count == 4 {
            break;
        }
        count += 1;
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let n: i32 = match input.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("Skipping invalid input");
                continue;
            }
        };
        println!("Number: {}", n);
    }
}`,
    starter: `use std::io;

fn main() {
    let mut count = 0;
    // TODO: read 4 lines; match parse; skip invalid with continue, print valid
}`,
    tags: ['loop', 'match', 'continue']
  },
  {
    id: 'rs-ch02-c-058',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Yes or No Prompt',
    prompt: `Ask a yes/no question. Keep looping until the user types "yes" or "no" (after trimming). Print "Confirmed" for yes and "Cancelled" for no, then break. For anything else print "Please answer yes or no." and continue.

Requirements:
- Loop reading a line.
- Match the trimmed string against "yes", "no", and a catch-all.
- Use a match with string literal patterns.

Example: inputs "maybe", "yes" produce:
Please answer yes or no.
Confirmed`,
    hints: [
      'You can match a &str: match input.trim() { "yes" => ..., "no" => ..., _ => ... }',
      'Only the yes and no arms should break.'
    ],
    solution: `use std::io;

fn main() {
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        match input.trim() {
            "yes" => {
                println!("Confirmed");
                break;
            }
            "no" => {
                println!("Cancelled");
                break;
            }
            _ => println!("Please answer yes or no."),
        }
    }
}`,
    starter: `use std::io;

fn main() {
    loop {
        let mut input = String::new();
        // TODO: read, match trimmed against "yes"/"no"/_; break on yes/no
    }
}`,
    tags: ['loop', 'match', 'string']
  },
  {
    id: 'rs-ch02-c-059',
    chapter: 2,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Running Product Until One',
    prompt: `Read integers one per line and multiply them together. Stop when the user enters 1 (the sentinel is NOT multiplied in), then print the product. Start the product at 1.

Requirements:
- Loop reading and parsing each line to an i64.
- Break when the value is 1.
- Print "Product: N".

Example: inputs "2", "3", "4", "1" produce:
Product: 24`,
    hints: [
      'Initialize a mutable product to 1 before the loop.',
      'Use i64 so larger products do not overflow as easily.'
    ],
    solution: `use std::io;

fn main() {
    let mut product: i64 = 1;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let n: i64 = input.trim().parse().expect("Please type a number!");
        if n == 1 {
            break;
        }
        product *= n;
    }
    println!("Product: {}", product);
}`,
    starter: `use std::io;

fn main() {
    let mut product: i64 = 1;
    // TODO: loop multiplying numbers, break on sentinel 1, print the product
}`,
    tags: ['loop', 'arithmetic', 'break']
  },
  {
    id: 'rs-ch02-c-060',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Full Guessing Game With Validation',
    prompt: `Build a complete guessing game. The secret is fixed at 57. In a loop:
1. Read a line.
2. If parsing to a u32 fails, print "Not a number, try again." and continue.
3. If the number is not in 1..=100, print "Out of range, try again." and continue.
4. Otherwise compare with std::cmp::Ordering: "Too small!", "Too big!", or "You win!" then break.

Requirements:
- Combine retry-on-bad-parse, range validation, and Ordering matching in one loop.

Example: inputs "abc", "0", "30", "80", "57" produce:
Not a number, try again.
Out of range, try again.
Too small!
Too big!
You win!`,
    hints: [
      'Use match on parse to skip invalid input with continue.',
      'After a successful parse, do the range check before the cmp match.',
      'Only the Equal arm breaks.'
    ],
    solution: `use std::cmp::Ordering;
use std::io;

fn main() {
    let secret: u32 = 57;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let guess: u32 = match input.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("Not a number, try again.");
                continue;
            }
        };
        if guess < 1 || guess > 100 {
            println!("Out of range, try again.");
            continue;
        }
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
    starter: `use std::cmp::Ordering;
use std::io;

fn main() {
    let secret: u32 = 57;
    loop {
        let mut input = String::new();
        // TODO: read; match parse (continue on Err); range-check; match cmp
    }
}`,
    tags: ['loop', 'ordering', 'match', 'validation']
  },
  {
    id: 'rs-ch02-c-061',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Narrowing Search Bounds',
    prompt: `The secret is 73. Maintain a known range [low, high] starting at 1 and 100. After each guess, print the current allowed range, then read the guess. Update low or high based on the comparison so the printed range narrows. Stop on a correct guess with "Found it!".

Requirements:
- Before each read, print "Guess between LOW and HIGH:".
- Parse the guess to a u32.
- On Ordering::Less, set low = guess + 1; on Greater, set high = guess - 1; on Equal, print "Found it!" and break.

Example with secret 73, inputs "50", "75", "73":
Guess between 1 and 100:
Guess between 51 and 100:
Guess between 51 and 74:
Found it!`,
    hints: [
      'Keep two mutable variables low and high, updated by the Ordering arms.',
      'Print the range prompt at the top of the loop, before reading.'
    ],
    solution: `use std::cmp::Ordering;
use std::io;

fn main() {
    let secret: u32 = 73;
    let mut low: u32 = 1;
    let mut high: u32 = 100;
    loop {
        println!("Guess between {} and {}:", low, high);
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let guess: u32 = input.trim().parse().expect("Please type a number!");
        match guess.cmp(&secret) {
            Ordering::Less => low = guess + 1,
            Ordering::Greater => high = guess - 1,
            Ordering::Equal => {
                println!("Found it!");
                break;
            }
        }
    }
}`,
    starter: `use std::cmp::Ordering;
use std::io;

fn main() {
    let secret: u32 = 73;
    let mut low: u32 = 1;
    let mut high: u32 = 100;
    loop {
        // TODO: print range, read guess, update low/high via cmp, break on Equal
    }
}`,
    tags: ['loop', 'ordering', 'bounds']
  },
  {
    id: 'rs-ch02-c-062',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Best (Closest) Guess Tracker',
    prompt: `The secret is 40. Let the user enter exactly 5 guesses. Track which guess was CLOSEST to the secret (smallest absolute difference). After 5 guesses, print "Closest guess: G (off by D)".

Requirements:
- Loop exactly 5 times, parsing each guess to an i32.
- For each guess compute the absolute difference from the secret.
- Keep the guess with the smallest difference so far (assume the first guess is the initial best).
- Print the closest guess and its difference.

Example: guesses "10", "55", "44", "70", "5" with secret 40 produce:
Closest guess: 44 (off by 4)`,
    hints: [
      'Initialize best on the first iteration, then compare on later iterations.',
      'Use a mutable counter to run exactly 5 times.',
      'Store both the best guess and its difference in mutable variables.'
    ],
    solution: `use std::io;

fn main() {
    let secret: i32 = 40;
    let mut count = 0;
    let mut best_guess: i32 = 0;
    let mut best_diff: i32 = i32::MAX;
    loop {
        if count == 5 {
            break;
        }
        count += 1;
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let guess: i32 = input.trim().parse().expect("Please type a number!");
        let diff = (guess - secret).abs();
        if diff < best_diff {
            best_diff = diff;
            best_guess = guess;
        }
    }
    println!("Closest guess: {} (off by {})", best_guess, best_diff);
}`,
    starter: `use std::io;

fn main() {
    let secret: i32 = 40;
    let mut count = 0;
    // TODO: read 5 guesses, track the one with smallest abs difference
}`,
    tags: ['loop', 'arithmetic', 'tracking']
  },
  {
    id: 'rs-ch02-c-063',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Two-Player Guess Off',
    prompt: `The secret is 25. Two players alternate guesses: Player 1 goes on odd attempts, Player 2 on even attempts. Read guesses in a loop; whoever guesses 25 first wins. Print "Player X wins on attempt N!" and break. For wrong guesses print "Too small!" or "Too big!".

Requirements:
- Use a mutable attempt counter starting at 0; increment before each read.
- Player is 1 when attempt is odd, else 2 (use the remainder operator).
- Use std::cmp::Ordering for the comparison.

Example: inputs "10" (P1), "30" (P2), "25" (P1) produce:
Too small!
Too big!
Player 1 wins on attempt 3!`,
    hints: [
      'attempt % 2 == 1 means Player 1, else Player 2.',
      'Increment the attempt counter at the top of each loop iteration.',
      'Compute the player number once after incrementing.'
    ],
    solution: `use std::cmp::Ordering;
use std::io;

fn main() {
    let secret: u32 = 25;
    let mut attempt = 0;
    loop {
        attempt += 1;
        let player = if attempt % 2 == 1 { 1 } else { 2 };
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let guess: u32 = input.trim().parse().expect("Please type a number!");
        match guess.cmp(&secret) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("Player {} wins on attempt {}!", player, attempt);
                break;
            }
        }
    }
}`,
    starter: `use std::cmp::Ordering;
use std::io;

fn main() {
    let secret: u32 = 25;
    let mut attempt = 0;
    loop {
        // TODO: increment attempt, pick player by parity, read, compare, break on win
    }
}`,
    tags: ['loop', 'ordering', 'modulo']
  },
  {
    id: 'rs-ch02-c-064',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Sum With Error Recovery',
    prompt: `Read lines until the user types "end". Sum the integers entered. If a line is neither a valid integer nor "end", print "Ignored: <line>" (the trimmed line) and do NOT add it to the sum. Print "Total: N" at the end.

Requirements:
- Loop reading lines.
- If the trimmed line equals "end", break.
- Otherwise match parse to i32: add on Ok, print the ignored message on Err.

Example: inputs "10", "oops", "5", "end" produce:
Ignored: oops
Total: 15`,
    hints: [
      'Bind the trimmed line to a variable so you can both compare and print it.',
      'Use match on .parse() with Ok adding to the sum and Err printing the ignored message.'
    ],
    solution: `use std::io;

fn main() {
    let mut total: i32 = 0;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let line = input.trim();
        if line == "end" {
            break;
        }
        match line.parse::<i32>() {
            Ok(n) => total += n,
            Err(_) => println!("Ignored: {}", line),
        }
    }
    println!("Total: {}", total);
}`,
    starter: `use std::io;

fn main() {
    let mut total: i32 = 0;
    // TODO: loop reading lines; break on "end"; add valid ints, report ignored ones
}`,
    tags: ['loop', 'match', 'error-handling']
  },
  {
    id: 'rs-ch02-c-065',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Hot or Cold Feedback',
    prompt: `The secret is 50. In a loop, read a guess and give "hot/cold" feedback based on how close it is, in addition to direction. Stop on an exact match with "You found it!".

Rules per guess (parse to i32):
- If the absolute difference is 0, print "You found it!" and break.
- Else if the difference is at most 5, print "Hot!".
- Else if the difference is at most 15, print "Warm.".
- Else print "Cold.".

Example: inputs "20", "48", "50" produce:
Cold.
Hot!
You found it!`,
    hints: [
      'Compute the absolute difference first.',
      'Use an if / else if chain on the difference, with the 0 case breaking.'
    ],
    solution: `use std::io;

fn main() {
    let secret: i32 = 50;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let guess: i32 = input.trim().parse().expect("Please type a number!");
        let diff = (guess - secret).abs();
        if diff == 0 {
            println!("You found it!");
            break;
        } else if diff <= 5 {
            println!("Hot!");
        } else if diff <= 15 {
            println!("Warm.");
        } else {
            println!("Cold.");
        }
    }
}`,
    starter: `use std::io;

fn main() {
    let secret: i32 = 50;
    loop {
        let mut input = String::new();
        // TODO: read, parse, compute abs diff, give hot/warm/cold feedback
    }
}`,
    tags: ['loop', 'arithmetic', 'branching']
  },
  {
    id: 'rs-ch02-c-066',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Validated Average With Skips',
    prompt: `Read exactly 6 lines. Sum only the lines that parse as valid f64 numbers, and count how many were valid. Skip invalid lines (print "skip"). After 6 lines, print the average of the valid numbers with two decimals, or "No valid numbers" if none were valid.

Requirements:
- Loop exactly 6 times.
- match parse::<f64>() with Ok (add to sum, increment valid count) and Err (print "skip", continue).
- Guard the division: if the valid count is 0, print the no-valid message.

Example: inputs "2.5", "x", "7.5", "y", "z", "10.0" produce:
skip
skip
skip
Average: 6.67`,
    hints: [
      'Keep a sum (f64) and a count (i32) of valid entries.',
      'Use continue on the Err arm after printing skip.',
      'After the loop, check whether count > 0 before dividing.'
    ],
    solution: `use std::io;

fn main() {
    let mut sum: f64 = 0.0;
    let mut valid = 0;
    let mut read = 0;
    loop {
        if read == 6 {
            break;
        }
        read += 1;
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let n: f64 = match input.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("skip");
                continue;
            }
        };
        sum += n;
        valid += 1;
    }
    if valid == 0 {
        println!("No valid numbers");
    } else {
        println!("Average: {:.2}", sum / valid as f64);
    }
}`,
    starter: `use std::io;

fn main() {
    let mut sum: f64 = 0.0;
    let mut valid = 0;
    let mut read = 0;
    // TODO: read 6 lines, skip invalid, average the valid f64 values
}`,
    tags: ['loop', 'match', 'f64', 'continue']
  },
  {
    id: 'rs-ch02-c-067',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Strict Range Retry Game',
    prompt: `The secret is 88. The game only accepts guesses in 1..=100. In a loop:
1. Read a line and parse to u32; if it fails, print "Enter a whole number." and continue.
2. If out of 1..=100, print "Must be 1 to 100." and continue.
3. Compare with std::cmp::Ordering and print "Lower!" for too-big guesses, "Higher!" for too-small guesses (note the inverted hint wording), and "Spot on!" then break on Equal.

Requirements:
- Note: "Higher!" means the secret is higher than the guess (guess was too small); "Lower!" means the secret is lower (guess was too big).

Example: inputs "abc", "200", "50", "90", "88" produce:
Enter a whole number.
Must be 1 to 100.
Higher!
Lower!
Spot on!`,
    hints: [
      'Less means guess < secret, so the secret is Higher.',
      'Greater means guess > secret, so the secret is Lower.',
      'Use match parse for the retry and a separate range check.'
    ],
    solution: `use std::cmp::Ordering;
use std::io;

fn main() {
    let secret: u32 = 88;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let guess: u32 = match input.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("Enter a whole number.");
                continue;
            }
        };
        if guess < 1 || guess > 100 {
            println!("Must be 1 to 100.");
            continue;
        }
        match guess.cmp(&secret) {
            Ordering::Less => println!("Higher!"),
            Ordering::Greater => println!("Lower!"),
            Ordering::Equal => {
                println!("Spot on!");
                break;
            }
        }
    }
}`,
    starter: `use std::cmp::Ordering;
use std::io;

fn main() {
    let secret: u32 = 88;
    loop {
        let mut input = String::new();
        // TODO: parse with retry, range-check, then match cmp with inverted hints
    }
}`,
    tags: ['loop', 'ordering', 'validation']
  },
  {
    id: 'rs-ch02-c-068',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Streak Counter of Increasing Guesses',
    prompt: `Read integers one per line until the user enters "stop". Track the longest streak of consecutive STRICTLY increasing values. Print the longest streak length at the end.

Requirements:
- A single value counts as a streak of length 1.
- Each time a new value is strictly greater than the previous one, the current streak grows; otherwise it resets to 1.
- Keep both a current streak and a best streak in mutable variables.
- Print "Longest streak: N". Assume at least one number before "stop".

Example: inputs "1", "2", "3", "1", "5", "stop" produce:
Longest streak: 3`,
    hints: [
      'Remember the previous value and whether you have seen any value yet.',
      'On each new number, compare with the previous to grow or reset the current streak.',
      'Update best = max-like with an if whenever current grows.'
    ],
    solution: `use std::io;

fn main() {
    let mut prev: i32 = 0;
    let mut have_prev = false;
    let mut current = 0;
    let mut best = 0;
    loop {
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let line = input.trim();
        if line == "stop" {
            break;
        }
        let n: i32 = line.parse().expect("Please type a number!");
        if have_prev && n > prev {
            current += 1;
        } else {
            current = 1;
        }
        if current > best {
            best = current;
        }
        prev = n;
        have_prev = true;
    }
    println!("Longest streak: {}", best);
}`,
    starter: `use std::io;

fn main() {
    let mut prev: i32 = 0;
    let mut have_prev = false;
    let mut current = 0;
    let mut best = 0;
    // TODO: read numbers until "stop"; track longest strictly-increasing streak
}`,
    tags: ['loop', 'tracking', 'comparison']
  },
  {
    id: 'rs-ch02-c-069',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Bounded Guessing Game With Feedback History',
    prompt: `The secret is 60 and the player has at most 4 attempts. Each attempt:
1. Print "Attempt K of 4:" where K is the attempt number (1-based).
2. Read and parse a guess to a u32 with .expect("Please type a number!").
3. Compare via std::cmp::Ordering: "Too low" / "Too high" / "Correct!".
On a correct guess print "Correct!" and break. If all 4 attempts are used without success, print "Game over. Secret was 60.".

Requirements:
- Use a mutable attempt counter and a loop with break.
- Print the attempt header before reading each guess.

Example: inputs "10", "90", "55", "60" produce:
Attempt 1 of 4:
Too low
Attempt 2 of 4:
Too high
Attempt 3 of 4:
Too low
Attempt 4 of 4:
Correct!`,
    hints: [
      'Increment the attempt counter at the start of each iteration and print the header.',
      'Break when the counter exceeds 4 after a wrong guess, printing game over.',
      'Only Ordering::Equal prints Correct! and breaks early.'
    ],
    solution: `use std::cmp::Ordering;
use std::io;

fn main() {
    let secret: u32 = 60;
    let mut attempt = 0;
    loop {
        attempt += 1;
        if attempt > 4 {
            println!("Game over. Secret was {}.", secret);
            break;
        }
        println!("Attempt {} of 4:", attempt);
        let mut input = String::new();
        io::stdin()
            .read_line(&mut input)
            .expect("Failed to read line");
        let guess: u32 = input.trim().parse().expect("Please type a number!");
        match guess.cmp(&secret) {
            Ordering::Less => println!("Too low"),
            Ordering::Greater => println!("Too high"),
            Ordering::Equal => {
                println!("Correct!");
                break;
            }
        }
    }
}`,
    starter: `use std::cmp::Ordering;
use std::io;

fn main() {
    let secret: u32 = 60;
    let mut attempt = 0;
    loop {
        // TODO: increment attempt, stop after 4, print header, read, compare
    }
}`,
    tags: ['loop', 'ordering', 'counter']
  },
  {
    id: 'rs-ch02-c-070',
    chapter: 2,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Simple Calculator Loop',
    prompt: `Build a loop that reads three lines per round: a first number, an operator ("+", "-", "*", or "/"), and a second number. Print the result of applying the operator. The loop ends when the FIRST number line is "quit".

Requirements:
- Loop. Read the first line; if its trimmed value is "quit", break.
- Otherwise parse it to an f64, read the operator line (trim it), read the second number line and parse to f64.
- Use match on the trimmed operator string with arms "+", "-", "*", "/" to compute the result; for any other operator print "Unknown operator" and continue.
- Print "Result: X" (use default f64 formatting). Use .expect("Please type a number!") on the parses.

Example round inputs "6", "*", "7" produce:
Result: 42
Then input "quit" ends the program.`,
    hints: [
      'Compare the first line to "quit" before parsing it as a number.',
      'match operator { "+" => a + b, ... , _ => { println!("Unknown operator"); continue; } }',
      'Bind the match result to a variable, then print it.'
    ],
    solution: `use std::io;

fn read_line() -> String {
    let mut s = String::new();
    io::stdin()
        .read_line(&mut s)
        .expect("Failed to read line");
    s
}

fn main() {
    loop {
        let first = read_line();
        let first = first.trim();
        if first == "quit" {
            break;
        }
        let a: f64 = first.parse().expect("Please type a number!");

        let op = read_line();
        let op = op.trim().to_string();

        let second = read_line();
        let b: f64 = second.trim().parse().expect("Please type a number!");

        let result = match op.as_str() {
            "+" => a + b,
            "-" => a - b,
            "*" => a * b,
            "/" => a / b,
            _ => {
                println!("Unknown operator");
                continue;
            }
        };
        println!("Result: {}", result);
    }
}`,
    starter: `use std::io;

fn main() {
    loop {
        // TODO: read first number (or "quit" to break), operator, second number
        // then match the operator to compute and print the result
    }
}`,
    tags: ['loop', 'match', 'parse', 'f64']
  }
]

export default problems
