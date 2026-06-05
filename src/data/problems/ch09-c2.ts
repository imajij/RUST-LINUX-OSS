import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch09-c-036',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Panic on Empty Input',
    prompt: `Write a function greet(name: &str) that panics with the message "name must not be empty" when name is an empty string, and otherwise prints "Hello, NAME!" (with NAME replaced by the argument). In main, call greet("Ada"). Use the panic! macro for the empty case.`,
    hints: [
      'Check name.is_empty() first.',
      'panic!("...") takes a message just like println!.',
    ],
    solution: `fn greet(name: &str) {
    if name.is_empty() {
        panic!("name must not be empty");
    }
    println!("Hello, {}!", name);
}

fn main() {
    greet("Ada");
}`,
    starter: `fn greet(name: &str) {
    // TODO: panic if name is empty, otherwise greet
}

fn main() {
    greet("Ada");
}`,
    tags: ['panic', 'unrecoverable'],
  },
  {
    id: 'rs-ch09-c-037',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Index a Vector and Trigger a Panic',
    prompt: `In main, create a vector v of i32 with the values 10, 20, 30. Print v at index 1 using println!. Then attempt to access v at index 99 with v[99] and store it in a variable so the program panics at runtime with an out-of-bounds message. The goal is to demonstrate that indexing past the end is an unrecoverable error.`,
    hints: [
      'Indexing with v[i] panics when i is out of range.',
      'Bind the bad access to a variable like let _bad = v[99];',
    ],
    solution: `fn main() {
    let v = vec![10, 20, 30];
    println!("{}", v[1]);
    let _bad = v[99];
    println!("unreachable: {}", _bad);
}`,
    starter: `fn main() {
    let v = vec![10, 20, 30];
    // TODO: print v[1], then trigger an out-of-bounds panic
}`,
    tags: ['panic', 'vectors', 'index'],
  },
  {
    id: 'rs-ch09-c-038',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Return a Result From a Halving Function',
    prompt: `Write a function half(n: i32) -> Result<i32, String>. If n is even, return Ok(n / 2). If n is odd, return Err with the message "cannot halve an odd number". In main, call half(8) and half(7) and use match on each to print either "ok: X" or "err: MESSAGE".`,
    hints: [
      'n % 2 == 0 tests for even.',
      'Return Ok(...) and Err(String::from("...")).',
    ],
    solution: `fn half(n: i32) -> Result<i32, String> {
    if n % 2 == 0 {
        Ok(n / 2)
    } else {
        Err(String::from("cannot halve an odd number"))
    }
}

fn main() {
    for n in [8, 7] {
        match half(n) {
            Ok(v) => println!("ok: {}", v),
            Err(e) => println!("err: {}", e),
        }
    }
}`,
    starter: `fn half(n: i32) -> Result<i32, String> {
    // TODO
}

fn main() {
    // TODO: call half(8) and half(7), match on each
}`,
    tags: ['result', 'match'],
  },
  {
    id: 'rs-ch09-c-039',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Parse With unwrap',
    prompt: `In main, parse the string "256" into a u32 using .parse() and .unwrap(), bind it to a variable, and print "value = 256". Annotate the type so parse knows the target. This shows unwrap returning the inner value on success.`,
    hints: [
      'Use "256".parse::<u32>() or annotate the let binding type.',
      'unwrap() gives the Ok value, or panics on Err.',
    ],
    solution: `fn main() {
    let value: u32 = "256".parse().unwrap();
    println!("value = {}", value);
}`,
    starter: `fn main() {
    // TODO: parse "256" into a u32 with unwrap and print it
}`,
    tags: ['unwrap', 'parse', 'result'],
  },
  {
    id: 'rs-ch09-c-040',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Expect With a Custom Message',
    prompt: `In main, parse the string "not_a_number" into an i32 using .parse() and .expect(...) with the message "config value must be a valid integer". Running this should panic and print that exact message. Use expect rather than unwrap so the panic carries context.`,
    hints: [
      'expect("...") behaves like unwrap but lets you choose the panic message.',
      'Annotate the target type so parse knows what to produce.',
    ],
    solution: `fn main() {
    let n: i32 = "not_a_number"
        .parse()
        .expect("config value must be a valid integer");
    println!("{}", n);
}`,
    starter: `fn main() {
    // TODO: parse "not_a_number" into i32 with expect and a message
}`,
    tags: ['expect', 'parse', 'panic'],
  },
  {
    id: 'rs-ch09-c-041',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Recover From an Error With a Default',
    prompt: `Write a function parse_or_default(s: &str) -> i32 that parses s as an i32. If parsing succeeds, return the parsed value; if it fails, return 0. Use match on the Result of parse(). In main, print parse_or_default("42") and parse_or_default("oops") on separate lines (expected: 42 then 0).`,
    hints: [
      'Match the result: Ok(n) returns n, Err(_) returns 0.',
      'You can ignore the error value with _ in the Err arm.',
    ],
    solution: `fn parse_or_default(s: &str) -> i32 {
    match s.parse::<i32>() {
        Ok(n) => n,
        Err(_) => 0,
    }
}

fn main() {
    println!("{}", parse_or_default("42"));
    println!("{}", parse_or_default("oops"));
}`,
    starter: `fn parse_or_default(s: &str) -> i32 {
    // TODO: match on s.parse::<i32>()
}

fn main() {
    println!("{}", parse_or_default("42"));
    println!("{}", parse_or_default("oops"));
}`,
    tags: ['result', 'match', 'recovery'],
  },
  {
    id: 'rs-ch09-c-042',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Safe Division Returning Result',
    prompt: `Write a function divide(a: f64, b: f64) -> Result<f64, String>. Return Err("division by zero") when b is 0.0, otherwise Ok(a / b). In main, match on divide(10.0, 2.0) and divide(1.0, 0.0), printing "result: X" or "error: MESSAGE" for each.`,
    hints: [
      'Compare b == 0.0 to detect the bad case.',
      'Use match with Ok(v) and Err(e) arms in main.',
    ],
    solution: `fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("division by zero"))
    } else {
        Ok(a / b)
    }
}

fn main() {
    for (a, b) in [(10.0, 2.0), (1.0, 0.0)] {
        match divide(a, b) {
            Ok(v) => println!("result: {}", v),
            Err(e) => println!("error: {}", e),
        }
    }
}`,
    starter: `fn divide(a: f64, b: f64) -> Result<f64, String> {
    // TODO
}

fn main() {
    // TODO: call divide twice and match on each
}`,
    tags: ['result', 'match', 'validation'],
  },
  {
    id: 'rs-ch09-c-043',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'unwrap_or for a Fallback',
    prompt: `In main, parse the string "abc" into an i32. Use the unwrap_or method to supply a fallback of -1 when parsing fails, and print the result (expected: -1). Then do the same with "77" (expected: 77). This shows unwrap_or as a concise alternative to a match.`,
    hints: [
      'result.unwrap_or(fallback) returns the Ok value or the fallback.',
      'Annotate the parse target type so the compiler knows the integer type.',
    ],
    solution: `fn main() {
    let a = "abc".parse::<i32>().unwrap_or(-1);
    let b = "77".parse::<i32>().unwrap_or(-1);
    println!("{}", a);
    println!("{}", b);
}`,
    starter: `fn main() {
    // TODO: use unwrap_or(-1) for "abc" and "77"
}`,
    tags: ['unwrap_or', 'parse', 'result'],
  },
  {
    id: 'rs-ch09-c-044',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Manual Propagation With match',
    prompt: `Write a function double_parsed(s: &str) -> Result<i32, std::num::ParseIntError> that parses s into an i32 and returns Ok of twice that value. Do NOT use the question-mark operator here: use an explicit match on s.parse(), returning the Err early when parsing fails and Ok(n * 2) on success. In main, print the results of double_parsed("21") and double_parsed("x") using match.`,
    hints: [
      'On the Ok branch, return Ok(n * 2).',
      'On the Err branch, return Err(e) to forward the error.',
    ],
    solution: `fn double_parsed(s: &str) -> Result<i32, std::num::ParseIntError> {
    match s.parse::<i32>() {
        Ok(n) => Ok(n * 2),
        Err(e) => Err(e),
    }
}

fn main() {
    match double_parsed("21") {
        Ok(v) => println!("ok: {}", v),
        Err(e) => println!("err: {}", e),
    }
    match double_parsed("x") {
        Ok(v) => println!("ok: {}", v),
        Err(e) => println!("err: {}", e),
    }
}`,
    starter: `fn double_parsed(s: &str) -> Result<i32, std::num::ParseIntError> {
    // TODO: match on s.parse(), forwarding the error manually
}

fn main() {
    // TODO: print results for "21" and "x"
}`,
    tags: ['propagation', 'match', 'result'],
  },
  {
    id: 'rs-ch09-c-045',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Propagate With the Question Mark',
    prompt: `Rewrite a parsing helper using the question-mark operator. Write add_one(s: &str) -> Result<i32, std::num::ParseIntError> that parses s with the ? operator, then returns Ok of the parsed value plus 1. In main, match on add_one("9") and add_one("bad") to print "ok: X" or "err: MESSAGE".`,
    hints: [
      'let n = s.parse::<i32>()?; returns early on Err.',
      'The function must return a Result for ? to be usable.',
    ],
    solution: `fn add_one(s: &str) -> Result<i32, std::num::ParseIntError> {
    let n = s.parse::<i32>()?;
    Ok(n + 1)
}

fn main() {
    match add_one("9") {
        Ok(v) => println!("ok: {}", v),
        Err(e) => println!("err: {}", e),
    }
    match add_one("bad") {
        Ok(v) => println!("ok: {}", v),
        Err(e) => println!("err: {}", e),
    }
}`,
    starter: `fn add_one(s: &str) -> Result<i32, std::num::ParseIntError> {
    // TODO: use ? to parse, then return Ok(n + 1)
}

fn main() {
    // TODO: match on add_one("9") and add_one("bad")
}`,
    tags: ['question-mark', 'propagation', 'result'],
  },
  {
    id: 'rs-ch09-c-046',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sum of Two Parsed Numbers',
    prompt: `Write sum_two(a: &str, b: &str) -> Result<i32, std::num::ParseIntError> that parses both a and b as i32 using the question-mark operator on each, then returns Ok of their sum. In main, print the results of sum_two("3", "4") and sum_two("3", "z") using match (expected: ok 7, then an error).`,
    hints: [
      'Apply ? on each parse call individually.',
      'Both parses share the same ParseIntError error type, so ? works for both.',
    ],
    solution: `fn sum_two(a: &str, b: &str) -> Result<i32, std::num::ParseIntError> {
    let x = a.parse::<i32>()?;
    let y = b.parse::<i32>()?;
    Ok(x + y)
}

fn main() {
    match sum_two("3", "4") {
        Ok(v) => println!("ok: {}", v),
        Err(e) => println!("err: {}", e),
    }
    match sum_two("3", "z") {
        Ok(v) => println!("ok: {}", v),
        Err(e) => println!("err: {}", e),
    }
}`,
    starter: `fn sum_two(a: &str, b: &str) -> Result<i32, std::num::ParseIntError> {
    // TODO: parse both with ?, return Ok(sum)
}

fn main() {
    // TODO: match on two calls
}`,
    tags: ['question-mark', 'propagation', 'parse'],
  },
  {
    id: 'rs-ch09-c-047',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Question Mark on Option',
    prompt: `Write a function first_char_upper(text: &str) -> Option<char> that returns the uppercase version of the first character of text, or None if text is empty. Use the question-mark operator on text.chars().next() to get the first char, then map it to uppercase. In main, print first_char_upper("rust") and first_char_upper("") with debug formatting (expected: Some('R') then None).`,
    hints: [
      'text.chars().next() returns an Option<char>.',
      'c.to_ascii_uppercase() uppercases an ASCII char; wrap the final value in Some(...).',
    ],
    solution: `fn first_char_upper(text: &str) -> Option<char> {
    let c = text.chars().next()?;
    Some(c.to_ascii_uppercase())
}

fn main() {
    println!("{:?}", first_char_upper("rust"));
    println!("{:?}", first_char_upper(""));
}`,
    starter: `fn first_char_upper(text: &str) -> Option<char> {
    // TODO: use ? on the first char, then return Some(uppercase)
}

fn main() {
    println!("{:?}", first_char_upper("rust"));
    println!("{:?}", first_char_upper(""));
}`,
    tags: ['question-mark', 'option'],
  },
  {
    id: 'rs-ch09-c-048',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Last Element of a Slice',
    prompt: `Write a function last_doubled(nums: &[i32]) -> Option<i32> that returns twice the last element of nums, or None if nums is empty. Use the question-mark operator on nums.last() to pull out the final element. In main, print last_doubled(&[1, 2, 5]) and last_doubled(&[]) with debug formatting (expected: Some(10) then None).`,
    hints: [
      'nums.last() returns Option<&i32>.',
      'Dereference the value (it is a reference) before doubling, e.g. let x = *nums.last()?;',
    ],
    solution: `fn last_doubled(nums: &[i32]) -> Option<i32> {
    let x = *nums.last()?;
    Some(x * 2)
}

fn main() {
    println!("{:?}", last_doubled(&[1, 2, 5]));
    println!("{:?}", last_doubled(&[]));
}`,
    starter: `fn last_doubled(nums: &[i32]) -> Option<i32> {
    // TODO: use ? on nums.last(), then return Some(double)
}

fn main() {
    println!("{:?}", last_doubled(&[1, 2, 5]));
    println!("{:?}", last_doubled(&[]));
}`,
    tags: ['question-mark', 'option', 'slices'],
  },
  {
    id: 'rs-ch09-c-049',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Validate Age in Range',
    prompt: `Write a function check_age(age: i32) -> Result<i32, String>. Return Err("age out of range") when age is less than 0 or greater than 150, otherwise Ok(age). In main, loop over the values 25, -3, and 200, and for each print "valid: X" or "invalid: MESSAGE" using match.`,
    hints: [
      'Combine two conditions with || to detect out-of-range values.',
      'Return Ok(age) when the value passes the check.',
    ],
    solution: `fn check_age(age: i32) -> Result<i32, String> {
    if age < 0 || age > 150 {
        Err(String::from("age out of range"))
    } else {
        Ok(age)
    }
}

fn main() {
    for age in [25, -3, 200] {
        match check_age(age) {
            Ok(v) => println!("valid: {}", v),
            Err(e) => println!("invalid: {}", e),
        }
    }
}`,
    starter: `fn check_age(age: i32) -> Result<i32, String> {
    // TODO: reject values outside 0..=150
}

fn main() {
    // TODO: loop over 25, -3, 200 and match
}`,
    tags: ['result', 'validation', 'range'],
  },
  {
    id: 'rs-ch09-c-050',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Chaining Propagation Calls',
    prompt: `Write two functions. parse_num(s: &str) -> Result<i32, std::num::ParseIntError> parses s using the ? operator and returns Ok of the value. triple(s: &str) -> Result<i32, std::num::ParseIntError> calls parse_num(s)? and returns Ok of the value times 3. In main, print the result of triple("5") and triple("nope") using match. This shows ? propagating an error up through a chain of calls.`,
    hints: [
      'triple should call parse_num(s)? to reuse the parsing and propagate the error.',
      'Both functions return the same error type, so ? composes cleanly.',
    ],
    solution: `fn parse_num(s: &str) -> Result<i32, std::num::ParseIntError> {
    let n = s.parse::<i32>()?;
    Ok(n)
}

fn triple(s: &str) -> Result<i32, std::num::ParseIntError> {
    let n = parse_num(s)?;
    Ok(n * 3)
}

fn main() {
    match triple("5") {
        Ok(v) => println!("ok: {}", v),
        Err(e) => println!("err: {}", e),
    }
    match triple("nope") {
        Ok(v) => println!("ok: {}", v),
        Err(e) => println!("err: {}", e),
    }
}`,
    starter: `fn parse_num(s: &str) -> Result<i32, std::num::ParseIntError> {
    // TODO
}

fn triple(s: &str) -> Result<i32, std::num::ParseIntError> {
    // TODO: call parse_num(s)? and triple the value
}

fn main() {
    // TODO: match on triple("5") and triple("nope")
}`,
    tags: ['question-mark', 'propagation', 'chaining'],
  },
  {
    id: 'rs-ch09-c-051',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Map a Parse Error to a String',
    prompt: `Write a function read_port(s: &str) -> Result<u16, String> that parses s into a u16. On success return Ok(port). On failure, convert the parse error into a String using map_err so the returned message is "invalid port: S" (with S replaced by the original input). In main, match on read_port("8080") and read_port("xyz") and print each outcome.`,
    hints: [
      'map_err lets you transform the Err value while leaving Ok untouched.',
      'Use ? after map_err, or match; either way the final type is Result<u16, String>.',
    ],
    solution: `fn read_port(s: &str) -> Result<u16, String> {
    let port = s
        .parse::<u16>()
        .map_err(|_| format!("invalid port: {}", s))?;
    Ok(port)
}

fn main() {
    match read_port("8080") {
        Ok(p) => println!("port: {}", p),
        Err(e) => println!("error: {}", e),
    }
    match read_port("xyz") {
        Ok(p) => println!("port: {}", p),
        Err(e) => println!("error: {}", e),
    }
}`,
    starter: `fn read_port(s: &str) -> Result<u16, String> {
    // TODO: parse to u16, map_err into a String message, return Ok(port)
}

fn main() {
    // TODO: match on read_port("8080") and read_port("xyz")
}`,
    tags: ['map_err', 'result', 'propagation'],
  },
  {
    id: 'rs-ch09-c-052',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Square Root Guard',
    prompt: `Write a function safe_sqrt(x: f64) -> Result<f64, String> that returns Err("cannot take square root of a negative number") when x is negative, and otherwise Ok(x.sqrt()). In main, match on safe_sqrt(9.0) and safe_sqrt(-4.0), printing "sqrt: X" or "error: MESSAGE".`,
    hints: [
      'Test x < 0.0 to detect the invalid input.',
      'The sqrt method is available on f64 directly: x.sqrt().',
    ],
    solution: `fn safe_sqrt(x: f64) -> Result<f64, String> {
    if x < 0.0 {
        Err(String::from("cannot take square root of a negative number"))
    } else {
        Ok(x.sqrt())
    }
}

fn main() {
    for x in [9.0, -4.0] {
        match safe_sqrt(x) {
            Ok(v) => println!("sqrt: {}", v),
            Err(e) => println!("error: {}", e),
        }
    }
}`,
    starter: `fn safe_sqrt(x: f64) -> Result<f64, String> {
    // TODO: reject negatives, otherwise return Ok(x.sqrt())
}

fn main() {
    // TODO: call safe_sqrt(9.0) and safe_sqrt(-4.0), match on each
}`,
    tags: ['result', 'validation', 'match'],
  },
  {
    id: 'rs-ch09-c-053',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Lookup in a Vector by Key',
    prompt: `You have a vector of (String, i32) pairs. Write a function find_score(records: &[(String, i32)], name: &str) -> Option<i32> that returns the score for the matching name, or None. Use a loop and return Some(score) when a name matches. In main, build a small vector with ("alice", 90) and ("bob", 75), then print find_score for "bob" and for "carol" using debug formatting (expected: Some(75) then None).`,
    hints: [
      'Iterate with for (n, s) in records to destructure each tuple.',
      'Compare n == name; remember n is a &String, which compares with a &str fine.',
    ],
    solution: `fn find_score(records: &[(String, i32)], name: &str) -> Option<i32> {
    for (n, s) in records {
        if n == name {
            return Some(*s);
        }
    }
    None
}

fn main() {
    let records = vec![
        (String::from("alice"), 90),
        (String::from("bob"), 75),
    ];
    println!("{:?}", find_score(&records, "bob"));
    println!("{:?}", find_score(&records, "carol"));
}`,
    starter: `fn find_score(records: &[(String, i32)], name: &str) -> Option<i32> {
    // TODO: loop and return Some(score) on a match, else None
}

fn main() {
    let records = vec![
        (String::from("alice"), 90),
        (String::from("bob"), 75),
    ];
    println!("{:?}", find_score(&records, "bob"));
    println!("{:?}", find_score(&records, "carol"));
}`,
    tags: ['option', 'lookup', 'loops'],
  },
  {
    id: 'rs-ch09-c-054',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Percentage Newtype',
    prompt: `Create a struct Percentage that wraps a single i32 field (keep the field private to the module by not making it pub). Add an associated function new(value: i32) -> Result<Percentage, String> that returns Err("percentage must be between 0 and 100") for any value outside 0 to 100 inclusive, and Ok(Percentage { value }) otherwise. Add a method value(&self) -> i32 returning the stored value. In main, match on Percentage::new(50) and Percentage::new(150), printing the value or the error.`,
    hints: [
      'Validate inside new before constructing the struct.',
      'A getter method is needed because the field is private.',
    ],
    solution: `struct Percentage {
    value: i32,
}

impl Percentage {
    fn new(value: i32) -> Result<Percentage, String> {
        if value < 0 || value > 100 {
            return Err(String::from("percentage must be between 0 and 100"));
        }
        Ok(Percentage { value })
    }

    fn value(&self) -> i32 {
        self.value
    }
}

fn main() {
    match Percentage::new(50) {
        Ok(p) => println!("value: {}", p.value()),
        Err(e) => println!("error: {}", e),
    }
    match Percentage::new(150) {
        Ok(p) => println!("value: {}", p.value()),
        Err(e) => println!("error: {}", e),
    }
}`,
    starter: `struct Percentage {
    value: i32,
}

impl Percentage {
    // TODO: new(value: i32) -> Result<Percentage, String>
    // TODO: value(&self) -> i32
}

fn main() {
    // TODO: match on Percentage::new(50) and Percentage::new(150)
}`,
    tags: ['newtype', 'validation', 'result'],
  },
  {
    id: 'rs-ch09-c-055',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'ok_or to Convert Option to Result',
    prompt: `Write a function first_word(text: &str) -> Result<String, String> that returns the first whitespace-separated word of text. Use text.split_whitespace().next() to get an Option, then convert it with .ok_or(...) into a Result whose Err is "no words found", and finally return Ok of the word as a String. In main, match on first_word("hello world") and first_word("   ") and print the outcome.`,
    hints: [
      'ok_or turns Some(v) into Ok(v) and None into Err(the supplied value).',
      'Use ? after ok_or so the function returns early on the None case.',
    ],
    solution: `fn first_word(text: &str) -> Result<String, String> {
    let word = text
        .split_whitespace()
        .next()
        .ok_or(String::from("no words found"))?;
    Ok(word.to_string())
}

fn main() {
    match first_word("hello world") {
        Ok(w) => println!("word: {}", w),
        Err(e) => println!("error: {}", e),
    }
    match first_word("   ") {
        Ok(w) => println!("word: {}", w),
        Err(e) => println!("error: {}", e),
    }
}`,
    starter: `fn first_word(text: &str) -> Result<String, String> {
    // TODO: get the first word as an Option, convert with ok_or, return Ok(word)
}

fn main() {
    // TODO: match on first_word("hello world") and first_word("   ")
}`,
    tags: ['ok_or', 'option', 'result'],
  },
  {
    id: 'rs-ch09-c-056',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count Successful Parses',
    prompt: `Write a function count_valid(items: &[&str]) -> usize that returns how many of the strings in items parse successfully as i32. Loop over items, call parse, and count the Ok results using match or is_ok(). In main, call count_valid with ["10", "x", "20", "3.5", "-7"] and print the count (expected: 3).`,
    hints: [
      's.parse::<i32>().is_ok() is true when parsing succeeds.',
      'Keep a mutable counter and increment it on success.',
    ],
    solution: `fn count_valid(items: &[&str]) -> usize {
    let mut count = 0;
    for s in items {
        if s.parse::<i32>().is_ok() {
            count += 1;
        }
    }
    count
}

fn main() {
    let data = ["10", "x", "20", "3.5", "-7"];
    println!("{}", count_valid(&data));
}`,
    starter: `fn count_valid(items: &[&str]) -> usize {
    // TODO: count how many items parse as i32
}

fn main() {
    let data = ["10", "x", "20", "3.5", "-7"];
    println!("{}", count_valid(&data));
}`,
    tags: ['result', 'is_ok', 'loops'],
  },
  {
    id: 'rs-ch09-c-057',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Nonempty Username Newtype',
    prompt: `Create a struct Username wrapping a String. Add new(name: String) -> Result<Username, String> that returns Err("username cannot be empty") for an empty string and otherwise Ok(Username { name }). Add a method as_str(&self) -> &str returning the inner name. In main, match on Username::new(String::from("ferris")) and Username::new(String::from("")), printing the name or the error.`,
    hints: [
      'Check name.is_empty() before constructing.',
      'as_str can return &self.name, which coerces from &String to &str.',
    ],
    solution: `struct Username {
    name: String,
}

impl Username {
    fn new(name: String) -> Result<Username, String> {
        if name.is_empty() {
            return Err(String::from("username cannot be empty"));
        }
        Ok(Username { name })
    }

    fn as_str(&self) -> &str {
        &self.name
    }
}

fn main() {
    match Username::new(String::from("ferris")) {
        Ok(u) => println!("name: {}", u.as_str()),
        Err(e) => println!("error: {}", e),
    }
    match Username::new(String::from("")) {
        Ok(u) => println!("name: {}", u.as_str()),
        Err(e) => println!("error: {}", e),
    }
}`,
    starter: `struct Username {
    name: String,
}

impl Username {
    // TODO: new(name: String) -> Result<Username, String>
    // TODO: as_str(&self) -> &str
}

fn main() {
    // TODO: match on two Username::new calls
}`,
    tags: ['newtype', 'validation', 'result'],
  },
  {
    id: 'rs-ch09-c-058',
    chapter: 9,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Choose Panic vs Result',
    prompt: `Implement two functions that show when to panic versus when to return a Result.
1. checked_subtract(a: u32, b: u32) -> Result<u32, String>: this handles untrusted input, so return Err("would underflow") when b > a, else Ok(a - b).
2. internal_index(arr: &[i32], i: usize) -> i32: this expects a programmer-guaranteed valid index, so it may panic; use arr[i] directly with no checking.
In main, print the result of checked_subtract(3, 5) via match, and print internal_index(&[1, 2, 3], 0).`,
    hints: [
      'Untrusted or recoverable failures suit Result; broken invariants suit a panic.',
      'For internal_index, arr[i] already panics on a bad index, which is acceptable here.',
    ],
    solution: `fn checked_subtract(a: u32, b: u32) -> Result<u32, String> {
    if b > a {
        Err(String::from("would underflow"))
    } else {
        Ok(a - b)
    }
}

fn internal_index(arr: &[i32], i: usize) -> i32 {
    arr[i]
}

fn main() {
    match checked_subtract(3, 5) {
        Ok(v) => println!("ok: {}", v),
        Err(e) => println!("err: {}", e),
    }
    println!("{}", internal_index(&[1, 2, 3], 0));
}`,
    starter: `fn checked_subtract(a: u32, b: u32) -> Result<u32, String> {
    // TODO: recoverable error path
}

fn internal_index(arr: &[i32], i: usize) -> i32 {
    // TODO: trust the caller; indexing may panic
}

fn main() {
    // TODO: demonstrate both functions
}`,
    tags: ['panic', 'result', 'guidelines'],
  },
  {
    id: 'rs-ch09-c-059',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'main Returning a Result',
    prompt: `Write a program whose main has the signature fn main() -> Result<(), Box<dyn std::error::Error>>. Inside main, parse the string "123" into an i32 using the ? operator (its error must propagate through the boxed error type), print "parsed: 123", then return Ok(()). Because main returns a Result, the ? operator is allowed directly in main.`,
    hints: [
      'The return type Box<dyn std::error::Error> can hold any error type.',
      'End main with Ok(()) after the work succeeds.',
    ],
    solution: `fn main() -> Result<(), Box<dyn std::error::Error>> {
    let n: i32 = "123".parse()?;
    println!("parsed: {}", n);
    Ok(())
}`,
    starter: `fn main() -> Result<(), Box<dyn std::error::Error>> {
    // TODO: parse "123" with ?, print it, then return Ok(())
}`,
    tags: ['main-result', 'question-mark', 'boxed-error'],
  },
  {
    id: 'rs-ch09-c-060',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'main Result With a Failing Parse',
    prompt: `Write fn main() -> Result<(), Box<dyn std::error::Error>>. Parse the string "12x" into an i32 using the ? operator. Because the parse fails, the ? operator should make main return the error early, and the program will print a Debug representation of the error and exit with a nonzero status. If parsing somehow succeeded, print "ok". Then return Ok(()).`,
    hints: [
      'The ? operator on a failing parse returns the boxed error from main automatically.',
      'You do not need to manually print the error; returning it from main does that.',
    ],
    solution: `fn main() -> Result<(), Box<dyn std::error::Error>> {
    let n: i32 = "12x".parse()?;
    println!("ok: {}", n);
    Ok(())
}`,
    starter: `fn main() -> Result<(), Box<dyn std::error::Error>> {
    // TODO: parse "12x" with ?, which will propagate the error out of main
}`,
    tags: ['main-result', 'question-mark', 'boxed-error'],
  },
  {
    id: 'rs-ch09-c-061',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Sum All Lines or Fail',
    prompt: `Write a function sum_lines(text: &str) -> Result<i32, std::num::ParseIntError>. The text contains one integer per line. Split text by lines, parse each line with the ? operator, and accumulate the total, returning Ok(total). If any line fails to parse, the error propagates out. In main, match on sum_lines("1\\n2\\n3") and sum_lines("1\\nx\\n3") and print "total: N" or "error: MESSAGE".`,
    hints: [
      'Use text.lines() to iterate over each line.',
      'Inside the loop, let n = line.parse::<i32>()?; then add to a running sum.',
    ],
    solution: `fn sum_lines(text: &str) -> Result<i32, std::num::ParseIntError> {
    let mut total = 0;
    for line in text.lines() {
        let n = line.parse::<i32>()?;
        total += n;
    }
    Ok(total)
}

fn main() {
    match sum_lines("1\\n2\\n3") {
        Ok(t) => println!("total: {}", t),
        Err(e) => println!("error: {}", e),
    }
    match sum_lines("1\\nx\\n3") {
        Ok(t) => println!("total: {}", t),
        Err(e) => println!("error: {}", e),
    }
}`,
    starter: `fn sum_lines(text: &str) -> Result<i32, std::num::ParseIntError> {
    // TODO: parse each line with ?, accumulate, return Ok(total)
}

fn main() {
    // TODO: match on two calls
}`,
    tags: ['question-mark', 'propagation', 'parse'],
  },
  {
    id: 'rs-ch09-c-062',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Custom Error Enum for Withdrawals',
    prompt: `Define an enum BankError with two variants: InsufficientFunds and InvalidAmount. Write withdraw(balance: u32, amount: u32) -> Result<u32, BankError> that returns Err(BankError::InvalidAmount) when amount is 0, Err(BankError::InsufficientFunds) when amount exceeds balance, and otherwise Ok(balance - amount). In main, call withdraw for (100, 30), (100, 0), and (100, 250), matching on each result. Print "new balance: N" on success and print a distinct message for each error variant.`,
    hints: [
      'Define the enum with two plain (data-less) variants.',
      'Match on the BankError variants to print a different message per case.',
    ],
    solution: `enum BankError {
    InsufficientFunds,
    InvalidAmount,
}

fn withdraw(balance: u32, amount: u32) -> Result<u32, BankError> {
    if amount == 0 {
        return Err(BankError::InvalidAmount);
    }
    if amount > balance {
        return Err(BankError::InsufficientFunds);
    }
    Ok(balance - amount)
}

fn main() {
    for (b, a) in [(100, 30), (100, 0), (100, 250)] {
        match withdraw(b, a) {
            Ok(new_balance) => println!("new balance: {}", new_balance),
            Err(BankError::InvalidAmount) => println!("error: amount must be positive"),
            Err(BankError::InsufficientFunds) => println!("error: not enough funds"),
        }
    }
}`,
    starter: `enum BankError {
    // TODO: two variants
}

fn withdraw(balance: u32, amount: u32) -> Result<u32, BankError> {
    // TODO
}

fn main() {
    // TODO: call withdraw three times and match per variant
}`,
    tags: ['result', 'enum', 'custom-error'],
  },
  {
    id: 'rs-ch09-c-063',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Validated Even Number Newtype',
    prompt: `Create a struct EvenNumber wrapping an i32. Add new(value: i32) -> Result<EvenNumber, String> that returns Err("value must be even") for odd numbers and Ok(EvenNumber { value }) for even numbers. Add a method get(&self) -> i32 and a method doubled(&self) -> i32 that returns the wrapped value times 2. In main, build EvenNumber::new(8) with match, print its get() and doubled(), and also show the error from EvenNumber::new(5).`,
    hints: [
      'value % 2 != 0 detects odd numbers.',
      'doubled can call self.get() or read self.value directly.',
    ],
    solution: `struct EvenNumber {
    value: i32,
}

impl EvenNumber {
    fn new(value: i32) -> Result<EvenNumber, String> {
        if value % 2 != 0 {
            return Err(String::from("value must be even"));
        }
        Ok(EvenNumber { value })
    }

    fn get(&self) -> i32 {
        self.value
    }

    fn doubled(&self) -> i32 {
        self.value * 2
    }
}

fn main() {
    match EvenNumber::new(8) {
        Ok(e) => println!("get: {}, doubled: {}", e.get(), e.doubled()),
        Err(msg) => println!("error: {}", msg),
    }
    match EvenNumber::new(5) {
        Ok(e) => println!("get: {}", e.get()),
        Err(msg) => println!("error: {}", msg),
    }
}`,
    starter: `struct EvenNumber {
    value: i32,
}

impl EvenNumber {
    // TODO: new(value: i32) -> Result<EvenNumber, String>
    // TODO: get(&self) -> i32
    // TODO: doubled(&self) -> i32
}

fn main() {
    // TODO: match on EvenNumber::new(8) and EvenNumber::new(5)
}`,
    tags: ['newtype', 'validation', 'methods'],
  },
  {
    id: 'rs-ch09-c-064',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Parse a Key-Value Pair',
    prompt: `Write a function parse_pair(s: &str) -> Result<(String, i32), String> that parses a string like "age=30" into a (key, value) tuple. Steps: find the '=' using s.split('='), get exactly two parts. If there are not two parts, return Err("expected key=value"). Parse the second part as i32; on failure return Err("value is not an integer"). Return Ok((key.to_string(), value)). In main, match on parse_pair("age=30"), parse_pair("age"), and parse_pair("age=x") and print each outcome.`,
    hints: [
      'Collect the result of s.split on the equals sign into a Vec and check its length is 2.',
      'Convert the inner parse error with map_err or match it into the required String message.',
    ],
    solution: `fn parse_pair(s: &str) -> Result<(String, i32), String> {
    let parts: Vec<&str> = s.split('=').collect();
    if parts.len() != 2 {
        return Err(String::from("expected key=value"));
    }
    let key = parts[0].to_string();
    let value = parts[1]
        .parse::<i32>()
        .map_err(|_| String::from("value is not an integer"))?;
    Ok((key, value))
}

fn main() {
    for s in ["age=30", "age", "age=x"] {
        match parse_pair(s) {
            Ok((k, v)) => println!("ok: {} -> {}", k, v),
            Err(e) => println!("err: {}", e),
        }
    }
}`,
    starter: `fn parse_pair(s: &str) -> Result<(String, i32), String> {
    // TODO: split on '=', validate two parts, parse the value
}

fn main() {
    // TODO: match on "age=30", "age", "age=x"
}`,
    tags: ['result', 'parse', 'map_err'],
  },
  {
    id: 'rs-ch09-c-065',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Average of Parsed Values',
    prompt: `Write a function average(inputs: &[&str]) -> Result<f64, String>. Return Err("no inputs") when inputs is empty. Otherwise parse every string as f64; if any fails, return Err("invalid number: S") where S is the offending string. When all parse, return Ok of the arithmetic mean. In main, match on average(&["2", "4", "6"]) and average(&["2", "bad"]) and average(&[]), printing the result or the error.`,
    hints: [
      'Handle the empty case before the loop.',
      'Use map_err with format! to embed the failing string in the message, then ?.',
    ],
    solution: `fn average(inputs: &[&str]) -> Result<f64, String> {
    if inputs.is_empty() {
        return Err(String::from("no inputs"));
    }
    let mut total = 0.0;
    for s in inputs {
        let n = s
            .parse::<f64>()
            .map_err(|_| format!("invalid number: {}", s))?;
        total += n;
    }
    Ok(total / inputs.len() as f64)
}

fn main() {
    match average(&["2", "4", "6"]) {
        Ok(a) => println!("avg: {}", a),
        Err(e) => println!("error: {}", e),
    }
    match average(&["2", "bad"]) {
        Ok(a) => println!("avg: {}", a),
        Err(e) => println!("error: {}", e),
    }
    match average(&[]) {
        Ok(a) => println!("avg: {}", a),
        Err(e) => println!("error: {}", e),
    }
}`,
    starter: `fn average(inputs: &[&str]) -> Result<f64, String> {
    // TODO: reject empty, parse each f64, return Ok(mean)
}

fn main() {
    // TODO: match on three calls
}`,
    tags: ['result', 'propagation', 'map_err'],
  },
  {
    id: 'rs-ch09-c-066',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Chained Option Lookups',
    prompt: `You have a vector of (String, Vec<i32>) pairs mapping a name to a list of scores. Write best_score(data: &[(String, Vec<i32>)], name: &str) -> Option<i32> that finds the entry for name and returns the maximum of its scores, returning None if the name is missing OR the score list is empty. Use the ? operator twice: once to get the matching entry (helper returning Option), and once on scores.iter().max(). In main, build data with ("alice", vec![3, 9, 5]) and ("bob", vec![]) and print best_score for "alice", "bob", and "carol" with debug formatting (expected: Some(9), None, None).`,
    hints: [
      'Write a small helper find_entry that returns Option<&Vec<i32>>, then use ? on it.',
      'scores.iter().max() returns Option<&i32>; apply ? and dereference.',
    ],
    solution: `fn find_scores<'a>(data: &'a [(String, Vec<i32>)], name: &str) -> Option<&'a Vec<i32>> {
    for (n, scores) in data {
        if n == name {
            return Some(scores);
        }
    }
    None
}

fn best_score(data: &[(String, Vec<i32>)], name: &str) -> Option<i32> {
    let scores = find_scores(data, name)?;
    let best = scores.iter().max()?;
    Some(*best)
}

fn main() {
    let data = vec![
        (String::from("alice"), vec![3, 9, 5]),
        (String::from("bob"), vec![]),
    ];
    println!("{:?}", best_score(&data, "alice"));
    println!("{:?}", best_score(&data, "bob"));
    println!("{:?}", best_score(&data, "carol"));
}`,
    starter: `fn find_scores<'a>(data: &'a [(String, Vec<i32>)], name: &str) -> Option<&'a Vec<i32>> {
    // TODO: return Some(scores) on a name match, else None
}

fn best_score(data: &[(String, Vec<i32>)], name: &str) -> Option<i32> {
    // TODO: use ? twice to get the entry and its max
}

fn main() {
    let data = vec![
        (String::from("alice"), vec![3, 9, 5]),
        (String::from("bob"), vec![]),
    ];
    println!("{:?}", best_score(&data, "alice"));
    println!("{:?}", best_score(&data, "bob"));
    println!("{:?}", best_score(&data, "carol"));
}`,
    tags: ['question-mark', 'option', 'chaining'],
  },
  {
    id: 'rs-ch09-c-067',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Temperature Newtype With Conversion',
    prompt: `Create a struct Celsius wrapping an f64. Add new(value: f64) -> Result<Celsius, String> that rejects temperatures below absolute zero (-273.15) with Err("below absolute zero"). Add a method to_fahrenheit(&self) -> f64 computing value * 9.0 / 5.0 + 32.0. In main, match on Celsius::new(100.0) and print its Fahrenheit value, then show the error from Celsius::new(-300.0).`,
    hints: [
      'Validate value < -273.15 in new.',
      'Store the field and read it in to_fahrenheit via self.',
    ],
    solution: `struct Celsius {
    value: f64,
}

impl Celsius {
    fn new(value: f64) -> Result<Celsius, String> {
        if value < -273.15 {
            return Err(String::from("below absolute zero"));
        }
        Ok(Celsius { value })
    }

    fn to_fahrenheit(&self) -> f64 {
        self.value * 9.0 / 5.0 + 32.0
    }
}

fn main() {
    match Celsius::new(100.0) {
        Ok(c) => println!("fahrenheit: {}", c.to_fahrenheit()),
        Err(e) => println!("error: {}", e),
    }
    match Celsius::new(-300.0) {
        Ok(c) => println!("fahrenheit: {}", c.to_fahrenheit()),
        Err(e) => println!("error: {}", e),
    }
}`,
    starter: `struct Celsius {
    value: f64,
}

impl Celsius {
    // TODO: new(value: f64) -> Result<Celsius, String>
    // TODO: to_fahrenheit(&self) -> f64
}

fn main() {
    // TODO: match on Celsius::new(100.0) and Celsius::new(-300.0)
}`,
    tags: ['newtype', 'validation', 'methods'],
  },
  {
    id: 'rs-ch09-c-068',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Validate and Sum a CSV Row',
    prompt: `Write a function row_total(row: &str) -> Result<i32, String> that takes a comma-separated string of integers like "4,8,15" and returns Ok of their sum. Split on ',', and for each field, trim it and parse to i32. If any field fails to parse, return Err("bad field: F") where F is the trimmed offending field. If the row is empty (no fields after trimming), still sum to 0 normally. In main, match on row_total("4,8,15"), row_total("1, 2 ,3"), and row_total("1,x,3") and print each result.`,
    hints: [
      'Use row.split(",") and field.trim() before parsing.',
      'Build the error message with format! inside map_err, then apply ?.',
    ],
    solution: `fn row_total(row: &str) -> Result<i32, String> {
    let mut total = 0;
    for raw in row.split(',') {
        let field = raw.trim();
        let n = field
            .parse::<i32>()
            .map_err(|_| format!("bad field: {}", field))?;
        total += n;
    }
    Ok(total)
}

fn main() {
    for row in ["4,8,15", "1, 2 ,3", "1,x,3"] {
        match row_total(row) {
            Ok(t) => println!("total: {}", t),
            Err(e) => println!("error: {}", e),
        }
    }
}`,
    starter: `fn row_total(row: &str) -> Result<i32, String> {
    // TODO: split on ',', trim and parse each field, return Ok(sum)
}

fn main() {
    // TODO: match on three rows
}`,
    tags: ['result', 'propagation', 'parse'],
  },
  {
    id: 'rs-ch09-c-069',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Guessing-Game Style Guess Newtype',
    prompt: `Following the validation pattern from the book, create a struct Guess wrapping an i32. Add new(value: i32) -> Guess that PANICS (using panic!) with the message "Guess value must be between 1 and 100, got VALUE" when value is outside 1 to 100 inclusive, and otherwise returns Guess { value }. Add a method value(&self) -> i32. In main, create Guess::new(50), print its value(), and write a comment-free line that would panic if uncommented; instead just demonstrate the valid path by also creating Guess::new(1) and printing its value.`,
    hints: [
      'This newtype enforces its invariant by panicking, which is appropriate for a programming-contract violation.',
      'Use panic! with a formatted message that includes the offending value.',
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
    let g2 = Guess::new(1);
    println!("{}", g2.value());
}`,
    starter: `struct Guess {
    value: i32,
}

impl Guess {
    // TODO: new(value: i32) -> Guess that panics when out of 1..=100
    // TODO: value(&self) -> i32
}

fn main() {
    // TODO: create Guess::new(50) and Guess::new(1), print each value
}`,
    tags: ['newtype', 'panic', 'validation'],
  },
  {
    id: 'rs-ch09-c-070',
    chapter: 9,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Pipeline With main Returning Result',
    prompt: `Build a small pipeline. Write a helper parse_positive(s: &str) -> Result<u32, String> that parses s as u32 (map any parse failure to Err("not a number: S")) and then returns Err("must be positive") if the value is 0, else Ok(value). Then write fn main() -> Result<(), Box<dyn std::error::Error>> that uses the ? operator to call parse_positive("12"), prints "first: 12", calls parse_positive("8"), prints "second: 8", prints their product "product: 96", and returns Ok(()). Note that a Result<_, String> works with ? in this main because String converts into a boxed error.`,
    hints: [
      'Use map_err with format! to turn the parse error into your String message, then check for 0.',
      'In main, let a = parse_positive("12")?; the ? converts String into the boxed error.',
    ],
    solution: `fn parse_positive(s: &str) -> Result<u32, String> {
    let value = s
        .parse::<u32>()
        .map_err(|_| format!("not a number: {}", s))?;
    if value == 0 {
        return Err(String::from("must be positive"));
    }
    Ok(value)
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let a = parse_positive("12")?;
    println!("first: {}", a);
    let b = parse_positive("8")?;
    println!("second: {}", b);
    println!("product: {}", a * b);
    Ok(())
}`,
    starter: `fn parse_positive(s: &str) -> Result<u32, String> {
    // TODO: parse to u32 (map_err), reject 0, return Ok(value)
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // TODO: use ? to call parse_positive twice, print values and product
}`,
    tags: ['main-result', 'question-mark', 'boxed-error'],
  },
]

export default problems
