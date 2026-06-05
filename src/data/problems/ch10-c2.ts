import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch10-c-036',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Generic Largest Function',
    prompt: `Write a generic function with the signature
fn largest<T: PartialOrd>(list: &[T]) -> &T
that returns a reference to the largest element of a slice. In main, call it on a slice of i32 and a slice of char, printing each result. Expected output:
largest number: 100
largest char: y`,
    hints: [
      'You compare elements with >, so T needs the PartialOrd bound.',
      'Start by assuming the first element is largest, then loop over &list[1..].',
    ],
    solution: `fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}

fn main() {
    let numbers = vec![34, 50, 25, 100, 65];
    println!("largest number: {}", largest(&numbers));
    let chars = vec!['y', 'm', 'a', 'q'];
    println!("largest char: {}", largest(&chars));
}`,
    starter: `fn largest<T: PartialOrd>(list: &[T]) -> &T {
    // TODO: return a reference to the largest element
    todo!()
}

fn main() {
    let numbers = vec![34, 50, 25, 100, 65];
    let chars = vec!['y', 'm', 'a', 'q'];
    // TODO: print the largest of each
}`,
    tags: ['generics', 'trait-bounds'],
  },
  {
    id: 'rs-ch10-c-037',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Generic Smallest Function',
    prompt: `Write fn smallest<T: PartialOrd + Copy>(list: &[T]) -> T that returns (by value) the smallest element of a slice. Use the Copy bound so you can return the value directly. In main, print the smallest of vec![5, 2, 9, 1, 7] and of vec![3.5, 0.5, 2.5]. Expected output:
smallest int: 1
smallest float: 0.5`,
    hints: [
      'With T: Copy you can store the smallest as an owned value, not a reference.',
      'Dereference items when comparing, or iterate over copied values.',
    ],
    solution: `fn smallest<T: PartialOrd + Copy>(list: &[T]) -> T {
    let mut smallest = list[0];
    for &item in list {
        if item < smallest {
            smallest = item;
        }
    }
    smallest
}

fn main() {
    let ints = vec![5, 2, 9, 1, 7];
    let floats = vec![3.5, 0.5, 2.5];
    println!("smallest int: {}", smallest(&ints));
    println!("smallest float: {}", smallest(&floats));
}`,
    starter: `fn smallest<T: PartialOrd + Copy>(list: &[T]) -> T {
    // TODO
    todo!()
}

fn main() {
    let ints = vec![5, 2, 9, 1, 7];
    let floats = vec![3.5, 0.5, 2.5];
    // TODO: print both
}`,
    tags: ['generics', 'trait-bounds', 'copy'],
  },
  {
    id: 'rs-ch10-c-038',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Generic Point Struct',
    prompt: `Define a struct Point<T> with fields x and y of the same type T. Add a method x(&self) -> &T that returns a reference to the x field. In main, create a Point<i32> and a Point<f64>, then print each x value. Expected output:
int x: 5
float x: 1.5`,
    hints: [
      'Declare the generic on both the struct and the impl block: impl<T> Point<T>.',
      'The method returns &self.x.',
    ],
    solution: `struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
}

fn main() {
    let p1 = Point { x: 5, y: 10 };
    let p2 = Point { x: 1.5, y: 2.5 };
    println!("int x: {}", p1.x());
    println!("float x: {}", p2.x());
}`,
    starter: `struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    // TODO: method x(&self) -> &T
}

fn main() {
    let p1 = Point { x: 5, y: 10 };
    let p2 = Point { x: 1.5, y: 2.5 };
    // TODO: print both x values
}`,
    tags: ['generics', 'structs', 'methods'],
  },
  {
    id: 'rs-ch10-c-039',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Two-Type Generic Point',
    prompt: `Define a struct Point<T, U> whose field x has type T and field y has type U (they may differ). In main, build a Point { x: 5, y: 4.5 } and print both fields. Expected output:
x = 5, y = 4.5`,
    hints: [
      'List both type parameters in the struct: Point<T, U>.',
      'No bounds are needed just to store and print the values.',
    ],
    solution: `struct Point<T, U> {
    x: T,
    y: U,
}

fn main() {
    let p = Point { x: 5, y: 4.5 };
    println!("x = {}, y = {}", p.x, p.y);
}`,
    starter: `struct Point<T, U> {
    // TODO: x of type T, y of type U
}

fn main() {
    let p = Point { x: 5, y: 4.5 };
    // TODO: print x and y
}`,
    tags: ['generics', 'structs'],
  },
  {
    id: 'rs-ch10-c-040',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Generic Enum: MyOption',
    prompt: `Define your own generic enum MyOption<T> with two variants: Some(T) and None. Write a function unwrap_or<T>(opt: MyOption<T>, default: T) -> T that returns the inner value for Some, or default for None. In main, print unwrap_or on MyOption::Some(7) with default 0, and on MyOption::None with default 0. Expected output:
7
0`,
    hints: [
      'Match on the MyOption value inside unwrap_or.',
      'The enum and the function both carry the type parameter T.',
    ],
    solution: `enum MyOption<T> {
    Some(T),
    None,
}

fn unwrap_or<T>(opt: MyOption<T>, default: T) -> T {
    match opt {
        MyOption::Some(value) => value,
        MyOption::None => default,
    }
}

fn main() {
    println!("{}", unwrap_or(MyOption::Some(7), 0));
    println!("{}", unwrap_or(MyOption::None, 0));
}`,
    starter: `enum MyOption<T> {
    // TODO: Some(T) and None
}

fn unwrap_or<T>(opt: MyOption<T>, default: T) -> T {
    // TODO
    todo!()
}

fn main() {
    // TODO: print both cases
}`,
    tags: ['generics', 'enums', 'match'],
  },
  {
    id: 'rs-ch10-c-041',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Generic Pair Holder',
    prompt: `Define a struct Pair<T> holding two values first and second, both of type T. Add an associated function new(first: T, second: T) -> Self and a method swap(self) -> Pair<T> that returns a new Pair with the fields swapped. Require T: Clone is NOT needed here. In main, create Pair::new(1, 2), swap it, and print first and second of the result. Expected output:
2 1`,
    hints: [
      'Self refers to Pair<T> inside the impl.',
      'swap takes self by value and constructs a new Pair with the fields reversed.',
    ],
    solution: `struct Pair<T> {
    first: T,
    second: T,
}

impl<T> Pair<T> {
    fn new(first: T, second: T) -> Self {
        Pair { first, second }
    }

    fn swap(self) -> Pair<T> {
        Pair {
            first: self.second,
            second: self.first,
        }
    }
}

fn main() {
    let p = Pair::new(1, 2).swap();
    println!("{} {}", p.first, p.second);
}`,
    starter: `struct Pair<T> {
    first: T,
    second: T,
}

impl<T> Pair<T> {
    fn new(first: T, second: T) -> Self {
        // TODO
        todo!()
    }

    fn swap(self) -> Pair<T> {
        // TODO
        todo!()
    }
}

fn main() {
    // TODO
}`,
    tags: ['generics', 'structs', 'methods'],
  },
  {
    id: 'rs-ch10-c-042',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Define a Summary Trait',
    prompt: `Define a trait Summary with one required method summarize(&self) -> String. Define a struct Article with fields title (String) and author (String). Implement Summary for Article so summarize returns a string like "TITLE by AUTHOR". In main, build an Article and print its summary. Expected output:
Rust 101 by Carol`,
    hints: [
      'Traits declare method signatures; impl Summary for Article provides the body.',
      'Use format! to build the returned String.',
    ],
    solution: `trait Summary {
    fn summarize(&self) -> String;
}

struct Article {
    title: String,
    author: String,
}

impl Summary for Article {
    fn summarize(&self) -> String {
        format!("{} by {}", self.title, self.author)
    }
}

fn main() {
    let a = Article {
        title: String::from("Rust 101"),
        author: String::from("Carol"),
    };
    println!("{}", a.summarize());
}`,
    starter: `trait Summary {
    // TODO: summarize(&self) -> String
}

struct Article {
    title: String,
    author: String,
}

// TODO: impl Summary for Article

fn main() {
    let a = Article {
        title: String::from("Rust 101"),
        author: String::from("Carol"),
    };
    // TODO: print a.summarize()
}`,
    tags: ['traits', 'impl'],
  },
  {
    id: 'rs-ch10-c-043',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Trait for Two Types',
    prompt: `Define a trait Describe with method describe(&self) -> String. Implement it for two structs: Dog (field name: String) returning "Dog: NAME", and Circle (field radius: f64) returning "Circle r=RADIUS". In main, print the describe output of one Dog and one Circle. Expected output:
Dog: Rex
Circle r=2.5`,
    hints: [
      'You can implement the same trait for many types, each with its own body.',
      'Use format! inside each implementation.',
    ],
    solution: `trait Describe {
    fn describe(&self) -> String;
}

struct Dog {
    name: String,
}

struct Circle {
    radius: f64,
}

impl Describe for Dog {
    fn describe(&self) -> String {
        format!("Dog: {}", self.name)
    }
}

impl Describe for Circle {
    fn describe(&self) -> String {
        format!("Circle r={}", self.radius)
    }
}

fn main() {
    let d = Dog { name: String::from("Rex") };
    let c = Circle { radius: 2.5 };
    println!("{}", d.describe());
    println!("{}", c.describe());
}`,
    starter: `trait Describe {
    fn describe(&self) -> String;
}

struct Dog {
    name: String,
}

struct Circle {
    radius: f64,
}

// TODO: impl Describe for Dog and Circle

fn main() {
    let d = Dog { name: String::from("Rex") };
    let c = Circle { radius: 2.5 };
    // TODO: print both descriptions
}`,
    tags: ['traits', 'impl'],
  },
  {
    id: 'rs-ch10-c-044',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Default Trait Method',
    prompt: `Define a trait Greet with a default method hello(&self) -> String that returns "Hello!". Implement Greet for struct English WITHOUT overriding hello, and for struct French by overriding hello to return "Bonjour!". In main, print both. Expected output:
Hello!
Bonjour!`,
    hints: [
      'A default method has a body in the trait definition.',
      'For English, write an empty impl Greet for English {} to use the default.',
    ],
    solution: `trait Greet {
    fn hello(&self) -> String {
        String::from("Hello!")
    }
}

struct English;
struct French;

impl Greet for English {}

impl Greet for French {
    fn hello(&self) -> String {
        String::from("Bonjour!")
    }
}

fn main() {
    println!("{}", English.hello());
    println!("{}", French.hello());
}`,
    starter: `trait Greet {
    // TODO: default method hello(&self) -> String
}

struct English;
struct French;

// TODO: impl for both (English uses default, French overrides)

fn main() {
    println!("{}", English.hello());
    println!("{}", French.hello());
}`,
    tags: ['traits', 'default-methods'],
  },
  {
    id: 'rs-ch10-c-045',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Default Method Calls Required Method',
    prompt: `Define a trait Summary with a required method summarize_author(&self) -> String and a default method summarize(&self) -> String that returns "(Read more from AUTHOR...)" where AUTHOR is the result of summarize_author. Implement Summary for struct Tweet (field username: String) so summarize_author returns "@USERNAME". In main, print the default summarize of a Tweet whose username is "horse". Expected output:
(Read more from @horse...)`,
    hints: [
      'A default method may call other methods of the same trait, even required ones.',
      'Only summarize_author needs a body in the impl.',
    ],
    solution: `trait Summary {
    fn summarize_author(&self) -> String;

    fn summarize(&self) -> String {
        format!("(Read more from {}...)", self.summarize_author())
    }
}

struct Tweet {
    username: String,
}

impl Summary for Tweet {
    fn summarize_author(&self) -> String {
        format!("@{}", self.username)
    }
}

fn main() {
    let t = Tweet { username: String::from("horse") };
    println!("{}", t.summarize());
}`,
    starter: `trait Summary {
    fn summarize_author(&self) -> String;

    fn summarize(&self) -> String {
        // TODO: use self.summarize_author()
        todo!()
    }
}

struct Tweet {
    username: String,
}

// TODO: impl Summary for Tweet (only summarize_author)

fn main() {
    let t = Tweet { username: String::from("horse") };
    println!("{}", t.summarize());
}`,
    tags: ['traits', 'default-methods'],
  },
  {
    id: 'rs-ch10-c-046',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'impl Trait Parameter',
    prompt: `Reuse a trait Summary with summarize(&self) -> String, implemented for a struct Article (field headline: String, returning the headline). Write a function notify(item: &impl Summary) that prints "Breaking! TEXT" where TEXT is item.summarize(). In main, call notify on an Article. Expected output:
Breaking! Big news`,
    hints: [
      '&impl Summary means "a reference to any type that implements Summary".',
      'Inside notify you may call any Summary method on item.',
    ],
    solution: `trait Summary {
    fn summarize(&self) -> String;
}

struct Article {
    headline: String,
}

impl Summary for Article {
    fn summarize(&self) -> String {
        self.headline.clone()
    }
}

fn notify(item: &impl Summary) {
    println!("Breaking! {}", item.summarize());
}

fn main() {
    let a = Article { headline: String::from("Big news") };
    notify(&a);
}`,
    starter: `trait Summary {
    fn summarize(&self) -> String;
}

struct Article {
    headline: String,
}

impl Summary for Article {
    fn summarize(&self) -> String {
        self.headline.clone()
    }
}

fn notify(item: &impl Summary) {
    // TODO
}

fn main() {
    let a = Article { headline: String::from("Big news") };
    notify(&a);
}`,
    tags: ['traits', 'impl-trait', 'parameters'],
  },
  {
    id: 'rs-ch10-c-047',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Trait Bound Syntax',
    prompt: `Write a generic function with trait bound syntax: fn announce<T: std::fmt::Display>(item: T) that prints "Announcing: ITEM". Call it in main with an i32 and with a string slice. Expected output:
Announcing: 42
Announcing: hello`,
    hints: [
      'The <T: Display> form is equivalent to the &impl Display form but names the type.',
      'Display lets you use the value directly in a println! placeholder.',
    ],
    solution: `fn announce<T: std::fmt::Display>(item: T) {
    println!("Announcing: {}", item);
}

fn main() {
    announce(42);
    announce("hello");
}`,
    starter: `fn announce<T: std::fmt::Display>(item: T) {
    // TODO
}

fn main() {
    announce(42);
    announce("hello");
}`,
    tags: ['generics', 'trait-bounds', 'display'],
  },
  {
    id: 'rs-ch10-c-048',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Multiple Trait Bounds',
    prompt: `Write fn show_both<T: std::fmt::Display + std::fmt::Debug>(item: T) that prints the value two ways: first with Display, then with Debug. Call it on a tuple-free value: an i32. Expected output:
display: 5
debug: 5`,
    hints: [
      'Combine bounds with +: Display + Debug.',
      'Use the {} placeholder for Display and {:?} for Debug.',
    ],
    solution: `fn show_both<T: std::fmt::Display + std::fmt::Debug>(item: T) {
    println!("display: {}", item);
    println!("debug: {:?}", item);
}

fn main() {
    show_both(5);
}`,
    starter: `fn show_both<T: std::fmt::Display + std::fmt::Debug>(item: T) {
    // TODO: print with Display then Debug
}

fn main() {
    show_both(5);
}`,
    tags: ['generics', 'trait-bounds', 'debug'],
  },
  {
    id: 'rs-ch10-c-049',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Where Clause',
    prompt: `Rewrite a function to use a where clause. Define fn describe_pair<T, U>(a: T, b: U) -> String where T: std::fmt::Display, U: std::fmt::Display that returns "A and B" using the two values. In main, print the result of describe_pair(1, "two"). Expected output:
1 and two`,
    hints: [
      'A where clause moves the bounds after the return type for readability.',
      'Build the result with format!.',
    ],
    solution: `fn describe_pair<T, U>(a: T, b: U) -> String
where
    T: std::fmt::Display,
    U: std::fmt::Display,
{
    format!("{} and {}", a, b)
}

fn main() {
    println!("{}", describe_pair(1, "two"));
}`,
    starter: `fn describe_pair<T, U>(a: T, b: U) -> String
where
    T: std::fmt::Display,
    U: std::fmt::Display,
{
    // TODO
    todo!()
}

fn main() {
    println!("{}", describe_pair(1, "two"));
}`,
    tags: ['generics', 'where-clause', 'trait-bounds'],
  },
  {
    id: 'rs-ch10-c-050',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Returning impl Trait',
    prompt: `Write fn make_greeter() -> impl Fn() -> String that returns a closure producing "Hi there". Do NOT name the closure type. In main, call the returned closure and print it. Expected output:
Hi there`,
    hints: [
      'impl Trait in return position lets you return a value whose concrete type you do not write out.',
      'A closure with no parameters implements Fn() -> String.',
    ],
    solution: `fn make_greeter() -> impl Fn() -> String {
    || String::from("Hi there")
}

fn main() {
    let g = make_greeter();
    println!("{}", g());
}`,
    starter: `fn make_greeter() -> impl Fn() -> String {
    // TODO: return a closure
    todo!()
}

fn main() {
    let g = make_greeter();
    println!("{}", g());
}`,
    tags: ['impl-trait', 'return-position', 'closures'],
  },
  {
    id: 'rs-ch10-c-051',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Return impl Iterator',
    prompt: `Write fn evens_up_to(n: u32) -> impl Iterator<Item = u32> that returns an iterator over the even numbers in 0..n (use a range plus filter). In main, collect the result into a Vec<u32> for n = 10 and print it with {:?}. Expected output:
[0, 2, 4, 6, 8]`,
    hints: [
      'Returning impl Iterator hides the concrete adapter type.',
      'Use (0..n).filter(|x| x % 2 == 0).',
    ],
    solution: `fn evens_up_to(n: u32) -> impl Iterator<Item = u32> {
    (0..n).filter(|x| x % 2 == 0)
}

fn main() {
    let v: Vec<u32> = evens_up_to(10).collect();
    println!("{:?}", v);
}`,
    starter: `fn evens_up_to(n: u32) -> impl Iterator<Item = u32> {
    // TODO
    todo!()
}

fn main() {
    let v: Vec<u32> = evens_up_to(10).collect();
    println!("{:?}", v);
}`,
    tags: ['impl-trait', 'iterators', 'return-position'],
  },
  {
    id: 'rs-ch10-c-052',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Generic Method Returning Self Type',
    prompt: `Define a generic struct Wrapper<T> with field value: T and a method new(value: T) -> Self. Add a method get(self) -> T that returns the wrapped value by moving it out. In main, wrap the String "hi", retrieve it, and print it. Expected output:
hi`,
    hints: [
      'Self in the impl is Wrapper<T>.',
      'get takes self by value so it can move the inner value out.',
    ],
    solution: `struct Wrapper<T> {
    value: T,
}

impl<T> Wrapper<T> {
    fn new(value: T) -> Self {
        Wrapper { value }
    }

    fn get(self) -> T {
        self.value
    }
}

fn main() {
    let w = Wrapper::new(String::from("hi"));
    println!("{}", w.get());
}`,
    starter: `struct Wrapper<T> {
    value: T,
}

impl<T> Wrapper<T> {
    fn new(value: T) -> Self {
        // TODO
        todo!()
    }

    fn get(self) -> T {
        // TODO
        todo!()
    }
}

fn main() {
    let w = Wrapper::new(String::from("hi"));
    println!("{}", w.get());
}`,
    tags: ['generics', 'methods', 'ownership'],
  },
  {
    id: 'rs-ch10-c-053',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Longest String Slice',
    prompt: `Write the classic lifetime function:
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str
that returns whichever string slice is longer. In main, call it on two &str values and print the result. Expected output:
longest: programming`,
    hints: [
      'Both parameters and the return share the same lifetime parameter \'a.',
      'Compare x.len() and y.len() and return the corresponding reference.',
    ],
    solution: `fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let s1 = String::from("rust");
    let s2 = String::from("programming");
    println!("longest: {}", longest(s1.as_str(), s2.as_str()));
}`,
    starter: `fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    // TODO
    todo!()
}

fn main() {
    let s1 = String::from("rust");
    let s2 = String::from("programming");
    println!("longest: {}", longest(s1.as_str(), s2.as_str()));
}`,
    tags: ['lifetimes', 'references'],
  },
  {
    id: 'rs-ch10-c-054',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Return First Argument Lifetime',
    prompt: `Write fn first<'a>(x: &'a str, _y: &str) -> &'a str that always returns x. Note only x is tied to the returned lifetime; y has its own (elided) lifetime. In main, demonstrate that the result can outlive y by printing the result after y is no longer used. Expected output:
alpha`,
    hints: [
      'Only the reference you actually return needs the named lifetime.',
      'y can use a separate, unnamed lifetime since it is not returned.',
    ],
    solution: `fn first<'a>(x: &'a str, _y: &str) -> &'a str {
    x
}

fn main() {
    let x = String::from("alpha");
    let result;
    {
        let y = String::from("beta");
        result = first(x.as_str(), y.as_str());
    }
    println!("{}", result);
}`,
    starter: `fn first<'a>(x: &'a str, _y: &str) -> &'a str {
    // TODO: return x
    todo!()
}

fn main() {
    let x = String::from("alpha");
    let result;
    {
        let y = String::from("beta");
        result = first(x.as_str(), y.as_str());
    }
    println!("{}", result);
}`,
    tags: ['lifetimes', 'references'],
  },
  {
    id: 'rs-ch10-c-055',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Struct Holding a Reference',
    prompt: `Define a struct Excerpt<'a> with a single field part: &'a str. In main, take the first sentence (up to the first '.') of a longer owned String, store it in an Excerpt, and print the part. Expected output:
Call me Ishmael`,
    hints: [
      'A struct that holds a reference must declare a lifetime parameter.',
      'Use .split(\'.\').next().unwrap() to get the first sentence.',
    ],
    solution: `struct Excerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().unwrap();
    let e = Excerpt { part: first_sentence };
    println!("{}", e.part);
}`,
    starter: `struct Excerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    // TODO: build an Excerpt from the first sentence and print it
}`,
    tags: ['lifetimes', 'structs', 'references'],
  },
  {
    id: 'rs-ch10-c-056',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Lifetime Method on Struct',
    prompt: `Define struct Excerpt<'a> with field part: &'a str. Add a method announce_and_return_part(&self, announcement: &str) -> &str that prints "Attention: ANNOUNCEMENT" and returns self.part. Rely on lifetime elision (do NOT write explicit lifetimes on the method). In main, build an Excerpt and call the method, printing the returned part. Expected output:
Attention: listen up
hello world`,
    hints: [
      'By the elision rules, the returned reference is tied to &self, not to announcement.',
      'You should not need to write any lifetime annotations in the method signature.',
    ],
    solution: `struct Excerpt<'a> {
    part: &'a str,
}

impl<'a> Excerpt<'a> {
    fn announce_and_return_part(&self, announcement: &str) -> &str {
        println!("Attention: {}", announcement);
        self.part
    }
}

fn main() {
    let text = String::from("hello world");
    let e = Excerpt { part: text.as_str() };
    let p = e.announce_and_return_part("listen up");
    println!("{}", p);
}`,
    starter: `struct Excerpt<'a> {
    part: &'a str,
}

impl<'a> Excerpt<'a> {
    fn announce_and_return_part(&self, announcement: &str) -> &str {
        // TODO
        todo!()
    }
}

fn main() {
    let text = String::from("hello world");
    let e = Excerpt { part: text.as_str() };
    let p = e.announce_and_return_part("listen up");
    println!("{}", p);
}`,
    tags: ['lifetimes', 'methods', 'elision'],
  },
  {
    id: 'rs-ch10-c-057',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Static Lifetime String',
    prompt: `Write fn motto() -> &'static str that returns a string literal "Stay safe". String literals have the 'static lifetime because they live for the whole program. In main, print the returned value. Expected output:
Stay safe`,
    hints: [
      'String literals are stored in the binary and have type &\'static str.',
      'No allocation is needed; just return the literal.',
    ],
    solution: `fn motto() -> &'static str {
    "Stay safe"
}

fn main() {
    println!("{}", motto());
}`,
    starter: `fn motto() -> &'static str {
    // TODO
    todo!()
}

fn main() {
    println!("{}", motto());
}`,
    tags: ['lifetimes', 'static'],
  },
  {
    id: 'rs-ch10-c-058',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Generic Min and Max Pair',
    prompt: `Write fn min_max<T: PartialOrd + Copy>(list: &[T]) -> (T, T) that returns a tuple of the minimum and maximum elements. Assume the slice is non-empty. In main, print the result for vec![3, 9, 1, 7, 4] as a tuple. Expected output:
(1, 9)`,
    hints: [
      'Track two running values starting from the first element.',
      'Copy lets you return owned T values in the tuple.',
    ],
    solution: `fn min_max<T: PartialOrd + Copy>(list: &[T]) -> (T, T) {
    let mut min = list[0];
    let mut max = list[0];
    for &item in list {
        if item < min {
            min = item;
        }
        if item > max {
            max = item;
        }
    }
    (min, max)
}

fn main() {
    let nums = vec![3, 9, 1, 7, 4];
    println!("{:?}", min_max(&nums));
}`,
    starter: `fn min_max<T: PartialOrd + Copy>(list: &[T]) -> (T, T) {
    // TODO
    todo!()
}

fn main() {
    let nums = vec![3, 9, 1, 7, 4];
    println!("{:?}", min_max(&nums));
}`,
    tags: ['generics', 'trait-bounds', 'tuples'],
  },
  {
    id: 'rs-ch10-c-059',
    chapter: 10,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Trait with Associated Constant Behavior',
    prompt: `Define a trait Animal with a default method sound(&self) -> String returning "..." and a required method name(&self) -> String. Add a default method speak(&self) -> String returning "NAME says SOUND". Implement Animal for struct Cat (field nick: String) overriding name to return self.nick and sound to return "Meow". In main, print the speak output for a Cat named "Tom". Expected output:
Tom says Meow`,
    hints: [
      'speak is a default method that calls both name and sound.',
      'Override both name and sound in the Cat impl.',
    ],
    solution: `trait Animal {
    fn name(&self) -> String;

    fn sound(&self) -> String {
        String::from("...")
    }

    fn speak(&self) -> String {
        format!("{} says {}", self.name(), self.sound())
    }
}

struct Cat {
    nick: String,
}

impl Animal for Cat {
    fn name(&self) -> String {
        self.nick.clone()
    }

    fn sound(&self) -> String {
        String::from("Meow")
    }
}

fn main() {
    let c = Cat { nick: String::from("Tom") };
    println!("{}", c.speak());
}`,
    starter: `trait Animal {
    fn name(&self) -> String;

    fn sound(&self) -> String {
        String::from("...")
    }

    fn speak(&self) -> String {
        // TODO: "NAME says SOUND"
        todo!()
    }
}

struct Cat {
    nick: String,
}

// TODO: impl Animal for Cat

fn main() {
    let c = Cat { nick: String::from("Tom") };
    println!("{}", c.speak());
}`,
    tags: ['traits', 'default-methods'],
  },
  {
    id: 'rs-ch10-c-060',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Conditional Method via Trait Bounds',
    prompt: `Define a generic struct Pair<T> with fields first and second of type T and a new constructor. Then add a SEPARATE impl block, gated by where T: std::fmt::Display + PartialOrd, providing a method cmp_display(&self) that prints "The largest is first: X" if first >= second, otherwise "The largest is second: Y". In main, create Pair::new(7, 3) and call cmp_display. Expected output:
The largest is first: 7`,
    hints: [
      'Put new in an unconditional impl<T> block, and cmp_display in a conditional impl block.',
      'The conditional block is impl<T: Display + PartialOrd> Pair<T>.',
    ],
    solution: `use std::fmt::Display;

struct Pair<T> {
    first: T,
    second: T,
}

impl<T> Pair<T> {
    fn new(first: T, second: T) -> Self {
        Pair { first, second }
    }
}

impl<T: Display + PartialOrd> Pair<T> {
    fn cmp_display(&self) {
        if self.first >= self.second {
            println!("The largest is first: {}", self.first);
        } else {
            println!("The largest is second: {}", self.second);
        }
    }
}

fn main() {
    let p = Pair::new(7, 3);
    p.cmp_display();
}`,
    starter: `use std::fmt::Display;

struct Pair<T> {
    first: T,
    second: T,
}

impl<T> Pair<T> {
    fn new(first: T, second: T) -> Self {
        Pair { first, second }
    }
}

// TODO: conditional impl block with cmp_display

fn main() {
    let p = Pair::new(7, 3);
    p.cmp_display();
}`,
    tags: ['generics', 'trait-bounds', 'conditional-impl'],
  },
  {
    id: 'rs-ch10-c-061',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Blanket Implementation',
    prompt: `Define a trait Loud with method shout(&self) -> String. Write a BLANKET implementation: impl<T: std::fmt::Display> Loud for T, where shout returns the value formatted in uppercase followed by "!!!" (use to_string then to_uppercase). In main, call shout() on both an i32 (5) and a &str ("hi"). Expected output:
5!!!
HI!!!`,
    hints: [
      'A blanket impl implements a trait for every type satisfying a bound: impl<T: Display> Loud for T.',
      'Build the String with to_string().to_uppercase() and append "!!!".',
    ],
    solution: `use std::fmt::Display;

trait Loud {
    fn shout(&self) -> String;
}

impl<T: Display> Loud for T {
    fn shout(&self) -> String {
        format!("{}!!!", self.to_string().to_uppercase())
    }
}

fn main() {
    println!("{}", 5.shout());
    println!("{}", "hi".shout());
}`,
    starter: `use std::fmt::Display;

trait Loud {
    fn shout(&self) -> String;
}

// TODO: blanket impl for all T: Display

fn main() {
    println!("{}", 5.shout());
    println!("{}", "hi".shout());
}`,
    tags: ['traits', 'blanket-impl', 'generics'],
  },
  {
    id: 'rs-ch10-c-062',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Generic Largest With Display Output',
    prompt: `Combine generics and multiple bounds. Write fn largest<T: PartialOrd + Copy + std::fmt::Display>(list: &[T]) -> T that finds the largest element and, before returning it, prints "Checking N items" where N is list.len(). In main, call it on vec![10, 25, 3, 47, 8] and print "max = VALUE". Expected output:
Checking 5 items
max = 47`,
    hints: [
      'You need PartialOrd to compare, Copy to return by value, and Display for the prints.',
      'Print the count first, then run the loop, then return.',
    ],
    solution: `use std::fmt::Display;

fn largest<T: PartialOrd + Copy + Display>(list: &[T]) -> T {
    println!("Checking {} items", list.len());
    let mut largest = list[0];
    for &item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}

fn main() {
    let nums = vec![10, 25, 3, 47, 8];
    println!("max = {}", largest(&nums));
}`,
    starter: `use std::fmt::Display;

fn largest<T: PartialOrd + Copy + Display>(list: &[T]) -> T {
    // TODO
    todo!()
}

fn main() {
    let nums = vec![10, 25, 3, 47, 8];
    println!("max = {}", largest(&nums));
}`,
    tags: ['generics', 'trait-bounds', 'display'],
  },
  {
    id: 'rs-ch10-c-063',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Generic Method Mixing Two Type Params',
    prompt: `Define struct Point<T, U> with x: T, y: U. Add a method mixup<V, W>(self, other: Point<V, W>) -> Point<T, W> that builds a new Point taking x from self and y from other. In main, create p1 = Point { x: 5, y: 10.4 } and p2 = Point { x: "Hello", y: 'c' }, call p1.mixup(p2), and print the resulting x and y. Expected output:
p3.x = 5, p3.y = c`,
    hints: [
      'The method introduces its own generics V and W separate from the struct generics T and U.',
      'The result type is Point<T, W>: x from self, y from other.',
    ],
    solution: `struct Point<T, U> {
    x: T,
    y: U,
}

impl<T, U> Point<T, U> {
    fn mixup<V, W>(self, other: Point<V, W>) -> Point<T, W> {
        Point {
            x: self.x,
            y: other.y,
        }
    }
}

fn main() {
    let p1 = Point { x: 5, y: 10.4 };
    let p2 = Point { x: "Hello", y: 'c' };
    let p3 = p1.mixup(p2);
    println!("p3.x = {}, p3.y = {}", p3.x, p3.y);
}`,
    starter: `struct Point<T, U> {
    x: T,
    y: U,
}

impl<T, U> Point<T, U> {
    fn mixup<V, W>(self, other: Point<V, W>) -> Point<T, W> {
        // TODO
        todo!()
    }
}

fn main() {
    let p1 = Point { x: 5, y: 10.4 };
    let p2 = Point { x: "Hello", y: 'c' };
    let p3 = p1.mixup(p2);
    println!("p3.x = {}, p3.y = {}", p3.x, p3.y);
}`,
    tags: ['generics', 'methods', 'structs'],
  },
  {
    id: 'rs-ch10-c-064',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Longest With Announcement: Generics + Bounds + Lifetimes',
    prompt: `Write the all-in-one function from the chapter:
fn longest_with_an_announcement<'a, T>(x: &'a str, y: &'a str, ann: T) -> &'a str
where T: std::fmt::Display
It prints "Announcement! ANN" then returns the longer of x and y. In main, call it with two strings and an i32 announcement, printing the result. Expected output:
Announcement! 1
longest`,
    hints: [
      'This combines a lifetime parameter \'a with a generic type T bounded by Display.',
      'Print the announcement, then compare lengths and return the longer slice.',
    ],
    solution: `use std::fmt::Display;

fn longest_with_an_announcement<'a, T>(x: &'a str, y: &'a str, ann: T) -> &'a str
where
    T: Display,
{
    println!("Announcement! {}", ann);
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let s1 = String::from("short");
    let s2 = String::from("longest");
    let result = longest_with_an_announcement(s1.as_str(), s2.as_str(), 1);
    println!("{}", result);
}`,
    starter: `use std::fmt::Display;

fn longest_with_an_announcement<'a, T>(x: &'a str, y: &'a str, ann: T) -> &'a str
where
    T: Display,
{
    // TODO
    todo!()
}

fn main() {
    let s1 = String::from("short");
    let s2 = String::from("longest");
    let result = longest_with_an_announcement(s1.as_str(), s2.as_str(), 1);
    println!("{}", result);
}`,
    tags: ['lifetimes', 'generics', 'trait-bounds'],
  },
  {
    id: 'rs-ch10-c-065',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Generic Stack',
    prompt: `Implement a generic struct Stack<T> backed by a Vec<T>. Provide: new() -> Self, push(&mut self, item: T), pop(&mut self) -> Option<T>, and len(&self) -> usize. In main, push 1, 2, 3, pop once, then print the length and the popped value. Expected output:
popped: 3
len: 2`,
    hints: [
      'Store a Vec<T> field and delegate to its push/pop/len methods.',
      'pop on Vec already returns Option<T>, which matches the required signature.',
    ],
    solution: `struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    fn new() -> Self {
        Stack { items: Vec::new() }
    }

    fn push(&mut self, item: T) {
        self.items.push(item);
    }

    fn pop(&mut self) -> Option<T> {
        self.items.pop()
    }

    fn len(&self) -> usize {
        self.items.len()
    }
}

fn main() {
    let mut s: Stack<i32> = Stack::new();
    s.push(1);
    s.push(2);
    s.push(3);
    let popped = s.pop().unwrap();
    println!("popped: {}", popped);
    println!("len: {}", s.len());
}`,
    starter: `struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    fn new() -> Self {
        // TODO
        todo!()
    }

    fn push(&mut self, item: T) {
        // TODO
    }

    fn pop(&mut self) -> Option<T> {
        // TODO
        todo!()
    }

    fn len(&self) -> usize {
        // TODO
        todo!()
    }
}

fn main() {
    let mut s: Stack<i32> = Stack::new();
    s.push(1);
    s.push(2);
    s.push(3);
    let popped = s.pop().unwrap();
    println!("popped: {}", popped);
    println!("len: {}", s.len());
}`,
    tags: ['generics', 'structs', 'methods'],
  },
  {
    id: 'rs-ch10-c-066',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Trait Object-Free Polymorphism via Bounds',
    prompt: `Define a trait Area with method area(&self) -> f64. Implement it for struct Rectangle (width, height: f64) and struct Square (side: f64). Write a generic function print_area<T: Area>(shape: &T) that prints "area = X" where X is shape.area(). In main, call print_area for a Rectangle 3 by 4 and a Square of side 5. Expected output:
area = 12
area = 25`,
    hints: [
      'Each impl computes area from its own fields.',
      'print_area is generic over any T that implements Area; pass a reference.',
    ],
    solution: `trait Area {
    fn area(&self) -> f64;
}

struct Rectangle {
    width: f64,
    height: f64,
}

struct Square {
    side: f64,
}

impl Area for Rectangle {
    fn area(&self) -> f64 {
        self.width * self.height
    }
}

impl Area for Square {
    fn area(&self) -> f64 {
        self.side * self.side
    }
}

fn print_area<T: Area>(shape: &T) {
    println!("area = {}", shape.area());
}

fn main() {
    let r = Rectangle { width: 3.0, height: 4.0 };
    let s = Square { side: 5.0 };
    print_area(&r);
    print_area(&s);
}`,
    starter: `trait Area {
    fn area(&self) -> f64;
}

struct Rectangle {
    width: f64,
    height: f64,
}

struct Square {
    side: f64,
}

// TODO: impl Area for both

fn print_area<T: Area>(shape: &T) {
    // TODO
}

fn main() {
    let r = Rectangle { width: 3.0, height: 4.0 };
    let s = Square { side: 5.0 };
    print_area(&r);
    print_area(&s);
}`,
    tags: ['traits', 'generics', 'trait-bounds'],
  },
  {
    id: 'rs-ch10-c-067',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Struct With Two References',
    prompt: `Define a struct Parser<'a> that holds two string-slice references: source: &'a str and delimiter: &'a str. Add a method first_field(&self) -> &str that returns the part of source before the first occurrence of delimiter (use source.split(self.delimiter).next().unwrap()). In main, parse "a,b,c" with delimiter "," and print the first field. Expected output:
a`,
    hints: [
      'The struct needs one lifetime parameter shared by both reference fields.',
      'By elision, the method return is tied to &self.',
    ],
    solution: `struct Parser<'a> {
    source: &'a str,
    delimiter: &'a str,
}

impl<'a> Parser<'a> {
    fn first_field(&self) -> &str {
        self.source.split(self.delimiter).next().unwrap()
    }
}

fn main() {
    let p = Parser {
        source: "a,b,c",
        delimiter: ",",
    };
    println!("{}", p.first_field());
}`,
    starter: `struct Parser<'a> {
    source: &'a str,
    delimiter: &'a str,
}

impl<'a> Parser<'a> {
    fn first_field(&self) -> &str {
        // TODO
        todo!()
    }
}

fn main() {
    let p = Parser {
        source: "a,b,c",
        delimiter: ",",
    };
    println!("{}", p.first_field());
}`,
    tags: ['lifetimes', 'structs', 'methods'],
  },
  {
    id: 'rs-ch10-c-068',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Longest Over a Slice of Slices',
    prompt: `Write fn longest_str<'a>(strings: &[&'a str]) -> &'a str that returns the longest &str in the slice (assume non-empty; on ties return the earlier one). In main, call it on &["a", "ccc", "bb"] and print the result. Expected output:
ccc`,
    hints: [
      'The returned reference borrows from the same data as the slice elements, so it shares lifetime \'a.',
      'Track the current longest, updating only when you find a strictly longer one.',
    ],
    solution: `fn longest_str<'a>(strings: &[&'a str]) -> &'a str {
    let mut longest = strings[0];
    for &s in strings {
        if s.len() > longest.len() {
            longest = s;
        }
    }
    longest
}

fn main() {
    let words = ["a", "ccc", "bb"];
    println!("{}", longest_str(&words));
}`,
    starter: `fn longest_str<'a>(strings: &[&'a str]) -> &'a str {
    // TODO
    todo!()
}

fn main() {
    let words = ["a", "ccc", "bb"];
    println!("{}", longest_str(&words));
}`,
    tags: ['lifetimes', 'slices', 'references'],
  },
  {
    id: 'rs-ch10-c-069',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Generic Container With Display Bound Method',
    prompt: `Define struct Container<T> { items: Vec<T> } with new() and add(&mut self, item: T) in an unconditional impl block. In a SEPARATE conditional impl block where T: std::fmt::Display, add a method print_all(&self) that prints each item on its own line. In main, build a Container<i32>, add 10, 20, 30, and call print_all. Expected output:
10
20
30`,
    hints: [
      'Keep new and add generic over all T; gate print_all behind T: Display.',
      'Iterate with for item in &self.items.',
    ],
    solution: `use std::fmt::Display;

struct Container<T> {
    items: Vec<T>,
}

impl<T> Container<T> {
    fn new() -> Self {
        Container { items: Vec::new() }
    }

    fn add(&mut self, item: T) {
        self.items.push(item);
    }
}

impl<T: Display> Container<T> {
    fn print_all(&self) {
        for item in &self.items {
            println!("{}", item);
        }
    }
}

fn main() {
    let mut c: Container<i32> = Container::new();
    c.add(10);
    c.add(20);
    c.add(30);
    c.print_all();
}`,
    starter: `use std::fmt::Display;

struct Container<T> {
    items: Vec<T>,
}

impl<T> Container<T> {
    fn new() -> Self {
        Container { items: Vec::new() }
    }

    fn add(&mut self, item: T) {
        self.items.push(item);
    }
}

// TODO: conditional impl block with print_all (T: Display)

fn main() {
    let mut c: Container<i32> = Container::new();
    c.add(10);
    c.add(20);
    c.add(30);
    c.print_all();
}`,
    tags: ['generics', 'conditional-impl', 'trait-bounds'],
  },
  {
    id: 'rs-ch10-c-070',
    chapter: 10,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Generic Map Function With Closure',
    prompt: `Write a generic function fn map_all<T, U, F>(items: Vec<T>, f: F) -> Vec<U> where F: Fn(T) -> U that applies f to each element and collects the results into a new Vec<U>. In main, use it to turn vec![1, 2, 3] into their doubles, then print the result with {:?}. Expected output:
[2, 4, 6]`,
    hints: [
      'Three type parameters: input T, output U, and the closure type F bound by Fn(T) -> U.',
      'Consume the input Vec with into_iter, map with the closure, and collect.',
    ],
    solution: `fn map_all<T, U, F>(items: Vec<T>, f: F) -> Vec<U>
where
    F: Fn(T) -> U,
{
    let mut result = Vec::new();
    for item in items {
        result.push(f(item));
    }
    result
}

fn main() {
    let doubled = map_all(vec![1, 2, 3], |x| x * 2);
    println!("{:?}", doubled);
}`,
    starter: `fn map_all<T, U, F>(items: Vec<T>, f: F) -> Vec<U>
where
    F: Fn(T) -> U,
{
    // TODO
    todo!()
}

fn main() {
    let doubled = map_all(vec![1, 2, 3], |x| x * 2);
    println!("{:?}", doubled);
}`,
    tags: ['generics', 'trait-bounds', 'closures', 'where-clause'],
  },
]

export default problems
