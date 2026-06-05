import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch15-c-001',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Store an Integer on the Heap',
    prompt: `Use \`Box\` to allocate a single \`i32\` on the heap.

In \`main\`, create \`let b = Box::new(5);\` and then print \`b\` with \`println!("b = {}", b)\`. The expected output is exactly:

b = 5`,
    hints: [
      'Box::new(value) moves the value onto the heap and gives you a smart pointer to it.',
      'A Box prints just like the value it holds because Box forwards Display.',
    ],
    solution: `fn main() {
    let b = Box::new(5);
    println!("b = {}", b);
}`,
    starter: `fn main() {
    // TODO: put 5 on the heap with Box::new, then print it
}`,
    tags: ['box', 'heap'],
  },
  {
    id: 'rs-ch15-c-002',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Dereference a Box',
    prompt: `Create a \`Box<i32>\` holding the value 10. Use the dereference operator \`*\` to read the value back out, add 5 to it, and print the result.

The expected output is exactly:

15`,
    hints: [
      'The asterisk operator follows the pointer to the value: *b.',
      'You can write the sum inline: *b + 5.',
    ],
    solution: `fn main() {
    let b = Box::new(10);
    let result = *b + 5;
    println!("{}", result);
}`,
    starter: `fn main() {
    let b = Box::new(10);
    // TODO: dereference b, add 5, and print the result
}`,
    tags: ['box', 'dereference'],
  },
  {
    id: 'rs-ch15-c-003',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Box Holding a String',
    prompt: `Allocate a \`String\` on the heap behind a \`Box\`. Create \`let name = Box::new(String::from("Ferris"));\` and print a greeting.

The expected output is exactly:

Hello, Ferris!`,
    hints: [
      'Box::new can hold any value, including a String.',
      'Box forwards Display, so you can print name directly inside the format string.',
    ],
    solution: `fn main() {
    let name = Box::new(String::from("Ferris"));
    println!("Hello, {}!", name);
}`,
    starter: `fn main() {
    let name = Box::new(String::from("Ferris"));
    // TODO: print "Hello, Ferris!"
}`,
    tags: ['box', 'string', 'heap'],
  },
  {
    id: 'rs-ch15-c-004',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Box of a Tuple',
    prompt: `Put a tuple \`(3, 4)\` on the heap with a \`Box\`. Then read both elements back through the box and print their sum.

The expected output is exactly:

7`,
    hints: [
      'Dereference the box first, then access the tuple fields: (*b).0 and (*b).1.',
      'Field access auto-dereferences too, so b.0 and b.1 also work.',
    ],
    solution: `fn main() {
    let b = Box::new((3, 4));
    let sum = b.0 + b.1;
    println!("{}", sum);
}`,
    starter: `fn main() {
    let b = Box::new((3, 4));
    // TODO: print the sum of the two tuple elements
}`,
    tags: ['box', 'tuple', 'heap'],
  },
  {
    id: 'rs-ch15-c-005',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Box Inside a Function',
    prompt: `Write a function \`boxed_double(n: i32) -> Box<i32>\` that returns a \`Box\` holding \`n * 2\`.

In \`main\`, call it with 21 and print the boxed value. The expected output is exactly:

42`,
    hints: [
      'The return type is Box<i32>, so the body should be Box::new(n * 2).',
      'A returned Box can be printed directly because it forwards Display.',
    ],
    solution: `fn boxed_double(n: i32) -> Box<i32> {
    Box::new(n * 2)
}

fn main() {
    let b = boxed_double(21);
    println!("{}", b);
}`,
    starter: `fn boxed_double(n: i32) -> Box<i32> {
    // TODO: return a Box holding n * 2
}

fn main() {
    let b = boxed_double(21);
    println!("{}", b);
}`,
    tags: ['box', 'functions', 'heap'],
  },
  {
    id: 'rs-ch15-c-006',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Minimal Drop Message',
    prompt: `Define a struct \`Resource\` with a single field \`name: String\`. Implement the \`Drop\` trait for it so that when a value is dropped it prints:

Dropping Resource: <name>

In \`main\`, create one \`Resource\` with the name "db" and let it go out of scope normally. The program should print exactly:

Dropping Resource: db`,
    hints: [
      'The Drop trait has one method: fn drop(&mut self).',
      'Access the field inside drop with self.name.',
      'You do not call drop yourself; it runs automatically at end of scope.',
    ],
    solution: `struct Resource {
    name: String,
}

impl Drop for Resource {
    fn drop(&mut self) {
        println!("Dropping Resource: {}", self.name);
    }
}

fn main() {
    let _r = Resource { name: String::from("db") };
}`,
    starter: `struct Resource {
    name: String,
}

impl Drop for Resource {
    fn drop(&mut self) {
        // TODO: print "Dropping Resource: <name>"
    }
}

fn main() {
    let _r = Resource { name: String::from("db") };
}`,
    tags: ['drop', 'traits'],
  },
  {
    id: 'rs-ch15-c-007',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Count References With Rc',
    prompt: `Create \`let a = Rc::new(5);\` (remember \`use std::rc::Rc;\`). Print the strong count, then clone it into \`b\` with \`Rc::clone(&a)\` and print the strong count again.

The expected output is exactly:

count = 1
count = 2`,
    hints: [
      'Rc::strong_count(&a) returns the number of strong references.',
      'Rc::clone(&a) does not deep-copy; it just bumps the reference count.',
    ],
    solution: `use std::rc::Rc;

fn main() {
    let a = Rc::new(5);
    println!("count = {}", Rc::strong_count(&a));
    let b = Rc::clone(&a);
    println!("count = {}", Rc::strong_count(&a));
    let _ = b;
}`,
    starter: `use std::rc::Rc;

fn main() {
    let a = Rc::new(5);
    println!("count = {}", Rc::strong_count(&a));
    // TODO: clone a into b, then print the count again
}`,
    tags: ['rc', 'strong-count'],
  },
  {
    id: 'rs-ch15-c-008',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Share a String With Rc',
    prompt: `Wrap a \`String\` in an \`Rc\` so two variables can read it without cloning the text. Create \`let s = Rc::new(String::from("shared"));\`, clone it into \`s2\`, and print both.

The expected output is exactly:

shared
shared`,
    hints: [
      'Rc lets multiple owners read the same heap data.',
      'Rc forwards Display, so you can print the Rc directly.',
    ],
    solution: `use std::rc::Rc;

fn main() {
    let s = Rc::new(String::from("shared"));
    let s2 = Rc::clone(&s);
    println!("{}", s);
    println!("{}", s2);
}`,
    starter: `use std::rc::Rc;

fn main() {
    let s = Rc::new(String::from("shared"));
    // TODO: clone the Rc and print both copies
}`,
    tags: ['rc', 'string', 'sharing'],
  },
  {
    id: 'rs-ch15-c-009',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Mutate Through RefCell',
    prompt: `Use \`RefCell\` to mutate a value held behind an immutable binding (remember \`use std::cell::RefCell;\`). Create \`let cell = RefCell::new(10);\`, then use \`borrow_mut\` to add 5 to the inner value, and print it with \`borrow\`.

The expected output is exactly:

15`,
    hints: [
      'cell.borrow_mut() gives a mutable reference; dereference it with * to assign.',
      'cell.borrow() gives a shared reference for reading.',
      'Let the borrow_mut go out of scope before calling borrow.',
    ],
    solution: `use std::cell::RefCell;

fn main() {
    let cell = RefCell::new(10);
    *cell.borrow_mut() += 5;
    println!("{}", cell.borrow());
}`,
    starter: `use std::cell::RefCell;

fn main() {
    let cell = RefCell::new(10);
    // TODO: add 5 to the inner value via borrow_mut, then print it
}`,
    tags: ['refcell', 'interior-mutability'],
  },
  {
    id: 'rs-ch15-c-010',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Push to a Vec Inside a RefCell',
    prompt: `Hold a \`Vec<i32>\` inside a \`RefCell\`. Start with an empty vector, then push 1, 2, and 3 through \`borrow_mut\`. Finally print the length using \`borrow\`.

The expected output is exactly:

len = 3`,
    hints: [
      'RefCell::new(Vec::new()) creates the cell.',
      'cell.borrow_mut().push(x) mutates the inner Vec.',
      'cell.borrow().len() reads the length.',
    ],
    solution: `use std::cell::RefCell;

fn main() {
    let cell = RefCell::new(Vec::new());
    cell.borrow_mut().push(1);
    cell.borrow_mut().push(2);
    cell.borrow_mut().push(3);
    println!("len = {}", cell.borrow().len());
}`,
    starter: `use std::cell::RefCell;

fn main() {
    let cell = RefCell::new(Vec::new());
    // TODO: push 1, 2, 3 then print the length
}`,
    tags: ['refcell', 'vec', 'interior-mutability'],
  },
  {
    id: 'rs-ch15-c-011',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Two Drops, One Scope',
    prompt: `Define a struct \`Tag\` holding \`id: i32\` and implement \`Drop\` to print \`drop <id>\`. In \`main\`, create two \`Tag\` values in this order: first id 1, then id 2.

Run the program and report the output. Variables are dropped in the REVERSE order of declaration, so the expected output is exactly:

drop 2
drop 1`,
    hints: [
      'Implement Drop::drop to print "drop <id>".',
      'Rust drops local variables in reverse order of creation.',
    ],
    solution: `struct Tag {
    id: i32,
}

impl Drop for Tag {
    fn drop(&mut self) {
        println!("drop {}", self.id);
    }
}

fn main() {
    let _a = Tag { id: 1 };
    let _b = Tag { id: 2 };
}`,
    starter: `struct Tag {
    id: i32,
}

impl Drop for Tag {
    fn drop(&mut self) {
        // TODO: print "drop <id>"
    }
}

fn main() {
    let _a = Tag { id: 1 };
    let _b = Tag { id: 2 };
}`,
    tags: ['drop', 'drop-order'],
  },
  {
    id: 'rs-ch15-c-012',
    chapter: 15,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Drop a Value Early',
    prompt: `Define a struct \`Guard\` holding \`name: String\` whose \`Drop\` impl prints \`releasing <name>\`. In \`main\`, create a \`Guard\` named "lock", then drop it EARLY using \`std::mem::drop\` (call it as \`drop(g)\`), and finally print \`end of main\`.

The expected output is exactly:

releasing lock
end of main`,
    hints: [
      'std::mem::drop is in the prelude, so you can call drop(g) directly.',
      'Calling drop(g) moves g and runs its Drop impl right then.',
      'The early drop must print before "end of main".',
    ],
    solution: `struct Guard {
    name: String,
}

impl Drop for Guard {
    fn drop(&mut self) {
        println!("releasing {}", self.name);
    }
}

fn main() {
    let g = Guard { name: String::from("lock") };
    drop(g);
    println!("end of main");
}`,
    starter: `struct Guard {
    name: String,
}

impl Drop for Guard {
    fn drop(&mut self) {
        println!("releasing {}", self.name);
    }
}

fn main() {
    let g = Guard { name: String::from("lock") };
    // TODO: drop g early, then print "end of main"
}`,
    tags: ['drop', 'mem-drop'],
  },
  {
    id: 'rs-ch15-c-013',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Recursive Cons List',
    prompt: `Define a recursive cons list enum:

enum List {
    Cons(i32, Box<List>),
    Nil,
}

The \`Box\` is required to give the recursive type a known size. In \`main\`, build the list 1 -> 2 -> 3 -> Nil using \`Cons\` and \`Nil\`, then print "built" once it compiles.

The expected output is exactly:

built`,
    hints: [
      'Bring the variants into scope with use List::{Cons, Nil}; or qualify them.',
      'Each Cons holds an i32 and a Box<List> pointing to the rest.',
      'The innermost element wraps Nil in a Box.',
    ],
    solution: `use crate::List::{Cons, Nil};

enum List {
    Cons(i32, Box<List>),
    Nil,
}

fn main() {
    let _list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));
    println!("built");
}`,
    starter: `enum List {
    Cons(i32, Box<List>),
    Nil,
}

fn main() {
    // TODO: build 1 -> 2 -> 3 -> Nil with Cons and Nil, then print "built"
}`,
    tags: ['box', 'recursive-types', 'cons-list'],
  },
  {
    id: 'rs-ch15-c-014',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Sum a Cons List',
    prompt: `Using the cons list enum below, write a function \`sum(list: &List) -> i32\` that returns the total of all the integers in the list.

enum List {
    Cons(i32, Box<List>),
    Nil,
}

In \`main\`, build 5 -> 10 -> 15 -> Nil and print its sum. The expected output is exactly:

30`,
    hints: [
      'Match on the list: a Cons gives a value plus the rest, Nil gives 0.',
      'For the Cons arm, return value + sum(rest). The rest is a Box<List>, and &**rest or just passing rest works thanks to deref.',
    ],
    solution: `use crate::List::{Cons, Nil};

enum List {
    Cons(i32, Box<List>),
    Nil,
}

fn sum(list: &List) -> i32 {
    match list {
        Cons(value, rest) => value + sum(rest),
        Nil => 0,
    }
}

fn main() {
    let list = Cons(5, Box::new(Cons(10, Box::new(Cons(15, Box::new(Nil))))));
    println!("{}", sum(&list));
}`,
    starter: `use crate::List::{Cons, Nil};

enum List {
    Cons(i32, Box<List>),
    Nil,
}

fn sum(list: &List) -> i32 {
    // TODO: recursively add up the integers
}

fn main() {
    let list = Cons(5, Box::new(Cons(10, Box::new(Cons(15, Box::new(Nil))))));
    println!("{}", sum(&list));
}`,
    tags: ['box', 'cons-list', 'recursion'],
  },
  {
    id: 'rs-ch15-c-015',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Elements in a Cons List',
    prompt: `With the same cons list type, write \`fn length(list: &List) -> u32\` that returns how many \`Cons\` cells the list has.

enum List {
    Cons(i32, Box<List>),
    Nil,
}

In \`main\`, build 7 -> 8 -> 9 -> 10 -> Nil and print the length. The expected output is exactly:

4`,
    hints: [
      'Nil contributes 0; a Cons contributes 1 plus the length of the rest.',
      'Recurse on the boxed rest.',
    ],
    solution: `use crate::List::{Cons, Nil};

enum List {
    Cons(i32, Box<List>),
    Nil,
}

fn length(list: &List) -> u32 {
    match list {
        Cons(_, rest) => 1 + length(rest),
        Nil => 0,
    }
}

fn main() {
    let list = Cons(7, Box::new(Cons(8, Box::new(Cons(9, Box::new(Cons(10, Box::new(Nil))))))));
    println!("{}", length(&list));
}`,
    starter: `use crate::List::{Cons, Nil};

enum List {
    Cons(i32, Box<List>),
    Nil,
}

fn length(list: &List) -> u32 {
    // TODO: count the Cons cells recursively
}

fn main() {
    let list = Cons(7, Box::new(Cons(8, Box::new(Cons(9, Box::new(Cons(10, Box::new(Nil))))))));
    println!("{}", length(&list));
}`,
    tags: ['box', 'cons-list', 'recursion'],
  },
  {
    id: 'rs-ch15-c-016',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Recursive Binary Tree With Box',
    prompt: `Define a recursive binary tree of integers:

enum Tree {
    Leaf(i32),
    Node(Box<Tree>, Box<Tree>),
}

Write \`fn sum_tree(t: &Tree) -> i32\` that adds up all leaf values. In \`main\`, build a tree whose leaves are 1, 2, and 3 arranged as Node(Node(Leaf(1), Leaf(2)), Leaf(3)) and print the total.

The expected output is exactly:

6`,
    hints: [
      'A Leaf contributes its own value.',
      'A Node contributes the sum of both subtrees.',
    ],
    solution: `enum Tree {
    Leaf(i32),
    Node(Box<Tree>, Box<Tree>),
}

fn sum_tree(t: &Tree) -> i32 {
    match t {
        Tree::Leaf(v) => *v,
        Tree::Node(left, right) => sum_tree(left) + sum_tree(right),
    }
}

fn main() {
    let tree = Tree::Node(
        Box::new(Tree::Node(Box::new(Tree::Leaf(1)), Box::new(Tree::Leaf(2)))),
        Box::new(Tree::Leaf(3)),
    );
    println!("{}", sum_tree(&tree));
}`,
    starter: `enum Tree {
    Leaf(i32),
    Node(Box<Tree>, Box<Tree>),
}

fn sum_tree(t: &Tree) -> i32 {
    // TODO: sum all leaf values recursively
}

fn main() {
    let tree = Tree::Node(
        Box::new(Tree::Node(Box::new(Tree::Leaf(1)), Box::new(Tree::Leaf(2)))),
        Box::new(Tree::Leaf(3)),
    );
    println!("{}", sum_tree(&tree));
}`,
    tags: ['box', 'recursive-types', 'tree'],
  },
  {
    id: 'rs-ch15-c-017',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Implement Deref for MyBox',
    prompt: `Define a tuple struct \`MyBox<T>(T)\` with a constructor \`MyBox::new(x)\`. Implement the \`Deref\` trait so that \`*\` returns a reference to the inner value.

In \`main\`, create \`let y = MyBox::new(5);\` and assert that \`*y == 5\`, then print "ok".

The expected output is exactly:

ok`,
    hints: [
      'Deref lives in std::ops::Deref.',
      'Set type Target = T; and return &self.0 from deref.',
      'Writing *y desugars to *(y.deref()).',
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
    assert_eq!(*y, 5);
    println!("ok");
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
        // TODO: return a reference to the inner value
    }
}

