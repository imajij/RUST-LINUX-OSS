import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch18-c-001',
    chapter: 18,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Match a Literal Number',
    prompt: `match arms can compare a value directly against literals. Write a function "describe" that takes an i32 and returns a &'static str: return "one" for 1, "two" for 2, "three" for 3, and "many" for everything else (use the _ wildcard arm). In main, print describe(2), which should print "two".`,
    hints: [
      'Each arm has the shape: pattern => expression,',
      'The last arm should be _ to catch all remaining values.',
    ],
    solution: `fn describe(n: i32) -> &'static str {
    match n {
        1 => "one",
        2 => "two",
        3 => "three",
        _ => "many",
    }
}

fn main() {
    println!("{}", describe(2));
}`,
    starter: `fn describe(n: i32) -> &'static str {
    // TODO: match n against 1, 2, 3, and use _ for the rest
    todo!()
}

fn main() {
    println!("{}", describe(2));
}`,
    tags: ['match', 'literals'],
  },
  {
    id: 'rs-ch18-c-002',
    chapter: 18,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Match a Character Literal',
    prompt: `Patterns can match char literals too. Write a function "is_vowel" that takes a char and returns a bool. Use a match that returns true for 'a', 'e', 'i', 'o', or 'u', and false otherwise. In main, print is_vowel('e') and is_vowel('z').`,
    hints: [
      'Combine several literals in one arm with the or operator (the vertical bar).',
      "Use 'a' | 'e' | 'i' | 'o' | 'u' on the left of the arm.",
    ],
    solution: `fn is_vowel(c: char) -> bool {
    match c {
        'a' | 'e' | 'i' | 'o' | 'u' => true,
        _ => false,
    }
}

fn main() {
    println!("{}", is_vowel('e'));
    println!("{}", is_vowel('z'));
}`,
    starter: `fn is_vowel(c: char) -> bool {
    // TODO: match c against the vowel literals
    todo!()
}

fn main() {
    println!("{}", is_vowel('e'));
    println!("{}", is_vowel('z'));
}`,
    tags: ['match', 'literals', 'or-pattern'],
  },
  {
    id: 'rs-ch18-c-003',
    chapter: 18,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Destructure a Tuple With let',
    prompt: `A let statement can destructure a tuple into named variables. Given the tuple let point = (3, 7);, use a single let with a tuple pattern to bind x and y to the two elements. Then print "x = 3, y = 7" using those variables.`,
    hints: [
      'Write let (x, y) = point; to bind both fields at once.',
      'The pattern shape on the left mirrors the tuple shape on the right.',
    ],
    solution: `fn main() {
    let point = (3, 7);
    let (x, y) = point;
    println!("x = {}, y = {}", x, y);
}`,
    starter: `fn main() {
    let point = (3, 7);
    // TODO: destructure point into x and y with one let
    // TODO: print "x = 3, y = 7"
}`,
    tags: ['let', 'destructuring', 'tuple'],
  },
  {
    id: 'rs-ch18-c-004',
    chapter: 18,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Tuple Pattern in a Function Parameter',
    prompt: `Function parameters are patterns, so you can destructure a tuple right in the signature. Write a function with signature fn print_coords(&(x, y): &(i32, i32)) that prints "Current location: (3, 5)" style output, i.e. "Current location: (" then x ", " y ")". Call it in main with print_coords(&(3, 5)).`,
    hints: [
      'The parameter pattern &(x, y) destructures a reference to a tuple.',
      'Inside the body x and y are plain i32 values you can print.',
    ],
    solution: `fn print_coords(&(x, y): &(i32, i32)) {
    println!("Current location: ({}, {})", x, y);
}

fn main() {
    print_coords(&(3, 5));
}`,
    starter: `fn print_coords(&(x, y): &(i32, i32)) {
    // TODO: print "Current location: (3, 5)"
    todo!()
}

fn main() {
    print_coords(&(3, 5));
}`,
    tags: ['function-params', 'destructuring', 'tuple'],
  },
  {
    id: 'rs-ch18-c-005',
    chapter: 18,
    kind: 'coding',
    difficulty: 'intro',
    title: 'if let With an Option',
    prompt: `if let runs a block only when a refutable pattern matches. Given let favorite: Option<i32> = Some(7);, use if let Some(value) = favorite to print "Favorite is 7", and add an else that prints "No favorite". Run it as written so it prints the Some branch.`,
    hints: [
      'The pattern Some(value) binds the inner number to value.',
      'if let ... { } else { } lets you handle the non-matching case.',
    ],
    solution: `fn main() {
    let favorite: Option<i32> = Some(7);
    if let Some(value) = favorite {
        println!("Favorite is {}", value);
    } else {
        println!("No favorite");
    }
}`,
    starter: `fn main() {
    let favorite: Option<i32> = Some(7);
    // TODO: use if let Some(value) = favorite { ... } else { ... }
}`,
    tags: ['if-let', 'option', 'refutable'],
  },
  {
    id: 'rs-ch18-c-006',
    chapter: 18,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Pop a Stack With while let',
    prompt: `while let keeps looping as long as a pattern matches. Build a Vec<i32> stack with the values 1, 2, 3 pushed in that order. Use while let Some(top) = stack.pop() to print each value on its own line. Because pop removes from the end, the output should be 3, then 2, then 1.`,
    hints: [
      'pop returns Option<i32>: Some(value) while items remain, then None.',
      'while let Some(top) = stack.pop() ends automatically when pop returns None.',
    ],
    solution: `fn main() {
    let mut stack = Vec::new();
    stack.push(1);
    stack.push(2);
    stack.push(3);

    while let Some(top) = stack.pop() {
        println!("{}", top);
    }
}`,
    starter: `fn main() {
    let mut stack = Vec::new();
    stack.push(1);
    stack.push(2);
    stack.push(3);

    // TODO: while let Some(top) = stack.pop() { println!("{}", top); }
}`,
    tags: ['while-let', 'vec', 'stack'],
  },
  {
    id: 'rs-ch18-c-007',
    chapter: 18,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Enumerate in a for Loop',
    prompt: `for loops take a pattern too. Iterate over the vector vec!['a', 'b', 'c'] with .iter().enumerate() and destructure each item as (index, value) in the for pattern. Print lines like "0: a", "1: b", "2: c".`,
    hints: [
      'enumerate yields tuples of (usize, &char).',
      'Write for (index, value) in v.iter().enumerate() { ... }.',
    ],
    solution: `fn main() {
    let v = vec!['a', 'b', 'c'];
    for (index, value) in v.iter().enumerate() {
        println!("{}: {}", index, value);
    }
}`,
    starter: `fn main() {
    let v = vec!['a', 'b', 'c'];
    // TODO: for (index, value) in v.iter().enumerate() { ... }
}`,
    tags: ['for-loop', 'enumerate', 'destructuring'],
  },
  {
    id: 'rs-ch18-c-008',
    chapter: 18,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Match With the Or Operator',
    prompt: `One arm can match several values using the or operator. Write a function "day_type" that takes an i32 representing a day number 1..=7 and returns a &'static str. Return "weekend" for 6 or 7 (use 6 | 7 in one arm) and "weekday" for everything else. Print day_type(6) and day_type(3).`,
    hints: [
      'Combine the two weekend values with the vertical bar: 6 | 7.',
      'A single _ arm can cover the weekdays.',
    ],
    solution: `fn day_type(day: i32) -> &'static str {
    match day {
        6 | 7 => "weekend",
        _ => "weekday",
    }
}

fn main() {
    println!("{}", day_type(6));
    println!("{}", day_type(3));
}`,
    starter: `fn day_type(day: i32) -> &'static str {
    // TODO: match with 6 | 7 => "weekend", else "weekday"
    todo!()
}

fn main() {
    println!("{}", day_type(6));
    println!("{}", day_type(3));
}`,
    tags: ['match', 'or-pattern'],
  },
  {
    id: 'rs-ch18-c-009',
    chapter: 18,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Match an Inclusive Range',
    prompt: `Inclusive ranges in patterns use the ..= syntax. Write a function "grade" that takes an i32 score and returns a char: 'A' for 90..=100, 'B' for 80..=89, 'C' for 70..=79, and 'F' for anything else. Print grade(85) which should be 'B'.`,
    hints: [
      'Range patterns are written like 90..=100.',
      'Order arms from high to low and finish with a _ arm.',
    ],
    solution: `fn grade(score: i32) -> char {
    match score {
        90..=100 => 'A',
        80..=89 => 'B',
        70..=79 => 'C',
        _ => 'F',
    }
}

fn main() {
    println!("{}", grade(85));
}`,
    starter: `fn grade(score: i32) -> char {
    // TODO: match score against inclusive ranges
    todo!()
}

fn main() {
    println!("{}", grade(85));
}`,
    tags: ['match', 'range'],
  },
  {
    id: 'rs-ch18-c-010',
    chapter: 18,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Match a Range of Characters',
    prompt: `Range patterns work on chars as well as numbers. Write a function "kind_of" that takes a char and returns a &'static str: "lowercase" for 'a'..='z', "uppercase" for 'A'..='Z', "digit" for '0'..='9', and "other" otherwise. Print kind_of('k') and kind_of('5').`,
    hints: [
      "Character ranges look like 'a'..='z'.",
      'Use a final _ arm for "other".',
    ],
    solution: `fn kind_of(c: char) -> &'static str {
    match c {
        'a'..='z' => "lowercase",
        'A'..='Z' => "uppercase",
        '0'..='9' => "digit",
        _ => "other",
    }
}

fn main() {
    println!("{}", kind_of('k'));
    println!("{}", kind_of('5'));
}`,
    starter: `fn kind_of(c: char) -> &'static str {
    // TODO: match c against character ranges
    todo!()
}

fn main() {
    println!("{}", kind_of('k'));
    println!("{}", kind_of('5'));
}`,
    tags: ['match', 'range', 'char'],
  },
  {
    id: 'rs-ch18-c-011',
    chapter: 18,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Ignore a Value With the Wildcard',
    prompt: `The _ pattern matches anything without binding it. Destructure the tuple let triple = (10, 20, 30); with a let pattern that captures the first and last elements as a and c but ignores the middle with _. Print "a = 10, c = 30".`,
    hints: [
      'Write let (a, _, c) = triple; to skip the middle element.',
      '_ does not bind a name, so you cannot use the middle value.',
    ],
    solution: `fn main() {
    let triple = (10, 20, 30);
    let (a, _, c) = triple;
    println!("a = {}, c = {}", a, c);
}`,
    starter: `fn main() {
    let triple = (10, 20, 30);
    // TODO: let (a, _, c) = triple; then print "a = 10, c = 30"
}`,
    tags: ['let', 'wildcard', 'tuple'],
  },
  {
    id: 'rs-ch18-c-012',
    chapter: 18,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Match a Boolean',
    prompt: `Match arms can use the literals true and false. Write a function "yes_no" that takes a bool and returns a &'static str: "yes" for true and "no" for false. Because there are only two boolean values, you do not need a wildcard. Print yes_no(true) and yes_no(false).`,
    hints: [
      'The arms are true => ... and false => ....',
      'A bool match with both arms is exhaustive, so no _ is needed.',
    ],
    solution: `fn yes_no(b: bool) -> &'static str {
    match b {
        true => "yes",
        false => "no",
    }
}

fn main() {
    println!("{}", yes_no(true));
    println!("{}", yes_no(false));
}`,
    starter: `fn yes_no(b: bool) -> &'static str {
    // TODO: match true => "yes", false => "no"
    todo!()
}

fn main() {
    println!("{}", yes_no(true));
    println!("{}", yes_no(false));
}`,
    tags: ['match', 'literals', 'bool'],
  },
  {
    id: 'rs-ch18-c-013',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Destructure a Struct Into Fields',
    prompt: `Define a struct Point { x: i32, y: i32 }. In main, create let p = Point { x: 4, y: 9 }; and use a let pattern Point { x: a, y: b } to bind the fields to a and b. Print "a = 4, b = 9".`,
    hints: [
      'The pattern Point { x: a, y: b } renames each field as it destructures.',
      'You could also use the shorthand Point { x, y } to bind variables named x and y.',
    ],
    solution: `struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 4, y: 9 };
    let Point { x: a, y: b } = p;
    println!("a = {}, b = {}", a, b);
}`,
    starter: `struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 4, y: 9 };
    // TODO: destructure p into a and b, then print "a = 4, b = 9"
}`,
    tags: ['destructuring', 'struct', 'let'],
  },
  {
    id: 'rs-ch18-c-014',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Struct Field Shorthand Destructuring',
    prompt: `When the variable names match the field names you can use shorthand. Define struct Point { x: i32, y: i32 } and create let p = Point { x: 0, y: 8 };. Use the shorthand pattern let Point { x, y } = p; (no renaming) and print "x = 0, y = 8".`,
    hints: [
      'Shorthand Point { x, y } creates variables x and y directly.',
      'No colon is needed when the variable name equals the field name.',
    ],
    solution: `struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 0, y: 8 };
    let Point { x, y } = p;
    println!("x = {}, y = {}", x, y);
}`,
    starter: `struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 0, y: 8 };
    // TODO: let Point { x, y } = p; then print "x = 0, y = 8"
}`,
    tags: ['destructuring', 'struct', 'shorthand'],
  },
  {
    id: 'rs-ch18-c-015',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Match on Struct Fields With Literals',
    prompt: `You can mix literals into a struct pattern to test which axis a point sits on. Define struct Point { x: i32, y: i32 }. Write a function "axis" taking a Point that returns a &'static str: "on x axis" when y is 0 (pattern Point { x: _, y: 0 }), "on y axis" when x is 0, and "elsewhere" otherwise. Print axis for Point { x: 5, y: 0 } and Point { x: 2, y: 3 }.`,
    hints: [
      'A pattern like Point { x: _, y: 0 } matches when the y field equals 0.',
      'Order the y-is-0 and x-is-0 arms before the catch-all _ arm.',
    ],
    solution: `struct Point {
    x: i32,
    y: i32,
}

fn axis(p: Point) -> &'static str {
    match p {
        Point { x: _, y: 0 } => "on x axis",
        Point { x: 0, y: _ } => "on y axis",
        _ => "elsewhere",
    }
}

fn main() {
    println!("{}", axis(Point { x: 5, y: 0 }));
    println!("{}", axis(Point { x: 2, y: 3 }));
}`,
    starter: `struct Point {
    x: i32,
    y: i32,
}

fn axis(p: Point) -> &'static str {
    // TODO: match struct fields with literal 0 in patterns
    todo!()
}

fn main() {
    println!("{}", axis(Point { x: 5, y: 0 }));
    println!("{}", axis(Point { x: 2, y: 3 }));
}`,
    tags: ['match', 'struct', 'literals'],
  },
  {
    id: 'rs-ch18-c-016',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Match Enum Variants',
    prompt: `Define enum Light { Red, Yellow, Green }. Write a function "action" taking a Light that returns a &'static str: "stop" for Red, "slow" for Yellow, and "go" for Green. Because every variant is covered, no wildcard is needed. Print action(Light::Green).`,
    hints: [
      'Each arm names a variant, like Light::Red => "stop".',
      'Covering all variants makes the match exhaustive with no _ arm.',
    ],
    solution: `enum Light {
    Red,
    Yellow,
    Green,
}

fn action(light: Light) -> &'static str {
    match light {
        Light::Red => "stop",
        Light::Yellow => "slow",
        Light::Green => "go",
    }
}

fn main() {
    println!("{}", action(Light::Green));
}`,
    starter: `enum Light {
    Red,
    Yellow,
    Green,
}

fn action(light: Light) -> &'static str {
    // TODO: match each Light variant
    todo!()
}

fn main() {
    println!("{}", action(Light::Green));
}`,
    tags: ['match', 'enum'],
  },
  {
    id: 'rs-ch18-c-017',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Destructure Data-Carrying Enum Variants',
    prompt: `Define enum Shape { Circle(f64), Rectangle(f64, f64) }. Write a function "area" taking a Shape returning f64: for Circle(r) return 3.14 * r * r; for Rectangle(w, h) return w * h. In main, print area(Shape::Circle(2.0)) and area(Shape::Rectangle(3.0, 4.0)).`,
    hints: [
      'The pattern Shape::Circle(r) binds the radius to r.',
      'The pattern Shape::Rectangle(w, h) binds both fields.',
    ],
    solution: `enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
}

fn area(shape: Shape) -> f64 {
    match shape {
        Shape::Circle(r) => 3.14 * r * r,
        Shape::Rectangle(w, h) => w * h,
    }
}

fn main() {
    println!("{}", area(Shape::Circle(2.0)));
    println!("{}", area(Shape::Rectangle(3.0, 4.0)));
}`,
    starter: `enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
}

fn area(shape: Shape) -> f64 {
    // TODO: match and destructure each variant
    todo!()
}

fn main() {
    println!("{}", area(Shape::Circle(2.0)));
    println!("{}", area(Shape::Rectangle(3.0, 4.0)));
}`,
    tags: ['match', 'enum', 'destructuring'],
  },
  {
    id: 'rs-ch18-c-018',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Destructure a Struct-Like Enum Variant',
    prompt: `Define enum Message { Move { x: i32, y: i32 }, Quit }. Write a function "describe" taking a Message returning String: for Move { x, y } return "Move to (x, y)" with the real numbers, and for Quit return "Quit". Print describe for Message::Move { x: 1, y: 2 } and Message::Quit.`,
    hints: [
      'A struct-like variant is matched with Message::Move { x, y }.',
      'Use format! or println! with the bound x and y.',
    ],
    solution: `enum Message {
    Move { x: i32, y: i32 },
    Quit,
}

fn describe(msg: Message) -> String {
    match msg {
        Message::Move { x, y } => format!("Move to ({}, {})", x, y),
        Message::Quit => String::from("Quit"),
    }
}

fn main() {
    println!("{}", describe(Message::Move { x: 1, y: 2 }));
    println!("{}", describe(Message::Quit));
}`,
    starter: `enum Message {
    Move { x: i32, y: i32 },
    Quit,
}

fn describe(msg: Message) -> String {
    // TODO: match Message::Move { x, y } and Message::Quit
    todo!()
}

fn main() {
    println!("{}", describe(Message::Move { x: 1, y: 2 }));
    println!("{}", describe(Message::Quit));
}`,
    tags: ['match', 'enum', 'struct-variant'],
  },
  {
    id: 'rs-ch18-c-019',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Match Guard',
    prompt: `A match guard is an extra if condition after a pattern. Write a function "sign" taking an i32 that returns a &'static str: bind the value with a pattern variable and use guards to return "negative" when n < 0, "zero" when n == 0, and "positive" otherwise. Print sign(-4), sign(0), and sign(7).`,
    hints: [
      'A guarded arm looks like n if n < 0 => "negative".',
      'The pattern n binds the value so the guard can test it.',
    ],
    solution: `fn sign(n: i32) -> &'static str {
    match n {
        n if n < 0 => "negative",
        0 => "zero",
        _ => "positive",
    }
}

fn main() {
    println!("{}", sign(-4));
    println!("{}", sign(0));
    println!("{}", sign(7));
}`,
    starter: `fn sign(n: i32) -> &'static str {
    // TODO: use a match guard for the negative case
    todo!()
}

fn main() {
    println!("{}", sign(-4));
    println!("{}", sign(0));
    println!("{}", sign(7));
}`,
    tags: ['match', 'guard'],
  },
  {
    id: 'rs-ch18-c-020',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Even or Odd With a Match Guard',
    prompt: `Match guards can express conditions ranges cannot. Write a function "parity" taking an i32 returning a &'static str: use a guarded arm n if n % 2 == 0 to return "even" and a catch-all arm for "odd". Print parity(10) and parity(7).`,
    hints: [
      'Bind the value with n and add the guard if n % 2 == 0.',
      'The wildcard _ arm covers the odd case.',
    ],
    solution: `fn parity(n: i32) -> &'static str {
    match n {
        n if n % 2 == 0 => "even",
        _ => "odd",
    }
}

fn main() {
    println!("{}", parity(10));
    println!("{}", parity(7));
}`,
    starter: `fn parity(n: i32) -> &'static str {
    // TODO: guard with n % 2 == 0 for even, else odd
    todo!()
}

fn main() {
    println!("{}", parity(10));
    println!("{}", parity(7));
}`,
    tags: ['match', 'guard'],
  },
  {
    id: 'rs-ch18-c-021',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'An At-Binding',
    prompt: `The at operator (@) lets you test a range and capture the matching value at the same time. Write a function "classify" taking an i32 id returning a String. When the id is in 1..=5, return "small id: N" using the bound value (pattern small @ 1..=5). When it is in 6..=10, return "mid id: N". Otherwise return "out of range". Print classify(3) and classify(12).`,
    hints: [
      'Write small @ 1..=5 to both range-check and bind the value.',
      'Use the captured variable inside the arm body.',
    ],
    solution: `fn classify(id: i32) -> String {
    match id {
        small @ 1..=5 => format!("small id: {}", small),
        mid @ 6..=10 => format!("mid id: {}", mid),
        _ => String::from("out of range"),
    }
}

fn main() {
    println!("{}", classify(3));
    println!("{}", classify(12));
}`,
    starter: `fn classify(id: i32) -> String {
    // TODO: use an at-binding like small @ 1..=5
    todo!()
}

fn main() {
    println!("{}", classify(3));
    println!("{}", classify(12));
}`,
    tags: ['match', 'at-binding', 'range'],
  },
  {
    id: 'rs-ch18-c-022',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Ignore Trailing Tuple Fields With Rest',
    prompt: `The .. pattern ignores the remaining parts of a value. Given let numbers = (2, 4, 8, 16, 32);, use a let pattern that binds only the first element as first and the last element as last, ignoring the middle with .. (pattern (first, .., last)). Print "first = 2, last = 32".`,
    hints: [
      'The .. in the middle stands for any number of skipped elements.',
      'Write let (first, .., last) = numbers;.',
    ],
    solution: `fn main() {
    let numbers = (2, 4, 8, 16, 32);
    let (first, .., last) = numbers;
    println!("first = {}, last = {}", first, last);
}`,
    starter: `fn main() {
    let numbers = (2, 4, 8, 16, 32);
    // TODO: let (first, .., last) = numbers; then print first and last
}`,
    tags: ['rest', 'tuple', 'let'],
  },
  {
    id: 'rs-ch18-c-023',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Ignore Struct Fields With Rest',
    prompt: `Inside a struct pattern, .. ignores every field you do not name. Define struct Config { width: u32, height: u32, title: String }. Write a function "width_of" that takes a Config and returns its width using the pattern Config { width, .. } so the other fields are ignored. Print width_of for Config { width: 80, height: 24, title: String::from("term") }.`,
    hints: [
      'Config { width, .. } binds width and ignores the rest.',
      'The .. must come last inside the braces.',
    ],
    solution: `struct Config {
    width: u32,
    height: u32,
    title: String,
}

fn width_of(c: Config) -> u32 {
    let Config { width, .. } = c;
    width
}

fn main() {
    let cfg = Config {
        width: 80,
        height: 24,
        title: String::from("term"),
    };
    println!("{}", width_of(cfg));
}`,
    starter: `struct Config {
    width: u32,
    height: u32,
    title: String,
}

fn width_of(c: Config) -> u32 {
    // TODO: use Config { width, .. } to grab only width
    todo!()
}

fn main() {
    let cfg = Config {
        width: 80,
        height: 24,
        title: String::from("term"),
    };
    println!("{}", width_of(cfg));
}`,
    tags: ['rest', 'struct', 'destructuring'],
  },
  {
    id: 'rs-ch18-c-024',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Refutable vs Irrefutable Reasoning',
    prompt: `let requires an irrefutable pattern, while if let allows a refutable one. The starter has a line that will NOT compile because Some(x) can fail to match. Fix it by changing the broken let into an if let that binds x and prints it, with an else that prints "got nothing". Use let value: Option<i32> = Some(5);.`,
    hints: [
      'let Some(x) = value; is refutable, so the compiler rejects it.',
      'if let Some(x) = value { ... } else { ... } is the correct refutable form.',
    ],
    solution: `fn main() {
    let value: Option<i32> = Some(5);
    if let Some(x) = value {
        println!("{}", x);
    } else {
        println!("got nothing");
    }
}`,
    starter: `fn main() {
    let value: Option<i32> = Some(5);
    // The next line does NOT compile: Some(x) is refutable.
    // let Some(x) = value;
    // println!("{}", x);
    // TODO: rewrite it using if let ... else
}`,
    tags: ['if-let', 'refutable', 'option'],
  },
  {
    id: 'rs-ch18-c-025',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Nested Destructuring of a Tuple of Structs',
    prompt: `Patterns nest to match deeply structured data. Define struct Point { x: i32, y: i32 }. Given let pair = (Point { x: 1, y: 2 }, Point { x: 3, y: 4 });, use one let with the pattern (Point { x: x1, y: y1 }, Point { x: x2, y: y2 }) to bind all four coordinates. Print "1 2 3 4".`,
    hints: [
      'The outer pattern is a tuple; each element is a struct pattern.',
      'Rename fields so the four variables are distinct.',
    ],
    solution: `struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let pair = (Point { x: 1, y: 2 }, Point { x: 3, y: 4 });
    let (Point { x: x1, y: y1 }, Point { x: x2, y: y2 }) = pair;
    println!("{} {} {} {}", x1, y1, x2, y2);
}`,
    starter: `struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let pair = (Point { x: 1, y: 2 }, Point { x: 3, y: 4 });
    // TODO: destructure both points in one let, then print "1 2 3 4"
}`,
    tags: ['destructuring', 'nested', 'struct'],
  },
  {
    id: 'rs-ch18-c-026',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Nested Enum and Struct Pattern',
    prompt: `Define struct Point { x: i32, y: i32 } and enum Event { Click(Point), Scroll(i32) }. Write a function "report" taking an Event returning String: for Click(Point { x, y }) return "click at (x, y)" with the numbers, and for Scroll(amount) return "scroll by amount". Print report for Event::Click(Point { x: 7, y: 8 }) and Event::Scroll(-3).`,
    hints: [
      'The pattern Event::Click(Point { x, y }) destructures the inner struct.',
      'Scroll(amount) binds the scroll distance.',
    ],
    solution: `struct Point {
    x: i32,
    y: i32,
}

enum Event {
    Click(Point),
    Scroll(i32),
}

fn report(e: Event) -> String {
    match e {
        Event::Click(Point { x, y }) => format!("click at ({}, {})", x, y),
        Event::Scroll(amount) => format!("scroll by {}", amount),
    }
}

fn main() {
    println!("{}", report(Event::Click(Point { x: 7, y: 8 })));
    println!("{}", report(Event::Scroll(-3)));
}`,
    starter: `struct Point {
    x: i32,
    y: i32,
}

enum Event {
    Click(Point),
    Scroll(i32),
}

fn report(e: Event) -> String {
    // TODO: match Event::Click(Point { x, y }) and Event::Scroll(amount)
    todo!()
}

fn main() {
    println!("{}", report(Event::Click(Point { x: 7, y: 8 })));
    println!("{}", report(Event::Scroll(-3)));
}`,
    tags: ['match', 'nested', 'enum'],
  },
  {
    id: 'rs-ch18-c-027',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Shadowing Inside a Match Arm',
    prompt: `A named variable in a match pattern is scoped to its arm and can shadow an outer variable. Given let n = Some(5); and an outer let x = 10;, write a match on n: the arm Some(x) should print "matched inner x = 5" (this x shadows the outer one), and the _ arm should print "no match". After the match, print "outer x = 10". Show that the outer x is unchanged.`,
    hints: [
      'Inside Some(x), the x refers to the inner value 5, not the outer 10.',
      'After the match ends, the outer x is visible again.',
    ],
    solution: `fn main() {
    let n = Some(5);
    let x = 10;

    match n {
        Some(x) => println!("matched inner x = {}", x),
        _ => println!("no match"),
    }

    println!("outer x = {}", x);
}`,
    starter: `fn main() {
    let n = Some(5);
    let x = 10;

    // TODO: match n; the Some(x) arm shadows the outer x
    // then print "outer x = 10"
    let _ = x;
}`,
    tags: ['match', 'shadowing', 'named-variables'],
  },
  {
    id: 'rs-ch18-c-028',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Match a Tuple With Mixed Patterns',
    prompt: `One match can mix wildcards, literals, and bindings across tuple elements. Write a function "quadrant" taking (i32, i32) returning a &'static str: return "origin" for (0, 0), "on x axis" for (_, 0), "on y axis" for (0, _), and "elsewhere" otherwise. Print quadrant for (0, 0), (5, 0), (0, 7), and (2, 3).`,
    hints: [
      'Order matters: put (0, 0) before (_, 0) and (0, _).',
      'A final _ arm catches the elsewhere case.',
    ],
    solution: `fn quadrant(point: (i32, i32)) -> &'static str {
    match point {
        (0, 0) => "origin",
        (_, 0) => "on x axis",
        (0, _) => "on y axis",
        _ => "elsewhere",
    }
}

fn main() {
    println!("{}", quadrant((0, 0)));
    println!("{}", quadrant((5, 0)));
    println!("{}", quadrant((0, 7)));
    println!("{}", quadrant((2, 3)));
}`,
    starter: `fn quadrant(point: (i32, i32)) -> &'static str {
    // TODO: match (0,0), (_,0), (0,_), and a catch-all
    todo!()
}

fn main() {
    println!("{}", quadrant((0, 0)));
    println!("{}", quadrant((5, 0)));
    println!("{}", quadrant((0, 7)));
    println!("{}", quadrant((2, 3)));
}`,
    tags: ['match', 'tuple', 'wildcard'],
  },
  {
    id: 'rs-ch18-c-029',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'while let Over an Iterator',
    prompt: `while let works with anything that returns Option. Create let v = vec![10, 20, 30]; and call let mut iter = v.iter();. Use while let Some(x) = iter.next() to print each value on its own line, producing 10, 20, 30 in order.`,
    hints: [
      'next returns Some(&value) until the iterator is exhausted, then None.',
      'while let Some(x) = iter.next() stops when next returns None.',
    ],
    solution: `fn main() {
    let v = vec![10, 20, 30];
    let mut iter = v.iter();
    while let Some(x) = iter.next() {
        println!("{}", x);
    }
}`,
    starter: `fn main() {
    let v = vec![10, 20, 30];
    let mut iter = v.iter();
    // TODO: while let Some(x) = iter.next() { println!("{}", x); }
}`,
    tags: ['while-let', 'iterator', 'option'],
  },
  {
    id: 'rs-ch18-c-030',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Match Guard Comparing Two Bindings',
    prompt: `A match guard can compare values bound in the pattern. Write a function "order" taking (i32, i32) returning a &'static str: bind both elements with a tuple pattern (a, b) and use guards to return "increasing" when a < b, "equal" when a == b, and "decreasing" otherwise. Print order for (1, 5), (3, 3), and (9, 2).`,
    hints: [
      'Bind the tuple as (a, b), then add guards like (a, b) if a < b.',
      'A final (a, b) arm with no guard handles the decreasing case.',
    ],
    solution: `fn order(pair: (i32, i32)) -> &'static str {
    match pair {
        (a, b) if a < b => "increasing",
        (a, b) if a == b => "equal",
        _ => "decreasing",
    }
}

fn main() {
    println!("{}", order((1, 5)));
    println!("{}", order((3, 3)));
    println!("{}", order((9, 2)));
}`,
    starter: `fn order(pair: (i32, i32)) -> &'static str {
    // TODO: bind (a, b) and use guards comparing a and b
    todo!()
}

fn main() {
    println!("{}", order((1, 5)));
    println!("{}", order((3, 3)));
    println!("{}", order((9, 2)));
}`,
    tags: ['match', 'guard', 'tuple'],
  },
  {
    id: 'rs-ch18-c-031',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Or Pattern With a Shared Guard',
    prompt: `An or-pattern can share a single match guard. Write a function "small_and_even" taking an i32 returning a bool. Use a match where the arm 2 | 4 | 6 | 8 if n % 2 == 0 returns true. To bind the value for the guard, use a pattern like n @ (2 | 4 | 6 | 8). Return false otherwise. Print small_and_even(4) and small_and_even(5).`,
    hints: [
      'Combine the at-binding and or-pattern: n @ (2 | 4 | 6 | 8).',
      'The guard if n % 2 == 0 applies to the whole or-pattern.',
    ],
    solution: `fn small_and_even(n: i32) -> bool {
    match n {
        n @ (2 | 4 | 6 | 8) if n % 2 == 0 => true,
        _ => false,
    }
}

fn main() {
    println!("{}", small_and_even(4));
    println!("{}", small_and_even(5));
}`,
    starter: `fn small_and_even(n: i32) -> bool {
    // TODO: use n @ (2 | 4 | 6 | 8) with a guard
    todo!()
}

fn main() {
    println!("{}", small_and_even(4));
    println!("{}", small_and_even(5));
}`,
    tags: ['match', 'or-pattern', 'guard'],
  },
  {
    id: 'rs-ch18-c-032',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'At-Binding While Destructuring a Struct',
    prompt: `Define struct Item { id: i32 }. Write a function "check" taking an Item returning String. Using a struct pattern, capture the id with an at-binding while testing a range: Item { id: found @ 1..=100 } returns "valid id: N", and any other id returns "invalid id: N" (bind it with Item { id }). Print check for Item { id: 50 } and Item { id: 250 }.`,
    hints: [
      'Inside the struct pattern, write id: found @ 1..=100 to test and capture.',
      'The fallback arm Item { id } binds the out-of-range id for the message.',
    ],
    solution: `struct Item {
    id: i32,
}

fn check(item: Item) -> String {
    match item {
        Item { id: found @ 1..=100 } => format!("valid id: {}", found),
        Item { id } => format!("invalid id: {}", id),
    }
}

fn main() {
    println!("{}", check(Item { id: 50 }));
    println!("{}", check(Item { id: 250 }));
}`,
    starter: `struct Item {
    id: i32,
}

fn check(item: Item) -> String {
    // TODO: use Item { id: found @ 1..=100 } and a fallback arm
    todo!()
}

fn main() {
    println!("{}", check(Item { id: 50 }));
    println!("{}", check(Item { id: 250 }));
}`,
    tags: ['match', 'at-binding', 'struct'],
  },
  {
    id: 'rs-ch18-c-033',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Ignore Inner Values With Nested Wildcards',
    prompt: `You can use _ inside a nested pattern to ignore just part of a value. Define enum Setting { On(i32), Off }. Write a function "is_on" taking a Setting returning a bool: match Setting::On(_) (ignoring the inner number) returning true, and Setting::Off returning false. Print is_on(Setting::On(42)) and is_on(Setting::Off).`,
    hints: [
      'Setting::On(_) matches any On value without binding the number.',
      'Using _ inside the variant avoids an unused-variable warning.',
    ],
    solution: `enum Setting {
    On(i32),
    Off,
}

fn is_on(s: Setting) -> bool {
    match s {
        Setting::On(_) => true,
        Setting::Off => false,
    }
}

fn main() {
    println!("{}", is_on(Setting::On(42)));
    println!("{}", is_on(Setting::Off));
}`,
    starter: `enum Setting {
    On(i32),
    Off,
}

fn is_on(s: Setting) -> bool {
    // TODO: match Setting::On(_) and Setting::Off
    todo!()
}

fn main() {
    println!("{}", is_on(Setting::On(42)));
    println!("{}", is_on(Setting::Off));
}`,
    tags: ['match', 'wildcard', 'enum'],
  },
  {
    id: 'rs-ch18-c-034',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Combine Range, Guard, and Binding',
    prompt: `Build a function "label" taking an i32 temperature returning a String that uses several pattern features. For values in 0..=15 return "cold". For a value t bound with an at-binding in 16..=25 that also satisfies a guard t % 2 == 0, return "mild even: T". For any other 16..=25 value return "mild odd". For everything else return "hot". Print label(10), label(20), label(21), and label(40).`,
    hints: [
      'Use t @ 16..=25 if t % 2 == 0 for the mild-even arm.',
      'Put the guarded arm before the plain 16..=25 arm so the guard is tried first.',
    ],
    solution: `fn label(t: i32) -> String {
    match t {
        0..=15 => String::from("cold"),
        t @ 16..=25 if t % 2 == 0 => format!("mild even: {}", t),
        16..=25 => String::from("mild odd"),
        _ => String::from("hot"),
    }
}

fn main() {
    println!("{}", label(10));
    println!("{}", label(20));
    println!("{}", label(21));
    println!("{}", label(40));
}`,
    starter: `fn label(t: i32) -> String {
    // TODO: combine ranges, an at-binding, and a guard
    todo!()
}

fn main() {
    println!("{}", label(10));
    println!("{}", label(20));
    println!("{}", label(21));
    println!("{}", label(40));
}`,
    tags: ['match', 'range', 'guard'],
  },
  {
    id: 'rs-ch18-c-035',
    chapter: 18,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Process a Queue of Events With while let',
    prompt: `Combine while let with enum destructuring. Define enum Command { Add(i32), Reset }. Build a Vec<Command> with the values Add(5), Reset, and Add(3) pushed in that order. Use while let Some(cmd) to pop from the vec and match each command: Add(n) adds n to a mutable total, Reset sets the total to 0. Print the running total after each command. Given pop returns from the end, the order is Add(3), Reset, Add(5); print the total each time (3, 0, 5).`,
    hints: [
      'while let Some(cmd) = queue.pop() drains the vec from the end.',
      'Inside the loop, match cmd { Command::Add(n) => ..., Command::Reset => ... }.',
    ],
    solution: `enum Command {
    Add(i32),
    Reset,
}

fn main() {
    let mut queue = Vec::new();
    queue.push(Command::Add(5));
    queue.push(Command::Reset);
    queue.push(Command::Add(3));

    let mut total = 0;
    while let Some(cmd) = queue.pop() {
        match cmd {
            Command::Add(n) => total += n,
            Command::Reset => total = 0,
        }
        println!("{}", total);
    }
}`,
    starter: `enum Command {
    Add(i32),
    Reset,
}

fn main() {
    let mut queue = Vec::new();
    queue.push(Command::Add(5));
    queue.push(Command::Reset);
    queue.push(Command::Add(3));

    let mut total = 0;
    // TODO: while let Some(cmd) = queue.pop() { match cmd { ... } println!(...) }
    let _ = total;
}`,
    tags: ['while-let', 'match', 'enum'],
  },
]

export default problems
