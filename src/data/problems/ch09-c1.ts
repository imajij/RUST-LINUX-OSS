import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch09-c-001',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Trigger a Panic',
    prompt: `In \`main\`, call the \`panic!\` macro with the message "crash and burn" so the program aborts with that message.

Expected: the program panics and prints a message containing "crash and burn".`,
    hints: [
      'The macro is named \`panic!\` and takes a message string.',
      'Once \`panic!\` runs, no later code in \`main\` will execute.',
    ],
    solution: `fn main() {
    panic!("crash and burn");
}`,
    starter: `fn main() {
    // TODO: call panic! with the message "crash and burn"
}`,
    tags: ['panic', 'unrecoverable'],
  },
  {
    id: 'rs-ch09-c-002',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Panic on Out-of-Range Index',
    prompt: `Write a function \`get_third(v: &[i32]) -> i32\` that returns the element at index 2 of the slice using normal indexing (\`v[2]\`).

In \`main\`, call it with the slice \`&[10, 20, 30]\` and print the result. (Indexing past the end would panic, but here index 2 is valid.)

Expected output:
30`,
    hints: [
      'Index a slice with square brackets, like \`v[2]\`.',
      'Indexing out of bounds is one way Rust panics at runtime.',
    ],
    solution: `fn get_third(v: &[i32]) -> i32 {
    v[2]
}

fn main() {
    let v = [10, 20, 30];
    println!("{}", get_third(&v));
}`,
    starter: `fn get_third(v: &[i32]) -> i32 {
    // TODO: return the element at index 2
}

fn main() {
    let v = [10, 20, 30];
    println!("{}", get_third(&v));
}`,
    tags: ['panic', 'indexing'],
  },
  {
    id: 'rs-ch09-c-003',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Parse and Unwrap',
    prompt: `In \`main\`, parse the string "42" into an \`i32\` using \`.parse()\` and \`.unwrap()\`, store it in a variable, then print it.

Expected output:
42`,
    hints: [
      '\`"42".parse()\` returns a \`Result\`; you must annotate or infer the target type.',
      '\`.unwrap()\` returns the value inside \`Ok\`, or panics on \`Err\`.',
      'Annotate the variable type, like \`let n: i32 = ...\`.',
    ],
    solution: `fn main() {
    let n: i32 = "42".parse().unwrap();
    println!("{}", n);
}`,
    starter: `fn main() {
    // TODO: parse "42" into an i32 with unwrap and print it
}`,
    tags: ['result', 'unwrap', 'parse'],
  },
  {
    id: 'rs-ch09-c-004',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Expect With a Message',
    prompt: `In \`main\`, parse the string "100" into a \`u32\` and use \`.expect("parsing failed")\` instead of \`.unwrap()\`. Print the value.

Expected output:
100`,
    hints: [
      '\`.expect(msg)\` works like \`.unwrap()\` but uses your custom panic message.',
      'Annotate the variable as \`u32\` so \`parse\` knows the target type.',
    ],
    solution: `fn main() {
    let n: u32 = "100".parse().expect("parsing failed");
    println!("{}", n);
}`,
    starter: `fn main() {
    let n: u32 = "100".parse().expect("parsing failed");
    println!("{}", n);
}`,
    tags: ['result', 'expect', 'parse'],
  },
  {
    id: 'rs-ch09-c-005',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Return an Ok Value',
    prompt: `Write a function \`always_ok() -> Result<i32, String>\` that always returns \`Ok(7)\`.

In \`main\`, call it, unwrap the result, and print it.

Expected output:
7`,
    hints: [
      'The return type is \`Result<i32, String>\`.',
      'Build the success value with \`Ok(7)\`.',
    ],
    solution: `fn always_ok() -> Result<i32, String> {
    Ok(7)
}

fn main() {
    let n = always_ok().unwrap();
    println!("{}", n);
}`,
    starter: `fn always_ok() -> Result<i32, String> {
    // TODO: return Ok(7)
}

fn main() {
    let n = always_ok().unwrap();
    println!("{}", n);
}`,
    tags: ['result', 'ok'],
  },
  {
    id: 'rs-ch09-c-006',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Return an Err Value',
    prompt: `Write a function \`always_err() -> Result<i32, String>\` that always returns an \`Err\` containing the message "nope".

In \`main\`, call it and print the result with the debug formatter \`{:?}\`.

Expected output:
Err("nope")`,
    hints: [
      'Build the error with \`Err(String::from("nope"))\`.',
      'Print the whole \`Result\` using \`println!("{:?}", value)\`.',
    ],
    solution: `fn always_err() -> Result<i32, String> {
    Err(String::from("nope"))
}

fn main() {
    let r = always_err();
    println!("{:?}", r);
}`,
    starter: `fn always_err() -> Result<i32, String> {
    // TODO: return Err with the message "nope"
}

fn main() {
    let r = always_err();
    println!("{:?}", r);
}`,
    tags: ['result', 'err'],
  },
  {
    id: 'rs-ch09-c-007',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Match on a Result',
    prompt: `In \`main\`, parse the string "256" into an \`i32\`. Use a \`match\` on the \`Result\`:
- on \`Ok(n)\` print "got " followed by n
- on \`Err(_)\` print "bad number"

Expected output:
got 256`,
    hints: [
      '\`match result { Ok(n) => ..., Err(_) => ... }\`.',
      'Bind the inner value with \`Ok(n)\` so you can use \`n\`.',
    ],
    solution: `fn main() {
    let parsed: Result<i32, _> = "256".parse();
    match parsed {
        Ok(n) => println!("got {}", n),
        Err(_) => println!("bad number"),
    }
}`,
    starter: `fn main() {
    let parsed: Result<i32, _> = "256".parse();
    // TODO: match on parsed and print accordingly
}`,
    tags: ['result', 'match'],
  },
  {
    id: 'rs-ch09-c-008',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Match the Failing Branch',
    prompt: `In \`main\`, try to parse the string "abc" into an \`i32\`. Use a \`match\`:
- on \`Ok(n)\` print n
- on \`Err(_)\` print "could not parse"

Because "abc" is not a number, the program should print the error branch.

Expected output:
could not parse`,
    hints: [
      'A non-numeric string makes \`parse\` return \`Err\`.',
      'Handle both arms so the code compiles even though only one runs.',
    ],
    solution: `fn main() {
    let parsed: Result<i32, _> = "abc".parse();
    match parsed {
        Ok(n) => println!("{}", n),
        Err(_) => println!("could not parse"),
    }
}`,
    starter: `fn main() {
    let parsed: Result<i32, _> = "abc".parse();
    // TODO: match and print "could not parse" on Err
}`,
    tags: ['result', 'match', 'parse'],
  },
  {
    id: 'rs-ch09-c-009',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Use unwrap_or for a Default',
    prompt: `In \`main\`, parse the string "oops" into an \`i32\` and use \`.unwrap_or(0)\` to fall back to 0 when parsing fails. Print the result.

Expected output:
0`,
    hints: [
      '\`.unwrap_or(default)\` returns the default when the \`Result\` is \`Err\`.',
      'Annotate the parsed value type so \`parse\` knows what to produce.',
    ],
    solution: `fn main() {
    let n: i32 = "oops".parse().unwrap_or(0);
    println!("{}", n);
}`,
    starter: `fn main() {
    // TODO: parse "oops" as i32, defaulting to 0 with unwrap_or
}`,
    tags: ['result', 'unwrap_or'],
  },
  {
    id: 'rs-ch09-c-010',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Check Is Ok',
    prompt: `Write a function \`is_number(s: &str) -> bool\` that returns \`true\` if \`s\` parses as an \`i32\`, and \`false\` otherwise. Use \`.is_ok()\` on the parse result.

In \`main\`, print the result of \`is_number("12")\` and \`is_number("x")\` on separate lines.

Expected output:
true
false`,
    hints: [
      '\`s.parse::<i32>()\` returns a \`Result\` you can call \`.is_ok()\` on.',
      'Return the boolean directly as the last expression.',
    ],
    solution: `fn is_number(s: &str) -> bool {
    s.parse::<i32>().is_ok()
}

fn main() {
    println!("{}", is_number("12"));
    println!("{}", is_number("x"));
}`,
    starter: `fn is_number(s: &str) -> bool {
    // TODO: return whether s parses as i32
}

fn main() {
    println!("{}", is_number("12"));
    println!("{}", is_number("x"));
}`,
    tags: ['result', 'is_ok', 'parse'],
  },
  {
    id: 'rs-ch09-c-011',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Return Ok or Err From a Check',
    prompt: `Write a function \`check_positive(n: i32) -> Result<i32, String>\` that returns \`Ok(n)\` when \`n\` is greater than zero, and otherwise returns \`Err\` with the message "not positive".

In \`main\`, print \`check_positive(5)\` and \`check_positive(-1)\` using \`{:?}\`.

Expected output:
Ok(5)
Err("not positive")`,
    hints: [
      'Use an \`if\` to decide which variant to return.',
      'Build the error as \`Err(String::from("not positive"))\`.',
    ],
    solution: `fn check_positive(n: i32) -> Result<i32, String> {
    if n > 0 {
        Ok(n)
    } else {
        Err(String::from("not positive"))
    }
}

fn main() {
    println!("{:?}", check_positive(5));
    println!("{:?}", check_positive(-1));
}`,
    starter: `fn check_positive(n: i32) -> Result<i32, String> {
    // TODO: return Ok(n) if positive, else Err("not positive")
}

fn main() {
    println!("{:?}", check_positive(5));
    println!("{:?}", check_positive(-1));
}`,
    tags: ['result', 'validation'],
  },
  {
    id: 'rs-ch09-c-012',
    chapter: 9,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Panic With a Formatted Message',
    prompt: `Write a function \`require_even(n: i32)\` that panics if \`n\` is odd, using a \`panic!\` message that includes the value, like "n must be even, got 3". If \`n\` is even, print "ok".

In \`main\`, call \`require_even(4)\`.

Expected output:
ok`,
    hints: [
      '\`panic!\` accepts format arguments just like \`println!\`.',
      'Check \`n % 2 != 0\` to detect odd numbers.',
    ],
    solution: `fn require_even(n: i32) {
    if n % 2 != 0 {
        panic!("n must be even, got {}", n);
    }
    println!("ok");
}

fn main() {
    require_even(4);
}`,
    starter: `fn require_even(n: i32) {
    // TODO: panic with a formatted message if n is odd, else print "ok"
}

fn main() {
    require_even(4);
}`,
    tags: ['panic', 'formatting'],
  },
  {
    id: 'rs-ch09-c-013',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Safe Division Returning Result',
    prompt: `Write a function \`divide(a: f64, b: f64) -> Result<f64, String>\` that returns \`Ok(a / b)\` unless \`b\` is 0.0, in which case it returns \`Err\` with the message "division by zero".

In \`main\`, print \`divide(10.0, 2.0)\` and \`divide(1.0, 0.0)\` using \`{:?}\`.

Expected output:
Ok(5.0)
Err("division by zero")`,
    hints: [
      'Compare \`b == 0.0\` before dividing.',
      'Return early with \`Err(...)\` when the divisor is zero.',
    ],
    solution: `fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        return Err(String::from("division by zero"));
    }
    Ok(a / b)
}

fn main() {
    println!("{:?}", divide(10.0, 2.0));
    println!("{:?}", divide(1.0, 0.0));
}`,
    starter: `fn divide(a: f64, b: f64) -> Result<f64, String> {
    // TODO: return Err on zero divisor, else Ok(a / b)
}

fn main() {
    println!("{:?}", divide(10.0, 2.0));
    println!("{:?}", divide(1.0, 0.0));
}`,
    tags: ['result', 'validation'],
  },
  {
    id: 'rs-ch09-c-014',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Recover With a Default via Match',
    prompt: `Write a function \`parse_or_zero(s: &str) -> i32\` that parses \`s\` as an \`i32\` and uses a \`match\` to return the number on \`Ok\`, or \`0\` on \`Err\`.

In \`main\`, print \`parse_or_zero("88")\` and \`parse_or_zero("nope")\`.

Expected output:
88
0`,
    hints: [
      'Match on \`s.parse::<i32>()\`.',
      'Return \`n\` from the \`Ok(n)\` arm and \`0\` from the \`Err\` arm.',
    ],
    solution: `fn parse_or_zero(s: &str) -> i32 {
    match s.parse::<i32>() {
        Ok(n) => n,
        Err(_) => 0,
    }
}

fn main() {
    println!("{}", parse_or_zero("88"));
    println!("{}", parse_or_zero("nope"));
}`,
    starter: `fn parse_or_zero(s: &str) -> i32 {
    // TODO: match on the parse result, returning 0 on error
}

fn main() {
    println!("{}", parse_or_zero("88"));
    println!("{}", parse_or_zero("nope"));
}`,
    tags: ['result', 'match', 'recovery'],
  },
  {
    id: 'rs-ch09-c-015',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Propagate Errors With Match',
    prompt: `Write a function \`double_parsed(s: &str) -> Result<i32, std::num::ParseIntError>\` that parses \`s\` as an \`i32\` and returns \`Ok(n * 2)\`. Use a \`match\` to propagate the error manually: on \`Ok(n)\` continue with \`n\`, on \`Err(e)\` return \`Err(e)\`.

In \`main\`, print \`double_parsed("21")\` and \`double_parsed("x")\` using \`{:?}\`.

Expected output:
Ok(42)
Err(ParseIntError { kind: InvalidDigit })`,
    hints: [
      'The error type for \`i32::parse\` is \`std::num::ParseIntError\`.',
      'In the \`Err(e)\` arm write \`return Err(e);\`.',
    ],
    solution: `fn double_parsed(s: &str) -> Result<i32, std::num::ParseIntError> {
    let n = match s.parse::<i32>() {
        Ok(n) => n,
        Err(e) => return Err(e),
    };
    Ok(n * 2)
}

fn main() {
    println!("{:?}", double_parsed("21"));
    println!("{:?}", double_parsed("x"));
}`,
    starter: `fn double_parsed(s: &str) -> Result<i32, std::num::ParseIntError> {
    // TODO: match on parse, return Err(e) on failure, else Ok(n * 2)
}

fn main() {
    println!("{:?}", double_parsed("21"));
    println!("{:?}", double_parsed("x"));
}`,
    tags: ['result', 'propagation', 'match'],
  },
  {
    id: 'rs-ch09-c-016',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Propagate With the Question Mark',
    prompt: `Rewrite error propagation using the question-mark operator. Write a function \`triple_parsed(s: &str) -> Result<i32, std::num::ParseIntError>\` that parses \`s\` with \`?\` and returns \`Ok(n * 3)\`.

In \`main\`, print \`triple_parsed("10")\` and \`triple_parsed("z")\` using \`{:?}\`.

Expected output:
Ok(30)
Err(ParseIntError { kind: InvalidDigit })`,
    hints: [
      'The \`?\` operator returns early with the error if the \`Result\` is \`Err\`.',
      'Write \`let n = s.parse::<i32>()?;\`.',
    ],
    solution: `fn triple_parsed(s: &str) -> Result<i32, std::num::ParseIntError> {
    let n = s.parse::<i32>()?;
    Ok(n * 3)
}

fn main() {
    println!("{:?}", triple_parsed("10"));
    println!("{:?}", triple_parsed("z"));
}`,
    starter: `fn triple_parsed(s: &str) -> Result<i32, std::num::ParseIntError> {
    // TODO: use ? to parse, then return Ok(n * 3)
}

fn main() {
    println!("{:?}", triple_parsed("10"));
    println!("{:?}", triple_parsed("z"));
}`,
    tags: ['result', 'question-mark', 'propagation'],
  },
  {
    id: 'rs-ch09-c-017',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Sum Two Parsed Numbers',
    prompt: `Write a function \`add_strings(a: &str, b: &str) -> Result<i32, std::num::ParseIntError>\` that parses both \`a\` and \`b\` as \`i32\` using the \`?\` operator and returns their sum wrapped in \`Ok\`.

In \`main\`, print \`add_strings("3", "4")\` and \`add_strings("3", "x")\` using \`{:?}\`.

Expected output:
Ok(7)
Err(ParseIntError { kind: InvalidDigit })`,
    hints: [
      'Apply \`?\` to each parse call.',
      'If either parse fails, the function returns the error early.',
    ],
    solution: `fn add_strings(a: &str, b: &str) -> Result<i32, std::num::ParseIntError> {
    let x = a.parse::<i32>()?;
    let y = b.parse::<i32>()?;
    Ok(x + y)
}

fn main() {
    println!("{:?}", add_strings("3", "4"));
    println!("{:?}", add_strings("3", "x"));
}`,
    starter: `fn add_strings(a: &str, b: &str) -> Result<i32, std::num::ParseIntError> {
    // TODO: parse both with ? and return their sum
}

fn main() {
    println!("{:?}", add_strings("3", "4"));
    println!("{:?}", add_strings("3", "x"));
}`,
    tags: ['result', 'question-mark', 'parse'],
  },
  {
    id: 'rs-ch09-c-018',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Question Mark on Option',
    prompt: `Write a function \`first_char(s: &str) -> Option<char>\` that returns the first character of \`s\`, using the \`?\` operator on \`s.chars().next()\` and then returning \`Some\` of that char.

In \`main\`, print \`first_char("hi")\` and \`first_char("")\` using \`{:?}\`.

Expected output:
Some('h')
None`,
    hints: [
      '\`s.chars().next()\` returns an \`Option<char>\`.',
      'The \`?\` operator on an \`Option\` returns \`None\` early if the value is \`None\`.',
    ],
    solution: `fn first_char(s: &str) -> Option<char> {
    let c = s.chars().next()?;
    Some(c)
}

fn main() {
    println!("{:?}", first_char("hi"));
    println!("{:?}", first_char(""));
}`,
    starter: `fn first_char(s: &str) -> Option<char> {
    // TODO: use ? on chars().next(), then return Some(c)
}

fn main() {
    println!("{:?}", first_char("hi"));
    println!("{:?}", first_char(""));
}`,
    tags: ['option', 'question-mark'],
  },
  {
    id: 'rs-ch09-c-019',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Last Character via Option Question Mark',
    prompt: `Write a function \`last_upper(s: &str) -> Option<char>\` that uses \`?\` on \`s.chars().last()\` to get the last character, then returns it uppercased as \`Some\`. (Use \`.to_ascii_uppercase()\` on the char.)

In \`main\`, print \`last_upper("rust")\` and \`last_upper("")\` using \`{:?}\`.

Expected output:
Some('T')
None`,
    hints: [
      '\`s.chars().last()\` gives an \`Option<char>\`.',
      'Call \`.to_ascii_uppercase()\` on the unwrapped char before wrapping in \`Some\`.',
    ],
    solution: `fn last_upper(s: &str) -> Option<char> {
    let c = s.chars().last()?;
    Some(c.to_ascii_uppercase())
}

fn main() {
    println!("{:?}", last_upper("rust"));
    println!("{:?}", last_upper(""));
}`,
    starter: `fn last_upper(s: &str) -> Option<char> {
    // TODO: use ? to get last char, then return it uppercased in Some
}

fn main() {
    println!("{:?}", last_upper("rust"));
    println!("{:?}", last_upper(""));
}`,
    tags: ['option', 'question-mark', 'chars'],
  },
  {
    id: 'rs-ch09-c-020',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Index Lookup Returning Option',
    prompt: `Write a function \`nth(v: &[i32], i: usize) -> Option<i32>\` that returns the element at index \`i\` if it exists. Use the slice method \`.get(i)\` with the \`?\` operator, then return \`Some\` of that value (dereference the reference).

In \`main\`, print \`nth(&[5, 6, 7], 1)\` and \`nth(&[5, 6, 7], 9)\` using \`{:?}\`.

Expected output:
Some(6)
None`,
    hints: [
      '\`v.get(i)\` returns \`Option<&i32>\`.',
      'After \`?\` you have a \`&i32\`; dereference it with \`*\` before wrapping in \`Some\`.',
    ],
    solution: `fn nth(v: &[i32], i: usize) -> Option<i32> {
    let value = v.get(i)?;
    Some(*value)
}

fn main() {
    println!("{:?}", nth(&[5, 6, 7], 1));
    println!("{:?}", nth(&[5, 6, 7], 9));
}`,
    starter: `fn nth(v: &[i32], i: usize) -> Option<i32> {
    // TODO: use get(i)? then return Some of the dereferenced value
}

fn main() {
    println!("{:?}", nth(&[5, 6, 7], 1));
    println!("{:?}", nth(&[5, 6, 7], 9));
}`,
    tags: ['option', 'question-mark', 'slices'],
  },
  {
    id: 'rs-ch09-c-021',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Chain Question-Mark Calls',
    prompt: `Write a helper \`parse_one(s: &str) -> Result<i32, std::num::ParseIntError>\` that parses \`s\` with \`?\` and returns \`Ok(n)\`.

Then write \`sum_three(a: &str, b: &str, c: &str) -> Result<i32, std::num::ParseIntError>\` that calls \`parse_one\` three times, each followed by \`?\`, and returns the sum.

In \`main\`, print \`sum_three("1", "2", "3")\` and \`sum_three("1", "two", "3")\` using \`{:?}\`.

Expected output:
Ok(6)
Err(ParseIntError { kind: InvalidDigit })`,
    hints: [
      'Apply \`?\` to the result of each \`parse_one\` call.',
      'Chaining propagation means any failing call short-circuits the whole function.',
    ],
    solution: `fn parse_one(s: &str) -> Result<i32, std::num::ParseIntError> {
    let n = s.parse::<i32>()?;
    Ok(n)
}

fn sum_three(a: &str, b: &str, c: &str) -> Result<i32, std::num::ParseIntError> {
    let x = parse_one(a)?;
    let y = parse_one(b)?;
    let z = parse_one(c)?;
    Ok(x + y + z)
}

fn main() {
    println!("{:?}", sum_three("1", "2", "3"));
    println!("{:?}", sum_three("1", "two", "3"));
}`,
    starter: `fn parse_one(s: &str) -> Result<i32, std::num::ParseIntError> {
    // TODO: parse with ? and return Ok(n)
}

fn sum_three(a: &str, b: &str, c: &str) -> Result<i32, std::num::ParseIntError> {
    // TODO: call parse_one three times with ? and return the sum
}

fn main() {
    println!("{:?}", sum_three("1", "2", "3"));
    println!("{:?}", sum_three("1", "two", "3"));
}`,
    tags: ['result', 'question-mark', 'chaining'],
  },
  {
    id: 'rs-ch09-c-022',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Map a Parse Error to a Custom String',
    prompt: `Write a function \`parse_age(s: &str) -> Result<u32, String>\` that parses \`s\` as a \`u32\`. If parsing fails, convert the error into the \`String\` "invalid age" using \`.map_err(|_| String::from("invalid age"))\` and the \`?\` operator. Return \`Ok(n)\` on success.

In \`main\`, print \`parse_age("30")\` and \`parse_age("old")\` using \`{:?}\`.

Expected output:
Ok(30)
Err("invalid age")`,
    hints: [
      '\`.map_err(...)\` transforms the \`Err\` value before \`?\` propagates it.',
      'The closure ignores the original error with \`|_|\` and produces your \`String\`.',
    ],
    solution: `fn parse_age(s: &str) -> Result<u32, String> {
    let n = s.parse::<u32>().map_err(|_| String::from("invalid age"))?;
    Ok(n)
}

fn main() {
    println!("{:?}", parse_age("30"));
    println!("{:?}", parse_age("old"));
}`,
    starter: `fn parse_age(s: &str) -> Result<u32, String> {
    // TODO: parse u32, map_err to "invalid age", use ?, return Ok(n)
}

fn main() {
    println!("{:?}", parse_age("30"));
    println!("{:?}", parse_age("old"));
}`,
    tags: ['result', 'map_err', 'question-mark'],
  },
  {
    id: 'rs-ch09-c-023',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Unwrap or Else With a Computation',
    prompt: `In \`main\`, parse the string "bad" into an \`i32\`. Use \`.unwrap_or_else(|_| -1)\` so that, on failure, the closure produces \`-1\`. Print the result.

Expected output:
-1`,
    hints: [
      '\`.unwrap_or_else(closure)\` runs the closure only on \`Err\`.',
      'The closure receives the error; ignore it with \`|_|\`.',
    ],
    solution: `fn main() {
    let n: i32 = "bad".parse().unwrap_or_else(|_| -1);
    println!("{}", n);
}`,
    starter: `fn main() {
    // TODO: parse "bad" as i32, falling back to -1 with unwrap_or_else
}`,
    tags: ['result', 'unwrap_or_else'],
  },
  {
    id: 'rs-ch09-c-024',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Main Returning a Result',
    prompt: `Make \`main\` return \`Result<(), std::num::ParseIntError>\`. Inside it, parse the string "123" into an \`i32\` using the \`?\` operator, print the value, then return \`Ok(())\`.

Expected output:
123`,
    hints: [
      'Change the signature to \`fn main() -> Result<(), std::num::ParseIntError>\`.',
      'Because \`main\` returns a \`Result\`, you may use \`?\` directly inside it.',
      'End \`main\` with \`Ok(())\`.',
    ],
    solution: `fn main() -> Result<(), std::num::ParseIntError> {
    let n: i32 = "123".parse()?;
    println!("{}", n);
    Ok(())
}`,
    starter: `fn main() -> Result<(), std::num::ParseIntError> {
    // TODO: parse "123" with ?, print it, then return Ok(())
}`,
    tags: ['result', 'main', 'question-mark'],
  },
  {
    id: 'rs-ch09-c-025',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Main With a Boxed Error',
    prompt: `Make \`main\` return \`Result<(), Box<dyn std::error::Error>>\`. Inside, parse the string "9" into an \`i32\` using \`?\`, print double its value, then return \`Ok(())\`.

The boxed error type lets \`?\` accept any error that implements the \`Error\` trait.

Expected output:
18`,
    hints: [
      'Use \`Box<dyn std::error::Error>\` as the error type in the signature.',
      'The \`?\` operator converts the concrete error into the boxed trait object automatically.',
    ],
    solution: `fn main() -> Result<(), Box<dyn std::error::Error>> {
    let n: i32 = "9".parse()?;
    println!("{}", n * 2);
    Ok(())
}`,
    starter: `fn main() -> Result<(), Box<dyn std::error::Error>> {
    // TODO: parse "9" with ?, print n * 2, then Ok(())
}`,
    tags: ['result', 'main', 'box-dyn-error'],
  },
  {
    id: 'rs-ch09-c-026',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Validate Then Compute',
    prompt: `Write a function \`square_root_step(n: i32) -> Result<i32, String>\` that returns \`Err\` with "negative input" when \`n\` is negative, otherwise returns \`Ok(n * n)\`.

In \`main\`, use a \`match\` on \`square_root_step(6)\` to print "result = 36" on \`Ok\` and the error text on \`Err\`. Then do the same for \`square_root_step(-2)\`.

Expected output:
result = 36
negative input`,
    hints: [
      'Return early with \`Err(String::from("negative input"))\` for negatives.',
      'In \`main\`, match each call and print accordingly.',
    ],
    solution: `fn square_root_step(n: i32) -> Result<i32, String> {
    if n < 0 {
        return Err(String::from("negative input"));
    }
    Ok(n * n)
}

fn report(n: i32) {
    match square_root_step(n) {
        Ok(v) => println!("result = {}", v),
        Err(e) => println!("{}", e),
    }
}

fn main() {
    report(6);
    report(-2);
}`,
    starter: `fn square_root_step(n: i32) -> Result<i32, String> {
    // TODO: Err("negative input") for negatives, else Ok(n * n)
}

fn main() {
    // TODO: match on square_root_step(6) and square_root_step(-2) and print
}`,
    tags: ['result', 'validation', 'match'],
  },
  {
    id: 'rs-ch09-c-027',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Find in a Vector Returning Option',
    prompt: `Write a function \`find_even(v: &[i32]) -> Option<i32>\` that returns the first even number in \`v\`, or \`None\` if there is none. Loop over the slice and \`return Some(x)\` when you find an even value; return \`None\` after the loop.

In \`main\`, print \`find_even(&[1, 3, 4, 5])\` and \`find_even(&[1, 3, 5])\` using \`{:?}\`.

Expected output:
Some(4)
None`,
    hints: [
      'Iterate with \`for &x in v\`.',
      'Test \`x % 2 == 0\` and return \`Some(x)\` on the first match.',
    ],
    solution: `fn find_even(v: &[i32]) -> Option<i32> {
    for &x in v {
        if x % 2 == 0 {
            return Some(x);
        }
    }
    None
}

fn main() {
    println!("{:?}", find_even(&[1, 3, 4, 5]));
    println!("{:?}", find_even(&[1, 3, 5]));
}`,
    starter: `fn find_even(v: &[i32]) -> Option<i32> {
    // TODO: return Some of the first even value, else None
}

fn main() {
    println!("{:?}", find_even(&[1, 3, 4, 5]));
    println!("{:?}", find_even(&[1, 3, 5]));
}`,
    tags: ['option', 'iteration'],
  },
  {
    id: 'rs-ch09-c-028',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Validating Guess Newtype',
    prompt: `Create a struct \`Guess\` holding a private \`value: i32\`. Write an associated function \`Guess::new(value: i32) -> Guess\` that panics with "Guess value must be between 1 and 100, got X" if \`value\` is less than 1 or greater than 100. Add a method \`value(&self) -> i32\` that returns the stored value.

In \`main\`, create \`Guess::new(50)\` and print its \`.value()\`.

Expected output:
50`,
    hints: [
      'Keep the field private so it can only be set through \`new\`.',
      'Panic in \`new\` when the value is out of range, including the value in the message.',
      'The getter \`value\` lets other code read the validated number.',
    ],
    solution: `struct Guess {
    value: i32,
}

impl Guess {
    fn new(value: i32) -> Guess {
        if value < 1 || value > 100 {
            panic!("Guess value must be between 1 and 100, got {}", value);
        }
        Guess { value }
    }

    fn value(&self) -> i32 {
        self.value
    }
}

fn main() {
    let g = Guess::new(50);
    println!("{}", g.value());
}`,
    starter: `struct Guess {
    value: i32,
}

impl Guess {
    fn new(value: i32) -> Guess {
        // TODO: panic if value is out of 1..=100, else construct Guess
    }

    fn value(&self) -> i32 {
        // TODO: return the stored value
    }
}

fn main() {
    let g = Guess::new(50);
    println!("{}", g.value());
}`,
    tags: ['validation', 'newtype', 'panic'],
  },
  {
    id: 'rs-ch09-c-029',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Validating Newtype Returning Result',
    prompt: `Create a struct \`Percent\` with a private \`value: u32\`. Write \`Percent::new(value: u32) -> Result<Percent, String>\` that returns \`Err\` with "out of range" when \`value\` is greater than 100, otherwise \`Ok\` of the \`Percent\`. Add \`value(&self) -> u32\`.

In \`main\`, print the \`.value()\` of \`Percent::new(75).unwrap()\`, then print \`Percent::new(150)\` using \`{:?}\` (it should be an \`Err\`). Note: since \`Percent\` is not \`Debug\`, print only the error message in the failing case by matching.

Make the program print:
75
out of range`,
    hints: [
      'Return \`Err(String::from("out of range"))\` for values above 100.',
      'For the second line, match on \`Percent::new(150)\` and print the message from the \`Err\` arm.',
    ],
    solution: `struct Percent {
    value: u32,
}

impl Percent {
    fn new(value: u32) -> Result<Percent, String> {
        if value > 100 {
            return Err(String::from("out of range"));
        }
        Ok(Percent { value })
    }

    fn value(&self) -> u32 {
        self.value
    }
}

fn main() {
    let p = Percent::new(75).unwrap();
    println!("{}", p.value());

    match Percent::new(150) {
        Ok(p) => println!("{}", p.value()),
        Err(e) => println!("{}", e),
    }
}`,
    starter: `struct Percent {
    value: u32,
}

impl Percent {
    fn new(value: u32) -> Result<Percent, String> {
        // TODO: Err("out of range") if value > 100, else Ok(Percent { value })
    }

    fn value(&self) -> u32 {
        self.value
    }
}

fn main() {
    let p = Percent::new(75).unwrap();
    println!("{}", p.value());

    // TODO: match on Percent::new(150) and print the error message
}`,
    tags: ['validation', 'newtype', 'result'],
  },
  {
    id: 'rs-ch09-c-030',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Parse Then Validate With Question Mark',
    prompt: `Write a function \`parse_in_range(s: &str) -> Result<i32, String>\` that:
1. parses \`s\` as an \`i32\`, mapping any parse error to the \`String\` "not a number" with \`.map_err\` and \`?\`;
2. returns \`Err\` with "out of range" if the number is not between 1 and 10 inclusive;
3. otherwise returns \`Ok\` of the number.

In \`main\`, print \`parse_in_range("7")\`, \`parse_in_range("99")\`, and \`parse_in_range("x")\` using \`{:?}\`.

Expected output:
Ok(7)
Err("out of range")
Err("not a number")`,
    hints: [
      'Use \`.map_err(|_| String::from("not a number"))?\` after \`parse\`.',
      'Then check \`n < 1 || n > 10\` and return the range error.',
    ],
    solution: `fn parse_in_range(s: &str) -> Result<i32, String> {
    let n = s.parse::<i32>().map_err(|_| String::from("not a number"))?;
    if n < 1 || n > 10 {
        return Err(String::from("out of range"));
    }
    Ok(n)
}

fn main() {
    println!("{:?}", parse_in_range("7"));
    println!("{:?}", parse_in_range("99"));
    println!("{:?}", parse_in_range("x"));
}`,
    starter: `fn parse_in_range(s: &str) -> Result<i32, String> {
    // TODO: parse with map_err + ?, then range-check, then Ok(n)
}

fn main() {
    println!("{:?}", parse_in_range("7"));
    println!("{:?}", parse_in_range("99"));
    println!("{:?}", parse_in_range("x"));
}`,
    tags: ['result', 'validation', 'question-mark'],
  },
  {
    id: 'rs-ch09-c-031',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Look Up in a Word List',
    prompt: `Write a function \`lookup(words: &[&str], i: usize) -> Result<String, String>\` that returns \`Ok\` of the word at index \`i\` (as a \`String\`) if it exists, or \`Err\` with "index out of bounds" otherwise. Use \`.get(i)\` and a \`match\`.

In \`main\`, with \`words = ["red", "green", "blue"]\`, print \`lookup(&words, 1)\` and \`lookup(&words, 5)\` using \`{:?}\`.

Expected output:
Ok("green")
Err("index out of bounds")`,
    hints: [
      '\`words.get(i)\` returns \`Option<&&str>\`.',
      'Match \`Some(w)\` to build \`Ok(w.to_string())\`, and \`None\` for the error.',
    ],
    solution: `fn lookup(words: &[&str], i: usize) -> Result<String, String> {
    match words.get(i) {
        Some(w) => Ok(w.to_string()),
        None => Err(String::from("index out of bounds")),
    }
}

fn main() {
    let words = ["red", "green", "blue"];
    println!("{:?}", lookup(&words, 1));
    println!("{:?}", lookup(&words, 5));
}`,
    starter: `fn lookup(words: &[&str], i: usize) -> Result<String, String> {
    // TODO: match on words.get(i), Ok of the word or Err on None
}

fn main() {
    let words = ["red", "green", "blue"];
    println!("{:?}", lookup(&words, 1));
    println!("{:?}", lookup(&words, 5));
}`,
    tags: ['result', 'match', 'slices'],
  },
  {
    id: 'rs-ch09-c-032',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Convert Option to Result',
    prompt: `Write a function \`head(v: &[i32]) -> Result<i32, String>\` that returns the first element of \`v\`. Use \`v.first()\` (an \`Option\`) and convert it to a \`Result\` with \`.ok_or(String::from("empty"))\`, then use \`?\` and return \`Ok\` of the dereferenced value.

In \`main\`, print \`head(&[9, 8, 7])\` and \`head(&[])\` using \`{:?}\`.

Expected output:
Ok(9)
Err("empty")`,
    hints: [
      '\`.ok_or(err)\` turns \`Some(x)\` into \`Ok(x)\` and \`None\` into \`Err(err)\`.',
      'After \`?\` you have a \`&i32\`; dereference with \`*\`.',
    ],
    solution: `fn head(v: &[i32]) -> Result<i32, String> {
    let first = v.first().ok_or(String::from("empty"))?;
    Ok(*first)
}

fn main() {
    println!("{:?}", head(&[9, 8, 7]));
    println!("{:?}", head(&[]));
}`,
    starter: `fn head(v: &[i32]) -> Result<i32, String> {
    // TODO: use first().ok_or(...)? then return Ok of the value
}

fn main() {
    println!("{:?}", head(&[9, 8, 7]));
    println!("{:?}", head(&[]));
}`,
    tags: ['option', 'result', 'ok_or'],
  },
  {
    id: 'rs-ch09-c-033',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Validate a Username',
    prompt: `Write a function \`validate_username(name: &str) -> Result<String, String>\` that returns \`Err\` "too short" if the name has fewer than 3 characters, \`Err\` "too long" if it has more than 12 characters, and otherwise \`Ok\` of the name as a \`String\`.

In \`main\`, print the result of \`validate_username("ed")\`, \`validate_username("alice")\`, and \`validate_username("superlongusername")\` using \`{:?}\`.

Expected output:
Err("too short")
Ok("alice")
Err("too long")`,
    hints: [
      'Use \`name.len()\` for the character count (ASCII names only here).',
      'Order your checks: short first, then long, then the success case.',
    ],
    solution: `fn validate_username(name: &str) -> Result<String, String> {
    if name.len() < 3 {
        return Err(String::from("too short"));
    }
    if name.len() > 12 {
        return Err(String::from("too long"));
    }
    Ok(name.to_string())
}

fn main() {
    println!("{:?}", validate_username("ed"));
    println!("{:?}", validate_username("alice"));
    println!("{:?}", validate_username("superlongusername"));
}`,
    starter: `fn validate_username(name: &str) -> Result<String, String> {
    // TODO: too short / too long checks, else Ok(name.to_string())
}

fn main() {
    println!("{:?}", validate_username("ed"));
    println!("{:?}", validate_username("alice"));
    println!("{:?}", validate_username("superlongusername"));
}`,
    tags: ['result', 'validation'],
  },
  {
    id: 'rs-ch09-c-034',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Choose Panic vs Result',
    prompt: `You are given two helpers to implement, illustrating when to panic and when to return a \`Result\`.

1. \`config_port() -> u16\`: an internal constant the programmer controls. Hardcode 8080 and return it. (A wrong value here would be a programmer bug, but we just return the known-good value.)

2. \`parse_user_port(s: &str) -> Result<u16, String>\`: parses user-supplied input \`s\` as a \`u16\`. Because the input comes from outside, return \`Err\` with "invalid port" on failure rather than panicking. On success return \`Ok\` of the number.

In \`main\`, print \`config_port()\`, then print \`parse_user_port("3000")\` and \`parse_user_port("nope")\` using \`{:?}\`.

Expected output:
8080
Ok(3000)
Err("invalid port")`,
    hints: [
      'Recoverable, externally-caused failures suit \`Result\`; broken internal invariants suit \`panic!\`.',
      'Use \`.map_err(|_| String::from("invalid port"))\` then \`?\` in \`parse_user_port\`.',
    ],
    solution: `fn config_port() -> u16 {
    8080
}

fn parse_user_port(s: &str) -> Result<u16, String> {
    let n = s.parse::<u16>().map_err(|_| String::from("invalid port"))?;
    Ok(n)
}

fn main() {
    println!("{}", config_port());
    println!("{:?}", parse_user_port("3000"));
    println!("{:?}", parse_user_port("nope"));
}`,
    starter: `fn config_port() -> u16 {
    // TODO: return the hardcoded internal port 8080
}

fn parse_user_port(s: &str) -> Result<u16, String> {
    // TODO: parse user input, returning Err("invalid port") on failure
}

fn main() {
    println!("{}", config_port());
    println!("{:?}", parse_user_port("3000"));
    println!("{:?}", parse_user_port("nope"));
}`,
    tags: ['result', 'panic', 'guidelines'],
  },
  {
    id: 'rs-ch09-c-035',
    chapter: 9,
    kind: 'coding',
    difficulty: 'easy',
    title: 'End-to-End Pipeline in Main',
    prompt: `Build a small pipeline that combines validation and propagation.

1. Write \`to_amount(s: &str) -> Result<u32, String>\` that parses \`s\` as a \`u32\` (map errors to "not a number" with \`.map_err\` and \`?\`), and returns \`Err\` "too big" if the value is over 1000, otherwise \`Ok\` of the value.

2. Make \`main\` return \`Result<(), String>\`. Inside, call \`to_amount("250")?\`, print "amount: 250", then return \`Ok(())\`.

Expected output:
amount: 250`,
    hints: [
      'Reuse the map_err-then-? pattern for the parse step.',
      'Because \`main\` returns \`Result<(), String>\`, the \`?\` after \`to_amount(...)\` works directly.',
      'Finish \`main\` with \`Ok(())\`.',
    ],
    solution: `fn to_amount(s: &str) -> Result<u32, String> {
    let n = s.parse::<u32>().map_err(|_| String::from("not a number"))?;
    if n > 1000 {
        return Err(String::from("too big"));
    }
    Ok(n)
}

fn main() -> Result<(), String> {
    let amount = to_amount("250")?;
    println!("amount: {}", amount);
    Ok(())
}`,
    starter: `fn to_amount(s: &str) -> Result<u32, String> {
    // TODO: parse with map_err + ?, reject values over 1000, else Ok(n)
}

fn main() -> Result<(), String> {
    // TODO: call to_amount("250")?, print "amount: 250", then Ok(())
}`,
    tags: ['result', 'question-mark', 'main', 'validation'],
  },
]

export default problems
