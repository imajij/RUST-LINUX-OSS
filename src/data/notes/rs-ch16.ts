import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-rs-16',
  track: 'rust',
  chapter: 16,
  title: 'Fearless Concurrency',
  summary: `Concurrency lets a program do several things at once, and historically it has been one of the hardest, most bug-prone areas of systems programming. Rust earns the slogan "fearless concurrency" because its ownership and type systems catch data races, use-after-free, and many deadlock-adjacent mistakes at compile time rather than at three in the morning in production. This chapter covers the two big models for concurrent communication, message passing with channels and shared state with locks, and the two marker traits, Send and Sync, that quietly enforce thread safety for every type in the language. These are exactly the guarantees that make Rust a credible language for the Linux kernel, where a data race can corrupt the whole machine.`,
  sections: [
    {
      heading: 'Threads, spawning, and join handles',
      body: `A thread is an independent path of execution within a process. Multiple threads can run at the same time on different CPU cores, sharing the same address space. Rust uses **1:1 threading**: each thread you create with the standard library maps to one operating system thread. The language deliberately keeps green threads (M:N scheduling) out of the standard library to avoid imposing a heavyweight runtime, which matters for embedded and kernel contexts where you cannot afford one.

You start a new thread with thread::spawn, passing it a closure containing the code to run. spawn returns immediately with a **JoinHandle**, a value that represents the running thread and lets you wait for it later.

### Why you must join
When the **main** thread finishes, the whole process exits and all spawned threads are torn down immediately, even if they had not finished their work. So if you spawn a thread and then let main return, you may see only some or none of its output. Calling join on the handle blocks the current thread until that spawned thread completes, which both guarantees the work finishes and gives you back its return value wrapped in a Result.

The Result is Err only if the spawned thread **panicked**; otherwise it is Ok holding whatever the closure returned. This is why you so often see handle.join().unwrap(): unwrap turns a propagated panic into a panic here, surfacing the failure rather than silently swallowing it.

### Ordering is not guaranteed
The operating system scheduler decides when each thread runs and for how long. You cannot assume spawned threads run in any particular order, run to completion before the spawner continues, or even get to run at all before main exits. Where you place your join calls changes behavior dramatically: joining inside a loop serializes the threads, while collecting all handles first and joining them afterward lets them run in parallel.`,
      code: [
        {
          lang: 'rust',
          src: `use std::thread;
use std::time::Duration;

fn main() {
    // Spawn returns a JoinHandle immediately; the thread runs concurrently.
    let handle = thread::spawn(|| {
        for i in 1..5 {
            println!("spawned: {}", i);
            thread::sleep(Duration::from_millis(1));
        }
        42 // the closure's return value travels through join
    });

    for i in 1..3 {
        println!("main: {}", i);
        thread::sleep(Duration::from_millis(1));
    }

    // Block until the spawned thread finishes; recover its return value.
    // join yields Err only if the thread panicked.
    let answer = handle.join().unwrap();
    println!("thread returned {}", answer); // 42
}`
        }
      ]
    },
    {
      heading: 'Move closures: giving threads ownership of their data',
      body: `A spawned thread's closure almost always needs data from the surrounding scope. The problem is that the new thread may **outlive** the function that created it, so any reference the closure borrows could end up pointing at a stack frame that has already been destroyed: a classic use-after-free. Rust refuses to compile that.

The compiler enforces this through the bound on thread::spawn, which requires the closure to be 'static, meaning it must not borrow anything that could go out of scope. In practice that means the closure has to **own** every value it uses. You express this by writing the move keyword before the closure's parameter bars, which forces the closure to capture each variable by value, transferring ownership into the thread.

### Why move, specifically
Without move, the compiler tries to capture by reference (the least access it needs), then immediately rejects the program because it cannot prove the reference outlives the thread. The error message literally suggests adding move. With move, ownership of the data moves into the closure and therefore into the thread, so the data lives exactly as long as the thread does and there is no dangling reference to fear.

### The consequence to remember
Once you move a value into a thread, you can no longer use it in the original scope, because ownership left. If you need the data in both places, you cannot simply move it; you must share it, which is what channels and Arc (covered later) are for. For Copy types like integers, move copies rather than transfers, so the original remains usable, but that is the exception, not the rule.`,
      code: [
        {
          lang: 'rust',
          src: `use std::thread;

fn main() {
    let data = vec![1, 2, 3];

    // move transfers ownership of data into the thread's closure.
    // Without move this fails: the borrow might outlive main's frame.
    let handle = thread::spawn(move || {
        println!("thread owns {:?}", data);
    });

    // println!("{:?}", data); // ERROR: data was moved into the thread

    handle.join().unwrap();
}`
        }
      ]
    },
    {
      heading: 'Message passing with channels (mpsc)',
      body: `One way for threads to communicate is **message passing**: threads send data to each other rather than reaching into shared memory. The guiding slogan, borrowed from Go, is "do not communicate by sharing memory; instead, share memory by communicating." Passing ownership of a value through a channel means only one thread holds it at a time, which sidesteps data races entirely.

The standard library's channel lives in std::sync::mpsc. The name stands for **multiple producer, single consumer**: you may clone the sending half so many threads can send, but there is exactly one receiving half. Calling mpsc::channel returns a tuple of (transmitter, receiver), conventionally named tx and rx.

### Sending, receiving, and ownership
The send method takes a value and **moves** it into the channel, so after sending you can no longer use that value in the sending thread. This is the ownership system enforcing the share-by-communicating discipline: the data is gone from your side, so you cannot accidentally mutate it while another thread reads it.

send returns a Result that is Err only if the receiver has been dropped (nobody is listening), so sending can fail and you should handle that. On the other side, recv blocks the receiving thread until a value arrives, returning Ok(value) or Err once all senders are gone. There is also try_recv, which returns immediately whether or not a value is ready, useful when the receiver has other work to do in a loop.

### Receiving as an iterator
The most idiomatic pattern treats the receiver as an iterator. A for loop over rx yields each message as it arrives and ends cleanly when every transmitter has been dropped and the channel is empty. You do not call recv yourself or check for errors; the loop just ends.

### Multiple producers
To get multiple producers, clone the transmitter with tx.clone(). Each clone can be moved into its own thread. The receiving loop ends only after **all** transmitters, originals and clones, have been dropped. A common bug is leaving one transmitter alive in the main thread, which keeps the receiver loop blocked forever waiting for a message that never comes.`,
      code: [
        {
          lang: 'rust',
          src: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    // Clone the transmitter so two threads can produce values.
    let tx2 = tx.clone();

    thread::spawn(move || {
        for s in ["hi", "from", "thread", "one"] {
            tx.send(String::from(s)).unwrap(); // send moves the value
        }
        // tx is dropped here when the thread ends
    });

    thread::spawn(move || {
        for s in ["and", "thread", "two"] {
            tx2.send(String::from(s)).unwrap();
        }
        // tx2 is dropped here
    });

    // Treat rx as an iterator: yields messages until ALL senders drop.
    for received in rx {
        println!("got: {}", received);
    }
}`
        }
      ]
    },
    {
      heading: 'Shared state and the Mutex',
      body: `The other major model is **shared state**: multiple threads access the same data in memory. This is more flexible than message passing but also where data races traditionally live. Rust's answer is the **mutex**, short for mutual exclusion, a lock that allows only one thread to access the guarded data at a time.

A thread must **acquire** the lock before touching the data and **release** it afterward so others get a turn. Forgetting either half is the eternal source of mutex bugs in other languages: forget to lock and you get a data race; forget to unlock and you get a deadlock. Rust's Mutex<T> design makes both mistakes hard.

### How Mutex<T> is safe by construction
Two ideas combine. First, the data is **inside** the mutex: you cannot reach the value without going through the lock, so you cannot forget to lock. Second, lock returns a smart pointer called a **MutexGuard**, and the lock is automatically released when that guard goes out of scope, via its Drop implementation. So you cannot forget to unlock either; scope exit does it for you.

The lock method returns a Result, because if a thread panics while holding the lock the mutex becomes **poisoned**. Calling unwrap on it is the common choice: it propagates the panic, on the theory that data protected by a poisoned lock may be in an inconsistent state and should not be trusted.

### Mutex<T> gives interior mutability
Notice you can mutate the data through an immutable reference to the mutex (you do not need let mut on the Mutex). Mutex<T> provides **interior mutability**, much like RefCell<T> from the previous chapter, but it enforces the borrow rules at runtime across threads using an actual operating-system lock rather than within a single thread. The analogy is exact: RefCell is to Rc as Mutex is to Arc.

### A subtle deadlock pitfall
Because the guard releases on scope exit, holding a lock longer than necessary, or acquiring two locks in inconsistent orders across threads, can deadlock. Keep critical sections short, and if you must hold multiple locks always acquire them in the same global order in every thread.`,
      code: [
        {
          lang: 'rust',
          src: `use std::sync::Mutex;

fn main() {
    // The i32 lives inside the Mutex; you cannot reach it without locking.
    let m = Mutex::new(5);

    {
        // lock() blocks until acquired; unwrap propagates a poisoned lock.
        let mut num = m.lock().unwrap();
        *num = 6; // interior mutability: mutate through an immutable m
    } // MutexGuard drops here -> lock automatically released

    println!("m = {:?}", m); // Mutex { data: 6, .. }
}`
        }
      ]
    },
    {
      heading: 'Arc: sharing ownership across threads',
      body: `Mutex<T> protects data from simultaneous access, but it does not by itself let several threads **own** the same mutex. To share one value among many threads you need shared ownership, and the reference-counted pointer types provide it. Rc<T> from chapter 15 does shared ownership but is **not thread safe**, so the compiler forbids sending an Rc across threads. Its counterpart for concurrency is **Arc<T>**, the **atomically reference counted** pointer.

### Why Arc and not Rc
Both let multiple owners share read access to a value, freeing it when the last owner drops. The difference is how they count references. Rc updates its count with ordinary non-atomic operations, which is fast but corrupts the count if two threads update it at once, leading to double frees or leaks. Arc uses **atomic** operations, which are safe to perform concurrently from multiple threads. You pay a small performance cost for those atomics, which is precisely why Rust does not just make everything an Arc: you should reach for Rc when you are single threaded and Arc only when you actually cross thread boundaries.

### Cloning is cheap and shares
Calling Arc::clone does not copy the underlying data; it increments the reference count and hands back another pointer to the same allocation. The convention is to write Arc::clone(and_a_reference) rather than the method form, so readers can see at a glance that this is a cheap refcount bump, not a deep copy. Each clone can then be moved into its own thread.

### The catch that motivates the next section
Arc<T> alone gives shared, **immutable** access. You cannot mutate the inner value through an Arc, because multiple threads holding shared references could then race. To get shared **and** mutable, you must combine Arc with something that provides safe interior mutability across threads, which is the mutex.`,
      code: [
        {
          lang: 'rust',
          src: `use std::sync::Arc;
use std::thread;

fn main() {
    // Arc allows many threads to share ownership of the same Vec.
    let names = Arc::new(vec![String::from("ada"), String::from("alan")]);
    let mut handles = vec![];

    for id in 0..3 {
        // clone bumps the atomic refcount; it does NOT copy the Vec.
        let names = Arc::clone(&names);
        let h = thread::spawn(move || {
            println!("thread {} sees {:?}", id, names);
        });
        handles.push(h);
    }

    for h in handles {
        h.join().unwrap();
    }
    // The Vec is freed when the last Arc clone is dropped.
}`
        }
      ]
    },
    {
      heading: 'Arc<Mutex<T>>: shared, mutable state done right',
      body: `Putting the two pieces together gives the canonical concurrency idiom in Rust: **Arc<Mutex<T>>**. The Arc provides shared ownership so every thread can hold a handle to the same value, and the Mutex provides safe, exclusive mutation so only one thread changes the value at a time. Read the type from the inside out: a T, guarded by a Mutex, owned jointly through an Arc.

### Why both layers are necessary
Drop either layer and the compiler stops you. With Mutex<T> but no Arc, you cannot give more than one thread ownership of the mutex, so you cannot move it into several threads. With Arc<T> but no Mutex, every thread has shared read-only access and none can mutate. Only the combination delivers shared and mutable. This mirrors the single-threaded pairing Rc<RefCell<T>>: Arc replaces Rc for thread-safe counting, and Mutex replaces RefCell for thread-safe interior mutability.

### The usage pattern
You wrap the data once as Arc::new(Mutex::new(value)), then Arc::clone it into each thread. Inside a thread you lock the mutex to get a guard, use or mutate the data through that guard, and let the guard drop to release the lock. The classic worked example is a shared counter incremented by ten threads; with the proper wrapper it deterministically reaches ten, whereas a plain shared integer would not even compile.

### Pitfalls to internalize
- **Locks do not prevent logic deadlocks.** Holding one lock and waiting on another, in different orders across threads, can hang forever. Lock in a consistent order and keep critical sections small.
- **Arc<Mutex<T>> does not eliminate the need to think.** It prevents data races, a memory-safety property, but it cannot prevent race conditions in your logic or deadlocks, which are correctness properties. Rust's guarantee is narrower and sharper than "your concurrent code is correct."
- **Do not hold a guard across an await or a long blocking call**, or you serialize everything waiting on that lock.`,
      code: [
        {
          lang: 'rust',
          src: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    // Arc for shared ownership, Mutex for exclusive mutation: the canonical combo.
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter); // share the SAME mutex
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap(); // acquire lock
            *num += 1;
            // guard drops at end of closure -> lock released
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    // Deterministically 10: the mutex serialized every increment.
    println!("result: {}", *counter.lock().unwrap());
}`
        }
      ]
    },
    {
      heading: 'The Send and Sync marker traits',
      body: `Almost none of the concurrency safety in this chapter is built into the channel or mutex types specifically. It comes from two **marker traits** baked into the language, Send and Sync. They have no methods; they exist purely to let the type system reason about thread safety, and the compiler checks them automatically.

### Send: safe to move to another thread
A type is **Send** if it is safe to transfer ownership of its values to another thread. Almost every type is Send. The famous exception is Rc<T>, which is deliberately not Send: if you could move an Rc to another thread, two threads might update its non-atomic reference count concurrently and corrupt it. Arc<T> is Send precisely because its count is atomic. Raw pointers are also not Send. This is the exact mechanism that made the earlier Rc-across-threads example fail to compile.

### Sync: safe to share by reference
A type is **Sync** if it is safe for multiple threads to hold references to the same value, formally if &T is Send. Mutex<T> is Sync, which is what makes Arc<Mutex<T>> usable from many threads at once. RefCell<T> and the whole Rc family are not Sync, because their runtime bookkeeping is not protected against concurrent access.

### Why this is powerful
These traits are **auto traits**: the compiler implements them automatically for any type whose every field is itself Send or Sync. So when you define a struct out of ordinary safe types, it becomes Send and Sync for free, and thus usable across threads, with no annotation from you. The thread and channel APIs are simply generic functions with Send and Sync bounds, so the compiler rejects unsafe usage with a type error long before runtime. That is the engine behind fearless concurrency: thread safety is a property the type system tracks and propagates, not something you remember to verify.

### The unsafe escape hatch
Implementing Send or Sync by hand is **unsafe**, because you are promising the compiler a thread-safety invariant it could not verify itself. You only need this when building new concurrency primitives from raw parts, for example wrapping a raw pointer in a type you can prove is actually safe to share. This is exactly the kind of carefully audited unsafe code that appears in the Rust standard library and in Rust-for-Linux abstractions, where a wrong manual impl reintroduces the data races the whole system exists to prevent.`,
      code: [
        {
          lang: 'rust',
          src: `use std::rc::Rc;
use std::sync::Arc;
use std::thread;

fn main() {
    // Arc is Send + Sync, so this compiles and shares safely.
    let shared = Arc::new(5);
    let s = Arc::clone(&shared);
    thread::spawn(move || println!("{}", s)).join().unwrap();

    // Rc is NOT Send: the line below would fail to compile.
    let local = Rc::new(5);
    // thread::spawn(move || println!("{}", local)); // ERROR: Rc is not Send
    println!("{}", local);

    // A struct of Send + Sync fields is automatically Send + Sync.
    struct Config { retries: u32, name: String }
    let cfg = Arc::new(Config { retries: 3, name: String::from("x") });
    let c = Arc::clone(&cfg);
    thread::spawn(move || println!("{} {}", c.retries, c.name))
        .join()
        .unwrap();
}`
        }
      ]
    }
  ],
  takeaways: [
    'Rust uses 1:1 OS threads via thread::spawn; the returned JoinHandle lets you wait with join, and join returns Err only if the thread panicked.',
    'The main thread exiting kills all spawned threads immediately, so you must join handles to be sure their work completed.',
    'Closures passed to spawn must own their data because the thread may outlive the caller; the move keyword forces capture by value to satisfy the \'static bound.',
    'Message passing (std::sync::mpsc) shares memory by communicating: send moves a value out of the sending thread, and the receiver can be iterated until all senders drop.',
    'mpsc is multiple-producer single-consumer: clone tx for more producers, and remember the receive loop ends only when every transmitter has been dropped.',
    'Mutex<T> stores the data inside the lock and returns a MutexGuard that releases automatically on drop, giving safe interior mutability across threads; lock can return a poisoned error after a panic.',
    'Rc<T> is single-threaded and not Send; use Arc<T> for atomic, thread-safe shared ownership, and prefer Arc::clone to make the cheap refcount bump explicit.',
    'Arc<Mutex<T>> is the canonical shared-mutable pattern: Arc for shared ownership, Mutex for exclusive mutation, mirroring single-threaded Rc<RefCell<T>>.',
    'Send (safe to move to another thread) and Sync (safe to share by reference) are auto-derived marker traits that let the compiler enforce thread safety; implementing them manually is unsafe.'
  ],
  cheatsheet: [
    { label: 'thread::spawn(|| {})', value: 'Start a new OS thread; returns a JoinHandle' },
    { label: 'handle.join()', value: 'Block until the thread ends; Err only on panic' },
    { label: 'move || {}', value: 'Closure captures by value; required for threads' },
    { label: 'mpsc::channel()', value: 'Create a channel; returns (tx, rx)' },
    { label: 'tx.send(v)', value: 'Move v into the channel; Err if receiver dropped' },
    { label: 'rx.recv()', value: 'Block for one message; Err when all senders drop' },
    { label: 'for v in rx', value: 'Iterate messages until all transmitters drop' },
    { label: 'tx.clone()', value: 'Add another producer (multiple-producer side)' },
    { label: 'Mutex::new(v)', value: 'Lock guarding v; only one thread accesses at a time' },
    { label: 'm.lock().unwrap()', value: 'Acquire lock, get a guard; unwrap propagates poison' },
    { label: 'Arc::new(v)', value: 'Atomic refcounted shared ownership (thread-safe)' },
    { label: 'Arc::clone(&a)', value: 'Cheap refcount bump, not a deep copy' },
    { label: 'Arc<Mutex<T>>', value: 'Canonical shared, mutable cross-thread state' },
    { label: 'Send / Sync', value: 'Movable to / shareable across threads (auto traits)' }
  ]
}

export default note
