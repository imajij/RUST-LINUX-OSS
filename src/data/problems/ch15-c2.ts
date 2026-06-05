import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch15-c-036',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Box a Value on the Heap',
    prompt: `Use Box to store a single i32 on the heap. Create a Box that holds the value 5, then print it. Expected output:
b = 5`,
    hints: [
      'Box::new(5) allocates the 5 on the heap.',
      'You can print a Box<i32> directly with {} because it derefs to i32 for Display.',
    ],
    solution: `fn main() {
    let b = Box::new(5);
    println!("b = {}", b);
}`,
    starter: `fn main() {
    // TODO: put 5 in a Box on the heap, then print it as "b = 5"
}`,
    tags: ['box', 'heap'],
  },
  {
    id: 'rs-ch15-c-037',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Box a Large Array',
    prompt: `Allocate an array of 1000 i64 values, all set to 7, on the heap using Box. Print the sum of the array. Expected output:
sum = 7000`,
    hints: [
      'Box::new([7i64; 1000]) moves the whole array onto the heap.',
      'Call .iter().sum() on the boxed array; it derefs to the slice/array.',
    ],
    solution: `fn main() {
    let data = Box::new([7i64; 1000]);
    let sum: i64 = data.iter().sum();
    println!("sum = {}", sum);
}`,
    starter: `fn main() {
    // TODO: box an array [7i64; 1000] and print its sum as "sum = 7000"
}`,
    tags: ['box', 'heap', 'arrays'],
  },
  {
    id: 'rs-ch15-c-038',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Recursive Cons List',
    prompt: `Define a recursive cons list enum:
enum List {
    Cons(i32, Box<List>),
    Nil,
}
Box is required so the type has a known size. Build the list 1, 2, 3 and print it with the derived Debug formatting. Expected output:
Cons(1, Cons(2, Cons(3, Nil)))`,
    hints: [
      'Without Box the recursive variant would have infinite size.',
      'Use the variants directly with use List::{Cons, Nil}; in main.',
      'Derive Debug and print with {:?}.',
    ],
    solution: `#[derive(Debug)]
enum List {
    Cons(i32, Box<List>),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    let list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));
    println!("{:?}", list);
}`,
    starter: `#[derive(Debug)]
enum List {
    // TODO: Cons(i32, Box<List>) and Nil
}

fn main() {
    // TODO: build 1, 2, 3 and print with {:?}
}`,
    tags: ['box', 'recursive', 'enum'],
  },
  {
    id: 'rs-ch15-c-039',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sum a Cons List',
    prompt: `Using the cons list
enum List {
    Cons(i32, Box<List>),
    Nil,
}
write a function fn sum(list: &List) -> i32 that recursively adds all the i32 values. Build the list 10, 20, 30 and print the total. Expected output:
total = 60`,
    hints: [
      'Match on the list: Cons(value, rest) adds value to sum(rest).',
      'The Nil arm returns 0.',
      'In Cons(v, rest), rest has type &Box<List>; you can pass it where &List is expected thanks to deref coercion.',
    ],
    solution: `enum List {
    Cons(i32, Box<List>),
    Nil,
}

use List::{Cons, Nil};

fn sum(list: &List) -> i32 {
    match list {
        Cons(value, rest) => value + sum(rest),
        Nil => 0,
    }
}

fn main() {
    let list = Cons(10, Box::new(Cons(20, Box::new(Cons(30, Box::new(Nil))))));
    println!("total = {}", sum(&list));
}`,
    starter: `enum List {
    Cons(i32, Box<List>),
    Nil,
}

use List::{Cons, Nil};

fn sum(list: &List) -> i32 {
    // TODO: recursively sum the values
    todo!()
}

fn main() {
    let list = Cons(10, Box::new(Cons(20, Box::new(Cons(30, Box::new(Nil))))));
    println!("total = {}", sum(&list));
}`,
    tags: ['box', 'recursive', 'pattern-matching'],
  },
  {
    id: 'rs-ch15-c-040',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Dereference a Box',
    prompt: `Create a Box holding the value 5. Use the dereference operator * to read the value through the box and assert it equals 5. Then print a confirmation. Expected output:
ok`,
    hints: [
      'let b = Box::new(5); then *b gives you the i32.',
      'assert_eq!(5, *b); will panic if it is not equal.',
    ],
    solution: `fn main() {
    let b = Box::new(5);
    assert_eq!(5, *b);
    println!("ok");
}`,
    starter: `fn main() {
    let b = Box::new(5);
    // TODO: assert_eq! that *b equals 5, then print "ok"
}`,
    tags: ['box', 'deref'],
  },
  {
    id: 'rs-ch15-c-041',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Implement Deref for MyBox',
    prompt: `Define a tuple struct MyBox<T>(T) with a constructor MyBox::new. Implement the Deref trait so that *MyBox(x) yields x. Then in main create let y = MyBox::new(5); and assert that *y == 5. Expected output:
ok`,
    hints: [
      'use std::ops::Deref;',
      'type Target = T; and deref returns &self.0.',
      'The compiler turns *y into *(y.deref()).',
    ],
    solution: `use std::ops::Deref;

struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

impl<T> Deref for MyBox<T> {
    type Target = T;
    fn deref(&self) -> &T {
        &self.0
    }
}

fn main() {
    let y = MyBox::new(5);
    assert_eq!(5, *y);
    println!("ok");
}`,
    starter: `use std::ops::Deref;

struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

// TODO: impl Deref for MyBox<T>

fn main() {
    let y = MyBox::new(5);
    assert_eq!(5, *y);
    println!("ok");
}`,
    tags: ['deref', 'generics', 'traits'],
  },
  {
    id: 'rs-ch15-c-042',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Deref Coercion in a Function Call',
    prompt: `Reuse the MyBox<T> type with Deref implemented. Write fn hello(name: &str) that prints "Hello, NAME!" with NAME substituted. Then call hello using a MyBox<String> WITHOUT manually slicing it. Deref coercion should turn &MyBox<String> into &str. Expected output (when the box holds "Rust"):
Hello, Rust!`,
    hints: [
      'Deref coercion chains: &MyBox<String> -> &String -> &str.',
      'Call hello(&m) where m is a MyBox<String>.',
    ],
    solution: `use std::ops::Deref;

struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

impl<T> Deref for MyBox<T> {
    type Target = T;
    fn deref(&self) -> &T {
        &self.0
    }
}

fn hello(name: &str) {
    println!("Hello, {}!", name);
}

fn main() {
    let m = MyBox::new(String::from("Rust"));
    hello(&m);
}`,
    starter: `use std::ops::Deref;

struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

impl<T> Deref for MyBox<T> {
    type Target = T;
    fn deref(&self) -> &T {
        &self.0
    }
}

fn hello(name: &str) {
    println!("Hello, {}!", name);
}

fn main() {
    let m = MyBox::new(String::from("Rust"));
    // TODO: call hello using m, relying on deref coercion
}`,
    tags: ['deref', 'deref-coercion'],
  },
  {
    id: 'rs-ch15-c-043',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Implement Drop',
    prompt: `Define a struct CustomSmartPointer { data: String }. Implement the Drop trait so that when a value is dropped it prints
Dropping CustomSmartPointer with data XYZ!
where XYZ is the data field. In main, create one with data "my stuff" and let it go out of scope. Expected output:
Dropping CustomSmartPointer with data my stuff!`,
    hints: [
      'impl Drop for CustomSmartPointer with fn drop(&mut self).',
      'You do not call drop yourself; it runs automatically at end of scope.',
    ],
    solution: `struct CustomSmartPointer {
    data: String,
}

impl Drop for CustomSmartPointer {
    fn drop(&mut self) {
        println!("Dropping CustomSmartPointer with data {}!", self.data);
    }
}

fn main() {
    let _c = CustomSmartPointer {
        data: String::from("my stuff"),
    };
}`,
    starter: `struct CustomSmartPointer {
    data: String,
}

// TODO: impl Drop so dropping prints the message

fn main() {
    let _c = CustomSmartPointer {
        data: String::from("my stuff"),
    };
}`,
    tags: ['drop', 'traits'],
  },
  {
    id: 'rs-ch15-c-044',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Observe Drop Order',
    prompt: `Using a CustomSmartPointer struct whose Drop prints
Dropping CustomSmartPointer with data X!
create two of them in main: c with data "first" then d with data "second". After creating both, print
CustomSmartPointers created.
Then let the program end. Determine and produce the exact output, which must reflect that variables are dropped in REVERSE order of creation. Expected output:
CustomSmartPointers created.
Dropping CustomSmartPointer with data second!
Dropping CustomSmartPointer with data first!`,
    hints: [
      'Local variables drop in reverse order of declaration.',
      'd was created last, so it drops first.',
    ],
    solution: `struct CustomSmartPointer {
    data: String,
}

impl Drop for CustomSmartPointer {
    fn drop(&mut self) {
        println!("Dropping CustomSmartPointer with data {}!", self.data);
    }
}

fn main() {
    let _c = CustomSmartPointer {
        data: String::from("first"),
    };
    let _d = CustomSmartPointer {
        data: String::from("second"),
    };
    println!("CustomSmartPointers created.");
}`,
    starter: `struct CustomSmartPointer {
    data: String,
}

impl Drop for CustomSmartPointer {
    fn drop(&mut self) {
        println!("Dropping CustomSmartPointer with data {}!", self.data);
    }
}

fn main() {
    // TODO: create _c ("first") then _d ("second"), then print the created message
}`,
    tags: ['drop', 'scope'],
  },
  {
    id: 'rs-ch15-c-045',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Early Drop with std::mem::drop',
    prompt: `Using a CustomSmartPointer whose Drop prints
Dropping CustomSmartPointer with data X!
create c with data "some data", print
CustomSmartPointer created.
then drop c early using std::mem::drop, then print
CustomSmartPointer dropped before the end of main.
Expected output:
CustomSmartPointer created.
Dropping CustomSmartPointer with data some data!
CustomSmartPointer dropped before the end of main.`,
    hints: [
      'You cannot call c.drop() directly; use drop(c) (the std::mem::drop function).',
      'drop is in the prelude, so a plain drop(c) works.',
    ],
    solution: `struct CustomSmartPointer {
    data: String,
}

impl Drop for CustomSmartPointer {
    fn drop(&mut self) {
        println!("Dropping CustomSmartPointer with data {}!", self.data);
    }
}

fn main() {
    let c = CustomSmartPointer {
        data: String::from("some data"),
    };
    println!("CustomSmartPointer created.");
    drop(c);
    println!("CustomSmartPointer dropped before the end of main.");
}`,
    starter: `struct CustomSmartPointer {
    data: String,
}

impl Drop for CustomSmartPointer {
    fn drop(&mut self) {
        println!("Dropping CustomSmartPointer with data {}!", self.data);
    }
}

fn main() {
    let c = CustomSmartPointer {
        data: String::from("some data"),
    };
    println!("CustomSmartPointer created.");
    // TODO: drop c early, then print the final message
}`,
    tags: ['drop', 'mem-drop'],
  },
  {
    id: 'rs-ch15-c-046',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Share Data with Rc',
    prompt: `Define a cons list that can be shared:
enum List {
    Cons(i32, Rc<List>),
    Nil,
}
Create list a = 5 -> 10 -> Nil. Then create b that prepends 3 onto a, and c that prepends 4 onto a, sharing a via Rc::clone. Print a confirmation that all three were built. Expected output:
created three lists sharing a`,
    hints: [
      'use std::rc::Rc;',
      'Wrap a in Rc::new(...) and use Rc::clone(&a) for b and c.',
      'Rc::clone only increments the reference count; it does not deep-copy.',
    ],
    solution: `use std::rc::Rc;

enum List {
    Cons(i32, Rc<List>),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    let a = Rc::new(Cons(5, Rc::new(Cons(10, Rc::new(Nil)))));
    let _b = Cons(3, Rc::clone(&a));
    let _c = Cons(4, Rc::clone(&a));
    println!("created three lists sharing a");
}`,
    starter: `use std::rc::Rc;

enum List {
    Cons(i32, Rc<List>),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    let a = Rc::new(Cons(5, Rc::new(Cons(10, Rc::new(Nil)))));
    // TODO: build _b and _c that both share a via Rc::clone
    println!("created three lists sharing a");
}`,
    tags: ['rc', 'shared-ownership'],
  },
  {
    id: 'rs-ch15-c-047',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Track Rc Strong Count',
    prompt: `Create an Rc<i32> holding 5, named a. Print the strong count after creating a, after cloning it into b, and again after cloning into c inside an inner scope. After the inner scope ends, print the count once more. Use Rc::strong_count. Expected output:
count after creating a = 1
count after creating b = 2
count after creating c = 3
count after c goes out of scope = 2`,
    hints: [
      'Rc::strong_count(&a) returns the current strong count.',
      'Put the third clone in an inner block { } so it drops early.',
    ],
    solution: `use std::rc::Rc;

fn main() {
    let a = Rc::new(5);
    println!("count after creating a = {}", Rc::strong_count(&a));
    let _b = Rc::clone(&a);
    println!("count after creating b = {}", Rc::strong_count(&a));
    {
        let _c = Rc::clone(&a);
        println!("count after creating c = {}", Rc::strong_count(&a));
    }
    println!("count after c goes out of scope = {}", Rc::strong_count(&a));
}`,
    starter: `use std::rc::Rc;

fn main() {
    let a = Rc::new(5);
    // TODO: print strong_count after each clone, including one in an inner scope
}`,
    tags: ['rc', 'strong-count'],
  },
  {
    id: 'rs-ch15-c-048',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'RefCell Interior Mutability',
    prompt: `Create a RefCell<i32> initialized to 5. Through a shared (immutable) binding, mutate the inner value to 50 using borrow_mut, then read it back with borrow and print it. Expected output:
value = 50`,
    hints: [
      'use std::cell::RefCell;',
      'let cell = RefCell::new(5); even though cell is not declared mut, you can borrow_mut.',
      '*cell.borrow_mut() = 50; then *cell.borrow() reads it.',
    ],
    solution: `use std::cell::RefCell;

fn main() {
    let cell = RefCell::new(5);
    *cell.borrow_mut() = 50;
    println!("value = {}", cell.borrow());
}`,
    starter: `use std::cell::RefCell;

fn main() {
    let cell = RefCell::new(5);
    // TODO: change the inner value to 50, then print "value = 50"
}`,
    tags: ['refcell', 'interior-mutability'],
  },
  {
    id: 'rs-ch15-c-049',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Push Through a RefCell Vec',
    prompt: `Create a RefCell<Vec<String>> that starts empty. Bound to an immutable variable, push the strings "a", "b", and "c" into it using borrow_mut. Then print the length using borrow. Expected output:
len = 3`,
    hints: [
      'cell.borrow_mut().push(String::from("a"));',
      'cell.borrow().len() reads the length.',
    ],
    solution: `use std::cell::RefCell;

fn main() {
    let messages = RefCell::new(Vec::<String>::new());
    messages.borrow_mut().push(String::from("a"));
    messages.borrow_mut().push(String::from("b"));
    messages.borrow_mut().push(String::from("c"));
    println!("len = {}", messages.borrow().len());
}`,
    starter: `use std::cell::RefCell;

fn main() {
    let messages = RefCell::new(Vec::<String>::new());
    // TODO: push "a", "b", "c" then print "len = 3"
}`,
    tags: ['refcell', 'interior-mutability', 'vectors'],
  },
  {
    id: 'rs-ch15-c-050',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Mock Object with RefCell',
    prompt: `Build a tiny mock logger to test interior mutability. Define a trait
trait Logger {
    fn log(&self, msg: &str);
}
Define struct MockLogger { sent: RefCell<Vec<String>> } and implement Logger so log pushes a copy of msg into sent (using borrow_mut, even though &self is shared). In main create a MockLogger, log two messages, then print how many were recorded. Expected output:
logged 2 messages`,
    hints: [
      'log takes &self, so you need interior mutability to record into sent.',
      'self.sent.borrow_mut().push(String::from(msg));',
    ],
    solution: `use std::cell::RefCell;

trait Logger {
    fn log(&self, msg: &str);
}

struct MockLogger {
    sent: RefCell<Vec<String>>,
}

impl MockLogger {
    fn new() -> MockLogger {
        MockLogger {
            sent: RefCell::new(Vec::new()),
        }
    }
}

impl Logger for MockLogger {
    fn log(&self, msg: &str) {
        self.sent.borrow_mut().push(String::from(msg));
    }
}

fn main() {
    let logger = MockLogger::new();
    logger.log("first");
    logger.log("second");
    println!("logged {} messages", logger.sent.borrow().len());
}`,
    starter: `use std::cell::RefCell;

trait Logger {
    fn log(&self, msg: &str);
}

struct MockLogger {
    sent: RefCell<Vec<String>>,
}

impl MockLogger {
    fn new() -> MockLogger {
        MockLogger { sent: RefCell::new(Vec::new()) }
    }
}

// TODO: impl Logger for MockLogger using interior mutability

fn main() {
    let logger = MockLogger::new();
    logger.log("first");
    logger.log("second");
    println!("logged {} messages", logger.sent.borrow().len());
}`,
    tags: ['refcell', 'interior-mutability', 'traits'],
  },
  {
    id: 'rs-ch15-c-051',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Shared Mutable Counter with Rc and RefCell',
    prompt: `Create a counter that two owners can both increment. Make a value of type Rc<RefCell<i32>> starting at 0. Clone the Rc so you have two handles to the same cell. Increment through the first handle by 1 and through the second handle by 10, then print the final value through either handle. Expected output:
counter = 11`,
    hints: [
      'Rc gives multiple owners; RefCell gives interior mutability.',
      '*Rc::clone(&counter).borrow_mut() += 10; mutates the shared value.',
      'Both handles see the same data, so the final read shows 11.',
    ],
    solution: `use std::cell::RefCell;
use std::rc::Rc;

fn main() {
    let counter = Rc::new(RefCell::new(0));
    let handle = Rc::clone(&counter);
    *counter.borrow_mut() += 1;
    *handle.borrow_mut() += 10;
    println!("counter = {}", counter.borrow());
}`,
    starter: `use std::cell::RefCell;
use std::rc::Rc;

fn main() {
    let counter = Rc::new(RefCell::new(0));
    let handle = Rc::clone(&counter);
    // TODO: add 1 via counter, add 10 via handle, then print "counter = 11"
}`,
    tags: ['rc', 'refcell', 'shared-ownership'],
  },
  {
    id: 'rs-ch15-c-052',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Mutate a Shared Cons List',
    prompt: `Define
enum List {
    Cons(Rc<RefCell<i32>>, Rc<List>),
    Nil,
}
Create a shared value of type Rc<RefCell<i32>> holding 5. Build list a = value -> Nil, then b that prepends 3 onto a, and c that prepends 4 onto a. After building them, add 10 to the shared value through value. Then write fn first(list: &List) -> i32 that returns the first stored number, and print first(&a). Expected output:
first of a = 15`,
    hints: [
      'value.clone() shares the same RefCell among a, b, and c.',
      '*value.borrow_mut() += 10; changes the number everyone sees.',
      'In first, match the Cons arm and return *v.borrow().',
    ],
    solution: `use std::cell::RefCell;
use std::rc::Rc;

enum List {
    Cons(Rc<RefCell<i32>>, Rc<List>),
    Nil,
}

use List::{Cons, Nil};

fn first(list: &List) -> i32 {
    match list {
        Cons(v, _) => *v.borrow(),
        Nil => 0,
    }
}

fn main() {
    let value = Rc::new(RefCell::new(5));
    let a = Rc::new(Cons(Rc::clone(&value), Rc::new(Nil)));
    let _b = Cons(Rc::new(RefCell::new(3)), Rc::clone(&a));
    let _c = Cons(Rc::new(RefCell::new(4)), Rc::clone(&a));
    *value.borrow_mut() += 10;
    println!("first of a = {}", first(&a));
}`,
    starter: `use std::cell::RefCell;
use std::rc::Rc;

enum List {
    Cons(Rc<RefCell<i32>>, Rc<List>),
    Nil,
}

use List::{Cons, Nil};

fn first(list: &List) -> i32 {
    // TODO: return the first stored number
    todo!()
}

fn main() {
    let value = Rc::new(RefCell::new(5));
    let a = Rc::new(Cons(Rc::clone(&value), Rc::new(Nil)));
    let _b = Cons(Rc::new(RefCell::new(3)), Rc::clone(&a));
    let _c = Cons(Rc::new(RefCell::new(4)), Rc::clone(&a));
    *value.borrow_mut() += 10;
    println!("first of a = {}", first(&a));
}`,
    tags: ['rc', 'refcell', 'recursive'],
  },
  {
    id: 'rs-ch15-c-053',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Deref to Method Resolution',
    prompt: `Implement Deref for a wrapper Wrapper(String) so that String methods are callable directly on a Wrapper. Implement Deref with Target = String. Then in main create let w = Wrapper(String::from("hello")); and print w.len() and w.to_uppercase() by relying on auto-deref method lookup. Expected output:
5
HELLO`,
    hints: [
      'Method calls auto-deref: w.len() becomes (*w).len() => String::len.',
      'type Target = String; deref returns &self.0.',
    ],
    solution: `use std::ops::Deref;

struct Wrapper(String);

impl Deref for Wrapper {
    type Target = String;
    fn deref(&self) -> &String {
        &self.0
    }
}

fn main() {
    let w = Wrapper(String::from("hello"));
    println!("{}", w.len());
    println!("{}", w.to_uppercase());
}`,
    starter: `use std::ops::Deref;

struct Wrapper(String);

// TODO: impl Deref for Wrapper with Target = String

fn main() {
    let w = Wrapper(String::from("hello"));
    println!("{}", w.len());
    println!("{}", w.to_uppercase());
}`,
    tags: ['deref', 'methods'],
  },
  {
    id: 'rs-ch15-c-054',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Box a Trait Object',
    prompt: `Define a trait Shape { fn area(&self) -> f64; }. Implement it for a Circle { radius: f64 } and a Square { side: f64 }. Build a Vec<Box<dyn Shape>> holding a circle of radius 1.0 and a square of side 2.0, then print the total area summed over all shapes. Use 3.14159 for pi. Expected output:
total area = 7.14159`,
    hints: [
      'Box<dyn Shape> lets different concrete types share one Vec.',
      'Circle area = pi * r * r; Square area = side * side.',
      'Iterate and sum shape.area() for each box.',
    ],
    solution: `trait Shape {
    fn area(&self) -> f64;
}

struct Circle {
    radius: f64,
}

struct Square {
    side: f64,
}

impl Shape for Circle {
    fn area(&self) -> f64 {
        3.14159 * self.radius * self.radius
    }
}

impl Shape for Square {
    fn area(&self) -> f64 {
        self.side * self.side
    }
}

fn main() {
    let shapes: Vec<Box<dyn Shape>> = vec![
        Box::new(Circle { radius: 1.0 }),
        Box::new(Square { side: 2.0 }),
    ];
    let total: f64 = shapes.iter().map(|s| s.area()).sum();
    println!("total area = {}", total);
}`,
    starter: `trait Shape {
    fn area(&self) -> f64;
}

struct Circle {
    radius: f64,
}

struct Square {
    side: f64,
}

// TODO: impl Shape for Circle and Square

fn main() {
    let shapes: Vec<Box<dyn Shape>> = vec![
        Box::new(Circle { radius: 1.0 }),
        Box::new(Square { side: 2.0 }),
    ];
    // TODO: print "total area = ..." summing each shape.area()
}`,
    tags: ['box', 'trait-objects'],
  },
  {
    id: 'rs-ch15-c-055',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Drop a Box of Custom Type',
    prompt: `Define struct Resource { name: String } with a Drop impl that prints
Releasing X
where X is the name. Put one Resource (name "db") inside a Box, print
boxed
then drop the box early with std::mem::drop and print
done
Expected output:
boxed
Releasing db
done`,
    hints: [
      'Dropping a Box drops its contents, running Resource::drop.',
      'drop(b) where b is the Box releases it immediately.',
    ],
    solution: `struct Resource {
    name: String,
}

impl Drop for Resource {
    fn drop(&mut self) {
        println!("Releasing {}", self.name);
    }
}

fn main() {
    let b = Box::new(Resource {
        name: String::from("db"),
    });
    println!("boxed");
    drop(b);
    println!("done");
}`,
    starter: `struct Resource {
    name: String,
}

impl Drop for Resource {
    fn drop(&mut self) {
        println!("Releasing {}", self.name);
    }
}

fn main() {
    let b = Box::new(Resource { name: String::from("db") });
    println!("boxed");
    // TODO: drop the box early, then print "done"
}`,
    tags: ['box', 'drop', 'mem-drop'],
  },
  {
    id: 'rs-ch15-c-056',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count List Length Recursively',
    prompt: `Using
enum List {
    Cons(i32, Rc<List>),
    Nil,
}
write fn length(list: &List) -> usize that returns the number of Cons cells. Build a = 1 -> 2 -> Nil and b = 0 -> a (sharing a via Rc). Print length(&b). Expected output:
length of b = 3`,
    hints: [
      'Match Cons(_, rest) => 1 + length(rest), Nil => 0.',
      'b shares a, so b has the extra 0 plus a length 2 = 3.',
    ],
    solution: `use std::rc::Rc;

enum List {
    Cons(i32, Rc<List>),
    Nil,
}

use List::{Cons, Nil};

fn length(list: &List) -> usize {
    match list {
        Cons(_, rest) => 1 + length(rest),
        Nil => 0,
    }
}

fn main() {
    let a = Rc::new(Cons(1, Rc::new(Cons(2, Rc::new(Nil)))));
    let b = Cons(0, Rc::clone(&a));
    println!("length of b = {}", length(&b));
}`,
    starter: `use std::rc::Rc;

enum List {
    Cons(i32, Rc<List>),
    Nil,
}

use List::{Cons, Nil};

fn length(list: &List) -> usize {
    // TODO: count the Cons cells recursively
    todo!()
}

fn main() {
    let a = Rc::new(Cons(1, Rc::new(Cons(2, Rc::new(Nil)))));
    let b = Cons(0, Rc::clone(&a));
    println!("length of b = {}", length(&b));
}`,
    tags: ['rc', 'recursive', 'pattern-matching'],
  },
  {
    id: 'rs-ch15-c-057',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'RefCell Borrow Rules Hold at Runtime',
    prompt: `Demonstrate that RefCell's borrow rules are enforced at runtime, not compile time. Create a RefCell<i32> with value 1. Open an immutable borrow with borrow() and keep it alive while you read the value twice, printing each read. Multiple immutable borrows are allowed simultaneously. Expected output:
read1 = 1
read2 = 1`,
    hints: [
      'You may hold many shared borrows at once.',
      'Bind two borrow() results to variables, then print both.',
    ],
    solution: `use std::cell::RefCell;

fn main() {
    let cell = RefCell::new(1);
    let r1 = cell.borrow();
    let r2 = cell.borrow();
    println!("read1 = {}", r1);
    println!("read2 = {}", r2);
}`,
    starter: `use std::cell::RefCell;

fn main() {
    let cell = RefCell::new(1);
    // TODO: hold two immutable borrows at once and print each
}`,
    tags: ['refcell', 'borrowing'],
  },
  {
    id: 'rs-ch15-c-058',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Drop Guard Logs Enter and Exit',
    prompt: `Make a scope guard. Define struct Guard { label: String } with a constructor Guard::new(label) that prints
enter LABEL
and a Drop impl that prints
exit LABEL
In main, create a Guard "outer", then inside an inner block create a Guard "inner". Produce the exact output as the guards enter and exit. Expected output:
enter outer
enter inner
exit inner
exit outer`,
    hints: [
      'Guard::new prints "enter ..." and returns the Guard.',
      'The inner guard drops at the end of the inner block; outer drops at end of main.',
    ],
    solution: `struct Guard {
    label: String,
}

impl Guard {
    fn new(label: &str) -> Guard {
        println!("enter {}", label);
        Guard {
            label: String::from(label),
        }
    }
}

impl Drop for Guard {
    fn drop(&mut self) {
        println!("exit {}", self.label);
    }
}

fn main() {
    let _outer = Guard::new("outer");
    {
        let _inner = Guard::new("inner");
    }
}`,
    starter: `struct Guard {
    label: String,
}

impl Guard {
    fn new(label: &str) -> Guard {
        println!("enter {}", label);
        Guard { label: String::from(label) }
    }
}

// TODO: impl Drop for Guard printing "exit LABEL"

fn main() {
    let _outer = Guard::new("outer");
    {
        let _inner = Guard::new("inner");
    }
}`,
    tags: ['drop', 'scope'],
  },
  {
    id: 'rs-ch15-c-059',
    chapter: 15,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Rc Clone Versus Deep Copy',
    prompt: `Show that Rc::clone shares rather than copies. Create an Rc<String> holding "shared". Clone it into b. Print the strong count (should be 2) and confirm both point at the same allocation by checking Rc::ptr_eq. Expected output:
count = 2
same allocation = true`,
    hints: [
      'Rc::strong_count(&a) gives the count.',
      'Rc::ptr_eq(&a, &b) is true when both Rc point to the same allocation.',
    ],
    solution: `use std::rc::Rc;

fn main() {
    let a = Rc::new(String::from("shared"));
    let b = Rc::clone(&a);
    println!("count = {}", Rc::strong_count(&a));
    println!("same allocation = {}", Rc::ptr_eq(&a, &b));
}`,
    starter: `use std::rc::Rc;

fn main() {
    let a = Rc::new(String::from("shared"));
    let b = Rc::clone(&a);
    // TODO: print the strong count and whether a and b share the allocation
}`,
    tags: ['rc', 'strong-count'],
  },
  {
    id: 'rs-ch15-c-060',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Averager with RefCell',
    prompt: `Build a struct Averager that accumulates numbers and reports the running average, using interior mutability so add takes &self.
Define struct Averager { sum: RefCell<f64>, count: RefCell<u32> }.
Implement fn new() -> Averager, fn add(&self, x: f64) which updates sum and count, and fn average(&self) -> f64 returning sum/count (or 0.0 if count is 0).
In main, add 2.0, 4.0, and 6.0, then print the average. Expected output:
average = 4`,
    hints: [
      'add takes &self, so use borrow_mut on both RefCells.',
      'average reads via borrow(); guard against division by zero.',
    ],
    solution: `use std::cell::RefCell;

struct Averager {
    sum: RefCell<f64>,
    count: RefCell<u32>,
}

impl Averager {
    fn new() -> Averager {
        Averager {
            sum: RefCell::new(0.0),
            count: RefCell::new(0),
        }
    }

    fn add(&self, x: f64) {
        *self.sum.borrow_mut() += x;
        *self.count.borrow_mut() += 1;
    }

    fn average(&self) -> f64 {
        let count = *self.count.borrow();
        if count == 0 {
            0.0
        } else {
            *self.sum.borrow() / count as f64
        }
    }
}

fn main() {
    let avg = Averager::new();
    avg.add(2.0);
    avg.add(4.0);
    avg.add(6.0);
    println!("average = {}", avg.average());
}`,
    starter: `use std::cell::RefCell;

struct Averager {
    sum: RefCell<f64>,
    count: RefCell<u32>,
}

impl Averager {
    fn new() -> Averager {
        Averager { sum: RefCell::new(0.0), count: RefCell::new(0) }
    }

    fn add(&self, x: f64) {
        // TODO: update sum and count through interior mutability
    }

    fn average(&self) -> f64 {
        // TODO: return sum/count, or 0.0 when count is 0
        todo!()
    }
}

fn main() {
    let avg = Averager::new();
    avg.add(2.0);
    avg.add(4.0);
    avg.add(6.0);
    println!("average = {}", avg.average());
}`,
    tags: ['refcell', 'interior-mutability'],
  },
  {
    id: 'rs-ch15-c-061',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Limit Tracker Mock',
    prompt: `Recreate the book's limit-tracker pattern. Define
trait Messenger { fn send(&self, msg: &str); }
and a struct LimitTracker<'a, T: Messenger> { messenger: &'a T, value: usize, max: usize } with new(messenger, max) and set_value(&mut self, value) which sends a warning when value/max crosses thresholds: send "Warning: over 75%" when the ratio is at or above 0.75 but below 0.9, and "Urgent: over 90%" when at or above 0.9 (above 100% also urgent). Define a MockMessenger using RefCell<Vec<String>> to record sent messages. In main, set value to 80 out of 100 and print how many messages were recorded. Expected output:
messages = 1`,
    hints: [
      'percentage = value as f64 / max as f64.',
      'MockMessenger.send pushes into a RefCell<Vec<String>> via borrow_mut.',
      '80/100 = 0.8 which is in the 75% band, so exactly one message.',
    ],
    solution: `use std::cell::RefCell;

trait Messenger {
    fn send(&self, msg: &str);
}

struct LimitTracker<'a, T: Messenger> {
    messenger: &'a T,
    value: usize,
    max: usize,
}

impl<'a, T: Messenger> LimitTracker<'a, T> {
    fn new(messenger: &'a T, max: usize) -> LimitTracker<'a, T> {
        LimitTracker {
            messenger,
            value: 0,
            max,
        }
    }

    fn set_value(&mut self, value: usize) {
        self.value = value;
        let percentage = self.value as f64 / self.max as f64;
        if percentage >= 0.9 {
            self.messenger.send("Urgent: over 90%");
        } else if percentage >= 0.75 {
            self.messenger.send("Warning: over 75%");
        }
    }
}

struct MockMessenger {
    sent: RefCell<Vec<String>>,
}

impl MockMessenger {
    fn new() -> MockMessenger {
        MockMessenger {
            sent: RefCell::new(Vec::new()),
        }
    }
}

impl Messenger for MockMessenger {
    fn send(&self, msg: &str) {
        self.sent.borrow_mut().push(String::from(msg));
    }
}

fn main() {
    let mock = MockMessenger::new();
    let mut tracker = LimitTracker::new(&mock, 100);
    tracker.set_value(80);
    println!("messages = {}", mock.sent.borrow().len());
}`,
    starter: `use std::cell::RefCell;

trait Messenger {
    fn send(&self, msg: &str);
}

struct LimitTracker<'a, T: Messenger> {
    messenger: &'a T,
    value: usize,
    max: usize,
}

impl<'a, T: Messenger> LimitTracker<'a, T> {
    fn new(messenger: &'a T, max: usize) -> LimitTracker<'a, T> {
        LimitTracker { messenger, value: 0, max }
    }

    fn set_value(&mut self, value: usize) {
        // TODO: compute the ratio and send the right warning
    }
}

struct MockMessenger {
    sent: RefCell<Vec<String>>,
}

impl MockMessenger {
    fn new() -> MockMessenger {
        MockMessenger { sent: RefCell::new(Vec::new()) }
    }
}

// TODO: impl Messenger for MockMessenger

fn main() {
    let mock = MockMessenger::new();
    let mut tracker = LimitTracker::new(&mock, 100);
    tracker.set_value(80);
    println!("messages = {}", mock.sent.borrow().len());
}`,
    tags: ['refcell', 'traits', 'lifetimes'],
  },
  {
    id: 'rs-ch15-c-062',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Append to a Shared List Tail',
    prompt: `Model a mutable linked list using
enum List {
    Cons(i32, RefCell<Rc<List>>),
    Nil,
}
The tail (the Rc<List>) lives inside a RefCell so it can be swapped. Build a = 5 -> Nil and b = 10 -> a (sharing a). Then write fn tail(list: &List) -> Option<&RefCell<Rc<List>>> returning the RefCell of the last Cons before Nil... actually simpler: write fn head(list: &List) -> i32 returning the first value, then redirect a's tail to point at b, and print head(&a) and the value reachable after one hop. To keep it focused, after wiring, print the head of a. Expected output:
head of a = 5`,
    hints: [
      'RefCell<Rc<List>> lets you replace the tail later with borrow_mut.',
      'head matches Cons(value, _) => *value.',
      'To redirect: *a_tail.borrow_mut() = Rc::clone(&b); but here you only need head(&a).',
    ],
    solution: `use std::cell::RefCell;
use std::rc::Rc;

#[derive(Debug)]
enum List {
    Cons(i32, RefCell<Rc<List>>),
    Nil,
}

use List::{Cons, Nil};

impl List {
    fn tail(&self) -> Option<&RefCell<Rc<List>>> {
        match self {
            Cons(_, item) => Some(item),
            Nil => None,
        }
    }
}

fn head(list: &List) -> i32 {
    match list {
        Cons(value, _) => *value,
        Nil => 0,
    }
}

fn main() {
    let a = Rc::new(Cons(5, RefCell::new(Rc::new(Nil))));
    let b = Rc::new(Cons(10, RefCell::new(Rc::clone(&a))));
    if let Some(link) = a.tail() {
        *link.borrow_mut() = Rc::clone(&b);
    }
    println!("head of a = {}", head(&a));
}`,
    starter: `use std::cell::RefCell;
use std::rc::Rc;

#[derive(Debug)]
enum List {
    Cons(i32, RefCell<Rc<List>>),
    Nil,
}

use List::{Cons, Nil};

impl List {
    fn tail(&self) -> Option<&RefCell<Rc<List>>> {
        match self {
            Cons(_, item) => Some(item),
            Nil => None,
        }
    }
}

fn head(list: &List) -> i32 {
    // TODO: return the first stored value
    todo!()
}

fn main() {
    let a = Rc::new(Cons(5, RefCell::new(Rc::new(Nil))));
    let b = Rc::new(Cons(10, RefCell::new(Rc::clone(&a))));
    // TODO: redirect a's tail to b, then print head of a
    println!("head of a = {}", head(&a));
}`,
    tags: ['rc', 'refcell', 'recursive'],
  },
  {
    id: 'rs-ch15-c-063',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Create a Reference Cycle',
    prompt: `Deliberately create a reference cycle to understand why it leaks. Use
enum List {
    Cons(i32, RefCell<Rc<List>>),
    Nil,
}
Build a = 5 -> Nil and b = 10 -> a. Then point a's tail back at b, forming a cycle. Print the strong count of a and of b after wiring the cycle (each should be 2). Do NOT try to print the lists (that would overflow the stack). Expected output:
a strong count = 2
b strong count = 2`,
    hints: [
      'Get a.tail() and assign *link.borrow_mut() = Rc::clone(&b).',
      'After the cycle, a and b each have strong count 2.',
      'Avoid printing the list itself; the cycle makes Debug recurse forever.',
    ],
    solution: `use std::cell::RefCell;
use std::rc::Rc;

enum List {
    Cons(i32, RefCell<Rc<List>>),
    Nil,
}

use List::{Cons, Nil};

impl List {
    fn tail(&self) -> Option<&RefCell<Rc<List>>> {
        match self {
            Cons(_, item) => Some(item),
            Nil => None,
        }
    }
}

fn main() {
    let a = Rc::new(Cons(5, RefCell::new(Rc::new(Nil))));
    let b = Rc::new(Cons(10, RefCell::new(Rc::clone(&a))));

    if let Some(link) = a.tail() {
        *link.borrow_mut() = Rc::clone(&b);
    }

    println!("a strong count = {}", Rc::strong_count(&a));
    println!("b strong count = {}", Rc::strong_count(&b));
}`,
    starter: `use std::cell::RefCell;
use std::rc::Rc;

enum List {
    Cons(i32, RefCell<Rc<List>>),
    Nil,
}

use List::{Cons, Nil};

impl List {
    fn tail(&self) -> Option<&RefCell<Rc<List>>> {
        match self {
            Cons(_, item) => Some(item),
            Nil => None,
        }
    }
}

fn main() {
    let a = Rc::new(Cons(5, RefCell::new(Rc::new(Nil))));
    let b = Rc::new(Cons(10, RefCell::new(Rc::clone(&a))));
    // TODO: make a's tail point back at b, then print both strong counts
}`,
    tags: ['rc', 'refcell', 'reference-cycle'],
  },
  {
    id: 'rs-ch15-c-064',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Parent and Child with Weak',
    prompt: `Build a tree node that links parent and child without a cycle.
Define
struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
}
Create a leaf node (value 3) and a branch node (value 5) whose children contain the leaf. Set the leaf's parent to a Weak reference to the branch. Then upgrade the leaf's parent and print the parent's value. Expected output:
leaf parent value = 5`,
    hints: [
      'use std::rc::{Rc, Weak};',
      'Set parent with *leaf.parent.borrow_mut() = Rc::downgrade(&branch);',
      'leaf.parent.borrow().upgrade() yields Option<Rc<Node>>.',
    ],
    solution: `use std::cell::RefCell;
use std::rc::{Rc, Weak};

struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
}

fn main() {
    let leaf = Rc::new(Node {
        value: 3,
        parent: RefCell::new(Weak::new()),
        children: RefCell::new(vec![]),
    });

    let branch = Rc::new(Node {
        value: 5,
        parent: RefCell::new(Weak::new()),
        children: RefCell::new(vec![Rc::clone(&leaf)]),
    });

    *leaf.parent.borrow_mut() = Rc::downgrade(&branch);

    let parent = leaf.parent.borrow().upgrade();
    if let Some(parent) = parent {
        println!("leaf parent value = {}", parent.value);
    }
}`,
    starter: `use std::cell::RefCell;
use std::rc::{Rc, Weak};

struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
}

fn main() {
    let leaf = Rc::new(Node {
        value: 3,
        parent: RefCell::new(Weak::new()),
        children: RefCell::new(vec![]),
    });

    let branch = Rc::new(Node {
        value: 5,
        parent: RefCell::new(Weak::new()),
        children: RefCell::new(vec![Rc::clone(&leaf)]),
    });

    // TODO: set leaf's parent to a Weak ref to branch, then upgrade and print the value
}`,
    tags: ['weak', 'rc', 'refcell'],
  },
  {
    id: 'rs-ch15-c-065',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Weak Upgrade Returns None',
    prompt: `Show that a Weak reference does not keep its target alive. Create an Rc<i32> holding 42, downgrade it to a Weak, then drop the Rc with std::mem::drop. Try to upgrade the Weak afterward and report whether it succeeded. Expected output:
before drop: Some(42)
after drop: None`,
    hints: [
      'Rc::downgrade(&strong) makes a Weak.',
      'weak.upgrade() returns Some(Rc) while the value lives, None after.',
      'Print the Option<i32> values, mapping the Rc to its inner i32 for display.',
    ],
    solution: `use std::rc::Rc;

fn main() {
    let strong = Rc::new(42);
    let weak = Rc::downgrade(&strong);

    match weak.upgrade() {
        Some(rc) => println!("before drop: Some({})", *rc),
        None => println!("before drop: None"),
    }

    drop(strong);

    match weak.upgrade() {
        Some(rc) => println!("after drop: Some({})", *rc),
        None => println!("after drop: None"),
    }
}`,
    starter: `use std::rc::Rc;

fn main() {
    let strong = Rc::new(42);
    let weak = Rc::downgrade(&strong);
    // TODO: upgrade before dropping, drop strong, then upgrade again
}`,
    tags: ['weak', 'rc', 'mem-drop'],
  },
  {
    id: 'rs-ch15-c-066',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Track Strong and Weak Counts',
    prompt: `Observe how strong and weak counts evolve in a parent/child tree. Reuse the Node struct
struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
}
Create a leaf, print its strong and weak counts. Then create a branch in an inner scope that holds the leaf as a child and is set as the leaf's parent. Print branch's counts and leaf's counts inside the scope. After the scope, print leaf's counts again. Expected output:
leaf strong = 1, weak = 0
branch strong = 1, weak = 1
leaf strong = 2, weak = 0
after scope leaf strong = 1, weak = 0`,
    hints: [
      'Rc::strong_count and Rc::weak_count both take &Rc.',
      'Setting leaf.parent to Rc::downgrade(&branch) raises branch weak count to 1.',
      'Branch holding leaf as child raises leaf strong count to 2 inside the scope.',
    ],
    solution: `use std::cell::RefCell;
use std::rc::{Rc, Weak};

struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
}

fn main() {
    let leaf = Rc::new(Node {
        value: 3,
        parent: RefCell::new(Weak::new()),
        children: RefCell::new(vec![]),
    });

    println!(
        "leaf strong = {}, weak = {}",
        Rc::strong_count(&leaf),
        Rc::weak_count(&leaf)
    );

    {
        let branch = Rc::new(Node {
            value: 5,
            parent: RefCell::new(Weak::new()),
            children: RefCell::new(vec![Rc::clone(&leaf)]),
        });

        *leaf.parent.borrow_mut() = Rc::downgrade(&branch);

        println!(
            "branch strong = {}, weak = {}",
            Rc::strong_count(&branch),
            Rc::weak_count(&branch)
        );
        println!(
            "leaf strong = {}, weak = {}",
            Rc::strong_count(&leaf),
            Rc::weak_count(&leaf)
        );
    }

    println!(
        "after scope leaf strong = {}, weak = {}",
        Rc::strong_count(&leaf),
        Rc::weak_count(&leaf)
    );
}`,
    starter: `use std::cell::RefCell;
use std::rc::{Rc, Weak};

struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
}

fn main() {
    let leaf = Rc::new(Node {
        value: 3,
        parent: RefCell::new(Weak::new()),
        children: RefCell::new(vec![]),
    });
    // TODO: print leaf counts, create branch in a scope, set parent, print all counts
}`,
    tags: ['weak', 'rc', 'strong-count'],
  },
  {
    id: 'rs-ch15-c-067',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Generic Stack with Box Nodes',
    prompt: `Implement a singly linked stack of i32 using boxed nodes.
Define
enum Stack {
    Node(i32, Box<Stack>),
    Empty,
}
Implement methods: fn new() -> Stack returning Empty, fn push(self, value: i32) -> Stack returning a new Node, and fn sum(&self) -> i32 summing all values. In main, build an empty stack, push 1, then 2, then 3, and print the sum. Expected output:
sum = 6`,
    hints: [
      'push consumes self and wraps it in Box: Stack::Node(value, Box::new(self)).',
      'sum recurses over the Box, relying on deref coercion to pass &Box as &Stack.',
    ],
    solution: `enum Stack {
    Node(i32, Box<Stack>),
    Empty,
}

impl Stack {
    fn new() -> Stack {
        Stack::Empty
    }

    fn push(self, value: i32) -> Stack {
        Stack::Node(value, Box::new(self))
    }

    fn sum(&self) -> i32 {
        match self {
            Stack::Node(value, rest) => value + rest.sum(),
            Stack::Empty => 0,
        }
    }
}

fn main() {
    let stack = Stack::new().push(1).push(2).push(3);
    println!("sum = {}", stack.sum());
}`,
    starter: `enum Stack {
    Node(i32, Box<Stack>),
    Empty,
}

impl Stack {
    fn new() -> Stack {
        Stack::Empty
    }

    fn push(self, value: i32) -> Stack {
        // TODO: wrap self in a Box inside a new Node
        todo!()
    }

    fn sum(&self) -> i32 {
        // TODO: recursively sum the values
        todo!()
    }
}

fn main() {
    let stack = Stack::new().push(1).push(2).push(3);
    println!("sum = {}", stack.sum());
}`,
    tags: ['box', 'recursive', 'methods'],
  },
  {
    id: 'rs-ch15-c-068',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Shared Observer List',
    prompt: `Several observers should all see updates to one shared value. Create a shared state Rc<RefCell<i32>> starting at 0. Create three "observer" clones of the Rc. Through observer one, set the value to 100. Then have each observer read and sum what it sees; since they share state, the total is 300. Print the total. Expected output:
total seen = 300`,
    hints: [
      'All three Rc clones point at the same RefCell.',
      'Set value once via one clone with borrow_mut.',
      'Each clone reads 100 with borrow(); 100 * 3 = 300.',
    ],
    solution: `use std::cell::RefCell;
use std::rc::Rc;

fn main() {
    let state = Rc::new(RefCell::new(0));
    let o1 = Rc::clone(&state);
    let o2 = Rc::clone(&state);
    let o3 = Rc::clone(&state);

    *o1.borrow_mut() = 100;

    let total = *o1.borrow() + *o2.borrow() + *o3.borrow();
    println!("total seen = {}", total);
}`,
    starter: `use std::cell::RefCell;
use std::rc::Rc;

fn main() {
    let state = Rc::new(RefCell::new(0));
    let o1 = Rc::clone(&state);
    let o2 = Rc::clone(&state);
    let o3 = Rc::clone(&state);
    // TODO: set value to 100 via o1, then sum what o1, o2, o3 each see
}`,
    tags: ['rc', 'refcell', 'shared-ownership'],
  },
  {
    id: 'rs-ch15-c-069',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Sum a Tree of Rc Nodes',
    prompt: `Sum the values of a tree where each node owns its children via Rc.
Define
struct Node {
    value: i32,
    children: RefCell<Vec<Rc<Node>>>,
}
Build a root (value 1) with two children (values 2 and 3); give the value-2 child one grandchild (value 4). Write fn sum_tree(node: &Rc<Node>) -> i32 that adds this node's value plus the sums of all children recursively. Print the total. Expected output:
tree sum = 10`,
    hints: [
      'Borrow children with node.children.borrow() and iterate.',
      'For each child Rc, recurse: total += sum_tree(child).',
      '1 + 2 + 3 + 4 = 10.',
    ],
    solution: `use std::cell::RefCell;
use std::rc::Rc;

struct Node {
    value: i32,
    children: RefCell<Vec<Rc<Node>>>,
}

fn sum_tree(node: &Rc<Node>) -> i32 {
    let mut total = node.value;
    for child in node.children.borrow().iter() {
        total += sum_tree(child);
    }
    total
}

fn main() {
    let grandchild = Rc::new(Node {
        value: 4,
        children: RefCell::new(vec![]),
    });
    let child2 = Rc::new(Node {
        value: 2,
        children: RefCell::new(vec![Rc::clone(&grandchild)]),
    });
    let child3 = Rc::new(Node {
        value: 3,
        children: RefCell::new(vec![]),
    });
    let root = Rc::new(Node {
        value: 1,
        children: RefCell::new(vec![Rc::clone(&child2), Rc::clone(&child3)]),
    });

    println!("tree sum = {}", sum_tree(&root));
}`,
    starter: `use std::cell::RefCell;
use std::rc::Rc;

struct Node {
    value: i32,
    children: RefCell<Vec<Rc<Node>>>,
}

fn sum_tree(node: &Rc<Node>) -> i32 {
    // TODO: add node.value plus the sum of every child recursively
    todo!()
}

fn main() {
    let grandchild = Rc::new(Node { value: 4, children: RefCell::new(vec![]) });
    let child2 = Rc::new(Node { value: 2, children: RefCell::new(vec![Rc::clone(&grandchild)]) });
    let child3 = Rc::new(Node { value: 3, children: RefCell::new(vec![]) });
    let root = Rc::new(Node {
        value: 1,
        children: RefCell::new(vec![Rc::clone(&child2), Rc::clone(&child3)]),
    });
    println!("tree sum = {}", sum_tree(&root));
}`,
    tags: ['rc', 'refcell', 'recursive'],
  },
  {
    id: 'rs-ch15-c-070',
    chapter: 15,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Add a Child and Walk to Root via Weak',
    prompt: `Combine Rc, Weak, and RefCell to grow a tree at runtime and walk back up.
Define
struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
}
Write a helper fn add_child(parent: &Rc<Node>, child: &Rc<Node>) that pushes child into the parent's children and sets the child's parent to a Weak ref to parent.
Build root (value 1), then add child (value 2), then add grandchild (value 3) under child. Starting from grandchild, walk up to the root by following parent links and collect the values seen on the way up (excluding the start). Print them. Expected output:
walk up: 2 1`,
    hints: [
      'add_child uses children.borrow_mut().push and *child.parent.borrow_mut() = Rc::downgrade(parent).',
      'To walk up, loop: cur.parent.borrow().upgrade() gives the next Rc up.',
      'Collect values into a Vec<i32> and print them space-separated.',
    ],
    solution: `use std::cell::RefCell;
use std::rc::{Rc, Weak};

struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
}

fn new_node(value: i32) -> Rc<Node> {
    Rc::new(Node {
        value,
        parent: RefCell::new(Weak::new()),
        children: RefCell::new(vec![]),
    })
}

fn add_child(parent: &Rc<Node>, child: &Rc<Node>) {
    parent.children.borrow_mut().push(Rc::clone(child));
    *child.parent.borrow_mut() = Rc::downgrade(parent);
}

fn main() {
    let root = new_node(1);
    let child = new_node(2);
    let grandchild = new_node(3);

    add_child(&root, &child);
    add_child(&child, &grandchild);

    let mut values = Vec::new();
    let mut current = Rc::clone(&grandchild);
    loop {
        let next = current.parent.borrow().upgrade();
        match next {
            Some(parent) => {
                values.push(parent.value);
                current = parent;
            }
            None => break,
        }
    }

    let printed: Vec<String> = values.iter().map(|v| v.to_string()).collect();
    println!("walk up: {}", printed.join(" "));
}`,
    starter: `use std::cell::RefCell;
use std::rc::{Rc, Weak};

struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
}

fn new_node(value: i32) -> Rc<Node> {
    Rc::new(Node {
        value,
        parent: RefCell::new(Weak::new()),
        children: RefCell::new(vec![]),
    })
}

fn add_child(parent: &Rc<Node>, child: &Rc<Node>) {
    // TODO: push child into parent's children and set child's parent to a Weak ref
}

fn main() {
    let root = new_node(1);
    let child = new_node(2);
    let grandchild = new_node(3);

    add_child(&root, &child);
    add_child(&child, &grandchild);

    // TODO: starting from grandchild, follow parent links up and collect values, then print
}`,
    tags: ['weak', 'rc', 'refcell'],
  },
]

export default problems
