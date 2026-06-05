import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch06-c-001',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Define a Simple Direction Enum',
    prompt: `Define an enum named Direction with exactly four variants: North, South, East, and West.

You do not need to use the enum yet. Just declare it so the program compiles.`,
    hints: [
      'Use the enum keyword followed by the name and a block of variants.',
      'Variants are separated by commas, like North, South, East, West.',
    ],
    solution: `enum Direction {
    North,
    South,
    East,
    West,
}

fn main() {
    // Enum defined above; nothing to print yet.
}`,
    starter: `// TODO: define the Direction enum here

fn main() {}`,
    tags: ['enums', 'definition'],
  },
  {
    id: 'rs-ch06-c-002',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Create an Enum Value',
    prompt: `Given this enum:

    enum Direction {
        North,
        South,
        East,
        West,
    }

In main, create a variable named heading bound to Direction::East. You do not need to print anything.`,
    hints: [
      'Access a variant with the enum name, two colons, then the variant name.',
      'Direction::East is a value just like any other.',
    ],
    solution: `enum Direction {
    North,
    South,
    East,
    West,
}

fn main() {
    let heading = Direction::East;
    let _ = heading;
}`,
    starter: `enum Direction {
    North,
    South,
    East,
    West,
}

fn main() {
    // TODO: create heading bound to Direction::East
}`,
    tags: ['enums', 'variants'],
  },
  {
    id: 'rs-ch06-c-003',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Match a Traffic Light',
    prompt: `Given this enum:

    enum Light {
        Red,
        Yellow,
        Green,
    }

Write a function describe(light: Light) -> String that returns:
- "stop" for Red
- "slow" for Yellow
- "go" for Green

In main, call describe(Light::Green) and print the result.`,
    hints: [
      'Use a match expression on the light parameter.',
      'Each arm looks like Light::Red => String::from("stop"),',
    ],
    solution: `enum Light {
    Red,
    Yellow,
    Green,
}

fn describe(light: Light) -> String {
    match light {
        Light::Red => String::from("stop"),
        Light::Yellow => String::from("slow"),
        Light::Green => String::from("go"),
    }
}

fn main() {
    println!("{}", describe(Light::Green));
}`,
    starter: `enum Light {
    Red,
    Yellow,
    Green,
}

fn describe(light: Light) -> String {
    // TODO: match on light and return the right word
    todo!()
}

fn main() {
    println!("{}", describe(Light::Green));
}`,
    tags: ['enums', 'match'],
  },
  {
    id: 'rs-ch06-c-004',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Coin Value in Cents',
    prompt: `Define an enum Coin with variants Penny, Nickel, Dime, and Quarter.

Write a function value_in_cents(coin: Coin) -> u32 that returns 1, 5, 10, or 25 depending on the coin.

In main, print the value of a Coin::Dime.`,
    hints: [
      'Match each variant to its cent value.',
      'A Dime should return 10.',
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
}`,
    starter: `enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u32 {
    // TODO: return the cent value for each coin
    todo!()
}

fn main() {
    println!("{}", value_in_cents(Coin::Dime));
}`,
    tags: ['enums', 'match', 'coin'],
  },
  {
    id: 'rs-ch06-c-005',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Some Value',
    prompt: `In main, create a variable named maybe of type Option<i32> holding the value 7 (use Some).

Then create another variable named nothing of type Option<i32> holding no value (use None).

You do not need to print anything.`,
    hints: [
      'Some(7) wraps a value; None represents absence.',
      'For None you may need a type annotation: let nothing: Option<i32> = None;',
    ],
    solution: `fn main() {
    let maybe = Some(7);
    let nothing: Option<i32> = None;
    let _ = (maybe, nothing);
}`,
    starter: `fn main() {
    // TODO: create maybe (Some(7)) and nothing (None)
}`,
    tags: ['option', 'some', 'none'],
  },
  {
    id: 'rs-ch06-c-006',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Match on an Option',
    prompt: `Write a function describe(opt: Option<i32>) -> String that:
- returns "nothing" when the value is None
- returns "got a number" when the value is Some(_)

In main, print describe(Some(5)) and describe(None).`,
    hints: [
      'Match has two arms: Some(_) and None.',
      'Use an underscore inside Some to ignore the inner value.',
    ],
    solution: `fn describe(opt: Option<i32>) -> String {
    match opt {
        Some(_) => String::from("got a number"),
        None => String::from("nothing"),
    }
}

fn main() {
    println!("{}", describe(Some(5)));
    println!("{}", describe(None));
}`,
    starter: `fn describe(opt: Option<i32>) -> String {
    // TODO: match Some and None
    todo!()
}

fn main() {
    println!("{}", describe(Some(5)));
    println!("{}", describe(None));
}`,
    tags: ['option', 'match'],
  },
  {
    id: 'rs-ch06-c-007',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Bind the Inner Value',
    prompt: `Write a function double_or_zero(opt: Option<i32>) -> i32 that returns twice the inner value when the option is Some, and 0 when it is None.

In main, print double_or_zero(Some(4)) and double_or_zero(None).`,
    hints: [
      'The arm Some(n) binds the inner value to n.',
      'Return n * 2 from the Some arm.',
    ],
    solution: `fn double_or_zero(opt: Option<i32>) -> i32 {
    match opt {
        Some(n) => n * 2,
        None => 0,
    }
}

fn main() {
    println!("{}", double_or_zero(Some(4)));
    println!("{}", double_or_zero(None));
}`,
    starter: `fn double_or_zero(opt: Option<i32>) -> i32 {
    // TODO: bind the inner value with Some(n)
    todo!()
}

fn main() {
    println!("{}", double_or_zero(Some(4)));
    println!("{}", double_or_zero(None));
}`,
    tags: ['option', 'match', 'binding'],
  },
  {
    id: 'rs-ch06-c-008',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Enum Variant With Data',
    prompt: `Define an enum named Shape with these variants holding data:
- Circle(f64) — the radius
- Square(f64) — the side length

In main, create a Shape::Circle with radius 2.0 and a Shape::Square with side 3.0. You do not need to print anything.`,
    hints: [
      'A variant can hold data: Circle(f64).',
      'Construct it like Shape::Circle(2.0).',
    ],
    solution: `enum Shape {
    Circle(f64),
    Square(f64),
}

fn main() {
    let c = Shape::Circle(2.0);
    let s = Shape::Square(3.0);
    let _ = (c, s);
}`,
    starter: `enum Shape {
    Circle(f64),
    Square(f64),
}

fn main() {
    // TODO: build a Circle(2.0) and a Square(3.0)
}`,
    tags: ['enums', 'data'],
  },
  {
    id: 'rs-ch06-c-009',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Wildcard Catch-All',
    prompt: `Given this enum:

    enum Grade {
        A,
        B,
        C,
        D,
        F,
    }

Write a function passed(grade: Grade) -> bool that returns false for Grade::F and true for every other grade. Use the wildcard pattern _ for the catch-all arm.

In main, print passed(Grade::B) and passed(Grade::F).`,
    hints: [
      'Match Grade::F first, then use _ to cover the rest.',
      'The _ arm should return true.',
    ],
    solution: `enum Grade {
    A,
    B,
    C,
    D,
    F,
}

fn passed(grade: Grade) -> bool {
    match grade {
        Grade::F => false,
        _ => true,
    }
}

fn main() {
    println!("{}", passed(Grade::B));
    println!("{}", passed(Grade::F));
}`,
    starter: `enum Grade {
    A,
    B,
    C,
    D,
    F,
}

fn passed(grade: Grade) -> bool {
    // TODO: false for F, true otherwise (use _)
    todo!()
}

fn main() {
    println!("{}", passed(Grade::B));
    println!("{}", passed(Grade::F));
}`,
    tags: ['enums', 'match', 'wildcard'],
  },
  {
    id: 'rs-ch06-c-010',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'If Let on Some',
    prompt: `In main, given a variable config: Option<i32> = Some(42), use an if let expression to print "configured to 42" only when the value is Some, binding the inner value and including it in the message.

If it were None, the program should print nothing.`,
    hints: [
      'Syntax: if let Some(value) = config { ... }',
      'Print the bound value inside the block.',
    ],
    solution: `fn main() {
    let config: Option<i32> = Some(42);
    if let Some(value) = config {
        println!("configured to {}", value);
    }
}`,
    starter: `fn main() {
    let config: Option<i32> = Some(42);
    // TODO: use if let to print the value when present
}`,
    tags: ['option', 'if-let'],
  },
  {
    id: 'rs-ch06-c-011',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Match Returns a Word',
    prompt: `Define an enum Weekday with variants Mon, Tue, Wed, Thu, Fri.

Write a function short_name(day: Weekday) -> String returning the three-letter lowercase name ("mon", "tue", etc.) for each variant.

In main, print short_name(Weekday::Wed).`,
    hints: [
      'One match arm per variant.',
      'Return String::from("wed") for Weekday::Wed.',
    ],
    solution: `enum Weekday {
    Mon,
    Tue,
    Wed,
    Thu,
    Fri,
}

fn short_name(day: Weekday) -> String {
    match day {
        Weekday::Mon => String::from("mon"),
        Weekday::Tue => String::from("tue"),
        Weekday::Wed => String::from("wed"),
        Weekday::Thu => String::from("thu"),
        Weekday::Fri => String::from("fri"),
    }
}

fn main() {
    println!("{}", short_name(Weekday::Wed));
}`,
    starter: `enum Weekday {
    Mon,
    Tue,
    Wed,
    Thu,
    Fri,
}

fn short_name(day: Weekday) -> String {
    // TODO: return the three-letter name
    todo!()
}

fn main() {
    println!("{}", short_name(Weekday::Wed));
}`,
    tags: ['enums', 'match'],
  },
  {
    id: 'rs-ch06-c-012',
    chapter: 6,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Unwrap or Default Length',
    prompt: `Write a function length_or(name: Option<String>, default: usize) -> usize that returns the length of the string when name is Some, and default when it is None.

In main, print length_or(Some(String::from("rust")), 0) and length_or(None, 99).`,
    hints: [
      'Match Some(s) to access the string and call s.len().',
      'Return default in the None arm.',
    ],
    solution: `fn length_or(name: Option<String>, default: usize) -> usize {
    match name {
        Some(s) => s.len(),
        None => default,
    }
}

fn main() {
    println!("{}", length_or(Some(String::from("rust")), 0));
    println!("{}", length_or(None, 99));
}`,
    starter: `fn length_or(name: Option<String>, default: usize) -> usize {
    // TODO: length when Some, default when None
    todo!()
}

fn main() {
    println!("{}", length_or(Some(String::from("rust")), 0));
    println!("{}", length_or(None, 99));
}`,
    tags: ['option', 'match', 'binding'],
  },
  {
    id: 'rs-ch06-c-013',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'IpAddr Style Enum',
    prompt: `Model an IP address kind. Define an enum IpKind with variants V4 and V6.

Define a struct IpAddr with fields kind: IpKind and address: String.

In main, build an IpAddr with kind V4 and address "127.0.0.1", then print the address field. You do not need to print the kind.`,
    hints: [
      'The enum has two simple variants.',
      'The struct stores the kind alongside the address string.',
    ],
    solution: `enum IpKind {
    V4,
    V6,
}

struct IpAddr {
    kind: IpKind,
    address: String,
}

fn main() {
    let home = IpAddr {
        kind: IpKind::V4,
        address: String::from("127.0.0.1"),
    };
    println!("{}", home.address);
}`,
    starter: `enum IpKind {
    V4,
    V6,
}

struct IpAddr {
    kind: IpKind,
    address: String,
}

fn main() {
    // TODO: build an IpAddr and print its address
}`,
    tags: ['enums', 'structs', 'ipaddr'],
  },
  {
    id: 'rs-ch06-c-014',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'IpAddr Data In The Variant',
    prompt: `Refactor the IP address model so the data lives directly inside the enum variants.

Define an enum IpAddr with:
- V4(String)
- V6(String)

In main, create V4("127.0.0.1") and V6("::1"). Write a function show(ip: IpAddr) -> String that returns the inner string for either variant, and print show on each value.`,
    hints: [
      'Each variant carries its own String.',
      'Both match arms bind the inner string and return it.',
    ],
    solution: `enum IpAddr {
    V4(String),
    V6(String),
}

fn show(ip: IpAddr) -> String {
    match ip {
        IpAddr::V4(s) => s,
        IpAddr::V6(s) => s,
    }
}

fn main() {
    let four = IpAddr::V4(String::from("127.0.0.1"));
    let six = IpAddr::V6(String::from("::1"));
    println!("{}", show(four));
    println!("{}", show(six));
}`,
    starter: `enum IpAddr {
    V4(String),
    V6(String),
}

fn show(ip: IpAddr) -> String {
    // TODO: return the inner address string
    todo!()
}

fn main() {
    let four = IpAddr::V4(String::from("127.0.0.1"));
    let six = IpAddr::V6(String::from("::1"));
    println!("{}", show(four));
    println!("{}", show(six));
}`,
    tags: ['enums', 'data', 'match'],
  },
  {
    id: 'rs-ch06-c-015',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'V4 With Four Numbers',
    prompt: `Define an enum IpAddr where V4 stores four u8 values and V6 stores a String:
- V4(u8, u8, u8, u8)
- V6(String)

Write a function first_octet(ip: IpAddr) -> u8 that returns the first number of a V4 address, and 0 for a V6 address.

In main, print first_octet(IpAddr::V4(192, 168, 0, 1)).`,
    hints: [
      'V4 holds four values; bind them as V4(a, b, c, d).',
      'You only need a; you may ignore the others with underscores.',
    ],
    solution: `enum IpAddr {
    V4(u8, u8, u8, u8),
    V6(String),
}

fn first_octet(ip: IpAddr) -> u8 {
    match ip {
        IpAddr::V4(a, _, _, _) => a,
        IpAddr::V6(_) => 0,
    }
}

fn main() {
    println!("{}", first_octet(IpAddr::V4(192, 168, 0, 1)));
}`,
    starter: `enum IpAddr {
    V4(u8, u8, u8, u8),
    V6(String),
}

fn first_octet(ip: IpAddr) -> u8 {
    // TODO: return the first octet of V4, 0 for V6
    todo!()
}

fn main() {
    println!("{}", first_octet(IpAddr::V4(192, 168, 0, 1)));
}`,
    tags: ['enums', 'data', 'match'],
  },
  {
    id: 'rs-ch06-c-016',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'The Message Enum',
    prompt: `Define the classic Message enum with four differently-shaped variants:
- Quit (no data)
- Move { x: i32, y: i32 } (named fields)
- Write(String) (a single String)
- ChangeColor(i32, i32, i32) (three i32 values)

In main, create one value of each variant. You do not need to print anything.`,
    hints: [
      'A variant may have no data, a tuple of data, or named fields in braces.',
      'Move uses struct-like syntax: Message::Move { x: 1, y: 2 }.',
    ],
    solution: `enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn main() {
    let _a = Message::Quit;
    let _b = Message::Move { x: 1, y: 2 };
    let _c = Message::Write(String::from("hi"));
    let _d = Message::ChangeColor(255, 0, 0);
}`,
    starter: `// TODO: define the Message enum with four variants

fn main() {
    // TODO: create one value of each variant
}`,
    tags: ['enums', 'message', 'variants'],
  },
  {
    id: 'rs-ch06-c-017',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Match the Message',
    prompt: `Using this enum:

    enum Message {
        Quit,
        Move { x: i32, y: i32 },
        Write(String),
        ChangeColor(i32, i32, i32),
    }

Write a function summary(msg: Message) -> String that returns:
- "quit" for Quit
- "move" for Move
- "write" for Write
- "color" for ChangeColor

You may ignore any inner data. In main, print summary(Message::Write(String::from("hi"))).`,
    hints: [
      'For Move use Message::Move { .. } to ignore the fields.',
      'For tuple variants use Message::Write(_) and Message::ChangeColor(..).',
    ],
    solution: `enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn summary(msg: Message) -> String {
    match msg {
        Message::Quit => String::from("quit"),
        Message::Move { .. } => String::from("move"),
        Message::Write(_) => String::from("write"),
        Message::ChangeColor(..) => String::from("color"),
    }
}

fn main() {
    println!("{}", summary(Message::Write(String::from("hi"))));
}`,
    starter: `enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn summary(msg: Message) -> String {
    // TODO: return a word per variant
    todo!()
}

fn main() {
    println!("{}", summary(Message::Write(String::from("hi"))));
}`,
    tags: ['enums', 'message', 'match'],
  },
  {
    id: 'rs-ch06-c-018',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Method on an Enum',
    prompt: `Define an enum Coin with variants Penny, Nickel, Dime, Quarter.

Add an impl block with a method value(&self) -> u32 that returns the cent value (1, 5, 10, 25).

In main, create a Coin::Quarter and print quarter.value().`,
    hints: [
      'Write impl Coin { fn value(&self) -> u32 { ... } }.',
      'Inside the method, match self.',
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
    let quarter = Coin::Quarter;
    println!("{}", quarter.value());
}`,
    starter: `enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

impl Coin {
    fn value(&self) -> u32 {
        // TODO: match self and return cents
        todo!()
    }
}

fn main() {
    let quarter = Coin::Quarter;
    println!("{}", quarter.value());
}`,
    tags: ['enums', 'methods', 'match'],
  },
  {
    id: 'rs-ch06-c-019',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Quarter Holds a State',
    prompt: `Define an enum UsState with variants Alabama and Alaska.

Define an enum Coin with variants Penny, Nickel, Dime, and Quarter(UsState).

Write a function value_in_cents(coin: Coin) -> u32. For a Quarter, bind the inner state, print a message like "state quarter!" and return 25. The other coins return their usual values.

In main, call value_in_cents(Coin::Quarter(UsState::Alaska)) and print the returned value.`,
    hints: [
      'The Quarter arm pattern is Coin::Quarter(state).',
      'You can run statements before the arm returns 25.',
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
            let _ = state;
            println!("state quarter!");
            25
        }
    }
}

