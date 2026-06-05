import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch05-c-001',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Define a User Struct',
    prompt: `Define a struct named \`User\` with three fields:
- \`username\` of type \`String\`
- \`age\` of type \`u32\`
- \`active\` of type \`bool\`

You do not need to create an instance yet. Just declare the struct so the program compiles.`,
    hints: [
      'Use the \`struct\` keyword followed by the name and a block of fields.',
      'Each field is written as \`name: Type,\`.',
    ],
    solution: `struct User {
    username: String,
    age: u32,
    active: bool,
}

fn main() {
    // Struct defined above; nothing to print yet.
}`,
    starter: `// TODO: define the User struct here

fn main() {}`,
    tags: ['structs', 'definition'],
  },
  {
    id: 'rs-ch05-c-002',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Build a User Instance',
    prompt: `Given this struct:

    struct User {
        username: String,
        age: u32,
        active: bool,
    }

In \`main\`, create an instance named \`u\` with username "alice", age 30, and active true. Then print the username using \`println!\`.`,
    hints: [
      'Instantiate with \`User { field: value, ... }\`.',
      'Access a field with dot notation, like \`u.username\`.',
    ],
    solution: `struct User {
    username: String,
    age: u32,
    active: bool,
}

fn main() {
    let u = User {
        username: String::from("alice"),
        age: 30,
        active: true,
    };
    println!("{}", u.username);
}`,
    starter: `struct User {
    username: String,
    age: u32,
    active: bool,
}

fn main() {
    // TODO: create the instance and print the username
}`,
    tags: ['structs', 'instantiation'],
  },
  {
    id: 'rs-ch05-c-003',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Access Struct Fields',
    prompt: `Given this struct and instance:

    struct Book {
        title: String,
        pages: u32,
    }

In \`main\`, create a \`Book\` with title "Rust" and 250 pages, then print exactly:

    Rust has 250 pages`,
    hints: [
      'Read fields with \`book.title\` and \`book.pages\`.',
      'Use \`println!("{} has {} pages", ...)\`.',
    ],
    solution: `struct Book {
    title: String,
    pages: u32,
}

fn main() {
    let book = Book {
        title: String::from("Rust"),
        pages: 250,
    };
    println!("{} has {} pages", book.title, book.pages);
}`,
    starter: `struct Book {
    title: String,
    pages: u32,
}

fn main() {
    // TODO: create a Book and print "Rust has 250 pages"
}`,
    tags: ['structs', 'field-access'],
  },
  {
    id: 'rs-ch05-c-004',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Mutate a Field',
    prompt: `Given:

    struct Counter {
        value: i32,
    }

In \`main\`, create a mutable \`Counter\` starting at 0, set its \`value\` field to 5 by assignment, and print the value. Remember that the whole instance must be mutable to change a field.`,
    hints: [
      'Declare the instance with \`let mut\`.',
      'Assign to a field with \`counter.value = 5;\`.',
    ],
    solution: `struct Counter {
    value: i32,
}

fn main() {
    let mut counter = Counter { value: 0 };
    counter.value = 5;
    println!("{}", counter.value);
}`,
    starter: `struct Counter {
    value: i32,
}

fn main() {
    // TODO: create a mutable Counter, set value to 5, print it
}`,
    tags: ['structs', 'mutability'],
  },
  {
    id: 'rs-ch05-c-005',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Point Tuple Struct',
    prompt: `Define a tuple struct named \`Point\` that holds two \`i32\` values (x and y). In \`main\`, create a \`Point\` at (3, 4) and print both coordinates using index access, producing exactly:

    x = 3, y = 4`,
    hints: [
      'Tuple structs look like \`struct Point(i32, i32);\`.',
      'Access elements with \`.0\` and \`.1\`.',
    ],
    solution: `struct Point(i32, i32);

fn main() {
    let p = Point(3, 4);
    println!("x = {}, y = {}", p.0, p.1);
}`,
    starter: `// TODO: define the Point tuple struct

fn main() {
    // TODO: create a Point at (3, 4) and print the coordinates
}`,
    tags: ['tuple-struct', 'structs'],
  },
  {
    id: 'rs-ch05-c-006',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Color Tuple Struct',
    prompt: `Define a tuple struct named \`Color\` that holds three \`u8\` values (red, green, blue). In \`main\`, create the color black, which is (0, 0, 0), and print the green component (the second value).`,
    hints: [
      'Define it as \`struct Color(u8, u8, u8);\`.',
      'The second element is \`color.1\`.',
    ],
    solution: `struct Color(u8, u8, u8);

fn main() {
    let black = Color(0, 0, 0);
    println!("{}", black.1);
}`,
    starter: `// TODO: define the Color tuple struct

fn main() {
    // TODO: create black (0, 0, 0) and print its green component
}`,
    tags: ['tuple-struct', 'structs'],
  },
  {
    id: 'rs-ch05-c-007',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Unit-Like Struct',
    prompt: `Define a unit-like struct named \`AlwaysEqual\` that has no fields at all. In \`main\`, create an instance of it named \`subject\`. The program just needs to compile and run.`,
    hints: [
      'A unit-like struct is declared with \`struct AlwaysEqual;\`.',
      'Create an instance with \`let subject = AlwaysEqual;\`.',
    ],
    solution: `struct AlwaysEqual;

fn main() {
    let subject = AlwaysEqual;
    let _ = subject;
}`,
    starter: `// TODO: define the unit-like struct AlwaysEqual

fn main() {
    // TODO: create an instance named subject
}`,
    tags: ['unit-struct', 'structs'],
  },
  {
    id: 'rs-ch05-c-008',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Build From Parameters',
    prompt: `Given:

    struct Rectangle {
        width: u32,
        height: u32,
    }

Write a function \`make_rect(w: u32, h: u32) -> Rectangle\` that returns a \`Rectangle\` using the parameters for width and height. In \`main\`, call it with 4 and 7 and print the width.`,
    hints: [
      'The function body is just \`Rectangle { width: w, height: h }\`.',
      'Return the struct as the last expression (no semicolon).',
    ],
    solution: `struct Rectangle {
    width: u32,
    height: u32,
}

fn make_rect(w: u32, h: u32) -> Rectangle {
    Rectangle { width: w, height: h }
}

fn main() {
    let r = make_rect(4, 7);
    println!("{}", r.width);
}`,
    starter: `struct Rectangle {
    width: u32,
    height: u32,
}

fn make_rect(w: u32, h: u32) -> Rectangle {
    // TODO: build and return the Rectangle
}

fn main() {
    let r = make_rect(4, 7);
    println!("{}", r.width);
}`,
    tags: ['structs', 'functions'],
  },
  {
    id: 'rs-ch05-c-009',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Field Init Shorthand',
    prompt: `Given:

    struct User {
        username: String,
        email: String,
    }

Write \`fn build_user(username: String, email: String) -> User\` that uses field init shorthand (do NOT write \`username: username\`; just write \`username\`). Return a \`User\`. In \`main\`, build a user and print the email.`,
    hints: [
      'When a parameter name matches the field name, you can write just the name.',
      'Body: \`User { username, email }\`.',
    ],
    solution: `struct User {
    username: String,
    email: String,
}

fn build_user(username: String, email: String) -> User {
    User { username, email }
}

fn main() {
    let u = build_user(String::from("bob"), String::from("bob@example.com"));
    println!("{}", u.email);
}`,
    starter: `struct User {
    username: String,
    email: String,
}

fn build_user(username: String, email: String) -> User {
    // TODO: use field init shorthand
}

fn main() {
    let u = build_user(String::from("bob"), String::from("bob@example.com"));
    println!("{}", u.email);
}`,
    tags: ['structs', 'shorthand'],
  },
  {
    id: 'rs-ch05-c-010',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print a Tuple Struct Field',
    prompt: `Define a tuple struct \`Pair\` holding two \`f64\` values. In \`main\`, create a \`Pair\` with 1.5 and 2.5, then print their sum (the result should be 4).`,
    hints: [
      'Access the values with \`.0\` and \`.1\`.',
      'Add them: \`pair.0 + pair.1\`.',
    ],
    solution: `struct Pair(f64, f64);

fn main() {
    let pair = Pair(1.5, 2.5);
    println!("{}", pair.0 + pair.1);
}`,
    starter: `// TODO: define the Pair tuple struct

fn main() {
    // TODO: create Pair(1.5, 2.5) and print the sum
}`,
    tags: ['tuple-struct', 'structs'],
  },
  {
    id: 'rs-ch05-c-011',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Two Independent Instances',
    prompt: `Given:

    struct Dog {
        name: String,
        legs: u32,
    }

In \`main\`, create two dogs: "Rex" with 4 legs and "Tripod" with 3 legs. Print each name with its leg count, one per line, like:

    Rex: 4
    Tripod: 3`,
    hints: [
      'Each instance is its own \`let\` binding.',
      'Print with two \`println!\` calls.',
    ],
    solution: `struct Dog {
    name: String,
    legs: u32,
}

fn main() {
    let a = Dog { name: String::from("Rex"), legs: 4 };
    let b = Dog { name: String::from("Tripod"), legs: 3 };
    println!("{}: {}", a.name, a.legs);
    println!("{}: {}", b.name, b.legs);
}`,
    starter: `struct Dog {
    name: String,
    legs: u32,
}

fn main() {
    // TODO: create two dogs and print them
}`,
    tags: ['structs', 'instantiation'],
  },
  {
    id: 'rs-ch05-c-012',
    chapter: 5,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Mutate Then Read',
    prompt: `Given:

    struct Account {
        balance: i64,
    }

In \`main\`, create a mutable \`Account\` with balance 100. Add 50 to the balance by writing \`account.balance += 50;\`, then print the new balance (should be 150).`,
    hints: [
      'The binding must be \`let mut\`.',
      'Use \`+=\` to increase the field in place.',
    ],
    solution: `struct Account {
    balance: i64,
}

fn main() {
    let mut account = Account { balance: 100 };
    account.balance += 50;
    println!("{}", account.balance);
}`,
    starter: `struct Account {
    balance: i64,
}

fn main() {
    // TODO: create a mutable Account at 100, add 50, print it
}`,
    tags: ['structs', 'mutability'],
  },
  {
    id: 'rs-ch05-c-013',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Rectangle Area Function',
    prompt: `Given:

    struct Rectangle {
        width: u32,
        height: u32,
    }

Write a free function \`area(rect: &Rectangle) -> u32\` that returns width times height. It must borrow the rectangle (take a reference), not take ownership. In \`main\`, build a 30-by-50 rectangle and print:

    The area is 1500 square pixels.`,
    hints: [
      'The parameter type is \`&Rectangle\`.',
      'Access fields through the reference with \`rect.width\` and \`rect.height\`.',
    ],
    solution: `struct Rectangle {
    width: u32,
    height: u32,
}

fn area(rect: &Rectangle) -> u32 {
    rect.width * rect.height
}

fn main() {
    let rect = Rectangle { width: 30, height: 50 };
    println!("The area is {} square pixels.", area(&rect));
}`,
    starter: `struct Rectangle {
    width: u32,
    height: u32,
}

fn area(rect: &Rectangle) -> u32 {
    // TODO
}

fn main() {
    let rect = Rectangle { width: 30, height: 50 };
    println!("The area is {} square pixels.", area(&rect));
}`,
    tags: ['structs', 'borrowing', 'functions'],
  },
  {
    id: 'rs-ch05-c-014',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Area as a Method',
    prompt: `Given:

    struct Rectangle {
        width: u32,
        height: u32,
    }

Add an \`impl\` block with a method \`area(&self) -> u32\` returning width times height. In \`main\`, create a 30-by-50 rectangle and print its area by calling \`rect.area()\`.`,
    hints: [
      'Methods go inside \`impl Rectangle { ... }\`.',
      'The first parameter is \`&self\`; access fields with \`self.width\`.',
    ],
    solution: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect = Rectangle { width: 30, height: 50 };
    println!("{}", rect.area());
}`,
    starter: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // TODO: add the area method
}

fn main() {
    let rect = Rectangle { width: 30, height: 50 };
    println!("{}", rect.area());
}`,
    tags: ['methods', 'structs', 'borrowing'],
  },
  {
    id: 'rs-ch05-c-015',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Perimeter Method',
    prompt: `Given a \`Rectangle\` struct with \`width\` and \`height\` (both \`u32\`), add a method \`perimeter(&self) -> u32\` that returns twice the sum of width and height. In \`main\`, create a 4-by-6 rectangle and print its perimeter (should be 20).`,
    hints: [
      'Perimeter is \`2 * (width + height)\`.',
      'Borrow with \`&self\`.',
    ],
    solution: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn perimeter(&self) -> u32 {
        2 * (self.width + self.height)
    }
}

