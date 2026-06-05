import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch05-c-036',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Define and Print a User Struct',
    prompt: `Define a struct named User with three fields: username (String), email (String), and active (bool). In main, create one User instance with any values you like, then print all three fields using println! so the output is three lines like:
username: alice
email: alice@example.com
active: true`,
    hints: [
      'Use struct User { ... } to declare the fields, each with a type.',
      'Access a field with instance.field_name.',
    ],
    solution: `struct User {
    username: String,
    email: String,
    active: bool,
}

fn main() {
    let u = User {
        username: String::from("alice"),
        email: String::from("alice@example.com"),
        active: true,
    };
    println!("username: {}", u.username);
    println!("email: {}", u.email);
    println!("active: {}", u.active);
}`,
    starter: `struct User {
    // TODO: add three fields
}

fn main() {
    // TODO: create a User and print its fields
}`,
    tags: ['structs', 'instances'],
  },
  {
    id: 'rs-ch05-c-037',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Mutate a Struct Field',
    prompt: `Define a struct Counter with a single field count (i32). In main, create a mutable Counter starting at 0, increase count by 10, then print the final value as:
count = 10
Remember: the whole instance must be mutable to change a field.`,
    hints: [
      'Mark the binding with mut so the instance can change.',
      'You can write instance.count += 10;',
    ],
    solution: `struct Counter {
    count: i32,
}

fn main() {
    let mut c = Counter { count: 0 };
    c.count += 10;
    println!("count = {}", c.count);
}`,
    starter: `struct Counter {
    count: i32,
}

fn main() {
    // TODO: create a mutable Counter, add 10, print it
}`,
    tags: ['structs', 'mutability'],
  },
  {
    id: 'rs-ch05-c-038',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Build User With Field Init Shorthand',
    prompt: `Write a function build_user(email: String, username: String) -> User that returns a User. The User struct has fields email (String), username (String), active (bool), and sign_in_count (u64). Use field init shorthand for email and username (do not write email: email). Set active to true and sign_in_count to 1. In main, call it and print the username.`,
    hints: [
      'When a parameter name matches a field name you can write just the name.',
      'active and sign_in_count still use field: value syntax.',
    ],
    solution: `struct User {
    email: String,
    username: String,
    active: bool,
    sign_in_count: u64,
}

fn build_user(email: String, username: String) -> User {
    User {
        email,
        username,
        active: true,
        sign_in_count: 1,
    }
}

fn main() {
    let u = build_user(String::from("a@b.com"), String::from("bob"));
    println!("{}", u.username);
}`,
    starter: `struct User {
    email: String,
    username: String,
    active: bool,
    sign_in_count: u64,
}

fn build_user(email: String, username: String) -> User {
    // TODO: use field init shorthand
    todo!()
}

fn main() {
    let u = build_user(String::from("a@b.com"), String::from("bob"));
    println!("{}", u.username);
}`,
    tags: ['structs', 'shorthand'],
  },
  {
    id: 'rs-ch05-c-039',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Struct Update Syntax',
    prompt: `Given a struct Config with fields width (u32), height (u32), title (String), and fullscreen (bool), create a base Config, then build a second Config that keeps width, height, and title from the first but sets fullscreen to true. Use struct update syntax (the ..base form) to copy the remaining fields. Print the second config's title and fullscreen value.
Note: title is a String, so the first config will be moved by the update.`,
    hints: [
      'Struct update syntax looks like Config { fullscreen: true, ..base }.',
      'The ..base part must come last.',
    ],
    solution: `struct Config {
    width: u32,
    height: u32,
    title: String,
    fullscreen: bool,
}

fn main() {
    let base = Config {
        width: 800,
        height: 600,
        title: String::from("Game"),
        fullscreen: false,
    };
    let full = Config {
        fullscreen: true,
        ..base
    };
    println!("{} {}", full.title, full.fullscreen);
}`,
    starter: `struct Config {
    width: u32,
    height: u32,
    title: String,
    fullscreen: bool,
}

fn main() {
    let base = Config {
        width: 800,
        height: 600,
        title: String::from("Game"),
        fullscreen: false,
    };
    // TODO: build full from base using struct update syntax
}`,
    tags: ['structs', 'update-syntax'],
  },
  {
    id: 'rs-ch05-c-040',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Color Tuple Struct',
    prompt: `Define a tuple struct Color(i32, i32, i32) representing RGB. In main, create a Color for black (0, 0, 0) and one for white (255, 255, 255). Print each as three space-separated numbers by indexing the tuple fields, for example:
0 0 0
255 255 255`,
    hints: [
      'A tuple struct: struct Color(i32, i32, i32);',
      'Access fields by position: c.0, c.1, c.2.',
    ],
    solution: `struct Color(i32, i32, i32);

fn main() {
    let black = Color(0, 0, 0);
    let white = Color(255, 255, 255);
    println!("{} {} {}", black.0, black.1, black.2);
    println!("{} {} {}", white.0, white.1, white.2);
}`,
    starter: `struct Color(i32, i32, i32);

fn main() {
    // TODO: create black and white, print their components
}`,
    tags: ['tuple-structs', 'structs'],
  },
  {
    id: 'rs-ch05-c-041',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Point Tuple Struct',
    prompt: `Define a tuple struct Point(f64, f64). Write a function origin() -> Point that returns Point(0.0, 0.0). In main, create a Point at (3.0, 4.0), call origin(), and print both points' coordinates in the form (x, y), one per line, like:
(3, 4)
(0, 0)`,
    hints: [
      'origin() is a free function returning a Point value.',
      'Index tuple-struct fields with .0 and .1.',
    ],
    solution: `struct Point(f64, f64);

fn origin() -> Point {
    Point(0.0, 0.0)
}

fn main() {
    let p = Point(3.0, 4.0);
    let o = origin();
    println!("({}, {})", p.0, p.1);
    println!("({}, {})", o.0, o.1);
}`,
    starter: `struct Point(f64, f64);

fn origin() -> Point {
    // TODO
    todo!()
}

fn main() {
    let p = Point(3.0, 4.0);
    let o = origin();
    // TODO: print both points
}`,
    tags: ['tuple-structs', 'functions'],
  },
  {
    id: 'rs-ch05-c-042',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Rectangle Area Method',
    prompt: `Define a struct Rectangle with fields width (u32) and height (u32). Add a method area(&self) -> u32 that returns width times height. In main, create a Rectangle that is 30 by 50 and print:
The area is 1500 square pixels.`,
    hints: [
      'Put the method inside impl Rectangle { ... }.',
      'A read-only method takes &self.',
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
    println!("The area is {} square pixels.", rect.area());
}`,
    starter: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // TODO: add area(&self) -> u32
}

fn main() {
    let rect = Rectangle { width: 30, height: 50 };
    println!("The area is {} square pixels.", rect.area());
}`,
    tags: ['methods', 'structs'],
  },
  {
    id: 'rs-ch05-c-043',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Derive Debug and Print a Rectangle',
    prompt: `Define a struct Rectangle with width (u32) and height (u32). Add #[derive(Debug)] so it can be printed with the debug formatter. In main, create a 30 by 50 rectangle and print it two ways:
- with {:?} on one line
- with {:#?} (pretty) on the following lines`,
    hints: [
      'Add #[derive(Debug)] directly above the struct.',
      'Use println!("{:?}", rect) and println!("{:#?}", rect).',
    ],
    solution: `#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect = Rectangle { width: 30, height: 50 };
    println!("{:?}", rect);
    println!("{:#?}", rect);
}`,
    starter: `// TODO: derive Debug
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect = Rectangle { width: 30, height: 50 };
    // TODO: print with {:?} and {:#?}
}`,
    tags: ['derive', 'debug'],
  },
  {
    id: 'rs-ch05-c-044',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Square Associated Function',
    prompt: `Define a struct Rectangle with width (u32) and height (u32). Add an associated function square(size: u32) -> Self that builds a Rectangle whose width and height are both size. Also add area(&self) -> u32. In main, create a square of size 12 using Rectangle::square(12) and print its area.`,
    hints: [
      'Associated functions do not take self; call them with Type::name(...).',
      'Self inside impl refers to Rectangle.',
    ],
    solution: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn square(size: u32) -> Self {
        Self { width: size, height: size }
    }
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let sq = Rectangle::square(12);
    println!("{}", sq.area());
}`,
    starter: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // TODO: square(size: u32) -> Self
    // TODO: area(&self) -> u32
}

fn main() {
    let sq = Rectangle::square(12);
    println!("{}", sq.area());
}`,
    tags: ['associated-functions', 'constructors'],
  },
  {
    id: 'rs-ch05-c-045',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Rectangle can_hold',
    prompt: `Define a struct Rectangle with width (u32) and height (u32). Add a method can_hold(&self, other: &Rectangle) -> bool that returns true when self is strictly larger than other in both width and height. In main, test that a 30 by 50 rectangle can hold a 10 by 40 one but cannot hold a 60 by 45 one, printing each result on its own line.`,
    hints: [
      'The method needs a second parameter that borrows another rectangle.',
      'Combine two comparisons with &&.',
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
    let r = Rectangle { width: 30, height: 50 };
    let small = Rectangle { width: 10, height: 40 };
    let big = Rectangle { width: 60, height: 45 };
    println!("{}", r.can_hold(&small));
    println!("{}", r.can_hold(&big));
}`,
    starter: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // TODO: can_hold(&self, other: &Rectangle) -> bool
}

fn main() {
    let r = Rectangle { width: 30, height: 50 };
    let small = Rectangle { width: 10, height: 40 };
    let big = Rectangle { width: 60, height: 45 };
    println!("{}", r.can_hold(&small));
    println!("{}", r.can_hold(&big));
}`,
    tags: ['methods', 'borrowing'],
  },
  {
    id: 'rs-ch05-c-046',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Method That Mutates Self',
    prompt: `Define a struct BankAccount with field balance (i64). Add two methods: deposit(&mut self, amount: i64) which adds to balance, and withdraw(&mut self, amount: i64) which subtracts from balance. In main, start with a balance of 100, deposit 50, withdraw 30, and print the final balance (should be 120).`,
    hints: [
      'A mutating method takes &mut self.',
      'The instance you call these on must be declared with mut.',
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
    // TODO: deposit(&mut self, amount: i64)
    // TODO: withdraw(&mut self, amount: i64)
}

fn main() {
    let mut acct = BankAccount { balance: 100 };
    acct.deposit(50);
    acct.withdraw(30);
    println!("{}", acct.balance);
}`,
    tags: ['methods', 'mutability'],
  },
  {
    id: 'rs-ch05-c-047',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Constructor Plus Method',
    prompt: `Define a struct Circle with field radius (f64). Add an associated function new(radius: f64) -> Self and a method area(&self) -> f64 that returns 3.14159 times radius squared. In main, build a Circle with Circle::new(2.0) and print its area.`,
    hints: [
      'new is a conventional name for a constructor associated function.',
      'radius * radius gives the square.',
    ],
    solution: `struct Circle {
    radius: f64,
}

impl Circle {
    fn new(radius: f64) -> Self {
        Self { radius }
    }
    fn area(&self) -> f64 {
        3.14159 * self.radius * self.radius
    }
}

fn main() {
    let c = Circle::new(2.0);
    println!("{}", c.area());
}`,
    starter: `struct Circle {
    radius: f64,
}

impl Circle {
    // TODO: new(radius: f64) -> Self
    // TODO: area(&self) -> f64
}

fn main() {
    let c = Circle::new(2.0);
    println!("{}", c.area());
}`,
    tags: ['constructors', 'methods'],
  },
  {
    id: 'rs-ch05-c-048',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Method With An Extra Parameter',
    prompt: `Define a struct Wallet with field cents (u64). Add a method add(&mut self, amount: u64) and a method can_afford(&self, price: u64) -> bool that returns true when cents is at least price. In main, start with 250 cents, add 100, then print whether the wallet can afford a 300-cent item (true) and a 400-cent item (false).`,
    hints: [
      'can_afford compares self.cents with the parameter using >=.',
      'add mutates so it needs &mut self.',
    ],
    solution: `struct Wallet {
    cents: u64,
}

impl Wallet {
    fn add(&mut self, amount: u64) {
        self.cents += amount;
    }
    fn can_afford(&self, price: u64) -> bool {
        self.cents >= price
    }
}

fn main() {
    let mut w = Wallet { cents: 250 };
    w.add(100);
    println!("{}", w.can_afford(300));
    println!("{}", w.can_afford(400));
}`,
    starter: `struct Wallet {
    cents: u64,
}

impl Wallet {
    // TODO: add(&mut self, amount: u64)
    // TODO: can_afford(&self, price: u64) -> bool
}

fn main() {
    let mut w = Wallet { cents: 250 };
    w.add(100);
    println!("{}", w.can_afford(300));
    println!("{}", w.can_afford(400));
}`,
    tags: ['methods', 'parameters'],
  },
  {
    id: 'rs-ch05-c-049',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Multiple Impl Blocks',
    prompt: `Define a struct Rectangle with width (u32) and height (u32). Split its behavior into two separate impl blocks: the first defines area(&self) -> u32, the second defines perimeter(&self) -> u32 (which is 2*(width+height)). In main, create a 4 by 6 rectangle and print its area and perimeter.`,
    hints: [
      'You may write impl Rectangle { ... } more than once.',
      'Both blocks operate on the same struct.',
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
    fn perimeter(&self) -> u32 {
        2 * (self.width + self.height)
    }
}

fn main() {
    let r = Rectangle { width: 4, height: 6 };
    println!("{}", r.area());
    println!("{}", r.perimeter());
}`,
    starter: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // TODO: area(&self) -> u32
}