fn main() {
    println!("{}", value_in_cents(Coin::Quarter(UsState::Alaska)));
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
    // TODO: bind the state inside Quarter
    todo!()
}

fn main() {
    println!("{}", value_in_cents(Coin::Quarter(UsState::Alaska)));
}`,
    tags: ['enums', 'match', 'binding', 'coin'],
  },
  {
    id: 'rs-ch06-c-020',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Plus One With Option',
    prompt: `Write a function plus_one(x: Option<i32>) -> Option<i32> that returns Some(value + 1) when x is Some, and None when x is None.

In main, print the result for plus_one(Some(5)) and plus_one(None) using a debug print such as println!("{:?}", ...).`,
    hints: [
      'Match Some(i) and return Some(i + 1).',
      'The None arm returns None.',
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
    // TODO: add one to the inner value, keep None as None
    todo!()
}

fn main() {
    println!("{:?}", plus_one(Some(5)));
    println!("{:?}", plus_one(None));
}`,
    tags: ['option', 'match', 'binding'],
  },
  {
    id: 'rs-ch06-c-021',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'If Let Else',
    prompt: `Write a function status(opt: Option<i32>) that:
- prints "value is N" (with the inner value) when opt is Some
- prints "no value" otherwise

Use an if let with an else block. In main, call status(Some(8)) and status(None).`,
    hints: [
      'Syntax: if let Some(n) = opt { ... } else { ... }.',
      'The else block handles the None case.',
    ],
    solution: `fn status(opt: Option<i32>) {
    if let Some(n) = opt {
        println!("value is {}", n);
    } else {
        println!("no value");
    }
}

fn main() {
    status(Some(8));
    status(None);
}`,
    starter: `fn status(opt: Option<i32>) {
    // TODO: if let ... else ...
}

fn main() {
    status(Some(8));
    status(None);
}`,
    tags: ['option', 'if-let', 'else'],
  },
  {
    id: 'rs-ch06-c-022',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Catch-All Binding Pattern',
    prompt: `Simulate a dice game. Write a function action(roll: u8) -> String:
- a roll of 3 returns "add a hat"
- a roll of 7 returns "remove a hat"
- any other roll returns a message "move N spaces" where N is the roll value

Use a catch-all binding pattern (a name) for the last arm so you can use the value. In main, print action(3), action(7), and action(5).`,
    hints: [
      'Match the literals 3 and 7 first.',
      'The last arm binds the value, like other => format!("move {} spaces", other).',
    ],
    solution: `fn action(roll: u8) -> String {
    match roll {
        3 => String::from("add a hat"),
        7 => String::from("remove a hat"),
        other => format!("move {} spaces", other),
    }
}

fn main() {
    println!("{}", action(3));
    println!("{}", action(7));
    println!("{}", action(5));
}`,
    starter: `fn action(roll: u8) -> String {
    // TODO: match 3, 7, and a catch-all binding
    todo!()
}

fn main() {
    println!("{}", action(3));
    println!("{}", action(7));
    println!("{}", action(5));
}`,
    tags: ['match', 'catch-all', 'binding'],
  },
  {
    id: 'rs-ch06-c-023',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Find First Even',
    prompt: `Write a function first_even(numbers: &[i32]) -> Option<i32> that returns Some of the first even number in the slice, or None if there is no even number.

In main, print the result for the slices [1, 3, 4, 7] and [1, 3, 5] with a debug print.`,
    hints: [
      'Loop over the slice; when you find an even value, return Some(value).',
      'If the loop finishes without finding one, return None.',
    ],
    solution: `fn first_even(numbers: &[i32]) -> Option<i32> {
    for &n in numbers {
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
    starter: `fn first_even(numbers: &[i32]) -> Option<i32> {
    // TODO: return Some(first even) or None
    todo!()
}

fn main() {
    println!("{:?}", first_even(&[1, 3, 4, 7]));
    println!("{:?}", first_even(&[1, 3, 5]));
}`,
    tags: ['option', 'slices', 'loops'],
  },
  {
    id: 'rs-ch06-c-024',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Safe Division',
    prompt: `Write a function divide(a: i32, b: i32) -> Option<i32> that returns Some(a / b) when b is not zero, and None when b is zero.

In main, print divide(10, 2) and divide(10, 0) with a debug print.`,
    hints: [
      'Check whether b == 0 first.',
      'Return None for zero, otherwise Some(a / b).',
    ],
    solution: `fn divide(a: i32, b: i32) -> Option<i32> {
    if b == 0 {
        None
    } else {
        Some(a / b)
    }
}

fn main() {
    println!("{:?}", divide(10, 2));
    println!("{:?}", divide(10, 0));
}`,
    starter: `fn divide(a: i32, b: i32) -> Option<i32> {
    // TODO: None when dividing by zero
    todo!()
}

fn main() {
    println!("{:?}", divide(10, 2));
    println!("{:?}", divide(10, 0));
}`,
    tags: ['option', 'none', 'guard'],
  },
  {
    id: 'rs-ch06-c-025',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Shape Area Method',
    prompt: `Define an enum Shape with variants:
- Circle(f64) — radius
- Rectangle(f64, f64) — width and height

Add a method area(&self) -> f64 on Shape. Use 3.14159 for pi. Circle area is pi * r * r; Rectangle area is width * height.

In main, print the area of a Circle(1.0) and a Rectangle(2.0, 3.0).`,
    hints: [
      'In the method, match self and bind the inner values.',
      'For Circle(r) you may need to dereference: use *r in the formula.',
    ],
    solution: `enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle(r) => 3.14159 * r * r,
            Shape::Rectangle(w, h) => w * h,
        }
    }
}

