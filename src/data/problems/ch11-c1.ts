import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch11-c-001',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Your First Test Function',
    prompt: `Write a test function named \`it_works\` annotated with the \`#[test]\` attribute. Inside it, assert that \`2 + 2\` equals \`4\` using \`assert_eq!\`.

This is the smallest possible passing test. When you run \`cargo test\`, it should report one passing test.`,
    hints: [
      'A test function is a regular function with #[test] written on the line above it.',
      'assert_eq! takes two arguments and passes when they are equal.',
    ],
    solution: `#[test]
fn it_works() {
    assert_eq!(2 + 2, 4);
}`,
    starter: `// TODO: add the #[test] attribute and an assert_eq!
fn it_works() {
}`,
    tags: ['test', 'assert_eq'],
  },
  {
    id: 'rs-ch11-c-002',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Assert a Boolean Condition',
    prompt: `Write a test function named \`five_is_positive\` that uses the \`assert!\` macro to check that the expression \`5 > 0\` is true.

The \`assert!\` macro takes a single boolean expression and passes when it evaluates to \`true\`.`,
    hints: [
      'assert! takes ONE argument: a boolean expression.',
      'The test passes when the expression is true and panics when it is false.',
    ],
    solution: `#[test]
fn five_is_positive() {
    assert!(5 > 0);
}`,
    starter: `#[test]
fn five_is_positive() {
    // TODO: assert that 5 > 0
}`,
    tags: ['test', 'assert'],
  },
  {
    id: 'rs-ch11-c-003',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Test a Doubling Function',
    prompt: `Define a function \`fn double(x: i32) -> i32\` that returns its argument multiplied by 2.

Then write a test named \`doubles_four\` that asserts \`double(4)\` equals \`8\` using \`assert_eq!\`.`,
    hints: [
      'Write the function above the test.',
      'assert_eq!(double(4), 8); compares the call result with the expected value.',
    ],
    solution: `fn double(x: i32) -> i32 {
    x * 2
}

#[test]
fn doubles_four() {
    assert_eq!(double(4), 8);
}`,
    starter: `fn double(x: i32) -> i32 {
    // TODO: return x times 2
    x
}

#[test]
fn doubles_four() {
    // TODO: assert double(4) == 8
}`,
    tags: ['test', 'assert_eq', 'function'],
  },
  {
    id: 'rs-ch11-c-004',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Use assert_ne! for Inequality',
    prompt: `Write a test function named \`not_equal\` that uses the \`assert_ne!\` macro to verify that \`3 + 3\` is NOT equal to \`5\`.

\`assert_ne!\` passes when its two arguments are different.`,
    hints: [
      'assert_ne! is the opposite of assert_eq!: it passes when the values differ.',
      'It still takes two arguments.',
    ],
    solution: `#[test]
fn not_equal() {
    assert_ne!(3 + 3, 5);
}`,
    starter: `#[test]
fn not_equal() {
    // TODO: assert 3 + 3 is not equal to 5
}`,
    tags: ['test', 'assert_ne'],
  },
  {
    id: 'rs-ch11-c-005',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Assert That a Boolean Is False',
    prompt: `Define a function \`fn is_even(n: i32) -> bool\` that returns true when \`n\` is even.

Write a test named \`three_is_not_even\` that asserts \`is_even(3)\` is false. Use \`assert!\` with the not operator (\`!\`) on the result.`,
    hints: [
      'A number is even when n % 2 == 0.',
      'Use assert!(!is_even(3)); to assert the result is false.',
    ],
    solution: `fn is_even(n: i32) -> bool {
    n % 2 == 0
}

#[test]
fn three_is_not_even() {
    assert!(!is_even(3));
}`,
    starter: `fn is_even(n: i32) -> bool {
    // TODO: return true when n is even
    false
}

#[test]
fn three_is_not_even() {
    // TODO: assert is_even(3) is false
}`,
    tags: ['test', 'assert', 'bool'],
  },
  {
    id: 'rs-ch11-c-006',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Test a String-Returning Function',
    prompt: `Define a function \`fn greeting(name: &str) -> String\` that returns the string \`Hello, \` followed by the name (for example, \`greeting("Sam")\` returns \`Hello, Sam\`).

Write a test named \`greets_by_name\` that asserts \`greeting("Sam")\` equals \`String::from("Hello, Sam")\`.`,
    hints: [
      'Build the result with format! using the name argument.',
      'assert_eq! can compare a String to another String.',
    ],
    solution: `fn greeting(name: &str) -> String {
    format!("Hello, {}", name)
}

#[test]
fn greets_by_name() {
    assert_eq!(greeting("Sam"), String::from("Hello, Sam"));
}`,
    starter: `fn greeting(name: &str) -> String {
    // TODO: return "Hello, " followed by name
    String::new()
}

#[test]
fn greets_by_name() {
    // TODO: assert greeting("Sam") == "Hello, Sam"
}`,
    tags: ['test', 'assert_eq', 'string'],
  },
  {
    id: 'rs-ch11-c-007',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Two Tests in One File',
    prompt: `Write TWO separate test functions:

1. \`adds_correctly\` asserts that \`1 + 1\` equals \`2\`.
2. \`subtracts_correctly\` asserts that \`5 - 3\` equals \`2\`.

Each must have its own \`#[test]\` attribute. Running \`cargo test\` should report two passing tests.`,
    hints: [
      'Every test function needs its own #[test] line.',
      'The two functions must have different names.',
    ],
    solution: `#[test]
fn adds_correctly() {
    assert_eq!(1 + 1, 2);
}

#[test]
fn subtracts_correctly() {
    assert_eq!(5 - 3, 2);
}`,
    starter: `#[test]
fn adds_correctly() {
    // TODO
}

// TODO: add a second test named subtracts_correctly
`,
    tags: ['test', 'assert_eq'],
  },
  {
    id: 'rs-ch11-c-008',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Test the Larger-Of-Two Function',
    prompt: `Define a function \`fn larger(a: i32, b: i32) -> i32\` that returns the larger of the two arguments.

Write a test named \`returns_larger\` that asserts \`larger(7, 3)\` equals \`7\`.`,
    hints: [
      'Use an if expression to compare a and b.',
      'assert_eq!(larger(7, 3), 7);',
    ],
    solution: `fn larger(a: i32, b: i32) -> i32 {
    if a > b {
        a
    } else {
        b
    }
}

#[test]
fn returns_larger() {
    assert_eq!(larger(7, 3), 7);
}`,
    starter: `fn larger(a: i32, b: i32) -> i32 {
    // TODO: return the larger value
    a
}

#[test]
fn returns_larger() {
    // TODO: assert larger(7, 3) == 7
}`,
    tags: ['test', 'assert_eq', 'function'],
  },
  {
    id: 'rs-ch11-c-009',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Failing Assertion',
    prompt: `Write a test named \`will_fail\` whose body is \`assert_eq!(2 + 2, 5);\`.

This test is SUPPOSED to fail. The point is to see what a failing test looks like: when you run it, cargo reports the assertion failure showing the left value 4 and the right value 5.`,
    hints: [
      'You are intentionally writing a failing test here.',
      'assert_eq! prints the left and right values when they differ.',
    ],
    solution: `#[test]
fn will_fail() {
    assert_eq!(2 + 2, 5);
}`,
    starter: `#[test]
fn will_fail() {
    // TODO: assert_eq! that intentionally fails
}`,
    tags: ['test', 'assert_eq', 'failure'],
  },
  {
    id: 'rs-ch11-c-010',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Test Vector Length',
    prompt: `Define a function \`fn build_list() -> Vec<i32>\` that returns the vector \`vec![1, 2, 3, 4]\`.

Write a test named \`has_four_items\` that asserts the length of \`build_list()\` equals \`4\`.`,
    hints: [
      'Call .len() on the returned vector.',
      'assert_eq!(build_list().len(), 4);',
    ],
    solution: `fn build_list() -> Vec<i32> {
    vec![1, 2, 3, 4]
}

#[test]
fn has_four_items() {
    assert_eq!(build_list().len(), 4);
}`,
    starter: `fn build_list() -> Vec<i32> {
    // TODO: return vec![1, 2, 3, 4]
    Vec::new()
}

#[test]
fn has_four_items() {
    // TODO: assert the length is 4
}`,
    tags: ['test', 'assert_eq', 'vec'],
  },
  {
    id: 'rs-ch11-c-011',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Assert Contains a Substring',
    prompt: `Define a function \`fn banner() -> String\` that returns \`String::from("Welcome to Rust")\`.

Write a test named \`mentions_rust\` that uses \`assert!\` to check that the returned string contains the substring \`"Rust"\` (use the \`.contains(...)\` method).`,
    hints: [
      'The str method .contains("Rust") returns a bool.',
      'Pass that boolean into assert!.',
    ],
    solution: `fn banner() -> String {
    String::from("Welcome to Rust")
}

#[test]
fn mentions_rust() {
    assert!(banner().contains("Rust"));
}`,
    starter: `fn banner() -> String {
    String::from("Welcome to Rust")
}

#[test]
fn mentions_rust() {
    // TODO: assert that banner() contains "Rust"
}`,
    tags: ['test', 'assert', 'string'],
  },
  {
    id: 'rs-ch11-c-012',
    chapter: 11,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Test a Boolean-Returning Comparison',
    prompt: `Define a function \`fn can_hold(width: u32, height: u32, w: u32, h: u32) -> bool\` that returns true when a rectangle of size width-by-height can hold one of size w-by-h (both dimensions must be greater).

Write a test named \`larger_holds_smaller\` asserting \`can_hold(8, 7, 5, 1)\` is true.`,
    hints: [
      'Return width > w && height > h.',
      'assert!(can_hold(8, 7, 5, 1));',
    ],
    solution: `fn can_hold(width: u32, height: u32, w: u32, h: u32) -> bool {
    width > w && height > h
}

#[test]
fn larger_holds_smaller() {
    assert!(can_hold(8, 7, 5, 1));
}`,
    starter: `fn can_hold(width: u32, height: u32, w: u32, h: u32) -> bool {
    // TODO: true when both dimensions are larger
    false
}

#[test]
fn larger_holds_smaller() {
    // TODO: assert can_hold(8, 7, 5, 1) is true
}`,
    tags: ['test', 'assert', 'bool'],
  },
  {
    id: 'rs-ch11-c-013',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Smaller Cannot Hold Larger',
    prompt: `Reuse the \`can_hold(width, height, w, h)\` logic (true when both dimensions are strictly greater).

Write a test named \`smaller_cannot_hold_larger\` that asserts \`can_hold(5, 1, 8, 7)\` is FALSE, using \`assert!\` together with the not operator (\`!\`).`,
    hints: [
      'A small rectangle cannot hold a bigger one, so the result is false.',
      'Use assert!(!can_hold(...)); to assert a false result.',
    ],
    solution: `fn can_hold(width: u32, height: u32, w: u32, h: u32) -> bool {
    width > w && height > h
}

#[test]
fn smaller_cannot_hold_larger() {
    assert!(!can_hold(5, 1, 8, 7));
}`,
    starter: `fn can_hold(width: u32, height: u32, w: u32, h: u32) -> bool {
    width > w && height > h
}

#[test]
fn smaller_cannot_hold_larger() {
    // TODO: assert the result is false
}`,
    tags: ['test', 'assert', 'bool'],
  },
  {
    id: 'rs-ch11-c-014',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Custom Failure Message',
    prompt: `Define \`fn greeting(name: &str) -> String\` that returns \`Hello \` followed by the name.

Write a test named \`greeting_contains_name\` that asserts the result contains the name. Provide a CUSTOM failure message using the extra arguments to \`assert!\`, formatted like:

    Greeting did not contain name, value was \`<the actual greeting>\`

Use the actual greeting string in the message via a format placeholder.`,
    hints: [
      'assert! accepts extra arguments after the condition that work like println! format args.',
      'Store the greeting in a variable so you can use it in both the check and the message.',
    ],
    solution: `fn greeting(name: &str) -> String {
    format!("Hello {}", name)
}

#[test]
fn greeting_contains_name() {
    let result = greeting("Carol");
    assert!(
        result.contains("Carol"),
        "Greeting did not contain name, value was \`{}\`",
        result
    );
}`,
    starter: `fn greeting(name: &str) -> String {
    format!("Hello {}", name)
}

#[test]
fn greeting_contains_name() {
    let result = greeting("Carol");
    // TODO: assert! with a custom failure message that includes result
}`,
    tags: ['test', 'assert', 'custom-message'],
  },
  {
    id: 'rs-ch11-c-015',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Custom Message With assert_eq!',
    prompt: `Define \`fn square(n: i32) -> i32\` that returns \`n * n\`.

Write a test named \`squares_three\` that asserts \`square(3)\` equals \`9\`, and add a custom failure message reading:

    square(3) should be 9

The custom message is the third argument to \`assert_eq!\`.`,
    hints: [
      'assert_eq! takes the two values first, then optional format arguments for the message.',
      'assert_eq!(square(3), 9, "square(3) should be 9");',
    ],
    solution: `fn square(n: i32) -> i32 {
    n * n
}

#[test]
fn squares_three() {
    assert_eq!(square(3), 9, "square(3) should be 9");
}`,
    starter: `fn square(n: i32) -> i32 {
    n * n
}

#[test]
fn squares_three() {
    // TODO: assert_eq! with a custom failure message
}`,
    tags: ['test', 'assert_eq', 'custom-message'],
  },
  {
    id: 'rs-ch11-c-016',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'should_panic on Out-Of-Range',
    prompt: `Define a struct \`Guess\` with a private field \`value: i32\`, and an associated function \`Guess::new(value: i32) -> Guess\` that panics if \`value\` is less than 1 or greater than 100, otherwise returns a \`Guess\`.

Write a test named \`greater_than_100\` annotated with \`#[test]\` and \`#[should_panic]\` that calls \`Guess::new(200)\`.`,
    hints: [
      'Inside new, check the range and call panic! with a message when out of range.',
      'A #[should_panic] test passes only if the code inside panics.',
    ],
    solution: `pub struct Guess {
    value: i32,
}

impl Guess {
    pub fn new(value: i32) -> Guess {
        if value < 1 || value > 100 {
            panic!("Guess value must be between 1 and 100, got {}.", value);
        }
        Guess { value }
    }
}

#[test]
#[should_panic]
fn greater_than_100() {
    Guess::new(200);
}`,
    starter: `pub struct Guess {
    value: i32,
}

impl Guess {
    pub fn new(value: i32) -> Guess {
        // TODO: panic if value is out of 1..=100
        Guess { value }
    }
}

// TODO: add #[test] and #[should_panic], then call Guess::new(200)
fn greater_than_100() {
}`,
    tags: ['test', 'should_panic', 'panic'],
  },
  {
    id: 'rs-ch11-c-017',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'should_panic With Expected Text',
    prompt: `Define \`fn withdraw(balance: i32, amount: i32) -> i32\` that panics with the message \`Insufficient funds\` when \`amount\` exceeds \`balance\`; otherwise returns \`balance - amount\`.

Write a test named \`overdraw_panics\` with \`#[should_panic(expected = "Insufficient funds")]\` that calls \`withdraw(50, 100)\`.`,
    hints: [
      'The expected string must be a substring of the actual panic message.',
      'Use panic!("Insufficient funds") inside the function.',
    ],
    solution: `fn withdraw(balance: i32, amount: i32) -> i32 {
    if amount > balance {
        panic!("Insufficient funds");
    }
    balance - amount
}

#[test]
#[should_panic(expected = "Insufficient funds")]
fn overdraw_panics() {
    withdraw(50, 100);
}`,
    starter: `fn withdraw(balance: i32, amount: i32) -> i32 {
    // TODO: panic with "Insufficient funds" when amount > balance
    balance - amount
}

#[test]
// TODO: add #[should_panic(expected = "Insufficient funds")]
fn overdraw_panics() {
    withdraw(50, 100);
}`,
    tags: ['test', 'should_panic', 'expected'],
  },
  {
    id: 'rs-ch11-c-018',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Test That Returns Result',
    prompt: `Write a test named \`it_adds\` whose signature returns \`Result<(), String>\`.

Inside, if \`2 + 2\` equals \`4\` return \`Ok(())\`; otherwise return \`Err(String::from("two plus two did not equal four"))\`.

This is the Result-returning test style introduced in chapter 11.`,
    hints: [
      'The function signature is: fn it_adds() -> Result<(), String>.',
      'Return Ok(()) for success and Err(...) for failure instead of asserting.',
    ],
    solution: `#[test]
fn it_adds() -> Result<(), String> {
    if 2 + 2 == 4 {
        Ok(())
    } else {
        Err(String::from("two plus two did not equal four"))
    }
}`,
    starter: `#[test]
fn it_adds() -> Result<(), String> {
    // TODO: return Ok(()) on success or Err(...) on failure
}`,
    tags: ['test', 'result'],
  },
  {
    id: 'rs-ch11-c-019',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Result Test Using the Question Mark',
    prompt: `Define \`fn parse_age(s: &str) -> Result<u32, std::num::ParseIntError>\` that parses \`s\` into a \`u32\` with \`s.parse()\`.

Write a test named \`parses_thirty\` returning \`Result<(), std::num::ParseIntError>\`. Inside, call \`parse_age("30")?\` to get the value, then \`assert_eq!\` it equals \`30\`, and finish with \`Ok(())\`.`,
    hints: [
      'The ? operator returns early with the error if parsing fails.',
      'After getting the value, assert it and return Ok(()).',
    ],
    solution: `fn parse_age(s: &str) -> Result<u32, std::num::ParseIntError> {
    s.parse()
}

#[test]
fn parses_thirty() -> Result<(), std::num::ParseIntError> {
    let age = parse_age("30")?;
    assert_eq!(age, 30);
    Ok(())
}`,
    starter: `fn parse_age(s: &str) -> Result<u32, std::num::ParseIntError> {
    s.parse()
}

#[test]
fn parses_thirty() -> Result<(), std::num::ParseIntError> {
    // TODO: use ? to parse "30", assert it equals 30, return Ok(())
}`,
    tags: ['test', 'result', 'question-mark'],
  },
  {
    id: 'rs-ch11-c-020',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Unit Tests Under cfg(test)',
    prompt: `Define a function \`fn add_two(a: i32) -> i32\` that returns \`a + 2\`.

Then add a unit-test module named \`tests\` annotated with \`#[cfg(test)]\`. Inside it, bring the outer function into scope with \`use super::*;\` and write a \`#[test]\` function \`adds_two\` asserting \`add_two(2)\` equals \`4\`.`,
    hints: [
      'The conventional shape is: #[cfg(test)] mod tests { use super::*; ... }',
      '#[cfg(test)] means the module is compiled only when running tests.',
    ],
    solution: `fn add_two(a: i32) -> i32 {
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
    starter: `fn add_two(a: i32) -> i32 {
    a + 2
}

// TODO: add a #[cfg(test)] mod tests with use super::*; and a test
`,
    tags: ['test', 'cfg-test', 'module'],
  },
  {
    id: 'rs-ch11-c-021',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Testing a Private Function',
    prompt: `Define a PRIVATE function \`fn internal_adder(a: i32, b: i32) -> i32\` (no \`pub\`) that returns \`a + b\`.

Inside a \`#[cfg(test)] mod tests\` block (with \`use super::*;\`), write a \`#[test]\` named \`internal\` that asserts \`internal_adder(2, 2)\` equals \`4\`. This demonstrates that child test modules can call private functions of the parent.`,
    hints: [
      'The function has no pub keyword, so it is private to the module.',
      'use super::*; gives the test module access to private parent items.',
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
}`,
    starter: `fn internal_adder(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn internal() {
        // TODO: assert internal_adder(2, 2) == 4
    }
}`,
    tags: ['test', 'private', 'cfg-test'],
  },
  {
    id: 'rs-ch11-c-022',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Mark a Test as Ignored',
    prompt: `Write two tests inside a \`#[cfg(test)] mod tests\` block:

1. \`fast_test\` asserts \`1 + 1\` equals \`2\`.
2. \`expensive_test\` is annotated with both \`#[test]\` and \`#[ignore]\` and asserts \`10 * 10\` equals \`100\`.

The ignored test is skipped by a normal \`cargo test\` run.`,
    hints: [
      'Put #[ignore] on its own line below #[test].',
      'Ignored tests only run when you pass --ignored to cargo test.',
    ],
    solution: `#[cfg(test)]
mod tests {
    #[test]
    fn fast_test() {
        assert_eq!(1 + 1, 2);
    }

    #[test]
    #[ignore]
    fn expensive_test() {
        assert_eq!(10 * 10, 100);
    }
}`,
    starter: `#[cfg(test)]
mod tests {
    #[test]
    fn fast_test() {
        assert_eq!(1 + 1, 2);
    }

    // TODO: add an #[ignore]d test named expensive_test
}`,
    tags: ['test', 'ignore', 'cfg-test'],
  },
  {
    id: 'rs-ch11-c-023',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Reason About Pass or Fail',
    prompt: `Read this code and decide, for EACH of the two tests, whether it passes or fails. Then fix ONLY the failing one so that both pass.

    fn add(a: i32, b: i32) -> i32 { a + b }

    #[test]
    fn t1() { assert_eq!(add(2, 2), 4); }

    #[test]
    fn t2() { assert_eq!(add(2, 2), 5); }

Provide the corrected code where both tests pass. (t1 passes; t2 fails because 2 + 2 is 4, not 5.)`,
    hints: [
      'add(2, 2) evaluates to 4.',
      'Change the expected value in t2 from 5 to 4.',
    ],
    solution: `fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[test]
fn t1() {
    assert_eq!(add(2, 2), 4);
}

#[test]
fn t2() {
    assert_eq!(add(2, 2), 4);
}`,
    starter: `fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[test]
fn t1() {
    assert_eq!(add(2, 2), 4);
}

#[test]
fn t2() {
    assert_eq!(add(2, 2), 5); // TODO: fix so this passes
}`,
    tags: ['test', 'reasoning', 'assert_eq'],
  },
  {
    id: 'rs-ch11-c-024',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Test a Method on a Struct',
    prompt: `Define a struct \`Counter\` with a field \`count: u32\`, a constructor \`Counter::new()\` that starts \`count\` at 0, and a method \`fn increment(&mut self)\` that adds 1 to \`count\`.

In a \`#[cfg(test)] mod tests\` block, write a test \`counts_up\` that creates a counter, calls \`increment\` twice, and asserts \`count\` equals \`2\`.`,
    hints: [
      'The counter must be declared with let mut so you can call increment.',
      'Access the field directly with c.count inside the test.',
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
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn counts_up() {
        let mut c = Counter::new();
        c.increment();
        c.increment();
        assert_eq!(c.count, 2);
    }
}`,
    starter: `pub struct Counter {
    count: u32,
}

impl Counter {
    pub fn new() -> Counter {
        Counter { count: 0 }
    }

    pub fn increment(&mut self) {
        // TODO: add 1 to self.count
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn counts_up() {
        // TODO: increment twice and assert count == 2
    }
}`,
    tags: ['test', 'struct', 'method'],
  },
  {
    id: 'rs-ch11-c-025',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Test an Enum-Returning Function',
    prompt: `Define an enum \`Sign\` with variants \`Positive\`, \`Negative\`, and \`Zero\`, and derive \`PartialEq\` and \`Debug\` on it.

Define \`fn classify(n: i32) -> Sign\` that returns the matching variant. Write a test \`negative_is_detected\` asserting \`classify(-4)\` equals \`Sign::Negative\`.`,
    hints: [
      'assert_eq! needs both PartialEq and Debug derived on the enum to compare and print it.',
      'Use a match or if/else inside classify.',
    ],
    solution: `#[derive(PartialEq, Debug)]
enum Sign {
    Positive,
    Negative,
    Zero,
}

fn classify(n: i32) -> Sign {
    if n > 0 {
        Sign::Positive
    } else if n < 0 {
        Sign::Negative
    } else {
        Sign::Zero
    }
}

#[test]
fn negative_is_detected() {
    assert_eq!(classify(-4), Sign::Negative);
}`,
    starter: `#[derive(PartialEq, Debug)]
enum Sign {
    Positive,
    Negative,
    Zero,
}

fn classify(n: i32) -> Sign {
    // TODO: return the matching variant
    Sign::Zero
}

#[test]
fn negative_is_detected() {
    // TODO: assert classify(-4) == Sign::Negative
}`,
    tags: ['test', 'enum', 'assert_eq'],
  },
  {
    id: 'rs-ch11-c-026',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'should_panic on Empty Input',
    prompt: `Define \`fn first_char(s: &str) -> char\` that panics with the message \`empty string\` when \`s\` is empty, otherwise returns the first character (use \`s.chars().next().unwrap()\`).

Write a test \`empty_panics\` with \`#[should_panic(expected = "empty string")]\` that calls \`first_char("")\`.`,
    hints: [
      'Check s.is_empty() and panic! with the message when true.',
      'The expected text must appear in the panic message.',
    ],
    solution: `fn first_char(s: &str) -> char {
    if s.is_empty() {
        panic!("empty string");
    }
    s.chars().next().unwrap()
}

#[test]
#[should_panic(expected = "empty string")]
fn empty_panics() {
    first_char("");
}`,
    starter: `fn first_char(s: &str) -> char {
    // TODO: panic!("empty string") when s is empty
    s.chars().next().unwrap()
}

#[test]
// TODO: add #[should_panic(expected = "empty string")]
fn empty_panics() {
    first_char("");
}`,
    tags: ['test', 'should_panic', 'expected'],
  },
  {
    id: 'rs-ch11-c-027',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Two should_panic Range Checks',
    prompt: `Reuse the \`Guess::new(value)\` idea: it panics with \`less than or equal to 1\` when \`value < 1\` and with \`greater than or equal to 100\` when \`value > 100\`.

Write TWO tests:
1. \`less_than_1\` with \`#[should_panic(expected = "less than or equal to 1")]\` calling \`Guess::new(0)\`.
2. \`greater_than_100\` with \`#[should_panic(expected = "greater than or equal to 100")]\` calling \`Guess::new(200)\`.`,
    hints: [
      'Use two separate if branches so each path panics with its own message.',
      'Each expected string must match the corresponding panic message.',
    ],
    solution: `pub struct Guess {
    value: i32,
}

impl Guess {
    pub fn new(value: i32) -> Guess {
        if value < 1 {
            panic!("Guess value must be greater than 1, less than or equal to 1, got {}.", value);
        } else if value > 100 {
            panic!("Guess value must be less than 100, greater than or equal to 100, got {}.", value);
        }
        Guess { value }
    }
}

#[test]
#[should_panic(expected = "less than or equal to 1")]
fn less_than_1() {
    Guess::new(0);
}

#[test]
#[should_panic(expected = "greater than or equal to 100")]
fn greater_than_100() {
    Guess::new(200);
}`,
    starter: `pub struct Guess {
    value: i32,
}

impl Guess {
    pub fn new(value: i32) -> Guess {
        // TODO: panic with the two distinct messages
        Guess { value }
    }
}

// TODO: write less_than_1 and greater_than_100 with matching expected messages
`,
    tags: ['test', 'should_panic', 'expected'],
  },
  {
    id: 'rs-ch11-c-028',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Result Test That Reports Err',
    prompt: `Define \`fn divide(a: i32, b: i32) -> Result<i32, String>\` returning \`Err(String::from("divide by zero"))\` when \`b\` is 0, otherwise \`Ok(a / b)\`.

Write a Result-returning test \`divides_ten\` (\`-> Result<(), String>\`) that uses \`?\` on \`divide(10, 2)\`, asserts the quotient equals 5, and returns \`Ok(())\`.`,
    hints: [
      'Inside the test, let q = divide(10, 2)?; pulls out the Ok value.',
      'Then assert_eq!(q, 5); and finish with Ok(()).',
    ],
    solution: `fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err(String::from("divide by zero"))
    } else {
        Ok(a / b)
    }
}

#[test]
fn divides_ten() -> Result<(), String> {
    let q = divide(10, 2)?;
    assert_eq!(q, 5);
    Ok(())
}`,
    starter: `fn divide(a: i32, b: i32) -> Result<i32, String> {
    // TODO: Err on zero divisor, otherwise Ok(a / b)
    Ok(a / b)
}

#[test]
fn divides_ten() -> Result<(), String> {
    // TODO: use ? then assert the quotient is 5
}`,
    tags: ['test', 'result', 'question-mark'],
  },
  {
    id: 'rs-ch11-c-029',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Library With Tests Module',
    prompt: `Write a small library-style file with two public functions, \`add(a, b)\` and \`sub(a, b)\`, both taking and returning \`i32\`.

Add a \`#[cfg(test)] mod tests\` block (with \`use super::*;\`) containing two tests: \`add_works\` asserting \`add(2, 3)\` equals \`5\`, and \`sub_works\` asserting \`sub(5, 3)\` equals \`2\`.`,
    hints: [
      'Both functions can live at the top level; mark them pub.',
      'The tests module references them through use super::*;.',
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
    fn add_works() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn sub_works() {
        assert_eq!(sub(5, 3), 2);
    }
}`,
    starter: `pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

pub fn sub(a: i32, b: i32) -> i32 {
    a - b
}

#[cfg(test)]
mod tests {
    use super::*;

    // TODO: write add_works and sub_works
}`,
    tags: ['test', 'cfg-test', 'library'],
  },
  {
    id: 'rs-ch11-c-030',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Integration Test Layout',
    prompt: `Describe the integration-test setup in code form for a library crate named \`adder\` whose \`src/lib.rs\` exposes \`pub fn add_two(a: i32) -> i32\`.

Write the contents of the file \`tests/integration_test.rs\`: bring the crate into scope with \`use adder::add_two;\` and write a \`#[test]\` named \`it_adds_two\` asserting \`add_two(2)\` equals \`4\`. Note that integration tests need NO \`#[cfg(test)]\` because everything in the \`tests\` directory is test-only.`,
    hints: [
      'Each file in tests/ is its own crate that uses the library by name.',
      'No mod tests and no #[cfg(test)] are needed in integration test files.',
    ],
    solution: `// File: tests/integration_test.rs
use adder::add_two;

#[test]
fn it_adds_two() {
    assert_eq!(add_two(2), 4);
}`,
    starter: `// File: tests/integration_test.rs
// TODO: use adder::add_two; then write a #[test] named it_adds_two
`,
    tags: ['test', 'integration', 'layout'],
  },
  {
    id: 'rs-ch11-c-031',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Shared Common Test Module',
    prompt: `Integration tests often share helper code. Write the contents of \`tests/common/mod.rs\` containing a function \`pub fn setup()\` that, for this exercise, simply has an empty body (it would normally prepare test state).

Then write \`tests/integration_test.rs\`: declare the helper with \`mod common;\`, call \`common::setup();\` at the start of a \`#[test]\` named \`uses_setup\`, and assert \`1 + 1\` equals \`2\`.`,
    hints: [
      'Putting shared code in tests/common/mod.rs keeps it from being treated as its own test file.',
      'Bring it in with mod common; and call common::setup().',
    ],
    solution: `// File: tests/common/mod.rs
pub fn setup() {
    // shared setup code would go here
}

// File: tests/integration_test.rs
mod common;

#[test]
fn uses_setup() {
    common::setup();
    assert_eq!(1 + 1, 2);
}`,
    starter: `// File: tests/common/mod.rs
// TODO: pub fn setup() with an empty body

// File: tests/integration_test.rs
// TODO: mod common; then a #[test] that calls common::setup()
`,
    tags: ['test', 'integration', 'common-module'],
  },
  {
    id: 'rs-ch11-c-032',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Test a Generic Largest Function',
    prompt: `Define \`fn largest(list: &[i32]) -> i32\` that returns the largest value in the slice (assume the slice is non-empty).

In a \`#[cfg(test)] mod tests\` block, write a test \`finds_max\` that calls \`largest(&[34, 50, 25, 100, 65])\` and asserts the result equals \`100\`.`,
    hints: [
      'Track the largest seen so far while iterating with a for loop.',
      'Pass a borrowed array literal: &[34, 50, 25, 100, 65].',
    ],
    solution: `fn largest(list: &[i32]) -> i32 {
    let mut max = list[0];
    for &item in list {
        if item > max {
            max = item;
        }
    }
    max
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn finds_max() {
        assert_eq!(largest(&[34, 50, 25, 100, 65]), 100);
    }
}`,
    starter: `fn largest(list: &[i32]) -> i32 {
    // TODO: return the largest element
    list[0]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn finds_max() {
        // TODO: assert largest(&[34, 50, 25, 100, 65]) == 100
    }
}`,
    tags: ['test', 'slice', 'cfg-test'],
  },
  {
    id: 'rs-ch11-c-033',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Test Output With println!',
    prompt: `Define \`fn prints_and_returns(a: i32) -> i32\` that prints \`I got the value <a>\` with \`println!\` and then returns \`10\`.

Write a test \`this_test_will_pass\` asserting \`prints_and_returns(4)\` equals \`10\`. (Note: by default cargo captures the printed output of passing tests; you can see it with \`cargo test -- --show-output\`.)`,
    hints: [
      'The println! happens before the function returns 10.',
      'The assertion only checks the return value, not the printed text.',
    ],
    solution: `fn prints_and_returns(a: i32) -> i32 {
    println!("I got the value {}", a);
    10
}

#[test]
fn this_test_will_pass() {
    let value = prints_and_returns(4);
    assert_eq!(value, 10);
}`,
    starter: `fn prints_and_returns(a: i32) -> i32 {
    // TODO: println! the value, then return 10
    10
}

#[test]
fn this_test_will_pass() {
    // TODO: assert prints_and_returns(4) == 10
}`,
    tags: ['test', 'show-output', 'assert_eq'],
  },
  {
    id: 'rs-ch11-c-034',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Test Add and Remove on a Stack',
    prompt: `Define a struct \`Stack\` wrapping a \`Vec<i32>\`, with \`Stack::new()\`, \`fn push(&mut self, n: i32)\`, and \`fn pop(&mut self) -> Option<i32>\`.

In a \`#[cfg(test)] mod tests\` block, write a test \`push_then_pop\` that pushes 1 then 2, then asserts that \`pop()\` returns \`Some(2)\`.`,
    hints: [
      'Delegate push and pop to the inner Vec methods.',
      'Vec::pop already returns an Option, so pop can just call it.',
    ],
    solution: `pub struct Stack {
    items: Vec<i32>,
}

impl Stack {
    pub fn new() -> Stack {
        Stack { items: Vec::new() }
    }

    pub fn push(&mut self, n: i32) {
        self.items.push(n);
    }

    pub fn pop(&mut self) -> Option<i32> {
        self.items.pop()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn push_then_pop() {
        let mut s = Stack::new();
        s.push(1);
        s.push(2);
        assert_eq!(s.pop(), Some(2));
    }
}`,
    starter: `pub struct Stack {
    items: Vec<i32>,
}

impl Stack {
    pub fn new() -> Stack {
        Stack { items: Vec::new() }
    }

    pub fn push(&mut self, n: i32) {
        // TODO
    }

    pub fn pop(&mut self) -> Option<i32> {
        // TODO
        None
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn push_then_pop() {
        // TODO: push 1 and 2, assert pop() == Some(2)
    }
}`,
    tags: ['test', 'struct', 'option'],
  },
  {
    id: 'rs-ch11-c-035',
    chapter: 11,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Complete Test Suite',
    prompt: `Build a small module \`calc\` with three behaviors and a full test suite that exercises every chapter-11 testing tool you have learned.

Define \`pub fn add(a: i32, b: i32) -> i32\`, \`pub fn is_zero(n: i32) -> bool\`, and \`pub fn checked_sqrt_input(n: i32) -> i32\` that panics with \`negative input\` if \`n < 0\` and otherwise returns \`n\`.

In a \`#[cfg(test)] mod tests\` block write FOUR tests:
1. \`adds\` uses \`assert_eq!\` on \`add\`.
2. \`zero_detected\` uses \`assert!\` on \`is_zero(0)\`.
3. \`returns_result\` returns \`Result<(), String>\` and checks \`add(1, 1)\` equals 2.
4. \`rejects_negative\` uses \`#[should_panic(expected = "negative input")]\` on \`checked_sqrt_input(-1)\`.`,
    hints: [
      'Mark every function pub and pull them in with use super::*;.',
      'The Result test returns Ok(()) on success or Err(String) on mismatch.',
      'should_panic goes on its own line below #[test].',
    ],
    solution: `pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

pub fn is_zero(n: i32) -> bool {
    n == 0
}

pub fn checked_sqrt_input(n: i32) -> i32 {
    if n < 0 {
        panic!("negative input");
    }
    n
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn adds() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn zero_detected() {
        assert!(is_zero(0));
    }

    #[test]
    fn returns_result() -> Result<(), String> {
        if add(1, 1) == 2 {
            Ok(())
        } else {
            Err(String::from("add(1, 1) was not 2"))
        }
    }

    #[test]
    #[should_panic(expected = "negative input")]
    fn rejects_negative() {
        checked_sqrt_input(-1);
    }
}`,
    starter: `pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

pub fn is_zero(n: i32) -> bool {
    n == 0
}

pub fn checked_sqrt_input(n: i32) -> i32 {
    // TODO: panic!("negative input") when n < 0
    n
}

#[cfg(test)]
mod tests {
    use super::*;

    // TODO: adds (assert_eq!), zero_detected (assert!),
    //       returns_result (Result), rejects_negative (should_panic)
}`,
    tags: ['test', 'should_panic', 'result'],
  },
]

export default problems
