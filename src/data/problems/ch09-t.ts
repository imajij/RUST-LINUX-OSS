import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch09-t-001',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'Recoverable vs Unrecoverable',
    prompt: `Rust splits errors into two broad categories and gives you a different tool for each. Name the two categories, and name the language feature Rust associates with each one.`,
    hints: [
      'One kind aborts the program; the other hands the caller a value to inspect.',
      'Think about a macro versus an enum.',
    ],
    solution: `Rust distinguishes unrecoverable errors from recoverable errors. For unrecoverable errors you use the panic! macro, which stops execution (unwinding or aborting) because continuing would be unsafe or meaningless. For recoverable errors you use the Result<T, E> enum, which represents either success (Ok) or failure (Err) as an ordinary value the caller can match on and respond to. The key difference is that a panic ends the program path, while a Result lets the program decide what to do next.`,
    tags: ['panic', 'result', 'errors'],
  },
  {
    id: 'rs-ch09-t-002',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'The Two Result Variants',
    prompt: `The Result type has exactly two variants. What are they called, and what does each one hold? Roughly write the enum definition Result uses (the standard library one).`,
    hints: ['Result is generic over two type parameters.'],
    solution: `Result has two variants: Ok, which wraps the success value of type T, and Err, which wraps the error value of type E. Its definition is roughly: enum Result<T, E> { Ok(T), Err(E) }. Because both variants are brought into scope by the prelude, you can write Ok(value) and Err(error) directly without qualifying them. T and E are generic so the same Result type works for any success and error types.`,
    tags: ['result', 'enum', 'generics'],
  },
  {
    id: 'rs-ch09-t-003',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'What unwrap Does on Err',
    prompt: `Suppose you call .unwrap() on a Result that turns out to be an Err. Describe exactly what happens at runtime.`,
    hints: ['unwrap is a shortcut for a match.'],
    solution: `If the Result is Ok(v), unwrap returns the inner value v. If the Result is Err(e), unwrap calls the panic! macro for you, crashing the program with a message that includes the error value. So unwrap is a convenient way to extract the success value while treating any error as an unrecoverable bug. You should only use it when you are confident the value cannot be an Err, or in quick prototypes and examples.`,
    tags: ['unwrap', 'panic', 'result'],
  },
  {
    id: 'rs-ch09-t-004',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'intro',
    title: 'unwrap Versus expect',
    prompt: `Both unwrap and expect panic when called on an Err. What is the practical difference between them, and why might you prefer expect?`,
    hints: ['One of them lets you supply text.'],
    solution: `Both panic on Err and return the inner value on Ok, so behaviorally they are almost identical. The difference is that expect takes a message argument and uses it as the panic text, whereas unwrap uses a generic default message. Preferring expect lets you document why you believe the value should never be an Err, which makes the panic message far more useful when debugging. A good convention is to phrase the expect message as the expectation, such as expect("config file should exist because setup created it").`,
    tags: ['unwrap', 'expect', 'panic'],
  },
  {
    id: 'rs-ch09-t-005',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Matching to Recover',
    prompt: `You open a file with File::open, which returns a Result. You want to: use the file if it opens, but if it fails because the file is missing, create it instead, and panic for any other error. At a high level, what control-flow construct lets you handle these cases, and how do you tell "missing" apart from other failures?`,
    hints: [
      'The outer decision is Ok versus Err.',
      'Inside Err you can inspect the error kind.',
    ],
    solution: `You use a match on the Result. The outer arms separate Ok(file), where you use the file, from Err(error), where something went wrong. Inside the Err arm you inspect the error further, for example with error.kind() compared against ErrorKind::NotFound, to distinguish a missing file from other problems. For the NotFound case you call File::create (which itself returns a Result you also handle), and for any other ErrorKind you panic because those failures are not ones you can sensibly recover from.`,
    tags: ['match', 'result', 'recovery'],
  },
  {
    id: 'rs-ch09-t-006',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Predict the Output',
    prompt: `Given:

  fn divide(a: i32, b: i32) -> Result<i32, String> {
      if b == 0 { Err(String::from("divide by zero")) } else { Ok(a / b) }
  }

  fn main() {
      let r = divide(10, 2);
      match r {
          Ok(n) => println!("got {n}"),
          Err(e) => println!("error: {e}"),
      }
  }

What does this print, and why does the Err arm not run?`,
    hints: ['b is not zero here.'],
    solution: `It prints "got 5". Because b is 2 (not zero), divide takes the else branch and returns Ok(10 / 2), which is Ok(5). The match then binds n to 5 in the Ok arm and prints "got 5". The Err arm only runs when divide returns Err, which would require b to be zero, so it is skipped entirely here.`,
    tags: ['match', 'result', 'output'],
  },
  {
    id: 'rs-ch09-t-007',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Why This Does Not Compile',
    prompt: `A learner writes:

  fn get_len(s: Result<String, String>) -> usize {
      s.len()
  }

The compiler rejects s.len(). Explain why, and name two methods that would fix it.`,
    hints: ['s is still wrapped in Result.', 'You must get the String out first.'],
    solution: `It does not compile because s has type Result<String, String>, not String, and Result has no len method, so calling s.len() is a type error. You must extract the inner String before measuring its length. Two ways to do that are s.unwrap().len() (which panics on Err) or s.expect("...").len(); a non-panicking alternative is to match on s and return a length per arm. The lesson is that a Result is a container you must open before using the value inside.`,
    tags: ['result', 'compile-error', 'types'],
  },
  {
    id: 'rs-ch09-t-008',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Manual Propagation With match',
    prompt: `Before learning the ? operator, you propagate an error by hand. Sketch in words how a function read_username() that calls File::open and then read_to_string would return the error to its caller using only match (no ?). What does each match return on the Err path?`,
    hints: ['On Err, return early from the whole function.'],
    solution: `You match on the Result from File::open: on Ok(f) you bind the file and continue, but on Err(e) you immediately return Err(e) from read_username, handing the error to the caller. You then match the Result from read_to_string the same way: Ok(_) leads to returning Ok(the username), and Err(e) returns Err(e). The pattern is that every fallible step's Err arm does an early return Err(e), while the Ok arm unwraps the value and proceeds; the final success returns Ok(...). This manual pattern is exactly what the ? operator automates.`,
    tags: ['match', 'propagation', 'result'],
  },
  {
    id: 'rs-ch09-t-009',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'What the Question Mark Does',
    prompt: `Describe the behavior of the ? operator when it is applied to a Result value inside a function. Cover both the Ok case and the Err case.`,
    hints: ['It is a shortcut for a specific match.'],
    solution: `When applied to a Result, ? evaluates it: if the value is Ok(v), the ? expression produces v and execution continues. If the value is Err(e), ? returns early from the enclosing function with Err(e). So result? is shorthand for matching, where Ok yields the inner value and Err triggers an immediate return of the error to the caller. This makes propagation concise while keeping the same logic as a hand-written match.`,
    tags: ['question-mark', 'propagation', 'result'],
  },
  {
    id: 'rs-ch09-t-010',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Question Mark Requires the Right Return Type',
    prompt: `This fails to compile:

  fn first_char(s: &str) -> char {
      let c = s.chars().next()?;
      c
  }

Why does the ? on the last line cause a compile error here?`,
    hints: ['What can ? do on the Err/None path?', 'Look at the return type.'],
    solution: `The ? operator must be able to return early with an error/None value from the enclosing function, so that function's return type has to be compatible (a Result, an Option, or another type implementing the right trait). Here first_char returns char, which is neither Result nor Option, so there is nowhere for ? to send a None. The compiler rejects it because ? on an Option needs the function to return Option (or a compatible type). Fixing it means changing the return type to Option<char> and returning Some(c).`,
    tags: ['question-mark', 'compile-error', 'option'],
  },
  {
    id: 'rs-ch09-t-011',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'panic Aborts, Result Continues',
    prompt: `For a library function that parses user-supplied input which is often malformed, would you reach for panic! or Result? Justify the choice in terms of who is responsible for the bad input.`,
    hints: ['Is malformed user input expected or a bug?'],
    solution: `You should return a Result. Malformed user input is an expected, recoverable situation, not a bug in your code, so the caller deserves the chance to handle it (retry, prompt again, report nicely) rather than have the whole program crash. Panicking would take that choice away and turn ordinary bad data into a fatal error. Reserve panic! for states that indicate a programming bug or a genuinely unrecoverable corruption, and use Result whenever failure is a normal, anticipated outcome.`,
    tags: ['panic', 'result', 'design'],
  },
  {
    id: 'rs-ch09-t-012',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Reading a panic Message',
    prompt: `You run a program and see:

  thread 'main' panicked at src/main.rs:4:25:
  index out of bounds: the len is 3 but the index is 99

Without seeing the code, what does this tell you happened, and which line and column should you examine?`,
    hints: ['Panic messages include a location.'],
    solution: `The message says the program panicked while indexing a collection whose length is 3 using index 99, which is out of bounds. That is the classic panic from v[99] when v has only 3 elements, so somewhere a computed or hard-coded index exceeded the valid range 0..=2. The location src/main.rs:4:25 points you to line 4, column 25, where the offending indexing expression sits. To fix it you would validate the index, use a method like get that returns Option, or correct the logic producing the index.`,
    tags: ['panic', 'debugging', 'index'],
  },
  {
    id: 'rs-ch09-t-013',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'easy',
    title: 'Chaining With the Question Mark',
    prompt: `Compare these two bodies of read_to_string-style code. Version A:

  let mut s = String::new();
  File::open("f")?.read_to_string(&mut s)?;
  Ok(s)

Version B does the same with two separate let bindings and two match blocks. What advantage does Version A's chaining of ? give, and does it change the error behavior?`,
    hints: ['? can be applied to an intermediate Result before calling a method on it.'],
    solution: `Version A is shorter because it applies ? right after File::open and then immediately calls read_to_string on the unwrapped file, chaining the two fallible calls on one line. It does not change the error behavior at all: each ? still returns early with Err on failure exactly as the matches in Version B would. The only differences are conciseness and readability; both versions propagate the same errors in the same order. Chaining is idiomatic when intermediate values are only needed to continue the chain.`,
    tags: ['question-mark', 'chaining', 'propagation'],
  },
  {
    id: 'rs-ch09-t-014',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Question Mark on Result vs Option',
    prompt: `The ? operator works on both Result and Option, but the early-return value differs. State what ? returns early with in each case, and explain why you cannot freely mix the two in one function.`,
    hints: ['Result early-returns Err; Option early-returns None.'],
    solution: `On a Result, ? returns early with Err(e) when the value is Err; on an Option, ? returns early with None when the value is None. The constraint is that the enclosing function's return type must match the kind being propagated: a function returning Option can use ? on Options, and a function returning Result can use ? on Results. You cannot apply ? to an Option in a function that returns Result (or vice versa) without converting, because there is no automatic way for ? to turn a None into the function's required Err type. So within one function, ? expressions generally must agree with that function's return category.`,
    tags: ['question-mark', 'result', 'option'],
  },
  {
    id: 'rs-ch09-t-015',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Predict: Option Question Mark',
    prompt: `Consider:

  fn last_char_of_first_line(text: &str) -> Option<char> {
      text.lines().next()?.chars().last()
  }

For the input "hello\\nworld", what does this return, and what does it return for the empty string ""? Walk through how ? participates.`,
    hints: ['lines().next() on "" — is there a first line?'],
    solution: `For "hello\\nworld", text.lines().next() is Some("hello"), so ? yields the string slice "hello", and "hello".chars().last() is Some('o'); the function returns Some('o'). For "", lines() produces no lines, so next() is None, and ? immediately returns None from the function, never reaching chars().last(). Thus the empty string yields None. The ? operator both unwraps the Some on the success path and short-circuits to None on the failure path.`,
    tags: ['question-mark', 'option', 'output'],
  },
  {
    id: 'rs-ch09-t-016',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'main Returning a Result',
    prompt: `You want to use ? directly inside main. What return type must main have to allow that, what is the conventional error type, and what does the program's exit behavior become when main returns Ok versus Err?`,
    hints: ['main can return more than the unit type.', 'Think of a trait-object error type.'],
    solution: `main may return Result<(), E>, commonly written Result<(), Box<dyn Error>>, which lets you use ? on any error that converts into a boxed trait object. With that signature, returning Ok(()) makes the program exit with success status code 0. If main returns an Err, Rust prints the error using its Debug representation and exits with a nonzero error code. This is why returning Result from main is a clean way to propagate errors out of a program without writing manual matches at the top level.`,
    tags: ['main', 'result', 'box-dyn-error'],
  },
  {
    id: 'rs-ch09-t-017',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Why Box dyn Error',
    prompt: `In a function that calls several different fallible operations whose errors have different concrete types, why is Box<dyn Error> a convenient return error type, and what does ? do to those different error types on the way out?`,
    hints: ['Different errors, one return type.', '? can convert the error.'],
    solution: `Different operations return different concrete error types, so a single fixed error type would not fit all of them. Box<dyn Error> is a trait object meaning "some type that implements the Error trait, boxed on the heap," which can hold any of those concrete errors behind one uniform type. When you use ? on an Err whose error type implements Error, the operator converts it into the function's return error type, here boxing it into Box<dyn Error>. This lets one function propagate many heterogeneous errors through a single, simple return type.`,
    tags: ['box-dyn-error', 'question-mark', 'propagation'],
  },
  {
    id: 'rs-ch09-t-018',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'unwrap in Tests vs Production',
    prompt: `It is common to see lots of unwrap and expect calls in test code but to avoid them in production library code. Explain the reasoning behind treating these two contexts differently.`,
    hints: ['What should happen when a test hits an unexpected error?'],
    solution: `In a test, an unexpected Err usually means the test has failed, and panicking is exactly the desired outcome because a panic marks the test as failed and shows where it went wrong, so unwrap and expect are appropriate and concise. In production library code, a panic crashes the caller's program and removes their ability to recover, which is usually unacceptable for errors that callers could reasonably handle. Therefore library code generally returns Result and lets callers decide, while tests can panic freely since failing loudly is the point. The same call that is fine in a test can be inappropriate in a public function.`,
    tags: ['unwrap', 'expect', 'testing'],
  },
  {
    id: 'rs-ch09-t-019',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'When unwrap Is Justified',
    prompt: `Sometimes you have more information than the compiler and you know a Result cannot be Err. Give an example of such a situation and explain why unwrap (or expect) is reasonable there even though it can panic in principle.`,
    hints: ['Think of a hard-coded value that you parse.'],
    solution: `A classic example is "127.0.0.1".parse::<IpAddr>().unwrap(): the string is a hard-coded, valid IP literal, so parsing it can never actually fail, yet parse still returns a Result because in general strings might be invalid. Here you have static knowledge the compiler lacks, so unwrap is justified because the Err branch is logically impossible for this fixed input. Using expect("hardcoded IP is valid") is even better because it documents that reasoning. The guideline is that unwrap is acceptable when you can prove the Err cannot occur, ideally annotating that proof in the message.`,
    tags: ['unwrap', 'expect', 'design'],
  },
  {
    id: 'rs-ch09-t-020',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Validation in the Function vs a Type',
    prompt: `A guessing game needs numbers between 1 and 100. One approach checks the range with an if at the start of every function that uses the number. Compare that to creating a Guess type whose constructor validates the range. What is the maintenance advantage of the type-based approach?`,
    hints: ['Where does the invariant live?'],
    solution: `With scattered if checks, every function that consumes the number must remember to validate the range, and a single forgotten check lets an invalid value slip through, so the invariant is duplicated and fragile. A Guess newtype centralizes the check in one constructor (for example Guess::new), which panics or errors on out-of-range input, so once you hold a Guess you know it is valid without re-checking. Functions can then take a Guess parameter and trust the invariant, encoding "in range" into the type system. This reduces duplication and makes it impossible to construct an invalid Guess, improving safety and maintainability.`,
    tags: ['validation', 'newtype', 'design'],
  },
  {
    id: 'rs-ch09-t-021',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Why a Private Field',
    prompt: `In the Guess validating-newtype pattern, the inner value field is kept private and exposed only through a getter method. Why is keeping the field private essential to the guarantee the type provides?`,
    hints: ['What if outside code could set the field directly?'],
    solution: `The whole guarantee is that any existing Guess holds a value within the valid range, which is enforced only in the constructor. If the field were public, code outside the module could create or mutate a Guess with an out-of-range value, bypassing the constructor's check and breaking the invariant. Keeping the field private forces all construction through Guess::new, so the validation cannot be skipped, and a getter provides read access without granting the ability to set an invalid value. Privacy is what makes the "always valid" promise actually hold.`,
    tags: ['validation', 'newtype', 'encapsulation'],
  },
  {
    id: 'rs-ch09-t-022',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'medium',
    title: 'Compare: ? Versus unwrap',
    prompt: `Inside a function read_config() -> Result<Config, Box<dyn Error>>, you could write parse_step()? or parse_step().unwrap(). Both deal with the Result from parse_step. How do they differ in what reaches the caller when parse_step fails?`,
    hints: ['One propagates, one crashes.'],
    solution: `With parse_step()?, a failure causes read_config to return early with that error as Err, so the caller receives a Result they can handle, recover from, or report. With parse_step().unwrap(), a failure panics inside read_config, crashing the program before the caller ever sees a value, so the caller has no chance to respond. The ? version respects read_config's contract of returning Result and keeps errors recoverable, while unwrap converts a recoverable error into an unrecoverable one. In a function that already returns Result, ? is almost always the better choice.`,
    tags: ['question-mark', 'unwrap', 'propagation'],
  },
  {
    id: 'rs-ch09-t-023',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Error Type Mismatch Under Question Mark',
    prompt: `A function returns Result<i32, MyError>, but inside it you write some_call()? where some_call returns Result<i32, std::io::Error>. This may fail to compile unless something is in place. Explain what ? tries to do with the io::Error and what you must provide to make the propagation type-check.`,
    hints: ['? does an automatic conversion on the error.', 'Think about From.'],
    solution: `When the Err type produced by some_call differs from the function's declared Err type, ? tries to convert the io::Error into MyError using the From trait (the standard library's ? calls .into() on the error). The code compiles only if there is an implementation of From<std::io::Error> for MyError; with that impl, ? converts the error automatically on the way out. Without such a conversion, the types do not match and the compiler rejects the ?. So to propagate a foreign error into your own error type, you provide impl From<io::Error> for MyError (or change the return type to something both convert into, like Box<dyn Error>).`,
    tags: ['question-mark', 'from', 'error-conversion'],
  },
  {
    id: 'rs-ch09-t-024',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'panic Unwinding Versus Abort',
    prompt: `By default a Rust panic unwinds the stack, but you can configure panic = "abort" in the release profile. Describe the difference between unwinding and aborting, and give one reason you might choose abort.`,
    hints: ['Unwinding runs cleanup; abort does not.'],
    solution: `On a panic, the default behavior is unwinding: Rust walks back up the stack, running each value's cleanup (dropping it) so resources are released in an orderly way, which requires extra code in the binary. With panic = "abort", the program instead terminates immediately without unwinding or running drops, handing cleanup to the operating system as the process dies. You might choose abort to produce a smaller, simpler binary, since the unwinding machinery is omitted, which can matter in constrained or embedded contexts. The trade-off is that abort skips destructors, so any cleanup that must run on panic will not.`,
    tags: ['panic', 'unwinding', 'abort'],
  },
  {
    id: 'rs-ch09-t-025',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Designing a Guess::new That Returns Result',
    prompt: `The book's Guess::new panics on out-of-range input. Suppose instead you want Guess::new to return Result<Guess, String> so callers can recover. Describe the signature and the body's two return paths, and explain when this Result-returning version is preferable to the panicking one.`,
    hints: ['Validate, then choose Ok or Err.', 'Who calls new, and is bad input a bug?'],
    solution: `The signature becomes fn new(value: i32) -> Result<Guess, String>. The body checks the range: if value < 1 or value > 100, it returns Err with a descriptive message such as Err(format!("value must be 1..=100, got {value}")); otherwise it returns Ok(Guess { value }). This Result-returning version is preferable when out-of-range input is an expected, externally caused condition (for example raw user input or data from a file) that the caller should handle gracefully rather than crash on. The panicking version is better when an out-of-range value would indicate a programming bug inside trusted code, where crashing loudly is the right response.`,
    tags: ['validation', 'newtype', 'result'],
  },
  {
    id: 'rs-ch09-t-026',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Question Mark in a Non-Returning Closure',
    prompt: `A learner is surprised that ? inside the body of a main that returns () does not work, yet wrapping the logic in a helper function that returns Result<(), Box<dyn Error>> makes ? compile. Explain the underlying rule that ties ? to the enclosing function or closure, not to where the Result was created.`,
    hints: ['? returns from the enclosing function.', 'What is that function obligated to return?'],
    solution: `The rule is that ? performs an early return from the function or closure it is written in, so that enclosing body's return type must be able to represent the propagated error (Result, Option, or a compatible type). It does not matter where the Result was originally produced; what matters is the signature of the body containing the ?. A main returning () cannot early-return an Err, so ? is illegal there, but a helper returning Result<(), Box<dyn Error>> can, which is why moving the logic into that helper fixes it. In short, ? is bound to the enclosing function's contract, and you make ? legal by giving that function a return type that can carry the error.`,
    tags: ['question-mark', 'main', 'return-type'],
  },
  {
    id: 'rs-ch09-t-027',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Choosing Panic for a Contract Violation',
    prompt: `The guidelines say to panic when code could end up in a "bad state" that the surrounding code cannot reasonably recover from. Give a concrete example of such a bad state from a function's perspective, and explain why a panic communicates a bug better than returning a Result there.`,
    hints: ['Think of a precondition the caller must uphold.'],
    solution: `Consider a function that assumes its caller already guaranteed an index is in range, or that a slice is non-empty; if that contract is violated, the function is in a state its logic never anticipated, which signals a bug in the calling code rather than a normal runtime condition. Panicking is appropriate because the error is unexpected and not something downstream code can sensibly recover from; it stops execution at the point the invariant broke and surfaces the bug during development. Returning a Result here would imply the failure is a routine, recoverable outcome and push handling onto callers for a situation that should simply never occur if the code is correct. So panics are the right tool for violated assumptions and broken invariants, while Result is for failures that are expected and recoverable.`,
    tags: ['panic', 'design', 'invariants'],
  },
  {
    id: 'rs-ch09-t-028',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Trace Multi-Step Propagation',
    prompt: `Given:

  fn parse_pair(s: &str) -> Result<(i32, i32), std::num::ParseIntError> {
      let mut parts = s.split(',');
      let a: i32 = parts.next().unwrap().trim().parse()?;
      let b: i32 = parts.next().unwrap().trim().parse()?;
      Ok((a, b))
  }

For input "3, x", which step fails, what does ? do at that step, and what does parse_pair return? Also note one fragility in this code.`,
    hints: ['parse on "x" — is that Ok?', 'What about the unwrap calls?'],
    solution: `For "3, x", the first parse on "3" succeeds and binds a = 3, but the second parse on "x" fails, producing Err(ParseIntError). At that second parse, the ? operator returns early from parse_pair with that Err, so the function returns Err(the ParseIntError) and never reaches Ok((a, b)). A fragility is the parts.next().unwrap() calls: if s has fewer than two comma-separated pieces (for example "3" with no comma), next() returns None and unwrap panics instead of returning a Result, mixing an unrecoverable crash into an otherwise recoverable function. A more robust version would propagate the missing-field case as an error rather than unwrapping.`,
    tags: ['question-mark', 'propagation', 'parse'],
  },
  {
    id: 'rs-ch09-t-029',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Recover Without Panicking: unwrap_or Family',
    prompt: `Instead of match or unwrap, you sometimes see methods like unwrap_or, unwrap_or_else, and (for Result) ok() to bridge to Option. Conceptually, when would you choose unwrap_or over a full match, and what is the danger of using unwrap_or with an expensive default value?`,
    hints: ['unwrap_or takes a default; unwrap_or_else takes a closure.'],
    solution: `You choose unwrap_or when you simply want a fallback value on failure and do not need to inspect or branch on the error, making it more concise than a full match that would otherwise just supply a default. The danger of unwrap_or(expensive()) is that its argument is evaluated eagerly, so the default is computed every call even when the value is Ok/Some and the default is discarded, wasting work. To avoid that, use unwrap_or_else with a closure, which runs only on the failure path and so defers the cost. So unwrap_or is fine for cheap, already-available defaults, while unwrap_or_else is the right tool when producing the default is expensive.`,
    tags: ['result', 'option', 'combinators'],
  },
  {
    id: 'rs-ch09-t-030',
    chapter: 9,
    kind: 'thinking',
    difficulty: 'hard',
    title: 'Designing an API: panic, Result, or Option',
    prompt: `You are designing three functions for a small library: (1) get an element by index from a collection, (2) parse a configuration string supplied by users, and (3) a private helper that assumes its argument was already validated upstream. For each, decide whether its failure mode should be expressed with Option, Result, or panic, and justify each choice in one sentence.`,
    hints: [
      'Absence with no error detail vs failure with error detail vs a bug.',
      'Who supplies the input, and is failure expected?',
    ],
    solution: `(1) Index access should return Option, because "no element at that index" is an expected absence with no extra error information to convey, which is exactly what Some/None models (like slice::get). (2) Parsing user-supplied config should return Result, because malformed input is an expected, caller-recoverable failure and the caller benefits from a descriptive error explaining what went wrong. (3) The private helper that trusts an already-validated argument can panic if its precondition is violated, because reaching that state would mean an internal bug rather than a normal runtime condition, and crashing surfaces it during development. The guiding principle is Option for plain absence, Result for expected recoverable failures with detail, and panic for broken invariants that signal bugs.`,
    tags: ['design', 'result', 'option'],
  },
]

export default problems