fn main() {
    println!("{}", Shape::Circle(1.0).area());
    println!("{}", Shape::Rectangle(2.0, 3.0).area());
}`,
    starter: `enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
}

impl Shape {
    fn area(&self) -> f64 {
        // TODO: compute area per variant
        todo!()
    }
}

fn main() {
    println!("{}", Shape::Circle(1.0).area());
    println!("{}", Shape::Rectangle(2.0, 3.0).area());
}`,
    tags: ['enums', 'methods', 'data'],
  },
  {
    id: 'rs-ch06-c-026',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count the Some Values',
    prompt: `Write a function count_present(items: &[Option<i32>]) -> usize that returns how many elements are Some.

In main, build a slice such as [Some(1), None, Some(3), None, Some(5)] and print the count.`,
    hints: [
      'Loop over the slice and use a match (or if let) to detect Some.',
      'Increment a counter for each Some.',
    ],
    solution: `fn count_present(items: &[Option<i32>]) -> usize {
    let mut count = 0;
    for item in items {
        if let Some(_) = item {
            count += 1;
        }
    }
    count
}

fn main() {
    let data = [Some(1), None, Some(3), None, Some(5)];
    println!("{}", count_present(&data));
}`,
    starter: `fn count_present(items: &[Option<i32>]) -> usize {
    // TODO: count how many are Some
    todo!()
}