// TODO: a second impl block with perimeter

fn main() {
    let r = Rectangle { width: 4, height: 6 };
    println!("{}", r.area());
    println!("{}", r.perimeter());
}`,
    tags: ['methods', 'impl-blocks'],
  },
  {
    id: 'rs-ch05-c-050',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Unit-Like Struct Marker',
    prompt: `Define a unit-like struct named AlwaysEqual (no fields). Add a method announce(&self) that prints exactly:
I am always equal.
In main, create an AlwaysEqual value and call announce on it.`,
    hints: [
      'A unit-like struct is declared with struct AlwaysEqual;',
      'Create an instance with let x = AlwaysEqual;',
    ],
    solution: `struct AlwaysEqual;

impl AlwaysEqual {
    fn announce(&self) {
        println!("I am always equal.");
    }
}

fn main() {
    let a = AlwaysEqual;
    a.announce();
}`,
    starter: `// TODO: declare a unit-like struct
struct AlwaysEqual;

impl AlwaysEqual {
    // TODO: announce(&self)
}

fn main() {
    let a = AlwaysEqual;
    a.announce();
}`,
    tags: ['unit-struct', 'methods'],
  },
  {
    id: 'rs-ch05-c-051',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Newtype Meters Wrapper',
    prompt: `Define a tuple struct Meters(f64) that wraps a distance in meters. Add a method to_centimeters(&self) -> f64 that returns the inner value times 100.0. In main, build Meters(2.5) and print its value in centimeters (should be 250).`,
    hints: [
      'Access the wrapped value with self.0.',
      'The method borrows self and returns an f64.',
    ],
    solution: `struct Meters(f64);

