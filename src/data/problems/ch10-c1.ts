import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch10-c-001',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Generic Identity Function',
    prompt: `Write a generic function \`identity<T>(value: T) -> T\` that simply returns the value it is given, unchanged.

In \`main\`, call it once with the integer 5 and once with the string slice "hi", printing each returned value.`,
    hints: [
      'Declare the type parameter in angle brackets right after the function name: \`fn identity<T>(...)\`.',
      'The body just returns \`value\`.',
    ],
    solution: `fn identity<T>(value: T) -> T {
    value
}

fn main() {
    println!("{}", identity(5));
    println!("{}", identity("hi"));
}`,
    starter: `fn identity<T>(value: T) -> T {
    // TODO: return the value unchanged
}

fn main() {
    println!("{}", identity(5));
    println!("{}", identity("hi"));
}`,
    tags: ['generics', 'functions'],
  },
  {
    id: 'rs-ch10-c-002',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Generic Pair Printer',
    prompt: `Write a generic function \`print_both<T: std::fmt::Display>(a: T, b: T)\` that prints both arguments on one line separated by a space.

In \`main\`, call it with the two integers 3 and 7, and then with the two string slices "left" and "right".`,
    hints: [
      'The trait bound \`T: std::fmt::Display\` lets you use \`{}\` to print \`T\`.',
      'Use a single \`println!("{} {}", a, b)\`.',
    ],
    solution: `fn print_both<T: std::fmt::Display>(a: T, b: T) {
    println!("{} {}", a, b);
}

fn main() {
    print_both(3, 7);
    print_both("left", "right");
}`,
    starter: `fn print_both<T: std::fmt::Display>(a: T, b: T) {
    // TODO: print both on one line, space separated
}

fn main() {
    print_both(3, 7);
    print_both("left", "right");
}`,
    tags: ['generics', 'display', 'trait-bounds'],
  },
  {
    id: 'rs-ch10-c-003',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Generic Point Struct',
    prompt: `Define a generic struct \`Point<T>\` with two fields \`x\` and \`y\`, both of type \`T\`.

In \`main\`, create one \`Point\` holding integers (1 and 2) and one holding floats (1.5 and 2.5). Print each field of the integer point.`,
    hints: [
      'Declare the parameter after the struct name: \`struct Point<T>\`.',
      'Both fields share the same type \`T\`.',
    ],
    solution: `struct Point<T> {
    x: T,
    y: T,
}

fn main() {
    let int_point = Point { x: 1, y: 2 };
    let float_point = Point { x: 1.5, y: 2.5 };
    println!("{} {}", int_point.x, int_point.y);
    let _ = float_point;
}`,
    starter: `// TODO: define a generic Point<T> struct

fn main() {
    let int_point = Point { x: 1, y: 2 };
    let float_point = Point { x: 1.5, y: 2.5 };
    println!("{} {}", int_point.x, int_point.y);
    let _ = float_point;
}`,
    tags: ['generics', 'structs'],
  },
  {
    id: 'rs-ch10-c-004',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Define a Summary Trait',
    prompt: `Define a trait named \`Summary\` with a single method signature \`fn summarize(&self) -> String;\` (no default body).

Also define a struct \`Tweet\` with a \`content\` field of type \`String\`, and implement \`Summary\` for \`Tweet\` so that \`summarize\` returns the content prefixed with "Tweet: ".

In \`main\`, create a \`Tweet\` and print its summary.`,
    hints: [
      'A trait declares method signatures inside \`trait Summary { ... }\`.',
      'Implement it with \`impl Summary for Tweet { ... }\`.',
    ],
    solution: `trait Summary {
    fn summarize(&self) -> String;
}

struct Tweet {
    content: String,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("Tweet: {}", self.content)
    }
}

fn main() {
    let t = Tweet { content: String::from("hello world") };
    println!("{}", t.summarize());
}`,
    starter: `trait Summary {
    fn summarize(&self) -> String;
}

struct Tweet {
    content: String,
}

// TODO: implement Summary for Tweet

fn main() {
    let t = Tweet { content: String::from("hello world") };
    println!("{}", t.summarize());
}`,
    tags: ['traits', 'impl'],
  },
  {
    id: 'rs-ch10-c-005',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Implement a Trait for Two Types',
    prompt: `Given this trait:

    trait Describe {
        fn describe(&self) -> String;
    }

Define two structs, \`Dog\` and \`Cat\` (each can be a unit-like struct with no fields). Implement \`Describe\` for both: \`Dog\` returns "woof" and \`Cat\` returns "meow".

In \`main\`, create one of each and print both descriptions.`,
    hints: [
      'You write a separate \`impl Describe for ...\` block for each type.',
      'A unit-like struct is declared as \`struct Dog;\`.',
    ],
    solution: `trait Describe {
    fn describe(&self) -> String;
}

struct Dog;
struct Cat;

impl Describe for Dog {
    fn describe(&self) -> String {
        String::from("woof")
    }
}

impl Describe for Cat {
    fn describe(&self) -> String {
        String::from("meow")
    }
}

fn main() {
    let d = Dog;
    let c = Cat;
    println!("{}", d.describe());
    println!("{}", c.describe());
}`,
    starter: `trait Describe {
    fn describe(&self) -> String;
}

struct Dog;
struct Cat;

// TODO: implement Describe for Dog and for Cat

fn main() {
    let d = Dog;
    let c = Cat;
    println!("{}", d.describe());
    println!("{}", c.describe());
}`,
    tags: ['traits', 'impl', 'structs'],
  },
  {
    id: 'rs-ch10-c-006',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Default Trait Method',
    prompt: `Define a trait \`Greet\` with a method \`hello(&self) -> String\` that has a DEFAULT implementation returning "Hello!".

Define a unit-like struct \`Robot\` and implement \`Greet\` for it WITHOUT overriding \`hello\` (an empty impl block).

In \`main\`, create a \`Robot\` and print the result of calling \`hello\`.`,
    hints: [
      'A default method has a body right inside the \`trait\` block.',
      'An empty \`impl Greet for Robot {}\` inherits the default.',
    ],
    solution: `trait Greet {
    fn hello(&self) -> String {
        String::from("Hello!")
    }
}

struct Robot;

impl Greet for Robot {}

fn main() {
    let r = Robot;
    println!("{}", r.hello());
}`,
    starter: `trait Greet {
    // TODO: a default method hello returning "Hello!"
}

struct Robot;

impl Greet for Robot {}

fn main() {
    let r = Robot;
    println!("{}", r.hello());
}`,
    tags: ['traits', 'default-method'],
  },
  {
    id: 'rs-ch10-c-007',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Trait as Parameter With impl Trait',
    prompt: `Given this trait and its implementation:

    trait Summary {
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

Write a function \`notify(item: &impl Summary)\` that prints \`Breaking news! \` followed by the item's summary. In \`main\`, create an \`Article\` and pass a reference to it into \`notify\`.`,
    hints: [
      'The parameter type \`&impl Summary\` accepts a reference to any type implementing \`Summary\`.',
      'Call \`item.summarize()\` inside the function.',
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
    println!("Breaking news! {}", item.summarize());
}

fn main() {
    let a = Article { headline: String::from("Rust 2.0 released") };
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
    // TODO: print "Breaking news! " followed by the summary
}

fn main() {
    let a = Article { headline: String::from("Rust 2.0 released") };
    notify(&a);
}`,
    tags: ['traits', 'impl-trait', 'parameters'],
  },
  {
    id: 'rs-ch10-c-008',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Longest Function With Lifetimes',
    prompt: `Write a function \`longest\` that takes two string slices and returns the longer one. Because it returns a reference, you must annotate lifetimes.

Use this exact signature:

    fn longest<'a>(x: &'a str, y: &'a str) -> &'a str

In \`main\`, call it with "apple" and "banana" and print the result.`,
    hints: [
      'Declare the lifetime in angle brackets: \`<\'a>\`, then use \`&\'a str\` on the two parameters and the return.',
      'Compare with \`x.len() > y.len()\` and return one of the two slices.',
    ],
    solution: `fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let result = longest("apple", "banana");
    println!("{}", result);
}`,
    starter: `fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    // TODO: return the longer of x and y
}

fn main() {
    let result = longest("apple", "banana");
    println!("{}", result);
}`,
    tags: ['lifetimes', 'functions'],
  },
  {
    id: 'rs-ch10-c-009',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Struct Holding a Reference',
    prompt: `Define a struct \`Excerpt\` that holds a single field \`part\` of type \`&str\`. Because the struct holds a reference, it needs a lifetime parameter.

Use this definition shape:

    struct Excerpt<'a> {
        part: &'a str,
    }

In \`main\`, create a \`String\`, take a slice of its first word, build an \`Excerpt\` from that slice, and print the \`part\` field.`,
    hints: [
      'Declare the lifetime after the struct name: \`struct Excerpt<\'a>\`.',
      'The field type becomes \`&\'a str\`.',
    ],
    solution: `struct Excerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first = novel.split(' ').next().expect("no words");
    let e = Excerpt { part: first };
    println!("{}", e.part);
}`,
    starter: `struct Excerpt<'a> {
    part: &'a str,
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first = novel.split(' ').next().expect("no words");
    // TODO: build an Excerpt from first and print its part
}`,
    tags: ['lifetimes', 'structs'],
  },
  {
    id: 'rs-ch10-c-010',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Generic Wrapper Struct',
    prompt: `Define a generic struct \`Wrapper<T>\` with a single field \`value\` of type \`T\`.

In \`main\`, create a \`Wrapper\` around the integer 42 and a \`Wrapper\` around the string slice "hi". Print the \`value\` field of each.`,
    hints: [
      'The struct has one type parameter \`T\` and one field of type \`T\`.',
      'Rust infers \`T\` from the value you pass.',
    ],
    solution: `struct Wrapper<T> {
    value: T,
}

fn main() {
    let a = Wrapper { value: 42 };
    let b = Wrapper { value: "hi" };
    println!("{}", a.value);
    println!("{}", b.value);
}`,
    starter: `// TODO: define a generic Wrapper<T> with a value field

fn main() {
    let a = Wrapper { value: 42 };
    let b = Wrapper { value: "hi" };
    println!("{}", a.value);
    println!("{}", b.value);
}`,
    tags: ['generics', 'structs'],
  },
  {
    id: 'rs-ch10-c-011',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Generic Enum',
    prompt: `Define a generic enum \`MyOption<T>\` with two variants: \`Some(T)\` and \`None\` (this mirrors the standard library's \`Option\`).

In \`main\`, create a \`MyOption<i32>\` holding the value 7 using the \`Some\` variant, and a \`MyOption<i32>\` using the \`None\` variant. You can \`match\` on the \`Some\` value and print it.`,
    hints: [
      'Declare the parameter after the enum name: \`enum MyOption<T>\`.',
      'The \`Some\` variant carries data of type \`T\`; \`None\` carries nothing.',
    ],
    solution: `enum MyOption<T> {
    Some(T),
    None,
}

fn main() {
    let a: MyOption<i32> = MyOption::Some(7);
    let b: MyOption<i32> = MyOption::None;

    match a {
        MyOption::Some(v) => println!("{}", v),
        MyOption::None => println!("nothing"),
    }
    match b {
        MyOption::Some(v) => println!("{}", v),
        MyOption::None => println!("nothing"),
    }
}`,
    starter: `// TODO: define a generic enum MyOption<T> with Some(T) and None

fn main() {
    let a: MyOption<i32> = MyOption::Some(7);
    let b: MyOption<i32> = MyOption::None;

    match a {
        MyOption::Some(v) => println!("{}", v),
        MyOption::None => println!("nothing"),
    }
    match b {
        MyOption::Some(v) => println!("{}", v),
        MyOption::None => println!("nothing"),
    }
}`,
    tags: ['generics', 'enums'],
  },
  {
    id: 'rs-ch10-c-012',
    chapter: 10,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Reuse a Default Method',
    prompt: `Define a trait \`Loud\` with a default method \`shout(&self) -> String\` that returns "AAAH".

Define a struct \`Quiet\` and implement \`Loud\` for it, but OVERRIDE \`shout\` to return "psst" instead.

In \`main\`, create a \`Quiet\` and print the result of \`shout\` (you should see the overridden value).`,
    hints: [
      'Providing a method body in the impl overrides the trait default.',
      'The default is used only when the impl leaves the method out.',
    ],
    solution: `trait Loud {
    fn shout(&self) -> String {
        String::from("AAAH")
    }
}

struct Quiet;

impl Loud for Quiet {
    fn shout(&self) -> String {
        String::from("psst")
    }
}

fn main() {
    let q = Quiet;
    println!("{}", q.shout());
}`,
    starter: `trait Loud {
    fn shout(&self) -> String {
        String::from("AAAH")
    }
}

struct Quiet;

impl Loud for Quiet {
    // TODO: override shout to return "psst"
}

fn main() {
    let q = Quiet;
    println!("{}", q.shout());
}`,
    tags: ['traits', 'default-method', 'override'],
  },
  {
    id: 'rs-ch10-c-013',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Generic Largest of Two',
    prompt: `Write a generic function \`larger<T: PartialOrd>(a: T, b: T) -> T\` that returns the greater of the two arguments.

The \`PartialOrd\` bound is required so you can use the \`>\` operator on values of type \`T\`. In \`main\`, call it with 3 and 9 and print the result, and with 2.5 and 1.5 and print that result.`,
    hints: [
      'The bound \`T: PartialOrd\` enables comparison operators.',
      'Return \`a\` when \`a > b\`, otherwise \`b\`.',
    ],
    solution: `fn larger<T: PartialOrd>(a: T, b: T) -> T {
    if a > b {
        a
    } else {
        b
    }
}

fn main() {
    println!("{}", larger(3, 9));
    println!("{}", larger(2.5, 1.5));
}`,
    starter: `fn larger<T: PartialOrd>(a: T, b: T) -> T {
    // TODO: return the greater of a and b
}

fn main() {
    println!("{}", larger(3, 9));
    println!("{}", larger(2.5, 1.5));
}`,
    tags: ['generics', 'trait-bounds', 'partialord'],
  },
  {
    id: 'rs-ch10-c-014',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'The Largest in a Slice',
    prompt: `Write a generic function with this signature:

    fn largest<T: PartialOrd + Copy>(list: &[T]) -> T

It returns the largest element of the slice. Both bounds are needed: \`PartialOrd\` to compare, and \`Copy\` so you can hold a value out of the slice.

In \`main\`, call it on a slice of integers \`[34, 50, 25, 100, 65]\` and on a slice of chars \`['y', 'm', 'a', 'q']\`, printing each largest value.`,
    hints: [
      'Start with the first element: \`let mut largest = list[0];\`.',
      'Loop over \`&item in list\`, and update \`largest\` when \`item > largest\`.',
    ],
    solution: `fn largest<T: PartialOrd + Copy>(list: &[T]) -> T {
    let mut largest = list[0];
    for &item in list {
        if item > largest {
            largest = item;
        }
    }
    largest
}

fn main() {
    let numbers = vec![34, 50, 25, 100, 65];
    println!("{}", largest(&numbers));

    let chars = vec!['y', 'm', 'a', 'q'];
    println!("{}", largest(&chars));
}`,
    starter: `fn largest<T: PartialOrd + Copy>(list: &[T]) -> T {
    // TODO: find and return the largest element
}

fn main() {
    let numbers = vec![34, 50, 25, 100, 65];
    println!("{}", largest(&numbers));

    let chars = vec!['y', 'm', 'a', 'q'];
    println!("{}", largest(&chars));
}`,
    tags: ['generics', 'trait-bounds', 'slices'],
  },
  {
    id: 'rs-ch10-c-015',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Method on a Generic Struct',
    prompt: `Given this generic struct:

    struct Point<T> {
        x: T,
        y: T,
    }

Write an \`impl<T> Point<T>\` block with a method \`x(&self) -> &T\` that returns a reference to the \`x\` field.

In \`main\`, create a \`Point\` holding integers 5 and 10, then print the value returned by \`p.x()\`.`,
    hints: [
      'The impl header must declare the parameter too: \`impl<T> Point<T>\`.',
      'Return \`&self.x\`.',
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
    let p = Point { x: 5, y: 10 };
    println!("{}", p.x());
}`,
    starter: `struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    // TODO: add x(&self) -> &T returning a reference to the x field
}