fn main() {
    let data = [Some(1), None, Some(3), None, Some(5)];
    println!("{}", count_present(&data));
}`,
    tags: ['option', 'if-let', 'slices'],
  },
  {
    id: 'rs-ch06-c-027',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Operation Enum Calculator',
    prompt: `Define an enum Op with variants Add, Sub, Mul.

Write a function apply(op: Op, a: i32, b: i32) -> i32 that performs the operation on a and b.

In main, print apply(Op::Add, 2, 3), apply(Op::Sub, 9, 4), and apply(Op::Mul, 6, 7).`,
    hints: [
      'Match op and return the matching arithmetic.',
      'Add returns a + b, Sub returns a - b, Mul returns a * b.',
    ],
    solution: `enum Op {
    Add,
    Sub,
    Mul,
}

fn apply(op: Op, a: i32, b: i32) -> i32 {
    match op {
        Op::Add => a + b,
        Op::Sub => a - b,
        Op::Mul => a * b,
    }
}

fn main() {
    println!("{}", apply(Op::Add, 2, 3));
    println!("{}", apply(Op::Sub, 9, 4));
    println!("{}", apply(Op::Mul, 6, 7));
}`,
    starter: `enum Op {
    Add,
    Sub,
    Mul,
}

fn apply(op: Op, a: i32, b: i32) -> i32 {
    // TODO: match op and compute
    todo!()
}