fn main() {
    let rect = Rectangle { width: 4, height: 6 };
    println!("{}", rect.perimeter());
}`,
    starter: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // TODO: add perimeter
}

fn main() {
    let rect = Rectangle { width: 4, height: 6 };
    println!("{}", rect.perimeter());
}`,
    tags: ['methods', 'structs'],
  },
  {
    id: 'rs-ch05-c-016',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Derive Debug and Print',
    prompt: `Given:

    struct Rectangle {
        width: u32,
        height: u32,
    }

Add \`#[derive(Debug)]\` above the struct so it can be debug-printed. In \`main\`, create a 30-by-50 rectangle and print it with \`println!("{:?}", rect);\`. Expected output:

    Rectangle { width: 30, height: 50 }`,
    hints: [
      'Put \`#[derive(Debug)]\` on the line directly above \`struct\`.',
      'Use the \`{:?}\` formatting placeholder.',
    ],
    solution: `#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect = Rectangle { width: 30, height: 50 };
    println!("{:?}", rect);
}`,
    starter: `// TODO: add the derive attribute
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect = Rectangle { width: 30, height: 50 };
    println!("{:?}", rect);
}`,
    tags: ['debug', 'derive', 'structs'],
  },
  {
    id: 'rs-ch05-c-017',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Pretty Debug Output',
    prompt: `Given a \`#[derive(Debug)]\` struct \`Rectangle\` with \`width\` and \`height\` (both \`u32\`), create a 30-by-50 instance in \`main\` and print it with the pretty-debug placeholder \`{:#?}\` so each field appears on its own line.`,
    hints: [
      'The pretty-print placeholder is \`{:#?}\`.',
      'You still need \`#[derive(Debug)]\` on the struct.',
    ],
    solution: `#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect = Rectangle { width: 30, height: 50 };
    println!("{:#?}", rect);
}`,
    starter: `#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect = Rectangle { width: 30, height: 50 };
    // TODO: pretty-print rect with {:#?}
}`,
    tags: ['debug', 'derive', 'formatting'],
  },
  {
    id: 'rs-ch05-c-018',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Associated Function Constructor',
    prompt: `Given:

    struct Rectangle {
        width: u32,
        height: u32,
    }

Add an associated function \`Rectangle::new(width: u32, height: u32) -> Self\` (no \`self\` parameter) that builds and returns a \`Rectangle\`. In \`main\`, call \`Rectangle::new(10, 20)\` and print the height.`,
    hints: [
      'An associated function has no \`self\` parameter and is called with \`Type::name(...)\`.',
      'Return type \`Self\` refers to \`Rectangle\`.',
    ],
    solution: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn new(width: u32, height: u32) -> Self {
        Self { width, height }
    }
}