impl Meters {
    fn to_centimeters(&self) -> f64 {
        self.0 * 100.0
    }
}

fn main() {
    let d = Meters(2.5);
    println!("{}", d.to_centimeters());
}`,
    starter: `struct Meters(f64);

impl Meters {
    // TODO: to_centimeters(&self) -> f64
}

fn main() {
    let d = Meters(2.5);
    println!("{}", d.to_centimeters());
}`,
    tags: ['tuple-structs', 'methods'],
  },
  {
    id: 'rs-ch05-c-052',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Scale a Rectangle In Place',
    prompt: `Define a struct Rectangle with width (u32) and height (u32) and derive Debug. Add a method scale(&mut self, factor: u32) that multiplies both width and height by factor. In main, create a 3 by 5 rectangle, scale it by 2, then print it with {:?} (should show width 6 and height 10).`,
    hints: [
      'scale mutates the instance, so it takes &mut self.',
      'Multiply each field by factor.',
    ],
    solution: `#[derive(Debug)]
struct Rectangle {
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
    let mut r = Rectangle { width: 3, height: 5 };
    r.scale(2);
    println!("{:?}", r);
}`,
    starter: `#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // TODO: scale(&mut self, factor: u32)
}

fn main() {
    let mut r = Rectangle { width: 3, height: 5 };
    r.scale(2);
    println!("{:?}", r);
}`,
    tags: ['methods', 'mutability', 'debug'],
  },
  {
    id: 'rs-ch05-c-053',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Method Returning A New Struct',
    prompt: `Define a struct Point with fields x (i32) and y (i32), and derive Debug. Add a method translated(&self, dx: i32, dy: i32) -> Point that returns a new Point shifted by dx and dy without modifying self. In main, create a Point at (1, 2), call translated(3, 4), and print the returned point with {:?} (should be x 4, y 6).`,
    hints: [
      'translated borrows self read-only and returns a fresh Point.',
      'Build the new Point inside the method using self.x + dx and self.y + dy.',
    ],
    solution: `#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

