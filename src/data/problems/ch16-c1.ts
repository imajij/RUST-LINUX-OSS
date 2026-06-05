import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch16-c-001',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Spawn a Thread',
    prompt: `Use \`thread::spawn\` to start a new thread. Inside the closure, print \`hello from a thread\`.

In \`main\`, after spawning, call \`.join()\` on the returned handle and \`unwrap()\` the result so the program waits for the thread to finish.`,
    hints: [
      'Bring the module into scope with \`use std::thread;\`.',
      '\`thread::spawn\` takes a closure and returns a JoinHandle.',
      'Call \`.join().unwrap()\` on the handle to wait for it.',
    ],
    solution: `use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        println!("hello from a thread");
    });
    handle.join().unwrap();
}`,
    starter: `use std::thread;

fn main() {
    // TODO: spawn a thread that prints, then join the handle
}`,
    tags: ['threads', 'spawn'],
  },
  {
    id: 'rs-ch16-c-002',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Print Numbers in a Thread',
    prompt: `Spawn a thread whose closure loops over the numbers 1, 2, and 3 (use \`for i in 1..=3\`) and prints each one with \`println!("number {}", i)\`.

Join the handle in \`main\` so all three lines are printed before the program exits.`,
    hints: [
      'A range like \`1..=3\` is inclusive of both ends.',
      'Store the handle returned by \`thread::spawn\` and join it.',
    ],
    solution: `use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        for i in 1..=3 {
            println!("number {}", i);
        }
    });
    handle.join().unwrap();
}`,
    starter: `use std::thread;

fn main() {
    // TODO: spawn a thread that prints number 1..=3, then join
}`,
    tags: ['threads', 'spawn'],
  },
  {
    id: 'rs-ch16-c-003',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Join Returns a Value',
    prompt: `The closure passed to \`thread::spawn\` can return a value. Spawn a thread whose closure computes \`2 + 2\` and returns it.

In \`main\`, capture the result of \`handle.join().unwrap()\` into a variable named \`answer\` and print it. The output should be \`4\`.`,
    hints: [
      'Whatever the closure evaluates to becomes the thread\\u2019s result.',
      '\`handle.join()\` returns a Result whose Ok value is what the closure returned.',
    ],
    solution: `use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        2 + 2
    });
    let answer = handle.join().unwrap();
    println!("{}", answer);
}`,
    starter: `use std::thread;

fn main() {
    // TODO: spawn a thread that returns 2 + 2, join it, print the value
}`,
    tags: ['threads', 'join'],
  },
  {
    id: 'rs-ch16-c-004',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Move a Value Into a Thread',
    prompt: `In \`main\`, create \`let data = vec![10, 20, 30];\`. Spawn a thread that takes ownership of \`data\` and prints it with \`println!("{:?}", data)\`.

Use a \`move\` closure so the vector is moved into the thread. Join the handle afterward.`,
    hints: [
      'A closure that needs to own captured values must start with \`move\`.',
      'Without \`move\`, the borrow checker rejects capturing \`data\` by reference into a thread.',
    ],
    solution: `use std::thread;

fn main() {
    let data = vec![10, 20, 30];
    let handle = thread::spawn(move || {
        println!("{:?}", data);
    });
    handle.join().unwrap();
}`,
    starter: `use std::thread;

fn main() {
    let data = vec![10, 20, 30];
    // TODO: move data into a spawned thread and print it, then join
}`,
    tags: ['threads', 'move', 'closures'],
  },
  {
    id: 'rs-ch16-c-005',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Move a Number Into a Thread',
    prompt: `In \`main\`, create \`let n = 42;\`. Spawn a thread using a \`move\` closure that prints \`the number is 42\` using \`n\`.

Join the handle so the message is printed before exit.`,
    hints: [
      'Even though \`n\` is a Copy type, using \`move\` makes the thread own its own copy.',
      'Use \`println!("the number is {}", n)\`.',
    ],
    solution: `use std::thread;

fn main() {
    let n = 42;
    let handle = thread::spawn(move || {
        println!("the number is {}", n);
    });
    handle.join().unwrap();
}`,
    starter: `use std::thread;

fn main() {
    let n = 42;
    // TODO: move n into a thread that prints it, then join
}`,
    tags: ['threads', 'move'],
  },
  {
    id: 'rs-ch16-c-006',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Create a Channel',
    prompt: `Create an mpsc channel and send a single value through it.

Use \`let (tx, rx) = mpsc::channel();\`, send the string \`"ping"\` with \`tx.send("ping").unwrap()\`, then receive it with \`rx.recv().unwrap()\` and print the received value.`,
    hints: [
      'Import with \`use std::sync::mpsc;\`.',
      '\`channel()\` returns a tuple of (transmitter, receiver).',
      '\`recv\` blocks until a value arrives and returns a Result.',
    ],
    solution: `use std::sync::mpsc;

fn main() {
    let (tx, rx) = mpsc::channel();
    tx.send("ping").unwrap();
    let received = rx.recv().unwrap();
    println!("{}", received);
}`,
    starter: `use std::sync::mpsc;

fn main() {
    // TODO: create a channel, send "ping", receive and print it
}`,
    tags: ['channels', 'mpsc'],
  },
  {
    id: 'rs-ch16-c-007',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Send From a Thread',
    prompt: `Create a channel. Spawn a thread that takes ownership of \`tx\` (use \`move\`) and sends the string \`"from the thread"\`.

Back in \`main\`, receive the value with \`rx.recv().unwrap()\` and print it.`,
    hints: [
      'Move \`tx\` into the spawned thread\\u2019s closure.',
      'The main thread calls \`rx.recv()\` to get the value.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    thread::spawn(move || {
        tx.send("from the thread").unwrap();
    });
    let received = rx.recv().unwrap();
    println!("{}", received);
}`,
    starter: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    // TODO: spawn a thread that moves tx and sends a message; receive and print
}`,
    tags: ['channels', 'threads', 'move'],
  },
  {
    id: 'rs-ch16-c-008',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Send a Number Over a Channel',
    prompt: `Create a channel. In \`main\` (without a separate thread), send the integer \`7\` with \`tx.send(7).unwrap()\`.

Receive it, add 1 to the received value, and print the result. The output should be \`8\`.`,
    hints: [
      'You can send and receive on the same thread for a simple exercise.',
      'Bind the received value to a variable, then add 1.',
    ],
    solution: `use std::sync::mpsc;

fn main() {
    let (tx, rx) = mpsc::channel();
    tx.send(7).unwrap();
    let value = rx.recv().unwrap();
    println!("{}", value + 1);
}`,
    starter: `use std::sync::mpsc;

fn main() {
    let (tx, rx) = mpsc::channel();
    // TODO: send 7, receive it, print value + 1
}`,
    tags: ['channels', 'mpsc'],
  },
  {
    id: 'rs-ch16-c-009',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'A Mutex in a Single Thread',
    prompt: `Create a \`Mutex<i32>\` holding the value \`5\`. Lock it, change the inner value to \`6\`, then unlock by letting the guard drop.

After the lock scope, print the mutex with \`println!("{:?}", m)\`. The output should be \`Mutex { data: 6, poisoned: false, .. }\`.`,
    hints: [
      'Import with \`use std::sync::Mutex;\`.',
      '\`m.lock().unwrap()\` returns a guard you can dereference with \`*\`.',
      'Put the lock in an inner block so the guard drops before printing.',
    ],
    solution: `use std::sync::Mutex;

fn main() {
    let m = Mutex::new(5);
    {
        let mut num = m.lock().unwrap();
        *num = 6;
    }
    println!("{:?}", m);
}`,
    starter: `use std::sync::Mutex;

fn main() {
    let m = Mutex::new(5);
    // TODO: lock, set the value to 6, drop the guard, then print m
}`,
    tags: ['mutex', 'shared-state'],
  },
  {
    id: 'rs-ch16-c-010',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Read Through a Mutex Guard',
    prompt: `Create a \`Mutex<String>\` holding \`"rust"\`. Lock it and print the inner value through the guard with \`println!("{}", *guard)\`. The output should be \`rust\`.`,
    hints: [
      '\`lock().unwrap()\` gives a MutexGuard.',
      'Dereference the guard with \`*\` to access the protected String.',
    ],
    solution: `use std::sync::Mutex;

fn main() {
    let m = Mutex::new(String::from("rust"));
    let guard = m.lock().unwrap();
    println!("{}", *guard);
}`,
    starter: `use std::sync::Mutex;

fn main() {
    let m = Mutex::new(String::from("rust"));
    // TODO: lock the mutex and print the inner string through the guard
}`,
    tags: ['mutex', 'guard'],
  },
  {
    id: 'rs-ch16-c-011',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Wrap a Value in Arc',
    prompt: `Create \`let a = Arc::new(100);\`. Then clone it into \`let b = Arc::clone(&a);\`.

Print both values with \`println!("{} {}", a, b)\`. The output should be \`100 100\`.`,
    hints: [
      'Import with \`use std::sync::Arc;\`.',
      '\`Arc::clone(&a)\` makes another handle to the same value, increasing the reference count.',
      'An Arc derefs to its inner value for printing.',
    ],
    solution: `use std::sync::Arc;

fn main() {
    let a = Arc::new(100);
    let b = Arc::clone(&a);
    println!("{} {}", a, b);
}`,
    starter: `use std::sync::Arc;

fn main() {
    let a = Arc::new(100);
    // TODO: clone a into b with Arc::clone, then print both
}`,
    tags: ['arc', 'shared-state'],
  },
  {
    id: 'rs-ch16-c-012',
    chapter: 16,
    kind: 'coding',
    difficulty: 'intro',
    title: 'Join Two Threads',
    prompt: `Spawn two threads. The first prints \`thread one\`, the second prints \`thread two\`. Store each handle, then join both handles so the program waits for both threads to finish.`,
    hints: [
      'Each \`thread::spawn\` returns its own handle.',
      'Join each handle: \`h1.join().unwrap(); h2.join().unwrap();\`.',
    ],
    solution: `use std::thread;

fn main() {
    let h1 = thread::spawn(|| {
        println!("thread one");
    });
    let h2 = thread::spawn(|| {
        println!("thread two");
    });
    h1.join().unwrap();
    h2.join().unwrap();
}`,
    starter: `use std::thread;

fn main() {
    // TODO: spawn two threads, store both handles, join both
}`,
    tags: ['threads', 'join'],
  },
  {
    id: 'rs-ch16-c-013',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Move a String and Return Its Length',
    prompt: `In \`main\`, create \`let name = String::from("concurrency");\`. Spawn a thread with a \`move\` closure that takes ownership of \`name\`, computes \`name.len()\`, and returns it.

Join the handle, store the returned length in \`len\`, and print it. The output should be \`11\`.`,
    hints: [
      'The closure must use \`move\` to own the String.',
      'The last expression of the closure is its return value.',
      'Capture the join result with \`handle.join().unwrap()\`.',
    ],
    solution: `use std::thread;

fn main() {
    let name = String::from("concurrency");
    let handle = thread::spawn(move || {
        name.len()
    });
    let len = handle.join().unwrap();
    println!("{}", len);
}`,
    starter: `use std::thread;

fn main() {
    let name = String::from("concurrency");
    // TODO: move name into a thread, return its len, join, print
}`,
    tags: ['threads', 'move', 'join'],
  },
  {
    id: 'rs-ch16-c-014',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Sum a Vector in a Thread',
    prompt: `In \`main\`, create \`let nums = vec![1, 2, 3, 4, 5];\`. Spawn a thread that takes ownership of \`nums\`, sums its elements, and returns the total as an \`i32\`.

Join the handle and print the sum. The output should be \`15\`.`,
    hints: [
      'Move \`nums\` into the closure.',
      'You can sum with a loop accumulator or with \`.iter().sum()\`.',
      'Return the total as the closure\\u2019s last expression.',
    ],
    solution: `use std::thread;

fn main() {
    let nums = vec![1, 2, 3, 4, 5];
    let handle = thread::spawn(move || {
        let mut total = 0;
        for n in &nums {
            total += n;
        }
        total
    });
    let sum = handle.join().unwrap();
    println!("{}", sum);
}`,
    starter: `use std::thread;

fn main() {
    let nums = vec![1, 2, 3, 4, 5];
    // TODO: move nums into a thread, return the sum, join and print
}`,
    tags: ['threads', 'move', 'join'],
  },
  {
    id: 'rs-ch16-c-015',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Send Several Values From a Thread',
    prompt: `Spawn a thread that owns \`tx\` and sends the four strings \`"a"\`, \`"b"\`, \`"c"\`, \`"d"\` one at a time (use a vector and a loop).

In \`main\`, receive exactly four values by calling \`rx.recv().unwrap()\` four times, printing each one on its own line.`,
    hints: [
      'Build a \`vec!["a", "b", "c", "d"]\` inside the thread and loop over it, sending each.',
      'In main, call \`recv\` once per expected value.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    thread::spawn(move || {
        let vals = vec!["a", "b", "c", "d"];
        for v in vals {
            tx.send(v).unwrap();
        }
    });
    for _ in 0..4 {
        let received = rx.recv().unwrap();
        println!("{}", received);
    }
}`,
    starter: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    // TODO: send "a".."d" from a thread; receive four values and print each
}`,
    tags: ['channels', 'threads', 'recv'],
  },
  {
    id: 'rs-ch16-c-016',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Iterate Over a Receiver',
    prompt: `Spawn a thread that owns \`tx\` and sends the numbers 1 through 3 (use \`for i in 1..=3\`), then lets \`tx\` drop when the thread finishes.

In \`main\`, treat \`rx\` as an iterator: \`for received in rx\` and print each value. The loop should end automatically when the channel closes.`,
    hints: [
      'A receiver can be iterated directly with \`for x in rx\`.',
      'The iteration ends when all transmitters have been dropped.',
      'When the spawned thread ends, its \`tx\` is dropped, closing the channel.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    thread::spawn(move || {
        for i in 1..=3 {
            tx.send(i).unwrap();
        }
    });
    for received in rx {
        println!("{}", received);
    }
}`,
    starter: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    // TODO: send 1..=3 from a thread; iterate over rx and print each
}`,
    tags: ['channels', 'iterator', 'recv'],
  },
  {
    id: 'rs-ch16-c-017',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Multiple Producers',
    prompt: `Create a channel. Clone the transmitter with \`let tx2 = tx.clone();\`.

Spawn one thread that moves \`tx\` and sends \`"from tx"\`, and a second thread that moves \`tx2\` and sends \`"from tx2"\`. In \`main\`, iterate over \`rx\` with \`for received in rx\` and print each message. (Order may vary.)`,
    hints: [
      'Clone the transmitter before spawning so both threads can send.',
      'Each thread takes ownership of one transmitter via \`move\`.',
      'When both transmitters drop, the receiver loop ends.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    let tx2 = tx.clone();

    thread::spawn(move || {
        tx.send("from tx").unwrap();
    });
    thread::spawn(move || {
        tx2.send("from tx2").unwrap();
    });

    for received in rx {
        println!("{}", received);
    }
}`,
    starter: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    // TODO: clone tx, spawn two senders, iterate rx and print
}`,
    tags: ['channels', 'multiple-producers', 'clone'],
  },
  {
    id: 'rs-ch16-c-018',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Increment Through a Mutex',
    prompt: `Create \`let counter = Mutex::new(0);\`. In a loop that runs 5 times, lock the mutex and add 1 to the inner value each iteration (let the guard drop at the end of each iteration).

After the loop, lock once more and print the final value. The output should be \`5\`.`,
    hints: [
      'Lock with \`counter.lock().unwrap()\` and dereference with \`*\`.',
      'Use a separate statement per iteration so the guard drops before the next lock.',
      'Print \`*counter.lock().unwrap()\` at the end.',
    ],
    solution: `use std::sync::Mutex;

fn main() {
    let counter = Mutex::new(0);
    for _ in 0..5 {
        let mut num = counter.lock().unwrap();
        *num += 1;
    }
    println!("{}", *counter.lock().unwrap());
}`,
    starter: `use std::sync::Mutex;

fn main() {
    let counter = Mutex::new(0);
    // TODO: lock and increment 5 times, then print the final value
}`,
    tags: ['mutex', 'shared-state'],
  },
  {
    id: 'rs-ch16-c-019',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Push to a Vec Behind a Mutex',
    prompt: `Create \`let list = Mutex::new(Vec::new());\` holding a \`Vec<i32>\`. Lock it and push the values 1, 2, and 3.

Then lock again and print the vector with \`println!("{:?}", *list.lock().unwrap())\`. The output should be \`[1, 2, 3]\`.`,
    hints: [
      'Call methods like \`push\` through the guard: \`list.lock().unwrap().push(1)\`.',
      'You may push all three in the same lock scope.',
    ],
    solution: `use std::sync::Mutex;

fn main() {
    let list: Mutex<Vec<i32>> = Mutex::new(Vec::new());
    {
        let mut v = list.lock().unwrap();
        v.push(1);
        v.push(2);
        v.push(3);
    }
    println!("{:?}", *list.lock().unwrap());
}`,
    starter: `use std::sync::Mutex;

fn main() {
    let list: Mutex<Vec<i32>> = Mutex::new(Vec::new());
    // TODO: lock and push 1, 2, 3; then print the vector
}`,
    tags: ['mutex', 'vec', 'shared-state'],
  },
  {
    id: 'rs-ch16-c-020',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Arc of Mutex Counter',
    prompt: `Build the classic shared counter. Create \`let counter = Arc::new(Mutex::new(0));\`.

Spawn 10 threads; each clones the Arc, locks the mutex, and adds 1. Collect the handles in a vector and join them all. Finally print the counter value with \`println!("Result: {}", *counter.lock().unwrap())\`. The output should be \`Result: 10\`.`,
    hints: [
      'Inside the loop do \`let counter = Arc::clone(&counter);\` before spawning.',
      'Each thread does \`let mut num = counter.lock().unwrap(); *num += 1;\`.',
      'Push every handle into a Vec, then join each one.',
    ],
    solution: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap());
}`,
    starter: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];
    // TODO: spawn 10 threads that each increment the counter, join, print result
}`,
    tags: ['arc', 'mutex', 'threads'],
  },
  {
    id: 'rs-ch16-c-021',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Arc of Mutex Adding Variable Amounts',
    prompt: `Create \`let total = Arc::new(Mutex::new(0));\`. Spawn 4 threads where thread number \`i\` (for \`i\` in 1..=4) adds \`i\` to the total.

Join all threads and print the total. The output should be \`10\` (1 + 2 + 3 + 4).`,
    hints: [
      'Loop \`for i in 1..=4\`, clone the Arc, and move both the clone and \`i\` into the thread.',
      'Inside the thread, lock and do \`*num += i;\`.',
      'Store handles in a Vec and join each.',
    ],
    solution: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let total = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for i in 1..=4 {
        let total = Arc::clone(&total);
        let handle = thread::spawn(move || {
            let mut num = total.lock().unwrap();
            *num += i;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("{}", *total.lock().unwrap());
}`,
    starter: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let total = Arc::new(Mutex::new(0));
    let mut handles = vec![];
    // TODO: spawn threads 1..=4 each adding i to total, join, print
}`,
    tags: ['arc', 'mutex', 'threads'],
  },
  {
    id: 'rs-ch16-c-022',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Share a Read-Only Vector With Arc',
    prompt: `Create \`let data = Arc::new(vec![1, 2, 3]);\`. Spawn 3 threads; thread \`i\` (for \`i\` in 0..3) clones the Arc and prints \`data[i]\`.

Join all three handles. (Order may vary; each thread prints one of 1, 2, 3.)`,
    hints: [
      'An Arc lets multiple threads share read-only data without a Mutex.',
      'Clone the Arc and move both the clone and the index into each thread.',
      'Index the shared vector with \`data[i]\`.',
    ],
    solution: `use std::sync::Arc;
use std::thread;

fn main() {
    let data = Arc::new(vec![1, 2, 3]);
    let mut handles = vec![];

    for i in 0..3 {
        let data = Arc::clone(&data);
        let handle = thread::spawn(move || {
            println!("{}", data[i]);
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }
}`,
    starter: `use std::sync::Arc;
use std::thread;

fn main() {
    let data = Arc::new(vec![1, 2, 3]);
    let mut handles = vec![];
    // TODO: spawn 3 threads each printing data[i], join all
}`,
    tags: ['arc', 'threads', 'shared-state'],
  },
  {
    id: 'rs-ch16-c-023',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Fix the Rc Across Threads Error',
    prompt: `The following does NOT compile because \`Rc<T>\` is not safe to send between threads:

\`\`\`
use std::rc::Rc;
let counter = Rc::new(0);
let c = Rc::clone(&counter);
thread::spawn(move || { println!("{}", c); });
\`\`\`

Rewrite it so it compiles: use \`Arc\` instead of \`Rc\`. Create \`let counter = Arc::new(5);\`, clone it into a thread that prints the value, and join the thread.`,
    hints: [
      '\`Rc\` does not implement Send, so it cannot move into a thread.',
      'Swap \`Rc\` for \`Arc\`, which is the thread-safe reference-counted pointer.',
      'Use \`Arc::clone(&counter)\` and a \`move\` closure.',
    ],
    solution: `use std::sync::Arc;
use std::thread;

fn main() {
    let counter = Arc::new(5);
    let c = Arc::clone(&counter);
    let handle = thread::spawn(move || {
        println!("{}", c);
    });
    handle.join().unwrap();
}`,
    starter: `use std::sync::Arc;
use std::thread;

fn main() {
    let counter = Arc::new(5);
    // TODO: clone the Arc into a thread that prints it, then join
}`,
    tags: ['arc', 'rc', 'send'],
  },
  {
    id: 'rs-ch16-c-024',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Collect Results From Multiple Threads',
    prompt: `Spawn 3 threads; thread \`i\` (for \`i\` in 1..=3) returns \`i * i\`. Push each handle into a vector.

After spawning, join each handle and print its returned value. The values printed should be 1, 4, and 9 (in spawn order).`,
    hints: [
      'Move \`i\` into each thread\\u2019s closure so it owns its own copy.',
      'The closure returns \`i * i\`.',
      'Iterate over the handles and print \`handle.join().unwrap()\` for each.',
    ],
    solution: `use std::thread;

fn main() {
    let mut handles = vec![];

    for i in 1..=3 {
        let handle = thread::spawn(move || {
            i * i
        });
        handles.push(handle);
    }

    for handle in handles {
        println!("{}", handle.join().unwrap());
    }
}`,
    starter: `use std::thread;

fn main() {
    let mut handles = vec![];
    // TODO: spawn threads 1..=3 returning i*i, then join and print each result
}`,
    tags: ['threads', 'join', 'move'],
  },
  {
    id: 'rs-ch16-c-025',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Sum Channel Values in Main',
    prompt: `Spawn a thread that owns \`tx\` and sends the numbers 1 through 5 (use \`for i in 1..=5\`).

In \`main\`, iterate over \`rx\` and accumulate the total into a variable \`sum\`. After the loop, print \`sum\`. The output should be \`15\`.`,
    hints: [
      'Iterating \`for n in rx\` yields each sent value and ends when the channel closes.',
      'Start \`let mut sum = 0;\` and add each received value.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    thread::spawn(move || {
        for i in 1..=5 {
            tx.send(i).unwrap();
        }
    });

    let mut sum = 0;
    for n in rx {
        sum += n;
    }
    println!("{}", sum);
}`,
    starter: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    // TODO: send 1..=5 from a thread; sum the received values and print
}`,
    tags: ['channels', 'iterator', 'recv'],
  },
  {
    id: 'rs-ch16-c-026',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Three Producers Counting',
    prompt: `Create a channel. Clone the transmitter so you have three sending handles in total (the original plus two clones).

Spawn three threads; each one sends a single number: 10, 20, and 30 respectively. In \`main\`, iterate over \`rx\` and sum the values. Print the total, which should be \`60\`.`,
    hints: [
      'Clone \`tx\` twice before spawning the three threads.',
      'Each thread moves one transmitter and sends one number.',
      'When all three transmitters drop, the \`for n in rx\` loop ends.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    let tx2 = tx.clone();
    let tx3 = tx.clone();

    thread::spawn(move || {
        tx.send(10).unwrap();
    });
    thread::spawn(move || {
        tx2.send(20).unwrap();
    });
    thread::spawn(move || {
        tx3.send(30).unwrap();
    });

    let mut total = 0;
    for n in rx {
        total += n;
    }
    println!("{}", total);
}`,
    starter: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    // TODO: make three senders, send 10/20/30 from three threads, sum and print
}`,
    tags: ['channels', 'multiple-producers', 'clone'],
  },
  {
    id: 'rs-ch16-c-027',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'try_recv Without Blocking',
    prompt: `Create a channel and send the value \`99\` on the same thread. Then call \`rx.try_recv()\`, which returns a \`Result\`.

Match on the result: on \`Ok(v)\` print \`got 99\` style output using \`println!("got {}", v)\`; on \`Err(_)\` print \`nothing yet\`. With one value already sent, the output should be \`got 99\`.`,
    hints: [
      '\`try_recv\` does not block; it returns \`Err\` immediately if no message is available.',
      'Use a \`match\` with \`Ok(v)\` and \`Err(_)\` arms.',
    ],
    solution: `use std::sync::mpsc;

fn main() {
    let (tx, rx) = mpsc::channel();
    tx.send(99).unwrap();

    match rx.try_recv() {
        Ok(v) => println!("got {}", v),
        Err(_) => println!("nothing yet"),
    }
}`,
    starter: `use std::sync::mpsc;

fn main() {
    let (tx, rx) = mpsc::channel();
    tx.send(99).unwrap();
    // TODO: match on rx.try_recv() and print accordingly
}`,
    tags: ['channels', 'try_recv'],
  },
  {
    id: 'rs-ch16-c-028',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Append Strings Across Threads',
    prompt: `Create \`let log = Arc::new(Mutex::new(String::new()));\`. Spawn 3 threads; each clones the Arc, locks the mutex, and pushes the character \`'x'\` onto the string with \`push('x')\`.

Join all threads and print the string length with \`println!("{}", log.lock().unwrap().len())\`. The output should be \`3\`.`,
    hints: [
      'Lock returns a guard you can call \`push\` on directly.',
      'Clone the Arc inside the loop before each spawn.',
      'After joining, lock once more to read the final length.',
    ],
    solution: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let log = Arc::new(Mutex::new(String::new()));
    let mut handles = vec![];

    for _ in 0..3 {
        let log = Arc::clone(&log);
        let handle = thread::spawn(move || {
            let mut s = log.lock().unwrap();
            s.push('x');
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("{}", log.lock().unwrap().len());
}`,
    starter: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let log = Arc::new(Mutex::new(String::new()));
    let mut handles = vec![];
    // TODO: 3 threads each push 'x' to the shared string; join, print its len
}`,
    tags: ['arc', 'mutex', 'threads'],
  },
  {
    id: 'rs-ch16-c-029',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Collect Channel Values Into a Vec',
    prompt: `Spawn a thread that owns \`tx\` and sends the strings \`"red"\`, \`"green"\`, \`"blue"\`.

In \`main\`, collect all received values into a \`Vec<&str>\` named \`colors\` by iterating over \`rx\` and pushing each one. Print the vector with \`println!("{:?}", colors)\`. The output should be \`["red", "green", "blue"]\`.`,
    hints: [
      'Start with \`let mut colors = Vec::new();\`.',
      'Push each value received from \`for c in rx\`.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    thread::spawn(move || {
        for c in ["red", "green", "blue"] {
            tx.send(c).unwrap();
        }
    });

    let mut colors = Vec::new();
    for c in rx {
        colors.push(c);
    }
    println!("{:?}", colors);
}`,
    starter: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    // TODO: send three colors from a thread; collect them into a Vec and print
}`,
    tags: ['channels', 'iterator', 'vec'],
  },
  {
    id: 'rs-ch16-c-030',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Worker Reports Back Over a Channel',
    prompt: `Spawn a worker thread that owns \`tx\` and a number \`input = 6\`. The worker computes \`input * 10\` and sends the result over the channel.

In \`main\`, receive the result with \`rx.recv().unwrap()\` and print it. The output should be \`60\`.`,
    hints: [
      'Move both \`tx\` and \`input\` into the thread.',
      'Send the computed value, then receive it in main.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    let input = 6;
    thread::spawn(move || {
        let result = input * 10;
        tx.send(result).unwrap();
    });
    let answer = rx.recv().unwrap();
    println!("{}", answer);
}`,
    starter: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    let input = 6;
    // TODO: worker computes input*10 and sends it; receive and print
}`,
    tags: ['channels', 'threads', 'move'],
  },
  {
    id: 'rs-ch16-c-031',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Each Thread Updates Its Own Index',
    prompt: `Create \`let scores = Arc::new(Mutex::new(vec![0, 0, 0]));\`. Spawn 3 threads; thread \`i\` (for \`i\` in 0..3) clones the Arc, locks the mutex, and sets element \`i\` to \`i + 1\`.

Join all threads and print the vector. The output should be \`[1, 2, 3]\`.`,
    hints: [
      'Move both the Arc clone and \`i\` into each thread.',
      'Index the locked vector with \`guard[i] = i + 1;\`.',
      'Lock once after joining to print the result.',
    ],
    solution: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let scores = Arc::new(Mutex::new(vec![0, 0, 0]));
    let mut handles = vec![];

    for i in 0..3 {
        let scores = Arc::clone(&scores);
        let handle = thread::spawn(move || {
            let mut v = scores.lock().unwrap();
            v[i] = i + 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("{:?}", *scores.lock().unwrap());
}`,
    starter: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let scores = Arc::new(Mutex::new(vec![0, 0, 0]));
    let mut handles = vec![];
    // TODO: each thread i sets scores[i] = i + 1; join and print the vector
}`,
    tags: ['arc', 'mutex', 'vec'],
  },
  {
    id: 'rs-ch16-c-032',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Pipeline With a Channel',
    prompt: `Build a tiny pipeline. Create a channel. Spawn a producer thread that owns \`tx\` and sends the numbers 1 through 4.

In \`main\` (the consumer), iterate over \`rx\`, doubling each value, and print each doubled number on its own line. The output lines should be 2, 4, 6, 8.`,
    hints: [
      'The producer sends raw values; the consumer transforms them.',
      'For each \`n\` received, print \`n * 2\`.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    thread::spawn(move || {
        for i in 1..=4 {
            tx.send(i).unwrap();
        }
    });

    for n in rx {
        println!("{}", n * 2);
    }
}`,
    starter: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    // TODO: producer sends 1..=4; consumer doubles each and prints
}`,
    tags: ['channels', 'iterator', 'threads'],
  },
  {
    id: 'rs-ch16-c-033',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Count Even Numbers Across Threads',
    prompt: `Create \`let evens = Arc::new(Mutex::new(0));\`. Spawn threads for the numbers 1 through 6 (for \`n\` in 1..=6); each thread, if \`n\` is even, locks the mutex and increments the counter.

Join all threads and print the count of even numbers. The output should be \`3\`.`,
    hints: [
      'Check evenness with \`n % 2 == 0\` inside the thread.',
      'Only lock and increment when the number is even.',
      'Move the Arc clone and \`n\` into each thread.',
    ],
    solution: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let evens = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for n in 1..=6 {
        let evens = Arc::clone(&evens);
        let handle = thread::spawn(move || {
            if n % 2 == 0 {
                let mut count = evens.lock().unwrap();
                *count += 1;
            }
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("{}", *evens.lock().unwrap());
}`,
    starter: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let evens = Arc::new(Mutex::new(0));
    let mut handles = vec![];
    // TODO: spawn threads for 1..=6; count how many are even with a shared counter
}`,
    tags: ['arc', 'mutex', 'threads'],
  },
  {
    id: 'rs-ch16-c-034',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Two Producers, Distinct Ranges',
    prompt: `Create a channel and clone the transmitter once. Spawn two producer threads: the first sends \`1, 2, 3\` (using its \`tx\`), the second sends \`4, 5, 6\` (using the cloned \`tx2\`).

In \`main\`, iterate over \`rx\` and sum all six values. Print the total, which should be \`21\`.`,
    hints: [
      'Clone the transmitter so each thread owns one sending handle.',
      'Each thread loops over its own range and sends each value.',
      'The receiver loop ends once both transmitters are dropped.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    let tx2 = tx.clone();

    thread::spawn(move || {
        for i in 1..=3 {
            tx.send(i).unwrap();
        }
    });
    thread::spawn(move || {
        for i in 4..=6 {
            tx2.send(i).unwrap();
        }
    });

    let mut total = 0;
    for n in rx {
        total += n;
    }
    println!("{}", total);
}`,
    starter: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    // TODO: two producers send 1..=3 and 4..=6; sum all received values and print
}`,
    tags: ['channels', 'multiple-producers', 'clone'],
  },
  {
    id: 'rs-ch16-c-035',
    chapter: 16,
    kind: 'coding',
    difficulty: 'easy',
    title: 'Shared Counter Plus Result Channel',
    prompt: `Combine shared state and message passing. Create \`let counter = Arc::new(Mutex::new(0));\` and a channel.

Spawn 5 threads; each clones the Arc and the transmitter (clone \`tx\` per thread). Each thread locks the mutex, increments it, then sends the message \`"done"\` over the channel. Drop the original \`tx\` in \`main\` after the loop so the channel can close.

In \`main\`, count how many \`"done"\` messages arrive by iterating over \`rx\`, then print both that count and the final counter value as \`messages: 5 counter: 5\`.`,
    hints: [
      'Clone both the Arc and the transmitter inside the loop, before each spawn.',
      'Call \`drop(tx);\` after the loop so iterating \`rx\` can terminate.',
      'Count messages by incrementing a variable for each value from \`for _ in rx\`.',
    ],
    solution: `use std::sync::{Arc, Mutex};
use std::sync::mpsc;
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let (tx, rx) = mpsc::channel();
    let mut handles = vec![];

    for _ in 0..5 {
        let counter = Arc::clone(&counter);
        let tx = tx.clone();
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();
            *num += 1;
            tx.send("done").unwrap();
        });
        handles.push(handle);
    }

    drop(tx);

    let mut messages = 0;
    for _ in rx {
        messages += 1;
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("messages: {} counter: {}", messages, *counter.lock().unwrap());
}`,
    starter: `use std::sync::{Arc, Mutex};
use std::sync::mpsc;
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let (tx, rx) = mpsc::channel();
    let mut handles = vec![];
    // TODO: 5 threads each increment counter and send "done"; drop tx, count messages, print
}`,
    tags: ['arc', 'mutex', 'channels'],
  },
]

export default problems