fn main() {
    let rect = Rectangle::new(10, 20);
    println!("{}", rect.height);
}`,
    starter: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // TODO: add the new associated function
}

fn main() {
    let rect = Rectangle::new(10, 20);
    println!("{}", rect.height);
}`,
    tags: ['associated-function', 'constructor', 'methods'],
  },
  {
    id: 'rs-ch05-c-019',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Square Constructor',
    prompt: `Given a \`Rectangle\` struct with \`width\` and \`height\` (both \`u32\`), add an associated function \`Rectangle::square(size: u32) -> Self\` that returns a rectangle whose width and height are both \`size\`. In \`main\`, build a square of size 8 and print both its width and height (each should be 8).`,
    hints: [
      'Set both fields to the same \`size\` value.',
      'Call it with \`Rectangle::square(8)\`.',
    ],
    solution: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn square(size: u32) -> Self {
        Self { width: size, height: size }
    }
}

fn main() {
    let sq = Rectangle::square(8);
    println!("{} {}", sq.width, sq.height);
}`,
    starter: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // TODO: add the square associated function
}

fn main() {
    let sq = Rectangle::square(8);
    println!("{} {}", sq.width, sq.height);
}`,
    tags: ['associated-function', 'constructor', 'structs'],
  },
  {
    id: 'rs-ch05-c-020',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Method With a Parameter',
    prompt: `Given:

    struct Rectangle {
        width: u32,
        height: u32,
    }

Add a method \`can_hold(&self, other: &Rectangle) -> bool\` that returns true if \`self\` is strictly larger than \`other\` in BOTH width and height. In \`main\`, make a 30-by-50 rect and a 10-by-40 rect and print whether the first can hold the second (expect \`true\`).`,
    hints: [
      'The method takes two references: \`&self\` and \`&Rectangle\`.',
      'Combine two comparisons with \`&&\`.',
    ],
    solution: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}