fn main() {
    println!("{}", apply(Op::Add, 2, 3));
    println!("{}", apply(Op::Sub, 9, 4));
    println!("{}", apply(Op::Mul, 6, 7));
}`,
    tags: ['enums', 'match', 'calculator'],
  },
  {
    id: 'rs-ch06-c-028',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Match Multiple Values',
    prompt: `Write a function vowel_or_not(c: char) -> String that returns "vowel" when c is one of a, e, i, o, u (lowercase only) and "other" for anything else.

Use a single match arm with the or-pattern (the | syntax) for the vowels. In main, print vowel_or_not('e') and vowel_or_not('z').`,
    hints: [
      "Combine patterns with |, like 'a' | 'e' | 'i' | 'o' | 'u'.",
      'Use _ for the catch-all "other" arm.',
    ],
    solution: `fn vowel_or_not(c: char) -> String {
    match c {
        'a' | 'e' | 'i' | 'o' | 'u' => String::from("vowel"),
        _ => String::from("other"),
    }
}

fn main() {
    println!("{}", vowel_or_not('e'));
    println!("{}", vowel_or_not('z'));
}`,
    starter: `fn vowel_or_not(c: char) -> String {
    // TODO: use an or-pattern for vowels
    todo!()
}

fn main() {
    println!("{}", vowel_or_not('e'));
    println!("{}", vowel_or_not('z'));
}`,
    tags: ['match', 'or-pattern', 'char'],
  },
  {
    id: 'rs-ch06-c-029',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Direction To Offset',
    prompt: `Define an enum Direction with variants Up, Down, Left, Right.

