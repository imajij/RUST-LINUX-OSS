import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch06-c-036',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Define a Direction Enum',
    prompt: `Define an enum named Direction with four variants: North, South, East, and West.

In main, create a variable heading bound to Direction::West. You do not need to print anything; the program just needs to compile and use the value (a let binding is enough).`,
    hints: [
      'Use the enum keyword, then a block listing each variant name separated by commas.',
      'Access a variant with the double-colon syntax, like Direction::West.',
    ],
    solution: `enum Direction {
    North,
    South,
    East,
    West,
}

fn main() {
    let heading = Direction::West;
    // Use the value so it is not flagged as unused.
    let _ = heading;
}`,
    starter: `// TODO: define the Direction enum

fn main() {
    // TODO: bind heading to Direction::West
}`,
    tags: ['enums', 'definition'],
  },
  {
    id: 'rs-ch06-c-037',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Match a Traffic Light',
    prompt: `Define an enum TrafficLight with variants Red, Yellow, and Green.

Write a function action(light: TrafficLight) -> String that returns:
- "Stop" for Red
- "Slow" for Yellow
- "Go" for Green

In main, call action with each of the three variants and print each result on its own line.`,
    hints: [
      'A match expression on the parameter can return a String from each arm.',
      'Each arm looks like TrafficLight::Red => String::from("Stop"),',
    ],
    solution: `enum TrafficLight {
    Red,
    Yellow,
    Green,
}

fn action(light: TrafficLight) -> String {
    match light {
        TrafficLight::Red => String::from("Stop"),
        TrafficLight::Yellow => String::from("Slow"),
        TrafficLight::Green => String::from("Go"),
    }
}

fn main() {
    println!("{}", action(TrafficLight::Red));
    println!("{}", action(TrafficLight::Yellow));
    println!("{}", action(TrafficLight::Green));
}`,
    starter: `enum TrafficLight {
    Red,
    Yellow,
    Green,
}

fn action(light: TrafficLight) -> String {
    // TODO: match and return the right word
    todo!()
}

fn main() {
    // TODO: call action with each variant and print
}`,
    tags: ['enums', 'match'],
  },
  {
    id: 'rs-ch06-c-038',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Coin Values',
    prompt: `Re-create the classic coin example. Define an enum Coin with variants Penny, Nickel, Dime, and Quarter.

Write a function value_in_cents(coin: Coin) -> u32 that returns 1, 5, 10, or 25 depending on the coin.

In main, print the value of a Dime and a Quarter, each on its own line.`,
    hints: [
      'Use one match arm per coin returning the matching cent value.',
      'No data is attached to the variants here, so the arms are simple.',
    ],
    solution: `enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u32 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}

fn main() {
    println!("{}", value_in_cents(Coin::Dime));
    println!("{}", value_in_cents(Coin::Quarter));
}`,
    starter: `enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u32 {
    // TODO
    todo!()
}

fn main() {
    // TODO: print the value of a Dime and a Quarter
}`,
    tags: ['enums', 'match'],
  },
  {
    id: 'rs-ch06-c-039',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Enum Variants Holding Data',
    prompt: `Define an enum Shape where each variant carries data:
- Circle holds one f64 (the radius)
- Rectangle holds two f64 values (width and height)

In main, create a Circle with radius 2.0 and a Rectangle of 3.0 by 4.0, binding each to a variable. The program only needs to compile and construct both values.`,
    hints: [
      'A variant can hold data using parentheses, like Circle(f64).',
      'Construct with the values inside parentheses, like Shape::Circle(2.0).',
    ],
    solution: `enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
}

fn main() {
    let c = Shape::Circle(2.0);
    let r = Shape::Rectangle(3.0, 4.0);
    let _ = (c, r);
}`,
    starter: `// TODO: define Shape with data-carrying variants

fn main() {
    // TODO: build a Circle and a Rectangle
}`,
    tags: ['enums', 'data'],
  },
  {
    id: 'rs-ch06-c-040',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Compute Shape Area',
    prompt: `Using this enum:

    enum Shape {
        Circle(f64),
        Rectangle(f64, f64),
    }

Write a function area(shape: Shape) -> f64. For a Circle with radius r, return 3.14159 * r * r. For a Rectangle, return width * height.

In main, print the area of a Circle of radius 1.0 and a Rectangle of 2.0 by 5.0.`,
    hints: [
      'Match arms can bind the inner values: Shape::Circle(r) => ...',
      'For Rectangle bind both fields: Shape::Rectangle(w, h) => w * h',
    ],
    solution: `enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
}

fn area(shape: Shape) -> f64 {
    match shape {
        Shape::Circle(r) => 3.14159 * r * r,
        Shape::Rectangle(w, h) => w * h,
    }
}

fn main() {
    println!("{}", area(Shape::Circle(1.0)));
    println!("{}", area(Shape::Rectangle(2.0, 5.0)));
}`,
    starter: `enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
}

fn area(shape: Shape) -> f64 {
    // TODO: match and compute the area
    todo!()
}

fn main() {
    // TODO: print the area of a Circle and a Rectangle
}`,
    tags: ['enums', 'match', 'binding'],
  },
  {
    id: 'rs-ch06-c-041',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'IpAddr Style Enum',
    prompt: `Model an IP address with an enum. Define:

    enum IpAddrKind {
        V4(u8, u8, u8, u8),
        V6(String),
    }

Write a function describe(addr: IpAddrKind) -> String. For V4 return the dotted form like "192.168.0.1". For V6 return the stored string unchanged.

In main, print describe for a V4 address 10, 0, 0, 1 and a V6 address "::1".`,
    hints: [
      'Bind all four octets in the V4 arm and use format! to build the string.',
      'The V6 arm binds the inner String and can return it directly.',
    ],
    solution: `enum IpAddrKind {
    V4(u8, u8, u8, u8),
    V6(String),
}

fn describe(addr: IpAddrKind) -> String {
    match addr {
        IpAddrKind::V4(a, b, c, d) => format!("{}.{}.{}.{}", a, b, c, d),
        IpAddrKind::V6(s) => s,
    }
}

fn main() {
    println!("{}", describe(IpAddrKind::V4(10, 0, 0, 1)));
    println!("{}", describe(IpAddrKind::V6(String::from("::1"))));
}`,
    starter: `enum IpAddrKind {
    V4(u8, u8, u8, u8),
    V6(String),
}

fn describe(addr: IpAddrKind) -> String {
    // TODO
    todo!()
}

fn main() {
    // TODO: print describe for a V4 and a V6 address
}`,
    tags: ['enums', 'match', 'binding'],
  },
  {
    id: 'rs-ch06-c-042',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'The Message Enum',
    prompt: `Define the Message enum from the book with four kinds of variants:

    enum Message {
        Quit,
        Move { x: i32, y: i32 },
        Write(String),
        ChangeColor(i32, i32, i32),
    }

Write a function summary(m: Message) -> String returning:
- "quit" for Quit
- "move" for Move
- "write" for Write
- "color" for ChangeColor

In main, print the summary of one of each variant.`,
    hints: [
      'A struct-like variant uses curly braces with named fields.',
      'In a match arm you can ignore inner data with .. like Message::Move { .. }.',
    ],
    solution: `enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn summary(m: Message) -> String {
    match m {
        Message::Quit => String::from("quit"),
        Message::Move { .. } => String::from("move"),
        Message::Write(_) => String::from("write"),
        Message::ChangeColor(_, _, _) => String::from("color"),
    }
}

fn main() {
    println!("{}", summary(Message::Quit));
    println!("{}", summary(Message::Move { x: 1, y: 2 }));
    println!("{}", summary(Message::Write(String::from("hi"))));
    println!("{}", summary(Message::ChangeColor(0, 0, 0)));
}`,
    starter: `enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn summary(m: Message) -> String {
    // TODO
    todo!()
}

fn main() {
    // TODO: print the summary of one of each variant
}`,
    tags: ['enums', 'match', 'variants'],
  },
  {
    id: 'rs-ch06-c-043',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Method on an Enum',
    prompt: `Define an enum Coin with variants Penny, Nickel, Dime, and Quarter.

Add a method on the enum named value(&self) -> u32 (using an impl block) that returns the coin's worth in cents (1, 5, 10, 25).

In main, create a Quarter and print the result of calling .value() on it.`,
    hints: [
      'Write impl Coin { fn value(&self) -> u32 { ... } }.',
      'Inside the method, match on self using arms like Coin::Penny => 1.',
    ],
    solution: `enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

impl Coin {
    fn value(&self) -> u32 {
        match self {
            Coin::Penny => 1,
            Coin::Nickel => 5,
            Coin::Dime => 10,
            Coin::Quarter => 25,
        }
    }
}

fn main() {
    let c = Coin::Quarter;
    println!("{}", c.value());
}`,
    starter: `enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

impl Coin {
    // TODO: add the value method
}

fn main() {
    // TODO: create a Quarter and print its value
}`,
    tags: ['enums', 'methods', 'match'],
  },
  {
    id: 'rs-ch06-c-044',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Quarter State Example',
    prompt: `Re-create the quarter-state example. Define:

    enum UsState {
        Alabama,
        Alaska,
    }
    enum Coin {
        Penny,
        Nickel,
        Dime,
        Quarter(UsState),
    }

Write value_in_cents(coin: Coin) -> u32. For a Quarter, print a line like "State quarter from Alabama!" (use the matched state) and still return 25. Other coins return 1, 5, or 10.

In main, call value_in_cents on a Quarter(UsState::Alaska) and print the returned number.`,
    hints: [
      'The Quarter arm binds the inner state: Coin::Quarter(state) => { ... }',
      'Match on the bound state to choose the name to print.',
    ],
    solution: `enum UsState {
    Alabama,
    Alaska,
}

enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState),
}

fn value_in_cents(coin: Coin) -> u32 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            let name = match state {
                UsState::Alabama => "Alabama",
                UsState::Alaska => "Alaska",
            };
            println!("State quarter from {}!", name);
            25
        }
    }
}

fn main() {
    let n = value_in_cents(Coin::Quarter(UsState::Alaska));
    println!("{}", n);
}`,
    starter: `enum UsState {
    Alabama,
    Alaska,
}

enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState),
}

fn value_in_cents(coin: Coin) -> u32 {
    // TODO: match; for Quarter, print the state and return 25
    todo!()
}

fn main() {
    // TODO: call value_in_cents on a Quarter(Alaska) and print the number
}`,
    tags: ['enums', 'match', 'binding'],
  },
  {
    id: 'rs-ch06-c-045',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Build an Option Value',
    prompt: `Without using null (Rust has none), use Option.

In main, declare two variables:
- some_number of type Option<i32> holding the value 7
- absent of type Option<i32> holding no value

Print each with the debug formatter so the output is:
Some(7)
None`,
    hints: [
      'A present value is Some(7); an absent one is None.',
      'When you use None you may need to annotate the type, e.g. let absent: Option<i32> = None;',
      'Print with the debug formatter using the curly-brace-question-mark form.',
    ],
    solution: `fn main() {
    let some_number: Option<i32> = Some(7);
    let absent: Option<i32> = None;
    println!("{:?}", some_number);
    println!("{:?}", absent);
}`,
    starter: `fn main() {
    // TODO: declare some_number and absent, then print both
}`,
    tags: ['option', 'debug'],
  },
  {
    id: 'rs-ch06-c-046',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Match on Option',
    prompt: `Write a function describe(x: Option<i32>) -> String that returns:
- "nothing" when x is None
- a string like "got 42" when x is Some(42) (use the bound value)

In main, print describe(Some(42)) and describe(None).`,
    hints: [
      'Match has two arms: Some(n) and None.',
      'In the Some arm bind the inner value to n and build the string with format!.',
    ],
    solution: `fn describe(x: Option<i32>) -> String {
    match x {
        Some(n) => format!("got {}", n),
        None => String::from("nothing"),
    }
}

fn main() {
    println!("{}", describe(Some(42)));
    println!("{}", describe(None));
}`,
    starter: `fn describe(x: Option<i32>) -> String {
    // TODO: match Some(n) and None
    todo!()
}

fn main() {
    // TODO: print describe(Some(42)) and describe(None)
}`,
    tags: ['option', 'match', 'binding'],
  },
  {
    id: 'rs-ch06-c-047',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Plus One With Option',
    prompt: `Re-create the book's plus_one function. Write:

    fn plus_one(x: Option<i32>) -> Option<i32>

If x is Some(n) return Some(n + 1); if x is None return None.

In main, print plus_one(Some(5)) and plus_one(None) using the debug formatter. Expected output:
Some(6)
None`,
    hints: [
      'Match Some(i) => Some(i + 1) and None => None.',
      'The returned Option is itself printed with the debug formatter.',
    ],
    solution: `fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        Some(i) => Some(i + 1),
        None => None,
    }
}

fn main() {
    println!("{:?}", plus_one(Some(5)));
    println!("{:?}", plus_one(None));
}`,
    starter: `fn plus_one(x: Option<i32>) -> Option<i32> {
    // TODO
    todo!()
}

fn main() {
    // TODO: print plus_one(Some(5)) and plus_one(None) with {:?}
}`,
    tags: ['option', 'match'],
  },
  {
    id: 'rs-ch06-c-048',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Wildcard Placeholder',
    prompt: `A board game rolls a die. Write a function play(roll: u8) that:
- prints "fancy hat" when roll is 3
- prints "remove hat" when roll is 7
- for any other value, prints "move" (without using the value)

Use the wildcard placeholder _ for the catch-all arm. In main, call play with 3, 7, and 5.`,
    hints: [
      'The catch-all arm using _ must come last.',
      'The underscore arm ignores the rolled value entirely.',
    ],
    solution: `fn play(roll: u8) {
    match roll {
        3 => println!("fancy hat"),
        7 => println!("remove hat"),
        _ => println!("move"),
    }
}

fn main() {
    play(3);
    play(7);
    play(5);
}`,
    starter: `fn play(roll: u8) {
    // TODO: match 3, 7, and a wildcard
}

fn main() {
    play(3);
    play(7);
    play(5);
}`,
    tags: ['match', 'wildcard'],
  },
  {
    id: 'rs-ch06-c-049',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Catch-All Binding Pattern',
    prompt: `Same die game, but now the catch-all needs the rolled number.

Write play(roll: u8) that:
- prints "fancy hat" when roll is 3
- prints "remove hat" when roll is 7
- otherwise prints a line like "move 5" where 5 is the rolled value

Use a catch-all that binds the value (a variable name, not _). In main, call play with 3, 7, and 5.`,
    hints: [
      'A bare variable name in the last arm catches all values and binds them.',
      'Name it something like other => println!("move {}", other).',
    ],
    solution: `fn play(roll: u8) {
    match roll {
        3 => println!("fancy hat"),
        7 => println!("remove hat"),
        other => println!("move {}", other),
    }
}

fn main() {
    play(3);
    play(7);
    play(5);
}`,
    starter: `fn play(roll: u8) {
    // TODO: match 3, 7, and a catch-all that binds the value
}

fn main() {
    play(3);
    play(7);
    play(5);
}`,
    tags: ['match', 'catch-all', 'binding'],
  },
  {
    id: 'rs-ch06-c-050',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'If Let for a Single Pattern',
    prompt: `You have a config value config_max: Option<u8> = Some(3).

Using if let (not a full match), print "The maximum is configured to be 3" when the value is present, using the bound number. Do nothing when it is None.

In main, use the value Some(3) so the message prints.`,
    hints: [
      'The form is if let Some(max) = config_max { ... }.',
      'Inside the block, max holds the inner value.',
    ],
    solution: `fn main() {
    let config_max: Option<u8> = Some(3);
    if let Some(max) = config_max {
        println!("The maximum is configured to be {}", max);
    }
}`,
    starter: `fn main() {
    let config_max: Option<u8> = Some(3);
    // TODO: use if let to print the maximum when present
}`,
    tags: ['if-let', 'option'],
  },
  {
    id: 'rs-ch06-c-051',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'If Let With Else',
    prompt: `Given coin_count: Option<u8>, write code that:
- prints "Got 4 coins" when the value is present (use the bound number)
- prints "No coins" when it is None

Use if let with an else branch. In main, run it once with Some(4) and once with None so both branches show in the output.`,
    hints: [
      'Use if let Some(n) = coin_count { ... } else { ... }.',
      'Wrap the logic in a small function so you can call it with both inputs.',
    ],
    solution: `fn report(coin_count: Option<u8>) {
    if let Some(n) = coin_count {
        println!("Got {} coins", n);
    } else {
        println!("No coins");
    }
}

fn main() {
    report(Some(4));
    report(None);
}`,
    starter: `fn report(coin_count: Option<u8>) {
    // TODO: if let with else
}

fn main() {
    report(Some(4));
    report(None);
}`,
    tags: ['if-let', 'else', 'option'],
  },
  {
    id: 'rs-ch06-c-052',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count Non-Quarters',
    prompt: `Using the quarter-state coins, count how many coins in a slice are NOT quarters, while announcing each quarter's state.

Define:

    enum UsState { California, Texas }
    enum Coin { Penny, Quarter(UsState) }

Write a function process(coins: &[Coin]) -> u32. Loop over the coins. If a coin is a Quarter, print "Quarter from <state>" and do not count it; otherwise add one to a running count. Return the count of non-quarters.

In main, build a slice with a Penny, a Quarter(Texas), and a Penny, then print the returned count (expected: 2).`,
    hints: [
      'Inside the loop use if let Some-like syntax: if let Coin::Quarter(state) = coin { ... } else { count += 1; }.',
      'Because you iterate by reference, match the state with &UsState arms or use a reference pattern.',
    ],
    solution: `enum UsState {
    California,
    Texas,
}

enum Coin {
    Penny,
    Quarter(UsState),
}

fn process(coins: &[Coin]) -> u32 {
    let mut count = 0;
    for coin in coins {
        if let Coin::Quarter(state) = coin {
            let name = match state {
                UsState::California => "California",
                UsState::Texas => "Texas",
            };
            println!("Quarter from {}", name);
        } else {
            count += 1;
        }
    }
    count
}

fn main() {
    let coins = [
        Coin::Penny,
        Coin::Quarter(UsState::Texas),
        Coin::Penny,
    ];
    println!("{}", process(&coins));
}`,
    starter: `enum UsState {
    California,
    Texas,
}

enum Coin {
    Penny,
    Quarter(UsState),
}

fn process(coins: &[Coin]) -> u32 {
    // TODO: count non-quarters; announce each quarter's state
    todo!()
}

fn main() {
    let coins = [
        Coin::Penny,
        Coin::Quarter(UsState::Texas),
        Coin::Penny,
    ];
    println!("{}", process(&coins));
}`,
    tags: ['if-let', 'else', 'enums'],
  },
  {
    id: 'rs-ch06-c-053',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Matching Literal And Range',
    prompt: `Write a function grade(score: u8) -> char that maps a 0..=100 score to a letter:
- 90 to 100 returns 'A'
- 80 to 89 returns 'B'
- 70 to 79 returns 'C'
- anything else returns 'F'

Use match with inclusive range patterns (like 90..=100). In main, print grade(95), grade(83), grade(71), and grade(40).`,
    hints: [
      'Range patterns use ..= inside match arms, e.g. 90..=100 => ...',
      'End with a wildcard arm returning the F char.',
    ],
    solution: `fn grade(score: u8) -> char {
    match score {
        90..=100 => 'A',
        80..=89 => 'B',
        70..=79 => 'C',
        _ => 'F',
    }
}

fn main() {
    println!("{}", grade(95));
    println!("{}", grade(83));
    println!("{}", grade(71));
    println!("{}", grade(40));
}`,
    starter: `fn grade(score: u8) -> char {
    // TODO: use range patterns and a wildcard
    todo!()
}

fn main() {
    println!("{}", grade(95));
    println!("{}", grade(83));
    println!("{}", grade(71));
    println!("{}", grade(40));
}`,
    tags: ['match', 'ranges', 'wildcard'],
  },
  {
    id: 'rs-ch06-c-054',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Or Patterns In Match',
    prompt: `Write a function kind(c: char) -> &'static str that returns:
- "vowel" if c is one of a, e, i, o, u
- "digit" if c is between '0' and '9'
- "other" otherwise

Use the or pattern (the vertical bar) for the vowels in a single arm, and a range pattern for digits. In main, print kind for 'e', '7', and 'z'.`,
    hints: [
      'Combine alternatives in one arm with the pattern a | b | c.',
      'For digits use the char range pattern 0-as-char through 9-as-char written with ..= .',
    ],
    solution: `fn kind(c: char) -> &'static str {
    match c {
        'a' | 'e' | 'i' | 'o' | 'u' => "vowel",
        '0'..='9' => "digit",
        _ => "other",
    }
}

fn main() {
    println!("{}", kind('e'));
    println!("{}", kind('7'));
    println!("{}", kind('z'));
}`,
    starter: `fn kind(c: char) -> &'static str {
    // TODO: use an or-pattern for vowels and a range for digits
    todo!()
}

fn main() {
    println!("{}", kind('e'));
    println!("{}", kind('7'));
    println!("{}", kind('z'));
}`,
    tags: ['match', 'or-pattern', 'ranges'],
  },
  {
    id: 'rs-ch06-c-055',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Option Default With Match',
    prompt: `Write a function unwrap_or_zero(x: Option<i32>) -> i32 that returns the inner value when present, or 0 when absent.

Do this with a match expression (do not call any built-in helper like unwrap_or). In main, print unwrap_or_zero(Some(9)) and unwrap_or_zero(None). Expected output:
9
0`,
    hints: [
      'Two arms: Some(v) => v and None => 0.',
      'The whole match is the return value of the function.',
    ],
    solution: `fn unwrap_or_zero(x: Option<i32>) -> i32 {
    match x {
        Some(v) => v,
        None => 0,
    }
}

fn main() {
    println!("{}", unwrap_or_zero(Some(9)));
    println!("{}", unwrap_or_zero(None));
}`,
    starter: `fn unwrap_or_zero(x: Option<i32>) -> i32 {
    // TODO
    todo!()
}

fn main() {
    println!("{}", unwrap_or_zero(Some(9)));
    println!("{}", unwrap_or_zero(None));
}`,
    tags: ['option', 'match'],
  },
  {
    id: 'rs-ch06-c-056',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Enum Method Returning Option',
    prompt: `Define an enum Token with variants Number(i32) and Word(String).

Add a method as_number(&self) -> Option<i32> that returns Some of the number for a Number token and None for a Word token.

In main, call as_number on a Number(8) and a Word("hi") and print each result with the debug formatter. Expected output:
Some(8)
None`,
    hints: [
      'Match self; in the Number arm bind the value with a reference and copy it out.',
      'Number(n) => Some(*n) works when self is &self.',
    ],
    solution: `enum Token {
    Number(i32),
    Word(String),
}

impl Token {
    fn as_number(&self) -> Option<i32> {
        match self {
            Token::Number(n) => Some(*n),
            Token::Word(_) => None,
        }
    }
}

fn main() {
    let a = Token::Number(8);
    let b = Token::Word(String::from("hi"));
    println!("{:?}", a.as_number());
    println!("{:?}", b.as_number());
}`,
    starter: `enum Token {
    Number(i32),
    Word(String),
}

impl Token {
    fn as_number(&self) -> Option<i32> {
        // TODO
        todo!()
    }
}

fn main() {
    let a = Token::Number(8);
    let b = Token::Word(String::from("hi"));
    println!("{:?}", a.as_number());
    println!("{:?}", b.as_number());
}`,
    tags: ['enums', 'methods', 'option'],
  },
  {
    id: 'rs-ch06-c-057',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Find First Even With Option',
    prompt: `Write a function first_even(nums: &[i32]) -> Option<i32> that returns Some of the first even number in the slice, or None if there is no even number.

In main, print the result for [1, 3, 4, 7] and for [1, 3, 5] using the debug formatter. Expected output:
Some(4)
None`,
    hints: [
      'Loop over the slice; when you find an even value, return Some(value) immediately.',
      'If the loop finishes without returning, return None at the end.',
    ],
    solution: `fn first_even(nums: &[i32]) -> Option<i32> {
    for &n in nums {
        if n % 2 == 0 {
            return Some(n);
        }
    }
    None
}

fn main() {
    println!("{:?}", first_even(&[1, 3, 4, 7]));
    println!("{:?}", first_even(&[1, 3, 5]));
}`,
    starter: `fn first_even(nums: &[i32]) -> Option<i32> {
    // TODO: return Some(first even) or None
    todo!()
}

fn main() {
    println!("{:?}", first_even(&[1, 3, 4, 7]));
    println!("{:?}", first_even(&[1, 3, 5]));
}`,
    tags: ['option', 'slices', 'control-flow'],
  },
  {
    id: 'rs-ch06-c-058',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Struct Variant Field Binding',
    prompt: `Define an enum Event with a struct-like variant:

    enum Event {
        Click { x: i32, y: i32 },
        Scroll(i32),
        Close,
    }

Write a function handle(e: Event) -> String returning:
- a string like "click at (3, 4)" for a Click (use both fields)
- a string like "scroll 5" for a Scroll
- "close" for Close

In main, print handle for one of each variant.`,
    hints: [
      'A struct-variant arm binds named fields: Event::Click { x, y } => ...',
      'Build each string with format!.',
    ],
    solution: `enum Event {
    Click { x: i32, y: i32 },
    Scroll(i32),
    Close,
}

fn handle(e: Event) -> String {
    match e {
        Event::Click { x, y } => format!("click at ({}, {})", x, y),
        Event::Scroll(d) => format!("scroll {}", d),
        Event::Close => String::from("close"),
    }
}

fn main() {
    println!("{}", handle(Event::Click { x: 3, y: 4 }));
    println!("{}", handle(Event::Scroll(5)));
    println!("{}", handle(Event::Close));
}`,
    starter: `enum Event {
    Click { x: i32, y: i32 },
    Scroll(i32),
    Close,
}

fn handle(e: Event) -> String {
    // TODO: match each variant, binding fields where needed
    todo!()
}

fn main() {
    println!("{}", handle(Event::Click { x: 3, y: 4 }));
    println!("{}", handle(Event::Scroll(5)));
    println!("{}", handle(Event::Close));
}`,
    tags: ['enums', 'match', 'struct-variant'],
  },
  {
    id: 'rs-ch06-c-059',
    chapter: 6,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sum of Optional Values',
    prompt: `Write a function sum_present(values: &[Option<i32>]) -> i32 that adds together only the values that are Some, ignoring None.

In main, print sum_present for the slice containing Some(2), None, Some(5), None, Some(1). Expected output: 8.`,
    hints: [
      'Iterate over the slice and use if let Some(n) = value to add only present values.',
      'Because the slice holds references, you may write if let Some(n) = value and then add *n.',
    ],
    solution: `fn sum_present(values: &[Option<i32>]) -> i32 {
    let mut total = 0;
    for value in values {
        if let Some(n) = value {
            total += *n;
        }
    }
    total
}

fn main() {
    let data = [Some(2), None, Some(5), None, Some(1)];
    println!("{}", sum_present(&data));
}`,
    starter: `fn sum_present(values: &[Option<i32>]) -> i32 {
    // TODO: add only the Some values
    todo!()
}

fn main() {
    let data = [Some(2), None, Some(5), None, Some(1)];
    println!("{}", sum_present(&data));
}`,
    tags: ['option', 'if-let', 'slices'],
  },
  {
    id: 'rs-ch06-c-060',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Mini Calculator Enum',
    prompt: `Define an enum Op with variants Add(i32, i32), Sub(i32, i32), Mul(i32, i32), and Div(i32, i32).

Write a function eval(op: Op) -> Option<i32>. Compute the result for Add, Sub, and Mul. For Div, return None when the divisor is 0; otherwise return Some of the quotient (integer division). Wrap the other three results in Some too.

In main, print eval for Add(2, 3), Div(10, 2), and Div(4, 0) using the debug formatter. Expected output:
Some(5)
Some(5)
None`,
    hints: [
      'Each arm binds both operands, e.g. Op::Add(a, b) => Some(a + b).',
      'In the Div arm, check whether b == 0 before dividing.',
    ],
    solution: `enum Op {
    Add(i32, i32),
    Sub(i32, i32),
    Mul(i32, i32),
    Div(i32, i32),
}

fn eval(op: Op) -> Option<i32> {
    match op {
        Op::Add(a, b) => Some(a + b),
        Op::Sub(a, b) => Some(a - b),
        Op::Mul(a, b) => Some(a * b),
        Op::Div(a, b) => {
            if b == 0 {
                None
            } else {
                Some(a / b)
            }
        }
    }
}

fn main() {
    println!("{:?}", eval(Op::Add(2, 3)));
    println!("{:?}", eval(Op::Div(10, 2)));
    println!("{:?}", eval(Op::Div(4, 0)));
}`,
    starter: `enum Op {
    Add(i32, i32),
    Sub(i32, i32),
    Mul(i32, i32),
    Div(i32, i32),
}

fn eval(op: Op) -> Option<i32> {
    // TODO: compute each op; guard division by zero with None
    todo!()
}

fn main() {
    println!("{:?}", eval(Op::Add(2, 3)));
    println!("{:?}", eval(Op::Div(10, 2)));
    println!("{:?}", eval(Op::Div(4, 0)));
}`,
    tags: ['enums', 'match', 'option'],
  },
  {
    id: 'rs-ch06-c-061',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Traffic Light State Machine',
    prompt: `Define an enum Light with variants Red, Yellow, and Green.

Add a method next(&self) -> Light that returns the next light in the cycle: Red goes to Green, Green goes to Yellow, and Yellow goes to Red.

Add a method name(&self) -> &'static str returning "Red", "Yellow", or "Green".

In main, start at Red and print the name of the light four times, advancing with next each step. Expected output:
Red
Green
Yellow
Red`,
    hints: [
      'next matches self and returns the appropriate new Light variant.',
      'In main keep a mutable variable and reassign it: light = light.next();',
    ],
    solution: `enum Light {
    Red,
    Yellow,
    Green,
}

impl Light {
    fn next(&self) -> Light {
        match self {
            Light::Red => Light::Green,
            Light::Green => Light::Yellow,
            Light::Yellow => Light::Red,
        }
    }

    fn name(&self) -> &'static str {
        match self {
            Light::Red => "Red",
            Light::Yellow => "Yellow",
            Light::Green => "Green",
        }
    }
}

fn main() {
    let mut light = Light::Red;
    for _ in 0..4 {
        println!("{}", light.name());
        light = light.next();
    }
}`,
    starter: `enum Light {
    Red,
    Yellow,
    Green,
}

impl Light {
    fn next(&self) -> Light {
        // TODO
        todo!()
    }

    fn name(&self) -> &'static str {
        // TODO
        todo!()
    }
}

fn main() {
    let mut light = Light::Red;
    // TODO: print the name four times, advancing each step
}`,
    tags: ['enums', 'methods', 'match'],
  },
  {
    id: 'rs-ch06-c-062',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Recursive-Free Expression Evaluator',
    prompt: `Model simple binary expressions without recursion. Define:

    enum Expr {
        Num(i32),
        Add(i32, i32),
        Neg(i32),
    }

Write eval(e: Expr) -> i32 returning the number for Num, the sum for Add, and the negation for Neg.

Then write eval_all(exprs: Vec<Expr>) -> i32 that evaluates each expression and returns the total of all results.

In main, build a Vec with Num(4), Add(2, 3), and Neg(5), then print the total (expected: 4 + 5 + (-5) = 4).`,
    hints: [
      'eval is a small match over the three variants.',
      'eval_all consumes the Vec with a for loop and accumulates eval(e) into a running sum.',
    ],
    solution: `enum Expr {
    Num(i32),
    Add(i32, i32),
    Neg(i32),
}

fn eval(e: Expr) -> i32 {
    match e {
        Expr::Num(n) => n,
        Expr::Add(a, b) => a + b,
        Expr::Neg(n) => -n,
    }
}

fn eval_all(exprs: Vec<Expr>) -> i32 {
    let mut total = 0;
    for e in exprs {
        total += eval(e);
    }
    total
}

fn main() {
    let exprs = vec![Expr::Num(4), Expr::Add(2, 3), Expr::Neg(5)];
    println!("{}", eval_all(exprs));
}`,
    starter: `enum Expr {
    Num(i32),
    Add(i32, i32),
    Neg(i32),
}

fn eval(e: Expr) -> i32 {
    // TODO
    todo!()
}

fn eval_all(exprs: Vec<Expr>) -> i32 {
    // TODO: sum eval over all expressions
    todo!()
}

fn main() {
    let exprs = vec![Expr::Num(4), Expr::Add(2, 3), Expr::Neg(5)];
    println!("{}", eval_all(exprs));
}`,
    tags: ['enums', 'match', 'vec'],
  },
  {
    id: 'rs-ch06-c-063',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Safe Array Lookup',
    prompt: `Write a function get(items: &[i32], index: usize) -> Option<i32> that returns Some of the element at index, or None when the index is out of bounds. Do not let the program panic on a bad index.

Then write describe(items: &[i32], index: usize) -> String that uses a match on the result of get to return either "value 7" (using the found value) or "out of range".

In main, with items [10, 20, 30], print describe at index 2 and index 5. Expected output:
value 30
out of range`,
    hints: [
      'In get, compare index against items.len() before indexing.',
      'describe matches Some(v) and None to build its string.',
    ],
    solution: `fn get(items: &[i32], index: usize) -> Option<i32> {
    if index < items.len() {
        Some(items[index])
    } else {
        None
    }
}

fn describe(items: &[i32], index: usize) -> String {
    match get(items, index) {
        Some(v) => format!("value {}", v),
        None => String::from("out of range"),
    }
}

fn main() {
    let items = [10, 20, 30];
    println!("{}", describe(&items, 2));
    println!("{}", describe(&items, 5));
}`,
    starter: `fn get(items: &[i32], index: usize) -> Option<i32> {
    // TODO: bounds-check and return Some or None
    todo!()
}

fn describe(items: &[i32], index: usize) -> String {
    // TODO: match get(...) into a description
    todo!()
}

fn main() {
    let items = [10, 20, 30];
    println!("{}", describe(&items, 2));
    println!("{}", describe(&items, 5));
}`,
    tags: ['option', 'match', 'slices'],
  },
  {
    id: 'rs-ch06-c-064',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Command Parser With Enum',
    prompt: `Build a tiny command interpreter. Define:

    enum Command {
        Move(i32),
        Turn(i32),
        Stop,
    }

A robot starts at position 0 facing angle 0. Write a function run(commands: Vec<Command>) -> (i32, i32) that returns the final (position, angle).
- Move(n) adds n to position
- Turn(d) adds d to angle
- Stop ends processing immediately, ignoring any later commands

In main, run the list Move(5), Turn(90), Stop, Move(100) and print the result with the debug formatter. Expected output: (5, 90)`,
    hints: [
      'Loop over the Vec; match each command to update position or angle.',
      'For Stop, use break to leave the loop early.',
    ],
    solution: `enum Command {
    Move(i32),
    Turn(i32),
    Stop,
}

fn run(commands: Vec<Command>) -> (i32, i32) {
    let mut position = 0;
    let mut angle = 0;
    for command in commands {
        match command {
            Command::Move(n) => position += n,
            Command::Turn(d) => angle += d,
            Command::Stop => break,
        }
    }
    (position, angle)
}

fn main() {
    let program = vec![
        Command::Move(5),
        Command::Turn(90),
        Command::Stop,
        Command::Move(100),
    ];
    println!("{:?}", run(program));
}`,
    starter: `enum Command {
    Move(i32),
    Turn(i32),
    Stop,
}

fn run(commands: Vec<Command>) -> (i32, i32) {
    // TODO: process commands; Stop breaks early
    todo!()
}

fn main() {
    let program = vec![
        Command::Move(5),
        Command::Turn(90),
        Command::Stop,
        Command::Move(100),
    ];
    println!("{:?}", run(program));
}`,
    tags: ['enums', 'match', 'control-flow'],
  },
  {
    id: 'rs-ch06-c-065',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Chained Option With If Let Else',
    prompt: `Write a function classify(x: Option<i32>) -> String using only if let / else if let / else (no plain match):
- when x is Some and the value is positive, return a string like "positive 5"
- when x is Some and the value is zero or negative, return a string like "non-positive -2"
- when x is None, return "missing"

In main, print classify(Some(5)), classify(Some(-2)), and classify(None).`,
    hints: [
      'Start with if let Some(n) = x { ... } else { ... }.',
      'Inside the Some branch, use an ordinary if on n to split positive vs non-positive.',
    ],
    solution: `fn classify(x: Option<i32>) -> String {
    if let Some(n) = x {
        if n > 0 {
            format!("positive {}", n)
        } else {
            format!("non-positive {}", n)
        }
    } else {
        String::from("missing")
    }
}

fn main() {
    println!("{}", classify(Some(5)));
    println!("{}", classify(Some(-2)));
    println!("{}", classify(None));
}`,
    starter: `fn classify(x: Option<i32>) -> String {
    // TODO: use if let / else, no plain match
    todo!()
}

fn main() {
    println!("{}", classify(Some(5)));
    println!("{}", classify(Some(-2)));
    println!("{}", classify(None));
}`,
    tags: ['if-let', 'else', 'option'],
  },
  {
    id: 'rs-ch06-c-066',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Match Guards on an Enum',
    prompt: `Define an enum Temperature with variants Celsius(i32) and Fahrenheit(i32).

Write a function status(t: Temperature) -> &'static str. Convert nothing; just classify:
- "freezing" when Celsius is at or below 0, or when Fahrenheit is at or below 32
- "boiling" when Celsius is at or above 100, or when Fahrenheit is at or above 212
- "normal" otherwise

Use match arms with guards (the if condition after a pattern). In main, print status for Celsius(-5), Fahrenheit(220), and Celsius(25).`,
    hints: [
      'A guard looks like Temperature::Celsius(c) if c <= 0 => "freezing".',
      'You will need separate guarded arms for the Celsius and Fahrenheit cases, then a catch-all.',
    ],
    solution: `enum Temperature {
    Celsius(i32),
    Fahrenheit(i32),
}

fn status(t: Temperature) -> &'static str {
    match t {
        Temperature::Celsius(c) if c <= 0 => "freezing",
        Temperature::Celsius(c) if c >= 100 => "boiling",
        Temperature::Fahrenheit(f) if f <= 32 => "freezing",
        Temperature::Fahrenheit(f) if f >= 212 => "boiling",
        _ => "normal",
    }
}

fn main() {
    println!("{}", status(Temperature::Celsius(-5)));
    println!("{}", status(Temperature::Fahrenheit(220)));
    println!("{}", status(Temperature::Celsius(25)));
}`,
    starter: `enum Temperature {
    Celsius(i32),
    Fahrenheit(i32),
}

fn status(t: Temperature) -> &'static str {
    // TODO: use match arms with guards
    todo!()
}

fn main() {
    println!("{}", status(Temperature::Celsius(-5)));
    println!("{}", status(Temperature::Fahrenheit(220)));
    println!("{}", status(Temperature::Celsius(25)));
}`,
    tags: ['enums', 'match', 'guards'],
  },
  {
    id: 'rs-ch06-c-067',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'JSON-Like Value Renderer',
    prompt: `Model a small dynamic value. Define:

    enum Value {
        Null,
        Bool(bool),
        Int(i64),
        Text(String),
    }

Write a method render(&self) -> String on Value that produces:
- "null" for Null
- "true" or "false" for Bool
- the number as text for Int (for example "42")
- the text wrapped in single quotes for Text (for example 'hi')

In main, print render for Null, Bool(true), Int(42), and Text("hi"). Expected output:
null
true
42
'hi'`,
    hints: [
      'Match self; for Bool you can match the inner bool or use an if expression.',
      'For Int use format! to turn the number into a String; for Text wrap with single quotes in the format string.',
    ],
    solution: `enum Value {
    Null,
    Bool(bool),
    Int(i64),
    Text(String),
}

impl Value {
    fn render(&self) -> String {
        match self {
            Value::Null => String::from("null"),
            Value::Bool(b) => {
                if *b {
                    String::from("true")
                } else {
                    String::from("false")
                }
            }
            Value::Int(n) => format!("{}", n),
            Value::Text(s) => format!("'{}'", s),
        }
    }
}

fn main() {
    println!("{}", Value::Null.render());
    println!("{}", Value::Bool(true).render());
    println!("{}", Value::Int(42).render());
    println!("{}", Value::Text(String::from("hi")).render());
}`,
    starter: `enum Value {
    Null,
    Bool(bool),
    Int(i64),
    Text(String),
}

impl Value {
    fn render(&self) -> String {
        // TODO
        todo!()
    }
}

fn main() {
    println!("{}", Value::Null.render());
    println!("{}", Value::Bool(true).render());
    println!("{}", Value::Int(42).render());
    println!("{}", Value::Text(String::from("hi")).render());
}`,
    tags: ['enums', 'methods', 'match'],
  },
  {
    id: 'rs-ch06-c-068',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Tally Events by Variant',
    prompt: `Define an enum LogEntry with variants Info(String), Warning(String), and Error(String).

Write a function count_errors(entries: &[LogEntry]) -> usize that returns how many entries are Error, using if let inside the loop (not a full match).

Also write first_message(entries: &[LogEntry]) -> Option<String> that returns Some of the inner text of the first entry (regardless of level), or None if the slice is empty.

In main, build a slice with Info("start"), Error("boom"), Warning("slow"), Error("again"); print count_errors (expected 2) and first_message with the debug formatter (expected Some("start")).`,
    hints: [
      'In count_errors, use if let LogEntry::Error(_) = entry to count matches.',
      'In first_message, check whether the slice has a first element, then match it to extract the inner String (clone it to return an owned String).',
    ],
    solution: `enum LogEntry {
    Info(String),
    Warning(String),
    Error(String),
}

fn count_errors(entries: &[LogEntry]) -> usize {
    let mut count = 0;
    for entry in entries {
        if let LogEntry::Error(_) = entry {
            count += 1;
        }
    }
    count
}

fn first_message(entries: &[LogEntry]) -> Option<String> {
    if entries.len() == 0 {
        return None;
    }
    let text = match &entries[0] {
        LogEntry::Info(s) => s.clone(),
        LogEntry::Warning(s) => s.clone(),
        LogEntry::Error(s) => s.clone(),
    };
    Some(text)
}

fn main() {
    let entries = [
        LogEntry::Info(String::from("start")),
        LogEntry::Error(String::from("boom")),
        LogEntry::Warning(String::from("slow")),
        LogEntry::Error(String::from("again")),
    ];
    println!("{}", count_errors(&entries));
    println!("{:?}", first_message(&entries));
}`,
    starter: `enum LogEntry {
    Info(String),
    Warning(String),
    Error(String),
}

fn count_errors(entries: &[LogEntry]) -> usize {
    // TODO: count Error entries using if let
    todo!()
}

fn first_message(entries: &[LogEntry]) -> Option<String> {
    // TODO: Some(text of first entry) or None when empty
    todo!()
}

fn main() {
    let entries = [
        LogEntry::Info(String::from("start")),
        LogEntry::Error(String::from("boom")),
        LogEntry::Warning(String::from("slow")),
        LogEntry::Error(String::from("again")),
    ];
    println!("{}", count_errors(&entries));
    println!("{:?}", first_message(&entries));
}`,
    tags: ['enums', 'if-let', 'option'],
  },
  {
    id: 'rs-ch06-c-069',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Validate and Build With Option',
    prompt: `You want to build a user only if the inputs are valid. Define:

    struct User {
        name: String,
        age: u32,
    }

Write a function make_user(name: String, age: i64) -> Option<User> that returns:
- None if name is empty (length 0)
- None if age is negative or greater than 150
- otherwise Some(User { ... }) with age converted to u32

Then write greet(user: Option<User>) -> String that returns "Hello, Ann (30)" style text for Some, or "no user" for None.

In main, print greet(make_user("Ann", 30)), greet(make_user("", 30)), and greet(make_user("Bob", 200)).`,
    hints: [
      'Check the failure conditions first and return None early.',
      'Convert the validated age with age as u32; build greet with a match over the Option.',
    ],
    solution: `struct User {
    name: String,
    age: u32,
}

fn make_user(name: String, age: i64) -> Option<User> {
    if name.len() == 0 {
        return None;
    }
    if age < 0 || age > 150 {
        return None;
    }
    Some(User {
        name,
        age: age as u32,
    })
}

fn greet(user: Option<User>) -> String {
    match user {
        Some(u) => format!("Hello, {} ({})", u.name, u.age),
        None => String::from("no user"),
    }
}

fn main() {
    println!("{}", greet(make_user(String::from("Ann"), 30)));
    println!("{}", greet(make_user(String::from(""), 30)));
    println!("{}", greet(make_user(String::from("Bob"), 200)));
}`,
    starter: `struct User {
    name: String,
    age: u32,
}

fn make_user(name: String, age: i64) -> Option<User> {
    // TODO: validate inputs; return None on failure, else Some(User)
    todo!()
}

fn greet(user: Option<User>) -> String {
    // TODO: match the Option into a greeting
    todo!()
}

fn main() {
    println!("{}", greet(make_user(String::from("Ann"), 30)));
    println!("{}", greet(make_user(String::from(""), 30)));
    println!("{}", greet(make_user(String::from("Bob"), 200)));
}`,
    tags: ['option', 'structs', 'match'],
  },
  {
    id: 'rs-ch06-c-070',
    chapter: 6,
    kind: 'coding',
    difficulty: 'hard',
    title: 'State Machine With Data',
    prompt: `Model a small vending machine. Define:

    enum State {
        Idle,
        Collecting(u32),
        Dispensing,
    }

A machine in Collecting holds the cents inserted so far. Write a method insert(self, coin: u32) -> State that:
- from Idle, moves to Collecting(coin)
- from Collecting(total), if total + coin is at least 50, moves to Dispensing; otherwise stays in Collecting(total + coin)
- from Dispensing, stays in Dispensing

Add a method label(&self) -> String returning "idle", "collecting N" (with the amount), or "dispensing".

In main, start at Idle, then insert 25, then insert 25, printing the label after each insert. Expected output:
collecting 25
dispensing`,
    hints: [
      'insert takes self by value and returns a new State; reassign in main with state = state.insert(...).',
      'The Collecting arm binds total and uses an if to decide between staying or dispensing.',
    ],
    solution: `enum State {
    Idle,
    Collecting(u32),
    Dispensing,
}

impl State {
    fn insert(self, coin: u32) -> State {
        match self {
            State::Idle => State::Collecting(coin),
            State::Collecting(total) => {
                if total + coin >= 50 {
                    State::Dispensing
                } else {
                    State::Collecting(total + coin)
                }
            }
            State::Dispensing => State::Dispensing,
        }
    }

    fn label(&self) -> String {
        match self {
            State::Idle => String::from("idle"),
            State::Collecting(total) => format!("collecting {}", total),
            State::Dispensing => String::from("dispensing"),
        }
    }
}

fn main() {
    let mut state = State::Idle;
    state = state.insert(25);
    println!("{}", state.label());
    state = state.insert(25);
    println!("{}", state.label());
}`,
    starter: `enum State {
    Idle,
    Collecting(u32),
    Dispensing,
}

impl State {
    fn insert(self, coin: u32) -> State {
        // TODO: transition based on current state and coin
        todo!()
    }

    fn label(&self) -> String {
        // TODO
        todo!()
    }
}

fn main() {
    let mut state = State::Idle;
    state = state.insert(25);
    println!("{}", state.label());
    state = state.insert(25);
    println!("{}", state.label());
}`,
    tags: ['enums', 'methods', 'state-machine'],
  },
]

export default problems