fn main() {
    let r1 = Rectangle { width: 30, height: 50 };
    let r2 = Rectangle { width: 10, height: 40 };
    println!("{}", r1.can_hold(&r2));
}`,
    starter: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // TODO: add can_hold
}

fn main() {
    let r1 = Rectangle { width: 30, height: 50 };
    let r2 = Rectangle { width: 10, height: 40 };
    println!("{}", r1.can_hold(&r2));
}`,
    tags: ['methods', 'parameters', 'structs'],
  },
  {
    id: 'rs-ch05-c-021',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Method That Mutates Self',
    prompt: `Given:

    struct Counter {
        value: u32,
    }

Add a method \`increment(&mut self)\` that adds 1 to \`value\`. In \`main\`, create a mutable counter starting at 0, call \`increment\` three times, and print the value (should be 3).`,
    hints: [
      'A mutating method takes \`&mut self\`.',
      'The instance in \`main\` must be \`let mut\` to call it.',
    ],
    solution: `struct Counter {
    value: u32,
}

impl Counter {
    fn increment(&mut self) {
        self.value += 1;
    }
}

fn main() {
    let mut c = Counter { value: 0 };
    c.increment();
    c.increment();
    c.increment();
    println!("{}", c.value);
}`,
    starter: `struct Counter {
    value: u32,
}

impl Counter {
    // TODO: add increment(&mut self)
}

fn main() {
    let mut c = Counter { value: 0 };
    // TODO: increment three times
    println!("{}", c.value);
}`,
    tags: ['methods', 'mutability', 'structs'],
  },
  {
    id: 'rs-ch05-c-022',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Scale a Rectangle In Place',
    prompt: `Given a \`Rectangle\` struct with \`width\` and \`height\` (both \`u32\`), add a method \`scale(&mut self, factor: u32)\` that multiplies BOTH width and height by \`factor\`. In \`main\`, start with a 3-by-4 rectangle, scale by 2, and print width and height (expect 6 and 8).`,
    hints: [
      'Use \`&mut self\` plus a \`factor\` parameter.',
      'Multiply each field with \`*=\`.',
    ],
    solution: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn scale(&mut self, factor: u32) {
        self.width *= factor;
        self.height *= factor;
    }
}

