import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch19-c-001',
    chapter: 19,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Create Raw Pointers',
    prompt: `Creating raw pointers is safe; only dereferencing them needs unsafe.

In main, make a variable num set to 5. Create an immutable raw pointer r1 of type *const i32 pointing at num using the "as" cast, and a mutable raw pointer r2 of type *mut i32 (you will need a mutable num for that).

You do not need to dereference them here. Just print whether both pointers are non-null using "is_null()" so the program produces some output, e.g. print "pointers created".`,
    hints: [
      'Use let mut num = 5; so you can take a mutable raw pointer.',
      'Cast references: &num as *const i32 and &mut num as *mut i32.',
      'Creating raw pointers does not require an unsafe block.',
    ],
    solution: `fn main() {
    let mut num = 5;

    let r1 = &num as *const i32;
    let r2 = &mut num as *mut i32;

    if !r1.is_null() && !r2.is_null() {
        println!("pointers created");
    }
}`,
    starter: `fn main() {
    let mut num = 5;
    // TODO: create *const i32 and *mut i32 raw pointers to num
}`,
    tags: ['unsafe', 'raw-pointers'],
  },
  {
    id: 'rs-ch19-c-002',
    chapter: 19,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Dereference a Raw Pointer',
    prompt: `Make a variable num set to 42. Create an immutable raw pointer r of type *const i32 to it.

Inside an unsafe block, dereference r and print its value with println!("r is {}", ...). The expected output is:

r is 42`,
    hints: [
      'Dereferencing a raw pointer must happen inside an unsafe { } block.',
      'Use *r to read through the pointer.',
    ],
    solution: `fn main() {
    let num = 42;
    let r = &num as *const i32;

    unsafe {
        println!("r is {}", *r);
    }
}`,
    starter: `fn main() {
    let num = 42;
    let r = &num as *const i32;

    // TODO: dereference r inside an unsafe block and print it
}`,
    tags: ['unsafe', 'raw-pointers'],
  },
  {
    id: 'rs-ch19-c-003',
    chapter: 19,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Write Through a Mutable Raw Pointer',
    prompt: `Make let mut num = 10; and create a mutable raw pointer r of type *mut i32 to it.

Inside an unsafe block, write 20 through the pointer (assign to *r). Then print num. The expected output is:

20`,
    hints: [
      'Take the pointer with &mut num as *mut i32.',
      'Inside unsafe, do *r = 20; to mutate the value.',
    ],
    solution: `fn main() {
    let mut num = 10;
    let r = &mut num as *mut i32;

    unsafe {
        *r = 20;
    }

    println!("{}", num);
}`,
    starter: `fn main() {
    let mut num = 10;
    let r = &mut num as *mut i32;

    // TODO: write 20 through r inside unsafe, then print num
}`,
    tags: ['unsafe', 'raw-pointers'],
  },
  {
    id: 'rs-ch19-c-004',
    chapter: 19,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Call an Unsafe Function',
    prompt: `Define an unsafe function "unsafe fn dangerous()" whose body prints "did something unsafe".

In main, call dangerous() from within an unsafe block.`,
    hints: [
      'Mark the function with the unsafe keyword before fn.',
      'Calling an unsafe function requires an unsafe { } block.',
    ],
    solution: `unsafe fn dangerous() {
    println!("did something unsafe");
}

fn main() {
    unsafe {
        dangerous();
    }
}`,
    starter: `unsafe fn dangerous() {
    // TODO: print a message
}

fn main() {
    // TODO: call dangerous() inside an unsafe block
}`,
    tags: ['unsafe', 'functions'],
  },
  {
    id: 'rs-ch19-c-005',
    chapter: 19,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Read a Mutable Static',
    prompt: `Declare a mutable static counter: "static mut COUNTER: u32 = 0;".

In main, inside an unsafe block, set COUNTER to 7 and then print it with println!("COUNTER: {}", COUNTER). Reading and writing a mutable static is unsafe.

Expected output:

COUNTER: 7`,
    hints: [
      'Use static mut for a mutable global; its type annotation is required.',
      'Any access (read or write) to a static mut must be in an unsafe block.',
    ],
    solution: `static mut COUNTER: u32 = 0;

fn main() {
    unsafe {
        COUNTER = 7;
        println!("COUNTER: {}", COUNTER);
    }
}`,
    starter: `static mut COUNTER: u32 = 0;

fn main() {
    // TODO: inside unsafe, set COUNTER to 7 and print it
}`,
    tags: ['unsafe', 'static'],
  },
  {
    id: 'rs-ch19-c-006',
    chapter: 19,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Simple Type Alias',
    prompt: `Create a type alias "type Kilometers = i32;".

In main, make a variable x of type i32 set to 5 and a variable y of type Kilometers set to 5. Print their sum with println!("x + y = {}", x + y). Because Kilometers is just an alias for i32, they can be added directly.

Expected output:

x + y = 10`,
    hints: [
      'A type alias is written with the type keyword: type Name = Existing;',
      'Aliases are interchangeable with the underlying type.',
    ],
    solution: `type Kilometers = i32;

fn main() {
    let x: i32 = 5;
    let y: Kilometers = 5;
    println!("x + y = {}", x + y);
}`,
    starter: `// TODO: define a Kilometers alias for i32

fn main() {
    let x: i32 = 5;
    // TODO: let y: Kilometers = 5;
    // TODO: print x + y
}`,
    tags: ['type-alias', 'types'],
  },
  {
    id: 'rs-ch19-c-007',
    chapter: 19,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Alias a Long Type',
    prompt: `Long generic types get repetitive. Create a type alias "type Thunk = Box<dyn Fn() + Send + 'static>;".

Then in main, make a variable f of type Thunk that holds a boxed closure printing "hi". Call f(). Expected output:

hi`,
    hints: [
      'Box::new(|| { ... }) creates a boxed closure.',
      'Annotate the binding with the alias: let f: Thunk = ...;',
    ],
    solution: `type Thunk = Box<dyn Fn() + Send + 'static>;

fn main() {
    let f: Thunk = Box::new(|| println!("hi"));
    f();
}`,
    starter: `type Thunk = Box<dyn Fn() + Send + 'static>;

fn main() {
    // TODO: let f: Thunk = Box::new(...);
    // TODO: call f()
}`,
    tags: ['type-alias', 'closures'],
  },
  {
    id: 'rs-ch19-c-008',
    chapter: 19,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Function Pointer Parameter',
    prompt: `Define "fn add_one(x: i32) -> i32" that returns x + 1.

Define "fn do_twice(f: fn(i32) -> i32, arg: i32) -> i32" that returns f(arg) + f(arg).

In main, call do_twice(add_one, 5) and print the result. Expected output:

12`,
    hints: [
      'The parameter type fn(i32) -> i32 is a function pointer type (lowercase fn).',
      'Pass the function by name without parentheses: do_twice(add_one, 5).',
    ],
    solution: `fn add_one(x: i32) -> i32 {
    x + 1
}

fn do_twice(f: fn(i32) -> i32, arg: i32) -> i32 {
    f(arg) + f(arg)
}

fn main() {
    let answer = do_twice(add_one, 5);
    println!("{}", answer);
}`,
    starter: `fn add_one(x: i32) -> i32 {
    x + 1
}

fn do_twice(f: fn(i32) -> i32, arg: i32) -> i32 {
    // TODO
}

fn main() {
    // TODO: call do_twice(add_one, 5) and print it
}`,
    tags: ['function-pointers', 'functions'],
  },
  {
    id: 'rs-ch19-c-009',
    chapter: 19,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Return a Boxed Closure',
    prompt: `A function cannot return a bare closure because its size is unknown, so box it.

Write "fn returns_closure() -> Box<dyn Fn(i32) -> i32>" that returns a boxed closure adding 1 to its argument.

In main, call the returned closure with 4 and print the result. Expected output:

5`,
    hints: [
      'The return type is Box<dyn Fn(i32) -> i32>.',
      'Wrap the closure with Box::new(|x| x + 1).',
    ],
    solution: `fn returns_closure() -> Box<dyn Fn(i32) -> i32> {
    Box::new(|x| x + 1)
}

fn main() {
    let f = returns_closure();
    println!("{}", f(4));
}`,
    starter: `fn returns_closure() -> Box<dyn Fn(i32) -> i32> {
    // TODO: return a boxed closure that adds 1
}

fn main() {
    let f = returns_closure();
    // TODO: print f(4)
}`,
    tags: ['closures', 'boxing'],
  },
  {
    id: 'rs-ch19-c-010',
    chapter: 19,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A One-Line Declarative Macro',
    prompt: `Write a declarative macro with macro_rules! named "say_hi" that takes no arguments and expands to a println!("hi from macro") call.

In main, invoke it as say_hi!(). Expected output:

hi from macro`,
    hints: [
      'Define it with macro_rules! say_hi { () => { ... }; }',
      'The arm with an empty matcher () matches an invocation with no tokens.',
    ],
    solution: `macro_rules! say_hi {
    () => {
        println!("hi from macro");
    };
}

fn main() {
    say_hi!();
}`,
    starter: `macro_rules! say_hi {
    // TODO: one arm matching () that prints a message
}

fn main() {
    say_hi!();
}`,
    tags: ['macros', 'macro-rules'],
  },
  {
    id: 'rs-ch19-c-011',
    chapter: 19,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Macro With One Expression Argument',
    prompt: `Write a macro_rules! macro named "print_it" with one arm that matches a single expression "(\$x:expr)" and expands to println!("value: {}", \$x).

In main, call print_it!(3 + 4). Expected output:

value: 7`,
    hints: [
      'A fragment specifier expr captures an expression.',
      'Refer to the captured fragment inside the expansion using its name.',
    ],
    solution: `macro_rules! print_it {
    ($x:expr) => {
        println!("value: {}", $x);
    };
}

fn main() {
    print_it!(3 + 4);
}`,
    starter: `macro_rules! print_it {
    // TODO: match one expr and print "value: {}"
}

fn main() {
    print_it!(3 + 4);
}`,
    tags: ['macros', 'macro-rules'],
  },
  {
    id: 'rs-ch19-c-012',
    chapter: 19,
    kind: 'coding',
    difficulty: 'intro',
    title: 'The Newtype Wrapper',
    prompt: `The newtype pattern wraps an existing type in a tuple struct.

Define "struct Wrapper(Vec<String>);". In main, create one holding the strings "hello" and "world". Print the inner length using w.0.len() with println!("len = {}", ...). Expected output:

len = 2`,
    hints: [
      'A newtype is a single-field tuple struct: struct Wrapper(Vec<String>);',
      'Access the inner value with .0',
    ],
    solution: `struct Wrapper(Vec<String>);

fn main() {
    let w = Wrapper(vec![String::from("hello"), String::from("world")]);
    println!("len = {}", w.0.len());
}`,
    starter: `struct Wrapper(Vec<String>);

fn main() {
    let w = Wrapper(vec![String::from("hello"), String::from("world")]);
    // TODO: print the length of the inner Vec
}`,
    tags: ['newtype', 'structs'],
  },
  {
    id: 'rs-ch19-c-013',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Safe Abstraction Over an Unsafe Block',
    prompt: `Wrap unsafe code in a safe function.

Write "fn read_at(ptr: *const i32) -> i32" whose body uses an unsafe block to dereference ptr and return its value. The function itself is safe to call.

In main, make num = 99, take a *const i32 to it, call read_at, and print the result. Expected output:

99`,
    hints: [
      'The unsafe block lives inside the function body; the function signature stays safe.',
      'Return the dereferenced value: unsafe { *ptr }',
    ],
    solution: `fn read_at(ptr: *const i32) -> i32 {
    unsafe { *ptr }
}

fn main() {
    let num = 99;
    let p = &num as *const i32;
    println!("{}", read_at(p));
}`,
    starter: `fn read_at(ptr: *const i32) -> i32 {
    // TODO: dereference ptr inside an unsafe block and return it
}

fn main() {
    let num = 99;
    let p = &num as *const i32;
    println!("{}", read_at(p));
}`,
    tags: ['unsafe', 'abstraction'],
  },
  {
    id: 'rs-ch19-c-014',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Operator Overloading With Add',
    prompt: `Implement the Add trait so two Point values can be combined with the + operator.

Define a struct Point with i32 fields x and y, and derive Debug and PartialEq. Implement std::ops::Add for Point so that adding two points adds their fields componentwise.

In main, assert that Point { x: 1, y: 0 } + Point { x: 2, y: 3 } equals Point { x: 3, y: 3 }, then print "ok".`,
    hints: [
      'Bring the trait into scope with use std::ops::Add;',
      'The trait has an associated type Output; set type Output = Point;',
      'Implement fn add(self, other: Point) -> Point.',
    ],
    solution: `use std::ops::Add;

#[derive(Debug, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}

impl Add for Point {
    type Output = Point;

    fn add(self, other: Point) -> Point {
        Point {
            x: self.x + other.x,
            y: self.y + other.y,
        }
    }
}

fn main() {
    assert_eq!(
        Point { x: 1, y: 0 } + Point { x: 2, y: 3 },
        Point { x: 3, y: 3 }
    );
    println!("ok");
}`,
    starter: `use std::ops::Add;

#[derive(Debug, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}

impl Add for Point {
    type Output = Point;

    fn add(self, other: Point) -> Point {
        // TODO: add fields componentwise
    }
}

fn main() {
    assert_eq!(
        Point { x: 1, y: 0 } + Point { x: 2, y: 3 },
        Point { x: 3, y: 3 }
    );
    println!("ok");
}`,
    tags: ['operator-overloading', 'traits', 'add'],
  },
  {
    id: 'rs-ch19-c-015',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Associated Type in a Trait',
    prompt: `Define a trait Container with an associated type Item and a method "fn get(&self, i: usize) -> Self::Item".

Implement Container for a struct "struct Numbers(Vec<i32>)" with Item = i32 so get returns the element at index i (return a copy).

In main, create Numbers(vec![10, 20, 30]) and print c.get(1). Expected output:

20`,
    hints: [
      'Declare the associated type in the trait with: type Item;',
      'In the impl, set the concrete type: type Item = i32;',
      'Self::Item refers to that associated type.',
    ],
    solution: `trait Container {
    type Item;
    fn get(&self, i: usize) -> Self::Item;
}

struct Numbers(Vec<i32>);

impl Container for Numbers {
    type Item = i32;

    fn get(&self, i: usize) -> i32 {
        self.0[i]
    }
}

fn main() {
    let c = Numbers(vec![10, 20, 30]);
    println!("{}", c.get(1));
}`,
    starter: `trait Container {
    type Item;
    fn get(&self, i: usize) -> Self::Item;
}

struct Numbers(Vec<i32>);

impl Container for Numbers {
    // TODO: set Item = i32 and implement get
}

fn main() {
    let c = Numbers(vec![10, 20, 30]);
    println!("{}", c.get(1));
}`,
    tags: ['associated-types', 'traits'],
  },
  {
    id: 'rs-ch19-c-016',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Add Two Different Types',
    prompt: `The Add trait has a default generic parameter Rhs that you can override to add different types.

Define struct Millimeters(u32) and struct Meters(u32). Implement "Add<Meters> for Millimeters" with Output = Millimeters so a millimeter plus a meter yields millimeters (1 meter = 1000 millimeters).

In main, compute Millimeters(50) + Meters(2) and print the inner value with println!("{}", result.0). Expected output:

2050`,
    hints: [
      'Write the impl header as impl Add<Meters> for Millimeters.',
      'Multiply the Meters value by 1000 before adding.',
      'Access tuple-struct fields with .0',
    ],
    solution: `use std::ops::Add;

struct Millimeters(u32);
struct Meters(u32);

impl Add<Meters> for Millimeters {
    type Output = Millimeters;

    fn add(self, other: Meters) -> Millimeters {
        Millimeters(self.0 + (other.0 * 1000))
    }
}

fn main() {
    let result = Millimeters(50) + Meters(2);
    println!("{}", result.0);
}`,
    starter: `use std::ops::Add;

struct Millimeters(u32);
struct Meters(u32);

impl Add<Meters> for Millimeters {
    type Output = Millimeters;

    fn add(self, other: Meters) -> Millimeters {
        // TODO: combine, converting meters to millimeters
    }
}

fn main() {
    let result = Millimeters(50) + Meters(2);
    println!("{}", result.0);
}`,
    tags: ['operator-overloading', 'add', 'generics'],
  },
  {
    id: 'rs-ch19-c-017',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Fully Qualified Method Disambiguation',
    prompt: `Two traits define a method with the same name "fly". A type implements both.

Define traits Pilot and Wizard, each with "fn fly(&self)". Define "struct Human;" implementing both: Pilot::fly prints "This is your captain speaking." and Wizard::fly prints "Up!".

In main, on a Human value, call the Pilot version and then the Wizard version using fully qualified trait syntax. Expected output:

This is your captain speaking.
Up!`,
    hints: [
      'Disambiguate with Pilot::fly(&person) and Wizard::fly(&person).',
      'You may also call person.fly() but that picks an inherent method if one exists; here use the trait names.',
    ],
    solution: `trait Pilot {
    fn fly(&self);
}

trait Wizard {
    fn fly(&self);
}

struct Human;

impl Pilot for Human {
    fn fly(&self) {
        println!("This is your captain speaking.");
    }
}

impl Wizard for Human {
    fn fly(&self) {
        println!("Up!");
    }
}

fn main() {
    let person = Human;
    Pilot::fly(&person);
    Wizard::fly(&person);
}`,
    starter: `trait Pilot {
    fn fly(&self);
}

trait Wizard {
    fn fly(&self);
}

struct Human;

impl Pilot for Human {
    fn fly(&self) {
        println!("This is your captain speaking.");
    }
}

impl Wizard for Human {
    fn fly(&self) {
        println!("Up!");
    }
}

fn main() {
    let person = Human;
    // TODO: call the Pilot version, then the Wizard version
}`,
    tags: ['traits', 'fully-qualified-syntax'],
  },
  {
    id: 'rs-ch19-c-018',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Fully Qualified Associated Function',
    prompt: `When a trait and an inherent impl both define an associated function with no self, you must use fully qualified syntax to pick the trait version.

Define "struct Dog;". Give it an inherent function "fn baby_name() -> String" returning "Spot". Define trait Animal with "fn baby_name() -> String" and implement it for Dog returning "puppy".

In main, print the inherent name, then print the Animal trait name using "<Dog as Animal>::baby_name()". Expected output:

Spot
puppy`,
    hints: [
      'Dog::baby_name() calls the inherent function.',
      'Use <Type as Trait>::function() to select the trait function when there is no receiver.',
    ],
    solution: `struct Dog;

impl Dog {
    fn baby_name() -> String {
        String::from("Spot")
    }
}

trait Animal {
    fn baby_name() -> String;
}

impl Animal for Dog {
    fn baby_name() -> String {
        String::from("puppy")
    }
}

fn main() {
    println!("{}", Dog::baby_name());
    println!("{}", <Dog as Animal>::baby_name());
}`,
    starter: `struct Dog;

impl Dog {
    fn baby_name() -> String {
        String::from("Spot")
    }
}

trait Animal {
    fn baby_name() -> String;
}

impl Animal for Dog {
    fn baby_name() -> String {
        String::from("puppy")
    }
}

fn main() {
    println!("{}", Dog::baby_name());
    // TODO: print the Animal trait version using fully qualified syntax
}`,
    tags: ['traits', 'fully-qualified-syntax'],
  },
  {
    id: 'rs-ch19-c-019',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Supertrait Requirement',
    prompt: `A supertrait lets one trait depend on another.

Define trait "OutlinePrint: std::fmt::Display" with a method "fn outline_print(&self)" that prints the value (via to_string) surrounded by asterisks, like:

*****
* 5 *
*****

Implement Display and OutlinePrint for "struct Point { x: i32, y: i32 }" where Display formats as "(x, y)". In main, call outline_print on Point { x: 1, y: 3 }.

Expected output:

********
* (1, 3) *
********`,
    hints: [
      'Declare the supertrait bound on the trait: trait OutlinePrint: fmt::Display.',
      'Inside outline_print you can call self.to_string() because Display is guaranteed.',
      'Build the border length from the formatted string length.',
    ],
    solution: `use std::fmt;

trait OutlinePrint: fmt::Display {
    fn outline_print(&self) {
        let output = self.to_string();
        let len = output.len();
        println!("{}", "*".repeat(len + 4));
        println!("* {} *", output);
        println!("{}", "*".repeat(len + 4));
    }
}

struct Point {
    x: i32,
    y: i32,
}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

impl OutlinePrint for Point {}

fn main() {
    let p = Point { x: 1, y: 3 };
    p.outline_print();
}`,
    starter: `use std::fmt;

trait OutlinePrint: fmt::Display {
    fn outline_print(&self) {
        // TODO: print the value surrounded by a border of asterisks
    }
}

struct Point {
    x: i32,
    y: i32,
}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

impl OutlinePrint for Point {}

fn main() {
    let p = Point { x: 1, y: 3 };
    p.outline_print();
}`,
    tags: ['traits', 'supertraits'],
  },
  {
    id: 'rs-ch19-c-020',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Newtype to Implement Display',
    prompt: `The orphan rule forbids implementing an external trait on an external type. Use the newtype pattern to get around it.

Define "struct Wrapper(Vec<String>);" and implement std::fmt::Display for Wrapper so it prints the inner strings joined by ", " inside square brackets.

In main, create Wrapper(vec!["hello".to_string(), "world".to_string()]) and print it. Expected output:

[hello, world]`,
    hints: [
      'Implement Display for the local Wrapper, not for Vec<String> directly.',
      'self.0.join(", ") produces the comma-separated body.',
    ],
    solution: `use std::fmt;

struct Wrapper(Vec<String>);

impl fmt::Display for Wrapper {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "[{}]", self.0.join(", "))
    }
}

fn main() {
    let w = Wrapper(vec![String::from("hello"), String::from("world")]);
    println!("{}", w);
}`,
    starter: `use std::fmt;

struct Wrapper(Vec<String>);

impl fmt::Display for Wrapper {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        // TODO: write the inner strings joined by ", " inside [ ]
    }
}

fn main() {
    let w = Wrapper(vec![String::from("hello"), String::from("world")]);
    println!("{}", w);
}`,
    tags: ['newtype', 'traits', 'display'],
  },
  {
    id: 'rs-ch19-c-021',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'The Never Type in a Match Arm',
    prompt: `The never type "!" lets expressions like continue and panic! work in match arms that otherwise must produce a value.

Write a function "fn first_digit(s: &str) -> u32" that loops over the characters of s and returns the first one parsed as a digit. For each character, match c.to_digit(10): Some(n) returns n, None uses continue (whose type is !). If no digit is found, return 0 after the loop.

In main, print first_digit("ab3c") and first_digit("xyz"). Expected output:

3
0`,
    hints: [
      'continue has type ! so it unifies with the u32 from the Some arm.',
      'to_digit(10) returns Option<u32>.',
      'Return 0 after the loop if nothing matched.',
    ],
    solution: `fn first_digit(s: &str) -> u32 {
    for c in s.chars() {
        let n = match c.to_digit(10) {
            Some(n) => n,
            None => continue,
        };
        return n;
    }
    0
}

fn main() {
    println!("{}", first_digit("ab3c"));
    println!("{}", first_digit("xyz"));
}`,
    starter: `fn first_digit(s: &str) -> u32 {
    for c in s.chars() {
        let n = match c.to_digit(10) {
            Some(n) => n,
            None => continue,
        };
        return n;
    }
    0
}

fn main() {
    println!("{}", first_digit("ab3c"));
    println!("{}", first_digit("xyz"));
}`,
    tags: ['never-type', 'control-flow'],
  },
  {
    id: 'rs-ch19-c-022',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Function That Never Returns',
    prompt: `A function whose return type is the never type "!" never returns normally.

Write "fn bail(msg: &str) -> !" that calls panic! with the given message.

In main, call bail only inside an if branch that is never taken (e.g. if false), and otherwise print "did not bail". Expected output:

did not bail`,
    hints: [
      'The return type ! means the function diverges; panic! satisfies it.',
      'Guard the call so it does not actually run, e.g. if false { bail("..."); }',
    ],
    solution: `fn bail(msg: &str) -> ! {
    panic!("{}", msg);
}

fn main() {
    if false {
        bail("should not happen");
    }
    println!("did not bail");
}`,
    starter: `fn bail(msg: &str) -> ! {
    // TODO: panic with msg
}

fn main() {
    if false {
        bail("should not happen");
    }
    println!("did not bail");
}`,
    tags: ['never-type', 'panic'],
  },
  {
    id: 'rs-ch19-c-023',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Map With a Function Pointer',
    prompt: `Both closures and function pointers can be passed where an Fn argument is expected.

Define "fn to_string(i: i32) -> String" returning i.to_string(). In main, map the function pointer to_string over the numbers 1, 2, 3 to build a Vec<String>, then print it with debug formatting.

Expected output:

["1", "2", "3"]`,
    hints: [
      'Pass the function name directly to map: .map(to_string).',
      'Collect into Vec<String> and print with {:?}.',
    ],
    solution: `fn to_string(i: i32) -> String {
    i.to_string()
}

fn main() {
    let list = vec![1, 2, 3];
    let strings: Vec<String> = list.iter().copied().map(to_string).collect();
    println!("{:?}", strings);
}`,
    starter: `fn to_string(i: i32) -> String {
    i.to_string()
}

fn main() {
    let list = vec![1, 2, 3];
    // TODO: map the to_string function pointer over the list and collect
}`,
    tags: ['function-pointers', 'iterators'],
  },
  {
    id: 'rs-ch19-c-024',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Use an Enum Variant as a Constructor',
    prompt: `Tuple-struct and tuple-enum-variant initializers are also function pointers, so they can be passed to map.

Define "enum Status { Active(u32) }". In main, map the variant constructor Status::Active over the numbers 1, 2, 3 to build a Vec<Status>. Then print the count of items using println!("count = {}", list.len()).

Expected output:

count = 3`,
    hints: [
      'Status::Active can be used like a function of type fn(u32) -> Status.',
      'Pass it directly to map: .map(Status::Active).',
    ],
    solution: `enum Status {
    Active(u32),
}

fn main() {
    let list: Vec<Status> = (1u32..=3).map(Status::Active).collect();
    println!("count = {}", list.len());
}`,
    starter: `enum Status {
    Active(u32),
}

fn main() {
    // TODO: map Status::Active over 1..=3 and collect into Vec<Status>
    // TODO: print the count
}`,
    tags: ['function-pointers', 'enums'],
  },
  {
    id: 'rs-ch19-c-025',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Choose Between fn and Boxed Closure',
    prompt: `Write a function "fn make_adder(captured: i32) -> Box<dyn Fn(i32) -> i32>" that returns a boxed closure adding captured to its argument.

In main, create an adder that adds 10, call it with 5, and print the result. Expected output:

15`,
    hints: [
      'The closure captures the parameter captured from the environment.',
      'Box the closure: Box::new(move |x| x + captured).',
    ],
    solution: `fn make_adder(captured: i32) -> Box<dyn Fn(i32) -> i32> {
    Box::new(move |x| x + captured)
}

fn main() {
    let add_ten = make_adder(10);
    println!("{}", add_ten(5));
}`,
    starter: `fn make_adder(captured: i32) -> Box<dyn Fn(i32) -> i32> {
    // TODO: return a boxed closure capturing captured
}

fn main() {
    let add_ten = make_adder(10);
    println!("{}", add_ten(5));
}`,
    tags: ['closures', 'boxing'],
  },
  {
    id: 'rs-ch19-c-026',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Macro With Repetition',
    prompt: `Write a macro_rules! macro named "my_vec" that mimics vec!. It takes a comma-separated list of expressions and builds a Vec by pushing each one.

Use the repetition matcher "(\$( \$x:expr ),* )" and expand each captured element into a temp_vec.push(\$x) statement inside a block that returns temp_vec.

In main, build my_vec![1, 2, 3] and print it with {:?}. Expected output:

[1, 2, 3]`,
    hints: [
      'The matcher $( $x:expr ),* captures zero or more comma-separated expressions.',
      'In the body, $( temp_vec.push($x); )* repeats the push for each captured item.',
      'Wrap the expansion in a block { let mut temp_vec = Vec::new(); ... temp_vec }.',
    ],
    solution: `macro_rules! my_vec {
    ( $( $x:expr ),* ) => {
        {
            let mut temp_vec = Vec::new();
            $(
                temp_vec.push($x);
            )*
            temp_vec
        }
    };
}

fn main() {
    let v = my_vec![1, 2, 3];
    println!("{:?}", v);
}`,
    starter: `macro_rules! my_vec {
    ( $( $x:expr ),* ) => {
        {
            let mut temp_vec = Vec::new();
            // TODO: repeat a push for each captured element
            temp_vec
        }
    };
}

fn main() {
    let v = my_vec![1, 2, 3];
    println!("{:?}", v);
}`,
    tags: ['macros', 'macro-rules', 'repetition'],
  },
  {
    id: 'rs-ch19-c-027',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Macro With Multiple Arms',
    prompt: `Write a macro_rules! macro named "greet" with two arms:
- An empty arm "()" prints "Hello!".
- An arm "(\$name:expr)" prints "Hello, NAME!" using the captured expression.

In main, call greet!() and greet!("Sam"). Expected output:

Hello!
Hello, Sam!`,
    hints: [
      'Separate the two arms with a semicolon inside the macro body.',
      'Match no tokens with () and a single expression with ($name:expr).',
    ],
    solution: `macro_rules! greet {
    () => {
        println!("Hello!");
    };
    ($name:expr) => {
        println!("Hello, {}!", $name);
    };
}

fn main() {
    greet!();
    greet!("Sam");
}`,
    starter: `macro_rules! greet {
    () => {
        // TODO: print "Hello!"
    };
    ($name:expr) => {
        // TODO: print "Hello, NAME!"
    };
}

fn main() {
    greet!();
    greet!("Sam");
}`,
    tags: ['macros', 'macro-rules'],
  },
  {
    id: 'rs-ch19-c-028',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Newtype With Deref-Like Access',
    prompt: `Use a newtype to add behavior to an existing type while exposing the inner value through a method.

Define "struct Meters(f64);". Add an inherent impl with "fn value(&self) -> f64" returning the inner number and "fn to_feet(&self) -> f64" returning the inner value times 3.28084.

In main, create Meters(2.0) and print value() and to_feet(). Expected output:

2
6.56168`,
    hints: [
      'Access the wrapped value via self.0 inside the methods.',
      'Printing 2.0 with {} shows 2; printing the product shows 6.56168.',
    ],
    solution: `struct Meters(f64);

impl Meters {
    fn value(&self) -> f64 {
        self.0
    }

    fn to_feet(&self) -> f64 {
        self.0 * 3.28084
    }
}

fn main() {
    let m = Meters(2.0);
    println!("{}", m.value());
    println!("{}", m.to_feet());
}`,
    starter: `struct Meters(f64);

impl Meters {
    fn value(&self) -> f64 {
        // TODO
    }

    fn to_feet(&self) -> f64 {
        // TODO
    }
}

fn main() {
    let m = Meters(2.0);
    println!("{}", m.value());
    println!("{}", m.to_feet());
}`,
    tags: ['newtype', 'structs'],
  },
  {
    id: 'rs-ch19-c-029',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Default Generic Method Argument via Trait',
    prompt: `Implement Add twice for one type, once with the default Rhs (itself) and once with a different Rhs.

Define struct Point { x: i32, y: i32 } deriving Debug and PartialEq. Implement "Add for Point" (componentwise) and "Add<i32> for Point" (adds the i32 to both fields).

In main, assert Point { x: 1, y: 2 } + Point { x: 3, y: 4 } == Point { x: 4, y: 6 } and Point { x: 1, y: 2 } + 10 == Point { x: 11, y: 12 }, then print "ok".`,
    hints: [
      'Add (no type argument) uses the default Rhs = Self.',
      'Add<i32> overrides the right-hand side type to i32.',
      'Both impls set type Output = Point.',
    ],
    solution: `use std::ops::Add;

#[derive(Debug, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}

impl Add for Point {
    type Output = Point;
    fn add(self, other: Point) -> Point {
        Point {
            x: self.x + other.x,
            y: self.y + other.y,
        }
    }
}

impl Add<i32> for Point {
    type Output = Point;
    fn add(self, n: i32) -> Point {
        Point {
            x: self.x + n,
            y: self.y + n,
        }
    }
}

fn main() {
    assert_eq!(
        Point { x: 1, y: 2 } + Point { x: 3, y: 4 },
        Point { x: 4, y: 6 }
    );
    assert_eq!(Point { x: 1, y: 2 } + 10, Point { x: 11, y: 12 });
    println!("ok");
}`,
    starter: `use std::ops::Add;

#[derive(Debug, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}

impl Add for Point {
    type Output = Point;
    fn add(self, other: Point) -> Point {
        // TODO: componentwise add
    }
}

impl Add<i32> for Point {
    type Output = Point;
    fn add(self, n: i32) -> Point {
        // TODO: add n to both fields
    }
}

fn main() {
    assert_eq!(
        Point { x: 1, y: 2 } + Point { x: 3, y: 4 },
        Point { x: 4, y: 6 }
    );
    assert_eq!(Point { x: 1, y: 2 } + 10, Point { x: 11, y: 12 });
    println!("ok");
}`,
    tags: ['operator-overloading', 'add', 'generics'],
  },
  {
    id: 'rs-ch19-c-030',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Safe split_at_mut Style Abstraction',
    prompt: `Build a safe function over unsafe code that returns two non-overlapping mutable halves of a slice.

Write "fn split_first<'a>(values: &'a mut [i32]) -> (&'a mut i32, &'a mut [i32])". The first element and the rest borrow the same slice, which the borrow checker rejects with safe code, so use an unsafe block with raw pointers (slice::from_raw_parts_mut and pointer arithmetic with add).

In main, make let mut v = [1, 2, 3]; call split_first, set the first element to 99 through the returned mutable reference, then print v with {:?}. Expected output:

[99, 2, 3]`,
    hints: [
      'Get a raw pointer with values.as_mut_ptr() and the length with values.len().',
      'Inside unsafe, use &mut *ptr for the first element and slice::from_raw_parts_mut(ptr.add(1), len - 1) for the rest.',
      'The unsafe block is wrapped by a safe function signature.',
    ],
    solution: `use std::slice;

fn split_first<'a>(values: &'a mut [i32]) -> (&'a mut i32, &'a mut [i32]) {
    let len = values.len();
    let ptr = values.as_mut_ptr();

    unsafe {
        (
            &mut *ptr,
            slice::from_raw_parts_mut(ptr.add(1), len - 1),
        )
    }
}

fn main() {
    let mut v = [1, 2, 3];
    let (first, _rest) = split_first(&mut v);
    *first = 99;
    println!("{:?}", v);
}`,
    starter: `use std::slice;

fn split_first<'a>(values: &'a mut [i32]) -> (&'a mut i32, &'a mut [i32]) {
    let len = values.len();
    let ptr = values.as_mut_ptr();

    unsafe {
        // TODO: return (&mut first element, &mut rest of slice)
    }
}

fn main() {
    let mut v = [1, 2, 3];
    let (first, _rest) = split_first(&mut v);
    *first = 99;
    println!("{:?}", v);
}`,
    tags: ['unsafe', 'slices', 'abstraction'],
  },
  {
    id: 'rs-ch19-c-031',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Call an External C Function',
    prompt: `Use an extern block to call the C standard library function abs.

Declare "extern \\"C\\" { fn abs(input: i32) -> i32; }". In main, inside an unsafe block, call abs(-3) and print it with println!("abs(-3) = {}", ...). Calling an extern function is always unsafe.

Expected output:

abs(-3) = 3`,
    hints: [
      'Declare the foreign function inside an extern "C" block.',
      'Calls to extern functions must be wrapped in unsafe.',
    ],
    solution: `extern "C" {
    fn abs(input: i32) -> i32;
}

fn main() {
    unsafe {
        println!("abs(-3) = {}", abs(-3));
    }
}`,
    starter: `extern "C" {
    fn abs(input: i32) -> i32;
}

fn main() {
    // TODO: call abs(-3) inside an unsafe block and print it
}`,
    tags: ['unsafe', 'ffi', 'extern'],
  },
  {
    id: 'rs-ch19-c-032',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Expose a Rust Function to C',
    prompt: `Make a Rust function callable from C using extern and no_mangle.

Write a function annotated with "#[no_mangle]" and "pub extern \\"C\\" fn call_from_c()" that prints "Just called a Rust function from C!".

In main (still Rust), call call_from_c() normally and confirm it compiles and runs. Expected output:

Just called a Rust function from C!`,
    hints: [
      'Add #[no_mangle] above the function so the symbol name is preserved.',
      'Mark it pub extern "C" so it uses the C ABI.',
      'It is a normal safe function to call from Rust here.',
    ],
    solution: `#[no_mangle]
pub extern "C" fn call_from_c() {
    println!("Just called a Rust function from C!");
}

fn main() {
    call_from_c();
}`,
    starter: `#[no_mangle]
pub extern "C" fn call_from_c() {
    // TODO: print the message
}

fn main() {
    call_from_c();
}`,
    tags: ['ffi', 'extern', 'no-mangle'],
  },
  {
    id: 'rs-ch19-c-033',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Sized Bound on a Generic Function',
    prompt: `By default generic type parameters are implicitly Sized. You can relax that with "?Sized" so the function accepts dynamically sized types behind a reference.

Write a function "fn show<T: std::fmt::Display + ?Sized>(t: &T)" that prints t.

In main, call show with a string slice "&str is unsized": call show("hi") and show(&5). Expected output:

hi
5`,
    hints: [
      'The bound ?Sized opts out of the implicit Sized requirement.',
      'A ?Sized type can only be used behind a pointer like &T.',
    ],
    solution: `use std::fmt::Display;

fn show<T: Display + ?Sized>(t: &T) {
    println!("{}", t);
}

fn main() {
    show("hi");
    show(&5);
}`,
    starter: `use std::fmt::Display;

fn show<T: Display + ?Sized>(t: &T) {
    // TODO: print t
}

fn main() {
    show("hi");
    show(&5);
}`,
    tags: ['sized', 'generics', 'dst'],
  },
  {
    id: 'rs-ch19-c-034',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Mutable Static Counter Function',
    prompt: `Combine a mutable static with a safe-looking helper that internally uses unsafe.

Declare "static mut COUNTER: u32 = 0;". Write "fn add_to_count(inc: u32)" that, inside an unsafe block, adds inc to COUNTER.

In main, call add_to_count(3), then inside an unsafe block print COUNTER. Expected output:

COUNTER: 3`,
    hints: [
      'All reads and writes of COUNTER must be inside unsafe blocks.',
      'add_to_count hides the unsafe access in its body.',
    ],
    solution: `static mut COUNTER: u32 = 0;

fn add_to_count(inc: u32) {
    unsafe {
        COUNTER += inc;
    }
}

fn main() {
    add_to_count(3);

    unsafe {
        println!("COUNTER: {}", COUNTER);
    }
}`,
    starter: `static mut COUNTER: u32 = 0;

fn add_to_count(inc: u32) {
    // TODO: add inc to COUNTER inside unsafe
}

fn main() {
    add_to_count(3);

    unsafe {
        println!("COUNTER: {}", COUNTER);
    }
}`,
    tags: ['unsafe', 'static'],
  },
  {
    id: 'rs-ch19-c-035',
    chapter: 19,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Generic Add for a Wrapper Type',
    prompt: `Implement Add generically so a wrapper works for any inner type that itself supports Add.

Define "struct Pair<T>(T, T);" deriving Debug and PartialEq. Implement "Add for Pair<T>" where T: Add<Output = T> + Copy, adding the two pairs componentwise. Set Output = Pair<T>.

In main, assert Pair(1, 2) + Pair(3, 4) == Pair(4, 6) and print "ok".`,
    hints: [
      'Constrain the inner type: impl<T: Add<Output = T> + Copy> Add for Pair<T>.',
      'Add the fields: Pair(self.0 + other.0, self.1 + other.1).',
      'Copy lets you use the fields without moving them out of self.',
    ],
    solution: `use std::ops::Add;

#[derive(Debug, PartialEq)]
struct Pair<T>(T, T);

impl<T: Add<Output = T> + Copy> Add for Pair<T> {
    type Output = Pair<T>;

    fn add(self, other: Pair<T>) -> Pair<T> {
        Pair(self.0 + other.0, self.1 + other.1)
    }
}

fn main() {
    assert_eq!(Pair(1, 2) + Pair(3, 4), Pair(4, 6));
    println!("ok");
}`,
    starter: `use std::ops::Add;

#[derive(Debug, PartialEq)]
struct Pair<T>(T, T);

impl<T: Add<Output = T> + Copy> Add for Pair<T> {
    type Output = Pair<T>;

    fn add(self, other: Pair<T>) -> Pair<T> {
        // TODO: add componentwise
    }
}

fn main() {
    assert_eq!(Pair(1, 2) + Pair(3, 4), Pair(4, 6));
    println!("ok");
}`,
    tags: ['operator-overloading', 'add', 'generics'],
  },
]

export default problems
