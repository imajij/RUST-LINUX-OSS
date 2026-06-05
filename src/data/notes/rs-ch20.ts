import type { ChapterNote } from '../../types'

const note: ChapterNote = {
  id: 'note-rs-20',
  track: 'rust',
  chapter: 20,
  title: 'Final Project: A Multithreaded Web Server',
  summary: `This capstone chapter pulls together ownership, traits, closures, smart pointers, and concurrency to build a working HTTP server from raw TCP sockets, with no web framework. You start by listening for connections, parsing the request line, and writing valid HTTP responses that serve real HTML, including a proper 404. Then you confront the central problem of servers, that a single thread can only handle one slow request at a time, and you fix it by hand-building a thread pool with worker threads, a channel of jobs, and boxed closures. Finally you implement graceful shutdown using Drop and join so no work is abandoned. The point is not to ship this server but to understand, at the level a kernel or runtime contributor needs, exactly what every layer underneath a framework is actually doing.`,
  sections: [
    {
      heading: 'Listening for TCP connections',
      body: `The web is built on two layered protocols. **TCP** is the lower-level transport protocol that describes how data travels between two machines as an ordered, reliable byte stream, without caring what those bytes mean. **HTTP** is a higher-level protocol that defines the meaning of the bytes, the shape of requests and responses, and it almost always rides on top of TCP. We build TCP first because HTTP requests and responses are just text we read from and write to a TCP connection.

The standard library gives us everything in **std::net**. A server binds a **TcpListener** to an address and port, then waits for clients to connect. The address here is the IP and port the server listens on; 127.0.0.1 is the loopback address (your own machine) and 8080 or 7878 are common development ports because ports below 1024 typically need elevated privileges.

### bind, and why it returns a Result
TcpListener::bind returns a Result because binding can fail: the port may already be in use by another process, or you may lack permission to bind it. In real code you handle that error; in the book's learning code we unwrap to keep the focus on the happy path. The name bind comes from the underlying socket operation of binding a socket to an address, the same vocabulary you will see in C and in the Linux kernel networking stack.

### incoming and what a connection actually is
Calling incoming on the listener gives an iterator over **connection attempts**. Each item is a Result wrapping a **TcpStream**, which represents one open connection between client and server. A single TcpStream is bidirectional: the client writes its request into it and reads the server's response back out of the same stream. An item can be an error rather than a stream because a connection attempt can fail even though the listener itself is fine, for example if the operating system hits its open-file-descriptor limit. The connection is closed automatically when the TcpStream value is dropped at the end of the loop body.

### A pitfall worth knowing early
When you run the loop and load a page, you may see a single browser request print **several** connection messages. Browsers open multiple connections and request several resources (the page, a favicon, and so on), and a connection can also be retried. Do not assume one browser action equals exactly one stream.`,
      code: [
        {
          lang: 'rust',
          src: `use std::net::TcpListener;
use std::net::TcpStream;

fn main() {
    // bind returns Result: binding fails if the port is taken or forbidden.
    let listener = TcpListener::bind("127.0.0.1:7878").unwrap();

    // incoming() yields a stream of connection attempts (each a Result).
    for stream in listener.incoming() {
        let stream = stream.unwrap(); // a single open TCP connection
        handle_connection(stream);
        // stream is dropped here -> the connection is closed
    }
}

fn handle_connection(_stream: TcpStream) {
    // we read the request and write a response here (next sections)
}`
        }
      ]
    },
    {
      heading: 'Reading and parsing an HTTP request',
      body: `An HTTP request is plain text with a strict structure. The very first line is the **request line**: a method, a request target (the path), and the HTTP version, separated by spaces, for example a GET for the path slash on HTTP version 1.1. After the request line come zero or more **header lines** of the form name colon space value, then a single blank line (CRLF on its own), and finally an optional body. Each line ends with a carriage return and line feed, the two-character sequence CRLF, which is why HTTP is so picky about exact bytes.

### Reading lines with BufReader
A raw TcpStream gives you bytes; to read it as lines of text you wrap it in a **BufReader**, which buffers the underlying reader so you are not making a syscall per byte. BufReader implements the **BufRead** trait, whose lines method yields an iterator of Result<String>, one per line, with the trailing newline stripped. To read just the request line you take the first item from that iterator; to read the whole header block you collect lines until you hit the empty string that marks the blank separator line.

### Why we stop at the blank line
The lines iterator over a live connection does not naturally end, because the connection stays open. If you tried to collect every line, your server would hang waiting for input that never comes. So you read until the first empty line, which is the protocol's own signal that the headers are finished. This is a recurring theme in network programming: you parse exactly as much as the protocol tells you to, never more.

### Borrowing the stream for reading and writing
A subtle ownership detail: you want to both read from and write to the same stream. If BufReader takes the stream by value it owns it, and you cannot also write. The idiom is to give BufReader a mutable reference (an &mut to the stream) so the stream itself is still available for writing afterward. The book later restructures so the stream is mutable and shared between the reader and the writer.

### Common pitfalls
- **CRLF, not just newline.** Responses you write by hand must use the exact backslash-r backslash-n sequence between lines, or clients may misparse them.
- **Do not trust input length.** A real server must guard against requests that are enormous or never send a blank line; the teaching server omits this, but a production or kernel-facing parser must bound its reads.`,
      code: [
        {
          lang: 'rust',
          src: `use std::io::{BufRead, BufReader};
use std::net::TcpStream;

fn handle_connection(stream: TcpStream) {
    // Wrap the stream so we can read it line by line, buffered.
    let buf_reader = BufReader::new(&stream);

    // Read the whole header block: lines until the first blank line.
    let http_request: Vec<String> = buf_reader
        .lines()
        .map(|line| line.unwrap())
        .take_while(|line| !line.is_empty()) // stop at the blank CRLF line
        .collect();

    // The first line is the request line: method, path, version.
    println!("Request: {:#?}", http_request);

    // To just inspect the request line on its own:
    // let request_line = buf_reader.lines().next().unwrap().unwrap();
}`
        }
      ]
    },
    {
      heading: 'Writing a response and serving HTML',
      body: `A response mirrors the request's shape. It begins with a **status line**: the HTTP version, a numeric status code, and a reason phrase, for example HTTP slash 1.1 then 200 then OK. Next come optional headers, then a blank CRLF line, then the body. To serve a web page you put your HTML in the body and, importantly, tell the client how many bytes the body is with a **Content-Length** header.

### Why Content-Length matters
Over a persistent connection the client needs to know where the body ends. The Content-Length header states the body's size in bytes so the client knows exactly how much to read and when the response is complete. Omit it or get it wrong and clients may hang waiting for more bytes or truncate the page. You compute it from the length of the HTML string you are about to send.

### Building and sending the bytes
You build the whole response as one String by formatting the status line, the Content-Length header, a blank line, and the contents together with explicit CRLF separators. Then you write it. The write_all method on a writer takes a byte slice, so you call as_bytes on your response String to convert it. write_all returns a Result because writing to a socket can fail (the client may have disconnected), so you handle or unwrap it.

### Loading HTML from a file
Rather than hardcoding markup, you read an HTML file from disk with fs::read_to_string, which returns the file contents as a String (in a Result). Keeping the markup in its own file is cleaner and lets you serve a real page. The flush that BufWriter or the stream performs on drop ensures the bytes actually leave the buffer and reach the client.

### The trait that makes write_all available
write_all comes from the **std::io::Write** trait, which you must bring into scope with a use statement before the method is callable on the stream. This is the same trait-method-in-scope rule from earlier chapters: the method exists only where its trait is imported.`,
      code: [
        {
          lang: 'rust',
          src: `use std::fs;
use std::io::Write; // brings write_all into scope on the stream
use std::net::TcpStream;

fn handle_connection(mut stream: TcpStream) {
    let status_line = "HTTP/1.1 200 OK";
    let contents = fs::read_to_string("hello.html").unwrap();
    let length = contents.len();

    // status line, Content-Length header, blank line, then the body.
    let response = format!(
        "{status_line}\\r\\nContent-Length: {length}\\r\\n\\r\\n{contents}"
    );

    // as_bytes() because write_all takes a byte slice; Result handled.
    stream.write_all(response.as_bytes()).unwrap();
}`
        }
      ]
    },
    {
      heading: 'Validating the request and returning 404',
      body: `So far the server returns the same page no matter what is requested, which is not a real server. To respond differently per route you inspect the **request line** and branch on it. If the request asks for the root path with GET on HTTP 1.1, you serve the home page with a 200 status; otherwise you serve an error page with a **404 Not Found** status. The 404 code is the universal signal that the requested resource does not exist.

### Refactoring the branch to avoid duplication
A first attempt writes a full response inside each branch of an if/else, which duplicates the reading, formatting, and writing code. The clean refactor recognizes that the only things that differ between success and failure are two values: the status line and the filename. So you compute just those two with a single match (or if/else) that returns a tuple, then share one block of code that reads the file and writes the response. This is a small but important lesson in keeping the varying part minimal and the common part shared.

### Why match on the whole request line
You compare against the entire request line string, not just the path, because the method and version are part of what makes a request valid for this route. A GET for slash is valid; a POST for slash, or a GET for some unknown path, is not handled and falls through to the 404 branch. A production router would parse method and path into structured values rather than string-matching the raw line, but the principle, decide the response from the request, is identical.

### Pitfalls
- **The error body still needs Content-Length.** A 404 is a normal response with a body; it must carry the correct length just like a 200, or the client may misbehave.
- **Status code and body are independent.** Nothing stops you from sending a 200 with an error page or a 404 with no body; correctness is a discipline the protocol expects of you, not something the types enforce.`,
      code: [
        {
          lang: 'rust',
          src: `use std::fs;
use std::io::{BufRead, BufReader, Write};
use std::net::TcpStream;

fn handle_connection(mut stream: TcpStream) {
    let buf_reader = BufReader::new(&stream);
    let request_line = buf_reader.lines().next().unwrap().unwrap();

    // Only the status line and filename vary; everything else is shared.
    let (status_line, filename) = if request_line == "GET / HTTP/1.1" {
        ("HTTP/1.1 200 OK", "hello.html")
    } else {
        ("HTTP/1.1 404 NOT FOUND", "404.html")
    };

    let contents = fs::read_to_string(filename).unwrap();
    let length = contents.len();
    let response =
        format!("{status_line}\\r\\nContent-Length: {length}\\r\\n\\r\\n{contents}");
    stream.write_all(response.as_bytes()).unwrap();
}`
        }
      ]
    },
    {
      heading: 'Why single-threaded is not enough',
      body: `The server so far processes connections strictly one at a time inside a single loop on one thread. That is fine until a request is **slow**. To make the problem concrete the book adds a route that sleeps for five seconds before responding, simulating a slow database query or computation. With one thread, while that request sleeps, every other client is **blocked**: a fast request for the home page that arrives during the sleep must wait the full five seconds, because the single thread is busy and cannot even start the next connection.

### The core insight
A server's job is largely **waiting**, on disk, on the network, on downstream services. A single thread that blocks on one slow request wastes the machine's ability to make progress on other requests at the same time. The fix is concurrency: handle multiple connections in flight so a slow one does not stall the fast ones. This is the same motivation that drives async runtimes and the kernel's own request handling.

### The naive fix and why it is wrong
The obvious idea is to spawn a brand-new thread for every incoming connection. That removes the head-of-line blocking, and for a toy it works. But it is dangerous in production: there is **no limit** on how many threads you create. Under a flood of requests, or a denial-of-service attack, you would spawn unbounded threads, exhaust memory, and crash. Threads are not free; each has a stack and scheduling cost.

### The right shape: a bounded thread pool
The professional answer is a **thread pool**: a fixed number of pre-spawned worker threads that pull work from a shared queue. Because the count is fixed, your memory and scheduling cost is bounded and predictable, which also makes the server resistant to overload, requests simply queue rather than spawning runaway threads. Choosing the pool size is a real engineering decision tied to your number of cores and the nature of the work; too few underuses the machine, too many causes contention. The next sections build this pool by hand so you understand every moving part.`,
      code: [
        {
          lang: 'rust',
          src: `use std::thread;
use std::time::Duration;

// The slow route that exposes single-threaded blocking.
fn route(request_line: &str) -> (&str, &str) {
    match request_line {
        "GET / HTTP/1.1" => ("HTTP/1.1 200 OK", "hello.html"),
        "GET /sleep HTTP/1.1" => {
            thread::sleep(Duration::from_secs(5)); // blocks the only thread
            ("HTTP/1.1 200 OK", "hello.html")
        }
        _ => ("HTTP/1.1 404 NOT FOUND", "404.html"),
    }
}

// Naive and UNSAFE for production: unbounded thread creation.
// for stream in listener.incoming() {
//     let stream = stream.unwrap();
//     thread::spawn(|| handle_connection(stream)); // no limit -> can exhaust memory
// }`
        }
      ]
    },
    {
      heading: 'Building the thread pool: workers, a channel, and boxed jobs',
      body: `The pool's public API is deliberately small: create a pool with a size, then submit closures to it with an execute method that behaves like thread::spawn but routes work to an existing worker instead of spawning a new thread. Designing the API first, even before it compiles, is **compiler-driven development**: you write the calling code you wish you had, then let the type errors guide you to the implementation.

### The four pieces and how they fit
1. **Worker.** Each worker owns a JoinHandle for one spawned thread that loops forever, waiting for jobs. Workers carry an id mainly for debugging.
2. **A Job type.** A job is a closure to run once on some thread. Its type is a **boxed trait object**: a Box of dyn FnOnce with no arguments and no return, that is also Send and 'static. FnOnce because the closure runs exactly once; Send so the closure can move to a worker thread; 'static because the thread may outlive the caller. The Box is needed because every closure has a different unnameable type and different size, so we store them behind a pointer of known size.
3. **A channel.** The pool holds the sending half (the transmitter); each worker shares the receiving half. execute boxes the closure into a Job and sends it down the channel. Whichever idle worker is waiting on the receiver picks it up. This is the share-by-communicating model from the concurrency chapter applied to work distribution.
4. **Shared, locked receiver.** A channel's receiver cannot be cloned, and multiple workers must read from one receiver, so you wrap it in **Arc<Mutex<Receiver>>**. Arc lets every worker co-own the receiver; Mutex ensures only one worker dequeues a given job, so no job is handed to two workers.

### The receive loop, and a critical lock pitfall
Each worker locks the mutex, calls recv to block until a job arrives, releases the lock, then runs the job. It is essential that the **MutexGuard is dropped before the job runs**. If you instead match on recv inside a while-let, the guard is held for the entire body, so the lock stays held while the long-running job executes and every other worker is locked out, you have accidentally serialized the pool back to one thread. Writing it as a let binding that ends in a semicolon releases the lock immediately, before the job runs. This temporary-lifetime subtlety is exactly the kind of bug that is invisible until you measure and find no parallelism.

### Validating the size
new takes the pool size and the book uses an assert to reject a size of zero, since a pool with no workers can never make progress. An alternative API returns a Result (a build function) so the caller decides how to handle an invalid size rather than panicking.`,
      code: [
        {
          lang: 'rust',
          src: `use std::sync::{mpsc, Arc, Mutex};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

pub struct ThreadPool {
    workers: Vec<Worker>,
    sender: mpsc::Sender<Job>,
}

impl ThreadPool {
    pub fn new(size: usize) -> ThreadPool {
        assert!(size > 0); // a zero-worker pool can never make progress

        let (sender, receiver) = mpsc::channel();
        // One receiver shared by all workers: Arc to co-own, Mutex to dequeue safely.
        let receiver = Arc::new(Mutex::new(receiver));

        let mut workers = Vec::with_capacity(size);
        for id in 0..size {
            workers.push(Worker::new(id, Arc::clone(&receiver)));
        }
        ThreadPool { workers, sender }
    }

    // Mirrors thread::spawn: box the closure into a Job and queue it.
    pub fn execute<F>(&self, f: F)
    where
        F: FnOnce() + Send + 'static,
    {
        let job = Box::new(f);
        self.sender.send(job).unwrap();
    }
}

struct Worker {
    id: usize,
    thread: thread::JoinHandle<()>,
}

impl Worker {
    fn new(id: usize, receiver: Arc<Mutex<mpsc::Receiver<Job>>>) -> Worker {
        let thread = thread::spawn(move || loop {
            // Lock, take ONE job, then DROP the guard before running it.
            // The trailing ';' ends the guard's lifetime so other workers proceed.
            let job = receiver.lock().unwrap().recv().unwrap();
            println!("Worker {id} got a job; executing.");
            job(); // runs with the lock already released -> real parallelism
        });
        Worker { id, thread }
    }
}`
        }
      ]
    },
    {
      heading: 'Graceful shutdown with Drop and joining workers',
      body: `Right now the workers loop forever; when the program ends they are abandoned mid-flight. A real server should **shut down gracefully**: stop accepting new work, let in-progress jobs finish, and join every worker thread so nothing is left dangling. We implement this on the pool's Drop, so cleanup happens automatically when the pool goes out of scope.

### Signaling workers to stop
The workers block on recv. The clean way to wake them up and tell them to stop is to **drop the sender**. When the transmitting half of the channel is dropped, recv on the receiving half returns an Err, because no more messages can ever arrive. Each worker's loop treats that Err as the shutdown signal and breaks out, ending the thread. To drop the sender at the right moment, you wrap it in an Option and take it out in the pool's Drop, so the sender is destroyed before you try to join the workers. If you joined first while the sender still existed, the workers would block forever on recv and join would deadlock.

### Joining inside Drop
After the sender is gone, Drop iterates the workers and calls join on each thread to block until it finishes its current job and exits its loop. Because a JoinHandle cannot be joined out of a Vec by value directly while the Worker still holds it, the worker stores its thread as an Option<JoinHandle>; Drop calls take to move the handle out, leaving None behind, then joins it. take is the standard trick for moving a value out of a struct field you only have a mutable reference to.

### Bounding the work during shutdown
To demonstrate a clean stop, the book makes main accept only a couple of requests (take(2) on incoming) and then return, which drops the pool and triggers the whole shutdown sequence. You then see each worker report it was told to shut down, and the joins complete in order. The takeaway: shutdown is just ownership and channels working in reverse, drop the producer to close the queue, then join the consumers.

### Pitfalls
- **Order matters absolutely.** Drop the sender first, then join. Reverse it and you deadlock.
- **join blocks.** A worker stuck on a long or infinite job will make shutdown hang; graceful shutdown finishes current work but cannot forcibly kill a runaway job.
- **take leaves None.** After taking the thread (or sender) out, the field is None, so guard against double-takes; the Drop runs once, which keeps this safe here.`,
      code: [
        {
          lang: 'rust',
          src: `use std::sync::{mpsc, Arc, Mutex};
use std::thread;

type Job = Box<dyn FnOnce() + Send + 'static>;

pub struct ThreadPool {
    workers: Vec<Worker>,
    sender: Option<mpsc::Sender<Job>>, // Option so Drop can take and drop it
}

impl Drop for ThreadPool {
    fn drop(&mut self) {
        // 1) Drop the sender FIRST: closing the channel makes recv() return Err,
        //    which tells every blocked worker to stop. Join here would deadlock.
        drop(self.sender.take());

        // 2) Now join each worker so in-progress jobs finish before we exit.
        for worker in &mut self.workers {
            println!("Shutting down worker {}", worker.id);
            if let Some(thread) = worker.thread.take() {
                thread.join().unwrap();
            }
        }
    }
}

struct Worker {
    id: usize,
    thread: Option<thread::JoinHandle<()>>, // Option so Drop can take it out
}

impl Worker {
    fn new(id: usize, receiver: Arc<Mutex<mpsc::Receiver<Job>>>) -> Worker {
        let thread = thread::spawn(move || loop {
            let message = receiver.lock().unwrap().recv();
            match message {
                Ok(job) => {
                    println!("Worker {id} got a job; executing.");
                    job();
                }
                Err(_) => {
                    // Sender dropped -> channel closed -> time to stop.
                    println!("Worker {id} disconnected; shutting down.");
                    break;
                }
            }
        });
        Worker { id, thread: Some(thread) }
    }
}`
        }
      ]
    }
  ],
  takeaways: [
    'TCP is the reliable byte-stream transport; HTTP is text that rides on top of it. TcpListener::bind plus incoming() gives you TcpStream connections, each closed when its stream is dropped.',
    'Parse only what the protocol tells you to: wrap the stream in a BufReader and read header lines until the first blank CRLF line, or the read will hang on a still-open connection.',
    'A response is a status line, a Content-Length header so the client knows the body size, a blank CRLF line, then the HTML body; write it with write_all (from the Write trait) on the stream.',
    'Decide the response from the request line: serve the page with 200 for the known route, otherwise serve an error page with 404 NOT FOUND, sharing one read-and-write block and only varying the status line and filename.',
    'A single thread blocks every client behind one slow request; spawning a thread per connection fixes blocking but is unbounded and can exhaust memory, so use a bounded thread pool.',
    'A thread pool is workers (each a thread looping forever), a channel of jobs, and Arc<Mutex<Receiver>> so workers safely share one receiver; execute boxes a closure into a Job and sends it.',
    'A Job is Box<dyn FnOnce() + Send + \'static>: FnOnce because it runs once, Send to move it to a worker, \'static for lifetime, and Box because each closure has a different unnameable type and size.',
    'Drop the MutexGuard before running the job (use a let binding ending in a semicolon, not while-let); holding the lock across the job serializes the whole pool back to one thread.',
    'Graceful shutdown via Drop: drop the sender FIRST so recv returns Err and workers break, THEN join each worker (take the JoinHandle out of an Option). Reverse the order and you deadlock.'
  ],
  cheatsheet: [
    { label: 'TcpListener::bind(addr)', value: 'Bind a listening socket; Result, Err if port taken' },
    { label: 'listener.incoming()', value: 'Iterator of incoming connection attempts (Result<TcpStream>)' },
    { label: 'BufReader::new(&stream)', value: 'Buffer the stream so you can read it line by line' },
    { label: '.lines().take_while(!empty)', value: 'Read header lines until the blank CRLF separator' },
    { label: 'HTTP/1.1 200 OK', value: 'Success status line; pair with the home page' },
    { label: 'HTTP/1.1 404 NOT FOUND', value: 'Resource-not-found status line; serve an error page' },
    { label: 'Content-Length: N', value: 'Header telling the client how many body bytes to read' },
    { label: 'stream.write_all(bytes)', value: 'Send the response; needs the std::io::Write trait in scope' },
    { label: 'fs::read_to_string(path)', value: 'Load HTML from disk into a String (Result)' },
    { label: 'ThreadPool::new(size)', value: 'Pre-spawn a fixed number of workers; assert size > 0' },
    { label: 'pool.execute(closure)', value: 'Box the closure into a Job and queue it for a worker' },
    { label: 'Box<dyn FnOnce()+Send+\'static>', value: 'The Job type: a runs-once, sendable, owned closure' },
    { label: 'Arc<Mutex<Receiver>>', value: 'Shared receiver so workers dequeue jobs safely' },
    { label: 'drop(sender); then join()', value: 'Graceful shutdown order: close channel, then join workers' }
  ]
}

export default note