fn main() {
    let p = Point { x: 5, y: 10 };
    println!("{}", p.x());
}`,
    tags: ['generics', 'methods', 'structs'],
  },
  {
    id: 'rs-ch10-c-016',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Generic Pair With new',
    prompt: `Define a generic struct \`Pair<T>\` with fields \`first\` and \`second\`, both of type \`T\`. Add an \`impl<T> Pair<T>\` block with an associated function \`new(first: T, second: T) -> Self\`.

In \`main\`, build a \`Pair\` of integers with \`Pair::new(5, 10)\` and print both fields.`,
    hints: [
      'The associated function takes no \`self\` and returns \`Self\`.',
      'Use field init shorthand: \`Self { first, second }\`.',
    ],
    solution: `struct Pair<T> {
    first: T,
    second: T,
}

impl<T> Pair<T> {
    fn new(first: T, second: T) -> Self {
        Self { first, second }
    }
}

fn main() {
    let p = Pair::new(5, 10);
    println!("{} {}", p.first, p.second);
}`,
    starter: `struct Pair<T> {
    first: T,
    second: T,
}

impl<T> Pair<T> {
    // TODO: add new(first: T, second: T) -> Self
}

fn main() {
    let p = Pair::new(5, 10);
    println!("{} {}", p.first, p.second);
}`,
    tags: ['generics', 'structs', 'associated-function'],
  },
  {
    id: 'rs-ch10-c-017',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Two Type Parameters',
    prompt: `Define a struct \`Point<T, U>\` with field \`x\` of type \`T\` and field \`y\` of type \`U\`, so the two coordinates can have different types.

In \`main\`, create a point with an integer \`x\` (5) and a floating-point \`y\` (4.0), and print both fields.`,
    hints: [
      'List both parameters in the angle brackets: \`struct Point<T, U>\`.',
      'Give each field its own type parameter.',
    ],
    solution: `struct Point<T, U> {
    x: T,
    y: U,
}

fn main() {
    let p = Point { x: 5, y: 4.0 };
    println!("{} {}", p.x, p.y);
}`,
    starter: `// TODO: define Point<T, U> with x: T and y: U

fn main() {
    let p = Point { x: 5, y: 4.0 };
    println!("{} {}", p.x, p.y);
}`,
    tags: ['generics', 'structs'],
  },
  {
    id: 'rs-ch10-c-018',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Default Method Calls Required Method',
    prompt: `Define a trait \`Summary\` with:
- a required method \`fn summarize_author(&self) -> String;\` (no body)
- a default method \`fn summarize(&self) -> String\` that returns "(Read more from @USERNAME...)" where USERNAME is the result of calling \`self.summarize_author()\`.

Define a struct \`Tweet\` with a \`username\` field (\`String\`) and implement \`Summary\` for it, providing only \`summarize_author\` (returning the username). In \`main\`, create a \`Tweet\` with username "horse" and print \`summarize\`.`,
    hints: [
      'A default method can call other methods of the same trait, even required ones.',
      'Use \`format!\` so you can interpolate \`self.summarize_author()\`.',
    ],
    solution: `trait Summary {
    fn summarize_author(&self) -> String;

    fn summarize(&self) -> String {
        format!("(Read more from @{}...)", self.summarize_author())
    }
}

struct Tweet {
    username: String,
}

impl Summary for Tweet {
    fn summarize_author(&self) -> String {
        self.username.clone()
    }
}

fn main() {
    let t = Tweet { username: String::from("horse") };
    println!("{}", t.summarize());
}`,
    starter: `trait Summary {
    fn summarize_author(&self) -> String;

    fn summarize(&self) -> String {
        // TODO: build the "(Read more from @...)" string using summarize_author
    }
}

struct Tweet {
    username: String,
}

impl Summary for Tweet {
    // TODO: provide summarize_author
}

fn main() {
    let t = Tweet { username: String::from("horse") };
    println!("{}", t.summarize());
}`,
    tags: ['traits', 'default-method'],
  },
  {
    id: 'rs-ch10-c-019',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Notify With Trait Bound Syntax',
    prompt: `Given a \`Summary\` trait with \`fn summarize(&self) -> String;\` and a type \`Article\` implementing it (returning its \`headline\`), write the \`notify\` function using the GENERIC trait-bound syntax rather than \`impl Trait\`:

    fn notify<T: Summary>(item: &T)

The function should print "New: " followed by the item's summary. In \`main\`, create an \`Article\` with headline "Hello" and call \`notify\`.`,
    hints: [
      'The bound goes in the angle brackets: \`<T: Summary>\`, and the parameter is \`&T\`.',
      'This form is equivalent to \`item: &impl Summary\`.',
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

fn notify<T: Summary>(item: &T) {
    println!("New: {}", item.summarize());
}

fn main() {
    let a = Article { headline: String::from("Hello") };
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

fn notify<T: Summary>(item: &T) {
    // TODO: print "New: " followed by the summary
}

fn main() {
    let a = Article { headline: String::from("Hello") };
    notify(&a);
}`,
    tags: ['traits', 'trait-bounds', 'generics'],
  },
  {
    id: 'rs-ch10-c-020',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Multiple Trait Bounds',
    prompt: `Write a generic function with two trait bounds using the \`+\` syntax:

    fn show<T: std::fmt::Display + Clone>(item: T)

Inside, clone the item into a new binding and print both the original and the clone on one line. In \`main\`, call \`show\` with the string slice "hi" and with the integer 7.`,
    hints: [
      'Combine bounds with \`+\`: \`Display + Clone\`.',
      'Call \`item.clone()\` to make a copy you can also print.',
    ],
    solution: `fn show<T: std::fmt::Display + Clone>(item: T) {
    let copy = item.clone();
    println!("{} {}", item, copy);
}

fn main() {
    show("hi");
    show(7);
}`,
    starter: `fn show<T: std::fmt::Display + Clone>(item: T) {
    // TODO: clone the item and print both the original and the clone
}

fn main() {
    show("hi");
    show(7);
}`,
    tags: ['generics', 'trait-bounds', 'clone'],
  },
  {
    id: 'rs-ch10-c-021',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A where Clause',
    prompt: `Rewrite a function's bounds using a \`where\` clause. Write:

    fn describe<T>(a: T, b: T) -> String
    where
        T: std::fmt::Display + PartialEq,

The function returns "equal" if \`a == b\`, otherwise it returns a string of the form "A vs B" using the two values. In \`main\`, call \`describe(3, 3)\` and \`describe(3, 4)\` and print both results.`,
    hints: [
      'The \`where\` clause goes after the return type and before the function body.',
      'Use \`==\` (needs \`PartialEq\`) and \`format!\` (needs \`Display\`).',
    ],
    solution: `fn describe<T>(a: T, b: T) -> String
where
    T: std::fmt::Display + PartialEq,
{
    if a == b {
        String::from("equal")
    } else {
        format!("{} vs {}", a, b)
    }
}

fn main() {
    println!("{}", describe(3, 3));
    println!("{}", describe(3, 4));
}`,
    starter: `fn describe<T>(a: T, b: T) -> String
where
    T: std::fmt::Display + PartialEq,
{
    // TODO: return "equal" if a == b, otherwise "A vs B"
}

fn main() {
    println!("{}", describe(3, 3));
    println!("{}", describe(3, 4));
}`,
    tags: ['generics', 'where-clause', 'trait-bounds'],
  },
  {
    id: 'rs-ch10-c-022',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Returning impl Trait',
    prompt: `Given a \`Summary\` trait and a \`Tweet\` struct that implements it (where \`summarize\` returns the \`content\` field), write a function:

    fn make_tweet() -> impl Summary

that creates and returns a \`Tweet\` with content "rust is great". In \`main\`, call \`make_tweet\` and print the summary of the returned value.`,
    hints: [
      'The return type \`impl Summary\` means "some type that implements Summary".',
      'You can still call \`summarize()\` on the returned value.',
    ],
    solution: `trait Summary {
    fn summarize(&self) -> String;
}

struct Tweet {
    content: String,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        self.content.clone()
    }
}

fn make_tweet() -> impl Summary {
    Tweet { content: String::from("rust is great") }
}

fn main() {
    let t = make_tweet();
    println!("{}", t.summarize());
}`,
    starter: `trait Summary {
    fn summarize(&self) -> String;
}

struct Tweet {
    content: String,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        self.content.clone()
    }
}

fn make_tweet() -> impl Summary {
    // TODO: build and return a Tweet
}

fn main() {
    let t = make_tweet();
    println!("{}", t.summarize());
}`,
    tags: ['traits', 'impl-trait', 'return'],
  },
  {
    id: 'rs-ch10-c-023',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Generic Method With Display Bound',
    prompt: `Given:

    struct Wrapper<T> {
        value: T,
    }

Write an \`impl<T: std::fmt::Display> Wrapper<T>\` block with a method \`print(&self)\` that prints the wrapped value. The \`Display\` bound on the impl makes printing possible.

In \`main\`, create a \`Wrapper\` around 99 and call \`print\`.`,
    hints: [
      'Put the bound on the impl header: \`impl<T: std::fmt::Display> Wrapper<T>\`.',
      'Inside \`print\`, use \`println!("{}", self.value)\`.',
    ],
    solution: `struct Wrapper<T> {
    value: T,
}

impl<T: std::fmt::Display> Wrapper<T> {
    fn print(&self) {
        println!("{}", self.value);
    }
}

fn main() {
    let w = Wrapper { value: 99 };
    w.print();
}`,
    starter: `struct Wrapper<T> {
    value: T,
}

impl<T: std::fmt::Display> Wrapper<T> {
    // TODO: add print(&self) that prints the wrapped value
}

fn main() {
    let w = Wrapper { value: 99 };
    w.print();
}`,
    tags: ['generics', 'methods', 'trait-bounds'],
  },
  {
    id: 'rs-ch10-c-024',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Concrete Method on Point<f64>',
    prompt: `Given:

    struct Point<T> {
        x: T,
        y: T,
    }

Add an \`impl Point<f64>\` block (a CONCRETE type, not generic) with a method \`distance_from_origin(&self) -> f64\` that returns \`(x*x + y*y).sqrt()\`. This method exists only for \`Point<f64>\`.

In \`main\`, create a \`Point { x: 3.0, y: 4.0 }\` and print the distance (should be 5).`,
    hints: [
      'Write \`impl Point<f64>\` with no type parameter on the impl.',
      'Compute \`(self.x * self.x + self.y * self.y).sqrt()\`.',
    ],
    solution: `struct Point<T> {
    x: T,
    y: T,
}

impl Point<f64> {
    fn distance_from_origin(&self) -> f64 {
        (self.x * self.x + self.y * self.y).sqrt()
    }
}

fn main() {
    let p = Point { x: 3.0, y: 4.0 };
    println!("{}", p.distance_from_origin());
}`,
    starter: `struct Point<T> {
    x: T,
    y: T,
}

impl Point<f64> {
    // TODO: add distance_from_origin(&self) -> f64
}

fn main() {
    let p = Point { x: 3.0, y: 4.0 };
    println!("{}", p.distance_from_origin());
}`,
    tags: ['generics', 'methods', 'concrete-impl'],
  },
  {
    id: 'rs-ch10-c-025',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Conditional Method With Bounds',
    prompt: `Given:

    struct Pair<T> {
        first: T,
        second: T,
    }

Add an \`impl<T: std::fmt::Display + PartialOrd> Pair<T>\` block with a method \`cmp_display(&self)\` that prints "The largest is X" where X is the larger of the two fields (or either if equal). This method only exists when \`T\` is both \`Display\` and \`PartialOrd\`.

In \`main\`, build \`Pair { first: 5, second: 10 }\` and call \`cmp_display\`.`,
    hints: [
      'Both bounds are needed: \`PartialOrd\` to compare, \`Display\` to print.',
      'Use an \`if self.first >= self.second\` to pick which field to print.',
    ],
    solution: `struct Pair<T> {
    first: T,
    second: T,
}

impl<T: std::fmt::Display + PartialOrd> Pair<T> {
    fn cmp_display(&self) {
        if self.first >= self.second {
            println!("The largest is {}", self.first);
        } else {
            println!("The largest is {}", self.second);
        }
    }
}

fn main() {
    let p = Pair { first: 5, second: 10 };
    p.cmp_display();
}`,
    starter: `struct Pair<T> {
    first: T,
    second: T,
}

impl<T: std::fmt::Display + PartialOrd> Pair<T> {
    // TODO: add cmp_display(&self) printing the larger field
}

fn main() {
    let p = Pair { first: 5, second: 10 };
    p.cmp_display();
}`,
    tags: ['generics', 'conditional-impl', 'trait-bounds'],
  },
  {
    id: 'rs-ch10-c-026',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Blanket-Style Trait With Default',
    prompt: `Define a trait \`Describable\` with a default method \`label(&self) -> String\` returning "thing".

Define two unit-like structs \`Apple\` and \`Banana\`. Implement \`Describable\` for \`Apple\` overriding \`label\` to return "apple", and for \`Banana\` using the default (empty impl block).

In \`main\`, print the label of each.`,
    hints: [
      'Only one of the two impls provides its own \`label\` body.',
      'The struct that leaves \`label\` out inherits the default "thing".',
    ],
    solution: `trait Describable {
    fn label(&self) -> String {
        String::from("thing")
    }
}

struct Apple;
struct Banana;

impl Describable for Apple {
    fn label(&self) -> String {
        String::from("apple")
    }
}

impl Describable for Banana {}

fn main() {
    let a = Apple;
    let b = Banana;
    println!("{}", a.label());
    println!("{}", b.label());
}`,
    starter: `trait Describable {
    fn label(&self) -> String {
        String::from("thing")
    }
}

struct Apple;
struct Banana;

// TODO: impl for Apple (override) and Banana (use default)

fn main() {
    let a = Apple;
    let b = Banana;
    println!("{}", a.label());
    println!("{}", b.label());
}`,
    tags: ['traits', 'default-method', 'impl'],
  },
  {
    id: 'rs-ch10-c-027',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Notify Returning a Reference',
    prompt: `Lifetimes appear together with generics. Write a function that takes two string slices and a value that implements \`std::fmt::Display\`, prints the value as an announcement, and returns the longer of the two slices:

    fn longest_with_announcement<'a, T: std::fmt::Display>(
        x: &'a str,
        y: &'a str,
        ann: T,
    ) -> &'a str

In \`main\`, call it with "alpha", "beta", and the announcement 42, then print the returned slice.`,
    hints: [
      'Declare both the lifetime and the type parameter: \`<\'a, T: Display>\`.',
      'Print \`ann\` first, then return the longer slice as in the basic longest function.',
    ],
    solution: `fn longest_with_announcement<'a, T: std::fmt::Display>(
    x: &'a str,
    y: &'a str,
    ann: T,
) -> &'a str {
    println!("Announcement! {}", ann);
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let result = longest_with_announcement("alpha", "beta", 42);
    println!("{}", result);
}`,
    starter: `fn longest_with_announcement<'a, T: std::fmt::Display>(
    x: &'a str,
    y: &'a str,
    ann: T,
) -> &'a str {
    // TODO: print the announcement, then return the longer slice
}

fn main() {
    let result = longest_with_announcement("alpha", "beta", 42);
    println!("{}", result);
}`,
    tags: ['lifetimes', 'generics', 'trait-bounds'],
  },
  {
    id: 'rs-ch10-c-028',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Return the First Argument',
    prompt: `Write a function that takes two string slices but always returns the FIRST one. Since only the first parameter's lifetime relates to the return value, only it needs the named lifetime:

    fn first<'a>(x: &'a str, y: &str) -> &'a str

In \`main\`, call \`first("keep", "drop")\` and print the result (should be "keep").`,
    hints: [
      'Only \`x\` and the return share lifetime \`\'a\`; \`y\` can be a plain \`&str\`.',
      'The body simply returns \`x\`.',
    ],
    solution: `fn first<'a>(x: &'a str, y: &str) -> &'a str {
    let _ = y;
    x
}

fn main() {
    let result = first("keep", "drop");
    println!("{}", result);
}`,
    starter: `fn first<'a>(x: &'a str, y: &str) -> &'a str {
    // TODO: return x (y is unused)
}

fn main() {
    let result = first("keep", "drop");
    println!("{}", result);
}`,
    tags: ['lifetimes', 'functions'],
  },
  {
    id: 'rs-ch10-c-029',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Method on a Struct With a Lifetime',
    prompt: `Given:

    struct Excerpt<'a> {
        part: &'a str,
    }

Add an \`impl<'a> Excerpt<'a>\` block with a method \`announce_and_return_part(&self, announcement: &str) -> &str\` that prints the announcement and returns \`self.part\`. (Thanks to the elision rules, you do not need to annotate the returned lifetime explicitly.)

In \`main\`, build an \`Excerpt\` from the first sentence of a \`String\`, call the method with an announcement, and print what it returns.`,
    hints: [
      'The impl header declares the lifetime: \`impl<\'a> Excerpt<\'a>\`.',
      'By the third elision rule, the return reference is tied to \`&self\`, so a bare \`&str\` works.',
    ],
    solution: `struct Excerpt<'a> {
    part: &'a str,
}

impl<'a> Excerpt<'a> {
    fn announce_and_return_part(&self, announcement: &str) -> &str {
        println!("Attention please: {}", announcement);
        self.part
    }
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().expect("could not find '.'");
    let e = Excerpt { part: first_sentence };
    let p = e.announce_and_return_part("listen up");
    println!("{}", p);
}`,
    starter: `struct Excerpt<'a> {
    part: &'a str,
}

impl<'a> Excerpt<'a> {
    fn announce_and_return_part(&self, announcement: &str) -> &str {
        // TODO: print the announcement and return self.part
    }
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().expect("could not find '.'");
    let e = Excerpt { part: first_sentence };
    let p = e.announce_and_return_part("listen up");
    println!("{}", p);
}`,
    tags: ['lifetimes', 'methods', 'structs'],
  },
  {
    id: 'rs-ch10-c-030',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Apply Elision Rules',
    prompt: `Write the classic first-word function and rely on lifetime elision so you do NOT write any explicit lifetime annotations:

    fn first_word(s: &str) -> &str

It returns the slice of \`s\` up to the first space (or the whole string if there is no space). In \`main\`, call it on "hello world" and print the result (should be "hello").`,
    hints: [
      'With a single input reference, elision assigns the output the same lifetime, so you write no annotations.',
      'Convert with \`s.as_bytes()\`, scan for a space byte, and return \`&s[0..i]\`; otherwise return \`&s[..]\`.',
    ],
    solution: `fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    for (i, &b) in bytes.iter().enumerate() {
        if b == b' ' {
            return &s[0..i];
        }
    }
    &s[..]
}

fn main() {
    let s = String::from("hello world");
    println!("{}", first_word(&s));
}`,
    starter: `fn first_word(s: &str) -> &str {
    // TODO: return the first word slice (no explicit lifetimes needed)
}

fn main() {
    let s = String::from("hello world");
    println!("{}", first_word(&s));
}`,
    tags: ['lifetimes', 'elision', 'slices'],
  },
  {
    id: 'rs-ch10-c-031',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'The Static Lifetime',
    prompt: `String literals have the \`'static\` lifetime because they live for the entire program. Write a function:

    fn motto() -> &'static str

that returns the literal "I keep my promises". In \`main\`, print the result of calling \`motto\`.`,
    hints: [
      'A string literal like "..." is already \`&\'static str\`.',
      'Just return the literal; no allocation is needed.',
    ],
    solution: `fn motto() -> &'static str {
    "I keep my promises"
}

fn main() {
    println!("{}", motto());
}`,
    starter: `fn motto() -> &'static str {
    // TODO: return a static string literal
}

fn main() {
    println!("{}", motto());
}`,
    tags: ['lifetimes', 'static'],
  },
  {
    id: 'rs-ch10-c-032',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Generic Sum Over a Slice',
    prompt: `Write a generic function:

    fn sum_all<T: std::ops::Add<Output = T> + Copy + Default>(list: &[T]) -> T

It returns the sum of all elements. Start the accumulator at \`T::default()\` and add each element. The \`Default\` bound gives a starting zero value, \`Add\` enables \`+\`, and \`Copy\` lets you read elements out of the slice.

In \`main\`, call it on \`[1, 2, 3, 4]\` (integers) and print the total (should be 10).`,
    hints: [
      'Initialize with \`let mut total = T::default();\`.',
      'Loop \`for &x in list\` and do \`total = total + x;\`.',
    ],
    solution: `fn sum_all<T: std::ops::Add<Output = T> + Copy + Default>(list: &[T]) -> T {
    let mut total = T::default();
    for &x in list {
        total = total + x;
    }
    total
}

fn main() {
    let nums = [1, 2, 3, 4];
    println!("{}", sum_all(&nums));
}`,
    starter: `fn sum_all<T: std::ops::Add<Output = T> + Copy + Default>(list: &[T]) -> T {
    // TODO: sum all elements starting from T::default()
}

fn main() {
    let nums = [1, 2, 3, 4];
    println!("{}", sum_all(&nums));
}`,
    tags: ['generics', 'trait-bounds', 'slices'],
  },
  {
    id: 'rs-ch10-c-033',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Trait With a Default and a Required Method',
    prompt: `Define a trait \`Animal\` with:
- a required method \`fn name(&self) -> String;\`
- a default method \`fn introduce(&self) -> String\` returning a sentence like "I am NAME" using \`self.name()\`.

Define structs \`Lion\` and \`Mouse\` (unit-like). Implement \`Animal\` for both, providing \`name\` ("Lion" and "Mouse"). Do NOT override \`introduce\`.

In \`main\`, print \`introduce\` for each animal.`,
    hints: [
      'Only \`name\` differs between the two impls; \`introduce\` is shared via the default.',
      'In the default method, call \`self.name()\` and wrap it with \`format!\`.',
    ],
    solution: `trait Animal {
    fn name(&self) -> String;

    fn introduce(&self) -> String {
        format!("I am {}", self.name())
    }
}

struct Lion;
struct Mouse;

impl Animal for Lion {
    fn name(&self) -> String {
        String::from("Lion")
    }
}

impl Animal for Mouse {
    fn name(&self) -> String {
        String::from("Mouse")
    }
}

fn main() {
    let l = Lion;
    let m = Mouse;
    println!("{}", l.introduce());
    println!("{}", m.introduce());
}`,
    starter: `trait Animal {
    fn name(&self) -> String;

    fn introduce(&self) -> String {
        format!("I am {}", self.name())
    }
}

struct Lion;
struct Mouse;

// TODO: implement Animal for Lion and Mouse, providing only name

fn main() {
    let l = Lion;
    let m = Mouse;
    println!("{}", l.introduce());
    println!("{}", m.introduce());
}`,
    tags: ['traits', 'default-method', 'impl'],
  },
  {
    id: 'rs-ch10-c-034',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Generic Struct Implementing a Trait',
    prompt: `Define a trait \`Summary\` with \`fn summarize(&self) -> String;\`.

Define a generic struct \`Container<T>\` with one field \`item\` of type \`T\`. Implement \`Summary\` for \`Container<T>\` but ONLY when \`T: std::fmt::Display\`, so that \`summarize\` returns "Holding: X" where X is the item.

In \`main\`, create a \`Container\` holding the integer 7 and print its summary.`,
    hints: [
      'The impl header carries the bound: \`impl<T: std::fmt::Display> Summary for Container<T>\`.',
      'Use \`format!("Holding: {}", self.item)\`.',
    ],
    solution: `trait Summary {
    fn summarize(&self) -> String;
}

struct Container<T> {
    item: T,
}

impl<T: std::fmt::Display> Summary for Container<T> {
    fn summarize(&self) -> String {
        format!("Holding: {}", self.item)
    }
}

fn main() {
    let c = Container { item: 7 };
    println!("{}", c.summarize());
}`,
    starter: `trait Summary {
    fn summarize(&self) -> String;
}

struct Container<T> {
    item: T,
}

// TODO: impl Summary for Container<T> where T: Display

fn main() {
    let c = Container { item: 7 };
    println!("{}", c.summarize());
}`,
    tags: ['generics', 'traits', 'trait-bounds'],
  },
  {
    id: 'rs-ch10-c-035',
    chapter: 10,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Generics, Traits, and Lifetimes Together',
    prompt: `Combine all three features in one program.

1. Define a trait \`Label\` with a default method \`label(&self) -> String\` returning "item".
2. Define a generic struct \`Holder<'a, T>\` with a field \`name\` of type \`&'a str\` and a field \`value\` of type \`T\`.
3. Add \`impl<'a, T: std::fmt::Display> Holder<'a, T>\` with a method \`describe(&self) -> String\` returning a string of the form "NAME = VALUE".
4. Implement \`Label\` for \`Holder<'a, T>\` (for any \`'a\` and \`T\`) using the default method (empty impl block).

In \`main\`, create a \`Holder\` whose \`name\` is "score" and \`value\` is 100, then print both \`describe()\` and \`label()\`.`,
    hints: [
      'The struct needs both a lifetime and a type parameter: \`Holder<\'a, T>\`.',
      'The \`describe\` impl needs \`T: Display\`; the \`Label\` impl needs no bound and can be empty.',
      'Build the description with \`format!("{} = {}", self.name, self.value)\`.',
    ],
    solution: `trait Label {
    fn label(&self) -> String {
        String::from("item")
    }
}

struct Holder<'a, T> {
    name: &'a str,
    value: T,
}

impl<'a, T: std::fmt::Display> Holder<'a, T> {
    fn describe(&self) -> String {
        format!("{} = {}", self.name, self.value)
    }
}

impl<'a, T> Label for Holder<'a, T> {}

fn main() {
    let h = Holder { name: "score", value: 100 };
    println!("{}", h.describe());
    println!("{}", h.label());
}`,
    starter: `trait Label {
    fn label(&self) -> String {
        String::from("item")
    }
}

struct Holder<'a, T> {
    name: &'a str,
    value: T,
}

impl<'a, T: std::fmt::Display> Holder<'a, T> {
    fn describe(&self) -> String {
        // TODO: return "NAME = VALUE"
    }
}

// TODO: impl Label for Holder<'a, T> using the default method

fn main() {
    let h = Holder { name: "score", value: 100 };
    println!("{}", h.describe());
    println!("{}", h.label());
}`,
    tags: ['generics', 'traits', 'lifetimes'],
  },
]

export default problems