fn main() {
    let mut r = Rectangle { width: 3, height: 4 };
    r.scale(2);
    println!("{} {}", r.width, r.height);
}`,
    starter: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // TODO: add scale(&mut self, factor: u32)
}

fn main() {
    let mut r = Rectangle { width: 3, height: 4 };
    r.scale(2);
    println!("{} {}", r.width, r.height);
}`,
    tags: ['methods', 'mutability', 'parameters'],
  },
  {
    id: 'rs-ch05-c-023',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Struct Update Syntax',
    prompt: `Given:

    #[derive(Debug)]
    struct Config {
        verbose: bool,
        retries: u32,
        name: String,
    }

In \`main\`, create a base config with verbose false, retries 3, and name "base". Then create a second config that is the same EXCEPT \`verbose\` is true, using struct update syntax (\`..\`) to copy the remaining fields from the base. Print the second config with \`{:?}\`. Note: because \`name\` is a \`String\`, the base will be moved, so do not use it afterward.`,
    hints: [
      'Struct update syntax: \`Config { verbose: true, ..base }\`.',
      'The \`..base\` must come last and copies the unspecified fields.',
    ],
    solution: `#[derive(Debug)]
struct Config {
    verbose: bool,
    retries: u32,
    name: String,
}

fn main() {
    let base = Config {
        verbose: false,
        retries: 3,
        name: String::from("base"),
    };
    let updated = Config {
        verbose: true,
        ..base
    };
    println!("{:?}", updated);
}`,
    starter: `#[derive(Debug)]
struct Config {
    verbose: bool,
    retries: u32,
    name: String,
}

fn main() {
    let base = Config {
        verbose: false,
        retries: 3,
        name: String::from("base"),
    };
    // TODO: build updated from base using ..base, with verbose = true
}`,
    tags: ['struct-update', 'structs'],
  },
  {
    id: 'rs-ch05-c-024',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Update Syntax With Copy Fields',
    prompt: `Given:

    #[derive(Debug)]
    struct Settings {
        volume: u32,
        brightness: u32,
        muted: bool,
    }

All fields here implement Copy. Create a \`base\` with volume 50, brightness 80, muted false. Use struct update syntax to make \`quiet\` that is identical except \`volume\` is 0. Print BOTH \`base\` and \`quiet\` with \`{:?}\` (base is still usable here because every field is Copy).`,
    hints: [
      'Since all fields are Copy, the base is not moved by \`..base\`.',
      'Build \`quiet\` as \`Settings { volume: 0, ..base }\`.',
    ],
    solution: `#[derive(Debug)]
struct Settings {
    volume: u32,
    brightness: u32,
    muted: bool,
}

fn main() {
    let base = Settings { volume: 50, brightness: 80, muted: false };
    let quiet = Settings { volume: 0, ..base };
    println!("{:?}", base);
    println!("{:?}", quiet);
}`,
    starter: `#[derive(Debug)]
struct Settings {
    volume: u32,
    brightness: u32,
    muted: bool,
}

fn main() {
    let base = Settings { volume: 50, brightness: 80, muted: false };
    // TODO: build quiet with volume 0 via ..base, then print both
}`,
    tags: ['struct-update', 'copy', 'debug'],
  },
  {
    id: 'rs-ch05-c-025',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Is It a Square',
    prompt: `Given a \`Rectangle\` struct with \`width\` and \`height\` (both \`u32\`), add a method \`is_square(&self) -> bool\` returning true when width equals height. In \`main\`, test it on a 5-by-5 rectangle and a 5-by-9 rectangle, printing the boolean result for each (expect \`true\` then \`false\`).`,
    hints: [
      'Compare the two fields with \`==\`.',
      'Return the comparison directly.',
    ],
    solution: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn is_square(&self) -> bool {
        self.width == self.height
    }
}