Write a function offset(dir: Direction) -> (i32, i32) that maps each direction to a coordinate delta:
- Up returns (0, 1)
- Down returns (0, -1)
- Left returns (-1, 0)
- Right returns (1, 0)

In main, print offset(Direction::Left) with a debug print.`,
    hints: [
      'Match each variant to a tuple.',
      'Return the tuple directly from each arm.',
    ],
    solution: `enum Direction {
    Up,
    Down,
    Left,
    Right,
}

fn offset(dir: Direction) -> (i32, i32) {
    match dir {
        Direction::Up => (0, 1),
        Direction::Down => (0, -1),
        Direction::Left => (-1, 0),
        Direction::Right => (1, 0),
    }
}

fn main() {
    println!("{:?}", offset(Direction::Left));
}`,
    starter: `enum Direction {
    Up,
    Down,
    Left,
    Right,
}

fn offset(dir: Direction) -> (i32, i32) {
    // TODO: map direction to (dx, dy)
    todo!()
}

fn main() {
    println!("{:?}", offset(Direction::Left));
}`,
    tags: ['enums', 'match', 'tuples'],
  },
  {
    id: 'rs-ch06-c-030',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Get By Index',
    prompt: `Write a function get(items: &[i32], index: usize) -> Option<i32> that returns Some(value) if index is within bounds, and None otherwise.