impl Point {
    fn translated(&self, dx: i32, dy: i32) -> Point {
        Point {
            x: self.x + dx,
            y: self.y + dy,
        }
    }
}

fn main() {
    let p = Point { x: 1, y: 2 };
    let q = p.translated(3, 4);
    println!("{:?}", q);
}`,
    starter: `#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

impl Point {
    // TODO: translated(&self, dx: i32, dy: i32) -> Point
}

fn main() {
    let p = Point { x: 1, y: 2 };
    let q = p.translated(3, 4);
    println!("{:?}", q);
}`,
    tags: ['methods', 'structs', 'debug'],
  },
  {
    id: 'rs-ch05-c-054',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Debug Print With dbg!',
    prompt: `Define a struct Rectangle with width (u32) and height (u32) and derive Debug. In main, build a rectangle whose width is the result of dbg!(20 * 2) and whose height is 50. Then call dbg!(&rect); to inspect the whole rectangle. The dbg! macro prints to standard error and returns its argument, so the width should end up being 40.`,
    hints: [
      'dbg!(expr) returns expr, so you can wrap the width expression directly.',
      'Pass a reference with dbg!(&rect) to avoid moving it.',
    ],
    solution: `#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect = Rectangle {
        width: dbg!(20 * 2),
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
        width: dbg!(20 * 2),
        height: 50,
    };
    // TODO: inspect rect with dbg!
}`,
    tags: ['dbg', 'debug'],
  },
  {
    id: 'rs-ch05-c-055',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Temperature Conversions',
    prompt: `Define a struct Temperature with field celsius (f64). Add an associated function from_fahrenheit(f: f64) -> Self (celsius is (f - 32.0) * 5.0 / 9.0) and a method to_fahrenheit(&self) -> f64 (fahrenheit is celsius * 9.0 / 5.0 + 32.0). In main, build a Temperature from 212.0 Fahrenheit and print its celsius (100) and its to_fahrenheit (212).`,
    hints: [
      'from_fahrenheit is an associated function returning Self.',
      'to_fahrenheit borrows self and returns an f64.',
    ],
    solution: `struct Temperature {
    celsius: f64,
}

impl Temperature {
    fn from_fahrenheit(f: f64) -> Self {
        Self {
            celsius: (f - 32.0) * 5.0 / 9.0,
        }
    }
    fn to_fahrenheit(&self) -> f64 {
        self.celsius * 9.0 / 5.0 + 32.0
    }
}

fn main() {
    let t = Temperature::from_fahrenheit(212.0);
    println!("{}", t.celsius);
    println!("{}", t.to_fahrenheit());
}`,
    starter: `struct Temperature {
    celsius: f64,
}

impl Temperature {
    // TODO: from_fahrenheit(f: f64) -> Self
    // TODO: to_fahrenheit(&self) -> f64
}

fn main() {
    let t = Temperature::from_fahrenheit(212.0);
    println!("{}", t.celsius);
    println!("{}", t.to_fahrenheit());
}`,
    tags: ['constructors', 'methods'],
  },
  {
    id: 'rs-ch05-c-056',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Struct Holding A Tuple',
    prompt: `Define a struct Segment with one field endpoints of type (f64, f64) (a tuple holding x for the start and x for the end on a number line). Add a method length(&self) -> f64 that returns the absolute difference between the two values. In main, build a Segment with endpoints (2.0, 9.0) and print its length (should be 7).
You may compute the absolute value with an if/else; do not use any library helpers beyond comparisons.`,
    hints: [
      'Access the tuple field, then its parts: self.endpoints.0 and self.endpoints.1.',
      'If start > end, return start - end, otherwise end - start.',
    ],
    solution: `struct Segment {
    endpoints: (f64, f64),
}

impl Segment {
    fn length(&self) -> f64 {
        let a = self.endpoints.0;
        let b = self.endpoints.1;
        if a > b {
            a - b
        } else {
            b - a
        }
    }
}

fn main() {
    let s = Segment { endpoints: (2.0, 9.0) };
    println!("{}", s.length());
}`,
    starter: `struct Segment {
    endpoints: (f64, f64),
}

impl Segment {
    // TODO: length(&self) -> f64
}