fn main() {
    let y = MyBox::new(5);
    assert_eq!(*y, 5);
    println!("ok");
}`,
    tags: ['deref', 'mybox', 'traits'],
  },
  {
    id: 'rs-ch15-c-018',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Deref Coercion Into a Function',
    prompt: `Reuse \`MyBox<T>\` with its \`Deref\` impl. Write a function \`fn hello(name: &str)\` that prints \`Hello, <name>!\`.

In \`main\`, create \`let m = MyBox::new(String::from("Rust"));\` and call \`hello(&m)\`. Deref coercion turns \`&MyBox<String>\` into \`&String\` into \`&str\` automatically.

The expected output is exactly:

Hello, Rust!`,
    hints: [
      'Because MyBox<String> derefs to String, and String derefs to str, &m coerces to &str.',
      'You do not need any manual conversions; just pass &m.',
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
    // TODO: call hello with a reference to m, relying on deref coercion
}`,
    tags: ['deref', 'deref-coercion', 'mybox'],
  },
  {
    id: 'rs-ch15-c-019',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Deref Coercion With a String Method',
    prompt: `Reuse \`MyBox<String>\` from before. Because of deref coercion, you can call \`String\` (and even \`str\`) methods directly on a \`MyBox<String>\`.

In \`main\`, create \`let m = MyBox::new(String::from("hello"));\` and print \`m.len()\` and \`m.to_uppercase()\` on separate lines.

The expected output is exactly:

5
HELLO`,
    hints: [
      'Method calls auto-deref through MyBox to String, and through String to str.',
      'len comes from str; to_uppercase comes from str as well.',
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
    let m = MyBox::new(String::from("hello"));
    println!("{}", m.len());
    println!("{}", m.to_uppercase());
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

fn main() {
    let m = MyBox::new(String::from("hello"));
    // TODO: print m.len() then m.to_uppercase()
}`,
    tags: ['deref', 'deref-coercion', 'methods'],
  },
  {
    id: 'rs-ch15-c-020',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Drop Order of Three Values',
    prompt: `Define a struct \`Step\` holding \`label: String\` whose \`Drop\` prints \`dropping <label>\`. In \`main\`, create three values in this order: "first", "second", "third".

Predict and produce the output. Since locals drop in reverse declaration order, the expected output is exactly:

dropping third
dropping second
dropping first`,
    hints: [
      'Just declare three Step values; do not call drop manually.',
      'Reverse order means the last created drops first.',
    ],
    solution: `struct Step {
    label: String,
}

impl Drop for Step {
    fn drop(&mut self) {
        println!("dropping {}", self.label);
    }
}

fn main() {
    let _a = Step { label: String::from("first") };
    let _b = Step { label: String::from("second") };
    let _c = Step { label: String::from("third") };
}`,
    starter: `struct Step {
    label: String,
}

impl Drop for Step {
    fn drop(&mut self) {
        println!("dropping {}", self.label);
    }
}

fn main() {
    // TODO: create "first", "second", "third" in that order
}`,
    tags: ['drop', 'drop-order'],
  },
  {
    id: 'rs-ch15-c-021',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Drop at the End of an Inner Scope',
    prompt: `Define a struct \`Temp\` holding \`id: i32\` whose \`Drop\` prints \`bye <id>\`. In \`main\`, open an inner block with braces, create a \`Temp\` with id 1 inside it, and after the block prints \`after block\`.

A value declared inside a block is dropped when the block ends. The expected output is exactly:

bye 1
after block`,
    hints: [
      'Use an inner { ... } scope for the Temp value.',
      'The drop runs at the closing brace, before the next println.',
    ],
    solution: `struct Temp {
    id: i32,
}

impl Drop for Temp {
    fn drop(&mut self) {
        println!("bye {}", self.id);
    }
}

fn main() {
    {
        let _t = Temp { id: 1 };
    }
    println!("after block");
}`,
    starter: `struct Temp {
    id: i32,
}

impl Drop for Temp {
    fn drop(&mut self) {
        println!("bye {}", self.id);
    }
}

fn main() {
    // TODO: create a Temp inside an inner block, then print "after block"
}`,
    tags: ['drop', 'scope', 'drop-order'],
  },
  {
    id: 'rs-ch15-c-022',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Three Owners, One Rc',
    prompt: `Create \`let a = Rc::new(String::from("data"));\`. Clone it twice (into \`b\` and \`c\`) and print the strong count after each clone.

The expected output is exactly:

count after a = 1
count after b = 2
count after c = 3`,
    hints: [
      'Use Rc::strong_count(&a) after each clone.',
      'Each Rc::clone increases the count by one.',
    ],
    solution: `use std::rc::Rc;

fn main() {
    let a = Rc::new(String::from("data"));
    println!("count after a = {}", Rc::strong_count(&a));
    let b = Rc::clone(&a);
    println!("count after b = {}", Rc::strong_count(&a));
    let c = Rc::clone(&a);
    println!("count after c = {}", Rc::strong_count(&a));
    let _ = (b, c);
}`,
    starter: `use std::rc::Rc;

fn main() {
    let a = Rc::new(String::from("data"));
    println!("count after a = {}", Rc::strong_count(&a));
    // TODO: clone into b then c, printing the count after each
}`,
    tags: ['rc', 'strong-count', 'sharing'],
  },
  {
    id: 'rs-ch15-c-023',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Rc Count Drops in a Scope',
    prompt: `Create \`let a = Rc::new(5);\`. Clone it into \`b\`. Then, inside an inner block, clone it again into \`c\` and print the count. After the block ends (dropping \`c\`), print the count once more.

The expected output is exactly:

inside = 3
outside = 2`,
    hints: [
      'Cloning inside the block raises the count to 3.',
      'When the block ends, c is dropped and the count falls back to 2.',
    ],
    solution: `use std::rc::Rc;

fn main() {
    let a = Rc::new(5);
    let b = Rc::clone(&a);
    {
        let c = Rc::clone(&a);
        println!("inside = {}", Rc::strong_count(&a));
        let _ = c;
    }
    println!("outside = {}", Rc::strong_count(&a));
    let _ = b;
}`,
    starter: `use std::rc::Rc;

fn main() {
    let a = Rc::new(5);
    let b = Rc::clone(&a);
    {
        // TODO: clone into c and print "inside = <count>"
    }
    // TODO: print "outside = <count>"
    let _ = b;
}`,
    tags: ['rc', 'strong-count', 'drop'],
  },
  {
    id: 'rs-ch15-c-024',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Two Cons Lists Sharing a Tail With Rc',
    prompt: `Define a cons list whose tail is shared via \`Rc\`:

enum List {
    Cons(i32, Rc<List>),
    Nil,
}

In \`main\`, build a shared tail \`a\` = 10 -> 5 -> Nil. Then create two lists \`b\` = 3 -> a and \`c\` = 4 -> a, both pointing at the same \`a\` using \`Rc::clone\`. Print the strong count of \`a\` once both \`b\` and \`c\` exist.

The expected output is exactly:

3`,
    hints: [
      'a itself is one strong reference; b and c each add one more.',
      'Each Cons holds an Rc<List> for its tail, created with Rc::clone(&a).',
    ],
    solution: `use std::rc::Rc;
use crate::List::{Cons, Nil};

enum List {
    Cons(i32, Rc<List>),
    Nil,
}

fn main() {
    let a = Rc::new(Cons(10, Rc::new(Cons(5, Rc::new(Nil)))));
    let _b = Cons(3, Rc::clone(&a));
    let _c = Cons(4, Rc::clone(&a));
    println!("{}", Rc::strong_count(&a));
}`,
    starter: `use std::rc::Rc;
use crate::List::{Cons, Nil};

enum List {
    Cons(i32, Rc<List>),
    Nil,
}

fn main() {
    let a = Rc::new(Cons(10, Rc::new(Cons(5, Rc::new(Nil)))));
    // TODO: create b and c sharing a, then print the strong count of a
}`,
    tags: ['rc', 'cons-list', 'sharing'],
  },
  {
    id: 'rs-ch15-c-025',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Settable Counter With RefCell',
    prompt: `Define a struct \`Counter\` with one field \`value: RefCell<i32>\`. Give it a method \`fn increment(&self)\` that adds 1 to the inner value through \`borrow_mut\`, and a method \`fn get(&self) -> i32\` that reads it with \`borrow\`.

Notice that \`increment\` takes \`&self\`, not \`&mut self\`, yet still mutates. In \`main\`, create a counter, increment it three times, and print \`get()\`.

The expected output is exactly:

3`,
    hints: [
      'RefCell gives interior mutability: you can change the inner value through a shared reference.',
      'self.value.borrow_mut() yields a mutable reference; dereference with * to assign.',
      'self.value.borrow() yields the value to read.',
    ],
    solution: `use std::cell::RefCell;

struct Counter {
    value: RefCell<i32>,
}

impl Counter {
    fn increment(&self) {
        *self.value.borrow_mut() += 1;
    }
    fn get(&self) -> i32 {
        *self.value.borrow()
    }
}

fn main() {
    let c = Counter { value: RefCell::new(0) };
    c.increment();
    c.increment();
    c.increment();
    println!("{}", c.get());
}`,
    starter: `use std::cell::RefCell;

struct Counter {
    value: RefCell<i32>,
}

impl Counter {
    fn increment(&self) {
        // TODO: add 1 through borrow_mut
    }
    fn get(&self) -> i32 {
        // TODO: read the value through borrow
    }
}

fn main() {
    let c = Counter { value: RefCell::new(0) };
    c.increment();
    c.increment();
    c.increment();
    println!("{}", c.get());
}`,
    tags: ['refcell', 'interior-mutability', 'methods'],
  },
  {
    id: 'rs-ch15-c-026',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Mock Logger With RefCell',
    prompt: `Build a tiny mock object. Define a struct \`MockLogger\` with a field \`messages: RefCell<Vec<String>>\`. Add a method \`fn log(&self, msg: &str)\` that pushes the message (as a \`String\`) into the vector, even though \`log\` only takes \`&self\`.

In \`main\`, create a \`MockLogger\`, log "a" and "b", then print how many messages were recorded.

The expected output is exactly:

2`,
    hints: [
      'This mirrors the mock-object example from the book: record calls behind a RefCell.',
      'self.messages.borrow_mut().push(String::from(msg)) records a call.',
      'self.messages.borrow().len() reads the count.',
    ],
    solution: `use std::cell::RefCell;

struct MockLogger {
    messages: RefCell<Vec<String>>,
}

impl MockLogger {
    fn log(&self, msg: &str) {
        self.messages.borrow_mut().push(String::from(msg));
    }
}

fn main() {
    let logger = MockLogger { messages: RefCell::new(Vec::new()) };
    logger.log("a");
    logger.log("b");
    println!("{}", logger.messages.borrow().len());
}`,
    starter: `use std::cell::RefCell;

struct MockLogger {
    messages: RefCell<Vec<String>>,
}

impl MockLogger {
    fn log(&self, msg: &str) {
        // TODO: record the message in the RefCell vector
    }
}

fn main() {
    let logger = MockLogger { messages: RefCell::new(Vec::new()) };
    logger.log("a");
    logger.log("b");
    println!("{}", logger.messages.borrow().len());
}`,
    tags: ['refcell', 'mock-object', 'interior-mutability'],
  },
  {
    id: 'rs-ch15-c-027',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Shared Mutable Value With Rc and RefCell',
    prompt: `Combine \`Rc\` and \`RefCell\` so that multiple owners can mutate the same value. Create \`let shared = Rc::new(RefCell::new(0));\`, clone it into \`a\` and \`b\`, mutate the value through \`a\` (set it to 100), and read the result through \`b\`.

The expected output is exactly:

100`,
    hints: [
      'Rc<RefCell<T>> gives shared ownership plus interior mutability.',
      'a.borrow_mut() reaches the inner i32 through the Rc via deref coercion.',
      'Because a and b point to the same cell, the change is visible through b.',
    ],
    solution: `use std::rc::Rc;
use std::cell::RefCell;

fn main() {
    let shared = Rc::new(RefCell::new(0));
    let a = Rc::clone(&shared);
    let b = Rc::clone(&shared);
    *a.borrow_mut() = 100;
    println!("{}", b.borrow());
}`,
    starter: `use std::rc::Rc;
use std::cell::RefCell;

fn main() {
    let shared = Rc::new(RefCell::new(0));
    let a = Rc::clone(&shared);
    let b = Rc::clone(&shared);
    // TODO: set the value to 100 through a, then read it through b
}`,
    tags: ['rc', 'refcell', 'shared-mutability'],
  },
  {
    id: 'rs-ch15-c-028',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Shared Tally Across Handles',
    prompt: `Use \`Rc<RefCell<i32>>\` to model a tally that several handles can update. Create the shared tally starting at 0, make two clones \`h1\` and \`h2\`, add 3 through \`h1\` and add 4 through \`h2\`, then print the final value through the original.

The expected output is exactly:

7`,
    hints: [
      'Each handle is an Rc clone pointing at the same RefCell.',
      'Use *handle.borrow_mut() += n to add through a handle.',
    ],
    solution: `use std::rc::Rc;
use std::cell::RefCell;

fn main() {
    let tally = Rc::new(RefCell::new(0));
    let h1 = Rc::clone(&tally);
    let h2 = Rc::clone(&tally);
    *h1.borrow_mut() += 3;
    *h2.borrow_mut() += 4;
    println!("{}", tally.borrow());
}`,
    starter: `use std::rc::Rc;
use std::cell::RefCell;

fn main() {
    let tally = Rc::new(RefCell::new(0));
    let h1 = Rc::clone(&tally);
    let h2 = Rc::clone(&tally);
    // TODO: add 3 through h1 and 4 through h2, then print the tally
}`,
    tags: ['rc', 'refcell', 'shared-mutability'],
  },
  {
    id: 'rs-ch15-c-029',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Shared, Mutable Cons List Value',
    prompt: `Define a cons list whose head value is an \`Rc<RefCell<i32>>\`:

enum List {
    Cons(Rc<RefCell<i32>>, Rc<List>),
    Nil,
}

In \`main\`, create a shared value starting at 5. Build a list \`a\` = value -> Nil. Then mutate the shared value to add 10 (so it becomes 15). Print the new value via the shared handle.

The expected output is exactly:

15`,
    hints: [
      'Keep the original Rc<RefCell<i32>> handle so you can mutate after building the list.',
      'value.borrow_mut() reaches the inner i32.',
      'Wrap the same Rc::clone(&value) inside the Cons.',
    ],
    solution: `use std::rc::Rc;
use std::cell::RefCell;
use crate::List::{Cons, Nil};

enum List {
    Cons(Rc<RefCell<i32>>, Rc<List>),
    Nil,
}

fn main() {
    let value = Rc::new(RefCell::new(5));
    let _a = Rc::new(Cons(Rc::clone(&value), Rc::new(Nil)));
    *value.borrow_mut() += 10;
    println!("{}", value.borrow());
}`,
    starter: `use std::rc::Rc;
use std::cell::RefCell;
use crate::List::{Cons, Nil};

enum List {
    Cons(Rc<RefCell<i32>>, Rc<List>),
    Nil,
}

fn main() {
    let value = Rc::new(RefCell::new(5));
    let _a = Rc::new(Cons(Rc::clone(&value), Rc::new(Nil)));
    // TODO: add 10 to the shared value, then print it
}`,
    tags: ['rc', 'refcell', 'cons-list'],
  },
  {
    id: 'rs-ch15-c-030',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Drop a Box Explicitly',
    prompt: `Define a struct \`Big\` holding \`tag: i32\` whose \`Drop\` prints \`free <tag>\`. In \`main\`, allocate a \`Box<Big>\` with tag 9, print \`before\`, then drop the box early with \`std::mem::drop\`, then print \`after\`.

The expected output is exactly:

before
free 9
after`,
    hints: [
      'Box owns its contents, so dropping the Box drops the Big inside it.',
      'drop(b) moves and frees the Box immediately.',
    ],
    solution: `struct Big {
    tag: i32,
}

impl Drop for Big {
    fn drop(&mut self) {
        println!("free {}", self.tag);
    }
}

fn main() {
    let b = Box::new(Big { tag: 9 });
    println!("before");
    drop(b);
    println!("after");
}`,
    starter: `struct Big {
    tag: i32,
}

impl Drop for Big {
    fn drop(&mut self) {
        println!("free {}", self.tag);
    }
}

fn main() {
    let b = Box::new(Big { tag: 9 });
    println!("before");
    // TODO: drop the box early, then print "after"
}`,
    tags: ['box', 'drop', 'mem-drop'],
  },
  {
    id: 'rs-ch15-c-031',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Detect a Borrow Conflict at Runtime',
    prompt: `RefCell enforces the borrowing rules at RUNTIME, not compile time. Using \`borrow_mut\` twice at the same time panics.

Create \`let cell = RefCell::new(1);\`. Write code that takes a \`borrow_mut\` into a variable, then prints \`got first borrow\`, then while that borrow is still alive calls \`try_borrow_mut\` and prints whether it succeeded (\`is_err\` will be true).

The expected output is exactly:

got first borrow
second borrow failed: true`,
    hints: [
      'Keep the first borrow_mut bound to a variable so it stays alive.',
      'try_borrow_mut returns a Result; call .is_err() on it.',
      'While a mutable borrow is held, another borrow_mut is not allowed.',
    ],
    solution: `use std::cell::RefCell;

fn main() {
    let cell = RefCell::new(1);
    let first = cell.borrow_mut();
    println!("got first borrow");
    let second = cell.try_borrow_mut();
    println!("second borrow failed: {}", second.is_err());
    let _ = first;
}`,
    starter: `use std::cell::RefCell;

fn main() {
    let cell = RefCell::new(1);
    let first = cell.borrow_mut();
    println!("got first borrow");
    // TODO: try a second borrow_mut and report whether it failed
    let _ = first;
}`,
    tags: ['refcell', 'runtime-borrow', 'interior-mutability'],
  },
  {
    id: 'rs-ch15-c-032',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Child Pointing to Its Parent With Weak',
    prompt: `Build a parent/child pair where the child holds a NON-owning reference to its parent using \`Weak\` (from \`std::rc::Weak\`).

Define:

struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
}

In \`main\`, create a leaf node (value 3) whose parent is initially \`Weak::new()\`. Create a branch node (value 5). Set the leaf's parent to the branch using \`Rc::downgrade(&branch)\`. Then upgrade the leaf's parent and print the parent's value.

The expected output is exactly:

parent value = 5`,
    hints: [
      'Rc::downgrade(&branch) creates a Weak<Node> that does not keep branch alive.',
      'Store it with *leaf.parent.borrow_mut() = Rc::downgrade(&branch).',
      'upgrade() returns Option<Rc<Node>>; unwrap it to read the parent value.',
    ],
    solution: `use std::rc::{Rc, Weak};
use std::cell::RefCell;

struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
}

fn main() {
    let leaf = Rc::new(Node {
        value: 3,
        parent: RefCell::new(Weak::new()),
    });
    let branch = Rc::new(Node {
        value: 5,
        parent: RefCell::new(Weak::new()),
    });
    *leaf.parent.borrow_mut() = Rc::downgrade(&branch);
    let parent = leaf.parent.borrow().upgrade().unwrap();
    println!("parent value = {}", parent.value);
}`,
    starter: `use std::rc::{Rc, Weak};
use std::cell::RefCell;

struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
}

fn main() {
    let leaf = Rc::new(Node {
        value: 3,
        parent: RefCell::new(Weak::new()),
    });
    let branch = Rc::new(Node {
        value: 5,
        parent: RefCell::new(Weak::new()),
    });
    // TODO: set leaf's parent to branch via downgrade, then upgrade and print the value
}`,
    tags: ['weak', 'rc', 'parent-child'],
  },
  {
    id: 'rs-ch15-c-033',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Upgrade a Dangling Weak',
    prompt: `A \`Weak\` reference does not keep its target alive, so after the target is dropped, \`upgrade\` returns \`None\`.

In \`main\`, create \`let strong = Rc::new(42);\` and \`let weak = Rc::downgrade(&strong);\`. Print whether \`weak.upgrade()\` is some value (it is). Then \`drop(strong)\` and print whether \`weak.upgrade()\` is some value again (now it is not).

The expected output is exactly:

alive: true
alive: false`,
    hints: [
      'Rc::downgrade creates a Weak from an Rc.',
      'upgrade() returns Option<Rc<T>>; use .is_some() to test it.',
      'After dropping the only strong reference, the value is freed and upgrade yields None.',
    ],
    solution: `use std::rc::Rc;

fn main() {
    let strong = Rc::new(42);
    let weak = Rc::downgrade(&strong);
    println!("alive: {}", weak.upgrade().is_some());
    drop(strong);
    println!("alive: {}", weak.upgrade().is_some());
}`,
    starter: `use std::rc::Rc;

fn main() {
    let strong = Rc::new(42);
    let weak = Rc::downgrade(&strong);
    println!("alive: {}", weak.upgrade().is_some());
    // TODO: drop the strong Rc, then print whether the weak is still alive
}`,
    tags: ['weak', 'rc', 'upgrade'],
  },
  {
    id: 'rs-ch15-c-034',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Strong and Weak Counts',
    prompt: `Rc tracks both a strong count and a weak count. Create \`let a = Rc::new(5);\`, then create a \`Weak\` with \`Rc::downgrade(&a)\`.

Print the strong count and the weak count of \`a\`, in that order. A Weak reference increments the weak count but not the strong count.

The expected output is exactly:

strong = 1
weak = 1`,
    hints: [
      'Rc::strong_count(&a) reports owners; Rc::weak_count(&a) reports Weak references.',
      'Downgrading does not change the strong count.',
    ],
    solution: `use std::rc::Rc;

fn main() {
    let a = Rc::new(5);
    let w = Rc::downgrade(&a);
    println!("strong = {}", Rc::strong_count(&a));
    println!("weak = {}", Rc::weak_count(&a));
    let _ = w;
}`,
    starter: `use std::rc::Rc;

fn main() {
    let a = Rc::new(5);
    let w = Rc::downgrade(&a);
    // TODO: print the strong count then the weak count of a
    let _ = w;
}`,
    tags: ['weak', 'rc', 'strong-count'],
  },
  {
    id: 'rs-ch15-c-035',
    chapter: 15,
    kind: 'coding',
    difficulty: 'easy',
    title: 'A Parent Owning Children',
    prompt: `Build a small tree where a parent owns its children with \`Rc\`, and each child holds a \`Weak\` link back to its parent.

struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
}

In \`main\`: create a \`leaf\` with value 3 (empty children, empty parent). Create a \`branch\` with value 5 whose \`children\` contains a clone of \`leaf\`. Set the leaf's \`parent\` to a downgrade of \`branch\`. Finally, print the leaf's parent value and the number of children in the branch.

The expected output is exactly:

leaf parent = 5
branch children = 1`,
    hints: [
      'children is RefCell<Vec<Rc<Node>>>; build branch with vec![Rc::clone(&leaf)].',
      'Set the parent with *leaf.parent.borrow_mut() = Rc::downgrade(&branch).',
      'Read the parent value via leaf.parent.borrow().upgrade().unwrap().value, and the child count via branch.children.borrow().len().',
    ],
    solution: `use std::rc::{Rc, Weak};
use std::cell::RefCell;

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
    let parent = leaf.parent.borrow().upgrade().unwrap();
    println!("leaf parent = {}", parent.value);
    println!("branch children = {}", branch.children.borrow().len());
}`,
    starter: `use std::rc::{Rc, Weak};
use std::cell::RefCell;

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
    // TODO: set leaf's parent to branch, then print the parent value and child count
}`,
    tags: ['weak', 'rc', 'refcell', 'tree'],
  },
]

export default problems
