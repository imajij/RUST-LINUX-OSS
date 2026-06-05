import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch18-c-036',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Destructure a Tuple in a let',
    prompt: `In \`main\`, you are given \`let point = (3, -7, 12);\`. Use a single \`let\` statement with a pattern to bind the three components to variables \`x\`, \`y\`, and \`z\`.

Then print them so the output is exactly:
x=3 y=-7 z=12`,
    hints: [
      'A let statement uses a pattern on the left of the equals sign.',
      'A tuple pattern looks like (a, b, c).',
    ],
    solution: `fn main() {
    let point = (3, -7, 12);
    let (x, y, z) = point;
    println!("x={} y={} z={}", x, y, z);
}`,
    starter: `fn main() {
    let point = (3, -7, 12);
    // TODO: destructure point into x, y, z with one let
    // TODO: print "x=3 y=-7 z=12"
}`,
    tags: ['patterns', 'let', 'tuples'],
  },
  {
    id: 'rs-ch18-c-037',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Function Parameter as a Tuple Pattern',
    prompt: `Write a function \`print_coordinates(point: (i32, i32))\` that destructures its parameter directly in the parameter list into \`x\` and \`y\`, then prints:
Current location: (x, y)

For example, calling \`print_coordinates((4, 9))\` should print:
Current location: (4, 9)

Call it from \`main\` with the tuple \`(4, 9)\`.`,
    hints: [
      'Function parameters are patterns, so you can write fn f((a, b): (i32, i32)).',
      'Use the destructured names inside the function body.',
    ],
    solution: `fn print_coordinates(&(x, y): &(i32, i32)) {
    println!("Current location: ({}, {})", x, y);
}

fn main() {
    let point = (4, 9);
    print_coordinates(&point);
}`,
    starter: `fn print_coordinates(/* TODO: destructure the tuple here */) {
    // TODO: print "Current location: (x, y)"
}

fn main() {
    print_coordinates(&(4, 9));
}`,
    tags: ['patterns', 'functions', 'tuples'],
  },
  {
    id: 'rs-ch18-c-038',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Match Literal Numbers',
    prompt: `Write a function \`describe(n: i32) -> String\` that uses a \`match\` on literal values:
- \`1\` returns "one"
- \`2\` returns "two"
- \`3\` returns "three"
- anything else returns "many"

In \`main\`, call it with 1, 2, 3, and 50 and print each result on its own line.`,
    hints: [
      'Match arms can match literal values like 1, 2, 3.',
      'Use the wildcard _ for the catch-all arm.',
    ],
    solution: `fn describe(n: i32) -> String {
    match n {
        1 => String::from("one"),
        2 => String::from("two"),
        3 => String::from("three"),
        _ => String::from("many"),
    }
}

fn main() {
    for n in [1, 2, 3, 50] {
        println!("{}", describe(n));
    }
}`,
    starter: `fn describe(n: i32) -> String {
    // TODO: match on literals 1, 2, 3 and a catch-all
    todo!()
}

fn main() {
    for n in [1, 2, 3, 50] {
        println!("{}", describe(n));
    }
}`,
    tags: ['patterns', 'match', 'literals'],
  },
  {
    id: 'rs-ch18-c-039',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Or Patterns in a Match',
    prompt: `Write a function \`kind(c: char) -> &'static str\` that classifies a character using the or operator in a single match arm:
- if \`c\` is \`'a'\`, \`'e'\`, \`'i'\`, \`'o'\`, or \`'u'\` return "vowel"
- otherwise return "other"

In \`main\`, test it with \`'e'\`, \`'z'\`, and \`'o'\`, printing each result on its own line.`,
    hints: [
      'The or operator in a pattern is the pipe character, used as a | b | c.',
      'All listed chars can share one arm.',
    ],
    solution: `fn kind(c: char) -> &'static str {
    match c {
        'a' | 'e' | 'i' | 'o' | 'u' => "vowel",
        _ => "other",
    }
}

fn main() {
    for c in ['e', 'z', 'o'] {
        println!("{}", kind(c));
    }
}`,
    starter: `fn kind(c: char) -> &'static str {
    // TODO: use an or pattern for the vowels
    todo!()
}

fn main() {
    for c in ['e', 'z', 'o'] {
        println!("{}", kind(c));
    }
}`,
    tags: ['patterns', 'match', 'or'],
  },
  {
    id: 'rs-ch18-c-040',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Inclusive Range Patterns',
    prompt: `Write a function \`grade(score: u32) -> char\` that returns a letter grade using inclusive range patterns in a match:
- 90 through 100 returns 'A'
- 80 through 89 returns 'B'
- 70 through 79 returns 'C'
- anything else (0 through 69) returns 'F'

In \`main\`, test it with 95, 83, 72, and 40, printing each result on its own line.`,
    hints: [
      'An inclusive range pattern is written low..=high.',
      'Order the arms so each value falls into exactly one range, then use _ for the rest.',
    ],
    solution: `fn grade(score: u32) -> char {
    match score {
        90..=100 => 'A',
        80..=89 => 'B',
        70..=79 => 'C',
        _ => 'F',
    }
}

fn main() {
    for s in [95, 83, 72, 40] {
        println!("{}", grade(s));
    }
}`,
    starter: `fn grade(score: u32) -> char {
    // TODO: use inclusive range patterns
    todo!()
}

fn main() {
    for s in [95, 83, 72, 40] {
        println!("{}", grade(s));
    }
}`,
    tags: ['patterns', 'match', 'ranges'],
  },
  {
    id: 'rs-ch18-c-041',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Char Range Patterns',
    prompt: `Write a function \`classify(c: char) -> &'static str\` that uses inclusive range patterns over characters:
- 'a' through 'j' returns "early letter"
- 'k' through 'z' returns "late letter"
- '0' through '9' returns "digit"
- anything else returns "symbol"

In \`main\`, test it with 'c', 'q', '7', and '#', printing each result on its own line.`,
    hints: [
      'Range patterns work on chars too: \'a\'..=\'j\'.',
      'Use a wildcard arm for everything else.',
    ],
    solution: `fn classify(c: char) -> &'static str {
    match c {
        'a'..='j' => "early letter",
        'k'..='z' => "late letter",
        '0'..='9' => "digit",
        _ => "symbol",
    }
}

fn main() {
    for c in ['c', 'q', '7', '#'] {
        println!("{}", classify(c));
    }
}`,
    starter: `fn classify(c: char) -> &'static str {
    // TODO: use char range patterns
    todo!()
}

fn main() {
    for c in ['c', 'q', '7', '#'] {
        println!("{}", classify(c));
    }
}`,
    tags: ['patterns', 'match', 'ranges'],
  },
  {
    id: 'rs-ch18-c-042',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'while let to Drain a Stack',
    prompt: `In \`main\`, create \`let mut stack = vec![1, 2, 3, 4, 5];\`. Use a \`while let\` loop to pop values off the stack one at a time and print each popped value on its own line.

Because \`pop\` returns values from the end, the output should be:
5
4
3
2
1`,
    hints: [
      'pop() returns Some(value) while there are elements and None when empty.',
      'while let Some(top) = stack.pop() loops until pop returns None.',
    ],
    solution: `fn main() {
    let mut stack = vec![1, 2, 3, 4, 5];
    while let Some(top) = stack.pop() {
        println!("{}", top);
    }
}`,
    starter: `fn main() {
    let mut stack = vec![1, 2, 3, 4, 5];
    // TODO: while let loop that pops and prints each value
}`,
    tags: ['patterns', 'while-let', 'vec'],
  },
  {
    id: 'rs-ch18-c-043',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'for Loop with enumerate Destructuring',
    prompt: `In \`main\`, given \`let words = vec!["alpha", "beta", "gamma"];\`, use a \`for\` loop over \`words.iter().enumerate()\` and destructure each item into \`(index, value)\` in the loop pattern.

Print each as:
0: alpha
1: beta
2: gamma`,
    hints: [
      'enumerate() yields (index, element) tuples.',
      'The for loop pattern can destructure that tuple: for (i, v) in ... .',
    ],
    solution: `fn main() {
    let words = vec!["alpha", "beta", "gamma"];
    for (index, value) in words.iter().enumerate() {
        println!("{}: {}", index, value);
    }
}`,
    starter: `fn main() {
    let words = vec!["alpha", "beta", "gamma"];
    // TODO: for loop over enumerate(), destructure (index, value)
}`,
    tags: ['patterns', 'for', 'enumerate'],
  },
  {
    id: 'rs-ch18-c-044',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Destructure a Struct into Fields',
    prompt: `Define a struct \`Point { x: i32, y: i32 }\`. In \`main\`, create \`let p = Point { x: 0, y: 7 };\` and use a \`let\` with a struct pattern to destructure it into two variables \`a\` (from \`x\`) and \`b\` (from \`y\`).

Print exactly:
a=0 b=7`,
    hints: [
      'A struct pattern can rename fields: Point { x: a, y: b }.',
      'The names after the colon are the new bindings.',
    ],
    solution: `struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 0, y: 7 };
    let Point { x: a, y: b } = p;
    println!("a={} b={}", a, b);
}`,
    starter: `struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 0, y: 7 };
    // TODO: destructure into a and b, then print "a=0 b=7"
}`,
    tags: ['patterns', 'structs', 'destructuring'],
  },
  {
    id: 'rs-ch18-c-045',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Struct Field Shorthand in Patterns',
    prompt: `Define a struct \`Point { x: i32, y: i32 }\`. In \`main\`, create \`let p = Point { x: 5, y: 12 };\` and destructure it using the shorthand pattern that creates variables with the same names as the fields (\`x\` and \`y\`).

Print exactly:
x is 5, y is 12`,
    hints: [
      'When the binding name matches the field name you can write just Point { x, y }.',
      'No colon and no rename is needed in shorthand form.',
    ],
    solution: `struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 5, y: 12 };
    let Point { x, y } = p;
    println!("x is {}, y is {}", x, y);
}`,
    starter: `struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 5, y: 12 };
    // TODO: use shorthand struct pattern, then print "x is 5, y is 12"
}`,
    tags: ['patterns', 'structs', 'shorthand'],
  },
  {
    id: 'rs-ch18-c-046',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Match a Struct on the Axes',
    prompt: `Define a struct \`Point { x: i32, y: i32 }\`. Write a function \`locate(p: Point) -> String\` that matches \`p\` and reports where it sits using literal values inside the struct pattern:
- \`Point { x: 0, y: 0 }\` returns "origin"
- \`Point { x: 0, y }\` returns "on the y axis at {y}"
- \`Point { x, y: 0 }\` returns "on the x axis at {x}"
- any other point returns "elsewhere"

In \`main\`, test with (0,0), (0,4), (3,0), and (3,4), printing each result on its own line.`,
    hints: [
      'A struct pattern can mix literals (y: 0) and bindings (x).',
      'Order matters: list the most specific patterns first.',
    ],
    solution: `struct Point {
    x: i32,
    y: i32,
}

fn locate(p: Point) -> String {
    match p {
        Point { x: 0, y: 0 } => String::from("origin"),
        Point { x: 0, y } => format!("on the y axis at {}", y),
        Point { x, y: 0 } => format!("on the x axis at {}", x),
        _ => String::from("elsewhere"),
    }
}

fn main() {
    let pts = [
        Point { x: 0, y: 0 },
        Point { x: 0, y: 4 },
        Point { x: 3, y: 0 },
        Point { x: 3, y: 4 },
    ];
    for p in pts {
        println!("{}", locate(p));
    }
}`,
    starter: `struct Point {
    x: i32,
    y: i32,
}

fn locate(p: Point) -> String {
    // TODO: match using literals inside the struct pattern
    todo!()
}

fn main() {
    let pts = [
        Point { x: 0, y: 0 },
        Point { x: 0, y: 4 },
        Point { x: 3, y: 0 },
        Point { x: 3, y: 4 },
    ];
    for p in pts {
        println!("{}", locate(p));
    }
}`,
    tags: ['patterns', 'match', 'structs'],
  },
  {
    id: 'rs-ch18-c-047',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Destructure an Enum Variant',
    prompt: `Define an enum:
\`\`\`
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
}
\`\`\`
Write a function \`process(msg: Message) -> String\` that matches each variant:
- \`Quit\` returns "quit"
- \`Move { x, y }\` returns "move to {x},{y}"
- \`Write(text)\` returns "write: {text}"

In \`main\`, call it with each of the three variants and print the results, one per line.`,
    hints: [
      'Each enum variant has its own pattern shape: unit, struct-like, or tuple-like.',
      'Bind the inner data with names you can use in the arm.',
    ],
    solution: `enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
}

fn process(msg: Message) -> String {
    match msg {
        Message::Quit => String::from("quit"),
        Message::Move { x, y } => format!("move to {},{}", x, y),
        Message::Write(text) => format!("write: {}", text),
    }
}

fn main() {
    println!("{}", process(Message::Quit));
    println!("{}", process(Message::Move { x: 2, y: 5 }));
    println!("{}", process(Message::Write(String::from("hi"))));
}`,
    starter: `enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
}

fn process(msg: Message) -> String {
    // TODO: match each variant
    todo!()
}

fn main() {
    println!("{}", process(Message::Quit));
    println!("{}", process(Message::Move { x: 2, y: 5 }));
    println!("{}", process(Message::Write(String::from("hi"))));
}`,
    tags: ['patterns', 'match', 'enums'],
  },
  {
    id: 'rs-ch18-c-048',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Ignore Values with the Wildcard',
    prompt: `Write a function \`first_and_last(t: (i32, i32, i32, i32)) -> (i32, i32)\` that destructures the 4-tuple, ignoring the middle two values with wildcards, and returns a tuple of just the first and last elements.

In \`main\`, call it with \`(10, 20, 30, 40)\` and print the returned tuple using the debug format so it prints:
(10, 40)`,
    hints: [
      'Use _ in a tuple pattern to ignore a position.',
      'You can print a tuple with the debug formatter {:?}.',
    ],
    solution: `fn first_and_last(t: (i32, i32, i32, i32)) -> (i32, i32) {
    let (first, _, _, last) = t;
    (first, last)
}

fn main() {
    let result = first_and_last((10, 20, 30, 40));
    println!("{:?}", result);
}`,
    starter: `fn first_and_last(t: (i32, i32, i32, i32)) -> (i32, i32) {
    // TODO: ignore the middle two with wildcards
    todo!()
}

fn main() {
    let result = first_and_last((10, 20, 30, 40));
    println!("{:?}", result);
}`,
    tags: ['patterns', 'wildcard', 'tuples'],
  },
  {
    id: 'rs-ch18-c-049',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Match Guard with a Condition',
    prompt: `Write a function \`sign(n: i32) -> &'static str\` using a match with match guards:
- if \`n\` is 0 return "zero"
- if a bound value is greater than 0 return "positive"
- otherwise return "negative"

Use one arm that binds the value and a guard \`if x > 0\`, and a final arm for the negative case. In \`main\`, test with -5, 0, and 8, printing one result per line.`,
    hints: [
      'A match guard is an if expression after the pattern: Some(x) if x > 0 => ...',
      'Bind the number to a variable so the guard can test it.',
    ],
    solution: `fn sign(n: i32) -> &'static str {
    match n {
        0 => "zero",
        x if x > 0 => "positive",
        _ => "negative",
    }
}

fn main() {
    for n in [-5, 0, 8] {
        println!("{}", sign(n));
    }
}`,
    starter: `fn sign(n: i32) -> &'static str {
    // TODO: use a match guard for the positive case
    todo!()
}

fn main() {
    for n in [-5, 0, 8] {
        println!("{}", sign(n));
    }
}`,
    tags: ['patterns', 'match', 'guards'],
  },
  {
    id: 'rs-ch18-c-050',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'if let with an else',
    prompt: `In \`main\`, you have \`let config: Option<i32> = Some(42);\`. Use an \`if let\` to bind the inner value when it is \`Some\` and print:
Using configured value: 42

Add an \`else\` branch that prints:
No configuration set

Test by also running the same logic with \`None\` (write a small helper function \`report(config: Option<i32>)\` and call it with both \`Some(42)\` and \`None\`).`,
    hints: [
      'if let Some(v) = config { ... } else { ... }',
      'Put the logic in a helper so you can call it twice.',
    ],
    solution: `fn report(config: Option<i32>) {
    if let Some(v) = config {
        println!("Using configured value: {}", v);
    } else {
        println!("No configuration set");
    }
}

fn main() {
    report(Some(42));
    report(None);
}`,
    starter: `fn report(config: Option<i32>) {
    // TODO: if let with else
}

fn main() {
    report(Some(42));
    report(None);
}`,
    tags: ['patterns', 'if-let', 'option'],
  },
  {
    id: 'rs-ch18-c-051',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Ignore an Unused Variable with Underscore Prefix',
    prompt: `Write a function \`take_pair(a: i32, b: i32) -> i32\` that should keep both parameters in its signature but only use the second one, returning \`b * 10\`. Name the unused first parameter with a leading underscore so the compiler does not warn about it.

In \`main\`, call \`take_pair(99, 4)\` and print the result (expected: 40).`,
    hints: [
      'A name starting with underscore, like _a, silences the unused-variable warning.',
      'This differs from a bare _ because the value is still bound.',
    ],
    solution: `fn take_pair(_a: i32, b: i32) -> i32 {
    b * 10
}

fn main() {
    println!("{}", take_pair(99, 4));
}`,
    starter: `fn take_pair(/* TODO: name params, prefix the unused one */) -> i32 {
    // TODO: return b * 10
    todo!()
}

fn main() {
    println!("{}", take_pair(99, 4));
}`,
    tags: ['patterns', 'ignoring', 'underscore'],
  },
  {
    id: 'rs-ch18-c-052',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Match on a Reference Pattern',
    prompt: `In \`main\`, given \`let numbers = vec![1, 2, 3];\`, iterate with \`for n in &numbers\` so each \`n\` is a reference. Inside the loop, use a \`match\` that destructures the reference with the pattern \`&value\` to get an owned \`i32\`, then print "got: {value}" for each.

Expected output:
got: 1
got: 2
got: 3`,
    hints: [
      'Iterating over &vec yields &i32 references.',
      'A pattern like &value binds the pointed-to integer to value.',
    ],
    solution: `fn main() {
    let numbers = vec![1, 2, 3];
    for n in &numbers {
        match n {
            &value => println!("got: {}", value),
        }
    }
}`,
    starter: `fn main() {
    let numbers = vec![1, 2, 3];
    for n in &numbers {
        // TODO: match n with a &value pattern and print "got: {value}"
    }
}`,
    tags: ['patterns', 'match', 'references'],
  },
  {
    id: 'rs-ch18-c-053',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Multiple Patterns Returning the Same Arm',
    prompt: `Write a function \`days_in(month: u32) -> u32\` using or patterns:
- months 1, 3, 5, 7, 8, 10, 12 return 31
- months 4, 6, 9, 11 return 30
- month 2 returns 28
- any other number returns 0

In \`main\`, call it with 2, 4, 7, and 13, printing each result on its own line.`,
    hints: [
      'Group months that share a result with the | operator.',
      'A final _ arm covers invalid months.',
    ],
    solution: `fn days_in(month: u32) -> u32 {
    match month {
        1 | 3 | 5 | 7 | 8 | 10 | 12 => 31,
        4 | 6 | 9 | 11 => 30,
        2 => 28,
        _ => 0,
    }
}

fn main() {
    for m in [2, 4, 7, 13] {
        println!("{}", days_in(m));
    }
}`,
    starter: `fn days_in(month: u32) -> u32 {
    // TODO: use or patterns to group months
    todo!()
}

fn main() {
    for m in [2, 4, 7, 13] {
        println!("{}", days_in(m));
    }
}`,
    tags: ['patterns', 'match', 'or'],
  },
  {
    id: 'rs-ch18-c-054',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Mixed let Destructuring of Struct and Tuple',
    prompt: `Define a struct \`Pair { tag: char, coords: (i32, i32) }\`. In \`main\`, create \`let p = Pair { tag: 'A', coords: (8, 9) };\` and use a single \`let\` statement whose pattern destructures both the struct field \`tag\` and the nested tuple \`coords\` into \`tag\`, \`cx\`, and \`cy\`.

Print exactly:
A at 8,9`,
    hints: [
      'A struct pattern can nest a tuple pattern inside a field: Pair { tag, coords: (cx, cy) }.',
      'All three bindings come from one let.',
    ],
    solution: `struct Pair {
    tag: char,
    coords: (i32, i32),
}

fn main() {
    let p = Pair { tag: 'A', coords: (8, 9) };
    let Pair { tag, coords: (cx, cy) } = p;
    println!("{} at {},{}", tag, cx, cy);
}`,
    starter: `struct Pair {
    tag: char,
    coords: (i32, i32),
}

fn main() {
    let p = Pair { tag: 'A', coords: (8, 9) };
    // TODO: destructure tag, cx, cy in one let
    // TODO: print "A at 8,9"
}`,
    tags: ['patterns', 'let', 'nested'],
  },
  {
    id: 'rs-ch18-c-055',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Ignore the Rest of a Tuple',
    prompt: `Write a function \`endpoints(t: (i32, i32, i32, i32, i32)) -> (i32, i32)\` that returns just the first and last elements of a 5-tuple, using the rest pattern \`..\` to skip everything in between.

In \`main\`, call it with \`(1, 2, 3, 4, 5)\` and print the result with the debug formatter so it prints:
(1, 5)`,
    hints: [
      'The rest pattern .. ignores the middle of a tuple: (first, .., last).',
      'You can only use one .. per tuple pattern.',
    ],
    solution: `fn endpoints(t: (i32, i32, i32, i32, i32)) -> (i32, i32) {
    let (first, .., last) = t;
    (first, last)
}

fn main() {
    println!("{:?}", endpoints((1, 2, 3, 4, 5)));
}`,
    starter: `fn endpoints(t: (i32, i32, i32, i32, i32)) -> (i32, i32) {
    // TODO: use .. to skip the middle
    todo!()
}

fn main() {
    println!("{:?}", endpoints((1, 2, 3, 4, 5)));
}`,
    tags: ['patterns', 'rest', 'tuples'],
  },
  {
    id: 'rs-ch18-c-056',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'At-Binding to Capture and Test',
    prompt: `Write a function \`check_id(id: u32) -> String\` that uses an at-binding (the @ operator) in a match:
- if \`id\` is in the range 1 through 5, capture it as \`v\` and return "early id: {v}"
- if \`id\` is in the range 6 through 10, return "later id (no capture)"
- otherwise return "out of range"

In \`main\`, call it with 3, 8, and 20, printing each result on its own line.`,
    hints: [
      'The at-binding lets you bind a value while also testing it against a range: v @ 1..=5.',
      'Only the first arm needs to capture the value.',
    ],
    solution: `fn check_id(id: u32) -> String {
    match id {
        v @ 1..=5 => format!("early id: {}", v),
        6..=10 => String::from("later id (no capture)"),
        _ => String::from("out of range"),
    }
}

fn main() {
    for id in [3, 8, 20] {
        println!("{}", check_id(id));
    }
}`,
    starter: `fn check_id(id: u32) -> String {
    // TODO: use an at-binding for the 1..=5 arm
    todo!()
}

fn main() {
    for id in [3, 8, 20] {
        println!("{}", check_id(id));
    }
}`,
    tags: ['patterns', 'match', 'at-binding'],
  },
  {
    id: 'rs-ch18-c-057',
    chapter: 18,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Named Variable Shadowing in a Match Arm',
    prompt: `In \`main\`, set \`let x = Some(5);\` and \`let y = 10;\`. Write a \`match x\` with these arms:
- \`Some(50)\` prints "Got 50"
- \`Some(y)\` prints "Matched, inner y = {y}" (this y shadows the outer y)
- \`_\` prints "Default, x = {:?}" with x

After the match, print "at the end: x = {:?}, y = {}" using the OUTER x and y.

For \`x = Some(5)\`, the expected output is:
Matched, inner y = 5
at the end: x = Some(5), y = 10`,
    hints: [
      'A bare name in a pattern introduces a NEW variable that shadows any outer one with that name.',
      'The shadowing only lasts inside the match arm.',
    ],
    solution: `fn main() {
    let x = Some(5);
    let y = 10;

    match x {
        Some(50) => println!("Got 50"),
        Some(y) => println!("Matched, inner y = {}", y),
        _ => println!("Default, x = {:?}", x),
    }

    println!("at the end: x = {:?}, y = {}", x, y);
}`,
    starter: `fn main() {
    let x = Some(5);
    let y = 10;

    // TODO: match x with arms Some(50), Some(y), and _
    // TODO: then print the outer x and y
}`,
    tags: ['patterns', 'match', 'shadowing'],
  },
  {
    id: 'rs-ch18-c-058',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Ignore a Struct Field with Rest',
    prompt: `Define a struct \`Config { width: u32, height: u32, depth: u32 }\`. Write a function \`area(c: Config) -> u32\` that destructures only \`width\` and \`height\` using the rest pattern \`..\` to ignore the other field(s), then returns width times height.

In \`main\`, call it with \`Config { width: 4, height: 5, depth: 6 }\` and print the result (expected: 20).`,
    hints: [
      'In a struct pattern you can name the fields you want and use .. for the rest.',
      'Config { width, height, .. } ignores depth.',
    ],
    solution: `struct Config {
    width: u32,
    height: u32,
    depth: u32,
}

fn area(c: Config) -> u32 {
    let Config { width, height, .. } = c;
    width * height
}

fn main() {
    let c = Config { width: 4, height: 5, depth: 6 };
    println!("{}", area(c));
}`,
    starter: `struct Config {
    width: u32,
    height: u32,
    depth: u32,
}

fn area(c: Config) -> u32 {
    // TODO: destructure width and height, ignore the rest
    todo!()
}

fn main() {
    let c = Config { width: 4, height: 5, depth: 6 };
    println!("{}", area(c));
}`,
    tags: ['patterns', 'rest', 'structs'],
  },
  {
    id: 'rs-ch18-c-059',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'while let over an Iterator',
    prompt: `In \`main\`, create an iterator with \`let mut iter = (1..=4).into_iter();\`. Use a \`while let Some(n) = iter.next()\` loop to print the running total after adding each number.

Maintain a \`let mut total = 0;\` before the loop. Expected output:
1
3
6
10`,
    hints: [
      'next() returns Some(value) until the iterator is exhausted, then None.',
      'Add n to total inside the loop, then print total.',
    ],
    solution: `fn main() {
    let mut iter = (1..=4).into_iter();
    let mut total = 0;
    while let Some(n) = iter.next() {
        total += n;
        println!("{}", total);
    }
}`,
    starter: `fn main() {
    let mut iter = (1..=4).into_iter();
    let mut total = 0;
    // TODO: while let loop calling iter.next()
}`,
    tags: ['patterns', 'while-let', 'iterators'],
  },
  {
    id: 'rs-ch18-c-060',
    chapter: 18,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Refutable vs Irrefutable Fix',
    prompt: `The following code does NOT compile because it uses a refutable pattern (\`Some(x)\`) in a plain \`let\`, which requires an irrefutable pattern:
\`\`\`
let value: Option<i32> = Some(7);
let Some(x) = value;
println!("{}", x);
\`\`\`
Rewrite \`main\` so it compiles and prints \`7\`, by using \`if let\` (a place where refutable patterns are allowed) instead of a plain \`let\`. If the value is \`None\`, print "no value".`,
    hints: [
      'A plain let only accepts irrefutable patterns (ones that always match).',
      'Some(x) can fail to match (it is refutable), so move it into an if let.',
    ],
    solution: `fn main() {
    let value: Option<i32> = Some(7);
    if let Some(x) = value {
        println!("{}", x);
    } else {
        println!("no value");
    }
}`,
    starter: `fn main() {
    let value: Option<i32> = Some(7);
    // TODO: use if let instead of a plain let with Some(x)
}`,
    tags: ['patterns', 'refutable', 'if-let'],
  },
  {
    id: 'rs-ch18-c-061',
    chapter: 18,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Match Guard Combined with Or Pattern',
    prompt: `Write a function \`describe(n: i32, allow_high: bool) -> &'static str\` using a single match arm that combines an or pattern with a match guard:
- if \`n\` is 4, 5, or 6 AND \`allow_high\` is true, return "matched"
- otherwise return "not matched"

Note the guard applies to the whole or pattern. In \`main\`, test these calls and print each result on its own line:
describe(5, true)
describe(5, false)
describe(2, true)`,
    hints: [
      'The match guard if allow_high applies after the entire (4 | 5 | 6) pattern.',
      'A second arm with _ handles everything else.',
    ],
    solution: `fn describe(n: i32, allow_high: bool) -> &'static str {
    match n {
        4 | 5 | 6 if allow_high => "matched",
        _ => "not matched",
    }
}

fn main() {
    println!("{}", describe(5, true));
    println!("{}", describe(5, false));
    println!("{}", describe(2, true));
}`,
    starter: `fn describe(n: i32, allow_high: bool) -> &'static str {
    // TODO: combine an or pattern with a match guard
    todo!()
}

fn main() {
    println!("{}", describe(5, true));
    println!("{}", describe(5, false));
    println!("{}", describe(2, true));
}`,
    tags: ['patterns', 'match', 'guards'],
  },
  {
    id: 'rs-ch18-c-062',
    chapter: 18,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Nested Enum Destructuring',
    prompt: `Given these definitions:
\`\`\`
enum Color {
    Rgb(u8, u8, u8),
    Named(String),
}

enum Shape {
    Circle { radius: u32, fill: Color },
    Square { side: u32, fill: Color },
}
\`\`\`
Write a function \`fill_summary(s: Shape) -> String\` that matches a \`Shape\` and, in the same pattern, destructures the nested \`Color\`:
- a \`Circle\` filled with \`Rgb(r, g, b)\` returns "circle rgb {r},{g},{b}"
- a \`Square\` filled with \`Named(name)\` returns "square named {name}"
- any other combination returns "other"

In \`main\`, test with a Circle/Rgb and a Square/Named, printing each result on its own line.`,
    hints: [
      'You can nest the Color pattern inside the Shape struct-variant pattern.',
      'Circle { fill: Color::Rgb(r, g, b), .. } destructures both at once.',
    ],
    solution: `enum Color {
    Rgb(u8, u8, u8),
    Named(String),
}

enum Shape {
    Circle { radius: u32, fill: Color },
    Square { side: u32, fill: Color },
}

fn fill_summary(s: Shape) -> String {
    match s {
        Shape::Circle { fill: Color::Rgb(r, g, b), .. } => {
            format!("circle rgb {},{},{}", r, g, b)
        }
        Shape::Square { fill: Color::Named(name), .. } => {
            format!("square named {}", name)
        }
        _ => String::from("other"),
    }
}

fn main() {
    let c = Shape::Circle { radius: 3, fill: Color::Rgb(10, 20, 30) };
    let s = Shape::Square { side: 4, fill: Color::Named(String::from("red")) };
    println!("{}", fill_summary(c));
    println!("{}", fill_summary(s));
}`,
    starter: `enum Color {
    Rgb(u8, u8, u8),
    Named(String),
}

enum Shape {
    Circle { radius: u32, fill: Color },
    Square { side: u32, fill: Color },
}

fn fill_summary(s: Shape) -> String {
    // TODO: match Shape and destructure the nested Color
    todo!()
}

fn main() {
    let c = Shape::Circle { radius: 3, fill: Color::Rgb(10, 20, 30) };
    let s = Shape::Square { side: 4, fill: Color::Named(String::from("red")) };
    println!("{}", fill_summary(c));
    println!("{}", fill_summary(s));
}`,
    tags: ['patterns', 'match', 'nested'],
  },
  {
    id: 'rs-ch18-c-063',
    chapter: 18,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Destructure Nested Tuple of Structs',
    prompt: `Define a struct \`Point { x: i32, y: i32 }\`. In \`main\`, create the value \`let ((feet, inches), Point { x, y }) = ((3, 10), Point { x: 3, y: -10 });\`.

Then print exactly:
feet=3 inches=10 x=3 y=-10

The single \`let\` pattern must destructure the outer tuple, the inner tuple, AND the struct fields all at once.`,
    hints: [
      'Patterns nest freely: a tuple of (tuple, struct).',
      'Match the shape of the value exactly on the left of the let.',
    ],
    solution: `struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let ((feet, inches), Point { x, y }) = ((3, 10), Point { x: 3, y: -10 });
    println!("feet={} inches={} x={} y={}", feet, inches, x, y);
}`,
    starter: `struct Point {
    x: i32,
    y: i32,
}

fn main() {
    // TODO: one let that destructures ((feet, inches), Point { x, y })
    // from the value ((3, 10), Point { x: 3, y: -10 })
    // TODO: print "feet=3 inches=10 x=3 y=-10"
}`,
    tags: ['patterns', 'let', 'nested'],
  },
  {
    id: 'rs-ch18-c-064',
    chapter: 18,
    kind: 'coding',
    difficulty: 'hard',
    title: 'At-Binding Inside a Struct Pattern',
    prompt: `Define an enum with a struct-like variant:
\`\`\`
enum Message {
    Hello { id: u32 },
}
\`\`\`
Write a function \`greet(msg: Message) -> String\` that matches \`Message::Hello\` and uses an at-binding inside the struct pattern to both test \`id\` against a range and capture it:
- \`id\` in range 3 through 7 (capture as \`id_var\`) returns "Found id in range: {id_var}"
- \`id\` in range 10 through 12 returns "Found id in another range"
- any other \`id\` returns "Found some other id"

In \`main\`, test with ids 5, 11, and 100, printing each result on its own line.`,
    hints: [
      'Inside a struct-like variant pattern you can write id: id_var @ 3..=7.',
      'Capturing with @ lets you use the value in the arm while still range-testing it.',
    ],
    solution: `enum Message {
    Hello { id: u32 },
}

fn greet(msg: Message) -> String {
    match msg {
        Message::Hello { id: id_var @ 3..=7 } => {
            format!("Found id in range: {}", id_var)
        }
        Message::Hello { id: 10..=12 } => {
            String::from("Found id in another range")
        }
        Message::Hello { id } => {
            let _ = id;
            String::from("Found some other id")
        }
    }
}

fn main() {
    for id in [5, 11, 100] {
        println!("{}", greet(Message::Hello { id }));
    }
}`,
    starter: `enum Message {
    Hello { id: u32 },
}

fn greet(msg: Message) -> String {
    // TODO: use an at-binding inside the struct pattern for the 3..=7 case
    todo!()
}

fn main() {
    for id in [5, 11, 100] {
        println!("{}", greet(Message::Hello { id }));
    }
}`,
    tags: ['patterns', 'at-binding', 'enums'],
  },
  {
    id: 'rs-ch18-c-065',
    chapter: 18,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Match a Slice Pattern with Rest',
    prompt: `Write a function \`summarize(items: &[i32]) -> String\` that matches a slice and reports its shape:
- empty slice returns "empty"
- exactly one element \`[x]\` returns "one: {x}"
- two or more elements \`[first, .., last]\` returns "first {first}, last {last}"

In \`main\`, call it with the empty slice \`&[]\`, \`&[9]\`, and \`&[1, 2, 3, 4]\`, printing each result on its own line.`,
    hints: [
      'Slice patterns include [], [x], and [first, .., last].',
      'Pass slices as &[1, 2, 3]; the empty slice needs an explicit type like &[] as &[i32].',
    ],
    solution: `fn summarize(items: &[i32]) -> String {
    match items {
        [] => String::from("empty"),
        [x] => format!("one: {}", x),
        [first, .., last] => format!("first {}, last {}", first, last),
    }
}

fn main() {
    let empty: &[i32] = &[];
    println!("{}", summarize(empty));
    println!("{}", summarize(&[9]));
    println!("{}", summarize(&[1, 2, 3, 4]));
}`,
    starter: `fn summarize(items: &[i32]) -> String {
    // TODO: match slice patterns [], [x], [first, .., last]
    todo!()
}

fn main() {
    let empty: &[i32] = &[];
    println!("{}", summarize(empty));
    println!("{}", summarize(&[9]));
    println!("{}", summarize(&[1, 2, 3, 4]));
}`,
    tags: ['patterns', 'match', 'slices'],
  },
  {
    id: 'rs-ch18-c-066',
    chapter: 18,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Slice Pattern Capturing the Middle',
    prompt: `Write a function \`middle_sum(items: &[i32]) -> i32\` that matches a slice with the pattern \`[first, middle @ .., last]\` to capture the inner elements as a sub-slice named \`middle\`, then returns the sum of those middle elements. If the slice has fewer than 3 elements, return 0.

In \`main\`, call it with \`&[1, 2, 3, 4, 5]\` (middle is 2+3+4 = 9) and \`&[7, 8]\` (returns 0), printing each result on its own line.`,
    hints: [
      'Bind the rest as a sub-slice with middle @ .. inside the slice pattern.',
      'Iterate the captured middle slice to sum it.',
    ],
    solution: `fn middle_sum(items: &[i32]) -> i32 {
    match items {
        [_first, middle @ .., _last] => {
            let mut total = 0;
            for &m in middle {
                total += m;
            }
            total
        }
        _ => 0,
    }
}

fn main() {
    println!("{}", middle_sum(&[1, 2, 3, 4, 5]));
    println!("{}", middle_sum(&[7, 8]));
}`,
    starter: `fn middle_sum(items: &[i32]) -> i32 {
    // TODO: capture the middle with middle @ .. and sum it
    todo!()
}

fn main() {
    println!("{}", middle_sum(&[1, 2, 3, 4, 5]));
    println!("{}", middle_sum(&[7, 8]));
}`,
    tags: ['patterns', 'slices', 'at-binding'],
  },
  {
    id: 'rs-ch18-c-067',
    chapter: 18,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Match Guard Referencing an Outer Variable',
    prompt: `In \`main\`, set \`let n = Some(4);\` and \`let threshold = 5;\`. Write a \`match n\` where one arm uses a match guard that compares the bound inner value against the OUTER \`threshold\` (which is not shadowed because the guard does not introduce a new binding for it):
- \`Some(x) if x < threshold\` prints "below threshold: {x}"
- \`Some(x)\` prints "at or above: {x}"
- \`None\` prints "nothing"

For \`n = Some(4)\` and \`threshold = 5\`, the expected output is:
below threshold: 4`,
    hints: [
      'A match guard is ordinary code and can read variables from the enclosing scope.',
      'Bind the inner value with Some(x), then test x < threshold in the guard.',
    ],
    solution: `fn main() {
    let n = Some(4);
    let threshold = 5;

    match n {
        Some(x) if x < threshold => println!("below threshold: {}", x),
        Some(x) => println!("at or above: {}", x),
        None => println!("nothing"),
    }
}`,
    starter: `fn main() {
    let n = Some(4);
    let threshold = 5;

    // TODO: match n; first arm guard compares x against outer threshold
}`,
    tags: ['patterns', 'match', 'guards'],
  },
  {
    id: 'rs-ch18-c-068',
    chapter: 18,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Destructure While Iterating a Vec of Structs',
    prompt: `Define a struct \`Order { id: u32, total: f64, paid: bool }\`. In \`main\`, build a \`Vec<Order>\` with three orders (your choice of values, with at least one paid and one unpaid). Iterate over the vec, and in the \`for\` loop pattern destructure each order's fields directly with a struct pattern \`Order { id, total, paid }\` (iterating over references).

For each order print one of:
- "order {id}: {total} (paid)" when \`paid\` is true
- "order {id}: {total} (UNPAID)" when \`paid\` is false

Use an at-binding or guard as you see fit, but the loop pattern itself must destructure the struct.`,
    hints: [
      'for Order { id, total, paid } in &orders destructures each element by reference.',
      'When iterating &orders the bound fields are references; dereference or use them directly in formatting.',
    ],
    solution: `struct Order {
    id: u32,
    total: f64,
    paid: bool,
}

fn main() {
    let orders = vec![
        Order { id: 1, total: 19.99, paid: true },
        Order { id: 2, total: 4.50, paid: false },
        Order { id: 3, total: 100.0, paid: true },
    ];

    for Order { id, total, paid } in &orders {
        if *paid {
            println!("order {}: {} (paid)", id, total);
        } else {
            println!("order {}: {} (UNPAID)", id, total);
        }
    }
}`,
    starter: `struct Order {
    id: u32,
    total: f64,
    paid: bool,
}

fn main() {
    let orders = vec![
        Order { id: 1, total: 19.99, paid: true },
        Order { id: 2, total: 4.50, paid: false },
        Order { id: 3, total: 100.0, paid: true },
    ];

    // TODO: for Order { id, total, paid } in &orders { ... }
}`,
    tags: ['patterns', 'for', 'structs'],
  },
  {
    id: 'rs-ch18-c-069',
    chapter: 18,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Tokenizer with Match, Guards, and Ranges',
    prompt: `Write a function \`token_kind(c: char) -> &'static str\` that classifies a character into a token category using a single match that combines range patterns, or patterns, and a match guard:
- '0' through '9' returns "digit"
- 'a' through 'z' or 'A' through 'Z' returns "letter"
- a whitespace character (space, tab '\\t', or newline '\\n') returns "whitespace"
- '+', '-', '*', or '/' returns "operator"
- any other character, but only if it is ASCII (guard using \`c.is_ascii()\`), returns "ascii symbol"
- everything else returns "non-ascii"

In \`main\`, test with '7', 'Q', ' ', '*', '#', and a non-ascii char like '€', printing one result per line.`,
    hints: [
      'Mix range patterns ( \'0\'..=\'9\' ), or patterns ( \'+\' | \'-\' | ... ), and a guarded wildcard arm.',
      'Put the guarded _ if c.is_ascii() arm before the final catch-all _.',
    ],
    solution: `fn token_kind(c: char) -> &'static str {
    match c {
        '0'..='9' => "digit",
        'a'..='z' | 'A'..='Z' => "letter",
        ' ' | '\\t' | '\\n' => "whitespace",
        '+' | '-' | '*' | '/' => "operator",
        _ if c.is_ascii() => "ascii symbol",
        _ => "non-ascii",
    }
}

fn main() {
    for c in ['7', 'Q', ' ', '*', '#', '€'] {
        println!("{}", token_kind(c));
    }
}`,
    starter: `fn token_kind(c: char) -> &'static str {
    // TODO: combine ranges, or patterns, and a guarded arm
    todo!()
}

fn main() {
    for c in ['7', 'Q', ' ', '*', '#', '€'] {
        println!("{}", token_kind(c));
    }
}`,
    tags: ['patterns', 'match', 'guards'],
  },
  {
    id: 'rs-ch18-c-070',
    chapter: 18,
    kind: 'coding',
    difficulty: 'hard',
    title: 'A Tiny Expression Evaluator with Nested Patterns',
    prompt: `Define a recursive expression enum:
\`\`\`
enum Expr {
    Num(i32),
    Add(Box<Expr>, Box<Expr>),
    Mul(Box<Expr>, Box<Expr>),
    Neg(Box<Expr>),
}
\`\`\`
Write a function \`eval(e: &Expr) -> i32\` that matches each variant and evaluates the expression recursively. Also add a special case: an \`Add\` whose left side is exactly \`Num(0)\` should skip the addition and just evaluate the right side (match this with a nested pattern \`Add(left, right)\` plus a match guard or a nested literal pattern as you prefer).

In \`main\`, build the expression \`Mul(Add(Num(0), Num(4)), Neg(Num(3)))\` and print \`eval\` of it. The value is (0 + 4) * (-3) = -12, so it should print:
-12`,
    hints: [
      'Recurse by calling eval on the boxed sub-expressions; &**b or just passing &b works to get an &Expr.',
      'For the Num(0) special case, you can nest a pattern: Add(box-like) is not stable, so match Add(l, r) and check matches!(**l, Expr::Num(0)) or use a guard.',
      'Box can be dereferenced with *, so *left gives you the inner Expr to pattern-match or evaluate.',
    ],
    solution: `enum Expr {
    Num(i32),
    Add(Box<Expr>, Box<Expr>),
    Mul(Box<Expr>, Box<Expr>),
    Neg(Box<Expr>),
}

fn eval(e: &Expr) -> i32 {
    match e {
        Expr::Num(n) => *n,
        Expr::Add(left, right) => {
            // special case: left side is exactly Num(0)
            if let Expr::Num(0) = **left {
                eval(right)
            } else {
                eval(left) + eval(right)
            }
        }
        Expr::Mul(left, right) => eval(left) * eval(right),
        Expr::Neg(inner) => -eval(inner),
    }
}

fn main() {
    let expr = Expr::Mul(
        Box::new(Expr::Add(
            Box::new(Expr::Num(0)),
            Box::new(Expr::Num(4)),
        )),
        Box::new(Expr::Neg(Box::new(Expr::Num(3)))),
    );
    println!("{}", eval(&expr));
}`,
    starter: `enum Expr {
    Num(i32),
    Add(Box<Expr>, Box<Expr>),
    Mul(Box<Expr>, Box<Expr>),
    Neg(Box<Expr>),
}

fn eval(e: &Expr) -> i32 {
    // TODO: match each variant; special-case Add with a Num(0) left side
    todo!()
}

fn main() {
    let expr = Expr::Mul(
        Box::new(Expr::Add(
            Box::new(Expr::Num(0)),
            Box::new(Expr::Num(4)),
        )),
        Box::new(Expr::Neg(Box::new(Expr::Num(3)))),
    );
    println!("{}", eval(&expr));
}`,
    tags: ['patterns', 'match', 'nested', 'recursion'],
  },
]

export default problems
