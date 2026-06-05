import type { Problem } from '../../types'

const problems: Problem[] = [
  {
    id: 'rs-ch16-c-036',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Spawn and Join a Thread',
    prompt: `In \`main\`, spawn a thread with \`thread::spawn\` that prints \`hi from the thread\`. Capture the returned handle in a variable named \`handle\`.

After spawning, print \`hi from main\`, then call \`.join()\` on the handle (use \`.unwrap()\`) so the program waits for the spawned thread to finish before exiting.`,
    hints: [
      'Import the thread module with \`use std::thread;\`.',
      'thread::spawn takes a closure with no parameters.',
      'handle.join().unwrap() blocks until the thread finishes.',
    ],
    solution: `use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        println!("hi from the thread");
    });

    println!("hi from main");

    handle.join().unwrap();
}`,
    starter: `use std::thread;

fn main() {
    // TODO: spawn a thread, print from main, then join the handle
}`,
    tags: ['threads', 'spawn', 'join'],
  },
  {
    id: 'rs-ch16-c-037',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Count in a Spawned Thread',
    prompt: `Spawn a thread that loops \`i\` from 1 through 5 and prints \`number i from the thread\` on each iteration (with the actual value of \`i\`). Join the handle so the program does not exit early.

After joining, print \`done\` from the main thread.`,
    hints: [
      'Use a for loop over the range \`1..=5\` inside the closure.',
      'Remember to join the handle before printing done.',
    ],
    solution: `use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        for i in 1..=5 {
            println!("number {} from the thread", i);
        }
    });

    handle.join().unwrap();
    println!("done");
}`,
    starter: `use std::thread;

fn main() {
    // TODO: spawn a thread that prints numbers 1..=5, join it, then print done
}`,
    tags: ['threads', 'spawn', 'join'],
  },
  {
    id: 'rs-ch16-c-038',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Move a Vector Into a Thread',
    prompt: `In \`main\`, create \`let data = vec![10, 20, 30];\`. Spawn a thread that takes ownership of \`data\` and prints it with \`println!("{:?}", data)\`.

Use a \`move\` closure so the vector is moved into the thread. Join the handle at the end.`,
    hints: [
      'A move closure transfers ownership of captured variables into the thread.',
      'Write the closure as \`move || { ... }\`.',
      'Without move, the closure would only borrow data, which the compiler rejects here.',
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
    tags: ['threads', 'move', 'ownership'],
  },
  {
    id: 'rs-ch16-c-039',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Return a Value From a Thread',
    prompt: `Spawn a thread whose closure computes the sum of the numbers 1 through 100 and returns that sum as the last expression of the closure.

In \`main\`, capture the value returned by \`handle.join().unwrap()\` into a variable named \`total\` and print it. The output should be \`5050\`.`,
    hints: [
      'join() returns a Result whose Ok value is whatever the thread closure returned.',
      'The last expression of the closure becomes the threads return value.',
      'Use \`(1..=100).sum()\` or a manual loop.',
    ],
    solution: `use std::thread;

fn main() {
    let handle = thread::spawn(|| {
        let mut sum = 0;
        for i in 1..=100 {
            sum += i;
        }
        sum
    });

    let total = handle.join().unwrap();
    println!("{}", total);
}`,
    starter: `use std::thread;

fn main() {
    // TODO: spawn a thread that returns the sum 1..=100, then print the joined value
}`,
    tags: ['threads', 'join', 'return-value'],
  },
  {
    id: 'rs-ch16-c-040',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Collect Results From Many Threads',
    prompt: `Spawn 5 threads. Thread number \`i\` (for \`i\` from 0 to 4) should return \`i * i\`. Store each handle in a \`Vec\`.

After spawning all 5, join every handle in order and push each returned value into a \`Vec<i32>\` named \`results\`. Print \`results\`; the output should be \`[0, 1, 4, 9, 16]\`.`,
    hints: [
      'Push handles into a Vec inside the spawning loop.',
      'Capture i with a move closure so each thread owns its own copy.',
      'Iterate the handles vector and call join().unwrap() on each.',
    ],
    solution: `use std::thread;

fn main() {
    let mut handles = Vec::new();

    for i in 0..5 {
        let handle = thread::spawn(move || i * i);
        handles.push(handle);
    }

    let mut results = Vec::new();
    for handle in handles {
        results.push(handle.join().unwrap());
    }

    println!("{:?}", results);
}`,
    starter: `use std::thread;

fn main() {
    let mut handles = Vec::new();
    // TODO: spawn 5 threads returning i*i, then join and collect results
}`,
    tags: ['threads', 'join', 'vec'],
  },
  {
    id: 'rs-ch16-c-041',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Send a Single Value Over a Channel',
    prompt: `Create an mpsc channel with \`mpsc::channel()\`. Spawn a thread that moves the transmitter in and sends the string \`hi\` (as a \`String\`) once.

In the main thread, call \`rx.recv().unwrap()\` to receive the value into a variable named \`received\` and print it. The output should be \`hi\`.`,
    hints: [
      'Import with \`use std::sync::mpsc;\`.',
      'channel() returns a (tx, rx) tuple.',
      'Move tx into the thread closure with move.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap();
    });

    let received = rx.recv().unwrap();
    println!("{}", received);
}`,
    starter: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    // TODO: spawn a thread that sends "hi", then recv and print it
}`,
    tags: ['channels', 'mpsc', 'send'],
  },
  {
    id: 'rs-ch16-c-042',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Send Several Values and Iterate the Receiver',
    prompt: `Create a channel. Spawn a thread that sends four \`String\` values one at a time: \`one\`, \`two\`, \`three\`, \`four\`.

In the main thread, treat \`rx\` as an iterator (\`for received in rx\`) and print each value on its own line. The loop should end automatically when the sender is dropped.`,
    hints: [
      'Iterating over rx yields each received value until the channel closes.',
      'When the thread finishes, tx is dropped and the for loop ends.',
      'You can build the values with a Vec and a loop, or send them individually.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let vals = vec![
            String::from("one"),
            String::from("two"),
            String::from("three"),
            String::from("four"),
        ];
        for val in vals {
            tx.send(val).unwrap();
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
    // TODO: send four strings from a thread, then iterate rx and print each
}`,
    tags: ['channels', 'mpsc', 'iterator'],
  },
  {
    id: 'rs-ch16-c-043',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Sum Values Received From a Channel',
    prompt: `Create a channel. Spawn a thread that sends the integers 1 through 10 (as \`i32\`) over the channel.

In the main thread, iterate the receiver, add up all received values into a variable named \`sum\`, and print it. The output should be \`55\`.`,
    hints: [
      'Send each i in a loop from inside the thread.',
      'Accumulate into a mutable sum as you iterate rx.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        for i in 1..=10 {
            tx.send(i).unwrap();
        }
    });

    let mut sum = 0;
    for received in rx {
        sum += received;
    }

    println!("{}", sum);
}`,
    starter: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    // TODO: send 1..=10 from a thread, sum them in main, print the total
}`,
    tags: ['channels', 'mpsc', 'iterator'],
  },
  {
    id: 'rs-ch16-c-044',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Multiple Producers With a Cloned Sender',
    prompt: `Create a channel. Clone the transmitter with \`tx.clone()\` so you have two senders. Spawn two threads: the first sends the strings \`a1\`, \`a2\`, \`a3\`; the second sends \`b1\`, \`b2\`, \`b3\`.

In the main thread, iterate the receiver and print every received value. Order between the two threads is not guaranteed, but all six values must be received.`,
    hints: [
      'Clone tx before moving the original into the first thread.',
      'Each thread should own one sender via a move closure.',
      'The for loop over rx ends once both senders are dropped.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    let tx1 = tx.clone();

    thread::spawn(move || {
        for val in ["a1", "a2", "a3"] {
            tx1.send(String::from(val)).unwrap();
        }
    });

    thread::spawn(move || {
        for val in ["b1", "b2", "b3"] {
            tx.send(String::from(val)).unwrap();
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
    // TODO: clone tx, spawn two producer threads, then iterate rx
}`,
    tags: ['channels', 'mpsc', 'multiple-producers'],
  },
  {
    id: 'rs-ch16-c-045',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Lock a Mutex and Mutate the Value',
    prompt: `In \`main\`, create \`let m = Mutex::new(5);\`. Acquire the lock with \`m.lock().unwrap()\`, then add 1 to the value behind the guard so it becomes 6. Let the guard drop (for example by ending its scope).

After mutating, print the mutex with \`println!("m = {:?}", m)\`. The output should be \`m = Mutex { data: 6, poisoned: false, .. }\`.`,
    hints: [
      'Import with \`use std::sync::Mutex;\`.',
      'lock() returns a Result whose Ok value is a MutexGuard.',
      'Dereference the guard with * to read or modify the inner value.',
    ],
    solution: `use std::sync::Mutex;

fn main() {
    let m = Mutex::new(5);

    {
        let mut num = m.lock().unwrap();
        *num += 1;
    }

    println!("m = {:?}", m);
}`,
    starter: `use std::sync::Mutex;

fn main() {
    let m = Mutex::new(5);
    // TODO: lock m, add 1 to the inner value, then print m
}`,
    tags: ['mutex', 'lock', 'guard'],
  },
  {
    id: 'rs-ch16-c-046',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'A Shared Counter With Arc and Mutex',
    prompt: `Build a shared counter. Create \`let counter = Arc::new(Mutex::new(0));\`. Spawn 10 threads; each thread clones the \`Arc\`, locks the mutex, and adds 1 to the value.

After all threads have been joined, print \`Result: N\` where N is the final count. The output should be \`Result: 10\`.`,
    hints: [
      'Import Arc and Mutex from std::sync.',
      'Call Arc::clone(&counter) before moving the clone into each thread.',
      'Collect handles in a Vec and join them all before printing.',
    ],
    solution: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = Vec::new();

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
    // TODO: spawn 10 threads that each increment the counter, join, then print
}`,
    tags: ['arc', 'mutex', 'shared-state'],
  },
  {
    id: 'rs-ch16-c-047',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Add Varying Amounts to a Shared Total',
    prompt: `Create a shared total with \`Arc::new(Mutex::new(0))\`. Spawn 5 threads where thread \`i\` (for \`i\` from 1 to 5) adds \`i\` to the total.

After joining all threads, print the final total. The output should be \`15\`.`,
    hints: [
      'Use a move closure that captures both the cloned Arc and i.',
      'Lock the mutex, then add i to the inner value.',
    ],
    solution: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let total = Arc::new(Mutex::new(0));
    let mut handles = Vec::new();

    for i in 1..=5 {
        let total = Arc::clone(&total);
        let handle = thread::spawn(move || {
            let mut t = total.lock().unwrap();
            *t += i;
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
    // TODO: spawn 5 threads where thread i adds i, join, then print the total
}`,
    tags: ['arc', 'mutex', 'shared-state'],
  },
  {
    id: 'rs-ch16-c-048',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Push to a Shared Vector From Threads',
    prompt: `Create \`let log = Arc::new(Mutex::new(Vec::new()));\` holding a \`Vec<i32>\`. Spawn 4 threads; thread \`i\` (for \`i\` from 0 to 3) locks the mutex and pushes \`i\` into the vector.

After joining all threads, lock the mutex, sort the vector, and print it. The output should be \`[0, 1, 2, 3]\`.`,
    hints: [
      'Lock the mutex to get mutable access, then call push.',
      'Sort the vector in main after all threads finish so the output is deterministic.',
      'You can call .sort() on the guard via dereference.',
    ],
    solution: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let log = Arc::new(Mutex::new(Vec::new()));
    let mut handles = Vec::new();

    for i in 0..4 {
        let log = Arc::clone(&log);
        let handle = thread::spawn(move || {
            let mut v = log.lock().unwrap();
            v.push(i);
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    let mut v = log.lock().unwrap();
    v.sort();
    println!("{:?}", *v);
}`,
    starter: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let log = Arc::new(Mutex::new(Vec::new()));
    // TODO: 4 threads each push i, join, then sort and print the vector
}`,
    tags: ['arc', 'mutex', 'vec'],
  },
  {
    id: 'rs-ch16-c-049',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Channel of Structs',
    prompt: `Define a struct \`Job\` with a single \`pub\`-free field \`id: u32\`. Create a channel of \`Job\`. Spawn a thread that sends three jobs with ids 1, 2, and 3.

In the main thread, iterate the receiver and print \`processing job ID\` for each job (with the actual id), in order.`,
    hints: [
      'The channel type is inferred from the first send, so it carries Job values.',
      'Iterate rx and read job.id for each received Job.',
      'Send the jobs in order from the thread.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

struct Job {
    id: u32,
}

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        for id in 1..=3 {
            tx.send(Job { id }).unwrap();
        }
    });

    for job in rx {
        println!("processing job {}", job.id);
    }
}`,
    starter: `use std::sync::mpsc;
use std::thread;

struct Job {
    id: u32,
}

fn main() {
    let (tx, rx) = mpsc::channel();
    // TODO: send three Jobs from a thread, iterate rx, print each id
}`,
    tags: ['channels', 'struct', 'mpsc'],
  },
  {
    id: 'rs-ch16-c-050',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Drain a Channel With try_recv',
    prompt: `Create a channel. Spawn a thread that sends the integers 1, 2, 3, then finishes (dropping its sender). Join that thread before reading.

In the main thread, loop calling \`rx.try_recv()\` and print each \`Ok\` value; break out of the loop the first time \`try_recv\` returns an \`Err\` (meaning empty and disconnected). The output should be the lines \`1\`, \`2\`, \`3\`.`,
    hints: [
      'try_recv returns Result<T, TryRecvError> and does not block.',
      'A match on try_recv with Ok(v) and Err(_) arms makes the loop clear.',
      'Join the sender thread first so all values are queued before you drain.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    let handle = thread::spawn(move || {
        for i in 1..=3 {
            tx.send(i).unwrap();
        }
    });

    handle.join().unwrap();

    loop {
        match rx.try_recv() {
            Ok(v) => println!("{}", v),
            Err(_) => break,
        }
    }
}`,
    starter: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    // TODO: send 1,2,3 from a thread, join it, then drain rx with try_recv
}`,
    tags: ['channels', 'try_recv', 'mpsc'],
  },
  {
    id: 'rs-ch16-c-051',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Worker Threads Report Through a Channel',
    prompt: `Create a channel of \`i32\`. Spawn 3 worker threads; worker \`i\` (for \`i\` from 1 to 3) sends \`i * 10\` through a cloned sender. Drop the original sender in main after cloning so the receiver loop can terminate.

In the main thread, collect all received values into a \`Vec<i32>\`, sort it, and print it. The output should be \`[10, 20, 30]\`.`,
    hints: [
      'Clone tx once per worker so each owns its own sender.',
      'Call drop(tx) on the original after the spawn loop, or let it go out of scope, so rx closes.',
      'Collect the iterator over rx into a Vec, then sort.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    for i in 1..=3 {
        let tx = tx.clone();
        thread::spawn(move || {
            tx.send(i * 10).unwrap();
        });
    }

    drop(tx);

    let mut results: Vec<i32> = rx.iter().collect();
    results.sort();
    println!("{:?}", results);
}`,
    starter: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    // TODO: 3 workers send i*10 via cloned senders; drop tx; collect, sort, print
}`,
    tags: ['channels', 'multiple-producers', 'drop'],
  },
  {
    id: 'rs-ch16-c-052',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Move Multiple Values Into a Thread',
    prompt: `In \`main\`, create \`let name = String::from("Ada");\` and \`let nums = vec![1, 2, 3];\`. Spawn a single thread that takes ownership of BOTH values with one move closure and prints \`name then nums\` formatted as \`Ada: [1, 2, 3]\`.

Join the handle at the end.`,
    hints: [
      'A single move closure can capture more than one variable.',
      'Use println! with {} for the String and {:?} for the Vec.',
    ],
    solution: `use std::thread;

fn main() {
    let name = String::from("Ada");
    let nums = vec![1, 2, 3];

    let handle = thread::spawn(move || {
        println!("{}: {:?}", name, nums);
    });

    handle.join().unwrap();
}`,
    starter: `use std::thread;

fn main() {
    let name = String::from("Ada");
    let nums = vec![1, 2, 3];
    // TODO: move both into one thread and print "Ada: [1, 2, 3]", then join
}`,
    tags: ['threads', 'move', 'ownership'],
  },
  {
    id: 'rs-ch16-c-053',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Parallel Squares Returned and Summed',
    prompt: `Spawn 4 threads where thread \`i\` (for \`i\` from 1 to 4) returns \`i * i\`. Join all four, add their returned values together, and print the sum. The output should be \`30\` (1 + 4 + 9 + 16).`,
    hints: [
      'Store handles in a Vec while spawning.',
      'Accumulate the joined return values into a running sum.',
    ],
    solution: `use std::thread;

fn main() {
    let mut handles = Vec::new();

    for i in 1..=4 {
        handles.push(thread::spawn(move || i * i));
    }

    let mut sum = 0;
    for handle in handles {
        sum += handle.join().unwrap();
    }

    println!("{}", sum);
}`,
    starter: `use std::thread;

fn main() {
    let mut handles = Vec::new();
    // TODO: spawn 4 threads returning i*i, join all, sum, and print
}`,
    tags: ['threads', 'join', 'return-value'],
  },
  {
    id: 'rs-ch16-c-054',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Send a Computed Result Over a Channel',
    prompt: `Create a channel of \`u64\`. Spawn a thread that computes the factorial of 10 and sends the result through the channel.

In the main thread, receive the value with \`recv().unwrap()\` and print it. The output should be \`3628800\`.`,
    hints: [
      'Compute 10! with a loop or with (1..=10).product().',
      'Send the single result, then recv it in main.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let mut fact: u64 = 1;
        for i in 1..=10 {
            fact *= i;
        }
        tx.send(fact).unwrap();
    });

    let result = rx.recv().unwrap();
    println!("{}", result);
}`,
    starter: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    // TODO: compute 10! in a thread, send it, then recv and print
}`,
    tags: ['channels', 'mpsc', 'recv'],
  },
  {
    id: 'rs-ch16-c-055',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Track Maximum With a Shared Mutex',
    prompt: `Create \`let max = Arc::new(Mutex::new(i32::MIN));\`. Given the slice of values \`[3, 9, 2, 7, 5]\`, spawn one thread per value. Each thread locks the mutex and, if its value is greater than the stored maximum, replaces the stored maximum.

After joining all threads, print the final maximum. The output should be \`9\`.`,
    hints: [
      'Move each value into its thread with a move closure.',
      'Lock the mutex, compare *guard with the value, and update if larger.',
      'i32::MIN is a safe starting value for a maximum.',
    ],
    solution: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let max = Arc::new(Mutex::new(i32::MIN));
    let values = [3, 9, 2, 7, 5];
    let mut handles = Vec::new();

    for v in values {
        let max = Arc::clone(&max);
        let handle = thread::spawn(move || {
            let mut m = max.lock().unwrap();
            if v > *m {
                *m = v;
            }
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("{}", *max.lock().unwrap());
}`,
    starter: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let max = Arc::new(Mutex::new(i32::MIN));
    let values = [3, 9, 2, 7, 5];
    // TODO: one thread per value updates the shared maximum, then print it
}`,
    tags: ['arc', 'mutex', 'shared-state'],
  },
  {
    id: 'rs-ch16-c-056',
    chapter: 16,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Fan-Out Work, Fan-In Results',
    prompt: `Create a channel of \`(usize, i32)\` pairs. Given \`let inputs = vec![5, 10, 15, 20];\`, spawn one thread per input. Thread for index \`i\` and value \`v\` sends the pair \`(i, v * 2)\` over a cloned sender. Drop the original sender after the spawn loop.

In the main thread, build a \`Vec<i32>\` of length 4 (initialized with zeros), then for each received \`(i, doubled)\` place \`doubled\` at position \`i\`. Print the final vector. The output should be \`[10, 20, 30, 40]\`.`,
    hints: [
      'Use .enumerate() over inputs to get (i, v).',
      'Clone tx for each thread; drop the original so the receiver loop ends.',
      'Index the results vector by the received i to keep order correct.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let inputs = vec![5, 10, 15, 20];
    let (tx, rx) = mpsc::channel();

    for (i, v) in inputs.into_iter().enumerate() {
        let tx = tx.clone();
        thread::spawn(move || {
            tx.send((i, v * 2)).unwrap();
        });
    }

    drop(tx);

    let mut results = vec![0; 4];
    for (i, doubled) in rx {
        results[i] = doubled;
    }

    println!("{:?}", results);
}`,
    starter: `use std::sync::mpsc;
use std::thread;

fn main() {
    let inputs = vec![5, 10, 15, 20];
    let (tx, rx) = mpsc::channel();
    // TODO: send (index, value*2) from threads; place results by index; print
}`,
    tags: ['channels', 'multiple-producers', 'fan-out'],
  },
  {
    id: 'rs-ch16-c-057',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Choose Channels for a Pipeline',
    prompt: `A producer generates the numbers 1 through 6 and a consumer must square each one. Decide whether message passing or shared state fits a single-producer single-consumer pipeline, and implement it with a channel.

Spawn a producer thread that sends 1 through 6. In the main thread (the consumer), receive each value, square it, and print the squares in the order received: \`1\`, \`4\`, \`9\`, \`16\`, \`25\`, \`36\`.`,
    hints: [
      'A pipeline where ownership of each item flows forward is a natural fit for channels.',
      'Send each number, then square it on the receiving side.',
      'Iterate rx so the loop ends when the producer finishes.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        for i in 1..=6 {
            tx.send(i).unwrap();
        }
    });

    for n in rx {
        println!("{}", n * n);
    }
}`,
    starter: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();
    // TODO: producer sends 1..=6; consumer squares and prints each
}`,
    tags: ['channels', 'pipeline', 'design'],
  },
  {
    id: 'rs-ch16-c-058',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Per-Key Counts in a Shared HashMap',
    prompt: `Create \`let counts = Arc::new(Mutex::new(HashMap::new()));\` mapping \`String\` to \`i32\`. Given the words \`["a", "b", "a", "c", "a", "b"]\`, spawn one thread per word. Each thread locks the map and increments the count for its word (using the entry API).

After joining all threads, lock the map and print the count for \`a\`, the count for \`b\`, and the count for \`c\` on separate lines as \`a: 3\`, \`b: 2\`, \`c: 1\`.`,
    hints: [
      'Import HashMap from std::collections.',
      'Use entry(word).or_insert(0) and add 1 inside the locked guard.',
      'Read back specific keys after joining to make the output deterministic.',
    ],
    solution: `use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counts = Arc::new(Mutex::new(HashMap::new()));
    let words = ["a", "b", "a", "c", "a", "b"];
    let mut handles = Vec::new();

    for w in words {
        let counts = Arc::clone(&counts);
        let handle = thread::spawn(move || {
            let mut map = counts.lock().unwrap();
            *map.entry(String::from(w)).or_insert(0) += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    let map = counts.lock().unwrap();
    println!("a: {}", map["a"]);
    println!("b: {}", map["b"]);
    println!("c: {}", map["c"]);
}`,
    starter: `use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counts = Arc::new(Mutex::new(HashMap::new()));
    let words = ["a", "b", "a", "c", "a", "b"];
    // TODO: one thread per word increments its count; then print a, b, c counts
}`,
    tags: ['arc', 'mutex', 'hashmap'],
  },
  {
    id: 'rs-ch16-c-059',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Split a Slice Across Two Threads',
    prompt: `Given \`let nums = vec![1, 2, 3, 4, 5, 6, 7, 8];\`, split the work of summing it across two threads using a channel. The first thread sums the first half; the second thread sums the second half. Each sends its partial sum.

In the main thread, receive both partial sums, add them, and print the total. The output should be \`36\`.`,
    hints: [
      'Clone or split the data into two owned Vecs before moving into threads.',
      'Each thread sends one i32 partial sum.',
      'Receive exactly two values, or iterate after dropping the original tx.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let nums = vec![1, 2, 3, 4, 5, 6, 7, 8];
    let first: Vec<i32> = nums[..4].to_vec();
    let second: Vec<i32> = nums[4..].to_vec();

    let (tx, rx) = mpsc::channel();

    let tx1 = tx.clone();
    thread::spawn(move || {
        let s: i32 = first.iter().sum();
        tx1.send(s).unwrap();
    });

    thread::spawn(move || {
        let s: i32 = second.iter().sum();
        tx.send(s).unwrap();
    });

    let total: i32 = rx.iter().sum();
    println!("{}", total);
}`,
    starter: `use std::sync::mpsc;
use std::thread;

fn main() {
    let nums = vec![1, 2, 3, 4, 5, 6, 7, 8];
    // TODO: sum each half in its own thread, send partial sums, print the total
}`,
    tags: ['channels', 'threads', 'parallel-sum'],
  },
  {
    id: 'rs-ch16-c-060',
    chapter: 16,
    kind: 'coding',
    difficulty: 'medium',
    title: 'Hold the Lock Briefly',
    prompt: `Create a shared counter \`Arc::new(Mutex::new(0))\`. Spawn 8 threads. Each thread should compute the value \`100\` WITHOUT holding the lock, then lock the mutex only long enough to add that value, releasing the guard immediately by ending an inner scope.

After joining all threads, print the total. The output should be \`800\`.`,
    hints: [
      'Compute the contribution before calling lock() so the critical section stays small.',
      'Wrap the lock and the addition in their own block so the guard drops promptly.',
      'Join all handles before reading the total.',
    ],
    solution: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = Vec::new();

    for _ in 0..8 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let contribution = 100;
            {
                let mut num = counter.lock().unwrap();
                *num += contribution;
            }
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("{}", *counter.lock().unwrap());
}`,
    starter: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    // TODO: 8 threads compute 100 without the lock, then add it in a short scope
}`,
    tags: ['arc', 'mutex', 'critical-section'],
  },
  {
    id: 'rs-ch16-c-061',
    chapter: 16,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Use Arc Because Rc Is Not Thread-Safe',
    prompt: `You are given starter code that tries to share an \`Rc<i32>\` across threads, which will not compile because \`Rc\` is not \`Send\`. Rewrite it so several threads can read a shared integer.

Create \`let value = Arc::new(42);\`. Spawn 3 threads; each clones the \`Arc\` and prints \`thread sees 42\`. Join all three. Explain in a one-line comment why \`Arc\` is required instead of \`Rc\`.`,
    hints: [
      'Rc is not Send, so it cannot cross thread boundaries; Arc uses atomic reference counts.',
      'Clone the Arc with Arc::clone(&value) before moving it into each thread.',
      'No Mutex is needed because the threads only read an immutable value.',
    ],
    solution: `use std::sync::Arc;
use std::thread;

fn main() {
    // Arc is required because Rc is not Send; Arc uses atomic ref counts safe across threads.
    let value = Arc::new(42);
    let mut handles = Vec::new();

    for _ in 0..3 {
        let value = Arc::clone(&value);
        let handle = thread::spawn(move || {
            println!("thread sees {}", *value);
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }
}`,
    starter: `use std::rc::Rc;
use std::thread;

fn main() {
    let value = Rc::new(42);
    // This does not compile: Rc is not Send. Rewrite using Arc.
    let mut handles = Vec::new();
    for _ in 0..3 {
        let value = Rc::clone(&value);
        let handle = thread::spawn(move || {
            println!("thread sees {}", *value);
        });
        handles.push(handle);
    }
    for handle in handles {
        handle.join().unwrap();
    }
}`,
    tags: ['arc', 'rc', 'send'],
  },
  {
    id: 'rs-ch16-c-062',
    chapter: 16,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Bank Account Transfers With Shared Mutexes',
    prompt: `Model two accounts, each an \`Arc<Mutex<i32>>\` starting at 100. Spawn 5 threads; each transfers 10 from account A to account B by locking A and subtracting 10, then locking B and adding 10 (lock A first, then B, in every thread to avoid deadlock).

After joining all threads, print the two balances as \`A: 50\` and \`B: 150\`.`,
    hints: [
      'Clone both Arcs into each thread.',
      'Always acquire the locks in the same order across all threads.',
      'Use a short scope or sequential locks so guards drop before the next operation.',
    ],
    solution: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let a = Arc::new(Mutex::new(100));
    let b = Arc::new(Mutex::new(100));
    let mut handles = Vec::new();

    for _ in 0..5 {
        let a = Arc::clone(&a);
        let b = Arc::clone(&b);
        let handle = thread::spawn(move || {
            let mut ga = a.lock().unwrap();
            *ga -= 10;
            let mut gb = b.lock().unwrap();
            *gb += 10;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("A: {}", *a.lock().unwrap());
    println!("B: {}", *b.lock().unwrap());
}`,
    starter: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let a = Arc::new(Mutex::new(100));
    let b = Arc::new(Mutex::new(100));
    // TODO: 5 threads transfer 10 from A to B (lock A then B); print both balances
}`,
    tags: ['arc', 'mutex', 'deadlock-avoidance'],
  },
  {
    id: 'rs-ch16-c-063',
    chapter: 16,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Worker Pool Pulling From a Shared Queue',
    prompt: `Build a tiny worker pool. Create a shared queue \`Arc<Mutex<Vec<i32>>>\` initialized with the numbers 1 through 12 (in reverse so popping yields 1, 2, ... is not required). Also create a results channel of \`i32\`.

Spawn 3 worker threads. Each worker loops: lock the queue, pop a value; if the queue is empty, break; otherwise unlock, square the value, and send the square over a cloned sender. Drop the original sender after spawning. In main, collect all received squares, sort them, and print the vector. The output should be \`[1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144]\`.`,
    hints: [
      'Pop while holding the lock, then release the guard before doing the heavy work.',
      'Break out of the worker loop when pop returns None.',
      'Clone tx per worker and drop the original so the receiver loop ends.',
    ],
    solution: `use std::sync::{Arc, Mutex};
use std::sync::mpsc;
use std::thread;

fn main() {
    let queue = Arc::new(Mutex::new((1..=12).collect::<Vec<i32>>()));
    let (tx, rx) = mpsc::channel();
    let mut handles = Vec::new();

    for _ in 0..3 {
        let queue = Arc::clone(&queue);
        let tx = tx.clone();
        let handle = thread::spawn(move || loop {
            let item = {
                let mut q = queue.lock().unwrap();
                q.pop()
            };
            match item {
                Some(v) => tx.send(v * v).unwrap(),
                None => break,
            }
        });
        handles.push(handle);
    }

    drop(tx);

    let mut results: Vec<i32> = rx.iter().collect();

    for handle in handles {
        handle.join().unwrap();
    }

    results.sort();
    println!("{:?}", results);
}`,
    starter: `use std::sync::{Arc, Mutex};
use std::sync::mpsc;
use std::thread;

fn main() {
    let queue = Arc::new(Mutex::new((1..=12).collect::<Vec<i32>>()));
    let (tx, rx) = mpsc::channel();
    // TODO: 3 workers pop, square, and send; collect, sort, and print the squares
}`,
    tags: ['arc', 'mutex', 'worker-pool'],
  },
  {
    id: 'rs-ch16-c-064',
    chapter: 16,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Two-Stage Channel Pipeline',
    prompt: `Build a pipeline with two channels. Stage 1 (a thread) sends the numbers 1 through 5 into channel \`tx1\`. Stage 2 (a thread) receives from \`rx1\`, multiplies each value by 3, and forwards it into channel \`tx2\`.

In the main thread, receive from \`rx2\`, print each value on its own line, in order. The output should be the lines \`3\`, \`6\`, \`9\`, \`12\`, \`15\`.`,
    hints: [
      'Create both channels up front.',
      'Stage 2 iterates rx1 and sends transformed values into tx2.',
      'When stage 1 finishes, rx1 closes; when stage 2 finishes, rx2 closes.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx1, rx1) = mpsc::channel();
    let (tx2, rx2) = mpsc::channel();

    thread::spawn(move || {
        for i in 1..=5 {
            tx1.send(i).unwrap();
        }
    });

    thread::spawn(move || {
        for v in rx1 {
            tx2.send(v * 3).unwrap();
        }
    });

    for v in rx2 {
        println!("{}", v);
    }
}`,
    starter: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx1, rx1) = mpsc::channel();
    let (tx2, rx2) = mpsc::channel();
    // TODO: stage 1 sends 1..=5; stage 2 multiplies by 3 and forwards; main prints
}`,
    tags: ['channels', 'pipeline', 'mpsc'],
  },
  {
    id: 'rs-ch16-c-065',
    chapter: 16,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Make a Type Send with Arc and Mutex',
    prompt: `You have a non-thread-safe shared counter built from \`Rc<RefCell<i32>>\`; sharing it across threads fails because neither \`Rc\` nor \`RefCell\` is \`Sync\`/\`Send\`. Reimplement it as \`Arc<Mutex<i32>>\` so it can be shared and mutated across threads.

Spawn 6 threads that each increment the counter by 1. After joining, print the total. The output should be \`6\`. Add a one-line comment explaining which traits Arc and Mutex provide that Rc and RefCell lack.`,
    hints: [
      'Arc provides Send + Sync sharing; Mutex provides Sync interior mutability.',
      'Rc is not Send and RefCell is not Sync, so the original cannot cross threads.',
      'Lock the Mutex to mutate; clone the Arc for each thread.',
    ],
    solution: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    // Arc is Send + Sync (atomic ref counts) and Mutex gives Sync interior mutability;
    // Rc is not Send and RefCell is not Sync, so they cannot be shared across threads.
    let counter = Arc::new(Mutex::new(0));
    let mut handles = Vec::new();

    for _ in 0..6 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut n = counter.lock().unwrap();
            *n += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("{}", *counter.lock().unwrap());
}`,
    starter: `use std::rc::Rc;
use std::cell::RefCell;
use std::thread;

fn main() {
    // Does not compile across threads: Rc is not Send, RefCell is not Sync.
    let counter = Rc::new(RefCell::new(0));
    let mut handles = Vec::new();
    for _ in 0..6 {
        let counter = Rc::clone(&counter);
        let handle = thread::spawn(move || {
            *counter.borrow_mut() += 1;
        });
        handles.push(handle);
    }
    for handle in handles {
        handle.join().unwrap();
    }
    // TODO: switch to Arc<Mutex<i32>> and print the total
}`,
    tags: ['arc', 'mutex', 'send-sync'],
  },
  {
    id: 'rs-ch16-c-066',
    chapter: 16,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Parallel Word Count Merged Over a Channel',
    prompt: `Given \`let lines = vec!["the cat", "the dog", "a cat the"];\`, count word frequencies in parallel. Spawn one thread per line; each thread builds a local \`HashMap<String, i32>\` for its line and sends that map over a cloned channel sender. Drop the original sender afterward.

In the main thread, receive every partial map and merge them into one combined \`HashMap<String, i32>\`. Then print the counts for \`the\`, \`cat\`, \`dog\`, and \`a\` on separate lines as \`the: 3\`, \`cat: 2\`, \`dog: 1\`, \`a: 1\`.`,
    hints: [
      'Each thread splits its line on whitespace with split_whitespace and counts words locally.',
      'Send the local HashMap; merge by adding counts into the combined map on receipt.',
      'Drop the original tx so the receiver loop ends after all partial maps arrive.',
    ],
    solution: `use std::collections::HashMap;
use std::sync::mpsc;
use std::thread;

fn main() {
    let lines = vec!["the cat", "the dog", "a cat the"];
    let (tx, rx) = mpsc::channel();

    for line in lines {
        let tx = tx.clone();
        let owned = String::from(line);
        thread::spawn(move || {
            let mut local: HashMap<String, i32> = HashMap::new();
            for word in owned.split_whitespace() {
                *local.entry(word.to_string()).or_insert(0) += 1;
            }
            tx.send(local).unwrap();
        });
    }

    drop(tx);

    let mut combined: HashMap<String, i32> = HashMap::new();
    for partial in rx {
        for (word, count) in partial {
            *combined.entry(word).or_insert(0) += count;
        }
    }

    println!("the: {}", combined["the"]);
    println!("cat: {}", combined["cat"]);
    println!("dog: {}", combined["dog"]);
    println!("a: {}", combined["a"]);
}`,
    starter: `use std::collections::HashMap;
use std::sync::mpsc;
use std::thread;

fn main() {
    let lines = vec!["the cat", "the dog", "a cat the"];
    let (tx, rx) = mpsc::channel();
    // TODO: count each line in a thread, send partial maps, merge, then print counts
}`,
    tags: ['channels', 'hashmap', 'map-reduce'],
  },
  {
    id: 'rs-ch16-c-067',
    chapter: 16,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Choose Shared State for a Live Counter',
    prompt: `Several threads must repeatedly increment a single running total that the main thread reads at the end. Argue (in a one-line comment) why shared state with \`Arc<Mutex<_>>\` fits better than a channel here, then implement it.

Spawn 4 threads; each thread increments the shared counter 1000 times. After joining, print the final total. The output should be \`4000\`.`,
    hints: [
      'A single shared mutable total that many threads update in place is a shared-state problem.',
      'Lock once per increment, or lock once and loop the increments inside the guard.',
      'Channels move ownership forward; here every thread mutates the same value.',
    ],
    solution: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    // Shared state fits: many threads mutate one in-place total, not a forward flow of items.
    let counter = Arc::new(Mutex::new(0));
    let mut handles = Vec::new();

    for _ in 0..4 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            for _ in 0..1000 {
                let mut n = counter.lock().unwrap();
                *n += 1;
            }
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("{}", *counter.lock().unwrap());
}`,
    starter: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    // TODO: 4 threads each increment 1000 times; print the final total
}`,
    tags: ['arc', 'mutex', 'design'],
  },
  {
    id: 'rs-ch16-c-068',
    chapter: 16,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Shared Vector Initialized in Parallel',
    prompt: `Create \`let data = Arc::new(Mutex::new(vec![0i32; 6]));\`. Spawn 6 threads; thread \`i\` (for \`i\` from 0 to 5) locks the vector and sets index \`i\` to \`i * i\`.

After joining all threads, lock the vector and print it. The output should be \`[0, 1, 4, 9, 16, 25]\`. Each thread writes only its own index, so the result is deterministic.`,
    hints: [
      'Move i into each thread so it knows which index to write.',
      'Lock the mutex, then assign to v[i].',
      'Because each thread owns a distinct index, no read-modify-write race occurs on the same slot.',
    ],
    solution: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let data = Arc::new(Mutex::new(vec![0i32; 6]));
    let mut handles = Vec::new();

    for i in 0..6 {
        let data = Arc::clone(&data);
        let handle = thread::spawn(move || {
            let mut v = data.lock().unwrap();
            v[i] = (i as i32) * (i as i32);
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("{:?}", *data.lock().unwrap());
}`,
    starter: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let data = Arc::new(Mutex::new(vec![0i32; 6]));
    // TODO: thread i writes i*i to index i; join all; print the vector
}`,
    tags: ['arc', 'mutex', 'vec'],
  },
  {
    id: 'rs-ch16-c-069',
    chapter: 16,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Request-Reply Over Channels',
    prompt: `Implement a request-reply pattern. The main thread sends 3 request numbers (1, 2, 3) to a worker over a request channel. The worker receives each request, doubles it, and sends the answer back over a reply channel.

After sending all 3 requests, drop the request sender so the worker stops. Then receive and print the 3 replies, which should be \`2\`, \`4\`, \`6\` (in order).`,
    hints: [
      'Use two channels: one for requests, one for replies.',
      'The worker iterates the request receiver and sends doubled values on the reply sender.',
      'Drop the request tx after sending so the workers loop ends.',
    ],
    solution: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (req_tx, req_rx) = mpsc::channel();
    let (rep_tx, rep_rx) = mpsc::channel();

    thread::spawn(move || {
        for request in req_rx {
            rep_tx.send(request * 2).unwrap();
        }
    });

    for n in 1..=3 {
        req_tx.send(n).unwrap();
    }
    drop(req_tx);

    for reply in rep_rx {
        println!("{}", reply);
    }
}`,
    starter: `use std::sync::mpsc;
use std::thread;

fn main() {
    let (req_tx, req_rx) = mpsc::channel();
    let (rep_tx, rep_rx) = mpsc::channel();
    // TODO: worker doubles each request; main sends 1,2,3, drops req_tx, prints replies
}`,
    tags: ['channels', 'request-reply', 'mpsc'],
  },
  {
    id: 'rs-ch16-c-070',
    chapter: 16,
    kind: 'coding',
    difficulty: 'hard',
    title: 'Concurrent Accumulator With Channel Plus Mutex',
    prompt: `Combine both tools. Create a shared \`Arc<Mutex<i32>>\` accumulator starting at 0 and an mpsc channel of \`i32\`. Spawn 4 producer threads; producer \`i\` (for \`i\` from 1 to 4) sends the value \`i * 100\` over a cloned sender. Drop the original sender after spawning.

Spawn ONE consumer thread that owns the accumulator clone and the receiver: it iterates the receiver and, for each value, locks the accumulator and adds the value. Join the consumer. Finally, in main, lock the original accumulator and print the total. The output should be \`1000\`.`,
    hints: [
      'Producers use the channel to forward values; the consumer aggregates into the shared Mutex.',
      'Clone the Arc once for the consumer and keep the original in main for the final read.',
      'Drop the original tx so the consumers receiver loop terminates.',
    ],
    solution: `use std::sync::{Arc, Mutex};
use std::sync::mpsc;
use std::thread;

fn main() {
    let acc = Arc::new(Mutex::new(0));
    let (tx, rx) = mpsc::channel();

    for i in 1..=4 {
        let tx = tx.clone();
        thread::spawn(move || {
            tx.send(i * 100).unwrap();
        });
    }
    drop(tx);

    let consumer_acc = Arc::clone(&acc);
    let consumer = thread::spawn(move || {
        for value in rx {
            let mut total = consumer_acc.lock().unwrap();
            *total += value;
        }
    });

    consumer.join().unwrap();

    println!("{}", *acc.lock().unwrap());
}`,
    starter: `use std::sync::{Arc, Mutex};
use std::sync::mpsc;
use std::thread;

fn main() {
    let acc = Arc::new(Mutex::new(0));
    let (tx, rx) = mpsc::channel();
    // TODO: 4 producers send i*100; one consumer locks acc and adds each; print total
}`,
    tags: ['channels', 'arc', 'mutex'],
  },
]

export default problems
