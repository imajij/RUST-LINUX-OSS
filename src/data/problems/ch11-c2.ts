import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch11-c-036',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Test add_two With assert_eq!',
    prompt: `Write a function \`add_two(a: i32) -> i32\` that returns its argument plus 2.

Then write a unit test named \`adds_two\` (marked with \`#[test]\`) that asserts \`add_two(2)\` equals \`4\` using the \`assert_eq!\` macro.

Put the test inside a \`#[cfg(test)] mod tests\` block that brings the outer items into scope with \`use super::*;\`.`,
    hints: [
      'A test function takes no arguments and is annotated with #[test].',
      'assert_eq! takes two values and panics if they are not equal.',
      'Inside the tests module, write use super::*; to reach add_two.',
    ],
    solution: `pub fn add_two(a: i32) -> i32 {
    a + 2
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn adds_two() {
        assert_eq!(add_two(2), 4);
    }
}`,
    starter: `pub fn add_two(a: i32) -> i32 {
    // TODO: return a + 2
    a
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn adds_two() {
        // TODO: assert add_two(2) == 4
    }
}`,
    tags: ['testing', 'assert_eq', 'cfg-test'],
  },
  {
    id: 'rs-ch11-c-037',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Assert a Boolean Condition',
    prompt: `Define a struct \`Rectangle\` with fields \`width: u32\` and \`height: u32\`, and a method \`can_hold(&self, other: &Rectangle) -> bool\` that returns true when \`self\` is strictly larger than \`other\` in both width and height.

Write a test named \`larger_can_hold_smaller\` that builds a larger and a smaller rectangle and uses \`assert!\` (the boolean form, not assert_eq!) to verify the larger one can hold the smaller one.`,
    hints: [
      'can_hold returns self.width > other.width && self.height > other.height.',
      'assert! takes a single boolean expression and panics when it is false.',
    ],
    solution: `#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn larger_can_hold_smaller() {
        let larger = Rectangle { width: 8, height: 7 };
        let smaller = Rectangle { width: 5, height: 1 };
        assert!(larger.can_hold(&smaller));
    }
}`,
    starter: `#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn can_hold(&self, other: &Rectangle) -> bool {
        // TODO
        false
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn larger_can_hold_smaller() {
        // TODO
    }
}`,
    tags: ['testing', 'assert', 'methods'],
  },
  {
    id: 'rs-ch11-c-038',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Failing Negative Test',
    prompt: `Reuse the \`Rectangle\` type with \`can_hold\`. This time write a test named \`smaller_cannot_hold_larger\` that builds a small and a large rectangle and asserts that the SMALLER one CANNOT hold the larger one.

Use \`assert!\` with a negated condition so the test passes when \`can_hold\` returns false.`,
    hints: [
      'Negate the call with the ! operator: assert!(!smaller.can_hold(&larger));',
      'The test passes only if the boolean inside assert! is true.',
    ],
    solution: `#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn smaller_cannot_hold_larger() {
        let larger = Rectangle { width: 8, height: 7 };
        let smaller = Rectangle { width: 5, height: 1 };
        assert!(!smaller.can_hold(&larger));
    }
}`,
    starter: `#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn smaller_cannot_hold_larger() {
        // TODO: assert the smaller rectangle cannot hold the larger
    }
}`,
    tags: ['testing', 'assert', 'negation'],
  },
  {
    id: 'rs-ch11-c-039',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Greeting With a Custom Message',
    prompt: `Write a function \`greeting(name: &str) -> String\` that returns a string of the form \`Hello name!\` (with the name inserted).

Write a test named \`greeting_contains_name\` that calls \`greeting("Carol")\` and uses \`assert!\` with the \`contains\` method to check the result contains \`"Carol"\`. Provide a CUSTOM failure message that prints the actual greeting value, for example: \`Greeting did not contain name, value was 'the result'\`.`,
    hints: [
      'String has a contains method: result.contains("Carol").',
      'assert! accepts extra arguments that work like format! for the failure message.',
      'Pass the result value into the message with a {} placeholder.',
    ],
    solution: `pub fn greeting(name: &str) -> String {
    format!("Hello {name}!")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn greeting_contains_name() {
        let result = greeting("Carol");
        assert!(
            result.contains("Carol"),
            "Greeting did not contain name, value was '{result}'"
        );
    }
}`,
    starter: `pub fn greeting(name: &str) -> String {
    // TODO: return "Hello <name>!"
    String::new()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn greeting_contains_name() {
        let result = greeting("Carol");
        // TODO: assert it contains "Carol" with a custom message
    }
}`,
    tags: ['testing', 'assert', 'custom-message'],
  },
  {
    id: 'rs-ch11-c-040',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Assert Inequality With assert_ne!',
    prompt: `Write a function \`add_two(a: i32) -> i32\` returning \`a + 2\`.

Write a test named \`result_is_not_input\` that asserts the result of \`add_two(3)\` is NOT equal to \`3\`, using the \`assert_ne!\` macro.`,
    hints: [
      'assert_ne! passes when the two values are different.',
      'add_two(3) is 5, which is not equal to 3.',
    ],
    solution: `pub fn add_two(a: i32) -> i32 {
    a + 2
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn result_is_not_input() {
        assert_ne!(add_two(3), 3);
    }
}`,
    starter: `pub fn add_two(a: i32) -> i32 {
    a + 2
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn result_is_not_input() {
        // TODO: assert add_two(3) != 3
    }
}`,
    tags: ['testing', 'assert_ne'],
  },
  {
    id: 'rs-ch11-c-041',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Should Panic on Out-of-Range Guess',
    prompt: `Define a struct \`Guess\` with a private field \`value: i32\` and an associated function \`new(value: i32) -> Guess\` that calls \`panic!\` if \`value\` is less than 1 or greater than 100, otherwise stores the value.

Write a test named \`greater_than_100\` marked with both \`#[test]\` and \`#[should_panic]\` that calls \`Guess::new(200)\` so the test passes because the code panics.`,
    hints: [
      'Check value < 1 || value > 100 and call panic! when out of range.',
      'A #[should_panic] test passes only if the body panics.',
    ],
    solution: `pub struct Guess {
    value: i32,
}

impl Guess {
    pub fn new(value: i32) -> Guess {
        if value < 1 || value > 100 {
            panic!("Guess value must be between 1 and 100, got {value}.");
        }
        Guess { value }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic]
    fn greater_than_100() {
        Guess::new(200);
    }
}`,
    starter: `pub struct Guess {
    value: i32,
}

impl Guess {
    pub fn new(value: i32) -> Guess {
        // TODO: panic if value < 1 or value > 100
        Guess { value }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    // TODO: add the should_panic attribute
    fn greater_than_100() {
        Guess::new(200);
    }
}`,
    tags: ['testing', 'should_panic', 'panic'],
  },
  {
    id: 'rs-ch11-c-042',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Should Panic With Expected Message',
    prompt: `Define \`Guess\` like before, but have \`new\` produce DIFFERENT panic messages: if \`value < 1\` panic with text that includes \`less than or equal to 1\`, and if \`value > 100\` panic with text that includes \`greater than or equal to 100\`.

Write a test named \`less_than_1\` annotated with \`#[should_panic(expected = "less than or equal to 1")]\` that calls \`Guess::new(0)\`. The test must pass only because the panic message contains that expected substring.`,
    hints: [
      'should_panic can take expected = "..." to check the panic message substring.',
      'Make sure the value < 1 branch panics with a message containing the expected text.',
    ],
    solution: `pub struct Guess {
    value: i32,
}

impl Guess {
    pub fn new(value: i32) -> Guess {
        if value < 1 {
            panic!("Guess value must be greater than or equal to 1, got {value}.");
        } else if value > 100 {
            panic!("Guess value must be less than or equal to 100, got {value}.");
        }
        Guess { value }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic(expected = "greater than or equal to 1")]
    fn less_than_1() {
        Guess::new(0);
    }
}`,
    starter: `pub struct Guess {
    value: i32,
}

impl Guess {
    pub fn new(value: i32) -> Guess {
        // TODO: two distinct panic messages
        Guess { value }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    // TODO: should_panic with an expected substring
    fn less_than_1() {
        Guess::new(0);
    }
}`,
    tags: ['testing', 'should_panic', 'expected'],
  },
  {
    id: 'rs-ch11-c-043',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Test That Returns Result',
    prompt: `Write a test named \`it_works\` that returns \`Result<(), String>\`. Inside, compute \`2 + 2\` and if it equals 4 return \`Ok(())\`, otherwise return \`Err\` containing the message \`two plus two does not equal four\`.

The test passes when it returns \`Ok\`. Use the \`?\` operator-free style: just return the value directly with an \`if\`/\`else\`.`,
    hints: [
      'A #[test] function may return Result<(), E> where E implements Debug.',
      'Return Ok(()) on success and Err(String::from(...)) on failure.',
    ],
    solution: `#[cfg(test)]
mod tests {
    #[test]
    fn it_works() -> Result<(), String> {
        if 2 + 2 == 4 {
            Ok(())
        } else {
            Err(String::from("two plus two does not equal four"))
        }
    }
}

fn main() {}`,
    starter: `#[cfg(test)]
mod tests {
    #[test]
    fn it_works() -> Result<(), String> {
        // TODO: return Ok(()) or Err(...)
        Ok(())
    }
}

fn main() {}`,
    tags: ['testing', 'result', 'error'],
  },
  {
    id: 'rs-ch11-c-044',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Result Test Using the Question Mark',
    prompt: `Write a function \`parse_pair(s: &str) -> Result<(i32, i32), std::num::ParseIntError>\` that splits \`s\` on a comma, parses each half as \`i32\`, and returns the pair (assume the input is well-formed with exactly one comma).

Write a test named \`parses_two_numbers\` that returns \`Result<(), std::num::ParseIntError>\` and uses the \`?\` operator on \`parse_pair("3,4")\` to obtain the tuple, then asserts it equals \`(3, 4)\` with \`assert_eq!\`, returning \`Ok(())\` at the end.`,
    hints: [
      'split(",") yields parts; use next().unwrap() to grab the two halves.',
      'Each parse() call returns a Result; use ? to propagate errors.',
      'A Result-returning test lets you use ? inside it.',
    ],
    solution: `pub fn parse_pair(s: &str) -> Result<(i32, i32), std::num::ParseIntError> {
    let mut parts = s.split(',');
    let a = parts.next().unwrap().parse::<i32>()?;
    let b = parts.next().unwrap().parse::<i32>()?;
    Ok((a, b))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_two_numbers() -> Result<(), std::num::ParseIntError> {
        let pair = parse_pair("3,4")?;
        assert_eq!(pair, (3, 4));
        Ok(())
    }
}

fn main() {}`,
    starter: `pub fn parse_pair(s: &str) -> Result<(i32, i32), std::num::ParseIntError> {
    // TODO: split on ',', parse both halves with ?, return the tuple
    Ok((0, 0))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_two_numbers() -> Result<(), std::num::ParseIntError> {
        // TODO: use ? on parse_pair("3,4") and assert it equals (3, 4)
        Ok(())
    }
}

fn main() {}`,
    tags: ['testing', 'result', 'question-mark'],
  },
  {
    id: 'rs-ch11-c-045',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Test a Private Function',
    prompt: `In a module, write a PRIVATE function \`internal_adder(a: i32, b: i32) -> i32\` (no \`pub\`). Even though it is private, child modules can call it.

Write a \`#[cfg(test)] mod tests\` block with \`use super::*;\` and a test \`internal\` that asserts \`internal_adder(2, 2)\` equals \`4\`. This demonstrates Rust lets you unit-test private functions.`,
    hints: [
      'Do not put pub on internal_adder.',
      'The tests child module can still reach private parents via super.',
    ],
    solution: `fn internal_adder(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn internal() {
        assert_eq!(internal_adder(2, 2), 4);
    }
}

fn main() {}`,
    starter: `fn internal_adder(a: i32, b: i32) -> i32 {
    // TODO
    0
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn internal() {
        // TODO: assert internal_adder(2, 2) == 4
    }
}

fn main() {}`,
    tags: ['testing', 'private', 'cfg-test'],
  },
  {
    id: 'rs-ch11-c-046',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Compare Two Vectors',
    prompt: `Write a function \`evens_up_to(n: i32) -> Vec<i32>\` that returns all even numbers from 0 up to and including \`n\` (when \`n\` is even).

Write a test named \`evens_to_six\` that asserts \`evens_up_to(6)\` equals \`vec![0, 2, 4, 6]\` using \`assert_eq!\`. Vectors of the same elements compare equal.`,
    hints: [
      'Iterate with a range and push values where x % 2 == 0.',
      'assert_eq! works on Vec because Vec implements PartialEq and Debug.',
    ],
    solution: `pub fn evens_up_to(n: i32) -> Vec<i32> {
    let mut v = Vec::new();
    for x in 0..=n {
        if x % 2 == 0 {
            v.push(x);
        }
    }
    v
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn evens_to_six() {
        assert_eq!(evens_up_to(6), vec![0, 2, 4, 6]);
    }
}

fn main() {}`,
    starter: `pub fn evens_up_to(n: i32) -> Vec<i32> {
    // TODO: collect even numbers 0..=n
    Vec::new()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn evens_to_six() {
        // TODO
    }
}

fn main() {}`,
    tags: ['testing', 'assert_eq', 'vec'],
  },
  {
    id: 'rs-ch11-c-047',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Custom Message Showing Both Sides',
    prompt: `Write a function \`double(x: i32) -> i32\` returning \`x * 2\`.

Write a test \`doubling_is_correct\` that computes \`let result = double(5);\` and uses \`assert_eq!\` to compare it against an \`expected\` value of \`10\`. Add a CUSTOM message to assert_eq! that prints both values, like: \`expected the result\`.

Specifically the message must include both \`expected\` and \`result\` using format placeholders.`,
    hints: [
      'assert_eq! accepts a trailing format string and arguments after the two values.',
      'Write assert_eq!(result, expected, "expected {expected}, got {result}").',
    ],
    solution: `pub fn double(x: i32) -> i32 {
    x * 2
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn doubling_is_correct() {
        let result = double(5);
        let expected = 10;
        assert_eq!(result, expected, "expected {expected}, got {result}");
    }
}

fn main() {}`,
    starter: `pub fn double(x: i32) -> i32 {
    x * 2
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn doubling_is_correct() {
        let result = double(5);
        let expected = 10;
        // TODO: assert_eq! with a custom message that prints both values
    }
}

fn main() {}`,
    tags: ['testing', 'assert_eq', 'custom-message'],
  },
  {
    id: 'rs-ch11-c-048',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Two Tests in One Module',
    prompt: `Write functions \`add(a: i32, b: i32) -> i32\` and \`sub(a: i32, b: i32) -> i32\`.

In one \`#[cfg(test)] mod tests\` block, write TWO separate \`#[test]\` functions: \`addition_works\` asserting \`add(2, 3) == 5\`, and \`subtraction_works\` asserting \`sub(5, 3) == 2\`. Each test runs independently.`,
    hints: [
      'Each test function needs its own #[test] attribute.',
      'Both tests can share use super::*; from the module.',
    ],
    solution: `pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

pub fn sub(a: i32, b: i32) -> i32 {
    a - b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn addition_works() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn subtraction_works() {
        assert_eq!(sub(5, 3), 2);
    }
}

fn main() {}`,
    starter: `pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

pub fn sub(a: i32, b: i32) -> i32 {
    a - b
}

#[cfg(test)]
mod tests {
    use super::*;

    // TODO: write addition_works and subtraction_works
}

fn main() {}`,
    tags: ['testing', 'multiple-tests', 'cfg-test'],
  },
  {
    id: 'rs-ch11-c-049',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Mark a Slow Test as Ignored',
    prompt: `Write a function \`square(x: i32) -> i32\` returning \`x * x\`.

Write two tests: \`fast_check\` (runs normally) asserting \`square(3) == 9\`, and \`expensive_check\` annotated with \`#[ignore]\` (in addition to \`#[test]\`) asserting \`square(1000) == 1_000_000\`. The ignored test is skipped unless explicitly requested.`,
    hints: [
      'Add #[ignore] under #[test] to skip a test by default.',
      'You can still run ignored tests with cargo test -- --ignored.',
    ],
    solution: `pub fn square(x: i32) -> i32 {
    x * x
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn fast_check() {
        assert_eq!(square(3), 9);
    }

    #[test]
    #[ignore]
    fn expensive_check() {
        assert_eq!(square(1000), 1_000_000);
    }
}

fn main() {}`,
    starter: `pub fn square(x: i32) -> i32 {
    x * x
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn fast_check() {
        assert_eq!(square(3), 9);
    }

    // TODO: add expensive_check with #[ignore]
}

fn main() {}`,
    tags: ['testing', 'ignore', 'attributes'],
  },
  {
    id: 'rs-ch11-c-050',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Test a Method on an Enum',
    prompt: `Define an enum \`Coin\` with variants \`Penny\`, \`Nickel\`, \`Dime\`, and \`Quarter\`, plus a method \`value_in_cents(&self) -> u32\` returning 1, 5, 10, or 25 respectively.

Write a test \`quarter_is_25\` asserting \`Coin::Quarter.value_in_cents()\` equals \`25\`, and a test \`dime_is_10\` asserting the dime equals \`10\`.`,
    hints: [
      'Use a match in value_in_cents over each variant.',
      'Call the method on a constructed variant inside assert_eq!.',
    ],
    solution: `pub enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

impl Coin {
    pub fn value_in_cents(&self) -> u32 {
        match self {
            Coin::Penny => 1,
            Coin::Nickel => 5,
            Coin::Dime => 10,
            Coin::Quarter => 25,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn quarter_is_25() {
        assert_eq!(Coin::Quarter.value_in_cents(), 25);
    }

    #[test]
    fn dime_is_10() {
        assert_eq!(Coin::Dime.value_in_cents(), 10);
    }
}

fn main() {}`,
    starter: `pub enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

impl Coin {
    pub fn value_in_cents(&self) -> u32 {
        // TODO: match each variant
        0
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    // TODO: write quarter_is_25 and dime_is_10
}

fn main() {}`,
    tags: ['testing', 'enum', 'assert_eq'],
  },
  {
    id: 'rs-ch11-c-051',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Should Panic on Empty Average',
    prompt: `Write a function \`average(nums: &[i32]) -> i32\` that panics with the message \`cannot average an empty slice\` when the slice is empty, otherwise returns the integer average (sum divided by length).

Write a test \`average_of_empty_panics\` annotated with \`#[should_panic(expected = "empty slice")]\` that calls \`average(&[])\`.`,
    hints: [
      'Check nums.is_empty() and panic! before dividing.',
      'Sum with a loop or iterator, then divide by nums.len() as i32.',
      'The expected substring only needs to appear inside the panic message.',
    ],
    solution: `pub fn average(nums: &[i32]) -> i32 {
    if nums.is_empty() {
        panic!("cannot average an empty slice");
    }
    let mut sum = 0;
    for &n in nums {
        sum += n;
    }
    sum / nums.len() as i32
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn average_works() {
        assert_eq!(average(&[2, 4, 6]), 4);
    }

    #[test]
    #[should_panic(expected = "empty slice")]
    fn average_of_empty_panics() {
        average(&[]);
    }
}

fn main() {}`,
    starter: `pub fn average(nums: &[i32]) -> i32 {
    // TODO: panic on empty, else return the average
    0
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic(expected = "empty slice")]
    fn average_of_empty_panics() {
        average(&[]);
    }
}

fn main() {}`,
    tags: ['testing', 'should_panic', 'slice'],
  },
  {
    id: 'rs-ch11-c-052',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Test Both Branches of a Function',
    prompt: `Write a function \`classify(n: i32) -> &'static str\` returning \`"even"\` when \`n\` is even and \`"odd"\` otherwise.

Write tests \`classifies_even\` and \`classifies_odd\` that each call \`classify\` with an appropriate input and assert the returned string with \`assert_eq!\`. Cover both branches.`,
    hints: [
      'n % 2 == 0 distinguishes even from odd.',
      'Compare &str values directly with assert_eq!.',
    ],
    solution: `pub fn classify(n: i32) -> &'static str {
    if n % 2 == 0 {
        "even"
    } else {
        "odd"
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn classifies_even() {
        assert_eq!(classify(4), "even");
    }

    #[test]
    fn classifies_odd() {
        assert_eq!(classify(7), "odd");
    }
}

fn main() {}`,
    starter: `pub fn classify(n: i32) -> &'static str {
    // TODO
    "odd"
}

#[cfg(test)]
mod tests {
    use super::*;

    // TODO: write classifies_even and classifies_odd
}

fn main() {}`,
    tags: ['testing', 'branches', 'assert_eq'],
  },
  {
    id: 'rs-ch11-c-053',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Test Output Captured by Default',
    prompt: `Write a function \`add_with_log(a: i32, b: i32) -> i32\` that calls \`println!("adding {a} and {b}")\` and returns the sum.

Write a passing test \`logs_and_adds\` that calls it and asserts the result. Then in a comment at the top of the file, state the cargo flag a learner would pass to SEE the println output even for passing tests.`,
    hints: [
      'By default cargo test hides output from passing tests.',
      'The flag is --show-output, used as cargo test -- --show-output.',
    ],
    solution: `// To see println output from passing tests: cargo test -- --show-output

pub fn add_with_log(a: i32, b: i32) -> i32 {
    println!("adding {a} and {b}");
    a + b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn logs_and_adds() {
        assert_eq!(add_with_log(2, 3), 5);
    }
}

fn main() {}`,
    starter: `// TODO: note the flag to show output from passing tests

pub fn add_with_log(a: i32, b: i32) -> i32 {
    // TODO: print then return the sum
    0
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn logs_and_adds() {
        // TODO
    }
}

fn main() {}`,
    tags: ['testing', 'show-output', 'println'],
  },
  {
    id: 'rs-ch11-c-054',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Predict Which Tests Pass',
    prompt: `Given this module, two tests are written. Reproduce the code EXACTLY and add a top-of-file comment stating which test passes and which fails, with the reason.

The code:

\`\`\`
pub fn add_two(a: i32) -> i32 { a + 3 }   // note: buggy, adds 3
#[cfg(test)] mod tests {
    use super::*;
    #[test] fn t1() { assert_eq!(add_two(2), 4); }
    #[test] fn t2() { assert_ne!(add_two(2), 4); }
}
\`\`\`

Do NOT fix the bug; just record the predicted pass/fail in your comment.`,
    hints: [
      'add_two(2) actually returns 5 because of the bug.',
      't1 expects equality with 4 and t2 expects inequality with 4.',
    ],
    solution: `// add_two(2) returns 5 (bug adds 3).
// t1 uses assert_eq!(5, 4) -> FAILS.
// t2 uses assert_ne!(5, 4) -> PASSES (they differ).

pub fn add_two(a: i32) -> i32 {
    a + 3
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn t1() {
        assert_eq!(add_two(2), 4);
    }

    #[test]
    fn t2() {
        assert_ne!(add_two(2), 4);
    }
}

fn main() {}`,
    starter: `// TODO: predict which of t1 and t2 passes, and why

pub fn add_two(a: i32) -> i32 {
    a + 3
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn t1() {
        assert_eq!(add_two(2), 4);
    }

    #[test]
    fn t2() {
        assert_ne!(add_two(2), 4);
    }
}

fn main() {}`,
    tags: ['testing', 'reasoning', 'assert'],
  },
  {
    id: 'rs-ch11-c-055',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Run a Single Test by Name',
    prompt: `Write functions \`add(a: i32, b: i32) -> i32\` and \`mul(a: i32, b: i32) -> i32\`.

Write tests \`add_works\` and \`mul_works\`. In a top-of-file comment, write the exact cargo command that runs ONLY \`mul_works\` (a single test by exact name), and the command that runs any test whose name CONTAINS \`add\`.`,
    hints: [
      'cargo test mul_works runs the single test whose name matches exactly.',
      'cargo test add runs every test whose name contains add (a filter).',
    ],
    solution: `// Run only mul_works:    cargo test mul_works
// Run all tests with "add" in the name: cargo test add

pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

pub fn mul(a: i32, b: i32) -> i32 {
    a * b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn add_works() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn mul_works() {
        assert_eq!(mul(2, 3), 6);
    }
}

fn main() {}`,
    starter: `// TODO: command to run only mul_works
// TODO: command to run tests containing "add"

pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

pub fn mul(a: i32, b: i32) -> i32 {
    a * b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn add_works() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn mul_works() {
        assert_eq!(mul(2, 3), 6);
    }
}

fn main() {}`,
    tags: ['testing', 'filter', 'cli'],
  },
  {
    id: 'rs-ch11-c-056',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Test a Result-Returning Function for Err',
    prompt: `Write \`safe_div(a: i32, b: i32) -> Result<i32, String>\` that returns \`Err\` with message \`division by zero\` when \`b == 0\`, otherwise \`Ok(a / b)\`.

Write two tests: \`divides\` asserting \`safe_div(10, 2)\` equals \`Ok(5)\`, and \`zero_is_err\` asserting \`safe_div(1, 0)\` equals \`Err(String::from("division by zero"))\`. Derive any traits you need to compare a Result with assert_eq!.`,
    hints: [
      'Result<i32, String> already implements PartialEq and Debug, so assert_eq! works.',
      'Construct the expected Err with Err(String::from("division by zero")).',
    ],
    solution: `pub fn safe_div(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err(String::from("division by zero"))
    } else {
        Ok(a / b)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn divides() {
        assert_eq!(safe_div(10, 2), Ok(5));
    }

    #[test]
    fn zero_is_err() {
        assert_eq!(safe_div(1, 0), Err(String::from("division by zero")));
    }
}

fn main() {}`,
    starter: `pub fn safe_div(a: i32, b: i32) -> Result<i32, String> {
    // TODO
    Ok(0)
}

#[cfg(test)]
mod tests {
    use super::*;

    // TODO: write divides and zero_is_err
}

fn main() {}`,
    tags: ['testing', 'result', 'assert_eq'],
  },
  {
    id: 'rs-ch11-c-057',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Test Floating-Point With Tolerance',
    prompt: `Write a function \`circle_area(r: f64) -> f64\` returning \`3.14159 * r * r\`.

Because floating-point equality is unreliable, write a test \`area_close\` that computes \`circle_area(2.0)\` and uses \`assert!\` to check the absolute difference from the expected \`12.56636\` is less than \`1e-6\`. Use the \`.abs()\` method on the difference.`,
    hints: [
      'Compute (result - expected).abs() and compare to a small epsilon.',
      'assert!((result - 12.56636).abs() < 1e-6);',
    ],
    solution: `pub fn circle_area(r: f64) -> f64 {
    3.14159 * r * r
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn area_close() {
        let result = circle_area(2.0);
        let expected = 12.56636;
        assert!((result - expected).abs() < 1e-6, "got {result}");
    }
}

fn main() {}`,
    starter: `pub fn circle_area(r: f64) -> f64 {
    // TODO
    0.0
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn area_close() {
        // TODO: assert the result is within 1e-6 of 12.56636
    }
}

fn main() {}`,
    tags: ['testing', 'float', 'assert'],
  },
  {
    id: 'rs-ch11-c-058',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Single-Threaded Test Note',
    prompt: `Write a function \`triple(x: i32) -> i32\` returning \`x * 3\` and a test \`triples\` asserting \`triple(4) == 12\`.

In a top-of-file comment, write the exact cargo invocation that forces all tests to run consecutively on a SINGLE thread (useful when tests share state and must not run in parallel).`,
    hints: [
      'Pass arguments to the test binary after a -- separator.',
      'The option is --test-threads=1.',
    ],
    solution: `// Run tests on one thread: cargo test -- --test-threads=1

pub fn triple(x: i32) -> i32 {
    x * 3
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn triples() {
        assert_eq!(triple(4), 12);
    }
}

fn main() {}`,
    starter: `// TODO: command to run tests on a single thread

pub fn triple(x: i32) -> i32 {
    x * 3
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn triples() {
        assert_eq!(triple(4), 12);
    }
}

fn main() {}`,
    tags: ['testing', 'test-threads', 'cli'],
  },
  {
    id: 'rs-ch11-c-059',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Nested Test Modules',
    prompt: `Write functions \`add(a: i32, b: i32) -> i32\` and \`sub(a: i32, b: i32) -> i32\`.

Organize tests into a \`#[cfg(test)] mod tests\` block that contains TWO nested submodules: \`mod addition\` with a test \`works\` (asserting add), and \`mod subtraction\` with a test \`works\` (asserting sub). Use \`use super::super::*;\` inside each nested module to reach the functions.`,
    hints: [
      'Inside a nested module you go up two levels: super::super::*.',
      'Two different submodules may each contain a test named works.',
    ],
    solution: `pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

pub fn sub(a: i32, b: i32) -> i32 {
    a - b
}

#[cfg(test)]
mod tests {
    mod addition {
        use super::super::*;

        #[test]
        fn works() {
            assert_eq!(add(2, 3), 5);
        }
    }

    mod subtraction {
        use super::super::*;

        #[test]
        fn works() {
            assert_eq!(sub(5, 3), 2);
        }
    }
}

fn main() {}`,
    starter: `pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

pub fn sub(a: i32, b: i32) -> i32 {
    a - b
}

#[cfg(test)]
mod tests {
    // TODO: nested modules addition and subtraction, each with a test named works
}

fn main() {}`,
    tags: ['testing', 'modules', 'organization'],
  },
  {
    id: 'rs-ch11-c-060',
    chapter: 11,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Test a Setter and Getter Pair',
    prompt: `Define a struct \`Counter\` with a private field \`count: u32\`, an associated \`new() -> Counter\` starting at 0, an \`increment(&mut self)\` method, and a \`get(&self) -> u32\` method.

Write a test \`increments\` that creates a counter, increments it twice, and asserts \`get()\` returns 2 with \`assert_eq!\`.`,
    hints: [
      'increment should do self.count += 1.',
      'Declare the counter with let mut so you can call increment.',
    ],
    solution: `pub struct Counter {
    count: u32,
}

impl Counter {
    pub fn new() -> Counter {
        Counter { count: 0 }
    }

    pub fn increment(&mut self) {
        self.count += 1;
    }

    pub fn get(&self) -> u32 {
        self.count
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn increments() {
        let mut c = Counter::new();
        c.increment();
        c.increment();
        assert_eq!(c.get(), 2);
    }
}

fn main() {}`,
    starter: `pub struct Counter {
    count: u32,
}

impl Counter {
    pub fn new() -> Counter {
        Counter { count: 0 }
    }

    pub fn increment(&mut self) {
        // TODO
    }

    pub fn get(&self) -> u32 {
        // TODO
        0
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn increments() {
        // TODO
    }
}

fn main() {}`,
    tags: ['testing', 'struct', 'state'],
  },
  {
    id: 'rs-ch11-c-061',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Integration Test File Layout',
    prompt: `You are writing an INTEGRATION test for a library crate named \`adder\` whose \`src/lib.rs\` contains \`pub fn add_two(a: i32) -> i32 { a + 2 }\`.

Write the contents of the file \`tests/integration_test.rs\`. It must bring the crate into scope with \`use adder;\` (or \`use adder::add_two;\`), and contain a \`#[test]\` function \`it_adds_two\` that asserts \`adder::add_two(2)\` equals 4. Integration test files need NO \`#[cfg(test)]\` because everything in \`tests/\` is compiled only for testing.

Provide the full file contents you would put in \`tests/integration_test.rs\`.`,
    hints: [
      'Files under tests/ are separate crates that link the library by its crate name.',
      'No cfg(test) module is needed in integration test files.',
      'Refer to library items via the crate name: adder::add_two.',
    ],
    solution: `// File: tests/integration_test.rs
use adder::add_two;

#[test]
fn it_adds_two() {
    assert_eq!(add_two(2), 4);
}`,
    starter: `// File: tests/integration_test.rs
// TODO: bring the adder crate into scope and write the integration test
`,
    tags: ['testing', 'integration', 'layout'],
  },
  {
    id: 'rs-ch11-c-062',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Shared Common Test Module',
    prompt: `For a library crate \`adder\`, you want a helper shared across integration tests. Write the TWO files:

1. \`tests/common/mod.rs\` containing \`pub fn setup() { /* runs setup, e.g. prints a line */ }\`.
2. \`tests/integration_test.rs\` that declares \`mod common;\`, calls \`common::setup();\` at the start of a \`#[test]\` named \`uses_common\`, and then asserts \`adder::add_two(3)\` equals 5.

Explain in a comment why the file is named \`common/mod.rs\` rather than \`common.rs\` (so it is NOT treated as its own test crate). Provide both file contents.`,
    hints: [
      'Using tests/common/mod.rs avoids Rust treating common as a standalone integration test.',
      'Declare mod common; in the integration test to load tests/common/mod.rs.',
      'Call shared helpers via common::setup().',
    ],
    solution: `// File: tests/common/mod.rs
// Named common/mod.rs (an older module style) so cargo does NOT compile it
// as its own integration test crate or report empty test output for it.
pub fn setup() {
    // shared setup code
    println!("setting up");
}

// File: tests/integration_test.rs
use adder::add_two;

mod common;

#[test]
fn uses_common() {
    common::setup();
    assert_eq!(add_two(3), 5);
}`,
    starter: `// File: tests/common/mod.rs
// TODO: pub fn setup()

// File: tests/integration_test.rs
// TODO: mod common; then a #[test] that calls common::setup() and asserts add_two(3) == 5
`,
    tags: ['testing', 'integration', 'common-module'],
  },
  {
    id: 'rs-ch11-c-063',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Custom PartialEq for assert_eq!',
    prompt: `Define a struct \`Point { x: i32, y: i32 }\`. For \`assert_eq!\` to work on two \`Point\` values, the type must implement \`PartialEq\` (for comparison) and \`Debug\` (for the failure message).

Derive both traits, write a function \`origin() -> Point\` returning a point at (0, 0), and write a test \`origin_is_zero_zero\` asserting \`origin()\` equals \`Point { x: 0, y: 0 }\` with \`assert_eq!\`.`,
    hints: [
      'Add #[derive(Debug, PartialEq)] above the struct.',
      'Without those derives, assert_eq! will not compile for the struct.',
    ],
    solution: `#[derive(Debug, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}

fn origin() -> Point {
    Point { x: 0, y: 0 }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn origin_is_zero_zero() {
        assert_eq!(origin(), Point { x: 0, y: 0 });
    }
}

fn main() {}`,
    starter: `// TODO: derive the traits assert_eq! needs
struct Point {
    x: i32,
    y: i32,
}

fn origin() -> Point {
    Point { x: 0, y: 0 }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn origin_is_zero_zero() {
        // TODO
    }
}

fn main() {}`,
    tags: ['testing', 'derive', 'partialeq'],
  },
  {
    id: 'rs-ch11-c-064',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Test a Recursive Function Thoroughly',
    prompt: `Write a recursive function \`factorial(n: u64) -> u64\` where \`factorial(0)\` is 1.

Write a \`#[cfg(test)] mod tests\` block with three tests: \`base_case\` (asserts factorial(0) == 1), \`small\` (asserts factorial(5) == 120), and \`larger\` (asserts factorial(10) == 3_628_800). All must pass.`,
    hints: [
      'factorial(n) = n * factorial(n - 1) with a base case at 0.',
      'Use u64 to avoid overflow for 10!.',
    ],
    solution: `pub fn factorial(n: u64) -> u64 {
    if n == 0 {
        1
    } else {
        n * factorial(n - 1)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn base_case() {
        assert_eq!(factorial(0), 1);
    }

    #[test]
    fn small() {
        assert_eq!(factorial(5), 120);
    }

    #[test]
    fn larger() {
        assert_eq!(factorial(10), 3_628_800);
    }
}

fn main() {}`,
    starter: `pub fn factorial(n: u64) -> u64 {
    // TODO: recursive factorial with base case at 0
    0
}

#[cfg(test)]
mod tests {
    use super::*;

    // TODO: base_case, small, larger
}

fn main() {}`,
    tags: ['testing', 'recursion', 'assert_eq'],
  },
  {
    id: 'rs-ch11-c-065',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Panic Path vs Ok Path',
    prompt: `Write \`withdraw(balance: u32, amount: u32) -> u32\` that returns the new balance \`balance - amount\`, but panics with message \`insufficient funds\` if \`amount > balance\`.

Write THREE tests: \`normal_withdraw\` asserting \`withdraw(100, 30) == 70\`; \`exact_withdraw\` asserting \`withdraw(50, 50) == 0\`; and \`overdraft_panics\` annotated with \`#[should_panic(expected = "insufficient funds")]\` calling \`withdraw(20, 50)\`.`,
    hints: [
      'Guard with if amount > balance { panic!("insufficient funds") }.',
      'The exact-balance case (50, 50) should succeed and return 0, not panic.',
    ],
    solution: `pub fn withdraw(balance: u32, amount: u32) -> u32 {
    if amount > balance {
        panic!("insufficient funds");
    }
    balance - amount
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn normal_withdraw() {
        assert_eq!(withdraw(100, 30), 70);
    }

    #[test]
    fn exact_withdraw() {
        assert_eq!(withdraw(50, 50), 0);
    }

    #[test]
    #[should_panic(expected = "insufficient funds")]
    fn overdraft_panics() {
        withdraw(20, 50);
    }
}

fn main() {}`,
    starter: `pub fn withdraw(balance: u32, amount: u32) -> u32 {
    // TODO: panic on overdraft, else subtract
    0
}

#[cfg(test)]
mod tests {
    use super::*;

    // TODO: normal_withdraw, exact_withdraw, overdraft_panics
}

fn main() {}`,
    tags: ['testing', 'should_panic', 'branches'],
  },
  {
    id: 'rs-ch11-c-066',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Result Test That Reports a Failure',
    prompt: `Write \`is_palindrome(s: &str) -> bool\` that returns true if the string reads the same forwards and backwards (compare the char sequence to its reverse).

Write a test \`palindromes_pass\` returning \`Result<(), String>\`. Inside, loop over the words \`"racecar"\`, \`"level"\`, and \`"noon"\`; if any is NOT a palindrome, return \`Err\` with a message naming the offending word. Return \`Ok(())\` if all pass.`,
    hints: [
      'Collect chars and compare with chars().rev().collect::<Vec<_>>() or similar.',
      'In the test, return Err(format!("{word} is not a palindrome")) on the first failure.',
      'A Result-returning test passes when it returns Ok(()).',
    ],
    solution: `pub fn is_palindrome(s: &str) -> bool {
    let forward: Vec<char> = s.chars().collect();
    let backward: Vec<char> = s.chars().rev().collect();
    forward == backward
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn palindromes_pass() -> Result<(), String> {
        for word in ["racecar", "level", "noon"] {
            if !is_palindrome(word) {
                return Err(format!("{word} is not a palindrome"));
            }
        }
        Ok(())
    }
}

fn main() {}`,
    starter: `pub fn is_palindrome(s: &str) -> bool {
    // TODO: compare chars to their reverse
    false
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn palindromes_pass() -> Result<(), String> {
        // TODO: loop over words and return Err naming any failure
        Ok(())
    }
}

fn main() {}`,
    tags: ['testing', 'result', 'iteration'],
  },
  {
    id: 'rs-ch11-c-067',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Table-Driven Test Cases',
    prompt: `Write \`fizzbuzz(n: u32) -> String\` returning \`"Fizz"\` for multiples of 3, \`"Buzz"\` for multiples of 5, \`"FizzBuzz"\` for multiples of both, and the number as a string otherwise.

Write a single test \`table\` that loops over an array of \`(input, expected)\` pairs such as \`(3, "Fizz")\`, \`(5, "Buzz")\`, \`(15, "FizzBuzz")\`, \`(7, "7")\`, and uses \`assert_eq!\` inside the loop with a custom message reporting the failing input.`,
    hints: [
      'Check the multiple-of-15 case first, then 3, then 5.',
      'Iterate over an array of tuples; destructure into (input, expected).',
      'Pass input into the assert_eq! failure message.',
    ],
    solution: `pub fn fizzbuzz(n: u32) -> String {
    if n % 15 == 0 {
        String::from("FizzBuzz")
    } else if n % 3 == 0 {
        String::from("Fizz")
    } else if n % 5 == 0 {
        String::from("Buzz")
    } else {
        n.to_string()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn table() {
        let cases = [(3, "Fizz"), (5, "Buzz"), (15, "FizzBuzz"), (7, "7")];
        for (input, expected) in cases {
            assert_eq!(fizzbuzz(input), expected, "failed on input {input}");
        }
    }
}

fn main() {}`,
    starter: `pub fn fizzbuzz(n: u32) -> String {
    // TODO
    String::new()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn table() {
        let cases = [(3, "Fizz"), (5, "Buzz"), (15, "FizzBuzz"), (7, "7")];
        // TODO: loop and assert_eq! each case with a custom message
    }
}

fn main() {}`,
    tags: ['testing', 'table-driven', 'assert_eq'],
  },
  {
    id: 'rs-ch11-c-068',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Test Private and Public Together',
    prompt: `In a module \`mathutil\` (declared with \`mod mathutil { ... }\`), define a PRIVATE helper \`fn is_even(n: i32) -> bool\` and a PUBLIC function \`pub fn describe(n: i32) -> String\` that uses \`is_even\` to return \`"even"\` or \`"odd"\`.

Inside \`mathutil\`, add a \`#[cfg(test)] mod tests\` with \`use super::*;\` containing \`private_helper\` (asserts \`is_even(4)\` is true via assert!) and \`public_api\` (asserts \`describe(3)\` equals \`"odd"\`). This shows tests inside the module can reach BOTH the private and public items.`,
    hints: [
      'The tests module sits inside mathutil, so use super::*; reaches both is_even and describe.',
      'is_even stays private; tests in a child module can still call it.',
    ],
    solution: `mod mathutil {
    fn is_even(n: i32) -> bool {
        n % 2 == 0
    }

    pub fn describe(n: i32) -> String {
        if is_even(n) {
            String::from("even")
        } else {
            String::from("odd")
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[test]
        fn private_helper() {
            assert!(is_even(4));
        }

        #[test]
        fn public_api() {
            assert_eq!(describe(3), "odd");
        }
    }
}

fn main() {}`,
    starter: `mod mathutil {
    fn is_even(n: i32) -> bool {
        // TODO
        false
    }

    pub fn describe(n: i32) -> String {
        // TODO: use is_even
        String::new()
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        // TODO: private_helper and public_api
    }
}

fn main() {}`,
    tags: ['testing', 'private', 'modules'],
  },
  {
    id: 'rs-ch11-c-069',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Testing a Binary Crate Strategy',
    prompt: `A binary crate's \`src/main.rs\` cannot be imported by integration tests. The recommended pattern is to keep the LOGIC in \`src/lib.rs\` and have \`main\` call it.

Write the contents of \`src/lib.rs\` exposing \`pub fn run(args: &[i32]) -> i32\` that returns the sum of the slice, with a \`#[cfg(test)]\` unit test \`sums\` asserting \`run(&[1, 2, 3])\` equals 6. Then write a minimal \`src/main.rs\` that calls \`mycrate::run\` and prints the result. Provide BOTH file contents and a comment explaining why the logic lives in lib.rs.`,
    hints: [
      'Integration tests and other crates can only use a library crate, not a binary crate.',
      'Move testable logic into lib.rs; main.rs becomes a thin wrapper.',
      'In main.rs, reference items by the crate name (mycrate::run).',
    ],
    solution: `// File: src/lib.rs
// Logic lives here because integration tests (and other crates) can use a
// library crate but cannot import the binary's src/main.rs directly.
pub fn run(args: &[i32]) -> i32 {
    let mut sum = 0;
    for &n in args {
        sum += n;
    }
    sum
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sums() {
        assert_eq!(run(&[1, 2, 3]), 6);
    }
}

// File: src/main.rs
fn main() {
    let result = mycrate::run(&[1, 2, 3]);
    println!("{result}");
}`,
    starter: `// File: src/lib.rs
// TODO: pub fn run(args: &[i32]) -> i32 plus a #[cfg(test)] test

// File: src/main.rs
// TODO: call mycrate::run and print the result
`,
    tags: ['testing', 'binary-crate', 'lib'],
  },
  {
    id: 'rs-ch11-c-070',
    chapter: 11,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Full Test Suite for a Stack',
    prompt: `Implement a generic-free integer stack: struct \`Stack { items: Vec<i32> }\` with \`new() -> Stack\`, \`push(&mut self, x: i32)\`, \`pop(&mut self) -> Option<i32>\`, and \`is_empty(&self) -> bool\`.

Write a \`#[cfg(test)] mod tests\` covering: \`new_is_empty\` (assert! the new stack is empty), \`push_then_not_empty\` (assert! not empty after one push), \`lifo_order\` (push 1, 2, 3 then assert_eq! pop yields Some(3) then Some(2)), and \`pop_empty_is_none\` (assert_eq! popping an empty stack is None). All tests must pass.`,
    hints: [
      'pop should return self.items.pop(), which is already an Option<i32>.',
      'is_empty can delegate to self.items.is_empty().',
      'Declare the stack mut in tests that push or pop.',
    ],
    solution: `pub struct Stack {
    items: Vec<i32>,
}

impl Stack {
    pub fn new() -> Stack {
        Stack { items: Vec::new() }
    }

    pub fn push(&mut self, x: i32) {
        self.items.push(x);
    }

    pub fn pop(&mut self) -> Option<i32> {
        self.items.pop()
    }

    pub fn is_empty(&self) -> bool {
        self.items.is_empty()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn new_is_empty() {
        let s = Stack::new();
        assert!(s.is_empty());
    }

    #[test]
    fn push_then_not_empty() {
        let mut s = Stack::new();
        s.push(10);
        assert!(!s.is_empty());
    }

    #[test]
    fn lifo_order() {
        let mut s = Stack::new();
        s.push(1);
        s.push(2);
        s.push(3);
        assert_eq!(s.pop(), Some(3));
        assert_eq!(s.pop(), Some(2));
    }

    #[test]
    fn pop_empty_is_none() {
        let mut s = Stack::new();
        assert_eq!(s.pop(), None);
    }
}

fn main() {}`,
    starter: `pub struct Stack {
    items: Vec<i32>,
}

impl Stack {
    pub fn new() -> Stack {
        Stack { items: Vec::new() }
    }

    pub fn push(&mut self, x: i32) {
        // TODO
    }

    pub fn pop(&mut self) -> Option<i32> {
        // TODO
        None
    }

    pub fn is_empty(&self) -> bool {
        // TODO
        true
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    // TODO: new_is_empty, push_then_not_empty, lifo_order, pop_empty_is_none
}

fn main() {}`,
    tags: ['testing', 'struct', 'suite'],
  },
]

export default problems
