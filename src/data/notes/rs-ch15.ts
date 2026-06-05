import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-rs-15',
  track: 'rust',
  chapter: 15,
  title: 'Smart Pointers',
  summary: `A smart pointer is a value that behaves like a reference but owns the data it points to and carries extra capabilities or bookkeeping. Chapter 15 introduces the core smart pointers in the standard library, Box for putting data on the heap, Rc for shared ownership, and RefCell for interior mutability, along with the traits that make them feel like ordinary references, namely Deref and Drop. It also confronts the dark side, how Rc and RefCell together let you build cyclic data that leaks memory, and how Weak breaks those cycles. These tools are how you express the data structures, graphs, trees, and shared state that Rust's strict ownership rules would otherwise forbid, which is exactly the territory you enter when contributing to real systems code.`,
  sections: [
    {
      heading: 'What a smart pointer is, and Box for the heap',
      body: `A plain reference, written with an ampersand, only borrows a value, it points at data owned by someone else and adds no overhead. A *smart pointer*, by contrast, is usually a struct that *owns* the data it refers to and implements two key traits: **Deref**, which lets it be used with the dereference operator like a reference, and **Drop**, which lets it run cleanup code when it goes out of scope. Strings and vectors are smart pointers too, they own a heap buffer and track length and capacity, but this chapter focuses on the more pointer-like types.

The simplest smart pointer is **Box**. A Box is a single-owner pointer to a value stored on the heap. The box value itself, the pointer, lives on the stack and is just one machine word, while the value it owns lives on the heap. A Box adds no performance overhead beyond that indirection, and it has no special runtime bookkeeping, which is why you reach for it first.

There are three situations where Box earns its place:

1. When you have a value whose size is not known at compile time and you need to use it in a context that requires a fixed size. This is the recursive-type case, covered in the next section.
2. When you have a large amount of data and you want to transfer ownership without copying all of it. Moving a Box moves one pointer, not the whole buffer.
3. When you want to own a value but only care that it implements a particular trait, rather than its concrete type. This is a *trait object*, written as Box of dyn SomeTrait.

> Pitfall: do not box things reflexively. A Box for a small value that is only ever used locally just adds a pointless heap allocation and an indirection. Use it when you actually need heap placement, ownership transfer of large data, or type erasure.`,
      code: [
        {
          lang: 'rust',
          src: `fn main() {
    // The value 5 lives on the heap; b is a pointer on the stack.
    let b = Box::new(5);
    println!("b = {}", b); // Deref lets us use b like &i32

    // Box is dropped here at the end of scope: the heap
    // allocation is freed automatically, no manual free needed.
}`
        }
      ]
    },
    {
      heading: 'Recursive types: why Box makes them compile',
      body: `Rust must know the size of every type at compile time so it can lay values out on the stack. A *recursive type* is one that contains a value of its own type as part of itself, the classic example being a cons list, a linked list built from pairs where each pair holds a value and the rest of the list.

If you write the list so that each node directly contains the next node by value, the compiler tries to compute the size by adding up the size of a node, which contains a node, which contains a node, forever. The size is infinite, so the compiler rejects it. The error message even suggests the fix: insert some *indirection*, store the next element behind a pointer instead of inline.

That is exactly what Box provides. A Box is always one pointer wide regardless of how big the pointed-to value is, because the value lives on the heap and the Box only stores its address. So a node that holds a Box of the next node has a known, finite size: one value plus one pointer. The recursion is broken not by removing it conceptually but by making the recursive part a fixed-size pointer.

This is the foundational pattern behind every heap-allocated data structure you will write or read in systems code: trees, lists, and graphs all rely on putting the recursive part behind a pointer so the parent has a definite size.

> Why this matters for kernel and low-level work: the same reasoning, indirection to get a known size, is why intrusive lists and tree nodes in C use pointers. Rust just makes the requirement explicit and checks it.`,
      code: [
        {
          lang: 'rust',
          src: `// Without Box this fails: "recursive type has infinite size".
// With Box, each Cons node is one i32 plus one pointer-sized Box.
enum List {
    Cons(i32, Box<List>),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    // Builds the list 1 -> 2 -> 3 -> Nil on the heap.
    let list = Cons(1, Box::new(Cons(2, Box::new(Cons(3, Box::new(Nil))))));
    if let Cons(head, _) = list {
        println!("head = {}", head);
    }
}`
        }
      ]
    },
    {
      heading: 'The Deref trait and deref coercion',
      body: `Implementing **Deref** lets you customize what the dereference operator, the leading star, does for your type, so a smart pointer can be treated like a plain reference. For a regular reference, the star follows the pointer to the value. For a type that implements Deref, writing star value actually calls the deref method and then dereferences the reference it returns. The compiler rewrites star value into star (value dot deref of nothing) behind the scenes.

The crucial design point is that **deref returns a reference**, not the owned value. If it returned the value itself, ownership would move out of the smart pointer every time you dereferenced it, which is almost never what you want. Returning a reference keeps the smart pointer in charge of its data.

The feature that makes all of this feel seamless is **deref coercion**. When you pass a reference to a value into a function or method that expects a reference to a different type, the compiler will automatically apply deref, repeatedly if necessary, to convert it. The standard example is passing a reference to a String where a reference to a str is expected, String implements Deref to str, so the conversion is automatic and you never write a manual conversion. This is resolved entirely at compile time, so it has zero runtime cost.

Coercion follows three rules based on mutability:

- From a shared reference of T to a shared reference of U when T derefs to U.
- From a mutable reference of T to a mutable reference of U when T derefs to U.
- From a mutable reference of T to a *shared* reference of U. The reverse, turning a shared reference into a mutable one, is never allowed, because that would violate the borrowing rules.

There is a separate trait, DerefMut, for the mutable case. Together these are why you can call str methods directly on a String, or vector methods on a Box of a vector, without ceremony.

> Pitfall: deref coercion only happens at call boundaries where the target type is known (function arguments, method receivers), not in arbitrary expressions. If a conversion you expected does not happen, check that the target type is actually being demanded by the context.`,
      code: [
        {
          lang: 'rust',
          src: `use std::ops::Deref;

struct MyBox<T>(T);

impl<T> MyBox<T> {
    fn new(x: T) -> MyBox<T> {
        MyBox(x)
    }
}

impl<T> Deref for MyBox<T> {
    type Target = T;
    fn deref(&self) -> &T {
        &self.0 // return a reference; ownership stays in MyBox
    }
}

fn hello(name: &str) {
    println!("Hello, {}!", name);
}

fn main() {
    let m = MyBox::new(String::from("Rust"));
    // Deref coercion: &MyBox<String> -> &String -> &str,
    // all applied automatically at the call site.
    hello(&m);

    // Manual equivalent if coercion did not exist:
    hello(&(*m)[..]);
}`
        }
      ]
    },
    {
      heading: 'The Drop trait and drop order',
      body: `**Drop** lets you specify what happens when a value goes out of scope. You implement it by providing a single drop method that takes a mutable reference to self. The compiler inserts a call to this method automatically at the end of the value's scope, you never call drop yourself directly. This is Rust's version of a destructor, and it is the foundation of the RAII pattern: a value acquires a resource when it is created and releases it in drop, so resources like files, locks, and heap allocations are always cleaned up exactly once, even on an early return or a panic.

The order in which values are dropped is precise and worth memorizing, because it matters for correctness when resources depend on each other:

- Variables are dropped in **reverse order** of their declaration. The last value created is the first destroyed, like unwinding a stack. This guarantees that if a later value borrowed from an earlier one, the borrower is gone before the thing it borrowed.
- The fields of a struct are dropped in declaration order, top to bottom.
- When a value owns other values (a struct owning its fields, a Box owning its contents), dropping the outer value recursively drops everything it owns.

You are not allowed to call the drop method by hand, the compiler forbids it, because that would let you free a value while it is still considered live, causing a double free when the automatic drop runs later. When you genuinely need to drop something *early*, before the end of its scope, you call the free function std::mem::drop, conventionally just written as drop, passing the value by move. This is common for releasing a lock before doing slow work that does not need it.

> Pitfall: a struct cannot both implement Drop and be Copy, those are mutually exclusive, because a Copy type is bit-copied freely and there would be no single owner responsible for running drop.`,
      code: [
        {
          lang: 'rust',
          src: `struct Guard {
    name: String,
}

impl Drop for Guard {
    fn drop(&mut self) {
        println!("Dropping Guard {}", self.name);
    }
}

fn main() {
    let _a = Guard { name: String::from("a") };
    let b = Guard { name: String::from("b") };

    // Drop b early, before the end of main, by moving it
    // into std::mem::drop. Calling b.drop() directly is an error.
    drop(b);
    println!("b was dropped before this line");

    // At the end of scope, remaining values drop in REVERSE
    // declaration order, so _a is dropped here, last.
}
// Output order: Dropping Guard b, then the message,
// then Dropping Guard a at end of main.`
        }
      ]
    },
    {
      heading: 'Rc for shared ownership',
      body: `Box assumes a single owner. But some data genuinely has *multiple* owners, think of a graph node pointed to by several edges, where the node should live as long as any edge still references it. You cannot express this with single ownership, because no one owner knows when it is safe to free the data.

**Rc**, the reference-counted pointer, solves this. Rc keeps a count of how many owners a value currently has. Calling Rc::clone increments that count and hands back another Rc pointing at the *same* heap allocation, it does not deep-copy the data. When each Rc is dropped, the count decreases, and only when the count reaches zero is the underlying value actually freed. This is how the data stays alive exactly as long as someone needs it and not a moment longer.

Two conventions matter. First, prefer writing Rc::clone(reference to the rc) rather than the rc dot clone of nothing. Both work, but the explicit form visually flags that this is a cheap reference-count bump, not a potentially expensive deep clone, which helps readers reason about performance. Second, you can inspect the live count with Rc::strong_count for debugging and for understanding lifetimes.

The hard limits to internalize:

- Rc is for **single-threaded** scenarios only. It is not thread-safe, the count is updated without synchronization. The thread-safe equivalent is **Arc** (atomic reference counted), which is identical in spirit but uses atomic operations for the count and so costs a little more. Reach for Arc the moment shared data crosses a thread boundary.
- Rc only gives you **shared, immutable** access to the data, because multiple owners holding mutable references would violate the borrowing rules. To mutate data behind an Rc you combine it with RefCell, covered next.`,
      code: [
        {
          lang: 'rust',
          src: `use std::rc::Rc;

enum List {
    Cons(i32, Rc<List>),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    // a is shared by both b and c; Rc keeps it alive for both.
    let a = Rc::new(Cons(5, Rc::new(Cons(10, Rc::new(Nil)))));
    println!("count after creating a = {}", Rc::strong_count(&a));

    let _b = Cons(3, Rc::clone(&a)); // count -> 2, no deep copy
    println!("count after creating b = {}", Rc::strong_count(&a));

    {
        let _c = Cons(4, Rc::clone(&a)); // count -> 3
        println!("count after creating c = {}", Rc::strong_count(&a));
    } // _c dropped here, count -> 2

    println!("count after c goes out of scope = {}", Rc::strong_count(&a));
}`
        }
      ]
    },
    {
      heading: 'RefCell and interior mutability',
      body: `Normally the borrow checker enforces the borrowing rules at *compile time*: you may have either one mutable reference or any number of shared references, never both, and references must always be valid. This is checked statically and rejected code never runs. But sometimes you know a pattern is safe even though the compiler cannot prove it. *Interior mutability* is the design pattern that lets you mutate data even when there are only shared references to it, by using unsafe code internally that is wrapped in a safe API.

**RefCell** is the standard single-threaded tool for this. The key difference from a normal reference is *when* the rules are enforced: RefCell moves the borrow checking from compile time to **runtime**. You ask a RefCell for access using two methods, borrow, which returns a smart pointer (a Ref) giving shared access, and borrow_mut, which returns a smart pointer (a RefMut) giving exclusive access. RefCell tracks how many of each are currently outstanding.

The rules are exactly the same as the compile-time ones, at most one mutable borrow or any number of shared borrows at once, but now they are checked dynamically. If you break them, for example calling borrow_mut while a borrow is still live, the program **panics** at runtime rather than failing to compile. You have traded a compile-time guarantee for flexibility, and the cost of breaking the rule is a crash instead of a build error.

Why accept that trade? Because some valid designs cannot be expressed within the static rules. A classic case is a *mock object* in a test that records calls: it needs to mutate its internal log through the shared reference that the trait method signature gives it. RefCell makes that possible while still upholding the borrowing rules at runtime.

A quick comparison of the three types from this chapter:

- Box gives single ownership and compile-time borrow checking.
- Rc gives multiple owners and compile-time borrow checking (but only shared access).
- RefCell gives single ownership and *runtime* borrow checking, with interior mutability.

> Pitfall: because the check is at runtime, a borrowing bug in a rarely-taken code path can ship undetected and panic in production. Keep borrows short, and avoid holding a Ref or RefMut across a call that might itself borrow the same cell. RefCell is also single-threaded only; the thread-safe interior-mutability tool is Mutex.`,
      code: [
        {
          lang: 'rust',
          src: `use std::cell::RefCell;

fn main() {
    let data = RefCell::new(vec![1, 2, 3]);

    // Mutate through a SHARED reference to the RefCell.
    data.borrow_mut().push(4);

    // Read access; the borrow is released at the end of the statement.
    println!("len = {}", data.borrow().len());

    // This pattern PANICS at runtime: two live borrows, one mutable.
    // let a = data.borrow_mut();
    // let b = data.borrow_mut(); // already mutably borrowed -> panic
}`
        }
      ]
    },
    {
      heading: 'Rc of RefCell: shared, mutable data',
      body: `Rc and RefCell are most powerful in combination, and the pattern **Rc of RefCell of T** is one you will see constantly in real Rust code. Each piece supplies what the other lacks:

- Rc gives you *multiple owners* of the same data, but only shared, read-only access.
- RefCell gives you *interior mutability*, the ability to mutate through a shared reference, but only a single owner.

Wrap a RefCell inside an Rc and you get data that has many owners *and* can be mutated by any of them. The Rc is cloned to share ownership; through any clone you call borrow_mut on the inner RefCell to change the value, and every other owner sees the change because they all point at the same allocation. This is how you build shared mutable state, a shared counter, a node in a graph that several other nodes can update, a tree where children can be reparented, without violating Rust's safety guarantees.

The mental model: Rc is the outer shell answering "who owns this and is it still alive", RefCell is the inner shell answering "who is allowed to look at or change it right now". The data lives in the middle.

For multithreaded code the analogous pattern is Arc of Mutex of T (or Arc of RwLock of T), Arc for thread-safe shared ownership, Mutex for thread-safe interior mutability with locking. The shape is identical; only the safety guarantees and cost change.

> Pitfall: the convenience is real but so is the danger. Once data has multiple owners and is mutable, you can create *reference cycles*, the subject of the final section, which leak memory. Rc of RefCell is exactly the combination that makes cycles possible.`,
      code: [
        {
          lang: 'rust',
          src: `use std::cell::RefCell;
use std::rc::Rc;

#[derive(Debug)]
enum List {
    Cons(Rc<RefCell<i32>>, Rc<List>),
    Nil,
}

use List::{Cons, Nil};

fn main() {
    // value is shared AND mutable.
    let value = Rc::new(RefCell::new(5));

    // a holds value; b and c both share a.
    let a = Rc::new(Cons(Rc::clone(&value), Rc::new(Nil)));
    let _b = Cons(Rc::new(RefCell::new(3)), Rc::clone(&a));
    let _c = Cons(Rc::new(RefCell::new(4)), Rc::clone(&a));

    // Mutate the shared value through borrow_mut; all owners see it.
    *value.borrow_mut() += 10;

    println!("a after mutation = {:?}", a); // shows 15
}`
        }
      ]
    },
    {
      heading: 'Reference cycles and Weak',
      body: `Rust's compile-time checks prevent most memory bugs, but they do not, and cannot in general, prevent **memory leaks**. With Rc of RefCell you can create a *reference cycle*: item A holds an Rc to item B, and item B holds an Rc to item A. Now each one's strong count includes the other, so neither count can ever reach zero, even after every external variable referring to them is gone. The objects keep each other alive forever, and their memory is leaked. Dropping the outer handles is not enough, because the cycle internally props itself up.

Leaking memory is not *unsafe* in Rust's technical sense, it does not cause undefined behavior, so it is allowed, but it is still a bug. Preventing it is your responsibility, not the compiler's.

The fix is **Weak**. Alongside the strong count, every Rc also maintains a *weak count*. You create a Weak reference by calling Rc::downgrade on an Rc. The crucial property: **a weak reference does not affect the strong count**, so it does *not* keep the value alive. Because the value it points to might already have been dropped, a Weak does not give you the data directly. Instead you call the upgrade method on it, which returns an Option, Some of an Rc if the value is still alive (which momentarily bumps the strong count for as long as you hold that Rc), or None if it has already been freed.

This gives a clean rule for designing linked structures: model **ownership with strong Rc references and back-references with Weak**. In a tree, a parent owns its children with Rc, so the children live as long as the parent. Each child refers back to its parent with Weak, so a child does not keep its parent alive, and the cycle is broken. The value is freed as soon as its strong count hits zero, regardless of how many Weak references still dangle, and those Weak references then simply upgrade to None.

> Pitfall: the direction matters. Make the "owning" direction strong and the "referring back" direction weak. Getting it backwards either recreates the leak or causes data to be freed too early. When debugging lifetime issues in such structures, inspect both Rc::strong_count and Rc::weak_count.`,
      code: [
        {
          lang: 'rust',
          src: `use std::cell::RefCell;
use std::rc::{Rc, Weak};

#[derive(Debug)]
struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,   // back-reference: Weak, no leak
    children: RefCell<Vec<Rc<Node>>>, // ownership: strong Rc
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

    // Point leaf's parent at branch WITHOUT a strong reference.
    *leaf.parent.borrow_mut() = Rc::downgrade(&branch);

    // upgrade() returns Some while branch is alive, None after it drops.
    if let Some(p) = leaf.parent.borrow().upgrade() {
        println!("leaf's parent value = {}", p.value);
    }

    // strong_count of branch stays 1: the Weak does not inflate it,
    // so when branch goes out of scope it is correctly freed.
    println!("branch strong = {}, weak = {}",
        Rc::strong_count(&branch), Rc::weak_count(&branch));
}`
        }
      ]
    }
  ],
  takeaways: [
    'A smart pointer owns its data and implements Deref (so it acts like a reference) and usually Drop (so it cleans up); plain references only borrow.',
    'Box is a single-owner heap pointer with no runtime overhead; use it for recursive types, cheap transfer of large data, and trait objects.',
    'Recursive types need indirection to have a known size; a Box is always one pointer wide, which breaks the infinite-size recursion.',
    'Deref returns a reference (never the owned value), and deref coercion auto-converts references at call sites at zero runtime cost, e.g. &String to &str.',
    'Drop runs at end of scope in reverse declaration order; you cannot call drop yourself, but std::mem::drop forces an early drop by moving the value.',
    'Rc enables multiple owners via a strong count and gives shared, immutable, single-threaded access; Arc is its thread-safe (atomic) counterpart.',
    'RefCell moves borrow checking to runtime, enabling interior mutability; breaking the rules panics instead of failing to compile.',
    'Rc of RefCell is the canonical pattern for shared mutable data (Arc of Mutex across threads); it is also what makes reference cycles possible.',
    'Reference cycles leak memory because strong counts never reach zero; model ownership with strong Rc and back-references with Weak, and upgrade() to access weakly-held data safely.'
  ],
  cheatsheet: [
    { label: 'Box::new(v)', value: 'Allocate v on the heap behind a single-owner pointer' },
    { label: 'Box<dyn Trait>', value: 'Trait object: own a value by the trait it implements' },
    { label: 'impl Deref', value: 'Make a type usable with * and enable deref coercion' },
    { label: 'deref coercion', value: 'Auto-convert &T to &U at call sites, e.g. &String to &str' },
    { label: 'impl Drop / fn drop(&mut self)', value: 'Run cleanup automatically at end of scope (RAII)' },
    { label: 'std::mem::drop(v)', value: 'Force an early drop by moving v; direct .drop() is forbidden' },
    { label: 'Rc::new(v)', value: 'Single-threaded shared ownership via a strong count' },
    { label: 'Rc::clone(&rc)', value: 'Cheap reference-count bump, shares the same allocation' },
    { label: 'Rc::strong_count(&rc)', value: 'Number of live strong owners (debugging lifetimes)' },
    { label: 'Arc / Mutex', value: 'Thread-safe analogues of Rc / RefCell for shared state' },
    { label: 'RefCell::new(v)', value: 'Interior mutability with runtime borrow checks' },
    { label: '.borrow() / .borrow_mut()', value: 'Get a Ref / RefMut; rule violations panic at runtime' },
    { label: 'Rc<RefCell<T>>', value: 'Multiple owners of mutable data; can form leak-prone cycles' },
    { label: 'Rc::downgrade(&rc) / Weak / .upgrade()', value: 'Non-owning back-reference; upgrade gives Option<Rc<T>>' }
  ]
}

export default note