In main, with the slice [10, 20, 30], print get of index 1 and get of index 5 using a debug print.`,
    hints: [
      'Compare index against items.len().',
      'When in bounds, return Some(items[index]); otherwise None.',
    ],
    solution: `fn get(items: &[i32], index: usize) -> Option<i32> {
    if index < items.len() {
        Some(items[index])
    } else {
        None
    }
}

fn main() {
    let data = [10, 20, 30];
    println!("{:?}", get(&data, 1));
    println!("{:?}", get(&data, 5));
}`,
    starter: `fn get(items: &[i32], index: usize) -> Option<i32> {
    // TODO: Some when in bounds, None otherwise
    todo!()
}

fn main() {
    let data = [10, 20, 30];
    println!("{:?}", get(&data, 1));
    println!("{:?}", get(&data, 5));
}`,
    tags: ['option', 'slices', 'bounds'],
  },
  {
    id: 'rs-ch06-c-031',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Range Pattern Grade',
    prompt: `Write a function letter_grade(score: u8) -> char using a match with inclusive range patterns:
- 90 through 100 returns 'A'
- 80 through 89 returns 'B'
- 70 through 79 returns 'C'
- anything else returns 'F'

In main, print letter_grade(95), letter_grade(83), and letter_grade(40).`,
    hints: [
      'Inclusive ranges in patterns use ..= , like 90..=100.',
      'Add a catch-all _ arm returning F.',
    ],
    solution: `fn letter_grade(score: u8) -> char {
    match score {
        90..=100 => 'A',
        80..=89 => 'B',
        70..=79 => 'C',
        _ => 'F',
    }
}

fn main() {
    println!("{}", letter_grade(95));
    println!("{}", letter_grade(83));
    println!("{}", letter_grade(40));
}`,
    starter: `fn letter_grade(score: u8) -> char {
    // TODO: use range patterns like 90..=100
    todo!()
}

fn main() {
    println!("{}", letter_grade(95));
    println!("{}", letter_grade(83));
    println!("{}", letter_grade(40));
}`,
    tags: ['match', 'ranges', 'patterns'],
  },
  {
    id: 'rs-ch06-c-032',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Sum the Options',
    prompt: `Write a function sum_present(items: &[Option<i32>]) -> i32 that adds up only the values inside Some, treating None as contributing nothing.

In main, with the slice [Some(2), None, Some(3), Some(5), None], print the total.`,
    hints: [
      'Loop and match each element.',
      'For Some(n) add n; for None do nothing.',
    ],
    solution: `fn sum_present(items: &[Option<i32>]) -> i32 {
    let mut total = 0;
    for item in items {
        match item {
            Some(n) => total += n,
            None => {}
        }
    }
    total
}