fn main() {
    let a = Rectangle { width: 5, height: 5 };
    let b = Rectangle { width: 5, height: 9 };
    println!("{}", a.is_square());
    println!("{}", b.is_square());
}`,
    starter: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // TODO: add is_square
}

fn main() {
    let a = Rectangle { width: 5, height: 5 };
    let b = Rectangle { width: 5, height: 9 };
    println!("{}", a.is_square());
    println!("{}", b.is_square());
}`,
    tags: ['methods', 'structs', 'boolean'],
  },
  {
    id: 'rs-ch05-c-026',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Multiple Impl Blocks',
    prompt: `Given a \`Rectangle\` struct with \`width\` and \`height\` (both \`u32\`), define TWO separate \`impl\` blocks: the first contains \`area(&self) -> u32\`, and the second contains \`is_wide(&self) -> bool\` (true when width is greater than height). In \`main\`, make a 40-by-20 rectangle and print its area (800) and whether it is wide (\`true\`).`,
    hints: [
      'You can write \`impl Rectangle { ... }\` more than once.',
      'Put one method in each block.',
    ],
    solution: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

impl Rectangle {
    fn is_wide(&self) -> bool {
        self.width > self.height
    }
}

fn main() {
    let r = Rectangle { width: 40, height: 20 };
    println!("{}", r.area());
    println!("{}", r.is_wide());
}`,
    starter: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // TODO: area here
}

impl Rectangle {
    // TODO: is_wide here
}

fn main() {
    let r = Rectangle { width: 40, height: 20 };
    println!("{}", r.area());
    println!("{}", r.is_wide());
}`,
    tags: ['methods', 'impl-blocks', 'structs'],
  },
  {
    id: 'rs-ch05-c-027',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Circle Area Method',
    prompt: `Define a struct \`Circle\` with one field \`radius\` of type \`f64\`. Add a method \`area(&self) -> f64\` that returns \`3.14159 * radius * radius\`. In \`main\`, create a circle of radius 2.0 and print its area.`,
    hints: [
      'Use \`self.radius\` twice in the multiplication.',
      'Keep the field as \`f64\` so the math is floating point.',
    ],
    solution: `struct Circle {
    radius: f64,
}

impl Circle {
    fn area(&self) -> f64 {
        3.14159 * self.radius * self.radius
    }
}

fn main() {
    let c = Circle { radius: 2.0 };
    println!("{}", c.area());
}`,
    starter: `struct Circle {
    radius: f64,
}

impl Circle {
    // TODO: add area
}

fn main() {
    let c = Circle { radius: 2.0 };
    println!("{}", c.area());
}`,
    tags: ['methods', 'structs', 'floats'],
  },
  {
    id: 'rs-ch05-c-028',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Origin Constructor',
    prompt: `Define a struct \`Point\` with fields \`x\` and \`y\` (both \`i32\`). Add an associated function \`Point::origin() -> Self\` that returns a point at (0, 0) and takes no parameters. In \`main\`, create the origin and print \`(0, 0)\` using its fields, formatted exactly like:

    (0, 0)`,
    hints: [
      'An associated function can take zero parameters.',
      'Print with \`println!("({}, {})", p.x, p.y)\`.',
    ],
    solution: `struct Point {
    x: i32,
    y: i32,
}

impl Point {
    fn origin() -> Self {
        Self { x: 0, y: 0 }
    }
}

fn main() {
    let p = Point::origin();
    println!("({}, {})", p.x, p.y);
}`,
    starter: `struct Point {
    x: i32,
    y: i32,
}

impl Point {
    // TODO: add origin()
}

fn main() {
    let p = Point::origin();
    println!("({}, {})", p.x, p.y);
}`,
    tags: ['associated-function', 'constructor', 'structs'],
  },
  {
    id: 'rs-ch05-c-029',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Method Returning a String',
    prompt: `Define a struct \`Person\` with fields \`name\` (\`String\`) and \`age\` (\`u32\`). Add a method \`greeting(&self) -> String\` that returns a sentence like \`Hi, I'm alice and I'm 30.\` built with \`format!\`. In \`main\`, create a person and print the result of \`greeting\`.`,
    hints: [
      'Use the \`format!\` macro to build and return a \`String\`.',
      'Read the fields with \`self.name\` and \`self.age\`.',
    ],
    solution: `struct Person {
    name: String,
    age: u32,
}

impl Person {
    fn greeting(&self) -> String {
        format!("Hi, I'm {} and I'm {}.", self.name, self.age)
    }
}

fn main() {
    let p = Person { name: String::from("alice"), age: 30 };
    println!("{}", p.greeting());
}`,
    starter: `struct Person {
    name: String,
    age: u32,
}

impl Person {
    // TODO: add greeting returning a String
}

fn main() {
    let p = Person { name: String::from("alice"), age: 30 };
    println!("{}", p.greeting());
}`,
    tags: ['methods', 'format', 'structs'],
  },
  {
    id: 'rs-ch05-c-030',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Debug a Tuple Struct',
    prompt: `Define a tuple struct \`Point3(i32, i32, i32)\` and add \`#[derive(Debug)]\` to it. In \`main\`, create \`Point3(1, 2, 3)\` and debug-print it with \`{:?}\`. Expected output:

    Point3(1, 2, 3)`,
    hints: [
      'Derive works on tuple structs too.',
      'Use the \`{:?}\` placeholder.',
    ],
    solution: `#[derive(Debug)]
struct Point3(i32, i32, i32);

fn main() {
    let p = Point3(1, 2, 3);
    println!("{:?}", p);
}`,
    starter: `// TODO: add derive(Debug) and define Point3 tuple struct

fn main() {
    let p = Point3(1, 2, 3);
    println!("{:?}", p);
}`,
    tags: ['debug', 'tuple-struct', 'derive'],
  },
  {
    id: 'rs-ch05-c-031',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Inspect a Value With dbg!',
    prompt: `The \`dbg!\` macro prints a value (with file and line info) to standard error and returns the value back. Given a \`Rectangle\` struct with \`width\` and \`height\` (both \`u32\`) that derives \`Debug\`, build one where \`width\` is set to the result of \`dbg!(30 * 1)\` and \`height\` is 50. Then \`dbg!(&rect);\` to inspect the whole struct.`,
    hints: [
      'Wrap an expression like \`dbg!(30 * 1)\` to print and pass through its value.',
      'For the whole struct, pass a reference: \`dbg!(&rect)\`.',
    ],
    solution: `#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect = Rectangle {
        width: dbg!(30 * 1),
        height: 50,
    };
    dbg!(&rect);
}`,
    starter: `#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect = Rectangle {
        width: dbg!(30 * 1),
        height: 50,
    };
    // TODO: dbg! the whole rect by reference
}`,
    tags: ['dbg', 'debug', 'structs'],
  },
  {
    id: 'rs-ch05-c-032',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Bank Deposit and Withdraw',
    prompt: `Define a struct \`BankAccount\` with field \`balance\` (\`i64\`). Add two methods: \`deposit(&mut self, amount: i64)\` adds to the balance, and \`withdraw(&mut self, amount: i64)\` subtracts from it. In \`main\`, start at 100, deposit 50, withdraw 30, and print the final balance (should be 120).`,
    hints: [
      'Both methods need \`&mut self\` and an \`amount\` parameter.',
      'Use \`+=\` and \`-=\`.',
    ],
    solution: `struct BankAccount {
    balance: i64,
}

impl BankAccount {
    fn deposit(&mut self, amount: i64) {
        self.balance += amount;
    }

    fn withdraw(&mut self, amount: i64) {
        self.balance -= amount;
    }
}

fn main() {
    let mut acct = BankAccount { balance: 100 };
    acct.deposit(50);
    acct.withdraw(30);
    println!("{}", acct.balance);
}`,
    starter: `struct BankAccount {
    balance: i64,
}

impl BankAccount {
    // TODO: deposit and withdraw
}

fn main() {
    let mut acct = BankAccount { balance: 100 };
    acct.deposit(50);
    acct.withdraw(30);
    println!("{}", acct.balance);
}`,
    tags: ['methods', 'mutability', 'structs'],
  },
  {
    id: 'rs-ch05-c-033',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Constructor Plus Method',
    prompt: `Define a struct \`Temperature\` with field \`celsius\` (\`f64\`). Add an associated function \`Temperature::new(celsius: f64) -> Self\` and a method \`to_fahrenheit(&self) -> f64\` that returns \`celsius * 9.0 / 5.0 + 32.0\`. In \`main\`, build a temperature of 100.0 with \`new\` and print its Fahrenheit value (should be 212).`,
    hints: [
      'Put both the associated function and the method in the same \`impl\` block.',
      'Call \`Temperature::new(100.0)\`, then \`.to_fahrenheit()\`.',
    ],
    solution: `struct Temperature {
    celsius: f64,
}

impl Temperature {
    fn new(celsius: f64) -> Self {
        Self { celsius }
    }

    fn to_fahrenheit(&self) -> f64 {
        self.celsius * 9.0 / 5.0 + 32.0
    }
}

fn main() {
    let t = Temperature::new(100.0);
    println!("{}", t.to_fahrenheit());
}`,
    starter: `struct Temperature {
    celsius: f64,
}

impl Temperature {
    // TODO: new and to_fahrenheit
}

fn main() {
    let t = Temperature::new(100.0);
    println!("{}", t.to_fahrenheit());
}`,
    tags: ['associated-function', 'methods', 'structs'],
  },
  {
    id: 'rs-ch05-c-034',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Distance Between Points',
    prompt: `Define a struct \`Point\` with fields \`x\` and \`y\` (both \`f64\`). Add a method \`distance(&self, other: &Point) -> f64\` that returns the Euclidean distance using \`.sqrt()\` on the sum of the squared differences. In \`main\`, compute the distance between (0.0, 0.0) and (3.0, 4.0) and print it (should be 5).`,
    hints: [
      'Difference: \`self.x - other.x\`, and similarly for y.',
      'Compute \`(dx * dx + dy * dy).sqrt()\`.',
    ],
    solution: `struct Point {
    x: f64,
    y: f64,
}

impl Point {
    fn distance(&self, other: &Point) -> f64 {
        let dx = self.x - other.x;
        let dy = self.y - other.y;
        (dx * dx + dy * dy).sqrt()
    }
}

fn main() {
    let a = Point { x: 0.0, y: 0.0 };
    let b = Point { x: 3.0, y: 4.0 };
    println!("{}", a.distance(&b));
}`,
    starter: `struct Point {
    x: f64,
    y: f64,
}

impl Point {
    // TODO: add distance(&self, other: &Point) -> f64
}

fn main() {
    let a = Point { x: 0.0, y: 0.0 };
    let b = Point { x: 3.0, y: 4.0 };
    println!("{}", a.distance(&b));
}`,
    tags: ['methods', 'parameters', 'floats'],
  },
  {
    id: 'rs-ch05-c-035',
    chapter: 5,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Rectangle Toolkit',
    prompt: `Build a complete \`Rectangle\` type. Requirements:
- Fields \`width\` and \`height\` (both \`u32\`), with \`#[derive(Debug)]\`.
- An associated function \`new(width: u32, height: u32) -> Self\`.
- A method \`area(&self) -> u32\`.
- A method \`can_hold(&self, other: &Rectangle) -> bool\` (strictly larger in both dimensions).

In \`main\`: build \`r1 = Rectangle::new(30, 50)\` and \`r2 = Rectangle::new(10, 40)\`. Print \`r1\` with \`{:?}\`, print its area, and print whether \`r1\` can hold \`r2\`.`,
    hints: [
      'Combine the earlier pieces into one \`impl\` block.',
      'Call \`r1.can_hold(&r2)\` with a reference.',
    ],
    solution: `#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn new(width: u32, height: u32) -> Self {
        Self { width, height }
    }

    fn area(&self) -> u32 {
        self.width * self.height
    }

    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}

fn main() {
    let r1 = Rectangle::new(30, 50);
    let r2 = Rectangle::new(10, 40);
    println!("{:?}", r1);
    println!("{}", r1.area());
    println!("{}", r1.can_hold(&r2));
}`,
    starter: `#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // TODO: new, area, can_hold
}

fn main() {
    let r1 = Rectangle::new(30, 50);
    let r2 = Rectangle::new(10, 40);
    println!("{:?}", r1);
    println!("{}", r1.area());
    println!("{}", r1.can_hold(&r2));
}`,
    tags: ['structs', 'methods', 'associated-function', 'debug'],
  },
]

export default problems
