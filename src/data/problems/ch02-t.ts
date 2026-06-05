import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch02-t-001',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Why a Mutable String for Input',
    prompt: `In the guessing game we write:

let mut guess = String::new();

Then we pass &mut guess to io::stdin().read_line(...). Two questions: (a) why is the variable declared with mut, and (b) what kind of value does String::new() create?

Answer in your own words.`,
    hints: [
      'read_line APPENDS the typed text onto whatever String you give it.',
      'A value you never change does not need mut.',
    ],
    solution: `String::new() creates a brand-new, empty, growable String that owns no text yet. We declare it with mut because read_line does not return the input as a fresh value; instead it APPENDS the user's typed characters onto the String we hand it, which mutates that String in place. Modifying a binding requires the binding to be mutable, so without mut the compiler would reject the call. In short: mut is needed because the String's contents change, and String::new() gives us an empty buffer to fill.`,
    tags: ['string', 'mutability', 'io'],
  },
  {
    id: 'rs-ch02-t-002',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'What read_line Returns',
    prompt: `Consider this line:

io::stdin().read_line(&mut guess).expect("Failed to read line");

What type of value does read_line(...) return, and what is .expect(...) doing to it? What happens at runtime if reading the line fails?`,
    hints: [
      'read_line reports success-or-error, not the text itself.',
      'expect handles one of the two possible outcomes by crashing.',
    ],
    solution: `read_line returns a Result value (specifically io::Result), which is an enum that is either Ok (holding the number of bytes read) or Err (holding an error). It does NOT return the text itself, because the text was appended into guess. Calling .expect("...") on the Result unwraps it: if it is Ok, expect yields the contained value and the program continues; if it is Err, expect panics and crashes the program, printing your message alongside the error. So at runtime a failure to read causes an immediate panic with that message.`,
    tags: ['result', 'expect', 'io'],
  },
  {
    id: 'rs-ch02-t-003',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'The Ampersand in read_line',
    prompt: `We call read_line(&mut guess) rather than read_line(guess). What does the & mean here, and why do we also need mut in front of guess inside the call?`,
    hints: [
      'The & lets a function use a value without taking ownership of it.',
      'read_line needs to change the String it borrows.',
    ],
    solution: `The & means we pass a REFERENCE to guess instead of moving the String itself into read_line. A reference lets the function access and use guess without taking ownership, so guess is still usable afterward. We write &mut (not just &) because read_line needs to MODIFY the String by appending the input, and a plain shared reference would be read-only. So &mut guess is a mutable reference: it lends read_line temporary write-access to our String.`,
    tags: ['references', 'borrowing', 'mutability'],
  },
  {
    id: 'rs-ch02-t-004',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Comparing With match and Ordering',
    prompt: `After parsing the guess into a number, the game does:

match guess.cmp(&secret_number) {
    Ordering::Less => println!("Too small!"),
    Ordering::Greater => println!("Too big!"),
    Ordering::Equal => println!("You win!"),
}

How many possible values can cmp produce, and what does each Ordering variant mean here?`,
    hints: [
      'cmp answers "how does the left value compare to the right value?".',
      'There are exactly three outcomes.',
    ],
    solution: `cmp returns one of exactly three Ordering values: Less, Greater, or Equal. It compares the left value (guess) against the right value (secret_number). Ordering::Less means guess is smaller than the secret, so we print "Too small!". Ordering::Greater means guess is larger, so we print "Too big!". Ordering::Equal means they are the same, so the player has won. Because the three arms cover every possible Ordering, the match is exhaustive and the compiler is satisfied.`,
    tags: ['match', 'ordering', 'comparison'],
  },
  {
    id: 'rs-ch02-t-005',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Predict the Trim Output',
    prompt: `Suppose the user types the four characters 4 2 then presses Enter, so guess holds the text "42" followed by a newline. We then run:

let trimmed = guess.trim();

What is the value of trimmed, and why was trim() necessary before parsing this to a number?`,
    hints: [
      'Pressing Enter adds a newline character to the String.',
      'parse would choke on stray whitespace.',
    ],
    solution: `After read_line, guess contains "42\\n" because pressing Enter appends a newline character. guess.trim() removes leading and trailing whitespace (including that newline), so trimmed is exactly "42". This matters because parse() expects the text to contain ONLY the digits of the number; if we tried to parse "42\\n" directly it would fail with an error since the newline is not a valid part of a number. Trimming first gives parse a clean "42" to convert.`,
    tags: ['trim', 'parse', 'input'],
  },
  {
    id: 'rs-ch02-t-006',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Shadowing a String Into a Number',
    prompt: `This is a common pattern from the chapter:

let guess = "57".to_string();
let guess: u32 = guess.trim().parse().expect("not a number");

The name guess is used twice with let. Explain what shadowing is doing here, and what the type of guess is on each line.`,
    hints: [
      'Both lines use let, so both create new bindings.',
      'Shadowing lets you reuse a name with a different type.',
    ],
    solution: `On the first line, guess is a String. On the second line, the keyword let introduces a NEW variable that also happens to be named guess, which shadows the old one. This new guess has type u32, holding the parsed number 57. Shadowing lets us reuse the convenient name guess while changing its type from String to u32, instead of inventing a second name like guess_num. After the second let, any reference to guess refers to the u32; the original String is no longer reachable.`,
    tags: ['shadowing', 'parse', 'types'],
  },
  {
    id: 'rs-ch02-t-007',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why parse Needs a Type Annotation',
    prompt: `This line compiles:

let n: u32 = "100".trim().parse().expect("bad");

But removing the annotation, as in

let n = "100".trim().parse().expect("bad");

fails to compile. Why does parse require knowing the target type, and where else besides the annotation could that type come from?`,
    hints: [
      'parse can produce many different numeric types from the same text.',
      'The compiler must know WHICH type you want.',
    ],
    solution: `parse() is generic: the same text "100" could be parsed into a u32, an i64, an f64, and so on, so the compiler cannot guess which one you mean. The type annotation n: u32 tells parse to produce a u32. Without any annotation the compiler has no way to choose the target type and reports that it cannot infer it. The type does not have to come from the let annotation specifically; it can also be inferred from later use, for example if n is later compared with a u32 secret_number via cmp, the compiler will deduce that n must be u32.`,
    tags: ['parse', 'type-inference', 'annotation'],
  },
  {
    id: 'rs-ch02-t-008',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Predict the loop and break',
    prompt: `Reason about this loop:

let mut count = 0;
loop {
    count += 1;
    if count == 3 {
        break;
    }
    println!("count is {count}");
}
println!("done at {count}");

What lines are printed, in order, and what is the final value of count?`,
    hints: [
      'break exits before the println on the iteration it fires.',
      'Trace the value of count each pass.',
    ],
    solution: `Pass 1: count becomes 1, not equal to 3, so it prints "count is 1". Pass 2: count becomes 2, not equal to 3, so it prints "count is 2". Pass 3: count becomes 3, the if condition is true, so break runs immediately and the loop ends BEFORE reaching the println for count is 3. After the loop, count is 3, so it prints "done at 3". Final output is the three lines: "count is 1", "count is 2", "done at 3", and count holds 3.`,
    tags: ['loop', 'break', 'predict-output'],
  },
  {
    id: 'rs-ch02-t-009',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'expect Versus a Plain unwrap Message',
    prompt: `When parsing user input, some code uses .expect("Please type a number!") and some uses .unwrap(). For a learning-game prompt that may receive bad input, which gives a more helpful crash, and what do they have in common?`,
    hints: [
      'Both turn a Result into the inner value or a panic.',
      'One lets you attach context to the panic.',
    ],
    solution: `Both unwrap and expect take a Result, return the Ok value if present, and panic if the value is Err. The difference is the message: unwrap panics with a generic message describing the error, while expect lets you supply your own message that is printed alongside the error. For a learning game, expect("Please type a number!") is more helpful because the crash output points the reader at the actual cause and what they should have done. They share the same behavior on Ok and the same crashing behavior on Err; only the diagnostic text differs.`,
    tags: ['expect', 'unwrap', 'result'],
  },
  {
    id: 'rs-ch02-t-010',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Reading Input Into the Wrong Place',
    prompt: `A student writes:

let mut guess = String::new();
let mut other = String::new();
io::stdin().read_line(&mut other).expect("read failed");
let n: u32 = guess.trim().parse().expect("not a number");

They type 50 and press Enter, but the program panics on the parse line. Explain why.`,
    hints: [
      'read_line fills the String you pass to it, not any other String.',
      'What is in guess when parse runs?',
    ],
    solution: `read_line appends the typed text onto whichever String it receives, and here it received &mut other, so other becomes "50\\n". The String guess was never touched and is still empty. When we call guess.trim().parse(), we are parsing an empty string "" into a u32, which is not a valid number, so parse returns Err and expect panics with "not a number". The fix is to read into the String we intend to parse, i.e. read_line(&mut guess), or to parse other instead. The bug is reading into one variable but parsing another.`,
    tags: ['io', 'read_line', 'debugging'],
  },
  {
    id: 'rs-ch02-t-011',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Continue Versus Break in a Retry Loop',
    prompt: `In a guessing game's input loop you can react to bad input with either continue or break. Describe the difference in behavior, and which one keeps the game playable when the user fat-fingers a non-number.`,
    hints: [
      'continue jumps back to the top of the same loop.',
      'break leaves the loop entirely.',
    ],
    solution: `continue immediately skips the rest of the current iteration and starts the next one, so the loop keeps running and the user is prompted again. break exits the loop completely, so no further iterations happen. For handling a non-number, continue is the right choice: it discards the bad input and lets the player try again, keeping the game playable. break would end the input loop (and likely the game) on the first mistake, which is usually not what you want for a typo.`,
    tags: ['loop', 'continue', 'break'],
  },
  {
    id: 'rs-ch02-t-012',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Predict Output of Range Checks',
    prompt: `secret_number is 7. The user guesses these values in order: 10, then 3, then 7. The code compares with cmp and prints "Too big!", "Too small!", or "You win!" accordingly. List exactly what is printed for each guess, in order.`,
    hints: [
      'cmp compares guess against secret_number.',
      'Greater than 7 prints Too big.',
    ],
    solution: `For guess 10: 10 is greater than 7, so cmp gives Ordering::Greater and it prints "Too big!". For guess 3: 3 is less than 7, so cmp gives Ordering::Less and it prints "Too small!". For guess 7: 7 equals 7, so cmp gives Ordering::Equal and it prints "You win!". The output in order is: "Too big!", then "Too small!", then "You win!".`,
    tags: ['ordering', 'comparison', 'predict-output'],
  },
  {
    id: 'rs-ch02-t-013',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Where to Place break for a Win',
    prompt: `A guessing game uses an infinite loop. You want the game to keep prompting until the player guesses correctly, then stop. Inside the match on the Ordering, which arm should contain the break, and why must the other arms NOT break?`,
    hints: [
      'Only one Ordering means the player is correct.',
      'The other two mean keep playing.',
    ],
    solution: `The break belongs in the Ordering::Equal arm, because Equal is the only outcome that means the guess matched the secret, which is when the game should end. The Ordering::Less and Ordering::Greater arms must NOT break: they signal "too small" or "too big", and the player still needs more attempts, so the loop should continue and prompt again. If you put break in those arms, the game would quit after a single wrong guess. Placing break only in the Equal arm makes the loop end exactly when the player wins.`,
    tags: ['loop', 'break', 'match'],
  },
  {
    id: 'rs-ch02-t-014',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'parse Result With match Instead of expect',
    prompt: `Instead of expect, the chapter shows a graceful version:

let guess: u32 = match guess.trim().parse() {
    Ok(num) => num,
    Err(_) => continue,
};

Explain how this differs from .expect("not a number") in behavior, and what the underscore in Err(_) means.`,
    hints: [
      'expect panics on Err; this match does something else.',
      'The underscore is a pattern that ignores a value.',
    ],
    solution: `With .expect(...), an Err from parse panics and crashes the whole program. With this match, an Err instead runs continue, which skips to the next loop iteration and asks the user to type again, so a bad entry is recovered from gracefully rather than crashing. On Ok(num) the match yields the parsed number and binds it to guess. The underscore in Err(_) is a catch-all pattern that matches the error value while ignoring it, since we do not need to inspect what the error was. This is the difference between a fragile program and a forgiving one.`,
    tags: ['match', 'parse', 'error-handling'],
  },
  {
    id: 'rs-ch02-t-015',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Does This Match Compile',
    prompt: `Will this compile? If not, explain the error.

use std::cmp::Ordering;

match 5.cmp(&8) {
    Ordering::Less => println!("less"),
    Ordering::Greater => println!("greater"),
}

If it does compile, what does it print?`,
    hints: [
      'cmp can return three variants.',
      'match must handle every possible value.',
    ],
    solution: `It does NOT compile. cmp can return three Ordering variants (Less, Greater, Equal), but this match only handles Less and Greater. Rust requires match to be exhaustive, so the compiler reports a non-exhaustive patterns error: the Ordering::Equal case is not covered. Even though 5 is in fact less than 8 (so Equal could never happen here at runtime), the compiler reasons about types, not specific values, and still demands the Equal arm. To fix it you add an Ordering::Equal arm or a catch-all arm with _.`,
    tags: ['match', 'ordering', 'exhaustiveness'],
  },
  {
    id: 'rs-ch02-t-016',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Comparing String to Number Without Parsing',
    prompt: `Suppose you skip parsing and try to compare the raw input String directly to a u32 secret:

let guess = String::from("50");
let secret: u32 = 50;
match guess.cmp(&secret) { /* ... */ }

Why does the compiler reject guess.cmp(&secret), and what step is missing?`,
    hints: [
      'cmp compares two values of the SAME type.',
      'guess is text, secret is a number.',
    ],
    solution: `cmp compares two values of the same type, but here guess is a String and secret is a u32, so guess.cmp(&secret) is a type mismatch: you cannot directly compare text with a number. The compiler reports that the expected argument type (a &String) does not match the supplied &u32, or that the types are not comparable. The missing step is conversion: you must trim and parse the String into a u32 first, e.g. let guess: u32 = guess.trim().parse().expect("..."), and only then can cmp compare two u32 values. Comparison requires both sides to be the same numeric type.`,
    tags: ['cmp', 'types', 'parse'],
  },
  {
    id: 'rs-ch02-t-017',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Resetting the Buffer Each Iteration',
    prompt: `A guessing game declares the input String ONCE before the loop:

let mut guess = String::new();
loop {
    io::stdin().read_line(&mut guess).expect("read failed");
    // parse and compare ...
}

read_line APPENDS to guess. What problem can this cause across iterations, and how does the chapter's structure avoid it?`,
    hints: [
      'Appending means old text stays in the String.',
      'Where is guess usually declared in the book?',
    ],
    solution: `Because read_line appends rather than replaces, the String accumulates across iterations: after typing 5 then 8, guess becomes "5\\n8\\n" instead of just "8\\n". Parsing that combined, multi-line text fails, so the game breaks after the first guess. The chapter avoids this by declaring let mut guess = String::new() INSIDE the loop, so each iteration starts with a fresh empty String holding only the current input. Re-creating the buffer every pass (or otherwise clearing it) is what keeps each guess clean.`,
    tags: ['loop', 'read_line', 'buffer'],
  },
  {
    id: 'rs-ch02-t-018',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Why secret_number Is Not mut',
    prompt: `The secret number is generated once and never changes during play:

let secret_number = rand::thread_rng().gen_range(1..=100);

The player's guess, however, is read fresh each round. Explain why secret_number does NOT need mut while the guess String does, in terms of what changes over the game's lifetime.`,
    hints: [
      'mut is about whether a binding is reassigned or mutated.',
      'The secret is fixed for the whole game.',
    ],
    solution: `mut is required only when a binding's value is reassigned or mutated after it is created. secret_number is computed once and read many times but never modified, so it stays immutable and needs no mut; this also documents the intent that the answer is fixed for the whole game. The guess String, by contrast, is filled by read_line, which mutates it by appending input, so its binding must be mut (or it is re-created each loop). The rule of thumb: immutable by default, and add mut only where the value actually has to change.`,
    tags: ['mutability', 'design', 'bindings'],
  },
  {
    id: 'rs-ch02-t-019',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Compare Two Retry Designs',
    prompt: `Two ways to keep asking until valid input arrives:

Approach A: parse with .expect("not a number"), so a bad entry crashes the program.

Approach B: parse with match { Ok(num) => num, Err(_) => continue }, so a bad entry loops back for another try.

Compare them on user experience and robustness. When might Approach A still be acceptable?`,
    hints: [
      'Think about what happens on a typo.',
      'Crashing is sometimes acceptable in quick scripts.',
    ],
    solution: `Approach A is brittle: a single non-numeric entry crashes the program, ending the game. Approach B is robust: bad input is silently skipped via continue and the player is re-prompted, which is a far better experience for an interactive game. Approach A is simpler and acceptable in throwaway scripts, prototypes, or contexts where you control the input and a crash on malformed data is fine (or even desirable to surface bugs). For a polished guessing game meant for real users, Approach B's graceful retry loop is the better design.`,
    tags: ['error-handling', 'design', 'comparison'],
  },
  {
    id: 'rs-ch02-t-020',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Predict Output With Shadowing and Trim',
    prompt: `Trace this, assuming the input string already holds "  9 \\n":

let guess = "  9 \\n".to_string();
let guess: u32 = guess.trim().parse().expect("nope");
let guess = guess * 2;
println!("{guess}");

What is printed, and how many distinct bindings named guess existed?`,
    hints: [
      'trim removes the spaces and the newline.',
      'Each let with guess creates a new binding.',
    ],
    solution: `trim() strips the leading spaces, trailing space, and newline, leaving "9", which parses to the u32 value 9. The third let shadows again with guess * 2, giving 18. So the program prints "18". There were three distinct bindings named guess: first the String "  9 \\n", then the u32 9, then the u32 18. Each let created a new binding that shadowed the previous one, and only the latest is visible at the println.`,
    tags: ['shadowing', 'trim', 'predict-output'],
  },
  {
    id: 'rs-ch02-t-021',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Two Mutable Borrows at Once',
    prompt: `Imagine trying to read two guesses in a single statement:

io::stdin().read_line(&mut guess);
let r = &mut guess;
io::stdin().read_line(&mut guess).expect("x");
println!("{}", r);

Why does the borrow checker complain about the last two lines as written?`,
    hints: [
      'Only one active mutable borrow of a value is allowed at a time.',
      'r is still in use when read_line borrows guess again.',
    ],
    solution: `The line let r = &mut guess creates a mutable borrow of guess that is still alive because r is used later in the println. Then read_line(&mut guess) tries to take a SECOND mutable borrow of guess at the same time. Rust forbids having two active mutable references to the same value simultaneously, so the borrow checker rejects this with a "cannot borrow guess as mutable more than once at a time" error. To fix it, you must finish using r before borrowing guess again, so the two mutable borrows do not overlap.`,
    tags: ['borrow-checker', 'mutability', 'references'],
  },
  {
    id: 'rs-ch02-t-022',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'gen_range Inclusive Versus Exclusive',
    prompt: `The chapter uses gen_range(1..=100) to pick the secret. Contrast 1..=100 with 1..100: which numbers can each produce, and what would change about the game if you used the wrong one for a "1 to 100" guessing game?`,
    hints: [
      '..= includes the right endpoint; .. excludes it.',
      'Think about whether 100 can be the secret.',
    ],
    solution: `1..=100 is an inclusive range covering every integer from 1 up to and including 100, so the secret can be any value 1 through 100. 1..100 is exclusive on the right, covering 1 through 99 only, so 100 could never be chosen. For a game advertised as "1 to 100", using 1..100 would be a subtle bug: a player who guesses 100 could never win because the secret is never 100, and the valid answer space is smaller than promised. The inclusive ..= form matches the intended 1-through-100 range.`,
    tags: ['range', 'gen_range', 'off-by-one'],
  },
  {
    id: 'rs-ch02-t-023',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Filtering Out-of-Range Guesses',
    prompt: `You want to reject guesses outside 1..=100 with a message and let the player retry, before comparing to the secret. Using only chapter-2 features (if/else, continue inside a loop, u32 comparisons), describe the check you would add right after a successful parse, and why it must run BEFORE the cmp on the secret.`,
    hints: [
      'A u32 can hold values far above 100.',
      'continue sends the player back to re-prompt.',
    ],
    solution: `Right after parsing guess into a u32, add a range check such as: if guess < 1 || guess > 100, then print a message like "Please guess between 1 and 100" and call continue to skip the rest of the iteration and re-prompt. This must run before the cmp on the secret because the secret itself is always within 1..=100; comparing an out-of-range guess to it would still report "Too big!" or "Too small!" and waste the player's turn on a meaningless answer. Validating the range first guarantees that by the time we reach cmp, guess is a sensible value the player could actually win with. (Note: with u32 the guess can never be negative, so the lower bound check guards against the literal 0.)`,
    tags: ['range', 'validation', 'continue'],
  },
  {
    id: 'rs-ch02-t-024',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Why u32 Rejects a Negative Input',
    prompt: `A player types -5 and presses Enter, and the code does:

let guess: u32 = input.trim().parse().expect("not a number");

What happens at runtime, and why? Would changing u32 to i32 change the outcome?`,
    hints: [
      'u32 is an unsigned type and cannot represent negatives.',
      'parse fails when the text does not fit the target type.',
    ],
    solution: `parse tries to turn "-5" into a u32, but u32 is unsigned and cannot represent any negative number, so parse returns Err and expect panics with "not a number". The program crashes. Changing the type to i32 (a signed integer) WOULD change the outcome: "-5" is a valid i32, so parse would succeed and guess would be -5, and the program would not panic. So whether negative input is accepted depends on choosing a signed versus unsigned target type; with u32 the parse of a negative literal always fails.`,
    tags: ['parse', 'unsigned', 'types'],
  },
  {
    id: 'rs-ch02-t-025',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Counting Attempts Across the Loop',
    prompt: `You want the game to announce "You won in N tries!" when the player guesses correctly. Using only chapter-2 tools, where do you declare the counter relative to the loop, when do you increment it, and why would declaring it INSIDE the loop break the feature?`,
    hints: [
      'A variable declared inside the loop is re-created every pass.',
      'Increment once per real guess.',
    ],
    solution: `Declare let mut tries = 0; OUTSIDE (before) the loop so it persists across iterations and accumulates a running total. Increment it once per actual guess, typically right after a successful parse (so invalid entries that continue do not count), or at the top of each real attempt. When the Ordering::Equal arm fires, print "You won in N tries!" using tries, then break. If instead you declared let mut tries = 0 INSIDE the loop, it would be re-created and reset to 0 on every iteration, so it could never count past the current pass and would always report a tiny, wrong number. Persistence across iterations is exactly why the counter must live outside the loop.`,
    tags: ['loop', 'counter', 'scope'],
  },
  {
    id: 'rs-ch02-t-026',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Shadow Type Change Versus Reassignment',
    prompt: `Compare these two snippets. Which compiles, and why does the other fail?

Snippet 1:
let spaces = "   ";
let spaces = spaces.len();

Snippet 2:
let mut spaces = "   ";
spaces = spaces.len();

Relate your answer to how the guessing game converts a String into a number.`,
    hints: [
      'Shadowing creates a brand-new binding that may have a new type.',
      'Reassignment must keep the same type.',
    ],
    solution: `Snippet 1 compiles: the second let SHADOWS spaces, creating a new binding, so it is allowed to have a different type (a number from len()) than the first (a string slice). Snippet 2 does NOT compile: spaces = spaces.len() is a reassignment, not a new binding, and reassignment must keep the variable's original type. Assigning a number into a binding that holds a string slice is a type mismatch the compiler rejects. This is exactly why the guessing game uses shadowing (let guess: u32 = guess.trim().parse()...) to turn a String into a u32 under the same name; mere reassignment could not change the type.`,
    tags: ['shadowing', 'reassignment', 'types'],
  },
  {
    id: 'rs-ch02-t-027',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'A Quit Command Alongside Numbers',
    prompt: `Design (in prose, chapter-2 features only) an input loop where typing the word quit ends the game, but any other input is treated as a numeric guess. Outline the order of operations on the trimmed input, and explain why you must check for quit BEFORE attempting parse.`,
    hints: [
      'Compare the trimmed text against "quit" first.',
      'parse on "quit" would error.',
    ],
    solution: `After read_line, trim the input into a clean text value. First compare that trimmed text to "quit": if it equals "quit", break out of the loop to end the game. Only if it is NOT "quit" do you attempt to parse it into a u32 (using match with Err(_) => continue, or expect). You must check for quit BEFORE parse because "quit" is not a number, so parse would return Err; if you parsed first, the quit command would either crash the program (with expect) or be skipped as bad input (with continue) and never trigger the intended exit. Ordering the string comparison before the numeric conversion lets the special command win.`,
    tags: ['loop', 'string-compare', 'design'],
  },
  {
    id: 'rs-ch02-t-028',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Why println Curly Braces Need Care',
    prompt: `These two println calls behave differently:

let x = 5;
println!("{x}");
println!("the value is {}", x);

Both print the same thing here. But explain: when can you use the {x} inline form, and what must you switch to if you instead want to print the result of an expression like x + 1? Tie this to displaying a guess.`,
    hints: [
      'Inline braces capture a variable by name.',
      'Expressions cannot go inside the inline braces.',
    ],
    solution: `The inline form "{x}" works when you want to print the value of a variable that is in scope, captured directly by its name. It does NOT accept arbitrary expressions, so you cannot write "{x + 1}". To print the result of an expression you use an empty placeholder "{}" and pass the expression as a trailing argument: println!("{}", x + 1). For displaying a guess, "You guessed: {guess}" works because guess is a variable, but if you wanted to show guess doubled you would write println!("doubled: {}", guess * 2). The rule: named inline braces for plain in-scope variables, positional "{}" with arguments for computed values.`,
    tags: ['println', 'formatting', 'expressions'],
  },
  {
    id: 'rs-ch02-t-029',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Spot the Bug in This Game Loop',
    prompt: `Find the logic bug:

loop {
    let mut guess = String::new();
    io::stdin().read_line(&mut guess).expect("read failed");
    let guess: u32 = guess.trim().parse().expect("bad");
    match guess.cmp(&secret_number) {
        Ordering::Less => println!("Too small!"),
        Ordering::Greater => println!("Too big!"),
        Ordering::Equal => println!("You win!"),
    }
}

Assume secret_number is a valid u32. The comparisons are correct, yet the game never stops even after "You win!". Why, and what single statement fixes it?`,
    hints: [
      'Look at what the Equal arm does after printing.',
      'How does a loop end?',
    ],
    solution: `The bug is that the Ordering::Equal arm prints "You win!" but never breaks out of the loop, and an unconditional loop runs forever until something tells it to stop. So even after a correct guess the loop circles back and prompts again endlessly. The single-statement fix is to add break; inside the Equal arm, right after the println, so the loop terminates once the player wins. (A secondary fragility is that expect("bad") will crash on non-numeric input, but the question's "never stops" symptom is caused specifically by the missing break.)`,
    tags: ['debugging', 'loop', 'break'],
  },
  {
    id: 'rs-ch02-t-030',
    chapter: 2,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Why match Is Cleaner Than Chained ifs',
    prompt: `You could compare a guess to the secret with chained if/else if/else on < , > , and == instead of match guess.cmp(&secret). Using only chapter-2 reasoning, argue why the match-on-Ordering version is preferable for correctness and clarity, and what guarantee match gives that the if-chain does not.`,
    hints: [
      'Ordering has exactly three variants.',
      'Exhaustiveness is checked by the compiler.',
    ],
    solution: `cmp collapses the comparison into one value of three possible Ordering variants, and match forces you to handle them. The key guarantee is exhaustiveness: the compiler checks that every Ordering variant is covered, so you cannot accidentally forget the Equal (win) case; an if/else if chain offers no such check and a missing final else would silently do nothing for one situation. match also reads more clearly because each outcome (Less, Greater, Equal) is named and lined up, rather than implied by ordering of comparison operators, and it evaluates cmp once instead of comparing the values two or three separate times. For correctness and clarity, match on Ordering is the idiomatic, safer choice.`,
    tags: ['match', 'ordering', 'design'],
  },
]

export default problems