fn main() {
    let s = Segment { endpoints: (2.0, 9.0) };
    println!("{}", s.length());
}`,
    tags: ['structs', 'methods'],
  },
  {
    id: 'rs-ch05-c-057',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Toggle A Boolean Field',
    prompt: `Define a struct LightSwitch with field on (bool). Add a method toggle(&mut self) that flips on to its opposite, and a method is_on(&self) -> bool that returns the current state. In main, start with on = false, toggle twice, and after each toggle print is_on (false then true... wait, carefully: starting false, after first toggle print, after second toggle print). The two printed lines should be true then false.`,
    hints: [
      'Flip a bool with self.on = !self.on;',
      'is_on just returns self.on.',
    ],
    solution: `struct LightSwitch {
    on: bool,
}

impl LightSwitch {
    fn toggle(&mut self) {
        self.on = !self.on;
    }
    fn is_on(&self) -> bool {
        self.on
    }
}

fn main() {
    let mut s = LightSwitch { on: false };
    s.toggle();
    println!("{}", s.is_on());
    s.toggle();
    println!("{}", s.is_on());
}`,
    starter: `struct LightSwitch {
    on: bool,
}

impl LightSwitch {
    // TODO: toggle(&mut self)
    // TODO: is_on(&self) -> bool
}

fn main() {
    let mut s = LightSwitch { on: false };
    s.toggle();
    println!("{}", s.is_on());
    s.toggle();
    println!("{}", s.is_on());
}`,
    tags: ['methods', 'mutability'],
  },
  {
    id: 'rs-ch05-c-058',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Compare Two Rectangles By Area',
    prompt: `Define a struct Rectangle with width (u32) and height (u32). Add area(&self) -> u32 and a method larger_area_than(&self, other: &Rectangle) -> bool that returns true when self has a strictly greater area than other. In main, make a 5 by 5 and a 4 by 7 rectangle and print whether the first has a larger area than the second (5*5=25 vs 4*7=28, so false).`,
    hints: [
      'larger_area_than can call self.area() and other.area().',
      'A method may call other methods through self.',
    ],
    solution: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
    fn larger_area_than(&self, other: &Rectangle) -> bool {
        self.area() > other.area()
    }
}

fn main() {
    let a = Rectangle { width: 5, height: 5 };
    let b = Rectangle { width: 4, height: 7 };
    println!("{}", a.larger_area_than(&b));
}`,
    starter: `struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // TODO: area(&self) -> u32
    // TODO: larger_area_than(&self, other: &Rectangle) -> bool
}

fn main() {
    let a = Rectangle { width: 5, height: 5 };
    let b = Rectangle { width: 4, height: 7 };
    println!("{}", a.larger_area_than(&b));
}`,
    tags: ['methods', 'borrowing'],
  },
  {
    id: 'rs-ch05-c-059',
    chapter: 5,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Default-Style Constructor',
    prompt: `Define a struct Player with fields name (String), level (u32), and health (u32). Add an associated function new(name: String) -> Self that sets level to 1 and health to 100 using the given name. In main, create a Player named "Hero" and print name, level, and health each on its own line.`,
    hints: [
      'new takes only the name and fills in sensible starting values.',
      'Use field init shorthand for name inside new.',
    ],
    solution: `struct Player {
    name: String,
    level: u32,
    health: u32,
}

impl Player {
    fn new(name: String) -> Self {
        Self {
            name,
            level: 1,
            health: 100,
        }
    }
}

fn main() {
    let p = Player::new(String::from("Hero"));
    println!("{}", p.name);
    println!("{}", p.level);
    println!("{}", p.health);
}`,
    starter: `struct Player {
    name: String,
    level: u32,
    health: u32,
}

impl Player {
    // TODO: new(name: String) -> Self
}

fn main() {
    let p = Player::new(String::from("Hero"));
    println!("{}", p.name);
    println!("{}", p.level);
    println!("{}", p.health);
}`,
    tags: ['constructors', 'shorthand'],
  },
  {
    id: 'rs-ch05-c-060',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Manhattan Distance Between Points',
    prompt: `Define a struct Point with fields x (i32) and y (i32). Add a method manhattan_distance(&self, other: &Point) -> i32 that returns the sum of the absolute differences of the x and y coordinates. Compute absolute values without library helpers (use if/else). In main, create points (1, 2) and (4, 6) and print the distance (|1-4| + |2-6| = 3 + 4 = 7).`,
    hints: [
      'Write a small helper using if/else, or inline two if expressions.',
      'abs of n is n when n >= 0 else -n.',
    ],
    solution: `struct Point {
    x: i32,
    y: i32,
}

impl Point {
    fn manhattan_distance(&self, other: &Point) -> i32 {
        let dx = self.x - other.x;
        let dy = self.y - other.y;
        let adx = if dx < 0 { -dx } else { dx };
        let ady = if dy < 0 { -dy } else { dy };
        adx + ady
    }
}

fn main() {
    let a = Point { x: 1, y: 2 };
    let b = Point { x: 4, y: 6 };
    println!("{}", a.manhattan_distance(&b));
}`,
    starter: `struct Point {
    x: i32,
    y: i32,
}

impl Point {
    // TODO: manhattan_distance(&self, other: &Point) -> i32
}

fn main() {
    let a = Point { x: 1, y: 2 };
    let b = Point { x: 4, y: 6 };
    println!("{}", a.manhattan_distance(&b));
}`,
    tags: ['methods', 'borrowing'],
  },
  {
    id: 'rs-ch05-c-061',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Rectangle From Two Corners',
    prompt: `Define a tuple struct Point(i32, i32) and a struct Rectangle with width (u32) and height (u32). Add an associated function Rectangle::from_corners(a: Point, b: Point) -> Rectangle that computes the width and height as the absolute differences of the x and y coordinates (as u32). Compute absolute differences with if/else. In main, build a rectangle from Point(2, 3) and Point(7, 1) and print its width (5) and height (2).`,
    hints: [
      'Width comes from the x coordinates (.0), height from the y coordinates (.1).',
      'Compute the larger minus the smaller to keep it non-negative, then cast with as u32.',
    ],
    solution: `struct Point(i32, i32);

struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn from_corners(a: Point, b: Point) -> Rectangle {
        let w = if a.0 > b.0 { a.0 - b.0 } else { b.0 - a.0 };
        let h = if a.1 > b.1 { a.1 - b.1 } else { b.1 - a.1 };
        Rectangle {
            width: w as u32,
            height: h as u32,
        }
    }
}

fn main() {
    let r = Rectangle::from_corners(Point(2, 3), Point(7, 1));
    println!("{}", r.width);
    println!("{}", r.height);
}`,
    starter: `struct Point(i32, i32);

struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // TODO: from_corners(a: Point, b: Point) -> Rectangle
}

fn main() {
    let r = Rectangle::from_corners(Point(2, 3), Point(7, 1));
    println!("{}", r.width);
    println!("{}", r.height);
}`,
    tags: ['associated-functions', 'tuple-structs'],
  },
  {
    id: 'rs-ch05-c-062',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Stack With Fixed Array',
    prompt: `Define a struct Stack with two fields: data of type [i32; 4] and len of type usize. Add an associated function new() -> Self that starts with data all zeros and len 0. Add push(&mut self, value: i32) that stores value at index len and increases len (assume it never overflows 4 items). Add a method top(&self) -> i32 that returns the most recently pushed value (data at len-1). In main, push 10 then 20, and print top (should be 20) and len (should be 2).`,
    hints: [
      'Initialize the array with [0; 4].',
      'push writes self.data[self.len] = value; then self.len += 1;',
      'top reads self.data[self.len - 1].',
    ],
    solution: `struct Stack {
    data: [i32; 4],
    len: usize,
}

impl Stack {
    fn new() -> Self {
        Self { data: [0; 4], len: 0 }
    }
    fn push(&mut self, value: i32) {
        self.data[self.len] = value;
        self.len += 1;
    }
    fn top(&self) -> i32 {
        self.data[self.len - 1]
    }
}

fn main() {
    let mut s = Stack::new();
    s.push(10);
    s.push(20);
    println!("{}", s.top());
    println!("{}", s.len);
}`,
    starter: `struct Stack {
    data: [i32; 4],
    len: usize,
}

impl Stack {
    // TODO: new() -> Self
    // TODO: push(&mut self, value: i32)
    // TODO: top(&self) -> i32
}

fn main() {
    let mut s = Stack::new();
    s.push(10);
    s.push(20);
    println!("{}", s.top());
    println!("{}", s.len);
}`,
    tags: ['methods', 'arrays', 'mutability'],
  },
  {
    id: 'rs-ch05-c-063',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Counter Sum Over A Range',
    prompt: `Define a struct Accumulator with field total (i64). Add new() -> Self starting at 0, add(&mut self, n: i64) that adds n to total, and result(&self) -> i64 that returns total. In main, create an Accumulator and use a loop (for n in 1..=5) to add each number, then print the total (should be 15).`,
    hints: [
      'Use a for loop over the inclusive range 1..=5.',
      'Call acc.add(n) inside the loop, then acc.result().',
    ],
    solution: `struct Accumulator {
    total: i64,
}

impl Accumulator {
    fn new() -> Self {
        Self { total: 0 }
    }
    fn add(&mut self, n: i64) {
        self.total += n;
    }
    fn result(&self) -> i64 {
        self.total
    }
}

fn main() {
    let mut acc = Accumulator::new();
    for n in 1..=5 {
        acc.add(n);
    }
    println!("{}", acc.result());
}`,
    starter: `struct Accumulator {
    total: i64,
}

impl Accumulator {
    // TODO: new() -> Self
    // TODO: add(&mut self, n: i64)
    // TODO: result(&self) -> i64
}

fn main() {
    let mut acc = Accumulator::new();
    for n in 1..=5 {
        acc.add(n);
    }
    println!("{}", acc.result());
}`,
    tags: ['methods', 'mutability', 'loops'],
  },
  {
    id: 'rs-ch05-c-064',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Color Brightness Classifier',
    prompt: `Define a tuple struct Color(u32, u32, u32) for RGB and derive Debug. Add a method brightness(&self) -> u32 that returns the average of the three components (integer division by 3). Add a method is_bright(&self) -> bool that returns true when brightness is greater than 127. In main, create Color(200, 200, 200) and Color(10, 20, 30); print each color with {:?} followed by its is_bright result on the same line, separated by a space.`,
    hints: [
      'brightness is (self.0 + self.1 + self.2) / 3.',
      'is_bright can call self.brightness().',
      'Print the struct and the bool: println!("{:?} {}", c, c.is_bright());',
    ],
    solution: `#[derive(Debug)]
struct Color(u32, u32, u32);

impl Color {
    fn brightness(&self) -> u32 {
        (self.0 + self.1 + self.2) / 3
    }
    fn is_bright(&self) -> bool {
        self.brightness() > 127
    }
}

fn main() {
    let a = Color(200, 200, 200);
    let b = Color(10, 20, 30);
    println!("{:?} {}", a, a.is_bright());
    println!("{:?} {}", b, b.is_bright());
}`,
    starter: `#[derive(Debug)]
struct Color(u32, u32, u32);

impl Color {
    // TODO: brightness(&self) -> u32
    // TODO: is_bright(&self) -> bool
}

fn main() {
    let a = Color(200, 200, 200);
    let b = Color(10, 20, 30);
    println!("{:?} {}", a, a.is_bright());
    println!("{:?} {}", b, b.is_bright());
}`,
    tags: ['tuple-structs', 'methods', 'debug'],
  },
  {
    id: 'rs-ch05-c-065',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Time Struct Normalizing Seconds',
    prompt: `Define a struct Time with fields hours (u32), minutes (u32), and seconds (u32) and derive Debug. Add an associated function from_seconds(total: u32) -> Self that converts a total number of seconds into hours, minutes, and seconds (hours = total / 3600, minutes = remaining / 60, seconds = remainder). In main, build a Time from 3661 seconds and print it with {:?} (should be hours 1, minutes 1, seconds 1).`,
    hints: [
      'Integer division and remainder (% operator) do the work.',
      'After taking hours, work with total % 3600 for the rest.',
    ],
    solution: `#[derive(Debug)]
struct Time {
    hours: u32,
    minutes: u32,
    seconds: u32,
}

impl Time {
    fn from_seconds(total: u32) -> Self {
        let hours = total / 3600;
        let rem = total % 3600;
        let minutes = rem / 60;
        let seconds = rem % 60;
        Self { hours, minutes, seconds }
    }
}

fn main() {
    let t = Time::from_seconds(3661);
    println!("{:?}", t);
}`,
    starter: `#[derive(Debug)]
struct Time {
    hours: u32,
    minutes: u32,
    seconds: u32,
}

impl Time {
    // TODO: from_seconds(total: u32) -> Self
}

fn main() {
    let t = Time::from_seconds(3661);
    println!("{:?}", t);
}`,
    tags: ['associated-functions', 'debug'],
  },
  {
    id: 'rs-ch05-c-066',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Fraction Reduction',
    prompt: `Define a struct Fraction with fields numerator (u32) and denominator (u32) and derive Debug. Add a method reduce(&mut self) that divides both fields by their greatest common divisor. Compute the gcd inside reduce using a loop (the Euclidean algorithm) without any library helpers. In main, create the fraction 6/8, reduce it, and print it with {:?} (should be numerator 3, denominator 4).`,
    hints: [
      'Euclid: while b != 0 { let t = b; b = a % b; a = t; } then a is the gcd.',
      'Copy the field values into local mutable variables to compute the gcd, then divide both fields by it.',
    ],
    solution: `#[derive(Debug)]
struct Fraction {
    numerator: u32,
    denominator: u32,
}

impl Fraction {
    fn reduce(&mut self) {
        let mut a = self.numerator;
        let mut b = self.denominator;
        while b != 0 {
            let t = b;
            b = a % b;
            a = t;
        }
        if a != 0 {
            self.numerator /= a;
            self.denominator /= a;
        }
    }
}

fn main() {
    let mut f = Fraction { numerator: 6, denominator: 8 };
    f.reduce();
    println!("{:?}", f);
}`,
    starter: `#[derive(Debug)]
struct Fraction {
    numerator: u32,
    denominator: u32,
}

impl Fraction {
    // TODO: reduce(&mut self) using the Euclidean algorithm
}

fn main() {
    let mut f = Fraction { numerator: 6, denominator: 8 };
    f.reduce();
    println!("{:?}", f);
}`,
    tags: ['methods', 'mutability', 'loops'],
  },
  {
    id: 'rs-ch05-c-067',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Grid Index Calculator',
    prompt: `Define a struct Grid with fields width (usize) and height (usize). Add a method index_of(&self, row: usize, col: usize) -> usize that returns the flat array index for a cell using row * width + col. Add a method in_bounds(&self, row: usize, col: usize) -> bool that returns true when row is less than height and col is less than width. In main, make a Grid that is 4 wide and 3 tall; print index_of(2, 1) (should be 9) and in_bounds(3, 0) (should be false because row 3 is out of a height-3 grid).`,
    hints: [
      'index_of multiplies row by the width then adds col.',
      'in_bounds combines two comparisons with &&.',
    ],
    solution: `struct Grid {
    width: usize,
    height: usize,
}

impl Grid {
    fn index_of(&self, row: usize, col: usize) -> usize {
        row * self.width + col
    }
    fn in_bounds(&self, row: usize, col: usize) -> bool {
        row < self.height && col < self.width
    }
}

fn main() {
    let g = Grid { width: 4, height: 3 };
    println!("{}", g.index_of(2, 1));
    println!("{}", g.in_bounds(3, 0));
}`,
    starter: `struct Grid {
    width: usize,
    height: usize,
}

impl Grid {
    // TODO: index_of(&self, row: usize, col: usize) -> usize
    // TODO: in_bounds(&self, row: usize, col: usize) -> bool
}

fn main() {
    let g = Grid { width: 4, height: 3 };
    println!("{}", g.index_of(2, 1));
    println!("{}", g.in_bounds(3, 0));
}`,
    tags: ['methods', 'parameters'],
  },
  {
    id: 'rs-ch05-c-068',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Builder Style With Struct Update',
    prompt: `Define a struct ServerConfig with fields host (String), port (u16), max_connections (u32), and tls (bool), and derive Debug. Add an associated function default_config() -> Self returning host "localhost", port 8080, max_connections 100, tls false. In main, call default_config() and then, using struct update syntax, build a customized config that keeps everything from a fresh default_config() but sets port to 443 and tls to true. Print the customized config with {:#?}.`,
    hints: [
      'Call default_config() to get a base value to spread with ..',
      'Override only port and tls before the ..base part.',
    ],
    solution: `#[derive(Debug)]
struct ServerConfig {
    host: String,
    port: u16,
    max_connections: u32,
    tls: bool,
}

impl ServerConfig {
    fn default_config() -> Self {
        Self {
            host: String::from("localhost"),
            port: 8080,
            max_connections: 100,
            tls: false,
        }
    }
}

fn main() {
    let custom = ServerConfig {
        port: 443,
        tls: true,
        ..ServerConfig::default_config()
    };
    println!("{:#?}", custom);
}`,
    starter: `#[derive(Debug)]
struct ServerConfig {
    host: String,
    port: u16,
    max_connections: u32,
    tls: bool,
}

impl ServerConfig {
    // TODO: default_config() -> Self
}

fn main() {
    // TODO: build a custom config from default_config() using ..
    // override port to 443 and tls to true, then print with {:#?}
}`,
    tags: ['update-syntax', 'associated-functions', 'debug'],
  },
  {
    id: 'rs-ch05-c-069',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Two-Dimensional Vector Operations',
    prompt: `Define a tuple struct Vec2(f64, f64) and derive Debug. Add: an associated function new(x: f64, y: f64) -> Self; a method add(&self, other: &Vec2) -> Vec2 returning the component-wise sum; and a method dot(&self, other: &Vec2) -> f64 returning x1*x2 + y1*y2. In main, create v = Vec2::new(1.0, 2.0) and w = Vec2::new(3.0, 4.0); print v.add(&w) with {:?} (should be 4.0, 6.0) and print v.dot(&w) (should be 11).`,
    hints: [
      'add builds a new Vec2 from the summed components.',
      'Both methods borrow self and other read-only.',
    ],
    solution: `#[derive(Debug)]
struct Vec2(f64, f64);

impl Vec2 {
    fn new(x: f64, y: f64) -> Self {
        Self(x, y)
    }
    fn add(&self, other: &Vec2) -> Vec2 {
        Vec2(self.0 + other.0, self.1 + other.1)
    }
    fn dot(&self, other: &Vec2) -> f64 {
        self.0 * other.0 + self.1 * other.1
    }
}

fn main() {
    let v = Vec2::new(1.0, 2.0);
    let w = Vec2::new(3.0, 4.0);
    println!("{:?}", v.add(&w));
    println!("{}", v.dot(&w));
}`,
    starter: `#[derive(Debug)]
struct Vec2(f64, f64);

impl Vec2 {
    // TODO: new(x: f64, y: f64) -> Self
    // TODO: add(&self, other: &Vec2) -> Vec2
    // TODO: dot(&self, other: &Vec2) -> f64
}

fn main() {
    let v = Vec2::new(1.0, 2.0);
    let w = Vec2::new(3.0, 4.0);
    println!("{:?}", v.add(&w));
    println!("{}", v.dot(&w));
}`,
    tags: ['tuple-structs', 'methods', 'debug'],
  },
  {
    id: 'rs-ch05-c-070',
    chapter: 5,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Inventory Item With Discount',
    prompt: `Define a struct Item with fields name (String), price_cents (u32), and quantity (u32), and derive Debug. Add new(name: String, price_cents: u32, quantity: u32) -> Self. Add a method subtotal(&self) -> u32 returning price_cents * quantity. Add a method apply_discount(&mut self, percent: u32) that reduces price_cents by the given whole percentage using integer math (new price is price_cents * (100 - percent) / 100). In main, create an item "Widget" priced at 500 with quantity 3, print subtotal (1500), then apply a 10 percent discount and print the new subtotal (450 * 3 = 1350).`,
    hints: [
      'Compute the discount as self.price_cents * (100 - percent) / 100.',
      'Multiply before dividing to avoid losing precision in integer math.',
      'subtotal reads the current price and quantity.',
    ],
    solution: `#[derive(Debug)]
struct Item {
    name: String,
    price_cents: u32,
    quantity: u32,
}

impl Item {
    fn new(name: String, price_cents: u32, quantity: u32) -> Self {
        Self { name, price_cents, quantity }
    }
    fn subtotal(&self) -> u32 {
        self.price_cents * self.quantity
    }
    fn apply_discount(&mut self, percent: u32) {
        self.price_cents = self.price_cents * (100 - percent) / 100;
    }
}

fn main() {
    let mut item = Item::new(String::from("Widget"), 500, 3);
    println!("{}", item.subtotal());
    item.apply_discount(10);
    println!("{}", item.subtotal());
}`,
    starter: `#[derive(Debug)]
struct Item {
    name: String,
    price_cents: u32,
    quantity: u32,
}

impl Item {
    // TODO: new(name: String, price_cents: u32, quantity: u32) -> Self
    // TODO: subtotal(&self) -> u32
    // TODO: apply_discount(&mut self, percent: u32)
}

fn main() {
    let mut item = Item::new(String::from("Widget"), 500, 3);
    println!("{}", item.subtotal());
    item.apply_discount(10);
    println!("{}", item.subtotal());
}`,
    tags: ['methods', 'mutability', 'constructors'],
  },
]

export default problems