fn main() {
    let data = [Some(2), None, Some(3), Some(5), None];
    println!("{}", sum_present(&data));
}`,
    starter: `fn sum_present(items: &[Option<i32>]) -> i32 {
    // TODO: sum the Some values
    todo!()
}

fn main() {
    let data = [Some(2), None, Some(3), Some(5), None];
    println!("{}", sum_present(&data));
}`,
    tags: ['option', 'match', 'slices'],
  },
  {
    id: 'rs-ch06-c-033',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Traffic Light Duration With State',
    prompt: `Define an enum Light with variants:
- Red(u32) — seconds remaining
- Yellow(u32) — seconds remaining
- Green(u32) — seconds remaining

Write a function seconds(light: Light) -> u32 that returns the inner number regardless of color, using a catch-all binding inside each pattern is not needed — instead use one arm per variant binding the value.

In main, print seconds(Light::Green(12)).`,
    hints: [
      'Each arm binds the inner number, like Light::Red(s) => s.',
      'All three arms return the bound value.',
    ],
    solution: `enum Light {
    Red(u32),
    Yellow(u32),
    Green(u32),
}

fn seconds(light: Light) -> u32 {
    match light {
        Light::Red(s) => s,
        Light::Yellow(s) => s,
        Light::Green(s) => s,
    }
}

fn main() {
    println!("{}", seconds(Light::Green(12)));
}`,
    starter: `enum Light {
    Red(u32),
    Yellow(u32),
    Green(u32),
}

fn seconds(light: Light) -> u32 {
    // TODO: return the inner seconds for any color
    todo!()
}

fn main() {
    println!("{}", seconds(Light::Green(12)));
}`,
    tags: ['enums', 'match', 'binding'],
  },
  {
    id: 'rs-ch06-c-034',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'If Let Counter With State',
    prompt: `You are processing a list of coins where each Quarter carries a state. Define:

    enum UsState { Alabama, Alaska }
    enum Coin { Penny, Quarter(UsState) }

In main, build a slice of coins containing at least one Penny and one Quarter. Loop over it, and using if let, count how many quarters there are (binding the state but not using it). Print the final count.`,
    hints: [
      'Use if let Coin::Quarter(_state) = coin to detect quarters.',
      'Increment a counter inside the if let block.',
    ],
    solution: `enum UsState {
    Alabama,
    Alaska,
}

enum Coin {
    Penny,
    Quarter(UsState),
}

fn main() {
    let coins = [
        Coin::Penny,
        Coin::Quarter(UsState::Alaska),
        Coin::Penny,
        Coin::Quarter(UsState::Alabama),
    ];
    let mut count = 0;
    for coin in &coins {
        if let Coin::Quarter(_state) = coin {
            count += 1;
        }
    }
    println!("{}", count);
}`,
    starter: `enum UsState {
    Alabama,
    Alaska,
}

enum Coin {
    Penny,
    Quarter(UsState),
}

fn main() {
    let coins = [
        Coin::Penny,
        Coin::Quarter(UsState::Alaska),
        Coin::Penny,
        Coin::Quarter(UsState::Alabama),
    ];
    // TODO: count quarters with if let
}`,
    tags: ['enums', 'if-let', 'coin'],
  },
  {
    id: 'rs-ch06-c-035',
    chapter: 6,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Process Messages With a Method',
    prompt: `Define this enum and give it a method:

    enum Message {
        Quit,
        Move { x: i32, y: i32 },
        Write(String),
    }

Add a method call(&self) -> String on Message that returns:
- "quitting" for Quit
- a string like "moving to (X, Y)" for Move, using the field values
- a string like "writing: TEXT" for Write, using the inner text

In main, call call on a Move { x: 4, y: 9 } and on a Write(String::from("hi")), printing each result.`,
    hints: [
      'In the method, match self and bind named fields with Message::Move { x, y }.',
      'Use format! to build the returned strings.',
    ],
    solution: `enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
}

impl Message {
    fn call(&self) -> String {
        match self {
            Message::Quit => String::from("quitting"),
            Message::Move { x, y } => format!("moving to ({}, {})", x, y),
            Message::Write(text) => format!("writing: {}", text),
        }
    }
}

fn main() {
    let m = Message::Move { x: 4, y: 9 };
    let w = Message::Write(String::from("hi"));
    println!("{}", m.call());
    println!("{}", w.call());
}`,
    starter: `enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
}

impl Message {
    fn call(&self) -> String {
        // TODO: match self and build a string per variant
        todo!()
    }
}

fn main() {
    let m = Message::Move { x: 4, y: 9 };
    let w = Message::Write(String::from("hi"));
    println!("{}", m.call());
    println!("{}", w.call());
}`,
    tags: ['enums', 'message', 'methods'],
  },
]

export default problems
